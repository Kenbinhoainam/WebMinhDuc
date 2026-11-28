import {useEffect, useRef, useState, type KeyboardEvent} from 'react';
import {Link, useLocation, useNavigationType} from 'react-router-dom';
import {ArrowRight, ChevronRight, Compass, Handshake, Telescope} from 'lucide-react';
import {PageMasthead} from '../../PageMasthead';
import {ServiceCards} from '../../ServiceShowcase';
import {Modal} from '../../shared';
import {useTranslation} from '../../i18n';
import {RevealFrame} from '../../motion';
import {advanceHomeRail, useHomeCarousel} from '../../useHomeCarousel';
import {partners} from '../../partners';
import PartnerLogo from '../../PartnerLogo';
import {contact, services} from './data';
import {InfoContact} from './components';
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
  {label:'Khởi đầu', title:'Khởi đầu từ kết nối', text:'Tiếp nhận nhu cầu tìm việc và tuyển dụng, làm rõ thông tin để hai bên có cơ sở trao đổi.', detail:'Doanh nghiệp mô tả vị trí, ca làm và nơi làm việc. Người lao động có thể hỏi về từng điều kiện trước khi quyết định.', image:'/WebMinhDuc/assets/minhduc-meeting-10s.webp', alt:'Nhóm Minh Đức trao đổi trong phòng họp'},
  {label:'Đồng hành', title:'Đồng hành từng bước', text:'Hướng dẫn người lao động tìm hiểu công việc, hồ sơ và các bước tiếp theo.', detail:'Người tư vấn cùng người tìm việc rà lại thông tin vị trí và các giấy tờ cần chuẩn bị cho buổi trao đổi.', image:'/WebMinhDuc/assets/minhduc-working-60s.webp', alt:'Nhân sự Minh Đức trao đổi và ghi chép trong buổi làm việc'},
  {label:'Mở rộng', title:'Mở rộng giải pháp', text:'Trao đổi thêm về nhân lực, tổ chức và học tập theo nhu cầu thực tế.', detail:'Khi nhu cầu thay đổi, hai bên có thể trao đổi thêm về tuyển người có tay nghề, tổ chức quy trình hoặc hình thức học phù hợp.', image:'/WebMinhDuc/assets/minhduc-v16/recruitment-event.webp', alt:'Nhóm người giữa hai bảng thông tin tuyển dụng tại hội trường'},
] as const;

