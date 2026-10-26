// The pulse/phase are automatic candidates. No manual beat or word calibration.
let features=null;
export const timingStatus={loaded:false,manuallyCalibrated:false,bpm:155.005,phase:0.379524,source:'../../data/audio_features.json'};
export async function loadTiming(){const r=await fetch(new URL(timingStatus.source,import.meta.url));if(!r.ok)throw new Error('Audio feature data missing');features=await r.json();timingStatus.loaded=true;timingStatus.bpm=features.selected_bpm;timingStatus.phase=features.selected_phase_offset_seconds;timingStatus.duration=features.duration_seconds;timingStatus.featureRate=features.feature_rate;return timingStatus}
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
export function sampleAudio(t){
 const period=60/timingStatus.bpm,beat=(t-timingStatus.phase)/period,age=((beat%1)+1)%1*period;
 if(!features)return{beat,beatIndex:Math.floor(beat),beatPulse:Math.exp(-age*11),onset:0,rms:0,low:0,mid:0,high:0,pulse:0};
 const rate=features.feature_rate,x=clamp(t*rate,0,features.frames.length-1),i=Math.floor(x),f=x-i,a=features.frames[i],b=features.frames[Math.min(i+1,features.frames.length-1)];
 const v=k=>a[k]*(1-f)+b[k]*f;let onset=0;
 for(let j=Math.max(0,i-6);j<=i;j++)onset=Math.max(onset,features.frames[j].onset*Math.exp(-(t-features.frames[j].time_seconds)*17));
 const beatPulse=Math.exp(-age*12),low=v('low');return{beat,beatIndex:Math.floor(beat),beatPulse,onset,rms:v('rms'),low,mid:v('mid'),high:v('high'),pulse:clamp(onset*.75+beatPulse*(.12+low*.28))};
}
export const ease=p=>1-(1-clamp(p))**3;
export const progress=(t,a,b)=>clamp((t-a)/Math.max(.001,b-a));
