// Regenerate derivative assets from the unchanged source files with ffmpeg.
import {readdir, mkdir, writeFile, readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {join, relative} from 'node:path';
const root='public/mirror/www.hr2b.com/wp-content/uploads';
const selected=process.argv.slice(2).filter(arg=>!arg.startsWith('--'));
const files=[];
async function walk(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const path=join(dir,entry.name);if(entry.isDirectory()) await walk(path);else if(/\.(jpe?g|png)$/i.test(path))files.push(path)}}
if(selected.length) files.push(...selected);
else { await walk(root); files.push('public/assets/hero-poster.jpg','public/assets/minh-duc-logo.jpg','public/assets/minh-duc-about.webp'); }
const manifest=selected.length?JSON.parse(await readFile('src/media-manifest.json','utf8')):{};
for(const file of files.sort()){
 const probe=JSON.parse(execFileSync('ffprobe',['-v','error','-select_streams','v:0','-show_entries','stream=width,height','-of','json',file]));
 const {width,height}=probe.streams[0]; if(width<400)continue;
 const slug=relative('public',file).replace(/\.[^.]+$/,'');
 const logo=file.endsWith('/minh-duc-logo.jpg');
 const widths=logo?[96,192,288].filter(w=>w<=width):[480,960,1600].filter(w=>w<width); if(!logo)widths.push(Math.min(width,1600));
 const variants=[];
 for(const w of [...new Set(widths)]){
  const out=`public/optimized/${slug}-${w}.webp`;await mkdir(join(out,'..'),{recursive:true});
  execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-i',file,'-vf',`scale=${w}:-2`,'-frames:v','1','-c:v','libwebp','-quality',logo?'90':'78',out]);
  variants.push({width:w,src:'/'+relative('public',out)});
 }
 manifest['/'+relative('public',file)]={width,height,variants};
}
await writeFile('src/media-manifest.json',JSON.stringify(manifest,null,2)+'\n');
console.log(`Updated ${files.length} image sources. Hero video is managed separately; this script does not alter hero-assets.json.`);
