import {build} from 'esbuild';
import {mkdir,rm,readFile,access} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
const temp='.media-test';
if(!process.argv.includes('--case')) {
 await mkdir(temp,{recursive:true});
 try {
  await build({entryPoints:['src/HomeHero.tsx'],bundle:true,platform:'node',format:'esm',outfile:`${temp}/hero.mjs`,packages:'external',loader:{'.css':'empty'},logLevel:'silent'});
  const heroCss=await readFile('src/home-enhancements.css','utf8');
  assert.match(heroCss,/\.home-hero \.video-control\s*\{[^}]*clip-path:inset\(50%\)/,'video control is visually hidden by default');
  assert.match(heroCss,/\.home-hero \.video-control:focus\s*\{[^}]*clip-path:none/,'keyboard focus reveals the control');
  const mediaCss=await readFile('src/hero-media.css','utf8');
  assert.match(mediaCss,/\.hero-media video\s*\{\s*opacity:\s*0/,'video begins transparent');
  assert.match(mediaCss,/\.hero-media video\.is-ready\s*\{\s*opacity:\s*1/,'ready video can appear');
  const manifest=JSON.parse(await readFile('src/media-manifest.json','utf8'));
  for(const [original,image] of Object.entries(manifest)) {await access('public'+original);for(const variant of image.variants) await access('public'+variant.src);}
  for(const mode of ['mobile','reduced','data','desktop','race','preference','observer','frames']) {const result=spawnSync(process.execPath,[process.argv[1],'--case',mode],{encoding:'utf8',timeout:10000});assert.equal(result.status,0,`${mode}: ${result.stdout}\n${result.stderr}`);process.stdout.write(result.stdout);}
 } finally {await rm(temp,{recursive:true,force:true});}
} else {
 const mode=process.argv[process.argv.indexOf('--case')+1];
 const dom=new JSDOM('<div id="root"></div>',{url:'https://example.com/',pretendToBeVisual:true});const {window}=dom;
 for(const key of ['window','document','navigator','HTMLElement','Element','Node','Event','MutationObserver','requestAnimationFrame','cancelAnimationFrame'])Object.defineProperty(globalThis,key,{configurable:true,writable:true,value:window[key]});
 const listeners={}; const motion={matches:mode==='reduced',addEventListener(_,cb){listeners.motion=cb},removeEventListener(_,cb){if(listeners.motion===cb)delete listeners.motion}};const narrow={matches:mode==='mobile',addEventListener(_,cb){listeners.narrow=cb},removeEventListener(_,cb){if(listeners.narrow===cb)delete listeners.narrow}};const connection={saveData:mode==='data',addEventListener(_,cb){listeners.connection=cb},removeEventListener(_,cb){if(listeners.connection===cb)delete listeners.connection}};Object.defineProperty(window.navigator,'connection',{value:connection});
 window.matchMedia=q=>q.includes('reduced')?motion:narrow;
 let observerCallback,disconnected=false;globalThis.IntersectionObserver=class {constructor(callback){if(mode==='observer')throw Error('unavailable');observerCallback=callback}observe(){}disconnect(){disconnected=true}};
 let paused=true,plays=0;Object.defineProperty(window.HTMLMediaElement.prototype,'paused',{get(){return paused}});
 window.HTMLMediaElement.prototype.play=function(){paused=false;plays++;this.dispatchEvent(new window.Event('play'));return Promise.resolve()};
 window.HTMLMediaElement.prototype.pause=function(){paused=true;this.dispatchEvent(new window.Event('pause'))};
 globalThis.IS_REACT_ACT_ENVIRONMENT=true;
 const React=await import('react');const {act}=React;const {createRoot}=await import('react-dom/client');const {MemoryRouter}=await import('react-router-dom');const {default:Hero}=await import(pathToFileURL(`${process.cwd()}/${temp}/hero.mjs`).href);
 const root=createRoot(window.document.getElementById('root'));
 // Flush the initial commit and passive effects explicitly. A fixed render sleep
 // can expire after DOM creation but before preference listeners are installed.
 const waitForAutoplay=()=>act(async()=>{await new Promise(resolve=>setTimeout(resolve,1600))});
 const observe=visible=>act(async()=>observerCallback([{isIntersecting:visible}]));
 try {
  await act(async()=>root.render(React.createElement(MemoryRouter,null,React.createElement(Hero))));
  const video=window.document.querySelector('video'),button=window.document.querySelector('.video-control');
  assert.ok(video&&button);assert.equal(video.getAttribute('src'),null);
  const poster=window.document.querySelector('.hero-media .hero-poster');
  assert.equal(poster?.getAttribute('src'),'/optimized/assets/hero-poster-1600.webp','initial layer uses preloaded poster');
  assert.equal(poster?.getAttribute('fetchpriority'),'high');
  assert.equal(video.getAttribute('poster'),null,'video does not request a redundant poster');
  assert(!video.classList.contains('is-ready'),'poster remains visible before a playing frame');
  assert.equal(window.document.querySelector('.hero-bottom, .scroll-hint, .hero-caption'),null,'hero bottom bar is removed');
  assert.equal(button.getAttribute('aria-label'),'Phát video');
  button.focus();assert.equal(window.document.activeElement,button,'video control remains keyboard focusable');
  for(const preference of ['motion','narrow','connection'])assert.equal(typeof listeners[preference],'function',`${preference} listener is installed after effect flush`);
  const click=()=>act(async()=>button.click());
  if(mode==='frames') {
   await click();
   assert(!video.classList.contains('is-ready'),'play request alone does not reveal video');
   const fire=type=>act(async()=>video.dispatchEvent(new window.Event(type)));
   await fire('playing');assert(video.classList.contains('is-ready'),'playing reveals the frame');
   await fire('waiting');assert(!video.classList.contains('is-ready'),'stall returns to poster');
   await fire('playing');assert(video.classList.contains('is-ready'),'playback recovery reveals video');
   await fire('error');assert(!video.classList.contains('is-ready'),'error returns to poster');assert.equal(button.getAttribute('aria-label'),'Phát video','error resets the control label');
   await fire('playing');await click();assert(!video.classList.contains('is-ready'),'pause returns to poster');
   await fire('playing');assert(!video.classList.contains('is-ready'),'late playing event cannot reveal paused video');
  } else if(mode==='race') {
   await click();assert.equal(button.getAttribute('aria-label'),'Tạm dừng video');await click();assert.equal(button.getAttribute('aria-label'),'Phát video');assert.equal(paused,true);await waitForAutoplay();
   assert.equal(plays,1,'pending autoplay must not restart a manual pause');
  } else if(mode==='preference') {
   await click();assert.equal(paused,false);
   await act(async()=>{motion.matches=true;listeners.motion()});assert.equal(paused,true,'new reduced-motion preference pauses manual playback');
   await act(async()=>{motion.matches=false;listeners.motion()});await waitForAutoplay();
   assert.equal(plays,1,'preference change must not resume playback');
   await click();await act(async()=>{connection.saveData=true;listeners.connection()});
   assert.equal(paused,true,'new data-saving preference pauses manual playback');
  } else if(mode==='observer') {
   await waitForAutoplay();assert.equal(video.getAttribute('src'),null,'observer failure keeps poster');
   await click();assert.equal(plays,1,'manual playback still works');
  } else {
   await waitForAutoplay();
   if(mode==='desktop') {
    assert.match(video.getAttribute('src'),/hero-1280/);assert.equal(plays,1);
    await observe(false);assert.equal(paused,true);await observe(true);await waitForAutoplay();assert.equal(plays,2);
    await click();assert.equal(paused,true);await observe(false);await observe(true);await waitForAutoplay();
    assert.equal(plays,2,'user pause must persist');
   } else {
    assert.equal(video.getAttribute('src'),null,'no automatic video download');await click();
    assert.match(video.getAttribute('src'),/hero-1280/);assert.equal(plays,1,'manual play');
   }
  }
  console.log(`PASS media ${mode}`);
 } finally {await act(async()=>root.unmount());assert.deepEqual(Object.keys(listeners),[],'preference listeners removed on unmount');if(mode!=='observer')assert(disconnected,'observer disconnected on unmount');dom.window.close()}
}
