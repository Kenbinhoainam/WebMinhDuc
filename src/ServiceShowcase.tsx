import {useId, useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play} from 'lucide-react';
import {services} from './pages/info/data';
import {adjacentRailOffset, advanceHomeRail, useHomeCarousel} from './useHomeCarousel';
import './service-showcase.css';

export function ServiceCards({exclude}: {exclude?: string}) {
  const id = useId();
  const rail = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [paused,setPaused] = useState(false);
  useHomeCarousel(frame, () => advanceHomeRail(rail.current), '.service-gallery', {paused});
  const move = (backwards: boolean) => {
    const track = rail.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    const wrap = backwards ? track.scrollLeft < 2 : track.scrollLeft >= max - 2;
    const left = wrap ? (backwards ? max : 0) : adjacentRailOffset(track, backwards);
    const smooth = !wrap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollTo({left, behavior: smooth ? 'smooth' : 'instant'});
  };
  return <div ref={frame} className="service-gallery" data-user-paused={paused}>
    <div className="service-gallery-track" id={id} ref={rail} onPointerDown={event=>{if (event.pointerType === 'touch' || event.pointerType === 'pen') setPaused(true);}} data-auto-rail tabIndex={0} role="region" aria-label="Danh sách giải pháp">
      {services.filter(service => service.slug !== exclude).map(service =>
        <article className="service-gallery-card" key={service.slug}>
          <Link to={'/services/' + service.slug}>
            <img src={service.image} alt="" sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) 44vw, (max-width: 1500px) 30vw, 430px"
              loading="lazy" decoding="async"/>
            <h3>{service.title}</h3><span className="service-gallery-open" aria-hidden="true"><ArrowUpRight size={22}/></span>
          </Link>
        </article>)}
    </div>
    <button className="service-gallery-rotation" type="button" aria-controls={id}
      aria-label={paused?'Phát chuyển động':'Tạm dừng chuyển động'} onClick={()=>setPaused(!paused)}>
      {paused?<Play size={17} aria-hidden="true"/>:<Pause size={17} aria-hidden="true"/>}
    </button>
    <div className="service-gallery-controls">
      <button type="button" aria-label="Dịch vụ trước" aria-controls={id} onClick={()=>move(true)}><ChevronLeft aria-hidden="true"/></button>
      <button type="button" aria-label="Dịch vụ tiếp theo" aria-controls={id} onClick={()=>move(false)}><ChevronRight aria-hidden="true"/></button>
    </div>
  </div>;
}
