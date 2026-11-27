import {build} from 'esbuild';
import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';

// This import graph must remain usable by Node metadata/static-route generation
// without browser globals, React, router components or page styles.
const bundle = await build({
  stdin: {
    contents: `
      export {pages, ORIGIN} from './src/seo/routes';
      export {jobs} from './src/jobs-data';
      export {educationPrograms} from './src/education-data';
      export {articles, articleHref} from './src/editorial-data';
      export {localizedSeo} from './src/seo/metadata';
      export {loadLocale} from './src/i18n-runtime/catalog';
    `,
    resolveDir: process.cwd(), sourcefile: 'route-data-check.ts',
  },
  bundle: true, platform: 'node', format: 'esm', write: false, metafile: true, logLevel: 'silent',
});
for (const input of Object.keys(bundle.metafile.inputs)) {
  assert.doesNotMatch(input, /(?:node_modules|\.tsx$|\.css$)/, `data must not import UI: ${input}`);
  assert.doesNotMatch(input, /editorial-content/, `metadata must not import article bodies: ${input}`);
}
const {pages, ORIGIN, jobs, educationPrograms, articles, articleHref, localizedSeo, loadLocale} = await import('data:text/javascript;base64,' + Buffer.from(bundle.outputFiles[0].text).toString('base64'));
const expectedPaths = [
  ...jobs.map(job => '/jobs/' + job.slug),
  ...articles.map(article => articleHref(article.slug)),
  ...educationPrograms.map(program => '/education/' + program.slug),
];
const dynamicPages = pages.filter(page => /^\/(jobs|news|education)\//.test(page.path));
assert.deepEqual(dynamicPages.map(page => page.path), expectedPaths, 'every finite job/article/program has exactly one metadata route');
assert.equal(new Set(pages.map(page => page.path)).size, pages.length, 'no duplicate metadata URLs');

await Promise.all(['en','zh'].map(loadLocale));
const english = localizedSeo('/job-seekers', 'en');
const chinese = localizedSeo('/jobs', 'zh');
assert.equal(english.url, ORIGIN + '/en/jobs');
assert.equal(chinese.url, ORIGIN + '/zh/jobs');
assert.notEqual(english.title, chinese.title);
assert.deepEqual(english.alternates, chinese.alternates);
assert.equal(english.alternates.find(link => link.hrefLang === 'zh-Hans').href, chinese.url);
assert.equal(english.alternates.find(link => link.hrefLang === 'x-default').href, ORIGIN + '/jobs');

// These intentionally differ from the shorter labels shown on cards/forms.
assert.equal(pages.find(page => page.path === '/jobs/nhan-vien-kho-thai-nguyen').title, 'Nhân viên kho và đóng gói');
assert.equal(pages.find(page => page.path === '/education/tu-xa-quan-tri').title, 'Quản trị kinh doanh từ xa');
assert.equal(pages.find(page => page.path === '/education/tu-xa-ke-toan').title, 'Kế toán từ xa');
for (const locale of ['en', 'zh', 'ko', 'ja']) {
  const {merged} = JSON.parse(await readFile(`src/i18n-generated/${locale}.json`, 'utf8'));
  for (const page of dynamicPages) {
    assert.ok(merged[page.title], `${locale}: translated metadata title for ${page.path}`);
    assert.ok(merged[page.description], `${locale}: translated metadata description for ${page.path}`);
  }
}
console.log(`PASS ${dynamicPages.length} finite job/article/program routes, unique URLs, translated metadata and body/UI-free SSR data imports`);
