from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin,urlparse
import json,re,os,sys
P=Path(__file__).resolve().parents[1]; public=P/'public'; dist=P/'dist'; domain='https://minhduc-prototype-sprint1.kenbinhoainam.chatgpt.site'; hero=json.loads((P/'src/hero-assets.json').read_text()); career=json.loads((P/'src/careers-media.json').read_text()); manifest=json.loads((P/'src/media-manifest.json').read_text()); reverse={v['src']:k for k,x in manifest.items() for v in x['variants']};reverse.update({'/assets/minh-duc-favicon-96.png':'/assets/minh-duc-logo.jpg','/assets/minh-duc-apple-touch.png':'/assets/minh-duc-logo.jpg'});
reverse[hero['webm']]=hero['video']
reverse.update({'/assets/minh-duc-logo-transparent.webp':'/assets/minh-duc-logo.jpg','/assets/minh-duc-logo-transparent.png':'/assets/minh-duc-logo.jpg'})
records={}; voids={'img','source','br','hr','input','link','meta','embed','wbr','area','base','col','param','track'}
class Parser(HTMLParser):
 def __init__(self,route,metadata_only=False):super().__init__(convert_charrefs=True);self.stack=[];self.route=route;self.metadata_only=metadata_only
 def handle_starttag(self,tag,attrs):
  d=dict(attrs)
  if tag=='meta' and (d.get('property') in ('og:image','twitter:image') or d.get('name') in ('og:image','twitter:image')):
   value=d.get('content','');url=urlparse(value)
   if url.netloc==urlparse(domain).netloc:add(url.path,self.route,'metadata-share','Ảnh chia sẻ liên kết','metadata')
  if tag=='link' and d.get('rel') in ('icon','apple-touch-icon') and d.get('href'):
   add(d['href'],self.route,'metadata-icon','Biểu tượng trình duyệt' if d.get('rel')=='icon' else 'Biểu tượng Apple touch','icon')
  if self.metadata_only:return
  frame=(tag,d.get('class',''),d.get('id',''));ctx=self.stack+[frame];section=next((x for x in reversed(ctx) if x[0] in ('section','header','footer')),None); classes=' '.join(x[1] for x in ctx[-6:]); position=(section[1] or section[2] or section[0]) if section else ('header' if any(x[0]=='header' for x in ctx) else 'khối nội dung');
  for attr in ('src','poster'):
   if tag in ('img','video','source') and d.get(attr):add(d[attr],self.route,position,classes,attr)
  if tag=='img' and d.get('srcset'):
   for entry in d['srcset'].split(','):add(entry.strip().split(' ')[0],self.route,position,classes,'srcset')
  for url in re.findall(r'url\(["\']?([^"\')]+)',d.get('style','')):add(url,self.route,position,classes,'background')
  if tag not in voids:self.stack.append(frame)
 def handle_startendtag(self,tag,attrs):self.handle_starttag(tag,attrs);self.handle_endtag(tag)
 def handle_endtag(self,tag):
  for i in range(len(self.stack)-1,-1,-1):
   if self.stack[i][0]==tag:self.stack=self.stack[:i];break

def add(actual,route,position,classes,kind):
 if not actual.startswith('/') or actual.startswith('//'):return
 logical=reverse.get(actual,actual);key=logical
 r=records.setdefault(key,{'logical_path':logical,'actual_paths':set(),'uses':set(),'types':set()});r['actual_paths'].add(actual);r['uses'].add((route,position,classes,kind));r['types'].add(kind)
for f in dist.rglob('index.html'):
 rel=f.relative_to(dist).parts
 route='/' if len(rel)==1 else '/'+('/'.join(rel[:-1]));localized=bool(rel and rel[0] in ('en','zh','ko','ja','vi'));parser=Parser(route,metadata_only=localized);parser.feed(f.read_text(errors='replace'))
