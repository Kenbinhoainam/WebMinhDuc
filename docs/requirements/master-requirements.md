# MDV2-REQ-01 — Master Requirements Specification

**Version:** v0.1.0-DRAFT · **Issued:** 28/11/2026 · **Owner:** Project Owner · **Status:** CANDIDATE, NOT APPROVED PRODUCTION BASELINE.

**New canonical document ID:** MDV2-REQ-01. This is **not HR-WEB-01** and must not be presented as a rename/approval of its v1.2 contractor draft.

## Purpose, boundary and evidence

This draft consolidates customer-confirmed needs recorded in Sprint 1, linked requirements register and approved prototype SDD where appropriate. It intentionally does not reproduce restricted customer source documents or confidential commercial data into this public repository.

The customer-confirmed answers govern **needs**, not implementation details, pricing, a signed contract, or actual QA. Keep independent states for customer-confirmed, PO-spec-approved, commercial included, implemented and tested. Requirements decisions are tracked in docs/decisions/decision-log.md. Original Sprint 1 Requirements Register v0.2 and its closure/handoff remain historical evidence at the GitHub branch docs/sprint1-closure-20261127.

## 1. Business and target users

- B2B is the primary business positioning previously recorded as BIZ-01; B2C users must still have clear accessible pathways. Exact visual prominence/copy ratio needs design approval. No false result/proof claims.
- B2B: companies/factories looking for staffing, leasing, recruitment and organizational solutions; B2C: workers looking for jobs, internal candidates and enrollment users.
- Two verifiable journeys: company → services/profile → demand F01 → demo/prod handling; worker → job search/filter → detail → F03. Production handling is separate from a synthetic demo.
- Source of partner logos, certificates, case studies, business metrics and endorsements must be verified for public rights before launch.

## 2. Sitemap and public product

Seven main menu groups: Trang chủ; Giới thiệu; Dịch vụ; Việc làm; Tuyển dụng nội bộ; Tin tức; Liên hệ. Two-level menu with 14 subitems as documented in Sprint 1. Five service lines:
1. Giới thiệu và cung ứng nhân lực
2. Cho thuê lao động
3. Headhunt / lao động có tay nghề
4. Chương trình tuyển sinh
5. Setup cơ cấu tổ chức và phần mềm doanh nghiệp

Job pages support stable job codes, detail, status and combined KCN/region/employment/shift filters; closed jobs do not accept applications. Internal jobs and enrollment are distinct from general worker applications. Enrollment navigation under multiple menu entries should refer to one coherent content/data source; final URL/anchor map remains a design decision. News groups cover labor-related articles and company activities.

## 3. Six public forms — confirmed fields

| Form | Required | Optional / source |
|---|---|---|
| F01 — Business demand | Contact person, phone, location, notes | Company name, email, job/position, quantity, shift, required date |
| F02 — General contact | Name, phone | Email, message |
| F03 — Job application | Name, phone; stable job ID **required in the record and populated from the active job by the system** | Do not invent mandatory CV/extra fields |
| F04 — Internal recruitment | Name, phone, position | Email, CV |
| F05 — Enrollment consultation | Name, phone | Program incl. Other/Not sure |
| F06 — Enrollment dossier | Name, phone | Email, program, supporting files |

For F04/F06 only: optional JPG/JPEG/PNG/PDF/DOC/DOCX attachments, max 3 items, 5 MB/item, 15 MB total. Exact byte definitions, scan/reject semantics, retention and security require production technical approval.

Public users do not need accounts to submit. Forms need validation, duplicate-submission protection, accurate reference/status and clear error/success. **A mock in-memory receipt is not successful production submission.**

## 4. ADMIN/CMS and workflow

- Customer-confirmed: one type of login role **ADMIN**, potentially multiple individually identified accounts. Departments/owners are workflow data, not additional authorization roles.
- ADMIN processes six separate submission categories, manual assignment/transfer, appropriate status history, authorized viewing/exporting and notifications.
- Duplicate key for F03: normalized phone + stable job ID; same phone across different jobs is not automatically duplicate. ADMIN resolves duplicates before manual/daily export. Conflict merge, batch-blocking granularity and retention need explicit production decisions.
- Manual and daily export to an operational Google Sheets destination containing one tab per F01–F06. Preflight permissions/connectivity and duplicates; a failed scheduled export is reported to ADMIN, then **manual** retry after intervention, not invented automatic recovery.
- CMS is required for managed content/translation/jobs/forms/media; Sprint 1 recorded a **custom-written CMS** preference/confirmation. Strapi/Payload or other alternatives are architecture proposals requiring a PO decision, not an automatic replacement.
- CMS-01…CMS-15 is an inventory of possible module groups, **not** blanket approval for page-builder, A/B testing, dashboards, automation or paid integrations. Decompose each into scoped functional IDs and commercials before production implementation.

## 5. Content, locales, UI/UX, SEO and accessibility

- Five user-facing languages: Vietnamese original, English, Simplified Chinese, Korean, Japanese. ADMIN interface in Vietnamese. Published translations require the responsible approval, and unapproved/missing translations should fall back to Vietnamese with honest language labels. Locale-aware URL/SEO metadata must correspond to actual text.
- Design aims at a modern professional high-quality experience, responsive across mobile/tablet/laptop/desktop with keyboard/touch/reduced motion support. REF-UI-01 is a customer design-reference candidate, not permission to copy third-party logos/assets or expand scope.
- SEO/AEO technical capabilities, canonical/hreflang, sitemap and structured data require test cases appropriate to real data. No indexed job structured data from synthetic jobs.
- Performance/WCAG, real-device matrix, data retention/backup/hosting and support require explicit measured/approved conditions, not invented SLA numbers.

## 6. Prototype, production, optional extensions

**Prototype/demo:** approved M01–M07 and D-01–D-09 for synthetic data only. Sprint 2 UI selection SEL-2026.11.27-v1.0.0 was approved for eligible prototype improvements, not automatic production feature expansion. Existing code is React/Vite with mock ADMIN and in-memory demo submissions; production CMS/API/DB/real file storage are NOT proven by screenshots or UI-only tests.

**Production:** must define real API, security, privacy, data, hosting and operational acceptance AC-01…AC-27 with documented commercial inclusion. **AI-01…AI-10** and non-AI advanced integrations are separately scoped and approved.

## 7. Change and acceptance gates

- Customer source → stable requirement ID → PO decision → SDD/architecture → Issue/branch/commit/PR → test case → QA evidence → release.
- Requirements not yet decided keep status Pending, not Not Applicable or Pass. Production acceptance and formal handover require their own decision.
- **Every code or document change made by any AI MUST be pushed to GitHub in a reviewable branch**. See docs/governance/github-operations-policy.md.
- Do not combine source content and commercial scope: owner must review what is included/extra and phase before work begins.

## Review blockers before approved v1.0

(1) B2B primary versus visual hierarchy; (2) custom CMS vs alternative proposal; (3) finalized URL/enrollment mapping; (4) full 15-module scope and price; (5) F01–F06 implementation rules; (6) merge and export details; (7) material rights and locale approvers; (8) performance/real-device/a11y matrix; (9) privacy, hosting and architecture; (10) crosswalk between Sprint 1, production AC, prototype SDD and actual PR #3.

**Document status remains DRAFT until PO approves this exact GitHub revision.**