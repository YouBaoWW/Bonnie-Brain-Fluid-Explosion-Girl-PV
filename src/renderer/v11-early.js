/* V06 opening and first verse. Every transform is evaluated from song time;
 * no accumulated animation state is retained between arbitrary seeks. */
const TAU=Math.PI*2;
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const lerp=(a,b,u)=>a+(b-a)*u;
const unit=(t,a,b)=>clamp((t-a)/Math.max(.001,b-a));
const smooth=u=>{u=clamp(u);return u*u*(3-2*u)};

function arcOnly(c,t,E,p,H){
 const cue=E.cueAt(t);if(!cue)return;
 const all=H.chars(cue.text),cx=960,cy=725,rx=780,ry=375,points=[];let length=0,last=null;
 for(let i=0;i<=320;i++){const a=lerp(-Math.PI+.19,-.19,i/320),pt=[Math.cos(a)*rx,Math.sin(a)*ry];if(last)length+=Math.hypot(pt[0]-last[0],pt[1]-last[1]);points.push({a,length});last=pt}
 const size=Math.min(100,length*.79/Math.max(1,all.length));
 all.forEach((ch,i)=>{const target=length*(i+.5)/all.length;let j=1;while(j<points.length-1&&points[j].length<target)j++;const a=lerp(points[j-1].a,points[j].a,(target-points[j-1].length)/Math.max(.001,points[j].length-points[j-1].length)),e=H.glyphEnvelope(cue,t,i,all.length);c.save();c.translate(cx+Math.cos(a)*rx,cy+Math.sin(a)*ry);c.rotate(Math.atan2(ry*Math.cos(a),-rx*Math.sin(a)));c.globalAlpha=e.alpha;c.filter=(e.blur??0)>.05?`blur(${e.blur}px)`:'none';c.font=`700 ${size}px ${E.JP}`;c.textAlign='center';c.textBaseline='middle';c.lineWidth=6;c.strokeStyle=E.PAPER;c.fillStyle=E.INK;c.strokeText(ch,0,0);c.fillText(ch,0,0);c.restore()});
 H.mark('typography:semicircle-tangent-spaced');
}
export {arcOnly as drawArcLyricV06};

export function drawTriplePropsV06(c,t,E,p,H,{start=p.start,end=p.end,lyric=true}={}){
 // Three real specimens per group, turning slowly as complete objects.
 const age=t-start;
 for(const [id,cx,cy,w,h,phase] of [['HARAKIRI_KNIFE',250,765,395,285,.7],['HARAKIRI_RELIC',1680,765,450,310,2.2]]){
  c.save();c.translate(cx,cy);c.rotate(Math.sin(age*.75+phase)*.055);
  for(let i=0;i<3;i++){const d=i-1;E.art(c,id,[-w/2+d*50,-h/2-d*70,w,h],{mode:'print',rotate:d*.055+Math.sin(age*.65+phase+i*.35)*.035});}c.restore();H.mark('asset:'+id);
 }
 c.save();c.translate(960,750);c.rotate(Math.sin(age*.63-.8)*.065);
 if(E.hasAsset('MACARON_TRIPLE_V06')){E.art(c,'MACARON_TRIPLE_V06',[-330,-230,660,440],{mode:'ink'});H.mark('asset:MACARON_TRIPLE_V06','macaron:pure-black-triple');}
 c.restore();
 if(lyric)arcOnly(c,t,E,p,H);
 H.mark('props:triple-macaron-knife-scope','motion:triple-props-subtle-rotation');
 H.info({revisionState:{tripleGroups:{counts:{macaron:3,knife:3,scope:3},start,end,rotationRadians:.09}}});
}

