"""Smoke the preserved published artifact locally, not npm-build's S1 dist output."""
import json
from pathlib import Path
import subprocess
import tempfile
import time
import urllib.request
from playwright.sync_api import sync_playwright

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
                errors, failed_assets = [], []
                page.on("pageerror", lambda exc: errors.append(str(exc)))
                page.on("response", lambda response: failed_assets.append({"url": response.url, "status": response.status})
                        if response.status >= 400 and response.request.resource_type in ("script", "stylesheet") else None)
                response = page.goto(base + locale + "jobs/", wait_until="load", timeout=45000)
                page.reload(wait_until="load")
                page.locator("main").first.wait_for()
                page.add_script_tag(path="/tmp/mdv2-audit-tools/node_modules/axe-core/axe.min.js")
                violations = page.evaluate("async () => (await axe.run(document, {runOnly: {type: 'tag', values: ['wcag2a','wcag2aa']}})).violations.map(v => ({id:v.id,impact:v.impact,nodes:v.nodes.length,help:v.help}))")
                metrics = page.evaluate("({width:innerWidth,documentWidth:document.documentElement.scrollWidth,mainCount:document.querySelectorAll('main').length,noindex:document.querySelector('meta[name=robots]')?.content})")
                case = {"locale": locale or "vi", "width": width, "status": response.status if response else None,
                        "direct_and_reload": True, "metrics": metrics, "page_errors": errors,
                        "failed_js_css": failed_assets, "axe_violations": violations}
                report["cases"].append(case)
                if case["status"] != 200 or errors or failed_assets or metrics["mainCount"] != 1 or "noindex" not in (metrics["noindex"] or ""):
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
