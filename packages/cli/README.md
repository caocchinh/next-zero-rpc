# next-zero-rpc

Type-safe fetch for Next.js — zero runtime, zero config, zero dependencies.

```bash
npx next-zero-rpc init
```

**That's it.** Four files. Full type safety. 1.8 KB runtime.

## What it does

`next-zero-rpc` gives you **compile-time type-safe `fetch`** for your Next.js App Router API routes — without changing how you write backends.

```typescript
// ✅ Full autocomplete on paths, methods, and response types
const [data, err] = await apiFetch("/api/users/123", { method: "GET" });

// ✅ TypeScript errors on invalid paths
const [data, err] = await apiFetch("/api/typo", { method: "GET" }); // ← compile error

// ✅ TypeScript errors on invalid methods
const [data, err] = await apiFetch("/api/users/123", { method: "DELETE" }); // ← error if DELETE not exported

// ✅ Error type narrowing — err.code autocompletes only the errors THIS route can return
if (err) {
  const code = err.code;
  switch (code) {
    case "auth:forbidden": // ← only if this route uses createApiError("auth:forbidden", ...)
    case "system:database-error": // ← only if this route uses createApiError("system:database-error", ...)
    case "system:unknown-error": // ← always included as a fallback from apiFetch itself
      break;
    default:
      assertNever(code); // ← TypeScript errors if you miss a case
  }
}
```

### How it compares

| Feature                   | next-zero-rpc        | tRPC        | raw fetch |
| ------------------------- | -------------------- | ----------- | --------- |
| Type-safe paths           | ✅                   | ✅          | ❌        |
| Type-safe responses       | ✅                   | ✅          | ❌        |
| Type-safe methods         | ✅                   | N/A         | ❌        |
| **Error type narrowing**  | ✅                   | ❌          | ❌        |
| Zero runtime cost         | ✅ (1.8 KB minified) | ❌ (~14 KB) | ✅        |
| Zero config               | ✅                   | ❌          | ✅        |
| Standard API routes       | ✅                   | ❌          | ✅        |
| Dynamic params `[id]`     | ✅                   | ✅          | N/A       |
| Catch-all `[...slug]`     | ✅                   | ✅          | N/A       |
| Go-style error handling   | ✅                   | ❌          | ❌        |
| Exhaustive error checking | ✅                   | ❌          | ❌        |
| Server action helpers     | ✅                   | ❌          | N/A       |
| Dependencies              | 0                    | 5+          | 0         |

## Philosophy

**You own the code, not the library.** `next-zero-rpc` is not a locked-in framework—it's a philosophy, a paradigm, and a set of methods for doing things. When you run `init`, we give you four files. From that moment on, they are _yours_ to modify, extend, or delete.

- **Zero vendor lock-in** — There is no black-box `node_modules` dependency dictating your architecture. You own the fetch client, the error codes, and the registry generator.
- **Zero boilerplate** — You write standard Next.js API route handlers using simple response helpers — no decorators, no schema registrations, no complex abstractions. The codegen reads what already exists and builds the type bridge automatically.
- **Not a framework** — It's a type bridge. It infers what your route handlers return and gives your client code full type safety over those responses.
- **Validation is yours** — Input validation (Zod, Valibot, Arktype, manual checks) stays inside your route handler where it belongs. This library doesn't impose a validation layer — that's a feature, not a gap.
- **Non-invasive** — Unlike tRPC or ts-rest, you don't adopt a new API definition pattern. Your routes are regular Next.js routes. The library is invisible.

## Setup

### 1. Install

```bash
npx next-zero-rpc init
```

This copies 4 files into `lib/next-zero-rpc/` (or `src/lib/next-zero-rpc/` if your project uses the `src/` directory):

| File                      | Purpose                             | Ships to browser?      |
| ------------------------- | ----------------------------------- | ---------------------- |
| `apiClient.ts`            | Type-safe fetch wrapper             | ✅ (0.6 KB minified)   |
| `apiRegistry.ts`          | Auto-generated route type registry  | ❌ (types only)        |
| `responses.ts`            | Error/success helpers + error codes | ✅ (1.2 KB minified)\* |
| `update-api-registry.mjs` | Code generator + Next.js plugin     | ❌ (dev only)          |

