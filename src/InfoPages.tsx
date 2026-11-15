import { useState, type KeyboardEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Check, ChevronDown, ChevronLeft, ChevronRight, Clock3, CalendarDays, MapPin, Users, Building2, ClipboardCheck, Handshake, Printer, Phone, Mail, ShieldCheck } from 'lucide-react';
import { PageHero, SectionHeading, ButtonLink, CTASection, useContact } from './shared';
import './info.css';

const uploads = '/mirror/www.hr2b.com/wp-content/uploads/';
const assets = {
  about: `${uploads}2025/10/about-banner.jpg`,
  services: `${uploads}2025/09/Staff-oursourcing.jpg`,
  recruitment: `${uploads}2025/10/Executive-Search-banner.jpg`,
  news: `${uploads}2025/09/Tin-tuc.jpg`,
  logistics: `${uploads}2025/08/staffing-logictis-1.jpg`,
  salary: `${uploads}2025/08/khung-luong-canh-tranh.jpg`,
  privacy: `${uploads}2026/11/bao-mat-thong-tin-tien-luong.jpg`,
  opportunity: `${uploads}2025/09/Co-hoi-viec-lam-scaled.jpg`,
  contact: `${uploads}2025/09/Lien-he.jpg`,
  service1: `${uploads}2025/09/GPNS-1.jpg`,
  service2: `${uploads}2025/09/GPNS-2.jpg`,
  service3: `${uploads}2025/09/GPNS-3.jpg`,
};
const partners = ['Luxshare-ICT', 'Foxconn', 'Samsung', 'Jeiltech-Vina', 'TACU'];
const contact = { phone: '0364 562 868', tel: '0364562868', email: 'vieclamminhduc.vpv2@gmail.com' };

type Service = {
  slug: string; title: string; short: string; image: string; banner: string; intro: string;
  audience: string; benefits: { title: string; text: string }[]; steps: string[];
  questions: [string, string][];
};
const services: Service[] = [
  {
    slug: 'labor-supply', title: 'Cung ứng nhân lực', short: 'Kết nối nguồn lao động với nhu cầu sản xuất của doanh nghiệp.', image: assets.service2, banner: assets.services,
    intro: 'Minh Đức kết nối doanh nghiệp với nguồn lao động phổ thông, đồng hành trong quá trình tiếp nhận nhu cầu, tuyển chọn và hướng dẫn người lao động đến nơi làm việc.',
    audience: 'Dành cho nhà máy, doanh nghiệp sản xuất và đơn vị có nhu cầu bổ sung lao động theo kế hoạch vận hành.',
    benefits: [
      { title: 'Đúng nhu cầu', text: 'Làm rõ vị trí, số lượng, địa điểm, ca làm và điều kiện tuyển dụng trước khi tìm nguồn.' },
      { title: 'Thông tin rõ ràng', text: 'Trao đổi minh bạch về công việc, thu nhập dự kiến và các yêu cầu của doanh nghiệp.' },
      { title: 'Đồng hành tiếp nhận', text: 'Hướng dẫn hồ sơ, lịch hẹn và đầu mối liên hệ trong quá trình nhận việc.' },
    ],
    steps: ['Tiếp nhận nhu cầu & điều kiện làm việc', 'Thống nhất kế hoạch tìm nguồn', 'Tư vấn & sàng lọc người lao động', 'Phối hợp phỏng vấn, tiếp nhận', 'Theo dõi & cập nhật phản hồi'],
    questions: [
      ['Doanh nghiệp cần cung cấp thông tin gì?', 'Vui lòng chuẩn bị vị trí, số lượng dự kiến, địa điểm, ca làm, yêu cầu tuyển dụng, thời gian tiếp nhận và đầu mối phụ trách. Minh Đức sẽ trao đổi để làm rõ nhu cầu cụ thể.'],
      ['Có hỗ trợ nhu cầu lao động theo đợt không?', 'Doanh nghiệp có thể gửi kế hoạch theo đợt hoặc theo giai đoạn sản xuất. Khả năng đáp ứng và thời gian thực hiện sẽ được xác nhận sau khi trao đổi trực tiếp.'],
      ['Chi phí dịch vụ được xác định như thế nào?', 'Chi phí phụ thuộc vào phạm vi công việc, số lượng, địa điểm và điều kiện phối hợp. Không có bảng phí cố định trong prototype; vui lòng liên hệ để nhận tư vấn phù hợp.'],
    ],
  },
  {
    slug: 'recruitment', title: 'Giới thiệu việc làm', short: 'Giúp người lao động tìm công việc phù hợp và chuẩn bị nhận việc.', image: assets.service1, banner: assets.recruitment,
    intro: 'Từ tìm hiểu nhu cầu đến chuẩn bị hồ sơ, Minh Đức hỗ trợ người tìm việc tiếp cận các cơ hội lao động phổ thông và công việc tại nhà máy phù hợp với điều kiện cá nhân.',
    audience: 'Dành cho người đang tìm việc, mong muốn đổi công việc hoặc cần được tư vấn về cơ hội làm việc tại nhà máy.',
    benefits: [
      { title: 'Dễ tiếp cận', text: 'Tìm việc theo địa điểm, hình thức làm việc và các thông tin tuyển dụng được giới thiệu.' },
      { title: 'Tư vấn thực tế', text: 'Trao đổi về mong muốn, khả năng đi làm, kinh nghiệm và yêu cầu của từng vị trí.' },
      { title: 'Chuẩn bị tốt hơn', text: 'Được hướng dẫn các bước nộp hồ sơ và thông tin cần hỏi trước khi nhận việc.' },
    ],
    steps: ['Chia sẻ nhu cầu tìm việc', 'Tìm hiểu vị trí phù hợp', 'Chuẩn bị hồ sơ ứng tuyển', 'Trao đổi với đơn vị tuyển dụng', 'Xác nhận thông tin trước khi nhận việc'],
    questions: [
      ['Chưa có kinh nghiệm có thể đăng ký không?', 'Bạn có thể liên hệ để được tư vấn. Mỗi vị trí có điều kiện riêng; hãy kiểm tra yêu cầu trong tin tuyển dụng và xác nhận lại với người phụ trách.'],
      ['Cần chuẩn bị giấy tờ gì?', 'Thông thường bạn nên chuẩn bị thông tin liên hệ, kinh nghiệm nếu có và các giấy tờ theo yêu cầu của vị trí. Không gửi giấy tờ nhạy cảm trước khi xác minh được đơn vị tiếp nhận.'],
      ['Các tin tuyển dụng trong prototype có đang tuyển thật không?', 'Các vị trí có nhãn “Dữ liệu minh họa” dùng để trải nghiệm chức năng. Vui lòng gọi hotline hoặc nhắn Zalo để xác nhận cơ hội tuyển dụng hiện tại.'],
    ],
  },
  {
    slug: 'hr-consulting', title: 'Tư vấn nhân sự', short: 'Bắt đầu từ nhu cầu thực tế, cùng xây dựng hướng tiếp cận phù hợp.', image: assets.service3, banner: assets.about,
    intro: 'Một kế hoạch nhân lực hiệu quả bắt đầu bằng việc hiểu đúng nhu cầu. Minh Đức tiếp nhận thông tin và trao đổi với doanh nghiệp về việc tìm nguồn, tuyển chọn và phối hợp tiếp nhận lao động.',
    audience: 'Dành cho doanh nghiệp cần trao đổi về kế hoạch tuyển dụng, cách tiếp cận ứng viên và quy trình phối hợp nhân sự.',
    benefits: [
      { title: 'Hiểu bối cảnh', text: 'Xem xét đặc điểm công việc, địa điểm, ca làm và thời điểm cần bổ sung nhân lực.' },
      { title: 'Rõ quy trình', text: 'Thống nhất đầu mối và các bước phối hợp để hạn chế thiếu thông tin khi tuyển dụng.' },
      { title: 'Phù hợp thực tế', text: 'Trao đổi giải pháp dựa trên mục tiêu và nguồn lực của doanh nghiệp.' },
    ],
    steps: ['Lắng nghe vấn đề cần giải quyết', 'Làm rõ dữ liệu & mục tiêu', 'Trao đổi phương án phối hợp', 'Thống nhất phạm vi thực hiện', 'Ghi nhận phản hồi & điều chỉnh'],
    questions: [
      ['Dịch vụ tư vấn bao gồm những gì?', 'Phạm vi được trao đổi trực tiếp theo nhu cầu của từng doanh nghiệp. Nội dung trên trang mô tả cách tiếp cận; các hạng mục, thời hạn và kết quả bàn giao cần được hai bên thống nhất.'],
      ['Có thể trao đổi trước khi gửi yêu cầu chính thức không?', 'Có. Bạn có thể gọi hotline hoặc dùng biểu mẫu để trình bày ngắn gọn nhu cầu và thông tin liên hệ.'],
      ['Tư vấn có thay thế ý kiến pháp lý không?', 'Nội dung tư vấn nhân sự tổng quát không thay thế ý kiến pháp lý chuyên biệt. Các vấn đề liên quan hợp đồng, pháp luật hoặc nghĩa vụ cụ thể cần được xác minh với đơn vị có chuyên môn phù hợp.'],
    ],
  },
];

