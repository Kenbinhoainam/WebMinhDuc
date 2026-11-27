# Phân công theo tệp

| Owner | Được sửa |
|---|---|
| root | Baseline, build/hosting, i18n + catalog, P41, preview, PR, handoff, kiểm thử trình duyệt |
| shared_sprint2 | Header, shared, App/router, motion, useHomeCarousel, brand và navigation CSS, test của các thành phần đó |
| demo_business | Home/HomeHero/ServiceShowcase, ServicesPages, Contact F01/F02, sharedformvalidation, CSS biểu mẫu và test W2 |
| home_about_services | JobsPages, saved-jobs, Jobs/Careers CSS, CareersSections, F03/F04 và test W3 |
| editorial_clarify | About/Partners/Editorial, Education/Consultation F05/F06, AdminDemo/policies, rail liên quan và test W4 |
| candidate_clarify | QA độc lập, tests/s2-qa*, execution/qa |
| trace_sprint2 | tests/s2-trace*, dữ liệu nghiệm thu, ma trận kết quả từng mã |

W0 xác định nguồn. W1 chốt API trước khi page owners sửa: giữ chữ ký React, T0/T1/T2/T3/T4 dùng chung, trạng thái/focus đồng bộ, validation khi submit lại. Page owners chỉ sửa các module thuộc quyền, báo về root nếu liên quan catalog. W5 kiểm tra riêng trên build đã chốt, không đánh đồng jsdom và trình duyệt thật.

## Bổ sung sau đợt kiểm thử RC2

`home_about_services` nhận bàn giao đích danh `Education.tsx` từ owner W4 cho phần quản lý metadata tệp và dùng chung `AttachmentPicker.tsx` ở F04/F06. `shared_sprint2` xử lý CSS P36 và breadcrumb P39/P40 khi axe-core và Chromium ghi nhận lỗi. `root` xử lý race focus neo sau báo lỗi độc lập ở About. Các chủ tệp phối hợp qua một checkout và commit tích hợp tuần tự. `candidate_clarify` chạy kiểm trình duyệt trên nhánh `qa/s2-approved-artifact-20261127`, workflow chỉ có `contents: read`; `editorial_clarify` đo độc lập P41 trên cả hai mount.

Trong lượt sửa cuối, chủ W2 và W3 chuyển sang kiểm thử độc lập. Root sửa nhãn bản đồ trong Contact, sau đó thống nhất cách kiểm lại trường vừa sửa của F01–F04 trong Contact, JobsPages và sharedformvalidation. Owner shared_sprint2 nhận riêng Consultation.tsx, Consultation.css và bài kiểm đặt lịch để xử lý MI06. Từng thay đổi đi vào một commit ứng dụng độc lập.

Lượt cuối trả riêng phần danh sách đã lưu trong JobsPages.tsx cho owner W3. Root đối chiếu bài kiểm cũ với thời điểm báo lỗi đã phê duyệt ở CS-C08-3.