function paperTexture(E,H,index){
 const key='v06-flight-paper-'+index;let s=H.cache.get(key);if(s)return s;
 s=document.createElement('canvas');s.width=280;s.height=195;const q=s.getContext('2d');q.fillStyle=E.PAPER;q.fillRect(1,1,278,193);q.strokeStyle=E.INK;q.lineWidth=3;q.strokeRect(2,2,276,191);E.text(q,'CASE 127 / '+String(index+1).padStart(2,'0'),20,30,14,E.INK,{font:E.MONO});q.lineWidth=1.2;
 for(let j=0;j<6;j++){q.beginPath();q.moveTo(20,52+j*21);q.lineTo(250-(j===5?65:0),52+j*21);q.stroke()}
 q.lineWidth=3;q.strokeRect(205,15,48,25);H.cache.set(key,s);return s;
}

export function drawCabinetV06(c,t,E,p,H,{scatter=true,paperCount=48,box=[1320,150,570,790],start=p.start,end=p.end}={}){
 const[x,y,w,h]=box,u=smooth(unit(t,start,start+1)),cw=w*.86,ch=h*.91;
 c.save();c.translate(x,y);c.strokeStyle=E.INK;c.fillStyle=E.PAPER;c.lineWidth=7;c.fillRect(0,35,cw,ch);c.strokeRect(0,35,cw,ch);
 c.beginPath();c.moveTo(0,35);c.lineTo(w*.1,0);c.lineTo(w,0);c.lineTo(cw,35);c.closePath();c.fill();c.stroke();c.fillStyle=E.INK;c.beginPath();c.moveTo(cw,35);c.lineTo(w,0);c.lineTo(w,ch);c.lineTo(cw,ch+35);c.closePath();c.fill();
 for(let i=3;i>=0;i--){const yy=49+i*(ch-30)/4,hh=(ch-50)/4,pull=(i===0?u:Math.max(0,u-i*.18))*(i===0?65:20),xx=-pull*.27;
  c.fillStyle=E.PAPER;c.lineWidth=5;c.fillRect(xx+14,yy+pull*.18,cw-28+pull*.45,hh-10);c.strokeRect(xx+14,yy+pull*.18,cw-28+pull*.45,hh-10);
  c.lineWidth=2;c.strokeRect(cw*.33+xx,yy+27+pull*.18,cw*.3,42);c.fillStyle=E.INK;c.fillRect(cw*.39+xx,yy+hh*.69+pull*.18,cw*.19,9);E.text(c,String(i+1).padStart(2,'0'),30+xx,yy+hh*.86+pull*.18,19,E.INK,{font:E.MONO});
 }
 c.restore();H.mark('prop:cabinet','cabinet:right-position');
 const papers=[];
 if(scatter)for(let i=0;i<paperCount;i++){
  const delay=i*.011,age=t-start-delay;if(age<0)continue;
  const r=H.hash(i*17+609),r2=H.hash(i*17+610),r3=H.hash(i*17+611),spread=smooth(unit(age,0,.72+r*.5));
  const targetX=-70+r*1780,targetY=130+r2*790,drift=Math.max(0,age-.7),px=lerp(x+cw*.52,targetX,spread)-drift*(38+r3*65)+Math.sin(age*1.6+i)*22*spread,py=lerp(y+75,targetY,spread)+Math.sin(age*1.5+i*.8)*30*spread+drift*(4+r2*15),angle=(r-.5)*.5+age*((r2-.5)*1.5),turn=(age*(1.6+r*2.3)+i*.74),flip=Math.max(.035,Math.abs(Math.cos(turn))),pitch=.78+.22*Math.cos(age*1.9+i),scale=.38+r3*.65;
  const texture=paperTexture(E,H,i%6),flightBlur=paperCount<48?5.5*Math.sin(Math.PI*unit(age,0,.72+r*.5))**2:0;c.save();c.translate(px,py);c.rotate(angle);c.filter=flightBlur>.05?`blur(${flightBlur}px)`:'none';c.scale(scale*flip,scale*pitch);if(Math.cos(turn)<0){c.fillStyle='#DADAD7';c.strokeStyle=E.INK;c.lineWidth=3;c.fillRect(-140,-97.5,280,195);c.strokeRect(-140,-97.5,280,195)}else c.drawImage(texture,-140,-97.5);c.restore();papers.push({index:i,x:px,y:py,rotation:angle,flip,back:Math.cos(turn)<0,depth:scale,blurPx:flightBlur});
 }
 if(scatter){H.mark('cabinet:papers',`papers:${paperCount}-sakura-scatter`,'motion:paper-front-back-orthographic-flips','motion:papers-whole-screen');H.info({cameraState:{subject:'right-cabinet-paper-scatter',paperCount:papers.length,papers},revisionState:{cabinetFlight:{start,end,plannedCount:paperCount,visibleCount:papers.length,frontBackFlip:true,motionBlur:paperCount<48,foregroundLyricDrawnAfterFiles:true}}})}
 return papers;
}

