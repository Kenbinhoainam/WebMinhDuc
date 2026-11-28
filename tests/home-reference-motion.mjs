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
  const intro=doc.getElementById('about');
  assert.ok(intro.querySelector('.home-team-portrait img[alt]:not([alt=""])'));
  assert.equal(intro.querySelector('.home-introduction-copy').dataset.reveal,'left');
  assert.equal(intro.querySelector('.home-team-portrait').dataset.reveal,'right');
  assert.equal(intro.querySelector('.home-about-action').getAttribute('href'),'/about-us#profile');
  const metrics=[...intro.querySelectorAll('.home-figures[data-count-group] > .home-figure')];
  assert.equal(metrics.length,4);
  assert.ok(metrics.every(x=>!x.hasAttribute('data-reveal') && x.querySelector('[data-count-to]')),'one shared counter timeline keeps every metric legible without individual reveal delays');
  assert.equal(doc.querySelector('.section-home-solution h2').closest('[data-reveal]').dataset.reveal,'zoom');
  assert.equal(doc.querySelectorAll('.partners-strip').length,1);
  const titles=[...doc.querySelectorAll('.service-gallery-card h3')].map(node=>node.textContent.trim());
  assert.equal(new Set(titles).size,5,'service titles remain visible and distinct');
  if(locale==='vi')vietnameseTitles=titles;
  else assert.ok(titles.every((title,i)=>title!==vietnameseTitles[i]),`${locale}: every service title is localized`);
  assert.equal(doc.querySelectorAll('[data-reveal] [data-reveal]').length,0,'no nested animated targets');
  dom.window.close();
 }
 const motion=await readFile('src/motion.css','utf8');
 assert.match(motion,/data-reveal="zoom-right"\]\.motion-pending > \.motion-content\s*\{\s*transform:\s*translateX\(calc\(-1 \* var\(--motion-travel,8px\)\)\) scale\(\.96\)/,'controlled zoom starts from the left');
 assert.match(motion,/data-reveal="media"\]\.motion-pending > \.motion-content\s*\{\s*transform:\s*translateY\(var\(--motion-travel,8px\)\) scale\(1\.04\)/,'media begins with a small cropped zoom');
 assert.match(motion,/data-reveal-frame\]\.motion-pending > \.motion-content[^}]*transition-duration:\s*var\(--motion-t2\);\s*transition-delay:\s*0ms/,'reverse exit is short and has no stagger');
 assert.match(motion,/@media \(prefers-reduced-motion: no-preference\)/,'reveals require motion permission');
 console.log('PASS home motion: five locales, stable frames, bounded stagger and controlled media geometry');
} finally {await rm(temp,{recursive:true,force:true})}
