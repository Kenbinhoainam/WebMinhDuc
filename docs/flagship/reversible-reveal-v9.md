# Prototype 9 — bố cục theo video, chuyển động hai chiều và menu

## Yêu cầu và bằng chứng

Người dùng chỉ rõ trong video HR2B: khi kéo lên, nội dung bên dưới biến mất, rồi yêu cầu sửa prototype theo hành vi đó. Xem lại đoạn khoảng 8–9 giây cho thấy đỉnh ảnh tròn của phần About mờ đi trong khi mép hero và dải nền trắng vẫn còn ở vị trí gần như cố định. Nhận định trước đó đã bỏ sót hiệu ứng ẩn lại này.

Bản v8 chỉ reveal một lần: khi khối hiện, controller ngừng theo dõi nó. Bản này chuyển các khối `data-reveal` sang hiện/ẩn lặp lại theo vị trí trong màn hình. Trong lúc triển khai, người dùng bổ sung yêu cầu giao diện/bố cục giống video hơn, sửa video mờ và tải chậm, bỏ mũi tên menu và cân lại vị trí. Những phần dưới ghi nhận toàn bộ phạm vi cuối; nội dung Minh Đức, hai hành trình CTA, năm ngôn ngữ và sitemap hai cấp được giữ.

## Kế hoạch đã phản biện

- Giữ theo dõi khối sau lần xuất hiện đầu tiên. Khối vào vùng đọc thì hiện; khi cuộn ngược lên làm khối trượt về mép dưới, khối mờ đi và sẵn sàng xuất hiện lần tiếp theo.
- Cả ngưỡng hiện và ngưỡng ẩn đều ở trong viewport. Phương án chờ khối đi hoàn toàn ra ngoài màn hình mới ẩn đã bị loại vì người xem không thấy hiệu ứng fade-out.
- Ngưỡng ẩn ở khoảng 96% chiều cao viewport; ngưỡng hiện ở khoảng 84% trên màn hình thông thường. Hai ngưỡng cách nhau ít nhất 48 px, lớn hơn khoảng dịch của animation, để tránh trạng thái hiện/ẩn đổi liên tục gần ranh giới. Dùng pixel tính từ chiều cao viewport để hành vi không phụ thuộc chiều rộng thiết bị.
- Lúc ẩn dùng opacity/transform trong 380 ms, bỏ độ trễ stagger; lúc hiện giữ nhịp 680 ms (ảnh 820 ms) và stagger 75/150/225 ms. Khối ẩn không nhận click chuột nhưng vẫn có thể nhận focus để hiện ngay.
- Không ẩn khối khi nó đi qua mép trên màn hình hoặc trượt ngang trong carousel. Nội dung đang hiển thị lúc tải trang không bị che để phát lại animation.
- Focus giữ khối và các khối cha hiển thị. Chế độ giảm chuyển động, trình duyệt thiếu observer hoặc lỗi khởi tạo vẫn hiển thị nội dung. Không dùng `aria-hidden` hay `inert` để loại nội dung khỏi bàn phím hoặc công cụ hỗ trợ.
- Observer và trạng thái được quản lý tập trung, có xử lý resize, nội dung lazy/dynamic, thay route và cleanup. Không thêm thư viện hay vòng lặp theo từng frame cuộn.

## Hero, bố cục và video

