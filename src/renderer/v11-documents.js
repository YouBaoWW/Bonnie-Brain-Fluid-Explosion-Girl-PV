/* V11 document choreography. The newspaper section reuses the actual V04
 * painter and shot parameters; the finale is one camera travelling over three
 * fixed physical files. All state is a function of absolute song time. */
import {newspaperV03,cityV03,halftoneV03,envelopeV03,inkBlotsV03} from './props-v11.js';
import {out,inOut} from './perspective-v02.js';

const mix=(a,b,u)=>a+(b-a)*u;
const sat=x=>Math.max(0,Math.min(1,x));
const smooth=x=>{x=sat(x);return x*x*x*(x*(x*6-15)+10)};
const progress=(t,a,b)=>sat((t-a)/(b-a));
const line=(c,E,x,y,xx,yy,color=E.INK,width=1)=>E.rule(c,x,y,xx,yy,color,width,1);

// The N02 pose is named city in V04, but the paperPageState override still
// routes it to newspaperScene. Its physical newspaper stays in the wide view.
const NEWS_SHOTS=[
 {start:121.5,end:122.15,mode:'newspaper',index:0},
 {start:122.15,end:122.8,mode:'city',index:1},
 {start:122.8,end:123.5,mode:'newspaper-quarter',index:2},
 {start:123.5,end:124.22,mode:'newspaper-close',index:3}
];
const NEWS_ASSETS=['NEWSPAPER_ICON_I','NEWSPAPER_ICON_II','NEWSPAPER_ICON_III','NEWSPAPER_ICON'];

function newspaperV04(c,t,E,p,H){
 const shot=NEWS_SHOTS.find(a=>t>=a.start&&t<a.end)??NEWS_SHOTS.at(-1),u=progress(t,shot.start,shot.end),drift=inOut(u),land=out(u/.28),dir=shot.index%2?1:-1;
 const pageIndex=Math.min(3,Math.floor((t-121.5)/.4)),imageAsset=NEWS_ASSETS[pageIndex],close=shot.mode==='newspaper-close',quarter=shot.mode==='newspaper-quarter';
 E.rect(c,0,0,1920,1080,E.PAPER);
 const gradient=c.createRadialGradient(960,520,260,960,520,1130);gradient.addColorStop(0,'rgba(0,0,0,0)');gradient.addColorStop(1,'rgba(0,0,0,.085)');c.fillStyle=gradient;c.fillRect(0,0,1920,1080);
 c.save();c.fillStyle=E.INK;c.globalAlpha=.055;for(let i=0;i<420;i++)c.fillRect(Math.floor(H.hash(i*13+97)*1920),Math.floor(H.hash(i*17+31)*1080),1,H.hash(i+2)>.8?3:1);c.restore();
 halftoneV03(c,t,{x:40,y:95,w:1840,h:855,ink:E.INK,paper:E.PAPER,step:16,radius:2.5,seed:127});
 const vanX=960+(u-.5)*dir*160;
 for(let i=0;i<2;i++){const size=960+i*285+u*50;c.save();c.translate(vanX,500);c.rotate((i%2?1:-1)*(.045+u*.02));c.strokeStyle=E.INK;c.lineWidth=2.5;c.strokeRect(-size*.75,-size*.42,size*1.5,size*.84);c.restore()}
 // Same two city layers as newspaperScene in the delivered V04.
 const pan=(shot.index%2?1:-1)*(drift-.5)*155;
 if(E.hasAsset('CITY_TOKYO')){E.art(c,'CITY_TOKYO',[-120+pan,180,2160,1090],{mode:'posterInk',alignY:'top'});H.mark('asset:CITY_TOKYO')}
 cityV03(c,t,{x:-80-pan*.5,y:560,w:2100,h:590,drawTower:false,layer:'near',ink:E.INK,paper:E.PAPER,seed:127});
 const safeArea={x:360,y:220,w:1200,h:620};
 for(const [corner,radius,seed]of [[shot.index%2?'tr':'tl',130,41+shot.index],[shot.index%2?'bl':'br',100,83+shot.index]])inkBlotsV03(c,t,{x:0,y:0,w:1920,h:1080,placement:'corner',corner,ink:E.INK,paper:E.PAPER,radiusPixels:radius,count:2,seed,safeArea,safePadding:28});
 const box=close?[-430+drift*210,-240,2770,1840]:[200+(drift-.5)*110,80,1520,1000];
 const rotation=quarter?mix(-Math.PI/2,-.10,land):close?-.06:mix(.34,-.04,land),yaw=mix(quarter?.50:-.38,.03,land),pitch=close?-.14:.12;
 newspaperV03(c,t,{E,x:box[0],y:box[1],w:box[2],h:box[3],imageAsset,ink:E.INK,paper:E.PAPER,rotation,yaw,pitch,alpha:1});
 envelopeV03(c,t,{x:1430-100*drift,y:650,w:590,h:380,rotation:.25-drift*.15,ink:E.INK,paper:E.PAPER,alpha:1});
 // The source cue is clear throughout this range. The V04's newspaper print
// and picture change rather than inventing a new sung lyric.
 H.mark('prop:newspaper','asset:'+imageAsset,'prop:city','prop:halftone','prop:envelope','newspaper:v04-painter-restored','newspaper:v04-four-image-timing');
 H.info({paperPageState:{index:pageIndex,page:['I','II','III','IV'][pageIndex],asset:imageAsset,start:121.5+pageIndex*.4,end:pageIndex===3?124.22:121.5+(pageIndex+1)*.4,source:'delivered-full-v04',shot:shot.mode,rotation,yaw,pitch},cameraState:{model:'v04-newspaper-camera',shot:shot.mode,start:shot.start,end:shot.end,progress:u,drift,close,quarter}});
}

