# v14 — kết quả triển khai và kiểm tra

Ngày 25/11/2026. Quyết định người dùng mới nhất là nguồn ưu tiên khi khác bản v1.2: giữ phong cách HR2B, hướng nhà máy/FDI miền Bắc, CTA chính Gửi nhu cầu nhân lực; video đầy đủ phát một lượt rồi hiện màn kết, không loop.

## Kết quả

- Menu 7 nhóm/14 mục con, hover desktop, drawer/keyboard/touch; Giới thiệu có bốn neo trên một trang.
- Header/footer và màn kết dùng logo tách nền trực tiếp từ pixel JPG gốc theo lựa chọn của người dùng. Không sử dụng logo AI đã thử. Giữ bản JPG gốc cho ảnh chia sẻ, favicon dùng biểu tượng gốc nền trong suốt.
- Hero giữ đủ 3.964 khung/132,13 giây và âm thanh của video Minh Đức; 1024×576 là độ phân giải nguồn. MP4 ưu tiên 19.754.706 byte, WebM dự phòng 22.292.313 byte, poster WebP 34.628 byte. Chi tiết đối chiếu trong minhduc-media-v14.md.
- Video tự phát bằng lời gọi có kiểm soát khi nằm trong viewport; tiết kiệm dữ liệu, 2G hoặc giảm chuyển động dùng poster/màn thương hiệu và nút phát. Native ended mở màn kết, giữ focus âm thanh; phát lại do người dùng chọn. Hai CTA luôn sẵn bên dưới video, mobile khung16:9 contain.
- Trang chủ B2B có nhóm nhu cầu, năm giải pháp, năm bước trao đổi, một dải đối tác, ba văn phòng và F01. Không dùng thành tích số liệu hoặc lời chứng thực cá nhân bịa làm bằng chứng.
- F01–F06 theo ma trận trường bắt buộc mới. F03 không CV; F04/F06 tệp tùy chọn, ba tệp tối đa5MB/tệp và15MB tổng, MB thập phân. Biên nhận đi vào ADMIN trong bộ nhớ phiên; không truyền dữ liệu/tệp ra ngoài, không browser storage.
- Thông tin doanh nghiệp tập trung trong company.ts từ INDEX. Năm ngôn ngữ, noindex và audience riêng tư được giữ nguyên.

## Bằng chứng kiểm tra

Build TypeScript + Vite client/SSR + prerender đạt; SEO205 trang, preload poster duy nhất và stylesheet trang lười nạp đạt. Hydration25 trạng thái đạt. Header/hover và catalog parity đạt. Reference, flagship integration và reviewer40 trạng thái đa ngôn ngữ đạt. Các kiểm tra riêng sáu biểu mẫu, hash/About, Home B2B, thông tin doanh nghiệp và15 ca lifecycle video đạt.

Kiểm kê:208 HTML,170 đường dẫn tài nguyên, không có tệp thiếu;56 tài nguyên logic,107 phiên bản đang dùng,143 nhóm vị trí,262 dòng vị trí theo trang. Google Sheet v14 được đọc lại và đối chiếu3.831 ô, không sai lệch (bao gồm đuôi dữ liệu v13 đã xóa).

## Giới hạn

Managed preview lỗi relay port4173 timeout; status đã dừng. Chưa có kiểm chứng ảnh chụp trình duyệt, Safari/iOS/Android thực, Lighthouse/CWV hoặc thời gian khởi phát video trên4G. Không cam kết poster<0,5s hoặc phát ngay khi tải5% chỉ dựa trên faststart. Đây là demo frontend, không phải nghiệm thu backend/production AC; tin đóng bị chặn theo trạng thái, chưa có mô hình thời điểm hết hạn.
