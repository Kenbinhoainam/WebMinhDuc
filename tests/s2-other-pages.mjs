import assert from 'node:assert/strict';
import {mkdtemp, rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {build} from 'esbuild';
import React from 'react';
import {createRoot} from 'react-dom/client';
import {renderToStaticMarkup} from 'react-dom/server';
import {MemoryRouter, Route, Routes, StaticRouter, useLocation, useNavigate} from 'react-router-dom';
import {JSDOM} from 'jsdom';

const dir = await mkdtemp('.s2-other-');
const h = React.createElement;
try {
  const outfile = `${dir}/pages.mjs`;
  await build({
    stdin:{contents:`export * from './src/EditorialPages'; export {EducationPage, EducationDetailPage} from './src/Education';
    export {AdminDemo} from './src/AdminDemo'; export {AboutPage} from './src/pages/info/AboutPage';
    export {PartnersPage} from './src/pages/info/PartnersPage'; export {toCsv,sampleRecords} from './src/admin-demo-data';
    export {getDemoSubmissions,createDemoSubmission} from './src/demo-submissions'; export {LocaleProvider,localeBase} from './src/i18n';
    export {loadLocale} from './src/i18n-runtime/catalog';`,resolveDir:process.cwd(),sourcefile:'s2-other.tsx'},
    bundle:true, platform:'node', format:'esm', packages:'external', loader:{'.css':'empty'}, outfile, logLevel:'silent',
  });
  const pages = await import(pathToFileURL(`${process.cwd()}/${outfile}`).href);
  const staticDoc = (path, content, locale = 'vi') => {
    const base = pages.localeBase(locale);
    return new JSDOM(renderToStaticMarkup(h(pages.LocaleProvider,{value:locale},
      h(StaticRouter,{location:base + path,basename:base},content)))).window.document;
  };
  for (const [Page,path] of [[pages.NewsPage,'/news?category=workers'],[pages.EventsPage,'/events?status=past']]) {
    const empty = staticDoc(path,h(Page,{entries:[]}));
    assert.match(empty.querySelector('.ed-result').textContent,/^0/);
    assert.ok([...empty.querySelectorAll('button')].some(button => button.textContent === 'Xem tất cả'));
    empty.defaultView.close();
  }
  for (const locale of ['vi','en','zh','ko','ja']) {
    await pages.loadLocale(locale);
    for (const [kind,path] of [['terms','/terms-of-use'],['privacy','/privacy-policy']]) {
      const doc = staticDoc(path,h(pages.PolicyPage,{kind}),locale);
      assert.equal(doc.querySelectorAll('h1').length,1);
      assert.equal(doc.querySelectorAll('.info-policy-body > h2').length,6);
      assert.equal(doc.querySelector('nav a').getAttribute('href'),pages.localeBase(locale) || '/');
      assert.ok(doc.querySelector('a[href^=tel]') && doc.querySelector('a[href^=mailto]'));
      assert.equal(doc.querySelector('form'),null);
      doc.defaultView.close();
    }
  }

  const dom = new JSDOM('<div id="root"></div>',{url:'https://example.test',pretendToBeVisual:true});
  for (const key of ['window','document','navigator','HTMLElement','Element','Node','Event','MutationObserver','requestAnimationFrame','cancelAnimationFrame','File','FormData']) {
    Object.defineProperty(globalThis,key,{value:dom.window[key],configurable:true,writable:true});
  }
  const motion = {matches:false, addEventListener(){},removeEventListener(){}};
  window.matchMedia = () => motion;
  HTMLElement.prototype.scrollIntoView = () => {};
  HTMLElement.prototype.scrollTo = function({left = 0}) { this.scrollLeft = left; };
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const root = createRoot(document.getElementById('root'));
  const act = React.act;
  const click = el => act(() => el.click());
  const q = selector => document.querySelector(selector);
  const type = (selector,value) => act(() => {
    const field = q(selector);
    Object.getOwnPropertyDescriptor(Object.getPrototypeOf(field),'value').set.call(field,value);
    field.dispatchEvent(new Event('input',{bubbles:true}));
    field.dispatchEvent(new Event('change',{bubbles:true}));
  });
  let navigate, location;
  const routes = [
    ['/events',pages.EventsPage],['/events/:slug',pages.EventPage],['/about-us',pages.AboutPage],
    ['/partners',pages.PartnersPage],['/education',pages.EducationPage],['/education/:slug',pages.EducationDetailPage],
    ['/admin-demo',pages.AdminDemo],
  ];
  function Harness() {
    navigate = useNavigate(); location = useLocation();
    return h(Routes,null,routes.map(([path,Component])=>h(Route,{path,key:path,element:h(Component)})));
  }
  await act(() => root.render(h(MemoryRouter,{initialEntries:['/events?status=past']},h(Harness))));
  await click(q('.ed-event-line .ed-schedule-link'));
  assert.deepEqual([location.search,location.hash],['?status=past','#schedule']);
  assert.equal(q('#schedule').getAttribute('tabindex'),'-1');
  assert.ok([...document.querySelectorAll('.ed-agenda-entry time')].every(el => el.dateTime.endsWith('+07:00')));
  await click(q('#other-events + .ed-event-list .ed-event-line h3 a'));
  assert.equal(location.search,'?status=past');
  await click(q('.ed-all-events'));
  assert.deepEqual([location.search,location.hash],['?status=past','#event-listings']);
  assert.equal(q('#event-listings').getAttribute('tabindex'),'-1');

  await act(() => navigate('/about-us#history'));
  assert.equal(q('#history h2').getAttribute('tabindex'),'-1');
  const chapterToggle = q('.about-chapters button');
  await click(chapterToggle);
  assert.equal(chapterToggle.getAttribute('aria-expanded'),'true');
  await act(() => q('.about-chapters a').dispatchEvent(new window.KeyboardEvent('keydown',{key:'Escape',bubbles:true})));
  assert.equal(chapterToggle.getAttribute('aria-expanded'),'false');
  assert.equal(document.activeElement,chapterToggle);
  await act(() => q('#history-tab-0').dispatchEvent(new window.KeyboardEvent('keydown',{key:'End',bubbles:true,cancelable:true})));
  assert.equal(q('#history-tab-2').getAttribute('aria-selected'),'true');
  await click(q('#history-panel button'));
  assert.ok(q('[role=dialog]'));
  await act(() => document.dispatchEvent(new window.KeyboardEvent('keydown',{key:'Escape',bubbles:true})));
  assert.equal(q('[role=dialog]'),null);

  await act(() => navigate('/partners'));
  await click(q('.partners-actions a[href$="business-contact"]'));
  assert.equal(location.hash,'#business-contact');
  assert.equal(location.state.startForm,'F01');

  await act(() => navigate('/education/chinh-quy-cong-nghe?form=F05#dang-ky'));
  assert.equal(q('[name=program]').value,'chinh-quy-cong-nghe');
  await type('[name=name]','Nguoi Mau F05');
  await type('[name=program]','tu-xa-ke-toan');
  await click(q('.education-form-tabs button:last-child'));
  assert.equal(location.search,'?form=F06');
  assert.equal(q('[name=program]').value,'chinh-quy-cong-nghe');
  assert.equal(q('[name=name]').value,'');
  const file = q('[name=document]');
  Object.defineProperty(file,'files',{configurable:true,value:[new File(['sample'],'fixture.pdf',{type:'application/pdf'})]});
  await act(() => file.dispatchEvent(new Event('change',{bubbles:true})));
  Object.defineProperty(file,'files',{configurable:true,value:[]});
  await act(() => file.dispatchEvent(new Event('change',{bubbles:true})));
  assert.match(q('.education-files').textContent,/fixture\.pdf/);
  await act(() => navigate(-1));
  assert.equal(location.search,'?form=F05');
  assert.equal(q('[name=name]').value,'Nguoi Mau F05');
  assert.equal(q('[name=program]').value,'tu-xa-ke-toan');
  await act(() => navigate(1));
  assert.match(q('.education-files').textContent,/fixture\.pdf/);
  await click(q('.education-files button'));
  assert.equal(q('.education-files'),null);
  assert.equal(document.activeElement,q('[name=document]'));

  pages.createDemoSubmission({type:'F01',name:'Synthetic fixture',phone:'000-000-0000',source:'S2 test'});
  await act(() => navigate('/admin-demo?type=F03&id=MD-003'));
  assert.match(q('[role=dialog]').textContent,/MD-003/);
  await act(() => navigate('/admin-demo?type=F02&id=MD-002'));
  assert.match(q('[role=dialog]').textContent,/MD-002/);
  assert.doesNotMatch(q('[role=dialog]').textContent,/MD-003/);
  await act(() => document.dispatchEvent(new window.KeyboardEvent('keydown',{key:'Escape',bubbles:true})));
  assert.equal(location.search,'?type=F02');
  assert.equal(q('[role=dialog]'),null);
  assert.equal(q('.admin-table-wrap').getAttribute('tabindex'),'0');
  await type('.admin-filters input','MD-002');
  await type('.admin-filters label:nth-child(2) select','Website');
  await type('.admin-filters label:nth-child(3) select','Lan (mẫu)');
  await type('.admin-filters label:nth-child(4) select','Đang xử lý');
  assert.equal(document.querySelectorAll('.admin-table-wrap tbody tr').length,1);
  assert.match(q('.admin-table-wrap tbody').textContent,/MD-002/);
  const create = URL.createObjectURL, revoke = URL.revokeObjectURL;
  const anchorClick = window.HTMLAnchorElement.prototype.click;
  let csvPayload;
  URL.createObjectURL = blob => { csvPayload = blob; return 'blob:fixture'; };
  URL.revokeObjectURL = () => {};
  window.HTMLAnchorElement.prototype.click = () => {};
  try {
    await click(q('.admin-card-head button'));
    assert.match(await csvPayload.text(),/MD-002/);
    assert.doesNotMatch(await csvPayload.text(),/MD-001|MD-003/);
    await act(() => new Promise(resolve=>window.setTimeout(resolve,1)));
  } finally {
    URL.createObjectURL = create; URL.revokeObjectURL = revoke;
    window.HTMLAnchorElement.prototype.click = anchorClick;
  }
  const reset = [...document.querySelectorAll('.admin-card button')].find(button=>button.textContent==='Khôi phục mẫu');
  await click(reset);
  assert.equal(pages.getDemoSubmissions().length,1);
  await click(q('.admin-reset-actions .btn-secondary'));
  assert.equal(pages.getDemoSubmissions().length,1);
  await click(reset);
  await click(q('.admin-reset-actions .btn:last-child'));
  assert.equal(pages.getDemoSubmissions().length,0);
  assert.equal(location.search,'');
  const cmsMode = q('.admin-side button:nth-of-type(2)');
  const queueMode = q('.admin-side button:nth-of-type(1)');
  await act(() => { cmsMode.click(); queueMode.click(); cmsMode.click(); });
  assert.equal(cmsMode.getAttribute('aria-pressed'),'true');
  assert.equal(q('.admin-table-wrap'),null);
  await type('.admin-cms textarea','Thông điệp fixture');
  await click(q('.admin-cms button'));
  assert.match(q('.admin-cms [role=status]').textContent,/Đã lưu bản nháp mẫu/);
  await click(q('.admin-cms button:last-child'));
  assert.match(q('.admin-cms [role=status]').textContent,/Đã xuất bản mẫu/);
  await click(queueMode);
  assert.equal(q('.admin-cms'),null);
  const csv = pages.toCsv([{...pages.sampleRecords[0],name:'  =1+1',detail:'text, "quoted"\nnext'}]);
  assert.ok(csv.startsWith('\ufeff'));
  assert.match(csv,/"'  =1\+1"/);
  assert.match(csv,/"text, ""quoted""\nnext"/);
  await act(() => root.unmount());
  dom.window.close();
  console.log('PASS W4 empty lists, event return context, About keyboard, Partners F01, separate Education drafts/file metadata, Admin route/reset/CSV and policy routes in five locales');
} finally {
  await rm(dir,{recursive:true,force:true});
}
