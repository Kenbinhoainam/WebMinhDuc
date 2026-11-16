import {createContext, useContext, useEffect, useId, useRef, useState} from 'react';
import {useLocation} from 'react-router-dom';
import {LocalFlag} from './LocalFlag';
import './locale-selector.css';

export const locales = ['vi', 'en', 'zh', 'ko', 'ja'] as const;
export type Locale = typeof locales[number];
export const localeNames: Record<Locale, string> = {vi: 'Tiếng Việt', en: 'English', zh: '简体中文', ko: '한국어', ja: '日本語'};
export const languageTags: Record<Locale, string> = {vi: 'vi', en: 'en', zh: 'zh-Hans', ko: 'ko', ja: 'ja'};

/** Vietnamese remains at the original URLs; other languages use a prefix. */
export function localeFromPath(pathname: string): Locale {
 const segment = pathname.split('/')[1];
 return locales.includes(segment as Locale) && segment !== 'vi' ? segment as Locale : 'vi';
}
export function localeBase(locale: Locale): string { return locale === 'vi' ? '' : `/${locale}`; }
export function stripLocale(pathname: string): string {
 if (/^\/vi\/?$/.test(pathname)) return '/';
 const locale = localeFromPath(pathname);
 return locale === 'vi' ? pathname : pathname.slice(localeBase(locale).length) || '/';
}
export function localizedPath(pathname: string, locale: Locale): string {
 const path = stripLocale(pathname);
 return `${localeBase(locale)}${path === '/' && locale !== 'vi' ? '' : path}` || '/';
}
export function languageSwitchUrl(pathname:string, search:string, hash:string, locale:Locale):string {
 return localizedPath(pathname,locale)+search+hash;
}
const LocaleContext = createContext<Locale>('vi');
export const LocaleProvider = LocaleContext.Provider;
export const useLocale = () => useContext(LocaleContext);
export type Translation = Record<Locale, string>;
export function useTranslation() {
 const locale = useLocale();
 return (text: Translation) => text[locale];
}
/** Links perform a full navigation so the router basename resets for the selected language. */
export function LanguageSelector(){
 const locale = useLocale();
 const location = useLocation();
 const [open, setOpen] = useState(false);
 const rootRef = useRef<HTMLDivElement>(null);
 const triggerRef = useRef<HTMLButtonElement>(null);
 const panelId = useId();
 useEffect(() => {
  if (!open) return;
  const outside = (event: PointerEvent) => { if (!rootRef.current?.contains(event.target as Node)) setOpen(false); };
  const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(false); triggerRef.current?.focus(); } };
  const otherOverlay = (event: Event) => { if ((event as CustomEvent<{owner?: string}>).detail?.owner !== 'language') setOpen(false); };
  document.addEventListener('header-overlay-open', otherOverlay);
  document.addEventListener('pointerdown', outside);
  document.addEventListener('keydown', escape);
  return () => { document.removeEventListener('header-overlay-open', otherOverlay); document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
 }, [open]);
 return <div className="language-selector" ref={rootRef} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false); }}>
  <button ref={triggerRef} type="button" className="language-trigger" data-locale={locale} aria-label={`Language / Ngôn ngữ: ${localeNames[locale]}`} aria-expanded={open} aria-controls={panelId} onClick={() => { if (!open) document.dispatchEvent(new window.CustomEvent('header-overlay-open', {detail:{owner:'language'}})); setOpen(value => !value); }}>
   <LocalFlag locale={locale}/><span lang={languageTags[locale]}>{localeNames[locale]}</span><svg className="language-chevron" viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
  </button>
  <div id={panelId} className="language-panel" hidden={!open}>
   <p className="language-panel-title">Language / Ngôn ngữ</p>
   <ul>{locales.map(code => <li key={code}><a href={languageSwitchUrl(location.pathname,location.search,location.hash,code)} lang={languageTags[code]} aria-current={code===locale ? 'true' : undefined}>
    <LocalFlag locale={code}/><span>{localeNames[code]}</span>{code===locale && <svg className="language-check" viewBox="0 0 16 16" aria-hidden="true"><path d="m3 8 3.2 3.2L13 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
   </a></li>)}</ul>
  </div>
 </div>;
}
