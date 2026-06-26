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
      <div className="custom-scrollbar overflow-visible p-4 font-mono text-[13px] leading-6 text-[#d4d4d4]">
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

          {/* ── 1. Happy Path ── */}
          <span className="text-[#6a9955]">{"// 1. Happy Path — response is fully typed from your route handler"}</span>
          <br />
          <span className="text-[#569cd6]">const</span> [{" "}
          <HoverTooltip tooltip="{ id: string; name: string; role: string } | null">
            <span className="text-[#9cdcfe]">data</span>
          </HoverTooltip>
          ,{" "}
          <HoverTooltip
            tooltip={`const err:\n  ApiErrorPayload<"system:unknown-error"> |\n  ApiErrorPayload<"system:database-error"> |\n  null`}
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
          <span className="text-[#4ec9b0]">console</span>.
          <span className="text-[#dcdcaa]">error</span>(err.
          <span className="text-[#9cdcfe]">message</span>);
          <br />
          {"} "}
          <span className="text-[#c586c0]">else</span> {"{"}
          <br />
          {"  "}
          <span className="text-[#6a9955]">{"// data.name, data.id, data.role — inferred directly from the route!"}</span>
          <br />
          {"  "}
          <span className="text-[#4ec9b0]">console</span>.
          <span className="text-[#dcdcaa]">log</span>(data.
          <span className="text-[#9cdcfe]">name</span>, data.
          <span className="text-[#9cdcfe]">role</span>);
          <br />
          {"}"}
          <br />
          <br />

          {/* ── 2. Exhaustive Error Narrowing ── */}
          <span className="text-[#6a9955]">{"// 2. Exhaustive Error Narrowing"}</span>
          <br />
          <span className="text-[#6a9955]">{"// TypeScript narrows err.code to exactly the codes this route can return."}</span>
          <br />
          <span className="text-[#6a9955]">{"// assertNever() is a compile-time guard — remove any case and TS errors."}</span>
          <br />
          <span className="text-[#569cd6]">const</span> [{" "}
          <HoverTooltip tooltip="{ id: string; name: string; role: string } | null">
            <span className="text-[#9cdcfe]">data2</span>
          </HoverTooltip>
          ,{" "}
          <HoverTooltip
            tooltip={`const err2:\n  ApiErrorPayload<"system:unknown-error"> |\n  ApiErrorPayload<"system:database-error"> |\n  null`}
          >
            <span className="text-[#9cdcfe]">err2</span>
          </HoverTooltip>{" "}
          ] = <span className="text-[#c586c0]">await</span>{" "}
          <span className="text-[#dcdcaa]">apiFetch</span>(
          <span className="text-[#ce9178]">&quot;/api/users/123&quot;</span>, {"{"} method:{" "}
          <span className="text-[#ce9178]">&quot;GET&quot;</span> {"}"});
          <br />
          <br />
          <span className="text-[#c586c0]">if</span> (err2) {"{"}
          <br />
          {"  "}
          <span className="text-[#569cd6]">const</span> code = err2.
          <span className="text-[#9cdcfe]">code</span>;
          <br />
          {"  "}
          <span className="text-[#c586c0]">switch</span> (code) {"{"}
          <br />
          {"    "}
          <span className="text-[#c586c0]">case</span>{" "}
          <span className="text-[#ce9178]">&quot;system:database-error&quot;</span>:
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
          {"}"}
          <br />
          <br />

          {/* ── 3. Invalid Route ── */}
          <span className="text-[#6a9955]">
            {"// 3. TypeScript Catches Typos — compile error on an invalid route path"}
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

          {/* ── 4. Invalid Method ── */}
          <span className="text-[#6a9955]">
            {"// 4. TypeScript Catches Wrong Methods — POST is not exported from /api/status"}
          </span>
          <br />
          <span className="text-[#c586c0]">await</span>{" "}
          <span className="text-[#dcdcaa]">apiFetch</span>(
          <span className="text-[#ce9178]">&quot;/api/status&quot;</span>, {"{"}{" "}
          <HoverTooltip tooltip={`Type '"POST"' is not assignable to type '"GET"'.`} isError>
            <span>method</span>
          </HoverTooltip>
          {": "}
          <span className="text-[#ce9178]">&quot;POST&quot;</span>
          {" }"});
          <br />
          <br />

          {/* ── 5a. IntelliSense: Available Routes ── */}
          <span className="text-[#6a9955]">{"// 5a. IDE IntelliSense: Available Routes"}</span>
          <br />
          <span className="text-[#6a9955]">{"// Place cursor inside the string — your IDE lists every registered route."}</span>
          <br />
          <span className="text-[#c586c0]">await</span>{" "}
          <span className="text-[#dcdcaa]">apiFetch</span>(
          <AutocompleteTooltip
            items={[
              "/api/auth/login",
              "/api/extreme/[orgId]/projects/[projectId]/tasks/[...catchall]",
              "/api/extreme/complex-types",
              "/api/extreme/methods",
              "/api/status",
              "/api/users/[userId]",
              "/api/users/active",
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

          {/* ── 5b. IntelliSense: Allowed Methods ── */}
          <span className="text-[#6a9955]">{"// 5b. IDE IntelliSense: Allowed Methods"}</span>
          <br />
          <span className="text-[#6a9955]">{"// Place cursor inside method — your IDE narrows to only what this route exports."}</span>
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

          {/* ── 6. Static vs Dynamic Route Precedence ── */}
          <span className="text-[#6a9955]">{"// 6. Static vs Dynamic Route Precedence"}</span>
          <br />
          <span className="text-[#6a9955]">
            {"// /api/users/active matches the static route exactly — not the [userId] segment."}
          </span>
          <br />
          <span className="text-[#569cd6]">const</span> [{" "}
          <HoverTooltip
            tooltip={`const activeUsers: {\n  activeUsers: {\n    id: string;\n    name: string;\n    role: string;\n  }[];\n  count: number;\n} | null`}
          >
            <span className="text-[#9cdcfe]">activeUsers</span>
          </HoverTooltip>
          ,{" "}
          <HoverTooltip tooltip={`const errActive: ApiErrorPayload<"system:unknown-error"> | null`}>
            <span className="text-[#9cdcfe]">errActive</span>
          </HoverTooltip>{" "}
          ] = <span className="text-[#c586c0]">await</span>{" "}
          <span className="text-[#dcdcaa]">apiFetch</span>(
          <span className="text-[#ce9178]">&quot;/api/users/active&quot;</span>, {"{"} method:{" "}
          <span className="text-[#ce9178]">&quot;GET&quot;</span> {"}"});
          <br />
          <br />
          <span className="text-[#6a9955]">
            {"// /api/users/123 correctly resolves to the dynamic [userId] route."}
          </span>
          <br />
          <span className="text-[#569cd6]">const</span> [{" "}
          <HoverTooltip
            tooltip={`const singleUser: {\n  id: string;\n  name: string;\n  role: string;\n} | null`}
          >
            <span className="text-[#9cdcfe]">singleUser</span>
          </HoverTooltip>
          ,{" "}
          <HoverTooltip
            tooltip={`const errSingle:\n  ApiErrorPayload<"system:unknown-error"> |\n  ApiErrorPayload<"system:database-error"> |\n  null`}
          >
            <span className="text-[#9cdcfe]">errSingle</span>
          </HoverTooltip>{" "}
          ] = <span className="text-[#c586c0]">await</span>{" "}
          <span className="text-[#dcdcaa]">apiFetch</span>(
          <span className="text-[#ce9178]">&quot;/api/users/123&quot;</span>, {"{"} method:{" "}
          <span className="text-[#ce9178]">&quot;GET&quot;</span> {"}"});
          <br />
          <br />

          {/* ── 7. Multi-Variable Template Literals ── */}
          <span className="text-[#6a9955]">{"// 7. Multi-Variable Template Literals"}</span>
          <br />
          <span className="text-[#6a9955]">
            {"// All three runtime variables resolve independently — TypeScript still correctly"}
          </span>
          <br />
          <span className="text-[#6a9955]">
            {"// matches the route /api/extreme/[orgId]/projects/[projectId]/tasks/[...catchall]"}
          </span>
          <br />
          <span className="text-[#569cd6]">const</span> orgId ={" "}
          <span className="text-[#ce9178]">&quot;acme&quot;</span>;
          <br />
          <span className="text-[#569cd6]">const</span> projectId ={" "}
          <span className="text-[#ce9178]">&quot;proj-99&quot;</span>;
          <br />
          <span className="text-[#569cd6]">const</span> catchall ={" "}
          <span className="text-[#ce9178]">&quot;step1/step2/step3&quot;</span>;
          <br />
          <span className="text-[#569cd6]">const</span> [{" "}
          <HoverTooltip
            tooltip={`const task: {\n  resolvedOrgId: string;\n  resolvedProjectId: string;\n  dynamicSegments: string[];\n  deeplyNestedMatrix: {\n    layer1: {\n      layer2: {\n        layer3: readonly [readonly [{\n          readonly x: 1;\n          readonly y: 2;\n        }, {\n          readonly x: 3;\n          readonly y: 4;\n        }], readonly [{\n          readonly x: 5;\n          readonly y: 6;\n        }, {\n          readonly x: 7;\n          readonly y: 8;\n        }]];\n      };\n    };\n  };\n} | null`}
          >
            <span className="text-[#9cdcfe]">task</span>
          </HoverTooltip>
          ,{" "}
          <HoverTooltip tooltip={`const taskErr: ApiErrorPayload<"system:unknown-error"> | null`}>
            <span className="text-[#9cdcfe]">taskErr</span>
          </HoverTooltip>{" "}
          ] = <span className="text-[#c586c0]">await</span>{" "}
          <span className="text-[#dcdcaa]">apiFetch</span>(
          <br />
          {"  "}
          <span className="text-[#ce9178]">{"`/api/extreme/"}</span>
          <span className="text-[#569cd6]">{"${"}</span>
          <span className="text-[#9cdcfe]">orgId</span>
          <span className="text-[#569cd6]">{"}"}</span>
          <span className="text-[#ce9178]">{"/projects/"}</span>
          <span className="text-[#569cd6]">{"${"}</span>
          <span className="text-[#9cdcfe]">projectId</span>
          <span className="text-[#569cd6]">{"}"}</span>
          <span className="text-[#ce9178]">{"/tasks/"}</span>
          <span className="text-[#569cd6]">{"${"}</span>
          <span className="text-[#9cdcfe]">catchall</span>
          <span className="text-[#569cd6]">{"}"}</span>
          <span className="text-[#ce9178]">{"` "}</span>
          ,
          <br />
          {"  {"} method: <span className="text-[#ce9178]">&quot;GET&quot;</span> {"}"}
          <br />
          );
          <br />
          <br />

          {/* ── 8. Deeply Nested Catch-All Routes ── */}
          <span className="text-[#6a9955]">{"// 8. Deeply Nested Catch-All Routes"}</span>
          <br />
          <span className="text-[#569cd6]">const</span> [{" "}
          <HoverTooltip
            tooltip={`const res3: {\n  resolvedOrgId: string;\n  resolvedProjectId: string;\n  dynamicSegments: string[];\n  deeplyNestedMatrix: {\n    layer1: {\n      layer2: {\n        layer3: readonly [readonly [{\n          readonly x: 1;\n          readonly y: 2;\n        }, {\n          readonly x: 3;\n          readonly y: 4;\n        }], readonly [{\n          readonly x: 5;\n          readonly y: 6;\n        }, {\n          readonly x: 7;\n          readonly y: 8;\n        }]];\n      };\n    };\n  };\n} | null`}
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

          {/* ── 9. Strict Method Matching ── */}
          <span className="text-[#6a9955]">
            {"// 9. Strict Method Matching — each method has its own unique response type"}
          </span>
          <br />
          <span className="text-[#569cd6]">const</span> [{" "}
          <HoverTooltip
            tooltip={`const resGet: {\n  method: "GET";\n  data: number[];\n} | null`}
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
          <br />
          <br />

          {/* ── 10. Extreme Recursive Type Inference ── */}
          <span className="text-[#6a9955]">{"// 10. Extreme Recursive Type Inference"}</span>
          <br />
          <span className="text-[#6a9955]">
            {"// Discriminated unions, recursive trees, intersections — all preserved end-to-end."}
          </span>
          <br />
          <span className="text-[#569cd6]">const</span> [{" "}
          <HoverTooltip
            tooltip={`const res2: {\n  union: {\n    type: "success";\n    payload: {\n      id: string;\n      metrics: Record<string, number[]>;\n    };\n  };\n  tree: RecursiveTree<DiscriminatedUnion>;\n  intersection: {\n    base: string;\n  } & {\n    variantB: boolean;\n  };\n  matrixStringTuple: readonly ["a", "b", "c"];\n  nullableField: null;\n  optionalField: string | undefined;\n  bigIntSimulate: string;\n} | null`}
          >
            <span className="text-[#9cdcfe]">res2</span>
          </HoverTooltip>
          ,{" "}
          <HoverTooltip
            tooltip={`const err2b:\n  ApiErrorPayload<"system:unknown-error"> |\n  ApiErrorPayload<"system:internal-server-error"> |\n  ApiErrorPayload<"validation:invalid-payload"> |\n  null`}
          >
            <span className="text-[#9cdcfe]">err2b</span>
          </HoverTooltip>{" "}
          ] = <span className="text-[#c586c0]">await</span>{" "}
          <span className="text-[#dcdcaa]">apiFetch</span>(
          <span className="text-[#ce9178]">&quot;/api/extreme/complex-types&quot;</span>, {"{"}{" "}
          method: <span className="text-[#ce9178]">&quot;POST&quot;</span> {"}"});
          <br />
          <br />

          {/* ── 11. Query Strings ── */}
          <span className="text-[#6a9955]">{"// 11. Query Strings — safely stripped before validating the route path"}</span>
          <br />
          <span className="text-[#569cd6]">const</span> [{" "}
          <HoverTooltip
            tooltip={`const withQuery: {\n  id: string;\n  name: string;\n  role: string;\n} | null`}
          >
            <span className="text-[#9cdcfe]">withQuery</span>
          </HoverTooltip>
          ,{" "}
          <HoverTooltip
            tooltip={`const errQuery:\n  ApiErrorPayload<"system:unknown-error"> |\n  ApiErrorPayload<"system:database-error"> |\n  null`}
          >
            <span className="text-[#9cdcfe]">errQuery</span>
          </HoverTooltip>{" "}
          ] = <span className="text-[#c586c0]">await</span>{" "}
          <span className="text-[#dcdcaa]">apiFetch</span>(
          <span className="text-[#ce9178]">&quot;/api/users/123?include=profile&quot;</span>, {"{"} method:{" "}
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
