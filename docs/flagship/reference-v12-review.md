# Minh Đức v12 — khắc phục đối chiếu HR2B và tối ưu code

## Căn cứ và phạm vi

Thực hiện các đề xuất từ báo cáo đối chiếu v11 với gói HTML HR2B người dùng cung cấp ngày 16/11/2026. Gói có HTML/CSS và tài nguyên, không có JavaScript; mô tả hành vi được đối chiếu thêm với JavaScript nguồn trực tiếp đã lưu trước đó. Không gọi đây là bản sao đã xác nhận giống từng pixel.

Giữ logo/nội dung/menu Minh Đức, 7 nhóm và 19 mục con, 5 ngôn ngữ, quyền xem và noindex. Nội dung đội ngũ, phí, cảm nhận, sự kiện và tuyển dụng là minh họa. Không sao chép dữ kiện HR2B thành tuyên bố về Minh Đức.

## Các điểm đã sửa

| Khu vực | Thay đổi |
| --- | --- |
| Giới thiệu | Ba giá trị chiếm một hàng đầy đủ; hồ sơ đội ngũ mở modal có quản lý focus; tài liệu trình bày thành các bản mẫu có nhãn rõ ràng. |
| Dịch vụ | Bổ sung ảnh–nội dung về cách phối hợp/an toàn; bảng phí mẫu có cấu trúc bảng; FAQ → khách hàng/cảm nhận → dịch vụ liên quan → biểu mẫu. Rails dùng bộ điều khiển chung. |
| Tuyển dụng nội bộ | Hai hàng ảnh–nội dung xen kẽ, carousel môi trường/quyền lợi, quy trình, đồng hành người mới, cảm nhận và gallery mở lớn. Mỗi rail có ba mục duy nhất; chỉ di chuyển khi thực sự tràn khung. |
| Thành tựu trang chủ | Desktop nền sáng/số đỏ, hover hoặc focus hiện ảnh/chữ trắng; mobile giữ ảnh hiển thị. |
| Giải pháp trang chủ | Chuyển động icon/ảnh/nội dung trên desktop; mobile vẫn đọc được mô tả, ẩn icon/nút phụ, liên kết tiêu đề vẫn truy cập được. |
| Đối tác | Khung trung tính, mật độ 2,5 / 4 / 7,5 mục; vòng lặp không hụt ô; dừng khi ngoài màn hình hoặc tab ẩn, fallback tĩnh không cắt mất tên. |
| Hero | Cỡ chữ mobile 32px và breakpoint XL 1200px; sửa chuyển slide cuối về đầu, giữ một tiêu đề và CTA đang hoạt động. |
| Video, sự kiện | Lưới video một cột dưới 768px; watermark Roboto cục bộ theo thang kích thước nguồn; thêm đường chuyển nền cong của khu vực sự kiện. |
| Tin tức | Tin nổi bật nền nhạt và danh sách nền trắng thành hai vùng; không để vùng nổi bật rỗng ở trang hai; bổ sung ngày minh họa trên thẻ trang chủ. |
| Điều hướng mobile | Panel chiếm đủ chiều rộng dưới 768px; giữ hover desktop, bàn phím và năm ngôn ngữ. |
| Tư vấn | Trang riêng `/consultation`, chọn ngày/giờ → thông tin liên hệ → xác nhận mẫu; kiểm tra ngày theo giờ địa phương và kiểm tra lại trước khi hoàn tất. |

## Chuyển động và tối ưu

