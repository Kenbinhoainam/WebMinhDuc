# Frozen Google Sheet data for Codex

**Version:** SEL-2026.11.27-v1.0.0, read 2026-11-27 17:20 GMT+7.

Source workbook: https://docs.google.com/spreadsheets/d/1u6JuI6X3t_wpgrxia16DXbCHzIRn0KbG_KymygTbGEg/edit

All JSONL files are machine-readable. Each line contains sheet, row, status, source_code, effective_code, and fields. The fields object uses original Vietnamese column headings and full source cell values, including proposed action, test criteria, conditions, component scope, and user notes. Preserve raw source code and row numbers in the implementation and QA results.

## Source rows

| File(s) | Records | Source status |
|---|---:|---|
| selections-pages-P01-P10.jsonl, P11-P20.jsonl, P21-P30.jsonl, P31-P41.jsonl | 907 | Chọn, 906 valid IDs plus one provisional |
| selections-cs-all-statuses.jsonl | 188 | 157 Chọn, 30 Không chọn, 1 Chưa chọn |
| selections-motion-all-statuses.jsonl | 88 | All Chọn; trigger/feedback/timing/interruption/reduced-motion/AC included |
| selections-common-all-statuses.jsonl | 90 | 75 Chọn, E01–E15 Để sau |
| selections-states-all-statuses.jsonl | 30 | All Chọn, T01–T30 |
| pages-and-urls.jsonl | 41 | Page and reviewer P01–P41, paths, locales, components |
| dx-proposals-reference-only.jsonl | 246 | Suggestions only, **not separately selected** |

Eight P01/P02-E source rows have status Không chọn; list in ../APPROVAL-BOUNDARIES.md. One selected page source row, B625, contains the literal word Chọn in place of an item ID. Its effective_code is ROW625-P01-A-UNRESOLVED, not P01-A1 unless the Project Owner confirms correction.

**Machine source:** Motion tab original column F=trigger, G=feedback, H=motion parameters, I=repeat/cancellation, J=reduced motion, K=scope, L=acceptance, O=conditions, P=user note. Read the full row, not only the summary.

**Execution report template:** ../execution/RESULT-BY-CHOICE-TEMPLATE.csv includes one row per selected source entry (1,257 rows) with initial status Incomplete or Blocked and tests Not Run; Codex must replace those with actual evidence-backed results.

**Authorization:** The Project Owner approved implementation of eligible selected UI under MDU-SDD-v1.0.0. This does not override a row's conditional business gate or authorize a newly introduced non-UI/production feature. Never implement Không chọn, Để sau, or Chưa chọn as standalone work.
