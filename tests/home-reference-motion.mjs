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
  const cover=doc.querySelector('#about');
  assert.ok(cover.querySelector('img.field-portrait[alt=""]'), 'decorative field photo sits behind the cover');
  assert.equal(cover.querySelector('.field-intro').dataset.reveal,'up');
  assert.equal(cover.querySelector('.field-cta').getAttribute('href'),'/e-brochure');
  assert.equal(cover.querySelector('.field-metrics[data-auto-rail]'),null,'all four figures are in reading order');
  const metrics=[...doc.querySelectorAll('.field-stat-frame')];assert.equal(metrics.length,4);
  assert.deepEqual(metrics.map(x=>x.getAttribute('data-reveal-delay-ms')),['90','150','210','270']);
  assert.ok(metrics.every(x=>x.querySelector('.motion-content > .field-stat')));
  assert.equal(doc.querySelector('.section-home-solution h2').closest('[data-reveal]').dataset.reveal,'zoom');
  assert.equal(doc.querySelectorAll('.partners-strip').length,1);
  assert.equal(doc.querySelector('.home-v16-process-image').dataset.reveal,'media');
  assert.equal(doc.querySelector('.home-v16-group').dataset.reveal,'media');
  assert.equal(doc.querySelector('.home-v16-activity').dataset.reveal,'media');
  assert.ok([...doc.querySelectorAll('[data-reveal="media"]')].every(frame=>frame.querySelector(':scope > .motion-content > img')), 'media frames observe a stable wrapper around the image');
  assert.equal(doc.querySelectorAll('.home-v16-steps > li').length,5, 'all process steps remain in document flow');
  assert.ok([...doc.querySelectorAll('.home-v16-steps > li')].every(step=>step.querySelector(':scope > [data-reveal-frame]')), 'each process step has an independent stable reveal frame');
  const titles=[...doc.querySelectorAll('.ref-news-card h3')].map(node=>node.textContent.trim());
  assert.ok(titles.length>0 && new Set(titles).size===titles.length,'news card titles remain distinct');
  if(locale==='vi')vietnameseTitles=titles;
  else assert.ok(titles.every((title,i)=>title!==vietnameseTitles[i]),`${locale}: every news title is localized`);
  assert.equal(doc.querySelectorAll('[data-reveal] [data-reveal]').length,0,'no nested animated targets');
  dom.window.close();
 }
 const motion=await readFile('src/motion.css','utf8');
 assert.match(motion,/data-reveal="zoom-right"\]\.motion-pending > \.motion-content\s*\{\s*transform:\s*translateX\(calc\(-1 \* var\(--motion-travel,32px\)\)\) scale\(\.96\)/,'controlled zoom starts from the left');
 assert.match(motion,/data-reveal="media"\]\.motion-pending > \.motion-content\s*\{\s*transform:\s*translateY\(var\(--motion-travel,32px\)\) scale\(1\.04\)/,'media begins with a small cropped zoom');
 assert.match(motion,/data-reveal-frame\]\.motion-pending > \.motion-content[^}]*transition-duration:\s*300ms;\s*transition-delay:\s*0ms/,'reverse exit is short and has no stagger');
 assert.match(motion,/@media \(prefers-reduced-motion: no-preference\)/,'reveals require motion permission');
 console.log('PASS home motion: five locales, stable frames, bounded stagger and controlled media geometry');
} finally {await rm(temp,{recursive:true,force:true})}
