import {build} from 'esbuild';
import {mkdir,rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {JSDOM} from 'jsdom';
import assert from 'node:assert/strict';
const dir='.navigation-test';
await mkdir(dir,{recursive:true});
try {
 await build({stdin:{contents:"export {Header,PageTransition} from './src/App'; export {loadLocale} from './src/i18n-runtime/catalog'; export {LocaleProvider} from './src/i18n';",resolveDir:process.cwd(),sourcefile:'navigation-entry.tsx'},bundle:true,platform:'node',format:'esm',outfile:`${dir}/bundle.mjs`,packages:'external',loader:{'.css':'empty'},logLevel:'silent'});
 const dom=new JSDOM('<div id="root"></div><button id="outside">Outside</button>',{url:'https://example.test/',pretendToBeVisual:true});
 for(const key of ['window','document','navigator','HTMLElement','Element','Node','Event','MutationObserver','localStorage','requestAnimationFrame','cancelAnimationFrame'])Object.defineProperty(globalThis,key,{value:dom.window[key],configurable:true});
 globalThis.IS_REACT_ACT_ENVIRONMENT=true;
 const React=await import('react');const {act}=React;const {createRoot}=await import('react-dom/client');const {MemoryRouter}=await import('react-router-dom');
 const {Header,PageTransition,LocaleProvider,loadLocale}=await import(pathToFileURL(`${process.cwd()}/${dir}/bundle.mjs`));
 await Promise.all(['vi','en','zh','ko','ja'].map(loadLocale));
 const root=createRoot(document.getElementById('root'));
 const expectedHome={vi:'Trang chủ',en:'Home',zh:'首页',ko:'홈',ja:'ホーム'};
 for(const locale of ['vi','en','zh','ko','ja']){
  await act(()=>root.render(React.createElement(LocaleProvider,{value:locale},React.createElement(MemoryRouter,{key:locale},React.createElement(Header)))));
  const groups=[...document.querySelectorAll('.desktop-nav-group')];assert.equal(groups.length,7);
  assert.deepEqual(groups.map(g=>g.querySelector('a').getAttribute('href')),['/','/about-us','/services','/jobs','/careers','/news','/contact']);
  assert.equal(groups[0].querySelector('a').textContent,expectedHome[locale]);
  assert.deepEqual(groups.map(g=>g.querySelectorAll('.desktop-subnav a').length),[0,4,5,3,4,2,1]);
  assert.equal([...document.querySelectorAll('.desktop-subnav a')].length,19);
  assert.match(groups[3].querySelector('.desktop-subnav a').getAttribute('href'),/skillLevel=.*#job-listings/);
  const buttons=[...document.querySelectorAll('.desktop-nav-heading button')];assert.equal(buttons.length,6);
  const button=buttons[0],panel=document.getElementById(button.getAttribute('aria-controls'));
  assert.ok(button.getAttribute('aria-label'));assert.equal(button.getAttribute('aria-expanded'),'false');assert.equal(panel.hidden,true);
  await act(()=>button.click());assert.equal(button.getAttribute('aria-expanded'),'true');assert.equal(panel.hidden,false);
  await act(()=>document.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Escape',bubbles:true})));
  assert.equal(panel.hidden,true);assert.equal(document.activeElement,button);
  await act(()=>button.click());await act(()=>document.getElementById('outside').dispatchEvent(new dom.window.Event('pointerdown',{bubbles:true})));
  assert.equal(panel.hidden,true);
  await act(()=>button.click());await act(()=>buttons[1].click());assert.equal(panel.hidden,true);assert.equal(buttons[1].getAttribute('aria-expanded'),'true');
  await act(()=>document.dispatchEvent(new dom.window.CustomEvent('header-overlay-open',{detail:{owner:'language'}})));assert.equal(buttons[1].getAttribute('aria-expanded'),'false');
  await act(()=>button.click());await act(()=>button.dispatchEvent(new dom.window.FocusEvent('focusout',{bubbles:true,relatedTarget:document.getElementById('outside')})));assert.equal(panel.hidden,true);
  await act(()=>document.querySelector('.menu-button').click());
  const mobileGroups=[...document.querySelectorAll('.drawer-group')];assert.equal(mobileGroups.length,7);assert.deepEqual(mobileGroups.map(g=>g.querySelectorAll('.drawer-subnav a').length),[0,4,5,3,4,2,1]);
  const mobileButtons=[...document.querySelectorAll('.drawer-group-heading button')];assert.equal(mobileButtons.length,6);
  await act(()=>mobileButtons[0].click());assert.equal(mobileButtons[0].getAttribute('aria-expanded'),'true');assert.equal(document.getElementById(mobileButtons[0].getAttribute('aria-controls')).hidden,false);
  await act(()=>mobileButtons[1].click());assert.equal(mobileButtons[0].getAttribute('aria-expanded'),'false');assert.equal(mobileButtons[1].getAttribute('aria-expanded'),'true');
  await act(()=>document.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Escape',bubbles:true})));assert.equal(document.querySelector('.navigation-panel'),null);
 }
 for(const [path,parent] of [['/partners','/about-us'],['/e-brochure','/about-us'],['/events','/news'],['/education','/jobs']]){
  await act(()=>root.render(React.createElement(LocaleProvider,{value:'vi'},React.createElement(MemoryRouter,{initialEntries:[path],key:path},React.createElement(Header)))));
  const link=[...document.querySelectorAll('.desktop-nav-heading a')].find(el=>el.getAttribute('href')===parent);
  assert.ok(link.classList.contains('active'),`${path} highlights ${parent}`);assert.equal(link.getAttribute('aria-current'),null,'parent is not the current page');
  await act(()=>document.querySelector('.menu-button').click());
  const drawerLink=[...document.querySelectorAll('.drawer-group-heading a')].find(el=>el.getAttribute('href')===parent);
  assert.ok(drawerLink.classList.contains('active'));assert.equal(drawerLink.getAttribute('aria-current'),null);
  await act(()=>document.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Escape',bubbles:true})));
 }
 const {renderToStaticMarkup}=await import('react-dom/server');
 const markup=renderToStaticMarkup(React.createElement(LocaleProvider,{value:'vi'},React.createElement(MemoryRouter,null,React.createElement(Header))));
 assert.match(markup,/<\/header><noscript>/);assert.match(markup,/\.site-header\{position:relative!important/);assert.match(markup,/\.desktop-nav,\.header-search,\.menu-button,\.language-selector\{display:none!important/);assert.match(markup,/class="no-script-nav"/);assert.match(markup,/about-us#history/);assert.match(markup,/careers#cv-requirements/);
 const {useNavigate}=await import('react-router-dom');let navigate,scrolls=0;
 function Harness(){navigate=useNavigate();return React.createElement(React.Fragment,null,React.createElement(PageTransition),React.createElement('div',{id:'job-listings'}))}
 dom.window.HTMLElement.prototype.scrollIntoView=function(){if(this.id==='job-listings')scrolls++};dom.window.scrollTo=()=>{};
 await act(()=>root.render(React.createElement(MemoryRouter,{initialEntries:['/jobs?skillLevel=first#job-listings'],key:'scroll'},React.createElement(Harness))));await act(async()=>new Promise(resolve=>setTimeout(resolve,40)));
 const first=scrolls;assert.ok(first>0);await act(()=>navigate('/jobs?skillLevel=second#job-listings'));await act(async()=>new Promise(resolve=>setTimeout(resolve,40)));assert.ok(scrolls>first,'same-path query change scrolls to anchor');
 await act(()=>root.unmount());dom.window.close();console.log('Navigation groups and disclosure interactions pass in five locales');
} finally {await rm(dir,{recursive:true,force:true})}
