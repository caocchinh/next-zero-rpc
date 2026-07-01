import fs from "fs";
import path from "path";

function detectBaseDir() {
  const cwd = process.cwd();
  return fs.existsSync(path.join(cwd, "src")) ? "src" : ".";
}

const BASE_DIR = detectBaseDir();
const API_DIR = path.join(process.cwd(), BASE_DIR, "app/api");
const REGISTRY_FILE = path.join(
  process.cwd(),
  BASE_DIR,
  "lib/next-zero-rpc/apiRegistry.ts",
);


function getRouteFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    if (entry.isDirectory()) {
      getRouteFiles(path.join(dir, entry.name), fileList);
    } else if (entry.name === "route.ts") {
      fileList.push(path.join(dir, entry.name));
    }
  }
  return fileList;
}

// ─── Trie builder ─────────────────────────────────────────────────────────────

function buildTrie(routes) {
  const root = { children: new Map(), terminal: null };
  for (let i = 0; i < routes.length; i++) {
    const segments = routes[i].split("/");
    let node = root;
    for (let j = 0; j < segments.length; j++) {
      const seg = segments[j];
      if (!node.children.has(seg)) {
        node.children.set(seg, { children: new Map(), terminal: null });
      }
      node = node.children.get(seg);
    }
    node.terminal = routes[i];
  }
  return root;
}

