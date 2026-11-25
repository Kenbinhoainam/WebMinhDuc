import {useEffect, useRef, useState} from 'react';
import {Link, useLocation, useNavigate, useParams} from 'react-router-dom';
import {ChevronDown, ChevronLeft, ChevronRight, Link2, Phone, ShieldCheck} from 'lucide-react';
import {company} from './company';
import {ButtonLink} from './shared';
import {PageMasthead} from './PageMasthead';
import {responsiveImage} from './media';
import {useLocale, localizedPath, type Locale} from './i18n';
import {RevealFrame} from './motion';
import {ORIGIN} from './seo/routes';
import {useHomeCarousel, advanceHomeRail} from './useHomeCarousel';
import './editorial-reference.css';

const contact = company;

type ArticleSection = { heading: string; paragraphs: string[]; bullets?: string[] };
type Article = { slug: string; title: string; category: 'Dành cho người lao động' | 'Dành cho doanh nghiệp' | 'Góc nhân sự'; image?: string; date: string; excerpt: string; sections: ArticleSection[] };
const articles: Article[] = [
  { slug: 'ho-so-xin-viec', title: 'Chuẩn bị hồ sơ xin việc tại nhà máy: bắt đầu từ đâu?', category: 'Dành cho người lao động', image: '/assets/minhduc-v16/recruitment-field.webp', date: '12/11/2026', excerpt: 'Một danh sách gọn gàng giúp bạn chuẩn bị hồ sơ và hỏi đúng thông tin trước ngày phỏng vấn.', sections: [
    { heading: 'Xác nhận yêu cầu của từng vị trí', paragraphs: ['Mỗi nhà máy có thể có quy trình và yêu cầu hồ sơ khác nhau. Trước khi chuẩn bị giấy tờ, hãy hỏi rõ vị trí ứng tuyển, địa điểm tiếp nhận và người phụ trách. Một danh sách được xác nhận giúp bạn tránh đi lại nhiều lần.'] },
    { heading: 'Sắp xếp thông tin dễ kiểm tra', paragraphs: ['Ghi lại họ tên, số điện thoại, khu vực sinh sống, kinh nghiệm và thời gian có thể bắt đầu làm việc. Nếu chưa có kinh nghiệm, bạn vẫn có thể giới thiệu khả năng học hỏi và điều kiện làm việc mong muốn.'], bullets: ['Thông tin liên hệ còn sử dụng được.', 'Giấy tờ theo danh sách do đơn vị tiếp nhận xác nhận.', 'Bản sao khi được yêu cầu; giữ gìn giấy tờ gốc.', 'Các câu hỏi về công việc, ca làm và điều kiện nhận việc.'] },
    { heading: 'Bảo vệ thông tin cá nhân', paragraphs: ['Chỉ gửi hồ sơ cho đầu mối đã được xác minh. Không công khai ảnh giấy tờ tùy thân trên mạng xã hội. Khi được yêu cầu cung cấp thêm dữ liệu, hãy hỏi mục đích sử dụng và cách lưu giữ.'] },
  ] },
  { slug: 'nhu-cau-tuyen-dung', title: 'Lập kế hoạch bổ sung lao động theo từng đợt sản xuất', category: 'Dành cho doanh nghiệp', image: '/assets/minhduc-working-60s.webp', date: '10/11/2026', excerpt: 'Làm rõ nhu cầu từ đầu giúp các bên phối hợp nhất quán trong quá trình tìm nguồn và tiếp nhận.', sections: [
    { heading: 'Bắt đầu từ kế hoạch vận hành', paragraphs: ['Doanh nghiệp nên xác định công đoạn cần bổ sung, số lượng dự kiến và thời điểm người lao động cần sẵn sàng làm việc. Nhu cầu càng cụ thể, việc trao đổi với đơn vị hỗ trợ tuyển dụng càng hiệu quả.'] },
    { heading: 'Thống nhất thông tin trước khi tìm nguồn', paragraphs: ['Một bản mô tả công việc ngắn, dễ hiểu có giá trị hơn các thông tin rời rạc. Nội dung nên được rà soát với bộ phận trực tiếp tiếp nhận.'], bullets: ['Địa điểm và phương án đi lại nếu có.', 'Ca làm, yêu cầu cơ bản và điều kiện làm việc.', 'Thu nhập, cách tính và các khoản cần làm rõ.', 'Đầu mối xác nhận lịch phỏng vấn, nhận việc.'] },
    { heading: 'Theo dõi và cập nhật theo giai đoạn', paragraphs: ['Đối chiếu số lượng quan tâm, lịch phỏng vấn và số lượng dự kiến tiếp nhận để cập nhật kế hoạch. Khi lịch sản xuất thay đổi, các bên cần thông báo sớm để tránh thông tin không đồng nhất.'] },
  ] },
  { slug: 'chon-cong-viec-phu-hop', title: 'Những câu hỏi nên làm rõ trước khi nhận việc', category: 'Dành cho người lao động', image: '/assets/minhduc-v18/field-team.webp', date: '08/11/2026', excerpt: 'Hiểu rõ công việc, thời gian và thu nhập giúp bạn lựa chọn công việc phù hợp hơn.', sections: [
    { heading: 'Công việc hằng ngày là gì?', paragraphs: ['Hãy hỏi về nhiệm vụ cụ thể, môi trường làm việc, yêu cầu thể lực và hướng dẫn ban đầu. Đừng ngại đề nghị giải thích lại những thuật ngữ chưa quen.'] },
    { heading: 'Thời gian và thu nhập được tính ra sao?', paragraphs: ['Làm rõ ca làm, ngày nghỉ, chính sách làm thêm và cách xác nhận chấm công. Với thu nhập, cần phân biệt khoản cố định, phụ cấp và khoản phụ thuộc điều kiện.'], bullets: ['Thời điểm trả lương và hình thức nhận lương.', 'Điều kiện áp dụng các khoản phụ cấp.', 'Thông tin hợp đồng và bảo hiểm cần được xác nhận.', 'Đầu mối hỗ trợ khi có thắc mắc.'] },
    { heading: 'Lưu lại các thông tin đã xác nhận', paragraphs: ['Giữ tin tuyển dụng và nội dung trao đổi cần thiết. Trước khi đi nhận việc, xác nhận địa chỉ, thời gian, giấy tờ cần mang và số điện thoại liên hệ.'] },
  ] },
  { slug: 'thong-tin-tuyen-dung-minh-bach', title: 'Thông tin tuyển dụng rõ ràng tạo nên kết nối tốt hơn', category: 'Góc nhân sự', date: '05/11/2026', excerpt: 'Sự nhất quán giữa tin tuyển dụng, tư vấn và thực tế tiếp nhận giúp giảm hiểu nhầm.', sections: [
    { heading: 'Một nguồn thông tin thống nhất', paragraphs: ['Tin tuyển dụng nên dùng ngôn ngữ dễ hiểu và nêu các điều kiện chính. Khi nhiều đầu mối cùng tham gia, cần thống nhất nội dung được phép chia sẻ và cách cập nhật thay đổi.'] },
    { heading: 'Trình bày đủ điều kiện', paragraphs: ['Thông tin thu nhập cần đi kèm cách tính hoặc điều kiện áp dụng. Các quyền lợi chưa được xác nhận không nên trình bày như cam kết. Điều này giúp ứng viên cân nhắc cơ hội phù hợp với nhu cầu thực tế.'] },
    { heading: 'Dành chỗ cho phản hồi', paragraphs: ['Một kênh để ứng viên hỏi lại thông tin giúp đơn vị tuyển dụng nhận ra những điểm chưa rõ. Các câu hỏi thường gặp có thể được bổ sung vào nội dung tuyển dụng ở lần cập nhật tiếp theo.'] },
  ] },
  { slug: 'don-tiep-lao-dong-moi', title: 'Chuẩn bị ngày đầu làm việc cho người lao động mới', category: 'Dành cho doanh nghiệp', image: '/assets/minhduc-meeting-10s.webp', date: '02/11/2026', excerpt: 'Từ lịch hẹn đến người hướng dẫn, những chi tiết nhỏ giúp ngày đầu diễn ra thuận lợi.', sections: [
    { heading: 'Trước ngày tiếp nhận', paragraphs: ['Gửi hướng dẫn dễ đọc về địa chỉ, cổng vào, giờ có mặt và giấy tờ cần mang. Xác nhận một đầu mối có thể liên hệ khi người lao động cần hỗ trợ.'] },
    { heading: 'Trong ngày đầu tiên', paragraphs: ['Dành thời gian giới thiệu công việc, quy định và các hướng dẫn an toàn cần thiết. Kiểm tra người lao động đã hiểu nội dung thay vì chỉ đưa tài liệu.'], bullets: ['Giới thiệu người quản lý hoặc hướng dẫn trực tiếp.', 'Hướng dẫn khu vực làm việc và sinh hoạt.', 'Làm rõ quy trình chấm công, báo nghỉ và hỏi đáp.', 'Ghi nhận các thắc mắc phát sinh.'] },
    { heading: 'Sau khi bắt đầu công việc', paragraphs: ['Một lần hỏi thăm ngắn giúp phát hiện khó khăn ban đầu. Thông tin phản hồi có thể hỗ trợ cải thiện quy trình tiếp nhận cho những đợt tiếp theo.'] },
  ] },
  { slug: 'an-toan-thong-tin-khi-tim-viec', title: 'Giữ an toàn thông tin cá nhân khi tìm việc trực tuyến', category: 'Góc nhân sự', date: '30/10/2026', excerpt: 'Xác minh nguồn tin, bảo vệ giấy tờ và thận trọng trước những yêu cầu chưa rõ ràng.', sections: [
    { heading: 'Kiểm tra nguồn tin', paragraphs: ['Đối chiếu tên doanh nghiệp, số liên hệ và địa điểm tuyển dụng. Khi có điều chưa rõ, hãy tìm kênh liên hệ chính thức và hỏi trực tiếp trước khi cung cấp hồ sơ.'] },
    { heading: 'Chia sẻ vừa đủ thông tin', paragraphs: ['Ở bước tư vấn ban đầu, chỉ chia sẻ thông tin cần cho việc trao đổi công việc. Không gửi mã xác thực, mật khẩu hoặc thông tin tài khoản ngân hàng cho người tuyển dụng.'] },
    { heading: 'Cẩn trọng với yêu cầu chuyển tiền', paragraphs: ['Nếu có yêu cầu đóng phí hoặc chuyển tiền, hãy làm rõ đơn vị nhận, mục đích, căn cứ và chứng từ. Dừng trao đổi khi gặp dấu hiệu đáng ngờ và xác minh qua một kênh độc lập.'] },
  ] },
];

