import type { GlossaryTerm } from "../types/content";

export const GLOSSARY: GlossaryTerm[] = [
  {
    term: "CLAUDE.md",
    definition:
      "A plain text file in a project that Claude Code reads automatically at the start of every session — conventions, commands, and things to avoid, written once instead of repeated in every chat.",
  },
  {
    term: "Plan mode",
    definition:
      "A mode where Claude can only look around (read files, ask questions) and must write up a plan for your approval before it's allowed to make any real changes.",
  },
  {
    term: "Slash command",
    definition:
      'A typed shortcut, like /help, that runs a saved instruction. You can write your own by adding a markdown file to .claude/commands/.',
  },
  {
    term: "Subagent (Agent / Task tool)",
    definition:
      "A separate, temporary helper Claude can send off to research or do a chunk of work, reporting back just the useful result instead of cluttering the main conversation.",
  },
  {
    term: "Hook",
    definition:
      "A shell command configured to run automatically when a specific event happens during a session — for example, re-formatting a file right after Claude edits it.",
  },
  {
    term: "Repository (repo)",
    definition:
      "A project folder tracked by git, where every saved checkpoint of its history is recorded and can be looked back on or undone.",
  },
  {
    term: "Commit",
    definition:
      "One saved checkpoint of a project's changes, along with a short message explaining what changed and why.",
  },
  {
    term: "Branch",
    definition:
      "A separate, parallel copy of a project where changes can be made safely without affecting the version everyone else sees.",
  },
  {
    term: "Diff",
    definition:
      "A view showing exactly which lines were added or removed by a change, before it's committed.",
  },
  {
    term: "Pull request (PR)",
    definition:
      "A request to merge a branch's changes into the main version of a project, shown as a page that summarizes what changed so it can be reviewed first.",
  },
  {
    term: "Artifact",
    definition:
      "A web page, diagram, or interactive tool that Claude can render directly in the conversation, instead of showing you code you'd have to run yourself to see.",
  },
  {
    term: "Sandbox",
    definition:
      "A restricted environment where code can run without being able to reach outside of it — for example, the live playground in this course can run JavaScript but can't access your browser's other tabs or storage.",
  },
  {
    term: "Console",
    definition:
      "A hidden panel in every web browser that logs errors and warnings about the current page — useful for spotting a broken script even when the page still looks fine.",
  },
];
