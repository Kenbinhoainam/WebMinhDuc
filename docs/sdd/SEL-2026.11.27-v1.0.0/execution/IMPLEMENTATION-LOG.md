# Nhật ký triển khai Sprint 2

**Mã thực thi** `MD-S2-UI-UPGRADE-SEL-2026.11.27-v1.0.0`
**Bản lựa chọn** `SEL-2026.11.27-v1.0.0` · **Đặc tả** `MDU-SDD-v1.0.0`
**Mốc ứng dụng** `88e2b61596eab5952f183a81b3030da760696c9c` · 27/11/2026

## Nguồn và chuỗi commit

Bản handoff `5744b6d` đóng băng các yêu cầu trên GitHub v30 `08e2da4`. Sites Sprint 1 UI Review có lịch sử riêng. Đã tìm được commit `bc0610e` nêu trong đặc tả và đối chiếu với Sites v3 `3453c09`. Giữ mã ứng dụng mới hơn của GitHub và khôi phục công cụ duyệt từ bản Sites v3 đã xác minh. [Đối chiếu nguồn](SOURCE-BASELINE.md) · [Đối chiếu Sheet sau đóng băng](SELECTION-DELTA.md)

| Commit | Giờ Việt Nam | Thay đổi thực tế |
| --- | --- | --- |
| `d4fdafb` | 19:33 | Chốt baseline, khôi phục `public/duyet.html`, tạo profile build riêng cho Pages và Sites, giữ đường dẫn của từng môi trường. |
| `9c8ac36` | 19:38 | Tích hợp nền tảng chung W1 và các luồng W2–W4. Bổ sung kiểm thử hành vi, ma trận route và kiểm tra độc lập. |
| `5e44af0` | 19:39 | Tách ID mỗi cụm FAQ, đồng bộ nút và panel, xử lý bấm liên tiếp, bổ sung kiểm thử locale và bảng màu. |
| `b9ed5aa` | 19:39 | Sửa lớp ảnh trang trí của thẻ dịch vụ khi tài nguyên ảnh không tải được. Bổ sung ca kiểm tra dự phòng và điều chỉnh đối chiếu HTML theo profile lưu trữ. |
| `4231bae` | 20:02 | Sửa phản hồi cũ của CMS sau khi sửa bản nháp. Khôi phục ba đề mục và checklist P22 theo bản đã duyệt, giữ sáu chương. Bổ sung kiểm tra nội dung, trợ năng HTML, tài nguyên ảnh và reviewer. |
| `416ea37` | 20:11 | Dùng chung bộ chọn tệp cho F04/F06, hiển thị tên/dung lượng và nút xóa từng tệp. Sửa focus sau xóa tìm kiếm và điều hướng neo; đồng bộ nhãn mở/đóng menu. |
| `49259cc` | 20:13 | Giữ cột thao tác ADMIN bên trong vùng cuộn bảng ở màn hình hẹp. Thêm phép đo bố cục theo dữ liệu trình duyệt. |
| `625a2ea` | 20:18 | Khôi phục cảnh báo chọn tệp ngay khi metadata sai và sửa các màu có độ tương phản thấp ở ADMIN và Chính sách. |
| `6e7a7e4` | 20:20 | Giới hạn độ rộng bộ lọc ADMIN ở tablet. Thêm thông báo thay/xóa tệp cho F04/F06. |
| `07e6187` | 20:20 | Điều hướng tới neo giữ focus đã nằm trong vùng đích. CTA Giới thiệu giữ focus trên tiêu đề form khi bắt đầu F01. |
| `88e2b61` | 20:37 | Áp dụng chuyển động có thể ngắt cho bộ lọc Việc làm, chuyển mục Hành trình và biên nhận trong hộp thoại. |

## Phạm vi đã thực hiện

