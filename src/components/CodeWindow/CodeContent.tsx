"use client";

import { HoverTooltip } from "./HoverTooltip";
import { PlainEditor } from "./PlainEditor";
import { TAB_DATA } from "./data";
import { TabId } from "./types";
import { FileIcon } from "lucide-react";

export function CodeContent({ activeTab }: { activeTab: TabId }) {
  if (!activeTab) {
    return (
      <div className="flex h-full items-center justify-center text-zinc-600">
        <FileIcon className="h-24 w-24 opacity-10" />
      </div>
    );
  }

  if (activeTab === "api/users/[id]/route.ts") {
    return (
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
    );
  }

  if (activeTab === "client.tsx") {
    return (
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
    );
  }

  const tabData = TAB_DATA[activeTab];
  if (tabData && tabData.code) {
    return <PlainEditor code={tabData.code} language={tabData.language} />;
  }

  return null;
}
