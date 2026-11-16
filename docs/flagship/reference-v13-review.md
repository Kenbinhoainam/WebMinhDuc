# Minh Đức v13 — tái dựng từng trang theo HR2B

## Căn cứ

Đối chiếu 41 đường dẫn nội dung của bản v12 (commit `2726e30fd94b173b2858dc10dc6df84f243856fa`) với gói HR2B người dùng gửi: 197 HTML cho 189 URL được thu thập, CSS và tài nguyên. Báo cáo riêng ghi 97 khác biệt theo từng trang, phân biệt điểm cần sửa, thay đổi thương hiệu có chủ đích và chỗ chưa đủ bằng chứng.

Giữ đúng phạm vi người dùng yêu cầu: menu ngang 7 nhóm/19 mục con mở bằng hover; 5 ngôn ngữ có quốc kỳ; nội dung dịch vụ, bộ lọc việc làm, tuyển sinh và thông tin Minh Đức; logo, favicon và dữ liệu mẫu. Giao diện dùng chung được áp dụng qua cùng header/footer. Hỗ trợ bàn phím, giảm chuyển động, nhãn dữ liệu mẫu và biểu mẫu mô phỏng được giữ.

## Thay đổi sau phân tích và phản biện

| Nhóm trang | Kết quả v13 |
| --- | --- |
| Trang chủ | Ba slide dịch vụ, một H1/CTA đang hoạt động; ánh xạ hiệu ứng và độ trễ theo từng khối nguồn; mật độ rail thành tựu 1,5/2,5/3,5/4 và giải pháp 1,3/2,3/3; tám thẻ chủ đề tin dẫn đến sáu bài mẫu hiện có. |
| Giới thiệu | Bố cục giá trị, lịch sử, tài liệu và đối tác theo nguồn. Rail ảnh và năm lịch sử đồng bộ, giữ khóa phần tử khi đổi mục, tránh thẻ tái sử dụng chạy xuyên giữa khung. Đối tác tại trang này là lưới 2/4 cột theo bản gốc. |
| Dịch vụ | Tách cấu trúc cung ứng/cho thuê, headhunt và tư vấn tổ chức. Khôi phục bố cục ảnh–nội dung, các khối chuyên môn, bảng phí mẫu và thứ tự FAQ/dịch vụ/form đúng loại trang. Headhunt không còn khối khách hàng vốn không có trong bản nguồn. |
| Đối tác, hồ sơ năng lực | Bỏ các checklist/CTA tự thêm; dùng cấu trúc cảm nhận/khách hàng. Hồ sơ năng lực là bộ xem tài liệu mẫu có chuyển trang và in; bỏ hero ảnh không có trong bản chụp nguồn. |
| Tuyển dụng nội bộ | Hai hàng ảnh–chữ xen kẽ, icon môi trường/quyền lợi, quy trình bốn bước màu vàng, khối đồng hành, cảm nhận và gallery 11 ảnh có hộp thoại. Khôi phục tỉ lệ ảnh, kích thước và mật độ khối theo CSS nguồn. |
| Việc làm | Thẻ và lưới 1/2/4 cột; nhóm nội bộ ba cột. Bỏ tag và CTA phụ không có trong mẫu, giữ bộ lọc, lưu việc, trạng thái đóng và ứng tuyển mô phỏng. |
| Tin tức, bài viết | Tin nổi bật thực sự trượt ngang; tỉ lệ ảnh 440:248, chấm điều hướng và khoảng tự chạy theo nguồn. Sidebar bài viết dùng ảnh/ngày/tiêu đề; có chia sẻ đường dẫn theo ngôn ngữ. |
| Sự kiện, chính sách, liên hệ | Dùng bố cục tương ứng từ nguồn; chỉnh khoảng cách và cột. Trang đặt lịch dùng một vùng đặt lịch giữa trang, giữ ngày/giờ và xác nhận mẫu. |
| Footer | Bố cục địa chỉ và form theo cột nguồn; menu/social chuyển đúng vị trí giữa desktop và mobile, logo và kích thước chữ đồng bộ. |

## Chuyển động và code

