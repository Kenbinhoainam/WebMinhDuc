> GOVERNANCE UPDATE 2026-11-27: Project Owner has approved MDU-SDD-v1.0.0 based on SEL-2026.11.27-v1.0.0 for execution of the valid, in-scope, selected UI improvements. The previous “PROPOSED/NOT IMPLEMENTED” label in this historical v1.0.0 document refers to its pre-approval state. Conditional new features, invalid source ID B625, Site-source mismatch, and deferred/excluded selections remain gated; see README and CODEx task prompt. This is NOT production scope or automatic deployment permission.

# MDU-PLAN-v1.0.0 — Kế hoạch nâng cấp theo SDD

**Ngày:** 27/11/2026, 17:20 GMT+7. **Trạng thái:** DỰ THẢO TRÌNH PO, chưa cho phép triển khai. Nguồn: Sheet chọn UI Review 9 tabs; 1.257 dòng Chọn, trong đó 1.256 ID hợp lệ + 1 ROW625-P01-A-UNRESOLVED. Full original acceptance và mapping lưu tại bộ phụ lục.

**Baseline chưa khóa code:** Site UI Review chỉ khai báo SHA bc0610e… chưa tìm được trong GitHub. GitHub prototype HEAD là 08e2da4… (v30), nhưng không chứng minh là code của đúng Site. P41 /duyet.html chưa tìm được trong repo. Vì vậy tất cả đợt thực thi phụ thuộc G0 xác minh cùng một build.

**Phạm vi:** UI của prototype mock. Không thêm backend, dữ liệu thật, CMS production, AI, CRM, Sheets, giá hoặc public deployment. Demo M01–M07 và D01–D09 đã duyệt là baseline cũ, **không phải phép duyệt 1.257 lựa chọn mới**.

## 1. Phạm vi và tab đã đọc

| Sheet | Ranges | Chọn | Other |
|---|---|---:|---|
| Hướng dẫn | A1:Z17; A18:D60 | — | Quy tắc và motion tokens |
| Chọn từng trang | A7:L922 | 907 | 8 Không chọn; lỗi B625 |
| Tiêu chí A-F | A7:I97 | 75 | E01–E15 Để sau |
| Neo và trạng thái | A7:H37 | 30 | 0 |
| Chuyên sâu A-E | A7:M195 | 157 | 30 Không chọn, 1 Chưa chọn |
| Micro & Motion | A7:Q95 | 88 | 0 |
| Trang và URL | A7:M48 | — | 40 trang + P41 reviewer |
| Nguồn và phạm vi | A7:D62 | — | Commit và scope |
| Đề xuất theo trang | A7:K253 | — | 246 DX gợi ý, không tính thành selected |

**Ghi chú chọn:** A03: “Hệ màu nhìn sáng, hiện đại, tinh tế”; cột ghi chú P/CS/Motion/T đều trống. Giữ mã nguồn P, CS, MI/MO/MS, A–F, T; 246 DX dùng làm liên kết gợi ý, không tự tạo thêm nhiệm vụ.

## 2. Approval gates

| Gate | Điều kiện qua gate | Owner đề xuất | Trạng thái |
|---|---|---|---|
| G0 — Source integrity | Pin Site/project/commit/deploy; xác minh P41; sửa mã B625 | PO + env owner | BLOCKED |
| G1 — Selection precedence | Giải quyết 146 Pxx-E Chọn vs E toàn cục Để sau / CS-E Không chọn; whitelist các option mới | PO | PENDING |
| G2 — Design tokens | Phê duyệt bảng màu/typography, T0–T4, SaveButton và motion optional | PO / UX | PENDING |
| G3 — SDD approval | Duyệt hoặc hoãn từng MDU-SDD-01…13 và AC, không tự nới thương mại | PO | PENDING |
| G4 — Executor & Git | Xác minh Codex WebMinhDuc có quyền, đúng remote/branch/commit, task receipt | Executor / MASTER | NOT VERIFIED |
| G5 — QA acceptance | Tests thực trên pinned build, Pass/Fail/Blocked, evidence; không Blocker | QA độc lập + PO | NOT RUN |

**Hard stop:** W1–W5 chưa được phép sửa code trước G0–G4 tương ứng. Không merge/deploy/tạo task Codex trong bước lập kế hoạch này.

## 3. Đợt W0 — Source freeze, audit và giải quyết xung đột

**Mục tiêu:** đối chiếu GitHub với đúng Site UI Review; kiểm tra route/component/browser state, source SHA, audience, P41 và B625; chốt interpretation cấp E, motion duration và các tùy chọn mới. Dùng phụ lục frozen và full traceability 1.257 dòng.

