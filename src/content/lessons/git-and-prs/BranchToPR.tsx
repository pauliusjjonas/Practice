import { Callout } from "../../../components/lesson/Callout";
import { Exercise } from "../../../components/lesson/Exercise";
import { CodeBlock } from "../../../components/lesson/CodeBlock";

export default function BranchToPR() {
  return (
    <>
      <p>
        A <strong>branch</strong> is a separate, parallel copy of a project
        where you can try changes without touching the version everyone else
        sees — like editing a duplicate of a shared document instead of the
        original, so a half-finished idea can't accidentally break anything.
      </p>
      <p>
        When changes on a branch are ready to be reviewed and merged back
        into the main version, they're bundled up into what's called a{" "}
        <strong>pull request</strong>, or <strong>PR</strong> — a page (on a
        site like GitHub) that shows exactly what changed and lets someone
        approve it before it becomes permanent.
      </p>
      <CodeBlock
        lang="text"
        code={`1. Create a branch          — a safe copy to work in
2. Make & commit changes    — your checkpoints, saved on that branch
3. Push the branch          — upload it so others (or GitHub) can see it
4. Open a pull request      — ask for the branch to be merged into main`}
      />
      <Callout variant="tip">
        Claude Code can draft the pull request description for you, by
        reading the actual commits and file changes on the branch — so the
        description reflects what genuinely changed, not a guess.
      </Callout>
      <Callout variant="warning">
        Pushing code and opening a pull request are both visible to other
        people (or make your changes public). Claude Code will always ask
        you before doing either — it won't push or open a PR silently.
      </Callout>
      <p>
        This is a normal part of working with any shared codebase — even
        with just yourself, using branches and PRs keeps a clean history of
        what changed and why, one bundle at a time, instead of one giant
        pile of edits.
      </p>
      <Exercise
        successLooksLike={
          <>
            You end up with a new branch containing your commit, and (if you
            have a GitHub remote set up) a draft pull request description
            that accurately summarizes the change — but nothing gets pushed
            or opened without you saying yes first.
          </>
        }
      >
        <ol>
          <li>
            In your <code>practice-project</code> session, ask Claude to
            create a new branch for a small change (e.g. "create a branch
            called <code>tidy-nav</code> and clean up the header markup on
            it").
          </li>
          <li>
            Once it's committed the change, ask: "if I wanted to open a pull
            request for this, what would the description say?" — and see the
            draft it writes, without actually publishing anything yet.
          </li>
        </ol>
      </Exercise>
    </>
  );
}
