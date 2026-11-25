# Nghiệm thu phần Hồ sơ năng lực của Minh Đức

Phạm vi gồm khối Hồ sơ năng lực trên trang chủ (`/#about`), mục cùng tên trên trang Giới thiệu (`/about-us#profile`) và trình đọc ba trang (`/e-brochure`). Ảnh tham chiếu của khách hàng định hướng cách sắp xếp thương hiệu, tiêu đề, đoạn dẫn, nút và chỉ số trên cùng một bìa. Ảnh, nội dung và số liệu trên prototype thuộc bộ tư liệu Minh Đức.

## Phiếu dùng trong buổi demo

| Hạng mục | Cách chấm | Bằng chứng hiện có |
|---|---|---|
| Bố cục và khả năng đọc | Ở 390 và 1440 px, đọc tiêu đề, CTA và từng cặp số – nhãn. Tăng cỡ chữ, kiểm tra từng giá trị còn đủ và đúng nhãn. | Ở cỡ chữ mặc định, 390 px hiển thị hai hàng, 1440 px hiển thị một hàng. Khi tăng riêng chữ lên 200%, cả bốn kích thước 320, 390, 768 và 1440 px đều giữ từng giá trị trong ô, không có cặp số nào đè lên nhau. |
| Tương phản chữ | Lấy mẫu nền ngay dưới chữ. Mốc WCAG AA là 4,5:1 cho chữ thường, 3:1 cho chữ lớn. | Chữ trên nút mở hồ sơ đạt 7,30:1. Chữ trên nút chuyển đến dịch vụ đạt 11,24:1. Đoạn mô tả bìa trình đọc đạt tối thiểu 5,20:1 ở 390 px và 8,90:1 ở 1440 px tại các điểm đo. |
| Khả năng thao tác | Mở hồ sơ bằng bàn phím, chuyển đến dịch vụ, sang liên hệ rồi quay lại. Kiểm tra vị trí tiêu điểm dưới header. | Đã kiểm luồng trong Chromium. Bấm nút trên bìa mở trang 2. In từ trang 2 vẫn tạo đủ ba trang A4. |
| Tính hữu dụng với khách hàng | Đưa điện thoại cho đại diện doanh nghiệp với yêu cầu “Từ trang chủ, hãy mở hồ sơ Minh Đức, tìm một dịch vụ phù hợp với nhà máy và cho biết cách liên hệ.” Ghi lại hoàn thành độc lập, cần gợi ý hoặc bỏ dở, cùng bước vướng đầu tiên. | Chưa thử với người dùng thật. Chấm số người hoàn thành độc lập trên tổng số người tham gia. Mốc đề xuất cho vòng demo là 4/5 người. |
| Mức độ đúng nhận diện | Đặt ảnh tham chiếu cạnh bìa ở 390 và 1440 px. Chủ dự án và khách hàng duyệt cách dùng ảnh thật, phân cấp chữ, màu xanh và độ dễ tìm của CTA. | Có ảnh để đối chiếu ở cả hai kích thước. Kết luận về gu thẩm mỹ thuộc bước duyệt của khách hàng. |

## Công cụ phù hợp

Lighthouse cho điểm khả năng truy cập trên toàn trang theo các phép kiểm tự động có trọng số. axe-core cho phép giới hạn phạm vi bằng selector như `#about .field-cover`, `#profile .field-cover` hoặc `.md-brochure-viewer`. Phiếu này ghi riêng kết quả đọc, thao tác và nhận diện. Chưa chạy Lighthouse hoặc axe để lấy điểm cho bản này. [Cách tính điểm Lighthouse](https://developer.chrome.com/docs/lighthouse/accessibility/scoring) · [Phạm vi kiểm tra của axe-core](https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#context-parameter) · [Ngưỡng tương phản WCAG](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) · [Cách đo tỷ lệ hoàn thành tác vụ](https://www.nngroup.com/articles/success-rate-the-simplest-usability-metric/)

## Phạm vi bằng chứng

Các phép thử dùng Chromium với viewport mô phỏng. Khi ảnh dọc trên điện thoại lỗi, trình đọc dùng ảnh ngang. Khi cả hai lỗi, chữ và nút vẫn hoạt động trên nền xanh. Chưa kiểm tra Safari. Bản in A4 đã kiểm ở năm ngôn ngữ của prototype. Chưa đo trên điện thoại thật hoặc với người dùng của khách hàng. Năm nhóm dịch vụ và ba điểm kết nối trên bìa được lấy từ dữ liệu của dự án. Bốn chỉ số trên trang chủ là số liệu demo hiện có, cần khách hàng xác nhận nguồn trước khi dùng chính thức.
