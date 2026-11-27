"""Run interrupted/reduced-motion interactions against the exact offline Sprint 2 release."""
import importlib.util
import json
import os
import re
from datetime import datetime, timezone
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
SDD=ROOT/'docs/sdd/SEL-2026.11.27-v1.0.0'
OUT=SDD/'execution/browser/motion-final'
os.environ.setdefault('QA_OUTPUT',str(OUT))
spec=importlib.util.spec_from_file_location('pr',ROOT/'tests/s2-pr-browser.py')
pr=importlib.util.module_from_spec(spec)
spec.loader.exec_module(pr)
OUT=OUT/pr.SHA[:8]
rows=[]
STYLE="""el=>{const s=getComputedStyle(el);return {animation:s.animationName,anim:s.animationDuration,
transition:s.transitionProperty,duration:s.transitionDuration,opacity:s.opacity,display:s.display,
height:el.getBoundingClientRect().height,hidden:el.hidden,inert:el.inert};}"""


def frame(page):
    page.evaluate('() => new Promise(resolve=>requestAnimationFrame(resolve))')


def ms(value):
    return [round(float(s.strip()[:-2]) if s.strip().endswith('ms') else float(s.strip()[:-1])*1000) for s in value.split(',')]


def style(locator):
    # React may have detached this particular form while replacing the route-mode
    # subtree, in which case Chromium momentarily serializes blank CSS values.
    for _ in range(5):
        value=locator.evaluate(STYLE)
        if value['duration'] and value['anim'] and value['display']:
            return value
        frame(locator.page)
    raise AssertionError('No connected rendered style for '+str(locator))


def timing(style,t):
    return t in ms(style['duration']) or (style['animation']!='none' and t in ms(style['anim']))


def reduced(style):
    return max(ms(style['duration']))==0 and (style['animation']=='none' or max(ms(style['anim']))==0)


def fast_click(page,locator):
    # Keep several clicks inside one T2, without Playwright actionability waiting for motion.
    # A separate native key sequence below verifies keyboard activation.
    locator.evaluate('el=>el.click()')
    frame(page)


def result(checks,actual):
    return {'status':'Pass' if all(checks.values()) else 'Fail','checks':checks,'actual':actual}


def faq(pg):
    buttons=pg.locator('.info-faq h3 button')
    btn=buttons.nth(1)
    btn.scroll_into_view_if_needed()
    target=pg.locator('[id='+json.dumps(btn.get_attribute('aria-controls'))+']')
    base=style(target)
    copy_style=style(target.locator(':scope > div'))
    fast_click(pg,btn)
    partial=style(target)
    fast_click(pg,buttons.nth(0))
    pg.emulate_media(reduced_motion='reduce')
    fast_click(pg,btn)
    btn.focus()
    current=pg.locator('.service-faq-answer:not([inert])')
    old=pg.locator('.service-faq-answer[inert]')
    final=style(target)
    return result({'T2 height and T1 opacity declared':timing(base,180) and timing(copy_style,120),
        'last answer only':current.count()==1 and current.get_attribute('id')==btn.get_attribute('aria-controls'),
        'trigger and panel ARIA synchronized':btn.get_attribute('aria-expanded')=='true' and current.get_attribute('aria-hidden')=='false',
        'all closed panels inert and hidden from AT':old.count()==buttons.count()-1 and old.evaluate_all("xs=>xs.every(el=>el.inert && el.getAttribute('aria-hidden')==='true')"),
        'reduced switches immediately':reduced(final) and final['height']>0 and final['opacity']=='1'},
        {'initial':base,'initial_copy':copy_style,'interrupted_open':partial,'reduced_final':final,'closed':old.count()})


