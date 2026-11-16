# Prototype 5 — menu, kính trong suốt và chuyển động

## Yêu cầu đã chốt

Sitemap trong ảnh người dùng gửi là nguồn cho menu. Menu có đúng hai cấp; các nhánh sâu hơn trở thành nội dung, bộ lọc hoặc phần trong trang. Người dùng đã xác nhận làm trong suốt toàn bộ header và menu phía trên. Giữ năm ngôn ngữ Việt, Anh, Trung giản thể, Hàn, Nhật.

## Quy trình

Các agent lập phương án riêng cho điều hướng, nội dung đích, giao diện kính, chuyển động và bản dịch. Agent tổng hợp cùng reviewer độc lập kiểm tra phương án trước triển khai. Sau triển khai, reviewer yêu cầu sửa lỗi rồi chạy kiểm tra lại. Worker dùng GPT-6.1 Terra; reviewer dùng GPT-6 Astra.

## Điều hướng

| Cấp 1 | Cấp 2 |
|---|---|
| Trang chủ | Trang chủ B2B, không tạo cấp con thừa |
| Giới thiệu | Hồ sơ năng lực; Quá trình hình thành và phát triển; Đối tác tiêu biểu; Thành tựu và dấu ấn |
| Dịch vụ | Giới thiệu và cung ứng nhân lực; Cho thuê lao động; Headhunt - lao động có tay nghề; Chương trình tuyển sinh cho các trường cao đẳng đại học; Setup cơ cấu tổ chức và phần mềm cho doanh nghiệp |
| Việc làm | Lao động phổ thông; Lao động có tay nghề; Tuyển sinh |
| Tuyển dụng nội bộ | Các vị trí đang tuyển; Thông tin vị trí & quyền lợi; Yêu cầu CV; Thông tin liên hệ |
| Tin tức | Thông tin về lao động; Hoạt động của Minh Đức Vina |
| Liên hệ | Tư vấn |

Tổng cộng 7 nhóm chính, 19 mục con. Desktop, drawer mobile, tìm kiếm và bản dự phòng khi tắt JavaScript dùng chung dữ liệu. Mục cha có liên kết riêng và nút mở mục con riêng. Trang con làm nổi bật nhóm tương ứng; `aria-current` vẫn chỉ đánh dấu trang hiện tại.

Hai nhánh việc làm dùng bộ lọc tay nghề có sẵn và cuộn đến kết quả. Tin tức dùng query `category=workers`, hỗ trợ liên kết trực tiếp, phân trang và Back/Forward. Các anchor về lịch sử, dấu ấn, CV, tuyển dụng và tư vấn đều có nội dung đích. Giai đoạn phát triển và dấu ấn minh họa được ghi rõ; không thêm giải thưởng hoặc số liệu chưa xác minh. Kênh hỗ trợ giữ hotline, Zalo và Facebook đã có nguồn; chưa dựng tài khoản WeChat.

## Giao diện và chuyển động

Header, dropdown, chọn ngôn ngữ và drawer dùng nền xanh hải quân có alpha, viền sáng mảnh và chữ trắng. Alpha chỉ tác động nền, không làm mờ chữ. Header vẫn xuyên thấu sau khi cuộn và ở trang trong. Blur chỉ áp dụng trên bề mặt header/panel. Có nền đặc dự phòng khi không hỗ trợ blur hoặc người dùng giảm độ trong suốt, cùng hỗ trợ forced-colors.

Menu con và selector mở trong 200 ms; các khối nội dung vào trong khoảng 680 ms, nhóm phần tử lệch nhau 75/150/225 ms. Hero giữ tiêu đề hiện ngay từ đầu; trang trong chỉ chuyển vị nhẹ. Bổ sung nhịp cho thế mạnh, chỉ số, quy trình, câu chuyện, hoạt động, FAQ và CTA. Hover không còn ghi đè transform của reveal. Không thêm thư viện animation hoặc vòng lặp trang trí liên tục.

Reveal mặc định hiển thị trước khi JavaScript nâng cấp. Nội dung đang được focus hiện ngay và không biến mất khi focus rời đi. Observer lỗi hoặc người dùng bật giảm chuyển động vẫn giữ nội dung truy cập được. Đối tác và video giữ nguyên cơ chế dừng/giảm chuyển động đã có.

Nguồn kỹ thuật được đọc lại: [web.dev — animation hiệu quả](https://web.dev/articles/animations-guide), [MDN — prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion), [WAI — disclosure navigation](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/). Nghiên cứu HR2B và media trước đó được lưu trong [báo cáo flagship](research-and-validation.md).

## Các lỗi được sửa sau phản biện

- Menu dự phòng nằm trong header phủ nội dung: chuyển về luồng trang thông thường.
- Back/Forward trên cùng trang không trả vị trí cuộn: khôi phục theo history entry.
- Hover cũ của thẻ dịch vụ xung đột reveal và reduced-motion: loại bỏ chuyển vị cạnh tranh.
- CSS trạng thái scrolled cũ tạo nền trắng dưới chữ trắng: bỏ các quy tắc lỗi thời.
- Nền hover quá sáng trên kính: giảm alpha để bảo vệ tương phản.
- Mục con mobile thiếu diện tích chạm: tối thiểu 44 px; selector gọn ở màn hình rất hẹp.
- Tên dịch vụ tuyển sinh mới không khớp giá trị select cũ: chuẩn hóa alias, giữ giá trị dữ liệu ổn định và nhãn mới.

## Kiểm chứng và giới hạn

Build cuối tạo 200 trang HTML theo 5 ngôn ngữ và 3 alias. JavaScript chính gzip khoảng **118.7 KB**, so với **116.9 KB** ở bản 4; không thêm dependency runtime. Đây là dung lượng build, không phải điểm Lighthouse hoặc thời gian tải đo trên mạng thực.

Các bộ kiểm tra: TypeScript/build; jobs/CV; Sprint 1; đánh giá luồng đa ngôn ngữ; parity catalog; SEO; hydration; flagship; sitemap destinations và independent sitemap review. Lệnh đầy đủ ở README. Các kiểm tra CSS là kiểm tra nguồn/cascade và phép tính màu, không thay cho ảnh chụp browser.

Preview được thử lại sau khi sinh bản dịch; mã ứng dụng vượt bước khởi động nhưng relay báo `timed out waiting for relay readiness` trên cổng 4173. Vì vậy chưa kiểm chứng trực quan giao diện kính, độ mượt, responsive trên thiết bị hoặc Lighthouse/CWV. Không tạo browser/server thay thế để vượt hạ tầng. Bản prototype giữ quyền xem riêng tư và noindex; chưa có backend nhận dữ liệu thật.
