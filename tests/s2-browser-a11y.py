"""Independent PR audit. All Chromium requests use the existing packaged-file interception.

Requires the exact axe-core 4.10.3 JS bundle via AXE_JS, installed by CI outside
the application. Run each language as an independent job. No customer data is used.
"""
import hashlib
import importlib.util
import json
import os
from datetime import datetime, timezone
from pathlib import Path

from playwright.sync_api import sync_playwright


TESTS = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("s2_pr_offline", TESTS / "s2-pr-browser.py")
pr = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pr)
OUT = pr.OUT
AXE_VERSION = "4.10.3"
WIDTHS = [int(v) for v in os.environ.get("QA_A11Y_WIDTHS", "390,1440").split(",")]
LOCALES = os.environ.get("QA_A11Y_LOCALES", ",".join(pr.LOCALES)).split(",")
TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]
VERSION_CHECK = "() => window.axe?.version"

# Specific shared acceptance IDs describe only the corresponding observed clause.
NAME_RULES = {
    "button-name", "input-button-name", "link-name", "select-name", "label",
    "image-alt", "input-image-alt", "aria-command-name", "aria-input-field-name",
    "aria-toggle-field-name", "aria-meter-name", "aria-progressbar-name",
    "aria-dialog-name", "aria-tooltip-name", "aria-valid-attr-value",
    "aria-valid-attr", "aria-allowed-attr", "aria-required-attr", "aria-roles",
    "aria-hidden-focus", "nested-interactive",
}


def mapped(rule_id, page_id):
    if rule_id in NAME_RULES and page_id in {"P09", "P18", "P32", "P36", "P37", "P38"}:
        return ["CS-D04-2"]
    if rule_id == "color-contrast":
        return ["CS-A02-2"]
    if rule_id == "bypass" and (page_id=="P02" or 20<=int(page_id[1:])<=30):
        return ["CS-B04-4"]
    return []


AXE_SCAN = """async ({tags}) => {
  const results = await window.axe.run(document, {
    iframes:false,
    runOnly:{type:'tag',values:tags},
    // No automatically loaded iframe helpers or axe branding/telemetry.
    reporter:'v2'
  });
  const simplify = item => ({
    id:item.id,impact:item.impact,help:item.help,wcag:item.tags.filter(x=>x.startsWith('wcag')),
    count:item.nodes.length,
    examples:item.nodes.slice(0,3).map(node=>({
      target:node.target, html:node.html.slice(0,360), impact:node.impact,
      reason:(node.failureSummary||'').slice(0,800)
    }))
  });
  return {
    lang:document.documentElement.lang,
    serious:results.violations.filter(v=>['serious','critical'].includes(v.impact)).map(simplify),
    lesser:results.violations.filter(v=>!['serious','critical'].includes(v.impact)).map(simplify),
    manual:results.incomplete.map(simplify),
    passed:results.passes.map(v=>({id:v.id,nodes:v.nodes.length})),
    inapplicable:results.inapplicable.map(v=>v.id)
  };
}"""

# Five probes inside a target's visible viewport intersection reduce false occlusion
# from rounded corners. Hit tests can be inconclusive for unusual pointer-events.
FOCUS_STATE = r"""() => {
  const el=document.activeElement;
  if(!el || el===document.body || el===document.documentElement) return {pageFocus:false};
  const r=el.getBoundingClientRect(), vw=document.documentElement.clientWidth, vh=innerHeight;
  let left=Math.max(0,r.left),top=Math.max(0,r.top),right=Math.min(vw,r.right),bottom=Math.min(vh,r.bottom);
  for(let p=el.parentElement;p;p=p.parentElement){
    const c=getComputedStyle(p), b=p.getBoundingClientRect();
    if(/auto|scroll|hidden|clip/.test(c.overflowX)){left=Math.max(left,b.left);right=Math.min(right,b.right);}
    if(/auto|scroll|hidden|clip/.test(c.overflowY)){top=Math.max(top,b.top);bottom=Math.min(bottom,b.bottom);}
  }
  const area=right>left && bottom>top;
  const hits=area ? [[.5,.5],[.25,.25],[.75,.25],[.25,.75],[.75,.75]].map(([x,y])=>{
    const h=document.elementFromPoint(left+(right-left)*x,top+(bottom-top)*y);
    return {hit:h?.tagName+'.'+(h?.className?.baseVal??h?.className??''),target:!!h && el.contains(h)};
  }) : [];
  const s=getComputedStyle(el);
  return {
    pageFocus:true,tag:el.tagName,id:el.id,class:el.className?.toString(),
    label:(el.getAttribute('aria-label')||el.labels?.[0]?.textContent||el.innerText||el.title||el.name||'').trim().replace(/\s+/g,' ').slice(0,140),
    insideMain:!!el.closest('main'), hidden:!!el.closest('[hidden],[inert],[aria-hidden=true]'),
    focusVisible:el.matches(':focus-visible'),outline:s.outlineStyle,outlineWidth:s.outlineWidth,
    pointerEvents:s.pointerEvents,rect:[r.x,r.y,r.width,r.height].map(Math.round),
    visibleIntersection:area ? [left,top,right,bottom].map(Math.round):null,
    hits, inView:area, exposed:hits.some(h=>h.target)
  };
}"""


