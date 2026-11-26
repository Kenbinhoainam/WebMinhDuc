import {lazy,Suspense,useEffect,useState,useRef} from 'react';
import {Routes,Route,Link,useLocation,useNavigationType,Navigate} from 'react-router-dom';
import {X} from 'lucide-react';
import {useTranslation} from './i18n';
import {SupportTools} from './SupportTools';
import Home from './Home';
import Footer from './Footer';
import {ContactForm,ContactPage} from './Contact';
import {ContactContext,Modal,NotFound} from './shared';
const JobsPage=lazy(()=>import('./JobsPages').then(m=>({default:m.JobsPage})));
const JobDetailPage=lazy(()=>import('./JobsPages').then(m=>({default:m.JobDetailPage})));
const CareersPage=lazy(()=>import('./JobsPages').then(m=>({default:m.CareersPage})));
const SavedJobsPage=lazy(()=>import('./JobsPages').then(m=>({default:m.SavedJobsPage})));
const AboutPage=lazy(()=>import('./pages/info/AboutPage').then(m=>({default:m.AboutPage})));
const ServicesPage=lazy(()=>import('./pages/info/ServicesPages').then(m=>({default:m.ServicesPage})));
const ServicePage=lazy(()=>import('./pages/info/ServicesPages').then(m=>({default:m.ServicePage})));
const NewsPage=lazy(()=>import('./EditorialPages').then(m=>({default:m.NewsPage})));
const ArticlePage=lazy(()=>import('./EditorialPages').then(m=>({default:m.ArticlePage})));
const EventsPage=lazy(()=>import('./EditorialPages').then(m=>({default:m.EventsPage})));
const EventPage=lazy(()=>import('./EditorialPages').then(m=>({default:m.EventPage})));
const PolicyPage=lazy(()=>import('./EditorialPages').then(m=>({default:m.PolicyPage})));
const PartnersPage=lazy(()=>import('./pages/info/PartnersPage').then(m=>({default:m.PartnersPage})));
import {MotionController} from './motion';
import './jobs.css';
import './info.css';
import {Header} from './Header';
export {Header} from './Header';
const ConsultationPage=lazy(()=>import('./Consultation'));
const EducationPage=lazy(()=>import('./Education').then(m=>({default:m.EducationPage})));
const EducationDetailPage=lazy(()=>import('./Education').then(m=>({default:m.EducationDetailPage})));
const AdminDemo=lazy(()=>import('./AdminDemo').then(m=>({default:m.AdminDemo})));
import './sprint-navigation.css';
function CookieNotice() {
  const t=useTranslation();
  const [show,setShow]=useState(true);
  useEffect(()=>{try{setShow(!localStorage.getItem('minhduc.preferences'))}catch{}},[]);
  function dismiss() {
    try{localStorage.setItem('minhduc.preferences','essential-only')}catch{}
    setShow(false);
  }
  return show && <aside className="cookie-notice" aria-label={t({vi:'Thông tin lưu trữ',en:'Device storage',zh:'本机存储',ko:'기기 저장 정보',ja:'端末への保存'})}>
    <p>{t({vi:'Việc làm bạn lưu được giữ trên thiết bị này.',en:'Your saved jobs are stored on this device.',zh:'收藏的职位保存在本设备上。',ko:'저장한 일자리는 이 기기에 보관됩니다.',ja:'保存した求人はこの端末に記録されます。'})}{' '}
      <Link to="/privacy-policy">{t({vi:'Quyền riêng tư',en:'Privacy',zh:'隐私政策',ko:'개인정보 처리방침',ja:'プライバシー'})}</Link>
    </p>
    <button type="button" className="icon-button" onClick={dismiss} aria-label={t({vi:'Đóng thông báo lưu trữ',en:'Dismiss storage notice',zh:'关闭存储提示',ko:'저장 안내 닫기',ja:'保存の案内を閉じる'})}><X size={17}/></button>
  </aside>;
}
const scrollPositions=new Map<string,number>();
export function PageTransition(){
  const location=useLocation(), navigationType=useNavigationType();
  const previous=useRef<{pathname:string;hash:string}|null>(null);
  useEffect(()=>{const original=window.history.scrollRestoration;window.history.scrollRestoration='manual';return()=>{window.history.scrollRestoration=original}},[]);
  useEffect(()=>{
    const {key,hash,pathname}=location;
    const prior=previous.current;
    const pathChanged=prior!==null&&prior.pathname!==pathname;
    let frame=0, attempts=0;
    if(navigationType==='POP'&&prior!==null&&scrollPositions.has(key)){
      window.scrollTo({top:scrollPositions.get(key),behavior:'instant'});
    }else if(hash){
      const findAnchor=()=>{let target:HTMLElement|null=null;try{target=document.getElementById(decodeURIComponent(hash.slice(1)))}catch{}if(target){target.scrollIntoView();if(navigationType==='PUSH'&&target.hasAttribute('tabindex'))target.focus({preventScroll:true});}else if(attempts++<30)frame=requestAnimationFrame(findAnchor)};
      frame=requestAnimationFrame(findAnchor);
    }else if(pathChanged){
      if(navigationType==='POP')window.scrollTo({top:scrollPositions.get(key)??0,behavior:'instant'});
      else{window.scrollTo({top:0,behavior:'instant'});frame=requestAnimationFrame(()=>document.querySelector<HTMLElement>('main')?.focus({preventScroll:true}))}
    }
    previous.current={pathname,hash};
    const savePosition=()=>scrollPositions.set(key,window.scrollY);
    window.addEventListener('scroll',savePosition,{passive:true});
    return()=>{cancelAnimationFrame(frame);savePosition();window.removeEventListener('scroll',savePosition)};
  },[location.key,location.pathname,location.hash,navigationType]);
  return null;
}
export default function App(){const [contact,setContact]=useState<string|null>(null);const location=useLocation();useEffect(()=>setContact(null),[location.pathname]);return <ContactContext.Provider value={(service)=>setContact(service||'Cung ứng nhân lực')}><a className="skip-link" href="#main">Bỏ qua đến nội dung</a><Header/><MotionController/><PageTransition/><main id="main" tabIndex={-1}><Suspense fallback={<div className="section route-loading" role="status">Đang tải nội dung…</div>}><Routes><Route path="/" element={<Home/>}/><Route path="/about-us" element={<AboutPage/>}/><Route path="/services" element={<ServicesPage/>}/><Route path="/services/:slug" element={<ServicePage/>}/><Route path="/jobs" element={<JobsPage/>}/><Route path="/jobs/:slug" element={<JobDetailPage/>}/><Route path="/saved-jobs" element={<SavedJobsPage/>}/><Route path="/careers" element={<CareersPage/>}/><Route path="/education" element={<EducationPage/>}/><Route path="/education/:slug" element={<EducationDetailPage/>}/><Route path="/admin-demo" element={<AdminDemo/>}/><Route path="/news" element={<NewsPage/>}/><Route path="/news/:slug" element={<ArticlePage/>}/><Route path="/events" element={<EventsPage/>}/><Route path="/events/:slug" element={<EventPage/>}/><Route path="/partners" element={<PartnersPage/>}/><Route path="/testimonials" element={<PartnersPage/>}/><Route path="/contact" element={<ContactPage/>}/><Route path="/consultation" element={<ConsultationPage/>}/><Route path="/e-brochure" element={<Navigate to="/about-us#profile" replace/>}/><Route path="/privacy-policy" element={<PolicyPage kind="privacy"/>}/><Route path="/terms-of-use" element={<PolicyPage kind="terms"/>}/><Route path="/job-seekers" element={<Navigate to={{pathname:"/jobs",search:location.search,hash:location.hash}} replace/>}/><Route path="/vi" element={<Navigate to="/" replace/>}/><Route path="*" element={<NotFound/>}/></Routes></Suspense></main><Footer/><SupportTools onConsultation={()=>setContact('Cung ứng nhân lực')}/><CookieNotice/>{contact!==null&&<Modal title="Yêu cầu tư vấn" onClose={()=>setContact(null)}><ContactForm initialService={contact} onNavigate={()=>setContact(null)}/></Modal>}</ContactContext.Provider>}
