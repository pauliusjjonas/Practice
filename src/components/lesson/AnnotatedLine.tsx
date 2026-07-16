import type { ReactNode } from "react";

interface AnnotatedLineProps {
  code: string;
  children: ReactNode;
}

/** One row of a line-by-line walkthrough directly under a CodeBlock. */
export function AnnotatedLine({ code, children }: AnnotatedLineProps) {
  return (
    <div className="flex flex-col gap-1 border-l-2 border-[var(--color-border)] py-1.5 pl-3 sm:flex-row sm:items-baseline sm:gap-4">
      <code className="shrink-0 whitespace-pre rounded bg-[var(--color-code-bg)] px-2 py-0.5 font-mono text-[13px] text-[var(--color-accent)] sm:w-auto">
        {code}
      </code>
      <p className="m-0 text-sm leading-relaxed text-[var(--color-text-muted)]">{children}</p>
    </div>
  );
}

export function AnnotatedLines({ children }: { children: ReactNode }) {
  return <div className="-mt-2 mb-4 space-y-0.5">{children}</div>;
}
