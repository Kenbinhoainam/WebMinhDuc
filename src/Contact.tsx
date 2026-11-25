import {useEffect, useId, useRef, useState, type FormEvent} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {CalendarDays, CheckCircle2, Mail, MapPin, MessageCircle, Phone} from 'lucide-react';
import {company} from './company';
import {createDemoSubmission} from './demo-submissions';
import {validDemoPhone, validOptionalEmail} from './sharedformvalidation';
import {useTranslation} from './i18n';
import {PageMasthead} from './PageMasthead';
import {responsiveImage} from './media';
import {RevealFrame} from './motion';
import './form-experience-v16.css';
import './contact-sprint.css';
import './contact-reference.css';

type Mode = 'F01' | 'F02';
type Fields = Record<string, string>;
type FormProps = {
  initialService?: string;
  initialMode?: Mode;
  mode?: Mode;
  lockMode?: boolean;
  businessEntryKey?: string;
  source?: string;
  beforeSubmit?: () => boolean;
  onComplete?: (receiptId: string) => void;
  onNavigate?: () => void;
};

const services = [
  'Giới thiệu & cung ứng nhân lực', 'Cho thuê lao động', 'Headhunt & lao động tay nghề',
  'Tuyển sinh cao đẳng', 'Setup tổ chức & phần mềm doanh nghiệp',
];
const businessFields = ['company', 'email', 'location', 'jobrole', 'quantity', 'shift', 'needdate', 'service', 'notes'];

function ModeSelector({mode, choose}: {mode: Mode; choose: (value: Mode) => void}) {
  return <div className="form-mode" role="group" aria-label="Loại yêu cầu">
    <button type="button" aria-pressed={mode === 'F01'} onClick={() => choose('F01')}>Gửi nhu cầu nhân lực</button>
    <button type="button" aria-pressed={mode === 'F02'} onClick={() => choose('F02')}>Liên hệ chung</button>
  </div>;
}

export function ContactForm({initialMode = 'F01', mode: selectedMode, lockMode, businessEntryKey, ...props}: FormProps) {
  const [selection, setSelection] = useState({mode: initialMode, entryKey: businessEntryKey});
  const drafts = useRef<Record<Mode, Fields>>({F01: {}, F02: {}});
  if (businessEntryKey && businessEntryKey !== selection.entryKey) {
    // Restore the F01 draft only for an explicit workforce CTA, including a repeated visit after a receipt.
    setSelection({mode: 'F01', entryKey: businessEntryKey});
  }
  const mode = selectedMode ?? selection.mode;
  const fields = <ContactFields key={mode + ':' + (selection.entryKey ?? '')} {...props} mode={mode} draft={drafts.current[mode]}/>;
  if (lockMode || selectedMode !== undefined) return fields;
  return <div className="contact-form-switchable">
    <ModeSelector mode={mode} choose={next => setSelection(current => ({...current, mode: next}))}/>
    {fields}
  </div>;
}

