> GOVERNANCE UPDATE 2026-11-27: Project Owner has approved MDU-SDD-v1.0.0 based on SEL-2026.11.27-v1.0.0 for execution of the valid, in-scope, selected UI improvements. The previous “PROPOSED/NOT IMPLEMENTED” label in this historical v1.0.0 document refers to its pre-approval state. Conditional new features, invalid source ID B625, Site-source mismatch, and deferred/excluded selections remain gated; see README and CODEx task prompt. This is NOT production scope or automatic deployment permission.

# MDU-SDD-v1.0.0 — Đặc tả nâng cấp Website Minh Đức

**Snapshot 27/11/2026, 17:20 GMT+7. Status: PROPOSED / AWAITING PO.** Nguồn Sheet có 1.257 dòng Chọn, 1.256 mã hợp lệ và mã tạm ROW625-P01-A-UNRESOLVED. Full per-item acceptance và ghi chú có trong các phụ lục đóng băng nguồn. Không cấp phép sửa mã nguồn.

**Bằng chứng hiện trạng:** GitHub repository Kenbinhoainam/WebMinhDuc, branch prototype, HEAD 08e2da46106b51537b871aea3880fc94b25da935 (v30); các file AGENTS.md, README.md, HomeHero.tsx, Contact.tsx, JobsPages.tsx, ServicesPages.tsx, motion.tsx và routes đã kiểm tra. UI Review Site công bố commit bc0610e208b35d7b2e65c7a4fc3819a3d5a00b91 nhưng commit đó không truy xuất được từ GitHub hiện tại; Site không được trình duyệt kết nối xác thực. Do đó hiện trạng UI thực tế là NOT VERIFIED. Không dùng mô tả Sheet hoặc ảnh nghiên cứu cũ làm kết quả Pass.

**Cấp độ lựa chọn:** 907 dòng trang (một mã lỗi), 157 chuyên sâu A–D, 88 Micro & Motion, 75 tiêu chí A/B/C/D/F, 30 Neo/trạng thái. E chung E01–E15 được Để sau, 28 CS-E Không chọn; riêng 146 mã trang E vẫn Chọn và cần cổng phê duyệt MDU-SDD-13. Giữ nguyên trường hợp loại trừ P01-E1..E4, P02-E1..E4, CS-A01-3, CS-B08-3; CS-B08-4 chưa chọn.

**Giới hạn:** chỉ prototype dữ liệu mô phỏng và UI đã có, không tự mở rộng backend, CMS thật, API AI, email/Google Sheets/CRM, dữ liệu ứng viên, giá hoặc production scope; không tự thêm tính năng để tạo cơ hội dùng motion. Duyệt đặc tả rồi mới lập task code.

## MDU-SDD-01 — Design system, brand và typography

**Mã nguồn:** A01–A15, CS-A được chọn (51), các mã Pxx-A, ngoại trừ CS-A01-3 Không chọn và P01-A? chưa xác minh mã. **Áp dụng:** P01–P41 khi có component tương ứng: logo, Header, Footer, Hero, PageMasthead, Button, thẻ dịch vụ/việc làm, media, forms.

**Hiện tại xác minh:** GitHub v30 chứa brand-colors.css, brand-type.css, flagshipvisual.css, shared components. Chưa xác minh CSS computed trên Site UI Review. Ghi chú của người chọn tại A03: “Hệ màu nhìn sáng, hiện đại, tinh tế”.

**Mục tiêu:** semantic tokens cho nền sáng/tối, màu CTA/trạng thái, text, border, spacing/radius, cỡ chữ theo vai trò; không thay logo/đối tác hoặc tự dời việc làm lên đầu do CS-A01-3 đã không chọn. Ảnh giữ đúng chủ thể, nội dung mẫu được phân biệt với số liệu thật. Không đồng nhất trang đọc dài với trang danh sách nếu gây mất công năng.

**Trạng thái:** default/hover/focus/pressed/disabled, header trên video/sau cuộn, nền sáng/tối, lỗi/form, số liệu demo, 5 ngôn ngữ, zoom200%.

**Phụ thuộc:** duyệt bảng màu và bản sắc, quyền sử dụng media, CSS computed của build được pin.

**AC-VIS-01:** P01/P03/P09/P32/P36/P37 ở 390×844 và 1440×900: ảnh trước/sau cùng URL/scroll/state, logo/CTA/section/crop và lưới đúng bản mẫu thiết kế đã duyệt. Không tự đổi thành một chủ đề không có trong nguồn.
**AC-VIS-02:** đo cặp chữ/nền thực từ trình duyệt; chữ thường ≥4,5:1, chữ lớn đúng định nghĩa ≥3:1, ghi ngoại lệ, hover/focus/disabled và opacity. Trạng thái không chỉ thể hiện bằng màu.
**AC-VIS-03:** ở 320/390/768/1440, VI/EN/ZH/KO/JA với chữ dài, zoom200%: không cắt dấu tiếng Việt/CJK, nhãn/focus và logo không méo. Chưa đánh giá một lượt ảnh là WCAG đạt toàn website.