# Dynamic sources and CSS asset references not present as HTML image nodes.
add(hero['video'],'/','section-home-banner','hero-media','video động')
add(hero['webm'],'/','section-home-banner','hero-media','video WebM dự phòng')
add(hero['video'],'/','section-home-video','hộp thoại video doanh nghiệp','video MP4 hộp thoại')
add(hero['webm'],'/','section-home-video','hộp thoại video doanh nghiệp','video WebM hộp thoại')
add(hero['poster'],'/','section-home-video','poster hộp thoại video','poster')
# News pagination can reveal all six article cards even though SSR renders only page one.
for logical in ['/mirror/www.hr2b.com/wp-content/uploads/2025/09/Co-hoi-viec-lam-scaled.jpg','/mirror/www.hr2b.com/wp-content/uploads/2025/08/staffing-logictis-1.jpg','/mirror/www.hr2b.com/wp-content/uploads/2025/10/Executive-Search-banner.jpg','/mirror/www.hr2b.com/wp-content/uploads/2025/08/khung-luong-canh-tranh.jpg','/mirror/www.hr2b.com/wp-content/uploads/2025/09/Staff-oursourcing.jpg','/mirror/www.hr2b.com/wp-content/uploads/2026/11/bao-mat-thong-tin-tien-luong.jpg']:
 for variant in manifest.get(logical,{}).get('variants',[]):add(variant['src'],'/news','section info-news-section','info-news-card','srcset trang tin phân trang')
# The gallery dialog is mounted only after user interaction and is absent from prerendered HTML.
for logical in career['gallery']:
 variants=manifest.get(logical,{}).get('variants',[])
 for actual in ([v['src'] for v in variants] if variants else [logical]):
  add(actual,'/careers','career-gallery-dialog','ảnh phóng lớn trong hộp thoại','srcset hộp thoại')
# Local image URLs in these scoped stylesheets are recorded as CSS references;
# CSS references alone do not prove that a selector was visible or requested.
for css,route in [('src/Careers.css','/careers'),('src/footer-reference.css','/'),('src/info.css','/services'),('src/hero-media.css','/')]:
 text=(P/css).read_text() if (P/css).exists() else ''
 for url in re.findall(r'url\([\"\']?([^\"\')]+)',text):
  if re.search(r'\.(?:avif|webp|png|jpe?g|svg|gif)$',url,re.I):add(url,route,'stylesheet-reference',css,'tham chiếu CSS')
# Both runtime formats represent the same complete company video.
video_key=hero['video']
# Proven original source from reference capture manifest; no source inferred from filename alone.
provpath=Path('/workspace/reference/hr2b-live-20261116/drive-source/assets-provenance.jsonl');proven={}
if provpath.exists():
 for line in provpath.read_text().splitlines():
  x=json.loads(line);url=x.get('original_url',''); original=Path(x.get('local_path',''))
  if '/wp-content/' in url:
   logical='/mirror/www.hr2b.com/wp-content/'+url.split('/wp-content/',1)[1];local=public/logical.lstrip('/')
   if original.is_file() and local.is_file():
    import hashlib
    if hashlib.sha256(original.read_bytes()).digest()==hashlib.sha256(local.read_bytes()).digest():proven[logical]=url
live_manifest=Path('/workspace/reference/hr2b-live-current-20261116/assets/manifest.json')
if live_manifest.exists():
 for entry in json.loads(live_manifest.read_text()):
  u=entry.get('url',''); base='https://www.hr2b.com/wp-content/'
  if entry.get('status')==200 and u.startswith(base) and '?' not in u:
   logical='/mirror/www.hr2b.com/wp-content/'+u[len(base):];f=public/logical.lstrip('/')
   if f.is_file():
    import hashlib
    if hashlib.sha256(f.read_bytes()).hexdigest()==entry.get('sha256'):proven[logical]=u
