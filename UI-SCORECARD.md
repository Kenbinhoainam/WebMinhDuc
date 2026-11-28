# MDV2 — P1: FLAGSHIP UI/UX SCORECARD (`UI-SCORECARD.md`)

**Ngày chấm điểm:** 28/11/2026  
**Đối tượng đánh giá:** Bản dựng Sprint 2 tái tạo (`848458ea`, khớp 545/545 tệp với `prototype@19ac2b3` + fix tràn ngang `/news/` 320px), kiểm chứng trên Google Chrome thực tế (`320–1920px`, 5 ngôn ngữ, 41 trang `P01–P41`).  
**Nguyên tắc chấm điểm:** Chỉ chấm dựa trên bằng chứng đo đạc và quan sát trực quan thực tế. **Điểm số dưới đây là đánh giá kỹ thuật nội bộ cho vòng audit P1 — không cấu thành tuyên bố đã nghiệm thu UAT hay đạt chuẩn production.**

---

## 1. Tổng hợp điểm số (Thang 100 điểm)

| # | Nhóm tiêu chí | Trọng số | Điểm đạt | Tỷ lệ | Xếp loại |
|---|---|---:|---:|---:|---|
| 1 | Kiến trúc thông tin, Điều hướng & Luồng B2B/B2C | 15 | **11.5** | 76.7% | Khá |
| 2 | Hệ thống Design System (Màu, Typography, Grid, Spacing, Cards) | 15 | **7.5** | 50.0% | Cần cải tổ mạnh |
| 3 | Trải nghiệm Trang chủ & Hero (Above-the-fold, REF-UI-01 fit) | 12 | **6.5** | 54.2% | Dưới chuẩn Flagship |
| 4 | Biểu mẫu F01–F06, Validation & Trạng thái tương tác | 14 | **11.5** | 82.1% | Tốt |
| 5 | Responsive (Mobile/Tablet/Desktop/Wide) & Độ sạch Layout | 12 | **9.5** | 79.2% | Khá |
| 6 | Khả năng tiếp cận (Accessibility, Keyboard, Focus, Contrast) | 12 | **8.0** | 66.7% | Trung bình khá |
| 7 | Chuyển động (Motion), Video, Carousel & Reduced Motion | 8 | **5.0** | 62.5% | Trung bình |
| 8 | Đa ngôn ngữ (5 locales VI/EN/ZH/KO/JA) & Độ sạch nội dung | 7 | **4.5** | 64.3% | Trung bình |
| 9 | Hình ảnh, Icon, Media & Bản sắc thương hiệu Minh Đức | 5 | **2.5** | 50.0% | Yếu (Còn vết ghép mẫu) |
| **TỔNG** | **Tổng điểm Flagship UI/UX hiện tại** | **100** | **66.5** | **66.5%** | **Prototype chức năng tốt, chưa đạt chuẩn Flagship cao cấp** |

---

## 2. Chi tiết bằng chứng chấm & lý do trừ điểm từng hạng mục

### 1. Kiến trúc thông tin, Điều hướng & Luồng B2B/B2C — **11.5 / 15**
- **Điểm cộng (+):** Sitemap 7 nhóm / 14 mục con đồng nhất; 205+ route hoạt động ổn định (HTTP 200); luồng B2B (`Home/Services → F01 → ADMIN`) và B2C (`Jobs → Filter → Detail → Saved → F03 → ADMIN`) thông suốt qua SPA; bảo toàn ngữ cảnh Back/Forward và filter query.
- **Điểm trừ (-3.5):**
  - `(-1.0)` `/education` làm sáng active tab **`Việc làm`** trên menu chính (`P32_d1440_top.png`), gây nhầm ngữ cảnh khi đi từ `/services/college-admissions`.
  - `(-1.5)` `/admin-demo` xuất hiện khoảng tối rỗng ~80px dưới header toàn cục trên cả desktop & mobile (`P36_d1440_top.png`, `P36_m390_top.png`).
  - `(-1.0)` Trang chủ dài (6.721px desktop / 7.887px mobile) và `/services/:slug` lặp 2 điểm nhập F01; lối vào nhanh B2C tìm việc tại trang chủ chưa cân xứng với luồng B2B.

