# Sprint 2 Acceptance Baseline — D-01 to D-09

**State:** Approved criteria for demo, **no new QA result from this planning update**. The existing project may already implement some screens; verify specifically against current v30.

| ID | Expected demo behavior | Reproduction evidence to collect | Status |
| --- | --- | --- | --- |
| D-01 | Opens on mobile by shareable preview URL | URL, build SHA, device/browser screenshot | NOT VERIFIED FOR v30 |
| D-02 | Home/services show B2B and B2C paths consistently | Home + service screenshots and CTA interactions | NOT VERIFIED FOR v30 |
| D-03 | Job search/filters and job detail are interactive | Fixture matrix: KCN, employment type, shift; empty/reset; job detail | NOT VERIFIED FOR v30 |
| D-04 | F03 validates required fields and generates fake receipt | Missing/invalid/valid test, DEMO ID, category/job code | NOT VERIFIED FOR v30 |
| D-05 | F01 validates required fields and generates fake receipt | 4 required fields, error focus, mock confirmation | NOT VERIFIED FOR v30 |
| D-06 | ADMIN mock shows intake/assignment/status | Synthetic F01/F03 records, no real persistence implied | NOT VERIFIED FOR v30 |
| D-07 | No blocking errors/overflow in two journeys on mobile | Touch, keyboard, 320/390/430 widths and breakpoint checks | NOT VERIFIED FOR v30 |
| D-08 | Simulation limitations are disclosed | Demo vs real capabilities ledger, check no external PII | NOT VERIFIED FOR v30 |
| D-09 | Draft production acceptance exists, distinct from demo | Current v1.2 draft AC-01…27 and HD-01…14, scope version | DRAFT EXISTS, NOT CONTRACTED |

## Test record template

- Requirement/AC ID; screen/URL; exact Git SHA; locale; screen CSS width×height; browser/OS/device; starting state; fixture inputs; steps; expected; observed; status **Pass/Fail/Blocked/Not Run**; severity; screenshot/recording/log; tester/time.
- Test BOTH manual navigation and direct/reload/back routes for F01. `/contact` direct may default F02; only classify as bug if B2B CTA fails to open F01 or loses context.
- Fixed headers, toast, video/hero state, hamburger, form focus, keyboard and reduced-motion must not block action.
- Do not infer computed CSS or visual interaction from static screenshots or old jsdom tests.
- Real/backend/admin/Google Sheets tests are **out of demo scope** and should remain explicit production acceptance pending.

## Linked source groups

- D-01…D-09: prototype demo.
- AC-01…AC-27: **production website**, draft until contract and approved scope.
- HD-01…HD-14: handover obligations, draft until approved scope.
- SDD-01/03/02/04/05: proposed UX changes, **not automatic fixes or test pass**.
- REF-UI-01: compare layout/brand directions only after PO identifies exact accepted aspects; never clone asset claims from example.

No tests were executed by the creation of this file; do not update statuses until reproducing steps on pinned v30 or a newer explicitly selected build.
