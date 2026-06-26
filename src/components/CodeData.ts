export const APP_API_CORE_STATUS_ROUTE_TS_CODE = `import { createApiSuccess } from "@/lib/next-zero-rpc/responses";

export async function GET() {
  return createApiSuccess({
    message: "This route is inside a route group (core)!",
    data: "system operational",
  });
}
`;

export const APP_API_AUTH_LOGIN_ROUTE_TS_CODE = `import { createApiError, createApiSuccess } from "@/lib/next-zero-rpc/responses";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.email || !body.password) {
      return createApiError("validation:missing-required-fields", 400);
    }

    if (body.email !== "admin@vinschool.edu.vn" || body.password !== "password") {
      return createApiError("auth:unauthorized", 401);
    }

    return createApiSuccess({
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI...",
      user: { id: "123", email: body.email },
    });
  } catch {
    return createApiError("validation:invalid-payload", 400);
  }
}
`;

export const APP_API_EXTREME_ORGID_PROJECTS_PROJECTID_TASKS_CATCHALL_ROUTE_TS_CODE = `import { createApiSuccess } from "@/lib/next-zero-rpc/responses";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string; projectId: string; catchall: string[] }> },
) {
  const p = await params;

  const payload = {
    resolvedOrgId: p.orgId,
    resolvedProjectId: p.projectId,
    dynamicSegments: p.catchall,
    deeplyNestedMatrix: {
      layer1: {
        layer2: {
          layer3: [
            [
              { x: 1, y: 2 },
              { x: 3, y: 4 },
            ],
            [
              { x: 5, y: 6 },
              { x: 7, y: 8 },
            ],
          ] as const,
        },
      },
    },
  };

  return createApiSuccess(payload);
}
`;

export const APP_API_EXTREME_COMPLEX_TYPES_ROUTE_TS_CODE = `import { createApiError, createApiSuccess } from "@/lib/next-zero-rpc/responses";
import { NextRequest } from "next/server";

// We create insanely complicated types to test TypeScript's limits
type DiscriminatedUnion =
  | { type: "success"; payload: { id: string; metrics: Record<string, number[]> } }
  | { type: "failure"; reason: string; code: number };

type RecursiveTree<T> = {
  value: T;
  children?: RecursiveTree<T>[];
};

type IntersectionTest = { base: string } & ({ variantA: number } | { variantB: boolean });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.triggerError) {
      return createApiError("system:internal-server-error", 500);
    }

    const unionData: DiscriminatedUnion = {
      type: "success",
      payload: { id: "idx-999", metrics: { cpu: [10, 20, 30], mem: [50, 60] } },
    };

    const tree: RecursiveTree<DiscriminatedUnion> = {
      value: unionData,
      children: [
        {
          value: { type: "failure", reason: "timeout", code: 408 },
          children: [],
        },
      ],
    };

    const intersection: IntersectionTest = {
      base: "test",
      variantB: true,
    };

    const payload = {
      union: unionData,
      tree,
      intersection,
      matrixStringTuple: ["a", "b", "c"] as const,
      nullableField: null,
      optionalField: undefined as string | undefined,
      bigIntSimulate: "9007199254740991",
    };

    return createApiSuccess(payload);
  } catch {
    return createApiError("validation:invalid-payload", 400);
  }
}
`;

export const APP_API_EXTREME_METHODS_ROUTE_TS_CODE = `import { createApiSuccess } from "@/lib/next-zero-rpc/responses";

export async function GET() {
  const payload = { method: "GET" as const, data: [1, 2, 3] };
  return createApiSuccess(payload);
}

export async function POST() {
  const payload = { method: "POST" as const, createdId: 42 };

  return createApiSuccess(payload);
}

export async function PUT() {
  const payload = { method: "PUT" as const, updated: true };
  return createApiSuccess(payload);
}

export async function DELETE() {
  const payload = { method: "DELETE" as const, deleted: true };
  return createApiSuccess(payload);
}

export async function PATCH() {
  const payload = { method: "PATCH" as const, patchedFields: ["name"] };
  return createApiSuccess(payload);
}

export async function HEAD() {
  // HEAD typically doesn't return a body but we can see what typescript infers
  return new Response(null, { status: 200 });
}

export async function OPTIONS() {
  // OPTIONS might return some allow headers
  return new Response(null, {
    status: 204,
    headers: { Allow: "GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS" },
  });
}
`;

