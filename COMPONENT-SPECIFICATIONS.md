# MDV2 — COMPONENT SPECIFICATIONS (`COMPONENT-SPECIFICATIONS.md`)

**Candidate UI SDD Version:** `MDV2-UI-SDD-v2.0.0-CANDIDATE`  
**Ngày lập:** 28/11/2026  
**Nguồn hợp nhất:** `MDU-SDD-v1.0.0` (`SDD-01..11`), `MDV2-UX-01`, `MDV2-FUNC-01`, và P1 Audit (`IMP-01`–`IMP-20`).  
**Trạng thái:** **CANDIDATE_FOR_PO_APPROVAL** *(Không tự tuyên bố DESIGN APPROVED; các mục thiết kế mới chờ PO quyết định trong `DECISION-REGISTER.md`).*

---

## 1. Bảng tổng hợp Shared Components (`CMP-01`–`CMP-15`)

| Mã | Component & Tệp nguồn | Nguồn yêu cầu / P1 | Trạng thái phê duyệt | Mục tiêu thay đổi chính |
|---|---|---|---|---|
| **CMP-01** | `Header` (`src/Header.tsx`, `src/navigation.ts`, `src/sprint-navigation.css`) | `MDU-SDD-02`, `IMP-01`, `IMP-11` | `CANDIDATE_DEFECT_FIX` + `PENDING_PO_DESIGN_APPROVAL` | Sửa tương phản logo trên Hero tối & tránh đè watermark video; tránh dropdown che logo giữa Hero Ended; sửa `/education` không highlight nhầm tab `Việc làm`. |
| **CMP-02** | `LanguageSelector` (`src/i18n.tsx`, `src/LocalFlag.tsx`, `src/locale-selector.css`) | `MDU-SDD-04`, `IMP-19` | `BASELINE_APPROVED` + `CANDIDATE_DEFECT_FIX` | Giữ 5 cờ SVG + tên, giữ path/query/hash khi chuyển; thay SVG tự vẽ bằng `lucide-react` `ChevronDown`/`Check`. |
| **CMP-03** | `HomeHero` (`src/HomeHero.tsx`, `src/hero-media.css`) | `MDU-SDD-07`, `IMP-01`, `IMP-02`, `IMP-10` | `CANDIDATE_DEFECT_FIX` + `PENDING_PO_DESIGN_APPROVAL` | Bỏ ngắt video sau `1px` scroll (chỉ pause khi cuộn `>= 80px` hoặc Hero `< 60%` visible); giảm animation màn kết về `<= 320ms`; phương án xử lý pillarbox & logo kép chờ PO chọn. |
| **CMP-04** | `PageMasthead` (`src/PageMasthead.tsx`, `src/page-system-v18.css`, `src/masthead-photography.css`) | `MDU-SDD-01`, `IMP-13`, `IMP-14`, `IMP-20` | `CANDIDATE_DEFECT_FIX` + `PENDING_PO_DESIGN_APPROVAL` | Chuyển `NotFound` từ `PageHero` sang `PageMasthead`; sửa crop bảng hiệu ảnh thật; giảm lặp `flagship-atrium.webp`; gắn chú thích ảnh minh họa trên `P31`. |
| **CMP-05** | `AnimatedNumberGroup` & `RevealFrame` (`src/motion.tsx`, `src/motion.css`) | `MDU-SDD-05`, `IMP-05` | `CANDIDATE_DEFECT_FIX` | Ngừng reset bộ đếm về `0` khi rời viewport (`rearm` giữ giá trị cuối hoặc chỉ chạy 1 lần mỗi lượt đọc); đảm bảo neo `#about`/`#business-contact` không kẹt ở `opacity: 0`. |
| **CMP-06** | `ServiceShowcase` (`src/ServiceShowcase.tsx`, `src/service-showcase.css`) | `MDU-SDD-07`, `IMP-09`, `IMP-10` | `PENDING_PO_DESIGN_APPROVAL` | Thay 3 PNG HR2B (`Solution-Icon-1..3.png`) bằng `lucide-react`; dịch nút Pause/Play qua `useTranslation()`; giữ rail drag/wheel/button. |
| **CMP-07** | `PartnersStrip` & `PartnerLogo` (`src/PartnersStrip.tsx`, `src/PartnerLogo.tsx`, `src/flagshipvisual.css`) | `MDU-SDD-09`, `IMP-04`, `IMP-10` | `CANDIDATE_DEFECT_FIX` | Gán `data-dark-mark` (hoặc plate nền thống nhất) cho `TACU`; đồng bộ chiều cao/khung 5 logo; dịch nút Pause; bỏ SSR-to-CSR hydration shift (`staticList`). |
| **CMP-08** | `HomeEditorial` & `HomeVideoGallery` (`src/HomeEditorial.tsx`, `src/HomeVideoGallery.tsx`, `src/home-editorial.css`, `src/home-video-gallery.css`) | `MDU-SDD-09`, `IMP-10`, `IMP-13`, `IMP-14` | `PENDING_PO_DESIGN_APPROVAL` | Đồng nhất bo góc thẻ với `--md-radius-lg`; sửa transition `150ms`/`260ms` về `T1`/`T2`; bỏ lặp ảnh dính watermark góc. |
| **CMP-09** | `JobBrowser`, `JobCard`, `SaveButton` (`src/JobsPages.tsx`, `src/saved-jobs.ts`, `src/jobs.css`) | `MDU-SDD-08`, `IMP-06`, `IMP-15`, `IMP-17` | `CANDIDATE_DEFECT_FIX` | Bỏ React Fragment tại `KCN` (`JobsPages.tsx:87`) để dịch đủ 5 ngôn ngữ; giữ nguyên tên KCN khi lọc; nút lọc phụ không gãy 2 dòng xấu ở `ja` `390px`. |
| **CMP-10** | `ContactForm` (`F01`/`F02`) (`src/Contact.tsx`, `src/form-experience-v16.css`, `src/contact-reference.css`) | `MDU-SDD-03/07`, `IMP-06`, `IMP-12`, `IMP-15` | `CANDIDATE_DEFECT_FIX` | Bỏ Fragment tại `receiptService` (`Contact.tsx:145`); bỏ bo góc vuông `3px` trên `/contact`; thống nhất câu lỗi SĐT rỗng; đảm bảo link bản đồ `>= 44px`. |
| **CMP-11** | `ApplicationDialog` (`F03`/`F04`) & `AttachmentPicker` (`src/JobsPages.tsx`, `src/AttachmentPicker.tsx`) | `MDU-SDD-03/08`, `IMP-15` | `CANDIDATE_DEFECT_FIX` | Bổ sung nút `"Tạo đơn thử mới / Thử lại"` trên màn biên nhận `F03`/`F04` giống `F01`/`F02`/`F05`/`F06`; giữ nguyên `AttachmentPicker` 3×5MB/15MB chống mất file. |
| **CMP-12** | `EducationForm` (`F05`/`F06`) & `ConsultationPage` (`src/Education.tsx`, `src/Consultation.tsx`) | `MDU-SDD-10`, `IMP-11`, `IMP-17` | `BASELINE_APPROVED` + `CANDIDATE_DEFECT_FIX` | Giữ F05/F06 + draft/query sync + `Consultation` 2 bước giữ nháp; dọn fallback `Montserrat`/`Arial`. |
| **CMP-13** | `AdminDemo` (`src/AdminDemo.tsx`, `src/admin-demo-data.ts`, `src/admin-demo.css`) | `MDU-SDD-11`, `IMP-03`, `IMP-06`, `IMP-15` | `CANDIDATE_DEFECT_FIX` | Xóa dải tối rỗng `~80px` dưới Header; dịch 6 `sampleRecords` + câu CMS mặc định; thêm nút `"Xóa bộ lọc"`; lưu sửa `MD-001..006` trong bộ nhớ phiên SPA. |
| **CMP-14** | `Footer` (`src/Footer.tsx`, `src/footer-reference.css`) | `MDU-SDD-02`, `IMP-19` | `PENDING_PO_DESIGN_APPROVAL` | Hạ nút `"Đăng ký nhận bản tin"` sang secondary/outline; thêm icon Facebook/Zalo đồng bộ. |
| **CMP-15** | `SupportTools` (`src/SupportTools.tsx`, `src/SupportTools.css`) | `Quyết định v16`, `IMP-08` | `CANDIDATE_DEFECT_FIX` + `PENDING_PO_DESIGN_APPROVAL` | Thay `<b>Z</b>`/`<b>f</b>` bằng SVG vector; bố trí `padding-bottom` hoặc thu gọn trên mobile `320–430px` để không che nút Bookmark hoặc bảng ADMIN. |

