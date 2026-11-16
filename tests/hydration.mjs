import {build} from 'esbuild';
import {readFile,rm,mkdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {pathToFileURL} from 'node:url';

const temp='.hydration-test';
if(!process.argv.includes('--case')) {
 await mkdir(temp,{recursive:true});
 try {
  await build({entryPoints:['src/i18n.tsx'],bundle:true,platform:'node',format:'esm',outfile:`${temp}/i18n.mjs`,packages:'external',loader:{'.css':'empty'},logLevel:'silent'});
  const {localizedPath,localeFromPath,languageSwitchUrl}=await import(pathToFileURL(`${process.cwd()}/${temp}/i18n.mjs`).href);
  assert.equal(localizedPath('/ko/jobs/example','en'),'/en/jobs/example');
  assert.equal(localizedPath('/en/jobs/example','vi'),'/jobs/example');
  assert.equal(localizedPath('/','ja'),'/ja');
  assert.equal(localizedPath('/vi','en'),'/en');
  assert.equal(localeFromPath('/zh/jobs'),'zh');
  assert.equal(languageSwitchUrl('/ko/jobs','?q=kho','#details','ja'),'/ja/jobs?q=kho#details');
  await build({entryPoints:['src/main.tsx'],bundle:true,platform:'node',format:'esm',outfile:`${temp}/client.mjs`,packages:'external',loader:{'.css':'empty'},logLevel:'silent'});
  for(const url of ['/','/about-us','/services','/careers','/consultation','/jobs','/saved-jobs','/jobs?q=kho','/testimonials','/en','/zh','/ko','/ja','/en/jobs','/zh/jobs','/ko/jobs','/ja/jobs','/en/consultation','/zh/consultation','/ko/consultation','/ja/consultation']) {
   const result=spawnSync(process.execPath,[process.argv[1],'--case',url],{encoding:'utf8',timeout:15000});
   assert.equal(result.status,0,`${url}: ${result.stdout}\n${result.stderr}`);process.stdout.write(result.stdout);
  }
 } finally {await rm(temp,{recursive:true,force:true});}
} else {
 const route=process.argv[process.argv.indexOf('--case')+1],path=route.split('?')[0];
 const html=await readFile(`dist${path==='/'?'':path}/index.html`,'utf8');
 const dom=new JSDOM(html,{url:`https://minhduc-prototype-sprint1.kenbinhoainam.chatgpt.site${route}`,pretendToBeVisual:true});
 const {window}=dom;
 // jsdom does not initialize the live muted state from the markup as browsers do.
 window.document.querySelectorAll('video[muted]').forEach(video=>{video.muted=true});
 for(const key of ['window','document','navigator','HTMLElement','Element','Node','Event','MutationObserver','localStorage','location','requestAnimationFrame','cancelAnimationFrame']) Object.defineProperty(globalThis,key,{configurable:true,writable:true,value:window[key]});
 window.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
 window.HTMLMediaElement.prototype.play=()=>Promise.resolve();window.HTMLMediaElement.prototype.pause=()=>{};
 window.scrollTo=()=>{};window.HTMLElement.prototype.scrollIntoView=()=>{};
 window.localStorage.setItem('minhduc.saved-jobs.v1',JSON.stringify(['MD001','MD003']));
 window.localStorage.setItem('minhduc.preferences','essential-only');
 const errors=[]; const original=console.error;console.error=(...args)=>{errors.push(args.map(String).join(' '));original(...args)};
 const initialHeading=window.document.querySelector('h1');assert.ok(initialHeading);
 await import(pathToFileURL(`${process.cwd()}/${temp}/client.mjs`).href);
 await new Promise(resolve=>setTimeout(resolve,800));
 assert.equal(errors.length,0,`React errors: ${errors.join('\n')}`);
 assert.ok(window.document.querySelector('h1')?.textContent, 'client content missing');
 assert.match(window.document.title,/Minh Đức Vina/);
 const locale=/^\/(en|zh|ko|ja)(?:\/|$)/.exec(path)?.[1]||'vi';
 assert.equal(window.document.querySelector('.language-trigger')?.getAttribute('data-locale'),locale);
 assert.equal(window.document.documentElement.lang,locale==='zh'?'zh-Hans':locale);
 if(locale!=='vi') assert.ok(window.document.querySelector('.brand')?.getAttribute('href')?.startsWith('/'+locale));
 assert.match(window.document.querySelector('.header-saved')?.getAttribute('aria-label')||'',/2/);
 if(!route.includes('?') && path!=='/testimonials') assert.equal(window.document.querySelector('h1'),initialHeading,'pre-rendered heading was replaced');
 if(path==='/saved-jobs') {assert.equal(window.document.querySelectorAll('.job-card').length,2);assert.match(window.document.querySelector('.jobs-result-bar')?.textContent||'',/2/);}
 if(route.includes('?') || path==='/testimonials') assert.notEqual(window.document.querySelector('h1'),initialHeading,'fallback should render fresh');
 if(route.includes('?')) {assert.equal(window.document.querySelector('#jobs-query')?.value,'kho');assert.equal(window.document.querySelectorAll('.job-card').length,2);}
 if(path==='/testimonials') assert.match(window.document.querySelector('link[rel="canonical"]')?.href||'',/\/partners$/);
 console.error=original;dom.window.close();console.log(`PASS hydration ${route}`);
}
