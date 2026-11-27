"""Bounded Chromium lab measurements. Local packaged responses, never field CWV."""
import hashlib
import importlib.util
import json
import os
import platform
import statistics
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import unquote, urlsplit

from playwright.sync_api import expect, sync_playwright

os.environ.setdefault('QA_SHA', '9db1adb2d7f84371dd7b954038a5c3ae2643a469')
os.environ.setdefault('DIST_DIR', '/tmp/s2-performance-9db-site-dist')
os.environ.setdefault('QA_OUTPUT', 'docs/sdd/SEL-2026.11.27-v1.0.0/execution/b2b-qa/performance-9db')
spec = importlib.util.spec_from_file_location('lab_base', 'tests/s2-pr-browser.py')
h = importlib.util.module_from_spec(spec)
spec.loader.exec_module(h)
SMOKE = os.getenv('S2_PERF_SMOKE') == '1'
TRIALS = 1 if SMOKE else 3
DEVICES = {'desktop': (1440, 900), 'mobile': (390, 844)}
rows = []

INIT = r"""(() => {
  const lab=window.__lab={lcp:[],shifts:[],longtasks:[],events:[],clicks:[],media:[],support:PerformanceObserver.supportedEntryTypes};
  const node=e=>e ? [e.tagName,e.id,e.className?.toString().slice(0,80)].filter(Boolean).join('.') : null;
  const watch=(type,fn,extra={})=>{if(lab.support.includes(type))new PerformanceObserver(list=>list.getEntries().forEach(fn)).observe({type,buffered:true,...extra})};
  watch('largest-contentful-paint',e=>lab.lcp.push({at:e.startTime,render:e.renderTime,load:e.loadTime,size:e.size,url:e.url,node:node(e.element)}));
  watch('layout-shift',e=>lab.shifts.push({at:e.startTime,value:e.value,recentInput:e.hadRecentInput,sources:e.sources.map(s=>({node:node(s.node),previous:s.previousRect.toJSON(),current:s.currentRect.toJSON()}))}));
  watch('longtask',e=>lab.longtasks.push({at:e.startTime,duration:e.duration,name:e.name}));
  watch('event',e=>{if(lab.events.length<60)lab.events.push({at:e.startTime,name:e.name,duration:e.duration,processingStart:e.processingStart,processingEnd:e.processingEnd,interactionId:e.interactionId})},{durationThreshold:16});
  document.addEventListener('click',e=>{const at=performance.now(),record={at,trusted:e.isTrusted,node:node(e.target)};lab.clicks.push(record);requestAnimationFrame(()=>requestAnimationFrame(()=>record.secondRAF=performance.now()))},true);
  for(const name of ['loadedmetadata','playing','waiting','stalled','error','ended'])document.addEventListener(name,e=>{
    if(e.target instanceof HTMLMediaElement)lab.media.push({name,at:performance.now(),trusted:e.isTrusted,readyState:e.target.readyState,networkState:e.target.networkState,code:e.target.error?.code??null,time:e.target.currentTime,duration:e.target.duration});
    else if(name==='error'&&e.target.tagName==='SOURCE')lab.media.push({name:'source_error',at:performance.now(),trusted:e.isTrusted,source:e.target.src});
  },true);
})();"""


def metrics(cdp):
    return {x['name']:x['value'] for x in cdp.send('Performance.getMetrics')['metrics']}


def delta(a,b):
    names=['TaskDuration','ScriptDuration','LayoutDuration','RecalcStyleDuration','LayoutCount','RecalcStyleCount']
    return {n:round(b.get(n,0)-a.get(n,0),6) for n in names}


def sample(page):
    return page.evaluate("""() => ({now:performance.now(),...window.__lab,
      paints:performance.getEntriesByType('paint').map(e=>({name:e.name,at:e.startTime})),
      navigation:performance.getEntriesByType('navigation').map(e=>({type:e.type,domInteractive:e.domInteractive,domContentLoaded:e.domContentLoadedEventEnd,load:e.loadEventEnd,responseStart:e.responseStart})),
      resources:performance.getEntriesByType('resource').map(e=>({url:e.name,kind:e.initiatorType,duration:e.duration,transfer:e.transferSize,encoded:e.encodedBodySize,decoded:e.decodedBodySize})),
      fonts:document.fonts.status,scrollWidth:document.documentElement.scrollWidth,viewport:innerWidth})""")


