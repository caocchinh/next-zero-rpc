import type typescript from "typescript/lib/tsserverlibrary";
import { getApiFetchRouteAtPosition } from "./astUtils";
import { detectProjectRoot, resolveRouteToFile } from "./routeResolver";

/**
 * next-zero-rpc TypeScript Language Service Plugin
 *
 * Provides "Go to Definition" (Ctrl+Click) for route string literals
 * inside `apiFetch(...)` calls, jumping directly to the matching route.ts file.
 *
 * Setup — add to your tsconfig.json:
 * {
 *   "compilerOptions": {
 *     "plugins": [{ "name": "next-zero-rpc-ts-plugin" }]
 *   }
 * }
 */
function init(modules: { typescript: typeof typescript }) {
  const ts = modules.typescript;

  function create(info: typescript.server.PluginCreateInfo): typescript.LanguageService {
    const { languageService, project } = info;

    // ── Logging ────────────────────────────────────────────────────────────
    const log = (msg: string) =>
      info.project.projectService.logger.info(`[next-zero-rpc] ${msg}`);

    log("Plugin activated.");

    // ── Create a proxy around the existing language service ────────────────
    const proxy = Object.create(languageService) as typescript.LanguageService;

    // ── Go to Definition ───────────────────────────────────────────────────
    proxy.getDefinitionAtPosition = (
      fileName: string,
      position: number,
    ): readonly typescript.DefinitionInfo[] | undefined => {
      // 1. Check if cursor is on an apiFetch route string
      const program = languageService.getProgram();
      const sourceFile = program?.getSourceFile(fileName);
      if (!sourceFile) {
        return languageService.getDefinitionAtPosition(fileName, position);
      }

      const routeString = getApiFetchRouteAtPosition(sourceFile, position, ts);
      if (!routeString) {
        // Not inside apiFetch — fall through to the default behavior
        return languageService.getDefinitionAtPosition(fileName, position);
      }

      log(`Resolving route: "${routeString}" from ${fileName}`);

      // 2. Detect the Next.js project root from the current file
      const projectRoot =
        detectProjectRoot(fileName) ??
        project.getCurrentDirectory();

      // 3. Resolve the route string to a route.ts file path
      const resolved = resolveRouteToFile(routeString, projectRoot);

      if (!resolved) {
        log(`No route.ts found for "${routeString}" in ${projectRoot}`);
        // Fall through so the user gets a helpful error from TS itself
        return languageService.getDefinitionAtPosition(fileName, position);
      }

      log(`Resolved "${routeString}" → ${resolved.filePath} (${resolved.routeKey})`);

      // 4. Build a DefinitionInfo pointing to the route.ts file
      const targetSourceFile = program?.getSourceFile(resolved.filePath);

      // If tsserver already has the file open, point to it precisely
      if (targetSourceFile) {
        return [
          {
            fileName: resolved.filePath,
            textSpan: { start: 0, length: 0 },
            kind: ts.ScriptElementKind.moduleElement,
            name: resolved.routeKey,
            containerName: "next-zero-rpc",
            containerKind: ts.ScriptElementKind.moduleElement,
          },
        ];
      }

      // File exists on disk but isn't open — still navigate to it
      return [
        {
          fileName: resolved.filePath,
          textSpan: { start: 0, length: 0 },
          kind: ts.ScriptElementKind.moduleElement,
          name: resolved.routeKey,
          containerName: "next-zero-rpc",
          containerKind: ts.ScriptElementKind.moduleElement,
        },
      ];
    };

    // ── Quick Info (Hover) ─────────────────────────────────────────────────
    // Shows route resolution info when hovering over the string literal
    proxy.getQuickInfoAtPosition = (
      fileName: string,
      position: number,
    ): typescript.QuickInfo | undefined => {
      const program = languageService.getProgram();
      const sourceFile = program?.getSourceFile(fileName);

      if (sourceFile) {
        const routeString = getApiFetchRouteAtPosition(sourceFile, position, ts);

        if (routeString) {
          const projectRoot =
            detectProjectRoot(fileName) ??
            project.getCurrentDirectory();

          const resolved = resolveRouteToFile(routeString, projectRoot);

          if (resolved) {
            // Show which route.ts file matches, alongside the normal quickinfo
            const base = languageService.getQuickInfoAtPosition(fileName, position);
            const routeKeyDisplay = resolved.routeKey;
            const relativePath = resolved.filePath.replace(projectRoot, "").replace(/^[\\/]/, "");

            const hintText = `→ ${routeKeyDisplay}\n📄 ${relativePath}`;

            if (base) {
              return {
                ...base,
                documentation: [
                  ...(base.documentation ?? []),
                  {
                    kind: "text",
                    text: `\n\n**next-zero-rpc** — Ctrl+Click to open route handler:\n\`${hintText}\``,
                  },
                ],
              };
            }

            return {
              kind: ts.ScriptElementKind.string,
              kindModifiers: "",
              textSpan: {
                start: sourceFile.getPositionOfLineAndCharacter(0, 0),
                length: routeString.length,
              },
              displayParts: [
                { kind: "text", text: `Route: ${routeString}` },
              ],
              documentation: [
                {
                  kind: "text",
                  text: `**next-zero-rpc** — Ctrl+Click to open route handler:\n\`${hintText}\``,
                },
              ],
            };
          } else {
            // Route doesn't resolve — show a warning in the hover
            const base = languageService.getQuickInfoAtPosition(fileName, position);
            if (base) {
              return {
                ...base,
                documentation: [
                  ...(base.documentation ?? []),
                  {
                    kind: "text",
                    text: `\n\n⚠️ **next-zero-rpc**: No route.ts file found for \`${routeString}\``,
                  },
                ],
              };
            }
          }
        }
      }

      return languageService.getQuickInfoAtPosition(fileName, position);
    };

    return proxy;
  }

  function getExternalFiles(
    _project: typescript.server.Project,
  ): string[] {
    return [];
  }

  return { create, getExternalFiles };
}

export = init;
