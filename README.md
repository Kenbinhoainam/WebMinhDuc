## Bản v18 — triển khai sáu nhóm trang

Giới thiệu, Dịch vụ/Tuyển sinh, Việc làm, Tuyển dụng nội bộ, Tin tức/Sự kiện và Liên hệ/Tư vấn đã triển khai theo phương án v17. Hệ đầu trang sáng/xanh, bố cục riêng cho từng hành trình, 11 ảnh thật trong tuyển dụng nội bộ và hai ảnh AI không gian ý niệm. [Bàn giao và kiểm tra v18](docs/flagship/v18/IMPLEMENTATION.txt).

Bộ lọc theo đúng nhóm việc, CTA và tóm tắt xuất hiện trước nội dung dài trên mobile; các luồng quay lại giữ ngữ cảnh/focus. Sáu biểu mẫu giữ quy tắc dữ liệu mẫu và tệp hiện có; F01 giữ đúng dịch vụ, F05/F06 đồng bộ URL, chọn giờ khóa F02 và giữ nháp. Rail tự chạy có điều khiển nhìn thấy, dừng khi dùng bàn phím, mở modal, khuất hoặc giảm chuyển động. Hồ sơ và bốn chỉ số v13 cùng video trang chủ được giữ lại. V18 chưa có xác nhận trực quan trên trình duyệt do managed preview lỗi relay.

## Bản v17 — sửa huy hiệu header và phương án sáu nhóm trang

Sửa số việc đã lưu: căn giữa, giữ vùng bấm 44 px, hiển thị `99+` từ 100 và đọc đủ số lượng qua nhãn truy cập. [Phương án tổng hợp](docs/flagship/v17/PHUONG-AN-TONG-HOP.txt) và [bảng thiết kế](docs/flagship/v17/review/index.html) gồm sáu báo cáo do sáu agent GPT-6.2 Astra nghiên cứu, cùng hai ảnh AI kiến trúc đã tối ưu. Các bố cục sáu nhóm trang là đề xuất, chưa triển khai. Xem [kiểm tra v17](docs/flagship/v17/VALIDATION.txt).

## Bản v16 hiện tại

Hero 16:9 kín nền khi phát; desktop header trong suốt trên phim, mobile tách hàng 72px. Màn kết kiến trúc AI sáng chứa logo gốc, slogan và hai CTA. Nội dung/ảnh thật và hiệu ứng mới: [chi tiết v16](docs/flagship/v16-implementation.txt). Bản v13 đối chiếu: https://minhduc-v13-comparison.kenbinhoainam.chatgpt.site.

## v15 — Hero và hình ảnh, 25/11/2026

Header trong suốt phủ lên video. Video đầy đủ 132,13 giây được căn giữa và giữ tỷ lệ; mobile phát trong khung 16:9. Khi phát hết, thẻ kính chứa logo gốc, slogan và hai CTA nằm giữa vùng hero trên ảnh kiến trúc xanh/vàng. Khung kết thúc tăng chiều cao theo nội dung trên màn hình hẹp; phát lại do người xem chọn.

Menu Hồ sơ năng lực mở trực tiếp `/e-brochure`, giữ nguyên trình xem ba trang như v13. Khôi phục bốn thẻ chỉ số v13 và chuyển động tương ứng. Ba mục Giới thiệu còn lại giữ anchor, `/about-us#profile` vẫn truy cập được. Sáu biểu mẫu v14 và năm ngôn ngữ được giữ nguyên.

Ảnh mới dùng các bản WebP đáp ứng theo kích thước; video và logo không tạo lại bằng AI. Xem [phương án và kiểm tra v15](docs/flagship/hero-imagery-v15.md). Managed preview hiện lỗi relay; kiểm tra mã/DOM không thay cho kiểm tra trực quan trên trình duyệt.

## v14 — B2B Minh Đức, 25/11/2026 (lịch sử)

Giữ phong cách HR2B; trang chủ hướng tới nhà máy/FDI miền Bắc với CTA “Gửi nhu cầu nhân lực”. Video gốc phát đủ 132,13 giây rồi hiện màn kết logo/slogan, không tự lặp; replay do người xem chọn. Hai CTA luôn có bên dưới khung video. Mobile giữ 16:9, không cắt hai bên.

