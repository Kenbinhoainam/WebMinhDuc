export type Job = {
  id: string;
  slug: string;
  title: string;
  location: string;
  type: string;
  salary: string;
  category: string;
  tags: string[];
  internal?: boolean;
  industrialPark?: string;
  skillLevel?: string;
  employmentType?: string;
  shift?: string;
  schedule?: string;
  status?: string;
  intro: string;
  tasks: string[];
  requirements: string[];
  benefits: string[];
};

export const jobs: Job[] = [
  { id: 'MD001', slug: 'cong-nhan-lap-rap-bac-ninh', title: 'Công nhân lắp ráp linh kiện', location: 'Bắc Ninh', type: 'Toàn thời gian', salary: '8–11 triệu/tháng', category: 'Sản xuất', tags: ['Được đào tạo', 'Làm việc theo ca'], intro: 'Bắt đầu công việc trong môi trường sản xuất có quy trình rõ ràng. Vị trí minh họa phù hợp với người muốn tìm việc ổn định và được hướng dẫn từ đầu.', tasks: ['Lắp ráp linh kiện theo hướng dẫn tại từng công đoạn.', 'Kiểm tra sản phẩm sau lắp ráp và báo cáo các điểm bất thường.', 'Sắp xếp khu vực làm việc, tuân thủ quy trình an toàn.'], requirements: ['Cẩn thận, có trách nhiệm và sẵn sàng học việc.', 'Có thể làm việc theo ca đã thống nhất.', 'Không yêu cầu kinh nghiệm; được hướng dẫn quy trình trước khi làm việc.'], benefits: ['Đào tạo thao tác và an toàn trước khi bắt đầu.', 'Lịch làm việc, thu nhập và phụ cấp được trao đổi rõ trước khi nhận việc.', 'Có nhân sự tư vấn hỗ trợ trong quá trình tìm hiểu công việc.'] },
  { id: 'MD002', slug: 'kiem-tra-chat-luong-bac-giang', title: 'Nhân viên kiểm tra chất lượng', location: 'Bắc Giang', type: 'Toàn thời gian', salary: '9–12 triệu/tháng', category: 'Chất lượng', tags: ['Kiểm hàng', 'Cẩn thận'], intro: 'Tham gia kiểm tra chất lượng sản phẩm ở từng công đoạn, phát hiện lỗi và góp phần duy trì chất lượng đầu ra của dây chuyền.', tasks: ['Kiểm tra ngoại quan, đối chiếu sản phẩm với mẫu hướng dẫn.', 'Phân loại sản phẩm đạt và không đạt theo tiêu chuẩn.', 'Ghi nhận số liệu và bàn giao kết quả cho người phụ trách ca.'], requirements: ['Quan sát tốt, làm việc cẩn thận và trung thực.', 'Có khả năng đọc, ghi chép biểu mẫu đơn giản.', 'Kinh nghiệm kiểm hàng là lợi thế, không phải yêu cầu bắt buộc.'], benefits: ['Được hướng dẫn cách nhận diện lỗi và sử dụng biểu mẫu.', 'Cơ hội làm quen với quy trình quản lý chất lượng.', 'Thông tin về chế độ và ca làm được tư vấn trước khi quyết định.'] },
  { id: 'MD003', slug: 'nhan-vien-kho-thai-nguyen', title: 'Nhân viên kho & đóng gói', location: 'Thái Nguyên', type: 'Toàn thời gian', salary: '8–10 triệu/tháng', category: 'Kho vận', tags: ['Kho vận', 'Phối hợp nhóm'], intro: 'Công việc minh họa dành cho người yêu thích sự ngăn nắp, phối hợp tốt và muốn phát triển trong lĩnh vực kho vận.', tasks: ['Nhận, kiểm đếm và sắp xếp hàng hóa đúng khu vực.', 'Soạn hàng, đóng gói và đối chiếu thông tin giao nhận.', 'Giữ khu vực kho gọn gàng, báo cáo chênh lệch khi phát hiện.'], requirements: ['Có khả năng kiểm đếm chính xác và phối hợp với đồng nghiệp.', 'Tuân thủ quy định an toàn trong kho.', 'Sẵn sàng học cách sử dụng thiết bị, biểu mẫu quản lý kho.'], benefits: ['Được đào tạo quy trình xuất nhập hàng.', 'Môi trường làm việc theo nhóm, có hướng dẫn trong thời gian đầu.', 'Chi tiết chế độ được xác nhận khi tư vấn vị trí thực tế.'] },
  { id: 'MD004', slug: 'van-hanh-may-quang-ninh', title: 'Công nhân vận hành máy', location: 'Quảng Ninh', type: 'Toàn thời gian', salary: '9–13 triệu/tháng', category: 'Sản xuất', tags: ['Vận hành', 'Đào tạo kỹ năng'], intro: 'Tìm hiểu công việc vận hành thiết bị sản xuất, theo dõi thông số và phối hợp cùng đội kỹ thuật để bảo đảm hoạt động ổn định.', tasks: ['Vận hành máy theo quy trình và phạm vi được phân công.', 'Theo dõi thông số, phát hiện và báo cáo dấu hiệu bất thường.', 'Vệ sinh thiết bị, bàn giao tình trạng máy sau mỗi ca.'], requirements: ['Có tinh thần kỷ luật, ưu tiên an toàn trong mọi thao tác.', 'Có thể làm việc theo ca và theo dõi thông số cơ bản.', 'Ưu tiên người đã học nghề hoặc từng làm việc tại nhà máy.'], benefits: ['Hướng dẫn sử dụng thiết bị trước khi thực hành.', 'Có cơ hội nâng cao tay nghề vận hành.', 'Được tư vấn rõ yêu cầu sức khỏe và lịch ca trước khi nhận việc.'] },
  { id: 'MD005', slug: 'ky-thuat-bao-tri-bac-ninh', title: 'Kỹ thuật viên bảo trì', location: 'Bắc Ninh', type: 'Toàn thời gian', salary: '11–15 triệu/tháng', category: 'Kỹ thuật', tags: ['Có tay nghề', 'Cơ điện'], intro: 'Vị trí minh họa cho ứng viên có nền tảng cơ điện, mong muốn làm việc cùng đội kỹ thuật và phát triển kỹ năng bảo trì thiết bị.', tasks: ['Kiểm tra, bảo dưỡng thiết bị theo lịch và hướng dẫn kỹ thuật.', 'Phối hợp xác định nguyên nhân sự cố và thực hiện sửa chữa trong phạm vi chuyên môn.', 'Ghi lại lịch sử bảo trì, vật tư sử dụng và đề xuất cải tiến.'], requirements: ['Có kiến thức nghề về điện, cơ khí hoặc cơ điện.', 'Đọc hiểu tài liệu kỹ thuật cơ bản và tuân thủ quy trình an toàn.', 'Có tinh thần hợp tác, chủ động báo cáo khi phát hiện nguy cơ.'], benefits: ['Cơ hội tích lũy kinh nghiệm trên thiết bị thực tế.', 'Được trao đổi rõ phạm vi công việc và yêu cầu chuyên môn.', 'Thu nhập và chế độ được thỏa thuận theo vị trí thực tế.'] },
  { id: 'MD006', slug: 'dong-goi-thoi-vu-bac-giang', title: 'Nhân viên đóng gói thời vụ', location: 'Bắc Giang', type: 'Thời vụ', salary: '7–9 triệu/tháng', category: 'Sản xuất', tags: ['Thời vụ', 'Không cần kinh nghiệm'], intro: 'Lựa chọn minh họa cho người tìm công việc trong một giai đoạn cụ thể, với các thao tác đóng gói đơn giản và hướng dẫn trực tiếp.', tasks: ['Đóng gói, dán nhãn sản phẩm theo quy cách.', 'Kiểm đếm và sắp xếp thành phẩm theo đơn hàng.', 'Giữ vệ sinh khu vực làm việc và tuân thủ hướng dẫn an toàn.'], requirements: ['Cẩn thận, đúng giờ và hoàn thành lịch làm việc đã thống nhất.', 'Có thể phối hợp theo nhóm.', 'Không yêu cầu kinh nghiệm đóng gói trước đó.'], benefits: ['Được hướng dẫn công việc ngay từ đầu.', 'Thời hạn công việc được trao đổi trước khi bắt đầu.', 'Cách tính thu nhập và lịch thanh toán được xác nhận khi tư vấn thực tế.'] },
  { id: 'MD007', slug: 'chuyen-vien-tuyen-dung-bac-ninh', title: 'Chuyên viên tuyển dụng', location: 'Bắc Ninh', type: 'Toàn thời gian', salary: '9–14 triệu/tháng', category: 'Tuyển dụng nội bộ', tags: ['Nội bộ', 'Phát triển nghề nghiệp'], internal: true, intro: 'Cùng Minh Đức kết nối người lao động với cơ hội phù hợp. Đây là vị trí nội bộ minh họa để trải nghiệm quy trình tuyển dụng trên prototype.', tasks: ['Tiếp nhận nhu cầu và tư vấn thông tin công việc cho ứng viên.', 'Sắp xếp lịch trao đổi, theo dõi tiến độ và hỗ trợ ứng viên.', 'Cập nhật nội dung tuyển dụng theo thông tin đã được xác nhận.'], requirements: ['Giao tiếp rõ ràng, biết lắng nghe và tôn trọng ứng viên.', 'Sử dụng các công cụ văn phòng cơ bản.', 'Có trách nhiệm với thông tin cá nhân và tính chính xác của nội dung tư vấn.'], benefits: ['Được hướng dẫn quy trình tư vấn và chăm sóc ứng viên.', 'Cơ hội phát triển kỹ năng tuyển dụng và phối hợp khách hàng.', 'Môi trường khuyến khích chia sẻ và hỗ trợ đồng đội.'] },
  { id: 'MD008', slug: 'cong-tac-vien-tuyen-dung-quang-ninh', title: 'Cộng tác viên tuyển dụng', location: 'Quảng Ninh', type: 'Cộng tác viên', salary: 'Trao đổi khi tư vấn', category: 'Tuyển dụng nội bộ', tags: ['Nội bộ', 'Cộng tác linh hoạt'], internal: true, intro: 'Vị trí cộng tác minh họa dành cho người có khả năng kết nối cộng đồng, mong muốn hỗ trợ người lao động tiếp cận thông tin việc làm rõ ràng.', tasks: ['Giới thiệu thông tin việc làm đã được xác nhận tới người có nhu cầu.', 'Kết nối ứng viên với đội tư vấn phụ trách.', 'Theo dõi phản hồi và hỗ trợ giải đáp trong phạm vi được hướng dẫn.'], requirements: ['Truyền đạt trung thực, không tự đưa ra cam kết về việc làm hoặc thu nhập.', 'Có kỹ năng giao tiếp và sử dụng điện thoại, mạng xã hội.', 'Tôn trọng quyền riêng tư và sự đồng ý của ứng viên.'], benefits: ['Có tài liệu và nhân sự hỗ trợ tư vấn.', 'Hình thức cộng tác, phạm vi và quyền lợi được trao đổi riêng.', 'Cơ hội tích lũy kinh nghiệm trong lĩnh vực nhân lực.'] },
];

