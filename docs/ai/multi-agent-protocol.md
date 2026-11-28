# MDV2-AI-01 — Agent Relay v1.0

Hợp đồng này mở rộng quy trình đa agent hiện có. GitHub là nguồn duy nhất cho trạng thái, yêu cầu, quyết định, code, bằng chứng và lịch sử chuyển giao. PO điều phối với bất kỳ agent nào trong [registry và hướng dẫn khởi động](relay/provider-onboarding.md). Chính sách commit/push và quyền phê duyệt nằm ở [MDV2-GOV-01](../governance/github-operations-policy.md).

## Bắt đầu

1. Mở Issue và PR gắn với task. Đọc [Task Contract](relay/TASK-CONTRACT.md), các quyết định và tài liệu có phiên bản theo thứ tự ưu tiên. Dùng permalink có full SHA cho từng nguồn. Ghi READ khi đã mở và đọc được, BLOCKED khi thiếu access. Nếu nguồn cần thiết bị chặn, dừng phần phụ thuộc và ghi lý do. Tài liệu bên ngoài chỉ là đầu vào nếu có quyền và bằng chứng đọc. Lưu quyết định hoặc bản tóm tắt được phép trong GitHub, giữ nguồn restricted trong private repo được phê duyệt.
2. Fetch, xác minh repository, target PR, branch và full remote HEAD. So với checkpoint mới nhất được Issue/PR trỏ đến. Với stacked PR, phân biệt target base động của PR và base SHA bất biến của task. Xác nhận scope, worktree và quyền ghi với integrator.
3. Nhận quyền ghi bằng một receipt trên Issue/PR ghi agent, branch, HEAD đã đọc, worktree alias và danh sách file. Alias đủ để đối chiếu, không cần công khai đường dẫn máy cá nhân. Kiểm tra receipt mới nhất và những worktree local trước khi edit. Chưa rõ owner, HEAD hoặc scope thì ghi blocker.

## Chọn kiểu chuyển giao

| Mode | Thực hiện |
|---|---|
| A · Task mới | PO giao Issue mới. Agent đọc Task Contract và PR phụ thuộc, tạo nhánh riêng từ base đã xác minh, mở Draft PR. |
| B · Đổi agent cùng task | Sender dừng edit, push checkpoint rồi nhả quyền ghi. Receiver fetch và đối chiếu HEAD, QA, scope, owner. Receiver ghi receipt trước khi sửa. Nếu cần nhánh kế thừa, ghi SHA fork và liên kết PR cũ/mới, xác minh ancestry. |
| C · Song song | Mỗi worker có Issue/sub-issue, nhánh, worktree và tập file riêng. Integrator sở hữu file shared và review qua PR. Review độc lập có quyền đọc; việc chỉnh file shared do đúng owner thực hiện theo thứ tự. |

Điều phối bằng assignment và receipt trong GitHub. GitHub không khóa file atomically. Integrator phân xử xung đột, chia lại phạm vi hoặc tuần tự hóa các phần dùng chung như AGENTS, header, routing, forms và i18n. Mỗi lần đổi owner ghi stage start SHA mới và folder/file được giao. Người gửi không tiếp tục ghi sau khi nhả quyền.

## Contract bàn giao và evidence

Dùng [mẫu checkpoint](relay/checkpoint.template.json) cùng [quy ước trường](relay/TASK-CONTRACT.md). Chỉ dùng READY_FOR_HANDOFF hoặc BLOCKED. Issue giữ bản ghi điều phối và trỏ đến checkpoint hiện hành. PR chứa diff và kiểm thử. Có thể lưu payload JSON trong comment Issue/PR với exact remote SHA hoặc commit tài liệu rồi trỏ từ Issue/PR. Khi commit record sau implementation, phân biệt SHA nội dung đã kiểm với tip mới chứa tài liệu. Muốn tiếp quản tip mới, phát checkpoint trỏ tip đó trong comment để tránh SHA tự tham chiếu. Dùng link bất biến đến file/evidence hoặc run ID. Không lưu mã nguồn ngoài Git trong checkpoint.

Bằng chứng gồm lệnh đã chạy, môi trường, SHA, kết quả PASS/FAIL/BLOCKED/NOT_RUN, exit code và link log đã lọc. Phân biệt phạm vi source, build artifact và deployment. Nếu có preview/deploy, ghi source SHA → artifact checksum → revision/environment → URL và audience. Các kết quả từ SHA cũ cần giải thích tính liên quan và chạy lại nếu đầu vào thay đổi. Reviewer xác minh bằng chứng đọc được, lệnh đúng phạm vi và quyền của người bàn giao. GitHub Project chỉ hiển thị dữ liệu từ các record này.

## Hoàn thành một chặng

1. Đối chiếu diff với AC và file ownership. Kiểm tra secret/PII trong code, log, diff và ảnh. Chạy build/test phù hợp trên đúng SHA và ghi các phần chưa chạy.
2. Commit toàn bộ thay đổi hợp lệ, push và xác minh full remote SHA. Cập nhật PR và Issue, ghi checkpoint, next action và owner. Chạy kiểm tra checkpoint rồi nhả quyền ghi nếu chuyển agent.
3. Receiver kiểm tra lại remote HEAD, các đường dẫn, lịch sử, file ownership và test trước khi ghi nhận bàn giao. READY_FOR_HANDOFF chỉ đánh dấu dữ liệu đủ để chuyển chặng. Done của Issue theo AC, kiểm thử, review độc lập và PO/UAT khi áp dụng.

## Khôi phục

| Điều kiện | Hành động |
|---|---|
| Remote HEAD khác checkpoint | Dừng sửa. Fetch, so diff/ancestry, kiểm lại scope và QA. Nếu chỉ thêm tài liệu, ghi lý do tái sử dụng test. Nếu có thay đổi đầu vào hoặc divergence, phối hợp integrator và cập nhật checkpoint/baseline trước khi chỉnh tiếp. |
| BLOCKED_GITHUB_PUSH | Giữ commit/patch trong workspace được phép, ghi latest verified remote SHA, pending files và lý do. Nếu GitHub vẫn cho comment, ghi blocker và trỏ SHA đã xác minh. Nếu offline hoàn toàn, báo PO và cập nhật GitHub ngay khi khôi phục. Không ghi SHA local là đã push. |
| BLOCKED_PRIVACY | Dùng private repository được cấp quyền. Public Issue chỉ giữ blocker đã lọc, không dán nội dung hay URL restricted nếu URL làm lộ thông tin. |
| BLOCKED_PERMISSION / BLOCKED_PROVIDER | Ghi capability thiếu, next owner và việc tiếp theo. Có thể chuyển agent khác theo Mode B nếu quyền được xác nhận và lịch sử đã an toàn. |
| Hồi quy hoặc test fail | Ghi FAIL và lệnh tái hiện. BLOCKED nếu lỗi ngăn tiếp quản an toàn. Hồi quy không ngăn bàn giao vẫn phải có owner và next action. |

Sprint 1 Discovery đã đóng nội bộ. SEL-2026.11.27-v1.0.0 và MDU-SDD-v1.0.0 áp dụng cho phạm vi prototype được chọn ở [Draft PR #3](https://github.com/Kenbinhoainam/WebMinhDuc/pull/3). Giữ năm locale, bảy nhóm menu, F01–F06 và mock-data boundaries. MDV2-REQ-01 v0.1.0-DRAFT giữ trạng thái ứng viên. Đọc [pilot và kết quả](relay/PILOT.md) trước khi đổi provider lần đầu.
