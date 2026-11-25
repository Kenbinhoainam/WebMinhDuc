// Prepare responsive WebP derivatives from the audited, unchanged Drive originals.
// Run from the repository root with the audited research files present locally.
import {mkdir, readFile, writeFile, stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';

const sources = [
 ['team-yearend','DSCF7800.JPG','/workspace/attachments/5b831979-2975-4476-a4f8-778e37c3a96f/DSCF7800.JPG','1S78NFjueBV5e1zYCznBXFSjh30KlKdvy','64b52de59c5ffe0c98210747da7dcb0d4c8a28f027a4b07483126a573684c4ab',7728,5152,false],
 ['yearend-gifts','DSCF7810.JPG','/workspace/attachments/497acd84-0890-494f-b128-39cddcb33826/DSCF7810.JPG','1fxztaiWyx02C0s0pTKyye8p5l9j7Nes1','738b03f5215e8b8371a91f6f4b05cb97b9d418f3d2f9f32224f297f210a83ba1',7728,5152,false],
 ['culture-birthday','20260328_154948.jpg','/workspace/research/minhduc-v16/birthday/originals/40.jpg','1K5iCz3czwc_834W3hjSlsx16gg4IxGbK','d9c6abbbe4aacc20c359d484e46bba43b7e1fb254d78c61f73fd8d6fa616fd1d',4000,1868,false],
 ['recruitment-field','20260706_094939.jpg','/workspace/attachments/1916d22b-91ef-4a71-906b-5428d7c8503b/20260706_094939.jpg','1NTLn16m6n82Jq9blaIKc1cxY2nD364aD','1c49928c8d8c9fad2389f532171bfe8bb22700cf39d71cd08ba774364f13b724',3000,4000,true],
 ['recruitment-event','IMG_4012.JPG','/workspace/attachments/59e85b0a-4407-4340-a09a-354530553426/IMG_4012.JPG','14vZQtyNEgDLGWM-eQms0VJyL3gLGHGBH','47f0255a9b0f59b302fa55c9285dbcea21a7d7686246765c336422974b93f55d',2560,1706,false],
 ['community','IMG_4009.JPG','/workspace/attachments/ec918e13-5285-49c8-a177-baa97aaaa1a6/IMG_4009.JPG','1IVL-zoS6LsaKuvxatntNIZ3dsJArLcty','0748dbdccb949debb7623e0a4e120e475d65986421d8b21fcede86a354717e41',2560,1920,false],
];
const manifest=JSON.parse(await readFile('src/media-manifest.json','utf8'));
await mkdir('public/assets/minhduc-v16',{recursive:true});
await mkdir('docs/flagship',{recursive:true});
const output=[];
for(const [name,original,path,id,expected,width,height,rotate] of sources){
 const data=await readFile(path); const sha256=createHash('sha256').update(data).digest('hex');
 if(sha256!==expected)throw new Error(`Original hash mismatch: ${original}`);
 const widths=[480,960,1600].filter(w=>w<width); widths.push(Math.min(width,1600));
 const unique=[...new Set(widths)]; const variants=[];
 for(const w of unique){
  const suffix=w===unique.at(-1)?'':`-${w}`;
  const dest=`public/assets/minhduc-v16/${name}${suffix}.webp`;
  const filter=`${rotate?'transpose=clock,':''}scale=${w}:-2`;
  execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-noautorotate','-i',path,'-vf',filter,'-frames:v','1','-map_metadata','-1','-c:v','libwebp','-quality','80',dest]);
  const dimensions=JSON.parse(execFileSync('ffprobe',['-v','error','-select_streams','v:0','-show_entries','stream=width,height','-of','json',dest])).streams[0];
  if(dimensions.width!==w || Math.abs(dimensions.height-w*height/width)>2)throw new Error(`Unexpected dimensions: ${dest}`);
  variants.push({width:w,src:'/'+dest.slice('public/'.length)});
 }
 const key=`/assets/minhduc-v16/${name}.webp`;
 manifest[key]={width,height,variants};
 const files=await Promise.all(variants.map(async v=>({...v,bytes:(await stat('public'+v.src)).size})));
 output.push({name,original,source_url:`https://drive.google.com/file/d/${id}/view`,source_path:path,source_sha256:sha256,source_bytes:data.length,display_width:width,display_height:height,normalized_exif_orientation:rotate?'6 → upright':'1',files});
}
await writeFile('src/media-manifest.json',JSON.stringify(manifest,null,2)+'\n');
await writeFile('docs/flagship/v16-media.json',JSON.stringify({description:'Audited original photographs, resized to WebP without creative alteration.',encoder:'ffmpeg libwebp quality 80',images:output},null,2)+'\n');
console.log(`Prepared ${output.length} images and ${output.reduce((n,a)=>n+a.files.length,0)} derivatives.`);
