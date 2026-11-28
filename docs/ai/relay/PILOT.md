# Pilot Codex → Antigravity → Claude Code hoặc Gemini CLI

Theo dõi tại [Issue #10](https://github.com/Kenbinhoainam/WebMinhDuc/issues/10). Task base là `983c90e523d61da3a6eadb34d50dd1894dd2d639`, HEAD đã kiểm của Draft PR #9. Thử trên nhánh riêng, không chạm app/Pages.

## Đề bài chạy với provider thật

1. **Codex → Antigravity.** Đọc Issue, PR và nguồn được checkpoint trỏ đến. Dùng checkout riêng gắn với nhánh như hướng dẫn bên dưới, rồi mở thư mục gốc trong Antigravity. Sau khi validator đạt, ghi receipt gồm runtime/version, SHA, file đã đọc, owner/alias và quyền xác nhận với coordinator. Kiểm diff trước khi chỉnh.
2. **Antigravity → Claude Code hoặc Gemini CLI.** Agent Antigravity chỉ sở hữu `docs/ai/relay/pilot/antigravity.md` cho một receipt đã lọc. Commit, push và verify SHA. Cập nhật PR/Issue với checkpoint và nhả quyền ghi. Không sửa tệp của sender. Nếu HEAD đã dịch chuyển, đánh giá trước khi edit.
3. **Agent thứ ba.** Dùng checkout riêng gắn với nhánh và đọc lại Issue/receipt/checkpoint mới nhất. Xác minh cả hai SHA trước còn trong lịch sử, diff đúng phạm vi, và thử checkpoint cũ phải bị từ chối vì stale. Chạy kiểm tra hợp lệ. Nếu được giao chỉnh record, chỉ dùng `docs/ai/relay/pilot/third-agent.md`; nếu chỉ đọc, ghi receipt trên PR. Giữ Issue mở tới khi PO/reviewer kiểm đủ AC.

PO điều phối quyền ghi và checkpoint giữa các chặng. Cả ba lưu evidence lên GitHub. Nếu runtime hoặc quyền thiếu, ghi BLOCKED_PROVIDER/BLOCKED_PERMISSION. Kết quả kỹ thuật chạy bằng Codex/worktree cần phân biệt với provider thật.

## Mở checkout cho agent tiếp theo

Mở **checkpoint hiện hành** từ Issue #10. Lưu phần JSON của comment vào `/tmp/mdv2-relay-checkpoint.json`, bỏ hai dòng dấu code fence. Mở link `ownership.receipt` trong JSON để lấy full SHA bắt đầu chặng trước. Dùng giá trị từ receipt riêng cho `STAGE_FROM_RECEIPT`.

Ví dụ Bash khi checkpoint vẫn dùng nhánh `chore/10-agent-relay`. Chạy từ thư mục cha trống hoặc chọn tên thư mục mới.

```sh
git clone --single-branch --branch chore/10-agent-relay https://github.com/Kenbinhoainam/WebMinhDuc.git WebMinhDuc-relay
cd WebMinhDuc-relay
git ls-remote --exit-code origin refs/heads/chore/10-agent-relay
git status --short --branch
```

So SHA remote với `head_sha` và xác nhận checkout sạch. Nếu checkpoint trỏ nhánh kế thừa, dùng tên nhánh đó sau khi đối chiếu Issue và PR. Checkout trực tiếp bằng SHA có thể vào detached HEAD. Validator chỉ chấp nhận nhánh đã gắn khi chạy `--remote`.

```sh
# Thay giá trị bằng full SHA đọc từ ownership receipt.
STAGE_FROM_RECEIPT='SHA_DA_DOC_TU_RECEIPT'
python3 scripts/governance/check-relay.py /tmp/mdv2-relay-checkpoint.json --remote --expect-stage "$STAGE_FROM_RECEIPT"
```

Nếu thấy `STALE_CHECKPOINT`, kiểm lại Issue và lịch sử trước khi edit. Nếu checkpoint vẫn `BLOCKED`, ghi cách blocker đã được xử lý và xin xác nhận quyền ghi từ coordinator trước khi sửa file được phân công.

## Kết quả ngày 28/11/2026

**PASS kỹ thuật:** một Codex author và hai phiên kỹ thuật Codex trong ba checkout Git riêng. Receiver và reader lấy Issue/checkpoint từ GitHub, không dùng dữ liệu chat của sender. **BLOCKED_PROVIDER** cho Antigravity và Claude Code/Gemini CLI. Workspace hiện tại có Git/GitHub CLI và không có runtime của ba provider này. Chạy đề bài bên trên để hoàn thành vòng đa provider. **BLOCKED_PERMISSION** cho Project projection vì phiên này chưa xác minh được Project owner access.

| Chặng | SHA và bằng chứng GitHub | Kết quả thực tế |
|---|---|---|
| Codex author | `3288082d7c75475e00c13ff55d22c80f43da86f1`, [checkpoint 1](https://github.com/Kenbinhoainam/WebMinhDuc/issues/10#issuecomment-7235451391) | Push + ls-remote. 11 tests tại SHA này. [CI 46117669040](https://github.com/Kenbinhoainam/WebMinhDuc/actions/runs/46117669040): governance, source build, dependency audit, browser smoke đều pass. Metadata/live audit skip trong PR event. |
| Technical receiver | `56162eee500d6600f7254a4588d81d854b354877`, [checkpoint 2](https://github.com/Kenbinhoainam/WebMinhDuc/issues/10#issuecomment-7235464746) | Fetch từ GitHub, remote + receipt hợp lệ, 11 tests pass. Commit chỉ thêm [receiver.md](pilot/receiver.md), đúng file được giao trong [receipt](https://github.com/Kenbinhoainam/WebMinhDuc/issues/10#issuecomment-7235457847). |
| Third reader | `56162eee500d6600f7254a4588d81d854b354877`, [log đọc lại](https://github.com/Kenbinhoainam/WebMinhDuc/issues/10#issuecomment-7235471600) | Checkpoint 2 exit 0. Task base → stage 1 → stage 2 giữ đúng ancestry. Checkpoint 1 exit 1 (STALE_CHECKPOINT), payload sai ownership exit 1. Diff chỉ đúng receipt. Reader không sửa file khi kiểm tra. |
| Integrator | [Draft PR #11](https://github.com/Kenbinhoainam/WebMinhDuc/pull/11) | Review phát hiện nguy cơ reset stage SHA và dùng nhầm branch trùng SHA. Bản sửa yêu cầu receipt SHA, origin và attached branch. Chạy thêm 3 regression tests cho các điều kiện này. Full tip, CI và checkpoint mới ghi tại PR/Issue. |

Lệnh chính đã thực thi gồm `git clone`, đọc Issue/comment bằng `gh`, `git ls-remote`, `git merge-base --is-ancestor`, `git diff --name-only`, `git diff --check`, `python3 scripts/governance/check-relay.py ... --remote --expect-stage ...` và `python3 -B -m unittest discover -s scripts/governance -p test_relay.py`. Xem lệnh cụ thể và log ở checkpoint/receipt.

Issue #10 vẫn OPEN. Test kỹ thuật xác nhận khả năng chuyển tiếp theo GitHub ở hai lần đổi checkout. Cần thực chạy provider để xác minh cách nạp instructions và quyền vận hành của từng môi trường.
