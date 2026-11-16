# Prototype 6 — header theo hai ảnh tham chiếu

## Hướng thiết kế đã áp dụng

Ảnh thứ nhất được dùng cho bố cục: logo, menu, tiện ích, ngôn ngữ và nút liên hệ trên cùng một hàng. Ảnh thứ hai được dùng cho cách phủ header trong suốt lên hero. Giữ thương hiệu và sitemap Minh Đức; không lấy tên menu SuccessHR hoặc logo HR2B.

- Desktop từ 1280 px: header cao 86 px, 7 nhóm trên một hàng, 19 mục con ở cấp 2. Nhãn chính không xuống dòng; chữ 13 px và tăng 14 px từ 1440 px.
- Header trên đầu trang chủ không có nền, đường viền, bóng hoặc blur. Lớp chuyển sắc thuộc ảnh hero hỗ trợ đọc chữ trên video.
- Khi cuộn hoặc ở trang trong: kính sáng trung tính, chữ tối và nhấn đỏ. Các chế độ không hỗ trợ blur, giảm độ trong suốt và forced-colors đều có phương án đọc được.
- Nhỏ hơn 1280 px: drawer hai cấp. Mục con và nút có vùng chạm 44 px; lối vào việc đã lưu có trong drawer.
- Tiện ích xếp theo thứ tự tìm kiếm, việc đã lưu, ngôn ngữ, liên hệ; hamburger hiện ở kích thước nhỏ. Ngôn ngữ dùng cờ + VI/EN/ZH/KO/JA, giữ tên đầy đủ cho công nghệ hỗ trợ và trong danh sách.
- Khi đổi kích thước, menu cũ đóng; focus được đưa tới điều khiển đang hiển thị nếu điều khiển đang dùng vừa bị ẩn. Không lấy focus khỏi thao tác ở vùng khác.

Đã hợp nhất CSS header, loại bỏ nền xanh đậm và các quy tắc cũ dành cho hai hàng. Không thêm dependency runtime, ảnh, video hoặc font mới. Giữ animation, reduced-motion, nội dung HTML sẵn và schema hiện có.

## Quy trình và kiểm chứng

Agent điều hướng, giao diện và ngôn ngữ đề xuất phương án riêng; agent đánh giá phản biện trước và sau triển khai. Các lỗi tìm được được gửi lại đúng worker và kiểm tra lại. Quy trình và mục tiêu chất lượng dài hạn được ghi tại `AGENTS.md` theo yêu cầu người dùng.

Kiểm tra gồm build TypeScript/client/SSR, menu và ngôn ngữ trên năm locale, keyboard/Escape, overlay, resize/focus, sitemap hai cấp và liên kết, SEO 200 trang, hydration 15 trường hợp, motion và media. Bộ kiểm tra riêng đối chiếu cấu trúc một hàng, header trong suốt và các quy tắc responsive với hai ảnh.

Ước lượng độ rộng từ CSS/font không thay thế đo bố cục thực tế. Hạ tầng preview ở phiên làm việc này vẫn chưa có bằng chứng khôi phục sau lỗi relay 4173 đã ghi nhận; không chạy server/browser thay thế. Chưa xác nhận bằng ảnh chụp trên thiết bị, độ mượt thực tế hoặc điểm Lighthouse/CWV. Prototype giữ audience riêng tư, noindex và các giới hạn dữ liệu mô phỏng hiện tại.

JavaScript chính sau build: **118.96 KB gzip** (bản trước 118.69 KB). Test media cũ đã được sửa để chờ React hoàn tất effect thay vì đợi cố định 100 ms; vẫn giữ đầy đủ kiểm tra reduced-motion, tiết kiệm dữ liệu, tự phát và dừng thủ công.
