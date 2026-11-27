import {useEffect, useRef, useState, type FormEvent} from 'react';
import {Link, useLocation, useNavigate, useNavigationType, useParams, useSearchParams} from 'react-router-dom';
import {ArrowUpRight, Bookmark, CheckCircle2, ChevronLeft, ChevronRight, FileUp, MapPin, Phone, Search, SlidersHorizontal, X} from 'lucide-react';
import {company} from './company';
import {subnavigation} from './navigation';
import CareersSections from './CareersSections';
import {PageMasthead} from './PageMasthead';
import {Modal} from './shared';
import {RevealFrame} from './motion';
import {useLocale, type Locale} from './i18n';
import {translate} from './i18n-runtime/catalog';
import {jobs, type Job} from './jobs-data';
import {useSavedJobs} from './saved-jobs';
import {createDemoSubmission} from './demo-submissions';
import {FILE_ACCEPT,validateDemoFiles,validDemoPhone,validOptionalEmail} from './sharedformvalidation';
import './jobs.css';
export {jobs} from './jobs-data';
export type {Job} from './jobs-data';
export {useSavedJobs} from './saved-jobs';

const PAGE_SIZE = 6;
const EVENT_IMAGE = '/WebMinhDuc/assets/minhduc-v16/recruitment-event.webp';
const EVENT_ALT = 'Ảnh tập thể trên sân khấu giữa hai bảng thông tin tuyển dụng.';
const WORKERS = jobs.filter(job => !job.internal);
const TEAM = jobs.filter(job => job.internal);
type FilterKey = 'location' | 'type' | 'industrialPark' | 'skillLevel' | 'employmentType' | 'shift' | 'schedule' | 'status';
const FIELD_LABELS: Record<FilterKey,string> = {
  location:'Địa điểm', type:'Loại công việc', industrialPark:'Khu công nghiệp', skillLevel:'Trình độ',
  employmentType:'Hình thức tuyển', shift:'Ca làm việc', schedule:'Lịch ca', status:'Trạng thái',
};
const FACTORY_FIELDS: FilterKey[] = ['type','industrialPark','skillLevel','employmentType','shift','schedule','status'];
const TEAM_FIELDS: FilterKey[] = ['type','status'];
const statusLabel = (status: string) => status === 'closed' ? 'Đã đóng' : 'Đang tuyển';
function choices(field: FilterKey, audience: Job[]): string[] {
  if (field === 'status') return ['active','closed'];
  return [...new Set(audience.map(job => job[field]).filter((value): value is string => !!value))];
}
function audienceFor(internal: boolean, savedOnly: boolean) { return savedOnly ? jobs : internal ? TEAM : WORKERS; }
function normalized(value: string) { return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').toLowerCase().trim().replace(/\s+/g, ' '); }

export function filterJobs(params: URLSearchParams, internal = false, savedOnly = false, savedIds: string[] = [], locale: Locale = 'vi') {
  const audience = audienceFor(internal,savedOnly);
  const fields: FilterKey[] = ['location', ...(internal ? TEAM_FIELDS : FACTORY_FIELDS)];
  const conditions = fields.map(field => {
    const value = params.get(field) || '';
    if (choices(field,audience).includes(value)) return [field,value] as const;
    return [field,field === 'status' && !savedOnly ? 'active' : ''] as const;
  });
  const query = normalized(params.get('q') || '');
  return audience.filter(job => {
    if ((savedOnly && !savedIds.includes(job.id)) || conditions.some(([field,value]) => value && value !== job[field])) return false;
    if (!query) return true;
    const terms = [job.id, job.title, job.category, job.location, job.industrialPark || '', ...job.tags];
    return normalized([...terms,...terms.map(term => translate(term,locale))].join(' ')).includes(query);
  });
}

/** Only an ordinary in-tab click can create a browser history entry to return to. */
function plainClick(event: React.MouseEvent) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey;
}
type ListOrigin = {pathname: string; search: string; hash: string; steps: number};
function readOrigin(state: unknown): ListOrigin | undefined {
  const origin = (state as {jobOrigin?: ListOrigin} | null)?.jobOrigin;
  if (!origin || !['/jobs','/careers','/saved-jobs'].includes(origin.pathname) || typeof origin.search !== 'string' || typeof origin.hash !== 'string' || !Number.isSafeInteger(origin.steps) || origin.steps < 1) return;
  return origin;
}
// Assigned when following a list link, used only for focus after a history POP.
let lastOpened: {entryKey: string; jobId: string} | undefined;

