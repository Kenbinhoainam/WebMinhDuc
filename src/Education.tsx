import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { PageMasthead } from './PageMasthead';
import { learningSpace, learningAlt } from './pages/info/data';
import { RevealFrame } from './motion';
import './education.css';
import { createDemoSubmission } from './demo-submissions';
import { FILE_ACCEPT,validateDemoFiles,validDemoPhone,validOptionalEmail } from './sharedformvalidation';
import { educationPrograms } from './education-data';
export { educationPrograms } from './education-data';

function ProgramDirectory() {
  return <section id="programs" tabIndex={-1} className="section container education-directory">
    <header><h2>Chương trình theo hình thức học</h2>
      <p>Các chương trình dưới đây là dữ liệu giả định để trải nghiệm giao diện, chưa đại diện cho trường hoặc đợt tuyển sinh có thật. Điều kiện, học phí và văn bằng cần được xác nhận trước khi đăng ký.</p>
      <nav className="education-mode-links" aria-label="Chương trình theo hình thức học">
        <a className="education-link" href="#distance-learning">Từ xa</a>
        <a className="education-link" href="#full-time-learning">Chính quy</a>
      </nav>
    </header>
    <div className="education-program-groups">{(['Từ xa', 'Chính quy'] as const).map(mode =>
      <section key={mode} id={mode === 'Từ xa' ? 'distance-learning' : 'full-time-learning'} tabIndex={-1}><h3>{mode}</h3><ul>{educationPrograms.filter(program => program.mode === mode).map(program =>
        <li key={program.slug}><Link to={`/education/${program.slug}`}><strong>{program.title}</strong><span>{program.description}</span><ArrowUpRight size={22} strokeWidth={1.6} aria-hidden="true"/></Link></li>)}</ul></section>)}
    </div>
  </section>;
}
function EducationForm({ program }: { program?: string }) {
 const location = useLocation();
 const navigate = useNavigate();
 const submitted = useRef(false);
 const type = new URLSearchParams(location.search).get('form') === 'F06' ? 'F06' : 'F05';
 const [receipt,setReceipt] = useState('');
 const [errors,setErrors] = useState<Record<string,string>>({});
 const [selectedProgram,setSelectedProgram] = useState(program || '');
 const formRef = useRef<HTMLFormElement>(null);
 const receiptRef = useRef<HTMLHeadingElement>(null);
 useEffect(() => { if (receipt) receiptRef.current?.focus({preventScroll:true}); }, [receipt]);
 useEffect(() => { setReceipt(''); setErrors({}); submitted.current = false; }, [type]);
 function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();if(submitted.current)return;const form=event.currentTarget,d=new FormData(form),next:Record<string,string>={};
  if(!String(d.get('name')||'').trim())next.name='Vui lòng nhập họ tên.';if(!validDemoPhone(String(d.get('phone')||'')))next.phone='Vui lòng nhập số điện thoại Việt Nam hợp lệ.';
  if(type==='F06'&&!validOptionalEmail(String(d.get('email')||'')))next.email='Email chưa đúng định dạng.';
  if(type==='F06'){const input=form.elements.namedItem('document') as HTMLInputElement;const err=validateDemoFiles(Array.from(input.files||[]));if(err)next.document=err;}
  setErrors(next);if(Object.keys(next).length){const first=Object.keys(next)[0];requestAnimationFrame(()=>formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus());return;}
  submitted.current=true;const record=createDemoSubmission({type,name:String(d.get('name')),phone:String(d.get('phone')),source:location.pathname,linkId:selectedProgram||undefined,fields:{program:selectedProgram,email:type==='F06'?String(d.get('email')||''):'',question:type==='F05'?String(d.get('question')||''):''}});setReceipt(record.id);
 }
 function choose(next: 'F05'|'F06') {
   if (next === type) return;
   const query = new URLSearchParams(location.search);
   query.set('form', next);
   navigate({pathname: location.pathname, search: query.toString(), hash:'#dang-ky'});
 }
 const error=(key:string)=>errors[key]?<small id={`education-${key}-error`} className="education-error" role="alert">{errors[key]}</small>:null;
 return <section className="section education-form-section" id="dang-ky" tabIndex={-1}><div className="container education-form-layout"><div><h2>Tư vấn hoặc nộp hồ sơ</h2><p>Chọn tư vấn nếu bạn muốn tìm hiểu thêm, hoặc chọn hồ sơ để trải nghiệm bước đăng ký.</p><p className="education-note">Chỉ dùng dữ liệu giả. Thông tin được giữ tạm trong bộ nhớ trang để xem ở ADMIN, không gửi ra ngoài. Không tải giấy tờ thật.</p></div><div className="education-form-card"><div className="education-form-tabs" aria-label="Mục đích đăng ký"><button type="button" aria-pressed={type==='F05'} onClick={()=>choose('F05')}>Tư vấn tuyển sinh</button><button type="button" aria-pressed={type==='F06'} onClick={()=>choose('F06')}>Hồ sơ đăng ký</button></div>{receipt?<div className="education-success" role="status"><h3 ref={receiptRef} tabIndex={-1}><span>Hoàn tất mô phỏng</span> {type}</h3><p>Mã mô phỏng: <strong>{receipt}</strong></p><p>Dữ liệu mẫu chỉ giữ trong bộ nhớ phiên trang; không gửi ra ngoài. Không dùng thông tin thật.</p><Link to={`/admin-demo?type=${type}&id=${receipt}`} className="btn">Xem quản trị minh họa</Link><button type="button" className="education-again" onClick={()=>{setReceipt('');submitted.current=false}}>Thử lại biểu mẫu</button></div>:<form ref={formRef} onSubmit={submit} noValidate><h3>{type==='F05'?'Đăng ký tư vấn tuyển sinh':'Hồ sơ đăng ký tuyển sinh'}</h3><label>Họ và tên <span>*</span><input name="name" required autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name?'education-name-error':undefined}/>{error('name')}</label><label>Số điện thoại <span>*</span><input name="phone" required type="tel" inputMode="tel" autoComplete="tel" aria-invalid={!!errors.phone} aria-describedby={errors.phone?'education-phone-error':undefined}/>{error('phone')}</label>{type==='F06'&&<label>Email (không bắt buộc)<input name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email?'education-email-error':undefined}/>{error('email')}</label>}<label>Chương trình quan tâm <select name="program" value={selectedProgram} onChange={e=>setSelectedProgram(e.currentTarget.value)}><option value="">Chưa chọn</option><option value="other">Khác / Chưa rõ</option>{educationPrograms.map(p=><option key={p.slug} value={p.slug}>{p.title} · {p.mode} (minh họa)</option>)}</select></label>{type==='F05'?<label>Nội dung cần tư vấn<textarea name="question" rows={3}/></label>:<><label>Tệp hồ sơ minh họa (không bắt buộc)<input name="document" type="file" multiple accept={FILE_ACCEPT} onChange={event=>{const message=validateDemoFiles(Array.from(event.currentTarget.files||[]));setErrors(previous=>{const next={...previous};if(message)next.document=message;else delete next.document;return next})}} aria-invalid={!!errors.document} aria-describedby={errors.document?'education-file-help education-document-error':'education-file-help'}/></label><small id="education-file-help">Tối đa 3 tệp JPG, JPEG, PNG, PDF, DOC hoặc DOCX; 5 MB/tệp, tổng 15 MB. Tệp không được tải lên.</small>{error('document')}</>}<button className="btn" type="submit">{type==='F05'?'Mô phỏng gửi tư vấn':'Mô phỏng gửi hồ sơ'}</button></form>}</div></div></section>;
}
export function EducationPage() {
  return <div className="education-pages">
    <PageMasthead eyebrow="Tuyển sinh" title="Tuyển sinh cao đẳng & đại học" description="Tìm hiểu hình thức học từ xa hoặc chính quy và chọn chương trình bạn muốn trao đổi." image={learningSpace} imageAlt={learningAlt} imageCaption={learningAlt}>
      <a href="#programs" className="btn">Xem chương trình</a>
      <Link to="?form=F05#dang-ky" className="education-link">Tư vấn tuyển sinh</Link>
    </PageMasthead>
    <ProgramDirectory/><EducationForm/>
  </div>;
}