## MDU-SDD-02 — Navigation, cấu trúc nội dung, route/query/hash

**Mã nguồn:** B01–B15, CS-B được chọn (30), Pxx-B, T01–T30; liên quan MI08/MO01/MO05. **Áp dụng:** Header/menu 7 nhóm, 14 mục con, Footer, Breadcrumb, URL 5 ngôn ngữ, deep link, filter query, form mode và các neo.

**Hiện tại xác minh:** navigation.ts, Header.tsx, App.tsx, src/seo/routes.ts và i18n-runtime tồn tại. Sheet ghi cấu trúc 40 trang + 1 công cụ duyệt, 30 neo/trạng thái, nhưng các thao tác trực tiếp trên Site chưa được chạy.

**Mục tiêu:** một lối rõ cho mỗi nội dung; liên kết đúng loại button/link; direct/reload/back/forward giữ ngữ cảnh hợp lệ (lọc việc, sự kiện, trang, form F01/F02, F05/F06) và focus đích không bị header che. Link ngôn ngữ chuyển đến đúng nội dung tương ứng, không tự tăng cấp menu.

**Trạng thái:** menu open/closed; submenu expanded; route active; query hợp lệ/không hợp lệ; hash trực tiếp; back/forward/reload; focus và locale dài.

**Phụ thuộc:** trang/alias được duyệt, baseline trực tiếp Site, xác nhận URL quy tắc F01/F02 và deep links.

**AC-NAV-01:** 390/1440, từ Home→Services→labor-supply→F01 và Home→Jobs→detail→F03; một tap/Enter đúng đích, breadcrumb/tiêu đề chính xác, Back khôi phục điểm đọc và focus hợp lý.
**AC-NAV-02:** T01–T30, mở URL/query/neo trực tiếp, reload rồi Back/Forward: trạng thái hợp lệ và không xuất hiện màn trống; query sai có fallback được ghi. Mỗi T có QA-Txx trong phụ lục.
**AC-NAV-03:** Tab/Shift+Tab/Enter/Space/Escape, focus visible, không bị che; link có accessible name, hành vi trên touch không đòi hover; 5 locale dùng đúng href và nhãn.

## MDU-SDD-03 — Interactive feedback & state management

**Mã nguồn:** C01–C15, CS-C được chọn (44), Pxx-C (154), MI01–MI08 (32). **Áp dụng:** Button/link, SaveButton, JobBoard filter, F01–F06, file metadata, ngày/giờ, menu/tab/accordion và thông báo.

**Hiện tại xác minh:** Contact.tsx có F01/F02, draft riêng và validation; JobsPages.tsx/saved-jobs.ts, Consultation.tsx, AdminDemo.tsx và demo-submissions.ts tồn tại. Site hiện tại chưa được test click/focus. Không gọi mọi đề xuất là lỗi đã xảy ra.

**Mục tiêu:** focus và nhãn ngay, một lệnh hợp lệ tạo một hành động; pressed/expanded/selected/invalid và data state đồng bộ; lỗi xuất hiện sau lần gửi đầu, lỗi sửa được cập nhật mà không xóa nháp; các thao tác đảo trạng thái dùng ý định mới nhất. Không giả lập loading nếu dữ liệu ngay lập tức sẵn. Không chặn việc gửi lần thử mới chỉ vì đã có một biên nhận cũ.

**Trạng thái:** idle/hover/pressed/disabled/focused; saved/unsaved/storage unavailable; filter empty/invalid; form pristine/invalid/pending mock/success/retry; file list picked/canceled/removed/error; appointment selected/edit/complete; menu open/closed.

**Phụ thuộc:** MDU-SDD-02 route state, motion engine SDD-05, quy tắc được duyệt cho Undo, salary sort, form/phone.

**AC-INT-01:** MI01, hover/focus/pressed trên CTA link/job; nhấn Enter, Space, tap cùng một chức năng; pointer cancel không tạo hành động thứ hai.
**AC-INT-02:** MI02, lưu/bỏ lưu hai mã việc nhanh, badge/label/icon và ID đúng, không nhân đôi, xóa khỏi Saved Jobs chuyển focus đến thẻ hợp lệ. Undo là lựa chọn có điều kiện, chưa tự triển khai.
**AC-INT-03:** MI03, gõ tiếng Việt/CJK qua IME, dán từ khóa, gỡ chip, reset empty state: giá trị/caret ổn định, query mới không bị ghi đè bởi kết quả cũ. Salary sort cần duyệt tính năng riêng.
**AC-INT-04:** MI04, F01–F06 thiếu bắt buộc: chỉ lỗi đúng ô sau submit, focus lỗi đầu, sửa ô không xóa trường hợp lệ; trường tùy chọn trống ở trạng thái trung tính.
**AC-INT-05:** MI05, F04/F06 chọn/đổi/xóa metadata tối đa 3 file (5MB/file, 15MB tổng), cancel giữ danh sách; không upload thật hoặc giả thanh tiến độ.
**AC-INT-06:** MI06, đổi ngày/giờ và mode F01/F02 hay F05/F06, giữ nháp đúng chế độ, chỉ một lựa chọn hiệu lực; không tạo lịch hẹn thật.
**AC-INT-07:** MI07, gửi mẫu lặp chỉ tạo một biên nhận trong cùng lượt; lỗi có thể sửa/thử lại, New attempt reset có chủ đích và không ghi dữ liệu thật.
**AC-INT-08:** MI08, menu/tab/accordion/tooltip có trạng thái ARIA rõ, keyboard/touch tương đương, Escape đóng đúng lớp; không chỉ có hover để thao tác.

