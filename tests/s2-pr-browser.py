"""GitHub PR Chromium checks. Serve bytes exclusively via Playwright interception."""
import hashlib
import json
import mimetypes
import os
from pathlib import Path
import re
import subprocess
from urllib.parse import unquote, urlsplit

from playwright.sync_api import expect, sync_playwright

DIST = Path(os.getenv("DIST_DIR", "dist")).resolve()
OUT = Path(os.environ["QA_OUTPUT"]).resolve()
canonical = re.search(r'<link rel="canonical" href="([^"]+)"', (DIST/"index.html").read_text())
assert canonical, "Packaged root is missing its canonical URL"
mount = urlsplit(canonical[1])
assert mount.scheme == "https" and mount.hostname, "Expected an HTTPS canonical"
ORIGIN = mount.scheme + "://" + mount.netloc
BASE = mount.path.rstrip("/")
LOCALES = ["vi", "en", "zh", "ko", "ja"]
HEIGHTS = {320:740, 359:740, 360:740, 390:844, 430:932, 450:932, 520:932,
           521:932, 639:960, 640:960, 700:960, 701:960, 767:1024, 768:1024, 799:1024, 800:1024,
           820:1180, 999:800, 1000:800, 1023:768, 1024:768, 1279:800, 1280:800,
           1281:800, 1440:900, 1920:1080}
ROUTES = ["/", "/services", "/jobs", "/contact", "/education", "/admin-demo"]
JOB = "/jobs/cong-nhan-lap-rap-bac-ninh"
denied, missing, errors = set(), set(), []
failure_shots = {}
class Journal(list):
    def append(self, record):
        super().append(record)
        with (OUT/"observations.jsonl").open("a",encoding="utf-8") as fp:
            fp.write(json.dumps(record,ensure_ascii=False)+"\n")

results = Journal()
PREDICATES = Path("tests/s2-layout-predicates.js")
FROZEN = Path("docs/sdd/SEL-2026.11.27-v1.0.0/data/pages-and-urls.jsonl")
PAGE_IDS = {r["fields"]["Đường dẫn"]:r["source_code"] for line in FROZEN.read_text().splitlines()
            if (r:=json.loads(line))["source_code"]!="P41"}

HARNESS_SHA = subprocess.check_output(["git","rev-parse","HEAD"],text=True).strip()
SHA = os.getenv("QA_SHA") or HARNESS_SHA


def url(locale, path):
    return ORIGIN + BASE + ("" if locale == "vi" else "/" + locale) + path


def local(route):
    request = route.request
    u = urlsplit(request.url)
    path = unquote(u.path)
    if (u.scheme, u.netloc) != (mount.scheme, mount.netloc) or not (path == BASE or path.startswith(BASE+"/")):
        denied.add((u.netloc, request.resource_type))
        return route.abort("blockedbyclient")
    f = (DIST / path[len(BASE):].lstrip("/")).resolve()
    if not f.is_relative_to(DIST) or request.method not in ("GET", "HEAD"):
        return route.abort("blockedbyclient")
    if f.is_dir():
        f = f / "index.html"
    if not f.is_file():
        missing.add(path)
        return route.fulfill(status=404, body="Missing packaged resource")
    mime = mimetypes.guess_type(f.name)[0] or "application/octet-stream"
    if f.suffix == ".js":
        mime = "application/javascript"
    headers = {"Content-Type":mime, "Accept-Ranges":"bytes"}
    size = f.stat().st_size
    byte_range = request.headers.get("range")
    if byte_range:
        m = re.fullmatch(r"bytes=(\d*)-(\d*)", byte_range)
        if not m or not any(m.groups()):
            return route.fulfill(status=416, headers={"Content-Range":f"bytes */{size}"})
        start = int(m[1]) if m[1] else max(0, size-int(m[2]))
        end = min(int(m[2]),size-1) if m[1] and m[2] else size-1
        if start > end:
            return route.fulfill(status=416, headers={"Content-Range":f"bytes */{size}"})
        with f.open("rb") as src:
            src.seek(start)
            body = src.read(end-start+1)
        headers["Content-Range"] = f"bytes {start}-{end}/{size}"
        return route.fulfill(status=206, headers=headers, body=body)
    return route.fulfill(path=str(f), headers=headers)


def shot(page, name):
    dest = OUT/"screenshots"/(name+".png")
    page.screenshot(path=str(dest),timeout=10000)
    return str(dest.relative_to(OUT))


