import {build} from 'esbuild';
import {rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
const output='.home-b2b-test.mjs';
try {
 await build({stdin:{contents:"export {default as Home} from './src/Home'; export {LocaleProvider} from './src/i18n'; export {loadLocale} from './src/i18n-runtime/catalog';",resolveDir:process.cwd(),sourcefile:'home-b2b-entry.tsx'},bundle:true,platform:'node',format:'esm',outfile:output,packages:'external',loader:{'.css':'empty'},logLevel:'silent'});
 const {Home,LocaleProvider,loadLocale}=await import(pathToFileURL(`${process.cwd()}/${output}`).href);
 const React=await import('react');const {renderToString}=await import('react-dom/server');const {MemoryRouter}=await import('react-router-dom');
 for(const locale of ['vi','en','zh','ko','ja']){
  await loadLocale(locale);
  const html=renderToString(React.createElement(LocaleProvider,{value:locale},React.createElement(MemoryRouter,null,React.createElement(Home))));
  const doc=new JSDOM(html).window.document;
  assert.equal(doc.querySelectorAll('.ref-solution').length,5,`${locale}: five services`);
  assert.equal(doc.querySelectorAll('.partners-strip').length,1,`${locale}: single partner strip`);
  assert.equal(doc.querySelectorAll('.home-b2b-steps li').length,5,`${locale}: five process steps`);
  assert.equal(doc.querySelectorAll('.home-b2b-office-list a').length,3,`${locale}: three offices`);
  for(const id of ['VjV1DbkajBXDqGUE7','2hj5gqjuaLS4t6hk8','kc8WAYf6mQyVMJet7']) assert.ok(doc.querySelector(`a[href*="${id}"]`),`${locale}: office map ${id}`);
  assert.ok(doc.querySelector('#business-contact .contact-form'),`${locale}: F01 form`);
  assert.equal(doc.querySelectorAll('#business-contact .form-mode').length,0,`${locale}: mode locked`);
  assert.equal(doc.querySelectorAll('.home-b2b-video-button').length,1,`${locale}: one company video entry`);
  assert.equal(doc.querySelectorAll('.ref-testimonial-card,.ref-partner-grid').length,0,`${locale}: no fake testimonials or duplicate partner grid`);
  assert.doesNotMatch(doc.body.textContent,/95%|1,?200\+|Nhân vật giả định|Số liệu mô phỏng/);
 }
 console.log('PASS homepage B2B: five services, factual blocks, process, offices, one video and locked F01 in five languages');
} finally {await rm(output,{force:true});}
