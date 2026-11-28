"""Hermetic W4 checks against the finalized artifact. See s2-pr-browser.py for settings."""
import importlib.util
import json
import os
from pathlib import Path
from urllib.parse import urlsplit

from playwright.sync_api import expect, sync_playwright

spec = importlib.util.spec_from_file_location("s2_pr_browser", Path(__file__).with_name("s2-pr-browser.py"))
ci = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ci)

NAMES = ["Luxshare ICT", "FOXCONN", "SAMSUNG", "JEILTECH VINA", "TACU"]
LOGOS = ["luxshare.svg", "foxconn.svg", "samsung.svg", "glovitech.webp", "tacu.webp"]


def news(page, locale):
    ci.navigate(page, locale, "/news")
    main = page.locator("main")
    archive = main.locator(".ed-archive")
    filters = main.locator(".ed-filters button")
    assert main.locator('a[href$="#news-listings"]').count()
    assert main.locator('a[href$="/events"]').count()
    featured = main.locator(".editorial-feature-slide a").evaluate_all("links=>links.map(a=>a.pathname)")
    assert len(featured) == 2
    categories = {}
    for index in (1, 2, 3, 0):
        button = filters.nth(index)
        button.focus()
        button.press("Space")
        expect(button).to_have_attribute("aria-pressed", "true")
        assert button.evaluate("e=>e===document.activeElement")
        assert main.locator(".editorial-feature-slide a").evaluate_all("links=>links.map(a=>a.pathname)") == featured
        links = archive.locator("a").evaluate_all("links=>links.map(a=>a.pathname)")
        assert 1 <= len(set(links)) <= 3
        categories[urlsplit(page.url).query] = links
    assert set(categories) == {"", "category=workers", "category=employers", "category=hr"}
    filters.nth(1).click()
    pager = main.locator(".ed-pagination")
    expect(pager.locator("button").first).to_be_disabled()
    pager.get_by_role("button", name="2", exact=True).press("Enter")
    expect(main.locator("#news-listings")).to_be_focused()
    filtered_url = page.url
    assert urlsplit(filtered_url).query == "category=workers&page=2"
    expect(pager.locator("button").last).to_be_disabled()
    archive.locator("a").first.press("Enter")
    expect(main.locator(".ed-crumbs a").last).to_have_attribute("href", urlsplit(filtered_url).path + "?" + urlsplit(filtered_url).query)
    main.locator(".ed-crumbs a").last.click()
    expect(page).to_have_url(filtered_url)
    expect(main.locator(".ed-pagination [aria-current=page]")).to_have_text("2")
    return {"filtered_page": filtered_url, "first_page_articles": categories, "same_featured": featured}


def logos(page, locale):
    sets = {}
    for route, selector in (
        ("/partners", ".partners-set:not([aria-hidden]) .partner-logo"),
        ("/", ".partners-set:not([aria-hidden]) .partner-logo"),
        ("/about-us", "#partners .partner-logo"),
    ):
        ci.navigate(page, locale, route)
        elements = page.locator(selector)
        assert elements.all_text_contents() == NAMES
        for item in elements.all():
            item.scroll_into_view_if_needed()
            item.locator("img").evaluate("im=>im.decode()")
        values = elements.locator("img").evaluate_all(
            "imgs=>imgs.map(i=>[new URL(i.currentSrc).pathname.split('/').at(-1),i.alt,i.naturalWidth])")
        assert [row[0] for row in values] == LOGOS, values
        assert all(row[1] == "" and row[2] for row in values)
        sets[route] = values
    return sets


def partner_alias(page, locale):
    metadata = {}
    for route in ("/partners", "/testimonials"):
        ci.navigate(page, locale, route)
        metadata[route] = page.evaluate("""()=>Object.fromEntries([
          ['title',document.title],['heading',document.querySelector('main h1').textContent],
          ...['link[rel=canonical]','meta[name=description]','meta[name=robots]'].map(s=>{
             const e=document.querySelector(s);return [s,e?.getAttribute('content')??e?.href]} )])""")
    assert metadata["/partners"] == metadata["/testimonials"], metadata
    assert urlsplit(metadata["/partners"]["link[rel=canonical]"]).path.rstrip("/").endswith("/partners")
    assert "noindex" in metadata["/partners"]["meta[name=robots]"]
    ci.navigate(page, locale, "/partners")
    worker_link = page.locator('.partners-actions a[href$="/jobs"]')
    worker_link.focus()
    worker_link.press("Enter")
    assert urlsplit(page.url).path.endswith("/jobs")
    return {"metadata": metadata, "worker_link": page.url}