// Synthetic attributes for the prototype; industrial parks are not verified operating data.
const jobAttributes = [
  ['KCN Yên Phong', 'Phổ thông', 'Chính thức', 'Ngày', 'Xoay ca', 'active'],
  ['KCN Tân Hưng', 'Phổ thông', 'Chính thức', 'Ngày', 'Cố định', 'active'],
  ['KCN Sông Công', 'Phổ thông', 'Chính thức', 'Ngày', 'Cố định', 'active'],
  ['KCN Đông Mai', 'Tay nghề', 'Chính thức', 'Đêm', 'Xoay ca', 'active'],
  ['KCN Yên Phong', 'Tay nghề', 'Chính thức', 'Ngày', 'Cố định', 'closed'],
  ['KCN Tân Hưng', 'Phổ thông', 'Thời vụ', 'Đêm', 'Xoay ca', 'active'],
  ['', 'Tay nghề', 'Chính thức', 'Ngày', 'Cố định', 'active'],
  ['', 'Phổ thông', 'Thời vụ', 'Ngày', 'Cố định', 'active'],
];
jobs.forEach((job, index) => {
  const [industrialPark, skillLevel, employmentType, shift, schedule, status] = jobAttributes[index];
  Object.assign(job, { industrialPark, skillLevel, employmentType, shift, schedule, status });
});

