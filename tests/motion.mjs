import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {mkdir, readFile, rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {JSDOM} from 'jsdom';

const dir = '.motion-test';
await mkdir(dir, {recursive: true});
try {
  await build({entryPoints: ['src/motion.tsx'], bundle: true, platform: 'node', format: 'esm', outfile: `${dir}/bundle.mjs`, packages: 'external', loader: {'.css': 'empty'}, logLevel: 'silent'});
  const dom = new JSDOM('<main><div id="shown" data-reveal></div><div id="below" data-reveal><div id="nested" data-reveal><button>Focus</button></div></div></main>', {url: 'https://example.test/', pretendToBeVisual: true});
  for (const key of ['window', 'document', 'HTMLElement', 'MutationObserver']) Object.defineProperty(globalThis, key, {value: dom.window[key], configurable: true});
  Object.defineProperty(window, 'innerHeight', {value: 800, configurable: true});
  Object.defineProperty(window, 'innerWidth', {value: 1000, configurable: true});
  const shown = document.querySelector('#shown'), below = document.querySelector('#below'), nested = document.querySelector('#nested');
  shown.getBoundingClientRect = () => ({top: 100});
  below.getBoundingClientRect = nested.getBoundingClientRect = () => ({top: 900});
  const listeners = new Set();
  const preference = {matches: false, addEventListener: (_, fn) => listeners.add(fn), removeEventListener: (_, fn) => listeners.delete(fn)};
  window.matchMedia = () => preference;
  const observers = [];
  class Observer {
    constructor(callback, options) { this.callback = callback; this.options = options; this.targets = new Set(); observers.push(this); }
    observe(target) { this.targets.add(target); }
    unobserve(target) { this.targets.delete(target); }
    disconnect() { this.targets.clear(); }
    emit(target, intersecting, {top = 100, left = 0, right = 100, bottom = 768} = {}) {
      this.callback([{target, isIntersecting: intersecting, boundingClientRect: {top, left, right}, rootBounds: {bottom}}]);
    }
  }
  globalThis.IntersectionObserver = Observer;
  const css = await readFile('src/motion.css', 'utf8');
  assert.match(css, /\.service-card\[data-reveal\]:hover:not\(\.motion-pending\)\s*\{\s*transform:\s*none/);
  assert.match(css, /\.service-card\[data-reveal\]\.motion-pending:hover\s*\{\s*transform:\s*translateY\(22px\)/);
  assert.match(css, /\.motion-pending\s*\{[^}]*transition-duration:\s*380ms;\s*transition-delay:\s*0ms/);
  const {startReveals} = await import(pathToFileURL(`${process.cwd()}/${dir}/bundle.mjs`));
  let stop = startReveals();
  let [enter, exit] = observers.slice(-2);
  assert.match(enter.options.rootMargin, /px/); assert(!enter.options.rootMargin.includes('%'));
  assert(shown.classList.contains('motion-visible'), 'initial viewport remains visible');
  assert(below.classList.contains('motion-pending'), 'below viewport begins pending');
  exit.emit(shown, false, {top: 770});
  assert(!shown.classList.contains('motion-pending'), 'initial exit baseline cannot hide visible content');
  exit.emit(below, false, {top: 900}); // Initial observer delivery.
  enter.emit(below, true);
  assert(below.classList.contains('motion-visible') && enter.targets.has(below), 'entrance shows and retains observation');
  exit.emit(below, false, {top: -300});
  assert(!below.classList.contains('motion-pending'), 'exiting the top stays visible');
  exit.emit(below, false, {top: 100, left: 200, right: 400});
  assert(!below.classList.contains('motion-pending'), 'horizontal clipping above the reset line does not hide');
  exit.emit(below, false, {top: 770, left: 1200, right: 1400});
  assert(!below.classList.contains('motion-pending'), 'horizontal carousel exit does not hide');
  exit.emit(below, false, {top: 770});
  assert(below.classList.contains('motion-pending'), 'reverse scroll below the lower trigger hides');
  enter.emit(below, true);
  assert(!below.classList.contains('motion-pending'), 'subsequent entrance reveals again');
  exit.emit(nested, false, {top: 900}); enter.emit(nested, true);
  document.querySelector('button').focus(); document.querySelector('button').blur();
  exit.emit(nested, false, {top: 770}); exit.emit(below, false, {top: 770});
  assert(!below.classList.contains('motion-pending') && !nested.classList.contains('motion-pending'), 'focus locks nested ancestors visible after blur');
  const added = document.createElement('div');
  added.setAttribute('data-reveal', 'left'); added.getBoundingClientRect = () => ({top: 950});
  document.querySelector('main').append(added); await new Promise(resolve => setTimeout(resolve, 0));
  assert(added.classList.contains('motion-pending') && enter.targets.has(added) && exit.targets.has(added), 'dynamic content is registered');
  added.remove(); await new Promise(resolve => setTimeout(resolve, 0));
  assert(!enter.targets.has(added) && !exit.targets.has(added) && !added.classList.contains('motion-pending'), 'detached elements are released');
  enter.emit(shown, true);
  const staleExit = exit;
  window.dispatchEvent(new window.Event('resize')); await new Promise(resolve => setTimeout(resolve, 150));
  [enter, exit] = observers.slice(-2);
  assert(!below.classList.contains('motion-pending'), 'resize preserves visibility');
  const afterResize = document.createElement('div'); afterResize.setAttribute('data-reveal', '');
  afterResize.getBoundingClientRect = () => ({top: 950}); document.querySelector('main').append(afterResize);
  await new Promise(resolve => setTimeout(resolve, 0));
  assert(afterResize.classList.contains('motion-pending') && enter.targets.has(afterResize), 'content inserted after resize is initialized');
  afterResize.remove(); await new Promise(resolve => setTimeout(resolve, 0));
  exit.emit(shown, false, {top: 770});
  assert(!shown.classList.contains('motion-pending'), 'resize baseline does not hide content');
  exit.emit(shown, true); exit.emit(shown, false, {top: 770});
  assert(shown.classList.contains('motion-pending'), 'reverse reveal still works after resize');
  staleExit.emit(below, false, {top: 770});
  assert(!below.classList.contains('motion-pending'), 'disconnected observer callback is ignored');
  preference.matches = true; for (const listener of listeners) listener();
  assert(!below.classList.contains('motion-pending') && !enter.targets.size && !exit.targets.size, 'reduced motion restores and disconnects');
  preference.matches = false; for (const listener of listeners) listener();
  [enter, exit] = observers.slice(-2); exit.emit(below, false, {top: 770}); exit.emit(below, false, {top: 770});
  assert(!below.classList.contains('motion-pending'), 'focus lock survives preference toggle');
  stop(); assert.equal(listeners.size, 0); assert(!enter.targets.size && !exit.targets.size, 'cleanup removes listeners and observers');
  // A partial resize rebind failure must restore every target, even those not yet rebound.
  const extras = Array.from({length: 3}, () => {
    const element = document.createElement('div'); element.setAttribute('data-reveal', '');
    element.getBoundingClientRect = () => ({top: 900}); document.querySelector('main').append(element); return element;
  });
  globalThis.IntersectionObserver = Observer;
  stop = startReveals();
  assert(extras.every(element => element.classList.contains('motion-pending')));
  let observeCalls = 0;
  globalThis.IntersectionObserver = class { observe() { if (++observeCalls === 3) throw Error('partial failure'); } disconnect() {} };
  window.dispatchEvent(new window.Event('resize')); await new Promise(resolve => setTimeout(resolve, 150));
  assert(extras.every(element => !element.classList.contains('motion-pending')), 'partial rebind failure restores all pending targets');
  stop(); extras.forEach(element => element.remove());
  globalThis.IntersectionObserver = class { constructor() { throw Error('unavailable'); } };
  stop = startReveals(); assert(!below.classList.contains('motion-pending'), 'constructor failure leaves content visible'); stop();
  globalThis.IntersectionObserver = class { observe() { throw Error('unavailable'); } disconnect() {} };
  stop = startReveals(); assert(!below.classList.contains('motion-pending') && !nested.classList.contains('motion-pending'), 'observe failure restores all content'); stop();
  delete globalThis.IntersectionObserver;
  stop = startReveals(); assert(!below.classList.contains('motion-pending'), 'unsupported observer leaves content visible'); stop();
  dom.window.close();
  console.log('Repeat reveals, focus, resize, preference and fallback checks passed');
} finally { await rm(dir, {recursive: true, force: true}); }
