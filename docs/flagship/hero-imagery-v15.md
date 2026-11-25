# Hero, header và hình ảnh — v15

Ngày 25/11/2026. Phạm vi theo yêu cầu: sửa khung hero, header trong suốt, màn kết giữa video, khôi phục hồ sơ và bốn thẻ năng lực v13, nâng chất lượng hình ảnh.

## Phương án đã áp dụng

- Khung hero chiếm đủ chiều ngang; phim được căn giữa bằng `object-fit: contain`, giữ đủ cảnh và thời lượng. Desktop cao tối thiểu một viewport; mobile giữ tỷ lệ 16:9 khi phát. Tỷ lệ màn hình khác tỷ lệ phim có phần nền ảnh xung quanh, không kéo giãn phim.
- Bỏ khoảng đệm 80 px trên hero. Header trong suốt phủ lên phim; logo gốc có quầng sáng nhẹ cục bộ, nhãn menu có bóng để đọc được; khi cuộn dùng kính sáng.
- Sau sự kiện `ended`, một nền kiến trúc xanh/vàng phủ lên vùng media và thẻ sáng tối đa 700 px đặt ở giữa. Thẻ chứa logo, “Nhân lực là tài sản”, mô tả nhà máy/FDI miền Bắc và hai CTA: “Gửi nhu cầu nhân lực” / “Tìm việc làm”. Không còn thanh CTA nằm dưới video.
- Thẻ kết thúc dùng chiều cao nội dung ở mobile, dành khoảng trống cho header và điều khiển. Các CTA ẩn khỏi tương tác trước khi kết thúc; no-JS hiện thẻ có liên kết. Replay là thao tác thủ công, điều khiển không bị thay node mất focus.
- Menu Hồ sơ năng lực mở thẳng `/e-brochure`; trình xem ba trang giống nguyên bản v13. Ba mục Giới thiệu còn lại giữ anchor; `#profile` vẫn truy cập được. Bốn thẻ 1200+, 80+, 15+, 95% và rail/chuyển động v13 được khôi phục. Các số này là nội dung mẫu đã được cho phép.
- Dùng ảnh kính xanh/vàng, người đi làm, bắt tay, hội thảo và trao đổi công việc, không dùng hình mới có logo HR2B. Ảnh văn phòng lặp được bỏ. Hai ảnh mới là WebP 960 px, tổng khoảng 100 KB; các ảnh có sẵn dùng biến thể tối ưu. Video và logo không tạo lại bằng AI.

## Phản biện và sửa lại

Agent độc lập rà hero, header, hồ sơ và phần thân trang. Vòng phản biện đã loại mảng trắng phủ toàn màn hình, sửa lớp video che ảnh kết thúc, bỏ CSS kích thước thẻ còn sót từ v14, mở phần tràn của quầng logo và thu gọn bộ chọn ngôn ngữ ở 320 px. Build phát hiện ba media query thiếu khoảng trắng quanh `and`; đã sửa đúng cú pháp và dựng lại.

## Kiểm tra

- Build TypeScript, Vite client/SSR và prerender thành công, không còn cảnh báo cú pháp CSS nêu trên.
- 18 nhóm kiểm tra đạt: header-reference, header-hover-review, navigation, about-anchors, sitemap-review, sitemap-destinations, home-b2b, home-reference-motion, home-carousel, hero-review, media, reference-structure, info-v13, flagship-review, seo-output, preload-output, hydration, careers-carousel.
- Hero: 15 tình huống vòng đời video; nội dung/đường dẫn CTA và SSR năm ngôn ngữ. Hydration: 25 trạng thái/trang. SEO: 205 trang. Cấu trúc tham chiếu: 12 loại trang × năm ngôn ngữ.
- Kiểm tra asset trên 208 HTML: 173 đường dẫn, không có tệp thiếu. Kiểm kê v15 có 59 tài nguyên logic, 110 phiên bản tệp, 147 nhóm vị trí, 266 dòng sử dụng theo trang.
- `BrochurePage.tsx` không khác commit v13 `55b1439450474947b2d5e2d7e0408d0919dcb669`. Video đầy đủ và alpha logo giữ nguyên bản v14 đã kiểm tra.
- Managed preview thất bại với `relay could not open browser port 4173: timed out waiting for relay readiness`. Không dùng đường trình duyệt khác để vượt lỗi hạ tầng. Chưa xác minh trực quan các viewport, zoom 200%, tương phản từng khung phim hoặc chỉ số Lighthouse/CWV.
- Danh mục media v15 lưu trong JSON/CSV tại thư mục này. Đồng bộ Google Sheet bị duyệt tự động từ chối do chưa xác nhận rõ đích ghi và payload liên kết nguồn; Sheet bên ngoài chưa được cập nhật trong lượt này.

Site chính tiếp tục giữ quyền xem riêng tư và noindex. Bản v13 đối chiếu được tạo ở Site riêng theo yêu cầu tiếp theo, không thay thế bản chính.
