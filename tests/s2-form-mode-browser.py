"""Verify MI06-3 only on the five frozen P32–P35/P37 switchable form routes."""
import importlib.util
import json
import os
from pathlib import Path
from datetime import datetime, timezone
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
SDD=ROOT/'docs/sdd/SEL-2026.11.27-v1.0.0'
OUT=SDD/'execution/browser/form-mode-final'
os.environ.setdefault('QA_OUTPUT',str(OUT))
spec=importlib.util.spec_from_file_location('pr',ROOT/'tests/s2-pr-browser.py')
pr=importlib.util.module_from_spec(spec)
spec.loader.exec_module(pr)
OUT=OUT/pr.SHA[:8]
PAGES=['P32','P33','P34','P35','P37']


def measure(page,route):
    education=route.startswith('/education')
    codes=('F05','F06') if education else ('F02','F01')
    anchor='dang-ky' if education else 'consultation'
    panel='.education-form-card' if education else '.contact-reference-form'
    form=page.locator(panel+' form')
    buttons=page.locator('.education-form-tabs button' if education else '.form-mode button')
    name=form.locator('[name=name]')
    specific=(['question','document'] if education else ['message','notes'])
    def state():
        # Snapshot a single committed frame. Separate protocol calls can straddle React's route commit.
        page.evaluate('() => new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))')
        return page.evaluate("""([panel,education])=>{
            const form=document.querySelector(panel+' form'), heading=document.querySelector(education?'.education-form-card form h3':'#contact-form-heading');
            return {title:heading.innerText,checked:[...document.querySelectorAll(education?'.education-form-tabs button':'.form-mode button')].map(n=>n.getAttribute('aria-pressed')),
                mode:new URLSearchParams(location.search).get('form'),name:form.elements.namedItem('name').value,
                fields:Array.from(form.elements).map(x=>x.name).filter(Boolean),errors:form.querySelectorAll('[aria-invalid=true]').length,
                forms:document.querySelectorAll(panel+' form').length,validFocus:document.activeElement.isConnected && !!document.activeElement.closest("main") && !document.activeElement.closest("[inert],[hidden]")};
        }""",[panel,education])
    pr.navigate(page,'vi',route+'?form='+codes[0]+'#'+anchor)
    name.fill('QA draft one');form.locator('[type=submit]').click()
    first=state()
    buttons.nth(1).click();name.fill('QA draft two')
    second=state()
    pg=page
    page.emulate_media(reduced_motion='reduce')
    for b in (buttons.nth(0),buttons.nth(1),buttons.nth(0)):
        b.focus();pg.keyboard.press('Space')
    selected=state()
    for direction,idx in (('back',1),('forward',0)):
        page.evaluate('history.'+direction+'()')
        page.wait_for_function("v=>new URLSearchParams(location.search).get('form')===v",arg=codes[idx])
        page.wait_for_function("([s,i])=>document.querySelectorAll(s)[i]?.getAttribute('aria-pressed')==='true'",
                               arg=['.education-form-tabs button' if education else '.form-mode button',idx])
        if direction=='back': back=state()
        else: forward=state()
    def matches(record,idx):
        return (record['forms']==1 and record['checked']==(['true','false'] if idx==0 else ['false','true']) and
                record['mode']==codes[idx] and specific[idx] in record['fields'] and specific[1-idx] not in record['fields'] and
                record['name']==('QA draft one' if idx==0 else 'QA draft two') and bool(record['title'].strip()))
    checks={'state_and_drafts':all(matches(s,i) for s,i in [(first,0),(second,1),(selected,0),(back,1),(forward,0)]),
            'headings':first['title']!=second['title'] and first['title']==selected['title']==forward['title'] and back['title']==second['title'],
            'no_stale_error':first['errors']>0 and second['errors']==0 and selected['errors']==0,
            'reduced_focus':selected['validFocus']}
    return {'observations':[first,second,selected,back,forward],'checks':checks}


def main():
    OUT.mkdir(parents=True,exist_ok=True)
    dig=pr.fingerprint(); receipt=json.loads(Path(os.environ['QA_ATTESTATION']).read_text())
    assert dig==receipt['dist_tree_sha256'] and pr.SHA==receipt.get('sha',receipt.get('build_sha'))
    routes=[route for route,pid in pr.PAGE_IDS.items() if pid in PAGES]
    assert len(routes)==len(PAGES)
    rows=[]
    with sync_playwright() as pw, pw.chromium.launch(executable_path=os.environ['CHROME_PATH'],args=['--no-sandbox']) as browser:
        version=browser.version
        for width in (390,1440):
            for route in routes:
                with browser.new_context(viewport={'width':width,'height':pr.HEIGHTS[width]},service_workers='block') as ctx:
                    pr.isolate(ctx);page=ctx.new_page();page.set_default_timeout(5000)
                    try: data=measure(page,route)
                    except Exception as err:data={'error':str(err)}
                    rows.append({'route':route,'width':width,**data})
                    print(route,width,data.get('error'),[k for k,v in data.get('checks',{}).items() if not v],flush=True)
    absent=any('error' in r for r in rows) or pr.missing or pr.errors or len(rows)!=2*len(PAGES)
    failed=any(not all(r.get('checks',{}).values()) for r in rows if 'checks' in r)
    status='Fail' if failed else 'Blocked' if absent else 'Pass'
    passes=sum('checks' in r and all(r['checks'].values()) for r in rows)
    common={'build_sha':pr.SHA,'dist_tree_sha256':dig,'tested_utc':datetime.now(timezone.utc).isoformat(timespec='seconds')}
    for key,payload in [('choices',{'choices':[{'choice_id':'MI06-3','test_status':status,'coverage':'full' if status=='Pass' else 'partial',
                                'actual':f'{passes}/10 VI route-width journeys with rapid mode keys, errors, focus, headings, fields, drafts and real browser history.',
                                'remaining':'' if status=='Pass' else 'See raw per-route failed or unavailable predicates.'}]}),
                        ('observations',{'observations':rows,'missing':sorted(pr.missing),'page_errors':pr.errors,'chromium':version,
                                         'limits':'VI desktop Chromium at two viewport widths; this is mode behaviour, not native device coverage.'})]:
        (OUT/(key+'.json')).write_text(json.dumps({**common,**payload},ensure_ascii=False,indent=2)+'\n')
    return status!='Pass'


if __name__=='__main__':
    raise SystemExit(main())
