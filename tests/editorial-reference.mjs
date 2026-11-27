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
  await build({stdin:{contents:"export * from './src/EditorialPages'; export {articles, categories, featuredArticles} from './src/editorial-data'; export {getArticle} from './src/editorial-content'; export {LocaleProvider,localeBase} from './src/i18n'; export {loadLocale,lookup} from './src/i18n-runtime/catalog';",
    resolveDir:process.cwd(), sourcefile:'editorial-test.tsx'}, bundle:true, platform:'node', format:'esm', packages:'external', loader:{'.css':'empty'}, outfile:temp + '/pages.mjs', logLevel:'silent'});
  const pages = await import(pathToFileURL(process.cwd() + '/' + temp + '/pages.mjs').href);
  const {articles, categories, featuredArticles} = pages;
  const pageSize = 3;
  const categoryCount = key => articles.filter(article => article.category === categories.find(([id]) => id === key)?.[1]).length;
  const eventSlugs = ['ngay-hoi-ket-noi-viec-lam','toa-dam-ke-hoach-nhan-luc','hanh-trang-tim-viec'];
  const routes = [
    ['/news',pages.NewsPage], ['/news/:slug',pages.ArticlePage], ['/events',pages.EventsPage], ['/events/:slug',pages.EventPage],
    ['/privacy-policy',() => h(pages.PolicyPage,{kind:'privacy'})], ['/terms-of-use',() => h(pages.PolicyPage,{kind:'terms'})],
  ];
  const routeTree = () => h(Routes,null,routes.map(([path, Component]) => h(Route,{key:path,path,element:h(Component)})));
  function prerender(url, locale = 'vi') {
    const base = pages.localeBase(locale);
    const content = h(pages.LocaleProvider,{value:locale},h(StaticRouter,{location:base + url, basename:base},routeTree()));
    return new JSDOM(renderToStaticMarkup(content)).window.document;
  }
  const tableSlugs = ['doc-thong-tin-thu-nhap-va-ca-lam','theo-doi-pheu-tuyen-dung'];
  const planningHeadings = [[0,'Bắt đầu từ kế hoạch vận hành'],[2,'Thống nhất thông tin trước khi tìm nguồn'],[4,'Theo dõi và cập nhật theo giai đoạn']];
  const planningChecklist = [
    'Địa điểm và phương án đi lại nếu có.',
    'Ca làm, yêu cầu cơ bản và điều kiện làm việc.',
    'Thu nhập, cách tính và các khoản cần làm rõ.',
    'Đầu mối xác nhận lịch phỏng vấn, nhận việc.',
  ];
  for (const locale of ['vi','en','zh','ko','ja']) {
    await pages.loadLocale(locale);
    const plan = prerender('/news/nhu-cau-tuyen-dung',locale);
    const message = key => {
      if (locale === 'vi') return key;
      const localized = pages.lookup(locale,key);
      assert.ok(localized && localized !== key);
      return localized;
    };
    assert.equal(plan.querySelectorAll('#article-toc li').length,6);
    for (const [index,label] of planningHeadings) {
      const heading = plan.getElementById('article-section-' + index);
      assert.ok(heading.textContent.endsWith(message(label)));
      assert.equal(plan.querySelector('#article-toc a[href$="#article-section-' + index + '"]').textContent,message(label));
    }
    assert.deepEqual(
      [...plan.querySelectorAll('section[aria-labelledby="article-section-1"] ul li')].map(item=>item.textContent),
      planningChecklist.map(message)
    );
    plan.defaultView.close();
    for (const [index, slug] of tableSlugs.entries()) {
      const doc = prerender('/news/' + slug, locale);
      const table = doc.querySelector('[aria-labelledby="article-section-1"] table.ed-reader-table');
      assert.ok(table.querySelector('caption').textContent);
      assert.equal(table.querySelectorAll('thead th[scope=col]').length,2);
      assert.equal(table.querySelectorAll('tbody th[scope=row]').length,index === 0 ? 3 : 4);
      assert.equal(table.querySelectorAll('td').length,index === 0 ? 3 : 4);
      if (index === 1) assert.match(table.textContent,/28 ÷ 40 = 70%.*12/);
      doc.defaultView.close();
    }
  }
  for (const {slug} of articles) {
    const article = pages.getArticle(slug);
    assert.ok(article);
    const doc = prerender('/news/' + slug);
    assert.equal(doc.querySelectorAll('h1').length,1);
    assert.equal(doc.querySelectorAll('#article-toc').length,1);
    const disclosure = doc.querySelector('.ed-toc details');
    assert.ok(disclosure.querySelector('summary + ol#article-toc'));
    assert.equal(disclosure.open,false,'the server delivers a collapsed native disclosure with or without JS');
    const toc = [...doc.querySelectorAll('#article-toc a')];
    assert.equal(toc.length,article.sections.length);
    for (const [index, link] of toc.entries()) {
      const target = doc.getElementById(new URL(link.getAttribute('href'), 'https://example.test').hash.slice(1));
      assert.equal(target?.getAttribute('tabindex'),'-1');
      assert.equal(target.querySelector('span[aria-hidden=true]').textContent,`${index + 1}.`);
    }
    assert.ok(doc.querySelector('.ed-story-head h1 + .ed-story-meta time[datetime]'));
    assert.ok(doc.querySelector('.ed-story-head .ed-share + .ed-lead'));
    const category = categories.find(([, label]) => label === article.category);
    assert.equal(doc.querySelector('.ed-story-meta a').getAttribute('href'),'/news?category=' + category[0] + '#news-listings');
    const readingOrder = articles.filter(item => item.slug !== slug).sort((a,b) => b.date.localeCompare(a.date));
    const latest = [...doc.querySelectorAll('.ed-reader-latest a')].map(a => a.getAttribute('href'));
    assert.deepEqual(latest,readingOrder.slice(0,3).map(item => '/news/' + item.slug));
    assert.ok(doc.querySelector('.ed-story').compareDocumentPosition(doc.querySelector('.ed-reader-latest')) & doc.defaultView.Node.DOCUMENT_POSITION_FOLLOWING);
    const related = [...doc.querySelectorAll('.ed-related a')].map(a => a.getAttribute('href'));
    assert.equal(new Set([...related, ...latest]).size,related.length + latest.length);
    assert.ok(!related.includes('/news/' + slug));
    const sameCategory = [...doc.querySelectorAll('[aria-labelledby="same-category-title"] a')].map(a => a.getAttribute('href'));
    assert.deepEqual(sameCategory,readingOrder.slice(latest.length).filter(item => item.category === article.category).slice(0,2).map(item => '/news/' + item.slug));
    const inlineFigures = [...doc.querySelectorAll('.ed-body figure.ed-inline-photo')];
    assert.equal(inlineFigures.length,article.sections.flatMap(section => section.images ?? []).length);
    assert.ok(inlineFigures.every(figure => figure.querySelector('figcaption')?.textContent && figure.querySelector('img[loading=lazy]')?.alt));
    const employer = article.category === 'Dành cho doanh nghiệp' || slug === 'thong-tin-tuyen-dung-minh-bach';
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
  assert.equal(prerender('/news?category=bad&page=25').querySelectorAll('.ed-archive-row').length,(articles.length - 1) % pageSize + 1);
  assert.equal(prerender('/news?page=-5').querySelectorAll('.editorial-feature-slide').length,featuredArticles.length);
  const news = prerender('/news');
  assert.equal(news.querySelectorAll('.ed-filters button[aria-pressed=true]').length,1);
  assert.equal(news.querySelector('.ed-pagination button[aria-current=page]').textContent,'1');
  assert.ok(news.querySelector('.ed-pagination button[aria-label="Trang trước"]').disabled);
  const leadReader = prerender('/news/nhu-cau-tuyen-dung');
  assert.ok(leadReader.querySelectorAll('.ed-prose-section').length >= 6,'the lead supports sustained reading');
  const leadFigures = [...leadReader.querySelectorAll('.ed-inline-photo')];
  assert.ok(leadFigures.length >= 2,'the lead contains multiple captioned in-body images');
  assert.ok(new Set(leadFigures.map(figure => figure.querySelector('img').src)).size >= 2,'in-body photographs differ');
  const portraitCover = prerender('/news/ho-so-xin-viec').querySelector('img.ed-cover-portrait');
  assert.match(portraitCover.alt,/Nhân viên Minh Đức/,'article cover has descriptive text and explicit portrait framing');
  assert.equal(prerender('/news/an-toan-thong-tin-khi-tim-viec').querySelector('.ed-story-photo'),null,'text-only article does not gain an invented image');
  const clickableCards = [...news.querySelectorAll('.editorial-feature-slide article, .ed-archive-row'),
    ...prerender('/news/ho-so-xin-viec').querySelectorAll('.editorial-related-item')];
  for (const card of clickableCards) {
    const links = card.querySelectorAll('a[href^="/news/"]');
    assert.equal(links.length,1,'each story exposes one focusable link');
    const link = links[0];
    const heading = card.querySelector('h2,h3');
    assert.ok(link.contains(heading),'headline sits inside the article link');
    assert.equal(link.ownerDocument.getElementById(link.getAttribute('aria-labelledby')),heading,'link name comes from its headline');
    const date = card.querySelector('time');
    if (date) assert.match(date.dateTime,/^\d{4}-\d{2}-\d{2}$/,'metadata renders an ISO date');
    const photo = card.querySelector('img');
    if (photo) {
      assert.equal(photo.closest('a'),link,'thumbnail opens the same article as its headline');
      assert.equal(photo.alt,'','article name is announced once when the thumbnail is decorative');
      assert.ok(photo.width > 0 && photo.height > 0 && photo.srcset,'thumbnail retains its intrinsic size and candidates');
    }
  }

  for (const [category] of categories.slice(1)) {
    const archive = prerender('/news?category=' + category);
    assert.equal(archive.querySelectorAll('.ed-archive-row').length,Math.min(pageSize,categoryCount(category)));
  }

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
  assert.equal(slides.length,featuredArticles.length);
  assert.equal(slides[0].querySelector('img').getAttribute('loading'),'eager');
  assert.ok(slides[1].querySelector('.ed-feature-checklist'));
  const archiveHrefs = [...document.querySelectorAll('.ed-archive a')].map(a => a.getAttribute('href'));
  assert.ok(slides.every(slide => !archiveHrefs.includes(slide.querySelector('a.ed-feature').getAttribute('href'))));
  slides.forEach((slide,i) => Object.defineProperty(slide,'offsetLeft',{value:80 + i * 400}));
  await act(() => observer([{isIntersecting:true}]));
  assert.equal(typeof timer,'function');
  const pause = track.closest('section').querySelector('.ed-feature-pause');
  assert.equal(pause.getAttribute('aria-controls'),track.id);
  await click(pause);
  assert.equal(timer,undefined,'explicit pause stops the timer');
  await act(() => observer([{isIntersecting:true}]));
  assert.equal(timer,undefined,'pause continues after visibility changes');
  await click(pause);
  await act(() => observer([{isIntersecting:true}]));
  assert.equal(typeof timer,'function','explicit play restarts on visibility');
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
  assert.equal(document.querySelectorAll('.ed-archive-row').length,Math.min(pageSize,categoryCount('employers')));
  const thumbnail = document.querySelector('.ed-archive a img');
  const articlePath = thumbnail.closest('a').getAttribute('href');
  await click(thumbnail);
  let copiedUrl;
  let denied = true;
  Object.defineProperty(dom.window.navigator,'clipboard',{value:{writeText:async url => {
    if (denied) throw new dom.window.DOMException('Denied','NotAllowedError');
    copiedUrl = url;
  }}});
  const copy = document.querySelector('.ed-share button');
  await click(copy);
  const fallback = document.querySelector('.ed-copy-fallback input');
  assert.equal(document.activeElement,fallback);
  assert.ok(fallback.value.endsWith(articlePath));
  denied = false;
  await click(copy);
  assert.ok(copiedUrl.endsWith(articlePath));
  assert.match(document.querySelector('.ed-share [role=status]').textContent,/Đã sao chép/);
  assert.equal(document.querySelector('.ed-copy-fallback'),null);
  await click(document.querySelector('.ed-actions a:not(.btn)'));
  assert.equal(location.search,'?category=employers');
  for (const [from, start, follow = '.ed-related a'] of [
    ['/news?category=workers#news-listings','.editorial-feature-slide:not([inert]) a.ed-feature'],
    ['/news?page=2#news-listings','.ed-archive a','.ed-reader-latest a'],
  ]) {
    await act(() => navigate(from));
    assert.equal(document.getElementById('news-listings').getAttribute('tabindex'),'-1');
    await click(document.querySelector(start));
    const disclosure = document.querySelector('.ed-toc details');
    assert.equal(disclosure.open,false,'the hydrated article starts collapsed');
    await click(disclosure.querySelector('summary'));
    assert.equal(disclosure.open,true,'summary uses native click activation');
    await click(document.querySelector('#article-toc a'));
    assert.equal(location.hash,'#article-section-0');
    await click(document.querySelector(follow));
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
  console.log('PASS editorial routes, numbered chapters, captioned images, latest and related links, real galleries, feature controls and keyboard navigation, clipboard fallback and filter history');
} finally {
  await rm(temp,{recursive:true,force:true});
}
