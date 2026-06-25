import { NextResponse } from "next/server";
import type { CheckPath, FindMatchingRoute, KnownRoutes } from "./apiRegistry";
import { ApiErrorPayload, ErrorCode, isApiErrorPayload } from "./responses";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";

// ─── Type Inference ─────────────────────────────────────────────────────────

/**
 * Infer the success response type from an API route handler function.
 * Filters out ApiErrorPayload to only return the success payload.
 */
type InferSuccessApiResponse<T, E = never> = T extends (...args: never[]) => infer R
  ? Extract<Awaited<R>, NextResponse<unknown>> extends NextResponse<infer U>
    ? Exclude<U, E>
    : never
  : never;

type InferErrorApiResponse<T, E = never> = T extends (...args: never[]) => infer R
  ? Extract<Awaited<R>, NextResponse<unknown>> extends NextResponse<infer U>
    ? Extract<U, E>
    : never
  : never;

type ResolveRoute<Path extends string> =
  FindMatchingRoute<Path> extends keyof KnownRoutes ? FindMatchingRoute<Path> : never;

type RouteMethods<Path extends string> = Extract<keyof KnownRoutes[ResolveRoute<Path>], HttpMethod>;

type RouteSuccessResult<Path extends string, M extends HttpMethod> = InferSuccessApiResponse<
  KnownRoutes[ResolveRoute<Path>][M & keyof KnownRoutes[ResolveRoute<Path>]],
  ApiErrorPayload<ErrorCode>
>;

type RouteErrorResult<Path extends string, M extends HttpMethod> = InferErrorApiResponse<
  KnownRoutes[ResolveRoute<Path>][M & keyof KnownRoutes[ResolveRoute<Path>]],
  ApiErrorPayload<ErrorCode>
>;

/** Errors produced by apiFetch itself (network failures, malformed JSON, etc.) */

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

    // 1. Handle 204 No Content gracefully
    if (res.status === 204) {
      return [undefined, null];
    }

    // 2. Parse the payload safely based on Content-Type
    let payload;
    const contentType = res.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      try {
        payload = await res.json();
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
      // For non-JSON responses, try returning text or null
      try {
        payload = await res.text();
      } catch {
        payload = null;
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
