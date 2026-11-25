import {useEffect, useRef, useState} from 'react';
import {ArrowUp, MessageCircle, Phone, X} from 'lucide-react';
import {useLocation} from 'react-router-dom';
import {useTranslation} from './i18n';
import {company} from './company';
import './SupportTools.css';

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
      <a href={`tel:${company.tel}`}><Phone size={19}/><span>{label.phone}</span></a>
      <a href={company.zalo} target="_blank" rel="noreferrer"><b aria-hidden="true">Z</b><span>{label.zalo}</span></a>
      <a href={company.facebook} target="_blank" rel="noreferrer"><b aria-hidden="true">f</b><span>{label.facebook}</span></a>
      <button type="button" onClick={() => {setOpen(false); launcher.current?.focus(); onConsultation();}}><MessageCircle size={19}/><span>{label.consultation}</span></button>
      <button type="button" onClick={() => {setOpen(false); window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}); launcher.current?.focus();}}><ArrowUp size={19}/><span>{label.top}</span></button>
    </div>}
    <button ref={launcher} type="button" className="support-launcher" aria-label={open?label.close:label.open} aria-expanded={open} aria-controls="support-panel" onClick={() => {if (!open) document.dispatchEvent(new window.CustomEvent('header-overlay-open',{detail:{owner:'support'}})); setOpen(!open);}}>{open?<X size={21}/>:<MessageCircle size={21}/>}</button>
  </div>;
}
