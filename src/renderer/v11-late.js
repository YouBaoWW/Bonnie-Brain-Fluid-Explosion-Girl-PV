/* V06: authored, absolute song-time choreography for both choruses and verse 2.
 * No source or previously delivered movie is mutated by this module. */
import {drawTriplePropsV06,drawCabinetV06,drawArcLyricV06} from './v11-early.js';
import {renderDocumentsV11,drawFinalSolarLyricV11} from './v11-documents.js';

const mix=(a,b,u)=>a+(b-a)*u;
const sat=x=>Math.max(0,Math.min(1,x));
const ease=x=>{x=sat(x);return x*x*(3-2*x)};
function asset(c,t,E,H,id,box,o={}){if(!E.hasAsset(id))return false;E.art(c,id,box,o);H.mark('asset:'+id);return true}
function line(c,E,a,b,d,e,color=E.INK,width=2){E.rule(c,a,b,d,e,color,width,1)}
function localCue(E,t,text,start,end){const old=E.cueAt(t);return{...E,cueAt:()=>({...(old??{}),id:old?.id??'v06-decoration',text,start_seconds:start,end_seconds:end})}}
function inkField(c,t,E,H,{dark=false,alpha=.13}={}){
 const color=dark?E.PAPER:E.INK;c.save();c.globalAlpha=alpha;c.font=`17px ${E.MONO}`;c.fillStyle=color;
 for(let r=0;r<37;r++){const y=112+r*24;const shift=(t*13+r*7)%80;for(let side=0;side<2;side++){const x=side?1050:60;c.fillText('CASE 127 / BONNIE / FANNY / 調査 / 記録 / 証拠照合',x-shift,y)}}c.restore();
 c.save();c.strokeStyle=color;c.globalAlpha=.25;c.lineWidth=1.5;for(let i=0;i<5;i++){c.beginPath();c.ellipse(960,540,260+i*120,390+i*100,Math.sin(t*.14)*.06,0,Math.PI*2);c.stroke()}c.restore();H.mark('background:case-microtype-arcs');
}
function duo(c,t,E,p,H){
 H.vstage(c,t,E,p,{kind:'plain'});E.rect(c,0,90,960,870,E.INK);
 c.save();c.beginPath();c.rect(0,90,960,870);c.clip();inkField(c,t,E,H,{dark:true});c.restore();
 c.save();c.beginPath();c.rect(960,90,960,870);c.clip();inkField(c,t,E,H,{dark:false});c.restore();
 // Independent positive/negative halves; only upper bodies enter the composition.
 // The adjacent portrait/upper-body poses share one physical entrance.
 // Anchor it to song time, so changing pose never starts the same motion again.
 const entryStart=t<140?63.22:150.63,u=ease(sat((t-entryStart)/.24));
 H.character(c,t,E,'BONNIE_FULL_A11',[-120,90+(1-u)*180,1070,1850],{silhouette:true,keepTie:true,color:'white'});
 H.character(c,t,E,'FANNY_FULL_V05',[1040,95-(1-u)*160,1080,1870],{role:'fanny',silhouette:true,keepTie:true,color:'black',mirror:true});
 // Retain the translucent carrier, then choose each solid glyph pixel from
 // the actual scene beneath it. This includes white Bonnie, black Fanny,
 // both background halves, moving ties and their anti-aliased contours.
 const strip=[90,420,1740,240],opacity=.30;c.save();c.globalAlpha*=opacity;E.rect(c,...strip,E.INK);c.restore();
 const cue=E.cueAt(t),body=(cue?.text??'').replace(/^さあ/,''),F=localCue(E,t,body,t<140?63.22:150.63,cue?.end_seconds??p.end),[mask,m]=E.scratch('v11-duo-actual-scene-glyph-mask',1920,1080);
 H.vtype(m,t,F,p,{x:960,y:540,w:1680,h:240,maxSize:140,color:'#FFFFFF',halo:false,arrangement:'line',carrierLocked:true,ghost:false});
 const scene=c.getImageData(...strip),glyph=m.getImageData(...strip),background=scene.data,pixels=glyph.data,linear=new Float32Array(256);
 for(let i=0;i<256;i++){const v=i/255;linear[i]=v<=.04045?v/12.92:((v+.055)/1.055)**2.4}
 const luminance=(d,i)=>.2126*linear[d[i]]+.7152*linear[d[i+1]]+.0722*linear[d[i+2]],threshold=.179;
 let blackPixels=0,whitePixels=0;
 for(let i=0;i<pixels.length;i+=4){if(pixels[i+3]===0)continue;const ink=luminance(background,i)>=threshold?0:255;pixels[i]=pixels[i+1]=pixels[i+2]=ink;if(ink)whitePixels++;else blackPixels++;}
 // Only RGB changes. Original reveal/exit and anti-aliasing alpha are kept.
 m.putImageData(glyph,strip[0],strip[1]);c.drawImage(mask,...strip,...strip);
 const displayed=c.getImageData(...strip).data;let minSolidContrast=Infinity,minOpaqueContrast=Infinity,solidPixels=0,opaquePixels=0;
 for(let i=0;i<pixels.length;i+=4){const a=pixels[i+3];if(a<230)continue;const before=luminance(background,i),after=luminance(displayed,i),ratio=(Math.max(before,after)+.05)/(Math.min(before,after)+.05);solidPixels++;minSolidContrast=Math.min(minSolidContrast,ratio);if(a>=253){opaquePixels++;minOpaqueContrast=Math.min(minOpaqueContrast,ratio)}}
 E.text(c,'BONNIE',80,180,24,E.PAPER,{font:E.MONO});E.text(c,'FANNY',1700,180,24,E.INK,{font:E.MONO});
 H.mark('chorus:upper-body-black-white','lyric:dedicated-center-strip','chorus:single-continuous-entry','lyric:v11-translucent-center-strip','lyric:v11-actual-scene-black-white-contrast');H.info({revisionState:{duoEntry:{start:entryStart,end:entryStart+.24,progress:u,bonnieY:90+(1-u)*180,fannyY:95-(1-u)*160,poseStart:p.start},duoReadingStrip:{opacity,bounds:strip,glyphColors:['#000000','#FFFFFF'],actualSceneContrast:true,linearLuminanceThreshold:threshold,blackPixels,whitePixels,solidAlphaThreshold:230/255,solidPixels,opaquePixels,minSolidContrast:solidPixels?minSolidContrast:null,minOpaqueContrast:opaquePixels?minOpaqueContrast:null,originalGlyphAlphaPreserved:true,halo:false,characterVisibleThroughPlate:true,contrastMeasurement:'actual composited pixels versus actual post-carrier scene'}}});
}
function kana(c,t,E,p,H){
 H.vstage(c,t,E,p,{kind:'plain'});const span=p.end-p.start,u=sat((t-p.start)/span),second=u>=.5;
 const text='さあ',fullStart=p.start+(second?span/2:0),end=p.start+(second?span:span/2),arrival=.05,departure=.05,entry=H.out((t-fullStart)/arrival),exit=H.out((t-(end-departure))/departure),weight=second?300:900;
 // Two fixed word planes share a centre but occupy different depths. The
 // camera pushes through the bold foreground and takes a short orbit into
 // the offset fine word, rather than panning between two separate screens.
 const middle=p.start+span/2,enterShot=H.out((t-p.start)/arrival),travel=H.inOut((u-.36)/.28),leaveShot=H.out((t-(p.end-departure))/departure);
 const cameraX=mix(-120,160,u)+Math.sin(u*Math.PI)*140,cameraY=Math.sin(u*Math.PI*1.3)*45-leaveShot*80,cameraZ=mix(-1120,350,travel)+Math.sin(u*Math.PI)*45,focal=1050*(1+(1-enterShot)*.15+leaveShot*.10),yaw=Math.sin(u*Math.PI)*.07,roll=mix(-.12,.09,u)+Math.sin(u*Math.PI*2)*.04;
 const project=(x,y,z)=>{const xx=x-cameraX,yy=y-cameraY,zz=z-cameraZ,cs=Math.cos(yaw),sn=Math.sin(yaw),vx=cs*xx-sn*zz,vz=sn*xx+cs*zz,cr=Math.cos(roll),sr=Math.sin(roll),k=focal/Math.max(70,vz);return[960+(vx*cr-yy*sr)*k,520+(vx*sr+yy*cr)*k]};
 const quad=(x,y,z,w,h,r=0)=>{const cs=Math.cos(r),sn=Math.sin(r);return[[-w/2,-h/2],[w/2,-h/2],[w/2,h/2],[-w/2,h/2]].map(([a,b])=>project(x+a*cs-b*sn,y+a*sn+b*cs,z))};
 const[world,q]=E.scratch('v11-kana-depth-world',3200,1800);q.fillStyle=E.PAPER;q.fillRect(0,0,3200,1800);
 // Paper edges and registration tracks are fixed behind both words. Their
 // apparent scale/angle therefore changes continuously with the same camera.
 for(let i=0;i<5;i++){E.rule(q,0,305+i*18,3200,305+i*18,E.INK,i===0?4:1,.25);E.rule(q,0,1410+i*18,3200,1410+i*18,E.INK,i===4?4:1,.25)}
 E.rule(q,350,0,350,1800,E.INK,2,.14);E.rule(q,2790,0,2790,1800,E.INK,2,.14);
 for(let i=0;i<8;i++){const x=420+i*330;E.rule(q,x,400,x,425+(i%3)*15,E.INK,2,.24);E.rule(q,x,1315,x,1340+(i%3)*15,E.INK,2,.24)}
 q.save();q.globalAlpha=.14;E.art(q,'INK_SPLASH_V06',[40,140,930,710],{mode:'ink'});E.art(q,'INK_SPLASH_V06',[2440,1100,930,710],{mode:'ink'});q.restore();H.mark('asset:INK_SPLASH_V06');
 for(let i=0;i<5;i++){E.text(q,'CASE 127 / SIGNAL / 証拠 / 記録',510,520+i*35,22,E.INK,{font:E.MONO,alpha:.14,weight:400});E.text(q,'BONNIE × FANNY / OBSERVATION',2090,1140+i*35,22,E.INK,{font:E.MONO,alpha:.14,weight:400})}
 const fonts=['"MS Gothic","Yu Gothic",sans-serif','"Yu Gothic Light","Yu Gothic","MS Gothic",sans-serif'];
 const wordTexture=(key,size,wgt,font)=>{const[s,a]=E.scratch(key,2200,1300);E.text(a,text,1100,965,size,E.INK,{font,align:'center',weight:wgt});return s};
 const bold=wordTexture('v11-kana-depth-bold',925,900,fonts[0]),fine=wordTexture('v11-kana-depth-fine',770,300,fonts[1]);
 const boldAlpha=1-H.out((t-(middle-departure))/departure),fineAlpha=.18+.82*H.out((t-(middle-.015))/arrival),echoAlpha=Math.sin(travel*Math.PI)*.13;
 c.save();c.beginPath();c.rect(0,90,1920,870);c.clip();
 H.projectPlane(c,world,quad(0,0,1800,6400,3600));
 H.projectPlane(c,fine,quad(160,-80,1300,2200,1300,.035),{alpha:fineAlpha*(1-leaveShot*.80)});
 // Only one pale echo per kana, at distinct depths, makes the optical offset
 // legible without repeating the whole phrase across the reading area.
 if(echoAlpha>.001){for(const[ch,x,y,z]of[['さ',-650,-180,720],['あ',620,110,900]]){const[s,a]=E.scratch('v11-kana-glyph-echo-'+ch,900,1200);E.text(a,ch,450,890,780,E.INK,{font:fonts[1],align:'center',weight:300});H.projectPlane(c,s,quad(x,y,z,900,1200,ch==='さ'?-.16:.14),{alpha:echoAlpha})}}
 if(boldAlpha>.001)H.projectPlane(c,bold,quad(-120,30,0,2200,1300,-.025),{alpha:boldAlpha});c.restore();
 H.mark('kana:two-appearances-bold-thin','kana:v11-three-frame-impact','kana:v11-large-cropped-glyphs','kana:v11-shared-physical-world','camera:v11-continuous-depth-orbit','kana:v11-individual-glyph-offset-trails');H.info({revisionState:{kana:{pass:second?2:1,weight,start:fullStart,end,arrivalSeconds:arrival,departureSeconds:departure,entry,exit,fontSize:second?770:925,fullWordVisible:second?fineAlpha>.95:boldAlpha>.95,wholeScreenFlash:false,worldSize:[6400,3600],worldWords:[{text,center:[-120,30,0],weight:900},{text,center:[160,-80,1300],weight:300}],camera:{x:cameraX,y:cameraY,z:cameraZ,focal,yaw,roll,travel,path:'continuous-depth-push-short-orbit'},sameWorldAcrossPasses:true,paperAndEvidenceDepth:true,middlePhoneRemoved:true,individualEchoCount:echoAlpha>.001?2:0,boldAlpha,fineAlpha}}});
}
function years(c,t,E,p,H){
 H.vstage(c,t,E,p,{kind:'archive'});inkField(c,t,E,H,{alpha:.06});H.drawYear(c,t,E);
 const second=t>140,a=second?152.63:65.15,entry=second?155.0:67.55;
 if(t<a+.25){const leave=ease((t-a)/.25);H.character(c,t,E,'BONNIE_FULL_A11',[-10,100-leave*1700,830,1360],{silhouette:true,keepTie:true,color:'white'});H.character(c,t,E,'FANNY_FULL_V05',[1130,105+leave*1700,830,1360],{role:'fanny',silhouette:true,keepTie:true,mirror:true});}
 if(t>=entry){const v=ease((t-entry)/.40);H.character(c,t,E,'BONNIE_PHONE_V06',[-370-(1-v)*700,40,1280,1600],{silhouette:true,keepTie:true,rotation:mix(-.35,0,v)});}
 if(t>=entry+.32){const v=ease((t-entry-.32)/.4);H.character(c,t,E,'FANNY_FULL_V05',[1250+(1-v)*800,-40,1240,1570],{role:'fanny',silhouette:true,keepTie:true,mirror:true,rotation:mix(.42,0,v)});}
 H.vtype(c,t,E,p,{x:960,y:t<a+1.37?800:250,w:1570,h:320,maxSize:145,arrangement:'line'});
 H.mark('year:early-phone-bonnie-to-fanny','timing:continuous-character-entry');
}
function hug(c,t,E,p,H){
 H.vstage(c,t,E,p,{kind:'archive'});inkField(c,t,E,H,{alpha:.06});
 // The source already contains two crossed legs and both boots. Keep its full
 // height above the lower matte instead of enlarging the knees past the crop.
 const bonnieBox=[20,110,610,814],fannyBox=[1310,110,610,814],bubbleBox=[640,295,640,320];
 H.character(c,t,E,'BONNIE_PHONE_V06',bonnieBox,{silhouette:true,keepTie:true});H.character(c,t,E,'FANNY_FULL_V05',fannyBox,{role:'fanny',silhouette:true,keepTie:true,mirror:true});
 const cue=E.cueAt(t),start=cue?.start_seconds??p.start,end=Math.min(cue?.end_seconds??p.end,start+.42),state=H.smsBubble(c,t,E,{text:cue?.text??'',box:bubbleBox,start,end,tail:'left',size:95,key:'chorus-hug'});H.mark('chat:single-phone-message','chat:hug-early-complete','character:v11-hug-full-two-legs');H.info({chatState:{cueId:cue?.id??null,phrase:cue?.text??'',parts:[state],ordered:true,start,end},revisionState:{hugLegComposition:{revision:'V11-001',round:1,sourceAsset:'BONNIE_PHONE_V06',sourceSize:[1024,1536],baseBox:bonnieBox,partnerBox:fannyBox,bubbleBounds:bubbleBox,activeBounds:[0,90,1920,870],legSourceRegions:[[289,1130,166,315],[462,1240,208,283]],diagnosis:'both-source-legs-present; previous-frame-bottom-crop',sourceModified:false}}});
}
function singleHug(c,t,E,p,H){
 H.vstage(c,t,E,p,{kind:'archive'});inkField(c,t,E,H,{alpha:.06});
 const bonnieBox=[90,110,650,814],bubbleBox=[760,280,1050,330];
 H.character(c,t,E,'BONNIE_PHONE_V06',bonnieBox,{silhouette:true,keepTie:true});
 const cue=E.cueAt(t),start=cue?.start_seconds??p.start,end=Math.min(cue?.end_seconds??p.end,start+.42),state=H.smsBubble(c,t,E,{text:cue?.text??'',box:bubbleBox,start,end,tail:'left',size:125,key:'second-chorus-single-hug'});H.mark('chat:hug-early-complete','character:v11-hug-full-two-legs');H.info({chatState:{cueId:cue?.id??null,phrase:cue?.text??'',parts:[state],ordered:true,start,end},revisionState:{hugLegComposition:{revision:'V11-001',round:2,sourceAsset:'BONNIE_PHONE_V06',sourceSize:[1024,1536],baseBox:bonnieBox,bubbleBounds:bubbleBox,activeBounds:[0,90,1920,870],legSourceRegions:[[289,1130,166,315],[462,1240,208,283]],diagnosis:'both-source-legs-present; previous-frame-bottom-crop',sourceModified:false}}});
 H.mark('character:single-bonnie-preserved','chat:single-phone-message','chorus:single-hug-phone-silhouette');
}
function overload(c,t,E,p,H){
 H.vstage(c,t,E,p,{kind:'archive'});inkField(c,t,E,H,{alpha:.06});const u=sat((t-p.start)/.50);
 c.save();c.translate(560,545);c.rotate(-.06+t*.008);c.globalAlpha=ease(u);asset(c,t,E,H,'INK_SPLASH_V06',[-760,-650,1520,1300],{mode:'ink'});c.restore();
 drawCabinetV06(c,t,E,p,H,{scatter:true,paperCount:14,box:[1390,130,540,810]});
 H.vtype(c,t,E,p,{x:940,y:530,w:1090,h:550,maxSize:185,halo:true});H.mark('overload:generated-ink-center-cabinet-right','typography:overload-without-opaque-plate');
}
function opticRecord(c,t,E,p,H){
 H.vstage(c,t,E,p,{kind:'threads'});const u=sat((t-76.22)/(77.83-76.22));
 const [page,q]=E.scratch('v06-optic-record',1600,1000);q.fillStyle=E.PAPER;q.fillRect(0,0,1600,1000);q.strokeStyle=E.INK;q.lineWidth=5;q.strokeRect(25,25,1550,950);
 E.text(q,'調査記録 / CASE 127',105,145,48,E.INK,{font:E.JP});line(q,E,95,175,1505,175,E.INK,4);
 const rows=['演示文字演示 字 示文字演','演示 01　文字演示文字演示文','演示 02　文字演示文字演示文字','演示文字演示文字演示文字演示','演示文字演示文字演示'];rows.forEach((s,i)=>{E.text(q,s,120,285+i*115,39,E.INK,{font:E.JP});line(q,E,115,305+i*115,1480,305+i*115,E.INK,1)});
 H.projectPlane(c,page,H.cameraQuad({x:960,y:520,w:1640,h:1025,roll:-.07+u*.03}));
 H.vprop(c,t,E,'magnifier',[450+u*390,80,900,900],{sourceCanvas:c.canvas,region:{x:640+u*220,y:300,w:300,h:300},zoom:1.7,rotation:-.2+u*.28});H.mark('case:real-readable-investigation-record');
}
function signalPassage(c,t,E,p,H){
 const dark=Math.floor((t-77.83)/2.12)%2===1;H.vstage(c,t,E,p,{dark,kind:'threads'});const ink=dark?E.PAPER:E.INK,paper=dark?E.INK:E.PAPER,u=sat((t-77.83)/(99.41-77.83));inkField(c,t,E,H,{dark,alpha:.07});
 H.vprop(c,t,E,'paper',[90+Math.sin(t*.32)*30,185,620,760],{ink,paper,rotation:-.09+Math.sin(t*.21)*.035,header:'EVIDENCE / 127',seed:127});
 H.vprop(c,t,E,'flip-phone',[1390+Math.sin(t*.34)*30,180,510,830],{ink,paper,screenText:'NO SIGNAL\n×',rotation:.08+Math.sin(t*.2)*.025});
 const cue=E.cueAt(t),text=cue?.text??'';H.vtype(c,t,E,p,{x:995,y:520,w:850,h:700,maxSize:150,color:ink,halo:false});
 for(let i=0;i<8;i++){const yy=820+i*12;line(c,E,100,yy,650,yy,ink,i%3?1:3)}
 H.mark('phone:corrected-currently-unavailable','phone:display-without-parentheses','transition:black-white-file-phone','motion:continuous-signal-passage');H.info({revisionState:{phonePassage:{dark,progress:u,documents:true,phone:true}}});
}

