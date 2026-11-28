> GOVERNANCE UPDATE 2026-11-27: Project Owner has approved MDU-SDD-v1.0.0 based on SEL-2026.11.27-v1.0.0 for execution of the valid, in-scope, selected UI improvements. The previous “PROPOSED/NOT IMPLEMENTED” label in this historical v1.0.0 document refers to its pre-approval state. Conditional new features, invalid source ID B625, Site-source mismatch, and deferred/excluded selections remain gated; see README and CODEx task prompt. This is NOT production scope or automatic deployment permission.

# Minh Đức — Decision Register MDU-DEC-v1.0.0 (PO Approval Form)

**Ngày:** 27/11/2026, 17:20 GMT+7. **Status:** PENDING PO. Nguồn là toàn bộ lựa chọn Sheet, frozen ID, SDD v1.0, plan v1.0 và source audit. Chỉ lựa chọn hạng mục KHÔNG đồng nghĩa phê duyệt code; không có thay đổi website trong lần chuẩn bị này.

**Cách phê duyệt:** mỗi quyết định chọn Approve recommended / Choose alternative / Defer. Chỉ sau khi có quyết định mới đổi trạng thái Spec Approval; phần bị Blocked vì thiếu evidence không được đánh dấu Complete chỉ bằng một câu trả lời chấp thuận.

## 1. Những quyết định chặn triển khai

| ID | Nguồn & điểm cần chốt | Đề xuất một phương án để PO duyệt | Trạng thái / Gate |
|---|---|---|---|
| **DEC-01** | UI Review Site SHA bc0610e… không thấy trong GitHub; prototype v30 SHA 08e2da4…; Site chưa kiểm được | Yêu cầu executor xác minh Project/Site/repo/branch/commit và build URL; **không thay bằng v30** trước khi đối chiếu | BLOCKED evidence, W0 |
| **DEC-02** | Chọn từng trang!B625 ghi “Chọn” thay cho code, trong cụm P01-A, cạnh P01-A2/A3/A4 | Sửa mã nguồn **thành P01-A1 nếu bạn xác nhận**; hiện giữ ROW625-P01-A-UNRESOLVED | PENDING PO/source fix |
| **DEC-03** | E01–E15 Để sau, CS-E 28 Không chọn, nhưng 146 Pxx-E Chọn; P01/P02-E1…E4 Không chọn | Giữ 146 mã Chọn để đặc tả/QA UI đã có nhưng **chặn mở rộng tính năng nghiệp vụ**, duyệt whitelist riêng nếu thật sự cần | PENDING PO, SDD-13 |
| **DEC-04** | 75 common A/B/C/D/F + 157 CS A–D + 88 MI/MO/MS +30 T đã Chọn | Phê duyệt cấu trúc đặc tả SDD-01…13 để review, chưa phê duyệt triển khai; mỗi package cần review tiêu chí và source mapping | PENDING PO |
| **DEC-05** | A03 ghi “Hệ màu nhìn sáng, hiện đại, tinh tế”; tham chiếu HR2B/Minh Đức | Giữ nhận diện và logo, thống nhất palette semantic sáng/tinh tế + khả năng truy cập; không redesign toàn bộ chỉ vì chọn nhiều mã | PENDING PO/visual mock |
| **DEC-06** | CS-C03-1 đề xuất 120/200ms, MI/MO/MS T0=0 T1=120 T2=180 T3=240 T4=320 ms | Chọn **T0–T4 thống nhất, ease-out**, không phát sinh token 200ms; T4 chỉ cho điểm nhấn được duyệt | PENDING PO/motion |
| **DEC-07** | CS-C04-1 đổi chữ Lưu/Bỏ lưu cùng aria-pressed; MI02-1 nhãn “Lưu việc” cố định + aria-pressed | Chọn **nhãn truy cập cố định + aria-pressed**, hiển thị trạng thái Đã lưu bằng thông tin phụ; không trộn hai mô hình | PENDING PO/a11y |
| **DEC-08** | MI02-4 Undo, MI03-4 Salary sort, MO05-1 route fade, MO08-2 ended decor, MS01-4 spring đã Chọn nhưng điều kiện “nếu duyệt riêng” | Giữ trạng thái Chọn / Spec complete; **không đưa vào code Wave** trước phê duyệt opt-in theo mã | PENDING PO/feature |
| **DEC-09** | P41 /duyet.html được Sheet kê nhưng GitHub prototype không tìm thấy | Tìm đúng Site source và trang công cụ trước; nếu không có, yêu cầu phê duyệt tính năng công cụ riêng | BLOCKED source |
| **DEC-10** | Scope demo M01–M07/D-01–D-09 đã duyệt; v1.2 production AC/HD là DRAFT | Chỉ nâng UX mock đã duyệt, không tạo backend/CMS thật hoặc mở rộng giá/giao dữ liệu thật | Preserve existing governance |

