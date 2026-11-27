# Tra từ mã lựa chọn tới bằng chứng

Mở `RESULT-BY-CHOICE.csv` bằng trình đọc CSV UTF-8. Mỗi dòng logic ứng với một dòng **Chọn** của sheet đóng băng. Các ô mô tả thành phần có thể chứa nhiều dòng văn bản. Lọc theo `choice_id`, `acceptance_id`, `sheet` hoặc `source_row`.

- `source_file` dẫn tới dòng JSONL chứa đầy đủ yêu cầu, điều kiện và ghi chú. Mã nguồn của B625 vẫn là chữ **Chọn**. Mã tạm chỉ giúp theo dõi lỗi nguồn.
- `scope_gate` giữ nguyên phân loại gốc, kể cả 146 mục E cấp trang. Một mục E có thể được nghiệm thu trong giới hạn hành vi đã có ở bản demo.
- `implementation_status` phân biệt **Completed**, **Incomplete** và **Blocked**. `test_status` ghi kết quả đối với tiêu chí đầy đủ. Khi một phép thử thành phần đạt nhưng tiêu chí còn đòi kiểm thử trình duyệt hoặc thiết bị, cột bằng chứng ghi phép thử đã chạy, còn dòng có thể vẫn là **Incomplete / Not Run**. Một yêu cầu bị chặn do hai phiên bản nội dung khác nhau có thể có phép so sánh **Fail** đã quan sát.
- `target_sha` là commit của mã ứng dụng GitHub đã kiểm, dùng chung cho các tài liệu bàn giao được commit sau đó. Xem `PREVIEW-RELEASE.md` để đối chiếu commit này với source và deployment riêng của Sites.
- `next_owner`, `next_check` và `blocker` nêu công việc còn lại của từng dòng. Chỉ chuyển kết quả sau khi có bằng chứng trên build tương ứng.

## Nguồn bằng chứng

`trace-content.json` đối chiếu nội dung dịch vụ, các bản ghi việc làm, bản tin, chương trình đào tạo và tài liệu chính sách với HTML thành phẩm ở năm ngôn ngữ. Mỗi nhóm kết quả lưu các giá trị thực, route, SHA của ứng dụng và hash của toàn bộ HTML đã đọc. Các thử nghiệm mô hình DOM không đo bố cục.

`trace-regression.json` ánh xạ một số assertion trong suite hiện có vào các mã phù hợp, kèm tên test, log và SHA-256 của log. Một suite đạt chỉ là bằng chứng cho các assertion thực sự được chạy. `qa/choice-evidence.json` chứa các ca độc lập với tham chiếu đến quan sát cụ thể. Các bảng theo wave ghi các trường hợp xung đột phạm vi, kết quả của tác giả, bước còn thiếu và SHA của các phép kiểm đã chạy lại.

`SELECTION-INTEGRITY.json` đối chiếu từng tệp trong thư mục SDD tại commit bàn giao, gồm các tài liệu, toàn bộ dữ liệu đóng băng và bảng mẫu kết quả. Thuật toán cũng kiểm số lượng mã duy nhất, tọa độ sheet, mã thô và mã nghiệm thu.

`media-audit.json` và `media-inventory.json` lưu các phép kiểm tài nguyên ảnh theo route và ngôn ngữ. `common-audit.json` (khi có trong bàn giao) ghi các phép kiểm chung theo mã. `shared-qa/MOTION-INVENTORY.csv` chỉ vị trí mã nguồn của từng lựa chọn motion. `TRACE-GAPS.md` nhóm các mã Blocked theo người xử lý và điều kiện để kiểm lại.

`trace-accessibility.json` kiểm tra 200 tổ hợp route/ngôn ngữ trên gói Sites. Báo cáo lưu số H1/main, ID trùng, các liên kết ARIA và nguồn tên của các điều khiển HTML. Các quan hệ aria-controls đến bảng đóng được thống kê riêng. Cây trợ năng trình duyệt và tiếng đọc thực tế cần phép kiểm riêng.

`trace-reviewer.json` và `p41.csv` kiểm tra P41 trên hai tệp HTML đã đóng gói. Chạy `node tests/s2-trace-reviewer.mjs <target_sha> <dist-sites> <dist-pages>` trước khi ghép ma trận. Các kích thước input của bộ kiểm là viewport mô phỏng.

## Lập lại ma trận

Từ thư mục gốc của repo, checkout commit có các tài liệu chạy và dùng build đúng `target_sha`. Cần có `dist`, kết quả các package QA và log đã ghim commit.

1. Chạy `node tests/s2-trace-content.mjs <execution>/trace-content.json <dist> <target_sha>`. Với build ở gốc Sites, đặt `MINHDUC_PREVIEW_ORIGIN` đúng origin của preview khi gọi. Mã thoát 1 lưu lại cả phép so sánh chưa đạt.
2. Chạy `python tests/s2-trace-accessibility.py --dist <dist-sites> --sha <target_sha>`. Cần Python với lxml.
3. Chạy `python tests/s2-trace-regression.py --sha <target_sha>` sau khi các suite và log theo SHA hoàn tất.
4. Chạy `python tests/s2-trace-matrix.py --sha <target_sha>`. Script đối chiếu bản đóng băng và từ chối gộp báo cáo thuộc commit khác.
