import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {rm} from 'node:fs/promises';
const bundle = `${process.cwd()}/.education-test.mjs`;
await build({stdin:{contents:`export { EducationPage } from './src/Education.tsx';`,resolveDir:process.cwd(),sourcefile:'education-test-entry.tsx'},bundle:true,platform:'node',format:'esm',outfile:bundle,packages:'external',loader:{'.css':'empty'},logLevel:'silent'});
try {
 const dom=new JSDOM('<div id="root"></div>',{url:'http://localhost/',pretendToBeVisual:true});
 for(const key of ['window','document','navigator','HTMLElement','Element','Node','Event','MutationObserver','File','FormData','requestAnimationFrame']) Object.defineProperty(globalThis,key,{configurable:true,writable:true,value:dom.window[key]});
 globalThis.IS_REACT_ACT_ENVIRONMENT=true;
 const React=await import('react');const {act}=React;const {createRoot}=await import('react-dom/client');const {MemoryRouter,useLocation,useNavigate}=await import('react-router-dom');const {EducationPage}=await import(pathToFileURL(bundle).href);
 const root=createRoot(document.getElementById('root'));
 let location, navigate;
 function Capture() {location=useLocation();navigate=useNavigate();return React.createElement(EducationPage);}
 await act(async()=>root.render(React.createElement(MemoryRouter,{initialEntries:['/education']},React.createElement(Capture))));
 const click=async(el)=>act(async()=>el.dispatchEvent(new window.MouseEvent('click',{bubbles:true,cancelable:true})));
 const change=async(selector,value)=>act(async()=>{const el=document.querySelector(selector);const proto=el.tagName==='SELECT'?window.HTMLSelectElement.prototype:window.HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(proto,'value').set.call(el,value);el.dispatchEvent(new window.Event('input',{bubbles:true}));el.dispatchEvent(new window.Event('change',{bubbles:true}));});
 const submit=async()=>act(async()=>document.querySelector('.education-form-card form').dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true})));
 await click(document.querySelectorAll('.education-form-tabs button')[1]);
 assert.equal(location.search,'?form=F06');assert.equal(location.hash,'#dang-ky');
 await act(()=>navigate(-1));assert.equal(location.search,'');assert.equal(document.querySelectorAll('.education-form-tabs button')[0].getAttribute('aria-pressed'),'true');
 await click(document.querySelector('.md-masthead-actions a[href*="form=F05"]'));
 await click(document.querySelectorAll('.education-form-tabs button')[1]);
 assert.equal(location.search,'?form=F06');
 await click(document.querySelector('.md-masthead-actions a[href*="form=F05"]'));
 assert.equal(document.querySelectorAll('.education-form-tabs button')[0].getAttribute('aria-pressed'),'true');
 await click(document.querySelectorAll('.education-form-tabs button')[1]);
 await change('[name=name]','Nguyen An');await change('[name=phone]','abc12345678');
 await submit();assert.equal(document.querySelector('[name=phone]').getAttribute('aria-invalid'),'true');assert.equal(document.querySelector('.education-success'),null);
 await change('[name=phone]','0912345678');
 const input=document.querySelector('[name=document]');assert.equal(input.required,false);
 Object.defineProperty(input,'files',{configurable:true,value:[new window.File([new Uint8Array(5_000_001)],'large.pdf',{type:'application/pdf'})]});await submit();assert.equal(input.getAttribute('aria-invalid'),'true');assert.ok(document.querySelector('#education-document-error[role=alert]'));assert.equal(document.querySelector('[name=name]').value,'Nguyen An');
 Object.defineProperty(input,'files',{configurable:true,value:[]});await submit();assert.match(document.querySelector('.education-success').textContent,/F06/);
 await act(async()=>root.unmount());dom.window.close();console.log('PASS Education rejects invalid phone/oversize file; optional file demo completes');
} finally {await rm(bundle,{force:true});}
