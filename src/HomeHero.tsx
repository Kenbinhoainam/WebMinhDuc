import {useEffect, useRef, useState} from 'react';
import {Pause, Play} from 'lucide-react';
import {ButtonLink} from './shared';
import './hero-media.css';

const VIDEO = '/optimized/hero-1280.mp4';
const POSTER = '/optimized/assets/hero-poster-1600.webp';
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
  const visible = useRef(true);
  const [playing, setPlaying] = useState(false);
  const [frameReady, setFrameReady] = useState(false);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const narrow = window.matchMedia('(max-width: 767px)');
    const connection = (navigator as Navigator & {connection?: Connection}).connection;
    let timer: number | undefined;
    let mounted = true;
    const allowed = () => !motion.matches && !narrow.matches && !connection?.saveData &&
      !['slow-2g', '2g'].includes(connection?.effectiveType || '');
    const play = () => {
      timer = undefined;
      if (document.hidden || !visible.current || pausedByUser.current || (!manual.current && !allowed())) return;
      if (!el.src) el.src = VIDEO;
      void el.play().catch(() => {
        if (mounted) { setPlaying(false); setFrameReady(false); }
      });
    };
    const update = () => {
      if (timer !== undefined) { window.clearTimeout(timer); timer = undefined; }
      if (document.hidden || !visible.current || (!manual.current && !allowed())) { el.pause(); return; }
      if (!pausedByUser.current && (manual.current || allowed())) timer = window.setTimeout(play, manual.current ? 0 : 1500);
    };
    let observer: IntersectionObserver | null = null;
    try {
      if (typeof IntersectionObserver !== 'undefined') {
        observer = new IntersectionObserver(entries => {
          visible.current = entries[0]?.isIntersecting ?? true;
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
      mounted = false;
      if (timer !== undefined) window.clearTimeout(timer);
      observer?.disconnect();
      document.removeEventListener('visibilitychange', update);
      motion.removeEventListener('change', preferenceChange);
      narrow.removeEventListener('change', preferenceChange);
      connection?.removeEventListener?.('change', preferenceChange);
      el.pause();
    };
  }, []);

  const toggle = () => {
    const el = video.current;
    if (!el) return;
    if (!el.paused) {
      pausedByUser.current = true;
      el.pause();
    } else {
      pausedByUser.current = false;
      manual.current = true;
      if (!el.src) el.src = VIDEO;
      void el.play().catch(() => { setPlaying(false); setFrameReady(false); });
    }
  };

  return <section className="home-hero" ref={section}>
    <div className="hero-media" aria-hidden="true">
      <img className="hero-poster" src={POSTER} alt="" fetchPriority="high" decoding="async"/>
      <video
        ref={video} className={frameReady ? 'is-ready' : undefined} muted loop playsInline preload="none"
        onPlay={() => setPlaying(true)}
        onPlaying={() => { if (!video.current?.paused) setFrameReady(true); }}
        onWaiting={() => setFrameReady(false)}
        onError={() => { setPlaying(false); setFrameReady(false); }}
        onPause={() => { setPlaying(false); setFrameReady(false); }}
      />
    </div>
    <div className="hero-shade"/>
    <div className="container hero-content"><span className="hero-kicker"><span/> MINH ĐỨC VINA</span><h1>Kết nối nhân lực.<br/>Kiến tạo tương lai.</h1><p>Đồng hành cùng doanh nghiệp.<br className="mobile-break"/> Vững bước cùng người lao động.</p><div className="hero-actions"><ButtonLink to="/services">Tôi cần tuyển nhân lực</ButtonLink><ButtonLink to="/jobs" secondary>Tôi đang tìm việc</ButtonLink></div></div>
    <button type="button" className="video-control" aria-label={playing ? 'Tạm dừng video' : 'Phát video'} onClick={toggle}>
      {playing ? <Pause size={15}/> : <Play size={15}/>}<span>{playing ? 'Tạm dừng video' : 'Phát video'}</span>
    </button>
  </section>;
}
