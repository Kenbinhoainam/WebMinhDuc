import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {useLocale} from '../i18n';
import {languageTags} from '../i18n-runtime/paths';
import {localizedSeo} from './metadata';

export function RouteMetadata(){
 const {pathname}=useLocation(), locale=useLocale();
 useEffect(()=>{const s=localizedSeo(pathname,locale); document.title=s.title; document.documentElement.lang=languageTags[locale];
  const set=(selector:string,attr:string,value:string)=>{const node=document.head.querySelector(selector); if(node)node.setAttribute(attr,value)};
  set('meta[name="description"]','content',s.description); set('link[rel="canonical"]','href',s.url);
  for(const [key,value] of Object.entries(s.socialTags)) set(`meta[property="${key}"],meta[name="${key}"]`,'content',value);
  for (const {hrefLang, href} of s.alternates) {
    let link = document.head.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${hrefLang}"]`);
    if (!link) {
      link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = hrefLang;
      document.head.appendChild(link);
    }
    link.href = href;
  }
  const json=document.getElementById('structured-data');if(json)json.textContent=JSON.stringify(s.json).replace(/</g,'\\u003c');
 },[pathname,locale]);return null;
}