**Đầu ra:** Source-of-truth map (repo, branch, commit, Site ID, deployed SHA), hiện trạng có trạng thái Verified Source / Need Browser QA, bảng các mã chặn, quyết định PO và baseline SDD được xác nhận.

**Cổng kết thúc:** Không còn nhầm SHA của Site và GitHub; nếu chưa tiếp cận được Site thì W0 ghi Blocked và chỉ cho phép phân tích không phụ thuộc render.

## 4. Đợt W1 — Shared foundations

**SDD:** 01 Visual, 02 Navigation, 03 state, 04 Responsive/I18n, 05 motion engine, 06 technical. **Files gợi ý cần đọc sau phê duyệt:** AGENTS.md, README.md, Header.tsx, navigation.ts, shared.tsx, motion.tsx/.css, brand-colors.css, brand-type.css, i18n-runtime, seo/routes.ts.

**Mục tiêu:** semantic tokens, typography 5 scripts, focus/hover/pressed, menu/query/back, state cancellation, reduced-motion, layout breakpoints; tuyệt đối không thay đổi nghiệp vụ qua component dùng chung.

**Exit evidence:** screenshot so sánh tại 390/1440 + sát breakpoint, unit/interaction tests, keyboard/tab/touch, duration=0 và reduced giữa hiệu ứng; không ghi Pass khi chưa replay thực.

## 5. Đợt W2 — B2B journey & services

**SDD:** 07 + 01–05 shared. **Pages:** P01, P03–P08, P37. **Luồng:** Home video (poster/play/pause/ended/fallback) → 2 CTA → Services → F01. Giữ ngữ cảnh dịch vụ, 4 trường F01 bắt buộc và biên nhận DEMO; 5 service URLs; không viết thêm tuyên bố pháp lý/đối tác không xác minh.

**Dependencies:** G1 page-E, route contract, shared tokens, file ownership ContactForm. **Exit:** video interrupted/reduce, F01 errors, success, Back/Forward/reload, 390/1440 và responsive 320/768/1920, 5 locales.

## 6. Đợt W3 — B2C jobs, careers & saved state

**SDD:** 08 + 03/04/05. **Pages:** P09–P19. **Luồng:** Home/Jobs → tìm/lọc → detail → F03 DEMO → ADMIN mock; SaveButton và Saved Jobs; Careers F04 CV optional.

**Dependencies:** chọn SaveButton semantic model; conditional Undo và salary sort phải có phê duyệt riêng. **Exit:** filter đúng cùng job option, MD005 đóng không Apply, IME, empty/reset, count/save rapid toggle đúng, file metadata và focus; 5 locale.

## 7. Đợt W4 — Nội dung, tuyển sinh, ADMIN và P41

**SDD:** 09 (P02,P20–P31), 10 (P32–P35,P38), 11 (P36,P39,P40), 12 (P41), 13 (E gate). **Scope:** About anchors/partners/editorial/archive, enroll F05/F06, consultation mock, ADMIN mock CSV/reset/rights declaration, privacy/terms; P41 chỉ khi chứng minh file/site tồn tại hoặc PO duyệt tạo riêng.

**Dependencies:** W1 interfaces, source rights, route and content sign-off, exact Site identity. **Exit:** mọi trang trong family đi/Back đúng, không lỗi form, demo không tạo hồ sơ thật; P41 Blocked nếu chưa có source, không tự dựng lại.

## 8. Đợt W5 — Motion integration & independent QA

**Motion:** MI01–08, MO01–08, MS01–06 chỉ trên component tồn tại thực, không tạo hiệu ứng để có thành tích. Token đề xuất T0 0, T1 120, T2 180, T3 240, T4 320 ms ease-out; no spring default. Pause/stop, reduced motion, interrupt, focus là acceptance bắt buộc xuyên các đợt, không chỉ thực hiện sau cùng.

**QA interruption:** open-close-open nhanh; điều hướng 3 link; video ended khi khuất; tab hidden/visible; click khi chuyển carousel; double-submit; số việc đã lưu đồng bộ; modal Escape; route Back/Forward; IME Vietnamese/CJK; bật reduce trước và giữa animation; cancel transition và duration=0.

**Exit:** independent reviewer replay tests trên đúng SHA, bug register, video/trace, re-test; no Blocker trong phạm vi PO duyệt. Không suy kết quả từ ảnh raster cũ.

