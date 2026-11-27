import {outputPath} from './pages-paths.mjs';
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
  let vietnameseHomeHeadlines;
  for (const locale of ['vi', 'en', 'zh', 'ko', 'ja']) {
    await loadLocale(locale);
    const base = localeBase(locale);
    let homeServiceCards;
    for (const [path, pattern, name] of cases) {
      const html = renderToStaticMarkup(React.createElement(LocaleProvider, {value: locale}, React.createElement(MemoryRouter, {basename: base || '/', initialEntries: [`${base}${path}`]}, React.createElement(Routes, null, React.createElement(Route, {path: pattern, element: React.createElement(components[name])})))));
      const dom = new JSDOM(`<main>${html}</main>`);
      const doc = dom.window.document;
      const label = `${locale} ${path}`;
      assert.equal(doc.querySelectorAll('h1').length, 1, `${label}: one page title`);
      assert.ok(doc.querySelector('h1').textContent.trim());
      for (const image of doc.querySelectorAll('img')) {
        const candidates = [image.getAttribute('src'), ...(image.getAttribute('srcset') || '').split(',').map(value=>value.trim().split(/\s+/)[0])].filter(Boolean);
        for (const url of candidates) if (url.startsWith('/')) assert.ok(existsSync(`public${outputPath(url)}`), `${label}: missing local image ${url}`);
      }
      for (const node of doc.querySelectorAll('a[href],form[action],script[src],iframe[src]')) {
        const url = node.getAttribute('href') || node.getAttribute('action') || node.getAttribute('src') || '';
        assert.doesNotMatch(url, /^(?:https?:)?\/\/(?:www\.)?hr2b\.com|^(?:mailto:)[^\s]*@hr2b\.com/i, `${label}: reference presentation must not restore HR2B service endpoints`);
      }
      const serviceCards = [...doc.querySelectorAll('.service-gallery-card')].map(card => {
        const link = card.querySelector('a');
        const [heading,action] = link.getAttribute('aria-labelledby').split(' ').map(id=>doc.getElementById(id));
        assert.equal(action,card.querySelector('.service-card-cta'),'the visible CTA belongs to the accessible link name');
        assert.equal(heading,card.querySelector('h3'),'single card link is named by its service');
        assert.equal(card.querySelectorAll('a').length,1,'a whole card is one tab stop');
        const details=link.getAttribute('aria-describedby').split(' ').map(id=>doc.getElementById(id)?.textContent);
        assert.ok(details.length===2 && details.every(Boolean),'summary and expanded detail are accessible');
        return {href:link.getAttribute('href'),title:heading.textContent,details,
          photo:card.querySelector('.service-card-photo[width][height]').getAttribute('src'),
          icon:card.querySelector('.service-card-icon').className,
          action:card.querySelector('.service-card-cta').textContent.trim()};
      });
      if (name==='Home') homeServiceCards=serviceCards;
      if (name==='ServicesPage' || name==='AboutPage' || name==='ServicePage') {
        assert.deepEqual(serviceCards,homeServiceCards.filter(card=>card.href!==base+path),label+' matches the homepage service cards');
      }
      if (name === 'Home') {
        const sections = [...doc.querySelector('main').children].filter(node => node.tagName === 'SECTION');
        const sequence=sections.map(section=>section.classList[0]);
        assert.deepEqual(sequence,['home-hero','section-home-about','section-home-solution','section-home-partners','home-b2b-contact','home-editorial','home-films'],label);
        for (const section of sections.slice(1,5)) assert.ok(section.querySelector('[data-reveal]'), section.className);
        const frames=[...doc.querySelectorAll('[data-reveal-frame]')];
        assert.ok(frames.length > 4, 'stable frames cover the journey');
        for (const frame of frames) {
          assert.equal(frame.children.length, 1, 'each observed frame has one normal-flow animation child');
          assert.ok(frame.firstElementChild.classList.contains('motion-content'));
        }
        assert.equal(doc.querySelectorAll('[data-reveal] [data-reveal]').length, 0, 'nested reveals must not multiply transforms or hide interactive descendants twice');
        assert.equal(doc.querySelectorAll('.service-gallery-card').length,5);
        assert.ok(doc.querySelector('.section-home-partners .partners-track'));
        assert.equal(doc.querySelectorAll('.partners-strip').length,1);
        assert.ok(doc.querySelector('#business-contact .contact-form'));
        const news=doc.querySelector('.home-editorial-layout');
        const lead=news.querySelector(':scope > .home-editorial-lead a');
        const desks=[...news.querySelectorAll('.home-editorial-desks > .home-editorial-list')];
        assert.ok(lead.querySelector('h3') && lead.querySelector('img'), 'photo and headline open the lead');
        assert.deepEqual(desks.map(desk=>desk.querySelector('h3 a').getAttribute('href')),['workers','employers','hr'].map(category=>base+'/news?category='+category+'#news-listings'));
        const destinations=[lead.getAttribute('href')];
        for (const desk of desks) {
          const links=[...desk.querySelectorAll('li a')];
          assert.equal(links.length,2,'each of the three topics pairs an illustrated story with another headline');
          for (const link of links) {
            const headline=doc.getElementById(link.getAttribute('aria-labelledby'));
            const date=link.querySelector('time[datetime]');
            assert.ok(headline.compareDocumentPosition(date) & dom.window.Node.DOCUMENT_POSITION_FOLLOWING,'headline comes before its publication date');
            destinations.push(link.getAttribute('href'));
          }
        }
        assert.equal(new Set(destinations).size,7,'lead plus two distinct stories for each topic');
        const titles=[...news.querySelectorAll('a[aria-labelledby]')].map(link=>doc.getElementById(link.getAttribute('aria-labelledby')).textContent.trim());
        if (locale==='vi') vietnameseHomeHeadlines=titles;
        else assert.ok(titles.every((title,index)=>title && title!==vietnameseHomeHeadlines[index]),label+' all home headlines are localized');
        const illustrated=[...news.querySelectorAll('img')];
        assert.equal(illustrated.length,4,'lead and all three topics display their own article image');
        assert.equal(new Set(illustrated.map(photo=>photo.getAttribute('src'))).size,illustrated.length,'each picture has a distinct story');
        for (const photo of illustrated) {
          const link=photo.closest('a');
          assert.ok(link?.getAttribute('href').startsWith(base+'/news/'));
          assert.ok(doc.getElementById(link.getAttribute('aria-labelledby')).textContent.trim());
          assert.equal(link.closest('article,li').querySelectorAll('a[href]').length,1);
        }
        assert.ok(doc.querySelector('.home-film-feature .home-film-poster'));
        assert.equal(doc.querySelectorAll('video').length,1,'gallery video loads only when requested');
      }
      if (name === 'AboutPage') {
        assert.equal(doc.querySelectorAll('.info-about-values article').length, 3);
        assert.ok(doc.querySelector('#profile .about-profile-intro + .info-about-values'), 'three values have a row below the company profile cover');
        assert.equal(doc.querySelectorAll('button.info-team-card').length, 4, 'sample profiles expose actual dialog triggers');
        assert.equal(doc.querySelectorAll('#profile .about-scope-item').length, 4);
        assert.equal(doc.querySelector('.info-about-values [role="tablist"],.info-value-tabs'), null, 'source simultaneous values replace custom value tabs');
        assert.equal(doc.querySelectorAll('#history [role="tab"]').length, 3, 'history phases retain a distinct synchronized selector');
        assert.equal(doc.querySelectorAll('#history [role="tabpanel"]').length, 1);
        for (const id of ['history', 'achievements']) assert.ok(doc.getElementById(id), `${label}: preserved navigation anchor ${id}`);
        assert.ok(doc.querySelector('form'), 'reference About ends with usable consultation form');
      }
      if (name === 'ServicesPage') {
        assert.equal(doc.querySelector('[role="tablist"]'), null);
        const directory=doc.querySelector('.service-directory');
        assert.equal(directory.querySelectorAll('nav.service-card-grid article > a').length,5,'all services visible in the directory grid');
        assert.equal(doc.querySelector('.service-gallery-track'),null,'the directory has one set of cards');
        assert.ok(doc.querySelector('.md-photo-masthead .md-masthead-figure').compareDocumentPosition(directory) & dom.window.Node.DOCUMENT_POSITION_FOLLOWING,'service grid follows the masthead');
        assert.ok(directory.querySelector('.service-index-actions button') && directory.querySelector('a[href="'+base+'/jobs"]'));
      }
      if (name === 'ServicePage') {
        const recruitment = path.endsWith('/recruitment');
        const consulting = path.endsWith('/hr-consulting');
        const admissions = path.endsWith('/college-admissions');
        const selectors = ['.md-ref-fee-section','.info-faq-section',...(!recruitment?['.info-service-customers']:[]),'.service-gallery',...(!admissions?['.info-contact-section']:[])];
        const nodes = selectors.map(selector=>doc.querySelector(selector));
        assert.ok(nodes.every(Boolean), `${label}: complete mapped service modules`);
        for(let i=1;i<nodes.length;i++) assert.ok(nodes[i-1].compareDocumentPosition(nodes[i]) & dom.window.Node.DOCUMENT_POSITION_FOLLOWING, `${label}: source service sequence ${selectors[i]}`);
        const slug = path.split('/').at(-1);
        const masthead = doc.querySelector('.md-photo-masthead');
        assert.ok(masthead.querySelector('h1') && masthead.querySelector('img[alt]'));
        assert.ok(doc.querySelector('.service-overview-actions :is(a,button)'), 'opening service overview offers the relevant action');
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
        const related=[...doc.querySelectorAll('.service-gallery-track article a')].map(link=>link.getAttribute('href'));
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
        assert.equal(new Set([...featureSlides].map(node=>node.querySelector('a.ed-feature').getAttribute('href'))).size,featureSlides.length);
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
        assert.equal(doc.querySelectorAll('article.contact-office').length, 3);
        assert.ok(doc.querySelector('#contact-map iframe[title]'),'the map is labelled and accompanies the persistent office directions');
        assert.ok(doc.querySelector('form.contact-form'));
        assert.ok(doc.getElementById('consultation'));
      }
      dom.window.close();
    }
  }
  const gallery = postcss.parse(await readFile('src/service-showcase.css','utf8'));
  const responsiveWidths=[];
  gallery.walkRules('.service-gallery-track',rule=>rule.walkDecls('grid-auto-columns',decl=>responsiveWidths.push(decl.value)));
  assert.deepEqual(responsiveWidths,['calc((100% - 2 * var(--card-gap)) / 3)','calc((100% - var(--card-gap)) / 2)','100%'],'three desktop services, two on a tablet, one on a phone');
  let narrowCardsUseContentHeight=false;
  gallery.walkAtRules('media',rule=>{
    if (rule.params!=='(max-width:350px)') return;
    rule.walkRules('.service-gallery-card > a',card=>card.walkDecls('aspect-ratio',decl=>{
      narrowCardsUseContentHeight ||= decl.value==='auto';
    }));
  });
  assert.ok(narrowCardsUseContentHeight,'at 320px the card height follows its text and CTA');
  gallery.walkRules('.service-gallery-card > a',rule=>rule.walkDecls(decl=>{
    assert.ok(!['height','max-height','block-size','max-block-size','overflow'].includes(decl.prop),'content can grow, only the photo is cropped');
  }));
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
