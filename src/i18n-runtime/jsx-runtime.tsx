import {jsx as reactJsx, jsxs as reactJsxs, Fragment} from 'react/jsx-runtime';
import {useLocale, type Locale} from '../i18n';
import {Link, NavLink} from 'react-router-dom';
import common from '../i18n-catalogs/common.json';
import home from '../i18n-catalogs/home.json';
import info from '../i18n-catalogs/info.json';
import infoExisting from '../i18n-catalogs/info-existing.json';
import jobs from '../i18n-catalogs/jobs.json';
import contactAdmin from '../i18n-catalogs/contact-admin.json';
import education from '../i18n-catalogs/education.json';
import metadata from '../i18n-catalogs/metadata.json';

const catalog: Record<string, Partial<Record<Locale, string>>> = {...common, ...home, ...info, ...infoExisting, ...jobs, ...contactAdmin, ...education, ...metadata};
export function translate(value: unknown, locale: Locale): unknown {
 if (locale === 'vi') return value;
 if (typeof value === 'string') {
  const direct=catalog[value]?.[locale];
  if(direct) return direct;
  const trimmed=value.trim(), translated=catalog[trimmed]?.[locale];
  return translated ? value.replace(trimmed,translated) : value;
 }
 if (Array.isArray(value)) return value.map(item => translate(item, locale));
 return value;
}
const translatedAttrs = ['aria-label', 'aria-description', 'placeholder', 'title', 'alt'];
function Intrinsic({element, properties, multiple}: {element: string; properties: Record<string, unknown>; multiple: boolean}) {
 const locale = useLocale();
 const props = {...properties};
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
