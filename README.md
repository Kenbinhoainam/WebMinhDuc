# Minh Đức Vina — Prototype 3

Prototype React + TypeScript theo bố cục HR2B reconstruction do người dùng cung cấp, dùng logo/thông tin Minh Đức từ MDxGenZ_Website và được đối chiếu với toàn bộ bản “MinhDucWeb - Sprint 1” đã gửi ngày 16/11/2026.

## Chạy dự án

Node.js 22.12 trở lên. Trên Windows PowerShell có thể dùng `npm.cmd`.

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
npm run audit:i18n
```

`npm run build` tạo HTML sẵn cho 40 trang × 5 ngôn ngữ và các alias cũ. `audit:i18n` là báo cáo phát hiện chữ Việt còn lại, cần phân biệt tên riêng với thiếu bản dịch.

## Phạm vi

- Năm ngôn ngữ hoạt động: Việt, Anh, Trung giản thể, Hàn, Nhật. Chuyển ngôn ngữ giữ trang, bộ lọc và anchor; các bản dịch là bản nháp prototype.
- Bảy nhóm menu chính: Trang chủ, Giới thiệu, Dịch vụ, Việc làm, Tuyển dụng nội bộ, Tin tức, Liên hệ; trang phụ có lối truy cập theo nhóm.
- Năm dịch vụ: giới thiệu/cung ứng nhân lực, cho thuê lao động, headhunt/tay nghề, tuyển sinh cao đẳng, setup tổ chức/phần mềm doanh nghiệp.
- Trang chủ có video hero, hai hành trình B2B/B2C, chỉ số mô phỏng, quy trình, đối tác, câu chuyện giả định, cẩm nang, hoạt động và FAQ. Animation cuộn, số đếm, hover, modal/menu hỗ trợ reduced-motion.
- Tám vị trí mẫu, bộ lọc KCN/loại việc/tay nghề/ca ngày–đêm/chuyên–xoay/trạng thái; lưu việc trên thiết bị. Tuyển nội bộ tách khỏi danh sách lao động. Tin đóng vẫn đọc được nhưng không nhận ứng tuyển thử.
- Ba chương trình tuyển sinh giả định theo hình thức từ xa/chính quy; không gắn với trường chưa xác minh.
- Sáu biểu mẫu F01–F06: nhu cầu doanh nghiệp, liên hệ chung, ứng tuyển lao động, ứng tuyển nội bộ, tư vấn tuyển sinh, hồ sơ tuyển sinh. CV nội bộ/hồ sơ tuyển sinh bắt buộc; PDF/DOC/DOCX tối đa 5 MB theo giả định demo.
- `/admin-demo`: sáu hàng đợi hồ sơ giả, tìm/lọc, mã tin/chương trình, nguồn, ngày nhận, người phụ trách, trạng thái, cảnh báo trùng, xuất CSV mẫu, CMS và vai trò minh họa.
- SEO/AEO: HTML prerender, tiêu đề/mô tả/canonical/OG riêng, `html lang`, hreflang, sitemap; Organization/WebSite/WebPage/BreadcrumbList/FAQPage khớp nội dung. Giữ **noindex** và quyền xem riêng tư. Không dùng schema JobPosting/Event/Review cho dữ liệu giả.

## Dữ liệu và giới hạn

Thông tin nhập và tệp **không gửi, không tải lên, không lưu**. Quản trị chỉ chứa dữ liệu giả độc lập; liên kết “xem hồ sơ mẫu” không mang dữ liệu cá nhân sang quản trị. Thao tác quản trị tồn tại trong bộ nhớ đến khi tải lại trang. Chuyển vai trò là mô phỏng giao diện, không phải xác thực hay phân quyền bảo mật.

Chưa có backend, CMS vận hành, tiếp nhận hồ sơ thật, tệp riêng tư, email/Google Sheets, chống spam, analytics thật, AI hoặc CRM. Cần chốt quy tắc nghiệp vụ, nội dung, bảo mật và hạ tầng trước phát triển bản sản xuất. Xem [đối chiếu yêu cầu và quyết định](docs/sprint-1/requirements-and-decisions.md).

Logo, hotline, Zalo/Facebook và năm đối tác lấy từ bảng nguồn. Ảnh/video HR2B chỉ là tham chiếu giao diện; không phải ảnh tập thể Minh Đức. Số liệu, lương, nhân vật, bài viết và sự kiện đều minh họa. Chi nhánh Quảng Ninh chưa có bản đồ chính xác nên dẫn về hotline. Tài khoản WeChat chưa được cung cấp. “Ảnh 1” được nhắc trong chat nhưng chưa có file để đối chiếu.

## Kiến trúc

- `App.tsx`, `Home.tsx`, `shared.tsx`: khung, điều hướng, trang chủ và thành phần chung.
- `JobsPages.tsx`, `Education.tsx`, `Contact.tsx`: dữ liệu và sáu luồng demo.
- `AdminDemo.tsx`, `admin-demo-data.ts`: quản trị minh họa, dữ liệu giả độc lập.
- `InfoPages.tsx`: giới thiệu, dịch vụ, tin tức, sự kiện, chính sách và hồ sơ năng lực.
- `i18n.tsx`, `i18n-runtime/`, `i18n-catalogs/`: locale theo URL và bản dịch. JSX runtime dịch nội dung/nhãn hiển thị, giữ nguyên IDs, URL, form values và dữ liệu người dùng nhập. Chuỗi động dùng `useTranslation`.
- `src/seo/`, `entry-server.tsx`, `scripts/prerender.mjs`: metadata và xuất HTML tĩnh; không dùng dịch DOM sau hydration.
- `motion.tsx`/`motion.css` và CSS theo trang: animation, responsive, reduced-motion.

## Kiểm thử

Các kiểm tra gồm TypeScript/build, lưu việc và file CV, các luồng ứng tuyển/bộ lọc/tin đóng, validation biểu mẫu, quản trị mẫu, SEO 200 route, hydration đa ngôn ngữ và đánh giá độc lập. Kết quả cuối được ghi trong `docs/sprint-1/validation.md`.

Kiểm thử DOM dùng jsdom, không thay thế kiểm thử trực quan. Preview trong môi trường hiện trả `relay could not open browser port 4173: timed out waiting for relay readiness`; chưa xác minh giao diện, video hoặc responsive trực tiếp trên browser.

## Nguồn và bàn giao

- Baseline người dùng chọn: `Kenbinhoainam/WebMinhDuc`; bản local bàn giao tại `/workspace/WebMinhDuc`. Chưa đẩy thay đổi lên GitHub.
- Sites dùng kho source hosting riêng; `.openai/hosting.json` giữ ID của prototype đang triển khai. Thay cấu hình này khi triển khai dưới Site khác.
- [Mẫu HR2B](https://drive.google.com/drive/folders/1BOV8hCaMc4JsXmkmUMKKcALsjm06gdfC)
- [Thông tin Minh Đức](https://docs.google.com/spreadsheets/d/1SFbcwntvl7E13yGO--6tAISyIuxddhx4UwsrOGgx6VA/edit)
- `docs/sprint-1/source.txt`: nguyên văn nội dung Sprint 1 do người dùng cung cấp.
