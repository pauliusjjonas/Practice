import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface ProgressState {
  completedLessons: string[];
  lastVisited: string | null;
}

interface ProgressContextValue {
  completedLessons: string[];
  lastVisited: string | null;
  isComplete: (lessonKey: string) => boolean;
  markComplete: (lessonKey: string) => void;
  markIncomplete: (lessonKey: string) => void;
  setLastVisited: (lessonKey: string) => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

const INITIAL_STATE: ProgressState = { completedLessons: [], lastVisited: null };

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useLocalStorage<ProgressState>("claude-course:progress:v1", INITIAL_STATE);

  // Every setter below is wrapped in useCallback with only `setState` (stable) as a
  // dependency, and each bails out to the *same* previous object when nothing actually
  // changed. That keeps function identity and state identity stable across re-renders,
  // which matters here because LessonPage calls setLastVisited from inside a useEffect —
  // an unstable reference there would re-fire the effect every render and loop forever.
  const markComplete = useCallback(
    (lessonKey: string) =>
      setState((prev) =>
        prev.completedLessons.includes(lessonKey)
          ? prev
          : { ...prev, completedLessons: [...prev.completedLessons, lessonKey] },
      ),
    [setState],
  );

  const markIncomplete = useCallback(
    (lessonKey: string) =>
      setState((prev) =>
        prev.completedLessons.includes(lessonKey)
          ? { ...prev, completedLessons: prev.completedLessons.filter((id) => id !== lessonKey) }
          : prev,
      ),
    [setState],
  );

  const setLastVisited = useCallback(
    (lessonKey: string) =>
      setState((prev) => (prev.lastVisited === lessonKey ? prev : { ...prev, lastVisited: lessonKey })),
    [setState],
  );

  const isComplete = useCallback(
    (lessonKey: string) => state.completedLessons.includes(lessonKey),
    [state.completedLessons],
  );

  const value = useMemo<ProgressContextValue>(
    () => ({
      completedLessons: state.completedLessons,
      lastVisited: state.lastVisited,
      isComplete,
      markComplete,
      markIncomplete,
      setLastVisited,
    }),
    [state, isComplete, markComplete, markIncomplete, setLastVisited],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used within a ProgressProvider");
  return ctx;
}
