import {build} from 'esbuild';
import {rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
const file=process.cwd()+'/.info-v13-test.mjs';
await build({stdin:{contents:"export {AboutPage} from './src/pages/info/AboutPage';export {ServicePage,ServicesPage} from './src/pages/info/ServicesPages';export {PartnersPage} from './src/pages/info/PartnersPage';export {BrochurePage} from './src/pages/info/BrochurePage';",resolveDir:process.cwd(),sourcefile:'info-entry.tsx'},bundle:true,platform:'node',format:'esm',outfile:file,packages:'external',loader:{'.css':'empty'},logLevel:'silent'});
try {
 const dom=new JSDOM('<div id="root"></div>',{url:'https://example.test/',pretendToBeVisual:true});
 for(const key of ['window','document','navigator','HTMLElement','Element','Node','Event','MutationObserver','localStorage','requestAnimationFrame','cancelAnimationFrame'])Object.defineProperty(globalThis,key,{configurable:true,writable:true,value:dom.window[key]});
 window.matchMedia=()=>({matches:true,addEventListener(){},removeEventListener(){}});window.scrollTo=()=>{};globalThis.IS_REACT_ACT_ENVIRONMENT=true;
 const React=await import('react');const {act}=React;const {createRoot}=await import('react-dom/client');const {MemoryRouter,Routes,Route}=await import('react-router-dom');const pages=await import(pathToFileURL(file).href);const root=createRoot(document.getElementById('root'));
 const render=async(path,component,pattern=path)=>act(()=>root.render(React.createElement(MemoryRouter,{key:path,initialEntries:[path]},React.createElement(Routes,null,React.createElement(Route,{path:pattern,element:React.createElement(component)})))));
 await render('/about-us',pages.AboutPage);assert.equal(document.querySelectorAll('.info-about-values article').length,3);assert.equal(document.querySelector('[data-reveal] [data-reveal]'),null,'about reveal frames do not nest');assert.equal(document.querySelectorAll('.info-stat-grid [data-reveal]').length,4);assert.equal(document.querySelectorAll('.info-history-track [role=tab]').length,3);const slides=[...document.querySelectorAll('.info-history-slide')];await act(()=>document.querySelectorAll('.info-history-track [role=tab]')[1].click());assert.equal(document.querySelectorAll('.info-history-slide')[0],slides[0],'history slides stay mounted during movement');assert.match(document.querySelector('#history-panel').textContent,/Đồng hành từng bước/);assert.equal(document.querySelector('#history [data-auto-rail]').tabIndex,0,'native scroll rail is keyboard accessible');assert.equal(document.querySelector('[role=tab][aria-selected=true]').textContent,'Đồng hành');assert.equal(document.querySelector('#history .info-carousel-pause'),null,'timeline has no autoplay transport buttons');const historyDetail=document.querySelector('#history-panel button');await act(()=>historyDetail.focus());await act(()=>historyDetail.click());assert.match(document.querySelector('[role=dialog]').textContent,/Đồng hành từng bước/);await act(()=>document.dispatchEvent(new window.KeyboardEvent('keydown',{key:'Escape',bubbles:true})));assert.equal(document.activeElement,historyDetail);assert.equal(document.querySelectorAll('.info-team-card').length,4);assert.ok(document.querySelector('.info-document-grid'));
 const trigger=document.querySelector('.info-team-card');trigger.focus();await act(()=>trigger.click());assert.ok(document.querySelector('[role=dialog]'));await act(()=>document.dispatchEvent(new window.KeyboardEvent('keydown',{key:'Escape',bubbles:true})));assert.equal(document.activeElement,trigger);
 await render('/services',pages.ServicesPage);assert.equal(document.querySelectorAll('.md-ref-service-metrics article').length,3);
 for(const slug of ['labor-supply','labor-leasing','recruitment','college-admissions','hr-consulting']){await render('/services/'+slug,pages.ServicePage,'/services/:slug');const list=[...document.querySelector('main')?.children||document.querySelector('#root').children];assert.equal(!!document.querySelector('.info-fee-table caption'),slug!=='recruitment');assert.equal(!!document.querySelector('.md-ref-fee-highlight'),slug==='recruitment');assert.ok(document.querySelector('.md-ref-service-highlights'));if(slug==='college-admissions'){for(const form of ['F05','F06'])assert.ok(document.querySelector(`a[href="/education?form=${form}#dang-ky"]`),`admissions ${form} route`);assert.equal(document.querySelector('.info-contact-section form'),null)}else assert.ok(document.querySelector('.info-contact-section form'),`${slug} business form`);assert.equal(document.querySelector('[data-reveal] [data-reveal]'),null,`no nested reveal frames for ${slug}`);assert.equal(!!document.querySelector('.info-service-customers'),slug!=='recruitment');const feature=document.querySelector('.md-ref-service-highlights'),fee=document.querySelector('.md-ref-fee-section');assert.equal(!!(feature.compareDocumentPosition(fee)&Node.DOCUMENT_POSITION_FOLLOWING),slug!=='hr-consulting');}
 await render('/partners',pages.PartnersPage);
 const partnerList=document.querySelector('.partners-strip'),stories=document.querySelector('.info-testimonial-rail');
 assert.ok(partnerList.compareDocumentPosition(stories) & Node.DOCUMENT_POSITION_FOLLOWING,'partner names precede illustrative stories');
 assert.ok(document.querySelector('.partners-actions a[href="/jobs"]'));
 await render('/e-brochure',pages.BrochurePage);let controls=document.querySelectorAll('.md-brochure-controls button');assert.equal(controls[0].disabled,true);await act(()=>controls[1].click());assert.match(document.querySelector('.md-brochure-page').textContent,/Giải pháp/);assert.match(document.querySelector('.md-brochure-controls').textContent,/2 \/ 3/);assert.equal(document.querySelectorAll('.md-brochure [aria-live]').length,1,'one spoken page announcement');
 assert.equal(document.querySelectorAll('.md-brochure-print > div').length,3,'all three pages present for print from the second page');
 const printed=document.querySelector('.md-brochure-print').textContent;
 assert.match(printed,/Giải pháp của chúng tôi/);assert.match(printed,/SAMSUNG/);
 let printCalls=0;window.print=()=>{printCalls++;};
 await act(()=>document.querySelector('.md-brochure-toolbar button').click());assert.equal(printCalls,1);
 await act(()=>controls[1].click());assert.equal(controls[1].disabled,true);
 // Exercise rotation without waiting six real seconds. Visibility is supplied only to history.
 const intervals=new Map(), observers=new Map();let timerId=0;
 const motionListeners=new Set();
 const motion={matches:false,addEventListener(_,fn){motionListeners.add(fn);},removeEventListener(_,fn){motionListeners.delete(fn);}};
 window.matchMedia=query=>query.includes('reduced-motion')?motion:{matches:false,addEventListener(){},removeEventListener(){}};
 window.setInterval=(callback,ms)=>{intervals.set(++timerId,{callback,ms});return timerId;};
 window.clearInterval=id=>intervals.delete(id);
 globalThis.IntersectionObserver=class {
   constructor(callback){this.callback=callback;}
   observe(element){this.element=element;observers.set(element,this.callback);}
   disconnect(){if(this.element)observers.delete(this.element);}
 };
 const historyTimer=()=>[...intervals.values()].find(timer=>timer.ms===6000);
 await render('/about-us',pages.AboutPage);
 const history=document.getElementById('history');
 const show=()=>act(()=>observers.get(history)([{isIntersecting:true}]));
 await show();assert.ok(historyTimer(),'history starts a six-second rotation in view');
 await act(()=>historyTimer().callback());assert.match(document.querySelector('#history-panel h3').textContent,/Đồng hành từng bước/);
 const track=history.querySelector('[data-auto-rail]');
 await act(()=>track.focus());assert.equal(historyTimer(),undefined,'reading by keyboard pauses rotation');
 await act(()=>track.blur());await show();assert.ok(historyTimer(),'rotation resumes after focus leaves');
 Object.defineProperty(track,'clientWidth',{configurable:true,value:390});
 const cards=[...track.children];
 cards.forEach((card,index)=>{Object.defineProperty(card,'offsetWidth',{configurable:true,value:390});Object.defineProperty(card,'offsetLeft',{configurable:true,value:index*408});});
 const scrollRequests=[];
 track.scrollTo=options=>{scrollRequests.push(options);if(options.behavior==='instant')track.scrollLeft=options.left;};
 await act(()=>history.querySelector('#history-tab-2').dispatchEvent(new window.MouseEvent('click',{detail:1,bubbles:true})));
 assert.deepEqual(scrollRequests.at(-1),{left:816,behavior:'smooth'});
 // Midway through the browser's native smooth scroll, the user enables reduced motion.
 track.scrollLeft=57;
 await act(()=>{motion.matches=true;motionListeners.forEach(fn=>fn());});
 assert.deepEqual(scrollRequests.at(-1),{left:816,behavior:'instant'});
 assert.equal(track.scrollLeft,816,'the original destination is reached without another animated frame');
 await act(()=>{motion.matches=false;motionListeners.forEach(fn=>fn());});
 track.scrollLeft=408;
 await act(async()=>{track.dispatchEvent(new Event('scroll'));await new Promise(resolve=>setTimeout(resolve,140));});
 assert.equal(history.querySelector('[aria-selected=true]').textContent,'Đồng hành');
 track.scrollLeft=816;
 await act(async()=>{track.dispatchEvent(new Event('scroll'));await new Promise(resolve=>setTimeout(resolve,140));});
 assert.equal(history.querySelector('[aria-selected=true]').textContent,'Mở rộng','a native swipe synchronizes the selected tab and details');
 await act(()=>history.querySelector('#history-panel button').click());
 assert.equal(historyTimer(),undefined,'history details suspend autoplay');
 await act(()=>root.unmount());dom.window.close();console.log('PASS Info page family structure and interactions');
}finally{await rm(file,{force:true})}
