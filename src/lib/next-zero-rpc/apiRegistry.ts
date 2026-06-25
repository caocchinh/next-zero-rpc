// --- BEGIN GENERATED API REGISTRY ---
// This section is auto-generated. Do not edit manually.
// Run your dev server or `node src/lib/next-zero-rpc/update-api-registry.mjs` to regenerate.
// /api/bruh
import type * as BruhRoute from "@/app/api/(skibidi)/bruh/route";

// /api/auth
import type * as AuthLoginRoute from "@/app/api/auth/login/route";

// /api/debug-truthiness
import type * as DebugTruthinessRoute from "@/app/api/debug-truthiness/route";

// /api/extreme
import type * as ExtremeOrgIdProjectsProjectIdTasksCatchallRoute from "@/app/api/extreme/[orgId]/projects/[projectId]/tasks/[...catchall]/route";
import type * as ExtremeComplexTypesRoute from "@/app/api/extreme/complex-types/route";
import type * as ExtremeMethodsRoute from "@/app/api/extreme/methods/route";

// /api/users
import type * as UsersUserIdRoute from "@/app/api/users/[userId]/route";

export type KnownRoutes = {
  // Static Routes & Autocomplete Hints
  // /api/auth
  "/api/auth/login": typeof AuthLoginRoute;

  // /api/bruh
  "/api/bruh": typeof BruhRoute;

  // /api/debug-truthiness
  "/api/debug-truthiness": typeof DebugTruthinessRoute;

  // /api/extreme
  "/api/extreme/[orgId]/projects/[projectId]/tasks/[...catchall]": typeof ExtremeOrgIdProjectsProjectIdTasksCatchallRoute;
  "/api/extreme/complex-types": typeof ExtremeComplexTypesRoute;
  "/api/extreme/methods": typeof ExtremeMethodsRoute;

  // /api/users
  "/api/users/[userId]": typeof UsersUserIdRoute;
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
  : K extends [`[...${string}]`]
    ? true
    : [P, K] extends [
          [infer PH extends string, ...infer PT extends string[]],
          [infer KH extends string, ...infer KT extends string[]],
        ]
      ? MatchSegment<PH, KH> extends true
        ? MatchSegments<PT, KT>
        : false
      : false;

type StripQuery<Path extends string> = Path extends `${infer Base}?${string}` ? Base : Path;

export type FindMatchingRoute<Path extends string> = {
  [K in keyof KnownRoutes & string]: MatchSegments<Split<StripQuery<Path>>, Split<K>> extends true
    ? K
    : never;
}[keyof KnownRoutes & string];

export type CheckPath<Path extends string> = Path extends ""
  ? keyof KnownRoutes
  : FindMatchingRoute<Path> extends never
    ? keyof KnownRoutes
    : Path;
