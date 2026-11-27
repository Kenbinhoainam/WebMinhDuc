"""Exercise keyboard fragment navigation and local table panning in the packaged build."""
import argparse
import importlib.util
import json
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

EXEC=Path("docs/sdd/SEL-2026.11.27-v1.0.0/execution")
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument("--sha",required=True)
parser.add_argument("--dist",required=True)
parser.add_argument("--edges-only",action="store_true",help="Check the paired 699/700/701, 767/768 or 899/900/901 cutoffs instead.")
parser.add_argument("--output",type=Path,default=EXEC/"browser/keyboard-zoom")
args=parser.parse_args()
args.output.mkdir(parents=True,exist_ok=True)
os.environ.update(DIST_DIR=str(Path(args.dist).resolve()),QA_OUTPUT=str(args.output.resolve()),QA_SHA=args.sha)
script=Path(__file__).with_name("s2-pr-browser.py")
spec=importlib.util.spec_from_file_location("offline",script)
ci=importlib.util.module_from_spec(spec)
spec.loader.exec_module(ci)
paths={page:route for route,page in ci.PAGE_IDS.items()}
names={**{f"P{i}":"article" for i in range(21,27)},**{f"P{i}":"event" for i in range(28,31)},
       "P04":"table","P05":"table","P07":"table"}
cases=[]
screens=[]
settle="()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))"
focus_info="""(id)=>{
 const h=document.getElementById(id),header=document.querySelector('.site-header'),r=h.getBoundingClientRect();
 const box=header.getBoundingClientRect(),visible=box.bottom>0 && getComputedStyle(header).visibility!=='hidden';
 return {id,active:document.activeElement.id,heading:h.tagName,top:r.top,bottom:r.bottom,
    headerBottom:visible?Math.max(0,box.bottom):0,viewportHeight:innerHeight,viewportWidth:innerWidth,
    documentWidth:document.documentElement.scrollWidth,width:r.width,overflow:h.scrollWidth-h.clientWidth};
}"""
def inspect_anchors(page,kind):
    if kind=="article":
        summary=page.locator(".ed-toc summary")
        summary.focus()
        page.keyboard.press("Enter")
        assert page.locator(".ed-toc details").evaluate("e=>e.open")
        links=page.locator(".ed-toc a")
        page.keyboard.press("Tab")
        assert links.first.evaluate("e=>e===document.activeElement")
    else:
        links=page.locator(".ed-anchor-nav a")
        assert links.count()==5
    states=[]
    for i in range(links.count()):
        link=links.nth(i)
        link.focus()
        assert link.evaluate("e=>e===document.activeElement")
        key=link.get_attribute("href").split("#")[-1]
        page.keyboard.press("Enter")
        page.wait_for_function("id=>location.hash.slice(1)===id && document.activeElement.id===id",arg=key,timeout=2200)
        page.evaluate(settle)
        h=page.evaluate(focus_info,key)
        states.append(h)
        # A last heading can be beyond the normal scroll limit only at the bottom;
        # it still needs to be in the viewport and outside the sticky header.
        assert h["heading"]=="H2" and h["top"]>=h["headerBottom"]-1 and h["top"]<h["viewportHeight"],h
        assert h["documentWidth"]<=h["viewportWidth"]+1 and h["overflow"]<=2,h
    if kind=="event":
        agenda=page.locator(".ed-agenda-entry").evaluate_all("""els=>els.map(e=>{
          const [time,description]=e.children,t=time.getBoundingClientRect(),d=description.getBoundingClientRect();
          return {columns:getComputedStyle(e).gridTemplateColumns.trim().split(/\\s+/).length,clock:time.dateTime,
                  description:description.textContent.trim(),ordered:innerWidth<=700?d.top>=t.bottom-2:d.left>=t.right-2};
        })""")
        assert len(agenda)>0 and all(item["clock"] and item["description"] and item["ordered"] for item in agenda),agenda
        assert all(item["columns"]==(1 if page.viewport_size["width"]<=700 else 2) for item in agenda),agenda
        return dict(anchors=states,agenda=agenda)
    return dict(anchors=states)

