import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { PageMasthead } from './PageMasthead';
import { learningSpace, learningAlt } from './pages/info/data';
import { RevealFrame } from './motion';
import {useTranslation} from './i18n';
import './education.css';
import { createDemoSubmission } from './demo-submissions';
import { FILE_ACCEPT,validateDemoFiles,validDemoPhone,validOptionalEmail, type FileSummary } from './sharedformvalidation';
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
type EducationMode = 'F05' | 'F06';
type EducationDraft = {fields: Record<string, string>; files: FileSummary[]};

function EducationForm({program}: {program?: string}) {
  const location = useLocation();
  const navigate = useNavigate();
  const type = new URLSearchParams(location.search).get('form') === 'F06' ? 'F06' : 'F05';
  const queryMode = (next: EducationMode) => {
    if (next === type) return;
    const query = new URLSearchParams(location.search);
    query.set('form', next);
    navigate({pathname: location.pathname, search: query.toString(), hash:'#dang-ky'});
  };
  const drafts = useRef<Record<EducationMode, EducationDraft>>({
    F05:{fields:{program:program ?? ''}, files:[]}, F06:{fields:{program:program ?? ''}, files:[]},
  });
  return <section className="section education-form-section" id="dang-ky" tabIndex={-1}><div className="container education-form-layout">
    <div><h2>Tư vấn hoặc nộp hồ sơ</h2><p>Chọn tư vấn nếu bạn muốn tìm hiểu thêm, hoặc chọn hồ sơ để trải nghiệm bước đăng ký.</p>
      <p className="education-note">Chỉ dùng dữ liệu giả. Thông tin được giữ tạm trong bộ nhớ trang để xem ở ADMIN, không gửi ra ngoài. Không tải giấy tờ thật.</p></div>
    <div className="education-form-card">
      <div className="education-form-tabs" role="group" aria-label="Mục đích đăng ký">
        <button type="button" aria-pressed={type === 'F05'} onClick={() => queryMode('F05')}>Tư vấn tuyển sinh</button>
        <button type="button" aria-pressed={type === 'F06'} onClick={() => queryMode('F06')}>Hồ sơ đăng ký</button>
      </div>
      <EducationFields key={type} type={type} draft={drafts.current[type]} source={location.pathname}/>
    </div>
  </div></section>;
}

