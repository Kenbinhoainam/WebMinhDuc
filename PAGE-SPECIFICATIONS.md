# MDV2 — PAGE SPECIFICATIONS (`PAGE-SPECIFICATIONS.md`)

**Candidate UI SDD Version:** `MDV2-UI-SDD-v2.0.0-CANDIDATE`  
**Ngày lập:** 28/11/2026  
**Nguồn hợp nhất:** `MDU-SDD-v1.0.0` (`SDD-06..13`), `MDV2-FUNC-01`, `Doi-chieu-41-trang.csv`, `PAGE-AUDIT-MATRIX.md`, `TOP-20-IMPROVEMENTS.md`.  
**Trạng thái:** **CANDIDATE_FOR_PO_APPROVAL** *(Không tự tuyên bố DESIGN APPROVED; các điều chỉnh bố cục mới chờ PO duyệt).*

---

## 1. Quy tắc Page Templates (Hợp nhất từ 4 kiểu cũ về 3 mẫu chuẩn)

| Template ID | Tên mẫu trang | Nguồn tham chiếu | Trang áp dụng | Đặc tả cấu trúc & Quy tắc chuẩn | Trạng thái phê duyệt |
|---|---|---|---|---|---|
| **PG-TPL-01** (`TPL-HERO`) | Landing Page có Video Hero | `MDU-SDD-07`, `IMP-01/02/07` | `P01` (`/`) | Header trong suốt chuyển kính sáng khi cuộn/ended; Video Hero 16:9 + 2 CTA luôn khả dụng; chuỗi khối hành trình B2B/B2C có khoảng thở thống nhất; không dùng `1vw` làm co chữ. | `CANDIDATE_DEFECT_FIX` + `PENDING_PO_DESIGN_APPROVAL` |
| **PG-TPL-02** (`TPL-PAGE`) | Trang chuẩn có `PageMasthead` | `MDU-SDD-01/06`, `IMP-13/14/20` | `P02`–`P35`, `P37`–`P40`, `404` | Dùng thống nhất `<PageMasthead>` (biến thể `photo` cho `P02`–`P08`, biến thể `split` sáng cho khối còn lại); bỏ `PageHero` cũ khỏi `NotFound`; ảnh thật không cắt bảng hiệu; ảnh AI gắn chú thích minh họa; vùng chạm nút/link `>= 44×44px`. | `CANDIDATE_DEFECT_FIX` + `PENDING_PO_DESIGN_APPROVAL` |
| **PG-TPL-03** (`TPL-TOOL`) | Không gian ứng dụng / Công cụ duyệt | `MDU-SDD-11/12`, `IMP-03`, `P41-B1/C2` | `P36` (`/admin-demo`), `P41` (`/duyet.html`) | `P36` bỏ dải tối trống `~80px` dưới Header; bảng cuộn ngang trong `.admin-table-wrap` có nhãn; `P41` giữ iframe responsive scale `390/820/1440` (8 vs 13 lựa chọn chờ PO quyết định). | `CANDIDATE_DEFECT_FIX` + `GATED` (`P41-B1/C2`) |

---

## 2. Đặc tả chi tiết theo 6 Nhóm Trang (`PG-01`–`PG-06` / `P01–P41` + Mở rộng)

