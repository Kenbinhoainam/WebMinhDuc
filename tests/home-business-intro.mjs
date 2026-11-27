import {build} from 'esbuild';
import {readFile, rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';

// DOM/CSS contract checks; actual scrolling and overlap still need a browser check.
const css = await readFile('src/home-reference.css', 'utf8');
const styles = new JSDOM(`<style>${css}</style>`).window.document.styleSheets[0];
function declarationsAt(selector, width, height) {
  const values = {};
  const visit = rules => {
    for (const rule of rules) {
      if (rule.media) {
        const matches = [...rule.conditionText.matchAll(/\((min|max)-(width|height):\s*(\d+)px\)/g)];
        assert.ok(matches.length, `Unrecognised viewport condition: ${rule.conditionText}`);
        if (matches.every(([,bound,axis,value]) => bound === 'min'
          ? (axis === 'width' ? width : height) >= Number(value)
          : (axis === 'width' ? width : height) <= Number(value))) visit(rule.cssRules);
      } else if (rule.selectorText?.split(',').map(value => value.trim()).includes(selector)) {
        for (let index = 0; index < rule.style.length; index++) {
          const property = rule.style[index];
          values[property] = rule.style.getPropertyValue(property);
        }
      }
    }
  };
  visit(styles.cssRules);
  return values;
}
const gridAt = width => declarationsAt('.home-b2b-contact-layout',width,844)['grid-template-columns'].replaceAll('0px','0').replaceAll(/\s+/g,'');

for (const [width,height,sticky] of [
  [1440,900,true], [1024,700,true], [1023,900,false], [1024,699,false],
  [1280,500,false], [720,450,false], [390,844,false], [320,568,false],
]) {
  const intro = declarationsAt('.home-b2b-intro',width,height);
  assert.equal(intro.position ?? 'static',sticky ? 'sticky' : 'static',`${width}×${height}: intro positioning`);
  if (sticky) assert.equal(intro.top,'130px');
  assert.equal(declarationsAt('.home-b2b-form',width,height).position,undefined,'Form must stay in the document flow');
}
for (const width of [320,390,638,639]) {
  assert.equal(gridAt(width),'minmax(0,1fr)',`${width}: existing mobile stack`);
}
for (const width of [640,641,1023,1024,1440]) {
  assert.match(gridAt(width),/^minmax\(0,[\d.]+fr\)minmax\(0,[\d.]+fr\)$/,`${width}: existing two-column form layout`);
}

const output = '.home-business-intro-test.mjs';
try {
  await build({stdin:{contents:"export {default as Home} from './src/Home'; export {LocaleProvider} from './src/i18n'; export {loadLocale} from './src/i18n-runtime/catalog';",resolveDir:process.cwd(),sourcefile:'home-business-intro-entry.tsx'},bundle:true,platform:'node',format:'esm',outfile:output,packages:'external',loader:{'.css':'empty'},logLevel:'silent'});
  const {Home,LocaleProvider,loadLocale} = await import(pathToFileURL(`${process.cwd()}/${output}`).href);
  const React = await import('react');
  const {renderToString} = await import('react-dom/server');
  const {MemoryRouter} = await import('react-router-dom');
  for (const locale of ['vi','en','zh','ko','ja']) {
    await loadLocale(locale);
    const html = renderToString(React.createElement(LocaleProvider,{value:locale},React.createElement(MemoryRouter,null,React.createElement(Home))));
    const doc = new JSDOM(html).window.document;
    const section = doc.querySelector('#business-contact');
    const intro = section.querySelector('.home-b2b-intro');
    assert.equal(intro.getAttribute('data-reveal'),'left');
    assert.ok(intro.hasAttribute('data-reveal-frame'),'Observe the stable outer frame, not its moving text');
    assert.equal(intro.getAttribute('data-reveal-delay'),null);
    assert.deepEqual([...intro.querySelector('.motion-content').children].map(element => element.tagName),['H2','P','A']);
    assert.equal(intro.querySelector('h2').id,'business-heading');
    const phone = intro.querySelector('a');
    assert.equal(phone.getAttribute('href'),'tel:0818919666');
    assert.equal(phone.textContent.replace(/\s/g,''),'0818919666');
    assert.equal(phone.className,'home-b2b-phone','Keep the original telephone interaction');
    assert.equal(intro.querySelector('form'),null);
    const form = section.querySelector('.home-b2b-form');
    assert.equal(form.closest('[data-reveal-frame]').getAttribute('data-reveal'),'right');
    assert.equal(section.querySelector('.form-mode'),null,'Homepage stays locked to F01');
    assert.deepEqual([...form.querySelectorAll('[name]')].map(field => field.name),[
      'name','phone','email','company','location','jobrole','quantity','shift','needdate','service','notes',
    ]);
    assert.deepEqual([...form.querySelectorAll('[required]')].map(field => field.name),['name','phone','location','notes']);
    assert.ok(form.querySelector('button[type="submit"]'));
  }
  console.log('PASS homepage intro: wide/tall sticky at 130px; narrow/short static; mobile stack unchanged; original reveals, telephone link and F01 fields preserved in five locales (DOM/CSS contract).');
} finally {
  await rm(output,{force:true});
}
