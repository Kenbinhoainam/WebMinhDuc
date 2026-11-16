import './styles.css';
import './reference-base.css';
import React from 'react';
import {createRoot,hydrateRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import App from './App';
import {RouteMetadata} from './seo/RouteMetadata';
import {LocaleProvider,localeFromPath,localeBase} from './i18n';
import './flagshipvisual.css';
import {loadLocale} from './i18n-runtime/catalog';
const root=document.getElementById('root')!;
const locale=localeFromPath(location.pathname);
async function start() {
 try { await loadLocale(locale); }
 catch {
  // Keep the server-rendered content intact if a language chunk cannot be loaded.
  const messages={vi:'Không thể tải ngôn ngữ. Vui lòng tải lại trang.',en:'Unable to load the language. Please reload the page.',zh:'无法加载语言。请重新加载页面。',ko:'언어를 불러올 수 없습니다. 페이지를 새로고침해 주세요.',ja:'言語を読み込めませんでした。ページを再読み込みしてください。'};
  const notice=document.createElement('div');notice.setAttribute('role','alert');
  notice.textContent=messages[locale]+' ';
  const button=document.createElement('button');button.type='button';button.textContent={vi:'Tải lại',en:'Reload',zh:'重新加载',ko:'새로고침',ja:'再読み込み'}[locale];button.onclick=()=>location.reload();notice.appendChild(button);
  document.body.prepend(notice);return;
 }
 const app=<React.StrictMode><LocaleProvider value={locale}><BrowserRouter basename={localeBase(locale)}><RouteMetadata/><App/></BrowserRouter></LocaleProvider></React.StrictMode>;
 const canonical=document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
 const sameRoute=canonical && new URL(canonical.href).pathname.replace(/\/$/,'')===location.pathname.replace(/\/$/,'');
 if(root.hasChildNodes() && sameRoute && !location.search) hydrateRoot(root,app);
 else createRoot(root).render(app);
}
void start();
