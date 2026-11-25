import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import ts from 'typescript';

// Evaluate the real TypeScript module with a minimal hook adapter, without a browser.
// Tests below exercise its actual data, normalization, saved-job store and CV validation.
const read = file => fs.readFileSync(new URL(`../src/${file}`, import.meta.url), 'utf8');
// Assemble the real data, store and page functions in a single isolated test module.
const source = ["import {useMemo,useSyncExternalStore} from 'react';", read('jobs-data.ts'), read('sharedformvalidation.ts'), read('saved-jobs.ts').replace(/^import .*;\n/gm,''), read('JobsPages.tsx').replace(/^import .*;\n/gm,'').replace(/^export (?:type )?\{.*\} from .*;\n/gm,'')].join('\n');
const js = ts.transpileModule(source, {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText + '\nexports.__review={parseSaved,normalized,validateDemoFiles,getSavedSnapshot,subscribeSaved};';
const key='minhduc.saved-jobs.v1';
function make(seed){
 const persisted = new Map(seed ? [[key,JSON.stringify(seed)]] : []);
 const listeners = new Map();
 const mode={failRead:false,failWrite:false};
 const window={localStorage:{getItem:k=>{if(mode.failRead)throw Error('blocked');return persisted.get(k)??null},setItem:(k,v)=>{if(mode.failWrite)throw Error('quota');persisted.set(k,v)}},addEventListener:(name,cb)=>{if(!listeners.has(name))listeners.set(name,new Set());listeners.get(name).add(cb)},removeEventListener:(name,cb)=>listeners.get(name)?.delete(cb),dispatchEvent:e=>{for(const cb of listeners.get(e.type)??[])cb(e)}};
 const exp={};
 vm.runInNewContext(js,{exports:exp,require:name=>name==='react'?{useSyncExternalStore:(_sub,get)=>get(),useMemo:fn=>fn()}: {},window,Event});
 return {api:exp,window,persisted,mode};
}
let n=0;function test(name,fn){fn();n++;process.stdout.write('PASS '+name+'\n')}
const env=make();const {api}=env;const r=api.__review;
const plain=x=>JSON.parse(JSON.stringify(x));
test('8 distinct job IDs and routes',()=>{assert.equal(api.jobs.length,8);assert.equal(new Set(api.jobs.map(x=>x.id)).size,8);assert.equal(new Set(api.jobs.map(x=>x.slug)).size,8)});
test('No real partner assigned to demo jobs',()=>assert.doesNotMatch(JSON.stringify(api.jobs),/luxshare|foxconn|samsung|jeiltech|tacu/i));
test('Vietnamese accent and whitespace normalization',()=>assert.equal(r.normalized('  ĐÓNG   GÓI Bắc Giang '),'dong goi bac giang'));
test('Malformed saved storage is safe',()=>{assert.deepEqual(plain(r.parseSaved('{bad')),[]);assert.deepEqual(plain(r.parseSaved('{}')),[])});
test('Saved IDs sanitize duplicates and unknown values',()=>assert.deepEqual(plain(r.parseSaved('["MD001","MD001",5,"bad","MD002"]')),['MD001','MD002']));
test('Save persists and count updates',()=>{api.useSavedJobs().toggleSaved('MD001');assert.equal(api.useSavedJobs().count,1);assert.equal(env.persisted.get(key),'["MD001"]')});
test('Fresh module restores saved jobs',()=>assert.equal(make(['MD001']).api.useSavedJobs().count,1));
test('Unknown IDs cannot be saved',()=>{api.useSavedJobs().toggleSaved('missing');assert.equal(api.useSavedJobs().count,1)});
test('Cross-tab remove clears stale memory',()=>{r.subscribeSaved(()=>{});env.persisted.delete(key);env.window.dispatchEvent({type:'storage',key,newValue:null});assert.equal(api.useSavedJobs().count,0)});
test('Cross-tab clear resets count',()=>{api.useSavedJobs().toggleSaved('MD002');env.persisted.clear();env.window.dispatchEvent({type:'storage',key:null,newValue:null});assert.equal(api.useSavedJobs().count,0)});
test('Failed write still toggles existing state',()=>{const e=make(['MD001']);e.mode.failWrite=true;e.api.useSavedJobs().toggleSaved('MD002');assert.deepEqual(plain(e.api.useSavedJobs().savedIds),['MD001','MD002']);e.api.useSavedJobs().toggleSaved('MD001');assert.deepEqual(plain(e.api.useSavedJobs().savedIds),['MD002']);assert.equal(e.persisted.get(key),'["MD001"]')});
test('Blocked storage remains usable in memory',()=>{const e=make();e.mode.failRead=e.mode.failWrite=true;e.api.useSavedJobs().toggleSaved('MD003');assert.equal(e.api.useSavedJobs().count,1);e.api.useSavedJobs().toggleSaved('MD003');assert.equal(e.api.useSavedJobs().count,0)});
test('Optional attachments can be absent',()=>assert.equal(r.validateDemoFiles([]),''));
test('PDF exactly 5,000,000 bytes accepted',()=>assert.equal(r.validateDemoFiles([{name:'cv.pdf',type:'application/pdf',size:5_000_000}]),''));
test('Attachment above 5,000,000 bytes rejected',()=>assert.match(r.validateDemoFiles([{name:'cv.pdf',type:'application/pdf',size:5_000_001}]),/5 MB/));
test('Maximum three files totaling 15,000,000 bytes accepted',()=>assert.equal(r.validateDemoFiles([{name:'a.jpg',type:'image/jpeg',size:5_000_000},{name:'b.pdf',type:'application/pdf',size:5_000_000},{name:'c.docx',type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',size:5_000_000}]),''));
test('More than three files rejected',()=>assert.match(r.validateDemoFiles(Array.from({length:4},(_,i)=>({name:`${i}.pdf`,type:'application/pdf',size:1}))),/3 tệp/));
test('Unsupported extension rejected',()=>assert.match(r.validateDemoFiles([{name:'cv.exe',type:'application/octet-stream',size:200}]),/JPG/));
test('Renamed incompatible MIME rejected',()=>assert.match(r.validateDemoFiles([{name:'cv.pdf',type:'image/png',size:200}]),/JPG/));
test('Uppercase DOCX accepted',()=>assert.equal(r.validateDemoFiles([{name:'CV.DOCX',type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',size:200}]),''));
test('Generic file MIME accepted with allowed extension',()=>assert.equal(r.validateDemoFiles([{name:'cv.doc',type:'application/octet-stream',size:200}]),''));
test('Missing file MIME accepted with allowed extension',()=>assert.equal(r.validateDemoFiles([{name:'cv.pdf',type:'',size:200}]),''));
console.log(`${n} checks passed`);
