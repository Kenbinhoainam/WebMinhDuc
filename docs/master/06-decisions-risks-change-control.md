# Decision Register / Change Control

**Status:** Snapshot from PO instructions and draft sources through 27/11/2026. This is not the private commercial register.

## Governance decisions

| ID | Decision | State and boundary |
| --- | --- | --- |
| GOV-01 | MASTER is single point for project oversight; Codex Cloud preferred executor | Approved governance, not proof of Codex dispatch |
| GOV-02 | Sprint 1 retained Blocked pending actual handoff; Sprint 2 planning may proceed | Approved 22/11; closure still unverified |
| GOV-03 | Demo M01–M07 and criteria D-01–D-09, fixture-only | Approved **demo scope only**, not production |
| GOV-04 | Spec before implementation, distinct branch/workspace, review QA/handoff | Approved governance |
| GOV-05 | Non-AI work enters **Main Requirements catalog**, AI enters optional extensions | Approved classification, not inclusion in core price |
| GOV-06 | Five new SDD improvements prioritized after Gemini/Codex reconciliation | **Proposed**, individual PO decision outstanding |
| GOV-07 | No automatic merge, production deploy, destructive operation or disclosure | Active constraint |

## Earlier-vs-later decisions — do not overwrite history

| Topic | Earlier repo/doc context | Later confirmed business direction | Pending impact |
| --- | --- | --- | --- |
| F04 CV | Prototype 3 doc: required | F04 CV **optional** | Form AC, data rules |
| F06 file | Historical prototype 3 required | F06 file **optional** | Form AC, validation |
| Roles | Earlier quotation/development examples used admin/editor or UI role demo | **One login role type ADMIN**, number of accounts to define | Security/RBAC architecture |
| Files | Early scope: one PDF/5MB | 3 private files, 5MB each, 15MB total, more formats | Security/storage/QA |
| Duplicate | Earlier prototype: warn, do not block | ADMIN merges duplicate phone+job; unresolved groups block export | Integrity/transaction/audit |
| Export | Earlier prototype sample CSV, no external request | Daily and manual operational Sheets export, 6 destination tabs | Integration & operations |
| Current repo | Audit 20–22/11 reported empty | By 27/11 repo contains prototype + gh-pages and commit v25 | Closeout evidence review required |
| Design benchmark | HR2B earlier reference; SuccessHRVN surveyed later | Both reference only, not authority to copy source content or claims | Brand and copyright review |

## Proposed change control — requires individual acceptance

| CR | Item | Impact to assess |
| --- | --- | --- |
| CR-01 | Page builder, A/B tests, CMS dashboards, dynamic OG, deep editorial tooling | Complexity, UI/QA, hosting and content duties |
| CR-02 | Scheduled Google Sheets with six tabs, merge gate, retry/upsert; non-AI CRM/ERP extra | Data architecture, API permissions, quota, monitoring |
| CR-03 | Private multi-upload, optional CV, cross-form duplicate policies | Security, retention, data migration and QA |
| CR-04 | Next.js/Spring Boot/custom-vs-Strapi/Payload and possible search/cache | ADR, team skill, service cost, boundaries for private applicant data |
| CR-05 | SEO/GEO/AEO, company claims, case studies, content hubs and ad pixels | Fact/source rights, privacy, content operation |
| CR-06 | Warranty, SLA, source/data/account ownership, deployment and handover | Legal/contract sign-off, ops cost |
| CR-07 | New five UX SDD items | PO review per SDD; only after approval plan implementation |

**No self-authorized budget/scope:** All non-AI features may be categorized Main but are **not automatically included** in the existing commercial base. Avoid copying private price/proposal PDFs to public GitHub.

## Open PO decisions

1. SDD-01: shortened header label, breakpoint behavior, non-obscuring toast; direct F01 link remains until tests.
2. SDD-03: optional group disclosure, helper copy, same-tab draft preservation.
3. SDD-02: factual party signing employment contract, roles and wording; obtain domain-owner confirmation.
4. SDD-04: actual process, owners, inputs/outputs and publishable time commitments.
5. SDD-05: authorized case/media, whether to show qualitative/demo evidence or hide.
6. Production: ADMIN account count, retention, duplicate conflict/merge, Sheets destination access, hosting/CMS/stack and commercial inclusion.

Changes should record source, priority, baseline, effect, approver, approval date, AC, test result and the implementing branch/PR **after** permission is granted.
