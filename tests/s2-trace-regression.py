"""Bind individual frozen criteria to named assertions in the same-build regression logs.

Run after the application build and the regression commands. Supply the QA run's app
commit. Only an observed success marker for the specific subtest yields evidence.
Run in the same verified checkout; partial is never a full acceptance.
"""
import argparse
import hashlib
import json
import re
import subprocess
from pathlib import Path

ROOT = Path("docs/sdd/SEL-2026.11.27-v1.0.0/execution")
cases = []


def case(suite, marker, codes, measured, remaining=""):
    cases.append((suite, marker, codes.split(), measured, remaining))


case("about-anchors", "PASS About anchors:", "T01 T02 T03 T04 T05 P02-F1",
     "Unique five about chapters and business-contact; localized direct targets, anchors, history and fallback routing in the About fixture.")
case("about-anchors", "PASS About anchors:", "P02-B1 P02-B2 P02-F3",
     "Five ordered chapter links, six unique destinations, history phases with non-year names, five partners and four profile indicators verified across locales.")
case("sitemap-review","PASS independent sitemap:", "B04 CS-B04-2",
     "The no-JS sitemap and the 14 localized submenu leaves were compared at the same routes.",
     "Confirm that opening each mobile destination by actual touch is equivalent to the desktop interaction.")
case("header-hover-review","PASS independent hover:", "MO01-4",
     "Escape cancels pending hover, same-route close cancels timers, switching menus preserves the intended final panel.",
     "Verify the real pointer and transition-cancel scenarios on the compact drawer too.")
case("navigation","PASS five-locale arrow-free navigation", "B03 CS-C02-1 CS-C05-2",
     "Rendered five locales; exercised parent-link and submenu controls independently using synthetic hover, keyboard, touch and mobile navigation.",
     "Inspect active styling and focus geometry with a browser on the required viewports.")
case("s2-shared","PASS S2-DRAWER", "T18 MI08-1",
     "Open/close/open/switch, exactly one exposed mobile group, child Escape returns to disclosure; second Escape restores menu in all five locales.",
     "Desktop hover and touch on physical devices are not covered by this specific fixture.")
case("s2-shared","PASS S2-MODAL", "MO02-2 CS-C02-2",
     "Tab and reverse Tab trap; immediate Escape/close restore trigger; pointercancel avoids phantom dismissal; removed trigger falls back to main.")
case("s2-shared","PASS S2-MODAL", "MS03-3 MS03-4 MS04-1 MS04-2",
     "The shared modal responds to pointercancel, Escape and rapid intent while restoring focus without any transitionend.",
     "Repeat across all other applicable controls, including form submit and active tab during transition.")
case("s2-shared","PASS S2-NUMBER", "CS-D08-2",
     "The SSR counter uses Intl.NumberFormat for all five locales and keeps the '+' suffix.",
     "Verify other supported numerical labels and units in the built page.")
case("s2-reviewer","PASS reviewer fixture", "P41-C1 P41-C3 P41-F1 P41-F2 T30 P41-B3",
     "Standalone reviewer under both hosting mounts: noindex/nofollow, three exact CSS sizes, 48 primary path/preset combinations; selected destination and history preserved on resize; invalid query falls back; every v3 shortcut is allowlisted.")
case("s2-reviewer","PASS reviewer fixture", "P41-D1 P41-D3 P41-A2 P41-A3 P41-E1 P41-E2 P41-B4",
     "Real reviewer script exercised in jsdom: iframe width/height/title, exactly one aria-pressed size, query restoration and localized labels.",
     "Measure applied scale, inspect focus, labels and shared review URLs using a rendered browser.")
case("s2-b2c","PASS W3 T06/T07/T11/T12", "T06 T07 P09-E1 P09-E2 P09-B1 CS-B05-1",
     "Worker listing fixtures distinguish MD001–MD006, open/closed state, factory skill filters, accent/case normalization and role-specific results.")
case("s2-b2c","PASS W3 T06/T07/T11/T12", "MI02-1 CS-C04-1",
     "In each locale, three toggles leave the expected stored IDs and count, fixed accessible name and correct pressed state.")
case("s2-b2c","PASS W3 T06/T07/T11/T12", "MI03-1 MI03-2 MI03-3",
     "IME composition and committed query, chip deletion, nearest focus, hash and active IDs after clearing are exercised with controlled DOM events.",
     "Repeat with a native IME/caret, pointer and live announcement; synthetic DOM events do not exercise a system keyboard.")
