import {useEffect, useRef, useState} from 'react';
import {Pause, Play, RotateCcw, Volume2, VolumeX} from 'lucide-react';
import {ButtonLink} from './shared';
import {useTranslation} from './i18n';
import heroAssets from './hero-assets.json';
import './hero-media.css';

type Connection = {saveData?: boolean; effectiveType?: string; addEventListener?: (type: string, listener: () => void) => void; removeEventListener?: (type: string, listener: () => void) => void};
type Stage = 'poster' | 'playing' | 'fallback' | 'ended';

export default function HomeHero() {
  const t = useTranslation();
  const section = useRef<HTMLElement>(null), video = useRef<HTMLVideoElement>(null);
  const mounted = useRef(false), visible = useRef(false), manual = useRef(false), pausedByUser = useRef(false);
  const finished = useRef(false), failed = useRef(false), attempt = useRef(0), fallbackTried = useRef(false);
  const [stage, setStage] = useState<Stage>('poster');
  const [playing, setPlaying] = useState(false), [frameReady, setFrameReady] = useState(false), [muted, setMuted] = useState(true);
  const startPlayback = useRef<() => void>(() => {});
  const playLabel = t({vi:'Phát video giới thiệu',en:'Play company film',zh:'播放企业介绍视频',ko:'회사 소개 영상 재생',ja:'会社紹介動画を再生'});
  const pauseLabel = t({vi:'Tạm dừng video',en:'Pause video',zh:'暂停视频',ko:'영상 일시 정지',ja:'動画を一時停止'});
  const replayLabel = t({vi:'Xem lại video',en:'Watch again',zh:'重新播放',ko:'다시 보기',ja:'もう一度見る'});

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    mounted.current = true;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & {connection?: Connection}).connection;
    const allowed = () => !motion.matches && !connection?.saveData && !['slow-2g','2g'].includes(connection?.effectiveType || '');
    const play = () => {
      if (!mounted.current || finished.current || pausedByUser.current || document.hidden) return;
      if (!el.getAttribute('src')) {
        // MP4 is the smaller measured encode. WebM is a codec fallback, never a second parallel download.
        el.src = el.canPlayType('video/mp4') === '' && el.canPlayType('video/webm') !== '' ? heroAssets.webm : heroAssets.video;
      }
      const id = ++attempt.current;
      void el.play().catch(() => {
        if (mounted.current && id === attempt.current && !finished.current) {
          failed.current = true; setPlaying(false); setFrameReady(false); setStage('fallback');
        }
      });
    };
    startPlayback.current = play;
    const update = () => {
      if (!mounted.current) return;
      if (finished.current) return;
      if (document.hidden || !visible.current || (!manual.current && !allowed())) {
        attempt.current++; el.pause();
        if (!allowed()) setStage('fallback');
        return;
      }
      if (!pausedByUser.current && !failed.current) play();
    };
    let observer: IntersectionObserver | null = null, observing = false;
    try {
      if (typeof IntersectionObserver !== 'undefined') {
        observer = new IntersectionObserver(entries => {
          if (!mounted.current || !observing) return;
          visible.current = entries[0]?.isIntersecting ?? false;
          update();
        }, {threshold: .1});
        if (section.current) {observer.observe(section.current); observing = true;}
      } else setStage('fallback');
    } catch {observer?.disconnect(); observer = null; visible.current = false; setStage('fallback');}
    const preferenceChange = () => {
      if (!allowed()) {manual.current = false; pausedByUser.current = true;}
      update();
    };
    document.addEventListener('visibilitychange', update);
    motion.addEventListener('change', preferenceChange);
    connection?.addEventListener?.('change', preferenceChange);
    update();
    return () => {
      mounted.current = false; observing = false; attempt.current++;
      observer?.disconnect(); el.pause(); startPlayback.current = () => {};
      document.removeEventListener('visibilitychange', update);
      motion.removeEventListener('change', preferenceChange);
      connection?.removeEventListener?.('change', preferenceChange);
    };
  }, []);

  const togglePlayback = () => {
    const el = video.current;
    if (!el) return;
    if (!el.paused && !failed.current && !finished.current) {
      pausedByUser.current = true; attempt.current++; el.pause(); setPlaying(false);
    } else {
      if (finished.current) {el.currentTime = 0; finished.current = false; setFrameReady(false);}
      manual.current = true; pausedByUser.current = false; failed.current = false;
      startPlayback.current();
    }
  };
  const onError = () => {
    if (finished.current || !mounted.current) return;
    attempt.current++; setPlaying(false); setFrameReady(false);
    const el = video.current;
    if (el && !fallbackTried.current && el.canPlayType('video/webm') !== '' && !el.src.endsWith('.webm')) {
      fallbackTried.current = true; el.src = heroAssets.webm;
      if (visible.current && !document.hidden && !pausedByUser.current) startPlayback.current();
      else {failed.current = true; setStage('fallback');}
    } else {failed.current = true; setStage('fallback');}
  };
  const ending = stage === 'ended';
  const showBrand = ending || stage === 'fallback';
  return <section className="home-hero section-home-banner" data-stage={stage} ref={section} aria-label={t({vi:'Minh Đức Vina — Giới thiệu doanh nghiệp',en:'Minh Đức Vina — Company introduction',zh:'Minh Đức Vina — 企业介绍',ko:'Minh Đức Vina — 회사 소개',ja:'Minh Đức Vina — 会社紹介'})}>
    <div className="hero-stage">
      <div className="hero-media" aria-hidden="true">
        <img className="hero-poster" src={heroAssets.poster} width="1024" height="576" alt="" fetchPriority="high" decoding="async"/>
        <video ref={video} className={frameReady ? 'is-ready' : undefined} muted={muted} playsInline preload="none"
          onPlaying={() => {if (!finished.current && !pausedByUser.current && !video.current?.paused) {failed.current = false; setStage('playing'); setPlaying(true); setFrameReady(true);}}}
          onPause={() => setPlaying(false)}
          onEnded={() => {finished.current = true; attempt.current++; setPlaying(false); setStage('ended');}}
          onError={onError}/>
      </div>
      <div className={`hero-brand-finish${showBrand ? ' is-visible' : ''}`}>
        <img className="hero-finish-logo" src="/assets/minh-duc-logo-transparent.webp" width="384" height="274" alt="Minh Đức Vina" loading="lazy"/>
        <p className="hero-finish-slogan">{t({vi:'Nhân lực là tài sản',en:'People are our greatest asset',zh:'人才是宝贵的资产',ko:'인재는 소중한 자산입니다',ja:'人材はかけがえのない財産'})}</p>
        <p className="hero-finish-message">{t({vi:'Đồng hành cùng nhà máy và doanh nghiệp FDI miền Bắc.',en:'Supporting factories and FDI businesses in Northern Vietnam.',zh:'携手越南北部工厂与外资企业。',ko:'베트남 북부의 공장 및 외국인 투자 기업과 함께합니다.',ja:'ベトナム北部の工場・外資系企業とともに。'})}</p>
      </div>
      <noscript><style>{'.hero-brand-finish{opacity:1!important;visibility:visible!important}.hero-player-tools{display:none!important}'}</style></noscript>
      <div className="hero-player-tools">
        <button type="button" className={`video-control${!playing ? ' is-idle' : ''}`} onClick={togglePlayback} aria-label={ending ? replayLabel : playing ? pauseLabel : playLabel}>
          {ending ? <RotateCcw size={17}/> : playing ? <Pause size={17}/> : <Play size={17}/>}<span>{ending ? replayLabel : playing ? pauseLabel : playLabel}</span>
        </button>
        <button type="button" className="video-sound" aria-pressed={!muted} aria-label={muted ? t({vi:'Bật âm thanh',en:'Enable sound',zh:'开启声音',ko:'소리 켜기',ja:'音声をオン'}) : t({vi:'Tắt âm thanh',en:'Mute sound',zh:'关闭声音',ko:'소리 끄기',ja:'音声をオフ'})} onClick={() => setMuted(value => !value)}>{muted ? <VolumeX size={17}/> : <Volume2 size={17}/>}</button>
      </div>
    </div>
    <div className="hero-action-bar">
      <div className="container hero-action-inner">
        <h1 className="hero-semantic-heading">{t({vi:'Giải pháp nhân lực cho nhà máy và doanh nghiệp FDI miền Bắc',en:'Workforce solutions for factories and FDI businesses in Northern Vietnam',zh:'越南北部工厂与外资企业的人力资源解决方案',ko:'베트남 북부 공장 및 외국인 투자 기업을 위한 인력 솔루션',ja:'ベトナム北部の工場・外資系企業向け人材ソリューション'})}</h1>
        <div className="hero-actions">
          <ButtonLink to="/#business-contact">{t({vi:'Gửi nhu cầu nhân lực',en:'Request workforce support',zh:'提交用工需求',ko:'인력 지원 요청',ja:'人材の相談を送る'})}</ButtonLink>
          <ButtonLink to="/jobs" secondary>{t({vi:'Tìm việc làm',en:'Find a job',zh:'寻找工作',ko:'일자리 찾기',ja:'仕事を探す'})}</ButtonLink>
        </div>
      </div>
    </div>
  </section>;
}