function navigateTabs(event: KeyboardEvent<HTMLButtonElement>, selected: number, count: number, select: (index: number) => void) {
  const keys = ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'];
  if (!keys.includes(event.key)) return;
  event.preventDefault();
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? count - 1 : (selected + (event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 1) + count) % count;
  select(next);
  event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
}
function InfoNotFound({ kind }: { kind: string }) {
  return <><PageHero title={`${kind} không tồn tại`} eyebrow="404 · Không tìm thấy" /><section className="section container info-not-found"><h2>Tiếp tục khám phá Minh Đức</h2><p>Đường dẫn có thể đã thay đổi. Bạn có thể quay lại trang chủ để tìm thông tin phù hợp.</p><ButtonLink to="/">Về trang chủ</ButtonLink></section></>;
}
function ServiceCards({ exclude }: { exclude?: string }) {
  return <div className={`grid-3 info-service-cards ${exclude ? 'info-two-cards' : ''}`}>{services.filter(s => s.slug !== exclude).map(s => <Link className="info-service-card" key={s.slug} to={`/services/${s.slug}`}><img src={s.image} alt="" loading="lazy" /><div><h3>{s.title}</h3><p>{s.short}</p><span className="info-round-arrow"><ArrowUpRight size={24} /></span></div></Link>)}</div>;
}
function PartnerStrip() {
  return <div className="info-partner-list">{partners.map((name, index) => <div className={`info-partner info-partner-${index}`} key={name}>{name}</div>)}</div>;
}
function FAQ({ questions }: { questions: [string, string][] }) {
  const [active, setActive] = useState<number | null>(0);
  return <div className="info-faq">{questions.map(([question, answer], i) => <div className={`info-faq-item ${active === i ? 'is-open' : ''}`} key={question}><h3><button type="button" aria-expanded={active === i} aria-controls={`faq-answer-${i}`} onClick={() => setActive(active === i ? null : i)}>{question}<ChevronDown size={20} /></button></h3><div id={`faq-answer-${i}`} hidden={active !== i}><p>{answer}</p></div></div>)}</div>;
}

