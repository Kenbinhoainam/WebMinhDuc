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
 await click('Xem →');assert.match(document.body.textContent,/MD-005/);assert.match(document.body.textContent,/không chặn xử lý/);
 const status=[...document.querySelectorAll('[role=dialog] select')][1];await act(()=>{status.value='Đã đóng';status.dispatchEvent(new Event('change',{bubbles:true}))});assert.equal(status.value,'Đã đóng');
 await act(()=>document.querySelector('[aria-label="Đóng cửa sổ"]').click());assert.equal(document.querySelector('[role=dialog]'),null);
 const role=document.querySelector('.admin-top select');await act(()=>{role.value='Marketing mẫu';role.dispatchEvent(new Event('change',{bubbles:true}))});assert.match(document.body.textContent,/Hồ sơ không hiển thị/);assert.equal(document.querySelector('tbody'),null);
 await act(()=>root.unmount());
 const formRoot=createRoot(document.getElementById('root'));await act(()=>formRoot.render(React.createElement(MemoryRouter,null,React.createElement(ContactForm))));
 await click('Liên hệ chung · F02');await act(()=>document.querySelector('form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
 assert.equal(document.querySelector('[name=name]').getAttribute('aria-invalid'),'true');assert.match(document.body.textContent,/Vui lòng nhập nội dung liên hệ/);
 const setInput=async (name,value)=>{const el=document.querySelector(`[name=${name}]`);const proto=el.tagName==='TEXTAREA'?dom.window.HTMLTextAreaElement.prototype:dom.window.HTMLInputElement.prototype;await act(()=>{Object.getOwnPropertyDescriptor(proto,'value').set.call(el,value);el.dispatchEvent(new Event('input',{bubbles:true}))})};
 await setInput('name','Demo');await setInput('phone','0912345678');await setInput('message','Demo inquiry');await act(()=>document.querySelector('[name=consent]').click());await act(()=>document.querySelector('form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
 assert.match(document.body.textContent,/Đã hoàn tất gửi thử/);assert.match(document.querySelector('.form-success a').getAttribute('href'),/type=F02/);assert.doesNotMatch(document.querySelector('.form-success a').getAttribute('href'),/0912345678/);
 await act(()=>formRoot.unmount());
 const translations={en:'Please enter your company name.',zh:'请输入企业名称。',ko:'기업명을 입력하세요.',ja:'企業名を入力してください。'};
 for(const [locale,expected] of Object.entries(translations)) {
  const localeRoot=createRoot(document.getElementById('root'));
  await act(()=>localeRoot.render(React.createElement(LocaleProvider,{value:locale},React.createElement(MemoryRouter,null,React.createElement(ContactForm)))));
  await act(()=>document.querySelector('form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
  assert.match(document.body.textContent,new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  assert.equal(document.querySelector('[name=company]').getAttribute('aria-invalid'),'true');
  await act(()=>localeRoot.unmount());
 }
 dom.window.close();console.log('Admin and contact interaction checks passed in five locales');
} finally {await rm(dir,{recursive:true,force:true})}