proven.update({'/assets/minh-duc-logo.jpg':'https://drive.google.com/file/d/1hGEA2GRDv3MMZrO-h8qlL21Yz05ePKxY/view?usp=sharing','/partners/samsung.svg':'https://github.com/simple-icons/simple-icons/blob/develop/icons/samsung.svg','/partners/foxconn.svg':'https://github.com/mcorrig4/cascade-money/blob/5de49fa24665a0d162ed0b66913a594181d3979f/app/public/logos/foxconn.svg','/partners/luxshare.webp':'https://github.com/htferretti/liberaopreto/blob/80b7f8d0c897190711099dc9822d306386a13a12/src/assets/manufactors/luxshare.png',video_key:'https://drive.google.com/file/d/1i4ZHg9BAApueTxur4KwU_oXxH-NqbMHu/view'})
labels={'section-home-banner':'Ảnh nền và video hero đầu trang','section-home-about-achievement':'Các thẻ chỉ số minh họa','section-home-about':'Giới thiệu Minh Đức','section-home-solution':'Thẻ dịch vụ và giải pháp','section-home-customer':'Dải đối tác và thẻ cảm nhận minh họa','section-home-coop':'Lưới đối tác tiêu biểu','section-home-news':'Các thẻ tin tức trang chủ','section-home-event':'Thẻ sự kiện trang chủ','section-home-video':'Khu vực video doanh nghiệp','page-hero':'Ảnh nền phần đầu trang','page-banner-main':'Ảnh nền phần đầu trang','info-history':'Dòng lịch sử hình thành','info-event-overview':'Tổng quan sự kiện','info-event-location':'Thông tin địa điểm sự kiện','info-event-band':'Thư viện ảnh sự kiện','info-article-layout':'Ảnh nội dung bài viết','info-related-news':'Các bài viết liên quan','info-news-section':'Danh sách và tin nổi bật','info-news-card':'Thẻ bài viết','info-intro-grid':'Khối giới thiệu nội dung','info-about-intro':'Giới thiệu và giá trị Minh Đức','header':'Logo trong thanh điều hướng','info-service-rail':'Dải dịch vụ liên quan','info-service-why':'Lý do lựa chọn dịch vụ','info-service-customers':'Đối tượng khách hàng dịch vụ','info-event-list':'Danh sách sự kiện','info-team-grid':'Các thẻ nội bộ','career-reference-rows':'Khối giới thiệu tuyển dụng nội bộ','career-block':'Nội dung tuyển dụng nội bộ'}
# New local WebP conversions of the two files in the verified reference capture.
proven.update({'/assets/editorial/admissions-seminar.webp':'https://www.hr2b.com/wp-content/uploads/2025/09/Su-kien.jpg','/assets/editorial/business-team.webp':'https://www.hr2b.com/wp-content/uploads/2025/09/LSHT.jpg'})
def label(pos,classes):
 if pos=='metadata-share':return 'Ảnh chia sẻ liên kết (Open Graph/Twitter)'
 if pos=='metadata-icon':return 'Biểu tượng Apple touch' if 'Apple' in classes else 'Biểu tượng trình duyệt'
 if 'hero-finish-logo' in classes:return 'Logo ở thẻ kết sau video'
 if 'footer-social' in classes:return 'Liên kết mạng xã hội ở chân trang'
 if 'home-b2b-offices' in pos:return 'Các địa điểm kết nối doanh nghiệp'
 if 'info-team' in pos:return 'Đội ngũ trên trang giới thiệu'
 if 'career-gallery-dialog' in pos:return 'Hộp thoại phóng lớn ảnh tuyển dụng nội bộ'
 if 'career-introduction' in pos:return 'Giới thiệu công việc và đồng đội'
 if 'career-rail-section' in pos:return 'Quyền lợi và phát triển' if 'is-benefits' in pos else 'Không gian làm việc'
 if 'career-process' in pos:return 'Các bước chuẩn bị CV'
 if 'career-buddy' in pos:return 'Đồng hành khi bắt đầu công việc'
 if 'career-gallery' in pos:return 'Thư viện hình ảnh tuyển dụng nội bộ'
 if 'md-about-partners' in pos:return 'Đối tác tại trang giới thiệu'
 if 'md-ref-service-intro' in pos:return 'Giới thiệu giải pháp dịch vụ'
 if 'md-ref-detail-section' in pos and not any(k in classes for k in ('md-ref-detail-intro','md-ref-detail-copy','md-ref-detail-process')):return 'Khối nội dung chi tiết dịch vụ'
 if 'md-ref-service-metrics' in classes:return 'Họa tiết khối số liệu dịch vụ'
 if 'md-ref-detail-intro' in classes:return 'Ảnh giới thiệu chi tiết dịch vụ'
 if 'md-ref-detail-copy' in classes:return 'Minh họa nội dung chi tiết dịch vụ'
 if 'md-ref-detail-process' in classes:return 'Minh họa quy trình dịch vụ'
 if 'editorial-related-aside' in classes:return 'Bài viết liên quan trong thanh bên'
 if 'stylesheet-reference' in pos and 'hero-media.css' in classes:return 'Ảnh nền khung hero và màn kết thúc (tham chiếu CSS)'
 if 'stylesheet-reference' in pos:return 'Tài nguyên tham chiếu trong CSS (chưa xác nhận hiển thị)'
 if 'brand' in classes:return 'Logo Minh Đức ở đầu trang'
 if 'reference-footer' in pos:return 'Logo Minh Đức ở chân trang'
 if ('/partners' in pos):return 'Đối tác tiêu biểu'
 if 'section container' == pos and 'partner' in classes:return 'Lưới đối tác tiêu biểu'
 for k,v in labels.items():
  if k in pos or k in classes:return v
 return 'Khu vực '+(pos or 'nội dung')
