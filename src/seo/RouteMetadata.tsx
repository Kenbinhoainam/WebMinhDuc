import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {seo,ORIGIN} from './routes';
import {languageTags,localizedPath,locales,useLocale, type Locale} from '../i18n';
import {translate} from '../i18n-runtime/jsx-runtime';

export function localizedSeo(path:string, locale:Locale) {
 const source=seo(path);
 const localize=(value:unknown):unknown=>{
  if(typeof value==='string') return translate(value,locale);
  if(Array.isArray(value)) return value.map(localize);
  if(value && typeof value==='object') return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,localize(v)]));
  return value;
 };
 const url=ORIGIN+localizedPath(new URL(source.url).pathname,locale);
 const originalTitle=source.title.replace(/ \| Minh Đức Vina$/, '');
 const title=String(translate(originalTitle,locale))+' | Minh Đức Vina';
 const description=String(translate(source.description,locale));
 const json=localize(source.json) as typeof source.json;
 for(const node of json['@graph']) {
  if(node['@type']==='WebPage') Object.assign(node,{'@id':url+'#webpage',url,name:title,description,inLanguage:languageTags[locale]});
  if(node['@type']==='WebSite') node.inLanguage=languageTags[locale];
  if(node['@type']==='BreadcrumbList' && Array.isArray(node.itemListElement)) for(const item of node.itemListElement) {
   if(typeof item.item==='string' && item.item.startsWith(ORIGIN)) item.item=ORIGIN+localizedPath(new URL(item.item).pathname,locale);
  }
 }
 return {...source,url,title,description,json};
}
export function RouteMetadata(){
 const {pathname}=useLocation(), locale=useLocale();
 useEffect(()=>{const s=localizedSeo(pathname,locale); document.title=s.title; document.documentElement.lang=languageTags[locale];
  const set=(selector:string,attr:string,value:string)=>{const node=document.head.querySelector(selector); if(node)node.setAttribute(attr,value)};
  set('meta[name="description"]','content',s.description); set('link[rel="canonical"]','href',s.url);
  for(const [key,value] of Object.entries({'og:title':s.title,'og:description':s.description,'og:url':s.url,'og:image':s.image,'twitter:title':s.title,'twitter:description':s.description,'twitter:image':s.image})) set(`meta[property="${key}"],meta[name="${key}"]`,'content',value);
  for(const lang of locales){ let link=document.head.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${languageTags[lang]}"]`); if(!link){link=document.createElement('link');link.rel='alternate';link.hreflang=languageTags[lang];document.head.appendChild(link)} link.href=localizedSeo(pathname,lang).url; }
  let defaultLink=document.head.querySelector<HTMLLinkElement>('link[rel="alternate"][hreflang="x-default"]'); if(!defaultLink){defaultLink=document.createElement('link');defaultLink.rel='alternate';defaultLink.hreflang='x-default';document.head.appendChild(defaultLink)} defaultLink.href=localizedSeo(pathname,'vi').url;
  const json=document.getElementById('structured-data');if(json)json.textContent=JSON.stringify(s.json).replace(/</g,'\\u003c');
 },[pathname,locale]);return null;
}
