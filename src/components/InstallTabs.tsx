"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

type InstallTab = "cli" | "manual";

export function InstallTabs() {
  const [activeTab, setActiveTab] = useState<InstallTab>("cli");
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-xl border border-zinc-800 bg-black shadow-2xl">
      {/* Tabs List */}
      <div className="flex w-full items-center gap-2 border-b border-zinc-800 p-2">
        <button
          onClick={() => setActiveTab("cli")}
          className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            activeTab === "cli"
              ? "bg-zinc-800 text-zinc-50"
              : "text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800/50"
          }`}
        >
          CLI (Recommended)
        </button>
        <button
          onClick={() => setActiveTab("manual")}
          className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            activeTab === "manual"
              ? "bg-zinc-800 text-zinc-50"
              : "text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800/50"
          }`}
        >
          Manual Setup
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4 sm:p-6">
        {activeTab === "cli" ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-zinc-400">
              The fastest way to get started. It automatically detects your Next.js project layout and copies the necessary files.
            </p>
            <div className="group relative flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 p-4 font-mono text-sm text-zinc-300">
              <div className="flex items-center gap-4">
                <span className="select-none text-zinc-600">$</span>
                <span>npx next-zero-rpc init</span>
              </div>
              <button
                onClick={() => handleCopy("npx next-zero-rpc init")}
                className="rounded-md p-2 text-zinc-500 opacity-0 transition-all hover:bg-zinc-800 hover:text-zinc-300 group-hover:opacity-100 focus:opacity-100"
                aria-label="Copy code"
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-zinc-500 mt-2">
              Next, add the plugin to your <code className="text-zinc-300">next.config.ts</code>. See the documentation below for more details.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-zinc-400">
              Prefer to do it yourself? No problem. The library is just four files.
            </p>
            <ol className="list-inside list-decimal space-y-3 text-sm text-zinc-300">
              <li>
                Create a folder <code className="rounded bg-zinc-800 px-1 py-0.5 text-zinc-100">lib/next-zero-rpc</code>.
              </li>
              <li>
                Copy <code className="rounded bg-zinc-800 px-1 py-0.5 text-zinc-100">apiClient.ts</code>, <code className="rounded bg-zinc-800 px-1 py-0.5 text-zinc-100">responses.ts</code>, and <code className="rounded bg-zinc-800 px-1 py-0.5 text-zinc-100">update-api-registry.mjs</code> into the folder.
              </li>
              <li>
                Run the script once to generate your <code className="rounded bg-zinc-800 px-1 py-0.5 text-zinc-100">apiRegistry.ts</code> file.
              </li>
              <li>
                Wrap your Next.js config with the <code className="rounded bg-zinc-800 px-1 py-0.5 text-zinc-100">withApiRegistry</code> plugin.
              </li>
            </ol>
            <div className="mt-4 flex items-center justify-center">
              <a href="https://github.com/caocchinh/next-zero-rpc" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-white hover:underline">
                View Source Files on GitHub →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
