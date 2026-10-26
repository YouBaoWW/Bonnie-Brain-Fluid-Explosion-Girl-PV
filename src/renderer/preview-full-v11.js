import { init, renderFrame, REVIEW_SHOTS, PREVIEW_CLIPS, cueAt, fontStatus, assetStatus, timingStatus, sampleAudio, assertReadyForRange, refreshAssets, RENDERER_VERSION, CAMERA_POSES, poseAt, lyricMotionAt, fullTimelinePlan } from './full-v11.js';

const params = new URL(location.href).searchParams;
if (params.get('export') === '1') document.body.classList.add('export');
const previewReducedMotion=params.get('export')!=='1'&&(params.get('motion')==='reduce'||matchMedia('(prefers-reduced-motion: reduce)').matches);
const canvas = document.querySelector('#film');
const slider = document.querySelector('#time');
const buttons = [];
window.__bonnie = { ready:false, exportReady:false, previewReady:false, renderFrame, shots:REVIEW_SHOTS, clips:PREVIEW_CLIPS, canvas, assetStatus, timingStatus, sampleAudio, assertReadyForRange,version:RENDERER_VERSION,poses:CAMERA_POSES,poseAt,lyricMotionAt,fullTimelinePlan };
try {
  await init(canvas);
  for (const shot of REVIEW_SHOTS) {
    const button = document.createElement('button');
    button.textContent = `${shot.id} · ${shot.label}`;
    button.onclick = () => {window.__bonnie.stop?.();show(shot.t)};
    document.querySelector('#shots').append(button); buttons.push(button);
  }
  function show(t) {
    const frame = renderFrame(t,{reducedMotion:previewReducedMotion});
    slider.value = t;
    document.querySelector('#time-label').value = `${Number(t).toFixed(3)} s`;
    document.querySelector('#cue').textContent = frame.pose?`${frame.pose.id} / ${frame.pose.label}`:`${frame.shot.id} / ${frame.shot.label} · ${frame.shot.density}`;
    buttons.forEach((button,i) => button.setAttribute('aria-pressed', String(REVIEW_SHOTS[i].id === frame.shot.id)));
    return frame;
  }
  const audio=new Audio(new URL('../../media/song.wav',import.meta.url));audio.preload='none';let activeClip=null,raf=0;
  function stop(){audio.pause();activeClip=null;cancelAnimationFrame(raf)};audio.addEventListener("ended",()=>{stop();show(11494/60)})
  function tick(){if(!activeClip)return;if(audio.currentTime>=activeClip.end){const end=activeClip.end;stop();show(end-1/60);return}show(audio.currentTime);raf=requestAnimationFrame(tick)}
  async function playClip(id){const clip=PREVIEW_CLIPS.find(c=>c.id===id);if(!clip)throw new Error('Unknown preview clip');assertReadyForRange(clip.start,clip.end);stop();activeClip=clip;audio.currentTime=clip.start;show(clip.start);await audio.play();tick()}
  for(const clip of PREVIEW_CLIPS){const b=document.createElement('button');b.textContent=`▶ ${clip.label} ${Math.round(clip.end-clip.start)}s`;b.onclick=()=>playClip(clip.id).catch(e=>{document.querySelector('#status').textContent=e.message});document.querySelector('#clips').append(b)}
  const pause=document.createElement('button');pause.textContent='暂停';pause.onclick=stop;document.querySelector('#clips').append(pause);
  slider.oninput = () => {stop();show(Number(slider.value))};
  const initial = Number(params.get('t') ?? 0);
  show(Number.isFinite(initial) ? initial : REVIEW_SHOTS[0].t);
  Object.assign(window.__bonnie,{ready:assetStatus.exportReady,exportReady:assetStatus.exportReady,previewReady:true,cueAt,fontStatus,show,playClip,stop,audio,refreshAssets:async()=>{const state=await refreshAssets();window.__bonnie.ready=state.exportReady;window.__bonnie.exportReady=state.exportReady;show(Number(slider.value));return state}});
  document.querySelector('#status').textContent += ` 字体：${fontStatus.join(' / ')}。`;
} catch (error) {
  document.querySelector('#status').textContent = `载入失败：${error.message}`;
  window.__bonnie.error = String(error.stack || error); console.error(error);
}
