import type { ModuleMeta } from "../../types/content";
import TheArtifactTool from "../lessons/website-design/TheArtifactTool";
import ArtifactDesignSkill from "../lessons/website-design/ArtifactDesignSkill";
import DatavizSkill from "../lessons/website-design/DatavizSkill";
import VisualIterationLoop from "../lessons/website-design/VisualIterationLoop";

export const websiteDesignModule: ModuleMeta = {
  id: "website-design",
  title: "Designing and Building Frontends with Claude Code",
  description: "Rendering real UI, the visual design heuristics Claude applies, and how it checks its own work.",
  lessons: [
    {
      id: "the-artifact-tool",
      title: "The Artifact tool",
      estimatedMinutes: 8,
      component: TheArtifactTool,
    },
    {
      id: "artifact-design-skill",
      title: "Design heuristics: spacing, hierarchy, contrast",
      estimatedMinutes: 14,
      component: ArtifactDesignSkill,
    },
    {
      id: "dataviz-skill",
      title: "Designing charts and data visuals",
      estimatedMinutes: 12,
      component: DatavizSkill,
    },
    {
      id: "visual-iteration-loop",
      title: "The visual iteration loop",
      estimatedMinutes: 10,
      component: VisualIterationLoop,
    },
  ],
};
