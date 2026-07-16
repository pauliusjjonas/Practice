import { Callout } from "../../../components/lesson/Callout";
import { Exercise } from "../../../components/lesson/Exercise";

export default function CodeReviewLoop() {
  return (
    <>
      <p>
        Before a pull request gets merged, it's normal for someone (or
        something) to read through the change looking for problems — a
        second pair of eyes, the way you'd proofread an email before sending
        it to your whole team. Claude Code can be that second pair of eyes
        on its own or someone else's changes.
      </p>
      <p>
        Ask it to review a diff (the set of changed lines) and it looks for
        things like: actual bugs, code that's more complicated than it needs
        to be, or places doing the same thing twice that could be simplified
        into one. It reports back a list of specific findings rather than a
        vague "looks good" or "looks bad."
      </p>
      <Callout variant="tip">
        Not every finding needs fixing immediately. Treat the list the way
        you'd treat proofreading comments — triage them: some are worth
        fixing now, some are fine to leave, and it's your call either way.
      </Callout>
      <p>
        The loop, in practice, looks like this: you make a change → Claude
        (or a teammate) reviews it and lists findings → you decide which to
        act on → you fix those → optionally review again. It's a loop
        because review often turns up something worth a quick follow-up fix,
        not because anything is expected to be perfect on the first pass.
      </p>
      <Callout variant="info">
        A deeper, multi-agent version of this review process exists for
        bigger changes — several specialized reviewers look at a change from
        different angles at once. That's a heavier tool for a bigger
        change; for everyday work, a normal review request is enough.
      </Callout>
      <Exercise
        successLooksLike={
          <>
            Claude lists specific, concrete findings (naming exact lines or
            behaviors) rather than a generic "this looks fine" — even if the
            list ends up being short.
          </>
        }
      >
        <ol>
          <li>
            Make a small, deliberately imperfect change to{" "}
            <code>practice-project</code> yourself, or ask Claude to make
            one change without reviewing it.
          </li>
          <li>
            Then ask, in a fresh message: "review this change for bugs or
            things that could be simplified."
          </li>
          <li>
            Pick one finding from the list (if there is one) and ask Claude
            to fix just that one.
          </li>
        </ol>
      </Exercise>
    </>
  );
}
