# MDV2 — RESPONSIVE, I18N & ACCESSIBILITY MATRIX (`RESPONSIVE-MATRIX.md`)

**Candidate UI SDD Version:** `MDV2-UI-SDD-v2.0.0-CANDIDATE`  
**Ngày lập:** 28/11/2026  
**Nguồn hợp nhất:** `MDU-SDD-v1.0.0` (`SDD-04`), `MDU-PLAN-v1.0.0` (4 nhóm thiết bị & mốc breakpoint), `MDV2-UX-01`, `MDV2-LNG-001/002`, và P1 Audit (`IMP-06`, `IMP-08`, `IMP-12`, `IMP-17`).  
**Trạng thái:** **CANDIDATE_FOR_PO_APPROVAL**.

---

## 1. Ma trận Responsive theo 4 Nhóm thiết bị (`RWD-01`–`RWD-04`)

| Mã | Nhóm thiết bị | Nguồn | CSS Viewports bắt buộc | Mốc chuyển tiếp thực tế cần quét | Quy tắc bố cục & Kiểm chứng | Trạng thái phê duyệt |
|---|---|---|---|---|---|---|
| **RWD-01** | **Mobile** | `MDU-SDD-04`, `MDU-PLAN`, `IMP-08` | `320×740`, `360×800`, `390×844`, `430×932` | `359/360`, `450`, `520/521`, `639/640` | Header cố định `72px`; video Hero giữ 16:9; thanh phân trang `/news/` wrap gọn không tràn; `SupportTools` không đè nút Bookmark thẻ việc đầu tiên (`IMP-08`); bảng `/admin-demo` cuộn trong `.admin-table-wrap`; test thiết bị thật (iOS Safari/Android Chrome) với bàn phím ảo & file picker OS. | `BASELINE_APPROVED` + `CANDIDATE_DEFECT_FIX` (`IMP-08`) |
| **RWD-02** | **Tablet** | `MDU-SDD-04`, `MDU-PLAN` | `768×1024`, `820×1180`, `1024×768` | `767/768`, `799/800`, `999/1000`, `1023/1024` | Drawer điều hướng ở `< 1280px` (Header `72px`); lưới dịch vụ/tin tức chuyển 2 cột; bộ lọc `/jobs` & `/admin-demo` chuyển 2 cột sạch; `P41` kiểm tra scale `820×1180`. | `BASELINE_APPROVED` |
| **RWD-03** | **Desktop / Laptop** | `MDU-SDD-04`, `MDU-PLAN`, `IMP-01/03/07` | `1280×800`, `1440×900` | `1279/1280/1281`, zoom `200%` | Hiện full 7 mục menu ngang + submenu hover/focus (`80px` Header); không còn dải tối `~80px` trên `/admin-demo` (`IMP-03`); Hero không va chạm logo kép (`IMP-01`) & giữ `16px` root `rem` (`IMP-07`). | `CANDIDATE_DEFECT_FIX` (`IMP-01`, `IMP-03`, `IMP-07`) |
| **RWD-04** | **Wide Screen** | `MDU-SDD-04`, `MDU-PLAN`, `IMP-02` | `1920×1080` *(tùy chọn `2560×1440`)* | `>= 1440px` | Container giữ tối đa `1280–1360px`; độ rộng dòng bài viết `<= 72ch`; Hero không để hai mảng đen `#0e1b2d` vô hồn hai bên (`IMP-02` chờ PO chọn phương án). | `PENDING_PO_DESIGN_APPROVAL` (`IMP-02`) |

---

## 2. Yêu cầu Đa ngôn ngữ — 5 Ngôn ngữ (`LNG-01`–`LNG-05`)

| Mã | Ngôn ngữ & Prefix | Nguồn & Yêu cầu | Lỗi P1 cần xử lý (`IMP-06`, `IMP-17`) | Tiêu chí đạt | Trạng thái phê duyệt |
|---|---|---|---|---|---|
| **LNG-01** | **Tiếng Việt** (`vi`, `/`) | `MDV2-LNG-001`, bản gốc | Chuẩn hóa 66 key trùng tránh sai nghĩa; thống nhất câu lỗi SĐT rỗng | Không tải thêm chunk ngôn ngữ ngoài; 100% nhãn khớp nguồn. | `BASELINE_APPROVED` + `CANDIDATE_DEFECT_FIX` |
| **LNG-02** | **Tiếng Anh** (`en`, `/en`) | `MDV2-LNG-001/002` | Bỏ React Fragment tại `KCN ...` (`JobsPages.tsx:87`) & `receiptService` (`Contact.tsx:145`); dịch `ADMIN` `sampleRecords`/CMS & 4 nút Pause rail. | `0` chuỗi tiếng Việt sót trên `/jobs`, `/contact` receipt, `/admin-demo` modal/CMS, nút Pause rail. | `CANDIDATE_DEFECT_FIX` |
| **LNG-03** | **Trung giản thể** (`zh-Hans`, `/zh`) | `MDV2-LNG-001/002` | Giống `LNG-02` + khai báo font stack `Noto Sans SC` / `PingFang SC` (`IMP-17`). | `html[lang="zh-Hans"]`, giữ query/anchor khi chuyển ngôn ngữ, không cắt nét chữ. | `CANDIDATE_DEFECT_FIX` |
| **LNG-04** | **Tiếng Hàn** (`ko`, `/ko`) | `MDV2-LNG-001/002` | Sửa collision key `'Đã đóng'` giữa `jobs.json` (`모집 마감`) và `contact-admin.json` (`종료`) trên tin `MD005`; bổ sung font stack `Noto Sans KR`. | Tin đóng `MD005` hiển thị đúng `"모집 마감"` (Ngừng tuyển), không hiển thị `"종료"` (Hoàn tất). | `CANDIDATE_DEFECT_FIX` |
| **LNG-05** | **Tiếng Nhật** (`ja`, `/ja`) | `MDV2-LNG-001/002` | Sửa collision `'Đã đóng'` (`募集終了` vs `完了`); căn chỉnh nút `"その他の絞り込み"` không gãy 2 dòng xấu ở `390px` (`P09_ja_m390_top.png`); bổ sung font stack `Noto Sans JP`. | Nút lọc & nút submit gọn trên 1 hàng hoặc bố cục 2 hàng cân đối ở `390px`; `0` overflow. | `CANDIDATE_DEFECT_FIX` |

