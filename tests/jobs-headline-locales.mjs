import {build} from 'esbuild';
import {rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {MemoryRouter} from 'react-router-dom';
import {JSDOM} from 'jsdom';
const file='.jobs-headline-locales-test.mjs';
try {
 await build({stdin:{contents:"export {JobsPage} from './src/JobsPages'; export {LocaleProvider} from './src/i18n'; export {loadLocale} from './src/i18n-runtime/catalog';",resolveDir:process.cwd(),sourcefile:'jobs-headline-locales.tsx'},bundle:true,platform:'node',format:'esm',outfile:file,packages:'external',loader:{'.css':'empty'},logLevel:'silent'});
 const {JobsPage,LocaleProvider,loadLocale}=await import(pathToFileURL(`${process.cwd()}/${file}`).href);
 const expected={vi:'Một công việc phù hợp. Một khởi đầu vững vàng.',en:'A suitable job. A strong start.',zh:'一份合适的工作。 一个稳健的开始。',ko:'나에게 맞는 일자리. 든든한 출발.',ja:'自分に合った仕事。 確かなスタート。'};
 for(const locale of Object.keys(expected)) {
  await loadLocale(locale);
  const html=renderToString(React.createElement(LocaleProvider,{value:locale},React.createElement(MemoryRouter,null,React.createElement(JobsPage))));
  const dom=new JSDOM(html);assert.equal(dom.window.document.querySelector('.jobs-intro h2')?.textContent,expected[locale],`${locale}: localized SSR headline`);dom.window.close();
 }
 console.log('PASS jobs headline SSR in five locales');
} finally {await rm(file,{force:true});}
