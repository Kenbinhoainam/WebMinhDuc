# Minh Đức Vina — Prototype 2

Prototype React + TypeScript, dựa trên cấu trúc giao diện của bản HR2B reconstruction do người dùng cung cấp. Dùng logo và thông tin liên hệ Minh Đức từ MDxGenZ_Website.

## Chạy dự án

Yêu cầu Node.js 22.12 trở lên.

```sh
npm ci
npm run dev
npm run build
npm run preview
npm test
npm run test:seo
npm run test:hydration
```

Windows PowerShell có thể dùng `npm.cmd` thay `npm`.

## Phạm vi triển khai

- Trang chủ: video hero, hai hành trình doanh nghiệp/người lao động, giới thiệu, dịch vụ, đối tác, cẩm nang, CTA.
- Bổ sung 4 chỉ số mô phỏng có count-up, quy trình 4 bước theo nhóm người dùng, carousel câu chuyện giả định, spotlight sự kiện/hình ảnh và FAQ.
- Animation xuất hiện khi cuộn, tương tác hover, mở menu/modal; tôn trọng reduced-motion và giữ nội dung đọc được khi JavaScript/observer không chạy.
- Giới thiệu; 3 dịch vụ và trang chi tiết; đối tác; tin tức/6 bài viết; sự kiện/3 chi tiết; hồ sơ năng lực in được; liên hệ/3 chi nhánh; chính sách/điều khoản dự thảo.
- Tuyển dụng: 8 vị trí minh họa, tìm kiếm bỏ dấu, lọc địa điểm/loại hình, phân trang, chi tiết riêng, việc đã lưu, tuyển dụng nội bộ.
- Form tư vấn và ứng tuyển: kiểm tra dữ liệu, đồng ý chính sách, CV PDF/DOC/DOCX ≤5 MB, xác nhận mô phỏng. Không gửi hay lưu thông tin cá nhân.
- Menu drawer có lối vào cho hai nhóm người dùng; search cả việc làm/bài viết; focus trap, Escape, return focus, skip link; office tabs điều khiển bằng bàn phím; vùng chạm mobile tối thiểu 44px cho các điều khiển đã cập nhật.
- SEO/AEO: 33 trang HTML prerender + 3 alias, metadata/canonical/Open Graph riêng, sitemap, Organization/WebSite/WebPage/BreadcrumbList và FAQPage đồng bộ nội dung hiển thị. Giữ noindex cho prototype; không đưa dữ liệu việc làm/sự kiện/review giả vào structured data tương ứng.

## Nội dung và giới hạn

- Giao diện hiện là **tiếng Việt**. Chưa thực hiện bản dịch hay chuyển ngôn ngữ.
- Tin tuyển dụng, mức thu nhập, bài viết và lịch sự kiện là dữ liệu minh họa, có nhãn trên giao diện. Không thể dùng để tuyển dụng thật.
- Thông tin doanh nghiệp, hotline, link Zalo/Facebook và 5 đối tác lấy từ bảng nguồn. Email telesale không hiển thị công khai vì mục đích trong bảng là cấu hình nội bộ.
- Chi nhánh Quảng Ninh chưa có địa chỉ/bản đồ chính xác; dẫn về hotline. Bản đồ đồ họa là minh họa.
- Ảnh/video theo mẫu HR2B chỉ dùng tham chiếu prototype, không phải hình ảnh hoạt động của Minh Đức. Cần thay bằng ảnh được duyệt trước khi dùng chính thức. Không tái sử dụng testimonial, chứng nhận hoặc số liệu thành tựu của HR2B.
- Chưa có backend, CMS, email/Google Sheets integration, xác thực, reCAPTCHA, analytics hay chức năng gửi dữ liệu thật.
- Nội dung chat “MinhDucWeb - Sprint 1” chưa truy xuất được: công cụ đọc chat không trả kết quả. Phạm vi đã chốt riêng trong chat cần đối chiếu bổ sung.

## Kiến trúc

`App.tsx`: routing, header/footer, menu, search, lưu lựa chọn.
`Home.tsx`: trang chủ.
`shared.tsx`: component chung, dialog accessible, hero, CTA.
`JobsPages.tsx`: dữ liệu, bộ lọc, việc đã lưu, ứng tuyển.
`InfoPages.tsx`: nội dung giới thiệu/dịch vụ/tin tức/sự kiện/chính sách.
`Contact.tsx`: liên hệ và form tư vấn.
`styles.css`, `jobs.css`, `info.css`, `home-enhancements.css`: responsive styling.
`motion.tsx` / `motion.css`: reveal, counter, reduced-motion và observer cleanup.
`src/seo/`: thông tin SEO từng route và cập nhật metadata phía client.
`entry-server.tsx`, `scripts/prerender.mjs`: xuất nội dung HTML đầy đủ; module nội dung tải theo nhu cầu.
`tests/hydration.mjs`: kiểm tra DOM với jsdom; không thay thế browser visual QA.

## Kiểm tra và đánh giá

Quy trình bản 2: một agent lập kế hoạch (GPT-6 Astra), bốn agent worker độc lập (GPT-6.1 Terra: Home, Motion, UX, SEO/AEO), một agent phản biện (GPT-6 Astra), sau đó sửa theo findings và kiểm tra lại.

- TypeScript + Vite production build + prerender: đạt.
- Logic tuyển dụng: 21/21 kiểm thử đạt.
- SEO output: 33/33 trang chính đạt metadata/canonical/noindex, JSON-LD, một H1, ID duy nhất, nội dung đầy đủ, link/asset nội bộ.
- Audit reviewer: 36 HTML gồm alias, không còn đoạn Suspense ẩn hoặc fallback tải nội dung.
- DOM hydration: 7/7 trường hợp đạt với actual client entry — trang chủ, trang tải trễ, danh sách việc, việc đã lưu, query filter và alias. Media playback được stub và muted property được chuẩn hóa trong jsdom, không phải bằng chứng video trên browser thật.
- Reviewer yêu cầu sửa và đã xác nhận: query lọc việc làm không làm mất focus; form IDs duy nhất; tabs keyboard; nội dung FAQ không ngụ ý gửi form thật; video tuân thủ reduced-motion; metadata alias và query hydration guard.
- Browser visual QA chưa xác minh: managed preview trả `relay could not open browser port 4173: timed out waiting for relay readiness`; CUA trả `Browser Use could not read requirements`. Không tuyên bố pixel-perfect hay responsive thực tế đã kiểm trên browser.
- Người dùng nhắc “ảnh 1” nhưng ảnh chưa có trong tin nhắn; phần bổ sung dựa trên mẫu HR2B và yêu cầu mô tả, chưa đối chiếu riêng ảnh này.

## Nguồn

- Mẫu: https://drive.google.com/drive/folders/1BOV8hCaMc4JsXmkmUMKKcALsjm06gdfC
- Thông tin: https://docs.google.com/spreadsheets/d/1SFbcwntvl7E13yGO--6tAISyIuxddhx4UwsrOGgx6VA/edit

Bản tham chiếu nguyên gốc được giữ riêng, không sửa đổi. Cần thay `.openai/hosting.json` nếu triển khai dưới một Site khác.
