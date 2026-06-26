import { Code2, FileJson, FileType, Terminal } from "lucide-react";
import {
  APP_API_AUTH_LOGIN_ROUTE_TS_CODE,
  APP_API_CORE_STATUS_ROUTE_TS_CODE,
  APP_API_EXTREME_COMPLEX_TYPES_ROUTE_TS_CODE,
  APP_API_EXTREME_METHODS_ROUTE_TS_CODE,
  APP_API_EXTREME_ORGID_PROJECTS_PROJECTID_TASKS_CATCHALL_ROUTE_TS_CODE,
  APP_API_USERS_ACTIVE_ROUTE_TS_CODE,
  APP_API_USERS_USERID_ROUTE_TS_CODE,
  LIB_NEXT_ZERO_RPC_APICLIENT_TS_CODE,
  LIB_NEXT_ZERO_RPC_APIREGISTRY_TS_CODE,
  LIB_NEXT_ZERO_RPC_RESPONSES_TS_CODE,
  LIB_NEXT_ZERO_RPC_UPDATE_API_REGISTRY_MJS_CODE,
} from "../CodeData";
import { FileNode, TabId } from "./types";

export const FILE_TREE: FileNode[] = [
  {
    id: "examples/minimal",
    name: "examples/minimal",
    type: "folder",
    children: [
      {
        id: "src",
        name: "src",
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
                    id: "(core)",
                    name: "(core)",
                    type: "folder",
                    children: [
                      {
                        id: "status",
                        name: "status",
                        type: "folder",
                        children: [
                          {
                            id: "app/api/(core)/status/route.ts",
                            name: "route.ts",
                            type: "file",
                            icon: <Terminal className="h-3.5 w-3.5 text-green-400" />,
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: "auth",
                    name: "auth",
                    type: "folder",
                    children: [
                      {
                        id: "login",
                        name: "login",
                        type: "folder",
                        children: [
                          {
                            id: "app/api/auth/login/route.ts",
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
                                            id: "app/api/extreme/[orgId]/projects/[projectId]/tasks/[...catchall]/route.ts",
                                            name: "route.ts",
                                            type: "file",
                                            icon: (
                                              <Terminal className="h-3.5 w-3.5 text-green-400" />
                                            ),
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
                        id: "complex-types",
                        name: "complex-types",
                        type: "folder",
                        children: [
                          {
                            id: "app/api/extreme/complex-types/route.ts",
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
                            id: "app/api/extreme/methods/route.ts",
                            name: "route.ts",
                            type: "file",
                            icon: <Terminal className="h-3.5 w-3.5 text-green-400" />,
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
                        id: "active",
                        name: "active",
                        type: "folder",
                        children: [
                          {
                            id: "app/api/users/active/route.ts",
                            name: "route.ts",
                            type: "file",
                            icon: <Terminal className="h-3.5 w-3.5 text-green-400" />,
                          },
                        ],
                      },
                      {
                        id: "[userId]",
                        name: "[userId]",
                        type: "folder",
                        children: [
                          {
                            id: "app/api/users/[userId]/route.ts",
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
            id: "client.ts",
            name: "client.ts",
            type: "file",
            icon: <Code2 className="h-3.5 w-3.5 text-cyan-400" />,
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
                    id: "lib/next-zero-rpc/apiClient.ts",
                    name: "apiClient.ts",
                    type: "file",
                    icon: <FileType className="h-3.5 w-3.5 text-blue-400" />,
                  },
                  {
                    id: "lib/next-zero-rpc/apiRegistry.ts",
                    name: "apiRegistry.ts",
                    type: "file",
                    icon: <FileType className="h-3.5 w-3.5 text-blue-400" />,
                  },
                  {
                    id: "lib/next-zero-rpc/responses.ts",
                    name: "responses.ts",
                    type: "file",
                    icon: <FileType className="h-3.5 w-3.5 text-blue-400" />,
                  },
                  {
                    id: "lib/next-zero-rpc/update-api-registry.mjs",
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
      {
        id: "next-env.d.ts",
        name: "next-env.d.ts",
        type: "file",
        icon: <FileType className="h-3.5 w-3.5 text-blue-400" />,
      },
      {
        id: "next.config.mjs",
        name: "next.config.mjs",
        type: "file",
        icon: <FileJson className="h-3.5 w-3.5 text-yellow-400" />,
      },
      {
        id: "package.json",
        name: "package.json",
        type: "file",
        icon: <FileJson className="h-3.5 w-3.5 text-yellow-400" />,
      },
      {
        id: "tsconfig.json",
        name: "tsconfig.json",
        type: "file",
        icon: <FileJson className="h-3.5 w-3.5 text-yellow-400" />,
      },
    ],
  },
];

export const TAB_DATA: Record<
  TabId,
  { name: string; icon: React.ReactNode; code?: string; language?: string }
> = {
  "app/api/(core)/status/route.ts": {
    name: "route.ts",
    icon: <Terminal className="h-3.5 w-3.5 text-green-400" />,
    code: APP_API_CORE_STATUS_ROUTE_TS_CODE,
    language: "typescript",
  },
  "app/api/auth/login/route.ts": {
    name: "route.ts",
    icon: <Terminal className="h-3.5 w-3.5 text-green-400" />,
    code: APP_API_AUTH_LOGIN_ROUTE_TS_CODE,
    language: "typescript",
  },
  "app/api/extreme/[orgId]/projects/[projectId]/tasks/[...catchall]/route.ts": {
    name: "route.ts",
    icon: <Terminal className="h-3.5 w-3.5 text-green-400" />,
    code: APP_API_EXTREME_ORGID_PROJECTS_PROJECTID_TASKS_CATCHALL_ROUTE_TS_CODE,
    language: "typescript",
  },
  "app/api/extreme/complex-types/route.ts": {
    name: "route.ts",
    icon: <Terminal className="h-3.5 w-3.5 text-green-400" />,
    code: APP_API_EXTREME_COMPLEX_TYPES_ROUTE_TS_CODE,
    language: "typescript",
  },
  "app/api/extreme/methods/route.ts": {
    name: "route.ts",
    icon: <Terminal className="h-3.5 w-3.5 text-green-400" />,
    code: APP_API_EXTREME_METHODS_ROUTE_TS_CODE,
    language: "typescript",
  },
  "app/api/users/active/route.ts": {
    name: "route.ts",
    icon: <Terminal className="h-3.5 w-3.5 text-green-400" />,
    code: APP_API_USERS_ACTIVE_ROUTE_TS_CODE,
    language: "typescript",
  },
  "app/api/users/[userId]/route.ts": {
    name: "route.ts",
    icon: <Terminal className="h-3.5 w-3.5 text-green-400" />,
    code: APP_API_USERS_USERID_ROUTE_TS_CODE,
    language: "typescript",
  },
  "client.ts": {
    name: "client.ts",
    icon: <Code2 className="h-3.5 w-3.5 text-cyan-400" />,
  },
  "lib/next-zero-rpc/apiClient.ts": {
    name: "apiClient.ts",
    icon: <FileType className="h-3.5 w-3.5 text-blue-400" />,
    code: LIB_NEXT_ZERO_RPC_APICLIENT_TS_CODE,
    language: "typescript",
  },
  "lib/next-zero-rpc/apiRegistry.ts": {
    name: "apiRegistry.ts",
    icon: <FileType className="h-3.5 w-3.5 text-blue-400" />,
    code: LIB_NEXT_ZERO_RPC_APIREGISTRY_TS_CODE,
    language: "typescript",
  },
  "lib/next-zero-rpc/responses.ts": {
    name: "responses.ts",
    icon: <FileType className="h-3.5 w-3.5 text-blue-400" />,
    code: LIB_NEXT_ZERO_RPC_RESPONSES_TS_CODE,
    language: "typescript",
  },
  "lib/next-zero-rpc/update-api-registry.mjs": {
    name: "update-api-registry.mjs",
    icon: <FileJson className="h-3.5 w-3.5 text-yellow-400" />,
    code: LIB_NEXT_ZERO_RPC_UPDATE_API_REGISTRY_MJS_CODE,
    language: "javascript",
  },
  "next-env.d.ts": {
    name: "next-env.d.ts",
    icon: <FileType className="h-3.5 w-3.5 text-blue-400" />,
    code: `// This file is auto-generated by Next.js.
// Do not edit it manually.
/// <reference types="next" />
/// <reference types="next/image-types/global" />`,
    language: "typescript",
  },
  "next.config.mjs": {
    name: "next.config.mjs",
    icon: <FileJson className="h-3.5 w-3.5 text-yellow-400" />,
    code: `import { withApiRegistry } from "./src/lib/next-zero-rpc/update-api-registry.mjs";

const nextConfig = {};

export default withApiRegistry(nextConfig);`,
    language: "javascript",
  },
  "package.json": {
    name: "package.json",
    icon: <FileJson className="h-3.5 w-3.5 text-yellow-400" />,
    code: `{
  "name": "next-zero-rpc-minimal",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "infer": "node src/lib/next-zero-rpc/update-api-registry.mjs"
  },
  "//": "Minimum supported versions — any version above these is compatible",
  "dependencies": {
    "react": "^18",
    "react-dom": "^18",
    "next": "14.2.35"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "eslint": "^8",
    "eslint-config-next": "14.2.35"
  }
}`,
    language: "json",
  },
  "tsconfig.json": {
    name: "tsconfig.json",
    icon: <FileJson className="h-3.5 w-3.5 text-yellow-400" />,
    code: `{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] },
    "target": "ES2017"
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}`,
    language: "json",
  },
};
