import {company} from '../company';
import {jobs} from '../jobs-data';
import {educationPrograms} from '../education-data';
import {articles, articleHref} from '../editorial-data';

export const ORIGIN = 'https://kenbinhoainam.github.io/WebMinhDuc';
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
 ...jobs.map(job => {
  // Metadata has always spelled out the conjunction; preserve its translated keys.
  const title = job.title.replace(/ & /g, ' và ');
  return page('/jobs/'+job.slug,title,`Tìm hiểu công việc, yêu cầu và quyền lợi của vị trí ${title.toLowerCase()} trong bản minh họa của Minh Đức.`);
 }),
 page('/saved-jobs','Việc làm đã lưu','Xem các vị trí bạn đã đánh dấu trên thiết bị và tiếp tục tìm hiểu cơ hội việc làm.'),
 page('/careers','Gia nhập Minh Đức','Khám phá môi trường làm việc và các cơ hội nội bộ minh họa tại Minh Đức.'),
 page('/news','Tin tức và cẩm nang','Đọc những gợi ý về tìm việc, tuyển dụng và nhân sự dành cho người lao động và doanh nghiệp.'),
 ...articles.map(article=>page(articleHref(article.slug),article.seo?.title ?? article.title,article.seo?.description ?? article.excerpt)),
 page('/events','Sự kiện','Khám phá các chương trình kết nối việc làm và trao đổi nhân lực minh họa của Minh Đức.'),
 ...[['ngay-hoi-ket-noi-viec-lam','Ngày hội kết nối việc làm'],['toa-dam-ke-hoach-nhan-luc','Trao đổi kế hoạch nhân lực'],['hanh-trang-tim-viec','Hành trang tìm việc']].map(([slug,title])=>page('/events/'+slug,title,`Tìm hiểu nội dung chương trình minh họa ${title.toLowerCase()} cùng Minh Đức.`)),
 page('/partners','Đối tác','Tìm hiểu về kết nối và định hướng đồng hành cùng đối tác của Minh Đức.'),
 page('/education','Tuyển sinh','Tìm hiểu các chương trình học từ xa và chính quy cùng quy trình đăng ký minh họa.'),
 ...educationPrograms.map(program=>page('/education/'+program.slug,program.seo.title,program.seo.description)),
 page('/admin-demo','Không gian quản trị mẫu','Trải nghiệm phân loại, phân công và xử lý hồ sơ cùng quản lý nội dung bằng dữ liệu giả định.'),
 page('/contact','Liên hệ Minh Đức','Xem thông tin liên hệ và gửi yêu cầu tư vấn minh họa tới Minh Đức Vina.'),
 page('/consultation','Đặt lịch tư vấn','Chọn ngày và khung giờ để trải nghiệm quy trình đặt lịch tư vấn minh họa cùng Minh Đức Vina.'),
 page('/privacy-policy','Chính sách bảo mật','Tìm hiểu cách bản prototype xử lý thông tin và lưu lựa chọn trên thiết bị.'),
 page('/terms-of-use','Điều khoản sử dụng','Tìm hiểu điều khoản sử dụng và phạm vi nội dung minh họa của website.')
];
export function getPage(path:string):Page { let normalized=path.length>1?path.replace(/\/+$/,''):path; normalized=({'/e-brochure':'/about-us','/testimonials':'/partners','/job-seekers':'/jobs','/vi':'/'} as Record<string,string>)[normalized] || normalized; return pages.find(p=>p.path===normalized) || page(normalized,'Không tìm thấy trang','Trang bạn tìm kiếm không có trong bản minh họa Minh Đức Vina.'); }
export function seo(path:string) {
 const p=getPage(path), url=ORIGIN+p.path, title=`${p.title} | Minh Đức Vina`, image=new URL('/WebMinhDuc/assets/minh-duc-logo.jpg', ORIGIN).href;
 const graph:Record<string,unknown>[]=[
  {'@type':'Organization','@id':ORIGIN+'/#organization',name:'Minh Đức Vina',url:ORIGIN+'/',logo:image,telephone:company.tel,sameAs:[company.facebook,company.zalo]},
  {'@type':'WebSite','@id':ORIGIN+'/#website',name:'Minh Đức Vina',url:ORIGIN+'/',publisher:{'@id':ORIGIN+'/#organization'},inLanguage:'vi'},
  {'@type':'WebPage','@id':url+'#webpage',url,name:title,description:p.description,isPartOf:{'@id':ORIGIN+'/#website'},inLanguage:'vi'}
 ];
 if(p.path!=='/') { const parent=p.path.split('/').filter(Boolean); const items=[{'@type':'ListItem',position:1,name:'Trang chủ',item:ORIGIN+'/'}]; if(parent.length>1){const root=getPage('/'+parent[0]);items.push({'@type':'ListItem',position:2,name:root.title,item:ORIGIN+root.path});}items.push({'@type':'ListItem',position:items.length+1,name:p.title,item:url});graph.push({'@type':'BreadcrumbList',itemListElement:items}); }
 return {title,description:p.description,url,image,json:{'@context':'https://schema.org','@graph':graph}};
}
