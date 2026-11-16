import {build} from 'esbuild';
import {readFile,rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';

execFileSync(process.execPath,['scripts/generate-locales.mjs','--check']);
const bundle='.catalog-parity-test.mjs';
try {
 await build({stdin:{contents:"export {loadLocale,lookup} from './src/i18n-runtime/catalog'; export {translate} from './src/i18n-runtime/jsx-runtime';",resolveDir:process.cwd(),sourcefile:'catalog-test.tsx'},bundle:true,platform:'node',format:'esm',outfile:bundle,packages:'external',loader:{'.css':'empty'},logLevel:'silent'});
 const {loadLocale,lookup,translate}=await import(pathToFileURL(`${process.cwd()}/${bundle}`).href);
 const names=['common','home','info','info-existing','jobs','contact-admin','education','metadata','visual'];
 const catalogs=await Promise.all(names.map(async name=>JSON.parse(await readFile(`src/i18n-catalogs/${name}.json`,'utf8'))));
 const merged=Object.assign({},...catalogs), jobs=catalogs[4];
 await Promise.all(['vi','en','zh','ko','ja'].map(loadLocale));
 for(const locale of ['en','zh','ko','ja']) {
  for(const [key,values] of Object.entries(merged)) {
   assert.equal(lookup(locale,key),values[locale],`${locale}: merged ${key}`);
   assert.equal(translate(key,locale),values[locale] || key,`${locale}: translate ${key}`);
   if(key.trim()===key && key) assert.equal(translate(` ${key} `,locale),values[locale] ? ` ${values[locale]} ` : ` ${key} `,`${locale}: whitespace ${key}`);
  }
  for(const [key,values] of Object.entries(jobs)) assert.equal(lookup(locale,key,'jobs'),values[locale],`${locale}: jobs ${key}`);
 }
 assert.equal(translate(' untranslated ', 'vi'),' untranslated ');
 console.log('PASS generated catalogs: freshness, merged and jobs-only parity, translation and whitespace in five locales');
} finally {await rm(bundle,{force:true});}
