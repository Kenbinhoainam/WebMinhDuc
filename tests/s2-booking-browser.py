"""P38 native date, radio group, drafts and demo receipt against an attested Sites build."""
import importlib.util
import json
import os
from datetime import datetime, timezone
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
SDD = ROOT / 'docs/sdd/SEL-2026.11.27-v1.0.0'
BASE = SDD / 'execution/browser/booking-final'
os.environ.setdefault('QA_OUTPUT', str(BASE))
spec = importlib.util.spec_from_file_location('pr', ROOT / 'tests/s2-pr-browser.py')
pr = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pr)
OUT = BASE / pr.SHA[:8]
SLOTS = ['09:00', '10:30', '14:00', '15:30']


def frame(page):
    page.evaluate('() => new Promise(resolve => requestAnimationFrame(()=>requestAnimationFrame(resolve)))')


def focus_is(node):
    return node.evaluate('e=>e === document.activeElement')


def spin_values(cdp):
    return [(node['name']['value'], node.get('value', {}).get('value')) for node in
            cdp.send('Accessibility.getFullAXTree')['nodes'] if node['role'].get('value') == 'spinbutton']


def upcoming(page, offset, locale):
    return page.evaluate("""([offset,locale])=>{
      const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()+offset);
      const n=v=>String(v).padStart(2,'0');
      return [d.getFullYear()+'-'+n(d.getMonth()+1)+'-'+n(d.getDate()),
        new Intl.DateTimeFormat(locale==='zh'?'zh-Hans':locale,{day:'numeric',month:'long',year:'numeric'}).format(d)]
    }""", [offset,locale])


def read_selection(page):
    summary=page.locator('.consultation-choose [role=status]')
    radio=page.locator('.consultation-times input:checked')
    return {'summary':summary.inner_text().strip() if summary.count() else '',
            'selected':radio.evaluate_all('nodes=>nodes.map(n=>n.value)')}


