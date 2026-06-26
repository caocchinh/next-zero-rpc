import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { getRouteAtPosition } from "./utils";
import { detectProjectRoot, resolveRouteToFile } from "./routeResolver";

const ROUTE_TEMPLATE = `import { createApiSuccess, createApiError } from "@/lib/next-zero-rpc/responses";

export async function GET(req: Request) {
  return createApiSuccess({ message: "Route works!" });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return createApiSuccess({ received: true });
  } catch (error) {
    return createApiError("system:unknown-error", "An error occurred");
  }
}
`;

export class ApiFetchCodeActionProvider implements vscode.CodeActionProvider {
  provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
  ): vscode.CodeAction[] | undefined {
    const hit = getRouteAtPosition(document, range.start);
    if (!hit) return undefined;

    // Check if it already resolves
    const workspaceFolders = vscode.workspace.workspaceFolders ?? [];
    let isResolved = false;
    let projectRoot = "";

    for (const folder of workspaceFolders) {
      if (resolveRouteToFile(hit.route, folder.uri.fsPath)) {
        isResolved = true;
        break;
      }
      if (!projectRoot && fs.existsSync(path.join(folder.uri.fsPath, "package.json"))) {
        projectRoot = folder.uri.fsPath;
      }
    }

    if (!isResolved) {
      const detectedRoot = detectProjectRoot(document.fileName);
      if (detectedRoot) {
        projectRoot = detectedRoot;
        if (resolveRouteToFile(hit.route, detectedRoot)) {
          isResolved = true;
        }
      }
    }

    // If it already resolves, we don't need a quick fix
    if (isResolved || !projectRoot) return undefined;

    // It does not resolve. Provide a Quick Fix to scaffold the file.
    const action = new vscode.CodeAction(
      `next-zero-rpc: Create route handler for ${hit.route}`,
      vscode.CodeActionKind.QuickFix,
    );

    // Default to app/api
    const isSrc = fs.existsSync(path.join(projectRoot, "src", "app"));
    const baseAppDir = path.join(projectRoot, isSrc ? "src/app" : "app");
    
    // Strip query strings and clean up the path
    const cleanRoute = hit.route.split("?")[0].replace(/^\/+/, ""); // e.g. "api/users/34"
    
    // Check if it has obvious dynamic segments (like numbers) that should be [id]
    // A simple heuristic: if a segment is purely numeric, suggest a dynamic param
    const segments = cleanRoute.split("/").map(seg => {
      if (/^\d+$/.test(seg)) return "[id]";
      return seg;
    });

    const targetDir = path.join(baseAppDir, ...segments);
    const targetFile = path.join(targetDir, "route.ts");

    action.command = {
      command: "next-zero-rpc.createRoute",
      title: "Create Route",
      arguments: [targetFile],
    };
    
    // Make this the preferred action
    action.isPreferred = true;

    return [action];
  }
}
