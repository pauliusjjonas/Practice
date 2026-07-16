import type { ModuleMeta } from "../../types/content";
import SafeGitWorkflows from "../lessons/git-and-prs/SafeGitWorkflows";
import BranchToPR from "../lessons/git-and-prs/BranchToPR";
import CodeReviewLoop from "../lessons/git-and-prs/CodeReviewLoop";

export const gitAndPrsModule: ModuleMeta = {
  id: "git-and-prs",
  title: "Git, PRs, and Shipping Changes with Claude Code",
  description: "How Claude Code handles version control safely, from a single commit to a reviewed pull request.",
  lessons: [
    {
      id: "safe-git-workflows",
      title: "Safe git workflows with an agent",
      estimatedMinutes: 9,
      component: SafeGitWorkflows,
    },
    {
      id: "branch-to-pr",
      title: "From branch to pull request",
      estimatedMinutes: 9,
      component: BranchToPR,
    },
    {
      id: "code-review-loop",
      title: "The code-review loop",
      estimatedMinutes: 8,
      component: CodeReviewLoop,
    },
  ],
};
