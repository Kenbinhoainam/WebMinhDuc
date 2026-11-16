import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {mkdir, readFile, rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {JSDOM} from 'jsdom';

const dir = '.motion-test';
await mkdir(dir, {recursive: true});
try {
  await build({entryPoints: ['src/motion.tsx'], bundle: true, platform: 'node', format: 'esm', outfile: `${dir}/bundle.mjs`, packages: 'external', loader: {'.css': 'empty'}, logLevel: 'silent'});
  const dom = new JSDOM('<main><div id="shown" data-reveal></div><div id="below" data-reveal><button>Focus</button></div></main>', {url: 'https://example.test/', pretendToBeVisual: true});
  for (const key of ['window', 'document', 'HTMLElement', 'MutationObserver']) Object.defineProperty(globalThis, key, {value: dom.window[key], configurable: true});
  Object.defineProperty(window, 'innerHeight', {value: 800, configurable: true});
  const shown = document.querySelector('#shown');
  const below = document.querySelector('#below');
  shown.getBoundingClientRect = () => ({top: 100});
  below.getBoundingClientRect = () => ({top: 900});
  const listeners = new Set();
  const preference = {matches: false, addEventListener: (_, fn) => listeners.add(fn), removeEventListener: (_, fn) => listeners.delete(fn)};
  window.matchMedia = () => preference;
  let current;
  class Observer {
    constructor(callback) { this.callback = callback; this.targets = new Set(); current = this; }
    observe(target) { this.targets.add(target); }
    unobserve(target) { this.targets.delete(target); }
    disconnect() { this.targets.clear(); }
    reveal(target) { this.callback([{target, isIntersecting: true}]); }
  }
  globalThis.IntersectionObserver = Observer;
  const css = await readFile('src/motion.css', 'utf8');
  assert.match(css, /\.service-card\[data-reveal\]:hover:not\(\.motion-pending\)\s*\{\s*transform:\s*none/, 'reveal cards neutralize the legacy hover transform in all motion preferences');
  assert.match(css, /\.service-card\[data-reveal\]\.motion-pending:hover\s*\{\s*transform:\s*translateY\(22px\)/, 'hover retains the pending entrance position');
  const {startReveals} = await import(pathToFileURL(`${process.cwd()}/${dir}/bundle.mjs`));
  let stop = startReveals();
  assert(shown.classList.contains('motion-visible'), 'already visible content is never hidden');
  assert(below.classList.contains('motion-pending'), 'below-fold content is observed');
  document.querySelector('button').focus();
  assert(below.classList.contains('motion-visible') && !below.classList.contains('motion-pending'), 'focus resolves a pending reveal');
  assert(!current.targets.has(below), 'focused reveal is unobserved');
  document.querySelector('button').blur();
  assert(below.classList.contains('motion-visible') && !below.classList.contains('motion-pending'), 'blur does not hide focused content again');
  below.classList.remove('motion-visible');
  stop(); stop = startReveals();
  current.reveal(below);
  assert(below.classList.contains('motion-visible') && !below.classList.contains('motion-pending'), 'intersection reveals once');
  assert(!current.targets.has(below), 'revealed elements are unobserved');
  const added = document.createElement('div');
  added.setAttribute('data-reveal', 'left');
  added.getBoundingClientRect = () => ({top: 950});
  document.querySelector('main').append(added);
  await new Promise(resolve => setTimeout(resolve, 0));
  assert(added.classList.contains('motion-pending'), 'lazy content is registered');
  added.remove();
  await new Promise(resolve => setTimeout(resolve, 0));
  assert(!current.targets.has(added) && !added.classList.contains('motion-pending'), 'detached content is released');
  below.classList.remove('motion-visible');
  // An inserted, focused control must remain available even if geometry is offscreen.
  document.querySelector('button').focus();
  stop(); stop = startReveals();
  assert(!below.classList.contains('motion-pending'), 'focused content remains visible');
  document.querySelector('button').blur();
  below.classList.remove('motion-visible');
  stop(); stop = startReveals();
  assert(below.classList.contains('motion-pending'));
  preference.matches = true;
  for (const listener of listeners) listener();
  assert(!below.classList.contains('motion-pending') && current.targets.size === 0, 'reduced motion immediately restores content');
  preference.matches = false;
  for (const listener of listeners) listener();
  assert(below.classList.contains('motion-pending'), 'motion preference can be restored');
  stop();
  assert(!below.classList.contains('motion-pending') && listeners.size === 0, 'cleanup restores content and removes listeners');
  globalThis.IntersectionObserver = class { constructor() { throw Error('unavailable'); } };
  stop = startReveals();
  assert(!below.classList.contains('motion-pending'), 'observer failure leaves content visible');
  stop();
  delete globalThis.IntersectionObserver;
  stop = startReveals();
  assert(!below.classList.contains('motion-pending'), 'unsupported observer leaves content visible');
  stop();
  dom.window.close();
  console.log('Motion observer, dynamic content, preference and fallback checks passed');
} finally { await rm(dir, {recursive: true, force: true}); }
