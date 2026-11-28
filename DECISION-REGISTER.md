# MDV2 — DECISION REGISTER & PO SUMMARY (`DECISION-REGISTER.md`)

**Candidate UI SDD Version:** `MDV2-UI-SDD-v2.0.0-CANDIDATE`  
**Ngày lập:** 28/11/2026  
**Mục đích:** Ghi nhận toàn bộ quyết định kế thừa từ `MDU-DEC-v1.0.0` / `MDV2-DEC-01` và các quyết định thiết kế mới phát sinh từ P1 (`IMP-01`–`IMP-20`).  
**Tuyên bố trạng thái:** **PENDING PROJECT OWNER SIGN-OFF — NOT DESIGN APPROVED.**

---

## 1. Các quyết định kế thừa đang mở / giữ cổng (`MDV2-DEC-*` & `MDU-DEC-*`)

| Mã quyết định | Chủ đề | Trạng thái hiện tại | Ảnh hưởng tới P2 UI SDD |
|---|---|---|---|
| **PR #12 / PR #9 / PR #11 Integration** | Chốt merge PR #12 (`848458ea`) + governance PR #9/#11 vào `prototype` trước khi mở nhánh code UI | **PENDING_PO** | Mọi wave code `UI-01`..`UI-06` phải chạy trên nguồn Sprint 2 (`848458ea`), không chạy trên v30 cũ. |
| **MDU-DEC-GATE-01** (`MI02-4`, `MI03-4`, `MO05-1`, `MO08-2`, `MS01-4`) | Undo bỏ lưu, sắp xếp theo lương, fade chuyển route, trang trí Hero ended, spring motion | **GATED / OFF mặc định** | P2 giữ OFF theo `MDU-SDD-05`; chỉ bật nếu PO duyệt riêng từng mã. |
| **MDU-DEC-GATE-02** (`SDD-02`, `SDD-04`, `SDD-05`) | Nội dung pháp lý chủ thể ký Cung ứng vs Cho thuê, số bước/SLA, minh chứng có nguồn thay con số mẫu | **PENDING_PO** | Chặn phần mở rộng nội dung của `IMP-18`; cấu trúc UI có thể thiết kế sẵn chờ text duyệt. |
| **MDU-DEC-GATE-03** (`P41-B1/C2`, `ROW625`, `P38-F2`, `T22`) | 8 vs 13 lựa chọn ở `/duyet.html`; mã `B625`; đưa giờ hẹn `/consultation` vào ADMIN payload; toast lưu việc cũ | **PENDING_PO** | Giữ nguyên hiện trạng Sprint 2 cho đến khi PO chọn phương án. |

---

## 2. Quyết định thiết kế UI mới từ P1 cần Project Owner phê duyệt (`DEC-UI-01`–`DEC-UI-10`)