def filters(pg):
    trigger=pg.locator('[aria-controls="jobs-more-filters"]')
    panel=pg.locator('#jobs-more-filters')
    trigger.focus();pg.keyboard.press('Enter');frame(pg)
    opening=style(panel)
    clip=panel.locator('.jobs-filter-clip')
    inner=style(clip) if clip.count() else style(panel.locator('select').first)
    child=panel.locator('select').first
    chosen=child.select_option(index=1)[0]
    fast_click(pg,trigger);fast_click(pg,trigger)
    pg.emulate_media(reduced_motion='reduce');fast_click(pg,trigger)
    closed=style(panel)
    hidden=panel.evaluate("el=>el.hidden || el.inert")
    width=pg.viewport_size['width']
    pg.set_viewport_size({'width':1440 if width==390 else 390,'height':900})
    frame(pg);fast_click(pg,trigger)
    final=style(panel)
    return result({'mobile-only T2 expansion with T1 opacity':width>767 or (timing(opening,180) and timing(inner,120)),
        'closed panel inert or hidden':hidden and (closed['height']==0 or closed['inert']),
        'retains selected filter across interruption and breakpoint':child.input_value()==chosen and trigger.get_attribute('aria-expanded')=='true',
        'reduced immediate':reduced(final) and final['height']>0},
        {'selected':chosen,'opening':opening,'initial_inner':inner,'closed':closed,'final':final,'url':pg.url})


def modes(pg,path):
    education=path.startswith('/education')
    controls=pg.locator('.education-form-tabs button' if education else '.form-mode button')
    form=pg.locator('.education-form-card form' if education else '.contact-form')
    first,other=controls.nth(0),controls.nth(1)
    first.click();field=form.locator('input[name=name],input[autocomplete=name]').first
    if not field.count():
        field=form.locator('input:not([type=file]):not([type=checkbox])').first
    field.fill('QA first mode')
    fast_click(pg,other)
    animated=style(form)
    other_name=form.locator('input[name=name],input[autocomplete=name]').first
    if not other_name.count():
        other_name=form.locator('input:not([type=file]):not([type=checkbox])').first
    other_name.fill('QA second mode')
    fast_click(pg,first);fast_click(pg,other)
    pg.emulate_media(reduced_motion='reduce');fast_click(pg,first)
    first_value=field.input_value()
    history_mode=education or path=='/contact'
    restored=''
    if history_mode:
        pg.evaluate('history.back()')
        pg.wait_for_function("s=>document.querySelectorAll(s)[1]?.getAttribute('aria-pressed')==='true'",arg='.education-form-tabs button' if education else '.form-mode button')
        restored=other_name.input_value()
        pg.evaluate('history.forward()')
        pg.wait_for_function("s=>document.querySelectorAll(s)[0]?.getAttribute('aria-pressed')==='true'",arg='.education-form-tabs button' if education else '.form-mode button')
    final=style(form)
    return result({'optional fade is either immediate or T1':reduced(animated) or timing(animated,120),
        'one form and chosen mode':form.count()==1 and first.get_attribute('aria-pressed')=='true',
        'drafts persist':first_value=='QA first mode' and (not history_mode or restored=='QA second mode'),
        'reduced change immediate':reduced(final) and final['opacity']=='1'},
        {'first_draft':first_value,'second_after_back':restored,'history_applies':history_mode,'url':pg.url,'regular':animated,'reduced':final})


def about_tabs(pg):
    tabs=pg.locator('#history [role=tab]')
    first=tabs.nth(0)
    first.click();first.focus();pg.keyboard.press('ArrowRight')
    panel=pg.locator('#history [role=tabpanel]')
    before_enter=pg.locator('#history [aria-selected=true]').get_attribute('id')
    pg.keyboard.press('Enter');frame(pg)
    normal=style(panel)
    indicator=style(pg.locator('#history [aria-selected=true]'))
    pg.emulate_media(reduced_motion='reduce')
    pg.keyboard.press('ArrowRight');pg.keyboard.press('Space')
    selected=pg.locator('#history [aria-selected=true]')
    final=style(panel)
    return result({'selected tab and panel agree':selected.count()==1 and panel.count()==1 and selected.get_attribute('id')==panel.get_attribute('aria-labelledby'),
        'keyboard focus at selected tab':selected.evaluate('el=>el===document.activeElement'),
        'unselected panels cannot receive Tab':pg.locator('.info-history-slide[aria-hidden=true]').evaluate_all("xs=>xs.every(el=>!Array.from(el.querySelectorAll('a,button,[tabindex]')).some(x=>x.tabIndex>=0 && !x.closest('[inert],[hidden]')))"),
        'normal content uses T2':timing(normal,180), 'active indicator uses T1':timing(indicator,120),'reduced finishes immediately':reduced(final)},
        {'selection_after_arrow_before_enter':before_enter,'normal':normal,'indicator':indicator,'reduced':final,'selected':selected.get_attribute('id')})


