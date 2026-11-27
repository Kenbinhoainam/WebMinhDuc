import assert from 'node:assert/strict';
import {resolve,join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {runExtra} from './s2-qa-extra.mjs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';

export async function runFlows({check,temp,locales}){
  const file=join(temp,'flows.mjs');
  await build({stdin:{contents:`export {JobsPage, JobDetailPage, SavedJobsPage, jobs} from './src/JobsPages';
    export {EducationDetailPage,educationPrograms} from './src/Education';
    export {EventsPage,EventPage,NewsPage,ArticlePage} from './src/EditorialPages';
    export {ServiceDirectory} from './src/ServiceShowcase';export {FAQ} from './src/pages/info/components';export {services} from './src/pages/info/data';export {company} from './src/company';export {articles} from './src/editorial-data';export {Header} from './src/Header';export {default as Footer} from './src/Footer';export {SupportTools} from './src/SupportTools';export {ContactPage} from './src/Contact';export {AdminDemo} from './src/AdminDemo';export {default as ConsultationPage} from './src/Consultation';export {toCsv,queueNames,sampleRecords} from './src/admin-demo-data';export {LocaleProvider,LanguageSelector} from './src/i18n';export {loadLocale,translate} from './src/i18n-runtime/catalog';
    export {getDemoSubmissions,resetDemoSubmissions,createDemoSubmission} from './src/demo-submissions';`,
    resolveDir:process.cwd(),sourcefile:'s2-qa-flows.tsx'},bundle:true,platform:'node',format:'esm',packages:'external',outfile:file,loader:{'.css':'empty'},logLevel:'silent'});
  const dom=new JSDOM('<div id="root"></div>',{url:'https://example.test/WebMinhDuc/',pretendToBeVisual:true});
  const w=dom.window,d=w.document;
  for(const key of ['window','document','navigator','HTMLElement','Element','Node','Event','FormData','File','localStorage','location','MutationObserver','requestAnimationFrame','cancelAnimationFrame'])Object.defineProperty(globalThis,key,{configurable:true,writable:true,value:w[key]});
  w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};
  globalThis.IS_REACT_ACT_ENVIRONMENT=true;
  const {act,createElement:h}=await import('react'),{createRoot}=await import('react-dom/client');
  const {MemoryRouter,Route,Routes,useLocation}=await import('react-router-dom');
  const app=await import(pathToFileURL(resolve(file)));await Promise.all(locales.map(app.loadLocale));
  const root=createRoot(d.querySelector('#root'));let iteration=0;
  const origin='/WebMinhDuc';let currentLocation;
  function LocationProbe(){currentLocation=useLocation();return null;}
  async function open(locale,url,pattern,Component){
    const basename=origin+(locale==='vi'?'':'/'+locale);
    await act(()=>root.render(h(app.LocaleProvider,{value:locale},h(MemoryRouter,{key:++iteration,basename,initialEntries:[basename+url]},h(LocationProbe),h(Routes,null,h(Route,{path:pattern,element:h(Component)}))))));
  }
  async function click(element){assert.ok(element,'Missing click target');await act(()=>{element.focus();element.click();});}
  async function frame(){await act(async()=>new Promise(resolve=>w.requestAnimationFrame(()=>w.requestAnimationFrame(resolve))));}
  async function send(form,count=1){await act(()=>{for(let i=0;i<count;i++)form.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));});await frame();}
  function checkInvalid(form){const name=form.elements.namedItem('name');assert.equal(d.activeElement,name);assert.equal(name.getAttribute('aria-invalid'),'true');const label=name.getAttribute('aria-describedby');assert.ok(label?.split(/\s+/).some(id=>d.getElementById(id)?.textContent.trim()));}
  function fill(form){
    for(const [key,value] of [['name','QA DEMO'],['phone','0900000000']]){
      const el=form.elements.namedItem(key);const set=Object.getOwnPropertyDescriptor(w.HTMLInputElement.prototype,'value').set;
      set.call(el,value);el.dispatchEvent(new w.Event('input',{bubbles:true}));el.dispatchEvent(new w.Event('change',{bubbles:true}));
    }
  }
  async function receiptQueue(locale,type,id,expectedLink){
    await open(locale,'/admin-demo?type='+type+'&id='+id,'/admin-demo',app.AdminDemo);
    await check('admin.form-to-queue.'+type,['P36-E1'],'component interaction',locale,'Receipt created by '+type+' opens with matching code, source and link ID in its filtered admin queue',()=>{
      const dialog=d.querySelector('[role=dialog]'),detail=dialog.querySelector('.admin-detail');
      assert.ok(dialog.querySelector('h2').textContent.includes(id));assert.ok(dialog.querySelector('h2').textContent.includes(type));assert.ok(detail.textContent.includes(expectedLink));
      const record=app.getDemoSubmissions().find(r=>r.id===id);assert.equal(record.type,type);assert.equal(record.linkId,expectedLink);assert.ok(detail.textContent.includes(record.source));
      const row=[...d.querySelectorAll('tbody tr')].find(tr=>tr.textContent.includes(id));assert.ok(row);assert.ok(row.textContent.includes(type));return {type,id,source:record.source,linkId:expectedLink};
    });
  }
  try{
    for(const locale of locales){
      const shared='component interaction';
      await runExtra({locale,app,open,act,click,send,fill,check,d,w,frame,h,Route,Routes});
      await open(locale,'/services','/services',app.ServiceDirectory);
      await check('service.image-fallback',['P03-F3'],shared,locale,'All five service tiles retain their exact title and destination when their photo fails or recovers',async()=>{
        const cards=[...d.querySelectorAll('.service-gallery-card')];assert.equal(cards.length,5);const results=[];
        for(const [i,card] of cards.entries()){
          let image=card.querySelector('img');const link=card.querySelector('a'),title=card.querySelector('h3'),service=app.services[i];
          await act(()=>image.dispatchEvent(new w.Event('error')));
          const original=card.querySelector('img');if(original!==image){image=original;assert.equal(image.hasAttribute('srcset'),false);await act(()=>image.dispatchEvent(new w.Event('error')));}
          assert.equal(image.hidden,true);assert.equal(title.textContent,String(app.translate(service.title,locale)));assert.ok(link.pathname.endsWith('/services/'+service.slug));
          await act(()=>image.dispatchEvent(new w.Event('load')));assert.equal(image.hidden,false);results.push({title:title.textContent,href:link.pathname});
        }
        return results;
      },'Synthetic image error and load, text and destinations verified. Decode, bandwidth and visual size require separate observations.');
      for(const [i,service] of app.services.entries()){
        const id='P0'+(4+i);
        await open(locale,'/services/'+service.slug,'/services/:slug',()=>h(app.FAQ,{questions:service.questions}));
        await check(id+'.faq',[id+'-C3','MO03-1'],shared,locale,'All three real FAQ prompts control their own answer, synchronizing expanded/inert/hidden. Rapid batched toggles leave exactly one active and preserve button focus',async()=>{
          const buttons=[...d.querySelectorAll('.info-faq button')];assert.equal(buttons.length,3);
          function verify(active){buttons.forEach((b,n)=>{const p=d.getElementById(b.getAttribute('aria-controls'));assert.equal(b.getAttribute('aria-expanded'),String(n===active));assert.equal(p.getAttribute('aria-hidden'),String(n!==active));assert.equal(p.hasAttribute('inert'),n!==active);assert.equal(p.textContent,String(app.translate(service.questions[n][1],locale)));});}
          verify(0);for(const n of [1,2,0]){await click(buttons[n]);verify(n);assert.equal(d.activeElement,buttons[n]);}
          await act(()=>{for(const n of [1,2,1]){buttons[n].focus();buttons[n].click();}});verify(1);assert.equal(d.activeElement,buttons[1]);await click(buttons[1]);verify(-1);return {service:service.slug,count:3,rapidSequence:[1,2,1],allClosed:true};
        },'Component semantics and pointer-click focus tested. Geometry and native keyboard navigation through adjacent sections require a browser.');
      }
      await open(locale,'/jobs','/jobs',app.Header);
      await check('header.drawer',['T18'],shared,locale,'Opening mobile drawer, expanding one group, and two Escape presses restore subgroup and launcher focus in order',async()=>{
        const launcher=d.querySelector('.menu-button');await click(launcher);
        const group=d.querySelector('.drawer-group-heading button');await click(group);
        const panel=d.getElementById(group.getAttribute('aria-controls'));assert.equal(group.getAttribute('aria-expanded'),'true');assert.equal(panel.getAttribute('aria-hidden'),'false');const link=panel.querySelector('a');link.focus();
        await act(()=>link.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true})));assert.equal(d.activeElement,group);assert.equal(group.getAttribute('aria-expanded'),'false');
        await act(()=>group.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true})));await frame();assert.equal(d.querySelector('.drawer-nav'),null);assert.equal(d.activeElement,launcher);return {subgroup:group.getAttribute('aria-controls'),escapeRestoresFocus:true};
      },'Launcher activated in DOM. Visibility at touch width and physical devices require browser inspection.');
      await open(locale,'/news?category=workers#news-listings','/news',app.NewsPage);
      await check('news.workers',['T08'],shared,locale,'Workers deep link lists the first and second pages of exactly its matching article slugs',async()=>{
        const expected=app.articles.filter(a=>a.category==='Dành cho người lao động').map(a=>a.slug);
        function entries(){return [...new Set([...d.querySelectorAll('.ed-archive a')].map(a=>a.pathname.split('/').pop()))];}
        assert.deepEqual(entries(),expected.slice(0,3));const second=[...d.querySelectorAll('.ed-pagination button')].find(b=>b.textContent.trim()==='2');await click(second);assert.deepEqual(entries(),expected.slice(3,6));assert.equal(d.activeElement,d.getElementById('news-listings'));return {firstPage:expected.slice(0,3),secondPage:entries()};
      });
      await check('news.pager',['P20-C1','P20-C2'],shared,locale,'Worker page 2 disables next, changing category resets page and preserves fragment; paging focuses listing and sets boundaries',async()=>{
        const controls=()=>[...d.querySelectorAll('.ed-pagination button')];
        assert.equal(d.activeElement,d.getElementById('news-listings'));assert.equal(controls().at(-1).disabled,true);assert.equal(controls()[0].disabled,false);
        await click(d.querySelectorAll('.ed-filters button')[0]);assert.equal(currentLocation.hash,'#news-listings');assert.equal(new URLSearchParams(currentLocation.search).get('page'),null);assert.equal(controls()[0].disabled,true);
        await click(controls().at(-1));assert.equal(d.activeElement,d.getElementById('news-listings'));assert.equal(controls()[0].disabled,false);
        return {initialPage:2,categoryChangeResets:true,hash:currentLocation.hash,paginationFocus:true};
      });
      await open(locale,'/jobs?status=active#job-listings','/jobs',app.LanguageSelector);
      await check('language.context',['T19'],shared,locale,'Each of the five language targets preserves the same page, filter and fragment',async()=>{
        await click(d.querySelector('.language-trigger'));
        const links=[...d.querySelectorAll('.language-panel a')];
        assert.deepEqual(links.map(a=>a.pathname+a.search+a.hash),locales.map(l=>origin+(l==='vi'?'':'/'+l)+'/jobs?status=active#job-listings'));
        assert.equal(links.filter(a=>a.getAttribute('aria-current')==='true').length,1);
        return links.map(a=>a.pathname+a.search+a.hash);
      });
      await open(locale,'/contact?form=F02#consultation','/contact',app.ContactPage);
      await check('contact.switch',['P37-C1'],shared,locale,'Both mode selections update form query and heading, and focus that heading',async()=>{
        const headings={};
        for(const type of ['F01','F02']){
          const button=d.querySelector('[data-contact-mode='+type+']');await click(button);await frame();
          assert.equal(new URLSearchParams(currentLocation.search).get('form'),type);assert.equal(button.getAttribute('aria-pressed'),'true');
          const heading=d.querySelector('#contact-form-heading');assert.equal(d.activeElement,heading);headings[type]=heading.textContent;
        }
        assert.notEqual(headings.F01,headings.F02);return headings;
      });
      await check('contact.map',['P37-C3'],shared,locale,'Every office action and tab selects its exact map CID, caption, address, locale hint and supplied directions link',async()=>{
        const cids=['10667900336702973064','16104762975771422561','1203083160994188547'];
        for(const trigger of ['.contact-office-actions a:first-child','.contact-map-tabs button']){
          const buttons=[...d.querySelectorAll(trigger)];assert.equal(buttons.length,3);
          for(const [i,button] of buttons.entries()){
            await click(button);const src=new URL(d.querySelector('#contact-map iframe').src),office=app.company.offices[i];
            assert.equal(src.searchParams.get('cid'),cids[i]);assert.equal(src.searchParams.get('hl'),locale==='zh'?'zh-CN':locale);
            assert.equal(d.querySelector('.contact-map-caption strong').textContent,String(app.translate(office.name,locale)));assert.equal(d.querySelector('.contact-map-caption div p').textContent,String(app.translate(office.address,locale)));
            assert.equal(d.querySelector('.contact-map-caption a').href,office.map);
          }
        }
        return {offices:app.company.offices.map(o=>o.name),cids};
      });
      app.resetDemoSubmissions();
      for(const record of app.sampleRecords){
        await open(locale,'/admin-demo?type='+record.type+'&id='+record.id,'/admin-demo',app.AdminDemo);
        await check('admin.query.'+record.type,['T16'],shared,locale,'Type filter selects its exact sample row and id deep link opens its receipt',()=>{
          const table=d.querySelectorAll('tbody tr');assert.equal(table.length,1);assert.ok(table[0].textContent.includes(record.id));assert.ok(d.querySelector('[role=dialog]').textContent.includes(record.id));return {type:record.type,id:record.id,rows:1};
        });
      }
      await open(locale,'/admin-demo?type=F04&id=MD-004','/admin-demo',app.AdminDemo);
      await check('admin.edit',['P36-C2'],shared,locale,'Deep-linked receipt edits its owner, status and result; closing returns to a filtered queue and reopening preserves values',async()=>{
        const [owner,status]=d.querySelectorAll('.admin-detail select'),field=d.querySelector('.admin-detail textarea');
        const nextOwner=[...owner.options].find(o=>o.value!==owner.value).value,nextStatus=[...status.options].find(o=>o.value!==status.value).value;
        await act(()=>{owner.value=nextOwner;owner.dispatchEvent(new w.Event('change',{bubbles:true}));status.value=nextStatus;status.dispatchEvent(new w.Event('change',{bubbles:true}));Object.getOwnPropertyDescriptor(w.HTMLTextAreaElement.prototype,'value').set.call(field,'QA DEMO');field.dispatchEvent(new w.Event('input',{bubbles:true}));});
        await act(()=>d.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true})));
        assert.equal(d.querySelector('[role=dialog]'),null);assert.equal(currentLocation.search,'?type=F04');await click(d.querySelector('tbody button'));
        const selects=d.querySelectorAll('.admin-detail select');assert.equal(selects[0].value,nextOwner);assert.equal(selects[1].value,nextStatus);assert.equal(d.querySelector('.admin-detail textarea').value,'QA DEMO');return {id:'MD-004',owner:nextOwner,status:nextStatus,result:'QA DEMO'};
      });
      await open(locale,'/admin-demo','/admin-demo',app.AdminDemo);
      await check('admin.cms',['T17'],shared,locale,'CMS opens and returns to queue within the same admin component',async()=>{
        const [queue,cms]=d.querySelectorAll('.admin-side button[aria-controls="admin-panel"]');await click(cms);assert.ok(d.querySelector('.admin-cms'));assert.equal(cms.getAttribute('aria-pressed'),'true');await click(queue);assert.ok(d.querySelector('tbody'));assert.equal(queue.getAttribute('aria-pressed'),'true');return {cmsOpened:true,queueRestored:true};
      });
      for(const type of ['F01','F02']){
        await open(locale,'/contact?form='+type+'#consultation','/contact',app.ContactPage);app.resetDemoSubmissions();
        await check('contact.'+type,[type==='F01'?'T09':'T10'],shared,locale,'Deep-linked form exposes expected required inputs and first error; duplicate valid submits create exactly one typed receipt',async()=>{
          const form=d.querySelector('#consultation form');assert.ok(form);const required=[...form.querySelectorAll('[required]')].map(el=>el.name);
          assert.deepEqual(required,type==='F01'?['name','phone','location','notes']:['name','phone']);await send(form);checkInvalid(form);
          await act(()=>{fill(form);if(type==='F01'){form.elements.location.value='QA';form.elements.notes.value='DEMO';}});await send(form,2);
          const rs=app.getDemoSubmissions();assert.equal(rs.length,1);assert.equal(rs[0].type,type);assert.equal(d.activeElement,d.querySelector('.form-success h3'));return {type,required,receipt:rs[0].id};
        },'Synthetic submit and focus in DOM. Device IME, mobile keyboard and network require separate observations.');
        await receiptQueue(locale,type,app.getDemoSubmissions()[0].id,'—');
      }
      await open(locale,'/jobs','/jobs',app.Footer);
      await check('footer.newsletter',['T21'],shared,locale,'Footer opens email-only dialog; email validation rejects invalid syntax, reset and status follow a valid demo submit; storage and receipt count remain unchanged',async()=>{
        const storage=JSON.stringify(w.localStorage), receipts=app.getDemoSubmissions().length;const trigger=d.querySelector('.footer-subscribe');await click(trigger);
        const form=d.querySelector('.newsletter-dialog'),input=form.querySelector('input');assert.equal(input.type,'email');assert.equal(input.required,true);input.value='invalid';assert.equal(input.validity.typeMismatch,true);input.value='qa@example.invalid';assert.equal(input.checkValidity(),true);const initial=form.querySelector('[role=status]').textContent;await send(form);assert.equal(input.value,'');assert.notEqual(form.querySelector('[role=status]').textContent,initial);assert.equal(JSON.stringify(w.localStorage),storage);assert.equal(app.getDemoSubmissions().length,receipts);
        return {emailCleared:true,persistentStorageUnchanged:true,demoReceiptsUnchanged:true};
      },'DOM state, storage and receipts verified. Network and mail delivery were not observed.');
      let called=0;await open(locale,'/jobs','/jobs',()=>h(app.SupportTools,{onConsultation:()=>called++}));
      await check('support.actions',['T20'],shared,locale,'Panel exposes tel, Zalo and Facebook, first link receives focus; Escape restores launcher, consultation invokes its callback once',async()=>{
        const button=d.querySelector('.support-launcher');await click(button);
        const links=[...d.querySelectorAll('.support-panel a')];assert.equal(links.length,3);assert.match(links[0].href,/^tel:/);assert.match(links[1].hostname,/zalo/);assert.match(links[2].hostname,/facebook/);assert.equal(d.activeElement,links[0]);await act(()=>d.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true})));assert.equal(d.activeElement,button);assert.equal(button.getAttribute('aria-expanded'),'false');await click(button);await click(d.querySelector('.support-panel button'));assert.equal(called,1);return {channels:links.map(a=>a.href),consultationCalls:called};
      },'Launcher callback and focus verified. The consultation form and overlap require separate observations.');
      for(const [idx,job] of app.jobs.entries()){
        const id='P'+(10+idx),route='/jobs/'+job.slug;
        await open(locale,route,'/jobs/:slug',app.JobDetailPage);
        await check(id+'.saved',[id+'-F2',...(job.status==='closed'?['P14-C1']:[])],'component interaction',locale,'Save and unsave the actual job ID; toggle exposes aria-pressed and persists only the ID array',async()=>{
          w.localStorage.removeItem('minhduc.saved-jobs.v1');
          const btn=d.querySelector('.job-summary [data-job-save="'+job.id+'"]');assert.equal(btn.getAttribute('aria-pressed'),'false');await click(btn);
          assert.deepEqual(JSON.parse(w.localStorage.getItem('minhduc.saved-jobs.v1')),[job.id]);assert.equal(btn.getAttribute('aria-pressed'),'true');
          await click(btn);assert.deepEqual(JSON.parse(w.localStorage.getItem('minhduc.saved-jobs.v1')),[]);assert.equal(btn.getAttribute('aria-pressed'),'false');
          return {job:job.id,saved:[job.id],afterRemove:[],pressedAfterRemove:false};
        },'Current detail session; cross-tab, entry from a saved list and reload need separate observations.');
        const state=job.internal?'T12':'T11';const type=job.internal?'F04':'F03';app.resetDemoSubmissions();
        if(job.status==='closed'){
          await check('closed.'+job.id,['P14-C2','P14-F3','T11'],'component interaction',locale,'Closed detail has no inline or bottom apply action; replacement link opens active job filter and there is no receipt',()=>{
            assert.equal(d.querySelector('.job-apply-button,.job-mobile-apply,.application-form'),null);const href=new URL(d.querySelector('.job-summary .jobs-quiet-button').href);assert.equal(href.searchParams.get('status'),'active');assert.equal(href.hash,'#job-listings');assert.equal(app.getDemoSubmissions().length,0);return {job:job.id,href:href.pathname+href.search+href.hash,receipts:0};
          });
          continue;
        }
        await check(id+'.application',[id+'-C1',id+'-C2',id+'-C3',state],'component interaction',locale,'Inline CTA opens correct job, validates required fields, duplicate submit produces one correctly scoped DEMO receipt, result receives focus and Escape restores launcher',async()=>{
          const launcher=d.querySelector('.job-apply-button');await click(launcher);const form=d.querySelector('.application-form');assert.ok(form);
          assert.equal(form.querySelector('.application-job strong').textContent,job.id);
          const fields=[...form.querySelectorAll('input')].map(el=>el.name);assert.deepEqual(fields,job.internal?['name','phone','position','email','cv']:['name','phone']);
          if(job.internal){const pos=form.elements.namedItem('position');assert.ok(pos.readOnly);assert.equal(pos.value,d.querySelector('main h1,.job-detail-intro h1').textContent);assert.equal(form.elements.namedItem('email').required,false);assert.equal(form.elements.namedItem('cv').required,false);}
          await send(form);checkInvalid(form);assert.equal(app.getDemoSubmissions().length,0);
          await act(()=>fill(form));await send(form,2);
          const records=app.getDemoSubmissions();assert.equal(records.length,1);const r=records[0];assert.match(r.id,/^DEMO-/);assert.equal(r.type,type);assert.equal(r.linkId,job.id);assert.equal(r.source,route);
          const h3=d.querySelector('.application-success h3');assert.ok(h3);assert.equal(d.activeElement,h3);
          const href=new URL(d.querySelector('.application-success a').href);assert.equal(href.searchParams.get('id'),r.id);assert.equal(href.searchParams.get('type'),type);
          await act(()=>d.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true})));assert.equal(d.querySelector('[role=dialog]'),null);assert.equal(d.activeElement,launcher);
          return {job:job.id,type,fields,receipt:r.id,source:r.source,firstErrorFocus:'name',successFocus:'h3',duplicateSubmitRecords:1,focusReturned:true};
        },'Inline CTA, synthetic submit and Escape verified. Sticky CTA, enter/space activation and physical keyboard interactions need separate observations.');
        await receiptQueue(locale,type,app.getDemoSubmissions()[0].id,job.id);
      }
      for(const [idx,prog] of app.educationPrograms.entries()){
        const id='P'+(33+idx),route='/education/'+prog.slug;
        for(const type of ['F05','F06']){
          await open(locale,route+'?form='+type+'#dang-ky','/education/:slug',app.EducationDetailPage);
          app.resetDemoSubmissions();
          await check(id+'.'+type,[id+'-C1',id+'-C2',id+'-C3',type==='F05'?'T13':'T14'],'component interaction',locale,'Program deep link opens correct mode and selected program, required failures and duplicate submit are handled, focused receipt carries this program ID, retry has no stale receipt',async()=>{
            const form=d.querySelector('#dang-ky form');assert.ok(form);const selected=form.querySelector('[name=program]');assert.equal(selected.value,prog.slug);
            const email=form.elements.namedItem('email'),file=form.elements.namedItem('document');assert.equal(!!email,type==='F06');assert.equal(!!file,type==='F06');if(file){assert.equal(file.type,'file');assert.equal(file.required,false);assert.equal(email.required,false);}
            await send(form);checkInvalid(form);await act(()=>fill(form));await send(form,2);
            const rows=app.getDemoSubmissions();assert.equal(rows.length,1);const r=rows[0];assert.equal(r.type,type);assert.equal(r.linkId,prog.slug);assert.equal(r.fields.program,prog.slug);assert.ok(r.source.includes(route));
            assert.equal(d.activeElement,d.querySelector('.education-success h3'));await click(d.querySelector('.education-again'));assert.equal(d.querySelector('.education-success'),null);assert.equal(d.querySelector('#dang-ky form [name=name]').value,'');return {program:r.linkId,type:r.type,receipt:r.id,source:r.source,duplicateSubmitRecords:1,optionalFile:!!file};
          },'Direct query, default program, validation, receipt and retry tested; native file selection, browser history, IME and physical keyboards unverified.');
          await receiptQueue(locale,type,app.getDemoSubmissions()[0].id,prog.slug);
        }
      }
      for(const [skill,state] of [['Phổ thông','T06'],['Tay nghề','T07']]){
        const route='/jobs?'+new URLSearchParams({skillLevel:skill})+'#job-listings';
        await open(locale,route,'/jobs',app.JobsPage);
        await check('jobs.query.'+state,[state,'P09-B1'],'component interaction',locale,'Skill query filters the same worker directory to exactly the expected open external IDs',()=>{
          const actual=[...d.querySelectorAll('.jobs-grid [data-job-link]')].map(a=>a.dataset.jobLink);
          const expected=app.jobs.filter(j=>j.status==='active'&&!j.internal&&j.skillLevel===skill).map(j=>j.id);
          assert.deepEqual(actual,expected);assert.ok(d.getElementById('job-listings'));assert.equal(d.querySelector('#jobs-skillLevel').value,skill);
          return {query:route,actual};
        },'Programmatic list state tested. User comprehension and real-device input remain separate.');
      }
      await open(locale,'/events/absent-s2-demo','/events/:slug',app.EventPage);
      await check('event.unknown',['T25','P28-F4','P29-F4','P30-F4'],'component interaction',locale,'An unknown event slug shows fallback heading and a return link to the local event archive',()=>{
        assert.ok(d.querySelector('h1')?.textContent.trim());assert.ok([...d.querySelectorAll('a')].some(a=>a.pathname.endsWith('/events')));assert.equal(d.querySelector('.ed-event-overview'),null);return d.querySelector('h1').textContent;
      },'Client component fallback only. No HTTP response code inferred.');
    }
  }finally{await act(()=>root.unmount());dom.window.close();}
}
