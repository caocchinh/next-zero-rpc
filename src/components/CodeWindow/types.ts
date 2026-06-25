export type TabId =
  | "api/users/[userId]/route.ts"
  | "client.tsx"
  | "apiClient.ts"
  | "apiRegistry.ts"
  | "responses.ts"
  | "update-api-registry.mjs"
  | "api/extreme/complex-types/route.ts"
  | "api/extreme/[orgId]/projects/[projectId]/tasks/[...catchall]/route.ts"
  | "api/extreme/methods/route.ts"
  | "api/(skibidi)/bruh/route.ts";

export type FileNode = {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  icon?: React.ReactNode;
};
