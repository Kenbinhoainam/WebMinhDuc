import CareersSections from './CareersSections';
import careersMedia from './careers-media.json';
import {RevealFrame} from './motion';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Bookmark, BriefcaseBusiness, CheckCircle2, ChevronLeft, ChevronRight, Clock3, FileUp, MapPin, Phone, Search, SlidersHorizontal, Wallet } from 'lucide-react';
import { PageHero, SectionHeading, ButtonLink, CTASection, DemoNote, Modal } from './shared';
import './jobs.css';
import { useLocale, type Locale } from './i18n';
import { translate } from './i18n-runtime/jsx-runtime';
import {lookup} from './i18n-runtime/catalog';
import {jobs, type Job} from './jobs-data';
import {useSavedJobs} from './saved-jobs';
export {jobs} from './jobs-data';
export type {Job} from './jobs-data';
export {useSavedJobs} from './saved-jobs';

function useJobText() {
  const locale = useLocale();
  return (text: string) => locale === 'vi' ? text : lookup(locale, text, 'jobs') ?? text;
}

const filterOptions: Record<string, { label: string; options: [string, string][] }> = {
  industrialPark: { label: 'Khu công nghiệp', options: [['KCN Yên Phong', 'KCN Yên Phong'], ['KCN Tân Hưng', 'KCN Tân Hưng'], ['KCN Sông Công', 'KCN Sông Công'], ['KCN Đông Mai', 'KCN Đông Mai']] },
  skillLevel: { label: 'Trình độ', options: [['Phổ thông', 'Phổ thông'], ['Tay nghề', 'Tay nghề']] },
  employmentType: { label: 'Hình thức tuyển', options: [['Chính thức', 'Chính thức'], ['Thời vụ', 'Thời vụ']] },
  shift: { label: 'Ca làm việc', options: [['Ngày', 'Ngày'], ['Đêm', 'Đêm']] },
  schedule: { label: 'Lịch ca', options: [['Cố định', 'Cố định'], ['Xoay ca', 'Xoay ca']] },
  status: { label: 'Trạng thái', options: [['active', 'Đang tuyển'], ['closed', 'Đã đóng']] },
};

export function filterJobs(params: URLSearchParams, internal = false, savedOnly = false, savedIds: string[] = [], locale: Locale = 'vi') {
  const query = params.get('q') ?? '';
  return jobs.filter(job => {
    if (savedOnly ? !savedIds.includes(job.id) : internal ? !job.internal : job.internal) return false;
    const location = params.get('location');
    const type = params.get('type');
    if (location && LOCATIONS.includes(location) && job.location !== location) return false;
    if (type && TYPES.includes(type) && job.type !== type) return false;
    if (Object.entries(filterOptions).some(([key, field]) => { const value = params.get(key); return value && field.options.some(option => option[0] === value) && job[key as keyof Job] !== value; })) return false;
    if (!savedOnly && !['active', 'closed'].includes(params.get('status') ?? '') && job.status === 'closed') return false;
    const searchable = [job.title, job.category, job.location, job.industrialPark ?? '', ...job.tags];
    const localized = searchable.map(text => translate(text, locale));
    return !query || normalized([...searchable, ...localized].join(' ')).includes(normalized(query));
  });
}

const HERO_IMAGE = '/mirror/www.hr2b.com/wp-content/uploads/2025/09/Co-hoi-viec-lam-scaled.jpg';
const LOCATIONS = ['Bắc Ninh', 'Bắc Giang', 'Thái Nguyên', 'Quảng Ninh'];
const TYPES = ['Toàn thời gian', 'Thời vụ', 'Cộng tác viên'];
function normalized(value: string) { return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().trim().replace(/\s+/g, ' '); }

