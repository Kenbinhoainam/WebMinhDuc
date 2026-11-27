"""Six event-directory/detail journeys against an offline Chromium artifact."""
import importlib.util
import json
import os
import re
from pathlib import Path
from urllib.parse import urlsplit

from playwright.sync_api import expect, sync_playwright

spec = importlib.util.spec_from_file_location("ci", Path(__file__).with_name("s2-pr-browser.py"))
ci = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ci)
FROZEN = [
    ("P28", "ngay-hoi-ket-noi-viec-lam", "upcoming", "2026-11-28", "08:30 – 11:30", "Địa điểm sẽ được xác nhận", ["08:30", "09:00", "10:00", "11:00"]),
    ("P29", "toa-dam-ke-hoach-nhan-luc", "upcoming", "2026-12-05", "14:00 – 15:30", "Hình thức trực tuyến", ["14:00", "14:15", "14:45", "15:15"]),
    ("P30", "hanh-trang-tim-viec", "past", "2026-11-08", "09:00 – 10:30", "Địa điểm sẽ được xác nhận", ["09:00", "09:30", "10:00"]),
]
FRAGMENTS = ["overview", "schedule", "location", "gallery", "other-events"]


def journey(page, fixture, touch):
    code, slug, status, date, span, location, starts = fixture
    action = (lambda el: el.tap()) if touch else (lambda el: el.press("Enter"))
    mode = "touch" if touch else "keyboard"
    entry = "/events?status=" + status
    details = "/events/" + slug + "?status=" + status
    ci.navigate(page, "vi", "/events")
    listing = page.locator("main")
    rows = listing.locator(".ed-event-list article")
    filters = listing.locator(".ed-filters button")
    result = listing.locator(".ed-result")
    expect(rows).to_have_count(3)
    expect(result).to_have_attribute("aria-live", "polite")
    expect(result).to_have_text("3 sự kiện")
    expect(listing.locator(".ed-note time")).to_have_attribute("datetime","2026-11-25")
    action(filters.nth(1 if status == "upcoming" else 2))
    expect(page).to_have_url(ci.url("vi", entry))
    expect(rows).to_have_count(2 if status == "upcoming" else 1)
    expect(result).to_have_text("2 sự kiện" if status == "upcoming" else "1 sự kiện")
    target = rows.filter(has=page.locator('a[href$="/'+slug+'?status='+status+'"]'))
    title = target.locator("h3 a")
    schedule = target.locator(".ed-schedule-link")
    expect(title).to_have_attribute("href", urlsplit(ci.url("vi", details)).path+"?status="+status)
    expect(schedule).to_have_attribute("href", urlsplit(ci.url("vi", details)).path+"?status="+status+"#schedule")
    action(title)
    expect(page).to_have_url(ci.url("vi", details))
    page.go_back(wait_until="commit")
    expect(page).to_have_url(ci.url("vi", entry))
    action(schedule)
    expect(page).to_have_url(ci.url("vi", details+"#schedule"))
    main = page.locator("main")
    expect(main.locator("#schedule")).to_be_focused()
    same_schedule = main.locator(".ed-event .btn[href='#schedule']")
    action(same_schedule)
    expect(page).to_have_url(ci.url("vi", details+"#schedule"))
    assert main.locator(".ed-anchor-nav a").evaluate_all("els=>els.map(a=>a.hash.slice(1))")==FRAGMENTS
    destinations={}
    for frag in FRAGMENTS:
        action(main.locator('.ed-anchor-nav a[href="#'+frag+'"]'))
        expect(page).to_have_url(ci.url("vi", details+"#"+frag))
        heading = main.locator("#"+frag)
        expect(heading).to_be_focused()
        geometry=heading.evaluate("""el=>({top:el.getBoundingClientRect().top,bottom:document.querySelector('header.site-header').getBoundingClientRect().bottom})""")
        assert geometry["top"] >= geometry["bottom"]-2 and geometry["top"]<900, (frag,geometry)
        destinations[frag]=geometry
    facts=main.locator(".ed-facts")
    expect(facts.locator("time")).to_have_attribute("datetime",date)
    assert span+" UTC+7" in facts.inner_text() and location in facts.inner_text()
    expect(facts).to_contain_text("Sắp diễn ra" if status=="upcoming" else "Đã diễn ra")
    assert main.locator(".ed-agenda time").all_text_contents()==starts
    assert main.locator(".ed-agenda time").evaluate_all("els=>els.map(e=>e.dateTime)")==[f"{date}T{t}:00+07:00" for t in starts]
    tel=main.locator('.ed-location a')
    expect(tel).to_have_attribute("href","tel:0818919666")
    expect(tel).to_have_accessible_name(re.compile(r"^Gọi hỏi thông tin\s+081 8919666$"))
    expect(main.locator(".ed-gallery")).to_contain_text("Ảnh do Minh Đức cung cấp từ các hoạt động khác.")
    gallery=main.locator(".ed-gallery figure")
    assert gallery.locator("figcaption").all_text_contents()==["Kết nối cộng đồng","Buổi gặp mặt cuối năm"]
    assert len(gallery.locator("img[alt]:not([alt=''])").all())==2
    assert main.locator(".ed-event form, .ed-event button").count()==0
    other=main.locator(".ed-event-list h3 a")
    expected_other={item[1] for item in FROZEN if item[1]!=slug}
    assert set(other.evaluate_all("els=>els.map(a=>a.pathname.split('/').at(-1))"))==expected_other
    for index in range(2):
        other_url=other.nth(index).get_attribute("href")
        action(other.nth(index))
        expect(page).to_have_url(ci.ORIGIN+other_url)
        page.go_back(wait_until="commit")
        expect(page).to_have_url(ci.url("vi", details+"#other-events"))
    action(main.locator(".ed-all-events"))
    expect(page).to_have_url(ci.url("vi", entry+"#event-listings"))
    expect(listing.locator("#event-listings")).to_be_focused()
    expect(filters.nth(0)).to_have_attribute("aria-pressed","false")
    action(filters.nth(0))
    expect(page).to_have_url(ci.url("vi","/events#event-listings"))
    expect(rows).to_have_count(3)
    source_link=listing.locator(".ed-directory-link")
    expect(source_link).to_have_accessible_name("Tin tức & cẩm nang")
    action(source_link)
    expect(page).to_have_url(ci.url("vi","/news"))
    return {"mode":mode,"directory":entry,"detail":details,"date":date,"span":span,"agenda":starts,
            "status_fixture":"2026-11-25","tel":tel_hint(),"anchors":destinations,"news":page.url}


