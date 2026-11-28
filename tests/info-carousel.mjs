import {build} from 'esbuild';
import {rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
const bundle=process.cwd()+'/.info-carousel-test.mjs';
await build({stdin:{contents:"export {ServicePage} from './src/InfoPages';export {ContactContext} from './src/shared';export {getDemoSubmissions} from './src/demo-submissions';",resolveDir:process.cwd(),sourcefile:'info-carousel-entry.tsx'},bundle:true,platform:'node',format:'esm',outfile:bundle,packages:'external',loader:{'.css':'empty'},logLevel:'silent'});
try{
 const dom=new JSDOM('<div id="root"></div>',{url:'http://localhost/',pretendToBeVisual:true});
 for(const key of ['window','document','navigator','HTMLElement','Element','Node','Event','MutationObserver','localStorage','requestAnimationFrame','cancelAnimationFrame','FormData'])Object.defineProperty(globalThis,key,{configurable:true,writable:true,value:dom.window[key]});
 globalThis.IS_REACT_ACT_ENVIRONMENT=true;
 const reducedMotion = new window.EventTarget();
 reducedMotion.matches = false;
 window.matchMedia = query => query.includes('reduced-motion') ? reducedMotion : {matches:false,addEventListener(){},removeEventListener(){}};
 const observers=[];globalThis.IntersectionObserver=class{constructor(cb){this.cb=cb;observers.push(this)}observe(el){this.target=el}disconnect(){}};
 const timers = new Map();
 const callbacks = new Map();
 let nextTimer = 0;
 window.setInterval = (callback, delay) => {
   const id=++nextTimer;
   timers.set(id,delay);
   callbacks.set(id,callback);
   return id;
 };
 window.clearInterval = id => {timers.delete(id);callbacks.delete(id);};
 const React=await import('react');const {act}=React;const {createRoot}=await import('react-dom/client');const {MemoryRouter,Routes,Route,useNavigate}=await import('react-router-dom');const {ServicePage,ContactContext,getDemoSubmissions}=await import(pathToFileURL(bundle).href);const root=createRoot(document.getElementById('root'));
 let navigate,requestedService;
 function VisitService(){
   navigate=useNavigate();
   return React.createElement(ContactContext.Provider,{value:value=>{requestedService=value}},React.createElement(ServicePage));
 }
 await act(()=>root.render(React.createElement(MemoryRouter,{initialEntries:['/services/labor-supply']},React.createElement(Routes,null,React.createElement(Route,{path:'/services/:slug',element:React.createElement(VisitService)})))));
 const serviceRail = document.querySelector('.service-gallery-track');
 const storyRail = document.querySelector('.info-testimonial-rail');
 const rails = [serviceRail, storyRail];
 const controls = [...document.querySelectorAll('.service-gallery-controls button')];
 assert.deepEqual(controls.map(button=>button.getAttribute('aria-controls')),[serviceRail.id,serviceRail.id]);
 const observedSurface = rail => rail===serviceRail ? rail.closest('.service-gallery') : rail;
 const ownObservers = observers.filter(observer => rails.some(rail=>observedSurface(rail)===observer.target));
 assert.equal(ownObservers.length, 2, 'visibility is observed at each track');
 assert.equal(timers.size, 0, 'no rail advances before it is visible');
 for (const rail of rails) {
   assert.ok(rail.matches('[data-auto-rail][role="region"][tabindex="0"][aria-label]'));
   Object.defineProperties(rail, {clientWidth:{value:780},scrollWidth:{value:rail.children.length*390}});
   await act(() => ownObservers.find(observer => observer.target === observedSurface(rail)).cb([{target:rail,isIntersecting:true,intersectionRatio:1}]));
 }
 assert.deepEqual([...timers.values()], [4500, 6000], 'only services use the faster reading interval');
 for (const child of serviceRail.children) {
   Object.defineProperty(child,'offsetLeft',{get:()=>[...serviceRail.children].indexOf(child)*390});
 }
 const offsets=[];
 serviceRail.scrollTo=({left,behavior})=>{offsets.push([left,behavior]);serviceRail.scrollLeft=left;};
 const links = [...serviceRail.querySelectorAll('a')];
 const leading = () => serviceRail.children[Math.round(serviceRail.scrollLeft/390)].querySelector('a');
 const gallery=serviceRail.closest('.service-gallery');
 assert.equal(gallery.style.getPropertyValue('--service-slide-time'),'var(--motion-t2,180ms)');
 const tickService = () => callbacks.get([...timers].find(([,delay])=>delay===4500)[0])();
 const frames = new Map();
 let time=1000, nextFrame=0;
 const clock=Object.getOwnPropertyDescriptor(performance,'now');
 Object.defineProperty(performance,'now',{configurable:true,value:()=>time});
 const raf=globalThis.requestAnimationFrame, caf=globalThis.cancelAnimationFrame;
 globalThis.requestAnimationFrame=callback=>{frames.set(++nextFrame,callback);return nextFrame;};
 globalThis.cancelAnimationFrame=id=>frames.delete(id);
 function advanceTime(ms) {
   time+=ms;
   const next=[...frames.values()];
   frames.clear();
   for(const fn of next) fn(time);
 }
 try {
   const step = async (start,end,trigger) => {
     await act(trigger);
     assert.equal(serviceRail.scrollLeft,start,'the step begins from the current reading position');
     assert.equal(frames.size,1);
     advanceTime(90);
     assert.equal(serviceRail.scrollLeft,start+(end-start)*.875,'auto, buttons and wrap share cubic ease-out');
     advanceTime(90);
     assert.equal(serviceRail.scrollLeft,end,'the slide finishes at the T2 fallback of 180 ms');
     assert.equal(frames.size,0);
     assert.equal(serviceRail.style.scrollSnapType,'');
   };
   await step(0,390,tickService);
   await step(390,780,()=>controls[1].click());
   assert.equal(leading(),links[2]);
   await step(780,390,tickService);
   assert.equal(leading(),links[1],'auto reverses one card at the end of the track');
   await step(390,0,tickService);
   await step(0,390,tickService);
   await step(390,0,()=>controls[0].click());
   assert.equal(leading(),links[0]);
   await act(()=>controls[0].click());
   await act(()=>controls[1].click());
   assert.deepEqual(offsets,[[780,'instant'],[0,'instant']],'wrapping never sweeps across all services');
   assert.equal(frames.size,0);
   assert.deepEqual([...serviceRail.querySelectorAll('a')],links,'wrap keeps every original link in reading order');
   await act(tickService);
   advanceTime(100);
   await act(()=>gallery.dispatchEvent(new Event('pointerenter')));
   const stopped=serviceRail.scrollLeft;
   advanceTime(500);
   assert.equal(serviceRail.scrollLeft,stopped,'reading on hover interrupts an in-flight slide');
   await act(()=>gallery.dispatchEvent(new Event('pointerleave')));
   await act(()=>controls[1].click());
   advanceTime(70);
   await act(()=>controls[0].click());
   assert.equal(frames.size,1,'a rapid direction change supersedes the previous frame');
   advanceTime(180);
   assert.equal(serviceRail.scrollLeft,0);
 } finally {
   if(clock) Object.defineProperty(performance,'now',clock);
   else delete performance.now;
   globalThis.requestAnimationFrame=raf;
   globalThis.cancelAnimationFrame=caf;
 }
 await act(() => serviceRail.focus());
 assert.equal(timers.size, 1, 'reading one track pauses only that track');
 await act(() => serviceRail.blur());
 assert.equal(timers.size, 2, 'the track resumes after focus leaves');
 await act(() => storyRail.dispatchEvent(new Event('pointerdown', {bubbles:true})));
 assert.equal(timers.size, 1, 'touching a story does not interrupt the service gallery');
 await act(() => window.dispatchEvent(new Event('pointercancel')));
 assert.equal(timers.size, 2, 'a cancelled gesture releases the story rail');
 await act(() => {reducedMotion.matches=true;reducedMotion.dispatchEvent(new Event('change'));});
 assert.equal(timers.size, 0, 'reduced motion stops both tracks immediately');

 offsets.length=0;
 await act(()=>controls[1].click());await act(()=>controls[0].click());await act(()=>controls[0].click());
 assert.deepEqual(offsets,[[390,'instant'],[0,'instant'],[780,'instant']],'normal steps and wrap respect reduced motion');
 assert.equal(leading(),links[2],'the previous button returns to the last group');

 const reportGalleryVisible=()=>observers.findLast(observer=>observer.target===gallery).cb([{isIntersecting:true}]);
 await act(()=>{reducedMotion.matches=false;reducedMotion.dispatchEvent(new Event('change'));});
 const touch=new Event('pointerdown',{bubbles:true});Object.defineProperty(touch,'pointerType',{value:'touch'});
 await act(()=>serviceRail.dispatchEvent(touch));
 await act(()=>window.dispatchEvent(new Event('pointerup')));
 await act(reportGalleryVisible);
 assert.equal(gallery.dataset.userPaused,'true');
 assert.equal(timers.size,1,'touch leaves service rotation paused after the gesture ends');
 const rotation=gallery.querySelector('.service-gallery-rotation');
 assert.equal(rotation.getAttribute('aria-label'),'Phát chuyển động');
 await act(()=>rotation.click());await act(reportGalleryVisible);
 assert.equal(timers.size,2,'the reader can explicitly resume rotation');
 function pointer(target,type,{x,y,pointerType='mouse'}) {
   const event=new window.MouseEvent(type,{bubbles:true,cancelable:true,clientX:x,clientY:y,button:0,buttons:type==='pointerup'?0:1});
   Object.defineProperties(event,{pointerId:{value:3},pointerType:{value:pointerType},isPrimary:{value:true}});
   target.dispatchEvent(event);
   return event;
 }
 const firstCard=links[0];
 serviceRail.scrollLeft=0;
 await act(()=>pointer(firstCard,'pointerdown',{x:340,y:50}));
 await act(()=>pointer(firstCard,'pointermove',{x:337,y:54}));
 assert.equal(serviceRail.dataset.dragging,undefined,'a small movement is still a click');
 await act(()=>pointer(firstCard,'pointermove',{x:140,y:55}));
 assert.equal(serviceRail.scrollLeft,200,'mouse grab moves the actual scroller by the drag distance');
 assert.equal(serviceRail.dataset.dragging,'true');
 await act(()=>pointer(serviceRail,'pointerup',{x:140,y:55}));
 assert.equal(serviceRail.dataset.dragging,undefined,'scroll snapping is restored after release');
 let hit=false;
 firstCard.addEventListener('click',()=>{hit=true;},{once:true});
 await act(()=>firstCard.dispatchEvent(new window.MouseEvent('click',{bubbles:true,cancelable:true,detail:1})));
 assert.equal(hit,false,'the click following a drag never opens its card');
 await act(()=>pointer(firstCard,'pointerdown',{x:200,y:55,pointerType:'touch'}));
 const vertical=pointer(firstCard,'pointermove',{x:202,y:120,pointerType:'touch'});
 assert.equal(vertical.defaultPrevented,false,'vertical touch swipes stay native');
 assert.equal(serviceRail.scrollLeft,200);
 await act(()=>pointer(firstCard,'pointerup',{x:202,y:120,pointerType:'touch'}));
 await act(()=>pointer(firstCard,'pointerdown',{x:202,y:120,pointerType:'touch'}));
 await act(()=>pointer(firstCard,'pointerup',{x:202,y:120,pointerType:'touch'}));
 await act(()=>firstCard.dispatchEvent(new window.MouseEvent('click',{bubbles:true,cancelable:true,detail:1,button:0})));
 assert.ok(hit,'a single tap opens the card on a touch device');
 assert.equal(document.querySelector('h1').textContent,'Cho thuê lao động');
 const cases=[
   ['labor-supply','Giới thiệu & cung ứng nhân lực'],
   ['labor-leasing','Cho thuê lao động'],
   ['recruitment','Headhunt & lao động tay nghề'],
   ['hr-consulting','Setup tổ chức & phần mềm doanh nghiệp'],
 ];
 for(const [slug,expectedService] of cases) {
   const path='/services/'+slug;
   await act(()=>navigate(path));
   await act(()=>document.querySelector('.service-overview-actions button').click());
   assert.equal(requestedService,expectedService,'masthead inquiry opens with this service');
   const form=document.querySelector('#business-contact form');
   assert.ok(form,'navigation clears the previous service receipt');
   assert.equal(form.elements.service.value,expectedService);
   const input=(name,value)=>{
     const element=form.elements.namedItem(name);
     const prototype=element.tagName==='TEXTAREA'?dom.window.HTMLTextAreaElement.prototype:dom.window.HTMLInputElement.prototype;
     Object.getOwnPropertyDescriptor(prototype,'value').set.call(element,value);
     element.dispatchEvent(new Event('input',{bubbles:true}));
   };
   await act(()=>{input('name','Tên mẫu');input('phone','0912345678');input('location','Bắc Ninh');input('notes','Nhu cầu mẫu');});
   await act(()=>form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
   const submission=getDemoSubmissions().at(-1);
   assert.equal(submission.type,'F01');
   assert.equal(submission.fields.service,expectedService);
   assert.equal(submission.source,path);
 }
 await act(()=>navigate('/services/college-admissions'));
 assert.equal(document.querySelector('#business-contact form'),null);
 for(const type of ['F05','F06']) assert.ok(document.querySelector(`a[href="/education?form=${type}#dang-ky"]`));
 await act(()=>root.unmount());dom.window.close();console.log('PASS service rails, inquiry context and linked records after service navigation');
}finally{await rm(bundle,{force:true})}