function emitTrieType(node, depth) {
  const indent = "  ".repeat(depth + 1);
  const parts = [];
  if (node.terminal !== null) {
    parts.push(`${indent}"__terminal__": "${node.terminal}"`);
  }
  for (const [seg, child] of node.children) {
    const key = JSON.stringify(seg);
    const childBody = emitTrieType(child, depth + 1);
    if (childBody === "") {
      parts.push(`${indent}${key}: {}`);
    } else {
      parts.push(
        `${indent}${key}: {\n${childBody}\n${"  ".repeat(depth + 1)}}`,
      );
    }
  }
  return parts.join(";\n");
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function updateApiRegistry() {
  const routeFiles = getRouteFiles(API_DIR);

  const routes = [];

  for (let i = 0; i < routeFiles.length; i++) {
    const filePath = routeFiles[i];
    const fileContent = fs.readFileSync(filePath, "utf-8");
    if (fileContent.indexOf("export") === -1) continue;

    const relativePath = path.relative(API_DIR, filePath);
    const routeDir = path.dirname(relativePath);

    // Normalize path separators for Windows/Unix compatibility
    const posixRouteDir = routeDir.split(path.sep).join("/");

    // Construct route path, ignoring Next.js route groups like (groupName)
    const urlSegments = posixRouteDir
      .split("/")
      .filter((segment) => !(segment.startsWith("(") && segment.endsWith(")")));
    const urlRouteDir = urlSegments.join("/");
    const routePath =
      urlRouteDir === "" || urlRouteDir === "."
        ? "/api"
        : `/api/${urlRouteDir}`;

    // Construct import name: e.g. /api/admin/prom/verifications/[id]/presign -> AdminPromVerificationsIdPresignRoute
    const parts = urlRouteDir.split("/");
    let importName = "";
    for (let j = 0; j < parts.length; j++) {
      let rawPart = parts[j];
      let prefix = "";
      if (rawPart.startsWith("[[...")) prefix = "Opt";
      else if (rawPart.startsWith("[...")) prefix = "All";
      else if (rawPart.startsWith("[")) prefix = "By";

      const cleanPart = rawPart.replace(/[^a-zA-Z0-9_$\u00C0-\uFFFF]+/g, "-");
      const words = cleanPart.split("-");
      let partName = prefix;
      for (let k = 0; k < words.length; k++) {
        const word = words[k];
        if (word) {
          partName += word.charAt(0).toUpperCase() + word.slice(1);
        }
      }
      importName += partName;
    }
    importName += "Route";
    if (/^\d/.test(importName)) {
      importName = "_" + importName;
    }

    const importPath =
      posixRouteDir === "."
        ? "@/app/api/route"
        : `@/app/api/${posixRouteDir}/route`;

    routes.push({ importName, importPath, routePath });
  }

  // Sort for types by routePath
  const typeRoutes = routes
    .slice()
    .sort((a, b) => (a.routePath < b.routePath ? -1 : 1));

  // Sort for imports by importPath using simple string comparison (matches prettier-plugin-sort-imports)
  const importRoutes = routes
    .slice()
    .sort((a, b) => (a.importPath < b.importPath ? -1 : 1));

  const importLines = [];
  let currentImportGroup = "";
  for (let i = 0; i < importRoutes.length; i++) {
    const r = importRoutes[i];
    const group = r.routePath.split("/")[2] || "root";
    if (group !== currentImportGroup) {
      if (currentImportGroup !== "") importLines.push("");
      importLines.push(`// /api/${group}`);
      currentImportGroup = group;
    }
    importLines.push(
      `import type * as ${r.importName} from "${r.importPath}";`,
    );
  }

  const typeLines = [];
  let currentTypeGroup = "";
  for (let i = 0; i < typeRoutes.length; i++) {
    const r = typeRoutes[i];
    const group = r.routePath.split("/")[2] || "root";
    if (group !== currentTypeGroup) {
      if (currentTypeGroup !== "") typeLines.push("");
      typeLines.push(`  // /api/${group}`);
      currentTypeGroup = group;
    }
    typeLines.push(`  "${r.routePath}": typeof ${r.importName};`);
  }

  // ─── Build RouteTrie ────────────────────────────────────────────────────────

  const routePaths = typeRoutes.map((r) => r.routePath);
  const trie = buildTrie(routePaths);
  const trieBody = emitTrieType(trie, 0);

  const routeTrieBlock =
    routePaths.length === 0
      ? `// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type RouteTrie = {};`
      : `type RouteTrie = {
${trieBody}
};`;

  // ─── Assemble generated block ───────────────────────────────────────────────

  const generatedBlock = `// --- BEGIN GENERATED API REGISTRY ---
// This section is auto-generated. Do not edit manually.
// Run your dev server or \`node ${BASE_DIR === "." ? "" : BASE_DIR + "/"}lib/next-zero-rpc/update-api-registry.mjs\` to regenerate.

${importLines.join("\n")}

// ─── Route map ────────────────────────────────────────────────────────────────

${typeLines.length === 0 ? "// eslint-disable-next-line @typescript-eslint/no-empty-object-type" : ""}
export type KnownRoutes = {
${typeLines.join("\n")}
};

// ─── Prefix trie ──────────────────────────────────────────────────────────────
// Nested object type keyed by path segment. Each node may have:
//   "__terminal__": the full route string if this node ends a route
//   literal segment keys: static segments (e.g. "users", "api")
//   "[param]" keys: dynamic param segments
//   "[[...param]]" keys: optional catchall segments
//   "[...param]" keys: required catchall segments

${routeTrieBlock}

// --- END GENERATED API REGISTRY ---`.replace(/\n\n+/g, "\n\n");

  // ─── Static (hand-authored) types ──────────────────────────────────────────

  const staticTypes = [
    "",
    "// ─── Trie traversal ────────────────────────────────────────────────────────",
    "",
    "// Look up one segment in a trie node.",
    "// Priority: exact literal match > dynamic [param] > catchall",
    "type TrieLookup<",
    "  Node extends Record<string, unknown>,",
    "  Seg extends string,",
    "> =",
    "  // 1. Exact static match",
    "  Seg extends keyof Node",
    "    ? Node[Seg]",
    "    // 2. Dynamic [param] — any non-empty segment matches a [x] key",
    "    : string extends Seg",
    "      ? never",
    "      : {",
    "          [K in keyof Node]: K extends `[${string}]`",
    "            ? K extends `[[${string}]]` | `[...${string}`",
    "              ? never // catchalls handled separately",
    "              : Node[K]",
    "            : never;",
    "        }[keyof Node] extends infer R",
    "        ? [R] extends [never]",
    "          ? never",
    "          : R",
    "        : never;",
    "",
    "// Check if a trie node has a catchall child that matches the remaining path",
    "type CheckCatchallsInNode<",
    "  Node extends Record<string, unknown>,",
    "  Head extends string,",
    "> = {",
    "  [K in keyof Node]: K extends `[[...${string}]]`",
    "    ? // Optional catchall: matches one or more non-empty segments",
    '      Head extends ""',
    "      ? never",
    "      : Node[K] extends Record<string, unknown>",
    '        ? "__terminal__" extends keyof Node[K]',
    '          ? Node[K]["__terminal__"]',
    "          : never",
    "        : never",
    "    : K extends `[...${string}]`",
    "    ? // Required catchall: must have at least one non-empty segment",
    '      Head extends ""',
    "      ? never",
    "      : Node[K] extends Record<string, unknown>",
    '        ? "__terminal__" extends keyof Node[K]',
    '          ? Node[K]["__terminal__"]',
    "          : never",
    "        : never",
    "    : never;",
    "}[keyof Node];",
    "",
    "// Walk the trie segment by segment",
    "type TrieWalk<Node, Segs extends string[]> =",
    "  Node extends Record<string, unknown>",
    "    ? Segs extends []",
    "      ? // End of path — return terminal if present",
    '        "__terminal__" extends keyof Node',
    '          ? Node["__terminal__"]',
    "          : never",
    "      : Segs extends [infer Head extends string, ...infer Tail extends string[]]",
    "        ? CheckCatchallsInNode<Node, Head> extends infer CR",
    "          ? [CR] extends [never]",
    "            ? // No catchall matched — step into next segment",
    "              TrieWalk<TrieLookup<Node, Head>, Tail>",
    "            : CR",
    "          : never",
    "        : never",
    "    : never;",
    "",
    "// ─── Public API ─────────────────────────────────────────────────────────────",
    "",
    "type Split<S extends string> = S extends `${infer Head}/${infer Tail}`",
    "  ? [Head, ...Split<Tail>]",
    "  : [S];",
    "",
    "type StripQuery<Path extends string> = Path extends `${infer Base}?${string}`",
    "  ? Base",
    "  : Path;",
    "",
    "export type FindMatchingRoute<Path extends string> =",
    "  StripQuery<Path> extends infer Clean extends string",
    "    ? Clean extends keyof KnownRoutes",
    "      ? Clean // Fast path: exact static match (O(1) object key lookup)",
    "      : TrieWalk<RouteTrie, Split<Clean>> // Trie walk: O(depth)",
    "    : never;",
    "",
    'export type CheckPath<Path extends string> = Path extends "" | "/" | "/a" | "/ap" | "/api" | "/api/"',
    "  ? keyof KnownRoutes",
    "  : FindMatchingRoute<Path> extends never",
    "    ? keyof KnownRoutes",
    "    : Path;",
  ].join("\n");

  // ─── Write file ─────────────────────────────────────────────────────────────

  if (!fs.existsSync(REGISTRY_FILE)) {
    console.log(`[API Registry] File not found. Creating apiRegistry.ts...`);
    fs.writeFileSync(
      REGISTRY_FILE,
      generatedBlock + "\n" + staticTypes,
      "utf-8",
    );
    return;
  }

  const registryContent = fs.readFileSync(REGISTRY_FILE, "utf-8");
  const startMarker = "// --- BEGIN GENERATED API REGISTRY ---";
  const endMarker = "// --- END GENERATED API REGISTRY ---";

  const startIndex = registryContent.indexOf(startMarker);
  let newContent;

  if (startIndex !== -1) {
    const endIndex = registryContent.indexOf(endMarker, startIndex);
    if (endIndex !== -1) {
      newContent =
        (startIndex > 0 ? registryContent.slice(0, startIndex) : "") +
        generatedBlock +
        staticTypes;
    } else {
      console.warn(
        `[API Registry] End marker missing in apiRegistry.ts. Rebuilding file...`,
      );
      newContent = generatedBlock + "\n" + staticTypes;
    }
  } else {
    console.warn(
      `[API Registry] Start marker missing in apiRegistry.ts. Rebuilding file...`,
    );
    newContent = generatedBlock + "\n" + staticTypes;
  }

  if (newContent !== registryContent) {
    fs.writeFileSync(REGISTRY_FILE, newContent, "utf-8");
    console.log(`[API Registry] Updated known routes in apiRegistry.ts`);
  }
}

// Execute directly if run via CLI (e.g. from package.json script)
if (process.argv[1] && process.argv[1].endsWith("update-api-registry.mjs")) {
  updateApiRegistry();
}

/**
 * Next.js plugin to automatically generate the API registry during development and build.
 * Usage in next.config.ts:
 * export default withApiRegistry(nextConfig);
 */
export function withApiRegistry(nextConfig = {}) {
  // Only run once per process (prevents duplicate watchers in Turbopack/Webpack)
  if (!globalThis.__apiRegistryWatcherSetup) {
    globalThis.__apiRegistryWatcherSetup = true;
    updateApiRegistry();

    // Only setup the watcher in development mode
    if (process.env.NODE_ENV !== "production") {
      if (fs.existsSync(API_DIR)) {
        let timeout;
        fs.watch(API_DIR, { recursive: true }, () => {
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            updateApiRegistry();
          }, 100);
        });
      }
    }
  }
  return nextConfig;
}