def step(page, name, ids, locale, width, path, fn):
    record = dict(test=name, choice_ids=ids, locale=locale, viewport_width=width,
                  route=path, sha=SHA, coverage="scoped assertion")
    try:
        record["actual"] = fn()
        record["status"] = "Pass"
    except Exception as err:
        record.update(status="Fail", error=str(err)[:2200], actual_url=page.url)
        key=(name,locale,path)
        try:
            if key not in failure_shots:
                failure_shots[key]=shot(page,f"failure-{len(results)}")
            record["first_failure_screenshot_for_route"]=failure_shots[key]
        except Exception:
            pass
    results.append(record)


def navigate(page, locale, path):
    page.goto(url(locale,path), wait_until="domcontentloaded",timeout=20000)
    page.locator("main h1").first.wait_for(timeout=10000)
    page.wait_for_function("Object.keys(document.querySelector('#root') || {}).some(k=>k.startsWith('__reactContainer$'))",timeout=10000)
    page.evaluate("async()=>{await document.fonts.ready; await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))}")


def geometry(page, width, capture):
    facts = page.evaluate("""() => {
      const d=document.documentElement, h=document.querySelector('.site-header');
      const visible=sel=>{const e=document.querySelector(sel);return !!e&&e.getBoundingClientRect().width>0&&getComputedStyle(e).visibility!=='hidden'};
      const offenders=Array.from(document.querySelectorAll('main *, header *')).filter(e=>{
        const b=e.getBoundingClientRect();return b.width && (b.right>d.clientWidth+2 || b.left < -2);
      }).slice(0,6).map(e=>({node:e.tagName,cls:e.className?.toString().slice(0,100)}));
      return {inner:innerWidth,client:d.clientWidth,scroll:d.scrollWidth,height:innerHeight,lang:d.lang,
        h1:document.querySelector('main h1')?.textContent,drawer:visible('.menu-button'),nav:visible('.desktop-nav'),
        headerHeight:h.getBoundingClientRect().height,offenders};
    }""")
    assert facts["inner"]==width and facts["scroll"]<=facts["client"]+1, facts
    assert facts["h1"] and facts["headerHeight"]>0, facts
    assert facts["drawer"] == (width<1280) and facts["nav"] == (width>=1280), facts
    if capture:
        facts["screenshot"] = shot(page,capture)
    return facts


def predicates(page, locale, width, path):
    page_id=PAGE_IDS.get(path)
    if not page_id:
        return
    if not page.evaluate("typeof window.s2MeasureLayout==='function'"):
        page.add_script_tag(content=PREDICATES.read_text())
    observed=page.evaluate("arg=>window.s2MeasureLayout(arg)",{"pageId":page_id,"locale":locale})
    for row in observed:
        results.append({**row,"test":"layout-predicate","status":row["test_status"],"sha":SHA,
                        "route":path,"viewport_width":width,"choice_ids":[row["choice_id"]]})

def keyboard(page):
    launcher=page.locator(".menu-button")
    launcher.focus()
    page.keyboard.press("Enter")
    dialog=page.locator(".drawer-nav")
    expect(dialog).to_be_visible()
    group=dialog.locator(".drawer-group-heading button").first
    group.focus()
    page.keyboard.press("Enter")
    expect(group).to_have_attribute("aria-expanded","true")
    page.keyboard.press("Tab")
    assert page.evaluate("document.activeElement.matches('.drawer-subnav a:focus-visible')")
    page.keyboard.press("Escape")
    expect(group).to_be_focused()
    page.keyboard.press("Escape")
    expect(launcher).to_be_focused()
    return {"restored":"menu-button","screenshot":shot(page,"keyboard-restored")}


