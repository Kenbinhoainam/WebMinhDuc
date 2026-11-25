import {company} from './company';
import {useRef} from 'react';
import {Link} from 'react-router-dom';
import {ArrowUpRight} from 'lucide-react';
import {MEDIA, ButtonLink, useContact} from './shared';
import {AnimatedNumber, RevealFrame} from './motion';
import PartnersStrip from './PartnersStrip';
import {useTranslation} from './i18n';
import {ContactForm} from './Contact';
import HomeHero from './HomeHero';
import {backgroundImage, responsiveImage} from './media';
import {useScrollableRail} from './useHomeCarousel';
import './home-reference.css';
import './home-b2b.css';
import './home-flagship-v16.css';

const services = [
  {title:'Giới thiệu & cung ứng nhân lực', desc:'Kết nối người lao động và doanh nghiệp theo nhu cầu thực tế.', image:'/assets/minhduc-v18/field-team.webp', path:'labor-supply', icon:'Solution-Icon-3.png'},
  {title:'Cho thuê lao động', desc:'Trao đổi phương án nhân lực linh hoạt cho kế hoạch vận hành.', image:'/assets/minhduc-v18/industrial-campus.webp', path:'labor-leasing', icon:'Solution-Icon-2.png'},
  {title:'Headhunt & lao động tay nghề', desc:'Tìm kiếm nhân sự có kinh nghiệm và kỹ năng phù hợp.', image:'/assets/editorial/business-team.webp', path:'recruitment', icon:'Solution-Icon-1.png'},
  {title:'Tuyển sinh cao đẳng & đại học', desc:'Tìm hiểu cơ hội học tập từ xa và chính quy.', image:'/assets/editorial/admissions-seminar.webp', path:'college-admissions', icon:'Solution-Icon-3.png'},
  {title:'Setup tổ chức & phần mềm doanh nghiệp', desc:'Cùng làm rõ cấu trúc, quy trình và nhu cầu phần mềm quản lý.', image:'/assets/minhduc-v18/learning-space.webp', path:'hr-consulting', icon:'Solution-Icon-2.png'},
];
// Reference values are illustrative prototype content and require verification before production.
const metrics = [
  {number:1200, suffix:'+', label:'Kết nối việc làm'},
  {number:80, suffix:'+', label:'Nhu cầu doanh nghiệp'},
  {number:15, suffix:'+', label:'Khu vực kết nối'},
  {number:95, suffix:'%', label:'Mức độ hài lòng'},
];