names={
 'hero-poster.jpg':'Ảnh tĩnh mở đầu video','minh-duc-about.webp':'Minh họa giới thiệu Minh Đức','minh-duc-logo.jpg':'Logo Minh Đức',
 'edge-1-no-noise.png':'Họa tiết góc khu giới thiệu','edge-2.png':'Họa tiết góc khu chỉ số','edge-3.png':'Họa tiết trái khu cảm nhận','edge-4.png':'Họa tiết phải khu cảm nhận',
 'khung-luong-canh-tranh.jpg':'Ảnh minh họa thông tin tuyển dụng','staffing-logictis-1.jpg':'Ảnh minh họa nhân lực và sản xuất','Co-hoi-viec-lam-scaled.jpg':'Ảnh minh họa cơ hội việc làm',
 'Advantages-1.png':'Biểu tượng Tầm nhìn','Advantages-2.png':'Biểu tượng Sứ mệnh','Advantages-3.png':'Biểu tượng Giá trị cốt lõi',
 'GPNS-1.jpg':'Ảnh giải pháp nhân sự 1','GPNS-2.jpg':'Ảnh giải pháp nhân sự 2','GPNS-3.jpg':'Ảnh giải pháp nhân sự 3',
 'Lien-he.jpg':'Ảnh minh họa liên hệ','Solution-Icon-1.png':'Biểu tượng giải pháp nhân sự 1','Solution-Icon-2.png':'Biểu tượng giải pháp nhân sự 2','Solution-Icon-3.png':'Biểu tượng giải pháp nhân sự 3',
 'Staff-oursourcing.jpg':'Ảnh minh họa cung ứng nhân lực','Tin-tuc.jpg':'Ảnh minh họa tin tức','Executive-Search-banner.jpg':'Ảnh minh họa tuyển chọn nhân sự','about-banner.jpg':'Ảnh nền giới thiệu và sự kiện','bao-mat-thong-tin-tien-luong.jpg':'Ảnh minh họa an toàn thông tin',
 Path(hero['video']).name:'Video giới thiệu doanh nghiệp Minh Đức','foxconn.svg':'Logo FOXCONN','luxshare.webp':'Logo Luxshare ICT','samsung.svg':'Logo SAMSUNG'}
# Display names describe placement rather than asserting that stock photos depict Minh Đức.
names.update({'minhduc-poster-1s.webp':'Poster video giới thiệu (khung giây 1)','minhduc-meeting-10s.webp':'Ảnh trích video: buổi họp (giây 10)','minhduc-offices-20s.webp':'Ảnh trích video: hình ghép (giây 20)','minhduc-title-45s.webp':'Ảnh trích video: tên doanh nghiệp (giây 45)','minhduc-working-60s.webp':'Ảnh trích video: trao đổi công việc (giây 60)','15.png':'Họa tiết khối số liệu dịch vụ','fb.svg':'Biểu tượng Facebook','zalo.svg':'Biểu tượng Zalo'})
names[Path(career['banner']).name]='Ảnh nền trang tuyển dụng nội bộ'
names.update({'admissions-seminar.webp':'Ảnh minh họa hội thảo và học tập','business-team.webp':'Ảnh minh họa trao đổi công việc'})
for category,asset_label in [('features','Ảnh giới thiệu tuyển dụng nội bộ'),('workspace','Biểu tượng không gian làm việc'),('benefits','Biểu tượng quyền lợi'),('steps','Biểu tượng chuẩn bị CV'),('gallery','Ảnh thư viện tuyển dụng nội bộ')]:
 for i,path in enumerate(career[category],1):names.setdefault(Path(path).name,f'{asset_label} {i}')
