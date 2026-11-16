import {build} from 'esbuild';
import {mkdir,rm,readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import postcss from 'postcss';

// Independent structural/interaction checks; no computed-layout claim.
const folder='.sitemap-review';
await mkdir(folder,{recursive:true});
try {
 await build({stdin:{contents:"export {Header,PageTransition} from './src/App'; export {LocaleProvider,localeBase} from './src/i18n'; export {loadLocale} from './src/i18n-runtime/catalog';",resolveDir:process.cwd(),sourcefile:'sitemap-review.tsx'},bundle:true,platform:'node',format:'esm',packages:'external',loader:{'.css':'empty'},outfile:`${folder}/bundle.mjs`,logLevel:'silent'});
 const React=await import('react');const {act}=React;
 const {renderToStaticMarkup}=await import('react-dom/server');
 const {MemoryRouter,useNavigate}=await import('react-router-dom');
 const {createRoot}=await import('react-dom/client');
 const {Header,PageTransition,LocaleProvider,localeBase,loadLocale}=await import(pathToFileURL(`${process.cwd()}/${folder}/bundle.mjs`).href);
 let vietnameseLeaves;
 for(const locale of ['vi','en','zh','ko','ja']) {
  await loadLocale(locale);const base=localeBase(locale);
  const markup=renderToStaticMarkup(React.createElement(LocaleProvider,{value:locale},React.createElement(MemoryRouter,{basename:base||'/',initialEntries:[base||'/']},React.createElement(Header))));
  // Default JSDOM parses noscript with scripting disabled, exposing the fallback.
  const doc=new JSDOM(markup).window.document;
  const fallback=doc.querySelector('.no-script-nav');assert.ok(fallback);
  assert.equal(fallback.closest('.site-header'),null,'fallback must not be inside the absolute/fixed header');
  assert.match(doc.querySelector('noscript style')?.textContent||'',/\.site-header\s*\{[^}]*position:\s*(?:relative|static)\s*!important/,'no-JS header occupies normal flow');
  assert.equal(fallback.querySelectorAll(':scope > ul > li').length,7);
  assert.equal(fallback.querySelector('ul ul ul'),null,'exactly two menu levels');
  assert.equal(fallback.querySelectorAll('button,[hidden]').length,0,'fallback leaves have no JS disclosure dependency');
  const leaves=[...fallback.querySelectorAll(':scope > ul > li > ul > li > a')];assert.equal(leaves.length,19);
  const interactive=new JSDOM('<div id="root"></div>',{url:`https://example.test${base||'/'}`,pretendToBeVisual:true});
  for(const key of ['window','document','navigator','HTMLElement','Element','Node','Event','CustomEvent','MutationObserver','localStorage','requestAnimationFrame','cancelAnimationFrame'])Object.defineProperty(globalThis,key,{configurable:true,writable:true,value:interactive.window[key]});
  globalThis.IS_REACT_ACT_ENVIRONMENT=true;
  const interactiveRoot=createRoot(interactive.window.document.getElementById('root'));
  try {
   await act(()=>interactiveRoot.render(React.createElement(LocaleProvider,{value:locale},React.createElement(MemoryRouter,{basename:base||'/',initialEntries:[base||'/']},React.createElement(Header)))));
   assert.equal(interactive.window.document.querySelector('.desktop-nav'),null,'compact header has one drawer at every width');
   await act(()=>interactive.window.document.querySelector('.menu-button').click());
   const drawer=interactive.window.document.querySelector('.drawer-nav');assert.ok(drawer);
   assert.equal(drawer.querySelectorAll('.drawer-group').length,7);
   const drawerLeaves=[...drawer.querySelectorAll('.drawer-subnav a')];assert.equal(drawerLeaves.length,19);
   assert.deepEqual(drawerLeaves.map(a=>a.getAttribute('href')),leaves.map(a=>a.getAttribute('href')),'drawer and no-JS fallback have identical destinations');
   assert.deepEqual(drawerLeaves.map(a=>a.textContent.trim()),leaves.map(a=>a.textContent.trim()),'drawer and fallback labels agree');
  } finally {await act(()=>interactiveRoot.unmount());interactive.window.close();}
  assert.ok(leaves.every(a=>a.getAttribute('href').startsWith(`${base}/`)),'locale prefixes are preserved');
  const labels=leaves.map(a=>a.textContent.trim());
  if(locale==='vi')vietnameseLeaves=labels;
  else labels.forEach((label,index)=>assert.notEqual(label,vietnameseLeaves[index],`${locale}: untranslated leaf ${label}`));
  doc.defaultView.close();
 }
 const dom=new JSDOM('<div id="root"></div>',{url:'https://example.test/jobs',pretendToBeVisual:true});
 for(const key of ['window','document','navigator','HTMLElement','Element','Node','Event','requestAnimationFrame','cancelAnimationFrame'])Object.defineProperty(globalThis,key,{configurable:true,writable:true,value:dom.window[key]});
 globalThis.IS_REACT_ACT_ENVIRONMENT=true;
 let y=120,navigate;
 Object.defineProperty(window,'scrollY',{configurable:true,get:()=>y});
 window.scrollTo=options=>{y=options.top};
 window.HTMLElement.prototype.scrollIntoView=function(){if(this.id==='job-listings')y=640};
 function Harness(){navigate=useNavigate();return React.createElement(React.Fragment,null,React.createElement(PageTransition),React.createElement('div',{id:'job-listings'}))}
 const root=createRoot(document.getElementById('root'));
 const tick=()=>act(()=>new Promise(resolve=>setTimeout(resolve,45)));
 try {
  await act(()=>root.render(React.createElement(MemoryRouter,{initialEntries:['/jobs']},React.createElement(Harness))));await tick();
  window.dispatchEvent(new Event('scroll'));
  await act(()=>navigate('/jobs?skillLevel=first#job-listings'));await tick();assert.equal(y,640,'new same-path menu destination scrolls to anchor');
  y=900;window.dispatchEvent(new Event('scroll'));
  await act(()=>navigate(-1));await tick();assert.equal(y,120,'Back to same pathname without hash restores its saved position');
  await act(()=>navigate(1));await tick();assert.equal(y,900,'Forward restores the user position within a hashed entry');
  await act(()=>navigate('/jobs?skillLevel=second#job-listings'));await tick();assert.equal(y,640,'new filter destination still scrolls to its anchor');
 } finally {await act(()=>root.unmount());dom.window.close()}
 // Guard the concrete cascade regressions found during review, without treating
 // JSDOM as a rendering engine. A dark .75 glass surface over white has 7:1
 // white-text contrast; a .24 white hover layer reduced it to 3.91:1.
 for(const file of ['src/styles.css','src/sprint-navigation.css','src/locale-selector.css']) {
  const stylesheet=postcss.parse(await readFile(file,'utf8'));
  stylesheet.walkRules(rule=>{
   const selectors=rule.selectors||[];
   if(selectors.some(selector=>/^\.site-header\.is-scrolled\s+\.(?:header-search|header-saved|menu-button)(?:\s+svg)?$/.test(selector))) {
    rule.walkDecls(/^(?:background|background-color|color)$/,decl=>assert.doesNotMatch(decl.value,/^#(?:fff(?:fff)?|f2f2f2)$|^var\(--red\)$/i,`${file}: obsolete higher-specificity scrolled utility rule`));
   }
   if(selectors.includes('.site-header .header-search:hover')||selectors.includes('.site-header .language-trigger:hover')) {
    rule.walkDecls('background',decl=>{
     const whiteOverlay=/rgba\(255,\s*255,\s*255,\s*([.\d]+)\)/.exec(decl.value);
     if(whiteOverlay)assert.ok(Number(whiteOverlay[1])<=.17,`${file}: hover tint compromises white text on the white-page glass case`);
    });
   }
  });
 }
 console.log('PASS independent sitemap: two-level no-JS fallback, nineteen localized leaves in five languages, same-path Back/Forward scroll restoration, known glass CSS cascade/contrast regressions');
} finally {await rm(folder,{recursive:true,force:true})}
