import {outputPath} from './pages-paths.mjs';
import assert from 'node:assert/strict';
import {mkdtemp, rm, stat} from 'node:fs/promises';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import React, {act} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';

const temp = await mkdtemp(join(process.cwd(), '.video-gallery-test-'));
try {
  const output = join(temp, 'gallery.mjs');
  await build({
    stdin:{contents:`export {HomeVideoGallery} from './src/HomeVideoGallery'; export {LocaleProvider, locales} from './src/i18n'; export {videoLibrary} from './src/video-library';`,resolveDir:process.cwd()},
    outfile:output, bundle:true, platform:'node', format:'esm', packages:'external', loader:{'.css':'empty'}, logLevel:'silent',
  });
  const {HomeVideoGallery, LocaleProvider, locales, videoLibrary} = await import(pathToFileURL(output).href);
  const gallery = locale => React.createElement(LocaleProvider,{value:locale},React.createElement(HomeVideoGallery));
  const headings = new Set();
  for(const film of videoLibrary) {
    const [poster,large,small] = await Promise.all([film.poster,film.thumbnail.large,film.thumbnail.small].map(path=>stat('public'+outputPath(path))));
    assert.ok(large.size < poster.size && small.size < large.size,'playlist candidates are lighter than the poster');
  }
  for (const locale of locales) {
    const dom = new JSDOM(renderToStaticMarkup(gallery(locale)));
    const doc = dom.window.document;
    headings.add(doc.querySelector('#home-films-heading').textContent);
    const listing = [...doc.querySelectorAll('.home-film-playlist li a')];
    assert.equal(listing.length,videoLibrary.length);
    assert.equal(doc.querySelectorAll('video,source').length,0,'the gallery requests no media during SSR');
    assert.equal(doc.querySelector('.home-film-poster').getAttribute('href'),videoLibrary[0].src);
    for (const [index,link] of listing.entries()) {
      const film = videoLibrary[index];
      assert.equal(link.getAttribute('href'),film.src,'the asset is reachable without JavaScript');
      assert.equal(link.querySelector('strong').textContent,film.title[locale]);
      assert.equal(link.querySelector('time').dateTime,'PT' + Math.floor(film.duration) + 'S');
      assert.equal(link.querySelector('img').getAttribute('loading'),'lazy');
      assert.equal(link.querySelector('img').getAttribute('srcset'),film.thumbnail.small + ' 160w, ' + film.thumbnail.large + ' 320w');
    }
    assert.equal(new Set(listing.map(link=>link.querySelector('.film-kind').textContent)).size,3);
    dom.window.close();
  }
  assert.equal(headings.size,locales.length,'the section heading is localized in every language');

  const dom = new JSDOM('<main id="root"></main>',{url:'https://example.com/',pretendToBeVisual:true});
  const {window} = dom;
  for (const key of ['window','document','navigator','HTMLElement','Element','Node','Event','MutationObserver']) {
    Object.defineProperty(globalThis,key,{value:window[key],configurable:true,writable:true});
  }
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const media = window.HTMLMediaElement.prototype;
  const playing = new WeakSet(), released = new Set(), calls = [];
  const scrolls = [];
  let playerRect = {top:80,bottom:300,height:220};
  media.getBoundingClientRect = () => playerRect;
  media.scrollIntoView = options => scrolls.push(options);
  let failGesture = false;
  Object.defineProperty(media,'paused',{configurable:true,get(){return !playing.has(this)}});
  media.canPlayType = () => 'probably';
  media.play = function() {
    calls.push(this.getAttribute('src'));
    if (failGesture) return Promise.reject(new window.DOMException('Blocked','NotAllowedError'));
    playing.add(this);
    this.dispatchEvent(new Event('playing'));
    return Promise.resolve();
  };
  media.pause = function(){playing.delete(this)};
  media.load = function(){if (!this.hasAttribute('src')) released.add(this)};
  const {createRoot} = await import('react-dom/client');
  const root = createRoot(document.querySelector('#root'));
  const click = node => act(async()=>node.click());
  const list = () => [...document.querySelectorAll('.home-film-playlist a')];
  const current = () => document.querySelector('video');
  try {
    await act(async()=>root.render(React.createElement(React.StrictMode,null,gallery('vi'))));
    assert.equal(current(),null);
    let handled;
    document.addEventListener('click',event=>{handled=event.defaultPrevented;event.preventDefault();},{once:true});
    await act(async()=>list()[1].dispatchEvent(new window.MouseEvent('click',{bubbles:true,cancelable:true,ctrlKey:true})));
    assert.equal(handled,false,'Ctrl-click can open the source file separately');
    assert.equal(current(),null);
    const first = videoLibrary[0];
    await click(document.querySelector('.home-film-poster'));
    const firstPlayer = current();
    assert.equal(firstPlayer.getAttribute('src'),first.src);
    assert.equal(document.activeElement,firstPlayer);
    assert.equal(firstPlayer.controls,true);
    firstPlayer.currentTime = 48.5;
    await click(list()[0]);
    assert.equal(current(),firstPlayer);
    assert.equal(firstPlayer.currentTime,48.5);
    assert.deepEqual(calls,[first.src],'reselecting the playing film preserves its position');

    await act(async()=>firstPlayer.dispatchEvent(new Event('error')));
    assert.equal(firstPlayer.getAttribute('src'),first.webm,'the full film can try the other codec');
    firstPlayer.muted = true;firstPlayer.volume = .5;firstPlayer.playbackRate = 1.25;
    for (let i=1;i<videoLibrary.length;i++) {
      const previous = current(), next = videoLibrary[i];
      playerRect = i === 1 ? {top:-400,bottom:-180,height:220} : {top:80,bottom:300,height:220};
      await click(list()[i]);
      assert.equal(document.querySelectorAll('video').length,1);
      assert.ok(released.has(previous) && previous.paused && !previous.hasAttribute('src'),'switching releases the previous film');
      assert.equal(current().getAttribute('src'),next.src);
      assert.equal(document.querySelector('#home-film-title').textContent,next.title.vi);
      assert.equal(document.querySelector('.home-film-playlist [aria-current]').getAttribute('href'),next.src);
      assert.equal(document.activeElement,current());
      assert.equal(current().muted,true);assert.equal(current().volume,.5);assert.equal(current().playbackRate,1.25);
    }
    assert.deepEqual(scrolls,[{block:'center',behavior:'instant'}],'a mobile selection brings an offscreen player into view only when needed');

    const unavailable = current(), last = videoLibrary.at(-1);
    await act(async()=>unavailable.dispatchEvent(new Event('error')));
    assert.equal(current(),null);
    assert.ok(released.has(unavailable));
    assert.equal(document.querySelector('[role="status"] a').getAttribute('href'),last.src);
    const retry = document.querySelector('.home-film-poster');
    assert.equal(document.activeElement,retry);
    failGesture = true;
    await click(retry);
    assert.equal(current().getAttribute('src'),last.src);
    assert.match(document.querySelector('[role="status"]').textContent,/Nhấn nút phát/);
    failGesture = false;
    await click(list().at(-1));
    assert.equal(document.querySelector('[role="status"]'),null,'explicit replay clears the gesture notice');
    const finalPlayer = current();
    await act(async()=>root.unmount());
    assert.ok(released.has(finalPlayer) && finalPlayer.paused,'leaving the home page stops playback and releases its source');
  } finally {
    if (document.querySelector('#root').hasChildNodes()) await act(async()=>root.unmount());
    dom.window.close();
  }
  console.log('PASS video gallery: five locales, SSR file links, on-demand player, all selections, focus, fallback, retry and cleanup');
} finally {
  await rm(temp,{recursive:true,force:true});
}