// Files are never replaced or reoriented on a cue boundary. These placements
// describe one continuous desk; every lyric remains printed on its own file.
const FILES=[
 {id:'A',number:'01',x:0,y:0,rotation:-.055,w:1600,h:1640,start:161.883,end:164.9,cues:['cue_079'],regions:[[120,370,1360,570]],heading:'演示 / 示文'},
 {id:'B',number:'02',x:2200,y:350,rotation:.065,w:1600,h:2300,start:164.9,end:169.09,cues:['cue_080','cue_081'],regions:[[120,360,1360,450],[120,1100,1360,650]],heading:'百年後 / 再生'},
 {id:'C',number:'03',x:4590,y:1250,rotation:-.045,w:1600,h:3200,start:169.09,end:175.2,cues:['cue_082','cue_083','cue_084'],regions:[[120,350,1360,580],[120,1250,1360,600],[120,2150,1360,600]],heading:'演示 / 示文字演示'}
];

// Only line boundaries are inserted; joining each list reproduces the exact
// approved display cue. The keyword can therefore lift from its real glyphs.
const FINAL_TYPE_SPECS=[
 {cue:'cue_079',keyword:'演示',lines:['演示文字演示文字','演示文字演示'],delay:.24,side:-1,mode:'echo',density:0},
 {cue:'cue_080',keyword:'演示',lines:['演示文100文字演','演示'],delay:.18,side:1,mode:'split',density:1},
 {cue:'cue_081',keyword:'演示',lines:['演示文字','演示文字演示文字','演示文字演示'],delay:.30,side:-1,mode:'echo-split',density:2},
 {cue:'cue_082',keyword:'演示',lines:['演示文字演示文','演示文字演'],delay:.23,side:1,mode:'split',density:3},
 {cue:'cue_083',keyword:'演示',lines:['演示文字演示','演示文字演示文字'],delay:.25,side:-1,mode:'echo-split',density:4},
 {cue:'cue_084',keyword:'演示',lines:['演示文字演示文','演示文字演示'],delay:.24,side:1,mode:'giant-close',density:5}
];

// Runtime copy of 01_AUDIO/final_glyph_pacing_v11.json. Frames are authored
// against unchanged LRC durations, with mora-length weights and small local
// mixed-audio onset nudges. The JSON records the derivation and its limits.
export const FINAL_GLYPH_PACING_V11=Object.freeze([
 {cueId:'cue_079',sourceStart:162.17,sourceEnd:164.9,frames:[9731,9738,9749,9766,9773,9784,9792,9801,9810,9830,9836,9845,9848,9854]},
 {cueId:'cue_080',sourceStart:164.9,sourceEnd:166.32,frames:[9894,9899,9904,9911,9913,9916,9920,9929,9935,9940,9955]},
 {cueId:'cue_081',sourceStart:166.32,sourceEnd:169.09,frames:[9980,9987,9999,10007,10014,10022,10027,10033,10040,10051,10057,10063,10068,10077,10084,10092,10098,10105]},
 {cueId:'cue_082',sourceStart:169.09,sourceEnd:171.14,frames:[10146,10159,10167,10173,10181,10196,10202,10209,10215,10223,10230,10237]},
 {cueId:'cue_083',sourceStart:171.14,sourceEnd:173.01,frames:[10275,10279,10283,10289,10295,10302,10306,10312,10319,10329,10338,10341,10349,10351]},
 {cueId:'cue_084',sourceStart:173.01,sourceEnd:177.53,frames:[10387,10420,10439,10454,10471,10487,10505,10521,10540,10554,10563,10573,10590]}
]);

export function finalLyricGlyphStateV11(t,cueId='cue_084'){
 const plan=FINAL_GLYPH_PACING_V11.find(a=>a.cueId===cueId);if(!plan)throw new Error('Missing V11 final timing '+cueId);
 const spec=FINAL_TYPE_SPECS.find(a=>a.cue===cueId),text=spec.lines.join(''),letters=Array.from(text),currentFrame=Math.floor(t*60+1e-7),popSeconds=.12;
 const glyphs=letters.map((glyph,index)=>{const startFrame=plan.frames[index],startSeconds=startFrame/60,visible=currentFrame>=startFrame,age=visible?Math.max(0,t-startSeconds):null,u=visible?progress(age,0,popSeconds):0;return{glyph,index,startFrame,startSeconds,visible,age,blurPx:visible&&age<popSeconds?7*(1-out(u)):0,trailCopies:visible&&age<popSeconds?3:0}}),visible=glyphs.filter(a=>a.visible),completeAt=plan.frames.at(-1)/60+popSeconds;
 return{model:'mora-paced-one-glyph',cueId,text,sourceCueStart:plan.sourceStart,sourceCueEnd:plan.sourceEnd,start:plan.frames[0]/60,popSeconds,glyphFrames:plan.frames,totalGlyphs:letters.length,visibleGlyphs:visible.length,visibleIndices:visible.map(a=>a.index),prefix:visible.map(a=>a.glyph).join(''),glyphs,activeGlyphs:glyphs.filter(a=>a.visible&&a.age<popSeconds),completeAt,complete:t>=completeAt,completeCueFraction:(completeAt-plan.sourceStart)/(plan.sourceEnd-plan.sourceStart),absoluteCueTime:true,holdBlurPx:0};
}