function titleScene(c,t,E,p,H){
 H.vstage(c,t,E,p,{kind:'threads'});
 const age=t-6.65,moving=unit(t,6.65,7.05),phase=age*1.15;
 if(moving>0){c.save();c.globalAlpha=.13*moving;c.strokeStyle=E.INK;c.lineWidth=2;for(let i=0;i<6;i++){const yy=150+i*140;c.beginPath();c.moveTo(-50,yy+Math.sin(phase+i)*45);c.bezierCurveTo(470,yy-150+Math.cos(phase+i)*65,1390,yy+120+Math.sin(phase*.8+i)*65,1980,yy-35);c.stroke()}c.restore()}
 const cards=[[-50,160,510,565,-.17],[1410,135,490,560,.12],[170,560,440,425,.13],[1380,585,460,435,-.08]];
 for(let i=0;i<cards.length;i++){const[x,y,w,h,r]=cards[i],a=2.2+i*.32,k=H.out(unit(t,a,a+.82));if(t<a)continue;const xx=x+(i%2?1:-1)*(1-k)*2200+Math.sin(phase+i*1.3)*32*moving,yy=y+(i<2?-1:1)*(1-k)*900+Math.sin(phase*.8+i*.7)*23*moving;H.vprop(c,t,E,'paper',[xx,yy,w,h],{rotation:r+(1-k)*(i%2?-.7:.7)+Math.sin(phase*.6+i)*.035*moving,seed:50+i,title:'調査記録',body:'演示文字127\n示文字演示文字演\n字演示文字演示文'});}
 const city=H.out(unit(t,3.6,4.35));if(city>0&&E.hasAsset('CITY_TOKYO')){E.art(c,'CITY_TOKYO',[-40+Math.sin(phase*.65)*20*moving,330+(1-city)*900+Math.sin(phase*.9)*14*moving,2000,720],{mode:'posterInk',crop:[0,0,1,.72]});H.mark('asset:CITY_TOKYO')}
 const optic=H.out(unit(t,3.7,4.4));if(optic>0){E.art(c,'HARAKIRI_RELIC',[1330+(1-optic)*1700+Math.sin(phase*.9)*35*moving,640+Math.sin(phase)*18*moving,510,330],{mode:'print',rotate:(1-optic)*.9-.08+Math.sin(phase*.8)*.13*moving});H.mark('asset:HARAKIRI_RELIC')}
 // The opaque inner plate is only the countdown carrier. It leaves before
 // the title, so neither text nor a leftover white rectangle hides the city.
 if(t>=4.45&&t<6.65){const phase=(t-4.45)/(2.2/3),n=3-Math.min(2,Math.floor(phase)),f=phase%1;c.save();c.translate(960,500);c.fillStyle=E.PAPER;c.strokeStyle=E.INK;c.lineWidth=5;c.beginPath();c.arc(0,0,190,0,TAU);c.fill();c.globalAlpha=.22;c.stroke();c.globalAlpha=1;c.beginPath();c.arc(0,0,190,-Math.PI/2,-Math.PI/2+TAU*(1-f));c.stroke();E.text(c,String(n),0,68,190,E.INK,{font:E.MONO,weight:400,align:'center'});c.restore();H.mark('intro:circle-countdown-'+n);}
 if(t>=6.65){const reveal=H.out(unit(t,6.65,7.05)),exit=1-H.out(unit(t,10.43,10.69));c.save();c.globalAlpha=reveal*exit;c.translate(960,485);c.rotate((1-reveal)*-.08);const text='演示文字演示文',g=H.chars(text);c.font=`700 155px ${E.JP}`;const textW=c.measureText(text).width,scale=Math.min(1,1590/textW);c.scale(scale,scale);E.text(c,text,0,0,155,E.INK,{font:E.JP,align:'center'});E.text(c,'N O U S H O U  S A K U R E T S U  G I R L',0,65,28,E.INK,{font:E.MONO,align:'center',weight:400});c.restore();H.mark('intro:title-after-countdown');}
 H.mark('intro:sequential-offscreen-background-entry','intro:unobscured-layered-background');if(moving>0)H.mark('intro:continuous-title-background-motion');H.info({cameraState:{subject:'intro-background-cards-countdown-title',backgroundEntryComplete:4.4,countdown:[4.45,6.65],titleStart:6.65,backgroundMotion:{phase,moving,cardAmplitude:[32,23],cityAmplitude:[20,14],opticRotation:.13}}});
}

