"""Final Pages-profile Chromium measurements. Run with a verified Pages receipt and one phase.
All routes are fulfilled from that local build. No server or external transport.
"""
from pathlib import Path
import argparse, hashlib, importlib.util, json, os, shutil, subprocess, traceback
from datetime import datetime, timezone
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright, expect

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'docs/sdd/SEL-2026.11.27-v1.0.0/execution/b2c-final-pages'
SLUGS={'P33':'tu-xa-quan-tri','P34':'chinh-quy-cong-nghe','P35':'tu-xa-ke-toan'}
SLUG_MD007='chuyen-vien-tuyen-dung-bac-ninh'
TEXT={'P33':('Quản trị kinh doanh','Từ xa','kinh doanh'),'P34':('Công nghệ kỹ thuật','Chính quy','công nghệ'),'P35':('Kế toán','Từ xa','kế toán')}
GEOMETRY="""() => {
 const q=s=>document.querySelector(s),a=s=>[...document.querySelectorAll(s)], r=e=>{const b=e.getBoundingClientRect();return [b.x,b.y+scrollY,b.width,b.height].map(n=>Math.round(n*10)/10)};
 const lines=e=>{const range=document.createRange();range.selectNodeContents(e);return [...range.getClientRects()].filter(b=>b.width&&b.height).map(b=>[b.x,b.y+scrollY,b.width,b.height].map(n=>Math.round(n*10)/10))};
 const fields=a('.md-masthead-copy .md-masthead-eyebrow,.md-masthead-copy h1,.md-masthead-copy .md-masthead-description');
 const cta=a('.md-masthead-actions a'), topics=a('.education-program-detail li'), form=q('#dang-ky'), figure=q('.md-masthead-figure img');
 return {w:innerWidth,doc:document.documentElement.scrollWidth,text:fields.map(e=>({value:e.innerText,box:r(e),lines:lines(e),size:parseFloat(getComputedStyle(e).fontSize)})),
   cta:cta.map(e=>({label:e.innerText,box:r(e),href:e.getAttribute('href')})),image:figure?{src:figure.currentSrc,width:figure.naturalWidth,alt:figure.alt,box:r(figure),cap:q('.md-masthead-figure figcaption')?.innerText}:null,
   pseudoBackground:getComputedStyle(q('.md-page-masthead'),'::after').backgroundImage,topics:topics.map(e=>({value:e.innerText,box:r(e),opacity:getComputedStyle(e).opacity})), detail:r(q('.education-program-detail')), info:r(q('.education-program-detail>div')), question:r(q('.education-program-detail ul')), form:r(form),color:getComputedStyle(form).backgroundColor,
   formLeft:r(q('.education-form-layout>div')), formRight:r(q('.education-form-card')), selected:q('[name=program]')?.value};
}"""

def box_in(a,b):
    return a[0]>=b[0]-1.5 and a[0]+a[2]<=b[0]+b[2]+1.5 and a[1]>=b[1]-1.5 and a[1]+a[3]<=b[1]+b[3]+1.5

def intersects(a,b):
    return min(a[0]+a[2],b[0]+b[2])-max(a[0],b[0])>1 and min(a[1]+a[3],b[1]+b[3])-max(a[1],b[1])>1

def make(browser,pr,width):
    c=browser.new_context(viewport={'width':width,'height':880},reduced_motion='reduce',service_workers='block')
    c.route('**/*',pr.local)
    return c,c.new_page()

def screenshot(pg,file):
    pg.screenshot(path=str(OUT/file),animations='disabled')
    return file