`RevealFrame` nhận độ trễ mili giây rõ ràng, quan sát khung ổn định và chỉ biến đổi phần con. Hiệu ứng cuộn quay lại khi vào vùng nhìn, ẩn lại ở mép dưới khi cuộn ngược; không ẩn nội dung đang focus. Các trường hợp giảm chuyển động hoặc observer không hoạt động vẫn đọc được nội dung.

Hero cho phép video muted/playsInline trên điện thoại đủ điều kiện, giữ poster cho đến khi có frame. Tiêu đề có timer riêng, không chờ video tải hoặc autoplay thành công. Nút dừng/phát quản lý cả chữ và video, kể cả lỗi video; hover chỉ dừng trên thiết bị có con trỏ chính xác. Vẫn bảo vệ reduced-motion, tiết kiệm dữ liệu, kết nối 2G, tab ẩn và ngoài viewport.

Tách `InfoPages.tsx` thành các module theo họ trang, dùng lazy import và CSS theo route. File cũ chỉ còn xuất lại để tương thích. Prerender truy vết CSS của các import dùng chung để trang dựng sẵn có kiểu dáng trước hydration. Các rail tiếp tục dùng chung bộ điều khiển, không thêm thư viện animation.

Ảnh tuyển dụng lấy từ tài nguyên tham chiếu và có WebP/srcset; ảnh và icon ở các trang con chỉ tải khi cần. Clip hero vẫn là bản 1920×1080, 10,2 giây, 3.163.686 byte, faststart, không âm thanh. Bản gốc và biến thể được lưu để tái tạo, không có nghĩa tất cả được tải trong một lượt xem trang.

## Phạm vi chưa thể đối chiếu tuyệt đối

Gói nguồn không có HTML chi tiết việc làm và chi tiết sự kiện tương ứng. Phần trong trình xem brochure và lịch đặt hẹn là nội dung nhúng, không có đầy đủ trạng thái runtime trong gói. Các trang riêng của Minh Đức như tuyển sinh và quản trị mẫu không có bản HR2B tương đương. Những trang này dùng cấu trúc gần nhất, giữ nghiệp vụ mẫu; không gọi là sao chép từng pixel.

JavaScript nguồn trực tiếp đã lưu được dùng bổ sung cho hành vi; gói tải lên không chứa JS nên không thể chứng minh hai phiên bản JS đồng nhất từng byte. Managed preview vẫn gặp lỗi relay readiness timeout. Kiểm tra mã, DOM, SSR và CSS không thay thế đối chiếu hình ảnh trên thiết bị thật; chưa có số đo Lighthouse/Core Web Vitals hoặc chứng nhận giống 100%.

Quyền xem riêng tư và noindex giữ nguyên. Biểu mẫu không gửi dữ liệu, không tải tệp lên; ảnh nguồn chỉ là hình minh họa, không khẳng định là hoạt động thực tế của Minh Đức.

## Kiểm chứng bản cuối

Build/TypeScript và các bộ kiểm tra nghiệp vụ, catalog, luồng/bản dịch, sitemap/header/hover đều đạt. Sau thay đổi cuối ở hero, chạy lại bộ flagship, motion, carousel, 13 tình huống media và đối chiếu cấu trúc các họ trang; đều đạt. SEO đạt 205 trang; favicon có trong 208 HTML gồm alias; hydration đạt 25 trạng thái. CSS riêng có sẵn trong head cho 105 trạng thái route/ngôn ngữ được kiểm tra. Kiểm kê 166 đường dẫn tài nguyên trên 208 HTML không thấy tệp thiếu.

JavaScript ban đầu: **370,27 kB / 115,21 kB gzip**; CSS chung **117,72 kB / 22,73 kB gzip**. So với v12, JavaScript ban đầu tăng khoảng 1,9% (gzip tăng 0,9%) do giao diện và hành vi bổ sung; không khẳng định trang tải nhanh hơn từ số đo bundle. Các module giới thiệu/dịch vụ/tin tức được tải theo route và ảnh mới dùng biến thể responsive.

Google Sheet v13 đã kiểm kê **56 tài nguyên logic / 109 tệp / 152 nhóm vị trí**, trình bày thành 272 dòng vị trí theo trang; đọc lại khớp toàn bộ 3.831 ô đã ghi. Số liệu dung lượng là byte tệp, không phải tổng truyền tải một lần truy cập.
