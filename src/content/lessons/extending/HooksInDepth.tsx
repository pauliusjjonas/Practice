import { CodeBlock } from "../../../components/lesson/CodeBlock";
import { Callout } from "../../../components/lesson/Callout";
import { Exercise } from "../../../components/lesson/Exercise";
import { AnnotatedLine, AnnotatedLines } from "../../../components/lesson/AnnotatedLine";

const HOOK_CONFIG = `{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "npx prettier --write \\"$CLAUDE_FILE_PATH\\"" }
        ]
      }
    ]
  }
}`;

export default function HooksInDepth() {
  return (
    <>
      <p>
        A hook is like a doorbell camera that automatically records the
        moment someone steps onto your porch — it doesn't wait to be asked,
        it triggers on an event. Claude Code <strong>hooks</strong> work the
        same way: you configure a plain shell command to run automatically
        whenever a certain kind of event happens during a session, without
        you or Claude having to remember to run it.
      </p>
      <p>
        The two most common triggers are named for when they fire, relative
        to Claude taking an action:
      </p>
      <CodeBlock
        lang="text"
        code={`PreToolUse   — fires right before Claude runs a tool (e.g. before it edits a file)
PostToolUse  — fires right after Claude runs a tool (e.g. after it edits a file)`}
      />
      <p>
        Hooks are configured in a settings file, not written in the chat.
        Here's a real one that automatically re-formats any file right after
        Claude edits or writes it:
      </p>
      <CodeBlock lang="json" code={HOOK_CONFIG} filename=".claude/settings.json" />
      <AnnotatedLines>
        <AnnotatedLine code='"PostToolUse"'>
          This whole block only runs <em>after</em> the triggering action
          has already happened — in this case, after a file has been edited.
        </AnnotatedLine>
        <AnnotatedLine code='"matcher": "Edit|Write"'>
          Only fire for these two specific tools — editing an existing file,
          or writing a new one. Other tools (like running a search) won't
          trigger this hook.
        </AnnotatedLine>
        <AnnotatedLine code='"command": "npx prettier ..."'>
          The actual shell command that runs. This one calls a code
          formatter (Prettier) on the file that was just changed.
        </AnnotatedLine>
        <AnnotatedLine code="$CLAUDE_FILE_PATH">
          A placeholder Claude Code fills in automatically with the path of
          the file that triggered the hook.
        </AnnotatedLine>
      </AnnotatedLines>
      <Callout variant="warning">
        Because a hook is a real shell command running on your machine, be
        as careful with it as you would with any script you'd run yourself —
        don't paste in a hook command from somewhere you don't trust without
        reading exactly what it does first.
      </Callout>
      <Exercise
        successLooksLike={
          <>
            After Claude edits any file in <code>practice-project</code>,
            you see it automatically re-run the formatter afterward, without
            you asking it to.
          </>
        }
      >
        <ol>
          <li>
            In your <code>practice-project</code> Claude Code session, ask
            Claude to add the hook config above to{" "}
            <code>.claude/settings.json</code> (it's fine if Prettier isn't
            installed yet — Claude can help you add it, or you can swap in
            any command you like, even just <code>echo "file changed"</code>{" "}
            to see the hook fire).
          </li>
          <li>
            Ask Claude to make a small edit to <code>styles.css</code>, and
            watch for the hook's command running right after.
          </li>
        </ol>
      </Exercise>
    </>
  );
}
