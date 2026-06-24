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
] as const satisfies PrefixedError<"system">[];

export const AUTH_ERRORS = [
  "auth:unauthorized",
  "auth:forbidden",
  "auth:not-logged-in",
] as const satisfies PrefixedError<"auth">[];

export const VALIDATION_ERRORS = [
  "validation:missing-required-fields",
  "validation:invalid-payload",
  "validation:rate-limit-exceeded",
] as const satisfies PrefixedError<"validation">[];

// ─── Combine all error codes ────────────────────────────────────────────────
// Add your custom error arrays here when you create them.

export const ERROR_CODES = [
  ...SYSTEM_ERRORS,
  ...AUTH_ERRORS,
  ...VALIDATION_ERRORS,
] as const;

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

type ErrorMessages = {
  [K in ErrorCode]: `error:${K}`;
};

export const ERROR_MESSAGES = Object.fromEntries(
  ERROR_CODES.map((code) => [code, `error:${code}`]),
) as ErrorMessages;

// ─── Payload Types ──────────────────────────────────────────────────────────

export interface ApiErrorPayload {
  code: ErrorCode;
  details?: Record<string, string[]>;
  message: string;
}

export type ApiSuccessPayload<T> = T extends void | undefined ? { data?: never } : { data: T };

// ─── API Route Helpers ──────────────────────────────────────────────────────

/**
 * Create a consistent API error response.
 *
 * @example
 * return createApiError("auth:unauthorized", HTTP_STATUS_ERROR.UNAUTHORIZED);
 */
export function createApiError(
  code: ErrorCode,
  statusCode: ErrorHttpStatusCode,
  details?: Record<string, string[]>,
): NextResponse<ApiErrorPayload> {
  const message = ERROR_MESSAGES[code];

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
export function createApiSuccess<T>(
  data?: T,
  statusCode: SuccessHttpStatusCode = HTTP_STATUS_SUCCESS.OK,
): NextResponse<ApiSuccessPayload<T>> {
  return NextResponse.json(
    {
      data,
    } as ApiSuccessPayload<T>,
    {
      status: statusCode,
    },
  );
}

// ─── Type Inference ─────────────────────────────────────────────────────────

/**
 * Infer the success response type from an API route handler function.
 * Filters out ApiErrorPayload to only return the success payload.
 */
export type InferApiResponse<T, E = never> = T extends (...args: never[]) => infer R
  ? Extract<Awaited<R>, NextResponse<unknown>> extends NextResponse<infer U>
    ? Exclude<U, E>
    : never
  : never;

/**
 * Type guard to check if an unknown payload is an ApiErrorPayload.
 */
export function isApiErrorPayload(payload: unknown): payload is ApiErrorPayload {
  if (!payload || typeof payload !== "object") return false;

  const p = payload as Record<string, unknown>;

  return (
    typeof p.code === "string" &&
    typeof ERROR_MESSAGES[p.code as ErrorCode] === "string" &&
    typeof p.message === "string"
  );
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
 */
export function createServiceError(
  code: ErrorCode,
  details?: Record<string, string[]>,
): ServiceResponse<null, ServiceError> {
  const message = ERROR_MESSAGES[code];

  return [
    null,
    {
      code,
      details,
      message,
    },
  ];
}

/**
 * Create a consistent server action success response.
 *
 * @example
 * return createServiceSuccess({ id: "123", name: "John" });
 * return createServiceSuccess(); // void success
 */
export function createServiceSuccess<T>(data?: T): ServiceResponse<T, null> {
  if (data === undefined) {
    return [null, null];
  }
  return [data, null];
}

/**
 * Error class for business logic violations that should NOT be retried.
 */
export class BusinessLogicError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BusinessLogicError";
    Object.setPrototypeOf(this, BusinessLogicError.prototype);
  }
}
