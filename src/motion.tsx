import {useEffect, useRef, useState, type ReactNode} from 'react';
import {useLocation} from 'react-router-dom';
import './motion.css';

/** Observe the stable outer box while its direct child performs the visual reveal. */
export function RevealFrame({children, effect = 'up', delay, className, contentClassName}: {
  children: ReactNode;
  effect?: 'left' | 'right' | 'up' | 'zoom';
  delay?: 0 | 1 | 2 | 3;
  className?: string;
  contentClassName?: string;
}) {
  return <div className={className} data-reveal={effect} data-reveal-delay={delay} data-reveal-frame="">
    <div className={['motion-content', contentClassName].filter(Boolean).join(' ')}>{children}</div>
  </div>;
}

/** Progressively enhance marked content; failures and unenhanced HTML remain visible. */
export function startReveals(): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined' || typeof IntersectionObserver === 'undefined' || !window.matchMedia) return () => {};
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let entrance: IntersectionObserver | undefined;
  let exit: IntersectionObserver | undefined;
  let mutations: MutationObserver | undefined;
  let resizeTimer: number | undefined;
  let generation = 0;
  const observed = new Set<HTMLElement>();
  const entered = new WeakSet<HTMLElement>();
  const focusLocked = new WeakSet<HTMLElement>();

  const disconnect = () => {
    generation++;
    entrance?.disconnect();
    exit?.disconnect();
    mutations?.disconnect();
    entrance = undefined;
    exit = undefined;
    mutations = undefined;
  };
  const restore = () => {
    disconnect();
    observed.forEach(element => { element.classList.add('motion-released'); element.classList.remove('motion-pending'); });
    observed.clear();
  };
  const reveal = (element: HTMLElement) => {
    element.classList.remove('motion-pending');
    element.classList.add('motion-visible');
  };
  // Focus locks all marked ancestors visible for the lifetime of this controller.
  const focus = (event: FocusEvent) => {
    let element = event.target instanceof HTMLElement ? event.target.closest<HTMLElement>('[data-reveal]') : null;
    while (element) {
      focusLocked.add(element);
      reveal(element);
      element = element.parentElement?.closest<HTMLElement>('[data-reveal]') ?? null;
    }
  };
  const setup = () => {
    disconnect();
    if (preference.matches) { restore(); return; }
    try {
      const currentGeneration = generation;
      const exitBaseline = new WeakSet<Element>();
      // Pixel margins avoid percentage root margins being resolved against width.
      const height = window.innerHeight;
      const exitLine = Math.max(1, Math.round(height * .96));
      const entranceLine = Math.max(1, exitLine - Math.max(48, Math.round(height * .12)));
      entrance = new IntersectionObserver(entries => entries.forEach(entry => {
        if (generation !== currentGeneration || !entry.isIntersecting || !observed.has(entry.target as HTMLElement)) return;
        const element = entry.target as HTMLElement;
        entered.add(element);
        reveal(element);
      }), {threshold: 0, rootMargin: `0px 0px -${height - entranceLine}px 0px`});
      exit = new IntersectionObserver(entries => entries.forEach(entry => {
        if (generation !== currentGeneration) return;
        const element = entry.target as HTMLElement;
        // Initial observer delivery establishes a baseline, especially after resize.
        if (!exitBaseline.has(element)) { exitBaseline.add(element); return; }
        const bounds = entry.boundingClientRect;
        const boundary = entry.rootBounds?.bottom ?? exitLine;
        // Only reverse-scroll exits below the line may reset an entered block.
        if (!entry.isIntersecting && observed.has(element) && entered.has(element) && !focusLocked.has(element) &&
            bounds.top >= boundary && bounds.right > 0 && bounds.left < window.innerWidth) {
          element.classList.remove('motion-visible');
          element.classList.add('motion-pending');
        }
      }), {threshold: 0, rootMargin: `0px 0px -${height - exitLine}px 0px`});
      const register = (root: ParentNode) => {
        const elements = root instanceof HTMLElement && root.matches('[data-reveal]')
          ? [root, ...root.querySelectorAll<HTMLElement>('[data-reveal]')]
          : Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
        const candidates = elements.filter(element => !observed.has(element));
        const positions = candidates.map(element => element.getBoundingClientRect().top);
        candidates.forEach((element, index) => {
          element.classList.remove('motion-released');
          if (element.contains(document.activeElement)) {
            focusLocked.add(element);
            reveal(element);
          } else if (!element.classList.contains('motion-visible')) {
            if (positions[index] < window.innerHeight) reveal(element);
            else element.classList.add('motion-pending');
          }
          observed.add(element);
          entrance!.observe(element);
          exit!.observe(element);
        });
      };
      // A resize rebinds observers without changing existing classes or focus locks.
      observed.forEach(element => {
        if (!element.isConnected) {
          element.classList.remove('motion-pending');
          observed.delete(element);
          entered.delete(element);
          focusLocked.delete(element);
        }
      });
      // Keep the full set intact while rebinding, so any failure restores every target.
      observed.forEach(element => { entrance!.observe(element); exit!.observe(element); });
      register(document);
      if (typeof MutationObserver !== 'undefined') {
        mutations = new MutationObserver(records => {
          observed.forEach(element => {
            if (!element.isConnected) {
              entrance?.unobserve(element);
              exit?.unobserve(element);
              element.classList.remove('motion-pending');
              observed.delete(element);
              entered.delete(element);
              focusLocked.delete(element);
            }
          });
          try {
            records.forEach(record => record.addedNodes.forEach(node => {
              if (node instanceof HTMLElement && node.isConnected) register(node);
            }));
          } catch { restore(); }
        });
        mutations.observe(document.body, {childList: true, subtree: true});
      }
    } catch { restore(); }
  };
  const preferenceChange = () => setup();
  const resize = () => {
    if (resizeTimer !== undefined) window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => { resizeTimer = undefined; if (!preference.matches) setup(); }, 100);
  };
  document.addEventListener('focusin', focus);
  window.addEventListener('resize', resize);
  preference.addEventListener('change', preferenceChange);
  setup();
  return () => {
    if (resizeTimer !== undefined) window.clearTimeout(resizeTimer);
    document.removeEventListener('focusin', focus);
    window.removeEventListener('resize', resize);
    preference.removeEventListener('change', preferenceChange);
    restore();
  };
}

