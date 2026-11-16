import {build} from 'esbuild';
import {mkdir,rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';

const temp='.header-hover-review';await mkdir(temp,{recursive:true});
try {
 await build({entryPoints:['src/Header.tsx'],bundle:true,platform:'node',format:'esm',packages:'external',loader:{'.css':'empty'},outfile:`${temp}/bundle.mjs`,logLevel:'silent'});
 const dom=new JSDOM('<div id="root"></div><button id="outside">Outside</button>',{url:'https://example.test/about-us',pretendToBeVisual:true});
 for(const key of ['window','document','navigator','HTMLElement','Element','Node','Event','CustomEvent','KeyboardEvent','localStorage','requestAnimationFrame','cancelAnimationFrame'])Object.defineProperty(globalThis,key,{configurable:true,writable:true,value:dom.window[key]});
 globalThis.IS_REACT_ACT_ENVIRONMENT=true;
 window.matchMedia=()=>({matches:true,addEventListener(){},removeEventListener(){}});
 const React=await import('react');const {act}=React;const {createRoot}=await import('react-dom/client');const {MemoryRouter}=await import('react-router-dom');
 const {Header}=await import(pathToFileURL(`${process.cwd()}/${temp}/bundle.mjs`).href);
 const root=createRoot(document.getElementById('root'));let generation=0;
 const render=async()=>{await act(()=>root.render(React.createElement(MemoryRouter,{key:++generation,initialEntries:['/about-us']},React.createElement(Header))));return [...document.querySelectorAll('.desktop-nav-group')]};
 const pointer=(target,type,related=null)=>act(()=>{const event=new window.MouseEvent(type,{bubbles:true,relatedTarget:related});Object.defineProperty(event,'pointerType',{value:'mouse'});target.dispatchEvent(event)});
 const wait=()=>act(()=>new Promise(resolve=>setTimeout(resolve,140)));
 const escape=()=>act(()=>document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true})));
 const panel=group=>group.querySelector('.desktop-subnav');
 const click=target=>act(()=>target.click());
 try {
  let groups=await render();
  await pointer(groups[1],'pointerover');await escape();await wait();
  assert.equal(panel(groups[1]).hidden,true,'Escape must cancel a pending hover before any menu opens');
  await pointer(groups[1],'pointerover');await wait();assert.equal(panel(groups[1]).hidden,true,'Escape suppression persists until pointer exit');
  await pointer(groups[1],'pointerout',document.getElementById('outside'));await pointer(groups[1],'pointerover');await wait();
  assert.equal(panel(groups[1]).hidden,false,'pointer reentry permits opening again');

  groups=await render();await pointer(groups[1],'pointerover');await click(groups[1].querySelector('.desktop-nav-heading>a'));await wait();
  assert.equal(panel(groups[1]).hidden,true,'same-route destination click must cancel pending hover');

  groups=await render();const trigger=groups[1].querySelector('button');await act(()=>trigger.focus());await click(trigger);
  await pointer(groups[2],'pointerover');await wait();
  assert.equal(panel(groups[2]).hidden,false,'focus on an already-visible parent trigger must not prevent switching hover groups');
  assert.equal(panel(groups[1]).hidden,true);assert.ok(document.activeElement===trigger,'hover must not steal focus');
  const submenuLink=panel(groups[2]).querySelector('a');await act(()=>submenuLink.focus());
  await pointer(groups[1],'pointerover');await wait();
  assert.equal(panel(groups[2]).hidden,false,'hover must not hide the currently focused submenu');assert.ok(document.activeElement===submenuLink);
  console.log('PASS independent hover: pending Escape suppression, same-route cancellation, visible-trigger hover switching, focused-panel protection');
 }finally{await act(()=>root.unmount());dom.window.close()}
}finally{await rm(temp,{recursive:true,force:true})}
