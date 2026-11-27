import {build} from 'esbuild';
import {mkdir,readFile,rm} from 'node:fs/promises';
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
  for(const scenario of ['manual','scroll','scroll-away','scroll-before-start','pending','hidden','noio','noio-offscreen','observe-failure','reduced','blocked']){
   const result=spawnSync(process.execPath,[process.argv[1],scenario],{encoding:'utf8',timeout:15000});
   assert.equal(result.status,0,`${scenario}: ${result.stdout}\n${result.stderr}`);process.stdout.write(result.stdout);
  }
 }finally{await rm(temp,{recursive:true,force:true});}
}else{
 const dom=new JSDOM('<div id="root"></div>',{url:'https://example.com/',pretendToBeVisual:true});
 for(const key of ['window','document','navigator','HTMLElement','Element','Node','Event','MutationObserver','requestAnimationFrame','cancelAnimationFrame'])Object.defineProperty(globalThis,key,{value:dom.window[key],configurable:true,writable:true});
 globalThis.IS_REACT_ACT_ENVIRONMENT=true;
 let observer,observedTarget,disconnected=false,hidden=false,paused=true,plays=0,denyPlayback=mode==='blocked';
 const motion={matches:mode==='reduced',addEventListener(){},removeEventListener(){}};window.matchMedia=()=>motion;
 Object.defineProperty(document,'hidden',{configurable:true,get:()=>hidden});
 Object.defineProperty(window.HTMLMediaElement.prototype,'paused',{configurable:true,get:()=>paused});
 window.HTMLMediaElement.prototype.canPlayType=()=> 'probably';
 window.HTMLMediaElement.prototype.play=function(){plays++;if(denyPlayback)return Promise.reject(Error('autoplay denied'));paused=false;return Promise.resolve()};
 window.HTMLMediaElement.prototype.pause=function(){paused=true;this.dispatchEvent(new Event('pause'))};
 globalThis.IntersectionObserver=mode.startsWith('noio')?undefined:class{constructor(cb){observer=cb}observe(target){observedTarget=target;if(mode==='observe-failure')throw Error('observer unavailable')}disconnect(){disconnected=true}};
 // Geometry is explicit test data, not a JSDOM layout assertion.
 let onScreen=true;
 window.HTMLElement.prototype.getBoundingClientRect=function(){return {top:onScreen?0:-500,bottom:onScreen?360:-140,left:0,right:640,width:640,height:360,x:0,y:0,toJSON(){}}};
 const React=await import('react'),{act}=React,{createRoot}=await import('react-dom/client'),{MemoryRouter,useLocation}=await import('react-router-dom');
 const {default:Hero}=await import(pathToFileURL(`${process.cwd()}/${temp}/hero.mjs`).href);
 function CurrentRoute(){
  const {pathname,hash}=useLocation();
  return React.createElement('output',{id:'current-route'},pathname+hash);
 }
 const root=createRoot(document.getElementById('root'));
 const observe=async value=>{onScreen=value;await act(async()=>observer?.([{isIntersecting:value,intersectionRatio:value?1:0}]))};
 try{
  await act(async()=>root.render(React.createElement(MemoryRouter,null,React.createElement(Hero),React.createElement(CurrentRoute))));
  const video=document.querySelector('video'),stage=document.querySelector('.home-hero'),play=document.querySelector('.video-control'),sound=document.querySelector('.video-sound');
  const surface=stage.querySelector('.hero-stage'),brand=stage.querySelector('.hero-brand-finish');
  const click=async element=>act(async()=>element.click());
  const fire=async name=>act(async()=>video.dispatchEvent(new Event(name)));
  const scrollToY=async y=>{
   window.scrollY=y;
   await act(async()=>window.dispatchEvent(new Event('scroll')));
  };
  assert.equal(video.autoplay,false);assert.equal(video.loop,false);assert.equal(video.muted,true);
  if(mode==='manual'){
   const style=document.createElement('style');
   style.textContent=await readFile('src/hero-media.css','utf8');
   document.head.append(style);
   await observe(true);await fire('playing');
   assert.equal(play.tabIndex,0,'keyboard users can activate the visible playback control');
   assert.equal(window.getComputedStyle(brand).display,'none','the hidden end-card links sit outside the tab order');
   assert.ok(sound.compareDocumentPosition(brand) & Node.DOCUMENT_POSITION_FOLLOWING,'keyboard traversal reaches the choices after the two player controls');
   video.currentTime=37.5;
   await click(video);
   assert.equal(paused,true);
   assert.equal(stage.dataset.stage,'paused');
   assert.equal(play.getAttribute('aria-label'),'Tiếp tục video');
   assert.ok(brand.classList.contains('is-visible'),'manual pause displays the branded choice screen');
   assert.equal(window.getComputedStyle(brand).display,'grid');
   assert.equal(window.getComputedStyle(stage.querySelector('.hero-stage')).aspectRatio,'auto','the paused layout grows to fit both choices');
   assert.equal(stage.querySelector('.hero-entry-bar'),null,'the paused card is the only hero CTA group');
   assert.equal(video.currentTime,37.5);

   await click(sound);
   assert.equal(video.muted,false);
   const choices=[...brand.querySelectorAll('.hero-actions a')];
   assert.equal(choices.length,2);
   for(const link of choices){
    assert.equal(window.getComputedStyle(link).pointerEvents,'auto','branded CTA participates in pointer hit testing');
    await click(link);
    assert.equal(document.getElementById('current-route').textContent,link.pathname+link.hash,'CTA navigates independently');
    assert.equal(stage.dataset.stage,'paused');
   }
   assert.equal(plays,1,'sound and both links leave playback paused');
   hidden=true;await act(async()=>document.dispatchEvent(new Event('visibilitychange')));
   await observe(false);hidden=false;
   await act(async()=>document.dispatchEvent(new Event('visibilitychange')));
   await observe(true);await fire('playing');
   assert.equal(stage.dataset.stage,'paused','returning to the tab or a stale playing event does not cancel user pause');
   assert.equal(plays,1);
   await click(brand.querySelector('.hero-finish-slogan'));await fire('playing');
   assert.equal(stage.dataset.stage,'playing');assert.equal(plays,2);
   assert.equal(video.currentTime,37.5);assert.equal(video.muted,false);
   assert.ok(!brand.classList.contains('is-visible'));

   await observe(false);
   assert.equal(paused,true);assert.equal(stage.dataset.stage,'playing','automatic offscreen pause keeps the film layout');
   await observe(true);await fire('playing');assert.equal(plays,3);
   await click(play);assert.equal(stage.dataset.stage,'paused','the existing control uses the same pause screen');
   await click(surface);await click(surface);await fire('playing');
   assert.equal(stage.dataset.stage,'paused','rapid resume and pause keep the final intention');
   assert.equal(paused,true);assert.equal(video.currentTime,37.5);
   await click(play);await fire('playing');assert.equal(stage.dataset.stage,'playing');
   assert.equal(video.currentTime,37.5);
   paused=true;await fire('ended');
   assert.equal(stage.dataset.stage,'ended');
   await click(surface);await fire('playing');
   assert.equal(stage.dataset.stage,'playing');assert.equal(video.currentTime,0,'replay restarts a naturally finished film');
  }else if(mode==='scroll'||mode==='scroll-away'){
   assert.equal(observedTarget,surface,'the mobile CTA row alone does not count as a visible film');
   await observe(true);await fire('playing');video.currentTime=21.25;
   await act(async()=>window.dispatchEvent(new Event('wheel')));
   await scrollToY(-5);await scrollToY(0);
   assert.equal(paused,false,'wheel intent, overscroll bounce and zero movement leave playback alone');
   if(mode==='scroll')await act(async()=>stage.querySelector('.hero-entry-bar a').focus());
   if(mode==='scroll-away')await observe(false);
   await scrollToY(mode==='scroll'?1:900);
   assert.equal(paused,true,'the first downward movement pauses the film');
   assert.equal(stage.dataset.stage,mode==='scroll'?'paused':'playing','a jump below the film defers changing offscreen layout');
   if(mode==='scroll')assert.equal(document.activeElement,brand.querySelector('.hero-actions a'),'the matching CTA retains focus when playback pauses on scroll');
   await observe(false);hidden=true;await act(async()=>document.dispatchEvent(new Event('visibilitychange')));
   await scrollToY(0);await observe(true);hidden=false;
   await act(async()=>document.dispatchEvent(new Event('visibilitychange')));
   await fire('playing');await fire('ended');
   assert.equal(plays,1,'returning from a scroll or background tab cannot resume the film');
   assert.equal(stage.dataset.stage,'paused');assert.equal(video.currentTime,21.25);
   assert.equal(brand.querySelectorAll('.hero-actions a').length,2);assert.ok(brand.classList.contains('is-visible'));
   await click(sound);assert.equal(plays,1);
   await click(play);await fire('playing');
   assert.equal(plays,2);assert.equal(video.currentTime,21.25);assert.equal(stage.dataset.stage,'playing');
   await scrollToY(2);assert.equal(stage.dataset.stage,'paused','explicit resume re-arms the next downward scroll');
  }else if(mode==='scroll-before-start'){
   await scrollToY(1);await observe(true);await scrollToY(0);
   assert.equal(plays,0,'scrolling before the first intersection callback also suppresses autoplay');
   assert.equal(video.getAttribute('src'),null);assert.equal(stage.dataset.stage,'paused');
   await click(surface);await fire('playing');assert.equal(plays,1);assert.equal(stage.dataset.stage,'playing');
  }else if(['noio','noio-offscreen','observe-failure'].includes(mode)){
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
   await scrollToY(1);assert.equal(stage.dataset.stage,'fallback');assert.equal(plays,0);
   await act(async()=>play.click());await fire('playing');assert.equal(plays,1);paused=true;await fire('ended');assert.equal(stage.dataset.stage,'ended');
  }else if(mode==='blocked'){
   await observe(true);assert.equal(stage.dataset.stage,'fallback');assert.equal(document.querySelectorAll('.hero-brand-finish a').length,2);
   denyPlayback=false;await click(surface);await fire('playing');
   assert.equal(stage.dataset.stage,'playing','tap can start after an autoplay denial');
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