def layout(pr,browser,code,slug,locale):
    c,pg=make(browser,pr,390);d=[]
    try:
        pr.navigate(pg,locale,'/education/'+slug+'?form=F06#dang-ky')
        pg.evaluate("scrollTo(0,0)")
        longname='ApplicantLongFileName' * 5 + '.pdf'
        file=pg.locator('#dang-ky input[type=file]')
        with pg.expect_file_chooser() as chooser:file.click()
        chooser.value.set_files([{'name':longname,'mimeType':'application/pdf','buffer':b'x'}])
        for width in [320,390,519,520,521,640,766,767,768,1440]:
            pg.set_viewport_size({'width':width,'height':880})
            pg.evaluate('()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))')
            if code=='P34':
                pg.locator('.md-masthead-figure img').evaluate("async e=>{await e.decode()}")
            g=pg.evaluate(GEOMETRY)
            assert g['doc']==g['w']==width and len(g['text'])==3,g
            eyebrow,title,desc=g['text']
            assert all(t['value'].strip() and len(t['lines'])>0 and all(line[0]>=t['box'][0]-1.5 and line[0]+line[2]<=t['box'][0]+t['box'][2]+1.5 for line in t['lines']) for t in g['text']),(width,locale,g['text'])
            assert title['size']>desc['size'] and title['size']>eyebrow['size']
            assert eyebrow['box'][1]+eyebrow['box'][3]<=title['box'][1]+1 and title['box'][1]+title['box'][3]<=desc['box'][1]+1
            if locale=='vi':
                literal,mode,topic=TEXT[code]
                assert literal in title['value'] and eyebrow['value'].casefold()==mode.casefold() and topic in desc['value'].lower(),g['text']
            assert len(g['cta'])==2 and not intersects(g['cta'][0]['box'],g['cta'][1]['box'])
            for i,cta in enumerate(g['cta']):
                assert cta['label'].strip() and cta['href'].endswith('form=F0'+str(5+i)+'#dang-ky') and cta['box'][2]>0
                assert -1<=cta['box'][0] and cta['box'][0]+cta['box'][2]<=width+1
            if code=='P34':
                img=g['image'];assert img and 'learning-space' in img['src'] and img['width']>0 and img['alt'] and img['cap'],img
                assert all(not intersects(img['box'],t['box']) for t in [*g['text'],*g['cta']])
            else:assert g['image'] is None and 'learning-space' in g['pseudoBackground'],g['pseudoBackground']
            assert g['detail'][1]+g['detail'][3]<=g['form'][1]+1 and not intersects(g['info'],g['question']) and not intersects(g['formLeft'],g['formRight'])
            assert g['color']=='rgb(238, 246, 251)' or g['color']==pg.locator('#dang-ky').evaluate("e=>{const s=document.createElement('span');s.style.backgroundColor='var(--md-surface-blue)';e.append(s);const color=getComputedStyle(s).backgroundColor;s.remove();return color}")
            assert len(g['topics'])==3
            pg.locator('.education-program-detail ul').scroll_into_view_if_needed()
            assert pg.locator('.education-program-detail ul').evaluate("e=>{for(let x=e;x;x=x.parentElement){const s=getComputedStyle(x);if(s.visibility!=='visible'||Number(s.opacity)<0.99)return false;}return true}")
            field=pg.locator('.attachment-name');expect(field).to_have_text(longname)
            label=pg.locator('select[name=program]').evaluate("e=>[...e.labels].map(l=>l.childNodes[0].textContent.trim()).join(' ')")
            assert label and pg.locator('.attachment-name').evaluate("e=>e.scrollWidth<=e.clientWidth+1")
            screenshot_file=None
            if locale=='vi' and width in [390,1440]:
                pg.evaluate('scrollTo(0,0)');screenshot_file=screenshot(pg,f'{code}-{width}-masthead.png')
                pg.locator('.education-program-detail').scroll_into_view_if_needed();screenshot(pg,f'{code}-{width}-detail.png')
            d.append({'width':width,'h1':title['value'],'mode':eyebrow['value'],'description':desc['value'],'h1_font_px':title['size'],'h1_lines':len(title['lines']),'cta_boxes':[c['box'] for c in g['cta']],'picture':g['image']['src'].split('/')[-1] if g['image'] else None,'pseudo_background':g['pseudoBackground'],'question_count':len(g['topics']),'grid_boxes':[g['info'],g['question'],g['formLeft'],g['formRight']],'form_background':g['color'],'select_label':label,'filename_wrap_height':field.bounding_box()['height'],'screenshot':screenshot_file})
        pg.set_viewport_size({'width':640,'height':450});pg.evaluate('scrollTo(0,0)')
        cdp=c.new_cdp_session(pg);cdp.send('Emulation.setPageScaleFactor',{'pageScaleFactor':2})
        zoom=pg.evaluate("()=>({scale:visualViewport.scale,visual_width:visualViewport.width,layout_width:innerWidth,heading:document.querySelector('main h1').innerText,tag:document.querySelector('.md-masthead-eyebrow').innerText})")
        assert zoom['scale']==2 and zoom['heading']==d[-1]['h1'] and zoom['tag']==d[-1]['mode']
        cdp.send('Emulation.setPageScaleFactor',{'pageScaleFactor':1})
        mode_geometry=[]
        for width in [390,1440]:
            pg.set_viewport_size({'width':width,'height':880})
            for index,mode in enumerate(['F05','F06']):
                pg.locator('.education-form-tabs button').nth(index).click()
                head=pg.locator('#dang-ky form h3');expect(head).to_be_visible()
                assert pg.locator('#dang-ky input[type=file]').count()==index
                assert pg.evaluate('document.documentElement.scrollWidth===innerWidth')
                pg.evaluate('scrollTo(0,0)');g=pg.evaluate(GEOMETRY)
                assert g['text'][1]['value']==d[-1]['h1'] and len(g['cta'])==2
                mode_geometry.append({'mode':mode,'width':width,'heading':head.inner_text(),'cta_boxes':[c['box'] for c in g['cta']]})
        return dict(page=code,locale=locale,measurements=d,zoom=zoom,modes=mode_geometry)
    finally:c.close()

