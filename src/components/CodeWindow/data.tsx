import { Code2, FileJson, FileType, Terminal } from "lucide-react";
import {
  API_CLIENT_CODE,
  API_REGISTRY_CODE,
  BRUH_ROUTE_CODE,
  CATCHALL_ROUTE_CODE,
  COMPLEX_TYPES_ROUTE_CODE,
  METHODS_ROUTE_CODE,
  RESPONSES_CODE,
  ROUTE_TS_CODE,
  UPDATE_REGISTRY_CODE,
} from "../CodeData";
import { FileNode, TabId } from "./types";

export const FILE_TREE: FileNode[] = [
  {
    id: "NEXT-ZERO-RPC",
    name: "NEXT-ZERO-RPC",
    type: "folder",
    children: [
      {
        id: "app",
        name: "app",
        type: "folder",
        children: [
          {
            id: "api",
            name: "api",
            type: "folder",
            children: [
              {
                id: "(skibidi)",
                name: "(skibidi)",
                type: "folder",
                children: [
                  {
                    id: "bruh",
                    name: "bruh",
                    type: "folder",
                    children: [
                      {
                        id: "api/(skibidi)/bruh/route.ts",
                        name: "route.ts",
                        type: "file",
                        icon: <Terminal className="h-3.5 w-3.5 text-green-400" />,
                      },
                    ],
                  },
                ],
              },
              {
                id: "extreme",
                name: "extreme",
                type: "folder",
                children: [
                  {
                    id: "complex-types",
                    name: "complex-types",
                    type: "folder",
                    children: [
                      {
                        id: "api/extreme/complex-types/route.ts",
                        name: "route.ts",
                        type: "file",
                        icon: <Terminal className="h-3.5 w-3.5 text-green-400" />,
                      },
                    ],
                  },
                  {
                    id: "methods",
                    name: "methods",
                    type: "folder",
                    children: [
                      {
                        id: "api/extreme/methods/route.ts",
                        name: "route.ts",
                        type: "file",
                        icon: <Terminal className="h-3.5 w-3.5 text-green-400" />,
                      },
                    ],
                  },
                  {
                    id: "[orgId]",
                    name: "[orgId]",
                    type: "folder",
                    children: [
                      {
                        id: "projects",
                        name: "projects",
                        type: "folder",
                        children: [
                          {
                            id: "[projectId]",
                            name: "[projectId]",
                            type: "folder",
                            children: [
                              {
                                id: "tasks",
                                name: "tasks",
                                type: "folder",
                                children: [
                                  {
                                    id: "[...catchall]",
                                    name: "[...catchall]",
                                    type: "folder",
                                    children: [
                                      {
                                        id: "api/extreme/[orgId]/projects/[projectId]/tasks/[...catchall]/route.ts",
                                        name: "route.ts",
                                        type: "file",
                                        icon: <Terminal className="h-3.5 w-3.5 text-green-400" />,
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                id: "users",
                name: "users",
                type: "folder",
                children: [
                  {
                    id: "[userId]",
                    name: "[userId]",
                    type: "folder",
                    children: [
                      {
                        id: "api/users/[userId]/route.ts",
                        name: "route.ts",
                        type: "file",
                        icon: <Terminal className="h-3.5 w-3.5 text-green-400" />,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "components",
        name: "components",
        type: "folder",
        children: [
          {
            id: "client.tsx",
            name: "client.tsx",
            type: "file",
            icon: <Code2 className="h-3.5 w-3.5 text-cyan-400" />,
          },
        ],
      },
      {
        id: "lib",
        name: "lib",
        type: "folder",
        children: [
          {
            id: "next-zero-rpc",
            name: "next-zero-rpc",
            type: "folder",
            children: [
              {
                id: "apiClient.ts",
                name: "apiClient.ts",
                type: "file",
                icon: <FileType className="h-3.5 w-3.5 text-blue-400" />,
              },
              {
                id: "apiRegistry.ts",
                name: "apiRegistry.ts",
                type: "file",
                icon: <FileType className="h-3.5 w-3.5 text-blue-400" />,
              },
              {
                id: "responses.ts",
                name: "responses.ts",
                type: "file",
                icon: <FileType className="h-3.5 w-3.5 text-blue-400" />,
              },
              {
                id: "update-api-registry.mjs",
                name: "update-api-registry.mjs",
                type: "file",
                icon: <FileJson className="h-3.5 w-3.5 text-yellow-400" />,
              },
            ],
          },
        ],
      },
    ],
  },
];

export const TAB_DATA: Record<
  TabId,
  { name: string; icon: React.ReactNode; code?: string; language?: string }
> = {
  "api/extreme/complex-types/route.ts": {
    name: "route.ts",
    icon: <Terminal className="h-3.5 w-3.5 text-green-400" />,
    code: COMPLEX_TYPES_ROUTE_CODE,
    language: "typescript",
  },
  "api/extreme/methods/route.ts": {
    name: "route.ts",
    icon: <Terminal className="h-3.5 w-3.5 text-green-400" />,
    code: METHODS_ROUTE_CODE,
    language: "typescript",
  },
  "api/extreme/[orgId]/projects/[projectId]/tasks/[...catchall]/route.ts": {
    name: "route.ts",
    icon: <Terminal className="h-3.5 w-3.5 text-green-400" />,
    code: CATCHALL_ROUTE_CODE,
    language: "typescript",
  },
  "api/users/[userId]/route.ts": {
    name: "route.ts",
    icon: <Terminal className="h-3.5 w-3.5 text-green-400" />,
    code: ROUTE_TS_CODE,
    language: "typescript",
  },
  "api/(skibidi)/bruh/route.ts": {
    name: "route.ts",
    icon: <Terminal className="h-3.5 w-3.5 text-green-400" />,
    code: BRUH_ROUTE_CODE,
    language: "typescript",
  },
  "client.tsx": {
    name: "client.tsx",
    icon: <Code2 className="h-3.5 w-3.5 text-cyan-400" />,
  },
  "apiClient.ts": {
    name: "apiClient.ts",
    icon: <FileType className="h-3.5 w-3.5 text-blue-400" />,
    code: API_CLIENT_CODE,
    language: "typescript",
  },
  "apiRegistry.ts": {
    name: "apiRegistry.ts",
    icon: <FileType className="h-3.5 w-3.5 text-blue-400" />,
    code: API_REGISTRY_CODE,
    language: "typescript",
  },
  "responses.ts": {
    name: "responses.ts",
    icon: <FileType className="h-3.5 w-3.5 text-blue-400" />,
    code: RESPONSES_CODE,
    language: "typescript",
  },
  "update-api-registry.mjs": {
    name: "update-api-registry.mjs",
    icon: <FileJson className="h-3.5 w-3.5 text-yellow-400" />,
    code: UPDATE_REGISTRY_CODE,
    language: "javascript",
  },
};
