"""Rendered P41 checks. Run with the PR Chromium runner's offline package settings."""
import hashlib
import importlib.util
import json
import os
from pathlib import Path
from urllib.parse import urlencode, urlsplit

from playwright.sync_api import expect, sync_playwright

spec = importlib.util.spec_from_file_location("s2_pr_browser", Path(__file__).with_name("s2-pr-browser.py"))
ci = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ci)

PRESETS = [(390, 844), (820, 1180), (1440, 900)]


def path(route):
    return ci.url("vi", route)


def reviewer(**query):
    return path("/duyet.html") + ("?" + urlencode(query) if query else "")


def get_frame(page):
    frame = page.locator("iframe").element_handle().content_frame()
    frame.locator("main h1").first.wait_for()
    return frame


def app_facts(document):
    return document.evaluate("""() => ({
      width:innerWidth,height:innerHeight,client:document.documentElement.clientWidth,
      heading:document.querySelector('main h1').textContent,
      mobile:!!document.querySelector('.menu-button')?.getClientRects().length,
      desktop:!!document.querySelector('.desktop-nav')?.getClientRects().length
    })""")


def zoom_record(page, direct, width, height):
    page.goto(reviewer(w=width, page="/jobs"), wait_until="domcontentloaded")
    frame = get_frame(page)
    direct.set_viewport_size({"width":width,"height":height})
    ci.navigate(direct,"vi","/jobs")
    frame_facts = app_facts(frame)
    direct_facts = app_facts(direct)
    assert frame_facts == direct_facts, (frame_facts,direct_facts)
    assert frame_facts["width"] == width and frame_facts["height"] == height
    facts = []
    for outer in (1600, 980, 390):
        page.set_viewport_size({"width":outer,"height":900})
        page.evaluate("()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))")
        observed = page.evaluate("""() => {
          const el=document.querySelector('iframe'),box=el.getBoundingClientRect(),shell=el.parentElement.getBoundingClientRect();
          return {client:document.documentElement.clientWidth,scale:new DOMMatrix(getComputedStyle(el).transform).a,
            width:box.width,height:box.height,shell:[shell.width,shell.height],label:document.querySelector('output').value};
        }""")
        scale = min(1, (observed["client"]-16)/width)
        for actual, expected in [(observed["scale"],scale),(observed["width"],width*scale),(observed["height"],height*scale),
                                (observed["shell"][0],width*scale),(observed["shell"][1],height*scale)]:
            assert abs(actual-expected) < 1, observed
        assert f"{width} × {height} CSS px" in observed["label"],observed
        assert f"{int(scale*100+0.5)}%" in observed["label"],observed
        facts.append(observed)
    page.set_viewport_size({"width":980,"height":900})
    return {"iframe":frame_facts,"direct":direct_facts,"scales":facts,
            "reviewer_shot":ci.shot(page,f"reviewer-{width}-scaled"),
            "direct_shot":ci.shot(direct,f"direct-{width}")}


def keyboard(page):
    page.goto(reviewer(page="/jobs"),wait_until="domcontentloaded")
    frame=get_frame(page)
    buttons=page.locator(".sizes button")
    for index in range(3):
        page.keyboard.press("Tab")
        expect(buttons.nth(index)).to_be_focused()
        assert buttons.nth(index).evaluate("e=>e.matches(':focus-visible')")
    page.keyboard.press("Space")
    expect(buttons.nth(2)).to_have_attribute("aria-pressed","true")
    expect(page.locator(".sizes [aria-pressed=true]")).to_have_count(1)
    colors=buttons.evaluate_all("(items)=>items.map(item=>getComputedStyle(item).backgroundColor)")
    assert colors[2] != colors[0],colors
    expect(page.locator("#dimensions")).to_have_attribute("aria-live","polite")
    expect(page.locator("iframe")).to_have_attribute("title","Website Minh Đức Vina")
    page.keyboard.press("Tab")
    expect(page.locator("#page")).to_be_focused()
    page.keyboard.press("Tab")
    expect(page.locator(".direct")).to_be_focused()
    page.keyboard.press("Tab")
    expect(frame.locator(".skip-link")).to_be_focused()
    page.keyboard.press("Shift+Tab")
    expect(page.locator(".direct")).to_be_focused()
    return {"tab_order":["three preset buttons","page select","direct link","iframe skip link","return to direct link"],
            "selected_background":colors[2], "screenshot":ci.shot(page,"reviewer-keyboard-return")}


def invalid(page):
    page.goto(reviewer(w=900, page="https://invalid.example/redirect"),wait_until="domcontentloaded")
    frame=get_frame(page)
    expect(page.locator("#page")).to_have_value("/")
    expect(page.locator("[data-width='390']")).to_have_attribute("aria-pressed","true")
    assert frame.url.rstrip("/") == path("/").rstrip("/"), frame.url
    assert urlsplit(page.url).query == "w=390", page.url
    return {"normalized":page.url,"frame":frame.url}


