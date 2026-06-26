import * as vscode from "vscode";

/**
 * Returns the configured function names that should trigger route navigation.
 * Defaults to ["apiFetch"] but users can add their own wrappers.
 */
export function getApiFetchNames(): string[] {
  const config = vscode.workspace.getConfiguration("nextZeroRpc");
  return config.get<string[]>("apiFetchFunctionNames") ?? ["apiFetch"];
}

/**
 * Extracts the route string from a position in a document if the cursor is
 * on the first string argument of an apiFetch-style call.
 */
export function getRouteAtPosition(
  document: vscode.TextDocument,
  position: vscode.Position,
): { route: string; range: vscode.Range } | undefined {
  const line = document.lineAt(position).text;
  const functionNames = getApiFetchNames();

  for (const fnName of functionNames) {
    const pattern = new RegExp(
      `${fnName}\\s*\\(\\s*(['"\`])(/[^'"\`]*)\\1`,
      "g",
    );

    let match: RegExpExecArray | null;
    while ((match = pattern.exec(line)) !== null) {
      const quote = match[1];
      const route = match[2];

      const quoteIndex = match.index + match[0].indexOf(quote);
      const routeStart = quoteIndex + 1;
      const routeEnd = routeStart + route.length;

      const col = position.character;
      if (col >= quoteIndex && col <= routeEnd + 1) {
        const start = new vscode.Position(position.line, routeStart);
        const end = new vscode.Position(position.line, routeEnd);
        return { route, range: new vscode.Range(start, end) };
      }
    }
  }

  return undefined;
}
