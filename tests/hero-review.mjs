import {build} from 'esbuild';
import {mkdir, rm, readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {MemoryRouter} from 'react-router-dom';

const temp='.hero-review'; await mkdir(temp,{recursive:true});
try {
 await build({stdin:{contents:"export {default as Hero} from './src/HomeHero'; export {LocaleProvider,localeBase} from './src/i18n'; export {loadLocale} from './src/i18n-runtime/catalog';",resolveDir:process.cwd(),sourcefile:'hero-review.tsx'},bundle:true,platform:'node',format:'esm',packages:'external',loader:{'.css':'empty'},outfile:`${temp}/bundle.mjs`,logLevel:'silent'});
 const {Hero,LocaleProvider,localeBase,loadLocale}=await import(pathToFileURL(`${process.cwd()}/${temp}/bundle.mjs`).href);
 const assets=JSON.parse(await readFile('src/hero-assets.json','utf8'));
 let viCopy;
 for(const locale of ['vi','en','zh','ko','ja']){
  await loadLocale(locale);const base=localeBase(locale);
  const html=renderToStaticMarkup(React.createElement(LocaleProvider,{value:locale},React.createElement(MemoryRouter,{basename:base||'/',initialEntries:[`${base}/`]},React.createElement(Hero))));
  const dom=new JSDOM(html),doc=dom.window.document,heading=doc.querySelector('h1'),video=doc.querySelector('video'),poster=doc.querySelector('.hero-poster');
  assert.equal(doc.querySelectorAll('h1').length,1);assert.ok(!heading.closest('[aria-hidden="true"]'));assert.ok(heading.textContent.trim());
  assert.deepEqual([...doc.querySelectorAll('.hero-brand-finish .hero-actions a')].map(a=>a.getAttribute('href')),[`${base||"/"}#business-contact`,`${base}/jobs`]);assert.equal(doc.querySelectorAll('.hero-actions').length,1,'one CTA group in end card');assert.equal(doc.querySelectorAll('.hero-end-card .hero-actions a').length,2,'both links belong to compact end card');assert.ok(doc.querySelector('.hero-end-card .hero-finish-logo'));
  const copy=[heading.textContent,...[...doc.querySelectorAll('.hero-actions a')].map(a=>a.textContent),doc.querySelector('.hero-finish-slogan').textContent,doc.querySelector('.video-control').getAttribute('aria-label')];
  if(locale==='vi')viCopy=copy;else assert.ok(copy.every((s,i)=>s!==viCopy[i]),`${locale}: hero messages translated`);
  assert.equal(video.getAttribute('src'),null);assert.equal(video.getAttribute('preload'),'none');assert.equal(video.hasAttribute('loop'),false);assert.equal(video.hasAttribute('autoplay'),false,'all playback is gated explicitly');assert.equal(video.hasAttribute('playsinline'),true);
  assert.equal(poster.getAttribute('src'),assets.poster);assert.equal(poster.getAttribute('fetchpriority'),'high');assert.equal(poster.getAttribute('alt'),'');
  assert.notEqual(doc.querySelector('.hero-brand-finish').getAttribute('aria-hidden'),'true','brand content is available without JavaScript');assert.ok(doc.querySelector('noscript').textContent.includes('.hero-brand-finish'));
  dom.window.close();
 }
 const css=await readFile('src/hero-media.css','utf8');
 assert.match(css,/\.hero-media \.hero-poster,\.hero-media video\s*\{[^}]*object-fit:contain;object-position:center/,'film remains centered and uncropped');
 assert.match(css,/\.home-hero \.hero-stage\s*\{[^}]*width:100%;aspect-ratio:16\/9;min-height:0/,'all playback viewports keep native16:9 without height floor');
 const stageRule=css.match(/\.home-hero \.hero-stage\s*\{([^}]*)\}/)[1];
 assert.ok(!stageRule.includes('url(')&&!stageRule.includes('100svh'),'active stage cannot expose decorative photo or viewport-ratio bands');
 const mediaRule=css.match(/\.hero-media\s*\{([^}]*)\}/)[1];
 assert.match(mediaRule,/background:#[0-9a-f]{6}(?:;|$)/i,'media has an opaque backing');
 assert.match(css,/\.hero-brand-finish\.is-visible\s*\{[^}]*position:relative[^}]*pointer-events:auto/,'visible conclusion contributes intrinsic height and accepts links');
 assert.match(css,/\.hero-brand-finish\.is-visible::before\s*\{[^}]*background-image:url/,'decorative image belongs only to finish state');
 assert.ok(!css.includes('min-height:100svh'),'finish growth uses content rather than a forced viewport floor');
 console.log('PASS hero SSR: five locales, two fixed CTAs, accessible heading, poster-first, end-card fallback and responsive source rules');
} finally {await rm(temp,{recursive:true,force:true});}
