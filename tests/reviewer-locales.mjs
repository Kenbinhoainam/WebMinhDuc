import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {mkdir,rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
const temp='.reviewer-locales';await mkdir(temp,{recursive:true});
await build({stdin:{contents:`export {default as App} from './src/App'; export {loadLocale} from './src/i18n-runtime/catalog'; export {LocaleProvider} from './src/i18n';`,resolveDir:process.cwd(),sourcefile:'reviewer-locales.tsx'},bundle:true,format:'esm',platform:'node',packages:'external',outfile:`${temp}/bundle.mjs`,loader:{'.css':'empty'},logLevel:'silent'});
const dom=new JSDOM('<div id="root"></div>',{url:'http://localhost/',pretendToBeVisual:true});
for(const key of ['window','document','navigator','HTMLElement','Element','Node','Event','MutationObserver','localStorage','location','requestAnimationFrame','cancelAnimationFrame','File','FormData'])Object.defineProperty(globalThis,key,{configurable:true,writable:true,value:dom.window[key]});
window.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});window.scrollTo=()=>{};window.HTMLElement.prototype.scrollIntoView=()=>{};window.HTMLMediaElement.prototype.play=()=>Promise.resolve();window.HTMLMediaElement.prototype.pause=()=>{};
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
const React=await import('react'),{act}=React,{createRoot}=await import('react-dom/client'),{MemoryRouter}=await import('react-router-dom');
const {App,LocaleProvider,loadLocale}=await import(pathToFileURL(`${process.cwd()}/${temp}/bundle.mjs`).href);await Promise.all(['vi','en','zh','ko','ja'].map(loadLocale));const root=createRoot(document.getElementById('root'));let key=0;
const errors=[],original=console.error;console.error=(...args)=>errors.push(args.map(String).join(' '));
const findings=new Map();
const vietnamese=/[ăâđêôơưĂÂĐÊÔƠƯ]|[àảãạấầẩẫậắằẳẵặèẻẽẹếềểễệìỉĩịòỏõọốồổỗộớờởỡợùủũụứừửữựỳỷỹỵ]/u;
const known=/^(Minh Đức(?: Vina)?|MINH ĐỨC|Vôi|Bắc Giang|Bắc Ninh|Quảng Ninh|Thái Nguyên|Hà Nội|KCN (?:Tân Hưng|Yên Phong|Đông Mai|Sông Công)|Tiếng Việt|MINH ĐỨC •|© \d{4} Minh Đức Vina\.)$/;
function record(value,where){const text=value.replace(/\s+/g,' ').trim();if(vietnamese.test(text)&&!known.test(text)){const previous=findings.get(text);if(previous)previous.count++;else findings.set(text,{text,where,count:1});}}
function inspect(where){const walker=document.createTreeWalker(document.body,window.NodeFilter.SHOW_TEXT);for(let node;node=walker.nextNode();)if(!['SCRIPT','STYLE'].includes(node.parentElement?.tagName||''))record(node.textContent,where);for(const el of document.querySelectorAll('[aria-label],[placeholder],[title],[alt]'))for(const attr of ['aria-label','placeholder','title','alt'])record(el.getAttribute(attr)||'',where);}
async function render(path,locale){const prefix=locale==='vi'?'':`/${locale}`;await act(async()=>{root.render(React.createElement(LocaleProvider,{value:locale},React.createElement(MemoryRouter,{basename:prefix,initialEntries:[prefix+path],key:++key},React.createElement(App))));await new Promise(resolve=>setTimeout(resolve,50));});await act(async()=>{await new Promise(resolve=>setTimeout(resolve,20));});}
async function click(el){assert.ok(el);await act(async()=>el.dispatchEvent(new window.MouseEvent('click',{bubbles:true})));}
try{
 for(const locale of ['vi','en','zh','ko','ja']){
  for(const path of ['/','/contact','/education','/services','/jobs','/admin-demo']){await render(path,locale);assert.equal(document.querySelectorAll('main').length,1,`${locale}${path}: main landmark`);assert.equal(document.querySelectorAll('h1').length,1,`${locale}${path}: h1`);if(locale!=='vi')inspect(`${locale}${path}`);
   if(path==='/contact'){await click(document.querySelectorAll('.form-mode button')[0]);await act(async()=>document.querySelector('.contact-form').dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true})));assert.equal(document.querySelector('.form-success'),null);if(locale!=='vi')inspect(`${locale}:F01-errors`);await click([...document.querySelectorAll('.form-mode button')][1]);await act(async()=>document.querySelector('.contact-form').dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true})));if(locale!=='vi')inspect(`${locale}:F02-errors`);}
   if(path==='/education'){await click(document.querySelectorAll('.education-form-tabs button')[1]);assert.ok(document.querySelector('[name=document]'));assert.equal(document.querySelector('[name=document]').required,false,'F06 upload is optional');const input=document.querySelector('[name=document]');Object.defineProperty(input,'files',{configurable:true,value:[new window.File(['x'],'bad.exe',{type:'application/octet-stream'})]});await act(async()=>input.dispatchEvent(new window.Event('change',{bubbles:true})));assert.equal(input.getAttribute('aria-invalid'),'true');assert.ok(document.querySelector('#education-document-error'));if(locale!=='vi')inspect(`${locale}:F06`);}
  }
  await render('/jobs/chuyen-vien-tuyen-dung-bac-ninh',locale);await click(document.querySelector('.job-apply-button'));await act(async()=>document.querySelector('.application-form').dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true})));assert.equal(document.querySelector('[name=cv]').required,false,'F04 CV is optional');assert.ok(document.querySelector('#apply-name-error'));assert.ok(document.querySelector('#apply-phone-error'));if(locale!=='vi')inspect(`${locale}:F04-errors`);await act(async()=>document.dispatchEvent(new window.KeyboardEvent('keydown',{key:'Escape',bubbles:true})));
  await render('/jobs/cong-nhan-lap-rap-bac-ninh',locale);await click(document.querySelector('.job-apply-button'));assert.equal(document.querySelector('[name=cv]'),null,'F03 has no file field');await act(async()=>document.dispatchEvent(new window.KeyboardEvent('keydown',{key:'Escape',bubbles:true})));
 }
 assert.equal(errors.length,0,errors.join('\n'));console.log('PASS reviewer multilingual DOM: 40 routes/states plus F01/F02/F04 errors, F03 no upload and F06 optional upload in five locales');console.log(JSON.stringify([...findings.values()],null,2));
}finally{console.error=original;await act(async()=>root.unmount());dom.window.close();await rm(temp,{recursive:true,force:true});}
