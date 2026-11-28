# MDV2 — P1: VISUAL REFERENCES & BENCHMARK COMPARISON (`VISUAL-REFERENCES.md`)

**Ngày đối chiếu:** 28/11/2026  
**Mục tiêu:** So sánh trực quan giữa sản phẩm hiện tại (**MDV2 Sprint 2**), bản live GitHub Pages (`prototype@19ac2b3`), và chuẩn tham chiếu khách hàng **REF-UI-01 (`https://minhduccorp.com.vn/`)**, kèm ghi chú bối cảnh HR2B / SuccessHRVN.

---

## 1. Trạng thái truy cập các nguồn tham chiếu

| Nguồn | URL / Nguồn | Trạng thái truy cập | Bằng chứng thu được |
|---|---|---|---|
| **MDV2 Local Sprint 2 Build** | `http://127.0.0.1:4173/WebMinhDuc/` (từ `848458ea`) | **Truy cập đầy đủ** trên Chrome thật | 41/41 trang, 5 viewport, 5 ngôn ngữ; 58 ảnh chụp khi kiểm tra (**21 ảnh tiêu biểu** + `audit_metrics.json` + 1 video `.webm` lưu trong `docs/audit/mdv2-p1/evidence/`) |
| **MDV2 Live GitHub Pages** | `https://kenbinhoainam.github.io/WebMinhDuc/` (`prototype@19ac2b3`) | **Truy cập được** (HTTP 200) | Ảnh Desktop `1440×900` & Mobile `390×844` + DOM/CSS metrics |
| **REF-UI-01 (Khách hàng chọn)** | `https://minhduccorp.com.vn/` | **Truy cập được** (HTTP 200) | Ảnh full-page & above-the-fold Desktop `1440×900` & Mobile `390×844` + DOM/CSS metrics |
| **ChatGPT Sites Review v10** | `https://minhduc-sprint2-approved-review.kenbinhoainam.chatgpt.site/` | **HTTP 401 (Blocked Auth)** | Không đăng nhập được từ VM kiểm thử; không giả nhận đã xem |
| **HR2B & SuccessHRVN** | `docs/flagship/*`, `docs/master/05-sdd-successhrvn-review.md` | **Nghiên cứu tài liệu** | Đối chiếu quyết định giao diện và nghiệp vụ B2B đã ghi nhận |

---

## 2. Đối chiếu trực tiếp: REF-UI-01 (`minhduccorp.com.vn`) vs MDV2 (`848458ea`)

### 2.1. Chỉ số đo đạc trực tiếp trên trình duyệt Chrome

| Tiêu chí đo | REF-UI-01 (`minhduccorp.com.vn`) | MDV2 (`WebMinhDuc` Home `/`) | Nhận xét thiết kế |
|---|---|---|---|
| **Chiều cao trang Desktop (`1440px`)** | `5.088 px` | `6.721 px` (+32%) | MDV2 bị kéo dài do khoảng cách section rộng và form F01 cao 2 nhóm fieldset trên trang chủ. |
| **Chiều cao trang Mobile (`390px`)** | `6.781 px` | `7.887 px` (+16%) | MDV2 mobile kéo rất dài khi cuộn qua tất cả khối. |
| **Header Desktop (`1440px`)** | `80 px`, trong suốt, chữ trắng sạch | `80 px`, trong suốt, nền gradient tối nhưng **logo chữ xanh đậm `#183653`** | REF-UI-01 giữ tương phản logo/menu nhất quán; MDV2 bị tối logo + đè lên watermark video. |
| **Header Mobile (`390px`)** | `80 px`, phủ lên ảnh Hero | `72 px`, nền trắng tách riêng phía trên video 16:9 | MDV2 mobile (theo quyết định v16) đọc chữ/nút rõ ràng, nhưng logo video bên dưới vẫn lặp lại logo header. |
| **Body Font / Size / Line-height** | `Helvetica Neue` · `16px / 24px` | `Roboto` · **`14px / 21px`** (Desktop Home) vs `16px` (Subpages) | REF-UI-01 đồng nhất `16px`; MDV2 Home bị thu nhỏ vì rule `:root { font-size: 1vw }`. |
| **Thẻ H1 trên trang chủ** | **Không có (`0` H1)** — lỗi SEO/a11y của REF-UI-01 | Có `<h1>` (`28.8px` trên Home, `60.48px` trên subpages) | MDV2 làm đúng ngữ nghĩa SEO/a11y; KHÔNG sao chép lỗi thiếu H1 của REF-UI-01. |
| **Hero Above-the-Fold** | Full-bleed toàn chiều rộng, logo trung tâm + khẩu hiệu + nút cuộn xuống | Video 16:9 kẹp giữa 2 dải đen `#0e1b2d` hai bên + dải H1/2 CTA trắng bên dưới | REF-UI-01 cho ấn tượng tập đoàn vững chãi ngay khung hình đầu; MDV2 trông như khung player nhúng. |
| **Ảnh hỏng (`naturalWidth=0`)** | `0 / 133` | `0 / 30` (sau cuộn) | Cả hai đều tải ảnh ổn định khi cuộn qua trang. |