const categories = [
  ['all', 'Tất cả'], ['workers', 'Dành cho người lao động'],
  ['employers', 'Dành cho doanh nghiệp'], ['hr', 'Góc nhân sự'],
] as const;
const featured = articles.filter(article => ['don-tiep-lao-dong-moi', 'an-toan-thong-tin-khi-tim-viec'].includes(article.slug));

function formatDate(date: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === 'vi' ? 'vi-VN' : locale, {
    day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(date + 'T00:00:00Z'));
}
function ArticleDate({date}: {date: string}) {
  const iso = date.split('/').reverse().join('-');
  return <time dateTime={iso}>{formatDate(iso, useLocale())}</time>;
}
function NotFoundEditorial({event = false}: {event?: boolean}) {
  return <PageMasthead title={event ? 'Không tìm thấy sự kiện' : 'Không tìm thấy bài viết'}>
    <Link className="btn" to={event ? '/events' : '/news'}>{event ? 'Xem tất cả sự kiện' : 'Trở về tất cả bài viết'}</Link>
  </PageMasthead>;
}
function useListingQuery() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  function update(values: Record<string, string | null>) {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(values)) {
      if (value === null) next.delete(key); else next.set(key, value);
    }
    navigate({pathname: location.pathname, search: next.toString(), hash: location.hash});
  }
  return {params, update, url:location.pathname + location.search + location.hash};
}

