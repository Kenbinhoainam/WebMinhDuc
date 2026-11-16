# Flagship — nghiên cứu, quyết định và kiểm chứng

## Phạm vi và trình tự

Đã liệt kê media đang dùng trước khi sửa: 1 video và 15 ảnh; xem `media-before.csv`. `media-current.csv` chứa link tối ưu cùng các phiên bản kích thước sau nâng cấp. Tệp gốc vẫn tồn tại để các liên kết đã bàn giao không hỏng. Cờ ngôn ngữ là SVG inline, không tải từ dịch vụ ngoài.

Sáu nhiệm vụ được lập kế hoạch riêng: điều hướng, ngôn ngữ, giao diện/đối tác, animation, media, tải bản dịch. Agent tổng hợp và phản biện độc lập đánh giá trước triển khai, yêu cầu sửa rồi kiểm tra lại. Workers dùng GPT-6.1 Terra; reviewer dùng GPT-6 Astra.

## Nghiên cứu

[Trang HR2B hiện tại](https://www.hr2b.com/) được đọc qua web research để đối chiếu nội dung và cấu trúc. Kiểm tra trực quan không thực hiện được: công cụ browser trả `Browser Use could not read requirements`. Truy xuất HTML trực tiếp bằng HTTP trả 403; không dùng kết quả đó làm bằng chứng về chuyển động hiển thị.

Thông số animation được xác minh từ bản HR2B reconstruction người dùng cung cấp: trang chủ có 26 thuộc tính AOS, gồm 16 fade-up, 7 zoom-in-up và ba hiệu ứng hướng/zoom khác. Bản cũ của Minh Đức chỉ gắn reveal vào một số phần; thiếu nhịp vào trang và nhiều khối phía trên.

Phương án mới dùng transform/opacity, reveal một lần, khoảng 700 ms và độ trễ tối đa 240 ms cho nhóm. Tiêu đề hero luôn có thể đọc; không che tiêu đề để chờ JavaScript. Tham khảo [web.dev về animation hiệu quả](https://web.dev/articles/animations-guide) và [MDN Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API).

Menu dùng liên kết thật và nút disclosure riêng, hỗ trợ Tab, Escape, đóng khi rời vùng; không gán ARIA menu cho điều hướng thông thường. Tham khảo [WAI disclosure navigation](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/).

Dải đối tác có nút tạm dừng, dừng khi hover/focus; bản sao chỉ để nối chuyển động được ẩn khỏi công nghệ hỗ trợ. Reduced-motion hiển thị danh sách tĩnh. Tham khảo [WCAG Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html).

Ảnh có WebP/srcset/sizes; video giữ poster trước, chỉ gắn nguồn khi điều kiện cho phép hoặc người dùng chủ động phát. Giảm dữ liệu, màn hình nhỏ, reduced-motion không tự tải video. Tham khảo [video performance](https://web.dev/learn/performance/video-performance) và [responsive images](https://web.dev/articles/serve-responsive-images).

SEO/AEO giữ nội dung HTML sẵn, tiêu đề đúng chủ đề cho bài viết/sự kiện, FAQ đồng nhất dữ liệu hiển thị và JSON-LD, canonical/hreflang của năm ngôn ngữ. Không thêm schema việc làm/review/sự kiện cho dữ liệu giả. Prototype vẫn riêng tư/noindex, chưa nhằm được lập chỉ mục. Tham khảo [Google structured data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies) và [Google AI search guidance](https://developers.google.com/search/blog/2025/05/succeeding-in-ai-search).

## Những quyết định thiết kế

- Desktop từ 1024 px: header hai hàng, 7 nhóm menu hiện trực tiếp. Hàng tiện ích độc lập với hàng menu để bản dịch dài có chỗ.
- Màn hình nhỏ: drawer; tối thiểu 44 px cho điều khiển chính. Ẩn nút liên hệ trên thanh ở <=480 px nhưng vẫn có liên hệ trong menu và nội dung.
- Ngôn ngữ: cờ Việt Nam/Anh/Trung Quốc/Hàn Quốc/Nhật Bản đi kèm tên ngôn ngữ; cờ chỉ là gợi ý trực quan. Chuyển giữ trang, query và anchor.
- Dịch vụ: rail 5 thẻ, điều khiển trước/sau ở mọi cỡ, cuộn và truy cập bàn phím. Không nén cả năm thẻ vào một hàng hẹp.
- Đối tác: chỉ năm tên đã có trong nguồn. Dùng chữ, không dựng logo chính thức hoặc thêm đối tác chưa xác nhận.
- Giao diện dùng nhịp khoảng trắng co giãn, nền trắng/xám xanh và nhấn đỏ; tách rõ hình ảnh, nội dung và thao tác.

## Số liệu build trước/sau

Số liệu là dung lượng tệp, không phải điểm Lighthouse hay thời gian tải thực tế. Chi tiết trong `performance.json`.

| Hạng mục | Trước | Sau |
|---|---:|---:|
| Video nền | 5.760 MB | 1.959 MB |
| Poster desktop | 196 KB | 84 KB |
| Logo hiển thị | 50.4 KB | 2.4 / 5.3 / 7.6 KB theo kích thước |
| 15 ảnh, tổng tệp gốc / tổng bản tối ưu lớn nhất | 4.095 MB | 1.517 MB |
| JavaScript chính, gzip | 208.3 KB | 116.9 KB |
| Bản dịch mỗi ngôn ngữ ngoài Việt, gzip | Đã nằm trong JS chung | Chỉ tải một chunk 38.7–40.9 KB |

Người xem tiếng Việt không tải từ điển. Các ngôn ngữ khác tải một từ điển trước hydration. Bộ kiểm tra parity bảo đảm giữ đầy đủ bản dịch; lỗi tải từ điển giữ nguyên HTML sẵn và đưa lựa chọn tải lại.

## Kiểm tra đã chạy

- `npm run build`: TypeScript, client/SSR, 200 trang + 3 alias đạt.
- `npm run test:catalog`: toàn bộ bản dịch merged/jobs, whitespace, độ mới dữ liệu sinh đạt.
- `npm test`: 22 kiểm tra việc làm/CV/lưu việc đạt.
- `npm run test:sprint`: bộ lọc, biểu mẫu, quản trị mẫu và tuyển sinh đạt.
- `npm run test:review`: 35 route/trạng thái qua năm ngôn ngữ, kiểm tra lỗi biểu mẫu và điều hướng đạt.
- `npm run test:seo`: 200/200 trang; kiểm tra thêm đường dẫn ảnh tối ưu và srcset đạt.
- `npm run test:hydration`: 15/15 trường hợp đạt.
- `npm run test:flagship`: menu, cờ/ngôn ngữ, đối tác, observer, 7 tình huống media và kiểm tra độc lập đạt.

Vùng đối tác dừng khi hover/focus vào dải tên; nút điều khiển nằm ngoài vùng này để lệnh Phát có hiệu lực ngay cả khi nút vẫn được focus.

Phản biện đã buộc sửa: menu và chọn ngôn ngữ cùng mở; video tự phát lại sau thao tác phát–dừng nhanh; header chật ở 361–430 px; menu không đóng khi Tab ra ngoài; trạng thái inner-header thiếu tương phản; thứ tự CSS khiến hamburger còn hiện desktop và offset bị ghi đè. Bộ kiểm tra CSS build được bổ sung cho lỗi thứ tự cascade.

## Giới hạn kiểm chứng

Browser hiện không khởi tạo được. Chưa xác nhận bằng ảnh chụp thực tế các viewport 320/390/768/1024/1440/1920, Safari/iOS/Android, video và độ mượt trên thiết bị; chưa có Lighthouse/CWV. CSS breakpoint và DOM đã kiểm tra nhưng không thay thế thử trực quan. Không tuyên bố “hoàn hảo trên mọi thiết bị” hoặc điểm tốc độ chưa đo.

Bản dịch, ảnh tham chiếu và nội dung demo vẫn cần duyệt trước sản xuất. Không có backend, đăng nhập/ACL thực hoặc tiếp nhận dữ liệu thật.
