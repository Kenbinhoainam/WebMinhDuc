# MDV2-00 — Project Charter & Governance

**Version:** v0.1.0-DRAFT · **Date:** 28/11/2026 · **Project:** Website Minh Đức V2.

## Mission
Design and build an accessible, responsive B2B/B2C staffing company website, with job search, six inbound forms, professional content and an independently operable ADMIN/CMS for approved production scope. Target a high-quality prototype without unverified marketing claims; product scope remains subject to explicit requirements/contract decisions.

## Scope and participants
- Project Owner: authorizes requirements, design, commercial boundaries, PR merges and releases.
- Customer representatives: confirm needs, source media, legal claims, operational processes and UAT.
- AI/contractor executors: work from approved SDD and GitHub Issues, create separate branches, run tests and submit PR evidence.
- QA/review: independent functional and usability checks with code/URL/viewport/device and actual result.
- Public GitHub repo: source, publishable specs, decisions, test data and release manifests. Customer-sensitive data must use an approved PRIVATE repository.

## Phase model
1. Sprint 1 Discovery: internally CLOSED, historical source and open O01–O10 preserved.
2. Sprint 1 prototype: React/Vite v30 in prototype.
3. Sprint 2 UX upgrade: eligible SEL/SDD approved, feature code in Draft PR #3, QA not yet fully accepted.
4. Production requirements and architecture: candidate master v0.1, commercial and technical gates still open.
5. Release/handover: build/version/QA/UAT plus signed approval; not implied by preview publication.

## Decision and delivery process
- Capture customer-confirmed need with source and ID.
- Review business/technical conflicts in Decision Register.
- Approve exact spec and scope before code. Keep different statuses for business confirmation, spec, commercial, implementation, QA.
- Assign GitHub Issue and unique branch/worktree; each AI change to code/docs/tests/configs MUST be committed and PUSHED to GitHub.
- Require PR review, CI and actual test evidence; only Project Owner authorizes merge and target deployment.
- Retain historical versions and release/preview mappings. Never rewrite to hide previous decisions or defects.

## Current documents
MDV2-01 Master Requirements; MDV2-02 Requirements Register; MDV2-03 Functional Spec; MDV2-04 UX/UI Spec; MDV2-05 Technical Spec; MDV2-06 Acceptance; MDV2-07 Handover; MDV2-08 Decisions; MDV2-09 Traceability. All are newly initialized DRAFT except the PO's GitHub-first governance instruction, which is approved.

**Note:** This charter is a governance candidate, not an approval of production CMS, backend, actual handling of CV/PII or the contents of historical vendor drafts.