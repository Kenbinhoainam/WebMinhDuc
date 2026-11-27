# SuccessHRVN × Minh Đức Sprint 1 — 5 SDD Proposals

**Review input date:** 26/11/2026. **Decision status:** **PROPOSED — awaiting PO approval individually.**
**Prototype:** https://minhduc-prototype-sprint1.kenbinhoainam.chatgpt.site/
**Reference:** https://www.successhrvn.com/

Nguồn: khảo sát Codex v24, phản biện Gemini, phụ lục ảnh mã S/M. Gemini ban đầu **không có quyền xem ảnh gốc**; ảnh mShots cho biết trạng thái hiển thị, không xác minh click/focus. CSS và QA v23 là lịch sử; GitHub đã có commit v25 sau khảo sát. Không suy ra tình trạng hiện hành nếu chưa tái hiện trên cùng build.

## 1. Bất đồng và phép kiểm chứng

| Case | Kết luận được chứng minh vs giả thuyết | URL / viewport / trạng thái | Tác vụ xác minh |
| --- | --- | --- | --- |
| V01 Header | Codex đã ghi CTA header 3 dòng tại 320 và menu “Tuyển dụng nội bộ” xuống dòng tại 1280; Gemini muốn ưu tiên sửa, không phải Codex bỏ sót quan sát | Trang chủ, 320×740 và 1279/1280/1281×900; menu đóng/mở | Đọc nhãn, chạm/Tab/Enter, tìm overflow/che, đo vùng tương tác |
| V02 Toast | Ảnh ở 390 cho thấy thông báo lưu trên thiết bị che nội dung B2B, **chưa chứng minh trigger sai hoặc thao tác lưu vừa thành công** | /services, /services/labor-supply, /contact; 390×844; phiên mới/đã lưu, toast hiện/đóng | Tái hiện trigger, chạm phần bị che, đóng bằng keyboard, kiểm focus và nháp |
| V03 F01 anchor | Ảnh mở /#business-contact còn hero; QA cũ thử CTA Enter ở điều kiện khác; **không đủ bằng chứng bug điều hướng** | / → /#business-contact; 390×844 và 1440×900; video đang chạy/đã kết, URL trực tiếp, reload, Back | Ghi URL, tiêu đề F01, focus, khoảng cách header; nếu đạt thì không sửa |
| V04 /contact | Mở trực tiếp /contact ở chế độ F02 là hợp lệ; **chỉ lỗi nếu CTA B2B cũng rơi vào F02** | /contact trực tiếp và CTA từ /services/labor-supply, 390×844,1440×900 | So loại form, ngữ cảnh và nhãn, tránh tự đổi default toàn trang |
| V05 Font | Thông số CSS v23 không chứng minh font render/va dấu ở v24/v25 | /about-us/#profile, 390/1440 và 698–701 px; VI/EN/ZH/KO/JA, font loaded | DevTools computed font/line-height/spacing, screenshot dấu/CJK, lưới đầy đủ |
| V06 Contrast | #e42924 lấy từ JPEG: giả sử trắng trên đỏ đục xấp xỉ 4.52:1, **chưa phải xác nhận WCAG cho CSS thật** | / và /services/labor-supply; 390/1440, default/hover/focus | Đo computed color, opacity/nền và tỷ lệ từng trạng thái |
| V07 95% | Nguồn lịch sử cho biết 95% là số demo, **chưa chụp đủ trạng thái nhãn hiện tại** | /about-us/#profile và nơi có số; 390/1440 | Chụp số và nhãn cùng khối, đối chiếu nguồn/kỳ, không tạo bug giả |
| V08 Coverage | Motion, CWV, tương tác ngôn ngữ và bốn trang dịch vụ còn lại chưa đo trực tiếp | / và /services/labor-leasing, /recruitment, /hr-consulting, /college-admissions; 390/1440 | Browser/DevTools, reduced motion, keyboard, network/performance trace theo điều kiện |

**Không tự đặt ngưỡng** 100 ms, 1 giây, Back lệch 20 px hay CLS ≤0.05 thành hợp đồng. 44×44 CSS px ở đây là **mục tiêu thiết kế đề xuất** cho nút chính; không gọi là ngưỡng WCAG 2.2 AA chung. Cần phân biệt số đo raster với CSS computed và test thực tế.

## 2. Top 5 — Impact / Evidence / Effort