---

## 2. Đặc tả chi tiết từng Component & Trạng thái tương tác

### 2.1. `Header` & `LanguageSelector` (`CMP-01`, `CMP-02`)
- **Cấu trúc bắt buộc:** 1 hàng ngang trên desktop (`>= 1280px`) gồm Logo Minh Đức, 7 mục cấp 1 (`Trang chủ`, `Giới thiệu`, `Dịch vụ`, `Việc làm`, `Tuyển dụng nội bộ`, `Tin tức`, `Liên hệ`), 14 mục con 2 cấp mở bằng hover/focus/click, nút Tìm kiếm (`Modal`), Việc đã lưu (badge số + `99+` từ 100), và `LanguageSelector` 5 cờ SVG. Mobile (`< 1280px`) dùng thanh `72px` + Drawer accordion.
- **Trạng thái tương tác:**
  - `top-over-dark-hero` (Home khi video playing/poster): Nền trong suốt có gradient bảo vệ `rgba(12, 27, 48, 0.72)` → `0`; chữ menu trắng `#ffffff`; **logo Header phải chuyển sang bản trắng/viền sáng hoặc nằm trên pill bảo vệ** (hoặc dùng video không watermark góc trái — `DEC-UI-01`).
  - `top-over-light-hero` (Home khi `ended` / `paused` / `fallback`) & `scrolled`: Nền kính sáng `rgba(255, 255, 255, 0.92)` + `backdrop-filter: blur(12px)`, chữ `#183653`.
  - `submenu-open`: Z-index cao hơn nội dung, nhưng chiều cao panel/vị trí trên Home Ended không được che khẩu hiệu & CTA chính; nhấn `Escape` đóng submenu và trả focus về trigger.
  - `active-route`: Gạch chân đỏ `--md-red` chỉ sáng đúng nhóm sở hữu route; riêng `/education*` không được gán active cho `Việc làm` (`DEC-UI-06`).

