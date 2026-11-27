import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {mkdtempSync,rmSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

const temp=mkdtempSync(resolve('.residual-files-'));
try {
 const bundle=join(temp,'screens.mjs');
 await build({stdin:{contents:"export {JobDetailPage} from './src/JobsPages';export {EducationPage} from './src/Education';export {getDemoSubmissions} from './src/demo-submissions';export {LocaleProvider} from './src/i18n';export {loadLocale} from './src/i18n-runtime/catalog';",resolveDir:process.cwd(),sourcefile:'screens.tsx'},bundle:true,platform:'node',format:'esm',packages:'external',outfile:bundle,loader:{'.css':'empty'}});
 const w=new JSDOM('<div id="root"></div>',{url:'https://fixture.test/',pretendToBeVisual:true}).window;
 for(const name of ['window','document','HTMLElement','Element','navigator','Node','localStorage','Event','MutationObserver','requestAnimationFrame','cancelAnimationFrame','FormData','location'])Object.defineProperty(globalThis,name,{value:w[name],configurable:true});
 globalThis.IS_REACT_ACT_ENVIRONMENT=true;
 w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});w.HTMLElement.prototype.scrollIntoView=()=>{};
 let requests=0;
 const rejectNetwork=()=>{requests++;throw Error('Unexpected outbound request in mock form');};globalThis.fetch=rejectNetwork;w.fetch=rejectNetwork;w.XMLHttpRequest.prototype.send=rejectNetwork;
 const {createElement:h,act}=await import('react'),{createRoot}=await import('react-dom/client'),{MemoryRouter,Routes,Route}=await import('react-router-dom');
 const {JobDetailPage,EducationPage,getDemoSubmissions,LocaleProvider,loadLocale}=await import(pathToFileURL(bundle).href);
 const root=createRoot(document.querySelector('#root'));
 const get=s=>document.querySelector(s),click=el=>act(()=>el.click());
 const enter=(el,v)=>act(()=>{Object.getOwnPropertyDescriptor(w.HTMLInputElement.prototype,'value').set.call(el,v);el.dispatchEvent(new w.Event('input',{bubbles:true}));});
 const submit=form=>act(()=>form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
 const select=async (input,files)=>{Object.defineProperty(input,'files',{configurable:true,value:files});await act(()=>input.dispatchEvent(new Event('change',{bubbles:true})));};
 const fixture=(name,size,type='application/pdf')=>{const f=new w.File(['x'],name,{type});Object.defineProperty(f,'size',{value:size});return f;};
 const failures=[];
 for(const locale of ['vi','en','zh','ko','ja'])for(const flow of ['F04','F06']){
  const path=flow==='F04'?'/jobs/chuyen-vien-tuyen-dung-bac-ninh':'/education?form=F06';
  await loadLocale(locale);
  await act(()=>root.render(h(LocaleProvider,{value:locale},h(MemoryRouter,{key:locale+flow,initialEntries:[path]},h(Routes,null,h(Route,{path:flow==='F04'?'/jobs/:slug':'/education',element:h(flow==='F04'?JobDetailPage:EducationPage)}))))));
  if(flow==='F04')await click(get('.job-apply-button'));
  const input=get('input[type=file]'),form=input.form,listing=()=>[...form.querySelectorAll('ul li')];
  try{
   await enter(form.elements.name,'Fixture Name');await enter(form.elements.phone,'0912345678');await enter(form.elements.email,'demo@example.test');
   const names=['a.pdf','b-long-file-name-for-the-middle-row.pdf','c.pdf'];
   await select(input,names.map((n,i)=>fixture(n,13+i)));
   assert.equal(listing().length,3,'each file has a separate visible metadata row');
   for(const [i,li] of listing().entries()){
     assert.ok(li.textContent.includes(names[i]));assert.ok(li.textContent.includes(String(13+i)),'row shows selected file size');
     assert.ok(li.querySelector('button')?.getAttribute('aria-label')?.includes(names[i]),'individual remove control names its file');
   }
   await act(()=>input.dispatchEvent(new Event('cancel',{bubbles:true})));await select(input,[]);
   assert.equal(listing().length,3,'cancelling picker preserves metadata and draft');
   await click(listing()[1].querySelector('button'));
   assert.equal(listing().length,2);assert.ok(listing()[1].textContent.includes('c.pdf'));
   await select(input,[fixture('new.pdf',22)]);assert.equal(listing().length,1);assert.ok(listing()[0].textContent.includes('new.pdf'));
   await select(input,[fixture('wrong.exe',6001000,'application/octet-stream')]);await submit(form);assert.equal(input.getAttribute('aria-invalid'),'true');
   const bad=listing()[0].querySelector('button');await click(bad);assert.equal(listing().length,0);assert.equal(document.activeElement,input);assert.equal(input.getAttribute('aria-invalid'),'false');
   for(const [key,v] of [['name','Fixture Name'],['phone','0912345678'],['email','demo@example.test']])assert.equal(form.elements[key].value,v);
   const before=getDemoSubmissions().length;await select(input,[fixture('accepted.pdf',5000000)]);await submit(form);
   const records=getDemoSubmissions();assert.equal(records.length,before+1);assert.equal(records.at(-1).type,flow);
   assert.ok(!JSON.stringify(records.at(-1)).includes('accepted.pdf'),'no file data persisted');assert.equal(requests,0);
   console.log('PASS '+flow+' '+locale+' names/size, cancel, replace, remove, focus, draft, validation and zero network');
  }catch(e){failures.push(flow+' '+locale+' '+e.message);console.error('FAIL '+failures.at(-1));}
 }
 await act(()=>root.unmount());w.close();
 if(failures.length)process.exitCode=1;
}finally{rmSync(temp,{recursive:true,force:true});}
