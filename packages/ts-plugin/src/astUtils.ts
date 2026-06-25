import type typescript from "typescript";

/**
 * Walks up the AST from a given node, checking ancestors.
 */
function getAncestors(
  node: typescript.Node,
  sourceFile: typescript.SourceFile,
): typescript.Node[] {
  const ancestors: typescript.Node[] = [];
  let current: typescript.Node = node;

  while (current.parent) {
    current = current.parent;
    ancestors.push(current);
    if (current === sourceFile) break;
  }

  return ancestors;
}

/**
 * Extracts the raw string value from a StringLiteral or NoSubstitutionTemplateLiteral node.
 */
function getStringValue(
  node: typescript.Node,
  ts: typeof typescript,
): string | undefined {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }
  return undefined;
}

/**
 * Checks if a node is the first argument of a call to `apiFetch(...)`.
 *
 * Supports all these forms:
 *   apiFetch("/api/users/34", ...)
 *   apiFetch(`/api/users/34`, ...)
 */
export function getApiFetchRouteAtPosition(
  sourceFile: typescript.SourceFile,
  position: number,
  ts: typeof typescript,
): string | undefined {
  // Find the deepest node at the given position
  function findNodeAtPosition(
    node: typescript.Node,
  ): typescript.Node | undefined {
    if (position < node.getStart(sourceFile) || position > node.getEnd()) {
      return undefined;
    }
    let found: typescript.Node | undefined;
    ts.forEachChild(node, (child) => {
      const result = findNodeAtPosition(child);
      if (result) found = result;
    });
    return found ?? (node.getStart(sourceFile) <= position && node.getEnd() >= position ? node : undefined);
  }

  const nodeAtPos = findNodeAtPosition(sourceFile);
  if (!nodeAtPos) return undefined;

  // The node must be a string literal
  const stringValue = getStringValue(nodeAtPos, ts);
  if (stringValue === undefined) return undefined;

  // It must look like an API route (starts with "/")
  if (!stringValue.startsWith("/")) return undefined;

  // Walk up to find the containing CallExpression
  const ancestors = getAncestors(nodeAtPos, sourceFile);

  for (const ancestor of ancestors) {
    if (!ts.isCallExpression(ancestor)) continue;

    // The CallExpression must call `apiFetch`
    const expr = ancestor.expression;
    const calleeName = ts.isIdentifier(expr)
      ? expr.text
      : ts.isPropertyAccessExpression(expr)
        ? expr.name.text
        : undefined;

    if (calleeName !== "apiFetch") continue;

    // The string must be the FIRST argument
    if (ancestor.arguments.length === 0) continue;
    const firstArg = ancestor.arguments[0];
    if (firstArg !== nodeAtPos) continue;

    return stringValue;
  }

  return undefined;
}
