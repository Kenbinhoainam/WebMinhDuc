"""W2 scoped Chromium acceptance against final packaged bytes; no HTTP server."""
import importlib.util
import json
import os
from pathlib import Path
from urllib.parse import unquote, urlsplit

from playwright.sync_api import expect, sync_playwright

os.environ.setdefault("QA_SHA", "88e2b61596eab5952f183a81b3030da760696c9c")
os.environ.setdefault("QA_OUTPUT", "docs/sdd/SEL-2026.11.27-v1.0.0/execution/b2b-qa/browser-final")
spec = importlib.util.spec_from_file_location("w2_browser_base", "tests/s2-pr-browser.py")
h = importlib.util.module_from_spec(spec)
spec.loader.exec_module(h)
SMOKE = os.getenv("W2_BROWSER_SMOKE") == "1"
LOCALES = os.getenv("S2_W2_LOCALES", "vi" if SMOKE else ",".join(h.LOCALES)).split(",")
SIZES = {390:844} if SMOKE else {320:740,390:844,430:932,768:1024,1024:768,1280:800,1440:900,1920:1080}
ROUTES = {"/":"P01","/services":"P03","/services/labor-supply":"P04",
          "/services/labor-leasing":"P05","/services/recruitment":"P06",
          "/services/college-admissions":"P07","/services/hr-consulting":"P08"}
results = []
failures = []
expected_image_failures = set()


def record(page, name, ids, locale, width, height, path, fn):
    row = {"test":name,"choice_ids":ids,"locale":locale,"viewport":{"width":width,"height":height},
           "route":path,"build_sha":h.SHA,"method":"Real Chromium, hermetic packaged responses, desktop pointer/keyboard; CSS viewport emulation"}
    try:
        row["actual"] = fn()
        row["test_status"] = "Pass"
    except Exception as error:
        row.update(test_status="Fail",error=str(error)[:2500],actual_url=page.url)
        try:
            row["evidence_ref"] = h.shot(page,"failure-"+str(len(results)))
        except Exception:
            pass
        failures.append(row)
        print("FAIL",name,locale,width,path,str(error)[:800],flush=True)
    results.append(row)
    with (h.OUT/"browser-observations.jsonl").open("a",encoding="utf-8") as f:
        f.write(json.dumps(row,ensure_ascii=False)+"\n")


def text_bounds(page):
    facts=page.evaluate("""() => {
      const selectors='.md-page-masthead h1,.service-overview h2,.service-card-title,.contact-reference-form h2';
      const boxes=[...document.querySelectorAll(selectors)].map(el=>{
        const b=el.getBoundingClientRect(),r=document.createRange();r.selectNodeContents(el);const t=r.getBoundingClientRect();
        return {text:el.textContent.trim(),width:b.width,height:b.height,textWidth:t.width,textHeight:t.height,
          overflowX:el.scrollWidth>el.clientWidth+2,textOutside:t.left<b.left-2||t.right>b.right+2||t.top<b.top-3||t.bottom>b.bottom+3};
      });return {width:innerWidth,scrollWidth:document.documentElement.scrollWidth,boxes};
    }""")
    assert facts["scrollWidth"] <= facts["width"]+1, facts
    assert all(x["text"] and not x["overflowX"] and not x["textOutside"] for x in facts["boxes"]),facts
    return facts


def load_images(page):
    # Exercise native lazy loading by scrolling each actual image into its real scroll owner.
    # Do not change loading/src/srcset or infer cold-load speed from this warm resizing run.
    page.evaluate("""async()=>{
      for(const image of [...document.querySelectorAll('main img')]){
        if(!image.isConnected)continue;
        image.scrollIntoView({block:'center',inline:'center',behavior:'instant'});
        await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
      }
    }""")
    page.wait_for_function("[...document.querySelectorAll('main img')].every(i=>i.complete && i.naturalWidth>0)",timeout=12000)
    images=page.evaluate("""() => [...document.querySelectorAll('main img')].map(i=>{
      const b=i.getBoundingClientRect(),s=getComputedStyle(i);return {src:i.getAttribute('src'),currentSrc:i.currentSrc,
        srcset:i.getAttribute('srcset'),sizes:i.getAttribute('sizes'),alt:i.alt,natural:[i.naturalWidth,i.naturalHeight],
        rendered:[b.width,b.height],objectFit:s.objectFit,loading:i.loading};})""")
    assert images
    for image in images:
        path=unquote(urlsplit(image["currentSrc"]).path)
        assert path.startswith(h.BASE+"/"),image
        file=h.DIST/path[len(h.BASE):].lstrip("/")
        assert file.is_file(),image
        image["packaged_bytes"]=file.stat().st_size
    return {"images":images,"resize_method":"Ascending viewports in one hydrated page, native lazy-load scrolling; no cold-cache/performance claim","heading_bounds":text_bounds(page)}


