import {useEffect, useState, type ReactNode} from 'react';
import {Link} from 'react-router-dom';
import {useTranslation} from './i18n';
import {responsiveImage} from './media';
import './page-system-v18.css';
import './masthead-photography.css';

function MastheadImage({src,alt,caption,sizes,onError}:{src:string;alt:string;caption?:string;sizes?:string;onError:()=>void}) {
  const image=responsiveImage(src,sizes ?? '(max-width:767px) 100vw, 55vw');
  return <figure className="md-masthead-figure">
    <img {...image} src={image?.src ?? src} alt={alt} width={image?.width ?? 1600} height={image?.height ?? 900} fetchPriority="high" decoding="async" onError={onError}/>
    {caption&&<figcaption>{caption}</figcaption>}
  </figure>;
}

/** Shared first screen: content is visible immediately; photography keeps its native framing. */
export function PageMasthead({title,eyebrow,description,image,imageAlt='',imageCaption,imageSizes,variant,children}:{
  variant?:'photo';title:string;eyebrow?:string;description?:string;image?:string;imageAlt?:string;imageCaption?:string;imageSizes?:string;children?:ReactNode;
}) {
  const t=useTranslation();
  const [failedImage, setFailedImage] = useState<string>();
  useEffect(() => {setFailedImage(previous => previous === image ? previous : undefined);}, [image]);
  const visibleImage = image !== failedImage ? image : undefined;
  const breadcrumb = <nav className="md-masthead-breadcrumb" aria-label={t({vi:'Điều hướng trang',en:'Breadcrumb',zh:'页面导航',ko:'페이지 경로',ja:'ページナビゲーション'})}>
    <Link to="/">{t({vi:'Trang chủ',en:'Home',zh:'首页',ko:'홈',ja:'ホーム'})}</Link><span aria-hidden="true">/</span><span aria-current="page">{title}</span>
  </nav>;
  if (variant === 'photo') {
    return <section className="md-page-masthead md-photo-masthead">
      <div className="md-photo-stage">
        {visibleImage && <MastheadImage key={visibleImage} src={visibleImage} alt={imageAlt} sizes="100vw" onError={()=>setFailedImage(visibleImage)}/>}
        <div className="md-photo-copy">
          {eyebrow && <p className="md-masthead-eyebrow">{eyebrow}</p>}
          <h1>{title}</h1>
          {description && <p className="md-masthead-description">{description}</p>}
          {children && <div className="md-masthead-actions">{children}</div>}
        </div>
      </div>
      <div className="md-photo-meta">{breadcrumb}{imageCaption && <p>{imageCaption}</p>}</div>
    </section>;
  }
  return <section className={`page-banner-main md-page-masthead${visibleImage?' md-page-masthead--image':''}`}>
    <div className="container md-masthead-shell">
      {breadcrumb}
      <div className="md-masthead-grid"><div className="md-masthead-copy">
        {eyebrow&&<p className="md-masthead-eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>{description&&<p className="md-masthead-description">{description}</p>}
        {children&&<div className="md-masthead-actions">{children}</div>}
      </div>{visibleImage&&<MastheadImage key={visibleImage} src={visibleImage} alt={imageAlt} caption={imageCaption} sizes={imageSizes} onError={()=>setFailedImage(visibleImage)}/>}</div>
    </div>
  </section>;
}