_\* Only the `isApiErrorPayload` type guard and `ERROR_CODES` set are bundled to the client. The server helpers are dropped._

The CLI also:

- Runs the registry generator once to detect existing routes
- Adds an `"infer-api"` script to your `package.json` for manual regeneration

### 2. Add the plugin to `next.config.ts`

```typescript
// If using src/ directory:
import { withApiRegistry } from "./src/lib/next-zero-rpc/update-api-registry.mjs";

// If NOT using src/ directory:
import { withApiRegistry } from "./lib/next-zero-rpc/update-api-registry.mjs";

const nextConfig = {};

export default withApiRegistry(nextConfig);
```

The plugin auto-updates `apiRegistry.ts` whenever you create, modify, or delete `route.ts` files during development. In production builds, it runs once and skips the file watcher.

### 3. Use it

#### Route handlers — `createApiSuccess` / `createApiError`

```typescript
// app/api/users/[userId]/route.ts
import {
  createApiSuccess,
  createApiError,
  HTTP_STATUS_ERROR,
  HTTP_STATUS_SUCCESS,
} from "@/lib/next-zero-rpc/responses";

export async function GET(req: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const user = await db.users.find(userId);

  if (!user) {
    return createApiError("resource:not-found", HTTP_STATUS_ERROR.NOT_FOUND);
  }

  return createApiSuccess({ id: user.id, name: user.name });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  await db.users.delete(userId);

  // 204 No Content — no body per HTTP spec
  return createApiSuccess();
}
```

#### Client components — `apiFetch`

```typescript
"use client";
import { apiFetch } from "@/lib/next-zero-rpc/apiClient";

const [data, err] = await apiFetch("/api/users/123", { method: "GET" });

if (err) {
  console.error(err.code, err.message); // err.code is narrowed to only this route's errors
} else {
  console.log(data.name); // ← fully typed, payload returned directly
}
```

## Features

### Error Type Narrowing

The standout feature: when you check `err.code` after an `apiFetch` call, TypeScript narrows the union to **only the error codes that specific route handler can actually return** — not every error code in the system.

```typescript
// Route handler returns createApiError("auth:unauthorized", 401)
//                    or createApiError("validation:missing-required-fields", 400)

const [data, err] = await apiFetch("/api/auth/login", { method: "POST" });

if (err) {
  // err.code is: "auth:unauthorized" | "validation:missing-required-fields" | "validation:invalid-payload" | "system:unknown-error"
  // NOT the full 37+ error code union — only what this route can produce
  // (system:unknown-error is always included as a fallback from apiFetch itself)
}
```

This works because:

1. `createApiError` is generic: `createApiError<C extends ErrorCode>(code: C, ...) → NextResponse<ApiErrorPayload<C>>`
2. TypeScript infers the literal `C` from each call site in your handler
3. `InferErrorApiResponse` extracts the union of all `ApiErrorPayload<C>` types from the handler's return type
4. The client sees only those specific error codes

### Go-Style Tuple Returns

Every `apiFetch` call returns `[data, null]` on success or `[null, error]` on failure — never throws.

```typescript
const [data, err] = await apiFetch("/api/orders/checkout", {
  method: "POST",
  body: JSON.stringify({ ticketId: "abc", quantity: 2 }),
});

if (err) {
  // Handle error — err is fully typed with route-specific error codes
  return;
}

// data is fully typed — no casting needed
console.log(data.orderId, data.status);
```

### Exhaustive Error Checking

Use `assertNever` to guarantee you handle every possible error code at compile time:

```typescript
import { assertNever } from "@/lib/next-zero-rpc/responses";

const [data, err] = await apiFetch("/api/users/123", { method: "GET" });

if (err) {
  const code = err.code;
  switch (code) {
    case "system:database-error":
      showToast("Database error, please try again");
      break;
    case "system:unknown-error":
      showToast("Something went wrong");
      break;
    default:
      assertNever(code); // ← TypeScript errors if you miss a case
  }
  return;
}
```

### Dynamic Route Matching

The type system supports Next.js dynamic segments and catch-all routes:

```typescript
// Dynamic segments: [id], [userId], [slug]
const [data, err] = await apiFetch("/api/users/abc-123", { method: "GET" });

// Catch-all segments: [...catchall]
const [data, err] = await apiFetch("/api/extreme/org1/projects/proj1/tasks/a/b/c", {
  method: "POST",
});

// Query strings are stripped before matching
const [data, err] = await apiFetch("/api/users/123?include=profile", { method: "GET" });
```

### Route Groups Support

Next.js route groups like `(groupName)` are natively supported. They are automatically ignored in the URL path mapping and the generated TypeScript types, perfectly matching Next.js behavior:

```typescript
// File: app/api/(admin)/users/route.ts

// The fetch URL correctly skips the (admin) group
const [data, err] = await apiFetch("/api/users", { method: "GET" });
```

> [!NOTE]
> **Conflict-safe:** You don't have to worry about multiple route groups accidentally mapping to the exact same generated TypeScript identifier. Next.js enforces uniqueness during development and at build time. It will automatically raise a `Conflicting routes at /api/...` error if you try to create two identical endpoints (e.g., `(admin)/users/route.ts` and `(public)/users/route.ts`).

### HTTP Method Validation

TypeScript only allows methods that your route handler actually exports:

```typescript
// If route.ts only exports GET and POST:
await apiFetch("/api/auth/login", { method: "POST" }); // ✅
await apiFetch("/api/auth/login", { method: "GET" }); // ✅ (if exported)
await apiFetch("/api/auth/login", { method: "DELETE" }); // ❌ compile error
```

### Function Overloading on `createApiSuccess`

`createApiSuccess` uses TypeScript function overloading for precise return types:

```typescript
// With data → NextResponse<T>
return createApiSuccess({ id: "123", name: "John" });

// Without data (204) → NextResponse<undefined>
return createApiSuccess(undefined, HTTP_STATUS_SUCCESS.NO_CONTENT);

// The overload enforces: if statusCode is NO_CONTENT, data must be undefined
return createApiSuccess({ id: "123" }, HTTP_STATUS_SUCCESS.NO_CONTENT); // ← type error
```

## API Reference

### `responses.ts`

#### Error Codes

Error codes follow a `prefix:description` convention enforced by the `PrefixedError<T>` template literal type. The built-in categories are:

| Category       | Prefix        | Examples                                                   |
| -------------- | ------------- | ---------------------------------------------------------- |
| System         | `system:`     | `system:internal-server-error`, `system:database-error`    |
| Authentication | `auth:`       | `auth:unauthorized`, `auth:token-expired`                  |
| Validation     | `validation:` | `validation:invalid-payload`, `validation:duplicate-entry` |
| Resource       | `resource:`   | `resource:not-found`, `resource:already-exists`            |
| Network        | `network:`    | `network:timeout`, `network:connection-refused`            |
| Upload         | `upload:`     | `upload:file-too-large`, `upload:quota-exceeded`           |

To add a custom category:

```typescript
export const PAYMENT_ERRORS = [
  "payment:card-declined",
  "payment:insufficient-funds",
  "payment:expired-card",
] as const satisfies PrefixedError<"payment">[];

// Then add to ERROR_CODES:
export const ERROR_CODES = [
  ...SYSTEM_ERRORS,
  ...AUTH_ERRORS,
  ...VALIDATION_ERRORS,
  ...RESOURCE_ERRORS,
  ...NETWORK_ERRORS,
  ...UPLOAD_ERRORS,
  ...PAYMENT_ERRORS, // ← add here
] as const;
```

#### HTTP Status Constants

Pre-defined, typed HTTP status code objects to prevent magic numbers:

