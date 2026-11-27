# Kiểm tra bổ sung W4 bằng Chromium

Kiểm thử `tests/s2-w4-browser-final.py` dùng byte từ hai gói đã build qua Playwright request interception, không yêu cầu máy chủ hoặc gửi yêu cầu bên ngoài. Mốc ứng dụng `88e2b61596eab5952f183a81b3030da760696c9c`, mốc Site `b9b58c4da406a91e43e94e2ad98a0f73327a47ab`. Cả 17/17 ca trên mỗi gói đều đạt. Báo cáo JSON giữ kết quả từng ca và mã tiêu chí liên quan. [Pages](browser-pages.json) · [Sites](browser-sites.json)

| Mã | Phạm vi chứng minh | Trạng thái đề nghị |
| --- | --- | --- |
| P20-B2 | Cả bốn bộ lọc hoạt động bằng phím, giữ focus và trạng thái đã chọn. Hai bài chọn lọc không thay đổi theo bộ lọc ở trang 1. Phạm vi nghiệp vụ của dải vẫn cần chủ nội dung xác nhận. | Partial |
| P20-B4 | Danh mục có liên kết neo nội trang và liên kết riêng sang sự kiện. Chưa quan sát người đọc tự nhận biết hai lối đi. | Partial |
| P20-C2 | Trang đầu và trang cuối có điều khiển disabled phù hợp. Chuyển trang bằng Enter đưa focus tới `#news-listings`. Mở bài rồi quay lại giữ chuyên mục và số trang. Chưa thử vuốt. | Partial |
| P31-A2 | Năm tên theo hồ sơ đi cùng đúng tài nguyên hiện có, ảnh giải mã được. Giả lập lỗi toàn bộ ảnh vẫn hiện đủ tên và ảnh trang trí không lặp tên cho trình đọc. Chưa xác minh lại mẫu logo với chủ thương hiệu. | Partial |
| P31-B3 | CTA dùng được qua Enter và đưa focus tới tiêu đề phần Giới thiệu với F01 đang chọn. Chưa kiểm chứng cách người đọc hiểu nhãn qua UAT. | Partial |
| P31-D1 | Tài liệu không tràn ngang và hai CTA nằm trong viewport ở 320/820/1440/1920 px với cả năm ngôn ngữ. Chưa đo khi phóng chữ hoặc dùng thiết bị thật. | Partial |
| P31-E3 | Đi theo CTA dành cho người lao động bằng bàn phím đến trang Việc làm ở cả năm ngôn ngữ. Chưa phỏng vấn người thử độc lập. | Partial |
| P31-F2 | Trang Đối tác, Trang chủ và Giới thiệu giữ đúng cùng danh sách và tài nguyên hình; kiểm cả ảnh lỗi. Chưa đo CPU/network của dải ngoài viewport. | Partial |
| P31-F3 | Mở trực tiếp cả /partners lẫn /testimonials, kiểm H1, title, description, robots, và canonical quy về /partners ở cả năm ngôn ngữ. | Pass |
