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
  npx next-zero-rpc init         Install files into your Next.js project
  npx next-zero-rpc init --force Overwrite existing files
  npx next-zero-rpc --help       Show this help message

${BOLD}What it does:${RESET}
  Copies 4 files into ${CYAN}src/lib/next-zero-rpc/${RESET}:
    • apiClient.ts         — Type-safe fetch wrapper (2 KB runtime)
    • apiRegistry.ts       — Auto-generated route type registry
    • responses.ts         — Error/success response helpers
    • update-api-registry.mjs — Code generator + Next.js plugin

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

  // Detect src directory
  const hasSrc = fs.existsSync(path.join(cwd, "src"));
  if (!hasSrc) {
    error("Expected a 'src/' directory. next-zero-rpc requires the src/ directory convention.");
    process.exit(1);
  }

  return cwd;
}

function init(flags) {
  const force = flags.includes("--force");

  log("");
  log(`${BOLD}${CYAN}next-zero-rpc${RESET} ${DIM}v${getVersion()}${RESET}`);
  log("");

  const root = detectProjectRoot();
  const targetDir = path.join(root, "src", "lib", "next-zero-rpc");

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
    `     ${DIM}import { withApiRegistry } from "./src/lib/next-zero-rpc/update-api-registry.mjs";${RESET}`,
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

if (!command || command === "--help" || command === "-h") {
  log(HELP_TEXT);
  process.exit(0);
}

if (command === "init") {
  init(args.slice(1));
} else {
  error(`Unknown command: ${command}`);
  log(`Run ${CYAN}npx next-zero-rpc --help${RESET} for usage.`);
  process.exit(1);
}
