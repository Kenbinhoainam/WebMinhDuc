import {useState, type ReactNode} from 'react';
import {Link} from 'react-router-dom';
import {ArrowRight} from 'lucide-react';
import {RevealFrame} from './motion';
import {useTranslation} from './i18n';
import {responsiveImage} from './media';
import './company-profile-cover.css';

export function CompanyProfileCover({headingId,children}:{headingId:string;children?:ReactNode}) {
 const t=useTranslation();
 const [photoFailed,setPhotoFailed]=useState(false);
 const photo='/assets/minhduc-v16/recruitment-field.webp';
 return <div className="field-cover">
     {!photoFailed && <img className="field-portrait" src={photo}
       {...responsiveImage(photo,'(max-width: 699px) 100vw, (max-width: 1599px) 65vw, 880px')}
       alt="" loading="lazy" decoding="async" onError={()=>setPhotoFailed(true)}/>}
     <div className="field-cover-content">
       <RevealFrame className="field-intro" effect="up">
         <p className="field-brand">Minh Đức Vina</p>
         <h2 id={headingId}>{t({vi:'Hồ sơ năng lực',en:'Company profile',zh:'公司简介',ko:'회사 소개서',ja:'会社案内'})}</h2>
         <p className="field-lead">{t({vi:'Nhân lực cho nhà máy miền Bắc',en:'Staffing for factories in northern Vietnam',zh:'面向越南北部工厂的人力服务',ko:'베트남 북부 공장을 위한 인력 서비스',ja:'ベトナム北部の工場向け人材サービス'})}</p>
         <p className="field-description">{t({vi:'Minh Đức kết nối nhà máy FDI với lao động phổ thông và nhân sự có tay nghề theo từng vị trí, ca làm và kế hoạch sản xuất.',en:'Minh Đức connects FDI factories with production workers and skilled staff for each role, shift and production schedule.',zh:'Minh Đức 根据外资工厂的岗位、班次和生产计划，对接普工与熟练技术人员。',ko:'Minh Đức는 외국인 투자 공장의 직무, 근무조와 생산 일정에 맞춰 생산직과 숙련 인력을 연결합니다.',ja:'Minh Đứcは外資系工場の職種・シフト・生産計画に合わせて、作業員や熟練人材を紹介します。'})}</p>
         <Link className="field-cta" to="/e-brochure">
           {t({vi:'Xem hồ sơ năng lực',en:'View company profile',zh:'查看公司简介',ko:'회사 소개서 보기',ja:'会社案内を見る'})}
           <ArrowRight size={20} aria-hidden="true"/>
         </Link>
       </RevealFrame>
       {children}
     </div>
   </div>;
}
