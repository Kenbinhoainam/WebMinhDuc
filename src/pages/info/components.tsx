import {useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowUpRight, ChevronDown} from 'lucide-react';
import {SectionHeading} from '../../shared';
import {ContactForm} from '../../Contact';
import {useHomeCarousel, advanceHomeRail} from '../../useHomeCarousel';
import {responsiveImage} from '../../media';
import {services} from './data';
import '../../info.css';
import '../../home-reference.css';
import './services-reference.css';
export function ServiceCards({ exclude }: { exclude?: string }) {
  const track = useRef<HTMLDivElement>(null);
  useHomeCarousel(track, () => advanceHomeRail(track.current));
  return <div className="info-service-rail service-photo-rail">
    <div className="info-service-cards" ref={track} data-auto-rail="" tabIndex={0} role="region" aria-label="Danh sách giải pháp">
      {services.filter(service => service.slug !== exclude).map(service =>
        <article className="service-photo-panel" key={service.slug}>
          <Link to={`/services/${service.slug}`}>
            <span className="service-panel-photo">
              <img width={1024} height={576} src={service.image} {...responsiveImage(service.image,'(max-width:575px) 82vw, (max-width:850px) 46vw, (max-width:1440px) 33vw, 410px')} alt="" loading="lazy" decoding="async"/>
            </span>
            <div className="service-panel-heading">
              <h3>{service.title}</h3><ArrowUpRight size={23} strokeWidth={1.6} aria-hidden="true"/>
            </div>
            <p>{service.short}</p>
          </Link>
        </article>)}
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

