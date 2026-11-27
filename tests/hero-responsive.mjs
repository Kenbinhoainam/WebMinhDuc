import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import postcss from 'postcss';

// CSS contracts at representative viewport/device inputs; not browser layout or screenshots.
const hero = postcss.parse(await readFile('src/hero-media.css','utf8'));
const header = postcss.parse(await readFile('src/sprint-navigation.css','utf8'));
function mediaMatches(query,{width,height,pointer}) {
  return query.split(',').some(part=>[...part.matchAll(/\(([^()]+)\)/g)].every(([,condition])=>{
    const [feature,raw] = condition.split(':').map(value=>value.trim());
    const value = Number.parseFloat(raw);
    if(feature==='min-width')return width>=value;
    if(feature==='max-width')return width<=value;
    if(feature==='min-height')return height>=value;
    if(feature==='max-height')return height<=value;
    if(feature==='orientation')return raw===(width>height?'landscape':'portrait');
    if(feature==='pointer')return raw===pointer;
    if(feature==='min-aspect-ratio'){const [w,h]=raw.split('/').map(Number);return width/height>=w/h}
    if(feature==='prefers-reduced-motion')return raw==='no-preference';
    if(feature==='prefers-reduced-data'||feature==='forced-colors')return false;
    throw new Error(`Unhandled CSS condition: ${condition}`);
  }));
}
function declarationsAt(sheet,selector,viewport) {
  const declarations = {};
  function visit(container) {
    for(const node of container.nodes??[]) {
      if(node.type==='atrule'&&node.name==='media') {if(mediaMatches(node.params,viewport))visit(node)}
      else if(node.type==='atrule'&&node.name==='supports')visit(node);
      else if(node.type==='rule'&&node.selectors.includes(selector))node.walkDecls(decl=>{declarations[decl.prop]=decl.value});
    }
  }
  visit(sheet);return declarations;
}
const compact = [
  [320,568,'coarse'],[360,800,'coarse'],[390,844,'coarse'],[430,932,'coarse'],
  [599,900,'coarse'],[600,960,'coarse'],[768,1024,'coarse'],[820,1180,'coarse'],[1024,1366,'coarse'],
  [667,375,'coarse'],[844,390,'coarse'],[1024,768,'coarse'],[1180,820,'coarse'],[1366,1024,'coarse'],
  [1279,900,'fine'],[1400,1000,'coarse'],
];
for(const [width,height,pointer] of compact) {
  const viewport={width,height,pointer}, label=`${width}×${height}/${pointer}`;
  const get=selector=>declarationsAt(hero,selector,viewport);
  assert.equal(get('.home-hero.section-home-banner')['min-height'],'0',`${label}: playback height follows content`);
  assert.equal(get('.home-hero[data-show-brand="false"] .hero-stage')['aspect-ratio'],'16/9',`${label}: full uncropped film`);
  assert.equal(get('.home-hero[data-show-brand="false"] .hero-media').position,'absolute');
  assert.equal(get('.home-hero[data-show-brand="false"] .hero-stage')['grid-template-rows'],'1fr','no separate transport row');
  const controls=get('body .home-hero[data-show-brand="false"] .hero-player-tools');
  assert.equal(controls.right,'max(12px,env(safe-area-inset-right))');
  assert.equal(controls.bottom,'max(12px,env(safe-area-inset-bottom))');
  assert.equal(get('.home-hero[data-show-brand="false"] .hero-introduction::before').content,undefined,`${label}: no second architectural panel while playing`);
  const landscape=width>=600&&width>height;
  if(landscape)assert.equal(get('.home-hero[data-show-brand="false"]')['grid-template-columns'],'minmax(0,1.8fr) minmax(240px,1fr)');
  else assert.equal(get('.home-hero.section-home-banner')['grid-template-columns'],'minmax(0,1fr)');
  const headerRule=declarationsAt(header,'.site-header.site-header[data-home="true"]',viewport);
  assert.equal(headerRule.position,'sticky',`${label}: header occupies its own row`);
  assert.equal(headerRule.background,'#fff');
  assert.equal(headerRule['--header-ink'],'var(--md-ink)');
  assert.ok(Number.parseFloat(get('.home-hero .hero-brand-finish').padding.split(' ').at(-1))>=76,`${label}: end card reserves a controls lane`);
  if(width<600)assert.equal(get('.home-hero .hero-entry-bar')['grid-template-columns'],'minmax(0,1fr)');
}
for(const [width,height,pointer] of [[1280,900,'fine'],[1366,768,'fine'],[1440,900,'fine'],[1920,1080,'fine'],[2560,1080,'fine'],[1401,1024,'coarse']]) {
  const viewport={width,height,pointer};
  assert.equal(declarationsAt(hero,'.home-hero.section-home-banner',viewport)['min-height'],'var(--hero-room)',`${width}: desktop keeps v29 room`);
  assert.equal(declarationsAt(hero,'body .home-hero[data-show-brand="false"] .hero-player-tools',viewport).bottom,undefined,'compact controls never alter desktop');
  assert.equal(declarationsAt(header,'.site-header.site-header[data-home="true"]',viewport).position,undefined,'desktop home retains its fixed overlay');
  assert.equal(declarationsAt(header,'.site-header[data-home="true"]',viewport).position,'fixed');
}
console.log('PASS responsive hero CSS: content-led phone/tablet, 16:9 film with inset controls, portrait/landscape and breakpoint boundaries, compact header row, desktop isolation. Browser geometry still requires visual review.');
