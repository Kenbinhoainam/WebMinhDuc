# MDV2 — DESIGN SYSTEM SPECIFICATION (`DESIGN-SYSTEM-SPEC.md`)

**Candidate UI SDD Version:** `MDV2-UI-SDD-v2.0.0-CANDIDATE`  
**Ngày lập:** 28/11/2026  
**Nguồn hợp nhất:** `MDU-SDD-v1.0.0` (`SDD-01`, `SDD-04`), `MDV2-UX-01 v0.1.0-DRAFT`, `MDV2-REQ-01` (`MDV2-DES-001/002`, `MDV2-LNG-001/002`), P1 Audit (`UI-AUDIT.md`, `TOP-20-IMPROVEMENTS.md`: `IMP-04`, `IMP-07`, `IMP-09`, `IMP-12`, `IMP-13`, `IMP-14`, `IMP-17`, `IMP-19`, `IMP-20`), và đối chiếu `REF-UI-01` (`https://minhduccorp.com.vn/`).  
**Trạng thái tài liệu:** **CANDIDATE_FOR_PO_APPROVAL** *(Không tự tuyên bố DESIGN APPROVED; không chỉnh sửa code trước khi PO duyệt phiên bản SDD này).*

---

## 1. Bảng hợp nhất thay đổi & Xung đột thiết kế

| Mã Spec | Nội dung đặc tả | Nguồn gốc | Trạng thái phê duyệt | Tiêu chí đạt tóm tắt |
|---|---|---|---|---|
| **DS-01** | Bảng màu thương hiệu Minh Đức (xanh navy/blue, đỏ nhấn, trắng/xanh nhạt) | `MDU-SDD-01`, `brand-colors.css` | `BASELINE_APPROVED` | Giữ lõi `#183653`, `#1b489d`, `#bd1e2d`, `#eaf4ff`, không tự đổi sang chủ đề màu lạ. |
| **DS-02** | Hợp nhất 316 mã hex & 11 sắc đỏ thành semantic tokens; khai báo `--header-height` trên `:root`; dọn `styles.css` & `info.css` | `IMP-07`, `MDU-SDD-01` | `CANDIDATE_DEFECT_FIX` + `PENDING_PO_DESIGN_APPROVAL` | 100% thành phần mới/sửa dùng `--md-*`; tối đa 1 cặp accent chính; `--header-height` thống nhất (`72px` mobile / `80px` desktop). |
| **DS-03** | Khắc phục tương phản logo `TACU` (`data-dark-mark`) & logo Header trên Hero tối | `IMP-01`, `IMP-04`, `AC-VIS-02` | `CANDIDATE_DEFECT_FIX` | Chữ thường `>= 4.5:1`, chữ lớn/logo `>= 3:1` trên mọi nền thực tế. |
| **DS-04** | Xóa bỏ `:root { font-size: 1vw }` (`reference-base.css:33`) & hack `html:has(...)`; thống nhất gốc `16px` toàn site | `IMP-07`, `MDU-SDD-01/04` | `CANDIDATE_DEFECT_FIX` | `P01`, `P36`, `P39`, `P40` và các trang `.md-page-masthead` cùng chạy trên gốc `16px`. |
| **DS-05** | Chuẩn hóa font chữ (`Inter` + `Roboto`), gỡ `194 KB` font thừa (`googlesansflex`/`montserrat`), bổ sung CJK fallback stack | `IMP-17`, `MDV2-LNG-001` | `CANDIDATE_DEFECT_FIX` | Không còn `Arial`/`Montserrat` trong CSS; CJK `zh-Hans`/`ko`/`ja` dùng font stack chuẩn OS/Noto. |
| **DS-06** | Thống nhất hệ bo góc 4 cấp (`8px`/`12px`/`16px`/`999px`), shadow xanh-navy nhất quán, bỏ góc `3px` trên `/contact` & `0px` rời rạc trên Editorial | `IMP-07`, `IMP-12`, `IMP-13` | `PENDING_PO_DESIGN_APPROVAL` | Giảm từ 35 giá trị `border-radius` xuống đúng 4 token chuẩn (`sm/md/lg/pill`), giữ alias tương thích `--md-radius-control`/`--md-radius-panel`/`--md-radius-card`. |
| **DS-07** | Thay 3 icon PNG HR2B (`Solution-Icon-1..3.png`) bằng icon vector `lucide-react` & thay `<b>Z</b>`/`<b>f</b>` SupportTools | `IMP-08`, `IMP-09`, `IMP-19` | `PENDING_PO_DESIGN_APPROVAL` | `0` request ảnh từ `/mirror/www.hr2b.com/` ở giao diện hiển thị. |
| **DS-08** | Quy ước ảnh thật Minh Đức vs ảnh AI ý niệm (gỡ watermark lặp, sửa crop bảng hiệu, gắn chú thích minh họa, `responsiveImage`) | `IMP-14`, `IMP-20`, `Quyết định v16` | `CANDIDATE_DEFECT_FIX` + `PENDING_PO_DESIGN_APPROVAL` | Không cắt chữ bảng hiệu, không lạm dụng `flagship-atrium`, ảnh AI luôn có phân biệt rõ. |

