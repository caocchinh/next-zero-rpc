"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CliInstall() {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
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
  );
}
