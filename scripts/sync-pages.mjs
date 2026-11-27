// Copy the built Pages site to the branch root; git contains both app source and static pages.
import {copyFile, mkdir, readFile, readdir, rm, stat, writeFile} from 'node:fs/promises';
import {dirname, join} from 'node:path';
const manifest = '.pages-output.json';
const reserved = new Set(['.git','.github','.openai','docs','dist','public','scripts','src','tests','node_modules']);
function safe(name) {
  const parts = name.split('/');
  if (!name || parts.some(part => !part || part === '.' || part === '..') || name.includes('\\') || reserved.has(parts[0])) throw Error('Invalid static output: '+name);
  if (parts.length === 1 && !['.nojekyll','404.html','index.html','sitemap.xml','robots.txt'].includes(name) && !name.endsWith('.html')) throw Error('Unexpected root output: '+name);
}
async function files(dir,prefix='') {
  const entries=await readdir(dir,{withFileTypes:true});
  const names=[];
  for(const entry of entries) {
    if(!prefix && entry.name==='.vite')continue;
    const name=prefix+entry.name;
    if(entry.isDirectory())names.push(...await files(join(dir,entry.name),name+'/'));
    else if(entry.isFile())names.push(name);
    else throw Error('Unexpected output type: '+name);
  }
  return names;
}
const previous=await readFile(manifest,'utf8').then(JSON.parse).catch(err=>{if(err.code==='ENOENT')return [];throw err;});
const next=(await files('dist')).sort();const active=new Set(next);
if(!active.has('index.html') || !active.has('.nojekyll'))throw Error('Incomplete Pages build');
for(const name of [...previous,...next])safe(name);
for(const name of next){await mkdir(dirname(name),{recursive:true});await copyFile(join('dist',name),name);}
for(const name of previous)if(!active.has(name))await rm(name,{force:true});
await writeFile(manifest,JSON.stringify(next,null,2)+'\n');
console.log('Prepared '+next.length+' static files for GitHub Pages.');