export const APP_API_USERS_ACTIVE_ROUTE_TS_CODE = `import { createApiSuccess } from "@/lib/next-zero-rpc/responses";

export async function GET() {
  return createApiSuccess({
    activeUsers: [
      { id: "active-1", name: "Alice", role: "admin" },
      { id: "active-2", name: "Bob", role: "member" },
    ],
    count: 2,
  });
}
`;

export const APP_API_USERS_USERID_ROUTE_TS_CODE = `import { createApiError, createApiSuccess } from "@/lib/next-zero-rpc/responses";
import { NextRequest } from "next/server";

type Params = { params: Promise<{ userId: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const { userId } = await params;

  if (userId === "not-found") {
    return createApiError("system:database-error", 404, {
      details: {
        userId: ["User not found in the database"],
      },
    });
  }

  return createApiSuccess({
    id: userId,
    name: "John Doe",
    role: "student",
  });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { userId } = await params;

  try {
    const body = await req.json();

    if (!body.name) {
      return createApiError("validation:missing-required-fields", 400);
    }

    return createApiSuccess({
      id: userId,
      name: body.name,
      updatedAt: new Date().toISOString(),
    });
  } catch {
    return createApiError("validation:invalid-payload", 400);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { userId } = await params;

  if (userId === "admin") {
    return createApiError("auth:forbidden", 403, {
      details: {
        userId: ["Cannot delete admin user"],
      },
    });
  }

  // Returning 204 No Content
  return createApiSuccess(undefined, 204);
}
`;

export const LIB_NEXT_ZERO_RPC_APICLIENT_TS_CODE = `import { NextResponse } from "next/server";
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
    // Valid JSON primitives like \`0\`, \`null\`, \`false\`, or \`""\` serialize to 
    // length > 0 strings (e.g. \`"0"\`, \`"null"\`, \`'""'\`), which are all truthy.
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
`;

export const LIB_NEXT_ZERO_RPC_APIREGISTRY_TS_CODE = `// --- BEGIN GENERATED API REGISTRY ---
// This section is auto-generated. Do not edit manually.
// Run your dev server or \`node src/lib/next-zero-rpc/update-api-registry.mjs\` to regenerate.
// /api/status
import type * as StatusRoute from "@/app/api/(core)/status/route";

// /api/auth
import type * as AuthLoginRoute from "@/app/api/auth/login/route";

// /api/extreme
import type * as ExtremeOrgIdProjectsProjectIdTasksCatchallRoute from "@/app/api/extreme/[orgId]/projects/[projectId]/tasks/[...catchall]/route";
import type * as ExtremeComplexTypesRoute from "@/app/api/extreme/complex-types/route";
import type * as ExtremeMethodsRoute from "@/app/api/extreme/methods/route";

// /api/users
import type * as UsersUserIdRoute from "@/app/api/users/[userId]/route";

export type KnownRoutes = {
  // Static Routes & Autocomplete Hints
  // /api/auth
  "/api/auth/login": typeof AuthLoginRoute;

  // /api/extreme
  "/api/extreme/[orgId]/projects/[projectId]/tasks/[...catchall]": typeof ExtremeOrgIdProjectsProjectIdTasksCatchallRoute;
  "/api/extreme/complex-types": typeof ExtremeComplexTypesRoute;
  "/api/extreme/methods": typeof ExtremeMethodsRoute;

  // /api/status
  "/api/status": typeof StatusRoute;

  // /api/users
  "/api/users/[userId]": typeof UsersUserIdRoute;
};
// --- END GENERATED API REGISTRY ---

type Split<S extends string> = S extends \`\${infer Head}/\${infer Tail}\`
  ? [Head, ...Split<Tail>]
  : [S];

type MatchSegment<P extends string, K extends string> = K extends \`[\${string}]\`
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
  : K extends [\`[...\${string}]\`] | [\`[[...\${string}]]\`]
    ? true
    : [P, K] extends [
          [infer PH extends string, ...infer PT extends string[]],
          [infer KH extends string, ...infer KT extends string[]],
        ]
      ? MatchSegment<PH, KH> extends true
        ? MatchSegments<PT, KT>
        : false
      : false;

type StripQuery<Path extends string> = Path extends \`\${infer Base}?\${string}\` ? Base : Path;

export type FindMatchingRoute<Path extends string> = StripQuery<Path> extends keyof KnownRoutes
  ? StripQuery<Path>
  : {
      [K in keyof KnownRoutes & string]: MatchSegments<Split<StripQuery<Path>>, Split<K>> extends true
        ? K
        : never;
    }[keyof KnownRoutes & string];

export type CheckPath<Path extends string> = Path extends ""
  ? keyof KnownRoutes
  : FindMatchingRoute<Path> extends never
    ? keyof KnownRoutes
    : Path;
`;

