# Tra từ mã lựa chọn tới bằng chứng

Mở `RESULT-BY-CHOICE.csv` bằng trình đọc CSV UTF-8. Mỗi dòng logic ứng với một dòng **Chọn** của sheet đóng băng. Các ô mô tả thành phần có thể chứa nhiều dòng văn bản. Lọc theo `choice_id`, `acceptance_id`, `sheet` hoặc `source_row`.

- `source_file` dẫn tới dòng JSONL chứa đầy đủ yêu cầu, điều kiện và ghi chú. Mã nguồn của B625 vẫn là chữ **Chọn**. Mã tạm chỉ giúp theo dõi lỗi nguồn.
- `scope_gate` giữ nguyên phân loại gốc, kể cả 146 mục E cấp trang. Một mục E có thể được nghiệm thu trong giới hạn hành vi đã có ở bản demo.
- `implementation_status` phân biệt **Completed**, **Incomplete** và **Blocked**. `test_status` ghi kết quả đối với tiêu chí đầy đủ. Khi một phép thử thành phần đạt nhưng tiêu chí còn đòi kiểm thử trình duyệt hoặc thiết bị, cột bằng chứng ghi phép thử đã chạy, còn dòng có thể vẫn là **Incomplete / Not Run**. Một yêu cầu bị chặn do hai phiên bản nội dung khác nhau có thể có phép so sánh **Fail** đã quan sát.
- `target_sha` là commit của mã ứng dụng GitHub đã kiểm, dùng chung cho các tài liệu bàn giao được commit sau đó. Xem `PREVIEW-RELEASE.md` để đối chiếu commit này với source và deployment riêng của Sites.
- `evidence_shas` liệt kê các commit mà bằng chứng tham chiếu tới. `acceptance_pass_shas` cho biết bản nào đã thực sự chạy phép thử đầy đủ của một dòng Completed. Giữa `88e2b615` và `c25a398a`, thay đổi duy nhất là dịch tên văn phòng cho thuộc tính title của iframe bản đồ. Script đối chiếu commit cha, danh sách tệp và SHA-256 của diff trước khi kế thừa kết quả. Các phép so sánh title cũ và bằng chứng cũ cho P37-D3 bị loại khỏi kết quả bản sửa title. Giữa `c25a398a` và `9db1adb2`, mã thay đổi giới hạn trong trang đặt lịch, CSS của trang và test tương ứng. Bằng chứng cũ của P38, MI06 và các phép kiểm ngày/giờ đặt lịch chỉ được dùng khi bước kiểm đã chạy lại trên bản mới.
- `next_owner`, `next_check` và `blocker` nêu công việc còn lại của từng dòng. Chỉ chuyển kết quả sau khi có bằng chứng trên build tương ứng.

## Nguồn bằng chứng

`trace-content.json` đối chiếu nội dung dịch vụ, các bản ghi việc làm, bản tin, chương trình đào tạo và tài liệu chính sách với HTML thành phẩm ở năm ngôn ngữ. Mỗi nhóm kết quả lưu các giá trị thực, route, SHA của ứng dụng và hash của toàn bộ HTML đã đọc. Các thử nghiệm mô hình DOM không đo bố cục.

`trace-regression.json` ánh xạ một số assertion trong suite hiện có vào các mã phù hợp, kèm tên test, log và SHA-256 của log. Một suite đạt chỉ là bằng chứng cho các assertion thực sự được chạy. `qa/choice-evidence.json` chứa các ca độc lập với tham chiếu đến quan sát cụ thể. Các bảng theo wave ghi các trường hợp xung đột phạm vi, kết quả của tác giả, bước còn thiếu và SHA của các phép kiểm đã chạy lại.

`SELECTION-INTEGRITY.json` đối chiếu từng tệp trong thư mục SDD tại commit bàn giao, gồm các tài liệu, toàn bộ dữ liệu đóng băng và bảng mẫu kết quả. Thuật toán cũng kiểm số lượng mã duy nhất, tọa độ sheet, mã thô và mã nghiệm thu.

`media-audit.json` và `media-inventory.json` lưu các phép kiểm tài nguyên ảnh theo route và ngôn ngữ. `common-audit.json` (khi có trong bàn giao) ghi các phép kiểm chung theo mã. `shared-qa/MOTION-INVENTORY.csv` chỉ vị trí mã nguồn của từng lựa chọn motion. `TRACE-GAPS.md` nhóm các mã Blocked theo người xử lý và điều kiện để kiểm lại.

`trace-accessibility.json` kiểm tra 200 tổ hợp route/ngôn ngữ trên gói Sites. Báo cáo lưu số H1/main, ID trùng, các liên kết ARIA và nguồn tên của các điều khiển HTML. Các quan hệ aria-controls đến bảng đóng được thống kê riêng. Cây trợ năng trình duyệt và tiếng đọc thực tế cần phép kiểm riêng.

`trace-reviewer.json` và `p41.csv` kiểm tra P41 trên hai tệp HTML đã đóng gói. Chạy `node tests/s2-trace-reviewer.mjs <target_sha> <dist-sites> <dist-pages>` trước khi ghép ma trận. Các kích thước input của bộ kiểm là viewport mô phỏng.