function FeaturedNews({archive}: {archive: string}) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  useHomeCarousel(track, () => advanceHomeRail(track.current));
  function syncIndex() {
    const el = track.current;
    if (!el) return;
    const first = (el.children[0] as HTMLElement).offsetLeft;
    const offsets = Array.from(el.children, child => Math.abs((child as HTMLElement).offsetLeft - first - el.scrollLeft));
    setIndex(offsets.indexOf(Math.min(...offsets)));
  }
  return <section className="info-news-section ed-feature-band"><div className="ed-frame info-featured-news">
    <h2 className="ed-feature-heading" id="featured-news-heading">Bài chọn lọc</h2>
    <div ref={track} className="editorial-feature-track" data-auto-rail role="region" aria-labelledby="featured-news-heading"
      tabIndex={0} onScroll={syncIndex}>
      {featured.map((article, i) => <div key={article.slug} className="editorial-feature-slide" inert={i !== index}>
        <article className="ed-feature">
          {article.image ? <div className="ed-feature-media"><img className="ed-feature-image"
            {...responsiveImage(article.image, '(max-width: 700px) 92vw, (max-width: 1279px) 48vw, 612px')} src={article.image}
            alt="" decoding="async" loading={i === 0 ? 'eager' : 'lazy'}/></div> :
            <div className="ed-feature-checklist"><ul>{article.sections.map(section => <li key={section.heading}>{section.heading}</li>)}</ul></div>}
          <div className="ed-feature-copy"><p className="ed-meta"><ArticleDate date={article.date}/><span>{article.category}</span></p>
            <h2><Link to={'/news/' + article.slug} state={{archive}}>{article.title}</Link></h2><p>{article.excerpt}</p>
          </div>
        </article>
      </div>)}
    </div>
  </div></section>;
}