names.setdefault(Path(career['buddy']).name,'Ảnh minh họa đồng hành khi bắt đầu')
def purpose(desc,logical):
 n=Path(logical).name
 if n=='15.png':return 'Họa tiết trang trí khối số liệu minh họa.'
 if n in ('fb.svg','zalo.svg'):return 'Biểu tượng liên kết đến kênh liên hệ tương ứng.'
 if 'tuyển dụng nội bộ' in desc or 'công việc' in desc:return 'Minh họa nội dung tuyển dụng nội bộ; không khẳng định là hoạt động thực tế của Minh Đức.'
 if n.startswith('edge-'):return 'Trang trí nền, không truyền đạt nội dung.'
 if n.startswith('Advantages-'):return 'Biểu tượng minh họa cho thẻ '+{'Advantages-1.png':'Tầm nhìn','Advantages-2.png':'Sứ mệnh','Advantages-3.png':'Giá trị cốt lõi'}.get(n,'giá trị')+'.'
 if n.startswith('Solution-Icon-'):return 'Biểu tượng minh họa cho nội dung thẻ dịch vụ.'
 if logical.startswith('/partners/'):return 'Nhận diện đối tác trong danh sách tên do Minh Đức cung cấp.'
 if n=='minh-duc-logo.jpg':
  if 'chia sẻ' in desc:return 'Hình ảnh hiển thị khi chia sẻ đường dẫn lên nền tảng hỗ trợ Open Graph hoặc Twitter.'
  if 'Biểu tượng' in desc:return 'Nhận diện trang trong thẻ trình duyệt hoặc khi thêm vào màn hình chính.'
  return 'Nhận diện thương hiệu và liên kết về trang chủ.'
 if logical==video_key:return 'Video giới thiệu doanh nghiệp đầy đủ, phát ở hero hoặc khi mở hộp thoại xem video.'
 if n.startswith('minhduc-poster-'):return 'Ảnh tĩnh từ video nguồn hiển thị trước khi phát.'
 if n.startswith('minhduc-') and n.endswith('s.webp'):return 'Khung hình trích từ video Minh Đức được dùng để minh họa nội dung trên trang.'
 if n=='hero-poster.jpg':return 'Ảnh tĩnh hiển thị trước khi video phát hoặc trong hộp thoại video.'
 if 'đầu trang' in desc:return 'Ảnh nền minh họa cho tiêu đề và chủ đề trang.'
 if 'lịch sử' in desc:return 'Minh họa các giai đoạn phát triển trên thanh lịch sử.'
 if 'dịch vụ' in desc or 'giải pháp' in desc:return 'Minh họa nội dung giới thiệu dịch vụ.'
 if 'tin tức' in desc or 'bài viết' in desc:return 'Ảnh minh họa nội dung bài viết hoặc thẻ tin.'
 if 'sự kiện' in desc:return 'Ảnh minh họa thông tin hoặc thẻ sự kiện.'
 return 'Ảnh minh họa cho nội dung tại vị trí này.'
