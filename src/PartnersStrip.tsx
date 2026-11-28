import {useEffect, useId, useRef, useState, type KeyboardEvent} from 'react';
import PartnerLogo from './PartnerLogo';
import {partners} from './partners';
import {useTranslation} from './i18n';
import './partners-strip-controls.css';

const pixelsPerSecond = 22;

/** The logo loop moves the native scroller; a swipe can take over at any point. */
export default function PartnersStrip() {
  const t = useTranslation();
  const viewport = useRef<HTMLDivElement>(null);
  const id = useId();
  const toggle = useRef<HTMLButtonElement>(null);
  const userPaused = useRef(false);
  const wake = useRef(() => {});
  const [paused, setPaused] = useState(false);
  const [staticList, setStaticList] = useState(true);
  useEffect(() => {
    if (!viewport.current || typeof IntersectionObserver === 'undefined' || !window.matchMedia) return;
    const rail = viewport.current;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const root = document.getElementById('root');
    const firstSet = rail.querySelector<HTMLUListElement>('.partners-set');
    if (!firstSet) return;
    let alive = true, ready = false, visible = false, held = false;
    let hovered = window.matchMedia('(hover: hover)').matches && rail.matches(':hover');
    let focused = rail.contains(document.activeElement), pointerFocusUntil = 0;
    let frame = 0, previousTime = 0, position = rail.scrollLeft, written = rail.scrollLeft;
    let releaseAt = 0, cycle = firstSet.offsetWidth;
    const measure = () => {cycle = firstSet.offsetWidth;};
    function tick(now: number) {
      if (!alive) return;
      frame = 0;
      if (!previousTime) measure();
      // Native momentum and keyboard scrolling get to settle before automatic movement resumes.
      if (Math.abs(rail.scrollLeft - written) > 1) {
        position = written = rail.scrollLeft;
        releaseAt = now + 450;
      }
      if (cycle > 0 && previousTime && now >= releaseAt) {
        position = (position + Math.min(now - previousTime, 64) * pixelsPerSecond / 1000) % cycle;
        rail.scrollLeft = position;
        written = rail.scrollLeft;
      }
      previousTime = now;
      frame = requestAnimationFrame(tick);
    }
    function update() {
      cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
      position = written = rail.scrollLeft;
      if (alive && ready && visible && !held && !hovered && !focused &&
          !userPaused.current && !motion.matches && !document.hidden && !root?.hasAttribute('inert')) {
        measure();
        frame = requestAnimationFrame(tick);
      }
    }
    let observer: IntersectionObserver | undefined;
    try {
      observer = new IntersectionObserver(entries => {
        if (!alive || !ready) return;
        visible = entries[0]?.isIntersecting ?? false;
        update();
      });
      observer.observe(rail);
      ready = true;
    } catch {
      alive = false;
      observer?.disconnect();
      return;
    }
    wake.current = update;
    const preferences = () => {
      if (motion.matches && document.activeElement === toggle.current) rail.focus({preventScroll:true});
      setStaticList(motion.matches);
      update();
    };
    const enter = (event: PointerEvent) => {if (event.pointerType !== 'touch') {hovered = true; update();}};
    const leave = () => {hovered = false; update();};
    let drag: {id: number; x: number; start: number} | undefined;
    const down = (event: PointerEvent) => {
      if (motion.matches || event.isPrimary === false || event.button > 0) return;
      held = true;
      pointerFocusUntil = Infinity;
      measure();
      drag = {id: event.pointerId, x: event.clientX, start: rail.scrollLeft};
      rail.setPointerCapture?.(event.pointerId);
      update();
    };
    const move = (event: PointerEvent) => {
      if (!drag || drag.id !== event.pointerId || !cycle) return;
      const distance = drag.x - event.clientX;
      if (Math.abs(distance) > 3) rail.dataset.dragging = 'true';
      rail.scrollLeft = ((drag.start + distance) % cycle + cycle) % cycle;
    };
    const release = (event: PointerEvent) => {
      if (!drag || drag.id !== event.pointerId) return;
      drag = undefined;
      delete rail.dataset.dragging;
      held = false;
      pointerFocusUntil = releaseAt = performance.now() + 450;
      update();
    };
    const focusIn = () => {focused = performance.now() >= pointerFocusUntil; update();};
    const focusOut = () => {focused = false; update();};
    const keyDown = () => {focused = true; update();};
    const modal = root && typeof MutationObserver !== 'undefined' ? new MutationObserver(update) : null;
    if (root) modal?.observe(root, {attributes:true, attributeFilter:['inert']});
    const resize = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    resize?.observe(firstSet);
    window.addEventListener('resize', measure);
    rail.addEventListener('pointerenter', enter);
    rail.addEventListener('pointerleave', leave);
    rail.addEventListener('pointerdown', down);
    rail.addEventListener('pointermove', move);
    rail.addEventListener('lostpointercapture', release);
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);
    rail.addEventListener('focusin', focusIn);
    rail.addEventListener('keydown', keyDown);
    rail.addEventListener('focusout', focusOut);
    document.addEventListener('visibilitychange', update);
    motion.addEventListener('change', preferences);
    preferences();
    return () => {
      alive = false;
      wake.current = () => {};
      cancelAnimationFrame(frame);
      observer.disconnect();
      modal?.disconnect();
      resize?.disconnect();
      window.removeEventListener('resize', measure);
      rail.removeEventListener('pointerenter', enter);
      rail.removeEventListener('pointerleave', leave);
      rail.removeEventListener('pointerdown', down);
      rail.removeEventListener('pointermove', move);
      rail.removeEventListener('lostpointercapture', release);
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', release);
      rail.removeEventListener('focusin', focusIn);
      rail.removeEventListener('keydown', keyDown);
      rail.removeEventListener('focusout', focusOut);
      document.removeEventListener('visibilitychange', update);
      motion.removeEventListener('change', preferences);
    };
  }, []);

  function navigate(event: KeyboardEvent<HTMLDivElement>) {
    const rail = event.currentTarget;
    const firstSet = rail.querySelector<HTMLUListElement>('.partners-set');
    if (!firstSet || !firstSet.offsetWidth) return;
    const width = firstSet.offsetWidth;
    const step = width / partners.length;
    const index = Math.round((rail.scrollLeft % width) / step);
    const keys:Record<string,number> = {ArrowRight:index + 1, ArrowLeft:index - 1, Home:0, End:partners.length - 1};
    if (!(event.key in keys)) return;
    event.preventDefault();
    rail.scrollTo({left:((keys[event.key] + partners.length) % partners.length) * step, behavior:'instant'});
  }
  const name = t({vi:'Đối tác tiêu biểu',en:'Featured partners',zh:'精选合作伙伴',ko:'주요 파트너',ja:'主なパートナー'});
  const pauseText = t({vi:'Tạm dừng chuyển động đối tác',en:'Pause partner logos',zh:'暂停合作伙伴滚动',ko:'파트너 이동 일시 정지',ja:'パートナー表示を一時停止'});
  const playText = t({vi:'Phát chuyển động đối tác',en:'Play partner logos',zh:'播放合作伙伴滚动',ko:'파트너 이동 재생',ja:'パートナー表示を再生'});
  return <div className="partners-strip" data-static={staticList}>
    {!staticList && <button ref={toggle} className="partners-motion-toggle" type="button" aria-controls={id} onClick={() => {
      userPaused.current = !userPaused.current;
      setPaused(userPaused.current);
      wake.current();
    }}>{paused ? playText : pauseText}</button>}
    <div id={id} ref={viewport} className="partners-viewport" data-auto-rail tabIndex={staticList ? -1 : 0} role="region" aria-label={name} onKeyDown={navigate}>
      <div className="partners-track">
        <ul className="partners-set">{partners.map(name => <li key={name}><PartnerLogo name={name}/></li>)}</ul>
        {!staticList && <ul className="partners-set" aria-hidden="true">{partners.map(name => <li key={name}><PartnerLogo name={name}/></li>)}</ul>}
      </div>
    </div>
  </div>;
}
