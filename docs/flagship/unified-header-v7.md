# Prototype 7 — đồng bộ header, hover và đối tác

## Yêu cầu và kết quả

- Cân lại khoảng cách nhóm menu, đưa chevron gần nhãn hơn. Giữ 7 nhóm và 19 mục con, đúng hai cấp, năm ngôn ngữ.
- Bỏ trạng thái màu theo loại trang. Tất cả header dùng cùng kiểu trong suốt ở đầu trang và kính sáng sau khi cuộn. PageHero, trang quản trị và phần chờ tải có nền phía sau phù hợp; 404 dùng PageHero chung.
- Chuột có khả năng hover mở submenu sau khoảng 100 ms; rời nhóm có 180 ms để đi xuống panel. Chạm, click và bàn phím vẫn dùng được. Escape, chuyển trang, click cùng trang, đổi kích thước và unmount hủy timer; hover không che submenu đang giữ focus.
- Bỏ dải “Khám phá Minh Đức / Nhân lực là tài sản” dưới hero. Các nút tạm dừng rời không còn hiện thường trực; điều khiển có tên truy cập được vẫn hiện khi nhận focus bàn phím. Giữ poster-first, giảm chuyển động và các điều kiện tự phát video.
- Thêm logo Luxshare ICT, Foxconn và Samsung lưu nội bộ. Jeiltech Vina và TACU giữ tên chữ do chưa xác minh được logo đúng. Không thay bằng thương hiệu tương tự. Nguồn và giới hạn được ghi trong [partner-assets.md](partner-assets.md).

## Tối ưu code

`Header.tsx` tách khỏi `App.tsx`; `navigation.ts` là dữ liệu dùng chung cho desktop, drawer, tìm kiếm, footer và điều hướng không JavaScript. Hai tệp mới được định dạng để dễ đọc. `PartnerLogo.tsx` và `partners.ts` dùng chung cho trang chủ, giới thiệu và trang đối tác. Loại bỏ markup/CSS của thanh hero cũ và các selector `inner-header` không còn phù hợp. Không thêm dependency runtime.

Yêu cầu tối ưu code đã được bổ sung vào `AGENTS.md`: rà phần lặp/mã không dùng, dùng chung dữ liệu hợp lý, giữ cấu trúc dễ bảo trì, bảo toàn hành vi và kiểm tra hồi quy. Phạm vi tối ưu gắn với nhiệm vụ, tránh viết lại phần đang hoạt động chỉ để đổi phong cách.

JavaScript chính của build mới khoảng **119.31 KB gzip**, bản trước **118.96 KB**. Đây là số đo dung lượng, không phải điểm Lighthouse hoặc thời gian tải thực tế. Logo dùng SVG/WebP nhỏ, có kích thước cố định và tải lazy; không hotlink hay gọi dịch vụ logo bên ngoài.

## Nghiên cứu, phản biện và kiểm thử

Các agent điều hướng, giao diện, logo và điều khiển chuyển động lập phương án riêng; agent tổng hợp và reviewer đánh giá trước triển khai, rồi phản biện sau khi sửa. Reviewer phát hiện và yêu cầu sửa ba trường hợp: Escape trước khi timer hover mở; click về đúng trang hiện tại không hủy timer; focus còn ở nút cha ngăn chuyển hover sang nhóm khác. Các kiểm tra độc lập được thêm cho những trường hợp này.

Lệnh kiểm tra liên quan: build; `test:flagship`; `test:header`; `test:sitemap`; `test:review`; `test:seo`; `test:hydration`; `test:catalog`. Bộ SEO kiểm tra 200 trang; hydration kiểm tra 15 trường hợp. Kiểm tra header đối chiếu trạng thái chung trên trang chủ, giới thiệu, việc làm, liên hệ, quản trị và 404. Partner test kiểm tra tên truy cập, bản sao ẩn, tạm dừng và đường dẫn tài sản.

Hạ tầng preview chưa có bằng chứng phục hồi sau lỗi relay đã ghi nhận. Không kiểm chứng được bố cục thực tế/độ mượt trên thiết bị và chưa có Lighthouse/CWV. Kiểm tra DOM, CSS và ước lượng độ rộng không thay cho kiểm thử trực quan. Giữ audience riêng tư, noindex và dữ liệu mô phỏng như trước.