// Local original PV was sampled at 10 fps: single small squares -> RGB triplet
// -> black -> yellow/cyan -> black -> second triplet. It is not a five-card slide.
const EXPRESSION_BEATS=[
 [99.41,99.90,[1]], [99.90,100.25,[2]], [100.25,101.00,[3]],
 [101.00,101.80,[1]], [101.80,102.75,[2,1,3]], [102.75,103.35,[1]],
 [103.35,103.75,[4]], [103.75,104.55,[5]], [104.55,105.08,[1]], [105.08,105.68,[4,1,5]]
];
function expressions(c,t,E,p,H){
 H.vstage(c,t,E,p,{kind:'plain'});const beat=EXPRESSION_BEATS.find(a=>t>=a[0]&&t<a[1])??EXPRESSION_BEATS.at(-1),u=sat((t-beat[0])/.09),flip=Math.max(.06,Math.abs(Math.cos(ease(u)*Math.PI))),size=128;
 beat[2].forEach((id,i)=>{const x=960+(i-(beat[2].length-1)/2)*190,y=520;c.save();c.translate(x,y);if(u<1){if(id%2)c.scale(flip,1);else c.scale(1,flip)}asset(c,t,E,H,'BONNIE_EXPRESSION_'+String(id).padStart(2,'0'),[-size/2,-size/2,size,size],{mode:'image'});c.restore()});
 H.mark('expression:small-original-scale','expression:original-single-triplet-rhythm');H.info({expressionState:{index:EXPRESSION_BEATS.indexOf(beat)+1,count:beat[2].length,assets:beat[2],size,sourceStudy:'04_KEYFRAMES/v06/late_reference/expressions_10fps.jpg'}});
}
function newspaper(c,t,E,p,H){
 H.vstage(c,t,E,p,{kind:'plain'});const u=sat((t-105.68)/3.17),[paper,q]=E.scratch('v06-newspaper',1200,1000);q.fillStyle=E.PAPER;q.fillRect(0,0,1200,1000);q.strokeStyle=E.INK;q.lineWidth=5;q.strokeRect(15,15,1170,970);
 E.text(q,'星街調査新聞',600,110,73,E.INK,{font:E.JP,align:'center'});line(q,E,40,140,1160,140,E.INK,7);E.text(q,'事件 127  /  特別調査号',45,180,24,E.INK,{font:E.MONO});
 asset(q,t,E,H,'DOCUMENT_PICTURE_01',[45,210,690,460],{mode:'print'});E.text(q,'演示文字演示文',770,265,37,E.INK,{font:E.JP});
 for(let row=0;row<13;row++)E.text(q,['演示文字演示','演示文字演示文字演','演示文字演示文'][row%3],770,320+row*25,23,E.INK,{font:E.JP});
 E.text(q,'演示文字演示文字',45,715,55,E.INK,{font:E.JP});
 const copy=['演示文字演示文字演示文字演示文','演示文字演示文字演示文字演示文','演示文字演示文字演示文字演示','演示文字演示文字演示文'];
 for(let col=0;col<4;col++){const x=48+col*290;line(q,E,x-10,750,x-10,960,E.INK,1);for(let row=0;row<9;row++){q.save();q.beginPath();q.rect(x,750,267,210);q.clip();E.text(q,copy[(row+col)%4],x,777+row*22,18,E.INK,{font:E.JP});q.restore()}}
 const angle=mix(-.12,.07,ease(u)),w=mix(1080,1010,ease(u)),h=w*1000/1200;H.projectPlane(c,paper,H.cameraQuad({x:630,y:530,w,h,roll:angle,yaw:mix(.08,-.07,u)}));
 H.vtype(c,t,E,p,{x:1515,y:565,w:700,h:680,maxSize:130});H.mark('newspaper:main-subject','newspaper:multiple-readable-columns','lyric:beside-newspaper');
}
function coffee(c,t,E,p,H){
 H.vstage(c,t,E,p,{kind:'archive'});drawArcLyricV06(c,t,E,p,H);
 asset(c,t,E,H,'COFFEE_V06',[620,350,820,650],{mode:'print'});
 const start=108.85,end=110.23,fall=sat((t-start)/(end-start)),y=mix(-150,1270,fall);c.save();c.translate(960,y);c.rotate(fall*.65);asset(c,t,E,H,'SUGAR_V06',[-65,-65,130,130],{mode:'print'});c.restore();
 H.mark('coffee:generated-cup-and-sugar-drop','coffee:sugar-falls-through-frame');H.info({revisionState:{sugarFall:{start,end,progress:fall,y,opacity:1,exited:y-65>1080,waterEffect:false}}});
}
function cityLens(c,t,E,p,H){
 H.vstage(c,t,E,p,{kind:'city'});H.coverArt(c,E,'CITY_TOKYO',{mode:'image',zoom:1.06});H.mark('asset:CITY_TOKYO');
 H.vtype(c,t,E,p,{x:960,y:255,w:1640,h:260,maxSize:140});const u=sat((t-110.37)/1.59),fall=u*u;H.vprop(c,t,E,'magnifier',[650+fall*380,-570+fall*1800,920,920],{rotation:-.35+u*1.4,scan:false});H.mark('motion:city-falling-magnifier');
}
function idol(c,t,E,p,H){
 H.vstage(c,t,E,p,{kind:'archive'});const age=t-111.96,spread=ease((age-.18)/.35),count=6;
 for(let i=0;i<count;i++){const x=mix(650,-60+i*346,spread);H.character(c,t,E,'BONNIE_FULL_A13',[x,150+Math.sin(i*.8+t*6)*10,400,730],{silhouette:true,keepTie:true});}
 E.rect(c,80,440,1760,140,'rgba(255,255,255,.78)');H.vtype(c,t,E,p,{x:960,y:510,w:1650,h:300,maxSize:145,arrangement:'line'});H.mark('idol:repeated-full-black-silhouettes-pink-ties');
}
function festival(c,t,E,p,H){
 H.vstage(c,t,E,p,{kind:'plain'});const u=sat((t-113.35)/1.59),zoom=mix(1.10,.80,ease(sat((u-.3)/.7))),spin=mix(0,-.25,ease(u));
 c.save();c.translate(960,650);c.rotate(spin);c.scale(zoom,zoom);H.character(c,t,E,'FANNY_BACK_MAG_V06',[-390,-290,780,1180],{role:'fanny',silhouette:true,keepTie:true});c.restore();
 const cue=E.cueAt(t),g=H.chars(cue?.text??'');g.forEach((ch,i)=>{const a=mix(-Math.PI+.1,-.1,i/Math.max(1,g.length-1)),x=960+Math.cos(a)*600,y=620+Math.sin(a)*340;E.text(c,ch,x,y,110,E.INK,{font:E.JP,align:'center'})});H.mark('festival:fanny-back-magnifier','camera:pullback-and-rotate-to-fanny');
}
function makeup(c,t,E,p,H){
 H.vstage(c,t,E,p,{kind:'plain'});const u=ease(sat((t-114.94)/.30)),w=mix(760,800,u),x=mix(650,1100,u);H.character(c,t,E,'FANNY_BACK_MAG_V06',[x,100,w,1240],{role:'fanny',silhouette:true,keepTie:true,rotation:mix(-.25,0,u)});H.vtype(c,t,E,p,{x:625,y:520,w:1050,h:670,maxSize:200});H.mark('continuity:fanny-rear-to-rotated-silhouette');
}
function ascii(c,t,E,p,H){
 H.vstage(c,t,E,p,{kind:'plain'});const alphabet='01X?!#%/<>[]{}+-=:_@';c.save();c.fillStyle=E.INK;c.globalAlpha=.24;c.font=`25px ${E.MONO}`;
 const tick=Math.floor((t-135.13)*14);for(let r=-1;r<31;r++){let s='';for(let col=0;col<145;col++){const n=(r+40)*391+col*127+tick*17;s+=alphabet[Math.floor(H.hash(n)*alphabet.length)]}c.fillText(s,-80+(r%2?1:-1)*((t*65)%70),90+r*31+((t*24)%31))}c.restore();
 H.vtype(c,t,E,p,{x:960,y:520,w:1700,h:470,maxSize:135,halo:true,arrangement:'line'});H.mark('background:animated-ascii-field','typography:no-opaque-plate');H.info({revisionState:{ascii:{tick,continuousScroll:true}}});
}
function handFlip(c,t,E,p,H){
 const transitionStart=139.57,transitionEnd=139.88,u=sat((t-transitionStart)/(transitionEnd-transitionStart)),dog=t>=139.725;
 H.vstage(c,t,E,p,{kind:'threads'});const turn=Math.cos(u*Math.PI);c.save();c.translate(1240,550);c.scale(Math.abs(turn)<.035?.035:Math.abs(turn),1);H.vprop(c,t,E,'hand-shadow',[-800,-650,1600,1400],{pose:dog?'dog':'beckon',progress:dog?sat((t-139.72)/1.59):sat((t-136.67)/3.05)});c.restore();H.vtype(c,t,E,p,{x:375,y:500,w:560,h:780,vertical:true,maxSize:190});H.mark('transition:hand-shadow-flip');
}
function rope(c,t,E,p,H){
 H.vstage(c,t,E,p,{kind:'plain'});for(const [y,rot,scale]of [[170,-.08,1],[850,.08,1.15],[325,-.15,.8]]){c.save();c.translate(960,y);c.rotate(rot+Math.sin(t*.8)*.012);const source=E.getAsset('ROPE_V06','print');if(source){c.drawImage(source,-1150*scale,-260*scale,2300*scale,520*scale);H.mark('asset:ROPE_V06')}c.restore()}
 H.phoneChat(c,t,E,p,{box:[610,90,700,1138],forceSingle:true,tail:'left',text:t<143.72?'':null});H.mark('rope:generated-strands','carrier:center-phone-sms','timing:rope-early-transition');
}
function profile(c,t,E,p,H,pillow=false){
 H.vstage(c,t,E,p,{kind:'threads'});const bx=pillow?[160,250,430,430]:[410,230,620,620],cx=bx[0]+bx[2]/2,cy=bx[1]+bx[3]/2;c.save();c.beginPath();c.arc(cx,cy,bx[2]/2,0,Math.PI*2);c.clip();asset(c,t,E,H,'PROFILE_ICON_V06',bx,{mode:'image'});c.restore();E.circle(c,cx,cy,bx[2]/2+6,E.INK,5);
 const cue=E.cueAt(t),parts=(cue?.text??'').split(/\s+/),text=pillow?parts.slice(1).join(''):parts[0]??'',F=localCue(E,t,text,pillow?146.55:145.84,147.59);
 if(pillow){const box=[460,260,1040,680];asset(c,t,E,H,'PILLOW_V06',box,{mode:'print'});const u=ease((t-146.64)/.25);if(u>0){const [mask,m]=E.scratch('v06-pillow-dark-mask',1920,1080);E.art(m,'PILLOW_V06',box,{mode:'ink'});const [spray,s]=E.scratch('v06-pillow-ink',1920,1080);s.save();s.translate(1030,550);s.rotate(-.2);s.scale(u,u);E.art(s,'INK_SPLASH_V06',[-350,-240,700,480],{mode:'ink'});s.restore();c.drawImage(spray,0,0);const [white,w]=E.scratch('v06-pillow-inverse',1920,1080);w.drawImage(spray,0,0);w.globalCompositeOperation='source-in';w.fillStyle=E.PAPER;w.fillRect(0,0,1920,1080);w.globalCompositeOperation='destination-in';w.drawImage(mask,0,0);w.globalCompositeOperation='source-over';c.drawImage(white,0,0)}H.mark('pillow:generated-inverse-ink-spray')}
 H.vtype(c,t,F,p,{x:pillow?1680:1330,y:510,w:400,h:770,maxSize:220,vertical:true});H.mark('avatar:replacement-user-profile');
}
function neural(c,t,E,p,H){
 E.rect(c,0,0,1920,1080,E.INK);const u=sat((t-148.52)/1.36);c.save();c.translate(960,520);c.scale(mix(1.2,2.2,ease(u)),mix(1.2,2.2,ease(u)));c.rotate(u*.2);
 for(let i=0;i<27;i++){const a=H.hash(127+i*9)*Math.PI*2,r=100+H.hash(i*13)*430,x=Math.cos(a)*r,y=Math.sin(a)*r,other=(i*7+4)%27,aa=H.hash(127+other*9)*Math.PI*2,rr=100+H.hash(other*13)*430,xx=Math.cos(aa)*rr,yy=Math.sin(aa)*rr;line(c,E,x,y,xx,yy,'#727272',1);const travel=(u*2.8+H.hash(i*23))%1;c.save();c.shadowColor='#FFFFFF';c.shadowBlur=15;c.fillStyle=E.PAPER;c.beginPath();c.arc(mix(x,xx,travel),mix(y,yy,travel),3+H.hash(i)*4,0,Math.PI*2);c.fill();c.restore();E.circle(c,x,y,4,E.PAPER,1)}c.restore();
 if(t<149.17)H.vtype(c,t,E,p,{x:960,y:520,w:1600,h:400,maxSize:150,color:E.PAPER,halo:false});H.mark('transition:neural-circuit-travel');
}
const FINAL_PAGES=[[161.883,162.48,'01'],[162.48,164.90,'02'],[164.90,166.32,'03'],[166.32,169.09,'04'],[169.09,171.14,'05'],[171.14,173.01,'06'],[173.01,175.20,'07']];
function finalDocuments(c,t,E,p,H){
 H.vstage(c,t,E,p,{kind:'threads'});const state=FINAL_PAGES.find(a=>t>=a[0]&&t<a[1])??FINAL_PAGES[0],idx=FINAL_PAGES.indexOf(state),u=sat((t-state[0])/(state[1]-state[0])),turn=ease(sat((t-state[0])/.22));
 for(let i=0;i<3;i++)H.vprop(c,t,E,'paper',[-100+i*140,190+i*120,550,700],{rotation:-.16+i*.10,seed:201+i});
 const [page,q]=E.scratch('v06-final-document',1600,1000);q.fillStyle=E.PAPER;q.fillRect(0,0,1600,1000);q.strokeStyle=E.INK;q.lineWidth=5;q.strokeRect(24,24,1552,952);E.text(q,'最終調査 / BONNIE × FANNY',80,140,47,E.INK,{font:E.JP});E.text(q,'FILE 127 / '+state[2],1490,140,26,E.INK,{font:E.MONO,align:'right'});line(q,E,70,180,1530,180,E.INK,3);
 // Every file has its own physical marks and printed document body.
 c.save();q.save();q.globalAlpha=.18;E.art(q,'INK_SPLASH_V06',idx%2?[-70,480,650,550]:[1110,50,570,510],{mode:'ink'});q.restore();c.restore();
 const cue=E.cueAt(t),phrase=cue?.text??'';H.typewriterText(q,t,E,{text:phrase,box:[110,310,1380,490],start:Math.max(cue?.start_seconds??state[0],state[0]),end:Math.min(state[1],Math.max(cue?.start_seconds??state[0],state[0])+.65),size:165});for(let r=0;r<3;r++)line(q,E,100,480+r*175,1500,480+r*175,'#AAAAAA',1.5);
 const yaw=(idx%2?1:-1)*(1-turn)*1.35+Math.sin(u*.9)*.10,roll=(idx%2?.13:-.14)+Math.sin(u*.8)*.055;H.projectPlane(c,page,H.cameraQuad({x:960,y:525,w:1740,h:1088,roll,yaw,pitch:(idx%2?.08:-.08)}));H.mark('finale:multiple-physical-files','finale:sa-a-file-switch');H.info({paperPageState:{index:idx,page:state[2],start:state[0],end:state[1],yaw,roll}});
}
function finalSolar(c,t,E,p,H){
 E.rect(c,0,0,1920,1080,E.PAPER);const u=sat((t-175.2)/2.33);H.vprop(c,t,E,'solar-system',[160,70,1600,980],{camera:'orbits',zoom:.72,center:[960,530],phase:mix(-.18,.18,u),ink:E.INK,paper:E.PAPER,seed:127});
 for(let i=0;i<6;i++){const a=i*Math.PI/3+t*.09,x=960+Math.cos(a)*800,y=520+Math.sin(a)*370;H.vprop(c,t,E,i%3===0?'flip-phone':i%3===1?'paper':'magnifier',[x-110,y-140,220,300],{ink:E.INK,paper:E.PAPER,rotation:a*.2,screenText:'127',seed:127+i})}
 H.character(c,t,E,'BONNIE_PHONE_V06',[-120,140,690,1100],{silhouette:true,keepTie:true});H.character(c,t,E,'FANNY_BACK_MAG_V06',[1340,120,700,1120],{role:'fanny',silhouette:true,keepTie:true,mirror:true});
 drawFinalSolarLyricV11(c,t,E,H,{box:[520,240,880,580]});H.mark('finale:solar-duo-colored-ties','finale:documents-phones-magnifiers');
}

