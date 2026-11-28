import {useEffect, useRef, useState} from 'react';
import {ChevronUp, MessageCircle, Phone, X} from 'lucide-react';
import {useLocation} from 'react-router-dom';
import {useTranslation} from './i18n';
import {company} from './company';
import './SupportTools.css';

function ScrollToTop({label, routeKey}: {label:string; routeKey:string}) {
  const button = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const control = button.current;
    if (!control) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const page = document.scrollingElement ?? document.documentElement;
      const distance = page.scrollHeight - (document.documentElement.clientHeight || window.innerHeight);
      const ratio = distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0;
      const atTop = ratio === 0;
      if (atTop && document.activeElement === control) {
        document.querySelector<HTMLElement>('.site-header .brand')?.focus({preventScroll:true});
      }
      control.hidden = atTop;
      control.style.setProperty('--scroll-remaining', String(100 * (1 - ratio)));
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    const resize = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule);
    resize?.observe(document.body);
    window.addEventListener('scroll', schedule, {passive:true});
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      resize?.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [routeKey]);
  return <button type="button" ref={button} className="scroll-to-top" hidden aria-label={label} title={label}
    onClick={() => window.scrollTo({top:0, behavior:window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'})}>
    <svg className="scroll-ring" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <circle className="scroll-ring-track" cx="24" cy="24" r="20.5"/>
      <circle className="scroll-ring-value" cx="24" cy="24" r="20.5" pathLength="100"/>
    </svg>
    <ChevronUp size={22} strokeWidth={2.5} aria-hidden="true"/>
  </button>;
}

export function SupportTools({onConsultation}: {onConsultation: () => void}) {
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const t = useTranslation();
  useEffect(() => { setOpen(false); }, [location.key]);
  useEffect(() => {
    if (!open) return;
    wrapper.current?.querySelector<HTMLAnchorElement>('.support-panel a')?.focus();
    const outside = (event: PointerEvent) => {
      if (!wrapper.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        launcher.current?.focus();
      }
    };
    const closeOverlay = () => setOpen(false);
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    document.addEventListener('header-overlay-open', closeOverlay);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape);
      document.removeEventListener('header-overlay-open', closeOverlay);
    };
  }, [open]);
  const label = {
    open:t({vi:'Mở hỗ trợ nhanh',en:'Open support',zh:'打开快捷支持',ko:'빠른 지원 열기',ja:'サポートを開く'}),
    close:t({vi:'Đóng hỗ trợ nhanh',en:'Close support',zh:'关闭快捷支持',ko:'빠른 지원 닫기',ja:'サポートを閉じる'}),
    phone:t({vi:'Gọi hotline',en:'Call hotline',zh:'拨打热线',ko:'전화 상담',ja:'電話する'}),
    zalo:t({vi:'Liên hệ Zalo',en:'Contact on Zalo',zh:'通过 Zalo 联系',ko:'Zalo 문의',ja:'Zaloで問い合わせ'}),
    facebook:t({vi:'Liên hệ Facebook',en:'Contact on Facebook',zh:'通过 Facebook 联系',ko:'Facebook 문의',ja:'Facebookで問い合わせ'}),
    consultation:t({vi:'Gửi yêu cầu tư vấn',en:'Request consultation',zh:'申请咨询',ko:'상담 요청',ja:'相談を申し込む'}),
    top:t({vi:'Lên đầu trang',en:'Back to top',zh:'返回顶部',ko:'맨 위로',ja:'ページ上部へ'})
  };
  return <div className="floating-tools support-tools" ref={wrapper}>
    {open && <div className="support-panel" id="support-panel" aria-label={label.open}>
      <a href={`tel:${company.tel}`}><Phone size={19} aria-hidden="true"/><span>{label.phone}</span></a>
      <a href={company.zalo} target="_blank" rel="noreferrer">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="15" rx="4"/><path d="M8.5 9.5h7l-7 5h7"/></svg>
        <span>{label.zalo}</span>
      </a>
      <a href={company.facebook} target="_blank" rel="noreferrer">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.6V4.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1v2.1H8v3h2.3V21h3.2Z"/></svg>
        <span>{label.facebook}</span>
      </a>
      <button type="button" onClick={() => {setOpen(false); launcher.current?.focus(); onConsultation();}}><MessageCircle size={19} aria-hidden="true"/><span>{label.consultation}</span></button>
    </div>}
    <ScrollToTop label={label.top} routeKey={location.key}/>
    <button ref={launcher} type="button" className="support-launcher" aria-label={open?label.close:label.open} aria-expanded={open} aria-controls="support-panel" onClick={() => {if (!open) document.dispatchEvent(new window.CustomEvent('header-overlay-open',{detail:{owner:'support'}})); setOpen(!open);}}>{open?<X size={21}/>:<MessageCircle size={21}/>}</button>
  </div>;
}
