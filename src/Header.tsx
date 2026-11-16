import {
  useEffect,
  useState,
  useRef,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  Search,
  Menu,
  X,
  Phone,
  ArrowUpRight,
  Bookmark,
  BriefcaseBusiness,
  Plus,
  Minus,
  Users,
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
      <div className="drawer-audiences">
        <Link to="/jobs" onClick={onClose}>
          <BriefcaseBusiness size={18} />
          Tôi tìm việc <ArrowUpRight size={16} />
        </Link>
        <Link to="/services" onClick={onClose}>
          <Users size={18} />
          Tôi cần nhân sự <ArrowUpRight size={16} />
        </Link>
      </div>
      <Link to="/saved-jobs" className="drawer-saved" onClick={onClose}>
        <Bookmark size={18} />
        Việc làm đã lưu <ArrowUpRight size={16} />
      </Link>
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
                <span className="nav-number">
                  {String(i + 1).padStart(2, "0")}
                </span>
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
      <div className="drawer-contact">
        <a href="tel:0364562868">
          <Phone size={18} />
          0364 562 868
        </a>
        <span>Nhân lực là tài sản.</span>
      </div>
    </Modal>
  );
}
export function Header() {
  const t = useTranslation();
  const [menu, setMenu] = useState(false),
    [search, setSearch] = useState(false),
    [scrolled, setScrolled] = useState(false),
    [openGroup, setOpenGroup] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null),
    location = useLocation(),
    saved = useSavedJobs();
  const openRef = useRef<string | null>(null),
    hovered = useRef<string | null>(null),
    blocked = useRef<string | null>(null),
    focusBlocked = useRef<string | null>(null),
    pointerKind = useRef<string | null>(null);
  const focusFrame = useRef<number | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null),
    closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  openRef.current = openGroup;
  const clearTimers = () => {
    if (focusFrame.current !== null) cancelAnimationFrame(focusFrame.current);
    focusFrame.current = null;
    if (openTimer.current !== null) clearTimeout(openTimer.current);
    if (closeTimer.current !== null) clearTimeout(closeTimer.current);
    openTimer.current = null;
    closeTimer.current = null;
  };
  const focusedGroup = (url: string) => {
    const trigger = navRef.current?.querySelector<HTMLAnchorElement>(
      `a[data-group="${url}"]`,
    );
    return !!trigger
      ?.closest(".desktop-nav-group")
      ?.contains(document.activeElement);
  };
  const focusedPanel = (url: string) => {
    const trigger = navRef.current?.querySelector<HTMLAnchorElement>(
      `a[data-group="${url}"]`,
    );
    return !!trigger
      ?.closest(".desktop-nav-group")
      ?.querySelector(".desktop-subnav")
      ?.contains(document.activeElement);
  };
  const allowHover = (event: ReactPointerEvent) =>
    event.pointerType === "mouse" &&
    !!window.matchMedia?.("(hover: hover) and (pointer: fine)").matches;
  const enterGroup = (event: ReactPointerEvent, url: string) => {
    if (!allowHover(event) || !subnavigation[url]) return;
    hovered.current = url;
    clearTimers();
    if (blocked.current === url) return;
    openTimer.current = setTimeout(() => {
      if (
        openRef.current &&
        openRef.current !== url &&
        focusedPanel(openRef.current)
      )
        return;
      document.dispatchEvent(
        new window.CustomEvent("header-overlay-open", {
          detail: { owner: "navigation" },
        }),
      );
      setOpenGroup(url);
    }, 100);
  };
  const leaveGroup = (event: ReactPointerEvent, url: string) => {
    if (!allowHover(event)) return;
    if (hovered.current === url) hovered.current = null;
    if (blocked.current === url) blocked.current = null;
    clearTimers();
    closeTimer.current = setTimeout(() => {
      if (openRef.current === url && !focusedGroup(url)) setOpenGroup(null);
    }, 180);
  };
  useEffect(() => () => clearTimers(), []);
  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 30);
    scroll();
    window.addEventListener("scroll", scroll, { passive: true });
    return () => window.removeEventListener("scroll", scroll);
  }, []);
  useEffect(() => {
    clearTimers();
    hovered.current = null;
    blocked.current = null;
    focusBlocked.current = null;
    setMenu(false);
    setSearch(false);
    setOpenGroup(null);
  }, [location.pathname, location.search, location.hash]);
  useEffect(() => {
    if (!window.matchMedia) return;
    const query = window.matchMedia("(min-width: 1280px)");
    const resize = (event: MediaQueryListEvent) => {
      clearTimers();
      hovered.current = null;
      blocked.current = null;
      focusBlocked.current = null;
      document.dispatchEvent(
        new window.CustomEvent("header-overlay-open", {
          detail: { owner: "resize" },
        }),
      );
      if (event.matches && menu) {
        const hadFocus = !!document
          .querySelector(".navigation-panel")
          ?.contains(document.activeElement);
        setMenu(false);
        if (hadFocus)
          requestAnimationFrame(() =>
            navRef.current?.querySelector<HTMLAnchorElement>("a")?.focus(),
          );
      } else if (!event.matches) {
        const hadFocus = !!navRef.current?.contains(document.activeElement);
        setOpenGroup(null);
        if (hadFocus)
          requestAnimationFrame(() =>
            document.querySelector<HTMLButtonElement>(".menu-button")?.focus(),
          );
      }
    };
    query.addEventListener("change", resize);
    return () => query.removeEventListener("change", resize);
  }, [menu, openGroup]);
  useEffect(() => {
    const pointer = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        pointerKind.current = null;
        clearTimers();
        setOpenGroup(null);
      }
    };
    const keyboard = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const current = openRef.current,
        pending = openTimer.current !== null || focusFrame.current !== null;
      if (!current && !pending) return;
      event.preventDefault();
      clearTimers();
      blocked.current = hovered.current;
      setOpenGroup(null);
      if (current) {
        focusBlocked.current = current;
        navRef.current
          ?.querySelector<HTMLAnchorElement>(`a[data-group="${current}"]`)
          ?.focus();
      }
    };
    const close = (event: Event) => {
      if (
        (event as CustomEvent<{ owner?: string }>).detail?.owner !==
        "navigation"
      ) {
        clearTimers();
        setOpenGroup(null);
      }
    };
    document.addEventListener("pointerdown", pointer);
    document.addEventListener("keydown", keyboard);
    document.addEventListener("header-overlay-open", close);
    return () => {
      document.removeEventListener("pointerdown", pointer);
      document.removeEventListener("keydown", keyboard);
      document.removeEventListener("header-overlay-open", close);
    };
  }, []);
  const openMenu = (url: string) => {
    clearTimers();
    document.dispatchEvent(new window.CustomEvent("header-overlay-open", {detail: {owner: "navigation"}}));
    setOpenGroup(url);
  };
  return (
    <>
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="header-shell">
          <div className="header-inner">
            <Link to="/" className="brand" aria-label="Minh Đức — Trang chủ">
              <img
                src="/assets/minh-duc-logo.jpg"
                alt="Minh Đức — Nhân lực là tài sản"
                width="90"
                height="90"
              />
            </Link>{" "}
            <nav
              ref={navRef}
              className="desktop-nav"
              onBlur={(event) => {
                if (
                  !event.currentTarget.contains(
                    event.relatedTarget as Node | null,
                  )
                ) {
                  clearTimers();
                  setOpenGroup(null);
                }
              }}
              aria-label={t({
                vi: "Điều hướng chính",
                en: "Main navigation",
                zh: "主导航",
                ko: "주 메뉴",
                ja: "メインナビゲーション",
              })}
            >
              <ul>
                {navigation.map(([url, title], i) => (
                  <li
                    className="desktop-nav-group"
                    key={url}
                    onPointerEnter={(event) => enterGroup(event, url)}
                    onPointerLeave={(event) => leaveGroup(event, url)}
                  >
                    <div className="desktop-nav-heading">
                      <NavLink
                        to={url}
                        end={url === "/"}
                        data-group={subnavigation[url] ? url : undefined}
                        aria-expanded={subnavigation[url] ? openGroup === url : undefined}
                        aria-controls={subnavigation[url] ? `desktop-subnav-${i}` : undefined}
                        className={({ isActive }) =>
                          isActive || sectionHasChild(url, location.pathname) ? "active" : undefined
                        }
                        onPointerDown={(event) => { pointerKind.current = event.pointerType; }}
                        onFocus={() => {
                          if (focusBlocked.current === url || pointerKind.current === "touch") return;
                          if (subnavigation[url]) openMenu(url);
                          else { clearTimers(); setOpenGroup(null); }
                        }}
                        onBlur={(event) => {
                          if (!event.currentTarget.closest(".desktop-nav-group")?.contains(event.relatedTarget as Node | null)) focusBlocked.current = null;
                        }}
                        onKeyDown={(event) => {
                          pointerKind.current = null;
                          if (subnavigation[url] && (event.key === "ArrowDown" || event.key === " ")) {
                            event.preventDefault();
                            focusBlocked.current = null;
                            openMenu(url);
                            focusFrame.current = requestAnimationFrame(() => {
                              focusFrame.current = null;
                              const panel = navRef.current?.querySelector<HTMLElement>(`#desktop-subnav-${i}`);
                              if (openRef.current === url && panel && !panel.hidden) panel.querySelector<HTMLAnchorElement>("a")?.focus();
                            });
                          }
                        }}
                        onClick={(event) => {
                          if (pointerKind.current === "touch" && subnavigation[url] && openRef.current !== url) {
                            event.preventDefault();
                            pointerKind.current = null;
                            openMenu(url);
                          } else {
                            pointerKind.current = null;
                            clearTimers();
                            setOpenGroup(null);
                          }
                        }}
                      >
                        {title}
                      </NavLink>
                    </div>
                    {subnavigation[url] && (
                      <div
                        className="desktop-subnav"
                        id={`desktop-subnav-${i}`}
                        hidden={openGroup !== url}
                      >
                        {subnavigation[url].map(([to, label]) => (
                          <Link
                            key={to}
                            to={to}
                            onClick={() => {
                              clearTimers();
                              setOpenGroup(null);
                            }}
                          >
                            {label}
                            <ArrowUpRight size={15} />
                          </Link>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            <div className="header-actions">
              <button
                aria-label="Mở tìm kiếm"
                className="header-search"
                onClick={() => {
                  document.dispatchEvent(
                    new window.CustomEvent("header-overlay-open", {
                      detail: { owner: "search" },
                    }),
                  );
                  setOpenGroup(null);
                  setSearch(true);
                }}
              >
                <span>Tìm kiếm</span>
                <Search size={16} />
              </button>
              <Link
                className="header-saved"
                to="/saved-jobs"
                aria-label={t({
                  vi: `Việc đã lưu: ${saved.count}`,
                  en: `Saved jobs: ${saved.count}`,
                  zh: `已收藏职位：${saved.count}`,
                  ko: `저장한 채용 정보: ${saved.count}개`,
                  ja: `保存した求人：${saved.count}件`,
                })}
              >
                <Bookmark size={20} />
                {saved.count > 0 && <span>{saved.count}</span>}
              </Link>
              <LanguageSelector />
              <Link to="/contact" className="header-contact">
                Liên hệ <ArrowUpRight size={15} />
              </Link>
              <button
                className="menu-button"
                aria-label="Mở menu"
                aria-expanded={menu}
                onClick={() => {
                  document.dispatchEvent(
                    new window.CustomEvent("header-overlay-open", {
                      detail: { owner: "drawer" },
                    }),
                  );
                  setOpenGroup(null);
                  setMenu(true);
                }}
              >
                <Menu size={25} />
              </button>
            </div>
          </div>
        </div>
      </header>
      <noscript>
        <style>{`.site-header{position:relative!important;background:#f8fafb!important;color:#20343e!important}.desktop-nav,.header-search,.menu-button,.language-selector{display:none!important}`}</style>
        <nav className="no-script-nav" aria-label="Điều hướng chính">
          <ul>
            {navigation.map(([url, title]) => (
              <li key={url}>
                <Link to={url}>{title}</Link>
                {subnavigation[url] && (
                  <ul>
                    {subnavigation[url].map(([to, label]) => (
                      <li key={to}>
                        <Link to={to}>{label}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </noscript>
      {menu && (
        <div className="drawer-root">
          <NavigationDrawer onClose={() => setMenu(false)} />
        </div>
      )}
      {search && <SearchPanel onClose={() => setSearch(false)} />}
    </>
  );
}
