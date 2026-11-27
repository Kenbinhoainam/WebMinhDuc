export type DemoRecord={id:string;type:string;name:string;phone:string;source:string;owner:string;status:string;result:string;detail:string;linkId:string;received:string;fields?:Record<string,string>};
export const queueNames:Record<string,string>={F01:'Nhu cầu doanh nghiệp',F02:'Liên hệ chung',F03:'Ứng tuyển việc làm',F04:'Tuyển dụng nội bộ',F05:'Tư vấn tuyển sinh',F06:'Hồ sơ tuyển sinh'};
export const sampleRecords:DemoRecord[]=[
 {id:'MD-001',type:'F01',name:'Doanh nghiệp mẫu A',phone:'000-000-0101',source:'Website',owner:'Chưa phân công',status:'Mới',result:'',linkId:'—',received:'16/11/2026',detail:'Mẫu: 50 nhân sự, ca ngày, khu vực Bắc Ninh.'},
 {id:'MD-002',type:'F02',name:'Liên hệ mẫu B',phone:'000-000-0102',source:'Website',owner:'Lan (mẫu)',status:'Đang xử lý',result:'Đã ghi nhận câu hỏi mẫu',linkId:'—',received:'16/11/2026',detail:'Mẫu: đề nghị tìm hiểu dịch vụ.'},
 {id:'MD-003',type:'F03',name:'Ứng viên mẫu C',phone:'000-000-0103',source:'Tin tuyển dụng',owner:'Mai (mẫu)',status:'Mới',result:'',linkId:'MD001',received:'16/11/2026',detail:'Mẫu: đăng ký tin MD001.'},
 {id:'MD-004',type:'F04',name:'Ứng viên mẫu D',phone:'000-000-0104',source:'Website',owner:'Mai (mẫu)',status:'Đã đóng',result:'Hoàn tất minh họa',linkId:'MD007',received:'16/11/2026',detail:'Mẫu: ứng tuyển vị trí nội bộ. Không có tệp CV.'},
 {id:'MD-005',type:'F05',name:'Học viên mẫu E',phone:'000-000-0105',source:'Tuyển sinh',owner:'Lan (mẫu)',status:'Mới',result:'',linkId:'tu-xa-quan-tri',received:'16/11/2026',detail:'Mẫu: quan tâm chương trình từ xa.'},
 {id:'MD-006',type:'F06',name:'Học viên mẫu F',phone:'000 000 0105',source:'Tuyển sinh',owner:'Chưa phân công',status:'Đang xử lý',result:'',linkId:'tu-xa-quan-tri',received:'16/11/2026',detail:'Mẫu: hồ sơ tuyển sinh. Không có tệp đính kèm.'}
];
export const normalizePhone=(phone:string)=>phone.replace(/\D/g,'');
export const duplicates=(records:DemoRecord[],record:DemoRecord)=>records.filter(r=>record.type==='F03'&&r.type==='F03'&&r.id!==record.id&&r.linkId===record.linkId&&normalizePhone(r.phone)===normalizePhone(record.phone));
export function toCsv(records: DemoRecord[]) {
 const columns: (keyof DemoRecord)[] = ['id','type','name','phone','source','owner','status','result','linkId','received','detail'];
 const escapeCell = (value: unknown) => {
  const text = String(value ?? '');
  const safeText = /^(?:[\t\r\n]|\s*[=+@\-])/.test(text) ? "'" + text : text;
  return '"' + safeText.replace(/"/g,'""') + '"';
 };
 return '\ufeff' + [columns.join(','), ...records.map(record => columns.map(column => escapeCell(record[column])).join(','))].join('\r\n');
}
