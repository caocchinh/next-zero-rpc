"use client";
import { PlainEditor } from "@/components/CodeWindow/PlainEditor";
import { showToast } from "@/components/Toast";
import { Check, Code2, Copy, Terminal } from "lucide-react";
import { useState } from "react";

export function InstallSteps() {
  const [tab, setTab] = useState<"cli" | "manual">("cli");
  const [copiedCli, setCopiedCli] = useState(false);

  return (
    <div className="flex flex-col gap-12">
      {/* Step 1 */}
      <div className="flex flex-col items-start gap-8 lg:flex-row">
        <div className="flex flex-col gap-3 lg:w-1/3">
          <div className="inline-flex h-8 w-8 items-center justify-center rounded bg-[oklch(0.6_0.2_40)] font-mono font-bold text-[oklch(0.98_0.01_250)]">
            01
          </div>
          <h3 className="font-mono text-xl font-bold text-[oklch(0.15_0.01_250)] uppercase">
            Scaffold Core Files
          </h3>
          <p className="leading-relaxed text-[oklch(0.4_0.01_250)]">
            Use the CLI to scaffold everything, or copy the files manually.
          </p>
        </div>
        <div className="flex w-full flex-col gap-4 lg:w-2/3">
          {/* Tabs */}
          <div className="flex w-fit overflow-hidden rounded-lg border border-[oklch(0.85_0.01_250)]">
            <button
              onClick={() => setTab("cli")}
              className={`flex items-center gap-2 px-5 py-2.5 font-mono text-xs font-bold tracking-widest uppercase transition-colors ${
                tab === "cli"
                  ? "bg-[oklch(0.6_0.2_40)] text-[oklch(0.98_0.01_250)]"
                  : "bg-[oklch(0.98_0.01_250)] text-[oklch(0.4_0.01_250)] hover:bg-[oklch(0.95_0.01_250)]"
              }`}
            >
              <Terminal className="h-3.5 w-3.5" /> CLI
            </button>
            <button
              onClick={() => setTab("manual")}
              className={`flex items-center gap-2 border-l border-[oklch(0.85_0.01_250)] px-5 py-2.5 font-mono text-xs font-bold tracking-widest uppercase transition-colors ${
                tab === "manual"
                  ? "bg-[oklch(0.6_0.2_40)] text-[oklch(0.98_0.01_250)]"
                  : "bg-[oklch(0.98_0.01_250)] text-[oklch(0.4_0.01_250)] hover:bg-[oklch(0.95_0.01_250)]"
              }`}
            >
              <Code2 className="h-3.5 w-3.5" /> Manual
            </button>
          </div>

          {/* CLI Tab */}
          {tab === "cli" && (
            <div className="flex flex-col gap-3">
              <div
                onClick={() => {
                  navigator.clipboard.writeText("npx next-zero-rpc init");
                  setCopiedCli(true);
                  showToast("Command copied to clipboard!");
                  setTimeout(() => setCopiedCli(false), 2000);
                }}
                className="group relative cursor-pointer overflow-hidden rounded-lg border border-zinc-800 bg-[#1e1e1e] shadow-xl transition-all hover:border-zinc-500"
              >
                <div className="pointer-events-none">
                  <PlainEditor code="$ npx next-zero-rpc init" language="bash" />
                </div>
                <div className="absolute top-1/2 right-4 flex -translate-y-1/2 items-center justify-center rounded bg-zinc-800/80 p-1.5 text-zinc-400 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                  {copiedCli ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </div>
              </div>
              <p className="text-sm text-[oklch(0.4_0.01_250)]">
                Creates{" "}
                <code className="rounded bg-[oklch(0.95_0.01_250)] px-1 text-[oklch(0.15_0.01_250)]">
                  lib/next-zero-rpc/
                </code>{" "}
                and generates the initial{" "}
                <code className="rounded bg-[oklch(0.95_0.01_250)] px-1 text-[oklch(0.15_0.01_250)]">
                  apiRegistry.ts
                </code>{" "}
                automatically. Skip to Step 02.
              </p>
            </div>
          )}

          {/* Manual Tab */}
          {tab === "manual" && (
            <div className="flex flex-col gap-5">
              <div>
                <p className="mb-2 text-sm text-[oklch(0.4_0.01_250)]">
                  Copy these 3 files to{" "}
                  <code className="rounded bg-[oklch(0.95_0.01_250)] px-1 text-[oklch(0.15_0.01_250)]">
                    src/lib/next-zero-rpc/
                  </code>
                  :
                </p>
                <ul className="list-inside list-disc space-y-1.5 font-mono text-sm text-[oklch(0.4_0.01_250)]">
                  <li>
                    <a
                      href="https://github.com/caocchinh/next-zero-rpc/blob/main/examples/minimal/src/lib/next-zero-rpc/apiClient.ts"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[oklch(0.6_0.2_40)] hover:underline"
                    >
                      apiClient.ts
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/caocchinh/next-zero-rpc/blob/main/examples/minimal/src/lib/next-zero-rpc/responses.ts"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[oklch(0.6_0.2_40)] hover:underline"
                    >
                      responses.ts
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/caocchinh/next-zero-rpc/blob/main/examples/minimal/src/lib/next-zero-rpc/update-api-registry.mjs"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[oklch(0.6_0.2_40)] hover:underline"
                    >
                      update-api-registry.mjs
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <p className="mb-2 text-sm text-[oklch(0.4_0.01_250)]">
                  Add this script to{" "}
                  <code className="rounded bg-[oklch(0.95_0.01_250)] px-1 text-[oklch(0.15_0.01_250)]">
                    package.json
                  </code>{" "}
                  and <strong>run it once</strong> to generate{" "}
                  <code className="rounded bg-[oklch(0.95_0.01_250)] px-1 text-[oklch(0.15_0.01_250)]">
                    apiRegistry.ts
                  </code>
                  :
                </p>
                <div className="overflow-hidden rounded-lg border border-zinc-800 bg-[#1e1e1e] shadow-xl">
                  <div className="border-b border-zinc-800 bg-[#252526] px-4 py-2 font-mono text-xs text-zinc-500">
                    package.json
                  </div>
                  <PlainEditor
                    code={`"scripts": {
  "infer-api": "node src/lib/next-zero-rpc/update-api-registry.mjs"
}`}
                    language="json"
                  />
                </div>
                <div className="mt-2 overflow-hidden rounded-lg border border-zinc-800 bg-[#1e1e1e] shadow-xl">
                  <PlainEditor code="$ npm run infer-api" language="bash" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Step 2 */}
      <div className="flex flex-col items-start gap-8 lg:flex-row">
        <div className="flex flex-col gap-3 lg:w-1/3">
          <div className="inline-flex h-8 w-8 items-center justify-center rounded bg-[oklch(0.6_0.2_40)] font-mono font-bold text-[oklch(0.98_0.01_250)]">
            02
          </div>
          <h3 className="font-mono text-xl font-bold text-[oklch(0.15_0.01_250)] uppercase">
            Setup Next.js Watcher
          </h3>
          <p className="leading-relaxed text-[oklch(0.4_0.01_250)]">
            Inject the plugin so the registry auto-updates on every route change during dev.{" "}
            <span className="font-semibold text-[oklch(0.15_0.01_250)]">Optional</span> — applies to
            both CLI and manual installs.
          </p>
        </div>
        <div className="flex w-full flex-col gap-4 lg:w-2/3">
          <div className="overflow-hidden rounded-lg border border-zinc-800 bg-[#1e1e1e] shadow-xl">
            <div className="border-b border-zinc-800 bg-[#252526] px-4 py-2 font-mono text-xs text-zinc-500">
              next.config.ts
            </div>
            <PlainEditor
              code={`import { withApiRegistry } from "./src/lib/next-zero-rpc/update-api-registry.mjs";

const nextConfig = {};

export default withApiRegistry(nextConfig);
`}
              language="typescript"
            />
          </div>
          <p className="border-l-2 border-[oklch(0.6_0.2_40)] pl-3 text-sm text-[oklch(0.4_0.01_250)] italic">
            <strong>Skip this step?</strong> Just run{" "}
            <code className="rounded bg-[oklch(0.95_0.01_250)] px-1 font-mono text-[oklch(0.6_0.2_40)] not-italic">
              npm run infer-api
            </code>{" "}
            manually whenever you add or change API routes.
          </p>
        </div>
      </div>
    </div>
  );
}
