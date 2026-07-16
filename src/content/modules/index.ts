import type { FlatLesson, ModuleMeta } from "../../types/content";
import { foundationsModule } from "./foundations";
import { extendingModule } from "./extending";
import { gitAndPrsModule } from "./git-and-prs";
import { websiteDesignModule } from "./website-design";

export const MODULES: ModuleMeta[] = [
  foundationsModule,
  extendingModule,
  gitAndPrsModule,
  websiteDesignModule,
];

export const FLAT_LESSONS: FlatLesson[] = MODULES.flatMap((mod) =>
  mod.lessons.map((lesson, index) => ({
    moduleId: mod.id,
    moduleTitle: mod.title,
    lesson,
    index,
  })),
);

export function lessonKey(moduleId: string, lessonId: string) {
  return `${moduleId}/${lessonId}`;
}

export function getModule(moduleId: string): ModuleMeta | undefined {
  return MODULES.find((mod) => mod.id === moduleId);
}

export function getLesson(moduleId: string, lessonId: string) {
  const mod = getModule(moduleId);
  return mod?.lessons.find((l) => l.id === lessonId);
}

export function getFlatIndex(moduleId: string, lessonId: string): number {
  return FLAT_LESSONS.findIndex((f) => f.moduleId === moduleId && f.lesson.id === lessonId);
}

export function totalLessonCount(): number {
  return FLAT_LESSONS.length;
}