---

## 2. Color Tokens (Semantic Palette)

Kế thừa `src/brand-colors.css` làm nguồn chuẩn duy nhất và mở rộng semantic tokens để thay thế 316 hex rời rạc:

| Token CSS | Giá trị đề xuất | Vai trò sử dụng | Tương phản tối thiểu |
|---|---|---|---|
| `--md-surface` | `#ffffff` | Nền trang & thẻ chính | Nền sáng chuẩn |
| `--md-surface-soft` | `#f6faff` | Nền vùng phụ, form card, masthead sáng | Nền sáng phụ |
| `--md-surface-blue` | `#eaf4ff` | Nền vùng nhấn đối tác, tin nổi bật | Nền xanh nhạt |
| `--md-surface-dark` | `#12263f` | Nền tối Hero / plate logo trắng (`FOXCONN`, `TACU`) | Tương phản `> 10:1` với `#ffffff` |
| `--md-ink` | `#183653` | Văn bản chính & tiêu đề trên nền sáng | `11.8:1` trên `#ffffff` |
| `--md-ink-strong` | `#132a43` | Nhấn tiêu đề cấp 1, số liệu lớn | `14.1:1` trên `#ffffff` |
| `--md-muted` | `#486178` | Mô tả phụ, caption, nhãn `(Tùy chọn)` | `6.1:1` trên `#ffffff`, `5.5:1` trên `#eaf4ff` |
| `--md-blue` | `#1b489d` | Liên kết văn bản, tiêu đề thương hiệu, active border | `8.5:1` trên `#ffffff` |
| `--md-blue-hover` | `#143a7b` | Trạng thái hover liên kết/nút phụ xanh | `11.1:1` trên `#ffffff` |
| `--md-red` | `#bd1e2d` | CTA chính (`Gửi nhu cầu nhân lực`, `Ứng tuyển ngay`), lỗi validation | `5.8:1` với chữ `#ffffff` |
| `--md-red-hover` | `#971827` | Hover/Pressed CTA chính | `7.9:1` với chữ `#ffffff` |
| `--md-success` | `#166534` | Huy hiệu `Đang tuyển`, trạng thái hoàn tất mô phỏng | `7.1:1` trên `#ffffff` |
| `--md-warning-bg` / `--md-warning-ink` | `#fef3c7` / `#78350f` | Cảnh báo trùng `F03` trong ADMIN, lưu tạm bộ nhớ | `>= 7:1` |
| `--md-rule` | `#c6d9ec` | Đường kẻ chia section, viền card tĩnh | Trang trí / ranh giới nhẹ |
| `--md-control-border` | `#758ba1` | Viền input, select, checkbox (`>= 3:1` non-text contrast) | `>= 3.4:1` trên `#ffffff` |
| `--md-focus` | `#075fb9` | Vòng focus `:focus-visible` (`3px solid`, `offset: 3px`) | `6.4:1` trên `#ffffff` |
| `--md-on-dark` | `#ffffff` | Chữ, icon và logo đảo âm trên Header video tối & Footer đáy | `>= 10:1` trên `#12263f` |

**Xung đột đã giải quyết:** Loại bỏ 10 biến thể đỏ ngoài `--md-red`/`--md-red-hover` và nhóm xám ấm legacy (`#292929`, `#333`, `#666`, `#dedede`) trong `styles.css`/`info.css`.

