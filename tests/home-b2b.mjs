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
  const services=[...doc.querySelectorAll('.service-gallery-card')];
  assert.equal(services.length,5);
  const titles=services.map(card=>card.querySelector('h3').textContent);
  assert.equal(new Set(titles).size,5);
  assert.deepEqual(services.map(card=>card.querySelector('a').getAttribute('href')),['labor-supply','labor-leasing','recruitment','college-admissions','hr-consulting'].map(slug=>'/services/'+slug));
  assert.equal(new Set(services.map(card=>card.querySelector('img').getAttribute('src'))).size,5);
  assert.equal(doc.querySelectorAll('.partners-strip').length,1);
  assert.ok(doc.querySelector('#business-contact .contact-form'));
  assert.equal(doc.querySelectorAll('#business-contact .form-mode').length,0);
  assert.ok(doc.querySelector('a[href="/about-us#profile"]'));
  assert.ok(doc.querySelector('.section-home-solution > div > a[href="/services"]'));
  assert.equal(doc.querySelectorAll('video').length,1);
  assert.ok(doc.querySelector('.home-film-poster'));
  const figures=[...doc.querySelectorAll('.home-figure .motion-sr-only')].map(node=>node.textContent);
  assert.deepEqual(figures,[new Intl.NumberFormat(locale).format(1200)+'+','80+','15+','95%']);
  assert.doesNotMatch(doc.body.textContent,/Nhân vật giả định|Số liệu mô phỏng/);

 }
 console.log('PASS homepage B2B: five services, reference metrics, partner rail, on-demand film and locked F01 in five languages');
} finally {await rm(output,{force:true});}
