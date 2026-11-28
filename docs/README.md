# MinhDucWeb V2 — GitHub Documentation Hub

**Document baseline:** MDV2-DOC-2026.11.28-v0.1.0 (draft, for PO review)
**Repository:** Kenbinhoainam/WebMinhDuc (PUBLIC)
**Policy:** GitHub is the source of truth for all **approved, publishable** project source code, specification files, decisions, QA evidence indexes, releases and AI handoffs. Private data requires a separate PRIVATE GitHub repository and its restricted access policy; do not copy private records into this public repo.

## Start here

1. [GitHub policy, mandatory AI push rule](governance/github-operations-policy.md)
2. [Source precedence and source inventory](governance/source-of-truth.md)
3. [MDV2-REQ-01 candidate master requirements](requirements/master-requirements.md)
4. [MDV2-REQ-REG requirements register](requirements/requirements-register.md)
5. [Decision register and unresolved scope](decisions/decision-log.md)
6. [Acceptance baseline and status](acceptance/acceptance-baseline.md)
7. [Traceability guidance](traceability/traceability-index.md)
8. [Version-to-code inventory](versions/code-location-register.md)
9. [Sprint status](sprints/sprint-status.md)
10. [AI multi-agent execution protocol](ai/multi-agent-protocol.md)
11. [Architecture status](architecture/architecture-status.md)
12. [Handover status](handover/handover-checklist.md)

**Agent entrypoints:** repository root AGENTS.md and GEMINI.md. These must direct any AI to this index and its approved baseline.

## Baseline governance

- Master requirements in this folder are a **NEW MDV2-REQ-01 candidate**, NOT a renaming of HR-WEB-01.
- HR-WEB-01 v0.5/v1.2 and the separately drafted customer-acceptance documents are **historical/review sources only**; do not infer their commercial or approval status from the filename.
- Sprint 1 Discovery is CLOSED, but the closure was internal and not product acceptance; its Git history is separately stored. No requirements are overwritten by newer prototype code or by an undiscussed conflict.
- Sprint 2 selected UI SDD is in the existing handoff branch sprint-2/approved-ui-upgrade-sel-20261127-v1; implementation is in feat/s2-ui-upgrade-sel-20261127-v1 with Draft PR #3. It is **not** merged into prototype.
- This index and the supporting MDV2 documents are an **initial governance skeleton for review**, not a full production requirements sign-off.
- Keep each approved change/version tied to Issue → SDD/Decision → Branch → Commit → PR → CI/QA → Review/Release. No parallel Google Doc or ChatGPT answer has higher authority than the approved GitHub revision.
- Documentation that is confidential or has customer source material not cleared for public posting is **NOT migrated here**. Its migration is blocked until a private repository has been configured and its audience approved.

**Migration status:** index/requirements register/acceptance overview/version map = created as drafts; private original source copies, full production acceptance cases, approved commercial matrix, complete release/version tags and GitHub branch protection still require review or setup. The presence of a Markdown heading does not mean the underlying requirement has been completed.
## Additional draft modules

- [MDV2-00 Project Charter](governance/project-charter.md)
- [MDV2-03 Functional Specification](specifications/functional/MDV2-FUNC-01.md)
- [MDV2-04 UI/UX Specification](specifications/ui-ux/MDV2-UX-01.md)
- [MDV2-05 Technical Specification](specifications/technical/MDV2-TECH-01.md)
- [Document migration inventory and confidentiality gates](governance/migration-inventory.md)

