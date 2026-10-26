/* V05 props: unified local paper/screen content, cached physical materials.
 * Every shape is a function of options, a fixed seed, and absolute song time.
 * Coordinates: x/y are a destination box's top-left; w/h contain the prop at
 * uniform scale. rotation is radians about its centre. Optional yaw/pitch use
 * the seamless projective plane; supplied expressions/pixel sprites keep their
 * own aspect ratio and original raster contents.
 */
import {quadFor,projectPlane} from './perspective-v02.js';

const INK='#000000',PAPER='#FFFFFF',RED='#C8102E';
const MONO='Consolas,"Courier New",monospace';
const JP='"Yu Gothic","MS Gothic","Microsoft YaHei",sans-serif';
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const hash=n=>{n=Math.imul((n|0)^0x68bc21eb,0x45d9f3b);n=Math.imul(n^(n>>>16),0x45d9f3b);return((n^(n>>>16))>>>0)/4294967296};
const layers=new Map();
const materialCache=new Map(),metrics={cacheHits:0,cacheMisses:0,projectedPixels:0,draws:0};
function material(key,w,h,draw){if(key===null){const[a,q]=scratch(`volatile-material-${w}-${h}`,w,h);draw(q);return a}let item=materialCache.get(key);if(item){materialCache.delete(key);materialCache.set(key,item);metrics.cacheHits++;return item}metrics.cacheMisses++;item=document.createElement('canvas');item.width=w;item.height=h;const q=item.getContext('2d',{willReadFrequently:true});draw(q);materialCache.set(key,item);if(materialCache.size>32)materialCache.delete(materialCache.keys().next().value);return item}
function localProject(c,image,quad,alpha=1){const xs=quad.map(p=>p[0]),ys=quad.map(p=>p[1]),x=Math.floor(Math.min(...xs))-2,y=Math.floor(Math.min(...ys))-2,w=Math.ceil((Math.max(...xs)-x+2)/32)*32,h=Math.ceil((Math.max(...ys)-y+2)/32)*32;if(![x,y,w,h].every(Number.isFinite)||w<=0||h<=0)throw new Error('Invalid V05 prop projection');if(w*h>6000000){metrics.projectedPixels+=c.canvas.width*c.canvas.height;projectPlane(c,image,quad,{alpha});return}const[a,q]=scratch('v05-local-projection',w,h);projectPlane(q,image,quad.map(p=>[p[0]-x,p[1]-y]));metrics.projectedPixels+=w*h;c.save();c.globalAlpha*=alpha;c.drawImage(a,x,y);c.restore()}
export function getPropsV05Stats(){return{...metrics,materials:materialCache.size}}
function scratch(key,w,h){let a=layers.get(key);if(!a){a=document.createElement('canvas');a.getContext('2d',{willReadFrequently:true});layers.set(key,a)}if(a.width!==w||a.height!==h){a.width=w;a.height=h}const q=a.getContext('2d');q.resetTransform();q.globalAlpha=1;q.globalCompositeOperation='source-over';q.clearRect(0,0,w,h);q.beginPath();return[a,q]}
function path(c,points,{fill,stroke=INK,width=2,close=true}={}){c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));if(close)c.closePath();if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke()}}
function line(c,x,y,xx,yy,color=INK,width=2){path(c,[[x,y],[xx,yy]],{stroke:color,width,close:false})}
function box(c,x,y,w,h,fill=INK,stroke=null,width=2){if(fill){c.fillStyle=fill;c.fillRect(x,y,w,h)}if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.strokeRect(x,y,w,h)}}
function round(c,x,y,w,h,r,fill,stroke=INK,width=2){c.beginPath();c.roundRect(x,y,w,h,r);if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke()}}
function ellipse(c,x,y,rx,ry,fill=null,stroke=INK,width=2){c.beginPath();c.ellipse(x,y,Math.max(.01,rx),Math.max(.01,ry),0,0,Math.PI*2);if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke()}}
function text(c,s,x,y,size=24,color=INK,{font=MONO,weight=700,align='left'}={}){c.save();c.font=`${weight} ${size}px ${font}`;c.textAlign=align;c.textBaseline='alphabetic';c.fillStyle=color;c.fillText(String(s),x,y);c.restore()}
function screws(c,points,color=PAPER){for(const[x,y]of points){ellipse(c,x,y,3.5,3.5,null,color,1);line(c,x-2,y+1,x+2,y-1,color,1)}}
function printNoise(c,w,h,seed=127,color=INK,count=420){c.save();c.fillStyle=color;for(let i=0;i<count;i++)c.fillRect(Math.floor(hash(seed+i*11+1)*w),Math.floor(hash(seed+i*11+2)*h),hash(i*7+seed)>.9?4:1,hash(i+seed)>.6?2:1);c.restore()}
function defaults(o){return{ink:o.ink??INK,paper:o.paper??PAPER,red:o.red??RED,seed:o.seed??127}}
function frame(c,o,W,H,draw){
 const w=o.w??W,h=o.h??H,x=o.x??0,y=o.y??0,scale=Math.min(w/W,h/H)*(o.scale??1),rotation=o.rotation??o.rotate??0,alpha=clamp(o.alpha??1),pad=o.padding??0;
 if(alpha===0)return{kind:o.kind,box:[x,y,w,h],scale,drawn:false,elements:[]};
 metrics.draws++;
 if(o.yaw||o.pitch){const[layer,q]=scratch(`prop-plane-${W}-${H}`,W+pad*2,H+pad*2);q.save();q.translate(pad,pad);draw(q);q.restore();localProject(c,layer,quadFor({x:x+w/2,y:y+h/2,w:(W+pad*2)*scale,h:(H+pad*2)*scale,yaw:o.yaw??0,pitch:o.pitch??0,roll:rotation,z:o.z??0}),alpha)}
 else{c.save();c.globalAlpha*=alpha;c.translate(x+w/2,y+h/2);c.rotate(rotation);c.scale(scale,scale);c.translate(-W/2,-H/2);c.beginPath();c.rect(-pad,-pad,W+pad*2,H+pad*2);c.clip();draw(c);c.restore()}
 return{kind:o.kind,box:[x,y,w,h],scale,rotation,drawn:true,elements:[]};
}

function signal(c,x,y,color,phase=1){for(let i=0;i<4;i++)box(c,x+i*10,y-i*7,6,9+i*7,i<=phase?color:null,color,1)}
function screen(c,t,{x,y,w,h,ink,paper,screenText,screenMode='static',seed=127,screenAsset,E,screenAssetMode='print'}){
 if(screenMode==='blank'){box(c,x,y,w,h,paper,ink,2);return null}
 box(c,x,y,w,h,paper,ink,2);c.save();c.beginPath();c.rect(x+2,y+2,w-4,h-4);c.clip();
 for(let yy=y+4;yy<y+h;yy+=4){c.globalAlpha=.08;line(c,x,yy,x+w,yy,ink,.7)}c.globalAlpha=1;
 signal(c,x+15,y+29,ink,screenMode==='signal'?Math.floor(t*1.8)%4:3);box(c,x+w-49,y+14,28,13,null,ink,1.5);box(c,x+w-19,y+18,3,5,ink);box(c,x+w-46,y+17,20,7,ink);
 const lines=String(screenText??(screenMode==='call'?'INCOMING\n127\nUNKNOWN':screenMode==='signal'?'NO SIGNAL\nSEARCHING':'CASE 127\nEVIDENCE')).split('\n');
 if(screenAsset){if(!E?.art)throw new Error('screenAsset requires E.art');E.art(c,screenAsset,[x+13,y+47,w-26,h-64],{mode:screenAssetMode})}
 else{lines.forEach((s,i)=>{const size=Math.min(w*.13,screenMode==='call'&&i===1?56:30);text(c,s,x+w/2,y+h*.35+i*h*.19,size,ink,{align:'center',font:i===1?MONO:JP})});
  if(screenMode==='call'){const yy=y+h*.86;for(let i=0;i<3;i++)line(c,x+w*.24+i*13,yy-i*7,x+w*.76-i*13,yy-i*7,ink,1.2)}}
 c.globalAlpha=.14;box(c,x,y+((t*19+seed)%Math.max(1,h)),w,2,ink);c.restore();return screenAsset??null;
}

/** One fixed, fully opened physical keypad handset, matching the user's
 * selected right-hand reference. o.open is deliberately ignored: only the
 * whole object and its screen content may change between shots. */
function flipPhoneModelV05(c,t,o={}){
 const{ink,paper,red,seed}=defaults(o);let drawnScreenAsset=null;
 // Canonical front view: both halves and every control share x=320.
 // No local skew, foreshortening or texture noise is applied to the keypad.
 const result=frame(c,o,640,1040,q=>{
  round(q,150,72,340,465,20,ink,paper,1);round(q,161,83,318,443,14,paper,ink,2);
  box(q,260,106,120,5,ink);for(let i=0;i<9;i++)ellipse(q,292+i*7,122,1,1,ink,null);
  drawnScreenAsset=screen(q,t,{x:178,y:147,w:284,h:303,ink,paper,screenText:o.screenText,screenMode:o.screenMode??'call',seed,screenAsset:o.screenAsset,E:o.E,screenAssetMode:o.screenAssetMode??'print'});
  text(q,'ASTRAL / 127',320,491,15,ink,{align:'center',weight:400});screws(q,[[170,94],[470,94],[170,514],[470,514]],ink);
  // A horizontal hinge spans the same parallel sides as the two shells.
  round(q,150,532,340,28,10,ink,paper,1);for(let i=0;i<11;i++)line(q,170+i*30,536,170+i*30,556,paper,1);
  round(q,150,555,340,453,15,ink,paper,1);round(q,161,566,318,431,9,paper,ink,2);
  round(q,180,579,280,29,5,ink);line(q,177,622,463,622,ink,1);
  ellipse(q,320,660,40,40,ink,paper,1);ellipse(q,320,660,18,18,paper,ink,1);
  for(const x of[210,430]){round(q,x-29,646,58,28,5,ink);line(q,x-8,660,x+8,660,paper,2)}
  line(q,177,710,463,710,ink,1);
  const labels=['1','2','3','4','5','6','7','8','9','*','0','#'],letters=['','ABC','DEF','GHI','JKL','MNO','PQRS','TUV','WXYZ','','',''];
  for(let i=0;i<12;i++){const x=168+(i%3)*110,y=724+Math.floor(i/3)*64;round(q,x,y,84,48,7,ink);text(q,labels[i],x+42,y+29,25,paper,{align:'center'});if(letters[i])text(q,letters[i],x+42,y+41,7,paper,{align:'center',weight:400})}
  line(q,177,974,463,974,ink,1);text(q,'127 / TELEPHONE',320,990,11,ink,{align:'center',weight:400});screws(q,[[169,575],[471,575],[169,989],[471,989]],ink);
  // Fixed strap lies outside the aligned front-face geometry.
  q.save();q.translate(490,578);q.strokeStyle=ink;q.lineWidth=7;q.beginPath();q.moveTo(0,0);q.bezierCurveTo(108,106,119,229,58,240);q.bezierCurveTo(0,250,18,126,0,0);q.stroke();q.strokeStyle=paper;q.lineWidth=1;q.stroke();path(q,[[38,223],[93,232],[79,325],[24,316]],{fill:paper,stroke:ink,width:3});text(q,'127',58,281,23,ink,{align:'center'});box(q,30,301,52,5,o.accent?red:ink);q.restore();
 });
 result.model='fixed-open-front';result.keypad={columns:3,rows:4,keyWidth:84,keyHeight:48,columnPitch:110,rowPitch:64,axisX:320};if(drawnScreenAsset)result.elements.push(drawnScreenAsset,`asset:${drawnScreenAsset}`);return result;
}