def cls(entries,start=0,end=float('inf')):
    relevant=[e for e in entries if not e['recentInput'] and start<=e['at']<=end]
    best=0;value=0;first=last=-1
    for e in relevant:
        if first<0 or e['at']-last>1000 or e['at']-first>5000:first=e['at'];value=0
        value+=e['value'];last=e['at'];best=max(best,value)
    return round(best,6)


def frame_calibration(page):
    intervals=page.evaluate("""async()=>{let last=performance.now();const a=[];for(let i=0;i<21;i++){await new Promise(r=>requestAnimationFrame(r));const now=performance.now();a.push(now-last);last=now;}return a.slice(1)}""")
    return {'frame_interval_ms_median':round(statistics.median(intervals),3),'frame_interval_ms_max':round(max(intervals),3),'frames':len(intervals)}


def cpu_window(page,cdp,net,selector,seconds=2):
    first=metrics(cdp);n=len(net);pos=page.locator(selector).evaluate('e=>e.scrollLeft')
    start=time.monotonic();page.wait_for_timeout(seconds*1000);elapsed=time.monotonic()-start
    last=metrics(cdp);end=page.locator(selector).evaluate('e=>e.scrollLeft')
    return {'wall_seconds':round(elapsed,4),'main_thread_metrics_delta':delta(first,last),'request_count_delta':len(net)-n,
            'scrollLeft_before':pos,'scrollLeft_after':end,'scroll_delta':round(end-pos,3)}


def hero(page,cdp,net):
    v=page.locator('.home-hero video')
    page.wait_for_function("document.querySelector('.home-hero video').readyState>=2",timeout=25000)
    before=v.evaluate("v=>({duration:v.duration,time:v.currentTime,paused:v.paused,source:v.currentSrc,decoded:[v.videoWidth,v.videoHeight],heroHeight:v.closest('.home-hero').getBoundingClientRect().height})")
    button=page.locator('.hero-player-tools .video-control')
    was_paused=v.evaluate('v=>v.paused');button.click()
    page.wait_for_function('old=>document.querySelector(".home-hero video").paused!==old',arg=was_paused,timeout=8000)
    page.wait_for_function('window.__lab.clicks.at(-1)?.secondRAF')
    click=page.evaluate('window.__lab.clicks.at(-1)');click['click_to_second_rAF_ms']=round(click['secondRAF']-click['at'],3)
    if v.evaluate('v=>v.paused'):button.click()
    page.wait_for_function('!document.querySelector(".home-hero video").paused')
    # Keep the native ending outside the 500ms recent-input CLS exclusion window.
    page.wait_for_timeout(900)
    phase_start=page.evaluate('performance.now()');start_metrics=metrics(cdp)
    v.evaluate('v=>{v.currentTime=Math.max(0,v.duration-0.4)}')
    page.wait_for_function("window.__lab.media.some(e=>e.name==='ended'&&e.trusted)&&document.querySelector('.home-hero').dataset.stage==='ended'",timeout=25000)
    page.evaluate("async()=>{await document.fonts.ready;await document.querySelector('.hero-finish-logo').decode();}")
    page.wait_for_timeout(1200)
    snap=sample(page);end=metrics(cdp)
    after=page.locator('.home-hero').evaluate("e=>({stage:e.dataset.stage,showBrand:e.dataset.showBrand,height:e.getBoundingClientRect().height,actions:[...e.querySelectorAll('.hero-actions a')].map(a=>a.textContent.trim())})")
    return {'before':before,'after':after,'phase_start':phase_start,'native_end_cls':cls(snap['shifts'],phase_start),
            'phase_cpu':delta(start_metrics,end),'interaction':click,'snapshot':snap,
            'method':'Real decoded video, seek to final0.4s, native trusted ended event; middle132s not watched continuously.'}


