/* Scene/cue-stable font direction. Source lyrics never change. */
const GOTHIC='"Yu Gothic","MS Gothic","Microsoft YaHei",sans-serif';
const MINCHO='"SimSun","MS Mincho","Yu Mincho","MS Gothic",serif';
const NARROW='"MS Gothic","Yu Gothic","Microsoft YaHei",monospace';
const BRUSH='"Yuji Syuku","KaiTi","SimSun","MS Gothic",serif';
const LIGHT='"Yu Gothic Light","Yu Gothic","MS Gothic",sans-serif';
export const FONT_FAMILIES_V11={gothic:GOTHIC,mincho:MINCHO,narrow:NARROW,light:LIGHT,brush:BRUSH};
export function fontDirectionV11(t,cue){
 const a=cue?.start_seconds??t;
 let family='gothic',reason='heavy rhythmic statement';
 if((a>=10.69&&a<18.93)||(a>=105.68&&a<108.85)||(a>=121.5&&a<124.22)){
  family='mincho';reason='printed records and newspaper';
 }else if((a>=77.83&&a<99.41)||(a>=133.55&&a<136.67)){
  family='narrow';reason='phone and system records';
 }else if((a>=37.58&&a<40.64)||(a>=69.37&&a<71.15)||(a>=156.82&&a<158.8)){
  family='brush';reason='Japanese handwritten emotional phrase';
 }else if(a>=162.17&&a<177.53){
  const i=[162.17,164.90,166.32,169.09,171.14,173.01].findLastIndex(v=>a>=v);
  family=['gothic','narrow','brush','gothic','narrow','brush'][Math.max(0,i)];reason='final phrase accent';
 }else if(a>=177.53&&a<187.39){family='light';reason='closing evidence montage';}
 return {family,font:FONT_FAMILIES_V11[family],reason,cueId:cue?.id??null,cueStart:cue?.start_seconds??null};
}