## MDU-SDD-04 — Responsive, a11y và 5 ngôn ngữ

**Mã nguồn:** D01–D15, CS-D được chọn (32), Pxx-D (153), T states và MS02/MS03. **Phạm vi:** 40 trang nội dung, P41 nếu tìm được source; mọi responsive components, input trên mobile, bảng ADMIN.

**Hiện tại xác minh:** CSS responsive và i18n catalogs tồn tại trên GitHub; chưa kiểm computed styles/visual/touch của Site bc061. Các mốc breakpoint lấy từ Sheet, không giả định đạt mọi thiết bị.

**Mục tiêu:** breakpoints theo nội dung; không tràn ngang toàn trang (bảng chỉ cuộn trong container có nhãn); sticky header/toast không che focus, keyboard ảo không chắn nút form; bản dịch dài được reflow; language switch giữ path/query/hash phù hợp; VI fallback có nhãn nếu chưa có bản dịch; trạng thái error/success/empty cũng được dịch.

**Trạng thái/test widths:** 320, 360, 390, 430, 450, 520/521, 639/640, 767/768, 799/800, 999/1000, 1023/1024, 1279/1280/1281, 1440, 1920 CSS px, zoom200%, portrait/landscape, virtual keyboard open, reduced motion.

**Phụ thuộc:** Site access, matrix browser/device được PO chốt, các mã hóa i18n/permission liên quan.

**AC-RWD-01:** Header, Hero, cards/jobs filter, education form, ADMIN table ở các điểm gãy thực và 390/1440: không cắt CTA/nhãn, đúng thứ tự đọc, focus không khuất; nếu bảng cần cuộn ngang phải chỉ trong bảng có nhãn.
**AC-RWD-02:** trên iOS Safari/Android Chrome thực hoặc device service, mở keyboard trong F01/F03/F06, lỗi hiện dưới trường và nút cuối vẫn cuộn tới được.
**AC-RWD-03:** chuyển VI/EN/ZH/KO/JA ở các route P01/P03/P09/P32/P36/P37; query/neo vẫn có ý nghĩa, status/error/receipt phù hợp hoặc có fallback VI có nhãn.
**AC-RWD-04:** mục tiêu tương tác nội bộ là 44×44 CSS px cho nút icon chính, không gán nhầm là ngưỡng tối thiểu AA chung; mọi lớp chuyển động cho kết quả tương đương khi reduce.

## MDU-SDD-05 — Motion tokens, micro/motion design và điều kiện ngắt

**Mã nguồn:** toàn bộ 88 MI/MO/MS Chọn, CS-C03/CS-C09/CS-D03 và các Pxx liên quan. **Hiện tại xác minh:** src/motion.tsx (RevealFrame/MotionController), HomeHero.tsx (media states), useHomeCarousel.ts và PartnersStrip.tsx có trong GitHub; thời lượng/kết quả tương tác trên Site chưa test.

**Bộ token xin duyệt:** T0=0ms cho trạng thái/nhãn/focus/error; T1=120ms ease-out cho màu viền/pressed/badge; T2=180ms cho panel/accordion/crossfade nhỏ; T3=240ms cho modal/drawer/reveal; T4=320ms chỉ cho điểm nhấn lớn được duyệt. CS-C03-1 còn đề xuất 200ms panel: **đề nghị dùng T2/T3 thay một token 200ms thứ sáu**; người duyệt quyết định. Không bật spring mặc định dù MS01-4 được Chọn: chỉ mẫu riêng nếu PO phê duyệt.

**Quy tắc bắt buộc:** chức năng cập nhật ngay, không đợi CSS animation hoặc transitionend; có thể hủy mọi hiệu ứng; UI đảo trạng thái theo ý định hợp lệ mới nhất; callback và các lượt xử lý cũ không thể phủ state mới. Không hủy giao dịch/biên nhận hợp lệ chỉ vì đổi focus. Ưu tiên opacity/transform khi đo phù hợp, không dùng will-change toàn site; giữ tỷ lệ media/placeholder để không gây xô bố cục. Giảm chuyển động từ đầu hoặc giữa chừng phải bỏ translate/zoom/auto-scroll không thiết yếu mà vẫn thấy đủ nội dung và focus.

