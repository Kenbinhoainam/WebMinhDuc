import type {DemoRecord} from './admin-demo-data';

/** Ephemeral prototype-only records. No browser storage, files, or network calls. */
let records: DemoRecord[] = [];
let sequence = 0;
export function createDemoSubmission(input:{type:string;name:string;phone:string;source:string;linkId?:string;detail?:string;fields?:Record<string,string>}):DemoRecord {
 const record:DemoRecord={id:`DEMO-${String(++sequence).padStart(4,'0')}`,type:input.type,name:input.name.trim(),phone:input.phone.trim(),source:input.source,linkId:input.linkId||'—',detail:input.detail||'',fields:input.fields?{...input.fields}:undefined,owner:'Chưa phân công',status:'Mới',result:'',received:new Date().toLocaleDateString('vi-VN')};
 records=[...records,record]; return record;
}
export function getDemoSubmissions(){return records.map(record=>({...record}));}
export function updateDemoSubmission(id:string,patch:Partial<DemoRecord>){records=records.map(record=>record.id===id?{...record,...patch}:record);}
export function resetDemoSubmissions(){records=[];}
