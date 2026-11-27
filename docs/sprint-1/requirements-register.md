# Requirements Register v0.2

Cập nhật 19/11/2026; đã đối chiếu trực tiếp phiếu khách hoàn tất.  XN = xác nhận nhu cầu/định hướng, không đồng nghĩa duyệt spec hoặc hợp đồng; CL = cần làm rõ; ĐX = đề xuất; GT = giả định. Mọi ưu tiên và AC là dự kiến.

## Nguồn

- N0: yêu cầu/bàn giao hiện tại, chọn WebMinhDuc rỗng ngày 14/11; chỉ đạo lưu bảy file ngày 16/11.
- N1: câu trả lời trực tiếp trong chat “Phân tích - Báo giá”, 09/11: B2B, dịch vụ, địa bàn, 5 ngôn ngữ, Trung giản thể, tuyển sinh.
- N2: xác nhận 10/11 cùng chat: CMS viết riêng, marketing vận hành, duyệt bản dịch, website trước/AI sau.
- N3: trích xuất `feedback_cua_khach.docx` trong kết quả công cụ lịch sử; đã đọc trích xuất, chưa mở file Word gốc tại Cloud.
- N4: phần AI giải thích/tổng hợp V5; không coi tất cả định mức/giá là khách đã chốt.
- N5: “Lộ trình AI-Native Engineering”, yêu cầu Sprint 1 và duyệt trước code.
- N6: xác nhận hiện tại: 5 ngôn ngữ; menu 2 cấp; 16/11 giữ sitemap/MVP ban đầu, câu hỏi chờ khách, thêm SEO/AEO.

- N7: Phiếu Google Sheets đọc 19/11/2026: 22 mục, 30 trường và 6 dòng tiếp nhận đều Đã xác nhận; cột tổng hợp đã duyệt hiện ở F (đã được di chuyển từ K).
- N8: xác nhận trực tiếp 19/11 về ADMIN, gộp trùng, xuất hằng ngày sang Sheets và phục hồi thủ công. Phần “Còn chốt” trong phiếu tiếp tục là điểm mở.

## Register

