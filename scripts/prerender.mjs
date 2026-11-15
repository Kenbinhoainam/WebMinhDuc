import {readFile,writeFile,mkdir,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {pages,seo,render} from '../.ssr/entry-server.js';
const template=await readFile('dist/index.html','utf8');
const escape=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
for(const page of pages){
 const s=seo(page.path); let html=template.replace(/<title>.*?<\/title>/,`<title>${escape(s.title)}</title>`);
 const set=(key,value)=>{html=html.replace(new RegExp(`(<meta (?:name|property)="${key}" content=")[^"]*("\\s*\\/?>)`),(_,a,b)=>a+escape(value)+b)};
 set('description',s.description);for(const [k,v] of Object.entries({'og:title':s.title,'og:description':s.description,'og:url':s.url,'og:image':s.image,'twitter:title':s.title,'twitter:description':s.description,'twitter:image':s.image}))set(k,v);
 html=html.replace(/(<link rel="canonical" href=")[^"]*("\s*\/?>)/,(_,a,b)=>a+escape(s.url)+b).replace(/(<script type="application\/ld\+json" id="structured-data">).*?(<\/script>)/,(_,a,b)=>a+JSON.stringify(s.json).replaceAll('<','\\u003c')+b);
 let body=await render(page.path);
 // React 19 static prerender still emits a completed Suspense segment; inline it
 // to expose content without relying on the streaming replacement script.
 const segment=body.match(/<script>requestAnimationFrame[\s\S]*?<\/script><div hidden id="S:0">([\s\S]*)<\/div><script>\$RB=[\s\S]*?<\/script>$/);
 if(segment) body=body.replace(/<!--\$\?--><template id="B:0"><\/template>[\s\S]*?<!--\/\$-->/,`<!--$-->${segment[1]}<!--/$-->`).replace(segment[0],'');
 if(body.includes('Đang tải nội dung…')) throw new Error(`Unresolved Suspense boundary: ${page.path}`);
 html=html.replace('<div id="root"></div>',`<div id="root">${body}</div>`);
 const dir=join('dist',page.path);await mkdir(dir,{recursive:true});await writeFile(join(dir,'index.html'),html);
}
for(const [alias,target] of [['/testimonials','/partners'],['/job-seekers','/jobs'],['/vi','/']]) {const dir=join('dist',alias);await mkdir(dir,{recursive:true});await writeFile(join(dir,'index.html'),await readFile(join('dist',target,'index.html')));}
// Private prototype: do not advertise a sitemap in robots.txt or submit one.
await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(p=>`<url><loc>${escape(seo(p.path).url)}</loc></url>`).join('')}</urlset>\n`);
await rm('.ssr',{recursive:true,force:true});