/** Large slab handset with a recessed monochrome LCD and physical controls. */
function smartphoneModelV05(c,t,o={}){
 const{ink,paper,red,seed}=defaults(o);return frame(c,o,620,1020,q=>{
  path(q,[[104,82],[502,76],[528,917],[504,948],[104,948],[87,914]],{fill:ink,stroke:paper,width:2});
  round(q,107,91,405,832,27,paper,ink,5);round(q,120,104,379,807,20,ink,paper,1);
  box(q,245,132,126,6,paper);ellipse(q,202,135,5,5,null,paper,1.5);ellipse(q,417,135,3,3,paper,null);
  screen(q,t,{x:140,y:168,w:340,h:625,ink,paper,screenText:o.screenText,screenMode:o.screenMode??'call',seed});
  round(q,256,841,103,39,12,null,paper,2);line(q,268,860,347,860,paper,1);
  line(q,96,217,90,217,ink,6);line(q,97,255,91,255,ink,6);line(q,517,293,523,293,ink,5);
  screws(q,[[121,914],[494,914]],paper);text(q,'RECORD / 127',309,902,12,paper,{align:'center',weight:400});
  q.save();q.globalAlpha=.07;path(q,[[158,179],[178,179],[462,782],[442,782]],{fill:paper,stroke:null});q.restore();
  if(o.accent)box(q,155,778,310,5,red);printNoise(q,620,1020,seed,paper,120);
 });
}

/** Real optical magnification. Snapshot before drawing prevents self-feedback.
 * region is in sourceCanvas coordinates; default region follows the lens.
 * sourceCanvas may be the live main canvas. Only its local patch is copied. */
function appleShape(q,x,y,r,ink,paper){q.save();q.translate(x,y);q.fillStyle=ink;q.beginPath();q.moveTo(0,-r*.65);q.bezierCurveTo(-r*1.2,-r*1.2,-r*1.3,r*.3,-r*.38,r);q.bezierCurveTo(-r*.1,r*1.15,.08,r*.86,r*.3,r);q.bezierCurveTo(r*1.2,r*.94,r*1.3,-r*.72,r*.4,-r*.86);q.bezierCurveTo(r*.2,-r*.9,.1,-r*.62,0,-r*.65);q.fill();line(q,0,-r*.65,r*.18,-r*1.28,ink,r*.08);path(q,[[r*.1,-r],[r*.8,-r*1.29],[r*.52,-r*.79]],{fill:ink,stroke:null});line(q,-r*.66,-r*.31,-r*.54,r*.4,paper,r*.025);q.restore()}
function lensContent(q,t,mode,E,o,W,H){
 const{ink,paper,red}=defaults(o);box(q,0,0,W,H,paper);
 if(typeof o.contentRenderer==='function'){o.contentRenderer(q,t,{w:W,h:H,mode,E});return}
 if(mode==='lyrics'){
  const phrase=E?.cueAt?.(t)?.text?.trim()??o.screenText??'CASE 127 / EVIDENCE';const chars=Array.from(phrase),lines=[];for(let i=0;i<chars.length;i+=6)lines.push(chars.slice(i,i+6).join(''));
  const visible=lines.slice(0,7),firstY=H*.5-(visible.length-1)*56+32;visible.forEach((s,i)=>text(q,s,W*.5,firstY+i*112,92,ink,{font:JP,align:'center'}));text(q,'OPTICAL / LYRIC RECORD',60,940,22,ink,{weight:400});
 }else if(mode==='newspaper'){
  newspaperV03(q,t,{...o,E,x:0,y:0,w:W,h:H,scale:1,rotation:0,yaw:0,pitch:0,alpha:1});
 }else if(mode==='city'){
  if(E?.art){E.art(q,'CITY_TOKYO',[-W*.16,H*.04,W*1.65,H*.87],{mode:'image'})}else cityV03(q,t,{x:0,y:0,w:W,h:H,drawTower:true});
  text(q,'TOKYO / 127',65,H*.92,48,ink,{weight:700});
 }else if(mode==='harakiri-relic'){
  if(!E?.art)throw new Error('harakiri-relic magnifier requires E.art');q.save();q.imageSmoothingEnabled=true;q.imageSmoothingQuality='high';E.art(q,'HARAKIRI_KNIFE',[225,225,W-450,H-450],{mode:'print'});q.restore();
 }else if(mode==='fuji'){
  // Broad, gently rising volcanic slopes; the snow edge is one soft contour.
  q.beginPath();q.moveTo(-145,822);q.bezierCurveTo(116,773,264,628,481,403);q.lineTo(544,403);q.bezierCurveTo(751,623,906,771,1169,822);q.closePath();q.fillStyle=ink;q.fill();q.strokeStyle=ink;q.lineWidth=2.5;q.stroke();
  q.beginPath();q.moveTo(316,574);q.bezierCurveTo(376,520,426,463,481,403);q.lineTo(544,403);q.bezierCurveTo(599,463,650,521,711,575);q.bezierCurveTo(665,552,643,592,600,567);q.bezierCurveTo(563,546,545,580,511,560);q.bezierCurveTo(477,540,451,576,414,559);q.bezierCurveTo(379,545,352,580,316,574);q.closePath();q.fillStyle=paper;q.fill();
  line(q,492,414,533,414,ink,2);line(q,412,605,294,795,paper,2);line(q,595,611,714,798,paper,2);
  for(const[x,y,w]of[[72,472,209],[738,458,236],[130,660,275],[650,704,292],[394,794,244]]){q.beginPath();q.moveTo(x,y);q.bezierCurveTo(x+w*.1,y-15,x+w*.2,y-18,x+w*.32,y-9);q.bezierCurveTo(x+w*.44,y-33,x+w*.65,y-24,x+w*.7,y-7);q.bezierCurveTo(x+w*.83,y-16,x+w*.94,y-8,x+w,y);q.bezierCurveTo(x+w*.78,y+10,x+w*.23,y+11,x,y);q.closePath();q.fillStyle=paper;q.fill();q.strokeStyle=ink;q.lineWidth=1.7;q.stroke();line(q,x+12,y+18,x+w-13,y+18,ink,.9)}
  for(let j=0;j<6;j++){const yy=856+j*15;q.strokeStyle=ink;q.lineWidth=j%3===0?2:1;q.beginPath();q.moveTo(35,yy);for(let x=35;x<=990;x+=24)q.lineTo(x,yy+Math.sin(x*.022+j*.7)*3);q.stroke()}
 }else if(mode==='fanny-silhouette'){
  if(!E?.art)throw new Error('fanny-silhouette magnifier requires E.art');
  // The real left-facing profile is enlarged until its shoulders lie outside
  // the circular lens. No rectangular crop edge cuts across the head.
  E.art(q,'FANNY_PROFILE',[109,25,1550,1550],{mode:'ink'});
 }else if(mode==='user-mirror'){
  if(!E?.art)throw new Error('user-mirror magnifier requires E.art');E.art(q,'CHIBI_MIRROR',[76,90,W-152,H-180],{mode:o.contentAssetMode??'print'});
 }else if(mode==='apple'){
  for(let y=70;y<H;y+=58)line(q,40,y,W-40,y,ink,.65);appleShape(q,W*.52,H*.45,W*.22,ink,paper);ellipse(q,W*.52,H*.45,W*.33,W*.33,null,ink,2);text(q,'POISON / EVIDENCE 127',W*.5,H*.85,42,ink,{align:'center'});if(o.accent)box(q,W*.25,H*.9,W*.5,5,red);
 }
}
export function magnifierV03(c,t,o={}){
 const{ink,paper}=defaults(o),W=670,H=860,w=o.w??W,h=o.h??H,x=o.x??0,y=o.y??0,scale=Math.min(w/W,h/H)*(o.scale??1),rotation=o.rotation??o.rotate??0;
 const cs=Math.cos(rotation),sn=Math.sin(rotation),lx=277,ly=270,stageX=x+w/2+((lx-W/2)*cs-(ly-H/2)*sn)*scale,stageY=y+h/2+((lx-W/2)*sn+(ly-H/2)*cs)*scale;
 const source=o.sourceCanvas??c.canvas,zoom=Math.max(1.01,o.zoom??1.8),r=200,parent=c.getTransform(),point=parent.transformPoint({x:stageX,y:stageY}),parentScale=Math.sqrt(Math.abs(parent.a*parent.d-parent.b*parent.c)),diameter=2*r*scale*parentScale/zoom;
 const scan=o.scan?1:0,region=Array.isArray(o.region)?{x:o.region[0],y:o.region[1],w:o.region[2],h:o.region[3]}:o.region??{x:point.x-diameter/2+Math.sin(t*.79)*diameter*.18*scan,y:point.y-diameter/2+Math.cos(t*.61)*diameter*.13*scan,w:diameter,h:diameter};
 const[snapshot,s]=scratch('magnifier-source',512,512),E=o.E;
 let mode=o.contentMode??'source';if(mode==='cycle'){const modes=o.contentModes??['lyrics','newspaper','city','apple'],beat=E?.sampleAudio?.(t)?.beatIndex??Math.floor((t-(o.phase??.379524))*(o.bpm??155.005)/60),index=Math.floor(beat/Math.max(1,o.beatDivision??2));mode=modes[((index%modes.length)+modes.length)%modes.length]}
 if(mode==='source'&&!o.contentRenderer)s.drawImage(source,region.x,region.y,Math.max(1,region.w),Math.max(1,region.h),0,0,512,512);
 else{const stable=!o.contentRenderer&&!o.drawIcon&&!o.sourceCanvas&&!o.iconCanvas&&['lyrics','harakiri-relic','fuji','fanny-silhouette','user-mirror','apple','newspaper'].includes(mode);let atlas;if(stable||o.contentCacheKey!==undefined){const phrase=mode==='lyrics'?(E?.cueAt?.(t)?.text??o.screenText??''):'';atlas=material(JSON.stringify(['lens-atlas',mode,defaults(o),phrase,o.imageAsset,o.headline,o.contentAssetMode,o.contentCacheKey]),1024,1024,a=>lensContent(a,t,mode,E,o,1024,1024))}else{const[a,q]=scratch('magnifier-content-atlas',1024,1024);lensContent(q,t,mode,E,o,1024,1024);atlas=a}const span=1024/zoom,ax=(1024-span)/2+Math.sin(t*.79)*120*scan,ay=(1024-span)/2+Math.cos(t*.61)*100*scan;s.drawImage(atlas,ax,ay,span,span,0,0,512,512)}
 const result=frame(c,{...o,padding:o.padding??48},W,H,q=>{
  q.save();q.translate(lx,ly);q.rotate(-.63);round(q,-31,196,62,475,13,ink,paper,2);line(q,-18,230,-18,627,paper,2);for(let i=0;i<8;i++)line(q,-23,438+i*19,23,438+i*19,paper,1);round(q,-37,186,74,53,8,ink,paper,2);q.restore();
  ellipse(q,lx,ly,223,223,ink,paper,2);ellipse(q,lx,ly,211,211,paper,ink,2);
  q.save();q.beginPath();q.arc(lx,ly,r,0,Math.PI*2);q.clip();
  const upright=o.contentUpright??(mode==='fuji'||mode==='fanny-silhouette'),contentAngle=(upright?-(o.rotation??o.rotate??0):0)+(o.contentTilt??0);
  const flip=clamp(o.contentFlipProgress??0);
  if(flip>0&&flip<1){
   // Only the picture turns. The second face expands from the opposite side
   // with forward UVs; scene code chooses its new image at the midpoint.
   const yaw=flip<.5?Math.PI*flip:-Math.PI*(1-flip),cs=Math.cos(yaw),sn=Math.sin(yaw),cr=Math.cos(contentAngle),sr=Math.sin(contentAngle);
   if(Math.abs(cs)<.004){q.save();q.translate(lx,ly);q.rotate(contentAngle);line(q,0,-r,0,r,ink,1);q.restore()}
   else{const quad=[[-r,-r],[r,-r],[r,r],[-r,r]].map(([u,v])=>{const xx=u*cs,k=1000/(1000-u*sn);return[lx+(xx*cr-v*sr)*k,ly+(xx*sr+v*cr)*k]});localProject(q,snapshot,quad)}
  }else{q.save();q.translate(lx,ly);q.rotate(contentAngle);q.drawImage(snapshot,-r,-r,r*2,r*2);q.restore()}
  // Fine optical crosshair, not a replacement for the magnified source text.
  q.globalAlpha=.3;line(q,lx-r,ly,lx-r+27,ly,ink,1);line(q,lx+r-27,ly,lx+r,ly,ink,1);line(q,lx,ly-r,lx,ly-r+27,ink,1);line(q,lx,ly+r-27,lx,ly+r,ink,1);q.restore();
  ellipse(q,lx,ly,r,r,null,ink,2);q.save();q.strokeStyle=paper;q.lineWidth=4;q.beginPath();q.arc(lx,ly,215,Math.PI*1.06,Math.PI*1.7);q.stroke();q.restore();
  text(q,`× ${zoom.toFixed(1)}`,lx,ly+181,14,ink,{align:'center',weight:400});
 });
 result.lensContent=mode;result.contentFlipProgress=clamp(o.contentFlipProgress??0);if(result.drawn){result.elements.push(`lens-content:${mode}`);if(result.contentFlipProgress>0&&result.contentFlipProgress<1)result.elements.push('lens-flip');if(mode==='user-mirror')result.elements.push('CHIBI_MIRROR','asset:CHIBI_MIRROR');if(mode==='harakiri-relic')result.elements.push('HARAKIRI_KNIFE','asset:HARAKIRI_KNIFE');if(mode==='fanny-silhouette')result.elements.push('FANNY_PROFILE','asset:FANNY_PROFILE');if(mode==='fuji')result.elements.push('graphic:fuji')}return result;
}

