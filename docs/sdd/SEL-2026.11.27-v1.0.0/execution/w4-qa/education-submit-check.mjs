import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import React from 'react';
import {build} from 'esbuild';
import {MemoryRouter} from 'react-router-dom';
import {JSDOM} from 'jsdom';

const dir = await mkdtemp('.s2-form-evidence-');
try {
  await build({stdin:{contents:"export {EducationPage} from './src/Education'; export {getDemoSubmissions,resetDemoSubmissions} from './src/demo-submissions';",
    resolveDir:process.cwd(),sourcefile:'education-submit-check.tsx'},bundle:true,platform:'node',format:'esm',packages:'external',
    loader:{'.css':'empty'},outfile:dir+'/entry.mjs',logLevel:'silent'});
  const {EducationPage,getDemoSubmissions,resetDemoSubmissions} = await import(pathToFileURL(process.cwd()+'/'+dir+'/entry.mjs').href);
  const dom = new JSDOM('<div id="root"></div>',{pretendToBeVisual:true,url:'https://example.test'});
  for (const key of ['window','document','navigator','HTMLElement','Element','Node','Event','File','FormData','MutationObserver','requestAnimationFrame','cancelAnimationFrame']) {
    Object.defineProperty(globalThis,key,{value:dom.window[key],configurable:true,writable:true});
  }
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  window.matchMedia = () => ({matches:true,addEventListener(){},removeEventListener(){}});
  const {createRoot} = await import('react-dom/client');
  const root = createRoot(document.getElementById('root'));
  const {act,createElement:h} = React;
  const field = name => document.querySelector('[name="'+name+'"]');
  const set = (name,value) => {
    const input = field(name);
    Object.getOwnPropertyDescriptor(Object.getPrototypeOf(input),'value').set.call(input,value);
    input.dispatchEvent(new Event('input',{bubbles:true}));
    input.dispatchEvent(new Event('change',{bubbles:true}));
  };
  const submit = form => form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
  for (const mode of ['F05','F06']) {
    resetDemoSubmissions();
    await act(() => root.render(h(MemoryRouter,{key:mode,initialEntries:['/education?form='+mode+'#dang-ky']},h(EducationPage))));
    const form = document.querySelector('.education-form-card form');
    const name = field('name'), phone = field('phone');
    await act(() => set('phone','abc'));
    assert.equal(phone.getAttribute('aria-invalid'),'false',mode+' submit-only initial validation');
    if (mode === 'F06') {
      for (const key of ['email','document']) {
        assert.equal(field(key).required,false);
        assert.match([...field(key).labels].map(label=>label.textContent).join(' '),/không bắt buộc/);
      }
    } else {
      assert.ok(field('question'));
      assert.equal(field('email'),null);
      assert.equal(field('document'),null);
    }
    await act(() => submit(form));
    await act(() => new Promise(resolve=>requestAnimationFrame(resolve)));
    assert.equal(document.activeElement,name,mode+' first invalid focus');
    assert.equal(phone.getAttribute('aria-invalid'),'true');
    await act(() => { set('name','Fixture'); set('phone','0912345678'); });
    assert.equal(phone.getAttribute('aria-invalid'),'false');
    await act(() => { submit(form); submit(form); });
    assert.equal(getDemoSubmissions().length,1,mode+' one receipt on two submit events');
    const receipt = document.querySelector('.education-success');
    assert.equal(document.activeElement,receipt.querySelector('h3'));
    assert.match(receipt.querySelector('a').getAttribute('href'),new RegExp('type='+mode));
    await act(() => receipt.querySelector('.education-again').click());
    assert.equal(document.activeElement,field('name'));
    assert.equal(field('name').value,'');
    assert.equal(getDemoSubmissions().length,1);
    await act(() => { set('name','Second Fixture'); set('phone','0912345678'); submit(document.querySelector('.education-form-card form')); });
    assert.equal(getDemoSubmissions().length,2,mode+' explicit retry remains usable');
  }
  await act(() => root.unmount());
  dom.window.close();
  console.log('PASS F05/F06 submit-only text validation, optional labels, first error focus, double-submit guard, receipt focus/type and explicit retry.');
} finally {
  await rm(dir,{recursive:true,force:true});
}
