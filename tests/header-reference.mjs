import {build} from 'esbuild';
import {mkdir,rm,readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import postcss from 'postcss';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {MemoryRouter} from 'react-router-dom';

// Server markup and stylesheet checks; these do not replace viewport screenshots.
const temp='.header-reference-test';await mkdir(temp,{recursive:true});
try {
 await build({stdin:{contents:"export {Header} from './src/Header'; export {LocaleProvider,localeNames} from './src/i18n'; export {loadLocale} from './src/i18n-runtime/catalog';",resolveDir:process.cwd(),sourcefile:'header-reference.tsx'},bundle:true,platform:'node',format:'esm',packages:'external',loader:{'.css':'empty'},outfile:`${temp}/bundle.mjs`,logLevel:'silent'});
 const {Header,LocaleProvider,localeNames,loadLocale}=await import(pathToFileURL(`${process.cwd()}/${temp}/bundle.mjs`).href);
 for(const locale of ['vi','en','zh','ko','ja']){
  await loadLocale(locale);const html=renderToStaticMarkup(React.createElement(LocaleProvider,{value:locale},React.createElement(MemoryRouter,null,React.createElement(Header))));
  const dom=new JSDOM(html),doc=dom.window.document,row=doc.querySelector('.header-inner');
  assert.deepEqual([...row.children].map(el=>el.className),['brand','desktop-nav','header-actions']);
  assert.deepEqual([...row.querySelector('.header-actions').children].map(el=>el.className),['header-search','header-saved','language-selector','header-contact','menu-button']);
  assert.match(doc.querySelector('.brand img').getAttribute('src'),/minh-duc-logo/);
  assert.equal(doc.querySelectorAll('.desktop-nav-group').length,7);assert.equal(doc.querySelectorAll('.desktop-subnav a').length,14);assert.equal(doc.querySelectorAll('.desktop-nav svg').length,0,'navigation has no arrow icons');assert.ok(doc.querySelector('.menu-button'));
  assert.match(doc.querySelector('.language-trigger').getAttribute('aria-label'),new RegExp(localeNames[locale]));
  assert.equal(doc.querySelectorAll('.no-script-nav > ul > li').length,7);assert.equal(doc.querySelectorAll('.no-script-nav ul ul a').length,14);
  dom.window.close();
 }
 const css=await readFile('src/sprint-navigation.css','utf8'), sheet=postcss.parse(css);
 const declarations=selector=>{const values=[];sheet.walkRules(rule=>{if(rule.selectors.includes(selector))rule.walkDecls(decl=>values.push([decl.prop,decl.value]));});return values;};
 assert.ok(declarations('.site-header.site-header').some(([p,v])=>p==='background'&&v==='transparent'));
 assert.ok(declarations('.site-header.site-header.is-scrolled').some(([p,v])=>p==='background'&&v==='rgba(250,252,252,.97)'),'scrolled header uses high-opacity light glass');
 assert.ok(declarations('.site-header.site-header.is-scrolled').some(([p,v])=>p==='color'&&v==='#20343e'),'scrolled header uses dark foreground');
 assert.ok(declarations('.site-header::before').some(([p,v])=>p==='background'&&v==='transparent'),'top header has no dark background slab');
 assert.equal(declarations('.site-header:not(.is-scrolled) .brand::before').length,0,'logo halo removed');
 assert.ok(declarations('main:has(.section-home-banner)').some(([p,v])=>p==='padding-top'&&v==='72px'),'mobile home reserves a header row');
 assert.ok(declarations('body:has(.home-hero:is([data-stage="ended"],[data-stage="fallback"])) .site-header:not(.is-scrolled)').some(([p,v])=>p==='color'&&v==='#20343e'),'bright end frame uses dark header text');
 assert.ok(declarations('body:has(.home-hero:is([data-stage="ended"],[data-stage="fallback"])) .site-header:not(.is-scrolled) .desktop-nav-heading > a').some(([p,v])=>p==='text-shadow'&&v==='none'),'end frame removes dark text shadow');
 assert.ok(declarations('.site-header .brand').some(([p,v])=>p==='width'&&v==='92px'),'transparent original logo has a larger default width');
 assert.ok(declarations('.site-header .brand').some(([p,v])=>p==='overflow'&&v==='visible'),'logo halo is not clipped by base brand styles');
 assert.ok(declarations('.site-header .header-inner').some(([p,v])=>p==='height'&&v==='5rem'));
 assert.ok(declarations('body:not(:has(.page-banner-main, .section-home-banner)) .site-header').some(([p,v])=>p==='position'&&v==='sticky'),'bannerless pages use an in-flow contrast header');
 let narrowChevron=false,narrowTarget=false;sheet.walkAtRules('media',rule=>{if(!/max-width:\s*380px/.test(rule.params))return;rule.walkRules(child=>{if(child.selector==='.site-header .language-trigger .language-chevron')child.walkDecls('display',decl=>{if(decl.value==='none')narrowChevron=true});if(child.selector==='.site-header .language-trigger')child.walkDecls('min-width',decl=>{if(decl.value==='44px')narrowTarget=true})})});assert.ok(narrowChevron&&narrowTarget,'narrow header hides decorative locale chevron and retains 44px target');
 assert.match(css,/@media \(min-width:1280px\)/,'desktop navigation has a wide responsive breakpoint');
 assert.match(css,/grid-template-columns:repeat\(7,minmax\(0,1fr\)\)/,'seven groups can shrink without overflowing');
 assert.match(css,/\.header-shell\s*\{\s*width:min\(1800px,calc\(100% - 40px\)\)/,'header width is independent of body container');
 assert.doesNotMatch(css,/\.hero-shade|\.page-hero/,'obsolete hero scrims removed');
 console.log('PASS wide and compact header: five locales, original logo, control order, fallback sitemap and source geometry');
}finally{await rm(temp,{recursive:true,force:true})}
