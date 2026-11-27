# QA Execution Checklist — SEL-2026.11.27-v1.0.0

**Never mark PASS without running the test on the exact build.** Source snapshots contain expected outcomes, not actual test results.

## Test matrix (minimum)
| Family | Representative URLs/screens | Viewports and interaction | Evidence |
| --- | --- | --- | --- |
| Shared Header/Nav | Home, Services, Jobs, Contact, Education, ADMIN | 320×740,390×844,430×932,768×1024,1024×768,1280×800,1440×900,1920×1080; 1279/1280/1281; Tab/Enter/Escape, touch | before/after screenshot, activeElement, focus-visible |
| Hero/video/motion | Home poster/play/pause/ended/fallback; tab hidden, reduce | 390,820,1440,1920, 639/640; interrupt/replay | screen recording, network/media status, original IDs |
| B2B F01/F02 | /, /services, /contact; query/hash/deep link | invalid/valid, 4 required, 6 optional, mobile keyboard, back/reload | receipt DEMO, form error focus and persistence |
| Jobs/F03/F04/Saved | /jobs, open/closed job MD005, /saved-jobs, /careers | IME VN/CJK, filters, rapid save/unsave, optional CV; 390/1440 | fixture expected/actual count, card/focus trace |
| Admissions/Consultation | /education, /consultation, F05/F06 | query/form, file metadata, date, change time, keyboard | demo success (not real booking) and state restore |
| ADMIN and Editorial | /admin-demo, /news, /events, /about-us | tab/filter/CSV/reset, archives/back, rail pause, partner labels | fake-data proof, no confidential data, video |
| Reviewer P41 | /duyet.html only if matching source | 390/820/1440 iframe, 8 pages, reload, keyboard | if source not found mark Blocked, do not invent |
| Locale/Accessibility | VI/EN/ZH/KO/JA, all error/empty/success labels | zoom 200%, 5 locales, reduced-motion at load and mid-transition | text/focus/aria, language fallback evidence |

## Breakpoint boundaries
Check actual component breakpoints with paired values where relevant: 359/360; 450;520/521;639/640;767/768;799/800;999/1000;1023/1024;1279/1280/1281. Test touch-specific behavior on actual iOS Safari and Android Chrome (or authorized real-device service). An iframe screenshot is not evidence of real touch, browser keyboard or file selection.

## Motion interrupts
1. Click menu open-close-open rapidly; verify single open final state.
2. Press modal close/Escape during opening; focus returned; overlay removed; no stale transitionend.
3. Switch tabs/filter 3 times before 240 ms; last intent only; no stale result.
4. Trigger reduced-motion while reveal is half-done; content immediately visible.
5. Pause carousel manually then hide/show tab; user pause remains active.
6. Video reaches ended while hidden; returning displays correct end state and CTA; replay cancels end effect.
7. Press and cancel pointer before click; no ghost action.
8. Double-submit fixture; one demo reference for same attempt.
9. Toggle saved job quickly and remove card; IDs and badge exact, focus repositions.
10. Duration=0 and canceled transitions do not hang functional state.

## Regression
Run only scripts actually present in package.json; baseline candidates: npm ci, npm run build, npm test, npm run test:sprint, npm run test:review, npm run test:seo, npm run test:hydration, npm run test:motion, npm run test:header, npm run audit:i18n. Record command, exit, timestamp, SHA and log link. Check 5 languages, mock/noindex, no PII, file size/type limits, no expired job application and no third-party real integrations.

## Evidence and reporting templates
Per original source code, `choice_id,source_row,component,SDD_ID,QA_ID,build_SHA,preview_URL,viewport,locale,input_type,start_state,steps,expected,actual,status,evidence_ref,severity,fix_SHA,owner`. Status choices: Pass / Fail / Blocked / Not Run. Deliver aggregate `Completed / Incomplete / Blocked` separately from test result. Every failure fixed within approved scope gets a retest row. Never claim results from earlier v23/v24 screenshots for current build.
