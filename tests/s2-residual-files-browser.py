"""Measure packaged F04/F06 file feedback in isolated Chromium. No HTTP server.
Usage: python tests/s2-residual-files-browser.py path/to/private-preview.tar.gz
"""
import argparse
import hashlib
import importlib.util
import json
import os
import re
import shutil
import subprocess
import tarfile
import tempfile
from datetime import datetime, timezone
from pathlib import Path

from playwright.sync_api import expect, sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs/sdd/SEL-2026.11.27-v1.0.0/execution'
CASES = OUT / 'residual-browser'
STRINGS = {
    'vi': ('Lần chọn mới sẽ thay toàn bộ danh sách tệp.', 'Đã xóa tệp', 'Hồ-sơ'),
    'en': ('Choosing new files replaces the entire list.', 'File removed', 'Application'),
    'zh': ('重新选择文件将替换整个文件列表。', '已移除文件', '申请附件'),
    'ko': ('파일을 다시 선택하면 기존 목록 전체가 교체됩니다.', '삭제한 파일', '지원서류'),
    'ja': ('ファイルを選び直すと、一覧全体が置き換わります。', '削除したファイル', '応募書類'),
}

GEOMETRY = """field => {
  const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height};};
  const fragments=e=>{const r=document.createRange();r.selectNodeContents(e);return [...r.getClientRects()].filter(b=>b.width>0).map(b=>({x:b.x,y:b.y,w:b.width,h:b.height}));};
  const rows=[...field.querySelectorAll('li')].map(e=>{
    const name=e.querySelector('.attachment-name'),size=e.querySelector('.attachment-size'),button=e.querySelector('button');
    return {row:rect(e),name:rect(name),fragments:fragments(name),size:rect(size),button:rect(button),sizeText:size.textContent,overflow:e.scrollWidth-e.clientWidth};
  });
  const help=field.querySelector('.attachment-replace-help');
  return {viewport:innerWidth,documentWidth:document.documentElement.scrollWidth,field:rect(field),help:rect(help),helpFragments:fragments(help),rows};
}"""


def fixture(name, size=19):
    return {'name': name, 'mimeType': 'application/pdf', 'buffer': bytes(size)}


def inside(inner, outer, tolerance=1.1):
    for axis, length in [('x', 'w'), ('y', 'h')]:
        if not (outer[axis]-tolerance <= inner[axis] and inner[axis]+inner[length] <= outer[axis]+outer[length]+tolerance):
            return False
    return True


def overlap(a,b):
    return min(a['x']+a['w'],b['x']+b['w'])-max(a['x'],b['x'])>1 and min(a['y']+a['h'],b['y']+b['h'])-max(a['y'],b['y'])>1


def verify_geometry(g):
    assert g['documentWidth'] <= g['viewport']+1, g
    assert -1 <= g['field']['x'] and g['field']['x']+g['field']['w'] <= g['viewport']+1, g
    assert all(inside(f,g['help']) for f in g['helpFragments']),g['helpFragments']
    for row in g['rows']:
        assert row['overflow']<=1 and inside(row['row'],g['field']),row
        for member in ('name','size','button'):
            assert inside(row[member],row['row']),row
        assert all(inside(f,row['name']) for f in row['fragments']),row
        assert not any(overlap(row[a],row[b]) for a,b in [('name','size'),('name','button'),('size','button')]),row
        assert row['button']['h']>=44,row
    assert len({round(r['y']) for r in g['rows'][0]['fragments']}) >= 2, 'Long filename did not wrap'
    assert not overlap(g['rows'][0]['row'],g['rows'][1]['row']),g


