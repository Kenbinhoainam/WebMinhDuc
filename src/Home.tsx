import {Link} from 'react-router-dom';
import {ArrowRight, ArrowUpRight} from 'lucide-react';
import {company} from './company';
import {AnimatedNumber, RevealFrame} from './motion';
import PartnersStrip from './PartnersStrip';
import {useTranslation} from './i18n';
import {ContactForm} from './Contact';
import HomeHero from './HomeHero';
import {HomeNews, HomeVideoGallery} from './HomeEditorial';
import {ServiceCards} from './ServiceShowcase';
import './home-reference.css';

// Reference values are illustrative prototype content and require verification before production.
const metrics = [
  {number:1200, suffix:'+', label:'Kết nối việc làm'},
  {number:80, suffix:'+', label:'Nhu cầu doanh nghiệp'},
  {number:15, suffix:'+', label:'Khu vực kết nối'},
  {number:95, suffix:'%', label:'Mức độ hài lòng'},
];

function About() {
  return <section id="about" className="section-home-about" aria-labelledby="home-about-title">
    <div className="home-content-width">
      <div className="home-introduction">
        <RevealFrame effect="left" className="home-introduction-copy">
          <h2 id="home-about-title" className="home-heading">Giới thiệu Minh Đức Vina</h2>
          <p>Minh Đức kết nối nhà máy phía Bắc với người lao động, từ lúc làm rõ vị trí đến khi hai bên trao đổi về công việc.</p>
          <p>Doanh nghiệp có thể trao đổi về nhân lực theo ca, lao động tay nghề và quy trình quản lý. Minh Đức cũng hỗ trợ người tìm việc và người học tìm hiểu các cơ hội phù hợp.</p>
          <Link className="home-about-action" to="/about-us#profile">Xem hồ sơ năng lực <ArrowRight size={18} aria-hidden="true"/></Link>
        </RevealFrame>
        <RevealFrame effect="right" className="home-team-portrait">
          <img src="/assets/minhduc-v16/recruitment-field.webp" sizes="(max-width: 639px) 72vw, (max-width: 1023px) 36vw, 460px" alt="Nhân viên Minh Đức cầm hồ sơ tuyển dụng tại hiện trường" loading="lazy" decoding="async"/>
        </RevealFrame>
      </div>
      <div className="home-figures" role="group" aria-label="Các chỉ số kết nối">
        {metrics.map((metric,index)=><RevealFrame key={metric.label} delayMs={300 + index * 200}>
          <div className="home-figure"><strong><AnimatedNumber value={metric.number} suffix={metric.suffix}/></strong><span>{metric.label}</span></div>
        </RevealFrame>)}
      </div>
    </div>
  </section>;
}

function Solutions() {
  return <section className="section-home-solution" aria-labelledby="home-services-title">
    <div className="home-content-width">
      <RevealFrame effect="zoom"><h2 className="home-heading" id="home-services-title">Giải pháp nhân lực toàn diện</h2></RevealFrame>
      <ServiceCards/>
      <Link to="/services" className="home-index-link">Xem tất cả dịch vụ <ArrowRight aria-hidden="true" size={18}/></Link>
    </div>
  </section>;
}

function Partners() {
  return <section className="section-home-partners" aria-labelledby="home-partners-title">
    <div className="home-content-width">
      <RevealFrame><h2 id="home-partners-title" className="home-heading">Đối tác tiêu biểu</h2></RevealFrame>
      <PartnersStrip/>
      <Link className="home-index-link" to="/partners">Xem danh sách đối tác <ArrowRight aria-hidden="true" size={18}/></Link>
    </div>
  </section>;
}

function BusinessContact() {
  const t = useTranslation();
  const description = t({
    vi:'Cho chúng tôi biết vị trí, số lượng và địa điểm bạn cần. Minh Đức sẵn sàng trao đổi để tìm phương án phù hợp.',
    en:'Tell us the roles, headcount and location you need. Minh Đức is ready to discuss an approach with you.',
    zh:'请告诉我们您需要的岗位、人数和地点。Minh Đức 愿与您共同探讨合适的方案。',
    ko:'필요한 직무, 인원과 지역을 알려주세요. Minh Đức가 적합한 방안을 함께 논의합니다.',
    ja:'必要な職種、人数、勤務地をお知らせください。Minh Đứcが適切な方法を一緒に検討します。',
  });
  return <section id="business-contact" tabIndex={-1} aria-labelledby="business-heading" className="home-b2b-contact">
    <div className="home-content-width home-b2b-contact-layout">
      <RevealFrame effect="left">
        <h2 id="business-heading" className="home-heading">Gửi nhu cầu nhân lực</h2>
        <p>{description}</p>
        <a className="home-b2b-phone" href={`tel:${company.tel}`}>{company.phone} <ArrowUpRight size={20} aria-hidden="true"/></a>
      </RevealFrame>
      <RevealFrame effect="right"><div className="home-b2b-form">
        <ContactForm initialMode="F01" lockMode source="home-business"/>
      </div></RevealFrame>
    </div>
  </section>;
}

export default function Home() {
  return <><HomeHero/><About/><Solutions/><Partners/><BusinessContact/><HomeNews/><HomeVideoGallery/></>;
}
