import { Callout } from "../../../components/lesson/Callout";
import { Exercise } from "../../../components/lesson/Exercise";
import { CodeBlock } from "../../../components/lesson/CodeBlock";

export default function SubagentsAndTheAgentTool() {
  return (
    <>
      <p>
        Picture a manager who does every task themselves instead of ever
        delegating — they'd drown in detail and lose track of the bigger
        picture. Claude Code avoids that trap with <strong>subagents</strong>:
        separate, temporary "helpers" it can send off to research or do a
        chunk of work, then report back with just the useful result.
      </p>
      <p>
        The point isn't just splitting work up — it's keeping the main
        conversation uncluttered. A subagent might read through fifty files
        to find one answer; only that answer comes back to the main
        conversation, not all fifty files.
      </p>
      <Callout variant="tip">
        This plan you approved earlier — the one describing this whole
        learning app — was written by a specialist "Plan" subagent that
        Claude Code sent off with the full brief, then reported back a
        finished plan.
      </Callout>
      <p>A few common types of subagent, and what each is good for:</p>
      <CodeBlock
        lang="text"
        code={`Explore          — fast read-only search: "where is X defined in this codebase?"
Plan             — designs an implementation approach before code is written
general-purpose  — handles a broad, multi-step task on its own`}
      />
      <p>
        You don't usually have to name which one to use — Claude decides
        when a task is big enough to be worth delegating versus just doing
        inline. You'll sometimes see this called "the Agent tool" or "the
        Task tool" in Claude Code's own output; both names refer to the same
        idea of spinning up a subagent.
      </p>
      <Callout variant="info">
        Subagents start with a blank slate — they don't automatically know
        what you and Claude have already discussed. Whoever spins one up has
        to hand it enough context to work with, the same way you'd fully
        brief a new contractor rather than assuming they can read your mind.
      </Callout>
      <Exercise
        successLooksLike={
          <>
            Claude's reply mentions that it delegated part of the work — for
            example "I had a subagent search for X" — and the main
            conversation stays short even though a lot of files were
            searched.
          </>
        }
      >
        <ol>
          <li>
            In a Claude Code session on a larger project you have access to
            (or this learning app's own project folder), ask: "search the
            whole codebase and tell me every place localStorage is used."
          </li>
          <li>
            Notice whether Claude mentions using a subagent/Explore agent to
            do the search, rather than reading every file itself inline.
          </li>
        </ol>
      </Exercise>
    </>
  );
}
