import type { ModuleMeta } from "../../types/content";
import WhyClaudeMdMatters from "../lessons/foundations/WhyClaudeMdMatters";
import MemorySystemDeepDive from "../lessons/foundations/MemorySystemDeepDive";
import PlanModeWalkthrough from "../lessons/foundations/PlanModeWalkthrough";

export const foundationsModule: ModuleMeta = {
  id: "foundations",
  title: "Foundations of the Claude Code Workflow",
  description: "The note you leave Claude, how it remembers your preferences, and how it plans before it builds.",
  lessons: [
    {
      id: "why-claude-md-matters",
      title: "Why Claude Code needs context: the CLAUDE.md file",
      estimatedMinutes: 10,
      component: WhyClaudeMdMatters,
    },
    {
      id: "memory-system-deep-dive",
      title: "The memory system in depth",
      estimatedMinutes: 10,
      component: MemorySystemDeepDive,
    },
    {
      id: "plan-mode-walkthrough",
      title: "Plan mode: designing before doing",
      estimatedMinutes: 8,
      component: PlanModeWalkthrough,
    },
  ],
};
