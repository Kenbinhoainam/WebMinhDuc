import {build} from 'esbuild';
import {mkdtemp,rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {JSDOM} from 'jsdom';
import assert from 'node:assert/strict';
const dir=await mkdtemp('.consultation-test-');
try {
 await build({stdin:{contents:"export {default as ConsultationPage} from './src/Consultation';",resolveDir:process.cwd(),sourcefile:'entry.tsx'},bundle:true,platform:'node',format:'esm',outfile:`${dir}/bundle.mjs`,packages:'external',loader:{'.css':'empty'},logLevel:'silent'});
 const dom=new JSDOM('<div id="root"></div>',{url:'https://example.test/consultation',pretendToBeVisual:true});
 for(const key of ['window','document','navigator','HTMLElement','Element','Node','Event','MutationObserver','FormData','requestAnimationFrame','cancelAnimationFrame'])Object.defineProperty(globalThis,key,{value:dom.window[key],configurable:true});
 globalThis.IS_REACT_ACT_ENVIRONMENT=true;let requests=0;globalThis.fetch=()=>{requests++;throw Error('Unexpected network request')};
 const React=await import('react');const {act}=React;const {createRoot}=await import('react-dom/client');const {MemoryRouter}=await import('react-router-dom');const {ConsultationPage}=await import(pathToFileURL(`${process.cwd()}/${dir}/bundle.mjs`));
 const root=createRoot(document.getElementById('root'));await act(()=>root.render(React.createElement(MemoryRouter,null,React.createElement(ConsultationPage))));
 const click=el=>act(()=>el.click());const set=(el,value)=>act(()=>{const proto=el.tagName==='TEXTAREA'?dom.window.HTMLTextAreaElement.prototype:dom.window.HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(proto,'value').set.call(el,value);el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}))});
 await click(document.querySelector('.consultation-card .btn'));assert.match(document.querySelector('[role=alert]').textContent,/ngày/);
 const d=new Date();d.setDate(d.getDate()+1);const tomorrow=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
 await set(document.getElementById('consultation-date'),tomorrow);await click(document.querySelector('.consultation-card .btn'));assert.match(document.querySelector('[role=alert]').textContent,/giờ/);
 await click(document.querySelector('[name=consultation-time]'));await click(document.querySelector('.consultation-card .btn'));assert.ok(document.querySelector('.contact-form'));
 await click(document.querySelectorAll('[name=consultation-time]')[1]);assert.equal(document.querySelector('.contact-form'),null,'changing time returns to selection');await click(document.querySelector('[name=consultation-time]'));await click(document.querySelector('.consultation-card .btn'));assert.ok(document.querySelector('.contact-form'));
 await set(document.querySelector('[name=name]'),'Ví dụ');await set(document.querySelector('[name=phone]'),'0912345678');await set(document.querySelector('[name=message]'),'Yêu cầu mẫu');await click(document.querySelector('[name=consent]'));
 await act(()=>document.querySelector('.contact-form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
 assert.match(document.querySelector('.consultation-success').textContent,/09:00/);assert.match(document.querySelector('.consultation-success').textContent,/Không có lịch hẹn thực tế/);assert.equal(requests,0);
 await click(document.querySelector('.consultation-success button'));assert.equal(document.getElementById('consultation-date').value,'');assert.equal(document.activeElement,document.getElementById('consultation-date')); 
 await act(()=>root.unmount());dom.window.close();console.log('PASS consultation date/time validation and local-only confirmation');
}finally{await rm(dir,{recursive:true,force:true})}
