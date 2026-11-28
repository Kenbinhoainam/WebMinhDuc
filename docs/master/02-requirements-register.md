# Requirements Register — Public Technical Summary

**Sources:** bản phản hồi khách hàng và Sheet làm rõ Sprint 1 (nguồn nội bộ, không sao chép); HR-WEB-01 **draft v0.5**; quyết định PO và các spec demo; repo historical docs. Đây là **bản tóm tắt an toàn cho repo public**, không phải bản sao tài liệu có tính thương mại hoặc dữ liệu khách.

## 1. Main requirements (không dùng AI)

| ID | Requirement | Trạng thái nội dung | Gate |
| --- | --- | --- | --- |
| WEB-01 | Website cao cấp B2B/B2C; 7 nhóm menu, 5 dịch vụ, trang chi tiết, việc làm, tuyển sinh, tin, liên hệ | Business direction confirmed; URL chi tiết cần khóa | Design/content sign-off |
| WEB-02 | Mobile-first, breakpoint tablet/laptop/desktop/wide, điều hướng và trạng thái loading/empty/error/success | Main requirement | Responsive QA |
| JOB-01 | Tìm, lọc theo KCN, chính thức/thời vụ, ca ngày/đêm, chuyên/xoay; điều kiện cùng khớp một phương án tuyển | Business baseline | Scenario QA |
| JOB-02 | Tin đóng/hết hạn không nhận đơn mới; có mã tin ổn định | Business baseline | Time/status QA |
| LANG-01 | 5 ngôn ngữ VI/EN/ZH-Hans/KO/JA; bản tiếng Việt nguồn; dịch từng nội dung có duyệt; fallback minh bạch | Customer-confirmed | Content matrix và reviewer |
| FORM-01 | 6 biểu mẫu F01–F06, validate cả client/server cho production, mã hồ sơ, nguồn/chiến dịch và phân nhóm | Customer-confirmed | Form AC & data architecture |
| ADMIN-01 | Chỉ **một loại vai trò ADMIN**, có thể nhiều tài khoản; quản lý nội dung và hồ sơ | Customer-confirmed | Số tài khoản, bảo vệ truy cập |
| FLOW-01 | ADMIN tiếp nhận và phân công thủ công, lưu người phụ trách/lịch sử; trạng thái riêng theo luồng | Customer-confirmed | Detailed workflow spec |
| DUP-01 | Đối chiếu trùng theo số điện thoại chuẩn hóa + mã tin; ADMIN gộp trước xuất; trùng chưa xử lý chặn xuất | Customer-confirmed behavior | Conflict resolution, audit/undo |
| EXPORT-01 | Xuất tay và theo lịch mỗi ngày tới **Google Sheets vận hành riêng**, 6 tabs tương ứng 6 form, preflight/check lỗi | Customer-confirmed behavior | Account/permissions/idempotency |
| FILE-01 | JPG/JPEG/PNG/PDF/DOC/DOCX, 3 tệp/lần, tối đa 5 MB/tệp, 15 MB tổng; private file storage | Customer-confirmed behavior | Upload threat model/retention |
| CONTENT-01 | CMS, tin tuyển, dịch vụ, media, SEO, nội dung/biên dịch; dashboard và công cụ marketing nâng cao | Catalog MAIN, nhiều mục **chưa bao gồm giá cơ sở** | Per-module impact and PO |
| INTEGRATION-01 | CRM/ATS/ERP, webhook, bidirectional sync, GTM/pixels, landing builder, A/B, báo cáo nâng cao (không AI) | Proposed MAIN catalog, NOT automatic base scope | Separate commercial approval |
| TECH-01 | Đánh giá Next.js, Spring Boot, custom CMS vs Strapi/Payload; Meilisearch/Redis theo tải thực | Proposed architecture, not locked | ADR/benchmark/operation cost |
| SEC-01 | Bảo vệ dữ liệu cá nhân, audit log, backup/restore, validation, role boundaries, chính sách xóa | Main with policy details pending | Technical/legal review |

### 2. Sáu biểu mẫu và trường dữ liệu

