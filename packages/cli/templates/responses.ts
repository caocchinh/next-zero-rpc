/**
 * next-zero-rpc — Response helpers for API routes and server actions.
 * Customize the error codes below to match your application's domain.
 */

import { NextResponse } from "next/server";

type PrefixedError<T extends string> = `${T}:${string}`;

// ─── Define your error codes here ───────────────────────────────────────────
// Add, remove, or rename error codes to match your application's domain.
// Each array must satisfy the PrefixedError<"prefix"> constraint.

export const SYSTEM_ERRORS = [
  "system:internal-server-error",
  "system:unknown-error",
  "system:database-error",
  "system:timeout",
  "system:service-unavailable",
  "system:maintenance-mode",
  "system:configuration-error",
] as const satisfies PrefixedError<"system">[];

export const AUTH_ERRORS = [
  "auth:unauthorized",
  "auth:forbidden",
  "auth:not-logged-in",
  "auth:token-expired",
  "auth:invalid-token",
  "auth:session-expired",
  "auth:insufficient-permissions",
  "auth:account-locked",
  "auth:account-disabled",
  "auth:email-not-verified",
] as const satisfies PrefixedError<"auth">[];

export const VALIDATION_ERRORS = [
  "validation:missing-required-fields",
  "validation:invalid-payload",
  "validation:rate-limit-exceeded",
  "validation:invalid-format",
  "validation:invalid-type",
  "validation:out-of-range",
  "validation:too-short",
  "validation:too-long",
  "validation:duplicate-entry",
  "validation:invalid-enum-value",
] as const satisfies PrefixedError<"validation">[];

export const RESOURCE_ERRORS = [
  "resource:not-found",
  "resource:already-exists",
  "resource:conflict",
  "resource:gone",
  "resource:locked",
  "resource:immutable",
] as const satisfies PrefixedError<"resource">[];

export const NETWORK_ERRORS = [
  "network:timeout",
  "network:external-service-error",
  "network:dns-resolution-failed",
  "network:connection-refused",
] as const satisfies PrefixedError<"network">[];

export const UPLOAD_ERRORS = [
  "upload:file-too-large",
  "upload:invalid-file-type",
  "upload:upload-failed",
  "upload:quota-exceeded",
] as const satisfies PrefixedError<"upload">[];

// ─── Combine all error codes ────────────────────────────────────────────────
// Add your custom error arrays here when you create them.

export const ERROR_CODES = [
  ...SYSTEM_ERRORS,
  ...AUTH_ERRORS,
  ...VALIDATION_ERRORS,
  ...RESOURCE_ERRORS,
  ...NETWORK_ERRORS,
  ...UPLOAD_ERRORS,
] as const;

const ERROR_CODE_SET: ReadonlySet<string> = new Set(ERROR_CODES);

// ─── HTTP Status Codes ──────────────────────────────────────────────────────

export const HTTP_STATUS_SUCCESS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
} as const;

export const HTTP_STATUS_ERROR = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  CONFLICT: 409,
  PAYLOAD_TOO_LARGE: 413,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

// ─── Derived Types ──────────────────────────────────────────────────────────

export type ErrorCode = (typeof ERROR_CODES)[number];

export type SuccessHttpStatusCode = (typeof HTTP_STATUS_SUCCESS)[keyof typeof HTTP_STATUS_SUCCESS];
export type ErrorHttpStatusCode = (typeof HTTP_STATUS_ERROR)[keyof typeof HTTP_STATUS_ERROR];

// ─── Payload Types ──────────────────────────────────────────────────────────

export interface ApiErrorPayload<C extends ErrorCode> {
  code: C;
  details?: Record<string, string[]>;
  message?: string;
}

// ─── API Route Helpers ──────────────────────────────────────────────────────

/**
 * Create a consistent API error response.
 *
 * @example
 * return createApiError("auth:unauthorized", HTTP_STATUS_ERROR.UNAUTHORIZED);
 * return createApiError("auth:unauthorized", 401, undefined, "Custom message");
 */
export function createApiError<C extends ErrorCode>(
  code: C,
  statusCode: ErrorHttpStatusCode,
  details?: Record<string, string[]>,
  message?: string,
): NextResponse<ApiErrorPayload<C>> {
  return NextResponse.json(
    {
      code,
      details,
      message,
    },
    {
      status: statusCode,
    },
  );
}

/**
 * Create a consistent API success response.
 *
 * @example
 * return createApiSuccess({ users: [...] });
 * return createApiSuccess(undefined, HTTP_STATUS_SUCCESS.NO_CONTENT);
 */
export function createApiSuccess<T>(data: T, statusCode?: SuccessHttpStatusCode): NextResponse<T>;
export function createApiSuccess(
  data?: undefined,
  statusCode?: typeof HTTP_STATUS_SUCCESS.NO_CONTENT,
): NextResponse<undefined>;
export function createApiSuccess<T>(
  data?: T,
  statusCode: SuccessHttpStatusCode = HTTP_STATUS_SUCCESS.OK,
): NextResponse<T | undefined> {
  // 204 No Content must not have a body per HTTP spec
  if (statusCode === HTTP_STATUS_SUCCESS.NO_CONTENT) {
    return new NextResponse(null, { status: 204 }) as NextResponse<T | undefined>;
  }

  return NextResponse.json(data, { status: statusCode });
}

/**
 * Type guard to check if an unknown payload is an ApiErrorPayload.
 */
export function isApiErrorPayload(payload: unknown): payload is ApiErrorPayload<ErrorCode> {
  if (!payload || typeof payload !== "object") return false;

  const p = payload as Record<string, unknown>;

  return typeof p.code === "string" && ERROR_CODE_SET.has(p.code);
}

// ─── Server Action Helpers ──────────────────────────────────────────────────

/**
 * Error object structure for server actions.
 */
export interface ServiceError {
  message: string;
  code: ErrorCode;
  details?: Record<string, string[]>;
}

/**
 * Tuple type for server action responses: [data, error]
 */
type ServiceResponse<S, E = ServiceError> = [S, null] | [null, E];

/**
 * Create a consistent server action error response.
 *
 * @example
 * return createServiceError("validation:invalid-payload");
 * return createServiceError("validation:invalid-payload", undefined, "Custom message");
 */
export function createServiceError(
  code: ErrorCode,
  details?: Record<string, string[]>,
  message?: string,
): ServiceResponse<null, ServiceError> {
  return [
    null,
    {
      code,
      details,
      message: message ?? code,
    },
  ];
}

/**
 * Create a consistent server action success response.
 *
 * @example
 * return createServiceSuccess({ id: "123", name: "John" });
 * return createServiceSuccess(); // void success → [undefined, null]
 */
export function createServiceSuccess<T>(data?: T): ServiceResponse<T | undefined, null> {
  return [data, null];
}

// ─── Exhaustive Check ───────────────────────────────────────────────────────

/**
 * Compile-time exhaustiveness guard for switch/if-else chains.
 * Place in the `default` branch — TypeScript will error if any case is unhandled.
 *
 * @example
 * const code = err.code;
 * switch (code) {
 *   case "auth:forbidden": …; break;
 *   case "system:unknown-error": …; break;
 *   default: assertNever(code);
 * }
 */
export function assertNever(value: never): never {
  throw new Error(`Unhandled discriminant: ${String(value)}`);
}
