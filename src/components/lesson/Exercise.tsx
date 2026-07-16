import type { ReactNode } from "react";
import { FlaskConical, CheckCircle2 } from "lucide-react";

interface ExerciseProps {
  title?: string;
  children: ReactNode;
  successLooksLike: ReactNode;
}

export function Exercise({ title = "Try it yourself", children, successLooksLike }: ExerciseProps) {
  return (
    <div className="my-6 rounded-xl border-2 border-dashed border-[var(--color-accent-border)] bg-[var(--color-accent-bg)] p-5">
      <div className="mb-3 flex items-center gap-2 font-semibold text-[var(--color-accent)]">
        <FlaskConical className="h-5 w-5" />
        {title}
      </div>
      <div className="space-y-3 text-sm leading-relaxed text-[var(--color-text)] [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5 [&_code]:rounded [&_code]:bg-[var(--color-code-bg)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[13px]">
        {children}
      </div>
      <div className="mt-4 flex gap-2 rounded-lg bg-[var(--color-success-bg)] px-3 py-2.5 text-sm text-[var(--color-success)]">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <span className="font-semibold">What success looks like: </span>
          <span className="text-[var(--color-text)]">{successLooksLike}</span>
        </div>
      </div>
    </div>
  );
}
