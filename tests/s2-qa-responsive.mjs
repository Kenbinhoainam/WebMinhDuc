import assert from 'node:assert/strict';
import {readFile, readdir} from 'node:fs/promises';
import {join} from 'node:path';
import postcss from 'postcss';

export async function runResponsive({check,output}) {
  const rules=[];
  for (const file of (await readdir(join(output,'assets'))).filter(f=>f.endsWith('.css')).sort()) {
    const root=postcss.parse(await readFile(join(output,'assets',file),'utf8'));
    root.walkRules(rule=>rules.push(rule));
  }
  function value(selector,prop,width) {
    let result;
    for (const rule of rules) {
      if(!rule.selectors.includes(selector)) continue;
      let applicable=true;
      for(let parent=rule.parent;parent;parent=parent.parent) {
        if(parent.type!=='atrule')continue;
        const match=parent.params.match(/^\(\s*(max|min)-width:\s*(\d+)px\s*\)$/);
        if(parent.name!=='media'||!match||(match[1]==='max'?width>+match[2]:width<+match[2]))applicable=false;
      }
      if(applicable)rule.walkDecls(prop,declaration=>{result=declaration.value});
    }
    return result;
  }
  const widths=[320,359,360,390,519,520,521,699,700,701,766,767,768,820,999,1000,1001,1280,1440];
  const partial='Tests the named compiled selector and declaration across the indicated media widths. Text fit, overlap, touch and rendered geometry require browser verification.';
  for(const [key,ids,selector,prop,expected] of [
    ['events.agenda.columns',['P28-D2','P29-D2','P30-D2'],'.ed-agenda-entry','grid-template-columns',w=>w<=700?'1fr':'104px 1fr'],
    ['education.form.columns',['P33-D2','P34-D2','P35-D2'],'.education-form-layout','grid-template-columns',w=>w<=767?'minmax(0,1fr)':'minmax(0,4fr) minmax(0,7fr)'],
    ['job.detail.display',Array.from({length:8},(_,i)=>'P'+(10+i)+'-D1'),'.job-detail-layout','display',w=>w<=767?'flex':'grid'],
    ['jobs.filter.columns',['P09-D1'],'.jobs-filter-main','grid-template-columns',w=>w<=520?'repeat(2,minmax(0,1fr))':w<=1000?'minmax(0,1.4fr) minmax(0,1fr)':'minmax(0,2fr) minmax(0,1fr) auto auto']
  ]) {
    await check(key,ids,'compiled CSS','shared',selector+' @ '+widths.join(', ')+' px: '+prop,()=>{
      const seen={};
      for(const width of widths){seen[width]=value(selector,prop,width);assert.equal(seen[width],expected(width),selector+' at '+width+'px');}
      return seen;
    },partial);
  }
}
