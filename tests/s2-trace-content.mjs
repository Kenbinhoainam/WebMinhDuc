/** Compare built, localized HTML with the selected content and its source records.
 * Run after npm run build. No network requests or simulated browser layout. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {existsSync, readFileSync, writeFileSync} from 'node:fs';
import {join, resolve} from 'node:path';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {adaptHostingPaths} from '../scripts/hosting-profile.mjs';

const root = 'docs/sdd/SEL-2026.11.27-v1.0.0';
const output = process.argv[2] ?? root + '/execution/trace-content.json';
const artifacts = process.argv[3] ?? 'dist';
const sha = process.argv[4] ?? execFileSync('git', ['rev-parse','HEAD'], {encoding:'utf8'}).trim();
const records = name => readFileSync(root + '/data/' + name,'utf8').trim().split('\n').map(row => JSON.parse(row));
const pages = records('pages-and-urls.jsonl');
const spec = new Map();
for (const file of ['P01-P10','P11-P20','P21-P30','P31-P41']) {
  for (const r of records('selections-pages-' + file + '.jsonl')) spec.set(r.effective_code,r);
}
const bundle = await build({stdin:{contents:[
  "export {jobs} from './src/jobs-data'",
  "export {getArticle} from './src/editorial-content'",
  "export {company} from './src/company'",
  "export {services,consultingTopics} from './src/pages/info/data'",
  "export {educationPrograms} from './src/education-data'",
  "export {loadLocale,translate} from './src/i18n-runtime/catalog'",
  "export {localizedSeo} from './src/seo/metadata'",
].join('\n'),resolveDir:process.cwd()}, bundle:true,platform:'node',format:'esm',write:false,logLevel:'silent'});
const {jobs,getArticle,company,services,consultingTopics,educationPrograms,loadLocale,translate,localizedSeo} =
  await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].contents).toString('base64'));
const results = new Map();
const digest = createHash('sha256');
const locales = ['vi','en','zh','ko','ja'];
const textOf = node => node?.textContent.trim();
const ts = s => s.replace(/\s+/gu,' ').trim();
const allText = (doc, selector) => [...doc.querySelectorAll(selector)].map(textOf);
for (const locale of locales) {
  await loadLocale(locale);
  const translated = value => {
    const t = translate(value,locale);
    // Data units, acronyms and proper names may be identical by design.
    return ts(t);
  };
  for (const page of pages) {
    const pageId = page.source_code;
    const number = Number(pageId.slice(1));
    if (!((number >= 3 && number <= 8) || (number >= 10 && number <= 17) || (number >= 21 && number <= 26)
      || (number >= 33 && number <= 35) || number === 39 || number === 40)) continue;
    const route = page.fields['Đường dẫn'];
    const localePrefix = locale === 'vi' ? '' : '/' + locale;
    const file = join(artifacts,localePrefix,route,'index.html');
    const html = readFileSync(file);
    digest.update(locale + route).update(html);
    const dom = new JSDOM(html.toString(), {url:'https://fixture.invalid'+localePrefix+route});
    const doc = dom.window.document;
    const canonical = new URL(doc.querySelector('[rel=canonical]').href);
    const base = canonical.pathname.replace(new RegExp(localePrefix + route + '/?$'),'');
    const loc = path => (base + localePrefix + path).replace(/\/$/,'') || '/';
    const href = link => link?.getAttribute('href');
    const h1 = textOf(doc.querySelector('h1'));
    const assertCopy = (value, selector) => {
      const texts = allText(doc,selector).map(ts);
      assert.ok(texts.includes(translated(value)), 'Missing localized '+selector+': '+translated(value));
    };
    function verify(suffix, predicate, steps, coverage='full') {
      const id = suffix.startsWith('CS-') ? suffix : pageId+'-'+suffix;
      assert.ok(spec.has(id),id);
      const researchCheck = number >= 3 && number <= 8 && suffix.startsWith('B')
        ? spec.get(id).fields['Cách kiểm tra'] : '';
      const result = results.get(id) ?? {choice_id:id,source_row:spec.get(id).row,route,coverage:researchCheck ? "partial" : coverage,steps,remaining:researchCheck,
        input_type:'Static prerendered HTML; jsdom; no screen rendering',test_status:'Pass',locales:[]};
      try {
        const observed = predicate();
        result.locales.push({locale,test_status:'Pass',actual:observed});
      } catch (e) {
        result.test_status='Fail';
        result.locales.push({locale,test_status:'Fail',actual:e.message.slice(0,1400)});
      }
      results.set(id,result);
    }
    function compareMetadata() {
      const expected = localizedSeo(route,locale);
      assert.equal(doc.title,expected.title);
      assert.equal(doc.querySelector('[name=description]').content,expected.description);
      assert.equal(canonical.href,adaptHostingPaths(expected.url));
      return expected.title+'; '+canonical.href;
    }
    function exactList(selector, expected) {
      const actual = allText(doc,selector).map(ts);
      assert.deepEqual(actual,expected.map(translated));
      return actual.join(' | ');
    }
    if (number === 3) {
      const cards = [...doc.querySelectorAll('.service-card-grid a')];
      verify('B1', () => {
        assert.equal(cards.length,5);
        return cards.map((card,i) => {
          assert.equal(href(card),loc('/services/'+services[i].slug));
          assert.equal(ts(card.querySelector('.service-card-title').textContent),translated(services[i].title));
          assert.equal(ts(card.querySelector('.service-card-detail').textContent),translated(services[i].card.detail));
          return href(card)+' '+textOf(card.querySelector('.service-card-title'));
        }).join(' | ');
      }, 'Check all five named needs, descriptive decision lines and exact localized service routes.');
      verify('B2', () => exactList('.service-card-grid .service-card-detail',services.map(s=>s.card.detail)),
        'Read the localized decision lines for shifts and staggered factory intake, fixed periods, and skills-based assessment in order.');
      verify('B3', () => {
        const card = cards[3];
        assert.equal(ts(card.querySelector('.service-card-summary').textContent),translated(services[3].short));
        assert.equal(href(card),loc('/services/college-admissions'));
        return textOf(card.querySelector('.service-card-summary'))+' '+href(card);
      }, 'Verify the learner-specific distance and full-time study summary and the admissions destination.');
    }
    if (number >= 4 && number <= 8) {
      const service = services[number-4];
      const steps = () => exactList('.service-process ol > li', service.steps);
      const headings = (selector,items) => exactList(selector,items);
      const faq = () => [exactList('.info-faq-item h3', service.questions.map(q=>q[0])),
                         exactList('.service-faq-answer p',service.questions.map(q=>q[1]))].join(' — ');
      const feeLabels = (...labels) => exactList('.service-fees tbody th',labels);
      const prompt = () => { assertCopy(service.prompt,'h2'); return translated(service.prompt); };
      const decision = () => exactList('.service-decision dt',
        number===5 ? ['Thời hạn','Đầu mối phối hợp','Điều kiện triển khai'] : ['Kỹ năng bắt buộc','Kinh nghiệm mong muốn','Cách đánh giá']);
      function check(id, test, title) { verify(id,test,title); }
      if (number === 4) {
        check('B1',()=>[prompt(),exactList('.service-planning tbody th',['A','B']),exactList('.service-planning tbody td',['Bắc Ninh','Ngày','12','02/03','Bắc Ninh','Đêm','8','09/03'])].join(' — '),
          'Match the opening question about quantity, place and time to the sample intake rows A/B and their displayed shifts/dates.');
        check('B2',()=>{assertCopy(service.card.detail,'.service-decision p');return translated(service.card.detail);},
          'Match the two distinct responsibilities in the displayed factory and sourcing handoff.');
        check('B3',steps,'Compare all five ordered steps, from receipt of needs to following feedback.');
        check('B4',()=>feeLabels('Tìm nguồn','Tiếp nhận')+' — '+faq(),'Verify sourcing and intake price factors and scope-dependent FAQ responses in each locale.');
      }
      if (number === 5) {
        check('B1',()=>prompt()+' — '+decision(),'Read the opening shift/duration question and three responsibilities.');
        check('B2',()=>{assertCopy(service.questions[1][1],'.service-decision dd');return translated(service.questions[1][1]);},
          'Display the explicit joint verification of occupation, legal conditions and responsibilities before signature.');
        check('B3',()=>steps()+' — '+feeLabels('Thời hạn','Ca làm việc'),'Verify the distinct five-step process and the two duration/shift price factors.');
        check('B4',faq,'Compare all three duration, conditions and fees questions and their conditional localized answers against the verified service record.');
      }
      if (number === 6) {
        check('B1',()=>{assertCopy(service.title,'h1');assertCopy('Tiêu chí tuyển kỹ thuật viên bảo trì','.service-role h2');return h1+' — '+textOf(doc.querySelector('.service-role h2'));},
          'Compare the service title and the named maintenance-technician example.');
        check('B2',()=>decision()+' — '+exactList('.service-role dd',['Đọc sơ đồ và nhận diện lỗi thiết bị.','Mô tả thiết bị đã bảo trì và phần việc đã đảm nhiệm.','Trao đổi một tình huống xử lý sự cố với người phụ trách kỹ thuật.']),
          'Match each of three distinct skill, experience and assessment fields to its explanation.');
        check('B3',steps,'Read the five ordered sequence entries from role definition to following results.');
        check('B4',faq,'Check the position, candidate preparation and market-dependent recruiting timeline responses.');
      }
      if (number === 7) {
        check('B1',()=>prompt()+' — '+headings('.service-study h3',['Từ xa','Chính quy']),'Check the study-time question against both decision options.');
        check('B2',()=>{
          const links=[...doc.querySelectorAll('.service-overview-actions a,.service-study a')];
          assert.deepEqual(links.map(href),['/education?form=F05#dang-ky','/education?form=F06#dang-ky','/education'].map(loc));
          return links.map(a=>textOf(a)+' '+href(a)).join(' | ');
        },'Compare the study information URL and the separately labeled F05 consultation and F06 application destinations.');
        check('B3',()=>feeLabels('Học phí','Hồ sơ đăng ký')+' — '+exactList('.service-fees tbody td',['Đơn vị đào tạo','Mức thu và lịch đóng','Bộ phận tuyển sinh của trường','Các khoản phí liên quan']),
          'Read the distinct training-unit and admissions-office confirmations for tuition and application costs.');
        check('B4',()=>{assertCopy('Đối tác doanh nghiệp','.info-service-customers h2');assertCopy('Tình huống minh họa · Nhân vật giả định','.service-stories-heading p');return textOf(doc.querySelector('.service-stories-heading'));},
          'Identify the logos explicitly as corporate partners and read the illustrative-situations and fictitious-persons qualification.');
      }
      if (number === 8) {
        check('B1',()=>prompt()+' — '+exactList('.service-workflow li',['Tiếp nhận nhu cầu','Phân công','Theo dõi phản hồi']),
          'Match the duplicated-entry question to the three ordered intake/assignment/follow-up steps.');
        check('B2',()=>steps()+' — '+exactList('.service-consulting-list h3',consultingTopics.map(item=>item.title)),
          'Distinguish the survey findings, coordination process, and three topics to agree.');
        check('B3',()=>feeLabels('Tổ chức và quy trình','Công cụ quản lý')+' — '+exactList('.service-consulting-list p',consultingTopics.map(item=>item.text)),
          'Check the stated organizational, process and current tooling scope and its three explanations.');
        check('B4',faq,'Read all answers for scope, initial discussion and limits of general guidance, including the specialized legal opinion qualification.');
      }
    }
    if (number >= 10 && number <= 17) {
      const job = jobs[number-10];
      assert.equal(route,'/jobs/'+job.slug);
      for (const [i,group] of ['tasks','requirements','benefits'].entries()) {
        verify('B'+(i+1), () => {
          assert.equal(h1,translated(job.title));
          const blocks = doc.querySelectorAll('.job-description-block');
          const items = allText(blocks[i],'li').map(ts);
          assert.deepEqual(items,job[group].map(translated));
          assert.equal(items.length,3);
          return job.id+': '+items.join(' | ');
        },'Compare the three localized list items in their displayed section with the corresponding job record.');
      }
      verify('B4',() => {
        const actions = doc.querySelector('.job-summary-actions');
        if (job.status === 'closed') {
          assertCopy('Đã đóng','.job-detail-intro .job-status');
          assertCopy('Vị trí đã đóng, không nhận ứng tuyển.','.job-closed');
          assert.equal(doc.querySelectorAll('.job-apply-button,.job-mobile-apply').length,0);
          assert.equal(href(actions.querySelector('a')),loc('/jobs?status=active#job-listings'));
          return job.id+' closed in heading and summary, with link to active jobs';
        }
        assertCopy(job.category,'.job-summary dd');
        assertCopy('Vị trí và thu nhập minh họa, chưa phải thông báo tuyển dụng.','.jobs-data-note');
        assert.equal(href(doc.querySelector('.jobs-back')),loc(job.internal ? '/careers#open-positions' : '/jobs#job-listings'));
        return job.id+' category: '+translated(job.category)+'; '+translated('Vị trí và thu nhập minh họa, chưa phải thông báo tuyển dụng.');
      },'Read record category and prototype qualification; verify archive destination, or consistent closed state for MD005.');
      verify('F1',()=>{assert.equal(h1,translated(job.title));return job.id+'; '+compareMetadata()},'Match route slug, h1, title, description and canonical to the matching job record and locale metadata.');
      if (job.status !== 'closed') verify('E3',()=>{
        assertCopy('Thu nhập tham khảo','.job-pay dt');
        assertCopy(job.salary,'.job-pay dd');
        assertCopy('Vị trí và thu nhập minh họa, chưa phải thông báo tuyển dụng.','.jobs-data-note');
        return translated('Thu nhập tham khảo')+' '+translated(job.salary);
      },'Match the salary field, reference-income label and prototype qualification, including the nonnumeric MD008.');
    }
    if (number >= 21 && number <= 26) {
      const article = getArticle(route.split('/').at(-1));
      const sections = [...doc.querySelectorAll('.ed-prose-section')];
      const headlines = spec.get(pageId+'-B1').fields['Chi tiết để chọn'].match(/“[^”]+”/g).map(s=>s.slice(1,-1));
      verify('B1',()=>{
        const dataHeadings = article.sections.map(s=>s.heading);
        assert.deepEqual(dataHeadings.filter(h => headlines.includes(h)),headlines);
        const headings=sections.map(s=>textOf(s.querySelector('h2')).replace(/^\d+\.\s*/,''));
        assert.deepEqual(headings,dataHeadings.map(translated));
        return headings.join(' → ');
      },'Read ordered section headings against the three quoted headings in the frozen row, then their translations.');
      verify('B2',()=>{
        assert.equal(h1,translated(article.title));
        assertCopy(article.excerpt,'.ed-story-head .ed-lead');
        assertCopy(article.category,'.ed-story-meta a');
        assert.ok(sections.every(s=>s.querySelector('p')?.textContent.trim()));
        return translated(article.category)+'; '+translated(article.excerpt);
      },'Compare headline, full lead and category against editorial source; inspect actual prose presence. Semantic judgment of the summary remains editorial.','partial');
      const business = [22,24,25].includes(number);
      function articleAction() {
        const cta = doc.querySelector('.ed-actions a.btn');
        const expected=new URL(loc(business ? '/#business-contact':'/jobs'),canonical);
        const target=new URL(cta.getAttribute('href'),canonical);
        assert.equal(target.pathname.replace(/\/$/,''),expected.pathname.replace(/\/$/,''));
        assert.equal(target.hash,expected.hash);assert.equal(target.search,expected.search);
        assert.equal(textOf(cta),translated(business ? 'Gửi nhu cầu nhân lực' : 'Xem việc làm'));
        return textOf(cta)+' → '+cta.getAttribute('href');
      }
      verify('E1',articleAction,'Read labeled call to action and verify its exact audience-specific local route or fragment.');
      if (number===24) verify('B3',articleAction,'Verify that this HR-perspective story specifically uses the employer CTA.');
      if ([21,22,23,25].includes(number)) verify('B3',()=>{
        const listIndex=article.sections.findIndex(s=>s.bullets?.length===4);
        assert.ok(listIndex>=0,'Missing four-item source checklist');
        const lists=article.sections[listIndex].bullets;
        const actual=allText(sections[listIndex],'li').map(ts);
        assert.deepEqual(actual,lists.map(translated));
        return actual.join(' | ');
      },'Compare each of the four checklist entries with the corresponding article.');
      function relatedDestinationLinks() {
        assertCopy('Tin tức','.ed-crumbs a');
        assertCopy('Trở về tất cả bài viết','.ed-actions a');
        const archiveLink=new URL(doc.querySelector('.ed-actions a:not(.btn)').getAttribute('href'),canonical);
        assert.equal(archiveLink.pathname,loc('/news'));
        assert.ok(!archiveLink.hash || archiveLink.hash==='#news-listings');
        const current = new URL(canonical);
        const related = [...doc.querySelectorAll('.ed-related a')], latest = [...doc.querySelectorAll('.ed-reader-latest a')];
        assert.ok(related.length>=2 && latest.length>=1);
        const paths = [...related,...latest].map(a=>new URL(a.getAttribute('href'),current).pathname);
        assert.equal(paths.length,new Set(paths).size);
        assert.ok(!paths.includes(current.pathname));
        for (const a of [...related,...latest]) {
          const path = new URL(a.getAttribute('href'),current).pathname;
          assert.ok(path.startsWith(loc('/news')+'/'));
          const entry = getArticle(path.split('/').at(-1));
          assert.ok(entry && a.textContent.includes(translated(entry.title)),path+' labeled destination');
          assert.ok(existsSync(join(artifacts,path.slice(base.length),'index.html')),path+' exists in build');
        }
        return related.length+' related articles, '+latest.length+' latest articles, no duplicate or self-link; localized return route.';
      }
      verify('B4',relatedDestinationLinks,'Read breadcrumb and return labels, verify non-self related links and their target records, distinguish latest stories from related.');
      verify('E3',relatedDestinationLinks,'Follow URLs from related and latest cards to their packaged files; verify distinct reading paths and local archive.');
      verify('C1',()=>{
        const summary=doc.querySelector('.ed-toc details > summary');
        assert.ok(summary && summary.textContent.trim());
        assert.equal(summary.parentElement.open,false);
        summary.click();assert.equal(summary.parentElement.open,true);
        const contents=[...summary.parentElement.querySelectorAll('a')];
        assert.equal(contents.length,sections.length);assert.ok(contents.length>=3);
        for (const [i,a] of contents.entries()) {
          assert.equal(a.hash,'#article-section-'+i);
          assert.equal(textOf(a),translated(article.sections[i].heading));
          assert.equal(sections[i].querySelector('h2').id,a.hash.slice(1));
        }
        summary.click();assert.equal(summary.parentElement.open,false);
        return 'native details closed/open/closed; '+contents.map(a=>a.hash).join(', ');
      },'Activate native disclosure twice; verify each of three links, translated titles and exact unique section destinations.');
      verify('F1',()=>{assert.equal(h1,translated(article.title));return compareMetadata()},'Compare original slug, localized headline and generated title/description/canonical with the editorial record.');
      function articleShare() {
        const social=[...doc.querySelectorAll('.ed-share a')];
        assert.equal(social.length,2);
        const urls=social.map(a=>new URL(a.href));
        assert.equal(urls[0].hostname,'www.facebook.com');assert.equal(urls[1].hostname,'www.linkedin.com');
        assert.equal(urls[0].searchParams.get('u'),canonical.href);
        assert.equal(urls[1].searchParams.get('url'),canonical.href);
        assert.ok(social.every(a=>a.target==='_blank' && a.relList.contains('noopener')));
        return 'Facebook and LinkedIn targets encode '+canonical.href;
      }
      verify('C4',articleShare,'Inspect native share links for this locale; validate tab isolation and URL parameters without publishing.');
      verify('F2',articleShare,'Validate the two share parameters against the exact canonical URL emitted for this localized build.');
      verify('F3',()=>{
        const cover=doc.querySelector('.ed-story-photo');
        if (!article.image) {assert.equal(cover,null);return 'No cover or empty cover frame.'}
        const img=cover.querySelector('img');assert.ok(img?.getAttribute('alt')?.trim());
        const imgs=[img,...doc.querySelectorAll('.ed-related img')];let total=0;
        for (const element of imgs) {
          const candidates=[element.getAttribute('src'),...(element.getAttribute('srcset')??'').split(',').map(x=>x.trim().split(' ')[0])].filter(Boolean);
          assert.ok(candidates.length>1,'requires responsive alternatives');
          for (const url of candidates) {
            const pathname=new URL(url,canonical).pathname;
            assert.ok(pathname.startsWith(base+'/'), 'unexpected asset origin or base: '+url);
            assert.ok(existsSync(join(artifacts,pathname.slice(base.length))), 'missing packaged image '+url);
            total++;
          }
        }
        return total+' packaged image candidates across cover and related images.';
      },'Inspect optional cover container, related image sources, responsive candidates, alt and packaged files.');
    }
    if (number>=33 && number<=35) {
      const program=educationPrograms.find(x=>route.endsWith('/'+x.slug));
      verify('B1',()=>{
        assert.equal(h1,translated(program.title));
        assertCopy(program.description,'main p');
        assertCopy(program.detail,'.education-program-detail p');
        return translated(program.detail);
      },'Match program label, purpose and qualification against the finite program record.');
      const questions=spec.get(pageId+'-B2').fields['Chi tiết để chọn'].replace(/^.*?: /,'').split(' / ');
      verify('B2',()=>{
        const actual=allText(doc,'.education-program-detail li').slice(0,2);
        assert.deepEqual(actual,questions.map(translated));return actual.join(' | ');
      },'Compare both distinct program-specific questions against the frozen source.');
      verify('B3',()=>{
        assertCopy('Đây là chương trình giả định, không gắn với trường cụ thể. Vui lòng xác nhận thông tin tuyển sinh trước khi đưa ra quyết định.','.education-program-detail p');
        const question='Điều kiện tuyển sinh, học phí và văn bằng do đơn vị nào xác nhận?';
        assertCopy(question,'.education-program-detail li');return translated(question);
      },'Verify explicit hypothetical status and the training-provider confirmation for tuition, requirements and qualification.');
      verify('F1',()=>{assert.equal(h1,translated(program.title));assertCopy(program.detail,'.education-program-detail p');return compareMetadata()},'Compare slug, title, copy, metadata in all five locales.');
      verify('C1',()=>{
        for (const type of ['F05','F06']) assert.ok([...doc.querySelectorAll('main a')].some(a=>href(a)===loc(route+'?form='+type+'#dang-ky')));
        assert.ok(doc.getElementById('dang-ky'));return 'Both F05 and F06 on '+loc(route)+'#dang-ky';
      },'Verify two form CTA targets and their shared in-page destination.');
    }
    if ([39,40].includes(number)) {
      const policy=doc.querySelector('.info-policy');
      function contactLinks() {
        const block=policy.querySelector('.info-policy-contact');
        assert.equal(block.querySelector('a[href^="tel:"]').getAttribute('href'),'tel:'+company.tel);
        assert.equal(block.querySelector('a[href^="mailto:"]').getAttribute('href'),'mailto:'+company.email);
        assert.equal(textOf(block.querySelector('a[href^="tel:"]')),company.phone);
        assert.equal(textOf(block.querySelector('a[href^="mailto:"]')),company.email);
        return 'Both company contact destinations and their display labels verified.';
      }
      verify('C2',contactLinks,'Read both native link schemes, values and labels against company.ts; do not initiate a call or send mail.');
      verify('E2',contactLinks,'Read the displayed contact fields and their native destinations.');
      verify('C1',()=>{
        const links=[doc.querySelector('.info-article-breadcrumb a'),policy.querySelector('a.btn')];
        assert.ok(links.every(a=>a && new URL(a.href).pathname.replace(/\/$/,'')===(loc('/').replace(/\/$/,''))));
        return links.map(a=>a.getAttribute('href')).join(', ');
      },'Compare the breadcrumb and return action to the current locale home.');
      verify('B4',()=>{
        const list=allText(policy,'h2').filter(s=>/^\d/.test(s));
        assert.deepEqual(list.map(s=>s.match(/^\d/)[0]),['1','2','3','4','5']);
        assert.ok(list.every(s=>s.length>4));
        assertCopy('Bản dự thảo cho prototype','.info-policy .info-demo-tag');
        return list.join(' | ');
      },'Read all numbered document sections in sequence and the draft label.');
      verify('E3',()=>{
        const links=[...policy.querySelectorAll('a')];assert.equal(links.length,3);
        contactLinks();assert.equal(policy.querySelector('form'),null);
        assert.ok(links.some(a=>new URL(a.href).pathname.replace(/\/$/,'')===loc('/').replace(/\/$/,'')));
        return 'Document actions limited to company phone, email and return home.';
      },'Inspect every link and form scoped to the policy document.');
      verify('F1',compareMetadata,'Compare localized document title, description and route to the metadata registry.');
      verify('F3',()=>{
        assert.match(doc.querySelector('[name=robots]').content,/\bnoindex\b/);
        assertCopy('Bản dự thảo cho prototype','.info-policy .info-demo-tag');
        return 'noindex and localized draft label present';
      },'Read robots directive together with the draft notice in the rendered policy.');
    }
    dom.window.close();
  }
}
const choices=[...results.values()];
const report={build_sha:sha,artifact_input:resolve(artifacts).split('/').at(-1),tested_html_sha256:digest.digest('hex'),
  runtime:'Node '+process.version+'; '+process.platform+'; jsdom, prerendered HTML; no viewport or browser layout',
  choices};
writeFileSync(output,JSON.stringify(report,null,2)+'\n');
const failed=choices.filter(r=>r.test_status==='Fail');
console.log(choices.length+' individual frozen content predicates × '+locales.length+' locales, '+failed.length+' failed. '+output);
for (const row of failed) console.log(row.choice_id+': '+JSON.stringify(row.locales.filter(r=>r.test_status==='Fail').slice(0,1)));
if (failed.length) process.exitCode=1;
