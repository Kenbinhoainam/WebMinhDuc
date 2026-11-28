// The frozen GitHub Pages snapshot includes its mount path in legacy media manifests
// and route literals. Compile those same inputs for an isolated, root-mounted Site.
const pagesBase = '/WebMinhDuc';
const pagesUrl = 'https://kenbinhoainam.github.io' + pagesBase;
const configured = process.env.MINHDUC_PREVIEW_ORIGIN;
const origin = configured ? new URL(configured) : undefined;
if (origin && (origin.protocol !== 'https:' || origin.href !== origin.origin + '/')) {
  throw new Error('MINHDUC_PREVIEW_ORIGIN must be an HTTPS origin.');
}
export const base = origin ? '' : pagesBase;
export function adaptHostingPaths(source) {
  return origin ? source.replaceAll(pagesUrl, origin.origin).replaceAll(pagesBase, '') : source;
}
