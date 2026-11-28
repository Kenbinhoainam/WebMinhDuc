"""Real local and two-tab removal, page clamping and history from a verified packaged Pages build."""
from pathlib import Path
import argparse, importlib.util, json, os, shutil
from playwright.sync_api import sync_playwright, expect

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'docs/sdd/SEL-2026.11.27-v1.0.0/execution/b2c-saved-focus'
IDS=['MD00'+str(i) for i in range(1,9)]
SLUGS=dict(zip(IDS,['cong-nhan-lap-rap-bac-ninh','kiem-tra-chat-luong-bac-giang','nhan-vien-kho-thai-nguyen','van-hanh-may-quang-ninh','ky-thuat-bao-tri-bac-ninh','dong-goi-thoi-vu-bac-giang','chuyen-vien-tuyen-dung-bac-ninh','cong-tac-vien-tuyen-dung-quang-ninh']))

def main():
    ap=argparse.ArgumentParser();ap.add_argument('receipt',type=Path);ap.add_argument('--baseline',action='store_true');o=ap.parse_args()
    p=json.loads(o.receipt.read_text());OUT.mkdir(exist_ok=True);os.environ.update(DIST_DIR=p['dist'],QA_OUTPUT=str(OUT))
    spec=importlib.util.spec_from_file_location('pr',ROOT/'tests/s2-pr-browser.py');pr=importlib.util.module_from_spec(spec);spec.loader.exec_module(pr)
    assert pr.fingerprint()==p['dist_tree_sha256']
    cases=[
        ('external focused button at page boundary',IDS,'?campaign=qa&page=2#main','[data-job-save=MD007]','MD007','[data-job-save=MD006]','remote-boundary'),
        ('external focused title, following sibling',IDS,'','[data-job-link=MD002]','MD002','[data-job-link=MD003]','remote'),
        ('external change with no control focused',IDS,'','body','MD003','body','remote'),
        ('external change, focus on filter',IDS,'','#jobs-query','MD002','#jobs-query','remote'),
        ('external change, focus on another card',IDS,'','[data-job-save=MD004]','MD003','[data-job-save=MD004]','remote'),
        ('external last remaining card',['MD001'],'','[data-job-link=MD001]','MD001','.jobs-empty a','remote'),
        ('local removal, previous page',['MD001','MD002','MD003','MD004','MD005','MD006','MD007'],'?campaign=qa&page=2#main','[data-job-save=MD007]','MD007','[data-job-save=MD006]','local'),
        ('local final saved record',['MD008'],'','[data-job-save=MD008]','MD008','.jobs-empty a','local'),
    ]
    observations=[]
    with sync_playwright() as pw:
        browser=pw.chromium.launch(executable_path=os.environ.get('CHROME_PATH') or shutil.which('chromium'),args=['--disable-background-networking','--disable-quic','--host-resolver-rules=MAP * ~NOTFOUND'])
        for width in [390,1440]:
            for desc,ids,query,focus,remove,target,action in cases:
                ctx=browser.new_context(viewport={'width':width,'height':880},service_workers='block',reduced_motion='reduce');ctx.route('**/*',pr.local)
                ctx.add_init_script("if(!localStorage.getItem('minhduc.saved-jobs.v1'))localStorage.setItem('minhduc.saved-jobs.v1',"+json.dumps(json.dumps(ids))+")")
                pg=ctx.new_page();pg.set_default_timeout(5000);facts={'name':desc,'width':width,'before_ids':ids,'expected_focus':target}
                try:
                    pr.navigate(pg,'vi','/saved-jobs'+query)
                    listurl=pg.url
                    if action=='remote-boundary':
                        job=pg.locator('[data-job-link=MD007]');job.scroll_into_view_if_needed();y=pg.evaluate('scrollY');job.click()
                        pg.locator('.jobs-related [data-job-link]').first.click()
                        pg.locator('.jobs-back').click()
                        expect(pg.locator('[data-job-link=MD007]')).to_be_focused()
                        assert pg.url==listurl
                        pos=pg.evaluate('scrollY');assert abs(pos-y)<=2,(y,pos)
                        facts.update(history_scroll=[y,pos],restored_url=pg.url)
                        pg.locator('[data-job-save=MD008]').click()
                        expect(pg.locator('[data-job-save=MD007]')).to_be_focused()
                    if action!='local':
                        remote=ctx.new_page();pr.navigate(remote,'vi','/jobs/'+SLUGS[remove])
                        peer=remote.locator('.job-summary-actions [data-job-save='+remove+']');expect(peer).to_have_attribute('aria-pressed','true')
                        if focus=='body':pg.evaluate('document.activeElement.blur()')
                        else:pg.locator(focus).focus()
                        expect(pg.locator(focus)).to_be_focused()
                        peer.click();expect(peer).to_have_attribute('aria-pressed','false')
                    else:
                        pg.locator(focus).focus();pg.keyboard.press('Enter')
                    expect(pg.locator('.jobs-grid [data-job-save='+remove+']')).to_have_count(0)
                    if action=='remote-boundary' or action=='local' and len(ids)==7:
                        expect(pg.locator('.jobs-grid .job-card')).to_have_count(6);expect(pg.locator('.jobs-pagination')).to_have_count(0)
                    if len(ids)==1:expect(pg.locator('.jobs-empty a')).to_be_visible()
                    assert pg.url==listurl
                    facts.update(actual_focus=pg.evaluate("()=>({tag:document.activeElement.tagName,save:document.activeElement.dataset.jobSave||null,link:document.activeElement.dataset.jobLink||null,id:document.activeElement.id||null,href:document.activeElement.getAttribute('href')})"),url=pg.url,list_ids=pg.locator('.jobs-grid [data-job-link]').evaluate_all('es=>es.map(e=>e.dataset.jobLink)'))
                    expect(pg.locator(target)).to_be_focused(timeout=1200)
                    facts['status']='Pass'
                except Exception as e:
                    facts.update(status='Fail',error=str(e)[:260])
                finally:
                    ctx.close()
                print(facts['status'],width,desc,facts.get('actual_focus'),flush=True);observations.append(facts)
        version=browser.version;browser.close()
    failed=[x for x in observations if x['status']!='Pass']
    output={'build_sha':p['source'],'dist_tree_sha256':p['dist_tree_sha256'],'browser':'Chromium '+version,'checks':observations}
    if '-candidate-' in p['source']:
        Path('/tmp/s2-saved-candidate-observations.json').write_text(json.dumps(output,indent=2)+'\n')
        if failed:raise SystemExit(1)
        return
    if o.baseline:(OUT/'before.json').write_text(json.dumps(output,indent=2)+'\n');return
    output['choices']=[
        {'choice_id':'P18-C2','coverage':'full' if not failed else 'partial','test_status':'Fail' if failed else 'Pass','assertion':'At 390/1440px a local or remote removal moved the previously focused title/bookmark to its nearest surviving counterpart; last-item removal focused the empty CTA. Real storage changes did not move focus from the filter or another card.','remaining':'','evidence_ref':'tests/s2-saved-focus-final.py'},
        {'choice_id':'P18-C3','coverage':'full' if not failed else 'partial','test_status':'Fail' if failed else 'Pass','assertion':'All eight fixtures filled two pages. A related-detail return restored the original query, hash, focus and measured scroll. Removing the last row locally then removing the job open in another tab clamped the visible page, preserved URL parameters and restored focus to the preceding visible bookmark. Last remaining fixture removal restored the empty CTA.','remaining':'','evidence_ref':'tests/s2-saved-focus-final.py'},
    ]
    (OUT/'choices.json').write_text(json.dumps(output,indent=2)+'\n')
    if failed:raise SystemExit(1)
if __name__=='__main__':main()