### 2. Hệ thống Design System (Màu, Typography, Grid, Spacing, Cards) — **7.5 / 15**
- **Điểm cộng (+):** Có bộ token nền tảng đúng nhận diện (`brand-colors.css`: `#183653`, `#1b489d`, `#bd1e2d`, `#eaf4ff`), variable `Inter` + `Roboto` tải sạch.
- **Điểm trừ (-7.5):**
  - `(-2.5)` Xung đột thang `rem`: `:root { font-size: 1vw }` (`reference-base.css:33`) làm trang chủ chạy nền `14px` / H1 `28.8px`, trong khi trang con dùng `16px` / H1 `60.48px`.
  - `(-2.0)` Phân mảnh màu sắc & CSS legacy: **316 mã hex**, **11 sắc độ đỏ**, biến `--header-height` chưa từng được định nghĩa; `styles.css` và `info.css` vẫn nạp toàn cục tạo xung đột cascade.
  - `(-2.0)` Hình học card/input thiếu nhất quán: bo góc `0px` (Editorial) cạnh `20–22px` (Services) cạnh `3px` (Contact form) cạnh `999px` (Home buttons).
  - `(-1.0)` Font asset `googlesansflex` và `montserrat` (194 KB) dư thừa, CSS còn fallback `Arial`/`Montserrat`; chưa khai báo font stack cho CJK.

### 3. Trải nghiệm Trang chủ & Hero (Above-the-fold) — **6.5 / 12**
- **Điểm cộng (+):** Tôn trọng `MDU-SDD-07` (giữ video 132,13s, đủ 2 CTA ở cả trạng thái đang phát và kết thúc, màn kết sạch hơn trên `P01_hero_ended_d1440.png`).
- **Điểm trừ (-5.5):**
  - `(-2.0)` **Va chạm 2 logo** ở góc trên trái desktop (`P01_d1440_top.png`, `live_pages_home_desktop_1440_top.png`) và logo header xanh đậm mất tương phản trên nền scrim tối.
  - `(-1.5)` Khung video bị đóng hộp giữa 2 thanh đen/xanh tối hai bên ở desktop rộng, thiếu cảm giác kiến trúc toàn màn hình như `REF-UI-01` (`ref_minhduccorp_desktop_1440_top.png`).
  - `(-1.0)` Ngắt video ngay sau `1px` cuộn xuống (`HomeHero.tsx:108-115`) làm màn hình giật đổi sang khung AI sáng quá đột ngột.
  - `(-1.0)` Dropdown `"Dịch vụ"` trên trạng thái kết thúc Hero che logo trung tâm `.hero-finish-logo` (`P01_hero_ended_d1440.png`).

### 4. Biểu mẫu F01–F06, Validation & Trạng thái tương tác — **11.5 / 14**
- **Điểm cộng (+):** Tuân thủ chuẩn 6 biểu mẫu, bắt buộc/tùy chọn chính xác, `noValidate` + focus vào trường lỗi đầu tiên, giữ nháp khi chuyển mode/giờ hẹn, chống double-submit, `AttachmentPicker` không làm mất tệp khi cancel picker, disclaimer prototype minh bạch.
- **Điểm trừ (-2.5):**
  - `(-0.8)` `F03`/`F04` (`JobsPages.tsx:355-361`) thiếu nút gửi thử lại trên màn hình biên nhận.
  - `(-0.7)` Thông báo lỗi bỏ trống SĐT không đồng nhất giữa `Contact.tsx` và `sharedformvalidation.ts`.
  - `(-0.5)` Chỉnh sửa 6 hồ sơ mẫu `MD-001..006` trong `/admin-demo` không lưu khi chuyển trang rồi quay lại; thiếu nút `"Xóa bộ lọc"` khi kết quả lọc trống.
  - `(-0.5)` Form `/contact` ép `border-radius: 3px` tách biệt khỏi hệ thống form chung; bản đồ Google hiển thị tên `Cty TNHH MD668 VINA`.

### 5. Responsive & Độ sạch Layout — **9.5 / 12**
- **Điểm cộng (+):** **0 lỗi tràn ngang (`scrollWidth <= innerWidth`) trên 41/41 trang** ở `320px`, `390px`, `768px`, `1440px`, `1920px` và 5 ngôn ngữ sau fix `/news/` từ PR #12; bảng ADMIN cuộn gọn trong vùng có nhãn.
- **Điểm trừ (-2.5):**
  - `(-1.0)` Nút tròn `SupportTools` cố định ở mobile `390px` đè lên nút Bookmark trên thẻ việc làm đầu tiên (`P09_ja_m390_top.png`) và mép bảng ADMIN.
  - `(-0.8)` Chưa kiểm chứng thực tế trên **thiết bị vật lý** (iOS Safari / Android Chrome: bàn phím ảo OS che nút submit, file picker hệ điều hành, xoay màn hình) — còn **69 mã thiết bị thật** chưa đóng.
  - `(-0.7)` Chưa có đo đạc lab/field **Lighthouse & Core Web Vitals (LCP, CLS, INP)**.

