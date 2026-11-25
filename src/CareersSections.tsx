import {useEffect, useId, useRef, useState, type ReactNode} from 'react';
import {ArrowLeft, ArrowRight, Maximize2, Pause, Play} from 'lucide-react';
import {Link, useLocation} from 'react-router-dom';
import {useLocale} from './i18n';
import {lookup} from './i18n-runtime/catalog';
import {jobs} from './jobs-data';
import {PageMasthead} from './PageMasthead';
import {Modal} from './shared';
import {RevealFrame} from './motion';
import {advanceHomeRail, useHomeCarousel} from './useHomeCarousel';
import media from './careers-media.json';
import './Careers.css';

const internalJobs = jobs.filter(job => job.internal);
const specialist = internalJobs.find(job => job.id === 'MD007')!;
const associate = internalJobs.find(job => job.id === 'MD008')!;
const workItems = [
  {title: 'Lắng nghe ứng viên', text: specialist.tasks[0], job: specialist},
  {title: 'Theo dõi từng cuộc hẹn', text: specialist.tasks[1], job: specialist},
  {title: 'Kết nối tại địa phương', text: associate.tasks[1], job: associate},
];
const benefitItems = [
  {title: 'Hướng dẫn nghiệp vụ', text: specialist.benefits[0], job: specialist},
  {title: 'Phát triển kỹ năng tư vấn', text: specialist.benefits[1], job: specialist},
  {title: 'Điều kiện cộng tác', text: associate.benefits[1], job: associate},
];
const steps = [
  ['Chọn vị trí', 'Đọc nhiệm vụ, yêu cầu và hình thức làm việc trên trang chi tiết.'],
  ['Điền thông tin mẫu', 'Nhập họ tên và số điện thoại mẫu. Bạn có thể thêm email.'],
  ['Đính kèm CV nếu muốn', 'CV không bắt buộc. Tối đa 3 tệp JPG, JPEG, PNG, PDF, DOC hoặc DOCX, 5 MB mỗi tệp, tổng 15 MB.'],
  ['Xem mã mô phỏng', 'Hồ sơ mẫu chỉ hiển thị trong phiên hiện tại. Tệp không được tải lên.'],
];
const questions = [
  {title: 'Tôi có thể ứng tuyển cộng tác viên ở đâu?', text: 'Mở vị trí Cộng tác viên tuyển dụng để xem địa bàn, nhiệm vụ và hình thức cộng tác.', link: '/jobs/' + associate.slug, label: associate.title},
  {title: 'Tôi cần chuẩn bị CV không?', text: 'Bạn có thể hoàn tất đơn ứng tuyển nội bộ với họ tên và số điện thoại mẫu.', link: '#cv-requirements', label: 'Xem cách ứng tuyển'},
  {title: 'Làm sao xem lại vị trí đã lưu?', text: 'Chọn biểu tượng lưu bên cạnh một vị trí. Danh sách đã lưu có trên trình duyệt và thiết bị bạn đang dùng.', link: '/saved-jobs', label: 'Việc đã lưu'},
];

