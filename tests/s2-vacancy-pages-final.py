"""Check each specific vacancy's frozen pay, status and summary at actual browser breakpoints."""
from pathlib import Path
import argparse, json, importlib.util, os, shutil, subprocess, traceback
from playwright.sync_api import sync_playwright, expect

ROOT=Path(__file__).resolve().parents[1]
SDD=ROOT/'docs/sdd/SEL-2026.11.27-v1.0.0'
OUT=SDD/'execution/b2c-final-pages'
MEASURE="""() => {
 const q=s=>document.querySelector(s),r=e=>{const b=e.getBoundingClientRect();return [b.x,b.y+scrollY,b.width,b.height].map(v=>Math.round(v*10)/10)};
 const intro=q('.job-detail-intro'),h=intro.querySelector('h1'),summary=q('.job-summary'),titleText=document.createRange();titleText.selectNodeContents(h);
 const groups=[...document.querySelectorAll('.job-description-block')].slice(0,3).map(g=>({n:g.querySelectorAll('li').length,h:g.querySelector('h2').innerText,box:r(g)}));
 return {w:innerWidth,doc:document.documentElement.scrollWidth,title:h.innerText,h1:r(h),meta:r(intro.querySelector('.job-card-meta')),code:intro.querySelector('.job-card-meta span').innerText,
   status:intro.querySelector('.job-status').innerText,titleLines:[...titleText.getClientRects()].map(b=>[b.x,b.width]),summary:r(summary),salary:q('.job-pay dd').innerText,
   shift:q('.job-summary-shift')?.innerText,location:q('.job-summary-locality').innerText,extra:[...summary.querySelectorAll('dd')].map(e=>e.innerText),
   actions:[...q('.job-summary-actions').querySelectorAll('a,button')].map(b=>({t:b.innerText,box:r(b)})),groups};
}"""