function SaveButton({job, labelled, afterRemove}: {job: Job; labelled?: boolean; afterRemove?: () => void}) {
  const {isSaved,toggleSaved} = useSavedJobs();
  const locale = useLocale();
  const saved = isSaved(job.id);
  const action = saved ? 'Bỏ lưu' : 'Lưu';
  return <button type="button" data-job-save={job.id} className={`job-save${saved ? ' is-saved' : ''}${labelled ? ' has-label' : ''}`} aria-pressed={saved}
    aria-label={`${translate(action,locale)} ${translate(job.title,locale)}`} title={saved ? 'Bỏ lưu việc làm' : 'Lưu việc làm'}
    onClick={() => {if (saved) afterRemove?.(); toggleSaved(job.id);}}>
    <Bookmark size={20} fill={saved ? 'currentColor' : 'none'} aria-hidden="true"/>{labelled && <span>{saved ? 'Đã lưu việc làm' : 'Lưu việc làm'}</span>}
  </button>;
}
function JobCard({job, origin, remember, afterRemove}: {job:Job; origin?:ListOrigin; remember?:()=>void; afterRemove?:()=>void}) {
  return <article className="job-card">
    <div className="job-card-heading"><div className="job-card-meta"><span>{job.id}</span><span className={job.status === 'closed' ? 'job-status closed' : 'job-status'}>{statusLabel(job.status || 'active')}</span>{job.internal && <span>Tuyển dụng nội bộ</span>}</div>
      <h3><Link to={`/jobs/${job.slug}`} state={origin ? {jobOrigin:origin} : undefined} data-job-link={job.id} onClick={event => {if (plainClick(event)) remember?.();}}><span>{job.title}</span><ArrowUpRight size={17} aria-hidden="true"/></Link></h3>
      <p className="job-locality"><MapPin size={16} aria-hidden="true"/>{job.industrialPark && <>{job.industrialPark} · </>}{job.location}</p>
    </div>
    <div className="job-row-pay"><span>Thu nhập tham khảo</span><strong>{job.salary}</strong></div>
    <div className="job-row-terms"><span>{job.type}</span>{!job.internal && (job.shift || job.schedule) && <span>{job.shift}{job.shift && job.schedule && ' · '}{job.schedule}</span>}</div>
    <SaveButton job={job} afterRemove={afterRemove}/>
  </article>;
}
function EmptyJobs({saved,teamClosed,onReset,onClosed}: {saved?: boolean;teamClosed?: boolean;onReset:()=>void;onClosed:()=>void}) {
  return <div className="jobs-empty">
    {saved ? <Bookmark aria-hidden="true"/> : <Search aria-hidden="true"/>}
    <h3>{saved ? 'Bạn chưa lưu việc làm nào' : teamClosed ? 'Hiện chưa có vị trí nội bộ đang tuyển' : 'Chưa tìm thấy việc làm phù hợp'}</h3>
    <p>{saved ? 'Chạm biểu tượng đánh dấu ở vị trí bạn quan tâm để xem lại tại đây.' : 'Thử từ khóa khác hoặc mở rộng địa điểm và loại công việc.'}</p>
    {saved ? <Link className="btn" to="/jobs#job-listings">Khám phá việc làm</Link> : <button className="jobs-quiet-button" type="button" onClick={teamClosed ? onClosed : onReset}>{teamClosed ? 'Xem vị trí đã đóng' : 'Xóa bộ lọc'}</button>}
  </div>;
}

function SavedJobsLink() {
  const {count} = useSavedJobs();
  return <Link className="jobs-saved-link" to="/saved-jobs"><Bookmark size={18} aria-hidden="true"/>Việc đã lưu <span>{count}</span></Link>;
}

