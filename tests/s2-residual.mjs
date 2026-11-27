// From repository root after a Pages build and the matching private-preview attestation.
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {mkdtempSync,readFileSync,writeFileSync,rmSync,readdirSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {tmpdir} from 'node:os';
import {JSDOM} from 'jsdom';
const sdd='docs/sdd/SEL-2026.11.27-v1.0.0';
const execution=sdd+'/execution';
const source=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
execFileSync('git',['diff','--quiet','HEAD','--','src']);
const proof=JSON.parse(readFileSync(execution+'/logs/preview-paths.json','utf8'));
const qa=JSON.parse(readFileSync(execution+'/qa/choice-evidence.json','utf8'));
assert.equal(proof.source,source);assert.equal(qa.build_sha,source);
const folder=mkdtempSync(join(tmpdir(),'s2-residual-report-'));
const checks=[];
const counts=Object.create(null);
function expect(caseId,n){assert.equal(counts[caseId],n,'unexpected count for '+caseId);}
try{
  function run(name,args=[]){
    return execFileSync(process.execPath,['tests/'+name+'.mjs',...args],{encoding:'utf8',timeout:360000,maxBuffer:1024*1024});
  }
  const files=run('s2-residual-files');
  const fileIds=['CS-C04-3','MI05-1','MI05-2','MI05-3','MI05-4'];
  for(const locale of ['vi','en','zh','ko','ja'])for(const flow of ['F04','F06']){
    const actual=files.split('\n').find(line=>line.startsWith('PASS '+flow+' '+locale+' '));assert.ok(actual);
    checks.push({ids:fileIds,scope:flow+' '+locale,actual,evidence_ref:'tests/s2-residual-files.mjs',status:'Pass'});
  }
  const report=join(folder,'journeys.json');
  const journeysLog=run('s2-residual-journeys',[report]);
  const journeys=JSON.parse(readFileSync(report,'utf8'));assert.ok(journeys.every(c=>c.status==='Pass'));
  checks.push(...journeys.map(c=>({...c,evidence_ref:'tests/s2-residual-journeys.mjs'})));
  const html=readFileSync(resolve('dist/en/jobs/index.html'));
  for(const locale of ['','en/','zh/','ko/','ja/']){
    function main(page){const d=new JSDOM(readFileSync('dist/'+locale+page+'/index.html','utf8'));try{return d.window.document.querySelector('main').textContent;}finally{d.window.close();}}
    assert.equal(main('job-seekers'),main('jobs'));
    checks.push({ids:['T28'],scope:'Prerender alias '+(locale||'vi'),actual:'Main text of packaged jobs and job-seekers HTML is identical.',evidence_ref:'tests/s2-residual.mjs',status:'Pass'});
  }
  for(const {ids} of checks)for(const id of ids)counts[id]=(counts[id]||0)+1;
  for(const id of fileIds)expect(id,10);
  expect('CS-C01-3',4);expect('CS-C01-4',6);expect('CS-C04-2',3);expect('T25',6);expect('T28',6);
  for(const id of ['T13','T14'])expect(id,4);
  const observations={
    'CS-C04-3':['Metadata rows show each filename, format, byte size and named remove button. Removing the middle row preserves neighboring files and form values; file-content and outbound-access traps stayed at zero.','Long filename is retained and CSS permits wrapping; line breaks at physical browser widths were not measured.'],
    'MI05-1':['Names, formats (including MIME and unknown fallback), localized byte sizes and count appear after selecting files. Synthetic cancel and empty change retain the selection; byte reads, fetch, XHR and beacon traps stayed at zero.','A native OS picker or physical assistive technology was not used, and the visual presentation of very long filenames has not been measured.'],
    'MI05-2':['Replacement help is associated with the chooser; replacing two selected files with one replaces the complete list; cancel preserves existing rows, and name, phone and email are retained.',''],
    'MI05-3':['Middle removal gives focus to the following named button; after final removal focus returns to the chooser. A persistent polite, atomic status identifies the removed filename. Counts, remaining rows and other fields are checked.',''],
    'MI05-4':['Count above three, individual size above 5,000,000 bytes and unsupported format each expose the expected localized reason on selection. Removal clears the error; submission at the exact limit produces one local receipt. With up to three permitted files, a separate total above 15,000,000 bytes necessarily violates an earlier rule.',''],
    'CS-C01-3':['All four workforce service CTAs open F01 with the matching service. The form identifies its four required fields and creates a local receipt; the receipt opens the exact sample in ADMIN.',''],
    'CS-C01-4':['All three programs enter both form modes with their slug preselected. F05 has no attachment field and F06 accepts empty email/files. Each synthetic record retains its program, type and source, and its receipt opens the matching ADMIN detail.',''],
    'CS-C04-2':['Jobs, Careers and Saved Jobs each preserved the other filter, confirmed exact before/after record IDs and counts, and focused the following chip then the initial search field. The tested chip labels identify the removed criterion.',''],
    'CS-C07-3':['Injected storage failure allowed save and removal across routes. The saved list showed the temporary-session notice. After storage was restored, the subsequent toggle persisted and removed the stale warning.',''],
    'T09':['Direct /contact?form=F01#consultation opened F01, accepted the required fields and linked to the exact ADMIN record.',''],
    'T10':['/contact and explicit ?form=F02#consultation selected F02. General inquiry fields, local receipt and its ADMIN record were verified.',''],
    'T13':['Education index query and all three program CTAs selected F05. Optional program at index and individual default slugs on detail were verified through a real form and local receipt.',''],
    'T14':['Education index query and three program CTAs selected F06. Empty optional email/files submitted. Additional fixture tests covered metadata validation, corrections, no uploads and local receipt.',''],
    'T25':['The unknown URL and missing slugs under jobs, services, education, news and events each rendered a fallback and a working localized recovery link. This is a client-side state test; no HTTP status is inferred.',''],
    'T27':['The /en/testimonials and /en/partners routes rendered the same main content under the real App router.',''],
    'T28':['The runtime jobs redirect preserved query, hash, locale and Back/Forward semantics. Packaged HTML for job-seekers matched jobs main content in all five locales.',''],
    'T29':['The /vi compatibility path resolved to the Vietnamese home page in the running React router.',''],
  };
  const selected=new Map();
  for(const file of readdirSync(sdd+'/data').filter(f=>f.startsWith('selections-')))for(const line of readFileSync(sdd+'/data/'+file,'utf8').trim().split('\n')){
    const row=JSON.parse(line);if(row.status==='Chọn')selected.set(row.effective_code,row);
  }
  const choices=Object.entries(observations).map(([id,[assertion,remaining]])=>{
    assert.ok(counts[id]>0 && selected.has(id),id);
    return {choice_id:id,source_row:selected.get(id).row,coverage:remaining?'partial':'full',test_status:'Pass',assertion,remaining,evidence_ref:'tests/s2-residual.mjs',checks:checks.filter(c=>c.ids.includes(id)).map(c=>c.scope)};
  });
  const payload={build_sha:source,site_source_sha:proof.site_sha,private_archive_sha256:proof.archive_sha256,pages_dist_sha256:qa.dist_tree_sha256,sampled_en_jobs_sha256:createHash('sha256').update(html).digest('hex'),run_utc:new Date().toISOString(),method:'In-process React DOM, actual App routes and local submissions; generated Pages HTML for legacy job alias. No physical device, OS chooser, screen reader speech or external transport.',checks,choices};
  writeFileSync(execution+'/residual.json',JSON.stringify(payload,null,2)+'\n');
  process.stdout.write('App '+source+'\nPages '+qa.dist_tree_sha256+'\nSite '+proof.site_sha+' archive '+proof.archive_sha256+'\n'+files+journeysLog+checks.length+' checked cases across '+choices.length+' choices.\n');
} finally{rmSync(folder,{force:true,recursive:true});}
