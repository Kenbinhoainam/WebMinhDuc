import {useEffect, useRef, useState, type RefObject} from 'react';

const HOME_INTERACTION_SELECTORS = '.ref-achievement-track,.ref-solution-track,.ref-testimonial-track,.ref-news-grid,.ref-rail-controls,.ref-story-controls';
const CAROUSEL_TOGGLES = '[data-carousel-toggle],.ref-carousel-pause,.info-carousel-pause,.career-carousel-pause,.editorial-feature-pause';

/** Pause when the rail is not visible or its content is being interacted with. */
export function useHomeCarousel(container: RefObject<HTMLElement | null>, advance: () => void | (() => void), interactionSelector = HOME_INTERACTION_SELECTORS, options: {intervalMs?:number;disabled?:boolean} = {}) {
  const [paused, setPaused] = useState(false);
  const intervalMs=Math.max(1000,options.intervalMs ?? 3500), disabled=options.disabled ?? false;
  const advanceRef = useRef(advance);
  advanceRef.current = advance;
  useEffect(() => {
    const element=container.current;
    const controls=element ? Array.from(element.querySelectorAll<HTMLElement>(`${interactionSelector},${CAROUSEL_TOGGLES}`)) : [];
    if (!element || controls.length===0 || disabled) return;
    const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
    const pageRoot=document.getElementById('root');
    let blocked=pageRoot?.hasAttribute('inert') ?? false;
    const isToggle=(target:EventTarget|null)=>target instanceof Element && !!target.closest(CAROUSEL_TOGGLES);
    const hovered=new Set(controls.filter(control=>control.matches(':hover')));
    let alive=true, visible=false, focused=!isToggle(document.activeElement)&&controls.some(control=>control.contains(document.activeElement)), dragging=false;
    let timer:number|undefined, cancelAnimation:(()=>void)|undefined;
    const stop=()=>{if(timer!==undefined){window.clearInterval(timer);timer=undefined;}cancelAnimation?.();cancelAnimation=undefined;};
    const update=()=>{
      if(!alive)return;
      stop();
      if(!paused && !blocked && visible && hovered.size===0 && !focused && !dragging && !document.hidden && !motion.matches)
        timer=window.setInterval(()=>{if(!alive)return;cancelAnimation?.();cancelAnimation=advanceRef.current() || undefined;},intervalMs);
    };
    const enter=(event:Event)=>{hovered.add(event.currentTarget as HTMLElement);update();};
    const leave=(event:Event)=>{hovered.delete(event.currentTarget as HTMLElement);update();};
    // Pointer focus precedes a click: let the toggle click perform exactly one state change.
    // Keyboard entry pauses immediately; an explicit Play can then resume on the same button.
    const focusIn=(event:FocusEvent)=>{if(isToggle(event.target)&&dragging)return;focused=true;setPaused(true);update();};
    const focusOut=(event:FocusEvent)=>{focused=!isToggle(event.relatedTarget)&&controls.some(control=>control.contains(event.relatedTarget as Node | null));update();};
    const pointerDown=()=>{dragging=true;update();};
    const pointerEnd=()=>{dragging=false;update();};
    let observer:IntersectionObserver | undefined, observerValid=false;
    try {
      if(typeof IntersectionObserver!=='undefined') {
        observer=new IntersectionObserver(entries=>{if(!alive || !observerValid)return;visible=entries[0]?.isIntersecting ?? false;update();},{threshold:.1});
        observer.observe(element);observerValid=true;
      }
    } catch { observer?.disconnect();observer=undefined;visible=false; }
    const modalObserver=pageRoot && typeof MutationObserver!=='undefined'
      ? new MutationObserver(()=>{blocked=pageRoot.hasAttribute('inert');update();}) : undefined;
    modalObserver?.observe(pageRoot!,{attributes:true,attributeFilter:['inert']});
    for(const control of controls){control.addEventListener('mouseenter',enter);control.addEventListener('mouseleave',leave);control.addEventListener('focusin',focusIn);control.addEventListener('focusout',focusOut);control.addEventListener('pointerdown',pointerDown,{passive:true});}
    window.addEventListener('pointerup',pointerEnd,{passive:true});window.addEventListener('pointercancel',pointerEnd,{passive:true});
    document.addEventListener('visibilitychange',update);motion.addEventListener('change',update);update();
    return()=>{alive=false;stop();observer?.disconnect();modalObserver?.disconnect();for(const control of controls){control.removeEventListener('mouseenter',enter);control.removeEventListener('mouseleave',leave);control.removeEventListener('focusin',focusIn);control.removeEventListener('focusout',focusOut);control.removeEventListener('pointerdown',pointerDown);}window.removeEventListener('pointerup',pointerEnd);window.removeEventListener('pointercancel',pointerEnd);document.removeEventListener('visibilitychange',update);motion.removeEventListener('change',update);};
  },[container,paused,interactionSelector,intervalMs,disabled]);
  return {paused, toggle:()=>setPaused(value=>!value)};
}

/** Scroll one card over 500ms, suspending snap until completion or cancellation. */
export function advanceHomeRail(rail: HTMLElement | null) {
  if(!rail || rail.scrollWidth <= rail.clientWidth + 1) return;
  const cards=rail.children;
  const step=cards.length>1 ? (cards[1] as HTMLElement).offsetLeft-(cards[0] as HTMLElement).offsetLeft : rail.clientWidth;
  const start=rail.scrollLeft, max=rail.scrollWidth-rail.clientWidth;
  const target=start >= max-2 ? 0 : Math.min(max,start+(step || rail.clientWidth));
  const started=performance.now(), previousSnap=rail.style.scrollSnapType;
  rail.style.scrollSnapType='none';
  let frame=0, alive=true;
  const finish=()=>{if(!alive)return;alive=false;cancelAnimationFrame(frame);rail.style.scrollSnapType=previousSnap;};
  const tick=(now:number)=>{
    if(!alive)return;
    if(!rail.isConnected){finish();return;}
    const progress=Math.max(0,Math.min(1,(now-started)/500));
    rail.scrollLeft=start+(target-start)*(1-(1-progress)**3);
    if(progress<1)frame=requestAnimationFrame(tick);else finish();
  };
  frame=requestAnimationFrame(tick);
  return finish;
}