def exercise(page, cdp, locale, width):
    checks={}
    evidence={}
    pr.navigate(page,locale,'/consultation')
    date=page.locator('#consultation-date')
    first=page.locator('.consultation-choose button[type=submit]')
    radios=page.locator('.consultation-times input')
    tiles=page.locator('.consultation-times span')
    progress=page.locator('.consultation-progress [aria-current=step]')
    choose=page.locator('.consultation-choose')
    info=page.locator('.consultation-details:visible')
    receipt=page.locator('.consultation-success')
    empty_focus=[]
    for delta in (None,-1):
        if delta is not None: date.fill(upcoming(page,delta,locale)[0])
        first.focus();page.keyboard.press('Enter')
        date.evaluate('e=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))')
        empty_focus.append({'focus':focus_is(date),'error':page.locator('#consultation-error').inner_text(),
                            'invalid':date.get_attribute('aria-invalid'),'step':progress.inner_text()})
    checks['invalid_date']=all(v['focus'] and v['error'] and v['invalid']=='true' for v in empty_focus)
    evidence['date_errors']=empty_focus

    date.fill('');date.focus();page.keyboard.press('1')
    partial=spin_values(cdp);frame(page);partial2=spin_values(cdp)
    checks['native_partial']=date.get_attribute('type')=='date' and date.input_value()=='' and partial==partial2 and len(partial)==3 and any(v for _,v in partial) and choose.is_visible() and focus_is(date)
    evidence['native_partial']=[partial,partial2]
    day,localized=upcoming(page,3,locale)
    later,localized2=upcoming(page,4,locale)
    page.emulate_media(reduced_motion='reduce')
    date.evaluate("e=>e.scrollIntoView({block:'center',behavior:'instant'})")
    frame(page)
    stable_y=page.evaluate('scrollY')
    date.fill(later);date.fill(day)
    frame(page); date_value=read_selection(page)
    checks['live_date']=localized in date_value['summary'] and date.input_value()==day and focus_is(date) and abs(page.evaluate('scrollY')-stable_y)<2
    evidence['date_summary']=dict(expected=localized,actual=date_value,scroll_before=stable_y,scroll_after=page.evaluate('scrollY'),focused=focus_is(date))
    page.emulate_media(reduced_motion='no-preference')
    first.focus();page.keyboard.press('Enter');frame(page)
    checks['missing_slot']=focus_is(radios.first) and page.locator('#consultation-error').is_visible()

    box=lambda: tiles.evaluate_all('nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return [r.x,r.y,r.width,r.height]})')
    geometry=box()
    evidence['grids']={}
    for testwidth in (390,767,768,1440):
        page.set_viewport_size({'width':testwidth,'height':640});frame(page)
        g=box()
        evidence['grids'][testwidth]={'rows':len(set(b[1] for b in g)), 'tiles':g}
    page.set_viewport_size({'width':width,'height':pr.HEIGHTS[width]});frame(page)
    checks['slot_geometry']=all(g['rows']==(2 if w<=767 else 1) and all(b[2]>42 and b[3]>=44 for b in g['tiles']) for w,g in evidence['grids'].items())
    checks['slots']=radios.evaluate_all('nodes=>nodes.map(n=>n.value)')==SLOTS
    tiles.nth(1).click()
    normal=read_selection(page)
    properties=tiles.nth(1).evaluate("n=>({duration:getComputedStyle(n).transitionDuration,properties:getComputedStyle(n).transitionProperty})")
    page.keyboard.press('ArrowRight')
    right=read_selection(page)
    focus_outline=tiles.nth(2).evaluate("n=>getComputedStyle(n).outlineWidth")
    marker=tiles.nth(2).evaluate("n=>({content:getComputedStyle(n,'::before').content,border:getComputedStyle(n,'::before').borderRightWidth})")
    page.keyboard.press('ArrowLeft');left=read_selection(page)
    page.emulate_media(reduced_motion='reduce')
    page.keyboard.press('ArrowRight');page.keyboard.press('ArrowLeft');page.keyboard.press('ArrowRight')
    reduced=read_selection(page)
    reduced_style=tiles.nth(2).evaluate("n=>getComputedStyle(n).transitionDuration")
    checks['native_selection']=[s['selected'] for s in (normal,right,left,reduced)]==[['10:30'],['14:00'],['10:30'],['14:00']] and focus_is(radios.nth(2)) and marker['content'] not in ('none','normal') and marker['border']!='0px' and focus_outline!='0px'
    checks['slot_summary']=all(localized+' · '+s['selected'][0] in s['summary'] for s in (normal,right,left,reduced) if s['selected']) and all(float(s.removesuffix('s'))*1000 < 1 for s in reduced_style.split(', '))
    checks['stable_tiles']=all(abs(v-current)<1 for before,after in zip(geometry,box()) for v,current in zip(before[2:],after[2:]))
    evidence['slots']={'normal':normal,'right':right,'left':left,'reduced':reduced,'marker':marker,'focus_outline':focus_outline,'transition':properties,'reduced_transition':reduced_style}
    checks['missing_slot_before_progress']=choose.is_visible() and info.count()==0 and receipt.count()==0
    first.click()
    detail_heading=info.locator('h2')
    checks['details_focus']=focus_is(detail_heading) and localized+' · 14:00' in info.locator('.consultation-summary').inner_text()
    name=info.locator('input[name=name]');phone=info.locator('input[name=phone]')
    name.fill('Booking QA');phone.fill('0912345678')
    info.locator('.consultation-summary button').click();frame(page)
    checks['edit_focus']=focus_is(date) and not info.count() and date.input_value()==day and read_selection(page)['selected']==['14:00']
    date.fill(later);tiles.nth(3).click();first.click()
    checks['draft']=name.input_value()=='Booking QA' and phone.input_value()=='0912345678' and localized2+' · 15:30' in info.locator('.consultation-summary').inner_text() and focus_is(detail_heading)
    checks['pre_receipt']=receipt.count()==0
    info.locator('form').evaluate('el=>{el.requestSubmit();el.requestSubmit()}')
    receipt.wait_for()
    rid=receipt.locator('strong').last.inner_text()
    checks['success']=rid=='DEMO-0001' and receipt.get_attribute('role')=='status' and focus_is(receipt.locator('h2')) and localized2+' · 15:30' in receipt.inner_text()
    evidence['receipt']={'id':rid,'text':receipt.inner_text()}
    receipt.locator('button').focus();page.keyboard.press('Enter');frame(page)
    checks['reset']=date.input_value()=='' and read_selection(page)=={'summary':'','selected':[]} and focus_is(date) and not receipt.count() and not info.count()
    date.fill(day);tiles.first.click();first.click()
    checks['clean_form']=name.input_value()=='' and phone.input_value()=='' and page.locator('.consultation-card [aria-invalid=true]').count()==0
    name.fill('Second QA');phone.fill('0987654321')
    info.locator('button[type=submit]').focus();page.keyboard.press('Enter')
    receipt.wait_for();checks['sequence']=receipt.locator('strong').last.inner_text()=='DEMO-0002'
    evidence['next_id']=receipt.locator('strong').last.inner_text()
    return {'locale':locale,'width':width,'checks':checks,'actual':evidence}


