import {useEffect, useId, useRef, useState, type CSSProperties, type PointerEvent} from 'react';
import {Link} from 'react-router-dom';
import {ArrowUpRight, ChevronLeft, ChevronRight, GraduationCap, Network, Pause, Play} from 'lucide-react';
import {services, type Service} from './pages/info/data';
import {adjacentRailOffset, advanceHomeRail, slideRailTo, useHomeCarousel} from './useHomeCarousel';
import './service-showcase.css';

const serviceMotionStyle = {'--service-slide-time': 'var(--motion-t2,180ms)'} as CSSProperties;
export function serviceSlideDuration(rail: HTMLElement) {
  const token = window.getComputedStyle(rail).getPropertyValue('--motion-t2').trim();
  const value = Number.parseFloat(token);
  return Number.isFinite(value) ? value * (token.endsWith('ms') ? 1 : 1000) : 180;
}

function ServiceCard({service}: {service: Service}) {
  const id = useId();
  const {icon, photo} = service.card;
  return <article className="service-gallery-card">
    <Link to={'/services/' + service.slug} draggable={false}
      aria-labelledby={id + '-title ' + id + '-action'} aria-describedby={id + '-summary ' + id + '-detail'}>
      <span className="service-card-media" aria-hidden="true">
        <img className="service-card-photo" src={photo?.src ?? service.image} width={photo?.width} height={photo?.height}
          sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) 44vw, (max-width: 1500px) 30vw, 430px"
          alt="" loading="lazy" decoding="async" draggable={false}
          onLoad={event=>{event.currentTarget.hidden=false;}} onError={event=>{event.currentTarget.hidden=true;}}/>
      </span>
      <span className={'service-card-icon service-card-icon--' + icon} aria-hidden="true">
        {icon==='admissions' && <GraduationCap/>}
        {icon==='consulting' && <Network/>}
      </span>
      <div className="service-card-copy">
        <h3 className="service-card-title" id={id + '-title'}>{service.title}</h3>
        <p className="service-card-summary" id={id + '-summary'}>{service.short}</p>
        <p className="service-card-detail" id={id + '-detail'}>{service.card.detail}</p>
      </div>
      <span className="service-card-cta" id={id + '-action'}>Khám phá giải pháp <ArrowUpRight size={18} aria-hidden="true"/></span>
    </Link>
  </article>;
}

export function ServiceDirectory() {
  return <nav className="service-card-grid" style={serviceMotionStyle} aria-label="Danh sách giải pháp">
    {services.map(service=><ServiceCard key={service.slug} service={service}/>)}
  </nav>;
}

type Grab = {pointer: number; startX: number; startY: number; startScroll: number; dragging: boolean};