function layoutPrintedPhrase(c,E,H,cue,rect){
 const spec=FINAL_TYPE_SPECS.find(a=>a.cue===cue.id),lines=spec?.lines??[cue.text];
 if(lines.join('')!==cue.text)throw new Error('Finale semantic layout changes approved lyric '+cue.id);
 const[x,y,w,h]=rect,fontFamily=E.fontFor?.(cue.start_seconds)??E.JP;let font=190;c.font=`700 ${font}px ${fontFamily}`;
 const widest=Math.max(...lines.map(s=>c.measureText(s).width));font=Math.min(font,190*w/Math.max(w,widest),h/(lines.length*1.3));
 c.font=`700 ${font}px ${fontFamily}`;const glyphs=[];let index=0,yy=y+(h-lines.length*font*1.3)/2+font;
 for(const row of lines){let xx=x;for(const ch of H.chars(row)){const width=c.measureText(ch).width;glyphs.push({ch,index,x:xx,y:yy,width});index++;xx+=width}yy+=font*1.3}
 return{font,fontFamily,glyphs,rect,lines,text:cue.text};
}

function glyphPopTiming(layout,cue){
 const plan=FINAL_GLYPH_PACING_V11.find(a=>Math.abs(a.sourceStart-cue.start_seconds)<.001);if(!plan||plan.frames.length!==layout.glyphs.length)throw new Error('Final glyph timing/layout mismatch');
 return finalLyricGlyphStateV11(-1,plan.cueId);
}

function drawPrintedPhrase(c,E,layout,{halo=false,t,cue}={}){
 const timing=glyphPopTiming(layout,cue),state=finalLyricGlyphStateV11(t,timing.cueId),visible=[];c.save();c.font=`700 ${layout.font}px ${layout.fontFamily}`;c.textBaseline='alphabetic';c.fillStyle=E.INK;c.strokeStyle=E.PAPER;c.lineJoin='round';c.lineWidth=halo?9:0;
 for(const g of layout.glyphs){
  const entry=state.glyphs[g.index];if(!entry.visible)continue;const age=entry.age;
  const u=progress(age,0,timing.popSeconds),scale=u<.45?mix(.86,1.12,out(u/.45)):mix(1.12,1,out((u-.45)/.55)),rise=(1-out(u))*layout.font*.20;
  c.save();c.translate(g.x+g.width/2,g.y-layout.font*.35+rise);c.scale(scale,scale);
  if(entry.trailCopies){for(let k=entry.trailCopies;k>0;k--){c.save();c.globalAlpha*=.13*(1-u);c.filter=`blur(${entry.blurPx+1.5}px)`;c.fillText(g.ch,-g.width/2,layout.font*.35+k*layout.font*.045*(1-u));c.restore()}}
  c.filter=entry.blurPx?`blur(${entry.blurPx}px)`:'none';if(halo)c.strokeText(g.ch,-g.width/2,layout.font*.35);c.fillText(g.ch,-g.width/2,layout.font*.35);c.restore();visible.push(g.index);
 }c.restore();return{...state,fontFamily:layout.fontFamily,visibleGlyphs:visible.length,visibleIndices:visible};
}

// The solar painter calls this with its own reading box. It uses the exact
// same prefix, glyph ages, brush font, blur and trails as the preceding file.
export function drawFinalSolarLyricV11(c,t,E,H,{box=[520,240,880,580],rotation=0}={}){
 const cue=E.cues.find(a=>a.id==='cue_084');if(!cue)throw new Error('Missing final solar cue');const[x,y,w,h]=box;
 c.save();c.translate(x+w/2,y+h/2);c.rotate(rotation);const layout=layoutPrintedPhrase(c,E,H,cue,[-w/2,-h/2,w,h]),state=drawPrintedPhrase(c,E,layout,{halo:true,t,cue});c.restore();
 H.mark('typography:v11-solar-shared-absolute-glyph-prefix','typography:v11-glyph-rise-blur-trails');H.info({revisionState:{finalLyricCarry:{...state,box,rotation,sameTimelineAsDocuments:true,noOpaquePlate:true}}});return state;
}

