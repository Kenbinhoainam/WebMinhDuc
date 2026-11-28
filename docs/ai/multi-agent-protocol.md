# MDV2-AI-01 — Multi-provider AI work protocol

**Goal:** ChatGPT, Gemini CLI, Claude, OpenCode and self-hosted orchestration can operate without dependence on one model or ChatGPT/Codex environment. GitHub stores every authorized code/document modification.

## Agent startup (MANDATORY)

1. Check actual remote repository, branch and HEAD. Read AGENTS.md, GEMINI.md, docs/README.md, docs/governance/github-operations-policy.md.
2. Read exact approved requirements/SDD, acceptance IDs and change decision; cross-check the current code and relevant docs. If source is accessible only through another system, retrieve it with authorized integration and redact before any public push.
3. Locate open Issues/PRs; no redoing completed Sprint 1 or replacing PR #3 with an unreviewed alternate site.
4. Create a work branch and isolated worktree for each independent owner. Owners may study in parallel, but share no files without an integrator/cherry-pick plan.
5. Code/docs/test/QA changes MUST be committed and pushed to GitHub. No finished local-only task, no chat-only report, no privately published Sites revision without a mirrored GitHub commit.
6. Return exact SHA, branch, PR, test evidence and blockers. "Done" requires a verifiable remote commit and review gates.

## Role ownership (suggestion, not a preassigned task)

| Role | Focus | File ownership |
|---|---|---|
| Coordinator/MASTER | Issues, approved scope, dependency graph, integration | Governance/issue only; no simultaneous shared edits |
| Requirements analyst | Requirements Register, source/decision trace | docs/requirements and docs/decisions |
| UX/accessibility reviewer | Visual specs, responsive/motion AC | docs/specifications/ui-ux, tests owned explicitly |
| Frontend worker | React/Vite pages and shared UI under assigned packages | Explicit src files only |
| Backend/integration worker | Production APIs **only when approved** | Separate packages/files, no prototype scope expansion |
| QA worker | Tests, evidence, independent review | tests and QA docs, not author of same reviewed code |
| Release/DevOps | CI, preview manifest, PR checks | .github/workflows and deployment records |

Never let multiple workers concurrently edit AGENTS.md, GEMINI.md, shared.tsx, Header.tsx, routing, shared forms or central i18n catalogs without explicit ownership.

## Task / handoff contract

Required inputs: Issue ID, project/repo, base HEAD, source IDs, approved SDD version, exact code/doc scope, exclusions, QA matrix, privacy/release audience. Required outputs: branch, pushed SHA, PR, changed file list, tests and evidence, remaining Incomplete/Blocked/Not Run with owners. The user or authorized PO decides merge/deploy.

When GitHub cannot be reached, report BLOCKED_GITHUB_PUSH, preserve recoverable changes within permitted local workspace, and never falsely mark completion. For confidential documents that cannot be pushed to PUBLIC WebMinhDuc, report BLOCKED_PRIVACY and request the configured PRIVATE repo.

## Specific Minh Đức constraints

Sprint 1 Discovery is closed. Prototype source still React/Vite; do not claim production backend, CMS, upload or security. Sprint 2 UI selection SEL-2026.11.27-v1.0.0 and MDU-SDD-v1.0.0 authorize eligible prototype UI work, not all production business features; code is under Draft PR #3. Preserve five locales, seven menu groups, F01–F06 semantics and mock-data boundaries unless a later approved change overrides them.
