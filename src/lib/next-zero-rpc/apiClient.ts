import type { CheckPath, FindMatchingRoute, KnownRoutes } from "./apiRegistry";
import { ApiErrorPayload, InferApiResponse, isApiErrorPayload } from "./responses";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";

type ResolveRoute<Path extends string> = FindMatchingRoute<Path> extends keyof KnownRoutes
  ? FindMatchingRoute<Path>
  : never;

type RouteMethods<Path extends string> = Extract<keyof KnownRoutes[ResolveRoute<Path>], HttpMethod>;

type RouteResult<Path extends string, M extends HttpMethod> = InferApiResponse<
  KnownRoutes[ResolveRoute<Path>][M & keyof KnownRoutes[ResolveRoute<Path>]],
  ApiErrorPayload
>;

export async function apiFetch<
  Path extends string,
  Method extends RouteMethods<Path> = RouteMethods<Path>,
>(
  path: Path extends CheckPath<Path> ? Path : CheckPath<Path>,
  options: RequestInit & { method: Method },
): Promise<[RouteResult<Path, Method>, null] | [null, ApiErrorPayload]>;

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
          } as ApiErrorPayload,
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
          : ({
              code: "system:unknown-error",
              message: "An error occurred but the server returned an unrecognized format.",
            } as ApiErrorPayload),
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
      } as ApiErrorPayload,
    ];
  }
}
