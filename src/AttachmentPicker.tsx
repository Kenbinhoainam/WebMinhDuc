import {useEffect, useRef, useState} from 'react';
import {useLocale, useTranslation} from './i18n';
import {FILE_ACCEPT, type FileSummary} from './sharedformvalidation';
import './attachment-picker.css';

type Props = {
  id: string;
  name: string;
  label: string;
  helpId: string;
  errorId?: string;
  files: FileSummary[];
  onChange: (files: FileSummary[]) => void;
};

function fileFormat(file: FileSummary, unknown: string) {
  const extension = /\.([a-z\d]{1,12})$/i.exec(file.name)?.[1].toUpperCase();
  if (extension) return extension;
  return file.type && file.type !== 'application/octet-stream' ? file.type : unknown;
}

export function AttachmentPicker({id,name,label,helpId,errorId,files,onChange}: Props) {
  const t = useTranslation();
  const locale = useLocale();
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const focusAfterRemoval = useRef<number|null>(null);
  const [removedName,setRemovedName] = useState('');
  const replacedHelp = t({vi:'Lần chọn mới sẽ thay toàn bộ danh sách tệp.',en:'Choosing new files replaces the entire list.',zh:'重新选择文件将替换整个文件列表。',ko:'파일을 다시 선택하면 기존 목록 전체가 교체됩니다.',ja:'ファイルを選び直すと、一覧全体が置き換わります。'});
  const removed = t({vi:'Đã xóa tệp',en:'File removed',zh:'已移除文件',ko:'삭제한 파일',ja:'削除したファイル'});
  const format = t({vi:'Định dạng',en:'Format',zh:'文件格式',ko:'파일 형식',ja:'ファイル形式'});
  const unknown = t({vi:'Không rõ',en:'Unknown',zh:'未知',ko:'알 수 없음',ja:'不明'});
  const pick = files.length
    ? t({vi:'Chọn lại tệp',en:'Replace files',zh:'重新选择文件',ko:'파일 다시 선택',ja:'ファイルを選び直す'})
    : t({vi:'Chọn tệp',en:'Choose files',zh:'选择文件',ko:'파일 선택',ja:'ファイルを選択'});
  const remove = t({vi:'Xóa tệp',en:'Remove file',zh:'移除文件',ko:'파일 제거',ja:'ファイルを削除'});
  const count = t({vi:'Số tệp đã chọn',en:'Files selected',zh:'已选文件数',ko:'선택한 파일 수',ja:'選択したファイル数'});
  const bytes = new Intl.NumberFormat(locale,{style:'unit',unit:'byte',unitDisplay:'short'});

  useEffect(()=>{
    if (focusAfterRemoval.current === null) return;
    const buttons = list.current?.querySelectorAll('button');
    const target = buttons?.[Math.min(focusAfterRemoval.current,buttons.length-1)] ?? input.current;
    target?.focus({preventScroll:true});
    focusAfterRemoval.current = null;
  },[files]);

  return <div className="attachment-field">
    <label id={id+'-label'} htmlFor={id}>{label}</label>
    <div className="attachment-controls">
      <span className="attachment-choose">
        <span id={id+'-action'}>{pick}</span>
        <input id={id} name={name} ref={input} type="file" accept={FILE_ACCEPT} multiple
          aria-labelledby={id+'-label '+id+'-action'} aria-invalid={!!errorId}
          aria-describedby={[helpId,files.length ? id+'-replace-help' : null,errorId].filter(Boolean).join(' ')}
          onChange={event=>{
            const picker = event.currentTarget;
            const selected = Array.from(picker.files ?? [],({name,size,type})=>({name,size,type}));
            // This demo retains only metadata. Reset the native control so a later
            // removal or canceled re-selection cannot submit an outdated FileList.
            picker.value = '';
            if (selected.length) {setRemovedName('');onChange(selected);}
          }}/>
      </span>
      <span className="attachment-count"><span className="sr-only">{count} </span>{files.length} / 3</span>
    </div>
    <small id={helpId}>Tối đa 3 tệp JPG, JPEG, PNG, PDF, DOC hoặc DOCX; 5 MB/tệp, tổng 15 MB. Tệp không được tải lên.</small>
    {files.length>0 && <small id={id+'-replace-help'} className="attachment-replace-help">{replacedHelp}</small>}
    <span role="status" aria-live="polite" aria-atomic="true" className="sr-only">{removedName && removed+' · '+removedName}</span>
    {files.length>0 && <ul className="attachment-files" ref={list}>{files.map((file,index)=><li key={index+'-'+file.name}>
      <span className="attachment-name">{file.name}</span><span className="attachment-size"><span className="sr-only">{format} </span>{fileFormat(file,unknown)} · {bytes.format(file.size)}</span>
      <button type="button" aria-label={remove+' · '+file.name} onClick={()=>{
        focusAfterRemoval.current = index;
        setRemovedName(file.name);
        onChange(files.filter((_,i)=>i!==index));
      }}>{remove}</button>
    </li>)}</ul>}
  </div>;
}
