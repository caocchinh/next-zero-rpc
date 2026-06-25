"use client";

import { ChevronDown, ChevronRight, FileIcon, FolderOpen } from "lucide-react";
import { useState } from "react";
import { FileNode, TabId } from "./types";

export function TreeItem({
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
            (isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />)}
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
