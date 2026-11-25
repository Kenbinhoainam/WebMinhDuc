import {useEffect, useRef, useState} from 'react';
import {Pause, Play} from 'lucide-react';
import PartnerLogo from './PartnerLogo';
import {partners} from './partners';
import {useTranslation} from './i18n';

/** Two wide visual sets create a continuous loop; only the first names are semantic. */
export default function PartnersStrip() {
 const t = useTranslation();
 const ref = useRef<HTMLDivElement>(null);
 const [paused, setPaused] = useState(false);
 const [visible, setVisible] = useState(false);
 const [staticFallback, setStaticFallback] = useState(true);
 useEffect(() => {
  const element = ref.current;
  if (!element || typeof IntersectionObserver === 'undefined') return;
  let active = true, intersecting = false;
  const update = () => { if (active) setVisible(intersecting && !document.hidden); };
  let observer: IntersectionObserver | undefined;
  try {
   observer = new IntersectionObserver(entries => { if (!active) return; intersecting = entries[0]?.isIntersecting ?? false; update(); }, {threshold: 0});
   observer.observe(element);
   setStaticFallback(false);
   document.addEventListener('visibilitychange', update);
  } catch {
   active = false;
   setStaticFallback(true);
   observer?.disconnect();
   return;
  }
  return () => { active = false; observer?.disconnect(); document.removeEventListener('visibilitychange', update); };
 }, []);
 const set = (duplicate: boolean) => <ul className="partners-set" aria-label={duplicate ? undefined : t({vi:'Các đối tác theo thông tin Minh Đức',en:'Partners listed by Minh Đức',zh:'明德提供的合作伙伴名单',ko:'민득이 제공한 파트너 목록',ja:'ミンドゥックが紹介するパートナー'})} aria-hidden={duplicate || undefined}>
  {partners.map(name => <li key={name}><PartnerLogo name={name}/></li>)}
  {partners.map(name => <li key={`repeat-${name}`} data-repeat="true" aria-hidden="true"><PartnerLogo name={name}/></li>)}
 </ul>;
 return <div ref={ref} className="partners-strip" data-paused={paused} data-visible={visible} data-static={staticFallback}>
  <div className="partners-viewport" tabIndex={0} role="region" aria-label={t({vi:'Đối tác tiêu biểu',en:'Featured partners',zh:'精选合作伙伴',ko:'주요 파트너',ja:'主なパートナー'})}>
   <div className="partners-track">{set(false)}{set(true)}</div>
  </div>
  <button type="button" className="partners-toggle" aria-label={paused ? t({vi:'Phát chuyển động đối tác',en:'Play partner animation',zh:'播放合作伙伴动画',ko:'파트너 애니메이션 재생',ja:'パートナーの動きを再生'}) : t({vi:'Tạm dừng chuyển động đối tác',en:'Pause partner animation',zh:'暂停合作伙伴动画',ko:'파트너 애니메이션 일시 정지',ja:'パートナーの動きを一時停止'})} aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? <Play size={16}/> : <Pause size={16}/>}<span>{paused ? t({vi:'Phát',en:'Play',zh:'播放',ko:'재생',ja:'再生'}) : t({vi:'Tạm dừng',en:'Pause',zh:'暂停',ko:'일시 정지',ja:'一時停止'})}</span></button>
 </div>;
}
