# MDV2-DEC-01 — Decision and Change Register

**Initial revision:** 28/11/2026. This is a register, not permission to execute all proposals. Each approval must have approver, date, branch/commit, scope and evidence.

## Recorded directives

| Decision ID | Decision | Status | Evidence/limits |
|---|---|---|---|
| GOV-20261128-01 | GitHub is project system of record; every AI modification of code/doc must be committed and pushed to GitHub | **PO instruction — approved 28/11** | Applies prospectively to all AI providers; branch + remote SHA + PR required |
| GOV-20261128-02 | New MDV2 Master Requirements should NOT use HR-WEB-01 as canonical | **PO instruction — approved** | HR-WEB-01 remains historical/vendor input |
| GOV-20261128-03 | Build MDV2 document architecture and traceability in GitHub | **Work authorized; content baseline under review** | This document branch is Draft; not production spec approval |
| S1-20261127-01 | Sprint 1 Discovery internally closed | **Confirmed closure** | Orphan closure branch; not website acceptance |
| S2-20261127-UI | Eligible UI improvements per SEL-2026.11.27-v1.0.0 + MDU-SDD-v1.0.0 | **Approved prototype scope only** | Conditional features and new business logic remain gated; PR #3 Draft |

## Open decisions — carry forward (do not auto-approve)

| Decision ID | Topic | Existing evidence and proposal | Status |
|---|---|---|---|
| MDV2-DEC-001 | B2B/B2C priority | Sprint 1 BIZ-01 says B2B main, B2C support; draft vendor doc is neutral. Preserve business need, approve visual prominence separately | Pending PO |
| MDV2-DEC-002 | CMS architecture | Sprint 1 requested custom-written CMS; alternatives mentioned later need ADR/PO, no silent replacement | Pending PO |
| MDV2-DEC-003 | Final URL/sitemap/enrollment | Seven menu groups agreed; URL versus shared anchor and enrollment dual entry need approved table | Pending PO |
| MDV2-DEC-004 | F03 field semantics | Job code required in record, auto-populated from job; verify UX/API and no manual mandatory field | Pending detailed spec |
| MDV2-DEC-005 | CMS-01…15/advanced modules and price | Decompose into features and commercial rows before production; no blanket inclusion | Pending scope/contract |
| MDV2-DEC-006 | ADMIN account count, workflow and duplicate merge | Customer confirmed one role, separate account count and transition/merge rules open | Pending PO/customer |
| MDV2-DEC-007 | Sheets operation | Six tabs, manual/daily agreed; mapping, key, schedule zone, delete/merge/error behavior pending | Pending integration spec |
| MDV2-DEC-008 | REF-UI-01 and media rights | Approve reference screenshot/viewport and what is transferable without copying third-party assets | Pending design |
| MDV2-DEC-009 | QA/real devices/PERF-01/WCAG coverage | Four device classes needed; exact cases/benchmarks remain proposed | Pending QA baseline |
| MDV2-DEC-010 | Privacy, retention, hosting, API/CMS split and support | Must be specified before production personal data/contract | Pending PO/architecture |
| MDV2-DEC-011 | Sprint 2 pending codes | PR #3 reports incomplete/blocked items, no automatic merging or product acceptance | Pending follow-up QA |
| MDV2-DEC-012 | Selected prototype E and optional motion | 146 Pxx-E selected but general E deferred; conditional Undo/Sort/Fade/Spring | Retain explicit gate |
| MDV2-DEC-013 | Legacy HR-WEB-01 and acceptance migration | Preserve as historical reference; public sanitized master only, private full originals require private repo | Pending private repo decision |
| MDV2-DEC-014 | Release tags and branch protection | No Git tags/releases at inventory; propose future tags and required PR/check/review rules | Pending GitHub admin config |

## How to decide

For each open item add in a new reviewed commit/PR: proposed options, evidence/source, impact to cost/scope/schedule, accepted option, approver/date, effective spec revision, dependent AC/Issue/PR, changed artifacts. Never overwrite previous historical decision text to hide an approved change; append superseding decision with cross-link.

**Sprint 1 legacy O01–O10:** See docs/sprint-1/open-questions-and-decisions.md on branch docs/sprint1-closure-20261127. The new MDV2-DEC references groups from those items; it does not assert they have been closed.
