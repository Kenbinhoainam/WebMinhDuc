/** Verify both shipped reviewer HTML files, without requesting a network resource.
 * node tests/s2-trace-reviewer.mjs <app-sha> <sites-dist> [pages-dist]
 */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {JSDOM} from 'jsdom';

const [sha,sites, pages='dist'] = process.argv.slice(2);
assert.match(sha,/^[0-9a-f]{40}$/);
const output = 'docs/sdd/SEL-2026.11.27-v1.0.0/execution';
const origin = 'https://reviewer-fixture.invalid';
const widths = [[390,844],[820,1180],[1440,900]];
const original = ['/','/about-us','/services','/jobs','/careers','/education','/news','/contact'];
const extras = ['/#home-services-title','/services#service-directory-heading','/#home-editorial-heading',
               '/news/nhu-cau-tuyen-dung','/#home-films-heading'];
const checks = [];
const artifacts = {};
function open(html,url,deviceWidth) {
  return new JSDOM(html,{url,runScripts:'dangerously',beforeParse(win){
    Object.defineProperty(win.HTMLElement.prototype,'clientWidth',{configurable:true,get(){return deviceWidth;}});
  }});
}
function observe(profile,name,assertion) {
  const actual = assertion();
  checks.push({profile,name,actual});
}
for (const [profile,dir,mount] of [['sites',sites,'/'],['pages',pages,'/WebMinhDuc/']]) {
  const html = readFileSync(join(dir,'duyet.html'),'utf8');
  artifacts[profile]=createHash('sha256').update(html).digest('hex');
  const base = origin+mount;
  const first = open(html,base+'duyet.html',1200);
  const options = [...first.window.document.querySelector('select').options].map(option=>option.value);
  assert.deepEqual([...options].sort(),[...original,...extras].sort());
  assert.equal(first.window.document.querySelector('meta[name="robots"]').content,'noindex,nofollow');
  assert.equal(first.window.document.querySelectorAll('script[src],link[rel=stylesheet]').length,0);
  checks.push({profile,name:'Standalone reviewer and mapped inventory',actual:{original,extras,robots:'noindex,nofollow',assets:0}});
  first.window.close();
  for (const screen of [320,390,700,820,1024,1440,1920]) {
    for (const [width,height] of widths) {
      const dom = open(html,base+'duyet.html?w='+width,screen);
      const d = dom.window.document;
      observe(profile,'CSS frame dimensions and scale at simulated width '+screen,()=>{
        const frame = d.querySelector('iframe'), shell = d.querySelector('.frame');
        const ratio = Math.min(1,(screen-16)/width);
        assert.equal(frame.width,String(width));
        assert.equal(frame.height,String(height));
        assert.ok(Math.abs(Number(frame.style.transform.slice(6,-1))-ratio) < 0.000001);
        assert.ok(Math.abs(parseFloat(shell.style.height)-height*ratio)<0.01);
        assert.ok(Math.abs(parseFloat(shell.style.width)-width*ratio)<0.01);
        assert.equal(d.querySelectorAll('[aria-pressed=true]').length,1);
        assert.equal(d.querySelector('[aria-pressed=true]').dataset.width,String(width));
        const caption = d.querySelector('output');
        assert.equal(caption.getAttribute('aria-live'),'polite');
        assert.match(caption.textContent,/Khung mô phỏng/);
        assert.ok(caption.textContent.includes(width+' × '+height+' CSS px'));
        assert.ok(caption.textContent.includes(Math.round(ratio*100)+'%'));
        return {cssWidth:width,cssHeight:height,scale:ratio,operator:'simulated DOM width'};
      });
      dom.window.close();
    }
  }
  for (const route of options) {
    const url = new URL(base+'duyet.html');
    url.search=new URLSearchParams({page:route,w:'820'});
    const dom=open(html,url.href,820);
    const {document:d,Event}=dom.window;
    const frame=d.querySelector('iframe'), direct=d.querySelector('.direct');
    observe(profile,'Share and reopen '+route,()=>{
      assert.equal(d.querySelector('select').value,route);
      assert.equal(frame.width,'820');
      assert.equal(frame.src,new URL('.'+route,base).href);
      return {page:route,width:frame.width,frame:frame.src};
    });
    observe(profile,'Internal navigation and width change '+route,()=>{
      const path=new URL('./jobs?status=active#job-listings',base);
      const child=frame.contentWindow;
      child.history.replaceState({},'',path);
      d.querySelector('[data-width="390"]').click();
      assert.equal(frame.contentWindow,child);
      assert.equal(frame.contentWindow.location.href,path.href);
      direct.addEventListener('click',event=>event.preventDefault());
      direct.click();
      assert.equal(direct.href,path.href);
      assert.equal(direct.target,'_blank');
      assert.ok(direct.relList.contains('noopener'));
      // An inaccessible child location follows the grouped review selection fallback.
      const saved=Object.getOwnPropertyDescriptor(frame,'contentWindow');
      Object.defineProperty(frame,'contentWindow',{configurable:true,get(){throw new DOMException('Denied','SecurityError');}});
      direct.click();
      assert.equal(direct.href,new URL('.'+route,base).href);
      if(saved) Object.defineProperty(frame,'contentWindow',saved); else delete frame.contentWindow;
      const select=d.querySelector('select');
      select.value=route==='/contact'?'/jobs':'/contact';
      select.dispatchEvent(new Event('change'));
      assert.equal(frame.src,new URL('.'+select.value,base).href);
      const reopened=open(html,dom.window.location.href,390);
      assert.equal(reopened.window.document.querySelector('select').value,select.value);
      assert.equal(reopened.window.document.querySelector('iframe').width,'390');
      reopened.window.close();
      return {actualOpened:path.pathname+path.search+path.hash,fallback:route,changedTo:select.value,reopened:true};
    });
    dom.window.close();
  }
  for(const value of ['?w=10000&page=https://other.invalid/','?w=391&page=//other.invalid/','?page=/admin-demo']) {
    const dom=open(html,base+'duyet.html'+value,390);
    observe(profile,'Reject unlisted query '+value,()=>{
      const f=dom.window.document.querySelector('iframe');
      assert.equal(f.width,'390'); assert.equal(f.src,base);
      return {fallback:'/',width:f.width};
    });
    dom.window.close();
  }
}
const report={build_sha:sha,artifacts,method:'Packaged Pages and Sites reviewer HTML, jsdom with no network or physical display.',checks};
writeFileSync(join(output,'trace-reviewer.json'),JSON.stringify(report,null,2)+'\n');
const rows=[];
const add=(ids,status,observed,remaining='',owner='Browser QA')=>{
  for(const suffix of ids.split(' '))rows.push({choice_id:'P41-'+suffix,status,target_sha:sha,
    evidence:'SOURCE-BASELINE.md (Sites v1/v3; v3 reviewer blob 95a08bc45cb20f21de50a69382798822ca89ad3d) + trace-reviewer.json · '+observed,actual:observed,remaining,next_owner:owner,
    blocker:status==='Blocked'?remaining:''});
};
add('F1 F2 B3 C1 C3 C4 E2 D1','Completed',
    'Shipped independent HTML, robots, query allowlist, parameter restoration, simulated viewport calculations, live ratio, deep-frame/direct/fallback navigation verified under both mounts.');
