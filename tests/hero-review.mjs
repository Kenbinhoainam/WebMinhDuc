import {build} from 'esbuild';
import {mkdir, rm, readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import postcss from 'postcss';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {MemoryRouter} from 'react-router-dom';

// Independent server/content and source-cascade checks, not browser layout tests.
const temp = '.hero-review';
await mkdir(temp, {recursive: true});
try {
  await build({stdin: {contents: "export {default as Hero} from './src/HomeHero'; export {LocaleProvider,localeBase} from './src/i18n'; export {loadLocale} from './src/i18n-runtime/catalog';", resolveDir: process.cwd(), sourcefile: 'hero-review.tsx'}, bundle: true, platform: 'node', format: 'esm', packages: 'external', loader: {'.css': 'empty'}, outfile: `${temp}/bundle.mjs`, logLevel: 'silent'});
  const {Hero, LocaleProvider, localeBase, loadLocale} = await import(pathToFileURL(`${process.cwd()}/${temp}/bundle.mjs`).href);
  const expected = {
    vi: ['Kết nối nhân lực.', 'Phát chuyển động', 'Tôi cần tuyển nhân lực', 'Tôi đang tìm việc'],
    en: ['Connecting people.', 'Play motion', 'I need to hire staff', 'I am looking for work'],
    zh: ['连接人才。', '播放动态效果', '我需要招聘人力', '我在找工作'],
    ko: ['인력을 연결합니다.', '움직임 재생', '인력 채용이 필요합니다', '일자리를 찾고 있습니다'],
    ja: ['人材をつなぐ。', '動きを再生', '人材を採用したい', '仕事を探しています'],
  };
  let vietnameseCopy;
  for (const [locale, [brand, play, hire, jobs]] of Object.entries(expected)) {
    await loadLocale(locale);
    const base = localeBase(locale);
    const html = renderToStaticMarkup(React.createElement(LocaleProvider, {value: locale}, React.createElement(MemoryRouter, {basename: base || '/', initialEntries: [`${base}/`]}, React.createElement(Hero))));
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    assert.equal(doc.querySelectorAll('h1').length, 1, `${locale}: one real hero heading`);
    const h1 = doc.querySelector('h1');
    assert.ok(!h1.closest('[aria-hidden="true"]'));
    assert.equal(h1.hasAttribute('aria-live'), false, 'rotation must not announce every cycle');
    for (const group of [h1, doc.querySelector('.hero-description-grid')]) {
      const layers = [...group.children];
      assert.equal(layers.length, 4, `${locale}: all copy layers are present on first render`);
      assert.equal(layers.filter(layer => layer.dataset.active === 'true').length, 1);
      assert.equal(layers[0].dataset.active, 'true');
      assert.notEqual(layers[0].getAttribute('aria-hidden'), 'true');
      assert.ok(layers.every(layer => layer.textContent.trim().length > 0));
      assert.ok(layers.slice(1).every(layer => layer.getAttribute('aria-hidden') === 'true'));
    }
    const copy = [...doc.querySelectorAll('.hero-copy .hero-slide')].map(layer => layer.textContent.trim());
    if (locale === 'vi') vietnameseCopy = copy;
    else assert.ok(copy.every((text, index) => text !== vietnameseCopy[index]), `${locale}: every rotating title and description is translated`);
    assert.ok(h1.firstElementChild.textContent.startsWith(brand), `${locale}: initial accessible title is the localized brand`);
    const links = [...doc.querySelectorAll('.hero-actions a')];
    assert.deepEqual(links.map(link => link.getAttribute('href')), [`${base}/services`, `${base}/jobs`]);
    assert.deepEqual(links.map(link => link.textContent.trim()), [hire, jobs]);
    assert.equal(doc.querySelector('.video-control').getAttribute('aria-label'), play);
    assert.ok(!doc.querySelector('.hero-bottom,.hero-caption,.scroll-hint,.hero-semantic-title'));
    const poster = doc.querySelector('.hero-poster');
    assert.equal(poster.getAttribute('fetchpriority'), 'high');
    assert.equal(poster.getAttribute('alt'), '');
    assert.notEqual(poster.getAttribute('loading'), 'lazy');
    assert.equal(doc.querySelector('video').getAttribute('src'), null, 'static HTML does not force constrained users to fetch video');
    dom.window.close();
  }
  const media = postcss.parse(await readFile('src/hero-media.css', 'utf8'));
  const declarations = selector => {
    const result = new Map();
    media.walkRules(rule => { if (rule.selectors.includes(selector)) rule.walkDecls(decl => result.set(decl.prop, decl.value)); });
    return result;
  };
  for (const selector of ['.hero-title-grid', '.hero-description-grid']) assert.equal(declarations(selector).get('display'), 'grid', 'copy layers share a height-reserving grid');
  assert.equal(declarations('.hero-slide').get('grid-area'), '1 / 1');
  for (const selector of ['.hero-slide', '.hero-slide[data-active="true"]']) {
    assert.notEqual(declarations(selector).get('display'), 'none', 'inactive translated copy must still reserve its intrinsic height');
    assert.notEqual(declarations(selector).get('position'), 'absolute');
  }
  const visual = postcss.parse(await readFile('src/flagshipvisual.css', 'utf8'));
  let autoHeight = false;
  visual.walkRules('.home-hero', rule => rule.walkDecls('height', decl => {
    assert.equal(decl.value, 'auto', 'localized hero content can grow beyond the visual target height'); autoHeight = true;
  }));
  assert.ok(autoHeight);
  console.log('PASS independent hero: five localized SSR states, one accessible H1, reserved copy layers, fixed CTAs, poster-first markup and auto-height source constraints');
} finally {
  await rm(temp, {recursive: true, force: true});
}
