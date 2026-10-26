/* Authored film transitions evaluated at absolute song time. */
const sat=x=>Math.max(0,Math.min(1,x)),mix=(a,b,u)=>a+(b-a)*u;
const unit=(t,a,b)=>sat((t-a)/(b-a));
function tvHand(c,t,E,p,H){
 H.vstage(c,t,E,p,{kind:'threads'});
 const a=142.84,b=143.23,vertical=H.out(unit(t,a,a+.20)),horizontal=H.out(unit(t,a+.20,b));
 const sy=mix(1,.006,vertical),sx=1-horizontal,cx=1500,cy=530;
 const [hand,q]=E.scratch('v11-tv-hand',1920,1080);
 H.vprop(q,t,E,'hand-shadow',[1050,125,1050,820],{pose:'dog',progress:1});
 if(t<b){c.save();c.translate(cx,cy);c.scale(Math.max(.002,sx),Math.max(.006,sy));c.translate(-cx,-cy);c.drawImage(hand,0,0);c.restore();}
 if(t>=a+.16&&t<b){
  const alpha=(1-horizontal)*.65;c.save();c.globalAlpha=alpha;c.shadowColor='#777';c.shadowBlur=9;
  E.rule(c,cx-420*sx,cy,cx+420*sx,cy,E.INK,2.5,1);c.fillStyle=E.PAPER;c.fillRect(cx-3,cy-1.5,6,3);c.restore();
 }
 H.vtype(c,t,E,p,{x:850,y:520,w:1390,h:680,maxSize:230});
 H.mark('transition:hand-tv-switch-off','prop:hand-shadow-dog');
 H.info({revisionState:{handExit:{kind:'tv-switch-off',start:a,end:b,scaleX:sx,scaleY:sy,stage:t<a?'hold':t<a+.20?'vertical-collapse':t<b?'line-to-point':'off',nextScene:143.25}}});
}
function screenRule(c,E,x1,y1,x2,y2,alpha=.2,width=1){c.save();c.globalAlpha=alpha;E.rule(c,x1,y1,x2,y2,E.PAPER,width,1);c.restore();}
function caseStack(c,t,E,p,H){
 H.vstage(c,t,E,p,{kind:'threads'});const u=unit(t,177.53,180.10),travel=H.inOut(u);
 for(let i=4;i>=0;i--){H.vprop(c,t,E,'paper',[570+i*78-travel*270,170+i*60,760,980],{rotation:(i-2)*.065-travel*.04,seed:321+i,header:'ARCHIVE / '+String(127+i),body:['演示文字演','通信記録','現場写真','追跡報告','最終記録'][i]});}
 H.character(c,t,E,'SIL03',[-650+travel*140,-125,1480,1480],{silhouette:true,keepTie:true});
 E.text(c,'CASE 127',1435,350,118,E.INK,{font:E.MONO,align:'center',outline:1});
 E.text(c,'演示文字演示文字演',1440,450,42,E.INK,{font:E.JP,align:'center'});
 H.mark('outro:archive-pull-and-paper-wipe');
}
function portraitRecord(c,t,E,p,H){
 E.rect(c,0,0,1920,1080,E.INK);const u=unit(t,180.10,183.28),drift=H.inOut(u),pulse=E.sampleAudio(t).pulse;
 for(let row=0;row<13;row++)screenRule(c,E,50,130+row*62,1870,130+row*62,.13);
 for(let i=0;i<37;i++)for(let j=0;j<16;j++){const x=850+i*28-drift*45,y=135+j*48;if((i+j)%3===0){c.save();c.globalAlpha=.24;c.fillStyle=E.PAPER;c.fillRect(x,y,2.5,2.5);c.restore();}}
 for(let i=0;i<12;i++){const y=200+i*56;screenRule(c,E,100,y,900,510+i*11,.14);E.text(c,String(i+1).padStart(2,'0')+' / '+['現場証言','通信照合','証拠記録','調査完了'][i%4],115,y-8,22,E.PAPER,{font:E.MONO,alpha:.45});}
 c.save();c.translate(1470-drift*35,530);c.rotate(-.025+drift*.045);E.art(c,'BONNIE_FULL_A11',[-470-drift*35,-430-drift*35,940+drift*70,1620+drift*100],{mode:'print',alignY:'top'});c.restore();H.mark('asset:BONNIE_FULL_A11','character:bonnie','outro:full-portrait-reference');
 const terms=['演示文字演','演示文字演示','CASE CLOSED'];
 terms.forEach((s,i)=>E.text(c,s,690+i*58,250+i*190,68+(i===2?10:0),E.PAPER,{font:i===2?E.MONO:E.fontFor(166.32),rotate:-.045+drift*.025,alpha:.50+.15*pulse}));
 E.text(c,'127 / BONNIE / LAYERED MATERIAL',90,130,20,E.PAPER,{font:E.MONO,weight:400});
 E.text(c,'BONNIE × FANNY',1830,910,23,E.PAPER,{font:E.MONO,align:'right'});
 H.mark('outro:black-portrait-evidence-grid','outro:reference-layered-material');
}
function phoneRecord(c,t,E,p,H){
 H.vstage(c,t,E,p,{kind:'circuit'});const u=unit(t,183.28,185.35),turn=H.inOut(u),flip=Math.abs(Math.cos(Math.PI*unit(t,183.28,183.64)));
 H.vprop(c,t,E,'paper',[200-u*220,185,650,830],{rotation:-.12-u*.05,header:'通信記録 / 127',body:'調査終了 / 照合完了'});
 c.save();c.translate(1210,525);c.rotate(-.13+turn*.28);c.scale(Math.max(.035,flip),1);H.vprop(c,t,E,'flip-phone',[-260,-410,520,840],{screenText:'CASE 127\nCOMPLETE',rotation:0});c.restore();
 E.text(c,'演示文字演',470,465,88,E.INK,{font:E.JP});E.text(c,'127 → ARCHIVE',490,610,32,E.INK,{font:E.MONO,weight:400});
 H.mark('outro:phone-hinge-match-cut');
}
function sealRecord(c,t,E,p,H){
 H.vstage(c,t,E,p,{kind:'plain'});const u=unit(t,185.35,187.39),land=H.out(unit(t,185.35,185.72));
 H.vprop(c,t,E,'envelope',[500,220+(1-land)*950,920,580],{rotation:mix(.13,-.035,land)});
 E.text(c,'127',960,555,165,E.INK,{font:E.MONO,align:'center'});
 c.save();c.globalAlpha=H.out(unit(t,185.9,186.13));c.translate(1100,705);c.rotate(-.12);c.strokeStyle=E.INK;c.lineWidth=5;c.strokeRect(-240,-50,480,100);E.text(c,'調 査 完 了',0,28,63,E.INK,{font:E.JP,align:'center'});c.restore();
 if(t>186.99){const close=H.inOut(unit(t,186.99,187.39));E.rect(c,0,90,1920,435*close,E.INK);E.rect(c,0,960-435*close,1920,435*close,E.INK);}
 H.mark('outro:envelope-stamp-iris-close');
}
function outro(c,t,E,p,H){
 let shot,index,start,end;
 if(t<180.10){shot='archive-pull';index=0;start=177.53;end=180.10;caseStack(c,t,E,p,H);}
 else if(t<183.28){shot='black-portrait-grid';index=1;start=180.10;end=183.28;portraitRecord(c,t,E,p,H);}
 else if(t<185.35){shot='phone-hinge';index=2;start=183.28;end=185.35;phoneRecord(c,t,E,p,H);}
 else{shot='envelope-seal';index=3;start=185.35;end=187.39;sealRecord(c,t,E,p,H);}
 // The same physical paper edge bridges the white file shot into black material.
 if(t>=179.87&&t<180.10){const u=H.inOut(unit(t,179.87,180.10));E.rect(c,1920-u*1920,90,u*1920,870,E.INK);}
 if(t>=183.08&&t<183.28){const u=H.inOut(unit(t,183.08,183.28));E.rect(c,0,90,1920*u,870,E.PAPER);}
 H.mark('section:outro','outro:four-distinct-shots');
 H.info({revisionState:{outroMontage:{shot,index,start,end,transitions:['paper-edge-wipe','portrait-to-white-wipe','phone-hinge-match','envelope-iris'],referencePortrait:true}}});
}
export function renderFinishFixesV11(c,t,E,p,H){
 if(t>=141.31&&t<143.25){tvHand(c,t,E,p,H);return true;}
 if(t>=177.53&&t<187.39){outro(c,t,E,p,H);return true;}
 return false;
}
