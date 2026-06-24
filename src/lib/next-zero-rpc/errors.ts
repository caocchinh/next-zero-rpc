/**
 * Error constants for consistent error handling across the application
 */

import { NextResponse } from "next/server";

type PrefixedError<T extends string> = `${T}:${string}`;

export const AUTH_ERRORS = [
  "auth:not-logged-in",
  "auth:session-verification-failed",
  "auth:unauthorized",
  "auth:forbidden",
  "auth:not-vinschool-domain",
  "auth:not-student",
  "auth:invalid-student-credentials",
  "auth:teacher-verification-fetch-failed",
] as const satisfies PrefixedError<"auth">[];

export const ORDER_ERRORS = [
  "order:not-found",
  "order:duplicate-order",
  "order:submission-failed",
  "order:status-conflict",
  "order:expired",
  "order:underpayment",
  "order:already-approved",
  "order:invalid-ticket-type",
  "order:tickets-sold-out",
  "order:tier-not-found",
  "order:max-tickets-reached",
  "order:invalid-buyer-type",
  "order:sales-info-fetch-failed",
  "order:ticket-info-fetch-failed",
  "order:event-info-fetch-failed",
] as const satisfies PrefixedError<"order">[];

export const HOLD_ERRORS = [
  "hold:creation-failed",
  "hold:release-failed",
  "hold:active-hold-exists",
  "hold:no-active-hold",
  "hold:recovery-failed",
] as const satisfies PrefixedError<"hold">[];

export const IDENTITY_ERRORS = [
  "identity:not-verified",
  "identity:upload-failed",
  "identity:already-submitted",
  "identity:invalid-file-type",
  "identity:file-size-too-large",
  "identity:file-upload-failed",
] as const satisfies PrefixedError<"identity">[];

export const SYSTEM_ERRORS = [
  "system:cache-error",
  "system:database-error",
  "system:internal-server-error",
  "system:unknown-error",
  "system:cleanup-failed",
  "system:student-list-fetch-failed",
  "system:r2-credentials-missing",
] as const satisfies PrefixedError<"system">[];

export const VALIDATION_ERRORS = [
  "validation:missing-required-fields",
  "validation:invalid-payload",
  "validation:rate-limit-exceeded",
  "validation:already-checked-in",
] as const satisfies PrefixedError<"validation">[];

export const CHECKIN_ERRORS = [
  "checkin:already-checked-in",
  "checkin:invalid-session",
  "checkin:no-ticket",
  "checkin:not-verified",
] as const satisfies PrefixedError<"checkin">[];

// Combined error codes for routing and user feedback
export const ERROR_CODES = [
  ...AUTH_ERRORS,
  ...ORDER_ERRORS,
  ...HOLD_ERRORS,
  ...IDENTITY_ERRORS,
  ...SYSTEM_ERRORS,
  ...VALIDATION_ERRORS,
  ...CHECKIN_ERRORS,
] as const;

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

export type ErrorCode = (typeof ERROR_CODES)[number];

export type SuccessHttpStatusCode = (typeof HTTP_STATUS_SUCCESS)[keyof typeof HTTP_STATUS_SUCCESS];
export type ErrorHttpStatusCode = (typeof HTTP_STATUS_ERROR)[keyof typeof HTTP_STATUS_ERROR];

type ErrorMessages = {
  [K in ErrorCode]: `error:${K}`;
};

// User-friendly error messages dynamically generated
export const ERROR_MESSAGES = Object.fromEntries(
  ERROR_CODES.map((code) => [code, `error:${code}`]),
) as ErrorMessages;

export interface ApiErrorPayload {
  code: ErrorCode;
  details?: Record<string, string[]>;
  message: string;
}

export type ApiSuccessPayload<T = void> = T extends void | undefined
  ? { data?: never }
  : { data: T };

/**
 * Helper function to create consistent API error responses and success responses to the client
 *
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

export function createApiSuccess<T = void>(
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

/**
 * Helper function to infer the response type from an API function.
 * Filters out ApiErrorPayload to only return the success payload.
 */
export type InferApiResponse<T, E = never> = T extends (...args: never[]) => infer R
  ? Extract<Awaited<R>, NextResponse<unknown>> extends NextResponse<infer U>
    ? Exclude<U, E>
    : never
  : never;

/**
 * Type guard to check if an unknown payload is an ApiErrorPayload
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

/**
 * Error object structure for server actions
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
 * Helper function to create consistent server action error responses to the client
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
 * Helper function to create consistent server action success responses to the client
 */
export function createServiceSuccess<T>(data?: T): ServiceResponse<T, null> {
  if (data === undefined) {
    return [null, null];
  }
  return [data, null];
}

/**
 * Error class for business logic violations that should NOT be retried
 */
export class BusinessLogicError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BusinessLogicError";
    // Ensure the prototype is set correctly for instanceof checks
    Object.setPrototypeOf(this, BusinessLogicError.prototype);
  }
}
