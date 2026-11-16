import {readdir,readFile,stat,writeFile} from 'node:fs/promises';
import {extname,join} from 'node:path';

const files=[];
async function walk(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const file=join(dir,entry.name);if(entry.isDirectory())await walk(file);else files.push(file)}}
await walk('dist');
const assets=new Map(),missing=new Set();
function record(value,page){
 const src=value.replaceAll('&amp;','&').trim();
 if(!src.startsWith('/')||src.startsWith('//'))return;
 const path=decodeURI(src.split(/[?#]/)[0]);
 if(!/\.(?:avif|webp|png|jpe?g|svg|gif|mp4|woff2?|ttf|css|js)$/i.test(path))return;
 if(!assets.has(path))assets.set(path,new Set());
 assets.get(path).add(page);
}
for(const file of files.filter(file=>['.html','.css'].includes(extname(file)))){
 const text=await readFile(file,'utf8');
 for(const match of text.matchAll(/(?:src|href)="([^"]+)"/g))record(match[1],file);
 for(const match of text.matchAll(/srcset="([^"]+)"/g))for(const candidate of match[1].split(','))record(candidate.trim().split(/\s+/)[0],file);
 for(const match of text.matchAll(/url\((?:&quot;|["'])?([^\s)'"&]+)(?:&quot;|["'])?\)/g))record(match[1],file);
}
const manifest=JSON.parse(await readFile('src/media-manifest.json','utf8'));
for(const [source,entry] of Object.entries(manifest)){record(source,'media-manifest');for(const variant of entry.variants)record(variant.src,'media-manifest')}
const heroAssets=JSON.parse(await readFile('src/hero-assets.json','utf8'));
record(heroAssets.video,'HomeHero / illustrative video dialog');
record(heroAssets.poster,'HomeHero / illustrative video dialog');
const quote=value=>'"'+String(value).replaceAll('"','""')+'"';
const rows=['path,live_url,bytes,used_by'];
for(const [path,pages] of [...assets].sort(([a],[b])=>a.localeCompare(b))){
 const info=await stat('dist'+path).catch(()=>null);
 if(!info?.isFile()){missing.add(path);continue}
 if(!/\.(css|js|woff2?|ttf)$/.test(path))rows.push([path,'https://minhduc-prototype-sprint1.kenbinhoainam.chatgpt.site'+path,info.size,[...pages].join('; ')].map(quote).join(','));
}
if(missing.size)throw new Error('Missing local assets:\n'+[...missing].join('\n'));
const inventory=process.argv[2] || 'docs/flagship/media-current.csv';
await writeFile(inventory,rows.join('\n')+'\n');
console.log(`PASS local assets: ${assets.size} paths across ${files.filter(file=>file.endsWith('.html')).length} HTML files; no missing media/font/script/stylesheet. Inventory: ${inventory}`);
