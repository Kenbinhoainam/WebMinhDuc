# MDV2 — P1: FLAGSHIP UI/UX FULL AUDIT (`UI-AUDIT.md`)

**Ngày kiểm định:** 28/11/2026  
**Vai trò thực hiện:** Principal Product Designer, UI/UX Auditor, Design System Specialist & Accessibility Reviewer  
**Phạm vi:** Đánh giá toàn diện giao diện Website Minh Đức V2 (**chưa chỉnh sửa mã nguồn giao diện**).  
**Trạng thái:** Audit tài liệu chờ Project Owner xem xét và lựa chọn cải tiến trước khi đặc tả/triển khai. Không tự công bố đã nghiệm thu.

---

## 1. Nguồn đối chiếu & Phạm vi đã xác minh

### 1.1. Nguồn mã nguồn, đặc tả và QA đã đọc trực tiếp
- **Baseline GitHub Pages & nhánh chính:** `origin/prototype@19ac2b365f2264399fde4312639127b8de80736f` (artifact tĩnh Sprint 2 đang phục vụ live tại `https://kenbinhoainam.github.io/WebMinhDuc/`, HTTP 200).
- **Source Sprint 2 đã đối chiếu tái tạo (545/545 tệp khớp byte-for-byte + fix tràn ngang `/news/` 320px):** `origin/feat/s2-reconcile-and-complete@848458ea60900ceebaa8f131550cbf8d2417f1bc` (PR #12), kế thừa mã nguồn từ PR #3 (`1300df84` / `66b76036`).
- **Tài liệu chuẩn & Governance:**
  - `SEL-2026.11.27-v1.0.0`, `MDU-SDD-v1.0.0.md` (SDD-01..SDD-13), `MDU-PLAN-v1.0.0.md`, `MDU-DEC-v1.0.0.md`, `MDU-TRC-v1.0.0.md`.
  - Danh mục 41 trang `P01–P41` (`docs/flagship/comparison-v12-v13/Doi-chieu-41-trang.csv`, `RESULT-BY-CHOICE.csv`, `src/seo/routes.ts`).
  - Báo cáo QA Sprint 2 (`QA-RESULTS.md`, `TRACE-GAPS.md`, `QA-RESULTS-ANTIGRAVITY.md`), Governance/UX specs trên PR #9/#11 (`983c90e5`, `31b94f4f`: `MDV2-UX-01.md`, `MDV2-FUNC-01.md`), và đánh giá SuccessHRVN trên PR #1 (`05-sdd-successhrvn-review.md`).
- **Tham chiếu trực quan bên ngoài:**
  - **REF-UI-01 (`https://minhduccorp.com.vn/`):** Đã truy cập và chụp trực tiếp trên Google Chrome (Desktop `1440×900` và Mobile `390×844`).
  - **Preview riêng ChatGPT Sites (`https://minhduc-sprint2-approved-review.kenbinhoainam.chatgpt.site/`):** Trả về **HTTP 401** (yêu cầu đăng nhập ChatGPT của Project Owner) → **không truy cập được**, không giả nhận đã kiểm tra trực tiếp preview này.
  - **HR2B & SuccessHRVN:** Dùng làm đối chiếu bổ sung từ tài liệu `docs/flagship/` và `docs/master/05-sdd-successhrvn-review.md`.

### 1.2. Phương pháp kiểm tra trình duyệt thật (Google Chrome / Playwright)
- Dựng bản build thực tế từ `848458ea` (`npm ci && npm run build`, phục vụ qua `vite preview` tại `http://127.0.0.1:4173/WebMinhDuc/`) và đối chiếu live trên `https://kenbinhoainam.github.io/WebMinhDuc/`.
- Kiểm tra toàn bộ **41 trang `P01–P41`** trên các viewport đại diện (`320×740`, `390×844`, `768×1024`, `1440×900`, `1920×1080`), 5 ngôn ngữ (`vi`, `en`, `zh-Hans`, `ko`, `ja`), trạng thái cuộn/tương tác, kiểm ảnh sau cuộn (`loading="lazy"`), tap target, heading hierarchy, lỗi console/network, và quay screen recording `.webm` luồng tương tác.

---

## 2. Chẩn đoán tổng thể: Vì sao MDV2 chưa đạt cảm giác Flagship & còn dấu vết "ghép mẫu"

Xét về mặt kỹ thuật, đội phát triển đã giải quyết rất tốt nhiều bài toán khó (SSR prerender 205+ route, 5 ngôn ngữ không nạp thừa chunk, dual-IntersectionObserver reveal bảo vệ focus, keyboard/Escape, F01–F06 không giả lập backend, `AttachmentPicker` chống mất file khi cancel picker, 0 overflow trên toàn bộ 41 trang ở 320–1920px).

Tuy nhiên, dưới góc độ **Principal Product Designer**, giao diện hiện tại mang rõ cảm giác **"chồng nhiều lớp vá qua nhiều phiên bản (v5 → v18 → Sprint 2)"** thay vì một hệ thống thiết kế thống nhất, vì 5 nguyên nhân cốt lõi:

1. **Va chạm thị giác ngay màn hình đầu tiên (Above-the-Fold Hero):** Trên desktop (`1440×900`), header trong suốt đặt logo chữ xanh đậm (`#183653`) lên nền video tối có sẵn watermark logo `"MINH ĐỨC"` ở góc trên trái → **hai logo chồng lên nhau và mất độ tương phản** (`docs/audit/mdv2-p1/evidence/screenshots/P01_d1440_top.png`). Đồng thời khung video 16:9 bị kẹp giữa hai dải nền tối `#0e1b2d` (pillarbox) hai bên và đẩy H1 + 2 CTA xuống dải trắng hẹp bên dưới.
2. **Xung đột hệ thống Design Token & CSS Legacy:** 33 tệp CSS chứa **316 mã hex cứng**, **11 sắc độ đỏ thương hiệu khác nhau** (`#bd1e2d`, `#e42824`, `#c92132`, `#d92129`, `#d94b4c`, `#c62836`, ...), **35 giá trị `border-radius`** (từ `2px`, `3px`, `8px`, `20px`, `999px`, đến `140px 0 140px 0`), và hai thang `rem` trái ngược nhau (`1vw` = `14.4px` ở `1440px` trên Trang chủ vs `16px` cố định trên các trang con có `.md-page-masthead`).
3. **Biến mất nội dung khi nhảy neo / chụp toàn trang & Counter tụt về `0+`:** `RevealFrame` (`src/motion.tsx`) ẩn khối chưa vào viewport ở `opacity: 0`, còn `AnimatedNumberGroup` (`src/motion.tsx:229-243`) **reset giá trị đếm về `0`** mỗi khi khối rời khỏi viewport (`rearm()`). Trên ảnh chụp/cuộn nhanh, 4 chỉ số hiển thị **`0+`, `0+`, `0+`, `0%`** (`P01_d1440_after_scroll_full.png`) thay vì `1200+`, `80+`, `15+`, `95%`.
4. **Dấu ấn "AI-generated" và tái sử dụng tài nguyên lặp lại:** Ảnh kiến trúc AI `flagship-atrium.webp` xuất hiện lặp lại từ màn kết Hero đến phần nền `::after` của hàng loạt masthead trang con (`page-system-v18.css:37`), trong khi `ServiceShowcase` vẫn trộn **3 icon PNG cũ từ HR2B** (`Solution-Icon-1..3.png`) với 2 icon vector `lucide-react` dùng CSS fill hack, và `SupportTools` dùng chữ `<b>Z</b>` / `<b>f</b>` thay cho icon vector chuẩn.
5. **Lỗi hiển thị thực tế chưa được test tự động phát hiện:** Logo đối tác `TACU` (`tacu.webp`) có chữ trắng trên nền trong suốt nhưng thiếu thuộc tính `data-dark-mark` (chỉ gán cho `FOXCONN` tại `PartnerLogo.tsx:16`), khiến chữ **`TACU` gần như tàng hình trên nền xanh nhạt `#eaf4ff`** (`P01_partners_d1440.png`). Ngoài ra, `/admin-demo` có một khoảng băng tối thừa `~80px` ngay dưới header toàn cục trên cả desktop và mobile (`P36_d1440_top.png`, `P36_m390_top.png`).

---

## 3. Đánh giá chi tiết theo từng mảng

### 3.1. Kiến trúc CSS, Design Tokens, Màu sắc & Grid/Spacing
- **Thứ tự import & Xung đột tầng CSS (`src/main.tsx:1-11`, `src/App.tsx:22-30`):**
  - `styles.css` (37 dòng nén) và `info.css` (96 dòng nén, 30.7 KB) vẫn được nạp toàn cục, buộc `sprint-navigation.css`, `page-system-v18.css`, `about-reference.css`, `editorial-reference.css` và `contact-reference.css` phải viết rule specificity cao (`.site-header.site-header`, `!important`) để ghi đè.
  - Biến `--header-height` được dùng làm biến chính trong `form-experience-v16.css:4`, `contact-reference.css:60`, `home-reference.css:34` **nhưng chưa từng được khai báo ở `:root`**, nên luôn rơi về 3 giá trị fallback khác nhau (`80px`, `84px`, `90px`).
- **Màu sắc & Độ tương phản:**
  - Bộ token lõi tại `src/brand-colors.css:9-20` (`--md-ink: #183653`, `--md-blue: #1b489d`, `--md-red: #bd1e2d`, `--md-surface-blue: #eaf4ff`) sạch, sáng và đúng nhận diện Minh Đức (xanh/đỏ/trắng).
  - Tuy nhiên ngoài `brand-colors.css`, 316 mã hex rời rạc làm bề mặt mất kỷ luật (ví dụ: xám ấm `#292929`/`#666` trong `styles.css` và `info.css` trộn với xám xanh lạnh `#486178` của hệ thống mới).
  - **Vấn đề tương phản quan sát trực tiếp:**
    1. Logo header trên video Hero ở đầu trang (`P01_d1440_top.png`): chữ xanh đậm trên lớp tối mờ → rất khó đọc.
    2. Logo đối tác `TACU` trên dải `#eaf4ff` (`P01_partners_d1440.png`): chữ trắng trên nền sáng → mất khả năng đọc.
    3. Ảnh thật Minh Đức trong `PageMasthead` (`/about-us` `P02_d1440_top.png`) cắt ngang phần chữ bảng hiệu vàng; lớp gradient tối có giúp tiêu đề trắng `"Về Minh Đức"` nổi rõ, nhưng phần trên ảnh trông bị chém khung.
- **Grid, Spacing & Hình học Card:**
  - Chiều cao trang chủ dài (**6.721 px** ở 1440px, **7.887 px** ở 390px) so với **5.088 px** của `REF-UI-01`.
  - Độ bo góc không nhất quán giữa các phân khu liền kề trên cùng trang: Service Cards (`clamp(16px, 1.4vw, 22px)`), Partners strip (`0` / `2px` trên box Foxconn / không viền rõ trên ô `#eaf4ff`), F01 input (`8px`) + submit (`9999px`), Home Editorial (`0px` vuông sắc cạnh kiểu báo chí), Video Gallery (`10px` / `5px`). Trên `/contact`, input và nút submit lại bị ép về `3px` vuông (`contact-reference.css:55,58`), lệch hẳn khỏi ngôn ngữ pill `999px` của toàn site.

### 3.2. Typography & Đa ngôn ngữ (5 ngôn ngữ: VI, EN, ZH-Hans, KO, JA)
- **Hệ chữ & Lỗi phân tách `rem`:**
  - `brand-type.css` nạp variable `Inter` + `Roboto` cho dải ký tự `vietnamese` + `latin`. Các tệp font `googlesansflex` và `montserrat` trong `public/assets/fonts/` (194 KB) **không được dùng**, trong khi CSS nhiều nơi vẫn để fallback cũ `Montserrat, sans-serif` (`education.css`, `about-reference.css`) hoặc `Arial, sans-serif` (`contact-reference.css`, `Consultation.css`).
  - **Lỗi chia đôi thang chữ (`reference-base.css:33` vs `page-system-v18.css:2`):** Trên `>=1200px`, `reference-base.css` đặt `:root { font-size: 1vw }`, khiến các route không có `.md-page-masthead` (`/` `P01`, `/admin-demo` `P36`, `/privacy-policy` `P39`, `/terms-of-use` `P40` và `404`) có `body = 14px` (và `H1 = 28.8px` ở `/`), còn tất cả các trang có `.md-page-masthead` bị ép lại `html:has(.md-page-masthead) { font-size: 16px }` (`body = 16px`, `H1 = 53.28–60.48px`). Cùng một nút/drawer dùng `rem` bị co nhỏ hơn ~10–12% ở các trang không có masthead!
  - Đối với `zh-Hans`, `ko`, `ja`, chưa có khai báo font stack CJK chuẩn (`Noto Sans SC / KR / JP`) mà dựa hoàn toàn vào `system-ui`.
- **Kiểm tra 5 ngôn ngữ & Lỗi kỹ thuật i18n phát hiện:**
  - Trong kiểm thử Chromium, 50/50 lượt kiểm cơ bản ở 390px và 1440px đạt 0 overflow ngang, đúng `html[lang]`. Tuy nhiên kiểm tra trực quan + soi mã nguồn phát hiện **4 lỗi i18n thực tế**:
    1. **React Fragment (`<>...</>`) bỏ qua dịch (`src/i18n-runtime/jsx-runtime.tsx:81-83`):** `JobsPages.tsx:87` render `{job.industrialPark && <>{job.industrialPark} · </>}` khiến `KCN Yên Phong`, `KCN Tân Hưng`, `KCN Sông Công`, `KCN Đông Mai` **vẫn là tiếng Việt trên thẻ việc làm tiếng Anh/Nhật/Trung/Hàn** (dù dropdown lọc vẫn dịch đúng!). Tương tự, `Contact.tsx:145` giữ nguyên tên dịch vụ tiếng Việt trong biên nhận F01 đa ngôn ngữ.
    2. **Chuỗi thiếu trong catalog `ADMIN Demo` (`src/AdminDemo.tsx:27,51`, `src/admin-demo-data.ts:4-9`):** Câu mặc định CMS `'Cùng Minh Đức kết nối cơ hội và nhân lực.'` và toàn bộ trường `.detail` / `.result` của 6 hồ sơ mẫu `MD-001..006` không có key trong `src/i18n-generated/{en,zh,ko,ja}.json`, nên mở modal chi tiết trên bản EN/JA/KO/ZH vẫn hiện tiếng Việt.
    3. **Nút điều khiển carousel chưa dịch (`AboutPage.tsx:214`, `ServicesPages.tsx:52-53`, `PartnersStrip.tsx:168`):** Nhãn `"Tạm dừng chuyển động..."` / `"Phát chuyển động..."` viết cứng tiếng Việt.
    4. **Ghi đè khóa dịch giữa các catalog (`scripts/generate-locales.mjs:4-6`):** 66 key trùng tên bị catalog sau ghi đè catalog trước — nghiêm trọng nhất là `'Đã đóng'` trong `jobs.json` (`모집 마감` / `募集終了`) bị `contact-admin.json` (`종료` / `完了` = "Hoàn tất/Kết thúc") ghi đè, làm huy hiệu việc làm đã đóng `MD005` ở bản tiếng Hàn/Nhật hiển thị thành "Đã hoàn thành".
    5. **Nút dài trên mobile (`P09_ja_m390_top.png`):** Nút `"その他の絞り込み"` (Bộ lọc khác) bị xuống 2 dòng chật bên cạnh nút `"検索結果を見る"` ở 390px.

### 3.3. Header, Navigation, Footer & Floating Support Tools
- **Header (`src/Header.tsx`, `src/sprint-navigation.css`):**
  - Đúng 7 nhóm chính + 14 mục con, mở submenu bằng hover/focus mượt, Escape trả focus, mobile dùng drawer.
  - **Vấn đề:**
    - Trên Home (`P01_d1440_top.png`), logo header tối màu chìm trên nền video scrim tối và **trùng vị trí** với logo watermark trong video. Khi mở dropdown `"Dịch vụ"` ở trạng thái `Hero Ended` (`P01_hero_ended_d1440.png`), menu thả xuống che mất logo `.hero-finish-logo` ở giữa màn hình.
    - Trang `/education` kích hoạt gạch chân đỏ active ở mục **`Việc làm`** trên thanh menu chính (`P32_d1440_top.png`), gây nhầm lẫn về kiến trúc thông tin cho người đi từ `/services/college-admissions`.
- **Footer (`src/Footer.tsx`, `src/footer-reference.css`):**
  - Bố cục 3 cột + thanh bản quyền gọn, đầy đủ 3 điểm liên hệ kèm link Maps và disclaimer prototype.
  - **Vấn đề:** Hai nút mạng xã hội `Facebook` / `Zalo` ở `.footer-top` chỉ là pill chữ trơn không có icon thương hiệu; nút `"Đăng ký nhận bản tin"` ở cột 3 dùng kiểu `.btn` đỏ rực cạnh tranh độ chú ý với CTA chính của trang; thông tin pháp lý/MST hoặc phân nhóm liên kết B2B/B2C chưa phân tách rõ bằng cấp độ thị giác.
- **SupportTools (`src/SupportTools.tsx`, `src/SupportTools.css`):**
  - Có 1 launcher duy nhất, nhưng khi mở hoặc đứng trên mobile (`P09_ja_m390_top.png`, `P36_m390_top.png`), nút tròn đỏ cố định ở góc dưới phải **đè lên icon Bookmark lưu việc làm** ở thẻ việc làm đầu tiên và đè lên phần mép phải thanh tiêu đề bảng ADMIN.
  - Nút Zalo/Facebook trong panel hỗ trợ dùng ký tự **`<b>Z</b>`** và **`<b>f</b>`** trông thô và thiếu chuyên nghiệp.

### 3.4. Hero Video, Animation, Carousel & Trạng thái Loading/Empty/Error/Reduced Motion
- **Hero Video (`src/HomeHero.tsx`, `src/hero-media.css`):**
  - Điểm đạt: Giữ video gốc 132,13 giây (`preload="none"`), tự kiểm soát `saveData`/`2g`/`prefers-reduced-motion`, phát xong hiện `.hero-brand-finish` qua sự kiện `ended` thật, hoãn đổi chiều cao khi khuất (`deferredCard`), có nút Replay/Mute.
  - **Lỗi UX nghiêm trọng (`HomeHero.tsx:108-115`):** Chỉ cần người dùng nhích cuộn xuống **`1px` (`y > lastScrollY`)**, `onScroll` gọi `pauseForChoices('scroll')` ngay lập tức: video dừng, màn hình nhảy đột ngột sang khung kiến trúc AI sáng + ẩn dải H1 phía dưới (`clip-path: inset(50%)`). Điều này gây cảm giác giật cục, mất định hướng khi mới bắt đầu cuộn trang.
  - **Vi phạm token chuyển động `MDU-SDD-05`:** `hero-space-settle` chạy **`1800ms`** và `hero-brand-rise` chạy **`800ms`** (`hero-media.css:64-65`), vượt quá mức trần `T4 = 320ms`. Tương tự `advanceHomeRail` dùng `500ms` (`useHomeCarousel.ts:163`), `editorial-reference.css:77` dùng `260ms`, `home-video-gallery.css` dùng `150ms`, `jobs.css:160` dùng `160ms`.
- **Reveal & Counters (`src/motion.tsx`):**
  - Dual-observer `RevealFrame` chống nhấp nháy tốt và bảo vệ `focusLocked`. Tuy nhiên với các neo `#about`, `#business-contact` hoặc khi chụp/cuộn nhanh, khối dưới có thể lộ trạng thái `opacity: 0` trắng trơn tạm thời.
  - `AnimatedNumberGroup` reset về `0` khi `rearm()` (rời viewport), dẫn đến trạng thái **`0+ / 0+ / 0+ / 0%`** có thể lọt vào màn hình khi cuộn nhanh hoặc trích xuất ảnh toàn trang.
- **Carousels & Lazy Images (`Careers`, `Partners`, `Services`):**
  - `PartnersStrip.tsx:18` khởi tạo `staticList = true` cho SSR rồi chuyển `false` sau mount → tạo layout shift nhẹ khi hydration ở client thường.
  - Trên `/careers/`, 3 ảnh nằm sâu trong carousel ngang (`birthday-gifts.webp`, `red-gifts.webp`, `event-hall.webp`) dùng `loading="lazy"` nên vẫn ở trạng thái chưa tải (`complete: False`, `naturalWidth: 0`) cho tới khi người dùng kéo thanh ngang tới vị trí đó.
- **Loading / Empty / Error States:**
  - `Suspense` fallback hiển thị `<div className="section route-loading" role="status">Đang tải nội dung…</div>` (nhẹ, không có skeleton làm mượt chuyển cảnh giữa các route lười).
  - Các trạng thái rỗng ở `/jobs`, `/saved-jobs`, `/news`, `/events`, `/admin-demo`, và search modal đều có thông báo rõ + nút khôi phục/điều hướng.

### 3.5. Hình ảnh, Icon & Nhận diện thương hiệu Minh Đức
- **Ảnh thật vs Ảnh AI:**
  - Các ảnh thật từ hoạt động Minh Đức (`recruitment-field.webp`, `team-meeting.webp`, `staff-meeting.webp`, `office-team.webp`, bộ 11 ảnh `/careers/`) mang lại độ tin cậy cao cho doanh nghiệp nhân sự thực tế. Tuy nhiên:
    - Một số ảnh thật bị dính **watermark góc trên trái `MINH ĐỨC`** (`P20_d1440_top.png` dùng liền hai ảnh có watermark trong cùng một khung nhìn!).
    - Ảnh bìa `/about-us` (`P02_d1440_top.png`) và `/contact` (`P37_d1440_full.png`) bị crop mất phần chữ trên bảng hiệu trụ sở.
    - Ảnh AI `flagship-atrium.webp` và `industrial-campus.webp` bị lạm dụng ở quá nhiều vị trí không có chú thích phân biệt nhất quán (`P31` Đối tác dùng `industrial-campus.webp` không chú thích, trong khi `P03` và `P32` có chú thích `"Phối cảnh minh họa..."`).
  - **Còn sót tài nguyên HR2B:** `ServiceShowcase` vẫn dùng 3 PNG `Solution-Icon-1/2/3.png` từ `/mirror/www.hr2b.com/...`, và `media-manifest.json` còn lưu 19 entry HR2B không dùng ở route chính.

### 3.6. Hành trình B2B, B2C, Biểu mẫu F01–F06 & ADMIN Demo
- **Hành trình B2B (`/` → `/services` → `/services/:slug` → `/contact?form=F01` → `/admin-demo`):**
  - Luồng dữ liệu hoạt động chính xác: F01 nhận đúng 4 trường bắt buộc (`name`, `phone`, `location`, `notes`), giữ nháp khi đổi tab F01↔F02, tạo mã `DEMO-xxxx` và truyền qua SPA `<Link>` tới `/admin-demo`.
  - **Điểm nghẽn UX:**
    - Trên `/services`, nút CTA mở modal toàn cục có F01/F02 chuyển được, nhưng trên `/services/:slug` người dùng gặp tới 2 form F01 (1 modal ở đầu trang + 1 form dài ở cuối trang).
    - Nút `"Xem bản đồ"` và `"Chỉ đường"` trên thẻ chi nhánh tại `/contact` (`P37`) chỉ cao **`32px`** (dưới mức chuẩn chạm 44px).
    - Bản đồ Google Maps nhúng ở `/contact` (`P37_d1440_full.png`) hiển thị tên địa điểm trên Google là **`Cty TNHH MD668 VINA`** (`3.7 ★`), dễ gây băn khoăn nếu không đồng bộ tên thực thể trên Google Business Profile trước khi ra bản chính thức.
- **Hành trình B2C (`/jobs` → Lọc → Chi tiết → Lưu việc → F03 / `/careers` F04 / `/education` F05–F06 → `/admin-demo`):**
  - Bộ lọc KCN/tay nghề/ca/IME hoạt động chuẩn, tin đóng `MD005` khóa nút ứng tuyển đúng yêu cầu, `SaveButton` đồng bộ `localStorage` và khôi phục focus khi bỏ lưu trên `/saved-jobs`.
  - **Điểm nghẽn UX:**
    - `F03` và `F04` trong `ApplicationDialog` (`JobsPages.tsx:355-361`) thiếu nút `"Tạo đơn thử mới / Thử lại"` trên màn hình biên nhận (trong khi `F01`, `F02`, `F05`, `F06` đều có).
    - Thông báo lỗi khi để trống số điện thoại ở `F01/F02` (`"Vui lòng nhập số điện thoại."`) khác với `F03/F04/F05/F06` (`"Vui lòng nhập số điện thoại Việt Nam hợp lệ."`).
    - Trang chủ tập trung B2B nhưng chưa có lối lọc nhanh việc làm ngay tại phần chân Hero / dải chuyển đổi để người lao động (B2C) khỏi phải mất thêm 1 bước đoán vào `/jobs`.
- **ADMIN Demo (`/admin-demo`):**
  - **Lỗi bố cục rõ ràng (`P36_d1440_top.png`, `P36_m390_top.png`):** Phía trên workspace ADMIN xuất hiện **dải nền tối rỗng cao ~80px** ngay dưới header toàn cục. Trên mobile (`390px`), người dùng phải qua 3 tầng thanh điều hướng (Global Header → Dải tối rỗng → Sidebar bar) mới thấy tiêu đề trang.
  - Bộ lọc tìm kiếm/nguồn/phụ trách/trạng thái không có nút `"Xóa bộ lọc"` khi danh sách trả rỗng, không đồng bộ query URL ngoài `?type=`/`?id=`, và chỉnh sửa 6 hồ sơ mẫu `MD-001..006` không lưu lại nếu rời `/admin-demo` rồi quay lại.

---

## 4. Phân loại đối chiếu với SDD đã duyệt (`MDU-SDD-v1.0.0`)

| Phân nhóm | Hạng mục tiêu biểu | Căn cứ |
|---|---|---|
| **A. Đã đạt theo SDD (giữ nguyên nền tảng)** | - Header ngang 7 nhóm / 14 mục con, 5 ngôn ngữ có cờ SVG, keyboard/Escape/focus.<br>- Bộ lọc việc làm IME-safe, khóa ứng tuyển `MD005`, đồng bộ `SaveButton` và focus.<br>- `F01–F06` đúng trường bắt buộc/tùy chọn, biên nhận `DEMO`, `AttachmentPicker` 3×5MB/15MB chống mất file khi cancel.<br>- Không tràn ngang (0 overflow) trên 41 trang ở `320–1920px` (đã gồm fix `/news/` từ PR #12).<br>- `noindex`, HTML prerender, bảo mật prototype không gửi dữ liệu thật. | `MDU-SDD-01..11`, `QA-RESULTS-ANTIGRAVITY.md`, `docs/audit/mdv2-p1/evidence/audit_metrics.json` |
| **B. Lỗi chưa đạt (Defect — cần sửa trong phạm vi SDD hiện tại)** | 1. Dải tối rỗng ~80px trên `/admin-demo` desktop & mobile.<br>2. Logo `TACU` trắng trên nền sáng `#eaf4ff` thiếu `data-dark-mark`.<br>3. Double-logo & thiếu tương phản logo Header trên video Hero desktop.<br>4. React Fragment làm KCN và tên dịch vụ không dịch sang 4 ngôn ngữ.<br>5. Chuỗi `ADMIN Demo` (`sampleRecords` & CMS mặc định) + 4 nút pause rail chưa dịch.<br>6. Collisions giữa các catalog (`Đã đóng` bị dịch thành "Hoàn tất" ở `ko`/`ja`).<br>7. Hero scroll `1px` cắt ngang video quá nhạy.<br>8. Counter `AnimatedNumberGroup` reset về `0+` khi rời viewport.<br>9. Animation `1800ms`/`800ms`/`500ms`/`260ms` vượt ngưỡng token `T4=320ms` của `MDU-SDD-05`.<br>10. Thang `1rem = 1vw` làm Trang chủ tách biệt cỡ chữ với trang con; thiếu `--header-height`.<br>11. Nút `"Xem bản đồ"`/`"Chỉ đường"` tại `/contact` chỉ cao 32px; nút F03/F04 thiếu retry. | Ảnh chụp thực tế Chrome + kiểm tra mã nguồn (`HomeHero.tsx`, `motion.tsx`, `PartnerLogo.tsx`, `jsx-runtime.tsx`, `reference-base.css`, `Contact.tsx`, `AdminDemo.tsx`) |
| **C. Cải tiến nâng tầm Flagship (Cần Project Owner phê duyệt trước khi đặc tả/triển khai)** | 1. Tái thiết kế bố cục Hero desktop (xử lý pillarbox, đồng bộ ảnh/video sạch không watermark, cân bằng H1/CTA so với REF-UI-01).<br>2. Hợp nhất Design System tokens (gom 11 sắc đỏ, 316 hex, 35 bo góc, xóa CSS legacy `styles.css`/`info.css`).<br>3. Thay 3 icon PNG HR2B bằng bộ vector `lucide-react` đồng bộ & bỏ hẳn `mirror/www.hr2b.com`.<br>4. Thay `<b>Z</b>`/`<b>f</b>` SupportTools bằng icon vector & xử lý tránh đè nút Bookmark ở mobile.<br>5. Tách/làm rõ active nav cho `/education` (không highlight nhầm `Việc làm`), nâng cấp layout Masthead & Editorial cards đồng bộ ngôn ngữ hình học. | Đối chiếu `REF-UI-01`, `MDV2-UX-01.md`, `MDU-SDD-13` |
