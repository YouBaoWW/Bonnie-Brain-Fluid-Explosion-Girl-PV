/* V11 character emotion and chorus scale. All choreography uses absolute song
 * time. Existing images stay in their original colour channel; no bitmap file
 * is edited. The main lyric is drawn after the visual motifs in owned shots. */
const clamp=x=>Math.max(0,Math.min(1,x));
const mix=(a,b,u)=>a+(b-a)*u;
const unit=(t,a,b)=>clamp((t-a)/Math.max(.001,b-a));
const smooth=u=>{u=clamp(u);return u*u*(3-2*u)};
const TAU=Math.PI*2;

// Crops were selected after viewing the actual source images. Full artwork is
// 1024 x 1536; the original coloured reaction images are 120 x 120.
const CROPS={
 BONNIE_FULL_A10:{eyes:[.370,.122,.215,.039],mouth:[.465,.156,.098,.045],'half-face':[.366,.082,.257,.137]},
 BONNIE_FULL_A11:{eyes:[.405,.103,.160,.043],mouth:[.465,.134,.080,.042],'half-face':[.385,.067,.225,.129]},
 BONNIE_FULL_A13:{eyes:[.370,.120,.185,.048],mouth:[.443,.162,.085,.047],'half-face':[.353,.085,.240,.140]},
 BONNIE_EXPRESSION_01:{eyes:[.267,.437,.425,.190],mouth:[.390,.590,.200,.130],'half-face':[.25,.32,.50,.51]},
 BONNIE_EXPRESSION_02:{eyes:[.142,.448,.358,.206],mouth:[.283,.600,.192,.162],'half-face':[.108,.290,.483,.575]},
 BONNIE_EXPRESSION_03:{eyes:[.242,.400,.458,.250],mouth:[.350,.570,.240,.140],'half-face':[.225,.300,.542,.575]},
 BONNIE_EXPRESSION_04:{eyes:[.267,.440,.425,.140],mouth:[.430,.560,.300,.220],'half-face':[.183,.325,.650,.550]},
 BONNIE_EXPRESSION_05:{eyes:[.333,.775,.425,.125],mouth:[.433,.900,.192,.100],'half-face':[.225,.475,.617,.525]}
};

export function drawEmotionCloseupV11(c,t,E,H,{assetId='BONNIE_FULL_A10',part='eyes',box=[240,240,1180,480],crop=null,alpha=1,mirror=false,zoom=1,frame=false}={}){
 if(!E.hasAsset(assetId))return null;
 const sourceCrop=crop??CROPS[assetId]?.[part]??[0,0,1,1], [x,y,w,h]=box;
 c.save();c.globalAlpha*=alpha;c.beginPath();c.rect(x,y,w,h);c.clip();
 const bounds=E.art(c,assetId,[x-(zoom-1)*w/2,y-(zoom-1)*h/2,w*zoom,h*zoom],{mode:'image',crop:sourceCrop,mirror});c.restore();
 if(frame){E.rule(c,x,y-18,x+w,y-18,E.INK,2,.35);E.rule(c,x,y+h+18,x+w,y+h+18,E.INK,2,.35);}
 H.mark('asset:'+assetId,'character:bonnie','emotion:source-colour-closeup','emotion:'+part);
 return{assetId,sourceAsset:assetId,part,crop:sourceCrop,bounds,colorPreserved:true};
}

function quietMargin(c,t,E,{label='CASE 127 / OBSERVATION',index='01'}={}){
 E.text(c,label,130,175,22,E.INK,{font:E.MONO,weight:400,alpha:.42});
 E.text(c,index,1765,870,28,E.INK,{font:E.MONO,align:'right',weight:400,alpha:.40});
 E.rule(c,130,820,420,820,E.INK,1.5,.20);
 for(let i=0;i<4;i++)E.rule(c,1650+i*28,195,1650+i*28,220+(i%2)*20,E.INK,1,.18);
}

