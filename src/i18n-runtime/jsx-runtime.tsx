import {jsx as reactJsx, jsxs as reactJsxs, Fragment} from 'react/jsx-runtime';
import {useLocale, type Locale} from '../i18n';
import {Link, NavLink} from 'react-router-dom';
import {lookup} from './catalog';
import {responsiveImage} from '../media';

export function translate(value: unknown, locale: Locale): unknown {
 if (locale === 'vi') return value;
 if (typeof value === 'string') {
  const direct=lookup(locale,value);
  if(direct) return direct;
  const trimmed=value.trim(), translated=lookup(locale,trimmed);
  return translated ? value.replace(trimmed,translated) : value;
 }
 if (Array.isArray(value)) return value.map(item => translate(item, locale));
 return value;
}
const translatedAttrs = ['aria-label', 'aria-description', 'placeholder', 'title', 'alt'];
function Intrinsic({element, properties, multiple}: {element: string; properties: Record<string, unknown>; multiple: boolean}) {
 const locale = useLocale();
 const props = {...properties};
 if (element === 'img' && typeof props.src === 'string') {
  const classes=String(props.className||'');
  const sizes=typeof props.sizes==='string'?props.sizes:
   classes.includes('info-article-cover')?'(max-width: 800px) calc(100vw - 40px), 720px':
   classes.includes('info-rounded-photo')?'(max-width: 800px) calc(100vw - 40px), 600px':
   props.src.includes('minh-duc-logo')?'90px':'(max-width: 575px) calc(100vw - 36px), (max-width: 1023px) 50vw, 680px';
  const optimized=responsiveImage(props.src,sizes);
  if(optimized){
   props.src=optimized.src;
   props.srcSet ??= optimized.srcSet;
   props.sizes ??= optimized.sizes;
   props.width ??= optimized.width;
   props.height ??= optimized.height;
   props.decoding ??= 'async';
  }
 }
 // Preserve option values when an option did not explicitly set one.
 if (element === 'option' && props.value === undefined && typeof props.children === 'string') props.value = props.children;
 props.children = translate(props.children, locale);
 for (const attr of translatedAttrs) if (typeof props[attr] === 'string') props[attr] = translate(props[attr], locale);
 return (multiple ? reactJsxs : reactJsx)(element as keyof import('react').JSX.IntrinsicElements, props);
}
function Component({component, properties, multiple}: {component: any; properties: Record<string, unknown>; multiple: boolean}) {
 const locale=useLocale();
 const props:Record<string,unknown>={...properties, children: translate(properties.children, locale)};
 for(const attr of translatedAttrs) if(typeof props[attr] === 'string') props[attr]=translate(props[attr],locale);
 return (multiple ? reactJsxs : reactJsx)(component, props);
}
function make(factory: typeof reactJsx, type: any, props: any, key?: any) {
 return typeof type === 'string' ? reactJsx(Intrinsic, {element:type, properties:props, multiple:factory===reactJsxs}, key) : type === Link || type === NavLink ? reactJsx(Component, {component:type, properties:props, multiple:factory===reactJsxs}, key) : factory(type, props, key);
}
export const jsx = (type: any, props: any, key?: any) => make(reactJsx, type, props, key);
export const jsxs = (type: any, props: any, key?: any) => make(reactJsxs, type, props, key);
export {Fragment};
export type {JSX} from 'react/jsx-runtime';
