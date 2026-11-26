import {build} from 'esbuild';
import {mkdir, rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {StaticRouter, MemoryRouter, Routes, Route, useLocation, useNavigate} from 'react-router-dom';
import {JSDOM} from 'jsdom';

const temp = '.editorial-test';
const h = React.createElement;
await mkdir(temp, {recursive:true});
try {
  await build({entryPoints:['src/EditorialPages.tsx'], bundle:true, platform:'node', format:'esm', packages:'external', loader:{'.css':'empty'}, outfile:temp + '/pages.mjs', logLevel:'silent'});
  const pages = await import(pathToFileURL(process.cwd() + '/' + temp + '/pages.mjs').href);
  const articleSlugs = ['ho-so-xin-viec','nhu-cau-tuyen-dung','chon-cong-viec-phu-hop','thong-tin-tuyen-dung-minh-bach','don-tiep-lao-dong-moi','an-toan-thong-tin-khi-tim-viec'];
  const eventSlugs = ['ngay-hoi-ket-noi-viec-lam','toa-dam-ke-hoach-nhan-luc','hanh-trang-tim-viec'];
  const routes = [
    ['/news',pages.NewsPage], ['/news/:slug',pages.ArticlePage], ['/events',pages.EventsPage], ['/events/:slug',pages.EventPage],
    ['/privacy-policy',() => h(pages.PolicyPage,{kind:'privacy'})], ['/terms-of-use',() => h(pages.PolicyPage,{kind:'terms'})],
  ];
  const routeTree = () => h(Routes,null,routes.map(([path, Component]) => h(Route,{key:path,path,element:h(Component)})));
  function prerender(url) {
    return new JSDOM(renderToStaticMarkup(h(StaticRouter,{location:url},routeTree()))).window.document;
  }
  for (const slug of articleSlugs) {
    const doc = prerender('/news/' + slug);
    assert.equal(doc.querySelectorAll('h1').length,1);
    assert.equal(doc.querySelectorAll('#article-toc').length,1);
    const toc = [...doc.querySelectorAll('#article-toc a')];
    assert.equal(toc.length,3);
    for (const a of toc) {
      const target = doc.getElementById(new URL(a.getAttribute('href'), 'https://example.test').hash.slice(1));
      assert.equal(target?.getAttribute('tabindex'),'-1');
    }
    assert.equal(doc.querySelectorAll('.ed-related').length,1);
    const related = [...doc.querySelectorAll('.ed-related a')].map(a => a.getAttribute('href'));
    assert.equal(new Set(related).size,2);
    assert.ok(!related.includes('/news/' + slug));
    const employer = ['nhu-cau-tuyen-dung','thong-tin-tuyen-dung-minh-bach','don-tiep-lao-dong-moi'].includes(slug);
    assert.equal(doc.querySelector('.ed-actions .btn').getAttribute('href'),employer ? '/#business-contact' : '/jobs');
    assert.ok(!doc.querySelector('img[src*="hr2b"]'));
  }
  for (const slug of eventSlugs) {
    const doc = prerender('/events/' + slug);
    assert.equal(doc.querySelectorAll('h1').length,1);
    assert.match(doc.body.textContent,/Lịch sự kiện minh họa/);
    const anchors = [...doc.querySelectorAll('.ed-anchor-nav a')];
    assert.equal(anchors.length,5);
    assert.ok(anchors.every(a => doc.querySelector(a.getAttribute('href'))?.getAttribute('tabindex') === '-1'));
    const gallery = [...doc.getElementById('gallery').closest('section').querySelectorAll('figure')];
    assert.equal(gallery.length,2);
    assert.equal(new Set(gallery.map(f => f.querySelector('img').getAttribute('src'))).size,2);
    assert.ok(gallery.every(f => f.querySelector('figcaption')?.textContent));
    assert.ok(doc.querySelector('a[href^=tel]'));
    assert.ok(doc.querySelector('time[datetime="2026-11-25"]'));
    assert.equal(doc.getElementById('other-events').closest('section').querySelectorAll('article').length,2);
  }
  for (const path of ['/privacy-policy','/terms-of-use']) assert.ok(prerender(path).querySelector('.info-policy-body'));
  assert.ok(prerender('/events/absent').querySelector('a[href="/events"]'));
  assert.ok(prerender('/news/absent').querySelector('a[href="/news"]'));
  assert.equal(prerender('/news?category=bad&page=25').querySelectorAll('.ed-archive-row').length,3);
  assert.equal(prerender('/news?page=-5').querySelectorAll('.editorial-feature-slide').length,2);
  const news = prerender('/news');
  const clickableCards = [...news.querySelectorAll('.editorial-feature-slide article, .ed-archive-row'),
    ...prerender('/news/ho-so-xin-viec').querySelectorAll('.editorial-related-item')];
  for (const card of clickableCards) {
    const links = card.querySelectorAll('a[href^="/news/"]');
    assert.equal(links.length,1,'each story exposes one focusable link');
    const link = links[0];
    assert.ok(link.contains(card.querySelector('h2,h3')),'headline sits inside the article link');
    const photo = card.querySelector('img');
    if (photo) assert.equal(photo.closest('a'),link,'thumbnail opens the same article as its headline');
  }

  for (const category of ['workers','employers','hr']) assert.equal(prerender('/news?category=' + category).querySelectorAll('.ed-archive-row').length,2);

  const dom = new JSDOM('<div id="root"></div>',{url:'https://example.com/news',pretendToBeVisual:true});
  for (const key of ['window','document','navigator','HTMLElement','Element','Node','Event','MutationObserver','requestAnimationFrame','cancelAnimationFrame']) {
    Object.defineProperty(globalThis,key,{configurable:true,writable:true,value:dom.window[key]});
  }
  const motion = {matches:false,addEventListener(){},removeEventListener(){}};
  dom.window.matchMedia = () => motion;
  let observer, timer, location, navigate;
  globalThis.IntersectionObserver = class { constructor(cb){observer = cb;} observe(){} disconnect(){} };
  dom.window.setInterval = (callback,ms) => {assert.equal(ms,6000); timer=callback; return 1;};
  dom.window.clearInterval = () => {timer=undefined;};
  dom.window.HTMLElement.prototype.scrollTo = function({left}) { this.scrollLeft=left; this.dispatchEvent(new dom.window.Event('scroll')); };
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const {createRoot} = await import('react-dom/client');
  const root = createRoot(document.getElementById('root'));
  const act = React.act;
  const click = target => act(async () => { target.click(); });
  function Application() { location=useLocation(); navigate=useNavigate(); return routeTree(); }
  await act(() => root.render(h(MemoryRouter,{initialEntries:['/news']},h(Application))));
  const track = document.querySelector('.editorial-feature-track');
  const slides = [...track.children];
  assert.equal(slides.length,2);
  assert.equal(slides[0].querySelector('img').getAttribute('loading'),'eager');
  assert.ok(slides[1].querySelector('.ed-feature-checklist'));
  const archiveHrefs = [...document.querySelectorAll('.ed-archive a')].map(a => a.getAttribute('href'));
  assert.ok(slides.every(slide => !archiveHrefs.includes(slide.querySelector('a.ed-feature').getAttribute('href'))));
  slides.forEach((slide,i) => Object.defineProperty(slide,'offsetLeft',{value:80 + i * 400}));
  await act(() => observer([{isIntersecting:true}]));
  assert.equal(typeof timer,'function');
  assert.equal(track.closest('section').querySelector('button'),null,'the story rail has no manual control bar');
  assert.match(slides[0].querySelector('img').getAttribute('srcset'),/240w/);
  Object.defineProperties(track,{scrollWidth:{value:800},clientWidth:{value:400}});
  let nextFrame;
  globalThis.requestAnimationFrame=cb=>{nextFrame=cb; return 1;};
  globalThis.cancelAnimationFrame=()=>{};
  await act(() => {
    timer();
    nextFrame(performance.now()+600);
    track.dispatchEvent(new dom.window.Event('scroll'));
  });
  assert.equal(track.scrollLeft,400,'six-second timer advances the featured article');
  assert.ok(slides[0].hasAttribute('inert'));
  await act(() => track.dispatchEvent(new dom.window.Event('pointerenter')));
  assert.equal(timer,undefined);
  await act(() => track.dispatchEvent(new dom.window.Event('pointerleave')));
  assert.equal(typeof timer,'function');
  await act(() => track.focus());
  assert.equal(timer,undefined);
  await act(() => {
    track.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Home',bubbles:true}));
    track.dispatchEvent(new dom.window.Event('scroll')); // jsdom does not emit this when scrollLeft changes.
  });
  assert.equal(track.scrollLeft,0);
  assert.ok(!slides[0].hasAttribute('inert'));
  await act(() => track.blur());
  assert.equal(typeof timer,'function');
  await act(() => observer([{isIntersecting:false}]));
  assert.equal(timer,undefined);
  const filter = [...document.querySelectorAll('.ed-filters button')].find(el => el.textContent.includes('doanh nghiệp'));
  await click(filter);
  assert.equal(location.search,'?category=employers');
  assert.equal(document.querySelectorAll('.ed-archive-row').length,2);
  await click(document.querySelector('.ed-archive a img'));
  Object.defineProperty(dom.window.navigator,'clipboard',{value:{writeText:async() => {throw new dom.window.DOMException('Denied','NotAllowedError');}}});
  const copy = document.querySelector('.ed-share button');
  await click(copy);
  const fallback = document.querySelector('.ed-copy-fallback input');
  assert.equal(document.activeElement,fallback);
  assert.ok(fallback.value.endsWith('/news/nhu-cau-tuyen-dung'));
  await click(document.querySelector('.ed-actions a:not(.btn)'));
  assert.equal(location.search,'?category=employers');
  for (const [from, start] of [
    ['/news?category=workers#news-listings','.editorial-feature-slide:not([inert]) a.ed-feature'],
    ['/news?page=2#news-listings','.ed-archive a'],
  ]) {
    await act(() => navigate(from));
    assert.equal(document.getElementById('news-listings').getAttribute('tabindex'),'-1');
    await click(document.querySelector(start));
    await click(document.querySelector('.ed-toc button'));
    await click(document.querySelector('#article-toc a'));
    assert.equal(location.hash,'#article-section-0');
    await click(document.querySelector('.ed-related a'));
    assert.equal(document.querySelector('.ed-crumbs a:last-child').getAttribute('href'),from);
    await click(document.querySelector('.ed-actions a:not(.btn)'));
    assert.equal(location.pathname + location.search + location.hash,from);
  }
  await act(() => navigate('/events?status=upcoming'));
  assert.equal(document.querySelectorAll('.ed-event-line').length,2);
  await click([...document.querySelectorAll('.ed-filters button')].find(el => el.textContent === 'Đã diễn ra'));
  assert.equal(location.search,'?status=past');
  assert.equal(document.querySelectorAll('.ed-event-line').length,1);
  await act(() => navigate(-1));
  assert.equal(location.search,'?status=upcoming');
  assert.equal(document.querySelectorAll('.ed-event-line').length,2);
  await act(() => root.unmount()); dom.window.close();
  console.log('PASS 11 editorial routes, two policy routes, anchored reading, real galleries, autonomous control-free rail, pointer/keyboard pause and keyboard navigation, clipboard fallback and filter history');
} finally {
  await rm(temp,{recursive:true,force:true});
}
