# Lỗi, sai lệch nguồn và phần chưa nghiệm thu

**Commit ứng dụng đã kiểm** `4231bae137528dbf152250832c1a26d060c579d9`  
Kết quả chi tiết và điều kiện kiểm lại nằm trong [ma trận từng mã](RESULT-BY-CHOICE.csv). Một dòng chưa đủ bằng chứng được giữ là Incomplete hoặc Blocked. Lỗi đã quan sát và sửa chỉ được đóng khi ca phù hợp chạy lại trên nguồn hoặc gói tương ứng.

## Lỗi và sai lệch đã xử lý

| Mục | Hiện tượng đã xác định | Cách sửa và kiểm lại |
| --- | --- | --- |
| W0 · Nguồn reviewer và đường dẫn gói | Source GitHub handoff không có `duyet.html`; Sites đối chiếu có reviewer. Đường dẫn Pages có tiền tố khác với bản Sites. | `d4fdafb` ghim chuỗi nguồn, khôi phục reviewer, tách profile hosting. Các phép kiểm tham số và đường dẫn gói đã chạy. Số lựa chọn reviewer vẫn có xung đột nghiệm thu riêng ở dưới. [Baseline](SOURCE-BASELINE.md) · [Bằng chứng reviewer](trace-reviewer.json) |
| W2 · FAQ dịch vụ | Các cụm FAQ dùng ID theo chỉ số giống nhau; cập nhật dựa trên state từng lần render có thể không phản ánh lần bấm cuối. | `5e44af0` cấp ID theo instance và cập nhật theo giá trị trước đó; panel đóng không nhận tương tác. Kiểm tra lại hành vi trong suite B2B và hồi quy cấu trúc. [B2B](b2b-qa/s2-b2b-flows.log) · [Hồi quy](logs/test-reference.log) |
| W2 · Ảnh thẻ dịch vụ lỗi | Thuộc tính `hidden` không thắng quy tắc hiển thị ảnh trang trí, nên lớp ảnh hỏng có thể còn nằm trên thẻ. | `b9ed5aa` áp dụng quy tắc ẩn riêng cho ảnh. Ca mô phỏng lỗi kiểm lớp ảnh đã ẩn và nội dung/đường dẫn thẻ còn dùng được. Kích thước và hiển thị trên thiết bị thật thuộc phép kiểm riêng. [QA độc lập](qa/choice-evidence.json) |
| W4 · CS-C07-4, trạng thái CMS cũ | Sửa nội dung sau khi lưu nháp hoặc xuất bản thử vẫn hiện thông báo thành công của phiên bản trước. | `4231bae` hiện trạng thái chưa lưu nếu bản đang sửa khác bản đã lưu. Kiểm tra lại cả hai luồng và đối chiếu nội dung đã lưu không đổi khi người dùng mới gõ. Ma trận còn ghi riêng điều kiện chưa đo nếu áp dụng. [Log kiểm lại](w4-qa/s2-other-pages.log) · [Audit chung](logs/common-audit.log) |
| W4 · P22-B1 / P22-B3 | Bản dài mới có sáu chương nhưng đã đổi ba đề mục đã duyệt và mất checklist bốn mục trong tiêu chí đóng băng. | `4231bae` khôi phục đúng ba đề mục ở chương 1, 3, 5 và checklist bốn mục, giữ đủ sáu chương. Cả hai mã đã kiểm đạt về chữ, thứ tự và neo ở năm ngôn ngữ trên Pages và Sites. [Kiểm thử](w4-qa/editorial-reference.log) · [Pages](w4-qa/artifact-check.log) · [Sites](w4-qa/site-artifact-check.log) |
| Bộ kiểm tra · Đường dẫn và selector cũ | Một số assertion cũ dùng đường dẫn ảnh không có tiền tố Pages hoặc giả định rail không có nút dừng. Một câu lệnh thử gọi tệp không tồn tại trong repo. | Cập nhật tiền tố dựa trên profile và kiểm theo tên/đích của điều khiển mới. Nhật ký câu lệnh không áp dụng được lưu riêng, không dùng như lỗi ứng dụng hay kết quả đạt. [Hồi quy cuối](logs/regression.json) · [Câu lệnh không áp dụng](logs/previous/inapplicable-command.log) |

## Sai lệch hoặc phụ thuộc còn mở

| Chủ xử lý | Mã/phạm vi | Điều còn thiếu và cách tiếp tục |
| --- | --- | --- |
| PO | `ROW625-P01-A-UNRESOLVED` | Ô B625 chứa chữ “Chọn” thay cho mã. Giữ mã tạm trong ma trận; cần xác nhận mã thực trước khi nghiệm thu. |
| PO | `P41-B1`, `P41-C2` | Bản đóng băng mô tả tám lựa chọn, Sites v3 có thêm năm lối tắt đã bàn giao. Gói giữ danh mục v3. Cần chọn chuẩn đối chiếu số lượng trước khi thay đổi; các phép kiểm tham số và đường dẫn đã được đánh giá riêng. |
| PO / QA | `P21-D1`–`P26-D1` | Bản đóng băng nêu TOC mở mặc định từ 900 px. Bản v28 đã chọn disclosure HTML gốc thu gọn lúc SSR và hydrate để tránh xô nội dung, nên giữ hành vi đó. Xác nhận lại tiêu chí 900 px trước khi làm khác. |
| PO / Chủ nội dung | Liên kết sự kiện, bằng chứng năng lực, pháp lý | Địa điểm, link tham dự và tài liệu xác thực chưa đủ để biến lịch hoặc số liệu demo thành thông tin thực. Các trang chính sách vẫn là dự thảo và cần một lượt duyệt pháp lý riêng. |
| PO | E có điều kiện và đề xuất tương tác | Giữ chức năng demo đã chọn. Các mục tải/lưu checklist, Undo, sắp xếp thu nhập, đăng ký sự kiện, analytics, mở rộng CMS, ghi lịch hẹn vào ADMIN hay tích hợp bên ngoài cần quyết định riêng khi được yêu cầu. |

[Danh sách Blocked đầy đủ theo người xử lý](TRACE-GAPS.md)

## Phân biệt lỗi với độ bao phủ

- Các bộ kiểm thử hồi quy cuối, kiểm tra DOM và kiểm tra HTML đóng gói có bằng chứng đạt cho các phép đã chạy. Không suy từ kết quả đó ra kết luận về toàn bộ 1.257 lựa chọn. [Hồi quy](logs/regression.json)
- Các tiêu chí cần so sánh ảnh trước/sau trên trình duyệt, đo màu và chữ thực, zoom 200%, chạm, IME, bàn phím ảo iOS/Android, trình đọc màn hình, giải mã video/âm thanh hoặc báo cáo LCP/CLS/INP phải có phép đo tương ứng. Kiểm tra CSS/HTML và khung iframe P41 chưa cung cấp bằng chứng thay thế. [QA độc lập và giới hạn](qa/README.md)
- Các tiêu chí phải quan sát người dùng ngoài nhóm thực thi vẫn cần UAT. Trong ma trận, xem `next_owner`, `next_check` và `blocker` để phân biệt việc có thể kiểm thêm với việc cần quyết định hoặc nguồn xác thực. [Ma trận và hướng dẫn đọc](TRACE-READING.md)
