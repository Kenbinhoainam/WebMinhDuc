import { build } from 'esbuild';
import { JSDOM } from 'jsdom';
import { pathToFileURL } from 'node:url';
import { rm } from 'node:fs/promises';
import assert from 'node:assert/strict';

const bundle = '/tmp/minhduc-jobs-sprint1-test.mjs';
await build({stdin:{contents:`export {loadLocale} from './src/i18n-runtime/catalog'; export { JobsPage, CareersPage, SavedJobsPage, JobDetailPage, filterJobs } from './src/JobsPages.tsx';`,resolveDir:process.cwd(),sourcefile:'test-entry.tsx'},bundle:true,platform:'node',format:'esm',outfile:bundle,packages:'external',loader:{'.css':'empty'},logLevel:'silent'});
// Bundled modules must resolve React from this project.
const localBundle = `${process.cwd()}/.jobs-sprint1-test.mjs`;
await (await import('node:fs/promises')).copyFile(bundle, localBundle);
try {
 const dom = new JSDOM('<div id="root"></div>', {url:'http://localhost/',pretendToBeVisual:true});
 for (const key of ['window','document','navigator','HTMLElement','Element','Node','Event','MutationObserver','localStorage','location','requestAnimationFrame','cancelAnimationFrame','File','FormData']) Object.defineProperty(globalThis,key,{configurable:true,writable:true,value:dom.window[key]});
 window.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});window.scrollTo=()=>{};window.HTMLElement.prototype.scrollIntoView=()=>{};
 globalThis.IS_REACT_ACT_ENVIRONMENT=true;
 const React=await import('react');const {act}=React;const {createRoot}=await import('react-dom/client');const {MemoryRouter,Routes,Route}=await import('react-router-dom');
 const {JobsPage,CareersPage,SavedJobsPage,JobDetailPage,filterJobs,loadLocale}=await import(pathToFileURL(localBundle).href);
 await Promise.all(['vi','en','zh','ko','ja'].map(loadLocale));
 const root=createRoot(document.getElementById('root'));
 const render=async(path,component)=>act(async()=>root.render(React.createElement(MemoryRouter,{initialEntries:[path],key:path},React.createElement(Routes,null,React.createElement(Route,{path:component===JobDetailPage?'/jobs/:slug':'*',element:React.createElement(component)})))));
 const click=async(el)=>act(async()=>el.dispatchEvent(new window.MouseEvent('click',{bubbles:true})));
 const submit=async()=>act(async()=>document.querySelector('.application-form').dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true})));
 const change=async(selector,value)=>act(async()=>{const el=document.querySelector(selector);const setter=Object.getOwnPropertyDescriptor(el.tagName==='SELECT'?window.HTMLSelectElement.prototype:window.HTMLInputElement.prototype,'value').set;setter.call(el,value);el.dispatchEvent(new window.Event('change',{bubbles:true}));el.dispatchEvent(new window.Event('input',{bubbles:true}));});
 const combo=new URLSearchParams({industrialPark:'KCN Tân Hưng',employmentType:'Thời vụ',shift:'Đêm'});
 assert.deepEqual(filterJobs(combo).map(j=>j.id),['MD006']);
 assert.deepEqual(filterJobs(new URLSearchParams({q:'Seasonal packing worker'}),false,false,[],'en').map(j=>j.id),['MD006']);
 assert.deepEqual(filterJobs(new URLSearchParams({q:'단기 포장 직원'}),false,false,[],'ko').map(j=>j.id),['MD006']);
 assert.deepEqual(filterJobs(new URLSearchParams({q:'dong goi thoi vu'}),false,false,[],'ko').map(j=>j.id),['MD006']);
 assert.equal(filterJobs(new URLSearchParams()).some(j=>j.id==='MD005'),false);assert.deepEqual(filterJobs(new URLSearchParams({status:'closed'})).map(j=>j.id),['MD005']);
 assert.equal(filterJobs(new URLSearchParams({location:'unknown',shift:'unknown'})).length,filterJobs(new URLSearchParams()).length);
 assert.deepEqual(filterJobs(new URLSearchParams(),false,true,['MD005','MD007']).map(j=>j.id),['MD005','MD007']);
 await render('/jobs?'+combo,JobsPage);assert.equal(document.querySelectorAll('.job-card').length,1);assert.match(document.querySelector('.job-card').textContent,/đóng gói thời vụ/i);assert.equal(document.querySelector('#jobs-shift').value,'Đêm');
 await render('/jobs',JobsPage);assert.doesNotMatch(document.querySelector('.jobs-grid').textContent,/Chuyên viên tuyển dụng/);
 await render('/careers',CareersPage);assert.match(document.querySelector('.jobs-grid').textContent,/Chuyên viên tuyển dụng/);assert.doesNotMatch(document.querySelector('.jobs-grid').textContent,/đóng gói thời vụ/i);
 localStorage.setItem('minhduc.saved-jobs.v1',JSON.stringify(['MD006','MD007']));await render('/saved-jobs',SavedJobsPage);assert.equal(document.querySelectorAll('.job-card').length,2);
 await render('/jobs/ky-thuat-bao-tri-bac-ninh',JobDetailPage);assert.match(document.body.textContent,/Vị trí đã đóng/);assert.equal(document.querySelector('.job-apply-button'),null);assert.ok(document.querySelector('.job-description-block'));
 await render('/jobs/chuyen-vien-tuyen-dung-bac-ninh',JobDetailPage);await click(document.querySelector('.job-apply-button'));assert.match(document.querySelector('.application-job').textContent,/MD007/);assert.equal(document.querySelector('[name=position]').required,true);assert.equal(document.querySelector('[name=cv]').required,false);
 await change('[name=name]','Nguyen An');await change('[name=phone]','0912345678');await submit();assert.match(document.querySelector('.application-success').textContent,/MD007/);assert.match(document.querySelector('.application-success a[href^="/admin-demo"]').getAttribute('href'),/^\/admin-demo\?type=F04&id=DEMO-/);
 await render('/jobs/dong-goi-thoi-vu-bac-giang',JobDetailPage);await click(document.querySelector('.job-apply-button'));assert.equal(document.querySelector('[name=cv]'),null);await change('[name=name]','Nguyen An');await change('[name=phone]','0912345678');await submit();assert.match(document.querySelector('.application-success').textContent,/MD006/);assert.match(document.querySelector('.application-success a[href^="/admin-demo"]').getAttribute('href'),/^\/admin-demo\?type=F03&id=DEMO-/);
 await act(async()=>root.unmount());dom.window.close();console.log('PASS Sprint 1 filters, audiences, closed vacancy and application flows');
} finally {await rm(localBundle,{force:true});await rm(bundle,{force:true});}
