import {useEffect,useRef,useState} from 'react';
import {ArrowRight, CheckCircle2} from 'lucide-react';
import {Link} from 'react-router-dom';
import {ContactForm} from './Contact';
import {languageTags,useLocale,useTranslation} from './i18n';
import './Consultation.css';

const TIMES=['09:00','10:30','14:00','15:30'];
function localToday(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function validDate(date:string){if(!/^\d{4}-\d{2}-\d{2}$/.test(date))return false;const [y,m,d]=date.split('-').map(Number);const x=new Date(y,m-1,d);return x.getFullYear()===y&&x.getMonth()===m-1&&x.getDate()===d&&date>=localToday()}

/** Local demonstration only: no appointment is booked or submitted. */
export default function ConsultationPage(){
 const locale=useLocale(),t=useTranslation(),[receipt,setReceipt]=useState(''),[date,setDate]=useState(''),[time,setTime]=useState(''),[stage,setStage]=useState<'choose'|'details'|'complete'>('choose'),[error,setError]=useState(''),[today,setToday]=useState('');
 const heading=useRef<HTMLHeadingElement>(null),detailsHeading=useRef<HTMLHeadingElement>(null),dateInput=useRef<HTMLInputElement>(null),previousStage=useRef(stage);
 useEffect(()=>setToday(localToday()),[]);
 useEffect(()=>{if(stage==='complete')heading.current?.focus();else if(stage==='details')detailsHeading.current?.focus();else if(previousStage.current==='complete')dateInput.current?.focus();previousStage.current=stage},[stage]);
 const validate=()=>{if(!validDate(date)){setError('Vui lòng chọn ngày hôm nay hoặc một ngày trong tương lai.');return false}if(!TIMES.includes(time)){setError('Vui lòng chọn giờ tư vấn.');return false}setError('');return true};
 const updateDate=(value:string)=>{setDate(value);setError('');setStage('choose')};
 const updateTime=(value:string)=>{setTime(value);setError('');setStage('choose')};
 const displayDate=validDate(date) ? new Intl.DateTimeFormat(languageTags[locale],{day:'numeric',month:'long',year:'numeric'}).format(new Date(...date.split('-').map((v,i)=>Number(v)-(i===1?1:0)) as [number,number,number])) : '';
 return <><section className="section consultation-page"><div className="container consultation-layout"><div><span className="eyebrow">KẾT NỐI CÙNG MINH ĐỨC</span><h1>Đặt lịch tư vấn</h1><h2>Chọn thời gian để bắt đầu</h2><p>Chọn ngày và giờ bạn muốn trao đổi, sau đó điền thông tin liên hệ.</p><p className="consultation-note">{t({vi:'Đây là bản mô phỏng: không đặt lịch thật. Chỉ dùng dữ liệu giả; dữ liệu giữ tạm trong phiên trang và không gửi ra ngoài.',en:'This is a demo, not a real booking. Use sample data only; it remains in this page session and is not sent.',zh:'这是模拟演示，不会创建实际预约。请仅使用示例数据；数据仅暂存当前页面会话，不会发送。',ko:'실제 예약이 아닌 데모입니다. 예시 데이터만 사용하세요. 데이터는 페이지 세션에 임시 보관되며 전송되지 않습니다.',ja:'実際の予約ではなくデモです。サンプルデータのみを使用してください。データはページのセッション中にのみ保持され、送信されません。'})}</p><Link className="text-link" to="/contact">Xem thông tin liên hệ <ArrowRight size={16}/></Link></div><div className="consultation-card">
  {stage==='complete'?<div className="consultation-success" role="status"><CheckCircle2 size={44}/><h2 ref={heading} tabIndex={-1}>Đã hoàn tất trải nghiệm</h2><p>Thời gian đã chọn: <strong>{displayDate} · {time}</strong></p><p>{t({vi:'Không có lịch hẹn thực tế nào được tạo. Dữ liệu mẫu chỉ giữ tạm trong phiên trang, không gửi ra ngoài.',en:'No real appointment was created. Sample data is held only for this page session and is not sent.',zh:'未创建实际预约。示例数据仅暂存于当前页面会话，不会发送。',ko:'실제 예약은 생성되지 않았습니다. 예시 데이터는 페이지 세션에만 임시 보관되며 전송되지 않습니다.',ja:'実際の予約は作成されていません。サンプルデータはページのセッション中のみ保持され、送信されません。'})}</p><p>{t({vi:'Mã mô phỏng',en:'Demo reference',zh:'模拟编号',ko:'예시 번호',ja:'デモ番号'})}: <strong>{receipt}</strong></p><button type="button" className="btn btn-secondary" onClick={()=>{setDate('');setTime('');setReceipt('');setStage('choose')}}>Chọn thời gian khác</button></div>:<>
   <h2>Chọn ngày và giờ</h2><label htmlFor="consultation-date">Ngày tư vấn</label><input ref={dateInput} id="consultation-date" className="consultation-date" type="date" min={today} value={date} onChange={event=>updateDate(event.target.value)} aria-invalid={!!error&&!validDate(date)} aria-describedby={error?'consultation-error':undefined}/>
   <fieldset aria-describedby={error?'consultation-error':undefined}><legend>Giờ tư vấn</legend><div className="consultation-times">{TIMES.map(value=><label key={value}><input type="radio" name="consultation-time" value={value} checked={time===value} onChange={()=>updateTime(value)}/><span>{value}</span></label>)}</div></fieldset>
   {error&&<p id="consultation-error" className="consultation-error" role="alert">{error}</p>}
   {stage==='choose'?<button type="button" className="btn" onClick={()=>{if(validate())setStage('details')}}>Tiếp tục <ArrowRight size={18}/></button>:<div className="consultation-details"><h3 ref={detailsHeading} tabIndex={-1}>Thông tin liên hệ</h3><p>Thời gian đã chọn: <strong>{displayDate} · {time}</strong></p><ContactForm initialMode="F02" onComplete={id=>{if(validate()){setReceipt(id);setStage('complete')}}}/></div>}
  </>}
 </div></div></section></>;
}