function ContactFields({mode, draft, initialService, source, onComplete, onNavigate, beforeSubmit}:
  FormProps & {mode: Mode; draft: Fields}) {
  const id = useId(), location = useLocation();
  const form = useRef<HTMLFormElement>(null), receiptHeading = useRef<HTMLHeadingElement>(null);
  const submitted = useRef(false), restarting = useRef(false);
  const [errors, setErrors] = useState<Fields>({});
  const [receipt, setReceipt] = useState('');
  const service = initialService?.startsWith('Tuyển sinh cao đẳng') ? services[3] : services.find(item => item === initialService) ?? services[0];

  useEffect(() => {
    if (receipt) receiptHeading.current?.focus();
    else if (restarting.current) {
      form.current?.querySelector<HTMLInputElement>('[name=name]')?.focus();
      restarting.current = false;
    }
  }, [receipt]);

  function remember(event: FormEvent<HTMLFormElement>) {
    const field = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    if (field.name) draft[field.name] = field.value;
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitted.current || (beforeSubmit && !beforeSubmit())) return;
    const data = new FormData(event.currentTarget);
    const value = (name: string) => String(data.get(name) ?? '');
    const invalid: Fields = {};
    if (!value('name').trim()) invalid.name = 'Vui lòng nhập họ tên.';
    if (!value('phone').trim()) invalid.phone = 'Vui lòng nhập số điện thoại.';
    else if (!validDemoPhone(value('phone'))) invalid.phone = 'Vui lòng nhập số điện thoại Việt Nam hợp lệ.';
    if (!validOptionalEmail(value('email'))) invalid.email = 'Email chưa đúng định dạng.';
    if (mode === 'F01') {
      if (!value('location').trim()) invalid.location = 'Vui lòng nhập địa điểm.';
      if (!value('notes').trim()) invalid.notes = 'Vui lòng nhập ghi chú.';
      const quantity = value('quantity').trim();
      if (quantity && (!Number.isInteger(Number(quantity)) || Number(quantity) < 1)) invalid.quantity = 'Vui lòng nhập số lượng từ 1 trở lên.';
    }
    setErrors(invalid);
    if (Object.keys(invalid).length) {
      requestAnimationFrame(() => form.current?.querySelector<HTMLElement>('[aria-invalid=true]')?.focus());
      return;
    }
    submitted.current = true;
    const record = createDemoSubmission({
      type: mode, name: value('name'), phone: value('phone'), source: source || location.pathname,
      detail: value(mode === 'F01' ? 'notes' : 'message'),
      fields: Object.fromEntries((mode === 'F01' ? businessFields : ['email', 'message']).map(name => [name, value(name)])),
    });
    for (const key of Object.keys(draft)) delete draft[key];
    setReceipt(record.id);
    onComplete?.(record.id);
  }

  function field(name: string, label: string, type = 'text', required = false, autoComplete?: string) {
    const errorId = errors[name] ? id + '-' + name + '-error' : undefined;
    return <label className={type === 'textarea' ? 'full-field' : undefined}>
      {label} {required && <span aria-hidden="true">*</span>}
      {type === 'textarea' ? <textarea name={name} rows={4} defaultValue={draft[name]} required={required}
        aria-invalid={!!errors[name]} aria-describedby={errorId}/> :
        <input name={name} type={type} defaultValue={draft[name]} required={required} autoComplete={autoComplete}
          min={type === 'number' ? 1 : undefined} aria-invalid={!!errors[name]} aria-describedby={errorId}/>}
      {errors[name] && <small id={errorId} className="field-error">{errors[name]}</small>}
    </label>;
  }

  if (receipt) return <div className="form-success" role="status">
    <CheckCircle2 size={36} aria-hidden="true"/><h3 ref={receiptHeading} tabIndex={-1}>Đã hoàn tất gửi thử</h3>
    <p>Mã mô phỏng: <strong>{receipt}</strong></p>
    <p>Biên nhận mẫu được giữ đến khi tải lại trang; thông tin không gửi ra ngoài.</p>
    <Link className="btn" to={'/admin-demo?type=' + mode + '&id=' + receipt} onClick={onNavigate}>Xem hồ sơ mẫu {mode}</Link>
    <button type="button" className="text-link" onClick={() => {restarting.current = true; submitted.current = false; setReceipt('');}}>Tạo yêu cầu thử mới</button>
  </div>;

  return <form ref={form} className="contact-form" noValidate onSubmit={submit} onInput={remember} onChange={remember}>
    <p className="form-disclaimer">Chỉ nhập dữ liệu mẫu. Biểu mẫu tạo biên nhận trong phiên này và không gửi thông tin ra ngoài.</p>
    <fieldset className="contact-fieldset"><legend>Thông tin liên hệ</legend>
      <div className="form-grid">
        {field('name', 'Người liên hệ', 'text', true, 'name')}
        {field('phone', 'Số điện thoại', 'tel', true, 'tel')}
        {field('email', 'Email', 'email', false, 'email')}
        {mode === 'F01' && field('company', 'Doanh nghiệp', 'text', false, 'organization')}
        {mode === 'F02' && field('message', 'Nội dung liên hệ', 'textarea')}
      </div>
    </fieldset>
    {mode === 'F01' && <fieldset className="contact-fieldset"><legend>Nhu cầu nhân lực</legend>
      <div className="form-grid">
        {field('location', 'Địa điểm làm việc', 'text', true)}
        {field('jobrole', 'Vị trí cần tuyển')}
        {field('quantity', 'Số lượng', 'number')}
        <label>Ca làm việc<select name="shift" defaultValue={draft.shift ?? ''}><option value="">Chọn ca</option>
          {['Ngày','Đêm','Xoay ca','Khác'].map(shift => <option key={shift} value={shift}>{shift}</option>)}</select></label>
        {field('needdate', 'Ngày cần người', 'date')}
        <label>Dịch vụ quan tâm<select name="service" defaultValue={draft.service ?? service}>
          {services.map(item => <option key={item} value={item}>{item === 'Tuyển sinh cao đẳng' ? 'Tuyển sinh cao đẳng & đại học' : item}</option>)}
        </select></label>
        {field('notes', 'Ghi chú', 'textarea', true)}
      </div>
    </fieldset>}
    <button className="btn" type="submit">{mode === 'F01' ? 'Gửi nhu cầu nhân lực' : 'Gửi câu hỏi'}</button>
  </form>;
}

