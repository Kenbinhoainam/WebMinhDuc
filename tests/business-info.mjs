import {build} from 'esbuild';
import {rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
const output='.business-info-test.mjs';
try {
 await build({stdin:{contents:"export {ContactPage} from './src/Contact'; export {ServicePage} from './src/pages/info/ServicesPages'; export {default as Footer} from './src/Footer'; export {default as CareersSections} from './src/CareersSections'; export {LocaleProvider} from './src/i18n'; export {loadLocale} from './src/i18n-runtime/catalog'; export {seo} from './src/seo/routes';",resolveDir:process.cwd(),sourcefile:'business-info-entry.tsx'},bundle:true,platform:'node',format:'esm',outfile:output,packages:'external',loader:{'.css':'empty'},logLevel:'silent'});
 const {ContactPage,ServicePage,Footer,CareersSections,LocaleProvider,loadLocale,seo}=await import(pathToFileURL(`${process.cwd()}/${output}`).href);
 const React=await import('react'),{renderToStaticMarkup}=await import('react-dom/server'),{MemoryRouter,Routes,Route}=await import('react-router-dom');
 const org=seo('/')['json']['@graph'][0];assert.equal(org.telephone,'0818919666');assert.ok(org.sameAs.includes('https://zalo.me/0329138082'));
 for(const locale of ['vi','en','zh','ko','ja']){
  await loadLocale(locale);
  const page=React.createElement(LocaleProvider,{value:locale},React.createElement(MemoryRouter,{initialEntries:['/services/college-admissions']},React.createElement(React.Fragment,null,React.createElement(Routes,null,React.createElement(Route,{path:'/services/:slug',element:React.createElement(ServicePage)})),React.createElement(ContactPage),React.createElement(Footer),React.createElement(CareersSections,{openings:null}))));
  const doc=new JSDOM(renderToStaticMarkup(page)).window.document;
  assert.ok(doc.querySelector('a[href="tel:0818919666"]'),`${locale}: verified telephone`);
  for(const id of ['VjV1DbkajBXDqGUE7','2hj5gqjuaLS4t6hk8','kc8WAYf6mQyVMJet7'])assert.ok(doc.querySelector(`a[href*="${id}"]`),`${locale}: verified office`);
  assert.ok(doc.querySelector('a[href="/education?form=F05#dang-ky"]'));assert.ok(doc.querySelector('a[href="/education?form=F06#dang-ky"]'));
  assert.equal(doc.querySelectorAll('.info-contact-section').length,0,'education page does not offer the business form');
  assert.doesNotMatch(doc.body.textContent,/0364 562 868|CV nội bộ là bắt buộc/);
 }
 console.log('PASS verified contact details, optional CV guidance and education form routes in five locales');
} finally {await rm(output,{force:true});}
