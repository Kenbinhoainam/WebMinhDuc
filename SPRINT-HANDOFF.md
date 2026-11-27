# Sprint 1 → Sprint 2 — bàn giao hồ sơ v0.2

Cập nhật 27/11/2026, Asia/Bangkok. **Sprint 1 CLOSED — nghiệm thu nội bộ Discovery theo chỉ đạo đóng sprint của người dùng.** Baseline nội dung v0.2 ngày 19/11, O01–O10 chuyển tiếp. Sprint 2 chưa khởi động triển khai. Xem [biên bản đóng](docs/sprint-1/sprint-closure.md).

## Baseline và Git

### Cập nhật xuất bản 27/11/2026

Người dùng đã yêu cầu đưa hồ sơ lên GitHub. Kiểm tra live thấy remote có nhánh prototype (HEAD `08e2da46106b51537b871aea3880fc94b25da935`) và docs/master-sprint1-sdd-20261127 (`66191211358f3c3a645637b0c54a930e65f0662a`); repo không còn rỗng. Các nội dung đó thuộc luồng công việc khác, chưa được audit hoặc hợp nhất với gói này. Bộ hồ sơ chat này được xuất bản độc lập trên nhánh docs/sprint1-closure-20261127; không thay baseline source bằng bản prototype. Trạng thái chưa commit/push bên dưới là snapshot trước xuất bản. Xác minh remote branch sau push bằng Git; không ghi trước SHA của chính commit vào nội dung commit.

- Repo: Kenbinhoainam/WebMinhDuc; root /workspace/WebMinhDuc; remote https://github.com/Kenbinhoainam/WebMinhDuc.git.
- Đầu lượt 19/11: branch work, No commits yet; AGENTS.md và docs/ chưa tracked. Không có HEAD.
- File bàn giao này và hồ sơ chỉ lưu trong workspace; chưa commit/push. GitHub lần audit 17/11 còn rỗng; chưa đọc lại remote trong lượt này.
- Audit 17/11 thấy saved Environment WebMinhDuc có hai entry cùng repo, ref main, mountPath rỗng và WebMinhDuc. Chưa chỉnh hoặc xác nhận đã sửa cấu hình.
- Không có source/dependencies/build/test sản phẩm. Không có kết quả kiểm thử tính năng để báo pass.

## Tài liệu đọc theo thứ tự

1. [AGENTS.md](AGENTS.md) — quyền và quy tắc.
2. [Charter](docs/sprint-1/project-charter.md) — mục tiêu, vai trò và giới hạn thương mại.
3. [Requirements v0.2](docs/sprint-1/requirements-register.md) — quyết định, 30 trường, snapshot 22 mục, 10 AC dự thảo.
4. [Sitemap/MVP](docs/sprint-1/sitemap-and-mvp.md) — giữ menu hai cấp, cập nhật nghiệp vụ.
5. [Điểm còn mở](docs/sprint-1/open-questions-and-decisions.md) — O01–O10 và phần bị chặn.
6. [Audit lịch sử](docs/sprint-1/repository-audit.md) — trạng thái trước ghi tài liệu 16/11, không phải status hiện tại.
7. [Kế hoạch OpenSpec](docs/sprint-1/openspec-setup-plan.md) — chưa cài/init/config.

## Yêu cầu chắc chắn đã có

- 5 ngôn ngữ, Việt gốc, fallback rõ, ADMIN quản trị tiếng Việt.
- Một loại ADMIN; không tạo vai trò nhân viên/marketing riêng, số tài khoản chưa chốt.
- Sáu biểu mẫu; CV nội bộ tùy chọn; định mức tệp F07.
- ADMIN gộp trùng số điện thoại + tin trước xuất.
- Nút xuất và lịch hằng ngày do ADMIN đặt giờ, Google Sheets riêng có 6 tab.
- Bị chặn thông báo ADMIN; xử lý rồi xuất thủ công; nút kiểm tra kết nối không thay kiểm tra trùng.
- SEO/AEO là yêu cầu, tiêu chí chi tiết còn mở.

## Đề xuất Sprint 2 — chưa duyệt kế hoạch

Mục tiêu: chuyển Discovery thành thiết kế/đặc tả review được. Đầu ra dự kiến: wireframe responsive cho trang chủ/dịch vụ/việc làm và luồng ADMIN tiếp nhận–gộp–xuất, sơ đồ trạng thái, hợp đồng dữ liệu xuất, bảng nội dung SEO/AEO. Dùng dữ liệu mẫu; đánh nhãn các quyết định O01–O10.

Điều kiện kết thúc đề xuất: người dùng duyệt thiết kế, từng rule gộp/xuất và AC; thống nhất stack/kế hoạch sau đó. Không thiết kế như thể quy tắc gộp xung đột, đích Sheets, múi giờ hoặc giá đã chốt.

## Quyền và bước hành động đầu tiên

Đã hoàn thành thủ tục đóng Discovery ngày 27/11. Chưa được code, cài package, init OpenSpec, commit/push/PR/deploy. Kiểm tra lại ngày 27/11: branch work vẫn chưa có commit/HEAD; hồ sơ untracked và chỉ lưu trong workspace. Bước đầu phiên tiếp: đọc Git status, biên bản đóng và O01–O10; trình kế hoạch Sprint 2 cụ thể để người dùng duyệt phạm vi. Chưa tạo chat hoặc tự bắt đầu triển khai.

Phiếu đã đánh dấu Đã xác nhận nhưng vẫn có “Còn chốt”; chỉ dùng phần quyết định chắc chắn. Không ghi đè dữ liệu người dùng, không nhập source cũ, không giả định đã có code trên GitHub.