def partner_layout(page, locale):
    ci.navigate(page, locale, "/partners")
    ctas = page.locator(".partners-actions a")
    widths = {}
    for width in (320, 820, 1440, 1920):
        page.set_viewport_size({"width": width, "height": 900})
        page.evaluate("()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))")
        facts = page.evaluate("""()=>({viewport:document.documentElement.clientWidth,
          document:document.documentElement.scrollWidth,
          ctas:[...document.querySelectorAll('.partners-actions a')].map(a=>{
            const b=a.getBoundingClientRect();return [b.left,b.right,b.height];
          })})""")
        assert facts["viewport"] == facts["document"] == width, facts
        assert all(left>=0 and right<=width and height>0 for left,right,height in facts["ctas"]), facts
        widths[width] = facts
    workforce = page.locator('.partners-actions a[href$="#business-contact"]')
    workforce.press("Enter")
    expect(page.locator("#business-contact h2")).to_be_focused()
    expect(page.locator("#business-contact .form-mode button").first).to_have_attribute("aria-pressed", "true")
    page.set_viewport_size({"width": 820, "height": 900})
    return {"viewport_checks": widths, "workforce_destination": page.url}


def logo_failure(browser):
    ctx = browser.new_context(service_workers="block", reduced_motion="reduce")
    ci.isolate(ctx)
    ctx.route("**/partners/*", lambda route: route.abort("failed") if route.request.resource_type == "image" else route.fallback())
    page = ctx.new_page()
    try:
        ci.navigate(page, "vi", "/partners")
        items = page.locator(".partners-set:not([aria-hidden]) .partner-logo")
        for item in items.all():
            item.scroll_into_view_if_needed()
        expect(items.locator("img")).to_have_count(0)
        assert items.all_text_contents() == NAMES
        assert items.locator("span").evaluate_all(
            "spans=>spans.every(s=>s.getBoundingClientRect().width>1 && s.getBoundingClientRect().height>1)")
        return {"visible_fallback": items.all_text_contents(), "screenshot": ci.shot(page, "partner-name-fallback")}
    finally:
        ctx.close()


def run(browser):
    ctx = browser.new_context(service_workers="block", reduced_motion="reduce", viewport={"width": 820, "height": 900})
    ci.isolate(ctx)
    page = ctx.new_page()
    page.set_default_timeout(5000)
    try:
        for locale in ci.LOCALES:
            ci.step(page, "news-category-page-reader", ["P20-B2", "P20-B4", "P20-C2"], locale, 820, "/news", lambda: news(page, locale))
            ci.step(page, "partner-alias-and-worker-link", ["P31-E3", "P31-F3"], locale, 820, "/partners", lambda: partner_alias(page, locale))
            ci.step(page, "partner-responsive-and-workforce-link", ["P31-D1", "P31-B3"], locale, 820, "/partners", lambda: partner_layout(page, locale))
        ci.step(page, "partner-approved-logos", ["P31-A2", "P31-F2"], "vi", 820, "/partners", lambda: logos(page, "vi"))
        ci.step(page, "partner-text-fallback", ["P31-A2", "P31-F2"], "vi", 820, "/partners", lambda: logo_failure(browser))
    finally:
        ctx.close()


if __name__ == "__main__":
    (ci.OUT / "screenshots").mkdir(parents=True, exist_ok=True)
    (ci.OUT / "observations.jsonl").write_text("")
    with sync_playwright() as pw:
        browser = pw.chromium.launch(executable_path=os.getenv("CHROME_PATH"), args=[
            "--disable-background-networking", "--disable-quic", "--host-resolver-rules=MAP * ~NOTFOUND"])
        chromium = browser.version
        run(browser)
        browser.close()
    limits = {
        "P20-B2": "Featured rail stays global on page one. This does not approve a scope change.",
        "P20-B4": "Checks both distinct destinations and all category controls; no external user test.",
        "P20-C2": "Keyboard, page boundary and filter→page→article→archive covered. No physical swipe.",
        "P31-E3": "Direct keyboard journey from Partners to Jobs. No independent user interview.",
        "P31-F3": "Both routes were loaded separately, with matching rendered heading and metadata.",
        "P31-D1": "320/820/1440/1920px across five locales. No physical device or browser zoom.",
        "P31-B3": "Keyboard CTA goes to the focused staffing section with F01 selected. No independent reader study.",
        "P31-A2": "Names, source paths, decoded images and failure fixture. No new brand verification or viewport image comparison.",
        "P31-F2": "Checks all three placements and deliberate logo network failure. No offscreen CPU or network profiling.",
    }
    report = {"sha": ci.SHA, "harness_sha": ci.HARNESS_SHA, "dist_tree_sha256": ci.fingerprint(),
              "mount": ci.BASE or "/", "chromium": chromium, "limits": limits,
              "missing": sorted(ci.missing), "page_errors": ci.errors, "checks": ci.results}
    (ci.OUT / "browser-results.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    failed = [r for r in ci.results if r["status"] != "Pass"]
    print(f"{len(ci.results)-len(failed)}/{len(ci.results)} scenarios passed")
    for item in failed:
        print(item["test"], item["locale"], item.get("error"))
    raise SystemExit(bool(failed or ci.missing or ci.errors))