const EXPRESSION_BEATS_V11=[{"start":99.41,"end":99.85,"assetIds":["BONNIE_EXPRESSION_01"],"assets":[1],"beat_index":0,"scene_init":true,"detected_onset_seconds":99.46666666666665,"alignment_error_seconds":null,"cfr_frame":5965,"grid_beat":0},{"start":99.85,"end":100.25,"assetIds":["BONNIE_EXPRESSION_02"],"assets":[2],"beat_index":1,"scene_init":false,"detected_onset_seconds":99.856,"alignment_error_seconds":-0.006000000000000227,"cfr_frame":5991,"grid_beat":1},{"start":100.25,"end":101.03333333333333,"assetIds":["BONNIE_EXPRESSION_03"],"assets":[3],"beat_index":2,"scene_init":false,"detected_onset_seconds":100.256,"alignment_error_seconds":-0.006000000000000227,"cfr_frame":6015,"grid_beat":2},{"start":101.03333333333333,"end":101.8,"assetIds":["BONNIE_EXPRESSION_01"],"assets":[1],"beat_index":3,"scene_init":false,"detected_onset_seconds":101.032,"alignment_error_seconds":0.0013333333333349628,"cfr_frame":6062,"grid_beat":4},{"start":101.8,"end":102.58333333333333,"assetIds":["BONNIE_EXPRESSION_02","BONNIE_EXPRESSION_01","BONNIE_EXPRESSION_03"],"assets":[2,1,3],"beat_index":4,"scene_init":false,"detected_onset_seconds":101.80266666666667,"alignment_error_seconds":-0.0026666666666699257,"cfr_frame":6108,"grid_beat":6},{"start":102.58333333333333,"end":103.35,"assetIds":["BONNIE_EXPRESSION_01"],"assets":[1],"beat_index":5,"scene_init":false,"detected_onset_seconds":102.57866666666666,"alignment_error_seconds":0.0046666666666652645,"cfr_frame":6155,"grid_beat":8},{"start":103.35,"end":103.73333333333333,"assetIds":["BONNIE_EXPRESSION_04"],"assets":[4],"beat_index":6,"scene_init":false,"detected_onset_seconds":103.35199999999999,"alignment_error_seconds":-0.001999999999995339,"cfr_frame":6201,"grid_beat":10},{"start":103.73333333333333,"end":104.51666666666667,"assetIds":["BONNIE_EXPRESSION_05"],"assets":[5],"beat_index":7,"scene_init":false,"detected_onset_seconds":103.73866666666666,"alignment_error_seconds":-0.0053333333333256405,"cfr_frame":6224,"grid_beat":11},{"start":104.51666666666667,"end":104.9,"assetIds":["BONNIE_EXPRESSION_01"],"assets":[1],"beat_index":8,"scene_init":false,"detected_onset_seconds":104.51466666666666,"alignment_error_seconds":0.0020000000000095497,"cfr_frame":6271,"grid_beat":13},{"start":104.9,"end":105.68,"assetIds":["BONNIE_EXPRESSION_04","BONNIE_EXPRESSION_01","BONNIE_EXPRESSION_05"],"assets":[4,1,5],"beat_index":9,"scene_init":false,"detected_onset_seconds":104.90133333333333,"alignment_error_seconds":-0.001333333333320752,"cfr_frame":6294,"grid_beat":14}];
// Latest user override: retain the V07 small, original-colour single/triplet
// sequence. Only internal switch times are re-aligned to actual WAV drum peaks.
// The initial scene state is held still; it is not labelled a drum-aligned cut.
function emotionMontage(c,t,E,p,H){
 H.vstage(c,t,E,p,{kind:'plain'});
 const beat=EXPRESSION_BEATS_V11.find(b=>t>=b.start&&t<b.end)??EXPRESSION_BEATS_V11.at(-1),index=EXPRESSION_BEATS_V11.indexOf(beat),size=128;
 const u=beat.scene_init?1:unit(t,beat.start,beat.start+.09),flip=Math.max(.06,Math.abs(Math.cos(smooth(u)*Math.PI)));
 beat.assetIds.forEach((assetId,i)=>{
  const x=960+(i-(beat.assetIds.length-1)/2)*190,y=520;
  c.save();c.translate(x,y);if(u<1){if(beat.assets[i]%2)c.scale(flip,1);else c.scale(1,flip)}
  E.art(c,assetId,[-size/2,-size/2,size,size],{mode:'image'});c.restore();H.mark('asset:'+assetId);
 });
 H.info({expressionState:{style:'original-icon-sequence',colorPreserved:true,index:index+1,beatIndex:index,count:beat.assetIds.length,assets:beat.assets,assetIds:beat.assetIds,assetId:beat.assetIds[0],sourceAsset:beat.assetIds[0],size,beatStart:beat.start,start:beat.start,end:beat.end,detectedOnsetSeconds:beat.detected_onset_seconds,alignmentErrorSeconds:beat.alignment_error_seconds,sceneInitHold:beat.scene_init,phase:'original-icon-sequence',sourceReport:'01_AUDIO/expression_beats_v11.json'}});
 H.mark('expression:small-original-scale','expression:original-single-triplet-rhythm','expression:original-colour-icons','expression:drum-aligned-switches');
 if(beat.scene_init)H.mark('expression:static-initial-hold');
}