function About() {
 const t=useTranslation();
 const photo='/assets/minhduc-v16/recruitment-field.webp';
 return <section id="about" aria-labelledby="field-title" className="section-home-about field-section">
   <div className="field-container">
     <div className="field-story">
       <RevealFrame className="field-title" effect="left">
         <p className="home-b2b-kicker">MINH ĐỨC VINA</p>
         <h2 id="field-title">{t({vi:'Tuyển người theo ca cho nhà máy miền Bắc',en:'Shift recruitment for factories in northern Vietnam',zh:'为越南北部工厂招聘轮班人员',ko:'베트남 북부 공장의 교대 인력 채용',ja:'ベトナム北部の工場向けシフト人材採用'})}</h2>
       </RevealFrame>
       <RevealFrame className="field-portrait" effect="right">
         <img src={photo} {...responsiveImage(photo,'(max-width: 767px) 100vw, (max-width: 1599px) 58vw, 820px')} alt={t({vi:'Nhân viên Minh Đức cầm hồ sơ tuyển dụng trước cổng nhà máy',en:'A Minh Đức team member holding recruitment documents outside a factory',zh:'Minh Đức 工作人员在工厂门口手持招聘资料',ko:'공장 앞에서 채용 서류를 든 Minh Đức 직원',ja:'工場前で採用書類を持つMinh Đứcのスタッフ'})} loading="lazy" decoding="async"/>
       </RevealFrame>
       <RevealFrame className="field-body" effect="up">
         <p>{t({vi:'Từ lao động phổ thông đến thợ lành nghề, Minh Đức tìm người theo từng vị trí, ca làm và kế hoạch sản xuất của nhà máy FDI tại miền Bắc.',en:'From production workers to skilled technicians, Minh Đức recruits for the roles, shifts and production schedules of FDI factories in northern Vietnam.',zh:'从普工到熟练技工，Minh Đức 根据越南北部外资工厂的岗位、班次与生产计划招聘人员。',ko:'Minh Đức는 베트남 북부 외국인 투자 공장의 직무, 교대조와 생산 계획에 맞춰 생산직부터 숙련 기술자까지 채용합니다.',ja:'Minh Đứcはベトナム北部の外資系工場の職種・シフト・生産計画に合わせて、作業員から熟練技術者まで採用を支援します。'})}</p>
         <ButtonLink to="/e-brochure">{t({vi:'Xem hồ sơ năng lực',en:'View company profile',zh:'查看公司简介',ko:'회사 소개서 보기',ja:'会社案内を見る'})}</ButtonLink>
       </RevealFrame>
     </div>
     <Achievements/>
   </div>
 </section>;
}
function Achievements() {
 const row=useRef<HTMLDivElement>(null), t=useTranslation();
 const overflow=useScrollableRail(row);
 return <div ref={row} data-auto-rail="" className="field-metrics section-home-about-achievement" tabIndex={overflow ? 0 : undefined} role="region" aria-label={t({vi:'Các chỉ số kết nối',en:'Connection figures',zh:'连接数据',ko:'연결 지표',ja:'つながりの指標'})}>
   {metrics.map((m,i)=><RevealFrame className="field-stat-frame" key={m.label} delayMs={([300,500,700,900] as const)[i]}>
     <div className="field-stat"><strong><AnimatedNumber value={m.number} suffix={m.suffix}/></strong><span>{m.label}</span></div>
   </RevealFrame>)}
 </div>;
}
function Solutions() {
  const row=useRef<HTMLDivElement>(null);
  const overflow=useScrollableRail(row);
  return <section className="section-home-solution ref-home-section ref-carousel-area"><div className="container"><RevealFrame effect="zoom"><h2 className="ref-heading ref-center">Giải pháp nhân lực toàn diện</h2></RevealFrame></div>
    <div className="ref-wide ref-rail-wrap"><RevealFrame delayMs={500}><div data-auto-rail="" ref={row} className="ref-solution-track" tabIndex={overflow ? 0 : undefined} role="region" aria-label="Danh sách giải pháp">{services.map(s=><article className="ref-solution" key={s.path} style={{backgroundImage:`linear-gradient(180deg,rgba(15,24,35,.25),rgba(15,24,35,.82)),url(${backgroundImage(s.image,960)})`}}><img className="ref-solution-icon" src={MEDIA+'2025/09/'+s.icon} alt="" width="188" height="188" loading="lazy"/><div className="ref-solution-content"><h3><Link to={'/services/'+s.path}>{s.title}</Link></h3><p>{s.desc}</p></div><Link className="btn" to={'/services/'+s.path}>Khám phá giải pháp <ArrowUpRight size={18}/></Link></article>)}</div></RevealFrame>
    </div>
  </section>;
}
function Needs() {
 const t=useTranslation(), contact=useContact();
 const needs=[
  {number:'01',title:t({vi:'Mở rộng nhân sự',en:'Scale your workforce',zh:'扩大员工队伍',ko:'인력 확대',ja:'人員の拡大'}),text:t({vi:'Làm rõ số lượng, địa điểm và thời gian cần người cho kế hoạch sản xuất.',en:'Clarify headcount, location and timing for your production plan.',zh:'明确生产计划所需人数、地点和时间。',ko:'생산 계획에 필요한 인원, 장소와 시기를 명확히 합니다.',ja:'生産計画に必要な人数、勤務地、時期を整理します。'}),path:'labor-supply',service:'Giới thiệu & cung ứng nhân lực'},
  {number:'02',title:t({vi:'Bố trí lao động theo ca',en:'Staff your shifts',zh:'安排轮班用工',ko:'교대 인력 배치',ja:'シフトに合わせた人員配置'}),text:t({vi:'Trao đổi về ca làm và yêu cầu vận hành để tìm phương án phù hợp.',en:'Discuss shift and operational requirements to find a suitable approach.',zh:'沟通班次与运营要求，寻找合适方案。',ko:'근무조와 운영 요건을 논의해 적합한 방안을 찾습니다.',ja:'シフトと運営上の要件を確認し、適切な方法を探ります。'}),path:'labor-leasing',service:'Cho thuê lao động'},
  {number:'03',title:t({vi:'Tìm nhân sự có kỹ năng',en:'Find the right skills',zh:'寻找合适技能人才',ko:'적합한 숙련 인력 찾기',ja:'必要な技能を持つ人材を探す'}),text:t({vi:'Xác định kỹ năng và tiêu chí trước khi tìm kiếm nhân sự có kinh nghiệm.',en:'Define the skills and criteria before searching for experienced people.',zh:'明确技能和标准，再寻找有经验的人才。',ko:'경력 인력을 찾기 전에 기술과 기준을 명확히 합니다.',ja:'経験者を探す前に、必要な技能と基準を明確にします。'}),path:'recruitment',service:'Headhunt & lao động tay nghề'},
 ];
 return <section className="home-v16-needs ref-home-section"><div className="container"><RevealFrame effect="left"><p className="home-b2b-kicker">{t({vi:'GIẢI PHÁP CHO DOANH NGHIỆP',en:'SOLUTIONS FOR BUSINESS',zh:'企业解决方案',ko:'기업을 위한 솔루션',ja:'企業向けソリューション'})}</p><h2 className="ref-heading home-v16-heading">{t({vi:'Nhà máy của bạn đang cần gì?',en:'What does your factory need?',zh:'您的工厂需要什么？',ko:'공장에 어떤 인력이 필요하신가요?',ja:'工場に必要な人材は？'})}</h2></RevealFrame><div className="home-v16-need-grid">{needs.map((item,i)=><RevealFrame key={item.number} delayMs={([0,80,160] as const)[i]}><article className="home-v16-need"><span className="home-v16-number">{item.number}</span><h3>{item.title}</h3><p>{item.text}</p><div className="home-v16-need-actions"><Link to={'/services/'+item.path} className="text-link">{t({vi:'Tìm hiểu dịch vụ',en:'Explore service',zh:'了解服务',ko:'서비스 보기',ja:'サービスを見る'})} <ArrowUpRight size={18}/></Link><button type="button" className="home-v16-need-contact" onClick={()=>contact(item.service)}>{t({vi:'Trao đổi nhu cầu',en:'Discuss your needs',zh:'咨询用工需求',ko:'인력 수요 상담',ja:'ニーズを相談'})}</button></div></article></RevealFrame>)}</div><div className="home-v16-all-services"><Link className="text-link" to="/services">{t({vi:'Xem tất cả giải pháp',en:'View all solutions',zh:'查看所有解决方案',ko:'모든 솔루션 보기',ja:'すべてのソリューション'})} <ArrowUpRight size={18}/></Link></div></div></section>;
}
function Process() {
 const t=useTranslation();
 const steps=[
  [t({vi:'Tiếp nhận',en:'Listen',zh:'接收需求',ko:'요구 접수',ja:'受付'}),t({vi:'Ghi nhận vị trí, số lượng, địa điểm và thời gian cần người.',en:'Capture roles, headcount, location and timing.',zh:'记录岗位、人数、地点和时间。',ko:'직무, 인원, 장소와 시기를 확인합니다.',ja:'職種、人数、勤務地、時期を確認します。'})],
  [t({vi:'Khảo sát',en:'Review',zh:'了解情况',ko:'현황 조사',ja:'状況確認'}),t({vi:'Làm rõ điều kiện làm việc và yêu cầu của doanh nghiệp.',en:'Clarify working conditions and business requirements.',zh:'明确工作条件与企业要求。',ko:'근무 조건과 기업 요구를 파악합니다.',ja:'労働条件と企業の要件を整理します。'})],
  [t({vi:'Đề xuất',en:'Propose',zh:'提出方案',ko:'방안 제안',ja:'提案'}),t({vi:'Cùng trao đổi phương án kết nối phù hợp với nhu cầu.',en:'Discuss a sourcing approach suited to your needs.',zh:'共同探讨适合需求的对接方案。',ko:'요구에 맞는 인력 연결 방안을 논의합니다.',ja:'ニーズに合う人材確保の方法を相談します。'})],
  [t({vi:'Phối hợp triển khai',en:'Coordinate',zh:'协同实施',ko:'협력 실행',ja:'協力して実施'}),t({vi:'Phối hợp tìm kiếm, giới thiệu và tiếp nhận nhân sự.',en:'Coordinate sourcing, introductions and onboarding.',zh:'协调寻访、推荐与人员接收。',ko:'인력 탐색, 소개와 입사를 협력합니다.',ja:'人材の探索、紹介、受け入れを進めます。'})],
  [t({vi:'Đánh giá & duy trì',en:'Review and support',zh:'评估与维持',ko:'평가 및 유지',ja:'評価と継続'}),t({vi:'Theo dõi kết quả và trao đổi điều chỉnh khi cần.',en:'Review progress and discuss adjustments when needed.',zh:'跟进结果，按需沟通调整。',ko:'결과를 확인하고 필요한 조정을 논의합니다.',ja:'結果を確認し、必要に応じて調整します。'})],
 ];
 return <section className="ref-home-section home-v16-process"><div className="container"><RevealFrame effect="left"><p className="home-b2b-kicker">{t({vi:'CÁCH CHÚNG TÔI ĐỒNG HÀNH',en:'HOW WE WORK',zh:'我们的合作方式',ko:'함께하는 방법',ja:'私たちの進め方'})}</p><h2 className="ref-heading home-v16-heading">{t({vi:'Cách Minh Đức đồng hành.',en:'How Minh Đức works with you.',zh:'Minh Đức 如何与您同行。',ko:'Minh Đức가 함께하는 방법.',ja:'Minh Đứcの進め方。'})}</h2></RevealFrame><div className="home-v16-process-grid"><RevealFrame effect="media" className="home-v16-process-image"><img src="/assets/minhduc-v16/recruitment-event.webp" {...responsiveImage('/assets/minhduc-v16/recruitment-event.webp','(max-width: 767px) 100vw, 42vw')} alt={t({vi:'Nhóm người tham gia sự kiện có bảng thông tin tuyển dụng Minh Đức',en:'A group at an event with Minh Đức recruitment displays',zh:'活动现场的人群与 Minh Đức 招聘展示',ko:'Minh Đức 채용 안내가 있는 행사장의 단체',ja:'Minh Đứcの採用案内がある会場の集合写真'})} loading="lazy" decoding="async"/></RevealFrame><ol className="home-v16-steps">{steps.map(([title,detail],i)=><li key={title}><RevealFrame effect="up"><span>0{i+1}</span><div><h3>{title}</h3><p>{detail}</p></div></RevealFrame></li>)}</ol></div><div className="home-v16-partners"><h3>{t({vi:'Đối tác tiêu biểu',en:'Our partners',zh:'合作伙伴',ko:'파트너',ja:'パートナー'})}</h3><PartnersStrip/><Link to="/partners" className="text-link">{t({vi:'Khám phá mạng lưới',en:'Explore our network',zh:'了解合作网络',ko:'파트너 네트워크 보기',ja:'ネットワークを見る'})} <ArrowUpRight size={18}/></Link></div></div></section>;
}
function People() {
 const t=useTranslation();
 return <section className="home-v16-people ref-home-section"><div className="container"><RevealFrame effect="left"><p className="home-b2b-kicker">{t({vi:'CON NGƯỜI MINH ĐỨC',en:'THE PEOPLE OF MINH ĐỨC',zh:'Minh Đức 的人们',ko:'Minh Đức의 사람들',ja:'Minh Đứcの人々'})}</p><h2 className="ref-heading home-v16-heading">{t({vi:'Con người tạo nên kết nối.',en:'People make connections possible.',zh:'人与人创造连接。',ko:'사람이 연결을 만듭니다.',ja:'人がつながりをつくる。'})}</h2><p className="home-v16-people-intro">{t({vi:'Từ những cuộc gặp gỡ trong công việc đến khoảnh khắc bên nhau, mỗi kết nối bắt đầu bằng con người.',en:'From conversations at work to moments together, every connection begins with people.',zh:'从工作交流到相聚时刻，每一份连接都始于人。',ko:'업무 속 만남부터 함께하는 순간까지 모든 연결은 사람에게서 시작됩니다.',ja:'仕事での出会いからともに過ごす時間まで、つながりは人から始まります。'})}</p></RevealFrame><div className="home-v16-people-grid"><RevealFrame effect="media" className="home-v16-group"><img src="/assets/minhduc-v16/team-yearend.webp" {...responsiveImage('/assets/minhduc-v16/team-yearend.webp','(max-width: 767px) 100vw, 65vw')} alt={t({vi:'Ảnh tập thể Minh Đức tại buổi tất niên',en:'Minh Đức group at a year-end gathering',zh:'Minh Đức 年终聚会合影',ko:'Minh Đức 연말 모임 단체 사진',ja:'Minh Đứcの年末会の集合写真'})} loading="lazy" decoding="async"/></RevealFrame><RevealFrame effect="media" className="home-v16-activity"><img src="/assets/minhduc-v16/community.webp" {...responsiveImage('/assets/minhduc-v16/community.webp','(max-width: 767px) 100vw, 35vw')} alt={t({vi:'Nhóm người cùng dụng cụ vệ sinh ngoài trời',en:'A group outdoors with cleaning equipment',zh:'户外持清洁工具的团队',ko:'야외에서 청소 도구를 든 단체',ja:'屋外で清掃用具を持つグループ'})} loading="lazy" decoding="async"/><Link className="text-link" to="/about-us#activities">{t({vi:'Tìm hiểu câu chuyện',en:'Explore our story',zh:'了解我们的故事',ko:'우리의 이야기 보기',ja:'私たちの歩みを見る'})} <ArrowUpRight size={18}/></Link></RevealFrame></div></div></section>;
}
function News() {
 const row=useRef<HTMLDivElement>(null), t=useTranslation();
 const overflow=useScrollableRail(row);
 const articles=[
  {to:'/news/nhu-cau-tuyen-dung',title:t({vi:'Chuẩn bị nhu cầu tuyển dụng cho doanh nghiệp',en:'Preparing your hiring requirements',zh:'为企业招聘需求做准备',ko:'기업 채용 수요 준비하기',ja:'企業の採用ニーズを準備する'}),tag:t({vi:'GÓC DOANH NGHIỆP',en:'FOR BUSINESS',zh:'企业视角',ko:'기업 관점',ja:'企業向け'}),image:'/assets/minhduc-v18/industrial-campus.webp'},
  {to:'/news/ho-so-xin-viec',title:t({vi:'Chuẩn bị hồ sơ xin việc: bắt đầu từ những điều cần thiết',en:'Preparing a job application: start with the essentials',zh:'准备求职资料：从必需事项开始',ko:'입사 지원서 준비: 필수 사항부터',ja:'応募書類の準備：必要なことから'}),tag:t({vi:'CẨM NANG VIỆC LÀM',en:'CAREER GUIDE',zh:'求职指南',ko:'취업 안내',ja:'就職ガイド'}),image:'/assets/minhduc-v18/field-team.webp'},
  {to:'/about-us#activities',title:t({vi:'Những khoảnh khắc kết nối của Minh Đức',en:'Moments of connection at Minh Đức',zh:'Minh Đức 的连接时刻',ko:'Minh Đức의 연결 순간',ja:'Minh Đứcのつながりの瞬間'}),tag:t({vi:'HOẠT ĐỘNG MINH ĐỨC',en:'MINH ĐỨC ACTIVITIES',zh:'Minh Đức 活动',ko:'Minh Đức 활동',ja:'Minh Đứcの活動'}),image:'/assets/minhduc-v16/yearend-gifts.webp'},
 ];
 return <section className="section-home-news ref-home-section ref-carousel-area home-v16-news"><div className="container"><RevealFrame effect="zoom"><h2 className="ref-heading">{t({vi:'Kiến thức & hoạt động',en:'Insights & activities',zh:'资讯与活动',ko:'인사이트와 활동',ja:'情報と活動'})}</h2></RevealFrame><div data-auto-rail="" className="ref-news-grid" ref={row} tabIndex={overflow ? 0 : undefined} role="region" aria-label={t({vi:'Tin tức',en:'News',zh:'新闻',ko:'뉴스',ja:'ニュース'})}>{articles.map(a=><article className="ref-news-card" key={a.to}><Link to={a.to} className="ref-news-image" aria-label={a.title}><img src={a.image} {...responsiveImage(a.image,'(max-width: 767px) 85vw, 33vw')} alt="" loading="lazy"/></Link><div className="ref-news-meta"><span>{a.tag}</span></div><h3><Link to={a.to}>{a.title}</Link></h3><Link to={a.to} className="text-link">{t({vi:'Khám phá',en:'Explore',zh:'了解更多',ko:'자세히 보기',ja:'詳しく見る'})} <ArrowUpRight size={18}/></Link></article>)}</div></div></section>;
}
function Offices() {
 const t=useTranslation();
 return <section className="home-b2b-offices ref-home-section"><div className="container home-b2b-office-layout"><RevealFrame effect="left"><p className="home-b2b-kicker">MINH ĐỨC VINA</p><h2 className="ref-heading">{t({vi:'Gần hơn với doanh nghiệp miền Bắc.',en:'Close to businesses across northern Vietnam.',zh:'贴近越南北部企业。',ko:'베트남 북부 기업과 가까이.',ja:'ベトナム北部の企業のそばに。'})}</h2><p>{t({vi:'Ba địa điểm kết nối để doanh nghiệp và người lao động dễ dàng trao đổi.',en:'Three locations where businesses and workers can connect with us.',zh:'三个地点，方便企业和劳动者与我们联系。',ko:'기업과 근로자가 만날 수 있는 세 곳의 거점입니다.',ja:'企業と働く人が相談できる3つの拠点です。'})}</p></RevealFrame><RevealFrame effect="right"><div className="home-b2b-office-list">{company.offices.map((office,i)=><a href={office.map} target="_blank" rel="noreferrer" key={office.name}><span>0{i+1}</span><div><strong>{office.name}</strong><p>{office.address}</p></div><ArrowUpRight aria-hidden="true"/></a>)}</div></RevealFrame></div></section>;
}
function BusinessContact() {
 const t=useTranslation();
 return <section id="business-contact" tabIndex={-1} aria-labelledby="business-heading" className="home-b2b-contact ref-home-section"><div className="container home-b2b-contact-layout"><RevealFrame effect="left"><p className="home-b2b-kicker">MINH ĐỨC VINA</p><h2 id="business-heading" className="ref-heading">{t({vi:'Gửi nhu cầu nhân lực',en:'Share your staffing needs',zh:'提交用工需求',ko:'인력 수요 보내기',ja:'人材ニーズを送る'})}</h2><p>{t({vi:'Cho chúng tôi biết vị trí, số lượng và địa điểm bạn cần. Minh Đức sẵn sàng trao đổi để tìm phương án phù hợp.',en:'Tell us the roles, headcount and location you need. Minh Đức is ready to discuss an approach with you.',zh:'请告诉我们您需要的岗位、人数和地点。Minh Đức 愿与您共同探讨合适的方案。',ko:'필요한 직무, 인원과 지역을 알려주세요. Minh Đức가 적합한 방안을 함께 논의합니다.',ja:'必要な職種、人数、勤務地をお知らせください。Minh Đứcが適切な方法を一緒に検討します。'})}</p><a className="home-b2b-phone" href={`tel:${company.tel}`}>{company.phone} <ArrowUpRight size={20}/></a></RevealFrame><RevealFrame effect="right"><div className="home-b2b-form"><ContactForm initialMode="F01" lockMode source="home-business"/></div></RevealFrame></div></section>;
}
export default function Home() {
 return <><HomeHero/><About/><Needs/><Solutions/><Process/><People/><BusinessContact/><Offices/><News/></>;
}
