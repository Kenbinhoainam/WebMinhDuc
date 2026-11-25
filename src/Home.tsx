import {company} from './company';
import {useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowUpRight, ChevronLeft, ChevronRight, Play, Pause} from 'lucide-react';
import {MEDIA, ButtonLink, Modal} from './shared';
import {AnimatedNumber, RevealFrame} from './motion';
import PartnersStrip from './PartnersStrip';
import {useTranslation} from './i18n';
import {ContactForm} from './Contact';
import HomeHero from './HomeHero';
import heroAssets from './hero-assets.json';
import {backgroundImage, responsiveImage} from './media';
import {useHomeCarousel, advanceHomeRail} from './useHomeCarousel';
import './home-reference.css';
import './home-b2b.css';

const services = [
  {title:'Giới thiệu & cung ứng nhân lực', desc:'Kết nối người lao động và doanh nghiệp theo nhu cầu thực tế.', image:MEDIA+'2025/09/Co-hoi-viec-lam-scaled.jpg', path:'labor-supply', icon:'Solution-Icon-3.png'},
  {title:'Cho thuê lao động', desc:'Trao đổi phương án nhân lực linh hoạt cho kế hoạch vận hành.', image:MEDIA+'2025/09/GPNS-1.jpg', path:'labor-leasing', icon:'Solution-Icon-2.png'},
  {title:'Headhunt & lao động tay nghề', desc:'Tìm kiếm nhân sự có kinh nghiệm và kỹ năng phù hợp.', image:MEDIA+'2025/10/HR2B-Careers-banner.jpg', path:'recruitment', icon:'Solution-Icon-1.png'},
  {title:'Tuyển sinh cao đẳng & đại học', desc:'Tìm hiểu cơ hội học tập từ xa và chính quy.', image:'/assets/editorial/admissions-seminar.webp', path:'college-admissions', icon:'Solution-Icon-3.png'},
  {title:'Setup tổ chức & phần mềm doanh nghiệp', desc:'Cùng làm rõ cấu trúc, quy trình và nhu cầu phần mềm quản lý.', image:'/assets/editorial/business-team.webp', path:'hr-consulting', icon:'Solution-Icon-2.png'},
];
// Reference values are illustrative prototype content and require verification before production.
const metrics = [
  {number:1200, suffix:'+', label:'Kết nối việc làm', image:'GPNS-1.jpg'},
  {number:80, suffix:'+', label:'Nhu cầu doanh nghiệp', image:'GPNS-2.jpg'},
  {number:15, suffix:'+', label:'Khu vực kết nối', image:'GPNS-3.jpg'},
  {number:95, suffix:'%', label:'Mức độ hài lòng', image:'Staff-oursourcing.jpg'},
];

