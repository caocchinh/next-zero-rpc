export type TabId = string;

export type FileNode = {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  icon?: React.ReactNode;
};
