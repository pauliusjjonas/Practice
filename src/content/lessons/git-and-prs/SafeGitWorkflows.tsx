import { Callout } from "../../../components/lesson/Callout";
import { Exercise } from "../../../components/lesson/Exercise";
import { CodeBlock } from "../../../components/lesson/CodeBlock";

export default function SafeGitWorkflows() {
  return (
    <>
      <p>
        Git is the system most developers use to save "checkpoints" of a
        project over time — like a much more powerful version of a
        document's version history. Each checkpoint is called a{" "}
        <strong>commit</strong>, and a project tracked this way is called a{" "}
        <strong>repository</strong> (or "repo" for short).
      </p>
      <p>
        Claude Code can create commits for you, but it treats git the way a
        careful houseguest treats your belongings: it's fine to tidy up, but
        it won't rearrange the furniture or throw anything away without
        asking first. Concretely, that means:
      </p>
      <CodeBlock
        lang="text"
        code={`Will do without asking:      stage specific files, create a new commit
Will always ask you first:   force-push, delete a branch, undo/discard changes
Will never do quietly:       skip safety checks (like --no-verify)`}
      />
      <Callout variant="tip">
        A commit message is meant to explain <em>why</em> a change was made,
        not just restate what changed (the code itself already shows what
        changed). Claude Code is written to follow this convention when it
        writes commit messages for you.
      </Callout>
      <p>
        Two commands worth recognizing when you see them in Claude's output:
      </p>
      <CodeBlock
        lang="bash"
        code={`git status   # shows what's changed since the last commit
git diff     # shows the exact lines that changed, before committing`}
      />
      <p>
        Claude runs these constantly to see the current state before acting
        — it's the equivalent of double-checking your cart before checkout.
      </p>
      <Exercise
        successLooksLike={
          <>
            Claude shows you the change it's about to commit (via{" "}
            <code>git diff</code>) and writes a commit message that explains{" "}
            <em>why</em>, e.g. "simplify the nav markup" rather than just
            "edit index.html."
          </>
        }
      >
        <ol>
          <li>
            Make sure <code>practice-project</code> is a git repository — if
            it isn't yet, ask Claude to run <code>git init</code> in that
            folder.
          </li>
          <li>
            Ask Claude to make one small, real improvement to the project
            (e.g. "fix the messy indentation in styles.css").
          </li>
          <li>
            Then ask it to commit that change, and read the commit message
            it writes.
          </li>
        </ol>
      </Exercise>
    </>
  );
}