function JobBrowser({internal = false, savedOnly = false}: {internal?:boolean; savedOnly?:boolean}) {
  const [params,setParams] = useSearchParams();
  const location = useLocation();
  const navigationType = useNavigationType();
  const locale = useLocale();
  const {savedIds,count,isTemporary} = useSavedJobs();
  const [clientReady,setClientReady] = useState(false);
  const [advanced,setAdvanced] = useState(false);
  const browserRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLParagraphElement>(null);
  const nextFocus = useRef<string | null>(null);
  const restoredEntry = useRef<string | null>(null);
  const fields = internal ? TEAM_FIELDS : FACTORY_FIELDS;
  const audience = audienceFor(internal,savedOnly);
  const filtered = filterJobs(params,internal,savedOnly,savedIds,locale);
  const totalPages = Math.ceil(filtered.length/PAGE_SIZE);
  const requestedPage = Number(params.get('page'));
  const page = Math.min(Math.max(totalPages,1), Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1);
  const start = (page-1)*PAGE_SIZE;
  const query = params.get('q') || '';
  const isEmptySaved = savedOnly && count === 0;
  const origin = {pathname:location.pathname, search:location.search, hash:location.hash, steps:1};
  const activeFields = (['location',...fields] as FilterKey[]).filter(key => {
    const value = params.get(key) || '';
    return choices(key,audience).includes(value) && (savedOnly || key !== 'status' || value !== 'active');
  });
  const activeCount = activeFields.filter(key => key !== 'location').length;
  useEffect(() => {setClientReady(true);},[]);
  useEffect(() => {
    if (nextFocus.current === null) return;
    const next = browserRef.current?.querySelector<HTMLElement>(`[data-job-save="${nextFocus.current}"]`) || browserRef.current?.querySelector<HTMLElement>('.jobs-empty a, .jobs-empty button') || resultsRef.current;
    next?.focus();
    nextFocus.current = null;
  }, [savedIds]);
  useEffect(() => {
    if (!clientReady || navigationType !== 'POP' || lastOpened?.entryKey !== location.key || restoredEntry.current === location.key) return;
    const id = lastOpened.jobId;
    const frame = requestAnimationFrame(() => {
      const list = browserRef.current;
      const original = list?.querySelector<HTMLElement>(`[data-job-link="${id}"]`);
      const target = original || list?.querySelector<HTMLElement>('[data-job-link], .jobs-empty a, .jobs-empty button') || resultsRef.current;
      if (target) {
        target.focus({preventScroll:!!original});
        restoredEntry.current = location.key;
      }
    });
    return () => cancelAnimationFrame(frame);
  },[clientReady,location.key,navigationType]);

  function updateFilter(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value && !(key === 'status' && !savedOnly && value === 'active')) next.set(key,value);
    else next.delete(key);
    next.delete('page');
    setParams(next,{replace:true,preventScrollReset:true});
  }
  function reset() {
    setParams({}, {replace:true,preventScrollReset:true});
    document.getElementById('jobs-query')?.focus({preventScroll:true});
  }
  function showResults() {
    resultsRef.current?.focus({preventScroll:true});
    resultsRef.current?.scrollIntoView({block:'start',behavior:'instant'});
  }
  function goToPage(number: number) {
    const next = new URLSearchParams(params);
    if (number === 1) next.delete('page'); else next.set('page',String(number));
    setParams(next,{preventScrollReset:true});
    showResults();
  }
  function filterSelect(key: FilterKey) {
    const available = choices(key,audience);
    const requested = params.get(key) || '';
    const value = available.includes(requested) ? requested : (key === 'status' && !savedOnly ? 'active' : '');
    return <div className="jobs-filter-field" key={key}>
      <label htmlFor={`jobs-${key}`}>{FIELD_LABELS[key]}</label>
      <select id={`jobs-${key}`} value={value} onChange={event => updateFilter(key,event.currentTarget.value)}>
        {(key !== 'status' || savedOnly) && <option value="">{key === 'status' ? 'Mọi trạng thái' : key === 'location' ? 'Tất cả địa điểm' : 'Tất cả'}</option>}
        {available.map(option => <option key={option} value={option}>{key === 'status' ? statusLabel(option) : option}</option>)}
      </select>
    </div>;
  }
  if (savedOnly && !clientReady) return <p className="jobs-storage-note" role="status">Đang đọc danh sách đã lưu…</p>;
  return <div className={`jobs-browser${internal ? ' is-internal' : ''}`} ref={browserRef}>
    {(internal || savedOnly) && <div className="jobs-heading-row">
      <h2>{savedOnly ? 'Danh sách đã lưu' : 'Cơ hội trong đội ngũ Minh Đức'}</h2>
      {internal && <SavedJobsLink/>}
    </div>}
    {savedOnly && <p className="jobs-storage-note">{isTemporary ? 'Trình duyệt chỉ cho lưu tạm. Danh sách sẽ mất khi tải lại trang.' : 'Danh sách được lưu trên trình duyệt này. Bạn có thể bỏ lưu bất kỳ lúc nào.'}</p>}
    {!isEmptySaved && <form className="jobs-filters" role="search" aria-label="Tìm việc làm" onSubmit={event => {event.preventDefault(); showResults();}}>
      <div className="jobs-filter-main"><div className="jobs-filter-field jobs-keyword"><label htmlFor="jobs-query">Từ khóa</label><div className="jobs-search-input"><Search size={18} aria-hidden="true"/><input id="jobs-query" type="search" placeholder="Tên công việc hoặc kỹ năng" value={query} onChange={event => updateFilter('q',event.currentTarget.value)}/></div></div>
        {filterSelect('location')}
        <button type="button" className="jobs-quiet-button" aria-expanded={advanced} aria-controls="jobs-more-filters" onClick={() => setAdvanced(!advanced)}><SlidersHorizontal size={17} aria-hidden="true"/>Bộ lọc khác {activeCount > 0 && <span>({activeCount})</span>}</button>
        <button className="btn jobs-search-button" type="submit">Xem kết quả</button>
      </div>
      <div id="jobs-more-filters" className="jobs-filter-more" hidden={!advanced}>{fields.map(filterSelect)}</div>
      {(query || activeFields.length > 0) && <div className="jobs-filter-selection">
        {[...(query ? ['q'] as const : []), ...activeFields].map(key => {
          const raw = params.get(key) || '';
          const value = key === 'status' ? statusLabel(raw) : raw;
          const label = String(translate(key === 'q' ? 'Từ khóa' : FIELD_LABELS[key],locale));
          const display = key === 'q' ? value : String(translate(value,locale));
          return <button type="button" key={key} className="jobs-filter-chip" aria-label={`${translate('Gỡ bộ lọc',locale)} ${label}: ${display}`} onClick={() => {updateFilter(key,''); document.getElementById('jobs-query')?.focus({preventScroll:true});}}>{label} · {display}<X size={14} aria-hidden="true"/></button>;
        })}
        <button type="button" className="jobs-reset" onClick={reset}>Xóa bộ lọc</button>
      </div>}
    </form>}
    <div className="jobs-result-bar">
      {!internal && !savedOnly && <h2>Cơ hội việc làm dành cho bạn</h2>}
      <p tabIndex={-1} ref={resultsRef} role="status" aria-live="polite"><strong>{filtered.length}</strong> {savedOnly ? 'việc làm đã lưu' : 'việc làm phù hợp'}{query && <> {String(translate('cho',locale))} “{query}”</>}</p>
    </div>
    {filtered.length ? <div className="jobs-grid">{filtered.slice(start,start+PAGE_SIZE).map((job,index) => <JobCard key={job.id} job={job} origin={origin} remember={() => {lastOpened = {entryKey:location.key, jobId:job.id};}} afterRemove={savedOnly ? () => {nextFocus.current = filtered[start+index+1]?.id || filtered[start+index-1]?.id || '';} : undefined}/> )}</div>
      : <EmptyJobs saved={isEmptySaved} teamClosed={internal && !TEAM.some(job => job.status === 'active') && !query && activeFields.length === 0} onReset={reset} onClosed={() => updateFilter('status','closed')}/>}
    {totalPages > 1 && <nav className="jobs-pagination" aria-label="Phân trang việc làm"><button type="button" disabled={page === 1} aria-label="Trang trước" onClick={() => goToPage(page-1)}><ChevronLeft size={18}/></button>{Array.from({length:totalPages},(_,i)=>i+1).map(number => <button type="button" key={number} aria-label={`${translate('Trang',locale)} ${number}`} aria-current={number === page ? 'page' : undefined} onClick={() => goToPage(number)}>{number}</button>)}<button type="button" aria-label="Trang sau" disabled={page === totalPages} onClick={() => goToPage(page+1)}><ChevronRight size={18}/></button></nav>}
    {!isEmptySaved && <p className="jobs-data-note">Vị trí và thu nhập minh họa, chưa phải thông báo tuyển dụng.</p>}
  </div>;
}