| Rank | SDD | Tác động dự kiến | Evidence confidence | Relative effort |
| --- | --- | --- | --- | --- |
| 1 | **SDD-01** — CTA/header/toast/đích | Rất cao cho B2B+B2C | Cao về hiển thị, chưa chắc routing | S–M |
| 2 | **SDD-03** — F01 tối thiểu | Cao tại điểm gửi | Cao về 4 trường, UX khó hiểu là giả thuyết | M |
| 3 | **SDD-02** — phân biệt dịch vụ | Cao trước quyết định | Cao về cấu trúc, cần duyệt nghiệp vụ | S–M |
| 4 | **SDD-04** — trách nhiệm/đầu ra | Vừa–cao | Có bảng kế hoạch, quy trình chưa được duyệt | S–M |
| 5 | **SDD-05** — minh chứng có nguồn | Vừa–cao | Nguyên tắc mạnh; asset/case chưa đủ | S–M hoặc M–L |

## 3. SDD acceptance — screen, action, observable result

### SDD-01 — Lối vào rõ ràng và đúng đích

**Problem/evidence:** M-H320/M-B1280 header gãy dòng; M-L390/M-S390/M-C390 toast che vùng đọc; M-F390/1440 chưa chứng minh lỗi fragment link. **Proposal:** 01a CTA ngắn và menu thu gọn theo không gian; 01b toast không che tương tác và giữ link riêng tư; 01c giữ /#business-contact, /contact trực tiếp có thể là F02, chỉ sửa routing nếu test fail.

| AC | Màn hình và thao tác | Kết quả quan sát |
| --- | --- | --- |
| 01.1 | / tại 320 và 1279/1280/1281 px, chạm và dùng Tab/Enter menu/CTA | Nhãn đọc hết, không tràn/chồng; menu còn mọi đích, Escape đóng và focus trở lại |
| 01.2 | / tại 390,1440; CTA B2B khi video phát/đã kết; Tab tiếp | F01 hiện dưới header, focus tiêu đề rồi Tab tới Người liên hệ; video không giành focus; CTA B2C tới /jobs |
| 01.3 | /#business-contact mở mới, reload, Back/Forward | Đúng F01 và lịch sử; không đặt một sai số cuộn pixel chưa duyệt |
| 01.4 | Từ /services/labor-supply bấm CTA; so mở /contact trực tiếp | CTA B2B tới F01 giữ dịch vụ; mở trực tiếp /contact F02 không coi bug |
| 01.5 | /services,/services/labor-supply,/contact ở 390 khi toast hiện, thao tác/đóng | Không che nhãn/trường/nút; đóng không mất nháp; link Quyền riêng tư còn dùng được |

**PO quyết định:** nhãn gọn, breakpoint menu, vị trí toast; giữ chính sách trigger trừ khi có bằng chứng và quyết định riêng.

### SDD-03 — F01 dễ hoàn thành

**Problem/evidence:** 4 trường bắt buộc đã chốt, 6 trường tùy chọn; khó hiểu là giả thuyết. **Proposal:** nhóm 4 trường ở đầu; nhóm bổ sung có thể thu gọn, dịch vụ chỉ là ngữ cảnh; giữ nháp F01/F02 riêng trong cùng tab, không lưu cloud.

| AC | Màn hình và thao tác | Kết quả quan sát |
| --- | --- | --- |
| 03.1 | F01 từ trang cung ứng tại 390/1440, mở nhóm tùy chọn, nhập 50, đóng/mở | Bốn nhãn bắt buộc rõ; ngữ cảnh dịch vụ và 50 còn nguyên, focus về nút đóng/mở |
| 03.2 | Bỏ trống điện thoại, địa điểm rồi gửi demo | Hai lỗi gắn đúng ô, focus lỗi đầu, các trường khác giữ dữ liệu, chưa có success |
| 03.3 | Điền đủ 4 trường, bỏ trống 6 tùy chọn, gửi demo | Qua local validation, mã DEMO xuất hiện; không gửi dữ liệu thật |
| 03.4 | Email abc@, số lượng 0/-5/12.5, sửa lại | Chỉ trường tùy chọn có giá trị sai báo lỗi, số lượng phải nguyên dương |
| 03.5 | /contact: nháp F01 → F02 → F01 ở 390/320, zoom 200% | Nháp từng loại độc lập, giữ trong tab; labels/focus/keyboard khả dụng |

**PO quyết định:** nhóm thu gọn, câu gợi ý, phạm vi nháp; không tự áp regex số điện thoại quốc tế mới.

### SDD-02 — Phân biệt cung ứng và cho thuê

**Problem/evidence:** trên /services, hai lựa chọn đầu chưa nêu trực tiếp chủ thể ký/trách nhiệm; chưa có chứng cứ khách chọn nhầm. **Proposal:** hiện 3 thông tin Tình huống/Chủ thể ký/Trách nhiệm theo mô hình Minh Đức được PO/nghiệp vụ duyệt; giữ URLs, có nhánh chưa rõ mô hình tới F01.