export function renderLateV11(c,t,E,p,H){
 if(renderDocumentsV11(c,t,E,p,H))return true;
 if(t<62.44)return false;
 if(p.mode==='kana-turn'){kana(c,t,E,p,H);return true}
 if(p.mode==='duo-portraits'||p.mode==='duo-upper'){duo(c,t,E,p,H);return true}
 if(p.mode==='year-scene'||p.mode==='year-reentry'){years(c,t,E,p,H);return true}
 if(p.mode==='duo-hug'){hug(c,t,E,p,H);return true}
 if(p.mode==='single-hug'){singleHug(c,t,E,p,H);return true}
 if(p.mode==='overload'){overload(c,t,E,p,H);return true}
 if(t>=158.8&&t<160.59){overload(c,t,E,p,H);return true}
 if(t>=76.22&&t<77.83){opticRecord(c,t,E,p,H);return true}
 if(t>=77.83&&t<99.41){signalPassage(c,t,E,p,H);return true}
 if(p.mode==='expressions'){expressions(c,t,E,p,H);return true}
 if(p.mode==='document-law'||p.mode==='document-how'){newspaper(c,t,E,p,H);return true}
 if(p.mode==='coffee'){coffee(c,t,E,p,H);return true}
 if(p.mode==='city'){cityLens(c,t,E,p,H);return true}
 if(p.mode==='idol'){idol(c,t,E,p,H);return true}
 if(p.mode==='festival'){festival(c,t,E,p,H);return true}
 if(p.mode==='makeup'){makeup(c,t,E,p,H);return true}
 if(p.mode==='macaron'){H.vstage(c,t,E,p,{kind:'archive'});drawTriplePropsV06(c,t,E,p,H);return true}
 if(p.mode==='password'){ascii(c,t,E,p,H);return true}
 if(t>=139.57&&t<139.88){handFlip(c,t,E,p,H);return true}
 if(p.mode==='rope'){rope(c,t,E,p,H);return true}
 if(p.mode==='avatar'||p.mode==='pillow'){profile(c,t,E,p,H,p.mode==='pillow');return true}
 if(p.mode==='transition-lines'){neural(c,t,E,p,H);return true}
 if(t>=161.883&&t<175.2){finalDocuments(c,t,E,p,H);return true}
 if(t>=175.2&&t<177.53){finalSolar(c,t,E,p,H);return true}
 return false;
}
