# Báo cáo Tiếp nhận, Đối chiếu & Kiểm thử Độc lập — Sprint 2 (Antigravity)

**Ngày thực hiện:** 28/11/2026  
**Nhánh làm việc:** `feat/s2-reconcile-and-complete` (khởi tạo từ `origin/prototype@19ac2b365f2264399fde4312639127b8de80736f`)  
**Phạm vi:** `SEL-2026.11.27-v1.0.0` / `MDU-SDD-v1.0.0` / `MDU-PLAN-v1.0.0`

---

## 1. Kết quả Phase A — Tiếp nhận GitHub Professionalization

- **PR #9 (`chore/8-github-control-center` @ `983c90e523d61da3a6eadb34d50dd1894dd2d639`):** Trạng thái `OPEN` (chưa merge). Không có xung đột tệp với PR #3 (0 tệp trùng lặp).
- **PR #4 (`docs/mdv2-github-control-20261128` @ `3ab94d637db78f9f8d5849a48739c5fde42db10f`):** Trạng thái `OPEN`.
- **PR #3 (`feat/s2-ui-upgrade-sel-20261127-v1` @ `1300df840190ac0ecffa32e576f0c809887e9c64`):** Trạng thái `OPEN`.
- **GitHub Project `MinhDucWeb — Master Control`:** `gh project list --owner Kenbinhoainam` trả về `totalCount: 0` → ghi nhận `BLOCKED_PERMISSION` (không tạo Project trùng).

---

## 2. Kết quả Phase B — Source Reconciliation

- Đã đồng bộ `src/`, `scripts/`, `public/`, `tests/`, `vite.config.ts`, `package.json`, `package-lock.json` từ `1300df8` vào nhánh `feat/s2-reconcile-and-complete`.
- Kiểm chứng build tái tạo: **545 / 545** tệp HTML, JS, CSS, JSON, media trong `dist/` khớp **từng byte (SHA-256)** với bản đang phục vụ trên `prototype@19ac2b3`. Chi tiết xem [SOURCE-RECONCILIATION.md](../../../../SOURCE-RECONCILIATION.md).

---

## 3. Lỗi UI/UX thực tế phát hiện & đã sửa (Phase C & D)

1. **Tràn ngang (Horizontal Overflow) tại `/news/` ở độ rộng `320px`:**
   - **Hiện tượng:** Trên trình duyệt Google Chrome thực tế ở viewport `320×844`, `document.documentElement.scrollWidth` là `341px` (> `320px`). Thanh phân trang `.info-pagination.ed-pagination` không có `flex-wrap: wrap`, khiến nút `Trang trước` (`left: -21px`) và `Trang sau` (`right: 341px`) tràn khỏi khung hình.
   - **Khắc phục:** Bổ sung `.ed-pages .ed-pagination { flex-wrap: wrap; }` trong `src/editorial-reference.css`.
   - **Kiểm chứng lại:** Chạy lại `npm run build` và `tests/s2-chromium-e2e.py` — `overflow_failures: []` (`scrollWidth <= 320` trên toàn bộ 14 độ rộng).

---

## 4. Kết quả kiểm thử độc lập (Phase E & F)

### 4.1. Bộ test `package.json` (Node / JSDOM / SSR / i18n)
Tất cả các script đã chạy thực tế trên nhánh `feat/s2-reconcile-and-complete` và đạt **PASS**:
- `npm test` (`tests/jobs-logic.mjs`)
- `npm run test:seo` (`route-data`, `seo-output`, `preload-output`)
- `npm run test:sprint` (`jobs-sprint1`, `admin-demo`, `admin-interaction`, `education-validation`, `consultation`)
- `npm run test:review` (`reviewer-flows`, `reviewer-locales`, `jobs-headline-locales`)
- `npm run test:catalog` (`catalog-parity`)
- `npm run test:flagship` (`navigation`, `locale-selector`, `partners`, `test:carousel`, `test:motion`, `media`, `image-fallback`, `test:hero`, `flagship-review`)
- `npm run test:sitemap` (`sitemap-destinations`, `sitemap-review`)
- `npm run test:header` (`header-reference`, `header-hover-review`)
- `npm run test:reference` (`reference-structure`, `home-reference-motion`, `info-v13`, `editorial-content`, `editorial-reference`, `home-video-gallery`)
- `npm run test:hydration` (`tests/hydration.mjs`)
- `npm run audit:i18n` (`scripts/audit-i18n.mjs`)

