# Universal Task Contract · MDV2-AI-01

Dùng mục dưới đây trong Issue form hiện có. Khi làm theo Mode C, dùng sub-issue cho mỗi owner. Ví dụ thực tế nằm ở [Issue #10](https://github.com/Kenbinhoainam/WebMinhDuc/issues/10).

| Mục Issue | Nội dung cần có |
|---|---|
| Mục tiêu và authority | Kết quả mong muốn, Requirement/SDD/version/AC, quyết định cho phép và những phần còn DRAFT. |
| Baseline và input | Repo, branch, full base SHA, PR phụ thuộc, permalink mount ở đúng commit và status READ/BLOCKED theo từng nguồn. Ghi SDD không áp dụng với lý do nếu chỉ làm governance. |
| Scope và owner | Mode A/B/C, agent ID, human coordinator, worktree alias, file cụ thể hoặc thư mục được phép, exclusions, integration owner và giới hạn privacy/deploy. |
| AC và test | Kết quả quan sát được, lệnh dự kiến, hồi quy, review/PO gate. Ghi actual cùng bằng chứng khi chạy. |
| Phụ thuộc và bàn giao | PR liên quan, blockers, checkpoint canonical link, full remote SHA, status, next owner/action. Dùng `Refs #N` khi còn acceptance. |

## Checkpoint v1

Copy [mẫu JSON](checkpoint.template.json) vào một file tạm để kiểm tra, thay mọi placeholder với dữ liệu thật. Đăng bản canonical vào Issue/PR hoặc Git. Không ghi DONE trong payload. Trạng thái tác vụ do Issue giữ.

- `issue` và `pr` là URL GitHub. Nếu PR chưa mở được, `pr: null` chỉ dùng ở BLOCKED và ghi lý do. `dependencies` là các link công khai tới Issue/PR/commit có thể chia sẻ.
- `requirements` và `sdd` là danh sách ID/version. Với SDD không áp dụng dùng `["N/A — governance only"]` và lý do thật. `sources` dùng permalink GitHub chứa SHA và kết quả đọc. Kèm lý do hoặc dấu vết đọc trong `note`. Trường hợp restricted dùng bản tóm tắt được phép, hoặc để blocker trong public và giữ payload chi tiết trong private.
- `base_sha` là điểm xuất phát task. `stage_start_sha` là điểm agent hiện tại nhận quyền ghi. `head_sha` là tip đã xác minh trên remote. Chuỗi là base → stage → head, có thể trùng nếu chưa có edit.
- `ownership` ghi integrator, link comment receipt nhận quyền ghi độc lập, alias và file/phạm vi theo từng chặng. File khớp chính xác hoặc dưới prefix có dấu `/` cuối. `changed_files` là mọi path trong `git diff --no-renames --name-only stage_start_sha head_sha`, kể cả xóa và cả hai đầu rename. Xem PR để có diff toàn task. Ghi `[]` nếu không sửa.
- `completed` gồm item + link evidence. `in_progress`, `remaining`, `open_regressions`, `po_decisions` khai báo rõ hoặc để `[]`. `blockers` là code + mô tả cụ thể. Task có bước chưa làm vẫn có thể READY_FOR_HANDOFF nếu receiver đủ dữ liệu và quyền tiếp tục. BLOCKED dùng khi không thể tiếp tục an toàn hoặc thiếu điều kiện bàn giao.
- `tests` kê build/test thực tế, một dòng mỗi lệnh hoặc nhóm xác định được, cùng môi trường, SHA, exit code (null nếu chưa chạy) và link evidence (null nếu chưa có). FAIL vẫn cần bằng chứng và hồi quy mở. Ghi NOT_RUN cho build không cần thiết và lý do.
- `preview` là null nếu không áp dụng. Nếu có, ghi source SHA, checksum, revision, environment, URL và audience đã được phép công khai.
- `agent`, `receiver`, `next_action` giúp người mới biết ai nhả quyền, ai nhận, và lệnh/việc nào đi trước.

```sh
python3 scripts/governance/check-relay.py /tmp/checkpoint.json --remote --expect-stage "$STAGE_FROM_RECEIPT"
```

Đặt `STAGE_FROM_RECEIPT` bằng full SHA lấy từ **comment nhận quyền ghi riêng**, rồi chạy từ checkout đúng repo đã fetch đủ commits. So luôn original base SHA và allowed paths với Issue/receipt. Mặc định kiểm schema, ancestry và phạm vi diff từ Git local. `--remote` gọi GitHub để kiểm HEAD hiện tại, báo lỗi khi stale, không đọc được, checkout sai SHA, worktree không sạch, origin sai hoặc branch hiện tại sai. `--remote` yêu cầu `--expect-stage`. Với lưu trữ lịch sử hoặc checkout detached chỉ đọc, dùng kiểm Git local rồi kiểm remote riêng. Nếu push bị chặn và worktree bẩn, dùng bản ghi BLOCKED với SHA remote cuối đã kiểm và chú thích việc chưa push. Nếu record nằm trong comment, tải nội dung về file tạm để kiểm. Validator không chạy các lệnh mô tả trong payload hoặc tự phê duyệt Issue. PO/reviewer phải mở link, đối chiếu kết quả, xác minh quyền truy cập và rà secret/PII.
