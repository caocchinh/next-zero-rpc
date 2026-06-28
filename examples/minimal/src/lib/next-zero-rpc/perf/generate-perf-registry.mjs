#!/usr/bin/env node
/**
 * generate-perf-registry.mjs
 *
 * Generates a performance-scaled apiRegistry.ts by driving the REAL
 * update-api-registry.mjs as a complete black box — no coupling to its internals.
 *
 * Strategy:
 *   1. Build a temporary project directory that looks like a Next.js app/api tree,
 *      populated with N synthetic route.ts files (one per generated route).
 *   2. Spawn `node update-api-registry.mjs` from that temp directory.
 *      The script scans the filesystem and writes apiRegistry.ts exactly as
 *      it would in production — same trie logic, same static types, same format.
 *   3. Copy the generated apiRegistry.ts to the perf output path.
 *
 * If update-api-registry.mjs ever changes its trie shape, traversal types, or
 * file format, this benchmark automatically picks it up on the next run.
 *
 * Usage:
 *   node generate-perf-registry.mjs [--out <path>] [--count <n>] [--seed <n>]
 *
 * Options:
 *   --out    Output file path       (default: ./generated-perf-registry.ts)
 *   --count  Number of routes       (default: 1200)
 *   --seed   RNG seed               (default: 42)
 */

import { execSync } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── CLI args ────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const getArg = (flag, fallback) => {
  const idx = args.indexOf(flag);
  return idx !== -1 ? args[idx + 1] : fallback;
};

const OUT_PATH = path.resolve(getArg("--out", path.join(__dirname, "generated-perf-registry.ts")));
const ROUTE_COUNT = parseInt(getArg("--count", "1200"), 10);
const SEED = parseInt(getArg("--seed", "42"), 10);

// Path to the real generator script (one level up from perf/)
const REAL_GENERATOR = path.resolve(__dirname, "../update-api-registry.mjs");

// ─── Seedable LCG RNG ────────────────────────────────────────────────────────
function makeLCG(seed) {
  let s = seed | 0;
  return {
    next() {
      s = Math.imul(1664525, s) + 1013904223;
      return (s >>> 0) / 4294967296;
    },
    int(min, max) {
      return Math.floor(this.next() * (max - min + 1)) + min;
    },
    pick(arr) {
      return arr[this.int(0, arr.length - 1)];
    },
    bool(p = 0.5) {
      return this.next() < p;
    },
  };
}

// ─── Route shape vocabulary ───────────────────────────────────────────────────
//
// "Complex" means: all Next.js routing patterns the real registry must handle:
//   - Flat static            /api/analytics/export
//   - Simple dynamic         /api/users/[userId]
//   - Dynamic + static child /api/users/[userId]/settings
//   - Deep nested 2-params   /api/orgs/[orgId]/teams/[teamId]
//   - Required catchall      /api/docs/[...slug]
//   - Deep required catchall /api/users/[userId]/[...path]
//   - Optional catchall      /api/pages/[[...path]]
//   - Sibling static+dynamic to stress priority logic

const NAMESPACES = [
  "users", "auth", "orgs", "teams", "projects", "tasks", "files",
  "docs", "events", "webhooks", "billing", "payments", "subscriptions",
  "analytics", "metrics", "logs", "alerts", "invites", "tokens",
  "sessions", "roles", "permissions", "settings", "notifications",
  "comments", "reviews", "tags", "labels", "attachments", "assets",
  "reports", "exports", "imports", "workflows", "pipelines", "deployments",
  "environments", "secrets", "configs", "integrations", "hooks", "queues",
  "jobs", "schedules", "bots", "apps", "extensions", "plugins",
];

const PARAMS = [
  "id", "userId", "orgId", "teamId", "projectId", "taskId", "fileId",
  "eventId", "webhookId", "invoiceId", "paymentId", "subscriptionId",
  "reportId", "exportId", "importId", "workflowId", "pipelineId",
  "deploymentId", "environmentId", "roleId", "permissionId", "sessionId",
  "integrationId", "hookId", "jobId", "scheduleId", "botId", "appId",
  "commentId", "reviewId", "tagId", "labelId", "attachmentId", "assetId",
];

const STATICS = [
  "active", "inactive", "pending", "archived", "deleted", "public", "private",
  "search", "autocomplete", "bulk", "batch", "export", "import", "preview",
  "validate", "check", "verify", "refresh", "revoke", "list", "count",
  "stats", "summary", "details", "metadata", "schema", "audit", "history",
  "subscribe", "unsubscribe", "publish", "unpublish", "approve", "reject",
  "invite", "accept", "decline", "transfer", "clone", "copy", "move",
  "lock", "unlock", "pin", "unpin", "star", "unstar", "share", "unshare",
];

const CATCHALLS = ["slug", "path", "segments", "parts", "rest", "catchall", "wildcard"];

/**
 * Returns a relative path like "users/[userId]/settings"
 * (relative to app/api/, no leading slash).
 */
