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
ap.add_argument("--out", type=Path, default=EXEC/"browser-choice-evidence.json")
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
# Only rows with complete, individually evaluated acceptance paths are promoted.
# Every other observation narrows the outstanding test. The main viewport checks
# cover pages independently and have no per-choice tags in the raw report.
locales_required = {"vi","en","zh","ko","ja"}
column_widths = {320,390,430,639,640,767,768,1023,1024,1280,1440,1920}
viewport_pass = {(r["route"],r["locale"],r["viewport_width"]) for r in report["checks"]
                 if r.get("test") == "viewport-header-and-reflow" and r.get("status") == "Pass"}
remaining_by_id = {
    "CS-A01-1":"Inspect the brand end state with all five translated CTA pairs and the film/brand transition; film-only samples leave the end state untested.",
    "CS-A01-4":"Compare the order and rearrangement of metadata, prose, sidebar and related content on the same article and event at narrow and wide widths.",
    "CS-A02-2":"Measure image-backed, translucent, disabled, metadata, icon and focus colors, including interactive states. The measured opaque CTA pairs are recorded.",
    "CS-A04-4":"Exercise translated form labels, filter chips, open dialogs, related headings and focus at increased text spacing; top-level heading geometry has been measured.",
    "CS-B04-1":"Compare the submenu name and programmatic/current visible state of the active group and child on deep URLs, including focus and Back.",
    "CS-D01-2":"Validate magnified editorial reading order and an operable local table at enlarged text; record real keyboard panning and focus.",
    "CS-D01-4":"While a native mobile keyboard is open, focus the final invalid field and reach its error and submit control inside the modal.",
    "CS-D02-3":"Compare the recruitment forms, ADMIN sidebar and filters immediately either side of each declared threshold using long labels and both form modes.",
    "CS-D03-3":"Perform pointer drag, keyboard and touch on each auto rail, interrupt/restart, then verify focus and one intentional movement per activation.",
    "CS-D03-4":"Use a device keyboard and picker; exercise time switching and individual file removal while the bottom action remains reachable.",
    "MO03-1":"Inspect the question’s vertical position, arrow and content transition during interruption, repeated rapid commands and both motion preferences.",
    "P01-D1":"Inspect both successful decoded playback and the final brand heading/CTA on every required locale and layout; use the stage and decoded-dimension fields in this report.",
    "P04-D1":"Increase real text size and use the keyboard to pan the table between its first and last column while observing the document width.",
    "P04-D2":"Inspect two-column and process-grid behavior at enlarged text and exercise the scoped table’s keyboard scroll.",
    "P05-D1":"Walk the entire keyboard flow through the responsibility list and onward to the intended action at the narrow breakpoint.",
    "P05-D2":"Verify the fee table's first/last column with keyboard and enlarged text; the normal-size scroller dimensions are recorded.",
    "P06-D2":"Save representative skill-criteria states near 767/768, including the intended keyboard/coarse-input route; verify the long labels remain usable at enlarged text.",
    "P07-D1":"Check text enlargement and Tab through both learning modes to their consultation/application destinations.",
    "P07-D2":"Exercise the fee region with actual text enlargement and keyboard panning from the first to last cell.",
    "P08-D2":"Compare actual reading order with the narrow/wide visual order for the workflow, steps and topic lists.",
    "P10-D2":"Open the native phone keyboard while the apply modal is open and confirm the fixed CTA does not occlude the field, error or focus.",
    "P20-D2":"Walk Tab through translated archive filters, featured rail and pagination at the threshold; the filter hit areas have been measured.",
    "P27-D1":"Tab through all three filters and event rows and verify focus near 700px; the normal hit areas have been measured.",
    "P31-D1":"Verify the partners strip with keyboard, increased text and reduced motion on the actual rendered page.",
    "P32-D1":"Check both sides of both breakpoints, Tab to invalid controls and attach a mock file using a native phone picker.",
    "P36-D2":"Verify exact widths 449/450/451 and 799/800/801; keyboard-pan the local scrollport to its final cell and observe mobile touch panning.",
}
for n in range(21,27):
    remaining_by_id[f"P{n}-D3"]="Activate each article TOC anchor with the keyboard and verify the focused heading’s actual rectangle with enlarged text and scroll restored."
for n in range(28,31):
    remaining_by_id[f"P{n}-D2"]="Exercise all five event anchors at increased text and with reduced motion; agenda column counts and normal viewport widths are recorded."


def complete_row(code, entries, tests, widths):
    if not all(row["status"] == "Pass" for _,row in entries):
        return False
    names = {row["test"] for _,row in entries}
    if code in {"P41-A2","P41-D2","P41-D3"}:
        return "p41-keyboard-tab-cycle" in names
    if code in {"P41-A3","P41-B3","P41-D1"}:
        return {390,820,1440} <= set(widths) and all("scaled-vs-direct" in n for n in names)
    if code in {"P03-D2","P03-D3"}:
        return all(column_widths <= {r["viewport_width"] for _,r in entries if r["locale"] == locale}
                   and all(("/services",locale,w) in viewport_pass for w in column_widths)
                   for locale in locales_required)
    keyboard_news = {f"P{n}-D3" for n in range(21,27)}
    keyboard_events = {f"P{n}-D2" for n in range(28,31)}
    keyboard_tables = {"P04-D1","P05-D2","P07-D2"}
    if code in keyboard_news | keyboard_events | keyboard_tables:
        required = "keyboard-article" if code in keyboard_news else "keyboard-event" if code in keyboard_events else "keyboard-table"
        return required in names and all(
            {390,900} <= {r["viewport_width"] for _,r in entries if r["locale"]==locale and r["test"]==required}
            for locale in locales_required)
    if code in {"P04-D2","P05-D1","P06-D2","P07-D1","P08-D2"} and "service-decision-keyboard-grid" in names:
        return all({767,768} <= {r["viewport_width"] for _,r in entries if r["locale"]==locale}
                   for locale in locales_required)
    if code=="P31-F3" and all("alias" in n.lower() for n in names):
        return {r["locale"] for _,r in entries}==locales_required
    if code == "T09" and "touch-F01-to-admin" in names:
        # The same build also independently ran F01 in the inline and modal components
        # in five languages. Keep the full row dependent on both pieces of evidence.
        data=json.loads((EXEC/"qa/choice-evidence.json").read_text())
        refs=[r for r in data["choices"] if r["choice_id"]=="T09" and r["test_status"]=="Pass"]
        return data["build_sha"] == args.sha and bool(refs)
    return False


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
    full = complete_row(code,entries,tests,widths)
    remaining = "" if full else remaining_by_id.get(code, " ".join(pending)
                     or "Reconcile the remaining frozen acceptance clauses and other required input methods.")
    if not full and isinstance(report.get("limits"),dict) and code in report["limits"]:
        remaining=report["limits"][code]
    results.append(dict(choice_id=code,test_status=test_status,coverage="full" if full else "partial",
        assertion=f"Chromium {report['chromium']} · {summary} · {', '.join(tests)}",
        actual_example=sample.get("actual", sample.get("error","")),locales=locales,widths=widths,
        evidence_ref=args.evidence_ref+"#/checks/"+str(first_index),
        case_indices=[i for i,_ in entries],
        remaining=remaining))
out = dict(build_sha=args.sha,dist_sha256=report["dist_tree_sha256"],report_sha256=hashlib.sha256(raw).hexdigest(),
    report_path=args.evidence_ref,checks=len(report["checks"]),choices=results)
args.out.write_text(json.dumps(out,indent=2,ensure_ascii=False)+"\n")
print(len(results), dict(collections.Counter(row["test_status"] for row in results)))
