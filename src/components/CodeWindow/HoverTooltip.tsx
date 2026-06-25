import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export const HoverTooltip = ({
  children,
  tooltip,
  isError = false,
}: {
  children: React.ReactNode;
  tooltip: string;
  isError?: boolean;
}) => {
  return (
    <span
      className={`group relative inline-block cursor-help ${
        isError
          ? "underline decoration-red-500 decoration-wavy underline-offset-4"
          : "border-b border-dashed border-zinc-500 hover:border-zinc-300"
      }`}
    >
      {children}
      <div className="pointer-events-none absolute bottom-full left-0 z-50 w-max pb-2 opacity-0 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
        <div className="relative rounded-md border border-zinc-700 bg-[#252526] px-3 py-2 text-left text-[11px] text-zinc-300 shadow-xl ring-1 ring-black/50">
          {isError ? (
            <div className="font-mono text-[11px] leading-[1.4] whitespace-pre-wrap text-zinc-300">
              {tooltip}
            </div>
          ) : (
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
          )}
          {/* Triangle pointer */}
          <div className="absolute top-full left-4 -mt-px h-2 w-2 rotate-45 border-r border-b border-zinc-700 bg-[#252526]"></div>
        </div>
      </div>
    </span>
  );
};

export const AutocompleteTooltip = ({
  children,
  items,
  selectedIndex = 0,
}: {
  children: React.ReactNode;
  items: string[];
  selectedIndex?: number;
}) => {
  return (
    <span className="group relative inline-block cursor-text">
      {children}
      <div className="pointer-events-none absolute top-full left-0 z-50 mt-1 w-max opacity-0 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
        <div className="flex flex-col border border-zinc-700 bg-[#252526] py-1 text-left font-mono text-[13px] text-[#cccccc] shadow-xl ring-1 ring-black/50">
          {items.map((item, i) => (
            <div
              key={item}
              className={`flex cursor-pointer items-center justify-between px-1 py-[2px] pr-4 ${
                i === selectedIndex ? "bg-[#094771] text-white" : "hover:bg-[#2a2d2e]"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="ml-1 text-[#007acc]">
                  <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                    <path d="M1 3h14v10H1V3zm1 1v8h12V4H2zm2 2h8v1H4V6zm0 2h8v1H4V8zm0 2h5v1H4v-1z" />
                  </svg>
                </span>
                <span>{item}</span>
              </div>
              {i === selectedIndex && (
                <div className="ml-8 flex items-center gap-2 text-[12px] opacity-60">
                  <span>↵</span>
                  <span>{item}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </span>
  );
};
