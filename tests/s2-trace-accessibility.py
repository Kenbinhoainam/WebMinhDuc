"""Check accessible-name sources and ID relations in the preview's localized HTML.

This is a structural check with lxml. Browser layout, computed accessible names,
OS interaction and screen-reader speech require their own observations.
"""
import argparse
import collections
import hashlib
import json
from pathlib import Path
from lxml import html

ROOT = Path("docs/sdd/SEL-2026.11.27-v1.0.0")
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--sha", required=True)
parser.add_argument("--dist", required=True, type=Path)
arguments = parser.parse_args()
records = [json.loads(line) for line in (ROOT / "data/pages-and-urls.jsonl").read_text().splitlines()]
digest = hashlib.sha256()
observations = []


def name_source(node, doc):
    labelled = node.get("aria-labelledby", "").split()
    if labelled:
        return all(doc.xpath('//*[@id=$id and normalize-space(.)!=""]', id=key) for key in labelled)
    if node.get("aria-label", "").strip() or node.get("title", "").strip():
        return True
    if node.tag in ("input", "select", "textarea"):
        labels = doc.xpath('//label[@for=$id]', id=node.get("id", "")) + node.xpath("ancestor::label")
        return any(label.text_content().strip() for label in labels)
    return bool(node.text_content().strip() or node.xpath('.//img[normalize-space(@alt)!=""]'))


for page in records:
    if page["source_code"] == "P41":
        continue
    route = page["fields"]["Đường dẫn"].strip("/")
    for locale in ("vi", "en", "zh", "ko", "ja"):
        file = arguments.dist / (locale if locale != "vi" else "") / route / "index.html"
        content = file.read_bytes()
        digest.update(content)
        doc = html.fromstring(content)
        ids = collections.Counter(doc.xpath("//*[@id]/@id"))
        missing = []
        collapsed = []
        for attr in ("aria-labelledby", "aria-describedby", "aria-errormessage", "aria-controls"):
            for node in doc.xpath(f"//*[@{attr}]"):
                for key in node.get(attr).split():
                    if key in ids:
                        continue
                    entry = [node.tag, node.get("class", ""), attr, key]
                    if attr == "aria-controls" and node.get("aria-expanded") == "false":
                        collapsed.append(entry)
                    else:
                        missing.append(entry)
        controls = doc.xpath('//a[@href]|//button|//select|//textarea|//input[not(@type="hidden")]')
        unnamed = [[e.tag,e.get("class","")] for e in controls if not name_source(e,doc)]
        bad = {id:n for id,n in ids.items() if n>1}
        absent_alt = doc.xpath('//main//img[not(@alt)]/@src')
        observations.append(dict(page=page["source_code"],locale=locale,route="/"+route,controls=len(controls),
            duplicate_ids=bad,missing_name_sources=unnamed,missing_references=missing,
            missing_alt=absent_alt,collapsed_deferred_controls=collapsed,
            h1=len(doc.xpath("//main//h1")),main=len(doc.xpath("//main"))))

assert len(observations)==200
predicates = [
    ("D08", ("duplicate_ids","missing_references","missing_name_sources","missing_alt","main","h1"),
     "Verify one main/H1, unique IDs, name-source signals, alt attributes and ID relationships in each static route and locale."),
    ("CS-D04-2", ("missing_references","missing_name_sources","duplicate_ids"),
     "Inspect names and label/description/error relations for rendered controls across all localized routes."),
    ("CS-A08-3", ("missing_name_sources","missing_references"),
     "Check name sources on all rendered controls, including icon actions and independently referenced labels."),
    ("A10", ("missing_name_sources","missing_references"),
     "Check icon command name-source coverage in the shipped HTML before the separate participant recognition test."),
]
choices = []
for code, properties, assertion in predicates:
    failures = [o for o in observations if any(o[k] != 1 if k in ("h1","main") else bool(o[k]) for k in properties)]
    choices.append(dict(choice_id=code, coverage="partial", test_status="Fail" if failures else "Pass",
        assertion=assertion,actual=f"{len(observations)-len(failures)}/200 routes with locale",
        remaining="Measure the computed accessibility tree, dynamic announcements, keyboard and actual screen readers as required for the full criterion.",
        failed=[(o["page"],o["locale"]) for o in failures]))
report = dict(build_sha=arguments.sha,tested_html_sha256=digest.hexdigest(),
    runtime="lxml static DOM; collapsed dynamic control targets recorded separately", choices=choices, observations=observations)
(ROOT/"execution/trace-accessibility.json").write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n")
print([(row["choice_id"],row["test_status"],row["actual"]) for row in choices])
if any(row["test_status"]=="Fail" for row in choices):
    raise SystemExit(1)
