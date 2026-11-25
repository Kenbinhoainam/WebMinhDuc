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
  assert.equal(doc.querySelectorAll('.home-v16-steps > li').length,5,`${locale}: five process steps`);
  assert.equal(doc.querySelectorAll('.home-b2b-office-list a').length,3,`${locale}: three offices`);
  for(const id of ['VjV1DbkajBXDqGUE7','2hj5gqjuaLS4t6hk8','kc8WAYf6mQyVMJet7']) assert.ok(doc.querySelector(`a[href*="${id}"]`),`${locale}: office map ${id}`);
  assert.ok(doc.querySelector('#business-contact .contact-form'),`${locale}: F01 form`);
  assert.equal(doc.querySelectorAll('#business-contact .form-mode').length,0,`${locale}: mode locked`);
  assert.equal(doc.querySelectorAll('video').length,1,`${locale}: one hero video`);
  assert.equal(doc.querySelectorAll('.home-b2b-video-button').length,0,`${locale}: no duplicate company video`);
  assert.equal(doc.querySelectorAll('.home-v16-need').length,3,`${locale}: three buyer needs`);
  assert.equal(doc.querySelectorAll('.home-v16-need button').length,3,`${locale}: each need offers inquiry`);
  assert.equal(doc.querySelectorAll('.ref-news-card').length,3,`${locale}: three news cards`);
  assert.equal(new Set([...doc.querySelectorAll('.ref-news-card h3 a')].map(a=>a.getAttribute('href'))).size,3,`${locale}: distinct news destinations`);
  assert.ok(doc.querySelector('.home-v16-people a[href$="/about-us#activities"]'),`${locale}: activities link`);
  assert.equal(doc.querySelectorAll('.home-v16-people img[src^="/assets/minhduc-v16/"]').length,2,`${locale}: two real activity images`);
  assert.equal(doc.querySelectorAll('.ref-testimonial-card,.ref-partner-grid').length,0,`${locale}: no fake testimonials or duplicate partner grid`);
  assert.equal(doc.querySelectorAll('.ref-achievement').length,4,`${locale}: four reference metric cards`);
  const figures=[...doc.querySelectorAll('.ref-achievement .motion-sr-only')].map(node=>node.textContent);assert.deepEqual(figures,['1.200+','80+','15+','95%']);
  assert.doesNotMatch(doc.body.textContent,/Nhân vật giả định|Số liệu mô phỏng/);
  const images=[...doc.querySelectorAll('.ref-solution')].map(node=>node.getAttribute('style'));
  assert.equal(new Set(images).size,5,`${locale}: distinct service imagery`);
  assert.match(images[3],/admissions-seminar\.webp/);assert.match(images[4],/business-team\.webp/);
  assert.ok(images.every(image=>!image.includes('HR2B-2-1')),`${locale}: no branded admission image`);
  assert.equal(doc.querySelectorAll('.home-b2b-office-layout img').length,0,`${locale}: office details do not imply a stock building is a branch`);
 }
 console.log('PASS homepage B2B: five services, reference metrics, process, offices, one video and locked F01 in five languages');
} finally {await rm(output,{force:true});}