const newsCover = '/assets/minhduc-working-60s.webp';
const photoDescriptions: Record<string, string> = {
  '/assets/minhduc-v16/recruitment-field.webp': 'Nhân viên Minh Đức cầm tài liệu trong buổi làm việc ngoài trời',
  '/assets/minhduc-v18/field-team.webp': 'Nhóm nhân viên Minh Đức trao đổi ngoài trời',
  '/assets/minhduc-meeting-10s.webp': 'Đội ngũ Minh Đức ngồi họp quanh bàn',
  [newsCover]: 'Đội ngũ Minh Đức trao đổi tài liệu tại bàn làm việc',
};
function ArticleRow({article, archive}: {article: Article; archive: string}) {
  return <article className="ed-archive-row info-news-card">
    {article.image && <RevealFrame effect="media" className="ed-row-photo">
      <img className={article.slug === 'ho-so-xin-viec' ? 'ed-portrait' : ''}
        {...(responsiveImage(article.image, '(max-width: 700px) 100px, (max-width: 970px) 44vw, (max-width: 1279px) 30vw, 390px') ?? {src:article.image, width:1024, height:576})} alt="" loading="lazy"/>
    </RevealFrame>}
    <div className="info-news-meta ed-meta"><ArticleDate date={article.date}/><span>{article.category}</span></div>
    <div className="ed-archive-copy"><h2><Link to={'/news/' + article.slug} state={{archive}}>{article.title}</Link></h2><p>{article.excerpt}</p></div>
  </article>;
}
export function NewsPage() {
  const {params, update, url} = useListingQuery();
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  const selected = categories.find(([key]) => key === params.get('category')) ?? categories[0];
  const filtered = articles.filter(article => selected[0] === 'all' || article.category === selected[1]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / 3));
  const requested = Number(params.get('page'));
  const page = Number.isInteger(requested) && requested > 0 ? Math.min(requested, totalPages) : 1;
  function changePage(next: number) {
    update({page: next === 1 ? null : String(next)});
    resultsHeading.current?.focus();
  }
  return <div className="ed-pages"><PageMasthead title="Tin tức & cẩm nang"
    description="Hướng dẫn chuẩn bị hồ sơ, tiếp nhận lao động và lập kế hoạch nhân lực cho nhà máy."
    image={newsCover} imageAlt="Đội ngũ Minh Đức trao đổi tài liệu tại bàn làm việc">
      <Link className="btn" to={url.split('#')[0] + '#news-listings'}>Danh mục bài viết</Link>
    </PageMasthead>
    {page === 1 && featured.length > 0 && <FeaturedNews archive={url}/>}
    <section className="info-news-listing ed-section" aria-labelledby="news-listings"><div className="ed-frame">
      <h2 ref={resultsHeading} id="news-listings" tabIndex={-1}>Danh mục bài viết</h2>
      <div className="info-tabs ed-filters" role="group" aria-label="Chuyên mục tin tức">{categories.map(([key, label]) =>
        <button type="button" key={key} aria-pressed={selected[0] === key} onClick={() => update({category: key === 'all' ? null : key, page: null})}>{label}</button>)}</div>
      <p className="info-result-count ed-result" aria-live="polite">{filtered.length} bài viết · Trang {page}/{totalPages}</p>
      <div className="info-news-grid ed-archive">{filtered.slice((page - 1) * 3, page * 3).map(article => <ArticleRow article={article} archive={url} key={article.slug}/>)}</div>
      {filtered.length === 0 && <p>Chưa có bài trong chuyên mục này. <button className="ed-control" onClick={() => update({category:null, page:null})}>Xem tất cả</button></p>}
      {totalPages > 1 && <nav className="info-pagination ed-pagination" aria-label="Phân trang tin tức">
        <button type="button" aria-label="Trang trước" disabled={page === 1} onClick={() => changePage(page - 1)}><ChevronLeft size={18}/></button>
        {Array.from({length: totalPages}, (_, i) => <button type="button" key={i} aria-current={page === i + 1 ? 'page' : undefined} onClick={() => changePage(i + 1)}>{i + 1}</button>)}
        <button type="button" aria-label="Trang sau" disabled={page === totalPages} onClick={() => changePage(page + 1)}><ChevronRight size={18}/></button>
      </nav>}
      <p className="ed-archive-note">Các bài hướng dẫn trong danh mục là nội dung biên tập mẫu.</p>
    </div></section>
  </div>;
}

