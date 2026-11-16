import {build} from 'esbuild';
import {mkdir,rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {JSDOM} from 'jsdom';
import assert from 'node:assert/strict';
const dir='.navigation-test';
await mkdir(dir,{recursive:true});
try {
 await build({stdin:{contents:"export {Header} from './src/App'; export {loadLocale} from './src/i18n-runtime/catalog'; export {LocaleProvider} from './src/i18n';",resolveDir:process.cwd(),sourcefile:'navigation-entry.tsx'},bundle:true,platform:'node',format:'esm',outfile:`${dir}/bundle.mjs`,packages:'external',loader:{'.css':'empty'},logLevel:'silent'});
 const dom=new JSDOM('<div id="root"></div><button id="outside">Outside</button>',{url:'https://example.test/',pretendToBeVisual:true});
 for(const key of ['window','document','navigator','HTMLElement','Element','Node','Event','MutationObserver','localStorage','requestAnimationFrame','cancelAnimationFrame'])Object.defineProperty(globalThis,key,{value:dom.window[key],configurable:true});
 globalThis.IS_REACT_ACT_ENVIRONMENT=true;
 const React=await import('react');const {act}=React;const {createRoot}=await import('react-dom/client');const {MemoryRouter}=await import('react-router-dom');
 const {Header,LocaleProvider,loadLocale}=await import(pathToFileURL(`${process.cwd()}/${dir}/bundle.mjs`));
 await Promise.all(['vi','en','zh','ko','ja'].map(loadLocale));
 const root=createRoot(document.getElementById('root'));
 const expectedHome={vi:'Trang chủ',en:'Home',zh:'首页',ko:'홈',ja:'ホーム'};
 for(const locale of ['vi','en','zh','ko','ja']){
  await act(()=>root.render(React.createElement(LocaleProvider,{value:locale},React.createElement(MemoryRouter,{key:locale},React.createElement(Header)))));
  const groups=[...document.querySelectorAll('.desktop-nav-group')];assert.equal(groups.length,7);
  assert.deepEqual(groups.map(g=>g.querySelector('a').getAttribute('href')),['/','/about-us','/services','/jobs','/careers','/news','/contact']);
  assert.equal(groups[0].querySelector('a').textContent,expectedHome[locale]);
  const buttons=[...document.querySelectorAll('.desktop-nav-heading button')];assert.equal(buttons.length,4);
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
 }
 await act(()=>root.unmount());dom.window.close();console.log('Navigation groups and disclosure interactions pass in five locales');
} finally {await rm(dir,{recursive:true,force:true})}
