import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {seo} from './routes';
export function RouteMetadata(){
 const {pathname}=useLocation();
 useEffect(()=>{const s=seo(pathname); document.title=s.title;
  const set=(selector:string,attr:string,value:string)=>{const node=document.head.querySelector(selector); if(node)node.setAttribute(attr,value)};
  set('meta[name="description"]','content',s.description); set('link[rel="canonical"]','href',s.url);
  for(const [key,value] of Object.entries({'og:title':s.title,'og:description':s.description,'og:url':s.url,'og:image':s.image,'twitter:title':s.title,'twitter:description':s.description,'twitter:image':s.image})) set(`meta[property="${key}"],meta[name="${key}"]`,'content',value);
  const json=document.getElementById('structured-data');if(json)json.textContent=JSON.stringify(s.json).replace(/</g,'\\u003c');
 },[pathname]);return null;
}
