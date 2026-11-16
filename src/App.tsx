import {lazy,Suspense,useEffect,useState,useRef} from 'react';
import {Routes,Route,Link,useLocation,useNavigationType,Navigate} from 'react-router-dom';
import {X,Phone,ArrowUpRight,ArrowUp,MessageCircle} from 'lucide-react';
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
const BrochurePage=lazy(()=>import('./pages/info/BrochurePage').then(m=>({default:m.BrochurePage})));
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
function CookieNotice(){const [show,setShow]=useState(true);useEffect(()=>{try{setShow(!localStorage.getItem('minhduc.preferences'))}catch{}},[]);function dismiss(){try{localStorage.setItem('minhduc.preferences','essential-only')}catch{}setShow(false)}return show?<aside className="cookie-notice" aria-label="Thông tin lưu trữ"><div><strong>Một trải nghiệm thuận tiện hơn</strong><p>Website lưu lựa chọn và việc làm bạn đánh dấu ngay trên thiết bị. Không dùng cookie quảng cáo.</p><Link to="/privacy-policy">Tìm hiểu thêm</Link></div><button className="btn" onClick={dismiss}>Đã hiểu</button><button className="icon-button" aria-label="Đóng thông báo lưu trữ" onClick={dismiss}><X size={18}/></button></aside>:null}
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
      const findAnchor=()=>{let target:HTMLElement|null=null;try{target=document.getElementById(decodeURIComponent(hash.slice(1)))}catch{}if(target)target.scrollIntoView();else if(attempts++<30)frame=requestAnimationFrame(findAnchor)};
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
export default function App(){const [contact,setContact]=useState<string|null>(null),[tools,setTools]=useState(false);const location=useLocation();useEffect(()=>setContact(null),[location.pathname]);return <ContactContext.Provider value={(service)=>setContact(service||'Cung ứng nhân lực')}><a className="skip-link" href="#main">Bỏ qua đến nội dung</a><Header/><MotionController/><PageTransition/><main id="main" tabIndex={-1}><Suspense fallback={<div className="section route-loading" role="status">Đang tải nội dung…</div>}><Routes><Route path="/" element={<Home/>}/><Route path="/about-us" element={<AboutPage/>}/><Route path="/services" element={<ServicesPage/>}/><Route path="/services/:slug" element={<ServicePage/>}/><Route path="/jobs" element={<JobsPage/>}/><Route path="/jobs/:slug" element={<JobDetailPage/>}/><Route path="/saved-jobs" element={<SavedJobsPage/>}/><Route path="/careers" element={<CareersPage/>}/><Route path="/education" element={<EducationPage/>}/><Route path="/education/:slug" element={<EducationDetailPage/>}/><Route path="/admin-demo" element={<AdminDemo/>}/><Route path="/news" element={<NewsPage/>}/><Route path="/news/:slug" element={<ArticlePage/>}/><Route path="/events" element={<EventsPage/>}/><Route path="/events/:slug" element={<EventPage/>}/><Route path="/partners" element={<PartnersPage/>}/><Route path="/testimonials" element={<PartnersPage/>}/><Route path="/contact" element={<ContactPage/>}/><Route path="/consultation" element={<ConsultationPage/>}/><Route path="/e-brochure" element={<BrochurePage/>}/><Route path="/privacy-policy" element={<PolicyPage kind="privacy"/>}/><Route path="/terms-of-use" element={<PolicyPage kind="terms"/>}/><Route path="/job-seekers" element={<Navigate to="/jobs" replace/>}/><Route path="/vi" element={<Navigate to="/" replace/>}/><Route path="*" element={<NotFound/>}/></Routes></Suspense></main><Footer/><div className="floating-tools">{tools&&<div className="floating-expanded"><a href="tel:0364562868" aria-label="Gọi hotline"><Phone size={20}/></a><a href="https://zalo.me/0329138082" target="_blank" rel="noreferrer" aria-label="Liên hệ Zalo">Zalo</a><a href="https://www.facebook.com/md668.com.vn" target="_blank" rel="noreferrer" aria-label="Facebook Minh Đức">f</a><button aria-label="Lên đầu trang" onClick={()=>window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}><ArrowUp size={20}/></button></div>}<button aria-label="Mở yêu cầu tư vấn" onClick={()=>setContact('Cung ứng nhân lực')}><MessageCircle size={21}/></button><button aria-label={tools?'Thu gọn hỗ trợ':'Mở hỗ trợ nhanh'} aria-expanded={tools} onClick={()=>setTools(!tools)}>{tools?<X size={22}/>:<span className="plus">+</span>}</button></div><CookieNotice/>{contact!==null&&<Modal title="Yêu cầu tư vấn" onClose={()=>setContact(null)}><ContactForm initialService={contact} onNavigate={()=>setContact(null)}/></Modal>}</ContactContext.Provider>}