function validateApplicationFile(file?: Pick<File, 'name' | 'size' | 'type'> | null, required = false) {
  if (!file || !file.name) return required ? 'Vui lòng chọn CV của bạn.' : '';
  const extension = file.name.split('.').pop()?.toLowerCase();
  const mimeTypes: Record<string, string[]> = {
    pdf: ['application/pdf'],
    doc: ['application/msword', 'application/vnd.ms-word'],
    docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  };
  if (!extension || !mimeTypes[extension]) return 'Vui lòng chọn tệp PDF, DOC hoặc DOCX.';
  if (file.type && file.type !== 'application/octet-stream' && !mimeTypes[extension].includes(file.type.toLowerCase())) return 'Định dạng tệp không khớp với PDF, DOC hoặc DOCX. Vui lòng chọn tệp khác.';
  if (file.size > 5 * 1024 * 1024) return 'Tệp CV vượt quá 5 MB. Vui lòng chọn tệp nhỏ hơn.';
  if (file.size === 0) return 'Tệp CV đang trống. Vui lòng chọn tệp khác.';
  return '';
}

function SaveButton({ job, showLabel = false }: { job: Job; showLabel?: boolean }) {
  const { isSaved, toggleSaved } = useSavedJobs();
  const t = useJobText();
  const saved = isSaved(job.id);
  return <button type="button" className={`job-save ${saved ? 'is-saved' : ''} ${showLabel ? 'has-label' : ''}`} aria-pressed={saved} aria-label={`${t(saved ? 'Bỏ lưu' : 'Lưu')} ${t(job.title)}`} title={saved ? 'Bỏ lưu việc làm' : 'Lưu việc làm'} onClick={() => toggleSaved(job.id)}><Bookmark size={19} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />{showLabel && <span>{saved ? 'Đã lưu việc làm' : 'Lưu việc làm'}</span>}</button>;
}

function JobCard({ job }: { job: Job }) {
  return <article className="job-card">
    <div className="job-card-heading"><h3><Link to={`/jobs/${job.slug}`}>{job.title}</Link></h3><SaveButton job={job} /></div>
    {job.status==='closed'&&<span className="job-category">Đã đóng</span>}
    <div className="job-card-specs"><p><Wallet size={17} aria-hidden="true" /><strong>{job.salary}</strong></p><p><MapPin size={17} aria-hidden="true" />{job.location}<span className="job-spec-divider" aria-hidden="true">·</span>{job.type}</p></div>
    <div className="job-card-footer"><Link to={`/jobs/${job.slug}`}>Xem chi tiết <ArrowRight size={17} aria-hidden="true" /></Link></div>
  </article>;
}

function EmptyJobs({ saved = false, onReset }: { saved?: boolean; onReset?: () => void }) {
  return <div className="jobs-empty"><div className="jobs-empty-icon">{saved ? <Bookmark size={30} aria-hidden="true" /> : <Search size={30} aria-hidden="true" />}</div><h3>{saved ? 'Bạn chưa lưu việc làm nào' : 'Chưa tìm thấy việc làm phù hợp'}</h3><p>{saved ? 'Chạm biểu tượng đánh dấu ở vị trí bạn quan tâm để xem lại tại đây.' : 'Thử từ khóa khác hoặc mở rộng địa điểm và loại công việc.'}</p>{saved ? <ButtonLink to="/jobs">Khám phá việc làm</ButtonLink> : <button className="btn btn-secondary" type="button" onClick={onReset}>Xóa bộ lọc</button>}</div>;
}