function CarouselPause({paused,toggle}:{paused:boolean;toggle:()=>void}) {
  const t=useTranslation();
  const label=paused?t({vi:'Phát chuyển động',en:'Play motion',zh:'播放动画',ko:'움직임 재생',ja:'動きを再生'}):t({vi:'Tạm dừng chuyển động',en:'Pause motion',zh:'暂停动画',ko:'움직임 일시 정지',ja:'動きを一時停止'});
  return <button type="button" className="ref-carousel-pause" aria-pressed={paused} aria-label={label} onClick={toggle}>{paused?<Play size={16}/>:<Pause size={16}/>}<span>{label}</span></button>;
}
function About() {
 const t=useTranslation();
 return <section id="about" className="section-home-about ref-home-section">
  <img className="ref-edge ref-about-edge" src="/mirror/www.hr2b.com/wp-content/themes/canhcamtheme/img/edge-1-no-noise.png" alt="" aria-hidden="true" loading="lazy" decoding="async"/>
  <div className="container ref-about-row">
   <RevealFrame className="ref-about-copy" effect="left">
    <p className="home-b2b-kicker">MINH ĐỨC VINA</p>
    <h2 className="ref-heading">{t({vi:'Nhân lực là tài sản. Con người là trọng tâm.',en:'People are an asset. People are at the heart of our work.',zh:'人才是资产，以人为本。',ko:'인재는 자산입니다. 사람이 중심입니다.',ja:'人材は財産。人を中心に。'})}</h2>
    <p>{t({vi:'Minh Đức kết nối doanh nghiệp sản xuất và nhà máy FDI tại miền Bắc với nguồn nhân lực phù hợp, từ lao động phổ thông đến nhân sự có tay nghề.',en:'Minh Đức connects manufacturers and FDI factories in northern Vietnam with suitable people, from general workers to skilled staff.',zh:'Minh Đức 为越南北部的制造企业和外资工厂连接合适的人才，涵盖普通劳工与技术人员。',ko:'Minh Đức는 베트남 북부의 제조 기업과 외국인 투자 공장을 일반 인력부터 숙련 인력까지 적합한 인재와 연결합니다.',ja:'Minh Đứcはベトナム北部の製造企業・外資系工場と、一般労働者から技能人材まで適切な人材をつなぎます。'})}</p>
    <p>{t({vi:'Chia sẻ kế hoạch, vị trí và ca làm việc để cùng trao đổi phương án phù hợp với vận hành của bạn.',en:'Share your plans, roles and shifts so we can discuss an approach suited to your operations.',zh:'分享您的计划、岗位和班次，共同探讨适合运营需求的方案。',ko:'계획, 직무와 근무조를 알려주시면 운영에 맞는 방안을 함께 논의합니다.',ja:'計画、職種、シフトをお知らせください。事業運営に合う方法を一緒に検討します。'})}</p>
    <ButtonLink to="/about-us">{t({vi:'Tìm hiểu Minh Đức',en:'About Minh Đức',zh:'了解 Minh Đức',ko:'Minh Đức 알아보기',ja:'Minh Đứcについて'})}</ButtonLink>
   </RevealFrame>
   <RevealFrame className="ref-about-image home-b2b-about-image" effect="right"><img className="ref-about-art" {...responsiveImage(MEDIA+'2025/10/Executive-Search-banner.jpg','(max-width: 767px) 90vw, 40vw')} alt="" loading="lazy" decoding="async"/></RevealFrame>
  </div>
 </section>;
}
function Achievements() {
 const area=useRef<HTMLElement>(null), row=useRef<HTMLDivElement>(null), t=useTranslation();
 const auto=useHomeCarousel(area,()=>advanceHomeRail(row.current));
 return <section ref={area} className="section-home-about-achievement ref-achievements ref-carousel-area home-b2b-facts">
  <img className="ref-edge ref-achievement-edge" src="/mirror/www.hr2b.com/wp-content/themes/canhcamtheme/img/edge-2.png" alt="" aria-hidden="true" loading="lazy" decoding="async"/>
  <div className="ref-wide"><div ref={row} className="ref-achievement-track" tabIndex={0} role="region" aria-label={t({vi:'Các chỉ số kết nối',en:'Connection figures',zh:'连接数据',ko:'연결 지표',ja:'つながりの指標'})}>
   {metrics.map((m,i)=><RevealFrame className="ref-achievement-frame" key={m.label} delayMs={([300,500,700,900] as const)[i]}><article className="ref-achievement" tabIndex={0}><span className="ref-achievement-bg" aria-hidden="true" style={{backgroundImage:`linear-gradient(0deg,rgba(0,0,0,.6),rgba(0,0,0,.25)),url(${backgroundImage(MEDIA+'2025/09/'+m.image,960)})`}}/><span className="ref-achievement-label">{m.label}</span><div><strong><AnimatedNumber value={m.number} suffix={m.suffix}/></strong><ArrowUpRight aria-hidden="true"/></div></article></RevealFrame>)}
  </div><CarouselPause paused={auto.paused} toggle={auto.toggle}/></div>
 </section>;
}
function Solutions() {
  const row=useRef<HTMLDivElement>(null), area=useRef<HTMLElement>(null);
  const auto=useHomeCarousel(area,()=>advanceHomeRail(row.current));
  const scroll=(direction:number)=>row.current?.scrollBy({left:direction*(row.current?.clientWidth || 350)*.8, behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  return <section ref={area} className="section-home-solution ref-home-section ref-carousel-area"><div className="container"><RevealFrame effect="zoom"><h2 className="ref-heading ref-center">Giải pháp nhân lực toàn diện</h2></RevealFrame></div>
    <div className="ref-wide ref-rail-wrap"><RevealFrame delayMs={500}><div ref={row} className="ref-solution-track" tabIndex={0} role="region" aria-label="Danh sách giải pháp">{services.map(s=><article className="ref-solution" key={s.path} style={{backgroundImage:`linear-gradient(180deg,rgba(15,24,35,.25),rgba(15,24,35,.82)),url(${backgroundImage(s.image,960)})`}}><img className="ref-solution-icon" src={MEDIA+'2025/09/'+s.icon} alt="" width="188" height="188" loading="lazy"/><div className="ref-solution-content"><h3><Link to={'/services/'+s.path}>{s.title}</Link></h3><p>{s.desc}</p></div><Link className="btn" to={'/services/'+s.path}>Khám phá giải pháp <ArrowUpRight size={18}/></Link></article>)}</div></RevealFrame>
    <CarouselPause paused={auto.paused} toggle={auto.toggle}/><div className="ref-rail-controls"><button className="circle-button" aria-label="Dịch vụ trước" onClick={()=>scroll(-1)}><ChevronLeft/></button><button className="circle-button" aria-label="Dịch vụ tiếp theo" onClick={()=>scroll(1)}><ChevronRight/></button></div></div>
  </section>;
}
function CustomersAndStories() {
 const t=useTranslation();
 const needs=[
  {number:'01', title:t({vi:'Mở rộng nhân sự',en:'Scale your workforce',zh:'扩大员工队伍',ko:'인력 확대',ja:'人員の拡大'}), text:t({vi:'Khi kế hoạch sản xuất thay đổi, cùng làm rõ số lượng, địa điểm và thời gian cần người để xây dựng phương án kết nối.',en:'When production plans change, clarify headcount, location and timing together to shape a sourcing approach.',zh:'生产计划变化时，共同明确人数、地点和时间，制定人才对接方案。',ko:'생산 계획이 바뀌면 필요 인원, 장소와 시기를 함께 정리해 인력 연결 방안을 마련합니다.',ja:'生産計画が変わる際、人数・勤務地・時期を整理し、人材確保の方法を一緒に検討します。'})},
  {number:'02', title:t({vi:'Bố trí lao động theo ca',en:'Staff shifts and seasonal work',zh:'安排轮班与季节性用工',ko:'교대 및 계절 인력 배치',ja:'シフト・季節労働への対応'}), text:t({vi:'Trao đổi về ca làm, tính chất công việc và điều kiện tại nhà máy để tìm mô hình nhân lực phù hợp.',en:'Discuss shifts, work requirements and factory conditions to identify a suitable staffing model.',zh:'沟通班次、工作要求和工厂条件，寻找合适的用工模式。',ko:'근무조, 업무 요건과 공장 조건을 논의해 적합한 인력 운영 방식을 찾습니다.',ja:'シフト、仕事内容、工場の条件を確認し、適切な人材活用の形を探ります。'})},
  {number:'03', title:t({vi:'Tìm kỹ năng phù hợp',en:'Find the right skills',zh:'寻找合适技能',ko:'적합한 기술 인력 찾기',ja:'必要な技能を探す'}), text:t({vi:'Từ vị trí kỹ thuật đến nhu cầu tổ chức, làm rõ tiêu chí và phạm vi trước khi tìm kiếm hoặc tư vấn.',en:'From technical roles to organizational needs, define the criteria and scope before sourcing or consultation.',zh:'从技术岗位到组织需求，在寻访或咨询前明确标准与范围。',ko:'기술 직무부터 조직 요구까지, 탐색이나 상담 전에 기준과 범위를 명확히 합니다.',ja:'技術職から組織の課題まで、採用や相談の前に基準と範囲を明確にします。'})},
 ];
 return <section className="section-home-customer ref-home-section home-b2b-needs"><div className="ref-customer-logos"><RevealFrame effect="zoom"><h2 className="ref-heading ref-center">{t({vi:'Đối tác tiêu biểu',en:'Our partners',zh:'合作伙伴',ko:'파트너',ja:'パートナー'})}</h2></RevealFrame><RevealFrame delayMs={500}><PartnersStrip/></RevealFrame><div className="ref-centered-action"><Link to="/partners" className="text-link">{t({vi:'Khám phá mạng lưới',en:'Explore our network',zh:'了解合作网络',ko:'파트너 네트워크 보기',ja:'ネットワークを見る'})} <ArrowUpRight size={18}/></Link></div></div>
  <div className="container"><RevealFrame effect="zoom"><div className="home-b2b-intro"><p className="home-b2b-kicker">{t({vi:'BÀI TOÁN DOANH NGHIỆP',en:'YOUR WORKFORCE NEEDS',zh:'企业用工需求',ko:'기업의 인력 과제',ja:'企業の人材課題'})}</p><h2 className="ref-heading">{t({vi:'Từ nhu cầu thực tế đến phương án nhân lực.',en:'From your needs to a workforce approach.',zh:'从实际需求到人力方案。',ko:'실제 요구에서 인력 방안까지.',ja:'現場の課題から人材の解決策へ。'})}</h2></div></RevealFrame><div className="home-b2b-need-list">{needs.map(item=><RevealFrame key={item.number}><article><span>{item.number}</span><h3>{item.title}</h3><p>{item.text}</p><ArrowUpRight aria-hidden="true"/></article></RevealFrame>)}</div></div>
 </section>;
}
function Process() {
 const t=useTranslation();
 const steps=[
  t({vi:'Tiếp nhận nhu cầu',en:'Understand your needs',zh:'了解需求',ko:'요구 접수',ja:'ご要望の受付'}),
  t({vi:'Khảo sát',en:'Review requirements',zh:'实地了解',ko:'현황 조사',ja:'状況の確認'}),
  t({vi:'Đề xuất phương án',en:'Propose an approach',zh:'提出方案',ko:'방안 제안',ja:'プランの提案'}),
  t({vi:'Phối hợp triển khai',en:'Coordinate delivery',zh:'协同实施',ko:'협력 실행',ja:'協力して実施'}),
  t({vi:'Đánh giá & duy trì',en:'Review and support',zh:'评估与维持',ko:'평가 및 유지',ja:'評価と継続'}),
 ];
 return <section className="ref-home-section home-b2b-process"><div className="container"><div className="home-b2b-process-head"><RevealFrame effect="left"><p className="home-b2b-kicker">{t({vi:'CÁCH CHÚNG TÔI ĐỒNG HÀNH',en:'HOW WE WORK',zh:'我们的合作方式',ko:'함께하는 방법',ja:'私たちの進め方'})}</p><h2 className="ref-heading">{t({vi:'Cùng bạn qua từng bước.',en:'With you at every step.',zh:'每一步与您同行。',ko:'매 단계 함께합니다.',ja:'一歩ずつ、ともに。'})}</h2></RevealFrame><RevealFrame effect="right"><p>{t({vi:'Từ trao đổi ban đầu đến theo dõi sau triển khai, mỗi bước bắt đầu bằng việc hiểu rõ nhu cầu của doanh nghiệp.',en:'From the first conversation to follow-up, each step begins with understanding your business needs.',zh:'从初次沟通到实施后跟进，每一步都以了解企业需求为起点。',ko:'첫 상담부터 실행 후 점검까지 기업의 요구를 이해하는 것에서 시작합니다.',ja:'最初のご相談から実施後のフォローまで、企業のニーズを理解することから始めます。'})}</p></RevealFrame></div><ol className="home-b2b-steps">{steps.map((step,i)=><li key={step}><span>0{i+1}</span><strong>{step}</strong></li>)}</ol><a className="text-link" href="#business-contact">{t({vi:'Gửi nhu cầu nhân lực',en:'Share your staffing needs',zh:'提交用工需求',ko:'인력 수요 보내기',ja:'人材ニーズを送る'})} <ArrowUpRight size={18}/></a></div></section>;
}
function News() {
  const row=useRef<HTMLDivElement>(null), area=useRef<HTMLElement>(null), t=useTranslation();
  const auto=useHomeCarousel(area,()=>advanceHomeRail(row.current));
  const scroll=(direction:number)=>row.current?.scrollBy({left:direction*(row.current?.clientWidth || 350)*.8,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  const articles=[
    {to:'/news/nhu-cau-tuyen-dung',title:'Chuẩn bị nhu cầu tuyển dụng cho doanh nghiệp',tag:'GÓC DOANH NGHIỆP',date:'2026-11-10',image:'GPNS-2.jpg'},
    {to:'/news/thong-tin-tuyen-dung-minh-bach',title:'Thông tin tuyển dụng rõ ràng tạo nên kết nối tốt hơn',tag:'GÓC DOANH NGHIỆP',date:'2026-11-05',image:'GPNS-3.jpg'},
    {to:'/news/don-tiep-lao-dong-moi',title:'Chuẩn bị ngày đầu làm việc cho người lao động mới',tag:'GÓC DOANH NGHIỆP',date:'2026-11-02',image:'GPNS-2.jpg'},
    {to:'/news/ho-so-xin-viec',title:'Chuẩn bị hồ sơ xin việc: bắt đầu từ những điều cần thiết',tag:'CẨM NANG VIỆC LÀM',date:'2026-11-12',image:'Tin-tuc.jpg'},
    {to:'/news/chon-cong-viec-phu-hop',title:'Lựa chọn công việc phù hợp với bạn',tag:'ĐỊNH HƯỚNG NGHỀ NGHIỆP',date:'2026-11-08',image:'GPNS-1.jpg'},
    {to:'/news/an-toan-thong-tin-khi-tim-viec',title:'Giữ an toàn thông tin cá nhân khi tìm việc trực tuyến',tag:'CẨM NANG VIỆC LÀM',date:'2026-10-30',image:'GPNS-1.jpg'},
    {to:'/news/chon-cong-viec-phu-hop',title:'Công việc hằng ngày là gì?',tag:'CẨM NANG VIỆC LÀM',date:'2026-11-08',image:'GPNS-2.jpg'},
    {to:'/news/don-tiep-lao-dong-moi',title:'Trước ngày tiếp nhận',tag:'GÓC DOANH NGHIỆP',date:'2026-11-02',image:'GPNS-3.jpg'},
  ];
  return <section ref={area} className="section-home-news ref-home-section ref-carousel-area"><div className="container"><RevealFrame effect="zoom"><h2 className="ref-heading ref-center">{t({vi:'Kiến thức & hoạt động',en:'Insights & activities',zh:'资讯与活动',ko:'인사이트와 활동',ja:'情報と活動'})}</h2></RevealFrame><RevealFrame delayMs={400}><div className="ref-news-grid" ref={row} tabIndex={0} role="region" aria-label={t({vi:"Tin tức",en:"News",zh:"新闻",ko:"뉴스",ja:"ニュース"})}>{articles.map(a=><article className="ref-news-card" key={a.to+':'+a.title}><Link to={a.to} className="ref-news-image"><img src={MEDIA+'2025/09/'+a.image} alt="" loading="lazy"/></Link><div className="ref-news-meta"><span>{a.tag === 'CẨM NANG VIỆC LÀM' ? t({vi:'CẨM NANG VIỆC LÀM',en:'CAREER GUIDE',zh:'求职指南',ko:'취업 안내',ja:'就職ガイド'}) : a.tag}</span></div><h3><Link to={a.to}>{a.title}</Link></h3><Link to={a.to} className="text-link">Đọc bài viết <ArrowUpRight size={18}/></Link></article>)}</div></RevealFrame><CarouselPause paused={auto.paused} toggle={auto.toggle}/><div className="ref-rail-controls"><button className="circle-button" aria-label={t({vi:'Tin tức trước',en:'Previous news',zh:'上一条新闻',ko:'이전 뉴스',ja:'前のニュース'})} onClick={()=>scroll(-1)}><ChevronLeft/></button><button className="circle-button" aria-label={t({vi:'Tin tức tiếp theo',en:'Next news',zh:'下一条新闻',ko:'다음 뉴스',ja:'次のニュース'})} onClick={()=>scroll(1)}><ChevronRight/></button></div><div className="ref-centered-action"><ButtonLink to="/news" secondary>Xem tất cả tin tức</ButtonLink></div></div></section>;
}
function Events() {
 const t=useTranslation();
 return <section className="section-home-event ref-home-section"><div className="container"><RevealFrame delayMs={400}><article className="ref-event"><img src="/assets/minhduc-working-60s.webp" alt="" width="1024" height="576" loading="lazy"/><div><span className="eyebrow">MINH ĐỨC VINA</span><h2>{t({vi:'Kết nối bắt đầu từ cuộc gặp gỡ.',en:'Connections begin with a conversation.',zh:'连接始于交流。',ko:'만남에서 연결이 시작됩니다.',ja:'つながりは対話から。'})}</h2><p>{t({vi:'Tìm hiểu thêm về hoạt động và những câu chuyện kết nối của Minh Đức.',en:'Discover more about Minh Đức and the people we connect.',zh:'了解 Minh Đức 的活动及其连接人与人的故事。',ko:'Minh Đức의 활동과 사람을 잇는 이야기를 살펴보세요.',ja:'Minh Đứcの活動と人をつなぐ取り組みをご覧ください。'})}</p><ButtonLink to="/news">{t({vi:'Xem hoạt động',en:'Explore our activities',zh:'查看活动',ko:'활동 보기',ja:'活動を見る'})}</ButtonLink></div></article></RevealFrame></div></section>;
}
function IntroVideos() {
 const [open,setOpen]=useState(false), t=useTranslation();
 const heading=t({vi:'Gặp gỡ Minh Đức',en:'Meet Minh Đức',zh:'走近 Minh Đức',ko:'Minh Đức 만나보기',ja:'Minh Đứcを知る'});
 const play=t({vi:'Xem video giới thiệu',en:'Watch our company video',zh:'观看公司介绍视频',ko:'회사 소개 영상 보기',ja:'会社紹介動画を見る'});
 return <section className="section-home-video ref-home-section home-b2b-video"><RevealFrame className="ref-video-bg-frame" effect="zoom-right"><span className="ref-video-big-text" aria-hidden="true">MINH ĐỨC</span></RevealFrame><div className="container"><RevealFrame effect="zoom"><h2 className="ref-heading ref-center">{heading}</h2></RevealFrame><RevealFrame delayMs={400}><button className="home-b2b-video-button" type="button" onClick={()=>setOpen(true)} aria-label={play}><img src="/assets/minhduc-title-45s.webp" alt="" width="1024" height="576" loading="lazy"/><span className="ref-video-play" aria-hidden="true"><Play size={22}/></span><strong>{play} <ArrowUpRight size={18}/></strong></button></RevealFrame></div>{open&&<Modal title={heading} onClose={()=>setOpen(false)}><video className="ref-video-player" controls autoPlay playsInline preload="metadata" tabIndex={0} poster={heroAssets.poster}><source src={heroAssets.video} type="video/mp4"/><source src={heroAssets.webm} type="video/webm"/></video></Modal>}</section>;
}
function Offices() {
 const t=useTranslation();
 return <section className="home-b2b-offices ref-home-section"><div className="container home-b2b-office-layout"><RevealFrame effect="left"><p className="home-b2b-kicker">MINH ĐỨC VINA</p><h2 className="ref-heading">{t({vi:'Gần hơn với doanh nghiệp miền Bắc.',en:'Close to businesses across northern Vietnam.',zh:'贴近越南北部企业。',ko:'베트남 북부 기업과 가까이.',ja:'ベトナム北部の企業のそばに。'})}</h2><p>{t({vi:'Ba địa điểm kết nối để doanh nghiệp và người lao động dễ dàng trao đổi.',en:'Three locations where businesses and workers can connect with us.',zh:'三个地点，方便企业和劳动者与我们联系。',ko:'기업과 근로자가 만날 수 있는 세 곳의 거점입니다.',ja:'企業と働く人が相談できる3つの拠点です。'})}</p></RevealFrame><RevealFrame effect="right"><div className="home-b2b-office-list">{company.offices.map((office,i)=><a href={office.map} target="_blank" rel="noreferrer" key={office.name}><span>0{i+1}</span><div><strong>{office.name}</strong><p>{office.address}</p></div><ArrowUpRight aria-hidden="true"/></a>)}</div></RevealFrame></div></section>;
}
function BusinessContact() {
 const t=useTranslation();
 return <section id="business-contact" className="home-b2b-contact ref-home-section"><div className="container home-b2b-contact-layout"><RevealFrame effect="left"><p className="home-b2b-kicker">MINH ĐỨC VINA</p><h2 className="ref-heading">{t({vi:'Gửi nhu cầu nhân lực',en:'Share your staffing needs',zh:'提交用工需求',ko:'인력 수요 보내기',ja:'人材ニーズを送る'})}</h2><p>{t({vi:'Cho chúng tôi biết vị trí, số lượng và địa điểm bạn cần. Minh Đức sẵn sàng trao đổi để tìm phương án phù hợp.',en:'Tell us the roles, headcount and location you need. Minh Đức is ready to discuss an approach with you.',zh:'请告诉我们您需要的岗位、人数和地点。Minh Đức 愿与您共同探讨合适的方案。',ko:'필요한 직무, 인원과 지역을 알려주세요. Minh Đức가 적합한 방안을 함께 논의합니다.',ja:'必要な職種、人数、勤務地をお知らせください。Minh Đứcが適切な方法を一緒に検討します。'})}</p><a className="home-b2b-phone" href={`tel:${company.tel}`}>{company.phone} <ArrowUpRight size={20}/></a></RevealFrame><RevealFrame effect="right"><div className="home-b2b-form"><ContactForm initialMode="F01" lockMode source="home-business"/></div></RevealFrame></div></section>;
}
export default function Home() {
 return <><HomeHero/><About/><Achievements/><Solutions/><CustomersAndStories/><Process/><News/><Events/><IntroVideos/><Offices/><BusinessContact/></>;
}