### 2.2. `HomeHero` (`CMP-03`)
- **Trạng thái:**
  1. `poster` / `playing`: Khung giữ tỷ lệ 16:9 đối với video gốc (`132.13s`, `preload="none"`, `playsInline`, `muted`). Hai bên màn hình rộng (`>= 1440px`) thay vì mảng đen cứng `#0e1b2d` cần phương án nền kiến trúc mờ/gradient có chủ đích (`DEC-UI-02`). H1 + 2 CTA (`Gửi nhu cầu nhân lực`, `Tìm việc`) luôn khả dụng.
  2. `scroll-pause`: **Bỏ ngắt video tại `y > lastScrollY` (`1px`)**. Chỉ gọi `pauseForChoices('scroll')` khi `window.scrollY >= 80` hoặc phần Hero hiển thị `< 60%` trong viewport (`IntersectionObserver`).
  3. `paused` / `ended` / `fallback`: Kích hoạt bởi nút Pause, sự kiện `ended` thật của `<video>`, hoặc `prefers-reduced-motion` / `saveData`. Hiện `.hero-brand-finish` gồm logo tách nền, slogan `"Nhân lực là tài sản"`, mô tả ngắn, 2 CTA chính và nút `"Xem lại video"` / `"Tiếp tục video"`.
  4. `deferred`: Nếu video kết thúc khi người dùng đã cuộn xuống dưới hoặc tab ẩn (`document.hidden`), hoãn mở card tới khi Hero quay lại viewport.

### 2.3. `ServiceShowcase` & `PartnersStrip` (`CMP-06`, `CMP-07`)
- **ServiceCard:**
  - Icon vector đồng bộ từ `lucide-react` (`Users`, `Clock`, `Award`, `GraduationCap`, `Building2` hoặc tương đương, kích thước `24px`, nằm trong badge tròn/bo góc thống nhất), bỏ 3 PNG HR2B (`DEC-UI-04`).
  - Trên fine-pointer hover, detail mở rộng mượt theo `--motion-t2` (`180ms`); trên touch/keyboard focus, toàn bộ nội dung đọc được không phụ thuộc hover.
