import {build} from 'esbuild';
import {mkdir,rm} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
const temp='.hero-lifecycle-review';
const mode=process.argv[2];
if(!mode){
 await mkdir(temp,{recursive:true});
 try{
  await build({entryPoints:['src/HomeHero.tsx'],bundle:true,platform:'node',format:'esm',packages:'external',loader:{'.css':'empty'},outfile:`${temp}/hero.mjs`,logLevel:'silent'});
  for(const scenario of ['pending','hidden','noio','noio-offscreen','observe-failure','reduced','blocked']){
   const result=spawnSync(process.execPath,[process.argv[1],scenario],{encoding:'utf8',timeout:15000});
   assert.equal(result.status,0,`${scenario}: ${result.stdout}\n${result.stderr}`);process.stdout.write(result.stdout);
  }
 }finally{await rm(temp,{recursive:true,force:true});}
}else{
 const dom=new JSDOM('<div id="root"></div>',{url:'https://example.com/',pretendToBeVisual:true});
 for(const key of ['window','document','navigator','HTMLElement','Element','Node','Event','MutationObserver','requestAnimationFrame','cancelAnimationFrame'])Object.defineProperty(globalThis,key,{value:dom.window[key],configurable:true,writable:true});
 globalThis.IS_REACT_ACT_ENVIRONMENT=true;
 let observer,disconnected=false,hidden=false,paused=true,plays=0;
 const motion={matches:mode==='reduced',addEventListener(){},removeEventListener(){}};window.matchMedia=()=>motion;
 Object.defineProperty(document,'hidden',{configurable:true,get:()=>hidden});
 Object.defineProperty(window.HTMLMediaElement.prototype,'paused',{configurable:true,get:()=>paused});
 window.HTMLMediaElement.prototype.canPlayType=()=> 'probably';
 window.HTMLMediaElement.prototype.play=function(){plays++;if(mode==='blocked')return Promise.reject(Error('autoplay denied'));paused=false;return Promise.resolve()};
 window.HTMLMediaElement.prototype.pause=function(){paused=true;this.dispatchEvent(new Event('pause'))};
 globalThis.IntersectionObserver=mode.startsWith('noio')?undefined:class{constructor(cb){observer=cb}observe(){if(mode==='observe-failure')throw Error('observer unavailable')}disconnect(){disconnected=true}};
 // Geometry is explicit test data, not a JSDOM layout assertion.
 let onScreen=true;
 window.HTMLElement.prototype.getBoundingClientRect=function(){return {top:onScreen?0:-500,bottom:onScreen?360:-140,left:0,right:640,width:640,height:360,x:0,y:0,toJSON(){}}};
 const React=await import('react'),{act}=React,{createRoot}=await import('react-dom/client'),{MemoryRouter}=await import('react-router-dom');
 const {default:Hero}=await import(pathToFileURL(`${process.cwd()}/${temp}/hero.mjs`).href);
 const root=createRoot(document.getElementById('root'));
 const observe=async value=>{onScreen=value;await act(async()=>observer?.([{isIntersecting:value,intersectionRatio:value?1:0}]))};
 try{
  await act(async()=>root.render(React.createElement(MemoryRouter,null,React.createElement(Hero))));
  const video=document.querySelector('video'),stage=document.querySelector('.home-hero'),play=document.querySelector('.video-control'),sound=document.querySelector('.video-sound');
  const fire=async name=>act(async()=>video.dispatchEvent(new Event(name)));
  assert.equal(video.autoplay,false);assert.equal(video.loop,false);assert.equal(video.muted,true);
  if(['noio','noio-offscreen','observe-failure'].includes(mode)){
   assert.equal(stage.dataset.stage,'fallback');assert.equal(plays,0);
   if(observer)await observe(true);assert.equal(plays,0,'failed observer cannot start via stale callback');
   await act(async()=>play.click());await fire('playing');assert.equal(stage.dataset.stage,'playing');
   if(mode==='noio-offscreen'){
    onScreen=false;await act(async()=>window.dispatchEvent(new Event('scroll')));assert.equal(paused,true);const count=plays;
    await fire('ended');assert.equal(stage.dataset.stage,'playing','manual noIO end offscreen defers expansion');
    onScreen=true;await act(async()=>window.dispatchEvent(new Event('scroll')));assert.equal(plays,count,'return after end does not restart');
   }else{paused=true;await fire('ended');}
   assert.equal(stage.dataset.stage,'ended','manual playback without working IO still reaches conclusion');
  }else if(mode==='reduced'){
   await observe(true);assert.equal(plays,0);assert.equal(stage.dataset.stage,'fallback');assert.equal(video.getAttribute('src'),null);
   await act(async()=>play.click());await fire('playing');assert.equal(plays,1);paused=true;await fire('ended');assert.equal(stage.dataset.stage,'ended');
  }else if(mode==='blocked'){
   await observe(true);assert.equal(stage.dataset.stage,'fallback');assert.equal(document.querySelectorAll('.hero-brand-finish a').length,2);
  }else{
   await observe(true);await fire('playing');assert.equal(plays,1);video.currentTime=131;
   if(mode==='pending')await observe(false);else{hidden=true;await act(async()=>document.dispatchEvent(new Event('visibilitychange')))}
   paused=true;await fire('ended');assert.equal(stage.dataset.stage,'playing','late offscreen/tab-hidden end does not expand page');
   const count=plays;await act(async()=>sound.focus());
   if(mode==='pending')await observe(true);else{hidden=false;await act(async()=>document.dispatchEvent(new Event('visibilitychange')))}
   assert.equal(stage.dataset.stage,'ended');assert.equal(plays,count,'return reveals conclusion without restarting');assert.equal(document.activeElement,sound);
   await act(async()=>play.click());assert.equal(video.currentTime,0);await fire('playing');assert.equal(stage.dataset.stage,'playing');
  }
  console.log(`PASS independent hero lifecycle ${mode}`);
 }finally{await act(async()=>root.unmount());if(!mode.startsWith('noio'))assert.ok(disconnected);dom.window.close();}
}
