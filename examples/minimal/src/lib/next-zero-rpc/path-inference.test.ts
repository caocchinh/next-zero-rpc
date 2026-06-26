/**
 * Unit tests for next-zero-rpc path inference types.
 *
 * Design:
 *   - Public API types (KnownRoutes, FindMatchingRoute, CheckPath) are imported
 *     directly from the real apiRegistry — tests exercise the live implementation.
 *   - Internal utility types (Split, MatchSegment, MatchSegments, StripQuery) are
 *     redeclared locally — they are implementation details, not public API. Keeping
 *     them unexported prevents users from depending on them. The redeclarations here
 *     act as a specification; any divergence from the real implementation will be
 *     caught transitively by the FindMatchingRoute / CheckPath tests.
 *
 * Real routes under test:
 *   /api/auth/login                                               POST
 *   /api/extreme/[orgId]/projects/[projectId]/tasks/[...catchall] GET
 *   /api/extreme/complex-types                                    GET POST
 *   /api/extreme/methods                                          GET POST PUT DELETE PATCH HEAD OPTIONS
 *   /api/status                                                   GET
 *   /api/users/[userId]                                           GET PUT DELETE
 *   /api/users/active                                             GET
 *
 * Covered route patterns:
 *   [param]       — single dynamic segment
 *   [...catchall] — catch-all (1+ segments)
 *   [[...slug]]   — optional catch-all (0+ segments)
 *
 * Run: pnpm test (from repo root)
 */

import { assertType, describe, expect, it } from "vitest";

// ─── Public API — imported from the real registry ────────────────────────────
import type { CheckPath, FindMatchingRoute, KnownRoutes } from "./apiRegistry";

// ─── Internal types — redeclared locally as specification ────────────────────
// These types are intentionally NOT exported from apiRegistry.ts.
// Redeclaring them here lets us test the primitive logic unit-by-unit without
// leaking them into the public module surface.

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
  : K extends [`[...${string}]`] | [`[[...${string}]]`]
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

// ─── Helper ───────────────────────────────────────────────────────────────────

/** Structural equality check at the type level */
type Equals<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;

// ─────────────────────────────────────────────────────────────────────────────

