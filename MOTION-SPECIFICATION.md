# MDV2 — MOTION SPECIFICATION (`MOTION-SPECIFICATION.md`)

**Candidate UI SDD Version:** `MDV2-UI-SDD-v2.0.0-CANDIDATE`  
**Ngày lập:** 28/11/2026  
**Nguồn hợp nhất:** `MDU-SDD-v1.0.0` (`MDU-SDD-05`, 88 mã `MI01–MI08` / `MO01–MO08` / `MS01–MS06`), `brand-colors.css`, `motion.tsx`, `HomeHero.tsx`, `useHomeCarousel.ts`, `PartnersStrip.tsx`, và P1 Audit (`IMP-02`, `IMP-05`, `IMP-10`).  
**Trạng thái:** **CANDIDATE_FOR_PO_APPROVAL** *(Không tự bật spring, route fade hoặc hiệu ứng trang trí ngoài phạm vi PO duyệt).*

---

## 1. Hệ thống Motion Tokens chuẩn (Thống nhất từ `MDU-SDD-05`)

| Token | Giá trị chuẩn | Easing | Phạm vi áp dụng | Trạng thái phê duyệt |
|---|---|---|---|---|
| `--motion-t0` | `0ms` | — | Cập nhật ARIA, focus, validation error, trạng thái nút (`aria-pressed`), mọi chuyển động khi bật `prefers-reduced-motion: reduce` | `BASELINE_APPROVED` |
| `--motion-t1` | `120ms` | `ease-out` | Đổi màu viền, hover/pressed nút, badge, tab active | `BASELINE_APPROVED` |
| `--motion-t2` | `180ms` | `ease-out` | Submenu desktop, FAQ accordion, crossfade poster/ảnh, trượt từng bước `ServiceShowcase` / `FeaturedNews` | `BASELINE_APPROVED` |
| `--motion-t3` | `240ms` | `ease-out` | Modal, mobile Drawer, `RevealFrame` (`opacity 0→1`, `translateY 8px→0`) | `BASELINE_APPROVED` |
| `--motion-t4` | `320ms` | `ease-out` | Chuyển cảnh lớn có chủ đích: `AnimatedNumberGroup` đếm số, màn kết Hero (`hero-space-settle`, `hero-brand-rise`), rail 1 nhịp | `CANDIDATE_DEFECT_FIX` (giảm từ `1800/800/500ms`) |
| **Gated / Off** | — | `spring` / `route-fade` | `MS01-4` (spring), `MO05-1` (fade chuyển trang), `MO08-2` (trang trí màn kết Hero) | `GATED / BLOCKED` (giữ OFF mặc định) |

**Giải quyết xung đột token (`CS-C03-1` vs `MS01-1`):** Chính thức chuẩn hóa về `T2 = 180ms` và `T3 = 240ms`, loại bỏ token `200ms` riêng và loại bỏ mọi thời lượng lệch chuẩn đã phát hiện ở P1 (`1800ms`, `800ms` ở `hero-media.css`; `500ms` ở `useHomeCarousel.ts`; `260ms` ở `editorial-reference.css`; `160ms` ở `jobs.css`; `150ms` ở `home-video-gallery.css`; `.45s`/`.4s` ở `info.css`).

---

## 2. Bảng đặc tả hành vi Motion theo từng nhóm tương tác