- **PartnersStrip (`5` đối tác nguồn):**
  - `Luxshare ICT`, `FOXCONN`, `SAMSUNG`, `JEILTECH VINA`, `TACU`.
  - Cả `FOXCONN` và **`TACU`** phải sử dụng nền tối tương phản chuẩn (`data-dark-mark` hoặc quy chuẩn thẻ nền đồng nhất `DEC-UI-03`) để loại bỏ lỗi chữ trắng tàng hình trên `#eaf4ff`.
  - Toàn bộ nút điều khiển (`Tạm dừng chuyển động đối tác`, `Tạm dừng chuyển động`) phải đi qua `useTranslation()` đầy đủ 5 ngôn ngữ.
  - Không thay đổi cấu trúc DOM (chuyển `staticList` sang hiện/ẩn qua CSS `@media (prefers-reduced-motion: reduce)` hoặc trạng thái khởi tạo an toàn để tránh hydration shift).

### 2.4. Nhóm Biểu mẫu `F01–F06` & `AttachmentPicker` (`CMP-10`, `CMP-11`, `CMP-12`)
- **Quy tắc chung toàn bộ 6 form:**
  - `noValidate`, chỉ báo lỗi sau lần submit đầu (`attempted=true`), sau đó xóa/cập nhật lỗi real-time theo `onInput`/`onChange`.
  - Lỗi đầu tiên tự động nhận focus (`aria-invalid="true"`, `aria-describedby` trỏ tới `<small role="alert">` / error ID).
  - Chặn double-submit trong cùng lượt (`submitted=true`), không giả lập thanh loading/spinner khi thao tác tức thời trong bộ nhớ phiên.
  - **Đồng nhất câu lỗi SĐT:** Khi rỗng trả `"Vui lòng nhập số điện thoại."`; khi sai định dạng VN trả `"Vui lòng nhập số điện thoại Việt Nam hợp lệ."` (áp dụng chung cho cả `Contact.tsx`, `JobsPages.tsx`, `Education.tsx`).
  - **Đồng nhất màn hình biên nhận (`Receipt`):** Tất cả 6 form hiển thị mã `DEMO-xxxx`, nhãn mô phỏng không gửi dữ liệu thật, nút `<Link>` sang `/admin-demo?type=F0x&id=DEMO-xxxx`, **VÀ nút `"Tạo yêu cầu thử mới"`** (bổ sung cho `F03`/`F04` đang thiếu).
  - **Draft & File Picker:** Giữ nguyên cơ chế draft tách riêng theo mode (`F01`/`F02`, `F05`/`F06`, `Consultation` edit) và `AttachmentPicker` (`3` tệp, `5 MB`/tệp, `15 MB` tổng thập phân, `.jpg/.jpeg/.png/.pdf/.doc/.docx`, cancel OS dialog giữ nguyên danh sách cũ, xóa tệp trả focus về nút xóa kế tiếp hoặc input + đọc live region).

### 2.5. `AdminDemo` (`CMP-13`)
- **Khung & Bố cục:** Loại bỏ khoảng nền tối trống `~80px` dưới Header toàn cục bằng cách căn lại CSS wrapper `.admin-demo` (không kế thừa top spacer/masthead tối của trang con).
- **Bộ lọc & Danh sách:**
  - Khi `!filtered.length`, hiển thị ngay nút **`Xóa bộ lọc`** (đặt lại `search`, `source`, `owner`, `status` về mặc định và **giữ nguyên tab queue `?type=` hiện tại** để không làm mất ngữ cảnh hàng đợi đang xem; người dùng chọn tab `Tất cả` nếu muốn đổi queue).
  - Lưu thay đổi của 6 hồ sơ mẫu `MD-001..006` vào bộ nhớ phiên chung (`demo-submissions.ts`) để không mất khi chuyển trang nội bộ rồi quay lại `/admin-demo`.
  - Đồng bộ bản dịch 5 ngôn ngữ cho `sampleRecords` (`.detail`, `.result`, `.source`, `.owner`, `.status`) và câu CMS mặc định.