export function AboutPage() {
  const [value, setValue] = useState(0);
  const values = [
    { title: 'Tầm nhìn', text: 'Trở thành cầu nối tin cậy giữa doanh nghiệp và người lao động, tạo nên những kết nối công việc bền vững.', icon: Building2 },
    { title: 'Sứ mệnh', text: 'Lắng nghe nhu cầu, kết nối cơ hội và đồng hành cùng người lao động trên hành trình tìm việc.', icon: Users },
    { title: 'Giá trị cốt lõi', text: 'Minh bạch trong thông tin. Tận tâm trong hỗ trợ. Trách nhiệm trong từng kết nối.', icon: Handshake },
  ];
  const CurrentIcon = values[value].icon;
  return <>
    <PageHero title="Về Minh Đức" eyebrow="Kết nối con người · Kiến tạo cơ hội" image={assets.about} />
    <section className="section container info-intro-grid"><div><span className="eyebrow">MINH ĐỨC</span><h2>Nhân lực là tài sản</h2><p className="info-lead">Mỗi người lao động có một mong muốn. Mỗi doanh nghiệp có một nhu cầu. Minh Đức kết nối hai hành trình ấy.</p><p>Minh Đức hoạt động trong lĩnh vực cung ứng nhân lực và giới thiệu việc làm, tập trung vào nhu cầu lao động phổ thông tại các nhà máy, doanh nghiệp sản xuất.</p><p>Chúng tôi bắt đầu bằng việc lắng nghe, làm rõ thông tin tuyển dụng và hướng dẫn các bước tiếp theo để doanh nghiệp và người lao động có thể đưa ra quyết định phù hợp.</p><ButtonLink to="/contact">Kết nối với Minh Đức</ButtonLink></div><div className="info-about-photo"><img src={assets.opportunity} alt="Không gian làm việc và cơ hội nghề nghiệp" loading="lazy" /><div className="info-photo-caption"><Handshake size={28} /><span>Đồng hành cùng<br /><strong>doanh nghiệp & người lao động</strong></span></div></div></section>
    <section className="section info-soft-section"><div className="container"><SectionHeading title="Con người ở trung tâm" description="Một định hướng chung cho mỗi hoạt động kết nối của Minh Đức." /><div className="info-values"><div className="info-value-tabs" role="tablist" aria-label="Định hướng Minh Đức">{values.map((item, i) => <button key={item.title} id={`value-tab-${i}`} type="button" role="tab" aria-selected={value === i} tabIndex={value === i ? 0 : -1} onKeyDown={event => navigateTabs(event, value, values.length, setValue)} aria-controls="value-panel" className={value === i ? 'active' : ''} onClick={() => setValue(i)}><item.icon size={24} />{item.title}<ArrowRight size={18} /></button>)}</div><div className="info-value-panel" role="tabpanel" id="value-panel" aria-labelledby={`value-tab-${value}`}><CurrentIcon size={44} /><h3>{values[value].title}</h3><p>{values[value].text}</p><span className="info-value-watermark">MĐ</span></div></div></div></section>
    <section className="section container"><SectionHeading title="Cùng kết nối, cùng phát triển" description="Các đối tác được giới thiệu trong hồ sơ thông tin Minh Đức." /><PartnerStrip /><div className="info-centered-action"><ButtonLink to="/partners" secondary>Tìm hiểu mạng lưới đối tác</ButtonLink></div></section>
    <section className="section wide"><SectionHeading title="Giải pháp nhân lực" description="Dành cho doanh nghiệp cần người và người lao động cần việc." /><ServiceCards /></section><CTASection />
  </>;
}

export function ServicesPage() {
  const [active, setActive] = useState(0);
  const selected = services[active];
  const openContact = useContact();
  return <>
    <PageHero title="Giải pháp nhân lực" description="Kết nối đúng nhu cầu. Đồng hành từng bước." image={assets.services} />
    <section className="section container info-intro-grid"><div><span className="eyebrow">GIẢI PHÁP TỪ MINH ĐỨC</span><h2>Cùng bạn xây dựng<br />đội ngũ phù hợp</h2><p className="info-lead">Từ tìm nguồn lao động đến giới thiệu việc làm, chúng tôi bắt đầu với những điều bạn thực sự cần.</p><p>Chia sẻ kế hoạch tuyển dụng hoặc mong muốn tìm việc của bạn. Minh Đức sẽ cùng làm rõ yêu cầu và trao đổi hướng kết nối phù hợp.</p><button className="btn" type="button" onClick={() => openContact()}>Trao đổi nhu cầu <ArrowRight size={18} /></button></div><img className="info-rounded-photo" src={assets.logistics} alt="Nhân lực cho sản xuất và vận hành" loading="lazy" /></section>
    <section className="section info-soft-section"><div className="container"><SectionHeading title="Dịch vụ của chúng tôi" /><div className="info-tabs" role="tablist" aria-label="Dịch vụ">{services.map((service, i) => <button key={service.slug} role="tab" id={`service-tab-${i}`} aria-selected={active === i} tabIndex={active === i ? 0 : -1} onKeyDown={event => navigateTabs(event, active, services.length, setActive)} aria-controls="service-panel" onClick={() => setActive(i)} className={active === i ? 'active' : ''} type="button">{service.title}</button>)}</div><div className="info-service-panel" role="tabpanel" id="service-panel" aria-labelledby={`service-tab-${active}`}><img src={selected.image} alt="" loading="lazy" /><div><span className="eyebrow">0{active + 1} / DỊCH VỤ</span><h3>{selected.title}</h3><p>{selected.intro}</p><p className="muted">{selected.audience}</p><ButtonLink to={`/services/${selected.slug}`}>Khám phá dịch vụ</ButtonLink></div></div></div></section>
    <section className="section wide"><SectionHeading title="Một kết nối. Nhiều cơ hội." /><ServiceCards /></section><CTASection />
  </>;
}