- `RevealFrame` quan sát khung ngoài không biến đổi; phần con thực hiện trượt 100px hoặc zoom 0,6, thời gian 1 giây và stagger 300/500/700/900ms. Một số thẻ không bọc giữ biên độ nhỏ để không phá lưới. Nội dung hiện khi vào vùng đọc, ẩn khi cuộn ngược về mép dưới; focus, reduced-motion và observer lỗi đều giữ nội dung truy cập được.
- `useHomeCarousel` và `advanceHomeRail` dùng chung cho trang chủ, dịch vụ và tuyển dụng nội bộ. Selector tương tác được truyền vào thay vì tạo thêm bộ timer riêng; dừng khi hover, focus, kéo, ngoài viewport, tab ẩn hoặc giảm chuyển động.
- Dữ liệu việc làm và bộ lưu việc được tách thành module dùng chung; header không còn kéo theo giao diện tuyển dụng. Bốn route việc làm dùng lazy import, vẫn dùng một bộ lưu trạng thái duy nhất. CSS riêng của route được đưa vào head HTML từ manifest Vite để nội dung dựng sẵn có kiểu dáng trước hydration.
- Tách thành phần tuyển dụng nội bộ và đặt lịch; bỏ quy tắc CSS cũ mâu thuẫn tại các khu vực đã thay. Không thêm thư viện animation.
- `hero-assets.json` là nguồn chung cho video/poster ở hero, modal, prerender, tạo media và kiểm kê; tránh URL hardcode lệch giữa các nơi.
- Giữ một preload poster ưu tiên cao trong head; ảnh trang trí không còn bị preload; ảnh nội dung dùng lazy/srcset hiện có. Roboto được phục vụ cục bộ.

Video mới 1920×1080, 10,2 giây, không âm thanh, faststart: **3.163.686 byte**. Cao hơn bản v11 2.391.743 byte khoảng **32,3%**, đổi lại giữ chi tiết tốt hơn; thấp hơn video nguồn 5.759.805 byte khoảng **45,1%**. Không coi tăng độ nét là bằng chứng tải nhanh hơn. Mobile, tiết kiệm dữ liệu và reduced-motion vẫn ưu tiên poster, không tự tải video.

## Kiểm chứng và giới hạn

Nguồn cuối đã build thành công. Các kiểm tra logic việc làm (22 trường hợp), Sprint 1, biểu mẫu đặt lịch, quản trị và tuyển sinh; phản biện luồng/bản dịch; sitemap; catalog; header/hover; carousel trang chủ/dịch vụ/tuyển dụng; đối tác; motion hai chiều; media; hero; và CSS sau build đều đạt. Kiểm tra cấu trúc độc lập đạt trên 85 trạng thái route/ngôn ngữ.

SEO đạt trên 205 trang, favicon có trong 208 HTML gồm alias, hydration đạt trên 21 trạng thái gồm cả đặt lịch ở 5 ngôn ngữ. Kiểm tra 40 trạng thái route/ngôn ngữ xác nhận CSS riêng có trong head trước hydration. Kiểm kê 96 đường dẫn tài nguyên trên 208 HTML không có tệp thiếu.

JavaScript ban đầu: **363,25 kB / 114,18 kB gzip**, so với v11 **385,39 / 120,15 kB** (giảm khoảng 5,7% / 5,0%). CSS chung: **116,24 kB / 22,63 kB gzip**; CSS tuyển dụng riêng 3,35 kB / 1,07 kB gzip. Đây là số đo bundle, không phải thời gian tải hay Core Web Vitals.

Google Sheet đã cập nhật v12: 29 tài nguyên logic, 58 tệp được dùng, 102 nhóm vị trí/công dụng; đọc lại và đối chiếu 1.671 ô. Kiểm tra DOM/CSS/SSR không thay cho đối chiếu hình ảnh thực tế.

Managed preview vẫn gặp lỗi relay readiness timeout trên cổng 4173 sau khi môi trường thực thi kết nối lại. Không dùng đường browser/server khác để vượt hạ tầng này. Chưa có kết quả kiểm tra trực quan trên thiết bị thật hoặc Lighthouse/Core Web Vitals; không tuyên bố đạt mọi màn hình hoặc giống nguồn hoàn toàn.

Các khác biệt có chủ đích còn lại: tên và số lượng nội dung Minh Đức, hình minh họa, nội dung tăng chiều cao khi cần đọc, hỗ trợ bàn phím/giảm chuyển động, đặt lịch và các biểu mẫu chỉ mô phỏng. Bản sản xuất cần nội dung thật và tích hợp nghiệp vụ riêng.
