# Approval boundaries and source conflicts

**Current authorized action:** Build, test, in-scope fix and separate preview for selected valid choices in SEL-2026.11.27-v1.0.0 according to MDU-SDD-v1.0.0. The PO approval occurred after the original spec documents were drafted. Pre-approval status headers are superseded for eligible work, but explicit unresolved conditions remain.

| ID | Source reality | Rule for Codex execution |
| --- | --- | --- |
| SRC-01 | UI Review Site reports bc0610e… but GitHub prototype HEAD is 08e2da4… | Verify mapping/source before changing Site-specific behavior; preserve legitimate source changes. Continue safe independent work when possible. |
| SEL-ERR-625 | Source B625 is literal Chọn instead of a code; P01-A1 likely | Keep provisional ROW625-P01-A-UNRESOLVED and Blocked; do not edit Sheet without PO. |
| SCOPE-E | 146 page-specific Pxx-E Chọn vs general E01–E15 Để sau and 28 CS-E Không chọn | Only existing mock UI fidelity within approved SDD; new business or integration must be blocked for PO. |
| NOT-SELECTED | P01-E1..4, P02-E1..4, CS-A01-3, CS-B08-3 and 28 CS-E | Do not implement as standalone work even if related DX suggests it. |
| UNDECIDED | CS-B08-4 = Chưa chọn | Exclude until selected. |
| MOTION | CS-C03-1 proposes panel 200ms, MS tokens T2=180/T3=240 | Use canonical T0–T4 unless actual design conflict requires PO. Keep all cancel/reduced rules. |
| SAVE | CS-C04-1 dynamic Lưu/Bỏ lưu with aria-pressed vs MI02-1 fixed toggle label with aria-pressed | Prefer stable accessible label + pressed; no duplicate/split semantics. |
| OPTIONAL | MI02-4 Undo, MI03-4 income sorting, MO05-1 route fade, MO08-2 optional end decoration, MS01-4 spring | Include original IDs and acceptance in report; do not implement optional new behavior unless separate decision has been explicitly recorded. |
| P41 | UI Review Site lists reviewer public/duyet.html but file absent from checked GitHub v30 | Source mapping first; do not recreate another tool automatically. |
| PROD | AI/CRM/Sheets/backend/file upload/auth/marketing claims and contract AC outside demo | Not part of this prototype UI authorization. |

**Publication:** create a dedicated accessible preview without modifying target Site/gh-pages; submit link + PR for PO UAT. Target publication is a separate gate and must comply with any actual previously granted publish permission; absence of proof means do not publish the target.