- Hero desktop theo tỷ lệ gần 2:1 của video tham chiếu, tự tăng chiều cao khi nội dung dài. Cỡ chữ gọn hơn và nhóm nội dung đặt giữa theo chiều dọc; mobile dùng chiều cao theo viewport và cho phép nội dung xuống dòng.
- Trong cùng vùng chữ, thông điệp thương hiệu luân phiên với ba dịch vụ hiện có. Một H1 duy nhất chứa tiêu đề đang hoạt động; các lớp không hoạt động có `aria-hidden`. Tất cả lớp cùng tham gia grid để giữ chiều cao theo bản dịch dài nhất, hai CTA cố định bên dưới. SSR hiển thị ngay thông điệp thương hiệu.
- Mỗi trạng thái giữ 6 giây, chuyển bằng opacity/transform. Rotation chỉ chạy khi video đang phát, hero trong vùng nhìn, tab hiện và thiết bị cho phép. Hover/focus dừng đổi chữ, video nền vẫn phát. Điều khiển chung dừng cả hai; chế độ giảm chuyển động/mobile/tiết kiệm dữ liệu giữ thông điệp đầu. Hai nhãn điều khiển mới được dịch đủ năm ngôn ngữ.
- Phần giới thiệu giữ ảnh tròn không mang logo HR2B, thêm mảng cong sáng nhẹ. Lớp phủ trên video được giảm ở phía phải, giữ nền tối sau chữ và header; không áp dụng blur lên video.
- Video gốc là 1920 × 1080. Đã so sánh bản 1080p CRF24 (4,39 MB), 1080p CRF27 (3,18 MB), VP9 (4,69 MB) và 900p CRF26 (2,39 MB). Chọn bản **1600 × 900**, H.264, 30 fps, 10,2 giây, không âm thanh, **2.391.743 byte**, để cân bằng độ nét và dung lượng. SSIM trên một khung hình căn theo nguồn: 0,9782 so với 0,9706 của bản 720p; không suy rộng thành điểm chất lượng hay tốc độ playback.
- File mới `/optimized/hero-1600-e945407f.mp4` có tên theo hash để tránh dùng lại cache video cũ. MP4 đặt `moov` trước `mdat` để bắt đầu phát trước khi tải toàn bộ. Script tối ưu tái tạo video và in tên file theo hash.
- Bỏ khoảng chờ chủ động **1,5 giây**; chỉ bắt đầu tải khi observer xác nhận hero đang hiển thị và thiết bị đủ điều kiện. Ảnh chờ WebP đã preload vẫn hiển thị ngay, không chờ video.
- Video mới có nhiều pixel hơn nhưng cũng **lớn hơn khoảng 61%** so với bản 720p trước đó (1.489.653 byte). Không khẳng định tải toàn bộ nhanh hơn; thời điểm khởi động tải được cải thiện, còn tốc độ trên mạng thực chưa đo. Bản 720p cũ được lưu để đối chiếu, không còn là video mặc định.

## Menu không mũi tên

- Bỏ chevron và nút rỗng cạnh các nhãn desktop; phân bố bảy nhóm bằng khoảng cách đều. Nhãn cha vẫn là liên kết đến trang tương ứng.
- Hover hoặc focus mở submenu. ArrowDown/Space vào mục con; Escape đóng và trả focus mà không tự mở lại. Trên màn hình cảm ứng rộng, lần chạm đầu mở nhóm, lần tiếp theo đi đến trang cha.
- Drawer mobile dùng dấu cộng/trừ với vùng chạm 44 px. Bộ chọn ngôn ngữ giữ affordance riêng của nó. Sitemap vẫn có 7 nhóm/19 mục con, header dùng chung giữa các trang.

## Kiểm chứng

Build Vite: bundle chính **386,98 kB / 120,39 kB gzip** (v8: 119,46 kB gzip); CSS **93,91 kB / 19,26 kB gzip**. Không thêm dependency runtime.

Sau khi các worker hoàn tất sửa mã, build cuối và các bộ kiểm tra sau đều đạt:

- `npm run build`: TypeScript, client/SSR build và prerender 200 trang.
- `npm run test:flagship`: menu năm ngôn ngữ, selector, đối tác, repeat motion và phản biện độc lập, 10 trường hợp media/rotation, SSR hero năm ngôn ngữ, tương tác tích hợp và CSS đã build.
- `npm run test:header` và `npm run test:sitemap`: cấu trúc hai cấp, hover/focus, Escape, chạm giữa các nhóm, hủy focus chờ, anchor/filter/history và 19 mục con.
- `npm run test:review`, `npm run test:catalog`, `npm run test:seo` (200 trang).
- `npm run test:hydration`: 15 route/trạng thái. Lượt chạy đồng thời đầu có một child process quá thời gian ở `/jobs`; sau khi dọn tiến trình kiểm tra cũ và chạy riêng, toàn bộ 15 trường hợp đạt, không có lỗi React hydration.
- `git diff --check`.

Các lỗi tìm được qua phản biện đã sửa: restore toàn bộ khối nếu observer rebind lỗi giữa chừng; khởi tạo reveal cho nội dung thêm sau resize; giữ intent chạm khi chuyển focus giữa nhóm menu; hủy frame focus khi Escape/đóng menu; khôi phục trạng thái video sau lỗi và bỏ kết quả Promise phát đã lỗi thời. Agent phản biện độc lập không còn phát hiện lỗi chặn xuất bản.

Browser preview trước đó lỗi relay và công cụ browser không đọc được requirements; chưa có bằng chứng hạ tầng phục hồi. Kiểm thử DOM/CSS không thay cho kiểm tra độ mượt, vị trí ngưỡng và cảm nhận trên thiết bị thực. Bản prototype tiếp tục giữ quyền xem riêng tư và `noindex`.