def receipt(pg):
    trigger=pg.locator('.service-overview button.btn').first
    trigger.click();dlg=pg.locator('[role=dialog]');form=dlg.locator('.contact-form')
    close=dlg.locator('.modal-heading button')
    for name,value in [('name','QA motion'),('phone','0900000000'),('location','QA location'),('notes','QA notes')]:
        form.locator('[name='+name+']').fill(value)
    heading=dlg.locator('.form-success h3')
    # Two immediate submits without an intervening paint; contact handler guards duplicates.
    form.evaluate('el=>{el.requestSubmit();el.requestSubmit()}')
    heading.wait_for();receipt=dlg.locator('.form-success')
    initial=style(receipt.locator('p').first)
    focused=heading.evaluate('el=>el===document.activeElement')
    id1=receipt.locator('a').first.get_attribute('href')
    pg.emulate_media(reduced_motion='reduce')
    pg.keyboard.press('Escape')
    no_dialog=dlg.count()==0
    restored=trigger.evaluate('el=>el===document.activeElement')
    trigger.click()
    fresh=dlg.locator('.contact-form').count()==1 and dlg.locator('.form-success').count()==0
    for name,value in [('name','QA again'),('phone','0900000000'),('location','QA location'),('notes','QA again')]:
        form.locator('[name='+name+']').fill(value)
    form.locator('button[type=submit]').click()
    heading.wait_for()
    current=style(receipt.locator('p').first)
    id2=receipt.locator('a').first.get_attribute('href')
    sequential=int(re.search(r'DEMO-(\d+)',id2)[1])==1+int(re.search(r'DEMO-(\d+)',id1)[1])
    close.click()
    return result({'receipt immediately focused':focused,'dismissal and reset':no_dialog and restored and fresh,
        'duplicate submit created only one record':sequential,'regular receipt uses T1':timing(initial,120),
        'reduced immediate':reduced(current) and current['opacity']=='1','final dialog closed':dlg.count()==0},
        {'regular':initial,'reduced':current,'receipt_links':[id1,id2],'restored':restored})


def admin(pg):
    tabs=pg.locator('.admin-side button')
    tabs.first.focus();pg.keyboard.press('Tab');pg.keyboard.press('Enter')
    normal=style(pg.locator('#admin-panel'))
    pg.locator('textarea').fill('QA CMS draft')
    pg.emulate_media(reduced_motion='reduce')
    fast_click(pg,tabs.nth(0));fast_click(pg,tabs.nth(1))
    return result({'last admin view active':tabs.nth(1).get_attribute('aria-pressed')=='true',
        'draft survives real view switches':pg.locator('textarea').input_value()=='QA CMS draft',
        'one active view':pg.locator('#admin-panel').count()==1 and not pg.locator('.admin-table-wrap').count()},
        {'semantic_pattern':'ordinary aria-pressed view selector, not role=tab; does not supply evidence for true tab transition','normal':normal})


