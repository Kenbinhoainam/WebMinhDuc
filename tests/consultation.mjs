import {build} from 'esbuild';
import {mkdtemp, rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {JSDOM} from 'jsdom';
import assert from 'node:assert/strict';

const dir = await mkdtemp('.consultation-test-');
const originalDate = globalThis.Date;
const originalFetch = globalThis.fetch;
try {
  await build({
    stdin: {contents: "export {default as ConsultationPage} from './src/Consultation'; export {ContactPage,ContactForm} from './src/Contact'; export {getDemoSubmissions} from './src/demo-submissions';", resolveDir: process.cwd(), sourcefile: 'contact-entry.tsx'},
    bundle: true, platform: 'node', format: 'esm', outfile: dir + '/bundle.mjs', packages: 'external', loader: {'.css':'empty'}, logLevel:'silent',
  });
  const dom = new JSDOM('<div id="root"></div>', {url:'https://example.test/consultation', pretendToBeVisual:true});
  for (const key of ['window','document','navigator','HTMLElement','Element','Node','Event','MutationObserver','FormData','requestAnimationFrame','cancelAnimationFrame']) {
    Object.defineProperty(globalThis,key,{value:dom.window[key],configurable:true});
  }
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  let requests = 0;
  globalThis.fetch = () => {requests++; throw Error('Unexpected network request');};
  let clock = new originalDate(2030, 10, 24, 15);
  globalThis.Date = class extends originalDate {
    constructor(...args) {super(...(args.length ? args : [clock.getTime()]));}
    static now() {return clock.getTime();}
  };
  const React = await import('react');
  const {act} = React;
  const {createRoot} = await import('react-dom/client');
  const {MemoryRouter} = await import('react-router-dom');
  const {ConsultationPage,ContactPage,ContactForm,getDemoSubmissions} = await import(pathToFileURL(process.cwd() + '/' + dir + '/bundle.mjs'));
  const root = createRoot(document.getElementById('root'));
  const render = (Component, path) => act(() => root.render(React.createElement(MemoryRouter, {key:path,initialEntries:[path]},React.createElement(Component))));
  const get = selector => {const element = document.querySelector(selector); assert.ok(element,selector); return element;};
  const click = selector => act(() => get(selector).click());
  const waitForFocus = () => act(() => new Promise(resolve => setTimeout(resolve,25)));
  const write = (selector,value) => act(() => {
    const el = get(selector), proto = el.tagName === 'TEXTAREA' ? dom.window.HTMLTextAreaElement.prototype : dom.window.HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto,'value').set.call(el,value);
    el.dispatchEvent(new Event('input',{bubbles:true}));
    el.dispatchEvent(new Event('change',{bubbles:true}));
  });
  const submit = (repeat = 1) => act(() => {
    const form = get('.contact-form');
    for (let count = 0; count < repeat; count++) form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
  });

  await render(ConsultationPage,'/consultation');
  await click('.consultation-choose .btn');
  await waitForFocus();
  assert.match(get('[role=alert]').textContent,/ngày/);
  assert.equal(document.activeElement,get('#consultation-date'));
  await write('#consultation-date','2030-11-24');
  await click('.consultation-choose .btn');
  await waitForFocus();
  assert.match(get('[role=alert]').textContent,/giờ/);
  assert.equal(document.activeElement,get('[name=consultation-time]'));
  await click('[name=consultation-time][value="09:00"]');
  await click('.consultation-choose .btn');
  assert.equal(document.querySelector('.form-mode'),null,'scheduling locks F02');
  assert.equal(document.activeElement,get('.consultation-details h2'));
  await write('[name=name]','Ví dụ');
  await write('[name=phone]','0912345678');
  await write('[name=message]','Hỏi thông tin');
  await click('.consultation-summary button');
  assert.ok(get('.consultation-details').hidden);
  assert.equal(document.activeElement,get('#consultation-date'));
  await click('[name=consultation-time][value="10:30"]');
  await click('.consultation-choose .btn');
  assert.equal(get('[name=message]').value,'Hỏi thông tin');
  assert.match(get('.consultation-summary').textContent,/10:30/);
  clock = new originalDate(2030,10,25,0,1);
  await submit();
  await waitForFocus();
  assert.equal(getDemoSubmissions().length,0,'crossing midnight must not create a sample record');
  assert.equal(get('#consultation-date').min,'2030-11-25');
  assert.equal(document.activeElement,get('#consultation-date'));
  await write('#consultation-date','2030-11-25');
  await click('.consultation-choose .btn');
  assert.equal(get('[name=name]').value,'Ví dụ');
  await submit(2);
  const success = get('.consultation-success');
  assert.equal(document.activeElement,get('.consultation-success h2'));
  assert.match(success.textContent,/10:30/);
  assert.match(success.textContent,/Mã mô phỏng:\s*DEMO-\d+/);
  assert.match(success.textContent,/Không có lịch hẹn thực tế/);
  const rows = getDemoSubmissions();
  assert.equal(rows.length,1); assert.equal(rows[0].type,'F02'); assert.equal(rows[0].source,'/consultation');
  assert.equal(rows[0].fields.message,'Hỏi thông tin');
  await click('.consultation-success button');
  assert.equal(get('#consultation-date').value,'');
  assert.equal(document.activeElement,get('#consultation-date'));
  assert.equal(document.querySelector('.contact-form'),null);

  await render(ContactPage,'/contact#consultation');
  assert.equal(document.querySelectorAll('h1').length,1);
  assert.equal(get('.form-mode button:last-child').getAttribute('aria-pressed'),'true');
  assert.ok(get('#consultation').compareDocumentPosition(get('.contact-reference-info')) & Node.DOCUMENT_POSITION_FOLLOWING,'mobile reads form before other channels');
  await write('[name=message]','Nháp liên hệ');
  await click('.form-mode button:first-child');
  await waitForFocus();
  assert.equal(document.activeElement,get('#contact-form-heading'));
  assert.ok(get('[name=location]').required);
  await write('[name=location]','Bắc Ninh');
  await click('.form-mode button:last-child');
  assert.equal(get('[name=message]').value,'Nháp liên hệ');
  assert.equal(document.querySelector('[name=location]'),null);
  await click('.form-mode button:first-child');
  assert.equal(get('[name=location]').value,'Bắc Ninh');
  assert.equal(document.querySelectorAll('.contact-office').length,3);
  for (const id of ['consultation', 'contact-offices']) {
    const target = get('#' + id);
    assert.equal(target.tabIndex,-1);
    assert.ok(document.getElementById(target.getAttribute('aria-labelledby')));
  }

  const renderEmbedded = entryKey => act(() => root.render(React.createElement(MemoryRouter,{key:'embedded'},
    React.createElement(ContactForm,{initialService:'Cho thuê lao động', businessEntryKey:entryKey}))));
  await renderEmbedded(undefined);
  await write('[name=location]','Khu công nghiệp');
  const generalButton = get('.form-mode button:last-child');
  generalButton.focus();
  await act(() => generalButton.click());
  assert.equal(document.activeElement,generalButton,'embedded selector keeps keyboard focus when the form switches');
  assert.equal(generalButton.getAttribute('aria-pressed'),'true');
  await write('[name=message]','Câu hỏi đang soạn');
  await renderEmbedded('staffing-cta-one');
  assert.equal(get('[name=service]').value,'Cho thuê lao động');
  assert.equal(get('[name=location]').value,'Khu công nghiệp','workforce entry restores unsent F01');
  await click('.form-mode button:last-child');
  assert.equal(get('[name=message]').value,'Câu hỏi đang soạn','workforce entry preserves the other draft');
  await renderEmbedded(undefined);
  assert.equal(get('.form-mode button:last-child').getAttribute('aria-pressed'),'true','unrelated navigation preserves local mode');
  assert.equal(requests,0);
  await act(() => root.unmount());
  dom.window.close();
  console.log('PASS contact entry points, separate drafts, local date rollover, locked F02, focus and single local receipt');
} finally {
  globalThis.Date = originalDate;
  globalThis.fetch = originalFetch;
  await rm(dir,{recursive:true,force:true});
}
