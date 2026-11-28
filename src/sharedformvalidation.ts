export const FILE_ACCEPT = '.jpg,.jpeg,.png,.pdf,.doc,.docx';
export type FileSummary = Pick<File,'name'|'size'|'type'>;
const mime:Record<string,string[]>={jpg:['image/jpeg'],jpeg:['image/jpeg'],png:['image/png'],pdf:['application/pdf'],doc:['application/msword','application/vnd.ms-word'],docx:['application/vnd.openxmlformats-officedocument.wordprocessingml.document']};
/** Only inspects file metadata; no bytes are read, stored, or uploaded. */
export function validateDemoFiles(files:FileSummary[]):string {
 if(files.length>3)return 'Tối đa 3 tệp cho mỗi lần gửi.';
 if(files.some(f=>f.size>5_000_000))return 'Mỗi tệp tối đa 5 MB (5.000.000 byte).';
 if(files.reduce((n,f)=>n+f.size,0)>15_000_000)return 'Tổng dung lượng tệp tối đa 15 MB (15.000.000 byte).';
 if(files.some(f=>{const ext=f.name.split('.').pop()?.toLowerCase()||'';return !mime[ext]||!!(f.type&&f.type!=='application/octet-stream'&&!mime[ext].includes(f.type.toLowerCase()));}))return 'Chỉ chấp nhận JPG, JPEG, PNG, PDF, DOC hoặc DOCX.';
 return '';
}
export const validDemoPhone=(value:string)=>/^(?:0|\+?84)[35789]\d{8}$/.test(value.replace(/[\s.()-]/g,''));
export const validOptionalEmail=(value:string)=>!value.trim()||/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

/** Field-level rules shared by the public demo forms. */
export function identityFieldError(name: string, value: string): string {
  if (name === 'name' && !value.trim()) return 'Vui lòng nhập họ tên.';
  if (name === 'phone' && !value.trim()) return 'Vui lòng nhập số điện thoại.';
  if (name === 'phone' && !validDemoPhone(value)) return 'Vui lòng nhập số điện thoại Việt Nam hợp lệ.';
  if (name === 'email' && !validOptionalEmail(value)) return 'Email chưa đúng định dạng.';
  return '';
}
