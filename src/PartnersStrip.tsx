import {useState} from 'react';
import {Pause, Play} from 'lucide-react';
import PartnerLogo from './PartnerLogo';
import {partners} from './partners';

/** The second, decorative copy makes the visual loop continuous. */
export default function PartnersStrip() {
 const [paused, setPaused] = useState(false);
 return <div className="partners-strip" data-paused={paused}>
  <div className="partners-viewport" tabIndex={0} role="region" aria-label="Đối tác tiêu biểu">
   <div className="partners-track">
    <ul className="partners-set" aria-label="Các đối tác theo thông tin Minh Đức">{partners.map(name => <li key={name}><PartnerLogo name={name}/></li>)}</ul>
    <ul className="partners-set" aria-hidden="true">{partners.map(name => <li key={name}><PartnerLogo name={name}/></li>)}</ul>
   </div>
  </div>
  <button type="button" className="partners-toggle" aria-label={paused ? 'Phát chuyển động đối tác' : 'Tạm dừng chuyển động đối tác'} aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? <Play size={16}/> : <Pause size={16}/>}<span>{paused ? 'Phát' : 'Tạm dừng'}</span></button>
 </div>;
}