| ID | Yêu cầu | Nguồn | Trạng thái | Ưu tiên | AC dự kiến |
| --- | --- | --- | --- | --- | --- |
| GOV-01 | Hồ sơ Discovery và bàn giao, chưa code | N0,N6,N7 | XN phạm vi tài liệu | P0 | Đúng repo, không build/init/commit/push |
| BIZ-01 | B2B chính, B2C hỗ trợ | N1,N2 | XN | P0 | Hai hành trình rõ, CTA đúng đối tượng |
| BRAND-01 | Xanh biển–trắng–đỏ; tập thể Minh Đức | N1 | XN | P0 | Thiết kế duyệt; tư liệu có quyền sử dụng |
| NAV-01 | Bảy nhóm trang, menu tối đa 2 cấp | N1,N6 | XN | P0 | Điều hướng không vượt hai cấp; nội dung sâu không bắt buộc thành menu |
| SVC-01 | Năm nhóm dịch vụ | N1 | XN | P0 | Nội dung từng dịch vụ có phạm vi và liên hệ |
| JOB-01 | Việc phổ thông/tay nghề; lọc KCN, loại hình, ca | N1,N3 | XN+CL | P0 | Kết hợp lọc đúng; có trạng thái không kết quả |
| JOB-02 | Tin tuyển chi tiết, xử lý hết hạn | N1,N3 | XN+CL | P0 | Máy chủ dừng nhận khi tin đóng; cách ẩn/giữ tin được duyệt |
| INT-01 | JD nội bộ; CV tùy chọn, thay yêu cầu cũ | N7/F04 | XN | P0 | Gửi được khi thiếu CV; có tệp thì theo F07 |
| EDU-01 | Tư vấn và nhận hồ sơ tuyển sinh | N1,N3 | XN+CL | P0 | Hai mục đích tách rõ; trường/chương trình thật được xác nhận |
| FORM-01 | Sáu biểu mẫu và 30 trường đã chốt | N7/F01–F06 | XN | P0 | Theo bảng trường v0.2 bên dưới |
| CMS-01 | CMS viết riêng, chỉ loại tài khoản ADMIN | N2,N7/H4 | XN; số tài khoản còn mở | P0 | Quản trị tiếng Việt, 5 bản nội dung |
| CASE-01 | Lưu, phân nhóm hồ sơ theo luồng | N3 | XN | P0 | Không lẫn tuyển lao động/nội bộ/tuyển sinh/B2B |
| CASE-02 | Hồ sơ, nguồn, phụ trách và xuất thủ công/hằng ngày sang Sheets | N7/T3,T4 | XN lõi; chi tiết xuất CL | P0 | AC-07, AC-08, AC-10 |
| CASE-03 | Trùng số điện thoại + tin; ADMIN gộp trước xuất | N7,N8 | XN; quy tắc gộp CL | P0 | AC-05, AC-06 |
| ACL-01 | Một loại ADMIN, không có vai trò nhân viên/trưởng bộ phận | N7/H4,N8 | XN | P0 | Không đăng nhập không được đọc quản trị/tệp; quyền Sheets đích riêng |
| LANG-01 | 5 ngôn ngữ, Việt gốc, fallback rõ, duyệt từng bản | N7/L1–L4 | XN; định mức nội dung CL | P0 | AC-01, AC-02 |
| CONTENT-01 | Viết/ảnh/dịch/nhập liệu/vòng sửa | N2,N3,N4 | CL | P0 | Có đầu vào, trách nhiệm, định mức được duyệt |
| NEWS-01 | Lao động/pháp luật/kiến thức/hoạt động | N1 | XN | P0 | Có chuyên mục, người duyệt, thông tin xuất bản |
| CONTACT-01 | Hotline, WeChat, Zalo, Messenger | N1 | XN+CL | P0 | Link/QR/tài khoản đúng; hình thức Box chat được chốt |
| ANALYTICS-01 | Traffic, nguồn và chuyển đổi | N1,N3 | XN+CL | P0 | Đo gửi thành công và nhấp liên hệ; đi làm đối chiếu nhân viên |
| UX-01 | Demo mobile hai luồng, duyệt giao diện trước code | N3 | XN | P0 | Người lao động và nhà máy thấy luồng tiếp nhận phía quản trị |
| QUALITY-01 | Responsive và khả năng truy cập | N5 | ĐX | P0 | Chốt thiết bị, bàn phím, lỗi form và cách đo |
| DATA-01 | Gửi không tài khoản, tệp riêng, lưu/xóa có vết | N7/F07–F09 | XN; thời hạn lưu CL | P0 | AC-03, AC-04, AC-09 |
| SEO-01 | Tối ưu SEO | N6 | XN nhu cầu; AC ĐX | P0 | Danh mục kiểm tra SEO bên dưới được duyệt và kiểm chứng |
| AEO-01 | Tối ưu AEO (Answer Engine Optimization) | N6 | XN nhu cầu; phạm vi/AC CL | P0 | Chốt nền tảng mục tiêu và tập câu hỏi, kiểm chứng nội dung trả lời |
| AI-01 | AI nội dung/video/xu hướng/tự đăng | N1,N2 | XN nhu cầu dài hạn; CL | P1 | Change riêng về duyệt, kênh, giới hạn, phí |
| CRM-01 | Đồng bộ app/CRM | N3 | CL | P1 | Chốt hệ thống đích/API/dữ liệu/đồng bộ |
| DELIVERY-01 | Source, dữ liệu, tài khoản, hỗ trợ | N3 | XN+CL | P0 | Checklist bàn giao và điều kiện sau bảo hành |
| ASSUMP-01 | Một CMS dùng chung, nhóm dữ liệu và quyền | Phân tích AI | GT | Chờ duyệt | Chốt “lưu riêng” là nghiệp vụ hay nơi lưu vật lý |

## SEO/AEO — gói tiêu chí đề xuất, chưa cam kết kết quả bên ngoài

SEO: title/description, heading, URL, canonical, liên kết nội bộ, sitemap XML, robots/indexability; thiết kế hreflang tương ứng các bản ngôn ngữ thật; kiểm soát URL bộ lọc và tin hết hạn; structured data phù hợp nội dung hiển thị; kiểm tra hiệu năng/mobile và kết nối Search Console khi có quyền. Phải chốt số template/URL kiểm thử và ngưỡng trước triển khai.

AEO: thống nhất cách gọi Minh Đức, dịch vụ, địa bàn và dữ kiện có nguồn; nội dung trả lời trực tiếp các câu hỏi đã duyệt của nhà máy/người lao động; cấu trúc đoạn, danh sách/bảng dễ đọc; người duyệt và ngày cập nhật; dữ liệu có cấu trúc khớp nội dung. Chốt trước số câu hỏi, số trang, 5 ngôn ngữ nào phải có các câu trả lời này và cách kiểm tra. Không mặc định thêm viết bài không giới hạn, chatbot hoặc đăng tự động vào MVP.

