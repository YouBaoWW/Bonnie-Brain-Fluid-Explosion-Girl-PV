import {demoAsset} from './portable-demo.js';
import {fontDirectionV11,FONT_FAMILIES_V11} from './v11-fonts.js';
/* Six composition studies. All graphic state is a function of absolute song t.
 * Original Canvas implementation; no imports from an older PV project.
 * Source PNGs are only read. Corner-connected white is removed in memory.
 */
import {loadTiming,sampleAudio,timingStatus,ease,progress} from './timing.js';
import {renderCinematicV11,RENDERER_VERSION,CAMERA_POSES,poseAt,lyricEnvelopeAt,fullTimelinePlan} from './cinematic-v11.js';
export {sampleAudio,timingStatus};
export {RENDERER_VERSION,CAMERA_POSES,poseAt,fullTimelinePlan};
export const W=1920,H=1080;
const INK='#000000',PAPER='#F2F2F2',RED='#C8102E';
const JP='"Yu Gothic","MS Gothic","Microsoft YaHei",sans-serif';
const CN='"Microsoft YaHei","SimHei","Yu Gothic",sans-serif';
const SERIF='"SimSun","MS Mincho",serif';
const MONO='Consolas,"Courier New",monospace';
export const fontStatus=[];
export const REVIEW_SHOTS=Object.freeze([
 {id:'K01',t:19.2,label:'主歌 · 案卷',density:'D2',start:0,end:39},
 {id:'K02',t:46.95,label:'线索 · 过载',density:'D3',start:39,end:55.8},
 {id:'K03',t:60.95,label:'头影 · 炸字',density:'D5',start:55.8,end:77.8},
 {id:'K04',t:89.6,label:'间奏 · 字轨',density:'D3',start:77.8,end:103},
 {id:'K05',t:149.95,label:'第二副歌 · 狂舞',density:'D5',start:103,end:164},
 {id:'K06',t:173.3,label:'终爆 · 毒苹果',density:'D5+',start:164,end:Infinity},
]);
export const PREVIEW_CLIPS=Object.freeze([
 {id:'full',label:'完整PV',start:0,end:11495/60,requiresFanny:true},
 {id:'verse',label:'主歌案卷',start:18.5,end:28.5,requiresFanny:false},
 {id:'first-burst',label:'首爆',start:55,end:65,requiresFanny:true},
 {id:'duo',label:'副歌文字／少量双人剪影',start:147.8,end:157.8,requiresFanny:true},
 {id:'final-burst',label:'终爆',start:169,end:179,requiresFanny:true},
 {id:'newspaper-city',label:'报纸／东京／放大镜／聊天',start:121.5,end:131.5,requiresFanny:true},
 {id:'solar-system',label:'宇宙／太阳系／星历文字',start:158.5,end:168.5,requiresFanny:false},
 {id:'first-year-solar',label:'第一副歌年份／太阳系',start:65,end:75,requiresFanny:false},
]);
const ASSETS={
 BONNIE_TOWER_SEATED_V10:'../../assets/intro_v10/Bonnie_tower_seated_silhouette_v10.png',
 BONNIE_TOSS_HAT_V10:'../../assets/intro_v10/Bonnie_toss_hat_v10.png',
 BONNIE_MAG_V06:'../../assets/character_v06/Bonnie_magnifier_silhouette_v06.png',
 MACARON_TRIPLE_V06:'../../assets/props_v06/macaron_triple_v06.png',
 INK_SPLASH_V06:'../../assets/props_v06/ink_splash_v06.png',
 COFFEE_V06:'../../assets/props_v06/coffee_cup_v06.png',
 SUGAR_V06:'../../assets/props_v06/sugar_cube_v06.png',
 ROPE_V06:'../../assets/props_v06/hemp_rope_v06.png',
 PILLOW_V06:'../../assets/props_v06/pillow_v06.png',
 BONNIE_PHONE_V06:'../../assets/character_v06/Bonnie_phone_silhouette_v06.png',
 FANNY_BACK_MAG_V06:'../../assets/character_v06/Fanny_back_magnifier_v06.png',
 PROFILE_ICON_V06:'../../assets/portraits_v06/profile_121_user.png',
 A01:'../../assets/A_character/A01_turnaround_v01.png',
 A10:'../../assets/A_character/A10_magnifier_v02.png',
 A11:'../../assets/A_character/A11_apple_v01.png',
 A13:'../../assets/A_character/A13_overload_v01.png',
 A14:'../../assets/A_character/A14_openarms_v01.png',
 SIL03:'../../assets/SIL_silhouette/SIL03_profile_right_v01.png',
 FANNY:'../../assets/A_character/F01_fanny_monochrome_v01.png',
 FANNY_PROFILE:'../../assets/SIL_silhouette/SIL_Fanny_profile_left_v01.png',
 CITY_TOKYO:'../../assets/background_v03/BG_Tokyo_Tower_v03.png',
 CITY_GOTANDA:'../../assets/background_v04/BG_Gotanda_v04.png',
 NEWSPAPER_ICON:'../../assets/props_v03/bonnie_newspaper_icon_user.png',
 NEWSPAPER_ICON_I:'../../assets/props_v03/bonnie_newspaper_icon_I_user.png',
 NEWSPAPER_ICON_II:'../../assets/props_v03/bonnie_newspaper_icon_II_user.png',
 NEWSPAPER_ICON_III:'../../assets/props_v03/bonnie_newspaper_icon_III_user.png',
 CHIBI_MIRROR:'../../assets/props_v03/bonnie_mirror_chibi_user.png',
 CHIBI_UNIMPRESSED:'../../assets/props_v03/bonnie_unimpressed_chibi_user.png',
 CHIBI_QUESTION:'../../assets/props_v03/bonnie_question_chibi_user.png',
 HARAKIRI_RELIC:'../../assets/props_v03/investigation_scope_hd_v01.png',
 HARAKIRI_KNIFE:'../../assets/props_v03/harakiri_knife_hd_v01.png',
 BONNIE_FULL_A10:'../../assets/character_v05/Bonnie_full_A10_tie_v05.png',
 BONNIE_FULL_A11:'../../assets/character_v05/Bonnie_full_A11_tie_v05.png',
 BONNIE_FULL_A13:'../../assets/character_v05/Bonnie_full_A13_tie_v05.png',
 FANNY_FULL_V05:'../../assets/character_v05/Fanny_full_tie_v05.png',
 INTERVIEW_AVATAR:'../../assets/portraits_v05/interview_avatar_user.png',
 DOCUMENT_PICTURE_01:'../../assets/document_images_v05/document_picture_01_user.png',
 DOCUMENT_ICON_02:'../../assets/document_images_v05/document_icon_02_user.png',
 PROFILE_ICON_01_USER:'../../assets/portraits_v05/profile_icon_01_user.png',
 PIXEL_CHARACTER_01:'../../assets/pixel_characters_v05/pixel_character_01_user.png',
 PIXEL_CHARACTER_02:'../../assets/pixel_characters_v05/pixel_character_02_user.png',
 BONNIE_EXPRESSION_01:'../../assets/expressions_v05/Bonnie_expression_01_user.png',
 BONNIE_EXPRESSION_02:'../../assets/expressions_v05/Bonnie_expression_02_user.png',
 BONNIE_EXPRESSION_03:'../../assets/expressions_v05/Bonnie_expression_03_user.png',
 BONNIE_EXPRESSION_04:'../../assets/expressions_v05/Bonnie_expression_04_user.png',
 BONNIE_EXPRESSION_05:'../../assets/expressions_v05/Bonnie_expression_05_user.png',
 WIKI_BONNIE_EMOJI_08:'../../assets/wiki_v05/bonnie_emoji_08.png',
 WIKI_FANNY_EMOJI_02:'../../assets/wiki_v05/fanny_emoji_02.png',
 WIKI_INVESTIGATION_EVENT:'../../assets/wiki_v05/investigation_event_12703.png',
 WIKI_GIFT_PHONE:'../../assets/wiki_v05/gift_smartphone.png',
 WIKI_GIFT_DUCK:'../../assets/wiki_v05/gift_bath_duck.png',
 WIKI_GIFT_TEDDY:'../../assets/wiki_v05/gift_teddy.png',
 HAND_BECKON_V05:'../../assets/props_v05/hand_beckon_v05.png',
 HAND_DOG_V05:'../../assets/props_v05/hand_dog_v05.png',
 SWIMSUIT_V05:'../../assets/props_v05/school_swimsuit_v05.png',
};
const ART=new Map(),OFF=new Map(),SUBTITLES=new Map();let screen,ctx,cues=[],sourceCues=[],baseReady=false,subtitlesReady=false;
export const assetStatus={baseReady:false,fannyLoaded:false,fannyProfileLoaded:false,missingAssets:['FANNY','FANNY_PROFILE'],exportReady:false};
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const frac=x=>x-Math.floor(x);
const hash=n=>{n=Math.imul((n|0)^0x68bc21eb,0x45d9f3b);n=Math.imul(n^(n>>>16),0x45d9f3b);return((n^(n>>>16))>>>0)/4294967296};
const segmenter=new Intl.Segmenter('ja',{granularity:'grapheme'});
const glyphs=s=>[...segmenter.segment(String(s))].map(x=>x.segment);
function surface(w=W,h=H){const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d',{willReadFrequently:true});return c;}
function scratch(key,w=W,h=H){if(!OFF.has(key))OFF.set(key,surface(w,h));const c=OFF.get(key);if(c.width!==w||c.height!==h){c.width=w;c.height=h}const q=c.getContext('2d');q.setTransform(1,0,0,1,0,0);q.globalCompositeOperation='source-over';q.globalAlpha=1;q.clearRect(0,0,w,h);return[c,q]}
function text(c,s,x,y,size=24,color=INK,{font=CN,weight=700,align='left',rotate=0,alpha=1,outline=0,spacing=0}={}){
 c.save();c.translate(x,y);c.rotate(rotate);c.font=`${weight} ${size}px ${font}`;c.textAlign=align;c.textBaseline='alphabetic';c.fillStyle=color;c.strokeStyle=color;c.lineWidth=outline;c.globalAlpha*=alpha;
 if(spacing){let xx=0;const g=glyphs(s);if(align==='center')xx=-(c.measureText(s).width+spacing*(g.length-1))/2;for(const ch of g){outline?c.strokeText(ch,xx,0):c.fillText(ch,xx,0);xx+=c.measureText(ch).width+spacing}}
 else outline?c.strokeText(s,0,0):c.fillText(s,0,0);c.restore();
}
function fit(c,s,x,y,size,width,color=INK,options={}){c.save();c.font=`${options.weight??700} ${size}px ${options.font??CN}`;const n=Math.min(1,width/Math.max(1,c.measureText(s).width));c.restore();text(c,s,x,y,size*n,color,options);return size*n}
function rule(c,x,y,xx,yy,color=INK,width=1,alpha=1){c.save();c.strokeStyle=color;c.globalAlpha*=alpha;c.lineWidth=width;c.beginPath();c.moveTo(x,y);c.lineTo(xx,yy);c.stroke();c.restore()}
function rect(c,x,y,w,h,color=INK){c.fillStyle=color;c.fillRect(x,y,w,h)}
function circle(c,x,y,r,color=INK,width=1){c.save();c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.stroke();c.restore()}
function vertical(c,s,x,y,size,color=INK,step=size*1.15,options={}){glyphs(s).forEach((g,i)=>text(c,g,x,y+i*step,size,color,{...options,align:'center'}))}
function dots(c,x,y,w,h,color=INK,step=9,r=.85){c.save();c.beginPath();c.rect(x,y,w,h);c.clip();c.fillStyle=color;for(let yy=y;yy<y+h;yy+=step)for(let xx=x;xx<x+w;xx+=step){c.beginPath();c.arc(xx+(Math.floor(yy/step)%2)*step*.5,yy,r,0,Math.PI*2);c.fill()}c.restore()}
function grain(c,dark=false){const key=dark?'grain-dark':'grain-paper';if(!OFF.has(key)){const s=surface();const q=s.getContext('2d');q.fillStyle=dark?PAPER:INK;for(let i=0;i<10500;i++){q.globalAlpha=.03+hash(i*11+2)*.055;const x=hash(i*11)*W,y=hash(i*11+1)*H;q.fillRect(Math.floor(x),Math.floor(y),hash(i*11+3)>.94?2:1,1)}OFF.set(key,s)}c.drawImage(OFF.get(key),0,0)}
function register(c,n,dark=false){const col=dark?PAPER:INK;text(c,'BONNIE  /  POISON APPLE OVERLOAD',80,52,15,col,{font:MONO,weight:400,spacing:1.2});text(c,`FILE 127—${n}`,1840,52,15,col,{font:MONO,weight:400,align:'right'});rule(c,80,70,1840,70,col,1,.5);text(c,'演示文字演示文字演',80,1040,15,col,{font:SERIF,weight:400});text(c,`EXHIBIT ${n} / 06`,1840,1040,13,col,{font:MONO,weight:400,align:'right'})}
function stamp(c,s,x,y,w,h,angle=-.05,col=INK){c.save();c.translate(x,y);c.rotate(angle);c.strokeStyle=col;c.lineWidth=2;c.strokeRect(0,0,w,h);fit(c,s,14,h*.69,h*.48,w-28,col,{font:JP,weight:700});c.restore()}

// Flood only from corners: white clothing touching a source image's lower crop
// must never become transparent merely because it lies on the image boundary.
function prepare(image){
 const w=image.naturalWidth,h=image.naturalHeight,c=surface(w,h),q=c.getContext('2d',{willReadFrequently:true});q.drawImage(image,0,0);const pixels=q.getImageData(0,0,w,h),d=pixels.data,n=w*h,seen=new Uint8Array(n),queue=new Int32Array(n);let a=0,b=0;
 const white=i=>d[i*4+3]<16||(Math.min(d[i*4],d[i*4+1],d[i*4+2])>=230&&Math.max(d[i*4],d[i*4+1],d[i*4+2])-Math.min(d[i*4],d[i*4+1],d[i*4+2])<20);
 function push(i){if(i>=0&&i<n&&!seen[i]&&white(i)){seen[i]=1;queue[b++]=i}}
 [0,w-1,n-w,n-1].forEach(push);
 while(a<b){const i=queue[a++],x=i%w;push(i-w);push(i+w);if(x)push(i-1);if(x<w-1)push(i+1)}
 const bayer=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
 for(let i=0;i<n;i++){const j=i*4;if(seen[i]){d[j+3]=0;continue}const l=.2126*d[j]+.7152*d[j+1]+.0722*d[j+2],threshold=70+(bayer[((Math.floor(i/w)&3)*4)+(i%w&3)]+.5)*152/16;const color=l>threshold?[255,255,255]:[0,0,0];d[j]=color[0];d[j+1]=color[1];d[j+2]=color[2]}
 q.putImageData(pixels,0,0);return c;
}
function tinted(source,color){const c=surface(source.width,source.height),q=c.getContext('2d');q.drawImage(source,0,0);q.globalCompositeOperation='source-in';q.fillStyle=color;q.fillRect(0,0,c.width,c.height);return c}
function posterized(image,threshold=151){const c=surface(image.naturalWidth,image.naturalHeight),q=c.getContext('2d');q.drawImage(image,0,0);const p=q.getImageData(0,0,c.width,c.height),d=p.data;for(let i=0;i<d.length;i+=4){const value=.2126*d[i]+.7152*d[i+1]+.0722*d[i+2]>=threshold?255:0;d[i]=d[i+1]=d[i+2]=value}q.putImageData(p,0,0);return c}
function posterInkLayer(poster){const c=surface(poster.width,poster.height),q=c.getContext('2d');q.drawImage(poster,0,0);const p=q.getImageData(0,0,c.width,c.height);for(let i=0;i<p.data.length;i+=4)if(p.data[i]>127)p.data[i+3]=0;q.putImageData(p,0,0);return c}
function art(c,id,box,{mode='print',mirror=false,alpha=1,rotate=0,crop,alignY='center'}={}){
 const item=ART.get(id),source=item[mode]??item.print;const[x,y,w,h]=box,[nx,ny,nw,nh]=crop??[0,0,1,1],sx=nx*source.width,sy=ny*source.height,sw=nw*source.width,sh=nh*source.height,scale=Math.min(w/sw,h/sh),dw=sw*scale,dh=sh*scale,cy=alignY==='top'?y+dh/2:y+h/2;
 c.save();c.globalAlpha*=alpha;if(id==='PROFILE_ICON_V06')c.filter=(c.filter==='none'?'':c.filter+' ')+'grayscale(1)';c.translate(x+w/2,cy);c.rotate(rotate);if(mirror)c.scale(-1,1);c.drawImage(source,sx,sy,sw,sh,-dw/2,-dh/2,dw,dh);c.restore();return{x:x+(w-dw)/2,y:cy-dh/2,w:dw,h:dh,scale,sourceRect:[sx,sy,sw,sh]};
}
function movingArt(c,id,box,t,{start=18.5,end=28.5,strength=1,...options}={}){
 const a=sampleAudio(t),p=progress(t,start,end),zoom=1+(.034*(1-ease(p))+.014*a.pulse)*strength;
 const[x,y,w,h]=box,ww=w*zoom,hh=h*zoom,dx=Math.sin(t*.67)*9*strength,dy=Math.sin(t*.43)*5*strength;
 return art(c,id,[x+(w-ww)/2+dx,y+(h-hh)/2+dy,ww,hh],options);
}
function sheetFront(c,box,color=PAPER){const a=ART.get('A01'),[x,y,w,h]=box,sx=0,sy=0,sw=a.print.width*.274,sh=a.print.height;const scale=Math.min(w/sw,h/sh);c.save();c.translate(x+w/2,y+h/2);const source=color===INK?a.ink:a.white;c.drawImage(source,sx,sy,sw,sh,-sw*scale/2,-sh*scale/2,sw*scale,sh*scale);c.restore()}
export function sourceCueAt(t){const current=sourceCues.findLast(c=>c.start_seconds<=t);return current?.kind==='lyric'&&(current.end_seconds===null||t<current.end_seconds)?current:null}
export function cueAt(t){const current=cues.findLast(c=>c.start_seconds<=t);return current?.kind==='lyric'&&(current.end_seconds===null||t<current.end_seconds)?current:null}
export function subtitleAt(t){const cue=cueAt(t);if(!cue)return{cueId:null,text:'',visible:false};const line=SUBTITLES.get(cue.id);return{cueId:cue.id,text:line?.zh_text??'',start:cue.start_seconds,end:cue.end_seconds,visible:Boolean(line?.zh_text)}}
function letterbox(c,t){
 c.save();c.setTransform(1,0,0,1,0,0);c.globalAlpha=1;c.globalCompositeOperation='source-over';c.fillStyle='#000';c.fillRect(0,0,W,90);c.fillRect(0,960,W,120);
 const subtitle=subtitleAt(t);if(subtitle.visible){
  const content=glyphs(subtitle.text),size=42;c.font=`700 ${size}px ${CN}`;let lines=[''];for(const g of content){const i=lines.length-1;if(c.measureText(lines[i]+g).width>1740&&lines[i])lines.push(g);else lines[i]+=g}
  c.fillStyle='#fff';c.textAlign='center';c.textBaseline='alphabetic';c.globalAlpha=Math.min(1,(t-subtitle.start+1/30)/.08,(subtitle.end-t)/.08);
  const first=lines.length===1?1035:1008;lines.slice(0,2).forEach((s,i)=>c.fillText(s,W/2,first+i*48));
 }c.restore();return subtitle;
}
function lyric(t){return cueAt(t)?.text.trim()??''}
function lyricLines(s){return s.includes(' ')?s.split(/ +/u):[s]}
function caption(c,t,{x=100,y=900,w=1720,h=130,dark=false,size=68,lines}={}){
 const cue=cueAt(t),s=cue?.text.trim()??'';if(!s)return;const content=lines??lyricLines(s),color=dark?PAPER:INK;
 // Estimated visual reveal, deliberately separate from measured onset data.
 const age=t-cue.start_seconds,duration=Math.min(.38,Math.max(.12,(cue.end_seconds-cue.start_seconds)*.28)),count=glyphs(s).length,revealed=ease(age/duration)*count;let consumed=0;
 const leave=cue.end_seconds-t,dy=(1-ease(age/.16))*18+(leave<.11?-progress(.11-leave,0,.11)*8:0);
 content.forEach((line,i)=>{c.save();c.font=`700 ${size}px ${JP}`;const actual=size*Math.min(1,w/Math.max(1,c.measureText(line).width));c.font=`700 ${actual}px ${JP}`;let xx=x;
  for(const ch of glyphs(line)){if(consumed<revealed||age>=duration)text(c,ch,xx,y+i*size*1.2+dy,actual,color,{font:JP,weight:700});xx+=c.measureText(ch).width;consumed++}consumed++;
  c.restore();});
}
function textureWords(){return 'CASE 127 / 隐匿调查 / 关键线索 / 法学博士 / 证据记录 / INVESTIGATION / 01—01 / '}
function wall(c,t,{x=0,y=100,w=W,h=850,size=19,color=INK,alpha=.18,tilt=0,content=textureWords()}={}){
 c.save();c.beginPath();c.rect(x,y,w,h);c.clip();c.translate(x,y);c.rotate(tilt);for(let i=-4;i<h/(size*1.5)+7;i++){const shift=-((t*(i%2?21:-17)+hash(i+80)*200)%320);text(c,content.repeat(5),shift,i*size*1.5,size,color,{font:MONO,weight:400,alpha})}c.restore();
}
function maskedType(c,t,id,box,{white=false,mirror=false,size=20,content=textureWords()}={}){
 const[layer,q]=scratch('masktype');art(q,id,box,{mode:white?'white':'ink',mirror});q.globalCompositeOperation='source-in';q.fillStyle=white?PAPER:INK;q.fillRect(0,0,W,H);q.globalCompositeOperation='source-atop';wall(q,t,{x:0,y:0,w:W,h:H,size,color:white?INK:PAPER,alpha:1,content});q.globalCompositeOperation='source-over';c.drawImage(layer,0,0);
}
function fragments(c,t,cx,cy,count=60,dark=false,{inner=200,outer=900}={}){
 const col=dark?PAPER:INK,words=['证据','127','調査','記録','CASE','法条','01','?'];
 const pulse=sampleAudio(t).pulse;
 for(let i=0;i<count;i++){const angle=hash(i*13+2)*Math.PI*2+t*.018*(i%2?1:-1),r=inner+frac(hash(i*13+3)+t*.058)*(outer-inner),phase=pulse*26,x=cx+Math.cos(angle)*(r+phase),y=cy+Math.sin(angle)*(r+phase)*.62;const size=12+hash(i*13+4)*24;const rot=(hash(i*13+5)-.5)*.52+t*.03;text(c,words[i%words.length],x,y,size,col,{font:i%2?MONO:JP,weight:700,rotate:rot,alpha:.35+hash(i)*.65});}
}
function rays(c,cx,cy,count,color=INK){for(let i=0;i<count;i++){const a=hash(i*7+11)*Math.PI*2,r=160+hash(i*7+13)*210,len=120+hash(i*7+17)*650;rule(c,cx+Math.cos(a)*r,cy+Math.sin(a)*r,cx+Math.cos(a)*(r+len),cy+Math.sin(a)*(r+len),color,1+hash(i*7)*4,.85)}}

function caseStudy(c,t){
 rect(c,0,0,W,H,PAPER);dots(c,890,140,930,780,INK,9,.7);rect(c,116,150,682,700,PAPER);rule(c,822,125,822,910,INK,2);
 text(c,'調 査 記 録',116,211,22,INK,{font:SERIF,weight:400,spacing:4});text(c,'127',106,355,150,INK,{font:MONO,weight:700});text(c,'BONNIE',123,396,21,INK,{font:MONO,weight:400,spacing:6});rule(c,120,430,728,430,INK,2);
 caption(c,t,{x:116,y:555,w:650,size:83});
 c.save();c.strokeStyle=INK;c.lineWidth=2;c.beginPath();c.ellipse(290,531,191,52,-.04,0,Math.PI*2);c.stroke();c.restore();
 rule(c,118,745,640,745,INK,1);text(c,'ARCHIVE : 自己问答 / 线索未决',120,784,18,INK,{font:CN,weight:400});rect(c,120,810,270,15,INK);text(c,'RECORD — 000127',120,864,17,INK,{font:MONO,weight:400});
 const exhibit=t>=21.45&&t<24.9?'A11':'A10';
 movingArt(c,exhibit,exhibit==='A10'?[760,110,1115,830]:[1040,105,645,835],t);
 const a=sampleAudio(t);rule(c,858,930,858+760*(.15+a.rms*.85),930,INK,3);text(c,`EVIDENCE / ${String(Math.max(1,Math.floor((t-18.5)*4)+1)).padStart(4,'0')}`,1260,953,17,INK,{font:MONO,weight:400});
 stamp(c,'隐匿调查',1510,861,245,70,.045);text(c,'EXAMINE / OBSERVE / REPEAT',960,986,16,INK,{font:MONO,weight:400,spacing:2});grain(c);register(c,'01');
}
function overload(c,t){
 rect(c,0,0,W,H,INK);wall(c,t,{x:730,y:95,w:1120,h:860,size:23,color:PAPER,alpha:.16,tilt:-.07});
 text(c,'携帯纷失',948,257,150,PAPER,{font:JP,outline:1.4,rotate:-.075});text(c,'精神壊灭',1070,425,150,PAPER,{font:JP,outline:1.4,rotate:-.075});
 for(let i=0;i<7;i++)rule(c,718,720+i*29,1830,340+i*74,PAPER,1,.18);movingArt(c,'A13',[68,103,720,920],t,{start:39,end:55.8,strength:.8});
 rect(c,866,484,974,286,INK);caption(c,t,{x:904,y:585,w:880,dark:true,size:91});
 text(c,'OVERLOAD',880,864,100,PAPER,{font:MONO,weight:700,spacing:6});text(c,'DOCUMENTS EXCEED COGNITIVE CAPACITY',889,909,18,PAPER,{font:MONO,weight:400});
 stamp(c,'線索過多',1500,931,300,62,.045,PAPER);grain(c,true);register(c,'02',true);
}
function headExplosion(c,t){
 const inverse=t>=59.5&&t<62.4,bg=inverse?INK:PAPER,fg=inverse?PAPER:INK,a=sampleAudio(t),p=progress(t,55.8,65),zoom=1.05-.05*ease(p)+a.pulse*.025,box=[870-28*Math.sin(t*.6),124,870*zoom,755*zoom];
 rect(c,0,0,W,H,bg);c.save();c.translate(1380,485);c.rotate(Math.sin(t*.3)*.06);c.translate(-1380,-485);rays(c,1380,485,65,fg);c.restore();wall(c,t*2,{x:850,y:100,w:1000,h:740,size:14,color:fg,alpha:.2});
 maskedType(c,t*2,'SIL03',box,{size:23,white:inverse,mirror:inverse,content:lyric(t)?`${lyric(t)} / `:textureWords()});
 const cue=cueAt(t),s=lyric(t),g=glyphs(s),mid=Math.ceil(g.length/2),terms=s.includes('脳浆')?['脳浆','炸裂']:[g.slice(0,mid).join(''),g.slice(mid).join('')];
 const stampScale=cue?1+.52*Math.exp(-Math.max(0,t-cue.start_seconds)*14):1;
 c.save();c.translate(430,445);c.scale(stampScale,stampScale);c.translate(-430,-445);fit(c,terms[0],99,355,226,720,fg,{font:JP,weight:700,rotate:-.045});fit(c,terms[1],109,651,264,720,fg,{font:JP,weight:700,rotate:-.045});c.restore();text(c,'演示文字演',120,744,34,fg,{font:SERIF,weight:400,spacing:7});
 fragments(c,t,1380,440,52,inverse,{inner:355,outer:920});rect(c,80,874,1760,126,fg);caption(c,t,{x:111,y:956,w:1690,size:65,dark:!inverse,lines:[lyric(t)]});grain(c,inverse);register(c,'03',inverse);
}
function interlude(c,t){
 rect(c,0,0,W,H,INK);
 for(let i=0;i<6;i++){const y=154+i*147;rect(c,0,y-42,W,67,i%2?PAPER:INK);text(c,textureWords().repeat(5),-((t*(i%2?56:-37)+i*81)%400),y,39,i%2?INK:PAPER,{font:MONO,weight:700});}
 const[layer,q]=scratch('sil-ground');art(q,'A14',[199,97,665,920],{mode:'ink'});q.globalCompositeOperation='source-in';q.fillStyle=INK;q.fillRect(0,0,W,H);c.drawImage(layer,0,0);art(c,'A14',[199,97,665,920],{mode:'white'});
 rect(c,932,297,850,465,INK);text(c,'回線断絶',992,373,32,PAPER,{font:SERIF,weight:400,spacing:7});text(c,'INQUIRY / NO CONNECTION',992,413,15,PAPER,{font:MONO,weight:400,spacing:2});
 caption(c,t,{x:991,y:530,w:745,dark:true,size:49});text(c,'调查未接通 / CONNECTION LOST',992,679,19,PAPER,{font:MONO,weight:400});
 rule(c,990,713,1711,713,PAPER,2);sheetFront(c,[1620,106,170,330],INK);text(c,'空 位',1730,481,17,PAPER,{font:JP,weight:400,align:'center'});
 text(c,'CASE / 127',96,951,23,PAPER,{font:MONO,weight:400});text(c,'INTERLUDE — DOCUMENT TRAILS',1790,951,17,PAPER,{font:MONO,weight:400,align:'right'});grain(c,true);register(c,'04',true);
}
function duo(c,t,{dark=false,final=false}={}){
 const a=sampleAudio(t),p=progress(t,final?169:147.8,final?179:157.8),silhouette=final?t<171.65||t>=174.7:t>=151.1&&t<155.0;
 const heads=final?t>=174.7&&t<177.53:t>=149.88&&t<152.63;
 const split=960+Math.sin(t*.45)*65;rect(c,0,0,W,H,PAPER);rect(c,0,0,split,H,INK);
 c.save();c.beginPath();c.rect(80,87,1760,770);c.clip();
 for(let j=0;j<7;j++){const rr=170+frac(j/7+t*.08)*700;circle(c,960,450,rr,j%2?PAPER:INK,1.5+3*a.pulse);}
 c.restore();wall(c,t*2,{x:80,y:100,w:640,h:740,size:15,color:PAPER,alpha:.16});wall(c,-t*2,{x:1190,y:100,w:650,h:740,size:15,color:INK,alpha:.14});
 const h=730+55*(1-ease(p))+22*a.pulse,y=104+(790-h)*.5,left=[380+Math.sin(t*.7)*11,y,620,h],right=[880-Math.sin(t*.7)*11,y,620,h];
 if(heads){
  const size=665+25*a.pulse,headY=150;maskedType(c,t*2,'SIL03',[240,headY,size,size],{white:true,size:23});if(ART.has('FANNY_PROFILE'))maskedType(c,-t*2,'FANNY_PROFILE',[1010,headY,size,size],{white:false,size:23});
 }else if(silhouette){maskedType(c,t*2,'A14',left,{white:true,size:19});if(ART.has('FANNY'))maskedType(c,-t*2,'FANNY',right,{white:false,size:19,mirror:true})}
 else{movingArt(c,'A14',left,t,{start:147.8,end:157.8,strength:.4,rotate:-.025});if(ART.has('FANNY'))movingArt(c,'FANNY',right,t,{start:147.8,end:157.8,strength:.4,mirror:true,rotate:.025})}
 text(c,'BONNIE',112,192,33,PAPER,{font:MONO,weight:700,spacing:5});text(c,'FANNY',1810,192,33,INK,{font:MONO,weight:700,spacing:5,align:'right'});
 if(!ART.has('FANNY')){rect(c,1100,350,620,230,PAPER);text(c,'芬妮资产待加载',1140,450,36,INK);text(c,'DUO EXPORT BLOCKED',1140,510,19,INK,{font:MONO,weight:400})}
 if(!final&&t>=152.63&&t<154.05){
  const s=glyphs(lyric(t)),mid=Math.ceil(s.length/2);rect(c,882,225,155,590,INK);vertical(c,s.slice(0,mid).join(''),925,285,39,PAPER,54,{font:JP,weight:700});vertical(c,s.slice(mid).join(''),990,285,39,PAPER,54,{font:JP,weight:700});
 }else{rect(c,80,872,1760,126,INK);caption(c,t,{x:110,y:956,w:1700,size:67,dark:true,lines:[lyric(t)]})}
 grain(c);register(c,final?'06':'05',true);rect(c,split+15,24,1840-split,40,PAPER);text(c,`FILE 127—${final?'06':'05'}`,1840,52,15,INK,{font:MONO,weight:400,align:'right'});
}
function secondChorus(c,t){duo(c,t)}
function apple(c,x,y,r,color){c.save();c.translate(x,y);c.fillStyle=color;c.beginPath();c.moveTo(0,-r*.6);c.bezierCurveTo(-r*1.2,-r*1.25,-r*1.3,r*.4,-r*.35,r);c.bezierCurveTo(-r*.1,r*1.16,0,r*.94,r*.13,r);c.bezierCurveTo(r*.95,r*1.2,r*1.42,-r*.65,r*.45,-r*.86);c.bezierCurveTo(r*.2,-r*.92,r*.1,-r*.67,0,-r*.6);c.fill();c.strokeStyle=PAPER;c.lineWidth=3;c.beginPath();c.moveTo(0,-r*.62);c.quadraticCurveTo(-r*.06,-r*1.02,r*.18,-r*1.24);c.stroke();c.restore()}
function finalBurst(c,t){
 if(t<171.65||t>=174.7&&t<177.53){duo(c,t,{final:true});return}
 rect(c,0,0,W,H,INK);const cx=1010,cy=407;
 const audio=sampleAudio(t);for(let i=0;i<29;i++){const a=hash(i*17)*Math.PI*2+Math.sin(t*.3)*.07,dist=hash(i*17+1)*55+100,len=480+hash(i*17+2)*950+audio.pulse*65,spread=.008+hash(i*17+3)*.035;c.fillStyle=PAPER;c.beginPath();c.moveTo(cx+Math.cos(a)*dist,cy+Math.sin(a)*dist);c.lineTo(cx+Math.cos(a-spread)*len,cy+Math.sin(a-spread)*len);c.lineTo(cx+Math.cos(a+spread)*len,cy+Math.sin(a+spread)*len);c.closePath();c.fill()}
 rect(c,90,122,702,573,INK);text(c,'終',95,454,335,PAPER,{font:SERIF,weight:700,outline:2});text(c,'POISON',105,544,64,PAPER,{font:MONO,weight:700,spacing:4});text(c,'APPLE',107,628,80,PAPER,{font:MONO,weight:700,spacing:11});
 movingArt(c,'A11',[1190,95,635,918],t,{start:171.65,end:174.7,strength:.55});fragments(c,t,cx,cy,50,true,{inner:140,outer:680});circle(c,cx,cy,87+audio.pulse*8,PAPER,1);circle(c,cx,cy,101+audio.pulse*13,PAPER,1);apple(c,cx,cy,39*(1+audio.pulse*.08),RED);
 rect(c,80,747,1035,232,INK);const s=lyric(t),pieces=s==='演示文字演示文字演示文字演'?['演示文字演示文','演示文字演示']:[s];caption(c,t,{x:104,y:835,w:985,size:89,dark:true,lines:pieces});text(c,'EVIDENCE  /  000127  /  END OF INFERENCE',107,1002,15,PAPER,{font:MONO,weight:400});grain(c,true);register(c,'06',true);
}
const SCENES=[caseStudy,overload,headExplosion,interlude,secondChorus,finalBurst];
let activeFontTimeV11=0;
const cinematicEnv={get cues(){return cues},INK,PAPER,RED,get JP(){return fontDirectionV11(activeFontTimeV11,cueAt(activeFontTimeV11)).font},fontFor:t=>fontDirectionV11(t,cueAt(t)).font,FONT_FAMILIES_V11,CN,SERIF,MONO,text,rule,rect,circle,scratch,art,getAsset:(id,mode='image')=>{const a=ART.get(id);return a?.[mode]??a?.print??null},sourceCueAt,maskedType,fragments,grain,apple,sampleAudio,cueAt,patterns:new Map(),hasAsset:id=>ART.has(id)};
export const lyricMotionAt=t=>lyricEnvelopeAt(t,cueAt);
function luminanceMask(source,light){const w=source.naturalWidth??source.width,h=source.naturalHeight??source.height,c=surface(w,h),q=c.getContext('2d',{willReadFrequently:true});q.drawImage(source,0,0);const p=q.getImageData(0,0,w,h),d=p.data;for(let i=0;i<d.length;i+=4){const l=.2126*d[i]+.7152*d[i+1]+.0722*d[i+2];if((l>=128)!==light)d[i+3]=0;d[i]=d[i+1]=d[i+2]=255}q.putImageData(p,0,0);return c}
const TIE_FLOWERS_V11={
 BONNIE_MAG_V06:[[583,450,10],[597,476,11],[595,499,7]],
 BONNIE_PHONE_V06:[[599,466,12],[615,496,12],[606,522,9]],
};
function tieLayer(source,id){
 const w=source.naturalWidth??source.width,h=source.naturalHeight??source.height,c=surface(w,h),q=c.getContext('2d',{willReadFrequently:true});q.drawImage(source,0,0);const p=q.getImageData(0,0,w,h),d=p.data;
 // Native white flowers become black negative shapes against the silhouette.
 // The two V06 silhouette drawings have blank ties, so restore matching plum
 // flowers as vector details in the tie's own source coordinates. Mirroring,
 // crops and scene transforms then carry the details with the complete figure.
 const redRows=new Map(),flowerTop={BONNIE_FULL_A10:440,BONNIE_FULL_A11:460,BONNIE_FULL_A13:570}[id];
 if(flowerTop)for(let y=flowerTop;y<h;y++){let left=w,right=-1;for(let x=0;x<w;x++){const i=(y*w+x)*4;if(d[i+3]>16&&d[i]>d[i+1]*1.18&&d[i]>d[i+2]*1.04&&d[i]-Math.min(d[i+1],d[i+2])>28){left=Math.min(left,x);right=Math.max(right,x)}}if(right>=left)redRows.set(y,[left,right])}
 for(let i=0;i<d.length;i+=4){const red=d[i]>d[i+1]*1.18&&d[i]>d[i+2]*1.04&&d[i]-Math.min(d[i+1],d[i+2])>28;if(red)continue;const y=Math.floor(i/4/w),x=i/4%w,span=redRows.get(y);if(span&&x>=span[0]&&x<=span[1]&&Math.min(d[i],d[i+1],d[i+2])>160){d[i]=d[i+1]=d[i+2]=0;d[i+3]=255;}else d[i+3]=0;}
 q.putImageData(p,0,0);q.save();q.globalCompositeOperation='source-atop';
 for(const[x,y,r]of TIE_FLOWERS_V11[id]??[]){q.fillStyle=INK;for(let n=0;n<5;n++){const a=-Math.PI/2+n*Math.PI*2/5;q.beginPath();q.arc(x+Math.cos(a)*r*.63,y+Math.sin(a)*r*.63,r*.48,0,Math.PI*2);q.fill()}q.beginPath();q.arc(x,y,r*.40,0,Math.PI*2);q.fill();q.fillStyle='#E64179';q.beginPath();q.arc(x,y,r*.12,0,Math.PI*2);q.fill()}
 q.restore();if(TIE_FLOWERS_V11[id]){const result=q.getImageData(0,0,w,h).data;let blackDetailPixels=0;for(let i=0;i<result.length;i+=4)if(result[i+3]>200&&Math.max(result[i],result[i+1],result[i+2])<30)blackDetailPixels++;(assetStatus.tieDetails??={})[id]={sourceCoordinateFlowers:TIE_FLOWERS_V11[id].length,blackDetailPixels,sourceRasterModified:false};}return c;
}
async function loadAsset(id,file){let image;if(new URL(location.href).searchParams.get('demo')!=='0'){image=demoAsset(id)}else{image=new Image();image.src=new URL(file,import.meta.url);await image.decode();}const print=prepare(image),poster=id==='CITY_TOKYO'?posterized(image,151):print,posterInk=id==='CITY_TOKYO'?posterInkLayer(poster):tinted(print,INK);ART.set(id,{image,print,tie:tieLayer(image,id),poster,posterInk,posterWhite:tinted(posterInk,PAPER),ink:tinted(print,INK),white:tinted(print,PAPER),darkMask:luminanceMask(image,false),lightMask:luminanceMask(image,true)})}
function updateAssetStatus(){assetStatus.baseReady=baseReady;assetStatus.fannyLoaded=ART.has('FANNY');assetStatus.fannyProfileLoaded=ART.has('FANNY_PROFILE');assetStatus.cityLoaded=ART.has('CITY_TOKYO');assetStatus.gotandaLoaded=ART.has('CITY_GOTANDA');assetStatus.newspaperIconLoaded=ART.has('NEWSPAPER_ICON');assetStatus.missingAssets=Object.keys(ASSETS).filter(id=>!ART.has(id));assetStatus.subtitleLoaded=subtitlesReady;assetStatus.demoMode=new URL(location.href).searchParams.get('demo')!=='0';assetStatus.originalAssetsReady=baseReady&&subtitlesReady&&!assetStatus.missingAssets.length&&!assetStatus.demoMode;assetStatus.exportReady=assetStatus.originalAssetsReady;return assetStatus}
function assetAliases(){const pairs={DOCUMENT_PICTURE:'DOCUMENT_PICTURE_01',DOCUMENT_ICON:'DOCUMENT_ICON_02',PIXEL_FANNY:'PIXEL_CHARACTER_01',PIXEL_BONNIE:'PIXEL_CHARACTER_02',...Object.fromEntries([1,2,3,4,5].map(i=>[`EXPRESSION_${String(i).padStart(2,'0')}`,`BONNIE_EXPRESSION_${String(i).padStart(2,'0')}`]))};for(const[id,source]of Object.entries(pairs))if(ART.has(source))ART.set(id,ART.get(source));if(ART.has('FANNY_FULL_V05'))ART.set('FANNY',ART.get('FANNY_FULL_V05'))}
export async function refreshAssets(){for(const[id,file]of Object.entries(ASSETS))if(!ART.has(id)){try{await loadAsset(id,file)}catch{}}assetAliases();return updateAssetStatus()}
export function assertReadyForRange(start,end){if(!baseReady)throw new Error('Base assets, lyrics and measured audio features are not ready');const needsFanny=PREVIEW_CLIPS.some(c=>c.requiresFanny&&start<c.end&&end>c.start);if(needsFanny&&(!ART.has('FANNY')||!ART.has('FANNY_PROFILE')))throw new Error('FANNY or FANNY_PROFILE asset missing: cannot export a two-character preview');return{ready:true,requiresFanny:needsFanny,...updateAssetStatus(),timingStatus}}
export async function init(canvas){
 screen=canvas;screen.width=W;screen.height=H;ctx=screen.getContext('2d',{alpha:false,willReadFrequently:true});
 await Promise.all(Object.entries(ASSETS).filter(([id])=>!id.startsWith('FANNY')).map(([id,file])=>loadAsset(id,file)));
 await Promise.all([refreshAssets(),loadTiming()]);
 const response=await fetch(new URL('../../data/lyrics/lyrics_cues.json',import.meta.url));if(!response.ok)throw new Error('Cannot load user lyric cues');const data=await response.json();sourceCues=(data.cues??[]).slice().sort((a,b)=>a.start_seconds-b.start_seconds);const displayResponse=await fetch(new URL('../../data/lyrics/lyrics_display_v11.json',import.meta.url));if(!displayResponse.ok)throw new Error('Cannot load approved V05 display lyrics');const displayData=await displayResponse.json(),display=new Map(displayData.cues.map(c=>[c.id,c]));cues=sourceCues.map(c=>{if(c.kind!=='lyric')return{...c};const approved=display.get(c.id);if(!approved||approved.source_text!==c.text||approved.start_seconds!==c.start_seconds||approved.end_seconds!==c.end_seconds)throw new Error('Display lyric source mismatch: '+c.id);return{...c,source_text:c.text,text:approved.display_text}});assetAliases();
 const subtitleResponse=await fetch(new URL('../../data/lyrics/lyrics_zh_v11.json',import.meta.url));if(!subtitleResponse.ok)throw new Error('Cannot load Chinese subtitle cues');const subtitleData=await subtitleResponse.json();for(const line of subtitleData.cues??[])SUBTITLES.set(line.id,line);for(const cue of cues.filter(c=>c.kind==='lyric')){const line=SUBTITLES.get(cue.id);if(!line?.zh_text||line.start_seconds!==cue.start_seconds||line.end_seconds!==cue.end_seconds)throw new Error(`Chinese subtitle missing or mismatched: ${cue.id}`)}subtitlesReady=true;
 if(new URL(location.href).searchParams.get('demo')==='0'){ const brushFace=new FontFace('Yuji Syuku',`url(${new URL('../../assets/fonts_v11/YujiSyuku-Regular.ttf',import.meta.url)})`,{style:'normal',weight:'400'});try{await brushFace.load();document.fonts.add(brushFace)}catch{console.info('Optional local brush font omitted; using system fallback')}}
 await Promise.all([document.fonts.load('400 64px \"Yuji Syuku\"','演示文字演示文字演示文字演示'),document.fonts.load('700 64px "Yu Gothic"','演示文字演示文'),document.fonts.load('700 64px "Microsoft YaHei"','毒苹果推理过载'),document.fonts.load('400 24px "SimSun"','调查记录'),document.fonts.load('400 24px Consolas','FILE 127')]);await document.fonts.ready;
 for(const name of ['Yuji Syuku','Yu Gothic','Yu Gothic Light','MS Gothic','Microsoft YaHei','SimSun','Consolas'])if(document.fonts.check(`24px "${name}"`))fontStatus.push(name);
 baseReady=true;updateAssetStatus();return {renderFrame,shots:REVIEW_SHOTS,clips:PREVIEW_CLIPS,assetStatus,timingStatus,version:RENDERER_VERSION,poses:CAMERA_POSES};
}
export function renderFrame(t,options={}){
 if(!ctx)throw new Error('Call init first');if(!Number.isFinite(t))throw new Error('Frame time must be finite');
 const index=Math.max(0,REVIEW_SHOTS.findIndex(s=>t>=s.start&&t<s.end)),shot=REVIEW_SHOTS[index];ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';activeFontTimeV11=t;const cinematic=renderCinematicV11(ctx,t,cinematicEnv,options);if(!cinematic)throw new Error('Full V05 timeline is uncovered at '+t);ctx.restore();const subtitle=letterbox(ctx,t);return{canvas:screen,shot,cue:cueAt(t),sourceCue:sourceCueAt(t),audio:sampleAudio(t),assetStatus:updateAssetStatus(),version:RENDERER_VERSION,pose:cinematic?.pose??null,lyricEnvelope:cinematic?.lyricEnvelope??null,textPlanes:cinematic?.textPlanes??[],subtitle,letterbox:{top:90,bottom:120,activeTop:90,activeBottom:960},elements:cinematic?.elements??[],characterExposure:cinematic?.characterExposure??null,semanticFocus:cinematic?.semanticFocus??null,motionState:cinematic?.motionState??null,yearState:cinematic?.yearState??null,lensState:cinematic?.lensState??null,cueMotion:cinematic?.cueMotion??null,inkDiagnostics:cinematic?.inkDiagnostics??null,paperPageState:cinematic?.paperPageState??null,smallCharacterAssets:cinematic?.smallCharacterAssets??[],cameraState:cinematic?.cameraState??null,expressionState:cinematic?.expressionState??null,characterDetailState:cinematic?.characterDetailState??null,revisionState:{...(cinematic?.revisionState??{}),fontDirection:fontDirectionV11(t,cueAt(t))}};
}
