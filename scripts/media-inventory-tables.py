"""Flatten a generated human inventory into literal-only rows for the three Sheet tabs."""
from pathlib import Path
from urllib.parse import urljoin
import json,sys
P=Path(__file__).resolve().parents[1]
source=Path(sys.argv[1]) if len(sys.argv)>1 else P/'docs/flagship/media-inventory-v15.json'
target=Path(sys.argv[2]) if len(sys.argv)>2 else P/'docs/flagship/media-tables-v15.json'
inventory=json.loads(source.read_text());base=inventory['dia_chi_website']
headers={
 'catalog':['Mã','Loại','Tài nguyên','Link xem tài nguyên','Vị trí chính','Công dụng','Trang sử dụng','Link nguồn gốc','Dung lượng link xem (KB)','Số phiên bản tệp','Tên file gốc','Ghi chú'],
 'uses':['Mã','Tài nguyên','Trang / đường dẫn','Link trang','Vị trí','Công dụng','Link xem tài nguyên','Cách sử dụng','Ghi chú'],
 'files':['Mã','Tài nguyên','Tên phiên bản tệp','Link tệp đang dùng','Dung lượng (KB)','Định dạng']}
tables={key:[value] for key,value in headers.items()}
def representative(files,position=''):
 for needle in (['apple-touch'] if 'Apple' in position else ['favicon-96'] if 'Biểu tượng trình duyệt' in position else ['/assets/minh-duc-logo.jpg'] if 'chia sẻ liên kết' in position else []):
  match=next((f for f in files if needle in f['duong_dan']),None)
  if match:return match
 for needle in ('.mp4','minh-duc-logo-transparent.webp','minh-duc-logo-192.webp','-960.webp','-480.webp'):
  match=next((f for f in files if f['duong_dan'].endswith(needle)),None)
  if match:return match
 return files[0] if files else {'duong_dan':'','url_trang':'','kich_thuoc_byte':None}
def kb(f):return round(f['kich_thuoc_byte']/1024,2) if f.get('kich_thuoc_byte') is not None else ''
for i,asset in enumerate(inventory['tai_nguyen'],1):
 ident=f'MD-{i:03d}';name=asset['ten_hien_thi'];files=asset['tep_dang_su_dung'];uses=asset['vi_tri_su_dung'];sample=representative(files)
 allroutes=sorted({route for use in uses for route in use['duong_dan_trang']});route_summary='Toàn bộ website' if len(allroutes)>20 else ', '.join(allroutes)
 tables['catalog'].append([ident,asset['loai'],name,sample['url_trang'],'; '.join(u['vi_tri'] for u in uses),'; '.join(dict.fromkeys(u['cong_dung'] for u in uses)),route_summary,asset['url_nguon_goc'] or '',kb(sample),len(files),asset['ten_tep'],asset['ghi_chu']])
 for use in uses:
  routes=use['duong_dan_trang'];group=[('Toàn bộ website',base+'/')] if len(routes)>20 else [(route,urljoin(base,route)) for route in routes]
  selected=representative(files,use['vi_tri'])
  for path,url in group:tables['uses'].append([ident,name,path,url,use['vi_tri'],use['cong_dung'],selected['url_trang'],', '.join(use['cach_tai']),asset['ghi_chu']])
 for file in files:
  path=file['duong_dan'];tables['files'].append([ident,name,Path(path).name,file['url_trang'],kb(file),Path(path).suffix.lstrip('.').upper()])
target.write_text(json.dumps(tables,ensure_ascii=False,separators=(',',':'))+'\n')
print('table rows:',', '.join(f'{key}={len(value)-1}' for key,value in tables.items()))
