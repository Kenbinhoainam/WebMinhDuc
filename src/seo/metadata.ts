import {seo, ORIGIN} from './routes';
import {articleHref, articles} from '../editorial-data';
import {languageTags, locales, localizedPath, type Locale} from '../i18n-runtime/paths';
import {translate} from '../i18n-runtime/catalog';

/** Used by both the static renderer and client navigation. All inputs are request-local. */
export function localizedSeo(path:string, locale:Locale) {
 const source=seo(path);
 const localize=(value:unknown):unknown=>{
  if(typeof value==='string') return translate(value,locale);
  if(Array.isArray(value)) return value.map(localize);
  if(value && typeof value==='object') return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,localize(v)]));
  return value;
 };
 const canonicalPath = new URL(source.url).pathname;
 const url = ORIGIN + localizedPath(canonicalPath, locale);
 const alternates = locales.map(lang => ({
   hrefLang: languageTags[lang],
   href: ORIGIN + localizedPath(canonicalPath, lang),
 }));
 alternates.push({hrefLang: 'x-default', href: source.url});
 const originalTitle=source.title.replace(/ \| Minh Đức Vina$/, '');
 const title=translate(originalTitle,locale)+' | Minh Đức Vina';
 const description=translate(source.description,locale);
 const article = canonicalPath.startsWith('/news/') ? articles.find(item => articleHref(item.slug) === canonicalPath) : undefined;
 const image = article?.image ? new URL(article.image.src, ORIGIN).href : source.image;
 const json=localize(source.json) as typeof source.json;
 for(const node of json['@graph']) {
  if(node['@type']==='WebPage') Object.assign(node,{'@id':url+'#webpage',url,name:title,description,inLanguage:languageTags[locale]});
  if(node['@type']==='WebSite') node.inLanguage=languageTags[locale];
  if(node['@type']==='BreadcrumbList' && Array.isArray(node.itemListElement)) for(const item of node.itemListElement) {
   if(typeof item.item==='string' && item.item.startsWith(ORIGIN)) item.item=ORIGIN+localizedPath(new URL(item.item).pathname,locale);
  }
 }
 if (article) {
  json['@graph'].push({
   '@type':'Article', '@id':url+'#article', mainEntityOfPage:{'@id':url+'#webpage'},
   headline:translate(article.title,locale), description:translate(article.excerpt,locale),
   articleSection:translate(article.category,locale), datePublished:article.date, inLanguage:languageTags[locale],
   publisher:{'@id':ORIGIN+'/#organization'}, ...(article.image && {image}),
  });
 }
 const socialTags = {
  'og:type':article ? 'article' : 'website', 'og:title':title, 'og:description':description, 'og:url':url, 'og:image':image,
  'twitter:card':article?.image ? 'summary_large_image' : 'summary', 'twitter:title':title, 'twitter:description':description, 'twitter:image':image,
 };
 return {...source,url,title,description,image,json,alternates,socialTags};
}