Nghiệm thu theo đầu ra kỹ thuật/nội dung đã thống nhất; không bảo đảm thứ hạng, index, rich result hay AI trích dẫn. Google cho biết nền tảng SEO vẫn áp dụng cho AI Overviews/AI Mode, không có markup hay file AI đặc biệt bắt buộc. Điều này chỉ nói về Google; các nền tảng AEO khác phải chốt riêng.

Nguồn chính thức đọc 16/11/2026: https://developers.google.com/search/docs/appearance/ai-features

## Trường biểu mẫu v0.2 — nguồn khách đã xác nhận

| Mã | Trường | Mức bắt buộc | Bổ sung |
| --- | --- | --- | --- |
| F01.01 | Tên doanh nghiệp | Tùy chọn | — |
| F01.02 | Người liên hệ | Bắt buộc | — |
| F01.03 | Điện thoại | Bắt buộc | — |
| F01.04 | Email | Tùy chọn | — |
| F01.05 | Địa điểm | Bắt buộc | — |
| F01.06 | Vị trí cần tuyển | Tùy chọn | — |
| F01.07 | Số lượng lao động | Tùy chọn | — |
| F01.08 | Ca làm | Tùy chọn | — |
| F01.09 | Ngày cần người | Tùy chọn | — |
| F01.10 | Ghi chú | Bắt buộc | — |
| F02.01 | Họ tên | Bắt buộc | — |
| F02.02 | Điện thoại | Bắt buộc | — |
| F02.03 | Email | Tùy chọn | — |
| F02.04 | Nội dung liên hệ | Tùy chọn | — |
| F03.01 | Họ tên | Bắt buộc | — |
| F03.02 | Điện thoại | Bắt buộc | — |
| F03.03 | Tin tuyển / mã tin | Bắt buộc | — |
| F04.01 | Họ tên | Bắt buộc | — |
| F04.02 | Điện thoại | Bắt buộc | — |
| F04.03 | Email | Tùy chọn | — |
| F04.04 | Vị trí ứng tuyển | Bắt buộc | — |
| F04.05 | CV | Tùy chọn | — |
| F05.01 | Họ tên | Bắt buộc | — |
| F05.02 | Điện thoại | Bắt buộc | — |
| F05.03 | Chương trình quan tâm | Tùy chọn | Có mục "Khác: Để người xem tự điền nhu cầu |
| F06.01 | Họ tên | Bắt buộc | — |
| F06.02 | Điện thoại | Bắt buộc | — |
| F06.03 | Email | Tùy chọn | — |
| F06.04 | Chương trình đăng ký | Tùy chọn | — |
| F06.05 | Tệp hồ sơ | Tùy chọn | — |

## Tiêu chí nghiệm thu dự thảo v0.2 — chưa chạy

Các AC dưới đây chuyển nhu cầu thành tình huống có thể kiểm chứng; chưa là bằng chứng sản phẩm đã làm hoặc duyệt kỹ thuật cuối.

| ID | Nguồn | Kết quả cần kiểm chứng |
| --- | --- | --- |
| AC-01 | L1,L2,L4 | Đủ 5 ngôn ngữ cho các phần đã chốt; chưa có bản dịch hiển thị tiếng Việt có nhãn; đổi ngôn ngữ giữ đúng nội dung. |
| AC-02 | L3,H4 | Chỉ ADMIN quản trị bằng tiếng Việt; nội dung dịch nháp không tự xuất bản; người chưa đăng nhập không truy cập quản trị/tệp. |
| AC-03 | F01–F06 | Mỗi biểu mẫu kiểm tra đúng trường bắt buộc/tùy chọn, lưu đúng nhóm; gửi thành công có mã hồ sơ; lỗi không báo thành công giả. |
| AC-04 | F04,F07 | Ứng tuyển nội bộ không bị chặn vì thiếu CV; nhận đúng JPG/JPEG/PNG/PDF/DOC/DOCX, chặn tệp vượt 5 MB, lượt vượt 3 tệp hoặc 15 MB. |
| AC-05 | T1,T2 | Cùng số điện thoại + cùng tin tạo nhóm trùng; cùng số khác tin không trùng theo khóa này; còn trùng chưa xử lý thì chặn xuất. |
| AC-06 | T2 | ADMIN gộp dữ liệu; kết quả xuất dùng dữ liệu sau xử lý. Quy tắc chọn giá trị xung đột và bản chính phải chốt trước khi kiểm thử cuối. |
| AC-07 | T3 | Có lịch hằng ngày do ADMIN cấu hình và nút xuất thủ công; Google Sheets đích có tab riêng cho mỗi biểu mẫu; kiểm tra dữ liệu vào đúng tab. |
| AC-08 | H5,T3 | Lịch bị chặn báo ADMIN; sau xử lý ADMIN bấm xuất thủ công; không tự chạy bù. Nút kiểm tra lại kết nối không bỏ qua kiểm tra trùng. |
| AC-09 | H2,H3,F09 | ADMIN đổi người/bộ phận phụ trách và trạng thái theo luồng; cập nhật/xóa/xuất/gộp có lưu vết. Hồ sơ không tự xóa trong giai đoạn đầu. |
| AC-10 | T4 | Nguồn/UTM và thông tin nghiệp vụ xuất đúng; nguồn thiếu ghi Không xác định; không coi nhấp gọi/Zalo là người đã đi làm. |

