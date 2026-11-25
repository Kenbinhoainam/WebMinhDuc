import {useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import {ChevronDown, ChevronLeft, ChevronRight, Pause, Play} from 'lucide-react';
import {SectionHeading} from '../../shared';
import {ContactForm} from '../../Contact';
import {useTranslation} from '../../i18n';
import {useHomeCarousel, advanceHomeRail} from '../../useHomeCarousel';
import {services} from './data';
import '../../info.css';
import '../../home-reference.css';
import './services-reference.css';
export function InfoCarouselPause({paused,toggle}:{paused:boolean;toggle:()=>void}){
 const t=useTranslation();
 const label=paused?t({vi:'Phát chuyển động',en:'Play motion',zh:'播放动态效果',ko:'움직임 재생',ja:'動きを再生'}):t({vi:'Tạm dừng chuyển động',en:'Pause motion',zh:'暂停动态效果',ko:'움직임 일시 정지',ja:'動きを一時停止'});
 return <button type="button" className="info-carousel-pause" data-carousel-toggle="" aria-pressed={paused} aria-label={label} onClick={toggle}>{paused?<Play size={16}/>:<Pause size={16}/>}<span>{label}</span></button>;
}
export function ServiceCards({ exclude }: { exclude?: string }) {
  const area = useRef<HTMLDivElement>(null), track = useRef<HTMLDivElement>(null);
  const auto=useHomeCarousel(area,()=>advanceHomeRail(track.current),'.info-service-cards,.info-rail-controls');
  const scroll = (direction:number) => track.current?.scrollBy({left: direction * (track.current?.clientWidth || 350) * .8, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
  return <div className="info-service-rail service-photo-rail" ref={area}>
    <div className="info-service-cards" ref={track} tabIndex={0} role="region" aria-label="Danh sách giải pháp">
      {services.filter(service => service.slug !== exclude).map(service =>
        <article className="service-photo-panel" key={service.slug}>
          <Link to={`/services/${service.slug}`}>
            <img src={service.image} alt="" loading="lazy" sizes="(min-width: 1024px) 380px, (min-width: 640px) 48vw, 80vw"/>
            <h3>{service.title}</h3><p>{service.short}</p>
          </Link>
        </article>)}
    </div>
    <div className="info-rail-controls">
      <button className="circle-button" type="button" aria-label="Dịch vụ trước" onClick={()=>scroll(-1)}><ChevronLeft/></button>
      <InfoCarouselPause paused={auto.paused} toggle={auto.toggle}/>
      <button className="circle-button" type="button" aria-label="Dịch vụ tiếp theo" onClick={()=>scroll(1)}><ChevronRight/></button>
    </div>
  </div>;
}
export function InfoContact({service, id='business-contact', formRequestKey}: {service?:string; id?:string; formRequestKey?:string} = {}) {
  return <section className="section info-contact-section" id={id}><div className="container">
    <SectionHeading title="Gửi nhu cầu nhân lực"/>
    <ContactForm key={service} businessEntryKey={formRequestKey} initialService={service} initialMode="F01"/>
  </div></section>;
}
export function FAQ({ questions }: { questions: [string, string][] }) {
  const [active, setActive] = useState<number | null>(0);
  return <div className="info-faq">{questions.map(([question, answer], i) => <div className={`info-faq-item ${active === i ? 'is-open' : ''}`} key={question}><h3><button type="button" aria-expanded={active === i} aria-controls={`faq-answer-${i}`} onClick={() => setActive(active === i ? null : i)}>{question}<ChevronDown size={20} /></button></h3><div id={`faq-answer-${i}`} hidden={active !== i}><p>{answer}</p></div></div>)}</div>;
}

