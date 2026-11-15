import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type FormEvent } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Bookmark, BriefcaseBusiness, CheckCircle2, ChevronLeft, ChevronRight, Clock3, FileUp, MapPin, Phone, Search, SlidersHorizontal, Users, Wallet } from 'lucide-react';
import { PageHero, SectionHeading, ButtonLink, CTASection, DemoNote, Modal } from './shared';
import './jobs.css';

export type Job = {
  id: string;
  slug: string;
  title: string;
  location: string;
  type: string;
  salary: string;
  category: string;
  tags: string[];
  internal?: boolean;
  intro: string;
  tasks: string[];
  requirements: string[];
  benefits: string[];
};

export const jobs: Job[] = [
  { id: 'MD001', slug: 'cong-nhan-lap-rap-bac-ninh', title: 'Công nhân lắp ráp linh kiện', location: 'Bắc Ninh', type: 'Toàn thời gian', salary: '8–11 triệu/tháng', category: 'Sản xuất', tags: ['Được đào tạo', 'Làm việc theo ca'], intro: 'Bắt đầu công việc trong môi trường sản xuất có quy trình rõ ràng. Vị trí minh họa phù hợp với người muốn tìm việc ổn định và được hướng dẫn từ đầu.', tasks: ['Lắp ráp linh kiện theo hướng dẫn tại từng công đoạn.', 'Kiểm tra sản phẩm sau lắp ráp và báo cáo các điểm bất thường.', 'Sắp xếp khu vực làm việc, tuân thủ quy trình an toàn.'], requirements: ['Cẩn thận, có trách nhiệm và sẵn sàng học việc.', 'Có thể làm việc theo ca đã thống nhất.', 'Không yêu cầu kinh nghiệm; được hướng dẫn quy trình trước khi làm việc.'], benefits: ['Đào tạo thao tác và an toàn trước khi bắt đầu.', 'Lịch làm việc, thu nhập và phụ cấp được trao đổi rõ trước khi nhận việc.', 'Có nhân sự tư vấn hỗ trợ trong quá trình tìm hiểu công việc.'] },
  { id: 'MD002', slug: 'kiem-tra-chat-luong-bac-giang', title: 'Nhân viên kiểm tra chất lượng', location: 'Bắc Giang', type: 'Toàn thời gian', salary: '9–12 triệu/tháng', category: 'Chất lượng', tags: ['Kiểm hàng', 'Cẩn thận'], intro: 'Tham gia kiểm tra chất lượng sản phẩm ở từng công đoạn, phát hiện lỗi và góp phần duy trì chất lượng đầu ra của dây chuyền.', tasks: ['Kiểm tra ngoại quan, đối chiếu sản phẩm với mẫu hướng dẫn.', 'Phân loại sản phẩm đạt và không đạt theo tiêu chuẩn.', 'Ghi nhận số liệu và bàn giao kết quả cho người phụ trách ca.'], requirements: ['Quan sát tốt, làm việc cẩn thận và trung thực.', 'Có khả năng đọc, ghi chép biểu mẫu đơn giản.', 'Kinh nghiệm kiểm hàng là lợi thế, không phải yêu cầu bắt buộc.'], benefits: ['Được hướng dẫn cách nhận diện lỗi và sử dụng biểu mẫu.', 'Cơ hội làm quen với quy trình quản lý chất lượng.', 'Thông tin về chế độ và ca làm được tư vấn trước khi quyết định.'] },
  { id: 'MD003', slug: 'nhan-vien-kho-thai-nguyen', title: 'Nhân viên kho & đóng gói', location: 'Thái Nguyên', type: 'Toàn thời gian', salary: '8–10 triệu/tháng', category: 'Kho vận', tags: ['Kho vận', 'Phối hợp nhóm'], intro: 'Công việc minh họa dành cho người yêu thích sự ngăn nắp, phối hợp tốt và muốn phát triển trong lĩnh vực kho vận.', tasks: ['Nhận, kiểm đếm và sắp xếp hàng hóa đúng khu vực.', 'Soạn hàng, đóng gói và đối chiếu thông tin giao nhận.', 'Giữ khu vực kho gọn gàng, báo cáo chênh lệch khi phát hiện.'], requirements: ['Có khả năng kiểm đếm chính xác và phối hợp với đồng nghiệp.', 'Tuân thủ quy định an toàn trong kho.', 'Sẵn sàng học cách sử dụng thiết bị, biểu mẫu quản lý kho.'], benefits: ['Được đào tạo quy trình xuất nhập hàng.', 'Môi trường làm việc theo nhóm, có hướng dẫn trong thời gian đầu.', 'Chi tiết chế độ được xác nhận khi tư vấn vị trí thực tế.'] },
  { id: 'MD004', slug: 'van-hanh-may-quang-ninh', title: 'Công nhân vận hành máy', location: 'Quảng Ninh', type: 'Toàn thời gian', salary: '9–13 triệu/tháng', category: 'Sản xuất', tags: ['Vận hành', 'Đào tạo kỹ năng'], intro: 'Tìm hiểu công việc vận hành thiết bị sản xuất, theo dõi thông số và phối hợp cùng đội kỹ thuật để bảo đảm hoạt động ổn định.', tasks: ['Vận hành máy theo quy trình và phạm vi được phân công.', 'Theo dõi thông số, phát hiện và báo cáo dấu hiệu bất thường.', 'Vệ sinh thiết bị, bàn giao tình trạng máy sau mỗi ca.'], requirements: ['Có tinh thần kỷ luật, ưu tiên an toàn trong mọi thao tác.', 'Có thể làm việc theo ca và theo dõi thông số cơ bản.', 'Ưu tiên người đã học nghề hoặc từng làm việc tại nhà máy.'], benefits: ['Hướng dẫn sử dụng thiết bị trước khi thực hành.', 'Có cơ hội nâng cao tay nghề vận hành.', 'Được tư vấn rõ yêu cầu sức khỏe và lịch ca trước khi nhận việc.'] },
  { id: 'MD005', slug: 'ky-thuat-bao-tri-bac-ninh', title: 'Kỹ thuật viên bảo trì', location: 'Bắc Ninh', type: 'Toàn thời gian', salary: '11–15 triệu/tháng', category: 'Kỹ thuật', tags: ['Có tay nghề', 'Cơ điện'], intro: 'Vị trí minh họa cho ứng viên có nền tảng cơ điện, mong muốn làm việc cùng đội kỹ thuật và phát triển kỹ năng bảo trì thiết bị.', tasks: ['Kiểm tra, bảo dưỡng thiết bị theo lịch và hướng dẫn kỹ thuật.', 'Phối hợp xác định nguyên nhân sự cố và thực hiện sửa chữa trong phạm vi chuyên môn.', 'Ghi lại lịch sử bảo trì, vật tư sử dụng và đề xuất cải tiến.'], requirements: ['Có kiến thức nghề về điện, cơ khí hoặc cơ điện.', 'Đọc hiểu tài liệu kỹ thuật cơ bản và tuân thủ quy trình an toàn.', 'Có tinh thần hợp tác, chủ động báo cáo khi phát hiện nguy cơ.'], benefits: ['Cơ hội tích lũy kinh nghiệm trên thiết bị thực tế.', 'Được trao đổi rõ phạm vi công việc và yêu cầu chuyên môn.', 'Thu nhập và chế độ được thỏa thuận theo vị trí thực tế.'] },
  { id: 'MD006', slug: 'dong-goi-thoi-vu-bac-giang', title: 'Nhân viên đóng gói thời vụ', location: 'Bắc Giang', type: 'Thời vụ', salary: '7–9 triệu/tháng', category: 'Sản xuất', tags: ['Thời vụ', 'Không cần kinh nghiệm'], intro: 'Lựa chọn minh họa cho người tìm công việc trong một giai đoạn cụ thể, với các thao tác đóng gói đơn giản và hướng dẫn trực tiếp.', tasks: ['Đóng gói, dán nhãn sản phẩm theo quy cách.', 'Kiểm đếm và sắp xếp thành phẩm theo đơn hàng.', 'Giữ vệ sinh khu vực làm việc và tuân thủ hướng dẫn an toàn.'], requirements: ['Cẩn thận, đúng giờ và hoàn thành lịch làm việc đã thống nhất.', 'Có thể phối hợp theo nhóm.', 'Không yêu cầu kinh nghiệm đóng gói trước đó.'], benefits: ['Được hướng dẫn công việc ngay từ đầu.', 'Thời hạn công việc được trao đổi trước khi bắt đầu.', 'Cách tính thu nhập và lịch thanh toán được xác nhận khi tư vấn thực tế.'] },
  { id: 'MD007', slug: 'chuyen-vien-tuyen-dung-bac-ninh', title: 'Chuyên viên tuyển dụng', location: 'Bắc Ninh', type: 'Toàn thời gian', salary: '9–14 triệu/tháng', category: 'Tuyển dụng nội bộ', tags: ['Nội bộ', 'Phát triển nghề nghiệp'], internal: true, intro: 'Cùng Minh Đức kết nối người lao động với cơ hội phù hợp. Đây là vị trí nội bộ minh họa để trải nghiệm quy trình tuyển dụng trên prototype.', tasks: ['Tiếp nhận nhu cầu và tư vấn thông tin công việc cho ứng viên.', 'Sắp xếp lịch trao đổi, theo dõi tiến độ và hỗ trợ ứng viên.', 'Cập nhật nội dung tuyển dụng theo thông tin đã được xác nhận.'], requirements: ['Giao tiếp rõ ràng, biết lắng nghe và tôn trọng ứng viên.', 'Sử dụng các công cụ văn phòng cơ bản.', 'Có trách nhiệm với thông tin cá nhân và tính chính xác của nội dung tư vấn.'], benefits: ['Được hướng dẫn quy trình tư vấn và chăm sóc ứng viên.', 'Cơ hội phát triển kỹ năng tuyển dụng và phối hợp khách hàng.', 'Môi trường khuyến khích chia sẻ và hỗ trợ đồng đội.'] },
  { id: 'MD008', slug: 'cong-tac-vien-tuyen-dung-quang-ninh', title: 'Cộng tác viên tuyển dụng', location: 'Quảng Ninh', type: 'Cộng tác viên', salary: 'Trao đổi khi tư vấn', category: 'Tuyển dụng nội bộ', tags: ['Nội bộ', 'Cộng tác linh hoạt'], internal: true, intro: 'Vị trí cộng tác minh họa dành cho người có khả năng kết nối cộng đồng, mong muốn hỗ trợ người lao động tiếp cận thông tin việc làm rõ ràng.', tasks: ['Giới thiệu thông tin việc làm đã được xác nhận tới người có nhu cầu.', 'Kết nối ứng viên với đội tư vấn phụ trách.', 'Theo dõi phản hồi và hỗ trợ giải đáp trong phạm vi được hướng dẫn.'], requirements: ['Truyền đạt trung thực, không tự đưa ra cam kết về việc làm hoặc thu nhập.', 'Có kỹ năng giao tiếp và sử dụng điện thoại, mạng xã hội.', 'Tôn trọng quyền riêng tư và sự đồng ý của ứng viên.'], benefits: ['Có tài liệu và nhân sự hỗ trợ tư vấn.', 'Hình thức cộng tác, phạm vi và quyền lợi được trao đổi riêng.', 'Cơ hội tích lũy kinh nghiệm trong lĩnh vực nhân lực.'] },
];

