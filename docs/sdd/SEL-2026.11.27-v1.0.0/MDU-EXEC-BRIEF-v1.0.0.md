> GOVERNANCE UPDATE 2026-11-27: Project Owner has approved MDU-SDD-v1.0.0 based on SEL-2026.11.27-v1.0.0 for execution of the valid, in-scope, selected UI improvements. The previous “PROPOSED/NOT IMPLEMENTED” label in this historical v1.0.0 document refers to its pre-approval state. Conditional new features, invalid source ID B625, Site-source mismatch, and deferred/excluded selections remain gated; see README and CODEx task prompt. This is NOT production scope or automatic deployment permission.

# MDU-EXEC-BRIEF-v1.0.0 — Bộ giao việc AI (CHƯA GIAO TASK)

**27/11/2026, +07. Status:** DRAFT for Project Owner review. Codex Cloud environment ưu tiên được nêu là **WebMinhDuc**, nhưng current MASTER không có quyền tạo/đọc Codex task trực tiếp hoặc xác thực chính xác task environment; không có task ID/receipt được phát sinh trong lượt này. Dữ liệu Sheet được frozen, source mismatch và B625/E scope gate chưa giải quyết; **không bắt đầu coding**.

**Đầu vào chuẩn cho MỌI executor sau phê duyệt:** source workbook 1u6JuI6X3t_wpgrxia16DXbCHzIRn0KbG_KymygTbGEg; mã freeze SEL-2026.11.27-v1.0.0; MDU-SDD-v1.0.0; full 1.257 trace matrix; MDU-PLAN-v1.0.0; repository https://github.com/Kenbinhoainam/WebMinhDuc; AGENTS.md, README.md, relevant tests. Bản chọn trong Sheet không tự phê duyệt điều kiện/gía/scope production.

**Yêu cầu cấp phép thực thi:** Project Owner approves exact SDD package and permitted source/target; authorized executor can access Site project matching pinned SHA, Git remote/branch, scopes, selected codes and acceptance. Then create an isolated branch for each disjoint work unit; never alter prototype/gh-pages directly, never merge or deploy without separate approval. If task cannot be created, mark Pending rather than claim assigned.

## EX-00 — Source identity & freeze audit (READ ONLY)

**Role:** Codex investigator / MASTER QA, only after authorized access. **Dependencies:** Source Sheet and GitHub accessible; no design approval needed for read-only assessment.

**Instructions:** Inspect full repo identity and Git ref, compare Site project identity from UI Review Site with Sheet’s commit bc0610e…, investigate why this SHA isn't found in GitHub's prototype history; find P41 /duyet.html source if present in another authorized Site source; read AGENTS.md, README.md and existing tests. Do not equate Site session screenshot with actual deployed code. Check B625 malformed selection and the chosen 146 Pxx-E business rows vs deferred E groups, but do not edit the Sheet or make PO decisions.

**Deliver:** Provenance ledger {repo,remote,branch,commit,Site project/build,URL,access,confidence}; current behavior inventory with Verified Source / Browser-Verified / Unknown; full missing-evidence list; suggested test routes per P ID and component. **AC-EX00:** every source pairing has proof or explicit Blocked, no code writes, task receipt only if actually dispatched.

## EX-01 — Foundations / shared UI / visual tokens (SĐD-01/02/04)

**Precondition:** G0 Source pin + G1/G2/G3 approvals. **Owned files (subject to actual source audit):** brand-colors.css, brand-type.css, shared.tsx, Header.tsx, navigation.ts, Footer.tsx, i18n-runtime, PageMasthead, route helpers. No second worker touches these concurrently.

**Spec:** semantic brand tokens + A03 “sáng, hiện đại, tinh tế”, typography 5 locales, approved breakpoints, header/sidebar/submenu, route/query/hash/Back, labels, 44x44 internal main icon target, contrast on actual rendered pairs, keyboard/focus, reduced motion shared contract. Keep seven main menu groups and five services, no business functionality expansion.

**Testing:** selected A/B/D source IDs and Pxx-A/B/D matching shared components, T01–T30 route checks. Capture CSS computed, keyboard traces, mobile 320/390/430, 767/768, 1279/1280 and 1440/1920, locale long translations. **Deliver:** PR with grouped diffs, before/after screenshots and QA rows; no code before approvals.

## EX-02 — State & Motion foundation (SDD-03/05)

**Precondition:** Motion T0–T4 and SaveButton semantics explicitly PO-approved; EX-01 shared interface available. **Owned files:** motion.tsx, motion.css, selected animation controllers, shared state primitives. Shared form validation, saved-jobs.ts and useHomeCarousel owned only through one integrator contract.

**Tasks:** Add safe token contract T0=0,T1=120,T2=180,T3=240,T4=320 ms ease-out as *approved*, no default spring; data state commits independent from CSS transitions, callback cancellation, visibility unmount cleanup, ARIA/focus and pointer cancel; implement reduced-motion initial and mid-animation. Apply MI/MS and MO only to existing approved components; no gratuitous animation, no route fade/sort/Undo/hero decoration without separate PO approval.

**Testing:** rapid 3 toggles; duration=0; cancel transition; tab hidden/unhidden; prefers-reduced-motion switch; modal Escape, focus; automated test for state final; DevTools trace and labeled video. **Deliver:** reusable controller/measurements and motion state matrix by source MI/MO/MS, independent reviewer evidence.

## EX-03 — B2B Home/Services/F01 (SDD-07)

