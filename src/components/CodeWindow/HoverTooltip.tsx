import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export const HoverTooltip = ({
  children,
  tooltip,
}: {
  children: React.ReactNode;
  tooltip: string;
}) => {
  return (
    <span className="group relative inline-block cursor-help border-b border-dashed border-zinc-500 hover:border-zinc-300">
      {children}
      <div className="pointer-events-none absolute bottom-full left-0 z-50 w-max pb-2 opacity-0 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
        <div className="relative rounded-md border border-zinc-700 bg-[#252526] px-3 py-2 text-left text-[11px] text-zinc-300 shadow-xl ring-1 ring-black/50">
          <SyntaxHighlighter
            language="typescript"
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: 0,
              background: "transparent",
              fontSize: "11px",
              lineHeight: "1.4",
            }}
            codeTagProps={{
              style: {
                fontFamily:
                  "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
              },
            }}
          >
            {tooltip}
          </SyntaxHighlighter>
          {/* Triangle pointer */}
          <div className="absolute top-full left-4 -mt-px h-2 w-2 rotate-45 border-r border-b border-zinc-700 bg-[#252526]"></div>
        </div>
      </div>
    </span>
  );
};
