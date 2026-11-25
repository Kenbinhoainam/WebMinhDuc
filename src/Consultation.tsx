import {useEffect, useRef, useState, type FormEvent} from 'react';
import {CalendarDays, CheckCircle2} from 'lucide-react';
import {Link} from 'react-router-dom';
import {ContactForm} from './Contact';
import {languageTags, useLocale} from './i18n';
import {PageMasthead} from './PageMasthead';
import './Consultation.css';

const times = ['09:00', '10:30', '14:00', '15:30'];
type Stage = 'choose' | 'details' | 'edit' | 'complete';
type SelectionError = 'date' | 'time' | '';

function localToday() {
  const now = new Date();
  return [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
}
function readDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null;
}

export default function ConsultationPage() {
  const locale = useLocale();
  const [stage, setStage] = useState<Stage>('choose');
  const [date, setDate] = useState(''), [time, setTime] = useState('');
  const [today, setToday] = useState(''), [error, setError] = useState<SelectionError>('');
  const [receipt, setReceipt] = useState('');
  const dateInput = useRef<HTMLInputElement>(null), timeInput = useRef<HTMLInputElement>(null);
  const detailsHeading = useRef<HTMLHeadingElement>(null), receiptHeading = useRef<HTMLHeadingElement>(null);
  const previousStage = useRef(stage);

  useEffect(() => setToday(localToday()), []);
  useEffect(() => {
    if (stage === 'complete') receiptHeading.current?.focus();
    else if (stage === 'details') detailsHeading.current?.focus();
    else if (previousStage.current !== stage) dateInput.current?.focus();
    previousStage.current = stage;
  }, [stage]);

  const localDate = readDate(date);
  const displayDate = localDate && new Intl.DateTimeFormat(languageTags[locale], {day:'numeric',month:'long',year:'numeric'}).format(localDate);

  function validateSelection() {
    const now = localToday();
    setToday(now);
    const issue: SelectionError = !localDate || date < now ? 'date' : !times.includes(time) ? 'time' : '';
    setError(issue);
    if (issue) {
      if (stage === 'details') setStage('edit');
      requestAnimationFrame(() => (issue === 'date' ? dateInput : timeInput).current?.focus());
      return false;
    }
    return true;
  }
  function continueToContact(event: FormEvent) {
    event.preventDefault();
    if (validateSelection()) setStage('details');
  }
  function restart() {
    setDate(''); setTime(''); setReceipt(''); setError(''); setToday(localToday()); setStage('choose');
  }

  return <div className="consultation-page">
    <PageMasthead title="Chọn giờ tư vấn" description="Thử chọn thời gian trao đổi bằng dữ liệu mẫu. Trang này không tạo lịch hẹn."/>
    <div className="container consultation-layout">
      <ol className="consultation-progress" aria-label="Chọn giờ tư vấn">
        <li aria-current={stage === 'choose' || stage === 'edit' ? 'step' : undefined}>Chọn ngày và giờ</li>
        <li aria-current={stage === 'details' ? 'step' : undefined}>Thông tin liên hệ</li>
      </ol>
      <div className="consultation-card">
      {stage === 'complete' ? <div className="consultation-success" role="status">
        <CheckCircle2 size={36} aria-hidden="true"/><h2 ref={receiptHeading} tabIndex={-1}>Đã hoàn tất trải nghiệm</h2>
        <p>Thời gian đã chọn: <strong>{displayDate} · {time}</strong></p>
        <p>Mã mô phỏng: <strong>{receipt}</strong></p>
        <p>Không có lịch hẹn thực tế nào được tạo. Biên nhận mẫu được giữ đến khi tải lại trang.</p>
        <button type="button" className="btn btn-secondary" onClick={restart}>Chọn thời gian khác</button>
      </div> : <>
        {stage !== 'details' && <form noValidate className="consultation-choose" onSubmit={continueToContact}>
          <h2>Chọn ngày và giờ</h2>
          <label htmlFor="consultation-date">Ngày tư vấn</label>
          <input id="consultation-date" ref={dateInput} className="consultation-date" type="date" min={today} value={date}
            onChange={e => {setDate(e.target.value); setError('');}} aria-invalid={error === 'date'}
            aria-describedby={error === 'date' ? 'consultation-error' : undefined}/>
          <fieldset aria-invalid={error === 'time'} aria-describedby={error === 'time' ? 'consultation-error' : undefined}>
            <legend>Giờ tư vấn</legend>
            <div className="consultation-times">{times.map((slot, index) => <label key={slot}>
              <input ref={index === 0 ? timeInput : undefined} type="radio" name="consultation-time" value={slot}
                checked={time === slot} onChange={() => {setTime(slot); setError('');}}/>
              <span>{slot}</span>
            </label>)}</div>
          </fieldset>
          {error && <p id="consultation-error" className="consultation-error" role="alert">{error === 'date' ?
            'Vui lòng chọn ngày hôm nay hoặc một ngày trong tương lai.' : 'Vui lòng chọn giờ tư vấn.'}</p>}
          <button className="btn" type="submit">Tiếp tục</button>
        </form>}
        {(stage === 'details' || stage === 'edit') && <div className="consultation-details" hidden={stage === 'edit'}>
          <h2 ref={detailsHeading} tabIndex={-1}>Hoàn tất yêu cầu tư vấn</h2>
          <div className="consultation-summary">
            <p><CalendarDays size={20} aria-hidden="true"/><span>Thời gian đã chọn: <strong>{displayDate} · {time}</strong></span></p>
            <button className="text-link" type="button" onClick={() => {setToday(localToday()); setStage('edit');}}>Đổi thời gian</button>
          </div>
          <ContactForm initialMode="F02" lockMode beforeSubmit={() => stage === 'details' && validateSelection()}
            onComplete={id => {setReceipt(id); setStage('complete');}}/>
        </div>}
      </>}
    </div><Link className="consultation-back" to="/contact">Xem thông tin liên hệ</Link></div>
  </div>;
}
