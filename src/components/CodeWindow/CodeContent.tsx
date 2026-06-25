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
          <span className="text-[#c586c0]">import</span> {"{ "}
          <span className="text-[#9cdcfe]">assertNever</span>
          {" } "}
          <span className="text-[#c586c0]">from</span>{" "}
          <span className="text-[#ce9178]">&quot;@/lib/next-zero-rpc/responses&quot;</span>;
          <br />
          <br />
          <span className="text-[#6a9955]">{"// 1. Precise Error Type Narrowing"}</span>
          <br />
          <span className="text-[#569cd6]">const</span> [{" "}
          <HoverTooltip tooltip="{ id: string; name: string; role: string } | null">
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
          <span className="text-[#569cd6]">const</span> code = err.
          <span className="text-[#9cdcfe]">code</span>;
          <br />
          {"  "}
          <span className="text-[#c586c0]">switch</span> (code) {"{"}
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
          <span className="text-[#6a9955]">
            {"// Intentionally missing 'system:unknown-error' to show TS error"}
          </span>
          <br />
          {"    "}
          <span className="text-[#c586c0]">default</span>:
          <br />
          {"      "}
          <span className="text-[#dcdcaa]">assertNever</span>(
          <HoverTooltip
            tooltip={`Argument of type '"system:unknown-error"' is not assignable to parameter of type 'never'.`}
            isError
          >
            code
          </HoverTooltip>
          ); <span className="text-[#6a9955]">{"// TS Error if you miss a case!"}</span>
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
          <span className="text-[#6a9955]">{"// 2a. IDE IntelliSense: Available Routes"}</span>
          <br />
          <span className="text-[#c586c0]">await</span>{" "}
          <span className="text-[#dcdcaa]">apiFetch</span>(
          <AutocompleteTooltip
            items={[
              "/api/auth/login",
              "/api/checkin/verify",
              "/api/extreme/[orgId]/projects/[projectId]/...",
              "/api/extreme/complex-types",
              "/api/extreme/methods",
              "/api/orders/checkout",
              "/api/system/health",
              "/api/users/[userId]",
            ]}
            selectedIndex={0}
          >
            <span className="cursor-text rounded-[2px] bg-white/10 text-[#ce9178]">
              &quot;&quot;
            </span>
          </AutocompleteTooltip>
          );
          <br />
          <br />
          <span className="text-[#6a9955]">{"// 2b. IDE IntelliSense: Allowed Methods"}</span>
          <br />
          <span className="text-[#c586c0]">await</span>{" "}
          <span className="text-[#dcdcaa]">apiFetch</span>(
          <span className="text-[#ce9178]">&quot;/api/users/34&quot;</span>, {"{"} method:{" "}
          <AutocompleteTooltip items={["DELETE", "GET", "PUT"]} selectedIndex={0}>
            <span className="cursor-text rounded-[2px] bg-white/10 text-[#ce9178]">
              &quot;&quot;
            </span>
          </AutocompleteTooltip>
          {" }"});
          <br />
          <br />
          <span className="text-[#6a9955]">
            {"// 3. Invalid Route (TypeScript catches typos!)"}
          </span>
          <br />
          <span className="text-[#c586c0]">await</span>{" "}
          <span className="text-[#dcdcaa]">apiFetch</span>(
          <HoverTooltip
            tooltip={`Argument of type '"/api/uwsers/34"' is not assignable to parameter of type 'keyof KnownRoutes'.`}
            isError
          >
            <span className="text-[#ce9178]">&quot;/api/uwsers/34&quot;</span>
          </HoverTooltip>
          , {"{"} method: <span className="text-[#ce9178]">&quot;DELETE&quot;</span> {"}"});
          <br />
          <br />
          <span className="text-[#6a9955]">
            {"// 4. Invalid Method (TypeScript catches wrong methods!)"}
          </span>
          <br />
          <span className="text-[#c586c0]">await</span>{" "}
          <span className="text-[#dcdcaa]">apiFetch</span>(
          <span className="text-[#ce9178]">&quot;/api/extreme/methods&quot;</span>, {"{"} method:{" "}
          <HoverTooltip tooltip={`Type '"POST"' is not assignable to type '"GET"'.`} isError>
            <span className="text-[#ce9178]">&quot;POST&quot;</span>
          </HoverTooltip>
          {" }"});
          <br />
          <br />
          <span className="text-[#6a9955]">{"// 5. Extreme Recursive Type Inference"}</span>
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
          ,{" "}
          <HoverTooltip
            tooltip={`const err2:
  ApiErrorPayload<"system:unknown-error"> |
  ApiErrorPayload<"system:internal-server-error"> |
  ApiErrorPayload<"validation:invalid-payload"> |
  null`}
          >
            <span className="text-[#9cdcfe]">err2</span>
          </HoverTooltip>{" "}
          ] = <span className="text-[#c586c0]">await</span>{" "}
          <span className="text-[#dcdcaa]">apiFetch</span>(
          <span className="text-[#ce9178]">&quot;/api/extreme/complex-types&quot;</span>, {"{"}{" "}
          method: <span className="text-[#ce9178]">&quot;POST&quot;</span> {"}"});
          <br />
          <br />
          <span className="text-[#6a9955]">{"// 6. Deeply Nested Catch-All Routes"}</span>
          <br />
          <span className="text-[#569cd6]">const</span> [{" "}
          <HoverTooltip
            tooltip={`const res3: {
  resolvedOrgId: string;
  resolvedProjectId: string;
  dynamicSegments: string[];
  deeplyNestedMatrix: {
    layer1: {
      layer2: {
        layer3: readonly [readonly [{
          readonly x: 1;
          readonly y: 2;
        }, {
          readonly x: 3;
          readonly y: 4;
        }], readonly [{
          readonly x: 5;
          readonly y: 6;
        }, {
          readonly x: 7;
          readonly y: 8;
        }]];
      };
    };
  };
} | null`}
          >
            <span className="text-[#9cdcfe]">res3</span>
          </HoverTooltip>
          ,{" "}
          <HoverTooltip tooltip={`const err3: ApiErrorPayload<"system:unknown-error"> | null`}>
            <span className="text-[#9cdcfe]">err3</span>
          </HoverTooltip>{" "}
          ] = <span className="text-[#c586c0]">await</span>{" "}
          <span className="text-[#dcdcaa]">apiFetch</span>(
          <br />
          {"  "}
          <span className="text-[#ce9178]">
            &quot;/api/extreme/acme/projects/xyz/tasks/a/b/c&quot;
          </span>
          ,
          <br />
          {"  {"} method: <span className="text-[#ce9178]">&quot;GET&quot;</span> {"}"}
          <br />
          );
          <br />
          <br />
          <span className="text-[#6a9955]">{"// 7. Strict Method Matching"}</span>
          <br />
          <span className="text-[#569cd6]">const</span> [{" "}
          <HoverTooltip
            tooltip={`const resGet: {
  method: "GET";
  data: number[];
} | null`}
          >
            <span className="text-[#9cdcfe]">resGet</span>
          </HoverTooltip>
          ,{" "}
          <HoverTooltip tooltip={`const errGet: ApiErrorPayload<"system:unknown-error"> | null`}>
            <span className="text-[#9cdcfe]">errGet</span>
          </HoverTooltip>{" "}
          ] = <span className="text-[#c586c0]">await</span>{" "}
          <span className="text-[#dcdcaa]">apiFetch</span>(
          <span className="text-[#ce9178]">&quot;/api/extreme/methods&quot;</span>, {"{"} method:{" "}
          <span className="text-[#ce9178]">&quot;GET&quot;</span> {"}"});
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