def partners(page,cdp,net):
    rail=page.locator('.partners-viewport').first
    rail.scroll_into_view_if_needed();page.mouse.move(1,1)
    page.wait_for_function("[...document.querySelectorAll('.partners-set:not([aria-hidden]) img')].every(i=>i.complete&&i.naturalWidth>0)",timeout=15000)
    logos=page.locator('.partners-set:not([aria-hidden]) .partner-logo').evaluate_all("nodes=>nodes.map(e=>({name:e.textContent.trim(),source:e.querySelector('img')?.currentSrc,width:e.querySelector('img')?.naturalWidth,height:e.querySelector('img')?.naturalHeight,alt:e.querySelector('img')?.alt}))")
    assert len(logos)==5 and all(i['width']>0 for i in logos),logos
    page.wait_for_timeout(500)
    visible=cpu_window(page,cdp,net,'.partners-viewport')
    # Native scroll moves the strip fully outside the viewport; no fake visibility event.
    page.evaluate("window.scrollTo({top:0,behavior:'instant'})")
    bounds=rail.bounding_box()
    if bounds and bounds['y']<page.viewport_size['height']:
        page.locator('.site-footer').scroll_into_view_if_needed()
    page.wait_for_function("(()=>{const r=document.querySelector('.partners-viewport').getBoundingClientRect();return r.bottom<=0||r.top>=innerHeight})()")
    page.wait_for_timeout(500)
    hidden=cpu_window(page,cdp,net,'.partners-viewport')
    return {'logos':logos,'visible':visible,'offscreen':hidden,'scope':'CDP main-thread duration deltas, not whole-process CPU or battery; offscreen is not background-tab emulation.'}


def run_case(browser,route,device,trial):
    width,height=DEVICES[device]
    ctx=browser.new_context(viewport={'width':width,'height':height},device_scale_factor=1,is_mobile=device=='mobile',has_touch=device=='mobile',service_workers='block',reduced_motion='no-preference')
    ctx.add_init_script(INIT);h.isolate(ctx);page=ctx.new_page();page.set_default_timeout(12000)
    cdp=ctx.new_cdp_session(page);cdp.send('Network.enable');cdp.send('Performance.enable');cdp.send('Network.setCacheDisabled',{'cacheDisabled':True});cdp.send('Emulation.setCPUThrottlingRate',{'rate':1})
    net=[];requests=[];network_errors=[];console=[];errors=[]
    cdp.on('Network.requestWillBeSent',lambda e:requests.append({'url':e['request']['url'],'type':e.get('type'),'requestId':e['requestId']}))
    cdp.on('Network.loadingFailed',lambda e:network_errors.append({'requestId':e['requestId'],'error':e['errorText'],'canceled':e.get('canceled',False)}))
    cdp.on('Network.responseReceived',lambda e:net.append({'url':e['response']['url'],'type':e['type'],'status':e['response']['status'],'mime':e['response']['mimeType'],'diskCache':e['response'].get('fromDiskCache',False),'encodedHeaderBytes':e['response'].get('encodedDataLength')}))
    page.on('console',lambda e:console.append({'type':e.type,'text':e.text[:350]}) if e.type in ['warning','error'] else None)
    page.on('pageerror',lambda e:errors.append(str(e)))
    for cache in ['fresh_context','repeat_same_context_no_http_cache']:
        net.clear();requests.clear();network_errors.clear();console.clear();errors.clear();utc=datetime.now(timezone.utc).isoformat();load=os.getloadavg();start=time.monotonic();nav_metrics=metrics(cdp);row={'route':route,'url':h.url('vi',route),'locale':'vi','device':device,'viewport':[width,height],'trial':trial,'condition':cache,'utc':utc,'host_load_1_5_15m':load}
        try:
            page.goto(h.url('vi',route),wait_until='domcontentloaded',timeout=30000)
            page.wait_for_function("Object.keys(document.querySelector('#root')||{}).some(k=>k.startsWith('__reactContainer$'))")
            page.locator('main h1').first.wait_for();page.evaluate('document.fonts.ready');page.wait_for_timeout(2000)
            initial=sample(page);initial_cpu=metrics(cdp)
            row['initial']={'navigation':initial['navigation'],'paints':initial['paints'],'lcp_latest':initial['lcp'][-1] if initial['lcp'] else None,'cls':cls(initial['shifts']),'longtask_count':len(initial['longtasks']),'longtask_ms':round(sum(t['duration'] for t in initial['longtasks']),3),'fonts':initial['fonts'],'sample_at_ms':initial['now'],'cpu_cumulative':{k:initial_cpu.get(k) for k in ['TaskDuration','ScriptDuration','LayoutDuration','RecalcStyleDuration','JSHeapUsedSize']}}
            row['initial']['cpu_since_navigation_start']=delta(nav_metrics,initial_cpu)
            row['probe']=hero(page,cdp,requests) if route=='/' else partners(page,cdp,requests)
            final=sample(page);row['layout_shifts']=final['shifts'];row['total_cls']=cls(final['shifts']);row['media_events']=final['media'];row['event_timing']=final['events'];row['frame_calibration']=frame_calibration(page)
            row['resources']=final['resources'];row['network']=list(net);row['requests']=list(requests);row['network_errors']=list(network_errors);row['console']=list(console);row['page_errors']=list(errors);row['wall_seconds']=round(time.monotonic()-start,3)
            if route=='/':row['probe'].pop('snapshot',None)
            row['status']='Measured' if not errors else 'MeasuredWithError'
        except Exception as e:row.update(status='Blocked',error=str(e)[:1600],network=list(net),console=list(console),page_errors=list(errors))
        rows.append(row);(h.OUT/'observations.jsonl').open('a').write(json.dumps(row,ensure_ascii=False)+'\n')
        print(route,device,trial,cache,row['status'],flush=True)
    ctx.close()