add('B1 C2','Blocked','Eight original paths and all five pre-existing shortcuts were identified in each shipped file.',
    'Bản đóng băng nói đúng tám lựa chọn. Sites v3 có thêm năm lối tắt đã bàn giao. Project Owner chọn chuẩn nghiệm thu cho danh mục trước khi thay đổi.', 'Project Owner');
add('E3 B2','Blocked','The 13 v3 entries are preserved; new reviewer features are conditioned on separate approval.',
    'Việc mở rộng nhóm route hoặc thêm mã lựa chọn vào công cụ cần phê duyệt riêng. Có thể ghi mã QA ở báo cáo hiện tại.', 'Project Owner');
add('A1 A2 A3 A4 D2 D3 D4','Incomplete','Three widths and accessible state/output checked for both mounts; original CSS contains toolbar controls, focus and responsive sizing.',
    'Kiểm trực quan khi thu/phóng, tương phản, Tab vào/ra iframe và trình đọc trên trình duyệt có quyền truy cập. D4 cần kiểm thiết bị thật.');
add('B4','Incomplete','The eight named destination options and five extra choices all open valid internal destinations.','Đối chiếu sự nhất quán nhãn với menu qua kiểm tra nội dung trực quan.');
add('E1 E4','Incomplete','Both artifacts open the same URL-selected pages and frame sizes; evidence states fixture scope.',
    'Hoàn thành phiên so sánh trước/sau với người duyệt và lưu kết luận theo trang/viewport.');
add('F3','Incomplete','Direct link fallback works when reading the child location throws.','Giả lập lỗi tải iframe trên trình duyệt được cấp quyền. Việc thêm thông báo lỗi riêng cần quyết định theo dòng chọn.');
add('F4','Completed','SOURCE-BASELINE.md and trace-reviewer.json identify the reviewed source version, the eight original page paths, the five v3 shortcuts and all three CSS sizes.');
assert.equal(rows.length,24); assert.equal(new Set(rows.map(r=>r.choice_id)).size,24);
const keys=Object.keys(rows[0]);
const quote=s=>'"'+String(s).replaceAll('"','""')+'"';
writeFileSync(join(output,'p41.csv'),[keys,...rows.map(row=>keys.map(k=>row[k]))].map(values=>values.map(quote).join(',')).join('\n')+'\n');
console.log('PASS reviewer: '+checks.length+' packaged checks, 24 frozen choices, '+sha);
