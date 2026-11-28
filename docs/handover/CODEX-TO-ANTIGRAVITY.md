# Codex → Antigravity Handoff

**Ngày bàn giao:** 28/11/2026 (Asia/Bangkok). **Trạng thái:** bản bàn giao kỹ thuật để review; không phải phê duyệt merge, production hay MDV2 v1.0.

## 1. Repository, nhánh và commit phải biết

- Repository public: [Kenbinhoainam/WebMinhDuc](https://github.com/Kenbinhoainam/WebMinhDuc).
- Nhánh công việc: `chore/8-github-control-center`.
- [Draft PR #9](https://github.com/Kenbinhoainam/WebMinhDuc/pull/9), target `prototype`.
- Base đầy đủ của đợt này: `19ac2b365f2264399fde4312639127b8de80736f`.
- Implementation checkpoint sau sửa test harness: `7163e01f3410cdb7896295a2126bb57d998ea365`. Cả push và PR checks đã thành công; xem mục 5.
- Checkpoint đã kiểm 6/6 job trước đó: `901e8e994de26785c1739996fb462c6f5174140e`.

Commit chứa tài liệu bàn giao có thể mới hơn implementation checkpoint trên. **SHA tip cuối được ghi trong PR #9 và Issue #8**; luôn đọc remote để lấy đúng bản gồm cả tài liệu, không đoán từ chat. Một file Git không thể chứa chính SHA commit sinh ra từ nội dung của nó; vì vậy handoff ghi SHA implementation bất biến và trỏ PR/remote cho tip tài liệu.

```sh
git clone https://github.com/Kenbinhoainam/WebMinhDuc.git
cd WebMinhDuc
git fetch origin --tags
git switch --track origin/chore/8-github-control-center
git rev-parse HEAD
git ls-remote origin refs/heads/chore/8-github-control-center
git status --short
```

Nếu đã có checkout, kiểm tra edits/worktree trước khi switch. Không reset hoặc force-push. Hai SHA local/remote phải khớp trước khi báo bàn giao xong.

## 2. Đọc theo thứ tự — không cần lịch sử Codex

1. [AGENTS](../../AGENTS.md), [quy định GitHub](../governance/github-operations-policy.md), [onboarding 5 bước](../00-start-here/README.md).
2. [GITHUB-AUDIT](../../GITHUB-AUDIT.md), [DEPLOYMENT-AUDIT](../../DEPLOYMENT-AUDIT.md), [VERSION-INVENTORY](../../VERSION-INVENTORY.md), [RISKS](../../RISKS-AND-DEPENDENCIES.md).
3. [Master Requirements v0.1 DRAFT](../requirements/master-requirements.md), [Requirements Register](../requirements/requirements-register.md), [Decision Log](../decisions/decision-log.md), [source precedence](../governance/source-of-truth.md).
4. [Docs Hub](../README.md), [traceability](../traceability/traceability-index.md), [acceptance](../acceptance/acceptance-baseline.md), SDD đúng Issue.
5. [Kết quả đợt này](../operations/HANDOFF.md), [CI guide](../operations/ci-and-qa.md), [Project control](../governance/project-control-center.md) và các Issue bên dưới.

## 3. Issues và PR đang có hiệu lực

| Record | Ý nghĩa / hành động tiếp |
|---|---|
| [Issue #8](https://github.com/Kenbinhoainam/WebMinhDuc/issues/8) / PR #9 | Audit và professionalize GitHub; còn review/Project/admin gates, không tự đóng |
| [Issue #5](https://github.com/Kenbinhoainam/WebMinhDuc/issues/5) / [Draft PR #4](https://github.com/Kenbinhoainam/WebMinhDuc/pull/4) | MDV2 predecessor `3ab94d637db78f9f8d5849a48739c5fde42db10f`, base cũ 08e2da4; chưa merge |
| [Issue #6](https://github.com/Kenbinhoainam/WebMinhDuc/issues/6) | Quyền admin, branch protection và private source destination |
| [Issue #7](https://github.com/Kenbinhoainam/WebMinhDuc/issues/7) / [Draft PR #3](https://github.com/Kenbinhoainam/WebMinhDuc/pull/3) | Tiếp tục Sprint 2 đã có, HEAD `1300df840190ac0ecffa32e576f0c809887e9c64`; không tạo lại |
| [Draft PR #2](https://github.com/Kenbinhoainam/WebMinhDuc/pull/2) | Customer demo acceptance proposal |
| [Draft PR #1](https://github.com/Kenbinhoainam/WebMinhDuc/pull/1) | Tổng hợp Sprint 1/SDD lịch sử |

PR #9 kế thừa public docs/config của #4 ở cùng đường dẫn, dựa trên prototype mới. Không merge/đóng #4; PO phải chọn trình tự tích hợp để tránh xung đột tài liệu. Tuyệt đối không khôi phục toàn bộ tree của #4 lên prototype vì sẽ đưa artifact cũ trở lại.

## 4. Đã làm và bằng chứng

| Kết quả | Bằng chứng / phạm vi |
|---|---|
| Kiểm kê 11 branch trước task, 102 unique reachable commits, 4 Draft PR và 3 Issue trước task | [inventory.json](../operations/evidence/2026-11-28/inventory.json); snapshot trước thay đổi, đã hết pagination; không phải toàn bộ dangling Git objects |
| Xác định Pages live chính xác | Pages API + deploy log + HTTP hash, [deployment audit](../../DEPLOYMENT-AUDIT.md) |
| README/Docs Hub, path mapping, 8 Issue forms, PR template, CODEOWNERS | Có trong PR #9; default UI/enforcement cần merge/protection được duyệt |
| Đồng bộ mandatory AI push policy | AGENTS/GEMINI/CLAUDE/OPENCODE; áp dụng cả Antigravity và mọi agent khác |
| Kế thừa MDV2 Requirements/SDD/ADR/acceptance/traceability/sprint/QA indexes | Giữ v0.1 DRAFT, không dùng HR-WEB-01 làm master |
| Cấu hình labels thực tế | [run 46108194418](https://github.com/Kenbinhoainam/WebMinhDuc/actions/runs/46108194418): tạo requirement/task/design/qa/change-request; xác minh 8 type labels; không sửa labels cũ |
| CI chỉ test/audit; label setup tách riêng | [workflows](../../.github/workflows/), [CI guide](../operations/ci-and-qa.md) |
| Release schema, migration/rollback và protection runbooks | [release](../releases/README.md), [Pages plan](../operations/pages-migration-plan.md), [protection](../governance/protection-plan.md); PROPOSED |
| Review độc lập | Phát hiện và sửa metadata logging, HTTP false-pass, artifact path detection, refresh/locale readiness; kết quả cuối bên dưới |

Mọi file có chủ đích phải tồn tại trên GitHub trước khi kết thúc. Danh sách cần đọc/xác minh nằm trong [managed-files.json](../governance/managed-files.json); báo cáo remote readback cuối trong mục 9.

## 5. Kiểm thử thực tế và giới hạn

- [Bootstrap 46106771278](https://github.com/Kenbinhoainam/WebMinhDuc/actions/runs/46106771278) tại `e14adcbfc5887e85be753ef5f18ee8323120e386`: 4/4 jobs.
- [Full checkpoint 46108194398](https://github.com/Kenbinhoainam/WebMinhDuc/actions/runs/46108194398) tại `901e8e9`: 6/6 jobs. Clean install, TypeScript/client/SSR/prerender build và bộ contract tests; npm audit production 0 vulnerabilities. 66 managed files, 8 forms, không lỗi local-link/provider-policy check ở checkpoint này.
- HTTP: HTML live khớp prototype publish; **25 JS/CSS bundles** khớp byte/MIME; canonical/noindex, locale alternate, sampled deep links, sitemap 245 URL và cache-bust đều pass.
- Browser checkpoint đầu: jobs routes, 5 locale × 390/768/1440, Chromium local trên artifact giữ nguyên; không thấy overflow, axe findings hay page errors trong phạm vi đó. Đây không phải browser audit toàn website/live hoặc UAT.
- Các run `46108581135` và `46108584680` tại `53d616b4ddf6500cc5fd77385d4318450591a722` **browser FAILED** vì harness reload khi locale JS chưa tải/hydrate xong. Không che giấu thất bại. Fix `7163e01` chờ network ổn định và xác minh thao tác mở/đóng locale selector trước/sau refresh; vẫn kiểm requestfailed. Hai rerun cuối đều thành công; xem bằng chứng ngay dưới.
- **Rerun xác minh fix:** [push 46108858565](https://github.com/Kenbinhoainam/WebMinhDuc/actions/runs/46108858565) tại full SHA `7163e01f3410cdb7896295a2126bb57d998ea365`: 4 jobs pass, source/dependency skip vì không đổi đầu vào. [PR 46108863352](https://github.com/Kenbinhoainam/WebMinhDuc/actions/runs/46108863352): governance/browser pass, 4 job skip đúng điều kiện; kiểm synthetic merge `8b39daeac033f977b5e40a14d289bee696f652c2` với head trên.
- Mỗi rerun browser: **15/15 cases**, tương tác trước/sau refresh đạt, cả goto/reload HTTP 200, 0 page errors/failed requests/axe diagnostics/overflow trong phạm vi mẫu. [JSON browser](../operations/evidence/2026-11-28/browser-smoke-verified.json), [validation ledger](../operations/evidence/2026-11-28/validation.json). Reviewer độc lập đã đọc code và logs, xác nhận finding được giải quyết; không thay PO approval.
- Node/JSDOM/source/CSS tests không chứng minh bố cục browser. `audit:i18n` chỉ diagnostic. NOT_TESTED: thiết bị thật, manual accessibility/UAT, production backend/CV/security, rollback production, HTTP byte comparison với Sites v10 có kiểm soát truy cập.

## 6. CI/CD và Pages — cảnh báo quan trọng nhất

**Pages Settings:** legacy branch publishing, `prototype:/`, không CNAME, HTTPS. [URL live](https://kenbinhoainam.github.io/WebMinhDuc/).

| Khái niệm | Giá trị |
|---|---|
| Source được commit publish ghi nhận | `66b76036469f07b35bc3cb188dc6b61d40fdda32` (Sprint 2 v10) |
| Artifact branch/revision đang phục vụ | `prototype@19ac2b365f2264399fde4312639127b8de80736f` |
| Deployment/run | repository deployment `8123972756`; Pages ID `19ac2b3…`; run `46103834830` |
| HTML SHA256 live | `420d290219fd875d08778dccb907be210c15bd2d1574b7847cf4ea9f185d42e7` |

**Source trong prototype vẫn là Sprint 1 v30.** Đừng build rồi `pages:prepare`/push vào prototype: có thể ghi đè Sprint 2 đã publish bằng Sprint 1. `gh-pages@cbce772deaa9f73988d76ce7c1c0a89bc7b5c77b` là artifact lịch sử v25, không phải live hiện tại; không có chung ancestor với prototype.

CI mới không deploy. Chỉ metadata job có thêm quyền đọc; label workflow issues:write chạy trên trusted task branch, không PR/fork. Không self-hosted runner hay secrets production. Tuy nhiên **merge docs vào prototype vẫn có thể kích hoạt Pages publish theo cơ chế hiện tại**; yêu cầu “docs-only không deploy” mới là migration PROPOSED, cần PO duyệt. Không tự đổi Pages sang Actions.

## 7. Kiến trúc và quyết định SDD/MDV2

- Public monorepo hiện tại là nguồn quản lý code/publishable docs/tests/config/release. Không chia frontend/backend/docs để trang trí kiến trúc.
- Source `src/`, test `tests/`, script `scripts/`, input static `public/`; root HTML/assets là artifact đã publish. Governance `.github/`, yêu cầu `docs/requirements/`, specs `docs/specifications/`, quyết định `docs/decisions/`, vận hành/evidence `docs/operations/`.
- `docs/flagship`, `docs/sprint-1` giữ vị trí. SDD/QA Sprint 2 trên nhánh riêng được liên kết theo SHA, không copy cả cây/binary. [Old→new mapping](../governance/path-migration-map.md).
- PO rule: **EVERY INTENTIONAL CODE OR DOCUMENT CHANGE MUST BE COMMITTED AND PUSHED TO AN AUTHORIZED GITHUB REPOSITORY.** Fetch/verify → đọc Issue/spec → branch/worktree → edit/test/privacy review → commit/push → verify remote SHA → PR → cập nhật Issue.
- `MDV2-REQ-01 v0.1.0-DRAFT` là candidate master mới, **không phải HR-WEB-01 đổi tên**, chưa phê duyệt production. Giữ trạng thái business/spec/commercial/implementation/QA độc lập.
- `SEL-2026.11.27-v1.0.0`, `MDU-SDD-v1.0.0`, `MDU-PLAN-v1.0.0` có hiệu lực cho eligible prototype Sprint 2, với các conditional/deferred gates gốc. Không tự diễn giải thành toàn bộ production scope.
- Sprint 1 Discovery đóng nội bộ; Sprint 2 chưa nghiệm thu: 524 Completed /617 Incomplete /116 Blocked là báo cáo lịch sử, không phải PO acceptance. Giữ F01–F06, năm locale và mock-data boundaries cho đến quyết định mới.
- Tên GitHub Project chính PO mới yêu cầu: **MinhDucWeb — Master Control**. Nếu có Project tên `master`, xác minh và rename cùng Project, giữ ID/items/views; không tạo trùng.

## 8. Chưa xong / blocked và thứ tự Antigravity tiếp tục

| Ưu tiên | Việc tiếp tục | Điều kiện / trạng thái |
|---|---|---|
| P0 handoff | Fetch/đọc PR #9, xác minh SHA và checks, giữ mọi file có chủ đích trên remote | Không có quyền tự merge |
| P1 | Lấy owner-authorized Projects/admin capability; tìm cả tên mới và master cũ; tái sử dụng/rename rồi cấu hình 6 views/fields/automation theo spec | BLOCKED_PERMISSION trong phiên Codex; không coi token-visible empty là không tồn tại |
| P1 | PO chọn thứ tự tích hợp PR #4/#9 và xử lý impact docs merge có thể republish | REQUIRES_PO_APPROVAL |
| P1 | Reconcile source/artifact với PR #3, tiếp tục Issue #7 theo từng AC/SDD ID | Không reset artifact, không tạo lại Sprint 2; QA độc lập trên exact SHA |
| P1 | PO cấp tên/quyền/private GitHub repository cho restricted originals | BLOCKED_PRIVACY; không upload originals lên repo public |
| P1 | Thiết lập protection/rulesets/reviewer/merge owners và required checks đã thực sự ổn định | BLOCKED_PERMISSION / PROPOSED; CODEOWNERS một mình không đủ; solo owner không tự approve được PR mình |
| P2 | Chốt release/version/manifest, pipeline source→artifact→environment→URL và migration/rollback | REQUIRES_PO_APPROVAL trước bất kỳ publish/tag/source-setting change |
| P2 | Hoàn thành manual/device/UAT/accessibility và quyền media; chốt MDV2 business/commercial/architecture decisions | NOT_TESTED hoặc pending approval; không tự nâng draft thành approved |

Cloud của phiên này đã sửa checkout về một `WebMinhDuc/prototype`; backend báo running/connected ở revision 5 nhưng chat executor chưa attach được. Tất cả công việc được lưu/kiểm bằng GitHub/API/hosted CI, không cần phục hồi container hoặc lịch sử chat. Nếu dùng môi trường khác, chỉ cần GitHub remote và các capability được cấp phép.

## 9. Remote delivery verification

Đã đọc lại **70/70 file** tại `7163e01f3410cdb7896295a2126bb57d998ea365` qua GitHub remote và so khớp toàn bộ nội dung UTF-8 với payload có chủ đích; không có file sai hoặc không đọc được. [Remote readback ledger](../operations/evidence/2026-11-28/remote-readback.json) lưu path và Git blob SHA từng file. Tree diff với base chỉ có 70 file governance dự kiến; source/tests/static artifacts hiện hữu giữ nguyên.

Commit bổ sung handoff/evidence có SHA riêng; **PR #9 và Issue #8 ghi full SHA cuối cùng, số file được đọc lại và final CI run** sau khi push. Đây là delivery receipt cho cả file này, không dựa vào chat. Manifest [managed-files.json](../governance/managed-files.json) là danh sách đầy đủ tại tip để Antigravity kiểm lại. Lấy PR head qua GitHub hoặc `git ls-remote` như mục 1, đọc handoff tại đúng SHA và kiểm remote content trước khi tiếp tục.

Không báo Done nếu một file có chủ đích còn local/chat-only; dùng BLOCKED_GITHUB_PUSH khi không push được. Các file mới trong PR này không chứa private originals, credentials hay dữ liệu ứng viên thật. Existing public content không được coi là đã qua full legal/privacy review chỉ vì có mặt trên GitHub.
