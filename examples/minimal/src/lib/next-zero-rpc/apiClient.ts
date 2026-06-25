import { NextResponse } from "next/server";
import type { CheckPath, FindMatchingRoute, KnownRoutes } from "./apiRegistry";
import { ApiErrorPayload, ErrorCode, isApiErrorPayload } from "./responses";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";

// ─── Type Inference ─────────────────────────────────────────────────────────

/**
 * Extracts the inner payload type U from a route handler returning NextResponse<U>.
 */
type UnwrapNextResponse<T> = T extends (...args: never[]) => infer R
  ? Extract<Awaited<R>, NextResponse<unknown>> extends NextResponse<infer U>
    ? U
    : never
  : never;

type ResolveRoute<Path extends string> =
  FindMatchingRoute<Path> extends keyof KnownRoutes ? FindMatchingRoute<Path> : never;

type RouteHandler<Path extends string, M extends HttpMethod> =
  KnownRoutes[ResolveRoute<Path>][M & keyof KnownRoutes[ResolveRoute<Path>]];

type RouteMethods<Path extends string> = Extract<keyof KnownRoutes[ResolveRoute<Path>], HttpMethod>;

type RouteSuccessResult<Path extends string, M extends HttpMethod> = Exclude<
  UnwrapNextResponse<RouteHandler<Path, M>>,
  ApiErrorPayload<ErrorCode>
>;

type RouteErrorResult<Path extends string, M extends HttpMethod> = Extract<
  UnwrapNextResponse<RouteHandler<Path, M>>,
  ApiErrorPayload<ErrorCode>
>;

export async function apiFetch<
  Path extends string,
  Method extends RouteMethods<Path> = RouteMethods<Path>,
>(
  path: Path extends CheckPath<Path> ? Path : CheckPath<Path>,
  options: RequestInit & { method: Method },
): Promise<
  | [RouteSuccessResult<Path, Method>, null]
  | [null, RouteErrorResult<Path, Method> | ApiErrorPayload<"system:unknown-error">]
>;

export async function apiFetch(
  path: string,
  options: RequestInit & { method: string },
): Promise<unknown> {
  try {
    const res = await fetch(path, options);

    // 1. Read the body as text first to safely handle empty responses.
    const text = await res.text();

    let payload;
    // An empty HTTP body resolves to an empty string "" (falsy).
    // Valid JSON primitives like `0`, `null`, `false`, or `""` serialize to 
    // length > 0 strings (e.g. `"0"`, `"null"`, `'""'`), which are all truthy.
    // This perfectly catches empty responses (like 204) while preserving valid JSON.
    if (!text) {
      payload = undefined;
    } else {
      // 2. Parse the payload safely based on Content-Type
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        try {
          payload = JSON.parse(text);
        } catch {
          return [
            null,
            {
              code: "system:unknown-error",
              message: "Server returned malformed JSON.",
            },
          ];
        }
      } else {
        // For non-JSON responses, return the raw text
        payload = text;
      }
    }

    // 3. Strict error validation
    if (!res.ok) {
      return [
        null,
        isApiErrorPayload(payload)
          ? payload
          : {
              code: "system:unknown-error",
              message: "An error occurred but the server returned an unrecognized format.",
            },
      ];
    }

    // 4. Return the full response payload directly to the developer
    return [payload, null];
  } catch (error) {
    // Network errors (like offline), CORS errors, etc.
    return [
      null,
      {
        code: "system:unknown-error",
        message: error instanceof Error ? error.message : "A network error occurred.",
      },
    ];
  }
}
