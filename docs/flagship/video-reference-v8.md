# Prototype 8 — giao diện và chuyển động theo video tham chiếu

## Phạm vi đã xác nhận

Người dùng cung cấp video `Home - HR2B - Google Chrome 2026-11-16 11-23-19.mp4` và chọn áp dụng cả phong cách giao diện lẫn animation, giữ nội dung Minh Đức. Video dài khoảng 12,17 giây; đây là tài liệu tham chiếu, không phải video được nhúng vào prototype.

Các agent phân tích riêng bố cục, chuyển động, ngôn ngữ/tải trang và phản biện. Sau khi tổng hợp, thay đổi tập trung vào hero, phần giới thiệu và chuyển động ảnh. Giữ nguyên thông điệp, hai hành trình doanh nghiệp/người lao động, năm ngôn ngữ, sitemap hai cấp và header dùng chung. Không thêm lại dải phụ dưới hero hay nút dừng hiển thị thường trực.

## Điều quan sát được và quyết định thiết kế

- Video cho thấy nền hero chuyển cảnh, ba tiêu đề dịch vụ luân phiên, header trong suốt và phần giới thiệu trắng, thoáng. Chuyển động mở rộng vùng hero ở đoạn sau phù hợp với thao tác cuộn lên đầu trang; không dùng nó làm bằng chứng cho hiệu ứng parallax.
- Mẫu HTML HR2B lưu trong workspace có video nền và Swiper riêng cho tiêu đề. Những cảnh dựng, thu/phóng montage và logo nằm trong video; không quy tất cả thành animation CSS. Khi rà lại theo chỉ dẫn của người dùng sau bản v8, phát hiện phần About mờ đi khi kéo lên; xem bản sửa [reveal hai chiều v9](reversible-reveal-v9.md). Nhận định ban đầu đã bỏ sót chi tiết này.
- Hero Minh Đức giữ H1 và hai CTA ổn định, dùng bố cục rộng với khoảng thở và chiều cao có thể tăng theo nội dung. Không cần thêm carousel chữ hoặc thư viện animation.
- Ảnh chờ được hiển thị ngay; video chỉ phủ lên bằng chuyển tiếp opacity khi nhận sự kiện `playing`. Khi chờ dữ liệu, lỗi hoặc tạm dừng, ảnh chờ lại hiện. URL ảnh trùng với preload có sẵn, tránh thêm yêu cầu ảnh khác.
- Phần giới thiệu dùng bố cục biên tập hai cột, ảnh tròn và cung đỏ nhẹ. Dùng ảnh bắt tay `GPNS-1.jpg` hiện có thay cho ảnh laptop mang logo HR2B; nội dung và ghi chú minh họa giữ nguyên.
- Reveal ảnh được tinh chỉnh thành chuyển động 820 ms, dịch 16 px và scale 0,985. Các nội dung khác giữ nhịp stagger ngắn; H1 có mặt và đọc được ngay. Chế độ giảm chuyển động vẫn được tôn trọng.

## Media và hiệu năng

- Hero được dựng lại từ đoạn 0–10,9 giây của nguồn, bỏ montage/logo HR2B. Bắt đầu tại 0,7 giây; 0,7 giây cuối hòa vào đoạn mở đầu để nối vòng. Không sửa video gốc.
- Video dùng H.264, 1280 × 720, 30 fps, không âm thanh; dài 10,2 giây. Dung lượng giảm từ **1.959.454** xuống **1.489.653 byte** (khoảng 24%). Công thức dựng nằm trong `scripts/optimize-media.mjs`.
- Đã kiểm tra các khung hình chọn lọc và cặp khung hình đầu/cuối. Đây không phải phép đo độ mượt trong browser.
- Build Vite báo bundle JS chính **383,28 kB / 119,46 kB gzip** (v7: 119,31 kB gzip); CSS chính **93,32 kB / 19,13 kB gzip**. Không thêm dependency; phần tải video giảm nhiều hơn phần JS tăng. Đây là dung lượng build, không phải điểm Lighthouse hay thời gian tải đo trên mạng thật.
- Ảnh chờ tiếp tục dùng bản WebP **83.996 byte** đã preload. Ảnh giới thiệu tận dụng WebP/srcset hiện có, khai báo kích thước và tải lazy; không thêm tài nguyên bên thứ ba hay dependency.
- Giữ video tải có điều kiện, dừng ngoài vùng nhìn/tab ẩn và tôn trọng lựa chọn dừng. Mobile, reduced-motion và chế độ tiết kiệm dữ liệu không tự tải video.
- SEO/AEO giữ HTML prerender, H1/nội dung/schema, canonical/hreflang, năm ngôn ngữ và `noindex` của prototype riêng tư.

## Phản biện và kiểm thử

Phản biện yêu cầu bỏ chiều cao hero cố định để nội dung dài có thể làm khối tăng chiều cao, giữ nguyên các text node phục vụ bản dịch và đồng bộ trạng thái điều khiển khi video lỗi.

Sau khi tất cả agent hoàn tất sửa mã, các kiểm tra cuối đều đạt:

- `npm run build`: TypeScript, client/SSR build và prerender 200 trang.
- `npm run test:flagship`: navigation, selector ngôn ngữ, đối tác, progressive reveal, tám trường hợp media và phản biện độc lập.
- `npm run test:header`: header dùng chung, menu hai cấp, hover, Escape, focus và hủy timer.
- `npm run test:review`: luồng/trạng thái và bản dịch năm ngôn ngữ.
- `npm run test:seo`: 200 trang; `npm run test:hydration`: 15 route/trạng thái.
- `npm run test:catalog` và `git diff --check`.

Agent phản biện độc lập không tìm thấy lỗi chặn xuất bản. Video trong `public/` và `dist/` có cùng hash; các trạng thái lỗi/chờ/dừng và listener/observer cleanup đã được kiểm tra.

Hạ tầng preview trước đó lỗi relay; công cụ browser không đọc được requirements. Trạng thái preview hiện dừng, chưa có bằng chứng hạ tầng đã phục hồi. Không dựng browser/server khác để vượt đường preview được hỗ trợ. Kiểm tra DOM/CSS và khung hình media không thay thế kiểm thử trực quan responsive, độ tương phản, video playback hoặc Lighthouse/CWV.