const HERO_IMAGE = '/mirror/www.hr2b.com/wp-content/uploads/2025/09/Co-hoi-viec-lam-scaled.jpg';
const LOCATIONS = ['Bắc Ninh', 'Bắc Giang', 'Thái Nguyên', 'Quảng Ninh'];
const TYPES = ['Toàn thời gian', 'Thời vụ', 'Cộng tác viên'];
const SAVED_KEY = 'minhduc.saved-jobs.v1';
const SAVED_EVENT = 'minhduc:saved-jobs';
let memorySaved = '[]';
let useMemorySaved = false;

function getSavedSnapshot() {
  if (useMemorySaved) return memorySaved;
  try {
    memorySaved = window.localStorage.getItem(SAVED_KEY) ?? '[]';
    return memorySaved;
  } catch { return memorySaved; }
}
function subscribeSaved(callback: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === SAVED_KEY || event.key === null) {
      memorySaved = event.newValue ?? '[]';
      useMemorySaved = false;
      callback();
    }
  };
  window.addEventListener('storage', onStorage);
  window.addEventListener(SAVED_EVENT, callback);
  return () => { window.removeEventListener('storage', onStorage); window.removeEventListener(SAVED_EVENT, callback); };
}
function parseSaved(raw: string): string[] {
  try { const result: unknown = JSON.parse(raw); return Array.isArray(result) ? [...new Set(result.filter((id): id is string => typeof id === 'string' && jobs.some(job => job.id === id)))] : []; } catch { return []; }
}
export function useSavedJobs() {
  const raw = useSyncExternalStore(subscribeSaved, getSavedSnapshot, () => '[]');
  const savedIds = useMemo(() => parseSaved(raw), [raw]);
  const toggleSaved = (id: string) => {
    if (!jobs.some(job => job.id === id)) return;
    const current = parseSaved(getSavedSnapshot());
    const next = current.includes(id) ? current.filter(item => item !== id) : [...current, id];
    memorySaved = JSON.stringify(next);
    try {
      window.localStorage.setItem(SAVED_KEY, memorySaved);
      useMemorySaved = false;
    } catch { useMemorySaved = true; }
    window.dispatchEvent(new Event(SAVED_EVENT));
  };
  return { savedIds, toggleSaved, isSaved: (id: string) => savedIds.includes(id), count: savedIds.length };
}

