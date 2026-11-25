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
  await build({stdin: {contents: "export {default as Home} from './src/Home'; export {AboutPage,ServicesPage,ServicePage,NewsPage,ArticlePage,EventPage} from './src/InfoPages'; export {JobsPage,CareersPage,JobDetailPage,jobs} from './src/JobsPages'; export {ContactPage} from './src/Contact'; export {EducationPage,EducationDetailPage,educationPrograms} from './src/Education'; export {default as ConsultationPage} from './src/Consultation'; export {LocaleProvider,localeBase} from './src/i18n'; export {loadLocale} from './src/i18n-runtime/catalog';", resolveDir: process.cwd(), sourcefile: 'reference-structure.tsx'}, bundle: true, platform: 'node', format: 'esm', packages: 'external', loader: {'.css': 'empty'}, outfile: `${temp}/bundle.mjs`, logLevel: 'silent'});
  const components = await import(pathToFileURL(`${process.cwd()}/${temp}/bundle.mjs`).href);
  const {LocaleProvider, localeBase, loadLocale, jobs} = components;
  const cases = [['/', '/', 'Home'], ['/about-us', '/about-us', 'AboutPage'], ['/services', '/services', 'ServicesPage'], ...['labor-supply','labor-leasing','recruitment','college-admissions','hr-consulting'].map(slug=>[`/services/${slug}`, '/services/:slug', 'ServicePage']), ['/education','/education','EducationPage'], ...components.educationPrograms.map(program=>[`/education/${program.slug}`,'/education/:slug','EducationDetailPage']), ['/news', '/news', 'NewsPage'], ['/news?page=2', '/news', 'NewsPage'], ['/news/ho-so-xin-viec', '/news/:slug', 'ArticlePage'], ['/events/ngay-hoi-ket-noi-viec-lam', '/events/:slug', 'EventPage'], ['/jobs', '/jobs', 'JobsPage'], ['/careers', '/careers', 'CareersPage'], [`/jobs/${jobs[0].slug}`, '/jobs/:slug', 'JobDetailPage'], ['/contact', '/contact', 'ContactPage'], ['/consultation', '/consultation', 'ConsultationPage']];
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
        const sequence=sections.map(node => [...node.classList].find(value => value.startsWith('section-home-') || value.startsWith('home-b2b-') || value.startsWith('home-v16-')));
        assert.deepEqual(sequence, ['section-home-banner','section-home-about','home-v16-needs','section-home-solution','home-v16-process','home-v16-people','home-b2b-contact','home-b2b-offices','section-home-news'], `${label}: homepage buyer journey`);
        for (const section of sections.slice(1)) assert.ok(section.querySelector('[data-reveal]'), `${label}: ${section.className} includes progressive reveal coverage`);
        const frames=[...doc.querySelectorAll('[data-reveal-frame]')];
        assert.ok(frames.length > 4, 'stable frames cover the journey');
        for (const frame of frames) {
          assert.equal(frame.children.length, 1, 'each observed frame has one normal-flow animation child');
          assert.ok(frame.firstElementChild.classList.contains('motion-content'));
        }
        assert.equal(doc.querySelectorAll('[data-reveal] [data-reveal]').length, 0, 'nested reveals must not multiply transforms or hide interactive descendants twice');
        assert.equal(doc.querySelectorAll('.home-v16-need').length,3, 'three buyer needs');
        assert.equal(doc.querySelectorAll('.home-v16-need button').length,3, 'each need can initiate an inquiry');
        assert.equal(doc.querySelectorAll('.partners-strip').length,1, 'single partner loop');
        assert.ok(doc.querySelector('.home-v16-process .partners-track'), 'partner rail belongs to process evidence');
        assert.equal(doc.querySelectorAll('.home-v16-steps > li').length,5, 'five process steps');
        assert.ok(doc.querySelector('#business-contact .contact-form'), 'business inquiry form');
        assert.equal(doc.querySelectorAll('.section-home-news article').length,3, 'news rail has three unique articles');
        assert.equal(new Set([...doc.querySelectorAll('.section-home-news article h3 a')].map(a=>a.getAttribute('href'))).size,3, 'news destinations are distinct');
        assert.ok(doc.querySelector('.section-home-news [data-auto-rail][role="region"]'));
        assert.equal(doc.querySelector('.ref-carousel-pause,.ref-rail-controls button'),null,'reading strips have no playback controls');
        assert.equal(doc.querySelectorAll('video').length,1, 'one company hero video');
        assert.equal(doc.querySelectorAll('.home-b2b-video-button,.section-home-event,.ref-testimonial-card').length,0, 'no duplicate intro or invented event/testimonial section');
        assert.equal(doc.querySelectorAll('.home-v16-people img[src^="/assets/minhduc-v16/"]').length,2, 'people section uses two real activity images');
        assert.ok(doc.querySelector('.home-v16-people a[href$="/about-us#activities"]'), 'people section links to activities');
      }
      if (name === 'AboutPage') {
        assert.equal(doc.querySelectorAll('.info-about-values article').length, 3);
        assert.ok(doc.querySelector('#profile .field-cover + .info-about-values'), 'three values have a row below the company profile cover');
        assert.equal(doc.querySelectorAll('button.info-team-card').length, 4, 'sample profiles expose actual dialog triggers');
        assert.equal(doc.querySelectorAll('#profile .field-metrics .field-stat').length, 4);
        assert.equal(doc.querySelector('.info-about-values [role="tablist"],.info-value-tabs'), null, 'source simultaneous values replace custom value tabs');
        assert.equal(doc.querySelectorAll('#history [role="tab"]').length, 3, 'history phases retain a distinct synchronized selector');
        assert.equal(doc.querySelectorAll('#history [role="tabpanel"]').length, 1);
        for (const id of ['history', 'achievements']) assert.ok(doc.getElementById(id), `${label}: preserved navigation anchor ${id}`);
        assert.ok(doc.querySelector('form'), 'reference About ends with usable consultation form');
      }
      if (name === 'ServicesPage') {
        assert.equal(doc.querySelector('[role="tablist"]'), null);
        const direct = [...doc.querySelectorAll('.service-directory nav a')].map(link => link.getAttribute('href'));
        const panels = [...doc.querySelectorAll('.info-service-cards article > a')].map(link => link.getAttribute('href'));
        assert.equal(new Set(direct).size, 5, 'all five decisions have direct links without rail navigation');
        const directory=doc.querySelector('.service-directory');
        const heroPhoto=doc.querySelector('.service-index-masthead .md-masthead-figure');
        assert.ok(directory.compareDocumentPosition(heroPhoto) & dom.window.Node.DOCUMENT_POSITION_FOLLOWING,'mobile reading order puts all five choices before the campus photo');
        assert.deepEqual(panels, direct, 'directory and autoplay rail lead to the same five services');
        assert.ok(doc.querySelector('.info-service-cards[data-auto-rail][tabindex="0"]'), 'the service rail stays keyboard reachable without controls');
        assert.equal(doc.querySelector('.info-service-rail button'), null);
        assert.equal(panels.length, doc.querySelectorAll('.service-panel-photo img[width][height]').length, 'card photos reserve their native dimensions');
      }
      if (name === 'ServicePage') {
        const recruitment = path.endsWith('/recruitment');
        const consulting = path.endsWith('/hr-consulting');
        const admissions = path.endsWith('/college-admissions');
        const selectors = ['.md-ref-fee-section','.info-faq-section',...(!recruitment?['.info-service-customers']:[]),'.info-service-rail',...(!admissions?['.info-contact-section']:[])];
        const nodes = selectors.map(selector=>doc.querySelector(selector));
        assert.ok(nodes.every(Boolean), `${label}: complete mapped service modules`);
        for(let i=1;i<nodes.length;i++) assert.ok(nodes[i-1].compareDocumentPosition(nodes[i]) & dom.window.Node.DOCUMENT_POSITION_FOLLOWING, `${label}: source service sequence ${selectors[i]}`);
        const slug = path.split('/').at(-1);
        const masthead = doc.querySelector('.md-masthead-grid');
        assert.ok(masthead.firstElementChild.querySelector('h1'), 'service title and primary action precede the masthead photo');
        assert.ok(masthead.querySelector('img[alt]') && masthead.querySelector('.md-masthead-actions'));
        const highlights = doc.querySelector(`[data-service-layout="${slug}"]`);
        const decisions = {
          'labor-supply': ['tbody tr',2], 'labor-leasing':['dl dt',3],
          recruitment:['dl dt',3], 'college-admissions':['article',2], 'hr-consulting':['article',3],
        };
        assert.ok(highlights, 'dedicated decision section for this service');
        const [selector,count]=decisions[slug];
        assert.equal(highlights.querySelectorAll(selector).length,count,`${slug}: actionable comparison content`);
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
        const related=[...doc.querySelectorAll('.info-service-cards article a')].map(link=>link.getAttribute('href'));
        assert.equal(new Set(related).size, 4);
        assert.ok(!related.includes(base + path),'related services exclude the current one');
        if (admissions) {
          for (const form of ['F05','F06']) assert.ok(doc.querySelector(`a[href="${base}/education?form=${form}#dang-ky"]`), `${label}: ${form} admissions link`);
          assert.equal(doc.querySelector('.info-contact-section form'), null, `${label}: admissions does not use F01`);
        } else {
          const choices = doc.querySelector('#business-contact form select[name="service"]');
          const values = {'labor-supply':'Giới thiệu & cung ứng nhân lực','labor-leasing':'Cho thuê lao động',recruitment:'Headhunt & lao động tay nghề','hr-consulting':'Setup tổ chức & phần mềm doanh nghiệp'};
          assert.equal(choices.value,values[slug],`${label}: inline F01 retains the service, including translated pages`);
        }
      }
      if (name === 'EducationPage' || name === 'EducationDetailPage') {
        const form = doc.querySelector('#dang-ky form');
        assert.ok(form.querySelector('[name="phone"][required]'));
        const modeButtons=doc.querySelectorAll('.education-form-tabs button');
        assert.equal(modeButtons.length,2);
        if(name === 'EducationPage') {
          assert.equal(doc.querySelectorAll('.education-program-groups > section').length,2);
          assert.equal(new Set([...doc.querySelectorAll('.education-program-groups a')].map(link=>link.href)).size,3);
        } else {
          assert.equal(!!doc.querySelector('.md-masthead-figure'), path.endsWith('/chinh-quy-cong-nghe'), 'only on-campus program details depict campus facilities');
          assert.equal(form.querySelector('[name="program"]').value,path.split('/').at(-1),'deep link selects the program in the form');
          assert.ok(doc.querySelector(`a[href="${base}${path}?form=F06#dang-ky"]`));
        }
      }
      if (name === 'NewsPage' && !path.includes('?')) {
        assert.ok(doc.querySelector('.info-featured-news article'), 'feature presentation remains separate');
        const featureSlides=doc.querySelectorAll('.editorial-feature-slide');
        assert.ok(featureSlides.length>1,'feature is a real rail of unique articles');
        assert.equal(doc.querySelector('.info-featured-news button'),null,'automatic stories have no control bar');
        assert.equal(new Set([...featureSlides].map(node=>node.querySelector('h2 a').getAttribute('href'))).size,featureSlides.length);
        assert.ok(doc.querySelector('.editorial-feature-track[tabindex="0"][role="region"]'));
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
        assert.ok(doc.querySelector('.careers-page .md-page-masthead h1'));
        assert.equal(doc.querySelectorAll('.career-rail-section').length,4);
        assert.equal(doc.querySelectorAll('.career-process-grid .career-step').length,4);
        assert.equal(doc.querySelectorAll('.career-questions .career-track article').length,3);
        assert.equal(doc.querySelectorAll('.career-track[data-auto-rail][tabindex="0"][aria-labelledby]').length,4);
        assert.equal(doc.querySelectorAll('.career-rail-controls,.career-carousel-pause').length,0);
        const photos=[...doc.querySelectorAll('.career-gallery .career-track figure > button[aria-label] > img')];
        assert.equal(new Set(photos.map(photo=>photo.getAttribute('src'))).size,11,'eleven distinct real photographs open at larger size');
        assert.ok(photos.every(photo=>/\/minhduc-v1[68]\//.test(photo.getAttribute('src'))));
      }
      if (name === 'ConsultationPage') {
        assert.ok(doc.querySelector('.consultation-page .md-page-masthead h1'));
        assert.ok(doc.querySelector('form.consultation-choose input[type="date"]#consultation-date'));
        assert.equal(doc.querySelectorAll('input[type="radio"][name="consultation-time"]').length,4);
        assert.ok(doc.querySelector('.md-masthead-description').textContent.trim(), 'mock booking status is disclosed before interaction');
        assert.equal(doc.querySelectorAll('iframe,form[action]').length,0,'no external booking integration is silently enabled');
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
        assert.equal(doc.querySelectorAll('.info-related-news').length,1,'one related reading region');
        assert.ok(doc.querySelector('.info-related-news article'), 'related articles occupy their dedicated region');
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
        assert.ok(doc.querySelector('.contact-page-v18 .md-page-masthead h1'));
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
  const homeV16=postcss.parse(await readFile('src/home-flagship-v16.css','utf8'));
  let desktopNewsWidth=false,mobileNewsWidth=false;
  homeV16.walkRules('.home-v16-news .ref-news-card', rule=>rule.walkDecls('flex-basis', decl=>{
    if(rule.parent.type==='root' && /\/2\.5/.test(decl.value)) desktopNewsWidth=true;
    if(rule.parent.type==='atrule' && rule.parent.params.includes('767px') && decl.value==='86%') mobileNewsWidth=true;
  }));
  assert.ok(desktopNewsWidth && mobileNewsWidth, 'news rail keeps overflow for autoplay on desktop and mobile');
  const serviceCss=postcss.parse(await readFile('src/pages/info/services-reference.css','utf8'));
  serviceCss.walkRules(rule=>{
    for(const selector of rule.selectors){
      assert.notEqual(selector,'.md-ref-service-highlights>div','the observed outer frame must not form a three-column grid around its sole child');
      assert.ok(!['.md-ref-detail-intro>div','.md-ref-service-intro-row>div'].includes(selector),'intro frame wrappers must not inherit the old image/copy padding');
    }
  });
  const aboutCss=postcss.parse(await readFile('src/pages/info/about-reference.css','utf8'));
  let reducedSlide=false;
  aboutCss.walkAtRules('media',rule=>{if(rule.params.includes('prefers-reduced-motion:reduce')) rule.walkRules(r=>{
    if(r.selectors.includes('.about-page .info-history-slide')) r.walkDecls('transition',d=>{if(d.value==='none') reducedSlide=true;});
  });});
  assert.ok(reducedSlide,'history slides become static when reduced motion is requested');
  const dom = new JSDOM('<div id="root"></div>', {url:'https://example.test/news', pretendToBeVisual:true});
  for (const key of ['window','document','navigator','HTMLElement','Element','Node','Event','MutationObserver']) Object.defineProperty(globalThis,key,{configurable:true,value:dom.window[key]});
  dom.window.matchMedia=()=>({matches:true,addEventListener(){},removeEventListener(){}});
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const {createRoot} = await import('react-dom/client');
  const root = createRoot(document.getElementById('root'));
  try {
    await React.act(()=>root.render(React.createElement(LocaleProvider,{value:'vi'},React.createElement(MemoryRouter,{initialEntries:['/news']},React.createElement(components.NewsPage)))));
    const track = document.querySelector('.editorial-feature-track');
    Object.defineProperties(track,{offsetLeft:{value:0},scrollWidth:{value:800},clientWidth:{value:400}});
    [...track.children].forEach((child,i)=>Object.defineProperty(child,'offsetLeft',{value:i*400}));
    track.scrollTo=({left})=>{track.scrollLeft=left;track.dispatchEvent(new Event('scroll'));};
    const listing = [...document.querySelectorAll('.info-news-grid h2')].map(node=>node.textContent);
    await React.act(()=>track.focus());
    const press = key => React.act(()=>{
      track.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key,bubbles:true}));
      track.dispatchEvent(new Event('scroll'));
    });
    await press('ArrowRight');
    assert.equal(track.scrollLeft,400,'keyboard moves to the next story even in reduced motion');
    assert.ok(!track.children[1].hasAttribute('inert'));
    assert.deepEqual([...document.querySelectorAll('.info-news-grid h2')].map(node=>node.textContent), listing, 'feature navigation does not replace the regular listing');
    await press('ArrowLeft');
    assert.equal(track.scrollLeft,0,'keyboard can return to the first story');
  } finally { await React.act(()=>root.unmount()); dom.window.close(); }
  console.log('PASS independent reference structures: page families × five locales, five service variants, news pagination, spanning values, scheduling and career composition; no HR2B endpoints');
} finally {
  await rm(temp, {recursive: true, force: true});
}
