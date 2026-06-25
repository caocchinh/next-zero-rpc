// --- BEGIN GENERATED API REGISTRY ---
// This section is auto-generated. Do not edit manually.
// Run your dev server or `node lib/next-zero-rpc/update-api-registry.mjs` to regenerate.

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type KnownRoutes = {
  // Routes will be auto-populated here
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

export type FindMatchingRoute<Path extends string> = Path extends keyof KnownRoutes
  ? Path
  : {
      [K in keyof KnownRoutes & string]: MatchSegments<
        Split<StripQuery<Path>>,
        Split<K>
      > extends true
        ? K
        : never;
    }[keyof KnownRoutes & string];

export type CheckPath<Path extends string> = Path extends ""
  ? keyof KnownRoutes
  : FindMatchingRoute<Path> extends never
    ? keyof KnownRoutes
    : Path;
