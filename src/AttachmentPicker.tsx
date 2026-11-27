import {useEffect, useRef} from 'react';
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

export function AttachmentPicker({id,name,label,helpId,errorId,files,onChange}: Props) {
  const t = useTranslation();
  const locale = useLocale();
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const focusAfterRemoval = useRef<number|null>(null);
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
          aria-describedby={errorId ? helpId+' '+errorId : helpId}
          onChange={event=>{
            const picker = event.currentTarget;
            const selected = Array.from(picker.files ?? [],({name,size,type})=>({name,size,type}));
            // This demo retains only metadata. Reset the native control so a later
            // removal or canceled re-selection cannot submit an outdated FileList.
            picker.value = '';
            if (selected.length) onChange(selected);
          }}/>
      </span>
      <span className="attachment-count"><span className="sr-only">{count} </span>{files.length} / 3</span>
    </div>
    <small id={helpId}>Tối đa 3 tệp JPG, JPEG, PNG, PDF, DOC hoặc DOCX; 5 MB/tệp, tổng 15 MB. Tệp không được tải lên.</small>
    {files.length>0 && <ul className="attachment-files" ref={list}>{files.map((file,index)=><li key={index+'-'+file.name}>
      <span className="attachment-name">{file.name}</span><span className="attachment-size">{bytes.format(file.size)}</span>
      <button type="button" aria-label={remove+' · '+file.name} onClick={()=>{
        focusAfterRemoval.current = index;
        onChange(files.filter((_,i)=>i!==index));
      }}>{remove}</button>
    </li>)}</ul>}
  </div>;
}