**Không bao gồm trong DEC-04:** CS-A01-3 và CS-B08-3 Không chọn; CS-B08-4 Chưa chọn; các mã E Để sau hoặc Không chọn. Không tự chuyển chúng thành nhiệm vụ nhờ trùng với DX.

## 2. Phạm vi 5 lựa chọn có điều kiện

| Code | Chosen for review | Why execution gated | Default recommendation |
|---|---|---|---|
| MI02-4 | Yes | “Tùy chọn thêm Hoàn tác” ở P18; thay state cứu thao tác | **Defer** nếu chưa chốt UX |
| MI03-4 | Yes | Sort thấp nhất tăng dần là chức năng mới; salaryText không phải số đầy đủ | **Defer** và không tự parse MD008 |
| MO05-1 | Yes | Fade route phụ, có thể ảnh hưởng focus và history | **Defer** cho đến khi có before/after QA |
| MO08-2 | Yes | Kết phim là sự kiện thật; trang trí tùy chọn không được delay CTA | **Defer decor**, giữ CTA |
| MS01-4 | Yes | Spring chỉ cho một chi tiết trang trí được chọn riêng | **OFF** mặc định |

**Ngoài ra:** MO02-3 chỉ dùng cho album lightbox **đã tồn tại**, không được tự thêm lightbox ở ảnh khác; MO07-2 tốc độ dải logo khoảng 22px/giây chỉ là thông số nguồn đề xuất, cần kiểm trực quan trước khi khóa.

## 3. Bộ câu hỏi thiết kế/phạm vi để chốt trong review

| SDD | Câu hỏi cần PO quyết định | Gợi ý cách chốt |
|---|---|---|
| 01 Visual | Màu/typography/space/radius giữ “sáng, hiện đại, tinh tế” tới mức nào? | Duyệt screenshot mẫu trên Home, Services, Jobs, Form, ADMIN trước khi nhân rộng |
| 02 Navigation | Các route/query/anchor hợp lệ và Back/Forward giữ ngữ cảnh nào? | Giữ URL có sẵn; không thêm menu cấp 3 |
| 03 Interaction | Toggle save semantics, nháp trong phiên, Optional Undo/sort? | Giữ demo; optional mới tách CR |
| 04 Responsive | Hỗ trợ thiết bị/OS/browser chính thức, breakpoint nào là tiêu chí ưu tiên? | Kiểm mobile/tablet/desktop/wide với breakpoints nguồn, chọn thực device cases |
| 05 Motion | T0–T4, easing, stop/reduce, spring, route fade, manual pause | Token thống nhất, reduced bắt buộc, optional bật riêng |
| 06 Engineering | Pin source/build và điều kiện đo hiệu năng | Không cam kết Core Web Vitals trước khi có trace |
| 07 B2B | Thay đổi thêm hành vi F01/service có được không? | Chỉ sửa UI/mock hiện có, nội dung pháp lý chờ duyệt |
| 08 Jobs | Closed MD005, saved jobs, optional sort/Undo | Giữ quy tắc jobs và form; bảo vệ không Apply khi đóng |
| 09 Editorial | Tài sản đối tác/case/số liệu nào được công bố? | Không biến số demo thành thành tựu thật |
| 10 Education | Mã chương trình/format thời gian có thay đổi nghiệp vụ? | Mọi thay đổi chỉ mock, chưa tiếp nhận thật |
| 11 ADMIN | CSV/reset/UI tabs có thể diễn đạt như production? | Không, ghi rõ DEMO |
| 12 Reviewer P41 | Có cần tái dựng nếu source không tìm được? | Chỉ PO quyết định sau W0 audit |
| 13 Page E scope | 146 Pxx-E Chọn ảnh hưởng tới nghiệp vụ đến đâu? | Catalog giữ nguyên, chỉ UI hiện có; CR riêng cho phần mới |

**Đề xuất phê duyệt hai tầng:** trước hết PO chốt DEC-01…10 và phạm vi SDD; sau đó duyệt từng gói EX-00…EX-07 đủ điều kiện, với code file ownership và QA evidence. Không cần hỏi lại Discovery đã xác nhận.

## 4. Không tự chốt thương mại

Tính năng không dùng AI có thể thuộc MAIN requirements để đánh giá nhưng không tự nằm trong gói thương mại cơ sở. Các hạng mục AI là optional. Prototype không có nghĩa CMS, database, Google Sheets, real upload, consent/retention đã đạt production. SDD UI Review này chưa đưa thêm modules nào đó vào phạm vi được ký.

**Status tại thời điểm xuất tài liệu:** B625 Code unresolved; E scope pending; Site source mismatch; P41 source unknown; five optional motions not released; Motion token and SaveButton semantics pending. Do not auto-schedule or dispatch Codex tasks.
