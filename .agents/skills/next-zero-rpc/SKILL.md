---
name: next-zero-rpc
description: Write Next.js API routes and type-safe fetch clients using next-zero-rpc. Use when the user asks to create an API route, fetch data, handle API errors, or implement server actions.
---

# next-zero-rpc

## Quick start

**Route Handler (app/api/users/route.ts):**
```typescript
import { createApiSuccess, createApiError, HTTP_STATUS_ERROR } from "@/lib/next-zero-rpc/responses";

export async function GET() {
  const user = await db.getUser();
  if (!user) {
    // The code must be a literal string from the configured ERROR_CODES
    return createApiError("resource:not-found", HTTP_STATUS_ERROR.NOT_FOUND); 
  }
  return createApiSuccess({ id: user.id, name: user.name });
}
```

**Client Fetch:**
```typescript
import { apiFetch } from "@/lib/next-zero-rpc/apiClient";
import { assertNever } from "@/lib/next-zero-rpc/responses";

const [data, err] = await apiFetch("/api/users", { method: "GET" });

if (err) {
  // TS automatically narrows err.code to "resource:not-found" | "system:unknown-error"
  const code = err.code;
  switch (code) {
    case "resource:not-found":
      console.error("User missing");
      break;
    case "system:unknown-error": // Always explicitly handle network/fallback errors
      console.error(err.message);
      break;
    default:
      assertNever(code); // Throws a TS error if any code is unhandled
  }
  return;
}

// data is now fully typed
console.log(data.name);
```

## Workflows

### 1. Creating API Routes
- **Always `export` HTTP method handlers** (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`). The registry generator skips any `route.ts` file with no exports — an unexported handler is **invisible to the type system** and will not appear in `KnownRoutes`.
- **DO NOT** use `NextResponse.json()` directly. Always use the provided helpers.
- **Success**: Use `return createApiSuccess(payload, statusCode?)`. For HTTP 204 (No Content), simply call `createApiSuccess()`.
  - ⚠️ The `statusCode` **must use `HTTP_STATUS_SUCCESS` constants** from `responses.ts` (e.g. `HTTP_STATUS_SUCCESS.OK`, `HTTP_STATUS_SUCCESS.CREATED`). Never pass a raw number like `200`.
- **Errors**: Use `return createApiError("category:error-name", statusCode, { details? })`.
  - ⚠️ The `statusCode` **must use `HTTP_STATUS_ERROR` constants** from `responses.ts` (e.g. `HTTP_STATUS_ERROR.NOT_FOUND`, `HTTP_STATUS_ERROR.UNAUTHORIZED`). Never pass a raw number like `404`.
  - ⚠️ The error code **must be a valid `ErrorCode` literal** — i.e. one of the strings defined in `ERROR_CODES` inside `@/lib/next-zero-rpc/responses.ts`. Passing an arbitrary string is a **TypeScript compile error**. If you need a new code, add it to the appropriate array in `responses.ts` first (e.g. `RESOURCE_ERRORS`, `AUTH_ERRORS`, etc.).
- **Validation**: Perform input validation inside the handler before calling the helpers.

### 2. Client Fetching (`apiFetch`)
- Always destructure the Go-style tuple return: `const [data, err] = await apiFetch(path, options)`.
- `apiFetch` **never throws**. Network/CORS errors are safely returned as `err.code === "system:unknown-error"`.
- Always check `if (err)` before attempting to access `data`.
- For robust code, use a `switch(err.code)` block ending with `default: assertNever(err.code)` to guarantee exhaustive error handling.
- **Path flexibility** — the path argument can be a hardcoded string literal **or** a template literal with runtime variables. Both are fully type-safe:
  ```typescript
  // Hardcoded string — full type safety
  await apiFetch("/api/users/abc-123", { method: "GET" });

  // Single runtime variable — equally type-safe
  const userId = "abc-123";
  await apiFetch(`/api/users/${userId}`, { method: "GET" });

  // Multiple runtime variables across segments — still fully type-safe
  // (e.g. for a route like /api/orgs/[orgId]/projects/[projectId]/tasks/[taskId])
  const orgId = "org-1";
  const projectId = "proj-42";
  const taskId = "task-99";
  await apiFetch(`/api/orgs/${orgId}/projects/${projectId}/tasks/${taskId}`, { method: "PATCH" });
  ```
- **Method narrowing** — the `method` option is **not** a generic `string`. It is narrowed to **only the HTTP methods exported from the matched route**. If a route only exports `GET` and `POST`, passing `method: "DELETE"` is a **TypeScript compile error**.
- **Route Groups** — Next.js route groups like `(admin)` are completely ignored in the fetch path. For a handler at `app/api/(admin)/users/route.ts`, the correct path is `/api/users`.
- **Query Strings** — Just append query parameters directly to the path string (e.g., `/api/users?active=true`). The type system safely strips them before validating the route path.

### 3. Server Actions & Services
- When writing backend functions that aren't Next.js route handlers, use `createServiceSuccess(payload)` and `createServiceError(code, options?)`.
  - ⚠️ Same rule applies: the `code` argument **must be a valid `ErrorCode`** from `ERROR_CODES` in `responses.ts`. Never pass an arbitrary string.
- These return standard JavaScript tuples `[data, null]` or `[null, error]` instead of Next.js Response objects, making them perfect for server actions.