def main():
    OUT.mkdir(parents=True,exist_ok=True)
    receipt_path=Path(os.environ.get('QA_ATTESTATION',OUT.parent.parent/'46006325645/axe-vi-summary.json'))
    baseline=json.loads(receipt_path.read_text())
    fingerprint=pr.fingerprint()
    if fingerprint!=baseline['dist_tree_sha256'] or pr.SHA!=baseline.get('sha',baseline.get('build_sha')):
        raise SystemExit('Source or dist fingerprint mismatch')
    services=[p for p in pr.PAGE_IDS if p.startswith('/services/')]
    cases=[('MO03-1',p,faq) for p in services]
    cases += [('MO03-2',p,modes) for p in ['/about-us',*services[:3],services[-1],*[r for r in pr.PAGE_IDS if r.startswith('/education')],'/contact']]
    cases += [('MO03-3','/jobs',filters),('MO03-4','/about-us',about_tabs),('MO03-4','/admin-demo',admin),('MO02-4',services[0],receipt)]
    prior={}
    if os.environ.get('QA_RETRY_BLOCKED')=='1':
        last=json.loads((OUT/'observations.json').read_text())
        assert last['build_sha']==pr.SHA and last['dist_tree_sha256']==fingerprint
        prior={(r['choice_id'],r['width'],r['path']):r for r in last['observations']}
    with sync_playwright() as pw:
        with pw.chromium.launch(executable_path=os.environ.get('CHROME_PATH'),args=['--disable-background-networking','--disable-quic','--host-resolver-rules=MAP * ~NOTFOUND']) as browser:
            for width in (390,1440):
                ctx=browser.new_context(viewport={'width':width,'height':pr.HEIGHTS[width]},service_workers='block')
                pr.isolate(ctx)
                pg=ctx.new_page();pg.set_default_timeout(4000)
                for code,path,fn in cases:
                    previous=prior.get((code,width,path))
                    if previous and previous['status']!='Blocked':
                        rows.append(previous)
                        continue
                    pg.set_viewport_size({'width':width,'height':pr.HEIGHTS[width]})
                    pg.emulate_media(reduced_motion='no-preference')
                    try:
                        pr.navigate(pg,'vi',path)
                        data=fn(pg,path) if fn==modes else fn(pg)
                    except Exception as e:
                        data={'status':'Blocked','error':str(e)[:1100]}
                    row={'choice_id':code,'path':path,'locale':'vi','width':width,**data}
                    if previous: row['rerun_after']=previous.get('error',previous['status'])
                    rows.append(row)
                    print(code,width,path,row['status'],[k for k,v in row.get('checks',{}).items() if not v],row.get('error','')[:135],flush=True)
                ctx.close()
            version=browser.version
    tested=datetime.now(timezone.utc).isoformat(timespec='seconds')
    output={'build_sha':pr.SHA,'dist_tree_sha256':fingerprint,'tested_utc':tested,'chromium':version,'observations':rows,
            'limits':'Localized VI representative mobile/desktop, actual keyboard inputs and rapid DOM click inputs with animation frames, mid-journey reduced-motion switch. No physical IME or device.',
            'missing':sorted(pr.missing),'errors':pr.errors}
    (OUT/'observations.json').write_text(json.dumps(output,ensure_ascii=False,indent=2)+'\n')
    frozen={r['effective_code']:r for l in (SDD/'data/selections-motion-all-statuses.jsonl').read_text().splitlines() if (r:=json.loads(l))}
    choices=[]
    for code in sorted({r['choice_id'] for r in rows}):
        subset=[r for r in rows if r['choice_id']==code]
        issues=sorted({k for r in subset for k,v in r.get('checks',{}).items() if not v})
        status='Fail' if any(r['status']=='Fail' for r in subset) else 'Blocked' if any(r['status']=='Blocked' for r in subset) else 'Pass'
        choices.append({'choice_id':code,'source_row':frozen[code]['row'],'test_status':status,'coverage':'full' if status=='Pass' else 'partial',
            'steps':f'Run {code} in actual Chromium, regular to reduced motion, rapid inputs, VI at 390/1440.',
            'actual':f'{sum(r["status"]=="Pass" for r in subset)}/{len(subset)} route-width cases pass all measured predicates.',
            'remaining':', '.join(issues) if issues else ('Review blocked scenario in observations' if status=='Blocked' else ''),
            'route':'multiple','locales':[{'locale':'vi','test_status':status,'actual':str(issues) if issues else status}]})
    (OUT/'choices.json').write_text(json.dumps({'build_sha':pr.SHA,'dist_tree_sha256':fingerprint,'choices':choices},indent=2)+'\n')
    return any(r['status']!='Pass' for r in rows)


if __name__=='__main__':
    raise SystemExit(main())
