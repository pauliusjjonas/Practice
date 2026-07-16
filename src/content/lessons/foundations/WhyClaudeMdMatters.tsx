import { CodeBlock } from "../../../components/lesson/CodeBlock";
import { Callout } from "../../../components/lesson/Callout";
import { Exercise } from "../../../components/lesson/Exercise";
import { AnnotatedLine, AnnotatedLines } from "../../../components/lesson/AnnotatedLine";

const EXAMPLE = `# Project: practice-project

## What this is
A small static website (plain HTML/CSS/JS, no build step).

## Commands
- Run it: just open index.html in a browser
- No install, no build, no tests yet

## Conventions
- Vanilla HTML/CSS/JS only — do not add a framework or bundler
- Keep script.js free of global variables

## Do not
- Do not add a package.json unless asked
`;

export default function WhyClaudeMdMatters() {
  return (
    <>
      <p>
        Imagine you hire a very capable contractor to help around your house.
        They're skilled, but they've never been in your house before — they
        don't know which cupboard the mugs go in, that the back door sticks,
        or that you'd rather they didn't touch the thermostat. You'd probably
        leave them a note.
      </p>
      <p>
        <code>CLAUDE.md</code> is that note, for Claude Code. It's a plain
        text file that sits in your project folder. Claude reads it
        automatically at the start of every session in that folder — you
        never have to paste it in or remind Claude it exists.
      </p>
      <Callout variant="tip">
        You don't write this file once and forget it. Treat it like a living
        note — update it whenever you notice yourself explaining the same
        thing to Claude twice.
      </Callout>
      <p>Here's a real example, written for a small practice website:</p>
      <CodeBlock lang="markdown" code={EXAMPLE} filename="CLAUDE.md" />
      <p>Walking through what each part is doing:</p>
      <AnnotatedLines>
        <AnnotatedLine code="# Project: practice-project">
          A heading, just like in any document. This one's purely for a
          human reading the file — Claude doesn't need the heading to work,
          but it helps <em>you</em> find your way around later.
        </AnnotatedLine>
        <AnnotatedLine code="## Commands">
          Tells Claude how to actually run or test the project, so it doesn't
          have to guess or ask you every time.
        </AnnotatedLine>
        <AnnotatedLine code="## Conventions">
          Rules about <em>how</em> to write code here — e.g. "don't add a
          framework" stops Claude from reaching for React when you just
          wanted a plain HTML tweak.
        </AnnotatedLine>
        <AnnotatedLine code="## Do not">
          An explicit boundary. Claude Code respects these — it's one of the
          most effective ways to stop unwanted changes before they happen.
        </AnnotatedLine>
      </AnnotatedLines>
      <p>
        One more thing worth knowing: this file can live at a few different
        levels. A project-level <code>CLAUDE.md</code> (the one above)
        applies only to that one project. There's also a user-level file at{" "}
        <code>~/.claude/CLAUDE.md</code> for preferences you want applied
        everywhere you use Claude Code — for example, "always explain your
        reasoning before making a change."
      </p>
      <Exercise
        successLooksLike={
          <>
            Claude answers using details that only appear in your{" "}
            <code>CLAUDE.md</code> — for example, it should mention "no
            framework" or "no build step" without you having said that in the
            chat.
          </>
        }
      >
        <ol>
          <li>
            Open a <strong>separate</strong> Claude Code session (a new
            terminal window or new chat) with your <code>practice-project</code>{" "}
            folder open as the working directory.
          </li>
          <li>
            Ask Claude to look around the folder and describe what it finds,
            or just tell it directly: "Write a CLAUDE.md for this project,
            similar to the example in this lesson, based on what you see
            here."
          </li>
          <li>
            Once it's written, start asking questions like "what are the
            conventions for this project?" or "how do I run this?" in that
            same session.
          </li>
        </ol>
      </Exercise>
    </>
  );
}
