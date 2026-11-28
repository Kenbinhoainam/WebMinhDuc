# Agent Registry và hướng dẫn cho Project Owner

GitHub ghi agent ID thực tế và human coordinator trong Issue. Dùng các ID dưới đây hoặc thêm ID mới khi giao việc. Agent ID là nhãn điều phối. GitHub Assignee vẫn là người có tài khoản và trách nhiệm phù hợp.

| Agent ID | Điểm vào | Capability cần xác nhận mỗi lần |
|---|---|---|
| `codex` / `codex-cloud` | [AGENTS.md](../../../AGENTS.md) tại repo root | Đúng checkout, git/terminal hoặc GitHub connector, quyền push/PR, test runner. |
| `claude-code` | [CLAUDE.md](../../../CLAUDE.md) từ repo root | Quyền đọc AGENTS, shell và GitHub. |
| `gemini-cli` | [GEMINI.md](../../../GEMINI.md) từ repo root | Kiểm context path nếu CLI đã được cấu hình riêng. Quyền git/test. |
| `antigravity` | Root AGENTS.md / GEMINI.md, mở root checkout làm workspace | Kiểm rules được nạp và GitHub access. Root files đã phù hợp cấu trúc chính thức; không cần thêm bản sao workspace rule. [Google Antigravity Rules](https://antigravity.google/docs/rules/). |
| `opencode` | Root AGENTS.md, [OPENCODE.md](../../../OPENCODE.md) là hướng dẫn bổ sung | Kiểm AGENTS trong context và quyền tool. [OpenCode Rules](https://opencode.ai/docs/rules/). |
| `other/<name>` | Đưa link AGENTS và protocol vào yêu cầu khởi động | Xác minh từng capability. Ghi BLOCKED_PROVIDER nếu thiếu runtime. |

## Giao việc trong ba bước

1. Mở hoặc chọn Issue, điền scope, AC, baseline, người điều phối và mode theo [Task Contract](TASK-CONTRACT.md).
2. Mở đúng checkout trong AI cần dùng. Gửi mẫu dưới đây cùng Issue URL và checkpoint URL (nếu tiếp quản). Cho agent mới quyền truy cập tối thiểu vào repo và runtime cần thiết.
3. Mở PR, kiểm tip SHA, evidence và checkpoint. Khi đổi AI, chuyển đúng các link GitHub ở Issue. Ghi review/PO approval theo AC trước khi chuyển Done.

> Hãy mở Issue <URL> và checkpoint <URL nếu có>. Đọc AGENTS.md và MDV2-AI-01 tại nhánh/SHA được Issue ghi. Báo lại repo, HEAD, source đã đọc, quyền sở hữu file và hành động đầu tiên. Nếu HEAD lệch, dừng sửa và cập nhật đánh giá baseline. Làm theo đúng scope. Cuối chặng, push và xác minh SHA, cập nhật PR/Issue và checkpoint.

Nếu cùng một máy có nhiều agent, mở checkout/worktree riêng theo receipt trên Issue. Để agent thứ hai tự mở link nguồn và ghi lại những gì đọc được. Không dán log hoặc dữ liệu riêng tư vào prompt/Issue public. [Pilot](PILOT.md) có cách tự chạy tiếp khi runtime của provider đã sẵn sàng.
