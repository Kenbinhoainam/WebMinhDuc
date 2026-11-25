# Minh Đức Vina · Phương án v21

## Hai thay đổi chính

Ở ảnh thứ nhất, thanh cuộn, nút tạm dừng và liên kết đọc bài cạnh tranh với nhau. Dải bài viết dành sáu giây cho mỗi vị trí, dịch sang thẻ kế bên trong nửa giây, đổi chiều ở đầu hoặc cuối danh sách. Người dùng có thể chạm giữ để đọc, vuốt hoặc dùng bàn phím để chọn thẻ. Với chuột, dải dừng trong lúc con trỏ nằm trên thẻ. Khi focus còn trong dải, người đọc quyết định thời điểm rời đi. Logo đối tác di chuyển đều khoảng 22 px/giây. Chế độ giảm chuyển động cho phép đọc nội dung tĩnh.

Ở ảnh thứ hai, ảnh nhân viên cầm hồ sơ và hàng chỉ số sử dụng hai lề trái khác nhau. Bản mới dùng chung mép lưới. Trên desktop, ảnh nhận 62% phần chiều rộng còn lại sau khoảng cách cột. Bốn chỉ số nằm dưới một đường phân cách và được đọc theo cặp số – ý nghĩa. Trên điện thoại, thứ tự là tiêu đề, ảnh, nội dung ngắn, “Xem hồ sơ năng lực”, rồi dải chỉ số. Ảnh tư liệu cắt 4:3 trên desktop và 6:5 trên mobile để giữ khuôn mặt và tập hồ sơ. Các con số là dữ liệu của prototype.

## Thiết kế và phản biện theo trang

| Trang | Quyết định sau khi rà lại |
| --- | --- |
| Giới thiệu | Dùng ảnh trao đổi tại hiện trường. Dòng thời gian cho chọn giai đoạn trực tiếp, các logo nối vòng. Hồ sơ ba trang vẫn đi theo thứ tự người đọc chọn. |
| Dịch vụ và tuyển sinh | Ảnh dịch vụ giữ tỷ lệ 16:9. Giữ liên kết trực tiếp tới từng dịch vụ, tiếp nhận nhu cầu theo đúng dịch vụ đã chọn. |
| Việc làm | Bộ lọc nằm ngay sau đầu trang. Khi ảnh tư liệu lỗi, vẫn thấy ô tìm việc. Biểu mẫu cập nhật trạng thái lỗi khi người dùng sửa trường. |
| Tuyển dụng nội bộ | Các dải tự chuyển khi có thêm thẻ ngoài khung. Album giữ toàn bộ bố cục ảnh dọc và ảnh nhóm rộng, mở lớn theo yêu cầu. |
| Tin tức | Chỉ bài chọn lọc tự chuyển. Người đọc chọn chuyên mục, trang và bài viết. Thumbnail có biến thể nhỏ để giảm dung lượng tải. |
| Liên hệ | Ưu tiên kênh liên hệ và giờ hẹn. Ảnh nhóm dọc hiển thị đủ năm người. Khi ảnh lỗi, phần thông tin và biểu mẫu tiếp tục sử dụng được. |

## Các thao tác nghiệm thu

- Tại 390 px, mở khối “Tuyển người theo ca”, kiểm tra đủ mặt người và bìa hồ sơ. Chạm “Xem hồ sơ năng lực” để mở tài liệu ba trang.
- Tại 1440 px, so hàng chỉ số với hai mép của cụm chữ và ảnh. Kiểm tra cả khi đổi kích thước qua 1200 px.
- Đưa dải bài viết vào vùng nhìn, để con trỏ ngoài dải và quan sát hai lần chuyển. Di chuột vào hoặc Tab tới liên kết, đợi hơn sáu giây rồi rời dải. Dải đứng yên trong khi đọc và bắt đầu lại thời gian chờ khi rời.
- Bật giảm chuyển động, kiểm tra dải tĩnh. Dùng phím mũi tên hoặc vuốt để tới thẻ cuối. Mở album rồi đóng bằng Escape, kiểm tra focus về ảnh vừa chọn.
- Kiểm tra ảnh thu nhỏ, ảnh mở lớn, nguồn responsive và poster trên các trang dựng sẵn. Cho một nguồn ảnh tối ưu trả lỗi để thử ảnh gốc. Khi cả hai lỗi ở đầu trang, tiêu đề và hành động phải sử dụng được.

## Kết quả kiểm tra bản dựng

216 tệp HTML, 14 CSS và 19 JavaScript được quét để tìm ảnh trực tiếp, ảnh responsive, ảnh nền và poster. Cả 199 tệp ảnh đóng gói đều giải mã được. Trong 178 đường dẫn ảnh của ứng dụng, không phát hiện đường dẫn thiếu hoặc chiều rộng khai báo sai trong srcset. Có 12 đường dẫn lịch sử trong CSS tham chiếu HR2B lưu trữ riêng, ngoài các stylesheet được website nạp. Bản kiểm kê tệp xác nhận nội dung gói xuất bản. Tình trạng mạng của người xem có thể khác.

Kiểm thử Chromium ở chiều rộng 390 px và 1440 px phát hiện dòng thời gian còn trượt nếu bật giảm chuyển động giữa chừng. Sau khi sửa, ảnh đến đúng tab đã chọn ở khung hình kế tiếp và giữ nguyên vị trí suốt 630 ms quan sát. Ảnh Liên hệ ở hai chiều rộng lần lượt là 228 × 304 px và 245 × 327 px. Đây là kích thước mô phỏng trên Chromium.

Sau khi xuất bản v21, kiểm tra trực tiếp phát hiện nhãn dành cho trình đọc màn hình trong bản sao dải logo làm xuất hiện thanh cuộn ngang của cả trang. Bản hiệu chỉnh đặt nhãn bên trong vùng cuộn của chính dải. Trong Chromium với vùng nội dung 1421 px, chiều rộng tài liệu giảm từ 2341 xuống 1421 px. Ở 390 px, số đo giảm từ 1151 xuống 390 px. Các thẻ và logo vẫn cuộn được trong dải.
