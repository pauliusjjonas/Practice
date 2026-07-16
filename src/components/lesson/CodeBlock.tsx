import type { Key } from "react";
import { Highlight, themes } from "prism-react-renderer";

interface CodeBlockProps {
  code: string;
  lang: string;
  filename?: string;
}

export function CodeBlock({ code, lang, filename }: CodeBlockProps) {
  return (
    <div className="my-4 overflow-hidden rounded-lg border border-[var(--color-border)]">
      {filename && (
        <div className="border-b border-[var(--color-border)] bg-black/30 px-4 py-1.5 font-mono text-xs text-neutral-300">
          {filename}
        </div>
      )}
      <Highlight theme={themes.vsDark} code={code.trim()} language={lang}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`${className} overflow-x-auto p-4 text-[13px] leading-relaxed`}
            style={style}
          >
            {tokens.map((line, i) => {
              const { key: lineKey, ...lineProps } = getLineProps({ line, key: i });
              return (
                <div key={lineKey as Key} {...lineProps}>
                  {line.map((token, key) => {
                    const { key: tokenKey, ...tokenProps } = getTokenProps({ token, key });
                    return <span key={tokenKey as Key} {...tokenProps} />;
                  })}
                </div>
              );
            })}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