export function ServicePage() {
  const { slug } = useParams();
  const service = services.find(s => s.slug === slug);
  const openContact = useContact();
  if (!service) return <InfoNotFound kind="Dịch vụ" />;
  const contactServiceTitle = service.slug === 'recruitment' ? 'Tư vấn và giới thiệu việc làm' : service.title;
  return <>
    <PageHero title={service.title} description={service.short} image={service.banner} />
    <nav className="container info-breadcrumb" aria-label="Đường dẫn"><Link to="/">Trang chủ</Link><ChevronRight size={14} /><Link to="/services">Dịch vụ</Link><ChevronRight size={14} /><span>{service.title}</span></nav>
    <section className="section container info-intro-grid"><div><span className="eyebrow">MINH ĐỨC ĐỒNG HÀNH</span><h2>{service.title}<br />bắt đầu từ sự thấu hiểu</h2><p className="info-lead">{service.intro}</p><p>{service.audience}</p><button className="btn" onClick={() => openContact(contactServiceTitle)} type="button">Nhận tư vấn <ArrowRight size={18} /></button></div><img className="info-rounded-photo" src={service.image} alt={`Giải pháp ${service.title.toLowerCase()}`} loading="lazy" /></section>
    <section className="section info-soft-section"><div className="container"><SectionHeading title="Giá trị trong từng kết nối" /><div className="grid-3 info-benefits">{service.benefits.map((benefit, i) => <article key={benefit.title}><span className="info-benefit-icon">{i === 0 ? <Users /> : i === 1 ? <ClipboardCheck /> : <Handshake />}</span><h3>{benefit.title}</h3><p>{benefit.text}</p></article>)}</div></div></section>
    <section className="section container"><SectionHeading title="Quy trình phối hợp" description="Các bước tham khảo; phạm vi cụ thể được thống nhất theo nhu cầu thực tế." /><ol className="info-process">{service.steps.map((step, i) => <li key={step}><span>0{i + 1}</span><p>{step}</p></li>)}</ol></section>
    <section className="section info-fee-section"><div className="container info-fee"><div><span className="eyebrow">PHƯƠNG ÁN PHÙ HỢP CHO BẠN</span><h2>Trao đổi rõ nhu cầu,<br />thống nhất rõ phạm vi.</h2></div><div><p>Mỗi yêu cầu có đặc điểm riêng về số lượng, địa điểm và thời gian. Hãy để lại thông tin để bắt đầu một cuộc trao đổi cụ thể.</p><button className="btn" onClick={() => openContact(contactServiceTitle)} type="button">Yêu cầu tư vấn <ArrowRight size={18} /></button></div></div></section>
    <section className="section container info-faq-section"><SectionHeading title="Câu hỏi thường gặp" description={`Những điều bạn có thể muốn biết về ${service.title.toLowerCase()}.`} /><FAQ questions={service.questions} /></section>
    <section className="section wide"><SectionHeading title="Khám phá dịch vụ khác" /><ServiceCards exclude={service.slug} /></section><CTASection />
  </>;
}

