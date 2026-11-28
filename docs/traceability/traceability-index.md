# MDV2-TRC-01 — Requirement-to-code/test traceability

**Version:** v0.1-DRAFT, 28/11/2026.

This register binds **approved source requirement IDs** to SDD versions, decisions, implementation PRs, test cases and release evidence. Source-confirmed requirements and actual code status must never be conflated.

## Traceability record schema

| Field | Example |
|---|---|
| Requirement ID | MDV2-FRM-003 |
| Source ID + version | SRC-S1-REQ F03, customer confirmation v0.2 |
| Customer status | Confirmed need |
| Scope/phase | Demo vs Production |
| Commercial decision | Pending / Included / Separate |
| SDD spec approval | MDU-SDD-v1.0.0 prototype or production TBD |
| Implementation | branch, full commit SHA, PR |
| Test | D-04; AC-07/08, actual case ID |
| QA result | Pass / Fail / Blocked / Not Run |
| Evidence | exact build SHA, device, URL, screenshot/trace/log |
| PO/UAT | date, explicit approver, decision |

## Current links

| Group | Requirements | Existing artifact | State |
|---|---|---|---|
| Demo M01–M07 | MDV2-DEMO-001 | D-01–D-09 in draft customer acceptance and SDD handoff | Approved scope, independent QA needed |
| Sprint 2 UI | MDV2-DEMO-002 | docs/sdd/SEL-2026.11.27-v1.0.0/MDU-TRC-v1.0.0.md on handoff branch; RESULT-BY-CHOICE.csv on feature branch | 1,257 selected source rows tracked; PR #3 Draft |
| Forms F01–F06 | MDV2-FRM-001…007 | Sprint 1 field decisions, prototype tests | Customer-confirmed fields; production rules pending |
| ADMIN, duplicate, Sheets | MDV2-ADM/DUP/EXP | Sprint 1 O01–O06, production AC-09…16 | Real implementation not approved by prototype work |
| CMS/SEO/AI | MDV2-CMS/SEO/AI | CMS inventory, SEO direction and optional AI | Commercial/technical scope pending |
| GitHub policy | MDV2-GOV-001 | AGENTS.md, GEMINI.md, MDV2-GOV-01 | Policy implementation Draft PR to prototype |

**References:** [version-to-code register](../versions/code-location-register.md), [requirements register](../requirements/requirements-register.md), [acceptance baseline](../acceptance/acceptance-baseline.md), [decision log](../decisions/decision-log.md).

## Completion rules

No requirement is marked Complete simply because code is merged or the associated preview looks good. Confirm the defined AC for each required locale, browser/viewport, data state and security boundary. Store summarized evidence on GitHub and sensitive raw material only on the approved private repository. A blocked test remains Blocked; a deferred feature remains Deferred.

**Pending:** reproduce original detailed production AC/HD as reviewed, nonconfidential GitHub-native cases and attach per-code test IDs; the original Google Docs draft is not being silently copied into this public repository.