```typescript
HTTP_STATUS_SUCCESS.OK; // 200
HTTP_STATUS_SUCCESS.CREATED; // 201
HTTP_STATUS_SUCCESS.ACCEPTED; // 202
HTTP_STATUS_SUCCESS.NO_CONTENT; // 204

HTTP_STATUS_ERROR.BAD_REQUEST; // 400
HTTP_STATUS_ERROR.UNAUTHORIZED; // 401
HTTP_STATUS_ERROR.FORBIDDEN; // 403
HTTP_STATUS_ERROR.NOT_FOUND; // 404
HTTP_STATUS_ERROR.METHOD_NOT_ALLOWED; // 405
HTTP_STATUS_ERROR.NOT_ACCEPTABLE; // 406
HTTP_STATUS_ERROR.CONFLICT; // 409
HTTP_STATUS_ERROR.PAYLOAD_TOO_LARGE; // 413
HTTP_STATUS_ERROR.UNPROCESSABLE_ENTITY; // 422
HTTP_STATUS_ERROR.TOO_MANY_REQUESTS; // 429
HTTP_STATUS_ERROR.INTERNAL_SERVER_ERROR; // 500
HTTP_STATUS_ERROR.BAD_GATEWAY; // 502
HTTP_STATUS_ERROR.SERVICE_UNAVAILABLE; // 503
HTTP_STATUS_ERROR.GATEWAY_TIMEOUT; // 504
```

#### Types

| Type                    | Description                                                                                                |
| ----------------------- | ---------------------------------------------------------------------------------------------------------- |
| `ErrorCode`             | Union of all error code string literals                                                                    |
| `SuccessHttpStatusCode` | `200 \| 201 \| 202 \| 204`                                                                                 |
| `ErrorHttpStatusCode`   | `400 \| 401 \| 403 \| ... \| 504`                                                                          |
| `ApiErrorPayload<C>`    | `{ code: C; details?: Record<string, string[]>; message?: string }` — generic over the specific error code |
| `ServiceError`          | `{ code: ErrorCode; message: string; details?: ... }`                                                      |
| `ServiceResponse<S, E>` | `[S, null] \| [null, E]` — Go-style tuple for server actions                                               |

#### Functions

| Function                  | Signature                                                                      | Description                           |
| ------------------------- | ------------------------------------------------------------------------------ | ------------------------------------- |
| `createApiError<C>`       | `(code: C, statusCode, details?, message?) → NextResponse<ApiErrorPayload<C>>` | Create a typed API error response     |
| `createApiSuccess<T>`     | `(data: T, statusCode?) → NextResponse<T>`                                     | Create a typed API success response   |
| `createApiSuccess`        | `(undefined, NO_CONTENT) → NextResponse<undefined>`                            | Overload for 204 No Content           |
| `isApiErrorPayload`       | `(payload: unknown) → payload is ApiErrorPayload<ErrorCode>`                   | Runtime type guard for error payloads |
| `createServiceError`      | `(code, details?, message?) → [null, ServiceError]`                            | Go-style error for server actions     |
| `createServiceSuccess<T>` | `(data?: T) → [T \| undefined, null]`                                          | Go-style success for server actions   |
| `assertNever`             | `(value: never) → never`                                                       | Compile-time exhaustiveness guard     |

### `apiClient.ts`

#### `apiFetch<Path, Method>(path, options)`

Type-safe fetch wrapper that returns Go-style `[data, error]` tuples.

**Type parameters:**

- `Path` — validated against `KnownRoutes` at compile time
- `Method` — restricted to only the HTTP methods exported by the matched route

**Returns:** `Promise<[SuccessType, null] | [null, ErrorType | ApiFetchError]>`

- **Success:** `[data, null]` where `data` is inferred from the route handler's `createApiSuccess` calls
- **Error:** `[null, error]` where `error.code` is narrowed to only the error codes used in that route's `createApiError` calls, plus `"system:unknown-error"` as a fallback
- **204 No Content:** `[undefined, null]`

**Runtime behavior:**

1. Handles `204 No Content` — returns `[undefined, null]` without parsing body
2. Parses JSON responses based on `Content-Type` header
3. Falls back to text for non-JSON responses
4. Validates errors via `isApiErrorPayload` runtime type guard
5. Catches network errors (offline, CORS) and wraps them as `system:unknown-error`

### `apiRegistry.ts`

Auto-generated file containing:

1. **`KnownRoutes`** — A type map from route path strings to their `typeof` module types
2. **Path matching types** — Recursive template literal types that resolve runtime paths (with dynamic segments) to their registry entries:
   - `Split<S>` — Splits a path string into a tuple of segments
   - `MatchSegment<P, K>` — Matches a runtime segment against a route pattern segment (supports `[param]`)
   - `MatchSegments<P, K>` — Recursively matches all segments (supports `[...catchall]`)
   - `StripQuery<Path>` — Strips query string before matching
   - `FindMatchingRoute<Path>` — Resolves a runtime path to its `KnownRoutes` key
   - `CheckPath<Path>` — Validates a path at compile time, falling back to autocomplete hints on mismatch

### `update-api-registry.mjs`

Code generator and Next.js plugin:

- **`updateApiRegistry()`** — Scans `app/api/` for `route.ts` files, generates type imports and the `KnownRoutes` map
- **`withApiRegistry(nextConfig)`** — Next.js plugin that runs the generator on startup and watches for changes in development mode
- Automatically detects `src/` vs root directory layout
- Groups imports and type entries by top-level API directory
- De-duplicates watcher setup via `globalThis.__apiRegistryWatcherSetup`
- Debounces file system events (100ms) to prevent redundant regeneration

## How it works

```
┌─────────────────────────────────────────────────────────────────┐
│                        Build / Dev Time                         │
│                                                                 │
│  app/api/***/route.ts  ──→  update-api-registry.mjs             │
│                               │                                 │
│                               ▼                                 │
│                         apiRegistry.ts                          │
│                         (KnownRoutes type map)                  │
│                               │                                 │
│                               ▼                                 │
│  apiClient.ts ◄──── TypeScript infers paths, methods,           │
│                     success types, AND error types               │
└─────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────┐
│                         Runtime (1.8 KB)                          │
│                                                                   │
│  apiFetch("/api/users/123", { method: "GET" })                    │
│       │                                                           │
│       ▼                                                           │
│  fetch(path, options)                                             │
│       │                                                           │
│       ├─ 204?          → [undefined, null]                        │
│       ├─ JSON + ok?    → [payload, null]                          │
│       ├─ JSON + !ok?   → [null, ApiErrorPayload]  (narrowed)      │
│       ├─ non-JSON?     → [text, null]                             │
│       └─ network fail? → [null, { code: "system:unknown-error" }] │
└───────────────────────────────────────────────────────────────────┘
```

1. The `withApiRegistry` plugin scans your `app/api/` directory for `route.ts` files
2. It generates `import type * as ...` statements in `apiRegistry.ts` mapping each route path to its module type
3. TypeScript infers the available methods and response types from each route's exports
4. `createApiError<C>` preserves the literal error code `C` in the return type, enabling per-route error narrowing
5. `apiFetch` uses these types to validate paths, methods, and infer both success AND error shapes at compile time
6. At runtime, `apiFetch` is just a thin `fetch` wrapper with Go-style `[data, error]` returns

The registry auto-updates when you create, modify, or delete route files during development.

## Server Actions / Service Layer

For server-side code (server actions, service functions), use the Go-style service helpers:

```typescript
// services/user.ts
import { createServiceError, createServiceSuccess } from "@/lib/next-zero-rpc/responses";

export async function getUser(userId: string) {
  const user = await db.users.find(userId);

  if (!user) {
    return createServiceError("resource:not-found", undefined, "User not found");
  }

  return createServiceSuccess({ id: user.id, name: user.name });
}

// Usage in a server action or component:
const [user, err] = await getUser("123");

if (err) {
  console.error(err.code, err.message);
  return;
}

console.log(user.name);
```

## Customization

Since you own all the source files, you can customize anything:

- **Add error codes** — Add new arrays in `responses.ts` with the `PrefixedError<"prefix">` constraint
- **Add auth headers** — Modify `apiFetch` to inject tokens automatically
- **Add request body types** — Extend the type inference in `apiClient.ts`
- **Change the output path** — Update `REGISTRY_FILE` in `update-api-registry.mjs`
- **Override the generator** — The `withApiRegistry` plugin and `updateApiRegistry()` function are fully yours to modify

## CLI Usage

```bash
npx next-zero-rpc              # Install files (same as init)
npx next-zero-rpc init         # Install files into your project
npx next-zero-rpc --force      # Overwrite existing files
npx next-zero-rpc --help       # Show help
```

## Requirements

- Next.js (App Router)
- TypeScript
- Node.js ≥ 18

## License

MIT
