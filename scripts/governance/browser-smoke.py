"""Smoke the preserved published artifact locally, not npm-build's S1 dist output."""
import json
from pathlib import Path
import subprocess
import tempfile
import time
import urllib.request
from playwright.sync_api import sync_playwright, expect

root = Path.cwd()
out = Path("/tmp/mdv2-browser")
out.mkdir(exist_ok=True)
serve = Path(tempfile.mkdtemp(prefix="mdv2-artifact-"))
(serve / "WebMinhDuc").symlink_to(root, target_is_directory=True)
server = subprocess.Popen(["python3", "-m", "http.server", "4173", "--bind", "127.0.0.1", "--directory", str(serve)],
                          stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
base = "http://127.0.0.1:4173/WebMinhDuc/"
report = {"artifact_baseline": "19ac2b365f2264399fde4312639127b8de80736f",
          "audit_commit": subprocess.check_output(["git", "rev-parse", "HEAD"], text=True).strip(),
          "scope": "Preserved branch-root artifact served locally; not production browser or new S1 build",
          "cases": [], "failures": [], "limits": ["No physical devices", "No form submission", "No full manual WCAG/UAT", "axe findings are diagnostics, not automatic acceptance"]}
try:
    for _ in range(50):
        try:
            urllib.request.urlopen(base, timeout=1).close()
            break
        except Exception:
            time.sleep(0.1)
    else:
        raise RuntimeError("Local artifact server did not start")
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for locale in ["", "en/", "zh/", "ko/", "ja/"]:
            for width in [390, 768, 1440]:
                context = browser.new_context(viewport={"width": width, "height": 900},
                                              reduced_motion="reduce" if width == 390 else "no-preference")
                page = context.new_page()
                errors, failed_assets, failed_requests = [], [], []
                page.on("pageerror", lambda exc: errors.append(str(exc)))
                page.on("response", lambda response: failed_assets.append({"url": response.url, "status": response.status})
                        if response.status >= 400 and response.request.resource_type in ("script", "stylesheet") else None)
                page.on("requestfailed", lambda request: failed_requests.append({"url": request.url, "failure": request.failure})
                        if request.resource_type in ("script", "stylesheet") else None)
                def wait_until_interactive():
                    # load can finish before the app's awaited locale import and hydration.
                    page.wait_for_load_state("networkidle", timeout=20000)
                    trigger = page.locator(".language-trigger")
                    expect(trigger).to_have_attribute("data-locale", locale.rstrip("/") or "vi")
                    trigger.click()
                    expect(trigger).to_have_attribute("aria-expanded", "true")
                    page.keyboard.press("Escape")
                    expect(trigger).to_have_attribute("aria-expanded", "false")
                response = page.goto(base + locale + "jobs/", wait_until="load", timeout=45000)
                wait_until_interactive()
                reload_response = page.reload(wait_until="load")
                wait_until_interactive()
                page.locator("main").first.wait_for()
                page.add_script_tag(path="/tmp/mdv2-audit-tools/node_modules/axe-core/axe.min.js")
                violations = page.evaluate("async () => (await axe.run(document, {runOnly: {type: 'tag', values: ['wcag2a','wcag2aa']}})).violations.map(v => ({id:v.id,impact:v.impact,nodes:v.nodes.length,help:v.help}))")
                metrics = page.evaluate("({width:innerWidth,documentWidth:document.documentElement.scrollWidth,mainCount:document.querySelectorAll('main').length,noindex:document.querySelector('meta[name=robots]')?.content})")
                case = {"locale": locale or "vi", "width": width, "status": response.status if response else None,
                        "interactive_before_and_after_reload": True,
                        "reload_status": reload_response.status if reload_response else None,
                        "direct_and_reload": bool(response and reload_response and response.status == 200 and reload_response.status == 200), "metrics": metrics, "page_errors": errors,
                        "failed_js_css": failed_assets, "failed_requests": failed_requests, "axe_violations": violations}
                report["cases"].append(case)
                if not case["direct_and_reload"] or errors or failed_assets or failed_requests or metrics["mainCount"] != 1 or "noindex" not in (metrics["noindex"] or ""):
                    report["failures"].append({"locale": case["locale"], "width": width, "reason": "HTTP/JS/CSS/main/noindex assertion"})
                if locale == "" and width in (390, 1440):
                    page.screenshot(path=str(out / ("jobs-" + str(width) + ".png")))
                context.close()
        browser.close()
finally:
    server.terminate()
    server.wait(timeout=10)
    (out / "report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps(report, ensure_ascii=False, indent=2))
raise SystemExit(1 if report["failures"] else 0)
