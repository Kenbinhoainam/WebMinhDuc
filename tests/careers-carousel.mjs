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
  window.setInterval = (fn, ms) => {assert.equal(ms, 6000); timers.set(++handle, fn); return handle;};
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
  assert.equal(document.querySelectorAll('.career-rail-controls').length, 4);
  assert.equal(document.querySelectorAll('.career-carousel-pause').length, 4);
  assert.ok(tracks.every(track => track.hasAttribute('data-auto-rail') && track.tabIndex === 0 && document.getElementById(track.getAttribute('aria-labelledby'))));
  const photos = [...tracks[3].querySelectorAll('img')];
  assert.equal(new Set(photos.map(photo => photo.src)).size, 11);
  assert.ok(photos.every(photo => photo.alt && /\/assets\/minhduc-v1[68]\//.test(photo.src)));
  assert.ok(photos.every(photo => photo.width > 0 && photo.height > 0 && photo.srcset.includes('480w') && photo.srcset.includes('960w')));
  assert.equal(document.querySelectorAll('h1').length, 1);
  assert.match(document.querySelector('.md-page-masthead img').src,/field-team\.webp$/);
  assert.deepEqual([...document.querySelectorAll('.career-feature h3 a')].map(link=>link.getAttribute('href')),
    ['/jobs/chuyen-vien-tuyen-dung-bac-ninh','/jobs/cong-tac-vien-tuyen-dung-quang-ninh']);
  assert.ok([...document.querySelectorAll('.career-feature img')].every(image=>image.loading==='lazy'||image.getAttribute('loading')==='lazy'));
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
  await act(() => first.closest('section').dispatchEvent(new Event('pointerenter')));
  assert.equal(timers.size, 3);
  await act(() => first.closest('section').dispatchEvent(new Event('pointerleave')));
  assert.equal(timers.size, 4);

  const controls = first.closest('section').querySelectorAll('.career-rail-controls button');
  assert.ok([...controls].every(button=>button.getAttribute('aria-controls')===first.id));
  await act(()=>controls[0].click());
  assert.equal(first.scrollLeft,0);
  await act(()=>controls[2].click());
  assert.equal(first.scrollLeft,280);
  await act(()=>controls[1].click());
  await makeVisible();
  assert.equal(controls[1].getAttribute('aria-label'),'Phát chuyển động');
  assert.equal(timers.size,3);
  await act(()=>document.dispatchEvent(new Event('visibilitychange')));
  assert.equal(timers.size,3,'user pause outlasts visibility transitions');
  await act(()=>controls[1].click());
  await makeVisible();
  assert.equal(timers.size,4);

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
  await act(() => galleryButton.blur());
  await makeVisible();
  assert.equal(timers.size, 4, 'autoplay resumes after gallery focus leaves');
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