const VERSE_DETAILS=[
 [38.15,38.42,'BONNIE_FULL_A11','half-face',[210,230,970,560]],
 [38.42,38.70,'BONNIE_FULL_A10','eyes',[130,310,1090,370]],
 [38.70,38.92,'BONNIE_FULL_A11','mouth',[330,335,780,380]],
 [155.72,155.98,'BONNIE_FULL_A10','eyes',[120,280,1120,390]]
];
function verseCloseup(c,t,E,p,H,b){
 const[start,end,assetId,part,box]=b;H.vstage(c,t,E,p,{kind:'plain'});
 if(t>140)H.drawYear(c,t,E);
 const state=drawEmotionCloseupV11(c,t,E,H,{assetId,part,box,zoom:mix(1,1.06,smooth(unit(t,start,end))),frame:part==='eyes'});
 quietMargin(c,t,E,{label:'BONNIE / 127',index:'EYE'});
 // One broad reading line avoids splitting a word across a narrow column.
 H.vtype(c,t,E,p,{x:960,y:835,w:1660,h:215,maxSize:105,arrangement:'line',carrierLocked:true,ghost:false});
 H.info({characterDetailState:{...state,start,end,returnTo:t>140?'existing-duo-then-single-SMS':'existing-leg-camera',mainPhrase:E.cueAt(t)?.text??''}});
 H.mark('character:v11-emotional-insert','lyric:complete-beside-emotion');
}

function lensToEye(c,t,E,p,H){
 H.vstage(c,t,E,p,{kind:'plain'});const u=unit(t,43.74,45.24),cx=mix(590,720,smooth(u)),cy=485,r=mix(260,300,smooth(u));
 quietMargin(c,t,E,{label:'EVIDENCE / OPTICAL RECORD',index:'127'});
 // Normal paper remains outside the glass. The reverse field is local only.
 c.save();c.beginPath();c.arc(cx,cy,r,0,TAU);c.clip();c.fillStyle=E.INK;c.fillRect(cx-r,cy-r,r*2,r*2);
 c.save();c.globalAlpha=.28;c.font=`22px ${E.MONO}`;c.fillStyle=E.PAPER;
 for(let row=0;row<26;row++){const shift=(t*40+row*13)%95;c.fillText('127 / 文字演示文字演示文字 / BONNIE / 127',cx-r-80-shift,cy-r+28+row*24)}c.restore();
 const eye=unit(t,44.42,44.83);let detail=null;
 if(eye>0){c.save();c.globalAlpha=eye;detail=drawEmotionCloseupV11(c,t,E,H,{assetId:'BONNIE_FULL_A10',part:'eyes',crop:[.376,.126,.101,.042],box:[cx-r,cy-r*.58,r*2,r*1.16],zoom:mix(1.12,1.40,eye)});c.restore()}
 c.restore();E.circle(c,cx,cy,r+9,E.INK,10);E.circle(c,cx,cy,r+21,E.INK,2);
 E.rule(c,cx+r*.70,cy+r*.70,cx+r*1.38,cy+r*1.38,E.INK,45,1);
 // Lens detail never replaces the lyric: the whole phrase stays outside it.
 const cue=E.cueAt(t),phrase=(cue?.text??'').replace('无理','\n无理');
 H.typewriterText(c,t,E,{text:phrase,box:[1100,350,760,360],start:cue?.start_seconds??43.74,end:Math.min(cue?.end_seconds??45.24,(cue?.start_seconds??43.74)+.32),size:90});
 H.mark('prop:magnifier','lens:v11-local-inverse-dense-type','lens:v11-to-real-single-eye','lyric:complete-outside-lens');
 H.info({characterDetailState:{kind:'lens-to-single-eye',part:'eyes',start:43.74,end:45.24,eyeProgress:eye,sourceAsset:'BONNIE_FULL_A10',crop:detail?.crop??null,mainPhrase:E.cueAt(t)?.text??'',localInversionOnly:true}});
}

