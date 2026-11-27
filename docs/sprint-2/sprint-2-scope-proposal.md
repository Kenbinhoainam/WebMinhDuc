# Sprint 2 — Scope Proposal for Project Owner

**Goal:** verify the **existing v30 prototype** against the previously approved mobile demo M01–M07 and D-01…D-09; close documentary gaps before requesting further implementation authorization. This is planning-only and not an approved new coding sprint.

## Existing product vs approved demo

| Approved screen | Existing repository surface to inspect | Required outcome of review |
| --- | --- | --- |
| M01 Home | `/`, video hero, B2B/B2C CTA | Direct CTA routes and focus documented for each journey |
| M02 Jobs | `/jobs` | Search + combined filters match synthetic job option; empty/reset state |
| M03 Job detail | Job detail route | JD, stable code and expired/closed application behavior |
| M04 F03 | Worker application | Required name/phone/job-code validation and DEMO receipt |
| M05 Services/capacity | `/services`, detail, profile | Clear B2B message, five service groups, no unapproved claims |
| M06 F01 | Business demand | Four required fields, error/success, synthetic record ID |
| M07 ADMIN mock | `/admin-demo` | Separate business/worker intakes, mock status/owner, clear no-real-data label |

**M08** optional explanation only. Avoid creating another prototype branch containing a second, duplicate UI.

## Proposed specification-review activities (no implementation yet)

| Review stream | Output | Gate |
| --- | --- | --- |
| SR-01 Current baseline audit | Commit SHA, preview link, responsive inventory, actual vs documented data/storage behavior | Evidence required before any new code |
| SR-02 Demo acceptance mapping | D-01…D-09 matrix with Not Run/Pass/Fail/Blocked and precise reproduction conditions | QA evidence, not declarations |
| SR-03 B2B/B2C flows | Two reproducible scripts, test fixtures, expected vs observed | Browser/mobile checks required |
| SR-04 Requirements reconciliation | Delta between historical v0.2, v1.2 contractor/customer docs and actual v30, preserving 5 languages/six forms | Distinguish confirmed/business vs draft commercial |
| SR-05 Open decisions | O01–O10 ownership and blockers; no new discovery questions where source already answered | PO accepts deferrals or decisions |
| SR-06 SDD change review | Five ranked SDD specs, currently PENDING PO, with viewport/state/evidence | No apply without individual approval |
| SR-07 Architecture/production boundary | Separate prototype mock from production backend/admin/security/SaaS integrations | ADR and commercial approval gate |

### Two demo scenarios to review

**B2C:** Home → search and filter jobs → view eligible detail → F03 validation and mock submit → generated DEMO reference → ADMIN mock shows correct category/job/owner. Test closed job and zero results. Synthetic phone/name only.

**B2B:** Home → services/profile → choose staffing → F01 incomplete/valid state → generated DEMO reference → ADMIN mock shows demand category/status/owner. F01 required: contact, phone, location and note; other planning fields optional. No real submission/email/Sheets/DB.

### QA scope (conditional on review execution)

Mobile/tablet/desktop/wide, especially 320×740, 390×844, 430×932, 768×1024, 1024×768, 1440×900, 1920×1080 and actual component breakpoints; touch + keyboard, focus, zoom 200%, language fallback and reduced motion. Record build, browser/device, URL, state, operation, actual output, screenshot/log and reviewer. Historic v23/v24/mShots evidence is background, not v30 result.

### Explicit exclusions from this proposal

No new production APIs; no real candidate CV or uploaded files; no operational Google Sheets, CRM, AI or new marketing modules; no pricing or SLA changes; no merge/deploy; no implementation of SDD-01..05 without their approvals. External 24/11 demo date is past; new milestone must be set from actual readiness and client confirmation.

### Owner decision requested

1. Accept Sprint 2 goal as **audit and baseline of existing v30**, not rebuild.
2. Accept spec-review deliverables SR-01…SR-07 and separation from production commitments.
3. Assign a responsible executor/QA channel; Codex preferred but task dispatch proof required before claiming it is assigned. PO approves scope before any code work.
