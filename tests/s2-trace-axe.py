"""Aggregate actual axe and bounded keyboard records for five GitHub QA shards."""
import argparse
import collections
import hashlib
import json
from pathlib import Path

EXEC = Path("docs/sdd/SEL-2026.11.27-v1.0.0/execution")
ap = argparse.ArgumentParser(description=__doc__)
ap.add_argument("artifact_root",type=Path)
ap.add_argument("--sha",required=True)
ap.add_argument("--workflow-url",required=True)
ap.add_argument("--out",type=Path,default=EXEC/"browser-a11y-evidence.json")
args=ap.parse_args()
observations=collections.defaultdict(list)
hashes={}
total=collections.Counter()
for locale in ["vi","en","zh","ko","ja"]:
    folder=args.artifact_root/("sprint2-axe-"+locale)
    summary=json.loads((folder/"browser-a11y.json").read_text())
    assert summary["sha"] == args.sha and summary["chromium"]
    path=folder/summary["observations_file"]
    hashes[locale]=hashlib.sha256(path.read_bytes()).hexdigest()
    rows=[json.loads(line) for line in path.read_text().splitlines()]
    assert len(rows)==summary["recorded_checks"]==summary["expected_checks"]
    for line,row in enumerate(rows,1):
        assert row["sha"]==args.sha
        total[row["status"]]+=1
        base=dict(route=row["route"],locale=locale,width=row["viewport_width"],
                  evidence_ref=f'{args.workflow_url} → {folder.name}/{path.name}#L{line}')
        if row["test"]=="axe":
            findings=row.get("actual",{})
            for category,status in (("passed","Pass"),("lesser","Fail"),("serious","Fail"),("manual","Not Run")):
                for issue in findings.get(category,[]):
                    for code in issue.get("choice_ids",[]):
                        observations[code].append(dict(base,rule=issue["id"],test_status=status,
                            details=issue.get("examples",[])[:1]))
        else:
            for code in row.get("choice_ids",[]):
                observations[code].append(dict(base,rule=row["test"],test_status=row["status"],details=[]))
choices=[]
for code, entries in sorted(observations.items()):
    counts=collections.Counter(r["test_status"] for r in entries)
    status="Fail" if counts["Fail"] else "Pass" if counts["Pass"] else "Not Run"
    sample=next(row for row in entries if row["test_status"]==status)
    rules=sorted({r["rule"] for r in entries})
    choices.append(dict(choice_id=code,coverage="partial",test_status=status,
        assertion=f'Chromium axe rule or bounded keyboard observations in five locales at 390/1440 CSS px. {dict(counts)}. '+", ".join(rules),
        evidence_ref=sample["evidence_ref"],examples=[r for r in entries if r["test_status"]=="Fail"][:5],
        remaining="Review manual findings in the axe journal, keyboard paths beyond the recorded initial sequence, unopened states and screen-reader output as required by the frozen row."))
args.out.write_text(json.dumps(dict(build_sha=args.sha,workflow=args.workflow_url,
    check_counts=total,sha256_by_locale=hashes,choices=choices),ensure_ascii=False,indent=2)+"\n")
print(dict(total),dict(collections.Counter(r["test_status"] for r in choices)))
