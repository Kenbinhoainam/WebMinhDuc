# Project Charter v0.2 — Website Minh Đức

Cập nhật 19/11/2026. Phiếu khách hoàn tất; đã đồng bộ 22 quyết định và 30 trường. Gói Discovery đã được phép lưu; chưa phê duyệt spec triển khai.

**Trạng thái quản trị ngày 27/11/2026: Sprint 1 Discovery CLOSED, nghiệm thu nội bộ theo chỉ đạo người dùng.** Nội dung baseline v0.2 giữ nguyên; xem [biên bản đóng](sprint-closure.md). Các tiêu chí/điểm mở chưa được duyệt tiếp tục chuyển giai đoạn sau.

| Thành phần | Nội dung |
| --- | --- |
| Mục tiêu | Giới thiệu năng lực, xây dựng thương hiệu, hỗ trợ marketing, nhận yêu cầu cung ứng nhân lực và hồ sơ ứng tuyển |
| Ưu tiên | B2B là chính; B2C hỗ trợ nguồn lao động |
| Người dùng | Nhà máy/đối tác, người lao động, ứng viên nội bộ, người quan tâm tuyển sinh, nhân viên tuyển dụng/kinh doanh/marketing |
| Địa bàn đã nêu | Bắc Giang, Bắc Ninh, Quảng Ninh, Hà Nội, Thái Nguyên; KCN và đầu mối cụ thể chờ xác nhận |
| Ngôn ngữ | Việt, Anh, Trung giản thể, Hàn, Nhật; phạm vi nền đã chốt; tiếng Việt gốc, fallback có nhãn, ADMIN xuất bản bản dịch sau duyệt; định mức/đầu mối còn mở |
| Sản phẩm | Sitemap và MVP như bản Discovery ban đầu; menu hai cấp; CMS chỉ loại ADMIN; gộp trùng trước xuất thủ công/hằng ngày sang Google Sheets 6 tab; SEO/AEO |
| Kỹ thuật | Bắt đầu từ WebMinhDuc rỗng; stack/database/hosting chưa chọn |
| Nguồn lực | Người dùng phụ trách kỹ thuật/duyệt; Minh Đức có marketing vận hành; nhân lực bổ sung chưa chốt |
| Lịch | Khách từng mong muốn 15/12/2026, website và luồng chính trước, AI sau. Cần lập lại lịch theo ngày kickoff, đầu vào và phạm vi được duyệt |
| Thương mại | Phản hồi khách nghiêng gói website 32 triệu; không phải chấp thuận hợp đồng. Giá bao gồm SEO/AEO và nghiệp vụ hồ sơ cần rà lại |
| Đầu ra Sprint 1 | Audit repo, Charter, Requirements, sitemap/MVP, câu hỏi/quyết định, AGENTS, kế hoạch OpenSpec |

## Tiêu chí hoàn thành Discovery đề xuất

- Baseline rõ, không dùng nhầm source cũ.
- Yêu cầu có nguồn và trạng thái; câu hỏi chờ khách có cơ chế xử lý.
- Sitemap/MVP được giữ theo chỉ đạo; phần chưa rõ được ghi minh bạch.
- Hồ sơ v0.2 và SPRINT-HANDOFF.md đã được kiểm tra và đóng Discovery theo chỉ đạo 27/11; không cấp quyền code hoặc nghiệm thu hợp đồng thay khách hàng.

Đây chưa phải quyền triển khai tính năng. Các điểm chặn nghiệp vụ phải được giải quyết hoặc loại khỏi change triển khai trước khi duyệt spec.

## Chỉ số sản phẩm dự kiến

Yêu cầu B2B hợp lệ, đăng ký ứng tuyển thành công, hồ sơ được nhân viên tiếp nhận/xử lý, khả năng marketing tự cập nhật nội dung. SEO/AEO theo dõi khả năng truy cập nội dung, tìm kiếm và nguồn chuyển đổi. Chưa có KPI số lượng, thứ hạng hoặc tỷ lệ chuyển đổi được chốt.

Nguồn: N0–N6 trong [Requirements Register](requirements-register.md). Người duyệt nội bộ: người dùng. Đại diện khách có quyền duyệt cuối: chờ chỉ định.

## Thay đổi so với v0.1

- Chỉ một loại tài khoản ADMIN, số tài khoản chưa chốt.
- CV nội bộ tùy chọn; tệp tối đa 3 tệp/lượt, 5 MB/tệp, tổng 15 MB.
- ADMIN gộp dữ liệu theo số điện thoại + tin, chưa gộp thì chặn xuất; lịch hằng ngày ghi vào Sheets theo biểu mẫu. Bị chặn báo ADMIN để chạy thủ công, kiểm tra kết nối độc lập kiểm tra trùng.
- Tích hợp Sheets đã là nhu cầu xác nhận; cần rà công/giá/lịch, không tự kết luận đã gồm trong gói 32 triệu.