def forms(pr,browser,code,slug,width):
    c,pg=make(browser,pr,width);facts=[]
    try:
        for n,firstmode in enumerate(['F05','F06']):
            path='/education/'+slug
            pr.navigate(pg,'vi',path+'?form='+firstmode)
            radio=pg.locator('.education-form-tabs button')
            form=pg.locator('#dang-ky form');select=form.locator('[name=program]')
            other='F06' if firstmode=='F05' else 'F05'
            expect(select).to_have_value(slug)
            # Keyboard activation from the masthead must send focus to the form section.
            pg.locator('.md-masthead-actions a').nth(1-n).focus();pg.keyboard.press('Enter')
            expect(pg.locator('#dang-ky')).to_be_focused()
            radio.nth(n).focus();pg.keyboard.press('Enter')
            pg.go_back();expect(radio.nth(1-n)).to_have_attribute('aria-pressed','true')
            pg.go_forward();expect(radio.nth(n)).to_have_attribute('aria-pressed','true')
            for selected in ['',next(s for s in SLUGS.values() if s!=slug)]:
                expect(select).to_have_value(slug if not facts or selected=='' else '')
                select.select_option(selected)
                form.locator('[type=submit]').focus();pg.keyboard.press('Enter')
                expect(form.locator('[name=name]')).to_be_focused()
                expect(form.locator('[name=name]')).to_have_attribute('aria-invalid','true')
                form.locator('[name=name]').fill('Qa Test');form.locator('[name=phone]').fill('123')
                form.locator('[type=submit]').focus();pg.keyboard.press('Enter')
                expect(form.locator('[name=phone]')).to_be_focused()
                form.locator('[name=phone]').fill('0912345678')
                form.locator('[type=submit]').focus();pg.keyboard.press('Enter')
                receipt=pg.locator('.education-success');expect(receipt.locator('h3')).to_be_focused()
                expect(receipt.locator('h3')).to_contain_text(firstmode)
                rid=receipt.locator('p strong').inner_text();href=receipt.locator('a').get_attribute('href')
                prefix='/WebMinhDuc/admin-demo?type='+firstmode+'&id='+rid
                assert href==prefix
                again=receipt.locator('.education-again');again.focus();pg.keyboard.press('Enter')
                expect(form.locator('[name=name]')).to_be_focused();expect(form.locator('[name=name]')).to_have_value('')
                expect(select).to_have_value(selected);expect(pg.locator('.education-success')).to_have_count(0)
                facts.append({'mode':firstmode,'selected':selected,'receipt':rid,'href':href,'retry_selected':select.input_value()})
            pg.locator('.education-program-detail a').click()
            sibling=next(s for s in SLUGS.values() if s!=slug)
            pg.locator('#programs a[href$="/'+sibling+'"]').click()
            expect(pg.locator('[name=program]')).to_have_value(sibling);expect(pg.locator('.education-success')).to_have_count(0)
        return {'page':code,'width':width,'keyboard_errors_and_receipts':facts}
    finally:c.close()

