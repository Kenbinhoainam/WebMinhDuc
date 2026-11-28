# Sprint 1 — Evidence Inventory & Closure Gate

**Ngày rà soát:** 27/11/2026. Phân biệt *có tệp trong GitHub* với *được kiểm chứng hoàn thành Sprint 1*.

## 1. Actual repository evidence

| Evidence | Trạng thái / ghi chú |
| --- | --- |
| GitHub repo | Public, default branch **prototype** và branch **gh-pages** đã tồn tại |
| Base commit | **36e2b60765c55e5eafb5ae5653f75bc2f954865c**, publish v25 ngày 26/11 |
| Code | Có src, scripts, tests, assets, các trang prerender và AGENTS.md trên prototype |
| README | Có mô tả chạy/build/demo và giới hạn không có backend thật |
| docs/sprint-1/requirements-and-decisions.md | Discovery **v0.1** cho prototype 3, ghi quyết định cũ theo thời điểm |
| docs/sprint-1/validation.md | Báo cáo chạy build/test của prototype **3 ngày 16/11**, KHÔNG đại diện cho v25 |
| docs/flagship/ | Ghi nhận nhiều lần chỉnh UI/media/QA sau đó; kiểm chứng từng version riêng |
| Codex task handoff | Không kiểm tra được nội dung task Codex từ GitHub; link/định danh thread không phải bằng chứng |
| Customer approval/Sprint closure | Không có biên bản đóng Sprint được xác minh qua các tài liệu vừa đọc |

## 2. Bằng chứng kiểm thử lịch sử, không tự nâng lên v25

Theo docs/sprint-1/validation.md (prototype 3): build TypeScript/Vite/prerender, 22 logic tests, test:sprint, SEO 200 trang, hydration 15 trường hợp, review 35 trạng thái/5 ngôn ngữ được báo cáo đạt trong môi trường tương ứng. Báo cáo **chưa xác minh browser visual, responsive, video thật** do lỗi preview relay; DOM/jsdom và media stubs không thay cho thiết bị/browser thật. Không gọi đây là kết quả QA trực tiếp của build v25.

Theo khảo sát UX Codex ngày 26/11: dựa trên **Sprint 1 v24**, ảnh mShots và CSS/QA **v23** lịch sử; không có DevTools tương tác, analytics hoặc người dùng thực. Sau đó repo có commit publish **v25**, nên bắt buộc đối chiếu phiên bản trước khi kết luận bug hiện tại.

## 3. Closure checklist

| Gate | Yêu cầu để đóng | State |
| --- | --- | --- |
| S1-G1 | Project Charter, Requirements Register, sitemap/MVP, AGENTS/OpenSpec theo phạm vi Sprint 1 đã được kiểm kê và truy vết bản có hiệu lực | **PARTIAL/UNKNOWN** |
| S1-G2 | Task Codex có handoff, branch/commit/files thay đổi, trạng thái chạy test thực và issue còn mở | **UNKNOWN** |
| S1-G3 | Tài liệu nghiệp vụ đã xác nhận được kế thừa, không hỏi lại khách về câu đã trả lời | **DOCUMENTED** |
| S1-G4 | Chênh lệch quyết định cũ–mới và phạm vi thương mại có log, owner phê duyệt | **PARTIAL** |
| S1-G5 | Project Owner có quyết định Close / Close with accepted carryovers / Keep Blocked | **NOT VERIFIED** |

**Closure verdict:** **PENDING FORMAL VERIFICATION**, phù hợp quyết định PO trước đó giữ Sprint 1 Blocked. GitHub nay có source/commits nên không còn phù hợp với nhận định lịch sử “repository trống”. Tuy nhiên commit publish chưa đủ thay thế handoff và acceptance ở cấp Sprint.

## 4. Handoff minimum required

- Hệ tham chiếu: đúng task Codex, repo remote, branch và SHA, workspace tree/dirty changes.
- Danh mục tài liệu/giao phẩm Sprint 1 với đường dẫn, trạng thái và evidence; không dựng lại phần đã có.
- Lệnh kiểm thử **đã chạy thực tế**, phiên bản và log, không điền Pass cho kiểm thử chưa chạy.
- Danh sách risks, file chưa đưa lên GitHub, PR/CI (nếu có), các items chuyển tiếp.
- Project Owner duyệt đóng hoặc chuyển tiếp; **không tự đóng Sprint** khi không có nguồn.

Bản ghi này không đổi code hoặc phát hành website và không chứng nhận việc ký hợp đồng.