export function JobsPage() {
  const [photoFailed, setPhotoFailed] = useState(false);
  return <div className="jobs-directory">
    <PageMasthead title="Tìm việc làm" description="Chọn khu công nghiệp, ca làm và mức tay nghề phù hợp."><SavedJobsLink/></PageMasthead>
    <nav className="container jobs-audience-links" aria-label="Việc làm">
      {subnavigation['/jobs'].map(([to,label]) => <Link key={to} to={to}>{label}<ArrowUpRight size={16} aria-hidden="true"/></Link>)}
    </nav>
    <section className="jobs-section"><div className="container"><div id="job-listings" tabIndex={-1}><JobBrowser/></div><p className="jobs-education-link">Muốn nâng cao kỹ năng? <Link to="/education">Khám phá đào tạo</Link></p></div></section>
    {!photoFailed && <figure className="jobs-event-photo">
      <img src={EVENT_IMAGE} alt={EVENT_ALT} sizes="(max-width: 520px) calc(100vw - 40px), (max-width: 767px) 480px, (max-width: 1072px) calc(40.5vw - 26px), 408px" loading="lazy" onError={() => setPhotoFailed(true)}/>
      <figcaption>Gặp gỡ tại hội trường</figcaption>
    </figure>}
  </div>;
}
export function SavedJobsPage() {
  return <div className="jobs-saved-directory"><PageMasthead title="Việc làm đã lưu"><Link className="jobs-mast-link" to="/jobs#job-listings">Tất cả việc làm</Link></PageMasthead><section className="jobs-section"><div className="container"><JobBrowser savedOnly/></div></section></div>;
}
export function CareersPage() {return <CareersSections openings={<JobBrowser internal/>}/>;}

