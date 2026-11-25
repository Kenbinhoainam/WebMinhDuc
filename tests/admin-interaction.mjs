import {build} from 'esbuild';
import {mkdir,rm,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {JSDOM} from 'jsdom';
import assert from 'node:assert/strict';
const dir='.admin-test';
await mkdir(dir,{recursive:true});
try {
 await writeFile(`${dir}/entry.tsx`,"export {AdminDemo} from '../src/AdminDemo'; export {ContactForm} from '../src/Contact'; export {loadLocale} from '../src/i18n-runtime/catalog'; export {LocaleProvider} from '../src/i18n';");
 await build({entryPoints:[`${dir}/entry.tsx`],bundle:true,platform:'node',format:'esm',outfile:`${dir}/bundle.mjs`,packages:'external',loader:{'.css':'empty'},logLevel:'silent'});
 const dom=new JSDOM('<div id="root"></div>',{url:'https://example.test/admin-demo?type=F06',pretendToBeVisual:true});
 for(const k of ['window','document','navigator','HTMLElement','Element','Node','Event','MutationObserver','FormData','requestAnimationFrame','cancelAnimationFrame'])Object.defineProperty(globalThis,k,{value:dom.window[k],configurable:true});
 globalThis.IS_REACT_ACT_ENVIRONMENT=true;
 const React=await import('react');const {act}=React;const {createRoot}=await import('react-dom/client');const {MemoryRouter}=await import('react-router-dom');const {AdminDemo,ContactForm,LocaleProvider,loadLocale}=await import(pathToFileURL(`${process.cwd()}/${dir}/bundle.mjs`));
 await Promise.all(['vi','en','zh','ko','ja'].map(loadLocale));
 const root=createRoot(document.getElementById('root'));const render=(component,route='/')=>act(()=>root.render(React.createElement(MemoryRouter,{initialEntries:[route]},React.createElement(component))));
 await render(AdminDemo,'/admin-demo?type=F06');assert.match(document.body.textContent,/Học viên mẫu F/);assert.doesNotMatch(document.querySelector('tbody').textContent,/MD-001/);
 const click=async text=>{const btn=[...document.querySelectorAll('button')].find(x=>x.textContent.trim()===text);assert.ok(btn,text);await act(()=>btn.click())};
 await click('Xem →');assert.match(document.body.textContent,/MD-006/);assert.doesNotMatch(document.body.textContent,/không chặn xử lý/);
 const status=[...document.querySelectorAll('[role=dialog] select')][1];await act(()=>{status.value='Đã đóng';status.dispatchEvent(new Event('change',{bubbles:true}))});assert.equal(status.value,'Đã đóng');
 await act(()=>document.querySelector('[aria-label="Đóng cửa sổ"]').click());assert.equal(document.querySelector('[role=dialog]'),null);
 assert.equal(document.querySelector('.admin-top select'),null,'only one ADMIN role type');
 await act(()=>root.unmount());
 const formRoot=createRoot(document.getElementById('root'));await act(()=>formRoot.render(React.createElement(MemoryRouter,null,React.createElement(ContactForm))));
 await click('Liên hệ chung');await act(()=>document.querySelector('form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
 assert.equal(document.querySelector('[name=name]').getAttribute('aria-invalid'),'true');assert.equal(document.querySelector('[name=message]').required,false);
 const setInput=async (name,value)=>{const el=document.querySelector(`[name=${name}]`);const proto=el.tagName==='TEXTAREA'?dom.window.HTMLTextAreaElement.prototype:dom.window.HTMLInputElement.prototype;await act(()=>{Object.getOwnPropertyDescriptor(proto,'value').set.call(el,value);el.dispatchEvent(new Event('input',{bubbles:true}))})};
 await setInput('name','Demo');await setInput('phone','0912345678');await act(()=>document.querySelector('form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
 assert.match(document.body.textContent,/Đã hoàn tất gửi thử/);assert.match(document.querySelector('.form-success a').getAttribute('href'),/type=F02/);assert.doesNotMatch(document.querySelector('.form-success a').getAttribute('href'),/0912345678/);
 await act(()=>formRoot.unmount());
 const translations={en:'Please enter your name.',zh:'请输入姓名。',ko:'이름을 입력하세요.',ja:'お名前を入力してください。'};
 for(const [locale,expected] of Object.entries(translations)) {
  const localeRoot=createRoot(document.getElementById('root'));
  await act(()=>localeRoot.render(React.createElement(LocaleProvider,{value:locale},React.createElement(MemoryRouter,null,React.createElement(ContactForm)))));
  await act(()=>document.querySelector('form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
  assert.match(document.body.textContent,new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  assert.equal(document.querySelector('[name=name]').getAttribute('aria-invalid'),'true');assert.equal(document.querySelector('[name=company]').required,false);
  await act(()=>localeRoot.unmount());
 }
 dom.window.close();console.log('Admin and contact interaction checks passed in five locales');
} finally {await rm(dir,{recursive:true,force:true})}
