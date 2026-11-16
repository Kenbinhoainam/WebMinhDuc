import { useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, BookOpen, GraduationCap, Laptop } from 'lucide-react';
import { PageHero, SectionHeading, ButtonLink } from './shared';
import './education.css';
import { useLocale } from './i18n';
import { translate } from './i18n-runtime/jsx-runtime';

export const educationPrograms = [
  { slug: 'tu-xa-quan-tri', title: 'Quản trị kinh doanh', mode: 'Từ xa', description: 'Tìm hiểu kiến thức nền tảng về quản trị và vận hành kinh doanh.', detail: 'Hình thức học từ xa phù hợp với người muốn chủ động sắp xếp thời gian học. Nội dung, thời lượng và điều kiện tuyển sinh cần được xác nhận với đơn vị đào tạo.' },
  { slug: 'chinh-quy-cong-nghe', title: 'Công nghệ thông tin', mode: 'Chính quy', description: 'Khám phá kiến thức nền tảng về công nghệ và ứng dụng.', detail: 'Hình thức chính quy dành cho người quan tâm đến môi trường học tập tập trung. Lịch học, điều kiện và nội dung cụ thể cần được xác nhận với đơn vị đào tạo.' },
  { slug: 'tu-xa-ke-toan', title: 'Kế toán', mode: 'Từ xa', description: 'Tìm hiểu kiến thức cơ bản về kế toán và nghiệp vụ doanh nghiệp.', detail: 'Chương trình minh họa hình thức học từ xa. Người học cần xác nhận chương trình, điều kiện và chi phí trước khi quyết định đăng ký.' },
] as const;
const image = '/mirror/www.hr2b.com/wp-content/uploads/2025/09/Co-hoi-viec-lam-scaled.jpg';

