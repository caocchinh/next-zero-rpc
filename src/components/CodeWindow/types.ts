export type TabId =
  | "api/users/[id]/route.ts"
  | "client.tsx"
  | "apiClient.ts"
  | "apiRegistry.ts"
  | "responses.ts"
  | "update-api-registry.mjs";

export type FileNode = {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  icon?: React.ReactNode;
};