const values = [
  {icon:Telescope, title:'Tầm nhìn', text:'Trở thành cầu nối tin cậy giữa doanh nghiệp và người lao động, tạo nên những kết nối công việc bền vững.'},
  {icon:Compass, title:'Sứ mệnh', text:'Lắng nghe nhu cầu, kết nối cơ hội và đồng hành cùng người lao động trên hành trình tìm việc.'},
  {icon:Handshake, title:'Giá trị cốt lõi', text:'Minh bạch trong thông tin. Tận tâm trong hỗ trợ. Trách nhiệm trong từng kết nối.'},
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
  const [paused,setPaused] = useState(false);
  const area = useRef<HTMLElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const scrollingTo = useRef<number | null>(null);
  const change = (next: number, immediate = false) => {
    const track = rail.current;
    const index = (next + phases.length) % phases.length;
    const card = track?.children[index] as HTMLElement | undefined;
    setPhase(index);
    if (!track || !card || !track.clientWidth) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const left = card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2;
    const behavior = immediate || reduce ? 'instant' : 'smooth';
    scrollingTo.current = behavior === 'smooth' ? left : null;
    track.scrollTo({left, behavior});
  };
  useHomeCarousel(area, () => change(phase + 1, phase === phases.length - 1), '.about-history-interaction', {intervalMs:6000, disabled:detail, paused});
  useEffect(() => {
    const track = rail.current;
    if (!track) return;
    let settle: number | undefined;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const cancelTarget = () => {scrollingTo.current = null;};
    const finishImmediately = () => {
      if (motion.matches && scrollingTo.current !== null) {
        track.scrollTo({left:scrollingTo.current, behavior:'instant'});
        cancelTarget();
      }
    };
    function readSelection() {
      if (!track || !track.clientWidth) return;
      cancelTarget();
      const center = track.scrollLeft + track.clientWidth / 2;
      const cards = Array.from(track.children) as HTMLElement[];
      const distances = cards.map(card => Math.abs(card.offsetLeft + card.offsetWidth / 2 - center));
      setPhase(distances.indexOf(Math.min(...distances)));
    }
    const scrolled = () => {
      window.clearTimeout(settle);
      settle = window.setTimeout(readSelection, 110);
    };
    track.addEventListener('scroll', scrolled, {passive:true});
    track.addEventListener('pointerdown', cancelTarget, {passive:true});
    track.addEventListener('wheel', cancelTarget, {passive:true});
    track.addEventListener('keydown', cancelTarget);
    motion.addEventListener('change', finishImmediately);
    return () => {
      window.clearTimeout(settle);
      track.removeEventListener('scroll', scrolled);
      track.removeEventListener('pointerdown', cancelTarget);
      track.removeEventListener('wheel', cancelTarget);
      track.removeEventListener('keydown', cancelTarget);
      motion.removeEventListener('change', finishImmediately);
    };
  }, []);
  const keyboard = (event:KeyboardEvent<HTMLButtonElement>,index:number) => {
    const targets:Record<string,number> = {ArrowRight:(index+1)%phases.length,ArrowLeft:(index+phases.length-1)%phases.length,Home:0,End:phases.length-1};
    const next=targets[event.key];
    if(next===undefined)return;
    event.preventDefault();
    change(next,true);
    document.getElementById('history-tab-'+next)?.focus();
  };
  return <section id="history" className="section info-history" ref={area}>
    <div className="container">
      <h2>Quá trình hình thành và phát triển</h2>
      <p className="about-intro-line">Từ việc lắng nghe nhu cầu đến đồng hành cùng người lao động và doanh nghiệp.</p>
      <div className="about-history-interaction">
        <div className="about-rail-header">
          <div className="info-history-track" role="tablist" aria-label="Các giai đoạn">
            {phases.map((item,index)=><button key={item.label} type="button" role="tab" id={'history-tab-'+index} aria-selected={phase===index} aria-controls="history-panel" tabIndex={phase===index?0:-1} onKeyDown={event=>keyboard(event,index)} onClick={event=>change(index,event.detail===0)}>{item.label}</button>)}
          </div>
          <button className="about-rail-pause" type="button" aria-controls="history-track"
            onClick={()=>setPaused(value=>!value)}>{paused?'Phát chuyển động':'Tạm dừng chuyển động'}</button>
        </div>
        <RevealFrame effect="up"><div id="history-track" className="info-history-rail" ref={rail} data-auto-rail tabIndex={0} role="region" aria-label="Các giai đoạn">
          {phases.map((item,index)=>{
            const active=index===phase;
            return <article key={item.label} className={'info-history-slide '+(active?'is-active':'is-side')}
              role={active?'tabpanel':undefined} aria-hidden={active?undefined:true} id={active?'history-panel':undefined} aria-labelledby={active?'history-tab-'+phase:undefined}>
              <div className="md-history-image"><img src={item.image} alt={item.alt} sizes="(max-width:767px) 100vw, (max-width:1440px) 64vw, 800px" loading="lazy" decoding="async"/></div>
              <div className="about-history-copy"><h3>{item.title}</h3><p>{item.text}</p>
                {active&&<button type="button" className="about-text-action" aria-haspopup="dialog" onClick={()=>setDetail(true)}>Xem chi tiết</button>}</div>
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
      <RevealFrame effect="media"><img className="md-team-photo" src="/WebMinhDuc/assets/minhduc-v18/field-team.webp" alt="Nhóm nhân viên Minh Đức trao đổi ngoài trời" sizes="(max-width:767px) calc(100vw - 40px), (max-width:1280px) 45vw, 580px" loading="lazy" decoding="async"/></RevealFrame>
      <div className="info-team-grid">{roles.map(role=><button type="button" key={role.title} className="info-team-card" onClick={()=>setSelected(role)} aria-haspopup="dialog">{role.title}<ChevronRight aria-hidden="true" size={20}/></button>)}</div>
    </div>
    {selected&&<Modal title={selected.title} onClose={()=>setSelected(null)}><p>{selected.text}</p>
      <Link className="btn" to={selected.to} state={selected.to===staffingInquiry.to ? staffingInquiry.state : undefined} onClick={()=>setSelected(null)}>{selected.action}</Link></Modal>}
  </section>;
}

function AboutActivities(){
  return <section id="activities" className="section md-v16-activities"><div className="container">
    <h2>Những kết nối tạo nên Minh Đức</h2>
    <div className="md-v16-activities-grid">{activities.map((item,index)=>
      <RevealFrame key={item.image} effect="media" delayMs={index*80}>
        <figure className="md-v16-activity"><img src={'/WebMinhDuc/assets/minhduc-v16/'+item.image+'.webp'} sizes={index===0 || index===3?'(max-width:767px) calc(100vw - 40px), (max-width:1280px) 55vw, 664px':'(max-width:767px) calc(100vw - 40px), (max-width:1280px) 38vw, 470px'} alt={item.alt} loading="lazy" decoding="async"/>
          <figcaption>{item.title}</figcaption></figure>
      </RevealFrame>)}</div>
  </div></section>;
}

function AboutMilestones(){
  const area=useRef<HTMLElement>(null);
  const track=useRef<HTMLDivElement>(null);
  const [overflow,setOverflow]=useState(false);
  const [paused,setPaused]=useState(false);
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
  useHomeCarousel(area,()=>advanceHomeRail(track.current),'.about-milestone-interaction',{intervalMs:6000,disabled:!overflow,paused});
  return <section id="achievements" ref={area} className="section container info-documentation"><h2>Thành tựu và dấu ấn</h2>
    <p className="about-intro-line">Những ưu tiên định hình cách chúng tôi đồng hành cùng doanh nghiệp và người lao động.</p>
    <div className="about-milestone-interaction">
      {overflow && <button className="about-rail-pause" type="button" aria-controls="about-milestones"
        onClick={()=>setPaused(value=>!value)}>{paused?'Phát chuyển động':'Tạm dừng chuyển động'}</button>}
      <RevealFrame effect="up"><div id="about-milestones" className="info-document-grid" ref={track} data-auto-rail role="region" tabIndex={overflow?0:undefined} aria-label="Cách chúng tôi đồng hành">
        {milestones.map(item=><article className="info-document-card" key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}
      </div></RevealFrame>

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
    <PageMasthead variant="photo" title="Về Minh Đức" image="/WebMinhDuc/assets/minhduc-v18/about-team.webp" imageAlt="Đội ngũ Minh Đức cầm cờ trước biển hiệu công ty"/>
    <ChapterNav/>
    <section id="profile" className="section container about-profile" aria-labelledby="about-profile-title">
      <div className="about-profile-intro">
        <RevealFrame effect="left">
          <h2 id="about-profile-title">Hồ sơ năng lực</h2>
          <p className="about-profile-lead">Nhân lực cho nhà máy miền Bắc</p>
        </RevealFrame>
        <RevealFrame effect="right">
          <p>{t({vi:'Từ các điểm kết nối tại Bắc Ninh và Quảng Ninh, Minh Đức cùng nhà máy làm rõ vị trí, ca làm và kỹ năng cần tuyển để tìm người phù hợp.',en:'From our locations in Bắc Ninh and Quảng Ninh, we work with factories to identify roles, shifts and skills before matching workers to the job.',zh:'通过北宁和广宁的服务网点，明德与工厂明确岗位、班次和技能要求，再匹配合适的员工。',ko:'민득은 박닌과 꽝닌의 거점을 통해 공장과 함께 직무, 교대 시간, 필요한 기술을 확인한 뒤 적합한 인력을 연결합니다.',ja:'ミンドゥックはバクニンとクアンニンの拠点を通じて、工場とともに職種、シフト、必要な技能を確認し、仕事に合う人材を紹介します。'})}</p>
          <div className="about-profile-actions">
            <Link className="btn" {...staffingInquiry}>Gửi nhu cầu nhân lực</Link>
            <Link className="about-text-action" to="/services">Xem các dịch vụ <ArrowRight size={18} aria-hidden="true"/></Link>
          </div>
        </RevealFrame>
      </div>
      <div className="info-about-values">
        {values.map(({icon:Icon,title,text},index)=><RevealFrame effect="up" delayMs={index*80} key={title}>
          <article><Icon size={36} strokeWidth={1.4} aria-hidden="true"/><h3>{title}</h3><p>{text}</p></article>
        </RevealFrame>)}
      </div>
      <div className="about-scope" role="group" aria-label="Phạm vi hoạt động">
        {metrics.map(([value,name],index)=><RevealFrame key={name} delayMs={index*80}>
          <div className="about-scope-item"><strong>{value}</strong><span>{name}</span></div>
        </RevealFrame>)}
      </div>
    </section>
    <HistorySection/>
    <section id="partners" className="section container md-about-partners"><h2>Đối tác tiêu biểu</h2>
      <p className="about-intro-line">Các đối tác được giới thiệu trong hồ sơ thông tin Minh Đức.</p>
      <div className="info-partner-list">{partners.map((name,index)=><RevealFrame key={name} effect="up" delayMs={index*80} contentClassName="info-partner"><PartnerLogo name={name}/></RevealFrame>)}</div>
      <Link className="about-text-action" to="/partners">Xem danh sách đối tác</Link></section>
    <AboutTeam/><AboutActivities/><AboutMilestones/>
    <section className="section container about-solutions"><h2>Giải pháp nhân lực</h2><ServiceCards/></section>
    <InfoContact id="business-contact" formRequestKey={formRequestKey}/>
  </div>;
}
