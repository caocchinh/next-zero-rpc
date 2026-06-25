"use client";

import { ChevronRight, ExternalLink, PanelLeft, X } from "lucide-react";
import { useState } from "react";
import { CodeContent } from "./CodeContent";
import { FILE_TREE, TAB_DATA } from "./data";
import { TreeItem } from "./TreeItem";
import { TabId } from "./types";

export function CodeWindow() {
  const [activeTab, setActiveTab] = useState<TabId>("client.ts");
  const [openTabs, setOpenTabs] = useState<TabId[]>(["app/api/(core)/status/route.ts", "client.ts"]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
    <div className="flex h-[870px] w-full flex-col overflow-hidden rounded-xl border border-zinc-800 bg-[#1e1e1e] font-sans shadow-2xl">
      {/* Title Bar */}
      <div className="flex flex-none items-center justify-between border-b border-zinc-800 bg-[#323233] px-4 py-2">
        <div className="flex w-24 items-center gap-4">
          <div className="flex gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
            <div className="h-3 w-3 rounded-full bg-green-500/80"></div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-zinc-400 transition-colors hover:text-white focus:outline-none"
            title="Toggle Sidebar"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
        </div>
        <a
          href="https://github.com/caocchinh/next-zero-rpc/tree/main/examples/minimal"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-all hover:border-zinc-500 hover:bg-zinc-700 hover:text-white"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="currentColor" aria-hidden="true">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
          </svg>
          <span>View source on GitHub</span>
          <ExternalLink className="h-3 w-3 shrink-0 opacity-60" />
        </a>
        <div className="w-24"></div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {isSidebarOpen && (
          <div className="flex w-56 flex-col border-r border-zinc-800 bg-[#252526]">
            <div className="px-4 py-2 text-xs font-semibold text-zinc-400">EXPLORER</div>
            <div className="custom-scrollbar flex-1 overflow-x-hidden overflow-y-auto pt-1">
              {FILE_TREE.map((node) => (
                <TreeItem key={node.id} node={node} onSelect={handleTabClick} activeTab={activeTab} />
              ))}
            </div>
          </div>
        )}

        {/* Editor Area */}
        <div className="flex min-w-0 flex-1 flex-col bg-[#1e1e1e]">
          {/* Tabs */}
          <div className="flex flex-none scrollbar-none overflow-x-auto bg-[#252526]">
            {openTabs.map((tabId) => {
              const tab = TAB_DATA[tabId];
              const isActive = activeTab === tabId;
              return (
                <div
                  key={tabId}
                  onClick={() => handleTabClick(tabId)}
                  onMouseDown={(e) => {
                    if (e.button === 1) {
                      e.preventDefault();
                      closeTab(e, tabId);
                    }
                  }}
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
                  <div
                    onClick={(e) => closeTab(e, tabId)}
                    className={`flex h-6 w-6 items-center justify-center rounded hover:bg-zinc-700 ${
                      isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    <X className="h-4 w-4" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Breadcrumbs */}
          <div className="flex flex-none items-center px-4 py-1.5 text-[11px] text-zinc-400">
            {activeTab && (
              <div className="flex items-center gap-1">
                <span>
                  {activeTab.includes("/")
                    ? activeTab.substring(0, activeTab.lastIndexOf("/"))
                    : "src"}
                </span>
                <ChevronRight className="h-3 w-3" />
                <span>{TAB_DATA[activeTab]?.name}</span>
              </div>
            )}
          </div>

          {/* Code */}
          <div className="custom-scrollbar relative flex-1 overflow-auto bg-[#1e1e1e]">
            <CodeContent activeTab={activeTab} />
          </div>
        </div>
      </div>
    </div>
  );
}
