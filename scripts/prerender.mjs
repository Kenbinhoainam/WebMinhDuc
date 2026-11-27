import {readFile,writeFile,mkdir,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {adaptHostingPaths, base as hostingBase} from './hosting-profile.mjs';
import {pages,render,localizedSeo,locales,languageTags,localizedPath,loadLocale} from '../.ssr/entry-server.js';
await Promise.all(locales.map(loadLocale));
const template=await readFile('dist/index.html','utf8');
const manifest=JSON.parse(await readFile('dist/.vite/manifest.json','utf8'));
const styledRoutes=[
 [/^\/about-us$/,'src/pages/info/AboutPage.tsx'],
 [/^\/services(?:\/|$)/,'src/pages/info/ServicesPages.tsx'],
 [/^\/partners$/,'src/pages/info/PartnersPage.tsx'],
 [/^\/(?:news(?:\/|$)|events(?:\/|$)|privacy-policy$|terms-of-use$)/,'src/EditorialPages.tsx'],
 [/^\/(?:jobs(?:\/|$)|saved-jobs$|careers$)/,'src/JobsPages.tsx'],
 [/^\/education(?:\/|$)/,'src/Education.tsx'],
 [/^\/consultation$/,'src/Consultation.tsx'],
 [/^\/admin-demo$/,'src/AdminDemo.tsx'],
];
function routeStyles(path){
 const entry=styledRoutes.find(([pattern])=>pattern.test(path))?.[1];
 const seen=new Set(),styles=new Set();
 function visit(key){
  if(seen.has(key))return;
  seen.add(key);
  const chunk=manifest[key];
  if(!chunk)throw new Error(`Missing client manifest entry: ${key}`);
  for(const dependency of chunk.imports||[])visit(dependency);
  for(const css of chunk.css||[])styles.add(css);
 }
 if(entry)visit(entry);
 return styles;
}
const heroAssets=JSON.parse(adaptHostingPaths(await readFile('src/hero-assets.json','utf8')));
const posterPreload=`<link rel="preload" as="image" href="${heroAssets.poster}" fetchPriority="high"/>`;
const escape=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const sitemapUrls = [];
for(const page of pages) for(const locale of locales){
 const path=localizedPath(page.path,locale);
 const s=localizedSeo(page.path,locale); let html=template.replace(/<title>.*?<\/title>/,`<title>${escape(s.title)}</title>`);
 // Lazy route CSS must style prerendered content before JavaScript hydrates it.
 for(const css of routeStyles(page.path)) {
  const href=`${hostingBase}/${css}`;
  if(!html.includes(`href="${href}"`))html=html.replace('</head>',`<link rel="stylesheet" href="${escape(href)}"/>`+'</head>');
 }
 const set=(key,value)=>{html=html.replace(new RegExp(`(<meta (?:name|property)="${key}" content=")[^"]*("\\s*\\/?>)`),(_,a,b)=>a+escape(value)+b)};
 set('description',s.description);for(const [k,v] of Object.entries(s.socialTags))set(k,v);
 html=html.replace(/(<link rel="canonical" href=")[^"]*("\s*\/?>)/,(_,a,b)=>a+escape(s.url)+b).replace(/(<script type="application\/ld\+json" id="structured-data">).*?(<\/script>)/,(_,a,b)=>a+JSON.stringify(s.json).replaceAll('<','\\u003c')+b);
 html=html.replace('<html lang="vi">',`<html lang="${languageTags[locale]}">`);
 const alternates = s.alternates.map(({hrefLang, href}) =>
  `<link rel="alternate" hreflang="${hrefLang}" href="${escape(href)}"/>`
 ).join('');
 html=html.replace('</head>',alternates+'</head>');
 sitemapUrls.push(s.url);
 if(page.path==='/') html=html.replace('</head>',`<link rel="preload" as="image" href="${escape(heroAssets.poster)}" fetchpriority="high"/>`+'</head>');
 let body=await render(path);
 // React emits a matching image preload in the rendered root. Keep the earlier
 // head preload for discovery and remove only this redundant generated hint.
 if(page.path==='/') body=body.replace(posterPreload,'');
 // React 19 static prerender still emits a completed Suspense segment; inline it
 // to expose content without relying on the streaming replacement script.
 const segment=body.match(/<script>requestAnimationFrame[\s\S]*?<\/script><div hidden id="S:0">([\s\S]*)<\/div><script>\$RB=[\s\S]*?<\/script>$/);
 if(segment) body=body.replace(/<!--\$\?--><template id="B:0"><\/template>[\s\S]*?<!--\/\$-->/,`<!--$-->${segment[1]}<!--/$-->`).replace(segment[0],'');
 if(body.includes('Đang tải nội dung…')) throw new Error(`Unresolved Suspense boundary: ${page.path}`);
 html=html.replace('<div id="root"></div>',`<div id="root">${body}</div>`);
 const dir=join('dist',path);await mkdir(dir,{recursive:true});await writeFile(join(dir,'index.html'),html);
}
for(const locale of locales) {
 const base=locale==='vi'?'':`/${locale}`;
 // Old shared profile links also work when the browser has JavaScript disabled.
 const about=localizedSeo('/about-us',locale);
 const target=hostingBase+localizedPath('/about-us',locale)+'#profile';
 const redirectDir=join('dist',base+'/e-brochure');
 await mkdir(redirectDir,{recursive:true});
 await writeFile(join(redirectDir,'index.html'),`<!doctype html>
<html lang="${languageTags[locale]}"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="refresh" content="0;url=${escape(target)}">
<meta name="robots" content="noindex,nofollow">
<title>${escape(about.title)}</title><link rel="canonical" href="${escape(about.url)}">
</head><body><main><a href="${escape(target)}">${escape(about.title)}</a></main></body></html>`);

 for(const [alias,target] of [['/testimonials','/partners'],['/job-seekers','/jobs']]) {
  const dir=join('dist',base+alias);await mkdir(dir,{recursive:true});
  await writeFile(join(dir,'index.html'),await readFile(join('dist',base+target,'index.html')));
 }
}
await mkdir('dist/vi',{recursive:true});await writeFile('dist/vi/index.html',await readFile('dist/index.html'));
// Private prototype: do not advertise a sitemap in robots.txt or submit one.
await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemapUrls.map(url=>`<url><loc>${escape(url)}</loc></url>`).join('')}</urlset>\n`);
await rm('.ssr',{recursive:true,force:true});

if (!hostingBase) {
 for (const path of ['dist/404.html', 'dist/xem-hero/index.html']) {
  await writeFile(path, adaptHostingPaths(await readFile(path, 'utf8')));
 }
}
