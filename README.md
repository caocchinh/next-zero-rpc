# next-zero-rpc

Type-safe fetch for Next.js — zero runtime, zero config, zero dependencies.

```bash
npx next-zero-rpc init
```

**Four files. Full type safety. Error type narrowing. 1.8 KB runtime.**

## Quick Start

```bash
# 1. Install into your Next.js project
npx next-zero-rpc init

# 2. Add plugin to next.config.ts
```

```typescript
import { withApiRegistry } from "./src/lib/next-zero-rpc/update-api-registry.mjs";
export default withApiRegistry(nextConfig);
```

```typescript
// 3. Write route handlers with typed responses
import { createApiSuccess, createApiError, HTTP_STATUS_ERROR } from "@/lib/next-zero-rpc/responses";

export async function GET(req: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  const user = await db.users.find(userId);

  if (!user) return createApiError("resource:not-found", HTTP_STATUS_ERROR.NOT_FOUND);

  return createApiSuccess({ id: user.id, name: user.name });
}
```

```typescript
// 4. Fetch with full type safety + error narrowing
const [data, err] = await apiFetch("/api/users/123", { method: "GET" });

if (err) {
  // err.code narrows to ONLY the errors this route can return
  switch (err.code) {
    case "resource:not-found":
      break;
    case "system:unknown-error":
      break;
    default:
      assertNever(err.code); // compile-time exhaustiveness check
  }
} else {
  console.log(data.name); // ← fully typed
}
```

## Documentation

See the full documentation in [`packages/cli/README.md`](./packages/cli/README.md).

## Development

```bash
pnpm install
pnpm dev
```

## License

MIT
