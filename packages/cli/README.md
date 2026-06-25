# next-zero-rpc

Type-safe fetch for Next.js — zero runtime, zero config, zero dependencies.

```bash
npx next-zero-rpc init
```

**That's it.** Four files. Full type safety. 2 KB runtime.

## What it does

`next-zero-rpc` gives you **compile-time type-safe `fetch`** for your Next.js App Router API routes — without changing how you write backends.

```typescript
// ✅ Full autocomplete on paths, methods, and response types
const [data, err] = await apiFetch("/api/users/123", { method: "GET" });

// ✅ TypeScript errors on invalid paths
const [data, err] = await apiFetch("/api/typo", { method: "GET" }); // ← compile error

// ✅ TypeScript errors on invalid methods
const [data, err] = await apiFetch("/api/users/123", { method: "DELETE" }); // ← error if DELETE not exported
```

### How it compares

| Feature                    | next-zero-rpc | tRPC        | raw fetch |
| -------------------------- | ------------- | ----------- | --------- |
| Type-safe paths            | ✅            | ✅          | ❌        |
| Type-safe responses        | ✅            | ✅          | ❌        |
| Type-safe methods          | ✅            | N/A         | ❌        |
| Zero runtime cost          | ✅ (2 KB)     | ❌ (~14 KB) | ✅        |
| Zero config                | ✅            | ❌          | ✅        |
| Works with existing routes | ✅            | ❌          | ✅        |
| Dynamic params `[id]`      | ✅            | ✅          | N/A       |
| Catch-all `[...slug]`      | ✅            | ✅          | N/A       |
| Go-style error handling    | ✅            | ❌          | ❌        |
| Dependencies               | 0             | 5+          | 0         |

## Setup

### 1. Install

```bash
npx next-zero-rpc init
```

This copies 4 files into `lib/next-zero-rpc/` (or `src/lib/next-zero-rpc/` if your project uses the `src/` directory):

| File                      | Purpose                    | Ships to browser? |
| ------------------------- | -------------------------- | ----------------- |
| `apiClient.ts`            | Type-safe fetch wrapper    | ✅ (~2 KB)        |
| `apiRegistry.ts`          | Auto-generated route types | ❌ (types only)   |
| `responses.ts`            | Error/success helpers      | ❌ (server only)  |
| `update-api-registry.mjs` | Code generator + plugin    | ❌ (dev only)     |

### 2. Add the plugin to `next.config.ts`

```typescript
// If using src/ directory:
import { withApiRegistry } from "./src/lib/next-zero-rpc/update-api-registry.mjs";

// If NOT using src/ directory:
import { withApiRegistry } from "./lib/next-zero-rpc/update-api-registry.mjs";

const nextConfig = {};

export default withApiRegistry(nextConfig);
```

### 3. Use it

**In your route handlers** — use `createApiSuccess` / `createApiError`:

```typescript
// app/api/users/[userId]/route.ts  (or src/app/api/users/[userId]/route.ts)
import { createApiSuccess, createApiError, HTTP_STATUS_ERROR } from "@/lib/next-zero-rpc/responses";

export async function GET(req: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const user = await db.users.find(userId);

  if (!user) {
    return createApiError("system:unknown-error", HTTP_STATUS_ERROR.NOT_FOUND);
  }

  return createApiSuccess({ id: user.id, name: user.name });
}
```

**In your client components** — use `apiFetch`:

```typescript
"use client";
import { apiFetch } from "@/lib/next-zero-rpc/apiClient";

const [data, err] = await apiFetch("/api/users/123", { method: "GET" });

if (err) {
  console.error(err.code, err.message);
} else {
  console.log(data.data.name); // ← fully typed
}
```

## How it works

1. The `withApiRegistry` plugin scans your `app/api` (or `src/app/api`) directory for `route.ts` files
2. It generates type imports in `apiRegistry.ts` mapping each route path to its module type
3. TypeScript infers the available methods and response types from each route's exports
4. `apiFetch` uses these types to validate paths, methods, and infer response shapes at compile time
5. At runtime, `apiFetch` is just a thin `fetch` wrapper with Go-style `[data, error]` returns

The registry auto-updates when you create, modify, or delete route files during development.

## Customization

Since you own all the source files, you can customize anything:

- **Add error codes** — edit the arrays in `responses.ts`
- **Add auth headers** — modify `apiFetch` to inject tokens
- **Add request body types** — extend the type inference in `apiClient.ts`
- **Change the output path** — update `REGISTRY_FILE` in `update-api-registry.mjs`

## License

MIT
