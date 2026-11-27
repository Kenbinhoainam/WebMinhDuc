import assert from 'node:assert/strict';
import {rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';

const out = '.s2-b2c-test.mjs';
try {
  await build({stdin:{contents:`
    export {JobsPage,JobDetailPage,CareersPage,SavedJobsPage,filterJobs,jobs} from './src/JobsPages';
    export {getDemoSubmissions} from './src/demo-submissions';
    export {loadLocale,translate} from './src/i18n-runtime/catalog';
    export {LocaleProvider} from './src/i18n';
  `,resolveDir:process.cwd(),sourcefile:'s2-b2c.tsx'},bundle:true,platform:'node',format:'esm',outfile:out,packages:'external',loader:{'.css':'empty'},logLevel:'silent'});
  const dom = new JSDOM('<div id="root"></div>',{url:'https://example.test/jobs',pretendToBeVisual:true});
  for (const key of ['window','document','navigator','HTMLElement','Element','Node','Event','MutationObserver','location','localStorage','requestAnimationFrame','cancelAnimationFrame','FormData']) {
    Object.defineProperty(globalThis,key,{configurable:true,value:dom.window[key]});
  }
  window.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
  window.HTMLElement.prototype.scrollIntoView=()=>{};
  globalThis.IS_REACT_ACT_ENVIRONMENT=true;
  const {createElement:h,act}=await import('react');
  const {createRoot}=await import('react-dom/client');
  const {MemoryRouter,Routes,Route,useLocation}=await import('react-router-dom');
  const {JobsPage,JobDetailPage,CareersPage,SavedJobsPage,filterJobs,jobs,getDemoSubmissions,LocaleProvider,loadLocale,translate}=await import(pathToFileURL(process.cwd()+'/'+out));
  const root=createRoot(document.getElementById('root'));
  let location,visit=0;
  function CurrentLocation(){location=useLocation();return null;}
  async function render(path,locale='vi'){
    await loadLocale(locale);
    await act(()=>root.render(h(LocaleProvider,{value:locale},h(MemoryRouter,{key:++visit,initialEntries:[path]},
      h(CurrentLocation),h(Routes,null,h(Route,{path:'/jobs',element:h(JobsPage)}),h(Route,{path:'/careers',element:h(CareersPage)}),h(Route,{path:'/saved-jobs',element:h(SavedJobsPage)}),h(Route,{path:'/jobs/:slug',element:h(JobDetailPage)}))))));
  }
  const q=selector=>document.querySelector(selector);
  const list=selector=>[...document.querySelectorAll(selector)];
  const click=async element=>act(()=>element.click());
  async function input(el,value){
    await act(()=>{
      Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set.call(el,value);
      el.dispatchEvent(new Event('input',{bubbles:true}));
    });
  }
  const submit=form=>form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
  const ids=()=>list('[data-job-link]').map(el=>el.dataset.jobLink);
  const stored=()=>JSON.parse(localStorage.getItem('minhduc.saved-jobs.v1')||'[]');

  for (const [value,expected] of [['Phổ thông',['MD001','MD002','MD003','MD006']],['Tay nghề',['MD004']]]) {
    await render('/jobs?'+new URLSearchParams({skillLevel:value})+'#job-listings');
    assert.deepEqual(ids(),expected);
  }
  for (const [term,expected] of [['MD001',['MD001']],['lap rap',['MD001']],['Sản xuất',['MD001','MD004','MD006']],['Bắc Giang',['MD002','MD006']],['kcn tan hung',['MD002','MD006']]]) {
    assert.deepEqual(filterJobs(new URLSearchParams({q:term})).map(job=>job.id),expected);
  }
  await render('/jobs#job-listings');
  assert.equal(ids().length,5);
  const search=q('#jobs-query');
  search.focus();
  const before=location.key;
  await act(()=>search.dispatchEvent(new window.CompositionEvent('compositionstart',{bubbles:true})));
  for (const draft of ['la','lap','lắp','lắp rá']) {
    await input(search,draft);
    assert.equal(location.key,before,'intermediate IME input does not write history');
    assert.equal(search.value,draft);
    assert.equal(ids().length,5,'no premature announcements or empty results');
  }
  await input(search,'lắp ráp');
  await act(()=>search.dispatchEvent(new window.KeyboardEvent('keydown',{key:'Enter',isComposing:true,bubbles:true})));
  await act(()=>search.dispatchEvent(new window.CompositionEvent('compositionend',{bubbles:true,data:'lắp ráp'})));
  await act(()=>submit(q('.jobs-filters')));
  assert.equal(document.activeElement,search,'IME confirmation retains the editing cursor');
  await act(()=>search.dispatchEvent(new window.KeyboardEvent('keyup',{key:'Enter',bubbles:true})));
  assert.equal(new URLSearchParams(location.search).get('q'),'lắp ráp');
  assert.equal(location.hash,'#job-listings');
  assert.deepEqual(ids(),['MD001']);
  await input(search,'lap rap');
  assert.deepEqual(ids(),['MD001']);
  const combination={location:'Bắc Ninh',industrialPark:'KCN Yên Phong',shift:'Ngày',q:'lap rap'};
  await render('/jobs?'+new URLSearchParams(combination)+'#job-listings');
  assert.deepEqual(ids(),['MD001']);
  assert.equal(q('.jobs-filter-main .jobs-quiet-button span').textContent,'(2)');
  const chips=list('.jobs-filter-chip');
  await click(chips[1]);
  assert.equal(document.activeElement,chips[2]);
  assert.equal(new URLSearchParams(location.search).get('q'),'lap rap');
  assert.equal(new URLSearchParams(location.search).has('location'),false);
  await click(q('.jobs-reset'));
  assert.equal(document.activeElement,q('#jobs-query'));
  assert.equal(location.hash,'#job-listings');
  assert.equal(ids().length,5);
  assert.deepEqual(filterJobs(new URLSearchParams({location:'???',status:'???',page:'200'})).map(job=>job.id),ids());
  for(const locale of ['vi','en','zh','ko','ja']) {
    localStorage.clear();
    await render('/jobs',locale);
    const buttons=list('.jobs-grid .job-save');
    const label=buttons[0].getAttribute('aria-label');
    assert.equal(label,translate('Lưu việc làm',locale)+' · '+translate(jobs[0].title,locale));
    await act(()=>{buttons[0].click();buttons[1].click();buttons[0].click();});
    assert.deepEqual(stored(),['MD002']);
    assert.equal(buttons[0].getAttribute('aria-label'),label);
    assert.equal(buttons[0].getAttribute('aria-pressed'),'false');
    assert.equal(buttons[1].getAttribute('aria-pressed'),'true');
    assert.equal(q('.jobs-saved-link span').textContent,'1');
    for (const job of jobs) {
      await render('/jobs/'+job.slug,locale);
      assert.equal(q('h1').textContent,translate(job.title,locale));
      assert.equal(q('.job-pay dd').textContent,translate(job.salary,locale));
      for(const [index,group] of [job.tasks,job.requirements,job.benefits].entries()) {
        const items=list('.job-description-block')[index].querySelectorAll('li');
        assert.deepEqual([...items].map(li=>li.textContent),group.map(value=>translate(value,locale)));
      }
    }
  }
  for(const job of jobs) {
    const path='/jobs/'+job.slug;
    localStorage.clear();
    const origin=(job.internal?'/careers':'/jobs')+'?q='+job.id+(job.status==='closed'?'&status=closed':'')+(job.internal?'#open-positions':'#job-listings');
    await render(origin);
    const title=q('[data-job-link="'+job.id+'"]');
    assert.equal(title.getAttribute('href'),path);
    await click(q('[data-job-save="'+job.id+'"]'));
    assert.deepEqual(stored(),[job.id]);
    await click(title);
    assert.equal(location.pathname,path);
    assert.equal(q('.job-summary .job-save').getAttribute('aria-pressed'),'true');
    await click(q('.jobs-related [data-job-link]'));
    await click(q('.jobs-back'));
    assert.equal(location.pathname+location.search+location.hash,origin);
    await act(()=>new Promise(resolve=>requestAnimationFrame(resolve)));
    assert.equal(document.activeElement.dataset.jobLink,job.id);
    await click(q('[data-job-link="'+job.id+'"]'));
    const previous=getDemoSubmissions().length;
    const opener=q('.job-apply-button');
    if(job.status==='closed') {
      assert.equal(job.id,'MD005');
      assert.equal(opener,null);
      assert.equal(q('.job-mobile-apply'),null);
      assert.ok(q('.job-summary-actions a[href^="/jobs?status=active"]'));
      assert.equal(getDemoSubmissions().length,previous);
      continue;
    }
    opener.focus();
    await click(opener);
    const form=q('.application-form');
    assert.deepEqual([...form.elements].filter(el=>el.required).map(el=>el.name),
      job.internal?['name','phone','position']:['name','phone']);
    assert.equal(Boolean(form.elements.cv),!!job.internal);
    await act(()=>submit(form));
    await act(()=>new Promise(resolve=>requestAnimationFrame(resolve)));
    assert.equal(document.activeElement,form.elements.name);
    await input(form.elements.name,'Ứng viên mẫu');
    await input(form.elements.phone,'0912345678');
    if(job.internal) {
      const cv=form.elements.cv;
      Object.defineProperty(cv,'files',{configurable:true,value:[new window.File(['demo'],'demo.exe',{type:'application/octet-stream'})]});
      await act(()=>cv.dispatchEvent(new Event('change',{bubbles:true})));
      assert.equal(q('#apply-cv-error'),null,'selecting file metadata does not interrupt editing');
      await act(()=>submit(form));
      await act(()=>new Promise(resolve=>requestAnimationFrame(resolve)));
      assert.equal(document.activeElement,cv);
      assert.equal(cv.getAttribute('aria-invalid'),'true');
      assert.equal(getDemoSubmissions().length,previous);
      Object.defineProperty(cv,'files',{configurable:true,value:[]});
      await act(()=>cv.dispatchEvent(new Event('change',{bubbles:true})));
      assert.equal(q('#apply-cv-error'),null);
    }
    await act(()=>{submit(form);submit(form);});
    const records=getDemoSubmissions(), record=records.at(-1);
    assert.equal(records.length,previous+1,'one fixture for the whole attempt');
    assert.deepEqual([record.type,record.linkId,record.detail,record.source],[job.internal?'F04':'F03',job.id,job.title,path]);
    assert.equal(document.activeElement,q('.application-success h3'));
    assert.ok(q('.application-success').textContent.includes(record.type+' · '+job.id+' · '+job.title));
    assert.equal(q('.application-success a').getAttribute('href'),'/admin-demo?type='+record.type+'&id='+record.id);
    await click(q('.application-close-link'));
    assert.equal(document.activeElement,opener,'return to the original apply button');
  }
  localStorage.setItem('minhduc.saved-jobs.v1','["MD005","MD007"]');
  for(const locale of ['en','zh','ko','ja']) {
    await render('/saved-jobs',locale);
    const note=translate('Bạn vẫn có thể xem thông tin của vị trí đã đóng.',locale);
    assert.notEqual(note,'Bạn vẫn có thể xem thông tin của vị trí đã đóng.');
    assert.ok(q('.jobs-storage-note').textContent.includes(note));
  }
  await render('/saved-jobs');
  assert.equal(ids().length,2);
  assert.match(q('.jobs-storage-note').textContent,/vị trí đã đóng/);
  await input(q('#jobs-query'),'missing-job');
  assert.match(q('.jobs-empty h3').textContent,/Chưa tìm thấy/);
  await click(q('.jobs-empty button'));
  assert.equal(ids().length,2);
  for (const id of ['MD005','MD007']) await click(q('[data-job-save="'+id+'"]'));
  assert.match(q('.jobs-empty h3').textContent,/Bạn chưa lưu/);
  assert.equal(document.activeElement,q('.jobs-empty a'));
  await act(()=>root.unmount());
  dom.window.close();
  console.log('PASS W3 T06/T07/T11/T12; IME, combined filters, chips, five-language saves and eight job descriptions, closed MD005, seven form receipts and focus; DOM fixtures only.');
} finally { await rm(out,{force:true}); }
