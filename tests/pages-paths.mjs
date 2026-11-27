import assert from 'node:assert/strict';

export const siteBase='/WebMinhDuc';
export const siteUrl='https://kenbinhoainam.github.io'+siteBase;
export const sitePath=path=>siteBase+path;

// Keep route-policy checks strict: a URL that escapes the project-site base must fail.
export function outputPath(url) {
  const path=new URL(url,siteUrl+'/').pathname;
  assert.ok(path===siteBase || path.startsWith(siteBase+'/'),'URL outside deployed site: '+url);
  return decodeURIComponent(path.slice(siteBase.length)) || '/';
}
