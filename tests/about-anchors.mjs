import {build} from 'esbuild';
import {mkdir,rm,readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {MemoryRouter,useNavigate} from 'react-router-dom';

const temp='.about-anchors';await mkdir(temp,{recursive:true});
try {
 await build({stdin:{contents:"export {AboutPage} from './src/pages/info/AboutPage'; export {Header} from './src/Header'; export {PageTransition} from './src/App'; export {LocaleProvider,localeBase,languageSwitchUrl} from './src/i18n'; export {loadLocale} from './src/i18n-runtime/catalog';",resolveDir:process.cwd(),sourcefile:'about-anchors-test.tsx'},bundle:true,platform:'node',format:'esm',packages:'external',loader:{'.css':'empty'},outfile:`${temp}/bundle.mjs`,logLevel:'silent'});
 const {AboutPage,Header,PageTransition,LocaleProvider,localeBase,languageSwitchUrl,loadLocale}=await import(pathToFileURL(`${process.cwd()}/${temp}/bundle.mjs`).href);
 const ids=['profile','history','partners','activities','achievements','business-contact'];
 const menuIds=['history','partners','achievements'];let vietnameseLabels;
 for(const locale of ['vi','en','zh','ko','ja']){
  await loadLocale(locale);const base=localeBase(locale);
  const html=renderToStaticMarkup(React.createElement(LocaleProvider,{value:locale},React.createElement(MemoryRouter,{basename:base||'/',initialEntries:[`${base}/about-us#profile`]},React.createElement(React.Fragment,null,React.createElement(Header),React.createElement(AboutPage)))));
  const dom=new JSDOM(html,{url:'https://example.test/'}),doc=dom.window.document;
  for(const id of ids){
   const nodes=doc.querySelectorAll(`[id="${id}"]`);assert.equal(nodes.length,1,`${locale}: unique ${id}`);assert.ok(nodes[0].querySelector('h2'),`${locale}: ${id} has a section heading`);
   if(menuIds.includes(id))assert.ok(doc.querySelector(`.desktop-subnav a[href="${base}/about-us#${id}"]`),`${locale}: menu reaches ${id}`);
  }
  assert.equal(doc.querySelector('.desktop-nav-group:nth-child(2) .desktop-subnav a').getAttribute('href'),`${base}/e-brochure`,`${locale}: profile menu opens brochure`);
  assert.equal(doc.querySelectorAll('.desktop-nav-group').length,7);assert.equal(doc.querySelectorAll('.desktop-subnav a').length,14);
  assert.deepEqual([...doc.querySelectorAll('.about-chapters a')].map(a=>a.hash),['#profile','#history','#partners','#activities','#achievements']);
  assert.ok(doc.querySelector('.md-masthead-figure img[src^="/assets/minhduc-v18/about-team"]'),'masthead uses the genuine team photo');
  assert.ok(doc.querySelector(`.md-masthead-actions a[href="${base}/about-us#business-contact"]`),'staffing CTA reaches the form on this page');
  assert.equal(doc.querySelectorAll('#activities img[src^="/assets/minhduc-v16/"]').length,4);
  assert.ok([...doc.querySelectorAll('#history [role=tab]')].every(tab=>tab.textContent.trim() && !/^\d+$/.test(tab.textContent.trim())),'phases have readable names');
  assert.equal(doc.querySelectorAll('#partners .info-partner').length,5,'only confirmed partner names');
  assert.equal(doc.querySelectorAll('.md-team-overview img').length,1,'one genuine group image accompanies the role list');
  const teamPhoto=doc.querySelector('.md-team-photo');
  assert.equal(teamPhoto.getAttribute('src'),'/assets/minhduc-v18/field-team.webp');
  assert.match(teamPhoto.getAttribute('srcset'), /480w.*960w.*1600w/,'documentary role image serves phone and desktop variants');
  assert.equal(doc.querySelectorAll('.info-team-grid button').length,4,'four accessible role details');
  assert.ok([...doc.querySelectorAll('#history .md-history-image img')].every(img=>img.getAttribute('src').startsWith('/assets/minhduc-')),'history uses Minh Đức imagery');
  const labels=[...doc.querySelectorAll('#profile .field-cover .field-stat > span')].map(node=>node.textContent.trim());
  assert.equal(labels.length,4);if(locale==='vi')vietnameseLabels=labels;else assert.ok(labels.every((label,index)=>label!==vietnameseLabels[index]),`${locale}: all scope labels translated`);
  const cover=doc.querySelector('#profile .field-cover');
  assert.ok(cover.querySelector('h2#about-profile-title') && cover.querySelector('.field-metrics[role=group][aria-label]'));
  assert.deepEqual([...cover.querySelectorAll('.field-stat strong')].map(node=>node.textContent),['05','03','B2B','FDI']);
  assert.equal(doc.querySelectorAll('.about-profile .field-metrics').length,1);
  assert.equal(doc.querySelector('.info-about-statistics'),null,'scope facts appear only inside the cover');
  assert.notEqual(cover.querySelector('img').getAttribute('src'),doc.querySelector('.md-page-masthead img').getAttribute('src'),'cover and masthead have distinct subjects');
  assert.equal(cover.querySelectorAll(`a[href="${base}/e-brochure"]`).length,1,'one localized brochure action inside the cover');
  assert.ok(doc.querySelector('#profile .field-cover + .info-about-values'),'three value statements directly follow the cover');
  assert.ok(doc.querySelector(`#partners a[href="${base}/partners"]`),'existing partners page remains accessible');
  for(const id of ids.filter(id=>id!=='business-contact'))assert.doesNotMatch(doc.getElementById(id).textContent,/mô phỏng|nhân vật giả định|giải thưởng đã được xác nhận/i,`${locale}: no repeated demo disclaimer`);
  assert.equal(languageSwitchUrl(`${base}/about-us`,'?source=menu','#partners','ja'),'/ja/about-us?source=menu#partners');
  dom.window.close();
 }
 const css=await readFile('src/pages/info/about-reference.css','utf8');
 const globalCss=await readFile('src/styles.css','utf8');
 assert.match(globalCss,/scroll-padding-top:\s*100px/,'global header clearance is declared');
 assert.match(css,/scroll-margin-top:\s*0/,'About anchors do not double the global clearance');
 const dom=new JSDOM('<div id="root"></div>',{url:'https://example.test/',pretendToBeVisual:true});
 for(const key of ['window','document','navigator','HTMLElement','Element','Node','Event','FormData','MutationObserver','localStorage','requestAnimationFrame','cancelAnimationFrame'])Object.defineProperty(globalThis,key,{configurable:true,writable:true,value:dom.window[key]});
 window.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});globalThis.IS_REACT_ACT_ENVIRONMENT=true;
 let y=0, seen=[],navigate;Object.defineProperty(window,'scrollY',{configurable:true,get:()=>y});
 window.scrollTo=options=>{y=options.top};window.HTMLElement.prototype.scrollIntoView=function(){seen.push(this.id);y={profile:100,history:400,partners:700,achievements:1000}[this.id]??0;};
 const {createRoot}=await import('react-dom/client');const root=createRoot(document.getElementById('root'));const {act}=React;
 const tick=()=>act(async()=>new Promise(resolve=>setTimeout(resolve,45)));
 function Harness(){navigate=useNavigate();return React.createElement(React.Fragment,null,React.createElement(PageTransition),React.createElement(AboutPage));}
 try {
  for(const locale of ['vi','en','zh','ko','ja'])for(const id of ids){
   const base=localeBase(locale);seen=[];
   await act(()=>root.render(React.createElement(LocaleProvider,{value:locale},React.createElement(MemoryRouter,{key:locale+id,basename:base||'/',initialEntries:[`${base}/about-us#${id}`]},React.createElement(Harness)))));await tick();
   assert.ok(seen.includes(id),`${locale}: direct hash scrolls to ${id}`);
   assert.equal(document.activeElement,document.getElementById(id).querySelector('h2'),`${locale}: direct hash focuses its heading`);
  }
  seen=[];await act(()=>root.render(React.createElement(LocaleProvider,{value:'en'},React.createElement(MemoryRouter,{key:'history',basename:'/en',initialEntries:['/en/about-us#profile']},React.createElement(Harness)))));await tick();
  y=250;window.dispatchEvent(new Event('scroll'));await act(()=>navigate('/about-us#history'));await tick();assert.equal(y,400);
  y=550;window.dispatchEvent(new Event('scroll'));await act(()=>navigate('/about-us#partners'));await tick();assert.equal(y,700);
  await act(()=>navigate(-1));await tick();assert.equal(y,550,'Back restores the previous same-page position');
  await act(()=>navigate(1));await tick();assert.equal(y,700,'Forward restores the later same-page position');
  const formSection=document.getElementById('business-contact');
  const chooseF02=()=>act(()=>formSection.querySelectorAll('.form-mode button')[1].click());
  const typeValue=(name,value)=>{
   const input=formSection.querySelector(`[name="${name}"]`);input.value=value;input.dispatchEvent(new Event('input',{bubbles:true}));
  };
  const primary=document.querySelector('.md-masthead-actions a[href$="#business-contact"]');
  await chooseF02();await act(()=>typeValue('name','Draft before staffing CTA'));
  await act(()=>primary.click());await tick();
  assert.equal(formSection.querySelector('.form-mode button').getAttribute('aria-pressed'),'true','masthead intentionally starts F01 after F02');
  assert.equal(formSection.querySelector('[name=name]').value,'','new F01 starts blank');
  assert.equal(document.activeElement,formSection.querySelector('h2'),'form heading keeps focus across form restart');
  await chooseF02();assert.equal(formSection.querySelector('[name=name]').value,'Draft before staffing CTA','an intentionally fresh F01 leaves the separate F02 draft intact');
  await act(()=>typeValue('name','Draft to preserve'));
  await act(()=>navigate('/about-us#history'));await tick();await act(()=>navigate(-1));await tick();
  assert.equal(formSection.querySelectorAll('.form-mode button')[1].getAttribute('aria-pressed'),'true','Back onto an old staffing intent does not replay it');
  assert.equal(formSection.querySelector('[name=name]').value,'Draft to preserve','history preserves the draft');
  await act(()=>navigate(1));await tick();
  await act(()=>typeValue('phone','0901234567'));
  await act(()=>formSection.querySelector('form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
  assert.ok(formSection.querySelector('.form-success'),'F02 receipt appears before the next staffing request');
  await act(()=>document.querySelectorAll('.info-team-card')[3].click());
  await act(()=>document.querySelector('[role=dialog] a[href$="#business-contact"]').click());await tick();
  assert.equal(formSection.querySelector('.form-success'),null,'fourth role action dismisses a previous receipt');
  assert.equal(formSection.querySelector('.form-mode button').getAttribute('aria-pressed'),'true');
  assert.equal(formSection.querySelector('[name=name]').value,'');
  assert.equal(document.activeElement,formSection.querySelector('h2'));
  await act(()=>typeValue('name','Second same-hash request'));await act(()=>primary.click());await tick();
  assert.equal(formSection.querySelector('[name=name]').value,'Second same-hash request','acting on the same URL keeps unfinished F01 work editable');
  await act(()=>{typeValue('phone','0901234567');typeValue('location','Sample workplace');typeValue('notes','Sample staffing request');});
  await act(()=>formSection.querySelector('form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
  assert.ok(formSection.querySelector('.form-success'),'completed F01 shows its receipt');
  await act(()=>primary.click());await tick();
  assert.equal(formSection.querySelector('.form-success'),null,'the same-hash staffing action reopens an editable F01 after its own receipt');
  assert.equal(formSection.querySelector('.form-mode button').getAttribute('aria-pressed'),'true');
  assert.equal(formSection.querySelector('[name=name]').value,'','completed F01 starts a blank request');
  assert.equal(document.activeElement,formSection.querySelector('h2'));
 } finally {await act(()=>root.unmount());dom.window.close();}
 console.log('PASS About anchors: five locales, unique sections, direct hashes, Back/Forward, fallback routes and header clearance');
} finally {await rm(temp,{recursive:true,force:true});}
