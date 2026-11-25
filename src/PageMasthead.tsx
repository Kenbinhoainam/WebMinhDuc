import {useState, type ReactNode} from 'react';
import {Link} from 'react-router-dom';
import {useTranslation} from './i18n';
import {responsiveImage} from './media';
import './page-system-v18.css';

function MastheadImage({src,alt,caption,sizes}:{src:string;alt:string;caption?:string;sizes?:string}) {
  const [failed,setFailed]=useState(false);
  const image=responsiveImage(src,sizes ?? '(max-width:767px) 100vw, 55vw');
  return <figure className="md-masthead-figure">
    {failed ? <div className="md-masthead-image-fallback" role={alt?'img':undefined} aria-label={alt||undefined} aria-hidden={!alt||undefined} style={{aspectRatio:`${image?.width??1600}/${image?.height??900}`}}/>
      : <img {...image} src={image?.src ?? src} alt={alt} width={image?.width ?? 1600} height={image?.height ?? 900} fetchPriority="high" decoding="async" onError={()=>setFailed(true)}/>}
    {caption&&<figcaption>{caption}</figcaption>}
  </figure>;
}

/** Shared first screen: content is visible immediately; photography keeps its native framing. */
export function PageMasthead({title,eyebrow,description,image,imageAlt='',imageCaption,imageSizes,children}:{
  title:string;eyebrow?:string;description?:string;image?:string;imageAlt?:string;imageCaption?:string;imageSizes?:string;children?:ReactNode;
}) {
  const t=useTranslation();
  return <section className={`page-banner-main md-page-masthead${image?' md-page-masthead--image':''}`}>
    <div className="container md-masthead-shell">
      <nav className="md-masthead-breadcrumb" aria-label={t({vi:'Điều hướng trang',en:'Breadcrumb',zh:'页面导航',ko:'페이지 경로',ja:'ページナビゲーション'})}>
        <Link to="/">{t({vi:'Trang chủ',en:'Home',zh:'首页',ko:'홈',ja:'ホーム'})}</Link><span aria-hidden="true">/</span><span aria-current="page">{title}</span>
      </nav>
      <div className="md-masthead-grid"><div className="md-masthead-copy">
        {eyebrow&&<p className="md-masthead-eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>{description&&<p className="md-masthead-description">{description}</p>}
        {children&&<div className="md-masthead-actions">{children}</div>}
      </div>{image&&<MastheadImage key={image} src={image} alt={imageAlt} caption={imageCaption} sizes={imageSizes}/>}</div>
    </div>
  </section>;
}
