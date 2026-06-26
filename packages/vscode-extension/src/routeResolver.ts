import fs from "fs";
import path from "path";

export interface ResolvedRoute {
  filePath: string;
  routeKey: string;
}

function splitPath(urlPath: string): string[] {
  return urlPath.split("/").filter(Boolean);
}

function walkDir(
  dir: string,
  segments: string[],
  depth: number,
  routeKeyParts: string[],
): ResolvedRoute | undefined {
  if (depth === segments.length) {
    for (const ext of ["route.ts", "route.js"]) {
      const candidate = path.join(dir, ext);
      if (fs.existsSync(candidate)) {
        return { filePath: candidate, routeKey: "/" + routeKeyParts.join("/") };
      }
    }
    return undefined;
  }

  const seg = segments[depth];
  let children: fs.Dirent[];
  try {
    children = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return undefined;
  }

  const dirs = children.filter((c) => c.isDirectory());

  // 1. Exact static match
  const staticMatch = dirs.find((c) => c.name === seg);
  if (staticMatch) {
    const result = walkDir(path.join(dir, seg), segments, depth + 1, [...routeKeyParts, seg]);
    if (result) return result;
  }

  // 2. Route groups (groupName) — transparent, don't consume the URL segment
  const routeGroups = dirs.filter((c) => c.name.startsWith("(") && c.name.endsWith(")"));
  for (const group of routeGroups) {
    const result = walkDir(path.join(dir, group.name), segments, depth, routeKeyParts);
    if (result) return result;
  }

  // 3. Dynamic [param]
  const dynamicMatch = dirs.find(
    (c) => c.name.startsWith("[") && !c.name.startsWith("[...") && !c.name.startsWith("[[...") && c.name.endsWith("]"),
  );
  if (dynamicMatch) {
    const result = walkDir(path.join(dir, dynamicMatch.name), segments, depth + 1, [...routeKeyParts, dynamicMatch.name]);
    if (result) return result;
  }

  // 4. Optional catch-all [[...slug]]
  const optionalCatchAll = dirs.find((c) => c.name.startsWith("[[...") && c.name.endsWith("]]"));
  if (optionalCatchAll) {
    for (const ext of ["route.ts", "route.js"]) {
      const candidate = path.join(dir, optionalCatchAll.name, ext);
      if (fs.existsSync(candidate)) {
        return { filePath: candidate, routeKey: "/" + [...routeKeyParts, optionalCatchAll.name].join("/") };
      }
    }
  }

  // 5. Required catch-all [...slug]
  const catchAll = dirs.find((c) => c.name.startsWith("[...") && c.name.endsWith("]"));
  if (catchAll) {
    for (const ext of ["route.ts", "route.js"]) {
      const candidate = path.join(dir, catchAll.name, ext);
      if (fs.existsSync(candidate)) {
        return { filePath: candidate, routeKey: "/" + [...routeKeyParts, catchAll.name].join("/") };
      }
    }
  }

  return undefined;
}

export function resolveRouteToFile(
  routeString: string,
  projectRoot: string,
): ResolvedRoute | undefined {
  const cleanPath = routeString.split("?")[0];

  const appDirs = [
    path.join(projectRoot, "src", "app"),
    path.join(projectRoot, "app"),
  ];

  for (const appDir of appDirs) {
    if (!fs.existsSync(appDir)) continue;
    const result = walkDir(appDir, splitPath(cleanPath), 0, []);
    if (result) return result;
  }

  return undefined;
}

export function detectProjectRoot(fromFile: string): string | undefined {
  let dir = path.dirname(fromFile);
  for (let i = 0; i < 10; i++) {
    const indicators = ["next.config.ts", "next.config.js", "next.config.mjs", "next.config.cjs"];
    if (indicators.some((f) => fs.existsSync(path.join(dir, f)))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return undefined;
}