function keywordMotionAt(t,cue,spec,layout){
 const glyphTiming=glyphPopTiming(layout,cue),keywordLast=layout.text.indexOf(spec.keyword)+Array.from(spec.keyword).length-1,ownKeywordReadyAt=glyphTiming.glyphFrames[keywordLast]/60+glyphTiming.popSeconds,delay=Math.max(spec.delay,ownKeywordReadyAt-cue.start_seconds+.02),durationScale=Math.min(1,Math.max(.35,(Math.min(cue.end_seconds,175.2)-cue.start_seconds-delay-.02)/1.22)),wallAge=t-cue.start_seconds-delay,age=wallAge/durationScale,base={age,wallAge,effectiveDelay:delay,durationScale,printedPhraseCompleteAt:glyphTiming.completeAt,ownKeywordReadyAt,keywordLastGlyphIndex:keywordLast,triggerPolicy:'own-keyword-settled-plus-20ms'};
 if(age<0)return{...base,phase:'quiet',progress:0,visible:false};
 if(age<.24)return{...base,phase:'lift',progress:out(age/.24),visible:true};
 if(age<.46)return{...base,phase:'rush',progress:inOut((age-.24)/.22),visible:true};
 if(age<.90)return{...base,phase:'fracture',progress:out((age-.46)/.44),visible:true};
 if(age<1.22)return{...base,phase:'settle',progress:inOut((age-.90)/.32),visible:true};
 return{...base,phase:spec.mode==='giant-close'?'giant-close':'read',progress:1,visible:spec.mode==='giant-close'};
}

function screenPoint(cam,world){const x=world.x-cam.x,y=world.y-cam.y,a=-cam.roll;return{x:960+(Math.cos(a)*x-Math.sin(a)*y)*cam.zoom,y:525+(Math.sin(a)*x+Math.cos(a)*y)*cam.zoom}}

function wordAnchor(cam,fileIndex,layout,keyword){
 const first=layout.text.indexOf(keyword),last=first+keyword.length,letters=layout.glyphs.filter(g=>g.index>=first&&g.index<last);
 if(first<0||!letters.length)throw new Error('Missing paper keyword '+keyword);
 const left=letters[0].x,right=letters.at(-1).x+letters.at(-1).width,baseline=letters[0].y;
 const source=pointOnFile(fileIndex,(left+right)/2,baseline),screen=screenPoint(cam,source);
 return{...screen,sourceWorld:source,sourceFile:{x:(left+right)/2,y:baseline},font:layout.font*cam.zoom,fontFamily:layout.fontFamily,rotation:FILES[fileIndex].rotation-cam.roll,width:right-left};
}

function floatingPose(anchor,spec,state){
 const target={x:spec.side<0?360:1530,y:spec.side<0?280:850},lift={x:anchor.x+spec.side*90,y:anchor.y-120};
 if(state.phase==='lift')return{x:mix(anchor.x,lift.x,state.progress),y:mix(anchor.y,lift.y,state.progress),scale:mix(1,1.32,state.progress),rotation:mix(anchor.rotation,spec.side*.08,state.progress),alpha:1};
 if(state.phase==='rush')return{x:mix(lift.x,target.x,state.progress),y:mix(lift.y,target.y,state.progress),scale:mix(1.32,3.65,state.progress),rotation:mix(spec.side*.08,-spec.side*.10,state.progress),alpha:1};
 return{x:target.x+spec.side*(state.phase==='settle'?110:state.progress*80),y:target.y-(state.phase==='settle'?30:state.progress*60),scale:3.65+(state.phase==='settle'?.32:state.progress*.32),rotation:-spec.side*.10,alpha:state.phase==='settle'?1-state.progress:1};
}

function wordTexture(E,H,keyword,font,fontFamily){
 const key='v11-keyword-fragments-'+keyword+'-'+Math.round(font)+'-'+fontFamily;let old=H.cache.get(key);if(old)return old;
 const measure=E.scratch(key+'-measure',16,16)[1];measure.font=`700 ${font}px ${fontFamily}`;const width=Math.ceil(measure.measureText(keyword).width+40),height=Math.ceil(font*1.45),[canvas,q]=E.scratch(key,width,height);
 q.font=`700 ${font}px ${fontFamily}`;q.textBaseline='alphabetic';q.fillStyle=E.INK;q.fillText(keyword,20,font*1.10);old={canvas,width,height,font};H.cache.set(key,old);return old;
}

