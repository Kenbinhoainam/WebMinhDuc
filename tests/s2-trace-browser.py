"""Associate scoped Chromium observations with frozen rows, retaining failure evidence."""
import argparse
import collections
import hashlib
import json
from pathlib import Path

EXEC = Path("docs/sdd/SEL-2026.11.27-v1.0.0/execution")
ap = argparse.ArgumentParser(description=__doc__)
ap.add_argument("report",type=Path)
ap.add_argument("--sha",required=True)
ap.add_argument("--evidence-ref",required=True,help="Repository path or immutable workflow artifact URL")
args = ap.parse_args()
raw = args.report.read_bytes()
report = json.loads(raw)
assert report["sha"] == args.sha and report.get("chromium"), "Different code or Chromium never started"
cases = collections.defaultdict(list)
for index, row in enumerate(report["checks"]):
    if row.get("choice_ids"):
        assert row.get("sha") == args.sha
    for code in set(row.get("choice_ids",[])):
        cases[code].append((index,row))
results = []
for code, entries in sorted(cases.items()):
    count = collections.Counter(row["status"] for _,row in entries)
    first_index, sample = next(((i,r) for i,r in entries if r["status"]=="Fail"),entries[0])
    test_status = "Fail" if count["Fail"] else "Pass" if count["Pass"] else "Not Run"
    summary = ", ".join(f"{value} {key}" for key,value in sorted(count.items()))
    tests = sorted(set(row["test"] + (" · " + row["expected"] if "expected" in row else "") for _,row in entries))
    locales = sorted(set(row["locale"] for _,row in entries if row.get("locale")))
    widths = sorted(set(row["viewport_width"] for _,row in entries if row.get("viewport_width") is not None))
    pending = sorted(set(row["remaining"] for _,row in entries if row.get("remaining")))
    results.append(dict(choice_id=code,test_status=test_status,coverage="partial",
        assertion=f"Chromium {report['chromium']} · {summary} · {', '.join(tests)}",
        actual_example=sample.get("actual", sample.get("error","")),locales=locales,widths=widths,
        evidence_ref=args.evidence_ref+"#/checks/"+str(first_index),
        case_indices=[i for i,_ in entries],
        remaining=" ".join(pending) or "Reconcile the remaining frozen acceptance clauses and required input devices."))
out = dict(build_sha=args.sha,dist_sha256=report["dist_tree_sha256"],report_sha256=hashlib.sha256(raw).hexdigest(),
    report_path=args.evidence_ref,checks=len(report["checks"]),choices=results)
(EXEC/"browser-choice-evidence.json").write_text(json.dumps(out,indent=2,ensure_ascii=False)+"\n")
print(len(results), dict(collections.Counter(row["test_status"] for row in results)))
