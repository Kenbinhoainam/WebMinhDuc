import {company} from '../company';

export const ORIGIN = 'https://minhduc-prototype-sprint1.kenbinhoainam.chatgpt.site';
type Page = {path:string; title:string; description:string};
const page = (path:string,title:string,description:string):Page => ({path,title,description});
export const pages:Page[] = [
 page('/', 'Kết nối nhân lực, kiến tạo tương lai', 'Minh Đức Vina đồng hành cùng doanh nghiệp và người lao động qua giải pháp nhân lực và kết nối việc làm.'),
 page('/about-us','Về Minh Đức','Tìm hiểu tầm nhìn, sứ mệnh và giá trị của Minh Đức Vina trong hành trình kết nối nhân lực.'),
 page('/services','Giải pháp nhân lực','Khám phá năm nhóm dịch vụ nhân lực, tuyển sinh và tổ chức doanh nghiệp của Minh Đức.'),
 page('/services/labor-supply','Giới thiệu & cung ứng nhân lực','Tìm hiểu cách Minh Đức trao đổi nhu cầu và kết nối nguồn lao động với doanh nghiệp.'),
 page('/services/recruitment','Headhunt & lao động tay nghề','Kết nối doanh nghiệp với nhân sự có kinh nghiệm và kỹ năng phù hợp từng vị trí.'),
 page('/services/hr-consulting','Setup tổ chức & phần mềm doanh nghiệp','Tìm hiểu giải pháp tổ chức, quy trình và phần mềm hỗ trợ vận hành doanh nghiệp.'),
 page('/services/labor-leasing','Cho thuê lao động','Trao đổi phương án nhân lực linh hoạt theo thời gian và phạm vi công việc.'),
 page('/services/college-admissions','Tuyển sinh cao đẳng & đại học','Khám phá hình thức học từ xa, chính quy và các bước tư vấn tuyển sinh minh họa.'),
 page('/jobs','Cơ hội việc làm','Khám phá các vị trí việc làm minh họa theo địa điểm, ngành nghề và hình thức làm việc.'),
 ...[
 ['cong-nhan-lap-rap-bac-ninh','Công nhân lắp ráp linh kiện'],['kiem-tra-chat-luong-bac-giang','Nhân viên kiểm tra chất lượng'],['nhan-vien-kho-thai-nguyen','Nhân viên kho và đóng gói'],['van-hanh-may-quang-ninh','Công nhân vận hành máy'],['ky-thuat-bao-tri-bac-ninh','Kỹ thuật viên bảo trì'],['dong-goi-thoi-vu-bac-giang','Nhân viên đóng gói thời vụ'],['chuyen-vien-tuyen-dung-bac-ninh','Chuyên viên tuyển dụng'],['cong-tac-vien-tuyen-dung-quang-ninh','Cộng tác viên tuyển dụng']
 ].map(([slug,title])=>page('/jobs/'+slug,title,`Tìm hiểu công việc, yêu cầu và quyền lợi của vị trí ${title.toLowerCase()} trong bản minh họa của Minh Đức.`)),
 page('/saved-jobs','Việc làm đã lưu','Xem các vị trí bạn đã đánh dấu trên thiết bị và tiếp tục tìm hiểu cơ hội việc làm.'),
 page('/careers','Gia nhập Minh Đức','Khám phá môi trường làm việc và các cơ hội nội bộ minh họa tại Minh Đức.'),
 page('/news','Tin tức và cẩm nang','Đọc những gợi ý về tìm việc, tuyển dụng và nhân sự dành cho người lao động và doanh nghiệp.'),
 ...[
 ['ho-so-xin-viec','Chuẩn bị hồ sơ xin việc tại nhà máy'],['nhu-cau-tuyen-dung','Lập kế hoạch bổ sung lao động'],['chon-cong-viec-phu-hop','Những câu hỏi trước khi nhận việc'],['thong-tin-tuyen-dung-minh-bach','Thông tin tuyển dụng rõ ràng'],['don-tiep-lao-dong-moi','Chuẩn bị ngày đầu làm việc'],['an-toan-thong-tin-khi-tim-viec','An toàn thông tin khi tìm việc']
 ].map(([slug,title])=>page('/news/'+slug,title,`Cẩm nang Minh Đức: ${title.toLowerCase()} với những gợi ý thực tế cho hành trình việc làm.`)),
 page('/events','Sự kiện','Khám phá các chương trình kết nối việc làm và trao đổi nhân lực minh họa của Minh Đức.'),
 ...[['ngay-hoi-ket-noi-viec-lam','Ngày hội kết nối việc làm'],['toa-dam-ke-hoach-nhan-luc','Trao đổi kế hoạch nhân lực'],['hanh-trang-tim-viec','Hành trang tìm việc']].map(([slug,title])=>page('/events/'+slug,title,`Tìm hiểu nội dung chương trình minh họa ${title.toLowerCase()} cùng Minh Đức.`)),
 page('/partners','Đối tác','Tìm hiểu về kết nối và định hướng đồng hành cùng đối tác của Minh Đức.'),
 page('/education','Tuyển sinh','Tìm hiểu các chương trình học từ xa và chính quy cùng quy trình đăng ký minh họa.'),
 page('/education/tu-xa-quan-tri','Quản trị kinh doanh từ xa','Khám phá chương trình Quản trị kinh doanh từ xa và thử tư vấn hoặc đăng ký học.'),
 page('/education/chinh-quy-cong-nghe','Công nghệ kỹ thuật chính quy','Tìm hiểu chương trình Công nghệ kỹ thuật chính quy trong bản minh họa tuyển sinh.'),
 page('/education/tu-xa-ke-toan','Kế toán từ xa','Tìm hiểu chương trình Kế toán từ xa và trải nghiệm các bước chuẩn bị hồ sơ.'),
 page('/admin-demo','Không gian quản trị mẫu','Trải nghiệm phân loại, phân công và xử lý hồ sơ cùng quản lý nội dung bằng dữ liệu giả định.'),
 page('/contact','Liên hệ Minh Đức','Xem thông tin liên hệ và gửi yêu cầu tư vấn minh họa tới Minh Đức Vina.'),
 page('/consultation','Đặt lịch tư vấn','Chọn ngày và khung giờ để trải nghiệm quy trình đặt lịch tư vấn minh họa cùng Minh Đức Vina.'),
 page('/e-brochure','Hồ sơ giới thiệu','Xem hồ sơ giới thiệu trực tuyến về Minh Đức và các giải pháp nhân lực.'),
 page('/privacy-policy','Chính sách bảo mật','Tìm hiểu cách bản prototype xử lý thông tin và lưu lựa chọn trên thiết bị.'),
 page('/terms-of-use','Điều khoản sử dụng','Tìm hiểu điều khoản sử dụng và phạm vi nội dung minh họa của website.')
];
export function getPage(path:string):Page { let normalized=path.length>1?path.replace(/\/+$/,''):path; normalized=({'/testimonials':'/partners','/job-seekers':'/jobs','/vi':'/'} as Record<string,string>)[normalized] || normalized; return pages.find(p=>p.path===normalized) || page(normalized,'Không tìm thấy trang','Trang bạn tìm kiếm không có trong bản minh họa Minh Đức Vina.'); }
export function seo(path:string) {
 const p=getPage(path), url=ORIGIN+p.path, title=`${p.title} | Minh Đức Vina`, image=ORIGIN+'/assets/minh-duc-logo.jpg';
 const graph:Record<string,unknown>[]=[
  {'@type':'Organization','@id':ORIGIN+'/#organization',name:'Minh Đức Vina',url:ORIGIN+'/',logo:image,telephone:company.tel,sameAs:[company.facebook,company.zalo]},
  {'@type':'WebSite','@id':ORIGIN+'/#website',name:'Minh Đức Vina',url:ORIGIN+'/',publisher:{'@id':ORIGIN+'/#organization'},inLanguage:'vi'},
  {'@type':'WebPage','@id':url+'#webpage',url,name:title,description:p.description,isPartOf:{'@id':ORIGIN+'/#website'},inLanguage:'vi'}
 ];
 if(p.path!=='/') { const parent=p.path.split('/').filter(Boolean); const items=[{'@type':'ListItem',position:1,name:'Trang chủ',item:ORIGIN+'/'}]; if(parent.length>1){const root=getPage('/'+parent[0]);items.push({'@type':'ListItem',position:2,name:root.title,item:ORIGIN+root.path});}items.push({'@type':'ListItem',position:items.length+1,name:p.title,item:url});graph.push({'@type':'BreadcrumbList',itemListElement:items}); }
 return {title,description:p.description,url,image,json:{'@context':'https://schema.org','@graph':graph}};
}
