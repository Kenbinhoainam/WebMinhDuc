// Exercises the real App router, page CTAs and in-memory submission registry.
import assert from 'node:assert/strict';
import {mkdtempSync, rmSync, writeFileSync} from 'node:fs';
import {resolve, join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';

const directory = mkdtempSync(resolve('.residual-journeys-'));
const cases = [];
try {
  const out = join(directory,'app.mjs');
  await build({stdin:{contents:"export {default as App} from './src/App'; export {LocaleProvider} from './src/i18n';export {loadLocale} from './src/i18n-runtime/catalog'; export {services} from './src/pages/info/data';export {educationPrograms} from './src/Education';export {getDemoSubmissions} from './src/demo-submissions';",resolveDir:process.cwd(),sourcefile:'journeys.tsx'},bundle:true,outfile:out,format:'esm',platform:'node',packages:'external',loader:{'.css':'empty'}});
  const w = new JSDOM('<div id="root"></div>',{url:'https://fixture.test/',pretendToBeVisual:true}).window;
  for(const key of ['window','document','navigator','HTMLElement','Element','Node','Event','FormData','localStorage','location','MutationObserver','requestAnimationFrame','cancelAnimationFrame']) Object.defineProperty(globalThis,key,{value:w[key],configurable:true});
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  w.matchMedia = query=>({matches:query.includes('prefers-reduced-motion'),addEventListener(){},removeEventListener(){},addListener(){},removeListener(){}});
  w.HTMLElement.prototype.scrollIntoView=()=>{};w.scrollTo=()=>{};
  w.HTMLMediaElement.prototype.pause=()=>{};w.HTMLMediaElement.prototype.play=async()=>{};
  const {createElement:h,act}=await import('react'), {createRoot}=await import('react-dom/client');
  const {MemoryRouter,useLocation,useNavigate}=await import('react-router-dom');
  const {App,LocaleProvider,loadLocale,services,educationPrograms,getDemoSubmissions}=await import(pathToFileURL(out));
  const root=createRoot(document.querySelector('#root'));
  let visit=0,location,navigate,basename='';
  function Probe(){location=useLocation();navigate=useNavigate();return null;}
  const one=selector=>document.querySelector(selector);
  const all=selector=>[...document.querySelectorAll(selector)];
  async function open(path,locale='vi') {
    await loadLocale(locale);
    basename=locale==='vi'?'':'/'+locale;
    await act(async()=>{root.render(h(LocaleProvider,{value:locale},h(MemoryRouter,{basename:basename||'/',initialEntries:[basename+path],key:++visit},h(Probe),h(App))));});
    await waitFor('main h1');
  }
  async function waitFor(selector) {
    for(let i=0;i<55 && !one(selector);i++) await act(async()=>{await new Promise(r=>setTimeout(r,12));});
    assert.ok(one(selector),'missing '+selector+' at '+location.pathname);
  }
  async function click(el){assert.ok(el,'missing click target at '+location.pathname);await act(async()=>{el.focus();el.click();});}
  async function run(ids,scope,fn){
    try{const actual=await fn();cases.push({ids,scope,actual,status:'Pass'});console.log('PASS '+scope);}
    catch(e){cases.push({ids,scope,actual:String(e.message).slice(0,600),status:'Fail'});console.error('FAIL '+scope+' '+e.stack);}
  }
  async function post(form,mode,source,slug){
    const required=[...form.querySelectorAll('[required]')].map(i=>i.name).sort();
    assert.deepEqual(required,(mode==='F01'?['location','name','notes','phone']:['name','phone']));
    for(const [key,value] of Object.entries({name:'Example Fixture',phone:'0912345678',location:'Demo site',notes:'Synthetic request'})) if(form.elements[key]) form.elements[key].value=value;
    const before=getDemoSubmissions().length;
    await act(()=>form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
    const record=getDemoSubmissions().at(-1);
    assert.equal(getDemoSubmissions().length,before+1);
    assert.equal(record.type,mode);assert.equal(record.source,source);
    if(slug){assert.equal(record.linkId,slug);assert.equal(record.fields.program,slug);}
    const receipt=one('.form-success,.education-success');
    assert.ok(receipt.textContent.includes(record.id));
    assert.match(receipt.textContent,/không gửi ra ngoài/);
    const to=receipt.querySelector('a');
    assert.equal(to.getAttribute('href'),basename+'/admin-demo?type='+mode+'&id='+record.id);
    await click(to);await waitFor('.admin-detail');
    assert.equal(location.pathname,'/admin-demo');assert.equal(new URLSearchParams(location.search).get('id'),record.id);
    assert.ok(one('.admin-detail').textContent.includes('Example Fixture'));
    return record;
  }
  for(const service of services.filter(s=>s.slug!=='college-admissions')) await run(['CS-C01-3'],'service → F01 → Admin '+service.slug,async()=>{
    const path='/services/'+service.slug;await open(path);
    await click(one('.service-overview-actions button'));
    const form=one('[role="dialog"] form.contact-form');
    assert.equal(form.elements.service.value,service.title);
    assert.ok(document.getElementById(form.getAttribute('aria-describedby')).textContent.includes('*'));
    const record=await post(form,'F01',path);assert.equal(record.fields.service,service.title);
    return 'Matched service, four required fields, synthetic receipt and detail '+record.id;
  });
  for(const program of educationPrograms)for(const mode of ['F05','F06'])await run(['CS-C01-4',mode==='F05'?'T13':'T14'],'program CTA → '+mode+' → Admin '+program.slug,async()=>{
    const path='/education/'+program.slug;await open(path);
    const link=all('main a').find(el=>el.getAttribute('href')?.includes('form='+mode+'#dang-ky'));
    await click(link);assert.equal(location.search,'?form='+mode);assert.equal(location.hash,'#dang-ky');
    const form=one('.education-form-card form');assert.equal(form.elements.program.value,program.slug);
    assert.equal(!!form.elements.document,mode==='F06');assert.equal(!!form.elements.email,mode==='F06');
    if(mode==='F06'){assert.equal(form.elements.document.required,false);assert.equal(form.elements.email.required,false);}
    const record=await post(form,mode,path,program.slug);
    return 'Selected program and form, optional field omission, receipt and admin detail '+record.id;
  });
  for(const mode of ['F05','F06']) await run([mode==='F05'?'T13':'T14'],'education index direct query '+mode,async()=>{
    await open('/education?form='+mode+'#dang-ky');
    const form=one('#dang-ky form');assert.equal(form.elements.program.value,'');
    assert.equal(!!form.elements.document,mode==='F06');
    const record=await post(form,mode,'/education');
    assert.equal(record.fields.program,'');return 'Index entry with no program or attachment creates '+record.id;
  });
  await run(['T10'],'explicit F02 query selects general contact',async()=>{
    await open('/contact?form=F02#consultation');
    assert.ok(one('#consultation [name=message]'));assert.ok(!one('#consultation [name=notes]'));
    return 'F02 explicitly selected with generic message field present.';
  });
  for(const mode of ['F01','F02']) await run([mode==='F01'?'T09':'T10'],'contact deep link '+mode,async()=>{
    await open(mode==='F01'?'/contact?form=F01#consultation':'/contact');
    const form=one('form.contact-form');assert.equal(!!form.elements.notes,mode==='F01');
    const record=await post(form,mode,'/contact');
    return 'Default or query entry, required fields only, receipt and admin detail '+record.id;
  });
  for(const [prefix,returnPath] of [['/unknown','/'],['/jobs/unknown','/jobs#job-listings'],['/services/unknown','/services'],['/news/unknown','/news'],['/events/unknown','/events'],['/education/unknown','/education']])await run(['T25'],'invalid runtime route '+prefix,async()=>{
    await open(prefix,'en');const title=one('main h1').textContent.trim();
    const recovery=all('main a').find(a=>a.getAttribute('href')===(returnPath==='/'?basename:basename+returnPath));
    assert.ok(recovery,title+' expected recovery '+returnPath);
    await click(recovery);assert.equal(location.pathname,returnPath.split('#')[0]);
    return title+' → '+recovery.getAttribute('href')+' (HTTP status outside DOM scope)';
  });
  await run(['T27'],'partners alias equivalent main content',async()=>{
    await open('/partners','en');const snapshot=one('main').textContent;
    await open('/testimonials','en');assert.equal(one('main').textContent,snapshot);
    return 'The /en/testimonials and /en/partners main text is identical.';
  });
  await run(['T28'],'legacy jobs query/hash redirect and history',async()=>{
    await open('/contact','en');await act(()=>navigate('/job-seekers?q=candidate#job-listings'));
    await waitFor('#job-listings');assert.equal(location.pathname,'/jobs');assert.equal(location.search,'?q=candidate');assert.equal(location.hash,'#job-listings');
    await act(()=>navigate(-1));assert.equal(location.pathname,'/contact');
    await act(()=>navigate(1));assert.equal(location.pathname,'/jobs');assert.equal(location.hash,'#job-listings');
    return 'Localized alias replaces history; query, fragment and canonical Back/Forward preserved.';
  });
  await run(['T29'],'Vietnamese root alias',async()=>{await open('/vi');assert.equal(location.pathname,'/');assert.ok(one('main h1'));return '/vi replaced by home and home H1 rendered.';});
  for(const [path,keyword,initial,after,final,total] of [
    ['/jobs','lap rap',['MD001'],['MD001'],['MD001','MD002','MD003','MD004','MD006'],5],
    ['/careers','Chuyên viên',['MD007'],['MD007'],['MD007','MD008'],2],
    ['/saved-jobs','lap rap',['MD001'],['MD001'],['MD001','MD002'],2],
  ])await run(['CS-C04-2'],'filter chips, result IDs/count and focus '+path,async()=>{
    if(path==='/saved-jobs')w.localStorage.setItem('minhduc.saved-jobs.v1',JSON.stringify(['MD001','MD002']));
    const query=new URLSearchParams({q:keyword,location:'Bắc Ninh'});
    await open(path+'?'+query);
    const idList=()=>all('.jobs-grid [data-job-link]').map(a=>a.dataset.jobLink);
    const count=()=>Number(one('.jobs-result-bar strong').textContent);
    const chips=()=>all('.jobs-filter-chip');
    assert.deepEqual(idList(),initial);assert.equal(count(),initial.length);
    assert.equal(chips().length,2);
    for(const chip of chips())assert.ok(chip.getAttribute('aria-label').includes(chip.textContent.split(' · ')[1]));
    const next=chips()[1];await click(chips()[0]);
    assert.equal(document.activeElement,next);assert.equal(chips().length,1);
    assert.deepEqual([...new URLSearchParams(location.search)], [['location','Bắc Ninh']]);
    assert.deepEqual(idList(),after);assert.equal(count(),after.length);
    await click(chips()[0]);assert.equal(document.activeElement,one('#jobs-query'));assert.equal(chips().length,0);
    assert.deepEqual(idList(),final);assert.equal(count(),total);assert.equal(location.search,'');
    if(path==='/saved-jobs')w.localStorage.clear();
    return 'Named chip removal preserved other conditions. Result IDs '+initial+' → '+after+' → '+final+'; focus moved to next chip, then the first filter.';
  });
  await run(['CS-C07-3'],'storage unavailable → session saves → storage restored',async()=>{
    await open('/jobs');const proto=Object.getPrototypeOf(w.localStorage),save=proto.setItem;
    const first=one('[data-job-save]'),id=first.dataset.jobSave;
    try{
      proto.setItem=()=>{throw new Error('synthetic quota');};
      await click(first);assert.equal(first.getAttribute('aria-pressed'),'true');
      await act(()=>navigate('/saved-jobs'));await waitFor('.jobs-storage-note');
      assert.match(one('.jobs-storage-note').textContent,/lưu tạm/);
      await click(one('[data-job-save="'+id+'"]'));assert.ok(!one('[data-job-save="'+id+'"]'));
      await act(()=>navigate('/jobs'));await waitFor('[data-job-save]');await click(one('[data-job-save="'+id+'"]'));
      proto.setItem=save;await click(one('[data-job-save="'+id+'"]'));
      assert.deepEqual(JSON.parse(w.localStorage.getItem('minhduc.saved-jobs.v1')),[]);
      await act(()=>navigate('/saved-jobs'));await waitFor('.jobs-storage-note');
      assert.doesNotMatch(one('.jobs-storage-note').textContent,/lưu tạm/);
      return 'Fallback adds and removes real IDs across routes; durable write restores the normal notice.';
    }finally{proto.setItem=save;}
  });
  await act(()=>root.unmount());w.close();
} finally {rmSync(directory,{recursive:true,force:true});}
if(process.argv[2]) writeFileSync(process.argv[2],JSON.stringify(cases,null,2)+'\n');
if(cases.some(c=>c.status==='Fail'))process.exitCode=1;
