import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {JSDOM} from 'jsdom';

const supported = [
  ['vi','', 'vi'], ['en','en','en'], ['zh','zh','zh-Hans'], ['ko','ko','ko'], ['ja','ja','ja'],
];
const stories = [
  'ho-so-xin-viec','nhu-cau-tuyen-dung','chon-cong-viec-phu-hop',
  'thong-tin-tuyen-dung-minh-bach','don-tiep-lao-dong-moi','an-toan-thong-tin-khi-tim-viec',
  'doc-thong-tin-thu-nhap-va-ca-lam','theo-doi-pheu-tuyen-dung',
];
const events = [
  ['ngay-hoi-ket-noi-viec-lam', '2026-11-28', 4],
  ['toa-dam-ke-hoach-nhan-luc','2026-12-05',4],
  ['hanh-trang-tim-viec','2026-11-08',3],
];
const education = ['tu-xa-quan-tri','chinh-quy-cong-nghe','tu-xa-ke-toan'];
const pages = ['about-us','news','events','partners','education','consultation','admin-demo','privacy-policy','terms-of-use',
  ...stories.map(slug => 'news/' + slug),
  ...events.map(([slug]) => 'events/' + slug),
  ...education.map(slug => 'education/' + slug),
];
const planningHeadings = [[0,'Bắt đầu từ kế hoạch vận hành'],[2,'Thống nhất thông tin trước khi tìm nguồn'],[4,'Theo dõi và cập nhật theo giai đoạn']];
const planningChecklist = [
  'Địa điểm và phương án đi lại nếu có.',
  'Ca làm, yêu cầu cơ bản và điều kiện làm việc.',
  'Thu nhập, cách tính và các khoản cần làm rõ.',
  'Đầu mối xác nhận lịch phỏng vấn, nhận việc.',
];
const root = process.argv[2] ?? 'dist';
let origin;

for (const [locale,prefix,language] of supported) {
  const dictionary = locale === 'vi' ? {} : JSON.parse(readFileSync('src/i18n-generated/'+locale+'.json','utf8')).merged;
  const label = key => dictionary[key] ?? key;
  for (const path of pages) {
    const file = join(root,prefix,path,'index.html');
    const html = readFileSync(file,'utf8');
    const dom = new JSDOM(html);
    const {document:doc} = dom.window;
    const q = selector => doc.querySelector(selector);
    const expectedPath = '/' + [prefix,path].filter(Boolean).join('/');
    const canonical = new URL(q('link[rel=canonical]').getAttribute('href'));
    origin ??= canonical.origin;
    const originalPath = canonical.pathname.replace(/^\/WebMinhDuc(?=\/)/,'').replace(/\/$/,'');
    assert.equal(originalPath,expectedPath,file);
    assert.equal(canonical.origin,origin,file);
    assert.equal(doc.documentElement.lang,language,file);
    assert.equal(doc.querySelectorAll('main h1').length,1,file);
    assert.match(q('meta[name=robots]').content,/noindex/,file);
    assert.equal(doc.querySelectorAll('link[rel=alternate][hreflang]').length,6,file);
    if (path==='about-us') {
      for (const id of ['profile','history','partners','activities','achievements','business-contact']) {
        assert.ok(q('#'+id+' h2'),file+' #'+id);
      }
    } else if (path==='news') {
      const button = q('.ed-feature-pause');
      assert.ok(doc.getElementById(button.getAttribute('aria-controls')),file);
      assert.equal(doc.querySelectorAll('.ed-archive-row').length,3,file);
      assert.ok(q('.ed-filters button[aria-pressed=true]'),file);
      assert.equal(q('.ed-pagination button[aria-current=page]').textContent,'1',file);
    } else if (path.startsWith('news/')) {
      const disclosure = q('.ed-toc details');
      assert.equal(disclosure.open,false,file);
      for (const link of doc.querySelectorAll('#article-toc a')) {
        assert.ok(doc.getElementById(new URL(link.href,canonical).hash.slice(1)),file);
      }
      for (const link of doc.querySelectorAll('.ed-share a')) {
        const shared = new URL(link.href);
        assert.equal(shared.searchParams.get('u') ?? shared.searchParams.get('url'),canonical.href,file);
      }
      if (path==='news/thong-tin-tuyen-dung-minh-bach' || path==='news/an-toan-thong-tin-khi-tim-viec') assert.equal(q('.ed-story-photo'),null,file);
      if (path==='news/nhu-cau-tuyen-dung') {
        assert.equal(doc.querySelectorAll('#article-toc li').length,6,file);
        for (const [index,key] of planningHeadings) {
          const heading = doc.getElementById('article-section-'+index);
          assert.ok(heading.textContent.endsWith(label(key)),file);
          assert.equal(q('#article-toc a[href$="#article-section-'+index+'"]').textContent,label(key),file);
        }
        assert.deepEqual([...doc.querySelectorAll('section[aria-labelledby="article-section-1"] ul li')].map(item=>item.textContent),planningChecklist.map(label),file);
      }
    } else if (path.startsWith('events/')) {
      const [,date,slots] = events.find(([slug]) => path.endsWith('/'+slug));
      assert.equal(doc.querySelectorAll('.ed-anchor-nav a').length,5,file);
      assert.ok(q('.ed-facts time[datetime="'+date+'"]'),file);
      const agenda = [...doc.querySelectorAll('.ed-agenda time')];
      assert.equal(agenda.length,slots,file);
      assert.ok(agenda.every(time=>time.dateTime.startsWith(date+'T')&&time.dateTime.endsWith('+07:00')),file);
      assert.doesNotMatch(html,/"@type"\s*:\s*"Event"/,file);
    } else if (path.startsWith('education/')) {
      const select = q('#dang-ky select[name=program]');
      assert.equal(select.value,path.split('/')[1],file);
      assert.ok(q('.education-form-tabs button[aria-pressed=true]'),file);
    } else if (path==='consultation') {
      assert.equal(doc.querySelectorAll('.consultation-times input[type=radio]').length,4,file);
      assert.ok(q('input[type=date][required]'),file);
    } else if (path==='admin-demo') {
      assert.equal(doc.querySelectorAll('.admin-table-wrap th[scope=col]').length,6,file);
      assert.equal(q('.admin-table-wrap').getAttribute('tabindex'),'0',file);
    } else if (path==='privacy-policy' || path==='terms-of-use') {
      assert.equal(doc.querySelectorAll('.info-policy-body > h2').length,6,file);
      assert.ok(q('.info-policy-contact a[href^=tel]'),file);
      assert.ok(q('.info-policy-contact a[href^=mailto]'),file);
      assert.equal(q('.info-policy form'),null,file);
    }
    dom.window.close();
  }
}
console.log('PASS artifact HTML: '+(pages.length * supported.length)+' route/locale combinations under '+origin+
  '; canonical/alternate/noindex, About anchors, editorial/clip/share URLs, mock event dates, Education form defaults, ADMIN and policies.');
