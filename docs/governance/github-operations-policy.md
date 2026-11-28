# MDV2-GOV-01 — Mandatory GitHub persistence for ALL AI changes

**Policy effective by Project Owner instruction:** 28/11/2026.
**Current delivery:** the PO instruction applies immediately to all agents. Files are proposed through Draft PRs; default-branch integration still requires PO approval.
**Applies to:** ChatGPT, Gemini (CLI/web), Claude, Codex, OpenCode, Paperclip and any human/AI agent creating/modifying code, docs, tests, configs, prompt files, migrations, data schemas, task/QA deliverables or release manifests.

## Non-negotiable rule

**Every completed change by an AI to project source code OR project documents MUST be committed and pushed to a GitHub branch in the correct authorized repository.** Saving locally, generating files only inside a chat/container or publishing directly to a Sites/hosting project is NOT a handoff and cannot be reported as completed.

A successful GitHub push is necessary, but not sufficient, for approval or deployment. Work is only **Done** when the remote branch includes the intended changes and the task's review/QA gates are met. A Draft PR remains unfinished until approved.

## Before modifying files

1. Confirm repository owner/name, visibility (public/private), allowed files, access permissions, source version and current branch/HEAD. Read AGENTS.md, this policy, the [Agent Relay protocol](../ai/multi-agent-protocol.md) and all relevant approved specs and decisions.
2. If working on an older branch, fetch current remote changes and assess impact; preserve valid changes. Do not force push, silently reset, rewrite shared history or override another agent's worktree.
3. Choose a distinct named branch from the correct verified base; use independent worktrees for parallel agents. Assign explicit file ownership to avoid overlapping edits.
4. Link an Issue/task, source requirement IDs and exact approved SDD version. If a required decision is pending, mark that item Blocked and work on independent approved tasks. Never treat a suggestion as a production requirement.

## Mandatory Git workflow

1. Make scoped changes, run meaningful build/tests and inspect diff; remove sensitive data and unrelated files.
2. Commit ALL intentionally changed code/doc/test/config files plus their updated manifests, decisions and tests. A single logical change may be committed as a batch; committing every keystroke is not required.
3. Push the branch to the authorized GitHub remote before claiming completion.
4. Read back remote branch/commit SHA and compare expected changed files; create or update a PR to the correct integration base. Document test results and limits in the PR.
5. Publish a [Relay checkpoint](../ai/relay/TASK-CONTRACT.md) with the verified remote tip and evidence, and link it from the Issue/PR. Continue iterations as additional commits on an auditable branch.
6. No merging into prototype or gh-pages, public release, changing custom domain/audience, deploying production or replacing confidential artifacts without separate project authorization. Draft PR review is not a release gate.

## AI/agent failure behavior

- If GitHub is unavailable, credentials are missing, permissions rejected, remote URL cannot be confirmed, or upload is unsafe, set **BLOCKED_GITHUB_PUSH** or **BLOCKED_PRIVACY**, with details. Do not report Done, do not invent PR or commit links, and do not claim the site was updated.
- Preserve work in a recoverable, encrypted/authorized workspace only while blocked; retry via permitted mechanism. Never bypass protections, copy secrets into issues or send private attachments to a public fork.
- AI-generated design reports, checklists and documents supplied only in a chat are **not canonical**. The approved GitHub copy and its commit are.
- No work claimed as completed by one agent can lack a verifiable remote SHA. Reviewers must verify reported SHA exists on the expected branch; the report may contain in-progress items explicitly marked Not pushed.

## Public/private safety

WebMinhDuc is currently **PUBLIC**. Never commit private customer source documents, internal budgets/quotes, CVs, phone numbers, emails of candidates, access tokens, passwords, .env files, proprietary assets without publication rights or unredacted QA recordings. Use a separately approved PRIVATE GitHub repository with least-privilege access for such files. If no private destination is available, mark migration BLOCKED_PRIVACY; do not silently omit it from the inventory.

Pull-request diffs, code comments, commit messages, screenshots, fixtures and CI logs must be checked for secrets/PII as well. Private GitHub is necessary but does not eliminate access control and data-retention duties.

## Deploy and version accountability

Every source modification published to a preview/Sites/GitHub Pages must also be in the correct GitHub branch. Record GitHub commit SHA + deployment/site project ID + deploy revision + URL + audience + date. A hosted Site may have its own source version history; map it explicitly to the GitHub source, not by assumption.
For approved releases, add a reviewed release tag/release manifest and preserve the historical commit. Never use gh-pages static output as the only surviving source of edits.

## Acceptance checklist for any AI task

- [ ] Exact approved requirement/spec and excluded scope verified
- [ ] GitHub repository, base/branch, access and file ownership verified
- [ ] No unrelated or confidential changes in diff
- [ ] Tests run and any Not Run/Blocked cases disclosed
- [ ] All modified project code/docs/tests/configs committed
- [ ] Branch PUSHED to GitHub; remote SHA verified
- [ ] PR created/updated, QA evidence and decisions linked
- [ ] Preview URL and deployment/source mapping verified if applicable
- [ ] Merge/publish gates observed; handoff honest about status

**Scope precedence:** User/PO's later explicit direction can authorize a change, but must be recorded as a new GitHub decision before it becomes reusable project-wide policy.