### 6. Khả năng tiếp cận (Accessibility) — **8.0 / 12**
- **Điểm cộng (+):** `axe-core` trong Sprint 2 ghi nhận `0 Fail` ở mẫu 800 lượt; hỗ trợ Escape/focus restoration trên modal/drawer/Admin/SavedJobs; `aria-pressed`/`aria-expanded`/`aria-describedby` dùng đúng ngữ nghĩa.
- **Điểm trừ (-4.0):**
  - `(-1.5)` Logo đối tác `TACU` chữ trắng trên nền `#eaf4ff` (`P01_partners_d1440.png`) + logo Header chữ xanh đậm trên nền video tối (`P01_d1440_top.png`) vi phạm nghiêm trọng độ tương phản nhìn thấy.
  - `(-1.0)` Liên kết `"Xem bản đồ"` và `"Chỉ đường"` ở `/contact` chỉ cao **32px** (`P37`), liên kết sự kiện trên `/events` cao **39px**, dưới mục tiêu chạm `44×44px` của `MDU-SDD-04`.
  - `(-1.5)` Chưa kiểm chứng thực tế **9 mã trình đọc màn hình (AT audio: VoiceOver/NVDA)** (`MS02-4` live region, bảng ADMIN, focus modal/file removal).

### 7. Chuyển động (Motion), Video, Carousel & Reduced Motion — **5.0 / 8**
- **Điểm cộng (+):** `RevealFrame` chống nhấp nháy tốt và bảo vệ khối đang focus; `PartnersStrip` & `ServiceShowcase` có nút pause và tôn trọng `prefers-reduced-motion`; Hero lắng nghe sự kiện `ended` thật.
- **Điểm trừ (-3.0):**
  - `(-1.0)` `AnimatedNumberGroup` reset bộ đếm về `0` khi `rearm()` (`motion.tsx:229-243`), làm xuất hiện `0+ / 0+ / 0+ / 0%` khi cuộn nhanh / chụp trang (`P01_d1440_after_scroll_full.png`).
  - `(-1.0)` Thời lượng `1800ms`, `800ms`, `500ms`, `260ms`, `160ms` lệch khỏi thang `T0–T4` (`0/120/180/240/320ms`) của `MDU-SDD-05`; `PartnersStrip` đổi `staticList` sau hydration gây layout shift nhẹ.
  - `(-1.0)` Thiếu kiểm tra tự động cho **52 mã ngắt chuyển động** (rapid open-close, hủy pointer giữa chừng, bật reduce giữa animation).

### 8. Đa ngôn ngữ (5 locales VI/EN/ZH/KO/JA) — **4.5 / 7**
- **Điểm cộng (+):** Cơ chế split-chunk giảm tải cho người dùng `vi`; `catalog-parity` đạt 1.629 key; không tràn ngang trên 50 lượt thử Chrome ở `390/1440`.
- **Điểm trừ (-2.5):**
  - `(-1.0)` Lỗi React Fragment khiến `KCN ...` (`JobsPages.tsx:87`) và tên dịch vụ trong biên nhận F01 (`Contact.tsx:145`) vẫn hiển thị tiếng Việt ở 4 ngôn ngữ còn lại.
  - `(-0.8)` Chưa dịch câu CMS mặc định + 6 hồ sơ mẫu `MD-001..006` trong `ADMIN Demo` + 4 nút pause rail (`AboutPage`, `ServicesPages`, `PartnersStrip`).
  - `(-0.7)` 66 key trùng bị ghi đè giữa các catalog (`Đã đóng` trong `ko`/`ja` thành "Hoàn tất" thay vì "Ngừng tuyển"); nút `"その他の絞り込み"` xuống 2 dòng chật trên mobile `390px`.

### 9. Hình ảnh, Icon, Media & Bản sắc thương hiệu — **2.5 / 5**
- **Điểm cộng (+):** Đưa vào được ảnh hoạt động thật của Minh Đức trên trang Giới thiệu, Tin tức, Tuyển dụng nội bộ; dùng `WebP` responsive.
- **Điểm trừ (-2.5):**
  - `(-1.0)` Tồn dư **3 PNG icon từ HR2B** trong `ServiceShowcase`, 19 entry HR2B chết trong `media-manifest.json`, và `<b>Z</b>`/`<b>f</b>` thay icon trong `SupportTools`.
  - `(-1.0)` Lạm dụng ảnh AI `flagship-atrium.webp` / `industrial-campus.webp` lặp lại ở nhiều masthead; một số trang dùng ảnh AI không gắn chú thích minh họa (`P31`); 3 ảnh ngang sâu trong `/careers/` chưa decode xong khi cuộn dọc.
  - `(-0.5)` Ảnh trụ sở cắt chữ bảng hiệu (`P02`, `P37`) và ảnh có watermark logo Minh Đức lặp lại ngay sát nhau (`P20`).
