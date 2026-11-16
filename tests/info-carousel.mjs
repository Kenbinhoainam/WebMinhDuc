import {build} from 'esbuild';
import {rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
const bundle=process.cwd()+'/.info-carousel-test.mjs';
await build({stdin:{contents:"export {ServicePage} from './src/InfoPages';",resolveDir:process.cwd(),sourcefile:'info-carousel-entry.tsx'},bundle:true,platform:'node',format:'esm',outfile:bundle,packages:'external',loader:{'.css':'empty'},logLevel:'silent'});
try{
 const dom=new JSDOM('<div id="root"></div>',{url:'http://localhost/',pretendToBeVisual:true});
 for(const key of ['window','document','navigator','HTMLElement','Element','Node','Event','MutationObserver','localStorage','requestAnimationFrame','cancelAnimationFrame'])Object.defineProperty(globalThis,key,{configurable:true,writable:true,value:dom.window[key]});
 globalThis.IS_REACT_ACT_ENVIRONMENT=true;window.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
 const observers=[];globalThis.IntersectionObserver=class{constructor(cb){this.cb=cb;observers.push(this)}observe(el){this.target=el}disconnect(){}};
 let timers=0;window.setInterval=()=>{timers++;return timers};window.clearInterval=()=>{};
 const React=await import('react');const {act}=React;const {createRoot}=await import('react-dom/client');const {MemoryRouter,Routes,Route}=await import('react-router-dom');const {ServicePage}=await import(pathToFileURL(bundle).href);const root=createRoot(document.getElementById('root'));
 await act(()=>root.render(React.createElement(MemoryRouter,{initialEntries:['/services/labor-supply']},React.createElement(Routes,null,React.createElement(Route,{path:'/services/:slug',element:React.createElement(ServicePage)})))));
 const pause=[...document.querySelectorAll('.info-carousel-pause')];assert.equal(pause.length,2);const own=observers.filter(o=>o.target?.matches('.info-service-customers,.info-service-rail'));assert.equal(own.length,2);await act(()=>own.forEach(o=>o.cb([{isIntersecting:true}])));assert.equal(timers,2,'both rails start only when visible');
 await act(()=>pause[0].click());assert.equal(pause[0].getAttribute('aria-pressed'),'true');assert.equal(pause[1].getAttribute('aria-pressed'),'false');
 await act(()=>root.unmount());dom.window.close();console.log('PASS service carousel integration');
}finally{await rm(bundle,{force:true})}
