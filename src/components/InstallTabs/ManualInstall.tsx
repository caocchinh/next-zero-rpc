"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { API_CLIENT_CODE, API_REGISTRY_CODE, RESPONSES_CODE, UPDATE_REGISTRY_CODE } from "./manual-files";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="absolute right-4 top-4 rounded-md bg-zinc-800 p-2 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-100 transition"
      aria-label="Copy code"
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}

function CodeBlock({ filename, code }: { filename: string; code: string }) {
  return (
    <div className="relative mt-4 overflow-hidden rounded-xl border border-zinc-800 bg-[#1e1e1e] shadow-lg">
      <div className="flex items-center justify-between border-b border-zinc-800 bg-[#252526] px-4 py-2">
        <span className="text-xs font-mono text-zinc-400">{filename}</span>
      </div>
      <div className="relative p-4 overflow-auto max-h-[400px]">
        <CopyButton text={code} />
        <pre className="text-[13px] leading-6 font-mono text-zinc-300">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

export function ManualInstall() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-sm text-zinc-400">
          Prefer to do it yourself? Copy these files into your project.
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h3 className="font-medium text-zinc-200">1. Create responses.ts</h3>
          <p className="mt-1 text-sm text-zinc-400">
            Contains error definitions and success/error helpers. You can customize the error codes to match your domain.
          </p>
          <CodeBlock filename="lib/next-zero-rpc/responses.ts" code={RESPONSES_CODE} />
        </section>

        <section>
          <h3 className="font-medium text-zinc-200">2. Create apiRegistry.ts</h3>
          <p className="mt-1 text-sm text-zinc-400">
            The central registry for your API routes. The type definitions map strings to the correct route shapes.
          </p>
          <CodeBlock filename="lib/next-zero-rpc/apiRegistry.ts" code={API_REGISTRY_CODE} />
        </section>

        <section>
          <h3 className="font-medium text-zinc-200">3. Create apiClient.ts</h3>
          <p className="mt-1 text-sm text-zinc-400">
            The type-safe fetch wrapper. It uses the registry to infer types based on the path and method.
          </p>
          <CodeBlock filename="lib/next-zero-rpc/apiClient.ts" code={API_CLIENT_CODE} />
        </section>

        <section>
          <h3 className="font-medium text-zinc-200">4. Create update-api-registry.mjs</h3>
          <p className="mt-1 text-sm text-zinc-400">
            Next.js plugin and script to auto-generate the registry file by scanning your <code className="text-zinc-300 bg-zinc-800 px-1 py-0.5 rounded">app/api</code> directory.
          </p>
          <CodeBlock filename="lib/next-zero-rpc/update-api-registry.mjs" code={UPDATE_REGISTRY_CODE} />
        </section>

        <section>
          <h3 className="font-medium text-zinc-200">5. Update package.json</h3>
          <p className="mt-1 text-sm text-zinc-400">
            Add the inference script to your package.json scripts.
          </p>
          <CodeBlock
            filename="package.json"
            code={`{
  "scripts": {
    "infer-api": "node src/lib/next-zero-rpc/update-api-registry.mjs"
  }
}`}
          />
        </section>

        <section>
          <h3 className="font-medium text-zinc-200">6. Update next.config.ts</h3>
          <p className="mt-1 text-sm text-zinc-400">
            Wrap your Next.js config with the plugin to enable auto-generation during development.
          </p>
          <CodeBlock
            filename="next.config.ts"
            code={`import { withApiRegistry } from "./src/lib/next-zero-rpc/update-api-registry.mjs";

const nextConfig = {
  // your existing config
};

export default withApiRegistry(nextConfig);`}
          />
        </section>
      </div>
    </div>
  );
}