## 9. Four device classes, breakpoints và bằng chứng tương tác

| Category | CSS viewport | Các điểm thực cần quét | Bằng chứng |
|---|---|---|---|
| Mobile | 320×740, 360×800, 390×844, 430×932 | 359/360, 450, 520/521, 639/640 | Touch, keyboard ảo, CTA, file picker, form |
| Tablet | 768×1024, 820×1180, 1024×768 | 767/768, 799/800, 999/1000, 1023/1024 | Drawer, grid, cards, filter, modal |
| Desktop/laptop | 1280×800, 1440×900 | 1279/1280/1281, zoom200% | Hover/focus, keyboard, rails, video |
| Wide | 1920×1080; optional 2560×1440 | container max-width, hero and article | Overflow, legibility, media crop |

**Device/browser:** Android Chrome, iOS Safari thực hoặc device service cho touch/keyboard/file; desktop Chromium/Edge/Firefox/Safari phù hợp. Check VI/EN/ZH/KO/JA cho route, form, error, loading/empty/receipt; reduced motion ở thời điểm tải và trong animation.

**Record evidence:** Original ID, SDD ID, AC, Site URL, exact commit SHA/branch/build ID, date, device/OS/browser, CSS viewport, locale, fixture, starting state, trigger, ordered steps, expected, actual, screenshot before/during/after, screen recording for animation, focus/ARIA log, performance trace if needed, severity and Pass/Fail/Blocked/Not Run, owner/reviewer. QA độc lập phải đánh giá trên chính build đã ghim; hình tĩnh không thay thế tương tác.

## 10. Conflict and optional decision register

| Case / code | Chính xác nguồn lựa chọn | Decision proposed |
|---|---|---|
| B625 | A625=Chọn; B625=Chọn (invalid code); P01-A2/A3/A4 ngay sau | Tạm ROW625, chỉ đổi sang P01-A1 sau PO/source xác minh |
| Pxx-E | 146 Chọn chi tiết, 15 E chung Để sau, 28 CS-E Không chọn | Chỉ scope polish/QA cho hành vi demo hiện có; feature mới pending whitelist |
| MI02-4 / CS-C11-2 | Chọn nhưng “tùy chọn thêm” | Undo saved job disabled until explicit PO |
| MI03-4 | Chọn nhưng “sau khi phần mở rộng này được duyệt” | Sort thu nhập blocked until separate approval |
| MO05-1 | Chọn route fade như lựa chọn phụ | Defer unless approved |
| MO02-3 | Chọn lightbox transition, chỉ album đang có | Không tự thêm lightbox vào trang khác |
| MO08-2 | Chọn hero ended decoration tùy chọn | Không delay CTA, PO chốt |
| MS01-4 | Chọn spring đề xuất có điều kiện | Default OFF |
| CS-C03-1 vs MS01-1 | CS 120/200, Motion T1/T2/T3 120/180/240 | Đề xuất tokens 120/180/240, cần PO duyệt |
| CS-C04-1 vs MI02-1 | Nhãn Lưu/Bỏ lưu và aria-pressed vs nhãn cố định và aria-pressed | Ưu tiên fixed accessible label + aria-pressed |
| P41 | Source file /duyet.html chưa tìm thấy GitHub v30 | Verify Site project/source before adding work |
| CS-B08-4 | Chưa chọn | Không tự đưa vào triển khai |

**Business/production:** Google Sheets, CRM, real applicant CV, AI, production privacy/retention, cost, SLA and new roles never inferred from UI selections. Quy trình lập ngày/ngày công phải tính sau khi có actual code baseline và PO approval.

## 11. Scope, owners, order — never an automatic dispatch

**Wave sequence:** W0 → W1 shared contract → W2/W3 (can be parallel after shared stability) → W4 disjoint content families → W5 independent QA and motion audit. Shared files such as App/router/Header/ContactForm/i18n catalogs have single assigned owner; two workers must not simultaneously edit them. No fixed deadlines are promised: old demo 24/11 is past.

**Suggested roles:** MASTER spec/orchestration, PO decision, Codex executor only after WebMinhDuc environment and task tool verified, shared FE owner, B2B worker, B2C worker, content/education/admin workers on disjoint files, independent QA and reviewer. Git branch per approved package; PR to be reviewed separately; no auto merge/deploy.

**STOP RULE:** this Page is a proposed plan. No packages may be assigned, code modified, PR merged, Site published or test marked Pass until individual SDD scopes, conflict decisions, exact source SHA, executor route and QA evidence gates have been approved.
