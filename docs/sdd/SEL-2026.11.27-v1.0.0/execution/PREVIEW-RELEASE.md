# Bàn giao về MASTER · MinhDucWeb Sprint 2

Selection `SEL-2026.11.27-v1.0.0` · Specification `MDU-SDD-v1.0.0` · Plan `MDU-PLAN-v1.0.0`. Mã công việc trong hồ sơ `MD-S2-UI-UPGRADE-SEL-2026.11.27-v1.0.0`.

**Mở bản duyệt bằng tài khoản ChatGPT của chủ dự án.** [Trang chủ preview riêng](https://minhduc-sprint2-approved-review.kenbinhoainam.chatgpt.site/) · [Công cụ duyệt thiết bị](https://minhduc-sprint2-approved-review.kenbinhoainam.chatgpt.site/duyet.html)

Môi trường thực thi là Codex Cloud, checkout `/workspace/sprint2-implementation`. Mã công việc lấy từ tài liệu bàn giao. Bằng chứng chạy thực tế là các commit, CI, PR và biên nhận Sites được liên kết ở đây.

Đích của PR là `sprint-2/approved-ui-upgrade-sel-20261127-v1` tại `5744b6d`. Mã nguồn sửa trên `feat/s2-ui-upgrade-sel-20261127-v1`. PR ở trạng thái draft để MASTER theo dõi các tiêu chí còn mở. [PR #3 và diff](https://github.com/Kenbinhoainam/WebMinhDuc/pull/3)

| Bản | Commit ứng dụng | Source Sites | Bằng chứng |
|---|---|---|---|
| Nguồn tham chiếu | `08e2da4` (prototype v30) | `3453c09` (Site review Sprint 1 v3) | [Đối chiếu hai nguồn, kể cả SHA trong Sheet](SOURCE-BASELINE.md) |
| Sprint 2 preview v10 · **bản bàn giao** | `66b76036469f07b35bc3cb188dc6b61d40fdda32` | `e7724563abeae86d283029bb38ec18ce442c98be` | [Biên nhận v10](browser/sites-v10-receipt.json) · [Ảnh preview](browser/sites-v10.jpg) · [Đường dẫn tài nguyên](logs/preview-v10-paths.json) |
| Sprint 2 preview v9 | `c83bd9001cf2629dfb1934515fcf1c05ae553910` | `e2bca939584a5e53c2d6a8fc40e049884f266ebe` | [Biên nhận v9](browser/sites-v9-receipt.json) · [Ảnh trang chủ](browser/sites-v9.jpg) · [Đường dẫn tài nguyên](logs/preview-v9-paths.json) |
| Sprint 2 preview v8 | `d67c9914a17c3cedb4dcd76e397189e833ab9a4d` | `ac81527a486b6d97b5d2c34887dd9b96dc6f235f` | [Biên nhận v8](browser/sites-v8-receipt.json) · [Đường dẫn tài nguyên](logs/preview-v8-paths.json) |
| Sprint 2 preview v7 | `9db1adb2d7f84371dd7b954038a5c3ae2643a469` | `bdf4066be8557f0c3765cbd9732e12f2922e881f` | [Biên nhận v7](browser/sites-v7-receipt.json) · [Đường dẫn tài nguyên](logs/preview-v7-paths.json) |
| Sprint 2 preview v6 | `c25a398a424880651cfc375760401aadc0c006d1` | `814828c92ccafba27b4f5c3f7394f9665c2724c7` | [Biên nhận v6](browser/sites-v6-receipt.json) · [Kiểm 22.597 liên kết và tài nguyên](logs/preview-v6-paths.json) |
| Sprint 2 preview v5 | `88e2b61596eab5952f183a81b3030da760696c9c` | `b9b58c4da406a91e43e94e2ad98a0f73327a47ab` | [Biên nhận v5](browser/sites-v5-receipt.json) · [Ảnh trang chủ v5](browser/sites-v5.jpg) · [Đối chiếu đường dẫn](logs/preview-paths.json) |
| Sprint 2 preview v4 | `07e61874db50c14575d693f8d7e3e40769ab34e1` | `96aacbac60b3e51f195822fbaa04891918aa560d` | [Biên nhận triển khai](browser/sites-v4-receipt.json) · [Ảnh Sites v4](browser/sites-v4.jpg) |
| Sprint 2 preview v2 | `4231bae` | `7721ff18` | [Biên nhận succeeded](browser/sites-v2-receipt.json) · [Ảnh do Sites chụp](browser/sites-v2.jpg) |

## Quản lý nghiệm thu

<!-- result:start -->
**Chưa đóng Sprint 2.** Trong 1.257 mã Chọn có **524 Completed, 617 Incomplete và 116 Blocked**. Kết quả toàn bộ tiêu chí của từng mã gồm 524 Pass, 0 Fail, 116 Blocked, 617 Not Run. Các phép kiểm đạt một phần nằm trong cột `evidence`. Nhiều mã yêu cầu phối hợp nhiều thao tác, đánh giá của người sử dụng, công nghệ hỗ trợ hoặc thiết bị vật lý. MASTER có thể lọc `next_owner` và `next_check` để phân công đúng việc còn thiếu.

Trong 524 mã Completed, 187 mã có phép nghiệm thu đầy đủ trên chính commit `66b7603`. Với 337 mã còn lại, hồ sơ giữ SHA của phép kiểm trước và đối chiếu thay đổi mã nguồn qua năm lần sửa. Trong 617 mã Incomplete, 298 thuộc frontend và kiểm giao diện, 229 thuộc chức năng, 52 thuộc motion, 37 cần thêm thiết bị, 1 thuộc accessibility. Trong 116 mã Blocked, 70 cần người dùng thử, 30 cần quyết định của chủ dự án, 13 cần chủ dự án phối hợp QA và 3 cần thiết bị.

Bản chốt giữ nguyên 22 tệp nguồn và 1.257 dòng lựa chọn. Google Sheets khớp 19.113 giá trị đã đối chiếu. Tách riêng 38 mục Không chọn, 15 Để sau, 1 Chưa chọn và 246 mã DX tham khảo.
<!-- result:end -->

- [1.257 dòng kết quả, mã nghiệm thu, bằng chứng, người xử lý tiếp](RESULT-BY-CHOICE.csv) · [Hướng dẫn tra mã](TRACE-READING.md) · [Kiểm toàn vẹn bản chốt](SELECTION-INTEGRITY.json)
- [Kết quả QA](QA-RESULTS.md) · [Nhật ký sửa theo wave](IMPLEMENTATION-LOG.md) · [Lỗi và hồi quy](DEFECTS.md) · [Phân quyền tệp](FILE-OWNERSHIP.md)
- [Từng quyết định / điều kiện nghiệm thu còn mở](TRACE-GAPS.md) · [So sánh với Google Sheets sau ngày đóng băng](SELECTION-DELTA.md)

Project Owner cần xác định mã nguồn B625. Năm lựa chọn có điều kiện liên quan tới Undo, sắp xếp thu nhập, fade khi đổi route, trang trí màn kết và spring cần thỏa điều kiện của dòng gốc. Nhóm E có 146 dòng được giữ trong sổ theo dõi theo từng hành vi demo hiện hữu. Các tính năng nghiệp vụ mới, chuyển dữ liệu thật và xuất bản trang đích cần quyết định riêng. Hai quyết định về giao diện còn mở là số lối tắt trong P41 (8 trong đặc tả, 13 ở bản đã bàn giao) và trạng thái mặc định của mục lục bài viết từ 900 px. Một số tiêu chí yêu cầu người dùng độc lập thực hiện nhiệm vụ, xác nhận tài liệu/ảnh, thử thiết bị thật hoặc duyệt chính sách. Mã, điều kiện và người xử lý nằm trong bảng quyết định.

Trong phép đo tại 390 px, chuyển từ phim sang màn kết làm hero thấp đi 58,844 px, CLS của lần chuyển là 0,1146 ở cả sáu lượt trên bản v7. Đây là số đo phòng thử nghiệm; phần này còn cần đối chiếu trên thiết bị và mạng thực tế. [Điều kiện đo, số liệu và giới hạn](b2b-qa/performance-9db/REPORT.md)

<!-- groups:start -->
## Tiến độ theo nhóm đặc tả chính

| Nhóm đứng đầu cột sdd_owner | Completed | Incomplete | Blocked |
|---|---:|---:|---:|
| MDU-SDD-01 | 4 | 60 | 3 |
| MDU-SDD-02 | 31 | 37 | 7 |
| MDU-SDD-03 | 30 | 56 | 5 |
| MDU-SDD-04 | 0 | 42 | 5 |
| MDU-SDD-05 | 14 | 39 | 3 |
| MDU-SDD-06 | 1 | 12 | 2 |
| MDU-SDD-07 | 41 | 90 | 50 |
| MDU-SDD-08 | 162 | 72 | 3 |
| MDU-SDD-09 | 148 | 134 | 26 |
| MDU-SDD-10 | 57 | 29 | 4 |
| MDU-SDD-11 | 23 | 39 | 4 |
| MDU-SDD-12 | 13 | 7 | 4 |

Ở các dòng Incomplete, cột `next_check` ghi thao tác hoặc điều kiện thực tế cần kiểm. Lọc `next_owner` để tách các ca chức năng, bố cục và motion mà nhóm kỹ thuật còn phải chạy khỏi các ca cần thiết bị thật hoặc người dùng độc lập. [Danh sách từng mã](RESULT-BY-CHOICE.csv)
<!-- groups:end -->
