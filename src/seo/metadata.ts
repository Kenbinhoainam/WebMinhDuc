import {seo, ORIGIN} from './routes';
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
 const json=localize(source.json) as typeof source.json;
 for(const node of json['@graph']) {
  if(node['@type']==='WebPage') Object.assign(node,{'@id':url+'#webpage',url,name:title,description,inLanguage:languageTags[locale]});
  if(node['@type']==='WebSite') node.inLanguage=languageTags[locale];
  if(node['@type']==='BreadcrumbList' && Array.isArray(node.itemListElement)) for(const item of node.itemListElement) {
   if(typeof item.item==='string' && item.item.startsWith(ORIGIN)) item.item=ORIGIN+localizedPath(new URL(item.item).pathname,locale);
  }
 }
 return {...source,url,title,description,json,alternates};
}