def failure_case(browser,device):
    width,height=DEVICES[device];ctx=browser.new_context(viewport={'width':width,'height':height},service_workers='block',reduced_motion='reduce');failed=[]
    def respond(route):
        if route.request.resource_type=='image' and '/partners/' in route.request.url:failed.append(route.request.url);return route.abort('failed')
        return h.local(route)
    ctx.route('**/*',respond);page=ctx.new_page();h.navigate(page,'vi','/partners');page.locator('.partners-strip').scroll_into_view_if_needed()
    expect(page.locator('.partners-set:not([aria-hidden]) .partner-logo--text')).to_have_count(5)
    labels=page.locator('.partners-set:not([aria-hidden]) .partner-logo').evaluate_all("nodes=>nodes.map(e=>({name:e.textContent.trim(),images:e.querySelectorAll('img').length,visible:getComputedStyle(e).visibility,box:!!e.getClientRects().length}))")
    result={'device':device,'viewport':[width,height],'status':'Pass' if all(x['images']==0 and x['box'] and x['visible']=='visible' for x in labels) else 'Fail','labels':labels,'deliberately_aborted':sorted(set(failed))};ctx.close();return result


if __name__=='__main__':
    h.OUT.mkdir(parents=True,exist_ok=True);(h.OUT/'observations.jsonl').write_text('');fingerprint=h.fingerprint()
    with sync_playwright() as pw:
        browser=pw.chromium.launch(executable_path=os.getenv('CHROME_PATH','/usr/bin/chromium'),args=['--disable-background-networking','--disable-quic','--host-resolver-rules=MAP * ~NOTFOUND','--autoplay-policy=no-user-gesture-required']);version=browser.version
        for route in ['/','/partners']:
            for device in DEVICES:
                for trial in range(1,TRIALS+1):run_case(browser,route,device,trial)
        fallback=[failure_case(browser,device) for device in DEVICES];browser.close()
    report={'build_sha':h.SHA,'dist_tree_sha256':fingerprint,'chromium':version,'os':platform.platform(),'logical_cpu_count':os.cpu_count(),'routes':['/','/partners'],'locale':'vi','viewports':DEVICES,'trials':TRIALS,'checks':rows,'fallback':fallback,'page_errors':h.errors,'missing_packaged':sorted(h.missing),'blocked_external':sorted(h.denied),
      'configuration':{'network':'Hermetic local file fulfillment; no HTTP server, CDN, public-origin latency or network throttling. No external POST allowed.','cache':'HTTP cache disabled by interception, explicitly confirmed with CDP; repeat navigation reuses browser context/renderer, not warm HTTP cache.','cpu':'CDP throttle1x; shared5-vCPU Linux host, per-run load and frame calibration retained. Not physical mobile CPU.','motion':'No preference for measurement, real automatic motion; fallback check reduced motion.','lcp':'Latest observed initial LCP after fonts-ready plus2s, before user interaction; not field p75 or whole-session final LCP.','cls':'Maximum session window: gaps<=1s and span<=5s, excludes recent-input shifts; raw entries retained.','interaction':'Trusted click to second rAF and EventTiming entries where emitted; not INP certification.'},
      'limits':'VI-only lab sample; physical device, field data, HTTP warm-cache and throttled public network remain unverified. Three fresh-context/repeat pairs per route/device; video middle skipped by native seek.'}
    (h.OUT/'measurements.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print('COMPLETE',len(rows),'measurements',len(fallback),'fallback checks; blocked',sum(r['status']=='Blocked' for r in rows),flush=True)
