# GITHUB-AUDIT — WebMinhDuc V2

Survey: **28/11/2026, Asia/Bangkok**. Pre-change inventory captured before branch/config writes; subsequent implementation is explicitly separated. [Machine-readable inventory](docs/operations/evidence/2026-11-28/inventory.json). Findings are a dated snapshot, not permanent claims.

## Identity, access and settings

Repository [Kenbinhoainam/WebMinhDuc](https://github.com/Kenbinhoainam/WebMinhDuc), ID `1457592681`, owner user `Kenbinhoainam`, visibility **public**, default **prototype**, not archived. Authenticated account is the owner; repository API reports admin/maintain/push/triage/pull true. Integration capabilities are narrower: detailed protection returned 403. No conclusion about admin API availability follows from the user's admin flag alone.

Merge commit/rebase/squash enabled; auto-merge disabled; update-branch option false. No setting was changed. Pages is branch-based (`legacy`), source `prototype:/`, no CNAME, HTTPS enforced; [deployment audit](DEPLOYMENT-AUDIT.md) contains direct evidence.

## Complete visible refs and history

| Branch before task | Head SHA | Reachable commits | Protected flag |
|---|---|---:|---|
| `docs/master-sprint1-sdd-20261127` | `66191211358f3c3a645637b0c54a930e65f0662a` | 30 | false |
| `docs/mdv2-github-control-20261128` | `3ab94d637db78f9f8d5849a48739c5fde42db10f` | 37 | false |
| `docs/sprint1-closure-20261127` | `175c2ccda5e352b95373c58d34118fead8892e55` | 1 | false |
| `feat/s2-ui-upgrade-sel-20261127-v1` | `1300df840190ac0ecffa32e576f0c809887e9c64` | 55 | false |
| `gh-pages` | `cbce772deaa9f73988d76ce7c1c0a89bc7b5c77b` | 1 | false |
| `prototype` | `19ac2b365f2264399fde4312639127b8de80736f` | 37 | false |
| `qa/s2-approved-artifact-20261127` | `3c8ed55e9725cbd5b72c72193ab078b2af6eafb5` | 79 | false |
| `qa/s2-hero-unchanged-20261127` | `6309344d7f2e2e7987bfa347d29bb6327c73b9e6` | 65 | false |
| `qa/s2-w2-browser-scope-20261127` | `c36e38d572f1affde354d2d2d0e90752c38bef1b` | 57 | false |
| `sprint-2/approved-ui-upgrade-sel-20261127-v1` | `5744b6da70af721bf08d915107960ab61dfb0080` | 37 | false |
| `sprint-2/customer-demo-acceptance-20261127` | `c8be7c846f91db278190fc8f8ca0fff6a95da0ec` | 37 | false |

11 branch records; each commit listing exhausted in one page of <100; **102 unique reachable commits** across them. Git trees returned `truncated:false`. No tags from `git/matching-refs/tags/`; no GitHub Releases. This is all reachable history from visible refs, not inaccessible/dangling server objects. No branch/tag/history was removed or rewritten.

## PRs, Issues, milestones and Projects

| PR | State | Head / base |
|---|---|---|
| [#4](https://github.com/Kenbinhoainam/WebMinhDuc/pull/4) docs(governance): MDV2 GitHub source of truth and mandatory AI push policy | open, Draft, unmerged | `3ab94d6` → `prototype` |
| [#3](https://github.com/Kenbinhoainam/WebMinhDuc/pull/3) Sprint 2 · Approved UI upgrade · SEL-2026.11.27-v1.0.0 | open, Draft, unmerged | `1300df8` → `sprint-2/approved-ui-upgrade-sel-20261127-v1` |
| [#2](https://github.com/Kenbinhoainam/WebMinhDuc/pull/2) docs(sprint2): S1 closure handoff and v30 demo acceptance proposal | open, Draft, unmerged | `c8be7c8` → `prototype` |
| [#1](https://github.com/Kenbinhoainam/WebMinhDuc/pull/1) docs: MASTER consolidation of Sprint 1 and SDD review (approval pending) | open, Draft, unmerged | `6619121` → `prototype` |

PR #4's 25 changed files, full file content and conversation (empty comments) were read. Its original base was `08e2da4`; current prototype is one publish commit ahead. Its public MDV2 files are carried forward at their existing paths on the new work branch without copying old HTML/assets or merging/closing #4. PR #3 stays intact; no Sprint 2 restart.

Pre-task Issues: [#5](https://github.com/Kenbinhoainam/WebMinhDuc/issues/5) governance review, [#6](https://github.com/Kenbinhoainam/WebMinhDuc/issues/6) protection/private migration, [#7](https://github.com/Kenbinhoainam/WebMinhDuc/issues/7) Sprint 2 gaps; all open, no assigned milestone/labels in the snapshot. [#8](https://github.com/Kenbinhoainam/WebMinhDuc/issues/8) now tracks this audit and implementation. Milestone enumeration via runner returned empty. No artificial milestones were created.

Project `master`: **BLOCKED_PERMISSION** for authoritative owner-level enumeration/setup. Connector has no Project administration operation; GITHUB_TOKEN sees an empty Projects list, which cannot prove absence of a private account Project. No duplicate Project/view was created. [Exact setup specification](docs/governance/project-control-center.md).

## Workflows, runners, secrets and environments

Before this task, prototype and Sprint 2 source/feature trees had no `.github/workflows/`. Three QA branches contain `s2-artifact-qa.yml`, `hero-regression.yml`, `w2-browser.yml`. Actions API returned **28 runs**, all enumerated in the inventory. Latest Pages run [46103834830](https://github.com/Kenbinhoainam/WebMinhDuc/actions/runs/46103834830) succeeded from `19ac2b3`; QA [46013579489](https://github.com/Kenbinhoainam/WebMinhDuc/actions/runs/46013579489) succeeded on its QA branch. Historical successes are not new acceptance of current source.

Observed Pages jobs used GitHub-hosted Ubuntu runners. Runner registry, secrets metadata, Actions permissions and branch-protection endpoints returned **HTTP 403** with available integration/token. Their contents are unknown, not empty. No secret value was requested. `github-pages` environment exists with custom branch policy; observed response had no reviewer rule. [Final sanitized platform metadata](docs/operations/evidence/2026-11-28/platform-summary.json) records readable settings and denied endpoints.

New work adds read-only source/HTTP/metadata CI and a separate narrowly scoped additive label setup workflow on this task's trusted branch. PR code receives no write token, production secrets or self-hosted runner. See [CI status](docs/operations/ci-and-qa.md).

## Protection and ownership

Pre-task branch flags all false; rulesets list empty. Detailed endpoint 403 prevents claiming complete admin verification. CODEOWNERS existed only in PR #4, naming the real owner. The current proposal carries it forward; **CODEOWNERS alone does not enforce review**. No protection/ruleset/required check/tag rule has been enabled. [Admin rollout and solo-reviewer constraint](docs/governance/protection-plan.md).

## Source, dependencies and documentation

React/TypeScript/Vite; Node 24.15.0 selected against lockfile engines. Build is TypeScript → Vite client/SSR → prerender. Source tests largely use Node/JSDOM, not real browser layout. Existing `pages:prepare` rebuilds and rewrites tracked root output; do not use it for governance QA.

**Critical:** prototype source/scripts/tests equal Sprint 1 v30 while its root static output is Sprint 2. [Version map](VERSION-INVENTORY.md) separates source and deployed artifact. Source build success is not deployed Sprint 2 verification.

`docs/flagship` and prototype `docs/sprint-1` remain in place. SDD/QA evidence on unmerged branches is linked by immutable SHA. PR #4 adds the candidate master/register/SDD/acceptance/traceability/AI rules; requirements remain v0.1 DRAFT. See [path mapping](docs/governance/path-migration-map.md); no bulk migration or duplicate artifact archive.

## Coverage and remaining gates

**IMPLEMENTED_AND_VERIFIED:** remote reads/inventory, safe branch/API commits, initial hosted CI, live HTTP and branch-source evidence. **PROPOSED:** master views/automation, protection, future release/CD. **BLOCKED_PERMISSION:** admin/Projects scope as above. **BLOCKED_PRIVACY:** restricted source migration until private repo approval. **REQUIRES_PO_APPROVAL:** merge, production deploy/Pages migration, private repo name/access, approved requirement baseline. **NOT_TESTED:** real hardware, full manual accessibility/UAT and production backend/security.
