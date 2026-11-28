// Local-only interaction probes for s2-common-audit.mjs. No service is contacted.
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {pathToFileURL} from 'node:url';
const folder=mkdtempSync(resolve('.common-audit-ui-'));
try {
 const out=join(folder,'probe.mjs');
 await build({stdin:{contents:"export {AdminDemo} from './src/AdminDemo';export {SavedJobsPage,JobDetailPage,jobs} from './src/JobsPages';",resolveDir:process.cwd(),sourcefile:'common.tsx'},bundle:true,platform:'node',format:'esm',packages:'external',outfile:out,loader:{'.css':'empty'},logLevel:'silent'});
 const w=new JSDOM('<div id="root"></div>',{url:'https://example.test/',pretendToBeVisual:true}).window;
 for(const name of ['window','document','HTMLElement','Element','navigator','Node','localStorage','Event','MutationObserver','requestAnimationFrame','cancelAnimationFrame','FormData','location']) Object.defineProperty(globalThis,name,{value:w[name],configurable:true});
 w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});w.HTMLElement.prototype.scrollIntoView=()=>{};globalThis.IS_REACT_ACT_ENVIRONMENT=true;
 const {createElement:h,act}=await import('react'),{createRoot}=await import('react-dom/client'),{MemoryRouter,Routes,Route}=await import('react-router-dom');
 const {AdminDemo,SavedJobsPage,JobDetailPage,jobs}=await import(pathToFileURL(out).href);
 const root=createRoot(document.querySelector('#root'));let visit=0;
 const render=(path,component,pattern='*')=>act(()=>root.render(h(MemoryRouter,{key:++visit,initialEntries:[path]},h(Routes,null,h(Route,{path:pattern,element:h(component)})))));
 const click=b=>act(()=>b.click()),one=sel=>document.querySelector(sel),all=sel=>[...document.querySelectorAll(sel)],expectText=(s,t)=>all(s).find(el=>el.textContent.trim()===t);
 const input=(el,value)=>act(()=>{Object.getOwnPropertyDescriptor(el.tagName==='TEXTAREA'?w.HTMLTextAreaElement.prototype:w.HTMLInputElement.prototype,'value').set.call(el,value);el.dispatchEvent(new w.Event('input',{bubbles:true}));});
 const facts={};
 await render('/admin-demo',AdminDemo);
 await click(all('.admin-side button').find(b=>b.textContent.includes('Nội dung website')));
 const editor=one('.admin-cms textarea'),status=()=>one('.admin-cms [role=status]').textContent;
 await input(editor,'Fixture alpha');await click(expectText('.admin-cms button','Lưu bản nháp'));
 assert.ok(one('.admin-cms').textContent.includes('Nội dung đã lưu: Fixture alpha'));
 const afterSave=status();await input(editor,'Fixture beta');const afterEdit=status();
 await click(expectText('.admin-cms button','Xuất bản thử'));const afterPublish=status();
 assert.ok(afterPublish!==afterSave);assert.ok(one('.admin-cms').textContent.includes('Nội dung đã lưu: Fixture beta'));
 facts.cms={afterSave,afterEdit,afterPublish,inputs:all('.admin-cms textarea,.admin-cms input').length,actions:all('.admin-cms button').map(b=>b.textContent)};
 localStorage.setItem('minhduc.saved-jobs.v1',JSON.stringify(jobs.map(j=>j.id)));
 await render('/saved-jobs',SavedJobsPage);
 const controls=()=>all('.jobs-pagination button');
 assert.equal(controls()[0].disabled,true);assert.equal(controls().at(-1).disabled,false);assert.equal(all('.job-card').length,6);
 await click(controls().at(-1));assert.equal(controls().at(-1).disabled,true);assert.equal(all('.job-card').length,2);
 await click(controls().at(-1));assert.equal(all('.job-card').length,2);
 await input(one('#jobs-query'),'MD001');assert.equal(all('.job-card').length,1);assert.equal(controls().length,0);
 facts.paging='Eight saved IDs: first page six rows, Previous disabled; second two rows, Next disabled; repeated disabled click inert. Filtering from last page produced one MD001, no pagination.';
 const ranked={};
 for(const job of jobs){
   await render('/jobs/'+job.slug,JobDetailPage,'/jobs/:slug');
   const actual=all('.jobs-related [data-job-link]').map(el=>el.dataset.jobLink);
   const own=jobs.filter(j=>j.id!==job.id&&!!j.internal===!!job.internal);
   const expected=[...own].sort((x,y)=>Number(y.status==='active')-Number(x.status==='active')||Number(y.location===job.location)-Number(x.location===job.location)).slice(0,3).map(j=>j.id);
   assert.deepEqual(actual,expected);ranked[job.id]=actual;
 }
 facts.related=ranked;
 await act(()=>root.unmount());w.close();
 console.log(JSON.stringify(facts));
} finally {rmSync(folder,{recursive:true,force:true});}