function maskedHeadWords(c,t,E,H,id,box,amount,{rows=20,color=E.PAPER}={}){
 const [words,w]=E.scratch('v11-head-words-'+id,1920,1080),[mask,m]=E.scratch('v11-head-mask-'+id,1920,1080);
 E.art(m,id,box,{mode:'ink',alignY:'top'});H.mark('asset:'+id);
 const left=id==='SIL03',x=left?0:1320;
 for(let row=0;row<rows;row++){if(row/rows>amount)continue;const yy=100+row*48,xx=x+(row%2)*20;E.text(w,'調査 / 過負荷 / 証拠 / 127',xx,yy,33+(row%3)*7,color,{font:E.JP,weight:row%3?400:700,alpha:.34});}
 w.globalCompositeOperation='destination-in';w.drawImage(mask,0,0);w.globalCompositeOperation='source-over';c.drawImage(words,0,0);
}

function headChorus(c,t,E,p,H,second){
 H.vstage(c,t,E,p,{kind:'rays'});
 H.character(c,t,E,'SIL03',[-700,-200,1650,1650],{silhouette:true,keepTie:true});H.character(c,t,E,'FANNY_PROFILE',[1040,-210,1650,1650],{role:'fanny',silhouette:true,keepTie:true});
 const a=second?147.59:60.88,b=second?148.52:62.44,u=unit(t,a,b),fill=smooth(unit(t,a,a+(second?.52:.84)));
 if(second){maskedHeadWords(c,t,E,H,'SIL03',[-700,-200,1650,1650],fill);maskedHeadWords(c,t,E,H,'FANNY_PROFILE',[1040,-210,1650,1650],fill);}
 const burst=unit(t,a+(second?.46:.66),a+(second?.82:1.15)),word=second?'過負荷':'脳浆';
 if(burst>0){
  // Whole keyword moves in depth; readable main sentence is rendered last.
  const scale=mix(second?.65:.75,second?2.8:1.45,smooth(burst));c.save();c.translate(960,515);c.scale(scale,scale);c.rotate((1-burst)*(second?.16:-.08));
  E.text(c,word,0,100,second?340:280,E.INK,{font:E.JP,align:'center',alpha:(1-burst)*(second?.19:.13)});c.restore();
  if(second)for(let i=0;i<18;i++){const sign=i%2?1:-1,angle=H.hash(i*19+8)*TAU,rr=70+burst*(400+H.hash(i*17)*720),x=960+Math.cos(angle)*rr,y=520+Math.sin(angle)*rr*.55;c.save();c.translate(x,y);c.rotate(sign*burst*.8);E.text(c,i%3?'証':'127',0,0,28+H.hash(i)*55,E.INK,{font:E.JP,alpha:.20*(1-burst)});c.restore();}
 }
 H.contrastType(c,t,E,p,{x:960,y:525,w:1770,h:640,maxSize:245,carrierLocked:true,ghost:false});
 H.mark(second?'chorus:v11-head-word-containers':'chorus:v11-first-keyword-scale',second?'chorus:v11-center-burst-fragments':'chorus:v11-keyword-burst');
 H.info({revisionState:{chorusEnhancement:{round:second?2:1,phase:burst>0?'center-burst':'accumulate',density:second?40:3,fill,burst,mainPhrase:E.cueAt(t)?.text??'',mainSentenceDrawnLast:true,wholeScreenFlash:false}}});
}