*(Ghi chú ngữ nghĩa tên riêng: tên pháp nhân `"Minh Đức Vina"`, địa danh hành chính khi không có bản dịch chính thức và nhãn tự xưng `"Tiếng Việt"` trong bộ chọn ngôn ngữ được phép giữ theo `audit-i18n.mjs`; riêng danh từ chung như `"Khu công nghiệp ..."` và dịch vụ phải được dịch đầy đủ).*

---

## 3. Yêu cầu Khả năng tiếp cận (`A11Y-01`–`A11Y-06`)

| Mã | Hạng mục Accessibility | Nguồn | Tiêu chuẩn & Ngưỡng đo đạt | Bằng chứng & Lỗi P1 cần đóng | Trạng thái phê duyệt |
|---|---|---|---|---|---|
| **A11Y-01** | **Độ tương phản màu** (`WCAG 2.2 AA`) | `MDU-SDD-01` (`AC-VIS-02`), `IMP-01/04` | Chữ thường `>= 4.5:1`, chữ lớn/đồ họa UI `>= 3:1` | Sửa logo Header tối màu trên Video Hero (`IMP-01`) và logo `TACU` trắng trên `#eaf4ff` (`IMP-04`). | `CANDIDATE_DEFECT_FIX` |
| **A11Y-02** | **Vùng chạm tương tác** (`MDU-SDD-04`) | `MDU-SDD-04` (`AC-RWD-04`), `IMP-08/12` | Mục tiêu chạm `>= 44×44 CSS px` cho các nút/link hành động; `0` overlap | Nâng chiều cao link `"Xem bản đồ"` / `"Chỉ đường"` tại `/contact` (`32px → >=44px`) và link tiêu đề `/events` (`39px → >=44px`); tránh `SupportTools` đè nút Bookmark ở `390px`. | `CANDIDATE_DEFECT_FIX` |
| **A11Y-03** | **Điều hướng bàn phím & Focus** | `MDU-SDD-02/03` (`AC-NAV-03`), `IMP-05` | `100%` điều khiển tương tác tới được bằng `Tab`/`Shift+Tab`, kích hoạt qua `Enter`/`Space`, đóng overlay bằng `Escape`, `:focus-visible` `>= 3px` rõ trên nền thực, `scroll-margin-top >= --header-height` | Giữ focus trap Modal/Drawer, focus return khi xóa việc đã lưu hoặc đóng modal ADMIN, nhảy anchor không bị Header che và không ẩn ở `opacity: 0`. | `BASELINE_APPROVED` + `CANDIDATE_DEFECT_FIX` |
| **A11Y-04** | **Cấu trúc ngữ nghĩa & Heading** | `MDU-SDD-01/06`, `MDV2-SEO-001`, `IMP-20` | Đúng `1` `<h1>` mỗi trang trên `41/41` route, `0` skipped heading level, đủ landmark `header`/`main`/`nav`/`footer` | Đã xác nhận `41/41` trang đạt 1 `<h1>`; đảm bảo `NotFound` dùng `PageMasthead`. | `BASELINE_APPROVED` |
| **A11Y-05** | **Trình đọc màn hình (AT Audio)** | `MDU-SDD-05` (`MS02-4`), `QA-GAPS.md` | Mỗi thao tác đổi kết quả lọc, lưu/bỏ lưu, báo lỗi form, xóa file hoặc biên nhận đọc **đúng 1 thông báo có nghĩa** từ `aria-live`/`role="status"`, không đọc trạng thái lỗi thời | Đóng mã `MS02-4` và **9 mã AT** còn mở trong `QA-GAPS.md` bằng log kiểm thử thực tế trên VoiceOver / NVDA (không suy đoán từ JSDOM). | `OPEN_QA_GATE` |
| **A11Y-06** | **Zoom `200%` & Reduced Motion** | `MDU-SDD-01/04/05`, `AC-VIS-03`, `IMP-05` | Ở `1440px` zoom `200%` (tương đương `720px` CSS): `0` tràn ngang (`scrollWidth <= innerWidth`), `0` chữ/CTA bị cắt; bật `prefers-reduced-motion` giữ `100%` nội dung & số liệu (`1200+/80+/15+/95%`) | Giữ toàn bộ nội dung `RevealFrame` và số liệu `AnimatedNumberGroup` luôn đọc được (`IMP-05`). | `CANDIDATE_DEFECT_FIX` |
