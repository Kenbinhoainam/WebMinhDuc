"""Measure the final, rendered P01 hero state using only the CI-attested offline artifact."""
import importlib.util
import json
import os
from pathlib import Path
from urllib.parse import urlsplit
from datetime import datetime, timezone
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
SDD = ROOT / 'docs/sdd/SEL-2026.11.27-v1.0.0'
OUT = Path(os.environ.get('HERO_QA_OUT',SDD / 'execution/browser')).resolve()
os.environ.setdefault('QA_OUTPUT',str(OUT))
spec=importlib.util.spec_from_file_location('pr',ROOT/'tests/s2-pr-browser.py')
pr=importlib.util.module_from_spec(spec)
spec.loader.exec_module(pr)

# This probe examines rendered text fragments as well as element boxes. This catches
# wrapped/clipped labels and excludes overlap with the header or floating controls.
GEOMETRY = r"""() => {
 const hero=document.querySelector('.home-hero'), stage=hero.dataset.stage;
 const r=x=>{const b=x.getBoundingClientRect();return {x:b.x,y:b.y,w:b.width,h:b.height}};
 const intersects=(a,b)=>a.x < b.x+b.w-1 && b.x<a.x+a.w-1 && a.y<b.y+b.h-1 && b.y<a.y+a.h-1;
 const fits=(a,b)=>b.x>=a.x-1 && b.y>=a.y-1 && b.x+b.w<=a.x+a.w+1 && b.y+b.h<=a.y+a.h+1;
 const vw=document.documentElement.clientWidth;
 const screen={x:0,y:0,w:vw,h:innerHeight};
 const end=hero.querySelector('.hero-brand-finish'),logo=end.querySelector('.hero-finish-logo'),slogan=end.querySelector('.hero-finish-slogan');
 const box=r(end),logoBox=r(logo),sloganBox=r(slogan);
 const controls=[...end.querySelectorAll('.hero-actions a')].map(el=>{
   const b=r(el), labels=[];
   const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
   for(let node=walker.nextNode();node;node=walker.nextNode()){
     if(!node.textContent.trim())continue;
     const range=new Range();range.selectNodeContents(node);
     for(const rect of range.getClientRects()) labels.push({x:rect.x,y:rect.y,w:rect.width,h:rect.height});
   }
   const hit=document.elementFromPoint(b.x+b.w/2,b.y+b.h/2);
   return {label:el.textContent.trim(),href:el.getAttribute('href'),b,labels,
    visible:fits(screen,b)&&fits(box,b),textFits:labels.length>0&&labels.every(t=>fits(b,t)),
    targetAtCenter:el.contains(hit),tabIndex:el.tabIndex,inert:!!el.closest('[inert],[hidden],[aria-hidden=true]')};
 });
 const options=[...hero.querySelectorAll('.hero-player-tools button'),document.querySelector('.site-header'),document.querySelector('.support-launcher')]
     .filter(x=>x&&x.getClientRects().length).map(r);
 const ok=stage==='ended' && hero.dataset.showBrand==='true' && logo.complete && logo.naturalWidth>0 &&
  fits(screen,logoBox) && fits(screen,sloganBox) && !intersects(logoBox,sloganBox) &&
  slogan.scrollWidth<=slogan.clientWidth+1 && controls.length===2 &&
  !intersects(controls[0].b,controls[1].b) && controls.every(c=>c.label && c.visible && c.textFits && c.targetAtCenter && c.tabIndex===0 &&
    !c.inert && c.b.h>=43.9 && !intersects(c.b,sloganBox) && !options.some(o=>intersects(o,c.b)));
 return {ok,stage,screen,scrollY,card:box,logo:logoBox,logoDecoded:logo.naturalWidth,slogan:slogan.textContent.trim(),sloganBox,
  controls,obstacles:options};
}"""


def save(file,value):
    file.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n')


