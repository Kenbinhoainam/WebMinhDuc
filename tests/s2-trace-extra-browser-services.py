"""Observe service layout, Tab order and stack boundaries in the offline final build."""
import importlib.util
import json
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

spec=importlib.util.spec_from_file_location("offline",Path(__file__).with_name("s2-pr-browser.py"))
ci=importlib.util.module_from_spec(spec)
spec.loader.exec_module(ci)
out=ci.OUT
out.mkdir(parents=True,exist_ok=True)
paths={v:k for k,v in ci.PAGE_IDS.items()}
routes={4:[".service-planning",".service-process ol"],5:[".service-responsibilities"],6:[".service-role"],
        7:[".service-study-modes"],8:[".service-workflow ol",".service-process ol",".service-consulting-list"]}
columns={4:[2,5],5:[2],6:[2],7:[2],8:[3,5,3]}
states=[]
layout_js="""(sels)=>sels.map(s=>{const e=document.querySelector(s); const c=[...e.children].map(n=>{
const b=n.getBoundingClientRect();return {x:Math.round(b.x),y:Math.round(b.y),w:Math.round(b.width),
text:n.innerText.trim().slice(0,90)};});
return {selector:s,columns:getComputedStyle(e).gridTemplateColumns.trim().split(/\\s+/).length,
scroll:e.scrollWidth,client:e.clientWidth,children:c};})"""
with sync_playwright() as pw:
    with pw.chromium.launch(executable_path=os.environ.get("CHROME_PATH","/usr/bin/chromium"),args=[
            "--disable-background-networking","--disable-quic","--host-resolver-rules=MAP * ~NOTFOUND"]) as browser:
        version=browser.version
        for locale in ci.LOCALES:
            for w in (767,768):
                ctx=browser.new_context(viewport={"width":w,"height":1000},device_scale_factor=2,
                                        reduced_motion="reduce",service_workers="block")
                ci.isolate(ctx);p=ctx.new_page();p.set_default_timeout(4000)
                for i, selectors in routes.items():
                    pageid=f"P{i:02d}"; route=paths[pageid]
                    code=pageid+("-D1" if i in (5,7) else "-D2")
                    row=dict(sha=ci.SHA,locale=locale,viewport_width=w,route=route,test="service-decision-keyboard-grid",
                             choice_ids=[code],expected="Paired 767/768 grids and complete natural Tab route to the footer, DPR-2 reflow, visible ordered service text.")
                    try:
                        ci.navigate(p,locale,route)
                        grids=p.evaluate(layout_js,selectors)
                        assert all(g["columns"]==(1 if w==767 else n) and g["scroll"]<=g["client"]+2 for g,n in zip(grids,columns[i])),grids
                        for g in grids:
                            boxes=[(x["y"],x["x"]) for x in g["children"]]
                            assert boxes==sorted(boxes) and all(x["w"]>0 and x["text"] for x in g["children"]),g
                        assert p.evaluate("document.documentElement.scrollWidth<=innerWidth+1")
                        if i in (5,6):
                            assert p.locator(".service-decision dt").count()==3
                            assert all(p.locator(".service-decision dd").all_inner_texts())
                        if i==7:
                            links=p.locator(".service-overview-actions a").evaluate_all("es=>es.map(e=>e.getAttribute('href'))")
                            assert [url.split('form=')[-1] for url in links]==['F05#dang-ky','F06#dang-ky'],links
                        if locale in ("vi","ko") and i==6:
                            p.locator(selectors[0]).scroll_into_view_if_needed()
                            row["screenshot"]=f"{pageid}-{locale}-{w}.png"
                            p.screenshot(path=str(out/row["screenshot"]))
                            p.evaluate("scrollTo({top:0,behavior:'instant'})")
                        p.keyboard.press("Tab")
                        assert p.locator(".skip-link").evaluate("el=>document.activeElement===el")
                        p.keyboard.press("Enter")
                        assert p.locator("main").evaluate("el=>document.activeElement===el")
                        focus=[]
                        for step in range(128):
                            p.keyboard.press("Tab")
                            f=p.evaluate("""()=>{let e=document.activeElement,b=e.getBoundingClientRect();
                              return {tag:e.tagName,cls:e.className,name:(e.getAttribute('aria-label')||e.innerText||e.name||'').slice(0,60),
                              hidden:!!e.closest('[hidden],[inert],[aria-hidden=true]'),w:b.width,h:b.height,
                              footer:!!e.closest('footer.site-footer')||!!e.closest('body #root > footer')};}""")
                            assert not f["hidden"] and f["w"]>0 and f["h"]>0,f
                            focus.append(f)
                            if p.evaluate("!!document.activeElement.closest('#root > footer,footer .footer-shell')") or f["footer"]:
                                break
                        else:raise AssertionError("Tab sequence did not reach the footer")
                        row.update(status="Pass",actual={"grids":grids,"tab_steps":len(focus),"focused":focus})
                    except Exception as e:
                        row.update(status="Fail",error=str(e)[:1300])
                        if not row.get("screenshot"):
                            row["screenshot"]=f"failed-{pageid}-{locale}-{w}.png"
                            p.screenshot(path=str(out/row["screenshot"]))
                    states.append(row)
                    with (out/"progress.jsonl").open("a") as fp: fp.write(json.dumps(row,ensure_ascii=False)+"\n")
                ctx.close()
        data={"sha":ci.SHA,"dist_tree_sha256":ci.fingerprint(),"chromium":version,"checks":states,
              "limits":"Chromium keyboard, reduced motion, DPR-2 reflow on an intercepted package.","errors":ci.errors}
(out/"browser-results.json").write_text(json.dumps(data,ensure_ascii=False,indent=2)+"\n")
print({s:sum(r["status"]==s for r in states) for s in ("Pass","Fail")})
raise SystemExit(bool(any(r["status"]=="Fail" for r in states) or ci.errors or ci.missing))
