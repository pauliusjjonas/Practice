import { Callout } from "../../../components/lesson/Callout";
import { Exercise } from "../../../components/lesson/Exercise";
import { Playground } from "../../../components/playground/Playground";

export default function ArtifactDesignSkill() {
  return (
    <>
      <p>
        Two designs can use the exact same words and still feel completely
        different — one cramped and hard to scan, the other calm and
        obvious to read. Most of that difference comes down to a small
        handful of everyday visual habits, not artistic talent:
      </p>
      <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed">
        <li>
          <strong>Spacing</strong> — room to breathe between elements, so
          related things feel grouped and unrelated things feel separate.
        </li>
        <li>
          <strong>Hierarchy</strong> — the most important thing on the page
          should look the most important (bigger, bolder, or higher up), not
          fight for attention with everything else.
        </li>
        <li>
          <strong>Contrast</strong> — text and buttons need to visibly stand
          out from their background, or people simply can't read them.
        </li>
      </ul>
      <p>
        Try it yourself below. This card is technically complete — it has a
        heading, a sentence, and a button — but it's cramped and everything
        is nearly the same size. Edit the CSS pane (try increasing{" "}
        <code>padding</code> on <code>.card</code>, and bumping{" "}
        <code>h2</code>'s <code>font-size</code> well above the paragraph
        text) and watch the preview update.
      </p>
      <Playground preset="spacing-hierarchy" />
      <p>
        Now a contrast problem. This banner and button are readable in
        theory, but the button text is nearly invisible against its own
        background. Try changing <code>.cta</code>'s <code>color</code> and{" "}
        <code>background</code> to two colors that clearly stand apart (for
        example, a dark background with white text).
      </p>
      <Playground preset="color-contrast" />
      <Callout variant="tip">
        When you ask Claude Code to build or improve a UI, it draws on
        exactly these kinds of heuristics — this is what's meant by the{" "}
        <code>artifact-design</code> skill: a checklist of spacing, type
        scale, color, and layout rules Claude applies automatically so a
        result doesn't come out looking like the "before" version above.
      </Callout>
      <Callout variant="info">
        You don't need to memorize the checklist yourself. The value of
        knowing it exists is being able to ask for it by name — e.g. "clean
        this up using proper spacing and hierarchy" — when a result still
        looks a bit rough.
      </Callout>
      <Exercise
        successLooksLike={
          <>
            Claude's redesign clearly has more breathing room, a heading
            that's obviously bigger/bolder than the body text, and buttons
            you could read from across the room — and it can name which
            specific changes it made and why.
          </>
        }
      >
        <ol>
          <li>
            Open a Claude Code session anywhere you like (or reuse{" "}
            <code>practice-project</code>).
          </li>
          <li>
            Ask: "build me a simple pricing card as an artifact, then
            deliberately make it look cramped with poor contrast."
          </li>
          <li>
            Then ask: "now redesign that using better spacing, hierarchy,
            and contrast — tell me specifically what you changed and why."
          </li>
        </ol>
      </Exercise>
    </>
  );
}
