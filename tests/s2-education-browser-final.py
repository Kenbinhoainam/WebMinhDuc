"""Exercise the three education detail pages and F05/F06 from the verified Site archive.

Run from the application checkout: python tests/s2-education-browser-final.py /path/to/archive.tar.gz
"""
import argparse
from datetime import datetime, timezone
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import tarfile
import tempfile
from urllib.parse import urlsplit, parse_qs
from playwright.sync_api import expect, sync_playwright

ROOT=Path(__file__).resolve().parents[1]
EXEC=ROOT/'docs/sdd/SEL-2026.11.27-v1.0.0/execution'
OUT=EXEC/'residual-education'
SLUGS=['tu-xa-quan-tri','chinh-quy-cong-nghe','tu-xa-ke-toan']
PAGES=dict(zip(SLUGS,['P33','P34','P35']))
TRAPS="""() => {
  const state=window.eduQAFacts={fileReads:[],storeWrites:[]};
  for(const method of ['text','arrayBuffer','bytes','stream','slice']) {
    const original=File.prototype[method];
    if(typeof original==='function') File.prototype[method]=function(...a){state.fileReads.push(method);return original.apply(this,a)};
  }
  for(const method of ['readAsDataURL','readAsArrayBuffer','readAsText','readAsBinaryString']) {
    const original=FileReader.prototype[method];
    if(original) FileReader.prototype[method]=function(...a){state.fileReads.push(method);return original.apply(this,a)};
  }
  const write=Storage.prototype.setItem;
  Storage.prototype.setItem=function(k,v){state.storeWrites.push([String(k),String(v)]);return write.call(this,k,v)};
}"""


def noindex(page):
    robots=page.locator('meta[name=robots]').get_attribute('content').lower()
    assert 'noindex' in [v.strip() for v in robots.split(',')],robots
    return robots


def ready(page):
    page.wait_for_function("Object.keys(document.querySelector('#root') || {}).some(k=>k.startsWith('__reactContainer$'))")
    page.locator('main h1').first.wait_for()


