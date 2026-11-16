import {useEffect, useRef, useState} from 'react';
import {Pause, Play} from 'lucide-react';
import PartnerLogo from './PartnerLogo';
import {partners} from './partners';

/** Two wide visual sets create a continuous loop; only the first names are semantic. */
export default function PartnersStrip() {
 const ref = useRef<HTMLDivElement>(null);
 const [paused, setPaused] = useState(false);
 const [visible, setVisible] = useState(false);
 const [staticFallback, setStaticFallback] = useState(true);
 useEffect(() => {
  const element = ref.current;
  if (!element || typeof IntersectionObserver === 'undefined') return;
  let active = true, intersecting = false;
  const update = () => { if (active) setVisible(intersecting && !document.hidden); };
  let observer: IntersectionObserver | undefined;
  try {
   observer = new IntersectionObserver(entries => { if (!active) return; intersecting = entries[0]?.isIntersecting ?? false; update(); }, {threshold: 0});
   observer.observe(element);
   setStaticFallback(false);
   document.addEventListener('visibilitychange', update);
  } catch {
   active = false;
   setStaticFallback(true);
   observer?.disconnect();
   return;
  }
  return () => { active = false; observer?.disconnect(); document.removeEventListener('visibilitychange', update); };
 }, []);
 const set = (duplicate: boolean) => <ul className="partners-set" aria-label={duplicate ? undefined : 'Các đối tác theo thông tin Minh Đức'} aria-hidden={duplicate || undefined}>
  {partners.map(name => <li key={name}><PartnerLogo name={name}/></li>)}
  {partners.map(name => <li key={`repeat-${name}`} data-repeat="true" aria-hidden="true"><PartnerLogo name={name}/></li>)}
 </ul>;
 return <div ref={ref} className="partners-strip" data-paused={paused} data-visible={visible} data-static={staticFallback}>
  <div className="partners-viewport" tabIndex={0} role="region" aria-label="Đối tác tiêu biểu">
   <div className="partners-track">{set(false)}{set(true)}</div>
  </div>
  <button type="button" className="partners-toggle" aria-label={paused ? 'Phát chuyển động đối tác' : 'Tạm dừng chuyển động đối tác'} aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? <Play size={16}/> : <Pause size={16}/>}<span>{paused ? 'Phát' : 'Tạm dừng'}</span></button>
 </div>;
}
