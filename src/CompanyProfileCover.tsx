import {useState, type ReactNode} from 'react';
import {Link} from 'react-router-dom';
import {RevealFrame} from './motion';
import {useTranslation} from './i18n';
import {responsiveImage} from './media';
import './company-profile-cover.css';

type CoverProps = {
 headingId: string;
 description: string;
 actionLabel: string;
 to: string;
 children: ReactNode;
};

export function CompanyProfileCover({headingId,description,actionLabel,to,children}:CoverProps) {
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
         <p className="field-description">{description}</p>
         <Link className="field-cta" to={to}>{actionLabel}</Link>
       </RevealFrame>
       {children}
     </div>
   </div>;
}