### `PG-01` — Nhóm 1: Trang chủ & Định vị Doanh nghiệp (`P01`)
- **Route:** `/` (`Home.tsx`) · **Nguồn:** `MDU-SDD-07`, `MDV2-DEC-001`, `IMP-01/02/04/05/09/13/16`, `REF-UI-01`.
- **Trạng thái phê duyệt:** `CANDIDATE_DEFECT_FIX` (logo Header, scroll threshold `>=80px`, counter `0+`, logo `TACU`) + `PENDING_PO_DESIGN_APPROVAL` (bố cục mở rộng Hero, thu gọn chiều cao `IMP-16`, bo góc `IMP-13`).
- **Hành trình mục tiêu:** Khách hàng B2B (nhà máy/FDI miền Bắc) gửi nhu cầu nhân lực (`F01`); người lao động B2C đi nhanh vào `/jobs`.
- **Thay đổi đặc tả:**
  - *Defect Fixes:* (1) Xử lý xung đột logo Header & video watermark + tương phản chữ trắng trên video tối; (2) Bỏ ngắt video sau `1px` scroll; (3) Sửa `AnimatedNumberGroup` không reset về `0+` khi cuộn qua; (4) Khắc phục logo `TACU` tàng hình trên nền `#eaf4ff`.
  - *New Proposals (Pending PO Approval):* (1) Bố cục mở rộng hai bên khung 16:9 thay dải đen cứng (`DEC-UI-02`); (2) Thu gọn nhịp khoảng trắng dọc (`~6.721px` → `~5.200–5.500px`), bổ sung thẻ truy cập nhanh Lịch sử/Hồ sơ tại khối Giới thiệu (học nhịp `REF-UI-01`) và lối tắt chọn nhanh KCN/nhóm việc B2C (`IMP-16`); (3) Đồng bộ bo góc `HomeEditorial` với `ServiceShowcase`.

### `PG-02` — Nhóm 2: Giới thiệu, Đối tác & Hồ sơ năng lực (`P02`, `P31`, alias `/e-brochure`, `/testimonials`)
- **Routes:** `/about-us` (`P02`, các neo `#profile`, `#history`, `#partners`, `#activities`, `#achievements`, `#business-contact`), `/partners` (`P31`) · **Nguồn:** `MDU-SDD-09`, `Quyết định v24`, `IMP-04/09/10/13/14`.
- **Trạng thái phê duyệt:** `BASELINE_APPROVED` (5 neo + trình đọc 3 trang) + `CANDIDATE_DEFECT_FIX` (crop bảng hiệu, `AboutActivities` `responsiveImage`, `TACU`, History `slideRailTo`) + `PENDING_PO_DESIGN_APPROVAL` (thay 3 PNG HR2B trong `ServiceCards` của `P02`, caption ảnh AI `P31`).
- **Thay đổi đặc tả:**
  - Điều chỉnh crop ảnh masthead `/about-us` (`object-position` hoặc thay ảnh) để không cắt ngang chữ bảng hiệu Minh Đức.
  - `AboutActivities` dùng `responsiveImage()` (`srcSet`, `sizes`, `width`, `height`).
  - `/partners` (`P31`) bổ sung caption phân biệt ảnh AI `industrial-campus.webp` (`"Phối cảnh minh họa khu công nghiệp"`), sửa logo `TACU`, và dịch nút Pause rail khách hàng.
  - Giữ trình đọc hồ sơ 3 trang tại `/about-us#profile` và redirect `/e-brochure` → `/about-us#profile` theo `Quyết định v24`.

### `PG-03` — Nhóm 3: Dịch vụ & Tuyển sinh (`P03`–`P08`, `P32`–`P35`)
- **Routes:** `/services` (`P03`), 5 trang chi tiết dịch vụ (`P04`–`P08`), `/education` (`P32`), 3 trang chương trình (`P33`–`P35`) · **Nguồn:** `MDU-SDD-07`, `MDU-SDD-10`, `SDD-02/04/05`, `IMP-09/11/17/18`.
- **Trạng thái phê duyệt:** `CANDIDATE_DEFECT_FIX` (sửa `/education` highlight nhầm `Việc làm`, dọn `Montserrat`) + `PENDING_PO_DESIGN_APPROVAL` (`IMP-09` vector icons, `IMP-18` bảng SDD-02 & tinh gọn form F01 lặp) + `GATED` (`SDD-02/04/05` nội dung pháp lý chờ PO).
- **Thay đổi đặc tả:**
  - Sửa highlight nhầm mục `Việc làm` trên Header khi mở `/education*` (`DEC-UI-06`); dọn CSS font `Montserrat` cũ trong `education.css`.
  - Thay 3 PNG HR2B trong `ServiceDirectory`/`ServiceCards` bằng icon vector; sau khi PO chốt `SDD-02/04/05`, bổ sung bảng phân biệt `Cung ứng` vs `Cho thuê` (chủ thể ký, trách nhiệm) trên `/services` và giảm trùng lặp 2 form F01 trên trang chi tiết dịch vụ (`IMP-18`).
  - Giữ tách biệt dữ liệu giả định trên `/education` (`F05` tư vấn vs `F06` hồ sơ có file tùy chọn), đồng bộ query `?form=F05|F06#dang-ky`.

