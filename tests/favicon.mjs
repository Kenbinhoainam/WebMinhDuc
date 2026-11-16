import assert from 'node:assert/strict';
import {readFile, readdir} from 'node:fs/promises';
import {join} from 'node:path';
import {JSDOM} from 'jsdom';

const icons = [
  {rel: 'icon', type: 'image/png', sizes: '96x96', href: '/assets/minh-duc-favicon-96.png'},
  {rel: 'icon', type: 'image/webp', sizes: '96x96', href: '/optimized/assets/minh-duc-logo-96.webp'},
  {rel: 'apple-touch-icon', sizes: '192x192', href: '/assets/minh-duc-apple-touch.png'},
];
const verifyHead = (html, path) => {
  const dom = new JSDOM(html), document = dom.window.document;
  for (const expected of icons) {
    const link = document.head.querySelector(`link[rel="${expected.rel}"][href="${expected.href}"]`);
    assert.ok(link, `${path}: missing ${expected.href}`);
    assert.equal(link.getAttribute('sizes'), expected.sizes);
    if (expected.type) assert.equal(link.getAttribute('type'), expected.type);
  }
  assert.equal(document.head.querySelector('link[rel="preload"][href*="minh-duc-favicon"]'), null, 'favicon is not preloaded');
  dom.window.close();
};
for (const [path, size] of [['public/assets/minh-duc-favicon-96.png', 96], ['public/assets/minh-duc-apple-touch.png', 192]]) {
  const buffer = await readFile(path);
  assert.deepEqual([...buffer.subarray(0,8)], [137,80,78,71,13,10,26,10], `${path}: PNG signature`);
  assert.equal(buffer.readUInt32BE(16), size); assert.equal(buffer.readUInt32BE(20), size);
}
await readFile('public/optimized/assets/minh-duc-logo-96.webp');
verifyHead(await readFile('index.html', 'utf8'), 'source template');
if (process.argv.includes('--built')) {
  const collect = async dir => (await Promise.all((await readdir(dir, {withFileTypes:true})).map(entry => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? collect(path) : entry.name === 'index.html' || entry.name === '404.html' ? [path] : [];
  }))).flat();
  const pages = await collect('dist');
  assert.ok(pages.includes('dist/index.html'), 'fallback entry exists');
  assert.ok(pages.length >= 200, 'all localized prerendered pages are present');
  for (const page of pages) verifyHead(await readFile(page,'utf8'), page);
  for (const icon of icons) await readFile(join('dist', icon.href.slice(1)));
  console.log(`PASS favicon in ${pages.length} generated HTML entries and fallback`);
} else console.log('PASS source favicon links and icon dimensions');
