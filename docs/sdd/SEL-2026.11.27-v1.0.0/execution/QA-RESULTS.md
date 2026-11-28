# Kết quả QA Sprint 2

Mỗi dòng của [ma trận nghiệm thu](RESULT-BY-CHOICE.csv) ghi mã SDD, mã nghiệm thu, SHA ứng dụng, thao tác, kết quả, bằng chứng và bước còn thiếu. [Cách đọc](TRACE-READING.md) giải thích cách đối chiếu từng dòng với JSONL gốc. `Not Run` ở cấp dòng nghĩa là còn điều kiện chưa kiểm. Một dòng có thể đã có nhiều phép thử thành phần đạt.

## Bản bàn giao v10

Commit ứng dụng `66b76036469f07b35bc3cb188dc6b61d40fdda32` dùng source Sites `e7724563abeae86d283029bb38ec18ce442c98be`. Bản này giữ focus trên tin liền kề khi thẻ đang có focus bị bỏ lưu từ tab khác. Khi focus ở bộ lọc, thẻ khác hoặc chưa nằm trên điều khiển nào, trang giữ nguyên vị trí đó. [Bộ kiểm đối chiếu hai tab](b2c-saved-focus/choices.json) · [Bản sửa](https://github.com/Kenbinhoainam/WebMinhDuc/commit/66b76036469f07b35bc3cb188dc6b61d40fdda32)

| Phép kiểm của bản bàn giao | Bằng chứng |
|---|---|
| Bố cục, motion và hành trình đến ADMIN đạt 13.036, còn 130 quan sát chưa kích hoạt màn kết; bộ axe và bàn phím đạt 800/800, P41 đạt 6/6 | [Báo cáo CI từng bộ](browser/46013579489/summary.json) · [GitHub Actions](https://github.com/Kenbinhoainam/WebMinhDuc/actions/runs/46013579489) |
| 11/11 lệnh npm đạt, hai lượt kiểm vòng đời hero có mã thoát 0 | [Nhật ký từng lệnh](logs/regression-v10/summary.log) · [GitHub Actions](https://github.com/Kenbinhoainam/WebMinhDuc/actions/runs/46013579450) |
| Build, noindex, liên kết và hình ảnh | [Build](logs/build-sites-v10.log) · [265 HTML, 22.597 tham chiếu nội bộ](logs/preview-v10-paths.json) · [Biên nhận xuất bản preview riêng](browser/sites-v10-receipt.json) |
| Ảnh và bản ghi thao tác | [Điện thoại](browser/46013579489/home-vi-390.png) · [Tablet](browser/46013579489/home-vi-820.png) · [Desktop](browser/46013579489/home-vi-1440.png) · [Video](browser/46013579489/journeys.webm) · [Playwright trace](browser/46013579489/journeys-trace.zip) |

Trên bản v10, bộ kiểm riêng của sáu biểu mẫu đạt 60/60 và Chromium ghi nhận 16/16 ca focus hai tab. Ở lần đo riêng trước đó, bộ tua đến màn kết phim đạt 130/130 ở năm ngôn ngữ và 26 độ rộng. [Biểu mẫu v10](browser/form-feedback-66b7603/observations.json) · [Hai tab v10](b2c-saved-focus/choices.json) · [Màn kết v5](browser/hero-end-88e2b615/hero-end-choices.json)

## Kiểm thử bản v9

Commit ứng dụng `c83bd9001cf2629dfb1934515fcf1c05ae553910` dùng source Sites `e2bca939584a5e53c2d6a8fc40e049884f266ebe`. Chromium kiểm lại riêng việc chuyển focus khi người dùng bỏ lưu ở tab khác. Kiểm tra cuối bao gồm cả hai hành trình tới hồ sơ DEMO tương ứng ở ADMIN. [Kết quả CI](browser/46012655936/summary.json) · [Danh sách lệnh npm và hồi quy hero](logs/regression-v9/summary.log) · [265 trang và các đường dẫn nội bộ](logs/preview-v9-paths.json) · [Biên nhận Sites](browser/sites-v9-receipt.json)

[Ảnh điện thoại](browser/46012655936/home-vi-390.png) · [Ảnh tablet](browser/46012655936/home-vi-820.png) · [Ảnh desktop](browser/46012655936/home-vi-1440.png) · [Video hai hành trình](browser/46012655936/journeys.webm) · [Playwright trace](browser/46012655936/journeys-trace.zip)

[Kiểm lại 60/60 trạng thái sửa lỗi trên v10](browser/form-feedback-66b7603/observations.json).

Ở lượt CI đầu của v9, bàn phím tiếng Hàn tại 390 px trên P14 và P33 gặp đúng lúc route đang tải; hai phần tử footer có focus dịch khỏi vùng nhìn khi nội dung xuất hiện. Cùng mã nguồn, cùng bộ kiểm và cùng mã băm, lần chạy riêng tiếng Hàn tiếp theo đạt 160/160 khi nội dung route đã hiển thị. Hai lần đều được ghi lại. [Kiểm đối chứng](browser/46012655936/ko-calibration-attempt2/) Đối chứng trước và sau các lỗi nằm ở từng phiên bản bên dưới. Số lượt Pass của công cụ và số mã nghiệm thu đã đạt đo hai điều khác nhau. [Ma trận 1.257 mã](RESULT-BY-CHOICE.csv)

## Kiểm thử bản v8

Ứng dụng `d67c9914a17c3cedb4dcd76e397189e833ab9a4d` ứng với source Sites `ac81527a486b6d97b5d2c34887dd9b96dc6f235f`. SHA-256 của thư mục build Sites là `dd0bed444ad18f93b74a29df8a768b4629b3264c1097772f865591d1cd9acf18`. Cả 265 trang HTML có noindex và cả 22.597 tham chiếu nội bộ tìm thấy tệp đích. [Bản build](logs/build-sites-v8.log) · [Kiểm đường dẫn](logs/preview-v8-paths.json) · [Biên nhận Sites](browser/sites-v8-receipt.json)

| Nội dung | Kết quả và bằng chứng |
|---|---|
| Bố cục, luồng B2B/B2C, accessibility và P41 trên bản v8 | [Báo cáo Chromium, axe và bàn phím](browser/46011867733/summary.json) · [GitHub Actions](https://github.com/Kenbinhoainam/WebMinhDuc/actions/runs/46011867733) |
| Phản hồi sau lần gửi lỗi của sáu biểu mẫu | 60/60 ở 390 và 1440 px trong năm ngôn ngữ. Trường sửa hợp lệ hết báo lỗi, focus khi gửi sai và dữ liệu ở các trường khác đúng kết quả mong đợi. [Trước sửa, 9db1adb](browser/form-feedback-9db1adb/observations.json) · [Sau sửa, d67c991](browser/form-feedback-d67c991/observations.json) |
| Đặt lịch tư vấn | Kiểm trước và sau thay đổi tóm tắt ngày giờ bằng chuột và bàn phím. [Các mã chọn lịch](browser/booking-final/9db1adb2/choices.json) · [Chuyển chế độ biểu mẫu và giữ nháp](browser/form-mode-final/9db1adb2/choices.json) |
| Liên hệ, bản đồ và các trang dịch vụ | 32 trường hợp lỗi nhãn bản đồ trên v5 được sửa trong v6. [Trước và sau](b2b-qa/browser-defect-before-after.json) · [Kiểm lại W2 tại v8](https://github.com/Kenbinhoainam/WebMinhDuc/actions/runs/46011867911) |
| Lệnh npm trên v8 | 10/11 đạt trong CI. Bài kiểm cũ yêu cầu lỗi điện thoại tiếp tục hiện sau khi sửa hợp lệ. Đã cập nhật kỳ vọng theo CS-C08-3 rồi chạy lại thành công. [Lần kiểm lại](logs/regression-v8/test-sprint-recheck.log) · [Kết quả từng lệnh](logs/regression-v8/summary.log) · [GitHub Actions](https://github.com/Kenbinhoainam/WebMinhDuc/actions/runs/46011867458) |
| Đọc bản tin, trang sự kiện và lịch mẫu | 30 hành trình bài viết, 25 luồng liên kết sự kiện/tuyển sinh trên v6 và 6 hành trình sự kiện trên v7. [Đối chiếu bài viết](w4-qa/browser-choices-rc6.json) · [Ảnh bài viết](w4-qa/screenshots-rc6/) · [Kiểm lại sự kiện](w4-qa/browser-event-choices-rc7.json) |

[Ảnh desktop](browser/46011867733/home-vi-1440.png) · [Ảnh tablet](browser/46011867733/home-vi-820.png) · [Ảnh điện thoại](browser/46011867733/home-vi-390.png) · [Video thao tác](browser/46011867733/journeys.webm) · [Playwright trace](browser/46011867733/journeys-trace.zip)

Những quan sát làm trên phiên bản trước giữ SHA gốc. Ma trận ghi phạm vi kế thừa đã đối chiếu thay đổi mã nguồn. Tài khoản QA gặp màn hình đăng nhập ở URL riêng; phép thử tương tác chạy trên bản build có mã băm xác minh. Ảnh do hạ tầng Sites kết xuất được lưu riêng.

## Kiểm thử toàn diện trên v5

Ứng dụng `88e2b61596eab5952f183a81b3030da760696c9c`. [GitHub Actions 46008791436](https://github.com/Kenbinhoainam/WebMinhDuc/actions/runs/46008791436) có sáu job thành công. Tất cả dùng source ứng dụng trên cùng gói root-mounted với SHA-256 `27643043bf335a11d3a575a65c7113e512d5caa6cd0a34d5348ac125892823f8`. Chromium trên Linux đọc tệp build trực tiếp qua Playwright. Request ra bên ngoài bị chặn. Phần độc lập này không cần phiên đăng nhập Sites.

| Bộ kiểm | Kết quả | Bằng chứng |
|---|---|---|
| Chromium · bố cục, điều hướng, biểu mẫu và motion | 13.036 Pass, 0 Fail, 130 Not Run. Cả 130 lần đều thuộc cùng điều kiện `CS-A01-1`, do màn kết hero chưa hiển thị ở thời điểm chụp ban đầu. Đã kiểm riêng F01, F03, biên nhận DEMO và bản ghi tương ứng trong ADMIN. | [Dữ liệu từng quan sát](browser/46008791436/main.json.gz) · [Ảnh F01](browser/46008791436/F01-receipt.png) · [Ảnh F03 trong ADMIN](browser/46008791436/F03-admin.png) |
| Accessibility · axe-core 4.10.3 và trình tự bàn phím | 800/800 Pass, 0 Fail, 0 Blocked. 40 trang × 5 ngôn ngữ × 2 độ rộng (390/1440) × 2 phép kiểm. Các luật cần đánh giá thủ công được bảo toàn trong dữ liệu. | [Tổng hợp và hash](browser/46008791436/summary.json) · [Mẫu từng phép đo tiếng Việt](browser/46008791436/axe-vi.jsonl.gz) |
| Công cụ duyệt P41 | CI Chromium đạt 6/6. Chromium chạy độc lập trên cả hai gói đạt 6/6 mỗi gói. Kiểm tỷ lệ iframe, focus, điều hướng, query không hợp lệ và liên kết mở tab riêng. | [CI](browser/46008791436/reviewer.json.gz) · [Hai gói build](w4-qa/p41-chromium.json) |
| Build và regression | TypeScript, Vite và prerender trên gốc Sites và đường dẫn Pages. 20/20 lệnh regression đạt sau kiểm lại. Log giữ cả lần đầu vượt timeout tiến trình media và lần đầu kiểm hydration trước khi client đọc xong dữ liệu localStorage. | [Pages](logs/build.log) · [Sites](logs/preview-build.log) · [Danh mục hồi quy](logs/regression.json) |
| Bộ theo wave | W1 13 lệnh, W2 9 lệnh và 2 kịch bản bổ sung, W3 đạt 7/7 suite việc làm và ứng tuyển, W4 15 ca/suite gồm cả file, CMS và đường dẫn nội dung trên hai gói | [W1](shared-qa/pinned-suite.log) · [W2](b2b-qa/pinned-suite.log) · [W3](logs/b2c.log) · [W4](w4-qa/) |
| Nội dung, metadata, ngôn ngữ | 895/895 phép kiểm nội dung. 200 tổ hợp route/locale và 795 assertion độc lập trên 182 mã. | [Nội dung](trace-content.json) · [QA độc lập](qa/README.md) |
| Tài nguyên và URL | Giải mã 67 tài nguyên. Gói Sites có 265 HTML với noindex, 22.597 tham chiếu src/href nội bộ được so với đích đóng gói, số đích thiếu bằng 0. | [Media](media-audit.json) · [URL](logs/preview-paths.json) |

[Video của các hành trình](browser/46008791436/journeys.webm) · [Playwright trace](browser/46008791436/journeys-trace.zip) · [Điện thoại 390 px](browser/46008791436/home-vi-390.png) · [Tablet 820 px](browser/46008791436/home-vi-820.png) · [Desktop 1440 px](browser/46008791436/home-vi-1440.png) · [ADMIN sau sửa ở 820 px](browser/46008791436/admin-demo-vi-820.png)

Danh sách viewport CI gồm 320, 359, 360, 390, 430, 450, 520, 521, 639, 640, 700, 701, 767, 768, 799, 800, 820, 999, 1000, 1023, 1024, 1279, 1280, 1281, 1440 và 1920 px. Xem trường `viewport_width`, `locale`, `route` của từng quan sát để biết tổ hợp thực sự được thực hiện. Chromium mô phỏng touch và viewport CSS tương đương zoom 200%. Thử IME, bàn phím ảo và công nghệ hỗ trợ trên thiết bị thực có tiêu chí nghiệm thu riêng.

Các bộ kiểm có giao nhau. Không cộng số lệnh, assertion, tổ hợp route/locale và mã lựa chọn. `audit:i18n` dò cả tên doanh nghiệp, địa danh và nhãn tự xưng của ngôn ngữ; exit code 0 xác nhận bộ dò đã chạy. [Log i18n](logs/audit-i18n.log)

Bộ QA bổ sung chạy 43 trường hợp trên 17 mã, gồm bốn CTA dịch vụ, các CTA F05/F06, filter chip, tiếp tục khi bộ nhớ trình duyệt bị chặn và các trang alias. 48 phép kiểm chung bao phủ 193 mã, trong đó có một điều kiện chưa được duyệt. [Kết quả luồng bổ sung](residual.json) · [Log](residual-checks.log) · [QA chung](common-audit.json)

Bộ tuyển sinh F05/F06 xác minh 12 lượt gửi dữ liệu giả cùng biên nhận ADMIN, 15 trang theo ngôn ngữ có noindex và 15 mã của ba chương trình. [Kết quả tuyển sinh](residual-education/choices.json)

Bài kiểm file trên Chromium đạt 20/20 trường hợp F04/F06 × 320/390 px × 5 ngôn ngữ, có 60 lượt mở file chooser. Tên dài xuống 6–10 dòng mà không tràn; thao tác thay, xóa, giữ dữ liệu và đưa focus về đúng nút đều đạt. Sự kiện đóng hộp chọn của hệ điều hành và lời đọc màn hình chưa được quan sát. [Dữ liệu](residual-browser.json) · [Ảnh và log](residual-browser/)

**Kiểm lại màn kết hero.** Chromium 156 giải mã MP4, tua tới 0,35 giây cuối và nhận sự kiện `ended` thật ở năm ngôn ngữ. Khi màn kết đang hiển thị, 130/130 trường hợp CTA ở 26 độ rộng đều đạt. Bộ này bổ sung đúng 130 quan sát chưa kích hoạt trên CI. [Bằng chứng](browser/hero-end-88e2b615/hero-end-choices.json) · [Điện thoại](browser/hero-end-88e2b615/hero-end-vi-390.jpg) · [Tablet](browser/hero-end-88e2b615/hero-end-vi-820.jpg)

Kiểm tra bằng bàn phím trên 12 trang nội dung, dịch vụ và sự kiện đạt 120/120 ở hai kích thước và 165/165 ở sát breakpoint. Thêm 50/50 lượt cho luồng bàn phím ở năm trang dịch vụ tại 767/768 px. Bảng và mục lục đã được thao tác trong Chromium. Bộ W4 bổ sung đạt 17/17 mỗi gói build. [Nhật ký có ảnh](browser/keyboard-zoom/) · [Sát breakpoint](browser/keyboard-zoom-edges/) · [Trang dịch vụ](browser/service-keyboard/) · [Bằng chứng W4](w4-qa/browser-coverage.md)

Ở bản v5, 38/38 ca motion trên Chromium đạt. Các ca kích hoạt disclosure, đổi biểu mẫu, tab lịch sử và biên nhận ở hai kích thước, gồm cả bấm liên tiếp và thay đổi tùy chọn giảm chuyển động. Nhóm kiểm trước khi sửa ghi riêng ba sai lệch MO02-4, MO03-3 và MO03-4. [Bằng chứng v5](browser/motion-final/88e2b615/choices.json) · [Bản đối chứng v4](browser/motion-final/07e61874/choices.json)

## Điều kiện tái hiện

GitHub Pages đặt app dưới `/WebMinhDuc/`. Site review có origin riêng đặt app ở `/`. Cả hai giữ `noindex`. Chạy các lệnh trong `logs/regression.json` từ checkout với `npm ci` và `npm run build`. `tests/s2-qa.mjs` đọc gói build và thực thi component trong jsdom. Các quan sát về focus, file metadata, history và locale trong jsdom được ghi rõ ở từng bằng chứng.

Đăng nhập ChatGPT của chủ dự án là điều kiện vào Site riêng. Phiên Chrome của QA đi đến màn hình đăng nhập, dịch vụ bàn giao xác thực báo `unavailable`. Ảnh do Sites tự kết xuất được lưu cùng biên nhận. [Ảnh trang chủ v5](browser/sites-v5.jpg) · [Biên nhận](browser/sites-v5-receipt.json)

Để chạy lại đúng đầu vào trình duyệt đã lưu, dùng commit ứng dụng trong biên nhận và mã QA trên nhánh `qa/s2-approved-artifact-20261127`. Workflow kiểm lại sự đồng nhất thư mục nguồn trước khi build. Các tệp `*.json.gz` và `*.jsonl.gz` trong thư mục bằng chứng là báo cáo thô có thể giải nén bằng `gzip -dk`. SHA-256 của dữ liệu trước nén nằm trong `summary.json`. [Workflow tại commit QA đã chạy](https://github.com/Kenbinhoainam/WebMinhDuc/blob/2f4b1fd6986bf43da2385c7a69243e936ef4f06b/.github/workflows/s2-artifact-qa.yml)