| Mã | Mục đích | Bắt buộc | Tùy chọn |
| --- | --- | --- | --- |
| **F01** | Nhu cầu nhân lực B2B | Người liên hệ, điện thoại, địa điểm, ghi chú | Doanh nghiệp, email, vị trí, số lượng, ca, ngày cần |
| **F02** | Liên hệ chung | Họ tên, điện thoại | Email, nội dung |
| **F03** | Ứng tuyển lao động | Họ tên, điện thoại, mã tin | Không tự thêm trường bắt buộc |
| **F04** | Ứng tuyển nội bộ | Họ tên, điện thoại, vị trí | Email, **CV tùy chọn** |
| **F05** | Tư vấn tuyển sinh | Họ tên, điện thoại | Chương trình, có lựa chọn Khác |
| **F06** | Hồ sơ tuyển sinh sơ bộ | Họ tên, điện thoại | Email, chương trình, tệp hồ sơ |

**Cập nhật thay quyết định cũ:** file lịch sử của prototype 3 trong docs/sprint-1 có F04 CV bắt buộc và F06 hồ sơ bắt buộc; phản hồi Sprint 1 mới hơn xác nhận F04/F06 tệp tùy chọn. Không sửa lại lịch sử; khi đặc tả production phải dùng nguồn đã duyệt mới nhất.

### 3. Quy tắc vận hành quan trọng

- **ADMIN** là loại vai trò đăng nhập. Marketing/kinh doanh/nhân sự/tuyển sinh có thể là **bộ phận nghiệp vụ**, không tự tạo role riêng.
- **Hồ sơ trùng** trên tin tuyển: cùng điện thoại đã chuẩn hóa và cùng mã tin; khác mã tin không tự coi trùng. Cần xác định ngoại lệ cho biểu mẫu không gắn tin, giá trị giữ lại, nhật ký gộp, phạm vi chặn xuất.
- **Đích Google Sheets** cho dữ liệu vận hành khác phiếu Discovery Sprint 1. Google Sheets chỉ đích xuất, không thay thế kho dữ liệu chính hoặc chính sách riêng tư.
- **Prototype**: dữ liệu mô phỏng, không có bảo đảm persistence, CRM, email, export, quyền ADMIN thật hay upload thật. Không sử dụng dữ liệu ứng viên thực.

### 4. AI-01…AI-10 — Optional, ngoài MAIN

| IDs | Chức năng mở rộng |
| --- | --- |
| AI-01 / AI-02 | Viết nháp SEO, hỗ trợ dịch và soát nội dung |
| AI-03 / AI-04 | Chatbot tư vấn, tạo nháp JD/tin tuyển |
| AI-05 / AI-06 | Gợi ý công việc, hỗ trợ phát hiện trùng nâng cao |
| AI-07 / AI-08 | Phân tích báo cáo, tạo ảnh/video/nội dung marketing |
| AI-09 / AI-10 | Gợi ý xu hướng/chiến dịch, tự đăng có kiểm soát |

Mỗi module AI phải có phạm vi, nguồn dữ liệu được phép, approval, hạn mức API và chi phí riêng. **Không tự kết luận AI đã mua**, kể cả khi 5 ngôn ngữ hoặc phê duyệt dịch đã nằm trong yêu cầu chính.

### 5. Trace to draft vendor catalog

- **CMS-01…CMS-15**: các nhóm chức năng quản trị không AI, từ Dashboard, Accounts, Content Builder, Services, Jobs, Admissions, News, Localization, Intake, Duplicate, Export, Notifications, Media, SEO/Analytics tới Audit/Operations. Là **catalog đánh giá**, không phải mọi mục đã gồm gói cơ sở.
- **D-01…D-09**: tiêu chí demo prototype.
- **AC-01…AC-27**: nghiệm thu website production dự thảo, phải ràng buộc theo phạm vi thực sự duyệt.
- **HD-01…HD-14**: bộ hạng mục bàn giao dự thảo; hợp đồng cần quy định trách nhiệm và ngoại lệ.

**Decision needed:** danh sách URL/content, nguồn và quyền media, số tài khoản ADMIN, retention, rule gộp, đích xuất, hosting/architecture, những mô-đun nâng cao thuộc hợp đồng.
