import {useState} from 'react';
import {Pause, Play} from 'lucide-react';

const partners = ['Luxshare ICT', 'FOXCONN', 'SAMSUNG', 'JEILTECH VINA', 'TACU'];

/** The second, decorative copy makes the visual loop continuous. */
export default function PartnersStrip() {
 const [paused, setPaused] = useState(false);
 return <div className="partners-strip" data-paused={paused}>
  <div className="partners-viewport">
   <div className="partners-track">
    <ul className="partners-set" aria-label="Các đối tác theo thông tin Minh Đức">{partners.map(name => <li key={name}><span>{name}</span></li>)}</ul>
    <ul className="partners-set" aria-hidden="true">{partners.map(name => <li key={name}><span>{name}</span></li>)}</ul>
   </div>
  </div>
  <button type="button" className="partners-toggle" aria-label={paused ? 'Phát chuyển động đối tác' : 'Tạm dừng chuyển động đối tác'} aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? <Play size={16}/> : <Pause size={16}/>}<span>{paused ? 'Phát' : 'Tạm dừng'}</span></button>
 </div>;
}
