import {useEffect, useRef, useState, type KeyboardEvent} from 'react';
import {Link, useLocation, useNavigationType} from 'react-router-dom';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import {PageMasthead} from '../../PageMasthead';
import {Modal} from '../../shared';
import {useTranslation} from '../../i18n';
import {RevealFrame} from '../../motion';
import {advanceHomeRail, useHomeCarousel} from '../../useHomeCarousel';
import {partners} from '../../partners';
import PartnerLogo from '../../PartnerLogo';
import {contact, services} from './data';
import {InfoCarouselPause, ServiceCards, InfoContact} from './components';
import './about-reference.css';
import './info-v16.css';

const staffingInquiry = {to:'/about-us#business-contact', state:{startForm:'F01'}} as const;

const chapters = [
  ['profile', 'Hồ sơ năng lực'],
  ['history', 'Quá trình hình thành và phát triển'],
  ['partners', 'Đối tác tiêu biểu'],
  ['activities', 'Hoạt động tập thể'],
  ['achievements', 'Thành tựu và dấu ấn'],
] as const;

const phases = [
  {label:'Khởi đầu', title:'Khởi đầu từ kết nối', text:'Tiếp nhận nhu cầu tìm việc và tuyển dụng, làm rõ thông tin để hai bên có cơ sở trao đổi.', detail:'Doanh nghiệp mô tả vị trí, ca làm và nơi làm việc. Người lao động có thể hỏi về từng điều kiện trước khi quyết định.', image:'/assets/minhduc-meeting-10s.webp', alt:'Nhóm Minh Đức trao đổi trong phòng họp'},
  {label:'Đồng hành', title:'Đồng hành từng bước', text:'Hướng dẫn người lao động tìm hiểu công việc, hồ sơ và các bước tiếp theo.', detail:'Người tư vấn cùng người tìm việc rà lại thông tin vị trí và các giấy tờ cần chuẩn bị cho buổi trao đổi.', image:'/assets/minhduc-working-60s.webp', alt:'Nhân sự Minh Đức trao đổi và ghi chép trong buổi làm việc'},
  {label:'Mở rộng', title:'Mở rộng giải pháp', text:'Trao đổi thêm về nhân lực, tổ chức và học tập theo nhu cầu thực tế.', detail:'Khi nhu cầu thay đổi, hai bên có thể trao đổi thêm về tuyển người có tay nghề, tổ chức quy trình hoặc hình thức học phù hợp.', image:'/assets/minhduc-v16/recruitment-event.webp', alt:'Nhóm người giữa hai bảng thông tin tuyển dụng tại hội trường'},
] as const;

const values = [
  {title:'Tầm nhìn', text:'Trở thành cầu nối tin cậy giữa doanh nghiệp và người lao động, tạo nên những kết nối công việc bền vững.'},
  {title:'Sứ mệnh', text:'Lắng nghe nhu cầu, kết nối cơ hội và đồng hành cùng người lao động trên hành trình tìm việc.'},
  {title:'Giá trị cốt lõi', text:'Minh bạch trong thông tin. Tận tâm trong hỗ trợ. Trách nhiệm trong từng kết nối.'},
];

const roles = [
  {title:'Tư vấn nhân sự', text:'Nhóm tư vấn lắng nghe nhu cầu về vị trí, ca và số lượng để cùng doanh nghiệp chuẩn bị phương án nhân lực.', to:'/services', action:'Xem dịch vụ'},
  {title:'Tư vấn và giới thiệu việc làm', text:'Người tư vấn giúp bạn đối chiếu nơi làm việc, thu nhập và lịch ca với nhu cầu của mình.', to:'/jobs', action:'Xem việc làm'},
  {title:'Tư vấn tuyển sinh', text:'Trao đổi về hình thức học, thông tin chương trình và các giấy tờ cần chuẩn bị.', to:'/education', action:'Xem chương trình'},
  {title:'Cung ứng nhân lực', text:'Nhóm cung ứng làm rõ số người, nơi tiếp nhận và ngày cần nhân sự cho từng đợt tuyển.', to:staffingInquiry.to, action:'Gửi nhu cầu nhân lực'},
] as const;

const milestones = [
  {title:'Thông tin rõ ràng', text:'Làm rõ vị trí, điều kiện và nhu cầu trước khi kết nối.'},
  {title:'Hỗ trợ gần gũi', text:'Đồng hành cùng người lao động trong quá trình tìm hiểu cơ hội.'},
  {title:'Phối hợp cùng doanh nghiệp', text:'Trao đổi phương án nhân lực theo yêu cầu cụ thể.'},
];