**AC-MOT-CORE-01:** đổi mở–đóng–mở trong 100–200ms trên menu, modal, accordion và filter: trạng thái cuối đúng lần cuối, không lớp ẩn chặn click; thử duration=0 và hủy transition.
**AC-MOT-CORE-02:** focus/keyboard/touch/pointer cancel trên tất cả control, aria-expanded/pressed/selected hiển thị ngay, không cần hover; Escape trả focus, Tab không chạm nội dung đang ẩn.
**AC-MOT-CORE-03:** bật reduce trước tải rồi bật giữa reveal/carousel/hero; nội dung và CTA còn đầy đủ, carousel không tự khởi động lại trái với ý người dùng.
**AC-MOT-CORE-04:** performance trace của animation được chọn ghi FPS/layout shift/layer/CPU theo máy thử; không tự cam kết CLS≤0,05 hoặc timing interaction chưa duyệt. Mỗi trong 22 nhóm MI01–MI08/MO01–MO08/MS01–MS06 có acceptance riêng ở bảng tiếp theo.

## MDU-SDD-06 — Engineering, SEO/media và demo operations

**Mã nguồn:** F01–F15, Pxx-F (155), các mục CS-D06/D07/08 về nguồn tài nguyên/i18n. **Hiện tại xác minh:** React/Vite, prerender, i18n 5 ngôn ngữ, metadata/noindex và suite tests tồn tại trên GitHub prototype; Site UI Review chưa được pin commit tương ứng; không có bằng chứng API backend production.

**Mục tiêu:** build tái lập, shared components không duplicate, noindex/nhãn mock giữ nguyên, fallback video/ảnh/bản đồ usable, không tạo JobPosting schema cho job giả, metadata/canonical/hreflang đúng nguồn thực, đánh giá CWV trong điều kiện đo. Không triển khai Next.js/Spring Boot/CMS/Redis/Meilisearch chỉ từ mong muốn production. Không thêm secrets/analytics PII/real uploads.

**Trạng thái:** cold/cache, offline/media blocked, locale route invalid, 404, synthetic fixture reset, reduced motion, data saver, preview audience.

**AC-ENG-01:** pin một SHA thực, chạy npm ci, build, test scripts phù hợp và ghi raw logs; kết quả cũ không được tự thay thành Pass cho commit mới.
**AC-ENG-02:** kiểm metadata/link/robots trên các locale và 404 bằng raw HTML và browser, tránh tuyên bố dữ liệu demo là thật.
**AC-ENG-03:** trước/sau media/typography đo LCP/CLS/lab trong CPU/network/cache cố định, log tương tác khi đo INP; ảnh tĩnh không đủ làm kết quả.
**AC-ENG-04:** khi video/iframe/map/ảnh/font thất bại, giữ poster/address/CTA/copy link theo nguồn, không che hoặc hứa tính năng ngoài demo.

## MDU-SDD-07 — B2B Home/Services/Contact F01

**Source IDs:** P01, P03–P08, P37; shared components HomeHero, ServicesPages, Contact, SupportTools. Page E selections are subject to SDD-13. **Current source verified:** GitHub v30 has HomeHero poster/play/paused/ended/fallback, 5 service routes, F01/F02 with drafts and mock receipt. Site UI Review interactions are not independently verified.

**Target:** Two role CTAs always accessible during hero playback and ending; 16:9 media when playing; service page and CTA preserve service context; F01 required contact, phone, location, note, remaining planning fields optional; mock receipt is labeled DEMO, no real lead routing.

**States:** poster/play/pause/end/error, CTA, service selection, F01/F02 mode, error/success/draft, narrow/long locale, mobile keyboard, toast overlay.
**Dependencies:** pin Site build, content ownership, URL contract and no extra unapproved business logic.

**AC-B2B-01:** At 390/1440 from home (playing/ended) and /services/labor-supply, tap/Enter CTA; F01 correctly visible, focused and service context retained; job CTA opens /jobs.
**AC-B2B-02:** At 320/390/768/1440, missing phone/location gives correct field errors, focus first; four valid required fields with 6 optional fields blank yield exactly one DEMO confirmation.
**AC-B2B-03:** Five service URL/breadcrumbs work on keyboard and touch; no unverified legal claim, data/partner metrics clearly marked illustrative.
**AC-B2B-04:** Poster/video/map fallback, reduce and long text never obscure accessible CTA, focus or form entries.

## MDU-SDD-08 — Jobs/Job details/Saved/Careers

**Source IDs:** P09–P19, JobsPages, jobs-data, saved-jobs, CareersSections. **Current source verified:** job fixtures with stable IDs, filtering, save state, F03/F04 demo exist; actual Site click/visual unknown.

**Target:** Same job option matches combined KCN/type/shift filters, IME text stable, empty/reset, route history; closed MD005 cannot receive Apply and has link to open jobs. Save and badge agree; no account sync. F03 requires name/phone/job code; F04 CV optional, files metadata-only. Undo and salary sort remain conditional.

