import {useEffect, useRef, useState} from 'react';
import {useLocation} from 'react-router-dom';
import './motion.css';

/** Enhances explicitly marked content. Content remains visible without this controller. */
export function MotionController() {
  const {pathname, search, hash} = useLocation();

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined' || !window.matchMedia) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let observer: IntersectionObserver | undefined;
    let mutations: MutationObserver | undefined;
    const observed = new Set<HTMLElement>();

    const clear = () => {
      observer?.disconnect();
      mutations?.disconnect();
      observed.forEach(element => element.classList.remove('motion-pending'));
      observed.clear();
    };
    const setup = () => {
      clear();
      if (preference.matches) return;
      try {
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const element = entry.target as HTMLElement;
          element.classList.remove('motion-pending');
          element.classList.add('motion-visible');
          observer?.unobserve(element);
          observed.delete(element);
        });
      }, {threshold: 0});
      const register = (root: ParentNode) => {
        const elements = root instanceof HTMLElement && root.matches('[data-reveal]')
          ? [root, ...root.querySelectorAll<HTMLElement>('[data-reveal]')]
          : Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
        // Batch geometry reads before writing classes to avoid repeated layout work.
        const candidates = elements.filter(element => !element.classList.contains('motion-visible') && !observed.has(element));
        const positions = candidates.map(element => element.getBoundingClientRect().top);
        candidates.forEach((element, index) => {
          // Never conceal content already on screen, even briefly.
          if (positions[index] < window.innerHeight) {
            element.classList.add('motion-visible');
            return;
          }
          try {
            observer?.observe(element);
            observed.add(element);
            element.classList.add('motion-pending');
          } catch {
            // If observation fails, leave the content visible.
            element.classList.remove('motion-pending');
          }
        });
      };
      register(document);
      // Lazy routes and content can arrive after the location effect has run.
      if (typeof MutationObserver !== 'undefined') {
        mutations = new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(node => {
          if (node instanceof HTMLElement) register(node);
        })));
        mutations.observe(document.body, {childList: true, subtree: true});
      }
      } catch {
        // Restore all content if an observer implementation fails unexpectedly.
        clear();
      }
    };
    setup();
    preference.addEventListener('change', setup);
    return () => { preference.removeEventListener('change', setup); clear(); };
  }, [pathname, search, hash]);
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