export function MotionController() {
  const {pathname, search, hash} = useLocation();
  useEffect(() => startReveals(), [pathname, search, hash]);
  return null;
}

/** The final value is always present for assistive technology and without JavaScript. */
export function AnimatedNumber({value, suffix = '', duration = 1100}: {value: number; suffix?: string; duration?: number}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    setDisplay(value);
    const element = ref.current;
    if (!element || !Number.isFinite(value) || typeof IntersectionObserver === 'undefined' || !window.matchMedia) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches) return;
    let frame = 0, elapsed = 0, last = 0, active = false, complete = false;
    const total = Math.max(1, duration);
    const tick = (now: number) => {
      if (!active || complete) return;
      if (last) elapsed += now - last;
      last = now;
      const progress = Math.min(elapsed / total, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
      else { complete = true; observer?.disconnect(); }
    };
    const update = (visible: boolean) => {
      active = visible && !document.hidden && !preference.matches && !complete;
      cancelAnimationFrame(frame);
      last = 0;
      if (preference.matches) { complete = true; setDisplay(value); observer?.disconnect(); }
      else if (active) frame = requestAnimationFrame(tick);
    };
    let intersecting = false;
    let observer: IntersectionObserver | undefined;
    try {
      observer = new IntersectionObserver(entries => {
        intersecting = entries.some(entry => entry.isIntersecting);
        update(intersecting);
      }, {threshold: 0.1});
      observer.observe(element);
    } catch {
      observer?.disconnect();
      return;
    }
    const visibility = () => update(intersecting);
    document.addEventListener('visibilitychange', visibility);
    preference.addEventListener('change', visibility);
    return () => { cancelAnimationFrame(frame); observer?.disconnect(); document.removeEventListener('visibilitychange', visibility); preference.removeEventListener('change', visibility); };
  }, [value, duration]);
  const format = (number: number) => new Intl.NumberFormat('vi-VN').format(number) + suffix;
  return <span ref={ref} data-count-to={value}><span className="motion-sr-only">{format(value)}</span><span aria-hidden="true">{format(display)}</span></span>;
}