def check(browser,pr,mode,width,locale):
    context=browser.new_context(viewport={'width':width,'height':pr.HEIGHTS[width]},service_workers='block',reduced_motion='reduce')
    context.route('**/*',pr.local)
    page=context.new_page()
    page.set_default_timeout(7000)
    requests=[]
    page.on('request',lambda r: requests.append({'method':r.method,'type':r.resource_type,'url':r.url.split('?')[0]}))
    try:
        path='/jobs/chuyen-vien-tuyen-dung-bac-ninh' if mode=='F04' else '/education?form=F06#dang-ky'
        pr.navigate(page,locale,path)
        if mode=='F04':
            page.locator('.job-apply-button').click()
        field=page.locator('.attachment-field')
        picker=field.locator('input[type=file]')
        form=picker.locator('xpath=ancestor::form')
        name=form.locator('[name=name]');email=form.locator('[name=email]');phone=form.locator('[name=phone]')
        name.fill('QA Fixture');email.fill('fixture@example.test');phone.fill('0912345678')
        helptext,removed,prefix=STRINGS[locale]
        longname=prefix+'-'+('ManufacturingEngineering' * 5)+'.pdf'
        other='short.pdf'
        assert len(longname.encode())<255
        rows=field.locator('.attachment-files li')
        label=field.locator('.attachment-count')
        start=len(requests)
        picker.evaluate("""input=>{
          window.fileEvents=[];
          for(const kind of ['click','input','change','cancel'])input.addEventListener(kind,e=>window.fileEvents.push({kind:e.type,trusted:e.isTrusted,count:input.files.length}));
        }""")
        opens=0
        def choose(files):
            nonlocal opens
            with page.expect_file_chooser() as popup:
                picker.click()
            opens+=1
            chooser=popup.value
            assert chooser.is_multiple()
            assert chooser.element.get_attribute('id')==picker.get_attribute('id')
            chooser.set_files(files)
        choose([fixture(longname,19),fixture(other,27)])
        expect(rows).to_have_count(2);expect(label).to_contain_text('2 / 3')
        expect(rows.nth(0).locator('.attachment-name')).to_have_text(longname)
        expect(rows.nth(1).locator('.attachment-name')).to_have_text(other)
        for index,size in enumerate([19,27]):
            expect(rows.nth(index).locator('.attachment-size')).to_contain_text(str(size))
            expect(rows.nth(index).locator('.attachment-size')).to_contain_text('PDF')
        helpbox=field.locator('.attachment-replace-help')
        expect(helpbox).to_have_text(helptext)
        assert helpbox.get_attribute('id') in picker.get_attribute('aria-describedby').split()
        expect(rows.first.locator('button')).to_have_accessible_name(re.compile(re.escape(longname)))
        field.scroll_into_view_if_needed()
        geometry=field.evaluate(GEOMETRY)
        verify_geometry(geometry)
        screenshot=None
        if locale=='vi':
            screenshot=f'attachment-{mode}-{width}.png'
            field.screenshot(path=str(CASES/screenshot),animations='disabled')
        # Reopen Chromium's intercepted chooser and resolve it with an empty selection.
        # Capture actual event type/trust. The operating system dialog is never displayed.
        page.evaluate('window.fileEvents=[]')
        choose([])
        expect(rows).to_have_count(2)
        cancellation=page.evaluate('window.fileEvents')
        assert rows.first.locator('.attachment-name').inner_text()==longname
        replacement='replacement.pdf'
        choose([fixture(replacement),fixture(other)])
        expect(rows.first.locator('.attachment-name')).to_have_text(replacement)
        assert longname not in field.inner_text()
        rows.first.get_by_role('button').click()
        expect(rows).to_have_count(1);expect(label).to_contain_text('1 / 3')
        expect(rows.first.locator('button')).to_be_focused()
        expect(field.get_by_role('status')).to_have_text(removed+' · '+replacement)
        rows.first.locator('button').click()
        expect(rows).to_have_count(0);expect(label).to_contain_text('0 / 3')
        expect(picker).to_be_focused();expect(field.get_by_role('status')).to_have_text(removed+' · '+other)
        expect(name).to_have_value('QA Fixture');expect(phone).to_have_value('0912345678');expect(email).to_have_value('fixture@example.test')
        data_requests=[r for r in requests[start:] if r['method'] not in ('GET','HEAD') or r['type'] in ('xhr','fetch','websocket','ping')]
        assert not data_requests,data_requests
        return {'scope':f'{mode} {width}px {locale}','route':path,'mode':mode,'width':width,'locale':locale,
                'status':'Pass','filechooser_events':opens,'cancel_resolution_events':cancellation,'long_filename':longname,
                'replacement_help':helptext,'geometry':geometry,'screenshot':screenshot,
                'receipt':'2 files → chooser empty resolution retained both → replacement → next/remove focus → chooser focus, count 0, draft retained',
                'file_operation_requests':data_requests}
    finally:
        context.close()