type ArticleSection = { heading: string; paragraphs: string[]; bullets?: string[] };
type Article = { slug: string; title: string; category: 'Dành cho người lao động' | 'Dành cho doanh nghiệp' | 'Góc nhân sự'; image: string; date: string; excerpt: string; sections: ArticleSection[] };
const articles: Article[] = [
  { slug: 'ho-so-xin-viec', title: 'Chuẩn bị hồ sơ xin việc tại nhà máy: bắt đầu từ đâu?', category: 'Dành cho người lao động', image: assets.opportunity, date: '12/11/2026', excerpt: 'Một danh sách gọn gàng giúp bạn chuẩn bị hồ sơ và hỏi đúng thông tin trước ngày phỏng vấn.', sections: [
    { heading: 'Xác nhận yêu cầu của từng vị trí', paragraphs: ['Mỗi nhà máy có thể có quy trình và yêu cầu hồ sơ khác nhau. Trước khi chuẩn bị giấy tờ, hãy hỏi rõ vị trí ứng tuyển, địa điểm tiếp nhận và người phụ trách. Một danh sách được xác nhận giúp bạn tránh đi lại nhiều lần.'] },
    { heading: 'Sắp xếp thông tin dễ kiểm tra', paragraphs: ['Ghi lại họ tên, số điện thoại, khu vực sinh sống, kinh nghiệm và thời gian có thể bắt đầu làm việc. Nếu chưa có kinh nghiệm, bạn vẫn có thể giới thiệu khả năng học hỏi và điều kiện làm việc mong muốn.'], bullets: ['Thông tin liên hệ còn sử dụng được.', 'Giấy tờ theo danh sách do đơn vị tiếp nhận xác nhận.', 'Bản sao khi được yêu cầu; giữ gìn giấy tờ gốc.', 'Các câu hỏi về công việc, ca làm và điều kiện nhận việc.'] },
    { heading: 'Bảo vệ thông tin cá nhân', paragraphs: ['Chỉ gửi hồ sơ cho đầu mối đã được xác minh. Không công khai ảnh giấy tờ tùy thân trên mạng xã hội. Khi được yêu cầu cung cấp thêm dữ liệu, hãy hỏi mục đích sử dụng và cách lưu giữ.'] },
  ] },
  { slug: 'nhu-cau-tuyen-dung', title: 'Lập kế hoạch bổ sung lao động theo từng đợt sản xuất', category: 'Dành cho doanh nghiệp', image: assets.logistics, date: '10/11/2026', excerpt: 'Làm rõ nhu cầu từ đầu giúp các bên phối hợp nhất quán trong quá trình tìm nguồn và tiếp nhận.', sections: [
    { heading: 'Bắt đầu từ kế hoạch vận hành', paragraphs: ['Doanh nghiệp nên xác định công đoạn cần bổ sung, số lượng dự kiến và thời điểm người lao động cần sẵn sàng làm việc. Nhu cầu càng cụ thể, việc trao đổi với đơn vị hỗ trợ tuyển dụng càng hiệu quả.'] },
    { heading: 'Thống nhất thông tin trước khi tìm nguồn', paragraphs: ['Một bản mô tả công việc ngắn, dễ hiểu có giá trị hơn các thông tin rời rạc. Nội dung nên được rà soát với bộ phận trực tiếp tiếp nhận.'], bullets: ['Địa điểm và phương án đi lại nếu có.', 'Ca làm, yêu cầu cơ bản và điều kiện làm việc.', 'Thu nhập, cách tính và các khoản cần làm rõ.', 'Đầu mối xác nhận lịch phỏng vấn, nhận việc.'] },
    { heading: 'Theo dõi và cập nhật theo giai đoạn', paragraphs: ['Đối chiếu số lượng quan tâm, lịch phỏng vấn và số lượng dự kiến tiếp nhận để cập nhật kế hoạch. Khi lịch sản xuất thay đổi, các bên cần thông báo sớm để tránh thông tin không đồng nhất.'] },
  ] },
  { slug: 'chon-cong-viec-phu-hop', title: 'Những câu hỏi nên làm rõ trước khi nhận việc', category: 'Dành cho người lao động', image: assets.recruitment, date: '08/11/2026', excerpt: 'Hiểu rõ công việc, thời gian và thu nhập giúp bạn lựa chọn công việc phù hợp hơn.', sections: [
    { heading: 'Công việc hằng ngày là gì?', paragraphs: ['Hãy hỏi về nhiệm vụ cụ thể, môi trường làm việc, yêu cầu thể lực và hướng dẫn ban đầu. Đừng ngại đề nghị giải thích lại những thuật ngữ chưa quen.'] },
    { heading: 'Thời gian và thu nhập được tính ra sao?', paragraphs: ['Làm rõ ca làm, ngày nghỉ, chính sách làm thêm và cách xác nhận chấm công. Với thu nhập, cần phân biệt khoản cố định, phụ cấp và khoản phụ thuộc điều kiện.'], bullets: ['Thời điểm trả lương và hình thức nhận lương.', 'Điều kiện áp dụng các khoản phụ cấp.', 'Thông tin hợp đồng và bảo hiểm cần được xác nhận.', 'Đầu mối hỗ trợ khi có thắc mắc.'] },
    { heading: 'Lưu lại các thông tin đã xác nhận', paragraphs: ['Giữ tin tuyển dụng và nội dung trao đổi cần thiết. Trước khi đi nhận việc, xác nhận địa chỉ, thời gian, giấy tờ cần mang và số điện thoại liên hệ.'] },
  ] },
  { slug: 'thong-tin-tuyen-dung-minh-bach', title: 'Thông tin tuyển dụng rõ ràng tạo nên kết nối tốt hơn', category: 'Góc nhân sự', image: assets.salary, date: '05/11/2026', excerpt: 'Sự nhất quán giữa tin tuyển dụng, tư vấn và thực tế tiếp nhận giúp giảm hiểu nhầm.', sections: [
    { heading: 'Một nguồn thông tin thống nhất', paragraphs: ['Tin tuyển dụng nên dùng ngôn ngữ dễ hiểu và nêu các điều kiện chính. Khi nhiều đầu mối cùng tham gia, cần thống nhất nội dung được phép chia sẻ và cách cập nhật thay đổi.'] },
    { heading: 'Trình bày đủ điều kiện', paragraphs: ['Thông tin thu nhập cần đi kèm cách tính hoặc điều kiện áp dụng. Các quyền lợi chưa được xác nhận không nên trình bày như cam kết. Điều này giúp ứng viên cân nhắc cơ hội phù hợp với nhu cầu thực tế.'] },
    { heading: 'Dành chỗ cho phản hồi', paragraphs: ['Một kênh để ứng viên hỏi lại thông tin giúp đơn vị tuyển dụng nhận ra những điểm chưa rõ. Các câu hỏi thường gặp có thể được bổ sung vào nội dung tuyển dụng ở lần cập nhật tiếp theo.'] },
  ] },
  { slug: 'don-tiep-lao-dong-moi', title: 'Chuẩn bị ngày đầu làm việc cho người lao động mới', category: 'Dành cho doanh nghiệp', image: assets.services, date: '02/11/2026', excerpt: 'Từ lịch hẹn đến người hướng dẫn, những chi tiết nhỏ giúp ngày đầu diễn ra thuận lợi.', sections: [
    { heading: 'Trước ngày tiếp nhận', paragraphs: ['Gửi hướng dẫn dễ đọc về địa chỉ, cổng vào, giờ có mặt và giấy tờ cần mang. Xác nhận một đầu mối có thể liên hệ khi người lao động cần hỗ trợ.'] },
    { heading: 'Trong ngày đầu tiên', paragraphs: ['Dành thời gian giới thiệu công việc, quy định và các hướng dẫn an toàn cần thiết. Kiểm tra người lao động đã hiểu nội dung thay vì chỉ đưa tài liệu.'], bullets: ['Giới thiệu người quản lý hoặc hướng dẫn trực tiếp.', 'Hướng dẫn khu vực làm việc và sinh hoạt.', 'Làm rõ quy trình chấm công, báo nghỉ và hỏi đáp.', 'Ghi nhận các thắc mắc phát sinh.'] },
    { heading: 'Sau khi bắt đầu công việc', paragraphs: ['Một lần hỏi thăm ngắn giúp phát hiện khó khăn ban đầu. Thông tin phản hồi có thể hỗ trợ cải thiện quy trình tiếp nhận cho những đợt tiếp theo.'] },
  ] },
  { slug: 'an-toan-thong-tin-khi-tim-viec', title: 'Giữ an toàn thông tin cá nhân khi tìm việc trực tuyến', category: 'Góc nhân sự', image: assets.privacy, date: '30/10/2026', excerpt: 'Xác minh nguồn tin, bảo vệ giấy tờ và thận trọng trước những yêu cầu chưa rõ ràng.', sections: [
    { heading: 'Kiểm tra nguồn tin', paragraphs: ['Đối chiếu tên doanh nghiệp, số liên hệ và địa điểm tuyển dụng. Khi có điều chưa rõ, hãy tìm kênh liên hệ chính thức và hỏi trực tiếp trước khi cung cấp hồ sơ.'] },
    { heading: 'Chia sẻ vừa đủ thông tin', paragraphs: ['Ở bước tư vấn ban đầu, chỉ chia sẻ thông tin cần cho việc trao đổi công việc. Không gửi mã xác thực, mật khẩu hoặc thông tin tài khoản ngân hàng cho người tuyển dụng.'] },
    { heading: 'Cẩn trọng với yêu cầu chuyển tiền', paragraphs: ['Nếu có yêu cầu đóng phí hoặc chuyển tiền, hãy làm rõ đơn vị nhận, mục đích, căn cứ và chứng từ. Dừng trao đổi khi gặp dấu hiệu đáng ngờ và xác minh qua một kênh độc lập.'] },
  ] },
];
function ArticleCard({ article }: { article: Article }) {
  return <article className="info-news-card"><Link to={`/news/${article.slug}`} className="info-news-image"><img src={article.image} alt="" loading="lazy" /><span className="info-demo-tag">Bài viết minh họa</span></Link><div className="info-news-meta"><span><CalendarDays size={13} /> {article.date}</span><span>{article.category}</span></div><h2><Link to={`/news/${article.slug}`}>{article.title}</Link></h2><p>{article.excerpt}</p><Link className="info-text-link" to={`/news/${article.slug}`}>Đọc bài viết <ArrowRight size={16} /></Link></article>;
}
export function NewsPage() {
  const [category, setCategory] = useState('Tất cả');
  const [page, setPage] = useState(1);
  const categories = ['Tất cả', 'Dành cho người lao động', 'Dành cho doanh nghiệp', 'Góc nhân sự'];
  const filtered = articles.filter(a => category === 'Tất cả' || a.category === category);
  const totalPages = Math.ceil(filtered.length / 3);
  return <><PageHero title="Tin tức & góc chia sẻ" description="Thông tin hữu ích cho doanh nghiệp và người lao động." image={assets.news} /><section className="section container"><div className="info-tabs" aria-label="Chuyên mục tin tức">{categories.map(item => <button type="button" key={item} aria-pressed={category === item} className={category === item ? 'active' : ''} onClick={() => { setCategory(item); setPage(1); }}>{item}</button>)}</div><p className="info-content-note">Nội dung biên tập minh họa cho prototype; chưa phải tin tức do Minh Đức phát hành.</p><p className="info-result-count" aria-live="polite">{filtered.length} bài viết · Trang {page}/{totalPages}</p><div className="grid-3 info-news-grid">{filtered.slice((page - 1) * 3, page * 3).map(article => <ArticleCard key={article.slug} article={article} />)}</div>{totalPages > 1 && <nav className="info-pagination" aria-label="Phân trang tin tức"><button type="button" aria-label="Trang trước" disabled={page === 1} onClick={() => setPage(page - 1)}><ChevronLeft size={18} /></button>{Array.from({ length: totalPages }, (_, i) => <button type="button" aria-current={page === i + 1 ? 'page' : undefined} className={page === i + 1 ? 'active' : ''} key={i} onClick={() => setPage(i + 1)}>{i + 1}</button>)}<button type="button" aria-label="Trang sau" disabled={page === totalPages} onClick={() => setPage(page + 1)}><ChevronRight size={18} /></button></nav>}</section><CTASection /></>;
}
export function ArticlePage() {
  const { slug } = useParams();
  const article = articles.find(a => a.slug === slug);
  const [tocOpen, setTocOpen] = useState(true);
  if (!article) return <InfoNotFound kind="Bài viết" />;
  return <><PageHero title="Góc chia sẻ" image={assets.news} /><nav className="container info-breadcrumb" aria-label="Đường dẫn"><Link to="/">Trang chủ</Link><ChevronRight size={14} /><Link to="/news">Tin tức</Link><ChevronRight size={14} /><span>{article.category}</span></nav><div className="section container info-article-layout"><article className="info-article"><span className="info-demo-tag info-inline-tag">Bài viết minh họa</span><h2 className="info-article-title">{article.title}</h2><div className="info-news-meta"><span><CalendarDays size={14} /> {article.date}</span><span><Clock3 size={14} /> 3 phút đọc</span></div><p className="info-lead">{article.excerpt}</p><img className="info-article-cover" src={article.image} alt="" /><div className="info-toc"><button type="button" aria-expanded={tocOpen} aria-controls="article-toc" onClick={() => setTocOpen(!tocOpen)}>Nội dung bài viết <ChevronDown size={18} /></button><ol id="article-toc" hidden={!tocOpen}>{article.sections.map((section, i) => <li key={section.heading}><a href={`#article-section-${i}`}>{section.heading}</a></li>)}</ol></div><div className="prose">{article.sections.map((section, i) => <section key={section.heading} id={`article-section-${i}`}><h2>{section.heading}</h2>{section.paragraphs.map(p => <p key={p}>{p}</p>)}{section.bullets && <ul>{section.bullets.map(b => <li key={b}>{b}</li>)}</ul>}</section>)}</div><p className="info-content-note">Nội dung hướng dẫn tổng quát phục vụ trải nghiệm prototype. Yêu cầu hồ sơ và điều kiện làm việc cần được xác nhận trực tiếp với đơn vị tuyển dụng.</p><ButtonLink to="/news" secondary>Trở về tất cả bài viết</ButtonLink></article><aside className="info-article-aside"><h2>Đồng hành cùng bạn</h2><p>Bạn cần tìm việc hoặc bổ sung nhân lực? Chia sẻ với Minh Đức để được tư vấn.</p><ButtonLink to="/contact">Liên hệ Minh Đức</ButtonLink><div className="info-aside-related"><h3>Có thể bạn quan tâm</h3>{articles.filter(a => a.slug !== slug).slice(0, 3).map(a => <Link key={a.slug} to={`/news/${a.slug}`}>{a.title}<ArrowUpRight size={18} /></Link>)}</div></aside></div></>;
}