function JobBrowser({ internal = false, savedOnly = false }: { internal?: boolean; savedOnly?: boolean }) {
  const [params, setParams] = useSearchParams();
  const t = useJobText();
  const locale = useLocale();
  const { savedIds, count } = useSavedJobs();
  const [page, setPage] = useState(1);
  const listRef = useRef<HTMLDivElement>(null);
  const query = params.get('q') ?? '';
  const locationValue = params.get('location') ?? '';
  const typeValue = params.get('type') ?? '';
  const location = LOCATIONS.includes(locationValue) ? locationValue : '';
  const type = TYPES.includes(typeValue) ? typeValue : '';
  const allJobs = filterJobs(new URLSearchParams(), internal, savedOnly, savedIds, locale);
  const filtered = filterJobs(params, internal, savedOnly, savedIds, locale);
  const pageSize = 6;
  const totalPages = Math.ceil(filtered.length / pageSize);
  const currentPage = Math.min(page, Math.max(totalPages, 1));
  useEffect(() => setPage(1), [params.toString()]);
  useEffect(() => setPage(previous => Math.min(previous, Math.max(totalPages, 1))), [totalPages]);
  const updateFilter = (key: string, value: string) => { const next = new URLSearchParams(params); if (value) next.set(key, value); else next.delete(key); setParams(next, { replace: true }); };
  const reset = () => { setParams({}, { replace: true }); setPage(1); };
  const scrollToResults = () => listRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  const changePage = (next: number) => { setPage(next); scrollToResults(); };
  return <div className={`jobs-browser ${internal ? "is-internal" : ""}`}>
    <RevealFrame effect="zoom"><div className="jobs-heading-row"><h2>{savedOnly ? 'Danh sách đã lưu' : internal ? 'Cơ hội trong đội ngũ Minh Đức' : 'Cơ hội việc làm dành cho bạn'}</h2>{!savedOnly && <Link className="jobs-saved-link" to="/saved-jobs"><Bookmark size={18} aria-hidden="true" />Việc đã lưu <span>{count}</span></Link>}</div></RevealFrame>
    <RevealFrame><form className="jobs-filters" role="search" aria-label="Tìm việc làm" onSubmit={event => { event.preventDefault(); setPage(1); scrollToResults(); }}>
      <div className="jobs-filter-field jobs-keyword"><label htmlFor="jobs-query">Từ khóa</label><div className="jobs-input-icon"><Search size={18} aria-hidden="true" /><input id="jobs-query" type="search" value={query} placeholder="Tên công việc, kỹ năng…" onChange={event => updateFilter('q', event.target.value)} /></div></div>
      <div className="jobs-filter-field"><label htmlFor="jobs-location">Địa điểm</label><select id="jobs-location" value={location} onChange={event => updateFilter('location', event.target.value)}><option value="">Tất cả địa điểm</option>{LOCATIONS.map(item => <option key={item} value={item}>{item}</option>)}</select></div>
      <div className="jobs-filter-field"><label htmlFor="jobs-type">Loại công việc</label><select id="jobs-type" value={type} onChange={event => updateFilter('type', event.target.value)}><option value="">Tất cả loại việc</option>{TYPES.map(item => <option key={item} value={item}>{item}</option>)}</select></div>
      {Object.entries(filterOptions).map(([key, field]) => <div className="jobs-filter-field" key={key}><label htmlFor={`jobs-${key}`}>{field.label}</label><select id={`jobs-${key}`} value={field.options.some(option => option[0] === params.get(key)) ? params.get(key) ?? '' : ''} onChange={event => updateFilter(key, event.target.value)}><option value="">Tất cả</option>{field.options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>)}
      <button className="btn jobs-search-button" type="submit"><Search size={18} aria-hidden="true" />Tìm việc</button>
    </form></RevealFrame>
    <div className="jobs-result-bar" ref={listRef}><p role="status" aria-live="polite"><strong>{filtered.length}</strong> {savedOnly ? 'việc làm đã lưu' : 'việc làm phù hợp'}{query && <> {t('cho')} “{query}”</>}</p>{(query || location || type || Object.keys(filterOptions).some(key => params.get(key))) && <button type="button" onClick={reset}><SlidersHorizontal size={15} aria-hidden="true" />Xóa bộ lọc</button>}</div>
    {filtered.length > 0 ? <RevealFrame delayMs={400}><div className="jobs-grid">{filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize).map(job => <JobCard key={job.id} job={job} />)}</div></RevealFrame> : <EmptyJobs saved={savedOnly && allJobs.length === 0} onReset={reset} />}
    {totalPages > 1 && <nav className="jobs-pagination" aria-label="Phân trang việc làm"><button type="button" disabled={currentPage === 1} aria-label="Trang trước" onClick={() => changePage(currentPage - 1)}><ChevronLeft size={18} /></button>{Array.from({ length: totalPages }, (_, index) => index + 1).map(number => <button type="button" key={number} aria-label={`${t('Trang')} ${number}`} aria-current={currentPage === number ? 'page' : undefined} onClick={() => changePage(number)}>{number}</button>)}<button type="button" disabled={currentPage === totalPages} aria-label="Trang sau" onClick={() => changePage(currentPage + 1)}><ChevronRight size={18} /></button></nav>}
    <p className="jobs-data-note">Các vị trí và mức thu nhập trên đây là dữ liệu minh họa cho prototype, chưa phải thông báo tuyển dụng. Thu nhập thực tế cần được xác nhận khi tư vấn.</p>
  </div>;
}

