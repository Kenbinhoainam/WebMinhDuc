import {readFile,writeFile,mkdir,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {pages,seo,render,localizedSeo,locales,languageTags,localizedPath,loadLocale} from '../.ssr/entry-server.js';
await Promise.all(locales.map(loadLocale));
const template=await readFile('dist/index.html','utf8');
const escape=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
for(const page of pages) for(const locale of locales){
 const path=localizedPath(page.path,locale);
 const s=localizedSeo(page.path,locale); let html=template.replace(/<title>.*?<\/title>/,`<title>${escape(s.title)}</title>`);
 const set=(key,value)=>{html=html.replace(new RegExp(`(<meta (?:name|property)="${key}" content=")[^"]*("\\s*\\/?>)`),(_,a,b)=>a+escape(value)+b)};
 set('description',s.description);for(const [k,v] of Object.entries({'og:title':s.title,'og:description':s.description,'og:url':s.url,'og:image':s.image,'twitter:title':s.title,'twitter:description':s.description,'twitter:image':s.image}))set(k,v);
 html=html.replace(/(<link rel="canonical" href=")[^"]*("\s*\/?>)/,(_,a,b)=>a+escape(s.url)+b).replace(/(<script type="application\/ld\+json" id="structured-data">).*?(<\/script>)/,(_,a,b)=>a+JSON.stringify(s.json).replaceAll('<','\\u003c')+b);
 html=html.replace('<html lang="vi">',`<html lang="${languageTags[locale]}">`);
 const alternates=locales.map(l=>`<link rel="alternate" hreflang="${languageTags[l]}" href="${escape(localizedSeo(page.path,l).url)}"/>`).join('');
 html=html.replace('</head>',alternates+`<link rel="alternate" hreflang="x-default" href="${escape(localizedSeo(page.path,'vi').url)}"/>`+'</head>');
 if(page.path==='/') html=html.replace('</head>','<link rel="preload" as="image" href="/optimized/assets/hero-poster-1600.webp" fetchpriority="high"/>'+'</head>');
 let body=await render(path);
 // React 19 static prerender still emits a completed Suspense segment; inline it
 // to expose content without relying on the streaming replacement script.
 const segment=body.match(/<script>requestAnimationFrame[\s\S]*?<\/script><div hidden id="S:0">([\s\S]*)<\/div><script>\$RB=[\s\S]*?<\/script>$/);
 if(segment) body=body.replace(/<!--\$\?--><template id="B:0"><\/template>[\s\S]*?<!--\/\$-->/,`<!--$-->${segment[1]}<!--/$-->`).replace(segment[0],'');
 if(body.includes('Đang tải nội dung…')) throw new Error(`Unresolved Suspense boundary: ${page.path}`);
 html=html.replace('<div id="root"></div>',`<div id="root">${body}</div>`);
 const dir=join('dist',path);await mkdir(dir,{recursive:true});await writeFile(join(dir,'index.html'),html);
}
for(const [alias,target] of [['/testimonials','/partners'],['/job-seekers','/jobs'],['/vi','/']]) {const dir=join('dist',alias);await mkdir(dir,{recursive:true});await writeFile(join(dir,'index.html'),await readFile(join('dist',target,'index.html')));}
// Private prototype: do not advertise a sitemap in robots.txt or submit one.
await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.flatMap(p=>locales.map(l=>`<url><loc>${escape(localizedSeo(p.path,l).url)}</loc></url>`)).join('')}</urlset>\n`);
await rm('.ssr',{recursive:true,force:true});