def tap_journey(page, kind):
    path="/services/labor-supply" if kind=="F01" else JOB
    navigate(page,"vi",path)
    if kind=="F01":
        page.locator(".service-overview button.btn").first.tap()
        form=page.locator("[role=dialog] .contact-form")
    else:
        save=page.locator(".job-summary [data-job-save]").first
        save.tap()
        expect(save).to_have_attribute("aria-pressed","true")
        apply=page.locator(".job-apply-button").first
        apply.scroll_into_view_if_needed()
        apply.evaluate("e=>window.scrollTo({top:window.scrollY+e.getBoundingClientRect().bottom+120,behavior:'instant'})")
        sticky=page.locator(".job-mobile-apply button")
        expect(sticky).to_be_visible()
        sticky.tap()
        expect(sticky).to_be_hidden()
        form=page.locator(".application-form")
    expect(form).to_be_visible()
    form.locator("[type=submit]").tap()
    name=form.locator("[name=name]")
    expect(name).to_be_focused()
    expect(name).to_have_attribute("aria-invalid","true")
    name.fill("PR QA DEMO")
    form.locator("[name=phone]").fill("0900000000")
    if kind=="F01":
        form.locator("[name=location]").fill("QA demo")
        form.locator("[name=notes]").fill("QA demo")
        expect(form.locator("[required]")).to_have_count(4)
        expect(form.locator(".form-optional")).to_have_count(6)
    form.locator("[type=submit]").tap()
    success=page.locator(".form-success" if kind=="F01" else ".application-success")
    link=success.locator("a").first
    expect(link).to_be_visible()
    href=link.get_attribute("href")
    match=re.search(r"[?&]id=(DEMO-\d+)",href)
    assert match and "type="+kind in href,href
    image=shot(page,kind+"-receipt")
    link.tap()
    dialog=page.locator("[role=dialog]")
    expect(dialog).to_contain_text(match[1])
    expect(dialog).to_contain_text("PR QA DEMO")
    if kind=="F03":
        expect(dialog).to_contain_text("MD001")
    return {"id":match[1],"type":kind,"admin":page.url,"screenshot":image,
            "admin_screenshot":shot(page,kind+"-admin")}


def twofold_reflow(browser, locale):
    # A 1280x900 physical viewport at 200% has a 640x450 CSS viewport.
    ctx=browser.new_context(viewport={"width":640,"height":450},device_scale_factor=2,service_workers="block")
    isolate(ctx)
    page=ctx.new_page()
    def verify():
        navigate(page,locale,"/contact")
        facts=geometry(page,640,None)
        assert page.evaluate("devicePixelRatio") == 2
        name=page.locator("#consultation [name=name]")
        name.focus()
        name.scroll_into_view_if_needed()
        expect(name).to_be_in_viewport()
        facts["physical_width"]=1280
        facts["method"]="640 CSS px at DPR 2; layout equivalent of 200% browser zoom on 1280 physical px"
        facts["screenshot"]=shot(page,"reflow-"+locale)
        return facts
    step(page,"200-percent-equivalent-reflow",[],locale,640,"/contact",verify)
    ctx.close()


def isolate(ctx):
    ctx.route("**/*",local)
    ctx.route_web_socket("**/*",lambda ws:ws.close(code=1000,reason="offline fixture"))
    ctx.on("page",lambda p:p.on("pageerror",lambda e:errors.append({"route":p.url,"error":str(e)})))


