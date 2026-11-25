import {build} from 'esbuild';
import {mkdtemp, rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {JSDOM} from 'jsdom';
import assert from 'node:assert/strict';

const directory = await mkdtemp('.careers-carousel-test-');
try {
  await build({
    stdin: {contents: "export {default as CareersSections} from './src/CareersSections';", resolveDir: process.cwd(), sourcefile: 'entry.tsx'},
    bundle: true, platform: 'node', format: 'esm', outfile: directory + '/bundle.mjs', packages: 'external', loader: {'.css': 'empty'}, logLevel: 'silent',
  });
  const dom = new JSDOM('<div id="root"></div>', {url: 'https://example.test/careers', pretendToBeVisual: true});
  for (const key of ['window','document','navigator','HTMLElement','Element','Node','Event','MutationObserver','requestAnimationFrame','cancelAnimationFrame']) {
    Object.defineProperty(globalThis, key, {value: dom.window[key], configurable: true});
  }
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const media = {matches: false, listeners: new Set(), addEventListener(_, fn){this.listeners.add(fn);}, removeEventListener(_, fn){this.listeners.delete(fn);}};
  window.matchMedia = () => media;
  const timers = new Map(), observers = new Set();
  let handle = 0;
  window.setInterval = (fn, ms) => {assert.equal(ms, 3500); timers.set(++handle, fn); return handle;};
  window.clearInterval = id => timers.delete(id);
  globalThis.IntersectionObserver = class {
    constructor(cb) {this.cb = cb;}
    observe(element) {this.element = element; observers.add(this);}
    disconnect() {observers.delete(this);}
  };
  const React = await import('react');
  const {act} = React;
  const {createRoot} = await import('react-dom/client');
  const {MemoryRouter} = await import('react-router-dom');
  const {CareersSections} = await import(pathToFileURL(process.cwd() + '/' + directory + '/bundle.mjs'));
  const root = createRoot(document.getElementById('root'));
  await act(() => root.render(React.createElement(MemoryRouter, {initialEntries: ['/careers']}, React.createElement(CareersSections, {openings: 'Openings'}))));
  const makeVisible = async () => act(() => [...observers].forEach(observer => observer.cb([{isIntersecting:true}])));
  await makeVisible();
  assert.equal(timers.size, 4);
  const tracks = [...document.querySelectorAll('.career-track')];
  assert.deepEqual(tracks.map(el => el.children.length), [3,3,3,11]);
  assert.equal(document.querySelectorAll('.career-carousel-pause').length, 4);
  const photos = [...tracks[3].querySelectorAll('img')];
  assert.equal(new Set(photos.map(photo => photo.src)).size, 11);
  assert.ok(photos.every(photo => photo.alt && /\/assets\/minhduc-v1[68]\//.test(photo.src)));
  assert.equal(document.querySelectorAll('h1').length, 1);
  assert.equal(document.querySelector('a[href$="#open-positions"]').hash, '#open-positions');
  for (const id of ['open-positions','position-benefits','cv-requirements','career-contact']) assert.ok(document.getElementById(id));

  const first = tracks[0];
  Object.defineProperties(first, {scrollWidth: {value: 900}, clientWidth: {value: 320}});
  Object.defineProperty(first.children[1], 'offsetLeft', {value: 280});
  let frame;
  Object.defineProperty(globalThis, 'requestAnimationFrame', {configurable:true, value: fn => {frame=fn; return 1;}});
  Object.defineProperty(globalThis, 'cancelAnimationFrame', {configurable:true, value: () => {}});
  await act(() => timers.values().next().value());
  assert.equal(typeof frame, 'function');
  await act(() => frame(performance.now()+600));
  assert.equal(first.scrollLeft, 280, 'autoplay advances by one item');
  await act(() => first.dispatchEvent(new Event('mouseenter')));
  assert.equal(timers.size, 3);
  await act(() => first.dispatchEvent(new Event('mouseleave')));
  assert.equal(timers.size, 4);

  const galleryButton = tracks[3].querySelector('button');
  await act(() => galleryButton.click());
  assert.ok(document.querySelector('[role=dialog]'));
  assert.equal(timers.size, 0, 'all background rails stop while viewing a photo');
  const key = async value => act(() => document.dispatchEvent(new dom.window.KeyboardEvent('keydown', {key: value, bubbles: true})));
  await key('ArrowLeft');
  assert.equal(document.querySelector('.career-gallery-large').src, photos.at(-1).src);
  await key('ArrowRight');
  assert.equal(document.querySelector('.career-gallery-large').src, photos[0].src);
  await key('Escape');
  assert.equal(document.querySelector('[role=dialog]'), null);
  assert.equal(document.activeElement, galleryButton, 'lightbox returns focus to the opening thumbnail');
  await makeVisible();
  assert.equal(timers.size, 3, 'focused gallery stays paused when other rails resume');
  const toggle = document.querySelector('.career-gallery .career-carousel-pause');
  assert.equal(toggle.getAttribute('aria-pressed'), 'true');
  await act(() => {toggle.focus(); toggle.click();});
  await makeVisible();
  assert.equal(timers.size, 4, 'explicit play restores the gallery');
  await act(() => [...observers].find(observer => observer.element.classList.contains('career-gallery')).cb([{isIntersecting: false}]));
  assert.equal(timers.size, 3);
  media.matches = true;
  await act(() => media.listeners.forEach(listener => listener()));
  assert.equal(timers.size, 0, 'reduced motion disables every autoplay timer');
  await act(() => root.unmount());
  assert.equal(timers.size, 0);
  assert.equal(observers.size, 0);
  dom.window.close();
  console.log('PASS four careers rails, audited gallery, motion guards, manual lightbox and focus restoration');
} finally {
  await rm(directory, {recursive: true, force: true});
}
