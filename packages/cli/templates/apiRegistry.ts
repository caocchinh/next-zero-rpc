// --- BEGIN GENERATED API REGISTRY ---
// This section is auto-generated. Do not edit manually.
// Run your dev server or `node lib/next-zero-rpc/update-api-registry.mjs` to regenerate.

// ─── Route map ────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type KnownRoutes = {
  // Routes will be auto-populated here
};

// ─── Pre-computed segment arrays ──────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type KnownRouteSegments = {};

// ─── Routes bucketed by segment depth ────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type RoutesByDepth = {};

// ─── Catchall routes with their minimum required depth ───────────────────────

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type CatchallRoutes = {};

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