def check(pr,browser,slug,mode,changed):
    index=SLUGS.index(slug)
    alternate=SLUGS[(index+1)%3]
    expected=alternate if changed else slug
    locale='vi'
    context=browser.new_context(viewport={'width':1280,'height':900},service_workers='block',reduced_motion='reduce')
    context.route('**/*',pr.local)
    context.add_init_script('('+TRAPS+')()')
    page=context.new_page()
    page.set_default_timeout(8000)
    requests=[]
    page.on('request',lambda r: requests.append((r.method,r.resource_type,urlsplit(r.url).path)))
    facts={'page':PAGES[slug],'slug':slug,'form':mode,'changed':changed,'expected_program':expected,'locale':locale}
    path='/education/'+slug
    try:
        pr.navigate(page,locale,path)
        facts['robots']=noindex(page)
        def form():return page.locator('#dang-ky form')
        def program():return form().locator('[name=program]')
        expect(program()).to_have_value(slug)
        cta=page.locator('main a[href$="form='+mode+'#dang-ky"]').first
        cta.click()
        assert page.url==pr.url(locale,path)+'?form='+mode+'#dang-ky',page.url
        expect(program()).to_have_value(slug)
        if changed:program().select_option(alternate)
        expect(program()).to_have_value(expected)
        name=f'Fixture {PAGES[slug]} {mode} '+('switch' if changed else 'default')
        required=form().locator('[required]').evaluate_all('els=>els.map(e=>e.name).sort()')
        assert required==['name','phone'],required
        form().locator('[name=name]').fill(name)
        form().locator('[name=phone]').fill('0912345678')
        picker=form().locator('input[type=file]')
        start=len(requests)
        if mode=='F06':
            assert picker.count()==1 and not picker.evaluate('e=>e.required')
            email=form().locator('[name=email]')
            assert not email.evaluate('e=>e.required')
            if changed:
                email.fill('example@example.test')
                for filename in ['invalid-fixture.exe','synthetic-fixture.pdf']:
                    with page.expect_file_chooser() as show: picker.click()
                    show.value.set_files([{'name':filename,'mimeType':'application/pdf' if filename.endswith('pdf') else 'application/octet-stream','buffer':b'QA fixture only.'}])
                    expect(form().locator('.attachment-name')).to_have_text(filename)
                    expect(picker).to_have_attribute('aria-invalid','false' if filename.endswith('pdf') else 'true')
                facts['attachment']='native chooser event twice, invalid extension rejected, PDF metadata displayed, no file content read'
            else:
                expect(email).to_have_value('');assert picker.evaluate('e=>e.files.length')==0
                facts['attachment']='optional email and file both omitted'
        else:
            assert picker.count()==0 and form().locator('[name=document]').count()==0
            facts['attachment']='no document field in F05'
        form().locator('button[type=submit]').click()
        receipt=page.locator('.education-success')
        expect(receipt).to_be_visible()
        expect(receipt.locator('h3')).to_contain_text(mode)
        rid=receipt.locator('p strong').inner_text()
        assert re.fullmatch(r'DEMO-\d+',rid),rid
        details=receipt.locator('a');href=details.get_attribute('href')
        link=urlsplit(href)
        assert link.path==pr.BASE+'/admin-demo' and parse_qs(link.query)=={'type':[mode],'id':[rid]},href
        facts['receipt_href']=href
        expect(page.locator('.education-program-detail a')).to_have_attribute('href',pr.BASE+'/education#programs')
        details.click()
        admin=page.locator('.admin-detail')
        expect(admin).to_be_visible()
        expect(page.get_by_role('dialog').locator('h2,h3').first).to_contain_text(rid)
        expect(admin.locator('strong').first).to_have_text(name)
        assert admin.locator('p').nth(0).inner_text().endswith(path),admin.inner_text()
        link_id=admin.locator('p').nth(2).inner_text().split('Mã liên kết: ')[1].split(' · Ngày tiếp nhận:')[0]
        fields_program=admin.locator('dl > div').filter(has=page.locator('dt',has_text='Chương trình quan tâm')).locator('dd').inner_text()
        assert link_id==fields_program==expected,(link_id,fields_program,expected)
        assert 'synthetic-fixture.pdf' not in admin.inner_text()
        facts.update(linkId=link_id,fields_program=fields_program,admin_source=path)
        traps=page.evaluate('window.eduQAFacts')
        transports=[r for r in requests[start:] if r[0] not in ['GET','HEAD'] or r[1] in ['xhr','fetch','websocket','ping']]
        assert not traps['fileReads'] and not traps['storeWrites'] and not transports,(traps,transports)
        facts.update(file_reads=traps['fileReads'],web_storage_writes=traps['storeWrites'],form_transport=transports)
        # Return through browser history and then the site's real program directory links.
        page.go_back(wait_until='domcontentloaded');expect(program()).to_have_value(slug)
        assert page.url==pr.url(locale,path)+'?form='+mode+'#dang-ky',page.url
        expect(page.locator('.education-success')).to_have_count(0)
        expect(form().locator('[name=name]')).to_have_value('')
        page.go_forward(wait_until='domcontentloaded')
        expect(admin).to_be_visible();expect(admin).to_contain_text(name)
        if changed:
            page.get_by_role('dialog').locator('.modal-heading button').click()
            reset=page.get_by_role('button',name='Khôi phục mẫu',exact=True)
            reset.click()
            page.locator('.admin-reset-actions button').first.click()
            expect(page.locator('tr').filter(has_text=rid)).to_have_count(1)
            reset.click();page.locator('.admin-reset-actions button').last.click()
            expect(page.locator('tr').filter(has_text=rid)).to_have_count(0)
            facts['clear']='Explicit cancel preserved sample. Confirming local reset removed it.'
        page.reload(wait_until='domcontentloaded');ready(page)
        expect(page.locator('.admin-queues')).to_be_visible()
        expect(page.locator('.admin-detail')).to_have_count(0)
        expect(page.locator('tr').filter(has_text=rid)).to_have_count(0)
        assert name not in page.locator('main').inner_text()
        facts['reloaded_receipt']='No sample row/details after ADMIN document reload'
        page.go_back(wait_until='domcontentloaded');expect(program()).to_have_value(slug)
        assert page.url==pr.url(locale,path)+'?form='+mode+'#dang-ky',page.url
        next_slugs=[SLUGS[(index+off)%3] for off in [1,2]]
        for other in next_slugs:
            page.locator('.education-program-detail a').click()
            expect(page.locator('#programs')).to_be_visible();assert page.url==pr.url(locale,'/education#programs'),page.url
            page.locator('#programs a[href$="/'+other+'"]').click()
            expect(program()).to_have_value(other);assert page.url==pr.url(locale,'/education/'+other)
            assert page.locator('.education-success').count()==0
            expect(form().locator('[name=name]')).to_have_value('')
        facts['back_and_directory']=[path+'?form='+mode+'#dang-ky','/education#programs',*next_slugs]
        pr.navigate(page,locale,path+'?form='+mode+'#dang-ky')
        expect(program()).to_have_value(slug)
        expect(form().locator('[name=name]')).to_have_value('')
        expect(page.locator('.education-success')).to_have_count(0)
        facts['reloaded_program']='route retained original program and type; draft and receipt cleared'
        return facts
    finally:
        context.close()


