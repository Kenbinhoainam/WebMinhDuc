# Sitemap và MVP v0.2 — baseline Discovery

Ngày 16/11/2026 người dùng yêu cầu giữ “như ban đầu”. Diễn giải sử dụng: giữ bản Discovery v0.1 đã dự thảo trong chat, tiếp tục quy tắc menu hai cấp đã xác nhận; không khôi phục hai tab sitemap đã xóa khỏi Google Sheets. URL và việc mục cha mở trang tổng quan chưa được chốt.

## Menu

```text
Trang chủ
Giới thiệu
  Hồ sơ năng lực
  Quá trình hình thành và phát triển
  Đối tác tiêu biểu
  Thành tựu và dấu ấn
Dịch vụ
  Giới thiệu và cung ứng nhân lực
  Cho thuê lao động
  Headhunt / lao động có tay nghề
  Chương trình tuyển sinh
  Setup cơ cấu tổ chức và phần mềm doanh nghiệp
Việc làm
  Lao động phổ thông
  Lao động có tay nghề
  Tuyển sinh
Tuyển dụng nội bộ
Tin tức
  Thông tin về lao động
  Hoạt động Minh Đức Vina
Liên hệ
```

Giá trị cốt lõi/tầm nhìn/sứ mệnh là nội dung Giới thiệu. Chính thức/thời vụ, nhóm nghề kỹ thuật/nhân sự/kế toán, từ xa/chính quy là phân loại hoặc nội dung trong trang, không thêm menu cấp 3. Tin tức có pháp luật, kiến thức người lao động và lựa chọn doanh nghiệp. Tin tuyển/JD/bài viết/chương trình có trang chi tiết nhưng không bắt buộc là tầng menu mới.

Tuyển sinh: bản đầu nhắc cao đẳng; ảnh sau nhắc cao đẳng/đại học. Với chỉ đạo giữ bản đầu, không tự mở rộng sang chương trình đại học; ghi điểm này chờ xác nhận tại Q05 trong tài liệu câu hỏi.

Khung tư vấn nằm ở trang Liên hệ; liên hệ nhanh WeChat/hotline/Zalo/Messenger là tiện ích đề xuất. Cách hiển thị và tài khoản cần xác nhận. Chính sách dữ liệu, lỗi/404/trạng thái biểu mẫu và quản trị không là mục menu chính. Dự án tiêu biểu chưa tự thành module riêng.

## MVP giữ theo bản đầu

- Website thương hiệu, dịch vụ, việc làm, tuyển nội bộ, tuyển sinh, tin tức và liên hệ.
- Sáu luồng F01–F06 và trường đã xác nhận trong register v0.2; CMS viết riêng chỉ loại ADMIN; tin hết hạn; bộ lọc việc làm; đo lường cơ bản.
- Năm ngôn ngữ; tiếng Việt gốc, thiếu bản dịch dùng tiếng Việt có nhãn; ADMIN duyệt/xuất bản từng bản; định mức nội dung còn mở.
- Responsive/khả năng truy cập là mục tiêu đề xuất. SEO và AEO là nhu cầu bổ sung hiện tại, không thay đổi cấu trúc menu; đầu ra/ngân sách cần duyệt.
- ADMIN ghi phụ trách thủ công; trùng số điện thoại + tin phải gộp trước xuất. Nút xuất thủ công, lịch hằng ngày ADMIN cấu hình, đích Google Sheets 6 tab. Bị chặn thông báo ADMIN, chạy lại thủ công; có nút kiểm tra kết nối. Đây là quyết định bổ sung đã xác nhận; cần rà giá/lịch và chi tiết gộp/đồng bộ.
- CV nội bộ tùy chọn, người gửi không cần tài khoản; định dạng/tệp theo F07. Không có vai trò nhân viên, trưởng bộ phận hay biên tập riêng.

Ngoài phạm vi đợt đầu dự kiến: AI viết/video/xu hướng/tự đăng, chatbot AI, xuất bản mạng xã hội, đồng bộ app/CRM và nghiệp vụ tuyển dụng nâng cao chưa đặc tả. Không coi Box chat là phê duyệt chatbot AI.

## Hai hành trình nghiệm thu đề xuất

1. Người lao động lọc việc trên điện thoại, mở tin, đăng ký; quản trị nhận đúng mã tin, nguồn, người phụ trách; thử tin hết hạn và trùng theo quy tắc được duyệt.
2. Nhà máy xem năng lực/dịch vụ, gửi địa điểm/số lượng/ca/ngày cần người; quản trị thấy đúng nhóm B2B, quyền xem/xuất đúng.

Demo dùng dữ liệu minh họa. Mỗi case phải có kết quả màn hình và kết quả tiếp nhận phía quản trị. Chỉ triển khai sau duyệt spec và quyền code riêng.

## Bàn giao 19/11/2026

Giữ nguyên cây menu và sitemap; cập nhật hành vi từ phiếu đã hoàn tất. Xem [các chi tiết còn mở](open-questions-and-decisions.md) và [handoff](../../SPRINT-HANDOFF.md). Google Sheets là đích xuất riêng, không đồng nghĩa phê duyệt kết nối CRM/ERP. Chưa triển khai hoặc nghiệm thu các hành trình.