function scrollItem(track: HTMLDivElement, direction: number) {
  const last = track.scrollWidth - track.clientWidth;
  if (last < 2) return;
  const children = track.children;
  const step = children.length > 1 ? (children[1] as HTMLElement).offsetLeft - (children[0] as HTMLElement).offsetLeft : track.clientWidth;
  const left = direction > 0 && track.scrollLeft >= last - 2 ? 0
    : direction < 0 && track.scrollLeft <= 2 ? last
    : Math.max(0, Math.min(last, track.scrollLeft + direction * (step || track.clientWidth)));
  track.scrollTo({left, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
}

function CareerRail({title, id, kind, modalOpen, children}: {
  title: string; id?: string; kind: 'work' | 'benefits' | 'questions' | 'gallery'; modalOpen: boolean; children: ReactNode;
}) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const trackId = useId();
  const [overflow, setOverflow] = useState(true);
  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const measure = () => {
      if (element.clientWidth > 0) setOverflow(element.scrollWidth > element.clientWidth + 1);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const auto = useHomeCarousel(section, () => advanceHomeRail(track.current), '.career-track,.career-rail-controls', {disabled: modalOpen || !overflow});
  return <section id={id} ref={section} className={`career-block career-rail-section career-${kind}`} aria-labelledby={labelId}>
    <div className="container">
      <div className="career-rail-heading">
        <h2 id={labelId}>{title}</h2>
        {overflow && <div className="career-rail-controls">
          <button type="button" className="career-carousel-pause" aria-pressed={auto.paused} aria-controls={trackId} onClick={auto.toggle}>
            {auto.paused ? <Play size={16} aria-hidden="true"/> : <Pause size={16} aria-hidden="true"/>}
            <span>{auto.paused ? 'Phát' : 'Tạm dừng'}</span>
          </button>
          <button type="button" aria-controls={trackId} aria-label="Mục trước" onClick={() => track.current && scrollItem(track.current, -1)}><ArrowLeft size={18} aria-hidden="true"/></button>
          <button type="button" aria-controls={trackId} aria-label="Mục tiếp theo" onClick={() => track.current && scrollItem(track.current, 1)}><ArrowRight size={18} aria-hidden="true"/></button>
        </div>}
      </div>
      <div id={trackId} ref={track} className="career-track" role="region" aria-labelledby={labelId} tabIndex={overflow ? 0 : undefined}>{children}</div>
    </div>
  </section>;
}

function CareerLink({to, children}: {to: string; children: ReactNode}) {
  const {pathname, search, hash} = useLocation();
  if (to.startsWith('#')) return <a href={to}>{children}</a>;
  const state = to.startsWith('/jobs/') ? {jobOrigin: {pathname, search, hash, steps: 1}} : undefined;
  return <Link to={to} state={state}>{children}</Link>;
}

function PositionItems({items}: {items: typeof workItems}) {
  return items.map(item => <article key={item.title} className="career-rail-item">
    <h3>{item.title}</h3>
    <p>{item.text}</p>
    <CareerLink to={'/jobs/' + item.job.slug}>{item.job.title}</CareerLink>
  </article>);
}

function nextPhoto(index: number, direction: number) {
  return (index + direction + media.gallery.length) % media.gallery.length;
}

export default function CareersSections({openings}: {openings: ReactNode}) {
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const modalOpen = galleryIndex !== null;
  const locale = useLocale();
  const translate = (key: string) => lookup(locale, key) ?? key;
  const galleryPhoto = galleryIndex === null ? null : media.gallery[galleryIndex];
  useEffect(() => {
    if (!modalOpen) return;
    const navigate = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      setGalleryIndex(index => index === null ? null : nextPhoto(index, event.key === 'ArrowRight' ? 1 : -1));
    };
    document.addEventListener('keydown', navigate);
    return () => document.removeEventListener('keydown', navigate);
  }, [modalOpen]);
  return <div className="careers-page">
    <PageMasthead title="Gia nhập đội ngũ Minh Đức" description="Tìm hiểu các vị trí tư vấn, tuyển dụng và kết nối người lao động tại Minh Đức." image={media.banner} imageAlt={media.gallery[0].alt} imageCaption={media.gallery[0].caption}>
      <a className="btn career-primary" href="#open-positions">Xem vị trí nội bộ</a>
      <Link className="career-text-link" to="/jobs#job-listings">Tìm việc tại nhà máy</Link>
    </PageMasthead>

    <section className="career-openings"><div className="container" id="open-positions" tabIndex={-1}>{openings}</div></section>

    <section className="career-block career-roles"><div className="container">
      <h2>Hai cách làm nghề tuyển dụng</h2>
      <div className="career-feature-grid">
        {[
          {job: specialist, photo: media.gallery[1], text: 'Tiếp nhận nhu cầu, giải thích công việc và theo sát lịch trao đổi cùng ứng viên.'},
          {job: associate, photo: media.gallery[3], text: 'Chia sẻ thông tin tuyển dụng đã xác nhận và kết nối người quan tâm với đội tư vấn.'},
        ].map(({job, photo, text}) => <article key={job.id} className="career-feature">
          <RevealFrame effect="media" className="career-feature-image"><img src={photo.src} alt={photo.alt} loading="lazy" sizes="(max-width: 767px) 92vw, 48vw"/></RevealFrame>
          <div className="career-feature-copy"><h3><CareerLink to={'/jobs/' + job.slug}>{job.title}</CareerLink></h3><p>{text}</p></div>
        </article>)}
      </div>
    </div></section>

    <CareerRail kind="work" title="Công việc hằng ngày" modalOpen={modalOpen}><PositionItems items={workItems}/></CareerRail>
    <CareerRail kind="benefits" id="position-benefits" title="Quyền lợi theo vị trí" modalOpen={modalOpen}><PositionItems items={benefitItems}/></CareerRail>

    <section id="cv-requirements" tabIndex={-1} className="career-block career-process"><div className="container">
      <h2>Cách ứng tuyển nội bộ</h2>
      <ol className="career-process-grid">{steps.map(([title, text], index) => <li key={title}><RevealFrame delay={index as 0|1|2|3}><article className="career-step">
        <span className="career-step-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{text}</p>
      </article></RevealFrame></li>)}</ol>
      <div id="career-contact"><Link className="career-text-link" to="/contact#consultation">Trao đổi với Minh Đức</Link></div>
    </div></section>

    <CareerRail kind="questions" title="Câu hỏi về ứng tuyển nội bộ" modalOpen={modalOpen}>
      {questions.map(item => <article className="career-rail-item" key={item.title}><h3>{item.title}</h3><p>{item.text}</p><CareerLink to={item.link}>{item.label}</CareerLink></article>)}
    </CareerRail>

    <CareerRail kind="gallery" title="Hoạt động của Minh Đức" modalOpen={modalOpen}>
      {media.gallery.map((photo, index) => <figure key={photo.src} className="career-gallery-item">
        <button type="button" aria-label={translate('Xem ảnh lớn') + ' · ' + translate(photo.caption)} onClick={event => {event.currentTarget.focus({preventScroll: true}); setGalleryIndex(index);}}>
          <img src={photo.src} alt={photo.alt} loading="lazy" sizes="(max-width: 767px) 83vw, 38vw"/>
          <span aria-hidden="true"><Maximize2 size={17}/></span>
        </button>
        <figcaption>{photo.caption}</figcaption>
      </figure>)}
    </CareerRail>

    {galleryPhoto && galleryIndex !== null && <Modal title="Hoạt động của Minh Đức" onClose={() => setGalleryIndex(null)}>
      <figure className="career-lightbox">
        <img src={galleryPhoto.src} alt={galleryPhoto.alt} className="career-gallery-large" sizes="(max-width: 767px) 94vw, 900px"/>
        <figcaption aria-live="polite" aria-atomic="true"><span>{galleryIndex + 1} / {media.gallery.length}</span> {galleryPhoto.caption}</figcaption>
      </figure>
      <div className="career-gallery-controls">
        <button type="button" aria-label="Ảnh trước" onClick={() => setGalleryIndex(nextPhoto(galleryIndex, -1))}><ArrowLeft size={20}/></button>
        <button type="button" aria-label="Ảnh tiếp theo" onClick={() => setGalleryIndex(nextPhoto(galleryIndex, 1))}><ArrowRight size={20}/></button>
      </div>
    </Modal>}
  </div>;
}
