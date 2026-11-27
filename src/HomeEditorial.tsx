import {ArrowRight, ArrowUpRight} from 'lucide-react';
import {Link} from 'react-router-dom';
import {articleHref, articles, categories, leadArticle} from './editorial-data';
import {useLocale, useTranslation} from './i18n';
import {RoutedEditorialCard} from './RoutedEditorialCard';
import './home-editorial.css';

export {HomeVideoGallery} from './HomeVideoGallery';

const recentStories = [...articles].sort((a,b)=>b.date.localeCompare(a.date));
const photoSources = new Set([leadArticle.image?.src]);
const desks = categories.filter(([key])=>key!=='all').map(([key,label])=>{
  const candidates = recentStories.filter(story=>story.category===label && story.slug!==leadArticle.slug);
  const illustrated = candidates.find(story=>story.image && !photoSources.has(story.image.src));
  if (illustrated?.image) photoSources.add(illustrated.image.src);
  const stories = illustrated
    ? [illustrated, ...candidates.filter(story=>story!==illustrated).slice(0,1)]
    : candidates.slice(0,2);
  return {key, label, stories, illustratedSlug:illustrated?.slug};
}).filter(desk=>desk.stories.length>0);

export function HomeNews() {
  const locale = useLocale();
  const t = useTranslation();
  return <section className="home-editorial" aria-labelledby="home-editorial-heading">
    <div className="container home-editorial-shell">
      <header className="home-editorial-heading">
        <h2 id="home-editorial-heading">Tin tức &amp; cẩm nang</h2>
        <Link to="/news">{t({vi:'Xem tất cả bài viết',en:'All articles',zh:'查看全部文章',ko:'모든 글 보기',ja:'記事一覧'})}<ArrowRight size={18} aria-hidden="true"/></Link>
      </header>

      <div className="home-editorial-layout">
        <RoutedEditorialCard article={leadArticle} href={articleHref(leadArticle.slug)} locale={locale}
          variant="homeLead" imageSizes="(max-width:639px) calc(100vw - 40px), (max-width:1399px) 47vw, 635px"/>

        <div className="home-editorial-desks">
          {desks.map(({key,label,stories,illustratedSlug})=><section className="home-editorial-list" key={key} aria-labelledby={'home-news-'+key}>
            <h3 id={'home-news-'+key}><Link to={'/news?category='+key+'#news-listings'}>
              {label}<ArrowUpRight size={17} aria-hidden="true"/>
            </Link></h3>
            <ul>{stories.map(story=><RoutedEditorialCard key={story.slug} article={story} href={articleHref(story.slug)} locale={locale}
              variant="homeList" showImage={story.slug===illustratedSlug}
              imageSizes="(max-width:639px) 112px, (max-width:1023px) 150px, (max-width:1399px) 30vw, 410px"/>
            )}</ul>
          </section>)}
        </div>
      </div>

      <Link className="home-editorial-activities" to="/events">Hoạt động của Minh Đức Vina<ArrowRight size={17} aria-hidden="true"/></Link>
    </div>
  </section>;
}
