import {build} from 'esbuild';
import {mkdir,readFile,rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {MemoryRouter} from 'react-router-dom';
import {JSDOM} from 'jsdom';

const temp='.home-reference-motion';await mkdir(temp,{recursive:true});
try {
 await build({stdin:{contents:"export {default as Home} from './src/Home'; export {LocaleProvider} from './src/i18n'; export {loadLocale} from './src/i18n-runtime/catalog';",resolveDir:process.cwd(),sourcefile:'home-reference-test.tsx'},bundle:true,platform:'node',format:'esm',packages:'external',loader:{'.css':'empty'},outfile:`${temp}/bundle.mjs`,logLevel:'silent'});
 const {Home,LocaleProvider,loadLocale}=await import(pathToFileURL(`${process.cwd()}/${temp}/bundle.mjs`).href);
 let vietnameseTitles;
 for(const locale of ['vi','en','zh','ko','ja']) {
  await loadLocale(locale);
  const html=renderToStaticMarkup(React.createElement(LocaleProvider,{value:locale},React.createElement(MemoryRouter,null,React.createElement(Home))));
  const dom=new JSDOM(html),doc=dom.window.document;
  const about=doc.querySelector('.ref-about-image');assert.equal(about.dataset.reveal,'right');assert.equal(about.getAttribute('data-reveal-delay'),null);
  const metrics=[...doc.querySelectorAll('.ref-achievement-frame')];assert.equal(metrics.length,4);
  assert.deepEqual(metrics.map(x=>x.getAttribute('data-reveal-delay-ms')),['300','500','700','900']);
  assert.ok(metrics.every(x=>x.querySelector('.motion-content > .ref-achievement')));
  assert.equal(doc.querySelector('.section-home-solution h2').closest('[data-reveal]').dataset.reveal,'zoom');
  const solution=doc.querySelector('.ref-solution-track').closest('[data-reveal-frame]');assert.equal(solution.dataset.revealDelayMs,'500');assert.equal(solution.querySelectorAll('[data-reveal]').length,0);
  const partners=doc.querySelector('.partners-strip').closest('[data-reveal-frame]');assert.equal(partners.getAttribute('data-reveal-delay-ms'),'500');assert.equal(doc.querySelectorAll('.partners-strip').length,1);
  assert.equal(doc.querySelector('.ref-news-grid').closest('[data-reveal-frame]').dataset.revealDelayMs,'400');
  const titles=[...doc.querySelectorAll('.ref-news-card h3')].map(node=>node.textContent.trim());
  assert.equal(titles.length,8,'eight cards use existing Minh Đức sample material');
  assert.equal(new Set(titles).size,8,'card titles remain distinct');
  if(locale==='vi')vietnameseTitles=titles;
  else assert.ok(titles.every((title,i)=>title!==vietnameseTitles[i]),`${locale}: every news title is localized`);
  assert.equal(doc.querySelector('.ref-event').closest('[data-reveal-frame]').dataset.reveal,'up');
  assert.equal(doc.querySelector('.home-b2b-video-button').closest('[data-reveal-frame]').dataset.revealDelayMs,'400');
  assert.equal(doc.querySelector('.ref-video-bg-frame').dataset.reveal,'zoom-right');
  assert.equal(doc.querySelectorAll('[data-reveal] [data-reveal]').length,0,'no nested animated targets');
  dom.window.close();
 }
 const motion=await readFile('src/motion.css','utf8');
 const bodyCss=await readFile('src/home-b2b.css','utf8'),referenceCss=await readFile('src/home-reference.css','utf8');assert.match(bodyCss,/@media\(max-width:767px\)/);assert.match(referenceCss,/\.ref-achievement-track[^\{]*\{display:flex;overflow-x:auto/);assert.match(referenceCss,/\.ref-achievement:focus-visible/);
 assert.match(motion,/data-reveal="zoom-right"\]\.motion-pending > \.motion-content\s*\{\s*transform:\s*translateX\(-100px\) scale\(\.6\)/,'AOS zoom-in-right starts from the left');
 for(const value of ['400ms','600ms','800ms'])assert.ok(motion.includes(value),`reference stagger ${value}`);
 console.log('PASS home reference motion: five locales, stable frames, source AOS sequence, densities and eight distinct sample-topic cards');
} finally {await rm(temp,{recursive:true,force:true})}
