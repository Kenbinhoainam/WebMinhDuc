import {company} from './company';
import {useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowRight,Phone,Mail} from 'lucide-react';
import {navigation} from './navigation';
import {Modal} from './shared';
import './footer-reference.css';

function SocialLinks({mobile=false}:{mobile?:boolean}){return <div className={`footer-social ${mobile?'footer-social-mobile':'footer-social-desktop'}`}><a href={company.facebook} target="_blank" rel="noreferrer" aria-label="Facebook Minh Đức"><img src="/mirror/www.hr2b.com/wp-content/uploads/2025/09/fb.svg" alt="" width="24" height="24" loading="lazy"/></a><a href={company.zalo} target="_blank" rel="noreferrer" aria-label="Liên hệ Zalo"><img src="/mirror/www.hr2b.com/wp-content/themes/canhcamtheme/img/zalo.svg" alt="" width="24" height="24" loading="lazy"/></a></div>}
function FooterMenu({mobile=false}:{mobile?:boolean}){return <nav className={`footer-menu ${mobile?'footer-menu-mobile':'footer-menu-desktop'}`} aria-label="Khám phá"><ul>{[...navigation.filter((_,i)=>[1,2,3,4,5].includes(i)),["/events","Sự kiện"]].map(([to,title])=><li key={to}><Link to={to}>{title}</Link></li>)}</ul></nav>}
export default function Footer(){
  const [email,setEmail]=useState(''),[feedback,setFeedback]=useState(''),[subscribe,setSubscribe]=useState(false);
  return <footer className="site-footer reference-footer section-py">
    <div className="container">
      <div className="footer-top">
        <Link className="footer-logo" to="/" aria-label="Minh Đức — Trang chủ"><img src="/assets/minh-duc-logo-transparent.webp" alt="Minh Đức Vina" width="384" height="274" loading="lazy"/></Link>
        <FooterMenu/>
        <SocialLinks/>
      </div>
      <FooterMenu mobile/>
      <div className="footer-bottom">
        <div className="footer-address">
          <h2 className="footer-title">CÔNG TY TNHH NHÂN LỰC MINH ĐỨC VINA</h2>
          <div className="footer-content"><p>Nhân lực là tài sản.</p><p>Cung ứng nhân lực · Tư vấn và giới thiệu việc làm</p><ul><li><a href={`tel:${company.tel}`}><Phone size={16}/>{company.phone}</a></li><li><a href={`mailto:${company.email}`}><Mail size={16}/>{company.email}</a></li>{company.offices.map(office=><li key={office.name}><a href={office.map} target="_blank" rel="noreferrer">{office.name} · {office.address}</a></li>)}</ul></div>
        </div>
        <div className="footer-form-wrap"><h2 className="footer-title">Đăng ký trải nghiệm nhận thông tin việc làm và hoạt động.</h2><button className="btn footer-subscribe" type="button" aria-haspopup="dialog" onClick={()=>setSubscribe(true)}>Đăng ký nhận bản tin</button></div>
      </div>

      <div className="footer-copyright"><div><p>© {new Date().getFullYear()} Minh Đức Vina.</p><small>Prototype · Nội dung minh họa</small></div><SocialLinks mobile/><nav className="copyright-link"><Link to="/privacy-policy">Chính sách bảo mật</Link><Link to="/terms-of-use">Điều khoản sử dụng</Link><Link to="/contact">Liên hệ & chi nhánh</Link></nav></div>
    </div>
    {subscribe&&<Modal title="Đón nhận cơ hội mới" onClose={()=>setSubscribe(false)}><form className="newsletter-dialog" onSubmit={event=>{event.preventDefault();setFeedback('Đã đăng ký thử. Email chưa được gửi hoặc lưu.');setEmail('')}}><label>Email<input required type="email" aria-label="Email nhận bản tin" placeholder="Email của bạn" value={email} onChange={event=>setEmail(event.target.value)}/></label><button className="btn" type="submit">Đăng ký nhận bản tin <ArrowRight size={20}/></button><p role="status">{feedback||'Biểu mẫu minh họa trong prototype.'}</p></form></Modal>}
  </footer>
}
