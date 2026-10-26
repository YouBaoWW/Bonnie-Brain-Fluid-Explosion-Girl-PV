/* V11 spatial and semantic typography revisions. All motion is derived from
 * absolute song time, including the quiet signal sequence and paper fly-bys. */
import {drawCabinetV06,drawTriplePropsV06} from './v11-early.js';
const sat=x=>Math.max(0,Math.min(1,x)),mix=(a,b,u)=>a+(b-a)*u;
const smooth=x=>{x=sat(x);return x*x*(3-2*x)};
const range=(t,a,b)=>sat((t-a)/(b-a));
const TAU=Math.PI*2;
function fitText(c,E,s,x,y,size,width,{alpha=1,color=E.INK,align='center',weight=700,stroke=0}={}){
 c.save();c.font=`${weight} ${size}px ${E.JP}`;size*=Math.min(1,width/Math.max(1,c.measureText(s).width));c.font=`${weight} ${size}px ${E.JP}`;c.textAlign=align;c.textBaseline='alphabetic';c.globalAlpha*=alpha;c.fillStyle=color;
 if(stroke){c.strokeStyle=E.PAPER;c.lineWidth=stroke;c.lineJoin='round';c.strokeText(s,x,y)}c.fillText(s,x,y);c.restore();return size;
}
function fullRows(c,t,E,H,rows,{x=960,y=410,size=160,width=1600,gap=190,start=E.cueAt(t)?.start_seconds??t,reveal=.15,color=E.INK}={}){
 const alpha=smooth(range(t,start,start+reveal));rows.forEach((s,i)=>fitText(c,E,s,x,y+i*gap,size,width,{alpha,color}));
 H.mark('typography:semantic-phrase-lines');return rows;
}
function windows(c,t,E,p,H){
 H.vstage(c,t,E,p,{kind:'plain'});const age=t-27.52,back=smooth(range(age,0,.23));
 c.save();c.globalAlpha=.12;H.vprop(c,t,E,'software-dialog',[-160,170,2200,950],{count:4,progress:1,text:'',title:'MEMORY / 127'});c.restore();
 const recover=smooth(range(age,.36,.73));
 for(let i=0;i<4;i++){
  const x=370+i*110,y=270+i*60;c.save();c.globalAlpha=.4+.15*i;
  H.vprop(c,t,E,'software-dialog',[x,y,1000,490],{count:1,progress:recover,text:recover>.25?'演示文字演示':'',title:'DEFRAGMENT / '+String(i+1).padStart(2,'0')});c.restore();
 }
 const word=E.cueAt(t)?.text??'演示文字演示',g=H.chars(word),enter=H.out(range(age,0,.15));
 c.save();c.font=`900 260px ${E.JP}`;const widths=g.map(a=>c.measureText(a).width),scale=Math.min(1,1600/widths.reduce((a,b)=>a+b,0));let xx=-widths.reduce((a,b)=>a+b,0)*scale/2;
 g.forEach((ch,i)=>{const fly=smooth(range(age,.36+i*.009,.70+i*.009)),x=mix(960+xx,660+(i%4)*165,fly),y=mix(560,510+Math.floor(i/4)*95,fly),sz=mix(260*scale,82,fly);c.save();c.translate(x,y);c.rotate((1-enter)*-.12+(i%2?1:-1)*Math.sin(fly*Math.PI)*.32);c.scale(mix(1.45,1,enter),mix(1.45,1,enter));fitText(c,E,ch,0,0,sz,sz*1.4,{align:'left',alpha:(.2+.8*enter)*(1-fly*.88),weight:900,stroke:4});c.restore();xx+=widths[i]*scale});c.restore();
 H.mark('typography:keyword-outside-window','typography:word-shards-return-to-windows');
 H.info({revisionState:{windowTypography:{keyword:word,semanticGroups:['妄想','演示文字'],phase:age<.16?'burst':age<.36?'read':'recover',recover,fullPhrasePreserved:true}}});
}
function collapse(c,t,E,p,H){
 H.vstage(c,t,E,p,{kind:'plain'});const cue=E.cueAt(t),parts=(cue?.text??'').trim().split(/\s+/),age=t-28.32;
 const rows=parts.length===2?parts:[(cue?.text??'').slice(0,5),(cue?.text??'').slice(5)];
 for(let i=0;i<8;i++){const z=(i+age*1.5)%8,s=1/(1+z*.55);c.save();c.globalAlpha=.08+.1*s;const x=960+(i%2?1:-1)*800*s;H.vprop(c,t,E,'paper',[x-170*s,610-350*s,340*s,480*s],{title:'127',body:'証拠 / 照合',rotation:(i%2?1:-1)*.10});c.restore()}
 const a=H.out(range(age,0,.17)),b=H.out(range(age,.67,.86));
 fullRows(c,t,E,H,[rows[0]],{x:960-(1-a)*1700,y:420,size:230,width:1650,start:28.32,reveal:.10});
 if(age>=.67)fullRows(c,t,E,H,[rows[1]],{x:960+(1-b)*1600,y:740,size:265,width:1650,start:28.99,reveal:.10});
 H.mark('typography:two-intact-meaning-groups','camera:face-collapse-depth-recovery');
 H.info({revisionState:{semanticTypography:{groups:rows,breaksInsideWords:false,firstHold:age>=.17,secondHold:age>=.86}}});
}
function macaron(c,t,E,p,H,{start=p.start,end=p.end}={}){
 // Reuse the approved first passage on a cue-local clock. The second line is
 // fully legible early; its arc settles before the final release into pixels.
 const second=start>100,clock=second?29.83+(t-start)*3.24/(end-start):t;
 H.vstage(c,t,E,p,{kind:'musical'});drawTriplePropsV06(c,t,E,p,H,{start,end,lyric:false});const cue=E.cueAt(t),s=cue?.text??'',g=H.chars(s),bend=smooth(range(clock,31.08,31.68)),release=second?smooth(range(t,end-.28,end)):0;
 const font=Math.min(101,1650/Math.max(1,g.length)),r=780,ry=375,cx=960,cy=725;
 for(let i=0;i<g.length;i++){
  const a=mix(-Math.PI+.19,-.19,(i+.5)/g.length),x=mix(960+(i-(g.length-1)/2)*font,cx+Math.cos(a)*r,bend),y=mix(255,cy+Math.sin(a)*ry,bend)-release*24,en=H.glyphEnvelope(cue,t,i,g.length),alpha=second?smooth(range(clock,29.83+i*.024,29.93+i*.024)):en.alpha;
  c.save();c.translate(x,y);c.rotate(bend*Math.atan2(ry*Math.cos(a),-r*Math.sin(a)));fitText(c,E,g[i],0,0,font,font*1.3,{alpha:alpha*(1-release),stroke:3});c.restore();
 }
 const burst=smooth(range(clock,30.78,30.94))*(1-smooth(range(clock,31.25,31.48)));
 if(burst>.001){c.save();c.translate(960,490);const sc=mix(1.23,1,H.out(range(clock,30.78,30.99)));c.scale(sc,sc);fitText(c,E,'演示文字',0,0,230,1300,{alpha:burst,weight:900,stroke:8});c.restore()}
 if(clock>32.30&&clock<32.65){const u=range(clock,32.30,32.65);c.save();c.globalAlpha=Math.sin(u*Math.PI)*.16;fitText(c,E,'演示文字',960,430,320,1540,{stroke:0});c.restore()}
 H.mark('typography:semicircle-tangent-spaced','typography:keyword-burst-then-bend-to-ring');
 H.info({revisionState:{arcTypography:{keyword:'演示文字',bend,keywordAlpha:burst,phase:release>0?'release':burst>.1?'burst':bend<1?'bend':'ring',fullPhrase:s,start,end,passage:second?'second':'first',release,revealComplete:second?clock>=29.93+(g.length-1)*.024:null}}});
}
function layeredCabinet(c,t,E,p,H){
 H.vstage(c,t,E,p,{kind:'cabinet-room'});const age=t-33.07;
 c.save();c.globalAlpha=.54;c.filter='blur(1.2px)';drawCabinetV06(c,t,E,p,H,{scatter:false,box:[1370-age*11,155+Math.sin(age*.5)*10,480,730],start:33.07});c.restore();
 for(let i=0;i<8;i++){c.save();c.globalAlpha=.14;c.filter='blur(1.0px)';const x=100+i*210-age*(14+i*2),y=180+(i%3)*220;H.vprop(c,t,E,'paper',[x,y,180,240],{rotation:(i%2?1:-1)*.16,seed:300+i,title:'127',body:'記録 / 照合'});c.restore()}
 for(let i=0;i<3;i++){
  const x=250+i*370-age*(35+i*3),y=300+(i%2)*130+Math.sin(age*.9+i)*26;
  H.vprop(c,t,E,'paper',[x,y,320,440],{rotation:(i-1)*.10+Math.sin(age*.5+i)*.025,seed:310+i,title:'証拠 '+String(i+1).padStart(2,'0'),body:['演示文字\n文字演示文','目撃証言\n現場資料','調査中\nCASE 127'][i]});
 }
 fitText(c,E,'証拠照合',780,245,80,1000,{alpha:.8});
 const flights=[[33.8,34.42,-.19],[35.16,35.82,.15]];let foreground=null;
 for(const[a,b,roll]of flights){if(t<a||t>b)continue;const u=range(t,a,b),x=mix(2400,-1500,H.inOut(u)),y=mix(760,100,u);c.save();c.filter='blur(2px)';H.vprop(c,t,E,'paper',[x,y,1000,1360],{rotation:roll+u*.17,seed:400,title:'極秘調査 / 127',body:'証拠 A\n通信記録\n現場資料\n照合中'});c.restore();foreground={x,y,width:1000,speed:3900/(b-a)};}
 H.mark('papers:three-distinct-depth-layers','papers:large-foreground-flyby','cabinet:slow-rear-parallax');
 H.info({cameraState:{subject:'three-layer-evidence-room',rear:{speed:11,opacity:.54,blur:1.2},middle:{count:3,speed:35},foreground,absoluteStart:33.07}});
}
function signal(c,t,E,p,H){
 const age=t-77.83,phase=Math.min(3,Math.floor(age/5.3)),dark=phase===1||phase===3,ink=dark?E.PAPER:E.INK,paper=dark?E.INK:E.PAPER;
 H.vstage(c,t,E,p,{dark,kind:'threads'});
 const number=127+Math.floor(Math.max(0,age-3)/4.2),erase=smooth(range(age,9.8,16.0)),bars=phase===0?1:phase===1?3:phase===2?2:0;
 c.save();c.translate(95+Math.sin(age*.27)*22,170);c.rotate(-.055+Math.sin(age*.19)*.018);c.fillStyle=paper;c.strokeStyle=ink;c.lineWidth=3;c.fillRect(0,0,550,720);c.strokeRect(0,0,550,720);E.text(c,'EVIDENCE / '+number,35,60,27,ink,{font:E.MONO});
 const rows=['通信記録 / SIGNAL LOG','対象：BONNIE','地点：五反田 / TOKYO','照合番号：'+number,'未接続 / 調査継続'];rows.forEach((s,i)=>{E.text(c,s,35,155+i*96,25,ink,{font:i?E.JP:E.MONO});H.line(c,E,35,175+i*96,510,175+i*96,ink,1)});
 for(let i=0;i<3;i++){const w=(205+i*57)*smooth(range(erase,i*.18,.5+i*.18));c.fillStyle=ink;c.fillRect(190,226+i*96,w,24)}c.restore();
 const phoneX=1400+Math.sin(age*.31)*16;
 const contentRenderer=(q,tt,z)=>{q.fillStyle=paper;q.fillRect(0,0,z.w,z.h);E.text(q,'127 / '+number,15,28,14,ink,{font:E.MONO});for(let i=0;i<4;i++){q.fillStyle=i<bars?ink:(dark?'#444':'#CCC');q.fillRect(16+i*13,56-i*8,8,12+i*8)}E.text(q,phase===3?'CONNECTION LOST':phase===2?'SEARCHING':'NO SIGNAL',z.w/2,115,14,ink,{font:E.MONO,align:'center'});E.text(q,phase===1?'× × ×':'— — —',z.w/2,155,26,ink,{font:E.MONO,align:'center'});};
 H.vprop(c,t,E,'flip-phone',[phoneX,180,490,800],{ink,paper,screenMode:'signal',contentRenderer,rotation:.065+Math.sin(age*.2)*.018});
 const cue=E.cueAt(t),phrase=cue?.text??'',groups=phrase.replace(/^※/,'').split(/(現在)/).filter(Boolean),main=groups.length>1?[groups[0],groups.slice(1).join('')]:[phrase];
 fullRows(c,t,E,H,main,{x:1015,y:460,size:95,width:760,gap:150,start:77.83,reveal:.35,color:ink});
 E.text(c,'演 文字演示文字演示文字演示',1005,810,23,ink,{font:E.JP,align:'center',alpha:.45});
 c.save();c.globalAlpha=.24;c.strokeStyle=ink;c.lineWidth=2;const speed=phase===1?3.4:1.1,gap=phase===2?2:phase===3?1:5;
 for(let i=0;i<13;i++){if((i+phase)%gap===0)continue;const xx=685+i*48,yy=866+Math.sin(age*speed+i*.75)*(phase===1?18:5);c.beginPath();c.moveTo(xx,yy);c.lineTo(xx+32,866+Math.sin(age*speed+(i+.7)*.75)*(phase===1?18:5));c.stroke()}c.restore();
 H.mark('phone:corrected-currently-unavailable','phone:display-without-parentheses','transition:black-white-file-phone','motion:continuous-signal-passage','phone:staged-signal-number-redaction');
 H.info({revisionState:{phonePassage:{dark,progress:range(t,77.83,99.41),phase,bars,number,redaction:erase,documents:true,phone:true,quiet:true}},cameraState:{subject:'staged-quiet-phone-and-evidence',phase,number,bars,redaction:erase}});
}
function pixel(c,t,E,p,H){
 H.vstage(c,t,E,p,{kind:'plain'});const age=t-p.start,vanish=[960,465],pulse=Math.exp(-Math.pow(((age*3.7)%1)/.13,2))*.022;
 c.save();c.strokeStyle=E.INK;c.lineWidth=1.5;
 for(let side of[-1,1])for(let i=0;i<9;i++){
  const depth=(i+age*.65)%9,k=Math.pow(.71,depth),x=vanish[0]+side*1280*k,y=vanish[1]-360*k,w=220*k,h=610*k;
  c.globalAlpha=.08+.34*k;c.strokeRect(x-(side>0?0:w),y,w,h);for(let j=1;j<4;j++){c.beginPath();c.moveTo(x-(side>0?0:w),y+h*j/4);c.lineTo(x+(side>0?w:0),y+h*j/4);c.stroke()}
 }
 c.globalAlpha=.17;for(const x of[-100,320,1600,2020]){c.beginPath();c.moveTo(...vanish);c.lineTo(x,970);c.stroke()}c.restore();
 for(const side of[-1,1])for(let i=0;i<7;i++){const z=(i+age*.75)%7,k=Math.pow(.68,z),x=960+side*1040*k,y=500+300*k;fitText(c,E,'証拠 / CASE 127',x,y,70*k,520*k,{alpha:.04+.14*k});}
 const specs=[{id:'PIXEL_CHARACTER_02',x:725,y:720,s:.92,bottom:.85},{id:'PIXEL_CHARACTER_01',x:1160,y:655,s:.76,bottom:.915}],states=[];
 c.save();c.imageSmoothingEnabled=false;
 specs.forEach((a,i)=>{const phase=Math.floor(age*8+i*.5)%2,hop=Math.abs(Math.sin(age*Math.PI*4+i*.9))*24,sc=a.s*(1+pulse),w=310*sc,h=310*sc,ground=a.y;
  c.save();c.fillStyle=E.INK;c.globalAlpha=.24;c.beginPath();c.ellipse(a.x,ground+13,100*sc*(1-hop/120),10*sc,0,0,TAU);c.fill();c.restore();
  for(const side of[-1,1]){const footx=a.x+side*24*sc+(phase?1:-1)*side*12,yy=ground+(phase===(side>0?1:0)?-7:2);c.fillStyle=E.INK;c.fillRect(Math.round(footx-7),Math.round(yy-hop*.35),20*sc,12*sc)}
  E.art(c,a.id,[a.x-w/2,ground-hop-h*a.bottom,w,h],{mode:'image'});H.mark('asset:'+a.id);states.push({asset:a.id,phase,hop,ground,depth:sc});
 });c.restore();
 H.mark('pixel-walk','pixel-walk:step','prop:pixel-walk','pixel:archive-corridor-perspective','pixel:staggered-depth-contact-shadows');
 H.info({cameraState:{subject:'pixel-archive-corridor',vanishingPoint:vanish,actors:states,beatScale:1+pulse,sceneEnd:p.end},revisionState:{pixelDepth:{actors:states,rails:true,shadows:true}}});
}
export function renderSpatialV11(c,t,E,p,H){
 if(p.mode==='windows'){windows(c,t,E,p,H);return true}
 if(p.mode==='face-collapse'){collapse(c,t,E,p,H);return true}
 if(p.mode==='macaron'&&((t>=29.83&&t<33.07)||(t>=116.56&&t<119.69))){macaron(c,t,E,p,H);return true}
 if(p.mode==='cabinet'){layeredCabinet(c,t,E,p,H);return true}
 if(t>=77.83&&t<99.41){signal(c,t,E,p,H);return true}
 if(p.mode==='pixel'){pixel(c,t,E,p,H);return true}
 return false;
}
