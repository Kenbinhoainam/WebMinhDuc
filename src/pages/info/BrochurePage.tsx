import {useEffect, useRef, useState} from 'react';
import {ArrowRight, ChevronLeft, ChevronRight, Printer, Phone, Mail} from 'lucide-react';
import {useTranslation} from '../../i18n';
import {responsiveImage} from '../../media';
import {services, contact} from './data';
import {partners} from '../../partners';
import './brochure-reference.css';

function BrochureCover({onRead}:{onRead?:()=>void}) {
  const t=useTranslation();
  const [photo,setPhoto]=useState<'responsive'|'landscape'|'none'>('responsive');
  const landscape=responsiveImage('/assets/minhduc-v18/about-team.webp','(min-width:1280px) 1160px, 94vw');
  const portrait=responsiveImage('/assets/minhduc-v18/contact-team.webp','100vw');
  return <div className="md-brochure-cover">
    {photo!=='none'&&<picture className="md-brochure-cover-media" key={photo}>
      {photo==='responsive'&&<source media="(max-width:639px)" srcSet={portrait?.srcSet} sizes={portrait?.sizes}/>}
      <img {...landscape} src="/assets/minhduc-v18/about-team.webp" alt="" decoding="async" loading={onRead?'eager':'lazy'} onError={()=>{
        const retryLandscape=photo==='responsive' && window.matchMedia('(max-width:639px)').matches;
        setPhoto(retryLandscape?'landscape':'none');
      }}/>
    </picture>}
    <div className="md-brochure-cover-copy">
      <div className="md-brochure-brand"><p className="md-brochure-imprint" translate="no">MINH ĐỨC VINA</p><p className="md-brochure-signature">Nhân lực là tài sản</p></div>
      <h2>Hồ sơ năng lực</h2>
      <p className="md-brochure-specialty">{t({vi:'Nhân lực cho nhà máy miền Bắc',en:'Workforce solutions for Northern Vietnam’s factories',zh:'为越南北部工厂提供人力服务',ko:'베트남 북부 제조업 현장을 위한 인력 서비스',ja:'ベトナム北部の工場を支える人材サービス'})}</p>
      <p className="md-brochure-description">{t({vi:'Minh Đức kết nối người lao động với nhà máy và doanh nghiệp FDI, từ lúc xác định nhu cầu theo ca đến khi chuẩn bị hồ sơ ứng tuyển.',en:'Minh Đức connects people with factories and foreign-invested businesses, from identifying shift staffing needs to preparing job applications.',zh:'明德连接求职者、工厂与外资企业，从明确班次用工需求到准备应聘材料，提供支持。',ko:'민득은 교대 인력 수요 확인부터 지원 서류 준비까지 구직자와 공장 및 외국인 투자 기업을 연결합니다.',ja:'ミンドゥックは、シフトごとの人員ニーズの確認から応募書類の準備まで、求職者と工場・外資系企業をつなぎます。'})}</p>
      {onRead&&<button type="button" className="md-brochure-read" onClick={onRead}>
        {t({vi:'Xem các dịch vụ',en:'Explore our services',zh:'查看服务项目',ko:'서비스 살펴보기',ja:'サービス一覧を見る'})}<ArrowRight size={18} aria-hidden="true"/>
      </button>}
    </div>
    <dl className="md-brochure-cover-facts">
      <div><dt>Nhóm dịch vụ</dt><dd>{String(services.length).padStart(2,'0')}</dd></div>
      <div><dt>Điểm kết nối</dt><dd>{String(contact.offices.length).padStart(2,'0')}</dd></div>
    </dl>
  </div>;
}

export function BrochurePage(){
  const [page,setPage]=useState(0), t=useTranslation();
  const sheet=useRef<HTMLDivElement>(null);
  const focusNewPage=useRef(false);
  const select=(next:number)=>{focusNewPage.current=true;setPage(next);};
  useEffect(()=>{
    if(!focusNewPage.current)return;
    focusNewPage.current=false;
    const heading=sheet.current?.querySelector('h2');
    if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});heading.scrollIntoView?.({block:'start',behavior:'instant'});}
  },[page]);
  const pages=[
    <BrochureCover/>,
    <div><h2>Về Minh Đức</h2><p>Minh Đức kết nối doanh nghiệp và người lao động trong lĩnh vực cung ứng nhân lực, giới thiệu việc làm, với trọng tâm là lao động phổ thông tại nhà máy và doanh nghiệp sản xuất.</p><h2>Giải pháp của chúng tôi</h2>{services.map(service=><div key={service.slug}><h3>{service.title}</h3><p>{service.short}</p></div>)}</div>,
    <div><h2>Đối tác được giới thiệu</h2><p>{partners.join(' · ')}</p><h2>Bắt đầu một cuộc trao đổi</h2><p><Phone size={17}/> {contact.phone}</p><p><Mail size={17}/> {contact.email}</p><p>Zalo: zalo.me/0329138082</p><p>Facebook: facebook.com/md668.com.vn</p></div>,
  ];
  return <section className="section md-brochure"><div className="container">
    <div className="md-brochure-toolbar info-no-print">
      <h1 className="md-brochure-title">Bản giới thiệu trực tuyến</h1>
      <button type="button" className="btn btn-secondary" onClick={()=>window.print()}><Printer size={17} aria-hidden="true"/> In / lưu PDF</button>
    </div>
    <div className="md-brochure-viewer"><div className="md-brochure-page" data-cover={page===0} ref={sheet}>
      {page===0 ? <BrochureCover onRead={()=>select(1)}/> : pages[page]}
    </div></div>
    <nav className="md-brochure-controls info-no-print" aria-label={t({vi:'Điều hướng hồ sơ',en:'Brochure navigation',zh:'画册导航',ko:'소개서 탐색',ja:'パンフレットのページ操作'})}>
      <button type="button" className="circle-button" disabled={page===0} aria-label={t({vi:'Trang trước',en:'Previous page',zh:'上一页',ko:'이전 페이지',ja:'前のページ'})} onClick={()=>select(page-1)}><ChevronLeft aria-hidden="true"/></button>
      <span aria-live="polite" aria-atomic="true">{page+1} / {pages.length}</span>
      <button type="button" className="circle-button" disabled={page===pages.length-1} aria-label={t({vi:'Trang sau',en:'Next page',zh:'下一页',ko:'다음 페이지',ja:'次のページ'})} onClick={()=>select(page+1)}><ChevronRight aria-hidden="true"/></button>
    </nav>
    <div className="md-brochure-print">{pages.map((content,i)=><div key={i}>{content}</div>)}</div>
  </div></section>;
}
