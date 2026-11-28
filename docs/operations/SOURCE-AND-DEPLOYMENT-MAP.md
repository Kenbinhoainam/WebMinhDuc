# MDV2 P0 — Source and deployment map

**Khảo sát 28/11/2026 (UTC+7).** HEAD trong bảng là SHA đo trực tiếp từ remote. [Issue #13](https://github.com/Kenbinhoainam/WebMinhDuc/issues/13) · [Readiness](BASELINE-READINESS.md) · [PR dependencies](PR-DEPENDENCIES.md).

| Thành phần | Revision | Cách dùng |
|---|---|---|
| Default branch `prototype` | `19ac2b365f2264399fde4312639127b8de80736f` | Source/build inputs kiểm tra gồm `src`, `scripts`, `public`, package/lock, Vite, TypeScript, không đổi từ Sprint 1 v30 `08e2da46106b51537b871aea3880fc94b25da935`. Artifact ở root là Sprint 2. |
| Sprint 2 v10 source | `66b76036469f07b35bc3cb188dc6b61d40fdda32` | Commit publish `19ac2b3` ghi SHA này. Các build inputs nói trên giống hệt giữa SHA này và HEAD PR #3. |
| Draft PR #3 | `1300df840190ac0ecffa32e576f0c809887e9c64` | Bàn giao SDD, bộ kiểm thử và evidence lịch sử. Build bằng source tại chính HEAD này đã tái tạo artifact v10 theo hai ngoại lệ bên dưới. |
| Draft PR #12, source đề xuất cho đợt UI | `848458ea60900ceebaa8f131550cbf8d2417f1bc` | Parent trực tiếp là `19ac2b3`. Với PR #3, trong tập build inputs và tests chỉ khác một dòng CSS `flex-wrap:wrap` trong `src/editorial-reference.css` và test mới `tests/s2-chromium-e2e.py`. |
| Artifact được track ở root của #12 | Cùng bytes/path với `prototype@19ac2b3` | Cả 546 path trong manifest Pages vẫn nguyên. Root của #12 sẽ không chứa fix mới chỉ nhờ source commit. Build `dist/` mới chứa fix. |
| `gh-pages` | `cbce772deaa9f73988d76ce7c1c0a89bc7b5c77b` | Nhánh artifact Sprint 1 v25 lịch sử. Không chung ancestor với `prototype`. Pages Settings trỏ `prototype:/`. |

## Đối chiếu build trước và sau fix

Hai worktree độc lập tại SHA đầy đủ của #3 và #12. Node **24.22.1**, npm **11.9.0**, Linux. `npm ci --cache /tmp/<cache-riêng> --no-audit --no-fund` rồi `npm run build`; cả hai exit 0. Install lần đầu lỗi ENOENT ở npm cache mặc định trong sandbox. Retry dùng cache ghi được ở `/tmp`, không đổi lockfile. Build xuất `dist/` và `.ssr/` và không đổi file tracked. Không chạy bước sync root.

So toàn bộ file regular trong `dist/` với 546 path liệt kê trong `.pages-output.json` ở `19ac2b3`. So Git blob identity theo byte trên từng path. Số liệu tính cả `.nojekyll` và `.vite/manifest.json`.

| Checkout build | Files trong dist | Cùng path, cùng bytes | Cùng path, khác bytes | Chỉ có trong dist | Chỉ có trong manifest root |
|---|---:|---:|---:|---:|---:|
| PR #3 `1300df8` (build inputs v10) | 547 | **545** | 1 | 1 | 0 |
| PR #12 `848458e` (sau fix) | 547 | **277** | 257 HTML | 13 | 12 |

- **v10:** `.vite/manifest.json` nội bộ là file dist-only. `duyet.html` là file khác byte duy nhất: đổi đúng một `href="/"` thành `href="./"` tái tạo chính xác bản root. `scripts/sync-pages.mjs` bỏ `.vite` và copy bytes, không tự rewrite href. Cần lưu riêng bước chuẩn hóa reviewer fallback nếu muốn lặp lại **toàn bộ** đóng gói. [Commit publish](https://github.com/Kenbinhoainam/WebMinhDuc/commit/19ac2b365f2264399fde4312639127b8de80736f)
- **#12:** 12 bundle đổi tên (11 JS và một CSS route), làm đổi HTML prerender. File dist-only thứ 13 là manifest Vite. CSS entry giữ nguyên, CSS route editorial đổi `EditorialPages-Bho7pB24.css` → `EditorialPages-CJoACo8K.css`. Tỷ lệ 545 file khớp chỉ áp dụng v10 trước fix. [Báo cáo đối chiếu của PR #12](https://github.com/Kenbinhoainam/WebMinhDuc/blob/848458ea60900ceebaa8f131550cbf8d2417f1bc/SOURCE-RECONCILIATION.md)

| SHA-256 | PR #3/v10 | PR #12 sau fix |
|---|---|---|
| `dist/index.html` | `420d290219fd875d08778dccb907be210c15bd2d1574b7847cf4ea9f185d42e7` | `c6e74a383f07308cc2eb3e3b69ae059cad0f68364fc53ba6b1a759990dba6857` |
| Entry JS | `index-gI3X1Sm7.js` · `f01fdb78e53307deb23ae772311f1f5c6b8460e3335353cbb9cc0673cbc93cbd` | `index-bnr-5RNC.js` · `a9f584b0bb66ccf75a2dc4887bcc4e1f2358a663bf3dd3998b3a592db944893b` |
| Dist inventory digest | `a9c45ed00495d60eb4bb160d083fe334ed7b76c2cc9d01bc8decb5cb1abd9c95` | `2bb9865ceac8f2bf2f751646e0d07efffc5897c7a17fb2ae8554a16a74c0cb1f` |

Dist inventory digest là SHA-256 của chuỗi các dòng UTF-8 `<sha256 hex>␠␠<path tương đối>\n` sắp theo path. Digest này khác checksum archive deploy. Cả hai dùng `index-CqyiB8zo.css`, SHA-256 `71b715bba8dd734737abf5988ca3e5074f0cbfe04c6c0f22fb8f0f7343444bb5`.

## GitHub Pages đang phục vụ gì

- `GET /pages`: legacy nguồn **`prototype:/`**, HTTPS bật, không custom domain. Latest build `19ac2b365f2264399fde4312639127b8de80736f`, built. Deployment **8123972756**, status success. [Pages workflow 46103834830](https://github.com/Kenbinhoainam/WebMinhDuc/actions/runs/46103834830)
- Workflow nhận file root đã build sẵn. Artifact upload ID **15246800587**, 195,955,331 bytes, digest SHA-256 `fb79c4fcdddff2c26cc5fcee739427a238ed0409765a8119a3bef09de8346e7a`. Dùng artifact ID/sha và deploy revision riêng với build-input SHA. [Provenance chi tiết](../../DEPLOYMENT-AUDIT.md)
- HTTP đọc trực tiếp root **200**, 57,850 bytes, SHA-256 `420d290219fd875d08778dccb907be210c15bd2d1574b7847cf4ea9f185d42e7`. Cache-bust cùng hash. `noindex,nofollow`. **25/25** bundle JS/CSS và **10/10** mẫu root, news, jobs năm locale, reviewer, robots, sitemap HTTP 200 và khớp byte Git. [URL live](https://kenbinhoainam.github.io/WebMinhDuc/)
- Sites preview v10 lưu evidence source app `66b7603` với profile root-mounted riêng. Dùng [handoff chính xác của PR #3](https://github.com/Kenbinhoainam/WebMinhDuc/blob/1300df840190ac0ecffa32e576f0c809887e9c64/docs/sdd/SEL-2026.11.27-v1.0.0/execution/PREVIEW-RELEASE.md). Phiên P0 chưa kiểm HTTP/bytes hoặc quyền người xem của private preview. Loopback `vite preview` chỉ dùng cho QA nội bộ.

## Hệ quả khi merge và publish

Mọi merge vào `prototype` có thể kích hoạt publish lại root vì Pages dùng branch. Merge source-only #12 giữ artifact v10 hiện có trong tree và tạo source/artifact drift cho fix. Trước release, PO cần chọn quy trình Pages (branch-root có build/manifest được duyệt hoặc Actions sau migration), xác nhận target, source SHA, checksum, deployment ID, kiểm sau phát hành và rollback. Trước lần build mới, tránh nhánh `prototype` còn source Sprint 1. [Kế hoạch migration](pages-migration-plan.md)
