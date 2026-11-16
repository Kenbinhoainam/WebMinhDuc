import {
  useEffect,
  useState,
} from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  Search,
  Menu,
  X,
  ArrowUpRight,
  CircleUserRound,
  Plus,
  Minus,
} from "lucide-react";
import { Modal } from "./shared";
import { useSavedJobs, jobs } from "./JobsPages";
import { LanguageSelector, useLocale, useTranslation } from "./i18n";
import { translate } from "./i18n-runtime/jsx-runtime";
import { navigation, subnavigation, sectionHasChild } from "./navigation";

const searchItems = [
  ...navigation.map(([url, title]) => ({
    url,
    title,
    category: "Trang thông tin",
  })),
  ...Object.values(subnavigation)
    .flat()
    .map(([url, title]) => ({ url, title, category: "Khám phá" })),
  ...[
    ["ho-so-xin-viec", "Chuẩn bị hồ sơ xin việc tại nhà máy: bắt đầu từ đâu?"],
    [
      "nhu-cau-tuyen-dung",
      "Lập kế hoạch bổ sung lao động theo từng đợt sản xuất",
    ],
    ["chon-cong-viec-phu-hop", "Những câu hỏi nên làm rõ trước khi nhận việc"],
    [
      "thong-tin-tuyen-dung-minh-bach",
      "Thông tin tuyển dụng rõ ràng tạo nên kết nối tốt hơn",
    ],
    [
      "don-tiep-lao-dong-moi",
      "Chuẩn bị ngày đầu làm việc cho người lao động mới",
    ],
    [
      "an-toan-thong-tin-khi-tim-viec",
      "Giữ an toàn thông tin cá nhân khi tìm việc trực tuyến",
    ],
  ].map(([slug, title]) => ({
    url: `/news/${slug}`,
    title,
    category: "Cẩm nang",
  })),
  ...jobs.map((job) => ({
    url: `/jobs/${job.slug}`,
    title: job.title,
    category: job.internal ? "Tuyển dụng nội bộ" : "Việc làm",
  })),
];
const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .trim();
function SearchPanel({ onClose }: { onClose: () => void }) {
  const locale = useLocale(),
    t = useTranslation();
  const [query, setQuery] = useState("");
  const results = searchItems.filter((x) =>
    normalize(x.title + " " + String(translate(x.title, locale))).includes(
      normalize(query),
    ),
  );
  return (
    <Modal title="Bạn đang tìm gì?" onClose={onClose}>
      <form
        className="site-search"
        onSubmit={(e) => {
          e.preventDefault();
          const first =
            document.querySelector<HTMLAnchorElement>(".search-results a");
          first?.click();
        }}
      >
        <Search />
        <input
          aria-label="Tìm kiếm trên website"
          placeholder="Việc làm, dịch vụ, liên hệ…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button
            type="button"
            className="icon-button"
            aria-label="Xóa tìm kiếm"
            onClick={() => setQuery("")}
          >
            <X size={18} />
          </button>
        )}
      </form>
      <div className="search-summary" role="status">
        {query
          ? t({
              vi: `${results.length} kết quả`,
              en: `${results.length} results`,
              zh: `${results.length} 个结果`,
              ko: `검색 결과 ${results.length}개`,
              ja: `${results.length}件の結果`,
            })
          : "Khám phá nhanh"}
      </div>
      <div className="search-results">
        {results.map((x) => (
          <Link to={x.url} key={x.url} onClick={onClose}>
            <span>
              <small>{x.category}</small>
              <strong>{x.title}</strong>
            </span>
            <ArrowUpRight size={20} />
          </Link>
        ))}
        {!results.length && (
          <div className="empty-search">
            <Search size={32} />
            <h3>Chưa tìm thấy kết quả</h3>
            <p>Thử từ khóa ngắn hơn, như “nhân lực” hoặc “việc làm”.</p>
          </div>
        )}
      </div>
    </Modal>
  );
}
function NavigationDrawer({ onClose }: { onClose: () => void }) {
  const [openGroup, setOpenGroup] = useState<string | null>(null),
    locale = useLocale(),
    t = useTranslation(),
    location = useLocation();
  return (
    <Modal title="Khám phá Minh Đức" onClose={onClose} variant="drawer">
      <nav className="drawer-nav" aria-label="Điều hướng chính">
        {navigation.map(([url, title], i) => (
          <div className="drawer-group" key={url}>
            <div className="drawer-group-heading">
              <NavLink
                to={url}
                end={url === "/"}
                className={({ isActive }) =>
                  isActive || sectionHasChild(url, location.pathname)
                    ? "active"
                    : undefined
                }
                onClick={onClose}
              >
                {title}
              </NavLink>
              {subnavigation[url] && (
                <button
                  type="button"
                  aria-label={`${t({ vi: "Mở menu", en: "Open menu", zh: "打开菜单", ko: "메뉴 열기", ja: "メニューを開く" })}: ${String(translate(title, locale))}`}
                  aria-expanded={openGroup === url}
                  aria-controls={`drawer-subnav-${i}`}
                  onClick={() => setOpenGroup(openGroup === url ? null : url)}
                >
                  {openGroup === url ? <Minus size={20} /> : <Plus size={20} />}
                </button>
              )}
            </div>
            {subnavigation[url] && (
              <div
                className="drawer-subnav"
                id={`drawer-subnav-${i}`}
                hidden={openGroup !== url}
              >
                {subnavigation[url].map(([to, label]) => (
                  <Link key={to} to={to} onClick={onClose}>
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </Modal>
  );
}
export function Header() {
  const t = useTranslation();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const location = useLocation();
  const saved = useSavedJobs();

  useEffect(() => {
    setMenu(false);
    setSearch(false);
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => {
    const closeOther = (event: Event) => {
      const owner = (event as CustomEvent<{owner?: string}>).detail?.owner;
      if (owner !== 'drawer') setMenu(false);
      if (owner !== 'search') setSearch(false);
    };
    document.addEventListener('header-overlay-open', closeOther);
    return () => document.removeEventListener('header-overlay-open', closeOther);
  }, []);

  const open = (owner: 'drawer' | 'search') => {
    document.dispatchEvent(new window.CustomEvent('header-overlay-open', {detail: {owner}}));
    if (owner === 'drawer') setMenu(true);
    else setSearch(true);
  };

  return <>
    <header className="site-header">
      <div className="container header-shell">
        <div className="header-inner">
          <Link to="/" className="brand header-logo" aria-label="Minh Đức — Trang chủ">
            <img src="/assets/minh-duc-logo.jpg" alt="Minh Đức — Nhân lực là tài sản" width="90" height="90"/>
          </Link>
          <div className="header-actions header-right">
            <button type="button" aria-label="Mở tìm kiếm" className="header-search" onClick={() => open('search')}>
              <span>Tìm kiếm</span><Search size={16}/>
            </button>
            <Link to="/contact" className="header-contact">Liên hệ</Link>
            <Link className="header-saved" to="/saved-jobs" aria-label={t({
              vi: `Việc đã lưu: ${saved.count}`, en: `Saved jobs: ${saved.count}`,
              zh: `已收藏职位：${saved.count}`, ko: `저장한 채용 정보: ${saved.count}개`, ja: `保存した求人：${saved.count}件`,
            })}>
              <CircleUserRound size={22}/>{saved.count > 0 && <span>{saved.count}</span>}
            </Link>
            <LanguageSelector/>
            <button type="button" className="menu-button" aria-label="Mở menu" aria-expanded={menu} onClick={() => open('drawer')}>
              <Menu size={24}/>
            </button>
          </div>
        </div>
      </div>
    </header>
    <noscript>
      <style>{`.site-header{position:relative!important;background:#29343a!important}.header-search,.menu-button,.language-selector{display:none!important}`}</style>
      <nav className="no-script-nav" aria-label="Điều hướng chính"><ul>
        {navigation.map(([url, title]) => <li key={url}><Link to={url}>{title}</Link>
          {subnavigation[url] && <ul>{subnavigation[url].map(([to, label]) => <li key={to}><Link to={to}>{label}</Link></li>)}</ul>}
        </li>)}
      </ul></nav>
    </noscript>
    {menu && <div className="drawer-root"><NavigationDrawer onClose={() => setMenu(false)}/></div>}
    {search && <SearchPanel onClose={() => setSearch(false)}/>}
  </>;
}
