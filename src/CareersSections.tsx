import {useEffect, useId, useRef, useState, type CSSProperties, type ReactNode} from 'react';
import {ArrowLeft, ArrowRight, ArrowUpRight, MapPin, Pause, Play} from 'lucide-react';
import {Link, useLocation} from 'react-router-dom';
import {useLocale, useTranslation} from './i18n';
import {lookup} from './i18n-runtime/catalog';
import {jobs, type Job} from './jobs-data';
import {PageMasthead} from './PageMasthead';
import {responsiveImage} from './media';
import {Modal} from './shared';
import {RevealFrame} from './motion';
import {adjacentRailOffset, advanceHomeRail, useHomeCarousel} from './useHomeCarousel';
import media from './careers-media.json';
import './Careers.css';

const gallery = media.gallery.map(photo => {
  const dimensions = responsiveImage(photo.src);
  const frame = dimensions && {'--photo-ratio': dimensions.width / dimensions.height} as CSSProperties;
  return {...photo, frame};
});

const internalJobs = jobs.filter(job => job.internal);
const specialist = internalJobs.find(job => job.id === 'MD007');
const associate = internalJobs.find(job => job.id === 'MD008');
const mastheadPhoto = media.gallery.find(photo => photo.src === media.banner);
const roleStories = [
  {
    job: specialist,
    photo: media.gallery.find(photo => photo.src === media.rolePhotos.MD007),
    sizes: 'auto, (max-width: 640px) calc(100vw - 40px), (max-width: 1240px) 64vw, 765px',
    text: 'Tiếp nhận nhu cầu, giải thích công việc và theo sát lịch trao đổi cùng ứng viên.',
  },
  {
    job: associate,
    photo: media.gallery.find(photo => photo.src === media.rolePhotos.MD008),
    sizes: 'auto, (max-width: 360px) calc(100vw - 40px), (max-width: 640px) 320px, (max-width: 1240px) 32vw, 384px',
    text: 'Chia sẻ thông tin tuyển dụng đã xác nhận và kết nối người quan tâm với đội tư vấn.',
  },
];

function positionItems(job: Job | undefined, section: 'tasks' | 'benefits', labels: [number, string][]) {
  if (!job) return [];
  return labels.flatMap(([index, title]) => {
    const text = job[section][index];
    return text ? [{job, text, title}] : [];
  });
}

const workItems = [
  ...positionItems(specialist, 'tasks', [[0, 'Lắng nghe ứng viên'], [1, 'Theo dõi từng cuộc hẹn']]),
  ...positionItems(associate, 'tasks', [[1, 'Kết nối tại địa phương']]),
];
const benefitItems = [
  ...positionItems(specialist, 'benefits', [[0, 'Hướng dẫn nghiệp vụ'], [1, 'Phát triển kỹ năng tư vấn']]),
  ...positionItems(associate, 'benefits', [[1, 'Điều kiện cộng tác']]),
];
const steps = [
  ['Chọn vị trí', 'Đọc nhiệm vụ, yêu cầu và hình thức làm việc trên trang chi tiết.'],
  ['Điền thông tin mẫu', 'Nhập họ tên và số điện thoại mẫu. Bạn có thể thêm email.'],
  ['Đính kèm CV nếu muốn', 'CV không bắt buộc. Tối đa 3 tệp JPG, JPEG, PNG, PDF, DOC hoặc DOCX, 5 MB mỗi tệp, tổng 15 MB.'],
  ['Xem mã mô phỏng', 'Hồ sơ mẫu chỉ hiển thị trong phiên hiện tại. Tệp không được tải lên.'],
];
const questions = [
  ...(associate ? [{title: 'Tôi có thể ứng tuyển cộng tác viên ở đâu?', text: 'Mở vị trí Cộng tác viên tuyển dụng để xem địa bàn, nhiệm vụ và hình thức cộng tác.', link: '/jobs/' + associate.slug, label: associate.title}] : []),
  {title: 'Tôi cần chuẩn bị CV không?', text: 'Bạn có thể hoàn tất đơn ứng tuyển nội bộ với họ tên và số điện thoại mẫu.', link: '#cv-requirements', label: 'Xem cách ứng tuyển'},
  {title: 'Làm sao xem lại vị trí đã lưu?', text: 'Chọn biểu tượng lưu bên cạnh một vị trí. Danh sách đã lưu có trên trình duyệt và thiết bị bạn đang dùng.', link: '/saved-jobs', label: 'Việc đã lưu'},
];

