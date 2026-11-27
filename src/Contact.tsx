import {useEffect, useId, useRef, useState, type FormEvent} from 'react';
import {Link, useLocation, useSearchParams} from 'react-router-dom';
import {CalendarDays, CheckCircle2, Mail, MapPin, MessageCircle, Phone} from 'lucide-react';
import {company} from './company';
import {createDemoSubmission} from './demo-submissions';
import {validDemoPhone, validOptionalEmail} from './sharedformvalidation';
import {useLocale, useTranslation} from './i18n';
import {PageMasthead} from './PageMasthead';
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

function ModeSelector({mode, choose, generalFirst = false}: {mode: Mode; choose: (value: Mode) => void; generalFirst?: boolean}) {
  const modes: Mode[] = generalFirst ? ['F02', 'F01'] : ['F01', 'F02'];
  return <div className="form-mode" role="group" aria-label="Loại yêu cầu">
    {modes.map(value => <button key={value} type="button" data-contact-mode={value} aria-pressed={mode === value}
      onClick={() => choose(value)}>{value === 'F01' ? 'Gửi nhu cầu nhân lực' : 'Liên hệ chung'}</button>)}
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
  const t = useTranslation();
  const id = useId(), location = useLocation();
  const form = useRef<HTMLFormElement>(null), receiptHeading = useRef<HTMLHeadingElement>(null);
  const submitted = useRef(false), restarting = useRef(false);
  const [errors, setErrors] = useState<Fields>({});
  const [receipt, setReceipt] = useState('');
  const [receiptService, setReceiptService] = useState('');
  const optionalLabel = t({vi:'Tùy chọn',en:'Optional',zh:'选填',ko:'선택 사항',ja:'任意'});
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
    setReceiptService(mode === 'F01' ? value('service') : '');
    setReceipt(record.id);
    onComplete?.(record.id);
  }

  function field(name: string, label: string, type = 'text', required = false, autoComplete?: string) {
    const errorId = errors[name] ? id + '-' + name + '-error' : undefined;
    return <label className={type === 'textarea' ? 'full-field' : undefined}>
      {label} {required ? <span aria-hidden="true">*</span> : <span className="form-optional">({optionalLabel})</span>}
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
    <p className="form-context"><strong>{mode === 'F01' ? 'Gửi nhu cầu nhân lực' : 'Liên hệ chung'}</strong>{receiptService && <><br/>{receiptService}</>}</p>
    <p>Biên nhận mẫu được giữ đến khi tải lại trang; thông tin không gửi ra ngoài.</p>
    <Link className="btn" to={'/admin-demo?type=' + mode + '&id=' + receipt} onClick={onNavigate}>Xem hồ sơ mẫu {mode}</Link>
    <button type="button" className="text-link" onClick={() => {restarting.current = true; submitted.current = false; setErrors({}); setReceiptService(''); setReceipt('');}}>Tạo yêu cầu thử mới</button>
  </div>;

  return <form ref={form} className="contact-form" aria-describedby={id + '-requirements'} noValidate onSubmit={submit} onInput={remember} onChange={remember}>
    <p className="form-disclaimer">Chỉ nhập dữ liệu mẫu. Biểu mẫu tạo biên nhận trong phiên này và không gửi thông tin ra ngoài.</p>
    <p className="form-requirements" id={id + '-requirements'}>Các trường có dấu * là bắt buộc.</p>
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
        <label>Ca làm việc <span className="form-optional">({optionalLabel})</span><select name="shift" defaultValue={draft.shift ?? ''}><option value="">Chọn ca</option>
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

// Map CIDs resolved from the three Google Maps links supplied in company.ts, 26 November 2026.
// Keep the original directions links as a permanent fallback to the embedded map.
const officeMapIds = ['10667900336702973064', '16104762975771422561', '1203083160994188547'] as const;

export function ContactPage() {
  const t = useTranslation(), locale = useLocale();
  const [params, setParams] = useSearchParams();
  const mode: Mode = params.get('form') === 'F01' ? 'F01' : 'F02';
  const [officeIndex, setOfficeIndex] = useState(0);
  const formTitle = useRef<HTMLHeadingElement>(null);
  const office = company.offices[officeIndex];
  const mapTitle = t({vi:'Bản đồ ' + office.name, en:'Map of ' + office.name, zh:office.name + '地图', ko:office.name + ' 지도', ja:office.name + 'の地図'});
  const mapUrl = `https://maps.google.com/maps?cid=${officeMapIds[officeIndex]}&output=embed&hl=${locale === 'zh' ? 'zh-CN' : locale}`;

  function choose(value: Mode) {
    setParams(current => {const next = new URLSearchParams(current); next.set('form', value); return next;}, {preventScrollReset: true});
    requestAnimationFrame(() => formTitle.current?.focus());
  }
  function selectOffice(index: number) {setOfficeIndex(index);}

  return <div className="contact-page-v18 contact-page-reference">
    <PageMasthead title="Liên hệ Minh Đức" description="Chúng tôi luôn sẵn sàng lắng nghe và kết nối cùng bạn."/>
    <div className="contact-reference-surface"><div className="container contact-reference-layout">
      <section id="contact-offices" tabIndex={-1} className="contact-reference-info" aria-labelledby="contact-offices-heading">
        <p className="contact-company-kicker">CÔNG TY TNHH NHÂN LỰC</p>
        <h2 id="contact-offices-heading" className="contact-company-name">MINH ĐỨC <span>VINA</span></h2>
        <div className="contact-office-list">{company.offices.map((item, index) => <article className="contact-office" key={item.name}>
          <MapPin size={20} aria-hidden="true"/>
          <div><h3>{item.name}</h3><p>{item.address}</p>
            <div className="contact-office-actions">
              <a href="#contact-map" onClick={() => selectOffice(index)}>{t({vi:'Xem bản đồ', en:'View map', zh:'查看地图', ko:'지도 보기', ja:'地図を見る'})}</a>
              <a href={item.map} target="_blank" rel="noreferrer">{t({vi:'Chỉ đường',en:'Directions',zh:'路线',ko:'길찾기',ja:'経路'})}</a>
            </div>
          </div>
        </article>)}</div>
        <div className="contact-direct-links">
          <a className="contact-hotline" href={'tel:' + company.tel}><Phone size={20} aria-hidden="true"/><span><span>Hotline</span><strong>{company.phone}</strong></span></a>
          <a className="contact-email" href={'mailto:' + company.email}><Mail size={20} aria-hidden="true"/><span><span>Email</span><strong>{company.email}</strong></span></a>
        </div>
        <div className="contact-social-links">
          <a href={company.zalo} target="_blank" rel="noreferrer"><MessageCircle size={18} aria-hidden="true"/>Zalo Minh Đức</a>
          <a href={company.facebook} target="_blank" rel="noreferrer">Facebook Minh Đức</a>
          <Link to="/consultation"><CalendarDays size={18} aria-hidden="true"/>Chọn giờ tư vấn</Link>
        </div>
        <a className="contact-map-jump" href="#contact-map"><MapPin size={18} aria-hidden="true"/>Tìm điểm liên hệ</a>
      </section>
      <section id="consultation" tabIndex={-1} className="contact-reference-form" aria-labelledby="contact-form-heading">
        <h2 id="contact-form-heading" ref={formTitle} tabIndex={-1}>{mode === 'F01' ? 'Nhu cầu nhân lực' : 'Gửi lời nhắn đến Minh Đức'}</h2>
        <p className="contact-form-lead">Để lại thông tin và nội dung bạn quan tâm để bắt đầu cuộc trao đổi.</p>
        <ModeSelector mode={mode} choose={choose} generalFirst/>
        <ContactForm mode={mode} lockMode/>
        <Link className="contact-privacy-link" to="/privacy-policy">Chính sách bảo mật</Link>
      </section>
      <section id="contact-map" tabIndex={-1} className="contact-map" aria-labelledby="contact-map-heading">
        <div className="contact-map-heading"><h2 id="contact-map-heading">Tìm điểm liên hệ</h2>
          <div className="contact-map-tabs" role="group" aria-label={t({vi:'Chọn điểm liên hệ',en:'Choose an office',zh:'选择联系地点',ko:'연락처 선택',ja:'窓口を選ぶ'})}>
            {company.offices.map((item,index) => <button key={item.name} type="button" aria-pressed={officeIndex === index} onClick={() => selectOffice(index)}>{item.name}</button>)}
          </div>
        </div>
        <div className="contact-map-canvas">
          <iframe key={mapUrl} title={mapTitle} src={mapUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen/>
        </div>
        <div className="contact-map-caption"><div><strong>{office.name}</strong><p>{office.address}</p></div>
          <a href={office.map} target="_blank" rel="noreferrer">{t({vi:'Mở chỉ đường',en:'Open directions',zh:'打开路线',ko:'길찾기 열기',ja:'経路を開く'})}</a>
          <p className="contact-map-fallback">Nếu bản đồ không hiển thị, hãy mở chỉ đường trong Google Maps.</p>
        </div>
      </section>
    </div></div>
  </div>;
}