## Snapshot câu trả lời tổng hợp

Nguồn: https://docs.google.com/spreadsheets/d/1ievyqEKeznnwOfA0CBE9JKNN9qIXhiw_hnQK1jh7vTU/edit ; đọc 19/11/2026. Giữ cả nhãn còn chốt của cột F; trạng thái Đã xác nhận không tự giải quyết các chi tiết đó. Câu trả lời T2 nguồn bị cắt cuối, đối chiếu xác nhận trực tiếp của người dùng trong chat. Snapshot không tự cập nhật khi Sheets đổi.

### L1 — Những nội dung nào phải có đủ năm ngôn ngữ ngay khi ra mắt: trang giới thiệu/dịch vụ, tin việc làm, tuyển nội bộ, tuyển sinh, bài viết và biểu mẫu? (Nhóm nào cần dịch đầy đủ, nhóm nào được đăng riêng từng tiếng?)

Đã duyệt: ra mắt 5 ngôn ngữ Việt, Anh, Trung giản thể, Hàn, Nhật cho giao diện, menu, trang chủ, giới thiệu, dịch vụ, liên hệ và biểu mẫu. Tin tuyển/bài viết/chương trình có vùng nhập bản dịch riêng; không bắt buộc đủ bản dịch mới đăng.
Còn chốt: danh sách nội dung ban đầu và định mức nhập/dịch.

### L2 — Tin tuyển và bài viết mới được xuất bản theo cách nào?

Đã duyệt: dùng tiếng Việt làm nội dung gốc; xuất bản từng bản dịch sau duyệt. Chưa có bản dịch thì hiển thị tiếng Việt và nhãn ngôn ngữ rõ ràng; chuyển tiếng giữ đúng tin/bài. SEO/URL phải phản ánh ngôn ngữ thực tế.

### L3 — Theo phương án đã trao đổi, Minh Đức duyệt bản dịch AI. Ai sẽ duyệt từng ngoại ngữ? Khi chưa có người duyệt thì xử lý thế nào?

Đã duyệt: Minh Đức chịu trách nhiệm duyệt bản dịch AI; bản nháp chưa được tự xuất bản. ADMIN vận hành xuất bản sau duyệt; chưa duyệt thì dùng tiếng Việt.
Còn chốt: đầu mối từng ngoại ngữ, thời hạn và số vòng sửa.

### L4 — Trang quản trị dành cho nhân viên cần tiếng Việt hay cũng phải đa ngôn ngữ?

Đã duyệt: quản trị bằng tiếng Việt; ADMIN chỉnh sửa và quản lý trạng thái nội dung của cả 5 ngôn ngữ. Website chỉ có loại tài khoản ADMIN.
Còn chốt: số tài khoản ADMIN.

### H1 — Bộ phận nào tiếp nhận từng loại: nhu cầu doanh nghiệp, liên hệ chung, ứng tuyển lao động, ứng tuyển nội bộ, tư vấn tuyển sinh và hồ sơ tuyển sinh?

Đã duyệt: ADMIN tiếp nhận 6 nhóm biểu mẫu. Marketing điều phối nghiệp vụ với kinh doanh, tuyển dụng, nhân sự và tuyển sinh; các bộ phận không có loại tài khoản riêng trên website. Hồ sơ có thông tin người/bộ phận phụ trách.
Còn chốt: cách chuyển giao công việc ngoài website.

