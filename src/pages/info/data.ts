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
};
export const contact = company;

export const industrialCampus = '/assets/minhduc-v18/industrial-campus.webp';
export const learningSpace = '/assets/minhduc-v18/learning-space.webp';
export const campusAlt = 'Phối cảnh minh họa khu công nghiệp';
export const learningAlt = 'Phối cảnh minh họa không gian học tập';
export type Service = {
  slug: string; title: string; short: string; image: string; alt: string; need: string; prompt: string; intro: string;
  steps: string[];
  questions: [string, string][];
};
export const services: Service[] = [
  { slug: 'labor-supply', title: 'Giới thiệu & cung ứng nhân lực', short: 'Kết nối người lao động và doanh nghiệp theo nhu cầu thực tế.', image: '/assets/minhduc-v16/recruitment-event.webp', alt: 'Đại diện tham gia hoạt động kết nối việc làm', need: 'Bổ sung người cho đợt sản xuất', prompt: 'Bạn cần bao nhiêu người, tại đâu và khi nào?',
    intro: 'Minh Đức tiếp nhận nhu cầu tuyển dụng, tìm nguồn và giới thiệu người lao động phù hợp với công việc và điều kiện của doanh nghiệp.',
    steps: ['Tiếp nhận nhu cầu','Thống nhất kế hoạch','Tìm nguồn và tư vấn','Kết nối, phỏng vấn','Theo dõi phản hồi'], questions: [['Cần cung cấp thông tin gì?', 'Vị trí, số lượng, địa điểm, ca làm và thời gian cần người sẽ giúp làm rõ nhu cầu.'],['Có hỗ trợ tuyển theo đợt không?', 'Có thể trao đổi kế hoạch theo từng đợt; khả năng đáp ứng được xác nhận sau khi tìm hiểu nhu cầu.'],['Chi phí được xác định thế nào?', 'Phạm vi và chi phí được thống nhất theo từng yêu cầu cụ thể.']] },
  { slug: 'labor-leasing', title: 'Cho thuê lao động', short: 'Trao đổi phương án nhân lực linh hoạt cho kế hoạch vận hành.', image: industrialCampus, alt: campusAlt, need: 'Bổ sung nhân lực theo thời hạn', prompt: 'Ca nào cần bổ sung và trong thời gian bao lâu?',
    intro: 'Dịch vụ cho thuê lao động hướng đến nhu cầu nhân sự theo thời gian và phạm vi công việc được các bên thống nhất.',
    steps: ['Tìm hiểu nhu cầu','Đánh giá phương án','Thống nhất điều kiện','Phối hợp triển khai','Theo dõi và phản hồi'], questions: [['Có thể thuê theo thời hạn không?', 'Thời hạn và khả năng đáp ứng được trao đổi theo nhu cầu cụ thể.'],['Điều kiện triển khai là gì?', 'Các bên cần xác minh ngành nghề, điều kiện pháp lý và trách nhiệm trước khi ký kết.'],['Chi phí được xác định thế nào?', 'Chi phí phụ thuộc vào phạm vi, thời gian và điều kiện đã thống nhất.']] },
  { slug: 'recruitment', title: 'Headhunt & lao động tay nghề', short: 'Tìm kiếm và kết nối nhân sự có kinh nghiệm, kỹ năng phù hợp.', image: '/assets/minhduc-working-60s.webp', alt: 'Trao đổi công việc trong phim giới thiệu Minh Đức', need: 'Tuyển người có kỹ năng chuyên biệt', prompt: 'Vị trí này cần kiểm tra kỹ năng gì?',
    intro: 'Minh Đức hỗ trợ tìm kiếm ứng viên theo yêu cầu vị trí, kinh nghiệm và kỹ năng, từ lao động tay nghề đến các vai trò cần tuyển chọn chuyên sâu.',
    steps: ['Làm rõ vị trí','Xác định tiêu chí','Tìm kiếm ứng viên','Phối hợp tuyển chọn','Theo dõi kết quả'], questions: [['Vị trí nào có thể trao đổi?', 'Doanh nghiệp có thể chia sẻ yêu cầu cụ thể để đánh giá khả năng hỗ trợ.'],['Ứng viên cần chuẩn bị gì?', 'Thông tin về kinh nghiệm, kỹ năng và mong muốn giúp việc tư vấn phù hợp hơn.'],['Thời gian tuyển là bao lâu?', 'Thời gian phụ thuộc vào vị trí, thị trường và yêu cầu tuyển chọn.']] },
  { slug: 'college-admissions', title: 'Tuyển sinh cao đẳng & đại học', short: 'Tìm hiểu cơ hội học tập từ xa và chính quy.', image: learningSpace, alt: learningAlt, need: 'Tìm hướng học phù hợp', prompt: 'Bạn có thể dành thời gian nào cho việc học?',
    intro: 'Minh Đức giới thiệu thông tin tuyển sinh và hỗ trợ người học tìm hiểu hình thức học, điều kiện và các bước chuẩn bị hồ sơ.',
    steps: ['Tìm hiểu chương trình','Chọn hình thức học','Nhận tư vấn','Chuẩn bị hồ sơ','Xác nhận thông tin'], questions: [['Có những hình thức nào?', 'Trang tuyển sinh giới thiệu các ví dụ từ xa và chính quy.'],['Thông tin chương trình đã chính thức chưa?', 'Các chương trình trên prototype là dữ liệu minh họa, chưa gắn với trường cụ thể.'],['Làm sao đăng ký?', 'Bạn có thể dùng biểu mẫu tư vấn hoặc hồ sơ minh họa trên trang tuyển sinh.']] },
  { slug: 'hr-consulting', title: 'Setup tổ chức & phần mềm doanh nghiệp', short: 'Cùng làm rõ cấu trúc, quy trình và nhu cầu phần mềm quản lý.', image: '/assets/editorial/business-team.webp', alt: 'Minh họa buổi trao đổi về vận hành', need: 'Cải thiện quy trình và công cụ quản lý', prompt: 'Khâu nào đang phải nhập lại dữ liệu?',
    intro: 'Minh Đức trao đổi cùng doanh nghiệp về thiết lập tổ chức, quy trình làm việc và nhu cầu phần mềm hỗ trợ vận hành.',
    steps: ['Lắng nghe hiện trạng','Làm rõ mục tiêu','Trao đổi phương án','Thống nhất phạm vi','Theo dõi và điều chỉnh'], questions: [['Dịch vụ bao gồm những gì?', 'Phạm vi tổ chức, quy trình và phần mềm được thống nhất theo nhu cầu cụ thể.'],['Có thể trao đổi trước không?', 'Có. Hãy liên hệ và trình bày ngắn gọn vấn đề cần hỗ trợ.'],['Có thay thế tư vấn pháp lý không?', 'Nội dung tư vấn tổng quát không thay thế ý kiến pháp lý chuyên biệt.']] },
];


export const consultingTopics = [{title:'Hiểu hiện trạng',text:'Lắng nghe mục tiêu, nhân sự và quy trình hiện có.'},{title:'Rõ phương án',text:'Xác định phạm vi, ưu tiên và cách phối hợp.'},{title:'Hỗ trợ vận hành',text:'Trao đổi nhu cầu phần mềm phù hợp với thực tế.'}];