def inspect_tables(page):
    entries=[]
    for region in page.locator(".service-table-scroll").all():
        region.focus()
        assert region.evaluate("e=>document.activeElement===e")
        # Text-only accessibility override. Derive absolute sizes before modifying any table cell.
        before=region.evaluate("""e=>{const ns=[...e.querySelectorAll('thead th,tbody td,tbody th,caption')];
          const px=ns.map(n=>parseFloat(getComputedStyle(n).fontSize));
          ns.forEach((n,i)=>n.style.setProperty('font-size',2*px[i]+'px','important'));return px[0];}""")
        page.evaluate(settle)
        item=region.evaluate("""e=>{const th=[...e.querySelectorAll('thead th[scope=col]')];
          return {name:e.getAttribute('aria-label'),caption:e.querySelector('caption').textContent,
                  headers:th.map(n=>n.textContent),firstPx:parseFloat(getComputedStyle(th[0]).fontSize),
                  max:e.scrollWidth-e.clientWidth,width:e.clientWidth,documentWidth:document.documentElement.scrollWidth};}""")
        assert region.get_attribute("tabindex")=="0" and item["name"] and item["caption"] and all(item["headers"]),item
        assert abs(item["firstPx"]-before*2)<0.1 and item["documentWidth"]<=page.viewport_size["width"]+1,item
        if item["max"]>1:
            # Browser keyboard scroll is normally animated, even on reduced-motion pages.
            region.press("ArrowRight");page.wait_for_function("e=>e.scrollLeft>0",arg=region.element_handle(),timeout=1800)
            page.keyboard.down("End");page.keyboard.up("End")
            for _ in range(50):
                if region.evaluate("e=>e.scrollLeft>=e.scrollWidth-e.clientWidth-2"):break
                region.press("ArrowRight")
                page.wait_for_timeout(15)
            page.wait_for_function("e=>e.scrollLeft>=e.scrollWidth-e.clientWidth-2",arg=region.element_handle(),timeout=1800)
            item["rightmost"]=region.evaluate("e=>e.scrollLeft")
            for _ in range(50):
                if region.evaluate("e=>e.scrollLeft<=1"):break
                region.press("ArrowLeft")
                page.wait_for_timeout(15)
            page.wait_for_function("e=>e.scrollLeft<=1",arg=region.element_handle(),timeout=1800)
            assert page.evaluate("scrollX")==0 and region.evaluate("e=>document.activeElement===e")
        page.keyboard.press("Tab")
        assert region.evaluate("e=>document.activeElement!==e")
        entries.append(item)
    assert entries
    return dict(tables=entries)

out_path=args.output/"observations.jsonl"
out_path.write_text("")
with sync_playwright() as pw:
    with pw.chromium.launch(executable_path=os.environ.get("CHROME_PATH","/usr/bin/chromium"),
            args=["--disable-background-networking","--disable-quic","--host-resolver-rules=MAP * ~NOTFOUND"]) as browser:
        version=browser.version
        for locale in ci.LOCALES:
            for width in ((699,700,701,767,768,899,900,901) if args.edges_only else (390,900)):
                ctx=browser.new_context(viewport=dict(width=width,height=844),device_scale_factor=2,
                                        reduced_motion="reduce",service_workers="block")
                ci.isolate(ctx)
                page=ctx.new_page()
                page.set_default_timeout(4000)
                for page_id,kind in names.items():
                    edges={"article":(899,900,901),"event":(699,700,701),"table":(767,768)}
                    if args.edges_only and width not in edges[kind]:
                        continue
                    route=paths[page_id]
                    case=dict(sha=args.sha,page_id=page_id,locale=locale,route=route,viewport_width=width,
                              device_scale_factor=2,physical_width=width*2,reduced_motion=True,
                              test="keyboard-"+kind,choice_ids=[page_id+("-D3" if kind=="article" else "-D1" if page_id=="P04" else "-D2")])
                    try:
                        ci.navigate(page,locale,route)
                        assert page.evaluate("devicePixelRatio===2 && matchMedia('(prefers-reduced-motion: reduce)').matches")
                        case["actual"]=inspect_tables(page) if kind=="table" else inspect_anchors(page,kind)
                        case["status"]="Pass"
                    except Exception as err:
                        case.update(status="Fail",error=str(err)[:2400])
                    if case["status"]=="Fail" and not any(s.startswith(page_id+"-") for s in screens) or locale=="vi" and width==390:
                        name=f"{page_id}-{locale}-{width}.png"
                        page.screenshot(path=str(args.output/name),timeout=6000)
                        case["screenshot"]=name
                        screens.append(name)
                    cases.append(case)
                    with out_path.open("a") as out: out.write(json.dumps(case,ensure_ascii=False)+"\n")
                ctx.close()
        report=dict(sha=args.sha,dist_tree_sha256=ci.fingerprint(),chromium=version,
                    limits="390/900 CSS px at DPR 2 represents reflow at 200% of physical 780/1800px; the table tests additionally double the measured cell font size. No physical-device test.",
                    blocked_external=sorted(ci.denied),missing=sorted(ci.missing),page_errors=ci.errors,checks=cases)
(args.output/"browser-results.json").write_text(json.dumps(report,indent=2,ensure_ascii=False)+"\n")
print({s:sum(r["status"]==s for r in cases) for s in ("Pass","Fail")},len(cases),args.sha,flush=True)
for row in cases:
    if row["status"]=="Fail":
        print(row["page_id"],row["locale"],row["viewport_width"],row.get("error","")[:160])
raise SystemExit(bool(any(r["status"]=="Fail" for r in cases) or ci.missing or ci.errors))