**States:** open/closed, filtered/empty/sorted, saved/unsaved/storage failed, file optional/error, F03/F04 invalid/valid/demo receipt, sticky apply and focus.
**Dependencies:** decide fixed save label+aria-pressed (MI02-1) vs changing label+aria-pressed (CS-C04-1); approve Undo and salary sort separately.

**AC-JOB-01:** P09 filter 3 criteria, IME input, reset and Back at 390/1440 yield correct fixture list and no stale results.
**AC-JOB-02:** Open job→detail→F03 error/valid→DEMO ID; MD005 remains blocked; Back restores meaningful list state.
**AC-JOB-03:** Save 2 IDs, unsave 1 fast; badge/icon/ARIA/ID count exactly matches, focus moves to valid element after removal; Undo tested only if approved.
**AC-JOB-04:** F04 with absent CV is allowed if required fields valid; optional file limits 3×5MB / 15MB, no actual upload.

## MDU-SDD-09 — About/Partners/News/Events

**Source IDs:** P02, P20–P31, AboutPage, PartnersStrip, EditorialPages. **Current source verified:** component and data files exist; source rights, Site visual and interaction unknown.

**Target:** Consistent editorial hierarchy/metadata, profile/history/partners/activity/achievements anchors, reading/Back context for archive→detail, locale/event date semantics, partner/metrics marked mock when not verified; rails pause for focus/hover/user Stop and reduce.

**States:** anchor, list/empty/detail, event past/future, images missing, rail running/paused, focus and 5 locales.
**Dependencies:** permission to publish media/cases; source confirmation for any company number, no CS-B08-3/4 automatic scope.

**AC-EDT-01:** P02 T01–T05 direct/reload/Back and P31 logo links work; unapproved claims are not represented as facts.
**AC-EDT-02:** P20–P30 archive/category→detail→Back returns correct list/filter/focus; date rendering uses agreed VN time and locale.
**AC-EDT-03:** partner/editorial rails can pause and resume manually; no duplicate accessible names from clones; reduce shows all content statically.

## MDU-SDD-10 — Admissions and consultation

**Source IDs:** P32–P35/P38, Education, Consultation, Contact. **Current source verified:** separate F05/F06 and date/slot mock controls exist, no actual school registration or meeting booking.

**Target:** Program context persists on query/form mode; F05 and F06 distinct, F06 upload optional metadata, F02 consult edit keeps draft, mock receipt never implies appointment accepted.

**States:** program selection, F05/F06, file choose/cancel/remove/error, date past/valid, hour set/edit/complete, locale.
**Dependencies:** existing time-zone and input rules; no real calendar or server integration.

**AC-EDU-01:** F05/F06 direct URL, reload and Back preserve matching program/mode and separate drafts.
**AC-EDU-02:** F06 with no file can pass; invalid type/size gives clear errors; cancel picker keeps old file list; no upload claims.
**AC-EDU-03:** P38 choose date/slot→F02→Change time returns draft; invalid/past date blocked; confirmation marked simulation.

## MDU-SDD-11 — ADMIN demo, Privacy và Terms

**Trang/source IDs:** P36, P39, P40; AdminDemo.tsx, admin-demo-data.ts, EditorialPages.tsx; Pxx-E page-level items remain under SDD-13. **Đã xem nguồn GitHub v30:** README mô tả sáu hàng đợi giả, CSV mẫu, dashboard demo và CMS không có đăng nhập/phân quyền/backend thật. UI Site trực quan chưa xác minh.

**Vấn đề:** các trạng thái quản trị và kết quả xuất dễ bị hiểu là đã chạy production; tab, filter, modal và reset có nhiều interaction có thể stale khi nhấn nhanh. **Thay đổi mục tiêu:** trạng thái DEMO/phiên rõ ràng; tab và panel tương ứng ARIA; chỉ thao tác fixture, cập nhật owner/status giả; reset có xác nhận và Hủy; CSV chỉ dữ liệu mẫu theo phạm vi lọc được duyệt; không giả sử nối Sheets. Privacy/Terms đọc được, link và locale đúng.

**Trạng thái:** tab A/B, tìm/lọc rỗng và có kết quả, detail modal open/closed, edited status, draft/published giả, duplicate indicator, CSV demo, Reset Hủy/Xác nhận, route locale. **Phụ thuộc:** quyết định API thật ngoài prototype, SDD-02/03/04/05, quy tắc nghiệp vụ O01–O10 chưa chốt cho production.

**AC-ADM-01:** tại P36 ở 390/1440, chọn tab, lọc theo ID/nguồn/trạng thái, mở/sửa bản ghi mẫu rồi đổi tab thật nhanh. Tab selected, panel hiển thị, URL/ngữ cảnh và focus nhất quán; không hiện bản ghi cũ.
**AC-ADM-02:** xuất CSV trên tập đã lọc phải chứa đúng fixture được mô phỏng và có nhãn minh họa; Khôi phục mẫu → Hủy giữ nguyên; Xác nhận reset đúng phạm vi demo, không mất focus hay tạo cuộc gọi thật.
**AC-ADM-03:** P39/P40 có tiêu đề, nội dung, tel/mailto/links hoạt động phù hợp từng locale; không có dữ liệu cá nhân, khóa hay URL nội bộ trong ảnh chứng cứ và tệp xuất.

