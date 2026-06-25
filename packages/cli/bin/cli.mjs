#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.join(__dirname, "..", "templates");

const CYAN = "\x1b[36m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RED = "\x1b[31m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

function log(msg) {
  console.log(msg);
}

function success(msg) {
  console.log(`${GREEN}✓${RESET} ${msg}`);
}

function warn(msg) {
  console.log(`${YELLOW}⚠${RESET} ${msg}`);
}

function error(msg) {
  console.error(`${RED}✗${RESET} ${msg}`);
}

const HELP_TEXT = `
${BOLD}next-zero-rpc${RESET} — Type-safe fetch for Next.js

${BOLD}Usage:${RESET}
  npx next-zero-rpc               Install files into your Next.js project
  npx next-zero-rpc --force        Overwrite existing files
  npx next-zero-rpc --help         Show this help message

${BOLD}What it does:${RESET}
  Copies 4 files into ${CYAN}lib/next-zero-rpc/${RESET} (or ${CYAN}src/lib/next-zero-rpc/${RESET} if src/ exists):
    • apiClient.ts         — Type-safe fetch wrapper (1.8 KB runtime)
    • apiRegistry.ts       — Auto-generated route type registry
    • responses.ts         — Error/success response helpers
    • update-api-registry.mjs — Code generator + Next.js plugin

  Also registers ${CYAN}next-zero-rpc-ts-plugin${RESET} in your tsconfig.json:
    • Ctrl+Click on ${CYAN}apiFetch("/api/users/34")${RESET} → opens the matching route.ts
    • Hover tooltip shows which route.ts file will handle the request

${DIM}Zero dependencies. Zero runtime overhead. Full type safety.${RESET}
`;


function detectProjectRoot() {
  const cwd = process.cwd();

  // Check for Next.js indicators
  const hasPackageJson = fs.existsSync(path.join(cwd, "package.json"));
  if (!hasPackageJson) {
    error("No package.json found. Run this from your Next.js project root.");
    process.exit(1);
  }

  const packageJson = JSON.parse(fs.readFileSync(path.join(cwd, "package.json"), "utf-8"));
  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  if (!allDeps.next) {
    error("This doesn't appear to be a Next.js project (no 'next' in dependencies).");
    process.exit(1);
  }

  // Detect src directory — works with or without it
  const hasSrc = fs.existsSync(path.join(cwd, "src"));

  return { root: cwd, hasSrc };
}

async function init(flags) {
  const force = flags.includes("--force");

  log("");
  log(`${BOLD}${CYAN}next-zero-rpc${RESET} ${DIM}v${getVersion()}${RESET}`);
  log("");

  const { root, hasSrc } = detectProjectRoot();
  const baseDir = hasSrc ? "src" : ".";
  const targetDir = path.join(root, baseDir, "lib", "next-zero-rpc");
  const configImportPrefix = hasSrc ? "./src" : ".";

  log(`${DIM}Detected project layout: ${hasSrc ? "src/" : "root (no src/)"} ${RESET}`);
  log("");

  // Create target directory
  fs.mkdirSync(targetDir, { recursive: true });

  const files = ["apiClient.ts", "apiRegistry.ts", "responses.ts", "update-api-registry.mjs"];

  let skipped = 0;
  let written = 0;

  for (const file of files) {
    const src = path.join(TEMPLATES_DIR, file);
    const dest = path.join(targetDir, file);

    if (fs.existsSync(dest) && !force) {
      warn(`${file} already exists ${DIM}(use --force to overwrite)${RESET}`);
      skipped++;
      continue;
    }

    fs.copyFileSync(src, dest);
    success(`${file}`);
    written++;
  }

  // Run update-api-registry once to populate the registry with existing routes
  try {
    const registryScript = path.join(targetDir, "update-api-registry.mjs");
    const { updateApiRegistry } = await import(registryScript);
    updateApiRegistry();
    success("API registry updated");
  } catch (e) {
    warn(`Could not auto-update registry: ${e.message}`);
  }

  // Add "infer-api" script to package.json (safely, no overwrite)
  try {
    const pkgPath = path.join(root, "package.json");
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    const scriptCmd = `node ${baseDir === "." ? "" : baseDir + "/"}lib/next-zero-rpc/update-api-registry.mjs`;

    if (!pkg.scripts) pkg.scripts = {};

    if (pkg.scripts["infer-api"]) {
      log(`${DIM}infer-api script already exists in package.json${RESET}`);
    } else {
      pkg.scripts["infer-api"] = scriptCmd;
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf-8");
      success(`Added ${BOLD}"infer-api"${RESET}${GREEN} script to package.json${RESET}`);
    }
  } catch (e) {
    warn(`Could not update package.json: ${e.message}`);
  }

  // Patch tsconfig.json to register the TS Language Service Plugin
  // This enables Ctrl+Click on apiFetch route strings to jump to route.ts
  try {
    const tsconfigPath = path.join(root, "tsconfig.json");
    if (fs.existsSync(tsconfigPath)) {
      const raw = fs.readFileSync(tsconfigPath, "utf-8");
      // Strip JS-style comments before parsing (tsconfig allows comments, JSON.parse does not)
      const stripped = raw.replace(/\/\/[^\n]*/g, "").replace(/\/\*[\s\S]*?\*\//g, "");
      const tsconfig = JSON.parse(stripped);

      if (!tsconfig.compilerOptions) tsconfig.compilerOptions = {};
      if (!tsconfig.compilerOptions.plugins) tsconfig.compilerOptions.plugins = [];

      const plugins = tsconfig.compilerOptions.plugins;
      const alreadyRegistered = plugins.some(
        (p) => p.name === "next-zero-rpc-ts-plugin",
      );

      if (alreadyRegistered) {
        log(`${DIM}next-zero-rpc-ts-plugin already registered in tsconfig.json${RESET}`);
      } else {
        plugins.push({ name: "next-zero-rpc-ts-plugin" });
        // Write back preserving the structure (without stripping comments from the real file)
        // We re-parse from the original to be safe, just injecting the plugin entry
        const updatedRaw = raw.replace(
          /"plugins"\s*:\s*\[/,
          `"plugins": [\n      { "name": "next-zero-rpc-ts-plugin" },`,
        );
        // If no plugins array exists, we add one before the closing brace of compilerOptions
        const finalContent = updatedRaw === raw
          ? raw.replace(
              /"compilerOptions"\s*:\s*\{/,
              `"compilerOptions": {\n    "plugins": [{ "name": "next-zero-rpc-ts-plugin" }],`,
            )
          : updatedRaw;

        fs.writeFileSync(tsconfigPath, finalContent, "utf-8");
        success(`Registered ${BOLD}next-zero-rpc-ts-plugin${RESET}${GREEN} in tsconfig.json ${DIM}(Ctrl+Click → route.ts)${RESET}`);
      }
    }
  } catch (e) {
    warn(`Could not patch tsconfig.json: ${e.message}`);
  }

  log("");

  if (written === 0 && skipped > 0) {
    log(`${DIM}All files already exist. Use ${YELLOW}--force${RESET}${DIM} to overwrite.${RESET}`);
    log("");
    return;
  }

  // Print next steps
  log(`${BOLD}Next steps:${RESET}`);
  log("");
  log(`  ${CYAN}1.${RESET} Update your ${BOLD}next.config.ts${RESET}:`);
  log("");
  log(
    `     ${DIM}import { withApiRegistry } from "${configImportPrefix}/lib/next-zero-rpc/update-api-registry.mjs";${RESET}`,
  );
  log(`     ${DIM}export default withApiRegistry(nextConfig);${RESET}`);
  log("");
  log(`  ${CYAN}2.${RESET} Use ${BOLD}apiFetch${RESET} in your client components:`);
  log("");
  log(`     ${DIM}import { apiFetch } from "@/lib/next-zero-rpc/apiClient";${RESET}`);
  log("");
  log(
    `     ${DIM}const [data, err] = await apiFetch("/api/users/123", { method: "GET" });${RESET}`,
  );
  log("");
  log(
    `  ${CYAN}3.${RESET} Use ${BOLD}createApiSuccess${RESET} / ${BOLD}createApiError${RESET} in your route handlers:`,
  );
  log("");
  log(
    `     ${DIM}import { createApiSuccess, createApiError } from "@/lib/next-zero-rpc/responses";${RESET}`,
  );
  log("");
  log(`${DIM}The registry auto-updates when you create/delete route.ts files.${RESET}`);
  log(`${DIM}Ctrl+Click any route string in apiFetch() to jump to the route.ts handler.${RESET}`);
  log("");
}

function getVersion() {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf-8"));
    return pkg.version;
  } catch {
    return "0.0.0";
  }
}

// --- CLI Entry ---
const args = process.argv.slice(2);
const command = args[0];

if (command === "--help" || command === "-h") {
  log(HELP_TEXT);
  process.exit(0);
}

// Default: run init (with or without "init" subcommand)
if (!command || command === "init") {
  init(args.slice(command === "init" ? 1 : 0));
} else if (command === "--force") {
  // Allow: npx next-zero-rpc --force
  init(args);
} else {
  error(`Unknown command: ${command}`);
  log(`Run ${CYAN}npx next-zero-rpc --help${RESET} for usage.`);
  process.exit(1);
}
