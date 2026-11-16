import {useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight, Pause, Play} from 'lucide-react';
import {PageHero, ButtonLink, SectionHeading} from '../../shared';
import {ContactForm} from '../../Contact';
import {useTranslation} from '../../i18n';
import {useHomeCarousel, advanceHomeRail} from '../../useHomeCarousel';
import PartnerLogo from '../../PartnerLogo';
import {partners} from '../../partners';
import {services} from './data';
import '../../info.css';
import '../../home-reference.css';
import {backgroundImage} from '../../media';
export function InfoNotFound({ kind }: { kind: string }) {
  return <><PageHero title={`${kind} không tồn tại`} eyebrow="404 · Không tìm thấy" /><section className="section container info-not-found"><h2>Tiếp tục khám phá Minh Đức</h2><p>Đường dẫn có thể đã thay đổi. Bạn có thể quay lại trang chủ để tìm thông tin phù hợp.</p><ButtonLink to="/">Về trang chủ</ButtonLink></section></>;
}
export function InfoCarouselPause({paused,toggle}:{paused:boolean;toggle:()=>void}){
 const t=useTranslation();
 const label=paused?t({vi:'Phát chuyển động',en:'Play motion',zh:'播放动态效果',ko:'움직임 재생',ja:'動きを再生'}):t({vi:'Tạm dừng chuyển động',en:'Pause motion',zh:'暂停动态效果',ko:'움직임 일시 정지',ja:'動きを一時停止'});
 return <button type="button" className="info-carousel-pause" aria-pressed={paused} aria-label={label} onClick={toggle}>{paused?<Play size={16}/>:<Pause size={16}/>}<span>{label}</span></button>;
}
export function ServiceCards({ exclude }: { exclude?: string }) {
  const area = useRef<HTMLDivElement>(null), track = useRef<HTMLDivElement>(null);
  const auto=useHomeCarousel(area,()=>advanceHomeRail(track.current),'.info-service-cards,.info-rail-controls');
  const scroll = (direction:number) => track.current?.scrollBy({left: direction * (track.current?.clientWidth || 350) * .8, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
  const icons=['Solution-Icon-3.png','Solution-Icon-2.png','Solution-Icon-1.png','Solution-Icon-3.png','Solution-Icon-2.png'];
  return <div className="info-service-rail" ref={area}><div className="info-service-cards ref-solution-track" ref={track} tabIndex={0} role="region" aria-label="Danh sách giải pháp">{services.map((s,i)=>({s,i})).filter(({s})=>s.slug!==exclude).map(({s,i})=><article className="ref-solution" key={s.slug} style={{backgroundImage:`linear-gradient(180deg,rgba(15,24,35,.25),rgba(15,24,35,.82)),url(${backgroundImage(s.image,960)})`}}><img className="ref-solution-icon" src={`/mirror/www.hr2b.com/wp-content/uploads/2025/09/${icons[i]}`} alt="" width="188" height="188" loading="lazy"/><div className="ref-solution-content"><h3><Link to={`/services/${s.slug}`}>{s.title}</Link></h3><p>{s.short}</p></div><Link className="btn" to={`/services/${s.slug}`}>Khám phá giải pháp <ArrowUpRight size={18}/></Link></article>)}</div><InfoCarouselPause paused={auto.paused} toggle={auto.toggle}/><div className="info-rail-controls"><button className="circle-button" type="button" aria-label="Dịch vụ trước" onClick={()=>scroll(-1)}><ChevronLeft/></button><button className="circle-button" type="button" aria-label="Dịch vụ tiếp theo" onClick={()=>scroll(1)}><ChevronRight/></button></div></div>;
}
export function InfoContact(){return <section className="section info-contact-section"><div className="container"><SectionHeading title="Yêu cầu tư vấn"/><ContactForm/></div></section>}
export function PartnerStrip() {
  return <div className="info-partner-list">{partners.map((name, index) => <div className={`info-partner info-partner-${index}`} key={name}><PartnerLogo name={name}/></div>)}</div>;
}
export function FAQ({ questions }: { questions: [string, string][] }) {
  const [active, setActive] = useState<number | null>(0);
  return <div className="info-faq">{questions.map(([question, answer], i) => <div className={`info-faq-item ${active === i ? 'is-open' : ''}`} key={question}><h3><button type="button" aria-expanded={active === i} aria-controls={`faq-answer-${i}`} onClick={() => setActive(active === i ? null : i)}>{question}<ChevronDown size={20} /></button></h3><div id={`faq-answer-${i}`} hidden={active !== i}><p>{answer}</p></div></div>)}</div>;
}

