import assert from 'node:assert/strict';
import {access, mkdtemp, readFile, rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {act, createElement, createRef} from 'react';
import {renderToString} from 'react-dom/server';
import {MemoryRouter} from 'react-router-dom';

const manifest = JSON.parse(await readFile('src/media-manifest.json', 'utf8'));
for (const [original, {variants}] of Object.entries(manifest)) {
  for (const src of [original, ...variants.map(variant => variant.src)]) await access('public' + src);
}

const temp = await mkdtemp(process.cwd() + '/.image-fallback-test-');
try {
  await build({
    stdin:{
      contents:"export {jsx} from './src/i18n-runtime/jsx-runtime'; export {PageMasthead} from './src/PageMasthead';",
      resolveDir:process.cwd(), sourcefile:'image-fallback-entry.tsx',
    },
    bundle:true, platform:'node', format:'esm', packages:'external',
    loader:{'.css':'empty'}, outfile:temp + '/bundle.mjs', logLevel:'silent',
  });
  const {PageMasthead, jsx} = await import(pathToFileURL(temp + '/bundle.mjs').href);
  const original = '/assets/hero-poster.jpg';
  const group = manifest[original];
  const variant = group.variants[0].src;
  const campus = '/assets/minhduc-v18/industrial-campus.webp';
  const heading = 'Dịch vụ nhân lực';
  const alt = 'Quang cảnh khu công nghiệp';
  const masthead = image => createElement(MemoryRouter, null, createElement(PageMasthead, {
    image, imageAlt:alt, imageCaption:alt, title:heading,
  }, createElement('button', null, 'Gửi nhu cầu nhân lực')));

  const html = renderToString(masthead(original));
  const dom = new JSDOM('<div id="root">' + html + '</div><div id="secondary"></div>', {url:'https://example.test/', pretendToBeVisual:true});
  for (const key of ['window','document','navigator','Element','HTMLElement','HTMLImageElement','Node','Event']) {
    Object.defineProperty(globalThis, key, {value:dom.window[key], writable:true, configurable:true});
  }
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const {createRoot, hydrateRoot} = await import('react-dom/client');
  const host = document.querySelector('#root');
  const renderedHeading = host.querySelector('h1');
  const serverImage = host.querySelector('img');
  const failedBeforeHydration = (node, url) => Object.defineProperties(node, {
    complete:{configurable:true,value:true}, naturalWidth:{configurable:true,value:0},
    currentSrc:{configurable:true,value:new URL(url,document.baseURI).href},
  });
  const fail = node => act(() => node.dispatchEvent(new Event('error')));
  assert.ok(serverImage.srcset.includes(variant));
  assert.equal(serverImage.getAttribute('fetchpriority'), 'high');
  assert.ok(host.querySelector('link[rel="preload"][as="image"][imagesrcset]'));
  failedBeforeHydration(serverImage, variant);
  let root;
  const hydrationErrors = [];
  await act(() => {root = hydrateRoot(host, masthead(original), {onRecoverableError:error => hydrationErrors.push(error)});});
  const retry = host.querySelector('img');
  assert.ok(retry);
  assert.equal(retry.getAttribute('src'), original);
  assert.equal(retry.hasAttribute('srcset'), false);
  assert.equal(retry.hasAttribute('sizes'), false);
  assert.equal(retry.alt, alt);
  assert.equal(retry.width, group.width);
  assert.equal(host.querySelector('h1'), renderedHeading);
  assert.deepEqual(hydrationErrors, []);
  await fail(retry);
  assert.equal(host.querySelector('.md-masthead-figure,.md-page-masthead--image,.md-masthead-image-fallback'), null);
  assert.ok(host.querySelector('button'));
  assert.equal(host.querySelector('h1'), renderedHeading);

  await act(() => root.render(masthead(campus)));
  const campusImage = host.querySelector('img');
  assert.ok(campusImage.srcset);
  failedBeforeHydration(campusImage, campus);
  await fail(campusImage);
  assert.equal(host.querySelector('figure'), null, 'an already selected original does not retry itself');
  await act(() => root.render(masthead(original)));
  assert.ok(host.querySelector('img').srcset, 'a new visit can acquire a previously failed photo');

  const ref = createRef();
  const secondary = createRoot(document.querySelector('#secondary'));
  let terminalErrors = 0;
  const onError = () => { terminalErrors++; };
  await act(() => secondary.render(jsx('img', {src:variant, alt, ref, onError})));
  await fail(ref.current);
  assert.equal(ref.current.getAttribute('src'), original, 'explicit derivative URL resolves to the original');
  assert.equal(terminalErrors, 0);
  await fail(ref.current);
  await fail(ref.current);
  assert.equal(terminalErrors, 1, 'terminal errors are delegated once per request');

  await act(() => {root.unmount();secondary.unmount();});
  dom.window.close();
  console.log('PASS original image retry, pre-hydration failure, intrinsic ref/alt, masthead text layout and local media paths');
} finally {
  await rm(temp, {recursive:true, force:true});
}