### H2 — Hồ sơ mới được giao cho nhân viên bằng cách nào: quản lý phân công, nhân viên tự nhận, hay hệ thống tự chia theo KCN/khu vực/tin tuyển?

Đã duyệt: phân công thủ công, cho phép chuyển người phụ trách và ghi lịch sử. Chỉ có loại tài khoản ADMIN; người/bộ phận phụ trách là thông tin nghiệp vụ, không tạo phân quyền nhân viên. Không tự chia theo KCN/khu vực.
Còn chốt: số tài khoản ADMIN.

### H3 — Cần theo dõi trạng thái nào ở từng luồng?

Đã duyệt trạng thái theo luồng:
• B2B: Mới → Đã liên hệ → Đang làm rõ nhu cầu → Đã gửi phương án/báo giá → Hoàn tất/Không tiếp tục.
• Tuyển lao động: Mới → Đã liên hệ → Hẹn phỏng vấn → Đã đi làm; thêm Không phù hợp/Không liên lạc được/Ứng viên rút.
• Tuyển nội bộ: Mới → Sàng lọc → Phỏng vấn → Đã nhận việc/Không đạt/Ứng viên rút.
• Tư vấn tuyển sinh: Mới → Đã liên hệ → Đã tư vấn → Hoàn tất/Không tiếp tục.
• Hồ sơ tuyển sinh: Mới → Đang kiểm tra → Cần bổ sung → Đã chuyển đơn vị liên kết → Hoàn tất/Không tiếp tục.
• Liên hệ chung: Mới → Đang xử lý → Đã hoàn tất.
Lưu ý: “đã chuyển/hoàn tất” không tự đồng nghĩa được trường xét nhận.

### H4 — Ai được xem, tải và xuất hồ sơ?

Đã duyệt: chỉ có loại tài khoản ADMIN, thay thế mô hình nhiều vai trò. ADMIN quản lý nội dung, 6 nhóm hồ sơ, tệp, gộp trùng, xuất thủ công, lịch xuất hằng ngày và kết nối Google Sheets. Xóa/xuất có lưu vết.
Còn chốt: số tài khoản ADMIN; tài khoản và quyền trên Google Sheets đích.

### H5 — Nhân viên nhận thông báo ở đâu?

Đã duyệt: thông báo cho ADMIN trong quản trị và qua email. Khi lịch xuất bị chặn, thông báo nguyên nhân; ADMIN xử lý rồi tự bấm xuất thủ công. Có nút kiểm tra lại kết nối Google Sheets; kiểm tra trùng độc lập với kết nối. Zalo/ERP chưa nằm trong tích hợp đã chốt.

### T1 — Thế nào được coi là hồ sơ trùng?

Đã duyệt: khóa trùng là số điện thoại + tin tuyển; cùng số nhưng khác tin không bị coi là trùng theo khóa này. ADMIN xử lý nhóm trùng bằng gộp dữ liệu.
Còn đặc tả: chuẩn hóa số điện thoại, mã tin ổn định và quy tắc cho biểu mẫu không gắn tin tuyển.

### T2 — Khi phát hiện trùng, hệ thống phải làm gì?

Đã duyệt: ADMIN gộp dữ liệu hồ sơ trùng trước xuất. Cả xuất thủ công và tự động bị chặn khi còn trùng chưa xử lý. Lịch bị chặn phải báo ADMIN; sau xử lý ADMIN xuất thủ công.
Còn chốt: chọn bản chính/giá trị xung đột, lưu vết gộp và chặn toàn đợt hay từng biểu mẫu. Câu trả lời nguồn hiện bị cắt cuối; phần hoàn chỉnh này đối chiếu xác nhận trực tiếp trong chat 19/11.

### T3 — Cần xuất định dạng và phạm vi nào?

Đã duyệt: có nút xuất thủ công và lịch xuất hằng ngày do ADMIN cấu hình. Xuất tự động vào Google Sheets đích, mỗi biểu mẫu một tab (6 tab). Trước xuất kiểm tra trùng và kết nối; bị chặn thì báo ADMIN, xử lý rồi xuất thủ công. Có nút kiểm tra lại kết nối.
Còn chốt: file/tài khoản đích, múi giờ, phạm vi xuất, ghi thêm/cập nhật và định dạng của nút thủ công.

### T4 — Bản xuất cần cột nào và nguồn đăng ký chi tiết tới đâu?

