import {build} from 'esbuild';
import {mkdtemp,rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {JSDOM} from 'jsdom';
import assert from 'node:assert/strict';
const dir=await mkdtemp('.careers-carousel-test-');
try {
 await build({stdin:{contents:"export {default as CareersSections} from './src/CareersSections';",resolveDir:process.cwd(),sourcefile:'entry.tsx'},bundle:true,platform:'node',format:'esm',outfile:`${dir}/bundle.mjs`,packages:'external',loader:{'.css':'empty'},logLevel:'silent'});
 const dom=new JSDOM('<div id="root"></div>',{url:'https://example.test/careers',pretendToBeVisual:true});
 for(const key of ['window','document','navigator','HTMLElement','Element','Node','Event','MutationObserver','requestAnimationFrame','cancelAnimationFrame'])Object.defineProperty(globalThis,key,{value:dom.window[key],configurable:true});
 globalThis.IS_REACT_ACT_ENVIRONMENT=true;window.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
 const timers=new Map(),observers=[];let nextId=0;window.setInterval=(fn,ms)=>{assert.equal(ms,3500);timers.set(++nextId,fn);return nextId};window.clearInterval=id=>timers.delete(id);
 globalThis.IntersectionObserver=class{constructor(cb){this.cb=cb;observers.push(this)}observe(){}disconnect(){}};
 const React=await import('react');const {act}=React;const {createRoot}=await import('react-dom/client');const {MemoryRouter}=await import('react-router-dom');const {CareersSections}=await import(pathToFileURL(`${process.cwd()}/${dir}/bundle.mjs`));
 const root=createRoot(document.getElementById('root'));await act(()=>root.render(React.createElement(MemoryRouter,null,React.createElement(CareersSections,{openings:React.createElement('p',null,'Openings')}))));
 assert.equal(observers.length,3);await act(()=>observers.forEach(observer=>observer.cb([{isIntersecting:true}])));assert.equal(timers.size,3,'three visible rails use shared autoplay');
 const first=document.querySelector('.career-rail');assert.equal(first.children.length,3,'workspace rail has three unique cards');assert.equal(document.querySelector('.career-story-grid').children.length,3,'story rail has three unique cards');
 Object.defineProperties(first,{scrollWidth:{value:900},clientWidth:{value:320}});Object.defineProperty(first.children[1],'offsetLeft',{value:280});let frame;Object.defineProperty(globalThis,'requestAnimationFrame',{configurable:true,value:fn=>{frame=fn;return 1}});Object.defineProperty(globalThis,'cancelAnimationFrame',{configurable:true,value:()=>{}});await act(()=>timers.values().next().value());assert.equal(typeof frame,'function');await act(()=>frame(performance.now()+600));assert.equal(first.scrollLeft,280,'mobile overflow advances one card');
 await act(()=>first.dispatchEvent(new Event('mouseenter')));assert.equal(timers.size,2,'hover pauses only active rail');await act(()=>first.dispatchEvent(new Event('mouseleave')));assert.equal(timers.size,3);
 const toggle=document.querySelector('.career-rail-section .career-carousel-pause');await act(()=>toggle.focus());await act(()=>toggle.click());assert.equal(timers.size,2);assert.equal(toggle.getAttribute('aria-pressed'),'true');await act(()=>toggle.click());await act(()=>observers.at(-1).cb([{isIntersecting:true}]));assert.equal(timers.size,3,'play resumes while pause control retains focus');
 await act(()=>observers[2].cb([{isIntersecting:false}]));assert.equal(timers.size,2,'offscreen story rail pauses');await act(()=>root.unmount());assert.equal(timers.size,0);dom.window.close();console.log('PASS careers rails share autoplay, pause and cleanup');
}finally{await rm(dir,{recursive:true,force:true})}
