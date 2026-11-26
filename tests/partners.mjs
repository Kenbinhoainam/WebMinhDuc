import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {mkdtemp, readFile, rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';

const folder = await mkdtemp('.partners-test-');
const file = folder + '/bundle.mjs';
await build({stdin:{contents:"export {default as PartnersStrip} from './src/PartnersStrip';export {LocaleProvider} from './src/i18n';",resolveDir:process.cwd(),sourcefile:'partners-entry.tsx'},bundle:true,format:'esm',platform:'node',packages:'external',loader:{'.css':'empty'},outfile:file,logLevel:'silent'});
const dom = new JSDOM('<div id="root"></div>', {pretendToBeVisual:true});
for (const key of ['window','document','navigator','HTMLElement','Element','Node','Event','MutationObserver']) Object.defineProperty(globalThis,key,{configurable:true,writable:true,value:dom.window[key]});
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
const frames = new Map();
let frameId=0, observer, disconnected=false, now=1000, prefChange;
globalThis.requestAnimationFrame=callback=>{frames.set(++frameId,callback);return frameId;};
globalThis.cancelAnimationFrame=id=>frames.delete(id);
const motion={matches:false,addEventListener(_,fn){prefChange=fn;},removeEventListener(){}};
window.matchMedia=()=>motion;
globalThis.IntersectionObserver=class {
 constructor(callback){this.callback=callback;observer=this;}
 observe(target){this.target=target;}
 disconnect(){disconnected=true;}
 emit(isIntersecting){this.callback([{isIntersecting}]);}
};
const {act, createElement:h}=await import('react');
const {createRoot}=await import('react-dom/client');
const {renderToStaticMarkup}=await import('react-dom/server');
const {PartnersStrip,LocaleProvider}=await import(pathToFileURL(process.cwd()+'/'+file).href);
const root=createRoot(document.getElementById('root'));
function advance(ms) {
 now+=ms;
 const pending=[...frames.values()];
 frames.clear();
 pending.forEach(fn=>fn(now));
}
try {
 await act(()=>root.render(h(PartnersStrip)));
 const rail=document.querySelector('.partners-viewport');
 const set=rail.querySelector('.partners-set');
 Object.defineProperty(set,'offsetWidth',{value:960});
 rail.scrollTo=({left})=>{rail.scrollLeft=left;};
 assert.equal(rail.tabIndex,0);
 assert.equal(rail.querySelectorAll('[aria-hidden=true] li').length,5);
 assert.equal(rail.querySelectorAll('ul:not([aria-hidden]) li').length,5);
 assert.deepEqual([...set.children].map(li=>li.textContent),['Luxshare ICT','FOXCONN','SAMSUNG','JEILTECH VINA','TACU']);
 assert.equal(rail.querySelector('button'),null);
 assert.equal(set.querySelectorAll('img').length,5);
 for(const image of set.querySelectorAll('img')) {
  assert.equal(image.alt,'');
  const src=image.getAttribute('src');
  assert.match(src,/^\/partners\/[a-z]+\.(svg|webp)$/);
  if(src.endsWith('.svg'))assert.doesNotMatch(await readFile('public'+src,'utf8'),/<script|<foreignObject|\son\w+=|(?:href|src)=|https?:\/\/(?!www\.w3\.org\/)/i);
 }
 const mark=set.querySelector('img');
 await act(()=>mark.dispatchEvent(new Event('error')));
 assert.equal(set.querySelector('.partner-logo--text').textContent,'Luxshare ICT');
 assert.equal(frames.size,0,'starts only when seen');
 await act(()=>observer.emit(true));advance(16);advance(50);
 assert.ok(rail.scrollLeft>0 && rail.scrollLeft<2,'small continuous movement at 22px/s');
 await act(()=>rail.focus());assert.equal(frames.size,0,'keyboard reader pauses the loop');
 rail.dispatchEvent(new window.KeyboardEvent('keydown',{key:'End',bubbles:true}));assert.equal(rail.scrollLeft,768);
 rail.dispatchEvent(new window.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));assert.equal(rail.scrollLeft,0);
 await act(()=>rail.blur());assert.equal(frames.size,1,'focus departure resumes');
 rail.dispatchEvent(new Event('pointerenter'));assert.equal(frames.size,0);
 rail.dispatchEvent(new Event('pointerleave'));assert.equal(frames.size,1);
 rail.dispatchEvent(new Event('pointerdown'));assert.equal(frames.size,0);
 window.dispatchEvent(new Event('pointerup'));assert.equal(frames.size,1);
 const pointer=(type,x,id=7)=>Object.assign(new Event(type,{bubbles:true}),{pointerId:id,clientX:x,button:0,isPrimary:true});
 rail.scrollLeft=10;
 rail.dispatchEvent(pointer('pointerdown',20));
 rail.dispatchEvent(pointer('pointermove',50));
 assert.equal(rail.scrollLeft,940,'drag right crosses the beginning');
 rail.dispatchEvent(pointer('pointermove',-20));
 assert.equal(rail.scrollLeft,50,'drag left crosses the end');
 window.dispatchEvent(pointer('pointerup',-20));
 assert.equal(rail.dataset.dragging,undefined);
 rail.scrollLeft=954;advance(16);for(let i=0;i<72;i++)advance(32);
 assert.ok(rail.scrollLeft<50,'rotation wraps within the identical copy with no reverse traversal');
 await act(()=>document.getElementById('root').setAttribute('inert',''));assert.equal(frames.size,0);
 await act(()=>document.getElementById('root').removeAttribute('inert'));assert.equal(frames.size,1);
 Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));assert.equal(frames.size,0);
 Object.defineProperty(document,'hidden',{configurable:true,value:false});document.dispatchEvent(new Event('visibilitychange'));assert.equal(frames.size,1);
 await act(()=>observer.emit(false));assert.equal(frames.size,0);
 await act(()=>{motion.matches=true;prefChange();});assert.equal(rail.tabIndex,-1);assert.equal(rail.querySelectorAll('ul').length,1);
 await act(()=>observer.emit(true));assert.equal(frames.size,0);
 await act(()=>root.render(null));assert.ok(disconnected);
 globalThis.IntersectionObserver=class{constructor(){throw Error('unavailable');}};
 await act(()=>root.render(h(PartnersStrip)));assert.equal(document.querySelectorAll('.partners-set').length,1);assert.equal(frames.size,0);
 const labels={vi:'Đối tác tiêu biểu',en:'Featured partners',zh:'精选合作伙伴',ko:'주요 파트너',ja:'主なパートナー'};
 for(const [locale,label] of Object.entries(labels)) {
  const doc=new JSDOM(renderToStaticMarkup(h(LocaleProvider,{value:locale},h(PartnersStrip))));
  assert.equal(doc.window.document.querySelector('[role=region]').getAttribute('aria-label'),label);
  assert.equal(doc.window.document.querySelectorAll('.partners-set li').length,5);
  doc.window.close();
 }
 console.log('PASS partners: semantic names, native browsing, continuous loop, hover/focus/hold/visibility/reduced-motion and static SSR.');
} finally {
 await act(()=>root.unmount());
 dom.window.close();
 await rm(folder,{recursive:true,force:true});
}
