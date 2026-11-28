# Project MinhDucWeb — Master Control — control-center specification

**PROPOSED / BLOCKED_PERMISSION for account-level setup.** GitHub connector has no Projects administration operation. Runner GITHUB_TOKEN returned no visible Project nodes; this is not proof that the account has no Project. No duplicate Project was created. The canonical Project URL remains unverified.


PO update 28/11/2026: the canonical name is **MinhDucWeb — Master Control**. If an existing `master` Project is found, rename that same Project after verifying ownership; preserve its ID/items/views. Do not create a replacement solely for the title change.

## Discover before creating

Owner/admin uses Projects on [Kenbinhoainam](https://github.com/Kenbinhoainam?tab=projects), includes closed Projects, and searches exact title `MinhDucWeb — Master Control` and historical name `master`. With an owner-authorized CLI:

```sh
gh project list --owner Kenbinhoainam --limit 100 --format json
# Inspect pagination/total count; read the existing project if either title exists.
gh project view <verified-number> --owner Kenbinhoainam --format json
```

Only if complete authorized enumeration confirms absence, create **one** Project `MinhDucWeb — Master Control`. Use a private Project until PO approves its audience; public repo Issues can still be added. Link WebMinhDuc, record exact URL, visibility and field/view IDs in this file. A permission error or empty integration view is not absence. Do not copy private Project item content into this repository.

## Six views maximum

| View | Layout / filter | Purpose |
|---|---|---|
| Overview | Table, sort Priority; show blockers and target release | Current release, priority work and impediments |
| Kanban | Board grouped Status | Backlog / Ready / In Progress / In Review / Blocked / Done |
| Roadmap | Roadmap with Start date / Target date, grouped Sprint | Only agreed dates/milestones |
| Requirements | Table filtered label:requirement | Requirement ID, spec approval and traceability |
| Pull Requests | Table filtered is:pr | Review/CI/integration; linked Issues stay visible by reference |
| Releases | Table filtered label:task and Target Release set | Release work, QA and deployment receipts |

GitHub view syntax varies by field type; save and verify each filter against actual sample items. No view URL is claimed until created and opened successfully.

## Fields

| Field | Type / value | Rule |
|---|---|---|
| Status | Built-in single select, six states above | Sole delivery-status field |
| Assignees | Built-in | Human accountability; no invented AI GitHub users |
| Milestone | Built-in Issue milestone | Real delivery checkpoint, not every task |
| Priority | Single select P0/P1/P2/P3 | Do not duplicate as labels |
| Workstream | Single select Governance/UI/Frontend/Backend/CMS/SEO/QA/DevOps | Not duplicated as labels |
| Sprint | Iteration or single select | Preserve current Sprint 2; no arbitrary new sprint |
| Requirement ID | Text | Stable MDV2/SDD IDs, details in versioned docs |
| Assigned Agent | Text | Codex/Gemini/Claude/OpenCode and run/owner reference |
| Target Release | Text | Approved version or pending, not package.json version |
| Blocker | Text | Linked blocking Issue/decision; no private content |
| Risk | Text | Impact and mitigation, link risk register |
| Start / Target date | Date | Only agreed values |
| Effort | Number, optional | Add only if used for planning |

Use labels only for work type: requirement, enhancement, bug, task, documentation, design, qa, change-request. [Label specification](../../.github/labels.json) is additive; existing labels are preserved.

## Automation and Done gate

1. Auto-add matching new WebMinhDuc Issues to this Project and set Backlog. Verify with a real Issue after enabling; built-in item-added workflow can initialize Status.
2. PR ready for review/review requested → its PR item In Review. A human or a separately reviewed integration evaluates the linked Issue; do not infer that every linked Issue is fully implemented.
3. PR merged or Issue closed alone is insufficient for Done. Keep built-in auto-Done workflows disabled until a reviewed process enforces all AC/test evidence, privacy review, independent reviewer and PO/UAT when applicable.
4. Coordinator sets Done only after the Issue's complete Definition of Done. Retain Blocked state and dependency links for unfinished gates. Reopen on regression with a linked defect.

No automation above is claimed enabled. Cross-item review-to-Issue updates require a GitHub App with minimal Projects permission or explicit coordinator handling. Do not embed PATs in repo workflows. Default to human handling until tested.

## Seed items (reuse)

- [#5 MDV2 baseline review](https://github.com/Kenbinhoainam/WebMinhDuc/issues/5) → In Review, requirement/design governance.
- [#6 protection/private source administration](https://github.com/Kenbinhoainam/WebMinhDuc/issues/6) → Blocked pending access/PO decisions.
- [#7 Sprint 2 gaps](https://github.com/Kenbinhoainam/WebMinhDuc/issues/7) → Backlog/Blocked according to individual cases; keep PR #3.
- [#8 governance audit/implementation](https://github.com/Kenbinhoainam/WebMinhDuc/issues/8) → In Review while Draft PR and admin gates remain.

These are proposed Project statuses, not mutations already performed. Add existing PRs #1–#4 and this task's Draft PR instead of recreating them. If an epic needs decomposition, use parent/sub-issues with non-overlapping file ownership; keep Sprint 2's existing results intact.

## Agent Relay mapping

Ghi nhận từ [MDV2-AI-01](../ai/multi-agent-protocol.md). Tại đợt Relay, GraphQL và `gh project list` chỉ thấy 0 Projects với token hiện tại. Owner cần xác minh trong GitHub UI. **BLOCKED_PERMISSION** cho việc xác minh account đầy đủ hoặc chỉnh Project trong phiên này.

| Cần hiển thị | Dùng record hiện có hoặc trường mới khi cần |
|---|---|
| Assigned Agent | Reuse trường text **Assigned Agent** nếu có. Giữ Assignees cho người chịu trách nhiệm. |
| Current Task | Dùng Title của Issue/sub-issue hiện tại. |
| Last Handoff SHA | Text full SHA từ checkpoint mà Issue trỏ đến. |
| Handoff Status | Single select nếu thiếu, READY_FOR_HANDOFF / BLOCKED. Khác delivery Status. |
| Linked PR | Dùng liên kết development tích hợp hoặc PR URL trong Issue/Project item. |
| Blocked by | Dùng Issue dependencies hoặc trường Blocker hiện có. |
| Next Action | Text ngắn kèm checkpoint link khi cần xem bước tiếp trực tiếp trên board. |

Owner mở Project hiện hữu theo ID, kiểm fields và options trước khi thêm. Dùng Issue #10 để thử projection. Chỉ ghi SHA và trạng thái khớp checkpoint hiện hành, kiểm quyền đọc với reviewer rồi giữ GitHub Issue/PR làm nguồn chỉnh sửa. Không bật auto-Done theo tạo PR, merge PR hoặc tạo checkpoint.