function generateRelativePath(rng, index) {
  const ns = rng.pick(NAMESPACES);
  const kind = rng.int(0, 5);

  switch (kind) {
    case 0: return `${ns}/${rng.pick(STATICS)}`;
    case 1: return `${ns}/[${rng.pick(PARAMS)}]`;
    case 2: return `${ns}/[${rng.pick(PARAMS)}]/${rng.pick(STATICS)}`;
    case 3: {
      const sub = rng.pick(NAMESPACES);
      return `${ns}/[${rng.pick(PARAMS)}]/${sub}/[${rng.pick(PARAMS)}]`;
    }
    case 4: {
      const name = rng.pick(CATCHALLS);
      return rng.bool(0.4)
        ? `${ns}/[${rng.pick(PARAMS)}]/[...${name}]`
        : `${ns}/[...${name}]`;
    }
    case 5: {
      const name = rng.pick(CATCHALLS);
      return rng.bool(0.3)
        ? `${ns}/${rng.pick(NAMESPACES)}/[[...${name}]]`
        : `${ns}/[[...${name}]]`;
    }
    default:
      return `${ns}/resource-${index}`;
  }
}

function generatePaths(rng, count) {
  const seen = new Set();
  const paths = [];

  // Seed with the "real" example routes so the trie always exercises those shapes
  const seeds = [
    "status",
    "auth/login",
    "users/[userId]",
    "users/active",
    "extreme/[orgId]/projects/[projectId]/tasks/[...catchall]",
    "extreme/complex-types",
    "extreme/methods",
  ];
  for (const p of seeds) {
    if (!seen.has(p)) { seen.add(p); paths.push(p); }
  }

  let attempts = 0;
  while (paths.length < count && attempts < count * 20) {
    attempts++;
    const p = generateRelativePath(rng, paths.length);
    if (!seen.has(p)) { seen.add(p); paths.push(p); }
  }

  // Deterministic padding if we're still short
  while (paths.length < count) {
    const i = paths.length;
    const ns = NAMESPACES[i % NAMESPACES.length];
    const p = `${ns}/resource-${i}`;
    if (!seen.has(p)) { seen.add(p); paths.push(p); }
  }

  return paths;
}

// ─── Temp project scaffolding ─────────────────────────────────────────────────

/**
 * Create a minimal Next.js-style project in tempDir:
 *
 *   tempDir/
 *     src/
 *       app/api/<relative-path>/route.ts   ← one per generated route
 *       lib/next-zero-rpc/                 ← directory must exist (generator writes here)
 *
 * Each route.ts has a single `export const GET` so the scanner picks it up.
 */
function scaffoldTempProject(tempDir, relativePaths) {
  // Minimal route.ts body — just needs `export` somewhere to be scanned
  const routeBody = `export const GET = () => new Response("ok");\n`;

  for (const rel of relativePaths) {
    const routeDir = path.join(tempDir, "src", "app", "api", rel);
    fs.mkdirSync(routeDir, { recursive: true });
    fs.writeFileSync(path.join(routeDir, "route.ts"), routeBody, "utf-8");
  }

  // Ensure the output directory exists (generator won't create it)
  fs.mkdirSync(path.join(tempDir, "src", "lib", "next-zero-rpc"), { recursive: true });
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const rng = makeLCG(SEED);
const relativePaths = generatePaths(rng, ROUTE_COUNT);

console.log(`[perf-gen] Scaffolding ${relativePaths.length} synthetic routes...`);

// 1. Create temp project
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "next-zero-rpc-perf-"));
try {
  scaffoldTempProject(tempDir, relativePaths);

  // 2. Run the REAL generator from the temp project root
  //    It will scan src/app/api/, build the trie, emit the static types,
  //    and write src/lib/next-zero-rpc/apiRegistry.ts — all via its own logic.
  console.log(`[perf-gen] Running update-api-registry.mjs (the real generator)...`);
  execSync(`node "${REAL_GENERATOR}"`, {
    cwd: tempDir,
    encoding: "utf-8",
    stdio: "pipe",
  });

  // 3. Read the generated registry and copy it to the output path
  const generatedRegistry = path.join(tempDir, "src", "lib", "next-zero-rpc", "apiRegistry.ts");
  if (!fs.existsSync(generatedRegistry)) {
    throw new Error(`Generator did not produce apiRegistry.ts at ${generatedRegistry}`);
  }

  const content = fs.readFileSync(generatedRegistry, "utf-8");

  // Prepend a header so it's clear this is a perf artifact
  const header = `// AUTO-GENERATED by generate-perf-registry.mjs
// Routes: ${relativePaths.length} | Seed: ${SEED}
// Produced by the REAL update-api-registry.mjs — do not edit.
// Regenerate: node generate-perf-registry.mjs [--count N] [--seed N]

/* eslint-disable */
`;

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, header + content, "utf-8");

  const sizeKB = (fs.statSync(OUT_PATH).size / 1024).toFixed(1);
  console.log(`[perf-gen] Generated ${relativePaths.length} routes → ${OUT_PATH}`);
  console.log(`[perf-gen] File size: ${sizeKB} KB`);
} finally {
  // 4. Always clean up the temp directory
  fs.rmSync(tempDir, { recursive: true, force: true });
}
