import {useRef,useState, type ReactNode} from 'react';
import {ArrowLeft, ArrowRight, BriefcaseBusiness, HeartHandshake, Lightbulb, Users, Pause, Play} from 'lucide-react';
import {Link} from 'react-router-dom';
import {useTranslation} from './i18n';
import {Modal} from './shared';
import {useHomeCarousel,advanceHomeRail} from './useHomeCarousel';
import './Careers.css';

const photo = {
  about: '/mirror/www.hr2b.com/wp-content/uploads/2025/10/about-banner.jpg',
  work: '/mirror/www.hr2b.com/wp-content/uploads/2025/09/Staff-oursourcing.jpg',
  people: '/mirror/www.hr2b.com/wp-content/uploads/2025/09/Co-hoi-viec-lam-scaled.jpg',
  first: '/mirror/www.hr2b.com/wp-content/uploads/2025/09/GPNS-1.jpg',
  second: '/mirror/www.hr2b.com/wp-content/uploads/2025/09/GPNS-2.jpg',
};

function CareerPause({paused,toggle}:{paused:boolean;toggle:()=>void}) {
 const t=useTranslation();
 const label=paused?t({vi:'Phát chuyển động',en:'Play motion',zh:'播放动画',ko:'움직임 재생',ja:'動きを再生'}):t({vi:'Tạm dừng chuyển động',en:'Pause motion',zh:'暂停动画',ko:'움직임 일시 정지',ja:'動きを一時停止'});
 return <button type="button" className="career-carousel-pause" aria-label={label} aria-pressed={paused} onClick={toggle}>{paused?<Play size={16}/>:<Pause size={16}/>}<span>{label}</span></button>;
}

type RailItem = {title:string; text:string};
function CareerRail({title,items}:{title:string;items:RailItem[]}) {
  const rail=useRef<HTMLDivElement>(null),area=useRef<HTMLElement>(null),t=useTranslation();
  const carousel=useHomeCarousel(area,()=>advanceHomeRail(rail.current),'.career-rail,.career-rail-controls');
  const move=(direction:number)=>{const el=rail.current;if(!el)return;const next=el.children[1] as HTMLElement|undefined;const step=next ? next.offsetLeft-(el.children[0] as HTMLElement).offsetLeft : el.clientWidth;el.scrollBy({left:direction*(step||el.clientWidth),behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})};
  return <section ref={area} className="career-block career-rail-section"><div className="container"><div className="career-heading-row"><h2>{title}</h2><div className="career-rail-controls"><button type="button" className="circle-button" onClick={()=>move(-1)} aria-label={t({vi:'Mục trước',en:'Previous item',zh:'上一项',ko:'이전 항목',ja:'前の項目'})}><ArrowLeft size={18}/></button><button type="button" className="circle-button" onClick={()=>move(1)} aria-label={t({vi:'Mục tiếp theo',en:'Next item',zh:'下一项',ko:'다음 항목',ja:'次の項目'})}><ArrowRight size={18}/></button></div></div><div className="career-rail" ref={rail} tabIndex={0} role="region" aria-label={title}>{items.map((item,i)=><article className="career-rail-card" key={item.title}>{i===0?<Users size={60}/>:i===1?<Lightbulb size={60}/>:<HeartHandshake size={60}/>}<div><h3>{item.title}</h3><p>{item.text}</p></div></article>)}</div><CareerPause paused={carousel.paused} toggle={carousel.toggle}/></div></section>;
}

