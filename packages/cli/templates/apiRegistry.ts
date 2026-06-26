// --- BEGIN GENERATED API REGISTRY ---
// This section is auto-generated. Do not edit manually.
// Run your dev server or `node lib/next-zero-rpc/update-api-registry.mjs` to regenerate.

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type KnownRoutes = {
  // Routes will be auto-populated here
};

// PRE-COMPUTED BY CODEGEN: Eliminates the need for Split<K>
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type KnownRouteSegments = {};
// --- END GENERATED API REGISTRY ---

type Split<S extends string> = S extends `${infer Head}/${infer Tail}`
  ? [Head, ...Split<Tail>]
  : [S];

type FindBySegments<PathSegments extends string[]> = {
  [K in keyof KnownRouteSegments]: MatchSegments<
    PathSegments,
    KnownRouteSegments[K]
  > extends true
    ? K
    : never;
}[keyof KnownRouteSegments];

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

type StripQuery<Path extends string> = Path extends `${infer Base}?${string}` ? Base : Path;

export type FindMatchingRoute<Path extends string> =
  StripQuery<Path> extends keyof KnownRoutes
    ? StripQuery<Path>
    : FindBySegments<Split<StripQuery<Path>>>;

export type CheckPath<Path extends string> = Path extends "" | "/" | "/a" | "/ap" | "/api" | "/api/"
  ? keyof KnownRoutes
  : FindMatchingRoute<Path> extends never
    ? keyof KnownRoutes
    : Path;
