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
