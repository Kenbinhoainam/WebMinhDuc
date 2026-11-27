import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {JSDOM} from 'jsdom';

const html = await readFile('dist/duyet.html', 'utf8');
const routes = ['/', '/about-us', '/services', '/jobs', '/careers', '/education', '/news', '/contact'];
const presets = new Map([[390,844],[820,1180],[1440,900]]);
let count = 0;
for (const mount of ['/', '/WebMinhDuc/']) {
  for (const [width,height] of presets) {
    for (const page of routes) {
      const url = new URL(mount + 'duyet.html','https://review.example');
      url.search = new URLSearchParams({page,w:width});
      const dom = new JSDOM(html,{url,runScripts:'dangerously'});
      const {document} = dom.window;
      const frame = document.querySelector('iframe');
      assert.equal(frame.width, String(width));
      assert.equal(frame.height, String(height));
      assert.ok(frame.title);
      assert.equal(new URL(frame.src).pathname, mount + page.slice(1));
      assert.equal(document.querySelector('[aria-pressed=true]').dataset.width, String(width));
      const historyLength = dom.window.history.length;
      document.querySelector('[data-width="820"]').click();
      assert.equal(frame.width,'820');
      assert.equal(new URL(frame.src).pathname,mount+page.slice(1));
      assert.equal(dom.window.history.length,historyLength);
      assert.ok(document.getElementById('dimensions').textContent.includes('820 × 1180 CSS px'));
      assert.match(document.querySelector('meta[name=robots]').content,/noindex,nofollow/);
      dom.window.close(); count++;
    }
  }
  const dom = new JSDOM(html,{url:'https://review.example'+mount+'duyet.html?w=10000&page=https://other.example/',runScripts:'dangerously'});
  const doc = dom.window.document;
  assert.equal(doc.querySelector('iframe').width,'390');
  assert.equal(doc.querySelector('iframe').src,'https://review.example'+mount);
  const select = doc.querySelector('select');
  for (const option of select.options) {
    select.value = option.value; select.dispatchEvent(new dom.window.Event('change'));
    assert.equal(doc.querySelector('iframe').src, new URL('.'+option.value,'https://review.example'+mount).href);
    assert.equal(new URL(dom.window.location.href).searchParams.get('page') || '/',option.value);
  }
  dom.window.close();
}
console.log('PASS reviewer fixture — '+count+' page/preset/mount combinations; invalid values, preserved navigation, all v3 shortcuts, noindex and replaceState');
