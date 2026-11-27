import {useEffect, useRef, useState, type RefObject} from 'react';

type Advance = () => void | (() => void);

/** A fresh reading interval begins when all interaction with the rail has ended. */
export function useHomeCarousel(
  container: RefObject<HTMLElement | null>,
  advance: Advance,
  interactionSelector = '[data-auto-rail]',
  {intervalMs = 6000, disabled = false, paused = false}: {intervalMs?: number; disabled?: boolean; paused?: boolean} = {},
) {
  const advanceRef = useRef(advance);
  advanceRef.current = advance;
  useEffect(() => {
    const element = container.current;
    if (!element || disabled) return;
    const surfaces = element.matches(interactionSelector) ? [element] : [...element.querySelectorAll<HTMLElement>(interactionSelector)];
    if (!surfaces.length) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const root = document.getElementById('root');
    const hovered = new Set(surfaces.filter(node => window.matchMedia('(hover: hover)').matches && node.matches(':hover')));
    const containsFocus = (target: EventTarget | null) => target instanceof Node && surfaces.some(node => node.contains(target));
    let focused = containsFocus(document.activeElement);
    let visible = false;
    let alive = true;
    let pressed = false;
    let timer: number | undefined;
    let cancelSlide: (() => void) | undefined;

    function stop() {
      window.clearInterval(timer);
      timer = undefined;
      cancelSlide?.();
      cancelSlide = undefined;
    }
    function schedule() {
      stop();
      if (paused || !alive || !visible || pressed || focused || hovered.size || document.hidden || motion.matches || root?.hasAttribute('inert')) return;
      timer = window.setInterval(() => {
        if (!alive) return;
        cancelSlide?.();
        cancelSlide = advanceRef.current() || undefined;
      }, intervalMs);
    }
    const enter = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      hovered.add(event.currentTarget as HTMLElement);
      schedule();
    };
    const leave = (event: PointerEvent) => { hovered.delete(event.currentTarget as HTMLElement); schedule(); };
    const focusIn = () => { focused = true; schedule(); };
    const focusOut = (event: FocusEvent) => { focused = containsFocus(event.relatedTarget); schedule(); };
    const down = () => { pressed = true; schedule(); };
    const up = () => { if (pressed) { pressed = false; schedule(); } };
    // React gives specialized rails the first chance to handle their own keys.
    const keyDown = (event: KeyboardEvent) => {
      const rail = event.target;
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey ||
          !(rail instanceof HTMLElement) || rail !== document.activeElement ||
          !rail.hasAttribute('data-auto-rail') || !containsFocus(rail)) return;
      const max = rail.scrollWidth - rail.clientWidth;
      if (max < 2) return;
      let target: number;
      switch (event.key) {
        case 'ArrowRight': target = adjacentRailOffset(rail, false); break;
        case 'ArrowLeft': target = adjacentRailOffset(rail, true); break;
        case 'Home': target = 0; break;
        case 'End': target = max; break;
        default: return;
      }
      event.preventDefault();
      rail.scrollLeft = target;
    };
    let observer: IntersectionObserver | undefined;
    try {
      observer = new IntersectionObserver(entries => {
        if (!alive || !observer) return;
        visible = !!entries[0]?.isIntersecting;
        schedule();
      }, {threshold: .05});
      observer.observe(element);
    } catch {
      observer?.disconnect();
      observer = undefined;
    }
    const modalObserver = root && new MutationObserver(schedule);
    if (root) modalObserver?.observe(root, {attributes: true, attributeFilter: ['inert']});
    for (const node of surfaces) {
      node.addEventListener('pointerenter', enter);
      node.addEventListener('pointerleave', leave);
      node.addEventListener('focusin', focusIn);
      node.addEventListener('focusout', focusOut);
      node.addEventListener('pointerdown', down, {passive: true});
      node.addEventListener('wheel', schedule, {passive: true});
    }
    window.addEventListener('pointerup', up, {passive: true});
    window.addEventListener('pointercancel', up, {passive: true});
    document.addEventListener('keydown', keyDown);
    document.addEventListener('visibilitychange', schedule);
    motion.addEventListener('change', schedule);
    return () => {
      alive = false;
      stop();
      observer?.disconnect();
      modalObserver?.disconnect();
      for (const node of surfaces) {
        node.removeEventListener('pointerenter', enter);
        node.removeEventListener('pointerleave', leave);
        node.removeEventListener('focusin', focusIn);
        node.removeEventListener('focusout', focusOut);
        node.removeEventListener('pointerdown', down);
        node.removeEventListener('wheel', schedule);
      }
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      document.removeEventListener('keydown', keyDown);
      document.removeEventListener('visibilitychange', schedule);
      motion.removeEventListener('change', schedule);
    };
  }, [container, interactionSelector, intervalMs, disabled, paused]);
}

/** Static rows need neither an extra tab stop nor an autoplay timer. */
export function useScrollableRail(rail: RefObject<HTMLElement | null>) {
  const [overflow, setOverflow] = useState(true);
  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    const measure = () => {
      if (element.clientWidth > 0) setOverflow(element.scrollWidth > element.clientWidth + 1);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    for (const card of element.children) observer.observe(card);
    return () => observer.disconnect();
  }, [rail]);
  useHomeCarousel(rail, () => advanceHomeRail(rail.current), undefined, {disabled: !overflow});
  return overflow;
}

export function adjacentRailOffset(rail: HTMLElement, backwards: boolean) {
  const start = rail.scrollLeft;
  const max = rail.scrollWidth - rail.clientWidth;
  const cards = Array.from(rail.children) as HTMLElement[];
  const origin = cards[0]?.offsetLeft ?? 0;
  const offsets = cards.map(card => Math.min(max, card.offsetLeft - origin));
  return backwards
    ? offsets.reverse().find(offset => offset < start - 2) ?? 0
    : offsets.find(offset => offset > start + 2) ?? max;
}

// Reverse at either end so a long strip never sweeps back through every card.
const reverseRail = new WeakSet<HTMLElement>();
export function advanceHomeRail(rail: HTMLElement | null, durationMs = 500) {
  if (!rail || rail.scrollWidth <= rail.clientWidth + 1) return;
  const start = rail.scrollLeft;
  const max = rail.scrollWidth - rail.clientWidth;
  if (start >= max - 2) reverseRail.add(rail);
  if (start <= 2) reverseRail.delete(rail);
  return slideRailTo(rail, adjacentRailOffset(rail, reverseRail.has(rail)), durationMs);
}

/** Animate a measured native-scroll offset. The returned cancellation restores scroll snapping. */
export function slideRailTo(rail: HTMLElement, target: number, durationMs: number) {
  const start = rail.scrollLeft;
  const started = performance.now();
  const previousSnap = rail.style.scrollSnapType;
  rail.style.scrollSnapType = 'none';
  let frame = 0, alive = true;
  const finish = () => {
    if (!alive) return;
    alive = false;
    cancelAnimationFrame(frame);
    rail.style.scrollSnapType = previousSnap;
  };
  const tick = (now: number) => {
    if (!alive) return;
    if (!rail.isConnected) { finish(); return; }
    const progress = Math.min(1, Math.max(0, (now - started) / durationMs));
    rail.scrollLeft = start + (target - start) * (1 - (1 - progress) ** 3);
    if (progress < 1) frame = requestAnimationFrame(tick);
    else finish();
  };
  frame = requestAnimationFrame(tick);
  return finish;
}