function tower(q,{ink,paper,red,accent=false,x=800,y=80,h=820}){
 q.save();q.translate(x,y);q.scale(h/820,h/820);
 const levels=[{y:800,w:250},{y:660,w:171},{y:510,w:115},{y:365,w:75},{y:195,w:30},{y:70,w:10}];
 for(let i=0;i<levels.length-1;i++){const a=levels[i],b=levels[i+1];for(const sign of[-1,1])line(q,sign*a.w,a.y,sign*b.w,b.y,ink,i<2?12:7);const cells=i<3?4:3;for(let j=0;j<cells;j++){const f=j/cells,g=(j+1)/cells,yy=a.y+(b.y-a.y)*f,ny=a.y+(b.y-a.y)*g,ww=a.w+(b.w-a.w)*f,nw=a.w+(b.w-a.w)*g;line(q,-ww,yy,ww,yy,ink,3);line(q,-ww,yy,nw,ny,ink,2);line(q,ww,yy,-nw,ny,ink,2)}}
 line(q,0,70,0,-25,ink,5);for(let i=0;i<6;i++)line(q,-8+i%2*3,8+i*10,8-i%2*3,8+i*10,ink,2);
 path(q,[[-128,494],[128,494],[143,520],[-143,520]],{fill:paper,stroke:ink,width:5});box(q,-128,521,256,34,ink);for(let i=0;i<14;i++)box(q,-119+i*18,529,10,10,paper);
 path(q,[[-52,271],[52,271],[61,287],[-61,287]],{fill:ink,stroke:ink,width:2});box(q,-49,287,98,22,paper,ink,3);for(let i=0;i<8;i++)line(q,-43+i*12,289,-43+i*12,305,ink,2);
 // Curved portal and masonry piers keep the base from reading as an icon.
 q.strokeStyle=ink;q.lineWidth=17;q.beginPath();q.moveTo(-206,799);q.bezierCurveTo(-170,624,170,624,206,799);q.stroke();for(const sign of[-1,1])path(q,[[sign*244,775],[sign*267,819],[sign*190,819],[sign*185,775]],{fill:ink,stroke:null});
 if(accent){box(q,-127,519,254,5,red);line(q,-17,153,17,153,red,5)}q.restore();
}

function skyline(q,t,{ink,paper,seed,level=0,pan=0,windows=true}){
 const base=[750,850,1020][level],speed=[.14,.34,.7][level],shift=pan*speed+Math.sin(t*.055)*[7,15,28][level];q.save();q.translate(shift,0);
 for(let i=-3;i<28;i++){const key=seed+level*1007+i*19,x=i*76+hash(key)*25,y=base-(100+hash(key+1)*[290,365,440][level]),w=42+hash(key+2)*89,h=base-y;
  box(q,x,y,w,h,ink);const roof=hash(key+3);if(roof>.72)path(q,[[x+6,y],[x+w*.52,y-24],[x+w-6,y]],{fill:ink,stroke:null});else if(roof>.45)box(q,x+w*.2,y-16,w*.5,16,ink);
  if(hash(key+4)>.48){line(q,x+w*.58,y,x+w*.58,y-36-hash(key+5)*56,ink,2);line(q,x+w*.58-12,y-29,x+w*.58+15,y-29,ink,1)}
  if(windows){for(let xx=x+8;xx<x+w-6;xx+=11)for(let yy=y+13;yy<base-5;yy+=15)if(hash(Math.floor(xx)*13+Math.floor(yy)*7+key)>.4)box(q,xx,yy,3+hash(key+9)*3,7,paper)}
  if(level===2&&i%4===0){line(q,x+4,y+32,x+w-3,y+32,paper,1);line(q,x+w-8,y+5,x+w-8,base,paper,1)}
 }q.restore();
}

/** Three independently selectable skyline depth planes plus structural tower.
 * Draw CITY_TOKYO with E.art first; use drawTower:false over its baked-in tower.
 * layer:'far'|'mid'|'near'|'all', pan in canonical units. Background is clear. */
export function cityV03(c,t,o={}){
 const{ink,paper,red,seed}=defaults(o);return frame(c,o,1920,1080,q=>{
  const kind=o.layer??'all';if(kind==='all'||kind==='far')skyline(q,t,{ink,paper,seed,level:0,pan:o.pan??0,windows:o.windows!==false});
  if(o.drawTower!==false&&(kind==='all'||kind==='mid'))tower(q,{ink,paper,red,accent:o.accent,x:o.towerX??1380,y:o.towerY??90,h:o.towerHeight??850});
  if(kind==='all'||kind==='mid')skyline(q,t,{ink,paper,seed,level:1,pan:o.pan??0,windows:o.windows!==false});
  if(kind==='all'||kind==='near')skyline(q,t,{ink,paper,seed,level:2,pan:o.pan??0,windows:o.windows!==false});
 });
}
export function towerV03(c,t,o={}){const p=defaults(o);return frame(c,o,720,1040,q=>tower(q,{...p,accent:o.accent,x:360,y:80,h:920}))}

function evidencePaperModelV05(c,t,o={}){
 const{ink,paper,red,seed}=defaults(o);return frame(c,o,780,1000,q=>{
  path(q,[[55,40],[663,31],[730,98],[712,944],[89,965],[49,917]],{fill:paper,stroke:ink,width:3});path(q,[[663,31],[661,102],[730,98]],{fill:ink,stroke:ink,width:2});
  line(q,103,157,654,157,ink,4);text(q,o.title??'EVIDENCE / 127',104,127,41,ink);text(q,'INQUIRY / PRIVATE ARCHIVE',108,192,15,ink,{weight:400});
  const content=String(o.text??'演示文字\n文字演示 127\n演示文字演示文字演').split('\n');content.forEach((s,i)=>text(q,s,110,277+i*57,i===0?35:25,ink,{font:JP}));
  for(let i=0;i<16;i++){const y=482+i*23;line(q,109,y,647-hash(i+seed)*88,y,ink,i%5===0?5:1)}
  for(let i=0;i<34;i++)box(q,110+i*9,867,2+hash(i+seed)*5,44,ink);text(q,'000127 — DO NOT REMOVE',108,934,15,ink,{weight:400});
  if(o.stamp!==false){q.save();q.translate(473,768);q.rotate(-.1);box(q,0,0,177,63,null,o.accent?red:ink,4);text(q,o.stampText??'調査中',87,43,35,o.accent?red:ink,{font:JP,align:'center'});q.restore()}
  printNoise(q,780,1000,seed,ink,520);
 });
}

/** The chosen user newspaper image is the principal photograph.
 * imageAsset selects I/II/III; the default NEWSPAPER_ICON remains image IV.
 * Pass E, drawIcon(context,[x,y,w,h]), iconCanvas, or sourceCanvas. */