### 4.2. Kiểm thử trình duyệt Google Chrome thực tế (`tests/s2-chromium-e2e.py`)
Chạy trên bản build `dist/` phục vụ qua `vite preview`:
- **Ma trận Responsive (142 lượt kiểm):** Kiểm tra 14 độ rộng (`320, 360, 390, 430, 767, 768, 820, 1023, 1024, 1279, 1280, 1366, 1440, 1920 px`) trên các nhóm trang chính → **142/142 PASS**, `0` overflow, `noindex` đầy đủ.
- **5 Ngôn ngữ (50 lượt kiểm):** Kiểm tra `vi`, `en`, `zh-Hans`, `ko`, `ja` ở `390px` và `1440px` → **50/50 PASS**, đúng thuộc tính `<html lang>`, `0` overflow.
- **Hành trình B2B (`b2b_f01_to_admin`):** `/contact/?form=F01` → gửi rỗng kiểm tra validation (`aria-invalid=true`) → điền hợp lệ → nhận biên nhận DEMO → chuyển qua SPA `<Link>` tới `/admin-demo` → xác nhận hồ sơ xuất hiện trong ADMIN → **PASS**.
- **Hành trình B2C (`b2c_f03_to_admin`):** `/jobs/` → toggle Lưu việc (`aria-pressed`) → `/saved-jobs/` → mở chi tiết việc làm → mở modal F03 → gửi rỗng kiểm tra validation → điền hợp lệ → nhận biên nhận DEMO → chuyển qua SPA `<Link>` tới `/admin-demo` → xác nhận hồ sơ xuất hiện trong ADMIN → **PASS**.
- **Việc làm đã đóng `MD005` (`/jobs/ky-thuat-bao-tri-bac-ninh/`):** Xác nhận không có nút Ứng tuyển đang kích hoạt → **PASS**.
- **Lịch sử trình duyệt & P41:** Kiểm tra `go_back()`, `go_forward()`, `reload()`, và `/duyet.html` (HTTP 200) → **PASS**.
- **Hero Video Ended & Replay:** Đợi `loadedmetadata`, tua tới cuối video, xác nhận sự kiện `ended` hiển thị nút `Xem lại video` → **PASS**.
- **Reduced Motion:** Xác nhận `prefers-reduced-motion: reduce` hoạt động, nội dung và thao tác được giữ nguyên → **PASS**.
- **Lỗi runtime:** `page_errors: []`, `failed_requests: []`.

---

## 5. Giới hạn thực tế & Hạng mục chưa hoàn thành (`NOT_TESTED` / `Blocked`)

Theo phân tích 1.257 mã trong `RESULT-BY-CHOICE.csv`:
- **116 mã `Blocked`:** Thuộc quyền quyết định của Project Owner (`DEC-01..10`, `B625`, `P41` 8 vs 13 lối tắt, v.v.) hoặc thử nghiệm người dùng độc lập (`PO / UX research`).
- **80 mã `Incomplete` không thể tự động hóa trong headless Chromium:**
  - **69 mã** yêu cầu kiểm thử trên **thiết bị vật lý thật** (bàn phím ảo OS, xoay màn hình thực tế, touch/file picker hệ điều hành).
  - **9 mã** yêu cầu kiểm thử **trình đọc màn hình (AT audio)** thực tế.
  - **2 mã** yêu cầu **human comprehension / UX trial** với người dùng thử.
- **Preview & Release (Phase H):** `BLOCKED_PREVIEW` đối với xuất bản công khai/Pages mới vì chưa có phê duyệt của Project Owner để ghi đè `prototype:/` hoặc tạo target preview riêng. Bản build tái tạo được kiểm chứng cục bộ qua `npm run build` + `vite preview`.
