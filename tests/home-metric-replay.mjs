import assert from 'node:assert/strict';
import {mkdtemp, rm} from 'node:fs/promises';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {build} from 'esbuild';
import React, {act} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {JSDOM} from 'jsdom';

// Deterministic viewport/clock checks, not a claim about visual smoothness.
const temp = await mkdtemp(join(process.cwd(), '.home-metric-replay-'));
try {
  const output = join(temp, 'motion.mjs');
  await build({entryPoints:['src/motion.tsx'],bundle:true,platform:'node',format:'esm',packages:'external',loader:{'.css':'empty'},outfile:output,logLevel:'silent'});
  const {AnimatedNumberGroup, AnimatedNumber} = await import(pathToFileURL(output).href);
  const values = [1200,80,15,95], suffixes = ['+','+','+','%'];
  const metrics = key => React.createElement(AnimatedNumberGroup,{key,'aria-label':'Các chỉ số kết nối'},values.map((value,index)=>React.createElement(AnimatedNumber,{key:value,value,suffix:suffixes[index]})));
  const finalText = ['1.200+','80+','15+','95%'];
  const ssr = new JSDOM(renderToStaticMarkup(metrics('ssr')));
  assert.deepEqual([...ssr.window.document.querySelectorAll('[aria-hidden]')].map(node=>node.textContent),finalText,'SSR presents every final number');
  assert.deepEqual([...ssr.window.document.querySelectorAll('.motion-sr-only')].map(node=>node.textContent),finalText);
  assert.equal(ssr.window.document.querySelector('[aria-live]'),null,'changing visual values are never announced frame by frame');
  ssr.window.close();

  const dom = new JSDOM('<main id="root"></main>',{url:'https://example.test/',pretendToBeVisual:true});
  for (const key of ['window','document','navigator','HTMLElement','Element','Node','Event']) Object.defineProperty(globalThis,key,{value:dom.window[key],configurable:true,writable:true});
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  Object.defineProperty(window,'innerHeight',{value:800,configurable:true,writable:true});
  Object.defineProperty(window,'innerWidth',{value:1440,configurable:true,writable:true});
  let hidden = false;
  Object.defineProperty(document,'hidden',{get:()=>hidden,configurable:true});
  let box = {top:900,bottom:1050,left:20,right:1420,width:1400,height:150};
  window.HTMLElement.prototype.getBoundingClientRect = () => box;
  const listeners = new Set();
  const preference = {matches:false,addEventListener:(_,fn)=>listeners.add(fn),removeEventListener:(_,fn)=>listeners.delete(fn)};
  window.matchMedia = () => preference;
  let frameId = 0;
  const frames = new Map(), observers = [];
  globalThis.requestAnimationFrame = callback => {frames.set(++frameId,callback);return frameId};
  globalThis.cancelAnimationFrame = id => frames.delete(id);
  class Observer {
    constructor(callback,options){this.callback=callback;this.options=options;this.targets=new Set();observers.push(this)}
    observe(target){this.targets.add(target)}
    disconnect(){this.targets.clear()}
    emit(intersects){this.callback([{target:document.querySelector('[data-count-group]'),isIntersecting:intersects,boundingClientRect:box}])}
  }
  globalThis.IntersectionObserver = Observer;
  const {createRoot} = await import('react-dom/client');
  const root = createRoot(document.getElementById('root'));
  const text = () => [...document.querySelectorAll('[data-count-to] > [aria-hidden]')].map(node=>node.textContent);
  const numbers = () => text().map(value=>Number(value.replace(/\D/g,'')));
  const finalA11y = () => assert.deepEqual([...document.querySelectorAll('.motion-sr-only')].map(node=>node.textContent),finalText);
  const pair = () => observers.slice(-2);
  const cross = async (top,height=box.height) => {
    box = {...box,top,bottom:top+height,height};
    await act(async()=>{const [entry,exit]=pair();entry.emit(box.top<792&&box.bottom>8);exit.emit(box.top<808&&box.bottom>-8)});
  };
  const tick = async timestamp => act(async()=>{const callbacks=[...frames.values()];frames.clear();for(const callback of callbacks)callback(timestamp)});
  const visibility = async state => act(async()=>{hidden=state;document.dispatchEvent(new Event('visibilitychange'))});
  const reduce = async state => act(async()=>{preference.matches=state;for(const listener of [...listeners])listener()});
  try {
    await act(async()=>root.render(React.createElement(React.StrictMode,null,metrics('normal'))));
    assert.deepEqual(text(),finalText,'offscreen content keeps final readable numbers rather than sticking at 0+');
    assert.equal(frames.size,0,'offscreen content does no animation work');
    assert.equal(listeners.size,1,'StrictMode leaves only one live preference listener');
    assert.ok(observers.slice(0,-2).every(observer=>observer.targets.size===0));
    assert.ok(pair().every(observer=>observer.targets.size===1&&observer.targets.has(document.querySelector('[data-count-group]'))),'both observers watch the full block, never an individual number');
    await cross(790);assert.deepEqual(numbers(),[0,0,0,0]);assert.equal(frames.size,1,'four counters share one frame callback');
    await tick(0);await tick(120);
    const intermediate = numbers();assert.ok(intermediate.every((value,index)=>value>0&&value<values[index]));
    await cross(801);await cross(805);await cross(790);
    assert.deepEqual(numbers(),intermediate,'near-edge jitter never resets an active pass');
    await tick(160);assert.deepEqual(numbers(),[1050,70,13,83]);finalA11y();
    await tick(319);assert.deepEqual(numbers(),[1199,79,14,94],'none reaches its final integer early');
    await tick(320);assert.deepEqual(text(),finalText);assert.equal(frames.size,0);
    await cross(400);await cross(791);assert.deepEqual(text(),finalText,'remaining in the viewport cannot replay completed counts');

    await cross(-159);assert.deepEqual(text(),finalText,'whole-group exit above re-arms without sticking at 0+');
    await cross(-141);assert.deepEqual(numbers(),[0,0,0,0],'entry from above restarts together');
    await tick(2000);await tick(2120);
    const staleFrame = [...frames.values()][0];
    await cross(809);assert.deepEqual(text(),finalText);assert.equal(frames.size,0,'full exit below cancels an unfinished run and restores final values');
    await cross(790);await act(async()=>staleFrame(9000));assert.deepEqual(numbers(),[0,0,0,0],'a canceled callback cannot advance the new pass');
    await tick(3000);await tick(3200);
    const beforeHidden = numbers();await visibility(true);assert.equal(frames.size,0);
    await visibility(false);await tick(9000);assert.deepEqual(numbers(),beforeHidden,'hidden time is excluded from elapsed duration');
    await tick(9900);assert.deepEqual(text(),finalText);

    window.innerWidth=390;box={...box,left:20,right:370,width:350};
    await cross(820,280);await cross(780,280);await tick(10000);await tick(10300);
    const bothRows = numbers();await cross(-200,280);
    assert.deepEqual(numbers(),bothRows,'first mobile row leaving cannot reset the second row');
    await tick(11100);assert.deepEqual(text(),finalText,'both mobile rows finish on one timeline');
    await cross(-289,280);await cross(-271,280);assert.deepEqual(numbers(),[0,0,0,0]);
    await tick(12000);await tick(12120);await reduce(true);
    assert.deepEqual(text(),finalText);assert.equal(frames.size,0);
    await reduce(false);assert.deepEqual(text(),finalText);assert.equal(frames.size,0,'turning motion back on cannot reset visible values');
    await cross(820,280);await cross(780,280);assert.deepEqual(numbers(),[0,0,0,0],'the next genuine pass animates again');
    await tick(13000);await tick(14100);assert.deepEqual(text(),finalText);finalA11y();

    await reduce(true);await cross(820,280);await cross(780,280);
    assert.deepEqual(text(),finalText);assert.equal(frames.size,0,'reduced motion bypasses replay entirely');
    const staleObservers = pair();
    await act(async()=>root.render(null));assert.equal(listeners.size,0);assert.equal(frames.size,0);
    assert.ok(observers.every(observer=>observer.targets.size===0));
    await act(async()=>staleObservers.forEach(observer=>observer.emit(true)));
    assert.equal(frames.size,0,'unmounted observer callbacks do no work');

    preference.matches=false;
    globalThis.IntersectionObserver=undefined;
    await act(async()=>root.render(metrics('unsupported')));assert.deepEqual(text(),finalText);assert.equal(frames.size,0,'unsupported observation fails open');
    globalThis.IntersectionObserver=class extends Observer {observe(){throw new Error('observer unavailable')}};
    await act(async()=>root.render(metrics('failure')));assert.deepEqual(text(),finalText);assert.equal(frames.size,0,'observer failure restores final values');
    assert.ok(observers.every(observer=>observer.targets.size===0));
    globalThis.IntersectionObserver=Observer;
    window.matchMedia=()=>{throw new Error('preference unavailable')};
    await act(async()=>root.render(metrics('preference-failure')));assert.deepEqual(text(),finalText);assert.equal(frames.size,0,'preference failure restores final values');
    window.matchMedia=()=>({matches:false});
    await act(async()=>root.render(metrics('preference-unsupported')));assert.deepEqual(text(),finalText);assert.equal(frames.size,0,'unsupported preference events leave final values readable');
    console.log('PASS metric replay: shared 320ms timeline, both entry directions, full-block reset, edge jitter, mid-run cancellation, mobile rows, visibility, reduced motion, SSR/a11y, StrictMode and failure/cleanup guards');
  } finally {await act(async()=>root.unmount());dom.window.close()}
} finally {await rm(temp,{recursive:true,force:true})}