function newspaperModelV05(c,t,o={}){
 const{ink,paper,seed}=defaults(o),E=o.E,imageAsset=o.imageAsset??'NEWSPAPER_ICON';
 if(!E?.art&&!o.drawIcon&&!o.iconCanvas&&!o.sourceCanvas)throw new Error('newspaper requires NEWSPAPER_ICON via E.art or an explicit user-image source');
 const result=frame(c,o,1180,900,q=>{
  path(q,[[39,51],[586,28],[1134,56],[1154,848],[601,872],[37,841]],{fill:paper,stroke:ink,width:3});
  text(q,o.masthead??'星街調査新聞',590,137,66,ink,{font:JP,align:'center'});line(q,72,156,1110,156,ink,7);line(q,72,165,1110,165,ink,1);
  text(q,o.edition??'第127号 / 夕刊',80,193,17,ink,{font:JP,weight:400});text(q,'TOKYO / PRIVATE ARCHIVE',1100,193,17,ink,{align:'right',weight:400});
  text(q,o.headline??'演示文字演示文字演',79,261,47,ink,{font:JP});line(q,78,278,1102,278,ink,2);
  box(q,78,300,491,410,paper,ink,2);q.save();q.beginPath();q.rect(82,304,483,402);q.clip();
  if(o.drawIcon)o.drawIcon(q,[84,306,479,398]);else if(E?.art)E.art(q,imageAsset,[84,306,479,398],{mode:o.imageMode??'print'});else q.drawImage(o.iconCanvas??o.sourceCanvas,84,306,479,398);q.restore();
  text(q,o.caption??'現場記録 / 資料写真 127',82,736,17,ink,{font:JP,weight:400});
  const columns=[{x:607,w:227},{x:862,w:227}],rows=21;
  for(let column=0;column<columns.length;column++){const{x,w}=columns[column];text(q,column===0?'演示文字演示文字':'演示文字演',x,329,26,ink,{font:JP});line(q,x,345,x+w,345,ink,2);for(let row=0;row<rows;row++){const yy=366+row*16;if(row%6===5){line(q,x,yy,x+w,yy,ink,.6);continue}for(let group=0;group<8;group++){const xx=x+group*28,length=18+hash(seed+column*97+row*13+group)*7;box(q,xx,yy,length,.8+(row%3)*.25,ink);box(q,xx,yy+4,length-4,.75,ink)}}}
  line(q,849,296,849,731,ink,1);line(q,79,766,1101,766,ink,2);for(let i=0;i<3;i++){const xx=82+i*349;for(let j=0;j<6;j++)line(q,xx,784+j*8,xx+321-hash(seed+i*13+j)*40,784+j*8,ink,.7)}
  // Two irregular parallel creases and registration wear remain physical.
  line(q,589,34,599,864,ink,.9);line(q,594,36,605,860,ink,.3);line(q,47,478,1142,492,ink,.45);printNoise(q,1180,900,seed,ink,650);
 });
 if(result.drawn)result.elements.push(imageAsset,`asset:${imageAsset}`);return result;
}
export function newspaper(c,t,E,o={}){return newspaperV03(c,t,{...o,E})}

/** Printed conversational record, not a platform UI. Role fixes both label and
 * the supplied real character silhouette so names cannot swap accidentally. */
export function chatRecordV03(c,t,o={}){
 const{ink,paper,seed}=defaults(o),E=o.E;if(!E?.art)throw new Error('chat requires E.art for the supplied Bonnie/Fanny silhouettes');
 const people={fanny:{name:'演示文字',asset:'FANNY_PROFILE'},bonnie:{name:'ボニー',asset:'SIL03'}};
 const messages=o.messages??[{role:'fanny',text:'演示文字演示文字'},{role:'bonnie',text:'演示文字演示文'},{role:'fanny',text:'演示文字演示文字'},{role:'bonnie',text:'演示文字演示'},{role:'fanny',text:'演示文字演示'},{role:'bonnie',text:'演示文字演示文'},{role:'fanny',text:'演示文字演'},{role:'bonnie',text:'演示文字演示文字'},{role:'fanny',text:'演示文字演示文字演'}];
 const rowCount=Math.max(0,Math.min(9,Math.floor(o.rowCount??(o.messages?messages.length:4)))),rows=messages.slice(0,rowCount),progress=o.progress===undefined?null:clamp(o.progress),head=progress===null?rows.length:progress*(rows.length+.6),scroll=o.scrollY??(rows.length>4?Math.max(0,head-4)*176:0),visible=[];
 const result=frame(c,o,1180,940,q=>{
  box(q,34,30,1110,879,paper,ink,1.5);text(q,o.title??'会話記録 / CASE 127',68,86,29,ink,{font:JP});text(q,'TRANSCRIPT / PRIVATE',1100,84,14,ink,{align:'right',weight:400});line(q,67,111,1110,111,ink,1);
  q.save();q.beginPath();q.rect(67,122,1040,739);q.clip();
  rows.forEach((message,i)=>{const person=people[message.role];if(!person)throw new Error(`chat role must be fanny or bonnie: ${message.role}`);const enter=progress===null?1:clamp(head-i),ease=1-(1-enter)**3,y=139+i*176-scroll;if(enter<=0||y>=861||y+158<=122)return;
   const fullGlyphs=[...String(message.text)],visibleGlyphCount=progress===null?fullGlyphs.length:Math.min(fullGlyphs.length,Math.ceil(clamp((enter-.14)/.72)*fullGlyphs.length));visible.push({index:i+1,role:message.role,name:person.name,asset:person.asset,text:fullGlyphs.slice(0,visibleGlyphCount).join(''),visibleGlyphCount,totalGlyphs:fullGlyphs.length});q.save();q.globalAlpha*=ease;q.translate((1-ease)*(o.entryDistance??340),0);
   box(q,68,y,1038,158,null,ink,.85);q.save();q.beginPath();q.rect(83,y+13,111,129);q.clip();E.art(q,person.asset,[83,y+13,111,129],{mode:'ink'});q.restore();
   line(q,214,y+15,214,y+142,ink,.65);text(q,person.name,239,y+41,26,ink,{font:JP});text(q,String(i+1).padStart(2,'0'),1080,y+38,16,ink,{align:'right',weight:400});
   const body=String(message.text);let size=o.messageFontSize??34,bodyLines=wrapLines(q,body,835,size);while(bodyLines.length*(size+6)>94&&size>12){size-=1;bodyLines=wrapLines(q,body,835,size)}q.save();q.beginPath();q.rect(232,y+53,866,100);q.clip();let remaining=visibleGlyphCount;bodyLines.forEach((s,j)=>{const lineGlyphs=[...s],shown=lineGlyphs.slice(0,Math.max(0,remaining)).join('');remaining-=lineGlyphs.length;if(shown)text(q,shown,239,y+65+size+j*(size+6),size,ink,{font:JP,weight:700})});q.restore();
   q.restore();
  });q.restore();
  printNoise(q,1180,940,seed,ink,500);text(q,'記録終了 / 000127',1100,885,14,ink,{font:JP,align:'right',weight:400});
 });
 if(result.drawn)result.elements.push('chat:progressive-glyphs','chat:ordered-transcript-cards');result.rowCount=rows.length;result.renderedCards=visible;result.scrollY=scroll;if(result.drawn){for(const card of visible)result.elements.push(`chat-card:${card.index}`);for(const role of new Set(visible.map(m=>m.role))){result.elements.push(`chat-name:${people[role].name}`,`avatar:${people[role].asset}`)}}return result;
}
export function chatRecord(c,t,E,o={}){return chatRecordV03(c,t,{...o,E})}

export function envelopeV03(c,t,o={}){
 const{ink,paper,red,seed}=defaults(o),open=clamp(o.open??0);return frame(c,o,1000,720,q=>{
  path(q,[[65,194],[922,169],[941,628],[80,656]],{fill:paper,stroke:ink,width:5});
  if(open>0){path(q,[[65,194],[490,194-166*open],[922,169]],{fill:paper,stroke:ink,width:4});line(q,78,199,925,180,ink,1)}
  path(q,[[80,649],[486,344],[938,623]],{fill:paper,stroke:ink,width:3});path(q,[[65,194],[491,453],[922,169]],{fill:paper,stroke:ink,width:4});
  if(open===0)ellipse(q,492,444,25,25,o.accent?red:ink,null);
  q.save();q.translate(747,232);q.rotate(-.04);box(q,0,0,112,117,paper,ink,3);text(q,'127',55,70,37,ink,{align:'center'});for(let i=0;i<7;i++)line(q,-10,18+i*13,124,18+i*13,ink,.7);q.restore();
  text(q,'PRIVATE / CASE 127',161,560,28,ink);text(q,'宛先不明',163,598,24,ink,{font:JP});printNoise(q,1000,720,seed,ink,300);
 });
}

export function cableV03(c,t,o={}){
 const{ink,paper}=defaults(o),swing=Math.sin(t*.7+(o.seed??127))*(o.motion??1)*35;return frame(c,o,1200,700,q=>{
  const trace=()=>{q.beginPath();q.moveTo(70,390);q.bezierCurveTo(230,34,370,95,455,348+swing);q.bezierCurveTo(585,704,805,542,833,293);q.bezierCurveTo(861,88,1027,157,1116,394)};
  q.strokeStyle=ink;q.lineWidth=15;trace();q.stroke();q.strokeStyle=paper;q.lineWidth=2;trace();q.stroke();
  for(const[x,y,a]of[[66,395,-.3],[1120,400,.2]]){q.save();q.translate(x,y);q.rotate(a);round(q,-24,-49,48,80,4,ink,paper,1);box(q,-13,30,26,42,paper,ink,3);for(let i=0;i<3;i++)line(q,-8+i*8,37,-8+i*8,60,ink,2);for(let i=0;i<4;i++)line(q,-20,-35+i*12,20,-35+i*12,paper,1);q.restore()}
 });
}

export function shardsV03(c,t,o={}){
 const{ink,paper,seed}=defaults(o),count=o.count??34,age=o.start===undefined?Math.sin(t*.2)*1.5:t-o.start,speed=o.speed??1;return frame(c,o,1600,1000,q=>{
  for(let i=0;i<count;i++){const a=hash(seed+i*17)*Math.PI*2,r=100+hash(seed+i*17+1)*600+age*speed*(16+hash(i+seed)*28),x=800+Math.cos(a)*r,y=500+Math.sin(a)*r*.72,size=12+hash(seed+i*17+2)*62;
   q.save();q.translate(x,y);q.rotate(hash(seed+i*17+3)*6.2+age*.13*(i%2?1:-1));path(q,[[-size,-size*.4],[size*.8,-size*.6],[size*.55,size*.7],[-size*.7,size*.3]],{fill:i%4===0?paper:ink,stroke:ink,width:1});if(i%3===0)for(let j=0;j<3;j++)line(q,-size*.6,-size*.2+j*size*.18,size*.5,-size*.2+j*size*.18,i%4===0?ink:paper,.8);q.restore();
  }
 });
}

