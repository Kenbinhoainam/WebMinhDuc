import {useRef} from 'react';
import {Link, useParams} from 'react-router-dom';
import {ArrowUpRight, ChevronLeft, ChevronRight} from 'lucide-react';
import {SectionHeading, useContact} from '../../shared';
import {PageMasthead} from '../../PageMasthead';
import {responsiveImage} from '../../media';
import {RevealFrame} from '../../motion';
import {useTranslation} from '../../i18n';
import {useHomeCarousel, advanceHomeRail} from '../../useHomeCarousel';
import {subnavigation} from '../../navigation';
import PartnersStrip from '../../PartnersStrip';
import {campusAlt, consultingTopics, industrialCampus, services, type Service} from './data';
import {ServiceCards, InfoContact, FAQ, InfoCarouselPause} from './components';
import './services-reference.css';

export function ServicesPage() {
  const openContact = useContact();
  return <>
    <div className="service-index-masthead">
      <PageMasthead eyebrow="Dịch vụ" title="Giải pháp nhân lực cho nhà máy và doanh nghiệp" description="Từ tuyển người theo ca đến tổ chức lại quy trình, chọn dịch vụ theo công việc bạn đang cần giải quyết." image={industrialCampus} imageAlt={campusAlt} imageCaption={campusAlt}>
        <div className="service-index-actions">
          <button className="btn" type="button" onClick={() => openContact(services[0].title)}>Gửi nhu cầu nhân lực</button>
          <Link className="service-inline-link" to="/jobs">Tôi đang tìm việc</Link>
        </div>
        <section className="service-directory" aria-labelledby="service-directory-heading">
          <h2 id="service-directory-heading">Bạn cần giải quyết việc gì?</h2>
          <nav aria-labelledby="service-directory-heading"><ul>{services.map(service =>
            <li key={service.slug}>
              <Link to={`/services/${service.slug}`}>
                <strong>{service.need}</strong>
                <span>{service.title}</span>
                <ArrowUpRight size={22} strokeWidth={1.6} aria-hidden="true"/>
              </Link>
            </li>)}</ul></nav>
        </section>
      </PageMasthead>
    </div>
    <section className="md-ref-service-metrics"><div className="container">
      <p>Số liệu mô phỏng cho giao diện</p>
      <div>{[['1.200+','Kết nối việc làm'],['80+','Nhu cầu doanh nghiệp'],['15+','Khu vực kết nối']].map(([value,label], i) =>
        <RevealFrame key={label} delay={i as 0|1|2}><article><strong>{value}</strong><span>{label}</span></article></RevealFrame>)}</div>
    </div></section>
    <section className="section container service-explore"><h2>Khám phá giải pháp</h2><ServiceCards/></section>
  </>;
}
export function ServiceCustomers({logosAfter=false}:{logosAfter?:boolean}={}){
 const area=useRef<HTMLElement>(null), track=useRef<HTMLDivElement>(null), t=useTranslation();
 const auto=useHomeCarousel(area,()=>advanceHomeRail(track.current),'.info-testimonial-rail,.info-rail-controls');
 const stories=[{quote:'Điều chúng tôi cần là một đối tác hiểu nhịp vận hành và có thể cùng trao đổi rõ ràng ngay từ đầu.',name:'Chị Lan Anh',role:'Quản lý nhân sự · Doanh nghiệp sản xuất giả định'},{quote:'Tôi muốn biết rõ công việc và địa điểm trước khi quyết định. Một cuộc trao đổi tận tình giúp tôi tự tin hơn.',name:'Anh Minh',role:'Người lao động giả định'},{quote:'Khi nhu cầu thay đổi, việc có người đồng hành và cùng tìm phương án khiến hành trình tuyển dụng nhẹ nhàng hơn.',name:'Chị Thu Hà',role:'Phụ trách tuyển dụng · Doanh nghiệp giả định'}];
 const scroll=(direction:number, pointer:boolean)=>track.current?.scrollBy({left:direction*(track.current?.clientWidth||350)*.6,behavior:pointer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches?'smooth':'instant'});
 const partners = <><SectionHeading title="Đối tác doanh nghiệp"/><PartnersStrip/></>;
 return <section className="section info-service-customers" ref={area}><div className="container">
   {!logosAfter && partners}
   <div className="service-stories-heading"><SectionHeading title={t({vi:'Chia sẻ minh họa',en:'Illustrative stories',zh:'示例分享',ko:'예시 이야기',ja:'参考事例'})}/><p>Tình huống minh họa · Nhân vật giả định</p></div>
   <div className="info-testimonial-rail" ref={track} tabIndex={0} role="region" aria-label="Tình huống minh họa · Nhân vật giả định">
     {stories.map(story => <blockquote key={story.quote}><p>{story.quote}</p><footer><span><strong>{story.name}</strong><small>{story.role}</small></span></footer></blockquote>)}
   </div>
   <div className="info-rail-controls">
     <button type="button" className="circle-button" aria-label="Câu chuyện trước" onClick={event=>scroll(-1,event.detail>0)}><ChevronLeft/></button>
     <InfoCarouselPause paused={auto.paused} toggle={auto.toggle}/>
     <button type="button" className="circle-button" aria-label="Câu chuyện tiếp theo" onClick={event=>scroll(1,event.detail>0)}><ChevronRight/></button>
   </div>
   {logosAfter && partners}
 </div></section>;
}