export const LIB_NEXT_ZERO_RPC_RESPONSES_TS_CODE = `/**
 * next-zero-rpc — Response helpers for API routes and server actions.
 * Customize the error codes below to match your application's domain.
 */

import { NextResponse } from "next/server";

type PrefixedError<T extends string> = \`\${T}:\${string}\`;

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
 * return createApiError("auth:unauthorized", 401, { message: "Custom message" });
 */
export function createApiError<C extends ErrorCode>(
  code: C,
  statusCode: ErrorHttpStatusCode,
  options?: {
    details?: Record<string, string[]>;
    message?: string;
  },
): NextResponse<ApiErrorPayload<C>> {
  return NextResponse.json(
    {
      code,
      details: options?.details,
      message: options?.message,
      // Inject a hidden marker so the client knows this error definitively came from our helper.
      // This allows us to safely narrow errors without shipping all error strings to the client.
      _z_: true,
    } as unknown as ApiErrorPayload<C>,
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
  data: T,
  statusCode?: Exclude<SuccessHttpStatusCode, typeof HTTP_STATUS_SUCCESS.NO_CONTENT>,
): NextResponse<T>;
export function createApiSuccess(
  data?: undefined,
  statusCode?: typeof HTTP_STATUS_SUCCESS.NO_CONTENT,
): NextResponse<undefined>;
export function createApiSuccess<T>(
  data?: T,
  statusCode?: SuccessHttpStatusCode,
): NextResponse<T | undefined> {
  if (data === undefined || statusCode === HTTP_STATUS_SUCCESS.NO_CONTENT) {
    return new NextResponse(null, { status: statusCode ?? 204 });
  }

  return NextResponse.json(data, { status: statusCode ?? 200 });
}

/**
 * Type guard to check if an unknown payload is an ApiErrorPayload.
 */
export function isApiErrorPayload(payload: unknown): payload is ApiErrorPayload<ErrorCode> {
  if (!payload || typeof payload !== "object") return false;

  const p = payload as Record<string, unknown>;

  return p._z_ === true;
}

// ─── Server Action Helpers ──────────────────────────────────────────────────

/**
 * Error object structure for server actions.
 */
export interface ServiceError<C extends ErrorCode = ErrorCode> {
  message: string;
  code: C;
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
 * return createServiceError("validation:invalid-payload", { message: "Custom message" });
 */
export function createServiceError<C extends ErrorCode>(
  code: C,
  options?: {
    details?: Record<string, string[]>;
    message?: string;
  },
): ServiceResponse<null, ServiceError<C>> {
  return [
    null,
    {
      code,
      details: options?.details,
      message: options?.message ?? code,
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
 * Place in the \`default\` branch — TypeScript will error if any case is unhandled.
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
  throw new Error(\`Unhandled discriminant: \${String(value)}\`);
}
`;

