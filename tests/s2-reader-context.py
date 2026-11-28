"""Hermetic Chromium pass for editorial reading and contextual links."""
import concurrent.futures
import importlib.util
import json
import os
import re
from pathlib import Path
from urllib.parse import urlsplit

from playwright.sync_api import expect, sync_playwright

spec = importlib.util.spec_from_file_location("runner", Path(__file__).with_name("s2-pr-browser.py"))
ci = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ci)

ROUTES = {v: k for k, v in ci.PAGE_IDS.items()}
BUSINESS = {"P22", "P24", "P25"}
LAYOUT = """() => {
  const b=document.querySelector('.ed-body'), h=document.querySelector('main h1');
  const p=b.querySelector('p'), side=document.querySelector('.ed-related');
  const span=document.createElement('span');
  span.style.cssText='position:absolute;visibility:hidden;inline-size:70ch';
  b.append(span);
  const result={width:innerWidth, document:document.documentElement.scrollWidth,
    reading:b.getBoundingClientRect().width, maxReading:span.getBoundingClientRect().width,
    subtitle:document.querySelector('.ed-lead').innerText.trim(), title:h.innerText.trim(),
    h1:document.querySelectorAll('main h1').length,
    date:document.querySelector('.ed-story-meta time').dateTime,
    category:document.querySelector('.ed-story-meta a').innerText.trim(),
    headings:[...b.querySelectorAll('h2')].map(e=>e.innerText.trim()),
    proseFont:parseFloat(getComputedStyle(p).fontSize),
    titleFont:parseFloat(getComputedStyle(h).fontSize),
    sidebarBelow:!side || side.getBoundingClientRect().top>=b.getBoundingClientRect().bottom,
    alt:[...document.querySelectorAll('.ed-story-photo img,.ed-inline-photo img')].map(e=>e.alt)};
  span.remove();
  return result;
}"""
LANDING = """el => {
  const rect=el.getBoundingClientRect();
  const header=document.querySelector('header.site-header');
  const clearance=header ? Math.max(0,header.getBoundingClientRect().bottom) : 0;
  return {active:el===document.activeElement || el.contains(document.activeElement),
    top:Math.round(rect.top), clearance:Math.round(clearance), scrolling:scrollY};
}"""


def reader(page, locale, code):
    url = ROUTES[code]
    ci.navigate(page, locale, url)
    main = page.locator("main")
    layouts = []
    for width in (390, 1440):
        page.set_viewport_size({"width": width, "height": 900})
        facts = page.evaluate(LAYOUT)
        assert facts["h1"] == 1 and facts["title"] and facts["subtitle"] and facts["title"] != facts["subtitle"], facts
        assert facts["date"] and facts["category"] and len(facts["headings"]) >= 3
        assert all(facts["headings"]) and len(set(facts["headings"])) == len(facts["headings"])
        assert facts["document"] == width and facts["reading"] <= facts["maxReading"] + 1, facts
        assert facts["titleFont"] > facts["proseFont"] and all(facts["alt"]), facts
        if width == 390:
            assert facts["sidebarBelow"], facts
        layouts.append(facts)
    page.set_viewport_size({"width": 390 if code in {"P21", "P23", "P25"} else 1440, "height": 900})
    toc = main.locator(".ed-toc summary")
    toc.press("Space")
    anchor = main.locator("ol#article-toc a").nth(1)
    hash_value = urlsplit(anchor.get_attribute("href")).fragment
    target = page.locator("#" + hash_value)
    anchor.press("Enter")
    expect(target).to_be_focused()
    landing = target.evaluate(LANDING)
    assert landing["active"] and landing["clearance"]-2<=landing["top"]<900 and landing["scrolling"]>0, landing
    cta = main.locator(".ed-actions a.btn")
    assert cta.inner_text().strip()
    expected_route = "/#business-contact" if code in BUSINESS else "/jobs"
    desired=urlsplit(ci.url(locale, expected_route))
    actual=urlsplit(cta.get_attribute("href"))
    assert actual.path.rstrip("/")==desired.path.rstrip("/") and actual.fragment==desired.fragment, (actual, desired)
    cta.press("Enter")
    expect(page).to_have_url(re.compile(re.escape(desired.scheme+"://"+desired.netloc+desired.path.rstrip("/"))+r"/?"+(re.escape("#"+desired.fragment) if desired.fragment else "")+"$"))
    destination = {}
    if code in BUSINESS:
        form = page.locator("#business-contact")
        expect(form).to_be_focused(timeout=3500)
        destination = form.evaluate(LANDING)
        assert destination["active"] and destination["clearance"]-2<=destination["top"]<900, destination
        expect(form.locator("form")).to_be_visible()
    else:
        expect(main.locator("h1")).to_be_visible()
    page.go_back(wait_until="commit")
    expect(page).to_have_url(ci.url(locale, url) + "#" + hash_value)
    expect(main.locator("h1")).to_have_text(layouts[0]["title"])
    return {"layout": layouts, "anchor": landing, "destination": expected_route, "landing": destination}


def locale_run(locale, index):
    checks = []
    with sync_playwright() as pw:
        browser = pw.chromium.launch(executable_path=os.getenv("CHROME_PATH"), args=[
            "--disable-background-networking", "--disable-quic", "--host-resolver-rules=MAP * ~NOTFOUND"])
        ctx=browser.new_context(viewport={"width": 390,"height": 900},service_workers="block",reduced_motion="reduce")
        ci.isolate(ctx)
        page=ctx.new_page()
        page.set_default_timeout(5500)
        for n in range(21,27):
            code=f"P{n}"
            item={"page":code,"locale":locale,"ids":["B08","CS-B06-3",code+"-A2",code+"-E1"]}
            try:
                item["actual"]=reader(page,locale,code)
                item["status"]="Pass"
            except Exception as err:
                item.update(status="Fail", error=str(err)[:1000], url=page.url)
            checks.append(item)
        browser.close()
    return checks


if __name__ == "__main__":
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        checks=[r for group in pool.map(locale_run,ci.LOCALES,range(len(ci.LOCALES))) for r in group]
    out=ci.OUT/"editorial-context.json"
    out.write_text(json.dumps({"sha":ci.SHA,"mount":ci.BASE or "/","checks":checks,"missing":sorted(ci.missing),"page_errors":ci.errors},ensure_ascii=False,indent=2)+"\n")
    failed=[r for r in checks if r["status"]!="Pass"]
    for row in failed:
        print(row)
    print(f"{len(checks)-len(failed)}/{len(checks)} article journeys")
    raise SystemExit(bool(failed or ci.missing or ci.errors))
