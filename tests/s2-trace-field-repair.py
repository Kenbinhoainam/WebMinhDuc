"""Turn actual public-form repair measurements into the single applicable frozen acceptance."""
import collections
import hashlib
import itertools
import json
import sys
from pathlib import Path

sha = sys.argv[1]
folder = Path("docs/sdd/SEL-2026.11.27-v1.0.0/execution/browser") / ("form-feedback-"+sha[:7])
raw_file = folder/"observations.json"
raw = raw_file.read_bytes()
d = json.loads(raw)
assert d["application_sha"] == sha and d["chromium"] and d["dist_tree_sha256"]
rows = d["cases"]
seen = {(r["locale"],r["width"],r["mode"]) for r in rows}
assert len(seen)==len(rows) and seen
states = collections.Counter(r["status"] for r in rows)
assert states.keys() <= {"Fail","Pass"}
expected = set(itertools.product(["vi","en","zh","ko","ja"],[390,1440],["F01","F02","F03","F04","F05","F06"]))
full = seen == expected and not d["page_errors"] and not d["missing_assets"]
test_status = "Fail" if states["Fail"] or d["page_errors"] else "Pass"
failures = [dict(mode=r["mode"],locale=r["locale"],width=r["width"],error=r["error"]) for r in rows if r["status"]=="Fail"]
choice = dict(choice_id="CS-C08-3",coverage="full" if full else "partial",test_status=test_status,
              assertion="Type before submitting, send the invalid form, check focused/linked first error, correct the phone number and compare remaining invalid controls and retained input values.",
              actual=dict(counts=states,case_count=len(seen),failed=failures),
              evidence_ref=f"browser/{folder.name}/observations.json",remaining="" if full and test_status=="Pass" else
              "Replay all six forms across five locales and two viewports; the current build retained incorrect invalid states on "+", ".join(sorted({r["mode"] for r in failures}))+".")
report = dict(build_sha=sha,dist_tree_sha256=d["dist_tree_sha256"],chromium=d["chromium"],
              raw_sha256=hashlib.sha256(raw).hexdigest(),choices=[choice])
(folder/"choices.json").write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n")
print(sha,len(seen),dict(states),test_status)
