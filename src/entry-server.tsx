import React from 'react';
import {prerenderToNodeStream} from 'react-dom/static';
import {StaticRouter} from 'react-router-dom';
import App from './App';
import {RouteMetadata} from './seo/RouteMetadata';
import {LocaleProvider,localeFromPath,localeBase} from './i18n';
import {loadLocale} from './i18n-runtime/catalog';
export {loadLocale} from './i18n-runtime/catalog';
export {pages,seo} from './seo/routes';
export {localizedSeo} from './seo/RouteMetadata';
export {locales,languageTags,localizedPath} from './i18n';
export async function render(url:string):Promise<string>{
 const locale=localeFromPath(new URL(url,'https://example.com').pathname);
 await loadLocale(locale);
 const {prelude}=await prerenderToNodeStream(<React.StrictMode><LocaleProvider value={locale}><StaticRouter basename={localeBase(locale)} location={url}><RouteMetadata/><App/></StaticRouter></LocaleProvider></React.StrictMode>);
 let body=''; for await(const chunk of prelude) body+=chunk.toString(); return body;
}
