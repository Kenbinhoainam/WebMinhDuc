# Minh Đức — Approved SDD Execution Handoff

**Selection version:** `SEL-2026.11.27-v1.0.0` (freeze 27/11/2026, 17:20 GMT+7).
**Specification:** `MDU-SDD-v1.0.0`; **Phases:** `MDU-PLAN-v1.0.0`.
**Approval event:** Project Owner approved implementation of selected/eligible scope on 27/11/2026. This approval permits code changes on isolated branch, in-scope bug fixing, tests and a **separate preview**. It does not approve excluded/deferred/new business/production features or automatic merge/publication of existing target.

## Read order in Codex Cloud
1. [CODEX-CLOUD-TASK.md](CODEX-CLOUD-TASK.md): **authoritative executable prompt**, all conditions.
2. [manifest.json](manifest.json): source data version, original status counts, freeze timestamp, known source identity conflict.
3. [data/README.md](data/README.md) plus **all** `data/*.jsonl`: the original 1,257 selection records and exclusions. Full criteria, trigger/interruption/reduced motion and notes are included per row.
4. [MDU-SDD-v1.0.0.md](MDU-SDD-v1.0.0.md): 13 grouped SDD packages, component behavior/AC.
5. [MDU-TRC-v1.0.0.md](MDU-TRC-v1.0.0.md): mapping selection → page/component → QA source; preserve IDs.
6. [MDU-DEC-v1.0.0.md](MDU-DEC-v1.0.0.md): conflicts and decisions (do not make a new business decision without PO).
7. [MDU-PLAN-v1.0.0.md](MDU-PLAN-v1.0.0.md) + [MDU-EXEC-BRIEF-v1.0.0.md](MDU-EXEC-BRIEF-v1.0.0.md): W0–W5 and agent work packages.
8. [QA-EXECUTION-CHECKLIST.md](QA-EXECUTION-CHECKLIST.md) and [APPROVAL-BOUNDARIES.md](APPROVAL-BOUNDARIES.md).

## Project sources
- GitHub repository: https://github.com/Kenbinhoainam/WebMinhDuc
- Handoff source branch: `sprint-2/approved-ui-upgrade-sel-20261127-v1`, derived from `prototype` v30 commit `08e2da46106b51537b871aea3880fc94b25da935`. Re-check HEAD and legitimate intervening changes.
- Target reference: https://minhduc-sprint1-ui-review.kenbinhoainam.chatgpt.site/
- Sheet reports Site commit `bc0610e208b35d7b2e65c7a4fc3819a3d5a00b91`, **not fetched from checked GitHub**; verify Site project/commit mapping. Do NOT assume it equals prototype v30.
- Project instructions: repository root `AGENTS.md`, `README.md` and `package.json`.

## Status and evidence
- 907 page rows selected (906 valid original codes + one B625 provisional), 157 CS selected, 88 Motion selected, 75 common A/B/C/D/F selected, 30 T selected = **1,257** total.
- 8 page rows Not chosen, 30 CS Not chosen, 15 common E Deferred, one CS undecided = excluded/not authorized by the choice freeze.
- 146 selected Pxx-E remain subject to business-scope reconciliation: existing mock UI polish okay; new business functionality needs separate decision.
- One invalid source ID at B625 (provisionally ROW625-P01-A-UNRESOLVED). Do not relabel without proof.
- Original SDD/Plan/Dec docs were drafted before approval. The new PO approval supersedes their generic "awaiting approval" status only for **unconditional selected implementation**, not their explicit conditional gates.
- Codex task **has not been created** by MASTER. Do not claim a preview or deployment exists before executor evidence.

## Report format
For each source ID output `original_id,status,component,acceptance_id,test_result,commit_or_evidence,blocker`. Allowed status: Completed / Incomplete / Blocked; non-selected records remain Excluded/Deferred/Unresolved in separate report. Provide SHA, URL/viewport/test conditions, screenshots/video where available, QA logs, defect fixes, preview link and PR/diff. Preview must stay separate from deployed target.
