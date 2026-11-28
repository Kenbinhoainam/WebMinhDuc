import {useId, useState} from 'react';
import {ChevronDown} from 'lucide-react';
import {SectionHeading} from '../../shared';
import {ContactForm} from '../../Contact';
import '../../info.css';
export function InfoContact({service, id='business-contact', formRequestKey}: {service?:string; id?:string; formRequestKey?:string} = {}) {
  return <section className="section info-contact-section" id={id}><div className="container">
    <SectionHeading title="Gửi nhu cầu nhân lực"/>
    <ContactForm key={service} businessEntryKey={formRequestKey} initialService={service} initialMode="F01"/>
  </div></section>;
}
export function FAQ({ questions }: { questions: [string, string][] }) {
  const id = useId();
  const [active, setActive] = useState<number | null>(0);
  return <div className="info-faq">{questions.map(([question, answer], i) => <div className={`info-faq-item ${active === i ? 'is-open' : ''}`} key={question}><h3><button type="button" aria-expanded={active === i} aria-controls={`${id}-answer-${i}`} onClick={() => setActive(value => value === i ? null : i)}>{question}<ChevronDown size={20} aria-hidden="true"/></button></h3><div className="service-faq-answer" id={`${id}-answer-${i}`} aria-hidden={active !== i} inert={active !== i}><div><p>{answer}</p></div></div></div>)}</div>;
}

