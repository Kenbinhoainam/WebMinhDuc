import type {Locale} from './paths';

type Dictionary = Record<string, string>;
type Catalog = {merged: Dictionary; jobs: Dictionary};
const loaders = {
 en: () => import('../i18n-generated/en.json'),
 zh: () => import('../i18n-generated/zh.json'),
 ko: () => import('../i18n-generated/ko.json'),
 ja: () => import('../i18n-generated/ja.json'),
};
const catalogs: Partial<Record<Locale, Catalog>> = {};
const pending: Partial<Record<Locale, Promise<void>>> = {};
/** Load before rendering or computing localized metadata. Cache by locale for SSR. */
export function loadLocale(locale: Locale): Promise<void> {
 if(locale === 'vi' || catalogs[locale]) return Promise.resolve();
 return pending[locale] ??= loaders[locale]().then(module => { catalogs[locale] = module.default; }).catch(error => { delete pending[locale]; throw error; });
}
export function lookup(locale: Locale, key: string, kind: keyof Catalog = 'merged'): string | undefined {
 return catalogs[locale]?.[kind][key];
}

export function translate(value: string, locale: Locale): string;
export function translate(value: unknown, locale: Locale): unknown;
export function translate(value: unknown, locale: Locale): unknown {
  if (locale === 'vi') return value;
  if (typeof value === 'string') {
    const direct = lookup(locale, value);
    if (direct) return direct;
    const trimmed = value.trim();
    const translated = lookup(locale, trimmed);
    return translated ? value.replace(trimmed, translated) : value;
  }
  return Array.isArray(value) ? value.map(item => translate(item, locale)) : value;
}