export function ContactPage() {
  const t = useTranslation();
  const [mode, setMode] = useState<Mode>('F02');
  const formTitle = useRef<HTMLHeadingElement>(null);
  function choose(value: Mode) {
    setMode(value);
    requestAnimationFrame(() => formTitle.current?.focus());
  }
  return <div className="contact-page-v18">
    <PageMasthead title="Liên hệ Minh Đức" description="Trao đổi về nhu cầu tuyển người, đặt câu hỏi hoặc tìm đường đến Minh Đức.">
      <ModeSelector mode={mode} choose={choose}/>
      <div className="contact-quick-links">
        <a className="contact-hotline" href={'tel:' + company.tel}><Phone size={18} aria-hidden="true"/><span>Hotline</span> <strong>{company.phone}</strong></a>
        <a className="contact-directory-link" href="#contact-offices"><MapPin size={18} aria-hidden="true"/>Tìm điểm liên hệ</a>
      </div>
    </PageMasthead>
    <div className="container contact-reference-layout">
      <section id="consultation" tabIndex={-1} className="contact-reference-form" aria-labelledby="contact-form-heading">
        <h2 id="contact-form-heading" ref={formTitle} tabIndex={-1}>{mode === 'F01' ? 'Nhu cầu nhân lực' : 'Liên hệ chung'}</h2>
        <ContactForm mode={mode} lockMode/>
      </section>
      <aside className="contact-reference-info">
        <div className="contact-team">
          <div><h2>Trao đổi trực tiếp</h2><p>CÔNG TY TNHH NHÂN LỰC MINH ĐỨC VINA</p></div>
          <img {...responsiveImage('/assets/minhduc-v18/contact-team.webp', '(max-width:767px) 96px, 112px')}
            alt="Năm người đứng trước biển hiệu Minh Đức Vina, người ở giữa cầm bó hoa." loading="lazy" decoding="async"/>
        </div>
        <Link className="contact-method" to="/consultation"><CalendarDays aria-hidden="true"/>Chọn giờ tư vấn</Link>
        <a className="contact-method" href={company.zalo} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true"/>Zalo Minh Đức</a>
        <a className="contact-method" href={company.facebook} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true"/>Facebook Minh Đức</a>
        <a className="contact-method" href={'mailto:' + company.email}><Mail aria-hidden="true"/>{company.email}</a>
      </aside>
    </div>
    <section id="contact-offices" tabIndex={-1} className="contact-directory" aria-labelledby="contact-offices-heading">
      <div className="container contact-directory-inner">
        <RevealFrame effect="up"><h2 id="contact-offices-heading">Tìm điểm liên hệ</h2></RevealFrame>
        <div>{company.offices.map((office, index) => <details key={office.name} className="contact-office" open={index === 0}>
          <summary><MapPin size={20} aria-hidden="true"/>{office.name}</summary>
          <div><p>{office.address}</p><a href={office.map} target="_blank" rel="noreferrer">{t({
            vi:'Chỉ đường đến ' + office.name, en:'Directions to ' + office.name, zh:'前往' + office.name + '的路线',
            ko:office.name + ' 오시는 길', ja:office.name + 'への経路',
          })}</a></div>
        </details>)}</div>
      </div>
    </section>
  </div>;
}
