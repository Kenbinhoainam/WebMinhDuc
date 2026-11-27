import {readFile,access} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {join} from 'node:path';
import {build} from 'esbuild';
const registry=await build({stdin:{contents:"export {pages,ORIGIN} from './src/seo/routes'; export {locales,localizedPath} from './src/i18n-runtime/paths';",resolveDir:process.cwd(),sourcefile:'seo-route-registry.ts'},bundle:true,platform:'node',format:'esm',write:false,logLevel:'silent'});
const {pages,ORIGIN:origin,locales,localizedPath}=await import('data:text/javascript;base64,'+Buffer.from(registry.outputFiles[0].text).toString('base64'));
const sitemap=await readFile('dist/sitemap.xml','utf8');
const urls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
const expectedUrls=pages.flatMap(page=>locales.map(locale=>origin+localizedPath(page.path,locale)));
assert.equal(urls.length,expectedUrls.length,'one sitemap URL per source route and locale');
assert.deepEqual(new Set(urls),new Set(expectedUrls),'sitemap covers the complete source registry');
assert.ok(urls.every(url=>!url.includes('/e-brochure')), 'retired reader is absent from sitemap');
for(const base of ['', '/en', '/zh', '/ko', '/ja']) {
 const old=await readFile(`dist${base}/e-brochure/index.html`,'utf8');
 const target=base+'/about-us#profile';
 assert.ok(old.includes(`content="0;url=${target}"`) && old.includes(`href="${target}"`),'old bookmarks reach localized profile without JavaScript');
 assert.ok(old.includes(`rel="canonical" href="${origin}${base}/about-us"`));
 assert.doesNotMatch(old,/md-brochure|window\.print|<script/i);
}
const titles=new Set(),descriptions=new Set();
for(const url of urls){
 const path=new URL(url).pathname,html=await readFile(join('dist',path,'index.html'),'utf8');
 assert.doesNotMatch(html,/href="[^"]*\/e-brochure(?:[?#/"][^"]*)?/i,`${path}: no links to retired reader`);
 const title=html.match(/<title>(.*?)<\/title>/)?.[1],description=html.match(/<meta name="description" content="([^"]*)"/)?.[1];
 assert.ok(title&&description,`${path}: metadata`);assert.ok(!titles.has(title),`${path}: duplicate title`);assert.ok(!descriptions.has(description),`${path}: duplicate description`);titles.add(title);descriptions.add(description);
 assert.ok(html.includes(`rel="canonical" href="${url}"`),`${path}: canonical`);
 const locale=['en','zh','ko','ja'].includes(path.split('/')[1])?path.split('/')[1]:'vi';
 const lang=locale==='zh'?'zh-Hans':locale;
 assert.ok(html.includes(`<html lang="${lang}">`),`${path}: document language`);
 for(const alt of ['vi','en','zh-Hans','ko','ja','x-default'])assert.ok(html.includes(`hreflang="${alt}"`),`${path}: missing alternate ${alt}`);assert.match(html,/<meta name="robots" content="noindex,nofollow"/);
 assert.equal([...html.matchAll(/<h1(?:\s[^>]*)?>/g)].length,1,`${path}: expected one h1`);assert.ok(html.length>5000,`${path}: missing content`);assert.ok(!html.includes('Đang tải nội dung…'),`${path}: fallback`);
 const data=JSON.parse(html.match(/<script type="application\/ld\+json" id="structured-data">(.*?)<\/script>/)[1]);
 const types=data['@graph'].map(x=>x['@type']);assert.ok(types.includes('Organization')&&types.includes('WebSite')&&types.includes('WebPage'));
 const isArticle=/^(?:\/(?:en|zh|ko|ja))?\/news\/[^/]+$/.test(path);
 assert.equal(types.includes('Article'),isArticle,`${path}: structured article only on reading pages`);
 assert.ok(html.includes(`<meta property="og:type" content="${isArticle?'article':'website'}"`),`${path}: share card type`);
 if(isArticle){
  const story=data['@graph'].find(item=>item['@type']==='Article');
  assert.equal(story.mainEntityOfPage['@id'],url+'#webpage');
  assert.equal(story.inLanguage,lang);
  assert.ok(story.headline&&story.articleSection&&/^\d{4}-\d{2}-\d{2}$/.test(story.datePublished));
  if(story.image)assert.ok(html.includes(`<meta property="og:image" content="${story.image}"`),`${path}: share uses article photo`);
 }
 assert.ok(!types.some(x=>['Review','AggregateRating','JobPosting','Event'].includes(x)),`${path}: unsupported schema`);
 const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size,`${path}: duplicate IDs`);
 if(['/', '/en','/zh','/ko','/ja'].includes(path)) assert.ok(!data['@graph'].some(x=>x['@type']==='FAQPage'),'Home must not advertise an absent FAQ');
 for(const m of html.matchAll(/href="(\/(?!assets\/|mirror\/|optimized\/)[^"?#]*)/g)) {const dest=m[1]; await access(join('dist',dest,'index.html')).catch(()=>{throw Error(`${path}: missing local route ${dest}`)});}
 for(const match of html.matchAll(/srcSet="([^"]+)"/gi))for(const candidate of match[1].split(',')){const asset=candidate.trim().split(/\s+/)[0];if(asset.startsWith('/'))await access(join('dist',asset)).catch(()=>{throw Error(`${path}: missing responsive asset ${asset}`)});}
 for(const m of html.matchAll(/(?:src|href)="(\/(?:assets|mirror|optimized)\/[^"?#]+)[^"]*"/g)) await access(join('dist',m[1])).catch(()=>{throw Error(`${path}: missing asset ${m[1]}`)});
}
assert.ok(!(await readFile('dist/robots.txt','utf8')).toLowerCase().includes('sitemap'));
console.log(`SEO output audit passed: ${urls.length} pages`);
