"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import {
  LIB_NEXT_ZERO_RPC_APICLIENT_TS_CODE as API_CLIENT_CODE,
  LIB_NEXT_ZERO_RPC_RESPONSES_TS_CODE as RESPONSES_CODE,
  LIB_NEXT_ZERO_RPC_UPDATE_API_REGISTRY_MJS_CODE as UPDATE_REGISTRY_CODE,
} from "../CodeData";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="rounded-md bg-zinc-800/80 p-1.5 text-zinc-400 transition hover:bg-zinc-700 hover:text-zinc-100"
      aria-label="Copy code"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

function CodeBlock({ filename, code }: { filename: string; code: string }) {
  return (
    <div className="relative mt-4 overflow-hidden rounded-xl border border-zinc-800 bg-[#1e1e1e] shadow-lg">
      <div className="flex items-center justify-between border-b border-zinc-800 bg-[#252526] px-4 py-2">
        <span className="font-mono text-xs text-zinc-400">{filename}</span>
        <CopyButton text={code} />
      </div>
      <div className="custom-scrollbar relative max-h-[400px] overflow-x-auto overflow-y-auto bg-[#1e1e1e] p-4">
        <pre className="font-mono text-[13px] leading-relaxed text-[#d4d4d4] selection:bg-[#264f78]">
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
            Contains error definitions and success/error helpers. You can customize the error codes
            to match your domain.
          </p>
          <CodeBlock filename="lib/next-zero-rpc/responses.ts" code={RESPONSES_CODE} />
        </section>

        <section>
          <h3 className="font-medium text-zinc-200">2. Create apiClient.ts</h3>
          <p className="mt-1 text-sm text-zinc-400">
            The type-safe fetch wrapper. It uses the registry to infer types based on the path and
            method.
          </p>
          <CodeBlock filename="lib/next-zero-rpc/apiClient.ts" code={API_CLIENT_CODE} />
        </section>

        <section>
          <h3 className="font-medium text-zinc-200">3. Create update-api-registry.mjs</h3>
          <p className="mt-1 text-sm text-zinc-400">
            Next.js plugin and script to auto-generate the registry file by scanning your{" "}
            <code className="rounded bg-zinc-800 px-1 py-0.5 text-zinc-300">app/api</code>{" "}
            directory.
          </p>
          <CodeBlock
            filename="lib/next-zero-rpc/update-api-registry.mjs"
            code={UPDATE_REGISTRY_CODE}
          />
        </section>

        <section>
          <h3 className="font-medium text-zinc-200">4. Update package.json</h3>
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
          <h3 className="font-medium text-zinc-200">5. Generate the registry</h3>
          <p className="mt-1 text-sm text-zinc-400">
            Run the inference script to generate your{" "}
            <code className="rounded bg-zinc-800 px-1 py-0.5 text-zinc-300">apiRegistry.ts</code>{" "}
            file.
          </p>
          <CodeBlock filename="Terminal" code={`npm run infer-api\n# or\npnpm infer-api`} />
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
