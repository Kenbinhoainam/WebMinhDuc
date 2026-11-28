import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';

const temp=await mkdtemp('.s2-w2-extra-hero-');
try {
 await build({stdin:{contents:"export {default as HomeHero} from './src/HomeHero';export {LocaleProvider} from './src/i18n';export {loadLocale} from './src/i18n-runtime/catalog';",resolveDir:process.cwd(),sourcefile:'s2-w2-extra-hero.tsx'},bundle:true,platform:'node',format:'esm',packages:'external',loader:{'.css':'empty'},outfile:temp+'/hero.mjs',logLevel:'silent'});
 const dom=new JSDOM('<div id="root"></div>',{url:'https://fixture.invalid/',pretendToBeVisual:true});
 for(const key of ['window','document','navigator','Element','HTMLElement','Node','Event','MutationObserver','requestAnimationFrame','cancelAnimationFrame'])Object.defineProperty(globalThis,key,{value:dom.window[key],configurable:true});
 globalThis.IS_REACT_ACT_ENVIRONMENT=true;
 window.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
 Object.defineProperty(document,'hidden',{value:false,configurable:true});
 let callback,paused=true,ended=false,codec='dual',attempts=[];
 globalThis.IntersectionObserver=class{constructor(fn){callback=fn;}observe(){}disconnect(){}};
 window.HTMLElement.prototype.getBoundingClientRect=()=>({top:0,bottom:400,left:0,right:700,width:700,height:400});
 Object.defineProperties(window.HTMLMediaElement.prototype,{paused:{configurable:true,get:()=>paused},ended:{configurable:true,get:()=>ended}});
 window.HTMLMediaElement.prototype.canPlayType=type=>codec==='webm-only'&&type==='video/mp4'?'':'probably';
 window.HTMLMediaElement.prototype.pause=function(){paused=true;this.dispatchEvent(new Event('pause'));};
 window.HTMLMediaElement.prototype.play=function(){paused=false;return new Promise((resolve,reject)=>attempts.push({resolve,reject,src:this.getAttribute('src')}));};
 const React=await import('react');const {act,createElement:h}=React;
 const {createRoot}=await import('react-dom/client');const {MemoryRouter,useLocation}=await import('react-router-dom');
 const mod=await import(pathToFileURL(process.cwd()+'/'+temp+'/hero.mjs').href);
 let route;function Route(){route=useLocation();return null;}
 const root=createRoot(document.getElementById('root'));
 const q=selector=>{const node=document.querySelector(selector);assert.ok(node,selector);return node;};
 const click=node=>act(()=>node.click());
 const event=name=>act(()=>q('video').dispatchEvent(new Event(name)));
 let mounted=false;
 for(const locale of ['vi','en','zh','ko','ja'])for(const type of ['dual','webm-only']) {
  if(mounted)await act(()=>root.render(null));
  paused=true;ended=false;codec=type;attempts=[];await mod.loadLocale(locale);
  await act(()=>root.render(h(mod.LocaleProvider,{value:locale},h(MemoryRouter,{key:locale+type},h(mod.HomeHero),h(Route)))));mounted=true;
  const video=q('video'),stage=q('.home-hero'),play=q('.video-control');
  assert.equal(video.hasAttribute('src'),false);assert.equal(video.muted,true);
  await act(()=>callback([{isIntersecting:true}]));assert.equal(attempts.length,1);
  assert.ok(attempts[0].src.endsWith(type==='dual'?'.mp4':'.webm'));
  await act(()=>q('.hero-entry-bar a').focus());
  if(type==='dual') {
   paused=true;await event('error');assert.equal(attempts.length,2);assert.ok(attempts[1].src.endsWith('.webm'));
   await act(async()=>{attempts[0].reject(Error('old MP4 play rejection'));await Promise.resolve();});
   assert.notEqual(stage.dataset.stage,'fallback','Old codec promise cannot overwrite newer playback attempt');
   await event('playing');assert.equal(stage.dataset.stage,'playing');
  }
  paused=true;await event('error');assert.equal(stage.dataset.stage,'fallback');
  const cards=[...document.querySelectorAll('.hero-brand-finish .hero-actions a')];
  assert.deepEqual(cards.map(a=>a.getAttribute('href')),['/#business-contact','/jobs']);
  assert.equal(document.querySelector('.hero-entry-bar'),null);assert.equal(document.activeElement,cards[0]);
  assert.ok(q('.hero-poster').getAttribute('src'));assert.equal(video.classList.contains('is-ready'),false);
  const count=attempts.length;
  await act(()=>{q('.video-sound').click();q('.video-sound').click();});assert.equal(video.muted,true);assert.equal(attempts.length,count);
  await click(cards[0]);assert.equal(route.hash,'#business-contact');assert.equal(attempts.length,count);
  await click(cards[1]);assert.equal(route.pathname,'/jobs');assert.equal(attempts.length,count);
  video.currentTime=42;
  await act(()=>{play.click();play.click();});
  assert.equal(stage.dataset.stage,'paused');assert.equal(paused,true);assert.equal(video.currentTime,42);
  assert.equal(attempts.length,count+1);
  await act(async()=>{attempts.at(-1).reject(Error('canceled retry'));await Promise.resolve();});
  assert.equal(stage.dataset.stage,'paused','Canceled retry rejection cannot undo user pause');
  await click(play);assert.equal(attempts.length,count+2);
  await act(async()=>{attempts.at(-1).resolve();await Promise.resolve();});await event('playing');
  assert.equal(stage.dataset.stage,'playing');assert.equal(video.currentTime,42);
  ended=true;paused=true;await event('ended');assert.equal(stage.dataset.stage,'ended');
  await event('error');assert.equal(stage.dataset.stage,'ended','Late error cannot remove completed end card');
  ended=false;await click(play);assert.equal(video.currentTime,0);await event('playing');assert.equal(stage.dataset.stage,'playing');
  await act(()=>root.render(null));mounted=false;
  await act(async()=>{for(const attempt of attempts)attempt.reject(Error('late unmounted rejection'));callback([{isIntersecting:true}]);await Promise.resolve();});
  assert.equal(attempts.length,count+3,'Stale observer callback after unmount cannot restart playback');
  console.log('PASS W2-EXTRA-HERO '+locale+'/'+type+': sequential codec fallback, terminal error preserves CTA/focus/poster, rapid retry/pause, stale rejection, explicit replay and unmount cleanup.');
 }
 await act(()=>root.unmount());dom.window.close();
 console.log('PASS W2-EXTRA-HERO simulated media promises/events; no real decoder/network/performance/browser claim.');
} finally {await rm(temp,{recursive:true,force:true});}