function drawKeywordBurst(c,t,E,H,cam,fileIndex,printed,cue,spec){
 const state=keywordMotionAt(t,cue,spec,printed.layout),anchor=wordAnchor(cam,fileIndex,printed.layout,spec.keyword);
 if(!state.visible)return{...state,keyword:spec.keyword,sourceFile:anchor.sourceFile,sourceWorld:anchor.sourceWorld};
 const pose=floatingPose(anchor,spec,state),copyCount=state.phase==='rush'||state.phase==='fracture'?2+Math.floor(spec.density/2):0;
 c.save();c.beginPath();c.rect(0,90,1920,870);c.clip();
 // Offset echoes stay below the real main sentence; they never form a plate.
 for(let i=copyCount;i>0;i--){c.save();c.translate(pose.x-spec.side*i*42,pose.y+i*27);c.rotate(pose.rotation-i*.025*spec.side);c.scale(pose.scale,pose.scale);c.font=`900 ${anchor.font}px ${anchor.fontFamily}`;c.textAlign='center';c.lineWidth=1.6;c.strokeStyle=E.INK;c.globalAlpha=.10+(spec.density*.018);c.strokeText(spec.keyword,0,0);c.restore()}
 if(state.phase==='lift'||state.phase==='rush'){
  c.save();c.translate(pose.x,pose.y);c.rotate(pose.rotation);c.scale(pose.scale,pose.scale);c.font=`700 ${anchor.font}px ${anchor.fontFamily}`;c.textAlign='center';c.textBaseline='alphabetic';c.strokeStyle=E.PAPER;c.lineJoin='round';c.lineWidth=3;c.fillStyle=E.INK;c.strokeText(spec.keyword,0,0);c.fillText(spec.keyword,0,0);c.restore();
 }
 if(state.phase==='fracture'||state.phase==='settle'){
  const fracture=state.phase==='fracture'?state.progress:1,fade=state.phase==='settle'?1-state.progress:1,tex=wordTexture(E,H,spec.keyword,printed.layout.font,printed.layout.fontFamily),cols=4,rows=3;
  for(let n=0;n<cols*rows;n++){const sx=n%cols*tex.width/cols,sy=Math.floor(n/cols)*tex.height/rows,sw=tex.width/cols,sh=tex.height/rows,seed=spec.density*127+n*23,angle=H.hash(seed+4)*Math.PI*2,distance=(90+H.hash(seed+7)*390)*fracture;
   c.save();c.globalAlpha=fade*.88;c.translate(pose.x+Math.cos(angle)*distance,pose.y-anchor.font*pose.scale*.48+Math.sin(angle)*distance*.65);c.rotate(pose.rotation+(H.hash(seed+9)-.5)*fracture*1.4);c.scale(pose.scale,pose.scale);c.drawImage(tex.canvas,sx,sy,sw,sh,sx-tex.width/2,sy-tex.height/2,sw,sh);c.restore();
  }
 }
 if(spec.mode==='giant-close'&&state.age>=.90){
  const giantStart=Math.max(174.15,cue.start_seconds+state.effectiveDelay+.90*state.durationScale),finish=out(progress(t,giantStart,175.20));c.save();c.lineJoin='round';c.strokeStyle=E.INK;c.globalAlpha=mix(.22,.72,finish);c.lineWidth=12;c.font=`900 ${mix(690,1100,finish)}px ${E.JP}`;c.strokeText('月',mix(-260,-390,finish),mix(770,910,finish));if(finalLyricGlyphStateV11(t).visibleGlyphs>=5){c.font=`900 ${mix(490,700,finish)}px ${E.JP}`;c.lineWidth=8;c.strokeText('向こう',mix(1250,1180,finish),mix(350,390,finish))}c.restore();
 }
 c.restore();H.mark('typography:paper-keyword-lift','typography:keyword-rush-camera','typography:keyword-'+spec.mode);if(state.phase==='fracture'||state.phase==='settle')H.mark('typography:real-glyph-fragments');if(spec.mode==='giant-close'&&state.age>=.90)H.mark('typography:giant-cropped-lunar-close');
 return{...state,keyword:spec.keyword,sourceFile:anchor.sourceFile,sourceWorld:anchor.sourceWorld,screenAnchor:{x:anchor.x,y:anchor.y},pose,copyCount,fragmentCount:state.phase==='fracture'||state.phase==='settle'?12:0};
}

function drawLetterTracks(c,t,E,H,fileIndex,density){
 const f=FILES[fileIndex],alpha=.035+density*.014,rows=5+density*2;c.save();c.beginPath();c.rect(44,44,f.w-88,f.h-88);c.clip();c.globalAlpha=alpha;c.fillStyle=E.INK;c.font=`700 ${46+density*3}px ${E.JP}`;
 for(let i=0;i<rows;i++){const y=330+i*(f.h-380)/Math.max(1,rows-1),travel=(t-161.883)*(10+i%3*4),text=FINAL_TYPE_SPECS[(i+fileIndex)%FINAL_TYPE_SPECS.length].keyword+' / '+f.number+' / ';c.save();c.translate(80-(travel%100),y);c.rotate((i%2?1:-1)*.055);c.fillText(text.repeat(8),0,0);c.restore()}c.restore();
}