def failed_images(page, path):
    # The failure context blocks every image at transport level, including original retries.
    page.locator(".service-card-title").first.scroll_into_view_if_needed()
    page.evaluate("""async()=>{for(const image of [...document.querySelectorAll('main img')]){
      image.scrollIntoView({block:'center',inline:'center',behavior:'instant'});
      await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
    }}""")
    page.wait_for_function("[...document.querySelectorAll('.service-card-photo')].every(i=>i.hidden)",timeout=10000)
    expect(page.locator(".md-masthead-figure")).to_have_count(0)
    cards=page.locator(".service-gallery-card")
    expected=5 if path=="/services" else 4
    assert cards.count()==expected
    facts=cards.evaluate_all("""cards=>cards.map(c=>{
      const a=c.querySelector('a'),t=c.querySelector('h3'),i=c.querySelector('img'),b=c.getBoundingClientRect();
      return {title:t.textContent.trim(),href:a.getAttribute('href'),width:b.width,height:b.height,
        hidden:i.hidden,display:getComputedStyle(i).display};})""")
    assert all(x["title"] and x["href"] and x["width"]>0 and x["height"]>0 and x["hidden"] and x["display"]=="none" for x in facts),facts
    title=page.locator("main h1").inner_text();assert title
    return {"title":title,"cards":facts,"heading_bounds":text_bounds(page),"network":"all image requests aborted; masthead retained heading and cards retained title/destination"}


def modal_check(page, locale, width, height):
    opener=page.locator(".service-overview-actions button")
    opener.scroll_into_view_if_needed();opener.focus();before=page.evaluate("scrollY")
    page.keyboard.press("Enter")
    panel=page.locator(".modal-panel");expect(panel).to_be_visible();expect(panel).to_be_focused()
    heading=panel.locator(".modal-heading h2");close=panel.locator(".modal-heading button")
    expect(heading).to_be_visible();expect(close).to_be_visible()
    facts=panel.evaluate("""p=>{
      const b=p.getBoundingClientRect(),h=p.querySelector('.modal-heading h2'),c=p.querySelector('.modal-heading button'),
        a=h.getBoundingClientRect(),z=c.getBoundingClientRect(),r=document.createRange();r.selectNodeContents(h);const t=r.getBoundingClientRect();
      return {heading:h.textContent,panel:{left:b.left,right:b.right,top:b.top,bottom:b.bottom,width:b.width,height:b.height},
        headingRect:{left:a.left,right:a.right,top:a.top,bottom:a.bottom},closeRect:{left:z.left,right:z.right,top:z.top,bottom:z.bottom},
        textRect:{left:t.left,right:t.right,top:t.top,bottom:t.bottom},service:p.querySelector('[name=service]').value};} """)
    assert facts["panel"]["left"]>=0 and facts["panel"]["right"]<=width+1,facts
    assert facts["headingRect"]["right"]<=facts["closeRect"]["left"]+1,facts
    assert facts["textRect"]["right"]<=facts["headingRect"]["right"]+2,facts
    assert facts["closeRect"]["right"]<=facts["panel"]["right"]+1,facts
    assert facts["service"]=="Setup tổ chức & phần mềm doanh nghiệp",facts
    if locale!="vi":assert facts["heading"]!="Yêu cầu tư vấn",facts
    panel.locator("[type=submit]").click()
    name=panel.locator("[name=name]");expect(name).to_be_focused();expect(name).to_have_attribute("aria-invalid","true")
    expect(panel.locator("[aria-invalid=true]")).to_have_count(4)
    box=name.bounding_box();assert box and box["y"]>=0 and box["y"]+box["height"]<=height+1,box
    assert name.evaluate("e=>{const b=e.getBoundingClientRect();return document.elementFromPoint(b.left+b.width/2,b.top+b.height/2)===e}"),box
    facts["invalid_focus_box"]=box
    if (locale=="vi" and width==390) or (locale=="ja" and width==320):facts["screenshot"]=h.shot(page,f"modal-{locale}-{width}-{height}")
    page.keyboard.press("Escape");expect(panel).to_have_count(0);expect(opener).to_be_focused()
    after=page.evaluate("scrollY");assert abs(after-before)<=2,(before,after)
    facts["scroll_restore"]={"before":before,"after":after};return facts


def contact_check(page, locale, width, height):
    surface=page.locator("#consultation");mode=surface.locator('[data-contact-mode="F01"]')
    mode.scroll_into_view_if_needed();mode.click()
    expect(surface.locator("[required]")).to_have_count(4)
    expect(surface.locator("h2")).to_be_focused()
    surface.locator("[type=submit]").click();name=surface.locator('[name="name"]')
    expect(name).to_be_focused();expect(name).to_have_attribute("aria-invalid","true")
    box=name.bounding_box();header=page.locator('.site-header').bounding_box()
    assert box and header and box['y']>=header['y']+header['height']-1,(box,header)
    assert name.evaluate("e=>{const b=e.getBoundingClientRect();return document.elementFromPoint(b.left+b.width/2,b.top+b.height/2)===e}"),box
    page.locator('.contact-map').scroll_into_view_if_needed()
    maps=[]
    buttons=page.locator('.contact-map-tabs button');assert buttons.count()==3
    for i in range(3):
        buttons.nth(i).click();expect(buttons.nth(i)).to_have_attribute('aria-pressed','true')
        iframe=page.locator('.contact-map iframe');caption=page.locator('.contact-map-caption')
        title=iframe.get_attribute('title');name=caption.locator('strong').inner_text()
        assert title and name and name in title,(title,name)
        expect(caption.locator('.contact-map-fallback')).to_be_visible()
        link=caption.locator('a');expect(link).to_be_visible();href=link.get_attribute('href')
        assert href.startswith('https://maps.app.goo.gl/'),href
        maps.append({'title':title,'name':name,'iframe':iframe.get_attribute('src'),'directions':href})
    general=surface.locator('[data-contact-mode="F02"]');general.scroll_into_view_if_needed();general.click()
    expect(surface.locator('[required]')).to_have_count(2);expect(surface.locator('h2')).to_be_focused()
    return {'maps':maps,'focus_box':box,'header_box':header,'external_map':'Blocked deliberately by hermetic policy; permanent fallback remained visible','heading_bounds':text_bounds(page)}


