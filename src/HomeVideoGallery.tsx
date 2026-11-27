import {useCallback, useEffect, useRef, useState, type MouseEvent} from 'react';
import {flushSync} from 'react-dom';
import {Play} from 'lucide-react';
import {useLocale, useTranslation, type Translation} from './i18n';
import {videoLibrary, type LibraryVideo} from './video-library';
import './home-video-gallery.css';

const kinds: Record<LibraryVideo['kind'], Translation> = {
  full: {vi:'Phim đầy đủ',en:'Full film',zh:'完整影片',ko:'전체 영상',ja:'本編'},
  excerpt: {vi:'Trích đoạn',en:'Excerpt',zh:'影片片段',ko:'발췌 영상',ja:'抜粋'},
  photo: {vi:'Câu chuyện qua ảnh',en:'Photo story',zh:'影像故事',ko:'사진 이야기',ja:'写真で見るストーリー'},
};

function durationLabel(seconds: number) {
  const whole = Math.floor(seconds);
  return Math.floor(whole / 60) + ':' + String(whole % 60).padStart(2,'0');
}

function FilmThumbnail({film, featured = false}: {film: LibraryVideo; featured?: boolean}) {
  return <>
    <img src={featured ? film.poster : film.thumbnail.large} alt="" width={featured ? 960 : 320} height={featured ? 540 : 180}
      srcSet={featured ? undefined : film.thumbnail.small + ' 160w, ' + film.thumbnail.large + ' 320w'}
      sizes={featured ? '(min-width:1000px) 66vw, 94vw' : '(max-width:639px) clamp(88px,30vw,145px), (max-width:999px) clamp(90px,15vw,136px), clamp(94px,8.7vw,145px)'}
      loading="lazy" decoding="async"/>
    <span className="film-play-icon" aria-hidden="true"><Play fill="currentColor" strokeWidth={1.5}/></span>
    <time className="film-time" dateTime={'PT' + Math.floor(film.duration) + 'S'}>{durationLabel(film.duration)}</time>
  </>;
}

export function HomeVideoGallery() {
  const t = useTranslation(), locale = useLocale();
  const [requested, setRequested] = useState<LibraryVideo | null>(null);
  const [problem, setProblem] = useState<'file' | 'gesture' | null>(null);
  const film = requested ?? videoLibrary[0];
  const player = useRef<HTMLVideoElement | null>(null);
  const posterLink = useRef<HTMLAnchorElement>(null);
  const playLabel = t({vi:'Phát video',en:'Play video',zh:'播放视频',ko:'영상 재생',ja:'動画を再生'});

  const attachPlayer = useCallback((node: HTMLVideoElement | null) => {
    if (!node) return;
    player.current = node;
    return () => {
      player.current = null;
      node.pause();
      node.removeAttribute('src');
      node.load();
    };
  }, []);

  useEffect(() => {
    if (problem === 'file') posterLink.current?.focus({preventScroll:true});
  }, [problem]);

  function play(node: HTMLVideoElement) {
    void node.play().catch((error: Error) => {
      if (node === player.current && node.paused && !node.error && error.name !== 'AbortError') setProblem('gesture');
    });
  }

  function selectFilm(event: MouseEvent<HTMLAnchorElement>, next: LibraryVideo) {
    // A modified click and a no-JavaScript visit both open the actual media file.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const {muted = false,volume = 1,playbackRate = 1} = player.current ?? {};
    if (next.id !== requested?.id || problem === 'file') {
      // Mount before calling play so mobile Safari receives the original user's activation.
      flushSync(() => {setRequested(next); setProblem(null);});
    }
    const node = player.current;
    if (!node) return;
    if (!node.hasAttribute('src')) {
      node.src = next.webm && !node.canPlayType('video/mp4') && node.canPlayType('video/webm') ? next.webm : next.src;
      node.muted = muted;
      node.volume = volume;
      node.playbackRate = playbackRate;
    }
    if (node.ended) node.currentTime = 0;
    if (node.paused) play(node);
    node.focus({preventScroll:true});
    const bounds = node.getBoundingClientRect();
    const headerBottom = document.querySelector('.site-header')?.getBoundingClientRect().bottom ?? 0;
    if (bounds.height > 0 && (bounds.top < headerBottom || bounds.bottom > window.innerHeight)) {
      node.scrollIntoView({block:'center',behavior:'instant'});
    }
  }

  function handleError(node: HTMLVideoElement) {
    if (node !== player.current) return;
    if (film.webm && node.getAttribute('src') !== film.webm && node.canPlayType('video/webm')) {
      node.src = film.webm;
      play(node);
    } else {
      setProblem('file');
    }
  }

  return <section className="home-films" aria-labelledby="home-films-heading">
    <div className="home-films-shell">
      <h2 id="home-films-heading">{t({vi:'Video giới thiệu',en:'Company videos',zh:'企业视频',ko:'기업 소개 영상',ja:'紹介動画'})}</h2>
      <div className="home-films-layout">
        <article className="home-film-feature" aria-labelledby="home-film-title">
          <div className="home-film-screen" id="home-film-stage">
            {requested && problem !== 'file' ? <video key={film.id} ref={attachPlayer} controls playsInline preload="none" tabIndex={0}
              poster={film.poster} aria-labelledby="home-film-title" aria-describedby="home-film-description"
              onError={event => handleError(event.currentTarget)} onPlaying={() => setProblem(null)}/> :
              <a ref={posterLink} className="home-film-poster" href={film.src} onClick={event => selectFilm(event,film)}
                aria-label={playLabel + ' – ' + film.title[locale]}>
                <FilmThumbnail film={film} featured/>
              </a>}
          </div>
          <h3 id="home-film-title">{film.title[locale]}</h3>
          <p id="home-film-description">{film.description[locale]}</p>
          {problem && <p role="status" className="home-film-notice">{problem === 'gesture'
            ? t({vi:'Nhấn nút phát trong trình xem để bắt đầu.',en:'Press play in the player to begin.',zh:'请按播放器中的播放键开始。',ko:'플레이어의 재생 버튼을 눌러 시작하세요.',ja:'プレーヤーの再生ボタンを押してください。'})
            : <>{t({vi:'Không thể phát video này.',en:'This video could not be played.',zh:'无法播放此视频。',ko:'이 영상을 재생할 수 없습니다.',ja:'この動画を再生できません。'})}{' '}
              <a href={film.src}>{t({vi:'Mở tệp video',en:'Open the video file',zh:'打开视频文件',ko:'영상 파일 열기',ja:'動画ファイルを開く'})}</a></>}</p>}
        </article>
        <div className="home-film-playlist">
          <h3 id="film-playlist-heading">{t({vi:'Danh sách phát',en:'Playlist',zh:'播放列表',ko:'재생목록',ja:'プレイリスト'})}</h3>
          <ul aria-labelledby="film-playlist-heading">{videoLibrary.map(item =>
            <li key={item.id}>
              <a href={item.src} aria-controls="home-film-stage" aria-current={item.id === film.id ? 'true' : undefined}
                onClick={event => selectFilm(event,item)}>
                <span className="film-thumb"><FilmThumbnail film={item}/></span>
                <span className="film-item-copy"><span className="film-kind">{t(kinds[item.kind])}</span><strong>{item.title[locale]}</strong></span>
              </a>
            </li>)}</ul>
        </div>
      </div>
    </div>
  </section>;
}
