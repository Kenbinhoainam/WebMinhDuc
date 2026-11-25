// Verify duration, decoded frame count, stream types and representative matching frames.
import {execFileSync,spawnSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const source=process.argv[2];if(!source) throw new Error('Usage: node scripts/verify-minhduc-media.mjs /absolute/path/to/minhduc-original.mp4');
const hero=JSON.parse(await readFile('src/hero-assets.json','utf8'));
const probe=path=>JSON.parse(execFileSync('ffprobe',['-v','error','-count_frames','-show_entries','format=duration,size:stream=codec_type,codec_name,width,height,avg_frame_rate,nb_read_frames','-of','json',path]));
const original=probe(source), ref=original.streams.find(s=>s.codec_type==='video');
assert.equal(ref.nb_read_frames,'3964');assert.equal(ref.width,1024);assert.equal(ref.height,576);assert.equal(ref.avg_frame_rate,'30/1');
const packetHash=path=>execFileSync('ffmpeg',['-v','error','-i',path,'-map','0:a:0','-c','copy','-f','hash','-hash','sha256','-'],{encoding:'utf8'}).trim();
const pcmBytes=path=>execFileSync('ffmpeg',['-v','error','-i',path,'-map','0:a:0','-ar','48000','-ac','2','-f','s16le','-'],{maxBuffer:64*1024*1024}).length;
const originalPcmBytes=pcmBytes(source);
const results={original:{bytes:Number(original.format.size),duration:Number(original.format.duration),frames:Number(ref.nb_read_frames)},derivatives:{}};
for(const [kind,url] of [['mp4',hero.video],['webm',hero.webm]]) {
 const path='public'+url, result=probe(path), video=result.streams.find(s=>s.codec_type==='video'),audio=result.streams.find(s=>s.codec_type==='audio');
 assert.ok(video&&audio,`${kind}: both video and audio required`);assert.equal(video.codec_name,kind==='mp4'?'h264':'vp9');assert.equal(audio.codec_name,kind==='mp4'?'aac':'opus');
 assert.equal(video.width,ref.width);assert.equal(video.height,ref.height);assert.equal(video.nb_read_frames,ref.nb_read_frames);assert.equal(video.avg_frame_rate,ref.avg_frame_rate);
 assert.ok(Math.abs(Number(result.format.duration)-Number(original.format.duration))<0.1,`${kind}: duration differs by at least 100ms`);
 const decodedAudioBytes=pcmBytes(path);assert.ok(Math.abs(decodedAudioBytes-originalPcmBytes)<=19200,`${kind}: decoded audio differs by over 100ms`);
 if(kind==='mp4') {assert.equal(packetHash(path),packetHash(source),'MP4 AAC packets must match original');const data=await readFile(path);assert.ok(data.indexOf('moov')>=0 && data.indexOf('moov')<data.indexOf('mdat'),'MP4 must have faststart layout');}
 const ssim={};
 for(const second of [1,60,131,132.066]) {
  const p=spawnSync('ffmpeg',['-hide_banner','-ss',String(second),'-i',source,'-ss',String(second),'-i',path,'-filter_complex','[0:v]setpts=PTS-STARTPTS[ref];[1:v]setpts=PTS-STARTPTS[out];[ref][out]ssim','-frames:v','1','-f','null','-'],{encoding:'utf8'});
  assert.equal(p.status,0,`${kind} comparison at ${second}s failed`);const value=Number(p.stderr.match(/All:([\d.]+)/)?.[1]);assert.ok(value>0.75,`${kind}: sampled frame at ${second}s does not resemble source`);ssim[second]=value;
 }
 results.derivatives[kind]={url,bytes:Number(result.format.size),duration:Number(result.format.duration),frames:Number(video.nb_read_frames),video:video.codec_name,audio:audio.codec_name,decodedAudioBytes,ssimSample: ssim};
}
console.log(JSON.stringify(results,null,2));
