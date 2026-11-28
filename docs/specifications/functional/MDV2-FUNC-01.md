# MDV2-03 — Functional Specification (initial draft)

**Version:** v0.1.0-DRAFT · **Status:** Pending PO review and source-specific use cases. Do not treat the existence of a UI component as proof of real functionality.

## Public site and routes
- NAV: 7 top-level groups, 14 subitems, 5 services, separate job/internal recruitment/news/enrollment/contact flows. Confirm routes and anchors in a versioned page registry before production.
- B2B journey: Home/Company/Services → F01 demand → response/ADMIN queue (mock in prototype; real system pending).
- B2C journey: Jobs filters → active job detail → F03 with stable job code from page → receipt/ADMIN queue; closed/expired job cannot receive application.
- Enrollment: shared program data and appropriate F05 consultation/F06 dossier modes, no duplicate CMS content systems just because menu has two entrances.

## Forms F01–F06
| ID | Required | Optional |
|---|---|---|
| F01 | Contact, phone, location, notes | Company, email, position, quantity, shift, need date |
| F02 | Name, phone | Email, message |
| F03 | Name, phone; job code required in stored submission | Job code bound from current job; no user-entered mandatory CV |
| F04 | Name, phone, applied position | Email, CV |
| F05 | Name, phone | Program (including Other/Not sure) |
| F06 | Name, phone | Email, program, documents |

Only F04 and F06 accept optional file metadata in prototype and real file upload **after** a separately approved production security design. Allowed original formats JPG/JPEG/PNG/PDF/DOC/DOCX, maximum 3 files, 5 MB each, 15 MB total; exact technical byte validation and malicious-file controls pending detailed spec. Do not add mandatory fields to F01 solely for marketing.

## CMS and processing
One ADMIN login role type, multiple accounts if approved; six queues, manual assignment, separate status models, owner history and no cross-form conflation. Duplicate F03: normalized phone + job ID. ADMIN compares/merges before exporting; which record wins and export blocking granularity still pending. Daily/manual export to operational Google Sheets, six tabs, requires approved authorization, row mapping, idempotence, timezone and error/retry contract.

## Content and other functions
Five-locale content management with Vietnamese as original, review before translation publication and labeled VI fallback. Jobs/content/partners/assets are editable only as scoped. Advanced builder, A/B testing, CRM/API/SMS and AI modules are separate requirements/commerce decisions, not inferred from the CMS inventory.

## Test scenarios to specify
For every form: pristine, invalid, successful synthetic, duplicate submit, explicit retry, optional missing, 5 locale labels, mobile keyboard and focus. For jobs: combined filter, no result, closed status, direct/reload/back. For ADMIN: queue separation, status, permissions, export failure and merge. For production: real server validation/security/retention only after approvals.

**Next:** decompose MDV2-REQ-REG into atomic functional cases by Issue, link approved architecture and test cases, retain all pending decision IDs.
