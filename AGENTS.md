## PO directive — enforced work contract

**EVERY INTENTIONAL CODE OR DOCUMENT CHANGE MUST BE COMMITTED AND PUSHED TO AN AUTHORIZED GITHUB REPOSITORY.**

Applies equally to Codex, Gemini, Claude, OpenCode and every other agent, including migrations, QA reports, release manifests, ADRs and instructions. Fetch and verify HEAD → read Issue/spec → isolated branch/worktree → scoped change → diff/privacy/tests → commit → push → read back remote SHA → create/update PR → update Issue with evidence. Logical commits are sufficient; keystroke commits are not required. GitHub API commits/ref updates are acceptable when a shell is unavailable, provided parent SHA, remote ref and complete diff are verified.

If pushing is impossible: **BLOCKED_GITHUB_PUSH**. If content lacks an approved private destination: **BLOCKED_PRIVACY**. Never put restricted data into public Issues, logs or diffs. A pushed Draft PR is reviewable work, not PO acceptance or permission to merge/deploy.

Current deployment hazard: read [DEPLOYMENT-AUDIT.md](DEPLOYMENT-AUDIT.md) before any build publication. Never run `pages:prepare` then push to prototype as a routine documentation step. Current branch combines old source and newer compiled output.

---

## Agent Relay — dùng cho mọi provider

Đọc [MDV2-AI-01](docs/ai/multi-agent-protocol.md) và [Task Contract](docs/ai/relay/TASK-CONTRACT.md). Mở đúng Issue, checkpoint, tài liệu requirement/SDD theo phiên bản, rồi xác minh full remote HEAD và quyền sở hữu worktree/file. Giữ một checkpoint hiện hành trên Issue/PR và ghi next action. READY_FOR_HANDOFF không thay cho trạng thái nghiệm thu.

Chính sách vận hành và quyền phê duyệt ở [MDV2-GOV-01](docs/governance/github-operations-policy.md). Đọc [nguồn có thẩm quyền](docs/governance/source-of-truth.md), [Docs Hub](docs/README.md) và [onboarding theo provider](docs/ai/relay/provider-onboarding.md). Các chỉ dẫn kỹ thuật lịch sử dưới đây chỉ áp dụng trong scope được duyệt và khi phù hợp quyết định mới nhất.

---

# Minh Đức Vina — cách làm việc trong dự án

Các quy ước dưới đây ghi nhận yêu cầu của người dùng cho những nhiệm vụ tiếp theo. Chỉ dẫn mới của người dùng được ưu tiên khi có thay đổi.

## Quy trình

- Đọc yêu cầu, ảnh tham chiếu và trạng thái mã hiện tại trước khi sửa.
- Với các mảng độc lập, giao từng mảng cho một agent nghiên cứu và đề xuất kế hoạch. Chọn model phù hợp với công việc.
- Agent tổng hợp phản biện các phương án, làm rõ phạm vi và chia quyền sở hữu tệp trước khi triển khai.
- Sau triển khai, có agent đánh giá độc lập và kiểm thử tương ứng với thay đổi. Sửa các lỗi tìm được rồi kiểm tra lại; không dừng ở bản chưa đáp ứng yêu cầu.
- Bàn giao kết quả cụ thể, nêu rõ phần đã kiểm chứng và giới hạn thực tế. Không xin xác nhận lại cho công việc đã được người dùng cho phép.

## Tiêu chí chất lượng

