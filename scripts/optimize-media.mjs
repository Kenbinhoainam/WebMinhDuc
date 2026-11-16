// Regenerate derivative assets from the unchanged source files with ffmpeg.
import {readdir, mkdir, writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {join, relative, extname, basename} from 'node:path';
const root='public/mirror/www.hr2b.com/wp-content/uploads';
const files=[];
async function walk(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const path=join(dir,entry.name);if(entry.isDirectory()) await walk(path);else if(/\.(jpe?g|png)$/i.test(path))files.push(path)}}
await walk(root); files.push('public/assets/hero-poster.jpg','public/assets/minh-duc-logo.jpg');
const manifest={};
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
const video='public/mirror/www.hr2b.com/wp-content/uploads/2025/10/hr2b-intro.mp4';
// Use source 0–10.9 s, excluding the branded montage. Start at 0.7 s and
// crossfade the last 0.7 s into the opening 0–0.7 s for a continuous loop.
const heroFilter='[0:v]scale=1280:720,split=2[main][head];[main]trim=start=0.7:end=10.9,setpts=PTS-STARTPTS,fps=30,settb=AVTB[a];[head]trim=start=0:end=0.7,setpts=PTS-STARTPTS,fps=30,settb=AVTB[b];[a][b]xfade=transition=fade:duration=0.7:offset=9.5,format=yuv420p[out]';
execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-i',video,'-filter_complex',heroFilter,'-map','[out]','-an','-c:v','libx264','-preset','medium','-crf','27','-movflags','+faststart','public/optimized/hero-1280.mp4']);
console.log(`Generated ${Object.keys(manifest).length} image sets and a silent hero video.`);