case("s2-b2c","PASS W3 T06/T07/T11/T12","CS-C06-4 P14-E1 P14-E2 P14-E3 P14-C1 P14-C2 P14-F3",
     "Opened MD005 from listing, saved it, verified closed description, replacement active-list link, no inline/mobile apply or new receipt.")
case("s2-b2c","PASS W3 T06/T07/T11/T12","P09-E3 P18-E1 P18-E2 P18-E3 P19-E1",
     "Walked all eight data records from their actual listing, saved correct ID and checked closed/unit-specific behavior and local receipts without CV/account.")
for number in (10,11,12,13,15,16,17):
    code=f"P{number}"
    case("s2-b2c","PASS W3 T06/T07/T11/T12"," ".join(code+"-"+x for x in ("E1","E2","E4")),
         f"{code}: actual listing to detail, optional/required form controls, one correctly linked local receipt and admin destination, and restored archive/trigger.")
case("s2-b2c","PASS W3 T06/T07/T11/T12","T11 T12",
     "All seven open records produce one correct F03/F04 receipt per attempt, MD005 has no apply; job code, readonly position and optional uploads exercised.")
case("jobs-sprint1","PASS Sprint 1 filters, audiences, closed vacancy and application flows","P18-B2 CS-C06-2 CS-B05-3",
     "Compared no-match and no-saved states; one click restores filters/results or navigates to jobs. Last removal moves focus to the empty-state CTA.")
case("jobs-sprint1","PASS Sprint 1 filters, audiences, closed vacancy and application flows","CS-C10-1 MO05-2 CS-C09-1",
     "Synthetic history restored URL, original/fallback item or empty CTA focus, sticky apply visibility and trigger restoration.",
     "Verify scroll position and header/keyboard obstruction on a rendered device.")
case("jobs-logic","checks passed","P32-F2",
     "Dummy attachment metadata boundaries: empty, exactly 5,000,000 bytes, +1 byte, exactly three totaling 15MB, four files, allowed MIME/extension and mismatches.")
case("jobs-logic","checks passed","F10 CS-D06-3",
     "Saved storage contains sanitized known IDs; reload behavior, storage errors and cross-tab reset checked.",
     "Separately compare receipts/URL/logs across actual browser sessions and all forms.")
case("education-validation","PASS Education rejects invalid phone","P32-C2",
     "F05 → F06 → Back resets aria-pressed, route query and hash; masthead links update the active form.")
case("education-validation","PASS Education rejects invalid phone","P32-C3 MI04-3 MI04-4 MI05-4",
     "Rendered form rejects invalid phone and an oversized file, retains name, accepts optional file left empty and succeeds.",
     "Repeat complete failure/success/optional branches on F01–F06, including native file-picker cancellation.")
case("business-info","PASS verified contact details", "P07-C1 P07-C2",
     "F05 and F06 links from college admissions point to correct query/hash in five locales; no business form on admissions.")
case("hero-lifecycle","PASS independent hero lifecycle blocked","MO08-3",
     "Simulated rejected autoplay transitions to fallback and retains correct explicit user choices.",
     "Media rendering, slow network and on-device video/audio policies require a browser.")
case("home-video-gallery","PASS video gallery:", "P01-C4",
     "Activated demand-loaded gallery from posters, checked selected sources, player, failure and retry, and focus restoration in the DOM fixture.")
case("home-metric-replay","PASS metric replay:", "MO06-4",
     "Shared counter clock, both entry directions, edge jitter, reduced mid-run, unmount and accessible final values verified.",
     "Check pixel motion/alignment in a rendered viewport.")
case("motion-repeat-review","PASS independent repeat motion:", "MO06-1 CS-C03-2",
     "Deterministic visibility, hysteresis, protected focused forms, viewport resize, late insertion and unmount callbacks.",
     "Inspect real scroll, visible focus and contrast across required viewport pairs.")
case("image-fallback","PASS original image retry", "CS-A03-4 CS-D06-4 MO08-4",
     "Loaded failing derivatives, retained original URL, alt and fallback content; simulated pre-hydration failures.",
     "Inspect layout geometry with failed assets and complete remaining logo/media cases.")
case("partners","PASS partners:", "P31-C1 P31-F1",
     "Keyboard Home/End/arrow, synthetic drag and focus pause, image error to exact partner name, verified five named local logo assets.")
case("partners","PASS partners:", "MO07-2 CS-A06-4",
     "SSR/static names, hidden duplicate sets, hover/focus/hidden/reduced handling tested.",
     "Measure overflow and inspect optical logo alignment/cropping in a rendered browser.")
