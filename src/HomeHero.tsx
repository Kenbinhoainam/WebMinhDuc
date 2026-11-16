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
  const [userPaused, setUserPaused] = useState(false);
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
    const connection = (navigator as Navigator & {connection?: Connection}).connection;
    let timer: number | undefined;
    mounted.current = true;
    const allowed = () => !motion.matches && !connection?.saveData &&
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
    let observerActive = false;
    try {
      if (typeof IntersectionObserver !== 'undefined') {
        observer = new IntersectionObserver(entries => {
          if (!mounted.current || !observerActive) return;
          visible.current = entries[0]?.isIntersecting ?? false;
          setInView(visible.current);
          update();
        }, {threshold: 0.1});
        if (section.current) { observer.observe(section.current); observerActive = true; }
      } else visible.current = false;
    } catch {
      observer?.disconnect();
      observer = null;
      visible.current = false;
    }
    const preferenceChange = () => {
      if (!allowed()) { manual.current = false; pausedByUser.current = true; setUserPaused(true); }
      update();
    };
    document.addEventListener('visibilitychange', update);
    motion.addEventListener('change', preferenceChange);
    connection?.addEventListener?.('change', preferenceChange);
    update();
    return () => {
      mounted.current = false;
      observerActive = false;
      playAttempt.current++;
      if (timer !== undefined) window.clearTimeout(timer);
      observer?.disconnect();
      document.removeEventListener('visibilitychange', update);
      motion.removeEventListener('change', preferenceChange);
      connection?.removeEventListener?.('change', preferenceChange);
      el.pause();
    };
  }, []);

  useEffect(() => { if (!eligible) setSlideState(state => state.index === 0 ? state : {index: 0, previous: null}); }, [eligible]);

  // Text has its own cadence, even when video is loading or unavailable.
  useEffect(() => {
    if (!eligible || !inView || !pageVisible || userPaused || hovered || focused) return;
    const timer = window.setInterval(() => setSlideState(({index}) => ({index: (index + 1) % 3, previous: index})), 3000);
    return () => window.clearInterval(timer);
  }, [eligible, inView, pageVisible, userPaused, hovered, focused]);

  const toggle = () => {
    const el = video.current;
    if (!el) return;
    if (!pausedByUser.current && ((!el.paused && !mediaFailed.current) || (eligible && inView && pageVisible))) {
      playAttempt.current++;
      pausedByUser.current = true;
      setUserPaused(true);
      setPlaying(false);
      setFrameReady(false);
      el.pause();
    } else {
      pausedByUser.current = false;
      setUserPaused(false);
      manual.current = true;
      if (!el.src) el.src = VIDEO;
      const attempt = ++playAttempt.current;
      void el.play().catch(() => {
        if (mounted.current && attempt === playAttempt.current) { mediaFailed.current = true; setPlaying(false); setFrameReady(false); }
      });
    }
  };

  const motionEnabled = !userPaused && (playing || (eligible && inView && pageVisible));

  return <section className="home-hero section-home-banner" ref={section}
    onMouseEnter={() => { if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) setHovered(true); }} onMouseLeave={() => setHovered(false)}
    onFocusCapture={event => setFocused(!(event.target instanceof HTMLElement && !!event.target.closest('.video-control')))}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }}>
    <div className="item-banner">
    <div className="hero-media img" aria-hidden="true">
      <img className="hero-poster" src={POSTER} alt="" fetchPriority="high" decoding="async"/>
      <video
        ref={video} className={frameReady ? 'is-ready' : undefined} muted loop playsInline preload="none"
        onPlay={() => { if (!video.current?.paused && !pausedByUser.current) { mediaFailed.current = false; setPlaying(true); } }}
        onPlaying={() => { if (!video.current?.paused && !pausedByUser.current) { mediaFailed.current = false; setPlaying(true); setFrameReady(true); } }}
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
          <span className="hero-slide" data-position={slide === 2 ? "after" : slide > 0 ? "before" : "current"} data-active={slide === 0} aria-hidden={slide !== 0}>Giới thiệu &amp; cung ứng nhân lực</span>
          <span className="hero-slide" data-position={slide > 1 ? "before" : "after"} data-active={slide === 1} aria-hidden={slide !== 1}>Cho thuê lao động</span>
          <span className="hero-slide" data-position={slide === 0 && slideState.previous === 2 ? "before" : "after"} data-active={slide === 2} aria-hidden={slide !== 2}>Headhunt &amp; lao động tay nghề</span>
        </h1>
        <div className="hero-description-grid">
          <p className="hero-slide" data-position={slide === 2 ? "after" : slide > 0 ? "before" : "current"} data-active={slide === 0} aria-hidden={slide !== 0}>Kết nối người lao động và doanh nghiệp theo nhu cầu thực tế.</p>
          <p className="hero-slide" data-position={slide > 1 ? "before" : "after"} data-active={slide === 1} aria-hidden={slide !== 1}>Trao đổi phương án nhân lực linh hoạt cho kế hoạch vận hành.</p>
          <p className="hero-slide" data-position={slide === 0 && slideState.previous === 2 ? "before" : "after"} data-active={slide === 2} aria-hidden={slide !== 2}>Tìm kiếm nhân sự có kinh nghiệm và kỹ năng phù hợp.</p>
        </div>
      </div>
      <div className="hero-actions"><ButtonLink to={['/services/labor-supply', '/services/labor-leasing', '/services/recruitment'][slide]}>Khám phá giải pháp</ButtonLink></div>
      </div></div>
    </div>
    <button type="button" className="video-control" aria-label={motionEnabled ? 'Tạm dừng chuyển động' : 'Phát chuyển động'} onClick={toggle}>
      {motionEnabled ? <Pause size={15}/> : <Play size={15}/>}<span>{motionEnabled ? 'Tạm dừng chuyển động' : 'Phát chuyển động'}</span>
    </button>
    </div>
  </section>;
}
