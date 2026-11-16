# Đối chiếu Sprint 1 — prototype 3

Nguồn: `source.txt`, bản người dùng cung cấp ngày 16/11/2026. Đã đọc đủ 280 dòng. Đây là bản Discovery v0.1, phân biệt nhu cầu xác nhận và đề xuất; không phải hợp đồng hay spec sản xuất đã khóa. Yêu cầu xây dựng prototype trong phiên hiện tại là phạm vi thực hiện; các đoạn dự thảo “chỉ đọc” mô tả trạng thái lịch sử.

## Các quyết định cho bản mẫu

- Q01: người dùng xác nhận **cả năm ngôn ngữ**: Việt, Anh, Trung giản thể, Hàn, Nhật. URL tiếng Việt giữ nguyên, bốn ngôn ngữ còn lại dùng `/en`, `/zh`, `/ko`, `/ja`. Bản dịch là bản nháp cho prototype.
- Q02: phân công thủ công; trạng thái Mới, Đang xử lý, Đã đóng. Nhân sự và hồ sơ quản trị đều giả định.
- Q03: cảnh báo số mẫu trùng sau khi chuẩn hóa, không chặn hồ sơ. Xuất CSV chứa dữ liệu mẫu, mã tin/chương trình, nguồn, ngày tiếp nhận, phụ trách, trạng thái.
- Q04: form kiểm tra dữ liệu ngay trên trình duyệt. CV bắt buộc cho tuyển nội bộ; hồ sơ bắt buộc cho đăng ký tuyển sinh. Giới hạn mẫu PDF/DOC/DOCX tối đa 5 MB. Tệp và thông tin nhập không được tải lên, gửi hay lưu. Khu quản trị chứa dữ liệu giả độc lập, không phải hồ sơ vừa nhập.
- Q05: mặc định ẩn việc đóng; có bộ lọc xem lại. Giữ trang chi tiết và khóa nút ứng tuyển. MD005 là ví dụ đóng; MD006 là ví dụ Tân Hưng + thời vụ + đêm.
- Q06–Q08: bản dịch/ảnh/thông tin thật, phạm vi thương mại, hạ tầng chính thức và vận hành cần chốt trước bản sản xuất. Không thay đổi giá hay thời hạn trong tài liệu nguồn.

## Truy nguyên yêu cầu

| ID | Trong prototype | Giới hạn sản xuất |
|---|---|---|
| GOV-01 | Bản nguồn được đồng bộ vào `/workspace/WebMinhDuc`, giữ remote GitHub baseline; Sites có repo hosting riêng | Chưa đẩy bản này lên GitHub |
| BIZ-01, UX-01 | Điểm vào B2B/B2C, nhu cầu nhân lực có cấu trúc, ứng tuyển và lối xem hồ sơ mẫu | Không tiếp nhận thật |
| BRAND-01 | Logo Minh Đức, xanh–trắng–đỏ; bố cục/ảnh tham chiếu HR2B | Chưa có ảnh tập thể Minh Đức được cung cấp |
| NAV-01 | 7 nhóm chính, trang phụ dưới nhóm phù hợp | — |
| SVC-01 | 5 nhóm dịch vụ, trang chủ/danh sách/chi tiết/hồ sơ giới thiệu đồng bộ | Nội dung dịch vụ cần duyệt nghiệp vụ |
| JOB-01, JOB-02 | Bộ lọc kết hợp KCN, loại việc, kỹ năng, ca ngày/đêm, chuyên/xoay ca, trạng thái; ví dụ hết hạn | Chưa có lịch đóng tin phía máy chủ |
| INT-01 | Tuyển nội bộ tách khỏi danh sách lao động, CV bắt buộc | Chưa có nơi lưu tệp/quyền tải |
| EDU-01 | 3 chương trình giả định, từ xa/chính quy; tư vấn và đăng ký riêng | Không xác nhận quan hệ với trường nào |
| FORM-01 | F01 B2B, F02 liên hệ, F03 lao động, F04 nội bộ, F05 tư vấn tuyển sinh, F06 hồ sơ tuyển sinh | Cần backend chống gửi lặp, spam, thông báo |
| CMS-01 | Chỉnh sửa, lưu nháp/xuất bản thử trong bộ nhớ | Không phải CMS vận hành |
| CASE-01–03 | Sáu hàng đợi, tìm kiếm/lọc, mã liên kết/nguồn/phụ trách, đổi trạng thái, trùng số mẫu, xuất CSV | Không lưu hồ sơ thật |
| ACL-01 | Chuyển vai trò để minh họa giao diện và nút thao tác | Không có đăng nhập hoặc phân quyền bảo mật |
| LANG-01 | 5 ngôn ngữ, chuyển giữ trang và query, HTML dịch sẵn | Bản dịch cần người duyệt trước sử dụng chính thức |
| NEWS-01 | Tin/cẩm nang và hoạt động mẫu | Chưa có quy trình biên tập thực |
| CONTACT-01 | Hotline, Zalo, Facebook theo bảng nguồn | WeChat/Messenger chuyên dụng chưa có tài khoản xác nhận |
| ANALYTICS-01 | Chỉ số và kết quả xử lý mẫu trên quản trị | Chưa cài đo lường traffic/chuyển đổi thực |
| QUALITY-01 | Responsive CSS, reduced-motion, kiểm tra DOM, metadata, hreflang, schema phù hợp | Browser visual QA chưa xác minh do preview relay lỗi |
| DATA-01 | Không thu thập hay upload; dữ liệu quản trị giả độc lập | Chưa có validation máy chủ, lưu trữ riêng, retention |
| AI-01, CRM-01 | Ngoài bản prototype | Chưa làm AI hoặc đồng bộ CRM |
| DELIVERY-01 | Mã nguồn, file ZIP, README, dữ liệu mẫu và tài liệu đối chiếu | Chưa xác lập thỏa thuận hỗ trợ sản xuất |

## Quy trình đội agent

GPT-6 Astra: lập kế hoạch và phản biện độc lập. GPT-6.1 Terra: việc làm, dịch vụ/tuyển sinh, biểu mẫu/quản trị, đa ngôn ngữ, dịch nội dung. Agent chính tích hợp, bổ sung metadata, kiểm thử, đóng gói và xuất bản riêng tư. Reviewer yêu cầu sửa validation, bộ lọc tin đóng, phân nhóm nội bộ, landmark quản trị, traceability và i18n trước khi chấp nhận.