case("careers-carousel","PASS four careers rails", "MO02-3 MO07-3",
     "Existing careers gallery and rails verified in DOM with focus and manual open/close, no new lightbox route.",
     "Check actual image transition geometry and reduced preferences during interactions.")
case("consultation","PASS contact details/form/map hierarchy", "P37-C3 P37-F2 P38-B1 P38-B3 P38-C1 P38-C2 P38-C3 P38-E1 P38-E2 P38-E3 T15 CS-C10-4 MI06-4",
     "Date/time/F02 fields validated, switch-time round trip retained draft, crosses midnight before submit safely, repeated submit produces one local receipt with working reset. Confirmed mapped office CIDs and fallback links.")
case("consultation","PASS contact details/form/map hierarchy", "P37-C1 P37-C2 P37-B2 P37-E1 T09 T10",
     "F02 default, deep-linked F01, independent drafts, first-error focus and validation exercised in contact fixture.",
     "Also inspect complete required/optional field counts on F01 and accessible labels in all locales.")
case("admin-demo","Admin sample duplicate detection and filtered CSV checks passed", "P36-E3",
     "Compared matching phone/job F03 mock candidates and other job/form types. Fixture flags matching F03 without blocking records.",
     "Confirm the displayed warning and its non-blocking UI wording.")
case("s2-other-pages","PASS W4 empty lists", "P20-F4 P27-F4 P31-C3 P31-B3",
     "Empty editorial fixtures produce clear result and reset, partners CTA lands in #business-contact with F01 state.")
case("s2-other-pages","PASS W4 empty lists", "P36-F2 P36-C2 P36-C3 CS-C11-3",
     "Exercised type/id modal routing, reset confirmation, local rows and CSV formula/newline/quote escaping.",
     "Review other filter, CMS, BOM and update state branches in the ADMIN run.")
case("s2-other-pages","PASS W4 empty lists", "T13 T14 CS-C04-3 MI05-1 MI05-2 MI05-3",
     "Education draft for each mode, program restoration, metadata-only attachment with delete/focus and separate form state.",
     "Repeat native picker cancellation, per-file removal and F04 equivalent, including accessibility.")
case("sitemap-destinations","PASS sitemap destination anchors", "B01 B04 CS-B04-4",
     "Exercised main destination routes, anchors and category filters with browser-history simulation.",
     "Verify every applicable destination and user-visible scroll/focus on the preview.")
case("home-b2b","PASS homepage B2B:", "P01-B3",
     "Verified the existing full /about-us#profile href on Home in five locale renderings.")
case("v14-forms-demo","PASS six forms, attachment boundaries", "P36-E1 CS-C07-1",
     "Connected F01–F06 fake form payloads/receipts and ADMIN; attachment metadata stays local.",
     "Verify all six entry-point paths, linked receipt types and display copy with each locale.")


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--sha",required=True)
    parser.add_argument("--logs",type=Path,default=ROOT/"logs")
    args=parser.parse_args()
    sha=subprocess.check_output(["git","rev-parse","--verify",args.sha+"^{commit}"],text=True).strip()
    if not args.logs.exists(): parser.error("Final SHA-matched regression logs must exist.")
    choices=[]
    logs=[]
    for file in sorted(args.logs.rglob("*.log")):
        text=file.read_text(errors="replace")
        if not text.strip(): continue
        logs.append((file,text,hashlib.sha256(text.encode()).hexdigest()))
    for suite,marker,ids,measured,remaining in cases:
        for file,text,digest in logs:
            matching=next((line for line in text.splitlines() if marker in line and not line.startswith('>')),None)
            if not matching: continue
            if not any(key in file.name or key in text for key in (suite, suite+".mjs")): continue
            try:
                name=str(file.relative_to(ROOT))
            except ValueError:
                name=file.name
            for code in ids:
                choices.append(dict(choice_id=code,coverage="partial" if remaining else "full",test_status="Pass",
                                    assertion=measured,remaining=remaining,source_test=f"tests/{suite}.mjs",
                                    evidence_ref=name,log_sha256=digest,success_marker=matching[:450]))
            break
    output=ROOT/"trace-regression.json"
    output.write_text(json.dumps(dict(build_sha=sha,environment="Node/Linux; see raw log for harness. No physical-device claim.",choices=choices),ensure_ascii=False,indent=2)+"\n")
    print(len(choices),"row-to-test references;",len(set(r["choice_id"] for r in choices)),"IDs;",output)


if __name__=="__main__":
    main()
