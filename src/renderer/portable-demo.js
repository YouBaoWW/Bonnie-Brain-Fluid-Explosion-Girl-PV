// Original geometric placeholders; no raster character image is bundled.
export function demoAsset(id){
 const c=document.createElement('canvas');c.width=1024;c.height=1536;c.naturalWidth=c.width;c.naturalHeight=c.height;const q=c.getContext('2d');
 q.strokeStyle='#111';q.lineWidth=12;q.strokeRect(130,160,764,1200);q.beginPath();q.moveTo(130,160);q.lineTo(894,1360);q.moveTo(894,160);q.lineTo(130,1360);q.stroke();q.fillStyle='#fff';q.fillRect(135,680,754,160);q.fillStyle='#111';q.font='bold 32px monospace';q.textAlign='center';q.fillText('ASSET OMITTED',512,730);q.font='22px monospace';q.fillText(id,512,785);return c;
}