function ProgramCards() {
  return <div className="education-cards">{educationPrograms.map(p => <article key={p.slug}><span className="education-icon">{p.mode === 'Từ xa' ? <Laptop /> : <GraduationCap />}</span><span className="eyebrow">{p.mode} · MINH HỌA</span><h3>{p.title}</h3><p>{p.description}</p><Link to={`/education/${p.slug}`} className="info-text-link">Xem chương trình <ArrowRight size={17} /></Link></article>)}</div>;
}
function EducationForm({ program }: { program?: string }) {
  const locale = useLocale();
  const [type, setType] = useState<'F05'|'F06'>('F05');
  const [success, setSuccess] = useState(false);
  const [fileError, setFileError] = useState('');
  const [fileKey, setFileKey] = useState(0);
  const [selectedProgram, setSelectedProgram] = useState(program || '');
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    for (const name of ['name', 'phone', ...(type === 'F05' ? ['question'] : [])]) {
      const field = form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement;
      const valid = name === 'phone' ? /^(?:0|\+?84)[35789]\d{8}$/.test(field.value.replace(/[\s().-]/g, '')) : field.value.trim().length > 0;
      field.setCustomValidity(valid ? '' : translate(name === 'phone' ? 'Vui lòng nhập số điện thoại hợp lệ.' : 'Vui lòng nhập nội dung.', locale) as string);
      if (!valid) { field.reportValidity(); field.focus(); return; }
    }
    if (type === 'F06') {
      const file = (form.elements.namedItem('document') as HTMLInputElement).files?.[0];
      if (!file || !/\.(pdf|doc|docx)$/i.test(file.name) || file.size === 0 || file.size > 5 * 1024 * 1024 || (file.type !== '' && file.type !== 'application/octet-stream' && !['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type))) {
        setFileError('Vui lòng chọn một tệp PDF, DOC hoặc DOCX có nội dung, không quá 5 MB.');
        (form.elements.namedItem('document') as HTMLInputElement).focus();
        return;
      }
    }
    setFileError(''); form.reset(); setFileKey(k => k + 1); setSuccess(true);
  }
  function choose(next: 'F05'|'F06') { setType(next); setSuccess(false); setFileError(''); setFileKey(k => k + 1); }
  return <section className="section education-form-section" id="dang-ky"><div className="container education-form-layout"><div><span className="eyebrow">BẮT ĐẦU TỪ ĐÂY</span><h2>Hành trình học tập của bạn</h2><p>Chọn tư vấn nếu bạn muốn tìm hiểu thêm, hoặc chọn hồ sơ để trải nghiệm bước đăng ký.</p><p className="education-note">Đây là bản mô phỏng. Thông tin và tệp chỉ được kiểm tra trên thiết bị, không được lưu hoặc tải lên. Không gửi giấy tờ thật.</p></div><div className="education-form-card"><div className="education-form-tabs" aria-label="Mục đích đăng ký"><button type="button" aria-pressed={type === 'F05'} onClick={() => choose('F05')}>Tư vấn tuyển sinh</button><button type="button" aria-pressed={type === 'F06'} onClick={() => choose('F06')}>Hồ sơ đăng ký</button></div>{success ? <div className="education-success" role="status"><h3><span>Hoàn tất mô phỏng</span> {type}</h3><p>Biểu mẫu đã được kiểm tra trên thiết bị. Không có thông tin hay tệp nào được gửi hoặc lưu.</p><Link to={`/admin-demo?type=${type}`} className="btn">Xem quản trị minh họa <ArrowRight size={17}/></Link><button type="button" className="education-again" onClick={() => setSuccess(false)}>Thử lại biểu mẫu</button></div> : <form onSubmit={submit}><h3>{type === 'F05' ? 'Đăng ký tư vấn tuyển sinh' : 'Hồ sơ đăng ký tuyển sinh'}</h3><p>{type === 'F05' ? 'Chia sẻ câu hỏi để trải nghiệm bước tư vấn.' : 'Trải nghiệm bước chuẩn bị hồ sơ bằng tệp minh họa.'}</p><label>Họ và tên <input name="name" required autoComplete="name" onInput={e => e.currentTarget.setCustomValidity('')} /></label><label>Số điện thoại <input name="phone" required onInput={e => e.currentTarget.setCustomValidity('')} type="tel" inputMode="tel" title="Nhập số điện thoại hợp lệ" autoComplete="tel" /></label><label>Chương trình quan tâm <select name="program" required value={selectedProgram} onChange={e => setSelectedProgram(e.currentTarget.value)}><option value="" disabled>Chọn chương trình</option>{educationPrograms.map(p => <option key={p.slug} value={p.slug}>{p.title} · {p.mode} (minh họa)</option>)}</select></label>{type === 'F05' ? <label>Nội dung cần tư vấn <textarea name="question" rows={3} required onInput={e => e.currentTarget.setCustomValidity('')} /></label> : <><p><span>Hình thức học</span>: {educationPrograms.find(p => p.slug === selectedProgram)?.mode || 'Chọn chương trình để xem hình thức học'}</p><label>Tệp hồ sơ minh họa <input key={fileKey} name="document" type="file" accept=".pdf,.doc,.docx" required onChange={() => setFileError('')} aria-invalid={!!fileError} aria-describedby={fileError ? 'education-file-help education-file-error' : 'education-file-help'} /></label><small id="education-file-help">PDF, DOC hoặc DOCX; tối đa 5 MB. Tệp chỉ ở trên thiết bị.</small>{fileError && <p id="education-file-error" className="education-error" role="alert">{fileError}</p>}</>}<label className="education-consent"><input type="checkbox" required /> <span>Tôi hiểu đây là bản mô phỏng và đồng ý kiểm tra thông tin trên thiết bị.</span></label><button className="btn" type="submit">{type === 'F05' ? 'Mô phỏng gửi tư vấn' : 'Mô phỏng gửi hồ sơ'} <ArrowRight size={17}/></button></form>}</div></div></section>;
}
export function EducationPage() {
  return <><PageHero title="Tuyển sinh cao đẳng" description="Khám phá hướng học phù hợp với hành trình của bạn." image={image}/><section className="section container"><SectionHeading eyebrow="CƠ HỘI HỌC TẬP" title="Học theo cách phù hợp với bạn" description="Tìm hiểu các hình thức học từ xa và chính quy qua những chương trình minh họa."/><p className="education-disclaimer">Các chương trình dưới đây là dữ liệu giả định để trải nghiệm giao diện, chưa đại diện cho trường hoặc đợt tuyển sinh có thật. Điều kiện, học phí và văn bằng cần được xác nhận trước khi đăng ký.</p><ProgramCards/></section><EducationForm/></>;
}
export function EducationDetailPage() {
  const { slug } = useParams(); const program = educationPrograms.find(p => p.slug === slug);
  if (!program) return <><PageHero title="Không tìm thấy chương trình" eyebrow="404"/><section className="section container"><p>Chương trình này không tồn tại.</p><ButtonLink to="/education">Xem tuyển sinh</ButtonLink></section></>;
  return <><PageHero title={program.title} description={`${program.mode} · Chương trình minh họa`} image={image}/><section className="section container education-detail"><div><span className="eyebrow">CHƯƠNG TRÌNH MINH HỌA</span><h2>Thêm một hướng đi cho tương lai</h2><p className="info-lead">{program.description}</p><p>{program.detail}</p><p className="education-disclaimer">Đây là chương trình giả định, không gắn với trường cụ thể. Vui lòng xác nhận thông tin tuyển sinh trước khi đưa ra quyết định.</p><a href="#dang-ky" className="btn">Tìm hiểu và đăng ký <ArrowRight size={17}/></a></div><div className="education-detail-card"><BookOpen size={36}/><h3>Thông tin cần xác nhận</h3><ul><li>Đơn vị đào tạo và điều kiện tuyển sinh</li><li>Thời lượng, lịch học và hình thức học</li><li>Học phí, hồ sơ và văn bằng</li></ul><Link to="/education" className="info-text-link">Xem tất cả chương trình <ArrowRight size={17}/></Link></div></section><EducationForm program={program.slug}/></>;
}