function evidenceWeb(c,t,E,H,{a=149.88,b=150.63,scale=1}={}){
 const u=unit(t,a,b),release=smooth(u);c.save();c.globalAlpha=.28*(1-u*.7);c.strokeStyle=E.INK;c.lineWidth=1.5;
 const points=[];for(let i=0;i<16;i++){const angle=i/16*TAU+H.hash(i)*.25,r=230+H.hash(i+127)*700;points.push([960+Math.cos(angle)*r*scale,525+Math.sin(angle)*r*.52*scale])}
 // Leave the central reading rectangle entirely clear of decorative marks.
 c.beginPath();c.rect(0,90,1920,170);c.rect(0,800,1920,160);c.rect(0,260,340,540);c.rect(1580,260,340,540);c.clip();
 for(let i=0;i<points.length;i++){const[x,y]=points[i],[xx,yy]=points[(i*5+3)%points.length];c.beginPath();c.moveTo(x,y);c.lineTo(mix(x,xx,release),mix(y,yy,release));c.stroke();E.circle(c,x,y,6,E.INK,2);E.text(c,i%3?'証拠':'127',x+10,y-10,24,E.INK,{font:E.MONO,weight:400});}c.restore();
 H.mark('chorus:v11-evidence-web','chorus:v11-fragments-linked-in-depth');
 H.info({revisionState:{chorusEnhancement:{round:2,phase:'evidence-web-release',nodeCount:16,progress:u,readingAreaProtected:[340,260,1240,540],wholeScreenFlash:false}}});
}

export function renderCharacterV11(c,t,E,p,H){
 if(t>=99.41&&t<105.68){emotionMontage(c,t,E,p,H);return true}
 const detail=VERSE_DETAILS.find(b=>t>=b[0]&&t<b[1]);if(detail){verseCloseup(c,t,E,p,H,detail);return true}
 if(t>=43.74&&t<45.24){lensToEye(c,t,E,p,H);return true}
 if(t>=60.88&&t<62.44){headChorus(c,t,E,p,H,false);return true}
 if(t>=147.59&&t<148.52){headChorus(c,t,E,p,H,true);return true}
 return false;
}

const FIRST_ACCENTS=[[59.53,59.94,'咲'],[63.55,64.03,'狂'],[71.44,71.99,'激'],[73.48,74.02,'月']];
const SECOND_ACCENTS=[[150.91,151.47,'狂'],[158.99,159.64,'過負荷'],[160.70,161.33,'宇宙']];
export function overlayCharacterV11(c,t,E,p,H){
 if(t>=149.88&&t<150.63){evidenceWeb(c,t,E,H);return}
 const second=t>=147,hit=(second?SECOND_ACCENTS:FIRST_ACCENTS).find(b=>t>=b[0]&&t<b[1]);if(!hit)return;
 const[a,b,word]=hit,u=unit(t,a,b),strength=second?1.45:1;
 c.save();c.beginPath();c.rect(0,90,1920,185);c.rect(0,800,1920,160);c.clip();
 const alpha=Math.sin(Math.PI*u)*.48;
 for(let i=second?2:0;i>=0;i--){const z=1+u*.45+i*.08;c.save();c.translate(second?1250:960,second?870:235);c.scale(z,z);c.rotate((1-u)*(second?.13:-.10));E.text(c,word,(i-(second?1:0))*45,0,185*strength,E.INK,{font:E.JP,align:'center',alpha:alpha/(i+1),outline:i?2:0});c.restore();}
 c.restore();H.mark('chorus:v11-keyword-independent-motion',second?'chorus:v11-second-larger-scale':'chorus:v11-first-keyword-scale');
 H.info({revisionState:{chorusEnhancement:{round:second?2:1,phase:'accent-release',word,progress:u,copyCount:second?3:1,scale:strength,readingAreaProtected:[0,275,1920,525],wholeScreenFlash:false}}});
}
