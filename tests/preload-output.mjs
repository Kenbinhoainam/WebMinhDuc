import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const {poster:posterUrl}=JSON.parse(await readFile('src/hero-assets.json','utf8'));
const escapedPoster=posterUrl.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
for (const locale of ['', '/en', '/zh', '/ko', '/ja']) {
 const html=await readFile(`dist${locale}/index.html`,'utf8');
 const head=html.split('</head>')[0];
 const poster=new RegExp(`<link\\b(?=[^>]*\\brel="preload")(?=[^>]*\\bhref="${escapedPoster}")[^>]*>`,'gi');
 assert.equal([...html.matchAll(poster)].length,1,`${locale||'/'}: exactly one poster preload`);
 assert.equal([...head.matchAll(poster)].length,1,`${locale||'/'}: poster preload in head`);
 assert.match(head.match(poster)[0],/fetchpriority="high"/i,`${locale||'/'}: poster priority`);
 for(const n of [1,2,3,4])assert.doesNotMatch(html,new RegExp(`<link\\b(?=[^>]*\\brel="preload")(?=[^>]*\\bhref="[^"]*edge-${n}(?:-no-noise)?\\.png")[^>]*>`,'i'),`${locale||'/'}: decorative edge ${n} not preloaded`);
}
console.log('PASS homepage preload output');
const manifest=JSON.parse(await readFile('dist/.vite/manifest.json','utf8'));
for(const [entry,routes] of [
 ['src/pages/info/AboutPage.tsx',['/about-us']],
 ['src/pages/info/ServicesPages.tsx',['/services','/services/labor-supply','/services/recruitment','/services/hr-consulting']],
 ['src/pages/info/PartnersPage.tsx',['/partners']],
 ['src/pages/info/BrochurePage.tsx',['/e-brochure']],
 ['src/EditorialPages.tsx',['/news','/news/ho-so-xin-viec','/events','/events/ngay-hoi-ket-noi-viec-lam','/privacy-policy','/terms-of-use']],
 ['src/JobsPages.tsx',['/careers','/jobs','/saved-jobs','/jobs/cong-nhan-lap-rap-bac-ninh']],
 ['src/Consultation.tsx',['/consultation']],
 ['src/Education.tsx',['/education','/education/tu-xa-quan-tri']],
 ['src/AdminDemo.tsx',['/admin-demo']],
]) {
 const css=manifest[entry]?.css;
 assert.ok(css?.length,`${entry}: route CSS emitted`);
 for(const locale of ['', '/en', '/zh', '/ko', '/ja'])for(const route of routes){
  const head=(await readFile(`dist${locale}${route}/index.html`,'utf8')).split('</head>')[0];
  for(const asset of css)assert.ok(head.includes(`<link rel="stylesheet" href="/${asset}"/>`),`${locale}${route}: stylesheet available before hydration`);
 }
}
console.log('PASS lazy route styles in prerendered head across five locales');
