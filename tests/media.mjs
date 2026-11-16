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
  const manifest=JSON.parse(await readFile('src/media-manifest.json','utf8'));
  for(const [original,image] of Object.entries(manifest)) {await access('public'+original);for(const variant of image.variants) await access('public'+variant.src);}
  for(const mode of ['mobile','reduced','data','desktop','race','preference','observer']) {const result=spawnSync(process.execPath,[process.argv[1],'--case',mode],{encoding:'utf8',timeout:10000});assert.equal(result.status,0,`${mode}: ${result.stdout}\n${result.stderr}`);process.stdout.write(result.stdout);}
 } finally {await rm(temp,{recursive:true,force:true});}
} else {
 const mode=process.argv[process.argv.indexOf('--case')+1];
 const dom=new JSDOM('<div id="root"></div>',{url:'https://example.com/',pretendToBeVisual:true});const {window}=dom;
 for(const key of ['window','document','navigator','HTMLElement','Element','Node','Event','MutationObserver','requestAnimationFrame','cancelAnimationFrame'])Object.defineProperty(globalThis,key,{configurable:true,writable:true,value:window[key]});
 const listeners={}; const motion={matches:mode==='reduced',addEventListener(_,cb){listeners.motion=cb},removeEventListener(){}};const narrow={matches:mode==='mobile',addEventListener(_,cb){listeners.narrow=cb},removeEventListener(){}};const connection={saveData:mode==='data',addEventListener(_,cb){listeners.connection=cb},removeEventListener(){}};Object.defineProperty(window.navigator,'connection',{value:connection});
 window.matchMedia=q=>q.includes('reduced')?motion:narrow;
 let observerCallback;globalThis.IntersectionObserver=class {constructor(callback){if(mode==='observer')throw Error('unavailable');observerCallback=callback}observe(){}disconnect(){}};
 let paused=true,plays=0;Object.defineProperty(window.HTMLMediaElement.prototype,'paused',{get(){return paused}});
 window.HTMLMediaElement.prototype.play=function(){paused=false;plays++;this.dispatchEvent(new window.Event('play'));return Promise.resolve()};
 window.HTMLMediaElement.prototype.pause=function(){paused=true;this.dispatchEvent(new window.Event('pause'))};
 const React=await import('react');const {createRoot}=await import('react-dom/client');const {MemoryRouter}=await import('react-router-dom');const {default:Hero}=await import(pathToFileURL(`${process.cwd()}/${temp}/hero.mjs`).href);
 const root=createRoot(window.document.getElementById('root'));root.render(React.createElement(MemoryRouter,null,React.createElement(Hero)));
 await new Promise(r=>setTimeout(r,100));const video=window.document.querySelector('video'),button=window.document.querySelector('.video-control');assert.ok(video&&button);assert.equal(video.getAttribute('src'),null);
 if(mode==='race'){button.click();button.click();assert.equal(paused,true);await new Promise(r=>setTimeout(r,1600));assert.equal(plays,1,'pending autoplay must not restart a manual pause');}
 else if(mode==='preference'){button.click();assert.equal(paused,false);motion.matches=true;listeners.motion();assert.equal(paused,true,'new reduced-motion preference pauses manual playback');motion.matches=false;listeners.motion();await new Promise(r=>setTimeout(r,1600));assert.equal(plays,1,'preference change must not resume playback');button.click();connection.saveData=true;listeners.connection();assert.equal(paused,true,'new data-saving preference pauses manual playback');}
 else if(mode==='observer'){await new Promise(r=>setTimeout(r,1600));assert.equal(video.getAttribute('src'),null,'observer failure keeps poster');button.click();assert.equal(plays,1,'manual playback still works');}
 else {await new Promise(r=>setTimeout(r,1600));
 if(mode==='desktop') {assert.match(video.getAttribute('src'),/hero-1280/);assert.equal(plays,1);observerCallback([{isIntersecting:false}]);assert.equal(paused,true);observerCallback([{isIntersecting:true}]);await new Promise(r=>setTimeout(r,1600));assert.equal(plays,2);button.click();assert.equal(paused,true);observerCallback([{isIntersecting:false}]);observerCallback([{isIntersecting:true}]);await new Promise(r=>setTimeout(r,1600));assert.equal(plays,2,'user pause must persist');}
 else {assert.equal(video.getAttribute('src'),null,'no automatic video download');button.click();assert.match(video.getAttribute('src'),/hero-1280/);assert.equal(plays,1,'manual play');}}
 root.unmount();dom.window.close();console.log(`PASS media ${mode}`);
}