function drawSNS(c,t,E,H,{kind,x,y,size,rotation=0}){
 c.save();c.translate(x,y);c.rotate(rotation);c.fillStyle=E.INK;c.strokeStyle=E.INK;c.lineWidth=4;c.beginPath();c.roundRect(-size/2,-size/2,size,size,size*.13);c.fill();
 if(kind==='wechat'){
  c.fillStyle=E.PAPER;for(const[xx,yy,r]of[[-size*.08,-size*.05,size*.27],[size*.18,size*.18,size*.22]]){c.beginPath();c.ellipse(xx,yy,r,r*.77,0,0,TAU);c.fill();c.beginPath();c.moveTo(xx-r*.55,yy+r*.48);c.lineTo(xx-r*.68,yy+r*.85);c.lineTo(xx-r*.15,yy+r*.62);c.fill();c.fillStyle=E.INK;for(const d of[-.3,.3]){c.beginPath();c.arc(xx+r*d,yy-r*.14,size*.025,0,TAU);c.fill()}c.fillStyle=E.PAPER;}
 }else if(kind==='telegram'){c.fillStyle=E.PAPER;c.beginPath();c.moveTo(-size*.36,-size*.03);c.lineTo(size*.36,-size*.31);c.lineTo(size*.22,size*.34);c.lineTo(-size*.04,size*.10);c.lineTo(-size*.14,size*.28);c.lineTo(-size*.17,size*.04);c.closePath();c.fill();c.strokeStyle=E.INK;c.lineWidth=size*.018;c.beginPath();c.moveTo(-size*.17,size*.04);c.lineTo(size*.23,-size*.23);c.stroke();}
 else if(kind==='qq'){
  // White edge separates the penguin's black head/flippers from its black tile.
  const oval=(x,y,rx,ry,angle=0)=>{c.beginPath();c.ellipse(x*size,y*size,rx*size,ry*size,angle,0,TAU);c.fill()};
  c.fillStyle=E.PAPER;oval(0,-.17,.20,.22);oval(0,.10,.24,.29);for(const side of[-1,1]){oval(side*.23,.07,.065,.20,-side*.35);oval(side*.13,.36,.14,.052,-side*.10)}
  c.fillStyle=E.INK;oval(0,-.17,.18,.20);oval(0,.10,.218,.27);c.fillStyle=E.PAPER;oval(0,.15,.145,.19);
  for(const side of[-1,1]){oval(side*.064,-.20,.060,.075);c.fillStyle=E.INK;oval(side*.056,-.195,.020,.031);c.fillStyle=E.PAPER}oval(0,-.09,.12,.035);
  c.fillRect(-size*.17,-size*.035,size*.34,size*.035);c.beginPath();c.moveTo(size*.11,0);c.lineTo(size*.22,size*.11);c.lineTo(size*.14,size*.14);c.lineTo(size*.07,size*.01);c.closePath();c.fill();
 }
 else if(kind==='discord'){c.fillStyle=E.PAPER;c.beginPath();c.moveTo(-size*.31,-size*.18);c.quadraticCurveTo(-size*.18,-size*.29,-size*.10,-size*.22);c.quadraticCurveTo(0,-size*.27,size*.10,-size*.22);c.quadraticCurveTo(size*.18,-size*.29,size*.31,-size*.18);c.lineTo(size*.40,size*.20);c.quadraticCurveTo(size*.28,size*.32,size*.14,size*.26);c.lineTo(size*.10,size*.19);c.quadraticCurveTo(0,size*.23,-size*.10,size*.19);c.lineTo(-size*.14,size*.26);c.quadraticCurveTo(-size*.28,size*.32,-size*.40,size*.20);c.closePath();c.fill();c.fillStyle=E.INK;for(const xx of[-.13,.13]){c.beginPath();c.ellipse(size*xx,size*.015,size*.047,size*.064,0,0,TAU);c.fill();}}
 else if(kind==='line'){c.fillStyle=E.PAPER;c.beginPath();c.ellipse(0,-size*.035,size*.36,size*.27,0,0,TAU);c.fill();c.beginPath();c.moveTo(size*.04,size*.17);c.lineTo(-size*.015,size*.35);c.lineTo(size*.25,size*.17);c.closePath();c.fill();E.text(c,'LINE',0,size*.025,size*.13,E.INK,{font:E.MONO,weight:700,align:'center'});}
 else if(kind==='file'){c.fillStyle=E.PAPER;c.fillRect(-size*.25,-size*.33,size*.5,size*.66);c.strokeStyle=E.INK;c.lineWidth=3;for(let i=0;i<4;i++){c.beginPath();c.moveTo(-size*.17,-size*.16+i*size*.12);c.lineTo(size*.17,-size*.16+i*size*.12);c.stroke()}}
 else if(kind==='lens'){c.strokeStyle=E.PAPER;c.lineWidth=size*.055;c.beginPath();c.arc(-size*.05,-size*.06,size*.23,0,TAU);c.stroke();c.beginPath();c.moveTo(size*.12,size*.12);c.lineTo(size*.34,size*.34);c.stroke()}
 else{c.strokeStyle=E.PAPER;c.lineWidth=size*.07;c.strokeRect(-size*.2,-size*.34,size*.4,size*.68);}
 c.restore();
}

