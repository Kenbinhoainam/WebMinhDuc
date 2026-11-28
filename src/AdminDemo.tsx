import {useRef, useState} from 'react';
import {useSearchParams, Link} from 'react-router-dom';
import {Modal} from './shared';
import {sampleRecords,queueNames,duplicates,toCsv,type DemoRecord} from './admin-demo-data';
import {getDemoSubmissions,getSampleEdit,resetDemoSubmissions,updateDemoSubmission} from './demo-submissions';
import {useLocale, useTranslation} from './i18n';
import {translate} from './i18n-runtime/catalog';
import './admin-demo.css';
const owners=['Chưa phân công','Lan (mẫu)','Mai (mẫu)'];
const statuses=['Mới','Đang xử lý','Đã đóng'];
const fieldLabels:Record<string,string>={company:'Doanh nghiệp',email:'Email',location:'Địa điểm làm việc',jobrole:'Vị trí cần tuyển',quantity:'Số lượng',shift:'Ca làm việc',needdate:'Ngày cần người',service:'Dịch vụ quan tâm',notes:'Ghi chú',message:'Nội dung liên hệ',position:'Vị trí ứng tuyển',program:'Chương trình quan tâm',question:'Nội dung cần tư vấn'};
export function AdminDemo(){
 const t = useTranslation();
 const locale = useLocale();
 const [params,setParams] = useSearchParams();
 const rawType = params.get('type') ?? '';
 const type = Object.hasOwn(queueNames,rawType) ? rawType : 'Tất cả';
 const selected = params.get('id');
 const listHeading = useRef<HTMLHeadingElement>(null);
 const recordTrigger = useRef<HTMLButtonElement | null>(null);
 const [records,setRecords] = useState<DemoRecord[]>(() => [
  ...getDemoSubmissions(),
  ...sampleRecords.map(record => ({...record, ...getSampleEdit(record.id)})),
 ]);
 const [search,setSearch] = useState(''), [source,setSource] = useState('Tất cả');
 const [owner,setOwner] = useState('Tất cả'), [status,setStatus] = useState('Tất cả');
 const [activeTab,setTab] = useState<'queue'|'cms'>('queue');
 const [confirmReset,setConfirmReset] = useState(false);
 const tab = selected ? 'queue' : activeTab;
 const [content,setContent] = useState('Cùng Minh Đức kết nối cơ hội và nhân lực.'), [draft,setDraft] = useState(content);
 const [publication,setPublication] = useState('Bản nháp mẫu');
 const publicationStatus = draft === content ? publication : t({
  vi:'Có thay đổi chưa lưu', en:'Unsaved changes', zh:'有未保存的更改',
  ko:'저장하지 않은 변경 사항', ja:'未保存の変更があります',
 });
 function setQueue(nextType: string, id?: string) {
  const next = new URLSearchParams(params);
  if (nextType === 'Tất cả') next.delete('type'); else next.set('type',nextType);
  if (id) next.set('id',id); else next.delete('id');
  setParams(next,{replace:true,preventScrollReset:true});
 }
 function closeRecord() {
  setQueue(type);
  if (!recordTrigger.current?.isConnected) requestAnimationFrame(() => listHeading.current?.focus({preventScroll:true}));
  recordTrigger.current = null;
 }
 function selectTab(next: 'queue'|'cms') {
  if (selected) setQueue(type);
  setTab(next);
 }
 function clearFilters() {
  setQueue('Tất cả');
  setSearch('');
  setSource('Tất cả');
  setOwner('Tất cả');
  setStatus('Tất cả');
 }
 const filtered=records.filter(r=>(type==='Tất cả'||r.type===type)&&(source==='Tất cả'||r.source===source)&&(owner==='Tất cả'||r.owner===owner)&&(status==='Tất cả'||r.status===status)&&`${r.id} ${r.name} ${r.phone} ${r.linkId} ${r.detail}`.toLowerCase().includes(search.toLowerCase()));
 const current=records.find(r=>r.id===selected&&(type==='Tất cả'||r.type===type));const update=(patch:Partial<DemoRecord>)=>{if(!selected)return;updateDemoSubmission(selected,patch);setRecords(rows=>rows.map(r=>r.id===selected?{...r,...patch}:r));};
 function exportCsv(){const url=URL.createObjectURL(new Blob([toCsv(filtered)],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='minh-duc-du-lieu-mau.csv';a.click();window.setTimeout(()=>URL.revokeObjectURL(url),0)}
 function reset(){resetDemoSubmissions();setRecords(sampleRecords.map(r=>({...r})));setConfirmReset(false);clearFilters();setDraft('Cùng Minh Đức kết nối cơ hội và nhân lực.');setContent('Cùng Minh Đức kết nối cơ hội và nhân lực.');setPublication('Bản nháp mẫu')}
 return <div className="admin-demo"><aside className="admin-side"><Link to="/" className="admin-brand">MINH ĐỨC <small>WORKSPACE / DEMO</small></Link><p>KHÔNG GIAN LÀM VIỆC</p><button className={tab==='queue'?'active':''} aria-pressed={tab==='queue'} aria-controls="admin-panel" onClick={()=>selectTab('queue')}>▦ &nbsp; Hồ sơ tiếp nhận</button><button className={tab==='cms'?'active':''} aria-pressed={tab==='cms'} aria-controls="admin-panel" onClick={()=>selectTab('cms')}>▤ &nbsp; Nội dung website</button><div className="admin-side-note">Bản trình diễn<br/>Dữ liệu và vai trò chỉ là mẫu</div></aside><div className="admin-main"><header className="admin-top"><div><span>MINH ĐỨC / QUẢN TRỊ MẪU</span><h1 id="admin-title">{tab==='queue'?'Hồ sơ tiếp nhận':'Nội dung website'}</h1></div><span>ADMIN mô phỏng</span></header><div className="admin-notice"><strong>Chỉ là bản minh họa.</strong> Dùng dữ liệu giả. Hồ sơ gửi thử chỉ giữ trong bộ nhớ trang khi chuyển trang nội bộ, không tải tệp hay gửi ra ngoài. Tải lại hoặc khôi phục mẫu sẽ xóa hồ sơ gửi thử. Không có đăng nhập hay phân quyền thực.</div>
 <div id="admin-panel" role="region" aria-labelledby="admin-title">
 {selected&&!current&&<p className="admin-empty" role="status">Không tìm thấy mã mô phỏng trong phiên này.</p>}
 {tab==='queue'?<><div className="admin-kpis"><div><span>Tổng hồ sơ mẫu</span><strong>{records.length.toString().padStart(2,'0')}</strong><small>6 nhóm tiếp nhận</small></div><div><span>Mới</span><strong>{records.filter(r=>r.status==='Mới').length.toString().padStart(2,'0')}</strong><small>Cần xem xét</small></div><div><span>Đang xử lý</span><strong>{records.filter(r=>r.status==='Đang xử lý').length.toString().padStart(2,'0')}</strong><small>Đã tiếp nhận</small></div><div><span>Đã đóng</span><strong>{records.filter(r=>r.status==='Đã đóng').length.toString().padStart(2,'0')}</strong><small>Kết quả minh họa</small></div></div><section className="admin-card"><div className="admin-card-head"><div><span className="admin-eyebrow">HỘP THƯ CÔNG VIỆC</span><h2 id="admin-records-heading" ref={listHeading} tabIndex={-1}>Danh sách hồ sơ mẫu</h2><p>Theo dõi, phân công và cập nhật kết quả xử lý.</p></div><div><button onClick={exportCsv}>Xuất CSV mẫu</button><button type="button" onClick={event=>{event.currentTarget.focus();setConfirmReset(true);}}>Khôi phục mẫu</button></div></div><div className="admin-queues"><button className={type==='Tất cả'?'active':''} aria-pressed={type==='Tất cả'} onClick={()=>setQueue('Tất cả')}>Tất cả <b>{records.length}</b></button>{Object.entries(queueNames).map(([key,name])=><button key={key} className={type===key?'active':''} aria-pressed={type===key} onClick={()=>setQueue(key)} title={name} aria-label={key + ' · ' + translate(name,locale)}>{key} <b>{records.filter(r=>r.type===key).length}</b></button>)}</div><div className="admin-filters"><label>Tìm kiếm<input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Mã, tên hoặc số mẫu"/></label><label>Nguồn<select value={source} onChange={e=>setSource(e.target.value)}><option value="Tất cả">Tất cả</option>{[...new Set(records.map(r=>r.source))].map(x=><option key={x} value={x}>{x}</option>)}</select></label><label>Phụ trách<select value={owner} onChange={e=>setOwner(e.target.value)}><option value="Tất cả">Tất cả</option>{owners.map(x=><option key={x} value={x}>{x}</option>)}</select></label><label>Trạng thái<select value={status} onChange={e=>setStatus(e.target.value)}><option value="Tất cả">Tất cả</option>{statuses.map(x=><option key={x} value={x}>{x}</option>)}</select></label></div><div className="admin-table-wrap" role="region" aria-labelledby="admin-records-heading" tabIndex={0}><table><thead><tr><th scope="col">Hồ sơ</th><th scope="col">Nhóm</th><th scope="col">Nguồn</th><th scope="col">Phụ trách</th><th scope="col">Trạng thái</th><th scope="col"><span className="sr-only">Chi tiết</span></th></tr></thead><tbody>{filtered.map(r=><tr key={r.id}><td><strong>{r.name}</strong><small>{r.id} · {r.phone}</small></td><td><b>{r.type}</b><small>{queueNames[r.type]}</small></td><td>{r.source}</td><td>{r.owner}</td><td><span className="admin-status">{r.status}</span></td><td><button type="button" aria-haspopup="dialog" onClick={event=>{recordTrigger.current=event.currentTarget;event.currentTarget.focus();setQueue(type,r.id);}}>Xem →</button></td></tr>)}</tbody></table></div>{!filtered.length&&<div className="admin-empty"><p>Không có hồ sơ mẫu phù hợp với bộ lọc.</p><button type="button" onClick={clearFilters}>Xóa bộ lọc</button></div>}<p className="admin-count">Hiển thị {filtered.length} hồ sơ mẫu</p></section></>:<section className="admin-card admin-cms"><span className="admin-eyebrow">CMS MINH HỌA</span><h2>Nội dung trang chủ</h2><p>Chỉnh sửa, lưu và xuất bản thử chỉ trong bộ nhớ trình duyệt.</p><label>Thông điệp giới thiệu<textarea rows={4} value={draft} onChange={e=>setDraft(e.target.value)}/></label><div><button onClick={()=>{setContent(draft);setPublication('Đã lưu bản nháp mẫu')}}>Lưu bản nháp</button><button onClick={()=>{setContent(draft);setPublication('Đã xuất bản mẫu')}}>Xuất bản thử</button></div><p role="status">Trạng thái: <strong>{publicationStatus}</strong></p><p>Nội dung đã lưu: {content}</p></section>}
 </div></div>{current&&<Modal key={current.id} title={`Chi tiết ${current.id} · ${current.type}`} onClose={closeRecord}><div className="admin-detail"><p><strong>{current.name}</strong><br/>{queueNames[current.type]} · {current.source}</p><p>Số mẫu: {current.phone}</p><p>Mã liên kết: {current.linkId} · Ngày tiếp nhận: {current.received}</p><p>{current.detail}</p>{current.fields&&<dl>{Object.entries(current.fields).filter(([,v])=>v).map(([key,value])=><div key={key}><dt>{fieldLabels[key]||key}</dt><dd>{key==='program'&&value==='other'?'Khác / Chưa rõ':value}</dd></div>)}</dl>}{current.type==='F03'&&duplicates(records,current).length>0&&<div className="admin-warning">Số mẫu trùng sau khi chuẩn hóa với {duplicates(records,current).map(r=>r.id).join(', ')}. Cảnh báo minh họa, không chặn xử lý.</div>}<label>Người phụ trách<select value={current.owner} onChange={e=>update({owner:e.target.value})}>{owners.map(x=><option key={x} value={x}>{x}</option>)}</select></label><label>Trạng thái<select value={current.status} onChange={e=>update({status:e.target.value})}>{statuses.map(x=><option key={x} value={x}>{x}</option>)}</select></label><label>Kết quả xử lý<textarea rows={3} value={current.result} onChange={e=>update({result:e.target.value})}/></label><p className="admin-count">Thay đổi được giữ trong bộ nhớ đến khi tải lại trang.</p></div></Modal>}
 {confirmReset && <Modal title="Khôi phục mẫu" onClose={()=>setConfirmReset(false)}>
  <p>{t({vi:'Khôi phục mẫu sẽ xóa hồ sơ gửi thử và nội dung chỉnh sửa trong phiên này.',en:'Resetting the demo clears test submissions and edits from this session.',zh:'恢复演示数据将清除本次会话中的测试提交和编辑内容。',ko:'데모를 초기화하면 이번 세션의 테스트 제출 기록과 편집 내용이 지워집니다.',ja:'デモをリセットすると、現在のセッションのテスト送信と編集内容が消去されます。'})}</p>
  <div className="admin-reset-actions">
   <button type="button" className="btn btn-secondary" onClick={()=>setConfirmReset(false)}>{t({vi:'Hủy',en:'Cancel',zh:'取消',ko:'취소',ja:'キャンセル'})}</button>
   <button type="button" className="btn" onClick={reset}>Khôi phục mẫu</button>
  </div>
 </Modal>}
 </div>;
}
