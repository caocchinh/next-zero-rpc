#!/usr/bin/env node
/**
 * run-ts-perf.mjs
 *
 * TypeScript performance benchmark for apiRegistry implementations.
 *
 * What it measures (via `tsc --extendedDiagnostics`):
 *   - Total check time (wall-clock ms)
 *   - Type instantiations count
 *   - Symbol count
 *   - Types count
 *   - Memory used (heap after GC)
 *
 * Additionally runs `tsc --generateTrace` and emits the trace dir path
 * so you can open it in chrome://tracing or Perfetto for visual analysis.
 *
 * Usage:
 *   node run-ts-perf.mjs [options]
 *
 * Options:
 *   --impl  <path>   Path to an alternate apiRegistry.ts to benchmark
 *                    (default: generates a fresh synthetic registry)
 *   --count <n>      Number of routes to generate (default: 1200)
 *   --seed  <n>      RNG seed for reproducibility (default: 42)
 *   --runs  <n>      Number of tsc benchmark runs to average (default: 3)
 *   --trace          Also run tsc --generateTrace (slower but deep analysis)
 *   --no-gen         Skip generation, use existing generated-perf-registry.ts
 *   --out   <path>   Output directory for traces and reports
 *
 * Examples:
 *   # Benchmark the default implementation with 1200 routes, 3 runs
 *   node run-ts-perf.mjs
 *
 *   # Benchmark an alternative implementation
 *   node run-ts-perf.mjs --impl ./my-alt-registry.ts
 *
 *   # Generate 2000 routes and trace
 *   node run-ts-perf.mjs --count 2000 --trace
 */

import { execSync, spawnSync } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PERF_DIR = __dirname;
// perf/ is at: examples/minimal/src/lib/next-zero-rpc/perf/
// node_modules/.bin/tsc is at: examples/minimal/node_modules/.bin/tsc
const PROJECT_DIR = path.resolve(__dirname, "../../../../../..");

// ─── CLI args ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const getArg = (flag, fallback) => {
  const idx = args.indexOf(flag);
  return idx !== -1 ? args[idx + 1] : fallback;
};
const hasFlag = (flag) => args.includes(flag);

const IMPL_PATH = getArg("--impl", null);
const ROUTE_COUNT = getArg("--count", "1200");
const SEED = getArg("--seed", "42");
const RUNS = parseInt(getArg("--runs", "3"), 10);
const ENABLE_TRACE = hasFlag("--trace");
const SKIP_GEN = hasFlag("--no-gen");
const OUT_DIR = path.resolve(getArg("--out", path.join(PERF_DIR, "reports")));

const GENERATED_REGISTRY = path.join(PERF_DIR, "generated-perf-registry.ts");
const PROBE_FILE = path.join(PERF_DIR, "perf-probe.ts");
const TSCONFIG_PERF = path.join(PERF_DIR, "tsconfig.perf.json");

// ─── Terminal colors ─────────────────────────────────────────────────────────
const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  red: "\x1b[31m",
  magenta: "\x1b[35m",
  blue: "\x1b[34m",
  white: "\x1b[37m",
};
const bold = (s) => `${c.bold}${s}${c.reset}`;
const dim = (s) => `${c.dim}${s}${c.reset}`;
const green = (s) => `${c.green}${s}${c.reset}`;
const yellow = (s) => `${c.yellow}${s}${c.reset}`;
const cyan = (s) => `${c.cyan}${s}${c.reset}`;
const red = (s) => `${c.red}${s}${c.reset}`;
const magenta = (s) => `${c.magenta}${s}${c.reset}`;

// ─── Helpers ─────────────────────────────────────────────────────────────────
function hr(char = "─", width = 72) {
  return char.repeat(width);
}

function fmt(n, unit = "") {
  if (n === null || n === undefined) return dim("N/A");
  if (typeof n === "number") {
    return bold(n.toLocaleString("en-US")) + (unit ? ` ${dim(unit)}` : "");
  }
  return String(n);
}