function normalized(value: string) { return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().trim().replace(/\s+/g, ' '); }

function validateApplicationFile(file?: Pick<File, 'name' | 'size' | 'type'> | null) {
  if (!file || !file.name) return '';
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
  const saved = isSaved(job.id);
  return <button type="button" className={`job-save ${saved ? 'is-saved' : ''} ${showLabel ? 'has-label' : ''}`} aria-pressed={saved} aria-label={`${saved ? 'Bỏ lưu' : 'Lưu'} ${job.title}`} title={saved ? 'Bỏ lưu việc làm' : 'Lưu việc làm'} onClick={() => toggleSaved(job.id)}><Bookmark size={19} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />{showLabel && <span>{saved ? 'Đã lưu việc làm' : 'Lưu việc làm'}</span>}</button>;
}

function JobCard({ job }: { job: Job }) {
  return <article className="job-card">
    <div className="job-card-top"><span className="job-category">{job.category}</span><SaveButton job={job} /></div>
    <h3><Link to={`/jobs/${job.slug}`}>{job.title}</Link></h3>
    <div className="job-card-specs"><p><Wallet size={17} aria-hidden="true" /><strong>{job.salary}</strong></p><p><MapPin size={17} aria-hidden="true" />{job.location}<span className="job-spec-divider" aria-hidden="true">·</span>{job.type}</p></div>
    <div className="job-tags">{job.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
    <div className="job-card-footer"><small>Vị trí minh họa</small><Link to={`/jobs/${job.slug}`}>Xem chi tiết <ArrowRight size={17} aria-hidden="true" /></Link></div>
  </article>;
}

function EmptyJobs({ saved = false, onReset }: { saved?: boolean; onReset?: () => void }) {
  return <div className="jobs-empty"><div className="jobs-empty-icon">{saved ? <Bookmark size={30} aria-hidden="true" /> : <Search size={30} aria-hidden="true" />}</div><h3>{saved ? 'Bạn chưa lưu việc làm nào' : 'Chưa tìm thấy việc làm phù hợp'}</h3><p>{saved ? 'Chạm biểu tượng đánh dấu ở vị trí bạn quan tâm để xem lại tại đây.' : 'Thử từ khóa khác hoặc mở rộng địa điểm và loại công việc.'}</p>{saved ? <ButtonLink to="/jobs">Khám phá việc làm</ButtonLink> : <button className="btn btn-secondary" type="button" onClick={onReset}>Xóa bộ lọc</button>}</div>;
}

function JobBrowser({ internal = false, savedOnly = false }: { internal?: boolean; savedOnly?: boolean }) {
  const [params, setParams] = useSearchParams();
  const { savedIds, count } = useSavedJobs();
  const [page, setPage] = useState(1);
  const listRef = useRef<HTMLDivElement>(null);
  const query = params.get('q') ?? '';
  const locationValue = params.get('location') ?? '';
  const typeValue = params.get('type') ?? '';
  const location = LOCATIONS.includes(locationValue) ? locationValue : '';
  const type = TYPES.includes(typeValue) ? typeValue : '';
  const allJobs = jobs.filter(job => (!internal || job.internal) && (!savedOnly || savedIds.includes(job.id)));
  const filtered = allJobs.filter(job => (!location || job.location === location) && (!type || job.type === type) && (!query || normalized(`${job.title} ${job.category} ${job.location} ${job.tags.join(' ')}`).includes(normalized(query))));
  const pageSize = 6;
  const totalPages = Math.ceil(filtered.length / pageSize);
  const currentPage = Math.min(page, Math.max(totalPages, 1));
  useEffect(() => setPage(1), [query, location, type]);
  useEffect(() => setPage(previous => Math.min(previous, Math.max(totalPages, 1))), [totalPages]);
  const updateFilter = (key: string, value: string) => { const next = new URLSearchParams(params); if (value) next.set(key, value); else next.delete(key); setParams(next, { replace: true }); };
  const reset = () => { setParams({}, { replace: true }); setPage(1); };
  const scrollToResults = () => listRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  const changePage = (next: number) => { setPage(next); scrollToResults(); };
  return <div className="jobs-browser">
    <div className="jobs-heading-row"><h2>{savedOnly ? 'Danh sách đã lưu' : internal ? 'Cơ hội trong đội ngũ Minh Đức' : 'Cơ hội việc làm dành cho bạn'}</h2>{!savedOnly && <Link className="jobs-saved-link" to="/saved-jobs"><Bookmark size={18} aria-hidden="true" />Việc đã lưu <span>{count}</span></Link>}</div>
    <form className="jobs-filters" role="search" aria-label="Tìm việc làm" onSubmit={event => { event.preventDefault(); setPage(1); scrollToResults(); }}>
      <div className="jobs-filter-field jobs-keyword"><label htmlFor="jobs-query">Từ khóa</label><div className="jobs-input-icon"><Search size={18} aria-hidden="true" /><input id="jobs-query" type="search" value={query} placeholder="Tên công việc, kỹ năng…" onChange={event => updateFilter('q', event.target.value)} /></div></div>
      <div className="jobs-filter-field"><label htmlFor="jobs-location">Địa điểm</label><select id="jobs-location" value={location} onChange={event => updateFilter('location', event.target.value)}><option value="">Tất cả địa điểm</option>{LOCATIONS.map(item => <option key={item}>{item}</option>)}</select></div>
      <div className="jobs-filter-field"><label htmlFor="jobs-type">Loại công việc</label><select id="jobs-type" value={type} onChange={event => updateFilter('type', event.target.value)}><option value="">Tất cả loại việc</option>{TYPES.map(item => <option key={item}>{item}</option>)}</select></div>
      <button className="btn jobs-search-button" type="submit"><Search size={18} aria-hidden="true" />Tìm việc</button>
    </form>
    <div className="jobs-result-bar" ref={listRef}><p role="status" aria-live="polite"><strong>{filtered.length}</strong> {savedOnly ? 'việc làm đã lưu' : 'việc làm phù hợp'}{query && <> cho “{query}”</>}</p>{(query || location || type) && <button type="button" onClick={reset}><SlidersHorizontal size={15} aria-hidden="true" />Xóa bộ lọc</button>}</div>
    {filtered.length > 0 ? <div className="jobs-grid">{filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize).map(job => <JobCard key={job.id} job={job} />)}</div> : <EmptyJobs saved={savedOnly && allJobs.length === 0} onReset={reset} />}
    {totalPages > 1 && <nav className="jobs-pagination" aria-label="Phân trang việc làm"><button type="button" disabled={currentPage === 1} aria-label="Trang trước" onClick={() => changePage(currentPage - 1)}><ChevronLeft size={18} /></button>{Array.from({ length: totalPages }, (_, index) => index + 1).map(number => <button type="button" key={number} aria-label={`Trang ${number}`} aria-current={currentPage === number ? 'page' : undefined} onClick={() => changePage(number)}>{number}</button>)}<button type="button" disabled={currentPage === totalPages} aria-label="Trang sau" onClick={() => changePage(currentPage + 1)}><ChevronRight size={18} /></button></nav>}
    <p className="jobs-data-note">Các vị trí và mức thu nhập trên đây là dữ liệu minh họa cho prototype, chưa phải thông báo tuyển dụng. Thu nhập thực tế cần được xác nhận khi tư vấn.</p>
  </div>;
}

