import {build} from 'esbuild';
import {mkdir,rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';

// Simulate observable viewport crossings. These checks do not establish visual smoothness.
const temp='.motion-repeat-review';await mkdir(temp,{recursive:true});
try {
 await build({entryPoints:['src/motion.tsx'],bundle:true,platform:'node',format:'esm',packages:'external',loader:{'.css':'empty'},outfile:`${temp}/motion.mjs`,logLevel:'silent'});
 const dom=new JSDOM('<main><div id="edge" data-reveal></div><div id="form" data-reveal><div id="inner" data-reveal><input></div></div><button id="outside">Outside</button></main>',{pretendToBeVisual:true});
 for(const key of ['window','document','HTMLElement','Element','Node','MutationObserver','Event'])Object.defineProperty(globalThis,key,{value:dom.window[key],configurable:true,writable:true});
 Object.defineProperty(window,'innerHeight',{value:800,configurable:true,writable:true});Object.defineProperty(window,'innerWidth',{value:1200,configurable:true});
 const listeners=new Set();const preference={matches:false,addEventListener:(_,fn)=>listeners.add(fn),removeEventListener:(_,fn)=>listeners.delete(fn)};window.matchMedia=()=>preference;
 const instances=[];const positions=new Map();
 const geometry=(element,top,left=100)=>{
  positions.set(element,{top,left});
  element.getBoundingClientRect=()=>{const p=positions.get(element);return {top:p.top,bottom:p.top+200,left:p.left,right:p.left+300,x:p.left,y:p.top,width:300,height:200}};
 };
 class Observer {
  constructor(callback,options){this.callback=callback;this.targets=new Set();assert.doesNotMatch(options.rootMargin,/%/,'thresholds use viewport-height pixels');const bottom=Number.parseFloat(options.rootMargin.split(/\s+/)[2]);this.line=window.innerHeight+bottom;this.bounds={top:0,bottom:this.line,left:0,right:1200,width:1200,height:this.line};instances.push(this)}
  observe(target){this.targets.add(target)}unobserve(target){this.targets.delete(target)}disconnect(){this.targets.clear()}
  emit(target,intersects){const box=target.getBoundingClientRect();this.callback([{target,boundingClientRect:box,rootBounds:this.bounds,isIntersecting:intersects??(box.top<this.line&&box.bottom>0&&box.right>0&&box.left<1200)}])}
 }
 globalThis.IntersectionObserver=Observer;
 const edge=document.getElementById('edge'),form=document.getElementById('form'),inner=document.getElementById('inner');
 geometry(edge,790);geometry(form,100);geometry(inner,100);
 const {startReveals}=await import(pathToFileURL(`${process.cwd()}/${temp}/motion.mjs`).href);const stop=startReveals();
 const pair=()=>instances.slice(-2).sort((a,b)=>a.line-b.line);
 const send=(element,intersects)=>pair().forEach(observer=>observer.emit(element,intersects));
 const pending=element=>element.classList.contains('motion-pending');
 try {
  let [entry,reset]=pair();assert.ok(entry.line<reset.line&&reset.line<800);assert.ok(reset.line-entry.line>=48,'hysteresis exceeds the reveal displacement');
  send(edge);assert.equal(pending(edge),false,'initial bottom-edge content must not flash hidden');
  geometry(edge,entry.line-1);send(edge);geometry(edge,reset.line+1);send(edge);
  assert.ok(edge.getBoundingClientRect().top<window.innerHeight,'reverse fade begins before the element fully leaves the viewport');assert.equal(pending(edge),true);
  geometry(edge,entry.line+1);send(edge);assert.equal(pending(edge),true,'the gap between thresholds prevents immediate re-show feedback');
  geometry(edge,entry.line-1);send(edge);assert.equal(pending(edge),false,'scrolling back down reveals again');
  geometry(edge,-250);send(edge);assert.equal(pending(edge),false,'leaving the viewport through its top does not hide content');
  geometry(edge,100);send(edge,false);assert.equal(pending(edge),false,'ancestor horizontal clipping alone does not reset content');
  geometry(edge,reset.line+1,1250);send(edge,false);assert.equal(pending(edge),false,'fully horizontal offscreen cards are not reset');
  send(form);send(inner);document.querySelector('input').focus();document.getElementById('outside').focus();
  geometry(form,reset.line+1);geometry(inner,reset.line+1);send(form);send(inner);
  assert.equal(pending(form),false);assert.equal(pending(inner),false,'form interaction permanently protects all marked ancestors');

  geometry(edge,700);send(edge,true);const oldReset=reset;window.innerHeight=600;window.dispatchEvent(new Event('resize'));await new Promise(resolve=>setTimeout(resolve,140));
  [entry,reset]=pair();assert.ok(reset.line<600);send(edge);assert.equal(pending(edge),false,'resize baseline preserves visible content');
  const late=document.createElement('div');late.setAttribute('data-reveal','media');geometry(late,900);document.querySelector('main').append(late);await new Promise(resolve=>setTimeout(resolve,0));
  assert.equal(pending(late),true,'content inserted after resize still starts pending below the viewport');
  geometry(late,entry.line-1);send(late);assert.equal(pending(late),false,'late content participates in entrance');
  geometry(late,reset.line+1);send(late);assert.equal(pending(late),true,'late content also reverses at the lower line');
  geometry(edge,oldReset.line+1);oldReset.emit(edge,false);assert.equal(pending(edge),false,'stale pre-resize observer cannot conceal content');
  preference.matches=true;for(const listener of [...listeners])listener();
  assert.ok([...document.querySelectorAll('[data-reveal]')].every(element=>!pending(element)),'reduced motion restores every pending block');
  reset.emit(late,false);assert.equal(pending(late),false,'disconnected observer cannot undo reduced motion');
  stop();assert.equal(listeners.size,0);assert.ok(instances.every(observer=>observer.targets.size===0));
  console.log('PASS independent repeat motion: visible lower reset/reentry, hysteresis, top/horizontal exceptions, focused forms, resize baseline, late insertion and stale-callback safety');
 }finally{stop();dom.window.close()}
}finally{await rm(temp,{recursive:true,force:true})}
