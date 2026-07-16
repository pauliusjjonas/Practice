import type { ComponentType } from "react";

export interface LessonMeta {
  id: string;
  title: string;
  estimatedMinutes: number;
  component: ComponentType;
}

export interface ModuleMeta {
  id: string;
  title: string;
  description: string;
  lessons: LessonMeta[];
}

export interface FlatLesson {
  moduleId: string;
  moduleTitle: string;
  lesson: LessonMeta;
  index: number;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
}
