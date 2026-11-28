import {useId, useRef, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {SectionHeading, useContact} from '../../shared';
import {PageMasthead} from '../../PageMasthead';
import {responsiveImage} from '../../media';
import {RevealFrame} from '../../motion';
import {useTranslation} from '../../i18n';
import {useHomeCarousel, advanceHomeRail} from '../../useHomeCarousel';
import {subnavigation} from '../../navigation';
import PartnersStrip from '../../PartnersStrip';
import {campusAlt, consultingTopics, industrialCampus, services, type Service} from './data';
import {ServiceCards, ServiceDirectory, serviceSlideDuration} from '../../ServiceShowcase';
import {InfoContact, FAQ} from './components';
import './services-reference.css';

const modelComparison = [
  {
    criterion: 'Tình huống phù hợp',
    supply: 'Bổ sung nhân sự ổn định, mở rộng dây chuyền hoặc tuyển số lượng lớn theo đợt mà doanh nghiệp trực tiếp quản lý.',
    leasing: 'Đáp ứng nhu cầu nhân lực linh hoạt theo mùa vụ, đơn hàng tăng đột biến hoặc dự án có thời hạn xác định.',
  },
  {
    criterion: 'Trọng tâm triển khai',
    supply: 'Tìm nguồn, sàng lọc hồ sơ, sắp xếp phỏng vấn và phối hợp bàn giao nhân sự vào làm việc đúng kế hoạch.',
    leasing: 'Tổ chức nguồn lực theo ca/kíp, theo dõi tiếp nhận tại nơi làm việc và phối hợp bổ sung khi biến động nhân sự.',
  },
  {
    criterion: 'Quản lý & phối hợp',
    supply: 'Doanh nghiệp tiếp nhận trực tiếp ký hợp đồng, quản lý chuyên môn, chấm công và chế độ lao động.',
    leasing: 'Doanh nghiệp điều hành công việc trực tiếp; phạm vi điều phối, hồ sơ và trách nhiệm hai bên được thống nhất rõ trước khi triển khai.',
  },
  {
    criterion: 'Điều kiện cần thống nhất',
    supply: 'Làm rõ yêu cầu vị trí, lịch ca, địa điểm làm việc và thu nhập dự kiến để tư vấn minh bạch cho ứng viên.',
    leasing: 'Rà soát danh mục ngành nghề, thời hạn thuê lại và điều kiện pháp lý áp dụng cho từng nhà máy trước khi ký kết.',
  },
] as const;

export function ServicesPage() {
  const openContact = useContact();
  return <>
    <PageMasthead variant="photo" title="Giải pháp nhân sự" image={industrialCampus} imageAlt={campusAlt} imageCaption={campusAlt}/>
    <section className="section container service-directory" aria-labelledby="service-directory-heading">
      <RevealFrame effect="left">
        <h2 id="service-directory-heading">Giải pháp nhân lực cho nhà máy và doanh nghiệp</h2>
        <p>Từ tuyển người theo ca đến tổ chức lại quy trình, chọn dịch vụ theo công việc bạn đang cần giải quyết.</p>
        <div className="service-index-actions">
          <button className="btn" type="button" onClick={() => openContact(services[0].title)}>Gửi nhu cầu nhân lực</button>
          <Link className="service-inline-link" to="/jobs">Tôi đang tìm việc</Link>
        </div>
      </RevealFrame>
      <ServiceDirectory/>
    </section>
    <section className="section container service-comparison" aria-labelledby="service-comparison-heading">
      <div className="service-comparison-head">
        <h2 id="service-comparison-heading">Phân biệt Giới thiệu &amp; cung ứng nhân lực và Cho thuê lao động</h2>
        <p>Bảng tóm tắt nhanh giúp bộ phận nhân sự chọn đúng mô hình theo nhịp sản xuất và mức độ linh hoạt mong muốn.</p>
      </div>
      <div className="service-table-scroll" tabIndex={0} role="region" aria-label="So sánh hai mô hình nhân lực chính">
        <table className="service-comparison-table">
          <caption>So sánh trọng tâm giữa hai mô hình nhân lực phổ biến tại nhà máy</caption>
          <thead>
            <tr>
              <th scope="col">Tiêu chí</th>
              <th scope="col">Giới thiệu &amp; cung ứng nhân lực</th>
              <th scope="col">Cho thuê lao động</th>
            </tr>
          </thead>
          <tbody>
            {modelComparison.map(row => <tr key={row.criterion}>
              <th scope="row">{row.criterion}</th>
              <td>{row.supply}</td>
              <td>{row.leasing}</td>
            </tr>)}
          </tbody>
        </table>
      </div>
      <div className="service-comparison-actions">
        <button className="btn" type="button" onClick={() => openContact(services[0].title)}>Nhận tư vấn chọn mô hình phù hợp</button>
        <Link className="service-inline-link" to="/services/labor-supply">Chi tiết Cung ứng nhân lực</Link>
        <Link className="service-inline-link" to="/services/labor-leasing">Chi tiết Cho thuê lao động</Link>
      </div>
    </section>
    <section className="md-ref-service-metrics"><div className="container">
      <p>Số liệu mô phỏng cho giao diện</p>
      <div>{[['1.200+','Kết nối việc làm'],['80+','Nhu cầu doanh nghiệp'],['15+','Khu vực kết nối']].map(([value,label], i) =>
        <RevealFrame key={label} delay={i as 0|1|2}><article><strong>{value}</strong><span>{label}</span></article></RevealFrame>)}</div>
    </div></section>
  </>;
}
export function ServiceCustomers({logosAfter=false}:{logosAfter?:boolean}={}){
 const track = useRef<HTMLDivElement>(null);
 const railId = useId();
 const [paused,setPaused] = useState(false);
 const t = useTranslation();
 useHomeCarousel(track, () => advanceHomeRail(track.current,track.current ? serviceSlideDuration(track.current) : 180), undefined, {paused});
 const stories=[{quote:'Điều chúng tôi cần là một đối tác hiểu nhịp vận hành và có thể cùng trao đổi rõ ràng ngay từ đầu.',name:'Chị Lan Anh',role:'Quản lý nhân sự · Doanh nghiệp sản xuất giả định'},{quote:'Tôi muốn biết rõ công việc và địa điểm trước khi quyết định. Một cuộc trao đổi tận tình giúp tôi tự tin hơn.',name:'Anh Minh',role:'Người lao động giả định'},{quote:'Khi nhu cầu thay đổi, việc có người đồng hành và cùng tìm phương án khiến hành trình tuyển dụng nhẹ nhàng hơn.',name:'Chị Thu Hà',role:'Phụ trách tuyển dụng · Doanh nghiệp giả định'}];
 const partners = <><SectionHeading title="Đối tác doanh nghiệp"/><PartnersStrip/></>;
 const playLabel = t({vi:'Phát chuyển động',en:'Play rotation',zh:'播放轮播',ko:'자동 이동 재생',ja:'自動スライドを再生'});
 const pauseLabel = t({vi:'Tạm dừng chuyển động',en:'Pause rotation',zh:'暂停轮播',ko:'자동 이동 일시 정지',ja:'自動スライドを一時停止'});
 return <section className="section info-service-customers"><div className="container">
   {!logosAfter && partners}
   <div className="service-stories-heading"><SectionHeading title={t({vi:'Chia sẻ minh họa',en:'Illustrative stories',zh:'示例分享',ko:'예시 이야기',ja:'参考事例'})}/><p>Tình huống minh họa · Nhân vật giả định</p></div>
   <div className="info-testimonial-rail" id={railId} ref={track} data-auto-rail="" tabIndex={0} role="region" aria-label="Tình huống minh họa · Nhân vật giả định">
     {stories.map(story => <blockquote key={story.quote}><p>{story.quote}</p><footer><span><strong>{story.name}</strong><small>{story.role}</small></span></footer></blockquote>)}
   </div>
   <div className="service-stories-controls"><button className="btn btn-secondary" type="button" aria-controls={railId}
     onClick={()=>setPaused(value=>!value)}>{paused ? playLabel : pauseLabel}</button></div>
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
      <div className="service-decision-copy"><h2>Kế hoạch bổ sung theo đợt</h2>
        <div className="service-table-scroll" tabIndex={0} role="region" aria-label="Ví dụ kế hoạch tiếp nhận">
          <table><caption>Ví dụ kế hoạch tiếp nhận</caption><thead><tr>{['Đợt','Địa điểm','Ca làm việc','Số lượng','Ngày cần người'].map(label=><th scope="col" key={label}>{label}</th>)}</tr></thead>
            <tbody><tr><th scope="row">A</th><td>Bắc Ninh</td><td>Ngày</td><td>12</td><td>02/03</td></tr><tr><th scope="row">B</th><td>Bắc Ninh</td><td>Đêm</td><td>8</td><td>09/03</td></tr></tbody>
          </table>
        </div>
        <p>{service.card.detail}</p>
      </div>
      <RevealFrame effect="media"><figure><img src="/WebMinhDuc/assets/minhduc-v16/recruitment-field.webp" {...responsiveImage('/WebMinhDuc/assets/minhduc-v16/recruitment-field.webp','(min-width: 768px) 320px, 82vw')} alt="Ghi nhận hoạt động tìm nguồn tại hiện trường" loading="lazy" decoding="async"/><figcaption>Hoạt động tìm nguồn</figcaption></figure></RevealFrame>
    </section>;
  }
  if (slug === 'labor-leasing') {
    const responsibilities = [
      ['Thời hạn',service.card.detail],
      ['Đầu mối phối hợp','Thống nhất người tiếp nhận tại nơi làm việc và người xử lý thay đổi ca.'],
      ['Điều kiện triển khai','Các bên cần xác minh ngành nghề, điều kiện pháp lý và trách nhiệm trước khi ký kết.'],
    ];
    return <section className="section container service-decision md-ref-service-highlights service-responsibilities" data-service-layout="labor-leasing">
      <div><h2>Thống nhất trách nhiệm trước khi triển khai</h2></div>
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
        <article><h3>Từ xa</h3><p>{service.card.detail}</p></article>
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
    {service.slug === 'recruitment' ? <p className="md-ref-fee-highlight">{service.card.detail}</p> :
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
    <PageMasthead variant="photo" title={service.title} image={service.image} imageAlt={service.alt}
      imageCaption={service.image===industrialCampus || education ? service.alt : undefined}/>
    <section className="section container service-overview">
      <RevealFrame effect="left"><h2>{service.prompt}</h2></RevealFrame>
      <div><p>{service.intro}</p><div className="service-overview-actions">
      {education ? <><Link className="btn" to="/education?form=F05#dang-ky">Tư vấn tuyển sinh</Link><Link className="service-inline-link" to="/education?form=F06#dang-ky">Nộp hồ sơ tuyển sinh</Link></> :
        <button className="btn" type="button" onClick={()=>openContact(service.title)}>Gửi nhu cầu nhân lực</button>}
      {slug === 'labor-supply' && <Link className="service-inline-link" to={subnavigation['/jobs'][0][0]}>Xem việc phổ thông</Link>}
      {slug === 'recruitment' && <Link className="service-inline-link" to={subnavigation['/jobs'][1][0]}>Xem việc tay nghề</Link>}
      </div></div>
    </section>
    {consulting ? <section className="section container service-workflow"><h2>Quy trình cần rà soát</h2>
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