### `PG-04` — Nhóm 4: Việc làm B2C, Đã lưu & Tuyển dụng nội bộ (`P09`–`P19`, alias `/job-seekers`)
- **Routes:** `/jobs` (`P09`), 8 trang chi tiết (`P10`–`P17`, gồm `MD005` đã đóng `P14` và 2 tin nội bộ `MD007`–`MD008` `P16`–`P17`), `/saved-jobs` (`P18`), `/careers` (`P19`) · **Nguồn:** `MDU-SDD-08`, `IMP-06/08/14/15/17`.
- **Trạng thái phê duyệt:** `BASELINE_APPROVED` (khóa `MD005`, `SaveButton` sync, `AttachmentPicker`) + `CANDIDATE_DEFECT_FIX` (Fragment `KCN`, collision `'Đã đóng'`, nút JA `390px`, `SupportTools` tránh đè Bookmark, `F03/F04` retry, `/careers` decode ảnh rail) + `GATED` (`MI02-4` Undo, `MI03-4` salary sort).
- **Thay đổi đặc tả:**
  - Bỏ React Fragment tại `KCN` trên `JobCard` để dịch đúng sang 5 ngôn ngữ; sửa collision từ điển khiến `'Đã đóng'` trên `MD005` ở `ko`/`ja` bị hiểu thành "Hoàn tất".
  - Nút `"Bộ lọc khác"` tiếng Nhật (`"その他の絞り込み"`) giữ gọn trên `390px`.
  - Bổ sung nút retry ở biên nhận `F03`/`F04`; thêm khoảng đệm đáy hoặc tránh nút tròn `SupportTools` che `SaveButton` ở `390px`.
  - Trên `/careers` (`P19`), đảm bảo ảnh trong dải album ngang được nạp/decode mượt khi bấm Next/mở Lightbox.

