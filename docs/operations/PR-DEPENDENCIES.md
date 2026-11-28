# MDV2 P0 — PR dependencies và quyết định tích hợp

**Snapshot 28/11/2026 (UTC+7).** Tất cả PR #1, #2, #3, #4, #9, #11, #12 đều OPEN/DRAFT và unmerged theo GitHub tại thời điểm khảo sát. [Source map](SOURCE-AND-DEPLOYMENT-MAP.md) · [Readiness](BASELINE-READINESS.md).

| PR | Đích và HEAD kiểm tra | Vai trò với P0 |
|---|---|---|
| [#1](https://github.com/Kenbinhoainam/WebMinhDuc/pull/1) | `prototype` ← `66191211358f3c3a645637b0c54a930e65f0662a` | Consolidation Sprint 1, lịch sử/nguồn tham chiếu. |
| [#2](https://github.com/Kenbinhoainam/WebMinhDuc/pull/2) | `prototype` ← `c8be7c846f91db278190fc8f8ca0fff6a95da0ec` | Gói customer demo, không cấp phê duyệt Sprint 2. |
| [#3](https://github.com/Kenbinhoainam/WebMinhDuc/pull/3) | `sprint-2/approved-ui-upgrade-sel-20261127-v1@5744b6da70af721bf08d915107960ab61dfb0080` ← `1300df840190ac0ecffa32e576f0c809887e9c64` | Source v10 và evidence lịch sử. So với prototype, merge-base `08e2da4`. Dùng pinned evidence và Issue #7. |
| [#4](https://github.com/Kenbinhoainam/WebMinhDuc/pull/4) | `prototype@08e2da4` theo snapshot PR ← `3ab94d637db78f9f8d5849a48739c5fde42db10f` | Tiền thân MDV2 DRAFT. #9 đã kế thừa public docs/config. PO cần quyết định xử lý PR cũ. |
| [#9](https://github.com/Kenbinhoainam/WebMinhDuc/pull/9) | `prototype@19ac2b3` ← `983c90e523d61da3a6eadb34d50dd1894dd2d639` | Professionalization. Quản trị/CI/CODEOWNERS/forms ở nhánh Draft. |
| [#11](https://github.com/Kenbinhoainam/WebMinhDuc/pull/11) | Nhánh #9 tại `983c90e…` ← `31b94f4f6997433d668c221913b3ba619a317330` | Agent Relay phụ thuộc #9. Report P0 stack riêng từ SHA #11 để dùng governance checks. |
| [#12](https://github.com/Kenbinhoainam/WebMinhDuc/pull/12) | `prototype@19ac2b3` ← `848458ea60900ceebaa8f131550cbf8d2417f1bc` | Source reconciliation và fix 320 px. Nhánh nguồn cho đợt UI, độc lập nhánh report và quyết định release. |

Đếm path thay đổi bằng Git three-dot diff trên base của từng PR. #9 có 73 path, #11 delta có 21, #12 có 131, #3 có 709, #4 có 25. Giao điểm #9/#12 và delta #11/#12 đều **0**. #4/#9 có **24** path chung; #9/#11 có 14 path chung theo quan hệ kế thừa. #12/#3 có **124** path chung vì nguồn được chuyển có chủ đích. Giao điểm path chỉ giúp chọn luồng review; vẫn cần kiểm ancestry, diff, CI và hành vi bản tích hợp ở SHA mới. #12 không có ancestry từ head #3 do chuyển source lên parent Pages hiện tại.

## Đề xuất luồng review

1. **Sản phẩm** — giữ #12 là PR source reconciliation. Nhánh UI mới stack từ `848458ea60900ceebaa8f131550cbf8d2417f1bc` vào nhánh #12 để review đúng delta. Pin SDD/AC và dẫn evidence lịch sử #3. Nếu PO chọn tích hợp #12 sau đó, cập nhật target UI rồi rà lại ancestry, changes, test và Pages. Tránh tích hợp trùng các source đã mang sang từ #3.
2. **Quản trị** — review #9 cùng các phần #4 đã kế thừa. Khi có quyết định tích hợp, xử lý #9 trước hoặc phối hợp stack #11, rồi kiểm lại patch #11 sau mọi squash/rebase/retarget. Gắn required checks sau khi đã chạy ổn định trên đúng target. CODEOWNERS trên nhánh đích có thể tự yêu cầu owner review khi PR sẵn sàng. Muốn bắt buộc owner phê duyệt cần bật branch protection hoặc ruleset phù hợp.
3. **Release** — tạo ứng viên build từ exact SHA đã review, kiểm checksum và preview đúng audience. Tách phê duyệt merge với chỉ định release. Luồng Pages branch-root có thể republish khi merge cả PR docs, nên chọn thời điểm/cách publish trước khi chấp thuận merge vào prototype.

## Các quyết định Project Owner phải ghi trước merge/release

| Quyết định | Điều kiện và người cần xử lý |
|---|---|
| PR nguồn và thứ tự tích hợp | PO/reviewer chọn #12 làm dòng source chính, xác nhận grandfathered evidence #3 theo từng AC, xử lý overlap #4/#9 và stack #11. Cập nhật [#5](https://github.com/Kenbinhoainam/WebMinhDuc/issues/5), [#7](https://github.com/Kenbinhoainam/WebMinhDuc/issues/7), [#8](https://github.com/Kenbinhoainam/WebMinhDuc/issues/8), [#10](https://github.com/Kenbinhoainam/WebMinhDuc/issues/10). |
| CI, quyền và Project | Repo owner kiểm toàn bộ Project theo tên **MinhDucWeb — Master Control** và tên cũ `master`, review quyền tối thiểu và xác nhận protection/ruleset. Thêm required checks dựa trên CI đang chạy. [#6](https://github.com/Kenbinhoainam/WebMinhDuc/issues/6). |
| Acceptance scope | PO/QA triage 617 Incomplete và 116 Blocked, có các quyết định DEC, B625, P41 và thử nghiệm thiết bị thật/AT/người dùng. Chốt AC áp dụng và các hoãn hợp lệ. Chạy lại full evidence trên exact source ứng viên. |
| Preview và release | PO xác nhận preview riêng, audience, release version, build profiles, source→artifact→deploy→URL, Pages migration nếu có, rollback phạm vi artifact. Ghi release checksum và kiểm HTTP/route sau publish được phê duyệt. |
| Private sources | PO xác nhận đích private và quyền truy cập với tài liệu hạn chế, commercial và dữ liệu thật. Trạng thái prototype/demo giữ riêng với nghiệm thu production. |
| Handoff đa provider | PO kiểm runtime/workspace Antigravity và Claude Code hoặc Gemini CLI, chạy pilot theo checkpoint #10. Handoff kỹ thuật GitHub đã hoạt động cho Codex. |

Proxy visibility hoặc quyền ghi branch không thay quyền admin. Các bước trên chỉ mô tả đường review, không phải approval. [Kế hoạch bảo vệ](../governance/protection-plan.md) · [Kế hoạch Pages](pages-migration-plan.md)
