import {useEffect, useRef, useState, type KeyboardEvent} from 'react';
import PartnerLogo from './PartnerLogo';
import {partners} from './partners';
import {useTranslation} from './i18n';

const pixelsPerSecond = 22;

/** The logo loop moves the native scroller; a swipe can take over at any point. */
export default function PartnersStrip() {
  const t = useTranslation();
  const viewport = useRef<HTMLDivElement>(null);
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
          !motion.matches && !document.hidden && !root?.hasAttribute('inert')) {
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
    const preferences = () => {setStaticList(motion.matches); update();};
    const enter = (event: PointerEvent) => {if (event.pointerType !== 'touch') {hovered = true; update();}};
    const leave = () => {hovered = false; update();};
    const down = () => {held = true; pointerFocusUntil = Infinity; update();};
    const release = () => {if (held) {held = false; pointerFocusUntil = releaseAt = performance.now() + 450; update();}};
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
      cancelAnimationFrame(frame);
      observer.disconnect();
      modal?.disconnect();
      resize?.disconnect();
      window.removeEventListener('resize', measure);
      rail.removeEventListener('pointerenter', enter);
      rail.removeEventListener('pointerleave', leave);
      rail.removeEventListener('pointerdown', down);
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
  return <div className="partners-strip" data-static={staticList}>
    <div ref={viewport} className="partners-viewport" data-auto-rail tabIndex={staticList ? undefined : 0} role="region" aria-label={name} onKeyDown={navigate}>
      <div className="partners-track">
        <ul className="partners-set">{partners.map(name => <li key={name}><PartnerLogo name={name}/></li>)}</ul>
        {!staticList && <ul className="partners-set" aria-hidden="true">{partners.map(name => <li key={name}><PartnerLogo name={name}/></li>)}</ul>}
      </div>
    </div>
  </div>;
}
