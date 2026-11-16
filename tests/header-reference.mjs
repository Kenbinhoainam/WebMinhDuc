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
  assert.deepEqual([...row.children].map(el=>el.className),['brand header-logo','header-actions header-right']);
  assert.deepEqual([...row.querySelector('.header-actions').children].map(el=>el.className),['header-search','header-contact','header-saved','language-selector','menu-button']);
  assert.match(doc.querySelector('.brand img').getAttribute('src'),/minh-duc-logo/);
  assert.equal(doc.querySelector('.desktop-nav'),null);assert.ok(doc.querySelector('.menu-button'));
  assert.match(doc.querySelector('.language-trigger').getAttribute('aria-label'),new RegExp(localeNames[locale]));
  assert.equal(doc.querySelectorAll('.no-script-nav > ul > li').length,7);assert.equal(doc.querySelectorAll('.no-script-nav ul ul a').length,19);
  dom.window.close();
 }
 const css=await readFile('src/sprint-navigation.css','utf8'), sheet=postcss.parse(css);
 const declarations=selector=>{const values=[];sheet.walkRules(rule=>{if(rule.selectors.includes(selector))rule.walkDecls(decl=>values.push([decl.prop,decl.value]));});return values;};
 assert.ok(declarations('.site-header.site-header').some(([p,v])=>p==='background'&&v==='transparent'));
 assert.ok(declarations('.site-header::before').some(([p,v])=>p==='background'&&v.includes('linear-gradient')));
 assert.ok(declarations('.site-header .header-inner').some(([p,v])=>p==='height'&&v==='5rem'));
 assert.ok(declarations('body:not(:has(.page-banner-main, .section-home-banner)) .site-header').some(([p,v])=>p==='position'&&v==='sticky'),'bannerless pages use an in-flow contrast header');
 assert.doesNotMatch(css,/\.desktop-nav|\.hero-shade|\.page-hero/,'obsolete desktop menu and hero scrims removed');
 console.log('PASS compact reference header: five locales, original logo, control order, fallback sitemap and source geometry');
}finally{await rm(temp,{recursive:true,force:true})}
