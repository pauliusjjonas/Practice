import { CodeBlock } from "../../../components/lesson/CodeBlock";
import { Callout } from "../../../components/lesson/Callout";
import { Exercise } from "../../../components/lesson/Exercise";
import { AnnotatedLine, AnnotatedLines } from "../../../components/lesson/AnnotatedLine";

const COMMAND_FILE = `---
description: Explain what a file does
---
Read $ARGUMENTS and explain, in plain language, what it does and why it exists in this project.
`;

export default function SlashCommands() {
  return (
    <>
      <p>
        You've probably noticed you can type things like{" "}
        <code>/help</code> in Claude Code. Those are <strong>slash
        commands</strong> — short, typed shortcuts for a request you make
        often. The built-in ones (<code>/help</code>, <code>/clear</code>,
        and others) ship with Claude Code, but you can also write your own,
        specific to your project.
      </p>
      <p>
        Think of it like a saved search or a text-message shortcut: instead
        of re-typing "please explain what this file does and why it's here"
        every time, you save that instruction once and just type{" "}
        <code>/explain-file</code>.
      </p>
      <p>
        A custom slash command is nothing exotic — it's just a small markdown
        file that lives in a specific folder:
      </p>
      <CodeBlock
        lang="markdown"
        code={COMMAND_FILE}
        filename=".claude/commands/explain-file.md"
      />
      <AnnotatedLines>
        <AnnotatedLine code="---  ...  ---">
          This fenced block at the top is called <em>frontmatter</em> — a
          small block of settings about the command itself. Here it just
          sets the one-line description you'd see if you asked Claude to
          list your commands.
        </AnnotatedLine>
        <AnnotatedLine code="$ARGUMENTS">
          Whatever you type after the command name gets substituted in here.
          Typing <code>/explain-file script.js</code> would run this command
          with <code>$ARGUMENTS</code> replaced by <code>script.js</code>.
        </AnnotatedLine>
      </AnnotatedLines>
      <p>
        The filename becomes the command name — a file named{" "}
        <code>explain-file.md</code> in <code>.claude/commands/</code> gives
        you a command called <code>/explain-file</code>, in any Claude Code
        session started in that project.
      </p>
      <Callout variant="tip">
        A good rule of thumb for whether something deserves its own slash
        command: if you've typed almost the same request three times, it's
        worth turning into one.
      </Callout>
      <Exercise
        successLooksLike={
          <>
            Typing <code>/explain-file styles.css</code> in your{" "}
            <code>practice-project</code> session gets Claude to read and
            explain that specific file, without you writing out the full
            request.
          </>
        }
      >
        <ol>
          <li>
            In a Claude Code session inside <code>practice-project</code>,
            ask Claude to create the file above at{" "}
            <code>.claude/commands/explain-file.md</code>.
          </li>
          <li>
            Start a new message and type <code>/explain-file script.js</code>{" "}
            (or any other file in the project).
          </li>
        </ol>
      </Exercise>
    </>
  );
}
