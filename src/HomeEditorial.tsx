import {useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowUpRight, Play} from 'lucide-react';
import {useLocale, useTranslation, type Locale} from './i18n';
import {articleHref, articles, categories, leadArticle} from './editorial-data';
import {RoutedEditorialCard} from './RoutedEditorialCard';
import {responsiveImage} from './media';
import heroAssets from './hero-assets.json';
import './home-editorial.css';

const [, workers, employers, hr] = categories;
type StoryCategory = typeof workers | typeof employers | typeof hr;

function NewsList({category, locale, illustrated = false}: {category: StoryCategory; locale: Locale; illustrated?: boolean}) {
  const [key, label] = category;
  return <section className="home-editorial-list">
    <h3><Link to={'/news?category=' + key + '#news-listings'}>{label}<ArrowUpRight size={15} aria-hidden="true"/></Link></h3>
    <ul>{articles.filter(article => article.category === label && article !== leadArticle).map((article, index) =>
      <RoutedEditorialCard key={article.slug} article={article} href={articleHref(article.slug)} locale={locale} variant="homeList"
        showImage={illustrated && index === 0}/>
    )}</ul>
  </section>;
}

export function HomeNews() {
  const locale = useLocale();
  const t = useTranslation();
  return <section className="home-editorial" aria-labelledby="home-editorial-heading">
    <div className="container home-editorial-shell">
      <header className="home-editorial-heading">
        <h2 id="home-editorial-heading">Tin tức &amp; cẩm nang</h2>
        <Link to="/news">{t({vi:'Xem tất cả bài viết',en:'All articles',zh:'查看全部文章',ko:'모든 글 보기',ja:'記事一覧'})}<ArrowUpRight size={18} aria-hidden="true"/></Link>
      </header>
      <div className="home-editorial-layout">
        <RoutedEditorialCard article={leadArticle} href={articleHref(leadArticle.slug)} locale={locale} variant="homeLead"/>
        <div className="home-editorial-left"><NewsList category={workers} locale={locale} illustrated/></div>
        <div className="home-editorial-right"><NewsList category={employers} locale={locale}/><NewsList category={hr} locale={locale}/></div>
      </div>
      <Link className="home-editorial-activities" to="/events">Hoạt động của Minh Đức Vina<ArrowUpRight size={17} aria-hidden="true"/></Link>
    </div>
  </section>;
}

type Film = {
  id: string;
  title: Record<Locale, string>;
  poster: string;
} & ({src: string; webm?: string} | {url: string});

const films: readonly Film[] = [{
  id:'company',
  title:{vi:'Phim giới thiệu Minh Đức Vina',en:'Minh Đức Vina company film',zh:'Minh Đức Vina 企业介绍影片',ko:'Minh Đức Vina 회사 소개 영상',ja:'Minh Đức Vina 会社紹介映像'},
  poster:heroAssets.poster,
  src:heroAssets.video,
  webm:heroAssets.webm,
}];

function FilmPoster({film, sizes}: {film: Film; sizes: string}) {
  return <>
    <img src={film.poster} {...responsiveImage(film.poster, sizes)} alt="" loading="lazy" decoding="async"/>
    <span className="home-film-play" aria-hidden="true"><Play size={24} fill="currentColor"/></span>
  </>;
}

export function HomeVideoGallery() {
  const t = useTranslation();
  const [activeFilm, setActiveFilm] = useState<string>();
  const [feature, ...moreFilms] = films;
  const playLabel = t({vi:'Phát video',en:'Play video',zh:'播放视频',ko:'영상 재생',ja:'動画を再生'});
  const featureTitle = t(feature.title);

  return <section className="home-films" aria-labelledby="home-films-heading">
    <div className="container home-editorial-shell">
      <header className="home-editorial-heading"><h2 id="home-films-heading">{t({vi:'Video Minh Đức Vina',en:'Minh Đức Vina videos',zh:'Minh Đức Vina 视频',ko:'Minh Đức Vina 영상',ja:'Minh Đức Vina の動画'})}</h2></header>
      <div className="home-film-grid">
        <article className="home-film-feature">
          {'url' in feature ? <a className="home-film-poster" href={feature.url} aria-label={featureTitle}>
            <FilmPoster film={feature} sizes="(max-width:920px) 92vw, 860px"/>
          </a> : activeFilm === feature.id ? <video id="home-film-player" controls playsInline autoPlay preload="none" tabIndex={0}
            poster={feature.poster} aria-label={featureTitle} ref={node => {
              if (node && document.activeElement === document.body) node.focus({preventScroll:true});
            }}>
            <source src={feature.src} type="video/mp4"/>
            {feature.webm && <source src={feature.webm} type="video/webm"/>}
            <a href={feature.src}>{featureTitle}</a>
          </video> : <button className="home-film-poster" type="button" aria-label={playLabel + ' – ' + featureTitle}
            onClick={() => setActiveFilm(feature.id)}>
            <FilmPoster film={feature} sizes="(max-width:920px) 92vw, 860px"/>
          </button>}
          <h3>{featureTitle}</h3>
        </article>
        {moreFilms.length > 0 && <ul className="home-film-list">{moreFilms.map(film => <li key={film.id}>
          <a href={'url' in film ? film.url : film.src}>
            <span className="home-film-poster"><FilmPoster film={film} sizes="(max-width:500px) 34vw, 180px"/></span>
            <span>{t(film.title)}</span>
          </a>
        </li>)}</ul>}
      </div>
    </div>
  </section>;
}
