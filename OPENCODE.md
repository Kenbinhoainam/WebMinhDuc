# OpenCode — MinhDucWeb V2


## PO directive — enforced work contract

**EVERY INTENTIONAL CODE OR DOCUMENT CHANGE MUST BE COMMITTED AND PUSHED TO AN AUTHORIZED GITHUB REPOSITORY.**

Applies equally to Codex, Gemini, Claude, OpenCode and every other agent, including migrations, QA reports, release manifests, ADRs and instructions. Fetch and verify HEAD → read Issue/spec → isolated branch/worktree → scoped change → diff/privacy/tests → commit → push → read back remote SHA → create/update PR → update Issue with evidence. Logical commits are sufficient; keystroke commits are not required. GitHub API commits/ref updates are acceptable when a shell is unavailable, provided parent SHA, remote ref and complete diff are verified.

If pushing is impossible: **BLOCKED_GITHUB_PUSH**. If content lacks an approved private destination: **BLOCKED_PRIVACY**. Never put restricted data into public Issues, logs or diffs. A pushed Draft PR is reviewable work, not PO acceptance or permission to merge/deploy.

Current deployment hazard: read [DEPLOYMENT-AUDIT.md](DEPLOYMENT-AUDIT.md) before any build publication. Never run `pages:prepare` then push to prototype as a routine documentation step. Current branch combines old source and newer compiled output.

Read [AGENTS.md](AGENTS.md), [the docs hub](docs/README.md), [AI protocol](docs/ai/multi-agent-protocol.md), and the exact Issue/approved SDD before changing files. Share no file ownership with another worker without the integrator's assignment.
