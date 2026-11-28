# Agent onboarding — tối đa 5 bước

1. Fetch repository, kiểm tra owner/visibility/nhánh/remote HEAD và worktree; đọc [AGENTS](../../AGENTS.md), [GitHub audit](../../GITHUB-AUDIT.md), [deployment audit](../../DEPLOYMENT-AUDIT.md).
2. Mở Issue; đọc [Master Requirements DRAFT](../requirements/master-requirements.md), register, SDD đã được duyệt đúng phạm vi và acceptance. Ghi Requirement/SDD/AC IDs; pending approval không phải approved.
3. Tạo nhánh/worktree riêng theo [CONTRIBUTING](../../CONTRIBUTING.md); thống nhất file ownership. Tài liệu private cần đích được PO duyệt.
4. Sửa trong scope, kiểm diff/privacy, chạy test đúng source SHA; commit toàn bộ thay đổi có chủ đích, push, xác minh remote SHA.
5. Mở/cập nhật Draft PR và Issue: SHA, test/log, preview mapping, blocker, người xử lý tiếp. Chỉ PO quyết định merge/release; không tự đánh Done.

Đọc source ở `src/`, tests ở `tests/`; không sửa generated root HTML thay cho source. Sprint 2 tiếp tục [PR #3](https://github.com/Kenbinhoainam/WebMinhDuc/pull/3) và [Issue #7](https://github.com/Kenbinhoainam/WebMinhDuc/issues/7).

Nếu tiếp quản từ Codex, bắt đầu bằng [Codex → Antigravity Handoff](../handover/CODEX-TO-ANTIGRAVITY.md) để biết exact baseline, quyền hạn và backlog còn mở.