function investigationSNS(c,t,E,p,H){
 H.vstage(c,t,E,p,{kind:'archive'});
 // One physical arrow and one icon rail exist for the whole shot. The camera
 // follows its extending tip before the lyric cue changes, rather than cutting
 // from a portrait to a separately positioned row at 23.65 seconds.
 const follow=smooth(unit(t,23.20,24.85)),cameraX=4300*follow,cameraY=200*smooth(unit(t,23.30,23.85)),grow=H.out(unit(t,22.15,22.92));
 const arrowStart=620,arrowY=245,tipWorld=lerp(620,1740,grow)+cameraX-640*follow,width=lerp(8,12,follow),headLength=34,headHalf=15,shaftEnd=tipWorld-headLength*.68;
 const icons=['file','lens','phone','qq','wechat','telegram','discord','line'],visibleIcons=[],iconStates=[];
 c.save();c.translate(-cameraX,cameraY);
 if(-270+1100-cameraX>0){H.character(c,t,E,'BONNIE_FULL_A13',[-270,70,1100,1650],{silhouette:true,keepTie:true});H.mark('character:forehead-black-pink');}
 // The shaft stops inside the triangular head. A butt cap cannot stick out
 // beyond the intended tip, including when the scene is viewed very closely.
 if(tipWorld>arrowStart+headLength){c.save();c.strokeStyle=E.INK;c.fillStyle=E.INK;c.lineWidth=width;c.lineCap='butt';c.beginPath();c.moveTo(arrowStart,arrowY);c.lineTo(shaftEnd,arrowY);c.stroke();c.beginPath();c.moveTo(tipWorld,arrowY);c.lineTo(tipWorld-headLength,arrowY-headHalf);c.lineTo(tipWorld-headLength,arrowY+headHalf);c.closePath();c.fill();c.restore();}
 for(let i=0;i<icons.length;i++){
  const worldX=2300+i*460,worldY=500+Math.sin(i*.8)*12,size=i<3?310:345,x=worldX-cameraX,y=worldY+cameraY,visible=x+size/2>=0&&x-size/2<=1920;
  iconStates.push({kind:icons[i],worldX,x,y,size,visible,fullyVisible:x-size/2>=0&&x+size/2<=1920});if(!visible)continue;
  drawSNS(c,t,E,H,{kind:icons[i],x:worldX,y:worldY,size,rotation:(i-3)*.025});visibleIcons.push(icons[i]);const names={wechat:'WeChat',telegram:'Telegram',qq:'QQ',discord:'Discord',line:'LINE'};H.mark('icon:'+icons[i]);if(names[icons[i]])H.mark('icon:'+names[icons[i]]);
 }
 c.restore();
 const cue=E.cueAt(t);
 if(t<23.65){c.save();c.globalAlpha=1-smooth(unit(t,23.53,23.65));H.vtype(c,t,E,p,{key:'sns-forehead-phrase',x:1090-cameraX*.18,y:500+cameraY*.10,w:1240,h:650,maxSize:215});c.restore();}
 else{
  const fixed=cue??E.cues?.find(row=>row.start_seconds===23.65)??{id:'cue_010-transition',text:'演示文字演示文字演示文字',start_seconds:23.65,end_seconds:25.17},split=fixed.text.indexOf('情'),phrases=split>0?[fixed.text.slice(0,split),fixed.text.slice(split)]:[fixed.text,''];
  for(let i=0;i<phrases.length;i++){if(!phrases[i])continue;const start=23.65+i*.25,alpha=smooth(unit(t,start,start+.16)),F={...E,cueAt:()=>({...fixed,text:phrases[i],start_seconds:start,end_seconds:25.17})};H.vtype(c,t,F,p,{key:'sns-arrow-'+i,x:1480,y:i?350:230,w:1400,h:190,maxSize:104,alpha,halo:false,ghost:false,carrierLocked:true,arrangement:'line'});}
 }
 H.mark('transition:event-icons-to-sns','icons:unique-no-repetition','arrow:v11-clean-tip-no-shaft-overrun','camera:v11-forehead-to-icons-continuous','icons:v11-qq-fills-phone-wechat-gap','layout:sns-words-above-arrow-above-icons');
 H.info({cameraState:{subject:'continuous-forehead-arrow-sns',cameraX,cameraY,follow,start:22.15,end:25.17},revisionState:{snsPhase:t<23.65?'forehead-arrow':t<24.55?'icon-chain':'arrow-lyrics',snsIcons:visibleIcons,snsIconsUnique:new Set(visibleIcons).size===visibleIcons.length,snsLayout:{textCenters:[230,350],arrowY:arrowY+cameraY,iconCenterY:500+cameraY},snsContinuous:{shot:'forehead-to-sns-single-pan',start:22.15,end:25.17,cameraX,cameraY,worldTip:tipWorld,screenTip:tipWorld-cameraX,shaftEnd,headLength,shaftStopsBeforeTip:shaftEnd<tipWorld,iconSpacing:460,iconOrder:icons,icons:iconStates,qqBetween:['phone','wechat'],cueId:cue?.id??null,fullPhrase:cue?.text??'',continuousAcrossCueBoundary:23.65}}});
}