| AC | Màn hình và thao tác | Kết quả quan sát |
| --- | --- | --- |
| 02.1 | /services 390/1440, đọc hai lựa chọn không hover | Đủ 3 tiêu chí đã duyệt, không mất thông tin |
| 02.2 | Chạm/Enter hai lựa chọn, Back | Đúng /services/labor-supply và /services/labor-leasing, breadcrumb đúng, links có tên truy cập |
| 02.3 | Chọn Chưa rõ mô hình | F01 với ngữ cảnh chưa xác định, không bị bắt chọn dịch vụ |
| 02.4 | 320/768/1920 và zoom 200%, 5 locales | Không tràn, chuỗi dịch đã duyệt/fallback có nhãn |

**PO quyết định:** ai ký và trách nhiệm thực tế theo ngành; không copy pháp lý của SuccessHR.

### SDD-04 — Trách nhiệm và đầu ra theo ca

**Problem/evidence:** /services/labor-supply có bảng kế hoạch theo đợt, thiếu liên kết rõ tới đầu ra/trách nhiệm ngay trong khối; chưa đủ căn cứ nói toàn trang không có quy trình. **Proposal:** giữ bảng, nối các bước được duyệt với owner/input/output; không bắt buộc 4 hay 6 bước, không thêm hệ thống nghiệp vụ/SLA.

| AC | Màn hình và thao tác | Kết quả quan sát |
| --- | --- | --- |
| 04.1 | /services/labor-supply 390/1440, cuộn khối kế hoạch | Đọc được từng bước: ai phụ trách, cần gì, giao gì; nội dung đúng biên bản duyệt |
| 04.2 | 320, zoom 200%, keyboard/screen reader/reduced motion | Đọc tuyến tính, không ẩn nội dung khi giảm chuyển động |
| 04.3 | Chạm/Enter CTA cuối khối | Đến F01 giữ ngữ cảnh labor-supply |
| 04.4 | VI và bản dịch đã duyệt | Cùng bước/đầu ra, không tự thêm thời hạn cam kết |

**PO quyết định:** số bước, owner, đầu ra và mức cam kết được công bố.

### SDD-05 — Minh chứng có nguồn

**Problem/evidence:** ảnh hiện trường/hồ sơ chưa chứng minh kết quả một đợt; 95% là số demo ở nguồn cũ nhưng thiếu chứng cứ rằng bản hiện tại mất nhãn. **Proposal:** một case hoặc thông tin định tính được phép công bố, kèm nguồn/kỳ; nếu thiếu quyền thì ẩn hoặc gắn nhãn demo theo quyết định, không tạo case/logo giả. Không thêm lightbox/carousel.

| AC | Màn hình và thao tác | Kết quả quan sát |
| --- | --- | --- |
| 05.1 | /services/labor-supply 390/1440, đọc khối và link /about-us/#profile rồi Back | Có dịch vụ, bối cảnh, vai trò, đầu ra, nguồn/kỳ; link/Back đúng |
| 05.2 | Fixture số demo, case duyệt, thiếu quyền | Số demo có nhãn cạnh số; thiếu quyền không lộ claim, không có TBD |
| 05.3 | Chặn tải ảnh tại 390/1440 | Văn bản vẫn rõ, khung dự phòng không che nội dung |
| 05.4 | 320/768/1920, zoom 200%, Tab đến link | Crop/chú thích đọc đủ, focus hiện; không lightbox trong scope |

**PO quyết định:** case/asset và quyền công bố; khi thiếu minh chứng thì thẻ demo hay ẩn khối.

## 4. SDD review sign-off table

| Rank | ID | Review question | Status |
| --- | --- | --- | --- |
| 1 | SDD-01 | Chấp thuận 01a/01b/01c với kiểm chứng trước khi sửa routing? | **PENDING PO** |
| 2 | SDD-03 | Thu gọn 6 tùy chọn, giữ 4 bắt buộc, nháp cùng tab? | **PENDING PO** |
| 3 | SDD-02 | Duyệt nội dung chủ thể ký và trách nhiệm? | **PENDING PO** |
| 4 | SDD-04 | Duyệt số bước, đầu vào/ra và người xác nhận? | **PENDING PO** |
| 5 | SDD-05 | Chọn minh chứng, quyền công bố và fallback? | **PENDING PO** |

**No implementation plan yet** for these five features. After PO approvals, scope/evidence will determine technical tasks. All test cases listed are acceptance proposals, **not executed**.
