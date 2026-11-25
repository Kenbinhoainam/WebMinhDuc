import {useState} from 'react';
import {ChevronLeft, ChevronRight, Printer, Phone, Mail} from 'lucide-react';
import {useTranslation} from '../../i18n';
import {services, contact} from './data';
import {partners} from '../../partners';
import './brochure-reference.css';

/** The archive contains only the original player bootstrap; this is a labeled local viewer. */
export function BrochurePage(){
 const [page,setPage]=useState(0), t=useTranslation();
 const pages=[
  <div className="md-brochure-cover"><span className="eyebrow">MINH ĐỨC</span><h2>Kết nối nhân lực.<br/>Mở rộng cơ hội.</h2><p>Nhân lực là tài sản</p></div>,
  <div><h2>Về Minh Đức</h2><p>Minh Đức kết nối doanh nghiệp và người lao động trong lĩnh vực cung ứng nhân lực, giới thiệu việc làm, với trọng tâm là lao động phổ thông tại nhà máy và doanh nghiệp sản xuất.</p><h2>Giải pháp của chúng tôi</h2>{services.map(service=><div key={service.slug}><h3>{service.title}</h3><p>{service.short}</p></div>)}</div>,
  <div><h2>Đối tác được giới thiệu</h2><p>{partners.join(' · ')}</p><h2>Bắt đầu một cuộc trao đổi</h2><p><Phone size={17}/> {contact.phone}</p><p><Mail size={17}/> {contact.email}</p><p>Zalo: zalo.me/0329138082</p><p>Facebook: facebook.com/md668.com.vn</p><p className="info-content-note">Bản giới thiệu phục vụ duyệt prototype. Hình ảnh minh họa được sử dụng từ bản giao diện tham chiếu; nội dung chi tiết sẽ được hoàn thiện trước khi phát hành chính thức.</p></div>,
 ];
 return <><section className="section md-brochure"><div className="container"><h1 className="md-brochure-title">Hồ sơ giới thiệu</h1><div className="md-brochure-toolbar info-no-print"><span>Bản giới thiệu trực tuyến</span><button type="button" className="btn btn-secondary" onClick={()=>window.print()}><Printer size={17}/> In / lưu PDF</button></div><div className="md-brochure-viewer"><div className="md-brochure-page">{pages[page]}</div></div><nav className="md-brochure-controls info-no-print" aria-label={t({vi:'Điều hướng hồ sơ',en:'Brochure navigation',zh:'画册导航',ko:'소개서 탐색',ja:'パンフレットのページ操作'})}><button type="button" className="circle-button" disabled={page===0} aria-label={t({vi:'Trang trước',en:'Previous page',zh:'上一页',ko:'이전 페이지',ja:'前のページ'})} onClick={()=>setPage(page-1)}><ChevronLeft/></button><span aria-live="polite" aria-atomic="true">{page+1} / {pages.length}</span><button type="button" className="circle-button" disabled={page===pages.length-1} aria-label={t({vi:'Trang sau',en:'Next page',zh:'下一页',ko:'다음 페이지',ja:'次のページ'})} onClick={()=>setPage(page+1)}><ChevronRight/></button></nav><div className="md-brochure-print">{pages.map((content,i)=><div key={i}>{content}</div>)}</div></div></section></>;
}