/** HR2B-inspired section order with clearly illustrative Minh Đức content. */
export default function CareersSections({openings}:{openings:ReactNode}) {
 const [gallery,setGallery]=useState<number|null>(null),t=useTranslation(),storyRail=useRef<HTMLDivElement>(null),storyArea=useRef<HTMLElement>(null);
 const storyCarousel=useHomeCarousel(storyArea,()=>advanceHomeRail(storyRail.current),'.career-story-grid,.career-story-controls');
 const moveStory=(direction:number)=>{const el=storyRail.current;if(!el)return;const next=el.children[1] as HTMLElement|undefined;const step=next?next.offsetLeft-(el.children[0] as HTMLElement).offsetLeft:el.clientWidth;el.scrollBy({left:direction*(step||el.clientWidth),behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})};
 const galleryImages=[photo.work,photo.about,photo.people];
 const workspace=[
  {title:'Không gian kết nối',text:'Cùng trao đổi, phối hợp và hỗ trợ người lao động trong từng bước.'},
  {title:'Học từ thực tế',text:'Tích lũy kinh nghiệm qua các tình huống tuyển dụng và tư vấn.'},
  {title:'Đồng hành cùng nhau',text:'Chia sẻ kinh nghiệm để cùng giải quyết công việc.'},
 ];
 const benefits=[
  {title:'Phúc lợi theo vị trí',text:'Điều kiện và quyền lợi được trao đổi cụ thể khi tìm hiểu vị trí.'},
  {title:'Đào tạo và hướng dẫn',text:'Tìm hiểu quy trình và phát triển kỹ năng theo nhu cầu công việc.'},
  {title:'Cơ hội phát triển',text:'Mở rộng kinh nghiệm qua hoạt động kết nối và phối hợp.'},
 ];
 return <>
  <section className="section career-openings"><div className="container"><div id="open-positions">{openings}</div></div></section>
  <section className="career-block"><div className="container"><h2 className="career-center">Công việc ý nghĩa bắt đầu từ con người</h2><div className="career-feature-grid"><article><img src={photo.about} alt="" loading="lazy"/><div><h3>Đồng đội đồng hành</h3><p>Chia sẻ kinh nghiệm, hỗ trợ nhau và cùng giải quyết công việc.</p></div></article><article><img src={photo.work} alt="" loading="lazy"/><div><h3>Học từ thực tế</h3><p>Phát triển kỹ năng tư vấn, tuyển dụng và chăm sóc người lao động.</p></div></article></div></div></section>
  <CareerRail title="Không gian làm việc" items={workspace}/>
  <div id="position-benefits"><CareerRail title="Quyền lợi và phát triển" items={benefits}/></div>
  <section id="cv-requirements" className="career-block career-process"><div className="container"><h2 className="career-center">Chuẩn bị CV ứng tuyển</h2><div className="career-process-grid"><article><BriefcaseBusiness/><h3>Tìm hiểu vị trí</h3><p>Xem mô tả công việc của từng vị trí để hiểu nhiệm vụ và yêu cầu.</p></article><article><Lightbulb/><h3>Chuẩn bị hồ sơ</h3><p>CV nội bộ là bắt buộc. Biểu mẫu nhận PDF, DOC hoặc DOCX tối đa 5 MB.</p></article><article><Users/><h3>Trao đổi thông tin</h3><p>Liên hệ đội ngũ Minh Đức để làm rõ thông tin và các bước tiếp theo.</p></article></div><p className="career-demo-note">Nội dung minh họa; hồ sơ trong bản trải nghiệm không được tải lên hoặc gửi đi.</p></div></section>
  <section className="career-block career-buddy"><div className="container career-buddy-grid"><img src={photo.people} alt="" loading="lazy"/><div><HeartHandshake size={34}/><h2>Đồng hành khi bắt đầu</h2><p>Người mới có thể tìm hiểu công việc qua hướng dẫn, trao đổi và hỗ trợ từ đội ngũ.</p><div id="career-contact"><Link className="btn" to="/contact#consultation">Trao đổi với Minh Đức <ArrowRight size={18}/></Link></div></div></div></section>
  <section ref={storyArea} className="career-block career-stories"><div className="container"><h2 className="career-center">Những câu chuyện đồng hành</h2><p className="career-demo-note">Tình huống minh họa · Nhân vật giả định</p><div className="career-rail-controls career-story-controls"><button type="button" className="circle-button" onClick={()=>moveStory(-1)} aria-label={t({vi:'Câu chuyện trước',en:'Previous story',zh:'上一则故事',ko:'이전 이야기',ja:'前のストーリー'})}><ArrowLeft size={18}/></button><button type="button" className="circle-button" onClick={()=>moveStory(1)} aria-label={t({vi:'Câu chuyện tiếp theo',en:'Next story',zh:'下一则故事',ko:'다음 이야기',ja:'次のストーリー'})}><ArrowRight size={18}/></button></div><div className="career-story-grid" ref={storyRail} tabIndex={0} role="region" aria-label={t({vi:'Những câu chuyện đồng hành',en:'Stories of support',zh:'携手同行的故事',ko:'함께한 이야기',ja:'共に歩むストーリー'})}><blockquote><Users size={28} aria-hidden="true"/><p>“Một cuộc trao đổi rõ ràng giúp tôi hiểu công việc trước khi bắt đầu.”</p><footer>Ứng viên giả định</footer></blockquote><blockquote><Users size={28} aria-hidden="true"/><p>“Chia sẻ kinh nghiệm giúp cả nhóm phối hợp tốt hơn mỗi ngày.”</p><footer>Thành viên giả định</footer></blockquote><blockquote><Users size={28} aria-hidden="true"/><p>“Lắng nghe giúp chúng tôi tìm được hướng trao đổi phù hợp.”</p><footer>Đối tác giả định</footer></blockquote></div><CareerPause paused={storyCarousel.paused} toggle={storyCarousel.toggle}/></div></section>
  <section className="career-block career-gallery"><div className="container"><h2 className="career-center">Hình ảnh kết nối</h2><p className="career-demo-note">Hình ảnh minh họa cho giao diện, không thể hiện hoạt động thực tế.</p><div className="career-gallery-grid">{galleryImages.map((src,i)=><button type="button" key={src} onClick={()=>setGallery(i)} aria-label={`${t({vi:'Xem ảnh lớn',en:'Enlarge image',zh:'查看大图',ko:'이미지 확대',ja:'画像を拡大'})} ${i+1}`}><img src={src} alt="" loading="lazy"/></button>)}</div></div></section>
 {gallery!==null&&<Modal title={t({vi:'Hình ảnh minh họa',en:'Illustrative image',zh:'示意图片',ko:'예시 이미지',ja:'イメージ画像'})} onClose={()=>setGallery(null)}><img className="career-gallery-large" src={galleryImages[gallery]} alt=""/></Modal>}
 </>;
}