def run(browser):
    ctx=browser.new_context(viewport={'width':320,'height':740},service_workers='block',reduced_motion='reduce')
    h.isolate(ctx);page=ctx.new_page();page.set_default_timeout(7000)
    for locale in LOCALES:
        for path,pid in ROUTES.items():
            page.set_viewport_size({'width':min(SIZES),'height':SIZES[min(SIZES)]});h.navigate(page,locale,path)
            for width,height in SIZES.items():
                page.set_viewport_size({'width':width,'height':height})
                record(page,'native-images-currentSrc-and-bytes',[pid+'-F2' if pid=='P01' else pid+'-F3'],locale,width,height,path,lambda:load_images(page))
            if locale=='vi' and path in ['/services/hr-consulting','/services/labor-supply']:
                page.set_viewport_size({'width':390,'height':844});page.locator('.service-overview').scroll_into_view_if_needed();h.shot(page,pid+'-overview-vi-390')
        path='/services/hr-consulting';h.navigate(page,locale,path)
        cases=list(SIZES.items())+([] if SMOKE else [(390,420),(768,500),(1440,480)])
        for width,height in cases:
            page.set_viewport_size({'width':width,'height':height})
            record(page,'modal-heading-error-focus-return',['P08-C1','P08-D3','CS-C05-3'],locale,width,height,path,lambda:modal_check(page,locale,width,height))
        path='/contact';h.navigate(page,locale,path)
        for width,height in SIZES.items():
            page.set_viewport_size({'width':width,'height':height})
            record(page,'contact-mode-map-fallback-focus',['P37-C1','P37-C3','P37-D2','P37-D3','P37-F2'],locale,width,height,path,lambda:contact_check(page,locale,width,height))
    ctx.close()
    failed=browser.new_context(viewport={'width':320,'height':740},service_workers='block',reduced_motion='reduce')
    def dispatch(route):
        if route.request.resource_type=='image':
            expected_image_failures.add(route.request.url);return route.abort('failed')
        return h.local(route)
    failed.route('**/*',dispatch);failed.route_web_socket('**/*',lambda ws:ws.close())
    failed.on('page',lambda p:p.on('pageerror',lambda e:h.errors.append({'route':p.url,'error':str(e)})))
    page=failed.new_page();page.set_default_timeout(7000)
    for locale in LOCALES:
        for path,pid in ROUTES.items():
            if pid=='P01':continue
            page.set_viewport_size({'width':min(SIZES),'height':SIZES[min(SIZES)]});h.navigate(page,locale,path)
            for width,height in SIZES.items():
                page.set_viewport_size({'width':width,'height':height})
                record(page,'terminal-image-failure-preserves-context',[pid+'-F3'],locale,width,height,path,lambda:failed_images(page,path))
    failed.close()


if __name__=='__main__':
    (h.OUT/'screenshots').mkdir(parents=True,exist_ok=True)
    (h.OUT/'browser-observations.jsonl').write_text('')
    fingerprint=h.fingerprint()
    with sync_playwright() as pw:
        browser=pw.chromium.launch(executable_path=os.getenv('CHROME_PATH','/usr/bin/chromium'),args=['--disable-background-networking','--disable-quic','--host-resolver-rules=MAP * ~NOTFOUND'])
        version=browser.version
        try:run(browser)
        finally:browser.close()
    report={'build_sha':h.SHA,'harness_sha':h.HARNESS_SHA,'dist_tree_sha256':fingerprint,'chromium':version,
            'smoke':SMOKE,'locales':LOCALES,'sizes':SIZES,'checks':results,'missing_packaged':sorted(h.missing),
            'page_errors':h.errors,'blocked_external':sorted(h.denied),'deliberately_failed_images':sorted(expected_image_failures),
            'limitations':'Hermetic packaged assets; no public-origin latency/CDN/auth measurement. Browser CSS viewport and keyboard are real Chromium; physical device, native keyboard and AT remain untested.'}
    (h.OUT/'browser-results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(f'W2 browser {len(results)-len(failures)}/{len(results)} passed; missing={len(h.missing)} page_errors={len(h.errors)}',flush=True)
    raise SystemExit(bool(failures or h.missing or h.errors))