def stamp():
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def geometry_after_keyboard(page):
    page.evaluate("() => new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))")
    return page.evaluate(FOCUS_STATE)


def keyboard_route(page):
    # A fresh navigation starts this journey. The actual browser handles the skip
    # link, scrolling and focus; the test never substitutes focus() for Tab/Enter.
    page.keyboard.press("Tab")
    first = geometry_after_keyboard(page)
    skip = page.locator(".skip-link")
    if not skip.evaluate("el=>document.activeElement===el"):
        return {"status":"Fail", "reason":"First Tab did not reach the skip link", "steps":[first]}
    page.keyboard.press("Enter")
    main = geometry_after_keyboard(page)
    if main.get("id") != "main":
        return {"status":"Fail", "reason":"Activating the skip link did not focus main", "steps":[first, main]}
    steps = [first, main]
    problems = []
    uncertain = []
    # This is a short initial sequence, not a complete form submission/keyboard tour.
    for step in range(6):
        page.keyboard.press("Tab")
        target = geometry_after_keyboard(page)
        steps.append(target)
        if not target.get("pageFocus"):
            break
        if target.get("hidden") or not target.get("inView"):
            problems.append({"step":step+3, "reason":"Hidden or wholly outside visible clip/viewport"})
        elif not target["exposed"]:
            # An opaque noninteractive overlay and pointer-events effects cannot be
            # distinguished with a single hit-test. Preserve as a manual case.
            uncertain.append({"step":step+3, "reason":"All five pointer probes hit another element"})
    if len(steps)<3 or not any(s.get("pageFocus") for s in steps[2:]):
        problems.append({"reason":"No sequential focus target found after main"})
    return {"status":"Fail" if problems else "Pass","steps":steps,"issues":problems,"needs_review":uncertain}


def dump(name, data):
    (OUT / name).write_text(json.dumps(data,ensure_ascii=False,indent=2)+"\n")


