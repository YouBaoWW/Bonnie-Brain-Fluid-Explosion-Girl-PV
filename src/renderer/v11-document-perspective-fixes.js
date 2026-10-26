/* V11-005/006. A redaction is ink on its paper texture, never a second
 * screen-space overlay. Chat uses one continuous, oblique physical sheet. */
const sat=x=>Math.max(0,Math.min(1,x)),mix=(a,b,u)=>a+(b-a)*u;
const smooth=x=>{x=sat(x);return x*x*(3-2*x)};
const range=(t,a,b)=>sat((t-a)/(b-a));
const SIGNAL=[77.83,99.41],CHAT=[127.37,130.45];
const MESSAGES=Object.freeze([
 {role:'bonnie',text:'演示文字演示文字演'},
 {role:'fanny',text:'演示文字演示文字演示'},
 {role:'bonnie',text:'演示文字演示文字演'},
 {role:'bonnie',text:'演示文字演示文字演示'},
 {role:'fanny',text:'演示文字演示文字'},
 {role:'bonnie',text:'演示文字演示文'},
 {role:'bonnie',text:'演示文字演'},
 {role:'fanny',text:'演示文字演示'},
 {role:'bonnie',text:'演示文字演示文'}
]);
const PEOPLE=Object.freeze({bonnie:{name:'ボニー',asset:'SIL03'},fanny:{name:'演示文字',asset:'FANNY_PROFILE'}});
export const DOCUMENT_PERSPECTIVE_V11_PLAN=Object.freeze({
 signal:SIGNAL,chat:CHAT,chatMessages:MESSAGES,chatPeople:PEOPLE,
 reference:'00_DOC/reference_pv/original_Ey_NHZNYTeE.mkv; sampled 127.37–130.12',
 redactionPadding:[8,6],redactionOnSameTexture:true
});
function fitText(c,E,s,x,y,size,width,{alpha=1,color=E.INK,align='center',font=E.JP}={}){
 c.save();c.font=`700 ${size}px ${font}`;size*=Math.min(1,width/Math.max(1,c.measureText(s).width));
 E.text(c,s,x,y,size,color,{font,align,alpha});c.restore();return size;
}
function line(c,E,H,a,b,x,y,ink,width=1){H.line(c,E,a,b,x,y,ink,width)}
function fullRows(c,t,E,H,rows,{color=E.INK}={}){
 const alpha=smooth(range(t,77.83,78.18));rows.forEach((s,i)=>fitText(c,E,s,1015,460+i*150,95,760,{alpha,color}));
 H.mark('typography:semantic-phrase-lines');
}
function measuredField(q,text,x,y,font,size){
 q.font=`700 ${size}px ${font}`;q.textAlign='left';q.textBaseline='alphabetic';const m=q.measureText(text);
 return{left:x-(m.actualBoundingBoxLeft??0),top:y-(m.actualBoundingBoxAscent??size),right:x+(m.actualBoundingBoxRight??m.width),bottom:y+(m.actualBoundingBoxDescent??size*.2)};
}
function redactionProof(q,box,target){
 const x=Math.floor(target.left),y=Math.floor(target.top),w=Math.max(1,Math.ceil(target.right)-x),h=Math.max(1,Math.ceil(target.bottom)-y),data=q.getImageData(x,y,w,h).data,expected=q.getImageData(box.left+1,box.top+1,1,1).data;
 let uncovered=0;for(let i=0;i<data.length;i+=4)if(data[i]!==expected[0]||data[i+1]!==expected[1]||data[i+2]!==expected[2]||data[i+3]!==255)uncovered++;
 return{targetPixels:w*h,uncoveredPixels:uncovered,allTargetPixelsCovered:uncovered===0,maskContainsMeasuredBounds:box.left<=target.left&&box.top<=target.top&&box.right>=target.right&&box.bottom>=target.bottom};
}
function signal(c,t,E,p,H){
 const age=t-SIGNAL[0],phase=Math.min(3,Math.floor(age/5.3)),dark=phase===1||phase===3,ink=dark?E.PAPER:E.INK,paper=dark?E.INK:E.PAPER;
 H.vstage(c,t,E,p,{dark,kind:'threads'});
 const number=127+Math.floor(Math.max(0,age-3)/4.2),erase=smooth(range(age,9.8,16)),bars=phase===0?1:phase===1?3:phase===2?2:0;
 const [sheet,q]=E.scratch('v11-signal-physical-document',550,720);q.fillStyle=paper;q.fillRect(0,0,550,720);q.strokeStyle=ink;q.lineWidth=3;q.strokeRect(1.5,1.5,547,717);
 E.text(q,'EVIDENCE / '+number,35,60,27,ink,{font:E.MONO});
 E.text(q,'通信記録 / SIGNAL LOG',35,155,25,ink,{font:E.MONO});line(q,E,H,35,175,510,175,ink);
 const fieldSpecs=[['対象：','BONNIE'],['地点：','五反田 / TOKYO'],['照合番号：',String(number)]],fields=[];
 fieldSpecs.forEach(([label,value],i)=>{
  const y=251+i*96,font=E.fontFor?.(77.83)??E.JP,size=25;q.font=`700 ${size}px ${font}`;const x=43+q.measureText(label).width;
  E.text(q,label,35,y,size,ink,{font});E.text(q,value,x,y,size,ink,{font});line(q,E,H,35,y+20,510,y+20,ink);
  const bounds=measuredField(q,value,x,y,font,size),mask={left:Math.floor(bounds.left)-8,top:Math.floor(bounds.top)-6,right:Math.ceil(bounds.right)+8,bottom:Math.ceil(bounds.bottom)+6},active=erase>i*.18;
  if(active){q.fillStyle=ink;q.fillRect(mask.left,mask.top,mask.right-mask.left,mask.bottom-mask.top)}
  fields.push({label,value,font,fontSize:size,textOrigin:[x,y],bounds,mask,active,proof:active?redactionProof(q,mask,bounds):null});
 });
 E.text(q,'未接続 / 調査継続',35,539,25,ink,{font:E.fontFor?.(77.83)??E.JP});line(q,E,H,35,559,510,559,ink);
 const x=95+Math.sin(age*.27)*22,y=170,roll=-.055+Math.sin(age*.19)*.018,cs=Math.cos(roll),sn=Math.sin(roll),rig={x:x+275*cs-360*sn,y:y+275*sn+360*cs,w:550,h:720,roll,yaw:0,pitch:0},quad=H.cameraQuad(rig);
 H.projectPlane(c,sheet,quad);
 const phoneX=1400+Math.sin(age*.31)*16,contentRenderer=(a,tt,z)=>{a.fillStyle=paper;a.fillRect(0,0,z.w,z.h);E.text(a,'127 / '+number,15,28,14,ink,{font:E.MONO});for(let i=0;i<4;i++){a.fillStyle=i<bars?ink:(dark?'#444':'#CCC');a.fillRect(16+i*13,56-i*8,8,12+i*8)}E.text(a,phase===3?'CONNECTION LOST':phase===2?'SEARCHING':'NO SIGNAL',z.w/2,115,14,ink,{font:E.MONO,align:'center'});E.text(a,phase===1?'× × ×':'— — —',z.w/2,155,26,ink,{font:E.MONO,align:'center'});};
 H.vprop(c,t,E,'flip-phone',[phoneX,180,490,800],{ink,paper,screenMode:'signal',contentRenderer,rotation:.065+Math.sin(age*.2)*.018});
 const cue=E.cueAt(t),phrase=cue?.text??'',groups=phrase.replace(/^※/,'').split(/(現在)/).filter(Boolean),main=groups.length>1?[groups[0],groups.slice(1).join('')]:[phrase];
 fullRows(c,t,E,H,main,{color:ink});E.text(c,'演 文字演示文字演示文字演示',1005,810,23,ink,{font:E.JP,align:'center',alpha:.45});
 c.save();c.globalAlpha=.24;c.strokeStyle=ink;c.lineWidth=2;const speed=phase===1?3.4:1.1,gap=phase===2?2:phase===3?1:5;
 for(let i=0;i<13;i++){if((i+phase)%gap===0)continue;const xx=685+i*48,yy=866+Math.sin(age*speed+i*.75)*(phase===1?18:5);c.beginPath();c.moveTo(xx,yy);c.lineTo(xx+32,866+Math.sin(age*speed+(i+.7)*.75)*(phase===1?18:5));c.stroke()}c.restore();
 H.mark('phone:corrected-currently-unavailable','phone:display-without-parentheses','transition:black-white-file-phone','motion:continuous-signal-passage','phone:staged-signal-number-redaction','document:v11-redaction-same-physical-texture','document:v11-measured-complete-field-masks');
 H.info({revisionState:{phonePassage:{dark,progress:range(t,...SIGNAL),phase,bars,number,redaction:erase,documents:true,phone:true,quiet:true},signalRedaction:{revision:'V11-005',sameTexturePlane:true,textureSize:[550,720],fields,quad,allActiveFieldsCovered:fields.filter(f=>f.active).every(f=>f.proof.allTargetPixelsCovered&&f.proof.maskContainsMeasuredBounds)}},cameraState:{subject:'staged-quiet-phone-and-evidence',phase,number,bars,redaction:erase,documentRig:rig,documentQuad:quad,maskProjection:'same physical document texture'}});
}
function projectedPoint(rig,u,v){
 const xx=(u-.5)*rig.w,yy=(v-.5)*rig.h,cy=Math.cos(rig.yaw),sy=Math.sin(rig.yaw),cp=Math.cos(rig.pitch),sp=Math.sin(rig.pitch),cr=Math.cos(rig.roll),sr=Math.sin(rig.roll),rx=xx*cy,zz=-xx*sy,ry=yy*cp-zz*sp,rz=yy*sp+zz*cp,k=2400/(2400+rig.z+rz);
 return[(rx*cr-ry*sr)*k,(rx*sr+ry*cr)*k];
}
export function chatCameraV11(t,H){
 const pull=H.inOut(range(t,128.45,129.02)),travel=H.inOut(range(t,128.90,130.45)),age=t-CHAT[0],focus=[mix(450,590,pull)+age*10*(1-pull),mix(230,900,pull)+430*travel+age*18*(1-pull)],w=mix(1880,1450,pull)+age*20*(1-pull),rig={w,h:w*1840/1180,roll:mix(-.44,.12,pull)+travel*.035,yaw:mix(-.22,-.40,pull),pitch:mix(-.18,-1.02,pull),z:mix(0,80,pull)},offset=projectedPoint(rig,focus[0]/1180,focus[1]/1840);
 rig.x=mix(930,830,pull)-offset[0];rig.y=mix(470,520,pull)-offset[1];return{rig,focus,pull,travel,progress:range(t,...CHAT)};
}
function chat(c,t,E,p,H){
 H.vstage(c,t,E,p,{kind:'city'});const cam=chatCameraV11(t,H),font=E.fontFor?.(127.37)??E.JP,[sheet,q]=E.scratch('v11-chat-oblique-transcript',1180,1840),head=cam.progress*(MESSAGES.length+.6),cards=[];
 q.fillStyle=E.PAPER;q.fillRect(0,0,1180,1840);q.strokeStyle=E.INK;q.lineWidth=2;q.strokeRect(34,30,1110,1780);E.text(q,'会話記録 / CASE 127',68,86,29,E.INK,{font});E.text(q,'TRANSCRIPT / PRIVATE',1100,84,14,E.INK,{font:E.MONO,align:'right'});line(q,E,H,67,111,1110,111,E.INK);
 MESSAGES.forEach((m,i)=>{
  const person=PEOPLE[m.role],enter=sat(head-i),ease=H.out(enter),y=139+i*176,g=[...m.text],count=Math.min(g.length,Math.ceil(sat((enter-.14)/.72)*g.length)),listReveal=i===0?1:smooth(range(t,128.45,128.9));
  q.save();q.globalAlpha=(.09+.91*ease)*listReveal;q.strokeStyle=E.INK;q.lineWidth=.85;q.strokeRect(68,y,1038,158);q.restore();
  if(enter<=0||listReveal===0)return;q.save();q.globalAlpha=ease*listReveal;q.translate((1-ease)*340,0);q.save();q.beginPath();q.rect(83,y+13,111,129);q.clip();E.art(q,person.asset,[83,y+13,111,129],{mode:'ink'});q.restore();
  line(q,E,H,214,y+15,214,y+142,E.INK,.65);E.text(q,person.name,239,y+41,26,E.INK,{font});E.text(q,String(i+1).padStart(2,'0'),1080,y+38,16,E.INK,{font:E.MONO,align:'right'});E.text(q,g.slice(0,count).join(''),239,y+104,34,E.INK,{font});q.restore();
  cards.push({index:i+1,role:m.role,name:person.name,asset:person.asset,text:g.slice(0,count).join(''),visibleGlyphCount:count,totalGlyphs:g.length,opacity:ease*listReveal,localBounds:{left:68,top:y,right:1106,bottom:y+158}});
 });
 E.text(q,'記録終了 / 000127',1100,1777,14,E.INK,{font,align:'right'});
 const quad=H.cameraQuad(cam.rig);H.projectPlane(c,sheet,quad);
 const cue=E.cueAt(t);if(t<128.9)H.vtype(c,t,E,p,{x:1110,y:600,w:1300,h:210,maxSize:115,roll:-.40,yaw:-.12,pitch:-.08,halo:true});
 else H.vtype(c,t,E,p,{x:1748,y:525,w:285,h:810,maxSize:100,vertical:true,roll:.035,yaw:-.10,pitch:0,halo:true});
 H.mark('prop:chat','chat:progressive-glyphs','chat:ordered-transcript-cards','chat:v11-original-pv-oblique-camera','camera:v11-diagonal-close-to-receding-transcript');
 cards.forEach(a=>H.mark('chat-card:'+a.index,'chat-name:'+a.name,'avatar:'+a.asset));
 H.info({chatTranscriptState:cards,cameraState:{subject:'chat-original-pv-oblique-depth',...cam,quad,continuous:true,sceneStart:CHAT[0],sceneEnd:CHAT[1],loopReset:false},revisionState:{chatPerspective:{revision:'V11-006',rowCount:9,messages:MESSAGES,people:PEOPLE,renderedCards:cards,progress:cam.progress,rig:cam.rig,quad,focus:cam.focus,pull:cam.pull,travel:cam.travel,continuous:true,sourceCueId:cue?.id??null,sourceCueStart:cue?.start_seconds??null,sourceCueEnd:cue?.end_seconds??null,lyricAxisUnchanged:true,reference:'local original PV 127.37–130.12'}}});
}
export function renderDocumentPerspectiveFixesV11(c,t,E,p,H){
 if(t>=SIGNAL[0]&&t<SIGNAL[1]){signal(c,t,E,p,H);return true}
 if(t>=CHAT[0]&&t<CHAT[1]){chat(c,t,E,p,H);return true}
 return false;
}
