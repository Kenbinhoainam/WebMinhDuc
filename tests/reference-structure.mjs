import {build} from 'esbuild';
import {mkdir, rm, readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import postcss from 'postcss';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {MemoryRouter, Routes, Route} from 'react-router-dom';

// Structural requirements inspected in the supplied reference templates. These
// check real regions/content/controls, but cannot establish pixel equivalence.
const temp = '.reference-structure-test';
await mkdir(temp, {recursive: true});
try {
  await build({stdin: {contents: "export {default as Home} from './src/Home'; export {AboutPage,ServicesPage,ServicePage,NewsPage,ArticlePage,EventPage} from './src/InfoPages'; export {JobsPage,CareersPage,JobDetailPage,jobs} from './src/JobsPages'; export {ContactPage} from './src/Contact'; export {default as ConsultationPage} from './src/Consultation'; export {LocaleProvider,localeBase} from './src/i18n'; export {loadLocale} from './src/i18n-runtime/catalog';", resolveDir: process.cwd(), sourcefile: 'reference-structure.tsx'}, bundle: true, platform: 'node', format: 'esm', packages: 'external', loader: {'.css': 'empty'}, outfile: `${temp}/bundle.mjs`, logLevel: 'silent'});
  const components = await import(pathToFileURL(`${process.cwd()}/${temp}/bundle.mjs`).href);
  const {LocaleProvider, localeBase, loadLocale, jobs} = components;
  const cases = [['/', '/', 'Home'], ['/about-us', '/about-us', 'AboutPage'], ['/services', '/services', 'ServicesPage'], ...['labor-supply','labor-leasing','recruitment','college-admissions','hr-consulting'].map(slug=>[`/services/${slug}`, '/services/:slug', 'ServicePage']), ['/news', '/news', 'NewsPage'], ['/news?page=2', '/news', 'NewsPage'], ['/news/ho-so-xin-viec', '/news/:slug', 'ArticlePage'], ['/events/ngay-hoi-ket-noi-viec-lam', '/events/:slug', 'EventPage'], ['/jobs', '/jobs', 'JobsPage'], ['/careers', '/careers', 'CareersPage'], [`/jobs/${jobs[0].slug}`, '/jobs/:slug', 'JobDetailPage'], ['/contact', '/contact', 'ContactPage'], ['/consultation', '/consultation', 'ConsultationPage']];
  for (const locale of ['vi', 'en', 'zh', 'ko', 'ja']) {
    await loadLocale(locale);
    const base = localeBase(locale);
    for (const [path, pattern, name] of cases) {
      const html = renderToStaticMarkup(React.createElement(LocaleProvider, {value: locale}, React.createElement(MemoryRouter, {basename: base || '/', initialEntries: [`${base}${path}`]}, React.createElement(Routes, null, React.createElement(Route, {path: pattern, element: React.createElement(components[name])})))));
      const dom = new JSDOM(`<main>${html}</main>`);
      const doc = dom.window.document;
      const label = `${locale} ${path}`;
      assert.equal(doc.querySelectorAll('h1').length, 1, `${label}: one page title`);
      assert.ok(doc.querySelector('h1').textContent.trim());
      for (const image of doc.querySelectorAll('img')) {
        const candidates = [image.getAttribute('src'), ...(image.getAttribute('srcset') || '').split(',').map(value=>value.trim().split(/\s+/)[0])].filter(Boolean);
        for (const url of candidates) if (url.startsWith('/')) assert.ok(existsSync(`public${decodeURIComponent(new URL(url,'https://example.test').pathname)}`), `${label}: missing local image ${url}`);
      }
      for (const node of doc.querySelectorAll('a[href],form[action],script[src],iframe[src]')) {
        const url = node.getAttribute('href') || node.getAttribute('action') || node.getAttribute('src') || '';
        assert.doesNotMatch(url, /^(?:https?:)?\/\/(?:www\.)?hr2b\.com|^(?:mailto:)[^\s]*@hr2b\.com/i, `${label}: reference presentation must not restore HR2B service endpoints`);
      }
      if (name === 'Home') {
        const sections = [...doc.querySelector('main').children].filter(node => node.tagName === 'SECTION');
        const sequence=sections.map(node => [...node.classList].find(value => value.startsWith('section-home-') || value.startsWith('home-b2b-')));
        assert.deepEqual(sequence, ['section-home-banner','section-home-about','section-home-about-achievement','section-home-solution','section-home-customer','home-b2b-process','section-home-news','section-home-event','section-home-video','home-b2b-offices','home-b2b-contact'], `${label}: homepage buyer journey`);
        for (const section of sections.slice(1)) assert.ok(section.querySelector('[data-reveal]'), `${label}: ${section.className} includes progressive reveal coverage`);
        const frames=[...doc.querySelectorAll('[data-reveal-frame]')];
        assert.ok(frames.length > 4, 'stable frames cover more than the original About-only reveal');
        for (const frame of frames) {
          assert.equal(frame.children.length, 1, 'each observed frame has one normal-flow animation child');
          assert.ok(frame.firstElementChild.classList.contains('motion-content'));
        }
        assert.equal(doc.querySelectorAll('[data-reveal] [data-reveal]').length, 0, 'nested reveals must not multiply transforms or hide interactive descendants twice');
        const customers = doc.querySelector('.section-home-customer');
        assert.ok(customers.querySelector('.partners-track'), 'customer composition includes its logo rail');
        assert.equal(customers.querySelectorAll('.home-b2b-need-list article').length,3, 'three buyer needs');
        assert.equal(doc.querySelectorAll('.partners-strip').length,1, 'single partner loop');
        assert.equal(doc.querySelectorAll('.home-b2b-steps li').length,5, 'five process steps');
        assert.ok(doc.querySelector('#business-contact .contact-form'), 'business inquiry form');
        assert.ok(doc.querySelectorAll('.section-home-news article').length > 3, 'news rail has content beyond the three visible desktop cards');
        assert.equal(doc.querySelectorAll('.section-home-news .ref-rail-controls button').length, 2);
        assert.equal(doc.querySelectorAll('.section-home-video button.home-b2b-video-button').length, 1);
        assert.equal(doc.querySelector('.section-home-video video'), null, 'intro movie loads only after activation');
      }
      if (name === 'AboutPage') {
        assert.equal(doc.querySelectorAll('.info-about-values article').length, 3);
        assert.ok(doc.querySelector('.info-about-statement > .info-about-values'), 'value cards use the reviewed spanning grid position');
        assert.equal(doc.querySelectorAll('button.info-team-card').length, 4, 'sample profiles expose actual dialog triggers');
        assert.equal(doc.querySelectorAll('.info-stat-grid article').length, 4);
        assert.equal(doc.querySelector('.info-about-values [role="tablist"],.info-value-tabs'), null, 'source simultaneous values replace custom value tabs');
        assert.equal(doc.querySelectorAll('#history [role="tab"]').length, 3, 'history phases retain a distinct synchronized selector');
        assert.equal(doc.querySelectorAll('#history [role="tabpanel"]').length, 1);
        for (const id of ['history', 'achievements']) assert.ok(doc.getElementById(id), `${label}: preserved navigation anchor ${id}`);
        assert.ok(doc.querySelector('form'), 'reference About ends with usable consultation form');
      }
      if (name === 'ServicesPage') {
        assert.equal(doc.querySelector('[role="tablist"]'), null);
        assert.equal(doc.querySelectorAll('.info-service-cards .ref-solution').length, 5);
        assert.ok(doc.querySelector('.info-service-cards[tabindex="0"]'), 'service rail is keyboard reachable');
      }
      if (name === 'ServicePage') {
        const recruitment = path.endsWith('/recruitment');
        const consulting = path.endsWith('/hr-consulting');
        const admissions = path.endsWith('/college-admissions');
        const selectors = ['.md-ref-fee-section','.info-faq-section',...(!recruitment?['.info-service-customers']:[]),'.info-service-rail',...(!admissions?['.info-contact-section']:[])];
        const nodes = selectors.map(selector=>doc.querySelector(selector));
        assert.ok(nodes.every(Boolean), `${label}: complete mapped service modules`);
        for(let i=1;i<nodes.length;i++) assert.ok(nodes[i-1].compareDocumentPosition(nodes[i]) & dom.window.Node.DOCUMENT_POSITION_FOLLOWING, `${label}: source service sequence ${selectors[i]}`);
        assert.equal(doc.querySelectorAll('.md-ref-detail-intro').length,1,'only the source intro uses the paired media layout');
        const intro = doc.querySelector('.md-ref-detail-intro');
        assert.ok(intro.firstElementChild.querySelector('img'),'source intro media precedes copy');
        const highlights = doc.querySelector('.md-ref-service-highlights');
        assert.ok(highlights);
        assert.equal(highlights.querySelectorAll('article').length,3);
        const fee = doc.querySelector('.md-ref-fee-section');
        assert.ok((consulting?fee:highlights).compareDocumentPosition(consulting?highlights:fee) & dom.window.Node.DOCUMENT_POSITION_FOLLOWING, 'consulting expertise follows fees; other mapped variants precede fees');
        const table = doc.querySelector('table.info-fee-table');
        if(recruitment){
          assert.equal(table,null,'executive reference uses a highlighted fee statement');
          assert.ok(fee.querySelector('.md-ref-fee-highlight'));
          assert.equal(doc.querySelector('.info-service-customers'),null,'executive template does not invent a customer band');
        } else {
          assert.ok(table.querySelector('caption')?.textContent.trim(), 'pricing example has a caption');
          assert.equal(table.querySelectorAll('thead th[scope="col"]').length, 3);
          assert.equal(table.querySelectorAll('tbody th[scope="row"]').length, table.querySelectorAll('tbody tr').length);
          assert.ok(table.closest('[tabindex="0"][role="region"]'), 'wide table remains keyboard reachable');
          assert.ok(doc.querySelector('.info-service-customers .partners-track'));
          assert.ok(doc.querySelector('.info-testimonial-rail[tabindex="0"][role="region"]'));
          assert.equal(doc.querySelectorAll('.info-testimonial-rail blockquote').length, 3);
        }
        assert.equal(doc.querySelectorAll('.info-service-cards .ref-solution').length, 4, 'related services exclude the current one');
        if (admissions) {
          for (const form of ['F05','F06']) assert.ok(doc.querySelector(`a[href="${base}/education?form=${form}#dang-ky"]`), `${label}: ${form} admissions link`);
          assert.equal(doc.querySelector('.info-contact-section form'), null, `${label}: admissions does not use F01`);
        } else assert.ok(doc.querySelector('.info-contact-section form'), `${label}: business service retains F01`);
      }
      if (name === 'NewsPage' && !path.includes('?')) {
        assert.ok(doc.querySelector('.info-featured-news article'), 'feature presentation remains separate');
        const featureSlides=doc.querySelectorAll('.editorial-feature-slide');
        assert.ok(featureSlides.length>1,'feature is a real rail of unique articles');
        assert.equal(doc.querySelectorAll('.editorial-feature-dots button').length,featureSlides.length);
        assert.equal(new Set([...featureSlides].map(node=>node.querySelector('h2 a').getAttribute('href'))).size,featureSlides.length);
        assert.ok(doc.querySelector('.editorial-feature-track[tabindex="0"][role="region"]'));
        assert.equal(doc.querySelector('.editorial-feature-pause').closest('.editorial-feature-surface'),null,'Play remains outside the hover/focus pause surface');
        assert.equal(doc.querySelectorAll('.editorial-feature-slide img[loading="eager"]').length,1,'offscreen feature images do not all fetch eagerly');
        assert.ok(doc.querySelectorAll('.info-news-grid article').length > 1, 'regular article listing remains separate');
        const featureBand=doc.querySelector('.info-featured-news').closest('section');
        const listingBand=doc.querySelector('.info-news-grid').closest('section');
        assert.notEqual(featureBand,listingBand, 'featured and regular articles occupy separate background bands');
        assert.equal(featureBand.parentElement,listingBand.parentElement, 'news bands are siblings');
      }
      if (name === 'NewsPage' && path.includes('?')) {
        assert.ok(!doc.querySelector('.info-news-section'), 'later pages do not leave an empty padded feature band');
        assert.ok(doc.querySelector('.info-news-listing article'));
      }
      if (name === 'CareersPage') {
        for (const id of ['open-positions','position-benefits','cv-requirements','career-contact']) assert.ok(doc.getElementById(id), `${label}: stable career anchor ${id}`);
        assert.equal(doc.querySelectorAll('.career-feature-grid article').length, 2);
        assert.equal(doc.querySelectorAll('.career-rail-section').length, 2);
        assert.ok(doc.querySelector('.career-buddy .career-feature-image img'));
        assert.equal(doc.querySelectorAll('.career-process-grid .career-step').length,4,'source recruitment process has four steps');
        for(const button of doc.querySelectorAll('.career-more')) assert.ok(doc.getElementById(button.getAttribute('aria-controls')),'expand action names its actual content region');
        assert.ok(doc.querySelector('.career-story-grid[tabindex="0"][role="region"]'));
        assert.equal(doc.querySelectorAll('.career-story-grid blockquote').length, 3);
        assert.equal(doc.querySelectorAll('.career-story-controls button').length, 2);
        assert.ok(doc.querySelectorAll('.career-gallery-grid button[aria-label] > img').length === 11, 'gallery images have actual enlargement controls');
      }
      if (name === 'ConsultationPage') {
        assert.ok(!doc.querySelector('.page-hero,.page-banner-main'), 'reference scheduling surface has no invented image banner');
        assert.ok(doc.querySelector('input[type="date"]#consultation-date'));
        assert.equal(doc.querySelectorAll('input[type="radio"][name="consultation-time"]').length, 4);
        assert.ok(doc.querySelector('.consultation-note').textContent.trim(), 'mock booking status is disclosed before interaction');
        assert.equal(doc.querySelectorAll('iframe,form[action]').length, 0, 'no external booking integration is silently enabled');
      }
      if (name === 'JobDetailPage') {
        assert.equal(doc.querySelector('.page-banner-main,.page-hero'), null, 'job detail has no extra image hero');
        assert.ok(doc.querySelector('.job-detail-intro h1'));
        assert.ok(doc.querySelector('.job-detail-layout > aside'));
        assert.ok(doc.querySelector('.job-apply-button,.job-closed'));
      }
      if (name === 'ArticlePage') {
        assert.ok(!doc.querySelector('.page-banner-main,.page-hero'), 'article detail starts with its heading, without an extra image banner');
        assert.ok(doc.querySelector('.info-article h1'));
        assert.ok(doc.querySelector('.info-related-news article'), 'related articles occupy their separate region');
        assert.ok(doc.querySelector('.editorial-related-aside .editorial-related-item img'),'source sidebar includes actual related thumbnails');
        assert.equal(doc.querySelector('.editorial-related-aside a[href$="/contact"]'),null,'article sidebar does not restore the old unsourced contact card');
      }
      if (name === 'EventPage') {
        assert.ok(doc.querySelector('.page-banner-main h1'), 'event retains its image banner');
        const links = [...doc.querySelectorAll('.info-event-nav a')];
        assert.deepEqual(links.map(link=>link.getAttribute('href')), ['#overview','#schedule','#location','#gallery','#other-events']);
        assert.equal(links[0].textContent, {vi:'Tổng quan',en:'Overview',zh:'概览',ko:'개요',ja:'概要'}[locale]);
        assert.ok(links.every(link=>doc.getElementById(link.getAttribute('href').slice(1))), 'all event section links resolve');
      }
      if (name === 'ContactPage') {
        assert.equal(doc.querySelectorAll('.contact-office').length, 3);
        assert.equal(doc.querySelectorAll('details.contact-office > summary').length, 3);
        assert.ok(doc.querySelector('form.contact-form'));
        assert.ok(doc.getElementById('consultation'));
      }
      dom.window.close();
    }
  }
  const css = postcss.parse(await readFile('src/home-reference.css', 'utf8'));
  let rail = false, grid = false;
  css.walkRules('.ref-news-grid', rule => rule.walkDecls('overflow-x', decl => {if (decl.value === 'auto') rail = true;}));
  css.walkRules('.ref-partner-grid', rule => rule.walkDecls('display', decl => {if (decl.value === 'grid') grid = true;}));
  assert.ok(rail && grid, 'news rail and static partner-grid source rules are present');
  const infoCss=postcss.parse(await readFile('src/info.css','utf8'));
  let spansValues=false;
  infoCss.walkRules('.info-about-statement>.info-about-values', rule=>{
    if(rule.parent.type==='root') rule.walkDecls('grid-column', decl=>{if(decl.value.replaceAll(' ','')==='1/-1') spansValues=true;});
  });
  assert.ok(spansValues, 'About values explicitly span both desktop statement columns; this checks the known source regression, not rendered width');
  const serviceCss=postcss.parse(await readFile('src/pages/info/services-reference.css','utf8'));
  serviceCss.walkRules(rule=>{
    for(const selector of rule.selectors){
      assert.notEqual(selector,'.md-ref-service-highlights>div','the observed outer frame must not form a three-column grid around its sole child');
      assert.ok(!['.md-ref-detail-intro>div','.md-ref-service-intro-row>div'].includes(selector),'intro frame wrappers must not inherit the old image/copy padding');
    }
  });
  const aboutCss=postcss.parse(await readFile('src/pages/info/about-reference.css','utf8'));
  let reducedYear=false;
  aboutCss.walkAtRules('media',rule=>{if(rule.params.includes('prefers-reduced-motion:reduce'))rule.walkRules('.md-history-years .info-history-track',r=>r.walkDecls('transition',d=>{if(d.value==='none')reducedYear=true;}));});
  assert.ok(reducedYear,'history reduced-motion override matches the normal transition selector specificity');
  const dom = new JSDOM('<div id="root"></div>', {url:'https://example.test/news', pretendToBeVisual:true});
  for (const key of ['window','document','navigator','HTMLElement','Element','Node','Event','MutationObserver']) Object.defineProperty(globalThis,key,{configurable:true,value:dom.window[key]});
  dom.window.matchMedia=()=>({matches:true,addEventListener(){},removeEventListener(){}});
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const {createRoot} = await import('react-dom/client');
  const root = createRoot(document.getElementById('root'));
  try {
    await React.act(()=>root.render(React.createElement(LocaleProvider,{value:'vi'},React.createElement(MemoryRouter,{initialEntries:['/news']},React.createElement(components.NewsPage)))));
    const track = document.querySelector('.editorial-feature-track');
    Object.defineProperty(track,'offsetLeft',{value:0});
    [...track.children].forEach((child,i)=>Object.defineProperty(child,'offsetLeft',{value:i*400}));
    track.scrollTo=({left})=>{track.scrollLeft=left;track.dispatchEvent(new Event('scroll'));};
    const listing = [...document.querySelectorAll('.info-news-grid h2')].map(node=>node.textContent);
    await React.act(()=>document.querySelectorAll('.editorial-feature-dots button')[1].click());
    assert.equal(track.scrollLeft,400,'second feature control scrolls to its unique article');
    assert.equal(document.querySelectorAll('.editorial-feature-dots button')[1].getAttribute('aria-pressed'),'true');
    assert.deepEqual([...document.querySelectorAll('.info-news-grid h2')].map(node=>node.textContent), listing, 'feature navigation does not replace the regular listing');
    await React.act(()=>document.querySelectorAll('.editorial-feature-dots button')[0].click());
    assert.equal(track.scrollLeft,0,'first feature control returns to the first article');
  } finally { await React.act(()=>root.unmount()); dom.window.close(); }
  console.log('PASS independent reference structures: 12 page types × five locales, five service variants, news pagination, spanning values, scheduling and career composition; no HR2B endpoints');
} finally {
  await rm(temp, {recursive: true, force: true});
}
