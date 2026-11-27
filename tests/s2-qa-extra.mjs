import assert from 'node:assert/strict';

export async function runExtra({locale,app,open,act,click,send,fill,check,d,w,frame,h,Route,Routes}){
  const get=sel=>d.querySelector(sel);
  const all=sel=>[...d.querySelectorAll(sel)];
  const tr=x=>String(app.translate(x,locale));
  const test=(key,ids,goal,verify,remaining='')=>check(key,ids,'component interaction',locale,goal,verify,remaining);
  async function input(element,value){
    const proto={INPUT:w.HTMLInputElement,TEXTAREA:w.HTMLTextAreaElement,SELECT:w.HTMLSelectElement}[element.tagName].prototype;
    await act(()=>{Object.getOwnPropertyDescriptor(proto,'value').set.call(element,value);for(const type of ['input','change'])element.dispatchEvent(new w.Event(type,{bubbles:true}));});
  }
  await open(locale,'/contact','/contact',app.ContactPage);
  await test('contact.office-directory',['P37-B1','P37-E3','P37-F1'],'Three office addresses, localized text and directions, map CIDs, consultation and direct channel URLs agree with company data',async()=>{
    const rows=all('.contact-office');assert.equal(rows.length,3);
    const cids=['10667900336702973064','16104762975771422561','1203083160994188547'];
    for(const [i,row] of rows.entries()){
      const office=app.company.offices[i];assert.equal(row.querySelector('h3').textContent,tr(office.name));assert.equal(row.querySelector('p').textContent,tr(office.address));assert.equal(row.querySelector('a[target]').href,office.map);
      await click(all('.contact-map-tabs button')[i]);assert.equal(new URL(get('#contact-map iframe').src).searchParams.get('cid'),cids[i]);
    }
    const urls=all('.contact-direct-links a,.contact-social-links a').map(a=>a.getAttribute('href'));
    assert.deepEqual(urls.slice(0,4),['tel:'+app.company.tel,'mailto:'+app.company.email,app.company.zalo,app.company.facebook]);
    assert.equal(urls[4],'/WebMinhDuc'+(locale==='vi'?'':'/'+locale)+'/consultation');return {urls,offices:app.company.offices,cids};
  });
  await test('contact.explanations',['P37-B3'],'Session-only submission notice and external Maps fallback are presented beside the relevant form and directions',()=>{
    const notice=get('.form-disclaimer').textContent,fallback=get('.contact-map-fallback').textContent;
    assert.equal(notice,tr('Chỉ nhập dữ liệu mẫu. Biểu mẫu tạo biên nhận trong phiên này và không gửi thông tin ra ngoài.'));assert.equal(fallback,tr('Nếu bản đồ không hiển thị, hãy mở chỉ đường trong Google Maps.'));return {notice,fallback};
  });
  await test('contact.label-counts',['P37-E1','P37-B2'],'Default F02 has two required/two optional fields; F01 has four required fields and six identifiably localized optional fields',async()=>{
    const mode=type=>get('[data-contact-mode='+type+']');assert.equal(mode('F02').getAttribute('aria-pressed'),'true');const form=()=>get('.contact-form');
    assert.deepEqual([...form().querySelectorAll('[required]')].map(x=>x.name),['name','phone']);
    const optionals=()=>[...form().querySelectorAll('label .form-optional')].map(x=>({name:x.parentElement.querySelector('input,select,textarea').name,label:x.textContent}));
    assert.deepEqual(optionals().map(x=>x.name),['email','message']);await click(mode('F01'));
    const required=[...form().querySelectorAll('[required]')].map(x=>x.name);assert.deepEqual(required,['name','phone','location','notes']);
    const fields=optionals();assert.deepEqual(fields.map(x=>x.name),['email','company','jobrole','quantity','shift','needdate']);assert.equal(new Set(fields.map(x=>x.label)).size,1);
    const label=fields[0].label;assert.match(label,new RegExp({vi:'Tùy chọn',en:'optional',zh:'选填',ko:'선택',ja:'任意'}[locale],'i'));return {required,fields};
  });
  await test('contact.quantity-payload',['P37-E2'],'F01 rejects zero, negative and decimal quantities and preserves a positive quantity and all six optional fields plus selected service in its receipt',async()=>{
    let form=get('.contact-form');app.resetDemoSubmissions();await act(()=>fill(form));
    const fields={location:'QA place',notes:'QA notes',email:'qa@example.invalid',company:'QA Company',jobrole:'QA role',quantity:'3',shift:'Đêm',needdate:'2030-05-12',service:form.elements.service.options[1].value};
    for(const [key,v] of Object.entries(fields))await input(form.elements[key],v);
    for(const v of ['0','-2','1.5']){await input(form.elements.quantity,v);await send(form);assert.equal(form.elements.quantity.getAttribute('aria-invalid'),'true');assert.equal(app.getDemoSubmissions().length,0);}
    await input(form.elements.quantity,'3');await send(form);const [record]=app.getDemoSubmissions();assert.equal(record.type,'F01');for(const [k,v] of Object.entries(fields))assert.equal(record.fields[k],v);
    return {id:record.id,invalid:['0','-2','1.5'],fields:record.fields};
  });
  await open(locale,'/contact','/contact',app.ContactPage);
  await test('contact.independent-drafts',['P37-C2'],'Switching preserves distinct F01 and F02 drafts. Invalid F02 can be corrected and the new-attempt action clears the submitted form',async()=>{
    const f=()=>get('.contact-form'),mode=t=>get('[data-contact-mode='+t+']');await input(f().elements.name,'QA F02');
    await click(mode('F01'));assert.equal(f().elements.name.value,'');await input(f().elements.name,'QA F01');await input(f().elements.location,'QA loc');
    await click(mode('F02'));assert.equal(f().elements.name.value,'QA F02');await click(mode('F01'));assert.equal(f().elements.name.value,'QA F01');assert.equal(f().elements.location.value,'QA loc');
    await click(mode('F02'));await send(f());assert.equal(f().elements.phone.getAttribute('aria-invalid'),'true');await input(f().elements.phone,'0900000000');await send(f());assert.ok(get('.form-success strong').textContent.startsWith('DEMO-'));await click(get('.form-success button'));assert.equal(f().elements.name.value,'');assert.equal(f().elements.phone.value,'');return {before:{F01:'QA F01',F02:'QA F02'},cleared:true};
  });
  const categoryLabels=['Tất cả','Dành cho người lao động','Dành cho doanh nghiệp','Góc nhân sự'];
  const featuredSets=[];
  for(const category of ['workers','employers']){
    await open(locale,'/news?category='+category+'#news-listings','/news',app.NewsPage);
    await test('news.archive.'+category,['P20-E1','P20-B1','P20-B4','P20-E2'],'Filters match four localized categories; directory and events CTA point to distinct destinations; article links match requested category across all its pages',async()=>{
      assert.deepEqual(all('.ed-filters button').map(b=>b.textContent),categoryLabels.map(tr));
      const hash=get('a.btn[href*="#news-listings"]'),events=get('.ed-directory-link');assert.equal(hash.hash,'#news-listings');assert.ok(events.pathname.endsWith('/events'));assert.notEqual(hash.textContent,events.textContent);
      featuredSets.push(all('.editorial-feature-slide a.ed-feature').map(a=>a.pathname));
      const expected=app.articles.filter(a=>a.category===categoryLabels[category==='workers'?1:2]).map(a=>a.slug),actual=[];
      for(let p=1;p<=Math.ceil(expected.length/3);p++){
        if(p>1)await click(all('.ed-pagination button').find(b=>b.textContent===String(p)));
        actual.push(...new Set(all('.ed-archive a').map(a=>a.pathname.split('/').at(-1))));
      }
      assert.deepEqual(actual,expected);return {category,slugs:actual,categories:categoryLabels.map(tr),events:events.pathname,directory:hash.href};
    });
  }
  await test('news.featured-set',['P20-B2'],'Page one displays the same two featured records for workers and employers',()=>{assert.equal(featuredSets.length,2);assert.equal(featuredSets[0].length,2);assert.deepEqual(featuredSets[0],featuredSets[1]);return featuredSets;});
  await open(locale,'/news','/news',app.NewsPage);
  await test('news.archive-summary-and-images',['P20-B3','P20-F2'],'All archive pages preserve the corresponding article excerpt, category and date. Available photographs are lazy; responsive variants, dimensions and sizes recorded',async()=>{
    const found=[],images=[];const count=Math.ceil(app.articles.length/3);
    for(let page=1;page<=count;page++){
      if(page>1)await click(all('.ed-pagination button').find(b=>b.textContent===String(page)));
      for(const row of all('.ed-archive-row')){
        const href=row.querySelector('a.ed-archive-link'),slug=href.pathname.split('/').at(-1),record=app.articles.find(a=>a.slug===slug);
        assert.equal(row.querySelector('.ed-archive-copy p').textContent,tr(record.excerpt));assert.equal(row.querySelector('.ed-meta span').textContent,tr(record.category));assert.equal(row.querySelector('time').dateTime,record.date);found.push(slug);
        const image=row.querySelector('img');assert.equal(!!image,!!record.image);if(image){assert.equal(image.loading||image.getAttribute('loading'),'lazy');assert.ok(image.src);if(image.srcset)assert.ok(image.sizes);images.push({slug,srcset:!!image.srcset,sizes:image.sizes,width:image.width,height:image.height});}
      }
    }
    assert.deepEqual(found,app.articles.map(a=>a.slug));assert.ok(images.some(i=>i.srcset));return {found,images};
  },'DOM content fidelity, loading attributes and available derivatives checked. Editorial clarity and image loading on a device need separate evaluation.');
  const NewsRoutes=()=>h(Routes,null,h(Route,{path:'/news',element:h(app.NewsPage)}),h(Route,{path:'/news/:slug',element:h(app.ArticlePage)}));
  await test('news.archive-roundtrip',['P20-C3'],'From both the featured rail and page-two archive, open an article and return to the original filtered and anchored listing',async()=>{
    const returns=[];
    for(const [path,sel] of [['/news?category=workers#news-listings','.editorial-feature-slide a'],['/news?category=workers&page=2#news-listings','.ed-archive a']]){
      await open(locale,path,'*',NewsRoutes);await click(get(sel));const back=all('.ed-pages a').find(a=>a.hash==='#news-listings'&&a.search===path.slice(path.indexOf('?'),path.indexOf('#')));assert.ok(back,'Article return link preserves '+path);await click(back);assert.ok(get('#news-listings'));returns.push(back.pathname+back.search+back.hash);
    }
    return returns;
  });
  await open(locale,'/news','/news',app.NewsPage);
  await test('news.rail-pause',['P20-C4'],'Featured rail pause/resume control exposes the appropriate translated action label after each of two activations',async()=>{
    const pause=get('.ed-feature-pause');assert.ok(pause);assert.equal(pause.hidden,false);const stop=tr('Tạm dừng chuyển bài'),resume=tr('Tiếp tục chuyển bài');assert.equal(pause.textContent,stop);await click(pause);assert.equal(pause.textContent,resume);await click(pause);assert.equal(pause.textContent,stop);return {labels:[stop,resume,stop],track:pause.getAttribute('aria-controls')};
  },'DOM presence and state tested; visual visibility and elapsed-time cycling require separate evidence.');
  await open(locale,'/consultation','/consultation',app.ConsultationPage);app.resetDemoSubmissions();
  await test('consultation.state-and-receipt',['P38-F1','P38-E1','P38-E2','P38-E3','P38-C3'],'Date/radio choice and F02 validity gate submission. Editing time preserves the draft. Final time is displayed beside the matching ID while the F02 record holds contact fields only; restarting clears the selection',async()=>{
    let form=get('.consultation-choose');const date=form.querySelector('input[type=date]');await send(form);assert.equal(date.getAttribute('aria-invalid'),'true');await input(date,'2035-11-27');await send(form);assert.equal(form.querySelector('fieldset').getAttribute('aria-invalid'),'true');const slots=all('.consultation-times input');await click(slots[0]);await send(form);
    assert.equal(get('[data-contact-mode]'),null);const contact=get('.contact-form');assert.deepEqual([...contact.querySelectorAll('input,textarea')].map(x=>x.name),['name','phone','email','message']);await send(contact);assert.equal(app.getDemoSubmissions().length,0);
    await act(()=>fill(contact));await click(get('.consultation-summary button'));form=get('.consultation-choose');await click(all('.consultation-times input')[1]);await send(form);assert.equal(get('.contact-form [name=name]').value,'QA DEMO');await send(get('.contact-form'));
    const [record]=app.getDemoSubmissions();assert.equal(record.type,'F02');assert.equal(record.source,'/consultation');assert.deepEqual(record.fields,{email:'',message:''});assert.equal(record.linkId,'—');assert.equal(record.detail,'');
    const [summary,id]=all('.consultation-success strong').map(x=>x.textContent);assert.match(summary,/10:30/);assert.equal(id,record.id);assert.ok(get('.consultation-back').pathname.endsWith('/contact'));await click(get('.consultation-success button'));assert.equal(get('input[type=date]').value,'');assert.equal(get('.consultation-times input:checked'),null);
    return {summary,id,type:record.type,fields:record.fields,reset:true};
  },'DOM, displayed confirmation and payload verified. External calendar/network activity was not instrumented.');
  await test('admin.csv-escaping',['P36-F2'],'UTF-8 BOM, double quotes, CRLF, embedded newlines, and spreadsheet formula prefixes are escaped in CSV output',()=>{
    const data=['=1+1','+2','-1','@SUM','\tval','\rnew','  =f'].map((s,i)=>({...app.sampleRecords[0],name:s,detail:'note "Q"\n'+i}));const csv=app.toCsv(data);
    assert.deepEqual([...new TextEncoder().encode(csv).slice(0,3)],[239,187,191]);assert.equal(csv.split('\r\n').length,8);
    data.forEach((r,i)=>{assert.ok(csv.includes('"\''+r.name+'"'));assert.ok(csv.includes('"note ""Q""\n'+i+'"'));});return {prefixes:data.map(x=>x.name),bom:[239,187,191],rows:data.length};
  });
  await open(locale,'/admin-demo','/admin-demo',app.AdminDemo);
  await test('admin.queue-names',['P36-B1'],'All six queue codes expose their actual localized names in accessible labels',()=>{
    const names=all('.admin-queues button[aria-label]').map(b=>b.getAttribute('aria-label'));assert.deepEqual(names,Object.entries(app.queueNames).map(([k,v])=>k+' · '+tr(v)));return names;
  });
  await test('admin.filtered-queue',['P36-C1'],'Filter F04 by source, owner, status and each of exact ID, name and phone; contradictory status yields an empty table',async()=>{
    const record=app.sampleRecords[3];await click(get('.admin-queues button[aria-label^="F04"]'));
    const [source,owner,status]=all('.admin-filters select');for(const [el,val] of [[source,record.source],[owner,record.owner],[status,record.status]])await input(el,val);
    const search=get('.admin-filters input');for(const v of [record.id,record.name,record.phone]){await input(search,v);const rows=all('tbody tr');assert.equal(rows.length,1);assert.ok(rows[0].textContent.includes(record.id));}
    await input(status,[...status.options].find(o=>o.value!=='Tất cả'&&o.value!==record.status).value);assert.equal(all('tbody tr').length,0);assert.ok(get('.admin-empty'));return {type:record.type,source:record.source,owner:record.owner,status:record.status,id:record.id};
  });
  app.resetDemoSubmissions();
  const fake=(name,phone,linkId)=>app.createDemoSubmission({type:'F03',name,phone,linkId,source:'/jobs/demo',detail:'demo'});
  const a=fake('QA one','090 000 0000','MD001'),b=fake('QA two','090-000-0000','MD001'),other=fake('QA third','0900000000','MD002');
  await open(locale,'/admin-demo?type=F03&id='+b.id,'/admin-demo',app.AdminDemo);
  await test('admin.duplicate-and-kpis',['P36-E2','P36-E3'], 'Nonblocking F03 warning names only the matching normalized phone and job. Editing owner/status/result updates its row, KPI and reopened receipt',async()=>{
    const text=get('.admin-warning').textContent;assert.ok(text.includes(a.id));assert.ok(!text.includes(other.id));
    const kpis=()=>all('.admin-kpis strong').map(v=>Number(v.textContent));const before=kpis();
    const [owner,status]=all('.admin-detail select');const nextOwner=owner.options[1].value;await input(owner,nextOwner);await input(status,'Đã đóng');await input(get('.admin-detail textarea'),'QA done');
    await act(()=>d.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true})));
    const after=kpis();assert.deepEqual(after,[before[0],before[1]-1,before[2],before[3]+1]);const row=all('tbody tr').find(x=>x.textContent.includes(b.id));
    assert.ok(row.textContent.includes(tr(nextOwner)));assert.ok(row.textContent.includes(tr('Đã đóng')));await click(row.querySelector('button'));assert.equal(get('.admin-detail textarea').value,'QA done');
    return {id:b.id,matching:a.id,excluded:other.id,before,after,result:'QA done'};
  });
  await open(locale,'/admin-demo','/admin-demo',app.AdminDemo);
  await test('admin.cms-workflow',['P36-C4'],'CMS retains the saved draft and its distinct demo publication response; F03 same-job warning is checked separately',async()=>{
    const cms=all('.admin-side button[aria-controls="admin-panel"]')[1];await click(cms);const panel=get('.admin-cms');const [save,publish]=panel.querySelectorAll('button');await input(panel.querySelector('textarea'),'QA draft');await click(save);
    const status=panel.querySelector('[role=status] strong'),draft=status.textContent;assert.equal(draft,tr('Đã lưu bản nháp mẫu'));assert.ok(panel.textContent.includes('QA draft'));await click(publish);assert.equal(status.textContent,tr('Đã xuất bản mẫu'));assert.notEqual(status.textContent,draft);return {draft,published:status.textContent,saved:'QA draft'};
  },'CMS portion verified, F03 warning is recorded in admin.duplicate-and-kpis.');
  await test('admin.csv-filter-reset',['P36-C3'],'Export uses exactly the filtered records. Reset deletes session submissions, restores the six original rows and resets the CMS draft/publication',async()=>{
    const [queue,cms]=all('.admin-side button[aria-controls="admin-panel"]');await click(queue);
    await click(get('.admin-queues button[aria-label^="F03"]'));
    const expectedRows=all('tbody tr').map(row=>row.querySelector('td small').textContent.split(' · ')[0]);assert.ok(expectedRows.includes(b.id));
    let exported,filename;const oldCreate=URL.createObjectURL,oldRevoke=URL.revokeObjectURL,oldClick=w.HTMLAnchorElement.prototype.click;
    try{URL.createObjectURL=blob=>{exported=blob;return 'blob:qa';};URL.revokeObjectURL=()=>{};w.HTMLAnchorElement.prototype.click=function(){filename=this.download;};
      await click(all('.admin-card-head button')[0]);
    }finally{URL.createObjectURL=oldCreate;URL.revokeObjectURL=oldRevoke;w.HTMLAnchorElement.prototype.click=oldClick;}
    assert.equal(filename,'minh-duc-du-lieu-mau.csv');const csv=await exported.text();const ids=csv.split('\r\n').slice(1).map(line=>/^"([^"]+)"/.exec(line)[1]);assert.deepEqual(ids,expectedRows);
    await click(all('.admin-card-head button')[1]);await click(get('.admin-reset-actions .btn:not(.btn-secondary)'));assert.equal(app.getDemoSubmissions().length,0);assert.deepEqual(all('tbody tr').map(row=>row.querySelector('td small').textContent.split(' · ')[0]),app.sampleRecords.map(r=>r.id));
    await click(cms);assert.notEqual(get('.admin-cms textarea').value,'QA draft');assert.equal(get('.admin-cms [role=status] strong').textContent,tr('Bản nháp mẫu'));return {filename,exported:ids,restored:app.sampleRecords.map(r=>r.id),session:0};
  });
  app.resetDemoSubmissions();

}
