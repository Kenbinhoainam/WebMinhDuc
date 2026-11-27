// Inject into a settled, local Pages document. Never scroll, focus or modify app state.
(() => {
  window.s2MeasureLayout = ({ pageId, locale }) => {
    const width = window.innerWidth;
    const viewport = { width, height: window.innerHeight, clientWidth: document.documentElement.clientWidth };
    const round = value => Math.round(value * 10) / 10;
    const all = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
    const one = selector => document.querySelector(selector);
    const css = el => getComputedStyle(el);
    const rect = el => {
      const r = el.getBoundingClientRect();
      return { x: round(r.x), y: round(r.y), w: round(r.width), h: round(r.height) };
    };
    const rendered = el => el && el.getClientRects().length && css(el).visibility !== 'hidden' && !el.closest('[hidden],[inert]');
    const visible = selector => all(selector).filter(rendered);
    const name = el => (el.getAttribute('aria-label') || el.innerText || el.value || '').trim().replace(/\s+/g, ' ').slice(0, 140);
    const clipped = el => el.clientWidth > 0 && (el.scrollWidth > el.clientWidth + 2 ||
      (el.clientHeight > 0 && el.scrollHeight > el.clientHeight + 2 && /hidden|clip/.test(css(el).overflowY)));
    const overlap = (a,b) => a.x < b.x+b.w-1 && b.x < a.x+a.w-1 && a.y < b.y+b.h-1 && b.y < a.y+a.h-1;
    const shared = 'Single rendered state/viewport. Reconcile all locales, required widths, interaction and device checks.';
    const result = [];
    const record = (id, expected, actual, pass, remaining = shared) => {
      result.push({ choice_id: id, page_id: pageId, locale, viewport, expected, actual, coverage: 'partial',
        remaining, test_status: pass == null ? 'Not Run' : pass ? 'Pass' : 'Fail' });
    };
    const page = (suffix, ...args) => record(pageId + '-' + suffix, ...args);
    const id = Number(pageId.slice(1));
    if (!Number.isInteger(id) || id < 1 || id > 40) return result;

    // Element dimensions exclude shadows. Offscreen-but-laid-out sections are measurable.
    // Entry transforms can shift both ends of a rect together; use local sizes for fit checks.
    const headingSelector = id >= 3 && id <= 17
      ? 'main h1, .job-card h3, .job-card h2, .service-card-title'
      : 'main h1';
    const headings = visible(headingSelector);
    if (headings.length) {
      const bad = headings.filter(clipped).map(el => ({ name: name(el), rect: rect(el), scrollWidth: el.scrollWidth }));
      const capped = headings.filter(el => css(el).textOverflow === 'ellipsis' || +css(el).webkitLineClamp > 0).map(name);
      record('CS-A04-4', 'No horizontal text overflow or explicit ellipsis/clamp on rendered H1 and service/job titles.',
        { count: headings.length, clipped:bad, truncatedByStyle:capped }, !bad.length && !capped.length,
        'Other CTA labels, overlap between siblings and editorial line breaks.');
    }

    const nav = one('.site-header .desktop-nav');
    const menu = one('.site-header .menu-button');
    if (nav && menu) {
      const desktop = matchMedia('(min-width:1280px)').matches;
      const topLinks = visible('.desktop-nav-heading > a');
      const boxes = topLinks.map(rect);
      const labelsOverlap = boxes.some((a,i) => boxes.slice(i+1).some(b => overlap(a,b)));
      const ok = desktop ? rendered(nav) && !rendered(menu) && topLinks.length===7 && !labelsOverlap
        : !rendered(nav) && rendered(menu) && rect(menu).w >= 44 && rect(menu).h >= 44;
      record('CS-B04-1', 'Exactly one menu mode; seven separated desktop links or visible 44px mobile trigger.',
        { desktop, links:topLinks.map(name), boxes, labelsOverlap, menu:rect(menu), current: all('[aria-current="page"]',nav).map(name) }, Boolean(ok),
        'Current parent/child state, opened menu, focus and navigation history.');
    }

    const docWidth = document.documentElement.scrollWidth;
    if (id === 31) {
      const rail = one('.partners-viewport');
      page('D1','Partner strip overflow stays inside the document viewport.',
        { docWidth, rail:rail && rect(rail), trackScrollWidth:rail?.scrollWidth }, !!rail && docWidth <= viewport.clientWidth+1);
    }
    const columns = el => css(el).display.includes('grid') ? css(el).gridTemplateColumns.split(/\s+/).filter(s => s !== 'none').length : 0;
    const narrowGrid = (suffix, selectors, counts, breakpoint) => {
      const measured = selectors.map((s,i) => {
        const el = one(s);
        return { selector:s, expected:width <= breakpoint ? 1 : counts[i], actual:el && columns(el),
          width:el && round(el.getBoundingClientRect().width), fits:!!el && el.scrollWidth <= el.clientWidth+2 };
      });
      page(suffix, 'Rendered track count changes at '+breakpoint+'px, with no horizontal spill outside the measured grid.',
        measured, measured.every(m => m.expected === m.actual && m.fits));
    };
    if (id===4) narrowGrid('D2',['.service-planning','.service-process ol'],[2,5],767);
    if (id===5) narrowGrid('D1',['.service-responsibilities'],[2],767);
    if (id===6) narrowGrid('D2',['.service-role'],[2],767);
    if (id===7) narrowGrid('D1',['.service-study-modes'],[2],767);
    if (id===8) narrowGrid('D2',['.service-workflow ol','.service-process ol','.service-consulting-list'],[3,5,3],767);
    if (id===32) narrowGrid('D1',['.education-form-layout','.education-directory'],[2,2],767);
    if (id>=28 && id<=30) narrowGrid('D2',['.ed-agenda-entry'],[2],700);

    const tables = visible('.service-table-scroll,.admin-table-wrap');
    if (tables.length) {
      const entries = tables.map(el => ({ region: rect(el), overflowX:css(el).overflowX, content:el.scrollWidth,
        client:el.clientWidth, headers:all('th[scope="col"],thead th',el).length, tabIndex:el.tabIndex,
        caption:name(el.querySelector('caption') || document.createElement('span')) }));
      const good = entries.every(t => t.content <= t.client+1 || /auto|scroll/.test(t.overflowX)) && docWidth<=viewport.clientWidth+1;
      if(id===36) record('CS-D01-2','Any wide table has its own horizontal scroller; no full-page horizontal scroll.',
        { tables:entries, docWidth }, good, 'Operate focused scroll region; verify zoom, keyboard and touch.');
      if(id===36) {
        // Absolutely positioned offscreen labels must be contained by the local scroller.
        // If their offset parent is the page, the last column can expand the root
        // scroll area even though the table itself correctly fits a local scroller.
        const scroller=one('.admin-table-wrap');
        const actionHeading=scroller?.querySelector('thead th:last-child .sr-only');
        const containingBlock=actionHeading?.offsetParent;
        const scoped=!!scroller && !!containingBlock && (scroller===containingBlock || scroller.contains(containingBlock));
        page('D2','Last column keeps its accessible name and its hidden label is contained by the table scroller.',
          { label:actionHeading?.textContent, containingBlock:containingBlock?.className,
            scoped, localTableWidth:scroller?.scrollWidth, localWindowWidth:scroller?.clientWidth, docWidth },
          scoped && !!actionHeading.textContent.trim() && docWidth <= viewport.clientWidth+1,
          'Physical-device panning and text zoom; evaluate all five locale/width combinations.');
      }
      if ([4,5,7,36].includes(id)) page(id===4 ? 'D1':'D2','Table structure fits a bounded region or scrolls locally.',
        { tables:entries, docWidth },good && entries.every(t => t.headers>0), 'Keyboard pan, text enlargement and content legibility.');
    }

    if (id===1) {
      const hero = one('.home-hero');
      const video = one('.home-hero video');
      const brand = hero?.dataset.showBrand==='true';
      const acts = visible(brand ? '.hero-actions a' : '.hero-entry-bar a');
      const boxes = acts.map(rect);
      const fit = video && css(video).objectFit;
      const videoRect = video && rect(video);
      const source = video && [video.videoWidth,video.videoHeight];
      const known = source && source[0] > 0 && source[1] > 0;
      const noOverlap = boxes.length===2 && !overlap(boxes[0],boxes[1]) && acts.every(el => !clipped(el));
      const actual = { stage:hero?.dataset.stage, brand, objectFit:fit, video:videoRect,
        decoded:source, ctas:acts.map(a=>({ name:name(a), link:a.getAttribute('href'), box:rect(a) })), noOverlap };
      page('D1','Decoded film is 16:9 and fitted without crop during film phase; CTA labels fit in the current phase.',actual,
        !brand && known ? Math.abs(source[0]/source[1]-16/9)<.015 && fit==='contain' && noOverlap : null,
        'Observe both decoded playback and the brand end screen with long translations; a poster alone cannot validate video playback.');
      record('CS-A01-1','On the end card both rendered CTA labels fit without overlap.',actual,brand ? noOverlap : null,
        'Also exercise the opposite hero state, viewport/long-translation cases and preserved logo/slogan.');
    }

    const cards = visible('.service-gallery-card > a');
    if (cards.length) {
      const cardRows = cards.map(el => ({ box:rect(el), tabIndex:el.tabIndex, inert:!!el.closest('[inert]'),
        title:name(el.querySelector('.service-card-title') || el), fits:!clipped(el), cta:rect(el.querySelector('.service-card-cta') || el) }));
      const layout = one('.service-card-grid');
      const expected = width < 640 ? 1 : width < 1024 ? 2 : 3;
      if (id===3 && layout) {
        page('D2','Rendered service directory uses 1/2/3 columns and each card contains its label.',
          { expected, columns:columns(layout), cards:cardRows }, columns(layout)===expected && cardRows.every(c=>c.fits));
        page('D3','Names and links have a layout box even with long translated titles.',cardRows,
          cardRows.every(c=>c.title && c.fits && c.tabIndex>=0 && c.cta.w>0));
      }
      const controls = visible('.service-gallery-controls button');
      if (id===1 && controls.length) record('CS-D03-3','Each visible carousel direction control has a name and 44×44px target.',
        controls.map(c=>({name:name(c),box:rect(c),disabled:c.disabled})),
        controls.every(c=>name(c) && rect(c).w>=43.9 && rect(c).h>=43.9),'Drag, keyboard, coarse pointer, autoplay interruption and focus.');
    }

    // Solid opaque CTA backgrounds permit an exact computed-color contrast calculation.
    // An alpha layer, image or gradient behind text requires a different measurement.
    const channels = color => {
      const match = color.match(/^rgba?\((\d+(?:\.\d+)?)[, ]+(\d+(?:\.\d+)?)[, ]+(\d+(?:\.\d+)?)(?:\s*[,/]\s*([\d.]+))?\)$/);
      return match && (match[4]===undefined || Number(match[4])===1) ? match.slice(1,4).map(Number) : null;
    };
    const luminance = rgb => rgb.reduce((sum,n,i) => {
      const x=n/255; return sum+[.2126,.7152,.0722][i]*(x<=.04045 ? x/12.92 : ((x+.055)/1.055)**2.4);
    },0);
    // These route-specific colors failed the first native axe run. Walk up only
    // through transparent undrawn boxes; do not guess colors behind photographs.
    if (id===36 || id===39 || id===40) {
      const nodes=visible(id===36
        ? '.admin-kpis span,.admin-kpis small,.admin-count,.admin-card p,.admin-demo th,.admin-demo td small'
        : '.info-article-breadcrumb a,.info-article-breadcrumb > span:last-child');
      const palette=nodes.map(el=>{
        const foreground=css(el).color;
        let background=null;
        for(let ancestor=el;ancestor;ancestor=ancestor.parentElement) {
          const st=css(ancestor);
          if(st.backgroundImage!=='none') break;
          const resolved=channels(st.backgroundColor);
          if(resolved){ background=st.backgroundColor;break; }
          if(st.backgroundColor!=='rgba(0, 0, 0, 0)' && st.backgroundColor!=='transparent')break;
        }
        const fg=channels(foreground), bg=background && channels(background);
        const l1=fg&&luminance(fg), l2=bg&&luminance(bg);
        const ratio=fg && bg ? (Math.max(l1,l2)+.05)/(Math.min(l1,l2)+.05) : null;
        return { label:name(el),foreground,background,ratio:ratio===null?null:Math.round(ratio*100)/100,
          passes:ratio===null?null:ratio>=4.5, decoration:css(el).textDecorationLine, link:el.matches('a') };
      }).filter(p=>p.label);
      const checked=palette.filter(p=>p.passes!==null);
      const pass=checked.some(p=>!p.passes) ? false : palette.length>0 && checked.length===palette.length ? true : null;
      record('CS-A02-2','Previously flagged ADMIN metadata or policy breadcrumb text has at least 4.5:1 contrast on its opaque computed surface.',
        { pairs:palette },pass,'These are selected opaque text pairs; run axe and also inspect focus, disabled and image-backed states.');
      if(id!==36) {
        const links=palette.filter(p=>p.link);
        page('D3','Policy breadcrumb link is visibly underlined and trail text clears 4.5:1.',
          { pairs:palette },links.length!==1 || !links[0].decoration.includes('underline') ? false : pass,
          'Tab/focus, other draft text and additional viewport/language combinations.');
      }
    }
    const contrast = [];
    for (const el of visible('.service-card-cta, main .btn, main button[type="submit"]')) {
      const style = css(el);
      const fg = channels(style.color), bg = channels(style.backgroundColor);
      if (!fg || !bg || style.backgroundImage !== 'none') continue;
      // Reveal wrappers can be translucent mid-animation. Do not label their computed pair as a painted-state ratio.
      let translucent = false;
      for(let ancestor=el;ancestor;ancestor=ancestor.parentElement) {
        const s=css(ancestor);
        if (+s.opacity < 1 || s.filter !== 'none' || s.mixBlendMode !== 'normal') {translucent=true;break;}
      }
      if (translucent) continue;
      const a = luminance(fg), b = luminance(bg);
      const ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
      const large = Number.parseFloat(style.fontSize) >= (Number(style.fontWeight)>=700 ? 18.67 : 24);
      contrast.push({label:name(el), foreground:style.color, background:style.backgroundColor, ratio:round(ratio),
        target:large?3:4.5, passed:ratio >= (large?3:4.5)});
    }
    if (contrast.length) record('CS-A02-2','Opaque CTA foreground/background pairs meet WCAG AA for computed text size/weight.',
      contrast,contrast.every(m=>m.passed),'Photo overlays, focus/hover, translucent/imaged controls, other content and alerts.');

    if ((id>=20 && id<=27) || (id>=32 && id<=35) || id===37) {
      const selector = id===20 || id===27 ? '.ed-filters button' : id>=32 && id<=35 ? '.education-form-tabs button' : '.contact-form-tabs button';
      const tabs = visible(selector);
      if (tabs.length) {
        const actual = tabs.map(t=>({ label:name(t), box:rect(t), active:t.getAttribute('aria-pressed'), clipped:clipped(t) }));
        const pass = actual.every(t=>!t.clipped && t.box.w>=43.9 && t.box.h>=43.9 && t.label);
        if(id===20 || id===27) page(id===20?'D2':'D1','Visible category controls have 44px hit boxes and their localized labels fit.',actual,pass);
        if(id>=32 && id<=35) record('CS-D02-3','Both rendered form-mode controls fit their translated labels.',actual,pass,
          'Form columns, every state, keyboard, virtual keyboard and upload labels.');
      }
    }
    const fields = visible('main form input:not([type=hidden],[type=checkbox],[type=radio],[type=file]),main form select,main form textarea');
    if (id>=32 && id<=38 && fields.length) {
      const sizes = fields.map(el=>({ name:el.name || el.id, box:rect(el), font:css(el).fontSize, margin:css(el).scrollMarginTop }));
      const layout = one('.form-grid,.education-form-layout,.consultation-layout');
      record('CS-D01-4','Rendered contact/date/text fields have nonzero boxes within the viewport horizontal bounds.',
        { fields:sizes, gridColumns:layout && css(layout).gridTemplateColumns, currentViewportHeight:window.visualViewport?.height },
        sizes.every(s=>s.box.w>0 && s.box.h>0 && s.box.x>=-1 && s.box.x+s.box.w <= viewport.clientWidth+1),
        'Viewport keyboard occlusion, field focus scrolling, physical input/IME and error states.');
      const submit = visible('main form button[type=submit]');
      if(id!==36 && submit.length) record('CS-D03-4','Rendered form submission controls expose full labels and a 44px target height.',
        submit.map(el=>({label:name(el),box:rect(el)})),submit.every(el=>name(el)&&!clipped(el)&&rect(el).h>=43.9),
        'Physical reach, error summary, scroll and virtual-keyboard behavior.');
    }
    if ((id>=21 && id<=26) || id===39 || id===40) {
      const prose = one(id < 30 ? '.ed-prose-section' : '.info-policy-body');
      if (prose) {
        const p = prose.querySelector('p,li');
        const r = rect(prose);
        record('CS-A01-4','Readable prose stays within its column; on wide screens column is narrower than the viewport.',
          { column:r, font:p&&css(p).fontSize,lineHeight:p&&css(p).lineHeight, maxWidth:css(prose).maxWidth },
          r.w>0 && r.w <= viewport.clientWidth+1 && (width < 1280 || r.w < viewport.clientWidth*.9),
          'Visual hierarchy, intrusion from metadata/related links and reading at zoom.');
      }
      const target = visible('.ed-prose-section h2[id],main h2[id]')[0];
      if(target && id>=21 && id<=26) {
        const pad = parseFloat(css(document.documentElement).scrollPaddingTop) || 0;
        const margin = parseFloat(css(target).scrollMarginTop) || 0;
        const header = one('.site-header');
        page('D3','Configured root scroll padding plus target scroll margin cover the current fixed header height.',
          { target:target.id, padding:pad, margin, header:header && rect(header), position:header && css(header).position },
          header && ['fixed','sticky'].includes(css(header).position) ? pad+margin>=rect(header).h-1 : null,
          'Navigate to the anchor, test actual focused position, zoom and late content shifts.');
      }
    }
    return result;
  };
})();
