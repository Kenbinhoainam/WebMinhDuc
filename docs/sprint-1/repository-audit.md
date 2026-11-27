# Nhận diện repository — Sprint 1

Ngày kiểm tra lại: 16/11/2026 (Asia/Bangkok). Trạng thái trước khi ghi gói tài liệu này.

| Hạng mục | Quan sát trực tiếp |
| --- | --- |
| Root | `/workspace/WebMinhDuc` |
| Remote origin | `https://github.com/Kenbinhoainam/WebMinhDuc.git` |
| Branch | `work` |
| HEAD | Chưa có commit; Git báo `No commits yet on work` |
| Working tree | Chỉ có `.git`; chưa có file tracked, tài liệu hoặc source |
| README / AGENTS / cấu hình / dependencies | Chưa có trước lần ghi này |
| Runtime môi trường | Node 24.22.1, npm 11.9.0, Git 2.52.0 |
| OpenSpec | Không tìm thấy trên PATH |
| Stack dự án | Chưa chọn; runtime môi trường không quyết định stack |

Người dùng chọn repo này và xác nhận bắt đầu từ rỗng ngày 14/11/2026. Độ chắc chắn cao về checkout Cloud và remote hiện tại. Không có code để audit kiến trúc, bảo mật, hành vi hoặc test; không báo audit source hoàn tất.

## Phân biệt các nguồn

| Nguồn | Bằng chứng và giới hạn |
| --- | --- |
| WebMinhDuc, ID 1457592681 | Baseline được người dùng chọn. GitHub đọc ngày 14/11 trả size 0, default_branch main, branches rỗng. Chưa đọc lại remote GitHub ngày 16/11. |
| MinhDucWeb, ID 1453475790 | Repo trong bàn giao ban đầu; API kết nối ngày 14/11 trả 404. Không suy ra chắc chắn bị xóa. Không còn là baseline được chọn. |
| MinhDucWeb-Draft | Repo khác; bàn giao ghi main `b271b04cfddf12eee47918b146b060da7fa2004d`. Không kiểm tra lại hoặc nhập source. |
| Local `E:\AppData\Codex\MinhDucWeb` | Bàn giao ghi main `95105f351f9264336ae01ba5daea1eb6cd259d5a`, không remote; hai sửa chưa commit: `public/design-system.css`, `public/flagship-content.js`. Chưa đọc lại trực tiếp tại Cloud. |
| Prototype V20, Vinext/Worker/D1/R2, Sites project cũ | Thuộc nguồn trước, chưa được dùng làm lựa chọn kỹ thuật hoặc cấu hình cho repo mới. |

## Phạm vi thao tác lần này

Chỉ tạo `AGENTS.md` và sáu file Markdown trong `docs/sprint-1/`. Không tạo source, cài gói, chạy build/test, init OpenSpec, commit, push hoặc phát hành. Các file mới chưa được commit/push, nên việc lưu trong workspace chưa đồng nghĩa đã có trên GitHub.