function ArticleShare({url}: {url: string}) {
  const [result, setResult] = useState<'idle' | 'copied' | 'manual'>('idle');
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { if (result === 'manual') { input.current?.focus(); input.current?.select(); } }, [result]);
  async function copy() {
    try { await navigator.clipboard.writeText(url); setResult('copied'); }
    catch { setResult('manual'); input.current?.select(); }
  }
  return <div className="ed-share"><span>Chia sẻ</span>
    <a href={'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url)} target="_blank" rel="noopener noreferrer">Facebook</a>
    <a href={'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url)} target="_blank" rel="noopener noreferrer">LinkedIn</a>
    <button className="ed-control" type="button" onClick={copy}><Link2 size={16}/>Sao chép liên kết</button>
    <span role="status">{result === 'copied' ? 'Đã sao chép' : ''}</span>
    {result === 'manual' && <label className="ed-copy-fallback">Chọn và sao chép liên kết<input ref={input} readOnly value={url} onFocus={event => event.currentTarget.select()}/></label>}
  </div>;
}
function Contents({article, archive}: {article: Article; archive: string}) {
  const {pathname, search} = useLocation();
  const [open, setOpen] = useState(true);
  useEffect(() => {
    const query = window.matchMedia('(min-width: 900px)');
    const change = () => setOpen(query.matches);
    change(); query.addEventListener('change', change);
    return () => query.removeEventListener('change', change);
  }, []);
  return <nav className="info-toc ed-toc" aria-label="Nội dung bài viết">
    <button type="button" aria-controls="article-toc" aria-expanded={open} onClick={() => setOpen(!open)}>Nội dung bài viết <ChevronDown size={18}/></button>
    <ol id="article-toc" hidden={!open}>{article.sections.map((section, i) => <li key={section.heading}><Link to={{pathname, search, hash:'#article-section-' + i}} state={{archive}}>{section.heading}</Link></li>)}</ol>
  </nav>;
}
function ArticleReader({article}: {article: Article}) {
  const locale = useLocale();
  const {state} = useLocation();
  const archive = typeof state?.archive === 'string' && /^\/news\/?(?:[?#]|$)/.test(state.archive) ? state.archive : '/news';
  const employer = article.category === 'Dành cho doanh nghiệp' || article.slug === 'thong-tin-tuyen-dung-minh-bach';
  const related = articles.filter(a => a.slug !== article.slug).sort((a, b) => Number(b.category === article.category) - Number(a.category === article.category)).slice(0, 2);
  return <div className="ed-pages ed-reader"><div className="ed-frame">
    <nav className="ed-crumbs" aria-label="Đường dẫn"><Link to="/">Trang chủ</Link><span aria-hidden="true">/</span><Link to={archive}>Tin tức</Link></nav>
    <article className="info-article ed-story">
      <header className={'ed-story-head' + (article.image ? ' ed-story-illustrated' : '')}>
        <div className="ed-story-deck"><p className="ed-meta">{article.category} <span aria-hidden="true">·</span> <ArticleDate date={article.date}/></p>
          <h1>{article.title}</h1><p className="ed-lead">{article.excerpt}</p></div>
        {article.image && <div className="ed-story-photo">
          <img className={'ed-cover' + (article.slug === 'ho-so-xin-viec' ? ' ed-cover-portrait' : '')}
            {...(responsiveImage(article.image, '(max-width: 700px) 92vw, (max-width: 1279px) 40vw, 510px') ?? {src:article.image, width:1024, height:576})}
            alt={photoDescriptions[article.image]}/>
        </div>}
      </header>
      <div className="ed-reader-grid"><Contents article={article} archive={archive}/>
        <div className="ed-body">
          {article.sections.map((section, i) => <section key={section.heading} className="ed-prose-section" aria-labelledby={'article-section-' + i}>
            <h2 id={'article-section-' + i} tabIndex={-1}>{section.heading}</h2>
            {section.paragraphs.map(p => <p key={p}>{p}</p>)}
            {section.bullets && <ul>{section.bullets.map(item => <li key={item}>{item}</li>)}</ul>}
          </section>)}
          <div className="ed-actions"><Link className="btn" to={employer ? '/#business-contact' : '/jobs'}>{employer ? 'Gửi nhu cầu nhân lực' : 'Xem việc làm'}</Link>
            <Link to={archive}>Trở về tất cả bài viết</Link></div>
          <ArticleShare url={ORIGIN + localizedPath('/news/' + article.slug, locale)}/>
        </div>
        <aside className="info-related-news editorial-related-aside ed-related"><h2>Có thể bạn quan tâm</h2>{related.map(item =>
          <article className="editorial-related-item" key={item.slug}>
            {item.image && <img {...responsiveImage(item.image, '74px')} src={item.image} className={item.slug === 'ho-so-xin-viec' ? 'ed-portrait' : ''} alt="" loading="lazy"/>}
            <h3><Link to={'/news/' + item.slug} state={{archive}}>{item.title}</Link></h3>
          </article>)}</aside>
      </div>
    </article>
  </div></div>;
}
export function ArticlePage() {
  const {slug} = useParams();
  const article = articles.find(item => item.slug === slug);
  return article ? <ArticleReader key={article.slug} article={article}/> : <NotFoundEditorial/>;
}
type EventData = { slug: string; title: string; tag: string; date: string; time: string; location: string; summary: string; agenda: [string, string][] };
const events: EventData[] = [
  { slug: 'ngay-hoi-ket-noi-viec-lam', title: 'Ngày hội kết nối việc làm cùng Minh Đức', tag: 'Kết nối việc làm', date: '2026-11-28', time: '08:30 – 11:30', location: 'Địa điểm sẽ được xác nhận', summary: 'Một không gian để người tìm việc trao đổi nhu cầu, tìm hiểu công việc và chuẩn bị những bước tiếp theo.', agenda: [['08:30', 'Đón tiếp và ghi nhận nhu cầu tìm việc'], ['09:00', 'Chia sẻ thông tin về công việc tại nhà máy'], ['10:00', 'Tư vấn cách chuẩn bị hồ sơ'], ['11:00', 'Hỏi đáp và hướng dẫn bước tiếp theo']] },
  { slug: 'toa-dam-ke-hoach-nhan-luc', title: 'Trao đổi kế hoạch nhân lực cho doanh nghiệp sản xuất', tag: 'Dành cho doanh nghiệp', date: '2026-12-05', time: '14:00 – 15:30', location: 'Hình thức trực tuyến', summary: 'Nội dung trao đổi gợi ý về việc làm rõ nhu cầu tuyển dụng, phối hợp tìm nguồn và chuẩn bị tiếp nhận lao động.', agenda: [['14:00', 'Giới thiệu nội dung trao đổi'], ['14:15', 'Làm rõ nhu cầu và thông tin tuyển dụng'], ['14:45', 'Phối hợp tiếp nhận theo từng đợt'], ['15:15', 'Thảo luận các tình huống thực tế']] },
  { slug: 'hanh-trang-tim-viec', title: 'Hành trang tìm việc: từ hồ sơ đến ngày đầu đi làm', tag: 'Hướng dẫn người lao động', date: '2026-11-08', time: '09:00 – 10:30', location: 'Địa điểm sẽ được xác nhận', summary: 'Gợi ý nội dung chia sẻ giúp người lao động chuẩn bị hồ sơ, kiểm tra nguồn tin và đặt câu hỏi trước khi nhận việc.', agenda: [['09:00', 'Chuẩn bị thông tin và hồ sơ'], ['09:30', 'Những điều cần hỏi trước khi nhận việc'], ['10:00', 'Bảo vệ thông tin cá nhân khi ứng tuyển']] },
];

const sampleDate = '2026-11-25';
const statuses = [['all', 'Tất cả'], ['upcoming', 'Sắp diễn ra'], ['past', 'Đã diễn ra']] as const;
const eventSections = [
  ['overview', 'Tổng quan'], ['schedule', 'Lịch trình'], ['location', 'Địa điểm'],
  ['gallery', 'Hình ảnh'], ['other-events', 'Sự kiện khác'],
] as const;
function eventStatus(event: EventData) {
  return event.date >= sampleDate ? 'upcoming' : 'past';
}
function SampleDate() {
  return <p className="ed-note">Mốc đối chiếu lịch mẫu <time dateTime={sampleDate}>{formatDate(sampleDate, useLocale())}</time>. Thời gian và địa điểm chờ Minh Đức xác nhận.</p>;
}
function EventLine({event}: {event: EventData}) {
  const locale = useLocale();
  return <article className="ed-event-line">
    <time className="ed-calendar" dateTime={event.date}>
      <b aria-hidden="true">{event.date.slice(-2)}</b>
      <span>{formatDate(event.date, locale)}</span>
    </time>
    <div><p className="ed-meta">{event.tag}</p><h3><Link to={'/events/' + event.slug}>{event.title}</Link></h3>
      <p className="ed-event-details"><span>{event.time} UTC+7</span><span>{event.location}</span></p></div>
    <div className="ed-event-action"><span className="ed-status">{eventStatus(event) === 'upcoming' ? 'Sắp diễn ra' : 'Đã diễn ra'}</span><Link className="ed-schedule-link" to={'/events/' + event.slug + '#schedule'}>Xem lịch trình</Link></div>
  </article>;
}
export function EventsPage() {
  const {params, update} = useListingQuery();
  const selected = statuses.find(([key]) => key === params.get('status')) ?? statuses[0];
  const filtered = events.filter(event => selected[0] === 'all' || selected[0] === eventStatus(event));
  return <div className="ed-pages"><PageMasthead title="Hoạt động của Minh Đức Vina"
    description="Gặp gỡ người lao động, trao đổi cùng doanh nghiệp và kết nối với cộng đồng."
    image="/assets/minhduc-v16/recruitment-event.webp" imageAlt="Mọi người đứng trên sân khấu trong một hoạt động tuyển dụng">
    <Link className="btn" to="/about-us#activities">Xem ảnh hoạt động Minh Đức</Link>
  </PageMasthead>
    <section className="ed-section"><div className="ed-frame"><h2>Lịch chương trình minh họa</h2><SampleDate/>
      <div className="info-tabs ed-filters" role="group" aria-label="Lọc sự kiện">{statuses.map(([key, label]) =>
        <button type="button" key={key} aria-pressed={selected[0] === key} onClick={() => update({status:key === 'all' ? null : key})}>{label}</button>)}</div>
      <p className="ed-result" aria-live="polite">{filtered.length} sự kiện</p>
      <div className="ed-event-list">{filtered.map(event => <EventLine key={event.slug} event={event}/>)}</div>
      {filtered.length === 0 && <p>Chưa có chương trình trong nhóm này. <button type="button" className="ed-control" onClick={() => update({status:null})}>Xem tất cả</button></p>}
    </div></section>
  </div>;
}
export function EventPage() {
  const {slug} = useParams();
  const locale = useLocale();
  const event = events.find(item => item.slug === slug);
  if (!event) return <NotFoundEditorial event/>;
  return <div className="ed-pages ed-event"><PageMasthead title={event.title} eyebrow="Lịch sự kiện minh họa" description={event.summary}>
    <a className="btn btn-secondary" href="#schedule">Xem lịch trình</a>
  </PageMasthead>
    <div className="ed-frame">
      <section aria-labelledby="overview" className="ed-section ed-event-overview"><div><h2 id="overview" tabIndex={-1}>Tổng quan</h2><SampleDate/></div>
        <dl className="ed-facts"><div><dt>Ngày và giờ Việt Nam</dt><dd><time dateTime={event.date}>{formatDate(event.date, locale)}</time> · {event.time} UTC+7</dd></div>
          <div><dt>Địa điểm</dt><dd>{event.location}</dd></div>
          <div><dt>Trạng thái theo lịch mẫu</dt><dd>{eventStatus(event) === 'upcoming' ? 'Sắp diễn ra' : 'Đã diễn ra'}</dd></div></dl>
      </section>
      <nav className="info-event-nav ed-anchor-nav" aria-label="Nội dung sự kiện">{eventSections.map(([id, label]) => <a href={'#' + id} key={id}>{label}</a>)}</nav>
      <section aria-labelledby="schedule" className="ed-section ed-event-schedule"><h2 id="schedule" tabIndex={-1}>Nội dung dự kiến</h2>
        <ol className="ed-agenda">{event.agenda.map(([time, item], i) => <li key={time}><RevealFrame delay={i % 2 ? 1 : 0}>
          <div className="ed-agenda-entry"><time dateTime={event.date + 'T' + time + ':00+07:00'}>{time}</time><span>{item}</span></div>
        </RevealFrame></li>)}</ol>
      </section>
      <section aria-labelledby="location" className="ed-section ed-location"><div><h2 id="location" tabIndex={-1}>Địa điểm và liên hệ</h2><p>{event.location}</p></div>
        <a className="ed-control" href={'tel:' + contact.tel}><Phone size={17}/>Gọi hỏi thông tin <span>{contact.phone}</span></a></section>
      <section aria-labelledby="gallery" className="ed-section ed-gallery"><h2 id="gallery" tabIndex={-1}>Ảnh tư liệu hoạt động</h2><p>Ảnh do Minh Đức cung cấp từ các hoạt động khác.</p>
        <div className="ed-gallery-grid">
          <RevealFrame effect="media"><figure><img src="/assets/minhduc-v16/community.webp" alt="Mọi người chụp ảnh cùng nhau trong một hoạt động ngoài trời" {...responsiveImage('/assets/minhduc-v16/community.webp', '(max-width: 700px) 92vw, (max-width: 1279px) 46vw, 588px')} loading="lazy"/><figcaption>Kết nối cộng đồng</figcaption></figure></RevealFrame>
          <RevealFrame effect="media" delay={1}><figure><img src="/assets/minhduc-v16/team-yearend.webp" alt="Tập thể Minh Đức chụp ảnh trong buổi gặp mặt cuối năm" {...responsiveImage('/assets/minhduc-v16/team-yearend.webp', '(max-width: 700px) 92vw, (max-width: 1279px) 46vw, 588px')} loading="lazy"/><figcaption>Buổi gặp mặt cuối năm</figcaption></figure></RevealFrame>
        </div>
      </section>
      <section aria-labelledby="other-events" className="ed-section"><h2 id="other-events" tabIndex={-1}>Sự kiện khác</h2><div className="ed-event-list">{events.filter(item => item.slug !== slug).map(item => <EventLine key={item.slug} event={item}/>)}</div>
        <Link className="ed-all-events" to="/events">Xem tất cả sự kiện</Link>
      </section>
    </div>
  </div>;
}

export function PolicyPage({ kind }: { kind: 'privacy' | 'terms' }) {
  const isPrivacy = kind === 'privacy';
  return <><nav className="container info-article-breadcrumb" aria-label="Đường dẫn"><Link to="/">Trang chủ</Link><span> / </span><span>{isPrivacy ? 'Chính sách bảo mật' : 'Điều khoản sử dụng'}</span></nav><section className="section container info-policy prose"><h1>{isPrivacy ? 'Chính sách bảo mật' : 'Điều khoản sử dụng'}</h1><div className="info-policy-body"><span className="info-demo-tag info-inline-tag">Bản dự thảo cho prototype</span><h2 className="info-policy-title">{isPrivacy ? 'Thông tin cá nhân & quyền riêng tư' : 'Sử dụng website Minh Đức'}</h2><p className="info-lead">Nội dung này mô tả phạm vi trải nghiệm của bản prototype và cần được Minh Đức rà soát trước khi phát hành website chính thức.</p>{isPrivacy ? <><h2>1. Thông tin trong biểu mẫu</h2><p>Các biểu mẫu có thể yêu cầu họ tên, số điện thoại, email, nhu cầu tuyển dụng hoặc tìm việc và hồ sơ CV. Trong prototype, thao tác gửi được mô phỏng trên trình duyệt; dữ liệu không được gửi đến hệ thống tiếp nhận của Minh Đức.</p><h2>2. Dữ liệu lưu trên thiết bị</h2><p>Website có thể lưu lựa chọn ngôn ngữ, việc làm đã lưu và tùy chọn giao diện trong bộ nhớ trình duyệt để hỗ trợ trải nghiệm. Bạn có thể xóa dữ liệu website trong phần cài đặt trình duyệt.</p><h2>3. Giấy tờ và hồ sơ cá nhân</h2><p>Chỉ cung cấp thông tin cần thiết cho mục đích tìm việc. Không gửi mật khẩu, mã xác thực hoặc dữ liệu tài chính qua biểu mẫu. Với phiên bản chính thức, mục đích sử dụng, thời gian lưu và đơn vị xử lý dữ liệu cần được công bố rõ trước khi tiếp nhận hồ sơ.</p><h2>4. Liên kết bên ngoài</h2><p>Liên kết Facebook, Zalo, email và điện thoại đưa bạn đến dịch vụ khác. Việc sử dụng thông tin tại các dịch vụ đó chịu sự điều chỉnh của chính sách tương ứng.</p><h2>5. Trao đổi về thông tin cá nhân</h2><p>Nếu có thắc mắc, vui lòng liên hệ Minh Đức qua thông tin bên dưới. Yêu cầu liên quan dữ liệu thực tế cần được xác minh qua kênh liên hệ chính thức.</p></> : <><h2>1. Phạm vi bản prototype</h2><p>Website dùng để trải nghiệm và đánh giá giao diện, các luồng tìm việc, giới thiệu dịch vụ và gửi yêu cầu. Những nội dung có nhãn minh họa không phải tin tuyển dụng hoặc thông báo sự kiện chính thức.</p><h2>2. Thông tin tuyển dụng và dịch vụ</h2><p>Điều kiện tuyển dụng, thu nhập, chi phí dịch vụ và phạm vi hợp tác cần được xác nhận trực tiếp với Minh Đức hoặc đơn vị tuyển dụng trước khi đưa ra quyết định.</p><h2>3. Sử dụng các biểu mẫu</h2><p>Người sử dụng nên cung cấp thông tin chính xác, phù hợp mục đích của biểu mẫu. Tính năng gửi trong prototype là mô phỏng và chưa tạo hồ sơ ứng tuyển, yêu cầu tư vấn hay đăng ký sự kiện thực tế.</p><h2>4. Tài liệu và hình ảnh</h2><p>Thiết kế được phát triển theo bản tham chiếu do người dùng cung cấp. Các hình ảnh minh họa cần được rà soát và thay thế bằng tài sản được phê duyệt trước khi sử dụng cho website chính thức.</p><h2>5. Liên kết và nội dung bên ngoài</h2><p>Website có thể dẫn đến các nền tảng liên hệ và thông tin bên ngoài. Nội dung tại các nền tảng này có thể thay đổi; hãy kiểm tra đúng tài khoản và đầu mối trước khi trao đổi thông tin cá nhân.</p></>}<div className="info-policy-contact"><ShieldCheck size={26} /><div><h2>Liên hệ Minh Đức</h2><p><a href={`tel:${contact.tel}`}>{contact.phone}</a><br /><a href={`mailto:${contact.email}`}>{contact.email}</a></p></div></div><ButtonLink to="/" secondary>Về trang chủ</ButtonLink></div></section></>;
}