export function JobsPage() {
  return <><PageHero title="Cơ hội việc làm" eyebrow="DÀNH CHO NGƯỜI LAO ĐỘNG" description="Tìm công việc phù hợp. Bắt đầu hành trình mới." image={HERO_IMAGE} /><section className="section jobs-section"><div className="container"><div className="jobs-intro"><div><span className="eyebrow">CÙNG MINH ĐỨC</span><h2>Một công việc phù hợp.<br />Một khởi đầu vững vàng.</h2><p>Khám phá cơ hội theo địa điểm và công việc bạn quan tâm. Minh Đức đồng hành để bạn hiểu rõ vị trí trước khi quyết định.</p></div><div className="jobs-intro-icon" aria-hidden="true"><BriefcaseBusiness size={70} strokeWidth={1.1} /><span>Nhân lực là tài sản</span></div></div><JobBrowser /></div></section><CTASection /></>;
}

export function SavedJobsPage() {
  return <><PageHero title="Việc làm đã lưu" eyebrow="CƠ HỘI CỦA BẠN" description="Giữ lại những vị trí bạn quan tâm, để cân nhắc khi sẵn sàng." image={HERO_IMAGE} /><section className="section jobs-section"><div className="container"><Link className="jobs-back" to="/jobs"><ArrowLeft size={18} aria-hidden="true" />Tất cả việc làm</Link><JobBrowser savedOnly /><p className="jobs-storage-note">Danh sách được lưu trên trình duyệt này. Bạn có thể bỏ lưu bất kỳ lúc nào.</p></div></section></>;
}

