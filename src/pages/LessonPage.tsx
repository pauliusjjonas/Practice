import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { FLAT_LESSONS, getFlatIndex, getModule, lessonKey } from "../content/modules";
import { useProgress } from "../context/ProgressContext";
import { LessonLayout } from "../components/lesson/LessonLayout";
import { NotFoundPage } from "./NotFoundPage";

export function LessonPage() {
  const { moduleId = "", lessonId = "" } = useParams();
  const { isComplete, markComplete, markIncomplete, setLastVisited } = useProgress();

  const mod = getModule(moduleId);
  const lesson = mod?.lessons.find((l) => l.id === lessonId);
  const flatIndex = getFlatIndex(moduleId, lessonId);

  useEffect(() => {
    if (mod && lesson) setLastVisited(lessonKey(moduleId, lessonId));
  }, [mod, lesson, moduleId, lessonId, setLastVisited]);

  if (!mod || !lesson || flatIndex === -1) return <NotFoundPage />;

  const key = lessonKey(moduleId, lessonId);
  const prevFlat = flatIndex > 0 ? FLAT_LESSONS[flatIndex - 1] : null;
  const nextFlat = flatIndex < FLAT_LESSONS.length - 1 ? FLAT_LESSONS[flatIndex + 1] : null;
  const Component = lesson.component;

  return (
    <LessonLayout
      moduleTitle={mod.title}
      title={lesson.title}
      estimatedMinutes={lesson.estimatedMinutes}
      isComplete={isComplete(key)}
      onToggleComplete={() => (isComplete(key) ? markIncomplete(key) : markComplete(key))}
      prev={
        prevFlat && { moduleId: prevFlat.moduleId, lessonId: prevFlat.lesson.id, title: prevFlat.lesson.title }
      }
      next={
        nextFlat && { moduleId: nextFlat.moduleId, lessonId: nextFlat.lesson.id, title: nextFlat.lesson.title }
      }
    >
      <Component />
    </LessonLayout>
  );
}