def main():
    if not LOCALES or any(l not in pr.LOCALES for l in LOCALES) or len(set(LOCALES)) != len(LOCALES):
        raise SystemExit("QA_A11Y_LOCALES must name unique supported locales")
    if any(w not in pr.HEIGHTS for w in WIDTHS) or len(set(WIDTHS)) != len(WIDTHS):
        raise SystemExit("QA_A11Y_WIDTHS must name unique registered viewport widths")
    OUT.mkdir(parents=True,exist_ok=True)
    shots = OUT/"screenshots"
    shots.mkdir(exist_ok=True)
    journal = OUT/"a11y-observations.jsonl"
    journal.write_text("")
    artifact = pr.fingerprint()
    build = {"sha":pr.SHA, "harness_sha":pr.HARNESS_SHA,"dist_tree_sha256":artifact}
    cases, seen = [], set()

    def write(case):
        case.update(build)
        with journal.open("a",encoding="utf-8") as f:
            f.write(json.dumps(case,ensure_ascii=False)+"\n")
        cases.append(case)

    version = None
    conf = {"axe_expected":AXE_VERSION,"wcag_tags":TAGS,
            "artifacts":"Offline Chromium. Main document only; external embedded pages excluded. Reduced motion enabled.",
            "limits":"Automated WCAG rules plus a bounded initial keyboard journey. Screen-reader announcements, unopened states and physical devices require separate checks."}
    try:
        axe_file = Path(os.environ["AXE_JS"])
        axe = axe_file.read_text(encoding="utf-8")
        conf["axe_sha256"] = hashlib.sha256(axe_file.read_bytes()).hexdigest()
        with sync_playwright() as pw:
            browser = pw.chromium.launch(executable_path=os.getenv("CHROME_PATH"),args=[
                "--disable-background-networking","--disable-quic","--host-resolver-rules=MAP * ~NOTFOUND"])
            version=browser.version
            for locale in LOCALES:
                for width in WIDTHS:
                    context=browser.new_context(viewport={"width":width,"height":pr.HEIGHTS[width]},
                                                reduced_motion="reduce",service_workers="block")
                    pr.isolate(context)
                    for path,page_id in pr.PAGE_IDS.items():
                        page=context.new_page()
                        page.set_default_timeout(12000)
                        identity=dict(page_id=page_id,route=path,locale=locale,viewport_width=width,
                                      viewport_height=pr.HEIGHTS[width],coverage="partial")
                        try:
                            pr.navigate(page,locale,path)
                            page.add_script_tag(content=axe)
                            if page.evaluate(VERSION_CHECK)!=AXE_VERSION:
                                raise RuntimeError("Injected axe version did not match pinned CI dependency")
                            scan=page.evaluate(AXE_SCAN,{"tags":TAGS})
                            expected_lang="zh-Hans" if locale=="zh" else locale
                            if scan["lang"]!=expected_lang:
                                raise RuntimeError(f"Wrong document language {scan['lang']} for {locale}")
                            for kind in ("serious","lesser","manual","passed"):
                                for issue in scan[kind]:
                                    issue["choice_ids"]=mapped(issue["id"],page_id)
                            write(dict(identity,test="axe",status="Fail" if scan["serious"] else "Pass",
                                       expected="No serious or critical automated WCAG violations in the current main-document state.",actual=scan))
                            for issue in scan["serious"]:
                                key=(page_id,issue["id"])
                                if key not in seen:
                                    seen.add(key)
                                    # The viewport screenshot documents initial page state; the
                                    # selector and HTML in the JSON identify offscreen violations.
                                    filename=f"{page_id}-{issue['id']}-{locale}-{width}.png"
                                    try:
                                        page.screenshot(path=str(shots/filename),timeout=10000)
                                    except Exception as snapshot_error:
                                        print("Screenshot unavailable",filename,str(snapshot_error)[:180])
                        except Exception as err:
                            write(dict(identity,test="axe-execution",status="Blocked",error=str(err)[:1200]))
                        try:
                            # Inspect the same route from its initial keyboard state.
                            pr.navigate(page,locale,path)
                            journey=keyboard_route(page)
                            write(dict(identity,test="keyboard",status=journey["status"],actual=journey,
                                       choice_ids=["CS-D04-1"],
                                       expected="Tab reaches skip link, Enter focuses main, subsequent targets remain in the visible clip."))
                        except Exception as err:
                            write(dict(identity,test="keyboard-execution",status="Blocked",error=str(err)[:1200]))
                        finally:
                            page.close()
                    context.close()
            browser.close()
    except Exception as err:
        write({"test":"a11y-runner","status":"Blocked","error":str(err)[:1800]})
    missing=sorted(pr.missing)
    errors=pr.errors
    counts={status:sum(c["status"]==status for c in cases) for status in ("Pass","Fail","Blocked")}
    expected=len(pr.PAGE_IDS)*len(LOCALES)*len(WIDTHS)*2
    summary={**build,**conf,"recorded_utc":stamp(),"chromium":version,"expected_checks":expected,
             "locales":LOCALES,"widths":WIDTHS,"recorded_checks":len(cases),"counts":counts,
             "blocked_external":sorted(pr.denied),"missing_packaged_paths":missing,"page_errors":errors,
             "observations_file":journal.name,"initial_viewport_screenshots":[p.name for p in sorted(shots.glob("*.png"))]}
    dump("browser-a11y.json",summary)
    print(json.dumps({k:summary[k] for k in ("sha","chromium","expected_checks","recorded_checks","counts")}))
    return bool(counts["Fail"] or counts["Blocked"] or len(cases)!=expected or missing or errors)


if __name__=="__main__":
    raise SystemExit(main())
