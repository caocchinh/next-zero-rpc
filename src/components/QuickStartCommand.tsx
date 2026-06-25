"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function QuickStartCommand() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("npx next-zero-rpc init");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex w-full max-w-xl items-center justify-between border-2 border-[#0a0a0a] bg-[oklch(0.95_0.01_250)] p-4 shadow-[8px_8px_0_0_oklch(0.6_0.2_40)] transition-transform hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0_0_oklch(0.6_0.2_40)]">
      <div className="flex items-center gap-4 font-mono text-lg font-bold text-[#0a0a0a]">
        <span className="text-[oklch(0.6_0.2_40)] select-none">&gt;</span>
        <span>npx next-zero-rpc init</span>
      </div>
      <button
        onClick={handleCopy}
        className="flex items-center justify-center border-2 border-[#0a0a0a] bg-[oklch(0.98_0.01_250)] p-2 text-[#0a0a0a] transition-colors hover:bg-[#0a0a0a] hover:text-[oklch(0.98_0.01_250)]"
        aria-label="Copy command"
      >
        {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
      </button>
    </div>
  );
}