function EducationFields({type, draft, source}: {type: EducationMode; draft: EducationDraft; source: string}) {
  const t = useTranslation();
  const submitted = useRef(false), attempted = useRef(false), restarting = useRef(false);
  const [receipt,setReceipt] = useState('');
  const [errors,setErrors] = useState<Record<string,string>>({});
  const [files,setFiles] = useState(draft.files);
  const formRef = useRef<HTMLFormElement>(null), fileRef = useRef<HTMLInputElement>(null), receiptRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (receipt) receiptRef.current?.focus();
    else if (restarting.current) {
      formRef.current?.querySelector<HTMLInputElement>('[name=name]')?.focus();
      restarting.current = false;
    }
  },[receipt]);

  function validate(name: string, value: string) {
    if (name === 'name' && !value.trim()) return 'Vui lòng nhập họ tên.';
    if (name === 'phone' && !validDemoPhone(value)) return 'Vui lòng nhập số điện thoại Việt Nam hợp lệ.';
    if (name === 'email' && !validOptionalEmail(value)) return 'Email chưa đúng định dạng.';
    return '';
  }
  function setFieldError(name: string, message: string) {
    setErrors(previous => {
      if (message) return {...previous,[name]:message};
      const next = {...previous};
      delete next[name];
      return next;
    });
  }
  function remember(event: FormEvent<HTMLFormElement>) {
    const target = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    if (!target.name || target.name === 'document') return;
    draft.fields[target.name] = target.value;
    if (attempted.current) setFieldError(target.name,validate(target.name,target.value));
  }
  function updateFiles(next: FileSummary[]) {
    draft.files = next;
    setFiles(next);
    setFieldError('document',validateDemoFiles(next));
  }
  function selectFiles(input: HTMLInputElement) {
    const next = Array.from(input.files ?? [], ({name,size,type}) => ({name,size,type}));
    if (next.length) updateFiles(next);
    input.value = '';
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitted.current) return;
    attempted.current = true;
    const data = new FormData(event.currentTarget);
    const value = (name: string) => String(data.get(name) ?? '');
    const required = type === 'F06' ? ['name','phone','email'] : ['name','phone'];
    const next: Record<string,string> = {};
    for (const name of required) {
      const message = validate(name,value(name));
      if (message) next[name] = message;
    }
    if (type === 'F06') {
      const pending = Array.from(fileRef.current?.files ?? []);
      const message = validateDemoFiles(pending.length ? pending : files);
      if (message) next.document = message;
    }
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) {
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus());
      return;
    }
    submitted.current = true;
    const program = value('program');
    const record = createDemoSubmission({type,name:value('name'),phone:value('phone'),source,linkId:program || undefined,
      fields:{program,email:type === 'F06' ? value('email') : '',question:type === 'F05' ? value('question') : ''}});
    draft.fields = {program};
    draft.files = [];
    setFiles([]);
    setReceipt(record.id);
  }
  function fieldError(name: string) {
    return errors[name] && <small id={'education-' + name + '-error'} className="education-error" role="alert">{errors[name]}</small>;
  }
  function invalid(name: string) {
    return {'aria-invalid':!!errors[name], 'aria-describedby':errors[name] ? 'education-' + name + '-error' : undefined};
  }
  if (receipt) return <div className="education-success" role="status">
    <h3 ref={receiptRef} tabIndex={-1}><span>Hoàn tất mô phỏng</span> {type}</h3>
    <p>Mã mô phỏng: <strong>{receipt}</strong></p>
    <p>Dữ liệu mẫu chỉ giữ trong bộ nhớ phiên trang; không gửi ra ngoài. Không dùng thông tin thật.</p>
    <Link to={`/admin-demo?type=${type}&id=${receipt}`} className="btn">Xem quản trị minh họa</Link>
    <button type="button" className="education-again" onClick={() => {
      submitted.current = false; attempted.current = false; restarting.current = true; setReceipt(''); setErrors({});
    }}>Thử lại biểu mẫu</button>
  </div>;

  const removeLabel = t({vi:'Xóa tệp',en:'Remove file',zh:'移除文件',ko:'파일 제거',ja:'ファイルを削除'});
  return <form ref={formRef} onSubmit={submit} onInput={remember} onChange={remember} noValidate>
    <h3>{type === 'F05' ? 'Đăng ký tư vấn tuyển sinh' : 'Hồ sơ đăng ký tuyển sinh'}</h3>
    <label>Họ và tên <span aria-hidden="true">*</span><input name="name" defaultValue={draft.fields.name} required autoComplete="name" {...invalid('name')}/>{fieldError('name')}</label>
    <label>Số điện thoại <span aria-hidden="true">*</span><input name="phone" defaultValue={draft.fields.phone} required type="tel" inputMode="tel" autoComplete="tel" {...invalid('phone')}/>{fieldError('phone')}</label>
    {type === 'F06' && <label>Email (không bắt buộc)<input name="email" defaultValue={draft.fields.email} type="email" autoComplete="email" {...invalid('email')}/>{fieldError('email')}</label>}
    <label>Chương trình quan tâm <select name="program" defaultValue={draft.fields.program}>
      <option value="">Chưa chọn</option><option value="other">Khác / Chưa rõ</option>
      {educationPrograms.map(item => <option key={item.slug} value={item.slug}>{item.title} · {item.mode} (minh họa)</option>)}
    </select></label>
    {type === 'F05' ? <label>Nội dung cần tư vấn<textarea name="question" rows={3} defaultValue={draft.fields.question}/></label> : <>
      <label>Tệp hồ sơ minh họa (không bắt buộc)
        <input ref={fileRef} name="document" type="file" multiple accept={FILE_ACCEPT} onChange={event => selectFiles(event.currentTarget)}
          aria-invalid={!!errors.document} aria-describedby={errors.document ? 'education-file-help education-document-error' : 'education-file-help'}/>
      </label>
      <small id="education-file-help">Tối đa 3 tệp JPG, JPEG, PNG, PDF, DOC hoặc DOCX; 5 MB/tệp, tổng 15 MB. Tệp không được tải lên.</small>
      {files.length > 0 && <ul className="education-files">{files.map((file,index) => <li key={index + ':' + file.name}>
        <span>{file.name}</span><button type="button" aria-label={removeLabel + ': ' + file.name} onClick={() => {
          updateFiles(files.filter((_,position) => position !== index));
          fileRef.current?.focus();
        }}>{removeLabel}</button>
      </li>)}</ul>}
      {fieldError('document')}
    </>}
    <button className="btn" type="submit">{type === 'F05' ? 'Mô phỏng gửi tư vấn' : 'Mô phỏng gửi hồ sơ'}</button>
  </form>;
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
