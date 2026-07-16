import { Callout } from "../../../components/lesson/Callout";
import { Exercise } from "../../../components/lesson/Exercise";
import { CodeBlock } from "../../../components/lesson/CodeBlock";

export default function PlanModeWalkthrough() {
  return (
    <>
      <p>
        A contractor doesn't start knocking down walls the moment you mention
        a renovation — they walk the house, sketch a plan, and show it to
        you before anyone picks up a hammer. <strong>Plan mode</strong> is
        that walkthrough step for Claude Code.
      </p>
      <p>
        When plan mode is switched on, Claude is only allowed to look around
        (read files, search the project, ask you questions) — it cannot edit
        anything or run commands that change your project. It uses that
        research to write up a plan, shows it to you, and only starts making
        real changes once you approve it.
      </p>
      <Callout variant="tip">
        This course's app you're using right now was itself built starting
        from a plan written in plan mode — the same process this lesson is
        describing. Nothing was built until the plan for it was approved.
      </Callout>
      <p>A typical plan-mode session goes through four stages:</p>
      <CodeBlock
        lang="text"
        code={`1. Explore   — Claude reads your code / project, asks clarifying questions
2. Design    — Claude works out an approach (sometimes with a specialist "planning" pass)
3. Review    — Claude double-checks the plan matches what you actually asked for
4. Approval  — You read the plan and either approve it or send Claude back to revise it`}
      />
      <p>
        The output of this process is a plan — a written document, similar
        in spirit to a project brief, that names the specific files that will
        change and how. You're free to ask for changes to the plan itself
        before anything is built, the same way you'd redline a contractor's
        quote.
      </p>
      <Callout variant="info">
        Plan mode is most useful for anything with more than one reasonable
        way to build it — a new feature, a redesign, anything touching
        several files. For a one-line typo fix, it's overkill; Claude will
        usually just make trivial fixes directly.
      </Callout>
      <Exercise
        successLooksLike={
          <>
            Claude responds with a written plan (not code changes) that
            names specific files it intends to touch, and waits for your
            approval before doing anything.
          </>
        }
      >
        <ol>
          <li>
            Open a Claude Code session in your <code>practice-project</code>{" "}
            folder.
          </li>
          <li>
            Turn on plan mode (look for a plan-mode toggle or ask "can you
            use plan mode for this?"), then ask: "I want to add a dark mode
            toggle to this site — plan it out first."
          </li>
          <li>
            Read the plan it produces. Try asking it to change one detail
            before you approve it, just to see that step in action.
          </li>
        </ol>
      </Exercise>
    </>
  );
}
