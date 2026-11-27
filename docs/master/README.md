# MinhDucWeb — MASTER documentation index

**Ngày tổng hợp:** 27/11/2026. **Trạng thái:** hồ sơ phục vụ review, không phải hợp đồng, không phải giấy phép triển khai production.

Thư mục này hợp nhất phần kỹ thuật có thể chia sẻ công khai từ Discovery/Sprint 1, các quyết định Project Owner về demo, bản yêu cầu nhà thầu, và đối chiếu Gemini–Codex–ảnh cho năm đặc tả SDD. Giữ nguyên tài liệu lịch sử; các thay đổi chỉ nằm ở nhánh tài liệu. Không sao chép báo giá, tài liệu khách hàng gốc, dữ liệu cá nhân, ảnh chưa rõ quyền, thông tin tài khoản hoặc secrets vào repository công khai.

## Hồ sơ mới

| Tệp | Nội dung |
| --- | --- |
| [01-project-status-and-governance.md](01-project-status-and-governance.md) | Trạng thái repo/sprint, phân biệt quyết định và bằng chứng |
| [02-requirements-register.md](02-requirements-register.md) | Requirements baseline, 6 form, MAIN non-AI và AI mở rộng |
| [03-sprint1-evidence-and-handoff.md](03-sprint1-evidence-and-handoff.md) | Kiểm kê bằng chứng Sprint 1 và các giới hạn khi đóng Sprint |
| [04-demo-scope-and-acceptance.md](04-demo-scope-and-acceptance.md) | Demo M01–M07, D-01–D-09 đã được duyệt **chỉ cho prototype** |
| [05-sdd-successhrvn-review.md](05-sdd-successhrvn-review.md) | Bất đồng Gemini/Codex, chứng cứ, 5 đặc tả còn chờ PO |
| [06-decisions-risks-change-control.md](06-decisions-risks-change-control.md) | Decision Register, chênh lệch và cổng phê duyệt |
| [07-qa-traceability.md](07-qa-traceability.md) | Ma trận truy vết, trạng thái kiểm thử và bàn giao |

## Tài liệu đã có trong repository, không viết lại

- [AGENTS.md](../../AGENTS.md): quy ước làm việc, quyết định phiên prototype.
- [README.md](../../README.md): hướng dẫn chạy, chức năng demo, giới hạn, các bản flagship.
- [Discovery v0.1](../sprint-1/requirements-and-decisions.md): phản ánh quyết định của bản prototype thời điểm cũ; **không dùng để phủ quyết các câu trả lời cập nhật của khách hàng**.
- [QA lịch sử Sprint 1](../sprint-1/validation.md): test của prototype 3 ngày 16/11, không phải chứng chỉ test bản v25.
- [Thư mục flagship](../flagship/): báo cáo thiết kế, phiên bản, ảnh, kiểm thử và giới hạn kỹ thuật theo từng thời điểm.

## Nguyên tắc

1. **Approved**: quyết định được PO duyệt và phạm vi được nêu rõ; không suy ra production được duyệt từ demo.
2. **Customer-confirmed**: câu trả lời nghiệp vụ từ nguồn Sprint 1; chưa tự động nằm trong báo giá/hợp đồng.
3. **Proposed/Unknown**: đề xuất thiết kế, bổ sung chức năng hoặc bằng chứng chưa kiểm tra; không được đánh dấu Done/Pass.
4. **Evidence**: lưu mã phiên bản, URL, viewport, điều kiện, thao tác, kết quả; không dùng ảnh tĩnh để kết luận luồng tương tác đã Pass.
5. Chỉ thực hiện code sau approved spec. Không tự merge, deploy, thay đổi chính sách dữ liệu hoặc đưa tài liệu nội bộ lên nhánh public.

**Lưu ý về phiên bản:** khảo sát UX SuccessHRVN–Minh Đức dùng prototype **v24** và tham chiếu CSS/QA **v23**; GitHub có commit xuất bản **v25 ngày 26/11/2026**. Chưa có kết quả kiểm thử tương tác đồng bộ cùng build v25 trong bộ khảo sát. Các ghi nhận phải được xác minh lại trên build chọn làm baseline.
