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
    vi: ['Kết nối nhân lực.', 'Phát chuyển động', 'Tìm hiểu Minh Đức'],
    en: ['Connecting people.', 'Play motion', 'About Minh Đức'],
    zh: ['连接人才。', '播放动态效果', '了解 Minh Đức'],
    ko: ['인력을 연결합니다.', '움직임 재생', 'Minh Đức 알아보기'],
    ja: ['人材をつなぐ。', '動きを再生', 'Minh Đứcを知る'],
  };
  let vietnameseCopy;
  for (const [locale, [brand, play, about]] of Object.entries(expected)) {
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
    assert.deepEqual(links.map(link => link.getAttribute('href')), [`${base}/about-us`]);
    assert.deepEqual(links.map(link => link.textContent.trim()), [about]);
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
  assert.equal(declarations('.hero-description-grid .hero-slide').get('margin'), '0', 'stacked copy does not inherit the global paragraph bottom margin');
  assert.equal(declarations('.home-hero.section-home-banner').get('color'), '#fff', 'hero copy keeps a readable foreground over the dark video shade');
  for (const selector of ['.hero-slide', '.hero-slide[data-active="true"]']) {
    assert.notEqual(declarations(selector).get('display'), 'none', 'inactive translated copy must still reserve its intrinsic height');
    assert.notEqual(declarations(selector).get('position'), 'absolute');
  }
  assert.notEqual(declarations('.section-home-banner .hero-content').get('position'), 'absolute', 'localized content must contribute to frame height rather than being clipped inside a fixed frame');
  assert.equal(declarations('.section-home-banner .item-banner').get('height'), 'auto', 'reference frame may grow for translated text');
  console.log('PASS independent hero: five localized SSR states, one accessible H1, reserved copy layers, one reference CTA, poster-first markup and content-height safeguards');
} finally {
  await rm(temp, {recursive: true, force: true});
}
