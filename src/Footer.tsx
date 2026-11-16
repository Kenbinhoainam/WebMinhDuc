import {useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowRight,Phone,Mail,Facebook} from 'lucide-react';
import {navigation} from './navigation';
import {Modal} from './shared';
import './footer-reference.css';

export default function Footer(){
  const [email,setEmail]=useState(''),[feedback,setFeedback]=useState(''),[subscribe,setSubscribe]=useState(false);
  return <footer className="site-footer reference-footer section-py">
    <div className="container">
      <div className="footer-top">
        <Link className="footer-logo" to="/" aria-label="Minh Đức — Trang chủ"><img src="/assets/minh-duc-logo.jpg" alt="Minh Đức Vina" width="80" height="80" loading="lazy"/></Link>
        <nav className="footer-menu" aria-label="Khám phá"><ul>{navigation.filter((_,i)=>[1,2,3,4,5].includes(i)).map(([to,title])=><li key={to}><Link to={to}>{title}</Link></li>)}</ul></nav>
        <div className="footer-social"><a href="https://www.facebook.com/md668.com.vn" target="_blank" rel="noreferrer" aria-label="Facebook Minh Đức"><Facebook size={22}/></a><a href="https://zalo.me/0329138082" target="_blank" rel="noreferrer" aria-label="Liên hệ Zalo">Zalo</a></div>
      </div>
      <div className="footer-bottom">
        <div className="footer-address">
          <h2 className="footer-title">CÔNG TY TNHH NHÂN LỰC MINH ĐỨC VINA</h2>
          <div className="footer-content"><p>Nhân lực là tài sản.</p><p>Cung ứng nhân lực · Tư vấn và giới thiệu việc làm</p><ul><li><a href="tel:0364562868"><Phone size={16}/>0364 562 868</a></li><li><a href="mailto:vieclamminhduc.vpv2@gmail.com"><Mail size={16}/>vieclamminhduc.vpv2@gmail.com</a></li><li><Link to="/contact">Vôi · Bắc Ninh · Quảng Ninh</Link></li></ul></div>
        </div>
        <div className="footer-form-wrap"><h2 className="footer-title">Đón nhận cơ hội mới</h2><p>Đăng ký trải nghiệm nhận thông tin việc làm và hoạt động.</p><button className="btn footer-subscribe" type="button" aria-haspopup="dialog" onClick={()=>setSubscribe(true)}>Đăng ký nhận bản tin</button></div>
      </div>

      <div className="footer-copyright"><div><p>© {new Date().getFullYear()} Minh Đức Vina.</p><small>Prototype · Hình ảnh tham chiếu từ HR2B</small></div><nav className="copyright-link"><Link to="/privacy-policy">Chính sách bảo mật</Link><Link to="/terms-of-use">Điều khoản sử dụng</Link><Link to="/contact">Liên hệ & chi nhánh</Link></nav></div>
    </div>
    {subscribe&&<Modal title="Đón nhận cơ hội mới" onClose={()=>setSubscribe(false)}><form className="newsletter-dialog" onSubmit={event=>{event.preventDefault();setFeedback('Đã đăng ký thử. Email chưa được gửi hoặc lưu.');setEmail('')}}><label>Email<input required type="email" aria-label="Email nhận bản tin" placeholder="Email của bạn" value={email} onChange={event=>setEmail(event.target.value)}/></label><button className="btn" type="submit">Đăng ký nhận bản tin <ArrowRight size={20}/></button><p role="status">{feedback||'Biểu mẫu minh họa trong prototype.'}</p></form></Modal>}
  </footer>
}