### 2.6. `SupportTools` & `Footer` (`CMP-14`, `CMP-15`)
- **SupportTools:**
  - Thay `<b>Z</b>` và `<b>f</b>` bằng SVG thương hiệu chuẩn kích thước `19×19px`.
  - Trên mobile (`< 640px`), tăng `padding-bottom` của danh sách thẻ/bảng cuối vùng nội dung và thu nhẹ kích thước/offset launcher (`44×44px` tối thiểu) hoặc tự ẩn nhẹ khi người dùng đang focus vào nút Bookmark/input ở sát góc phải để không đè lên nút Bookmark trên thẻ việc đầu tiên.
- **Footer:**
  - Giữ đủ 3 cột (`Khám phá Minh Đức`, `Điểm liên hệ`, `Liên hệ`) + thanh bản quyền/pháp lý.
  - Đổi nút `"Đăng ký nhận bản tin"` sang biến thể nút phụ `.btn-outline-blue` (viền xanh `--md-blue` / nền trắng, khác với `.btn-secondary` viền `--md-red` trong `reference-base.css:15`) để nhường độ nổi đỏ `--md-red` cho CTA chuyển đổi chính của trang; bổ sung icon cho nút Facebook & Zalo.

---

## 3. Tiêu chí đạt cấp Component (`AC-CMP-*`)

| Mã AC | Component áp dụng | Tiêu chí đo kiểm được | Liên kết AC chi tiết |
|---|---|---|---|
| **AC-CMP-01** | `CMP-01`, `CMP-02` | Header `72px` (`<1280px`) / `80px` (`>=1280px`), logo tương phản `>=4.5:1`, `/education` không highlight nhầm `Việc làm`, 5 cờ SVG dùng `lucide-react`. | `AC-IMP-01`, `AC-IMP-11`, `AC-IMP-19` |
| **AC-CMP-02** | `CMP-03`, `CMP-05` | Hero scroll threshold `>= 80px`, `hero-brand-finish` fade `<= 320ms`, `AnimatedNumberGroup` giữ giá trị cuối khi rời viewport/nhảy neo. | `AC-IMP-02`, `AC-IMP-05`, `AC-IMP-10` |
| **AC-CMP-03** | `CMP-04`, `CMP-08` | `NotFound` dùng `PageMasthead`, ảnh bảng hiệu không bị crop chữ, giảm lặp `flagship-atrium.webp`, bo góc thẻ đồng bộ `--md-radius-lg`. | `AC-IMP-13`, `AC-IMP-14`, `AC-IMP-20` |
| **AC-CMP-04** | `CMP-06`, `CMP-07` | `5/5` icon vector `lucide-react` (`0` HR2B PNG), logo `TACU` có tương phản `>= 3:1`, `PartnersStrip` không shift khi hydrate, nút Pause dịch 5 ngôn ngữ. | `AC-IMP-04`, `AC-IMP-06`, `AC-IMP-09` |
| **AC-CMP-05** | `CMP-09`, `CMP-10`, `CMP-11`, `CMP-12` | `0` Fragment sót tiếng Việt, câu lỗi SĐT đồng nhất, `F03`/`F04` có retry, link bản đồ `/contact` `>= 44px`, input/button dùng `8px`/`999px`. | `AC-IMP-06`, `AC-IMP-12`, `AC-IMP-15` |
| **AC-CMP-06** | `CMP-13`, `CMP-14`, `CMP-15` | `/admin-demo` không có dải tối `80px`, có `"Xóa bộ lọc"` và lưu `MD-001..006` theo phiên; `SupportTools` không đè Bookmark `390px`; Footer dùng `.btn-outline-blue`. | `AC-IMP-03`, `AC-IMP-08`, `AC-IMP-15`, `AC-IMP-19` |
| **AC-CMP-07** | Tất cả `CMP-01`–`CMP-15` | Hoạt động 100% qua bàn phím (`Tab`, `Enter`, `Space`, `Escape`, `ArrowLeft/Right`, `Home/End`) và màn chạm không phụ thuộc hover. | `MDU-SDD-02`, `MDU-SDD-03`, `A11Y-03` |