// The local original PV leaves the scrolling reincarnation phrase for a
// giant sa at approximately 168.42. Its onset is also the unchanged final
// printed glyph of cue_081, frame 10105. This focus never advances cue_082.
export const FINAL_KANA_STAGE_V11=Object.freeze({startFrame:10105,start:10105/60,middle:168.75,end:169.09,sourceCue:'cue_081',sourceGlyph:'演',text:'さあ',referenceRange:[166.5,170.2],boldWeight:900,fineWeight:300});
export function finalPaperKanaStateV11(t){
 const a=FINAL_KANA_STAGE_V11;if(Math.floor(t*60+1e-7)<a.startFrame||t>=a.end)return null;
 const u=progress(t,a.start,a.end),second=t>=a.middle,start=second?a.middle:a.start,end=second?a.end:a.middle,arrival=.05,departure=.05,travel=inOut((u-.36)/.28),leave=out(progress(t,a.end-departure,a.end)),entry=out(progress(t,a.start,a.start+arrival));
 return{start:a.start,middle:a.middle,end:a.end,sourceCueId:a.sourceCue,sourceGlyph:a.sourceGlyph,sourceGlyphFrame:a.startFrame,sourceGlyphEligible:true,text:a.text,pass:second?2:1,weight:second?300:900,u,arrivalSeconds:arrival,departureSeconds:departure,entry,leave,travel,boldAlpha:1-out(progress(t,a.middle-departure,a.middle)),fineAlpha:.18+.82*out(progress(t,a.middle-.015,a.middle+.035)),printedAlpha:1-.88*entry,paperBackgroundPreserved:true,changesCueAxis:false,wholeScreenFlash:false,absoluteTime:true};
}
function drawFinalPaperKana(c,t,E,H,state,sourceAnchor){
 const u=state.u,cameraX=mix(-120,160,u)+Math.sin(u*Math.PI)*140,cameraY=Math.sin(u*Math.PI*1.3)*45-state.leave*80,cameraZ=mix(-1120,350,state.travel)+Math.sin(u*Math.PI)*45,focal=1050*(1+(1-state.entry)*.15+state.leave*.10),yaw=Math.sin(u*Math.PI)*.07,roll=mix(-.12,.09,u)+Math.sin(u*Math.PI*2)*.04;
 const center={x:mix(sourceAnchor.x,960,state.entry),y:mix(sourceAnchor.y,520,state.entry)},project=(x,y,z)=>{const xx=x-cameraX,yy=y-cameraY,zz=z-cameraZ,cs=Math.cos(yaw),sn=Math.sin(yaw),vx=cs*xx-sn*zz,vz=sn*xx+cs*zz,cr=Math.cos(roll),sr=Math.sin(roll),k=focal/Math.max(70,vz);return[center.x+(vx*cr-yy*sr)*k,center.y+(vx*sr+yy*cr)*k]},quad=(x,y,z,w,h,r=0)=>{const cs=Math.cos(r),sn=Math.sin(r);return[[-w/2,-h/2],[w/2,-h/2],[w/2,h/2],[-w/2,h/2]].map(([a,b])=>project(x+a*cs-b*sn,y+a*sn+b*cs,z))};
 const fonts=['"MS Gothic","Yu Gothic",sans-serif','"Yu Gothic Light","Yu Gothic","MS Gothic",sans-serif'],blur=(1-state.entry+state.leave)*6;
 const texture=(key,size,weight,font)=>{const[s,q]=E.scratch(key,2200,1300);q.save();q.filter=blur>.05?`blur(${blur.toFixed(3)}px)`:'none';E.text(q,state.text,1100,965,size,E.INK,{font,align:'center',weight});q.restore();return s};
 const bold=texture('v11-final-kana-bold',925,900,fonts[0]),fine=texture('v11-final-kana-fine',770,300,fonts[1]),echoAlpha=Math.sin(state.travel*Math.PI)*.13;
 c.save();c.beginPath();c.rect(0,90,1920,870);c.clip();
 // Only transparent letter textures are projected: the real three-file desk
 // beneath them remains the physical background throughout both depth passes.
 H.projectPlane(c,fine,quad(160,-80,1300,2200,1300,.035),{alpha:state.fineAlpha*(1-state.leave*.8)});
 if(echoAlpha>.001)for(const[ch,x,y,z]of[['さ',-650,-180,720],['あ',620,110,900]]){const[s,q]=E.scratch('v11-final-kana-echo-'+ch,900,1200);E.text(q,ch,450,890,780,E.INK,{font:fonts[1],align:'center',weight:300});H.projectPlane(c,s,quad(x,y,z,900,1200,ch==='さ'?-.16:.14),{alpha:echoAlpha})}
 if(state.boldAlpha>.001)H.projectPlane(c,bold,quad(-120,30,0,2200,1300,-.025),{alpha:state.boldAlpha});c.restore();
 H.mark('kana:v11-final-paper-focus','kana:two-appearances-bold-thin','kana:v11-shared-physical-world','camera:v11-final-kana-depth-push-orbit','kana:v11-individual-glyph-offset-trails');
 return{...state,camera:{x:cameraX,y:cameraY,z:cameraZ,focal,yaw,roll,center,path:'continuous-depth-push-short-orbit'},sourceAnchor,individualEchoCount:echoAlpha>.001?2:0,blurPx:blur,noOpaquePlate:true};
}

