import {useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowUpRight, ChevronLeft, ChevronRight, Users, Play, Pause} from 'lucide-react';
import {MEDIA, ButtonLink, Modal} from './shared';
import {AnimatedNumber} from './motion';
import PartnersStrip from './PartnersStrip';
import PartnerLogo from './PartnerLogo';
import {partners} from './partners';
import {useLocale, useTranslation} from './i18n';
import {translate} from './i18n-runtime/jsx-runtime';
import HomeHero from './HomeHero';
import {backgroundImage} from './media';
import {useHomeCarousel, advanceHomeRail} from './useHomeCarousel';
import './home-reference.css';

const services = [
  {title:'Giới thiệu & cung ứng nhân lực', desc:'Kết nối người lao động và doanh nghiệp theo nhu cầu thực tế.', image:'GPNS-3.jpg', path:'labor-supply', icon:'Solution-Icon-3.png'},
  {title:'Cho thuê lao động', desc:'Trao đổi phương án nhân lực linh hoạt cho kế hoạch vận hành.', image:'GPNS-2.jpg', path:'labor-leasing', icon:'Solution-Icon-2.png'},
  {title:'Headhunt & lao động tay nghề', desc:'Tìm kiếm nhân sự có kinh nghiệm và kỹ năng phù hợp.', image:'GPNS-1.jpg', path:'recruitment', icon:'Solution-Icon-1.png'},
  {title:'Tuyển sinh cao đẳng & đại học', desc:'Tìm hiểu cơ hội học tập từ xa và chính quy.', image:'GPNS-3.jpg', path:'college-admissions', icon:'Solution-Icon-3.png'},
  {title:'Setup tổ chức & phần mềm doanh nghiệp', desc:'Cùng làm rõ cấu trúc, quy trình và nhu cầu phần mềm quản lý.', image:'GPNS-2.jpg', path:'hr-consulting', icon:'Solution-Icon-2.png'},
];
const metrics = [
  {number:1200, suffix:'+', label:'Kết nối việc làm', image:'GPNS-1.jpg'},
  {number:80, suffix:'+', label:'Nhu cầu doanh nghiệp', image:'GPNS-2.jpg'},
  {number:15, suffix:'+', label:'Khu vực kết nối', image:'GPNS-3.jpg'},
  {number:95, suffix:'%', label:'Mức độ hài lòng', image:'Staff-oursourcing.jpg'},
];
const stories = [
  {quote:'Điều chúng tôi cần là một đối tác hiểu nhịp vận hành và có thể cùng trao đổi rõ ràng ngay từ đầu.', name:'Chị Lan Anh', role:'Quản lý nhân sự · Doanh nghiệp sản xuất giả định'},
  {quote:'Tôi muốn biết rõ công việc và địa điểm trước khi quyết định. Một cuộc trao đổi tận tình giúp tôi tự tin hơn.', name:'Anh Minh', role:'Người lao động giả định'},
  {quote:'Khi nhu cầu thay đổi, việc có người đồng hành và cùng tìm phương án khiến hành trình tuyển dụng nhẹ nhàng hơn.', name:'Chị Thu Hà', role:'Phụ trách tuyển dụng · Doanh nghiệp giả định'},
];

