import { NavLink } from "react-router-dom";
import { CheckCircle2, Circle, BookOpen } from "lucide-react";
import { MODULES, lessonKey } from "../../content/modules";
import { useProgress } from "../../context/ProgressContext";

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const { isComplete } = useProgress();

  return (
    <nav className="flex h-full flex-col overflow-y-auto bg-[var(--color-bg-subtle)] p-4">
      <NavLink
        to="/"
        onClick={onNavigate}
        className="mb-4 block text-base font-semibold text-[var(--color-text)]"
      >
        Claude Code Learning Platform
      </NavLink>

      <div className="flex-1 space-y-5">
        {MODULES.map((mod) => (
          <div key={mod.id}>
            <NavLink
              to={`/module/${mod.id}`}
              onClick={onNavigate}
              className={({ isActive }) =>
                `block text-xs font-semibold uppercase tracking-wide ${
                  isActive ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)]"
                }`
              }
            >
              {mod.title}
            </NavLink>
            <ul className="mt-2 space-y-1">
              {mod.lessons.map((lesson) => {
                const key = lessonKey(mod.id, lesson.id);
                const done = isComplete(key);
                return (
                  <li key={lesson.id}>
                    <NavLink
                      to={`/module/${mod.id}/lesson/${lesson.id}`}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        `flex items-center gap-2 rounded-md px-2 py-1.5 text-sm ${
                          isActive
                            ? "bg-[var(--color-accent-bg)] text-[var(--color-accent)]"
                            : "text-[var(--color-text)] hover:bg-black/5"
                        }`
                      }
                    >
                      {done ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--color-success)]" />
                      ) : (
                        <Circle className="h-4 w-4 shrink-0 text-[var(--color-text-muted)]" />
                      )}
                      <span>{lesson.title}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <NavLink
        to="/glossary"
        onClick={onNavigate}
        className={({ isActive }) =>
          `mt-4 flex items-center gap-2 rounded-md border border-[var(--color-border)] px-3 py-2 text-sm ${
            isActive ? "text-[var(--color-accent)]" : "text-[var(--color-text)]"
          }`
        }
      >
        <BookOpen className="h-4 w-4" />
        Glossary
      </NavLink>
    </nav>
  );
}