export function JobsPage() {
  return <><PageHero title="Cơ hội việc làm" eyebrow="DÀNH CHO NGƯỜI LAO ĐỘNG" description="Tìm công việc phù hợp. Bắt đầu hành trình mới." image={HERO_IMAGE} /><section className="section jobs-section"><div className="container"><RevealFrame><div className="jobs-intro"><div><span className="eyebrow">CÙNG MINH ĐỨC</span><h2>Một công việc phù hợp. Một khởi đầu vững vàng.</h2><p>Khám phá cơ hội theo địa điểm và công việc bạn quan tâm. Minh Đức đồng hành để bạn hiểu rõ vị trí trước khi quyết định.</p></div></div></RevealFrame><div id="job-listings"><JobBrowser /></div><p className="jobs-education-link">Muốn nâng cao kỹ năng? <Link to="/education">Khám phá đào tạo</Link></p></div></section></>;
}

export function SavedJobsPage() {
  return <><PageHero title="Việc làm đã lưu" eyebrow="CƠ HỘI CỦA BẠN" description="Giữ lại những vị trí bạn quan tâm, để cân nhắc khi sẵn sàng." image={HERO_IMAGE} /><section className="section jobs-section"><div className="container"><Link className="jobs-back" to="/jobs"><ArrowLeft size={18} aria-hidden="true" />Tất cả việc làm</Link><JobBrowser savedOnly /><p className="jobs-storage-note">Danh sách được lưu trên trình duyệt này. Bạn có thể bỏ lưu bất kỳ lúc nào.</p></div></section></>;
}

export function CareersPage() {
  return <><PageHero title="Gia nhập Minh Đức" eyebrow="TUYỂN DỤNG NỘI BỘ" description="Kết nối con người, cùng nhau tạo dựng giá trị." image={careersMedia.banner}/><CareersSections openings={<JobBrowser internal/>}/></>;
}

