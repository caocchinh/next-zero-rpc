import fs from "fs";
import path from "path";

export interface ResolvedRoute {
  /** Absolute path to the route.ts file */
  filePath: string;
  /** The matched route key, e.g. "/api/users/[id]" */
  routeKey: string;
}

/**
 * Splits a URL path into its segments, stripping the leading slash.
 * "/api/users/34" → ["api", "users", "34"]
 */
function splitPath(urlPath: string): string[] {
  return urlPath.split("/").filter(Boolean);
}

/**
 * Recursively walks the Next.js app directory to find the best matching
 * route.ts file for a given URL path.
 *
 * Follows the same static-first precedence as the runtime:
 *   1. Exact static folder match
 *   2. Dynamic [param] match
 *   3. Catch-all [...slug] match
 */
function walkDir(
  dir: string,
  segments: string[],
  depth: number,
  routeKeyParts: string[],
): ResolvedRoute | undefined {
  if (depth === segments.length) {
    // We've consumed all segments — look for route.ts / route.js
    for (const ext of ["route.ts", "route.js"]) {
      const candidate = path.join(dir, ext);
      if (fs.existsSync(candidate)) {
        return {
          filePath: candidate,
          routeKey: "/" + routeKeyParts.join("/"),
        };
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

  // ── Priority 1: Exact static match ───────────────────────────────────────
  const staticMatch = dirs.find((c) => c.name === seg);
  if (staticMatch) {
    const result = walkDir(
      path.join(dir, seg),
      segments,
      depth + 1,
      [...routeKeyParts, seg],
    );
    if (result) return result;
  }

  // ── Priority 2: Route groups like (groupName) — transparent, don't consume segment ──
  const routeGroups = dirs.filter(
    (c) => c.name.startsWith("(") && c.name.endsWith(")"),
  );
  for (const group of routeGroups) {
    const result = walkDir(
      path.join(dir, group.name),
      segments,
      depth, // don't advance depth — route groups are invisible to the URL
      routeKeyParts, // don't add to routeKey either
    );
    if (result) return result;
  }

  // ── Priority 3: Dynamic [param] (single segment) ─────────────────────────
  const dynamicMatch = dirs.find(
    (c) =>
      c.name.startsWith("[") &&
      !c.name.startsWith("[...") &&
      !c.name.startsWith("[[...") &&
      c.name.endsWith("]"),
  );
  if (dynamicMatch) {
    const result = walkDir(
      path.join(dir, dynamicMatch.name),
      segments,
      depth + 1,
      [...routeKeyParts, dynamicMatch.name],
    );
    if (result) return result;
  }

  // ── Priority 4: Optional catch-all [[...slug]] ────────────────────────────
  const optionalCatchAll = dirs.find(
    (c) => c.name.startsWith("[[...") && c.name.endsWith("]]"),
  );
  if (optionalCatchAll) {
    for (const ext of ["route.ts", "route.js"]) {
      const candidate = path.join(dir, optionalCatchAll.name, ext);
      if (fs.existsSync(candidate)) {
        return {
          filePath: candidate,
          routeKey: "/" + [...routeKeyParts, optionalCatchAll.name].join("/"),
        };
      }
    }
  }

  // ── Priority 5: Required catch-all [...slug] ──────────────────────────────
  const catchAll = dirs.find(
    (c) => c.name.startsWith("[...") && c.name.endsWith("]"),
  );
  if (catchAll) {
    for (const ext of ["route.ts", "route.js"]) {
      const candidate = path.join(dir, catchAll.name, ext);
      if (fs.existsSync(candidate)) {
        return {
          filePath: candidate,
          routeKey: "/" + [...routeKeyParts, catchAll.name].join("/"),
        };
      }
    }
  }

  return undefined;
}

/**
 * Resolves a URL route string to its corresponding Next.js route.ts file.
 *
 * @param routeString - The URL path, e.g. "/api/users/34"
 * @param projectRoot  - Absolute path to the Next.js project root
 * @returns The resolved route info, or undefined if no match found
 */
export function resolveRouteToFile(
  routeString: string,
  projectRoot: string,
): ResolvedRoute | undefined {
  // Strip query string: "/api/users?page=1" → "/api/users"
  const cleanPath = routeString.split("?")[0];

  // Determine app directory (supports both src/app and app layouts)
  const appDirs = [
    path.join(projectRoot, "src", "app"),
    path.join(projectRoot, "app"),
  ];

  for (const appDir of appDirs) {
    if (!fs.existsSync(appDir)) continue;

    const segments = splitPath(cleanPath);
    const result = walkDir(appDir, segments, 0, []);
    if (result) return result;
  }

  return undefined;
}

/**
 * Detects the Next.js project root by walking up from a given file,
 * looking for a next.config.ts / next.config.js / next.config.mjs.
 */
export function detectProjectRoot(fromFile: string): string | undefined {
  let dir = path.dirname(fromFile);
  const MAX_DEPTH = 10;

  for (let i = 0; i < MAX_DEPTH; i++) {
    const indicators = [
      "next.config.ts",
      "next.config.js",
      "next.config.mjs",
      "next.config.cjs",
    ];
    for (const indicator of indicators) {
      if (fs.existsSync(path.join(dir, indicator))) {
        return dir;
      }
    }

    const parent = path.dirname(dir);
    if (parent === dir) break; // reached filesystem root
    dir = parent;
  }

  return undefined;
}
