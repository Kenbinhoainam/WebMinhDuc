"""Read-only, credential-free Pages HTTP audit. Does not publish or submit forms."""
import concurrent.futures
import datetime
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import subprocess
import sys
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

ORIGIN = "https://kenbinhoainam.github.io"
BASE = ORIGIN + "/WebMinhDuc/"
REFS = {
    "prototype_at_audit": "19ac2b365f2264399fde4312639127b8de80736f",
    "gh_pages_at_audit": "cbce772deaa9f73988d76ce7c1c0a89bc7b5c77b",
}
class Head(HTMLParser):
    def __init__(self):
        super().__init__()
        self.assets, self.canonical, self.robots, self.locales = [], [], [], []
        self.lang = None
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "html":
            self.lang = a.get("lang")
        if tag == "script" and a.get("src"):
            self.assets.append(a["src"])
        if tag == "link":
            if a.get("rel") in ("stylesheet", "modulepreload", "preload") and a.get("href"):
                self.assets.append(a["href"])
            if a.get("rel") == "canonical":
                self.canonical.append(a.get("href"))
            if a.get("rel") == "alternate":
                self.locales.append({"lang": a.get("hreflang"), "href": a.get("href")})
        if tag == "meta" and a.get("name", "").lower() == "robots":
            self.robots.append(a.get("content"))

def fetch(url):
    redirects = []
    class Redirect(urllib.request.HTTPRedirectHandler):
        def redirect_request(self, req, fp, code, msg, headers, newurl):
            redirects.append({"status": code, "url": newurl})
            if urllib.parse.urlsplit(newurl).netloc != "kenbinhoainam.github.io":
                raise ValueError("Redirect changed host; record and review before following")
            return super().redirect_request(req, fp, code, msg, headers, newurl)
    req = urllib.request.Request(url, headers={"User-Agent": "MDV2-ReadOnly-Deployment-Audit", "Cache-Control": "no-cache"})
    row = {"url": url, "redirects": redirects}
    try:
        response = urllib.request.build_opener(Redirect()).open(req, timeout=25)
    except urllib.error.HTTPError as exc:
        response = exc
    except Exception as exc:
        row["error"] = str(exc)
        return row, b""
    with response:
        body = response.read(5 * 1024 * 1024 + 1)
        row.update(status=response.status, final_url=response.url,
                   headers={k: response.headers.get(k) for k in ("Content-Type", "Cache-Control", "Age", "ETag", "Last-Modified")},
                   bytes=len(body), sha256=hashlib.sha256(body).hexdigest())
    if len(body) > 5 * 1024 * 1024:
        row["error"] = "Response exceeds audit limit"
    return row, body

root, body = fetch(BASE)
parser = Head()
parser.feed(body.decode("utf-8", errors="replace"))
report = {
    "observed_at_utc": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    "audit_commit": subprocess.check_output(["git", "rev-parse", "HEAD"], text=True).strip(),
    "root": root,
    "metadata": {"canonical": parser.canonical, "robots": parser.robots, "lang": parser.lang, "hreflang": parser.locales},
    "ref_comparison": {},
    "limits": ["No form submission", "HTTP does not prove browser rendering", "Sites v10 is a separate access-controlled host, not fetched here"],
}
for label, sha in REFS.items():
    blob = subprocess.check_output(["git", "show", sha + ":index.html"])
    h = Head()
    h.feed(blob.decode("utf-8"))
    report["ref_comparison"][label] = {
        "commit": sha, "html_sha256": hashlib.sha256(blob).hexdigest(),
        "exact_live_html_match": blob == body, "entry_assets": h.assets,
        "canonical": h.canonical, "robots": h.robots,
    }

paths = ["", "?mdv2-audit=" + report["observed_at_utc"].replace(":", "-"),
         "robots.txt", "sitemap.xml", "duyet.html", "about-us", "about-us/",
         "jobs/cong-nhan-lap-rap-bac-ninh", "en/jobs", "zh/jobs", "ko/jobs", "ja/jobs",
         "en/", "zh/", "ko/", "ja/", "__mdv2_missing_route__"]
urls = [BASE + p for p in paths]
urls += [urllib.parse.urljoin(BASE, a) for a in parser.assets
         if urllib.parse.urlsplit(urllib.parse.urljoin(BASE, a)).netloc == "kenbinhoainam.github.io"]
rows = list(concurrent.futures.ThreadPoolExecutor(max_workers=4).map(fetch, dict.fromkeys(urls)))
report["responses"] = [r for r, _ in rows]
sitemap_body = next((b for r, b in rows if r["url"] == BASE + "sitemap.xml" and r.get("status") == 200), b"")
sitemap_urls = []
if sitemap_body:
    try:
        sitemap_urls = [e.text for e in ET.fromstring(sitemap_body).iter() if e.tag.endswith("}loc")]
    except ET.ParseError as exc:
        report["sitemap_error"] = str(exc)
report["sitemap"] = {"count": len(sitemap_urls), "outside_base": [u for u in sitemap_urls if not u.startswith(BASE)]}
report["blocked"] = root.get("status") != 200 or "error" in root
report["status"] = "BLOCKED_LIVE_DEPLOYMENT_VERIFICATION" if report["blocked"] else "HTTP_OBSERVED"
Path("/tmp/mdv2-pages-http.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
print(json.dumps(report, ensure_ascii=False, indent=2))
sys.exit(1 if report["blocked"] else 0)