function pointOnFile(index,x,y){const f=FILES[index],a=f.rotation;return{x:f.x+Math.cos(a)*x-Math.sin(a)*y,y:f.y+Math.sin(a)*x+Math.cos(a)*y,roll:a}}
const CAMERA_KEYS=[
 [161.883,0,740,360,.99],[162.17,0,790,565,1.02],[163.35,0,850,650,1.04],[164.48,0,830,690,1.04],
 [165.13,1,790,540,1.04],[165.98,1,825,600,1.04],[166.53,1,810,1370,1.02],[168.72,1,850,1430,1.04],
 [169.36,2,780,600,1.04],[170.96,2,830,660,1.04],[171.39,2,810,1510,1.02],[172.83,2,840,1570,1.04],
 [173.29,2,810,2410,1.02],[175.2,2,875,2480,1.05]
].map(([time,file,x,y,zoom])=>({time,file,...pointOnFile(file,x,y),zoom}));

function cameraAt(t){
 let i=0;while(i<CAMERA_KEYS.length-2&&t>=CAMERA_KEYS[i+1].time)i++;
 const a=CAMERA_KEYS[i],b=CAMERA_KEYS[i+1],raw=progress(t,a.time,b.time),u=smooth(raw),travelling=a.file!==b.file;
 return{x:mix(a.x,b.x,u),y:mix(a.y,b.y,u),roll:mix(a.roll,b.roll,u)+Math.sin((t-161.883)*.24)*.008,zoom:mix(a.zoom,b.zoom,u)-(travelling?Math.sin(raw*Math.PI)*.10:0),file:raw<.5?a.file:b.file,fromFile:a.file,toFile:b.file,travelling,progress:u,segmentStart:a.time,segmentEnd:b.time};
}

function createFileTexture(t,E,H,index){
 const f=FILES[index],list=E.cues??[],cueFonts=f.cues.map(id=>{const cue=list.find(a=>a.id===id);return E.fontFor?.(cue?.start_seconds??f.start)??E.JP}),paperFont=cueFonts[0],key='v11-physical-final-file-'+f.id+'-'+cueFonts.join('|');let cached=H.cache.get(key);if(cached)return cached;
 const[canvas,q]=E.scratch(key,f.w,f.h);q.fillStyle=E.PAPER;q.fillRect(0,0,f.w,f.h);q.fillStyle='#E5E5E2';q.fillRect(55,35,70,f.h-70);q.fillRect(f.w-115,35,60,f.h-70);q.strokeStyle=E.INK;q.lineWidth=5;q.strokeRect(25,25,f.w-50,f.h-50);q.lineWidth=1.5;q.strokeRect(41,41,f.w-82,f.h-82);
 E.text(q,'最終調査 / BONNIE × FANNY',100,155,43,E.INK,{font:paperFont});E.text(q,'FILE 127 / '+f.number,1490,155,26,E.INK,{font:E.MONO,align:'right'});line(q,E,90,188,1510,188,E.INK,4);E.text(q,f.heading,100,250,29,E.INK,{font:paperFont});
 const printed=[];
 for(let n=0;n<f.cues.length;n++){
  const cue=list.find(a=>a.id===f.cues[n]);if(!cue)throw new Error('Missing finale cue '+f.cues[n]);
  const rect=f.regions[n],layout=layoutPrintedPhrase(q,E,H,cue,rect);
  E.text(q,String(n+1).padStart(2,'0')+' / '+cue.id.replace('cue_',''),1480,rect[1]-32,22,E.INK,{font:E.MONO,align:'right'});
  for(let row=0;row<4;row++)line(q,E,rect[0],rect[1]+145+row*150,1480,rect[1]+145+row*150,'#B5B5B2',1.2);
  printed.push({id:cue.id,text:cue.text,region:rect,start:cue.start_seconds,end:cue.end_seconds,layout});
 }
 // These marks live in file coordinates and stay fixed during every pan.
 q.save();q.globalAlpha=.18;for(let n=0;n<f.cues.length+1;n++)E.art(q,'INK_SPLASH_V06',n%2?[1180,480+n*680,490,480]:[-160,260+n*680,500,460],{mode:'ink'});q.restore();
 for(let r=0;r<Math.ceil(f.h/300);r++){E.text(q,'調査記録 / 127 / BONNIE / FANNY',150,315+r*300,17,'#707070',{font:E.MONO});for(let k=0;k<19;k++)line(q,E,1490+k*2.7,315+r*300,1490+k*2.7,340+r*300,E.INK,k%3===0?2:1)}
 cached={canvas,printed};H.cache.set(key,cached);return cached;
}

