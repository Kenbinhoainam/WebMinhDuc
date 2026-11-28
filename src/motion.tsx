import {createContext, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode} from 'react';
import {useLocation} from 'react-router-dom';
import {useLocale, languageTags} from './i18n';
import './motion.css';

/** Observe the stable outer box. left/right name the starting side; zoom-right matches AOS zoom-in-right (from left). */
export function RevealFrame({children, effect = 'up', delay, delayMs, className, contentClassName}: {
  children: ReactNode;
  effect?: 'left' | 'right' | 'up' | 'zoom' | 'zoom-right' | 'media';
  delay?: 0 | 1 | 2 | 3 | 400 | 600 | 800;
  delayMs?: number;
  className?: string;
  contentClassName?: string;
}) {
  // Compress legacy AOS delays into a short, capped stagger.
  const explicitDelay = delayMs !== undefined && Number.isFinite(delayMs) && delayMs >= 0
    ? Math.min(120, Math.round(delayMs / 200) * 40)
    : undefined;
  const style = explicitDelay === undefined ? undefined : {'--reveal-delay': `${explicitDelay}ms`} as CSSProperties;
  return <div className={className} style={style} data-reveal={effect} data-reveal-delay={delay} data-reveal-delay-ms={explicitDelay} data-reveal-frame="">
    <div className={['motion-content', contentClassName].filter(Boolean).join(' ')}>{children}</div>
  </div>;
}

/** Progressively enhance marked content; failures and unenhanced HTML remain visible. */
export function startReveals(): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined' || typeof IntersectionObserver === 'undefined' || !window.matchMedia) return () => {};
  let preference: MediaQueryList;
  try {
    preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!preference?.addEventListener || !preference.removeEventListener) return () => {};
  } catch { return () => {}; }
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

const numberProgress = createContext(1);
const numberFormatters = Object.fromEntries(Object.entries(languageTags).map(([locale, tag]) => [locale, new Intl.NumberFormat(tag)]));

/** One stable block, one clock: a new pass begins only after the whole block leaves. */
export function AnimatedNumberGroup({children, className, duration = 320, 'aria-label': label}: {
  children: ReactNode;
  className?: string;
  duration?: number;
  'aria-label': string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Server-rendered and unenhanced content always contains the final values.
  const [progress, setProgress] = useState(1);
  useEffect(() => {
    setProgress(1);
    const element = ref.current;
    if (!element || typeof IntersectionObserver === 'undefined' || !window.matchMedia || typeof requestAnimationFrame === 'undefined' || typeof cancelAnimationFrame === 'undefined') return;
    let preference: MediaQueryList;
    try {
      preference = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (!preference || typeof preference.addEventListener !== 'function' || typeof preference.removeEventListener !== 'function') return;
    } catch { return; }
    const total = Number.isFinite(duration) ? Math.max(0, duration) : 320;
    if (total === 0) return;
    const edge = 8;
    let frame = 0, generation = 0, elapsed = 0;
    let last: number | null = null;
    let disposed = false, armed = true, running = false;
    let entrance: IntersectionObserver | undefined, exit: IntersectionObserver | undefined;
    const outside = (bounds: DOMRectReadOnly) => bounds.bottom <= -edge || bounds.top >= window.innerHeight + edge;
    const inside = (bounds: DOMRectReadOnly) => bounds.bottom > edge && bounds.top < window.innerHeight - edge && bounds.right > 0 && bounds.left < window.innerWidth;
    const stop = () => {
      generation++;
      cancelAnimationFrame(frame);
      frame = 0;
      last = null;
    };
    const resume = () => {
      if (disposed || frame || !running || document.hidden || preference.matches) return;
      const currentGeneration = generation;
      const tick = (now: number) => {
        if (disposed || generation !== currentGeneration || !running || document.hidden || preference.matches) return;
        frame = 0;
        if (last !== null) elapsed += Math.max(0, now - last);
        last = now;
        const position = Math.min(elapsed / total, 1);
        setProgress(position === 1 ? 1 : Math.min(1 - Number.EPSILON, 1 - Math.pow(1 - position, 3)));
        if (position < 1) frame = requestAnimationFrame(tick);
        else running = false;
      };
      frame = requestAnimationFrame(tick);
    };
    const rearm = () => {
      if (armed || disposed) return;
      stop();
      armed = true;
      running = false;
      elapsed = 0;
      // Preserve final values while offscreen so fast scroll, anchor jumps, or full-page views never stick at 0+.
      setProgress(1);
    };
    const enter = () => {
      if (!armed || disposed) return;
      armed = false;
      elapsed = 0;
      running = !preference.matches;
      setProgress(preference.matches ? 1 : 0);
      resume();
    };
    const visibility = () => {
      if (disposed) return;
      if (document.hidden) { stop(); return; }
      const bounds = element.getBoundingClientRect();
      if (outside(bounds)) rearm();
      else if (inside(bounds)) enter();
      resume();
    };
    const preferenceChange = () => {
      if (disposed) return;
      stop();
      running = false;
      elapsed = 0;
      // Changing the preference must not reset a block the reader can still see.
      armed = outside(element.getBoundingClientRect());
      setProgress(1);
    };
    try {
      // Separate inner/outer boundaries absorb tiny edge crossings. Neither
      // individual cards nor the mobile second row can restart this clock.
      entrance = new IntersectionObserver(entries => {
        if (disposed) return;
        for (const entry of entries) if (entry.isIntersecting) enter();
      }, {threshold: 0, rootMargin: `-${edge}px 0px -${edge}px 0px`});
      exit = new IntersectionObserver(entries => {
        if (disposed) return;
        for (const entry of entries) if (!entry.isIntersecting && outside(entry.boundingClientRect)) rearm();
      }, {threshold: 0, rootMargin: `${edge}px 0px ${edge}px 0px`});
      entrance.observe(element);
      exit.observe(element);
    } catch {
      disposed = true;
      stop();
      entrance?.disconnect();
      exit?.disconnect();
      setProgress(1);
      return;
    }
    document.addEventListener('visibilitychange', visibility);
    preference.addEventListener('change', preferenceChange);
    // Keep offscreen metrics at final readable values; initially visible blocks animate immediately.
    if (inside(element.getBoundingClientRect())) enter();
    return () => {
      disposed = true;
      stop();
      entrance?.disconnect();
      exit?.disconnect();
      document.removeEventListener('visibilitychange', visibility);
      preference.removeEventListener('change', preferenceChange);
    };
  }, [duration]);
  return <numberProgress.Provider value={progress}><div ref={ref} className={className} role="group" aria-label={label} data-count-group="">{children}</div></numberProgress.Provider>;
}

/** The final value stays available to assistive technology throughout the run. */
export function AnimatedNumber({value, suffix = ''}: {value: number; suffix?: string}) {
  const progress = useContext(numberProgress);
  const locale = useLocale();
  // Truncation keeps all four final integers reserved for the shared last frame.
  const display = progress >= 1 ? value : Math.trunc(value * progress);
  const format = (number: number) => numberFormatters[locale].format(number) + suffix;
  return <span data-count-to={value}><span className="motion-sr-only">{format(value)}</span><span aria-hidden="true">{format(display)}</span></span>;
}
