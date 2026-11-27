export const locales = ['vi', 'en', 'zh', 'ko', 'ja'] as const;
export type Locale = typeof locales[number];
export const languageTags: Record<Locale, string> = {vi: 'vi', en: 'en', zh: 'zh-Hans', ko: 'ko', ja: 'ja'};

/** Vietnamese has no URL prefix. The other languages keep the same content paths. */
export function localeFromPath(pathname: string): Locale {
  const segment = pathname.split('/')[1];
  return locales.includes(segment as Locale) ? segment as Locale : 'vi';
}

export function localeBase(locale: Locale): string {
  return locale === 'vi' ? '' : `/${locale}`;
}

export function stripLocale(pathname: string): string {
  if (pathname === '/vi' || pathname === '/vi/') return '/';
  const locale = localeFromPath(pathname);
  return locale === 'vi' ? pathname : pathname.slice(localeBase(locale).length) || '/';
}

export function localizedPath(pathname: string, locale: Locale): string {
  const path = stripLocale(pathname);
  if (path === '/' && locale !== 'vi') return localeBase(locale);
  return localeBase(locale) + path || '/';
}

export function languageSwitchUrl(pathname: string, search: string, hash: string, locale: Locale): string {
  return localizedPath(pathname, locale) + search + hash;
}
