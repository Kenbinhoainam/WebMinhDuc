import {build} from 'esbuild';
import {readFile, access} from 'node:fs/promises';
import assert from 'node:assert/strict';

const bundle=await build({stdin:{contents:"export {articles,leadArticle} from './src/editorial-data'; export {getArticle,articleSections} from './src/editorial-content';",resolveDir:process.cwd(),sourcefile:'editorial-content-test.ts'},bundle:true,platform:'node',format:'esm',write:false,logLevel:'silent'});
const {articles,leadArticle,getArticle,articleSections}=await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'));
const originalSlugs=['ho-so-xin-viec','nhu-cau-tuyen-dung','chon-cong-viec-phu-hop','thong-tin-tuyen-dung-minh-bach','don-tiep-lao-dong-moi','an-toan-thong-tin-khi-tim-viec'];
assert.ok(articles.length>=originalSlugs.length+8,'at least eight additional original articles');
for(const slug of originalSlugs)assert.ok(getArticle(slug),`preserved URL: ${slug}`);
assert.equal(new Set(articles.map(article=>article.slug)).size,articles.length,'unique article URLs');
assert.deepEqual(new Set(Object.keys(articleSections)),new Set(articles.map(article=>article.slug)),'every summary resolves to exactly one full article');
assert.equal(getArticle('missing-article'),undefined);
assert.ok(articles.every(article=>!('sections' in article)),'the shell registry contains summaries only');
const strings=new Set();
function collect(value,key='') {
 if(Array.isArray(value))return value.forEach(item=>collect(item,key));
 if(value&&typeof value==='object')return Object.entries(value).forEach(([name,item])=>collect(item,name));
 if(typeof value==='string'&&['title','excerpt','category','heading','paragraphs','bullets','alt','caption','description','headers','rows'].includes(key))strings.add(value);
}
for(const summary of articles) {
 const article=getArticle(summary.slug);
 assert.ok(article.sections.length>=3,`${summary.slug}: developed article sections`);
 assert.ok(article.sections.every(section=>section.heading&&section.paragraphs.length&&section.paragraphs.every(Boolean)),`${summary.slug}: substantive sections`);
 const images=[article.image,...article.sections.flatMap(section=>section.images||[])].filter(Boolean);
 for(const image of images){assert.ok(image.alt&&image.caption,`${summary.slug}: descriptive image and caption`);await access('public'+image.src);}
 collect(article);
}
const lead=getArticle(leadArticle.slug);
assert.ok(lead.sections.length>=6,'lead has a long-form structure');
assert.ok(lead.sections.flatMap(section=>section.images||[]).length>=2,'lead includes captioned inline figures');
for(const locale of ['en','zh','ko','ja']) {
 const {merged}=JSON.parse(await readFile(`src/i18n-generated/${locale}.json`,'utf8'));
 for(const key of strings){assert.ok(merged[key],`${locale}: missing article text ${key}`);if (/\p{L}/u.test(key)) assert.notEqual(merged[key],key,`${locale}: untranslated article text ${key}`);}
}
console.log(`PASS ${articles.length} original articles, stable URLs, complete bodies, verified local image files and ${strings.size} display strings in five languages`);
