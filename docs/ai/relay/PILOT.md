# Pilot Codex → Antigravity → Claude Code hoặc Gemini CLI

Theo dõi tại [Issue #10](https://github.com/Kenbinhoainam/WebMinhDuc/issues/10). Task base là `983c90e523d61da3a6eadb34d50dd1894dd2d639`, HEAD đã kiểm của Draft PR #9. Thử trên nhánh riêng, không chạm app/Pages.

## Đề bài chạy với provider thật

1. **Codex → Antigravity.** Mở checkpoint hiện hành từ Issue. Trong Antigravity, mở một worktree riêng từ full SHA. Đọc nguồn/Issue/PR, chạy validator với GitHub remote. Ghi receipt gồm runtime/version, SHA, files đã đọc, owner/alias và quyền xác nhận với coordinator. Kiểm diff trước khi chỉnh.
2. **Antigravity → Claude Code hoặc Gemini CLI.** Agent Antigravity chỉ sở hữu `docs/ai/relay/pilot/antigravity.md` cho một receipt đã lọc. Commit, push và verify SHA. Cập nhật PR/Issue với checkpoint và nhả quyền ghi. Không sửa tệp của sender. Nếu HEAD đã dịch chuyển, đánh giá trước khi edit.
3. **Agent thứ ba.** Từ worktree riêng, mở Issue/receipt/checkpoint mới nhất. Xác minh cả hai SHA trước còn trong lịch sử, diff đúng phạm vi, và thử checkpoint cũ phải bị từ chối vì stale. Chạy kiểm tra hợp lệ. Nếu được giao chỉnh record, chỉ dùng `docs/ai/relay/pilot/third-agent.md`; nếu chỉ đọc, ghi receipt trên PR. Giữ Issue mở tới khi PO/reviewer kiểm đủ AC.

PO điều phối quyền ghi và checkpoint giữa các chặng. Cả ba lưu evidence lên GitHub. Nếu runtime hoặc quyền thiếu, ghi BLOCKED_PROVIDER/BLOCKED_PERMISSION. Kết quả kỹ thuật chạy bằng Codex/worktree cần phân biệt với provider thật.
