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
  const heroCss=await readFile('src/hero-media.css','utf8');
  assert.match(heroCss,/\.home-hero \.video-control\s*\{[^}]*clip-path:inset\(50%\)/,'video control is visually hidden by default');
  assert.match(heroCss,/\.home-hero \.video-control:focus\s*\{[^}]*clip-path:none/,'keyboard focus reveals the control');
  const mediaCss=await readFile('src/hero-media.css','utf8');
  assert.match(mediaCss,/\.hero-media video\s*\{\s*opacity:\s*0/,'video begins transparent');
  assert.match(mediaCss,/\.hero-media video\.is-ready\s*\{\s*opacity:\s*1/,'ready video can appear');
  const manifest=JSON.parse(await readFile('src/media-manifest.json','utf8'));
  for(const [original,image] of Object.entries(manifest)) {await access('public'+original);for(const variant of image.variants) await access('public'+variant.src);}
  for(const mode of ['mobile','reduced','data','desktop','race','preference','observer','frames','carousel','late']) {const result=spawnSync(process.execPath,[process.argv[1],'--case',mode],{encoding:'utf8',timeout:10000});assert.equal(result.status,0,`${mode}: ${result.stdout}\n${result.stderr}`);process.stdout.write(result.stdout);}
 } finally {await rm(temp,{recursive:true,force:true});}
} else {
 const mode=process.argv[process.argv.indexOf('--case')+1];
 const dom=new JSDOM('<div id="root"></div>',{url:'https://example.com/',pretendToBeVisual:true});const {window}=dom;
 for(const key of ['window','document','navigator','HTMLElement','Element','Node','Event','MutationObserver','requestAnimationFrame','cancelAnimationFrame'])Object.defineProperty(globalThis,key,{configurable:true,writable:true,value:window[key]});
 const listeners={}; const motion={matches:mode==='reduced',addEventListener(_,cb){listeners.motion=cb},removeEventListener(_,cb){if(listeners.motion===cb)delete listeners.motion}};const narrow={matches:mode==='mobile',addEventListener(_,cb){listeners.narrow=cb},removeEventListener(_,cb){if(listeners.narrow===cb)delete listeners.narrow}};const connection={saveData:mode==='data',addEventListener(_,cb){listeners.connection=cb},removeEventListener(_,cb){if(listeners.connection===cb)delete listeners.connection}};Object.defineProperty(window.navigator,'connection',{value:connection});
 window.matchMedia=q=>q.includes('reduced')?motion:narrow;
 let observerCallback,disconnected=false;globalThis.IntersectionObserver=class {constructor(callback){if(mode==='observer')throw Error('unavailable');observerCallback=callback}observe(){}disconnect(){disconnected=true}};
 let paused=true,plays=0,rejectFirst;Object.defineProperty(window.HTMLMediaElement.prototype,'paused',{get(){return paused}});
 window.HTMLMediaElement.prototype.play=function(){paused=false;plays++;this.dispatchEvent(new window.Event('play'));if(mode==='late'&&plays===1)return new Promise((_,reject)=>{rejectFirst=reject});return Promise.resolve()};
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
  assert.equal(button.getAttribute('aria-label'),'Phát chuyển động');
  await act(async()=>button.focus());assert.equal(window.document.activeElement,button,'video control remains keyboard focusable');
  for(const preference of ['motion','narrow','connection'])assert.equal(typeof listeners[preference],'function',`${preference} listener is installed after effect flush`);
  const click=()=>act(async()=>button.click());
  if(mode==='desktop' || mode==='carousel') await observe(true);
  if(mode==='desktop') { await act(async()=>{await new Promise(resolve=>setTimeout(resolve,20));}); assert.equal(plays,1,'eligible visible hero starts without artificial delay'); }
  if(mode==='late') {
   await click(); await click(); await click();
   await act(async()=>rejectFirst(Error('late rejection')));
   assert.equal(button.getAttribute('aria-label'),'Tạm dừng chuyển động','stale rejection does not override newer playback');
  } else if(mode==='frames') {
   await click();
   assert(!video.classList.contains('is-ready'),'play request alone does not reveal video');
   const fire=type=>act(async()=>video.dispatchEvent(new window.Event(type)));
   await fire('playing');assert(video.classList.contains('is-ready'),'playing reveals the frame');
   await fire('waiting');assert(!video.classList.contains('is-ready'),'stall returns to poster');
   await fire('playing');assert(video.classList.contains('is-ready'),'playback recovery reveals video');
   await fire('error');assert(!video.classList.contains('is-ready'),'error returns to poster');assert.equal(button.getAttribute('aria-label'),'Phát chuyển động','error resets the control label');
   await fire('playing');assert.equal(button.getAttribute('aria-label'),'Tạm dừng chuyển động','recovered playback restores control state');await click();assert(!video.classList.contains('is-ready'),'pause returns to poster');
   await fire('playing');assert(!video.classList.contains('is-ready'),'late playing event cannot reveal paused video');
  } else if(mode==='carousel') {
   await act(async()=>button.blur());
   const timers = new Map(); let nextTimer = 0;
   window.setInterval = callback => { const id = ++nextTimer; timers.set(id, callback); return id; };
   window.clearInterval = id => timers.delete(id);
   await act(async()=>{await new Promise(resolve=>setTimeout(resolve,20)); video.dispatchEvent(new window.Event('playing'));});
   const active=()=>window.document.querySelector('.hero-title-grid .hero-slide[data-active="true"]');
   assert.match(active().textContent,/Kết nối nhân lực/,'brand appears first');
   const cta=()=>window.document.querySelector('.hero-actions a');
   assert.equal(window.document.querySelectorAll('.hero-actions a').length,1,'one primary CTA');
   assert.equal(cta().getAttribute('href'),'/about-us','initial CTA follows the brand slide');
   assert.equal(timers.size,1,'rotation starts only once video is playing');
   await act(async()=>[...timers.values()][0]());
   assert.match(active().textContent,/Giới thiệu & cung ứng nhân lực/,'existing service title follows');
   assert.equal(cta().getAttribute('href'),'/services/labor-supply','CTA follows the active service');
   await act(async()=>button.focus()); assert.equal(timers.size,0,'focus pauses headline rotation');
   await act(async()=>button.blur()); assert.equal(timers.size,1,'rotation resumes after focus leaves');
   assert.match(active().textContent,/Giới thiệu/,'pause and resume preserve active slide');
   const advance=()=>act(async()=>[...timers.values()][0]());
   await advance();await advance();
   const titles=window.document.querySelectorAll('.hero-title-grid .hero-slide');
   assert.equal(titles[0].dataset.position,'after','first slide waits to the right before wrap');
   await advance();
   assert.equal(titles[3].dataset.position,'before','outgoing final slide travels left on wrap');
   assert.match(active().textContent,/Kết nối nhân lực/);
   assert.equal(cta().getAttribute('href'),'/about-us');
   assert.equal(window.document.querySelectorAll('.hero-title-grid .hero-slide[aria-hidden="false"]').length,1);
   assert.equal(window.document.querySelectorAll('.hero-description-grid .hero-slide[aria-hidden="false"]').length,1);
   await advance();assert.match(active().textContent,/Giới thiệu/);assert.equal(titles[3].getAttribute('aria-hidden'),'true');
   assert.equal(cta().getAttribute('href'),'/services/labor-supply');
   const hero=window.document.querySelector('.home-hero');
   await act(async()=>hero.dispatchEvent(new window.MouseEvent('mouseover',{bubbles:true})));
   assert.equal(timers.size,0,'hover pauses titles'); assert.equal(paused,false,'hover does not pause video');
   await act(async()=>hero.dispatchEvent(new window.MouseEvent('mouseout',{bubbles:true,relatedTarget:window.document.body})));
   assert.equal(timers.size,1,'rotation resumes after pointer leaves');
   await click(); assert.equal(timers.size,0,'motion control also pauses title rotation'); assert.equal(paused,true,'motion control pauses video');
   await observe(false); assert.equal(timers.size,0,'offscreen playback pauses rotation');
  } else if(mode==='race') {
   await act(async()=>{observerCallback([{isIntersecting:true}]);button.click();button.click();});assert.equal(button.getAttribute('aria-label'),'Phát chuyển động');assert.equal(paused,true);await waitForAutoplay();
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
    assert.match(video.getAttribute('src'),/hero-1080-ea988cd5/);assert.equal(plays,1);
    await observe(false);assert.equal(paused,true);await observe(true);await waitForAutoplay();assert.equal(plays,2);
    await click();assert.equal(paused,true);await observe(false);await observe(true);await waitForAutoplay();
    assert.equal(plays,2,'user pause must persist');
   } else {
    assert.equal(video.getAttribute('src'),null,'no automatic video download');
    await observe(true); await act(async()=>button.blur());
    let intervals = 0; window.setInterval = () => { intervals++; return 1; };
    await click(); await act(async()=>video.dispatchEvent(new window.Event('playing')));
    assert.match(video.getAttribute('src'),/hero-1080-ea988cd5/);assert.equal(plays,1,'manual play');
    assert.equal(intervals,0,'constrained modes do not rotate titles even after manual play');
   }
  }
  console.log(`PASS media ${mode}`);
 } finally {await act(async()=>root.unmount());assert.deepEqual(Object.keys(listeners),[],'preference listeners removed on unmount');if(mode!=='observer')assert(disconnected,'observer disconnected on unmount');dom.window.close()}
}
