import {useEffect, useRef, useState} from 'react';
import {Pause, Play} from 'lucide-react';
import {ButtonLink} from './shared';
import './hero-media.css';
import heroAssets from './hero-assets.json';

const VIDEO = heroAssets.video;
const POSTER = heroAssets.poster;
type Connection = {
  saveData?: boolean;
  effectiveType?: string;
  addEventListener?: (type: string, listener: () => void) => void;
  removeEventListener?: (type: string, listener: () => void) => void;
};

export default function HomeHero() {
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const pausedByUser = useRef(false);
  const manual = useRef(false);
  const visible = useRef(false);
  const mounted = useRef(false);
  const playAttempt = useRef(0);
  const mediaFailed = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [frameReady, setFrameReady] = useState(false);
  const [eligible, setEligible] = useState(false);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [slideState, setSlideState] = useState<{index: number; previous: number | null}>({index: 0, previous: null});
  const slide = slideState.index;

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const narrow = window.matchMedia('(max-width: 767px)');
    const connection = (navigator as Navigator & {connection?: Connection}).connection;
    let timer: number | undefined;
    mounted.current = true;
    const allowed = () => !motion.matches && !narrow.matches && !connection?.saveData &&
      !['slow-2g', '2g'].includes(connection?.effectiveType || '');
    const play = () => {
      timer = undefined;
      if (document.hidden || !visible.current || pausedByUser.current || (!manual.current && !allowed())) return;
      if (!el.src) el.src = VIDEO;
      const attempt = ++playAttempt.current;
      void el.play().catch(() => {
        if (mounted.current && attempt === playAttempt.current) { mediaFailed.current = true; setPlaying(false); setFrameReady(false); }
      });
    };
    const update = () => {
      if (timer !== undefined) { window.clearTimeout(timer); timer = undefined; }
      setEligible(allowed());
      setPageVisible(!document.hidden);
      if (document.hidden || !visible.current || (!manual.current && !allowed())) { el.pause(); return; }
      if (!pausedByUser.current && (manual.current || allowed())) timer = window.setTimeout(play, 0);
    };
    let observer: IntersectionObserver | null = null;
    try {
      if (typeof IntersectionObserver !== 'undefined') {
        observer = new IntersectionObserver(entries => {
          visible.current = entries[0]?.isIntersecting ?? false;
          setInView(visible.current);
          update();
        }, {threshold: 0.1});
        if (section.current) observer.observe(section.current);
      } else visible.current = false;
    } catch {
      observer?.disconnect();
      observer = null;
      visible.current = false;
    }
    const preferenceChange = () => {
      if (!allowed()) { manual.current = false; pausedByUser.current = true; }
      update();
    };
    document.addEventListener('visibilitychange', update);
    motion.addEventListener('change', preferenceChange);
    narrow.addEventListener('change', preferenceChange);
    connection?.addEventListener?.('change', preferenceChange);
    update();
    return () => {
      mounted.current = false;
      playAttempt.current++;
      if (timer !== undefined) window.clearTimeout(timer);
      observer?.disconnect();
      document.removeEventListener('visibilitychange', update);
      motion.removeEventListener('change', preferenceChange);
      narrow.removeEventListener('change', preferenceChange);
      connection?.removeEventListener?.('change', preferenceChange);
      el.pause();
    };
  }, []);

  useEffect(() => { if (!eligible) setSlideState(state => state.index === 0 ? state : {index: 0, previous: null}); }, [eligible]);

  // Rotate only while footage is actually playing, with no motion in constrained modes.
  useEffect(() => {
    if (!eligible || !playing || !frameReady || !inView || !pageVisible || hovered || focused) return;
    const timer = window.setInterval(() => setSlideState(({index}) => ({index: (index + 1) % 4, previous: index})), 3000);
    return () => window.clearInterval(timer);
  }, [eligible, playing, frameReady, inView, pageVisible, hovered, focused]);

  const toggle = () => {
    const el = video.current;
    if (!el) return;
    if (!el.paused && !mediaFailed.current) {
      playAttempt.current++;
      pausedByUser.current = true;
      el.pause();
    } else {
      pausedByUser.current = false;
      manual.current = true;
      if (!el.src) el.src = VIDEO;
      const attempt = ++playAttempt.current;
      void el.play().catch(() => {
        if (mounted.current && attempt === playAttempt.current) { mediaFailed.current = true; setPlaying(false); setFrameReady(false); }
      });
    }
  };

  return <section className="home-hero section-home-banner" ref={section}
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onFocusCapture={() => setFocused(true)}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }}>
    <div className="item-banner">
    <div className="hero-media img" aria-hidden="true">
      <img className="hero-poster" src={POSTER} alt="" fetchPriority="high" decoding="async"/>
      <video
        ref={video} className={frameReady ? 'is-ready' : undefined} muted loop playsInline preload="none"
        onPlay={() => { mediaFailed.current = false; setPlaying(true); }}
        onPlaying={() => { if (!video.current?.paused) { mediaFailed.current = false; setPlaying(true); setFrameReady(true); } }}
        onWaiting={() => setFrameReady(false)}
        onError={() => { playAttempt.current++; mediaFailed.current = true; setPlaying(false); setFrameReady(false); }}
        onPause={() => { setPlaying(false); setFrameReady(false); }}
      />
    </div>
    <div className="hero-shade"/>
    <div className="container hero-content wrap-content">
      <div className="wrap-slide-banner"><div className="item-content">
      <div className="hero-copy">
        <h1 className="hero-title-grid">
          <span className="hero-slide" data-position={slide === 3 ? "after" : slide > 0 ? "before" : "current"} data-active={slide === 0} aria-hidden={slide !== 0}>Kết nối nhân lực.<br/>Kiến tạo tương lai.</span>
          <span className="hero-slide" data-position={slide > 1 ? "before" : "after"} data-active={slide === 1} aria-hidden={slide !== 1}>Giới thiệu &amp; cung ứng nhân lực</span>
          <span className="hero-slide" data-position={slide > 2 ? "before" : "after"} data-active={slide === 2} aria-hidden={slide !== 2}>Cho thuê lao động</span>
          <span className="hero-slide" data-position={slide === 0 && slideState.previous === 3 ? "before" : "after"} data-active={slide === 3} aria-hidden={slide !== 3}>Headhunt &amp; lao động tay nghề</span>
        </h1>
        <div className="hero-description-grid">
          <p className="hero-slide" data-position={slide === 3 ? "after" : slide > 0 ? "before" : "current"} data-active={slide === 0} aria-hidden={slide !== 0}>Đồng hành cùng doanh nghiệp.<br className="mobile-break"/> Vững bước cùng người lao động.</p>
          <p className="hero-slide" data-position={slide > 1 ? "before" : "after"} data-active={slide === 1} aria-hidden={slide !== 1}>Kết nối người lao động và doanh nghiệp theo nhu cầu thực tế.</p>
          <p className="hero-slide" data-position={slide > 2 ? "before" : "after"} data-active={slide === 2} aria-hidden={slide !== 2}>Trao đổi phương án nhân lực linh hoạt cho kế hoạch vận hành.</p>
          <p className="hero-slide" data-position={slide === 0 && slideState.previous === 3 ? "before" : "after"} data-active={slide === 3} aria-hidden={slide !== 3}>Tìm kiếm nhân sự có kinh nghiệm và kỹ năng phù hợp.</p>
        </div>
      </div>
      <div className="hero-actions"><ButtonLink to={['/about-us', '/services/labor-supply', '/services/labor-leasing', '/services/recruitment'][slide]}>{slide === 0 ? 'Tìm hiểu Minh Đức' : 'Khám phá giải pháp'}</ButtonLink></div>
      </div></div>
    </div>
    <button type="button" className="video-control" aria-label={playing ? 'Tạm dừng chuyển động' : 'Phát chuyển động'} onClick={toggle}>
      {playing ? <Pause size={15}/> : <Play size={15}/>}<span>{playing ? 'Tạm dừng chuyển động' : 'Phát chuyển động'}</span>
    </button>
    </div>
  </section>;
}
