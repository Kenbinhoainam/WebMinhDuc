import {Link} from 'react-router-dom';
import {PageMasthead} from '../../PageMasthead';
import {partners} from '../../partners';
import {ServiceCustomers} from './ServicesPages';
import './partners-reference.css';

export function PartnersPage(){
  return <div className="md-partners-grid">
    <PageMasthead title="Đối tác & kết nối" description="Các đơn vị được nêu trong hồ sơ thông tin Minh Đức." image="/assets/minhduc-v18/industrial-campus.webp" imageAlt=""/>
    {partners.length ? <ServiceCustomers/> : <p className="container partners-empty">Liên hệ Minh Đức để hỏi thêm về mạng lưới đối tác.</p>}
    <section className="section partners-contact"><div className="container partners-contact-layout">
      <div><h2>Bắt đầu một cuộc trao đổi</h2>
      <p>Nhóm cung ứng làm rõ số người, nơi tiếp nhận và ngày cần nhân sự cho từng đợt tuyển.</p></div>
      <div className="partners-actions"><Link className="btn" to="/about-us#business-contact" state={{startForm:'F01'}}>Gửi nhu cầu nhân lực</Link>
        <Link className="partners-secondary" to="/jobs">Xem việc đang tuyển</Link></div>
    </div></section>
  </div>;
}