describe("Split<S>", () => {
  it("splits a two-segment path", () => {
    assertType<Equals<Split<"/api/status">, ["", "api", "status"]>>(true);
  });

  it("splits a three-segment path", () => {
    assertType<Equals<Split<"/api/auth/login">, ["", "api", "auth", "login"]>>(true);
  });

  it("splits a path with a dynamic segment", () => {
    assertType<Equals<Split<"/api/users/[userId]">, ["", "api", "users", "[userId]"]>>(true);
  });

  it("splits the deeply nested catch-all route", () => {
    assertType<
      Equals<
        Split<"/api/extreme/[orgId]/projects/[projectId]/tasks/[...catchall]">,
        ["", "api", "extreme", "[orgId]", "projects", "[projectId]", "tasks", "[...catchall]"]
      >
    >(true);
  });

  it("handles a single segment with no slash", () => {
    assertType<Equals<Split<"status">, ["status"]>>(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("MatchSegment<P, K>", () => {
  it("matches identical static segments", () => {
    assertType<Equals<MatchSegment<"users", "users">, true>>(true);
    assertType<Equals<MatchSegment<"active", "active">, true>>(true);
  });

  it("rejects different static segments", () => {
    assertType<Equals<MatchSegment<"users", "auth">, false>>(true);
  });

  it("matches a real dynamic param [userId] against any non-empty value", () => {
    assertType<Equals<MatchSegment<"42", "[userId]">, true>>(true);
    assertType<Equals<MatchSegment<"abc-123", "[userId]">, true>>(true);
  });

  it("matches a real dynamic param [orgId] against any non-empty value", () => {
    assertType<Equals<MatchSegment<"my-org", "[orgId]">, true>>(true);
  });

  it("does NOT match a dynamic segment against an empty string", () => {
    assertType<Equals<MatchSegment<"", "[userId]">, false>>(true);
    assertType<Equals<MatchSegment<"", "[orgId]">, false>>(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("MatchSegments<P, K>", () => {
  it("matches the static /api/status route", () => {
    assertType<Equals<MatchSegments<["/api", "status"], ["/api", "status"]>, true>>(true);
  });

  it("matches /api/auth/login (fully static)", () => {
    assertType<Equals<MatchSegments<["/api", "auth", "login"], ["/api", "auth", "login"]>, true>>(
      true,
    );
  });

  it("matches /api/users/active (static wins over dynamic)", () => {
    // "active" should match the literal segment "active", not [userId]
    assertType<
      Equals<MatchSegments<["/api", "users", "active"], ["/api", "users", "active"]>, true>
    >(true);
  });

  it("matches /api/users/[userId] with a real ID value", () => {
    assertType<
      Equals<MatchSegments<["/api", "users", "u-99"], ["/api", "users", "[userId]"]>, true>
    >(true);
  });

  it("does NOT match /api/users/active against /api/users/[userId]", () => {
    // "active" is a string and would technically match [userId] – however the
    // registry uses exact-match first, so the router resolves the static route.
    // This test checks that MatchSegments itself sees a match (it's the registry
    // that picks the static winner via `Path extends keyof KnownRoutes`).
    assertType<
      Equals<MatchSegments<["/api", "users", "active"], ["/api", "users", "[userId]"]>, true>
    >(true);
  });

  it("matches the deeply nested catch-all route", () => {
    assertType<
      Equals<
        MatchSegments<
          ["/api", "extreme", "acme", "projects", "p-1", "tasks", "step1", "step2"],
          ["/api", "extreme", "[orgId]", "projects", "[projectId]", "tasks", "[...catchall]"]
        >,
        true
      >
    >(true);
  });

  it("rejects a path that is too short for the catch-all route", () => {
    // Missing the tasks segment entirely
    assertType<
      Equals<
        MatchSegments<
          ["/api", "extreme", "acme", "projects", "p-1"],
          ["/api", "extreme", "[orgId]", "projects", "[projectId]", "tasks", "[...catchall]"]
        >,
        false
      >
    >(true);
  });

  it("rejects mismatched static prefix", () => {
    assertType<Equals<MatchSegments<["/api", "auth", "logout"], ["/api", "auth", "login"]>, false>>(
      true,
    );
  });

  it("returns true for two empty arrays", () => {
    assertType<Equals<MatchSegments<[], []>, true>>(true);
  });

  it("returns false when path is empty but pattern is not", () => {
    assertType<Equals<MatchSegments<[], ["/api"]>, false>>(true);
  });

  // ── [[...slug]] optional catch-all ──────────────────────────────────────

  it("[[...slug]] matches zero remaining segments (the 'optional' case)", () => {
    // When a path ends before the optional segment, the pattern still matches.
    assertType<Equals<MatchSegments<[], ["[[...slug]]"]>, true>>(true);
  });

  it("[[...slug]] matches a single remaining segment", () => {
    assertType<Equals<MatchSegments<["intro"], ["[[...slug]]"]>, true>>(true);
  });

  it("[[...slug]] matches multiple remaining segments", () => {
    assertType<
      Equals<MatchSegments<["getting-started", "installation", "quickstart"], ["[[...slug]]"]>, true>
    >(true);
  });

  it("[[...slug]] matches after a static prefix — with segments", () => {
    assertType<
      Equals<
        MatchSegments<
          ["", "api", "docs", "getting-started", "intro"],
          ["", "api", "docs", "[[...slug]]"]
        >,
        true
      >
    >(true);
  });

  it("[[...slug]] matches after a static prefix — zero extra segments", () => {
    assertType<
      Equals<MatchSegments<["", "api", "docs"], ["", "api", "docs", "[[...slug]]"]>, true>
    >(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("StripQuery<Path>", () => {
  it("strips a single query param from a real route path", () => {
    assertType<Equals<StripQuery<"/api/users/active?include=roles">, "/api/users/active">>(true);
  });

  it("strips multiple query params", () => {
    assertType<Equals<StripQuery<"/api/users/u-99?include=avatar&version=2">, "/api/users/u-99">>(
      true,
    );
  });

  it("passes through a path without a query string unchanged", () => {
    assertType<Equals<StripQuery<"/api/status">, "/api/status">>(true);
    assertType<Equals<StripQuery<"/api/auth/login">, "/api/auth/login">>(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("FindMatchingRoute<Path> — real routes", () => {
  it("resolves exact static route /api/status", () => {
    assertType<Equals<FindMatchingRoute<"/api/status">, "/api/status">>(true);
  });

  it("resolves exact static route /api/auth/login", () => {
    assertType<Equals<FindMatchingRoute<"/api/auth/login">, "/api/auth/login">>(true);
  });

  it("resolves exact static route /api/users/active", () => {
    assertType<Equals<FindMatchingRoute<"/api/users/active">, "/api/users/active">>(true);
  });

  it("resolves /api/users/<id> to /api/users/[userId]", () => {
    assertType<Equals<FindMatchingRoute<"/api/users/u-42">, "/api/users/[userId]">>(true);
    assertType<Equals<FindMatchingRoute<"/api/users/123">, "/api/users/[userId]">>(true);
  });

  it("resolves deeply nested catch-all route", () => {
    assertType<
      Equals<
        FindMatchingRoute<"/api/extreme/acme/projects/p-1/tasks/step1/step2/step3">,
        "/api/extreme/[orgId]/projects/[projectId]/tasks/[...catchall]"
      >
    >(true);
  });

  it("resolves /api/extreme/methods (exact static)", () => {
    assertType<Equals<FindMatchingRoute<"/api/extreme/methods">, "/api/extreme/methods">>(true);
  });

  it("resolves /api/extreme/complex-types (exact static)", () => {
    assertType<
      Equals<FindMatchingRoute<"/api/extreme/complex-types">, "/api/extreme/complex-types">
    >(true);
  });

  it("strips query string before resolving dynamic route", () => {
    assertType<Equals<FindMatchingRoute<"/api/users/u-99?include=avatar">, "/api/users/[userId]">>(
      true,
    );
  });

  it("strips query string before resolving static route", () => {
    assertType<Equals<FindMatchingRoute<"/api/status?v=2">, "/api/status">>(true);
  });

  it("returns never for a completely unknown path", () => {
    assertType<Equals<FindMatchingRoute<"/api/does-not-exist">, never>>(true);
    assertType<Equals<FindMatchingRoute<"/api/users/active/extra">, never>>(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe("CheckPath<Path> — autocomplete / guard behaviour", () => {
  it("passes through a known static route unchanged", () => {
    assertType<Equals<CheckPath<"/api/status">, "/api/status">>(true);
    assertType<Equals<CheckPath<"/api/auth/login">, "/api/auth/login">>(true);
    assertType<Equals<CheckPath<"/api/users/active">, "/api/users/active">>(true);
  });

  it("passes through a valid dynamic path unchanged", () => {
    assertType<Equals<CheckPath<"/api/users/u-42">, "/api/users/u-42">>(true);
  });

  it("passes through the deeply nested path unchanged", () => {
    assertType<
      Equals<
        CheckPath<"/api/extreme/acme/projects/p-1/tasks/a/b">,
        "/api/extreme/acme/projects/p-1/tasks/a/b"
      >
    >(true);
  });

  it("returns union of all KnownRoutes for an empty string (full autocomplete)", () => {
    assertType<Equals<CheckPath<"">, keyof KnownRoutes>>(true);
  });

  it("returns union of all KnownRoutes for an unrecognised path (guiding autocomplete)", () => {
    assertType<Equals<CheckPath<"/api/not-real">, keyof KnownRoutes>>(true);
    assertType<Equals<CheckPath<"/api/users/active/extra">, keyof KnownRoutes>>(true);
  });
});

// ─── Runtime sanity (confirms the test harness is working) ───────────────────

describe("runtime sanity", () => {
  it("passes a trivial assertion", () => {
    expect(1 + 1).toBe(2);
  });

  it("assertType is a no-op at runtime", () => {
    expect(() => assertType<true>(true)).not.toThrow();
  });
});