## MDU-SDD-12 — P41 công cụ duyệt UI (BLOCKED by source)

**Trang/source IDs:** P41-A/B/C/D/E/F; CS-D02-4 và các mục liên quan trong T/MI/MO. **Nguồn Sheet:** công cụ /duyet.html có 8 trang và 3 khung giả lập 390/820/1440 px, tham số page và w. **GitHub prototype v30:** không tìm được public/duyet.html. Site UI Review cần quyền tương tác và mã commit bc0610e… cũng không truy xuất được. Do đó **NOT VERIFIED**, không được tự coi thiếu code là lỗi của đúng deploy.

**Mục tiêu khi nguồn được xác minh:** mở đúng 8 trang, đổi khung mà giữ URL/canvas hiện hành theo quy tắc nguồn, hiển thị kích thước CSS và tỷ lệ thu nhỏ, iframe có title và điều khiển bàn phím, mở tab đang xem đúng URL; custom viewport chỉ khi PO cho phép.

**Trạng thái:** page/width valid và invalid, iframe loaded/blocked, toolbar focus/keyboard, deep link/reload/Back, resize host/window. **Phụ thuộc:** Site project/branch/commit và file gốc chính xác; không tạo reviewer thay thế khi chưa duyệt.

**AC-REV-01:** xuất trình đường dẫn source được ghim commit và URL Site đúng /duyet.html. Nếu không chứng minh được thì **Blocked**, không gán Pass/Fail giả.
**AC-REV-02:** 8 trang x 3 khung; chọn trang/width, reload, Back và Mở tab: iframe URL/query tương ứng, title mô tả chính xác, toolbar và phần tử trong iframe tab được.
**AC-REV-03:** mở custom width và kiểm real-device nếu được duyệt; phân biệt iframe giả lập với viewport thiết bị thật, không lấy screenshot một mình làm kết luận touch/keyboard.

## MDU-SDD-13 — Cổng xung đột Chọn E theo trang và hoãn E toàn cục

**Nguồn và trạng thái chính xác:** E01–E15 tại tab Tiêu chí A-F là **Để sau**; 28 CS-E là **Không chọn**; **146 Pxx-E chi tiết là Chọn**, còn P01-E1…E4 và P02-E1…E4 **Không chọn**. Đây là xung đột phân lớp chọn lựa, không được mất bất kỳ trạng thái nào.

**Đề xuất quyết định thống nhất:** giữ selection=Chọn cho cả 146 Pxx-E, lập đặc tả và kiểm thử những giao diện demo **đã tồn tại**, nhưng gắn implementation gate cho mỗi mục. Nếu làm phát sinh tính năng mới, trạng thái nghiệp vụ, marketing funnel, backend/API, thời gian/chi phí hay số liệu tuyên bố, phải PO duyệt riêng sau đánh giá tác động. Các mục phủ định/các CS-E đã loại trừ không được tự phục hồi qua trùng lặp. Phân loại từng Pxx-E: (1) hoàn thiện UI mock đã có, (2) chức năng mock mới, (3) mở rộng kinh doanh/marketing, (4) production integration.

**Trạng thái:** selected-for-review / gate-pending; no approved business scope. **Phụ thuộc:** chốt precedence và whitelist mã E, dữ liệu giả/giới hạn môi trường.

**AC-SCOPE-01:** đủ 146 Pxx-E có mã nguồn dòng, trang/component và QA-Pxx-Ey trong traceability; không xóa hoặc tự duyệt hạng mục.
**AC-SCOPE-02:** các P01/P02-E bị Không chọn và CS-E không chọn không phát sinh công việc; các lựa chọn cấp trang muốn thay đổi nghiệp vụ phải có decision ID.
**AC-SCOPE-03:** không có ứng tuyển/hồ sơ/CRM/Sheets/AI/SMS/email/analytics PII/tự công bố số liệu thật qua việc Chọn trên bảng; production cần thỏa thuận ngoài SDD UI.

**Xung đột điều kiện khác cần quyết định:** CS-A01-3 và CS-B08-3 Không chọn, CS-B08-4 Chưa chọn; MI02-4 Hoàn tác, MI03-4 sắp xếp thu nhập, MO05-1 route fade, MO08-2 hiệu ứng màn kết và MS01-4 spring đã Chọn nhưng có điều kiện mở rộng, không mặc định thực thi.

## Motion Topic Acceptance Matrix — 22 nhóm / 88 mã nguồn Chọn

