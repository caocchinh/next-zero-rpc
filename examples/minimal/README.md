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
- Go-style `[data, err]` tuple returns

## Full documentation

See the [main README](https://github.com/caocchinh/next-zero-rpc#readme) for the complete API reference, comparison table, and philosophy.

## License

MIT
