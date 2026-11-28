# MDV2-REQ-REG — Requirements Register

**Version:** v0.1.0-DRAFT, 28/11/2026. Source: customer-confirmed Sprint 1 Requirements Register v0.2 + separate UI SDD handoff. Requirement ID is stable; scope/status and code/test evidence remain distinct.

Status legend:
- **Confirmed need** = customer confirmed business need in Sprint 1; not necessarily a built/paid feature.
- **Proposed** = needs additional approval/verification.
- **Approved prototype** = approved only for synthetic prototype, not production.
- **Pending spec/contract** = technical/commercial approval required.

| ID | Need / rule | Source | Business status | Spec/commercial status | Acceptance linkage |
|---|---|---|---|---|---|
| MDV2-BIZ-001 | B2B primary business positioning, B2C support; both paths visible | SRC-S1-REQ BIZ-01 | Confirmed need | Visual weighting Pending | D-02, AC-03 |
| MDV2-NAV-001 | Seven menu groups, at most two levels | SRC-S1-REQ NAV-01 | Confirmed need | URL mapping Pending | AC-01, AC-03 |
| MDV2-NAV-002 | Five service groups | SRC-S1-REQ SVC-01 | Confirmed need | Detail contents Pending | AC-01 |
| MDV2-JOB-001 | Combined worker job filters and detail | SRC-S1-REQ JOB-01/02 | Confirmed need | Production data Pending | D-03, AC-05 |
| MDV2-JOB-002 | Closed/expired job blocks apply | SRC-S1-REQ JOB-02 | Confirmed need | Server rule Pending | AC-06 |
| MDV2-FRM-001 | F01: 4 required fields and 6 optional | SRC-S1-REQ F01 | Confirmed need | Input rules Pending | D-05, AC-07 |
| MDV2-FRM-002 | F02: name/phone required; email/message optional | SRC-S1-REQ F02 | Confirmed need | Validation Pending | AC-07 |
| MDV2-FRM-003 | F03: name/phone/job ID required in submission; ID from job | SRC-S1-REQ F03 | Confirmed need | Source binding Pending | D-04, AC-06/07 |
| MDV2-FRM-004 | F04: name/phone/position required, email/CV optional | SRC-S1-REQ F04 | Confirmed need | Secure storage Pending | AC-07/15 |
| MDV2-FRM-005 | F05: name/phone required, program optional incl. Other | SRC-S1-REQ F05 | Confirmed need | Content mapping Pending | AC-07 |
| MDV2-FRM-006 | F06: name/phone required, email/program/files optional | SRC-S1-REQ F06 | Confirmed need | Secure storage Pending | AC-07/15 |
| MDV2-FRM-007 | F04/F06 files: approved types, ≤3, 5 MB each, 15 MB total | SRC-S1-REQ F07 | Confirmed need | Byte/security Pending | AC-15/16 |
| MDV2-LNG-001 | 5 locales, VI original; UI/major fixed pages/form labels | SRC-S1-REQ L1/L2 | Confirmed need | Initial content Pending | AC-04 |
| MDV2-LNG-002 | Translation approval and honest VI fallback | SRC-S1-REQ L2/L3/L4 | Confirmed need | Reviewer assignment Pending | AC-04 |
| MDV2-ADM-001 | One ADMIN role type with potentially many accounts | SRC-S1-REQ H4 | Confirmed need | Number/auth Pending | AC-10/16 |
| MDV2-ADM-002 | ADMIN receives 6 queues, manual owner assignment and history | SRC-S1-REQ H1/H2/H3 | Confirmed need | State transition Pending | AC-09/11 |
| MDV2-DUP-001 | F03 duplicate phone + job, manual merge before export | SRC-S1-REQ T1/T2 | Confirmed need | Merge behavior Pending | AC-12/13 |
| MDV2-EXP-001 | Manual + daily export, one tab per form, preflight duplicate/connection | SRC-S1-REQ T3/T4 | Confirmed need | Destination and idempotence Pending | AC-14 |
| MDV2-EXP-002 | Blocked schedule notifies ADMIN; ADMIN retries manually | SRC-S1-REQ T2/T3/H5 | Confirmed need | Error contract Pending | AC-14 |
| MDV2-CMS-001 | Content/CMS managed by custom-written solution | SRC-S1-REQ CMS-01 | Confirmed need | Architecture choice Pending | AC-10 |
| MDV2-CMS-002 | Advanced builder, analytics, A/B, external APIs individually scoped | SRC-VENDOR-12 references | Proposed | Commercial decision Pending | AC-25/26 |
| MDV2-SEO-001 | SEO/AEO and truthful per-locale metadata | SRC-S1-REQ + SRC-VENDOR-12 | Confirmed direction | Measurable AC Pending | AC-17/18 |
| MDV2-DES-001 | Four device groups, responsive and keyboard/touch | SRC-S1-REQ + SRC-AC-12 | Confirmed direction | Exact device matrix Pending | D-01/07, AC-02 |
| MDV2-DES-002 | Visual reference REF-UI-01 subject to design approval | SRC-VENDOR-12 | Proposed | Screenshot/style baseline Pending | D-02, AC-02/03 |
| MDV2-SEC-001 | Protect real ADMIN/CV/PII and define retention/backup | SRC-S1-REQ + SRC-VENDOR-12 | Confirmed direction | Policy/architecture Pending | AC-16/21 |
| MDV2-AI-001 | AI modules are separate optional scope | SRC-VENDOR-12 + Project direction | Confirmed boundary | No AI feature auto-included | AC-27 |
| MDV2-DEMO-001 | Synthetic M01–M07, D-01…D-09 | PO demo scope 22/11 | Approved prototype | Production not approved | D-01…09 |
| MDV2-DEMO-002 | SEL-2026.11.27-v1.0.0 eligible UI improvements | PO approved UI SDD | Approved prototype | Conditional codes remain gated | Per-code QA-MI/MO/MS/P/CS |
| MDV2-GOV-001 | Every AI code/document edit must be committed and pushed to GitHub | PO 28/11 | Approved governance policy | Public/private repo gate | MDV2-GOV-01 |

**Important:** Do not mark an entire MDV2 requirement implemented based on a single prototype screenshot or a partially completed SDD code. Full per-code selections, accepted/blocked numbers and QA are on the feature branch PR #3. Any exact original customer field/statement not reproduced here remains a source-based record pending a sanitized/full private migration.

## Follow-up requirements

Convert each high-level line into detailed atomic requirements, CRUD/form/edge-case rules, service/API/data models, tests and commercial inclusion **after** the Project Owner has approved the MDV2 structure and corresponding decisions. Never silently override customer-confirmed answers in favor of HR-WEB-01.