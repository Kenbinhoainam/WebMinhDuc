# GitHub professionalization handoff — 28/11/2026

Requirement **MDV2-GOV-001**, tracking [Issue #8](https://github.com/Kenbinhoainam/WebMinhDuc/issues/8). Work branch `chore/8-github-control-center`, base `19ac2b365f2264399fde4312639127b8de80736f`. Pushed bootstrap `e14adcbfc5887e85be753ef5f18ee8323120e386`; [Draft PR #9](https://github.com/Kenbinhoainam/WebMinhDuc/pull/9) is the reviewable delivery. Final implementation checkpoint `7163e01f3410cdb7896295a2126bb57d998ea365` is pushed and verified; the PR head is the authoritative latest remote delivery SHA. This document is not a Done or production-acceptance declaration.

## Before / after

| Before | Reviewable result |
|---|---|
| Historical README obscures current source vs published artifact | Short entrypoint, Docs Hub, four audits and 5-step onboarding |
| MDV2 only on old-base Draft PR #4 | Public MDV2 candidate files carried forward at same paths from current prototype baseline; requirements stay DRAFT |
| Generic Issue template in PR #4 | Eight typed forms, complete provenance/AC/test/ownership fields, PR template |
| AI push rule not present on default branch | Consistent AGENTS/GEMINI/CLAUDE/OPENCODE contract in proposed branch; PO instruction already applies |
| No CI workflow on prototype | Source, dependency, governance and operational audit checks proposed through branch; actual hosted results linked |
| Deployment source unclear | Pages legacy prototype:/ and exact served HTML proven; source/artifact mismatch documented |
| Project/protection uncertain | Explicit verified-versus-proposed admin runbooks; no false enabled claims |

Preserved: application source, package/lockfile, original tests/scripts, public/static artifacts, 11 existing branches/history, unmerged PR #3/#4, existing Site audience/deployment, prototype default name. No production deployment, merge, historical tag, branch deletion or private-data migration performed.

## Status ledger

| Status | Items |
|---|---|
| IMPLEMENTED_AND_VERIFIED | GitHub inventory, live Pages provenance, 70/70 implementation files read back from remote, 8 forms and 8 verified labels; full source CI plus final artifact browser reruns linked below |
| PROPOSED | Six MinhDucWeb — Master Control views/fields/automation, protection/tag/release/CD design; future source/artifact reconciliation |
| BLOCKED_PERMISSION | Owner-authoritative Projects setup, runner/secrets/admin/protection metadata with current token; no required check/ruleset enabled |
| BLOCKED_PRIVACY | Restricted originals awaiting PO-approved private repository/audience |
| REQUIRES_PO_APPROVAL | Merge/integration sequence, production deploy or Pages migration, private repo, approved requirements/architecture, reviewer/release owners |
| NOT_TESTED | Physical devices, full manual accessibility/UAT, Sites-v10 HTTP byte comparison, production backend/security and actual rollback |

## Operations

[Onboard in five steps](../00-start-here/README.md). Use existing Issues #5–#7 for baseline/admin/Sprint 2 work; #8 tracks this proposal. Project MinhDucWeb — Master Control discovery/setup must use a token or UI with actual account Project access. Do not create a duplicate from an empty GITHUB_TOKEN view. Do not close Issues based solely on this handoff.

[PO decisions](../../RISKS-AND-DEPENDENCIES.md), [protection rollout](../governance/protection-plan.md), [Pages migration/rollback](pages-migration-plan.md). Current branch-root Pages may redeploy even on a documentation merge; review that impact before merging.

## Verified implementation checkpoint

[Run 46108194398](https://github.com/Kenbinhoainam/WebMinhDuc/actions/runs/46108194398) at `901e8e994de26785c1739996fb462c6f5174140e`: **6/6 jobs success**. [Structured results](evidence/2026-11-28/validation.json), [HTTP checks](evidence/2026-11-28/pages-http-verified.json), [sanitized platform metadata](evidence/2026-11-28/platform-verified.json), [browser smoke](evidence/2026-11-28/browser-smoke-initial.json).

[Label setup 46108194418](https://github.com/Kenbinhoainam/WebMinhDuc/actions/runs/46108194418) created requirement/task/design/qa/change-request; verified these plus existing enhancement/bug/documentation, preserving existing labels. Templates/CODEOWNERS/policy are pushed in this Draft PR; default-branch Issue UI and enforced ownership await approved merge/protection.

Independent review confirmed no existing app source/tests/public/static file changed. It requested additional artifact-only path detection and browser reload/network-failure assertions; those are implemented and independently verified at `7163e01f3410cdb7896295a2126bb57d998ea365`. Final [push run 46108858565](https://github.com/Kenbinhoainam/WebMinhDuc/actions/runs/46108858565) passed 4 jobs (2 source/dependency skips); [PR run 46108863352](https://github.com/Kenbinhoainam/WebMinhDuc/actions/runs/46108863352) passed governance/browser (4 intended skips). Both browser runs passed 15/15 locale/viewport cases with interaction before/after refresh. Earlier harness failures at 53d616b are retained in validation.json. No existing application behavior was changed to make tests pass.

PO renamed the desired Project to **MinhDucWeb — Master Control**. Existing master must be reused/renamed when actual account permissions allow; no Project was created or renamed by this task yet.

Cloud repair: duplicate main checkouts replaced with one explicit WebMinhDuc/prototype checkout in task instance revision 5. Backend then reports running/connected, but chat executor still returns capability connection error; shell use remains NOT_TESTED. Reusable saved environment configuration may still need the owner's Promote action; this task-instance fix does not prove reusable config updated.

## Codex → Antigravity delivery

[Self-contained handoff](../handover/CODEX-TO-ANTIGRAVITY.md) includes reading order, full implementation/base SHAs, Issues/PRs, SDD boundaries, tests, Pages provenance, blockers and prioritized next work. [Remote readback](evidence/2026-11-28/remote-readback.json): 70/70 implementation files matched exactly. The final document-only commit receipt and CI run are recorded in PR #9 / Issue #8 after remote readback.
