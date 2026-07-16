import { Link, useParams } from "react-router-dom";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { getModule, lessonKey } from "../content/modules";
import { useProgress } from "../context/ProgressContext";
import { NotFoundPage } from "./NotFoundPage";

export function ModulePage() {
  const { moduleId = "" } = useParams();
  const mod = getModule(moduleId);
  const { isComplete } = useProgress();

  if (!mod) return <NotFoundPage />;

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-2 text-2xl font-semibold text-[var(--color-text)]">{mod.title}</h1>
      <p className="mb-8 text-sm leading-relaxed text-[var(--color-text-muted)]">{mod.description}</p>
      <ul className="space-y-2">
        {mod.lessons.map((lesson, i) => {
          const done = isComplete(lessonKey(mod.id, lesson.id));
          return (
            <li key={lesson.id}>
              <Link
                to={`/module/${mod.id}/lesson/${lesson.id}`}
                className="flex items-center justify-between rounded-lg border border-[var(--color-border)] px-4 py-3 hover:bg-black/5"
              >
                <span className="flex items-center gap-3">
                  {done ? (
                    <CheckCircle2 className="h-5 w-5 text-[var(--color-success)]" />
                  ) : (
                    <Circle className="h-5 w-5 text-[var(--color-text-muted)]" />
                  )}
                  <span className="text-sm text-[var(--color-text)]">
                    {i + 1}. {lesson.title}
                  </span>
                </span>
                <span className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                  <Clock className="h-3.5 w-3.5" />
                  {lesson.estimatedMinutes} min
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
