import {build} from 'esbuild';
import {mkdir,rm,readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import postcss from 'postcss';

// DOM and stylesheet intent checks only. This is not screenshot/layout QA.
const temp='.header-reference-test';await mkdir(temp,{recursive:true});
try {
 await build({stdin:{contents:"export {Header} from './src/App'; export {LocaleProvider,localeNames} from './src/i18n'; export {loadLocale} from './src/i18n-runtime/catalog';",resolveDir:process.cwd(),sourcefile:'header-reference.tsx'},bundle:true,platform:'node',format:'esm',packages:'external',loader:{'.css':'empty'},outfile:`${temp}/bundle.mjs`,logLevel:'silent'});
 const dom=new JSDOM('<div id="root"></div>',{url:'https://example.test/',pretendToBeVisual:true});
 for(const key of ['window','document','navigator','HTMLElement','Element','Node','Event','CustomEvent','KeyboardEvent','localStorage','requestAnimationFrame','cancelAnimationFrame'])Object.defineProperty(globalThis,key,{configurable:true,writable:true,value:dom.window[key]});
 globalThis.IS_REACT_ACT_ENVIRONMENT=true;
 const listeners=new Set();const breakpoint={matches:true,addEventListener:(_,fn)=>listeners.add(fn),removeEventListener:(_,fn)=>listeners.delete(fn)};
 window.matchMedia=()=>breakpoint;
 const React=await import('react');const {act}=React;const {createRoot}=await import('react-dom/client');const {MemoryRouter}=await import('react-router-dom');
 const {Header,LocaleProvider,localeNames,loadLocale}=await import(pathToFileURL(`${process.cwd()}/${temp}/bundle.mjs`).href);
 const root=createRoot(document.getElementById('root'));
 const click=element=>act(()=>element.click());
 const resize=async matches=>{await act(()=>{breakpoint.matches=matches;for(const listener of [...listeners])listener({matches})});await act(()=>new Promise(resolve=>setTimeout(resolve,40)))};
 try {
  for(const locale of ['vi','en','zh','ko','ja']){
   await loadLocale(locale);
   breakpoint.matches=true;
   await act(()=>root.render(React.createElement(LocaleProvider,{value:locale},React.createElement(MemoryRouter,{key:locale},React.createElement(Header)))));
   const row=document.querySelector('.header-inner'),nav=document.querySelector('.desktop-nav');
   assert.ok(nav.parentElement===row,'navigation shares the brand/action row');
   assert.ok(row.querySelector('.brand').parentElement===row);assert.ok(row.querySelector('.header-actions').parentElement===row);
   assert.equal(nav.querySelectorAll('.desktop-nav-group').length,7);assert.equal(nav.querySelectorAll('.desktop-subnav a').length,19);
   const language=document.querySelector('.language-trigger');assert.match(language.getAttribute('aria-label'),new RegExp(localeNames[locale]));
   assert.equal(language.querySelector('span').textContent,locale.toUpperCase());
   const firstLink=nav.querySelector('a');await act(()=>firstLink.focus());
   await resize(false);assert.ok(document.activeElement===document.querySelector('.menu-button'),'closed desktop navigation transfers focus when hidden');
   await click(document.querySelector('.menu-button'));const drawerLink=document.querySelector('.drawer-group-heading a');await act(()=>drawerLink.focus());
   await resize(true);assert.equal(document.querySelector('.navigation-panel'),null);assert.ok(document.activeElement===firstLink,'drawer focus transfers to visible desktop link');
   await click(language);await act(()=>document.querySelector('.language-panel a').focus());
   await resize(false);assert.equal(language.getAttribute('aria-expanded'),'false');assert.ok(document.activeElement===language,'resize returns language-list focus to its visible trigger');
  }
 }finally{await act(()=>root.unmount());dom.window.close()}
 const css=await readFile('src/sprint-navigation.css','utf8');
 const localeCss=await readFile('src/locale-selector.css','utf8');
 assert.doesNotMatch(css+localeCss,/#102d43|rgba\(13,\s*37,\s*54/i,'obsolete navy header/fallback surfaces must not survive');
 const stylesheet=postcss.parse(css);let transparentTop=false,compactRow=false,hiddenSmallUtility=false;
 stylesheet.walkRules(rule=>{
  if(rule.parent.type==='root'&&rule.selectors.includes('.site-header:not(.is-scrolled):not(.inner-header)'))rule.walkDecls('background',decl=>{if(decl.value==='transparent')transparentTop=true});
  if(rule.selector==='.header-inner')rule.walkDecls('height',decl=>{if(decl.value==='86px')compactRow=true});
  if(rule.parent.type==='atrule'&&rule.parent.name==='media'&&/max-width:\s*(?:[3-5]\d\d)px/.test(rule.parent.params)&&rule.selectors.some(selector=>['.site-header .header-saved','.site-header .header-search'].includes(selector)))rule.walkDecls('display',decl=>{if(decl.value==='none')hiddenSmallUtility=true});
 });
 assert.ok(transparentTop&&compactRow,'header source declares a clear hero overlay and compact row');
 assert.ok(hiddenSmallUtility,'small-screen utility override must outrank the global utility display rule');
 console.log('PASS header reference: one shared row, seven/nineteen navigation structure, five compact locale controls, responsive focus transfer, transparent/neutral source rules');
}finally{await rm(temp,{recursive:true,force:true})}
