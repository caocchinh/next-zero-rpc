export const RESPONSES_CODE = `/**
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

export const ROUTE_TS_CODE = `import { createApiError, createApiSuccess } from "@/lib/next-zero-rpc/responses";
import { NextRequest } from "next/server";

type Params = { params: Promise<{ userId: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  const { userId } = await params;

  if (userId === "not-found") {
    return createApiError("resource:not-found", 404, {
      userId: ["User not found in the database"],
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
      userId: ["Cannot delete admin user"],
    });
  }

  // Returning 204 No Content
  return createApiSuccess(undefined, 204);
}
`;

export const COMPLEX_TYPES_ROUTE_CODE = `import { createApiError, createApiSuccess } from "@/lib/next-zero-rpc/responses";
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

export const METHODS_ROUTE_CODE = `import { createApiSuccess } from "@/lib/next-zero-rpc/responses";

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
  return new Response(null, { status: 200 });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: { Allow: "GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS" },
  });
}
`;

export const CATCHALL_ROUTE_CODE = `import { createApiSuccess } from "@/lib/next-zero-rpc/responses";
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

export const BRUH_ROUTE_CODE = `import { createApiSuccess } from "@/lib/next-zero-rpc/responses";

export async function GET() {
  return createApiSuccess({
    success: true,
    message: "This route is inside a route group (skibidi)!",
    data: "skibidi toilet",
  });
}
`;

export const CLIENT_TSX_CODE = `import { apiFetch } from "@/lib/next-zero-rpc/apiClient";
import { assertNever } from "@/lib/next-zero-rpc/responses";

// 1. Precise Error Type Narrowing
const [ data, err ] = await apiFetch("/api/users/123", { method: "GET" });

if (err) {
  // TypeScript narrows the error code specifically to this route!
  switch (err.code) {
    case "resource:not-found":
      console.error("User not found!");
      break;
    case "system:unknown-error":
      console.error("Network error");
      break;
    default:
      assertNever(err.code); // TS Error if you miss a case!
  }
} else {
  console.log(data.name);
}

// 2. Extreme Recursive Type Inference
const [ res2, err2 ] = await apiFetch("/api/extreme/complex-types", { method: "POST" });

// 3. Deeply Nested Catch-All Routes
const [ res3, err3 ] = await apiFetch(
  "/api/extreme/acme/projects/xyz/tasks/a/b/c",
  { method: "GET" }
);

// 4. Strict Method Matching
const [ resGet, errGet ] = await apiFetch("/api/extreme/methods", { method: "GET" });

// 5. Route Groups Support
const [ resBruh, errBruh ] = await apiFetch("/api/bruh", { method: "GET" });
`;

export const API_REGISTRY_CODE = `// --- BEGIN GENERATED API REGISTRY ---
// This section is auto-generated. Do not edit manually.
// Run your dev server or \`node src/lib/next-zero-rpc/update-api-registry.mjs\` to regenerate.
// /api/auth
import type * as AuthLoginRoute from "@/app/api/auth/login/route";

// /api/bruh
import type * as BruhRoute from "@/app/api/(skibidi)/bruh/route";

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

  // /api/bruh
  "/api/bruh": typeof BruhRoute;

  // /api/extreme
  "/api/extreme/[orgId]/projects/[projectId]/tasks/[...catchall]": typeof ExtremeOrgIdProjectsProjectIdTasksCatchallRoute;
  "/api/extreme/complex-types": typeof ExtremeComplexTypesRoute;
  "/api/extreme/methods": typeof ExtremeMethodsRoute;

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
  : K extends [\`[...\${string}]\`]
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

export type FindMatchingRoute<Path extends string> = {
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

export const API_CLIENT_CODE = `import { NextResponse } from "next/server";
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
`;

export const UPDATE_REGISTRY_CODE = `import fs from "fs";
import path from "path";

function detectBaseDir() {
  const cwd = process.cwd();
  return fs.existsSync(path.join(cwd, "src")) ? "src" : ".";
}

const BASE_DIR = detectBaseDir();
const API_DIR = path.join(process.cwd(), BASE_DIR, "app/api");
const REGISTRY_FILE = path.join(process.cwd(), BASE_DIR, "lib/next-zero-rpc/apiRegistry.ts");
const BRACKET_DOT_REGEX = /[\[\].()]/g;

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
    const urlSegments = posixRouteDir.split("/").filter(segment => !(segment.startsWith("(") && segment.endsWith(")")));
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
    "  : K extends [\`[...\${string}]\`]",
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
    "export type FindMatchingRoute<Path extends string> = {",
    "  [K in keyof KnownRoutes & string]: MatchSegments<Split<StripQuery<Path>>, Split<K>> extends true",
    "    ? K",
    "    : never;",
    "}[keyof KnownRoutes & string];",
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