function CarouselPause({paused,toggle}:{paused:boolean;toggle:()=>void}) {
  const t=useTranslation();
  const label=paused?t({vi:'Phát chuyển động',en:'Play motion',zh:'播放动画',ko:'움직임 재생',ja:'動きを再生'}):t({vi:'Tạm dừng chuyển động',en:'Pause motion',zh:'暂停动画',ko:'움직임 일시 정지',ja:'動きを一時停止'});
  return <button type="button" className="ref-carousel-pause" aria-pressed={paused} aria-label={label} onClick={toggle}>{paused?<Play size={16}/>:<Pause size={16}/>}<span>{label}</span></button>;
}
function About() {
  return <section id="about" className="section-home-about ref-home-section">
    <img className="ref-edge ref-about-edge" src="/mirror/www.hr2b.com/wp-content/themes/canhcamtheme/img/edge-1-no-noise.png" alt="" aria-hidden="true"/>
    <div className="container ref-about-row">
      <div className="ref-about-copy" data-reveal="left">
        <h2 className="ref-heading">Nhân lực là tài sản.<br/>Con người là trọng tâm.</h2>
        <p className="ref-company">CÔNG TY TNHH NHÂN LỰC MINH ĐỨC VINA</p>
        <p>Minh Đức kết nối nhu cầu của doanh nghiệp với nguồn lao động phù hợp, tập trung vào cung ứng nhân lực, tư vấn và giới thiệu việc làm, đặc biệt là lao động phổ thông tại nhà máy.</p>
        <p>Chúng tôi đồng hành từ bước tìm hiểu nhu cầu, kết nối tuyển dụng đến hỗ trợ người lao động tiếp cận công việc.</p>
        <ButtonLink to="/about-us">Tìm hiểu Minh Đức</ButtonLink>
      </div>
      <div className="ref-about-image" data-reveal="media">
        <img className="ref-about-art" src="/assets/minh-duc-about.webp" alt="Hình ảnh minh họa kết nối con người và doanh nghiệp" width="960" height="960" loading="lazy"/>
        <span className="ref-image-note">Hình ảnh minh họa theo mẫu thiết kế</span>
      </div>
    </div>
  </section>;
}
function Achievements() {
  const area=useRef<HTMLElement>(null), row=useRef<HTMLDivElement>(null);
  const auto=useHomeCarousel(area,()=>advanceHomeRail(row.current));
  return <section ref={area} className="section-home-about-achievement ref-achievements ref-carousel-area">
    <img className="ref-edge ref-achievement-edge" src="/mirror/www.hr2b.com/wp-content/themes/canhcamtheme/img/edge-2.png" alt="" aria-hidden="true"/>
    <div className="ref-wide"><p className="ref-demo-note">Số liệu mô phỏng cho giao diện</p><div ref={row} className="ref-achievement-track" tabIndex={0} role="region" aria-label="Số liệu mô phỏng cho giao diện">
      {metrics.map((m,i)=><article className="ref-achievement" key={m.label} data-reveal="up" data-reveal-delay={String(i)} style={{backgroundImage:`linear-gradient(0deg,rgba(0,0,0,.6),rgba(0,0,0,.25)),url(${backgroundImage(MEDIA+'2025/09/'+m.image,960)})`}}><span className="ref-achievement-label">{m.label}</span><div><strong><AnimatedNumber value={m.number} suffix={m.suffix}/></strong><ArrowUpRight aria-hidden="true"/></div></article>)}
    </div><CarouselPause paused={auto.paused} toggle={auto.toggle}/></div>
  </section>;
}
function Solutions() {
  const row=useRef<HTMLDivElement>(null), area=useRef<HTMLElement>(null);
  const auto=useHomeCarousel(area,()=>advanceHomeRail(row.current));
  const scroll=(direction:number)=>row.current?.scrollBy({left:direction*(row.current?.clientWidth || 350)*.8, behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  return <section ref={area} className="section-home-solution ref-home-section ref-carousel-area"><div className="container"><h2 className="ref-heading ref-center" data-reveal="up">Giải pháp nhân lực toàn diện</h2></div>
    <div className="ref-wide ref-rail-wrap"><div ref={row} className="ref-solution-track" tabIndex={0} role="region" aria-label="Danh sách giải pháp">{services.map((s,i)=><article className="ref-solution" key={s.path} data-reveal="up" data-reveal-delay={String(i%3+1)} style={{backgroundImage:`linear-gradient(180deg,rgba(15,24,35,.25),rgba(15,24,35,.82)),url(${backgroundImage(MEDIA+'2025/09/'+s.image,960)})`}}><img className="ref-solution-icon" src={MEDIA+'2025/09/'+s.icon} alt="" width="188" height="188" loading="lazy"/><h3><Link to={'/services/'+s.path}>{s.title}</Link></h3><p>{s.desc}</p><Link className="btn" to={'/services/'+s.path}>Khám phá giải pháp <ArrowUpRight size={18}/></Link></article>)}</div>
    <CarouselPause paused={auto.paused} toggle={auto.toggle}/><div className="ref-rail-controls"><button className="circle-button" aria-label="Dịch vụ trước" onClick={()=>scroll(-1)}><ChevronLeft/></button><button className="circle-button" aria-label="Dịch vụ tiếp theo" onClick={()=>scroll(1)}><ChevronRight/></button></div></div>
  </section>;
}
function CustomersAndStories() {
  const area=useRef<HTMLElement>(null), row=useRef<HTMLDivElement>(null);
  const auto=useHomeCarousel(area,()=>advanceHomeRail(row.current));
  const scroll=(direction:number)=>{
    const rail=row.current;
    if (!rail) return;
    const step=rail.children.length>1 ? (rail.children[1] as HTMLElement).offsetLeft-(rail.children[0] as HTMLElement).offsetLeft : rail.clientWidth;
    rail.scrollBy({left:direction*(step || rail.clientWidth),behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  };
  return <section ref={area} className="section-home-customer ref-home-section ref-carousel-area">
    <div className="ref-customer-logos"><h2 className="ref-heading ref-center">Đối tác tiêu biểu</h2><PartnersStrip/></div>
    <div className="container ref-customer-review"><h2 className="ref-heading ref-center">Đồng hành bằng<br/>sự thấu hiểu.</h2><p className="ref-center ref-story-note">Tình huống minh họa · Nhân vật giả định</p>
      <div className="ref-testimonial-wrap">
        <img className="ref-testimonial-edge ref-testimonial-edge-left" src="/mirror/www.hr2b.com/wp-content/themes/canhcamtheme/img/edge-3.png" alt="" aria-hidden="true"/>
        <img className="ref-testimonial-edge ref-testimonial-edge-right" src="/mirror/www.hr2b.com/wp-content/themes/canhcamtheme/img/edge-4.png" alt="" aria-hidden="true"/>
        <div ref={row} className="ref-testimonial-track" role="region" aria-label="NHỮNG CÂU CHUYỆN KẾT NỐI" tabIndex={0} aria-live="off">{stories.map(story=><article className="ref-testimonial-card" key={story.name}><div className="ref-testimonial-content">{story.quote}</div><div className="ref-testimonial-person"><span className="ref-testimonial-avatar" aria-hidden="true"><Users size={25}/></span><div><strong>{story.name}</strong><small>{story.role}</small></div></div></article>)}</div>
        <CarouselPause paused={auto.paused} toggle={auto.toggle}/><div className="ref-story-controls"><button className="circle-button" aria-label="Câu chuyện trước" onClick={()=>scroll(-1)}><ChevronLeft size={19}/></button><button className="circle-button" aria-label="Câu chuyện tiếp theo" onClick={()=>scroll(1)}><ChevronRight size={19}/></button></div>
      </div>
    </div>
  </section>;
}
function Partners() {
  return <section className="section-home-coop ref-home-section"><div className="container"><h2 className="ref-heading ref-center">Đối tác tiêu biểu</h2><div className="ref-partner-grid">{partners.map(name=><div className="ref-partner-item" key={name}><PartnerLogo name={name}/></div>)}</div><div className="ref-centered-action"><Link to="/partners" className="text-link">Khám phá mạng lưới <ArrowUpRight size={18}/></Link></div></div></section>;
}
function News() {
  const row=useRef<HTMLDivElement>(null), area=useRef<HTMLElement>(null), t=useTranslation();
  const auto=useHomeCarousel(area,()=>advanceHomeRail(row.current));
  const scroll=(direction:number)=>row.current?.scrollBy({left:direction*(row.current?.clientWidth || 350)*.8,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  const articles=[
    {to:'/news/ho-so-xin-viec',title:'Chuẩn bị hồ sơ xin việc: bắt đầu từ những điều cần thiết',tag:'CẨM NANG VIỆC LÀM · NỘI DUNG MẪU',image:'Tin-tuc.jpg'},
    {to:'/news/chon-cong-viec-phu-hop',title:'Lựa chọn công việc phù hợp với bạn',tag:'ĐỊNH HƯỚNG NGHỀ NGHIỆP',image:'GPNS-1.jpg'},
    {to:'/news/nhu-cau-tuyen-dung',title:'Chuẩn bị nhu cầu tuyển dụng cho doanh nghiệp',tag:'GÓC DOANH NGHIỆP',image:'GPNS-2.jpg'},
    {to:'/news/thong-tin-tuyen-dung-minh-bach',title:'Thông tin tuyển dụng rõ ràng tạo nên kết nối tốt hơn',tag:'GÓC DOANH NGHIỆP',image:'GPNS-3.jpg'},
  ];
  return <section ref={area} className="section-home-news ref-home-section ref-carousel-area"><div className="container"><h2 className="ref-heading ref-center">Đồng hành cùng bạn</h2><div className="ref-news-grid" ref={row} tabIndex={0} role="region" aria-label={t({vi:"Tin tức",en:"News",zh:"新闻",ko:"뉴스",ja:"ニュース"})}>{articles.map(a=><article className="ref-news-card" key={a.to}><Link to={a.to} className="ref-news-image"><img src={MEDIA+'2025/09/'+a.image} alt="" loading="lazy"/></Link><span>{a.tag}</span><h3><Link to={a.to}>{a.title}</Link></h3><Link to={a.to} className="text-link">Đọc bài viết <ArrowUpRight size={18}/></Link></article>)}</div><CarouselPause paused={auto.paused} toggle={auto.toggle}/><div className="ref-rail-controls"><button className="circle-button" aria-label={t({vi:'Tin tức trước',en:'Previous news',zh:'上一条新闻',ko:'이전 뉴스',ja:'前のニュース'})} onClick={()=>scroll(-1)}><ChevronLeft/></button><button className="circle-button" aria-label={t({vi:'Tin tức tiếp theo',en:'Next news',zh:'下一条新闻',ko:'다음 뉴스',ja:'次のニュース'})} onClick={()=>scroll(1)}><ChevronRight/></button></div><div className="ref-centered-action"><ButtonLink to="/news" secondary>Xem tất cả tin tức</ButtonLink></div></div></section>;
}
function Events() {
  return <section className="section-home-event ref-home-section"><div className="container"><h2 className="ref-heading ref-center">Gặp gỡ để mở<br/>thêm cơ hội.</h2><article className="ref-event"><img src={MEDIA+'2025/09/Co-hoi-viec-lam-scaled.jpg'} alt="Hình ảnh minh họa hoạt động kết nối việc làm" loading="lazy"/><div><span className="eyebrow">SỰ KIỆN MINH HỌA</span><h3>Ngày hội kết nối việc làm</h3><p>Gặp gỡ, tìm hiểu cơ hội và trao đổi trực tiếp về hành trình nghề nghiệp.</p></div></article><div className="ref-centered-action"><ButtonLink to="/events">Khám phá sự kiện</ButtonLink></div><p className="ref-demo-note">Hình ảnh và hoạt động mang tính minh họa cho giao diện.</p></div></section>;
}
function IntroVideos() {
  const [open,setOpen]=useState(false), t=useTranslation(), locale=useLocale();
  const heading=t({vi:'Video minh họa',en:'Illustrative video',zh:'示意视频',ko:'예시 영상',ja:'イメージ動画'});
  const note=t({vi:'Bốn hình xem trước cùng mở một video minh họa; hình ảnh không thể hiện hoạt động thực tế của Minh Đức.',en:'All four previews open the same illustrative video; the images do not depict actual Minh Đức activities.',zh:'四个预览均打开同一示意视频；画面并非 Minh Đức 的实际活动。',ko:'네 개의 미리보기는 모두 같은 예시 영상을 엽니다. 영상은 Minh Đức의 실제 활동이 아닙니다.',ja:'4つのプレビューは同じイメージ動画を開きます。映像はMinh Đứcの実際の活動ではありません。'});
  const play=t({vi:'Phát video minh họa',en:'Play illustrative video',zh:'播放示意视频',ko:'예시 영상 재생',ja:'イメージ動画を再生'});
  return <section className="section-home-video ref-home-section"><span className="ref-video-big-text" aria-hidden="true">MINH ĐỨC</span><div className="container"><h2 className="ref-heading ref-center">{heading}</h2><p className="ref-video-note">{note}</p><div className="ref-video-grid">{services.slice(0,4).map(s=><button className="ref-video-card" type="button" key={s.path} onClick={()=>setOpen(true)} aria-label={`${play}: ${String(translate(s.title,locale))}`}><span className="ref-video-image"><img src={MEDIA+'2025/09/'+s.image} alt="" loading="lazy"/><span className="ref-video-play" aria-hidden="true"><Play size={22}/></span></span><span className="ref-video-title">{s.title}</span><span className="ref-video-description">{s.desc}</span></button>)}</div></div>{open&&<Modal title={heading} onClose={()=>setOpen(false)}><p className="ref-video-dialog-note">{note}</p><video className="ref-video-player" controls autoPlay playsInline preload="metadata" tabIndex={0} poster="/optimized/assets/hero-poster-960.webp"><source src="/optimized/hero-1600-e945407f.mp4" type="video/mp4"/></video></Modal>}</section>;
}
export default function Home() {
  return <><HomeHero/><About/><Achievements/><Solutions/><CustomersAndStories/><Partners/><News/><Events/><IntroVideos/></>;
}
