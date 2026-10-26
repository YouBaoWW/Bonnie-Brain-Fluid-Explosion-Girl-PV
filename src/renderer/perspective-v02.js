/* Project a transparent typography plane with one perspective-correct WebGL
 * quad, then composite it once into Canvas2D. Per-glyph alpha is retained.
 * Only text planes use this projection. Character raster sources stay uniform.
 */
const clamp=x=>Math.max(0,Math.min(1,x));
const bezier=(x,a,b)=>{let lo=0,hi=1,u=x;for(let i=0;i<12;i++){const v=1-u,bx=3*v*v*u*a[0]+3*v*u*u*b[0]+u*u*u;if(bx<x)lo=u;else hi=u;u=(lo+hi)/2}const v=1-u;return 3*v*v*u*a[1]+3*v*u*u*b[1]+u*u*u};
export const out=p=>bezier(clamp(p),[.23,1],[.32,1]);
export const inOut=p=>bezier(clamp(p),[.77,0],[.175,1]);
export const lerp=(a,b,p)=>a+(b-a)*p;
export function quadFor({x=960,y=540,w=1100,h=500,yaw=0,pitch=0,roll=0,z=0,focal=1600}={}){
 yaw=Math.max(-.55,Math.min(.55,yaw));pitch=Math.max(-.5,Math.min(.5,pitch));
 const cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch),cr=Math.cos(roll),sr=Math.sin(roll);
 return[[-.5,-.5],[.5,-.5],[.5,.5],[-.5,.5]].map(([u,v])=>{const xx=u*w,yy=v*h,rx=xx*cy,zz=-xx*sy,ry=yy*cp-zz*sp,rz=yy*sp+zz*cp,depth=focal+z+rz;if(!Number.isFinite(depth)||depth<200)throw new Error('Typography plane crossed the near-depth limit');const k=focal/depth;return[x+(rx*cr-ry*sr)*k,y+(rx*sr+ry*cr)*k]});
}
function homography(q){
 const[x0,y0]=q[0],[x1,y1]=q[1],[x2,y2]=q[2],[x3,y3]=q[3],dx1=x1-x2,dx2=x3-x2,dx3=x0-x1+x2-x3,dy1=y1-y2,dy2=y3-y2,dy3=y0-y1+y2-y3,den=dx1*dy2-dx2*dy1;
 const g=Math.abs(den)<1e-9?0:(dx3*dy2-dx2*dy3)/den,h=Math.abs(den)<1e-9?0:(dx1*dy3-dx3*dy1)/den,a=x1-x0+g*x1,b=x3-x0+h*x3,d=y1-y0+g*y1,e=y3-y0+h*y3;
 const matrix=new Float32Array([a,d,g,b,e,h,x0,y0,1]);
 if(![...matrix].every(Number.isFinite)||[1,1+g,1+g+h,1+h].some(depth=>depth<=1e-5))throw new Error('Typography plane has an invalid projective transform');
 return matrix;
}
const VERTEX=`
 attribute vec2 aUV;
 uniform mat3 uProjection;
 uniform vec2 uSize;
 varying highp vec2 vUV;
 void main(){
  vec3 p=uProjection*vec3(aUV,1.0);
  gl_Position=vec4(2.0*p.x/uSize.x-p.z,p.z-2.0*p.y/uSize.y,0.0,p.z);
  vUV=aUV;
 }`;
const FRAGMENT=`
 precision highp float;
 varying highp vec2 vUV;
 uniform sampler2D uTexture;
 void main(){gl_FragColor=texture2D(uTexture,vUV);}`;
function compile(gl,type,source){
 const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);
 if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){const error=gl.getShaderInfoLog(shader);gl.deleteShader(shader);throw new Error(`Typography shader compilation failed: ${error}`)}return shader;
}
const projectedLayers=new WeakMap();
function createLayer(c){
 const layer=document.createElement('canvas');layer.width=c.canvas.width;layer.height=c.canvas.height;
 const gl=layer.getContext('webgl',{alpha:true,premultipliedAlpha:true,antialias:false,preserveDrawingBuffer:true,depth:false,stencil:false,powerPreference:'low-power'});
 if(!gl)throw new Error('WebGL is required for seamless typography projection');
 const program=gl.createProgram(),vertex=compile(gl,gl.VERTEX_SHADER,VERTEX),fragment=compile(gl,gl.FRAGMENT_SHADER,FRAGMENT);
 gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);gl.deleteShader(vertex);gl.deleteShader(fragment);
 if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(`Typography shader link failed: ${gl.getProgramInfoLog(program)}`);
 gl.useProgram(program);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
 // One projective quad. Adjacent triangles share the same vertices and the
 // GPU's perspective-correct interpolation; there are no clipped mesh cells.
 gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([0,0,1,0,0,1,1,1]),gl.STATIC_DRAW);
 const uv=gl.getAttribLocation(program,'aUV');gl.enableVertexAttribArray(uv);gl.vertexAttribPointer(uv,2,gl.FLOAT,false,0,0);
 const texture=gl.createTexture();gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,texture);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
 gl.uniform1i(gl.getUniformLocation(program,'uTexture'),0);gl.disable(gl.BLEND);gl.disable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);gl.disable(gl.DITHER);
 gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,true);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL,gl.NONE);
 return{layer,gl,program,projection:gl.getUniformLocation(program,'uProjection'),size:gl.getUniformLocation(program,'uSize')};
}
export function projectPlane(c,image,quad,{alpha=1,columns=8,rows=3}={}){
 // columns/rows remain accepted for caller compatibility; there is no mesh.
 if(alpha<=0)return;if(!Number.isFinite(alpha)||!image.width||!image.height)throw new Error('Invalid typography texture or alpha');
 const matrix=homography(quad);let state=projectedLayers.get(c);if(!state){state=createLayer(c);projectedLayers.set(c,state)}const{layer,gl,projection,size}=state;
 if(gl.isContextLost())throw new Error('Typography WebGL context was lost');
 if(layer.width!==c.canvas.width||layer.height!==c.canvas.height){layer.width=c.canvas.width;layer.height=c.canvas.height}
 gl.viewport(0,0,layer.width,layer.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
 gl.uniformMatrix3fv(projection,false,matrix);gl.uniform2f(size,layer.width,layer.height);
 // Upload every call: the source canvas contains absolute-time per-glyph alpha.
 // Premultiplied pixels pass through unchanged, with no repeated blend/clip AA.
 gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);gl.flush();
 c.save();c.globalAlpha*=Math.min(1,alpha);c.drawImage(layer,0,0);c.restore();
}
