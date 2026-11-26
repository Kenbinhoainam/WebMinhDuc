import {build} from 'esbuild';
import {mkdtemp,rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {JSDOM} from 'jsdom';
import assert from 'node:assert/strict';
const dir=await mkdtemp('.navigation-test-');
try {
 await build({stdin:{contents:"export {Header,PageTransition} from './src/App'; export {loadLocale} from './src/i18n-runtime/catalog'; export {LocaleProvider} from './src/i18n';",resolveDir:process.cwd(),sourcefile:'entry.tsx'},bundle:true,platform:'node',format:'esm',outfile:`${dir}/bundle.mjs`,packages:'external',loader:{'.css':'empty'},logLevel:'silent'});
 const dom=new JSDOM('<div id="root"></div><button id="outside">Outside</button>',{url:'https://example.test/',pretendToBeVisual:true});
 for(const key of ['window','document','navigator','HTMLElement','Element','Node','Event','MutationObserver','localStorage','requestAnimationFrame','cancelAnimationFrame'])Object.defineProperty(globalThis,key,{value:dom.window[key],configurable:true});
 window.matchMedia=()=>({matches:true,addEventListener(){},removeEventListener(){}});globalThis.IS_REACT_ACT_ENVIRONMENT=true;
 const React=await import('react');const {act}=React;const {createRoot}=await import('react-dom/client');const {MemoryRouter,useLocation}=await import('react-router-dom');
 const {Header,LocaleProvider,loadLocale}=await import(pathToFileURL(`${process.cwd()}/${dir}/bundle.mjs`));await Promise.all(['vi','en','zh','ko','ja'].map(loadLocale));
 const root=createRoot(document.getElementById('root'));const labels={vi:'Trang chủ',en:'Home',zh:'首页',ko:'홈',ja:'ホーム'};
 function Location(){return React.createElement('output',{id:'path'},useLocation().pathname)}
 const render=async(locale='vi',path='/')=>act(()=>root.render(React.createElement(LocaleProvider,{value:locale},React.createElement(MemoryRouter,{key:locale+path,initialEntries:[path]},React.createElement(React.Fragment,null,React.createElement(Header),React.createElement(Location))))));
 const pointer=async(el,type='pointerdown',kind='touch')=>act(()=>{const event=new dom.window.MouseEvent(type,{bubbles:true});Object.defineProperty(event,'pointerType',{value:kind});el.dispatchEvent(event)});
 const pause=ms=>act(async()=>new Promise(resolve=>setTimeout(resolve,ms)));
 for(const locale of Object.keys(labels)){
  await render(locale);const row=document.querySelector('.header-inner');assert.deepEqual([...row.children].map(el=>el.className),['brand','desktop-nav','header-actions']);
  const groups=[...document.querySelectorAll('.desktop-nav-group')];assert.equal(groups.length,7);assert.equal(groups[0].querySelector('a').textContent,labels[locale]);assert.equal(groups[1].querySelector('.desktop-subnav a').getAttribute('href'),'/about-us#profile');assert.deepEqual(groups.map(g=>g.querySelectorAll('.desktop-subnav a').length),[0,4,5,3,0,2,0]);
  assert.equal(document.querySelectorAll('.desktop-nav-heading button').length,0);const parents=[...document.querySelectorAll('.desktop-nav-heading a[data-group]')];assert.equal(parents.length,4);
  const first=parents[0],panel=document.getElementById(first.getAttribute('aria-controls'));await act(()=>first.focus());assert.equal(first.getAttribute('aria-expanded'),'true');
  await act(()=>document.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Escape',bubbles:true})));assert.equal(panel.hidden,true);assert.equal(document.activeElement,first);
  await act(()=>{first.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true}));document.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Escape',bubbles:true}))});await pause(30);assert.equal(panel.hidden,true);assert.equal(document.activeElement,first,'Escape cancels queued submenu focus');
  await act(()=>first.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true})));await pause(30);assert.equal(document.activeElement,panel.querySelector('a'));
  await act(()=>document.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Escape',bubbles:true})));assert.equal(panel.hidden,true);assert.equal(document.activeElement,first);
 }
 await render('vi','/');
 Object.defineProperty(window,'scrollY',{configurable:true,value:80});await act(()=>window.dispatchEvent(new dom.window.Event('scroll')));
 assert(document.querySelector('.site-header').classList.contains('is-scrolled'),'scroll switches header to contrast glass');
 Object.defineProperty(window,'scrollY',{configurable:true,value:0});await act(()=>window.dispatchEvent(new dom.window.Event('scroll')));
 assert(!document.querySelector('.site-header').classList.contains('is-scrolled'),'top position restores transparent header');
 let links=[...document.querySelectorAll('.desktop-nav-heading a[data-group]')];const [a,b]=links;
 await pointer(a);await act(()=>a.focus());await act(()=>a.click());assert.equal(document.getElementById('path').textContent,'/');assert.equal(a.getAttribute('aria-expanded'),'true');
 await pointer(b);await act(()=>b.focus());await act(()=>b.click());assert.equal(document.getElementById('path').textContent,'/','first touch on a new parent only opens submenu');assert.equal(b.getAttribute('aria-expanded'),'true');
 await pointer(b);await act(()=>b.click());assert.equal(document.getElementById('path').textContent,'/services','second touch navigates to parent');
 await render('vi','/jobs');await act(()=>document.querySelector('.menu-button').focus());await act(()=>document.querySelector('.menu-button').click());assert.equal(document.querySelectorAll('.drawer-group').length,7);assert.equal(document.querySelectorAll('.drawer-subnav a').length,14);assert.equal(document.querySelector('.drawer-utilities a').getAttribute('href'),'/saved-jobs');const mobile=document.querySelector('.drawer-group-heading button');await act(()=>mobile.click());assert.equal(mobile.getAttribute('aria-expanded'),'true');await act(()=>document.querySelector('.drawer-utilities button').click());assert.equal(document.querySelector('.navigation-panel'),null,'search replaces drawer');assert.ok(document.querySelector('.site-search'),'search remains reachable from mobile menu');assert.equal(document.querySelectorAll('[role=dialog]').length,1);assert.equal(document.activeElement,document.querySelector('[role=dialog]'),'search receives focus');await act(()=>document.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Escape',bubbles:true})));assert.equal(document.querySelector('[role=dialog]'),null);assert.equal(document.activeElement,document.querySelector('.menu-button'),'search close restores the visible menu trigger');
 const {renderToStaticMarkup}=await import('react-dom/server');const markup=renderToStaticMarkup(React.createElement(LocaleProvider,{value:'vi'},React.createElement(MemoryRouter,null,React.createElement(Header))));assert.match(markup,/<\/header><noscript>/);assert.match(markup,/href="\/careers"/);assert.doesNotMatch(markup,/careers#cv-requirements/);
 await act(()=>root.unmount());dom.window.close();console.log('PASS five-locale arrow-free navigation, keyboard, touch and mobile sitemap');
}finally{await rm(dir,{recursive:true,force:true})}