type ApplicationErrors = Partial<Record<'name'|'phone'|'email'|'cv',string>>;
function ApplicationDialog({job,onClose}: {job:Job; onClose:()=>void}) {
  const [errors,setErrors] = useState<ApplicationErrors>({});
  const [receipt,setReceipt] = useState('');
  const [fileNames,setFileNames] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const submitted = useRef(false);
  const location = useLocation();
  const locale = useLocale();
  const formType = job.internal ? 'F04' : 'F03';
  useEffect(() => {if (receipt) successRef.current?.focus();},[receipt]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitted.current || job.status === 'closed') return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') || '');
    const phone = String(data.get('phone') || '');
    const email = String(data.get('email') || '');
    const next: ApplicationErrors = {};
    if (!name.trim()) next.name = 'Vui lòng nhập họ tên.';
    if (!validDemoPhone(phone)) next.phone = 'Vui lòng nhập số điện thoại Việt Nam hợp lệ.';
    if (job.internal) {
      if (!validOptionalEmail(email)) next.email = 'Email chưa đúng định dạng.';
      const input = form.elements.namedItem('cv') as HTMLInputElement;
      const fileError = validateDemoFiles(Array.from(input.files || []));
      if (fileError) next.cv = fileError;
    }
    setErrors(next);
    const firstInvalid = Object.keys(next)[0];
    if (firstInvalid) {
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus());
      return;
    }
    submitted.current = true;
    const record = createDemoSubmission({
      type:formType,name,phone,source:location.pathname,linkId:job.id,detail:job.title,
      fields:job.internal ? {position:job.title,email} : undefined,
    });
    setReceipt(record.id);
  }
  function errorFor(field: keyof ApplicationErrors) {
    return errors[field] && <span className="application-error" id={`apply-${field}-error`} role="alert">{errors[field]}</span>;
  }
  function clearCorrectedError(field: 'name' | 'phone' | 'email', valid: boolean) {
    if (errors[field] && valid) setErrors(previous => ({...previous, [field]: undefined}));
  }
  return <Modal title={receipt ? 'Hoàn tất trải nghiệm ứng tuyển' : 'Ứng tuyển vị trí'} onClose={onClose}>
    {receipt ? <div className="application-success">
      <CheckCircle2 size={48} aria-hidden="true"/>
      <h3 ref={successRef} tabIndex={-1}>Bạn đã hoàn tất bước ứng tuyển mô phỏng</h3>
      <p>Mã mô phỏng: <strong>{receipt}</strong> · {job.id}</p>
      <p>Dữ liệu mẫu chỉ giữ trong bộ nhớ phiên trang; không gửi ra ngoài. Không dùng thông tin thật.</p>
      <Link to={`/admin-demo?type=${formType}&id=${receipt}`} onClick={onClose}>Xem hồ sơ mẫu</Link>
      <button className="application-close-link" type="button" onClick={onClose}>Đóng cửa sổ</button>
    </div> : <form className="application-form" ref={formRef} onSubmit={submit} noValidate>
      <div className="application-job"><strong>{job.id}</strong><strong>{job.title}</strong></div>
      <p className="application-note">Chỉ dùng dữ liệu giả. Thông tin được giữ tạm trong bộ nhớ trang để xem ở ADMIN, không gửi ra ngoài.</p>
      <div className="application-field">
        <label htmlFor="apply-name">Họ và tên <span aria-hidden="true">*</span></label>
        <input id="apply-name" name="name" required autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'apply-name-error' : undefined}
          onChange={event => clearCorrectedError('name', !!event.currentTarget.value.trim())}/>
        {errorFor('name')}
      </div>
      <div className="application-field">
        <label htmlFor="apply-phone">Số điện thoại <span aria-hidden="true">*</span></label>
        <input id="apply-phone" name="phone" type="tel" required autoComplete="tel" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'apply-phone-error' : undefined}
          onChange={event => clearCorrectedError('phone', validDemoPhone(event.currentTarget.value))}/>
        {errorFor('phone')}
      </div>
      {job.internal && <>
        <div className="application-field">
          <label htmlFor="apply-position">Vị trí ứng tuyển <span aria-hidden="true">*</span></label>
          <input id="apply-position" name="position" value={String(translate(job.title,locale))} readOnly required/>
        </div>
        <div className="application-field">
          <label htmlFor="apply-email">Email (không bắt buộc)</label>
          <input id="apply-email" name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'apply-email-error' : undefined}
            onChange={event => clearCorrectedError('email', validOptionalEmail(event.currentTarget.value))}/>
          {errorFor('email')}
        </div>
        <div className="application-field">
          <label htmlFor="apply-cv">CV của bạn (không bắt buộc)</label>
          <div className={`application-upload${errors.cv ? ' has-error' : ''}`}><FileUp size={25} aria-hidden="true"/>
            <input id="apply-cv" name="cv" type="file" multiple accept={FILE_ACCEPT} aria-invalid={!!errors.cv}
              aria-describedby={errors.cv ? 'apply-cv-help apply-cv-error' : 'apply-cv-help'} onChange={event => {
                const files = Array.from(event.currentTarget.files || []);
                setFileNames(files.map(file => file.name).join(', '));
                setErrors(previous => ({...previous,cv:validateDemoFiles(files) || undefined}));
              }}/><span>{fileNames || 'Chọn tệp từ thiết bị của bạn'}</span>
          </div>
          <small id="apply-cv-help">Tối đa 3 tệp JPG, JPEG, PNG, PDF, DOC hoặc DOCX; 5 MB/tệp, tổng 15 MB. Tệp không được tải lên.</small>
          {errorFor('cv')}
        </div>
      </>}
      <button className="btn application-submit" type="submit">Gửi hồ sơ mô phỏng</button>
      <p className="application-required">Các trường có dấu * là bắt buộc.</p>
    </form>}
  </Modal>;
}

