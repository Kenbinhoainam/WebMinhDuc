import {build} from 'esbuild';
import {mkdir, rm, readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import postcss from 'postcss';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {MemoryRouter, Routes, Route} from 'react-router-dom';

// Structural requirements inspected in the supplied reference templates. These
// check real regions/content/controls, but cannot establish pixel equivalence.
const temp = '.reference-structure-test';
await mkdir(temp, {recursive: true});
try {
  await build({stdin: {contents: "export {default as Home} from './src/Home'; export {AboutPage,ServicesPage,NewsPage} from './src/InfoPages'; export {JobsPage,CareersPage,JobDetailPage,jobs} from './src/JobsPages'; export {ContactPage} from './src/Contact'; export {LocaleProvider,localeBase} from './src/i18n'; export {loadLocale} from './src/i18n-runtime/catalog';", resolveDir: process.cwd(), sourcefile: 'reference-structure.tsx'}, bundle: true, platform: 'node', format: 'esm', packages: 'external', loader: {'.css': 'empty'}, outfile: `${temp}/bundle.mjs`, logLevel: 'silent'});
  const components = await import(pathToFileURL(`${process.cwd()}/${temp}/bundle.mjs`).href);
  const {LocaleProvider, localeBase, loadLocale, jobs} = components;
  const cases = [['/', '/', 'Home'], ['/about-us', '/about-us', 'AboutPage'], ['/services', '/services', 'ServicesPage'], ['/news', '/news', 'NewsPage'], ['/jobs', '/jobs', 'JobsPage'], ['/careers', '/careers', 'CareersPage'], [`/jobs/${jobs[0].slug}`, '/jobs/:slug', 'JobDetailPage'], ['/contact', '/contact', 'ContactPage']];
  for (const locale of ['vi', 'en', 'zh', 'ko', 'ja']) {
    await loadLocale(locale);
    const base = localeBase(locale);
    for (const [path, pattern, name] of cases) {
      const html = renderToStaticMarkup(React.createElement(LocaleProvider, {value: locale}, React.createElement(MemoryRouter, {basename: base || '/', initialEntries: [`${base}${path}`]}, React.createElement(Routes, null, React.createElement(Route, {path: pattern, element: React.createElement(components[name])})))));
      const dom = new JSDOM(`<main>${html}</main>`);
      const doc = dom.window.document;
      const label = `${locale} ${path}`;
      assert.equal(doc.querySelectorAll('h1').length, 1, `${label}: one page title`);
      assert.ok(doc.querySelector('h1').textContent.trim());
      for (const image of doc.querySelectorAll('img')) {
        const candidates = [image.getAttribute('src'), ...(image.getAttribute('srcset') || '').split(',').map(value=>value.trim().split(/\s+/)[0])].filter(Boolean);
        for (const url of candidates) if (url.startsWith('/')) assert.ok(existsSync(`public${decodeURIComponent(new URL(url,'https://example.test').pathname)}`), `${label}: missing local image ${url}`);
      }
      for (const node of doc.querySelectorAll('a[href],form[action],script[src],iframe[src]')) {
        const url = node.getAttribute('href') || node.getAttribute('action') || node.getAttribute('src') || '';
        assert.doesNotMatch(url, /^(?:https?:)?\/\/(?:www\.)?hr2b\.com|^(?:mailto:)[^\s]*@hr2b\.com/i, `${label}: reference presentation must not restore HR2B service endpoints`);
      }
      if (name === 'Home') {
        const sections = [...doc.querySelector('main').children].filter(node => node.tagName === 'SECTION');
        assert.deepEqual(sections.map(node => [...node.classList].find(value => value.startsWith('section-home-'))), ['section-home-banner','section-home-about','section-home-about-achievement','section-home-solution','section-home-customer','section-home-coop','section-home-news','section-home-event','section-home-video'], `${label}: reference homepage sequence without added FAQ/CTA`);
        const customers = doc.querySelector('.section-home-customer');
        assert.ok(customers.querySelector('.partners-track'), 'customer composition includes its logo rail');
        assert.ok(customers.querySelectorAll('.ref-customer-review article').length >= 1, 'testimonial composition is separate');
        assert.ok(!doc.querySelector('.section-home-coop .partners-track'), 'cooperation logos are a static grid');
        assert.equal(doc.querySelectorAll('.ref-partner-grid > *').length, 5, 'authorized partner content remains');
        assert.ok(doc.querySelectorAll('.section-home-news article').length > 3, 'news rail has content beyond the three visible desktop cards');
        assert.equal(doc.querySelectorAll('.section-home-news .ref-rail-controls button').length, 2);
        assert.equal(doc.querySelectorAll('.section-home-video button.ref-video-card').length, 4);
        assert.equal(doc.querySelector('.section-home-video video'), null, 'intro movie loads only after activation');
      }
      if (name === 'AboutPage') {
        assert.equal(doc.querySelectorAll('.info-about-values article').length, 3);
        assert.equal(doc.querySelectorAll('.info-stat-grid article').length, 4);
        assert.equal(doc.querySelector('[role="tablist"]'), null, 'source simultaneous cards replace custom tabs');
        for (const id of ['history', 'achievements']) assert.ok(doc.getElementById(id), `${label}: preserved navigation anchor ${id}`);
        assert.ok(doc.querySelector('form'), 'reference About ends with usable consultation form');
      }
      if (name === 'ServicesPage') {
        assert.equal(doc.querySelector('[role="tablist"]'), null);
        assert.equal(doc.querySelectorAll('.info-service-card').length, 5);
        assert.ok(doc.querySelector('.info-service-cards[tabindex="0"]'), 'service rail is keyboard reachable');
      }
      if (name === 'NewsPage') {
        assert.ok(doc.querySelector('.info-featured-news article'), 'feature presentation remains separate');
        assert.equal(doc.querySelectorAll('.info-featured-news button').length, 2, 'feature presentation exposes previous/next controls');
        assert.ok(doc.querySelectorAll('.info-news-grid article').length > 1, 'regular article listing remains separate');
      }
      if (name === 'JobDetailPage') {
        assert.equal(doc.querySelector('.page-banner-main,.page-hero'), null, 'job detail has no extra image hero');
        assert.ok(doc.querySelector('.job-detail-intro h1'));
        assert.ok(doc.querySelector('.job-detail-layout > aside'));
        assert.ok(doc.querySelector('.job-apply-button,.job-closed'));
      }
      if (name === 'ContactPage') {
        assert.equal(doc.querySelectorAll('.contact-office').length, 3);
        assert.equal(doc.querySelectorAll('details.contact-office > summary').length, 3);
        assert.ok(doc.querySelector('form.contact-form'));
        assert.ok(doc.getElementById('consultation'));
      }
      dom.window.close();
    }
  }
  const css = postcss.parse(await readFile('src/home-reference.css', 'utf8'));
  let rail = false, grid = false;
  css.walkRules('.ref-news-grid', rule => rule.walkDecls('overflow-x', decl => {if (decl.value === 'auto') rail = true;}));
  css.walkRules('.ref-partner-grid', rule => rule.walkDecls('display', decl => {if (decl.value === 'grid') grid = true;}));
  assert.ok(rail && grid, 'news rail and static partner-grid source rules are present');
  const dom = new JSDOM('<div id="root"></div>', {url:'https://example.test/news', pretendToBeVisual:true});
  for (const key of ['window','document','navigator','HTMLElement','Element','Node','Event','MutationObserver']) Object.defineProperty(globalThis,key,{configurable:true,value:dom.window[key]});
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const {createRoot} = await import('react-dom/client');
  const root = createRoot(document.getElementById('root'));
  try {
    await React.act(()=>root.render(React.createElement(LocaleProvider,{value:'vi'},React.createElement(MemoryRouter,{initialEntries:['/news']},React.createElement(components.NewsPage)))));
    const first = document.querySelector('.info-featured-news h2').textContent;
    const listing = [...document.querySelectorAll('.info-news-grid h2')].map(node=>node.textContent);
    await React.act(()=>document.querySelectorAll('.info-featured-news button')[1].click());
    assert.notEqual(document.querySelector('.info-featured-news h2').textContent, first, 'next feature advances actual content');
    assert.deepEqual([...document.querySelectorAll('.info-news-grid h2')].map(node=>node.textContent), listing, 'feature navigation does not replace the regular listing');
    await React.act(()=>document.querySelectorAll('.info-featured-news button')[0].click());
    assert.equal(document.querySelector('.info-featured-news h2').textContent, first, 'previous feature returns to prior content');
  } finally { await React.act(()=>root.unmount()); dom.window.close(); }
  console.log('PASS reference structures: eight page types × five locales, source section compositions, CTA/form/anchor retention, no HR2B endpoints');
} finally {
  await rm(temp, {recursive: true, force: true});
}
