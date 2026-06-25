"use client";

import { useState } from "react";
import { CliInstall } from "./CliInstall";
import { ManualInstall } from "./ManualInstall";

type InstallTab = "cli" | "manual";

export function InstallTabs() {
  const [activeTab, setActiveTab] = useState<InstallTab>("cli");

  return (
    <div className="mx-auto w-full max-w-2xl rounded-xl border border-zinc-800 bg-black shadow-2xl">
      {/* Tabs List */}
      <div className="flex w-full items-center gap-2 border-b border-zinc-800 p-2">
        <button
          onClick={() => setActiveTab("cli")}
          className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            activeTab === "cli"
              ? "bg-zinc-800 text-zinc-50"
              : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-50"
          }`}
        >
          CLI (Recommended)
        </button>
        <button
          onClick={() => setActiveTab("manual")}
          className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            activeTab === "manual"
              ? "bg-zinc-800 text-zinc-50"
              : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-50"
          }`}
        >
          Manual Setup
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4 sm:p-6">{activeTab === "cli" ? <CliInstall /> : <ManualInstall />}</div>
    </div>
  );
}
