import {createContext, useContext} from 'react';

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
/** A full navigation resets the router basename while retaining the current destination. */
export function LanguageSelector(){
 const locale = useLocale();
 return <label className="language-selector"><span className="sr-only">Language / Ngôn ngữ</span><select aria-label="Language / Ngôn ngữ" value={locale} onChange={event => {
  const next = event.currentTarget.value as Locale;
  window.location.assign(languageSwitchUrl(window.location.pathname,window.location.search,window.location.hash,next));
 }}>{locales.map(code => <option key={code} value={code}>{localeNames[code]}</option>)}</select></label>;
}
