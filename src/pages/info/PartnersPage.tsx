import {Link} from 'react-router-dom';
import {PageMasthead} from '../../PageMasthead';
import {partners} from '../../partners';
import {ServiceCustomers} from './ServicesPages';
import './partners-reference.css';

export function PartnersPage(){
  return <div className="md-partners-grid">
    <PageMasthead title="Đối tác & kết nối" description="Các đơn vị được nêu trong hồ sơ thông tin Minh Đức."/>
    {partners.length ? <ServiceCustomers/> : <p className="container partners-empty">Liên hệ Minh Đức để hỏi thêm về mạng lưới đối tác.</p>}
    <section className="section container partners-contact">
      <h2>Bắt đầu một cuộc trao đổi</h2>
      <p>Nếu đang tìm việc, bạn có thể kiểm tra các vị trí đang tuyển trong danh sách việc làm.</p>
      <div className="partners-actions"><Link className="btn" to="/about-us#business-contact">Gửi nhu cầu nhân lực</Link>
        <Link className="partners-secondary" to="/jobs">Xem việc đang tuyển</Link></div>
    </section>
  </div>;
}
