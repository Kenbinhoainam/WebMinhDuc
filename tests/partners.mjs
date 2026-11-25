import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {mkdir, readFile, rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';

const folder = '.partners-test';
await mkdir(folder, {recursive:true});
await build({stdin:{contents:"export {default as PartnersStrip} from './src/PartnersStrip'; export {LocaleProvider} from './src/i18n';",resolveDir:process.cwd(),sourcefile:'partners-test.tsx',loader:'tsx'}, bundle:true, format:'esm', platform:'node', packages:'external', loader:{'.css':'empty'}, outfile:`${folder}/bundle.mjs`, logLevel:'silent'});
const dom = new JSDOM('<div id="root"></div>', {pretendToBeVisual:true});
for (const key of ['window','document','navigator','HTMLElement','Element','Node','Event','MutationObserver']) Object.defineProperty(globalThis,key,{configurable:true,writable:true,value:dom.window[key]});
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
let observer, disconnected=false;
globalThis.IntersectionObserver=class {
 constructor(callback){this.callback=callback;observer=this;}
 observe(target){this.target=target;}
 disconnect(){disconnected=true;}
 emit(isIntersecting){this.callback([{isIntersecting}]);}
};
const React=await import('react');
const {createRoot}=await import('react-dom/client');
const {PartnersStrip,LocaleProvider}=await import(pathToFileURL(`${process.cwd()}/${folder}/bundle.mjs`).href);
const root=createRoot(document.getElementById('root'));
try {
 await React.act(async()=>root.render(React.createElement(PartnersStrip)));
 const sets=document.querySelectorAll('.partners-set');
 assert.equal(sets.length,2);
 assert.equal(sets[1].getAttribute('aria-hidden'),'true');
 assert.equal(sets[1].querySelectorAll('a,button,[tabindex]').length,0);
 assert.equal(sets[0].querySelectorAll('li').length,10,'each visual set exceeds the 7.5-logo viewport');
 assert.deepEqual([...sets[0].querySelectorAll('li:not([data-repeat])')].map(li=>li.textContent),['Luxshare ICT','FOXCONN','SAMSUNG','JEILTECH VINA','TACU']);
 assert.equal(sets[0].querySelectorAll('li[data-repeat][aria-hidden="true"]').length,5,'repeated visual names are hidden from assistive technology');
 assert.equal(sets[0].textContent,sets[1].textContent);
 for (const image of sets[0].querySelectorAll('img')) {
  assert.equal(image.getAttribute('alt'),'');
  assert.match(image.getAttribute('src'), /^\/partners\/[a-z]+\.(svg|webp)$/);
  if (image.getAttribute('src').endsWith('.svg')) {
   const svg=await readFile(`public${image.getAttribute('src')}`,'utf8');
   assert.doesNotMatch(svg, /<script|<foreignObject|\son\w+=|(?:href|src)=|https?:\/\/(?!www\.w3\.org\/)/i);
  }
 }
 assert.equal(sets[0].querySelectorAll('li:not([data-repeat]) img').length,3);
 const firstMark=sets[0].querySelector('img');
 const firstName=firstMark.closest('li');
 await React.act(async()=>firstMark.dispatchEvent(new Event('error',{bubbles:false})));
 assert.equal(firstName.querySelector('img'),null,'a failed mark falls back to its name');
 assert.equal(firstName.querySelector('.partner-logo--text').textContent,'Luxshare ICT');
 const strip=document.querySelector('.partners-strip');
 assert.equal(strip.dataset.static,'false','successful observer enables the rail');
 assert.equal(strip.dataset.visible,'false','initially paused until visibility is known');
 await React.act(async()=>observer.emit(true)); assert.equal(strip.dataset.visible,'true');
 await React.act(async()=>observer.emit(false)); assert.equal(strip.dataset.visible,'false','offscreen loop pauses');
 await React.act(async()=>observer.emit(true));
 Object.defineProperty(document,'hidden',{configurable:true,value:true});await React.act(async()=>document.dispatchEvent(new Event('visibilitychange')));
 assert.equal(strip.dataset.visible,'false','hidden document pauses');
 Object.defineProperty(document,'hidden',{configurable:true,value:false});await React.act(async()=>document.dispatchEvent(new Event('visibilitychange')));
 assert.equal(strip.dataset.visible,'true');
 const button=document.querySelector('.partners-toggle');
 const visualCss=await readFile('src/flagshipvisual.css','utf8');
 assert.match(visualCss, /\.partners-toggle\s*\{[^}]*display:\s*inline-flex/,'pause control is visible without focus');
 assert.match(visualCss, /\.partners-toggle\s*\{[^}]*min-height:\s*44px/,'pause control has a comfortable target');
 assert.equal(button.getAttribute('aria-pressed'),'false');
 await React.act(async()=>button.click());
 assert.equal(button.getAttribute('aria-pressed'),'true');
 assert.equal(document.querySelector('.partners-strip').dataset.paused,'true');
 await React.act(async()=>button.click());
 assert.equal(button.getAttribute('aria-pressed'),'false');
 await React.act(async()=>document.querySelector('.partners-viewport').focus());assert.equal(button.getAttribute('aria-pressed'),'true','focus entry latches partner pause');
 await React.act(async()=>document.querySelector('.partners-viewport').blur());assert.equal(button.getAttribute('aria-pressed'),'true','blur does not silently resume');
 await React.act(async()=>button.focus());await React.act(async()=>button.click());assert.equal(button.getAttribute('aria-pressed'),'false','explicit play resumes');
 await React.act(async()=>document.getElementById('root').setAttribute('inert',''));assert.equal(strip.dataset.visible,'false','global modal pauses partner loop');
 await React.act(async()=>document.getElementById('root').removeAttribute('inert'));assert.equal(strip.dataset.visible,'true');
 await React.act(async()=>root.render(null));assert(disconnected,'observer cleanup');
 globalThis.IntersectionObserver=class {constructor(){throw Error('unavailable')}};
 await React.act(async()=>root.render(React.createElement(PartnersStrip)));
 assert.equal(document.querySelector('.partners-strip').dataset.visible,'false','observer constructor failure remains paused');
 assert.equal(document.querySelector('.partners-strip').dataset.static,'true','observer failure exposes static unique names');
 await React.act(async()=>root.render(null));
 let staleCallback;globalThis.IntersectionObserver=class {constructor(callback){staleCallback=callback;}observe(){throw Error('observe failed');}disconnect(){}};
 await React.act(async()=>root.render(React.createElement(PartnersStrip)));
 await React.act(async()=>staleCallback([{isIntersecting:true}]));
 assert.equal(document.querySelector('.partners-strip').dataset.visible,'false','stale callback after observe failure cannot start loop');
 assert.equal(document.querySelector('.partners-strip').dataset.static,'true');
 const {renderToStaticMarkup}=await import('react-dom/server');
 const labels={vi:'Tạm dừng chuyển động đối tác',en:'Pause partner animation',zh:'暂停合作伙伴动画',ko:'파트너 애니메이션 일시 정지',ja:'パートナーの動きを一時停止'};
 for(const [locale,label] of Object.entries(labels)) {
  const html=renderToStaticMarkup(React.createElement(LocaleProvider,{value:locale},React.createElement(PartnersStrip)));
  const rendered=new JSDOM(html);assert.equal(rendered.window.document.querySelector('.partners-toggle').getAttribute('aria-label'),label,`${locale} pause label`);rendered.window.close();
 }
 const playLabels={vi:'Phát chuyển động đối tác',en:'Play partner animation',zh:'播放合作伙伴动画',ko:'파트너 애니메이션 재생',ja:'パートナーの動きを再生'};
 for(const [locale,label] of Object.entries(playLabels)) {
  await React.act(async()=>root.render(React.createElement(LocaleProvider,{value:locale},React.createElement(PartnersStrip,{key:locale}))));
  const toggle=document.querySelector('.partners-toggle');await React.act(async()=>toggle.click());
  assert.equal(toggle.getAttribute('aria-label'),label,`${locale} play label`);
 }
 const css=await readFile('src/motion.css','utf8');
 assert.match(css,/data-static="true"\] \.partners-viewport\s*\{\s*overflow:\s*visible/,'static fallback is not clipped');
 assert.match(css,/data-static="true"\] \.partners-set \[data-repeat\]/,'static fallback hides repeated names');
 console.log('PASS partners: unique names, wider hidden duplicates, visibility and pause safeguards');
} finally {
 await React.act(async()=>root.unmount());
 dom.window.close();
 await rm(folder,{recursive:true,force:true});
}