export function EducationDetailPage() {
  const {slug} = useParams();
  const program = educationPrograms.find(item => item.slug === slug);
  if (!program) return <PageMasthead title="Không tìm thấy chương trình" eyebrow="404"><Link className="btn" to="/education">Xem tuyển sinh</Link></PageMasthead>;
  const questions = program.mode === 'Từ xa'
    ? ['Học trực tuyến vào khung giờ nào?', 'Thi trực tuyến hay tại điểm thi?']
    : ['Lịch học tại lớp được sắp xếp thế nào?', 'Điều kiện thực hành của chương trình là gì?'];
  return <div className="education-pages">
    <PageMasthead eyebrow={program.mode} title={program.title} description={program.description} image={program.mode === 'Chính quy' ? learningSpace : undefined} imageAlt={learningAlt} imageCaption={learningAlt}>
      <Link to="?form=F05#dang-ky" className="btn">Tư vấn tuyển sinh</Link>
      <Link to="?form=F06#dang-ky" className="education-link">Nộp hồ sơ tuyển sinh</Link>
    </PageMasthead>
    <section className="section container education-program-detail">
      <div><h2>Thông tin cần xác nhận</h2><p>{program.detail}</p><p>Đây là chương trình giả định, không gắn với trường cụ thể. Vui lòng xác nhận thông tin tuyển sinh trước khi đưa ra quyết định.</p>
        <Link to="/education#programs" className="education-link">Xem tất cả chương trình</Link></div>
      <RevealFrame><ul>{[...questions, 'Điều kiện tuyển sinh, học phí và văn bằng do đơn vị nào xác nhận?'].map(question => <li key={question}>{question}</li>)}</ul></RevealFrame>
    </section>
    <EducationForm key={program.slug} program={program.slug}/>
  </div>;
}