### `PG-05` — Nhóm 5: Tin tức, Sự kiện & Pháp lý (`P20`–`P30`, `P39`–`P40` + 9 bài v18)
- **Routes:** `/news` (`P20`), `/news/:slug` (`P21`–`P26` + 9 bài v18), `/events` (`P27`), `/events/:slug` (`P28`–`P30`), `/privacy-policy` (`P39`), `/terms-of-use` (`P40`) · **Nguồn:** `MDU-SDD-09/11`, `IMP-07/10/12/13/14/20`.
- **Trạng thái phê duyệt:** `BASELINE_APPROVED` (fix `320px` `/news/` PR #12, TOC `<details>` thu gọn) + `CANDIDATE_DEFECT_FIX` (ảnh watermark `/news`, `/events` link `>=44px`, `P39/P40` tách `info.css` dùng `16px`) + `PENDING_PO_DESIGN_APPROVAL` (bo góc card, masthead AI cleanup) + `GATED` (`P39/P40-F4` rà soát pháp lý).
- **Thay đổi đặc tả:**
  - Thay ảnh lặp watermark góc trên `/news`; nâng chiều cao vùng chạm liên kết tiêu đề sự kiện (`/events` `39px` → `>= 44px`); dịch nút Pause ở `FeaturedNews`.
  - Chuyển `P39`/`P40` ra khỏi CSS legacy `info.css`, chạy đúng thang `16px`; giữ nguyên nhãn dự thảo chờ rà soát pháp lý độc lập.
  - Ghi nhận chính thức 9 bài v18 vào phụ lục ma trận trang mở rộng.

### `PG-06` — Nhóm 6: Liên hệ, Tư vấn, Quản trị mẫu & Công cụ duyệt (`P36`, `P37`, `P38`, `P41`)
- **Routes:** `/admin-demo` (`P36`), `/contact` (`P37`), `/consultation` (`P38`), `/duyet.html` (`P41`) · **Nguồn:** `MDU-SDD-07/10/11/12`, `IMP-03/06/12/15/20`.
- **Trạng thái phê duyệt:** `CANDIDATE_DEFECT_FIX` (xóa dải tối `80px` ADMIN, dịch `sampleRecords`/CMS, thêm `"Xóa bộ lọc"` & lưu `MD-001..006` theo phiên, `/contact` map link `>=44px` & bỏ góc `3px`, xóa Fragment `receiptService`, dọn `Arial` `/consultation`) + `PENDING_PO_VERIFICATION` (`Cty TNHH MD668 VINA` Maps CID) + `GATED` (`P38-F2`, `P41-B1/C2`).
- **Thay đổi đặc tả:**
  - **`/admin-demo` (`P36`):** Xóa dải tối rỗng `~80px` dưới Header; dịch `sampleRecords` + câu CMS mặc định; thêm nút `"Xóa bộ lọc"` tại trạng thái rỗng; giữ thay đổi `MD-001..006` trong bộ nhớ phiên.
  - **`/contact` (`P37`):** Nâng chiều cao link `"Xem bản đồ"`/`"Chỉ đường"` lên `>= 44px`; bỏ `border-radius: 3px` vuông trên form; xóa Fragment tại `receiptService`; chỉnh crop ảnh masthead; rà soát với PO tên hiển thị **`Cty TNHH MD668 VINA`** trên Google Maps embed (`DEC-UI-08`).
  - **`/consultation` (`P38`):** Giữ luồng 2 bước + nháp `F02`; dọn font fallback `Arial`.
  - **`/duyet.html` (`P41`):** Giữ công cụ duyệt 390/820/1440; chờ PO chốt chuẩn danh mục 8 vs 13 lựa chọn (`P41-B1/C2`).

---

## 3. Tiêu chí đạt đo kiểm theo từng Nhóm Trang (`AC-PG-*`)

| Mã AC | Nhóm trang | Tiêu chí đo kiểm được |
|---|---|---|
| **AC-PG-01** | Toàn site (`P01`–`P41` + 9 bài v18) | `41/41` trang + 9 bài v18 trả HTTP 200, đúng `noindex`, đúng 1 `<h1>`, không nhảy cấp heading, `0` tràn ngang ở `320–1920px`, `body` `fontSize = 16px` toàn site. |
| **AC-PG-02** | `PG-01` (`P01`) | Logo Header tương phản `>= 4.5:1` không đè logo video, `scrollY = 20px` không ngắt video, 4 chỉ số hiển thị `1200+/80+/15+/95%` sau cuộn/nhảy `#about`, `5/5` logo đối tác rõ (`TACU` `>= 3:1`). |
| **AC-PG-03** | `PG-02` & `PG-03` (`P02`–`P08`, `P31`–`P35`) | Ảnh masthead `/about-us` không cắt mất chữ bảng hiệu; `AboutActivities` có `srcSet`; `P31` có caption minh họa ảnh AI; `/education*` không highlight tab `Việc làm`; luồng B2B F01 và Tuyển sinh F05/F06 giữ đúng ngữ cảnh qua reload/Back. |
| **AC-PG-04** | `PG-04` (`P09`–`P19`) | `0` chuỗi `KCN` sót tiếng Việt trên `/jobs` & `/saved-jobs`; `MD005` khóa ứng tuyển & dịch đúng `"Ngừng tuyển"` ở `ko`/`ja`; `SupportTools` không giao cắt Bookmark ở `390px`; `F03`/`F04` có nút thử lại; ảnh rail `/careers` giải mã sạch khi điều hướng tới thẻ cuối. |
| **AC-PG-05** | `PG-05` (`P20`–`P30`, `P39`–`P40`) | `/news` `320px` không tràn ngang, không lặp 2 ảnh watermark trong cùng khung nhìn; tất cả link tiêu đề `/events*` có `height >= 44px`; `P39`/`P40` chạy thang `16px`. |
| **AC-PG-06** | `PG-06` (`P36`, `P37`, `P38`, `P41`) | Khoảng cách từ mép dưới Header tới `.admin-demo` bằng `0px`; `/admin-demo` có `"Xóa bộ lọc"`, dịch đủ modal/CMS và giữ sửa `MD-001..006` trong phiên; link map `/contact` `>= 44px` và bỏ góc `3px`; `P41` scale chuẩn `390/820/1440`. |
