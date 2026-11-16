// Usage: node scripts/extract-i18n.mjs src/JobsPages.tsx > /tmp/jobs-strings.json
// This deliberately over-collects literals; review against rendered pages and dynamic phrases.
import ts from 'typescript';
import {readFile} from 'node:fs/promises';
const result=new Set();
for(const file of process.argv.slice(2)) {
 const source=ts.createSourceFile(file,await readFile(file,'utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 const visit=node=>{
  if(ts.isStringLiteral(node)||ts.isNoSubstitutionTemplateLiteral(node)||ts.isJsxText(node)) {
   let value=node.text;
   if(ts.isJsxText(node)) value=value.split(/\r?\n/).map((s,i,a)=>i===0?s.trimEnd():i===a.length-1?s.trimStart():s.trim()).filter(Boolean).join(' ');
   if(/[À-ỹĐđ]/u.test(value)&&value.trim()) result.add(value);
  }
  ts.forEachChild(node,visit);
 };visit(source);
}
console.log(JSON.stringify([...result].sort(),null,2));
