# Biên bản đóng Sprint 1 — Website Minh Đức

Ngày đóng: **27/11/2026**, Asia/Bangkok.
Trạng thái: **CLOSED — nghiệm thu nội bộ Discovery, chuyển tiếp các quyết định mở**.

## Căn cứ và phạm vi nghiệm thu

Người dùng đã xác nhận phiếu yêu cầu hoàn tất ngày 19/11 và chỉ đạo ngày 27/11: “Hoàn tất thủ tục để đóng sprint 1”. Chỉ đạo này được ghi nhận là chấp thuận đóng phạm vi Discovery và bàn giao hồ sơ v0.2. Không ghi nhận chữ ký, tên đại diện khách hoặc nghiệm thu hợp đồng thay khách hàng.

Nghiệm thu hồ sơ phân tích và quy trình làm việc; không nghiệm thu website đã chạy, không phê duyệt chi tiết kỹ thuật còn mở, không cấp quyền triển khai code hoặc phát hành.

## Danh mục đầu ra đã kiểm tra

| Đầu ra | Đường dẫn từ root | Kết quả đóng |
| --- | --- | --- |
| Quy tắc agent | AGENTS.md | Có; phạm vi/quyền rõ |
| Nhận diện repository | docs/sprint-1/repository-audit.md | Có; giữ nguyên snapshot lịch sử 16/11 |
| Project Charter v0.2 | docs/sprint-1/project-charter.md | Có; mục tiêu, đối tượng, phạm vi và giới hạn |
| Requirements v0.2 | docs/sprint-1/requirements-register.md | Có; snapshot 22 mục, 30 trường và 10 AC dự thảo |
| Sitemap/MVP v0.2 | docs/sprint-1/sitemap-and-mvp.md | Có; menu hai cấp và nghiệp vụ cập nhật |
| Quyết định/điểm mở v0.2 | docs/sprint-1/open-questions-and-decisions.md | Có; O01–O10 được giữ để xử lý tiếp |
| Kế hoạch OpenSpec | docs/sprint-1/openspec-setup-plan.md | Có; chưa cài/init/config, đúng giới hạn đã cấp |
| Bàn giao | SPRINT-HANDOFF.md | Có; cập nhật trạng thái đóng và giới hạn bước tiếp |

Phiếu nguồn được đọc và snapshot ngày 19/11/2026; lượt đóng này không đọc lại hoặc sửa Google Sheets. Không khẳng định phản ánh thay đổi ngoài snapshot đó.

## Baseline đóng và bằng chứng

- Repo local: `/workspace/WebMinhDuc`, remote `https://github.com/Kenbinhoainam/WebMinhDuc.git`.
- Kiểm tra trực tiếp 27/11: branch `work`, chưa có commit, không có HEAD; tài liệu untracked. Không có manifest/source/dependency dự án trong cây file được kiểm tra.
- Không chạy test chức năng: chưa có sản phẩm/test suite. Chỉ kiểm tra tài liệu, liên kết local, số mục và trạng thái Git; không coi AC dự thảo là test đã pass.
- GitHub lần audit 17/11 rỗng; chưa kiểm tra lại remote trong lượt đóng. Hồ sơ hiện được lưu ở workspace, chưa commit/push. Không kết luận đã lưu trên GitHub.
- Cấu hình hai entry mount cùng repo phát hiện 17/11 chưa có bằng chứng đã sửa; chuyển tiếp như việc hạ tầng cần rà.

Định danh nội dung baseline (SHA-256, ghi trước sửa trạng thái các tài liệu quản trị):

| File | SHA-256 |
| --- | --- |
| requirements-register.md | d71d63474b391a708438035ab1577413f9d1fe0a4ac64f20f42a535cc0e0db52 |
| sitemap-and-mvp.md | 244309cc0aeee7d2341b5ad90c3e1b8031f05859a97adc3750afaae58c59db92 |

## Chuyển tiếp và trách nhiệm

O01–O10 không bị xóa hoặc coi là đã giải quyết. Danh sách chi tiết và bên cần quyết định nằm trong [quyết định mở](open-questions-and-decisions.md). Người dùng là đầu mối điều phối việc chốt với Minh Đức; chưa có ngày cam kết hoặc cá nhân phía khách được chỉ định. Chốt từng điểm trước thiết kế cuối/code phần bị ảnh hưởng.

- O01–O06: ADMIN, gộp trùng, phạm vi chặn, đích/lịch/ghi dữ liệu xuất, nút thủ công, tệp và thời hạn lưu.
- O07–O09: nội dung/bản dịch, SEO/AEO và chi tiết sitemap/chương trình/tin hết hạn.
- O10: stack/hạ tầng/ngân sách/lịch/bảo hành và người có thẩm quyền nghiệm thu khách.

Xuất sang Google Sheets theo lịch là nhu cầu bổ sung; cần rà công, giá và lịch, không tự coi đã gồm trong giá ban đầu.

## Điều kiện chuyển giai đoạn

Sprint 1 Discovery đã đóng nội bộ. Có hồ sơ để lập kế hoạch Sprint 2; Sprint 2 chưa tự được đánh dấu bắt đầu hoặc hoàn thành. Phạm vi đề xuất: wireframe, UX flows website/ADMIN, đặc tả gộp/xuất, nội dung/SEO-AEO. Kế hoạch cụ thể cần được người dùng duyệt trước thực hiện.

Code, cài package/init OpenSpec, commit/push/PR/deploy vẫn chưa được cấp quyền. Việc đóng sprint không thay đổi các giới hạn đó. Nếu cần bảo toàn trên GitHub hoặc chuyển sang môi trường khác, cần cấp quyền lưu phiên bản riêng trước chuyển; chưa được bỏ workspace hiện tại với giả định remote đã có tài liệu.