export function CareersPage() {
  return <><PageHero title="Gia nhập Minh Đức" eyebrow="TUYỂN DỤNG NỘI BỘ" description="Kết nối con người, cùng nhau tạo dựng giá trị." image={HERO_IMAGE} /><section className="section"><div className="container"><SectionHeading eyebrow="PHÁT TRIỂN CÙNG NHAU" title="Công việc ý nghĩa bắt đầu từ con người" description="Nếu bạn thích lắng nghe, kết nối và giúp người khác tìm được cơ hội phù hợp, hãy khám phá hành trình nghề nghiệp cùng Minh Đức." /><div className="career-values"><article><Users size={30} aria-hidden="true" /><h3>Đồng đội đồng hành</h3><p>Chia sẻ kinh nghiệm, hỗ trợ nhau và cùng giải quyết công việc.</p></article><article><BriefcaseBusiness size={30} aria-hidden="true" /><h3>Học từ thực tế</h3><p>Phát triển kỹ năng tư vấn, tuyển dụng và chăm sóc người lao động.</p></article><article><CheckCircle2 size={30} aria-hidden="true" /><h3>Giá trị thiết thực</h3><p>Đặt sự rõ ràng, trách nhiệm và tôn trọng con người vào từng kết nối.</p></article></div><JobBrowser internal /></div></section><CTASection /></>;
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
    const data = new FormData(event.currentTarget);
    const next: ApplicationErrors = {};
    if (String(data.get('name') ?? '').trim().length < 2) next.name = 'Vui lòng nhập họ và tên, tối thiểu 2 ký tự.';
    const phone = String(data.get('phone') ?? '').replace(/[\s().-]/g, '');
    if (!/^(?:0|\+?84)[35789]\d{8}$/.test(phone)) next.phone = 'Nhập số di động Việt Nam hợp lệ, ví dụ 0912345678.';
    if (!LOCATIONS.includes(String(data.get('location') ?? ''))) next.location = 'Vui lòng chọn địa điểm mong muốn.';
    const fileError = validateApplicationFile(data.get('cv') as File | null);
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
  return <Modal title={success ? 'Hoàn tất trải nghiệm ứng tuyển' : 'Ứng tuyển vị trí'} onClose={onClose}>{success ? <div className="application-success"><CheckCircle2 size={56} aria-hidden="true" /><h3 ref={successRef} tabIndex={-1}>Bạn đã hoàn tất bước ứng tuyển mô phỏng</h3><p>Hồ sơ <strong>chưa được gửi tới nhà tuyển dụng</strong>. Thông tin cá nhân và tệp CV không được lưu hoặc tải lên.</p><p>Để được tư vấn việc làm thực tế, hãy liên hệ Minh Đức qua hotline.</p><a className="btn" href="tel:0364562868"><Phone size={18} aria-hidden="true" />0364 562 868</a><button className="application-close-link" type="button" onClick={onClose}>Đóng cửa sổ</button></div> : <form className="application-form" ref={formRef} onSubmit={submit} noValidate><div className="application-job"><strong>{job.title}</strong><span><MapPin size={15} aria-hidden="true" />{job.location} · {job.type}</span></div><p className="application-note">Bạn đang trải nghiệm form mô phỏng. Không có hồ sơ nào được gửi; có thể dùng thông tin mẫu để thử.</p><div className="application-field"><label htmlFor="apply-name">Họ và tên <span aria-hidden="true">*</span></label><input id="apply-name" name="name" placeholder="Nguyễn Văn An" autoComplete="name" required maxLength={100} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'apply-name-error' : undefined} />{error('name')}</div><div className="application-fields-row"><div className="application-field"><label htmlFor="apply-phone">Số điện thoại <span aria-hidden="true">*</span></label><input id="apply-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="0912 345 678" required maxLength={20} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'apply-phone-error' : undefined} />{error('phone')}</div><div className="application-field"><label htmlFor="apply-location">Địa điểm mong muốn <span aria-hidden="true">*</span></label><select id="apply-location" name="location" required defaultValue="" aria-invalid={!!errors.location} aria-describedby={errors.location ? 'apply-location-error' : undefined}><option value="">Chọn địa điểm</option>{LOCATIONS.map(item => <option key={item}>{item}</option>)}</select>{error('location')}</div></div><div className="application-field"><label htmlFor="apply-cv">CV của bạn <span className="optional">(không bắt buộc)</span></label><div className={`application-upload ${errors.cv ? 'has-error' : ''}`}><FileUp size={25} aria-hidden="true" /><input id="apply-cv" name="cv" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" aria-invalid={!!errors.cv} aria-describedby={`apply-cv-help${errors.cv ? ' apply-cv-error' : ''}`} onChange={event => { const file = event.target.files?.[0]; setFileName(file?.name ?? ''); setErrors(previous => ({ ...previous, cv: validateApplicationFile(file) || undefined })); }} /><span>{fileName || 'Chọn tệp từ thiết bị của bạn'}</span></div><small id="apply-cv-help">PDF, DOC hoặc DOCX · Tối đa 5 MB · Tệp không được tải lên</small>{error('cv')}</div><div className="application-consent"><label><input name="consent" type="checkbox" required aria-invalid={!!errors.consent} aria-describedby={errors.consent ? 'apply-consent-error' : undefined} /><span>Tôi đồng ý trải nghiệm bước ứng tuyển mô phỏng và đã đọc <Link to="/privacy-policy" onClick={onClose}>chính sách bảo mật</Link>. <span aria-hidden="true">*</span></span></label>{error('consent')}</div><button className="btn application-submit" type="submit">Gửi hồ sơ mô phỏng <ArrowRight size={18} aria-hidden="true" /></button><p className="application-required">Các trường có dấu * là bắt buộc.</p></form>}</Modal>;
}

