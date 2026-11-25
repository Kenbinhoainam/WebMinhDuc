import {company} from '../../company';
export const uploads = '/mirror/www.hr2b.com/wp-content/uploads/';
export const assets = {
  about: `${uploads}2025/10/about-banner.jpg`,
  services: `${uploads}2025/09/Staff-oursourcing.jpg`,
  recruitment: `${uploads}2025/10/Executive-Search-banner.jpg`,
  news: `${uploads}2025/09/Tin-tuc.jpg`,
  logistics: `${uploads}2025/08/staffing-logictis-1.jpg`,
  salary: `${uploads}2025/08/khung-luong-canh-tranh.jpg`,
  privacy: `${uploads}2026/11/bao-mat-thong-tin-tien-luong.jpg`,
  opportunity: `${uploads}2025/09/Co-hoi-viec-lam-scaled.jpg`,
  contact: `${uploads}2025/09/Lien-he.jpg`,
  service1: `${uploads}2025/09/GPNS-1.jpg`,
  service2: `${uploads}2025/09/GPNS-2.jpg`,
  service3: `${uploads}2025/09/GPNS-3.jpg`,
};
export const contact = company;

export type Service = {
  slug: string; title: string; short: string; image: string; banner: string; intro: string;
  audience: string; benefits: { title: string; text: string }[]; steps: string[];
  questions: [string, string][];
};
export const services: Service[] = [
  { slug: 'labor-supply', title: 'Giới thiệu & cung ứng nhân lực', short: 'Kết nối người lao động và doanh nghiệp theo nhu cầu thực tế.', image: assets.service2, banner: assets.services,
    intro: 'Minh Đức tiếp nhận nhu cầu tuyển dụng, tìm nguồn và giới thiệu người lao động phù hợp với công việc và điều kiện của doanh nghiệp.', audience: 'Dành cho doanh nghiệp cần bổ sung nhân lực và người lao động tìm kiếm cơ hội việc làm.',
    benefits: [{title:'Hiểu nhu cầu',text:'Làm rõ vị trí, địa điểm, số lượng và điều kiện làm việc.'},{title:'Kết nối phù hợp',text:'Tư vấn và sàng lọc dựa trên thông tin hai bên cung cấp.'},{title:'Đồng hành tiếp nhận',text:'Hướng dẫn các bước trao đổi, hồ sơ và nhận việc.'}], steps: ['Tiếp nhận nhu cầu','Thống nhất kế hoạch','Tìm nguồn và tư vấn','Kết nối, phỏng vấn','Theo dõi phản hồi'], questions: [['Cần cung cấp thông tin gì?', 'Vị trí, số lượng, địa điểm, ca làm và thời gian cần người sẽ giúp làm rõ nhu cầu.'],['Có hỗ trợ tuyển theo đợt không?', 'Có thể trao đổi kế hoạch theo từng đợt; khả năng đáp ứng được xác nhận sau khi tìm hiểu nhu cầu.'],['Chi phí được xác định thế nào?', 'Phạm vi và chi phí được thống nhất theo từng yêu cầu cụ thể.']] },
  { slug: 'labor-leasing', title: 'Cho thuê lao động', short: 'Trao đổi phương án nhân lực linh hoạt cho kế hoạch vận hành.', image: assets.service3, banner: assets.services,
    intro: 'Dịch vụ cho thuê lao động hướng đến nhu cầu nhân sự theo thời gian và phạm vi công việc được các bên thống nhất.', audience: 'Dành cho doanh nghiệp cần tìm hiểu phương án bổ sung nhân lực linh hoạt.',
    benefits: [{title:'Linh hoạt',text:'Trao đổi thời gian, quy mô và yêu cầu công việc.'},{title:'Rõ trách nhiệm',text:'Làm rõ phạm vi phối hợp và đầu mối quản lý.'},{title:'Theo dõi',text:'Cùng cập nhật tình hình triển khai và nhu cầu điều chỉnh.'}], steps: ['Tìm hiểu nhu cầu','Đánh giá phương án','Thống nhất điều kiện','Phối hợp triển khai','Theo dõi và phản hồi'], questions: [['Có thể thuê theo thời hạn không?', 'Thời hạn và khả năng đáp ứng được trao đổi theo nhu cầu cụ thể.'],['Điều kiện triển khai là gì?', 'Các bên cần xác minh ngành nghề, điều kiện pháp lý và trách nhiệm trước khi ký kết.'],['Chi phí được xác định thế nào?', 'Chi phí phụ thuộc vào phạm vi, thời gian và điều kiện đã thống nhất.']] },
  { slug: 'recruitment', title: 'Headhunt & lao động tay nghề', short: 'Tìm kiếm và kết nối nhân sự có kinh nghiệm, kỹ năng phù hợp.', image: assets.service1, banner: assets.recruitment,
    intro: 'Minh Đức hỗ trợ tìm kiếm ứng viên theo yêu cầu vị trí, kinh nghiệm và kỹ năng, từ lao động tay nghề đến các vai trò cần tuyển chọn chuyên sâu.', audience: 'Dành cho doanh nghiệp tìm nhân sự tay nghề và ứng viên muốn tìm cơ hội phù hợp.',
    benefits: [{title:'Rõ tiêu chí',text:'Thống nhất kỹ năng, kinh nghiệm và yêu cầu công việc.'},{title:'Tìm kiếm có định hướng',text:'Tiếp cận ứng viên theo chân dung vị trí.'},{title:'Phối hợp tuyển chọn',text:'Hỗ trợ trao đổi thông tin và sắp xếp các bước tiếp theo.'}], steps: ['Làm rõ vị trí','Xác định tiêu chí','Tìm kiếm ứng viên','Phối hợp tuyển chọn','Theo dõi kết quả'], questions: [['Vị trí nào có thể trao đổi?', 'Doanh nghiệp có thể chia sẻ yêu cầu cụ thể để đánh giá khả năng hỗ trợ.'],['Ứng viên cần chuẩn bị gì?', 'Thông tin về kinh nghiệm, kỹ năng và mong muốn giúp việc tư vấn phù hợp hơn.'],['Thời gian tuyển là bao lâu?', 'Thời gian phụ thuộc vào vị trí, thị trường và yêu cầu tuyển chọn.']] },
  { slug: 'college-admissions', title: 'Tuyển sinh cao đẳng & đại học', short: 'Tìm hiểu cơ hội học tập từ xa và chính quy.', image: assets.opportunity, banner: assets.about,
    intro: 'Minh Đức giới thiệu thông tin tuyển sinh và hỗ trợ người học tìm hiểu hình thức học, điều kiện và các bước chuẩn bị hồ sơ.', audience: 'Dành cho người quan tâm đến các chương trình cao đẳng, đại học từ xa hoặc chính quy.',
    benefits: [{title:'Chọn hướng học',text:'Tìm hiểu hình thức và lĩnh vực phù hợp với mục tiêu.'},{title:'Được tư vấn',text:'Trao đổi câu hỏi trước khi quyết định đăng ký.'},{title:'Chuẩn bị hồ sơ',text:'Tìm hiểu các bước và giấy tờ cần xác minh.'}], steps: ['Tìm hiểu chương trình','Chọn hình thức học','Nhận tư vấn','Chuẩn bị hồ sơ','Xác nhận thông tin'], questions: [['Có những hình thức nào?', 'Trang tuyển sinh giới thiệu các ví dụ từ xa và chính quy.'],['Thông tin chương trình đã chính thức chưa?', 'Các chương trình trên prototype là dữ liệu minh họa, chưa gắn với trường cụ thể.'],['Làm sao đăng ký?', 'Bạn có thể dùng biểu mẫu tư vấn hoặc hồ sơ minh họa trên trang tuyển sinh.']] },
  { slug: 'hr-consulting', title: 'Setup tổ chức & phần mềm doanh nghiệp', short: 'Cùng làm rõ cấu trúc, quy trình và nhu cầu phần mềm quản lý.', image: assets.service3, banner: assets.about,
    intro: 'Minh Đức trao đổi cùng doanh nghiệp về thiết lập tổ chức, quy trình làm việc và nhu cầu phần mềm hỗ trợ vận hành.', audience: 'Dành cho doanh nghiệp muốn rà soát tổ chức và công cụ quản lý.',
    benefits: [{title:'Hiểu hiện trạng',text:'Lắng nghe mục tiêu, nhân sự và quy trình hiện có.'},{title:'Rõ phương án',text:'Xác định phạm vi, ưu tiên và cách phối hợp.'},{title:'Hỗ trợ vận hành',text:'Trao đổi nhu cầu phần mềm phù hợp với thực tế.'}], steps: ['Lắng nghe hiện trạng','Làm rõ mục tiêu','Trao đổi phương án','Thống nhất phạm vi','Theo dõi và điều chỉnh'], questions: [['Dịch vụ bao gồm những gì?', 'Phạm vi tổ chức, quy trình và phần mềm được thống nhất theo nhu cầu cụ thể.'],['Có thể trao đổi trước không?', 'Có. Hãy liên hệ và trình bày ngắn gọn vấn đề cần hỗ trợ.'],['Có thay thế tư vấn pháp lý không?', 'Nội dung tư vấn tổng quát không thay thế ý kiến pháp lý chuyên biệt.']] },
];