- Hướng đến prototype flagship: thiết kế nhất quán, nội dung có thứ bậc, thao tác dễ hiểu, responsive từ màn hình hẹp đến màn hình lớn.
- Mỗi thay đổi cần xem xét UI/UX, khả năng tiếp cận, SEO/AEO và tải trang theo phạm vi liên quan; tránh mở rộng công việc không cần thiết.
- Tối ưu code là một phần bắt buộc của từng nhiệm vụ: rà đoạn lặp và mã không dùng, dùng chung dữ liệu/thành phần khi phù hợp, giữ cấu trúc dễ đọc và phạm vi thay đổi có kiểm soát. Không viết lại phần đang hoạt động chỉ để đổi phong cách.
- Khi tối ưu, giữ nguyên hành vi cần thiết, bản dịch và khả năng truy cập; tránh dependency thừa, giảm tài nguyên tải và đo dung lượng khi có thay đổi liên quan. Kiểm tra hồi quy tương ứng trước khi bàn giao.
- Giữ tiếng Việt, Anh, Trung giản thể, Hàn và Nhật. Nhãn mới phải có bản dịch; sinh lại locale sau khi đổi catalog.
- Giữ sitemap Minh Đức đúng hai cấp, 7 nhóm chính và 14 mục con, trừ khi người dùng yêu cầu thay đổi. Menu phải dẫn tới nội dung hoặc bộ lọc hoạt động.
- Theo yêu cầu mới nhất, giữ giao diện/thân trang và animation tham chiếu HR2B nhưng thay logo, nội dung và menu Minh Đức. Desktop hiển thị ngang 7 nhóm, submenu hai cấp mở bằng hover, không có mũi tên cạnh nhãn; mobile dùng drawer. Dùng header trong suốt nhất quán trên các trang, đổi sang nền kính sáng/chữ tối khi cuộn để dễ đọc. Giữ bàn phím, chạm, focus, Escape và năm ngôn ngữ có quốc kỳ.
- Yêu cầu mới nhất: chỉ giữ các khác biệt về menu Minh Đức 7 nhóm/14 mục con ngang và hover, 5 ngôn ngữ có cờ, dịch vụ/bộ lọc việc làm/tuyển sinh/thông tin doanh nghiệp Minh Đức, logo/favicon và dữ liệu mẫu. Các bố cục, typography, khoảng cách và hiệu ứng khác phải đối chiếu và chuyển theo đúng từng template HR2B; không coi các khối tùy biến cũ là ngoại lệ mặc định.
- Khi được yêu cầu giống mẫu, đối chiếu cấu trúc HTML, CSS, tài nguyên và hành vi gốc theo từng loại trang. Không chỉ thay màu, thêm class hoặc giữ các khối tùy biến không có trong mẫu. Ghi rõ các khác biệt cần thiết do nội dung/brand, tính năng hoặc dữ liệu minh họa.
- Animation cần giữ nội dung đọc được, không chặn LCP, không chiếm điều khiển cuộn, tôn trọng reduced-motion và bàn phím. Tránh thêm dependency nặng cho hiệu ứng nhỏ.
- Reveal nội dung cần lặp hai chiều theo vị trí viewport như video tham chiếu: hiện khi đi vào vùng đọc, ẩn khi cuộn ngược về mép dưới. Bảo vệ nội dung đang tương tác/focus và chế độ giảm chuyển động; không để nhấp nháy ở ngưỡng.
- Không tuyên bố đã đạt mọi thiết bị, Lighthouse/CWV hay độ mượt thực tế khi chưa đo. Kiểm tra DOM/CSS không thay cho kiểm tra trực quan.
- Prototype có dữ liệu minh họa, giữ noindex và quyền xem hiện tại. Không biến dữ liệu mẫu thành tuyên bố thật về đối tác, giải thưởng hoặc hồ sơ đã được gửi.

## Thực thi

- Đọc README và tài liệu `docs/flagship/` để hiểu các quyết định, test và giới hạn hạ tầng hiện tại.
- Giữ thứ tự import CSS nền trước các lớp thành phần. Khi thay header, loại bỏ quy tắc cũ mâu thuẫn thay vì chồng thêm nhiều lớp override.
- Chạy build và kiểm tra phù hợp sau khi các agent hoàn tất sửa mã; không build đồng thời với thay đổi nguồn rồi coi đó là bản cuối.
- Dùng workflow Sites chính thức cho source và xuất bản, giữ audience hiện có. Nếu preview lỗi hạ tầng, báo giới hạn; không dựng đường browser/server khác để vượt hạ tầng.

## Quyết định v14 — 25/11/2026