Đã duyệt: dữ liệu có mã hồ sơ, ngày gửi, loại/liên hệ, điện thoại/email nếu có, trạng thái, phụ trách, nguồn/chiến dịch và ghi chú; bổ sung cột phù hợp từng biểu mẫu như mã tin/KCN, nhu cầu B2B hoặc chương trình. Mỗi biểu mẫu có tab riêng. Không xác định nguồn thì ghi rõ; nhấp liên hệ và kết quả đi làm đo riêng.
Còn chốt: cách cập nhật dòng sau gộp hoặc chạy lại.

### F01 — Nhu cầu cung ứng doanh nghiệp

Đã duyệt theo tab Trường biểu mẫu: bắt buộc người liên hệ, điện thoại, địa điểm, ghi chú; tên doanh nghiệp, email, vị trí, số lượng, ca, ngày cần người tùy chọn. ADMIN tiếp nhận, xuất tab F01.
Chưa bổ sung trường tệp; cách nhập nhiều vị trí cần chốt nếu muốn thêm.

### F02 — Liên hệ chung

Đã duyệt: bắt buộc họ tên và điện thoại; email/nội dung tùy chọn. Không có nội dung thì nhận yêu cầu gọi lại. ADMIN quản lý, xuất tab F02.
Còn chốt quy tắc trùng cho biểu mẫu không có tin tuyển.

### F03 — Ứng tuyển việc làm

Đã duyệt: họ tên, điện thoại và mã tin bắt buộc; không bắt buộc CV hay trường bổ sung chưa duyệt. ADMIN gộp trùng theo số điện thoại + tin trước xuất tab F03; tin đóng/hết hạn dừng nhận ứng tuyển.
Còn đặc tả: cách lấy mã tin và hiển thị tin hết hạn.

### F04 — Ứng tuyển nội bộ

Đã duyệt theo lựa chọn mới tại tab Trường biểu mẫu: họ tên, điện thoại, vị trí bắt buộc; email và CV tùy chọn, thay yêu cầu CV bắt buộc trước đây. ADMIN tiếp nhận; tệp theo F07; xuất tab F04.
Còn chốt: khóa trùng theo mã vị trí nội bộ.

### F05 — Tư vấn tuyển sinh

Đã duyệt: họ tên, điện thoại bắt buộc; chương trình tùy chọn, có mục Khác/Chưa rõ chương trình để nhập nhu cầu. ADMIN quản lý, xuất tab F05.
Còn chốt: quy tắc trùng ngoài tin tuyển; điền sẵn chương trình là đề xuất.

### F06 — Nộp hồ sơ tuyển sinh

Đã duyệt: họ tên, điện thoại bắt buộc; email, chương trình và tệp tùy chọn. Tiếp nhận đăng ký sơ bộ; ADMIN yêu cầu bổ sung khi thiếu, không tự xác nhận trúng tuyển. Xuất tab F06; tệp theo F07.
Còn chốt: giấy tờ theo trường/chương trình và quy tắc trùng không có tin tuyển.

### F07 — Tệp đính kèm được phép như thế nào?

Đã duyệt: nhận JPG/JPEG/PNG/PDF/DOC/DOCX; tối đa 3 tệp/lượt, 5 MB/tệp, tổng 15 MB. Tệp lưu riêng, kiểm tra định dạng/dung lượng; ADMIN được tải, không tạo link công khai hoặc tự gửi tệp qua email.
Còn chốt: Google Sheets chứa mã tham chiếu hay loại thông tin tệp nào.

### F08 — Người dùng gửi trực tiếp hay cần tài khoản?

Đã duyệt: người dùng gửi trực tiếp, không cần tài khoản. Chỉ có loại tài khoản quản trị ADMIN. Hiển thị mã hồ sơ sau tiếp nhận; ADMIN hỗ trợ sửa/bổ sung với xác minh phù hợp. Có kiểm tra dữ liệu/chống spam/chống gửi lặp; không công khai hồ sơ chỉ qua số điện thoại.

### F09 — Lưu, xóa và theo dõi lịch sử hồ sơ ra sao?

Đã duyệt: lưu tập trung, không tự động xóa trong giai đoạn đầu; ADMIN quản lý và xóa có lưu vết (người thực hiện, thời điểm, lý do). Ghi lịch sử cập nhật/gộp/xuất; không giữ nội dung CV đã xóa trong log.
Còn chốt: thời hạn lưu, quan hệ hồ sơ sau gộp và cách phản ánh sửa/gộp/xóa sang Google Sheets.
