# MDV2-GOV-03 — Documentation migration inventory

> Snapshot correction, 28/11/2026: prototype is now `19ac2b365f2264399fde4312639127b8de80736f`. Its tracked source remains Sprint 1 v30; its root static artifact records Sprint 2 source `66b7603`. See [deployment audit](../../DEPLOYMENT-AUDIT.md). Older `08e2da4` references below identify the previous snapshot, not current HEAD.

**Date:** 28/11/2026 · **Target:** GitHub-only authoritative project management without leaking confidential materials.

| Asset | Current source | In GitHub? | Next required action |
|---|---|---|---|
| Sprint 1 Requirements Register v0.2, sitemap, O01–O10 | Historical docs/sprint1-closure-20261127 branch | YES, historical/orphan branch | Keep immutable as evidence; curate links in new Register, no automatic unrelated-history merge |
| Sprint 1 v30 source | prototype branch | YES | Tag after reviewed release decision |
| Sprint 2 frozen selections/SDD | sprint-2/approved-ui-upgrade-sel-20261127-v1 branch | YES | Preserve approved version |
| Sprint 2 implementation code/QA | feat/s2-ui-upgrade-sel-20261127-v1 branch, Draft PR #3 | YES | Address 617 incomplete/116 blocked according to latest handoff, review PR; no premature merge |
| MDV2 governance/REQ/acceptance overview | docs/mdv2-github-control-20261128 work branch | DRAFT, to push | PO review via PR, then merge approved baseline |
| Customer clarification Google Sheet (22 questions, 30 fields, 6 intake records) | Restricted external source | ONLY SANITIZED SUMMARY IN PUBLIC | Decide private GitHub repository, authorized export and access controls; maintain exact source version/provenance |
| Contractor requirement drafts HR-WEB-01 v0.5/v1.2 | External draft documents | NO full public copy | Historical reference only; do not designate as Master Requirements |
| Customer detailed acceptance v1.2 | Restricted external draft | ONLY 50-CODE INDEX in public | If required, import full content into approved private repository; per-code test-case approval |
| Customer summary acceptance v1.2 | Restricted external draft | NO full copy | Review version and customer audience in private repo |
| UI review Google Sheet and choice comments | External workbook | Frozen selected JSONL on GitHub, original workbook elsewhere | Existing snapshot is authoritative for that SDD; later deltas require separate approved update |
| Original media/partner permissions and customer evidence | Mixed external assets | SOME demo assets and audit | Validate publication rights; keep licenses/agreements restricted |
| Backend/CMS/DB production schema | Not delivered in current prototype | NO | Must be specified/approved and built in future production work, not invented |

## Hard boundaries

This file inventories absent source records; it does NOT grant permission to commit restricted copies to the public repository. First configure a PRIVATE GitHub documentation repository with user-approved access, or redact the content with a documented decision. Every future AI edit to either public or private project docs/code must be pushed to the correct GitHub remote. A restricted source remaining outside GitHub is labeled PENDING_MIGRATION rather than falsely declared completed.

## Release/governance checklist

- Project Owner signs off MDV2 structure, requirements and which sources may be made public.
- Configure branch rules/required CI/reviews for prototype, gh-pages and any release branches (CODEOWNERS alone does not enforce approvals).
- Create reviewed, immutable version tags and release manifests for future checkpoints.
- Review open Draft PRs #1, #2 and #3; no merge without current base reconcile.
- Validate confidential sources and store in approved PRIVATE GitHub repo, with minimal public metadata.
- Update this inventory and versions register in every relevant AI PR.