def jobs(pr,browser,width):
    c,pg=make(browser,pr,width)
    try:
        active=['MD001','MD002','MD003','MD004','MD006']
        ids=lambda:pg.locator('.jobs-grid [data-job-link]').evaluate_all('es=>es.map(e=>e.dataset.jobLink)')
        pr.navigate(pg,'vi','/job-seekers?location=impossible&status=invalid&page=999#job-listings')
        expect(pg.locator('#jobs-query')).to_be_visible()
        assert urlsplit(pg.url).path.endswith('/jobs') and 'page=999' in pg.url and pg.url.endswith('#job-listings')
        assert ids()==active and pg.locator('#jobs-location').input_value()=='' and pg.locator('#jobs-status').input_value()=='active'
        pg.reload();expect(pg.locator('.job-card')).to_have_count(5)
        edge_jobs=ids()
        before=pg.url
        results=[]
        for jid in active[:2]:
            a=pg.locator('[data-job-link='+jid+']');a.scroll_into_view_if_needed();y=pg.evaluate('scrollY')
            href=a.get_attribute('href');a.focus();pg.keyboard.press('Enter')
            expect(pg.locator('.jobs-detail-section')).to_be_visible()
            if jid=='MD001':
                dialog=pg.locator('[role=dialog]')
                pg.locator('.job-apply-button').focus();pg.keyboard.press('Enter');expect(dialog).to_be_visible()
                pg.keyboard.press('Escape');expect(dialog).to_have_count(0)
                expect(pg.locator('.job-apply-button')).to_be_focused()
            pg.go_back();expect(pg.locator('.jobs-grid [data-job-link='+jid+']')).to_be_focused()
            assert pg.url==before and abs(y-pg.evaluate('scrollY'))<=2
            results.append({'id':jid,'href':href,'before_y':y,'restore_y':pg.evaluate('scrollY')})
        pg.locator('#jobs-query').fill('nonexistent-fixture')
        expect(pg.locator('.jobs-empty')).to_be_visible();pg.locator('.jobs-filter-chip').first.click()
        expect(pg.locator('#jobs-query')).to_be_focused()
        assert ids()==active
        all_ids=[f'MD00{i}' for i in range(1,9)]
        pg.evaluate("(ids)=>localStorage.setItem('minhduc.saved-jobs.v1',JSON.stringify(ids))",all_ids)
        pr.navigate(pg,'vi','/saved-jobs?page=999')
        expect(pg.locator('.jobs-pagination [aria-current]')).to_have_text('2');assert ids()==all_ids[6:]
        pay={};tags={}
        for target in ['1','2']:
            pg.locator('.jobs-pagination').get_by_role('button',name='Trang '+target,exact=True).click()
            expect(pg.locator('.jobs-pagination [aria-current]')).to_have_text(target)
            section=pg.locator('.jobs-grid .job-card');expect(section).to_have_count(6 if target=='1' else 2)
            for row in section.all():
                id=row.locator('[data-job-link]').get_attribute('data-job-link')
                pay[id]=row.locator('.job-row-pay strong').inner_text()
                tags[id]=row.locator('.job-card-meta').inner_text()
                assert (any(k.isdigit() for k in pay[id]) if id!='MD008' else pay[id]=='Trao đổi khi tư vấn')
                expect(row.locator('[data-job-save]')).to_have_attribute('aria-pressed','true');expect(row.locator('[data-job-save]')).to_have_attribute('title','Bỏ lưu việc làm')
                info=row.locator('[data-job-link]');assert info.inner_text().strip() and info.bounding_box()['width']>0
            assert pg.evaluate("document.documentElement.scrollWidth<=innerWidth")
            screenshot(pg,f'P18-{width}-p{target}.png')
        assert list(pay)==all_ids and 'Đã đóng' in tags['MD005'] and 'Tuyển dụng nội bộ' in tags['MD007'] and 'Tuyển dụng nội bộ' in tags['MD008']
        open_saved=pg.locator('[data-job-link=MD007]')
        open_saved.scroll_into_view_if_needed();last_scroll=pg.evaluate('scrollY');saved_url=pg.url
        open_saved.click();expect(pg.locator('.jobs-detail-section')).to_be_visible()
        related=pg.locator('.jobs-related [data-job-link]').first
        expect(related).to_be_visible();related.click()
        back=pg.locator('.job-detail-back,.jobs-back-link,.job-back-link,.jobs-back').first
        if back.count():
            back.click()
        else:
            pg.go_back();pg.go_back()
        expect(pg.locator('.jobs-grid [data-job-link=MD007]').first).to_be_focused()
        assert pg.url==saved_url
        restored_scroll=pg.evaluate('scrollY');assert abs(last_scroll-restored_scroll)<=2
        # Real user interaction in a separate same-origin tab must propagate a storage event.
        other=c.new_page();pr.navigate(other,'vi','/jobs/'+SLUG_MD007)
        detail_save=other.locator('.job-summary-actions [data-job-save=MD007]')
        expect(detail_save).to_have_attribute('aria-pressed','true')
        pg.locator('[data-job-save=MD008]').click()
        assert pg.locator('.job-card [data-job-link]').count()==1
        expect(pg.locator('[data-job-save=MD007]')).to_be_focused()
        detail_save.click();expect(pg.locator('.jobs-pagination')).to_have_count(0)
        assert 'MD007' not in ids() and len(ids())==6
        assert pg.evaluate("document.activeElement.isConnected")
        cross_focus=pg.evaluate("()=>({tag:document.activeElement.tagName,job:document.activeElement.getAttribute('data-job-save'),label:document.activeElement.getAttribute('aria-label'),url:location.pathname+location.search})")
        other.close()
        while pg.locator('.job-card [data-job-save]').count():
            pg.locator('.job-card [data-job-save]').last.click()
        expect(pg.locator('.jobs-empty a')).to_be_focused()
        mast=pg.locator('.md-masthead-actions a').first
        assert mast.get_attribute('href').endswith('/jobs#job-listings')
        screenshot(pg,f'P18-{width}-empty.png')
        return {'width':width,'invalid_query_jobs':edge_jobs,'return_states':results,'mixed_saved_salaries':pay,'status_tags':tags,
                'saved_back_url':saved_url,'saved_list_scroll':[last_scroll,restored_scroll],'cross_tab_focus':cross_focus,'cross_tab':'MD007 removed on the job in tab 2; tab 1 showed six remaining jobs and no pager','last_removal_focus':'jobs-empty a','empty_cta':mast.inner_text(),'paginator':'six and two rows'}
    finally:c.close()


