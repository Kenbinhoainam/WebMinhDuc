# QA, Acceptance & Handover Traceability

**As-of:** 27/11/2026 · status is planning/evidence inventory only; **no test was run as part of this documentation commit**.

## 1. QA evidence conventions

Each test needs: requirement ID, acceptance ID, URL/screen, build SHA, browser/device, CSS viewport, locale, input/test fixture, starting state, action, expected vs observed result, screenshot/log, reviewer, **Not Run / Pass / Fail / Blocked**.

Do not transfer Pass from prototype 3 QA (16/11) or screenshot v24 into current v25 acceptance. Keep HTML/CSS verification, static screenshot and interactive browser QA separate. Don't claim INP measured without genuine interaction data; define CWV metrics and conditions before using as contracts.

## 2. Traceability matrix

| Source group | Related requirements / UI | Verification intent | Current status |
| --- | --- | --- | --- |
| D-01, D-02, D-07 | M01–M07, WEB-01/02 | Mobile preview, B2B/B2C clarity, no blocking layout | NOT RUN |
| D-03, D-04 | M02–M04, JOB-01, F03 | Search/filter, detail, mock job application | NOT RUN |
| D-05 | M05/M06, F01 | B2B mock submission | NOT RUN |
| D-06, D-08 | M07, FLOW-01, EXPORT-01 | ADMIN mock, labels of simulation, separate queues | NOT RUN |
| D-09 | Production AC draft | Sign-off preview only | DRAFT EXISTS |
| AC-01…AC-06 | WEB, NAV, LANG, JOB | Sitemap, responsive, locale, filter, expiry | DRAFT — SCOPE PENDING |
| AC-07…AC-09 | F01–F06, FORM-01 | Validation, persistence/grouping on production | DRAFT |
| AC-10…AC-14 | CMS, FLOW, DUP, EXPORT | Real CMS, assignment, merge, scheduled Sheets | DRAFT |
| AC-15…AC-16 | FILE, ADMIN | Private upload, access authorization | DRAFT |
| AC-17…AC-19 | SEO/analytics/performance | Schema, tags without PII, defined NFR benchmark | DRAFT |
| AC-20…AC-24 | Security/reliability/delivery | Blocker-free QA, restore, build, assets, operator docs | DRAFT |
| AC-25…AC-26 | Enhanced CMS and external non-AI integrations | Run only if purchased/in approved scope | CONDITIONAL |
| AC-27 | AI-01…AI-10 | Acceptance only for separately approved AI features | OPTIONAL |
| HD-01…HD-04 | Git/source/schema/env/API | Independent build and controlled secrets handoff | DRAFT |
| HD-05…HD-09 | Design/CMS/deploy/test/restore | Editable source, documentation and evidence | DRAFT |
| HD-10…HD-14 | Ownership/training/support/traceability/deltas | Formal handover and exception inventory | DRAFT |

## 3. Responsive / interaction coverage to add

| Family | Representative viewport/state |
| --- | --- |
| Header/menu/CTA | 320×740, 390×844, 430×932; around 1279/1280/1281×900, 1440×900 |
| Service choice and details | 390×844, 768×1024, 1440×900, 1920×1080 |
| F01/F02 validation | 320/390, desktop zoom 200%, keyboard, incomplete/valid/invalid, mode switch |
| Video/rail/toast | 390 and 1440; playing/ended, open/closed, reduced motion, saved/unsaved |
| Five-language content | VI/EN/ZH/KO/JA, typography, fallback and translated labels |
| Screenshot comparisons | Record actual CSS viewport and scroll position; do not infer from image pixels alone |

**Review gates:** SDD specs need PO approval individually; execution work receives a branch/task and acceptance owner only after approval; production gate always separate. No unverified test is marked Pass.