function defrag(c,t,E,p,H){
 H.vstage(c,t,E,p,{kind:'plain'});const a=t-27.52;
 c.save();c.globalAlpha=.22;c.translate(1200,535);c.rotate(-.08+Math.sin(a*1.3)*.025);H.vprop(c,t,E,'software-dialog',[-1700,-1200,3300,2200],{count:7,progress:1,text:'',title:'× / MEMORY'});c.restore();
 c.save();c.globalAlpha=.15;E.art(c,'SWIMSUIT_V05',[-130,210,1000,1100],{mode:'ink',rotate:-.42});c.restore();H.mark('asset:SWIMSUIT_V05','background:enlarged-defrag-window-icons');
 H.vprop(c,t,E,'software-dialog',[260,115,1400,850],{text:E.cueAt(t)?.text??'',count:Math.min(5,1+Math.floor(unit(t,27.52,28.32)*5)),progress:unit(t,27.52,28.32)});
}

function faceCamera(c,t,E,p,H){
 H.vstage(c,t,E,p,{kind:'plain'});const u=unit(t,28.32,29.83),cue=E.cueAt(t),words=(cue?.text??'').split(/\s+/),[plane,q]=E.scratch('v06-face-floor',1500,2800);
 q.fillStyle=E.PAPER;q.fillRect(0,0,1500,2800);
 for(let i=0;i<12;i++){const yy=80+i*235,side=i%2?1170:270;q.strokeStyle=E.INK;q.lineWidth=5;q.beginPath();q.ellipse(side,yy,145,55,0,0,TAU);q.stroke();E.text(q,'!',side,yy+25,100,E.INK,{font:E.JP,align:'center'});}
 const cut=29.03;for(let i=0;i<2;i++){const text=words[i]??'',a=i?cut:28.32,b=i?29.83:cut;if(!text)continue;const g=H.chars(text);for(let j=0;j<g.length;j++){if(t<a+(b-a)*j/Math.max(1,g.length))continue;E.text(q,g[j],750,180+i*1380+j*230,240,E.INK,{font:E.JP,align:'center'});}}
 const y=lerp(0,1400,smooth(unit(t,28.78,29.4))),[view,v]=E.scratch('v06-face-view',1500,1100);v.drawImage(plane,0,y,1500,1100,0,0,1500,1100);
 H.projectPlane(c,view,H.cameraQuad({x:960,y:550,w:1920,h:1410,yaw:lerp(-.15,.13,u),pitch:lerp(-.78,-.28,u),roll:lerp(.025,-.04,u),z:lerp(350,-30,u)}));
 H.mark('camera:face-collapse-floor-travel','typography:camera-led-perspective','background:warning-symbol-depth');H.info({cameraState:{subject:'one-lyric-floor',y,pitch:lerp(-.78,-.28,u),sceneStart:28.32,sceneEnd:29.83}});
}