const activities = [
  {image:'team-yearend', title:'Gặp gỡ cuối năm', alt:'Tập thể Minh Đức trong buổi gặp gỡ cuối năm'},
  {image:'yearend-gifts', title:'Trao quà trong buổi tất niên', alt:'Mọi người cùng chụp ảnh với những phần quà trong buổi gặp gỡ'},
  {image:'culture-birthday', title:'Mừng sinh nhật cùng đồng nghiệp', alt:'Tập thể cùng nhau mừng sinh nhật'},
  {image:'community', title:'Kết nối cộng đồng', alt:'Nhóm người cùng dụng cụ vệ sinh ngoài trời'},
];

function ChapterNav(){
  const [open,setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const {hash} = useLocation();
  return <nav className="about-chapters container" aria-label="Mục lục giới thiệu" onKeyDown={event=>{
    if(event.key==='Escape' && open){setOpen(false);toggle.current?.focus();}
  }}>
    <button type="button" ref={toggle} aria-expanded={open} aria-controls="about-chapter-list" onClick={()=>setOpen(!open)}>Đến một mục</button>
    <ul id="about-chapter-list" data-open={open}>
      {chapters.map(([id,label])=><li key={id}><Link to={'/about-us#'+id} aria-current={hash==='#'+id?'location':undefined} onClick={()=>setOpen(false)}>{label}</Link></li>)}
    </ul>
  </nav>;
}

function HistorySection(){
  const [phase,setPhase] = useState(0);
  const [detail,setDetail] = useState(false);
  const previous = useRef(0);
  const area = useRef<HTMLElement>(null);
  const change = (next:number) => {
    previous.current=phase;
    setPhase((next+phases.length)%phases.length);
  };
  const auto = useHomeCarousel(area,()=>change(phase+1),'.about-history-interaction',{intervalMs:7000,disabled:detail});
  const keyboard = (event:KeyboardEvent<HTMLButtonElement>,index:number) => {
    const targets:Record<string,number> = {ArrowRight:(index+1)%phases.length,ArrowLeft:(index+phases.length-1)%phases.length,Home:0,End:phases.length-1};
    const next=targets[event.key];
    if(next===undefined)return;
    event.preventDefault();
    change(next);
    document.getElementById('history-tab-'+next)?.focus();
  };
  const position = (index:number,current:number) => ((index-current+4)%3)-1;
  return <section id="history" className="section info-history" ref={area}>
    <div className="container">
      <h2>Quá trình hình thành và phát triển</h2>
      <p className="about-intro-line">Từ việc lắng nghe nhu cầu đến đồng hành cùng người lao động và doanh nghiệp.</p>
      <div className="about-history-interaction">
        <div className="about-rail-header">
          <div className="info-history-track" role="tablist" aria-label="Các giai đoạn">
            {phases.map((item,index)=><button key={item.label} type="button" role="tab" id={'history-tab-'+index} aria-selected={phase===index} aria-controls="history-panel" tabIndex={phase===index?0:-1} onKeyDown={event=>keyboard(event,index)} onClick={()=>change(index)}>{item.label}</button>)}
          </div>
          <div className="about-rail-actions">
            <InfoCarouselPause paused={auto.paused} toggle={auto.toggle}/>
            <button type="button" className="circle-button" aria-label="Giai đoạn trước" onClick={()=>change(phase-1)}><ChevronLeft aria-hidden="true"/></button>
            <button type="button" className="circle-button" aria-label="Giai đoạn tiếp theo" onClick={()=>change(phase+1)}><ChevronRight aria-hidden="true"/></button>
          </div>
        </div>
        <RevealFrame effect="up"><div className="info-history-rail">
          {phases.map((item,index)=>{
            const slot=position(index,phase);
            const active=slot===0;
            const recycled=Math.abs(slot-position(index,previous.current))===2;
            return <article key={item.label} className={['info-history-slide',active?'is-active':'is-side',recycled?'is-recycled':'','md-history-position-'+(slot+1)].join(' ')}
              role={active?'tabpanel':undefined} aria-hidden={active?undefined:true} id={active?'history-panel':undefined} aria-labelledby={active?'history-tab-'+phase:undefined}>
              <div className="md-history-image"><img src={item.image} alt={item.alt} loading="lazy" decoding="async"/></div>
              <div className="about-history-copy"><h3>{item.title}</h3><p>{item.text}</p>
                {active&&<button type="button" className="about-text-action" onClick={()=>setDetail(true)}>Xem chi tiết</button>}</div>
            </article>;
          })}
        </div></RevealFrame>
      </div>
    </div>
    {detail&&<Modal title={phases[phase].title} onClose={()=>setDetail(false)}>
      <img className="md-history-dialog-image" src={phases[phase].image} alt={phases[phase].alt}/>
      <p>{phases[phase].detail}</p>
    </Modal>}
  </section>;
}

function AboutTeam(){
  const [selected,setSelected] = useState<(typeof roles)[number]|null>(null);
  return <section className="section container info-team">
    <h2>Đội ngũ Minh Đức sẵn sàng hỗ trợ</h2>
    <div className="md-team-overview">
      <RevealFrame effect="media"><img className="md-team-photo" src="/assets/minhduc-meeting-10s.webp" alt="Nhóm Minh Đức trao đổi trong phòng họp" width="1024" height="576" loading="lazy"/></RevealFrame>
      <div className="info-team-grid">{roles.map(role=><button type="button" key={role.title} className="info-team-card" onClick={()=>setSelected(role)} aria-haspopup="dialog">{role.title}</button>)}</div>
    </div>
    {selected&&<Modal title={selected.title} onClose={()=>setSelected(null)}><p>{selected.text}</p>
      <Link className="btn" to={selected.to} state={selected.to===staffingInquiry.to ? staffingInquiry.state : undefined} onClick={()=>setSelected(null)}>{selected.action}</Link></Modal>}
  </section>;
}

function AboutActivities(){
  return <section id="activities" className="section md-v16-activities"><div className="container">
    <h2>Những kết nối tạo nên Minh Đức</h2>
    <div className="md-v16-activities-grid">{activities.map((item,index)=>
      <RevealFrame key={item.image} effect="media" delayMs={index*200}>
        <figure className="md-v16-activity"><img src={'/assets/minhduc-v16/'+item.image+'.webp'} sizes={index===0?'(max-width:767px) 100vw, 78vw':'(max-width:767px) 100vw, 32vw'} alt={item.alt} loading="lazy" decoding="async"/>
          <figcaption>{item.title}</figcaption></figure>
      </RevealFrame>)}</div>
  </div></section>;
}

function AboutMilestones(){
  const area=useRef<HTMLElement>(null);
  const track=useRef<HTMLDivElement>(null);
  const [overflow,setOverflow]=useState(false);
  useEffect(()=>{
    const rail=track.current;
    if(!rail)return;
    const measure=()=>setOverflow(rail.scrollWidth>rail.clientWidth+1);
    measure();
    const observer=typeof ResizeObserver==='undefined'?undefined:new ResizeObserver(measure);
    observer?.observe(rail);
    window.addEventListener('resize',measure);
    return ()=>{observer?.disconnect();window.removeEventListener('resize',measure);};
  },[]);
  const auto=useHomeCarousel(area,()=>advanceHomeRail(track.current),'.about-milestone-interaction',{disabled:!overflow});
  const scroll=(direction:number)=>{
    const rail=track.current;
    if(!rail)return;
    const first=rail.children[0] as HTMLElement;
    const second=rail.children[1] as HTMLElement;
    const end=rail.scrollWidth-rail.clientWidth;
    const target=direction<0 && rail.scrollLeft<2?end:direction>0 && rail.scrollLeft>=end-2?0:rail.scrollLeft+direction*(second.offsetLeft-first.offsetLeft);
    rail.scrollTo({left:target,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  };
  return <section id="achievements" ref={area} className="section container info-documentation"><h2>Thành tựu và dấu ấn</h2>
    <p className="about-intro-line">Những ưu tiên định hình cách chúng tôi đồng hành cùng doanh nghiệp và người lao động.</p>
    <div className="about-milestone-interaction">
      <RevealFrame effect="up"><div className="info-document-grid" ref={track} role="region" tabIndex={overflow?0:undefined} aria-label="Cách chúng tôi đồng hành">
        {milestones.map(item=><article className="info-document-card" key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}
      </div></RevealFrame>
      {overflow&&<div className="about-rail-actions"><InfoCarouselPause paused={auto.paused} toggle={auto.toggle}/>
        <button type="button" className="circle-button" aria-label="Mục trước" onClick={()=>scroll(-1)}><ChevronLeft aria-hidden="true"/></button>
        <button type="button" className="circle-button" aria-label="Mục tiếp theo" onClick={()=>scroll(1)}><ChevronRight aria-hidden="true"/></button></div>}
    </div>
  </section>;
}

export function AboutPage(){
  const t=useTranslation();
  const {hash,key,state}=useLocation();
  const [formRequestKey,setFormRequestKey]=useState<string>();
  const navType=useNavigationType();
  const previousKey=useRef<string|null>(null);
  useEffect(()=>{
    // POP restores reading position on Back/Forward. Initial deep links still focus their heading.
    const restored=previousKey.current!==null && previousKey.current!==key && navType==='POP';
    previousKey.current=key;
    if(!hash||restored)return;
    if(hash==='#business-contact' && state?.startForm==='F01' && navType!=='POP')setFormRequestKey(key);
    const heading=document.getElementById(hash.slice(1))?.querySelector<HTMLElement>('h2');
    if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}
  },[hash,key,navType,state]);
  const metrics=[
    [String(services.length).padStart(2,'0'),t({vi:'Nhóm dịch vụ',en:'Service groups',zh:'服务类别',ko:'서비스 분야',ja:'サービス分野'})],
    [String(contact.offices.length).padStart(2,'0'),t({vi:'Điểm kết nối',en:'Connection points',zh:'联系地点',ko:'연결 거점',ja:'つながりの拠点'})],
    ['B2B',t({vi:'Hướng tới doanh nghiệp',en:'Focused on businesses',zh:'面向企业',ko:'기업을 위한 방향',ja:'企業に向けた取り組み'})],
    ['FDI',t({vi:'Định hướng kết nối',en:'Connection focus',zh:'连接方向',ko:'연결 지향',ja:'つながりへの取り組み'})],
  ];
  return <div className="about-page">
    <PageMasthead title="Về Minh Đức" eyebrow="Nhân lực là tài sản" description="Minh Đức kết nối nhà máy phía Bắc với người lao động, từ lúc làm rõ vị trí đến khi hai bên trao đổi về công việc." image="/assets/minhduc-v18/about-team.webp" imageAlt="Đội ngũ Minh Đức cầm cờ trước biển hiệu công ty">
      <Link className="btn" {...staffingInquiry}>Gửi nhu cầu nhân lực</Link>
      <Link className="btn btn-secondary" to="/e-brochure">Xem hồ sơ năng lực</Link>
    </PageMasthead>
    <ChapterNav/>
    <section id="profile" className="section info-about-intro"><div className="container info-about-statement">
      <div><h2>Hồ sơ năng lực</h2><Link className="about-text-action" to="/e-brochure">Đọc hồ sơ trực tuyến</Link></div>
      <div><p className="info-lead">Minh Đức hoạt động trong lĩnh vực cung ứng nhân lực và giới thiệu việc làm, tập trung vào nhu cầu lao động phổ thông tại các nhà máy, doanh nghiệp sản xuất.</p>
        <p>Chúng tôi hướng tới đồng hành cùng các nhà máy và doanh nghiệp sản xuất, bao gồm doanh nghiệp FDI, tại khu vực phía Bắc.</p></div>
      <div className="info-about-values">{values.map((item,index)=><RevealFrame effect="up" delayMs={index*200} key={item.title}><article><h3>{item.title}</h3><p>{item.text}</p></article></RevealFrame>)}</div>
    </div></section>
    <section className="info-about-statistics" aria-label="Phạm vi hoạt động"><div className="container"><div className="info-stat-grid">
      {metrics.map(([value,name],index)=><RevealFrame key={value} effect="up" delayMs={index*200}><article><strong>{value}</strong><span>{name}</span></article></RevealFrame>)}
    </div></div></section>
    <HistorySection/>
    <section id="partners" className="section container md-about-partners"><h2>Đối tác tiêu biểu</h2>
      <p className="about-intro-line">Các đối tác được giới thiệu trong hồ sơ thông tin Minh Đức.</p>
      <div className="info-partner-list">{partners.map((name,index)=><RevealFrame key={name} effect="up" delayMs={index*200} contentClassName="info-partner"><PartnerLogo name={name}/></RevealFrame>)}</div>
      <Link className="about-text-action" to="/partners">Xem danh sách đối tác</Link></section>
    <AboutTeam/><AboutActivities/><AboutMilestones/>
    <section className="section container about-solutions"><h2>Giải pháp nhân lực</h2><ServiceCards/></section>
    <InfoContact id="business-contact" formRequestKey={formRequestKey}/>
  </div>;
}