def main():
    parser=argparse.ArgumentParser();parser.add_argument('archive',type=Path);parser.add_argument('--probe',action='store_true')
    args=parser.parse_args();OUT.mkdir(exist_ok=True)
    proof=json.loads((EXEC/'logs/preview-paths.json').read_text())
    assert subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip()==proof['source']
    with args.archive.open('rb') as f: assert hashlib.file_digest(f,'sha256').hexdigest()==proof['archive_sha256']
    results=[];noindex_checks=[]
    with tempfile.TemporaryDirectory(prefix='s2-program-') as temp:
        with tarfile.open(args.archive) as t:t.extractall(temp,members=[m for m in t if m.name.startswith('dist/')],filter='data')
        os.environ.update(DIST_DIR=str(Path(temp)/'dist'),QA_OUTPUT=str(OUT))
        spec=importlib.util.spec_from_file_location('pr',ROOT/'tests/s2-pr-browser.py');pr=importlib.util.module_from_spec(spec);spec.loader.exec_module(pr)
        with sync_playwright() as pw:
            browser=pw.chromium.launch(executable_path=os.getenv('CHROME_PATH') or shutil.which('chromium'),args=['--disable-background-networking','--disable-quic','--host-resolver-rules=MAP * ~NOTFOUND'])
            version=browser.version
            for slug in SLUGS[:1] if args.probe else SLUGS:
                for mode in ['F05','F06']:
                    for changed in [False,True]:
                        try:
                            facts=check(pr,browser,slug,mode,changed);facts['status']='Pass';print('PASS',slug,mode,changed,flush=True)
                        except Exception as e:
                            facts={'slug':slug,'mode':mode,'changed':changed,'status':'Fail','error':str(e)[:700]};print('FAIL',facts,flush=True)
                        results.append(facts)
                        if args.probe and facts['status']=='Fail':raise SystemExit(1)
            if not args.probe:
                context=browser.new_context(service_workers='block');context.route('**/*',pr.local);page=context.new_page()
                for slug in SLUGS:
                    for loc in pr.LOCALES:
                        pr.navigate(page,loc,'/education/'+slug)
                        noindex_checks.append({'slug':slug,'locale':loc,'robots':noindex(page)})
                context.close()
            browser.close()
    if args.probe:return
    choices=[]
    for slug,code in PAGES.items():
        rows=[r for r in results if r['slug']==slug];assert len(rows)==4
        failed=[r for r in rows if r['status']!='Pass']
        for tail,assertion in {
            'E1':f'{slug} preselected in F05 and F06. Both modes submitted default and alternate selections; ADMIN link ID and program field matched the selected program.',
            'E2':'F05 had no document control. F06 accepted blank email/files, rejected an executable on selection and accepted PDF metadata. Only name and phone were required.',
            'E3':'Four receipts opened their matching queue, sample ID, recorded program and source route. Browser Back/Forward preserved the sample until explicit reset or reload. The /education#programs link opened the directory.',
            'F2':'Both alternate program links were followed in the same browser document. Each form had its correct default; no stale receipt or input carried across slugs, Back or reload.',
            'F3':'Instrumented File and FileReader methods, storage writes and fetch/XHR/non-GET transports remained unused while F05/F06 ran. A receipt existed in-session and disappeared after hard reload. All five localized direct documents declared noindex.',
        }.items():
            choices.append({'choice_id':code+'-'+tail,'coverage':'full' if not failed else 'partial','test_status':'Pass' if not failed else 'Fail','assertion':assertion if not failed else str(failed),'remaining':'','evidence_ref':'tests/s2-education-browser-final.py'})
    report={'build_sha':proof['source'],'site_source_sha':proof['site_sha'],'archive_sha256':proof['archive_sha256'],'checked_utc':datetime.now(timezone.utc).isoformat(),'browser':'Chromium '+version,'method':'Synthetic submissions through the actual Vietnamese Chromium UI on an extracted private archive. Independently loaded three detail routes in all five languages for noindex. No external requests, server, CMS or production records.','observations':results,'localized_noindex':noindex_checks,'choices':choices}
    (OUT/'choices.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(len(results),'end-to-end submissions;',len(noindex_checks),'localized noindex checks;',len(choices),'frozen IDs',flush=True)
    if any(r['status']!='Pass' for r in results):raise SystemExit(1)


if __name__=='__main__':main()