| Luồng | Thay đổi | Bằng chứng |
| --- | --- | --- |
| W0 · Nguồn, hosting, P41 | Cùng nguồn ứng dụng được build cho Pages tại `/WebMinhDuc/` và Sites tại gốc. Reviewer giữ tám trang gốc và năm lối tắt đã có ở Sites v3. Kiểm tra tham số, khung mô phỏng và URL mở tab riêng theo từng gói. | [Baseline](SOURCE-BASELINE.md) · [Kiểm tra P41](trace-reviewer.json) · [Chromium trên hai gói](w4-qa/p41-chromium.json) · [Kết quả từng mã P41](p41.csv) |
| W1 · Nền tảng dùng chung | Đồng bộ trạng thái menu và điều hướng, khôi phục ngữ cảnh và focus, làm rõ phản hồi điều khiển. Dùng chung token màu và thời lượng; huỷ chuyển động khi cần và tôn trọng giảm chuyển động. | [Bảng W1](shared.csv) · [Kiểm kê motion](shared-qa/MOTION-INVENTORY.csv) |
| W2 · Trang chủ, dịch vụ, liên hệ | Duy trì hai đường đi doanh nghiệp/ứng viên và luồng F01/F02 mẫu. Cải thiện rail, FAQ, ngữ cảnh CTA và dự phòng thẻ ảnh. Biểu mẫu giữ validation và biên nhận demo. | [Bảng W2](b2b.csv) · [Kiểm thử luồng B2B](b2b-qa/s2-b2b-flows.log) |
| W3 · Việc làm, đã lưu, tuyển nội bộ | Bộ lọc giữ trạng thái và xử lý truy vấn tiếng Việt, lối ứng tuyển giữ việc đang chọn. Nút lưu và số lượng thống nhất kể cả khi bộ nhớ trình duyệt lỗi. Dải tuyển dụng có điều khiển. F03/F04 vẫn gửi thử trong phiên; việc đã đóng giữ đường quay về các tin mở. | [Bảng W3](b2c.csv) · [Log B2C](logs/b2c.log) |
| W4 · Trang còn lại | Dải tin, lịch sử và đối tác có nút dừng/phát; giữ bộ lọc sự kiện qua chi tiết và giữ đường quay về danh mục tin. F05/F06 giữ nháp riêng, làm việc với metadata tệp; tư vấn giữ nháp khi đổi giờ. ADMIN đồng bộ query, modal và bộ lọc, có xác nhận khôi phục và xuất CSV có bảo vệ ô công thức. Chính sách giữ nhãn dự thảo và liên kết liên hệ. | [Bảng W4](other-pages.csv) · [Log W4](w4-qa/s2-other-pages.log) · [Kiểm tra F05/F06](w4-qa/education-submit-check.log) |
| W5 · Kiểm tra độc lập và truy vết | Kiểm tra hồi quy tại SHA ứng dụng, kiểm tra HTML hai gói, tài nguyên, route, locale, quyền truy cập và dữ liệu mẫu trong phạm vi có bằng chứng. Nối từng mã về sheet, điều kiện, chủ xử lý và bước còn lại. | [Hồi quy](logs/regression.json) · [QA độc lập](qa/README.md) · [Ma trận từng mã](RESULT-BY-CHOICE.csv) · [Cách đọc](TRACE-READING.md) |

## Kết quả đã xác minh và giới hạn

- Các lệnh trong [hồ sơ hồi quy](logs/regression.json) đều có mã thoát 0 tại `4231bae`. QA độc lập ghi 200 tổ hợp route/ngôn ngữ và 795 phép đối chiếu trên gói Pages. Kiểm tra ảnh giải mã 67 tài nguyên khác nhau. W4 kiểm lại 115 tổ hợp route/ngôn ngữ trên mỗi gói Pages và Sites. [Bằng chứng QA](qa/README.md) · [Gói Pages](w4-qa/artifact-check.log) · [Gói Sites](w4-qa/site-artifact-check.log)
- W4 đối chiếu SHA nguồn ứng dụng, SHA nguồn Sites `b9b58c4da406a91e43e94e2ad98a0f73327a47ab` và 262 tệp HTML được so ở v5. SHA-256 archive là `901989a98553b6c44e47d01c45a7d1c8f64196c0b58bc4c541929cf5585a9782`. [Log đối chiếu gói](w4-qa/site-artifact-check.log)
- Ma trận bao phủ 1.257 dòng Chọn. B625 giữ mã tạm và không được suy diễn thành mã hợp lệ. Kết quả đã chạy cho một phần của tiêu chí được ghi ở cột bằng chứng; không nâng thành Pass cho cả dòng khi còn thiếu điều kiện. [Toàn vẹn lựa chọn](SELECTION-INTEGRITY.json) · [Lỗi và điều kiện còn mở](DEFECTS.md)

Mã ứng dụng và tài liệu tổng hợp có thể mang SHA khác nhau. Khi bàn giao hoặc duyệt trên Sites, đối chiếu commit ứng dụng, nguồn Sites và biên nhận triển khai riêng do người phụ trách phát hành ghi. Website đích của Sprint 1 và bản production nằm ngoài phạm vi bản triển khai thử này.

Bản v6 đồng bộ tên iframe bản đồ với tên văn phòng đã dịch trên trang Liên hệ. Cả 615 phép kiểm trình duyệt W2 đạt sau khi sửa. [Biên nhận v6](browser/sites-v6-receipt.json) · [Kiểm thử W2](https://github.com/Kenbinhoainam/WebMinhDuc/actions/runs/46010404698)

Bản v7 hiện tóm tắt ngày giờ ngay khi chọn lịch, gồm cả thay đổi bằng phím mũi tên trước khi tiếp tục. Bản v8 sửa phản hồi lỗi từng trường sau lần gửi không hợp lệ ở F01–F04. Kiểm đối chứng nghiêm ngặt giữ nguyên kết quả đo trên từng bản. [Luồng đặt lịch](browser/booking-final/9db1adb2/choices.json) · [Đối chứng biểu mẫu trước sửa](browser/form-feedback-9db1adb/observations.json) · [Kiểm lại trên v8](browser/form-feedback-d67c991/observations.json)

Bản v9 xử lý trường hợp xóa tin cuối của một trang. Lượt kiểm hai tab cho thấy sáu ca vẫn mất focus. Bản v10 ghi nhận phần tử đang focus ngay trước khi React gỡ thẻ khỏi DOM. Query vẫn được giữ để nút Quay lại khôi phục đúng ngữ cảnh. [Commit](https://github.com/Kenbinhoainam/WebMinhDuc/commit/c83bd9001cf2629dfb1934515fcf1c05ae553910)
