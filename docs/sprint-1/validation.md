# Kết quả kiểm tra prototype 3 — 16/11/2026

Đạt trong phạm vi prototype tĩnh, dữ liệu giả. Agent phản biện GPT-6 Astra chấp nhận sau vòng sửa; không còn lỗi chặn được phát hiện trong các kiểm tra dưới đây.

| Kiểm tra | Kết quả |
|---|---|
| `npm run build` | TypeScript, Vite client/SSR, prerender đạt |
| `npm test` | 22 kiểm tra logic việc làm/CV/lưu việc đạt |
| `npm run test:sprint` | Bộ lọc kết hợp, công việc đóng, tách nội bộ, tìm kiếm đa ngôn ngữ, biểu mẫu, CSV mẫu, quản trị và upload minh họa đạt |
| `npm run test:seo` | 200/200 trang: metadata/canonical, 5 ngôn ngữ + hreflang, một H1, schema phù hợp, FAQ khớp, links/assets đạt |
| `npm run test:hydration` | 15/15 trường hợp đạt; gồm trang chủ/việc làm ở cả 5 ngôn ngữ, lazy route, saved jobs, query, alias |
| `npm run test:review` | 35 render/trạng thái qua 5 ngôn ngữ, lỗi F01/F02/F04, file F06, navigation 7 nhóm, modal và role demo đạt |
| Audit bản dịch | 160 HTML ngoài tiếng Việt được rà; không còn đoạn nội dung công khai chưa dịch được phát hiện. Tên thương hiệu/địa danh và tên ngôn ngữ được giữ khi phù hợp |
| Browser visual / responsive / video thực tế | Chưa xác minh: preview relay không mở được cổng 4173; status trả stopped |

Các sửa đổi sau phản biện: validation điện thoại tuyển sinh không nhận chuỗi chứa chữ; lỗi file có aria-invalid và focus; tin đóng bị loại khỏi mặc định; query không hợp lệ không làm sai trạng thái lọc; danh sách tuyển nội bộ tách riêng; mã tin/chương trình/ngày nhận có trong hồ sơ mẫu; chỉ một main landmark; nhãn và lỗi biểu mẫu được dịch; tìm kiếm khớp tiêu đề dịch; link giữ locale.

Kiểm tra DOM dùng jsdom. Media play/pause được stub trong harness; đây không phải bằng chứng video hoạt động trên browser. Bản dịch cần người duyệt trước sử dụng chính thức. Không kết luận về bảo mật máy chủ hoặc hiệu quả SEO thực tế vì prototype không có backend và đang noindex/riêng tư.