function inkBounds(shapes){const points=shapes.flat();return{left:Math.min(...points.map(p=>p[0])),top:Math.min(...points.map(p=>p[1])),right:Math.max(...points.map(p=>p[0])),bottom:Math.max(...points.map(p=>p[1]))}}
function inkRect(value){return Array.isArray(value)?{x:value[0],y:value[1],w:value[2],h:value[3]}:value}
function inkOverlaps(a,b,padding=0){return a.right>b.x-padding&&a.left<b.x+b.w+padding&&a.bottom>b.y-padding&&a.top<b.y+b.h+padding}
function inkPrototype(seed,r){
 const shapes=[],pool=[],phase=hash(seed+7)*Math.PI*2;
 for(let j=0;j<64;j++){const a=j/64*Math.PI*2,rr=r*(.92+.12*Math.sin(a*3+phase)+.07*Math.sin(a*7-phase)+hash(seed+j*17)*.055);pool.push([Math.cos(a)*rr,Math.sin(a)*rr])}shapes.push(pool);
 for(let j=0;j<15;j++){
  const a=hash(seed+j*113)*Math.PI*2,d=r*(1.15+hash(seed+j*17)*1.35),dot=(2+hash(seed+j*23)*13)*(r/210),x=Math.cos(a)*d,y=Math.sin(a)*d,drop=[];
  for(let k=0;k<16;k++){const b=k/16*Math.PI*2;drop.push([x+Math.cos(b)*dot,y+Math.sin(b)*dot*.8])}shapes.push(drop);
  if(j%3===0){const start=r*.72,end=r*(1.4+hash(seed+j*3)*1.25),spread=.012+hash(seed+j*47)*.027;shapes.push([[Math.cos(a-spread)*start,Math.sin(a-spread)*start],[Math.cos(a+spread)*start,Math.sin(a+spread)*start],[Math.cos(a)*end,Math.sin(a)*end]])}
 }
 return shapes;
}

/** Complete ink outlines, never cropped into a rectangular prop tile.
 * x/y/w/h retain V03 box semantics. placement:'interior' fits whole groups into
 * that box; placement:'corner' lets ink cross its box and the actual stage edge.
 * corner:'tl'|'tr'|'bl'|'br', radiusPixels optionally specifies pool size in the
 * caller's stage units. safeArea / safeAreas use the SAME coordinates as x/y.
 * Safety moves or uniformly shrinks a WHOLE group; it never clips to a rectangle.
 * The inherited parent/stage clip is the only clip used by this function.
 */
export function inkBlotsV03(c,t,o={}){
 const{ink,seed}=defaults(o),W=1600,H=1000,w=o.w??W,h=o.h??H,x=o.x??0,y=o.y??0,scale=Math.min(w/W,h/H)*(o.scale??1),rotation=o.rotation??o.rotate??0,alpha=clamp(o.alpha??1);
 const placement=o.placement??(o.corner?'corner':'interior'),activePicture=c.canvas.width===1920&&c.canvas.height===1080?{x:0,y:90,w:1920,h:870}:{x:0,y:0,w:c.canvas.width,h:c.canvas.height};
 const requestedViewport=inkRect(o.viewport??activePicture),pictureCorner=o.corner??'tl',edgeBand=160;
 const viewport=placement==='corner'&&c.canvas.width===1920&&c.canvas.height===1080?{x:requestedViewport.x,y:pictureCorner.includes('b')?requestedViewport.y+requestedViewport.h-edgeBand:requestedViewport.y,w:requestedViewport.w,h:edgeBand}:requestedViewport,count=Math.max(0,Math.floor(o.count??(placement==='corner'?3:6)));
 const fallbackSafe={x:viewport.x+viewport.w*.2,y:viewport.y+viewport.h*.18,w:viewport.w*.6,h:viewport.h*.64};
 const safeAreas=(o.safeArea===false?[]:o.safeAreas??[o.safeArea??fallbackSafe]).map(inkRect),safePadding=o.safePadding??24;
 const result={kind:o.kind,box:[x,y,w,h],scale,rotation,drawn:false,elements:[],inkUnclipped:true,inkPlacement:placement,inkGroups:[],safeAreas};
 if(!alpha||!count)return result;if(!Number.isFinite(scale)||scale<=0)throw new Error('Ink needs a positive finite scale');
 const yaw=Math.max(-.55,Math.min(.55,o.yaw??0)),pitch=Math.max(-.5,Math.min(.5,o.pitch??0)),cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch),cr=Math.cos(rotation),sr=Math.sin(rotation),focal=1600;
 const project=([u,v])=>{const xx=(u-W/2)*scale,yy=(v-H/2)*scale,rx=xx*cy,zz=-xx*sy,ry=yy*cp-zz*sp,rz=yy*sp+zz*cp,depth=focal+(o.z??0)+rz;if(!Number.isFinite(depth)||depth<200)throw new Error('Ink crossed the near-depth limit');const k=focal/depth;return[x+w/2+(rx*cr-ry*sr)*k,y+h/2+(rx*sr+ry*cr)*k]};
 const corner=o.corner??`${y+h/2<viewport.y+viewport.h/2?'t':'b'}${x+w/2<viewport.x+viewport.w/2?'l':'r'}`,cornerX=corner.includes('r')?W:0,cornerY=corner.includes('b')?H:0,signX=cornerX?-1:1,signY=cornerY?-1:1;
 const edgeSlots=[[.15,.16],[.85,.16],[.15,.84],[.85,.84],[.5,.09],[.5,.91],[.07,.5],[.93,.5]],slots=count===1?[[.5,.5],...edgeSlots]:edgeSlots;
 const radius=o.radiusPixels===undefined?(o.radius??210):o.radiusPixels/scale,paint=[];
 for(let i=0;i<count;i++){
  const r=radius*(.64+hash(seed+i*31+2)*.43),prototype=inkPrototype(seed+i*103,r),bounds=inkBounds(prototype);let accepted=null;
  const attempts=placement==='corner'?1:slots.length;
  for(let attempt=0;attempt<attempts&&!accepted;attempt++){
   const slot=slots[(i+attempt)%slots.length],origin=placement==='corner'?[cornerX+signX*(i?hash(seed+i*17)*r*.85:0),cornerY+signY*(i?hash(seed+i*19)*r*.75:0)]:[slot[0]*W,slot[1]*H];
   let factor=placement==='corner'?1:Math.min(1,(origin[0]-24)/Math.max(1,-bounds.left),(W-origin[0]-24)/Math.max(1,bounds.right),(origin[1]-24)/Math.max(1,-bounds.top),(H-origin[1]-24)/Math.max(1,bounds.bottom));
   for(let trial=0;trial<15&&factor>.065;trial++,factor*=.82){
    let shapes=prototype.map(shape=>shape.map(([u,v])=>project([origin[0]+u*factor,origin[1]+v*factor]))),b=inkBounds(shapes);
    // Move the entire contour, including every droplet and spray. The picture
    // matte is a real boundary; a pool centred at y=0 lost most of its ink.
    if(placement==='corner'){
     const margin=12,dx=corner.includes('r')?viewport.x+viewport.w-margin-b.right:viewport.x+margin-b.left,dy=corner.includes('b')?viewport.y+viewport.h-margin-b.bottom:viewport.y+margin-b.top;
     shapes=shapes.map(s=>s.map(([xx,yy])=>[xx+dx,yy+dy]));b=inkBounds(shapes);
    }
    const interiorFits=b.left>=viewport.x+2&&b.top>=viewport.y+2&&b.right<=viewport.x+viewport.w-2&&b.bottom<=viewport.y+viewport.h-2;
    if(interiorFits&&!safeAreas.some(area=>inkOverlaps(b,area,safePadding))){accepted={shapes,bounds:b,seed:seed+i*103,poolRadius:r*factor*scale,factor};break}
   }
  }
  if(accepted){paint.push(...accepted.shapes);result.inkGroups.push({seed:accepted.seed,bounds:accepted.bounds,poolRadius:accepted.poolRadius,fitScale:accepted.factor})}
 }
 if(!paint.length)return result;c.save();c.globalAlpha*=alpha;for(const shape of paint)path(c,shape,{fill:ink,stroke:null});c.restore();
 result.drawn=true;result.shapeCount=paint.length;result.paintBounds=inkBounds(paint);return result;
}
export {inkBlotsV03 as inkBlotsV04};

export function halftoneV03(c,t,o={}){
 const{ink,seed}=defaults(o),step=Math.max(8,o.step??22),r=o.radius??2.1;return frame(c,o,1600,1000,q=>{
  q.save();q.fillStyle=ink;const dx=o.pan??0,dy=o.drift??0;for(let y=-step;y<1000+step;y+=step)for(let x=-step;x<1600+step;x+=step){const xx=x+Math.round(y/step)%2*step*.5+dx%step,yy=y+dy%step;q.beginPath();q.arc(xx,yy,r*(.8+hash(Math.floor(x)*17+Math.floor(y)+seed)*.3),0,Math.PI*2);q.fill()}q.restore();
 });
}

const SOLAR_PLANETS=Object.freeze([
 {name:'mercury',orbit:135,r:8,angle:-2.4},
 {name:'venus',orbit:215,r:14,angle:-.62},
 {name:'earth',orbit:295,r:16,angle:2.16},
 {name:'mars',orbit:380,r:11,angle:.91},
 {name:'jupiter',orbit:490,r:40,angle:-1.43},
 {name:'saturn',orbit:610,r:33,angle:2.8},
 {name:'uranus',orbit:735,r:24,angle:-.12},
 {name:'neptune',orbit:850,r:23,angle:1.72},
]);
function solarPlanet(q,p,ink,paper){
 const r=p.r;
 if(p.name==='saturn'){ellipse(q,0,0,r*2.05,r*.65,paper,ink,3);ellipse(q,0,0,r*1.68,r*.39,null,ink,1.3)}
 ellipse(q,0,0,r,r,ink,paper,1.5);
 q.save();q.beginPath();q.arc(0,0,r-1,0,Math.PI*2);q.clip();
 if(p.name==='jupiter'){for(const[y,h]of[[-25,6],[-12,4],[1,9],[19,5]])box(q,-r,y,r*2,h,paper);ellipse(q,13,7,11,5,ink,null)}
 else if(p.name==='earth'){path(q,[[-12,-8],[-4,-14],[4,-8],[1,0],[-7,4],[-8,11],[-13,6]],{fill:paper,stroke:null});path(q,[[6,2],[13,5],[11,12],[4,10]],{fill:paper,stroke:null})}
 else if(p.name==='mercury'){ellipse(q,-3,-3,2.3,2.3,paper,null);ellipse(q,3,2,1.6,1.6,paper,null)}
 else if(p.name==='venus'){for(let i=-2;i<3;i++)line(q,-r,i*8+6,r,i*8-6,paper,2)}
 else if(p.name==='mars'){line(q,-7,-4,6,3,paper,2);ellipse(q,3,5,2,2,paper,null)}
 else if(p.name==='uranus'){line(q,-6,-r+2,-1,r-2,paper,4);line(q,5,-r+2,10,r-2,paper,1.5)}
 else if(p.name==='neptune'){box(q,-r,-9,r*2,3,paper);box(q,-r,6,r*2,4,paper);ellipse(q,8,1,4,2,paper,null)}
 else if(p.name==='saturn'){box(q,-r,-8,r*2,4,paper);box(q,-r,7,r*2,3,paper)}
 q.restore();
 if(p.name==='saturn'){q.strokeStyle=ink;q.lineWidth=3;q.beginPath();q.ellipse(0,0,r*2.05,r*.65,0,0,Math.PI);q.stroke();q.strokeStyle=paper;q.lineWidth=1;q.beginPath();q.ellipse(0,0,r*1.75,r*.47,0,0,Math.PI);q.stroke()}
}