### 2.2. Những bài học Flagship cần học từ REF-UI-01 (áp dụng cho bản sắc Minh Đức Vina)
1. **Bố cục Hero tập đoàn có chiều sâu kiến trúc (`ref_minhduccorp_desktop_1440_top.png`):** Toàn màn hình không bị viền tối hai bên, điểm nhấn thương hiệu đặt có chủ đích, không để hai logo xuất hiện cùng lúc trong một khung.
2. **Nhịp điệu khối Giới thiệu & Năng lực (`ref_minhduccorp_desktop_1440_full.png`):** Dùng thanh nhấn dọc thương hiệu (`border-left`), văn bản súc tích đặt cạnh 2 thẻ truy cập nhanh trực quan (`LỊCH SỬ HÌNH THÀNH`, `HỒ SƠ NĂNG LỰC`), thay vì để đoạn văn nhỏ bên trái + ảnh tròn rời rạc bên phải như `P01_d1440_after_scroll_full.png`.
3. **Tin tức 3 cột có trọng tâm:** REF-UI-01 dùng cột giữa lớn nổi bật (`TIN NỔI BẬT`) kẹp giữa 2 cột phụ gọn gàng, giúp mắt đọc tự nhiên hơn cách xếp 1 banner ngang phía trên + 3 cột văn bản phía dưới của MDV2.
4. **Footer doanh nghiệp đa chi nhánh cân đối:** REF-UI-01 xếp logo chính giữa trên cùng, bên dưới chia lưới đều các văn phòng theo cột ngang sạch sẽ, không chèn nút CTA đỏ chói vào cột liên hệ.

### 2.3. Những điểm MDV2 đang làm TỐT HƠN REF-UI-01 (Cần giữ vững)
- Có đầy đủ `<h1>`, `skip-link`, ARIA landmark, thuộc tính `lang` cho 5 ngôn ngữ, nút `Pause/Stop` cho mọi rail chuyển động và `prefers-reduced-motion` (nhiều vùng chữ trắng trên ảnh tối ở REF-UI-01 như `TIN CÔNG TRÌNH` có độ tương phản kém).
- Tập trung đúng vào **2 hành trình chuyển đổi thực dụng** (B2B `Gửi nhu cầu nhân lực` & B2C `Tìm việc / Lưu việc / Tuyển sinh`), thay vì chỉ mang tính giới thiệu thụ động.

---

## 3. Vai trò nghiên cứu bổ sung: HR2B & SuccessHRVN

- **HR2B (`docs/flagship/reference-v13-review.md`, `Doi-chieu-41-trang.csv`):** Đã cung cấp khung cấu trúc 41 trang, thanh header trong suốt chuyển kính sáng, và nhịp trang dịch vụ/tin tức. **Điểm tồn đọng cần rút bỏ:** MDV2 vẫn giữ sót 3 PNG `Solution-Icon-1/2/3.png` của HR2B trong `ServiceShowcase`, 19 đường dẫn ảnh `/mirror/www.hr2b.com/` trong `media-manifest.json`, và thói quen bo góc/style cũ trong `info.css` & `contact-reference.css`.
- **SuccessHRVN (`docs/master/05-sdd-successhrvn-review.md`):** Xác nhận hướng cải tiến B2B trọng tâm (SDD-01..SDD-05): phân biệt rõ cung ứng vs cho thuê lao động, quy trình 4–6 bước gắn trách nhiệm, thu gọn tùy chọn F01 hợp lý, và minh chứng có nguồn rõ ràng thay cho con số demo không nhãn.

---

## 4. Thư viện bằng chứng trực quan đã ghi nhận (Desktop vs Mobile & Tương tác)

Tất cả ảnh dưới đây được chụp trực tiếp trên Google Chrome từ `848458ea`, `prototype@19ac2b3` và `minhduccorp.com.vn`:

| Nhóm đối chiếu | Tệp bằng chứng | Điểm cần quan sát |
|---|---|---|
| **REF-UI-01 Desktop vs Mobile** | [Desktop 1440](docs/audit/mdv2-p1/evidence/screenshots/ref_minhduccorp_desktop_1440_top.png) · [Desktop Full](docs/audit/mdv2-p1/evidence/screenshots/ref_minhduccorp_desktop_1440_full.png) · [Mobile 390](docs/audit/mdv2-p1/evidence/screenshots/ref_minhduccorp_mobile_390_top.png) | Header trong suốt chữ trắng tương phản tốt, Hero full-bleed không pillarbox, nhịp Giới thiệu có đường nhấn đỏ dọc. |
| **MDV2 Home Hero Desktop vs Mobile** | [Desktop 1440](docs/audit/mdv2-p1/evidence/screenshots/P01_d1440_top.png) · [Mobile 390](docs/audit/mdv2-p1/evidence/screenshots/P01_m390_top.png) · [Live Pages](docs/audit/mdv2-p1/evidence/screenshots/live_pages_home_desktop_1440_top.png) | **Logo kép đè nhau ở góc trái trên**, chữ logo tối chìm trên gradient đen, viền tối pillarbox hai bên desktop. |
| **MDV2 Hero Ended & Full Scroll** | [Hero Ended 1440](docs/audit/mdv2-p1/evidence/screenshots/P01_hero_ended_d1440.png) · [Full After Scroll](docs/audit/mdv2-p1/evidence/screenshots/P01_d1440_after_scroll_full.png) | Màn kết sáng gọn nhưng dropdown che logo trung tâm; full scroll lộ counter reset về `0+`. |
| **MDV2 Partners, Editorial & News** | [Partners 1440](docs/audit/mdv2-p1/evidence/screenshots/P01_partners_d1440.png) · [Editorial 1440](docs/audit/mdv2-p1/evidence/screenshots/P01_editorial_d1440.png) · [News P20](docs/audit/mdv2-p1/evidence/screenshots/P20_d1440_top.png) | Logo **`TACU` trắng tàng hình trên nền `#eaf4ff`**; Foxconn đóng hộp đen; tin tức lặp ảnh có watermark góc trái. |
| **MDV2 About / Services / Education** | [About P02](docs/audit/mdv2-p1/evidence/screenshots/P02_d1440_top.png) · [Services P03](docs/audit/mdv2-p1/evidence/screenshots/P03_d1440_top.png) · [Education P32](docs/audit/mdv2-p1/evidence/screenshots/P32_d1440_top.png) | P02 crop mất đỉnh chữ bảng hiệu; P32 `/education` làm sáng nhầm active tab `Việc làm` trên Header. |
| **MDV2 Jobs Desktop vs Mobile (JA)** | [Jobs Desktop](docs/audit/mdv2-p1/evidence/screenshots/P09_d1440_top.png) · [Jobs JA Mobile](docs/audit/mdv2-p1/evidence/screenshots/P09_ja_m390_top.png) | Nút lọc phụ tiếng Nhật bị xuống 2 dòng chật; nút chat đỏ nổi góc phải đè icon Bookmark thẻ việc đầu tiên. |
| **MDV2 Contact F01 & Maps** | [Contact Full](docs/audit/mdv2-p1/evidence/screenshots/P37_d1440_full.png) · [F01 Error](docs/audit/mdv2-p1/evidence/screenshots/F01_validation_error_d1440.png) | Input & nút bị ép góc `3px` vuông lệch với pill chung; Maps ghi tên `Cty TNHH MD668 VINA`; link bản đồ cao 32px. |
| **MDV2 ADMIN Desktop vs Mobile** | [ADMIN Desktop](docs/audit/mdv2-p1/evidence/screenshots/P36_d1440_top.png) · [ADMIN Mobile](docs/audit/mdv2-p1/evidence/screenshots/P36_m390_top.png) | Dải nền tối rỗng ~80px chắn ngay dưới header toàn cục trên cả desktop & mobile. |
| **MDV2 P41 Công cụ duyệt** | [P41 Desktop](docs/audit/mdv2-p1/evidence/screenshots/P41_d1440_top.png) | Công cụ duyệt khung 390/820/1440 hoạt động chuẩn. |
| **Screen Recording & Raw Metrics** | [Walkthrough Video (WebM)](docs/audit/mdv2-p1/evidence/video/mdv2-p1-walkthrough.webm) · [Audit Metrics JSON](docs/audit/mdv2-p1/evidence/audit_metrics.json) | Ghi lại luồng Hero hover/scroll/ended → Jobs → Save → F01 validation → ADMIN demo trên Chrome `1280×720` cùng số đo 41 trang. |