function finalDocuments(c,t,E,p,H){
 H.vstage(c,t,E,p,{kind:'threads'});const cam=cameraAt(t),active=FILES[cam.file],cue=E.cueAt(t),spec=FINAL_TYPE_SPECS.find(s=>s.cue===cue?.id),density=spec?.density??0,glyphStatesByCue=new Map(),kana=finalPaperKanaStateV11(t);
 c.save();c.translate(960,525);c.rotate(-cam.roll);c.scale(cam.zoom,cam.zoom);c.translate(-cam.x,-cam.y);
 // A visible edge and connecting registration lines establish the geography
// between files while the view leaves one page and enters the next.
 c.save();c.strokeStyle='#A4A4A0';c.lineWidth=2;for(let i=0;i<2;i++){const a=pointOnFile(i,1580,660),b=pointOnFile(i+1,20,560);c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke()}c.restore();
 const visiblePages=[];
 for(let i=0;i<FILES.length;i++){
  const f=FILES[i],texture=createFileTexture(t,E,H,i);c.save();c.translate(f.x,f.y);c.rotate(f.rotation);c.fillStyle='rgba(0,0,0,.14)';c.fillRect(18,23,f.w,f.h);c.drawImage(texture.canvas,0,0);drawLetterTracks(c,t,E,H,i,density);
  for(const printed of texture.printed){const printedCue={start_seconds:printed.start,end_seconds:printed.end};c.save();if(kana&&printed.id===kana.sourceCueId)c.globalAlpha*=kana.printedAlpha;glyphStatesByCue.set(printed.id,drawPrintedPhrase(c,E,printed.layout,{t,cue:printedCue}));c.restore();}c.restore();
  const center=pointOnFile(i,f.w/2,f.h/2);if(Math.abs(center.x-cam.x)<2200&&Math.abs(center.y-cam.y)<f.h/2+1100)visiblePages.push(f.id);
 }
 c.restore();
 let typeMotionState=null,kanaState=null;
 if(spec&&cue){
  const fileIndex=FILES.findIndex(f=>f.cues.includes(cue.id)),texture=createFileTexture(t,E,H,fileIndex),printed=texture.printed.find(a=>a.id===cue.id);
  typeMotionState=drawKeywordBurst(c,t,E,H,cam,fileIndex,printed,cue,spec);
  if(kana)kanaState=drawFinalPaperKana(c,t,E,H,kana,wordAnchor(cam,fileIndex,printed.layout,kana.sourceGlyph));
  // Reprint only glyph-shaped ink/halo in the same physical coordinates. A
  // large burst can pass behind a sentence without masking its reading area.
  const f=FILES[fileIndex];c.save();c.translate(960,525);c.rotate(-cam.roll);c.scale(cam.zoom,cam.zoom);c.translate(-cam.x,-cam.y);c.translate(f.x,f.y);c.rotate(f.rotation);if(kana)c.globalAlpha*=kana.printedAlpha;const foregroundGlyphs=drawPrintedPhrase(c,E,printed.layout,{halo:true,t,cue});c.restore();
  typeMotionState={...typeMotionState,cueId:cue.id,mainSentence:cue.text,fontFamily:printed.layout.fontFamily,semanticLines:printed.layout.lines,mainSentenceGlyphCount:printed.layout.glyphs.length,mainSentenceVisibleGlyphs:foregroundGlyphs.visibleGlyphs,mainSentenceReprinted:true,glyphPop:foregroundGlyphs,baseAndForegroundVisibleCountsMatch:glyphStatesByCue.get(cue.id)?.visibleGlyphs===foregroundGlyphs.visibleGlyphs,printedAlpha:kana?.printedAlpha??1,noOpaquePlate:true,tracks:{density,rows:5+density*2,alpha:.035+density*.014},fullScreenHighContrastFlashes:0};
 }
 H.mark('asset:INK_SPLASH_V06','finale:multiple-physical-files','finale:three-fixed-spatial-files','camera:continuous-paper-pan','camera:file-to-file-travel','document:ink-stains-in-paper-coordinates','typography:printed-once-no-cue-replay');
 H.mark('typography:progressive-low-contrast-letter-tracks','typography:complete-main-sentence-above-burst');
 H.mark('typography:v11-one-glyph-paper-pop','typography:v11-shared-base-and-halo-glyph-state');
 H.mark('typography:v11-mora-paced-glyphs','typography:v11-glyph-rise-blur-trails');
 H.info({paperPageState:{index:cam.file,page:active.id,fileNumber:active.number,start:active.start,end:active.end,count:3,visiblePages,worldPlacements:FILES.map(({id,x,y,rotation,w,h})=>({id,x,y,rotation,w,h})),printedCueIds:active.cues,physicalTextureUnchanged:true},cameraState:{model:'one-camera-three-fixed-files',...cam,worldSpace:true,continuous:true,start:161.883,end:175.2,cutCount:0,fileTransitionCount:2,lyricCueId:E.cueAt(t)?.id??null,finalKana:kanaState?.camera??null},revisionState:{finalTypography:typeMotionState,finalKana:kanaState}});
}

export function renderDocumentsV11(c,t,E,p,H){
 if(t>=121.5&&t<124.22){newspaperV04(c,t,E,p,H);return true}
 if(t>=161.883&&t<175.2){finalDocuments(c,t,E,p,H);return true}
 return false;
}

export const DOCUMENTS_V11_PLAN=Object.freeze({newspaper:{start:121.5,end:124.22,source:'full_v04',pictureStarts:[121.5,121.9,122.3,122.7],assets:NEWS_ASSETS,shots:NEWS_SHOTS},finale:{start:161.883,end:175.2,fileCount:3,files:FILES,cameraKeys:CAMERA_KEYS,cutCount:0,fileTransitions:2,typeSpecs:FINAL_TYPE_SPECS,glyphTiming:FINAL_GLYPH_PACING_V11,kanaStage:FINAL_KANA_STAGE_V11,keywordPhases:{lift:.24,rush:.22,fracture:.44,settle:.32},fullScreenHighContrastFlashes:0}});