/** Complete ink-and-paper solar system. camera establishes a default framing;
 * zoom multiplies it, panX/Y offset it, phase changes absolute orbital phase.
 * progress 0..1 optionally supplies a sun-close to full-orbit pullback.
 * Returned visibility is in the canonical prop viewport, not a fictitious
 * count: the full 'orbits' view contains all eight actual planet drawings. */
export function solarSystemV03(c,t,o={}){
 const{ink,paper,seed}=defaults(o),camera=o.camera??'orbits',roll=-.16,cr=Math.cos(roll),sr=Math.sin(roll);
 const progress=o.progress===undefined?null:clamp(o.progress),baseZoom=progress===null?(camera==='sun'?2.4:camera==='outer'?1.17:1):2.4-1.4*progress;
 const nominalCenter=progress===null?(camera==='sun'?[560,650]:camera==='outer'?[840,620]:[960,640]):[560+400*progress,650-10*progress];
 const center=Array.isArray(o.center)?o.center:o.center?[o.center.x,o.center.y]:nominalCenter,cx=center[0]+(o.panX??0),cy=center[1]+(o.panY??0),zoom=Math.max(.15,baseZoom*(o.zoom??1)),phase=o.phase??0;
 const planets=SOLAR_PLANETS.map((p,i)=>{const a=p.angle+phase+t*.0045/(1+i*.28),xx=Math.cos(a)*p.orbit,yy=Math.sin(a)*p.orbit*.38,px=cx+(xx*cr-yy*sr)*zoom,py=cy+(xx*sr+yy*cr)*zoom,pad=p.r*zoom*(p.name==='saturn'?2.1:1);return{...p,x:px,y:py,angle:a,visible:px+pad>0&&px-pad<1920&&py+pad>0&&py-pad<1080}});
 const sunVisible=cx+130*zoom>0&&cx-130*zoom<1920&&cy+130*zoom>0&&cy-130*zoom<1080;
 const result=frame(c,o,1920,1080,q=>{
  // Sparse stars are hard dots/crosses. A clear upper band remains for L1.
  const read=o.readArea??{x:80,y:65,w:1760,h:225},area=Array.isArray(read)?{x:read[0],y:read[1],w:read[2],h:read[3]}:read;
  for(let i=0;i<(o.starCount??105);i++){const x=hash(seed+i*19)*1920,y=hash(seed+i*19+1)*1080;if(x>area.x&&x<area.x+area.w&&y>area.y&&y<area.y+area.h)continue;const r=.9+hash(seed+i*19+2)*1.7;ellipse(q,x,y,r,r,ink,null);if(i%17===0){line(q,x-7,y,x+7,y,ink,1);line(q,x,y-7,x,y+7,ink,1)}}
  q.save();q.translate(cx,cy);q.scale(zoom,zoom);q.rotate(roll);
  for(const p of SOLAR_PLANETS){ellipse(q,0,0,p.orbit,p.orbit*.38,null,ink,p.orbit>600?1.3:1.6);for(let j=0;j<4;j++){const a=j*Math.PI*.5;line(q,Math.cos(a)*(p.orbit-3),Math.sin(a)*(p.orbit*.38-3),Math.cos(a)*(p.orbit+3),Math.sin(a)*(p.orbit*.38+3),ink,1)}}
  // Sun is the central body; Earth is deliberately smaller than the giants.
  for(let i=0;i<36;i++){const a=i/36*Math.PI*2,start=81+hash(seed+i*3)*8,end=105+hash(seed+i*3+1)*25;line(q,Math.cos(a)*start,Math.sin(a)*start,Math.cos(a)*end,Math.sin(a)*end,ink,i%3===0?4:2)}
  ellipse(q,0,0,71,71,ink,paper,2);q.save();q.beginPath();q.arc(0,0,68,0,Math.PI*2);q.clip();for(let i=0;i<8;i++){const y=-52+i*15;q.strokeStyle=paper;q.lineWidth=i%3===0?3:1.3;q.beginPath();q.moveTo(-78,y);q.bezierCurveTo(-28,y-17,26,y+17,78,y-4);q.stroke()}q.restore();q.restore();
  for(const p of planets){q.save();q.translate(p.x,p.y);q.scale(zoom,zoom);q.rotate(p.name==='saturn'?-.28:0);solarPlanet(q,p,ink,paper);q.restore()}
 });
 result.planetCount=8;result.orbitCount=8;result.visiblePlanetCount=planets.filter(p=>p.visible).length;result.planets=planets.map(({name,x,y,r,orbit,visible})=>({name,x,y,radius:r*zoom,orbit,visible}));result.solarCamera={camera,zoom,center:[cx,cy]};
 if(result.drawn){result.elements.push('solarSystem');if(sunVisible)result.elements.push('solar:sun');for(const p of SOLAR_PLANETS)result.elements.push(`solar:orbit:${p.name}`);for(const p of planets)if(p.visible)result.elements.push(`solar:planet:${p.name}`)}return result;
}

// V05 callbacks run in the content rectangle's local 0..w / 0..h coordinates.
// The rectangle, frame, lines and glyphs are projected together exactly once.
function wrapLines(q,value,width,size,font=JP){q.save();q.font=`700 ${size}px ${font}`;const result=[];for(const paragraph of String(value??'').split('\n')){let line='';for(const char of Array.from(paragraph)){if(line&&q.measureText(line+char).width>width){result.push(line);line=char}else line+=char}result.push(line)}q.restore();return result}
function localContent(q,t,o,rect){const[x,y,w,h]=rect;q.save();q.beginPath();q.rect(x,y,w,h);q.clip();q.translate(x,y);if(o.contentRenderer)o.contentRenderer(q,t,{x:0,y:0,w,h,...defaults(o)});else if(o.contentCanvas||o.screenCanvas)q.drawImage(o.contentCanvas??o.screenCanvas,0,0,w,h);q.restore()}
function phoneScreenV05(q,t,o,rect){const{ink,paper}=defaults(o),[x,y,w,h]=rect,mode=o.screenMode??(o.screenMessages?'chat':'call');box(q,x,y,w,h,paper,ink,2);q.save();q.beginPath();q.rect(x+3,y+3,w-6,h-6);q.clip();q.translate(x+3,y+3);const ww=w-6,hh=h-6;signal(q,10,23,ink,3);box(q,ww-39,10,25,11,null,ink,1.2);line(q,9,32,ww-9,32,ink,1);
 if(o.contentRenderer||o.screenCanvas||o.contentCanvas){localContent(q,t,o,[8,41,ww-16,hh-50])}
 else if(o.screenAsset){if(!o.E?.art)throw new Error('screenAsset requires E.art');o.E.art(q,o.screenAsset,[9,42,ww-18,hh-51],{mode:o.screenAssetMode??'print'})}
 else if(mode==='chat'){const messages=o.screenMessages??o.messages??[{role:'bonnie',text:o.screenText??''}],size=o.screenFontSize??Math.max(15,Math.min(29,ww*.071));let yy=47-(o.screenScroll??0);for(let i=0;i<messages.length;i++){const m=typeof messages[i]==='string'?{text:messages[i]}:messages[i],lines=wrapLines(q,m.text,ww-42,size),bh=lines.length*(size+6)+20,xx=m.role==='fanny'?8:22;round(q,xx,yy,ww-xx-8,bh,6,paper,ink,1.5);lines.forEach((s,j)=>text(q,s,xx+10,yy+size+9+j*(size+6),size,ink,{font:JP}));yy+=bh+12}}
 else if(mode==='virus'||mode==='glitch'){const epoch=Math.floor(t*8),count=mode==='virus'?9:16;for(let i=0;i<count;i++){const xx=8+hash(epoch*13+i*31)*(ww-28),yy=43+hash(epoch*19+i*17)*(hh-65);box(q,xx,yy,12+hash(i+3)*ww*.54,mode==='glitch'?3+hash(i)*17:1,ink);if(mode==='virus'&&i%3===0){box(q,xx,yy,43,31,paper,ink,2);text(q,'×',xx+21,yy+25,25,ink,{align:'center'})}}text(q,o.screenText??'感染 / ERROR',ww/2,hh*.54,Math.min(31,ww*.11),ink,{font:JP,align:'center'});text(q,'127 / QUARANTINE',ww/2,hh-17,13,ink,{align:'center'})}
 else if(mode==='password'){text(q,o.screenText??'暗証番号',ww/2,hh*.31,Math.min(32,ww*.12),ink,{font:JP,align:'center'});for(let i=0;i<4;i++){box(q,ww*.12+i*ww*.195,hh*.47,ww*.15,ww*.18,null,ink,2);text(q,String(o.password??'0127')[i]??'•',ww*.195+i*ww*.195,hh*.47+ww*.14,ww*.12,ink,{align:'center'})}text(q,'ACCESS / PRIVATE',ww/2,hh*.81,14,ink,{align:'center'})}
 else{const lines=wrapLines(q,o.screenText??'INCOMING\n127\nUNKNOWN',ww-24,o.screenFontSize??27);lines.forEach((s,i)=>text(q,s,ww/2,65+i*39,o.screenFontSize??27,ink,{font:JP,align:'center'}))}q.restore();return(!o.contentRenderer&&!o.screenCanvas&&!o.contentCanvas)?(o.screenAsset??null):null}
