import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {mkdir, mkdtemp, readFile, readdir, rm, stat, writeFile} from 'node:fs/promises';
import {join, resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {runResponsive} from './s2-qa-responsive.mjs';
import {runFlows} from './s2-qa-flows.mjs';

const snapshot='docs/sdd/SEL-2026.11.27-v1.0.0';
const baseline=process.argv.includes('--baseline');
const output=baseline?'.':'dist';
const reportDir=snapshot+'/execution/qa'+(baseline?'/baseline':'');
const legacy='https://kenbinhoainam.github.io/WebMinhDuc';
const mount=new URL((!baseline && process.env.MINHDUC_PREVIEW_ORIGIN) || legacy);
const host=mount.origin;
const base=mount.pathname.replace(/\/$/,'');
const locales=['vi','en','zh','ko','ja'];
const pathFor=(route,loc)=>base+(loc==='vi'?'':'/'+loc)+(route==='/'&&loc!=='vi'?'':route);
const rows=new Map();
for(const filename of await readdir(snapshot+'/data')){
  if(!filename.startsWith('selections-'))continue;
  for(const line of (await readFile(snapshot+'/data/'+filename,'utf8')).trim().split('\n')){
    const row=JSON.parse(line);if(row.status==='Chọn')rows.set(row.effective_code,row);
  }
}
const pages=(await readFile(snapshot+'/data/pages-and-urls.jsonl','utf8')).trim().split('\n').map(JSON.parse);
const evidence=[],routes=[],failures=[];
const head=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const timestamp=new Date().toISOString();
const digest=createHash('sha256');
async function check(key,ids,scope,locale,expected,verify,remaining=''){
  for(const id of ids)assert.ok(rows.has(id),'Unselected assertion '+id);
  try{
    const observed=await verify();
    evidence.push({key,ids,scope,locale,expected,actual:observed,test_status:'Pass',remaining});
  }catch(error){
    failures.push(key);
    evidence.push({key,ids,scope,locale,expected,actual:String(error.message).slice(0,900),test_status:'Fail',remaining});
  }
}
function values(doc,selector){return [...doc.querySelectorAll(selector)].map(el=>el.textContent.trim());}
const temp=await mkdtemp('.s2-qa-');
try{
 const bundle=join(temp,'oracle.mjs');
 await build({stdin:{contents:`export {jobs} from './src/jobs-data';export {localizedSeo} from './src/seo/metadata';export {loadLocale,translate} from './src/i18n-runtime/catalog';export {formatEditorialDate} from './src/EditorialDate';`,sourcefile:'s2-oracle.ts',resolveDir:process.cwd()},outfile:bundle,bundle:true,platform:'node',format:'esm',packages:'external',loader:{'.css':'empty'},logLevel:'silent'});
 const data=await import(pathToFileURL(resolve(bundle)));await Promise.all(locales.map(data.loadLocale));
 for(const p of pages.filter(x=>x.source_code!=='P41')){
   const id=p.source_code,route=p.fields['Đường dẫn'];
   for(const locale of locales){
     const webPath=pathFor(route,locale);const file=join(output,webPath.slice(base.length),'index.html');
     const html=await readFile(file,'utf8');digest.update(file.slice(output.length)+'\0'+html);
     const dom=new JSDOM(html,{url:host+webPath}),doc=dom.window.document;
     const expectedSeo=data.localizedSeo(route,locale);
     const fields={h1:values(doc,'main h1'),lang:doc.documentElement.lang,robots:doc.querySelector('meta[name=robots]')?.content,canonical:doc.querySelector('link[rel=canonical]')?.href,title:doc.title,description:doc.querySelector('meta[name=description]')?.content};
     routes.push({id,route,locale,...fields});
     const metadataIds=['P04','P05','P06',...Array.from({length:8},(_,i)=>'P'+(10+i)),...Array.from({length:6},(_,i)=>'P'+(21+i)),'P33','P34','P35','P39','P40'].includes(id)?[id+'-F1']:['P28','P29','P30'].includes(id)?[id+'-F3']:[];
     await check(id+'.metadata',metadataIds,'generated HTML',locale,'Exactly one nonempty H1, localized lang/title/description/canonical, OG URL, noindex and all six alternate URLs',()=>{
       assert.equal(fields.h1.length,1);assert.ok(fields.h1[0]);assert.equal(fields.lang,locale==='zh'?'zh-Hans':locale);
       assert.equal(fields.robots,'noindex,nofollow');assert.equal(fields.title,expectedSeo.title);assert.equal(fields.description,expectedSeo.description);
       assert.equal(fields.canonical,host+webPath);assert.equal(doc.querySelector('meta[property="og:url"]').content,fields.canonical);
       assert.deepEqual([...doc.querySelectorAll('link[rel=alternate]')].map(a=>[a.hreflang,a.href]),expectedSeo.alternates.map(a=>[a.hrefLang,a.href.replace(legacy,host+base)]));
       return fields;
     },'Static HTML and metadata only. User navigation, layout and additional row-specific behavior are outside this assertion.');
     if(id==='P02')for(const [anchor,state] of [['profile','T01'],['history','T02'],['partners','T03'],['achievements','T04'],['activities','T05']]){
       await check('about.'+anchor,[state,'P02-F1'],'generated HTML',locale,'About anchor occurs once; a link addresses the target',()=>{
         assert.equal(doc.querySelectorAll('#'+anchor).length,1);const link=[...doc.querySelectorAll('a[href]')].find(a=>a.pathname.replace(/\/$/,'')===webPath&&a.hash==='#'+anchor);assert.ok(link);return {href:link.href,target:anchor};
       },'Anchor presence and destination only; scrolling/focus require interaction.');
     }
     if(['P28','P29','P30'].includes(id)){
       const idx=Number(id.slice(1))-28;
       const [date,hours,times,place,status]=[
         ['2026-11-28','08:30 – 11:30',['08:30','09:00','10:00','11:00'],'Địa điểm sẽ được xác nhận','Sắp diễn ra'],
         ['2026-12-05','14:00 – 15:30',['14:00','14:15','14:45','15:15'],'Hình thức trực tuyến','Sắp diễn ra'],
         ['2026-11-08','09:00 – 10:30',['09:00','09:30','10:00'],'Địa điểm sẽ được xác nhận','Đã diễn ra']][idx];
       const tr=x=>String(data.translate(x,locale));
       await check(id+'.agenda',[id+'-F1',id+'-D3'],'generated HTML',locale,'Frozen event date, time range, locale date and all UTC+7 agenda times match',()=>{
         const time=doc.querySelector('.ed-facts time');assert.equal(time.dateTime,date);assert.equal(time.textContent,data.formatEditorialDate(date,locale));assert.ok(time.parentElement.textContent.includes(hours+' UTC+7'));
         const actual=[...doc.querySelectorAll('.ed-agenda time')].map(el=>[el.textContent,el.dateTime]);assert.deepEqual(actual,times.map(t=>[t,date+'T'+t+':00+07:00']));return {date:time.textContent,hours,actual};
       });
       await check(id+'.anchors',[id+'-B2',id+'-C1'],'generated HTML',locale,'Five ordered event sections and schedule CTA have existing focusable targets',()=>{
         const ids=[...doc.querySelectorAll('.ed-anchor-nav a')].map(a=>a.hash.slice(1));assert.deepEqual(ids,['overview','schedule','location','gallery','other-events']);for(const x of ids)assert.equal(doc.getElementById(x).tabIndex,-1);assert.ok(doc.querySelector('a.btn[href="#schedule"]'));return ids;
       },'Targets and order observed. No browser scroll or focus obscuration measurement.');
       await check(id+'.place',[id+'-B3'],'generated HTML',locale,'Frozen location confirmed in event facts and location section',()=>{
         assert.equal(doc.querySelectorAll('.ed-facts dd')[1].textContent,tr(place));assert.equal(doc.querySelector('.ed-location p').textContent,tr(place));return tr(place);
       });
       await check(id+'.gallery',[id+'-B4',id+'-D4'],'generated HTML',locale,'Two figures have alt and captions; provenance text states photographs came from other events',()=>{
         assert.equal(doc.querySelector('.ed-gallery > p').textContent,tr('Ảnh do Minh Đức cung cấp từ các hoạt động khác.'));const figures=[...doc.querySelectorAll('.ed-gallery figure')].map(f=>[f.querySelector('img').alt,f.querySelector('figcaption').textContent]);assert.equal(figures.length,2);assert.ok(figures.flat().every(Boolean));return figures;
       },'Image and text semantics recorded. Keyboard and reduced-motion acceptance requires additional evidence.');
       await check(id+'.other',[id+'-C3'],'generated HTML',locale,'Exactly two distinct other event links and a localized return link',()=>{
         const links=[...doc.querySelectorAll('section[aria-labelledby="other-events"] h3 a')].map(a=>a.pathname);
         assert.deepEqual(links,pages.filter(o=>['P28','P29','P30'].includes(o.source_code)&&o.source_code!==id).map(o=>pathFor(o.fields['Đường dẫn'],locale)));assert.equal(doc.querySelector('.ed-all-events').pathname,pathFor('/events',locale));return links;
       });
       await check(id+'.sample-status',[id+'-F2'],'generated HTML',locale,'Event detail and matching archive listing show the same expected status against the frozen sample date',async()=>{
         const listing=new JSDOM(await readFile(join(output,locale==='vi'?'':locale,'events','index.html'),'utf8'));try{const entry=[...listing.window.document.querySelectorAll('.ed-event-line')].find(el=>el.querySelector('time')?.dateTime===date);
         assert.equal(entry.querySelector('.ed-status').textContent,tr(status));const text=doc.querySelectorAll('.ed-facts dd')[2].textContent;assert.equal(text,tr(status));return {date,status:text};
         }finally{listing.window.close();}
       });
       await check(id+'.schema',[id+'-F4'],'generated HTML',locale,'Sample event disallows indexing and has no Event structured data',()=>{
         const graph=JSON.parse(doc.querySelector('#structured-data').textContent)['@graph'].map(o=>o['@type']);assert.ok(!graph.includes('Event'));assert.equal(fields.robots,'noindex,nofollow');return graph;
       },'Invalid-slug behavior is tested separately from this generated page.');
     }
     dom.window.close();
   }
 }
 for(const locale of locales){
   const folder=locale==='vi'?'':locale;
   for(const [alias,real,state] of [['e-brochure','about-us','T26'],['testimonials','partners','T27'],['job-seekers','jobs','T28'],...(locale==='vi'?[['vi','','T29']]:[])]){
     await check('alias.'+alias,[state],'generated HTML',locale,'Alias resolves to correct localized canonical; legacy profile includes exact non-script refresh/anchor',async()=>{
       const html=await readFile(join(output,folder,alias,'index.html'),'utf8');const d=new JSDOM(html);try{
       const canonical=d.window.document.querySelector('link[rel=canonical]').getAttribute('href');const expected=host+pathFor('/'+real,locale);
       assert.equal(canonical,expected);if(alias==='e-brochure'){assert.equal(d.window.document.querySelector('meta[http-equiv=refresh]').content,'0;url='+pathFor('/about-us',locale)+'#profile');assert.equal(d.window.document.querySelector('a').getAttribute('href'),pathFor('/about-us',locale)+'#profile');}
       return {alias,canonical};
       }finally{d.window.close();}
     },alias==='e-brochure'?'':'Static alias content verified; JavaScript redirects and history are a separate observation.');
   }
 }
 await runResponsive({check,output});
 await runFlows({check,temp,locales});
}finally{await rm(temp,{recursive:true,force:true});}
await mkdir(reportDir,{recursive:true});
const suffix=baseline?'baseline/':'';
const path='docs/sdd/SEL-2026.11.27-v1.0.0/execution/qa/'+suffix+'observations.json';
const choices=evidence.flatMap((r,i)=>r.ids.map(id=>({choice_id:id,source_row:rows.get(id).row,scope:r.scope,locale:r.locale,coverage:r.remaining?'partial':'full',test_status:r.test_status,assertion:r.expected,actual:r.actual,evidence_ref:path+'#/observations/'+i,remaining:r.remaining})));
const hashes=Object.fromEntries(await Promise.all((await readdir(join(output,'assets'))).filter(n=>/\.(js|css)$/.test(n)).sort().map(async name=>[name,createHash('sha256').update(await readFile(join(output,'assets',name))).digest('hex')])));
async function treeHash(dir){
  const hash=createHash('sha256');
  async function walk(prefix){
    const files=await readdir(join(dir,prefix),{withFileTypes:true});
    for(const file of files.sort((a,b)=>a.name<b.name?-1:1)){
      const path=join(prefix,file.name);
      if(file.isDirectory())await walk(path);
      else if(file.isFile())hash.update(path+'\0'+createHash('sha256').update(await readFile(join(dir,path))).digest('hex')+'\n');
    }
  }
  await walk('');return hash.digest('hex');
}
const header={build_sha:head,dist_tree_sha256:baseline?undefined:await treeHash(output),source_tree_sha256:await treeHash('src'),route_and_bundle_sha256:digest.update(JSON.stringify(hashes)).digest('hex'),bundles:hashes,run_utc:timestamp,artifact:output,host:host+base,environment:'Node '+process.version+', JSDOM (no pixel rendering, native keyboard, touch or network verification)'};
await writeFile(reportDir+'/choice-evidence.json',JSON.stringify({...header,choices},null,2)+'\n');
await writeFile(reportDir+'/observations.json',JSON.stringify({...header,observations:evidence},null,2)+'\n');
await writeFile(reportDir+'/route-audit.json',JSON.stringify({...header,routes},null,2)+'\n');
console.log(JSON.stringify({rows:routes.length,assertions:evidence.length,choice_ids:new Set(choices.map(x=>x.choice_id)).size,failures}));
if(failures.length)process.exitCode=1;
