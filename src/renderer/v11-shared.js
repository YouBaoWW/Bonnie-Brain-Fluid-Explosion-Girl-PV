// Absolute-time message choreography. Full text is laid out once, then revealed
// at fixed glyph positions, so a growing message never reflows previous words.
export function typewriterTextV06(c,t,E,H,{text,box,start,end,size=40,color=E.INK,align='left',weight=700}){
 const g=H.chars(text),[x,y,w,h]=box,duration=Math.max(.001,end-start);
 const visible=t<start?0:Math.min(g.length,Math.max(1,Math.floor(H.clamp((t-start)/duration)*g.length)+1));
 c.save();c.textBaseline='alphabetic';let font=size,rows=[];
 const layout=()=>{c.font=`${weight} ${font}px ${E.JP}`;rows=[[]];let width=0;for(let i=0;i<g.length;i++){const ch=g[i],cw=c.measureText(ch).width;if(ch==='\n'||(width+cw>w&&rows.at(-1).length)){rows.push([]);width=0;if(ch==='\n')continue}rows.at(-1).push({ch,index:i,width:cw});width+=cw}};
 layout();if(rows.length*font*1.3>h){font=Math.max(10,Math.min(font,h/(rows.length*1.3)));layout()}
 c.fillStyle=color;let yy=y+(h-rows.length*font*1.3)/2+font;
 let entering=0;
 for(const row of rows){const rw=row.reduce((n,a)=>n+a.width,0);let xx=x+(align==='center'?(w-rw)/2:0);for(const a of row){if(a.index<visible){const on=start+duration*a.index/Math.max(1,g.length),age=Math.max(0,t-on),u=H.out(H.clamp(age/.09)),blur=(1-u)*Math.min(6,font*.10);c.save();c.filter=blur>.05?`blur(${blur.toFixed(3)}px)`:'none';if(u<.995){entering++;c.globalAlpha=.10*(1-u);for(let n=1;n<=3;n++)c.fillText(a.ch,xx+(1-u)*n*4,yy);c.globalAlpha=1;}c.fillText(a.ch,xx,yy);c.restore()}xx+=a.width}yy+=font*1.3}c.restore();
 if(entering)H.mark('typography:v11-message-entry-motion-blur');
 return{total:g.length,visible,start,end,entryBlurSeconds:.09,enteringGlyphs:entering,holdBlur:0};
}

export function smsBubbleV06(c,t,E,H,{text,box,start,end,tail='left',key='sms',size=80,fill=E.PAPER}){
 if(t<start)return{visible:0,total:H.chars(text).length,start,end};
 const[x,y,w,h]=box;c.save();c.fillStyle=fill;c.strokeStyle=E.INK;c.lineWidth=3;c.beginPath();c.roundRect(x,y,w,h,Math.min(24,h*.1));c.fill();c.stroke();
 c.beginPath();const xx=tail==='right'?x+w:x;c.moveTo(xx+(tail==='right'?-3:3),y+h*.65);c.lineTo(xx+(tail==='right'?24:-24),y+h*.82);c.lineTo(xx+(tail==='right'?-3:3),y+h*.81);c.fill();c.stroke();
 const state=typewriterTextV06(c,t,E,H,{text,box:[x+28,y+10,w-56,h-20],start,end,size,align:'left'});c.restore();H.mark('chat:progressive-glyphs','chat:single-left-tail:'+key);return state;
}

export function phoneChatV06(c,t,E,p,H,{box=[810,95,1020,1658],text=null,mode='chat',rotation=0,forceSingle=false,parts:customParts=null,tail=null,start=null,end=null}={}){
 const cue=E.cueAt(t),phrase=text??cue?.text??'',a=start??cue?.start_seconds??p.start,b=end??cue?.end_seconds??p.end;
 const g=H.chars(phrase.replace(/\s+/g,''));let parts=[];
 if(customParts)parts=customParts;
 else if(forceSingle||mode==='call')parts=[phrase];
 else if(cue?.id==='cue_007')parts=[g.slice(0,4).join(''),g.slice(4,8).join(''),g.slice(8).join('')];
 else if(cue?.id==='cue_008')parts=[g.slice(0,5).join(''),g.slice(5).join('')];
 else{const count=g.length>17?3:2,n=Math.ceil(g.length/count);for(let i=0;i<count;i++)parts.push(g.slice(i*n,(i+1)*n).join(''))}
 parts=parts.filter(Boolean);const total=parts.reduce((n,s)=>n+H.chars(s).length,0);let offset=0;
 const timed=parts.map((s,i)=>{const n=H.chars(s).length,partStart=a+(b-a)*offset/Math.max(1,total);offset+=n;return{text:s,start:partStart,end:a+(b-a)*offset/Math.max(1,total),index:i}});
 const screenStates=[];
 const contentRenderer=(q,tt,z)=>{q.fillStyle=E.PAPER;q.fillRect(0,0,z.w,z.h);E.text(q,'ボニー',z.w*.12,30,19,E.INK,{font:E.JP});
  const top=46,row=(z.h-top-10)/Math.max(1,parts.length),bw=z.w*.83;
  for(const part of timed){if(t<part.start)continue;const right=tail?tail==='right':part.index%2===1,x=right?z.w-bw-6:6,y=top+part.index*row,h=row-9;
   const state=smsBubbleV06(q,t,E,H,{text:part.text,box:[x,y,bw,h],start:part.start,end:part.end,tail:right?'right':'left',key:cue?.id+'-'+part.index,size:35,fill:right?'#E5E5E3':E.PAPER});screenStates.push({...part,...state});
  }
 };
 H.vprop(c,t,E,'flip-phone',box,{screenMode:mode,contentRenderer,rotation});
 H.mark('carrier:phone-screen-lyrics','carrier:actual-chat-bubbles','chat:ordered-part-windows','chat-bubble-count:'+screenStates.length,'chat-screen-cue:'+(cue?.id??''));
 H.info({chatState:{cueId:cue?.id??null,phrase,parts:screenStates,ordered:true,start:a,end:b}});
 return screenStates;
}