function phoneV05(c,t,o,smart){const p=defaults(o),W=smart?620:640,H=smart?1020:1040,key=JSON.stringify(['phone-body',smart,p.ink,p.paper,p.red,p.seed,!!o.accent]),body=material(key,W,H,q=>(smart?smartphoneModelV05:flipPhoneModelV05)(q,0,{...p,x:0,y:0,w:W,h:H,screenMode:'blank',accent:o.accent}));let asset=null;const result=frame(c,o,W,H,q=>{q.drawImage(body,0,0);asset=phoneScreenV05(q,t,o,smart?[140,168,340,625]:[178,147,284,303])});result.model=smart?'fixed-smart-slab':'fixed-open-front';result.screenMode=o.screenMode??(o.screenMessages?'chat':'call');if(!smart)result.keypad={columns:3,rows:4,keyWidth:84,keyHeight:48,columnPitch:110,rowPitch:64,axisX:320};if(result.drawn){result.elements.push('screen-mode:'+result.screenMode);if(asset)result.elements.push(asset,'asset:'+asset);if(o.screenText)result.screenText=String(o.screenText);if(o.screenMessages)result.screenMessages=o.screenMessages.map(m=>typeof m==='string'?m:m.text)}return result}
export function flipPhoneV03(c,t,o={}){return phoneV05(c,t,o,false)}
export function smartphoneV03(c,t,o={}){return phoneV05(c,t,o,true)}

export function evidencePaperV03(c,t,o={}){const p=defaults(o),W=780,H=1000,image=o.imageAsset,icon=o.iconAsset,custom=!!(o.contentRenderer||o.contentCanvas||o.textureCanvas),key=JSON.stringify(['paper',p,o.title,o.text,o.body,image,icon,o.stampText,o.stamp,custom,o.cacheKey,o.fontSize,o.imageMode]);const texture=material(key,W,H,q=>{path(q,[[55,40],[663,31],[730,98],[712,944],[89,965],[49,917]],{fill:p.paper,stroke:p.ink,width:3});path(q,[[663,31],[661,102],[730,98]],{fill:p.ink,stroke:p.ink,width:2});const heading=o.title??'調査記録';q.font=`700 41px ${JP}`;const headingSize=Math.min(41,41*(icon?415:546)/Math.max(1,q.measureText(heading).width));text(q,heading,106,127,headingSize,p.ink,{font:JP});line(q,104,157,655,157,p.ink,3);text(q,'PRIVATE ARCHIVE / 127',108,191,15,p.ink,{weight:400});if(image){if(!o.E?.art)throw new Error('paper imageAsset requires E.art');o.E.art(q,image,[108,218,545,300],{mode:o.imageMode??'print'})}if(icon){if(!o.E?.art)throw new Error('paper iconAsset requires E.art');o.E.art(q,icon,[541,73,80,69],{mode:o.imageMode??'print'})}if(!custom){const size=o.fontSize??32,top=image?570:277,rows=wrapLines(q,o.body??o.text??'演示文字\n文字演示 127\n演示文字演示文字演',535,size);rows.forEach((s,i)=>{const baseline=top+i*(size+24);line(q,108,baseline+8,650,baseline+8,p.ink,1);text(q,s,111,baseline,size,p.ink,{font:JP})})}text(q,'000127 — DO NOT REMOVE',108,934,15,p.ink,{weight:400});printNoise(q,W,H,p.seed,p.ink,180)});const result=frame(c,o,W,H,q=>{if(o.textureCanvas)q.drawImage(o.textureCanvas,0,0,W,H);else{q.drawImage(texture,0,0);if(custom)localContent(q,t,o,o.contentRect??[108,image?545:218,545,image?340:660])}});result.contentRect=o.contentRect??[108,image?545:218,545,image?340:660];result.unifiedPlane=true;if(result.drawn&&!o.textureCanvas)for(const id of[image,icon].filter(Boolean))result.elements.push('asset:'+id,id);return result}
export function newspaperV03(c,t,o={}){const p=defaults(o),asset=o.imageAsset??'NEWSPAPER_ICON',custom=!!(o.contentRenderer||o.contentCanvas||o.textureCanvas),key=JSON.stringify(['newspaper',p,asset,o.headline,o.masthead,o.edition,o.caption,o.cacheKey,custom]);const texture=material((o.drawIcon||o.iconCanvas||o.sourceCanvas)&&o.cacheKey===undefined?null:key,1180,900,q=>{newspaperModelV05(q,0,{...o,x:0,y:0,w:1180,h:900,rotation:0,rotate:0,yaw:0,pitch:0,scale:1,alpha:1});if(custom)box(q,600,295,503,451,p.paper)});const result=frame(c,o,1180,900,q=>{if(o.textureCanvas)q.drawImage(o.textureCanvas,0,0,1180,900);else{q.drawImage(texture,0,0);if(custom)localContent(q,t,o,o.contentRect??[608,305,480,426])}});result.unifiedPlane=true;result.contentRect=o.contentRect??[608,305,480,426];if(result.drawn&&!o.textureCanvas)result.elements.push(asset,'asset:'+asset);return result}

export function cabinetV05(c,t,o={}){
 const p=defaults(o),u=clamp(o.progress??((t-(o.start??34))/3)),count=Math.max(1,Math.min(18,o.count??11)),papers=[];
 const body=material(JSON.stringify(['cabinet-exaggerated',p]),900,1000,q=>{
  box(q,110,98,610,827,p.paper,p.ink,9);path(q,[[110,98],[164,52],[770,52],[720,98]],{fill:p.paper,stroke:p.ink,width:5});path(q,[[720,98],[770,52],[770,870],[720,925]],{fill:p.ink,stroke:p.ink,width:4});
  for(let i=0;i<4;i++)box(q,134,122+i*191,563,176,p.ink);
  for(let i=0;i<4;i++)box(q,145+i*141,917,95,15,p.ink);
 });
 const result=frame(c,{...o,padding:o.padding??320},1500,1400,q=>{
  q.drawImage(body,0,320);
  for(let i=3;i>=0;i--){const backY=445+i*191,pull=clamp(u*1.35-i*.15),depth=pull*(i===0?188:119),fx=137-depth*.23,fy=backY+depth*.20,fw=555+depth*.46;
   path(q,[[137,backY],[692,backY],[fx+fw,fy],[fx,fy]],{fill:p.paper,stroke:p.ink,width:4});
   path(q,[[137,backY],[fx,fy],[fx,fy+170],[137,backY+170]],{fill:p.ink,stroke:p.ink,width:3});
   box(q,fx,fy,fw,170,p.paper,p.ink,5);box(q,fx+fw*.34,fy+30,fw*.32,53,null,p.ink,3);box(q,fx+fw*.39,fy+117,fw*.22,12,p.ink);text(q,String(i+1).padStart(2,'0'),fx+27,fy+151,24,p.ink);
   if(i===0&&pull>.08)for(let j=0;j<5;j++)path(q,[[165+j*77,backY-4],[214+j*77,backY-50-j%2*31],[240+j*77,fy],[180+j*77,fy]],{fill:p.paper,stroke:p.ink,width:2});
  }
  for(let layer=0;layer<3;layer++)for(let i=0;i<count;i++){if(i%3!==layer)continue;const delay=i*.035,a=clamp((u-delay)/(1-delay)),depth=[.50,.78,1.22][layer],emerge=.25+.75*clamp(a/.18),pw=344*depth*emerge,ph=238*depth*emerge,x=450+a*(590+hash(i+31)*500),y=560+i*12-a*(610+hash(i+77)*270)+a*a*260,angle=-.28+a*((hash(i+9)-.25)*1.15);
   if(a<=0)continue;q.save();q.translate(x,y);q.rotate(angle);box(q,-pw/2,-ph/2,pw,ph,p.paper,p.ink,layer===2?4:2);box(q,-pw*.38,-ph*.32,pw*.49,7*depth,p.ink);for(let j=0;j<6;j++)line(q,-pw*.38,-ph*.14+j*ph*.115,pw*.38,-ph*.14+j*ph*.115,p.ink,j===0?3:1.2);if(layer===2){box(q,pw*.17,-ph*.34,pw*.18,ph*.17,null,p.ink,2);line(q,-pw*.38,ph*.40,pw*.38,ph*.40,p.ink,3)}q.restore();papers.push({index:i,layer,x,y,w:pw,h:ph,angle,progress:a});
  }
 });
 result.progress=u;result.papers=papers;result.bodyOrigin=[0,320];if(result.drawn)result.elements.push('cabinet','cabinet:papers');return result;
}

