import assert from 'node:assert/strict';
import {mkdtemp, readFile, rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';

const temp = await mkdtemp('.s2-shared-');
try {
  const bundle = temp + '/shared.mjs';
  await build({
    stdin: {contents: `
      export {Header} from './src/Header';
      export {Modal} from './src/shared';
      export {startReveals, AnimatedNumber} from './src/motion';
      export {LocaleProvider, languageTags} from './src/i18n';
      export {slideRailTo} from './src/useHomeCarousel';
      export {loadLocale} from './src/i18n-runtime/catalog';
    `, sourcefile:'s2-shared.tsx', resolveDir:process.cwd()},
    bundle:true, platform:'node', packages:'external', format:'esm', outfile:bundle, loader:{'.css':'empty'}
  });
  const dom = new JSDOM('<main id="root" tabindex="-1"></main>',{url:'https://example.test/',pretendToBeVisual:true});
  for (const key of ['window','document','navigator','HTMLElement','Element','Node','Event','CustomEvent','MutationObserver','KeyboardEvent','localStorage','requestAnimationFrame','cancelAnimationFrame']) {
    Object.defineProperty(globalThis,key,{value:dom.window[key],configurable:true});
  }
  const visibleRect = {x:0,y:0,width:40,height:40};
  // JSDOM supplies no layout. This fixture selects the keyboard path by hiding inert/hidden controls.
  window.HTMLElement.prototype.getClientRects = function() {return this.closest('[inert],[hidden]') ? [] : [visibleRect];};
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  window.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
  const React=await import('react');
  const {act,createElement:h}=React;
  const {createRoot}=await import('react-dom/client');
  const {renderToStaticMarkup}=await import('react-dom/server');
  const {MemoryRouter}=await import('react-router-dom');
  const {Header, Modal, LocaleProvider, languageTags, loadLocale, AnimatedNumber, startReveals, slideRailTo}=await import(pathToFileURL(process.cwd()+'/'+bundle).href);
  const root=createRoot(document.getElementById('root'));
  const q=selector=>document.querySelector(selector);
  const press=(target,key,options={})=>act(()=>target.dispatchEvent(new KeyboardEvent('keydown',{key,bubbles:true,cancelable:true,...options})));
  const click=target=>act(()=>target.click());
  const pointer=(target,type)=>act(()=>target.dispatchEvent(new Event(type,{bubbles:true})));
  for (const locale of Object.keys(languageTags)) {
    await loadLocale(locale);
    await act(()=>root.render(h(LocaleProvider,{value:locale},h(MemoryRouter,{key:locale},h(Header)))));
    const menu=q('.menu-button');
    await act(()=>menu.focus()); await click(menu);
    let panel=q('.navigation-panel');
    assert.equal(document.activeElement,panel);
    const [first,second]=panel.querySelectorAll('.drawer-group-heading button');
    const openName=second.getAttribute('aria-label');
    await click(first);await click(first);await click(first);await click(second);
    const closeAction={vi:'Đóng menu',en:'Close menu',zh:'关闭菜单',ko:'메뉴 닫기',ja:'メニューを閉じる'}[locale];
    assert.ok(second.getAttribute('aria-label').startsWith(closeAction+': '));
    await press(second,'Escape',{isComposing:true});
    assert.equal(second.getAttribute('aria-expanded'),'true','IME cancellation does not collapse the group');
    const secondPanel=document.getElementById(second.getAttribute('aria-controls'));
    assert.equal(panel.querySelectorAll('.drawer-subnav:not([inert])').length,1);
    assert.equal(secondPanel.getAttribute('aria-hidden'),'false');
    assert.equal(first.getAttribute('aria-expanded'),'false');
    const child=secondPanel.querySelector('a');
    await act(()=>child.focus());await press(child,'Escape');
    assert.equal(secondPanel.hasAttribute('inert'),true);
    assert.equal(second.getAttribute('aria-label'),openName);
    assert.equal(document.activeElement,second);
    assert.equal(q('.navigation-panel'),panel);
    await press(second,'Escape');assert.equal(q('[role=dialog]'),null);assert.equal(document.activeElement,menu);
    await click(q('.header-search'));
    const input=q('.site-search input');
    const inputValue=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;
    await act(()=>{inputValue.call(input,'Minh');input.dispatchEvent(new Event('input',{bubbles:true}));});
    const clear=q('.site-search button');
    assert.ok(clear);
    await act(()=>clear.focus());await click(clear);
    assert.equal(input.value,'');assert.equal(document.activeElement,input,'clear returns typing focus before its button disappears');
    await press(input,'Escape');
    const formatted=renderToStaticMarkup(h(LocaleProvider,{value:locale},h(AnimatedNumber,{value:1200,suffix:'+'})));
    assert.ok(formatted.includes(new Intl.NumberFormat(languageTags[locale]).format(1200)+'+'));
  }
  console.log('PASS S2-DRAWER all 5 locales; open/close/open/switch, inert and expanded, Escape from child then drawer restores both triggers');
  console.log('PASS S2-SEARCH clear query restores input focus, five locales; drawer open/close labels match state and IME Escape stays local');
  console.log('PASS S2-NUMBER all 5 locales; visible and accessible final value formatter keeps quantity and suffix');
  let dropTrigger;
  function Harness() {
    const [open,setOpen]=React.useState(false), [removed,setRemoved]=React.useState(false);
    dropTrigger=()=>setRemoved(true);
    return h(React.Fragment,null,!removed && h('button',{id:'open',onClick:()=>setOpen(true)},'Open demo'),
      open && h(Modal,{title:'Demo',onClose:()=>setOpen(false)},h('button',{id:'action'},'Action')));
  }
  await act(()=>root.render(h(Harness)));
  const open=q('#open');await act(()=>open.focus());await click(open);
  const dialog=q('[role=dialog]'), close=dialog.querySelector('button'), action=q('#action'), backdrop=q('.modal-backdrop');
  assert.ok(q('#root').hasAttribute('inert'));assert.equal(document.body.style.overflow,'hidden');
  await press(dialog,'Tab');assert.equal(document.activeElement,close);
  await press(close,'Tab',{shiftKey:true});assert.equal(document.activeElement,action);
  await press(action,'Tab');assert.equal(document.activeElement,close);
  await press(action,'Escape',{isComposing:true});assert.equal(q('[role=dialog]'),dialog,'IME Escape belongs to candidate selection');
  await pointer(backdrop,'pointerdown');await pointer(backdrop,'pointercancel');await click(backdrop);
  assert.equal(q('[role=dialog]'),dialog,'canceled gesture must not dismiss');
  await pointer(action,'pointerdown');await click(backdrop);assert.equal(q('[role=dialog]'),dialog);
  await press(close,'Escape');assert.equal(q('[role=dialog]'),null);assert.equal(document.activeElement,open);
  await click(open);await act(()=>dropTrigger());await click(q('.modal-heading button'));
  assert.equal(q('[role=dialog]'),null);assert.equal(document.activeElement,q('main'));assert.equal(document.body.style.overflow,'');
  assert.ok(!q('#root').hasAttribute('inert'));
  console.log('PASS S2-MODAL Tab/Shift+Tab and immediate Escape/close restoration, removed trigger fallback, IME Escape, canceled/drag-out backdrop gesture, no transition completion event');
  const rail=document.createElement('div');document.body.append(rail);rail.style.scrollSnapType='x mandatory';
  slideRailTo(rail,120,0);assert.equal(rail.scrollLeft,120);assert.equal(rail.style.scrollSnapType,'x mandatory');
  window.matchMedia=()=>({matches:true});slideRailTo(rail,220,240);assert.equal(rail.scrollLeft,220);
  globalThis.IntersectionObserver=class {};
  window.matchMedia=()=>{throw Error('preference unavailable')};
  const fixture=document.createElement('div');fixture.dataset.reveal='up';document.body.append(fixture);
  const restore=startReveals();assert.ok(!fixture.classList.contains('motion-pending'));restore();
  console.log('PASS S2-FALLBACK zero-duration & reduced motion land at requested rail offset, missing preference API leaves content visible');
  const css=await readFile('src/brand-colors.css','utf8');
  for(const [index,ms] of [0,120,180,240,320].entries()) assert.ok(css.includes(`--motion-t${index}: ${ms}ms;`));
  assert.match(css,/--motion-ease: ease-out;/);assert.match(css,/prefers-reduced-motion: reduce/);
  console.log('PASS S2-TOKENS T0–T4 and ease-out roles match selected values');
  await act(()=>root.unmount());dom.window.close();
} finally {await rm(temp,{recursive:true,force:true});}
