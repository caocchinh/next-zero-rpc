"use client";

import { FileIcon } from "lucide-react";
import { AutocompleteTooltip, HoverTooltip } from "./HoverTooltip";
import { PlainEditor } from "./PlainEditor";
import { TAB_DATA } from "./data";
import { TabId } from "./types";

export function CodeContent({ activeTab }: { activeTab: TabId }) {
  if (!activeTab) {
    return (
      <div className="flex h-full items-center justify-center text-zinc-600">
        <FileIcon className="h-24 w-24 opacity-10" />
      </div>
    );
  }

  if (activeTab === "client.ts") {
    return (
      <div className="overflow-visible p-4 font-mono text-[13px] leading-6 text-[#d4d4d4]">
        <pre className="overflow-visible whitespace-pre-wrap">
          <span className="text-[#c586c0]">import</span> {"{"} <span className="text-[#dcdcaa]">apiFetch</span> {"}"} <span className="text-[#c586c0]">from</span> <span className="text-[#ce9178]">{"\"@/lib/next-zero-rpc/apiClient\""}</span>;
          <br />
          <span className="text-[#c586c0]">import</span> {"{"} <span className="text-[#dcdcaa]">assertNever</span> {"}"} <span className="text-[#c586c0]">from</span> <span className="text-[#ce9178]">{"\"@/lib/next-zero-rpc/responses\""}</span>;
          <br />
          
          <br />
          <span className="text-[#c586c0]">export</span> <span className="text-[#c586c0]">async</span> <span className="text-[#c586c0]">function</span> TypeInferenceDemo() {"{"}
          <br />
            <span className="text-[#6a9955]">{"// 1. Basic Route: Hover over `"}</span><HoverTooltip tooltip={`const err1: ApiErrorPayload<"system:unknown-error"> | null`}><span className="text-[#9cdcfe]">err1</span></HoverTooltip>.code` to see narrowed errors!
          <br />
            <span className="text-[#c586c0]">const</span> [<HoverTooltip tooltip={`const res1: { success: boolean; message: string; data: string; } | null`}><span className="text-[#9cdcfe]">res1</span></HoverTooltip>, <HoverTooltip tooltip={`const err1: ApiErrorPayload<"system:unknown-error"> | null`}><span className="text-[#9cdcfe]">err1</span></HoverTooltip>] = <span className="text-[#c586c0]">await</span> <span className="text-[#dcdcaa]">apiFetch</span>(<AutocompleteTooltip items={["/api/auth/login", "/api/status", "/api/extreme/complex-types", "/api/extreme/methods", "/api/users/[userId]"]} selectedIndex={1}><span className="cursor-text rounded-[2px] bg-white/10 text-[#ce9178]">"/api/status"</span></AutocompleteTooltip>, {"{"} method: <span className="text-[#ce9178]">{"\"GET\""}</span> {"}"});
          <br />
          
          <br />
            <span className="text-[#c586c0]">if</span> (<HoverTooltip tooltip={`const err1: ApiErrorPayload<"system:unknown-error"> | null`}><span className="text-[#9cdcfe]">err1</span></HoverTooltip>) {"{"}
          <br />
              <span className="text-[#c586c0]">switch</span> (<HoverTooltip tooltip={`const err1: ApiErrorPayload<"system:unknown-error"> | null`}><span className="text-[#9cdcfe]">err1</span></HoverTooltip>.code) {"{"}
          <br />
                <span className="text-[#c586c0]">case</span> <span className="text-[#ce9178]">{"\"system:unknown-error\""}</span>:
          <br />
                  <span className="text-[#dcdcaa]">console.error</span>(<span className="text-[#ce9178]">{"\"A system error occurred:\""}</span>, <HoverTooltip tooltip={`const err1: ApiErrorPayload<"system:unknown-error"> | null`}><span className="text-[#9cdcfe]">err1</span></HoverTooltip>.message);
          <br />
                  <span className="text-[#c586c0]">break</span>;
          <br />
                <span className="text-[#6a9955]">{"// You'll get a TypeScript error here "}</span> you forget to handle an error code
          <br />
                <span className="text-[#6a9955]">{"// defined in your backend route!"}</span>
          <br />
                <span className="text-[#c586c0]">default</span>:
          <br />
                  <span className="text-[#dcdcaa]">assertNever</span>(<HoverTooltip tooltip={`const err1: ApiErrorPayload<"system:unknown-error"> | null`}><span className="text-[#9cdcfe]">err1</span></HoverTooltip>.code);
          <br />
              {"}"}
          <br />
            {"}"} <span className="text-[#c586c0]">else</span> {"{"}
          <br />
              <span className="text-[#6a9955]">{"// "}</span><HoverTooltip tooltip={`const res1: { success: boolean; message: string; data: string; } | null`}><span className="text-[#9cdcfe]">res1</span></HoverTooltip> is strictly typed!
          <br />
              <span className="text-[#dcdcaa]">console.log</span>(<HoverTooltip tooltip={`const res1: { success: boolean; message: string; data: string; } | null`}><span className="text-[#9cdcfe]">res1</span></HoverTooltip>.message);
          <br />
            {"}"}
          <br />
          
          <br />
            <span className="text-[#6a9955]">{"// 2. Complex Types: Hover to see deep nested interfaces"}</span>
          <br />
            <span className="text-[#c586c0]">const</span> [<HoverTooltip tooltip={`const res2: { union: any; tree: any; } | null`}><span className="text-[#9cdcfe]">res2</span></HoverTooltip>, <HoverTooltip tooltip={`const err2: ApiErrorPayload<"validation:invalid-payload"> | ApiErrorPayload<"system:unknown-error"> | null`}><span className="text-[#9cdcfe]">err2</span></HoverTooltip>] = <span className="text-[#c586c0]">await</span> <span className="text-[#dcdcaa]">apiFetch</span>(<span className="text-[#ce9178]">{"\"/api/extreme/complex-types\""}</span>, {"{"}
          <br />
              method: <span className="text-[#ce9178]">{"\"POST\""}</span>,
          <br />
              body: <span className="text-[#dcdcaa]">JSON.stringify</span>({"{"} triggerError: false {"}"}),
          <br />
            {"}"});
          <br />
          
          <br />
            <span className="text-[#c586c0]">if</span> (<HoverTooltip tooltip={`const res2: { union: any; tree: any; } | null`}><span className="text-[#9cdcfe]">res2</span></HoverTooltip>) {"{"}
          <br />
              <span className="text-[#dcdcaa]">console.log</span>(<HoverTooltip tooltip={`const res2: { union: any; tree: any; } | null`}><span className="text-[#9cdcfe]">res2</span></HoverTooltip>.tree.children?.[0].value);
          <br />
            {"}"}
          <br />
          
          <br />
            <span className="text-[#6a9955]">{"// 3. Deeply Nested Catchall Route"}</span>
          <br />
            <span className="text-[#c586c0]">const</span> [<HoverTooltip tooltip={`const res3: { resolvedOrgId: string; dynamicSegments: string[]; } | null`}><span className="text-[#9cdcfe]">res3</span></HoverTooltip>, err3] = <span className="text-[#c586c0]">await</span> <span className="text-[#dcdcaa]">apiFetch</span>(<span className="text-[#ce9178]">{"\"/api/extreme/[orgId]/projects/[projectId]/tasks/[...catchall]\""}</span>, {"{"}
          <br />
              method: <span className="text-[#ce9178]">{"\"GET\""}</span>,
          <br />
            {"}"});
          <br />
          
          <br />
            <span className="text-[#6a9955]">{"// 4. Dynamic Params"}</span>
          <br />
            <span className="text-[#c586c0]">const</span> [res4, err4] = <span className="text-[#c586c0]">await</span> <span className="text-[#dcdcaa]">apiFetch</span>(<span className="text-[#ce9178]">{"\"/api/users/[userId]\""}</span>, {"{"}
          <br />
              method: <span className="text-[#ce9178]">{"\"GET\""}</span>,
          <br />
            {"}"});
          <br />
          
          <br />
            <span className="text-[#6a9955]">{"// 5. Auth Payload Inference"}</span>
          <br />
            <span className="text-[#c586c0]">const</span> [<HoverTooltip tooltip={`const res5: { token: string; user: { id: string; email: string; } } | null`}><span className="text-[#9cdcfe]">res5</span></HoverTooltip>, <HoverTooltip tooltip={`const err5: ApiErrorPayload<"validation:missing-required-fields"> | ApiErrorPayload<"auth:unauthorized"> | ApiErrorPayload<"validation:invalid-payload"> | ApiErrorPayload<"system:unknown-error"> | null`}><span className="text-[#9cdcfe]">err5</span></HoverTooltip>] = <span className="text-[#c586c0]">await</span> <span className="text-[#dcdcaa]">apiFetch</span>(<span className="text-[#ce9178]">{"\"/api/auth/login\""}</span>, {"{"}
          <br />
              method: <span className="text-[#ce9178]">{"\"POST\""}</span>,
          <br />
              body: <span className="text-[#dcdcaa]">JSON.stringify</span>({"{"} username: <span className="text-[#ce9178]">{"\"admin\""}</span>, password: <span className="text-[#ce9178]">{"\"123\""}</span> {"}"}),
          <br />
            {"}"});
          <br />
          
          <br />
            <span className="text-[#6a9955]">{"// 6. Strict Method Checking"}</span>
          <br />
            <span className="text-[#6a9955]">{"// TypeScript will error "}</span> you try to use an unsupported HTTP method!
          <br />
            <span className="text-[#c586c0]">const</span> [res6, err6] = <span className="text-[#c586c0]">await</span> <span className="text-[#dcdcaa]">apiFetch</span>(<span className="text-[#ce9178]">{"\"/api/extreme/methods\""}</span>, {"{"}
          <br />
              method: <span className="text-[#ce9178]">{"\"DELETE\""}</span>, 
          <br />
            {"}"});
          <br />
          {"}"}
          <br />
          
          <br />
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
