/* V11 targeted paper repairs. Existing film timing and photographs stay fixed.
 * Article copy is authored once; route arrows are constructed from ink bounds. */
const clamp=x=>Math.max(0,Math.min(1,x));
const lerp=(a,b,u)=>a+(b-a)*u;
const ease=x=>{x=clamp(x);return x*x*(3-2*x)};
const line=(c,E,x,y,xx,yy,color=E.INK,width=1)=>E.rule(c,x,y,xx,yy,color,width,1);

const SIDEBAR=[
 '演示文字演示文字演示文字','演示文字 P-01 文字演示文字','演示文字演示文字演示文字演',
 '演示文字演示文字演示文','演示文字演示文字演示文字','【取材記録】','演示文　演示文',
 '演示文字　示文字演','保管先　第三資料室','【次号予告】','演示文字演示文字演示',
 '演示文字演示文字演示文字','演示文字演示文字演示文字演'
];
const ARTICLES=[
 {id:'field',heading:'演示文字演示',lines:['演示文字演示文字演示文','演示文字演示文字演示文','演示文字演示文字演示','演示文字演示文字演示文字','演示文字演示文字演示文字','演示文字演示文字演示文','演示文字演示文字演示文','演示文字演示文字演示文字','演示文字演示文字演示']},
 {id:'communication',heading:'演示文字演示文',lines:['演示文字演示文字演示文字','演示文字演示文字演示文','演示文字演示文字演示文','演示文字演示文字演示文','演示文字演示文字演示文','演示文字演示文字演示文','演示文字演示文字演示文','演示文字演示文字演示','演示文字演示文字演示文字']},
 {id:'evidence',heading:'演示文字演示文',lines:['演示文字演示文字演示文字','演示文字演示文字演示文','演示文字演示文字演示','演示文字演示文字演示文','演示文字演示文字演示文','演示文字演示文字演示文','演示文字演示文字演示文字','演示文字演示文字演示文字演','演示文字演示文字演示文字']},
 {id:'testimony',heading:'演示文字演',lines:['演示文字演示文字演示文字','演示文字演示文字演示','演示文字演示文字演示文字','演示文字演示文字演示文','演示文字演示文字演示文字','演示文字演示文字演示','演示文字演示文字演示文字','演示文字演示文字演示文','演示文字演示文字演示文']}
];
const BODY_LINES=[...SIDEBAR,...ARTICLES.flatMap(a=>a.lines)];

function fittedText(c,E,text,x,y,width,size,options={}){
 c.save();c.font=`${options.weight??700} ${size}px ${options.font??E.JP}`;const fitted=Math.min(size,size*width/Math.max(width,c.measureText(text).width));c.restore();
 E.text(c,text,x,y,fitted,E.INK,{font:E.JP,...options});
}

function distinctNewspaper(c,t,E,p,H){
 H.vstage(c,t,E,p,{kind:'plain'});const u=clamp((t-105.68)/3.17),paperFont=E.fontFor?.(105.68)??E.JP,P={...E,JP:paperFont},key='v11-authored-distinct-newspaper-'+paperFont;let paper=H.cache.get(key);
 if(!paper){
  const[canvas,q]=E.scratch(key,1200,1000);q.fillStyle=E.PAPER;q.fillRect(0,0,1200,1000);q.strokeStyle=E.INK;q.lineWidth=5;q.strokeRect(15,15,1170,970);
  E.text(q,'星街調査新聞',600,110,73,E.INK,{font:paperFont,align:'center'});line(q,E,40,140,1160,140,E.INK,7);E.text(q,'事件 127  /  特別調査号',45,180,24,E.INK,{font:E.MONO});
  E.art(q,'DOCUMENT_PICTURE_01',[45,210,690,460],{mode:'print'});E.text(q,'演示文字演示文',770,265,37,E.INK,{font:paperFont});
  SIDEBAR.forEach((text,row)=>fittedText(q,P,text,770,310+row*27,382,22,{weight:text.startsWith('【')?800:500}));
  fittedText(q,P,'演示文字 P-01示文字演示文字演示文字演示',45,700,690,23,{weight:500});
  E.text(q,'演示文字演示文字演示文字演示',45,750,47,E.INK,{font:paperFont});line(q,E,44,768,1158,768,E.INK,3);
  ARTICLES.forEach((article,col)=>{const x=48+col*290;if(col)line(q,E,x-15,782,x-15,966,E.INK,1);fittedText(q,P,article.heading,x,799,263,24);article.lines.forEach((text,row)=>fittedText(q,P,text,x,826+row*17,263,17,{weight:500}));});
  paper=canvas;H.cache.set(key,paper);
 }
 const angle=lerp(-.12,.07,ease(u)),w=lerp(1080,1010,ease(u)),h=w*1000/1200;H.projectPlane(c,paper,H.cameraQuad({x:630,y:530,w,h,roll:angle,yaw:lerp(.08,-.07,u)}));
 H.vtype(c,t,E,p,{x:1515,y:565,w:700,h:680,maxSize:130});
 H.mark('asset:DOCUMENT_PICTURE_01','newspaper:main-subject','newspaper:multiple-readable-columns','lyric:beside-newspaper','newspaper:v11-distinct-reports-sidebar-captions');
 H.info({revisionState:{newspaperContent:{start:105.68,end:108.85,photoAsset:'DOCUMENT_PICTURE_01',articleIds:ARTICLES.map(a=>a.id),headings:ARTICLES.map(a=>a.heading),sidebarLineCount:SIDEBAR.length,articleLineCount:ARTICLES.reduce((n,a)=>n+a.lines.length,0),uniqueBodyLineCount:new Set(BODY_LINES).size,bodyLineCount:BODY_LINES.length,repeatedBodyLines:BODY_LINES.length-new Set(BODY_LINES).size,caption:'演示文字 P-01示文字演示文字演示文字演示',cameraUnchanged:true}}});
}

