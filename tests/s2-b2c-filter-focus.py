"""Native keyboard focus regression for the public Jobs filter disclosure."""
from pathlib import Path
import argparse, hashlib, importlib.util, json, os, shutil, subprocess, tarfile, tempfile
from playwright.sync_api import expect, sync_playwright

def main():
    parser=argparse.ArgumentParser();parser.add_argument('archive',type=Path);options=parser.parse_args()
    root=Path(__file__).resolve().parents[1]
    output=root/'docs/sdd/SEL-2026.11.27-v1.0.0/execution'
    proof=json.loads((output/'logs/preview-paths.json').read_text())
    with options.archive.open('rb') as f:assert hashlib.file_digest(f,'sha256').hexdigest()==proof['archive_sha256']
    assert subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip()==proof['source']
    records=[]
    with tempfile.TemporaryDirectory(prefix='s2-filter-keyboard-') as d:
        with tarfile.open(options.archive) as archive:archive.extractall(d,members=[m for m in archive if m.name.startswith('dist/')],filter='data')
        os.environ.update(DIST_DIR=str(Path(d)/'dist'),QA_OUTPUT=str(output/'logs'))
        spec=importlib.util.spec_from_file_location('pr',root/'tests/s2-pr-browser.py');pr=importlib.util.module_from_spec(spec);spec.loader.exec_module(pr)
        with sync_playwright() as pw:
            browser=pw.chromium.launch(executable_path=os.getenv('CHROME_PATH') or shutil.which('chromium'),args=['--disable-background-networking','--disable-quic','--host-resolver-rules=MAP * ~NOTFOUND'])
            for width in [390,1440]:
                context=browser.new_context(viewport={'width':width,'height':900},service_workers='block')
                context.route('**/*',pr.local);page=context.new_page();pr.navigate(page,'vi','/jobs')
                trigger=page.locator('[aria-controls=jobs-more-filters]');panel=page.locator('#jobs-more-filters');select=panel.locator('select').first
                def closed():
                    expect(trigger).to_have_attribute('aria-expanded','false');expect(panel).to_have_attribute('aria-hidden','true')
                    assert panel.evaluate('e=>e.inert')
                    trigger.focus()
                    assert not select.evaluate('e=>{e.focus();return document.activeElement===e}'), 'Collapsed select accepted programmatic focus'
                    for _ in range(3):
                        page.keyboard.press('Tab')
                        assert not panel.evaluate('e=>e.contains(document.activeElement)'), 'Tab reached collapsed panel'
                closed()
                trigger.focus();page.keyboard.press('Enter');expect(trigger).to_have_attribute('aria-expanded','true');expect(panel).to_have_attribute('aria-hidden','false')
                assert not panel.evaluate('e=>e.inert')
                select.focus();expect(select).to_be_focused()
                chosen=select.select_option(index=1)[0]
                trigger.focus();page.keyboard.press('Space');closed()
                trigger.focus();page.keyboard.press('Enter');expect(select).to_have_value(chosen)
                records.append({'width':width,'chosen':chosen,'collapsed_tab_and_programmatic_focus_blocked':True,'open_focus_and_value_persisted':True})
                context.close()
            print(json.dumps({'application':proof['source'],'archive':proof['archive_sha256'],'browser':'Chromium '+browser.version,'cases':records}))
            browser.close()
if __name__=='__main__':main()
