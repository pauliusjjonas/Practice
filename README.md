# Claude Code Learning Platform

A hands-on, interactive course for learning what Claude Code can do — with a deep dive on
using it to design and build websites. No prior Claude Code experience assumed.

## Running it

```
npm install
npm run dev
```

Then open the local URL it prints (usually `http://localhost:5173`).

## What's here

- **Foundations** — CLAUDE.md, the memory system, plan mode
- **Extending Claude Code** — custom slash commands, subagents, hooks
- **Git, PRs, and Shipping Changes** — safe git workflows, branch → PR, code review
- **Designing and Building Frontends** — the Artifact tool, design heuristics, data
  visualization, and the visual iteration loop (includes live in-browser playgrounds)

Each lesson ends with a guided, hands-on exercise you do in a **separate** Claude Code
session against the small sample site in [`practice-project/`](./practice-project). Your
progress through the lessons is saved locally in your browser as you go.

## Project structure

- `src/content/modules/` — the lesson registry (titles, ordering, estimated time)
- `src/content/lessons/` — the actual lesson content, one component per lesson
- `src/components/playground/` — the live HTML/CSS/JS playground used in the design module
- `practice-project/` — the companion sample site used for hands-on exercises
