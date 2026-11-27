# Mẫu đối chiếu cho các thành phần hiện có

| Mẫu và nơi dùng | Biến thể, trạng thái và trách nhiệm |
|---|---|
| Header, trên mọi tuyến ứng dụng | Trên phim ở desktop dùng lớp phủ. Khi qua ngưỡng 32px chuyển nền sáng, khi về dưới 24px trở lại. Vị trí các nhãn vẫn theo cùng hàng. Kiểm cả ảnh kết phim. |
| Điều hướng, Header | Bảy nhóm, mười bốn liên kết con. Desktop mở bằng hover/focus, không có mũi tên. Drawer dùng liên kết cha và nút disclosure riêng. Xem aria-expanded, inert và focus sau Escape. |
| Hành động chính, Contact và Jobs | .btn dùng màu đỏ thương hiệu. Hover/focus/pressed giữ kích thước. Nhấn đặt viền trong ngay. Khi vô hiệu, dùng thuộc tính disabled ở button. Liên kết có URL dùng anchor. |
| Hành động phụ, Hero và các trang danh mục | .btn-secondary có viền, .text-link là liên kết trong nội dung. Riêng CTA nền ảnh dịch vụ dùng thẻ trắng để đủ độ phân tách với ảnh. |
| Thẻ dịch vụ, Home và Services | ServiceCard dùng chung dữ liệu, cùng ảnh/tiêu đề/mô tả/đích. Chỉ danh mục bố trí lưới. Carousel có nút trước/sau và điều khiển chuyển động. |
| Thẻ việc, Jobs/Careers/Saved | Tiêu đề, mã, nhãn việc, nút lưu với trạng thái aria-pressed. Việc đóng có nhãn chữ, dành cho đọc tham khảo. Số việc lưu trên header có tên truy cập chứa số thực. |
| Trường nhập, F01–F06 | Nhãn cố định, required theo mẫu. Trạng thái lỗi sau submit liên kết tới lời giải thích. Các trường tùy chọn bị bỏ trống vẫn trung tính. Dữ liệu tệp chỉ là metadata demo. |
| FAQ dịch vụ; tab ở Admin/giáo dục | FAQ dùng nút disclosure với aria-expanded. Tabs hoặc nút đổi mode giữ selection theo quy tắc từng trang. Không dùng cùng một role cho hai loại điều khiển. |
| Modal, biểu mẫu/album/hồ sơ | Nội dung sau heading luôn trong panel cuộn được. Nút đóng trong heading; Escape, focus trap, inert và khôi phục focus dùng chung. Drawer chỉ thay vị trí/kích thước panel. |
| Công cụ hỗ trợ và quay đầu trang | Nút 48px theo safe area. Panel có liên kết điện thoại, Zalo, Facebook và nút tư vấn. Escape trả focus launcher. Cuộn về đầu không chạy mượt khi reduce. |
| Bốn chỉ số trang chủ | Một đồng hồ chung T4. Chuỗi cuối, kể cả hậu tố, luôn dành chỗ trong lưới một ô và có trong cây trợ năng. Chữ số chuyển theo locale hiện hành. |

## Token và điều kiện chuyển bố cục

| Vai trò | Nguồn | Cách sử dụng |
|---|---|---|
| Nền, chữ, nhãn phụ, viền, CTA, focus | src/brand-colors.css | Dùng --md-surface, --md-ink, --md-muted, --md-rule, --md-blue, --md-red, --md-focus. Chữ/số ngoài logo phải dễ đọc trên nền thực. |
| Cỡ chữ và font | src/brand-type.css | Roboto cho nội dung, Inter cho tiêu đề, gói Latin và tiếng Việt có font-display swap. Hệ thống cung cấp glyph CJK. |
| Góc và khoảng cách | src/brand-colors.css | --md-radius-control cho nút pill, --md-radius-card cho thẻ, --md-radius-panel cho menu/popover. --md-space-control cho điều khiển, --md-space-group cho nhóm. |
| T0 = 0ms | src/brand-colors.css | Focus, hidden/inert, selected, nhãn và dữ liệu cập nhật ngay. |
| T1 = 120ms | src/brand-colors.css | Phản hồi màu nút và dấu mũi tên drawer. |
| T2 = 180ms | src/brand-colors.css | Panel menu, lớp phủ, chuyển màu header, submenu, reset reveal. |
| T3 = 240ms | src/brand-colors.css | Panel modal dịch 8px, drawer dịch 16px, reveal dịch 8px. Các nhịp trang trí theo nhóm dùng 40ms, tối đa 120ms. |
| T4 = 320ms | src/motion.tsx | Chỉ đếm chỉ số mẫu. T0 dùng khi reduce. Không dùng spring hoặc route fade. |
| Desktop/compact | src/sprint-navigation.css | 1279/1280: đổi menu ngang sang drawer. 767/768: hàng header 72/80px. 380px trở xuống: ẩn chevron trang trí ở locale, giữ vùng bấm. |
| Màn thấp, phiên bản dịch dài | src/styles.css, src/sprint-navigation.css | Panel dùng chiều cao tối đa theo dvh và cuộn bên trong. Các nhãn drawer cho phép xuống dòng. Kiểm chữ dài, giảm chuyển động và zoom 200% trên bản duyệt. |

Bảng trên mô tả các mẫu triển khai để đối chiếu. Các ca và cách kiểm thực tế nằm trong shared.csv cùng báo cáo QA độc lập.