function portraitDown(c,t,E,p,H){
 H.vstage(c,t,E,p,{kind:'portrait-print'});const move=smooth(unit(t,38.65,39.95)),height=2140,y=lerp(110,-1050,move),x=lerp(-30,720,move);
 H.character(c,t,E,'BONNIE_FULL_A11',[x,y,1430,height],{silhouette:true,keepTie:true});
 H.contrastType(c,t,E,p,{x:lerp(1450,440,move),y:515,w:670,h:820,vertical:true,maxSize:190});
 H.mark('camera:portrait-upper-to-lower-body','character:portrait-black-pink');H.info({cameraState:{subject:'BONNIE_FULL_A11',move,characterY:y,start:37.58,end:40.64,focus:move>.65?'legs':'upper-body'}});
}

function magnifierChat(c,t,E,p,H){
 H.vstage(c,t,E,p,{kind:'circuit'});const id=E.hasAsset('BONNIE_MAG_V06')?'BONNIE_MAG_V06':'BONNIE_FULL_A10';H.character(c,t,E,id,id==='BONNIE_MAG_V06'?[0,80,1040,1560]:[-190,70,1160,1725],{silhouette:true,keepTie:true});
 // A held glass overlaps the face in the source pose. The white rim is an
 // intentional silhouette cut-line, so that prop remains readable in black.
 if(id==='BONNIE_FULL_A10'){const scale=1725/1536,lx=-190+(1160-1024*scale)/2+425*scale,ly=70+225*scale;
 c.save();c.strokeStyle=E.PAPER;c.lineWidth=4.5*scale;c.beginPath();c.ellipse(lx,ly,52*scale,54*scale,-.1,0,TAU);c.stroke();c.beginPath();c.moveTo(lx-40*scale,ly+40*scale);c.lineTo(lx-88*scale,ly+98*scale);c.stroke();c.restore();}
 H.phoneChat(c,t,E,p,{box:[940,30,950,1544]});H.mark('character:held-magnifier-black-pink');
}