type ApplicationErrors = Partial<Record<'name' | 'phone' | 'location' | 'cv' | 'consent', string>>;
function ApplicationDialog({ job, onClose }: { job: Job; onClose: () => void }) {
  const [errors, setErrors] = useState<ApplicationErrors>({});
  const [success, setSuccess] = useState(false);
  const [fileName, setFileName] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { if (success) successRef.current?.focus(); }, [success]);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (job.status === 'closed') return;
    const data = new FormData(event.currentTarget);
    const next: ApplicationErrors = {};
    if (String(data.get('name') ?? '').trim().length < 2) next.name = 'Vui lòng nhập họ và tên, tối thiểu 2 ký tự.';
    const phone = String(data.get('phone') ?? '').replace(/[\s().-]/g, '');
    if (!/^(?:0|\+?84)[35789]\d{8}$/.test(phone)) next.phone = 'Nhập số di động Việt Nam hợp lệ, ví dụ 0912345678.';
    if (!LOCATIONS.includes(String(data.get('location') ?? ''))) next.location = 'Vui lòng chọn địa điểm mong muốn.';
    const fileError = validateApplicationFile(data.get('cv') as File | null, !!job.internal);
    if (fileError) next.cv = fileError;
    if (!data.get('consent')) next.consent = 'Bạn cần đồng ý trước khi trải nghiệm gửi hồ sơ.';
    setErrors(next);
    if (Object.keys(next).length) {
      const first = Object.keys(next)[0];
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus());
      return;
    }
    event.currentTarget.reset();
    setFileName('');
    setSuccess(true);
  };
  const error = (key: keyof ApplicationErrors) => errors[key] ? <span className="application-error" id={`apply-${key}-error`} role="alert">{errors[key]}</span> : null;
  return <Modal title={success ? 'Hoàn tất trải nghiệm ứng tuyển' : 'Ứng tuyển vị trí'} onClose={onClose}>{success ? <div className="application-success"><CheckCircle2 size={56} aria-hidden="true" /><h3 ref={successRef} tabIndex={-1}>Bạn đã hoàn tất bước ứng tuyển mô phỏng</h3><p>Hồ sơ <strong>chưa được gửi tới nhà tuyển dụng</strong>. Thông tin cá nhân và tệp CV không được lưu hoặc tải lên.</p><p>{job.internal ? 'F04 · Ứng tuyển nội bộ' : 'F03 · Ứng tuyển việc làm'} · Mã vị trí <strong>{job.id}</strong></p><p><Link to={`/admin-demo?type=${job.internal ? 'F04' : 'F03'}`} onClick={onClose}>Xem ví dụ quản trị minh họa</Link></p><p>Để được tư vấn việc làm thực tế, hãy liên hệ Minh Đức qua hotline.</p><a className="btn" href="tel:0364562868"><Phone size={18} aria-hidden="true" />0364 562 868</a><button className="application-close-link" type="button" onClick={onClose}>Đóng cửa sổ</button></div> : <form className="application-form" ref={formRef} onSubmit={submit} noValidate><div className="application-job"><strong>{job.internal ? 'F04 · Ứng tuyển nội bộ' : 'F03 · Ứng tuyển việc làm'} · {job.id}</strong><strong>{job.title}</strong><span><MapPin size={15} aria-hidden="true" /><span>{job.location}</span> · <span>{job.type}</span></span></div><p className="application-note">Bạn đang trải nghiệm form mô phỏng. Không có hồ sơ nào được gửi; có thể dùng thông tin mẫu để thử.</p><div className="application-field"><label htmlFor="apply-name">Họ và tên <span aria-hidden="true">*</span></label><input id="apply-name" name="name" placeholder="Nguyễn Văn An" autoComplete="name" required maxLength={100} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'apply-name-error' : undefined} />{error('name')}</div><div className="application-fields-row"><div className="application-field"><label htmlFor="apply-phone">Số điện thoại <span aria-hidden="true">*</span></label><input id="apply-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="0912 345 678" required maxLength={20} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'apply-phone-error' : undefined} />{error('phone')}</div><div className="application-field"><label htmlFor="apply-location">Địa điểm mong muốn <span aria-hidden="true">*</span></label><select id="apply-location" name="location" required defaultValue="" aria-invalid={!!errors.location} aria-describedby={errors.location ? 'apply-location-error' : undefined}><option value="">Chọn địa điểm</option>{LOCATIONS.map(item => <option key={item} value={item}>{item}</option>)}</select>{error('location')}</div></div><div className="application-field"><label htmlFor="apply-cv">CV của bạn {job.internal ? <span aria-hidden="true">*</span> : <span className="optional">(không bắt buộc)</span>}</label><div className={`application-upload ${errors.cv ? 'has-error' : ''}`}><FileUp size={25} aria-hidden="true" /><input id="apply-cv" name="cv" type="file" required={!!job.internal} accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" aria-invalid={!!errors.cv} aria-describedby={`apply-cv-help${errors.cv ? ' apply-cv-error' : ''}`} onChange={event => { const file = event.target.files?.[0]; setFileName(file?.name ?? ''); setErrors(previous => ({ ...previous, cv: validateApplicationFile(file, !!job.internal) || undefined })); }} /><span>{fileName || 'Chọn tệp từ thiết bị của bạn'}</span></div><small id="apply-cv-help">PDF, DOC hoặc DOCX · Tối đa 5 MB · Tệp không được tải lên</small>{error('cv')}</div><div className="application-consent"><label><input name="consent" type="checkbox" required aria-invalid={!!errors.consent} aria-describedby={errors.consent ? 'apply-consent-error' : undefined} /><span>Tôi đồng ý trải nghiệm bước ứng tuyển mô phỏng và đã đọc <Link to="/privacy-policy" onClick={onClose}>chính sách bảo mật</Link>. <span aria-hidden="true">*</span></span></label>{error('consent')}</div><button className="btn application-submit" type="submit">Gửi hồ sơ mô phỏng <ArrowRight size={18} aria-hidden="true" /></button><p className="application-required">Các trường có dấu * là bắt buộc.</p></form>}</Modal>;
}

