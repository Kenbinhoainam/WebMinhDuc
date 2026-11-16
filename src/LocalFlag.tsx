import type {Locale} from './i18n';

/** Decorative, locally rendered flag artwork. Language names remain the text labels. */
export function LocalFlag({locale}:{locale:Locale}) {
 const star = '50,17 54,30 68,30 57,38 61,52 50,44 39,52 43,38 32,30 46,30';
 return <svg className="locale-flag" viewBox="0 0 100 60" aria-hidden="true" focusable="false">
  {locale==='vi' && <><path fill="#da251d" d="M0 0h100v60H0z"/><polygon fill="#ffdf00" points={star}/></>}
  {locale==='en' && <><path fill="#012169" d="M0 0h100v60H0z"/><path d="M0 0l100 60M100 0L0 60" stroke="#fff" strokeWidth="13"/><path d="M0 0l100 60M100 0L0 60" stroke="#c8102e" strokeWidth="5"/><path d="M50 0v60M0 30h100" stroke="#fff" strokeWidth="20"/><path d="M50 0v60M0 30h100" stroke="#c8102e" strokeWidth="11"/></>}
  {locale==='zh' && <><path fill="#de2910" d="M0 0h100v60H0z"/><polygon fill="#ffde00" points="20,7 22.9,15.8 32.1,15.8 24.6,21.2 27.5,30 20,24.6 12.5,30 15.4,21.2 7.9,15.8 17.1,15.8"/><g fill="#ffde00"><polygon points="40,5 41,8 44,8 41.5,10 42.5,13 40,11 37.5,13 38.5,10 36,8 39,8"/><polygon points="48,14 49,17 52,17 49.5,19 50.5,22 48,20 45.5,22 46.5,19 44,17 47,17"/><polygon points="48,26 49,29 52,29 49.5,31 50.5,34 48,32 45.5,34 46.5,31 44,29 47,29"/><polygon points="40,35 41,38 44,38 41.5,40 42.5,43 40,41 37.5,43 38.5,40 36,38 39,38"/></g></>}
  {locale==='ko' && <><path fill="#fff" d="M0 0h100v60H0z"/><circle cx="50" cy="30" r="15" fill="#cd2e3a"/><path d="M35 30a15 15 0 0 0 30 0c0-4.1-3.4-7.5-7.5-7.5S50 25.9 50 30s-3.4 7.5-7.5 7.5S35 34.1 35 30" fill="#0047a0"/><g stroke="#111" strokeWidth="3"><path d="M15 13l10 7m-13-3l10 7m-13-3l10 7M75 40l10 7m-13-3l10 7m-13-3l10 7"/><path d="M75 20l4-3m2-1l4-3M72 24l10-7M69 28l4-3m2-1l4-3M15 47l4-3m2-1l4-3M12 51l4-3m2-1l4-3M9 55l4-3m2-1l4-3"/></g></>}
  {locale==='ja' && <><path fill="#fff" d="M0 0h100v60H0z"/><circle cx="50" cy="30" r="18" fill="#bc002d"/></>}
 </svg>;
}
