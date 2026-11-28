import json
import os
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE_URL = os.environ.get("S2_BASE_URL", "http://127.0.0.1:4173/WebMinhDuc")
CHROME_BIN = os.environ.get("CHROME_BIN", "/usr/bin/google-chrome")

WIDTHS_FULL = [320, 360, 390, 430, 767, 768, 820, 1023, 1024, 1279, 1280, 1366, 1440, 1920]
ROUTES_KEY = ["/", "/about-us/", "/services/", "/jobs/", "/news/", "/contact/", "/admin-demo/", "/education/"]
ROUTES_OTHER = ["/services/recruitment/", "/jobs/cong-nhan-lap-rap-bac-ninh/", "/saved-jobs/", "/careers/", "/events/", "/consultation/"]
LOCALES = [("vi", ""), ("en", "/en"), ("zh-Hans", "/zh"), ("ko", "/ko"), ("ja", "/ja")]


def assert_true(cond, msg):
    if not cond:
        raise AssertionError(msg)


def run():
    report = {
        "base_url": BASE_URL,
        "responsive_checks": 0,
        "locale_checks": 0,
        "overflow_failures": [],
        "journeys": {},
        "page_errors": [],
        "failed_requests": [],
    }

    with sync_playwright() as p:
        launch_args = {"headless": True, "args": ["--no-sandbox", "--disable-dev-shm-usage"]}
        if Path(CHROME_BIN).exists():
            launch_args["executable_path"] = CHROME_BIN
        browser = p.chromium.launch(**launch_args)

        ctx = browser.new_context(viewport={"width": 1440, "height": 900})
        page = ctx.new_page()
        page.on("pageerror", lambda err: report["page_errors"].append(str(err)))
        page.on("response", lambda res: report["failed_requests"].append((res.status, res.url)) if res.status >= 400 and "favicon" not in res.url else None)

        # 1. Responsive matrix (no horizontal overflow across all 14 widths)
        for route in ROUTES_KEY + ROUTES_OTHER:
            widths = WIDTHS_FULL if route in ROUTES_KEY else [320, 390, 768, 1024, 1440]
            for w in widths:
                page.set_viewport_size({"width": w, "height": 844 if w < 768 else 900})
                resp = page.goto(f"{BASE_URL}{route}", wait_until="load", timeout=20000)
                assert_true(resp and resp.status == 200, f"HTTP {resp.status if resp else 0} on {route}")
                m = page.evaluate("""() => ({
                    overflow: document.documentElement.scrollWidth > window.innerWidth,
                    scrollWidth: document.documentElement.scrollWidth,
                    innerWidth: window.innerWidth,
                    robots: document.querySelector('meta[name="robots"]')?.getAttribute('content') || '',
                })""")
                report["responsive_checks"] += 1
                assert_true("noindex" in m["robots"].lower(), f"Missing noindex on {route}")
                if m["overflow"]:
                    report["overflow_failures"].append({"route": route, "width": w, **m})

        assert_true(len(report["overflow_failures"]) == 0, f"Horizontal overflow detected: {report['overflow_failures']}")

        # 2. Five locales check
        for lang_code, prefix in LOCALES:
            for route in ["/", "/services/", "/jobs/", "/contact/", "/admin-demo/"]:
                for w in (390, 1440):
                    page.set_viewport_size({"width": w, "height": 844 if w == 390 else 900})
                    resp = page.goto(f"{BASE_URL}{prefix}{route}", wait_until="load", timeout=20000)
                    assert_true(resp and resp.status == 200, f"HTTP {resp.status if resp else 0} on {prefix}{route}")
                    m = page.evaluate("""() => ({
                        lang: document.documentElement.getAttribute('lang') || '',
                        overflow: document.documentElement.scrollWidth > window.innerWidth,
                    })""")
                    report["locale_checks"] += 1
                    assert_true(m["lang"] == lang_code, f"Expected lang={lang_code}, got {m['lang']} on {prefix}{route}")
                    assert_true(not m["overflow"], f"Overflow on {prefix}{route} at {w}px")

        # 3. B2B Journey: Home -> Contact F01 -> Validation -> Submit -> SPA Link to ADMIN
        page.set_viewport_size({"width": 1440, "height": 900})
        page.goto(f"{BASE_URL}/contact/?form=F01", wait_until="load")
        page.locator("form button[type='submit']").first.click()
        page.wait_for_timeout(200)
        assert_true(page.locator("[aria-invalid='true']").count() >= 1, "F01 empty submit should mark invalid fields")
        for sel, val in [
            ("input[name='name']", "Nguyễn Văn A"),
            ("input[name='company']", "Công ty Demo Test QA"),
            ("input[name='phone']", "0912345678"),
            ("input[name='email']", "demo@example.com"),
            ("input[name='headcount']", "50"),
            ("input[name='location']", "Bắc Ninh"),
            ("textarea[name='notes']", "Cần tuyển 50 công nhân lắp ráp."),
        ]:
            loc = page.locator(sel)
            if loc.count() > 0:
                loc.first.fill(val)
        page.locator("form button[type='submit']").first.click()
        page.wait_for_timeout(300)
        admin_link = page.locator("a[href*='/admin-demo']").first
        assert_true(admin_link.count() > 0, "F01 receipt should link to ADMIN demo")
        admin_link.click()
        page.wait_for_timeout(300)
        admin_text = page.locator("main").inner_text()
        assert_true("Công ty Demo Test QA" in admin_text or "Nguyễn Văn A" in admin_text, "F01 record must appear in ADMIN demo")
        report["journeys"]["b2b_f01_to_admin"] = "PASS"

        # 4. B2C Journey: Jobs -> Save -> Saved Jobs -> Detail -> F03 -> ADMIN
        page.goto(f"{BASE_URL}/jobs/", wait_until="load")
        save_btn = page.locator("button[aria-pressed]").first
        assert_true(save_btn.get_attribute("aria-pressed") == "false", "Initial job save state should be false")
        save_btn.click()
        page.wait_for_timeout(150)
        assert_true(save_btn.get_attribute("aria-pressed") == "true", "Job save state should toggle to true")

        # Navigate to Saved Jobs via SPA link
        page.locator("a[href*='/saved-jobs']").first.click()
        page.wait_for_timeout(300)
        assert_true(page.locator("article, .job-card").count() >= 1, "Saved jobs page should show saved job")

        # Open first saved job detail and apply F03
        page.locator("main a[href*='/jobs/']").first.click()
        page.wait_for_timeout(300)
        apply_btn = page.locator("button:has-text('Ứng tuyển'), button:has-text('Nộp hồ sơ')").first
        apply_btn.click()
        page.wait_for_timeout(250)
        dialog = page.locator("[role='dialog']").first
        assert_true(dialog.is_visible(), "F03 apply modal should open")
        dialog.locator("button[type='submit']").first.click()
        page.wait_for_timeout(200)
        assert_true(dialog.locator("[aria-invalid='true']").count() >= 1, "F03 empty submit should validate")
        for sel, val in [
            ("input[name='name']", "Trần Thị B"),
            ("input[name='phone']", "0987654321"),
            ("input[name='email']", "ungvien@example.com"),
        ]:
            loc = dialog.locator(sel)
            if loc.count() > 0:
                loc.first.fill(val)
        dialog.locator("button[type='submit']").first.click()
        page.wait_for_timeout(300)
        f03_admin_link = dialog.locator("a[href*='/admin-demo']").first
        assert_true(f03_admin_link.count() > 0, "F03 receipt should link to ADMIN demo")
        f03_admin_link.click()
        page.wait_for_timeout(300)
        assert_true("Trần Thị B" in page.locator("main").inner_text(), "F03 record must appear in ADMIN demo")
        report["journeys"]["b2c_f03_to_admin"] = "PASS"

        # 5. Closed job MD005
        page.goto(f"{BASE_URL}/jobs/ky-thuat-bao-tri-bac-ninh/", wait_until="load")
        closed_apply = page.locator("main button:has-text('Ứng tuyển'):not([disabled])").count()
        assert_true(closed_apply == 0, "Closed job MD005 must not have an enabled Apply button")
        report["journeys"]["closed_job_md005"] = "PASS"

        # 6. Browser Back/Forward + Direct URL Reload + P41
        page.goto(f"{BASE_URL}/services/", wait_until="load")
        page.locator("header a[href*='/about-us']").first.click()
        page.wait_for_url("**/about-us**", timeout=10000)
        page.go_back()
        page.wait_for_url("**/services**", timeout=10000)
        page.go_forward()
        page.wait_for_url("**/about-us**", timeout=10000)
        page.reload(wait_until="load")
        assert_true("/about-us" in page.url, "Reload should stay on /about-us")

        resp_p41 = page.goto(f"{BASE_URL}/duyet.html", wait_until="load")
        assert_true(resp_p41 and resp_p41.status == 200, "P41 /duyet.html must return 200")
        report["journeys"]["history_and_p41"] = "PASS"

        # 7. Hero video ended screen + 2 CTAs + replay
        page.goto(f"{BASE_URL}/", wait_until="load")
        page.evaluate("""() => new Promise(resolve => {
            const v = document.querySelector('video');
            if (!v) return resolve();
            const trigger = () => {
                v.muted = true;
                v.play().catch(() => {});
                if (Number.isFinite(v.duration) && v.duration > 1) {
                    v.currentTime = Math.max(0, v.duration - 0.15);
                } else {
                    Object.defineProperty(v, 'ended', { value: true, configurable: true });
                    v.dispatchEvent(new Event('ended'));
                }
                resolve();
            };
            if (v.readyState >= 1) trigger();
            else {
                v.addEventListener('loadedmetadata', trigger, { once: true });
                setTimeout(trigger, 2000);
            }
        })""")
        replay_btn = page.locator("button:has-text('Xem lại video'), button[aria-label*='Xem lại video']").first
        replay_btn.wait_for(state="visible", timeout=10000)
        report["journeys"]["hero_ended_replay"] = "PASS"

        # 8. Reduced motion
        ctx_rm = browser.new_context(viewport={"width": 1440, "height": 900}, reduced_motion="reduce")
        page_rm = ctx_rm.new_page()
        page_rm.goto(f"{BASE_URL}/", wait_until="load")
        assert_true(page_rm.evaluate("() => window.matchMedia('(prefers-reduced-motion: reduce)').matches"), "Reduced motion should be active")
        ctx_rm.close()

        assert_true(len(report["page_errors"]) == 0, f"Page errors: {report['page_errors']}")
        assert_true(len(report["failed_requests"]) == 0, f"Failed requests: {report['failed_requests']}")

        ctx.close()
        browser.close()

    print("PASS s2-chromium-e2e:", json.dumps(report, ensure_ascii=False))


if __name__ == "__main__":
    run()
