import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { detectProjectRoot, resolveRouteToFile } from "./routeResolver";
import { getRouteAtPosition } from "./utils";
import { ApiFetchCodeActionProvider } from "./codeActions";

function resolveRoute(
  document: vscode.TextDocument,
  route: string,
): vscode.Uri | undefined {
  const workspaceFolders = vscode.workspace.workspaceFolders ?? [];
  for (const folder of workspaceFolders) {
    const resolved = resolveRouteToFile(route, folder.uri.fsPath);
    if (resolved) return vscode.Uri.file(resolved.filePath);
  }

  const projectRoot = detectProjectRoot(document.fileName);
  if (projectRoot) {
    const resolved = resolveRouteToFile(route, projectRoot);
    if (resolved) return vscode.Uri.file(resolved.filePath);
  }
  return undefined;
}

class ApiFetchDefinitionProvider implements vscode.DefinitionProvider {
  provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
  ): vscode.Definition | undefined {
    const hit = getRouteAtPosition(document, position);
    if (!hit) return undefined;

    const uri = resolveRoute(document, hit.route);
    if (!uri) return undefined;

    return new vscode.Location(uri, new vscode.Position(0, 0));
  }
}

class ApiFetchHoverProvider implements vscode.HoverProvider {
  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
  ): vscode.Hover | undefined {
    const hit = getRouteAtPosition(document, position);
    if (!hit) return undefined;

    const workspaceFolders = vscode.workspace.workspaceFolders ?? [];
    let resolved;

    for (const folder of workspaceFolders) {
      const r = resolveRouteToFile(hit.route, folder.uri.fsPath);
      if (r) { resolved = r; break; }
    }

    if (!resolved) {
      const projectRoot = detectProjectRoot(document.fileName);
      if (projectRoot) resolved = resolveRouteToFile(hit.route, projectRoot);
    }

    if (resolved) {
      const workspaceRoot = workspaceFolders[0]?.uri.fsPath ?? "";
      const relativePath = resolved.filePath.replace(workspaceRoot, "").replace(/^[\\/]/, "");

      const md = new vscode.MarkdownString();
      md.isTrusted = true;
      md.supportHtml = false;

      md.appendMarkdown(`**next-zero-rpc** — Route handler\n\n`);
      md.appendCodeblock(`${resolved.routeKey}\n→ ${relativePath}`, "");
      md.appendMarkdown(`\n[Open route.ts](${vscode.Uri.file(resolved.filePath)})`);

      return new vscode.Hover(md, hit.range);
    } else {
      const md = new vscode.MarkdownString();
      md.appendMarkdown(`**next-zero-rpc** ⚠️\n\nNo \`route.ts\` found for \`${hit.route}\``);
      // We no longer suggest infer-api here since we have the Quick Fix lightbulb
      return new vscode.Hover(md, hit.range);
    }
  }
}

const SUPPORTED_LANGUAGES = [
  { language: "typescript" },
  { language: "typescriptreact" },
  { language: "javascript" },
  { language: "javascriptreact" },
];

export function activate(context: vscode.ExtensionContext): void {
  const definitionProvider = new ApiFetchDefinitionProvider();
  const hoverProvider = new ApiFetchHoverProvider();
  const codeActionProvider = new ApiFetchCodeActionProvider();

  for (const selector of SUPPORTED_LANGUAGES) {
    context.subscriptions.push(
      vscode.languages.registerDefinitionProvider(selector, definitionProvider),
      vscode.languages.registerHoverProvider(selector, hoverProvider),
      vscode.languages.registerCodeActionsProvider(selector, codeActionProvider, {
        providedCodeActionKinds: [vscode.CodeActionKind.QuickFix],
      }),
    );
  }

  // Register the command that the Quick Fix executes
  context.subscriptions.push(
    vscode.commands.registerCommand("next-zero-rpc.createRoute", async (targetFile: string) => {
      try {
        const targetDir = path.dirname(targetFile);
        fs.mkdirSync(targetDir, { recursive: true });

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
        fs.writeFileSync(targetFile, ROUTE_TEMPLATE, "utf-8");

        // Open the newly created file in the editor
        const document = await vscode.workspace.openTextDocument(vscode.Uri.file(targetFile));
        await vscode.window.showTextDocument(document);
      } catch (err) {
        vscode.window.showErrorMessage(`Failed to create route handler: ${err}`);
      }
    }),
  );
}

export function deactivate(): void {}
