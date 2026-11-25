import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {mkdir,rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';

const folder='.home-carousel-test';
await mkdir(folder,{recursive:true});
await build({stdin:{contents:`import React,{useRef,useState} from 'react'; import {useHomeCarousel,useScrollableRail} from './src/useHomeCarousel'; export {advanceHomeRail} from './src/useHomeCarousel'; export function Harness({custom=false,intervalMs,disabled=false}){
 const area=useRef(null);
 const [count,setCount]=useState(0);
 useHomeCarousel(area,()=>{setCount(v=>v+1);return ()=>window.__cancelled++},custom?'.service-rail':undefined,{intervalMs,disabled});
 return <section ref={area}><div data-auto-rail="" tabIndex={0} className={custom?'service-rail':'ref-news-grid'}><button className="slide">Article</button><span>{count}</span></div></section>
 }
 export function OverflowHarness(){
   const rail=useRef(null);
   const overflow=useScrollableRail(rail);
   return <div data-auto-rail="" ref={rail} tabIndex={overflow ? 0 : undefined}><i/><i/></div>;
 }
`,resolveDir:process.cwd(),sourcefile:'home-carousel-test.tsx',loader:'tsx'},bundle:true,format:'esm',platform:'node',packages:'external',outfile:`${folder}/bundle.mjs`,logLevel:'silent'});
const dom=new JSDOM('<div id="root"></div>',{pretendToBeVisual:true});
for(const k of ['window','document','navigator','HTMLElement','Element','Node','Event','FocusEvent','MutationObserver'])Object.defineProperty(globalThis,k,{configurable:true,writable:true,value:dom.window[k]});
let callback, timer, schedules=0, reduced=false, hidden=false, motionChange, observerFailure='';
window.__cancelled=0;
window.setInterval=(fn,ms)=>{assert.equal(ms,window.__expectedInterval || 6000);timer=fn;schedules++;return schedules};
window.clearInterval=()=>{timer=undefined};
window.matchMedia=()=>({get matches(){return reduced},addEventListener(_,fn){motionChange=fn},removeEventListener(){}});
Object.defineProperty(document,'hidden',{configurable:true,get:()=>hidden});
globalThis.IntersectionObserver=class{constructor(fn){if(observerFailure==='constructor')throw Error('observer');callback=fn}observe(){if(observerFailure==='observe')throw Error('observe')}disconnect(){}};
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
const React=await import('react');const {createRoot}=await import('react-dom/client');const {Harness,OverflowHarness,advanceHomeRail}=await import(pathToFileURL(`${process.cwd()}/${folder}/bundle.mjs`).href);const root=createRoot(document.getElementById('root'));
try {
 await React.act(async()=>root.render(React.createElement(Harness)));
 const content=document.querySelector('.ref-news-grid'), slide=content.querySelector('.slide'), count=content.querySelector('span');
 assert.equal(timer,undefined,'offscreen remains still');
 await React.act(()=>callback([{isIntersecting:true}]));
 assert.equal(typeof timer,'function');
 await React.act(()=>timer());assert.equal(count.textContent,'1');
 await React.act(()=>slide.focus());assert.equal(timer,undefined);
 assert.ok(window.__cancelled>0,'focus cancels in-flight motion');
 content.dispatchEvent(new Event('pointerenter'));
 await React.act(()=>slide.blur());assert.equal(timer,undefined,'hover still blocks even after blur');
 content.dispatchEvent(new Event('pointerleave'));assert.equal(typeof timer,'function');
 content.dispatchEvent(new Event('pointerdown'));assert.equal(timer,undefined);
 window.dispatchEvent(new Event('pointercancel'));assert.equal(typeof timer,'function');
 const touchEnter=new Event('pointerenter');Object.defineProperty(touchEnter,'pointerType',{value:'touch'});
 content.dispatchEvent(touchEnter);assert.equal(typeof timer,'function','touch hover does not stick');
 content.dispatchEvent(new Event('pointerdown'));window.dispatchEvent(new Event('pointerup'));assert.equal(typeof timer,'function');
 await React.act(()=>document.getElementById('root').setAttribute('inert',''));assert.equal(timer,undefined);
 await React.act(()=>document.getElementById('root').removeAttribute('inert'));assert.equal(typeof timer,'function');
 hidden=true;document.dispatchEvent(new Event('visibilitychange'));assert.equal(timer,undefined);
 hidden=false;document.dispatchEvent(new Event('visibilitychange'));assert.equal(typeof timer,'function');
 reduced=true;motionChange();assert.equal(timer,undefined);
 reduced=false;motionChange();assert.equal(typeof timer,'function');
 // Focused strips advance to each actual child offset; nested actions retain their own keys.
 Object.defineProperties(content,{scrollWidth:{value:800},clientWidth:{value:250}});
 Object.defineProperty(content.children[1],'offsetLeft',{value:180});
 const third=document.createElement('i');content.append(third);
 Object.defineProperty(third,'offsetLeft',{value:425});
 const key=(el,k,options={})=>el.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:k,bubbles:true,cancelable:true,...options}));
 await React.act(()=>content.focus());
 assert.equal(key(content,'ArrowRight'),false);assert.equal(content.scrollLeft,180);
 key(content,'ArrowRight');assert.equal(content.scrollLeft,425);
 key(content,'End');assert.equal(content.scrollLeft,550);
 key(content,'ArrowLeft');assert.equal(content.scrollLeft,425);
 key(content,'Home');assert.equal(content.scrollLeft,0);
 reduced=true;motionChange();key(content,'End');assert.equal(content.scrollLeft,550,'reduced-motion preserves direct navigation');key(content,'Home');reduced=false;motionChange();
 assert.equal(key(content,'End',{ctrlKey:true}),true);assert.equal(content.scrollLeft,0);
 content.addEventListener('keydown',event=>event.preventDefault(),{once:true});
 key(content,'ArrowRight');assert.equal(content.scrollLeft,0,'custom rail key handling wins');
 await React.act(()=>slide.focus());assert.equal(key(slide,'ArrowRight'),true);
 assert.equal(content.scrollLeft,0,'keys on child links/buttons are untouched');
 const oldObserver=callback;
 await React.act(()=>root.render(null));assert.equal(timer,undefined);
 oldObserver([{isIntersecting:true}]);assert.equal(timer,undefined,'stale observer after unmount');
 for(const mode of ['constructor','observe']){
   observerFailure=mode;
   await React.act(()=>root.render(React.createElement(Harness,{key:mode})));
   if(mode==='observe')callback([{isIntersecting:true}]);
   assert.equal(timer,undefined);
   const fallback=document.querySelector('[data-auto-rail]');
   Object.defineProperties(fallback,{clientWidth:{value:200},scrollWidth:{value:420}});
   await React.act(()=>fallback.focus());key(fallback,'End');assert.equal(fallback.scrollLeft,220,'navigation works on observer failure');
   await React.act(()=>root.render(null));
 }
 observerFailure='';
 window.__expectedInterval=7200;
 await React.act(()=>root.render(React.createElement(Harness,{custom:true,intervalMs:7200})));
 await React.act(()=>callback([{isIntersecting:true}]));assert.equal(typeof timer,'function');
 await React.act(()=>root.render(React.createElement(Harness,{custom:true,disabled:true})));assert.equal(timer,undefined);
 await React.act(()=>root.render(null));
 delete window.__expectedInterval;
 await React.act(()=>root.render(React.createElement(OverflowHarness)));
 const strip=document.querySelector('[data-auto-rail]');let stripWidth=320;
 Object.defineProperties(strip,{clientWidth:{value:320},scrollWidth:{get:()=>stripWidth}});
 await React.act(()=>window.dispatchEvent(new Event('resize')));
 assert.ok(!strip.hasAttribute('tabindex'));assert.equal(timer,undefined,'static row neither schedules nor receives Tab');
 stripWidth=700;
 await React.act(()=>window.dispatchEvent(new Event('resize')));
 await React.act(()=>callback([{isIntersecting:true}]));
 assert.equal(strip.tabIndex,0);assert.equal(typeof timer,'function','breakpoint overflow restores autoplay');
 stripWidth=320;
 await React.act(()=>window.dispatchEvent(new Event('resize')));
 assert.ok(!strip.hasAttribute('tabindex'));assert.equal(timer,undefined,'widening to fit cancels autoplay');
 await React.act(()=>root.render(null));
 // Exercise real 500ms scroll and cancellation with snap restoration.
 const rail=document.createElement('div');rail.innerHTML='<i></i><i></i>';document.body.append(rail);
 Object.defineProperties(rail,{scrollWidth:{value:600},clientWidth:{value:200}});Object.defineProperty(rail.children[1],'offsetLeft',{value:200});rail.style.scrollSnapType='x mandatory';
 let frame, cancelled=false;globalThis.requestAnimationFrame=fn=>{frame=fn;return 7};globalThis.cancelAnimationFrame=()=>{cancelled=true};
 const cancel=advanceHomeRail(rail);assert.equal(rail.style.scrollSnapType,'none');const staleFrame=frame;cancel();assert.equal(rail.style.scrollSnapType,'x mandatory');assert.ok(cancelled);staleFrame(performance.now()+600);assert.equal(rail.scrollLeft,0,'cancelled frame cannot move rail');
 cancelled=false;advanceHomeRail(rail);frame(performance.now()+600);assert.equal(rail.scrollLeft,200);assert.equal(rail.style.scrollSnapType,'x mandatory','completion restores snap');
 console.log('PASS home rails: autoplay, variable-width keyboard navigation, overflow across breakpoints, input and motion guards, observer fallback and snap restoration');
} finally {await React.act(async()=>root.unmount());dom.window.close();await rm(folder,{recursive:true,force:true});}
