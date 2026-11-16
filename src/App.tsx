import {lazy,Suspense,useEffect,useState,useRef} from 'react';
import {Routes,Route,Link,useLocation,useNavigationType,Navigate} from 'react-router-dom';
import {X,Phone,ArrowUpRight,ArrowUp,ArrowRight,MessageCircle} from 'lucide-react';
import Home from './Home';
import {ContactForm,ContactPage} from './Contact';
import {ContactContext,Modal,NotFound} from './shared';
import {JobsPage,JobDetailPage,CareersPage,SavedJobsPage} from './JobsPages';
const AboutPage=lazy(()=>import('./InfoPages').then(m=>({default:m.AboutPage})));
const ServicesPage=lazy(()=>import('./InfoPages').then(m=>({default:m.ServicesPage})));
const ServicePage=lazy(()=>import('./InfoPages').then(m=>({default:m.ServicePage})));
const NewsPage=lazy(()=>import('./InfoPages').then(m=>({default:m.NewsPage})));
const ArticlePage=lazy(()=>import('./InfoPages').then(m=>({default:m.ArticlePage})));
const EventsPage=lazy(()=>import('./InfoPages').then(m=>({default:m.EventsPage})));
const EventPage=lazy(()=>import('./InfoPages').then(m=>({default:m.EventPage})));
const PolicyPage=lazy(()=>import('./InfoPages').then(m=>({default:m.PolicyPage})));
const BrochurePage=lazy(()=>import('./InfoPages').then(m=>({default:m.BrochurePage})));
const PartnersPage=lazy(()=>import('./InfoPages').then(m=>({default:m.PartnersPage})));
import {MotionController} from './motion';
import './jobs.css';
import './info.css';
import {Header} from './Header';
export {Header} from './Header';
import {navigation} from './navigation';
const EducationPage=lazy(()=>import('./Education').then(m=>({default:m.EducationPage})));
const EducationDetailPage=lazy(()=>import('./Education').then(m=>({default:m.EducationDetailPage})));
const AdminDemo=lazy(()=>import('./AdminDemo').then(m=>({default:m.AdminDemo})));
import './sprint-navigation.css';
function Footer(){const [email,setEmail]=useState(''),[feedback,setFeedback]=useState('');return <footer className="site-footer"><div className="container"><div className="footer-top"><div><span className="footer-brand-name">MINH ĐỨC<span>VINA</span></span><p>Nhân lực là tài sản.</p></div><a className="footer-hotline" href="tel:0364562868"><span>CÙNG BẠN TÌM GIẢI PHÁP</span><strong>0364 562 868 <ArrowUpRight/></strong></a></div><div className="footer-grid"><div><h3>Kết nối cùng Minh Đức</h3><p>CÔNG TY TNHH NHÂN LỰC<br/>MINH ĐỨC VINA</p><p>Cung ứng nhân lực · Tư vấn và giới thiệu việc làm</p><div className="footer-social"><a href="https://www.facebook.com/md668.com.vn" target="_blank" rel="noreferrer">Facebook <ArrowUpRight size={14}/></a><a href="https://zalo.me/0329138082" target="_blank" rel="noreferrer">Zalo <ArrowUpRight size={14}/></a></div></div><div><h3>Khám phá</h3>{navigation.filter((_,i)=>[1,2,3,4,5].includes(i)).map(([to,title])=><Link key={to} to={to}>{title}</Link>)}</div><div><h3>Hỗ trợ</h3><Link to="/contact">Liên hệ & chi nhánh</Link><Link to="/saved-jobs">Việc làm đã lưu</Link><Link to="/e-brochure">Hồ sơ năng lực</Link><Link to="/education">Tuyển sinh</Link><Link to="/admin-demo">Trải nghiệm quản trị mẫu</Link><Link to="/privacy-policy">Chính sách bảo mật</Link><Link to="/terms-of-use">Điều khoản sử dụng</Link></div><div><h3>Đón nhận cơ hội mới</h3><p>Đăng ký trải nghiệm nhận thông tin việc làm và hoạt động.</p><form className="newsletter" onSubmit={e=>{e.preventDefault();setFeedback('Đã đăng ký thử. Email chưa được gửi hoặc lưu.');setEmail('')}}><input required type="email" aria-label="Email nhận bản tin" placeholder="Email của bạn" value={email} onChange={e=>setEmail(e.target.value)}/><button type="submit" aria-label="Đăng ký nhận bản tin"><ArrowRight size={20}/></button></form><small role="status">{feedback||'Biểu mẫu minh họa trong prototype.'}</small></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Minh Đức Vina.</span><span>Prototype · Hình ảnh tham chiếu từ HR2B</span><Link to="/contact">Vôi · Bắc Ninh · Quảng Ninh</Link></div></div></footer>}
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
export default function App(){const [contact,setContact]=useState<string|null>(null),[tools,setTools]=useState(false);const location=useLocation();useEffect(()=>setContact(null),[location.pathname]);return <ContactContext.Provider value={(service)=>setContact(service||'Cung ứng nhân lực')}><a className="skip-link" href="#main">Bỏ qua đến nội dung</a><Header/><MotionController/><PageTransition/><main id="main" tabIndex={-1}><Suspense fallback={<div className="section route-loading" role="status">Đang tải nội dung…</div>}><Routes><Route path="/" element={<Home/>}/><Route path="/about-us" element={<AboutPage/>}/><Route path="/services" element={<ServicesPage/>}/><Route path="/services/:slug" element={<ServicePage/>}/><Route path="/jobs" element={<JobsPage/>}/><Route path="/jobs/:slug" element={<JobDetailPage/>}/><Route path="/saved-jobs" element={<SavedJobsPage/>}/><Route path="/careers" element={<CareersPage/>}/><Route path="/education" element={<EducationPage/>}/><Route path="/education/:slug" element={<EducationDetailPage/>}/><Route path="/admin-demo" element={<AdminDemo/>}/><Route path="/news" element={<NewsPage/>}/><Route path="/news/:slug" element={<ArticlePage/>}/><Route path="/events" element={<EventsPage/>}/><Route path="/events/:slug" element={<EventPage/>}/><Route path="/partners" element={<PartnersPage/>}/><Route path="/testimonials" element={<PartnersPage/>}/><Route path="/contact" element={<ContactPage/>}/><Route path="/e-brochure" element={<BrochurePage/>}/><Route path="/privacy-policy" element={<PolicyPage kind="privacy"/>}/><Route path="/terms-of-use" element={<PolicyPage kind="terms"/>}/><Route path="/job-seekers" element={<Navigate to="/jobs" replace/>}/><Route path="/vi" element={<Navigate to="/" replace/>}/><Route path="*" element={<NotFound/>}/></Routes></Suspense></main><Footer/><div className="floating-tools">{tools&&<div className="floating-expanded"><a href="tel:0364562868" aria-label="Gọi hotline"><Phone size={20}/></a><a href="https://zalo.me/0329138082" target="_blank" rel="noreferrer" aria-label="Liên hệ Zalo">Zalo</a><a href="https://www.facebook.com/md668.com.vn" target="_blank" rel="noreferrer" aria-label="Facebook Minh Đức">f</a><button aria-label="Lên đầu trang" onClick={()=>window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}><ArrowUp size={20}/></button></div>}<button aria-label="Mở yêu cầu tư vấn" onClick={()=>setContact('Cung ứng nhân lực')}><MessageCircle size={21}/></button><button aria-label={tools?'Thu gọn hỗ trợ':'Mở hỗ trợ nhanh'} aria-expanded={tools} onClick={()=>setTools(!tools)}>{tools?<X size={22}/>:<span className="plus">+</span>}</button></div><CookieNotice/>{contact!==null&&<Modal title="Yêu cầu tư vấn" onClose={()=>setContact(null)}><ContactForm initialService={contact} onNavigate={()=>setContact(null)}/></Modal>}</ContactContext.Provider>}