Menu v1.2: 7 nhóm, 14 mục con; bốn mục Giới thiệu trỏ đến `/about-us#profile`, `#history`, `#partners`, `#achievements`. Sáu biểu mẫu F01–F06 tuân theo trường bắt buộc mới. F04/F06 nhận tệp tùy chọn, tối đa 3 tệp, 5 MB mỗi tệp và 15 MB tổng (MB thập phân). Biên nhận và ADMIN chỉ là dữ liệu trong bộ nhớ phiên, không gửi hoặc lưu tệp thật.

Thông tin liên hệ lấy từ INDEX trong `src/company.ts`. Cấu hình video trong `src/hero-assets.json`, quy trình và số đo mã hóa trong `docs/flagship/minhduc-media-v14.md`. Không nâng độ phân giải 1024×576 thành 1080p. Giữ website riêng tư và noindex.

Kiểm tra trọng tâm mới: `tests/v14-forms-demo.mjs`, `tests/about-anchors.mjs`, `tests/home-b2b.mjs`, `tests/business-info.mjs`, `tests/media.mjs`, `tests/hero-review.mjs`. Kết quả dựng tĩnh/DOM không chứng minh tốc độ mạng hoặc hiển thị trên thiết bị thật.

# Minh Đức Vina — Prototype 13 / Đối chiếu và tái dựng từng trang HR2B

Prototype React + TypeScript theo bố cục HR2B reconstruction do người dùng cung cấp, dùng logo/thông tin Minh Đức từ MDxGenZ_Website và được đối chiếu với toàn bộ bản “MinhDucWeb - Sprint 1” đã gửi ngày 16/11/2026.

Quy trình và tiêu chí chất lượng cho các nhiệm vụ tiếp theo được lưu tại [AGENTS.md](AGENTS.md).

## Chạy dự án

Khuyến nghị Node.js 24 (phiên bản dùng để kiểm thử). Trên Windows PowerShell có thể dùng `npm.cmd`.

```sh
npm ci
npm run dev
npm run build
npm run preview
npm test
npm run test:sprint
npm run test:seo
npm run test:hydration
npm run test:review
npm run test:catalog
npm run test:flagship
npm run test:motion
npm run test:hero
npm run test:sitemap
npm run test:header
npm run test:reference
npm run audit:i18n
```

`npm run build` tạo HTML sẵn cho 41 trang × 5 ngôn ngữ và các alias cũ. `audit:i18n` là báo cáo phát hiện chữ Việt còn lại, cần phân biệt tên riêng với thiếu bản dịch.

## Nâng cấp flagship

Menu đúng 2 cấp với 7 nhóm chính và 14 mục con theo sitemap; header một hàng trong suốt trên hero, kính sáng khi cuộn; menu con và chọn ngôn ngữ đồng bộ; mobile dùng accordion; selector ngôn ngữ có cờ SVG và tên; đối tác chạy liên tục với điều khiển dừng luôn nhìn thấy; rail dịch vụ điều khiển được ở mọi cỡ; animation được gắn vào các khối chính. Ảnh dùng WebP/srcset, video chỉ tải khi phù hợp, bản dịch được chia theo ngôn ngữ. Bản v11: [đối chiếu nguồn trực tiếp và menu v11](docs/flagship/live-reference-v11.md), [kiểm thử v11](docs/flagship/reference-v11-review.md). Bản trước: [bố cục, chuyển động và menu v9](docs/flagship/reversible-reveal-v9.md). Bản trước: [giao diện và chuyển động theo video v8](docs/flagship/video-reference-v8.md). Bản trước: [đồng bộ header, hover và đối tác v7](docs/flagship/unified-header-v7.md). Bản trước: [header theo ảnh tham chiếu v6](docs/flagship/header-reference-v6.md). Bản trước: [menu, kính và chuyển động v5](docs/flagship/sitemap-motion-v5.md). Kế hoạch, nghiên cứu và kết quả đo trước đó: [research-and-validation.md](docs/flagship/research-and-validation.md).