def end_film(page,locale):
    page.set_viewport_size({'width':1440,'height':900})
    pr.navigate(page,locale,'/')
    page.evaluate("""() => {
      const v=document.querySelector('.home-hero video');
      window.__s2Ended=null;
      v.addEventListener('ended',event=>{window.__s2Ended={trusted:event.isTrusted,ended:v.ended,current:v.currentTime,duration:v.duration};},{once:true});
    }""")
    video=page.locator('.home-hero video')
    video.wait_for(state='attached')
    page.wait_for_function("document.querySelector('.home-hero video').readyState >= 2",timeout=18000)
    if video.evaluate('v=>v.paused'):
        page.locator('.hero-player-tools .video-control').click()
    page.wait_for_function("!document.querySelector('.home-hero video').paused",timeout=12000)
    info=video.evaluate("v=>({width:v.videoWidth,height:v.videoHeight,duration:v.duration,src:v.currentSrc,fit:getComputedStyle(v).objectFit,at:v.currentTime})")
    playback=[]
    for width in (390,1440):
        page.set_viewport_size({'width':width,'height':pr.HEIGHTS[width]})
        page.evaluate('() => new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))')
        measure=video.evaluate("""v=>{
          const box=v.getBoundingClientRect(), decoded=v.videoWidth/v.videoHeight, fit=getComputedStyle(v).objectFit;
          const scale=Math.min(box.width/v.videoWidth,box.height/v.videoHeight);
          return {width:innerWidth, stage:v.closest('.home-hero').dataset.stage, paused:v.paused,
            slot:[box.width,box.height],frame:[scale*v.videoWidth,scale*v.videoHeight],decoded,
            objectFit:fit,ok:!v.paused && fit==='contain' && Number.isFinite(scale) && scale>0 && Math.abs(decoded-16/9)<0.01};
        }""")
        playback.append(measure)
    if not all(m['ok'] for m in playback):
        raise AssertionError(f'Decoded playback aspect/contain regression: {playback}')
    # Seeking skips the middle of the packaged film. Leave enough genuine decoded
    # playback for Chromium to deliver its own trusted media event.
    first_shortcut=page.locator('.hero-entry-bar a').first
    first_shortcut.evaluate('el=>el.focus({preventScroll:true})')
    video.evaluate('v=>{v.currentTime=Math.max(0,v.duration-0.35)}')
    page.wait_for_function("window.__s2Ended?.trusted && document.querySelector('.home-hero').dataset.stage==='ended'",timeout=20000)
    page.wait_for_function("document.querySelector('.hero-actions a')===document.activeElement",timeout=6000)
    page.evaluate("""async()=>{await document.fonts.ready;
      await Promise.all(document.querySelector('.hero-brand-finish').getAnimations({subtree:true}).map(a=>a.finished.catch(()=>{})));
      await document.querySelector('.hero-finish-logo').decode();
    }""")
    return {"decoded":info,"playback":playback,"event":page.evaluate('window.__s2Ended'),"focus_transferred":True}