| Mã quyết định | Liên kết P1 | Vấn đề & Bằng chứng | Các phương án để Project Owner chọn | Phương án đề xuất | Trạng thái |
|---|---|---|---|---|---|
| **DEC-UI-01** | `IMP-01` | Logo Header xanh đậm va chạm với watermark `"MINH ĐỨC"` góc trái video Hero và mất tương phản trên scrim tối (`P01_d1440_top.png`). | **A:** Dùng bản logo Header trắng (`on-dark`) khi ở trên video tối + thay file video sạch không watermark góc trái.<br>**B:** Đổi Header Desktop trên Hero thành thanh nền kính sáng cố định 80px như subpage (bỏ trong suốt trên video). | **Phương án A** (giữ đúng tinh thần Header trong suốt phủ video theo Quyết định v16 & `REF-UI-01`). | **PENDING_PO_APPROVAL** |
| **DEC-UI-02** | `IMP-02` | Video Hero 16:9 tạo 2 dải tối `#0e1b2d` hai bên ở màn hình rộng `1440/1920px`; cuộn `1px` ngắt video. | **A:** Giữ khung 16:9 theo v16 nhưng phủ nền kiến trúc mờ/gradient có chủ đích hai bên (thay mảng đen `#0e1b2d`) + ngưỡng scroll `>= 80px`.<br>**B:** Cho video fill phủ kín `100%` chiều rộng (`object-cover` crop nhẹ trên ultrawide) như `REF-UI-01`. | **Phương án A** (vừa hết cảm giác hộp đen, vừa tuân thủ quy tắc v15/v16 "không cắt cảnh video"). | **PENDING_PO_APPROVAL** |
| **DEC-UI-03** | `IMP-04` | Logo đối tác `TACU` trắng bị tàng hình trên `#eaf4ff`; 5 đối tác dùng 3 kiểu nền khác nhau. | **A:** Gán `data-dark-mark` thống nhất nền tối `#12263f` cho các logo trắng (`FOXCONN`, `TACU`), giữ logo màu trên thẻ trắng sạch đồng bộ.<br>**B:** Đặt cả 5 logo trong thẻ nền trắng hoặc đổi file `tacu.webp` sang bản chữ tối. | **Phương án A hoặc B** (ưu tiên **B** nếu PO cung cấp được `tacu` bản màu tối để 5 logo đồng nhất 1 nền trắng như `REF-UI-01`). | **PENDING_PO_APPROVAL** |
| **DEC-UI-04** | `IMP-07`, `IMP-13` | Hợp nhất 316 hex / 11 sắc đỏ / 35 bo góc; bỏ `1rem = 1vw`; bỏ góc vuông `0px` Editorial & `3px` Contact. | **A:** Áp dụng toàn bộ hệ token `DESIGN-SYSTEM-SPEC.md` (gốc `16px`, 4 cấp bo góc `8/12/16/999px`, 1 cặp đỏ/xanh chính).<br>**B:** Chỉ sửa lỗi `1rem = 1vw` & `--header-height`, giữ nguyên bo góc từng trang. | **Phương án A** (chấm dứt cảm giác ghép mẫu nhiều phiên bản). | **PENDING_PO_APPROVAL** |
| **DEC-UI-05** | `IMP-08`, `IMP-09`, `IMP-19` | 3 thẻ dịch vụ đầu dùng PNG HR2B (`Solution-Icon-1..3.png`); `SupportTools` dùng `<b>Z</b>`/`<b>f</b>` và đè Bookmark ở `390px`; Footer nút bản tin tô đỏ. | **A:** Thay toàn bộ bằng icon vector `lucide-react` / SVG đồng bộ, dọn `/mirror/www.hr2b.com/` khỏi UI, chỉnh `SupportTools` tránh đè Bookmark `390px`, hạ nút bản tin Footer thành `.btn-outline-blue`.<br>**B:** Chỉ sửa lỗi đè Bookmark `390px` & thay `<b>Z</b>`/`<b>f</b>`, giữ nguyên icon dịch vụ và Footer hiện tại. | **Phương án A** (xóa triệt để dấu vết HR2B cũ). | **PENDING_PO_APPROVAL** |
| **DEC-UI-06** | `IMP-11` | Mở `/education` lại làm sáng gạch chân đỏ ở mục **`Việc làm`** trên Header (`P32_d1440_top.png`). | **A:** Gán highlight `/education*` về nhóm **`Dịch vụ`** (vì trong 5 dịch vụ có Tuyển sinh cao đẳng & đại học).<br>**B:** Không highlight mục cha nào trên top nav khi ở `/education*` (giữ đúng danh tính trang tuyển sinh độc lập). | **Phương án A** (khớp với phân nhóm `P07 Tuyển sinh cao đẳng & đại học` trong menu `Dịch vụ`). | **PENDING_PO_APPROVAL** |
| **DEC-UI-07** | `IMP-16` | Trang chủ dài `6.721px` (so với `5.088px` của `REF-UI-01`); khối Giới thiệu dùng ảnh tròn rời rạc; B2C thiếu lối lọc nhanh. | **A:** Tinh gọn spacing (~`5.200–5.500px`), nâng cấp khối Giới thiệu theo nhịp `REF-UI-01` (2 thẻ truy cập nhanh Lịch sử/Hồ sơ), thêm lối tắt B2C lọc nhanh dưới Hero.<br>**B:** Giữ nguyên thứ tự/bố cục các khối Trang chủ v16, chỉ tinh chỉnh padding nhẹ. | **Phương án A** để đạt độ sang trọng Flagship tương xứng `REF-UI-01`. | **PENDING_PO_APPROVAL** |
| **DEC-UI-08** | `IMP-12` (Maps CID), `IMP-14` | Bản đồ Google Maps tại `/contact` hiển thị tên **`Cty TNHH MD668 VINA`** (`3.7 ★`); ảnh masthead `/about-us` & `/contact` bị cắt chữ bảng hiệu; `/news` lặp watermark. | **A:** PO xác nhận CID/Google Maps chính thức của Minh Đức Vina và cung cấp/chọn ảnh thật không cắt bảng hiệu & không watermark góc cho `/about-us`, `/contact`, `/news` (kèm `responsiveImage()` `AboutActivities` & decode ảnh `/careers`).<br>**B:** Giữ CID và tệp ảnh hiện tại, chỉ điều chỉnh `object-position` CSS + `responsiveImage()` + decode `/careers`. | **Cần PO xác nhận nguồn CID & bộ ảnh sạch**. | **PENDING_PO_APPROVAL** |
| **DEC-UI-09** | `IMP-18` | Trang chi tiết dịch vụ lặp 2 khối F01 (modal đầu trang + form cuối trang) và chưa có bảng phân biệt Cung ứng vs Cho thuê. | **A:** Giữ 1 CTA neo xuống form F01 duy nhất hoặc Modal gọn + thêm bảng 3 tiêu chí SDD-02 sau khi PO duyệt nội dung.<br>**B:** Giữ nguyên 2 điểm nhập F01 như Sprint 2. | **Phương án A** (phụ thuộc SDD-02). | **PENDING_PO_APPROVAL** |
| **DEC-UI-10** | `IMP-03`, `IMP-05`, `IMP-06`, `IMP-10`, `IMP-12` (`44px`/radius), `IMP-15`, `IMP-17`, `IMP-20` | Các lỗi kỹ thuật thuần túy vi phạm SDD đã duyệt (dải tối `~80px` ADMIN, counter `0+`, Fragment i18n, collision `'Đã đóng'`, ADMIN dịch/filter reset, retry F03/F04, motion `<=320ms`, `44px` tap target, font cleanup, `NotFound` & QA hardening). | **Approve Batch Defect Fixes:** Cho phép gộp toàn bộ các sửa lỗi kỹ thuật (`CANDIDATE_DEFECT_FIX`) vào đợt triển khai ngay sau khi duyệt SDD. | **Approve Batch** (không thay đổi nghiệp vụ, chỉ đưa sản phẩm về đúng SDD đã duyệt). | **PENDING_PO_APPROVAL** |