| Mã | Thành phần / Luồng | Nguồn | Trạng thái phê duyệt | Trigger | Feedback & Thời lượng | Cancellation & Interruption | Rapid Input | Reduced Motion (`prefers-reduced-motion: reduce`) |
|---|---|---|---|---|---|---|---|---|
| **MOT-01** (`MI01`–`MI08`) | Nút CTA, `SaveButton`, Bộ lọc Jobs, Form F01–F06, `AttachmentPicker`, FAQ/Tab | `MDU-SDD-03/05`, `IMP-15` | `BASELINE_APPROVED` + `CANDIDATE_DEFECT_FIX` | Click / Tap / Enter / Space / Focus / Input | Trạng thái dữ liệu & ARIA (`aria-pressed`, `aria-invalid`, `aria-expanded`) cập nhật tại `T0 (0ms)`; màu/viền tại `T1 (120ms)` | Không khóa click bởi `transitionend`; pointer cancel không kích hoạt click thứ hai; hủy OS file picker giữ danh sách file cũ | Rapid toggle `SaveButton` hoặc mở–đóng–mở menu/FAQ 3 lần trong `150ms` giữ đúng ý định cuối, không kẹt lớp ẩn | Giữ `T0` cho mọi đổi màu/trạng thái; bỏ mọi dịch chuyển; đầy đủ nhãn và focus |
| **MOT-02** (`MO01`–`MO03`) | `Header` Submenu, Mobile Drawer, `Modal`, `FAQ` | `MDU-SDD-05`, `AC-MOT-CORE-01/02` | `BASELINE_APPROVED` | Hover (`mouse` + `hover:hover`), Focus, Click, Tap | Submenu mở/đóng `T2 (180ms)`; Drawer/Modal `T3 (240ms)`; FAQ mở tức thì hoặc `T2` | Di chuột nhanh qua nhiều nhóm menu hủy timer cũ ngay; nhấn `Escape` hoặc chạm nền ngoài giải phóng `inert` & trả focus dù transition chưa xong | Chuyển nhanh giữa Search / Drawer / Consultation Modal đóng overlay trước đó (`header-overlay-open`), không chồng backdrop | Hiện/ẩn ngay ở `0ms`, thứ tự `Tab` & trả focus giữ nguyên 100% |
| **MOT-03** (`MO06` + `IMP-05`) | `RevealFrame` & `AnimatedNumberGroup` (`motion.tsx`) | `MDU-SDD-05`, `IMP-05` | `CANDIDATE_DEFECT_FIX` | Cuộn trang vào/ra viewport (`IntersectionObserver`) | `RevealFrame`: `T3 (240ms)` `opacity + translateY(8px)`, stagger tối đa `40ms` (trần `120ms`). `AnimatedNumberGroup`: `T4 (320ms)` cubic ease-out | **Fix `IMP-05`:** Khi khối bị che (`document.hidden`), hủy `rAF` hiện tại và chốt giá trị hiển thị hợp lệ; **không reset `progress = 0` khi rời viewport (`rearm`)** hoặc khi đang có phần tử nhận focus (`focusLocked`) | Nhảy thẳng qua neo `#about` hoặc `#business-contact` phải hiển thị nội dung (`opacity: 1`) và số cuối (`1200+`, `80+`, `15+`, `95%`) ngay, không để khoảng trắng trống | Toàn bộ khối luôn ở `opacity: 1`, `transform: none`, 4 chỉ số giữ tĩnh giá trị cuối; chuyển preference giữa lúc đang chạy chốt ngay trạng thái cuối |
| **MOT-04** (`MO07` + `IMP-10`) | `ServiceShowcase`, `PartnersStrip`, `AboutPage` History/Milestones, `ServiceCustomers`, `Careers`, `FeaturedNews` | `MDU-SDD-05/09`, `IMP-06/10` | `CANDIDATE_DEFECT_FIX` | Tự chạy (nếu không `reduce`), nút `Prev/Next`, kéo chuột/touch, phím mũi tên | `ServiceShowcase` / `FeaturedNews` / `History` trượt 1 bước trong `T2–T4 (180–320ms)` qua `slideRailTo` (thay `500ms` & `scrollTo` của History); `PartnersStrip` chạy liên tục `22px/s` | Tạm dừng tức thì khi: hover chuột, focus bàn phím vào vùng rail, nhấn giữ/kéo, cuộn wheel, tab ẩn (`document.hidden`), hoặc có Modal mở (`#root[inert]`). **Nút Pause do người dùng bấm không tự bật lại khi rời focus/hover** | Bấm `Next`/`Prev` liên tiếp hủy `slideRailTo` cũ (`interruptSlide`) rồi bắt đầu mục tiêu mới từ vị trí scroll hiện tại | Tắt toàn bộ tự chạy; `PartnersStrip` hiển thị lưới tĩnh (không gây hydration jump); mọi thẻ xem được qua cuộn/nút hoặc lưới tĩnh |
| **MOT-05** (`MO08` + `IMP-02`) | `HomeHero` Video (`132.13s`) & Màn kết | `MDU-SDD-07`, `IMP-02/10` | `CANDIDATE_DEFECT_FIX` + `PENDING_PO_DESIGN_APPROVAL` | Vào trang (nếu cho phép autoplay không tiếng), click Play/Pause/Replay, sự kiện `ended`, cuộn trang | Chuyển poster ↔ video / màn kết tại **`T4 (320ms)`** (giảm từ `1800ms`/`800ms`). **Fix `IMP-02`:** Không pause chỉ vì `1px` scroll; chỉ chuyển `paused` khi `scrollY >= 80px` hoặc Hero `< 60%` visible | Replay hủy fade cũ, reset `currentTime = 0`; nếu `ended` xảy ra khi Hero ngoài viewport hoặc tab ẩn, hoãn mở card (`deferredCard`) tới khi Hero hiển thị lại để tránh nhảy bố cục đang đọc | Bấm Pause/Resume liên tiếp dùng `attempt.current` token để bỏ qua promise `play()` cũ bị reject | Không tự tải/tự phát video; mở ngay trạng thái `fallback` tĩnh có logo, slogan, 2 CTA và nút `"Phát video giới thiệu"` thủ công |

---

## 3. Tiêu chí đạt Motion (`AC-MOT-*`)

- **AC-MOT-SDD-01 (Token Compliance):** Quét toàn bộ stylesheet được biên dịch: `0` transition/animation ngoài `T0–T4` (`<= 320ms`, `ease-out`) trừ vòng cuộn liên tục `22px/s` có điều khiển Pause của `PartnersStrip`.
- **AC-MOT-SDD-02 (`MOT-01` Interactive State & File Picker):** Click/Enter/Space trên `SaveButton`, bộ lọc, FAQ và form F01–F06 cập nhật `aria-pressed`/`aria-expanded`/`aria-invalid` ở khung hình `0ms`; toggle nhanh 3 lần trong `150ms` khớp state cuối; cancel file picker giữ nguyên danh sách file đã chọn.
- **AC-MOT-SDD-03 (`MOT-02` Overlay & Mutual Exclusion):** Submenu (`180ms`) và Modal/Drawer (`240ms`) đóng mở nhanh không kẹt lớp ẩn chặn click; mở Search/Drawer/Support panel tự đóng overlay trước đó (`1` overlay tối đa); nhấn `Escape` giải phóng `inert` và trả focus về nút kích hoạt trong `0ms` logic.
- **AC-MOT-SDD-04 (`MOT-03`–`MOT-05` Interruption & Reduced Motion):** Trên Chromium: `scrollY = 20px` không ngắt video Hero (`scrollY >= 80px` mới pause); nhảy anchor `#about` & `#business-contact` hiển thị đủ nội dung và `1200+/80+/15+/95%`; chuyển `prefers-reduced-motion: reduce` giữa lúc animation đang chạy chốt ngay trạng thái đọc được.
- **AC-MOT-SDD-05 (Localized Rail Controls):** Tất cả nút Pause/Play trên mọi rail đều dịch đủ 5 ngôn ngữ và trỏ `aria-controls` đúng `id` danh sách.