- Giữ phong cách HR2B, trang chủ tập trung nhà máy/FDI miền Bắc; CTA chính Gửi nhu cầu nhân lực.
- Menu v1.2 gồm 7 nhóm/14 mục con; bốn mục Giới thiệu cùng dẫn đến một trang dài theo neo.
- Video giới thiệu Minh Đức giữ toàn bộ nội dung/âm thanh/thời lượng; MP4 H.264 faststart và WebM, poster WebP, mobile giữ khung 16:9 không cắt cảnh.
- Quyết định mới nhất thay loop: phát hết video rồi hiện màn kết thương hiệu, chỉ phát lại theo thao tác người dùng. Không dùng bộ đếm thời gian giả sự kiện kết thúc.
- Sáu biểu mẫu theo v1.2, biên nhận demo trong bộ nhớ phiên; không tuyên bố đã gửi dữ liệu thật. Nội dung marketing mẫu không cần nhãn lặp lại.

## Quyết định v15 — 25/11/2026

- Header trong suốt phủ lên hero, bỏ khoảng đệm 80 px ở trang chủ; vẫn chuyển sang nền kính sáng khi cuộn.
- Video giữ nguyên nội dung và tỷ lệ. Khung rộng căn giữa, mobile phát 16:9; phần dư của màn hình rộng dùng ảnh nền có chủ đích, không kéo méo hoặc cắt cảnh.
- Khi kết thúc, logo gốc đã tách nền theo điểm ảnh, slogan và đúng hai CTA xuất hiện cùng nhau trong thẻ kính ở giữa vùng hero, trên ảnh nền kiến trúc xanh/vàng. Không đặt CTA xuống dưới video.
- Người dùng xác nhận khôi phục cả trang hồ sơ và khối trong ảnh 2 như v13: menu Hồ sơ năng lực mở thẳng `/e-brochure`; ba mục Giới thiệu còn lại giữ anchor. `/about-us#profile` vẫn hoạt động.
- Khôi phục bốn thẻ chỉ số và chuyển động v13. Các con số 1200+, 80+, 15+, 95% là nội dung mẫu đã được cho phép; cần xác minh trước sản xuất.
- Dùng ảnh tham chiếu chất lượng cao, phân biệt ảnh minh họa doanh nghiệp với ảnh hoạt động thật Minh Đức; tránh ảnh mang logo HR2B trong nội dung mới.

## Quyết định v16 — 25/11/2026 (thay thế các quy tắc v15 mâu thuẫn)

- Desktop header trong suốt chồng lên phim; mobile dùng hàng riêng 72 px. Màn kết sáng đổi chữ header sang xanh đậm; bỏ quầng sáng logo.
- Hero giữ đúng tỷ lệ 16:9 ở mọi chiều rộng khi phát, nền đặc không lộ ảnh phía sau. Video gốc 132,13 giây tự phát không tiếng khi thiết bị cho phép, không loop.
- Màn kết dùng kiến trúc AI sáng/xanh thương hiệu, không có hộp kính; logo tách nền theo pixel, slogan và hai CTA ở chính giữa hero. Màn kết mobile tăng chiều cao theo nội dung. Khi video kết thúc lúc khuất/tab ẩn, hoãn đổi chiều cao đến khi hero lại hiện.
- Bố cục nội dung v16 theo hành trình doanh nghiệp, giữ 4 thẻ chỉ số và viewer hồ sơ v13. Dùng 6 ảnh thật đã audit, thêm mục Hoạt động trong trang Giới thiệu.
- Giữ reveal hai chiều và tất cả rail tự chạy. Chuyển cảnh nổi bật nhưng stagger tối đa 300 ms, có pause nhìn thấy, bảo vệ focus/reduced-motion/ngoài viewport.
- Sáu form giữ nguyên trường, validation, quy tắc tệp và biên nhận trong bộ nhớ phiên; chỉ cải thiện trình bày/focus. Một launcher hỗ trợ duy nhất.
- Ảnh AI là không gian ý niệm, không phải cơ sở thật của Minh Đức. Nguồn ảnh và audit lưu trong docs/flagship; không tự ghi lên bảng nguồn bên ngoài.

## Quyết định v24 — 26/11/2026

- Hồ sơ năng lực nằm tại `/about-us#profile`. Menu Giới thiệu và nút trên trang chủ dẫn tới mục này. Người đọc có thể xem dịch vụ ngay từ mục hồ sơ. Địa chỉ trình đọc ba trang trước đây chuyển về đúng mục theo ngôn ngữ của liên kết.