type EventData = { slug: string; title: string; tag: string; date: string; time: string; location: string; image: string; upcoming: boolean; summary: string; agenda: [string, string][] };
const events: EventData[] = [
  { slug: 'ngay-hoi-ket-noi-viec-lam', title: 'Ngày hội kết nối việc làm cùng Minh Đức', tag: 'Kết nối việc làm', date: '28/11/2026', time: '08:30 – 11:30', location: 'Địa điểm sẽ được xác nhận', image: assets.opportunity, upcoming: true, summary: 'Một không gian để người tìm việc trao đổi nhu cầu, tìm hiểu công việc và chuẩn bị những bước tiếp theo.', agenda: [['08:30', 'Đón tiếp và ghi nhận nhu cầu tìm việc'], ['09:00', 'Chia sẻ thông tin về công việc tại nhà máy'], ['10:00', 'Tư vấn cách chuẩn bị hồ sơ'], ['11:00', 'Hỏi đáp và hướng dẫn bước tiếp theo']] },
  { slug: 'toa-dam-ke-hoach-nhan-luc', title: 'Trao đổi kế hoạch nhân lực cho doanh nghiệp sản xuất', tag: 'Dành cho doanh nghiệp', date: '05/12/2026', time: '14:00 – 15:30', location: 'Hình thức trực tuyến', image: assets.logistics, upcoming: true, summary: 'Nội dung trao đổi gợi ý về việc làm rõ nhu cầu tuyển dụng, phối hợp tìm nguồn và chuẩn bị tiếp nhận lao động.', agenda: [['14:00', 'Giới thiệu nội dung trao đổi'], ['14:15', 'Làm rõ nhu cầu và thông tin tuyển dụng'], ['14:45', 'Phối hợp tiếp nhận theo từng đợt'], ['15:15', 'Thảo luận các tình huống thực tế']] },
  { slug: 'hanh-trang-tim-viec', title: 'Hành trang tìm việc: từ hồ sơ đến ngày đầu đi làm', tag: 'Hướng dẫn người lao động', date: '08/11/2026', time: '09:00 – 10:30', location: 'Buổi chia sẻ minh họa', image: assets.recruitment, upcoming: false, summary: 'Gợi ý nội dung chia sẻ giúp người lao động chuẩn bị hồ sơ, kiểm tra nguồn tin và đặt câu hỏi trước khi nhận việc.', agenda: [['09:00', 'Chuẩn bị thông tin và hồ sơ'], ['09:30', 'Những điều cần hỏi trước khi nhận việc'], ['10:00', 'Bảo vệ thông tin cá nhân khi ứng tuyển']] },
];
export function EventsPage() {
  const [filter, setFilter] = useState('Tất cả');
  const filtered = events.filter(e => filter === 'Tất cả' || (filter === 'Sắp diễn ra' ? e.upcoming : !e.upcoming));
  return <><PageHero title="Sự kiện & kết nối" description="Cùng chia sẻ thông tin, mở rộng cơ hội." image={assets.about} /><section className="section container"><div className="info-tabs" aria-label="Lọc sự kiện">{['Tất cả', 'Sắp diễn ra', 'Đã diễn ra'].map(item => <button type="button" key={item} aria-pressed={filter === item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div><p className="info-content-note">Lịch và nội dung sự kiện dưới đây là dữ liệu minh họa, chưa phải thông báo tổ chức chính thức.</p><div className="info-event-list">{filtered.map(event => <article className="info-event-card" key={event.slug}><Link to={`/events/${event.slug}`}><img src={event.image} alt="" loading="lazy" /></Link><div><div className="info-event-tags"><span className="info-demo-tag info-inline-tag">Sự kiện minh họa</span><span>{event.upcoming ? 'Sắp diễn ra' : 'Đã diễn ra'}</span></div><span className="eyebrow">{event.tag}</span><h2><Link to={`/events/${event.slug}`}>{event.title}</Link></h2><p>{event.summary}</p><div className="info-event-meta"><span><CalendarDays size={16} />{event.date}</span><span><Clock3 size={16} />{event.time}</span></div><Link className="info-text-link" to={`/events/${event.slug}`}>Xem chi tiết <ArrowRight size={17} /></Link></div></article>)}</div><p className="info-result-count" aria-live="polite">Hiển thị {filtered.length} sự kiện minh họa</p></section></>;
}
export function EventPage() {
  const { slug } = useParams();
  const event = events.find(e => e.slug === slug);
  if (!event) return <InfoNotFound kind="Sự kiện" />;
  return <><PageHero title="Kết nối cùng Minh Đức" image={event.image} /><nav className="container info-breadcrumb" aria-label="Đường dẫn"><Link to="/events">Sự kiện</Link><ChevronRight size={14} /><span>Chi tiết sự kiện</span></nav><section className="section container info-article-layout"><article className="info-article"><span className="info-demo-tag info-inline-tag">Lịch sự kiện minh họa</span><h2 className="info-article-title">{event.title}</h2><p className="info-lead">{event.summary}</p><img className="info-article-cover" src={event.image} alt="" /><h2>Nội dung dự kiến</h2><ol className="info-agenda">{event.agenda.map(([time, item]) => <li key={time}><time>{time}</time><span>{item}</span></li>)}</ol><div className="info-content-note">Đây là nội dung mẫu để duyệt giao diện sự kiện. Thời gian, địa điểm, chương trình và hình thức tham gia chưa được Minh Đức xác nhận.</div><ButtonLink to="/events" secondary>Xem các sự kiện khác</ButtonLink></article><aside className="info-event-aside"><h2>Thông tin sự kiện</h2><p><CalendarDays size={20} /><span>{event.date}<small>Ngày minh họa</small></span></p><p><Clock3 size={20} /><span>{event.time}</span></p><p><MapPin size={20} /><span>{event.location}</span></p><hr /><p className="muted">Liên hệ trực tiếp để tìm hiểu các hoạt động thực tế của Minh Đức.</p><a className="btn" href={`tel:${contact.tel}`}><Phone size={17} /> {contact.phone}</a></aside></section></>;
}

export function PartnersPage() {
  return <><PageHero title="Đối tác & kết nối" description="Cùng hướng tới những cơ hội việc làm phù hợp." image={assets.services} /><section className="section container"><SectionHeading title="Mạng lưới được giới thiệu" description="Các doanh nghiệp có trong thông tin đối tác do Minh Đức cung cấp." /><PartnerStrip /><p className="info-content-note">Danh sách thể hiện thông tin được cung cấp cho prototype; không đồng nghĩa mọi đối tác đều đang có vị trí tuyển dụng.</p></section><section className="section info-soft-section"><div className="container info-intro-grid"><div><span className="eyebrow">DÀNH CHO DOANH NGHIỆP</span><h2>Kết nối nguồn lực<br />cho kế hoạch của bạn</h2><p>Doanh nghiệp cần bổ sung lao động hoặc muốn trao đổi một kế hoạch hợp tác? Minh Đức sẵn sàng lắng nghe nhu cầu và cùng làm rõ các bước phối hợp.</p><ButtonLink to="/contact">Trao đổi hợp tác</ButtonLink></div><div className="info-partner-benefits"><p><Check /> Thông tin nhu cầu rõ ràng</p><p><Check /> Đầu mối phối hợp thống nhất</p><p><Check /> Đồng hành trong quá trình kết nối</p></div></div></section><CTASection /></>;
}
export function BrochurePage() {
  return <><div className="info-no-print"><PageHero title="Hồ sơ giới thiệu" description="Minh Đức · Nhân lực là tài sản" image={assets.about} /></div><section className="section container info-brochure"><div className="info-brochure-toolbar info-no-print"><span>Bản giới thiệu trực tuyến</span><button type="button" className="btn btn-secondary" onClick={() => window.print()}><Printer size={17} /> In / lưu PDF</button></div><div className="info-brochure-cover"><span className="eyebrow">MINH ĐỨC</span><h2>Kết nối nhân lực.<br />Mở rộng cơ hội.</h2><p>Nhân lực là tài sản</p><div className="info-brochure-cover-line" /></div><div className="info-brochure-body"><section><h2>Về Minh Đức</h2><p>Minh Đức kết nối doanh nghiệp và người lao động trong lĩnh vực cung ứng nhân lực, giới thiệu việc làm, với trọng tâm là lao động phổ thông tại nhà máy và doanh nghiệp sản xuất.</p></section><section><h2>Giải pháp của chúng tôi</h2><div className="grid-3">{services.map((service, i) => <div key={service.slug}><span className="eyebrow">0{i + 1}</span><h3>{service.title}</h3><p>{service.short}</p></div>)}</div></section><section><h2>Đối tác được giới thiệu</h2><p>{partners.join(' · ')}</p></section><section className="info-brochure-contact"><h2>Bắt đầu một cuộc trao đổi</h2><p><Phone size={17} /> {contact.phone}</p><p><Mail size={17} /> {contact.email}</p><p>Zalo: zalo.me/0329138082</p><p>Facebook: facebook.com/md668.com.vn</p></section><p className="info-content-note">Bản giới thiệu phục vụ duyệt prototype. Hình ảnh minh họa được sử dụng từ bản giao diện tham chiếu; nội dung chi tiết sẽ được hoàn thiện trước khi phát hành chính thức.</p></div></section></>;
}
export function PolicyPage({ kind }: { kind: 'privacy' | 'terms' }) {
  const isPrivacy = kind === 'privacy';
  return <><PageHero title={isPrivacy ? 'Chính sách bảo mật' : 'Điều khoản sử dụng'} image={assets.about} /><section className="section container info-policy prose"><span className="info-demo-tag info-inline-tag">Bản dự thảo cho prototype</span><h2 className="info-policy-title">{isPrivacy ? 'Thông tin cá nhân & quyền riêng tư' : 'Sử dụng website Minh Đức'}</h2><p className="info-lead">Nội dung này mô tả phạm vi trải nghiệm của bản prototype và cần được Minh Đức rà soát trước khi phát hành website chính thức.</p>{isPrivacy ? <><h2>1. Thông tin trong biểu mẫu</h2><p>Các biểu mẫu có thể yêu cầu họ tên, số điện thoại, email, nhu cầu tuyển dụng hoặc tìm việc và hồ sơ CV. Trong prototype, thao tác gửi được mô phỏng trên trình duyệt; dữ liệu không được gửi đến hệ thống tiếp nhận của Minh Đức.</p><h2>2. Dữ liệu lưu trên thiết bị</h2><p>Website có thể lưu lựa chọn ngôn ngữ, việc làm đã lưu và tùy chọn giao diện trong bộ nhớ trình duyệt để hỗ trợ trải nghiệm. Bạn có thể xóa dữ liệu website trong phần cài đặt trình duyệt.</p><h2>3. Giấy tờ và hồ sơ cá nhân</h2><p>Chỉ cung cấp thông tin cần thiết cho mục đích tìm việc. Không gửi mật khẩu, mã xác thực hoặc dữ liệu tài chính qua biểu mẫu. Với phiên bản chính thức, mục đích sử dụng, thời gian lưu và đơn vị xử lý dữ liệu cần được công bố rõ trước khi tiếp nhận hồ sơ.</p><h2>4. Liên kết bên ngoài</h2><p>Liên kết Facebook, Zalo, email và điện thoại đưa bạn đến dịch vụ khác. Việc sử dụng thông tin tại các dịch vụ đó chịu sự điều chỉnh của chính sách tương ứng.</p><h2>5. Trao đổi về thông tin cá nhân</h2><p>Nếu có thắc mắc, vui lòng liên hệ Minh Đức qua thông tin bên dưới. Yêu cầu liên quan dữ liệu thực tế cần được xác minh qua kênh liên hệ chính thức.</p></> : <><h2>1. Phạm vi bản prototype</h2><p>Website dùng để trải nghiệm và đánh giá giao diện, các luồng tìm việc, giới thiệu dịch vụ và gửi yêu cầu. Những nội dung có nhãn minh họa không phải tin tuyển dụng hoặc thông báo sự kiện chính thức.</p><h2>2. Thông tin tuyển dụng và dịch vụ</h2><p>Điều kiện tuyển dụng, thu nhập, chi phí dịch vụ và phạm vi hợp tác cần được xác nhận trực tiếp với Minh Đức hoặc đơn vị tuyển dụng trước khi đưa ra quyết định.</p><h2>3. Sử dụng các biểu mẫu</h2><p>Người sử dụng nên cung cấp thông tin chính xác, phù hợp mục đích của biểu mẫu. Tính năng gửi trong prototype là mô phỏng và chưa tạo hồ sơ ứng tuyển, yêu cầu tư vấn hay đăng ký sự kiện thực tế.</p><h2>4. Tài liệu và hình ảnh</h2><p>Thiết kế được phát triển theo bản tham chiếu do người dùng cung cấp. Các hình ảnh minh họa cần được rà soát và thay thế bằng tài sản được phê duyệt trước khi sử dụng cho website chính thức.</p><h2>5. Liên kết và nội dung bên ngoài</h2><p>Website có thể dẫn đến các nền tảng liên hệ và thông tin bên ngoài. Nội dung tại các nền tảng này có thể thay đổi; hãy kiểm tra đúng tài khoản và đầu mối trước khi trao đổi thông tin cá nhân.</p></>}<div className="info-policy-contact"><ShieldCheck size={26} /><div><h2>Liên hệ Minh Đức</h2><p><a href={`tel:${contact.tel}`}>{contact.phone}</a><br /><a href={`mailto:${contact.email}`}>{contact.email}</a></p></div></div><ButtonLink to="/" secondary>Về trang chủ</ButtonLink></section></>;
}
