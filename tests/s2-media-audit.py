"""Audit packaged Pages markup and decoded media, independent of browser geometry."""
import argparse
import hashlib
import json
import subprocess
from pathlib import Path
from urllib.parse import unquote, urlsplit
from lxml import etree, html
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SDD = ROOT / "docs/sdd/SEL-2026.11.27-v1.0.0"
OUT = SDD / "execution"
locales = ("vi", "en", "zh", "ko", "ja")


def records(path):
    return [json.loads(line) for line in path.read_text().splitlines() if line.strip()]


def cls(name):
    return "contains(concat(' ',normalize-space(@class),' '),' " + name + " ')"


def text(el):
    return " ".join(el.text_content().split())


def save(name, value):
    (OUT / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n")


def built_css(dist):
    script = """import postcss from 'postcss';import fs from 'node:fs';
const rules = [];
for(const file of process.argv.slice(1)) postcss.parse(fs.readFileSync(file,'utf8')).walkRules(rule=>{
 if(!rule.selector.match(/service-|admin-|info-policy|ed-prose-section|job-description/))return;
 const media=[]; for(let p=rule.parent;p;p=p.parent)if(p.name==='media')media.push(p.params);
 rules.push({selectors:rule.selectors,media,declarations:Object.fromEntries(rule.nodes.filter(n=>n.type==='decl').map(n=>[n.prop,n.value]))});
}); console.log(JSON.stringify(rules));"""
    output = subprocess.check_output(["node", "--input-type=module", "-e", script,
                                      *map(str, sorted((dist / "assets").glob("*.css")))], cwd=ROOT)
    return json.loads(output)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dist", type=Path, default=ROOT / "dist")
    parser.add_argument("--sha", default="b9ed5aaa17639cdeee077eac0951b20854d268ab")
    args = parser.parse_args()
    dist = args.dist.resolve()
    baseline = json.loads((OUT / "qa/choice-evidence.json").read_text())
    digest = hashlib.sha256()
    def walk(folder):
        for file in sorted(folder.iterdir(), key=lambda node: node.name):
            if file.is_dir():
                walk(file)
            elif file.is_file():
                relative = file.relative_to(dist).as_posix()
                digest.update((relative + "\0" + hashlib.sha256(file.read_bytes()).hexdigest() + "\n").encode())
    walk(dist)
    dist_hash = digest.hexdigest()
    if baseline["build_sha"] != args.sha or baseline.get("dist_tree_sha256") != dist_hash:
        raise SystemExit("The complete Pages tree does not match the specified independently attested source build.")
    pages = records(SDD / "data/pages-and-urls.jsonl")[:40]
    selections = {r["effective_code"]: r for file in sorted((SDD / "data").glob("selections-pages-*.jsonl"))
                  for r in records(file)}
    css = built_css(dist)
    assets, choices, inventory = {}, {}, {}
    doms = {}
    html_hash = hashlib.sha256()

    def asset(url):
        if url in assets:
            return assets[url]
        path = unquote(urlsplit(url).path).removeprefix("/WebMinhDuc/").lstrip("/")
        file = dist / path
        record = {"packaged": file.is_file()}
        if file.is_file():
            record.update(bytes=file.stat().st_size, sha256=hashlib.sha256(file.read_bytes()).hexdigest())
            if file.suffix.lower() == ".svg":
                node = etree.parse(str(file)).getroot()
                record.update(format="SVG", viewBox=node.get("viewBox"))
            else:
                with Image.open(file) as img:
                    img.load()
                    record.update(format=img.format, width=img.width, height=img.height)
        assets[url] = record
        return record

    def picture(node):
        url = node.get("src", "")
        source = asset(url)
        cw, ch = int(node.get("width") or 0), int(node.get("height") or 0)
        candidates = []
        for entry in node.get("srcset", "").split(","):
            if not entry.strip():
                continue
            path, width = entry.strip().rsplit(None, 1)
            info = asset(path)
            candidates.append({"path": path, "descriptor": width, "width_matches": width == str(info.get("width")) + "w"})
        ratio_ok = None
        if source.get("width") and cw and ch:
            ratio_ok = abs(source["width"] / source["height"] / (cw / ch) - 1) < .01
        return {"src": url, "alt": node.get("alt"), "slot": [cw, ch], "ratio_matches": ratio_ok,
                "loading": node.get("loading", "auto"), "sizes": node.get("sizes"), "candidates": candidates}

    def responsive(img):
        return bool(img["sizes"] and img["candidates"] and all(c["width_matches"] for c in img["candidates"])
                    and all(img["slot"]) and img["ratio_matches"] is True and assets[img["src"]]["packaged"])

    def declarations(selector, prop):
        return [{"media": r["media"], "value": r["declarations"][prop]} for r in css
                if selector in r["selectors"] and prop in r["declarations"]]

    for i, page in enumerate(pages, 1):
        code = f"P{i:02}"
        route = page["fields"]["Đường dẫn"]
        for locale in locales:
            file = dist / (locale if locale != "vi" else "") / route.lstrip("/") / "index.html"
            raw = file.read_bytes()
            html_hash.update(raw)
            doc = html.fromstring(raw.decode("utf-8"))
            doms[code, locale] = doc
            main_el = doc.xpath("//main")[0]
            images = [picture(n) for n in main_el.xpath(".//img")]
            tables = [{"caption": t.xpath("string(caption)"), "column_headers": [text(n) for n in t.xpath("thead//th")],
                       "scoped_columns": len(t.xpath("thead//th[@scope='col']")), "row_headers": [text(n) for n in t.xpath("tbody//th[@scope='row']")],
                       "wrapper": {k: t.getparent().get(k) for k in ("class", "role", "aria-label", "tabindex")}}
                      for t in main_el.xpath(".//table")]
            headers = [text(n) for n in main_el.xpath(".//h1")]
            inventory[code, locale] = {"page": code, "locale": locale, "route": route,
                       "lang": doc.get("lang"), "html_sha256": hashlib.sha256(raw).hexdigest(), "h1": headers,
                       "images": images, "tables": tables, "first_links": [
                           {"label": text(a) or a.get("aria-label"), "href": a.get("href")}
                           for a in main_el.xpath(".//a[@href]")[:6]]}

    def add(code, locale, suffix, passed, actual, steps, remaining):
        key = code + "-" + suffix
        row = selections[key]
        if row["status"] not in ("Chọn", "Chọn có điều kiện"):
            return
        entry = choices.setdefault(key, {"choice_id":key,"source_row":row["row"],"route":inventory[code, locale]["route"],
            "steps":steps,"remaining":remaining,"coverage":"partial" if remaining else "full",
            "input_type":"Parsed packaged Pages HTML, decoded local image bytes, compiled CSS as indicated",
            "test_status":"Pass","locales":[]})
        entry["locales"].append({"locale":locale, "test_status":"Pass" if passed else "Fail","actual":actual})
        if not passed:
            entry["test_status"] = "Fail"

    def marks(doc):
        return [(text(n), n.xpath("string(.//img/@src)").split("/")[-1])
                for n in doc.xpath(f"//main//*[{cls('partner-logo')} and not(ancestor::*[@aria-hidden='true'])]")]

    for (code, locale), data in inventory.items():
        n = int(code[1:])
        doc = doms[code, locale]
        images, tables = data["images"], data["tables"]
        def check(suffix, passed, actual, steps, remaining=""):
            add(code, locale, suffix, passed, actual, steps, remaining)
        body = doc.xpath("//main")[0]
        if n in (1,2,3,4,5,6,7,8,9,19,20):
            subset = images if n != 4 else [x for x in images if "/partners/" in x["src"] or "recruitment-field" in x["src"] or "/assets/" in x["src"]]
            if subset:
                files = {im["src"] for im in subset} | {c["path"] for im in subset for c in im["candidates"]}
                size = sum(assets[x].get("bytes",0) for x in files)
                actual = f"{len(subset)} rendered img; {len(files)} distinct packaged fallback and candidate files; {size} total bytes (sum of alternatives, not transferred); see per-path inventory."
                suffix = {1:"F2",2:"F4",3:"F3",4:"F3",5:"F3",6:"F3",7:"F3",8:"F3",9:"F3",19:"F2",20:"F2"}[n]
                if n != 20:
                    check(suffix, all(assets[x]["packaged"] for x in files), actual,
                        "Decode all unique packaged img candidates in the mapped main; measure each file; preserve slot, alt, loading and srcset.",
                        "Browser currentSrc/network, timing, broken image and row-specific interaction checks where applicable.")
        if n in (4,5,7):
            t = tables[0]
            style = declarations(".service-table-scroll","overflow-x")
            good = t["caption"] and t["scoped_columns"] == (5 if n==4 else 3) and len(t["row_headers"]) == 2 and t["wrapper"]["role"] == "region" and t["wrapper"]["tabindex"]=="0" and t["wrapper"]["aria-label"] and any(r["value"] == "auto" for r in style)
            details = json.dumps(t,ensure_ascii=False) + " compiled overflow-x=auto."
            check("D1" if n == 4 else "D2",good,details,"Read local scroll region, keyboard focusability, caption and table header scope; resolve compiled overflow property.","Browser AT, text enlargement, scroll and document geometry.")
            if n in (4,5):
                check("A2" if n==4 else "A3",good,details,"Inspect actual column/row header relationships in five generated tables.","Visual hierarchy and alignment.")
        if n in (4,5,6,7,8):
            target = {4:".service-planning",5:".service-responsibilities",6:".service-role",7:".service-study-modes",8:".service-consulting-list"}[n]
            rules = declarations(target, "grid-template-columns")
            mobile = [r for r in rules if any("767px" in m for m in r["media"])]
            check({4:"D2",5:"D1",6:"D2",7:"D1",8:"D2"}[n],
                  bool(mobile and body.xpath(f".//*[{cls(target[1:])}]")),
                  f"{target} present; compiled grid-template-columns: {rules}",
                  "Bind the compiled narrow-screen grid declaration to the actual localized route node.",
                  "Rendered widths at 767/768px and row-specific visual/keyboard checks.")
        if 10 <= n <= 17:
            frames = body.xpath(f".//*[{cls('job-description-block')}]/*[@data-reveal='up' and @data-reveal-frame]")
            sections = [f.xpath("string(.//h2)") for f in frames]
            good = len(frames)==3 and all(f.xpath(".//li") and not(f.xpath(".//*[@hidden or @aria-hidden='true']")) for f in frames)
            check("D4",good,str(sections),"Read exact three progressively enhanced content frames and lists in the packaged route.","Browser keyboard, reduced-motion, modal, zoom and real-device testing.")
        if n == 18:
            links = [text(a) for a in body.xpath(".//a[contains(@href,'/jobs#job-listings')]")]
            check("A1",len(data["h1"])==1 and len(links)==1 and bool(links[0]),
                  f"H1={data['h1']}; listing link={links}","Inspect the saved-jobs masthead and named route to listings.",
                  "Visual balance at the specified device sizes.")
        if n == 27:
            banner=images[0]
            check("A1",banner["src"].endswith("/recruitment-event.webp") and responsive(banner) and len(data["h1"])==1,
                  f"{banner['src']}; source {assets[banner['src']]['width']}×{assets[banner['src']]['height']}; declared {banner['slot']}; H1={data['h1']}",
                  "Compare masthead asset, intrinsic ratio and localized main heading.",
                  "Rendered crop and heading prominence.")
        if n == 32:
            hero=body.xpath(f".//*[{cls('md-page-masthead')}]")[0]
            actions = [(a.get("href"),text(a)) for a in hero.xpath(".//a[contains(@href,'#')]")]
            picture_node=hero.xpath(".//img")[0]
            check("A1",len(actions)==2 and picture_node.get("src").endswith("/learning-space.webp") and responsive(picture(picture_node)),
                  f"{picture_node.get('src')}; {actions}", "Inspect the two masthead CTA destinations, labels and decoded learning-space image.",
                  "Compare rendered arrangement and translated wrapping.")
        if n == 37:
            office_links=[(office.xpath("string(.//a[contains(@href,'maps.app.goo.gl')]/@href)"),
                           office.xpath("string(.//a[contains(@href,'maps.app.goo.gl')])"))
                          for office in body.xpath(f".//*[{cls('contact-office')}]")]
            check("F2",len(office_links)==3 and len({u for u,_ in office_links})==3 and all(u and t for u,t in office_links),
                  str(office_links),"Verify three labeled office map fallbacks with distinct destinations exist in main HTML before any map loads.",
                  "Block the embed and operate the fallback in a browser.")
        if n == 38:
            times=body.xpath(".//input[@type='radio']/@value")
            dates=body.xpath(".//input[@type='date']/@id")
            check("A2",times==["09:00","10:30","14:00","15:30"] and len(dates)==1 and bool(body.xpath(".//label[@for=$id]",id=dates[0])),
                  f"date input {dates}; adjacent radio group {times}",
                  "Confirm one labeled date field and the exact four ordered radio options.",
                  "Check rendered balance, narrow layouts and zoom.")
        if n == 19:
            banner = images[0]
            check("F1",banner["src"].endswith("/field-team.webp") and responsive(banner),
                  str((banner["src"],assets[banner["src"]]["width"],assets[banner["src"]]["height"],assets[banner["src"]]["bytes"])),
                  "Decode actual masthead and match its responsive candidate widths for each careers route.","Network timing and rail/lightbox/route regression under a controlled browser load.")
        if n == 20:
            archive = [picture(img) for img in body.xpath(f".//*[{cls('ed-archive-row')}]//img")]
            check("F2",bool(archive) and all(im["loading"] == "lazy" and responsive(im) for im in archive)
                  and all(responsive(im) for im in images),f"{len(archive)} lazy row photos; {len(images)} total responsive images. Every width descriptor checked against decoded file and declared aspect ratio.",
                  "Measure archive's actual packaged alternatives and inspect the loading attribute on each photo; inspect eager masthead/featured separately.")
        if 21 <= n <= 26:
            covers = [picture(img) for img in body.xpath(f".//img[{cls('ed-cover')}]")]
            if n in (24,26):
                empty_slot = body.xpath(f".//*[{cls('ed-story-photo')}]")
                check("F3",not covers and not empty_slot, f"{len(covers)} covers, {len(empty_slot)} cover wrappers.","Inspect text-only article for absent image and absent reserved cover wrapper.")
            else:
                check("F3",bool(covers) and all(responsive(im) for im in images),
                      f"{len(covers)} cover; {len(images)} total images; measured {sum(len(im['candidates']) for im in images)} decoded width descriptors, source sizes and file lengths.",
                      "Validate each packaged fallback, descriptor width and intrinsic ratio of article and related images.")
            headings=[text(h) for h in body.xpath(f".//*[{cls('ed-prose-section')}]/h2")]
            dates=[text(d) for d in body.xpath(".//time[@datetime]")[:1]]
            check("D4",len(headings)>=3 and len(data["h1"])==1 and bool(dates) and all(im["alt"] for im in covers),
                  " | ".join([*data["h1"],*dates,*headings[:3],*(im["alt"] for im in covers)]),
                  "Read localized heading, date, first three section headings and informative cover alt.",
                  "Rendered 899/900/901px, narrow, keyboard, zoom and translated copy review.")
        if 28 <= n <= 30:
            figs = body.xpath(f".//*[{cls('ed-gallery')}]//figure")
            info = [(x.xpath('string(.//img/@alt)'),x.xpath('string(figcaption)')) for x in figs]
            check("D4",len(info)==2 and all(a and b for a,b in info),str(info),
                  "Count labeled event gallery photos and explicit captions in the localized route.",
                  "Keyboard and reduced-motion browser interaction.")
        if n == 31:
            refs = marks(doc)
            other = [marks(doms[p,locale]) for p in ("P01","P02")]
            expected = list(zip(("Luxshare ICT","FOXCONN","SAMSUNG","JEILTECH VINA","TACU"),("luxshare.svg","foxconn.svg","samsung.svg","glovitech.webp","tacu.webp")))
            same = refs==expected
            info = str(refs)
            check("A2",same,info,"Compare each displayed label and packaged logo with the committed partner mapping.","Visual provenance review with the reference images, including JEILTECH VINA.")
            check("F2",same and all(o==refs for o in other),info,"Compare brand names, mapped asset filenames and order on Home, About and Partners in each locale.","Browser image-error refresh and CPU/network rail measurement in frozen check.")
            check("D3",same and len(body.xpath(f".//ul[{cls('partners-set')} and not(@aria-hidden='true')]"))==1,info,"Check unique exposed SSR list, real label text and names.","Hydrated duplicate strip and real assistive-technology reading.")
        if n in (33,34,35):
            hero=body.xpath(f".//*[{cls('md-page-masthead')}]")[0]
            photos=hero.xpath(".//img/@src")
            actions=[text(a) for a in hero.xpath(".//a[@href]")]
            yes = len(photos)==0 if n!=34 else any(p.endswith('/learning-space.webp') for p in photos)
            check("A2",yes and bool(actions),f"images={photos}, links={actions}","Inspect masthead asset choice and actual destination labels.",
                  "Render mobile/desktop with long copy and both form modes.")
        if n == 36:
            keys=((".admin-side","width"),(".admin-filters","grid-template-columns"),(".admin-table-wrap","overflow-x"),(".admin-demo table","min-width"))
            rules={sel:declarations(sel,p) for sel,p in keys}
            check("D1",bool(rules[".admin-side"] and rules[".admin-filters"]),str({k:rules[k] for k,_ in keys[:2]}),
                  "Read built layout rules affecting actual admin sidebar and filters.","Rendered reflow and label fit at adjacent 800px/450px cases.")
            check("D2",bool(tables and rules[".admin-table-wrap"] and rules[".admin-demo table"]),
                  str({k:rules[k] for k,_ in keys[2:]}),"Check compiled admin table overflow and minimum width against table in localized route.","Keyboard scroll, viewport geometry and measured document overflow.")
        if n in (39,40):
            levels=body.xpath(".//*[self::h1 or self::h2 or self::h3]")
            check("D1",bool(levels) and levels[0].tag=="h1" and len(data["h1"])==1 and all(el.tag=="h2" and text(el) for el in levels[1:]) and data["lang"].startswith(locale),
                  f"lang={data['lang']}; {' | '.join(text(el) for el in levels)}",
                  "Inspect document language plus entire localized article heading order.",
                  "Browser keyboard/zoom review in frozen check.")

    all_choices=sorted(choices.values(),key=lambda x:(x["choice_id"],x["source_row"]))
    for row in all_choices:
        assert len(row["locales"])==5
        row["actual"]=row["locales"][0]["actual"]+" (See all five locale records.)"
    payload={"build_sha":args.sha, "dist_tree_sha256":dist_hash,"tested_html_sha256":html_hash.hexdigest(),"artifact_input":str(args.dist.name),
          "runtime":"Python/lxml, Pillow asset decode, Node/PostCSS; static evidence only",
          "choices":all_choices}
    save("media-audit.json",payload)
    save("media-inventory.json",{"build_sha":args.sha,"dist_tree_sha256":dist_hash,"tested_html_sha256":html_hash.hexdigest(),"routes":list(inventory.values()),"assets":assets})
    failures=[r["choice_id"] for r in all_choices if r["test_status"]=="Fail"]
    print(f"{len(inventory)} route/locale HTML files; {len(assets)} unique decoded assets; {len(all_choices)} selection predicates; failed: {failures}")
    if failures:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
