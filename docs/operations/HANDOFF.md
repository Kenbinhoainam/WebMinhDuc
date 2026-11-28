# GitHub professionalization handoff — 28/11/2026

Requirement **MDV2-GOV-001**, tracking [Issue #8](https://github.com/Kenbinhoainam/WebMinhDuc/issues/8). Work branch `chore/8-github-control-center`, base `19ac2b365f2264399fde4312639127b8de80736f`. Pushed bootstrap `e14adcbfc5887e85be753ef5f18ee8323120e386`; final remote SHA/PR and validation will be appended after final verification. This document is not a Done or production-acceptance declaration.

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
| IMPLEMENTED_AND_VERIFIED | Read-only GitHub inventory; Pages configuration and live initial HTTP fingerprint; bootstrap remote commit and 4/4 CI jobs; finalized branch outputs only when verified below |
| PROPOSED | Six master views/fields/automation, protection/tag/release/CD design; future source/artifact reconciliation |
| BLOCKED_PERMISSION | Owner-authoritative Projects setup, runner/secrets/admin/protection metadata with current token; no required check/ruleset enabled |
| BLOCKED_PRIVACY | Restricted originals awaiting PO-approved private repository/audience |
| REQUIRES_PO_APPROVAL | Merge/integration sequence, production deploy or Pages migration, private repo, approved requirements/architecture, reviewer/release owners |
| NOT_TESTED | Physical devices, full manual accessibility/UAT, Sites-v10 HTTP byte comparison, production backend/security and actual rollback |

## Operations

[Onboard in five steps](../00-start-here/README.md). Use existing Issues #5–#7 for baseline/admin/Sprint 2 work; #8 tracks this proposal. Project master discovery/setup must use a token or UI with actual account Project access. Do not create a duplicate from an empty GITHUB_TOKEN view. Do not close Issues based solely on this handoff.

[PO decisions](../../RISKS-AND-DEPENDENCIES.md), [protection rollout](../governance/protection-plan.md), [Pages migration/rollback](pages-migration-plan.md). Current branch-root Pages may redeploy even on a documentation merge; review that impact before merging.