out=[]
for logical,r in sorted(records.items()):
 uses={}
 for route,pos,classes,kind in sorted(r['uses']):
  desc=label(pos,classes);uses.setdefault(desc,{'routes':set(),'methods':set()});uses[desc]['routes'].add(route);uses[desc]['methods'].add(kind)
 rows=[{'vi_tri':desc,'cong_dung':purpose(desc,logical),'cach_tai':sorted(data['methods']),'duong_dan_trang':sorted(data['routes']),'url_trang':[urljoin(domain,route) for route in sorted(data['routes'])]} for desc,data in sorted(uses.items())]
 actual=sorted(r['actual_paths']);files=[{'duong_dan':x,'url_trang':urljoin(domain,x),'kich_thuoc_byte':(public/x.lstrip('/')).stat().st_size if (public/x.lstrip('/')).is_file() else None} for x in actual]
 source=proven.get(logical);note='Ảnh minh họa, không khẳng định là hoạt động thực tế của Minh Đức.' if logical.startswith('/mirror/www.hr2b.com/wp-content/uploads/') else ''
 if logical=='/assets/hero-poster.jpg':note='Ảnh cũ được giữ để tương thích; chỉ liệt kê khi thực tế được tham chiếu.'
 if logical==video_key:note='Video Minh Đức đầy đủ 132,13 giây; MP4 H.264/AAC và WebM VP9/Opus là hai bản mã hóa cùng nguồn; Cả hai được khai báo cho hộp thoại; hero dùng WebM khi cần dự phòng.'
 if logical.startswith('/assets/minhduc-') and logical.endswith('s.webp'):
  source='https://drive.google.com/file/d/1i4ZHg9BAApueTxur4KwU_oXxH-NqbMHu/view';note='Khung hình trích từ video Minh Đức do bên đặt hàng cung cấp; thời điểm trích nằm trong tên tệp.'
 if logical=='/assets/minh-duc-about.webp':note='Ảnh minh họa tạo cho prototype; không có URL nguồn gốc bên ngoài được xác minh.'
 if logical.startswith('/partners/'):note='URL nguồn là kho bên thứ ba dùng để lấy hình, không phải xác nhận trực tiếp từ chủ sở hữu thương hiệu.'
 if logical.startswith('/assets/editorial/'):note='Ảnh minh họa từ mẫu tham chiếu, chuyển sang WebP rộng 960 px; không khẳng định là người hoặc hoạt động thực tế của Minh Đức.'
 if logical=='/assets/minh-duc-logo.jpg':note='Logo gốc do Minh Đức cung cấp; WebP dùng ở giao diện đã bỏ nền bằng xử lý điểm ảnh theo lựa chọn người dùng, không tạo lại bằng AI. JPG giữ cho OG; favicon PNG đã tái tạo từ dấu logo. Apple touch là tệp hiện có.'
 out.append({'ten_hien_thi':names.get(Path(logical).name,Path(logical).name),'ten_tep':Path(logical).name,'loai':'Video' if logical.endswith('.mp4') else 'Ảnh','duong_dan_logic':logical,'tep_dang_su_dung':files,'url_nguon_goc':source,'vi_tri_su_dung':rows,'ghi_chu':note})
# These historical files stay publicly available for existing links; they are
# excluded from the active catalog unless observed in a rendered reference.
active_paths={path for record in records.values() for path in record['actual_paths']}
legacy_paths=['/optimized/hero-1280.mp4','/optimized/hero-1600-e945407f.mp4','/optimized/assets/hero-poster-960.webp','/optimized/assets/hero-poster-1600.webp','/assets/hero-poster.jpg']
legacy=[{'duong_dan':path,'kich_thuoc_byte':(public/path.lstrip('/')).stat().st_size,'ghi_chu':'Được giữ tương thích URL; không thấy trong các tham chiếu đã kiểm tra.'} for path in legacy_paths if path not in active_paths and (public/path.lstrip('/')).is_file()]
result={'mo_ta':'Kiểm kê ảnh và video trong source + HTML dựng sẵn v15; đường dẫn tiếng Việt, các ngôn ngữ khác dùng cùng tài nguyên. Bao gồm srcset thực tế và nguồn video nạp động; không liệt kê biến thể chỉ có trong manifest mà không được tham chiếu.','dia_chi_website':domain,'tai_nguyen':out,'ghi_chu_truy_cap':'Quyền xem Site giữ nguyên; các liên kết tài nguyên có thể yêu cầu quyền truy cập.', 'tep_cu_luu_tuong_thich':legacy, 'tep_ho_tro_khong_tham_chieu':[{'duong_dan':'/assets/minh-duc-logo-transparent.png','kich_thuoc_byte':(public/'assets/minh-duc-logo-transparent.png').stat().st_size,'ghi_chu':'Tệp PNG trung gian; không được tham chiếu khi hiển thị.'}] if (public/'assets/minh-duc-logo-transparent.png').is_file() and '/assets/minh-duc-logo-transparent.png' not in active_paths else [], 'trang_thai_logo':'Người dùng đã chọn bỏ nền bằng xử lý điểm ảnh; không dùng AI.', 'ghi_chu_khong_co_url':['Cờ chọn ngôn ngữ là hình SVG nội tuyến, không có URL ảnh riêng.','JEILTECH VINA và TACU hiển thị tên dạng chữ thay vì logo ảnh.'],'tong_so':len(out)}
Path(sys.argv[1] if len(sys.argv)>1 else P/'docs/flagship/media-inventory-v15.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print('logical_assets',len(out),'uses',sum(len(x['vi_tri_su_dung']) for x in out));print('\n'.join(f"{x['ten_hien_thi']} {len(x['tep_dang_su_dung'])} {len(x['vi_tri_su_dung'])}" for x in out))
