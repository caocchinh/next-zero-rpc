"use client";

import { FileIcon } from "lucide-react";
import { HoverTooltip } from "./HoverTooltip";
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

  if (activeTab === "client.tsx") {
    return (
      <div className="overflow-visible p-4 font-mono text-[13px] leading-6 text-[#d4d4d4]">
        <pre className="overflow-visible whitespace-pre-wrap">
          <span className="text-[#c586c0]">import</span> {"{ "}
          <span className="text-[#9cdcfe]">apiFetch</span>
          {" } "}
          <span className="text-[#c586c0]">from</span>{" "}
          <span className="text-[#ce9178]">&quot;@/lib/next-zero-rpc/apiClient&quot;</span>;
          <br />
          <br />
          <span className="text-[#6a9955]">{"// 1. Precise Error Type Narrowing"}</span>
          <br />
          <span className="text-[#569cd6]">const</span> [{" "}
          <HoverTooltip tooltip="{ id: string; name: string } | null">
            <span className="text-[#9cdcfe]">data</span>
          </HoverTooltip>
          ,{" "}
          <HoverTooltip
            tooltip={`const err:
  ApiErrorPayload<"system:unknown-error"> |
  ApiErrorPayload<"resource:not-found"> |
  null`}
          >
            <span className="text-[#9cdcfe]">err</span>
          </HoverTooltip>{" "}
          ] = <span className="text-[#c586c0]">await</span>{" "}
          <span className="text-[#dcdcaa]">apiFetch</span>(
          <span className="text-[#ce9178]">&quot;/api/users/123&quot;</span>, {"{"} method:{" "}
          <span className="text-[#ce9178]">&quot;GET&quot;</span> {"}"});
          <br />
          <br />
          <span className="text-[#c586c0]">if</span> (err) {"{"}
          <br />
          {"  "}
          <span className="text-[#6a9955]">
            {"// TypeScript narrows the error code specifically to this route!"}
          </span>
          <br />
          {"  "}
          <span className="text-[#c586c0]">switch</span> (err.code) {"{"}
          <br />
          {"    "}
          <span className="text-[#c586c0]">case</span>{" "}
          <span className="text-[#ce9178]">&quot;resource:not-found&quot;</span>:
          <br />
          {"      "}
          <span className="text-[#4ec9b0]">console</span>.
          <span className="text-[#dcdcaa]">error</span>(
          <span className="text-[#ce9178]">&quot;User not found!&quot;</span>);
          <br />
          {"      "}
          <span className="text-[#c586c0]">break</span>;
          <br />
          {"    "}
          <span className="text-[#c586c0]">case</span>{" "}
          <span className="text-[#ce9178]">&quot;system:unknown-error&quot;</span>:
          <br />
          {"      "}
          <span className="text-[#4ec9b0]">console</span>.
          <span className="text-[#dcdcaa]">error</span>(
          <span className="text-[#ce9178]">&quot;Network error&quot;</span>);
          <br />
          {"      "}
          <span className="text-[#c586c0]">break</span>;
          <br />
          {"    "}
          <span className="text-[#c586c0]">default</span>:
          <br />
          {"      "}
          <span className="text-[#dcdcaa]">assertNever</span>(err.code);{" "}
          <span className="text-[#6a9955]">{"// TS Error if you miss a case!"}</span>
          <br />
          {"  }"}
          <br />
          {"} "}
          <span className="text-[#c586c0]">else</span> {"{"}
          <br />
          {"  "}
          <span className="text-[#4ec9b0]">console</span>.
          <span className="text-[#dcdcaa]">log</span>(data.
          <span className="text-[#9cdcfe]">name</span>);
          <br />
          {"}"}
          <br />
          <br />
          <span className="text-[#6a9955]">{"// 2. Extreme Recursive Type Inference"}</span>
          <br />
          <span className="text-[#569cd6]">const</span> [{" "}
          <HoverTooltip
            tooltip={`const res2: {
  union: {
    type: "success";
    payload: {
      id: string;
      metrics: Record<string, number[]>;
    };
  };
  tree: RecursiveTree<DiscriminatedUnion>;
  intersection: {
    base: string;
  } & {
    variantB: boolean;
  };
  matrixStringTuple: readonly ["a", "b", "c"];
  nullableField: null;
  optionalField: string | undefined;
  bigIntSimulate: string;
} | null`}
          >
            <span className="text-[#9cdcfe]">res2</span>
          </HoverTooltip>
          , <span className="text-[#9cdcfe]">err2</span> ] ={" "}
          <span className="text-[#c586c0]">await</span>{" "}
          <span className="text-[#dcdcaa]">apiFetch</span>(
          <span className="text-[#ce9178]">&quot;/api/extreme/complex-types&quot;</span>, {"{"}{" "}
          method: <span className="text-[#ce9178]">&quot;POST&quot;</span> {"}"});
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