def navigation(page):
    page.goto(path("/jobs"),wait_until="domcontentloaded")
    page.goto(reviewer(w=820,page="/jobs"),wait_until="domcontentloaded")
    get_frame(page)
    page.reload(wait_until="domcontentloaded")
    frame=get_frame(page)
    expect(page.locator("#page")).to_have_value("/jobs")
    expect(page.locator("[data-width='820']")).to_have_attribute("aria-pressed","true")
    frame.locator("a[href*='/jobs/cong-nhan-lap-rap-bac-ninh']").first.click()
    frame.wait_for_url("**/jobs/cong-nhan-lap-rap-bac-ninh**")
    in_frame=frame.url
    page.locator("[data-width='1440']").click()
    assert frame.url == in_frame
    with page.expect_popup() as popup:
        page.locator(".direct").click()
    opened=popup.value
    try:
        opened.wait_for_load_state("domcontentloaded")
        assert opened.url == in_frame, opened.url
    finally:
        opened.close()
    page.locator("#page").select_option("/education")
    frame.wait_for_url("**/education**")
    expect(page.locator(".direct")).to_have_attribute("href",path("/education"))
    replaced=page.url
    # Verify top-level history independently from child-initiated history.
    history=page.context.new_page()
    history.set_default_timeout(6000)
    try:
        history.goto(path("/contact"),wait_until="domcontentloaded")
        history.goto(replaced,wait_until="domcontentloaded")
        get_frame(history)
        history.go_back(wait_until="commit")
        history.wait_for_url(path("/contact"))
        back=history.url
        history.go_forward(wait_until="domcontentloaded")
        history.wait_for_url(replaced)
        expect(history.locator("#page")).to_have_value("/education")
        expect(history.locator("[data-width='1440']")).to_have_attribute("aria-pressed","true")
        return {"retained_child":in_frame,"direct_popup":in_frame,"changed_page":replaced,
                "history_back":back,"history_forward":history.url}
    finally:
        history.close()


def run(browser):
    context=browser.new_context(viewport={"width":980,"height":900},service_workers="block",reduced_motion="reduce")
    ci.isolate(context)
    try:
        page=context.new_page()
        direct=context.new_page()
        page.set_default_timeout(6000)
        for width,height in PRESETS:
            ci.step(page,f"p41-scaled-vs-direct-{width}",["P41-A3","P41-B3","P41-D1"],"vi",width,"/duyet.html",
                    lambda: zoom_record(page,direct,width,height))
        ci.step(page,"p41-keyboard-tab-cycle",["P41-A2","P41-D2","P41-D3"],"vi",980,"/duyet.html",lambda:keyboard(page))
        ci.step(page,"p41-invalid-query-normalization",["P41-C1","P41-C2","P41-F2"],"vi",980,"/duyet.html",lambda:invalid(page))
        ci.step(page,"p41-navigation-reload-and-popup",["P41-C2","P41-C3","P41-C4","P41-E2"],"vi",980,"/duyet.html",lambda:navigation(page))
    finally:
        context.close()


if __name__=="__main__":
    (ci.OUT/"screenshots").mkdir(parents=True,exist_ok=True)
    (ci.OUT/"observations.jsonl").write_text("")
    artifact=ci.fingerprint()
    chromium=None
    try:
        with sync_playwright() as pw:
            browser=pw.chromium.launch(executable_path=os.getenv("CHROME_PATH"),args=[
                "--disable-background-networking","--disable-quic","--host-resolver-rules=MAP * ~NOTFOUND"])
            chromium=browser.version
            run(browser)
            browser.close()
    except Exception as e:
        ci.results.append({"test":"p41-runner","status":"Fail","error":repr(e)})
    if ci.missing or ci.errors:
        ci.results.append({"test":"p41-packaged-resource-integrity","status":"Fail","missing":sorted(ci.missing),"page_errors":ci.errors})
    report={"runner_sha256":hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
            "sha":ci.SHA,"harness_sha":ci.HARNESS_SHA,"dist_tree_sha256":artifact,"chromium":chromium,"mount":ci.BASE or "/",
            "limits":"Hermetic Chromium only. P41-C2 assertions cover invalid paths and reload, not the unresolved exact-eight menu count. Iframe geometry does not replace physical devices.",
            "blocked_external":sorted(ci.denied),"checks":ci.results}
    (ci.OUT/"browser-results.json").write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n")
    bad=[record for record in ci.results if record["status"]=="Fail"]
    print(f"{len(ci.results)-len(bad)}/{len(ci.results)} P41 checks passed.")
    for record in bad:
        print(json.dumps(record,ensure_ascii=False)[:1000])
    raise SystemExit(bool(bad))
