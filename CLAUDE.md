
## PO directive — enforced work contract

**EVERY INTENTIONAL CODE OR DOCUMENT CHANGE MUST BE COMMITTED AND PUSHED TO AN AUTHORIZED GITHUB REPOSITORY.**

Applies equally to Codex, Gemini, Claude, OpenCode and every other agent, including migrations, QA reports, release manifests, ADRs and instructions. Fetch and verify HEAD → read Issue/spec → isolated branch/worktree → scoped change → diff/privacy/tests → commit → push → read back remote SHA → create/update PR → update Issue with evidence. Logical commits are sufficient; keystroke commits are not required. GitHub API commits/ref updates are acceptable when a shell is unavailable, provided parent SHA, remote ref and complete diff are verified.

If pushing is impossible: **BLOCKED_GITHUB_PUSH**. If content lacks an approved private destination: **BLOCKED_PRIVACY**. Never put restricted data into public Issues, logs or diffs. A pushed Draft PR is reviewable work, not PO acceptance or permission to merge/deploy.

Current deployment hazard: read [DEPLOYMENT-AUDIT.md](DEPLOYMENT-AUDIT.md) before any build publication. Never run `pages:prepare` then push to prototype as a routine documentation step. Current branch combines old source and newer compiled output.

---

# Claude Code — MinhDucWeb V2

Read AGENTS.md and GEMINI.md for the shared cross-provider project instructions. Then read docs/README.md, docs/governance/github-operations-policy.md, docs/governance/source-of-truth.md, docs/requirements/master-requirements.md and the approved spec for the current Issue.

**Mandatory:** every change to code OR documents by any AI must be committed, pushed to the authorized GitHub branch and included in a reviewable PR. Verifiably report remote branch/SHA. If push fails report BLOCKED_GITHUB_PUSH; if content is private do not put it in the public WebMinhDuc repo and report BLOCKED_PRIVACY or use the approved private repo.

No direct merge/deploy, no bypassing SDD/PO approval, no unauthorized edits to other agents' files. The project uses a new MDV2 requirements framework; HR-WEB-01 is a historical contractor draft, not the master requirements. Sprint 2 UI remains unmerged under Draft PR #3.
