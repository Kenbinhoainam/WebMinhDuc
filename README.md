# MinhDucWeb V2

GitHub quản lý yêu cầu, mã nguồn, QA và bàn giao của dự án Minh Đức. Repository này **public**; tài liệu khách hàng, nội dung thương mại và dữ liệu cá nhân chỉ được lưu trong private repository được PO cấp phép.

**EVERY INTENTIONAL CODE OR DOCUMENT CHANGE MUST BE COMMITTED AND PUSHED TO AN AUTHORIZED GITHUB REPOSITORY.** Xem [AGENTS.md](AGENTS.md) và [quy định GitHub](docs/governance/github-operations-policy.md).

## Bắt đầu

**[Codex → Antigravity Handoff](docs/handover/CODEX-TO-ANTIGRAVITY.md)** — trạng thái, SHA, kiểm thử và việc tiếp theo, độc lập với lịch sử chat.

- [Docs Hub](docs/README.md) · [Onboarding trong 5 bước](docs/00-start-here/README.md) · [Cách đóng góp](CONTRIBUTING.md)
- [GitHub audit](GITHUB-AUDIT.md) · [Pages deployment audit](DEPLOYMENT-AUDIT.md) · [Version inventory](VERSION-INVENTORY.md) · [Rủi ro/phụ thuộc](RISKS-AND-DEPENDENCIES.md)
- [Master Requirements MDV2 v0.1 DRAFT](docs/requirements/master-requirements.md) · [Requirements Register](docs/requirements/requirements-register.md) · [Decision Log](docs/decisions/decision-log.md)
- [Project MinhDucWeb — Master Control: thiết kế và trạng thái thiết lập](docs/governance/project-control-center.md) · [Issue #8](https://github.com/Kenbinhoainam/WebMinhDuc/issues/8)

## Đâu là mã nguồn và bản deploy?

| Thành phần | Baseline khảo sát 28/11/2026 |
|---|---|
| Default branch | `prototype@19ac2b3`; vẫn giữ tên hiện tại |
| Source trên prototype | Sprint 1 v30, chưa tích hợp source PR #3 |
| Artifact tại root prototype | Sprint 2, commit publish ghi build từ `66b7603` |
| Sprint 2 source/QA | [Draft PR #3](https://github.com/Kenbinhoainam/WebMinhDuc/pull/3), HEAD `1300df8` |
| MDV2 predecessor | [Draft PR #4](https://github.com/Kenbinhoainam/WebMinhDuc/pull/4), `3ab94d6`, chưa merge |
| GitHub Pages | [URL được deployment log báo](https://kenbinhoainam.github.io/WebMinhDuc/); kết luận HTTP nằm trong deployment audit |

**Không build rồi publish từ prototype cho đến khi đối chiếu source/artifact được PO duyệt.** Build thành công ở đây không chứng minh artifact Sprint 2 đang phục vụ. Tên `gh-pages` không chứng minh nhánh đó là live.

## Chạy kiểm tra source

Node.js 24.15.0, lockfile đã commit:

```sh
npm ci --no-audit --no-fund
npm run build
npm test
npm run test:catalog
npm run test:seo
```

`npm run build` tạo `dist/`, không deploy. `pages:prepare` ghi lại artifact đã track ở root, chỉ dùng trong quy trình release được phê duyệt. [CI và giới hạn QA](docs/operations/ci-and-qa.md).

Source chính: `src/`; test: `tests/`; build: `scripts/`; static inputs: `public/`. Chưa có backend/CMS production hoặc tiếp nhận CV thật. MDV2 không dùng HR-WEB-01 làm master; bản v0.1 vẫn DRAFT.

[README lịch sử và tài liệu Sprint 1](docs/archive/README.md) giữ tham chiếu tới commit gốc. Không xóa lịch sử hoặc tái tạo Sprint 2.
