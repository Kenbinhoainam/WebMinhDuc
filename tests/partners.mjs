import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {mkdir, rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';

const folder = '.partners-test';
await mkdir(folder, {recursive:true});
await build({entryPoints:['src/PartnersStrip.tsx'], bundle:true, format:'esm', platform:'node', packages:'external', outfile:`${folder}/bundle.mjs`, logLevel:'silent'});
const dom = new JSDOM('<div id="root"></div>', {pretendToBeVisual:true});
for (const key of ['window','document','navigator','HTMLElement','Element','Node','Event']) Object.defineProperty(globalThis,key,{configurable:true,writable:true,value:dom.window[key]});
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
const React=await import('react');
const {createRoot}=await import('react-dom/client');
const {default:PartnersStrip}=await import(pathToFileURL(`${process.cwd()}/${folder}/bundle.mjs`).href);
const root=createRoot(document.getElementById('root'));
try {
 await React.act(async()=>root.render(React.createElement(PartnersStrip)));
 const sets=document.querySelectorAll('.partners-set');
 assert.equal(sets.length,2);
 assert.equal(sets[1].getAttribute('aria-hidden'),'true');
 assert.equal(sets[1].querySelectorAll('a,button,[tabindex]').length,0);
 assert.deepEqual([...sets[0].querySelectorAll('li')].map(li=>li.textContent),['Luxshare ICT','FOXCONN','SAMSUNG','JEILTECH VINA','TACU']);
 assert.equal(sets[0].textContent,sets[1].textContent);
 const button=document.querySelector('.partners-toggle');
 assert.equal(button.getAttribute('aria-pressed'),'false');
 await React.act(async()=>button.click());
 assert.equal(button.getAttribute('aria-pressed'),'true');
 assert.equal(document.querySelector('.partners-strip').dataset.paused,'true');
 await React.act(async()=>button.click());
 assert.equal(button.getAttribute('aria-pressed'),'false');
 console.log('PASS partners: names, hidden duplicate, and persistent pause control');
} finally {
 await React.act(async()=>root.unmount());
 dom.window.close();
 await rm(folder,{recursive:true,force:true});
}
