"use client";

import { useState } from "react";
import { ChevronRight, X } from "lucide-react";
import { FILE_TREE, TAB_DATA } from "./data";
import { TabId } from "./types";
import { TreeItem } from "./TreeItem";
import { CodeContent } from "./CodeContent";

export function CodeWindow() {
  const [activeTab, setActiveTab] = useState<TabId>("client.tsx");
  const [openTabs, setOpenTabs] = useState<TabId[]>(["api/users/[id]/route.ts", "client.tsx"]);

  const handleTabClick = (tabId: TabId) => {
    setActiveTab(tabId);
    if (!openTabs.includes(tabId)) {
      setOpenTabs([...openTabs, tabId]);
    }
  };

  const closeTab = (e: React.MouseEvent, tabId: TabId) => {
    e.stopPropagation();
    const newTabs = openTabs.filter((t) => t !== tabId);
    setOpenTabs(newTabs);
    if (activeTab === tabId) {
      setActiveTab(newTabs[newTabs.length - 1] || ("" as TabId));
    }
  };

  return (
    <div className="flex h-[600px] w-full flex-col overflow-hidden rounded-xl border border-zinc-800 bg-[#1e1e1e] font-sans shadow-2xl">
      {/* Title Bar */}
      <div className="flex flex-none items-center justify-between border-b border-zinc-800 bg-[#323233] px-4 py-2">
        <div className="flex gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
          <div className="h-3 w-3 rounded-full bg-green-500/80"></div>
        </div>
        <div className="text-xs text-zinc-400">next-zero-rpc - Code</div>
        <div className="w-12"></div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="flex w-56 flex-col border-r border-zinc-800 bg-[#252526]">
          <div className="px-4 py-2 text-xs font-semibold text-zinc-400">EXPLORER</div>
          <div className="flex-1 overflow-y-auto overflow-x-hidden pt-1">
            {FILE_TREE.map((node) => (
              <TreeItem
                key={node.id}
                node={node}
                onSelect={handleTabClick}
                activeTab={activeTab}
              />
            ))}
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex flex-1 flex-col bg-[#1e1e1e] min-w-0">
          {/* Tabs */}
          <div className="flex flex-none overflow-x-auto bg-[#252526] scrollbar-none">
            {openTabs.map((tabId) => {
              const tab = TAB_DATA[tabId];
              const isActive = activeTab === tabId;
              return (
                <div
                  key={tabId}
                  onClick={() => handleTabClick(tabId)}
                  className={`group flex min-w-[120px] cursor-pointer items-center justify-between gap-2 border-r border-zinc-800 px-3 py-2 text-xs ${
                    isActive
                      ? "bg-[#1e1e1e] text-blue-400"
                      : "bg-[#2d2d2d] text-zinc-400 hover:bg-[#2a2a2b]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {tab.icon}
                    <span>{tab.name}</span>
                  </div>
                  <X
                    onClick={(e) => closeTab(e, tabId)}
                    className={`h-3 w-3 rounded hover:bg-zinc-700 ${
                      isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* Breadcrumbs */}
          <div className="flex flex-none items-center px-4 py-1.5 text-[11px] text-zinc-400">
            {activeTab && (
              <div className="flex items-center gap-1">
                <span>{activeTab.includes("route.ts") ? "api/users/[id]" : "components"}</span>
                <ChevronRight className="h-3 w-3" />
                <span>{TAB_DATA[activeTab]?.name}</span>
              </div>
            )}
          </div>

          {/* Code */}
          <div className="relative flex-1 overflow-auto bg-[#1e1e1e]">
            <CodeContent activeTab={activeTab} />
          </div>
        </div>
      </div>
    </div>
  );
}