def tel_hint():
    return "tel:0818919666 (attribute inspected, never activated)"


if __name__ == "__main__":
    ci.OUT.mkdir(parents=True,exist_ok=True)
    (ci.OUT/"screenshots").mkdir(exist_ok=True)
    (ci.OUT/"observations.jsonl").write_text("")
    with sync_playwright() as pw:
        browser=pw.chromium.launch(executable_path=os.getenv("CHROME_PATH"),args=["--host-resolver-rules=MAP * ~NOTFOUND"])
        chromium=browser.version
        for touch in (False,True):
            width=390 if touch else 1440
            ctx=browser.new_context(viewport={"width":width,"height":900},has_touch=touch,is_mobile=touch,reduced_motion="reduce",service_workers="block")
            ci.isolate(ctx)
            page=ctx.new_page()
            page.set_default_timeout(4000)
            for fixture in FROZEN:
                code=fixture[0]
                ci.step(page,code+("-touch" if touch else "-keyboard"),[f"{p}-{suffix}" for p in ("P27",code) for suffix in ("C1","C2","C3","C4","B4","E1","E4")],"vi",width,"/events",lambda:journey(page,fixture,touch))
            ctx.close()
        browser.close()
    data={"sha":ci.SHA,"chromium":chromium,"mount":ci.BASE or "/","checks":ci.results,
          "missing":sorted(ci.missing),"page_errors":ci.errors}
    (ci.OUT/"browser-results.json").write_text(json.dumps(data,ensure_ascii=False,indent=2)+"\n")
    failed=[r for r in ci.results if r["status"]!="Pass"]
    for row in failed: print(row)
    print(f"{len(ci.results)-len(failed)}/{len(ci.results)} event journeys passed")
    raise SystemExit(bool(failed or ci.missing or ci.errors))
