import fs from "fs";
import path from "path";

function detectBaseDir() {
  const cwd = process.cwd();
  return fs.existsSync(path.join(cwd, "src")) ? "src" : ".";
}

const BASE_DIR = detectBaseDir();
const API_DIR = path.join(process.cwd(), BASE_DIR, "app/api");
const REGISTRY_FILE = path.join(process.cwd(), BASE_DIR, "lib/next-zero-rpc/apiRegistry.ts");

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
    const routePath = urlRouteDir === "" || urlRouteDir === "." ? "/api" : `/api/${urlRouteDir}`;

    // Construct import name: e.g. /api/admin/prom/verifications/[id]/presign -> AdminPromVerificationsIdPresignRoute
    const parts = urlRouteDir.split("/");
    let importName = "";
    for (let j = 0; j < parts.length; j++) {
      const cleanPart = parts[j].replace(/[^a-zA-Z0-9_$\\u00C0-\\uFFFF]+/g, "-");
      const words = cleanPart.split("-");
      for (let k = 0; k < words.length; k++) {
        const word = words[k];
        if (word) {
          importName += word.charAt(0).toUpperCase() + word.slice(1);
        }
      }
    }
    importName += "Route";
    if (/^\d/.test(importName)) {
      importName = "_" + importName;
    }

    const importPath =
      posixRouteDir === "." ? "@/app/api/route" : `@/app/api/${posixRouteDir}/route`;

    routes.push({ importName, importPath, routePath });
  }

  // Sort for types by routePath
  const typeRoutes = routes.slice().sort((a, b) => (a.routePath < b.routePath ? -1 : 1));

  // Sort for imports by importPath using simple string comparison (matches prettier-plugin-sort-imports)
  const importRoutes = routes.slice().sort((a, b) => (a.importPath < b.importPath ? -1 : 1));

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
    importLines.push(`import type * as ${r.importName} from "${r.importPath}";`);
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

  const generatedBlock = `// --- BEGIN GENERATED API REGISTRY ---
// This section is auto-generated. Do not edit manually.
// Run your dev server or \`node ${BASE_DIR === "." ? "" : BASE_DIR + "/"}lib/next-zero-rpc/update-api-registry.mjs\` to regenerate.
${importLines.join("\n")}

${typeLines.length === 0 ? "// eslint-disable-next-line @typescript-eslint/no-empty-object-type" : ""}
export type KnownRoutes = {
  // Static Routes & Autocomplete Hints
${typeLines.join("\n")}
};
// --- END GENERATED API REGISTRY ---`.replace(/\n\n+/g, "\n\n");

  const staticTypes = [
    "",
    "type Split<S extends string> = S extends `${infer Head}/${infer Tail}`",
    "  ? [Head, ...Split<Tail>]",
    "  : [S];",
    "",
    "type MatchSegment<P extends string, K extends string> = K extends `[${string}]`",
    '  ? P extends ""',
    "    ? false",
    "    : true",
    "  : K extends P",
    "    ? true",
    "    : false;",
    "",
    "type MatchSegments<P extends string[], K extends string[]> = K extends []",
    "  ? P extends []",
    "    ? true",
    "    : false",
    "  : K extends [`[...${string}]`]",
    "    ? true",
    "    : [P, K] extends [",
    "          [infer PH extends string, ...infer PT extends string[]],",
    "          [infer KH extends string, ...infer KT extends string[]],",
    "        ]",
    "      ? MatchSegment<PH, KH> extends true",
    "        ? MatchSegments<PT, KT>",
    "        : false",
    "      : false;",
    "",
    "type StripQuery<Path extends string> = Path extends `${infer Base}?${string}` ? Base : Path;",
    "",
    "export type FindMatchingRoute<Path extends string> = StripQuery<Path> extends keyof KnownRoutes",
    "  ? StripQuery<Path>",
    "  : {",
    "      [K in keyof KnownRoutes & string]: MatchSegments<Split<StripQuery<Path>>, Split<K>> extends true",
    "        ? K",
    "        : never;",
    "    }[keyof KnownRoutes & string];",
    "",
    'export type CheckPath<Path extends string> = Path extends ""',
    "  ? keyof KnownRoutes",
    "  : FindMatchingRoute<Path> extends never",
    "    ? keyof KnownRoutes",
    "    : Path;",
  ].join("\n");

  if (!fs.existsSync(REGISTRY_FILE)) {
    console.log(`[API Registry] File not found. Creating apiRegistry.ts...`);
    fs.writeFileSync(REGISTRY_FILE, generatedBlock + "\n" + staticTypes, "utf-8");
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
        registryContent.slice(0, startIndex) +
        generatedBlock +
        registryContent.slice(endIndex + endMarker.length);
    } else {
      console.warn(`[API Registry] End marker missing in apiRegistry.ts. Rebuilding file...`);
      newContent = generatedBlock + "\n" + staticTypes;
    }
  } else {
    console.warn(`[API Registry] Start marker missing in apiRegistry.ts. Rebuilding file...`);
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
