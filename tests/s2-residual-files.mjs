import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {mkdtempSync,rmSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

const temp=mkdtempSync(resolve('.residual-files-'));
try {
 const bundle=join(temp,'screens.mjs');
 await build({stdin:{contents:"export {JobDetailPage} from './src/JobsPages';export {EducationPage} from './src/Education';export {getDemoSubmissions} from './src/demo-submissions';export {LocaleProvider} from './src/i18n';export {loadLocale,translate} from './src/i18n-runtime/catalog';",resolveDir:process.cwd(),sourcefile:'screens.tsx'},bundle:true,platform:'node',format:'esm',packages:'external',outfile:bundle,loader:{'.css':'empty'}});
 const w=new JSDOM('<div id="root"></div>',{url:'https://fixture.test/',pretendToBeVisual:true}).window;
 for(const name of ['window','document','HTMLElement','Element','navigator','Node','localStorage','Event','MutationObserver','requestAnimationFrame','cancelAnimationFrame','FormData','location'])Object.defineProperty(globalThis,name,{value:w[name],configurable:true});
 globalThis.IS_REACT_ACT_ENVIRONMENT=true;
 w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});w.HTMLElement.prototype.scrollIntoView=()=>{};
 let requests=0;
 const rejectNetwork=()=>{requests++;throw Error('Unexpected outbound request in mock form');};globalThis.fetch=rejectNetwork;w.fetch=rejectNetwork;w.XMLHttpRequest.prototype.send=rejectNetwork;
 let reads=0;
 const rejectRead=()=>{reads++;throw Error('Unexpected file-content access');};
 for(const key of ['readAsArrayBuffer','readAsText','readAsDataURL','readAsBinaryString']) w.FileReader.prototype[key]=rejectRead;
 globalThis.FileReader=w.FileReader;
 for(const key of ['arrayBuffer','text','stream'])w.File.prototype[key]=rejectRead;
 w.navigator.sendBeacon=rejectNetwork;
 const {createElement:h,act}=await import('react'),{createRoot}=await import('react-dom/client'),{MemoryRouter,Routes,Route}=await import('react-router-dom');
 const {JobDetailPage,EducationPage,getDemoSubmissions,LocaleProvider,loadLocale,translate}=await import(pathToFileURL(bundle).href);
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
   const replacement={vi:'Lần chọn mới sẽ thay toàn bộ danh sách tệp.',en:'Choosing new files replaces the entire list.',zh:'重新选择文件将替换整个文件列表。',ko:'파일을 다시 선택하면 기존 목록 전체가 교체됩니다.',ja:'ファイルを選び直すと、一覧全体が置き換わります。'}[locale];
   const removed={vi:'Đã xóa tệp',en:'File removed',zh:'已移除文件',ko:'삭제한 파일',ja:'削除したファイル'}[locale];
   const unknown={vi:'Không rõ',en:'Unknown',zh:'未知',ko:'알 수 없음',ja:'不明'}[locale];
   const status=form.querySelector('.attachment-field [role=status]');assert.ok(status);assert.equal(status.textContent,'');
   await select(input,[fixture('without-extension',20,''),fixture('signature',1,'image/png')]);
   assert.ok(listing()[0].querySelector('.attachment-size').textContent.includes(unknown));
   assert.ok(listing()[1].querySelector('.attachment-size').textContent.includes('image/png'));
   await click(listing()[1].querySelector('button'));await click(listing()[0].querySelector('button'));
   const count=n=>assert.match(form.querySelector('.attachment-count').textContent,new RegExp(n+' / 3$'));
   count(0);await select(input,names.slice(0,2).map((n,i)=>fixture(n,13+i)));count(2);
   assert.ok(input.getAttribute('aria-describedby').split(' ').some(id=>document.getElementById(id)?.textContent===replacement));
   assert.equal(status.textContent,'');
   assert.deepEqual(listing().map(li=>li.querySelector('.attachment-name').textContent),names.slice(0,2));
   await select(input,names.map((n,i)=>fixture(n,13+i)));
   count(3);assert.equal(listing().length,3,'each file has a separate visible metadata row');
   for(const [i,li] of listing().entries()){
     assert.ok(li.textContent.includes(names[i]));assert.ok(li.querySelector('.attachment-size').textContent.includes('PDF'));assert.ok(li.textContent.includes(String(13+i)),'row shows selected file size');
     assert.ok(li.querySelector('button')?.getAttribute('aria-label')?.includes(names[i]),'individual remove control names its file');
   }
   await act(()=>input.dispatchEvent(new Event('cancel',{bubbles:true})));await select(input,[]);
   assert.equal(listing().length,3,'cancelling picker preserves metadata and draft');
   await click(listing()[1].querySelector('button'));
   assert.equal(listing().length,2);assert.ok(listing()[1].textContent.includes('c.pdf'));
   count(2);assert.equal(status.textContent,removed+' · '+names[1]);assert.equal(form.querySelector('.attachment-field [role=status]'),status);assert.equal(document.activeElement,listing()[1].querySelector('button'));
   await select(input,[fixture('new.pdf',22)]);count(1);assert.equal(listing().length,1);assert.ok(listing()[0].textContent.includes('new.pdf'));
   const invalid=async(files,message)=>{
     await select(input,files);
     assert.equal(input.getAttribute('aria-invalid'),'true','invalid metadata reported when chosen, before submit');
     await submit(form);
     assert.equal(input.getAttribute('aria-invalid'),'true');
     const ids=input.getAttribute('aria-describedby').split(' ');
     assert.ok(ids.some(id=>document.getElementById(id)?.textContent===translate(message,locale)),'localized file-specific error');
   };
   await invalid(Array.from({length:4},(_,i)=>fixture(i+'.pdf',2)),'Tối đa 3 tệp cho mỗi lần gửi.');
   await invalid([fixture('big.pdf',5000001)],'Mỗi tệp tối đa 5 MB (5.000.000 byte).');
   await invalid([fixture('wrong.exe',1,'application/octet-stream')],'Chỉ chấp nhận JPG, JPEG, PNG, PDF, DOC hoặc DOCX.');
   const bad=listing()[0].querySelector('button');await click(bad);assert.equal(listing().length,0);count(0);assert.equal(status.textContent,removed+' · wrong.exe');assert.equal(document.activeElement,input);assert.equal(input.getAttribute('aria-invalid'),'false');
   for(const [key,v] of [['name','Fixture Name'],['phone','0912345678'],['email','demo@example.test']])assert.equal(form.elements[key].value,v);
   const before=getDemoSubmissions().length;await select(input,[fixture('accepted.pdf',5000000)]);await submit(form);
   const records=getDemoSubmissions();assert.equal(records.length,before+1);assert.equal(records.at(-1).type,flow);
   assert.ok(!JSON.stringify(records.at(-1)).includes('accepted.pdf'),'no file data persisted');assert.equal(requests,0);assert.equal(reads,0);
   console.log('PASS '+flow+' '+locale+' names/size, cancel, replace, remove, focus, draft, validation and zero network');
  }catch(e){failures.push(flow+' '+locale+' '+e.message);console.error('FAIL '+failures.at(-1));}
 }
 await act(()=>root.unmount());w.close();
 if(failures.length)process.exitCode=1;
}finally{rmSync(temp,{recursive:true,force:true});}