function phoneDrop(c,t,E,p,H){
 H.vstage(c,t,E,p,{kind:'portrait-print'});const a=46.35,b=48.38,u=unit(t,a,b),fall=smooth(unit(t,46.83,48.20)),worldY=120+fall*2050,cameraY=fall*1810,screenY=worldY-cameraY;
 H.character(c,t,E,'BONNIE_PHONE_V06',[-920,-100-cameraY*.70,1600,2400],{silhouette:true,keepTie:true});
 const[phone,q]=E.scratch('v06-falling-phone-material',640,1040),contentRenderer=(r,tt,z)=>{r.fillStyle=E.PAPER;r.fillRect(0,0,z.w,z.h);E.text(r,'演示文 / LOST',z.w/2,31,16,E.INK,{font:E.MONO,align:'center'});const cue=E.cueAt(t);if(cue)H.typewriterText(r,t,E,{text:cue.text,box:[16,54,z.w-32,z.h-75],start:cue.start_seconds,end:cue.end_seconds,size:45,align:'center'});};
 H.vprop(q,t,E,'flip-phone',[0,0,640,1040],{screenMode:'chat',contentRenderer});const[body,r]=E.scratch('v06-falling-phone-body',370,965);r.drawImage(phone,135,60,370,965,0,0,370,965);
 const roll=lerp(-.36,.50,fall),px=lerp(1180,1220,fall),py=screenY+485;H.projectPlane(c,body,H.cameraQuad({x:px,y:py,w:660,h:1721,roll,yaw:Math.sin(u*2.7)*.19,z:0}));
 H.mark('motion:phone-fall-camera-follow','carrier:phone-screen-lyrics','typography:phone-and-words-one-plane','character:partial-black-pink');H.info({cameraState:{subject:'falling-phone',worldY,cameraY,screenY,roll,start:a,end:b}});
}

function nerves(c,t,E,p,H){
 H.vstage(c,t,E,p,{kind:'portrait-print'});H.character(c,t,E,'BONNIE_PHONE_V06',[1010,-70,1080,1690],{silhouette:true,keepTie:true});
 const cue=E.cueAt(t),text=(cue?.text??'').replace(/[()（）]/g,'').replace(/^※/,'');
 E.text(c,'※ SYSTEM NOTICE',150,265,33,E.INK,{font:E.MONO,weight:400});H.line(c,E,150,300,920,300,E.INK,3);
 H.typewriterText(c,t,E,{text,box:[155,360,770,405],start:cue?.start_seconds??48.38,end:cue?.end_seconds??49.62,size:104,align:'left'});
 H.line(c,E,150,810,920,810,E.INK,2);H.mark('character:held-phone-black-pink','typography:aside-elegant-bracket-free');
}

export function renderEarlyV11(c,t,E,p,H){
 if(t<0||t>=62.44)return false;
 if(p.mode==='intro-title'){titleScene(c,t,E,p,H);return true;}
 if(p.mode==='head-investigation'){investigationSNS(c,t,E,p,H);return true;}
 if(p.mode==='windows'){defrag(c,t,E,p,H);return true;}
 if(p.mode==='face-collapse'){faceCamera(c,t,E,p,H);return true;}
 if(p.mode==='macaron'){H.vstage(c,t,E,p,{kind:'musical'});drawTriplePropsV06(c,t,E,p,H);return true;}
 if(p.mode==='cabinet'){H.vstage(c,t,E,p,{kind:'cabinet-room'});drawCabinetV06(c,t,E,p,H);return true;}
 if(p.mode==='portrait-vertical'){portraitDown(c,t,E,p,H);return true;}
 if(p.mode==='portrait-chat'){magnifierChat(c,t,E,p,H);return true;}
 if(p.mode==='phone-drop'){phoneDrop(c,t,E,p,H);return true;}
 if(p.mode==='nerves'){nerves(c,t,E,p,H);return true;}
 return false;
}