**Precondition:** EX-01 & EX-02 stable; B2B selected page codes P01/P03–P08/P37 confirmed and page-E feature gate resolved. **File ownership:** Home.tsx, HomeHero.tsx, ServicesPages.tsx, service styles, Contact.tsx via designated single form owner. Do not share Contact.tsx with EX-05 concurrently.

**Tasks:** preserve hero film length/content/aspect, two CTA during play and end, failure poster; service detail URLs, B2B context and F01/F02 form mode; validation with four F01 required fields and six optional; DEMO receipt only. Do not invent company achievements/legal agreement or real communication.

**Test:** Home poster/play/paused/ended/fallback with B2B CTA, direct anchor, reload and Back; from service to F01; fill incomplete/valid; no input loss on mobile keyboard, locale; reduce/interrupt. **Exit:** B2B journey screenshots+video and exact SHA; no backend/API/marketing expansion.

## EX-04 — B2C Jobs/Saved/Careers (SDD-08)

**Precondition:** EX-01 state/route contract + EX-02 interaction semantics + explicit optional gates. **Files:** JobsPages.tsx, jobs-data.ts, jobs.css, saved-jobs.ts, CareersSections.tsx; avoid concurrent edits to shared Header/Contact/i18n with other owners.

**Tasks:** search across current mock fixtures with IME, combine KCN/type/shift, empty/reset, closed MD005 no Apply, job detail→F03, F04 optional CV, save/unsave and stable badge, keyboard, touch. Optional Undo MI02-4 and salary sort MI03-4 are explicitly held unless whitelisted by PO; no data sync with login.

**Test:** synthetic closed/open jobs, phone/keyboard, rapid toggle then Saved Jobs removal, correct focus, counted IDs; invalid/valid F03/F04 and receipt; 5 locale long text, viewport matrix. **Deliver:** tests/QA log/PR/preview, flags for deferred options.

## EX-05 — Editorial/Admissions/Consultation/ADMIN (SDD-09/10/11)

**Separate workers only with disjoint source files:** A: AboutPage/Partners/EditorialPages; B: Education/Consultation; C: AdminDemo and privacy/terms. Any shared router/locale/form work must be queued for EX-01 or integrator, never independently overwritten. Use selected P02/P20–P31; P32–P35/P38; P36/P39/P40.

**Tasks:** history/profile anchors, editorial lists/filter/Back, media rights labels, rails pause; F05/F06 program/mode, metadata-only file, F02 time draft; ADMIN tab/CSV/reset and mock scope disclaimers. Preserve synthetic data and no production authentication or true booking.

**Test:** each source P/T code with source QA rows and real browser replay, reduced motion; track long content, aria, keyboard, responsive and 5 languages. **Deliver:** 3 self-contained diff/review packages, no claims that model assets are authentic.

## EX-06 — Reviewer P41 (BLOCKED until source audit)

**Ownership:** tool /duyet.html or equivalent *only after* EX-00 produces verified source and PO authorizes changes. Sheet references public/duyet.html but file absent in currently checked GitHub prototype. If source is in another project, do not copy it without validating ownership. Proposed tests: 8 pages×3 widths 390/820/1440, page/w query reload, same-origin iframe, toolbar keyboard/focus and Open new tab. Custom widths need separate approval.

**Exit:** Either linked verified source/test evidence or BLOCKED; never create a duplicate reviewer as an assumed repair.

## EX-07 — Independent QA & evidence / integration

**Preconditions:** actual task/branch/preview and approved scope. QA agent must not approve its own unreviewed changes. **Tasks:** compare approved selection→SDD→AC→PR, run targeted unit tests and browser E2E, replay B2B/B2C M01–M07 and full selected route matrix, verify no excluded code sneaked in. Touch/keyboard/IME/long locales, reduced-motion, 0ms/cancel, media error, direct/back/reload, error/success/empty/disabled.

**Evidence contract:** exact SHA, Site URL, CSS viewport/device/OS/browser, locale, starting state, action, expected/actual, screenshot and video/trace, severity, Pass/Fail/Blocked/Not Run, independent reviewer/date. Old v23/v24 screenshot and DOM tests do not count as current build Pass. PR can only be merged after Project Owner's separate sign-off.

**Deliver:** acceptance report mapped to all original QA-<code> IDs and full trace matrix, defect register, regression records, explicit list of deferred/excluded codes.

## Dispatch contract / reusable wrapper

**Only when Project Owner approves execution:**

"Bạn là Codex executor trong môi trường WebMinhDuc (nếu được truy cập và xác nhận). Trước khi thao tác, kiểm tra repo Kenbinhoainam/WebMinhDuc, working directory, branch, HEAD SHA, Git status, AGENTS.md, README.md, đúng Sites source commit và bộ MDU-SDD được phê duyệt. Phạm vi chỉ gồm [approved original IDs] và component files đã gán. Nếu source SHA không khớp hoặc cần quyết định chưa có, dừng ở báo cáo Blocked, không sửa code. Chỉ tạo branch Sprint riêng sau khi đã được cấp quyền; không chuyển dữ liệu cá nhân/secret/văn bản khách hàng nội bộ lên public repo. Viết test cho màn hình, trigger, trạng thái, interruption, keyboard/touch/reduced-motion như AC; thực thi QA tại viewport thực và đính kèm ảnh/video/trace; báo commit/PR/task ID thật hoặc nói rõ chưa có. Không merge, deploy hoặc mở rộng production."

**Current status at authoring:** No Codex task created; no implementation code modified, no PR issued for this upgrade, no deploy and no additional cost action requested.
