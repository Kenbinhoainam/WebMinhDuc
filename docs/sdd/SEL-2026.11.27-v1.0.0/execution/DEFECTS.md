# Lỗi, sai lệch nguồn và phần chưa nghiệm thu

Các mục W0–W5 bên dưới được đo từ nhiều bản có SHA riêng. [Ứng dụng và biên nhận bàn giao](PREVIEW-RELEASE.md)

Kết quả chi tiết và điều kiện kiểm lại nằm trong [ma trận từng mã](RESULT-BY-CHOICE.csv). Một dòng chưa đủ bằng chứng được giữ là Incomplete hoặc Blocked. Lỗi đã quan sát và sửa chỉ được đóng khi ca phù hợp chạy lại trên nguồn hoặc gói tương ứng.

## Lỗi và sai lệch đã xử lý

| Mục | Hiện tượng đã xác định | Cách sửa và kiểm lại |
| --- | --- | --- |
| W0 · Nguồn reviewer và đường dẫn gói | Source GitHub handoff không có `duyet.html`; Sites đối chiếu có reviewer. Đường dẫn Pages có tiền tố khác với bản Sites. | `d4fdafb` ghim chuỗi nguồn, khôi phục reviewer, tách profile hosting. Các phép kiểm tham số và đường dẫn gói đã chạy. Số lựa chọn reviewer vẫn có xung đột nghiệm thu riêng ở dưới. [Baseline](SOURCE-BASELINE.md) · [Bằng chứng reviewer](trace-reviewer.json) |
| W2 · FAQ dịch vụ | Các cụm FAQ dùng ID theo chỉ số giống nhau; cập nhật dựa trên state từng lần render có thể không phản ánh lần bấm cuối. | `5e44af0` cấp ID theo instance và cập nhật theo giá trị trước đó; panel đóng không nhận tương tác. Kiểm tra lại hành vi trong suite B2B và hồi quy cấu trúc. [B2B](b2b-qa/s2-b2b-flows.log) · [Hồi quy](logs/test-reference.log) |
| W2 · Ảnh thẻ dịch vụ lỗi | Thuộc tính `hidden` không thắng quy tắc hiển thị ảnh trang trí, nên lớp ảnh hỏng có thể còn nằm trên thẻ. | `b9ed5aa` áp dụng quy tắc ẩn riêng cho ảnh. Ca mô phỏng lỗi kiểm lớp ảnh đã ẩn và nội dung/đường dẫn thẻ còn dùng được. Kích thước và hiển thị trên thiết bị thật thuộc phép kiểm riêng. [QA độc lập](qa/choice-evidence.json) |
| W4 · CS-C07-4, trạng thái CMS cũ | Sửa nội dung sau khi lưu nháp hoặc xuất bản thử vẫn hiện thông báo thành công của phiên bản trước. | `4231bae` hiện trạng thái chưa lưu nếu bản đang sửa khác bản đã lưu. Kiểm tra lại cả hai luồng và đối chiếu nội dung đã lưu không đổi khi người dùng mới gõ. Ma trận còn ghi riêng điều kiện chưa đo nếu áp dụng. [Log kiểm lại](w4-qa/s2-other-pages.log) · [Audit chung](logs/common-audit.log) |
| W4 · P22-B1 / P22-B3 | Bản dài mới có sáu chương nhưng đã đổi ba đề mục đã duyệt và mất checklist bốn mục trong tiêu chí đóng băng. | `4231bae` khôi phục đúng ba đề mục ở chương 1, 3, 5 và checklist bốn mục, giữ đủ sáu chương. Cả hai mã đã kiểm đạt về chữ, thứ tự và neo ở năm ngôn ngữ trên Pages và Sites. [Kiểm thử](w4-qa/editorial-reference.log) · [Pages](w4-qa/artifact-check.log) · [Sites](w4-qa/site-artifact-check.log) |
| W3/W4 · MI05 / CS-C04-3, F04/F06 | F04 thiếu hàng tệp và nút xóa riêng. F06 có tên nhưng thiếu dung lượng tệp. | `416ea37` dùng chung bộ chọn và giữ metadata. Kiểm lại hai form trong năm ngôn ngữ, gồm chọn/thay/hủy/xóa tệp, chuyển focus, nháp và không gửi dữ liệu. `625a2ea` khôi phục cảnh báo ngay khi metadata sai. `6e7a7e4` bổ sung thông báo thay/xóa tệp. Hộp thoại hệ điều hành và hiển thị tên rất dài vẫn cần phép kiểm thiết bị. [Log tệp](w4-qa/s2-residual-files.log) |
| W1 · Focus và nhãn điều hướng | Xóa từ khóa có thể làm mất điểm focus; một số đích neo chưa nhận focus. Nhãn menu con cần phản ánh trạng thái mở/đóng. | `416ea37` trả focus về ô tìm kiếm và đưa focus tới đích neo mà không thêm điểm Tab. Đồng bộ nhãn nút menu theo trạng thái. Sử dụng log điều hướng và kiểm thử trình duyệt riêng khi đánh giá từng tiêu chí. [Header](logs/test-header.log) · [Neo Giới thiệu](w4-qa/about-anchors.log) |
| W4 · P36-D2 / CS-D01-2, bảng ADMIN | Chromium phát hiện chiều rộng tài liệu vượt viewport, dù bảng đã có vùng cuộn riêng. Cột thao tác ở tiêu đề làm tràn vùng ngoài. | `49259cc` giữ tiêu đề thao tác trong vùng cuộn; cột vẫn có tên cho công nghệ trợ giúp. Chromium RC4, bản Site, tiếng Việt đo chiều rộng tài liệu 320 px ở viewport 320 px và 390 px ở viewport 390 px. Ở 820 px, tài liệu vẫn rộng 838 px. `6e7a7e4` giới hạn độ rộng bộ lọc ở tablet. Bản bàn giao khớp chiều rộng ở 320/390/820 px trên năm ngôn ngữ, bảng 760 px cuộn trong khung riêng. Cần kiểm tiếp các ngưỡng và thao tác cuộn bằng bàn phím, thiết bị thực. [Kiểm tra HTML](w4-qa/site-artifact-check.log) · [Đo chiều rộng Chromium](w4-qa/admin-responsive-chromium.log) |
| W1/W4 · Đích focus CTA Giới thiệu | Kiểm thử DOM phát hiện điều hướng neo PUSH mới ghi đè focus đã đưa vào tiêu đề form F01. | `07e6187` giữ tiêu điểm trong vùng đích nếu đã được đặt. Kiểm lại neo trực tiếp, Back/Forward và focus tiêu đề form trước và sau khi chuyển chế độ. [Kiểm thử neo](w4-qa/about-anchors.log) |
| W4 · Độ tương phản ADMIN và Chính sách | Kiểm tra trình duyệt xác định một số màu điều khiển ADMIN và trạng thái hover liên kết Chính sách có tỷ lệ tương phản thấp. | `625a2ea` đổi màu trên các điều khiển và trạng thái bị ảnh hưởng. Phạm vi đo thực tế nằm trong chứng cứ kiểm trình duyệt. |
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