def main():
    parser=argparse.ArgumentParser();parser.add_argument('receipt',type=Path);parser.add_argument('--retry-failed',action='store_true');args=parser.parse_args()
    proof=json.loads(args.receipt.read_text());os.environ.update(DIST_DIR=proof['dist'],QA_OUTPUT=str(OUT))
    spec=importlib.util.spec_from_file_location('pr',ROOT/'tests/s2-pr-browser.py');pr=importlib.util.module_from_spec(spec);spec.loader.exec_module(pr)
    assert pr.fingerprint()==proof['dist_tree_sha256']
    page_input=[json.loads(l) for l in (SDD/'data/pages-and-urls.jsonl').read_text().splitlines()]
    selected={r['effective_code']:r['fields'] for f in (SDD/'data').glob('selections-*') for line in f.read_text().splitlines() if (r:=json.loads(line))['status']=='Chọn'}
    prior={}
    if args.retry_failed:
        prev=json.loads((OUT/'vacancies.json').read_text());assert prev['build_sha']==proof['source'] and prev['dist_tree_sha256']==proof['dist_tree_sha256']
        prior={(r['page'],r['locale']):r for r in prev['observations'] if r['status']=='Pass'}
    data=[];choices=[]
    with sync_playwright() as pw:
        browser=pw.chromium.launch(executable_path=os.environ.get('CHROME_PATH') or shutil.which('chromium'),args=['--disable-background-networking','--disable-quic','--host-resolver-rules=MAP * ~NOTFOUND'])
        for number,r in enumerate(page_input[9:17],1):
            code=r['source_code'];assert code=='P'+str(9+number);jid='MD'+str(number).zfill(3);path=r['fields']['Đường dẫn'];rows=[];closed=jid=='MD005'
            for lang in pr.LOCALES:
                if (code,lang) in prior:rows.append(prior[code,lang]);continue
                c=browser.new_context(viewport={'width':390,'height':844},service_workers='block',reduced_motion='reduce');c.route('**/*',pr.local);pg=c.new_page()
                try:
                    pr.navigate(pg,lang,path);facts=[];closed=jid=='MD005'
                    for w in [390,766,767,768,1440]:
                        pg.set_viewport_size({'width':w,'height':844});pg.evaluate('()=>new Promise(r=>requestAnimationFrame(r))')
                        g=pg.evaluate(MEASURE)
                        assert g['doc']==g['w']==w and jid in g['code'] and g['title'].strip() and g['status'].strip(),g
                        assert all(x>=-1 and x+width<=w+1 for x,width in g['titleLines']) and g['meta'][1]+g['meta'][3]<=g['h1'][1]+1
                        assert len(g['actions'])==2 and len(g['groups'])==3 and all(s['h'].strip() and s['n']>0 for s in g['groups'])
                        assert all(e['box'][0]>=-1 and e['box'][0]+e['box'][2]<=w+1 for e in g['actions'])
                        assert g['salary'].strip() and g['shift'] and g['location'].strip()
                        if lang=='vi':
                            frozen=' '.join(str(v) for v in selected[code+'-A2'].values());assert g['title'] in ' '.join(str(v) for v in selected[code+'-A1'].values()),g['title']
                            loc=g['location'].replace('Địa điểm','').strip();shift=g['shift'].replace('Ca làm việc','').strip()
                            assert all(v in frozen for v in [g['salary'],loc,shift]),(g['salary'],loc,shift,frozen)
                            assert g['status'].casefold()==('Đã đóng' if closed else 'Đang tuyển').casefold(),g
                            for x in g['extra']:
                                if x.startswith('KCN'):assert x in frozen,x
                        if lang=='vi' and w in [390,1440]:
                            pg.evaluate('scrollTo(0,0)');pg.screenshot(path=str(OUT/f'{code}-{w}-position.png'),animations='disabled')
                        facts.append(g)
                    pg.set_viewport_size({'width':390,'height':844});back=pg.locator('.jobs-back');back.focus();pg.keyboard.press('Tab')
                    active=pg.locator(':focus');assert active.evaluate('e=>!!e.closest(".job-summary-actions")')
                    toolbar=pg.locator('.job-mobile-apply');assert (toolbar.count()==0 or toolbar.is_hidden())
                    if closed:
                        assert pg.locator('.job-apply-button').count()==0 and toolbar.count()==0
                        expect(active).to_have_attribute('href',pr.BASE+('' if lang=='vi' else '/'+lang)+'/jobs?status=active#job-listings')
                        pg.keyboard.press('Tab');expect(pg.locator('.job-summary-actions [data-job-save]')).to_be_focused()
                        assert all(a['box'][2]>=44 and a['box'][3]>=44 for a in facts[0]['actions'])
                    else:
                        expect(pg.locator('.job-apply-button')).to_be_focused()
                        pg.keyboard.press('Enter');expect(pg.get_by_role('dialog')).to_be_visible();expect(toolbar).to_be_hidden()
                        pg.keyboard.press('Escape');expect(pg.get_by_role('dialog')).to_have_count(0);expect(pg.locator('.job-apply-button')).to_be_focused()
                        pg.locator('.job-detail-body .job-description-block').last.scroll_into_view_if_needed()
                        expect(toolbar).to_be_visible()
                    pg.set_viewport_size({'width':640,'height':450});pg.evaluate('scrollTo(0,0)')
                    session=c.new_cdp_session(pg);session.send('Emulation.setPageScaleFactor',{'pageScaleFactor':2})
                    assert pg.evaluate('visualViewport.scale')==2
                    zoom_title=pg.locator('main h1').inner_text();assert zoom_title==facts[-1]['title']
                    row={'page':code,'locale':lang,'status':'Pass','widths':facts,'zoom_title':zoom_title,'closed':closed,'keyboard':'Summary reached by Tab; closed actions or live dialog exercised.'}
                    print('PASS',code,lang,flush=True)
                except Exception as e:
                    reason=traceback.format_exc()[-1200:];row={'page':code,'locale':lang,'status':'Fail','error':reason};print('FAIL',code,lang,reason,flush=True)
                finally:c.close()
                rows.append(row)
            data.extend(rows)
            ok=all(row['status']=='Pass' for row in rows)
            for tail,full,assertion,remaining in [
                ('A1',True,'Measured original job code, localized status and title hierarchy for five languages at 390/766/767/768/1440px. The whole title fits horizontally; screenshots document the Vietnamese mobile and desktop view.',''),
                ('A2',True,'Compared the Vietnamese salary, locality, KCN when applicable, and shift/schedule against the frozen job-specific row; all five locales rendered the actual salary, shift and locality.',''),
                ('A3',False,'Located both summary actions and all three nonempty, titled description groups; mobile and desktop screenshots are supplied.','The relative visual weight of the description groups remains an editorial judgement.'),
                ('D1',False,'Measured the summary at 766/767/768px and the mobile/desktop edges; retained the frozen salary and shift. Chromium interaction used reduced motion, Tab and a 2× visual viewport.','The frozen comparison calls for separate phone evidence; these measurements came from desktop Chromium with a mobile viewport.'),
                ('D2',closed,'Checked native keyboard activation, visibility of the mobile action before/after the inline action, and modal/return focus; closed vacancy exposes only save and other-open-positions controls, each at least 44px.','' if closed else 'A physical device with an open OS soft keyboard was not available.'),
                ('D3',False,'Under reduced motion, Tab reached the actual actions in all five languages. The titles survived 2× Chromium visual-viewport zoom; active applications opened/dismissed via keyboard and the closed vacancy had keyboard alternatives.','The actual handset/OS zoom and keyboard combination remains unobserved.')]:
                choices.append({'choice_id':code+'-'+tail,'coverage':'full' if full and ok else 'partial','test_status':'Pass' if ok else 'Fail','assertion':assertion if ok else str([r.get('error') for r in rows if r['status']=='Fail'])[:440],'remaining':remaining,'evidence_ref':'tests/s2-vacancy-pages-final.py'})
        version=browser.version;browser.close()
    (OUT/'vacancies.json').write_text(json.dumps({'build_sha':proof['source'],'dist_tree_sha256':proof['dist_tree_sha256'],'browser':version,'observations':data,'choices':choices},ensure_ascii=False,indent=2)+'\n')
    if any(r['status']=='Fail' for r in data):raise SystemExit(1)
if __name__=='__main__':main()
