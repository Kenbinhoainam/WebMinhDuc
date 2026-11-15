# Minh Đức Vina — Prototype

Prototype React + TypeScript, dựa trên cấu trúc giao diện của bản HR2B reconstruction do người dùng cung cấp. Dùng logo và thông tin liên hệ Minh Đức từ MDxGenZ_Website.

## Chạy dự án

Yêu cầu Node.js 22.12 trở lên.

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Windows PowerShell có thể dùng `npm.cmd` thay `npm`.

## Phạm vi triển khai

- Trang chủ: video hero, hai hành trình doanh nghiệp/người lao động, giới thiệu, dịch vụ, đối tác, cẩm nang, CTA.
- Giới thiệu; 3 dịch vụ và trang chi tiết; đối tác; tin tức/6 bài viết; sự kiện/3 chi tiết; hồ sơ năng lực in được; liên hệ/3 chi nhánh; chính sách/điều khoản dự thảo.
- Tuyển dụng: 8 vị trí minh họa, tìm kiếm bỏ dấu, lọc địa điểm/loại hình, phân trang, chi tiết riêng, việc đã lưu, tuyển dụng nội bộ.
- Form tư vấn và ứng tuyển: kiểm tra dữ liệu, đồng ý chính sách, CV PDF/DOC/DOCX ≤5 MB, xác nhận mô phỏng. Không gửi hay lưu thông tin cá nhân.
- Menu drawer, search, focus trap, Escape, return focus, skip link, reduced motion; CSS cho mobile/tablet/desktop.

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
`styles.css`, `jobs.css`, `info.css`: responsive styling; module nội dung tải theo nhu cầu.

## Kiểm tra

- TypeScript + Vite production build: đạt.
- Logic tuyển dụng: 21 ca đạt, bao gồm storage lỗi/quota/cross-tab, dữ liệu và giới hạn CV.
- SSR smoke 25 routes: render không lỗi, 1 H1/trang, không ID trùng, đường dẫn ảnh hợp lệ.
- Browser visual QA: đang bị giới hạn bởi managed preview relay timeout; không coi kiểm thử tĩnh là bằng chứng pixel-perfect.

## Nguồn

- Mẫu: https://drive.google.com/drive/folders/1BOV8hCaMc4JsXmkmUMKKcALsjm06gdfC
- Thông tin: https://docs.google.com/spreadsheets/d/1SFbcwntvl7E13yGO--6tAISyIuxddhx4UwsrOGgx6VA/edit

Bản tham chiếu nguyên gốc được giữ riêng, không sửa đổi. Cần thay `.openai/hosting.json` nếu triển khai dưới một Site khác.
