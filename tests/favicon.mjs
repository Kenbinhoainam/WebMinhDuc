import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {JSDOM} from 'jsdom';

const icons = [
  {rel: 'icon', type: 'image/png', sizes: '96x96', href: '/assets/minh-duc-favicon-96.png'},
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
// The browser favicon is the transparent brand mark. PNG color type 6 has an alpha channel.
assert.equal((await readFile('public/assets/minh-duc-favicon-96.png'))[25], 6);
verifyHead(await readFile('index.html', 'utf8'), 'source template');
if (process.argv.includes('--built')) {
  const sitemap = await readFile('dist/sitemap.xml', 'utf8');
  const pages = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([,url]) =>
    join('dist', new URL(url).pathname, 'index.html'));
  assert.ok(pages.includes('dist/index.html'), 'homepage entry exists');
  for (const page of pages) verifyHead(await readFile(page,'utf8'), page);
  for (const icon of icons) await readFile(join('dist', icon.href.slice(1)));
  console.log(`PASS favicon in ${pages.length} prerendered content pages`);
} else console.log('PASS source favicon links and icon dimensions');
