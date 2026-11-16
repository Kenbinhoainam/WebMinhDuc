import {build} from 'esbuild';
import {mkdir,rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';

// Regression for mutual exclusion and focus restoration across the compact header overlays.
const temp='.header-hover-review';await mkdir(temp,{recursive:true});
try {
 await build({entryPoints:['src/Header.tsx'],bundle:true,platform:'node',format:'esm',packages:'external',loader:{'.css':'empty'},outfile:`${temp}/bundle.mjs`,logLevel:'silent'});
 const dom=new JSDOM('<div id="root"></div>',{url:'https://example.test/',pretendToBeVisual:true});
 for(const key of ['window','document','navigator','HTMLElement','Element','Node','Event','CustomEvent','KeyboardEvent','localStorage','requestAnimationFrame','cancelAnimationFrame'])Object.defineProperty(globalThis,key,{configurable:true,writable:true,value:dom.window[key]});
 globalThis.IS_REACT_ACT_ENVIRONMENT=true;window.matchMedia=()=>({matches:true,addEventListener(){},removeEventListener(){}});
 const React=await import('react');const {act}=React;const {createRoot}=await import('react-dom/client');const {MemoryRouter}=await import('react-router-dom');
 const {Header}=await import(pathToFileURL(`${process.cwd()}/${temp}/bundle.mjs`).href),root=createRoot(document.getElementById('root'));
 const click=target=>act(()=>target.click());const escape=()=>act(()=>document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true})));
 try {
  await act(()=>root.render(React.createElement(MemoryRouter,null,React.createElement(Header))));
  const language=document.querySelector('.language-trigger'),search=document.querySelector('.header-search'),menu=document.querySelector('.menu-button');
  await click(language);assert.equal(language.getAttribute('aria-expanded'),'true');
  await act(()=>search.focus());await click(search);assert.equal(language.getAttribute('aria-expanded'),'false');assert.ok(document.querySelector('.site-search'));
  await escape();assert.equal(document.querySelector('.site-search'),null);assert.equal(document.activeElement,search);
  await click(language);await act(()=>menu.focus());await click(menu);assert.equal(language.getAttribute('aria-expanded'),'false');assert.ok(document.querySelector('.navigation-panel'));
  await escape();assert.equal(document.querySelector('.navigation-panel'),null);assert.equal(document.activeElement,menu);
  console.log('PASS compact header overlays: language/search/drawer exclusion and Escape focus restoration');
 }finally{await act(()=>root.unmount());dom.window.close()}
}finally{await rm(temp,{recursive:true,force:true})}