Các đặc tả hợp nhất bên dưới không thay thế từng câu chữ ở [phụ lục Motion đóng băng](https://chatgpt.com/space/page_0bb082ba03108191aef0b014c6f9d021). Mỗi chủ đề 4 mã -1…-4, QA-<mã nguồn> vẫn là tiêu chí gốc. Trigger / feedback / token / ngắt / focus / touch / reduced motion phải được kiểm cho từng component tồn tại thật. Không tự thêm widget chỉ để có motion.

| Original IDs / AC | Trigger, response và token | Ngắt/liên tiếp và thiết bị nhập | Reduced motion / kết quả nghiệm thu |
| --- | --- | --- | --- |
| **MI01-1…4** · AC-MOT-01 | Hover/focus, pressed, disabled trên button/link; **T1 màu; T0 viền focus** | Pointer hủy không kích hoạt; click/Enter/Space đúng một lần; keyboard/touch đều cho hành động tương đương | Không dịch chuyển; trạng thái/focus tức thời; 4 mã QA-MI01-1…4 không được chấm Pass nếu chưa test |
| **MI02-1…4** · AC-MOT-02 | Lưu/bỏ lưu việc, badge, xóa card, hoàn tác tùy chọn; **T1 màu/badge, dữ liệu T0** | Click nhanh đồng bộ ID và badge; xóa chuyển focus; Undo chỉ action mới nhất; keyboard/touch đều cho hành động tương đương | Tĩnh, không nảy icon hoặc dời card; 4 mã QA-MI02-1…4 không được chấm Pass nếu chưa test |
| **MI03-1…4** · AC-MOT-03 | Gõ IME, gỡ chip, reset no results, sort tùy chọn; **T0 dữ liệu, T1 badge, T2 fade kết quả chỉ khi duyệt** | Cancel kết quả truy vấn cũ; giữ caret/focus, sort mới nhất; keyboard/touch đều cho hành động tương đương | Kết quả đổi trực tiếp, không di chuyển các card; 4 mã QA-MI03-1…4 không được chấm Pass nếu chưa test |
| **MI04-1…4** · AC-MOT-04 | Focus input, validation sau submit, sửa lỗi, optional bỏ trống; **T0 lỗi, T1 viền** | Lặp submit không nhân thông báo; sửa giữ nháp, focus lỗi đầu hợp lệ; keyboard/touch đều cho hành động tương đương | Không rung/lắc, label/error luôn có; 4 mã QA-MI04-1…4 không được chấm Pass nếu chưa test |
| **MI05-1…4** · AC-MOT-05 | Chọn/đổi/xóa metadata tệp, lỗi loại/dung lượng; **T1 hàng file, không tiến độ giả** | Hủy picker giữ danh sách; xóa nhanh lấy ID mới, focus đúng tệp; keyboard/touch đều cho hành động tương đương | Tệp hiển thị/xóa trực tiếp, không bay; 4 mã QA-MI05-1…4 không được chấm Pass nếu chưa test |
| **MI06-1…4** · AC-MOT-06 | Chọn ngày/giờ, F01/F02, F05/F06, đổi thời gian; **T0 selected; T1 accent** | Đổi nhanh chỉ giữ mode/slot cuối; draft và focus không thất lạc; keyboard/touch đều cho hành động tương đương | Dấu chọn/tóm tắt tức thì; 4 mã QA-MI06-1…4 không được chấm Pass nếu chưa test |
| **MI07-1…4** · AC-MOT-07 | Submit mock, lỗi, retry, New attempt; **T0 xác nhận, T1 pressed** | Chặn double-submit một lượt; không ghi đè receipt hợp lệ bằng callback cũ; keyboard/touch đều cho hành động tương đương | Biên nhận/tin lỗi luôn có chữ; 4 mã QA-MI07-1…4 không được chấm Pass nếu chưa test |
| **MI08-1…4** · AC-MOT-08 | Menu/tab/FAQ/tooltip hover/focus/tap; **T2 panel nếu phù hợp** | Open-close-open nhanh không giữ lớp cũ; Escape trả focus; keyboard/touch đều cho hành động tương đương | Hiện panel tĩnh, không hover-only; 4 mã QA-MI08-1…4 không được chấm Pass nếu chưa test |
| **MO01-1…4** · AC-MOT-09 | Desktop menu và mobile drawer, submenu; **T2 180 / T3 240** | Đổi menu hủy animation cũ, chỉ drawer hiện chặn nền, đóng trả focus; keyboard/touch đều cho hành động tương đương | Mở/đóng ngay, thứ tự tab đúng; 4 mã QA-MO01-1…4 không được chấm Pass nếu chưa test |
| **MO02-1…4** · AC-MOT-10 | Modal form, existing lightbox, receipt transition; **T2 ảnh / T3 modal** | Escape/đóng luôn giải phóng overlay/focus dù transition bị hủy; keyboard/touch đều cho hành động tương đương | Hiện ảnh/modal/receipt ngay; 4 mã QA-MO02-1…4 không được chấm Pass nếu chưa test |
| **MO03-1…4** · AC-MOT-11 | FAQ, tabs, filter panel; **T2 nếu measured safe** | Thao tác liên tiếp cập nhật panel/aria, không focus nội dung ẩn; keyboard/touch đều cho hành động tương đương | Không đợi height transition; 4 mã QA-MO03-1…4 không được chấm Pass nếu chưa test |
| **MO04-1…4** · AC-MOT-12 | Card hover, saved card remove, filter result, breakpoint; **T1 hover/remove, optional T2 result** | Ghost card và callback cũ không nhận focus/click; không tự animate reflow breakpoint; keyboard/touch đều cho hành động tương đương | Tĩnh/reflow tức thời; 4 mã QA-MO04-1…4 không được chấm Pass nếu chưa test |
| **MO05-1…4** · AC-MOT-13 | Route navigation, Back/Forward, locale; **T2 main fade tùy chọn** | Điều hướng ngay, 3 click đến route cuối, không exit block; keyboard/touch đều cho hành động tương đương | Không fade, nội dung/focus đúng; 4 mã QA-MO05-1…4 không được chấm Pass nếu chưa test |
| **MO06-1…4** · AC-MOT-14 | Scroll reveal, sticky header, mobile CTA, counters; **T3 opacity 0→1/translateY 8→0; stagger 40ms proposal** | Scroll đảo chiều không chớp, focus bảo vệ khối, tab hidden dừng; keyboard/touch đều cho hành động tương đương | Hiện toàn nội dung, không dịch chuyển; 4 mã QA-MO06-1…4 không được chấm Pass nếu chưa test |
| **MO07-1…4** · AC-MOT-15 | Carousel, logo rail, history/testimonial; **Auto rail 22px/s chỉ mẫu; manual transition theo component** | Hover/focus/Stop/tab hidden/modal pause, user pause không tự resume; keyboard/touch đều cho hành động tương đương | Danh sách tĩnh xem được mọi item; 4 mã QA-MO07-1…4 không được chấm Pass nếu chưa test |
| **MO08-1…4** · AC-MOT-16 | Poster/video/hero ending/image; **T2 crossfade, optional T3 end card** | Ended event thật, replay/cancel bỏ fade cũ, CTA không chờ; keyboard/touch đều cho hành động tương đương | Poster/CTA và trạng thái ngay; 4 mã QA-MO08-1…4 không được chấm Pass nếu chưa test |
| **MS01-1…4** · AC-MOT-17 | T0–T4 duration/ease hierarchy; **0/120/180/240/320ms ease-out** | No animation queue; spring không bật mặc định; keyboard/touch đều cho hành động tương đương | T0 chức năng, no spring; 4 mã QA-MS01-1…4 không được chấm Pass nếu chưa test |
| **MS02-1…4** · AC-MOT-18 | Change prefers-reduced-motion, pause loop, avoid flashing; **Remove motion non-essential** | Bật reduce giữa chừng chốt trạng thái hợp lệ; Stop vẫn giữ hiệu lực; keyboard/touch đều cho hành động tương đương | Thông tin và controls đầy đủ; 4 mã QA-MS02-1…4 không được chấm Pass nếu chưa test |
| **MS03-1…4** · AC-MOT-19 | Keyboard/touch/pointer cancel/focus; **Focus T0, decorative T1–T3** | Enter/Space/tap tương đương; pointer cancel không ghost-click; keyboard/touch đều cho hành động tương đương | Trạng thái không phụ thuộc hover; 4 mã QA-MS03-1…4 không được chấm Pass nếu chưa test |
| **MS04-1…4** · AC-MOT-20 | Open-close-open, stale async result, 0ms/unmount; **Interruption from current visual state** | Last intent cho UI đảo; không dựa transitionend; không hủy giao dịch đã commit; keyboard/touch đều cho hành động tương đương | Hoàn tất chức năng dù animation 0ms; 4 mã QA-MS04-1…4 không được chấm Pass nếu chưa test |
| **MS05-1…4** · AC-MOT-21 | Performance/media fallback; **Opacity/transform khi trace xác nhận** | No global will-change, fixed aspect ratio, fallback usable; keyboard/touch đều cho hành động tương đương | Giữ khung và CTA hiển thị; 4 mã QA-MS05-1…4 không được chấm Pass nếu chưa test |
| **MS06-1…4** · AC-MOT-22 | QA inventory/report of motion; **Evidence rather than token demo** | Repeat/cancel/reduce tested with exact SHA, viewport and video; keyboard/touch đều cho hành động tương đương | Pass chỉ khi có hành vi quan sát; 4 mã QA-MS06-1…4 không được chấm Pass nếu chưa test |

**Cross-component motion acceptance:** 390/1440 và breakpoint component, đổi nhanh 3 lần, hủy pointer, focus chuyển giữa modal/tab, click khi video đang phát/kết thúc, tab hidden/visible, duration=0 và giảm chuyển động bật từ đầu/giữa hiệu ứng. Kết quả cuối phải khớp state dữ liệu, không ghost overlay, không fake loading, không màn trống. T4 và spring chỉ khi PO phê duyệt riêng. **Token conflict:** CS-C03-1 có 200 ms panel; đề xuất chốt 180ms T2 hoặc 240ms T3 thay token riêng 200ms.