CODES={
    'MI06-1':(['invalid_date','native_partial','live_date','missing_slot_before_progress'],''),
    'MI06-2':(['slots','native_selection','slot_summary','stable_tiles'],''),
    'MI06-4':(['edit_focus','details_focus','draft','pre_receipt','success','sequence'],''),
    'CS-C10-4':(['draft','success','sequence','pre_receipt','edit_focus'],''),
    'P38-A2':(['invalid_date','missing_slot','slot_geometry','slots','details_focus'],''),
    'MI07-1':(['pre_receipt','success','sequence'],'P38 F02 only; other form types and linked jobs require independent receipts.'),
    'MI07-2':(['success'],'P38 focus and status only; screen reader announcements and F01–F06 need independent verification.'),
    'MI07-4':(['reset','clean_form','sequence'],'P38 F02 only; reset of linked program/job and memory ledger persistence need independent evidence.'),
}


def main():
    OUT.mkdir(parents=True,exist_ok=True)
    fingerprint=pr.fingerprint()
    receipt=json.loads(Path(os.environ['QA_ATTESTATION']).read_text())
    assert receipt.get('build_sha',receipt.get('sha'))==pr.SHA and receipt['dist_tree_sha256']==fingerprint
    observations=[]
    with sync_playwright() as pw, pw.chromium.launch(executable_path=os.environ['CHROME_PATH'],args=['--no-sandbox']) as browser:
        version=browser.version
        for locale in pr.LOCALES:
            for width in (390,1440):
                with browser.new_context(locale='en-US',viewport={'width':width,'height':pr.HEIGHTS[width]},service_workers='block') as context:
                    pr.isolate(context);page=context.new_page();page.set_default_timeout(5000)
                    try: row=exercise(page,context.new_cdp_session(page),locale,width)
                    except Exception as error: row={'locale':locale,'width':width,'error':str(error)}
                    observations.append(row)
                    print(locale,width,row.get('error'),[k for k,v in row.get('checks',{}).items() if not v],flush=True)
    choices=[]
    matrix={(l,w) for l in pr.LOCALES for w in (390,1440)}
    for code,(predicates,remaining) in CODES.items():
        measured=[r for r in observations if all(p in r.get('checks',{}) for p in predicates)]
        passed=sum(all(r['checks'][p] for p in predicates) for r in measured)
        tested={(r['locale'],r['width']) for r in measured}
        status='Fail' if passed!=len(measured) else 'Blocked' if tested!=matrix or pr.missing or pr.errors else 'Pass'
        if status=='Fail':remaining='Failed '+', '.join(p for p in predicates if any(not r['checks'][p] for r in measured))+'. '+remaining
        choices.append({'choice_id':code,'coverage':'full' if status=='Pass' and not remaining else 'partial','test_status':status,
                        'assertion':'; '.join(predicates),'actual':f'{passed}/{len(matrix)} route-locale-width sets passed.',
                        'remaining':remaining,'route':'/consultation'})
    stamp=datetime.now(timezone.utc).isoformat(timespec='seconds')
    common={'build_sha':pr.SHA,'dist_tree_sha256':fingerprint,'tested_utc':stamp}
    for file,data in [('choices.json',{'choices':choices}),('observations.json',{'observations':observations,'chromium':version,
        'missing':sorted(pr.missing),'page_errors':pr.errors,'external_requests_blocked':sorted(pr.denied),
        'limits':'Hermetic desktop Chromium, native date keyboard segments, radio keys and viewport emulation. No physical OS calendar popup, screen reader, or external appointment.'})]:
        (OUT/file).write_text(json.dumps({**common,**data},ensure_ascii=False,indent=2)+'\n')
    return any(r['test_status']!='Pass' for r in choices)


if __name__=='__main__':
    raise SystemExit(main())