export function JobDetailPage() {
  const {slug} = useParams();
  const job = jobs.find(item => item.slug === slug);
  const [applying,setApplying] = useState(false);
  const inlineApply = useRef<HTMLButtonElement>(null);
  const mobileApply = useRef<HTMLButtonElement>(null);
  const fromMobileBar = useRef(false);
  const detail = useRef<HTMLElement>(null);
  const [pastAction,setPastAction] = useState(false);
  useEffect(() => {
    const action = inlineApply.current;
    const page = detail.current;
    if (!action || !page) return;
    const mobile = window.matchMedia('(max-width:767px)');
    const viewport = window.visualViewport;
    const header = document.querySelector('.site-header');
    let frame = 0;
    const measure = () => {
      frame = 0;
      if (!mobile.matches) {
        setPastAction(false);
        return;
      }
      const headerBottom = Math.max(0,header?.getBoundingClientRect().bottom ?? 0);
      const editing = document.activeElement?.matches('input,textarea,select,[contenteditable="true"]');
      const keyboardOpen = viewport && window.innerHeight - viewport.height > 120;
      setPastAction(Boolean(!editing && !keyboardOpen &&
        action.getBoundingClientRect().bottom <= headerBottom &&
        page.getBoundingClientRect().bottom > window.innerHeight));
    };
    function update() {
      if (!frame) frame = requestAnimationFrame(measure);
    }
    measure();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update);
    observer?.observe(page);
    if (header) observer?.observe(header);
    window.addEventListener('scroll',update,{passive:true});
    window.addEventListener('resize',update);
    viewport?.addEventListener('resize',update);
    document.addEventListener('focusin',update);
    document.addEventListener('focusout',update);
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener('scroll',update);
      window.removeEventListener('resize',update);
      viewport?.removeEventListener('resize',update);
      document.removeEventListener('focusin',update);
      document.removeEventListener('focusout',update);
    };
  },[slug]);
  const navigate = useNavigate();
  const location = useLocation();
  const origin = readOrigin(location.state);
  useEffect(() => {setApplying(false);},[slug]);
  if (!job) return <PageMasthead title="Không tìm thấy việc làm" description="Vị trí này không có trong danh sách. Hãy khám phá những cơ hội khác."><Link className="btn" to="/jobs#job-listings">Xem tất cả việc làm</Link></PageMasthead>;
  const backPath = origin?.pathname || (job.internal ? '/careers' : '/jobs');
  const backLabel = backPath === '/saved-jobs' ? 'Việc làm đã lưu' : backPath === '/careers' ? 'Tuyển dụng nội bộ' : 'Tất cả việc làm';
  const backUrl = origin ? `${origin.pathname}${origin.search}${origin.hash}` : `${backPath}#${job.internal ? 'open-positions' : 'job-listings'}`;
  const related = jobs.filter(item => item !== job && !!item.internal === !!job.internal)
    .sort((a,b) => Number(b.status === 'active')-Number(a.status === 'active') || Number(b.location === job.location)-Number(a.location === job.location)).slice(0,3);
  const closed = job.status === 'closed';
  return <section ref={detail} className="jobs-detail-section"><div className="container">
    <Link className="jobs-back" to={backUrl} onClick={event => {if (origin && plainClick(event)) {event.preventDefault(); navigate(-origin.steps);}}}><ChevronLeft size={18} aria-hidden="true"/>{backLabel}</Link>
    <div className="job-detail-layout">
      <header className="job-detail-intro"><div className="job-card-meta"><span>MÃ VỊ TRÍ {job.id}</span><span className={closed ? 'job-status closed' : 'job-status'}>{statusLabel(job.status || 'active')}</span></div><h1>{job.title}</h1></header>
      <aside className="job-summary">
        <div className="job-summary-primary">
          <h2>Thông tin vị trí</h2>
          <dl><div className="job-pay"><dt>Thu nhập tham khảo</dt><dd>{job.salary}</dd></div></dl>
          {(job.shift || job.schedule) && <p className="job-summary-shift"><strong>Ca làm việc</strong> {job.shift}{job.shift && job.schedule && ' · '}{job.schedule}</p>}
          <p className="job-summary-locality"><MapPin size={16} aria-hidden="true"/><span className="sr-only">Địa điểm</span> {job.location}</p>
        </div>
        <div className="job-summary-actions">
          {closed ? <>
            <p className="job-closed">Vị trí đã đóng, không nhận ứng tuyển.</p>
            <Link className="jobs-quiet-button" to={job.internal ? '/careers#open-positions' : '/jobs?status=active#job-listings'}>Xem vị trí đang tuyển</Link>
          </> : <button ref={inlineApply} className="btn job-apply-button" aria-haspopup="dialog" type="button" onClick={() => setApplying(true)}>
            {job.internal ? 'Ứng tuyển vị trí này' : 'Ứng tuyển ngay'}
          </button>}
          <SaveButton job={job} labelled/>
        </div>
        <dl>
          {job.industrialPark && <div><dt>Khu công nghiệp</dt><dd>{job.industrialPark}</dd></div>}
          <div><dt>Hình thức</dt><dd>{job.type}</dd></div>
          <div><dt>Nhóm công việc</dt><dd>{job.category}</dd></div>
        </dl>
        <p className="jobs-data-note">Vị trí và thu nhập minh họa, chưa phải thông báo tuyển dụng.</p>
      </aside>
      <div className="job-detail-body">
        <p className="job-detail-summary">{job.intro}</p><ul className="job-tags">{job.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
        {([['Mô tả công việc',job.tasks],['Điều gì giúp bạn phù hợp?',job.requirements],['Quyền lợi & sự đồng hành',job.benefits]] as const).map(([heading,items]) => <section className="job-description-block" key={heading}><RevealFrame><h2>{heading}</h2><ul>{items.map(item => <li key={item}>{item}</li>)}</ul></RevealFrame></section>)}
        <section className="job-description-block"><h2>Ba bước để bắt đầu</h2><ol className="job-steps"><li><strong>Chia sẻ mong muốn</strong><p>{job.internal ? 'Chọn vị trí, nhập họ tên và số điện thoại. Bạn có thể đính kèm CV.' : 'Chọn vị trí, nhập họ tên và số điện thoại.'}</p></li><li><strong>Trao đổi với tư vấn viên</strong><p>Ở quy trình thực tế, đội tư vấn sẽ xác nhận yêu cầu và thông tin công việc.</p></li><li><strong>Sẵn sàng cho khởi đầu mới</strong><p>Hiểu rõ điều kiện làm việc trước khi quyết định nhận việc.</p></li></ol></section>
        <div className="job-help"><h2>Cần thêm thông tin?</h2><a href={`tel:${company.tel}`}><Phone size={18} aria-hidden="true"/>{company.phone}</a></div>
      </div>
    </div>
    {related.length > 0 && <section className="jobs-related"><h2>Có thể bạn quan tâm</h2><div className="jobs-grid">{related.map(item => <JobCard key={item.id} job={item} origin={origin && {...origin,steps:origin.steps+1}}/>)}</div></section>}
  </div>
    {!closed && <div className="job-mobile-apply" hidden={!pastAction || applying}>
      <button ref={mobileApply} className="btn" type="button" aria-haspopup="dialog" onClick={event => {
        fromMobileBar.current = true;
        event.currentTarget.focus({preventScroll:true});
        setApplying(true);
      }}>{job.internal ? 'Ứng tuyển vị trí này' : 'Ứng tuyển ngay'}</button>
    </div>}
    {applying && !closed && <ApplicationDialog job={job} onClose={() => {
      setApplying(false);
      if (fromMobileBar.current) {
        fromMobileBar.current = false;
        requestAnimationFrame(() => {
          const button = mobileApply.current;
          if (button && !button.parentElement?.hidden) button.focus({preventScroll:true});
          else inlineApply.current?.focus();
        });
      }
    }}/>}</section>;
}