def main():
    args=argparse.ArgumentParser();args.add_argument('archive',type=Path);args.add_argument('--widths',default='320,390');args.add_argument('--locales',default='vi,en,zh,ko,ja');args.add_argument('--probe',action='store_true')
    opts=args.parse_args()
    archive=opts.archive.resolve()
    widths=[int(v) for v in opts.widths.split(',')];locales=opts.locales.split(',')
    if not opts.probe:
        assert widths==[320,390] and locales==list(STRINGS)
    proof=json.loads((OUT/'logs/preview-paths.json').read_text())
    with archive.open('rb') as bundle:
        digest=hashlib.file_digest(bundle,'sha256').hexdigest()
    assert digest==proof['archive_sha256']
    assert proof['source']==subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip()
    CASES.mkdir(exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='s2-picker-artifact-') as tmp:
        with tarfile.open(archive) as t:
            t.extractall(tmp,filter='data',members=[m for m in t if m.name.startswith('dist/')])
        os.environ['DIST_DIR']=str(Path(tmp)/'dist');os.environ['QA_OUTPUT']=str(CASES)
        spec=importlib.util.spec_from_file_location('pr',ROOT/'tests/s2-pr-browser.py');pr=importlib.util.module_from_spec(spec);spec.loader.exec_module(pr)
        checks=[]
        with sync_playwright() as pw:
            browser=pw.chromium.launch(executable_path=os.getenv('CHROME_PATH') or shutil.which('chromium'),args=['--disable-background-networking','--disable-quic','--host-resolver-rules=MAP * ~NOTFOUND'])
            version=browser.version
            for width in widths:
                for locale in locales:
                    for mode in ['F04','F06']:
                        try:
                            row=check(browser,pr,mode,width,locale);print('PASS',row['scope'],flush=True)
                        except Exception as error:
                            row={'scope':f'{mode} {width}px {locale}','status':'Fail','error':str(error)[:5000]};print('FAIL',row,flush=True)
                        checks.append(row)
            browser.close()
    failed=[r for r in checks if r['status']=='Fail']
    if opts.probe:
        if failed:raise SystemExit(1)
        return
    assertion='Chromium opened its real filechooser event and accepted synthetic multi-file fixtures. Across both forms, five locales and 320/390px, long names retained all characters and wrapped inside their row without overlap or horizontal overflow. Localized replacement help, size, individual removal, focus, count, preserved drafts and absence of file-operation transport were observed.'
    choices=[dict(choice_id=code,coverage='full' if code=='CS-C04-3' else 'partial',test_status='Fail' if failed else 'Pass',
                  assertion=assertion if not failed else f'{len(failed)} of {len(checks)} Chromium cases failed.',
                  remaining='' if code=='CS-C04-3' else 'The chooser event was intercepted and resolved with zero files. Manual dismissal in an operating system file picker and screen reader speech were not observed.',
                  evidence_ref='tests/s2-residual-files-browser.py') for code in ['CS-C04-3','MI05-1']]
    payload={'build_sha':proof['source'],'site_source_sha':proof['site_sha'],'archive_sha256':digest,'run_utc':datetime.now(timezone.utc).isoformat(),
           'browser':'Chromium '+version,'method':'Exact archive extracted to temporary directory. Browser requests intercepted and fulfilled from packaged assets. No HTTP server or external service.',
           'checks':checks,'choices':choices}
    (OUT/'residual-browser.json').write_text(json.dumps(payload,ensure_ascii=False,indent=2)+'\n')
    print(f'{len(checks)} Chromium cases, {len(failed)} failures.',flush=True)
    if failed:raise SystemExit(1)


if __name__=='__main__':main()
