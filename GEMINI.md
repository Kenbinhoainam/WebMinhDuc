
## PO directive — enforced work contract

**EVERY INTENTIONAL CODE OR DOCUMENT CHANGE MUST BE COMMITTED AND PUSHED TO AN AUTHORIZED GITHUB REPOSITORY.**

Applies equally to Codex, Gemini, Claude, OpenCode and every other agent, including migrations, QA reports, release manifests, ADRs and instructions. Fetch and verify HEAD → read Issue/spec → isolated branch/worktree → scoped change → diff/privacy/tests → commit → push → read back remote SHA → create/update PR → update Issue with evidence. Logical commits are sufficient; keystroke commits are not required. GitHub API commits/ref updates are acceptable when a shell is unavailable, provided parent SHA, remote ref and complete diff are verified.

If pushing is impossible: **BLOCKED_GITHUB_PUSH**. If content lacks an approved private destination: **BLOCKED_PRIVACY**. Never put restricted data into public Issues, logs or diffs. A pushed Draft PR is reviewable work, not PO acceptance or permission to merge/deploy.

Current deployment hazard: read [DEPLOYMENT-AUDIT.md](DEPLOYMENT-AUDIT.md) before any build publication. Never run `pages:prepare` then push to prototype as a routine documentation step. Current branch combines old source and newer compiled output.

---

# Gemini CLI — MinhDucWeb V2 project instructions

**Primary repo:** https://github.com/Kenbinhoainam/WebMinhDuc
**Scope:** All file operations performed by Gemini CLI on this project; same rules apply to any other AI provider.
**Language of working reports:** Vietnamese unless requested otherwise.

## Mandatory first read
1. AGENTS.md (new current policy section, followed by historical technical decisions).
2. docs/README.md and docs/governance/github-operations-policy.md.
3. docs/governance/source-of-truth.md and docs/versions/code-location-register.md.
4. docs/requirements/master-requirements.md plus docs/requirements/requirements-register.md.
5. docs/decisions/decision-log.md, docs/acceptance/acceptance-baseline.md, the exact approved SDD for the task and existing PR/Issue context.

## Critical workflow

- **EVERY edit to code, documentation, tests, configs, scripts, prompts or other project artifacts MUST be committed and PUSHED to GitHub on a reviewable branch**. A local edit or an answer in chat does not fulfill project handoff. Use a PR; report remote SHA, file list, QA evidence and limitations.
- If push is unavailable, stop claiming success and report BLOCKED_GITHUB_PUSH. If public repository cannot safely hold the file, report BLOCKED_PRIVACY and use only an approved private GitHub repo.
- Verify actual repo/branch/HEAD and worktree cleanliness before editing. Use separate branch/worktree per independent worker. Do not touch another agent's assigned files without integrator coordination.
- Never merge to prototype/gh-pages, force push, expose customer/candidate data or deploy the canonical site without Project Owner approval.
- Do not assume you can access the user's Google Drive, ChatGPT Spaces, or Sites; use source copies/links only if connected and authorized, disclose unread references.
- Do not use HR-WEB-01 v1.2 as the new Master Requirements. MDV2-REQ-01 is the new candidate; customer-confirmed Sprint 1 source and explicit PO decisions have authority by documented scope.
- Sprint 1 Discovery internally closed, Sprint 2 UI implementation in Draft PR #3. UI preview ≠ production. Only selected/eligible SDD changes may be coded.
- For each task provide exact requirement/SDD/AC IDs and record tests as Pass/Fail/Blocked/Not Run with build SHA and viewport/device when relevant.
- On completion update versions/sprint/traceability docs in the same remote PR when affected.

## Working model

Agent may use any supported model/provider; GitHub is the independent, provider-agnostic source of truth. Issue → spec/decision → branch → tests → commit → **push** → PR → PO review → approved release. All in-scope AI outputs that change repo files must be pushed; do not keep a parallel authoritative Gemini-only project file.

**Failure protocol:** Be explicit about permission/network/review blockers. Never fabricate commit, PR, deployed preview or test success.