---

## 3. Typography System (5 Ngôn ngữ)

### 3.1. Font Stack (`src/brand-type.css`)
- **Latin & Tiếng Việt:**
  - `--font-display: 'Inter', 'Roboto', system-ui, -apple-system, sans-serif;`
  - `--font-body: 'Roboto', 'Inter', system-ui, -apple-system, sans-serif;`
- **CJK Overrides (`zh-Hans`, `ko`, `ja`):**
  - `html[lang="zh-Hans"]`: `'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif` (`line-height: 1.65`)
  - `html[lang="ko"]`: `'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', system-ui, sans-serif` (`line-height: 1.6`)
  - `html[lang="ja"]`: `'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic UI', system-ui, sans-serif` (`line-height: 1.65`)
- **Dọn dẹp asset (`IMP-17`):** Xóa `@font-face` hoặc tệp không sử dụng (`googlesansflex-*`, `montserrat-*`, `194 KB`); thay mọi khai báo cứng `Arial` / `Montserrat` bằng `var(--font-body)` / `var(--font-display)`.

### 3.2. Type Scale thống nhất (`1rem = 16px` cố định mọi viewport)

| Role Token | Desktop (`>= 1024px`) | Tablet (`768–1023px`) | Mobile (`320–767px`) | Line-height / Weight |
|---|---|---|---|---|
| `--text-hero-h1` | `clamp(2.25rem, 3.2vw, 3.5rem)` (`36–56px`) | `clamp(2rem, 4vw, 2.75rem)` | `clamp(1.625rem, 6.5vw, 2.125rem)` (`26–34px`) | `1.15` / `700` |
| `--text-page-h1` | `clamp(2.25rem, 3vw, 3.25rem)` (`36–52px`) | `clamp(1.875rem, 4vw, 2.5rem)` | `clamp(1.625rem, 6.5vw, 2rem)` (`26–32px`) | `1.15` / `700` |
| `--text-h2` | `clamp(1.625rem, 2.2vw, 2.25rem)` (`26–36px`) | `1.625rem` (`26px`) | `1.375rem` (`22px`) | `1.22` / `700` |
| `--text-h3` | `clamp(1.1875rem, 1.3vw, 1.375rem)` (`19–22px`) | `1.1875rem` | `1.125rem` (`18px`) | `1.3` / `650` |
| `--text-lead` | `1.125rem` (`18px`) | `1.0625rem` (`17px`) | `1rem` (`16px`) | `1.55` / `400` |
| `--text-body` | `1rem` (`16px`) | `1rem` (`16px`) | `1rem` (`16px`) | `1.6` / `400` |
| `--text-meta` | `0.875rem` (`14px`) | `0.875rem` (`14px`) | `0.875rem` (`14px`) | `1.45` / `500` |
| `--text-input` | `1rem` (`16px`) | `1rem` (`16px`) | `1rem` (`16px` — tránh iOS auto-zoom) | `1.4` / `400` |

---

## 4. Grid, Spacing, Elevation & Border Radius

- **Layout Container:** `--md-container-max: 1280px` (`1360px` ở wide `>= 1600px`), padding ngang thống nhất `clamp(16px, 3vw, 32px)`.
- **Header Height Token:** `--header-height: 72px` (`< 1280px`, khớp chế độ Mobile/Tablet Drawer trong `sprint-navigation.css`), `--header-height: 80px` (`>= 1280px`, thanh Desktop 7 nhóm ngang).
- **Spacing Scale (bội số `4px` / `8px`):**
  - `--space-1: 4px`, `--space-2: 8px`, `--space-3: 12px`, `--space-4: 16px`, `--space-5: 24px`, `--space-6: 32px`, `--space-7: 48px`, `--space-8: 64px`, `--space-9: 80px`.
  - Section padding chuẩn: `clamp(48px, 5vw, 76px)` dọc trên desktop, `40px` trên mobile (giúp thu gọn chiều cao Home từ `6.721px` xuống mục tiêu `~5.200–5.500px`, tiệm cận `REF-UI-01` `5.088px` khi PO duyệt `IMP-16`).
