import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Circle, ArrowLeft, ArrowRight, Clock } from "lucide-react";

interface LessonNavTarget {
  moduleId: string;
  lessonId: string;
  title: string;
}

interface LessonLayoutProps {
  moduleTitle: string;
  title: string;
  estimatedMinutes: number;
  isComplete: boolean;
  onToggleComplete: () => void;
  prev: LessonNavTarget | null;
  next: LessonNavTarget | null;
  children: ReactNode;
}

export function LessonLayout({
  moduleTitle,
  title,
  estimatedMinutes,
  isComplete,
  onToggleComplete,
  prev,
  next,
  children,
}: LessonLayoutProps) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
        {moduleTitle}
      </p>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">{title}</h1>
        <span className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
          <Clock className="h-3.5 w-3.5" />
          {estimatedMinutes} min
        </span>
      </div>

      <div className="prose-lesson text-[15px] leading-relaxed text-[var(--color-text)] [&_p]:my-3">
        {children}
      </div>

      <button
        type="button"
        onClick={onToggleComplete}
        className={`mt-8 flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium ${
          isComplete
            ? "border-[var(--color-success)]/40 bg-[var(--color-success-bg)] text-[var(--color-success)]"
            : "border-[var(--color-border)] text-[var(--color-text)] hover:bg-black/5"
        }`}
      >
        {isComplete ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
        {isComplete ? "Completed" : "Mark complete"}
      </button>

      <div className="mt-10 flex items-center justify-between border-t border-[var(--color-border)] pt-6">
        {prev ? (
          <Link
            to={`/module/${prev.moduleId}/lesson/${prev.lessonId}`}
            className="flex items-center gap-1 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          >
            <ArrowLeft className="h-4 w-4" />
            {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to={`/module/${next.moduleId}/lesson/${next.lessonId}`}
            className="flex items-center gap-1 text-sm font-medium text-[var(--color-accent)]"
          >
            {next.title}
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
