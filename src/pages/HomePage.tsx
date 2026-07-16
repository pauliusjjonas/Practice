import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { MODULES, FLAT_LESSONS, lessonKey } from "../content/modules";
import { useProgress } from "../context/ProgressContext";

export function HomePage() {
  const { completedLessons, lastVisited } = useProgress();
  const total = FLAT_LESSONS.length;
  const done = completedLessons.length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  const resume = lastVisited
    ? FLAT_LESSONS.find((f) => lessonKey(f.moduleId, f.lesson.id) === lastVisited)
    : undefined;

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-2 text-2xl font-semibold text-[var(--color-text)]">
        Claude Code Learning Platform
      </h1>
      <p className="mb-6 text-sm leading-relaxed text-[var(--color-text-muted)]">
        A hands-on course for learning what Claude Code can do — with a deep dive on using it to
        design and build websites.
      </p>

      <div className="mb-8 rounded-lg border border-[var(--color-border)] p-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-[var(--color-text)]">Overall progress</span>
          <span className="text-[var(--color-text-muted)]">
            {done} / {total} lessons
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[var(--color-bg-subtle)]">
          <div
            className="h-full rounded-full bg-[var(--color-accent)] transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
        {resume && (
          <Link
            to={`/module/${resume.moduleId}/lesson/${resume.lesson.id}`}
            className="mt-4 flex items-center gap-1 text-sm font-medium text-[var(--color-accent)]"
          >
            Continue: {resume.lesson.title}
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      <div className="space-y-4">
        {MODULES.map((mod, i) => (
          <Link
            key={mod.id}
            to={`/module/${mod.id}`}
            className="block rounded-xl border border-[var(--color-border)] p-5 hover:bg-black/5"
          >
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
              Module {i + 1}
            </p>
            <h2 className="mb-1 text-lg font-semibold text-[var(--color-text)]">{mod.title}</h2>
            <p className="m-0 text-sm text-[var(--color-text-muted)]">{mod.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
