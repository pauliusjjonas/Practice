import type { ModuleMeta } from "../../types/content";
import SlashCommands from "../lessons/extending/SlashCommands";
import SubagentsAndTheAgentTool from "../lessons/extending/SubagentsAndTheAgentTool";
import HooksInDepth from "../lessons/extending/HooksInDepth";

export const extendingModule: ModuleMeta = {
  id: "extending",
  title: "Extending Claude Code: Commands, Subagents & Hooks",
  description: "Shortcuts you define, helpers Claude delegates to, and automatic reactions to events.",
  lessons: [
    {
      id: "slash-commands",
      title: "Custom slash commands",
      estimatedMinutes: 8,
      component: SlashCommands,
    },
    {
      id: "subagents-and-the-agent-tool",
      title: "Subagents & the Agent tool",
      estimatedMinutes: 8,
      component: SubagentsAndTheAgentTool,
    },
    {
      id: "hooks-in-depth",
      title: "Hooks: intercepting the loop",
      estimatedMinutes: 10,
      component: HooksInDepth,
    },
  ],
};