function fmtMs(ms) {
  if (ms === null) return dim("N/A");
  const color = ms > 10000 ? red : ms > 5000 ? yellow : green;
  return color(bold(`${ms.toFixed(0)} ms`));
}

function fmtMB(mb) {
  if (mb === null) return dim("N/A");
  const color = mb > 500 ? red : mb > 200 ? yellow : green;
  return color(bold(`${mb.toFixed(1)} MB`));
}

/**
 * Parse `tsc --extendedDiagnostics` output into a structured object.
 * The output looks like:
 *   Files:                        42
 *   Lines:                     12345
 *   Identifiers:               23456
 *   Symbols:                   34567
 *   Types:                     45678
 *   Instantiations:           123456
 *   Memory used:              128 MB
 *   I/O read time:             0.12s
 *   Parse time:                0.34s
 *   ResolveModule time:        0.01s
 *   ResolveTypeReference:      0.00s
 *   Bind time:                 0.45s
 *   Check time:                3.45s
 *   printTime time:            0.00s
 *   Emit time:                 0.00s
 *   Total time:                4.27s
 */
function parseDiagnostics(output) {
  const result = {};

  const matchers = [
    { key: "files",           re: /^Files:\s+(\d+)/m },
    { key: "lines",           re: /^Lines(?:\s+of\s+library)?:\s+([\d,]+)/im },
    { key: "identifiers",     re: /^Identifiers:\s+([\d,]+)/im },
    { key: "symbols",         re: /^Symbols:\s+([\d,]+)/im },
    { key: "types",           re: /^Types:\s+([\d,]+)/im },
    { key: "instantiations",  re: /^Instantiations:\s+([\d,]+)/im },
    { key: "memoryMB",        re: /^Memory used:\s+([\d,.]+)K/im },
    { key: "parseTimeMs",     re: /^Parse time:\s+([\d.]+)s/im },
    { key: "bindTimeMs",      re: /^Bind time:\s+([\d.]+)s/im },
    { key: "checkTimeMs",     re: /^Check time:\s+([\d.]+)s/im },
    { key: "totalTimeMs",     re: /^Total time:\s+([\d.]+)s/im },
  ];

  for (const { key, re } of matchers) {
    const m = output.match(re);
    if (m) {
      const raw = m[1].replace(/,/g, "");
      result[key] = parseFloat(raw);
      // Convert KB to MB for memory, convert seconds to ms for time fields
      if (key === "memoryMB") result[key] = result[key] / 1024;
      else if (key.endsWith("TimeMs")) result[key] = result[key] * 1000;
    } else {
      result[key] = null;
    }
  }

  return result;
}

/** Find the tsc binary — prefer local node_modules, fall back to global. */
function findTsc() {
  const localTsc = path.join(PROJECT_DIR, "node_modules/.bin/tsc");
  if (fs.existsSync(localTsc)) return localTsc;
  // Fallback to system tsc
  return "tsc";
}

/** Run a single tsc --extendedDiagnostics pass and return parsed metrics. */
function runTscDiag(tsconfigPath) {
  const tscBin = findTsc();
  const cmd = `"${tscBin}" --project "${tsconfigPath}" --noEmit --extendedDiagnostics 2>&1`;
  const start = Date.now();
  let output = "";
  try {
    output = execSync(cmd, { encoding: "utf-8", stdio: "pipe" });
  } catch (e) {
    // tsc exits non-zero when there are type errors, but diagnostics are still printed
    output = (e.stdout || "") + (e.stderr || "");
  }
  const wallMs = Date.now() - start;
  const parsed = parseDiagnostics(output);
  parsed.wallMs = wallMs;
  parsed.rawOutput = output;
  return parsed;
}