export function JobDetailPage() {
  const { slug } = useParams();
  const job = jobs.find(item => item.slug === slug);
  const [applying, setApplying] = useState(false);
  useEffect(() => { setApplying(false); }, [slug]);
  if (!job) return <><PageHero title="Không tìm thấy việc làm" eyebrow="404" description="Vị trí này không có trong danh sách. Hãy khám phá những cơ hội khác." /><section className="section"><div className="container jobs-not-found"><ButtonLink to="/jobs">Xem tất cả việc làm</ButtonLink></div></section></>;
  const related = jobs.filter(item => item.id !== job.id && (!!item.internal === !!job.internal)).slice(0, 3);
  return <><PageHero title={job.title} eyebrow={job.internal ? 'TUYỂN DỤNG NỘI BỘ · MINH HỌA' : 'CƠ HỘI VIỆC LÀM · MINH HỌA'} description={`${job.location} · ${job.type}`} image={HERO_IMAGE} /><section className="section jobs-detail-section"><div className="container"><Link className="jobs-back" to={job.internal ? '/careers' : '/jobs'}><ArrowLeft size={18} aria-hidden="true" />{job.internal ? 'Tuyển dụng nội bộ' : 'Tất cả việc làm'}</Link><div className="job-detail-layout"><div className="job-detail-body"><div className="job-detail-intro"><span className="eyebrow">MÃ VỊ TRÍ {job.id}</span><h2>{job.title}</h2><p>{job.intro}</p><div className="job-tags">{job.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div><section className="job-description-block"><h2>Mô tả công việc</h2><ul>{job.tasks.map(item => <li key={item}>{item}</li>)}</ul></section><section className="job-description-block"><h2>Điều gì giúp bạn phù hợp?</h2><ul>{job.requirements.map(item => <li key={item}>{item}</li>)}</ul></section><section className="job-description-block"><h2>Quyền lợi & sự đồng hành</h2><ul>{job.benefits.map(item => <li key={item}>{item}</li>)}</ul></section><section className="job-description-block"><h2>Ba bước để bắt đầu</h2><ol className="job-steps"><li><span>01</span><div><strong>Chia sẻ mong muốn</strong><p>Chọn vị trí, điền thông tin cơ bản và địa điểm bạn quan tâm.</p></div></li><li><span>02</span><div><strong>Trao đổi với tư vấn viên</strong><p>Ở quy trình thực tế, đội tư vấn sẽ xác nhận yêu cầu và thông tin công việc.</p></div></li><li><span>03</span><div><strong>Sẵn sàng cho khởi đầu mới</strong><p>Hiểu rõ điều kiện làm việc trước khi quyết định nhận việc.</p></div></li></ol></section><DemoNote /></div><aside className="job-summary"><h2>Thông tin vị trí</h2><dl><div><dt><Wallet size={18} aria-hidden="true" />Thu nhập tham khảo</dt><dd className="job-summary-salary">{job.salary}</dd></div><div><dt><MapPin size={18} aria-hidden="true" />Địa điểm</dt><dd>{job.location}</dd></div><div><dt><Clock3 size={18} aria-hidden="true" />Hình thức</dt><dd>{job.type}</dd></div><div><dt><BriefcaseBusiness size={18} aria-hidden="true" />Nhóm công việc</dt><dd>{job.category}</dd></div></dl><p className="job-summary-demo">Vị trí và thu nhập minh họa, chưa phải thông báo tuyển dụng.</p><button className="btn job-apply-button" type="button" onClick={() => setApplying(true)}>Ứng tuyển ngay <ArrowRight size={18} aria-hidden="true" /></button><SaveButton job={job} showLabel /><div className="job-help"><p>Cần thêm thông tin?</p><a href="tel:0364562868"><Phone size={16} aria-hidden="true" />0364 562 868</a><span>Đội ngũ Minh Đức sẵn sàng hỗ trợ</span></div></aside></div>{related.length > 0 && <section className="jobs-related"><SectionHeading eyebrow="KHÁM PHÁ THÊM" title="Có thể bạn quan tâm" /><div className="jobs-grid">{related.map(item => <JobCard key={item.id} job={item} />)}</div></section>}</div></section>{applying && <ApplicationDialog job={job} onClose={() => setApplying(false)} />}</>;
}
