import { PlainEditor } from "@/components/CodeWindow/PlainEditor";
import { Logo } from "@/components/Logo";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { InstallSteps } from "./InstallSteps";

export const metadata = {
  title: "Documentation - next-zero-rpc",
  description: "Installation and Use Cases for next-zero-rpc",
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[oklch(0.98_0.01_250)] font-sans text-[oklch(0.15_0.01_250)] selection:bg-[oklch(0.6_0.2_40)] selection:text-[oklch(0.98_0.01_250)]">
      {/* Header */}
      <header className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-[oklch(0.85_0.01_250)] bg-[oklch(0.98_0.01_250)] px-6 py-5 md:px-12">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="group flex items-center gap-2 transition-colors hover:text-[oklch(0.6_0.2_40)]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="font-mono text-sm tracking-widest uppercase">Home</span>
          </Link>
        </div>
        <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-3">
          <Logo className="h-6 w-auto text-[oklch(0.6_0.2_40)]" />
          <div className="font-mono text-sm font-bold tracking-widest text-[oklch(0.6_0.2_40)] uppercase">
            next-zero-rpc // docs
          </div>
        </div>
      </header>

      {/* Docs Content */}
      <main className="mx-auto flex max-w-5xl flex-col gap-24 px-6 py-12 md:px-12 md:py-20">
        {/* INSTALLATION */}
        <section className="flex flex-col gap-12">
          <div className="border-b border-[oklch(0.85_0.01_250)] pb-6">
            <h1 className="text-[clamp(2rem,4vw,3.5rem)] leading-[0.9] font-black tracking-tighter text-[oklch(0.6_0.2_40)] uppercase">
              Installation
            </h1>
            <p className="mt-4 text-xl text-[oklch(0.4_0.01_250)]">
              Deploy the type-safe bridge into your architecture.
            </p>
          </div>
          <InstallSteps />
        </section>

        {/* USE CASES */}
        <section className="flex flex-col gap-12">
          <div className="border-b border-[oklch(0.85_0.01_250)] pb-6">
            <h2 className="text-[clamp(2rem,4vw,3.5rem)] leading-[0.9] font-black tracking-tighter text-[oklch(0.6_0.2_40)] uppercase">
              Use Cases
            </h2>
            <p className="mt-4 text-xl text-[oklch(0.4_0.01_250)]">
              Core patterns and daily workflows.
            </p>
          </div>

          {/* Case 1 */}
          <div className="flex flex-col items-start gap-8 lg:flex-row">
            <div className="flex flex-col gap-3 lg:w-1/3">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded bg-[oklch(0.6_0.2_40)] font-mono font-bold text-[oklch(0.98_0.01_250)]">
                01
              </div>
              <h3 className="font-mono text-xl font-bold text-[oklch(0.15_0.01_250)] uppercase">
                Backend: Route Handlers
              </h3>
              <p className="leading-relaxed text-[oklch(0.4_0.01_250)]">
                Use{" "}
                <code className="rounded bg-[oklch(0.95_0.01_250)] px-1 text-[oklch(0.6_0.2_40)]">
                  createApiSuccess
                </code>{" "}
                and{" "}
                <code className="rounded bg-[oklch(0.95_0.01_250)] px-1 text-[oklch(0.6_0.2_40)]">
                  createApiError
                </code>{" "}
                instead of raw Next.js responses. The error codes must be literal strings.
              </p>
            </div>
            <div className="w-full overflow-hidden rounded-lg border border-zinc-800 bg-[#1e1e1e] shadow-xl lg:w-2/3">
              <div className="border-b border-zinc-800 bg-[#252526] px-4 py-2 font-mono text-xs text-zinc-500">
                app/api/users/route.ts
              </div>
              <PlainEditor
                code={`import { createApiSuccess, createApiError, HTTP_STATUS_ERROR } from "@/lib/next-zero-rpc/responses";

export async function GET() {
  const user = await db.getUser();
  
  if (!user) {
    return createApiError("resource:not-found", HTTP_STATUS_ERROR.NOT_FOUND); 
  }
  
  return createApiSuccess({ id: user.id, name: user.name });
}`}
                language="typescript"
              />
            </div>
          </div>

          {/* Case 2 */}
          <div className="flex flex-col items-start gap-8 lg:flex-row">
            <div className="flex flex-col gap-3 lg:w-1/3">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded bg-[oklch(0.6_0.2_40)] font-mono font-bold text-[oklch(0.98_0.01_250)]">
                02
              </div>
              <h3 className="font-mono text-xl font-bold text-[oklch(0.15_0.01_250)] uppercase">
                Frontend: Client Fetch
              </h3>
              <p className="leading-relaxed text-[oklch(0.4_0.01_250)]">
                Fetch data using Go-style tuples.{" "}
                <code className="rounded bg-[oklch(0.95_0.01_250)] px-1 text-[oklch(0.6_0.2_40)]">
                  apiFetch
                </code>{" "}
                guarantees type safety across the network boundary, including autocomplete for route
                paths.
              </p>
            </div>
            <div className="w-full overflow-hidden rounded-lg border border-zinc-800 bg-[#1e1e1e] shadow-xl lg:w-2/3">
              <div className="border-b border-zinc-800 bg-[#252526] px-4 py-2 font-mono text-xs text-zinc-500">
                app/client-component.tsx
              </div>
              <PlainEditor
                code={`"use client";
import { apiFetch } from "@/lib/next-zero-rpc/apiClient";

const [data, err] = await apiFetch("/api/users", { method: "GET" });

if (err) {
  console.error("Failed:", err.message);
  return;
}

// Fully typed!
console.log(data.name, data.id);`}
                language="typescript"
              />
            </div>
          </div>

          {/* Case 3 */}
          <div className="flex flex-col items-start gap-8 lg:flex-row">
            <div className="flex flex-col gap-3 lg:w-1/3">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded bg-[oklch(0.6_0.2_40)] font-mono font-bold text-[oklch(0.98_0.01_250)]">
                03
              </div>
              <h3 className="font-mono text-xl font-bold text-[oklch(0.15_0.01_250)] uppercase">
                Exhaustive Error Handling
              </h3>
              <p className="leading-relaxed text-[oklch(0.4_0.01_250)]">
                TypeScript narrows{" "}
                <code className="rounded bg-[oklch(0.95_0.01_250)] px-1 text-[oklch(0.6_0.2_40)]">
                  err.code
                </code>{" "}
                to exactly the errors your route throws. Use{" "}
                <code className="rounded bg-[oklch(0.95_0.01_250)] px-1 text-[oklch(0.6_0.2_40)]">
                  assertNever
                </code>{" "}
                to catch unhandled errors at compile time.
              </p>
            </div>
            <div className="w-full overflow-hidden rounded-lg border border-zinc-800 bg-[#1e1e1e] shadow-xl lg:w-2/3">
              <div className="border-b border-zinc-800 bg-[#252526] px-4 py-2 font-mono text-xs text-zinc-500">
                app/client-component.tsx
              </div>
              <PlainEditor
                code={`import { apiFetch } from "@/lib/next-zero-rpc/apiClient";
import { assertNever } from "@/lib/next-zero-rpc/responses";

const [data, err] = await apiFetch("/api/users", { method: "GET" });

if (err) {
  switch (err.code) {
    case "resource:not-found":
      showToast("User missing");
      break;
    case "system:unknown-error": // Always explicitly handle network errors
      showToast("Network error");
      break;
    default:
      assertNever(err.code); // TS Error if you forget a case!
  }
}`}
                language="typescript"
              />
            </div>
          </div>

          {/* Case 4 */}
          <div className="flex flex-col items-start gap-8 lg:flex-row">
            <div className="flex flex-col gap-3 lg:w-1/3">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded bg-[oklch(0.6_0.2_40)] font-mono font-bold text-[oklch(0.98_0.01_250)]">
                04
              </div>
              <h3 className="font-mono text-xl font-bold text-[oklch(0.15_0.01_250)] uppercase">
                Server Actions & Services
              </h3>
              <p className="leading-relaxed text-[oklch(0.4_0.01_250)]">
                For backend functions that aren&apos;t API Routes (like Server Actions), use the{" "}
                <code className="rounded bg-[oklch(0.95_0.01_250)] px-1 text-[oklch(0.6_0.2_40)]">
                  createServiceSuccess
                </code>{" "}
                and{" "}
                <code className="rounded bg-[oklch(0.95_0.01_250)] px-1 text-[oklch(0.6_0.2_40)]">
                  createServiceError
                </code>{" "}
                helpers for the same tuple-based DX.
              </p>
            </div>
            <div className="w-full overflow-hidden rounded-lg border border-zinc-800 bg-[#1e1e1e] shadow-xl lg:w-2/3">
              <div className="border-b border-zinc-800 bg-[#252526] px-4 py-2 font-mono text-xs text-zinc-500">
                app/actions.ts
              </div>
              <PlainEditor
                code={`"use server";
import { createServiceSuccess, createServiceError } from "@/lib/next-zero-rpc/responses";

export async function updateUser(id: string, data: any) {
  if (!id) {
    return createServiceError("validation:missing-required-fields");
  }
  
  await db.update(id, data);
  return createServiceSuccess({ success: true });
}`}
                language="typescript"
              />
            </div>
          </div>

          {/* Case 5 */}
          <div className="flex flex-col items-start gap-8 lg:flex-row">
            <div className="flex flex-col gap-3 lg:w-1/3">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded bg-[oklch(0.6_0.2_40)] font-mono font-bold text-[oklch(0.98_0.01_250)]">
                05
              </div>
              <h3 className="font-mono text-xl font-bold text-[oklch(0.15_0.01_250)] uppercase">
                Dynamic Path Segments
              </h3>
              <p className="leading-relaxed text-[oklch(0.4_0.01_250)]">
                Pass runtime variables directly into the path via template literals.{" "}
                <code className="rounded bg-[oklch(0.95_0.01_250)] px-1 text-[oklch(0.6_0.2_40)]">
                  apiFetch
                </code>{" "}
                resolves them against your route registry at compile time — single or multiple
                dynamic segments are equally type-safe.
              </p>
            </div>
            <div className="w-full overflow-hidden rounded-lg border border-zinc-800 bg-[#1e1e1e] shadow-xl lg:w-2/3">
              <div className="border-b border-zinc-800 bg-[#252526] px-4 py-2 font-mono text-xs text-zinc-500">
                app/client-component.tsx
              </div>
              <PlainEditor
                code={`import { apiFetch } from "@/lib/next-zero-rpc/apiClient";

// Single dynamic segment
const userId = "abc-123";
const [user] = await apiFetch(\`/api/users/\${userId}\`, { method: "GET" });

// Multiple dynamic segments across nested routes
const orgId = "org-1";
const projectId = "proj-42";
const taskId = "task-99";
const [task] = await apiFetch(
  \`/api/orgs/\${orgId}/projects/\${projectId}/tasks/\${taskId}\`,
  { method: "PATCH" }
);`}
                language="typescript"
              />
            </div>
          </div>

          {/* Case 6 */}
          <div className="flex flex-col items-start gap-8 lg:flex-row">
            <div className="flex flex-col gap-3 lg:w-1/3">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded bg-[oklch(0.6_0.2_40)] font-mono font-bold text-[oklch(0.98_0.01_250)]">
                06
              </div>
              <h3 className="font-mono text-xl font-bold text-[oklch(0.15_0.01_250)] uppercase">
                Method Narrowing
              </h3>
              <p className="leading-relaxed text-[oklch(0.4_0.01_250)]">
                The{" "}
                <code className="rounded bg-[oklch(0.95_0.01_250)] px-1 text-[oklch(0.6_0.2_40)]">
                  method
                </code>{" "}
                option is narrowed to only the HTTP verbs your route actually exports. Passing an
                unsupported method is a TypeScript compile error — caught before it ever hits the
                network.
              </p>
            </div>
            <div className="w-full overflow-hidden rounded-lg border border-zinc-800 bg-[#1e1e1e] shadow-xl lg:w-2/3">
              <div className="border-b border-zinc-800 bg-[#252526] px-4 py-2 font-mono text-xs text-zinc-500">
                app/api/posts/route.ts · app/client-component.tsx
              </div>
              <PlainEditor
                code={`// app/api/posts/route.ts — only GET and POST are exported
export async function GET() { ... }
export async function POST() { ... }

// ✅ Valid — method matches an export
await apiFetch("/api/posts", { method: "GET" });
await apiFetch("/api/posts", { method: "POST" });

// ❌ TypeScript compile error — DELETE is not exported from this route
await apiFetch("/api/posts", { method: "DELETE" });
//                                      ^^^^^^^^
// Argument of type '"DELETE"' is not assignable to parameter of type '"GET" | "POST"'`}
                language="typescript"
              />
            </div>
          </div>

          {/* Case 7 */}
          <div className="flex flex-col items-start gap-8 lg:flex-row">
            <div className="flex flex-col gap-3 lg:w-1/3">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded bg-[oklch(0.6_0.2_40)] font-mono font-bold text-[oklch(0.98_0.01_250)]">
                07
              </div>
              <h3 className="font-mono text-xl font-bold text-[oklch(0.15_0.01_250)] uppercase">
                Route Groups & Query Strings
              </h3>
              <p className="leading-relaxed text-[oklch(0.4_0.01_250)]">
                Next.js route groups like{" "}
                <code className="rounded bg-[oklch(0.95_0.01_250)] px-1 text-[oklch(0.6_0.2_40)]">
                  (admin)
                </code>{" "}
                are invisible to the type system — omit them in fetch paths. Query strings are
                stripped before validation, so append them freely without breaking type safety.
              </p>
            </div>
            <div className="w-full overflow-hidden rounded-lg border border-zinc-800 bg-[#1e1e1e] shadow-xl lg:w-2/3">
              <div className="border-b border-zinc-800 bg-[#252526] px-4 py-2 font-mono text-xs text-zinc-500">
                app/client-component.tsx
              </div>
              <PlainEditor
                code={`import { apiFetch } from "@/lib/next-zero-rpc/apiClient";

// File lives at:  app/api/(admin)/users/route.ts
// Fetch path:     /api/users  (route group is stripped)
const [users] = await apiFetch("/api/users", { method: "GET" });

// Query strings are stripped before path validation — fully type-safe
const [active] = await apiFetch("/api/users?active=true&role=admin", { method: "GET" });`}
                language="typescript"
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col items-center justify-between gap-4 border-t border-[oklch(0.85_0.01_250)] p-6 font-mono text-sm tracking-widest text-[oklch(0.55_0.01_250)] uppercase md:flex-row md:p-12">
        <p>Built with precision for the Next.js App Router.</p>
        <p>MIT License &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
