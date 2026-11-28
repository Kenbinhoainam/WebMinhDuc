# MDV2-GOV-02 — Sources and approval precedence

**Draft:** 28/11/2026. Does not certify unreviewed requirements.

## Source-of-truth model

GitHub is the **versioned system of record** for project code and documents. The newest GitHub file is not automatically the most authoritative: authority comes from the scoped PO/client approval and version recorded with the change.

**Order when documents conflict:**
1. Written decision by the relevant authorized approver for the exact scope/phase, recorded in GitHub decision log and linked evidence.
2. Approved MDV2 Master Requirements baseline for the same scope and version.
3. Customer-confirmed Sprint 1 source requirements, with exact field decisions, when later approved changes have not superseded them.
4. Approved SDD/ADRs/acceptance for their feature/sprint only, subordinate to business scope.
5. Drafts, historical vendor requirements, research, and implementation evidence. Code demonstrates what exists, **not** what the customer approved.

If two applicable approved decisions conflict, raise DEC-CONFLICT; do not silently choose either. Track business confirmation, spec approval, commercial inclusion, implementation and QA as separate statuses.

## Registered current sources

| Key | Source | Authority/use | GitHub status |
|---|---|---|---|
| SRC-S1-REQ | Sprint 1 Requirements Register v0.2, customer responses confirmed 19/11 | Verified customer needs; still requires implementation detail | Historical branch docs/sprint1-closure-20261127 |
| SRC-S1-HANDOFF | Sprint 1 closure and SPRINT-HANDOFF.md, 27/11 | Discovery closed; open O01–O10 remain | Historical branch, separate/unrelated Git history; DO NOT merge blindly |
| SRC-S1-UI | Existing prototype v30 | Implemented source, mock behavior only | prototype @ 08e2da4 |
| SRC-S2-SEL | UI selection SEL-2026.11.27-v1.0.0 + MDU-SDD-v1.0.0 | Approved eligible prototype UI work, conditional exclusions retained | sprint-2/approved-ui-upgrade-sel-20261127-v1 |
| SRC-S2-IMPL | Sprint 2 implementation & QA handoff | Evidence of existing work, not whole-product acceptance | feat/s2-ui-upgrade-sel-20261127-v1, PR #3 Draft |
| SRC-VENDOR-05 | HR-WEB-01 v0.5 draft | Historical contractor proposal, NOT master | External draft; not copied into public repo |
| SRC-VENDOR-12 | HR-WEB-01 v1.2 draft | Contractor source to compare; NOT master | External draft; not copied into public repo |
| SRC-AC-12 | Customer detailed/summary acceptance v1.2 draft | Reference for D-01…09, AC-01…27, HD-01…14 | External drafts; full copies not in public repo |
| SRC-CUSTOMER-SHEET | Customer clarification sheet, 22 confirmations/30 fields/6 intake groups | Customer-confirmed data source, private | Exact source remains restricted; sanitized requirements captured |
| SRC-REF-UI-01 | minhduccorp.com.vn visual reference | Requested design-direction reference, exact screenshots/permissions pending | Reference only, no copying outside rights |

Do not publish restricted Google Drive content merely because project governance now uses GitHub. The proper destination is a separate private GitHub repo with access rules that the PO approves.

## Distinguish artifacts

- MDV2-REQ-01: candidate master, new ID and v0.1, not HR-WEB-01 renamed.
- MDV2-REQ-REG: requirement ID/source/status register.
- MDV2-DEC: explicit approval record for conflicts and scope.
- MDV2-AC: production/demo/handover criteria index; Pass only with actual cases/evidence.
- MDV2-TRC: requirement→SDD→branch/commit→test→UAT.
- MDV2-REL: version registry, release/deployment mapping.

**Changing source-of-truth policy does NOT approve unfinished Draft PRs or all 1,257 selected SDD items for production.**