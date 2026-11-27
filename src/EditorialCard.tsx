import {useId, type ReactNode} from 'react';
import type {Locale} from './i18n';
import type {Article, EditorialImageData} from './editorial-data';
import {ArticleDate} from './EditorialDate';
import {responsiveImage} from './media';

type ArticleLinkProps = {
  href: string;
  className?: string;
  'aria-labelledby': string;
  children: ReactNode;
};

type Variant = 'homeLead' | 'homeList' | 'featured' | 'archive' | 'related';
const layouts = {
  homeLead: {
    wrapper: 'article', cardClass: 'home-editorial-lead', linkClass: 'home-editorial-lead-link',
    heading: 'h3', copyClass: 'home-editorial-lead-copy', metaClass: 'home-editorial-meta',
    sizes: '(max-width:959px) 92vw, 540px',
  },
  homeList: {
    wrapper: 'li', heading: 'span', sizes: '(max-width:720px) 90vw, (max-width:959px) 43vw, 280px',
  },
  featured: {
    wrapper: 'article', linkClass: 'ed-feature', heading: 'h2', copyClass: 'ed-feature-copy',
    metaClass: 'ed-meta', imageClass: 'ed-feature-image', sizes: '(max-width: 700px) 92vw, (max-width: 1279px) 48vw, 612px',
  },
  archive: {
    wrapper: 'article', cardClass: 'ed-archive-row info-news-card', linkClass: 'ed-archive-link',
    heading: 'h2', copyClass: 'ed-archive-copy', metaClass: 'info-news-meta ed-meta', portraitClass: 'ed-portrait',
    sizes: '(max-width: 700px) 100px, (max-width: 970px) 44vw, (max-width: 1279px) 30vw, 390px',
  },
  related: {
    wrapper: 'article', cardClass: 'editorial-related-item', heading: 'h3', portraitClass: 'ed-portrait', sizes: '74px',
  },
} as const satisfies Record<Variant, {
  wrapper: 'article' | 'li';
  heading: 'h2' | 'h3' | 'span';
  sizes: string;
  cardClass?: string;
  linkClass?: string;
  copyClass?: string;
  metaClass?: string;
  imageClass?: string;
  portraitClass?: string;
}>;

export function EditorialImage({image, sizes, className, loading = 'lazy', decorative = false}: {
  image: EditorialImageData;
  sizes: string;
  className?: string;
  loading?: 'eager' | 'lazy';
  decorative?: boolean;
}) {
  return <img src={image.src} {...responsiveImage(image.src, sizes)} className={className}
    alt={decorative ? '' : image.alt} loading={loading} decoding="async"/>;
}

const staticArchivePhoto = (photo: ReactNode) => <div className="ed-row-photo">{photo}</div>;
const nativeLink = ({children, ...props}: ArticleLinkProps) => <a {...props}>{children}</a>;

export function EditorialCard({article, href, locale, variant, showImage = true, eagerImage = false,
  renderLink = nativeLink, renderArchivePhoto = staticArchivePhoto}: {
  article: Article;
  href: string;
  locale: Locale;
  variant: Variant;
  showImage?: boolean;
  eagerImage?: boolean;
  renderLink?: (props: ArticleLinkProps) => ReactNode;
  renderArchivePhoto?: (photo: ReactNode) => ReactNode;
}) {
  const titleId = useId();
  const layout = layouts[variant];
  const {wrapper: Wrapper, heading: Heading, sizes} = layout;
  const title = <Heading id={titleId}>{article.title}</Heading>;
  const date = <ArticleDate date={article.date} locale={locale}/>;
  const imageClass = 'imageClass' in layout ? layout.imageClass : undefined;
  const portraitClass = 'portraitClass' in layout ? layout.portraitClass : undefined;
  const photo = showImage && article.image && <EditorialImage image={article.image} sizes={sizes} decorative
    className={article.image.orientation === 'portrait' ? portraitClass ?? imageClass : imageClass}
    loading={eagerImage ? 'eager' : 'lazy'}/>;
  let children: ReactNode;

  if (variant === 'homeList') children = <>{photo}{date}{title}</>;
  else if (variant === 'related') children = <>{photo}{title}</>;
  else if (variant === 'archive') children = <>
    {photo && renderArchivePhoto(photo)}
    <div className={layouts.archive.metaClass}>{date}<span>{article.category}</span></div>
    <div className={layouts.archive.copyClass}>{title}<p>{article.excerpt}</p></div>
  </>;
  else {
    const {copyClass, metaClass} = layouts[variant];
    const media = variant === 'homeLead' ? photo :
      photo ? <div className="ed-feature-media">{photo}</div> :
      <div className="ed-feature-checklist"><ul>{article.sections.map(section => <li key={section.heading}>{section.heading}</li>)}</ul></div>;
    children = <>
      {media}
      <div className={copyClass}>
        <p className={metaClass}>
          {variant === 'featured' && date}<span>{article.category}</span>{variant === 'homeLead' && date}
        </p>
        {title}<p>{article.excerpt}</p>
      </div>
    </>;
  }

  return <Wrapper className={'cardClass' in layout ? layout.cardClass : undefined}>
    {renderLink({href, className:'linkClass' in layout ? layout.linkClass : undefined, 'aria-labelledby':titleId, children})}
  </Wrapper>;
}
