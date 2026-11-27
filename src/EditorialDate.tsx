import type {Locale} from './i18n';

export function formatEditorialDate(date: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === 'vi' ? 'vi-VN' : locale, {
    day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(date + 'T00:00:00Z'));
}

export function ArticleDate({date, locale}: {date: string; locale: Locale}) {
  return <time dateTime={date}>{formatEditorialDate(date, locale)}</time>;
}
