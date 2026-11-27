# MASTER → CODEX CLOUD — EXECUTE APPROVED UI UPGRADE
## Task ID: MD-S2-UI-UPGRADE-SEL-2026.11.27-v1.0.0
## Project: Website Minh Đức V2 · Priority: Flagship UI/UX · Language: Vietnamese
## Approval: Project Owner 27/11/2026 — approved eligible implementation of MDU-SDD-v1.0.0 based on SEL-2026.11.27-v1.0.0

Bạn là Senior Frontend/Accessibility Engineer kiêm SDD Orchestrator được giao thực thi **đầy đủ các hạng mục ĐÃ CHỌN, ĐỦ ĐIỀU KIỆN** thuộc bản đóng băng SEL-2026.11.27-v1.0.0. Quyền lần này bao gồm: tạo nhánh làm việc, sửa mã nguồn đúng đặc tả, tự sửa lỗi/hồi quy thuộc phạm vi, chạy kiểm thử, chuẩn bị preview **riêng** và PR/diff để PO review. Không sửa production, không merge/ghi đè gh-pages hoặc website đích, không làm chức năng vượt phạm vi hoặc giao dữ liệu thật.

### 0. Nguồn bắt buộc đọc TRƯỚC thay đổi
Repository: https://github.com/Kenbinhoainam/WebMinhDuc
- Đọc AGENTS.md, README.md, package.json, .openai/hosting.json, relevant source/tests trước khi sửa.
- Đọc **toàn bộ** thư mục docs/sdd/SEL-2026.11.27-v1.0.0:
  - README.md, manifest.json;
  - MDU-SDD-v1.0.0.md (13 SDD), MDU-TRC-v1.0.0.md (full code→component→QA), MDU-PLAN-v1.0.0.md, MDU-DEC-v1.0.0.md, MDU-EXEC-BRIEF-v1.0.0.md;
  - data/*.jsonl gồm tất cả chọn, không chọn/để sau/chưa chọn, DX chỉ tham khảo, routes.
- Original Google Sheet: https://docs.google.com/spreadsheets/d/1u6JuI6X3t_wpgrxia16DXbCHzIRn0KbG_KymygTbGEg/edit . Chỉ đọc nếu có quyền. Dữ liệu JSONL trong GitHub là snapshot khóa; **không áp tự động** các thay đổi Sheet sau mốc chốt.
- Target preview reference: https://minhduc-sprint1-ui-review.kenbinhoainam.chatgpt.site/
- Environment ưu tiên: WebMinhDuc **chỉ khi chính bạn xác minh được đang dùng đúng repo, checkout, Sites project và quyền**. MASTER hiện không trực tiếp giao task được; không tuyên bố task đã thực thi trước khi có task ID thực tế.

### 1. W0 — Preflight / Source-of-truth bắt buộc
1. Thu thập: pwd, git remote -v, git status, branch, HEAD SHA, repository ID, AGENTS.md, runtime, package scripts, project Sites ID, deployment/build ID, URL truy cập và audience. Ghi evidence.
2. GitHub nhánh prototype có HEAD tham chiếu khi soạn tài liệu: 08e2da46106b51537b871aea3880fc94b25da935 (v30). Sheet nói UI Review tương ứng commit bc0610e208b35d7b2e65c7a4fc3819a3d5a00b91; SHA này chưa truy xuất được qua GitHub. **Không mặc định chúng là cùng một bản**.
3. Nếu repo/Sites có source mới: diff file/component/behavior; kế thừa thay đổi hợp lệ và điều chỉnh kế hoạch phạm vi kỹ thuật. Chỉ trình lại nếu phát sinh feature/budget/scope hoặc thay đổi quyết định thiết kế cần duyệt. Nếu chưa thể xác minh đúng Site, tạo blocker SRC-01, tiếp tục phân tích/kiểm thử độc lập trên GitHub đã kiểm chứng, không thay thế source Site không rõ bằng bản khác rồi giả nhận là đã nâng cấp Site.
4. Sheet có 1.257 dòng Chọn: 1.256 mã nguồn hợp lệ + dòng Chọn từng trang!B625 sai mã, lưu provisional ROW625-P01-A-UNRESOLVED (khả năng P01-A1). **Không tự sửa mã ID nguồn**; giữ một blocker row 625 và tiếp tục các mã hợp lệ.
5. Đọc JSONL theo nguyên trạng, không đếm 246 DX là mục Chọn. So sánh nguồn live (nếu đọc được) với freeze, xuất selection-delta-after-freeze.md cho thay đổi sau chốt, không tự thêm scope.

### 2. Phạm vi và các gate bắt buộc
- Thực hiện những mã Chọn có dữ liệu/component tồn tại và đủ điều kiện thuộc Pxx-A/B/C/D/F; common A/B/C/D/F; CS-A/B/C/D; MI/MO/MS; T01–T30. Một mã có thể đã đạt yêu cầu: giữ nguyên code và **chỉ đánh dấu Completed nếu đã có test/bằng chứng cùng build**.
- Không chọn: 8 mã P01/P02-E, 30 CS (gồm 28 CS-E và CS-A01-3, CS-B08-3). Để sau: E01–E15. Chưa chọn: CS-B08-4. Không khởi tạo tác vụ implementation của chúng.
- **146 mã Pxx-E được Chọn nhưng xung đột với E chung Để sau và CS-E Không chọn.** Chỉ cải thiện UI/QA của hành vi mock đang có và có thể chứng minh từ source; tính năng nghiệp vụ mới, conversion funnel, form rules mới, marketing, CMS production, tích hợp real phải ghi Blocked-Scope và đề nghị quyết định riêng. Không xóa các mã này khỏi ma trận.
- Lựa chọn có điều kiện: Undo việc lưu (MI02-4), sắp xếp thu nhập (MI03-4), fade route (MO05-1), hiệu ứng màn kết tùy chọn (MO08-2), spring (MS01-4), lightbox ngoài album hiện hữu, P41 khi chưa tìm được source. Giữ “Selected, Conditional/Blocked” cho tới khi điều kiện được xác nhận; không tự phát triển mới.
- Design defaults trong đặc tả: nhận diện sáng, hiện đại, tinh tế nhưng giữ logo/assets; Motion T0=0ms, T1=120ms, T2=180ms, T3=240ms, T4=320ms (T4 chỉ nếu approved), ease-out; ưu tiên nút save có accessible label ổn định và aria-pressed. Nếu source/lựa chọn không tương thích dẫn tới đổi scope, ghi decision và dừng chỉ component đó, không dừng toàn bộ việc hợp lệ.
- Giữ 7 nhóm menu/14 mục con, 5 locale VI/EN/ZH/KO/JA, 5 dịch vụ, 6 biểu mẫu, F01 4 bắt buộc, F03 name/phone/job code, F04 CV optional; file mock tối đa 3 ×5MB/tổng15MB. Luôn phân biệt ứng viên/hồ sơ/thanh toán/lịch hẹn **mô phỏng** với production. Giữ noindex và dữ liệu/asset có quyền.

### 3. Git và chia agent không đè file
- Handoff branch đã chuẩn bị: sprint-2/approved-ui-upgrade-sel-20261127-v1; tạo **một nhánh triển khai riêng** (ví dụ feat/s2-ui-upgrade-sel-20261127-v1) từ commit handoff đã xác minh, trừ khi nguồn Sites hợp lệ yêu cầu cách tách khác. Không force-push, không ghi đè worktree chưa commit. Dùng PR về nhánh phù hợp; giải thích merge-base.
- W1 FIRST: shared semantic tokens/color/type/spacing, Header/Nav/Router, focus/ARIA, responsive/i18n, motion engine/interrupt handling. Một owner duy nhất cho shared.tsx, motion.tsx, Header.tsx, Contact.tsx và catalog i18n; worker khác không được sửa đồng thời.
- W2 B2B: P01,P03–P08,P37, HomeHero, 5 Services, F01/F02 và CTA/fallback.
- W3 B2C: P09–P19, Jobs/Details/Saved/Careers, F03/F04 và closed MD005, IME/filters.
- W4: P02/P20–P31 Content/Editorial/Partner; P32–P35/P38 Education+Consultation F05/F06; P36/P39/P40 ADMIN mock/privacy/terms; P41 chỉ sau source verification. Các worker W2/W3/W4 chỉ song song khi shared API ổn định và file ownership không xung đột.
- W5: nâng motion theo các component đã duyệt, independent QA và regression. Motion reliability/reduced-motion phải được kiểm ngay mỗi wave, không để tới cuối mới làm.
- Nếu nhiều agent, lập file ownership bảng và giao rõ từng agent; agent reviewer độc lập với tác giả code.

### 4. Motion & microinteraction contract cho mọi component
- Trigger: hover/focus/pressed, tap, keyboard Enter/Space/Escape, form validation, card remove, filter change, menu/modal/accordion, video play/pause/end/error, carousel auto/manual, visibility, route.
- Feedback: state (aria-pressed/expanded/selected/invalid, data, focus) cập nhật không chờ transition; dùng motion tokens trong phạm vi đã duyệt. Không thêm loading giả, rung form, bounce/spring mặc định, animation che nội dung hoặc layout shift.
- Rapid/interrupt: open–close–open, click 3 lần, đổi tab/route/locale trong animation, transitioncancel/duration 0, callback cũ/unmount/tab hidden; chỉ **ý định hợp lệ cuối** thắng cho UI có thể đảo. Không tự hủy một giao dịch mock đã xác nhận.
- Keyboard/focus/touch: cùng thao tác cùng kết quả, không hover-only, pointer cancel không ghost-click, focus-visible/unobscured, modal Escape và focus restoration, input IME không mất dữ liệu.
- Reduced motion lúc tải và bật giữa hiệu ứng: bỏ spatial/stagger/autoplay không thiết yếu; thông tin, CTA, manual controls, validation và receipt vẫn đủ. Pause tự chạy do user quyết định không bị tự resume.
- Chi tiết per-ID phải lấy **cột F–L/Q của JSONL motion**, KHÔNG chỉ nhìn bảng tổng hợp.

### 5. QA và tự sửa lỗi
- Build + tests dựa trên scripts hiện có trong package.json: npm ci, npm run build và các script liên quan (test, test:sprint, test:review, test:seo, test:hydration, test:motion, test:header, audit:i18n...) **chỉ chạy lệnh tồn tại**, ghi raw logs/SHA. Nếu yêu cầu browser E2E mới, chỉ thêm tooling khi cần trong scope và mô tả dependency.
- Kiểm mobile 320,360,390,430; tablet 768,820,1024; desktop 1280/1440; wide 1920, kèm breakpoint 359/360, 520/521, 639/640, 767/768, 799/800, 999/1000, 1023/1024, 1279/1280/1281 và zoom200%. Thử 5 locale, bàn phím, focus, touch/keyboard ảo nếu thiết bị được phép, reduced-motion và media failures.
- Kiểm trọn B2B Home→Services→F01→DEMO Receipt→ADMIN và B2C Home→Jobs filter→Detail→F03→DEMO Receipt→ADMIN, closed job, save/undo nếu được duyệt, Form F04/F05/F06, date consultation, URL direct/reload/Back. Không gửi CV/số điện thoại/người thật.
- Mọi case: Original ID, SDD, QA, URL, commit, locale, CSS viewport, OS/browser, start state, trigger/steps, expected/actual, Pass/Fail/Blocked/Not Run, severity, evidence ảnh/video/trace. Khi Fail, sửa trong phạm vi, chạy lại ca lỗi và regression liên quan. Không gọi stub/jsdom/screenshot là kiểm thử thật trên thiết bị.
- Bắt buộc có kết quả **từng mã Chọn** với Completed / Incomplete / Blocked; một component có thể xử lý nhiều mã nhưng phải ghi từng mã. Những mã đã đạt từ trước phải có evidence "existing behavior verified", không bỏ qua.

### 6. Preview, PR và handoff bắt buộc
- Tạo **preview riêng** có URL truy cập và phiên bản, không ghi đè Sites đích/gh-pages. Nếu có workflow Sites chính thức, dùng workflow đó với quyền tương ứng. Không dùng cách vượt login/audience. Nếu bị hạ tầng chặn, ghi chính xác BLOCKED_PREVIEW, logs và phương án hợp lệ; không bịa URL.
- Lưu tài liệu chạy trong docs/sdd/.../execution/: SOURCE-BASELINE.md, IMPLEMENTATION-LOG.md, RESULT-BY-CHOICE.csv, QA-RESULTS.md, DEFECTS.md, SELECTION-DELTA.md, PREVIEW-RELEASE.md, FILE-OWNERSHIP.md.
- Dùng PR/diff để PO review, **không merge/deploy đích** trước khi được phê duyệt riêng. Giữ các thay đổi hợp lệ có trước; giải thích conflicts và backports.
- Kết thúc chỉ khi các mục đủ điều kiện đều Verified Complete hoặc được ghi Blocked có lý do và next owner; không cắt ngang vì số lượng lớn. Không đòi PO duyệt lại các chỉnh sửa kỹ thuật thông thường đúng spec; chỉ báo khi scope/design/new feature thay đổi.

### 7. Trả lời MASTER bằng chứng thực tế
Xuất một báo cáo ngắn gọn duy nhất gồm: actual environment + task ID, Site source→repo SHA, implementation branch/HEAD/PR, preview URL có thể truy cập, số mã Complete/Incomplete/Blocked, các mã/tác vụ Blocked hoặc không được chọn, QA counts và link screenshot/recordings/logs, code regressions đã sửa, quyết định PO còn mở. Không tuyên bố thành công nếu thiếu URL hoặc task receipt thực tế.

**BEGIN NOW only through your verified Codex Cloud environment. This prompt itself is not a dispatched task and should not be treated as evidence of execution.**
