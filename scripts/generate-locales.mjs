import {readFile, writeFile, mkdir} from 'node:fs/promises';

// Order matches the original runtime's object spreads; later catalogs win.
const names=['common','home','info','info-existing','jobs','contact-admin','education','metadata','visual','v18-about','v18-services','v18-jobs','v18-careers','v18-news','v18-contact'];
const catalogs=await Promise.all(names.map(async name=>JSON.parse(await readFile(`src/i18n-catalogs/${name}.json`,'utf8'))));
const merged=Object.assign({},...catalogs);
const jobs=catalogs[names.indexOf('jobs')];
const select=(catalog,locale)=>Object.fromEntries(Object.entries(catalog).filter(([,values])=>values[locale] !== undefined).map(([key,values])=>[key,values[locale]]));
await mkdir('src/i18n-generated',{recursive:true});
let stale=false;
for(const locale of ['en','zh','ko','ja']) {
 const path=`src/i18n-generated/${locale}.json`;
 const contents=JSON.stringify({merged:select(merged,locale),jobs:select(jobs,locale)})+'\n';
 if(process.argv.includes('--check')) {
  const existing=await readFile(path,'utf8').catch(()=>null);
  if(existing!==contents){console.error(`Stale generated locale: ${path}`);stale=true;}
 } else await writeFile(path,contents);
}
if(stale) process.exitCode=1;
