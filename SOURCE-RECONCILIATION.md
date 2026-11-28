# SOURCE RECONCILIATION MATRIX — WebMinhDuc (Phase B)

**Ngày lập:** 28/11/2026  
**Nhánh làm việc:** `feat/s2-reconcile-and-complete` (khởi tạo từ `origin/prototype@19ac2b365f2264399fde4312639127b8de80736f`)  
**Mục tiêu:** Đảm bảo mã nguồn đã được phê duyệt (`SEL-2026.11.27-v1.0.0` / `MDU-SDD-v1.0.0`) có thể tái tạo chính xác bản build và artifact đang phục vụ trên GitHub Pages mà không làm mất lịch sử hoặc ghi đè trái phép nhánh `prototype`.

---

## 1. Bức tranh gốc và sự sai lệch đã xác minh

| Thành phần | Trạng thái tại `prototype@19ac2b3` | Trạng thái tại PR #3 (`1300df8`) | Kết luận đối chiếu |
|---|---|---|---|
| `src/` | Sprint 1 v30 (`08e2da4`) | Sprint 2 v10 (`66b7603`, không đổi tới `1300df8`) | **Cần tích hợp** từ `1300df8` sang nhánh làm việc để đồng bộ source với artifact đang phục vụ |
| `scripts/` | Sprint 1 v30 (`08e2da4`) | Sprint 2 v10 (`hosting-profile.mjs`, `prerender.mjs`) | **Cần tích hợp** từ `1300df8` |
| `public/` | Sprint 1 v30 (`08e2da4`) | Sprint 2 v10 (thêm `public/duyet.html`) | **Cần tích hợp** từ `1300df8` |
| `tests/` | Sprint 1 v30 (`08e2da4`) | Sprint 2 v10 + QA (`tests/s2-*.mjs`, `tests/s2-*.py`) | **Cần tích hợp** từ `1300df8` |
| `vite.config.ts`, `package.json`, `package-lock.json` | Sprint 1 v30 (`08e2da4`) | Sprint 2 v10 (giống nhau giữa `66b7603` và `1300df8`) | **Cần tích hợp** từ `1300df8` |
| Root static artifacts (`index.html`, `assets/`, `vi/`, `en/`, `zh/`, `ko/`, `ja/`, `sitemap.xml`, `duyet.html`) | Sprint 2 v10 (`19ac2b3` đang phục vụ live Pages) | Không lưu bản build root trên nhánh PR #3 | **Giữ nguyên** trên `prototype@19ac2b3`; không ghi đè khi chưa có quyết định PO |
| `docs/governance/`, `GITHUB-AUDIT.md`, `DEPLOYMENT-AUDIT.md`, `.github/workflows/` | Không có trên `19ac2b3` | Không có trên `1300df8` | Thuộc **PR #9** (`chore/8-github-control-center@983c90e`), **0 file chồng lấn** với PR #3 |
| `docs/sdd/SEL-2026.11.27-v1.0.0/` | Không có trên `19ac2b3` | Có đầy đủ SDD, Plan, Decisions, Traceability, QA evidence | **Tích hợp có chọn lọc** các tài liệu chuẩn và bảng kết quả để tiếp tục Sprint 2 |
| `gh-pages@cbce772` | Nhánh artifact lịch sử (Sprint 1 v25, không chung ancestor) | Không liên quan | **Không merge / không chạm tới** |

---

## 2. Kiểm chứng tái tạo Artifact (Reproducible Build Fingerprint)

Sau khi đồng bộ `src/`, `scripts/`, `public/`, `tests/`, `vite.config.ts`, `package.json`, `package-lock.json` từ `1300df840190ac0ecffa32e576f0c809887e9c64` vào worktree nhánh `feat/s2-reconcile-and-complete` và chạy `npm ci && npm run build`:

- **Entry JS:** `dist/assets/index-gI3X1Sm7.js` (421.11 kB) — **khớp 100%** với bản đang phục vụ trên `prototype@19ac2b3`.
- **Entry CSS:** `dist/assets/index-CqyiB8zo.css` (147.39 kB) — **khớp 100%** với bản đang phục vụ trên `prototype@19ac2b3`.
- **So sánh từng byte (`dist/` vs root `prototype@19ac2b3`):**
  - **545 / 545** tệp HTML, JS, CSS, JSON và media khớp **chính xác từng byte (SHA-256 trùng khớp hoàn toàn)**.
  - **2 sai lệch có giải thích rõ ràng:**
    1. `.vite/manifest.json`: Tệp nội bộ của Vite trong `dist/.vite/`, được `scripts/sync-pages.mjs` chủ động loại bỏ khi sao chép ra thư mục gốc Pages.
    2. `duyet.html`: Bản ở root có `href="./"` thay vì `href="/"` do bước `pages:prepare` (`sync-pages.mjs`) điều chỉnh đường dẫn tương đối cho Pages.

**Kết luận Phase B:** Chuỗi truy vết `66b7603` / `1300df8` (`src/`, `scripts/`, `public/`) → `npm run build` → `prototype@19ac2b3` đã được chứng minh tái tạo chính xác.

---

## 3. Chiến lược tích hợp an toàn & Phương án Rollback

1. **Tách biệt PR #9 và Sprint 2:**
   - Đã kiểm tra giao điểm tập file giữa PR #9 (`19ac2b3..983c90e`) và PR #3 (`08e2da4..1300df8`): **0 tệp trùng lặp**.
   - Hai luồng có thể review và merge độc lập theo thứ tự Project Owner quyết định.
2. **Bảo vệ nhánh `prototype` đang chạy Pages:**
   - Nhánh `prototype` dùng legacy branch publishing (`prototype:/`). Mọi thay đổi trên nhánh `feat/s2-reconcile-and-complete` **không** ghi đè `prototype` cho đến khi Project Owner phê duyệt merge và quyết định phương án Pages (tiếp tục `pages:prepare` hoặc chuyển sang GitHub Actions theo `docs/operations/pages-migration-plan.md`).
3. **Phương án Rollback:**
   - Nếu cần khôi phục nguyên trạng bản đang phục vụ trên GitHub Pages: giữ nguyên hoặc revert về commit `prototype@19ac2b365f2264399fde4312639127b8de80736f` (Deployment ID `8123972756`, Pages HTML SHA-256 `420d290219fd875d08778dccb907be210c15bd2d1574b7847cf4ea9f185d42e7`).
   - Toàn bộ công việc mới nằm trên nhánh riêng `feat/s2-reconcile-and-complete` và worktree độc lập, không ảnh hưởng tới `prototype`, `gh-pages`, PR #3, PR #4 hoặc PR #9.