def main():
    ap=argparse.ArgumentParser();ap.add_argument('receipt',type=Path);ap.add_argument('phase',choices=['layout','forms','jobs','report']);ap.add_argument('--retry-failed',action='store_true');o=ap.parse_args()
    receipt=json.loads(o.receipt.read_text());src=receipt['source']
    subprocess.run(['git','cat-file','-e',src+'^{commit}'],check=True)
    OUT.mkdir(exist_ok=True)
    if o.phase=='report':
        evidence={k:json.loads((OUT/(k+'.json')).read_text()) for k in ['layout','forms','jobs']}
        assert all(d['source']==src and d['dist_sha256']==receipt['dist_tree_sha256'] for d in evidence.values())
        choices=[]
        def add(id,coverage,success,assertion,remaining):
            choices.append(dict(choice_id=id,coverage=coverage,test_status='Pass' if success else 'Fail',assertion=assertion,remaining=remaining,evidence_ref='tests/s2-b2c-final-pages.py'))
        for code in SLUGS:
            layout_rows=[x for x in evidence['layout']['cases'] if x['page']==code]
            form_rows=[x for x in evidence['forms']['cases'] if x['page']==code]
            ok=len(layout_rows)==5 and all(x['status']=='Pass' for x in layout_rows);okform=len(form_rows)==2 and all(x['status']=='Pass' for x in form_rows)
            for tail,actual,coverage,extra in [
                ('A1','Five actual localized eyebrow, H1 and full descriptions with readable title hierarchy, no overlapping boxes and distinct real F05/F06 CTAs at ten widths from 320 to 1440px.','full',''),
                ('A2','All localized mastheads retained the two separated CTAs. The technical program used a decoded learning-space figure with an illustrative caption. The distance programs supplied no inline figure, but the shared education masthead displayed the learning-space illustration as a CSS background.','full' if code=='P34' else 'partial','' if code=='P34' else 'The shared illustrative backdrop is visible without an adjoining caption on distance-program pages. Text-only presentation and image interpretation still require design review.'),
                ('A3','Facts, three questions and blue form region were ordered with measured column separation. At 390px the detail screenshot shows the floating support controls sharing the right edge with the lower question; the page scrolls past them.','partial','The persisted floating support control competes with the reading area at some scroll positions; editorial/occlusion review is still relevant.'),
                ('D1','Narrow H1 and study-mode labels fit their boxes, including at the 320px edge. A Chromium 2× visual pinch-zoom measured a 320px visual viewport within the 640px layout and retained both labels.','full',''),
                ('D3','Under reduced motion all three questions and their ancestor layers remained visible. In five languages, the select retained a visible label and a long file name wrapped in the field at all ten widths.','full','')]:
                add(code+'-'+tail,coverage,ok,actual if ok else str([r.get('error') for r in layout_rows if r['status']=='Fail'])[:440],extra)
            for tail,s,coverage,gap in [('C2','F05/F06 each preserved the original program on entry; deliberately submitted blank and alternate programs and verified each retry kept the deliberate selection.','full',''),('C3','Keyboard-only form navigation, invalid name and phone correction, both query modes, Back/Forward, typed receipt and retry reset, plus a different program through the directory.','full',''),('D2','At 520 and 767px real Chromium verified anchor, first invalid field, focused confirmation and clean retry.','partial','A physical mobile soft keyboard and its occlusion were not available.')]:
                add(code+'-'+tail,coverage,okform,s if okform else str([r.get('error') for r in form_rows if r['status']=='Fail'])[:440],gap)
        j=evidence['jobs']['cases'];okj=len(j)==2 and all(x['status']=='Pass' for x in j)
        for id,s,c,left in [
            ('P09-F2','Opened /job-seekers with invalid status/location and page 999; actual router retained query/hash and returned five valid active factory jobs after filtering and reload. Saved list with 8 fixtures clamped an oversized page to page 2.','full',''),
            ('P09-C3','Opened two listing results using the keyboard, exercised an apply dialog and Escape, returned to the same list URL/focus, and removed an empty filter. Before/after scroll coordinates recorded.','partial','A mix of valid multi-filter URLs and additional measured scroll positions is required for full row acceptance.'),
            ('P18-A1','Eight saved IDs filled two pages; no horizontal overflow, working masthead return link and distinct true-empty CTA observed at 390 and 1440px.','partial','The visual balance of long translated mastheads remains for editorial review.'),
            ('P18-A2','Read all eight row salaries over two pages at 390 and 1440px; MD001–MD007 use numeric amounts and MD008 displays the textual negotiated salary.','full',''),
            ('P18-A3','Internal and closed labels were text. Every saved toggle had an explicit Vietnamese remove title and pressed state across all eight records. After clearing both pages, focus moved to the empty CTA.','full',''),
            ('P18-C3','Page 2, original URL, focus and scroll were restored after the related detail path. A cross-tab removal clamped the rendered list to six rows but left the URL at page=2 and sent focus to BODY. Final removal focused the empty CTA.','partial','Focus recovery and the URL after the last row on a page is removed from another tab remain incomplete.')]:
            add(id,c,okj,s if okj else str([r.get('error') for r in j if r['status']=='Fail'])[:500],left)
        (OUT/'choices.json').write_text(json.dumps(dict(build_sha=src,dist_tree_sha256=receipt['dist_tree_sha256'],run_utc=datetime.now(timezone.utc).isoformat(),choices=choices),ensure_ascii=False,indent=2)+'\n');print('Choices',len(choices),flush=True);return
    os.environ.update(DIST_DIR=receipt['dist'],QA_OUTPUT=str(OUT))
    spec=importlib.util.spec_from_file_location('pr',ROOT/'tests/s2-pr-browser.py');pr=importlib.util.module_from_spec(spec);spec.loader.exec_module(pr)
    assert pr.BASE=='/WebMinhDuc' and pr.fingerprint()==receipt['dist_tree_sha256']
    results=[]
    with sync_playwright() as pw:
        browser=pw.chromium.launch(executable_path=os.getenv('CHROME_PATH') or shutil.which('chromium'),args=['--disable-background-networking','--disable-quic','--host-resolver-rules=MAP * ~NOTFOUND'])
        version=browser.version
        if o.phase=='layout':inputs=[(code,slug,l) for code,slug in SLUGS.items() for l in pr.LOCALES]
        elif o.phase=='forms':inputs=[(code,slug,w) for code,slug in SLUGS.items() for w in [520,767]]
        else:inputs=[(w,) for w in [390,1440]]
        if o.retry_failed:
            prior=json.loads((OUT/(o.phase+'.json')).read_text())
            assert prior['source']==src and prior['dist_sha256']==receipt['dist_tree_sha256'] and prior['browser']==version
            results=[c for c in prior['cases'] if c['status']=='Pass']
            failed={tuple(c['parameters']) for c in prior['cases'] if c['status']=='Fail'}
            inputs=[v for v in inputs if v in failed]
        for values in inputs:
            try:
                row={'layout':layout,'forms':forms,'jobs':jobs}[o.phase](pr,browser,*values);row['status']='Pass';print('PASS',o.phase,values,flush=True)
            except Exception as err:
                reason=traceback.format_exc()[-1500:];row={'page':values[0],'parameters':values,'status':'Fail','error':reason};print('FAIL',o.phase,values,reason,flush=True)
            results.append(row)
        browser.close()
    (OUT/(o.phase+'.json')).write_text(json.dumps({'source':src,'dist_sha256':receipt['dist_tree_sha256'],'browser':version,'cases':results},ensure_ascii=False,indent=2)+'\n')
    if any(r['status']=='Fail' for r in results):raise SystemExit(1)
if __name__=='__main__':main()
