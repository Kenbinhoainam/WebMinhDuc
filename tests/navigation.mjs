import {build} from 'esbuild';
import {mkdtemp,rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {JSDOM} from 'jsdom';
import assert from 'node:assert/strict';
const dir=await mkdtemp('.navigation-test-');
try {
 await build({stdin:{contents:"export {Header} from './src/Header'; export {loadLocale} from './src/i18n-runtime/catalog'; export {LocaleProvider} from './src/i18n';",resolveDir:process.cwd(),sourcefile:'entry.tsx'},bundle:true,platform:'node',format:'esm',outfile:`${dir}/bundle.mjs`,packages:'external',loader:{'.css':'empty'},logLevel:'silent'});
 const dom=new JSDOM('<div id="root"></div>',{url:'https://example.test/',pretendToBeVisual:true});
 for(const key of ['window','document','navigator','HTMLElement','Element','Node','Event','CustomEvent','MutationObserver','localStorage','requestAnimationFrame','cancelAnimationFrame'])Object.defineProperty(globalThis,key,{value:dom.window[key],configurable:true});
 window.matchMedia=()=>({matches:true,addEventListener(){},removeEventListener(){}});globalThis.IS_REACT_ACT_ENVIRONMENT=true;
 const React=await import('react');const {act}=React;const {createRoot}=await import('react-dom/client');const {MemoryRouter,useLocation}=await import('react-router-dom');
 const {Header,LocaleProvider,loadLocale}=await import(pathToFileURL(`${process.cwd()}/${dir}/bundle.mjs`));await Promise.all(['vi','en','zh','ko','ja'].map(loadLocale));
 const root=createRoot(document.getElementById('root'));const labels={vi:'Trang chủ',en:'Home',zh:'首页',ko:'홈',ja:'ホーム'};
 function Location(){return React.createElement('output',{id:'path'},useLocation().pathname)}
 const render=async(locale='vi',path='/')=>act(()=>root.render(React.createElement(LocaleProvider,{value:locale},React.createElement(MemoryRouter,{key:locale+path,initialEntries:[path]},React.createElement(React.Fragment,null,React.createElement(Header),React.createElement(Location))))));
 const click=element=>act(()=>element.click());
 for(const locale of Object.keys(labels)){
  await render(locale);assert.equal(document.querySelector('.desktop-nav'),null);
  const menu=document.querySelector('.menu-button');await act(()=>menu.focus());await click(menu);
  const groups=[...document.querySelectorAll('.drawer-group')];assert.equal(groups.length,7);
  assert.equal(groups[0].querySelector('a').textContent.trim(),labels[locale]);
  assert.deepEqual(groups.map(group=>group.querySelectorAll('.drawer-subnav a').length),[0,4,5,3,4,2,1]);
  const disclosure=groups[1].querySelector('button'),panel=document.getElementById(disclosure.getAttribute('aria-controls'));
  assert.equal(panel.hidden,true);await click(disclosure);assert.equal(disclosure.getAttribute('aria-expanded'),'true');assert.equal(panel.hidden,false);
  await click(disclosure);assert.equal(panel.hidden,true);
  await act(()=>document.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Escape',bubbles:true})));
  assert.equal(document.querySelector('.navigation-panel'),null);assert.equal(document.activeElement,menu,'Escape restores trigger focus');
 }
 await render('vi');await click(document.querySelector('.menu-button'));await click(document.querySelectorAll('.drawer-group')[2].querySelector('button'));
 await click(document.querySelectorAll('.drawer-group')[2].querySelector('.drawer-subnav a'));
 assert.match(document.getElementById('path').textContent,/^\/services\//);assert.equal(document.querySelector('.navigation-panel'),null);
 const {renderToStaticMarkup}=await import('react-dom/server');const markup=renderToStaticMarkup(React.createElement(LocaleProvider,{value:'vi'},React.createElement(MemoryRouter,null,React.createElement(Header))));assert.match(markup,/<\/header><noscript>/);assert.match(markup,/careers#cv-requirements/);
 await act(()=>root.unmount());dom.window.close();console.log('PASS compact navigation: five locales, seven groups, 19 children, disclosure, Escape and destination');
}finally{await rm(dir,{recursive:true,force:true})}
