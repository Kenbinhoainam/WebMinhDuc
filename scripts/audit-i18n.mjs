// Report likely Vietnamese text still present in localized prerendered pages.
// Proper names and loanwords may be false positives; review the report manually.
import {readdir,readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {JSDOM} from 'jsdom';
const locales=['en','zh','ko','ja'];
const vietnamese=/[ăâđêôơưĂÂĐÊÔƠƯ]|[àảãạấầẩẫậắằẳẵặèẻẽẹếềểễệìỉĩịòỏõọốồổỗộớờởỡợùủũụứừửữựỳỷỹỵ]/u;
for(const locale of locales){
 const findings=new Map();
 async function visit(dir){
  for(const entry of await readdir(dir,{withFileTypes:true})){
   const path=join(dir,entry.name);
   if(entry.isDirectory()) await visit(path);
   else if(entry.name==='index.html') {
    const dom=new JSDOM(await readFile(path,'utf8')); const doc=dom.window.document;
    const walker=doc.createTreeWalker(doc.body,dom.window.NodeFilter.SHOW_TEXT);
    for(let node;node=walker.nextNode();) if(!['SCRIPT','STYLE'].includes(node.parentElement?.tagName||'')) record(node.textContent||'',path);
    for(const element of doc.querySelectorAll('[aria-label],[placeholder],[title],[alt]')) for(const attr of ['aria-label','placeholder','title','alt']) record(element.getAttribute(attr)||'',path);
    dom.window.close();
   }
  }
 }
 function record(value,path){const text=value.replace(/\s+/g,' ').trim();if(text&&vietnamese.test(text)){const existing=findings.get(text);if(existing)existing.count++;else findings.set(text,{text,count:1,example:path});}}
 await visit(join('dist',locale));
 console.log(JSON.stringify({locale,unique:findings.size,findings:[...findings.values()].sort((a,b)=>b.count-a.count)},null,2));
}