/** Run tsc --generateTrace and return the trace directory path. */
function runTscTrace(tsconfigPath, traceDir) {
  const tscBin = findTsc();
  fs.mkdirSync(traceDir, { recursive: true });
  const cmd = `"${tscBin}" --project "${tsconfigPath}" --noEmit --generateTrace "${traceDir}" 2>&1`;
  console.log(dim(`  $ ${cmd.replace(PROJECT_DIR, ".")}`));
  try {
    execSync(cmd, { encoding: "utf-8", stdio: "pipe" });
  } catch (e) {
    // ignore tsc type errors
  }
  return traceDir;
}

// ─── tsconfig.perf.json ───────────────────────────────────────────────────────
function writePerfTsconfig(targetFile) {
  const tsconfig = {
    compilerOptions: {
      target: "ES2017",
      module: "esnext",
      moduleResolution: "bundler",
      strict: true,
      noEmit: true,
      skipLibCheck: true,
      incremental: false,  // force full typecheck every run
    },
    include: [targetFile, PROBE_FILE],
    exclude: ["node_modules"],
  };
  fs.writeFileSync(TSCONFIG_PERF, JSON.stringify(tsconfig, null, 2), "utf-8");
}

// ─── Probe file ───────────────────────────────────────────────────────────────
//
// The probe exercises FindMatchingRoute and CheckPath with a variety of
// path shapes to force the type engine to actually instantiate the types.
// Without this, a smart compiler might skip checking unused types.
//
function writeProbeFile(registryPath) {
  const rel = path.relative(PERF_DIR, registryPath).replace(/\\/g, "/").replace(/\.ts$/, "");
  const content = `
// AUTO-GENERATED probe — exercises the type system with diverse paths.
// Import the registry under test.
import type { FindMatchingRoute, CheckPath, KnownRoutes } from "./${rel}";

// ── Type-level assertions ─────────────────────────────────────────────────────
// We use a conditional expression to force type evaluation without assertType
// (which requires vitest). If a type resolves incorrectly, TS will still
// evaluate it — the goal is instantiation count, not correctness here.

type _Assert<T, _U = T> = T;

// Exercise static exact matches (fast path: O(1) key lookup)
type P1  = _Assert<FindMatchingRoute<"/api/status">>;
type P2  = _Assert<FindMatchingRoute<"/api/auth/login">>;
type P3  = _Assert<FindMatchingRoute<"/api/users/active">>;

// Exercise dynamic matches (trie walk)
type P4  = _Assert<FindMatchingRoute<"/api/users/u-42">>;
type P5  = _Assert<FindMatchingRoute<"/api/users/u-1000">>;

// Exercise deep nested dynamic routes
type P6  = _Assert<FindMatchingRoute<"/api/extreme/acme/projects/p-1/tasks/step1/step2/step3">>;
type P7  = _Assert<FindMatchingRoute<"/api/extreme/acme/projects/p-2/tasks/a/b/c/d">>;

// Exercise unknown paths (should resolve to never or keyof KnownRoutes)
type P8  = _Assert<FindMatchingRoute<"/api/does-not-exist">>;
type P9  = _Assert<FindMatchingRoute<"/api/users/active/extra-segment">>;

// Exercise query string stripping
type P10 = _Assert<FindMatchingRoute<"/api/status?v=2">>;
type P11 = _Assert<FindMatchingRoute<"/api/users/u-99?include=avatar&version=2">>;

// Exercise CheckPath (the autocomplete type)
type C1  = _Assert<CheckPath<"">>;
type C2  = _Assert<CheckPath<"/">>;
type C3  = _Assert<CheckPath<"/api">>;
type C4  = _Assert<CheckPath<"/api/status">>;
type C5  = _Assert<CheckPath<"/api/auth/login">>;
type C6  = _Assert<CheckPath<"/api/users/u-42">>;
type C7  = _Assert<CheckPath<"/api/not-real">>;
type C8  = _Assert<CheckPath<"/api/extreme/acme/projects/p-1/tasks/step1">>;

// Exercise KnownRoutes union (materializes the full route union type)
type AllRoutes = keyof KnownRoutes;
type RouteCount = _Assert<AllRoutes>;

// Stress: force evaluation of many paths simultaneously
type StressMatrix = {
  [K in keyof KnownRoutes]: FindMatchingRoute<K>;
};

// Runtime no-op to prevent tree-shaking
export const _probe = undefined;
`;
  fs.writeFileSync(PROBE_FILE, content, "utf-8");
}