const WORDS=[{text:'二次会',x:430,y:310},{text:'焼肉',x:990,y:500},{text:'五反田',x:1530,y:690}];
const WORD_STARTS=[130.45,130.45+.98/3,130.45+.98*2/3];

function textBounds(c,E,word,size){
 c.save();c.font=`700 ${size}px ${E.JP}`;const m=c.measureText(word.text),left=word.x-m.width/2,ascent=m.actualBoundingBoxAscent??size*.86,descent=m.actualBoundingBoxDescent??size*.12;c.restore();
 return{left:left-(m.actualBoundingBoxLeft??0),right:left+(m.actualBoundingBoxRight??m.width),top:word.y-ascent,bottom:word.y+descent,centerY:word.y+(descent-ascent)/2};
}

function routeBetween(a,b){const gap=44,start=[a.right+gap,a.centerY],end=[b.left-gap,b.centerY],corridor=(start[0]+end[0])/2;return{startGap:gap,endGap:gap,points:[start,[corridor,start[1]],[corridor,end[1]],end]}}

function drawRoute(c,E,points,progress){
 const segments=points.slice(1).map((p,i)=>({a:points[i],b:p,length:Math.hypot(p[0]-points[i][0],p[1]-points[i][1])})),total=segments.reduce((n,s)=>n+s.length,0),visible=[];let remaining=total*clamp(progress),tip=points[0],angle=0;
 for(const s of segments){if(remaining<=0)break;const u=Math.min(1,remaining/s.length),end=[lerp(s.a[0],s.b[0],u),lerp(s.a[1],s.b[1],u)];visible.push([s.a,end]);tip=end;angle=Math.atan2(s.b[1]-s.a[1],s.b[0]-s.a[0]);remaining-=s.length;}
 c.save();c.lineJoin='round';c.lineCap='round';for(const[color,width]of[[E.PAPER,10],[E.INK,5]]){c.strokeStyle=color;c.lineWidth=width;c.beginPath();visible.forEach(([a,b])=>{c.moveTo(...a);c.lineTo(...b)});c.stroke()}
 if(visible.length){c.fillStyle=E.INK;c.beginPath();c.moveTo(...tip);c.lineTo(tip[0]-18*Math.cos(angle-.43),tip[1]-18*Math.sin(angle-.43));c.lineTo(tip[0]-18*Math.cos(angle+.43),tip[1]-18*Math.sin(angle+.43));c.closePath();c.fill()}c.restore();return{tip,visibleSegments:visible};
}

function gotandaRoutes(c,t,E,p,H){
 H.vstage(c,t,E,p,{kind:'city'});const size=160,bounds=WORDS.map(w=>textBounds(c,E,w,size)),routes=[routeBetween(bounds[0],bounds[1]),routeBetween(bounds[1],bounds[2])],visibleWords=[];
 WORDS.forEach((word,i)=>{if(t<WORD_STARTS[i])return;const alpha=ease((t-WORD_STARTS[i])/.075);c.save();c.font=`700 ${size}px ${E.JP}`;c.textAlign='center';c.textBaseline='alphabetic';c.globalAlpha=alpha;c.strokeStyle=E.PAPER;c.lineWidth=7;c.lineJoin='round';c.strokeText(word.text,word.x,word.y);c.fillStyle=E.INK;c.fillText(word.text,word.x,word.y);c.restore();visibleWords.push(word.text)});
 const drawn=[];routes.forEach((route,i)=>{const start=WORD_STARTS[i]+.15,progress=ease((t-start)/.16);if(t<start)return;drawn.push({from:WORDS[i].text,to:WORDS[i+1].text,start,progress,...route,...drawRoute(c,E,route.points,progress)})});
 H.mark('transition:earlier-gotanda-word-arrow','typography:v11-separated-word-chain','arrow:v11-right-angle-safe-gaps');
 H.info({revisionState:{gotandaArrows:{start:130.45,end:131.43,sequence:WORDS.map(w=>w.text),visibleWords,fontSize:size,wordStarts:WORD_STARTS,wordBounds:bounds,routes:drawn,logicalDirection:'二次会→焼肉→五反田',safeEndpointGap:44,arrowHeadLength:18}}});
}

export function renderPaperFixesV11(c,t,E,p,H){
 if(t>=105.68&&t<108.85){distinctNewspaper(c,t,E,p,H);return true}
 if(t>=130.45&&t<131.43){gotandaRoutes(c,t,E,p,H);return true}
 return false;
}

export const PAPER_FIXES_V11_PLAN=Object.freeze({newspaper:{start:105.68,end:108.85,sidebar:SIDEBAR,articles:ARTICLES,photoAsset:'DOCUMENT_PICTURE_01'},arrows:{start:130.45,end:131.43,words:WORDS,wordStarts:WORD_STARTS,fontSize:160,safeGap:44,headLength:18}});
