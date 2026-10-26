/* V11 seated tower introduction. Reference footage is never played here.
 * Camera, breathing, lens reveal and a hovering hat use absolute time. */
const clamp=x=>Math.max(0,Math.min(1,x)),mix=(a,b,u)=>a+(b-a)*u;
const unit=(t,a,b)=>clamp((t-a)/(b-a));
const TAU=Math.PI*2;
const START=11.70,END=16.44;

// Calibrated against the transparent asset's seated hip and bare head. These
// anchors remain in source-image fractions when the camera moves or zooms.
const SEATED_BOX=[300,95,1550,870],HIP=[.66,.735],HEAD=[.65,.21];
function fitRect(source,[x,y,w,h]){
 const sw=source.naturalWidth??source.width,sh=source.naturalHeight??source.height,k=Math.min(w/sw,h/sh);
 return{x:x+(w-sw*k)/2,y:y+(h-sh*k)/2,w:sw*k,h:sh*k};
}
function line(c,E,a,b,width=2,alpha=1){c.save();c.globalAlpha*=alpha;c.strokeStyle=E.INK;c.lineWidth=width;c.lineCap='butt';c.beginPath();c.moveTo(...a);c.lineTo(...b);c.stroke();c.restore()}
function investigationUnderLens(c,t,E,p,H){
 const u=unit(t,p.start,p.end);H.vstage(c,t,E,p,{kind:'optical'});
 H.unifiedPaper(c,t,E,p,{box:[180,30,1530,956],roll:mix(-.11,-.03,u),header:'調査記録 / BONNIE',recordContent:true});
 const x=440+u*180,y=80,w=1000,h=1000,rotation=mix(-.75,1.9,H.inOut(u)),scale=1000/860,dx=-58,dy=-160,cs=Math.cos(rotation),sn=Math.sin(rotation);
 H.vprop(c,t,E,'magnifier',[x,y,w,h],{sourceCanvas:c.canvas,region:{x:500+u*330,y:280,w:350,h:350},zoom:1.8,rotation});
 return{x:x+w/2+(dx*cs-dy*sn)*scale,y:y+h/2+(dx*sn+dy*cs)*scale};
}
function hatAt(t,head){
 const age=t-START,driftX=Math.sin(age*1.16)*8,driftY=Math.sin(age*.93)*6;
 return{x:head[0]-700+driftX,y:head[1]-25+driftY,size:190,rotation:Math.sin(age*1.05)*.065,alpha:1,visible:true,stage:'hover',driftX,driftY,rotationAmplitude:.065,sizeConstant:true};
}
function towerShot(c,t,E,p,H){
 const age=t-START,u=unit(t,START,END),move=H.inOut(u),zoom=1+move*.018,panX=mix(-12,12,move),panY=mix(5,-5,move),microX=Math.sin(age*1.25)*5,microY=Math.sin(age*1.85)*3,tilt=Math.sin(age*1.35)*.006;
 E.rect(c,0,0,1920,1080,E.PAPER);
 // The skyline moves more slowly than the foreground beam and seated figure.
 if(E.hasAsset('CITY_TOKYO')){c.save();c.globalAlpha=.22;c.filter='blur(.6px)';E.art(c,'CITY_TOKYO',[-250-age*9,430-age*3,2500,700],{mode:'posterInk'});c.restore();H.mark('asset:CITY_TOKYO')}
 c.save();c.globalAlpha=.09;for(let i=0;i<7;i++)line(c,E,[80,235+i*91],[1840,235+i*91],1);c.restore();
 E.text(c,'TOKYO / ABOVE THE CITY',105,185,25,E.INK,{font:E.MONO,weight:400,alpha:.62});
 E.text(c,'CASE 127  /  観測点',105,226,24,E.INK,{font:E.JP,weight:500,alpha:.55});
 c.save();c.translate(960+panX,530+panY);c.scale(zoom,zoom);c.translate(-960,-530);
 const source=E.getAsset('BONNIE_TOWER_SEATED_V10','image'),rect=fitRect(source,SEATED_BOX),seat=[rect.x+rect.w*HIP[0],rect.y+rect.h*HIP[1]],head=[rect.x+rect.w*HEAD[0],rect.y+rect.h*HEAD[1]];
 // The source cutout includes its own natural steel seat and foreground beam;
 // retain that physical contact instead of drawing another beam over her legs.
 c.save();c.translate(seat[0]+microX,seat[1]+microY);c.rotate(tilt);c.translate(-seat[0],-seat[1]);E.art(c,'BONNIE_TOWER_SEATED_V10',SEATED_BOX,{mode:'image'});c.restore();
 const hat=hatAt(t,[head[0]+microX,head[1]+microY]);
 if(hat.visible){
  E.art(c,'BONNIE_TOSS_HAT_V10',[hat.x-hat.size/2,hat.y-hat.size/2,hat.size,hat.size],{mode:'image',rotate:hat.rotation});H.mark('asset:BONNIE_TOSS_HAT_V10');
 }
 c.restore();
 H.mark('character:bonnie','asset:BONNIE_TOWER_SEATED_V10','intro:v11-seated-black-silhouette','intro:v11-independent-hovering-hat','motion:v11-tower-camera-parallax');
 const cameraPoint=([x,y])=>[960+panX+(x-960)*zoom,530+panY+(y-530)*zoom];
 const bodyPoint=([x,y])=>{const dx=x-seat[0],dy=y-seat[1],cs=Math.cos(tilt),sn=Math.sin(tilt);return cameraPoint([seat[0]+microX+dx*cs-dy*sn,seat[1]+microY+dx*sn+dy*cs])};
 const screenHat=cameraPoint([hat.x,hat.y]);hat.screen={x:screenHat[0],y:screenHat[1],size:hat.size*zoom,rotation:hat.rotation,alpha:hat.alpha};
 return{zoom,panX,panY,character:{box:SEATED_BOX,rect,x:rect.x+microX,y:rect.y+microY,rotation:tilt,alpha:1,seat,head,microX,microY,appearance:'solid-black-silhouette',blackSilhouette:true,pinkFloralTie:true,faceVisible:false,headVisible:true,screen:{origin:bodyPoint([rect.x,rect.y]),seat:bodyPoint(seat),head:bodyPoint(head),rotation:tilt,alpha:1}},hat};
}
export function renderIntroFixesV11(c,t,E,p,H){
 if(t<START||t>=END)return false;
 for(const id of ['BONNIE_TOWER_SEATED_V10','BONNIE_TOSS_HAT_V10'])if(!E.hasAsset(id))throw new Error('Required V11 intro asset missing: '+id);
 const reveal=t>=12.08?1:H.inOut(unit(t,START,12.08));let centre={x:809,y:467};
 if(reveal<1)centre=investigationUnderLens(c,t,E,p,H);
 const radius=1450*reveal;
 c.save();if(reveal<1){c.beginPath();c.arc(centre.x,centre.y,radius,0,TAU);c.clip()}
 const shot=towerShot(c,t,E,p,H);c.restore();
 if(reveal>0&&reveal<1){c.save();c.strokeStyle=E.PAPER;c.lineWidth=11;c.beginPath();c.arc(centre.x,centre.y,radius,0,TAU);c.stroke();c.strokeStyle=E.INK;c.lineWidth=3;c.stroke();c.restore()}
 H.mark('intro:v11-investigation-shortened-to-1.01s','transition:v11-lens-circle-reveal');
 H.info({cameraState:{subject:'seated-silhouette-with-hovering-hat',start:START,end:END,...shot,iris:{progress:reveal,radius,centre}},revisionState:{introTower:{start:START,end:END,originalInvestigation:[10.69,11.70],returnToOriginalDocument:END,phase:reveal<1?'lens-reveal':shot.hat.stage,sourceVideoUsed:false,colors:'black-silhouette-pink-floral-tie-and-colored-hat',blackSilhouette:true,pinkFloralTie:true,hatColorPreserved:true,outlinedTowerRemoved:true,hatMotion:'hover-small-rotation',iris:{progress:reveal,radius,centre},...shot}}});
 return true;
}
