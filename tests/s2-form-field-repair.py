"""Probe field-level feedback on each packaged public demo form in Chromium."""
import importlib.util
import json
import os
from pathlib import Path

from playwright.sync_api import expect, sync_playwright

spec = importlib.util.spec_from_file_location("browser_qa", "tests/s2-pr-browser.py")
qa = importlib.util.module_from_spec(spec)
spec.loader.exec_module(qa)
routes = {
    "F01": "/contact?form=F01", "F02": "/contact?form=F02",
    "F03": qa.JOB, "F04": "/jobs/chuyen-vien-tuyen-dung-bac-ninh",
    "F05": "/education?form=F05#dang-ky", "F06": "/education?form=F06#dang-ky",
}
phone_sample = "090 000 0000"
observations = []
qa.OUT.mkdir(parents=True, exist_ok=True)
with sync_playwright() as p, p.chromium.launch(executable_path=os.environ.get("CHROME_PATH"), args=["--no-sandbox"]) as browser:
    version = browser.version
    for locale in os.environ.get("QA_LANGUAGES", "vi,en,zh,ko,ja").split(","):
        for width in map(int, os.environ.get("QA_WIDTHS", "390,1440").split(",")):
            with browser.new_context(viewport={"width": width, "height": qa.HEIGHTS[width]}, has_touch=width==390) as ctx:
                qa.isolate(ctx)
                page = ctx.new_page()
                page.set_default_timeout(3500)
                for mode, path in routes.items():
                    result = dict(locale=locale, width=width, route=path, mode=mode)
                    try:
                        qa.navigate(page, locale, path)
                        if mode in ("F03","F04"):
                            page.locator(".job-apply-button:visible").first.click()
                        form = page.locator('form:visible').filter(has=page.locator('[name=phone]')).first
                        name, phone = form.locator('[name=name]'), form.locator('[name=phone]')
                        submit = form.locator('button[type=submit]')
                        name.fill("Ứng viên Mẫu")
                        phone.fill("12")
                        expect(form.locator('[aria-invalid=true]')).to_have_count(0)
                        submit.focus()
                        submit.press("Enter")
                        expect(phone).to_be_focused()
                        expect(phone).to_have_attribute("aria-invalid","true")
                        error_id = phone.get_attribute("aria-describedby")
                        assert error_id and page.locator('[id="'+error_id+'"]').is_visible()
                        left_errors = set(form.locator('[aria-invalid=true]').evaluate_all("els=>els.map(el=>el.name)")) - {"phone"}
                        phone.fill(phone_sample)
                        expect(phone).not_to_have_attribute("aria-invalid","true",timeout=500)
                        assert set(form.locator('[aria-invalid=true]').evaluate_all("els=>els.map(el=>el.name)")) == left_errors
                        expect(name).to_have_value("Ứng viên Mẫu")
                        expect(phone).to_have_value(phone_sample)
                        result.update(status="Pass", preserved_errors=sorted(left_errors), fixed_field="phone")
                    except (Exception, AssertionError) as error:
                        result.update(status="Fail", error=str(error)[:1100])
                    observations.append(result)
                    print(locale, width, mode, result["status"], flush=True)
data = dict(application_sha=qa.SHA, dist_tree_sha256=qa.fingerprint(), chromium=version,
            cases=observations, page_errors=qa.errors, missing_assets=sorted(qa.missing))
(qa.OUT/"observations.json").write_text(json.dumps(data,ensure_ascii=False,indent=2)+"\n")
raise SystemExit(int(any(row["status"]!="Pass" for row in observations) or bool(qa.errors)))
