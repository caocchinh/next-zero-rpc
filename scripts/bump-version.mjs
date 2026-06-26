#!/usr/bin/env node
/**
 * bump-version.mjs
 * Usage:
 *   node scripts/bump-version.mjs patch   → 0.1.9 → 0.1.10
 *   node scripts/bump-version.mjs minor   → 0.1.9 → 0.2.0
 *   node scripts/bump-version.mjs major   → 0.1.9 → 1.0.0
 *   node scripts/bump-version.mjs 1.2.3   → any explicit version
 */

import { readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// ─── Files to update ────────────────────────────────────────────────────────

const FILES = [
  {
    path: resolve(root, "package.json"),
    label: "package.json",
    update: (content, next) =>
      content.replace(/"version": "\d+\.\d+\.\d+"/, `"version": "${next}"`),
  },
  {
    path: resolve(root, "packages/cli/package.json"),
    label: "packages/cli/package.json",
    update: (content, next) =>
      content.replace(/"version": "\d+\.\d+\.\d+"/, `"version": "${next}"`),
  },
  {
    path: resolve(root, "src/app/page.tsx"),
    label: "src/app/page.tsx",
    update: (content, next) => content.replace(/v\d+\.\d+\.\d+/, `v${next}`),
  },
  {
    path: resolve(root, "packages/cli/templates/responses.ts"),
    label: "packages/cli/templates/responses.ts",
    update: (content, next) =>
      content.replace(/next-zero-rpc — .+? v\d+\.\d+\.\d+/, (m) =>
        m.replace(/v\d+\.\d+\.\d+/, `v${next}`),
      ),
  },
];

// ─── Version logic ───────────────────────────────────────────────────────────

function bumpVersion(current, type) {
  const [major, minor, patch] = current.split(".").map(Number);
  switch (type) {
    case "major":
      return `${major + 1}.0.0`;
    case "minor":
      return `${major}.${minor + 1}.0`;
    case "patch":
      return `${major}.${minor}.${patch + 1}`;
    default:
      if (/^\d+\.\d+\.\d+$/.test(type)) return type;
      throw new Error(`Invalid bump type or version: "${type}". Use patch | minor | major | x.y.z`);
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

const type = process.argv[2];
if (!type) {
  console.error("Usage: node scripts/bump-version.mjs <patch|minor|major|x.y.z>");
  process.exit(1);
}

// Read current version from root package.json
const rootPkg = JSON.parse(readFileSync(FILES[0].path, "utf8"));
const current = rootPkg.version;
const next = bumpVersion(current, type);

console.log(`\nBumping version: ${current} → ${next}\n`);

for (const file of FILES) {
  const before = readFileSync(file.path, "utf8");
  const after = file.update(before, next);

  if (before === after) {
    console.log(`  ⚠️  ${file.label} — no match found, skipped`);
  } else {
    writeFileSync(file.path, after, "utf8");
    console.log(`  ✅  ${file.label}`);
  }
}

console.log(`\nDone! New version: ${next}\n`);