Khi có biên nhận CI trên cùng SHA, `browser-choice-evidence.json`, `browser-reviewer-evidence.json` và `browser-a11y-evidence.json` dẫn tới số thứ tự của phép đo trong artifact gốc. `case_indices` bắt đầu từ 0 trong mảng checks. Thông tin đếm Pass/Fail của toàn bộ lượt chạy và phạm vi thiết bị nằm ở report Chromium và axe. `tests/s2-trace-browser.py` kiểm code SHA và gộp theo từng mã; chỉ nâng mức nghiệm thu nếu tổ hợp thao tác hoặc viewport/ngôn ngữ đã đầy đủ cho mã đó. `tests/s2-trace-axe.py` giữ riêng kết quả từng quy tắc, kể cả các quy tắc cần người kiểm.

Chromium chạy độc lập trên gói Pages có chứng cứ trong `browser/keyboard-zoom/`, `browser/keyboard-zoom-edges/` và `browser/service-keyboard/`. Các báo cáo ghi tỷ lệ điểm ảnh, độ rộng CSS và phép tăng cỡ chữ riêng ở ô bảng. Tại các bài và sự kiện, mỗi lượt ghi đúng H2 đang được focus và khoảng cách thực đối với header. Tại bảng, thử bàn phím tới cột cuối và quay về cột đầu. Các trang dịch vụ có kết quả thứ tự Tab tới footer và thứ tự trực quan của các nhóm thông tin. Các phiên duyệt này chỉ đọc tài nguyên từ thư mục dist.

Các phép kiểm bổ sung có báo cáo riêng. `browser/hero-end-88e2b615/hero-end-choices.json` ghi trạng thái sau sự kiện kết thúc video. `browser/motion-final/88e2b615/choices.json` ghi thời gian chuyển động và kết quả khi ngắt thao tác. `residual-education/choices.json` nối từng chương trình với biên nhận ADMIN. `residual-browser.json` lưu quan sát hàng tệp trên Chromium. `b2b-qa/browser-choices.json` đối chiếu ảnh, vị trí focus trong hộp thoại và các văn phòng liên hệ. Dùng SHA của báo cáo và trường `qa_input_sha256` trong `SELECTION-INTEGRITY.json` để xác định phiên bản quan sát.

Bản đối chiếu trước khi sửa ba lỗi motion nằm ở [ma trận 07e61874](logs/previous/trace-07e61874/RESULT-BY-CHOICE.csv.gz). Khi giải nén, SHA-256 của CSV phải khớp [biên bản kiểm tra](logs/previous/trace-07e61874/SELECTION-INTEGRITY.json). Ba dòng `MO02-4`, `MO03-3`, `MO03-4` có kết quả Fail trên bản này. Đối chiếu hai lượt Chromium theo [build trước](browser/motion-final/07e61874/observations.json) và [build sau](browser/motion-final/88e2b615/observations.json).

Các phiên sau lưu [ma trận trước khi sửa title bản đồ](logs/previous/trace-88e2b615/RESULT-BY-CHOICE.csv.gz) và [ma trận trước khi sửa trang đặt lịch](logs/previous/trace-c25a398a/RESULT-BY-CHOICE.csv.gz). So sánh hành vi tại trang đặt lịch theo [bản cũ](browser/booking-final/c25a398a/choices.json) và [bản mới](browser/booking-final/9db1adb2/choices.json).

Thay đổi cuối `d67c9914` cập nhật trạng thái lỗi trường sau lần gửi trong F01–F04. Mỗi chiều kế thừa được ghi riêng trong `change_impact`. So sánh [lỗi ban đầu trên bốn biểu mẫu](browser/form-feedback-9db1adb/observations.json), [ma trận 9db1adb2](logs/previous/trace-9db1adb2/RESULT-BY-CHOICE.csv.gz) và [lượt thử sau sửa trên sáu biểu mẫu](browser/form-feedback-d67c991/observations.json).

Bản `c83bd900` chưa trả focus đúng khi tab khác gỡ thẻ đang đọc. Bản `66b76036` ghi nhận control đang focus trước khi React gỡ thẻ khỏi DOM. So sánh [lượt trước](b2c-saved-focus/before-c83.json) với [lượt sau](b2c-saved-focus/choices.json). Logic nhập trường của F03/F04 vẫn có phép đo riêng trên bản sửa lỗi biểu mẫu; các quan sát cũ về focus hoặc đồng bộ tab của P18 được lọc ra. Trường `completed_by_execution` trong biên bản cho biết số mã Completed đã xác minh đầy đủ trên commit đích và số mã sử dụng kết quả đã chạy ở commit trước.

## Lập lại ma trận

Từ thư mục gốc của repo, checkout commit có các tài liệu chạy và dùng build đúng `target_sha`. Cần có `dist`, kết quả các package QA và log đã ghim commit.

1. Chạy `node tests/s2-trace-content.mjs <execution>/trace-content.json <dist> <target_sha>`. Với build ở gốc Sites, đặt `MINHDUC_PREVIEW_ORIGIN` đúng origin của preview khi gọi. Mã thoát 1 lưu lại cả phép so sánh chưa đạt.
2. Chạy `python tests/s2-trace-accessibility.py --dist <dist-sites> --sha <target_sha>`. Cần Python với lxml.
3. Chạy `python tests/s2-trace-regression.py --sha <target_sha>` sau khi các suite và log theo SHA hoàn tất.
4. Chạy `python tests/s2-trace-matrix.py --sha <target_sha>`. Script đối chiếu bản đóng băng. Với các bản sửa title bản đồ, tóm tắt giờ hẹn, phản hồi khi nhập lại và focus danh sách việc đã lưu, chỉ các bằng chứng thuộc commit cha đã xác minh và phạm vi không bị thay đổi mới có thể được kế thừa.
