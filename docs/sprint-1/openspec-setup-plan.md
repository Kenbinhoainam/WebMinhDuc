# Kế hoạch OpenSpec — chưa khởi tạo

Cập nhật hồ sơ 19/11/2026. Phiếu hoàn tất; tham chiếu [handoff](../../SPRINT-HANDOFF.md). Bằng chứng version/runtime bên dưới là snapshot lịch sử, chưa kiểm tra lại trong lượt này. Chỉ là hướng dẫn cho giai đoạn sau; chưa được cấp quyền cài hoặc init. Không chạy bất kỳ lệnh cài/init/apply nào trong Sprint 1 hiện tại.

## Bằng chứng đã có

Ngày 14/11/2026 đã đọc release chính thức trả v2.0.0, tài liệu installation, supported-tools, CLI và getting-started của Fission-AI/OpenSpec. Không khẳng định đây vẫn là latest ở ngày thực hiện sau này. Node Cloud kiểm tra lại 16/11: 24.22.1; npm 11.9.0; không tìm thấy CLI OpenSpec trên PATH.

Nguồn để kiểm tra lại trước khi thực hiện:
- https://github.com/Fission-AI/OpenSpec/releases
- https://github.com/Fission-AI/OpenSpec/blob/main/docs/installation.md
- https://github.com/Fission-AI/OpenSpec/blob/main/docs/supported-tools.md
- https://github.com/Fission-AI/OpenSpec/blob/main/docs/cli.md
- https://github.com/Fission-AI/OpenSpec/blob/main/docs/getting-started.md

## Trình tự sau phê duyệt

1. Xác minh root `/workspace/WebMinhDuc`, remote, status, hướng dẫn và phiên bản công cụ. Kiểm tra marker/skills/prompts cũ trước khi init; init có thể làm mới hoặc dọn file do OpenSpec quản lý.
2. Chọn phiên bản cố định và phương thức cài phù hợp môi trường, trình phạm vi ghi ngoài repo để người dùng cấp quyền. Kiểm tra runtime yêu cầu của đúng phiên bản. Không dùng lockfile dự án để mặc định quyết định cài CLI global.
3. Khi có quyền, cài và xác minh version, xem help của phiên bản đã cài; khởi tạo cho Codex đúng root.
4. Codex theo tài liệu đã đọc dùng `.agents/skills/openspec-*/SKILL.md`; lấy cú pháp từ file thật được sinh. Không ghi đè AGENTS.md tự soạn.
5. Ghi bối cảnh dự án: năm ngôn ngữ, menu hai cấp, SEO/AEO, dữ liệu hồ sơ, trạng thái duyệt và các quyết định mở. Chưa chọn stack khi người dùng chưa chốt.

Ví dụ tham khảo từ phiên bản đã kiểm tra; chỉ chạy sau khi có quyền và kiểm tra lại:

```bash
npm install -g @fission-ai/openspec@2.0.0
openspec --version
cd /workspace/WebMinhDuc
openspec init --tools codex --profile core
```

## Spec trước triển khai

Repo chưa có sản phẩm: không ghi các hành vi dự kiến như hệ thống đang hoạt động. Đề xuất nằm trong `openspec/changes/`; `openspec/specs/` mô tả hành vi đã có theo quy trình đồng bộ/lưu thay đổi.

Tách change dự kiến theo navigation/content, multilingual, jobs, intake/permissions, CMS, SEO/AEO và analytics. Đây là đề xuất chia việc, chưa tạo change hoặc file ngoài gói bảy tài liệu.

Mỗi change có proposal, spec/scenario, design và tasks phù hợp. Duyệt phạm vi và acceptance criteria trước apply. Lệnh validate kiểm tra cấu trúc, không thay duyệt nghiệp vụ:

```bash
openspec validate --all --strict
```

Cú pháp Codex tham khảo đã đọc: `$openspec-propose`, `$openspec-apply-change`, `$openspec-archive-change`. Chỉ dùng khi skills thật được tạo và quyền tương ứng đã được cấp. Không coi “tasks complete” hoặc validate thành công là nghiệm thu sản phẩm.

## Bối cảnh phải dùng cho đề xuất sau này

Chỉ ADMIN; CV tùy chọn; trùng số điện thoại + tin cần ADMIN gộp trước xuất; lịch Sheets 6 tab, bị chặn báo ADMIN để xuất thủ công. Các chi tiết mở tại O01–O10 trong open-questions-and-decisions.md phải được chốt trước apply phần liên quan. Chưa có OpenSpec config hoặc change thật.
