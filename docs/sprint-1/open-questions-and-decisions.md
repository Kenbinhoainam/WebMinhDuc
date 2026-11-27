# Quyết định và điểm còn mở v0.2

Cập nhật 19/11/2026. Người dùng xác nhận phiếu làm rõ đã xong. Đã đọc trực tiếp 22 dòng Đã xác nhận, 30 trường Đã xác nhận và 6 dòng tiếp nhận Đã xác nhận.

Nguồn: https://docs.google.com/spreadsheets/d/1ievyqEKeznnwOfA0CBE9JKNN9qIXhiw_hnQK1jh7vTU/edit

Cột “câu trả lời - đã duyệt” hiện ở F, trạng thái ở G. Không dựa vị trí K cũ. Snapshot từng L1–L4/H1–H5/T1–T4/F01–F09 và 30 trường nằm trong [Requirements Register v0.2](requirements-register.md). Nhu cầu được xác nhận không có nghĩa các dòng Còn chốt đã có quyết định.

## Quyết định thay thế

- D01: WebMinhDuc rỗng; không nhập source cũ.
- D02: 5 ngôn ngữ; giao diện quản trị Việt, fallback Việt có nhãn, bản dịch duyệt trước xuất bản.
- D03: giữ sitemap hai cấp/MVP nền; SEO và AEO là nhu cầu xác nhận, tiêu chí cụ thể chưa duyệt.
- D04: một loại ADMIN thay nhiều vai trò; bộ phận/người phụ trách là thông tin nghiệp vụ.
- D05: CV nội bộ tùy chọn thay bắt buộc; 3 tệp/lượt, 5 MB/tệp, 15 MB tổng, định dạng theo F07.
- D06: khóa trùng số điện thoại + tin; ADMIN gộp trước cả hai cách xuất.
- D07: xuất thủ công và hằng ngày; ADMIN đặt giờ; Sheets đích một tab/biểu mẫu. Lượt bị chặn báo ADMIN và chạy lại thủ công, kiểm tra kết nối không bỏ qua trùng.
- D08: ngày 19/11 cho tiếp tục hồ sơ sau phiếu; chưa có quyền code, init/cài, commit/push/deploy hoặc tuyên bố nghiệm thu toàn bộ.

## Điểm còn mở — không tự chuyển thành yêu cầu đã duyệt

| ID | Cần quyết định | Chặn phần nào | Bên cần chốt |
| --- | --- | --- | --- |
| O01 | Số tài khoản ADMIN và tài khoản email nhận báo | Auth/thông báo vận hành | Người dùng + Minh Đức |
| O02 | Chọn bản chính, xử lý giá trị xung đột, truy nguyên và hoàn tác gộp | Gộp dữ liệu | Người dùng + Minh Đức |
| O03 | Phạm vi chặn toàn đợt hay từng biểu mẫu; trùng cho F01/F02/F05/F06 không có mã tin, tin nội bộ | Xuất/gộp | Người dùng + Minh Đức |
| O04 | File Sheets đích, tài khoản/quyền kết nối, múi giờ lịch, phạm vi xuất, ghi thêm/cập nhật, xử lý sửa/xóa sau xuất | Tích hợp/xuất | Người dùng + Minh Đức |
| O05 | Nút thủ công tải Excel/CSV hay ghi Sheets; chỉ xuất lại lần bị chặn hay có bộ lọc | Xuất thủ công | Người dùng + Minh Đức |
| O06 | Loại tham chiếu tệp trên Sheets, thời hạn lưu/xóa hồ sơ và bản sao | Tệp/dữ liệu vận hành | Người dùng + Minh Đức |
| O07 | Danh mục nội dung ban đầu, định mức, người duyệt ngoại ngữ, hạn/vòng sửa | Nội dung/bản dịch | Minh Đức + người dùng |
| O08 | SEO/AEO: nền tảng, URL/câu hỏi mục tiêu, số lượng, ngưỡng/cách đo | Spec nghiệm thu SEO/AEO | Người dùng + Minh Đức |
| O09 | Cao đẳng hay cả đại học, menu cha, module dự án, tin hết hạn giữ/ẩn, chương trình thật | Thiết kế trang liên quan | Người dùng + Minh Đức |
| O10 | Stack/hosting/domain, ngân sách cập nhật, lịch/đầu vào, đại diện nghiệm thu và bảo hành | Kiến trúc/hợp đồng/release | Người dùng + Minh Đức |

Chưa có người nhận trách nhiệm cụ thể hoặc deadline, không tự gán tên hay ngày. Các bên ở bảng là đề xuất người cần ra quyết định.

## Bước tiếp theo

1. Discovery đã nghiệm thu nội bộ/đóng ngày 27/11 theo chỉ đạo người dùng; xem [biên bản đóng](sprint-closure.md). O01–O10 chuyển tiếp, chưa tự được xác nhận. Người dùng điều phối chốt với Minh Đức; hạn cụ thể chưa được cấp.
2. Sprint 2 đề xuất: wireframe và UX flows cho website/ADMIN, bảng nội dung/SEO-AEO, đặc tả riêng gộp/xuất; giải quyết O01–O10 theo phần bị ảnh hưởng.
3. Chuyển AC dự thảo thành spec duyệt với trường hợp thành công/lỗi, quyền, dữ liệu. Đánh giá lại giá và lịch cho tích hợp Sheets; không ngầm đưa ERP vào phạm vi.
4. Chỉ triển khai sau duyệt spec và quyền code/công cụ riêng. Phiếu đã trả lời không thay phê duyệt này.

## Phiếu khách và giới hạn

Không sửa Sheets trong lượt đồng bộ hồ sơ này. Các cột nguồn/đã duyệt được bảo toàn. H1 phần trả lời cũ vẫn nhắc luồng marketing; quyết định mới chỉ ADMIN ưu tiên khi mô tả vai trò hệ thống. “ĐA KÊNH/full quyền” ở tab tiếp nhận được diễn giải theo H4/H5, không tự thêm vai trò/kênh.