[Báo cáo đối chiếu chi tiết 41 trang](docs/flagship/comparison-v12-v13/Doi-chieu-chi-tiet-41-trang-HR2B-MinhDuc.pdf) · [Tái dựng từng trang và kiểm thử v13](docs/flagship/reference-v13-review.md) · [Link media trước nâng cấp](docs/flagship/media-before.csv) · [Link media đang dùng và phiên bản tối ưu](docs/flagship/media-v13.csv) · [Google Sheet: link, vị trí và công dụng ảnh/video](https://docs.google.com/spreadsheets/d/1nlSt8TERqKC4Bq-0ea6CmovRRph1Vfgpl2U02bwCIBA/edit).

Sau khi sửa các catalog, chạy `npm run generate:locales` trước build. `prebuild` kiểm tra file sinh có khớp nguồn. Các ảnh tối ưu đã được lưu trong repository; chỉ cần ffmpeg/ffprobe khi muốn tái sinh bằng `node scripts/optimize-media.mjs`.

## Phạm vi

- Năm ngôn ngữ hoạt động: Việt, Anh, Trung giản thể, Hàn, Nhật. Chuyển ngôn ngữ giữ trang, bộ lọc và anchor; các bản dịch là bản nháp prototype.
- Bảy nhóm menu chính: Trang chủ, Giới thiệu, Dịch vụ, Việc làm, Tuyển dụng nội bộ, Tin tức, Liên hệ; trang phụ có lối truy cập theo nhóm.
- Năm dịch vụ: giới thiệu/cung ứng nhân lực, cho thuê lao động, headhunt/tay nghề, tuyển sinh cao đẳng/đại học, setup tổ chức/phần mềm doanh nghiệp.
- Trang chủ v16: video hero, giới thiệu, bốn chỉ số v13, ba nhu cầu doanh nghiệp, năm giải pháp, quy trình cùng đối tác, con người Minh Đức, biểu mẫu nhân lực, địa điểm kết nối và ba bài viết/hoạt động. Animation cuộn, số đếm, hover, modal/menu hỗ trợ reduced-motion.
- Tám vị trí mẫu, bộ lọc KCN/loại việc/tay nghề/ca ngày–đêm/chuyên–xoay/trạng thái; lưu việc trên thiết bị. Tuyển nội bộ tách khỏi danh sách lao động. Tin đóng vẫn đọc được nhưng không nhận ứng tuyển thử.
- Ba chương trình tuyển sinh giả định theo hình thức từ xa/chính quy; không gắn với trường chưa xác minh.
- Sáu biểu mẫu F01–F06: nhu cầu doanh nghiệp, liên hệ chung, ứng tuyển lao động, ứng tuyển nội bộ, tư vấn tuyển sinh, hồ sơ tuyển sinh. Tệp tùy chọn theo từng biểu mẫu, JPG/JPEG/PNG/PDF/DOC/DOCX; tối đa 3 tệp, 5 MB/tệp và 15 MB tổng (đơn vị thập phân).
- `/consultation`: chọn ngày/giờ, điền biểu mẫu F02 và xem xác nhận minh họa; không đặt lịch hoặc gửi dữ liệu thực tế.
- `/admin-demo`: sáu hàng đợi hồ sơ giả, tìm/lọc, mã tin/chương trình, nguồn, ngày nhận, người phụ trách, trạng thái, cảnh báo trùng, xuất CSV mẫu, CMS và vai trò minh họa.
- SEO/AEO: HTML prerender, tiêu đề/mô tả/canonical/OG riêng, `html lang`, hreflang, sitemap; Organization/WebSite/WebPage/BreadcrumbList/FAQPage khớp nội dung. Giữ **noindex** và quyền xem riêng tư. Không dùng schema JobPosting/Event/Review cho dữ liệu giả.

## Dữ liệu và giới hạn

Thông tin nhập **không gửi ra ngoài**; dữ liệu giả đã nhập được giữ trong bộ nhớ phiên và có thể xem trong ADMIN đến khi tải lại trang. Nội dung tệp không được đọc, tải lên hay lưu. Thao tác quản trị tồn tại trong bộ nhớ đến khi tải lại trang. Chuyển vai trò là mô phỏng giao diện, không phải xác thực hay phân quyền bảo mật.

Chưa có backend, CMS vận hành, tiếp nhận hồ sơ thật, tệp riêng tư, email/Google Sheets, chống spam, analytics thật, AI hoặc CRM. Cần chốt quy tắc nghiệp vụ, nội dung, bảo mật và hạ tầng trước phát triển bản sản xuất. Xem [đối chiếu yêu cầu và quyết định](docs/sprint-1/requirements-and-decisions.md).

Logo, hotline, Zalo/Facebook và năm đối tác lấy từ bảng nguồn. Ảnh/video HR2B chỉ là tham chiếu giao diện; không phải ảnh tập thể Minh Đức. Số liệu, lương, nhân vật, bài viết và sự kiện đều minh họa. Ba điểm Phúc Long, Rùa Vàng và KCN Đông Mai đều có liên kết Maps trong src/company.ts. Tài khoản WeChat chưa được cung cấp. Sitemap trong ảnh mới đã được đối chiếu và áp dụng; người dùng xác nhận phần làm trong suốt là toàn bộ header/menu.

## Kiến trúc

- `App.tsx`, `Header.tsx`, `navigation.ts`, `Home.tsx`, `shared.tsx`: khung, header và sitemap dùng chung, trang chủ và thành phần chung.
- `JobsPages.tsx`, `jobs-data.ts`, `saved-jobs.ts`, `CareersSections.tsx`, `Education.tsx`, `Contact.tsx`, `Consultation.tsx`: dữ liệu dùng chung, bộ lưu việc và các luồng demo.
- `AdminDemo.tsx`, `admin-demo-data.ts`: quản trị minh họa, dữ liệu giả độc lập.
- `pages/info/`: các module giới thiệu, dịch vụ, đối tác và hồ sơ năng lực; `EditorialPages.tsx`: tin tức, sự kiện và chính sách. `InfoPages.tsx` chỉ xuất lại các thành phần để giữ tương thích.
- `i18n.tsx`, `i18n-runtime/`, `i18n-catalogs/`: locale theo URL và bản dịch. JSX runtime dịch nội dung/nhãn hiển thị, giữ nguyên IDs, URL, form values và dữ liệu người dùng nhập. Chuỗi động dùng `useTranslation`.
- `src/seo/`, `entry-server.tsx`, `scripts/prerender.mjs`: metadata và xuất HTML tĩnh; không dùng dịch DOM sau hydration.
- `motion.tsx`/`motion.css` và CSS theo trang: animation, responsive, reduced-motion.

### Chuẩn bị chuyển sang Next.js

Prototype hiện chạy Vite và React Router. Khi chuyển sang App Router, có thể lấy đường dẫn tĩnh từ `pages` trong `src/seo/routes.ts` và `localizedPath` trong `src/i18n-runtime/paths.ts`. Phần metadata trên server gọi `await loadLocale(locale)` trước `localizedSeo(path, locale)` để nhận tiêu đề, mô tả, canonical, hreflang và JSON-LD theo ngôn ngữ. Các hàm này chạy được trong Node.

Trang chủ và danh mục dùng chung dữ liệu và thẻ dịch vụ. Nơi hiển thị chỉ quyết định dùng dải kéo hay lưới. Với tin tức, `EditorialCard` nhận URL và ngôn ngữ qua props. `RoutedEditorialCard` phụ trách điều hướng của prototype và khôi phục bộ lọc. Khi thay router, cần kiểm tra lại đường quay về danh sách, neo biểu mẫu và các liên kết đã chia sẻ. Phần phát phim, kéo thẻ và lưu việc trên thiết bị cần chạy ở phía trình duyệt.

## Kiểm thử

Các kiểm tra gồm TypeScript/build, lưu việc và file CV, các luồng ứng tuyển/bộ lọc/tin đóng, validation biểu mẫu, quản trị mẫu, SEO 205 route, hydration đa ngôn ngữ và đánh giá độc lập. Kết quả Sprint 1 ở `docs/sprint-1/validation.md`; kết quả mới nhất ở `docs/flagship/v16-implementation.txt`.

Kiểm thử DOM dùng jsdom, không thay thế kiểm thử trực quan. Managed preview gặp lỗi relay readiness timeout; chưa có phiên kiểm tra trực quan thành công cho bản này. Chưa xác minh giao diện, video hoặc responsive trực tiếp trên browser và chưa có điểm Lighthouse/CWV.

## Nguồn và bàn giao

- Baseline người dùng chọn: `Kenbinhoainam/WebMinhDuc`; bản local bàn giao tại `/workspace/WebMinhDuc`. Chưa đẩy thay đổi lên GitHub.
- Sites dùng kho source hosting riêng; `.openai/hosting.json` giữ ID của prototype đang triển khai. Thay cấu hình này khi triển khai dưới Site khác.
- [Mẫu HR2B](https://drive.google.com/drive/folders/1BOV8hCaMc4JsXmkmUMKKcALsjm06gdfC)
- [Thông tin Minh Đức](https://docs.google.com/spreadsheets/d/1SFbcwntvl7E13yGO--6tAISyIuxddhx4UwsrOGgx6VA/edit)
- `docs/sprint-1/source.txt`: nguyên văn nội dung Sprint 1 do người dùng cung cấp.
