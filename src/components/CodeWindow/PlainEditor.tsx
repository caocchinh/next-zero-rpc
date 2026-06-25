import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export function PlainEditor({
  code,
  language = "typescript",
}: {
  code: string;
  language?: string;
}) {
  return (
    <SyntaxHighlighter
      language={language}
      style={vscDarkPlus}
      customStyle={{
        margin: 0,
        padding: "1rem",
        background: "transparent",
        fontSize: "13px",
        lineHeight: "1.5",
      }}
      codeTagProps={{
        style: {
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
        },
      }}
    >
      {code}
    </SyntaxHighlighter>
  );
}
