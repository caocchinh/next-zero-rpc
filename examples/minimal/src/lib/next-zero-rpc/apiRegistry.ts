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

// ─── Pre-computed segment arrays ──────────────────────────────────────────────

export type KnownRouteSegments = {
  // /api/auth
  "/api/auth/login":                                                            ["", "api", "auth", "login"];

  // /api/extreme
  "/api/extreme/[orgId]/projects/[projectId]/tasks/[...catchall]":              ["", "api", "extreme", "[orgId]", "projects", "[projectId]", "tasks", "[...catchall]"];
  "/api/extreme/complex-types":                                                 ["", "api", "extreme", "complex-types"];
  "/api/extreme/methods":                                                       ["", "api", "extreme", "methods"];

  // /api/status
  "/api/status":                                                                ["", "api", "status"];

  // /api/users
  "/api/users/[userId]":                                                        ["", "api", "users", "[userId]"];
  "/api/users/active":                                                          ["", "api", "users", "active"];
};

// ─── Routes bucketed by segment depth ────────────────────────────────────────

export type RoutesByDepth = {
  3: "/api/status";
  4: "/api/auth/login" | "/api/extreme/complex-types" | "/api/extreme/methods" | "/api/users/[userId]" | "/api/users/active";
  8: "/api/extreme/[orgId]/projects/[projectId]/tasks/[...catchall]";
};

// ─── Catchall routes with their minimum required depth ───────────────────────

export type CatchallRoutes = {
  "/api/extreme/[orgId]/projects/[projectId]/tasks/[...catchall]": 8;
};

// --- END GENERATED API REGISTRY ---
type Split<S extends string> = S extends `${infer Head}/${infer Tail}`
  ? [Head, ...Split<Tail>]
  : [S];

type MatchSegment<P extends string, K extends string> = K extends `[${string}]`
  ? P extends ""
    ? false
    : true
  : K extends P
    ? true
    : false;

type MatchSegments<P extends string[], K extends string[]> = K extends []
  ? P extends []
    ? true
    : false
  : K extends [`[[...${string}]]`]
    ? P extends [""]
      ? false
      : true
    : K extends [`[...${string}]`]
      ? P extends [""] | []
        ? false
        : true
      : [P, K] extends [
            [infer PH extends string, ...infer PT extends string[]],
            [infer KH extends string, ...infer KT extends string[]],
          ]
        ? MatchSegment<PH, KH> extends true
          ? MatchSegments<PT, KT>
          : false
        : false;

type CheckCatchalls<PathSegments extends string[]> = {
  [K in keyof CatchallRoutes]: PathSegments["length"] extends CatchallRoutes[K]
    ? MatchSegments<PathSegments, KnownRouteSegments[K]> extends true
      ? K
      : never
    : PathSegments["length"] extends CatchallRoutes[K]
      ? never
      : PathSegments["length"] extends number
        ? CatchallRoutes[K] extends number
          ? PathSegments["length"] extends CatchallRoutes[K]
            ? never
            : MatchSegments<PathSegments, KnownRouteSegments[K]> extends true
              ? K
              : never
          : never
        : never;
}[keyof CatchallRoutes];

type CheckByDepth<PathSegments extends string[]> =
  PathSegments["length"] extends keyof RoutesByDepth
    ? {
        [K in RoutesByDepth[PathSegments["length"]]]: MatchSegments<
          PathSegments,
          KnownRouteSegments[K]
        > extends true
          ? K
          : never;
      }[RoutesByDepth[PathSegments["length"]]]
    : never;

type FindBySegments<PathSegments extends string[]> =
  | CheckCatchalls<PathSegments>
  | CheckByDepth<PathSegments>;

type StripQuery<Path extends string> = Path extends `${infer Base}?${string}`
  ? Base
  : Path;

export type FindMatchingRoute<Path extends string> =
  StripQuery<Path> extends infer CleanPath extends string
    ? CleanPath extends keyof KnownRoutes
      ? CleanPath
      : FindBySegments<Split<CleanPath>>
    : never;

export type CheckPath<Path extends string> = Path extends "" | "/" | "/a" | "/ap" | "/api" | "/api/"
  ? keyof KnownRoutes
  : FindMatchingRoute<Path> extends never
    ? keyof KnownRoutes
    : Path;