export const LIB_NEXT_ZERO_RPC_UPDATE_API_REGISTRY_MJS_CODE = `import fs from "fs";
import path from "path";

function detectBaseDir() {
  const cwd = process.cwd();
  return fs.existsSync(path.join(cwd, "src")) ? "src" : ".";
}

const BASE_DIR = detectBaseDir();
const API_DIR = path.join(process.cwd(), BASE_DIR, "app/api");
const REGISTRY_FILE = path.join(process.cwd(), BASE_DIR, "lib/next-zero-rpc/apiRegistry.ts");
const BRACKET_DOT_REGEX = /[\\[\\].()]/g;

function getRouteFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    if (entry.isDirectory()) {
      getRouteFiles(path.join(dir, entry.name), fileList);
    } else if (entry.name === "route.ts") {
      fileList.push(path.join(dir, entry.name));
    }
  }
  return fileList;
}

export function updateApiRegistry() {
  const routeFiles = getRouteFiles(API_DIR);

  const routes = [];

  for (let i = 0; i < routeFiles.length; i++) {
    const filePath = routeFiles[i];
    const fileContent = fs.readFileSync(filePath, "utf-8");
    if (fileContent.indexOf("export") === -1) continue;

    const relativePath = path.relative(API_DIR, filePath);
    const routeDir = path.dirname(relativePath);

    // Normalize path separators for Windows/Unix compatibility
    const posixRouteDir = routeDir.split(path.sep).join("/");

    // Construct route path, ignoring Next.js route groups like (groupName)
    const urlSegments = posixRouteDir
      .split("/")
      .filter((segment) => !(segment.startsWith("(") && segment.endsWith(")")));
    const urlRouteDir = urlSegments.join("/");
    const routePath = urlRouteDir === "" || urlRouteDir === "." ? "/api" : \`/api/\${urlRouteDir}\`;

    // Construct import name: e.g. /api/admin/prom/verifications/[id]/presign -> AdminPromVerificationsIdPresignRoute
    const parts = urlRouteDir.split("/");
    let importName = "";
    for (let j = 0; j < parts.length; j++) {
      const cleanPart = parts[j].replace(BRACKET_DOT_REGEX, "");
      const words = cleanPart.split("-");
      for (let k = 0; k < words.length; k++) {
        const word = words[k];
        if (word) {
          importName += word.charAt(0).toUpperCase() + word.slice(1);
        }
      }
    }
    importName += "Route";

    const importPath =
      posixRouteDir === "." ? "@/app/api/route" : \`@/app/api/\${posixRouteDir}/route\`;

    routes.push({ importName, importPath, routePath });
  }

  // Sort for types by routePath
  const typeRoutes = routes.slice().sort((a, b) => (a.routePath < b.routePath ? -1 : 1));

  // Sort for imports by importPath using simple string comparison (matches prettier-plugin-sort-imports)
  const importRoutes = routes.slice().sort((a, b) => (a.importPath < b.importPath ? -1 : 1));

  const importLines = [];
  let currentImportGroup = "";
  for (let i = 0; i < importRoutes.length; i++) {
    const r = importRoutes[i];
    const group = r.routePath.split("/")[2] || "root";
    if (group !== currentImportGroup) {
      if (currentImportGroup !== "") importLines.push("");
      importLines.push(\`// /api/\${group}\`);
      currentImportGroup = group;
    }
    importLines.push(\`import type * as \${r.importName} from "\${r.importPath}";\`);
  }

  const typeLines = [];
  let currentTypeGroup = "";
  for (let i = 0; i < typeRoutes.length; i++) {
    const r = typeRoutes[i];
    const group = r.routePath.split("/")[2] || "root";
    if (group !== currentTypeGroup) {
      if (currentTypeGroup !== "") typeLines.push("");
      typeLines.push(\`  // /api/\${group}\`);
      currentTypeGroup = group;
    }
    typeLines.push(\`  "\${r.routePath}": typeof \${r.importName};\`);
  }

  const generatedBlock = \`// --- BEGIN GENERATED API REGISTRY ---
// This section is auto-generated. Do not edit manually.
// Run your dev server or \\\`node \${BASE_DIR === "." ? "" : BASE_DIR + "/"}lib/next-zero-rpc/update-api-registry.mjs\\\` to regenerate.
\${importLines.join("\\n")}

\${typeLines.length === 0 ? "// eslint-disable-next-line @typescript-eslint/no-empty-object-type" : ""}
export type KnownRoutes = {
  // Static Routes & Autocomplete Hints
\${typeLines.join("\\n")}
};
// --- END GENERATED API REGISTRY ---\`.replace(/\\n\\n+/g, "\\n\\n");

  const staticTypes = [
    "",
    "type Split<S extends string> = S extends \`\${infer Head}/\${infer Tail}\`",
    "  ? [Head, ...Split<Tail>]",
    "  : [S];",
    "",
    "type MatchSegment<P extends string, K extends string> = K extends \`[\${string}]\`",
    '  ? P extends ""',
    "    ? false",
    "    : true",
    "  : K extends P",
    "    ? true",
    "    : false;",
    "",
    "type MatchSegments<P extends string[], K extends string[]> = K extends []",
    "  ? P extends []",
    "    ? true",
    "    : false",
    "  : K extends [\`[...\${string}]\`] | [\`[[...\${string}]]\`]",
    "    ? true",
    "    : [P, K] extends [",
    "          [infer PH extends string, ...infer PT extends string[]],",
    "          [infer KH extends string, ...infer KT extends string[]],",
    "        ]",
    "      ? MatchSegment<PH, KH> extends true",
    "        ? MatchSegments<PT, KT>",
    "        : false",
    "      : false;",
    "",
    "type StripQuery<Path extends string> = Path extends \`\${infer Base}?\${string}\` ? Base : Path;",
    "",
    "export type FindMatchingRoute<Path extends string> = StripQuery<Path> extends keyof KnownRoutes",
    "  ? StripQuery<Path>",
    "  : {",
    "      [K in keyof KnownRoutes & string]: MatchSegments<Split<StripQuery<Path>>, Split<K>> extends true",
    "        ? K",
    "        : never;",
    "    }[keyof KnownRoutes & string];",
    "",
    'export type CheckPath<Path extends string> = Path extends ""',
    "  ? keyof KnownRoutes",
    "  : FindMatchingRoute<Path> extends never",
    "    ? keyof KnownRoutes",
    "    : Path;",
  ].join("\\n");

  if (!fs.existsSync(REGISTRY_FILE)) {
    console.log(\`[API Registry] File not found. Creating apiRegistry.ts...\`);
    fs.writeFileSync(REGISTRY_FILE, generatedBlock + "\\n" + staticTypes, "utf-8");
    return;
  }

  const registryContent = fs.readFileSync(REGISTRY_FILE, "utf-8");
  const startMarker = "// --- BEGIN GENERATED API REGISTRY ---";
  const endMarker = "// --- END GENERATED API REGISTRY ---";

  const startIndex = registryContent.indexOf(startMarker);
  let newContent;

  if (startIndex !== -1) {
    const endIndex = registryContent.indexOf(endMarker, startIndex);
    if (endIndex !== -1) {
      newContent =
        registryContent.slice(0, startIndex) +
        generatedBlock +
        registryContent.slice(endIndex + endMarker.length);
    } else {
      console.warn(\`[API Registry] End marker missing in apiRegistry.ts. Rebuilding file...\`);
      newContent = generatedBlock + "\\n" + staticTypes;
    }
  } else {
    console.warn(\`[API Registry] Start marker missing in apiRegistry.ts. Rebuilding file...\`);
    newContent = generatedBlock + "\\n" + staticTypes;
  }

  if (newContent !== registryContent) {
    fs.writeFileSync(REGISTRY_FILE, newContent, "utf-8");
    console.log(\`[API Registry] Updated known routes in apiRegistry.ts\`);
  }
}

// Execute directly if run via CLI (e.g. from package.json script)
if (process.argv[1] && process.argv[1].endsWith("update-api-registry.mjs")) {
  updateApiRegistry();
}

/**
 * Next.js plugin to automatically generate the API registry during development and build.
 * Usage in next.config.ts:
 * export default withApiRegistry(nextConfig);
 */
export function withApiRegistry(nextConfig = {}) {
  // Only run once per process (prevents duplicate watchers in Turbopack/Webpack)
  if (!globalThis.__apiRegistryWatcherSetup) {
    globalThis.__apiRegistryWatcherSetup = true;
    updateApiRegistry();

    // Only setup the watcher in development mode
    if (process.env.NODE_ENV !== "production") {
      if (fs.existsSync(API_DIR)) {
        let timeout;
        fs.watch(API_DIR, { recursive: true }, () => {
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            updateApiRegistry();
          }, 100);
        });
      }
    }
  }
  return nextConfig;
}
`;

export const LIB_NEXT_ZERO_RPC_PATH_INFERENCE_TEST_TS_CODE = `/**
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

type Split<S extends string> = S extends \`\${infer Head}/\${infer Tail}\`
  ? [Head, ...Split<Tail>]
  : [S];

type MatchSegment<P extends string, K extends string> = K extends \`[\${string}]\`
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
  : K extends [\`[...\${string}]\`] | [\`[[...\${string}]]\`]
    ? true
    : [P, K] extends [
          [infer PH extends string, ...infer PT extends string[]],
          [infer KH extends string, ...infer KT extends string[]],
        ]
      ? MatchSegment<PH, KH> extends true
        ? MatchSegments<PT, KT>
        : false
      : false;

type StripQuery<Path extends string> = Path extends \`\${infer Base}?\${string}\` ? Base : Path;

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
    // that picks the static winner via \`Path extends keyof KnownRoutes\`).
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
`;

export const VITEST_CONFIG_TS_CODE = `import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    typecheck: {
      enabled: true,
      tsconfig: "./tsconfig.json",
    },
  },
});
`;