export function ServiceCards({exclude}: {exclude?: string}) {
  const id = useId();
  const rail = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const grab = useRef<Grab | null>(null);
  const suppressClick = useRef(false);
  const [paused,setPaused] = useState(false);
  const cancelSlide = useRef<(() => void) | undefined>(undefined);
  function interruptSlide() {
    cancelSlide.current?.();
    cancelSlide.current = undefined;
  }

  function move(backwards: boolean) {
    const track = rail.current;
    if (!track || track.scrollWidth <= track.clientWidth + 1) return;
    interruptSlide();
    const max = track.scrollWidth - track.clientWidth;
    const wrap = backwards ? track.scrollLeft <= 2 : track.scrollLeft >= max - 2;
    const target = wrap ? (backwards ? max : 0) : adjacentRailOffset(track,backwards);
    if (wrap || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      track.scrollTo({left:target, behavior:'instant'});
    } else {
      cancelSlide.current = slideRailTo(track,target,serviceSlideDuration(track));
    }
  }

  useHomeCarousel(frame, () => {
    interruptSlide();
    cancelSlide.current = advanceHomeRail(rail.current,rail.current ? serviceSlideDuration(rail.current) : 180);
    return cancelSlide.current;
  }, '.service-gallery', {intervalMs:4500, paused});
  useEffect(()=>{
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const hidden = () => {if (document.hidden) interruptSlide();};
    preference.addEventListener('change',interruptSlide);
    document.addEventListener('visibilitychange',hidden);
    window.addEventListener('resize',interruptSlide);
    return ()=>{
      preference.removeEventListener('change',interruptSlide);
      document.removeEventListener('visibilitychange',hidden);
      window.removeEventListener('resize',interruptSlide);
      interruptSlide();
    };
  },[exclude]);

  function startGrab(event: PointerEvent<HTMLDivElement>) {
    if (event.isPrimary === false) return;
    interruptSlide();
    suppressClick.current = false;
    if (event.pointerType === 'touch' || event.pointerType === 'pen') {
      setPaused(true);
      return; // Native touch scrolling preserves vertical page movement and tap-to-open.
    }
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    grab.current = {
      pointer:event.pointerId, startX:event.clientX, startY:event.clientY,
      startScroll:event.currentTarget.scrollLeft, dragging:false,
    };
  }

  function drag(event: PointerEvent<HTMLDivElement>) {
    const gesture = grab.current;
    if (!gesture || gesture.pointer !== event.pointerId) return;
    const rail = event.currentTarget;
    const dx = event.clientX - gesture.startX;
    const dy = event.clientY - gesture.startY;
    if (!gesture.dragging) {
      if (Math.max(Math.abs(dx),Math.abs(dy)) < 7) return;
      if (Math.abs(dx) <= Math.abs(dy)) {
        grab.current = null;
        return;
      }
      gesture.dragging = true;
      suppressClick.current = true;
      rail.dataset.dragging = 'true';
      rail.setPointerCapture?.(event.pointerId);
    }
    event.preventDefault();
    rail.scrollLeft = gesture.startScroll - dx;
  }

  function endGrab(event: PointerEvent<HTMLDivElement>) {
    const gesture = grab.current;
    if (!gesture || gesture.pointer !== event.pointerId) return;
    grab.current = null;
    delete event.currentTarget.dataset.dragging;
    if (event.currentTarget.hasPointerCapture?.(gesture.pointer)) {
      event.currentTarget.releasePointerCapture(gesture.pointer);
    }
  }

  return <div ref={frame} className="service-gallery" style={serviceMotionStyle} data-user-paused={paused}>
    <div className="service-gallery-track" id={id} ref={rail} data-auto-rail tabIndex={0} role="region" aria-label="Danh sách giải pháp"
      onPointerEnter={event=>{if (event.pointerType !== 'touch') interruptSlide();}}
      onWheel={interruptSlide} onKeyDownCapture={interruptSlide} onFocusCapture={interruptSlide}
      onPointerDown={startGrab} onPointerMove={drag} onPointerUp={endGrab}
      onPointerCancel={event=>{suppressClick.current=true;endGrab(event);}} onLostPointerCapture={endGrab}
      onPointerLeave={event=>{if (!grab.current?.dragging) endGrab(event);}}
      onClickCapture={event=>{
        // Keyboard and assistive activation have no mouse click count.
        if (suppressClick.current && event.detail > 0) {
          event.preventDefault();
          event.stopPropagation();
          suppressClick.current = false;
        }
      }}>
      {services.filter(service=>service.slug!==exclude).map(service=><ServiceCard key={service.slug} service={service}/>)}
    </div>
    <div className="service-gallery-toolbar"><button className="service-gallery-rotation" type="button" aria-controls={id}
      aria-label={paused?'Phát chuyển động':'Tạm dừng chuyển động'} onClick={()=>{interruptSlide();setPaused(value=>!value);}}>
      {paused?<Play size={17} aria-hidden="true"/>:<Pause size={17} aria-hidden="true"/>}
    </button>
    <div className="service-gallery-controls">
      <button type="button" aria-label="Dịch vụ trước" aria-controls={id} onClick={()=>move(true)}><ChevronLeft aria-hidden="true"/></button>
      <button type="button" aria-label="Dịch vụ tiếp theo" aria-controls={id} onClick={()=>move(false)}><ChevronRight aria-hidden="true"/></button>
    </div></div>
  </div>;
}
