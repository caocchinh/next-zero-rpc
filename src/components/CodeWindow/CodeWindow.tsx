"use client";

import { useState } from "react";
import { Terminal, Code2, Play } from "lucide-react";
import { HoverTooltip } from "./HoverTooltip";

type Tab = "route.ts" | "client.tsx";

export function CodeWindow() {
  const [activeTab, setActiveTab] = useState<Tab>("client.tsx");

  return (
    <div className="w-full rounded-xl border border-zinc-800 bg-[#1e1e1e] shadow-2xl">
      {/* Window Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-[#252526] px-4 py-2 rounded-t-xl">
        <div className="flex gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
          <div className="h-3 w-3 rounded-full bg-green-500/80"></div>
        </div>
        <div className="flex gap-2 text-xs text-zinc-400">
          <button
            onClick={() => setActiveTab("route.ts")}
            className={`flex items-center gap-2 rounded px-2 py-1 transition-colors ${
              activeTab === "route.ts" ? "bg-[#1e1e1e] text-zinc-200" : "hover:bg-zinc-800"
            }`}
          >
            <Terminal className="h-3 w-3 text-blue-400" />
            api/users/[id]/route.ts
          </button>
          <button
            onClick={() => setActiveTab("client.tsx")}
            className={`flex items-center gap-2 rounded px-2 py-1 transition-colors ${
              activeTab === "client.tsx" ? "bg-[#1e1e1e] text-zinc-200" : "hover:bg-zinc-800"
            }`}
          >
            <Code2 className="h-3 w-3 text-cyan-400" />
            client.tsx
          </button>
        </div>
        <div>
          <Play className="h-4 w-4 text-green-400 opacity-50 hover:opacity-100 cursor-pointer" />
        </div>
      </div>

      {/* Code Editor */}
      <div className="p-4 pt-8 font-mono text-[13px] leading-6 text-[#d4d4d4] rounded-b-xl overflow-visible">
        {activeTab === "route.ts" ? (
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
        ) : (
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
        )}
      </div>
    </div>
  );
}
