import {useState} from 'react';
import {Link} from 'react-router-dom';
import {Mail, Phone, MapPin} from 'lucide-react';
import {company} from './company';
import {navigation} from './navigation';
import {Modal} from './shared';
import './footer-reference.css';

export default function Footer() {
  const [subscribe, setSubscribe] = useState(false);
  const [registered, setRegistered] = useState(false);

  return <footer className="site-footer reference-footer">
    <div className="footer-shell">
      <div className="footer-top">
        <Link className="footer-logo" to="/" aria-label="Minh Đức — Trang chủ">
          <img src="/WebMinhDuc/assets/minh-duc-logo-transparent.webp" alt="Minh Đức Vina" width="384" height="274" loading="lazy"/>
        </Link>
        <div className="footer-brand-copy">
          <h2>CÔNG TY TNHH NHÂN LỰC MINH ĐỨC VINA</h2>
          <p>Cung ứng nhân lực · Tư vấn và giới thiệu việc làm</p>
        </div>
        <div className="footer-social">
          <a href={company.facebook} target="_blank" rel="noreferrer" aria-label="Facebook Minh Đức">Facebook</a>
          <a href={company.zalo} target="_blank" rel="noreferrer" aria-label="Liên hệ Zalo">Zalo</a>
        </div>
      </div>
      <div className="footer-bottom">
        <nav className="footer-menu" aria-label="Khám phá Minh Đức">
          <h3>Khám phá Minh Đức</h3>
          <ul>{navigation.slice(1).map(([to,title]) => <li key={to}><Link to={to}>{title}</Link></li>)}
            <li><Link to="/events">Hoạt động của Minh Đức Vina</Link></li>
          </ul>
        </nav>
        <div className="footer-offices">
          <h3>Điểm liên hệ</h3>
          <ul>{company.offices.map(office => <li key={office.name}>
            <a href={office.map} target="_blank" rel="noreferrer"><MapPin size={17} aria-hidden="true"/>
              <span><strong>{office.name}</strong><span>{office.address}</span></span>
            </a>
          </li>)}</ul>
        </div>
        <div className="footer-direct">
          <h3>Liên hệ</h3>
          <a className="footer-phone" href={`tel:${company.tel}`}><Phone size={18}/>{company.phone}</a>
          <a href={`mailto:${company.email}`}><Mail size={18}/>{company.email}</a>
          <button className="btn footer-subscribe" type="button" aria-haspopup="dialog"
            onClick={() => {setRegistered(false); setSubscribe(true);}}>Đăng ký nhận bản tin</button>
        </div>
      </div>
    </div>
    <div className="footer-legal"><div className="footer-shell footer-legal-inner">
      <div>© {new Date().getFullYear()} Minh Đức Vina. <small>Prototype · Nội dung minh họa</small></div>
      <nav aria-label="Thông tin pháp lý"><Link to="/privacy-policy">Chính sách bảo mật</Link><Link to="/terms-of-use">Điều khoản sử dụng</Link></nav>
    </div></div>
    {subscribe && <Modal title="Đón nhận cơ hội mới" onClose={() => setSubscribe(false)}>
      <form className="newsletter-dialog" onSubmit={event => {event.preventDefault(); event.currentTarget.reset(); setRegistered(true);}}>
        <label>Email<input required type="email" autoComplete="email" aria-label="Email nhận bản tin" placeholder="Email của bạn" onChange={() => setRegistered(false)}/></label>
        <button className="btn" type="submit">Đăng ký nhận bản tin</button>
        <p role="status">{registered ? 'Đã đăng ký thử. Email chưa được gửi hoặc lưu.' : 'Biểu mẫu minh họa trong prototype.'}</p>
      </form>
    </Modal>}
  </footer>;
}