- **Border Radius (Chuẩn hóa 4 cấp thay cho 35 giá trị cũ):**
  - `--md-radius-sm: 8px` (ô nhập liệu `input`, `select`, `textarea`, badge nhỏ, thumbnail)
  - `--md-radius-md: 12px` (ảnh minh họa masthead, hộp thông báo, panel lọc)
  - `--md-radius-lg: 16px` (thẻ dịch vụ, thẻ tin tức, modal, bảng ADMIN; alias `--md-radius-panel: 16px` và gom `--md-radius-card` về `16px`)
  - `--md-radius-pill: 999px` (nút `.btn`, chip bộ lọc, nút ngôn ngữ, nút hỗ trợ tròn; alias `--md-radius-control: 999px`)
- **Shadow Hierarchy (2 cấp độ dùng tông xanh navy):**
  - `--md-shadow-card: 0 4px 18px rgba(24, 54, 83, 0.08)`
  - `--md-shadow-overlay: 0 12px 32px rgba(24, 54, 83, 0.16)` (dropdown, modal, drawer, floating support panel)

---

## 5. Breakpoints, Iconography & Media Governance

- **Breakpoints ngữ nghĩa (dựa trên nội dung thực tế từ `MDU-SDD-04` & `MDU-PLAN`):**
  - `320px` (narrow mobile floor)
  - `360px` / `390px` / `430px` (mobile standard)
  - `640px` (sm: chuyển grid 1 cột → 2 cột card/form)
  - `768px` (md: tablet portrait)
  - `1024px` (lg: tablet landscape / desktop nhỏ)
  - `1280px` (xl: hiện full desktop header 7 nhóm + 3–4 cột grid)
  - `1440px` / `1920px` (wide: giới hạn max-width container, không kéo giãn dòng văn bản > `72ch`)
- **Iconography (`IMP-08`, `IMP-09`, `IMP-19`):**
  - Chuẩn hóa dùng `lucide-react` (`strokeWidth: 1.75`, kích thước `18px` trong nút, `20px` trong card/navigation, `24px` cho icon dịch vụ).
  - Bỏ 3 PNG `Solution-Icon-1/2/3.png` của HR2B (`IMP-09` chờ PO duyệt) và thay `<b>Z</b>`/`<b>f</b>` trong `SupportTools` bằng icon SVG đồng bộ nét.
  - Cờ ngôn ngữ giữ SVG inline `LocalFlag.tsx` (`100×60` viewBox).
- **Media & Quyền tài sản (`IMP-14`, `IMP-20`, `Quyết định v16`):**
  - Ảnh thật Minh Đức ưu tiên cho `/about-us`, `/careers`, `/news`, `/events`, `/contact`; điều chỉnh crop để không cắt bảng hiệu trụ sở và không lặp 2 ảnh dính watermark góc trên cùng màn hình nhìn.
  - Ảnh AI ý niệm (`flagship-atrium`, `industrial-campus`, `learning-space`) chỉ dùng cho minh họa không gian/tư duy thiết kế, bắt buộc có chú thích `"Phối cảnh minh họa..."` (bổ sung cho `P31`), không gắn thay ảnh cơ sở thật.
  - Mọi ảnh nội dung gọi qua helper `responsiveImage()` (`srcSet` + `sizes` + `width`/`height` chống CLS). Dọn 19 entry `/mirror/www.hr2b.com/` không còn dùng trong `media-manifest.json` (`IMP-20`).

---

## 6. Kiểm chứng đạt chuẩn Design System (`AC-DS-*`)

- **AC-DS-01:** Không còn `rem` biến thiên theo `1vw`; computed `body` đạt `16px` trên tất cả 41 trang ở `320–1920px`.
- **AC-DS-02:** Tất cả cặp chữ/nền (kể cả logo Header trên Hero, 5 logo đối tác, nút CTA, nhãn lỗi) đạt tối thiểu `4.5:1` (`3:1` cho chữ lớn/đồ họa UI) khi đo trực tiếp trên Chrome.
- **AC-DS-03:** `0` request tới `/mirror/www.hr2b.com/` khi duyệt toàn bộ 41 trang nếu `IMP-09` & `IMP-20` được PO duyệt.
- **AC-DS-04:** Không còn style xung đột từ `styles.css`/`info.css` ghi đè form/card của v18/P2.
