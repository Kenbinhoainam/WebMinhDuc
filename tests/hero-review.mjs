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
  assert.deepEqual([...doc.querySelectorAll('.hero-entry-bar a')].map(a=>a.getAttribute('href')),[`${base||"/"}#business-contact`,`${base}/jobs`],'action order is consistent during playback and on the end card');
  assert.equal(heading.closest('.hero-introduction')?.querySelectorAll('.hero-entry-bar a').length,2);
  assert.equal(doc.querySelector('.home-hero').dataset.decorativeImages,'false','SSR waits for data preferences before loading decorative photos');
  const copy=[heading.textContent,...[...doc.querySelectorAll('.hero-actions a')].map(a=>a.textContent),doc.querySelector('.hero-finish-slogan').textContent,doc.querySelector('.video-control').getAttribute('aria-label')];
  if(locale==='vi')viCopy=copy;else assert.ok(copy.every((s,i)=>s!==viCopy[i]),`${locale}: hero messages translated`);
  assert.equal(video.getAttribute('src'),null);assert.equal(video.getAttribute('preload'),'none');assert.equal(video.hasAttribute('loop'),false);assert.equal(video.hasAttribute('autoplay'),false,'all playback is gated explicitly');assert.equal(video.hasAttribute('playsinline'),true);
  assert.equal(poster.getAttribute('src'),assets.poster);assert.equal(poster.getAttribute('fetchpriority'),'high');assert.equal(poster.getAttribute('alt'),'');
  assert.notEqual(doc.querySelector('.hero-brand-finish').getAttribute('aria-hidden'),'true','brand content is available without JavaScript');assert.ok(doc.querySelector('noscript').textContent.includes('.hero-brand-finish'));
  dom.window.close();
 }
 const css=await readFile('src/hero-media.css','utf8');
 assert.match(css,/\.hero-media \.hero-poster,\.hero-media video\s*\{[^}]*object-fit:contain;object-position:center/,'film remains centered and uncropped');
 const layoutDom=new JSDOM('<style>'+css+'</style><section class="home-hero section-home-banner" data-show-brand="true"><div class="hero-stage"><div class="hero-brand-finish is-visible"></div></div></section>');
 const {window}=layoutDom, hero=window.document.querySelector('.home-hero'), box=hero.querySelector('.hero-stage');
 assert.equal(window.getComputedStyle(box).minHeight,window.getComputedStyle(hero).minHeight,'playing and paused layouts reserve the same room');
 assert.equal(window.getComputedStyle(hero.querySelector('.hero-brand-finish')).position,'relative','visible conclusion contributes intrinsic height');
 const rules=[...window.document.styleSheets[0].cssRules];
 const mediaRules=query=>rules.filter(rule=>rule.conditionText===query).flatMap(rule=>[...rule.cssRules]);
 const portraitFilm=mediaRules('(orientation: portrait)').find(rule=>rule.selectorText?.endsWith(' .hero-media'));
 assert.equal(portraitFilm.style.aspectRatio.replace(/\s/g,''),'16/9','portrait reserves a full-width frame without cropping edge titles');
 assert.ok(mediaRules('(height:1svh)').some(rule=>rule.style.getPropertyValue('--hero-room').includes('svh')),'mobile toolbar changes do not resize the stage');
 for(const scope of [rules,mediaRules('(max-width: 767px)')]){
  const controls=scope.find(rule=>rule.selectorText==='.home-hero .hero-player-tools');
  assert.ok(controls.style.right && controls.style.bottom && !controls.style.left,'playback and sound occupy the lower right on desktop and mobile');
 }
 window.close();
 const stageRule=css.match(/\.home-hero \.hero-stage\s*\{([^}]*)\}/)[1];
 assert.ok(!stageRule.includes('url('),'active stage cannot expose the decorative architecture behind the film');
 const mediaRule=css.match(/\.hero-media\s*\{([^}]*)\}/)[1];
 assert.match(mediaRule,/background:#[0-9a-f]{6}(?:;|$)/i,'media has an opaque backing');
 assert.match(css,/\.hero-brand-finish\.is-visible::before\s*\{[^}]*background-image:var\(--atrium-finish,none\)/,'the full-size image is only consumed on the end card');
 const portraitPhoto=mediaRules('(orientation: portrait)').find(rule=>rule.selectorText?.endsWith('.hero-introduction::before'));
 assert.ok(portraitPhoto.style.backgroundImage.includes('--atrium-small'),'portrait reads the compact architectural photo');
 assert.ok(mediaRules('(prefers-reduced-data: reduce)').some(rule=>rule.style.getPropertyValue('--atrium-small')==='none'));
 assert.ok(!css.includes('min-height:100svh'),'finish growth uses content rather than a forced viewport floor');
 console.log('PASS hero SSR: five locales, two fixed CTAs, accessible heading, poster-first, end-card fallback and responsive source rules');
} finally {await rm(temp,{recursive:true,force:true});}
