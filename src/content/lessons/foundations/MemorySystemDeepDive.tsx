import { CodeBlock } from "../../../components/lesson/CodeBlock";
import { Callout } from "../../../components/lesson/Callout";
import { Exercise } from "../../../components/lesson/Exercise";

export default function MemorySystemDeepDive() {
  return (
    <>
      <p>
        In the last lesson you wrote one <code>CLAUDE.md</code> for one
        project. But think about how you actually work: some habits are
        yours no matter which project you're in ("always ask before deleting
        anything"), and some are specific to one codebase ("this project uses
        four-space indentation"). Claude Code's memory system has a layer for
        each.
      </p>
      <p>There are three places Claude looks for notes, checked in this order:</p>
      <CodeBlock
        lang="text"
        code={`1. ~/.claude/CLAUDE.md        — your personal preferences, every project
2. ./CLAUDE.md                — this specific project, shared with teammates
3. ./CLAUDE.local.md           — this project, just for you (not shared/committed)`}
      />
      <p>
        Think of it like settings in a phone: there's a system-wide setting
        (level 1), an app-specific setting (level 2), and sometimes a
        "just for this one login" override (level 3). All three get combined
        — Claude reads all of them, it doesn't pick just one.
      </p>
      <Callout variant="info">
        The word "memory" here doesn't mean Claude remembers your past
        conversations. Each of these is just a text file that gets re-read
        fresh at the start of every session. Nothing is retained between
        sessions unless it's written down in one of these files.
      </Callout>
      <p>
        One handy trick: a <code>CLAUDE.md</code> file can pull in other files
        using an <code>@</code> import, instead of cramming everything into
        one giant document:
      </p>
      <CodeBlock
        lang="markdown"
        code={`# Project: practice-project

See @docs/style-guide.md for our CSS conventions.
See @docs/deployment.md for how releases work.`}
        filename="CLAUDE.md"
      />
      <p>
        This keeps the main file short and skimmable, while still giving
        Claude the full picture — it follows the <code>@</code> reference and
        reads the linked file too. This is worth doing once a project's{" "}
        <code>CLAUDE.md</code> starts feeling long enough that you'd
        struggle to skim it yourself.
      </p>
      <Exercise
        successLooksLike={
          <>
            Claude's answer mentions the specific preference from your{" "}
            <code>~/.claude/CLAUDE.md</code>, even though you're asking about
            a completely unrelated project.
          </>
        }
      >
        <ol>
          <li>
            In any Claude Code session, ask: "what's in my user-level
            CLAUDE.md?" — this shows you whether you already have one.
          </li>
          <li>
            If you don't have one yet, tell Claude: "Create a{" "}
            <code>~/.claude/CLAUDE.md</code> with one preference: always
            explain your reasoning in plain language before making a change."
          </li>
          <li>
            Open a Claude Code session in a completely different, unrelated
            folder and ask it to make some small change.
          </li>
        </ol>
      </Exercise>
    </>
  );
}
