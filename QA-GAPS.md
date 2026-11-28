# MDV2 — P1: QA GAPS & VERIFICATION RECONCILIATION (`QA-GAPS.md`)

**Ngày lập:** 28/11/2026  
**Mục đích:** Đối chiếu trung thực giữa hồ sơ QA Sprint 2 (`SEL-2026.11.27-v1.0.0`), kết quả kiểm thử Chromium PR #12 (`848458ea`), và những khoảng trống thực tế phát hiện trong đợt audit P1. **Không tự công bố đã nghiệm thu.**

---

## 1. Đối chiếu số liệu kiểm thử giữa các mốc

| Mốc / Nhánh | Commit SHA | Số liệu ghi nhận | Giới hạn thực tế còn lại |
|---|---|---|---|
| **Sprint 2 đóng băng (PR #3)** | `66b7603` / `1300df8` | **1.257 mã** trong `RESULT-BY-CHOICE.csv`: **524 Completed** (`187` trên `66b7603` + `337` đối chiếu lịch sử), **617 Incomplete**, **116 Blocked**. | Chỉ kiểm trong môi trường CI + mô phỏng; bản review ChatGPT Sites không truy cập công khai (`HTTP 401`). |
| **Source Reconciliation + E2E (PR #12)** | `848458ea` | Khớp **545/545** tệp build với `prototype@19ac2b3`; sửa tràn ngang `/news/` 320px; chạy `tests/s2-chromium-e2e.py`: **142/142** responsive (`320–1920px`), **50/50** 5-locale, B2B/B2C/MD005/Back-Forward/P41/Hero ended/reduced-motion PASS; 11 bộ Node/JSDOM suite PASS. | `RESULT-BY-CHOICE.csv` **chưa chấm lại** (`524/617/116` giữ nguyên); `s2-chromium-e2e.py` chưa kiểm F04/F05/F06/Consultation/ADMIN filters/CSV/motion-interrupt, và có dòng `input[name='headcount']` (bị bỏ qua vì tên trường thực tế là `quantity`). |
| **P1 Full UI/UX Audit (Đợt này)** | `848458ea` + Live `prototype@19ac2b3` + `minhduccorp.com.vn` | Kiểm trên **Google Chrome thật**: toàn bộ **41/41 trang `P01–P41`**, 5 viewport, 5 ngôn ngữ, kiểm ảnh sau cuộn, kiểm contrast/tap-targets/headings, chụp 58 ảnh kiểm tra (**21 ảnh tiêu biểu** + `audit_metrics.json` + **1 video `.webm`** lưu trong repo), đối chiếu trực tiếp `REF-UI-01`. | Chưa thay đổi mã nguồn giao diện; phát hiện **nhiều lỗi thị giác & i18n mới** mà bộ test tự động trước đây bỏ sót (xem Mục 3). |

---

## 2. Phân rã 733 mã chưa đóng từ `RESULT-BY-CHOICE.csv` (`617 Incomplete + 116 Blocked`)

### 2.1. Nhóm `617 Incomplete` cần Frontend + QA xử lý
1. **`Frontend + Browser QA` (298 mã):** Cần chạy và lưu bằng chứng màn hình/trạng thái ở `390/1440` và các mốc sát breakpoint (kể cả `P01` hero playback/ending trên 5 ngôn ngữ, dịch vụ, tuyển sinh, tin tức/sự kiện).
2. **`Frontend + Functional QA` (229 mã):** Luồng đầy đủ chưa replay tự động cho từng mã dòng (ví dụ: chi tiết F04/F05/F06 với lỗi/cancel file picker, `Consultation` đổi giờ giữ nháp, `ADMIN` filter/CSV/reset/CMS, P39/P40).
3. **`Frontend + Motion QA` (52 mã):** Kiểm thử ngắt chuyển động (`open-close-open` 100–200ms, hủy pointer drag, chuyển `prefers-reduced-motion` giữa hiệu ứng, duration=0, kiểm chứng FPS/CLS trace theo `AC-MOT-CORE-01..04`).
4. **`Frontend + Browser QA + Device QA` (37 mã):** Bằng chứng từ headless Chromium trên desktop chưa thay cho điện thoại thật (bàn phím ảo OS, xoay màn hình ngang/dọc, file picker hệ điều hành).
5. **`Frontend + Accessibility QA` (1 mã — `MS02-4`):** Kiểm tra nghe trực tiếp bằng trình đọc màn hình (AT audio) cho các vùng `aria-live` / `role="status"` khi đổi kết quả, lưu việc, lỗi form, biên nhận.

*(Lưu ý từ `QA-RESULTS-ANTIGRAVITY.md`: trong 617 mã Incomplete trên, có **80 mã không thể tự động hóa hoàn toàn trong headless Chromium**: **69 mã** thiết bị vật lý thật, **9 mã** trình đọc màn hình AT audio, **2 mã** thử nghiệm nhận thức người dùng thật).*

### 2.2. Nhóm `116 Blocked` cần Project Owner / UX Research / Thiết bị quyết định
- **`PO / UX research` (70 mã):** Thử nghiệm người dùng thật độc lập (khả năng phân biệt 5 giải pháp dịch vụ, hiểu bộ lọc 8 tiêu chí, đọc hồ sơ năng lực, hiểu tính chất mô phỏng trên `/partners`).
- **`Project Owner` (30 mã):** Quyết định sản phẩm đang mở: `DEC-01..10`, `ROW625`, `P41-B1/C2` (8 vs 13 lựa chọn công cụ duyệt), `T22` (toast lưu việc cũ), `MI02-4` (Undo bỏ lưu), `MI03-4` (sort thu nhập), `MO05-1` (fade route), `MO08-2` (trang trí hero ended), `MS01-4` (spring motion), `P38-F2` (đưa giờ hẹn vào payload ADMIN), `F08`/`F12`/`P27–P29-E3/E4` (nội dung/upload/lịch thật).
- **`Project Owner / QA` (13 mã):** Pháp lý P39/P40, xác nhận hành vi thu gọn TOC `<details>` ở mọi độ rộng (`P21–P26-D1`), cổng phê duyệt `SCOPE-E` (`P03/P08/P20/P30/P36`).
- **`Device QA` (3 mã — `CS-D05-1`, `D03`, `D11`):** Kiểm tra thực địa iOS Safari & Android Chrome thật.

---

## 3. Lỗ hổng mới phát hiện qua Audit P1 (Bộ test trước đây chưa bắt được)

1. **Lỗi thị giác cần mắt người / screenshot check mới thấy:**
   - Va chạm 2 logo góc trên trái Hero desktop + logo Header mất tương phản (`P01_d1440_top.png`).
   - Dải tối rỗng `~80px` dưới Header tại `/admin-demo` ở cả desktop và mobile (`P36_d1440_top.png`, `P36_m390_top.png`).
   - Logo `TACU` chữ trắng tàng hình trên nền xanh nhạt `#eaf4ff` (`P01_partners_d1440.png`).
   - `AnimatedNumberGroup` reset về `0+ / 0+ / 0+ / 0%` khi rời viewport hoặc cuộn nhanh (`P01_d1440_after_scroll_full.png`).
   - `SupportTools` che icon Bookmark ở thẻ việc làm đầu tiên trên mobile `390px` (`P09_ja_m390_top.png`).
   - Ảnh masthead `/about-us` và `/contact` cắt ngang bảng hiệu; `/news` lặp watermark góc; `P32` `/education` làm sáng tab `Việc làm` trên Header; Google Maps ghi tên `Cty TNHH MD668 VINA`.
2. **Lỗi i18n động & Fragment chưa bị `audit-i18n.mjs` bắt:**
   - `audit-i18n.mjs` chỉ quét HTML tĩnh sau prerender và bỏ qua danh sách ngoại lệ, nên không bắt được:
     - `KCN ...` (`JobsPages.tsx:87`) và tên dịch vụ trong biên nhận F01 (`Contact.tsx:145`) lọt qua React Fragment không được dịch.
     - 6 hồ sơ mẫu `MD-001..006` và câu CMS mặc định trong `AdminDemo` không có bản dịch khi mở modal/tab CMS ở 4 ngôn ngữ.
     - Collision giữa `jobs.json` và `contact-admin.json` làm `'Đã đóng'` biến thành "Hoàn tất" ở `ko`/`ja`.
     - 4 nút Pause carousel viết cứng tiếng Việt.
3. **Khoảng trống kiểm thử đo lường hiệu năng & môi trường chưa truy cập:**
   - **Lighthouse / Core Web Vitals (LCP, CLS, INP):** Chưa có báo cáo đo lab cố định (CPU throttle / Fast 4G) hoặc dữ liệu người dùng thật (RUM) cho video Hero (`19.75 MB` MP4), chunk JS/CSS và lazy images trên `/careers` (nơi 3 ảnh cuối dải ngang vẫn ở trạng thái `complete: False` sau khi cuộn dọc).
   - **ChatGPT Sites Review v10 (`https://minhduc-sprint2-approved-review.kenbinhoainam.chatgpt.site/`):** Trả về `HTTP 401` khi kiểm từ VM → chưa xác minh trực tiếp khác biệt (nếu có) giữa bản đóng gói Sites v10 và bản build từ `848458ea`.
   - **Thiết bị thật & Trình đọc màn hình (AT):** Mọi kiểm chứng trong đợt P1 thực hiện trên Google Chrome headless (Ubuntu Linux) mô phỏng viewport/touch/reduced-motion; **chưa thay thế kiểm thử trên iPhone (iOS Safari), Android Chrome thực tế và VoiceOver/NVDA**.
   - **Triển khai GitHub Pages & Source Drift trên nhánh `prototype`:** Nhánh `prototype@19ac2b3` hiện chứa artifact Sprint 2 ở thư mục gốc nhưng `src/` vẫn là Sprint 1 v30 (PR #12 `feat/s2-reconcile-and-complete` đã xử lý đồng bộ nguồn này nhưng vẫn đang ở trạng thái Draft PR chờ PO duyệt merge).

---

## 4. Điều kiện tiên quyết đề xuất trước khi triển khai sửa giao diện

1. **Project Owner chốt phương án nguồn (`PR #12` & `PR #9`/`#11`):** Hợp nhất hoặc định tuyến nhánh phát triển UI từ nền `src/` Sprint 2 đã đối chiếu (`848458ea`) để tránh sửa nhầm trên `src/` v30 cũ ở `prototype`.
2. **Project Owner chọn phạm vi trong `TOP-20-IMPROVEMENTS.md`:** Xác nhận rõ các mục sửa lỗi bắt buộc (`P0`/`P1`) và các đề xuất thiết kế mới (`IMP-01`, `IMP-02`, `IMP-09`, `IMP-11`, `IMP-13`, `IMP-16`, `IMP-18`, `IMP-19`) trước khi lập SDD cập nhật và giao file ownership cho các agent.
3. **Bổ sung cổng QA bắt buộc cho đợt triển khai kế tiếp:** Mọi cải tiến UI sau khi code phải vượt qua (a) visual regression screenshot so sánh trước/sau ở `390px` & `1440px`, (b) kiểm tra 5 ngôn ngữ kể cả modal/biên nhận động, (c) kiểm tra `T0–T4` & interruption motion, và (d) tái kiểm tra trên thiết bị vật lý + screen reader đối với 80 mã chưa tự động hóa.