// ─── Statistics ───────────────────────────────────────────────────────────────
function avg(arr) {
  const valid = arr.filter((v) => v !== null && !isNaN(v));
  return valid.length ? valid.reduce((a, b) => a + b, 0) / valid.length : null;
}
function min(arr) {
  const valid = arr.filter((v) => v !== null && !isNaN(v));
  return valid.length ? Math.min(...valid) : null;
}
function max(arr) {
  const valid = arr.filter((v) => v !== null && !isNaN(v));
  return valid.length ? Math.max(...valid) : null;
}

// ─── Report printer ───────────────────────────────────────────────────────────
function printReport(label, runs, routeCount, traceDir) {
  const metrics = [
    "wallMs", "totalTimeMs", "checkTimeMs", "parseTimeMs", "bindTimeMs",
    "instantiations", "types", "symbols", "identifiers", "files", "memoryMB",
  ];

  const stats = {};
  for (const m of metrics) {
    const vals = runs.map((r) => r[m]);
    stats[m] = { avg: avg(vals), min: min(vals), max: max(vals) };
  }

  console.log("");
  console.log(bold(cyan("╔" + "═".repeat(70) + "╗")));
  console.log(bold(cyan("║")) + bold(`  TypeScript Performance Benchmark — ${label}`.padEnd(69)) + bold(cyan("║")));
  console.log(bold(cyan("╚" + "═".repeat(70) + "╝")));
  console.log("");
  console.log(`  ${dim("Routes")}     ${bold(routeCount.toLocaleString())}`);
  console.log(`  ${dim("Runs")}       ${bold(RUNS)}`);
  console.log(`  ${dim("Impl")}       ${dim(IMPL_PATH ?? "generated-perf-registry.ts")}`);
  console.log("");
  console.log(bold("  Timing"));
  console.log(hr("─", 72));
  console.log(`  ${"Wall time".padEnd(20)} avg: ${fmtMs(stats.wallMs.avg).padEnd(20)} min: ${fmtMs(stats.wallMs.min).padEnd(20)} max: ${fmtMs(stats.wallMs.max)}`);
  console.log(`  ${"tsc total time".padEnd(20)} avg: ${fmtMs(stats.totalTimeMs.avg).padEnd(20)} min: ${fmtMs(stats.totalTimeMs.min).padEnd(20)} max: ${fmtMs(stats.totalTimeMs.max)}`);
  console.log(`  ${"Check time".padEnd(20)} avg: ${fmtMs(stats.checkTimeMs.avg).padEnd(20)} min: ${fmtMs(stats.checkTimeMs.min).padEnd(20)} max: ${fmtMs(stats.checkTimeMs.max)}`);
  console.log(`  ${"Parse time".padEnd(20)} avg: ${fmtMs(stats.parseTimeMs.avg).padEnd(20)} min: ${fmtMs(stats.parseTimeMs.min).padEnd(20)} max: ${fmtMs(stats.parseTimeMs.max)}`);
  console.log(`  ${"Bind time".padEnd(20)} avg: ${fmtMs(stats.bindTimeMs.avg).padEnd(20)} min: ${fmtMs(stats.bindTimeMs.min).padEnd(20)} max: ${fmtMs(stats.bindTimeMs.max)}`);
  console.log("");
  console.log(bold("  Type System"));
  console.log(hr("─", 72));
  console.log(`  ${"Instantiations".padEnd(20)} avg: ${fmt(stats.instantiations.avg?.toFixed(0)).padEnd(20)} min: ${fmt(stats.instantiations.min).padEnd(20)} max: ${fmt(stats.instantiations.max)}`);
  console.log(`  ${"Types".padEnd(20)} avg: ${fmt(stats.types.avg?.toFixed(0)).padEnd(20)} min: ${fmt(stats.types.min).padEnd(20)} max: ${fmt(stats.types.max)}`);
  console.log(`  ${"Symbols".padEnd(20)} avg: ${fmt(stats.symbols.avg?.toFixed(0)).padEnd(20)} min: ${fmt(stats.symbols.min).padEnd(20)} max: ${fmt(stats.symbols.max)}`);
  console.log(`  ${"Identifiers".padEnd(20)} avg: ${fmt(stats.identifiers.avg?.toFixed(0)).padEnd(20)} min: ${fmt(stats.identifiers.min).padEnd(20)} max: ${fmt(stats.identifiers.max)}`);
  console.log(`  ${"Files".padEnd(20)} avg: ${fmt(stats.files.avg?.toFixed(0)).padEnd(20)} min: ${fmt(stats.files.min).padEnd(20)} max: ${fmt(stats.files.max)}`);
  console.log("");
  console.log(bold("  Memory"));
  console.log(hr("─", 72));
  console.log(`  ${"Heap used".padEnd(20)} avg: ${fmtMB(stats.memoryMB.avg).padEnd(20)} min: ${fmtMB(stats.memoryMB.min).padEnd(20)} max: ${fmtMB(stats.memoryMB.max)}`);

  if (traceDir) {
    console.log("");
    console.log(bold("  Trace"));
    console.log(hr("─", 72));
    console.log(`  ${dim("Dir")}        ${cyan(traceDir)}`);
    console.log(`  ${dim("Open in")}    chrome://tracing  or  https://ui.perfetto.dev`);
    const traceFile = path.join(traceDir, "trace.json");
    if (fs.existsSync(traceFile)) {
      const size = fs.statSync(traceFile).size;
      console.log(`  ${dim("Trace size")} ${(size / 1024).toFixed(1)} KB`);
    }
  }

  console.log("");

  // ── JSON report ─────────────────────────────────────────────────────────
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const reportPath = path.join(OUT_DIR, `perf-report-${Date.now()}.json`);
  const report = {
    label,
    timestamp: new Date().toISOString(),
    routeCount,
    runs: RUNS,
    impl: IMPL_PATH ?? "generated-perf-registry.ts",
    stats: Object.fromEntries(
      Object.entries(stats).map(([k, v]) => [k, {
        avg: v.avg !== null ? parseFloat(v.avg.toFixed(2)) : null,
        min: v.min,
        max: v.max,
      }])
    ),
    raw: runs,
  };
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf-8");
  console.log(`  ${dim("JSON report")} ${dim(reportPath)}`);
  console.log("");

  return stats;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("");
  console.log(bold(magenta("  next-zero-rpc · TypeScript Performance Benchmark")));
  console.log(dim("  Measures tsc type-check cost for large apiRegistry implementations"));
  console.log("");

  // 1. Determine the registry file to benchmark
  let registryPath;
  if (IMPL_PATH) {
    registryPath = path.resolve(IMPL_PATH);
    if (!fs.existsSync(registryPath)) {
      console.error(red(`  ERROR: --impl path not found: ${registryPath}`));
      process.exit(1);
    }
    console.log(`  ${dim("Mode")}    Using custom implementation: ${cyan(registryPath)}`);
  } else {
    registryPath = GENERATED_REGISTRY;
    if (!SKIP_GEN) {
      console.log(`  ${dim("Mode")}    Generating synthetic registry with ${bold(ROUTE_COUNT)} routes...`);
      const genScript = path.join(PERF_DIR, "generate-perf-registry.mjs");
      const result = spawnSync("node", [
        genScript,
        "--out", registryPath,
        "--count", ROUTE_COUNT,
        "--seed", SEED,
      ], { encoding: "utf-8", stdio: "inherit" });
      if (result.status !== 0) {
        console.error(red("  ERROR: generation failed"));
        process.exit(1);
      }
    } else {
      if (!fs.existsSync(registryPath)) {
        console.error(red(`  ERROR: --no-gen specified but ${registryPath} does not exist`));
        process.exit(1);
      }
      console.log(`  ${dim("Mode")}    Using existing registry: ${cyan(registryPath)}`);
    }
  }

  // Count actual routes in the file
  const content = fs.readFileSync(registryPath, "utf-8");
  const routeCount = (content.match(/"\/api\//g) || []).length;
  console.log(`  ${dim("Routes")}  Detected ~${bold(routeCount)} route entries`);

  // 2. Write tsconfig and probe file
  writePerfTsconfig(registryPath);
  writeProbeFile(registryPath);
  console.log(`  ${dim("Probe")}   Written perf-probe.ts`);
  console.log(`  ${dim("Config")}  Written tsconfig.perf.json`);
  console.log("");

  // 3. Warm-up run (not counted)
  console.log(dim(`  Warming up (1 run, discarded)...`));
  runTscDiag(TSCONFIG_PERF);

  // 4. Benchmark runs
  console.log(bold(`  Running ${RUNS} benchmark passes...`));
  const runResults = [];
  for (let i = 0; i < RUNS; i++) {
    process.stdout.write(`  Run ${i + 1}/${RUNS}  `);
    const result = runTscDiag(TSCONFIG_PERF);
    const wallDisplay = result.wallMs ? `${result.wallMs}ms` : "?";
    const checkDisplay = result.checkTimeMs ? `check=${result.checkTimeMs.toFixed(0)}ms` : "";
    const instDisplay = result.instantiations ? `inst=${result.instantiations.toLocaleString()}` : "";
    console.log(dim(`wall=${wallDisplay}  ${checkDisplay}  ${instDisplay}`));
    runResults.push(result);
  }

  // 5. Print report
  const label = IMPL_PATH
    ? path.basename(IMPL_PATH)
    : `generated (${routeCount} routes, seed=${SEED})`;
  printReport(label, runResults, routeCount, null);

  // 6. Trace (optional)
  if (ENABLE_TRACE) {
    console.log(bold(`  Running tsc --generateTrace...`));
    const traceDir = path.join(OUT_DIR, `trace-${Date.now()}`);
    runTscTrace(TSCONFIG_PERF, traceDir);
    console.log(`  Trace saved to: ${cyan(traceDir)}`);
    console.log(`  Open: ${dim("https://ui.perfetto.dev")} → Load file → select ${dim("trace.json")}`);
    console.log("");
  }

  // 7. Print thresholds / grading
  const lastRun = runResults[runResults.length - 1];
  const checkAvg = avg(runResults.map((r) => r.checkTimeMs));
  const instAvg = avg(runResults.map((r) => r.instantiations));

  console.log(bold("  Performance Grade"));
  console.log(hr("─", 72));

  function grade(label, value, thresholds) {
    // thresholds: { good, warn, bad }
    const symbol = value === null
      ? dim("?  ")
      : value < thresholds.good
        ? green("✓  ")
        : value < thresholds.warn
          ? yellow("~  ")
          : red("✗  ");
    const valueStr = value !== null ? value.toFixed(0) : "N/A";
    const status = value === null
      ? dim("no data")
      : value < thresholds.good
        ? green("GOOD")
        : value < thresholds.warn
          ? yellow("WARN — consider optimizing")
          : red("SLOW — optimization needed");
    console.log(`  ${symbol}${label.padEnd(22)} ${valueStr.padStart(10)}  → ${status}`);
  }

  grade("Check time (ms)", checkAvg,         { good: 3000, warn: 8000, bad: 15000 });
  grade("Instantiations",  instAvg,           { good: 200000, warn: 1000000, bad: 5000000 });
  grade("Memory (MB)",     avg(runResults.map((r) => r.memoryMB)), { good: 150, warn: 400, bad: 800 });
  console.log("");
}

main().catch((e) => {
  console.error(red("Fatal error:"), e);
  process.exit(1);
});