def main():
    OUT.mkdir(parents=True,exist_ok=True)
    receipt=Path(os.environ.get('QA_ATTESTATION',SDD/'execution/browser/46006325645/axe-vi-summary.json'))
    baseline=json.loads(receipt.read_text())
    fingerprint=pr.fingerprint()
    if fingerprint!=baseline['dist_tree_sha256'] or pr.SHA!=baseline.get('sha',baseline.get('build_sha')):
        raise SystemExit(f'Wrong source or artifact. Expected {baseline["sha"]}:{baseline["dist_tree_sha256"]}; got {pr.SHA}:{fingerprint}')
    rows=[]; stages={}; screens=[]
    with sync_playwright() as pw:
        with pw.chromium.launch(executable_path=os.environ.get('CHROME_PATH'),args=['--disable-background-networking','--disable-quic','--host-resolver-rules=MAP * ~NOTFOUND','--autoplay-policy=no-user-gesture-required']) as browser:
            version=browser.version
            for locale in pr.LOCALES:
                ctx=browser.new_context(viewport={'width':1440,'height':900},service_workers='block')
                pr.isolate(ctx)
                page=ctx.new_page()
                try:
                    stages[locale]=end_film(page,locale)
                    for width,height in pr.HEIGHTS.items():
                        page.set_viewport_size({'width':width,'height':height})
                        page.evaluate('() => new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))')
                        # Seed at the preceding actual control; verify the two
                        # following stops by genuine Tab events without activating links.
                        page.locator('.video-sound').evaluate('el=>el.focus({preventScroll:true})')
                        targets=[]
                        for _ in range(2):
                            page.keyboard.press('Tab')
                            targets.append(page.evaluate("()=>({href:document.activeElement?.getAttribute('href'),inCard:!!document.activeElement?.closest('.hero-actions'),visible:document.activeElement?.matches(':focus-visible')})"))
                        page.evaluate('() => new Promise(resolve=>requestAnimationFrame(resolve))')
                        geom=page.evaluate(GEOMETRY)
                        expected=[pr.url(locale,'/#business-contact'),pr.url(locale,'/jobs')]
                        actual=page.locator('.hero-actions a').evaluate_all('nodes=>nodes.map(a=>a.href)')
                        tab_ok=targets==[{'href':c['href'],'inCard':True,'visible':True} for c in geom['controls']]
                        def destination(address):
                            parsed=urlsplit(address)
                            return parsed.scheme,parsed.netloc,parsed.path.rstrip('/'),parsed.query,parsed.fragment
                        passed=geom['ok'] and list(map(destination,actual))==list(map(destination,expected)) and tab_ok
                        row={'locale':locale,'width':width,'height':height,'status':'Pass' if passed else 'Fail',
                             'actual':geom,'tab':targets,'expected_destinations':expected,'actual_destinations':actual}
                        if (locale=='vi' and width in (390,820,1440)) or (locale=='en' and width==320) or (not passed and not any(r['locale']==locale and r['status']=='Fail' for r in rows)):
                            filename=f'hero-end-{locale}-{width}.jpg'
                            page.screenshot(path=str(OUT/filename),quality=70)
                            row['screenshot']=filename
                            screens.append(filename)
                        rows.append(row)
                except Exception as error:
                    rows.append({'locale':locale,'status':'Blocked','error':str(error)[:1500]})
                finally:
                    ctx.close()
                    observed=[r for r in rows if r['locale']==locale]
                    print(locale, sum(r['status']=='Pass' for r in observed), '/', len(pr.HEIGHTS), flush=True)
    by_locale=[]
    for locale in pr.LOCALES:
        observations=[r for r in rows if r['locale']==locale]
        bad=[r for r in observations if r['status']!='Pass']
        summary=f'{len(observations)-len(bad)}/{len(pr.HEIGHTS)} width cases passed; see per-width measured rectangles, label fragments, center hit-tests, keyboard targets and video receipt.'
        by_locale.append({'locale':locale,'test_status':bad[0]['status'] if bad else 'Pass','actual':summary})
    success=all(l['test_status']=='Pass' for l in by_locale) and len(rows)==len(pr.LOCALES)*len(pr.HEIGHTS)
    raw={'sha':pr.SHA,'harness_sha':pr.HARNESS_SHA,'dist_tree_sha256':fingerprint,'tested_utc':datetime.now(timezone.utc).isoformat(timespec='seconds'),
         'chromium':version,'method':'Seek real local film to its final 0.35s at 1440px once per locale, preserving native playback. The browser delivers a trusted ended event; no synthetic event, stage setting, or full 132-second waiting. Resize the same stable end card across the 26 target viewports.',
         'limits':'Physical hardware, other engines and uninterrupted full-film playback were not exercised.',
         'screenshots':screens,'film':stages,'blocked_external':sorted(pr.denied),'missing':sorted(pr.missing),'page_errors':pr.errors,'observations':rows}
    save(OUT/'hero-end-observations.json',raw)
    selection=next(json.loads(l) for l in (SDD/'data/selections-cs-all-statuses.jsonl').read_text().splitlines() if json.loads(l)['effective_code']=='CS-A01-1')
    choices=[{'choice_id':'CS-A01-1','source_row':selection['row'],'route':'/','coverage':'full' if success else 'partial',
              'test_status':'Pass' if success else 'Fail' if any(r['status']=='Fail' for r in rows) else 'Blocked',
              'input_type':'Hermetic Chromium; real packaged video, real trusted ended event after seeking, Tab and rendered geometry',
              'steps':raw['method'],'actual':f"{sum(r['status']=='Pass' for r in rows)}/130 route-locale-width observations passed.",
              'remaining':'' if success else 'Resolve reported failed or unavailable viewport states.',
              'locales':by_locale}]
    save(OUT/'hero-end-choices.json',{'build_sha':pr.SHA,'dist_tree_sha256':fingerprint,'evidence':(OUT/'hero-end-observations.json').relative_to(SDD).as_posix(),'choices':choices})
    print(choices[0]['actual'], 'stages',list(stages),'screens',screens,flush=True)
    for record in rows:
        if record['status']!='Pass':
            print(record['locale'],record.get('width'),record.get('error',str(record.get('actual',{}))[:580]));break
    return not success or bool(pr.missing or pr.errors)


if __name__=='__main__':
    raise SystemExit(main())
