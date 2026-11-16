import {build} from 'esbuild';
import {mkdir,rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {StaticRouter,MemoryRouter,Routes,Route} from 'react-router-dom';
import {JSDOM} from 'jsdom';
import {createRoot} from 'react-dom/client';
const temp='.editorial-test';
await mkdir(temp,{recursive:true});
try {
 await build({entryPoints:['src/EditorialPages.tsx'],bundle:true,platform:'node',format:'esm',packages:'external',loader:{'.css':'empty'},outfile:`${temp}/pages.mjs`,logLevel:'silent'});
 const m=await import(pathToFileURL(`${process.cwd()}/${temp}/pages.mjs`).href);
 const articleSlugs=['ho-so-xin-viec','nhu-cau-tuyen-dung','chon-cong-viec-phu-hop','thong-tin-tuyen-dung-minh-bach','don-tiep-lao-dong-moi','an-toan-thong-tin-khi-tim-viec'];
 const eventSlugs=['ngay-hoi-ket-noi-viec-lam','toa-dam-ke-hoach-nhan-luc','hanh-trang-tim-viec'];
 const cases=[['/news','/news',m.NewsPage],...articleSlugs.map(s=>[`/news/${s}`,'/news/:slug',m.ArticlePage]),['/events','/events',m.EventsPage],...eventSlugs.map(s=>[`/events/${s}`,'/events/:slug',m.EventPage]),['/privacy-policy','/privacy-policy',()=>React.createElement(m.PolicyPage,{kind:'privacy'})],['/terms-of-use','/terms-of-use',()=>React.createElement(m.PolicyPage,{kind:'terms'})]];
 for(const [url,path,component] of cases){const html=renderToStaticMarkup(React.createElement(StaticRouter,{location:url},React.createElement(Routes,null,React.createElement(Route,{path,element:React.createElement(component)}))));assert.match(html,/<h1/);if(url.startsWith('/news/')){assert.match(html,/info-toc/);assert.match(html,/Bài viết minh họa/);}if(url.startsWith('/events/'))assert.match(html,/Lịch sự kiện minh họa/);if(url.includes('policy')||url.includes('terms'))assert.match(html,/info-policy-body/);}
 const dom=new JSDOM('<div id="root"></div>',{url:'https://example.com/news',pretendToBeVisual:true});
 for(const key of ['window','document','navigator','HTMLElement','Element','Node','Event','MutationObserver','requestAnimationFrame','cancelAnimationFrame'])Object.defineProperty(globalThis,key,{configurable:true,writable:true,value:dom.window[key]});
 dom.window.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
 let observer,timer;globalThis.IntersectionObserver=class{constructor(cb){observer=cb}observe(){}disconnect(){}};dom.window.setInterval=(cb,ms)=>{assert.equal(ms,3500);timer=cb;return 1};dom.window.clearInterval=()=>{timer=undefined};dom.window.HTMLElement.prototype.scrollTo=function(options){this.scrollLeft=options.left};
 globalThis.IS_REACT_ACT_ENVIRONMENT=true;
 const root=createRoot(dom.window.document.getElementById('root'));
 await React.act(async()=>root.render(React.createElement(MemoryRouter,{initialEntries:['/news']},React.createElement(m.NewsPage))));
 const slides=dom.window.document.querySelectorAll('.editorial-feature-slide');assert.equal(slides.length,6);assert.equal(slides[0].querySelector('img').getAttribute('loading'),'eager');assert.ok([...slides].slice(1).every(slide=>slide.querySelector('img').getAttribute('loading')==='lazy'));
 await React.act(async()=>observer([{isIntersecting:true}]));assert.equal(typeof timer,'function');
 const dot=dom.window.document.querySelectorAll('.editorial-feature-dots button')[1];
 await React.act(async()=>dot.dispatchEvent(new dom.window.MouseEvent('click',{bubbles:true})));assert.equal(dot.getAttribute('aria-pressed'),'true');
 const pause=dom.window.document.querySelector('.editorial-feature-pause');await React.act(async()=>pause.focus());
 await React.act(async()=>pause.dispatchEvent(new dom.window.MouseEvent('click',{bubbles:true})));assert.equal(pause.getAttribute('aria-pressed'),'true');assert.equal(timer,undefined);
 await React.act(async()=>pause.dispatchEvent(new dom.window.MouseEvent('click',{bubbles:true})));assert.equal(pause.getAttribute('aria-pressed'),'false');assert.equal(dom.window.document.activeElement,pause);await React.act(async()=>observer([{isIntersecting:true}]));assert.equal(typeof timer,'function','resumes with pause control still focused');
 const button=[...dom.window.document.querySelectorAll('button')].find(x=>x.textContent==='Dành cho doanh nghiệp');assert.ok(button);
 await React.act(async()=>button.dispatchEvent(new dom.window.MouseEvent('click',{bubbles:true})));
 assert.equal(button.getAttribute('aria-pressed'),'true');assert.match(dom.window.document.querySelector('.info-result-count').textContent,/2 bài viết/);
 await React.act(async()=>root.unmount());dom.window.close();
 console.log(`PASS ${cases.length} editorial routes and news filtering`);
} finally {await rm(temp,{recursive:true,force:true})}
