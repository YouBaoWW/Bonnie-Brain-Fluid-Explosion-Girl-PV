/* V11 figures 1/2. One rectangular optical lap and faster year-shot release.
 * The movie clock is the only state: seeking to a frame redraws it exactly.
 * Existing yearAt/drawYear and the V08 facial inserts remain authoritative. */
const sat=x=>Math.max(0,Math.min(1,x));
const mix=(a,b,u)=>a+(b-a)*u;
const unit=(t,a,b)=>sat((t-a)/Math.max(.001,b-a));
const smooth=x=>{x=sat(x);return x*x*(3-2*x)};

function rectangularPoint(u,[x,y,w,h]){
 const perimeter=2*(w+h),d=((u%1+1)%1)*perimeter;
 if(d<w)return[x+d,y];
 if(d<w+h)return[x+w,y+d-w];
 if(d<2*w+h)return[x+w-(d-w-h),y+h];
 return[x,y+h-(d-2*w-h)];
}
function rectangularLap(c,t,E,H){
 const start=59.24,end=60.88,u=unit(t,start,end),boxes=[[170,158,1580,728],[145,138,1630,768],[192,180,1536,684]];
 c.save();c.lineJoin='miter';
 for(let n=0;n<boxes.length;n++){
  const box=boxes[n];c.strokeStyle=E.INK;c.lineWidth=n?1:2;c.globalAlpha=n?.09:.14;c.strokeRect(...box);
  // A single travelling contour follows four straight edges. The short tail
  // has fixed length; it never loops or re-enters when a profile changes.
  for(let i=0;i<44;i++){
   const a=u-.23+i*.23/44,b=u-.23+(i+1)*.23/44;
   const p=rectangularPoint(a,box),q=rectangularPoint(b,box);
   // Split corner crossings into short line pieces without diagonal shortcuts.
   const step=1/256;let last=p;c.beginPath();c.moveTo(...last);
   for(let z=a+step;z<b;z+=step){last=rectangularPoint(z,box);c.lineTo(...last)}c.lineTo(...q);
   c.lineWidth=n?1.5:4;c.globalAlpha=(n?.21:.66)*((i+1)/44)**1.5;c.stroke();
  }
 }
 const[x,y]=rectangularPoint(u,boxes[0]);c.globalAlpha=.9;c.fillStyle=E.INK;c.fillRect(x-5,y-5,10,10);c.restore();
 H.mark('orbit:v11-rectangular-single-lap','orbit:outside-profile-and-lyric');
 H.info({revisionState:{rectangularOrbit:{start,end,progress:u,laps:1,path:'rectangle',bounds:boxes[0],head:[x,y],absoluteTime:true,foregroundTextProtected:true}}});
}
function flowerProfiles(c,t,E,p,H){
 H.vstage(c,t,E,p,{kind:'plain'});rectangularLap(c,t,E,H);
 const first=t<59.99,id=first?'SIL03':'FANNY_PROFILE',role=first?'bonnie':'fanny';
 H.character(c,t,E,id,first?[-660,-130,1550,1550]:[1120,-160,1550,1550],{role,silhouette:true,keepTie:true});
 const cue=E.cueAt(t),raw=cue?.text??'',split=raw.indexOf('が')+1,part=first?raw.slice(0,split):raw.slice(split);
 const F={...E,cueAt:()=>cue?{...cue,text:part,start_seconds:first?59.24:59.99,end_seconds:first?59.99:60.88}:null};
 H.vtype(c,t,F,p,{key:'rectangular-orbit-phrase',x:first?1270:650,y:520,w:930,h:480,maxSize:210,carrierLocked:true,ghost:false});
 H.mark('lyric:v11-flower-complete-two-parts','character:retained-colored-tie');
}
function depthField(c,t,E,H,start){
 const u=unit(t,start+.28,start+1.25),amount=smooth(u),drift=(t-start)*12;
 // Only abstract records and small optical/phone props occupy the background.
 // There is no cropped or blurred character asset in this depth field.
 c.save();c.globalAlpha=.12*amount;H.vprop(c,t,E,'flip-phone',[830+drift*.2,650,220,360],{rotation:-.12+(t-start)*.025,screenText:'127'});c.restore();
 c.save();c.globalAlpha=.075*amount;H.vprop(c,t,E,'magnifier',[1170-drift*.3,710,235,235],{rotation:.24+(t-start)*.02,scan:false});c.restore();
 c.save();c.strokeStyle=E.INK;c.globalAlpha=.085*amount;c.lineWidth=1.5;
 const yy=820+(t-start)*4,nodes=[[390+drift*.3,yy],[660+drift*.15,yy],[730,yy-65],[1190-drift*.2,yy-65],[1370-drift*.3,yy+30]];
 c.beginPath();nodes.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();
 for(const[x,y]of nodes)E.circle(c,x,y,5,E.INK,1.5);
 for(let i=0;i<3;i++){E.rule(c,485,725+i*13,630+(i%2)*36,725+i*13,E.INK,1,1);E.rule(c,1230,905+i*11,1385-i*17,905+i*11,E.INK,1,1)}c.restore();
 H.mark('year:v11-abstract-evidence-depth','year:v11-small-phone-magnifier-depth','year:v11-no-background-person');H.info({revisionState:{yearDepthField:{backgroundPerson:false,personAssetCount:0,abstractLineOpacity:.085,phoneOpacity:.12,magnifierOpacity:.075,propBounds:[[830+drift*.2,650,220,360],[1170-drift*.3,710,235,235]],continuousDrift:true}}});
}
function years(c,t,E,p,H){
 const second=t>140,start=second?152.63:65.15,end=second?156.82:69.37,entry=second?155:67.55;
 H.vstage(c,t,E,p,{kind:'archive'});depthField(c,t,E,H,start);H.drawYear(c,t,E);
 if(t<start+.25){const leave=smooth((t-start)/.25);H.character(c,t,E,'BONNIE_FULL_A11',[-10,100-leave*1700,830,1360],{silhouette:true,keepTie:true,color:'white'});H.character(c,t,E,'FANNY_FULL_V05',[1130,105+leave*1700,830,1360],{role:'fanny',silhouette:true,keepTie:true,mirror:true});}
 const leftBox=[-490,0,1500,1950],rightBox=[880,-80,1510,1940],bridgeStart=second?156.17:68.38,bridge=unit(t,bridgeStart,end),push=smooth(bridge/.30),pull=smooth((bridge-.30)/.70),blend=(a,b,u)=>a.map((n,i)=>mix(n,b[i],u));
 let left=leftBox,right=rightBox;
 if(t>=bridgeStart){
  // Push across the close silhouette, then pull back into the next full-body
  // composition. No empty hold, next-line preview, or extra background person.
  left=blend(blend(leftBox,[-390,-125,1740,2200],push),second?[90,110,650,814]:[20,110,610,814],pull);
  right=second?blend(rightBox,[2320,-170,1510,1940],smooth(bridge/.5)):blend(blend(rightBox,[1020,-160,1660,2150],push),[1310,110,610,814],pull);
 }
 if(t>=entry){const v=smooth((t-entry)/.4);H.character(c,t,E,'BONNIE_PHONE_V06',[left[0]-(1-v)*700,left[1],left[2],left[3]],{silhouette:true,keepTie:true,rotation:mix(-.35,0,v)-Math.sin(bridge*Math.PI)*.085});}
 if(t>=entry+.32){const v=smooth((t-entry-.32)/.4);H.character(c,t,E,'FANNY_FULL_V05',[right[0]+(1-v)*800,right[1],right[2],right[3]],{role:'fanny',silhouette:true,keepTie:true,mirror:true,rotation:mix(.42,0,v)+Math.sin(bridge*Math.PI)*.07});}
 if(t>=bridgeStart){H.mark('year:v11-no-empty-reentry-hold','camera:v11-close-push-orbit-full-body-pullback');H.info({revisionState:{yearBridge:{round:second?2:1,start:bridgeStart,end,progress:bridge,model:'close-push-tilt-pullback-into-next-full-body-shot',bonnieBox:left,fannyBox:right,nextLyricNotPreviewed:true,backgroundPerson:false,blankHoldSeconds:0}}});}
 const cue=E.cueAt(t),first=Boolean(cue&&cue.start_seconds===start);
 // Keep full read holds, then withdraw in 120/170 ms. The second eye insert
 // ends at155.98 and retains its own full phrase before this quick release.
 const exitEnd=first?(cue?.end_seconds??start+1.37):(second?156.17:68.38),exitStart=exitEnd-(first?.12:.17),exit=smooth(unit(t,exitStart,exitEnd));
 const alpha=1-exit;
 if(alpha>.001)H.contrastType(c,t,E,p,{key:'v11-year-fast-release',x:960,y:(first?800:255)-exit*42,w:1570,h:320,maxSize:145,arrangement:'line',carrierLocked:true,ghost:false,alpha});
 H.mark('year:early-phone-bonnie-to-fanny','timing:continuous-character-entry','year:v11-larger-foreground-crops','lyric:v11-fast-year-exit');
 H.info({revisionState:{yearComposition:{round:second?2:1,start,end,entry,foregroundBoxes:[leftBox,rightBox],lowerDetailOpacity:.085,phoneDepthOpacity:.12,originalYearClockPreserved:true},yearPhraseExit:{cueId:cue?.id??null,phrase:cue?.text??'',start:exitStart,end:exitEnd,duration:first?.12:.17,progress:exit,alpha,complete:exit>=1,eyeInsertPreserved:second}}});
}
export function renderChorusFixesV11(c,t,E,p,H){
 if(t>=59.24&&t<60.88){flowerProfiles(c,t,E,p,H);return true}
 if((t>=65.15&&t<69.37)||(t>=152.63&&t<156.82)){years(c,t,E,p,H);return true}
 return false;
}
