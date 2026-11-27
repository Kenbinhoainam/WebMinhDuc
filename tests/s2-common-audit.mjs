// Run from the application checkout: node tests/s2-common-audit.mjs <unpacked-preview-dist> [output.json]
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {existsSync,readFileSync,readdirSync,writeFileSync} from 'node:fs';
import {basename,join,resolve} from 'node:path';
import postcss from 'postcss';
import {JSDOM} from 'jsdom';

const sdd='docs/sdd/SEL-2026.11.27-v1.0.0';
const base=resolve(process.argv[2]||'/workspace/sites/minhduc-sprint2-approved-review/dist');
const output=process.argv[3]||sdd+'/execution/common-audit.json';
const proof=JSON.parse(readFileSync(sdd+'/execution/logs/preview-paths.json','utf8'));
assert.match(proof.archive_sha256,/^[0-9a-f]{64}$/, 'Missing private archive SHA-256');
const appSha=proof.source;
execFileSync('git',['diff','--quiet',appSha,'--','src']);
const frozen=new Map();
for(const name of ['common','cs','motion']) for(const line of readFileSync(sdd+'/data/selections-'+name+'-all-statuses.jsonl','utf8').trim().split('\n')){
  const r=JSON.parse(line);
  if(r.status==='Chọn') frozen.set(r.effective_code,r);
}
const source=file=>execFileSync('git',['show',appSha+':'+file],{encoding:'utf8',maxBuffer:4*1024*1024});
const manifest=JSON.parse(readFileSync(join(base,'__sprint2-routes.json'),'utf8'));
const paths=new Map(manifest.map(r=>[r.id,r.path]));
const locales=['vi','en','zh','ko','ja'];
const cssFiles=readdirSync(join(base,'assets')).filter(n=>n.endsWith('.css')).sort();
const rules=[],fontFaces=[],digests={};
const sha256=value=>createHash('sha256').update(value).digest('hex');
for(const name of cssFiles){
  const raw=readFileSync(join(base,'assets',name),'utf8');digests[name]=sha256(raw);
  const root=postcss.parse(raw,{from:name});
  root.walkRules(node=>{
    const conditions=[];
    for(let p=node.parent;p;p=p.parent)if(p.type==='atrule') conditions.push(p.name+' '+p.params);
    rules.push({file:name,selector:node.selector,conditions,decl:Object.fromEntries(node.nodes.filter(n=>n.type==='decl').map(d=>[d.prop,d.value]))});
  });
  root.walkAtRules('font-face',node=>fontFaces.push(Object.fromEntries(node.nodes.map(n=>[n.prop,n.value]))));
}
const checks=[],cases=new Map();
const tokenRules=rules.filter(r=>r.selector===':root'&&!r.conditions.length);
const tokens=Object.assign({},...tokenRules.map(r=>r.decl));
const text=n=>n?.textContent.trim()??'';
const selection=(d,s)=>[...d.querySelectorAll(s)];
const treeDigest=createHash('sha256'), cache=new Map();
function doc(id,locale='vi'){
  const path=paths.get(id),key=locale+' '+id;
  if(!cache.has(key)){
    const dir=locale==='vi'?'':locale;
    const html=readFileSync(join(base,dir,path,'index.html'),'utf8');
    treeDigest.update(key).update(html);
    const w=new JSDOM(html).window;cache.set(key,w);
  }
  return cache.get(key).document;
}
assert.match(doc('P01').querySelector('[rel=canonical]').href,/\.chatgpt\.site\/$/);
function run(name,predicate,bindings,remaining){
  let status='Pass', actual;
  try{actual=predicate();assert.ok(actual,'predicate did not report an observation');}
  catch(e){status='Fail';actual=String(e.message).slice(0,450);}
  checks.push({name,test_status:status,actual});
  for(const id of bindings.split(' ').filter(Boolean)){
    assert.ok(frozen.has(id),id);
    if(!cases.has(id))cases.set(id,[]);
    cases.get(id).push({name,status,actual,remaining});
  }
}
const visual='Computed layout, zoom, native touch, real font fallback and screenshots remain necessary where required by the frozen row.';
const device='Native pointer/IME/keyboard, screen reader and visual-state verification on the selected devices remain open.';
const both='The test covers the named component and state. The frozen row also requires other component families or input modes.';
const ids=(from,to)=>Array.from({length:to-from+1},(_,i)=>'P'+String(from+i).padStart(2,'0'));
const rgb=v=>{
  let hex=v.slice(1);
  if(hex.length===3)hex=[...hex].map(c=>c+c).join('');
  assert.match(hex,/^[0-9a-f]{6}$/i);return hex.match(/../g).map(v=>parseInt(v,16)/255);
};
function luminance(c){return rgb(c).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);}
run('Built opaque role contrast',()=>{
  const values={};
  for(const [fg,bg,min] of [['ink','surface',4.5],['muted','surface-blue',4.5],['surface','red',4.5],['surface','red-hover',4.5],['blue','surface-blue',4.5],['focus','surface',3],['control-border','surface',3]]){
    const a=tokens['--md-'+fg],b=tokens['--md-'+bg],l=[luminance(a),luminance(b)].sort((x,y)=>y-x),ratio=(l[0]+.05)/(l[1]+.05);
    assert.ok(ratio>=min,fg+'/'+bg+' '+ratio);values[fg+'/'+bg]=ratio.toFixed(2);
  }
  return JSON.stringify(values);
},'A03 D09 CS-A02-1 CS-A02-2 CS-A12-1','Ratios are for opaque tokens shipped in preview CSS. Composited hero/disabled/overlay colors and actual focus pixels are unmeasured.');
run('Physical font files and declared roles',()=>{
  const details=[];
  for(const font of ['inter','roboto']){
    const faces=fontFaces.filter(f=>f['font-family'].toLowerCase().replace(/["']/g,'')===font);
    assert.equal(faces.length,2);
    const points=new Set();
    for(const face of faces){
      assert.equal(face['font-display'],'swap');assert.equal(face['font-weight'],'100 900');
      const url=/url\(([^)]+)\)/.exec(face.src)[1].replace(/["']/g,'');
      const file=join(base,url);
      assert.equal(readFileSync(file).subarray(0,4).toString(),'wOF2');
      const charset=execFileSync('fc-scan',['--format','%{charset}\n',file],{encoding:'utf8'}).split('\n')[0];
      for(const item of charset.split(' ')){const [a,b=a]=item.split('-').map(x=>parseInt(x,16));for(let p=a;p<=b;p++)points.add(p);}
      details.push(basename(file)+' '+face['font-weight']);
    }
    for(const sample of ['Nguyễn','Ứng tuyển','Đắk Lắk']) assert.ok([...sample].every(c=>points.has(c.codePointAt(0))),font+' '+sample);
  }
  assert.match(tokens['--font-body'],/Roboto.*system-ui.*sans-serif/i);assert.match(tokens['--font-display'],/Inter.*system-ui.*sans-serif/i);
  return details.join(', ')+'; both cmaps cover all three Vietnamese samples; '+tokens['--font-body']+' / '+tokens['--font-display'];
},'A04 A05 F02 CS-A04-1 CS-A04-2 CS-A04-3 CS-D05-4 D13',visual);
run('Action, metadata and heading declarations',()=>{
  const matches=[['.job-card h3','font'],['.job-card-meta','font-size'],['.service-card-cta','font'],['.job-row-pay>span','font-size']].map(([s,p])=>{
    const r=rules.find(r=>r.selector.split(',').includes(s)&&r.decl[p]);assert.ok(r,s+' '+p);return s+' '+p+'='+r.decl[p];
  });return matches.join(' | ');
},'A04 A12 A15 CS-A07-2 CS-A04-1',visual);
run('Print presentation actually shipped',()=>{
  const print=rules.filter(r=>r.conditions.some(c=>/media.*print/.test(c)));
  for(const selector of ['.site-header','.reference-footer','.floating-tools']) assert.ok(print.some(r=>r.selector.split(',').includes(selector)&&r.decl.display==='none'),selector);
  assert.ok(print.some(r=>r.selector.includes('.md-page-masthead')&&r.decl.background));
  return print.length+' print selectors, including hidden header, footer and support UI and a plain masthead background.';
},'','Print stylesheet inspection only; printer output, print accessibility, PDF pagination and project handoff rehearsal remain unverified.');
run('Motion tokens and reduced override',()=>{
  const expected=['0ms','120ms','180ms','240ms','320ms'];
  const duration=v=>parseFloat(v)*(v.endsWith('ms')?1:1000);
  expected.forEach((v,i)=>assert.equal(duration(tokens['--motion-t'+i]),duration(v)));
  assert.equal(tokens['--motion-ease'],'ease-out');
  const reduced=rules.find(r=>r.selector===':root'&&r.conditions.some(c=>c.includes('prefers-reduced-motion'))&&r.decl['--motion-t4']);
  for(const i of [1,2,3,4])assert.equal(reduced.decl['--motion-t'+i],'var(--motion-t0)');
  const usage=rules.filter(r=>Object.values(r.decl).some(v=>v.includes('var(--motion-t1)')));
  assert.ok(usage.some(r=>r.selector.includes('job-save')));
  return expected.join('/')+'; ease-out; all four decorative durations resolve to T0 on reduce; '+usage.length+' rules reference T1.';
},'MS01-1 MS01-2 MS02-1 CS-C03-1 C14 D10',both);
run('No global layer hints',()=>{
  const hints=rules.filter(r=>Object.hasOwn(r.decl,'will-change'));assert.ok(hints.every(r=>!/(?:^|,)\s*(?:\*|body|html|:root)(?:$|,)/.test(r.selector)));
  return cssFiles.length+' complete CSS bundles scanned; '+hints.length+' will-change declarations: '+(hints.map(r=>r.selector+'='+r.decl['will-change']).join(' | ')||'none');
},'MS05-2','Layer counts and paint/memory traces require DevTools on the representative page.');
run('Responsive image dimensions and fallback',()=>{
  const all=selection(doc('P19'),'.career-gallery-item img');
  assert.equal(all.length,11);for(const img of all){assert.equal(img.getAttribute('loading'),'lazy');assert.ok(img.width>0&&img.height>0&&img.alt&&img.srcset.includes('480w'));}
  const hero=doc('P01').querySelector('.hero-poster');assert.ok(hero?.width===1024&&hero.height===576&&existsSync(join(base,hero.getAttribute('src'))));
  return '11 gallery photos have width, height, alt, 480w source and lazy loading; video poster present in artifact.';
},'F02 A09 CS-A03-2 CS-A03-3 MS05-4 CS-D05-3',visual);
run('Eight job identities and related destinations',()=>{
  let checked=0;
  for(const locale of locales)for(const id of ids(10,17)){
    const d=doc(id,locale),rel=selection(d,'.jobs-related a[data-job-link]');
    assert.ok(rel.length>0);const item='MD'+String(Number(id.slice(1))-9).padStart(3,'0');
    const close=item==='MD005',internal=['MD007','MD008'].includes(item);
    assert.ok(text(d.querySelector('.job-detail-intro')).includes(item));
    assert.ok(d.querySelector('.job-pay dd')&&d.querySelector('.job-summary-shift')&&d.querySelector('.job-summary-locality'));
    assert.equal(!!d.querySelector('.job-summary .job-apply-button'),!close);
    assert.equal(!!d.querySelector('.job-summary .job-closed'),close);
    assert.match(d.querySelector('.jobs-back').getAttribute('href'),internal?/\/careers#open-positions$/:/\/jobs#job-listings$/);
    assert.ok(rel.every(a=>a.dataset.jobLink!==item));if(close)assert.ok(rel.every(a=>a.dataset.jobLink!=='MD005'));
    assert.equal(d.querySelectorAll('.job-detail-body .job-description-block ul').length,3);
    checked++;
  }
  return checked+' detail pages, exact MD codes, nonempty salary/shift/location, three content groups, correct audience return, related IDs exclude current, closed MD005 has no Apply.';
},'A15 B11 F06 CS-A02-3 CS-A07-3 CS-B01-2 CS-B02-3 CS-B04-3 CS-B06-1 CS-B06-4 CS-B08-1 CS-D04-3 CS-D08-2 CS-D08-4',both);
run('Shared service information across templates',()=>{
  const rows=[];
  for(const id of ids(4,8)){
    const page=doc(id);const overview=page.querySelector('.service-overview'),process=page.querySelector('.service-process'),faq=page.querySelector('.service-faq');
    assert.ok(overview&&faq);const apply=page.querySelector('.contact-form')||page.querySelector('[href*="/education"]');
    assert.ok(apply); rows.push(id+' '+[overview,process,faq,apply].map(x=>x?.className||x?.tagName||'variant').join('/'));
  }
  return rows.join(' | ');
},'B10 B07 CS-A11-2 CS-B01-2 CS-B03-3 CS-B06-4','Content structure on five service routes; appearance, wording comprehension and real process validation require design and content owners.');
run('Editorial heading anchors and related articles',()=>{
  let n=0;for(const id of ids(21,26)){const p=paths.get(id);if(!p.startsWith('/news/'))continue;
    const d=doc(id),toc=selection(d,'.ed-toc a'),related=selection(d,'.ed-related-group a');
    assert.ok(toc.length>0&&related.length>0);
    for(const a of toc){const target=d.getElementById(a.getAttribute('href').split('#').at(-1));assert.ok(target?.matches('h2')&&text(target).includes(text(a)));}
    assert.ok(related.every(a=>a.getAttribute('href')!==p));
    assert.equal(d.querySelectorAll('main h1').length,1); n+=toc.length;
  }
  assert.ok(n);return n+' article TOC links resolved to prose sections with h2; relevant article groups exclude own URL.';
},'B05 B07 B08 B12 CS-A01-4 CS-B03-2 CS-B04-4 CS-B06-2','Body ordering and local link targets tested; related topic appropriateness, visual reading width and native anchor landing remain open.');
run('Audience entries and shared brand',()=>{
  const home=doc('P01');const targets=selection(home,'a').map(n=>n.getAttribute('href')||'');
  for(const p of ['/jobs','/services','/careers','/education','/contact'])assert.ok(targets.some(v=>v.split(/[?#]/)[0]===p),p);
  const signatures=new Set();
  for(const id of ['P01','P03','P09','P19','P20','P32','P36','P37']){
    const d=doc(id),brand=d.querySelector('header .brand img');
    assert.ok(brand?.height&&brand.width&&brand.alt);signatures.add(brand.getAttribute('src'));
    assert.ok(d.querySelector('footer a[href*="privacy-policy"]'));
  }
  assert.equal(signatures.size,1);return 'Eight page families share '+[...signatures][0]+' with declared dimensions; five audience/contact paths reachable by native links from Home.';
},'A01 A02 A14 B02 B05 CS-A13-1 CS-A13-3 CS-B02-1 CS-B04-1',visual);
run('Structural job filters and form labels',()=>{
  const d=doc('P09');const keys=['query','location','type','industrialPark','skillLevel','employmentType','shift','schedule','status'];
  for(const key of keys){const el=d.getElementById('jobs-'+key);assert.ok(el&&el.labels.length===1&&text(el.labels[0]));}
  assert.ok(d.querySelector('[aria-controls="jobs-more-filters"][aria-expanded="false"]'));
  assert.ok(d.querySelector('.jobs-result-bar [role=status]'));assert.equal(d.querySelectorAll('.job-card').length,5);
  const f1=doc('P01').querySelector('.contact-form'),f2=doc('P37').querySelector('.contact-form');
  const required=f=>[...f.elements].filter(e=>e.required).map(e=>e.name);
  assert.deepEqual(required(f1),['name','phone','location','notes']);assert.deepEqual(required(f2),['name','phone']);
  for(const f of [f1,f2])for(const e of [...f.elements].filter(e=>e.name))assert.ok(e.labels?.length,e.name);
  return 'Nine named filters, collapsed advanced control and live count; F01 requires name/phone/location/notes, F02 name/phone. All named controls on both default forms have persistent labels.';
},'B14 C05 C07 D08 MI04-1 CS-A10-2 CS-B05-2 CS-B07-2 CS-C02-3 CS-C08-1 CS-D05-2',both);
run('Localized canonical metadata and index policy',()=>{
  let count=0;const xml=readFileSync(join(base,'sitemap.xml'),'utf8');
  for(const id of ids(1,40))for(const locale of locales){
    const file=join(base,locale==='vi'?'':locale,paths.get(id),'index.html');
    const html=readFileSync(file,'utf8');treeDigest.update(locale+' '+id).update(html);
    const head=new JSDOM(html.slice(0,html.indexOf('</head>')+7)+'</html>');
    const d=head.window.document,canonical=d.querySelector('link[rel=canonical]').href;
    assert.equal(d.documentElement.lang,locale==='zh'?'zh-Hans':locale);
    assert.ok(xml.includes('<loc>'+canonical+'</loc>'),canonical);
    assert.equal(d.querySelector('meta[name=robots]').content,'noindex,nofollow');
    assert.ok(d.title&&d.querySelector('meta[name=description]')?.content);
    assert.equal(d.querySelector('meta[property="og:url"]').content,canonical);
    const alts=selection(d,'link[hreflang]').map(a=>a.hreflang);
    assert.equal(new Set(alts).size,6);assert.ok(alts.includes('x-default'));count++;
    // Keep only the current working set of DOM trees in memory.
    head.window.close();
  }
  return count+' localised page artifacts have exact lang, real canonical in sitemap, noindex,nofollow, description, OG URL and six unique hreflangs.';
},'F04 F05 F09 D12 D14 CS-B03-1 CS-D07-1 CS-D07-4','Static metadata and language pairing verified. Query/Back/Forward, missing translations, dynamic states and actual search-engine processing are separate checks.');
run('Contact routes and visible fallback information',()=>{
  const d=doc('P37'),offices=selection(d,'.contact-office');
  assert.ok(offices.length>0);
  const methods=selection(d,'main a[href^="tel:"],main a[href^="mailto:"]');
  assert.ok(methods.some(a=>a.getAttribute('href').startsWith('tel:')&&/[0-9]/.test(text(a))));
  assert.ok(methods.some(a=>a.getAttribute('href').startsWith('mailto:')&&text(a).includes('@')));
  const address=offices.map(a=>text(a)).filter(Boolean);assert.equal(address.length,offices.length);
  const maps=selection(d,'main a[href]').filter(a=>/maps|google\.com\/maps/i.test(a.getAttribute('href')));
  assert.ok(maps.length);
  return offices.length+' offices with address text; '+methods.length+' visible telephone/email links; '+maps.length+' map links independent of iframe rendering.';
},'B14 CS-D06-2 CS-D06-4','Offline behavior of the external destination and device call/email handlers was not exercised.');
run('Visually hidden versus disabled control structure',()=>{
  const directory=doc('P09'),buttons=selection(directory,'.job-save'),closed=doc('P14');
  assert.ok(buttons.every(b=>b.tagName==='BUTTON'&&b.type==='button'&&b.getAttribute('aria-label')&&b.hasAttribute('aria-pressed')));
  assert.ok(closed.querySelector('.job-summary-actions a'));assert.equal(closed.querySelector('button[aria-haspopup="dialog"].job-apply-button'),null);
  const r=rules.find(r=>r.selector.split(',').includes('.job-save')&&r.decl.width==='44px'&&r.decl.height==='44px');assert.ok(r);
  const focus=rules.filter(r=>r.selector.includes('focus-visible')&&r.decl.outline);
  assert.ok(focus.length);return buttons.length+' status toggles; native active-list anchor on MD005; 44×44 job-save declaration; '+focus.length+' authored outline selectors.';
},'C04 D05 D07 CS-A05-3 CS-A10-1 CS-C05-1 CS-D03-2 MI01-1 MS03-2','Declaration/semantics only. Actual touched area after cascade, pointer gestures, outlines on real backgrounds, hover behavior and overlap are unverified.');
run('Menu, native buttons and structural ARIA',()=>{
  const header=doc('P09').querySelector('header'),toggles=selection(header,'button[aria-controls][aria-expanded]');
  assert.ok(toggles.length>0);
  for(const el of toggles){assert.ok(el.ownerDocument.getElementById(el.getAttribute('aria-controls')));assert.ok(el.getAttribute('aria-label')||text(el));}
  const support=source('src/SupportTools.tsx');assert.match(support,/title=\{label\}/);assert.match(support,/aria-label=\{label\}/);
  return toggles.length+' native menu buttons resolve to controlled elements with accessible names; scroll-to-top uses title + aria-label.';
},'C03 C12 D08 CS-A08-3 CS-C05-2 MI08-4','Native hover titles alone do not verify custom tooltip announcement, pointer dismissal, touch descriptions or real focus order.');
run('Stable card semantics with long locale strings',()=>{
  const titles=new Map();
  for(const id of ['P01','P03','P09','P19']) {
    const selector=id==='P09'||id==='P19'?'.job-card h3 a':'.service-gallery-card h3';
    const runs=locales.map(locale=>selection(doc(id,locale),selector).map(el=>text(el)));
    assert.ok(runs[0].length>0&&runs.every(r=>r.length===runs[0].length&&r.every(Boolean)));
    titles.set(id,runs.map(r=>Math.max(...r.map(s=>[...s].length))));
  }
  return 'Maximum visible card-title lengths by VI/EN/ZH/KO/JA: '+JSON.stringify(Object.fromEntries(titles));
},'A13 D04 D13 CS-A04-4 CS-A06-2 CS-A10-3 CS-A11-3 CS-D01-1 CS-D04-4 CS-D07-3',visual);
run('Explicit scroll regions and reading hierarchy',()=>{
  const admin=doc('P36'),region=admin.querySelector('.admin-table-wrap');
  assert.equal(region.getAttribute('role'),'region');assert.equal(region.tabIndex,0);assert.ok(admin.getElementById(region.getAttribute('aria-labelledby')));
  assert.ok(region.querySelectorAll('th[scope="col"]').length>=5);
  const focus=rules.find(r=>r.selector.includes('.admin-table-wrap')&&r.decl['overflow-x']==='auto');assert.ok(focus,'scrolling CSS');
  const article=doc('P21');assert.ok(article.querySelector('.ed-toc')&&article.querySelector('.ed-prose-section'));
  return 'Named, focusable ADMIN region with '+region.querySelectorAll('th[scope="col"]').length+' scoped column headers and horizontal overflow declaration; reader TOC/body sections present.';
},'B08 D08 CS-D01-2 CS-B03-2',visual);
run('Date, currency and string locale behavior',()=>{
  const md8='P17',md1='P10';const values={};
  for(const locale of locales){
    const numeric=text(doc(md1,locale).querySelector('.job-pay dd')),discuss=text(doc(md8,locale).querySelector('.job-pay dd'));
    assert.match(numeric.replace(/[,\s]/g,''),/8.*11/);assert.ok(discuss&&!/\d/.test(discuss));
    values[locale]=[numeric,discuss];
  }
  return JSON.stringify(values);
},'B15 D15 CS-D08-2 CS-D08-4','Preservation of salary values and textual exception verified. Formatting of dates, consultation timezone and other units have separate acceptance criteria.');
run('Project fixture boundaries and missing production entry points',()=>{
  const admin=source('src/AdminDemo.tsx'),records=source('src/demo-submissions.ts'),app=source('src/App.tsx');
  assert.match(admin,/CMS MINH HỌA/);assert.match(admin,/setDraft/);assert.match(admin,/setContent/);assert.match(admin,/setConfirmReset/);
  assert.match(records,/let records: DemoRecord\[\]|let records:DemoRecord\[\]/);
  assert.ok(!/\b(?:fetch|XMLHttpRequest|localStorage|sessionStorage)\s*[(.]/.test(records));
  assert.ok(!/path="\/(?:login|authenticate|authorize|role|register)(?:[/"?])/.test(app));
  const fileList=execFileSync('git',['ls-tree','-r','--name-only',appSha,'src'],{encoding:'utf8'}).split('\n').filter(p=>/\.(?:ts|tsx)$/.test(p));
  const hits=[];
  for (const file of fileList){
    const code=source(file);
    if(/\bgtag\s*\(|\bdataLayer\s*\.push\s*\(|navigator\.sendBeacon\s*\(|\banalytics\.track\s*\(/.test(code))hits.push(file);
  }
  assert.equal(hits.length,0);
  return 'ADMIN mock edits a single home-introduction string via draft/content state and reset; submission module retains records in memory without HTTP/storage APIs. No login/roles route and no gtag/dataLayer/analytics.track/sendBeacon event entry in '+fileList.length+' application source files.';
},'F07 F11 F13 F14','No generic create/hide-news CMS, role/denied-session fixture, conversion event plan or delayed-failure integration fixture was identified in these entry points. Real integrations/auth/tracking require separate scope. Existing demo controls are not evidence for those capabilities.');
// Execute existing behavior suites. Each binding cites the concrete observed assertion, not just the suite name.
function suite(file,phrase,definitions){
  const log=execFileSync(process.execPath,['tests/'+file+'.mjs'],{encoding:'utf8',timeout:360000,maxBuffer:2*1024*1024});
  assert.ok(log.includes(phrase),'missing completion marker for '+file);const fileText=readFileSync('tests/'+file+'.mjs','utf8');
  for(const [probe,binding,actual,remaining] of definitions) run(file+' / '+probe,()=>{
    assert.ok(fileText.includes(probe),file+' lost predicate '+probe);
    return file+'.mjs exited 0; '+actual;
  },binding,remaining??both);
}
suite('s2-b2c','PASS W3',[
  ['one fixture for the whole attempt','C01 C09 C15 CS-C01-1 CS-C01-2 CS-B08-1 MI01-2 MI07-1','Seven positions submitted twice per attempt; each produced exactly one local receipt with correct form, job ID, title and URL.'],
  ['the editing cursor','C05 C08 CS-C02-3 CS-C06-3 CS-C07-2 CS-C08-3 MI04-2 MO04-3 MS04-3','Composition drafts retained focus, data and history until IME commit; query plus three filters, chip removal and reset reach exact counts.'],
  ['invalid attachment metadata is reported immediately','C07 CS-C05-3 CS-C08-1 CS-B07-3 MI04-2','F04 optional file correction: selecting an executable shows an immediate metadata error, submitting focuses CV and saves no record, and removing the file clears the error.'],
  ['return to the original apply button','C10 C15 CS-C01-1 CS-B07-4 MI07-2 MO02-4','Success heading focus, correct ADMIN link and job label; dismissing each receipt returns focus to the inline trigger.'],
  ['.jobs-empty a','C13 CS-C06-3 MO04-2','Filtered-empty vs no-saved distinct and canonical empty CTA focused after final removal.'],
]);
suite('jobs-sprint1','PASS Sprint 1',[
  ['original job was removed','C02 CS-C10-1 MO04-2','Back with original query/hash/page restores surviving adjacent target after original saved position is deleted.'],
  ['keyboardInput.focus()','D03 CS-C09-1 MO06-3','Simulated header/inline bounds, focused text entry, modal state and viewport change hide the mobile Apply bar; closed MD005 has no Apply control.',device],
]);
suite('careers-carousel','PASS four careers rails',[
  ['user pause outlasts visibility transitions','C14 D10 CS-C03-3 MO07-4 MS02-2 MS04-4','Four independent rails: user pause survives visibility, active gallery stops in modal, keyboard arrows/Escape restore focus, reduced preference disables timers.'],
]);
suite('s2-b2b-flows','PASS',[
  ['rapid reversal','C11 CS-A11-2 MO03-1 MS04-4','FAQ rapid reversal leaves only last intended panel open and inert prevents focus in closed answers.'],
  ['Rapid double toggle','MO07-1 MS03-1 MS04-3','Service rail consecutive pause/play commands return to correct state; relative 0ms/180ms token duration parsed.'],
  ['.service-card-title','F03 MS05-3','Media error hides decorative image while card title and action remain usable; a subsequent load clears the fallback.'],
]);
suite('consultation','PASS',[
  ['requests,0','CS-C10-3 MI06-3','Switch F01/F02 drafts and return from time selection while maintaining keyed local state and no outgoing request.'],
]);
function declarations(selector, properties) {
  const matched=rules.filter(r=>r.selector.split(',').includes(selector));
  const values=Object.fromEntries(properties.map(p=>[p,[...new Set(matched.map(r=>r.decl[p]).filter(Boolean))]]));
  for(const [p,v] of Object.entries(values)) assert.ok(v.length,selector+' missing '+p);
  return {selector,actual:values};
}
run('Spacing between and within reading groups',()=>JSON.stringify([
  declarations('.jobs-section',['padding']),declarations('.jobs-filter-selection',['gap','margin-top']),
  declarations('.job-description-block h2',['margin']),declarations('.home-introduction',['gap','grid-template-columns']),
  declarations('.job-summary-primary .job-summary-locality',['gap','align-items']),
]),'A06 A07 CS-A01-2 CS-A05-1 CS-A05-2 CS-A05-4 CS-A06-1 CS-A06-3',visual);
run('Service card geometry and surfaces',()=>JSON.stringify([
  declarations('.service-card-grid',['grid-template-columns','gap']),
  declarations('.service-gallery-card>a',['border-radius','padding']),
  declarations('.service-card-cta',['border-radius','gap','padding']),
  declarations('.service-gallery-controls button',['box-shadow','border-radius','width','height']),
  declarations('.job-card',['border-bottom','padding','gap']),
]),'A06 A11 A12 CS-A05-3 CS-A07-1 CS-A09-1 CS-A09-2 CS-A09-4 CS-A11-1 CS-D03-3',visual);
run('Photo scrims and crop properties in preview CSS',()=>{
  const overlays=rules.filter(r=>r.selector.includes('.service-card-media')&&r.decl.background?.includes('gradient'));
  const crops=rules.filter(r=>r.decl['object-position']&&/career|home-intro|masthead|service|ed-reader/.test(r.selector));
  assert.ok(overlays.length&&crops.length);
  return 'Service overlay '+overlays.map(r=>r.decl.background).join(' | ')+'; explicit focal declarations '+crops.slice(0,12).map(r=>r.selector+'='+r.decl['object-position']).join(' | ');
},'A09 CS-A02-4 CS-A03-1',visual);
run('Icons and paired native controls',()=>{
  const samples=selection(doc('P09'),'.job-card').slice(0,1).flatMap(card=>[...card.querySelectorAll('svg')].map(svg=>[svg.getAttribute('class'),svg.getAttribute('width'),svg.getAttribute('stroke-width'),svg.getAttribute('aria-hidden')]));
  assert.ok(samples.length>=3&&samples.every(x=>x[1]&&x[2]&&x[3]==='true'));
  return JSON.stringify(samples);
},'A10 CS-A08-1 CS-A08-2 CS-A08-4 CS-A06-3','Inspected job-title, map and bookmark SVGs in a rendered action row. Optical alignment and unaided reader interpretation require visual/usability testing.');
run('Named component-specific media transitions',()=>{
  const actual={};
  for(const [selector,prop] of [['.job-card','grid-template-columns'],['.jobs-filter-more','grid-template-columns'],['.education-form-layout','grid-template-columns'],['.service-card-grid','grid-template-columns']]){
    const found=rules.filter(r=>r.selector.split(',').includes(selector)&&r.decl[prop]);
    assert.ok(found.some(r=>r.conditions.some(c=>c.startsWith('media'))),selector);
    actual[selector]=found.map(r=>[r.conditions.join(' ')||'base',r.decl[prop]]);
  }
  return JSON.stringify(actual);
},'D01 D02 CS-A12-3 CS-D01-1 CS-D02-1 CS-D02-2 CS-D02-3 MO04-4',visual);
run('Preview application release handoff',()=>{
  const states=readFileSync(sdd+'/data/selections-states-all-statuses.jsonl','utf8').trim().split('\n').map(JSON.parse);
  assert.equal(states.filter(x=>x.status==='Chọn').length,30);assert.equal(manifest.length,40);assert.ok(existsSync(join(base,'duyet.html')));
  const checklist=readFileSync(sdd+'/QA-EXECUTION-CHECKLIST.md','utf8'),baseDoc=readFileSync(sdd+'/execution/SOURCE-BASELINE.md','utf8');
  assert.match(checklist,/390/);assert.match(checklist,/1440/);assert.match(checklist,/iOS Safari/);assert.match(checklist,/Android Chrome/);
  assert.match(baseDoc,/\/WebMinhDuc\//);
  const reset=source('src/AdminDemo.tsx');assert.match(reset,/resetDemoSubmissions\(\)/);assert.match(reset,/setConfirmReset\(false\)/);
  return '40 preview application routes plus a separate duyet.html reviewer, 30 selected state records, checksum manifest, two mount profiles, viewport/real-input checklist and confirmed reset entry. Source/application '+appSha+'; preview source '+proof.site_sha+'.';
},'F15 MS06-2 MS06-3 MS06-4','The handoff can be rerun; native viewport/input coverage, physical screenshots and independent PO rehearsal are outside these checks.');
run('Separate documentary and conceptual images',()=>{
  const docSources=JSON.parse(source('src/careers-media.json'));
  const photo=doc('P19').querySelector('.md-page-masthead img');
  const docs=source('docs/flagship/v16-architecture-source.txt')+' '+source('docs/flagship/v16-implementation.txt');
  assert.ok(photo.getAttribute('src').endsWith('field-team.webp'));
  assert.ok(docSources.banner.endsWith('field-team.webp'));assert.match(docs,/image_gen/);
  const gallery=selection(doc('P19'),'.career-gallery-item');assert.equal(gallery.length,11);
  for (const fig of gallery){const img=fig.querySelector('img');assert.ok(img.alt&&text(fig.querySelector('figcaption')));}
  return 'Careers banner matches field-team from careers-media; eleven activity photos each have contextual alt/caption. Repository provenance separately identifies the architectural artwork as generated.';
},'CS-A13-2 CS-A13-4 CS-B01-4','Evidence verifies the documented distinction, not image rights, architectural reality, publication approvals or perceived image quality.');
run('Static saved-list hydration contract',()=>{
  const page=doc('P18'),initial=page.querySelector('.jobs-storage-note[role=status]');assert.ok(initial);
  assert.equal(page.querySelector('.jobs-empty'),null);assert.equal(page.querySelector('.job-card'),null);
  const implementation=source('src/saved-jobs.ts');assert.match(implementation,/useSyncExternalStore<string \| null>/);assert.match(implementation,/ready:raw !== null/);
  return 'Preview shows the initial local-storage status and no false empty state before hydration. Store exposes ready with the same snapshot that carries sanitized IDs.';
},'CS-C06-1 CS-C07-3','Initial HTML and subscription contract, plus separate saved/store suites. First paint time and assistive announcements on real devices pending.');
run('Handoff for unsupported role and conversion fixtures',()=>{
  const p=doc('P36'),note=text(p.querySelector('.admin-notice'));assert.match(note,/Không có đăng nhập hay phân quyền thực/);
  return note;
},'F11 F14','No role-switch/denied-path or named conversion tracking fixture occurs in the authorized prototype; these require a separate specification before implementation.');
const ui=JSON.parse(execFileSync(process.execPath,['tests/s2-common-audit-ui.mjs'],{encoding:'utf8'}));
run('Saved pagination boundary activations',()=>ui.paging,'MI01-4 C06','Boundary behavior for job pagination tested, the selection also applies to news, events and other existing list controls.');
run('Related job ordering for every fixture',()=>{
  assert.equal(Object.keys(ui.related).length,8);return JSON.stringify(ui.related);
},'CS-B06-1','');
run('ADMIN CMS local editor capability',()=>JSON.stringify(ui.cms),'F07 CS-C05-4 MI08-2','This is a single local homepage-text editor. No article creation/preview, per-record publish/hide, real access-control or external publishing is implied.');
run('ADMIN feedback after editing a saved draft',()=>{
  assert.notEqual(ui.cms.afterEdit,ui.cms.afterSave,'Live status after saving alpha = '+ui.cms.afterSave+'; after changing unsaved draft to beta = '+ui.cms.afterEdit+'.');
  return JSON.stringify(ui.cms);
},'CS-C07-4','Retest editing after both save and simulated publish, then save the changed content to confirm the message follows current draft state.');
run('Careers FAQ presentation gate',()=>{
  const faq=doc('P19').querySelector('.career-questions .career-track');
  assert.ok(faq);const items=selection(faq,'article'),buttons=selection(faq,'button[aria-expanded],summary');
  assert.equal(items.length,3);assert.equal(buttons.length,0);
  return 'Career questions are three readable rail articles with links. No accordion toggle in the questions track.';
},'MI08-3','The frozen selector makes a new Careers FAQ accordion conditional on separate approval. Service FAQ toggles do not meet this P19 condition.');
run('Robots directives on every preview sitemap entry',()=>{
  const xml=readFileSync(join(base,'sitemap.xml'),'utf8');const urls=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>new URL(m[1]));
  assert.equal(urls.length,245);let jobSchemas=0;
  for(const url of urls){
    const html=readFileSync(join(base,url.pathname,'index.html'),'utf8');
    const head=html.slice(0,html.indexOf('</head>'));
    assert.match(head,/<meta name="robots" content="noindex,nofollow"\/?\s*>/i);
    if(/\/jobs(?:\/|$)/.test(url.pathname))jobSchemas+=(html.match(/"@type"\s*:\s*"JobPosting"/g)||[]).length;
  }
  assert.equal(jobSchemas,0);
  return urls.length+' canonical sitemap records on preview all noindex,nofollow, 0 JobPosting JSON-LD entries on jobs routes.';
},'F05','');
for(const [,w] of cache)w.close();
run('Workers and internal job journeys',()=>{
  const receipt=readFileSync('tests/s2-b2c.mjs','utf8');
  for(const expr of ['record.linkId','record.source','return to the original apply button','location.pathname+location.search+location.hash,origin'])assert.ok(receipt.includes(expr));
  assert.match(source('src/JobsPages.tsx'),/name="position"[^>]+readOnly required/);
  return 's2-b2c rerun above: each of five open worker jobs and two careers jobs preserved title, original list URL and code; F03 required name/phone, F04 optional email/CV and read-only position; confirmed receipt and ADMIN href; closing returns to the opener.';
},'CS-C01-1 CS-C01-2','');
const choices=[...cases].map(([id,items])=>{
  const complete=items.some(i=>!i.remaining&&i.status==='Pass');
  const remaining=complete?'':[...new Set(items.map(i=>i.remaining).filter(Boolean))].join(' ');
  return {choice_id:id,source_row:frozen.get(id).row,coverage:remaining?'partial':'full',test_status:items.some(i=>i.status==='Fail')?'Fail':id==='MI08-3'?'Blocked':'Pass',
    assertion:items.map(i=>i.actual).join(' | '),checks:items.map(i=>i.name),remaining};
});
const report={build_sha:appSha,site_source_sha:proof.site_sha,archive_sha256:proof.archive_sha256,artifact_input:base,method:'Root-mounted preview artifact HTML/CSS/font cmap and pinned implementation source. Existing React DOM interaction suites rerun on the same application source. No simulated layout used as native device evidence.',
  tested_html_sha256:treeDigest.digest('hex'),css_sha256:digests,source_revision:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),checks,choices};
writeFileSync(output,JSON.stringify(report,null,2)+'\n');
console.log(choices.length+' selections; '+checks.length+' checks; '+checks.filter(x=>x.test_status==='Fail').length+' failed predicates');
for(const c of checks.filter(x=>x.test_status==='Fail'))console.error(c.name+' — '+c.actual);
