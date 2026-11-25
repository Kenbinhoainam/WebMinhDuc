import {build} from 'esbuild';
import {mkdir,rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import React,{act} from 'react';
import {createRoot} from 'react-dom/client';
import {MemoryRouter} from 'react-router-dom';
const temp='.support-tools-test';
await mkdir(temp,{recursive:true});
try {
 await build({stdin:{contents:"export {SupportTools} from './src/SupportTools'; export {LocaleProvider} from './src/i18n';",resolveDir:process.cwd(),sourcefile:'support-test.tsx'},bundle:true,platform:'node',format:'esm',outfile:`${temp}/bundle.mjs`,packages:'external',loader:{'.css':'empty'},logLevel:'silent'});
 const {SupportTools,LocaleProvider}=await import(pathToFileURL(`${process.cwd()}/${temp}/bundle.mjs`).href);
 const dom=new JSDOM('<div id="root"></div><button id="outside">outside</button>',{url:'https://example.com',pretendToBeVisual:true});
 for(const key of ['window','document','navigator','HTMLElement','Element','Node','Event','MouseEvent','KeyboardEvent','CustomEvent']) Object.defineProperty(globalThis,key,{configurable:true,writable:true,value:dom.window[key]});
 globalThis.IS_REACT_ACT_ENVIRONMENT=true;
 const root=createRoot(document.getElementById('root'));let consulted=0;
 await act(async()=>root.render(React.createElement(LocaleProvider,{value:'en'},React.createElement(MemoryRouter,null,React.createElement(SupportTools,{onConsultation:()=>consulted++})))));
 const trigger=document.querySelector('.support-launcher');assert.equal(document.querySelectorAll('.support-tools > button').length,1);assert.equal(trigger.getAttribute('aria-label'),'Open support');
 await act(async()=>trigger.click());assert.equal(trigger.getAttribute('aria-expanded'),'true');assert.equal(document.querySelectorAll('.support-panel a').length,3);assert.equal(document.querySelectorAll('.support-panel button').length,2);assert.equal(document.activeElement,document.querySelector('.support-panel a'),'opening places keyboard focus on first action');
 await act(async()=>{document.querySelector('.support-panel a').focus();document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));});assert.equal(trigger.getAttribute('aria-expanded'),'false');assert.equal(document.activeElement,trigger);
 await act(async()=>trigger.click());await act(async()=>document.getElementById('outside').dispatchEvent(new Event('pointerdown',{bubbles:true})));assert.equal(trigger.getAttribute('aria-expanded'),'false');
 await act(async()=>trigger.click());await act(async()=>document.dispatchEvent(new CustomEvent('header-overlay-open',{detail:{owner:'navigation'}})));assert.equal(trigger.getAttribute('aria-expanded'),'false');
 await act(async()=>trigger.click());await act(async()=>document.querySelector('.support-panel button').click());assert.equal(consulted,1);assert.equal(document.activeElement,trigger);
 await act(async()=>root.unmount());dom.window.close();console.log('PASS support launcher interactions');
} finally {await rm(temp,{recursive:true,force:true});}
