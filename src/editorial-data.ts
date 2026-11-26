type ArticleSection = { heading: string; paragraphs: string[]; bullets?: string[] };
export type Article = { slug: string; title: string; category: 'Dành cho người lao động' | 'Dành cho doanh nghiệp' | 'Góc nhân sự'; image?: string; date: string; excerpt: string; sections: ArticleSection[] };
export const articles: Article[] = [
  { slug: 'ho-so-xin-viec', title: 'Chuẩn bị hồ sơ xin việc tại nhà máy: bắt đầu từ đâu?', category: 'Dành cho người lao động', image: '/assets/minhduc-v16/recruitment-field.webp', date: '12/11/2026', excerpt: 'Một danh sách gọn gàng giúp bạn chuẩn bị hồ sơ và hỏi đúng thông tin trước ngày phỏng vấn.', sections: [
    { heading: 'Xác nhận yêu cầu của từng vị trí', paragraphs: ['Mỗi nhà máy có thể có quy trình và yêu cầu hồ sơ khác nhau. Trước khi chuẩn bị giấy tờ, hãy hỏi rõ vị trí ứng tuyển, địa điểm tiếp nhận và người phụ trách. Một danh sách được xác nhận giúp bạn tránh đi lại nhiều lần.'] },
    { heading: 'Sắp xếp thông tin dễ kiểm tra', paragraphs: ['Ghi lại họ tên, số điện thoại, khu vực sinh sống, kinh nghiệm và thời gian có thể bắt đầu làm việc. Nếu chưa có kinh nghiệm, bạn vẫn có thể giới thiệu khả năng học hỏi và điều kiện làm việc mong muốn.'], bullets: ['Thông tin liên hệ còn sử dụng được.', 'Giấy tờ theo danh sách do đơn vị tiếp nhận xác nhận.', 'Bản sao khi được yêu cầu; giữ gìn giấy tờ gốc.', 'Các câu hỏi về công việc, ca làm và điều kiện nhận việc.'] },
    { heading: 'Bảo vệ thông tin cá nhân', paragraphs: ['Chỉ gửi hồ sơ cho đầu mối đã được xác minh. Không công khai ảnh giấy tờ tùy thân trên mạng xã hội. Khi được yêu cầu cung cấp thêm dữ liệu, hãy hỏi mục đích sử dụng và cách lưu giữ.'] },
  ] },
  { slug: 'nhu-cau-tuyen-dung', title: 'Lập kế hoạch bổ sung lao động theo từng đợt sản xuất', category: 'Dành cho doanh nghiệp', image: '/assets/minhduc-working-60s.webp', date: '10/11/2026', excerpt: 'Làm rõ nhu cầu từ đầu giúp các bên phối hợp nhất quán trong quá trình tìm nguồn và tiếp nhận.', sections: [
    { heading: 'Bắt đầu từ kế hoạch vận hành', paragraphs: ['Doanh nghiệp nên xác định công đoạn cần bổ sung, số lượng dự kiến và thời điểm người lao động cần sẵn sàng làm việc. Nhu cầu càng cụ thể, việc trao đổi với đơn vị hỗ trợ tuyển dụng càng hiệu quả.'] },
    { heading: 'Thống nhất thông tin trước khi tìm nguồn', paragraphs: ['Một bản mô tả công việc ngắn, dễ hiểu có giá trị hơn các thông tin rời rạc. Nội dung nên được rà soát với bộ phận trực tiếp tiếp nhận.'], bullets: ['Địa điểm và phương án đi lại nếu có.', 'Ca làm, yêu cầu cơ bản và điều kiện làm việc.', 'Thu nhập, cách tính và các khoản cần làm rõ.', 'Đầu mối xác nhận lịch phỏng vấn, nhận việc.'] },
    { heading: 'Theo dõi và cập nhật theo giai đoạn', paragraphs: ['Đối chiếu số lượng quan tâm, lịch phỏng vấn và số lượng dự kiến tiếp nhận để cập nhật kế hoạch. Khi lịch sản xuất thay đổi, các bên cần thông báo sớm để tránh thông tin không đồng nhất.'] },
  ] },
  { slug: 'chon-cong-viec-phu-hop', title: 'Những câu hỏi nên làm rõ trước khi nhận việc', category: 'Dành cho người lao động', image: '/assets/minhduc-v18/field-team.webp', date: '08/11/2026', excerpt: 'Hiểu rõ công việc, thời gian và thu nhập giúp bạn lựa chọn công việc phù hợp hơn.', sections: [
    { heading: 'Công việc hằng ngày là gì?', paragraphs: ['Hãy hỏi về nhiệm vụ cụ thể, môi trường làm việc, yêu cầu thể lực và hướng dẫn ban đầu. Đừng ngại đề nghị giải thích lại những thuật ngữ chưa quen.'] },
    { heading: 'Thời gian và thu nhập được tính ra sao?', paragraphs: ['Làm rõ ca làm, ngày nghỉ, chính sách làm thêm và cách xác nhận chấm công. Với thu nhập, cần phân biệt khoản cố định, phụ cấp và khoản phụ thuộc điều kiện.'], bullets: ['Thời điểm trả lương và hình thức nhận lương.', 'Điều kiện áp dụng các khoản phụ cấp.', 'Thông tin hợp đồng và bảo hiểm cần được xác nhận.', 'Đầu mối hỗ trợ khi có thắc mắc.'] },
    { heading: 'Lưu lại các thông tin đã xác nhận', paragraphs: ['Giữ tin tuyển dụng và nội dung trao đổi cần thiết. Trước khi đi nhận việc, xác nhận địa chỉ, thời gian, giấy tờ cần mang và số điện thoại liên hệ.'] },
  ] },
  { slug: 'thong-tin-tuyen-dung-minh-bach', title: 'Thông tin tuyển dụng rõ ràng tạo nên kết nối tốt hơn', category: 'Góc nhân sự', date: '05/11/2026', excerpt: 'Sự nhất quán giữa tin tuyển dụng, tư vấn và thực tế tiếp nhận giúp giảm hiểu nhầm.', sections: [
    { heading: 'Một nguồn thông tin thống nhất', paragraphs: ['Tin tuyển dụng nên dùng ngôn ngữ dễ hiểu và nêu các điều kiện chính. Khi nhiều đầu mối cùng tham gia, cần thống nhất nội dung được phép chia sẻ và cách cập nhật thay đổi.'] },
    { heading: 'Trình bày đủ điều kiện', paragraphs: ['Thông tin thu nhập cần đi kèm cách tính hoặc điều kiện áp dụng. Các quyền lợi chưa được xác nhận không nên trình bày như cam kết. Điều này giúp ứng viên cân nhắc cơ hội phù hợp với nhu cầu thực tế.'] },
    { heading: 'Dành chỗ cho phản hồi', paragraphs: ['Một kênh để ứng viên hỏi lại thông tin giúp đơn vị tuyển dụng nhận ra những điểm chưa rõ. Các câu hỏi thường gặp có thể được bổ sung vào nội dung tuyển dụng ở lần cập nhật tiếp theo.'] },
  ] },
  { slug: 'don-tiep-lao-dong-moi', title: 'Chuẩn bị ngày đầu làm việc cho người lao động mới', category: 'Dành cho doanh nghiệp', image: '/assets/minhduc-meeting-10s.webp', date: '02/11/2026', excerpt: 'Từ lịch hẹn đến người hướng dẫn, những chi tiết nhỏ giúp ngày đầu diễn ra thuận lợi.', sections: [
    { heading: 'Trước ngày tiếp nhận', paragraphs: ['Gửi hướng dẫn dễ đọc về địa chỉ, cổng vào, giờ có mặt và giấy tờ cần mang. Xác nhận một đầu mối có thể liên hệ khi người lao động cần hỗ trợ.'] },
    { heading: 'Trong ngày đầu tiên', paragraphs: ['Dành thời gian giới thiệu công việc, quy định và các hướng dẫn an toàn cần thiết. Kiểm tra người lao động đã hiểu nội dung thay vì chỉ đưa tài liệu.'], bullets: ['Giới thiệu người quản lý hoặc hướng dẫn trực tiếp.', 'Hướng dẫn khu vực làm việc và sinh hoạt.', 'Làm rõ quy trình chấm công, báo nghỉ và hỏi đáp.', 'Ghi nhận các thắc mắc phát sinh.'] },
    { heading: 'Sau khi bắt đầu công việc', paragraphs: ['Một lần hỏi thăm ngắn giúp phát hiện khó khăn ban đầu. Thông tin phản hồi có thể hỗ trợ cải thiện quy trình tiếp nhận cho những đợt tiếp theo.'] },
  ] },
  { slug: 'an-toan-thong-tin-khi-tim-viec', title: 'Giữ an toàn thông tin cá nhân khi tìm việc trực tuyến', category: 'Góc nhân sự', date: '30/10/2026', excerpt: 'Xác minh nguồn tin, bảo vệ giấy tờ và thận trọng trước những yêu cầu chưa rõ ràng.', sections: [
    { heading: 'Kiểm tra nguồn tin', paragraphs: ['Đối chiếu tên doanh nghiệp, số liên hệ và địa điểm tuyển dụng. Khi có điều chưa rõ, hãy tìm kênh liên hệ chính thức và hỏi trực tiếp trước khi cung cấp hồ sơ.'] },
    { heading: 'Chia sẻ vừa đủ thông tin', paragraphs: ['Ở bước tư vấn ban đầu, chỉ chia sẻ thông tin cần cho việc trao đổi công việc. Không gửi mã xác thực, mật khẩu hoặc thông tin tài khoản ngân hàng cho người tuyển dụng.'] },
    { heading: 'Cẩn trọng với yêu cầu chuyển tiền', paragraphs: ['Nếu có yêu cầu đóng phí hoặc chuyển tiền, hãy làm rõ đơn vị nhận, mục đích, căn cứ và chứng từ. Dừng trao đổi khi gặp dấu hiệu đáng ngờ và xác minh qua một kênh độc lập.'] },
  ] },
];

export const categories = [
  ['all', 'Tất cả'], ['workers', 'Dành cho người lao động'],
  ['employers', 'Dành cho doanh nghiệp'], ['hr', 'Góc nhân sự'],
] as const;
