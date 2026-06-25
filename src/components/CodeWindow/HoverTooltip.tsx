import React from "react";

export const HoverTooltip = ({
  children,
  tooltip,
}: {
  children: React.ReactNode;
  tooltip: React.ReactNode;
}) => {
  return (
    <span className="group relative inline-block cursor-help border-b border-dashed border-zinc-500 hover:border-zinc-300">
      {children}
      <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-max -translate-x-1/2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <div className="rounded-md border border-zinc-700 bg-[#252526] px-3 py-2 text-[11px] text-zinc-300 shadow-xl ring-1 ring-black/50">
          <div className="font-mono whitespace-nowrap">{tooltip}</div>
        </div>
        {/* Triangle pointer */}
        <div className="absolute left-1/2 top-full -mt-px h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-zinc-700 bg-[#252526]"></div>
      </div>
    </span>
  );
};
