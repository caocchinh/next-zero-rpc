# next-zero-rpc — minimal example

This is the minimal example for [next-zero-rpc](https://github.com/caocchinh/next-zero-rpc).

## Run locally

```bash
# Clone just this example (no git history)
npx degit caocchinh/next-zero-rpc/examples/minimal my-app
cd my-app
npm install
npm run dev
```

Or open it instantly in the browser:

[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/sandbox/github/caocchinh/next-zero-rpc/tree/main/examples/minimal)

---

## What it demonstrates

- Two API route handlers (`/api/status`, `/api/users/[userId]`) using `createApiSuccess` / `createApiError`
- A client component using `apiFetch` with full path, method, and response type inference
- Per-route error code narrowing — `err.code` autocompletes only what each route can return
- Exact static route precedence over dynamic segments (e.g., `/api/users/active` vs `/api/users/[userId]`)
- Go-style `[data, err]` tuple returns

## Full documentation

See the [main README](https://github.com/caocchinh/next-zero-rpc#readme) for the complete API reference, comparison table, and philosophy.

---

### The 2026 Ecosystem Comparison

| Feature                     | next-zero-rpc                          | tRPC                              | ts-rest                         | raw fetch         |
| --------------------------- | -------------------------------------- | --------------------------------- | ------------------------------- | ----------------- |
| Primary Philosophy          | Invisible type bridge                  | End-to-end framework              | Contract-first API              | Platform standard |
| Source of Truth             | Next.js Route Handlers                 | tRPC Routers / Procedures         | Shared contract.ts file         | None              |
| Type-safe paths & responses | ✅                                     | ✅                                | ✅                              | ❌                |
| Per-route error narrowing   | ✅ (via TypeScript generics)           | ❌ (Global error shapes)          | ❌ (Standardized HTTP errors)   | ❌                |
| Next.js App Router Native   | ✅ (Zero changes to standard handlers) | ❌ (Requires tRPC adapters)       | ❌ (Requires ts-rest adapters)  | ✅                |
| Input Validation            | Bring-your-own                         | Built-in (Zod heavily favored)    | Built-in (Zod favored)          | Bring-your-own    |
| OpenAPI Generation          | ❌                                     | ❌ (Requires third-party plugins) | ✅ (First-class citizen)        | ❌                |
| Client Runtime Size         | ~1.8 KB                                | ~15 KB                            | ~3-5 KB                         | 0 KB              |
| Server Actions Integration  | ✅ (Tuple-based Go-style returns)      | ✅ (Excellent RSC/Action support) | Partial (Focus remains on REST) | N/A               |
| Non-TS Client Support       | ❌                                     | ❌                                | ✅ (Via standard REST/OpenAPI)  | ✅                |
| Ecosystem & Community       | Niche / Lightweight                    | Massive / Enterprise-grade        | Very Strong / Standardized      | Ubiquitous        |

#### Architectural Breakdown: Which to Choose?

##### 1. next-zero-rpc (The Minimalist Bridge)

- **Best for:** Teams deeply invested in the Next.js App Router who want type safety without adopting a new framework paradigm.
- **The draw:** You write standard \`export async function GET(req)\` handlers. The library just quietly infers what you wrote. If you ever decide to remove the library, your backend code doesn't have to change at all.
- **The trade-off:** You give up the robust middleware pipelines, batched requests, and automatic OpenAPI generation that larger ecosystems provide.

## License

MIT
