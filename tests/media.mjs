import {outputPath} from './pages-paths.mjs';
import {build} from 'esbuild';
import {mkdir,rm,readFile,access} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
const temp='.media-test';
if(!process.argv.includes('--case')){
 await mkdir(temp,{recursive:true});
 try{
  await build({entryPoints:['src/HomeHero.tsx'],bundle:true,platform:'node',format:'esm',outfile:`${temp}/hero.mjs`,packages:'external',loader:{'.css':'empty'},logLevel:'silent'});
  const assets=JSON.parse(await readFile('src/hero-assets.json','utf8'));for(const path of Object.values(assets))await access('public'+outputPath(path));
  for(const mode of ['desktop','mobile','reduced','data','slow','blocked','race','endrace','preference','observer','observer-observe','error','error-offscreen','error-paused','webm']){
   const result=spawnSync(process.execPath,[process.argv[1],'--case',mode],{encoding:'utf8',timeout:10000});assert.equal(result.status,0,`${mode}: ${result.stdout}\n${result.stderr}`);process.stdout.write(result.stdout);
  }
 } finally {await rm(temp,{recursive:true,force:true});}
}else{
 const mode=process.argv[process.argv.indexOf('--case')+1];
 const dom=new JSDOM('<div id="root"></div>',{url:'https://example.com/',pretendToBeVisual:true}),{window}=dom;
 for(const key of ['window','document','navigator','HTMLElement','Element','Node','Event','MutationObserver','requestAnimationFrame','cancelAnimationFrame'])Object.defineProperty(globalThis,key,{configurable:true,writable:true,value:window[key]});
 const listeners={};const motion={matches:mode==='reduced',addEventListener(_,cb){listeners.motion=cb},removeEventListener(_,cb){if(listeners.motion===cb)delete listeners.motion}};
 const connection={saveData:mode==='data',effectiveType:mode==='slow'?'2g':'4g',addEventListener(_,cb){listeners.connection=cb},removeEventListener(_,cb){if(listeners.connection===cb)delete listeners.connection}};
 Object.defineProperty(window.navigator,'connection',{value:connection});window.matchMedia=()=>motion;
 let callback,disconnected=false;globalThis.IntersectionObserver=class{constructor(cb){if(mode==='observer')throw Error('unavailable');callback=cb}observe(){if(mode==='observer-observe')throw Error('observe failure')}disconnect(){disconnected=true}};
 let paused=true,plays=0,rejectFirst,hidden=false;
 Object.defineProperty(document,'hidden',{configurable:true,get(){return hidden}});
 Object.defineProperty(window.HTMLMediaElement.prototype,'paused',{configurable:true,get(){return paused}});
 window.HTMLMediaElement.prototype.canPlayType=function(type){return mode==='webm'&&type==='video/mp4'?'':'probably'};
 window.HTMLMediaElement.prototype.play=function(){plays++;if(mode==='blocked')return Promise.reject(Error('blocked'));paused=false;if((mode==='race'||mode==='endrace')&&plays===1)return new Promise((_,reject)=>{rejectFirst=reject});return Promise.resolve()};
 window.HTMLMediaElement.prototype.pause=function(){paused=true;this.dispatchEvent(new Event('pause'))};
 globalThis.IS_REACT_ACT_ENVIRONMENT=true;
 const React=await import('react'),{act}=React,{createRoot}=await import('react-dom/client'),{MemoryRouter}=await import('react-router-dom'),{default:Hero}=await import(pathToFileURL(`${process.cwd()}/${temp}/hero.mjs`).href);
 const root=createRoot(document.getElementById('root'));
 const observe=value=>act(async()=>callback([{isIntersecting:value}]));
 try{
  await act(async()=>root.render(React.createElement(MemoryRouter,null,React.createElement(Hero))));
  const video=document.querySelector('video'),button=document.querySelector('.video-control'),brand=document.querySelector('.hero-brand-finish'),stage=document.querySelector('.home-hero');
  const click=()=>act(async()=>button.click()),fire=type=>act(async()=>video.dispatchEvent(new Event(type)));
  assert.equal(video.getAttribute('src'),null,'no src before visibility/consent');assert.equal(video.hasAttribute('loop'),false);
  if(['observer','observer-observe'].includes(mode)){
   if(callback)await observe(true);assert.equal(video.getAttribute('src'),null,'observer failure remains static despite stale callback');assert.equal(stage.dataset.stage,'fallback');await click();assert.equal(plays,1,'manual play remains possible');
  }else if(['reduced','data','slow'].includes(mode)){
   assert.equal(stage.dataset.decorativeImages,mode==='reduced'?'true':'false','data-saving mode skips architecture even when the end card is visible');
   await observe(true);assert.equal(plays,0);assert.equal(video.getAttribute('src'),null);assert.equal(stage.dataset.stage,'fallback');await click();assert.equal(plays,1,'explicit manual playback bypasses initial preference');
  }else if(mode==='blocked'){
   await observe(true);assert.equal(plays,1);assert.equal(stage.dataset.stage,'fallback');assert.ok(brand.classList.contains('is-visible'));assert(!video.classList.contains('is-ready'));
  }else if(mode==='race'){
   await observe(true);await click();await click();assert.equal(plays,2);await act(async()=>rejectFirst(Error('stale')));assert.notEqual(stage.dataset.stage,'fallback','old rejection does not override new playback');
  }else if(mode==='endrace'){
   await observe(true);paused=true;await fire('ended');await act(async()=>rejectFirst(Error('late end rejection')));assert.equal(stage.dataset.stage,'ended','late rejected promise cannot replace end card');
  }else if(mode==='preference'){
   await observe(true);await act(async()=>{motion.matches=true;listeners.motion()});assert.equal(paused,true);assert.equal(stage.dataset.stage,'fallback');await act(async()=>{motion.matches=false;listeners.motion()});assert.equal(plays,1,'preference change does not override pause');
  }else if(mode==='error'){
   await observe(true);assert.match(video.getAttribute('src'),/\.mp4$/);await fire('error');assert.match(video.getAttribute('src'),/\.webm$/);assert.equal(plays,2,'one alternate attempted');await fire('error');assert.equal(stage.dataset.stage,'fallback');assert.equal(plays,2);assert.ok(brand.classList.contains('is-visible'));
  }else if(mode==='error-offscreen'||mode==='error-paused'){
   await observe(true);if(mode==='error-offscreen')await observe(false);else await click();await fire('error');assert.match(video.getAttribute('src'),/\.webm$/);assert.equal(plays,1,'codec change while paused does not start playback');assert.equal(video.hasAttribute('autoplay'),false,'native autoplay cannot bypass playback gating');
  }else if(mode==='webm'){
   await observe(true);assert.match(video.getAttribute('src'),/\.webm$/,'codec support selects one compatible source');
  }else{
   await observe(true);assert.equal(plays,1,'visible eligible film starts immediately');assert.match(video.getAttribute('src'),/\.mp4$/);
   await fire('playing');assert(video.classList.contains('is-ready'));assert.equal(button.getAttribute('aria-label'),'Tạm dừng video');
   await fire('waiting');assert(video.classList.contains('is-ready'),'buffering retains last frame');
   video.currentTime=63;await observe(false);assert.equal(paused,true);assert.equal(video.currentTime,63,'offscreen pause preserves playback position');assert(video.classList.contains('is-ready'),'offscreen pause retains frame');await observe(true);assert.equal(plays,2);assert.equal(video.currentTime,63,'resume preserves playback position');
   hidden=true;await act(async()=>document.dispatchEvent(new Event('visibilitychange')));assert.equal(paused,true);hidden=false;await act(async()=>document.dispatchEvent(new Event('visibilitychange')));assert.equal(plays,3);
   await click();assert.equal(paused,true);await observe(false);await observe(true);assert.equal(plays,3,'manual pause survives visibility changes');
   await click();await fire('playing');video.currentTime=132;const sound=document.querySelector('.video-sound');await act(async()=>sound.focus());paused=true;await fire('ended');assert.equal(document.activeElement,sound,'ending preserves focus on sound control');assert.equal(stage.dataset.stage,'ended');assert.ok(brand.classList.contains('is-visible'));assert.equal(button.getAttribute('aria-label'),'Xem lại video');assert.equal(brand.querySelectorAll('a').length,2,'both CTAs are in the end card');await act(async()=>brand.querySelector('a').focus());assert.equal(document.activeElement,brand.querySelector('a'),'end CTA accepts keyboard focus');await act(async()=>button.focus());
   await observe(false);await observe(true);assert.equal(plays,4,'ended never autoplays');await click();assert.equal(video.currentTime,0,'replay starts from beginning');assert.equal(plays,5);await fire('playing');assert.equal(stage.dataset.stage,'playing');assert.ok(!brand.classList.contains('is-visible'));
  }
  console.log(`PASS media ${mode}`);
 }finally{await act(async()=>root.unmount());assert.deepEqual(Object.keys(listeners),[],'listeners cleaned');if(mode!=='observer')assert(disconnected,'observer disconnected');dom.window.close()}
}