## Nhãn bản đồ Liên hệ

Ở v5, 32 phép kiểm của P37-D3 ghi nhận tên iframe dùng địa danh tiếng Việt trong bốn ngôn ngữ khác. Commit `c25a398` dịch tên văn phòng theo cùng danh mục với chú thích trên màn hình. Kiểm lại toàn bộ 615 trường hợp W2 ở năm ngôn ngữ đạt 615/615. [Trước khi sửa](https://github.com/Kenbinhoainam/WebMinhDuc/actions/runs/46009841455) · [Sau khi sửa](https://github.com/Kenbinhoainam/WebMinhDuc/actions/runs/46010404698)

## Phân biệt lỗi với độ bao phủ

- Các bộ kiểm thử hồi quy cuối, kiểm tra DOM và kiểm tra HTML đóng gói có bằng chứng đạt cho các phép đã chạy. Không suy từ kết quả đó ra kết luận về toàn bộ 1.257 lựa chọn. [Hồi quy](logs/regression.json)
- Các tiêu chí cần so sánh ảnh trước/sau trên trình duyệt, đo màu và chữ thực, zoom 200%, chạm, IME, bàn phím ảo iOS/Android, trình đọc màn hình, giải mã video/âm thanh hoặc báo cáo LCP/CLS/INP phải có phép đo tương ứng. Kiểm tra CSS/HTML và khung iframe P41 chưa cung cấp bằng chứng thay thế. [QA độc lập và giới hạn](qa/README.md)
- Các tiêu chí phải quan sát người dùng ngoài nhóm thực thi vẫn cần UAT. Trong ma trận, xem `next_owner`, `next_check` và `blocker` để phân biệt việc có thể kiểm thêm với việc cần quyết định hoặc nguồn xác thực. [Ma trận và hướng dẫn đọc](TRACE-READING.md)

## Lịch tư vấn và lỗi từng trường

MI06-1 và MI06-2 trên v6 thiếu tóm tắt trước khi bấm Tiếp tục. Commit `9db1adb` cập nhật ngày giờ trong vùng thông báo, gồm cả thao tác đổi bằng phím. [Trước](browser/booking-final/c25a398a/choices.json) · [Sau](browser/booking-final/9db1adb2/choices.json)

CS-C08-3 trên v7 giữ lỗi điện thoại sau khi người dùng nhập lại số hợp lệ ở F01–F04. Commit `d67c991` dùng lại cùng quy tắc để kiểm trường vừa sửa sau lần gửi đầu. Bài kiểm quan sát focus, liên kết thông báo, các lỗi còn lại và dữ liệu đã điền. [Trước](browser/form-feedback-9db1adb/observations.json) · [Sau](browser/form-feedback-d67c991/observations.json)

## Bỏ lưu ở tab thứ hai

Trên v9, một thẻ việc làm đang có focus bị xóa trước khi trình xử lý sự kiện storage kịp đọc phần tử. Ở v10, bước gỡ thẻ của React xác định điều khiển cần thay thế và giữ focus ở thẻ liền kề hoặc nút của danh sách trống. [Trước khi sửa](b2c-saved-focus/before.json) · [So sánh theo tình huống](b2c-saved-focus/choices.json)
