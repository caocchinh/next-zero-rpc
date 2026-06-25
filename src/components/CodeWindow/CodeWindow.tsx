"use client";

import { useState } from "react";
import {
  Terminal,
  Code2,
  ChevronDown,
  ChevronRight,
  FileJson,
  FileType,
  FolderOpen,
  X,
  FileIcon
} from "lucide-react";
import { HoverTooltip } from "./HoverTooltip";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  API_CLIENT_CODE,
  API_REGISTRY_CODE,
  RESPONSES_CODE,
  UPDATE_REGISTRY_CODE,
} from "../CodeData";

type TabId =
  | "api/users/[id]/route.ts"
  | "client.tsx"
  | "apiClient.ts"
  | "apiRegistry.ts"
  | "responses.ts"
  | "update-api-registry.mjs";

type FileNode = {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  icon?: React.ReactNode;
};

const FILE_TREE: FileNode[] = [
  {
    id: "NEXT-ZERO-RPC",
    name: "NEXT-ZERO-RPC",
    type: "folder",
    children: [
      {
        id: "app",
        name: "app",
        type: "folder",
        children: [
          {
            id: "api",
            name: "api",
            type: "folder",
            children: [
              {
                id: "users",
                name: "users",
                type: "folder",
                children: [
                  {
                    id: "[id]",
                    name: "[id]",
                    type: "folder",
                    children: [
                      {
                        id: "api/users/[id]/route.ts",
                        name: "route.ts",
                        type: "file",
                        icon: <Terminal className="h-3.5 w-3.5 text-blue-400" />,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "components",
        name: "components",
        type: "folder",
        children: [
          {
            id: "client.tsx",
            name: "client.tsx",
            type: "file",
            icon: <Code2 className="h-3.5 w-3.5 text-cyan-400" />,
          },
        ],
      },
      {
        id: "lib",
        name: "lib",
        type: "folder",
        children: [
          {
            id: "next-zero-rpc",
            name: "next-zero-rpc",
            type: "folder",
            children: [
              {
                id: "apiClient.ts",
                name: "apiClient.ts",
                type: "file",
                icon: <FileType className="h-3.5 w-3.5 text-blue-400" />,
              },
              {
                id: "apiRegistry.ts",
                name: "apiRegistry.ts",
                type: "file",
                icon: <FileType className="h-3.5 w-3.5 text-blue-400" />,
              },
              {
                id: "responses.ts",
                name: "responses.ts",
                type: "file",
                icon: <FileType className="h-3.5 w-3.5 text-blue-400" />,
              },
              {
                id: "update-api-registry.mjs",
                name: "update-api-registry.mjs",
                type: "file",
                icon: <FileJson className="h-3.5 w-3.5 text-yellow-400" />,
              },
            ],
          },
        ],
      },
    ],
  },
];

const TAB_DATA: Record<
  TabId,
  { name: string; icon: React.ReactNode; code?: string; language?: string }
> = {
  "api/users/[id]/route.ts": {
    name: "route.ts",
    icon: <Terminal className="h-3.5 w-3.5 text-blue-400" />,
  },
  "client.tsx": {
    name: "client.tsx",
    icon: <Code2 className="h-3.5 w-3.5 text-cyan-400" />,
  },
  "apiClient.ts": {
    name: "apiClient.ts",
    icon: <FileType className="h-3.5 w-3.5 text-blue-400" />,
    code: API_CLIENT_CODE,
    language: "typescript",
  },
  "apiRegistry.ts": {
    name: "apiRegistry.ts",
    icon: <FileType className="h-3.5 w-3.5 text-blue-400" />,
    code: API_REGISTRY_CODE,
    language: "typescript",
  },
  "responses.ts": {
    name: "responses.ts",
    icon: <FileType className="h-3.5 w-3.5 text-blue-400" />,
    code: RESPONSES_CODE,
    language: "typescript",
  },
  "update-api-registry.mjs": {
    name: "update-api-registry.mjs",
    icon: <FileJson className="h-3.5 w-3.5 text-yellow-400" />,
    code: UPDATE_REGISTRY_CODE,
    language: "javascript",
  },
};

function TreeItem({
  node,
  depth = 0,
  onSelect,
  activeTab,
}: {
  node: FileNode;
  depth?: number;
  onSelect: (id: TabId) => void;
  activeTab: TabId;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const isFile = node.type === "file";
  const isActive = isFile && node.id === activeTab;

  return (
    <div>
      <div
        className={`flex cursor-pointer items-center py-1 pr-2 text-sm transition-colors hover:bg-zinc-800 hover:text-zinc-100 ${
          isActive ? "bg-[#37373d] text-white" : "text-zinc-400"
        }`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={() => {
          if (isFile) {
            onSelect(node.id as TabId);
          } else {
            setIsOpen(!isOpen);
          }
        }}
      >
        <span className="mr-1 flex w-4 justify-center">
          {!isFile &&
            (isOpen ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            ))}
        </span>
        <span className="mr-1.5 flex h-4 w-4 items-center justify-center">
          {node.icon ||
            (isFile ? (
              <FileIcon className="h-3.5 w-3.5" />
            ) : (
              <FolderOpen className="h-3.5 w-3.5 text-blue-400" />
            ))}
        </span>
        <span className="truncate">{node.name}</span>
      </div>
      {!isFile && isOpen && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              onSelect={onSelect}
              activeTab={activeTab}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PlainEditor({ code, language = "typescript" }: { code: string; language?: string }) {
  return (
    <SyntaxHighlighter
      language={language}
      style={vscDarkPlus}
      customStyle={{
        margin: 0,
        padding: "1rem",
        background: "transparent",
        fontSize: "13px",
        lineHeight: "1.5",
      }}
      codeTagProps={{
        style: {
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
        },
      }}
    >
      {code}
    </SyntaxHighlighter>
  );
}

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
            {activeTab === "api/users/[id]/route.ts" && (
              <div className="p-4 font-mono text-[13px] leading-6 text-[#d4d4d4] overflow-visible">
                <pre className="overflow-visible whitespace-pre-wrap">
            <span className="text-[#c586c0]">import</span> {"{ "}
            <span className="text-[#9cdcfe]">createApiSuccess</span>,{" "}
            <span className="text-[#9cdcfe]">createApiError</span>
            {" } "}
            <span className="text-[#c586c0]">from</span> <span className="text-[#ce9178]">&quot;@/lib/next-zero-rpc/responses&quot;</span>;
            <br />
            <br />
            <span className="text-[#569cd6]">export</span> <span className="text-[#569cd6]">async</span> <span className="text-[#569cd6]">function</span> <span className="text-[#dcdcaa]">GET</span>
            (req: Request, {"{ params }"}: {"{ params: { id: string } }"}) {"{"}
            <br />
            {"  "}<span className="text-[#569cd6]">const</span> user = <span className="text-[#c586c0]">await</span> db.users.<span className="text-[#dcdcaa]">find</span>(params.id);
            <br />
            <br />
            {"  "}<span className="text-[#c586c0]">if</span> (!user) {"{"}
            <br />
            {"    "}<span className="text-[#c586c0]">return</span> <span className="text-[#dcdcaa]">createApiError</span>(<span className="text-[#ce9178]">&quot;resource:not-found&quot;</span>, <span className="text-[#b5cea8]">404</span>);
            <br />
            {"  }"}
            <br />
            <br />
            {"  "}<span className="text-[#c586c0]">return</span> <span className="text-[#dcdcaa]">createApiSuccess</span>({"{"} id: user.id, name: user.name {"}"});
            <br />
            {"}"}
          </pre>
              </div>
            )}
            {activeTab === "client.tsx" && (
              <div className="p-4 font-mono text-[13px] leading-6 text-[#d4d4d4] overflow-visible">
                <pre className="overflow-visible whitespace-pre-wrap">
            <span className="text-[#c586c0]">import</span> {"{ "}
            <span className="text-[#9cdcfe]">apiFetch</span>
            {" } "}
            <span className="text-[#c586c0]">from</span> <span className="text-[#ce9178]">&quot;@/lib/next-zero-rpc/apiClient&quot;</span>;
            <br />
            <br />
            <span className="text-[#6a9955]">{"// 1. Precise Error Type Narrowing"}</span>
            <br />
            <span className="text-[#569cd6]">const</span> [{" "}
            <HoverTooltip
              tooltip={
                <span className="text-[#4ec9b0]">
                  {"{ id: string; name: string } | "}<span className="text-[#569cd6]">null</span>
                </span>
              }
            >
              <span className="text-[#9cdcfe]">data</span>
            </HoverTooltip>
            ,{" "}
            <HoverTooltip
              tooltip={
                <div className="flex flex-col gap-1 text-left">
                  <span className="text-[#569cd6]">const <span className="text-[#9cdcfe]">err</span>:</span>
                  <span className="text-[#4ec9b0] pl-4">
                    {"ApiErrorPayload<"}<span className="text-[#ce9178]">&quot;system:unknown-error&quot;</span>{"> |"}
                  </span>
                  <span className="text-[#4ec9b0] pl-4">
                    {"ApiErrorPayload<"}<span className="text-[#ce9178]">&quot;resource:not-found&quot;</span>{"> |"}
                  </span>
                  <span className="text-[#569cd6] pl-4">null</span>
                </div>
              }
            >
              <span className="text-[#9cdcfe]">err</span>
            </HoverTooltip>
            {" "}] = <span className="text-[#c586c0]">await</span> <span className="text-[#dcdcaa]">apiFetch</span>(<span className="text-[#ce9178]">&quot;/api/users/123&quot;</span>, {"{"} method: <span className="text-[#ce9178]">&quot;GET&quot;</span> {"}"});
            <br />
            <br />
            <span className="text-[#c586c0]">if</span> (err) {"{"}
            <br />
            {"  "}<span className="text-[#6a9955]">{"// TypeScript narrows the error code specifically to this route!"}</span>
            <br />
            {"  "}<span className="text-[#c586c0]">switch</span> (err.code) {"{"}
            <br />
            {"    "}<span className="text-[#c586c0]">case</span> <span className="text-[#ce9178]">&quot;resource:not-found&quot;</span>:
            <br />
            {"      "}<span className="text-[#4ec9b0]">console</span>.<span className="text-[#dcdcaa]">error</span>(<span className="text-[#ce9178]">&quot;User not found!&quot;</span>);
            <br />
            {"      "}<span className="text-[#c586c0]">break</span>;
            <br />
            {"    "}<span className="text-[#c586c0]">case</span> <span className="text-[#ce9178]">&quot;system:unknown-error&quot;</span>:
            <br />
            {"      "}<span className="text-[#4ec9b0]">console</span>.<span className="text-[#dcdcaa]">error</span>(<span className="text-[#ce9178]">&quot;Network error&quot;</span>);
            <br />
            {"      "}<span className="text-[#c586c0]">break</span>;
            <br />
            {"    "}<span className="text-[#c586c0]">default</span>:
            <br />
            {"      "}<span className="text-[#dcdcaa]">assertNever</span>(err.code); <span className="text-[#6a9955]">{"// TS Error if you miss a case!"}</span>
            <br />
            {"  }"}
            <br />
            {"} "}<span className="text-[#c586c0]">else</span> {"{"}
            <br />
            {"  "}<span className="text-[#4ec9b0]">console</span>.<span className="text-[#dcdcaa]">log</span>(data.<span className="text-[#9cdcfe]">name</span>);
            <br />
            {"}"}
            <br />
            <br />
            <span className="text-[#6a9955]">{"// 2. Extreme Recursive Type Inference"}</span>
            <br />
            <span className="text-[#569cd6]">const</span> [{" "}
            <HoverTooltip
              tooltip={
                <div className="flex flex-col gap-0 text-left whitespace-pre font-mono text-[11px] leading-tight">
                  <span className="text-[#569cd6]">const <span className="text-[#9cdcfe]">res2</span>: {"{"}</span>
                  <span className="pl-4"><span className="text-[#9cdcfe]">union</span>: {"{"}</span>
                  <span className="pl-8"><span className="text-[#9cdcfe]">type</span>: <span className="text-[#ce9178]">&quot;success&quot;</span>;</span>
                  <span className="pl-8"><span className="text-[#9cdcfe]">payload</span>: {"{"}</span>
                  <span className="pl-12"><span className="text-[#9cdcfe]">id</span>: <span className="text-[#4ec9b0]">string</span>;</span>
                  <span className="pl-12"><span className="text-[#9cdcfe]">metrics</span>: <span className="text-[#4ec9b0]">Record</span>&lt;<span className="text-[#4ec9b0]">string</span>, <span className="text-[#4ec9b0]">number</span>[]&gt;;</span>
                  <span className="pl-8">{"}"};</span>
                  <span className="pl-4">{"}"};</span>
                  <span className="pl-4"><span className="text-[#9cdcfe]">tree</span>: <span className="text-[#4ec9b0]">RecursiveTree</span>&lt;<span className="text-[#4ec9b0]">DiscriminatedUnion</span>&gt;;</span>
                  <span className="pl-4"><span className="text-[#9cdcfe]">intersection</span>: {"{"}</span>
                  <span className="pl-8"><span className="text-[#9cdcfe]">base</span>: <span className="text-[#4ec9b0]">string</span>;</span>
                  <span className="pl-4">{"}"} &amp; {"{"}</span>
                  <span className="pl-8"><span className="text-[#9cdcfe]">variantB</span>: <span className="text-[#569cd6]">boolean</span>;</span>
                  <span className="pl-4">{"}"};</span>
                  <span className="pl-4"><span className="text-[#9cdcfe]">matrixStringTuple</span>: <span className="text-[#569cd6]">readonly</span> [<span className="text-[#ce9178]">&quot;a&quot;</span>, <span className="text-[#ce9178]">&quot;b&quot;</span>, <span className="text-[#ce9178]">&quot;c&quot;</span>];</span>
                  <span className="pl-4"><span className="text-[#9cdcfe]">nullableField</span>: <span className="text-[#569cd6]">null</span>;</span>
                  <span className="pl-4"><span className="text-[#9cdcfe]">optionalField</span>: <span className="text-[#4ec9b0]">string</span> | <span className="text-[#569cd6]">undefined</span>;</span>
                  <span className="pl-4"><span className="text-[#9cdcfe]">bigIntSimulate</span>: <span className="text-[#4ec9b0]">string</span>;</span>
                  <span className="">{"}"} | <span className="text-[#569cd6]">null</span></span>
                </div>
              }
            >
              <span className="text-[#9cdcfe]">res2</span>
            </HoverTooltip>
            ,{" "}
            <span className="text-[#9cdcfe]">err2</span>
            {" "}] = <span className="text-[#c586c0]">await</span> <span className="text-[#dcdcaa]">apiFetch</span>(<span className="text-[#ce9178]">&quot;/api/extreme/complex-types&quot;</span>, {"{"} method: <span className="text-[#ce9178]">&quot;POST&quot;</span> {"}"});
          </pre>
              </div>
            )}
            {activeTab && TAB_DATA[activeTab]?.code && (
              <PlainEditor code={TAB_DATA[activeTab].code!} language={TAB_DATA[activeTab].language} />
            )}
            {!activeTab && (
              <div className="flex h-full items-center justify-center text-zinc-600">
                <FileIcon className="h-24 w-24 opacity-10" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
