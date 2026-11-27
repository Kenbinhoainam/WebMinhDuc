import {build} from 'esbuild';
import {mkdtemp,rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';

const dir=await mkdtemp('.s2-b2b-');
try {
 await build({stdin:{contents:"export {ContactForm,ContactPage} from './src/Contact';export {ServicePage,ServicesPage,ServiceCustomers} from './src/pages/info/ServicesPages';export {services} from './src/pages/info/data';export {ServiceCards,serviceSlideDuration} from './src/ServiceShowcase';export {ContactContext} from './src/shared';export {LocaleProvider} from './src/i18n';export {loadLocale} from './src/i18n-runtime/catalog';export * from './src/demo-submissions';",resolveDir:process.cwd(),sourcefile:'s2-b2b-entry.tsx'},bundle:true,platform:'node',format:'esm',outfile:dir+'/bundle.mjs',packages:'external',loader:{'.css':'empty'},logLevel:'silent'});
 const dom=new JSDOM('<div id="root"></div>',{url:'https://fixture.invalid/',pretendToBeVisual:true});
 const w=dom.window;
 for(const name of ['window','document','navigator','Element','HTMLElement','Node','Event','MutationObserver','FormData','requestAnimationFrame','cancelAnimationFrame'])Object.defineProperty(globalThis,name,{value:w[name],configurable:true});
 globalThis.IS_REACT_ACT_ENVIRONMENT=true;
 w.matchMedia=()=>({matches:true,addEventListener(){},removeEventListener(){}});
 w.HTMLElement.prototype.scrollIntoView=()=>{};
 w.HTMLElement.prototype.scrollTo=function({left}){this.scrollLeft=left;};
 let requests=0;
 globalThis.fetch=()=>{requests++;throw new Error('Unexpected network request');};
 const React=await import('react');const {act}=React;
 const {createRoot}=await import('react-dom/client');
 const {MemoryRouter,Routes,Route}=await import('react-router-dom');
 const mod=await import(pathToFileURL(process.cwd()+'/'+dir+'/bundle.mjs').href);
 const root=createRoot(document.getElementById('root'));
 let renderId=0,selectedService;
 const render=async(Component,{locale='vi',path='/',pattern=path,props={}}={})=>{
  await mod.loadLocale(locale);
  await act(()=>root.render(React.createElement(mod.LocaleProvider,{value:locale},React.createElement(MemoryRouter,{key:++renderId,initialEntries:[path]},React.createElement(mod.ContactContext.Provider,{value:value=>{selectedService=value;}},React.createElement(Routes,null,React.createElement(Route,{path:pattern,element:React.createElement(Component,props)})))))));
 };
 const get=selector=>{const element=document.querySelector(selector);assert.ok(element,selector);return element;};
 const input=async(name,value)=>act(()=>{const field=get('[name="'+name+'"]');field.value=value;field.dispatchEvent(new Event('input',{bubbles:true}));field.dispatchEvent(new Event('change',{bubbles:true}));});
 const submit=async(repeat=1)=>{await act(()=>{const form=get('.contact-form');for(let i=0;i<repeat;i++)form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));});await act(()=>new Promise(resolve=>setTimeout(resolve,25)));};
 const click=async selector=>act(()=>get(selector).click());
 mod.resetDemoSubmissions();
 for(const locale of ['vi','en','zh','ko','ja']) {
  await render(mod.ContactForm,{locale,path:'/services/labor-leasing',props:{initialMode:'F01',lockMode:true,initialService:'Cho thuê lao động'}});
  assert.equal(document.querySelectorAll('[required]').length,4);
  assert.equal(document.querySelectorAll('.form-optional').length,6,'Six optional inputs; service remains preselected context');
  assert.equal(document.querySelectorAll('[aria-invalid=true]').length,0);
  assert.ok(document.getElementById(get('form').getAttribute('aria-describedby')));
  await input('name','Nguyễn Tên Mẫu');await input('phone','123');await input('email','bad');await input('quantity','0');
  assert.equal(document.querySelectorAll('[aria-invalid=true]').length,0,'No validation while entering a pristine form');
  await submit(3);
  assert.equal(document.activeElement,get('[name=phone]'));
  assert.equal(document.querySelectorAll('[aria-invalid=true]').length,5);
  assert.equal(get('[name=name]').value,'Nguyễn Tên Mẫu');
  const errorId=get('[name=phone]').getAttribute('aria-describedby');assert.ok(document.getElementById(errorId));
  await input('phone','091 234 5678');await input('email','');await input('quantity','');
  await submit();
  assert.equal(document.activeElement,get('[name=location]'));
  assert.equal(get('[name=phone]').getAttribute('aria-invalid'),'false');
  assert.equal(get('[name=email]').getAttribute('aria-invalid'),'false');
  assert.equal(get('[name=quantity]').getAttribute('aria-invalid'),'false');
  assert.equal(document.querySelectorAll('[aria-invalid=true]').length,2);
  await input('location','Bắc Ninh');await input('notes','Nhu cầu minh họa, không gửi thật.');
  const before=mod.getDemoSubmissions().length;await submit(3);
  const record=mod.getDemoSubmissions().at(-1);
  assert.equal(mod.getDemoSubmissions().length,before+1);
  assert.equal(record.type,'F01');assert.equal(record.source,'/services/labor-leasing');
  assert.equal(record.fields.service,'Cho thuê lao động');
  assert.equal(record.fields.email,'');assert.equal(record.fields.quantity,'');
  assert.equal(document.activeElement,get('.form-success h3'));
  assert.ok(get('.form-context').textContent.trim());
  assert.ok(get('.form-success a').getAttribute('href').endsWith('/admin-demo?type=F01&id='+record.id));
  await click('.form-success button');
  assert.equal(document.activeElement,get('[name=name]'));
  assert.equal(get('[name=name]').value,'');assert.equal(get('[name=service]').value,'Cho thuê lao động');
  assert.equal(document.querySelectorAll('[aria-invalid=true]').length,0);
  assert.equal(mod.getDemoSubmissions().length,before+1,'New attempt preserves the prior receipt');
 }
 await render(mod.ContactForm,{props:{initialMode:'F02',lockMode:true}});
 assert.equal(document.querySelectorAll('[required]').length,2);
 assert.equal(document.querySelectorAll('.form-optional').length,2);
 await input('name','Tên mẫu F02');await input('phone','+84 912 345 678');await submit(2);
 assert.equal(mod.getDemoSubmissions().at(-1).type,'F02');
 assert.equal(mod.getDemoSubmissions().at(-1).fields.message,'');

 for(const service of mod.services) {
  await render(mod.ServicePage,{path:'/services/'+service.slug,pattern:'/services/:slug'});
  assert.ok(get('h1').textContent.includes(service.title));
  assert.equal(document.querySelectorAll('.service-gallery-card').length,4);
  assert.equal(document.querySelector('.service-gallery-card a[href="/services/'+service.slug+'"]'),null);
  if(service.slug==='college-admissions') {
   assert.ok(get('.service-overview-actions a[href="/education?form=F05#dang-ky"]'));
   assert.ok(get('.service-overview-actions a[href="/education?form=F06#dang-ky"]'));
   assert.equal(document.querySelector('form.contact-form'),null);
  } else {
   await click('.service-overview-actions button');assert.equal(selectedService,service.title);
   assert.equal(get('[name=service]').value,service.title);
  }
  assert.equal(document.querySelectorAll('.info-service-customers').length,service.slug==='recruitment'?0:1);
  for(const region of document.querySelectorAll('.service-table-scroll')) {
   assert.equal(region.tabIndex,0);assert.ok(region.getAttribute('aria-label'));
   assert.ok(region.querySelector('caption'));assert.ok(region.querySelector('th[scope="col"]'));
  }
  const faq=get('.service-faq button');
  assert.equal(faq.getAttribute('aria-expanded'),'true');await act(()=>faq.click());
  assert.equal(faq.getAttribute('aria-expanded'),'false');
  const answer=document.getElementById(faq.getAttribute('aria-controls'));
  assert.equal(answer.getAttribute('aria-hidden'),'true');assert.ok(answer.hasAttribute('inert'));
  const faqButtons=[...document.querySelectorAll('.service-faq button')];
  await act(()=>{faqButtons[1].click();faqButtons[2].click();});
  assert.deepEqual(faqButtons.map(button=>button.getAttribute('aria-expanded')),['false','false','true']);
  assert.equal(document.querySelectorAll('.service-faq-answer:not([inert])').length,1);
  await act(()=>{faqButtons[2].click();faqButtons[2].click();});
  assert.equal(faqButtons[2].getAttribute('aria-expanded'),'true','A rapid reversal returns to the open state');
 }
 await render(mod.ServicesPage);
 assert.deepEqual([...document.querySelectorAll('.service-card-grid .service-gallery-card a')].map(a=>a.getAttribute('href')),mod.services.map(s=>'/services/'+s.slug));
 assert.ok(get('a[href="/jobs"]'));
 await render(mod.ServiceCards);
 const gallery=get('.service-gallery');let image=get('.service-card-photo');
 assert.ok(get('.service-gallery-toolbar .service-gallery-rotation'));
 await act(()=>image.dispatchEvent(new Event('error')));
 image=get('.service-card-photo');
 await act(()=>image.dispatchEvent(new Event('error')));
 assert.equal(image.hidden,true);assert.ok(get('.service-card-title').textContent);assert.ok(get('.service-gallery-card a').href);
 await act(()=>image.dispatchEvent(new Event('load')));assert.equal(image.hidden,false);
 await act(()=>{get('.service-gallery-rotation').click();get('.service-gallery-rotation').click();});
 assert.equal(gallery.dataset.userPaused,'false','Rapid double toggle follows both commands');
 gallery.style.setProperty('--motion-t2','0ms');assert.equal(mod.serviceSlideDuration(gallery),0);
 gallery.style.setProperty('--motion-t2','.18s');assert.equal(mod.serviceSlideDuration(gallery),180);
 assert.equal(requests,0);
 await act(()=>root.unmount());dom.window.close();
 console.log('PASS S2 B2B component harness: five-locale F01 validation/retry/context, optional F02, single receipts, five service routes/CTA contexts/FAQ/table semantics, image fallback, visible rail controls, rapid pause and zero-duration tokens. DOM simulation; no browser/device claim.');
} finally {await rm(dir,{recursive:true,force:true});}
