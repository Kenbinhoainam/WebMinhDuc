import {build} from 'esbuild';
import {mkdir, rm, readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import postcss from 'postcss';

// Independent interaction checks. This deliberately makes no layout or CWV claim.
const temp='.flagship-review';
await mkdir(temp,{recursive:true});
await build({stdin:{contents:"export {Header} from './src/App'; export {default as Hero} from './src/HomeHero'; export {LocaleProvider,localeBase} from './src/i18n'; export {loadLocale} from './src/i18n-runtime/catalog';",resolveDir:process.cwd(),sourcefile:'flagship-review.tsx'},bundle:true,platform:'node',format:'esm',packages:'external',loader:{'.css':'empty'},outfile:`${temp}/bundle.mjs`,logLevel:'silent'});
const dom=new JSDOM('<div id="root"></div><button id="outside">Outside</button>',{url:'https://example.test/',pretendToBeVisual:true});
for(const key of ['window','document','navigator','HTMLElement','Element','Node','Event','CustomEvent','KeyboardEvent','MutationObserver','localStorage','requestAnimationFrame','cancelAnimationFrame'])Object.defineProperty(globalThis,key,{configurable:true,writable:true,value:dom.window[key]});
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
window.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
window.scrollTo=()=>{};
const React=await import('react');const {act}=React;
const {createRoot}=await import('react-dom/client');const {MemoryRouter}=await import('react-router-dom');
const {Header,Hero,LocaleProvider,localeBase,loadLocale}=await import(pathToFileURL(`${process.cwd()}/${temp}/bundle.mjs`).href);
const root=createRoot(document.getElementById('root'));
const click=async element=>{assert.ok(element);await act(()=>element.click())};
const errors=[];const logError=console.error;console.error=(...args)=>{errors.push(args.join(' '));logError(...args)};
try {
 for(const locale of ['vi','en','zh','ko','ja']) {
  await loadLocale(locale);
  const base=localeBase(locale);
  await act(()=>root.render(React.createElement(LocaleProvider,{value:locale},React.createElement(MemoryRouter,{key:locale,basename:base||'/',initialEntries:[`${base}/jobs?q=kho#details`]},React.createElement(Header)))));
  assert.equal(document.querySelectorAll('.desktop-nav-group').length,7);
  assert.equal(document.querySelector('.desktop-nav-heading>a').textContent,{vi:'Trang chủ',en:'Home',zh:'首页',ko:'홈',ja:'ホーム'}[locale]);
  const services=document.querySelector('.desktop-nav-heading button[data-group="/services"]');
  const destination=services.previousElementSibling;
  assert.equal(destination.getAttribute('href'),`${base}/services`);
  const trigger=document.querySelector('.language-trigger');
  await click(services);await click(trigger);
  assert.equal(services.getAttribute('aria-expanded'),'false','language opening closes navigation');
  assert.equal(trigger.getAttribute('aria-expanded'),'true');
  const languages=[...document.querySelectorAll('.language-panel a')];
  assert.equal(languages.length,5);
  assert.deepEqual(languages.map(a=>a.getAttribute('href')),['/jobs?q=kho#details','/en/jobs?q=kho#details','/zh/jobs?q=kho#details','/ko/jobs?q=kho#details','/ja/jobs?q=kho#details']);
  assert.equal(languages.filter(a=>a.hasAttribute('aria-current')).length,1);
  await click(services);
  assert.equal(trigger.getAttribute('aria-expanded'),'false','navigation opening closes language');
  assert.equal(services.getAttribute('aria-expanded'),'true');
  await act(()=>document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true})));
  assert.equal(services.getAttribute('aria-expanded'),'false');assert.equal(document.activeElement,services);
  await click(services);await click(destination);
  assert.equal(services.getAttribute('aria-expanded'),'false','destination navigation closes disclosure');
  await click(trigger);await click(document.querySelector('.header-search'));
  assert.equal(trigger.getAttribute('aria-expanded'),'false','search opening closes language');
  assert.ok(document.querySelector('[role="dialog"]'));
  await act(()=>document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true})));
  assert.equal(document.querySelector('[role="dialog"]'),null);
 }
 let paused=true,plays=0;
 Object.defineProperty(window.HTMLMediaElement.prototype,'paused',{configurable:true,get(){return paused}});
 window.HTMLMediaElement.prototype.play=function(){paused=false;plays++;this.dispatchEvent(new Event('play'));return Promise.resolve()};
 window.HTMLMediaElement.prototype.pause=function(){paused=true;this.dispatchEvent(new Event('pause'))};
 await act(()=>root.render(React.createElement(MemoryRouter,null,React.createElement(Hero))));
 const video=document.querySelector('video');assert.equal(video.getAttribute('src'),null);assert.equal(video.getAttribute('preload'),'none');
 const poster=document.querySelector('.hero-poster');assert.ok(poster,'an independent poster is present before video loading');
 assert.equal(document.querySelectorAll('.hero-poster').length,1);assert.equal(poster.getAttribute('src'),'/optimized/assets/hero-poster-1600.webp');
 assert.equal(poster.getAttribute('alt'),'');assert.equal(poster.closest('.hero-media')?.getAttribute('aria-hidden'),'true');
 assert.equal(poster.getAttribute('fetchpriority'),'high');assert.notEqual(poster.getAttribute('loading'),'lazy');assert.equal(video.classList.contains('is-ready'),false);
 assert.ok(!document.querySelector('.hero-bottom,.hero-caption,.scroll-hint'),'removed hero footer content must not return');
 const control=document.querySelector('.video-control');assert.ok(control.getAttribute('aria-label'));assert.equal(control.tabIndex,0,'keyboard video control remains reachable');await click(control);await click(control);
 assert.equal(paused,true);
 await act(()=>new Promise(resolve=>setTimeout(resolve,1700)));
 assert.equal(paused,true,'quick manual play then pause must cancel pending autoplay');assert.equal(plays,1);
 // Regression for the observed production cascade: importing base CSS after App
 // reinstated the desktop hamburger. The compact header now uses a 100px
 // anchor offset instead of the former two-row 145px offset. This checks
 // compiled rule order only; it is not a browser layout assertion.
 const builtHtml=await readFile('dist/index.html','utf8');
 const builtDocument=new window.DOMParser().parseFromString(builtHtml,'text/html');
 assert.ok([...builtDocument.querySelectorAll('link[rel="preload"][as="image"]')].some(link=>link.getAttribute('href')===poster.getAttribute('src')),'poster markup uses the same URL as the homepage preload');
 const cssPath=builtDocument.querySelector('link[rel="stylesheet"]')?.getAttribute('href');
 assert.ok(cssPath?.startsWith('/assets/'),'compiled entry stylesheet exists');
 const css=await readFile(`dist${cssPath}`,'utf8');
 const baseDisplay=css.indexOf('.header-saved,.menu-button{display:flex');
 const desktopHide=css.indexOf('.menu-button{display:none');
 assert.ok(baseDisplay>=0&&desktopHide>baseDisplay,'desktop hamburger hide must follow base utility display');
 const rules=postcss.parse(css);let compactDesktopOffset=false,compactHeight=false;
 rules.walkDecls('scroll-padding-top',decl=>assert.notEqual(decl.value,'145px','obsolete two-row offset must not survive'));
 rules.walkRules('.header-inner',rule=>rule.walkDecls('height',decl=>{if(decl.value==='86px')compactHeight=true}));
 rules.walkAtRules('media',media=>{if(/min-width:\s*1280px/.test(media.params))media.walkRules('html',rule=>rule.walkDecls('scroll-padding-top',decl=>{if(decl.value==='100px')compactDesktopOffset=true}))});
 assert.ok(compactHeight&&compactDesktopOffset,'single-row header height and desktop anchor offset are present');
 assert.equal(errors.length,0,errors.join('\n'));
 console.log('PASS independent flagship: five locale routes, mutually exclusive disclosures/search, Escape focus, destination links, poster-first media, quick manual pause, compiled CSS order');
} finally {
 console.error=logError;await act(()=>root.unmount());dom.window.close();await rm(temp,{recursive:true,force:true});
}
