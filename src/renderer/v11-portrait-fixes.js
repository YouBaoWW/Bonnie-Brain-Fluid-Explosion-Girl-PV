/* Latest direct V11 portrait requests. Source rasters are read-only.
 * A grayscale avatar is filtered only while drawn. The apple overlay is a
 * source-coordinate mask, with the original bite and occluding fingers kept. */
const sat=x=>Math.max(0,Math.min(1,x)),mix=(a,b,u)=>a+(b-a)*u;
const unit=(t,a,b)=>sat((t-a)/(b-a));
const APPLE_CACHE=new WeakMap();
const APPLE_BOUNDS=[391,237,476,319];

function applePaths(){
 const fruit=new Path2D();fruit.moveTo(393,278);fruit.bezierCurveTo(390,264,397,255,411,251);fruit.bezierCurveTo(420,249,425,243,437,240);fruit.bezierCurveTo(447,237,458,241,464,251);fruit.bezierCurveTo(471,261,476,274,473,287);fruit.bezierCurveTo(471,300,464,311,457,311);fruit.bezierCurveTo(449,315,446,310,440,308);fruit.bezierCurveTo(422,305,408,296,393,278);fruit.closePath();
 const bite=new Path2D();bite.moveTo(445,244);bite.bezierCurveTo(451,243,457,248,460,253);bite.bezierCurveTo(463,256,460,262,466,267);bite.lineTo(474,270);bite.bezierCurveTo(472,276,467,279,461,275);bite.bezierCurveTo(458,279,455,273,453,272);bite.bezierCurveTo(447,273,447,267,446,262);bite.bezierCurveTo(440,257,441,248,445,244);bite.closePath();
 const fingers=new Path2D();
 for(const points of [
  [[390,278],[398,274],[414,269],[430,266],[435,268],[434,275],[430,280],[410,287],[405,292],[397,296]],
  [[404,288],[415,285],[431,286],[447,289],[453,292],[452,299],[444,302],[430,299],[424,298],[418,304],[411,307],[404,304]],
  [[420,300],[437,302],[450,308],[457,313],[455,319],[447,320],[435,316],[426,315]]
 ]){fingers.moveTo(...points[0]);for(const point of points.slice(1))fingers.lineTo(...point);fingers.closePath()}
 return{fruit,bite,fingers};
}
function appleOverlay(E){
 const source=E.getAsset('BONNIE_FULL_A11','image');if(!source)throw new Error('V11 apple source missing');
 if(APPLE_CACHE.has(source))return APPLE_CACHE.get(source);
 const w=source.naturalWidth??source.width,h=source.naturalHeight??source.height;
 if(w!==1024||h!==1536)throw new Error('V11 apple mask requires the inspected full A11 source geometry');
 const[canvas,q]=E.scratch('v11-source-coordinate-apple-overlay',w,h);q.drawImage(source,0,0);const image=q.getImageData(0,0,w,h),d=image.data,{fruit,bite,fingers}=applePaths(),red=E.RED.match(/[0-9a-f]{2}/gi).map(s=>parseInt(s,16));
 let visiblePixels=0,redPixels=0,bitePixels=0;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const i=(y*w+x)*4,inFruit=x>=APPLE_BOUNDS[0]&&x<=APPLE_BOUNDS[2]&&y>=APPLE_BOUNDS[1]&&y<=APPLE_BOUNDS[3]&&q.isPointInPath(fruit,x+.5,y+.5);
  if(!inFruit||q.isPointInPath(fingers,x+.5,y+.5)){d[i+3]=0;continue}
  visiblePixels++;
  if(q.isPointInPath(bite,x+.5,y+.5)){bitePixels++;continue}
  const l=.2126*d[i]+.7152*d[i+1]+.0722*d[i+2];
  if(l<45||l>226)continue; // Preserve source black outline/halftone and white shine.
  const shade=.45+.55*l/150;d[i]=Math.min(255,Math.round(red[0]*shade));d[i+1]=Math.min(255,Math.round(red[1]*shade));d[i+2]=Math.min(255,Math.round(red[2]*shade));redPixels++;
 }
 q.putImageData(image,0,0);const result={canvas,w,h,visiblePixels,redPixels,bitePixels,bounds:APPLE_BOUNDS};APPLE_CACHE.set(source,result);return result;
}
function drawApple(c,E,box){
 const overlay=appleOverlay(E),[x,y,w,h]=box,k=Math.min(w/overlay.w,h/overlay.h),dw=overlay.w*k,dh=overlay.h*k;
 c.drawImage(overlay.canvas,x+(w-dw)/2,y,dw,dh);return{sourceBounds:overlay.bounds,sourceSize:[overlay.w,overlay.h],destinationBox:box,visiblePixels:overlay.visiblePixels,redPixels:overlay.redPixels,bitePixels:overlay.bitePixels};
}
function avatar(c,t,E,p,H){
 H.vstage(c,t,E,p,{kind:'threads'});const box=[410,230,620,620],cx=720,cy=540;
 c.save();c.beginPath();c.arc(cx,cy,310,0,Math.PI*2);c.clip();c.filter='grayscale(1)';E.art(c,'PROFILE_ICON_V06',box,{mode:'image'});c.restore();E.circle(c,cx,cy,316,E.INK,5);
 const cue=E.cueAt(t),text=(cue?.text??'').split(/\s+/)[0]??'',F={...E,cueAt:()=>({...cue,text,start_seconds:145.84,end_seconds:147.59})};
 H.vtype(c,t,F,p,{x:1330,y:510,w:400,h:770,maxSize:220,vertical:true});
 H.mark('asset:PROFILE_ICON_V06','avatar:replacement-user-profile','avatar:v11-runtime-grayscale');
 H.info({revisionState:{avatarGrayscale:{start:145.84,end:146.55,asset:'PROFILE_ICON_V06',filter:'grayscale(1)',sourceRasterModified:false,box}}});
}
function caseStack(c,t,E,p,H){
 H.vstage(c,t,E,p,{kind:'threads'});const travel=H.inOut(unit(t,177.53,180.10));
 for(let i=4;i>=0;i--)H.vprop(c,t,E,'paper',[570+i*78-travel*270,170+i*60,760,980],{rotation:(i-2)*.065-travel*.04,seed:321+i,header:'ARCHIVE / '+String(127+i),body:['演示文字演','通信記録','現場写真','追跡報告','最終記録'][i]});
 H.character(c,t,E,'SIL03',[-650+travel*140,-125,1480,1480],{silhouette:true,keepTie:true});
 E.text(c,'CASE 127',1435,350,118,E.INK,{font:E.MONO,align:'center',outline:1});E.text(c,'演示文字演示文字演',1440,450,42,E.INK,{font:E.JP,align:'center'});
}
function paperPortrait(c,t,E,p,H){
 E.rect(c,0,0,1920,1080,E.PAPER);const u=unit(t,180.10,183.28),drift=H.inOut(u),pulse=E.sampleAudio(t).pulse;
 c.save();c.strokeStyle=E.INK;c.globalAlpha=.12;c.lineWidth=1;for(let row=0;row<13;row++){c.beginPath();c.moveTo(50,130+row*62);c.lineTo(1870,130+row*62);c.stroke()}c.restore();
 for(let i=0;i<37;i++)for(let j=0;j<16;j++)if((i+j)%3===0){c.save();c.globalAlpha=.18;c.fillStyle=E.INK;c.fillRect(850+i*28-drift*45,135+j*48,2.5,2.5);c.restore()}
 for(let i=0;i<12;i++){const y=200+i*56;E.rule(c,100,y,900,510+i*11,E.INK,1,.14);E.text(c,String(i+1).padStart(2,'0')+' / '+['現場証言','通信照合','証拠記録','調査完了'][i%4],115,y-8,22,E.INK,{font:E.MONO,alpha:.57})}
 const box=[-470-drift*35,-430-drift*35,940+drift*70,1620+drift*100],x=1470-drift*35,y=530,rotation=-.025+drift*.045;
 c.save();c.translate(x,y);c.rotate(rotation);H.character(c,t,E,'BONNIE_FULL_A11',box,{silhouette:true,keepTie:true});const apple=drawApple(c,E,box);c.restore();
 ['演示文字演','演示文字演示','CASE CLOSED'].forEach((text,i)=>E.text(c,text,i===2?650:690+i*58,250+i*190,68+(i===2?10:0),E.INK,{font:i===2?E.MONO:E.fontFor(166.32),rotate:-.045+drift*.025,alpha:.80+.12*pulse}));
 E.text(c,'127 / BONNIE / LAYERED MATERIAL',90,130,20,E.INK,{font:E.MONO,weight:400});E.text(c,'BONNIE × FANNY',1830,910,23,E.INK,{font:E.MONO,align:'right'});
 H.mark('outro:v11-paper-silhouette-evidence-grid','outro:v11-restored-red-apple','outro:reference-layered-material');
 return{box,transform:{x,y,rotation},apple};
}
function outro(c,t,E,p,H){
 const entering=t<180.10,reveal=H.inOut(unit(t,179.87,180.10));let portrait;
 if(entering){caseStack(c,t,E,p,H);c.save();c.beginPath();c.rect(1920-reveal*1920,90,reveal*1920,870);c.clip();portrait=paperPortrait(c,t,E,p,H);c.restore()}
 else portrait=paperPortrait(c,t,E,p,H);
 if(t>=183.08){const close=H.inOut(unit(t,183.08,183.28));E.rect(c,0,90,1920*close,870,E.PAPER)}
 H.mark('section:outro','outro:four-distinct-shots','outro:v11-paper-to-paper-wipe');
 H.info({revisionState:{portraitPaper:{start:179.87,portraitStart:180.10,end:183.28,phase:entering?'paper-wipe':t>=183.08?'paper-exit':'paper-hold',background:'paper',characterAppearance:'black-silhouette',pinkFloralTie:true,appleColor:'restored-red-from-grayscale-source',sourceRasterModified:false,paperWipeProgress:reveal,...portrait},outroMontage:{shot:entering?'archive-to-paper-portrait':'paper-silhouette-grid',index:entering?0:1,start:entering?177.53:180.10,end:entering?180.10:183.28,transitions:['paper-edge-reveal','paper-to-paper-wipe','phone-hinge-match','envelope-iris'],referencePortrait:true}}});
}
export function renderPortraitFixesV11(c,t,E,p,H){
 if(t>=145.84&&t<146.55){avatar(c,t,E,p,H);return true}
 if(t>=179.87&&t<183.28){outro(c,t,E,p,H);return true}
 return false;
}