const feeRows: Record<string, string[][]> = {
  'labor-supply': [
    ['Tìm nguồn', 'Số lượng, vị trí và địa điểm', 'Kế hoạch theo đợt'],
    ['Tiếp nhận', 'Lịch phỏng vấn và nhận việc', 'Đầu mối phối hợp'],
  ],
  'labor-leasing': [
    ['Thời hạn', 'Ngày bắt đầu và kết thúc', 'Thời điểm rà soát'],
    ['Ca làm việc', 'Quy mô từng ca', 'Cách xử lý thay đổi'],
  ],
  'college-admissions': [
    ['Học phí', 'Đơn vị đào tạo', 'Mức thu và lịch đóng'],
    ['Hồ sơ đăng ký', 'Bộ phận tuyển sinh của trường', 'Các khoản phí liên quan'],
  ],
  'hr-consulting': [
    ['Tổ chức và quy trình', 'Các bộ phận tham gia', 'Phạm vi khảo sát'],
    ['Công cụ quản lý', 'Dữ liệu và phần mềm đang dùng', 'Phạm vi triển khai'],
  ],
};

function ServiceDecision({service}: {service: Service}) {
  const slug = service.slug;
  if (slug === 'labor-supply') {
    return <section className="section container service-decision md-ref-service-highlights service-planning" data-service-layout="labor-supply">
      <div className="service-decision-copy"><h2>Kế hoạch bổ sung theo đợt</h2><p>{service.intro}</p>
        <div className="service-table-scroll" tabIndex={0} role="region" aria-label="Ví dụ kế hoạch tiếp nhận">
          <table><caption>Ví dụ kế hoạch tiếp nhận</caption><thead><tr>{['Đợt','Địa điểm','Ca làm việc','Số lượng','Ngày cần người'].map(label=><th scope="col" key={label}>{label}</th>)}</tr></thead>
            <tbody><tr><th scope="row">A</th><td>Bắc Ninh</td><td>Ngày</td><td>12</td><td>02/03</td></tr><tr><th scope="row">B</th><td>Bắc Ninh</td><td>Đêm</td><td>8</td><td>09/03</td></tr></tbody>
          </table>
        </div>
        <p>Nhà máy xác nhận ca và lịch nhận việc. Minh Đức trao đổi nguồn ứng viên theo từng đợt.</p>
      </div>
      <RevealFrame effect="media"><figure><img src="/assets/minhduc-v16/recruitment-field.webp" {...responsiveImage('/assets/minhduc-v16/recruitment-field.webp','(min-width: 768px) 320px, 82vw')} alt="Ghi nhận hoạt động tìm nguồn tại hiện trường" loading="lazy" decoding="async"/><figcaption>Hoạt động tìm nguồn</figcaption></figure></RevealFrame>
    </section>;
  }
  if (slug === 'labor-leasing') {
    const responsibilities = [
      ['Thời hạn','Xác định khoảng thời gian và số người cần cho từng ca.'],
      ['Đầu mối phối hợp','Thống nhất người tiếp nhận tại nơi làm việc và người xử lý thay đổi ca.'],
      ['Điều kiện triển khai','Các bên cần xác minh ngành nghề, điều kiện pháp lý và trách nhiệm trước khi ký kết.'],
    ];
    return <section className="section container service-decision md-ref-service-highlights service-responsibilities" data-service-layout="labor-leasing">
      <div><h2>Thống nhất trách nhiệm trước khi triển khai</h2><p>{service.intro}</p></div>
      <dl>{responsibilities.map(([term,description])=><div key={term}><dt>{term}</dt><dd>{description}</dd></div>)}</dl>
    </section>;
  }
  if (slug === 'recruitment') {
    return <section className="section container service-decision md-ref-service-highlights service-role" data-service-layout="recruitment">
      <div><h2>Tiêu chí tuyển kỹ thuật viên bảo trì</h2><p>Mẫu mô tả vị trí để thống nhất cách tuyển chọn.</p></div>
      <dl>{[
        ['Kỹ năng bắt buộc','Đọc sơ đồ và nhận diện lỗi thiết bị.'],
        ['Kinh nghiệm mong muốn','Mô tả thiết bị đã bảo trì và phần việc đã đảm nhiệm.'],
        ['Cách đánh giá','Trao đổi một tình huống xử lý sự cố với người phụ trách kỹ thuật.'],
      ].map(([term,description])=><div key={term}><dt>{term}</dt><dd>{description}</dd></div>)}</dl>
    </section>;
  }
  if (slug === 'college-admissions') {
    return <section className="section container service-decision md-ref-service-highlights service-study" data-service-layout="college-admissions">
      <h2>So sánh hình thức học</h2><div className="service-study-modes">
        <article><h3>Từ xa</h3><p>Hỏi trường về lịch học trực tuyến, thời gian tự học và địa điểm thi.</p></article>
        <article><h3>Chính quy</h3><p>Hỏi trường về lịch học tại lớp, yêu cầu có mặt và điều kiện thực hành.</p></article>
      </div>
      <Link className="service-inline-link" to="/education">Khám phá chương trình tuyển sinh</Link>
    </section>;
  }
  return <section className="section container service-decision md-ref-service-highlights service-consulting" data-service-layout="hr-consulting">
    <h2>Nội dung cần thống nhất</h2><div className="service-consulting-list">{consultingTopics.map(item=><article key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
  </section>;
}

function ServiceFees({service}: {service: Service}) {
  const education = service.slug === 'college-admissions';
  const headings = education ? ['Hạng mục','Nơi xác nhận','Thông tin cần xác nhận'] : ['Hạng mục','Căn cứ tính phí','Điểm cần thống nhất'];
  return <section className="section container md-ref-fee-section service-fees"><h2>{education ? 'Chi phí cần xác nhận với trường' : 'Cơ cấu chi phí tham khảo'}</h2>
    {service.slug === 'recruitment' ? <p className="md-ref-fee-highlight">Phạm vi tìm kiếm, tiêu chí kỹ năng và các bước đánh giá là cơ sở trao đổi phí tuyển chọn.</p> :
      <div className="info-fee-table-wrap service-table-scroll" role="region" aria-label={education ? 'Chi phí cần xác nhận với trường' : 'Cơ cấu chi phí tham khảo'} tabIndex={0}>
        <table className="info-fee-table"><caption>{education ? 'Thông tin cần xác nhận' : 'Các yếu tố để trao đổi chi phí'}</caption>
          <thead><tr>{headings.map(heading=><th scope="col" key={heading}>{heading}</th>)}</tr></thead>
          <tbody>{feeRows[service.slug].map(([item,basis,scope])=><tr key={item}><th scope="row">{item}</th><td>{basis}</td><td>{scope}</td></tr>)}</tbody>
        </table>
      </div>}
  </section>;
}

export function ServicePage() {
  const {slug} = useParams();
  const service = services.find(item => item.slug === slug);
  const openContact = useContact();
  if (!service) return <PageMasthead eyebrow="404" title="Dịch vụ không tồn tại"><Link className="btn" to="/services">Xem tất cả dịch vụ</Link></PageMasthead>;
  const education = slug === 'college-admissions';
  const consulting = slug === 'hr-consulting';
  return <div className="service-detail" key={service.slug}>
    <PageMasthead eyebrow="Dịch vụ" title={service.title} description={service.prompt} image={service.image} imageAlt={service.alt} imageCaption={slug === 'labor-supply' ? undefined : service.alt}>
      {education ? <><Link className="btn" to="/education?form=F05#dang-ky">Tư vấn tuyển sinh</Link><Link className="service-inline-link" to="/education?form=F06#dang-ky">Nộp hồ sơ tuyển sinh</Link></> :
        <button className="btn" type="button" onClick={()=>openContact(service.title)}>Gửi nhu cầu nhân lực</button>}
      {slug === 'labor-supply' && <Link className="service-inline-link" to={subnavigation['/jobs'][0][0]}>Xem việc phổ thông</Link>}
      {slug === 'recruitment' && <Link className="service-inline-link" to={subnavigation['/jobs'][1][0]}>Xem việc tay nghề</Link>}
    </PageMasthead>
    {consulting ? <section className="section container service-workflow"><h2>Quy trình cần rà soát</h2><p>{service.intro}</p>
      <ol>{['Tiếp nhận nhu cầu','Phân công','Theo dõi phản hồi'].map(step=><li key={step}>{step}</li>)}</ol>
    </section> : <ServiceDecision service={service}/>}
    <section className="service-process"><div className="container"><h2>Quy trình phối hợp</h2>
      <RevealFrame><ol>{service.steps.map(step=><li key={step}>{step}</li>)}</ol></RevealFrame></div></section>
    <ServiceFees service={service}/>
    {consulting && <ServiceDecision service={service}/>}
    <section className="section container info-faq-section service-faq"><h2>Câu hỏi thường gặp</h2><FAQ questions={service.questions}/></section>
    {slug !== 'recruitment' && <ServiceCustomers/>}
    <section className="section container service-explore"><h2>Khám phá dịch vụ khác</h2><ServiceCards exclude={service.slug}/></section>
    {education ? <section className="service-education-action"><div className="container"><h2>Tuyển sinh cao đẳng &amp; đại học</h2><Link className="btn" to="/education">Xem tất cả chương trình</Link></div></section> :
      <InfoContact service={service.title}/>}
  </div>;
}
