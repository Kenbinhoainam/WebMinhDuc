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
  assert.deepEqual([...row.querySelector('.header-actions').children].map(el=>el.className),['header-search','header-saved','language-selector','menu-button']);
  assert.match(doc.querySelector('.brand img').getAttribute('src'),/minh-duc-logo/);
  assert.equal(doc.querySelectorAll('.desktop-nav-group').length,7);assert.equal(doc.querySelectorAll('.desktop-subnav a').length,14);assert.equal(doc.querySelectorAll('.desktop-nav svg').length,0,'navigation has no arrow icons');assert.ok(doc.querySelector('.menu-button'));
  assert.match(doc.querySelector('.language-trigger').getAttribute('aria-label'),new RegExp(localeNames[locale]));
  assert.equal(doc.querySelectorAll('.no-script-nav > ul > li').length,7);assert.equal(doc.querySelectorAll('.no-script-nav ul ul a').length,14);
  dom.window.close();
 }
 for(const slug of ['chuyen-vien-tuyen-dung-bac-ninh','cong-tac-vien-tuyen-dung-quang-ninh'])for(const suffix of ['', '/']){
  const html=renderToStaticMarkup(React.createElement(LocaleProvider,{value:'vi'},React.createElement(MemoryRouter,{initialEntries:[`/jobs/${slug}${suffix}`]},React.createElement(Header))));
  const dom=new JSDOM(html),d=dom.window.document;
  assert.ok(!d.querySelector('header').hasAttribute('data-home'),'detail gets a light header in flow');
  assert.ok(d.querySelector('.desktop-nav-heading a[href="/careers"]').classList.contains('active'),'internal role belongs to Careers');
  assert.ok(!d.querySelector('.desktop-nav-heading a[href="/jobs"]').classList.contains('active'),'factory menu is not active for internal role');
  dom.window.close();
 }
 const css=await readFile('src/sprint-navigation.css','utf8'), sheet=postcss.parse(css);
 const declarations=selector=>{const values=[];sheet.walkRules(rule=>{if(rule.selectors.includes(selector))rule.walkDecls(decl=>values.push([decl.prop,decl.value]));});return values;};
 assert.ok(declarations('.site-header.site-header').some(([p,v])=>p==='position'&&v==='sticky'),'light pages reserve a header row');
 assert.ok(declarations('.site-header[data-home="true"]').some(([p,v])=>p==='position'&&v==='fixed'),'only desktop home overlays the film');
 assert.ok(declarations('.site-header.site-header.is-scrolled').some(([p,v])=>p==='background'&&v.includes('.98')),'scrolled bar is near opaque');
 assert.ok(declarations('.desktop-nav-heading > a').some(([p,v])=>p==='white-space'&&v==='nowrap'),'long navigation labels stay on one line');
 assert.ok(declarations('.desktop-nav > ul').some(([p,v])=>p==='display'&&v==='flex'),'groups use their intrinsic widths');
 assert.ok(!css.includes('text-shadow'),'navigation has no blurred text rim');
 assert.match(css,/data-show-brand="true"/,'bright end card keeps dark navigation');
 let narrowChevron=false,narrowTarget=false;sheet.walkAtRules('media',rule=>{if(!/max-width:\s*380px/.test(rule.params))return;rule.walkRules(child=>{if(child.selector==='.site-header .language-trigger .language-chevron')child.walkDecls('display',decl=>{if(decl.value==='none')narrowChevron=true});if(child.selector==='.site-header .language-trigger')child.walkDecls('min-width',decl=>{if(decl.value==='44px')narrowTarget=true})})});assert.ok(narrowChevron&&narrowTarget,'narrow header hides decorative locale chevron and retains 44px target');
 assert.match(css,/@media \(min-width:1280px\)/,'desktop navigation has a wide responsive breakpoint');
 assert.doesNotMatch(css,/\.hero-shade|\.page-hero/,'obsolete hero scrims removed');
 console.log('PASS wide and compact header: five locales, original logo, control order, fallback sitemap and source geometry');
}finally{await rm(temp,{recursive:true,force:true})}