export function JobDetailPage() {
  const { slug } = useParams();
  const job = jobs.find(item => item.slug === slug);
  const [applying, setApplying] = useState(false);
  useEffect(() => { setApplying(false); }, [slug]);
  if (!job) return <><PageHero title="Không tìm thấy việc làm" eyebrow="404" description="Vị trí này không có trong danh sách. Hãy khám phá những cơ hội khác." /><section className="section"><div className="container jobs-not-found"><ButtonLink to="/jobs">Xem tất cả việc làm</ButtonLink></div></section></>;
  const related = jobs.filter(item => item.id !== job.id && (!!item.internal === !!job.internal)).slice(0, 3);
  return <><section className="section jobs-detail-section"><div className="container"><div className="job-detail-layout"><div className="job-detail-body"><div className="job-detail-intro"><Link className="jobs-back" to={job.internal ? '/careers' : '/jobs'}><ArrowLeft size={18} aria-hidden="true" />{job.internal ? 'Tuyển dụng nội bộ' : 'Tất cả việc làm'}</Link><span className="eyebrow">MÃ VỊ TRÍ {job.id}</span><h1>{job.title}</h1><p>{job.intro}</p><div className="job-tags">{job.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div><section className="job-description-block"><h2>Mô tả công việc</h2><ul>{job.tasks.map(item => <li key={item}>{item}</li>)}</ul></section><section className="job-description-block"><h2>Điều gì giúp bạn phù hợp?</h2><ul>{job.requirements.map(item => <li key={item}>{item}</li>)}</ul></section><section className="job-description-block"><h2>Quyền lợi & sự đồng hành</h2><ul>{job.benefits.map(item => <li key={item}>{item}</li>)}</ul></section><section className="job-description-block"><h2>Ba bước để bắt đầu</h2><ol className="job-steps"><li><span>01</span><div><strong>Chia sẻ mong muốn</strong><p>Chọn vị trí, điền thông tin cơ bản và địa điểm bạn quan tâm.</p></div></li><li><span>02</span><div><strong>Trao đổi với tư vấn viên</strong><p>Ở quy trình thực tế, đội tư vấn sẽ xác nhận yêu cầu và thông tin công việc.</p></div></li><li><span>03</span><div><strong>Sẵn sàng cho khởi đầu mới</strong><p>Hiểu rõ điều kiện làm việc trước khi quyết định nhận việc.</p></div></li></ol></section><DemoNote /></div><aside className="job-summary"><h2>Thông tin vị trí</h2><dl><div><dt><Wallet size={18} aria-hidden="true" />Thu nhập tham khảo</dt><dd className="job-summary-salary">{job.salary}</dd></div><div><dt><MapPin size={18} aria-hidden="true" />Địa điểm</dt><dd>{job.location}</dd></div><div><dt><Clock3 size={18} aria-hidden="true" />Hình thức</dt><dd>{job.type}</dd></div><div><dt><BriefcaseBusiness size={18} aria-hidden="true" />Nhóm công việc</dt><dd>{job.category}</dd></div><div><dt>Trạng thái</dt><dd>{job.status === 'closed' ? 'Đã đóng' : 'Đang tuyển'}</dd></div>{job.industrialPark && <div><dt>Khu công nghiệp</dt><dd>{job.industrialPark}</dd></div>}<div><dt>Ca làm việc</dt><dd>{job.shift} · {job.schedule}</dd></div></dl><p className="job-summary-demo">Vị trí và thu nhập minh họa, chưa phải thông báo tuyển dụng.</p>{job.status === 'closed' ? <p className="job-closed">Vị trí đã đóng, không nhận ứng tuyển.</p> : <button className="btn job-apply-button" type="button" onClick={() => { if (job.status !== 'closed') setApplying(true); }}>Ứng tuyển ngay <ArrowRight size={18} aria-hidden="true" /></button>}<SaveButton job={job} showLabel /><div className="job-help"><p>Cần thêm thông tin?</p><a href="tel:0364562868"><Phone size={16} aria-hidden="true" />0364 562 868</a><span>Đội ngũ Minh Đức sẵn sàng hỗ trợ</span></div></aside></div>{related.length > 0 && <section className="jobs-related"><SectionHeading eyebrow="KHÁM PHÁ THÊM" title="Có thể bạn quan tâm" /><div className="jobs-grid">{related.map(item => <JobCard key={item.id} job={item} />)}</div></section>}</div></section>{applying && job.status !== 'closed' && <ApplicationDialog job={job} onClose={() => setApplying(false)} />}</>;
}
