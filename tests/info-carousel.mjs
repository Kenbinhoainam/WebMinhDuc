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
 let nextTimer = 0;
 window.setInterval = (callback, delay) => {timers.set(++nextTimer, delay);return nextTimer;};
 window.clearInterval = id => timers.delete(id);
 const React=await import('react');const {act}=React;const {createRoot}=await import('react-dom/client');const {MemoryRouter,Routes,Route,useNavigate}=await import('react-router-dom');const {ServicePage,ContactContext,getDemoSubmissions}=await import(pathToFileURL(bundle).href);const root=createRoot(document.getElementById('root'));
 let navigate,requestedService;
 function VisitService(){
   navigate=useNavigate();
   return React.createElement(ContactContext.Provider,{value:value=>{requestedService=value}},React.createElement(ServicePage));
 }
 await act(()=>root.render(React.createElement(MemoryRouter,{initialEntries:['/services/labor-supply']},React.createElement(Routes,null,React.createElement(Route,{path:'/services/:slug',element:React.createElement(VisitService)})))));
 const serviceRail = document.querySelector('.info-service-cards');
 const storyRail = document.querySelector('.info-testimonial-rail');
 const rails = [serviceRail, storyRail];
 assert.equal(document.querySelector('.info-service-rail button,.info-rail-controls,.info-carousel-pause'), null);
 const ownObservers = observers.filter(observer => rails.includes(observer.target));
 assert.equal(ownObservers.length, 2, 'visibility is observed at each track');
 assert.equal(timers.size, 0, 'no rail advances before it is visible');
 for (const rail of rails) {
   assert.ok(rail.matches('[data-auto-rail][role="region"][tabindex="0"][aria-label]'));
   Object.defineProperties(rail, {clientWidth:{value:390},scrollWidth:{value:1170}});
   await act(() => ownObservers.find(observer => observer.target === rail).cb([{target:rail,isIntersecting:true,intersectionRatio:1}]));
 }
 assert.deepEqual([...timers.values()], [6000, 6000]);
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

 const cases=[
   ['labor-supply','Giới thiệu & cung ứng nhân lực'],
   ['labor-leasing','Cho thuê lao động'],
   ['recruitment','Headhunt & lao động tay nghề'],
   ['hr-consulting','Setup tổ chức & phần mềm doanh nghiệp'],
 ];
 for(const [slug,expectedService] of cases) {
   const path='/services/'+slug;
   await act(()=>navigate(path));
   await act(()=>document.querySelector('.md-masthead-actions button').click());
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
