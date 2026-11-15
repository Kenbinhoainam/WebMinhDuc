import {readFile,access} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {join} from 'node:path';
const origin='https://minhduc-prototype-sprint1.kenbinhoainam.chatgpt.site';
const sitemap=await readFile('dist/sitemap.xml','utf8');
const urls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
assert.equal(urls.length,33,'expected all primary routes');
const titles=new Set(),descriptions=new Set();
for(const url of urls){
 const path=new URL(url).pathname,html=await readFile(join('dist',path,'index.html'),'utf8');
 const title=html.match(/<title>(.*?)<\/title>/)?.[1],description=html.match(/<meta name="description" content="([^"]*)"/)?.[1];
 assert.ok(title&&description,`${path}: metadata`);assert.ok(!titles.has(title),`${path}: duplicate title`);assert.ok(!descriptions.has(description),`${path}: duplicate description`);titles.add(title);descriptions.add(description);
 assert.ok(html.includes(`rel="canonical" href="${url}"`),`${path}: canonical`);assert.match(html,/<meta name="robots" content="noindex,nofollow"/);
 assert.equal([...html.matchAll(/<h1(?:\s[^>]*)?>/g)].length,1,`${path}: expected one h1`);assert.ok(html.length>5000,`${path}: missing content`);assert.ok(!html.includes('Đang tải nội dung…'),`${path}: fallback`);
 const data=JSON.parse(html.match(/<script type="application\/ld\+json" id="structured-data">(.*?)<\/script>/)[1]);
 const types=data['@graph'].map(x=>x['@type']);assert.ok(types.includes('Organization')&&types.includes('WebSite')&&types.includes('WebPage'));
 assert.ok(!types.some(x=>['Review','AggregateRating','JobPosting','Event'].includes(x)),`${path}: unsupported schema`);
 const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size,`${path}: duplicate IDs`);
 if(path==='/'){const visible=html.replace(/<script type="application\/ld\+json" id="structured-data">[\s\S]*?<\/script>/,'');const faq=data['@graph'].find(x=>x['@type']==='FAQPage');assert.ok(faq?.mainEntity.length);for(const q of faq.mainEntity){assert.ok(visible.includes(q.name),`FAQ question missing: ${q.name}`);assert.ok(visible.includes(q.acceptedAnswer.text),`FAQ answer missing: ${q.name}`)}}
 for(const m of html.matchAll(/href="(\/(?!assets\/|mirror\/)[^"?#]*)/g)) {const dest=m[1]; await access(join('dist',dest,'index.html')).catch(()=>{throw Error(`${path}: missing local route ${dest}`)});}
 for(const m of html.matchAll(/(?:src|href)="(\/(?:assets|mirror)\/[^"?#]+)[^"]*"/g)) await access(join('dist',m[1])).catch(()=>{throw Error(`${path}: missing asset ${m[1]}`)});
}
assert.ok(!(await readFile('dist/robots.txt','utf8')).toLowerCase().includes('sitemap'));
console.log(`SEO output audit passed: ${urls.length} pages`);
