# Sprint 2 — Demo Scope & Acceptance Baseline

**PO decision:** 22/11/2026 **APPROVED** cho interactive **prototype sử dụng dữ liệu mô phỏng**: màn hình **M01–M07**, tiêu chí **D-01–D-09**. Không phải approved production scope hoặc triển khai backend.

Mốc demo 24/11/2026 từng là mục tiêu kế hoạch, không tự coi đã được thực hiện; cần đối chiếu preview thực, biên bản khách và mốc mới nếu sử dụng tiếp.

## 1. Approved demo screens

| Screen | Minimum UI and observed behavior |
| --- | --- |
| M01 — Home | Thông điệp B2B/B2C, CTA riêng Tìm việc và Gửi nhu cầu nhân lực |
| M02 — Jobs | Tìm kiếm/lọc dữ liệu giả theo KCN/loại/ca; trạng thái có/không có kết quả |
| M03 — Job detail | JD, quyền lợi, mã tin và hạn; tin hết hạn không cho gửi mẫu |
| M04 — F03 | Họ tên, điện thoại, mã tin từ JD; validation và **mã tiếp nhận demo** |
| M05 — Company/services | Năng lực/doanh nghiệp, năm dịch vụ, đường vào B2B; dữ kiện chưa xác minh có nhãn minh họa |
| M06 — F01 | Bốn trường bắt buộc theo baseline; trạng thái lỗi/đúng và mã demo |
| M07 — ADMIN mock | Hai nhóm F01/F03, chủ thể xử lý/trạng thái/nguồn mô phỏng, giải thích quy trình dự kiến |

**M08** chỉ là phần tài liệu bổ trợ về các form còn lại, không phải màn hình bắt buộc trong demo tối thiểu.

## 2. Hai luồng demo

**B2C:** Home → tìm và lọc việc → chi tiết → thử lỗi F03 → gửi fixture hợp lệ → nhận mã giả → ADMIN mock xem bản ghi/nhân viên phụ trách. Chỉ giải thích dữ liệu sẽ đi đâu trong production, không giả mạo đã lưu DB.

**B2B:** Home → năng lực/dịch vụ → F01 yêu cầu nhân lực → validation → mã giả → ADMIN mock xem nhóm B2B và trạng thái. Tất cả thông tin cá nhân nhập trong demo phải là fixture giả.

## 3. Demo acceptance criteria

| ID | Expected result & verification | Status |
| --- | --- | --- |
| D-01 | Mở được bằng URL/interactive link trên điện thoại; ghi version và nguồn preview | NOT RUN in this consolidation |
| D-02 | Trang chủ, dịch vụ và thông điệp B2B/B2C rõ, giao diện nhất quán | NOT RUN |
| D-03 | Bộ lọc điều khiển được, kết quả chính xác theo fixture; mở đúng JD | NOT RUN |
| D-04 | F03 có required validation, xác nhận, demo reference ID | NOT RUN |
| D-05 | F01 có bốn required fields, xác nhận demo | NOT RUN |
| D-06 | ADMIN mock cho thấy F01/F03 riêng, có trạng thái, nơi nhận/phụ trách | NOT RUN |
| D-07 | Không lỗi cản hai journeys và không tràn/vỡ bố cục mobile | NOT RUN |
| D-08 | Ghi rõ mock vs real; không có email/DB/Google Sheets thật | NOT RUN |
| D-09 | Có production acceptance draft để đối chiếu phạm vi, không phải nghiệm thu sản phẩm | Draft exists; approval pending |

**QA evidence template:** test ID, URL, commit/build/version, viewport, ngôn ngữ, data fixture, thao tác, expected/actual, screenshot/video/log, reviewer, Pass/Fail/Blocked/Not Run.

**QA responsive:** 320, 390, 430, 768, 1024, 1440 và 1920 CSS px; kiểm thêm breakpoint thực của thành phần. Bảo vệ keyboard/focus, zoom 200%, reduced motion, nội dung không che bởi overlay; không suy từ ảnh tĩnh rằng đã Pass.

## 4. Production acceptance is separate

HR-WEB-01 có AC-01…AC-27 (production) và HD-01…HD-14 (handover) ở trạng thái **draft**. QA backend/API, security, real intake, private upload, operational Google Sheets, CMS production, vận hành/backup/restore chỉ có thể nghiệm thu sau khi spec và hợp đồng tương ứng được duyệt và thực thi. Demo Approved **không tự mở rộng** giá hoặc phạm vi gói cơ sở.

**No scope extension:** M01–M07 approval does not authorize five new UX SDD items in file 05; they remain pending individual PO approval.