---

## 3. Decision Summary cho Project Owner (Không tự tuyên bố DESIGN APPROVED)

1. **Trạng thái hiện tại của tài liệu P2:** Toàn bộ 8 tài liệu thuộc phiên bản ứng viên **`MDV2-UI-SDD-v2.0.0-CANDIDATE`** đang ở trạng thái **Draft / Pending PO Approval**. Chưa có dòng mã nguồn giao diện nào được sửa đổi.
2. **Những gì đã sẵn sàng về mặt kỹ thuật:**
   - Đã hợp nhất đầy đủ 20 mục `IMP-01`–`IMP-20` từ P1 với `MDU-SDD-v1.0.0`, `MDV2-REQ-01` và `REF-UI-01`.
   - Đã tách bạch rạch ròi: **Nhóm sửa lỗi (`CANDIDATE_DEFECT_FIX`)** vs **Nhóm đề xuất thiết kế mới (`PENDING_PO_DESIGN_APPROVAL`)** vs **Nhóm bị khóa (`GATED/BLOCKED`)**.
   - Đã chuẩn bị xong Design System tokens, Component & Page Specs, Motion `T0–T4`, ma trận Responsive/5 ngôn ngữ/Accessibility, bộ Acceptance Criteria đo được và kế hoạch 6 Wave (`UI-01`–`UI-06`) không trùng lặp quyền sở hữu tệp.
3. **Các quyết định Project Owner cần chốt trước khi chuyển sang P3 (Triển khai code):**
   - **(1) Chốt nguồn code nền:** Merge hoặc chỉ định nhánh nguồn Sprint 2 (`PR #12 @ 848458ea`) làm base cho code waves.
   - **(2) Phê duyệt `DEC-UI-10` (Batch Defect Fixes):** Xác nhận sửa các lỗi kỹ thuật thuần túy (`IMP-03`, `IMP-05`, `IMP-06`, `IMP-10`, `IMP-12` tap target/radius, `IMP-15`, `IMP-17`, `IMP-20`).
   - **(3) Chọn phương án cho 9 quyết định thiết kế/nội dung (`DEC-UI-01` → `DEC-UI-09`):** Logo/video Hero (`DEC-UI-01`, `DEC-UI-02`), nền logo đối tác `TACU` (`DEC-UI-03`), thống nhất bo góc/tokens (`DEC-UI-04`), icon vector/SupportTools/Footer (`DEC-UI-05`), active menu `/education` (`DEC-UI-06`), thu gọn/cân bằng B2B-B2C trang chủ (`DEC-UI-07`), nguồn CID Maps & bộ ảnh sạch (`DEC-UI-08` gồm `IMP-14`), và trang chi tiết dịch vụ (`DEC-UI-09`).
   - **(4) Ghi nhận bằng chứng duyệt chính thức:** Sau khi Project Owner phản hồi chọn trên Draft PR này, trạng thái `MDV2-UI-SDD-v2.0.0-CANDIDATE` mới được nâng cấp thành `APPROVED` để mở khóa Wave `UI-01`.
