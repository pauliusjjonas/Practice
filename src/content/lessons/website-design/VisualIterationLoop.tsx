import { Callout } from "../../../components/lesson/Callout";
import { Exercise } from "../../../components/lesson/Exercise";
import { CodeBlock } from "../../../components/lesson/CodeBlock";

export default function VisualIterationLoop() {
  return (
    <>
      <p>
        Design rarely comes out right on the very first try, for a person or
        for Claude — the difference is how fast you can tell it's wrong and
        try again. Claude Code can actually open a real browser, look at the
        page it just built, and check its own work — the same way you'd
        glance at a page you just edited before calling it done.
      </p>
      <p>The loop looks like this:</p>
      <CodeBlock
        lang="text"
        code={`1. Build      — write or edit the HTML/CSS/JS
2. Look       — open it in a real browser and take a screenshot
3. Check      — read the browser's console for errors, inspect what rendered
4. Fix        — adjust based on what was actually seen, not just assumed
5. Repeat      — until it actually looks and works right`}
      />
      <Callout variant="tip">
        "The console" is a hidden panel in every web browser that quietly
        logs errors and warnings about the current page — like a car's
        check-engine light for a website. Claude Code can read it directly,
        which is often how it catches a broken button or a typo in a color
        name before you ever notice.
      </Callout>
      <Callout variant="info">
        This matters more than it might seem: writing code that <em>looks</em>{" "}
        correct and code that <em>actually works when you click it</em> are
        two different things. Running it for real, in a browser, is the only
        way to tell the difference — it's why "just read the code" isn't
        considered enough to call a UI change finished.
      </Callout>
      <p>
        You'll sometimes see Claude take a screenshot mid-task, or mention
        "checking the console for errors" — that's this loop happening, not
        an extra step you need to ask for separately.
      </p>
      <Exercise
        title="Capstone: redesign the practice site"
        successLooksLike={
          <>
            The homepage clearly applies at least 3 heuristics from this
            module (spacing, hierarchy, contrast, or a deliberate color
            choice), and Claude confirms it actually opened the result in a
            browser to check it — not just edited the files blind.
          </>
        }
      >
        <ol>
          <li>
            Open a Claude Code session in your <code>practice-project</code>{" "}
            folder.
          </li>
          <li>
            Ask: "redesign the homepage in index.html and styles.css, using
            better spacing, hierarchy, and contrast. Open it in a browser
            afterward and confirm it looks right and there are no console
            errors."
          </li>
          <li>
            Compare the before/after yourself, and ask Claude to point out
            which specific heuristic from this module drove each change it
            made.
          </li>
        </ol>
      </Exercise>
    </>
  );
}