export function softwareDialogV05(c,t,o={}){const p=defaults(o),u=clamp(o.progress??((t-(o.start??27.4))/1.2)),count=o.count??Math.max(1,Math.ceil(u*7));return frame(c,o,1200,900,q=>{for(let i=0;i<Math.min(9,count);i++){const x=70+i*83,y=55+i*59,w=640,h=385;box(q,x,y,w,h,p.paper,p.ink,4);box(q,x,y,w,43,p.ink);text(q,o.title??'DEFRAGMENT / 127',x+17,y+29,23,p.paper);box(q,x+w-38,y+9,22,23,p.paper);line(q,x+w-34,y+14,x+w-20,y+27,p.ink,2);line(q,x+w-20,y+14,x+w-34,y+27,p.ink,2);const body=wrapLines(q,o.text??'演示文字演示',w-70,48);body.forEach((s,j)=>text(q,s,x+32,y+136+j*60,48,p.ink,{font:JP}));for(let j=0;j<10;j++)box(q,x+35+j*55,y+h-83,43,31,(j+i)%3===0?p.paper:p.ink,p.ink,1)}})}
export function interviewSiteV05(c,t,o={}){const p=defaults(o),u=clamp(o.progress??((t-(o.start??45.2))/.8)),asset=o.avatarAsset??'INTERVIEW_AVATAR';const r=frame(c,o,1200,850,q=>{box(q,44,40,1112,770,p.paper,p.ink,4);text(q,'PRIVATE / INTERVIEW',86,115,44,p.ink);line(q,84,143,1118,143,p.ink,5);if(!o.E?.art)throw new Error('interview-site requires E.art');o.E.art(q,asset,[98,206,270,310],{mode:'print'});text(q,o.title??'面接予約',427,249,54,p.ink,{font:JP});text(q,o.text??'演示文字演示',429,326,43,p.ink,{font:JP});box(q,429,399,518,104,p.paper,p.ink,4);text(q,'面接 / 14:00',462,467,36,p.ink,{font:JP});if(u>.35){q.save();q.translate(685,445);q.rotate(-.09);box(q,-230,-65,460,130,p.paper,p.ink,8);text(q,o.cancelText??'面接取消',0,25,66,p.ink,{font:JP,align:'center'});line(q,-253,-79,255,77,p.ink,9);q.restore()}text(q,'CANCELLED / RECORD 127',86,752,24,p.ink)});if(r.drawn)r.elements.push(u>.35?'interview:cancelled':'interview:pending','asset:'+asset);return r}
export function handShadowV05(c,t,o={}){const p=defaults(o),pose=o.pose??'beckon',u=clamp(o.progress??((t-(o.start??137))/1.5)),asset=o.asset??(pose==='dog'?'HAND_DOG_V05':'HAND_BECKON_V05');if(o.E?.art&&o.E.hasAsset?.(asset)!==false&&!o.vectorFallback){const motion=o.motion??1,r=frame(c,o,1000,900,q=>{q.save();q.translate(500,450+Math.sin(t*.61)*3*motion);q.rotate(Math.sin(t*.57+(pose==='dog'?1:0))*.012*motion);o.E.art(q,asset,[-475,-425,950,850],{mode:'ink'});q.restore()});r.pose=pose;r.progress=u;if(r.drawn)r.elements.push('hand-shadow:'+pose,'asset:'+asset);return r}const r=frame(c,o,1000,900,q=>{if(pose==='dog'){path(q,[[43,894],[126,643],[243,558],[260,338],[319,169],[368,168],[367,458],[445,365],[452,105],[503,65],[547,92],[540,369],[600,321],[736,340],[914,450],[942,502],[867,546],[736,533],[669,600],[584,696],[531,899]],{fill:p.ink,stroke:null});path(q,[[456,899],[472,689],[578,574],[641,541],[713,559],[655,639],[611,734],[646,899]],{fill:p.ink,stroke:null});ellipse(q,770,415,12,12,p.paper,null);line(q,692,504,843,506,p.paper,5);line(q,388,582,510,475,p.paper,3);line(q,279,500,318,369,p.paper,3)}else{path(q,[[167,900],[190,669],[143,546],[123,375],[161,338],[206,366],[240,492],[274,522],[280,252],[299,130],[340,113],[369,139],[370,436],[405,464],[425,260],[473,169],[518,180],[531,217],[491,393],[500,469],[552,350],[605,304],[642,326],[638,370],[593,508],[646,446],[700,431],[741,465],[710,531],[641,638],[568,712],[568,900]],{fill:p.ink,stroke:null});q.save();q.translate(330,160);q.rotate(-u*.84);round(q,-35,-35,75,230,35,p.ink,null);ellipse(q,0,-25,37,37,p.ink,null);q.restore();for(const[a,b,cc,d]of[[245,560,289,615],[324,470,351,549],[411,492,448,556],[503,520,524,582]])line(q,a,b,cc,d,p.paper,3)} });r.pose=pose;if(r.drawn)r.elements.push('hand-shadow:'+pose);return r}
export function pillowV05(c,t,o={}){const p=defaults(o),texture=material(JSON.stringify(['pillow',p]),1000,650,q=>{q.beginPath();q.moveTo(93,98);q.bezierCurveTo(260,156,692,34,895,98);q.bezierCurveTo(851,209,940,440,895,554);q.bezierCurveTo(661,505,311,605,93,554);q.bezierCurveTo(149,405,56,229,93,98);q.closePath();q.fillStyle=p.paper;q.fill();q.lineWidth=8;q.strokeStyle=p.ink;q.stroke();q.beginPath();q.moveTo(133,138);q.bezierCurveTo(300,181,670,93,855,138);q.bezierCurveTo(820,260,890,421,855,514);q.bezierCurveTo(655,473,318,553,133,514);q.bezierCurveTo(179,370,98,249,133,138);q.closePath();q.lineWidth=2;q.stroke();for(const[x,y,sx,sy]of[[111,116,220,211],[874,120,772,207],[114,535,220,451],[879,533,767,450]]){line(q,x,y,sx,sy,p.ink,4);line(q,x+13,y,sx+12,sy-18,p.ink,1)}});return frame(c,o,1000,650,q=>q.drawImage(texture,0,0))}
export function sugarCubeV05(c,t,o={}){const p=defaults(o),u=clamp(o.progress??((t-(o.start??109))/.8));const r=frame(c,o,1000,900,q=>{if(o.drawCup!==false){ellipse(q,510,722,326,73,p.paper,p.ink,5);ellipse(q,806,506,112,122,null,p.ink,22);path(q,[[238,389],[274,662],[340,728],[659,728],[727,662],[767,389]],{fill:p.paper,stroke:p.ink,width:6});ellipse(q,503,390,265,83,p.paper,p.ink,5);ellipse(q,503,397,229,56,p.ink,null)}const y=80+u*u*465,x=505+Math.sin(u*Math.PI)*25;q.save();if(o.drawCup!==false){q.beginPath();q.rect(0,0,1000,408);q.clip()}q.translate(x,y);q.rotate((o.rotationCube??.15)+u*.5);path(q,[[-55,-48],[20,-72],[74,-30],[-1,-4]],{fill:p.paper,stroke:p.ink,width:4});path(q,[[-55,-48],[-1,-4],[-1,70],[-55,27]],{fill:p.paper,stroke:p.ink,width:4});path(q,[[-1,-4],[74,-30],[74,43],[-1,70]],{fill:p.ink,stroke:p.ink,width:4});for(let i=0;i<30;i++)box(q,-48+hash(i)*42,-30+hash(i+33)*50,2,2,p.ink);q.restore();if(u>.85){const splash=(u-.85)/.15;for(let i=0;i<7;i++){const a=-Math.PI+i*Math.PI/6;line(q,510+Math.cos(a)*35,412+Math.sin(a)*12,510+Math.cos(a)*(50+splash*95),412+Math.sin(a)*(25+splash*75),p.paper,6)}}});r.progress=u;if(r.drawn){r.elements.push('sugar-cube');if(o.drawCup!==false)r.elements.push('coffee')}return r}
export function pixelWalkV05(c,t,o={}){
 const assets=o.assets??['PIXEL_CHARACTER_01','PIXEL_CHARACTER_02'],E=o.E;
 if(!E?.art)throw new Error('pixel-walk requires E.art');
 const p=defaults(o),elapsed=Math.max(0,t-(o.start??120)),u=clamp(o.progress??elapsed/1.1),steps=[];
 const r=frame(c,o,1100,520,q=>{
  q.save();q.imageSmoothingEnabled=false;
  for(let i=0;i<assets.length;i++){
   const phase=Math.floor(elapsed*8+i*.5)%2,stride=phase?16:-16,x=40+i*455+u*130*(o.direction??1),ground=440;
   const left={x:x+155-25+stride,y:ground+(phase?-9:6)},right={x:x+155+25-stride,y:ground+(phase?6:-9)};
   ellipse(q,x+155,ground+29,104,8,p.ink,null);
   // Small native pixel legs and boots alternate beneath the supplied sprite.
   // They are separate moving blocks, not a vertical float of the whole image.
   for(const foot of[left,right]){box(q,Math.round(foot.x-6),ground-10,12,Math.max(7,foot.y-ground+18),o.pixelFootColor??p.ink);box(q,Math.round(foot.x-12),Math.round(foot.y),28,12,o.pixelFootColor??p.ink)}
   const bottom=o.assetBottoms?.[i]??(i===0?.915:.85);
   q.save();q.translate(x+155,ground-7-(phase?2:0));q.rotate((phase?1:-1)*.012);E.art(q,assets[i],[-155,-310*bottom,310,310],{mode:'image',smoothing:false});q.restore();
   steps.push({asset:assets[i],phase,left,right});
  }q.restore();
 });
 if(r.drawn){for(const asset of assets)r.elements.push('asset:'+asset);r.elements.push('pixel-walk:step')}
 r.progress=u;r.walkSteps=steps;return r;
}

const EXPRESSION_COLORS=['#C8102E','#DAA520','#367E68','#455AAA','#A84C83'];
export function expressionV05(c,t,o={}){const index=Math.max(1,Math.min(5,Math.floor(o.index??1))),asset=o.asset??`BONNIE_EXPRESSION_0${index}`,color=o.color??EXPRESSION_COLORS[index-1],E=o.E;if(!E?.art)throw new Error('expression requires E.art');const r=frame(c,o,800,800,q=>{box(q,35,35,730,730,color,INK,7);E.art(q,asset,[76,76,648,648],{mode:'image'})});r.index=index;r.color=color;if(r.drawn)r.elements.push('expression:'+index,'asset:'+asset);return r}

export const PROP_KINDS_V03=Object.freeze(['flip-phone','smartphone','magnifier','city','tower','paper','newspaper','chat','envelope','cable','shards','ink','halftone','solar-system','cabinet','software-dialog','interview-site','hand-shadow','pillow','sugar-cube','coffee','pixel-walk','expression']);
const ROUTES={'flip-phone':flipPhoneV03,smartphone:smartphoneV03,magnifier:magnifierV03,city:cityV03,tower:towerV03,paper:evidencePaperV03,newspaper:newspaperV03,chat:chatRecordV03,envelope:envelopeV03,cable:cableV03,shards:shardsV03,ink:inkBlotsV03,halftone:halftoneV03,'solar-system':solarSystemV03};
const ELEMENT_NAMES={'flip-phone':'flipPhone',smartphone:'smartphone',magnifier:'magnifier',city:'city',tower:'tower',paper:'paper',newspaper:'newspaper',chat:'chatRecord',envelope:'envelope',cable:'cable',shards:'shards',ink:'ink',halftone:'halftone','solar-system':'solarSystem'};
Object.assign(ROUTES,{cabinet:cabinetV05,'software-dialog':softwareDialogV05,'interview-site':interviewSiteV05,'hand-shadow':handShadowV05,pillow:pillowV05,'sugar-cube':sugarCubeV05,coffee:sugarCubeV05,'pixel-walk':pixelWalkV05,expression:expressionV05});
Object.assign(ELEMENT_NAMES,{cabinet:'cabinet','software-dialog':'softwareDialog','interview-site':'interviewSite','hand-shadow':'handShadow',pillow:'pillow','sugar-cube':'sugarCube',coffee:'coffee','pixel-walk':'pixelWalk',expression:'expression'});
/** kind can also be an array of prop option objects for painter-order layers. */
export function renderPropsV03(c,t,o={}){
 if(!Number.isFinite(t))throw new Error('Prop time must be finite');if(Array.isArray(o))return o.map(p=>renderPropsV03(c,t,p));
 const draw=ROUTES[o.kind];if(!draw)throw new Error(`Unknown V03 prop kind: ${o.kind}`);const result=draw(c,t,o);if(result.drawn&&!result.elements.includes(ELEMENT_NAMES[o.kind]))result.elements.unshift(ELEMENT_NAMES[o.kind]);return result;
}

// Short aliases for scene authors; all accept (context, absoluteTime, options).
export {flipPhoneV03 as phone,magnifierV03 as magnifier,cityV03 as city,smartphoneV03 as smartphone};
export {renderPropsV03 as renderPropsV04};
export {renderPropsV03 as renderPropsV05};
export const PROP_KINDS_V05=PROP_KINDS_V03;
