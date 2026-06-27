// --- BEGIN GENERATED API REGISTRY ---
// This section is auto-generated. Do not edit manually.
// Run your dev server or `node src/lib/next-zero-rpc/update-api-registry.mjs` to regenerate.

// /api/status
import type * as StatusRoute from "@/app/api/(core)/status/route";

// /api/auth
import type * as AuthLoginRoute from "@/app/api/auth/login/route";

// /api/extreme
import type * as ExtremeOrgIdProjectsProjectIdTasksCatchallRoute from "@/app/api/extreme/[orgId]/projects/[projectId]/tasks/[...catchall]/route";
import type * as ExtremeComplexTypesRoute from "@/app/api/extreme/complex-types/route";
import type * as ExtremeMethodsRoute from "@/app/api/extreme/methods/route";

// /api/users
import type * as UsersUserIdRoute from "@/app/api/users/[userId]/route";
import type * as UsersActiveRoute from "@/app/api/users/active/route";

// ─── Route map ────────────────────────────────────────────────────────────────

export type KnownRoutes = {
  // /api/auth
  "/api/auth/login": typeof AuthLoginRoute;

  // /api/extreme
  "/api/extreme/[orgId]/projects/[projectId]/tasks/[...catchall]": typeof ExtremeOrgIdProjectsProjectIdTasksCatchallRoute;
  "/api/extreme/complex-types": typeof ExtremeComplexTypesRoute;
  "/api/extreme/methods": typeof ExtremeMethodsRoute;

  // /api/status
  "/api/status": typeof StatusRoute;

  // /api/users
  "/api/users/[userId]": typeof UsersUserIdRoute;
  "/api/users/active": typeof UsersActiveRoute;
};

// ─── Prefix trie ──────────────────────────────────────────────────────────────
// Nested object type keyed by path segment. Each node may have:
//   "__terminal__": the full route string if this node ends a route
//   literal segment keys: static segments (e.g. "users", "api")
//   "[param]" keys: dynamic param segments
//   "[[...param]]" keys: optional catchall segments
//   "[...param]" keys: required catchall segments

export type RouteTrie = {
  "": {
    "api": {
      "auth": {
        "login": {
          "__terminal__": "/api/auth/login"
        }
      };
      "extreme": {
        "[orgId]": {
          "projects": {
            "[projectId]": {
              "tasks": {
                "[...catchall]": {
                  "__terminal__": "/api/extreme/[orgId]/projects/[projectId]/tasks/[...catchall]"
                }
              }
            }
          }
        };
        "complex-types": {
          "__terminal__": "/api/extreme/complex-types"
        };
        "methods": {
          "__terminal__": "/api/extreme/methods"
        }
      };
      "status": {
        "__terminal__": "/api/status"
      };
      "users": {
        "[userId]": {
          "__terminal__": "/api/users/[userId]"
        };
        "active": {
          "__terminal__": "/api/users/active"
        }
      }
    }
  }
};

// --- END GENERATED API REGISTRY ---
// ─── Trie traversal ────────────────────────────────────────────────────────

// Look up one segment in a trie node.
// Priority: exact literal match > dynamic [param] > catchall
type TrieLookup<
  Node extends Record<string, unknown>,
  Seg extends string,
> =
  // 1. Exact static match
  Seg extends keyof Node
    ? Node[Seg]
    // 2. Dynamic [param] — any non-empty segment matches a [x] key
    : string extends Seg
      ? never
      : {
          [K in keyof Node]: K extends `[${string}]`
            ? K extends `[[${string}]]` | `[...${string}`
              ? never // catchalls handled separately
              : Node[K]
            : never;
        }[keyof Node] extends infer R
        ? [R] extends [never]
          ? never
          : R
        : never;

// Check if a trie node has a catchall child that matches the remaining path
type CheckCatchallsInNode<
  Node extends Record<string, unknown>,
  Head extends string,
> = {
  [K in keyof Node]: K extends `[[...${string}]]`
    ? // Optional catchall: matches one or more non-empty segments
      Head extends ""
      ? never
      : Node[K] extends Record<string, unknown>
        ? "__terminal__" extends keyof Node[K]
          ? Node[K]["__terminal__"]
          : never
        : never
    : K extends `[...${string}]`
    ? // Required catchall: must have at least one non-empty segment
      Head extends ""
      ? never
      : Node[K] extends Record<string, unknown>
        ? "__terminal__" extends keyof Node[K]
          ? Node[K]["__terminal__"]
          : never
        : never
    : never;
}[keyof Node];

// Walk the trie segment by segment
type TrieWalk<Node, Segs extends string[]> =
  Node extends Record<string, unknown>
    ? Segs extends []
      ? // End of path — return terminal if present
        "__terminal__" extends keyof Node
          ? Node["__terminal__"]
          : never
      : Segs extends [infer Head extends string, ...infer Tail extends string[]]
        ? CheckCatchallsInNode<Node, Head> extends infer CR
          ? [CR] extends [never]
            ? // No catchall matched — step into next segment
              TrieWalk<TrieLookup<Node, Head>, Tail>
            : CR
          : never
        : never
    : never;

// ─── Public API ─────────────────────────────────────────────────────────────

type Split<S extends string> = S extends `${infer Head}/${infer Tail}`
  ? [Head, ...Split<Tail>]
  : [S];

type StripQuery<Path extends string> = Path extends `${infer Base}?${string}`
  ? Base
  : Path;

export type FindMatchingRoute<Path extends string> =
  StripQuery<Path> extends infer Clean extends string
    ? Clean extends keyof KnownRoutes
      ? Clean // Fast path: exact static match (O(1) object key lookup)
      : TrieWalk<RouteTrie, Split<Clean>> // Trie walk: O(depth)
    : never;

export type CheckPath<Path extends string> = Path extends "" | "/" | "/a" | "/ap" | "/api" | "/api/"
  ? keyof KnownRoutes
  : FindMatchingRoute<Path> extends never
    ? keyof KnownRoutes
    : Path;