def run(browser):
    assert PREDICATES.is_file(),f"Missing browser layout predicates: {PREDICATES}"
    matrix=browser.new_context(viewport={"width":1440,"height":900},service_workers="block")
    isolate(matrix)
    page=matrix.new_page()
    page.set_default_timeout(5000)
    for locale in LOCALES:
        for path in ROUTES:
            try:
                navigate(page,locale,path)
                assert page.locator("html").get_attribute("lang")==("zh-Hans" if locale=="zh" else locale)
            except Exception as e:
                results.append(dict(status="Fail",test="matrix-navigation",locale=locale,route=path,error=str(e)))
                continue
            for width,height in HEIGHTS.items():
                page.set_viewport_size({"width":width,"height":height})
                page.evaluate("()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))")
                label=(path.strip("/") or "home")+"-"+locale+"-"+str(width)
                capture=label if (locale=="vi" and width in (390,820,1440) or path=="/contact" and width==320) else None
                step(page,"viewport-header-and-reflow",[],locale,width,path,
                     lambda:geometry(page,width,capture))
                try:
                    predicates(page,locale,width,path)
                except Exception as e:
                    results.append(dict(test="layout-predicate-page",status="Fail",locale=locale,
                                        viewport_width=width,route=path,error=str(e)))
                    break
        # All additional frozen routes are measured at the eight principal sizes.
        # Vietnamese receives every paired component breakpoint as well.
        for path in sorted(PAGE_IDS.keys()-set(ROUTES)):
            try:
                navigate(page,locale,path)
                for width in (HEIGHTS if locale=="vi" else [320,390,430,768,1024,1280,1440,1920]):
                    page.set_viewport_size({"width":width,"height":HEIGHTS[width]})
                    page.evaluate("()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))")
                    predicates(page,locale,width,path)
            except Exception as e:
                results.append(dict(test="layout-predicate-page",status="Fail",locale=locale,route=path,error=str(e)))
        twofold_reflow(browser,locale)
    matrix.close()
    context=browser.new_context(viewport={"width":390,"height":844},has_touch=True,
        is_mobile=True, service_workers="block",reduced_motion="reduce",
        record_video_dir=str(OUT/"video"),record_video_size={"width":390,"height":844})
    isolate(context)
    context.tracing.start(screenshots=True,snapshots=True,sources=True)
    p=context.new_page()
    p.set_default_timeout(6000)
    try:
        def menu():
            navigate(p,"vi","/jobs")
            assert p.evaluate("navigator.maxTouchPoints>0 && matchMedia('(prefers-reduced-motion: reduce)').matches")
            return keyboard(p)
        step(p,"drawer-keyboard-and-touch-emulation",["T18"],"vi",390,"/jobs",menu)
        def motion():
            navigate(p,"vi","/services/labor-supply")
            p.emulate_media(reduced_motion="no-preference")
            button=p.locator(".info-faq button").nth(1)
            button.tap()
            p.emulate_media(reduced_motion="reduce")
            answer=p.locator("[id="+json.dumps(button.get_attribute("aria-controls"))+"]")
            expect(button).to_have_attribute("aria-expanded","true")
            expect(answer).to_have_attribute("aria-hidden","false")
            duration=answer.evaluate("el=>getComputedStyle(el).transitionDuration")
            assert max(float(x.strip().removesuffix('ms').removesuffix('s'))*(1 if x.strip().endswith('ms') else 1000) for x in duration.split(','))<=1,duration
            return {"transitionDuration":duration,"screenshot":shot(p,"reduced-motion")}
        step(p,"reduce-during-faq-disclosure",["MO03-1"],"vi",390,"/services/labor-supply",motion)
        for kind,path,ids in [("F01","/services/labor-supply",["P04-C1","T09","P36-E1"]),
                              ("F03",JOB,["P10-C1","P10-D2","T11","P36-E1"])]:
            step(p,"touch-"+kind+"-to-admin",ids,"vi",390,path,lambda:tap_journey(p,kind))
    finally:
        context.tracing.stop(path=str(OUT/"journeys-trace.zip"))
        context.close()


def fingerprint():
    h=hashlib.sha256()
    def visit(directory):
        for f in sorted(directory.iterdir(),key=lambda p:p.name):
            if f.is_dir():
                visit(f)
            elif f.is_file():
                h.update((f.relative_to(DIST).as_posix()+"\0"+hashlib.sha256(f.read_bytes()).hexdigest()+"\n").encode())
    visit(DIST)
    return h.hexdigest()


if __name__=="__main__":
    (OUT/"screenshots").mkdir(parents=True,exist_ok=True)
    (OUT/"video").mkdir(exist_ok=True)
    assert (DIST/"index.html").is_file(),"Build the Pages profile into DIST_DIR first."
    (OUT/"observations.jsonl").write_text("")
    artifact=fingerprint()
    (OUT/"build.json").write_text(json.dumps(dict(sha=SHA,harness_sha=HARNESS_SHA,dist_tree_sha256=artifact))+"\n")
    try:
        with sync_playwright() as pw:
            browser=pw.chromium.launch(executable_path=os.getenv("CHROME_PATH"),args=[
                "--disable-background-networking","--disable-quic","--host-resolver-rules=MAP * ~NOTFOUND"])
            version=browser.version
            run(browser)
            browser.close()
    except Exception as e:
        results.append({"test":"runner","status":"Fail","error":repr(e)})
    if missing or errors:
        results.append({"test":"packaged-resources-and-page-errors","status":"Fail","missing":sorted(missing),"page_errors":errors})
    report={"sha":SHA,"harness_sha":HARNESS_SHA,"dist_tree_sha256":artifact,"chromium":globals().get("version"),
            "offline":"All browser context requests fulfilled from dist or blocked; external embeds cannot load.",
            "limits":"Chromium touch emulation; 200% reflow equivalent. Physical devices, native IME, user research and external integrations were not exercised.",
            "blocked_external":sorted(denied),"checks":results}
    (OUT/"browser-results.json").write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n")
    bad=[r for r in results if r["status"]=="Fail"]
    passed=sum(r["status"]=="Pass" for r in results)
    print(f"{passed}/{len(results)} browser checks passed. Report: {OUT}/browser-results.json")
    for item in bad[:15]:
        print(json.dumps(item,ensure_ascii=False)[:1000])
    raise SystemExit(bool(bad))