function CareerRail({title, id, kind, modalOpen, children}: {
  title: string; id?: string; kind: 'work' | 'benefits' | 'questions' | 'gallery'; modalOpen: boolean; children: ReactNode;
}) {
  const t = useTranslation();
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const trackId = useId();
  const [paused,setPaused] = useState(false);
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
  useHomeCarousel(section, () => advanceHomeRail(track.current), '.career-rail-section', {disabled: modalOpen || !overflow, paused});
  function step(backwards: boolean) {
    const rail = track.current;
    if (!rail) return;
    const max = rail.scrollWidth - rail.clientWidth;
    const wrap = backwards ? rail.scrollLeft <= 2 : rail.scrollLeft >= max - 2;
    rail.scrollLeft = wrap ? (backwards ? max : 0) : adjacentRailOffset(rail,backwards);
  }
  const playLabel = t({vi:'Phát chuyển động',en:'Play rotation',zh:'播放轮播',ko:'자동 이동 재생',ja:'自動スライドを再生'});
  const pauseLabel = t({vi:'Tạm dừng chuyển động',en:'Pause rotation',zh:'暂停轮播',ko:'자동 이동 일시 정지',ja:'自動スライドを一時停止'});
  return <section id={id} tabIndex={id ? -1 : undefined} ref={section} className={`career-block career-rail-section career-${kind}`} aria-labelledby={labelId}>
    <div className="container">
      <div className="career-rail-heading">
        <h2 id={labelId}>{title}</h2>
        {overflow && <div className="career-rail-controls">
          <button type="button" aria-label="Mục trước" aria-controls={trackId} onClick={()=>step(true)}><ArrowLeft aria-hidden="true"/></button>
          <button className="career-carousel-pause" type="button" aria-label={paused ? playLabel : pauseLabel}
            aria-controls={trackId} onClick={()=>setPaused(!paused)}>{paused ? <Play aria-hidden="true"/> : <Pause aria-hidden="true"/>}</button>
          <button type="button" aria-label="Mục tiếp theo" aria-controls={trackId} onClick={()=>step(false)}><ArrowRight aria-hidden="true"/></button>
        </div>}
      </div>
      <div id={trackId} ref={track} className="career-track" data-auto-rail="" role="region" aria-labelledby={labelId} tabIndex={overflow ? 0 : undefined}>
        {children}
      </div>
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
    <PageMasthead title="Gia nhập đội ngũ Minh Đức" description="Tìm hiểu các vị trí tư vấn, tuyển dụng và kết nối người lao động tại Minh Đức." image={mastheadPhoto?.src} imageAlt={mastheadPhoto?.alt} imageCaption={mastheadPhoto?.caption}>
      <a className="btn career-primary" href="#open-positions">Xem vị trí nội bộ</a>
      <Link className="career-text-link" to="/jobs#job-listings">Tìm việc tại nhà máy</Link>
    </PageMasthead>

    <section className="career-openings"><div className="container" id="open-positions" tabIndex={-1}>{openings}</div></section>

    {(specialist || associate) && <section className="career-block career-roles"><div className="container">
      <h2>{specialist && associate ? 'Hai cách làm nghề tuyển dụng' : 'Tuyển dụng nội bộ'}</h2>
      <div className="career-feature-grid">
        {roleStories.map(({job, photo, sizes, text}) => job && <article key={job.id} className="career-feature">
          {photo && <RevealFrame effect="media" className="career-feature-image">
            <img src={photo.src} sizes={sizes} alt={photo.alt} loading="lazy" decoding="async"/>
          </RevealFrame>}
          <div className="career-feature-copy">
            <span className="career-job-place"><MapPin size={16} aria-hidden="true"/>{job.location}</span>
            <h3><CareerLink to={'/jobs/' + job.slug}>{job.title}<ArrowUpRight size={23} aria-hidden="true"/></CareerLink></h3>
            <p>{text}</p>
          </div>
        </article>)}
      </div>
    </div></section>}

    {workItems.length > 0 && <CareerRail kind="work" title="Công việc hằng ngày" modalOpen={modalOpen}><PositionItems items={workItems}/></CareerRail>}
    {benefitItems.length > 0
      ? <CareerRail kind="benefits" id="position-benefits" title="Quyền lợi theo vị trí" modalOpen={modalOpen}><PositionItems items={benefitItems}/></CareerRail>
      : <div className="container" id="position-benefits"><CareerLink to="#open-positions">Xem vị trí nội bộ</CareerLink></div>}

    <section id="cv-requirements" tabIndex={-1} className="career-block career-process"><div className="container career-process-layout">
      <h2>Cách ứng tuyển nội bộ</h2>
      <ol className="career-process-grid">{steps.map(([title, text], index) => <li key={title}><RevealFrame delay={index as 0|1|2|3}><article className="career-step">
        <span className="career-step-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{text}</p>
      </article></RevealFrame></li>)}</ol>
      <div id="career-contact" tabIndex={-1}><CareerLink to="#open-positions">Xem vị trí nội bộ</CareerLink><Link className="career-text-link" to="/contact#consultation">Trao đổi với Minh Đức</Link></div>
    </div></section>

    <CareerRail kind="questions" title="Câu hỏi về ứng tuyển nội bộ" modalOpen={modalOpen}>
      {questions.map(item => <article className="career-rail-item" key={item.title}><h3>{item.title}</h3><p>{item.text}</p><CareerLink to={item.link}>{item.label}</CareerLink></article>)}
    </CareerRail>

    {media.gallery.length > 0 && <CareerRail kind="gallery" title="Hoạt động của Minh Đức" modalOpen={modalOpen}>
      {gallery.map((photo, index) => <figure key={photo.src} className="career-gallery-item" style={photo.frame}>
        <button type="button" aria-label={translate('Xem ảnh lớn') + ' · ' + translate(photo.caption)} onClick={event => {event.currentTarget.focus({preventScroll: true}); setGalleryIndex(index);}}>
          <img src={photo.src} {...responsiveImage(photo.src, '(max-width: 640px) calc(100vw - 68px), 520px')} alt={photo.alt} loading="eager" decoding="async"/>
        </button>
        <figcaption>{photo.caption}</figcaption>
      </figure>)}
    </CareerRail>}

    {galleryPhoto && galleryIndex !== null && <Modal title="Hoạt động của Minh Đức" onClose={() => setGalleryIndex(null)}>
      <figure className="career-lightbox">
        <img src={galleryPhoto.src} {...responsiveImage(galleryPhoto.src, '(max-width: 767px) 94vw, 900px')} alt={galleryPhoto.alt} className="career-gallery-large" loading="eager" decoding="sync"/>
        <figcaption aria-live="polite" aria-atomic="true"><span>{galleryIndex + 1} / {media.gallery.length}</span> {galleryPhoto.caption}</figcaption>
      </figure>
      <div className="career-gallery-controls">
        <button type="button" aria-label="Ảnh trước" onClick={() => setGalleryIndex(nextPhoto(galleryIndex, -1))}><ArrowLeft size={20}/></button>
        <button type="button" aria-label="Ảnh tiếp theo" onClick={() => setGalleryIndex(nextPhoto(galleryIndex, 1))}><ArrowRight size={20}/></button>
      </div>
    </Modal>}
  </div>;
}
