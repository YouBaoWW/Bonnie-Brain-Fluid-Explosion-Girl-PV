import {renderDocumentPerspectiveFixesV11} from './v11-document-perspective-fixes.js';
import {renderPortraitFixesV11} from './v11-portrait-fixes.js';
import {renderIntroFixesV11} from './v11-intro-fixes.js';
import {renderPaperFixesV11} from './v11-paper-fixes.js';
import {renderChorusFixesV11} from './v11-chorus-fixes.js';
import {renderFinishFixesV11} from './v11-finish-fixes.js';
import {renderEarlyV11} from './v11-early.js';
import {renderLateV11} from './v11-late.js';
import {renderCharacterV11,overlayCharacterV11,drawEmotionCloseupV11} from './v11-characters.js';
import {renderSpatialV11} from './v11-spatial.js';
import {phoneChatV06,smsBubbleV06,typewriterTextV06} from './v11-shared.js';
/* V04: a continuous, deterministic 0–191.583333s text-led film.
 * LRC/alpha use absolute song time; a camera cut never restarts lyric reveal.
 * Character raster images always retain uniform scale. Only type is projected.
 */
import {projectPlane,out,inOut,lerp} from './perspective-v02.js';
import {renderPropsV03} from './props-v11.js';
export const RENDERER_VERSION='full-v11-complete-revision';
const SEQUENCES=[
 {prefix:'V',clip:'verse',bounds:[18.5,19.15,20,20.4,21.3,22.15,23,23.65,24.45,25.17,26.3,27.52,28.5],modes:['opening','paper','relay','edge','vertical','head-arrow','city','lens','quarter','phone','tunnel','shards'],characters:{3:'bonnie',5:'bonnie'}},
 {prefix:'B',clip:'first-burst',bounds:[55,55.72,56.36,57.06,57.82,58.56,59.24,60.05,60.88,62.2,62.44,63.6,65],modes:['tunnel','quarter','quarter-step','quarter-step','quarter-step','vertical','edge','city','edge','shards','quarter','diagonal'],characters:{6:'bonnie',8:'duo'}},
 {prefix:'D',clip:'duo',bounds:[147.8,148.52,149.17,149.88,150.65,151.45,152.63,153.34,154.05,155.43,156.82,157.35,157.8],modes:['relay','city','shards','edge','quarter','phone','vertical','lens','tunnel','diagonal','edge','paper'],characters:{3:'duo',10:'bonnie'}},
 {prefix:'F',clip:'final-burst',bounds:[169,169.65,170.4,171.14,171.763333,172.386667,173.01,173.9,174.8,175.7,176.55,177.53,179],modes:['vertical','phone','city','quarter-step','quarter-step','quarter-step','paper','edge','shards','diagonal','edge','ending'],characters:{7:'bonnie',10:'bonnie'}},
 {prefix:'N',clip:'newspaper-city',bounds:[121.5,122.15,122.8,123.5,124.22,125,125.8,126.6,127.4,128.2,128.9,129.75,130.6,131.5],modes:['newspaper','city','newspaper-quarter','newspaper-close','magnifier-beat','magnifier-beat','city','magnifier-beat','magnifier-beat','city','chat','chat-close','chat'],characters:{}},
 {prefix:'S',clip:'solar-system',bounds:[158.5,159.25,160,160.59,161.25,161.92,162.55,163.4,164.2,164.9,166,167.2,168.5],modes:['solar-sun','solar-flare','solar-rise','solar-glyphs','solar-travel','solar-clear','solar-dance','solar-turn','solar-dance','solar-archive','solar-rebirth','solar-escape'],characters:{}},
 {prefix:'Y',clip:'first-year-solar',bounds:[65,65.15,65.95,66.75,67.55,68.45,69.37,70.25,71.15,72.15,73.14,74.1,75],modes:['year-intro','year-focus','year-focus','year-move','year-background','year-background','year-hug','year-hug','year-intense','year-intense','solar-moon','solar-outer'],characters:{}}
];
const LABELS={opening:'纸框合拢 / 档案入场',paper:'纸框切片 / 主行落定',relay:'关键词接力 / 极近回拉',edge:'巨幅边框头影 / 负形阅读',vertical:'竖排深度穿行 / 横向对照', 'head-arrow':'邦妮头影 / 箭头接力',city:'东京塔城市 / 三层横掠',lens:'真实局部放大 / 证据镜',quarter:'九十度转屏 / 横词落定',phone:'手机铰链 / 文字穿行',tunnel:'文字隧道 / 推镜',shards:'切片爆字 / 主行重组',diagonal:'大斜侧摄影机 / 深度撤离',ending:'城市离场 / 无歌词档案余波'};
const REVIEW_POSES=Object.freeze(SEQUENCES.flatMap(s=>s.modes.map((mode,i)=>Object.freeze({id:`${s.prefix}${String(i+1).padStart(2,'0')}`,clip:s.clip,start:s.bounds[i],end:s.bounds[i+1],mode,index:i,label:mode==='quarter-step'?'逐字接力 / 90度阶梯转屏':mode.startsWith('solar')?'太阳 / 八行星 / 宇宙轨道':mode.startsWith('year')?'2026→2126 / 年号退成背景':LABELS[mode]??'报纸 / 城市 / 局部放大',motion:mode==='quarter-step'?'quarter-step':'camera-cut',characters:s.characters[i]??null,characterVisible:Boolean(s.characters[i]),avatarCharacters:mode.startsWith('chat')?['bonnie','fanny']:[],dominant:mode.startsWith('solar')?'text+solar':mode==='city'?'text+city':mode.startsWith('newspaper')?'newspaper':mode.startsWith('chat')?'text+chat':'text',background:mode.startsWith('solar')?'sun / eight planets / orbits / stars':'paper / halftone / ink / signal layers'}))));

export const FULL_DURATION=191.58333333333334;
export const SOURCE_CUES=Object.freeze([{"id":"cue_001","time_tag":"[00:00.00]","start_ms":0,"start_seconds":0.0,"kind":"credit","end_ms":110,"end_seconds":0.11,"end_source":"next_strictly_later_lrc_tag","text":"","raw_line":"[00:00.00]"},{"id":"cue_002","time_tag":"[00:00.11]","start_ms":110,"start_seconds":0.11,"kind":"credit","end_ms":350,"end_seconds":0.35,"end_source":"next_strictly_later_lrc_tag","text":"","raw_line":"[00:00.11]"},{"id":"cue_003","time_tag":"[00:00.35]","start_ms":350,"start_seconds":0.35,"kind":"title","end_ms":10690,"end_seconds":10.69,"end_source":"next_strictly_later_lrc_tag","text":"","raw_line":"[00:00.35]"},{"id":"cue_004","time_tag":"[00:10.69]","start_ms":10690,"start_seconds":10.69,"kind":"clear","end_ms":12890,"end_seconds":12.89,"end_source":"next_strictly_later_lrc_tag","text":"","raw_line":"[00:10.69]"},{"id":"cue_005","time_tag":"[00:12.89]","start_ms":12890,"start_seconds":12.89,"kind":"clear","end_ms":16440,"end_seconds":16.44,"end_source":"next_strictly_later_lrc_tag","text":"","raw_line":"[00:12.89]"},{"id":"cue_006","time_tag":"[00:16.44]","start_ms":16440,"start_seconds":16.44,"kind":"clear","end_ms":18930,"end_seconds":18.93,"end_source":"next_strictly_later_lrc_tag","text":"","raw_line":"[00:16.44]"},{"id":"cue_007","time_tag":"[00:18.93]","start_ms":18930,"start_seconds":18.93,"kind":"lyric","end_ms":20400,"end_seconds":20.4,"end_source":"next_strictly_later_lrc_tag","text":"演示文字 示文字演示文字","raw_line":"[00:18.93]演示文字 示文字演示文字"},{"id":"cue_008","time_tag":"[00:20.40]","start_ms":20400,"start_seconds":20.4,"kind":"lyric","end_ms":22150,"end_seconds":22.15,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示文字演示文字","raw_line":"[00:20.40]演示文字演示文字演示文字"},{"id":"cue_009","time_tag":"[00:22.15]","start_ms":22150,"start_seconds":22.15,"kind":"lyric","end_ms":23650,"end_seconds":23.65,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示文字演示文","raw_line":"[00:22.15]演示文字演示文字演示文"},{"id":"cue_010","time_tag":"[00:23.65]","start_ms":23650,"start_seconds":23.65,"kind":"lyric","end_ms":24900,"end_seconds":24.9,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示文字演示文字","raw_line":"[00:23.65]演示文字演示文字演示文字"},{"id":"cue_011","time_tag":"[00:24.90]","start_ms":24900,"start_seconds":24.9,"kind":"clear","end_ms":25170,"end_seconds":25.17,"end_source":"next_strictly_later_lrc_tag","text":"","raw_line":"[00:24.90]"},{"id":"cue_012","time_tag":"[00:25.17]","start_ms":25170,"start_seconds":25.17,"kind":"lyric","end_ms":26690,"end_seconds":26.69,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示文字演 文字演","raw_line":"[00:25.17]演示文字演示文字演 文字演"},{"id":"cue_013","time_tag":"[00:26.69]","start_ms":26690,"start_seconds":26.69,"kind":"lyric","end_ms":27520,"end_seconds":27.52,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示文字演示文字","raw_line":"[00:26.69]演示文字演示文字演示文字"},{"id":"cue_014","time_tag":"[00:27.52]","start_ms":27520,"start_seconds":27.52,"kind":"lyric","end_ms":28320,"end_seconds":28.32,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示","raw_line":"[00:27.52]演示文字演示"},{"id":"cue_015","time_tag":"[00:28.32]","start_ms":28320,"start_seconds":28.32,"kind":"lyric","end_ms":29830,"end_seconds":29.83,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演 文字演示","raw_line":"[00:28.32]演示文字演 文字演示"},{"id":"cue_016","time_tag":"[00:29.83]","start_ms":29830,"start_seconds":29.83,"kind":"lyric","end_ms":33070,"end_seconds":33.07,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示文字演示文字演示文字","raw_line":"[00:29.83]演示文字演示文字演示文字演示文字"},{"id":"cue_017","time_tag":"[00:33.07]","start_ms":33070,"start_seconds":33.07,"kind":"clear","end_ms":37580,"end_seconds":37.58,"end_source":"next_strictly_later_lrc_tag","text":"","raw_line":"[00:33.07]"},{"id":"cue_018","time_tag":"[00:37.58]","start_ms":37580,"start_seconds":37.58,"kind":"lyric","end_ms":39040,"end_seconds":39.04,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示文字演示文字演","raw_line":"[00:37.58]演示文字演示文字演示文字演"},{"id":"cue_019","time_tag":"[00:39.04]","start_ms":39040,"start_seconds":39.04,"kind":"lyric","end_ms":40640,"end_seconds":40.64,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示文字演示文字演示文字","raw_line":"[00:39.04]演示文字演示文字演示文字演示文字"},{"id":"cue_020","time_tag":"[00:40.64]","start_ms":40640,"start_seconds":40.64,"kind":"lyric","end_ms":42170,"end_seconds":42.17,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示 字演示文字演示文字演","raw_line":"[00:40.64]演示文字演示 字演示文字演示文字演"},{"id":"cue_021","time_tag":"[00:42.17]","start_ms":42170,"start_seconds":42.17,"kind":"lyric","end_ms":43460,"end_seconds":43.46,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示文字演示文字演示文字","raw_line":"[00:42.17]演示文字演示文字演示文字演示文字"},{"id":"cue_022","time_tag":"[00:43.46]","start_ms":43460,"start_seconds":43.46,"kind":"clear","end_ms":43740,"end_seconds":43.74,"end_source":"next_strictly_later_lrc_tag","text":"","raw_line":"[00:43.46]"},{"id":"cue_023","time_tag":"[00:43.74]","start_ms":43740,"start_seconds":43.74,"kind":"lyric","end_ms":45240,"end_seconds":45.24,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示文字演示文字演示","raw_line":"[00:43.74]演示文字演示文字演示文字演示"},{"id":"cue_024","time_tag":"[00:45.24]","start_ms":45240,"start_seconds":45.24,"kind":"lyric","end_ms":46830,"end_seconds":46.83,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示文字演示","raw_line":"[00:45.24]演示文字演示文字演示"},{"id":"cue_025","time_tag":"[00:46.83]","start_ms":46830,"start_seconds":46.83,"kind":"lyric","end_ms":48380,"end_seconds":48.38,"end_source":"next_strictly_later_lrc_tag","text":"演示文字 示文字演","raw_line":"[00:46.83]演示文字 示文字演"},{"id":"cue_026","time_tag":"[00:48.38]","start_ms":48380,"start_seconds":48.38,"kind":"lyric","end_ms":49620,"end_seconds":49.62,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示文字演示文字演示文字演示文字","raw_line":"[00:48.38]演示文字演示文字演示文字演示文字演示文字"},{"id":"cue_027","time_tag":"[00:49.62]","start_ms":49620,"start_seconds":49.62,"kind":"clear","end_ms":49950,"end_seconds":49.95,"end_source":"next_strictly_later_lrc_tag","text":"","raw_line":"[00:49.62]"},{"id":"cue_028","time_tag":"[00:49.95]","start_ms":49950,"start_seconds":49.95,"kind":"lyric","end_ms":53040,"end_seconds":53.04,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示文字演示文字演","raw_line":"[00:49.95]演示文字演示文字演示文字演"},{"id":"cue_029","time_tag":"[00:53.04]","start_ms":53040,"start_seconds":53.04,"kind":"lyric","end_ms":57060,"end_seconds":57.06,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示文字演示文字演示文字演示文字演示","raw_line":"[00:53.04]演示文字演示文字演示文字演示文字演示文字演示"},{"id":"cue_030","time_tag":"[00:57.06]","start_ms":57060,"start_seconds":57.06,"kind":"lyric","end_ms":58950,"end_seconds":58.95,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示文字演示文字演示文","raw_line":"[00:57.06]演示文字演示文字演示文字演示文"},{"id":"cue_031","time_tag":"[00:58.95]","start_ms":58950,"start_seconds":58.95,"kind":"clear","end_ms":59240,"end_seconds":59.24,"end_source":"next_strictly_later_lrc_tag","text":"","raw_line":"[00:58.95]"},{"id":"cue_032","time_tag":"[00:59.24]","start_ms":59240,"start_seconds":59.24,"kind":"lyric","end_ms":60880,"end_seconds":60.88,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示文字演","raw_line":"[00:59.24]演示文字演示文字演"},{"id":"cue_033","time_tag":"[01:00.88]","start_ms":60880,"start_seconds":60.88,"kind":"lyric","end_ms":62200,"end_seconds":62.2,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示文字演示文字演示文字","raw_line":"[01:00.88]演示文字演示文字演示文字演示文字"},{"id":"cue_034","time_tag":"[01:02.20]","start_ms":62200,"start_seconds":62.2,"kind":"clear","end_ms":62440,"end_seconds":62.44,"end_source":"next_strictly_later_lrc_tag","text":"","raw_line":"[01:02.20]"},{"id":"cue_035","time_tag":"[01:02.44]","start_ms":62440,"start_seconds":62.44,"kind":"lyric","end_ms":65150,"end_seconds":65.15,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示文字演示文字演示","raw_line":"[01:02.44]演示文字演示文字演示文字演示"},{"id":"cue_036","time_tag":"[01:05.15]","start_ms":65150,"start_seconds":65.15,"kind":"lyric","end_ms":66520,"end_seconds":66.52,"end_source":"next_strictly_later_lrc_tag","text":"演示文100文字演示文字演","raw_line":"[01:05.15]演示文100文字演示文字演"},{"id":"cue_037","time_tag":"[01:06.52]","start_ms":66520,"start_seconds":66.52,"kind":"lyric","end_ms":69370,"end_seconds":69.37,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示文字演示文字演","raw_line":"[01:06.52]演示文字演示文字演示文字演"},{"id":"cue_038","time_tag":"[01:09.37]","start_ms":69370,"start_seconds":69.37,"kind":"lyric","end_ms":71150,"end_seconds":71.15,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示文字演示","raw_line":"[01:09.37]演示文字演示文字演示"},{"id":"cue_039","time_tag":"[01:11.15]","start_ms":71150,"start_seconds":71.15,"kind":"lyric","end_ms":73140,"end_seconds":73.14,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示文字演示文字演示","raw_line":"[01:11.15]演示文字演示文字演示文字演示"},{"id":"cue_040","time_tag":"[01:13.14]","start_ms":73140,"start_seconds":73.14,"kind":"lyric","end_ms":76220,"end_seconds":76.22,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示文字演示文字演","raw_line":"[01:13.14]演示文字演示文字演示文字演"},{"id":"cue_041","time_tag":"[01:16.22]","start_ms":76220,"start_seconds":76.22,"kind":"clear","end_ms":77830,"end_seconds":77.83,"end_source":"next_strictly_later_lrc_tag","text":"","raw_line":"[01:16.22]"},{"id":"cue_042","time_tag":"[01:17.83]","start_ms":77830,"start_seconds":77.83,"kind":"lyric","end_ms":99410,"end_seconds":99.41,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示文字演示文 演示文字演示文字演示文字","raw_line":"[01:17.83]演示文字演示文字演示文 演示文字演示文字演示文字"},{"id":"cue_043","time_tag":"[01:39.41]","start_ms":99410,"start_seconds":99.41,"kind":"clear","end_ms":105680,"end_seconds":105.68,"end_source":"next_strictly_later_lrc_tag","text":"","raw_line":"[01:39.41]"},{"id":"cue_044","time_tag":"[01:45.68]","start_ms":105680,"start_seconds":105.68,"kind":"lyric","end_ms":107250,"end_seconds":107.25,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示文字演示文","raw_line":"[01:45.68]演示文字演示文字演示文"},{"id":"cue_045","time_tag":"[01:47.25]","start_ms":107250,"start_seconds":107.25,"kind":"lyric","end_ms":108850,"end_seconds":108.85,"end_source":"next_strictly_later_lrc_tag","text":"How-to 字演示文字演示文字","raw_line":"[01:47.25]How-to 字演示文字演示文字"},{"id":"cue_046","time_tag":"[01:48.85]","start_ms":108850,"start_seconds":108.85,"kind":"lyric","end_ms":110370,"end_seconds":110.37,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示文字演示文字演示文字","raw_line":"[01:48.85]演示文字演示文字演示文字演示文字"},{"id":"cue_047","time_tag":"[01:50.37]","start_ms":110370,"start_seconds":110.37,"kind":"lyric","end_ms":111740,"end_seconds":111.74,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示文字演示文字演","raw_line":"[01:50.37]演示文字演示文字演示文字演"},{"id":"cue_048","time_tag":"[01:51.74]","start_ms":111740,"start_seconds":111.74,"kind":"clear","end_ms":111960,"end_seconds":111.96,"end_source":"next_strictly_later_lrc_tag","text":"","raw_line":"[01:51.74]"},{"id":"cue_049","time_tag":"[01:51.96]","start_ms":111960,"start_seconds":111.96,"kind":"lyric","end_ms":113350,"end_seconds":113.35,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示","raw_line":"[01:51.96]演示文字演示"},{"id":"cue_050","time_tag":"[01:53.35]","start_ms":113350,"start_seconds":113.35,"kind":"lyric","end_ms":114940,"end_seconds":114.94,"end_source":"next_strictly_later_lrc_tag","text":"演示文","raw_line":"[01:53.35]演示文"},{"id":"cue_051","time_tag":"[01:54.94]","start_ms":114940,"start_seconds":114.94,"kind":"lyric","end_ms":116560,"end_seconds":116.56,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示文字演示文字演","raw_line":"[01:54.94]演示文字演示文字演示文字演"},{"id":"cue_052","time_tag":"[01:56.56]","start_ms":116560,"start_seconds":116.56,"kind":"lyric","end_ms":119690,"end_seconds":119.69,"end_source":"next_strictly_later_lrc_tag","text":"3示文字演示文字演示文字演示文","raw_line":"[01:56.56]3示文字演示文字演示文字演示文"},{"id":"cue_053","time_tag":"[01:59.69]","start_ms":119690,"start_seconds":119.69,"kind":"clear","end_ms":124220,"end_seconds":124.22,"end_source":"next_strictly_later_lrc_tag","text":"","raw_line":"[01:59.69]"},{"id":"cue_054","time_tag":"[02:04.22]","start_ms":124220,"start_seconds":124.22,"kind":"lyric","end_ms":125770,"end_seconds":125.77,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示文字演示文字演示文","raw_line":"[02:04.22]演示文字演示文字演示文字演示文"},{"id":"cue_055","time_tag":"[02:05.77]","start_ms":125770,"start_seconds":125.77,"kind":"lyric","end_ms":127370,"end_seconds":127.37,"end_source":"next_strictly_later_lrc_tag","text":"演示文字 示文字演 文字演示文字演示","raw_line":"[02:05.77]演示文字 示文字演 文字演示文字演示"},{"id":"cue_056","time_tag":"[02:07.37]","start_ms":127370,"start_seconds":127.37,"kind":"lyric","end_ms":128900,"end_seconds":128.9,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示 字演示文字演","raw_line":"[02:07.37]演示文字演示 字演示文字演"},{"id":"cue_057","time_tag":"[02:08.90]","start_ms":128900,"start_seconds":128.9,"kind":"lyric","end_ms":130200,"end_seconds":130.2,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示文字演示文字演示文","raw_line":"[02:08.90]演示文字演示文字演示文字演示文"},{"id":"cue_058","time_tag":"[02:10.20]","start_ms":130200,"start_seconds":130.2,"kind":"clear","end_ms":130450,"end_seconds":130.45,"end_source":"next_strictly_later_lrc_tag","text":"","raw_line":"[02:10.20]"},{"id":"cue_059","time_tag":"[02:10.45]","start_ms":130450,"start_seconds":130.45,"kind":"lyric","end_ms":131920,"end_seconds":131.92,"end_source":"next_strictly_later_lrc_tag","text":"演示文 演示 字演示","raw_line":"[02:10.45]演示文 演示 字演示"},{"id":"cue_060","time_tag":"[02:11.92]","start_ms":131920,"start_seconds":131.92,"kind":"lyric","end_ms":133550,"end_seconds":133.55,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示文字演示文字","raw_line":"[02:11.92]演示文字演示文字演示文字"},{"id":"cue_061","time_tag":"[02:13.55]","start_ms":133550,"start_seconds":133.55,"kind":"lyric","end_ms":135130,"end_seconds":135.13,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示2字演示文","raw_line":"[02:13.55]演示文字演示2字演示文"},{"id":"cue_062","time_tag":"[02:15.13]","start_ms":135130,"start_seconds":135.13,"kind":"lyric","end_ms":136390,"end_seconds":136.39,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示文字演示文字演示文字演示文字","raw_line":"[02:15.13]演示文字演示文字演示文字演示文字演示文字"},{"id":"cue_063","time_tag":"[02:16.39]","start_ms":136390,"start_seconds":136.39,"kind":"clear","end_ms":136670,"end_seconds":136.67,"end_source":"next_strictly_later_lrc_tag","text":"","raw_line":"[02:16.39]"},{"id":"cue_064","time_tag":"[02:16.67]","start_ms":136670,"start_seconds":136.67,"kind":"lyric","end_ms":139720,"end_seconds":139.72,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示文字演示文字","raw_line":"[02:16.67]演示文字演示文字演示文字"},{"id":"cue_065","time_tag":"[02:19.72]","start_ms":139720,"start_seconds":139.72,"kind":"lyric","end_ms":141310,"end_seconds":141.31,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示文字演示文字演","raw_line":"[02:19.72]演示文字演示文字演示文字演"},{"id":"cue_066","time_tag":"[02:21.31]","start_ms":141310,"start_seconds":141.31,"kind":"lyric","end_ms":143720,"end_seconds":143.72,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示文字演示文","raw_line":"[02:21.31]演示文字演示文字演示文"},{"id":"cue_067","time_tag":"[02:23.72]","start_ms":143720,"start_seconds":143.72,"kind":"lyric","end_ms":145560,"end_seconds":145.56,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示文字演示文字演","raw_line":"[02:23.72]演示文字演示文字演示文字演"},{"id":"cue_068","time_tag":"[02:25.56]","start_ms":145560,"start_seconds":145.56,"kind":"clear","end_ms":145840,"end_seconds":145.84,"end_source":"next_strictly_later_lrc_tag","text":"","raw_line":"[02:25.56]"},{"id":"cue_069","time_tag":"[02:25.84]","start_ms":145840,"start_seconds":145.84,"kind":"lyric","end_ms":147590,"end_seconds":147.59,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示 字演示","raw_line":"[02:25.84]演示文字演示 字演示"},{"id":"cue_070","time_tag":"[02:27.59]","start_ms":147590,"start_seconds":147.59,"kind":"lyric","end_ms":149170,"end_seconds":149.17,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示文字演示文字演示文字","raw_line":"[02:27.59]演示文字演示文字演示文字演示文字"},{"id":"cue_071","time_tag":"[02:29.17]","start_ms":149170,"start_seconds":149.17,"kind":"clear","end_ms":149880,"end_seconds":149.88,"end_source":"next_strictly_later_lrc_tag","text":"","raw_line":"[02:29.17]"},{"id":"cue_072","time_tag":"[02:29.88]","start_ms":149880,"start_seconds":149.88,"kind":"lyric","end_ms":152630,"end_seconds":152.63,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示文字演示文字演示","raw_line":"[02:29.88]演示文字演示文字演示文字演示"},{"id":"cue_073","time_tag":"[02:32.63]","start_ms":152630,"start_seconds":152.63,"kind":"lyric","end_ms":154050,"end_seconds":154.05,"end_source":"next_strictly_later_lrc_tag","text":"演示文100文字演示文字演","raw_line":"[02:32.63]演示文100文字演示文字演"},{"id":"cue_074","time_tag":"[02:34.05]","start_ms":154050,"start_seconds":154.05,"kind":"lyric","end_ms":156820,"end_seconds":156.82,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示文字演示文字演","raw_line":"[02:34.05]演示文字演示文字演示文字演"},{"id":"cue_075","time_tag":"[02:36.82]","start_ms":156820,"start_seconds":156.82,"kind":"lyric","end_ms":158800,"end_seconds":158.8,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示文字演示","raw_line":"[02:36.82]演示文字演示文字演示"},{"id":"cue_076","time_tag":"[02:38.80]","start_ms":158800,"start_seconds":158.8,"kind":"lyric","end_ms":160590,"end_seconds":160.59,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示文字演示文字演示文字演","raw_line":"[02:38.80]演示文字演示文字演示文字演示文字演"},{"id":"cue_077","time_tag":"[02:40.59]","start_ms":160590,"start_seconds":160.59,"kind":"lyric","end_ms":161920,"end_seconds":161.92,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示文字演示文字演示文","raw_line":"[02:40.59]演示文字演示文字演示文字演示文"},{"id":"cue_078","time_tag":"[02:41.92]","start_ms":161920,"start_seconds":161.92,"kind":"clear","end_ms":162170,"end_seconds":162.17,"end_source":"next_strictly_later_lrc_tag","text":"","raw_line":"[02:41.92]"},{"id":"cue_079","time_tag":"[02:42.17]","start_ms":162170,"start_seconds":162.17,"kind":"lyric","end_ms":164900,"end_seconds":164.9,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示文字演示文字演示","raw_line":"[02:42.17]演示文字演示文字演示文字演示"},{"id":"cue_080","time_tag":"[02:44.90]","start_ms":164900,"start_seconds":164.9,"kind":"lyric","end_ms":166320,"end_seconds":166.32,"end_source":"next_strictly_later_lrc_tag","text":"演示文100文字演演示","raw_line":"[02:44.90]演示文100文字演演示"},{"id":"cue_081","time_tag":"[02:46.32]","start_ms":166320,"start_seconds":166.32,"kind":"lyric","end_ms":169090,"end_seconds":169.09,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示文字演示文字演示文字演示","raw_line":"[02:46.32]演示文字演示文字演示文字演示文字演示"},{"id":"cue_082","time_tag":"[02:49.09]","start_ms":169090,"start_seconds":169.09,"kind":"lyric","end_ms":171140,"end_seconds":171.14,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示文演示文字演","raw_line":"[02:49.09]演示文字演示文演示文字演"},{"id":"cue_083","time_tag":"[02:51.14]","start_ms":171140,"start_seconds":171.14,"kind":"lyric","end_ms":173010,"end_seconds":173.01,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示演示文字演示文字","raw_line":"[02:51.14]演示文字演示演示文字演示文字"},{"id":"cue_084","time_tag":"[02:53.01]","start_ms":173010,"start_seconds":173.01,"kind":"lyric","end_ms":177530,"end_seconds":177.53,"end_source":"next_strictly_later_lrc_tag","text":"演示文字演示文演示文字演示","raw_line":"[02:53.01]演示文字演示文演示文字演示"},{"id":"cue_085","time_tag":"[02:57.53]","start_ms":177530,"start_seconds":177.53,"kind":"clear","end_ms":187390,"end_seconds":187.39,"end_source":"next_strictly_later_lrc_tag","text":"","raw_line":"[02:57.53]"},{"id":"cue_086","time_tag":"[03:07.39]","start_ms":187390,"start_seconds":187.39,"kind":"end_marker","end_ms":null,"end_seconds":null,"end_source":"unknown","text":"","raw_line":"[03:07.39]"}]);
const sourceCueAt=t=>SOURCE_CUES.find(c=>t>=c.start_seconds&&t<c.end_seconds)??null;
function familyFor(t,cue){
 if(t>=73.14&&t<76.22||t>=158.5&&t<169)return'stars';
 if(t>=121.5&&t<124.22)return'newspaper';
 if(t>=124.22&&t<127.37)return'optical';
 if(t>=127.37&&t<133.55)return'city';
 const s=cue?.text??'';if(/携帯|ガラケー|电话|暗证/.test(s))return'signal';if(/マカロン|キャラメル/.test(s))return'concentric';if(/东京|五反田/.test(s))return'city';
 if(t>=53.04&&t<77.83||t>=143.72&&t<177.53)return'rays';if(/崩|吐|交渉|妄想|感染/.test(s))return'shards';if(t>=105.68)return'blueprint';return'archive';
}
function fullMode(cue,t,index){
 if(t<18.5)return'full-intro';if(t>=179)return'full-outro';if(t>=75&&t<76.22)return'solar-outer';if(t>=168.5&&t<169)return'solar-escape';
 if(cue?.id==='cue_042')return'full-phone';if(t>=76.22&&t<105.68)return'full-interlude';if(cue?.kind!=='lyric')return'full-break';
 const s=cue.text;if(/マカロン/.test(s))return'full-macaron';if(/携帯|ガラケー|电话|暗证/.test(s))return'full-phone';if(/东京|五反田/.test(s))return'full-city';if(/キャラメル/.test(s))return'full-coffee';if(/How-to|弁护士/.test(s))return'full-book';if(/感染/.test(s))return'full-virus';if(/尻尾|子犬|求めて/.test(s))return'full-reject';if(/麻縄|缚/.test(s))return'full-binding';return'full-text';
}
function buildFullTimeline(){
 const out=[],locked=REVIEW_POSES.slice().sort((a,b)=>a.start-b.start);let cursor=0,serial=0;
 function fill(a,b){if(b-a<1e-7)return;const cuts=[a,...SOURCE_CUES.filter(q=>q.start_seconds>a+1e-7&&q.start_seconds<b-1e-7).map(q=>q.start_seconds),b];
  for(let z=0;z<cuts.length-1;z++){const lo=cuts[z],hi=cuts[z+1],cue=sourceCueAt((lo+hi)/2),length=hi-lo,count=Math.max(1,Math.ceil(length/(cue?.id==='cue_042'?1.25:cue?.kind==='lyric'?1.05:1.35)));
   for(let j=0;j<count;j++){const start=lo+length*j/count,end=lo+length*(j+1)/count,mid=(start+end)/2,id=`A${String(++serial).padStart(3,'0')}`,mode=fullMode(cue,mid,j),hero=(mode==='full-intro'&&mid>3&&mid<5.6)||(mode==='full-outro'&&mid<182)||(cue?.id==='cue_015'&&j===0);out.push({id,clip:mid<18.5?'intro':mid>=179?'outro':mid<105.68?'full-verse-one':'full-verse-two',start,end,mode,index:j,label:mode,characters:hero?'bonnie':null,characterVisible:hero,avatarCharacters:[],dominant:'text',motion:'glyph-blur-motion',cueId:cue?.id??null,backgroundFamily:familyFor(mid,cue),entryDirection:['left','up','right','down'][(serial+j)%4],view:j%4})}
  }
 }
 for(const p of locked){fill(cursor,p.start);const cue=sourceCueAt((p.start+p.end)/2);out.push({...p,cueId:cue?.id??null,backgroundFamily:familyFor((p.start+p.end)/2,cue),entryDirection:['left','up','right','down'][out.length%4],view:p.index%4});cursor=p.end}fill(cursor,FULL_DURATION);
 return out.sort((a,b)=>a.start-b.start).map(p=>Object.freeze(p));
}
const V05_SEGMENTS=[[0,2.2,"intro-lens"],[2.2,10.69,"intro-title"],[10.69,16.44,"intro-optic"],[16.44,18.93,"intro-document"],[18.93,22.15,"phone-bubbles"],[22.15,25.17,"head-investigation"],[25.17,26.69,"swimsuit"],[26.69,27.52,"type-burst"],[27.52,28.32,"windows"],[28.32,29.83,"face-collapse"],[29.83,33.07,"macaron"],[33.07,37.58,"cabinet"],[37.58,40.64,"portrait-vertical"],[40.64,43.74,"portrait-chat"],[43.74,45.24,"document-reveal"],[45.24,46.35,"interview"],[46.35,48.38,"phone-drop"],[48.38,49.95,"nerves"],[49.95,55.72,"phone-push"],[55.72,59.24,"document-chorus"],[59.24,60.88,"flower-profiles"],[60.88,62.44,"head-duo"],[62.44,63.22,"kana-turn"],[63.22,63.95,"duo-portraits"],[63.95,65.15,"duo-upper"],[65.15,68.78,"year-scene"],[68.78,69.37,"year-reentry"],[69.37,71.15,"duo-hug"],[71.15,73.14,"overload"],[73.14,76.22,"solar-continuous"],[76.22,77.83,"instrumental-optic"],[77.83,89.6,"phone-long"],[89.6,96.2,"phone-detail"],[96.2,99.41,"phone-paper"],[99.41,105.68,"expressions"],[105.68,107.25,"document-law"],[107.25,108.85,"document-how"],[108.85,110.37,"coffee"],[110.37,111.96,"city"],[111.96,113.35,"idol"],[113.35,114.94,"festival"],[114.94,116.56,"makeup"],[116.56,119.69,"macaron"],[119.69,121.1,"pixel"],[121.1,121.5,"investigation-lens"],[121.5,124.22,"newspaper"],[124.22,127.37,"magnifier-words"],[127.37,130.45,"chat-continuous"],[130.45,131.43,"gotanda-words"],[131.43,131.92,"gotanda"],[131.92,133.55,"virus"],[133.55,135.13,"device-swap"],[135.13,136.67,"password"],[136.67,139.72,"beckon"],[139.72,141.31,"dog"],[141.31,143.25,"rejection"],[143.25,145.84,"rope"],[145.84,146.55,"avatar"],[146.55,147.59,"pillow"],[147.59,148.52,"head-duo"],[148.52,149.88,"transition-lines"],[149.88,150.63,"kana-turn"],[150.63,151.35,"duo-portraits"],[151.35,152.63,"duo-upper"],[152.63,156.05,"year-scene"],[156.05,156.82,"year-reentry"],[156.82,158.8,"single-hug"],[158.8,160.59,"overload"],[160.59,161.883,"solar-continuous"],[161.883,175.2,"document-long"],[175.2,177.53,"solar-final"],[177.53,187.39,"outro"],[187.39,191.58333333333334,"credits"]];
export const CAMERA_POSES=Object.freeze(V05_SEGMENTS.map(([start,end,mode],index)=>Object.freeze({id:'P'+String(index+1).padStart(3,'0'),start,end,mode,index,clip:'full-v11',label:mode,motion:'continuous-scene',characters:null,avatarCharacters:[],sceneStart:start,sceneEnd:end,entryDirection:['left','up','right','down'][index%4]})));
export const fullTimelinePlan=Object.freeze({duration:FULL_DURATION,source:'approved V11 display cues; original LRC separately preserved',cueCount:86,lyricCueCount:63,poses:CAMERA_POSES,revision:'V11-001 to V11-010; inherited V10 final cut and earlier authorized revisions',specialRanges:{newspaper:[121.5,124.22],magnifier:[124.22,127.37],chat:[127.37,130.45],gotanda:[131.43,133.55],singleHug:[156.82,158.8],multipleFinalFiles:[161.883,175.2],finalSolar:[175.2,177.53]},wordTiming:'Cue boundaries use LRC; intra-cue visual timing uses local original-PV image sequences, not claimed phoneme alignment.'});

const nominalHeroSeconds=CAMERA_POSES.reduce((n,p)=>n+(p.characters?p.end-p.start:0),0);
export const CHARACTER_EXPOSURE=Object.freeze({protagonist:'BONNIE',userAuthorizedDuoChoreography:true,fullSeconds:FULL_DURATION,method:'Exporter measures actual character and avatar material markers per frame.'});
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const pAt=(t,a,b)=>clamp((t-a)/Math.max(.001,b-a));
const seg=new Intl.Segmenter('ja',{granularity:'grapheme'});
const chars=s=>[...seg.segment(String(s))].map(a=>a.segment);
export const poseAt=t=>CAMERA_POSES.find(s=>t>=s.start&&t<s.end)??null;

// Alpha is tied to the original cue, not the current shot. A cut cannot restart
// a line's reveal. At cue.end every glyph is zero; a new cue enters that frame.
export function glyphEnvelope(cue,t,index,count){
 if(!cue||t<cue.start_seconds||t>=cue.end_seconds)return{alpha:0,enter:0,exit:1};
 const duration=cue.end_seconds-cue.start_seconds,age=t-cue.start_seconds,remaining=cue.end_seconds-t;
 const reveal=Math.min(duration*.37,Math.max(.24,Math.min(1.15,count*.032))),delay=reveal*(index/Math.max(1,count-1)),enter=out((age+1/60-delay)/.14);
 const tail=Math.min(.30,Math.max(.20,duration*.23)),stagger=(index%4)*.012,exit=clamp((tail+stagger-remaining)/tail);
 return{alpha:enter*(1-exit),enter,exit,blur:8*Math.max(1-enter,exit),phase:enter<.995?'enter':exit>0?'exit':'read'};
}
export function lyricEnvelopeAt(t,cueAt){const cue=cueAt(t);if(!cue)return{cueId:null,alphas:[],text:''};const g=chars(cue.text.trim());return{cueId:cue.id,text:cue.text,alphas:g.map((_,i)=>glyphEnvelope(cue,t,i,g.length).alpha),cueEnd:cue.end_seconds,tailSeconds:Math.min(.30,Math.max(.20,(cue.end_seconds-cue.start_seconds)*.23))}}

function wrap(c,text,width,fontSize,font,limit=3){
 c.font=`700 ${fontSize}px ${font}`;const all=chars(text),lines=[];let line='',n=0;
 for(const ch of all){if(ch===' '&&line.length===0){n++;continue}if(line&&c.measureText(line+ch).width>width&&lines.length<limit-1){lines.push(line);line=''}line+=ch;n++}if(line)lines.push(line);
 // Keep a final kana from becoming a one-glyph orphan on a broad front plane.
 for(let i=lines.length-1;i>0;i--){let a=chars(lines[i-1]),b=chars(lines[i]);while(a.length>2&&b.length<a.length*.66){const ch=a[a.length-1],next=ch+b.join('');if(c.measureText(next).width>width)break;a.pop();b.unshift(ch)}lines[i-1]=a.join('');lines[i]=b.join('')}
 return lines;
}
const planeFitCache=new Map();
const framePlaneDiagnostics=[];
const frameElements=new Set();
const MOTIFS={cue_007:['question','自问与调查'],cue_008:['fracture','挫伤暗礁：断裂字形'],cue_009:['head','前头叶：邦妮头影'],cue_010:['information','信息偏差：纸片'],cue_012:['convergence','收束失败：交错纸框'],cue_013:['discharge','吐露与喷溅'],cue_014:['debug','妄想调试：切片重组'],cue_029:['desire','凹凸摩擦：交错字面'],cue_030:['impact','击打：大字墨击'],cue_032:['flower','红华：墨花'],cue_033:['explosion','脑浆炸裂：爆字'],cue_035:['dance','狂舞：旋转'],cue_070:['explosion','脑浆炸裂：爆字'],cue_072:['dance','狂舞：旋转'],cue_073:['hundred','百年以后：100年档案'],cue_074:['collapse','终将死去：文字坍缩'],cue_075:['hug','拥抱：邦妮剪影'],cue_082:['old-body','旧身体：重复轮廓'],cue_083:['intense','激烈脑汁：爆字墨迹'],cue_084:['moon','月的彼端：月相与远退'],cue_057:['chat','推文：聊天记录']};
export function semanticFocusAt(t,E){const cue=E.cueAt(t),a=MOTIFS[cue?.id]??[cue?.text.trim()?'evidence':'clear',cue?.text.trim()?'歌词与证据文字':'无歌词：报纸与城市装饰'];return{cueId:cue?.id??null,sourceText:cue?.text??'',motif:a[0],meaning:a[1]}}
Object.assign(MOTIFS,{cue_036:['hundred','百年以后：2026→2126'],cue_037:['collapse','终将死去：年号退成背景'],cue_038:['hug','拥抱：环抱文字'],cue_039:['intense','激烈脑汁：墨击'],cue_040:['moon','月的彼端：太阳系穿行'],cue_076:['intense','脑内麻药：太阳近景与文字'],cue_077:['cosmos','宇宙彼端：逐字轨道与八行星'],cue_079:['dance','狂舞：轨道阶梯转向'],cue_080:['hundred','百年以后：星历'],cue_081:['rebirth','重生：向星空远退']});
export function yearAt(t){const range=[[65.15,69.37],[152.63,156.82]].find(([a,b])=>t>=a&&t<b);if(!range)return null;const[start,end]=range,growthStart=start+.30,growthEnd=start+3.30,progress=clamp((t-growthStart)/3),move=inOut((t-start-1.60)/.32),retire=inOut((t-start-3.25)/.12),phase=t<start+1.60?'focus':t<start+1.92?'move':'background',layer=phase==='focus'?'foreground':'background',opacity=lerp(1,.14,move)*(1-retire),blur=8*move+18*retire;return{from:2026,to:2126,value:t>=growthEnd?2126:2026+Math.floor(progress*100+1e-9),phase,layer,progress,x:lerp(960,1120,move),y:lerp(430,790,move),fontSize:lerp(400,660,move),foreground:layer==='foreground',background:layer==='background',start,end,growthStart,growthEnd,opacity,blur,visible:opacity>.003,reference:'04_KEYFRAMES/full_v07/year_reference/reference_findings.json'}}
function drawYear(c,t,E,{dark=false}={}){const y=yearAt(t);if(!y?.visible)return;c.save();c.globalAlpha*=y.opacity;c.filter=y.blur>.05?`blur(${y.blur}px)`:'none';E.text(c,String(y.value),y.x,y.y,y.fontSize,dark?E.PAPER:E.INK,{font:E.MONO,weight:700,align:'center'});c.restore();frameElements.add('year:2026-2126');if(y.background)frameElements.add('year:blurred-low-contrast-background')}
function unionBounds(boxes){return{left:Math.min(...boxes.map(b=>b.left)),top:Math.min(...boxes.map(b=>b.top)),right:Math.max(...boxes.map(b=>b.right)),bottom:Math.max(...boxes.map(b=>b.bottom))}}
function fitPlaneGlyphs(q,phrase,{sw,sh,font,maxSize,vertical,halo,outline,ghost,arrangement='standard',outlineWidth=1.3}){
 const key=JSON.stringify([phrase,sw,sh,font,maxSize,vertical,halo,outline,ghost,arrangement,outlineWidth]);if(planeFitCache.has(key))return planeFitCache.get(key);
 const all=chars(phrase),N=all.length,padding=52; // 40px edge + 12px extra safety.
 const measure=(ch,size)=>{const m=q.measureText(ch);return{advance:m.width,left:m.actualBoundingBoxLeft??0,right:m.actualBoundingBoxRight??m.width,ascent:m.actualBoundingBoxAscent??size*.9,descent:m.actualBoundingBoxDescent??size*.2}};
 function candidate(size){
  q.font=`700 ${size}px ${font}`;const stroke=Math.max(halo?Math.max(3,size*.045)/2:0,outline?outlineWidth/2:0),rotation=size*.04+1;
  // Covers all existing entry/exit offsets, 2 ghost echoes and glyph rotation.
  const scatterSafe=arrangement==='scatter'?55:0,extra={left:64+stroke+rotation+scatterSafe,right:72+stroke+rotation+scatterSafe,top:64+stroke+rotation+scatterSafe,bottom:72+stroke+rotation+scatterSafe};
  const width=sw-padding*2-extra.left-extra.right,points=[];let lineCount=0;
  if(arrangement==='line'){
   let xx=0;all.forEach((ch,i)=>{const m=measure(ch,size);points.push({ch,index:i,x:xx,y:0,size,metrics:m});xx+=m.advance});lineCount=1;
  }else if(arrangement==='corner'){
   const top=Math.min(9,Math.ceil(N*.52));let xx=0;all.forEach((ch,i)=>{const m=measure(ch,size);if(i<top){points.push({ch,index:i,x:xx,y:0,size,metrics:m});xx+=m.advance}else{const j=i-top,rows=6,column=Math.floor(j/rows),row=j%rows;points.push({ch,index:i,x:Math.max(size,xx-size)-column*size*1.3,y:(row+1)*size*1.28,size,metrics:m})}});lineCount=1+Math.min(6,N-top);
  }else if(arrangement==='columns'){
   const columns=N>17?4:3,rows=Math.ceil(N/columns);all.forEach((ch,i)=>{points.push({ch,index:i,x:(columns-1-Math.floor(i/rows))*size*1.52,y:(i%rows)*size*1.35,size,metrics:measure(ch,size)})});lineCount=rows;
  }else if(arrangement==='arc'){
   const radius=Math.max(2.8,N*.33)*size;all.forEach((ch,i)=>{const a=lerp(-Math.PI+.14,-.14,i/Math.max(1,N-1));points.push({ch,index:i,x:Math.cos(a)*radius,y:Math.sin(a)*radius*.57,size,metrics:measure(ch,size)})});lineCount=1;
  }else if(arrangement==='stair'||arrangement==='scatter'){
   const rows=arrangement==='scatter'?2:N>10?3:2,n=Math.ceil(N/rows);for(let row=0;row<rows;row++){let xx=(arrangement==='stair'?row*1.35:row%2?.8:-.15)*size;for(let j=0;j<n;j++){const i=row*n+j;if(i>=N)break;const ch=all[i],m=measure(ch,size);points.push({ch,index:i,x:xx,y:row*size*(arrangement==='stair'?1.48:1.8)+(arrangement==='scatter'?(i%3-1)*size*.09:0),size,metrics:m});xx+=m.advance}}lineCount=rows;
  }else if(vertical){
   const columns=Math.max(1,Math.ceil(N/10)),rows=Math.ceil(N/columns),step=size*1.24,columnStep=size*1.5;lineCount=rows;
   all.forEach((ch,i)=>{const column=Math.floor(i/rows),row=i%rows;points.push({ch,index:i,x:(columns-1-column)*columnStep,y:row*step,size,metrics:measure(ch,size)})});
  }else{
   // Re-wrap for EVERY candidate. A one-line estimate may actually wrap twice.
   const lines=wrap(q,phrase,Math.max(1,width),size,font,3);lineCount=lines.length;let index=0;
   lines.forEach((line,row)=>{let xx=0;for(const ch of chars(line)){while(index<N&&all[index]!==ch&&/\s/u.test(all[index]))index++;const metrics=measure(ch,size);points.push({ch,index,x:xx,y:row*size*1.34,size,metrics});xx+=metrics.advance;index++}});
  }
  const boxes=points.filter(g=>g.metrics.ascent+g.metrics.descent>0).map(g=>({left:g.x-g.metrics.left,top:g.y-g.metrics.ascent,right:g.x+g.metrics.right,bottom:g.y+g.metrics.descent}));
  const bounds=boxes.length?unionBounds(boxes):{left:0,top:0,right:0,bottom:0};
  const actualW=bounds.right-bounds.left+extra.left+extra.right,actualH=bounds.bottom-bounds.top+extra.top+extra.bottom;
  return{points,size,lineCount,bounds,extra,actualW,actualH,fits:actualW<=sw-padding*2&&actualH<=sh-padding*2};
 }
 // Actual measured glyph height and ACTUAL wrap count determine convergence.
 let low=1,high=maxSize,best=candidate(low);for(let i=0;i<23;i++){const mid=(low+high)/2,test=candidate(mid);if(test.fits){best=test;low=mid}else high=mid}
 if(!best.fits)throw new Error(`Typography cannot fit ${sw}×${sh} with safe padding`);
 const xOffset=padding+best.extra.left-best.bounds.left+(vertical?(sw-padding*2-best.actualW)/2:0),yOffset=padding+best.extra.top-best.bounds.top+(sh-padding*2-best.actualH)/2;
 best.points.forEach(g=>{g.x+=xOffset;g.y+=yOffset});
 best.nominalBounds={left:best.bounds.left+xOffset,top:best.bounds.top+yOffset,right:best.bounds.right+xOffset,bottom:best.bounds.bottom+yOffset};
 best.motionSafeBounds={left:best.nominalBounds.left-best.extra.left,top:best.nominalBounds.top-best.extra.top,right:best.nominalBounds.right+best.extra.right,bottom:best.nominalBounds.bottom+best.extra.bottom};
 const result={...best,padding,textureWidth:sw,textureHeight:sh,arrangement};planeFitCache.set(key,result);if(planeFitCache.size>160)planeFitCache.delete(planeFitCache.keys().next().value);return result;
}
function glyphShift(g,e,t,N,arrangement){const direction=poseAt(t)?.entryDirection??'left',sign=direction==='left'||direction==='up'?-1:1,v=direction==='up'||direction==='down',travel=(1-e.enter)*32+e.exit*40;let dx=v?0:travel*sign,dy=v?travel*sign:0;if(arrangement==='scatter'){const a=hash(g.index*17+N*3)*Math.PI*2,r=(1-e.enter)*70+e.exit*42;dx+=Math.cos(a)*r;dy+=Math.sin(a)*r}return{dx,dy,direction,sign,verticalMotion:v}}
function glyphBoxesAt(fit,cue,t,N,{halo,outline,ghost,outlineWidth=1.3}){
 const direction=poseAt(t)?.entryDirection??'left',sign=direction==='left'||direction==='up'?-1:1,v=direction==='up'||direction==='down';
 return fit.points.filter(g=>g.metrics.ascent+g.metrics.descent>0).map(g=>{const e=glyphEnvelope(cue,t,g.index,N),{dx,dy}=glyphShift(g,e,t,N,fit.arrangement),angle=e.exit*(g.index%2?-.028:.028),cs=Math.cos(angle),sn=Math.sin(angle),m=g.metrics,stroke=Math.max(halo?Math.max(3,g.size*.045)/2:0,outline?outlineWidth/2:0)+(e.blur??0)*1.3*3;
  const corners=[[-m.left,-m.ascent],[m.right,-m.ascent],[m.right,m.descent],[-m.left,m.descent]].map(([x,y])=>[g.x+dx+x*cs-y*sn,g.y+dy+x*sn+y*cs]);
  const box={index:g.index,char:g.ch,left:Math.min(...corners.map(p=>p[0]))-stroke,top:Math.min(...corners.map(p=>p[1]))-stroke,right:Math.max(...corners.map(p=>p[0]))+stroke,bottom:Math.max(...corners.map(p=>p[1]))+stroke,alpha:e.alpha};
  if(ghost&&(e.exit>0||e.enter<.995)){if(v){box.top-=20;box.bottom+=20}else{box.left-=20;box.right+=20}}return box;
 });
}
function planeText(c,t,E,{
 key='primary',role='main',text=null,alpha=1,x=550,y=530,w=1000,h=600,yaw=0,pitch=0,roll=0,z=0,
 color=E.INK,font=E.JP,maxSize=152,vertical=false,burst=false,outline=false,ghost=true,halo=false,mixed=false,arrangement='standard',carrierLocked=false,
 }={}){
 alpha=clamp(alpha); // Fade only once, after projecting the transparent plane.
 const cue=E.cueAt(t);if(!cue||!cue.text.trim())return null;const phrase=(text??cue.text).trim(),all=chars(phrase),N=all.length;
 const textureScale=arrangement!=='standard'||role==='focus'&&ordinaryMode(poseAt(t))?2:1,sh=textureScale*(vertical?Math.max(1100,Math.ceil(280*h/w)):Math.max(320,Math.round(1280*h/w))),sw=Math.round(sh*w/h),[layer,q]=E.scratch(`v05-lyric-${key}`,sw,sh);
 const outlineWidth=ordinaryMode(poseAt(t))?4:1.3,fit=fitPlaneGlyphs(q,phrase,{sw,sh,font,maxSize:maxSize*(vertical?sh/1100:sw/1280),vertical,halo,outline,ghost,arrangement,outlineWidth}),points=fit.points,glyphBoxes=glyphBoxesAt(fit,cue,t,N,{halo,outline,ghost,outlineWidth});
 framePlaneDiagnostics.push({role,text:phrase,cueId:cue.id,poseId:poseAt(t)?.id,arrangement,textureWidth:sw,textureHeight:sh,fontSize:fit.size,lineCount:fit.lineCount,padding:fit.padding,nominalBounds:fit.nominalBounds,motionSafeBounds:fit.motionSafeBounds,glyphBoxes,allGlyphsInsideTexture:glyphBoxes.every(b=>b.left>=0&&b.top>=0&&b.right<=sw&&b.bottom<=sh),allMotionInsidePadding:fit.motionSafeBounds.left>=fit.padding-1e-6&&fit.motionSafeBounds.top>=fit.padding-1e-6&&fit.motionSafeBounds.right<=sw-fit.padding+1e-6&&fit.motionSafeBounds.bottom<=sh-fit.padding+1e-6});
 const direction=poseAt(t)?.entryDirection??'left',sign=direction==='left'||direction==='up'?-1:1,verticalMotion=direction==='up'||direction==='down';
 for(const g of points){const e=glyphEnvelope(cue,t,g.index,N);if(e.alpha<=0)continue;const{dx,dy}=carrierLocked?{dx:0,dy:0}:glyphShift(g,e,t,N,arrangement);
  const small=mixed&&!/\p{Script=Han}/u.test(g.ch),glyphScale=small?.60:1,baseline=small?g.size*(.08+(g.index%3)*.045):0;
  q.save();q.font=`700 ${g.size*glyphScale}px ${font}`;q.textBaseline='alphabetic';q.fillStyle=color;q.strokeStyle=color;q.lineWidth=outline?outlineWidth:0;
  const blur=(e.blur??0)*1.3;q.filter=blur>.05?`blur(${blur.toFixed(3)}px)`:'none';
  if(ghost&&(e.exit>0||e.enter<.995)){q.globalAlpha=e.alpha*Math.max(e.exit,1-e.enter)*.055;for(let j=1;j<=5;j++)q.fillText(g.ch,g.x+dx-(verticalMotion?0:sign*j*4),g.y+dy-(verticalMotion?sign*j*4:0));frameElements.add('typography:v11-short-directional-shutter')}
  q.globalAlpha=e.alpha;q.translate(g.x+dx,g.y+dy+baseline);q.rotate(carrierLocked?0:e.exit*(g.index%2?-.028:.028));if(halo){q.strokeStyle=color===E.PAPER?E.INK:E.PAPER;q.lineWidth=Math.max(3,g.size*glyphScale*.045);q.lineJoin='round';q.strokeText(g.ch,0,0);q.strokeStyle=color}if(outline)q.strokeText(g.ch,0,0);else q.fillText(g.ch,0,0);q.restore();
 }
 const age=t-cue.start_seconds,remaining=cue.end_seconds-t,scale=burst?1+.33*(1-out(age/.16)):1,leave=carrierLocked?0:out((.23-remaining)/.23),advance=burst?leave*260:leave*75;
 const rig={x:x+leave*46,y:y-leave*19,w:w*scale,h:h*scale,yaw,pitch,roll,z:z+advance};
 const motif=semanticFocusAt(t,E).motif,p=clamp(age/Math.max(.01,cue.end_seconds-cue.start_seconds));
 if(role==='main'&&motif==='fracture'){q.save();q.globalCompositeOperation='destination-out';q.fillRect(0,sh*.43,sw,3);q.fillRect(0,sh*.69,sw,2);q.restore()}
 if(role==='main'&&['impact','explosion','intense'].includes(motif)){const hit=Math.exp(-age*15),k=1+hit*.15;rig.x+=Math.sin(age*65)*hit*24;rig.w*=k;rig.h*=k}
 if(!carrierLocked&&motif==='dance')rig.roll+=Math.sin(age*3.6)*.115;
 if(!carrierLocked&&role==='main'&&motif==='collapse'){const fall=p**3,k=1-fall*.16;rig.w*=k;rig.h*=k;rig.y+=fall*68;rig.roll+=fall*.12;rig.z+=fall*230}
 if(!carrierLocked&&role==='main'&&motif==='moon'){rig.z+=p*750;rig.y-=p*65}
 const strong=Math.abs(yaw)>.29||Math.abs(pitch)>.29;projectPlane(c,layer,cameraQuad(rig),{alpha});return{cue:cue.id,quad:cameraQuad(rig),glyphCount:N};
}

// A wider camera envelope is intentional in V03. Geometry remains in front of
// the near plane; a character bitmap is never passed to this function.
export function cameraQuad({x=960,y=540,w=1400,h=700,yaw=0,pitch=0,roll=0,z=0,focal=2400}={}){
 yaw=clamp(yaw,-1.54,1.54);pitch=clamp(pitch,-1.48,1.48);
 const cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch),cr=Math.cos(roll),sr=Math.sin(roll);
 return[[-.5,-.5],[.5,-.5],[.5,.5],[-.5,.5]].map(([u,v])=>{const xx=u*w,yy=v*h,rx=xx*cy,zz=-xx*sy,ry=yy*cp-zz*sp,rz=yy*sp+zz*cp,depth=focal+z+rz;if(!Number.isFinite(depth)||depth<450)throw new Error('V03 typography near-plane limit');const k=focal/depth;return[x+(rx*cr-ry*sr)*k,y+(rx*sr+ry*cr)*k]});
}
const hash=n=>{n=Math.imul((n|0)^0x68bc21eb,0x45d9f3b);n=Math.imul(n^(n>>>16),0x45d9f3b);return((n^(n>>>16))>>>0)/4294967296};
const mod=(n,m)=>((n%m)+m)%m;
const tiny=(c,s,x,y,E,{color=E.INK,size=15,alpha=1,align='left',rotate=0}={})=>E.text(c,s,x,y,size,color,{font:E.MONO,weight:400,alpha:1,align,rotate,spacing:align==='right'?0:1.2});
function trackCornerInk(c,kind,result){
 if(kind!=='ink'||result?.inkPlacement!=='corner'||c.canvas.width!==1920||c.canvas.height!==1080)return;
 const groups=result.inkGroups??[];V05_SCENE_INFO.cornerInkGroups=[...(V05_SCENE_INFO.cornerInkGroups??[]),...groups.map(g=>({...g,insideActivePicture:g.bounds.left>=0&&g.bounds.top>=90&&g.bounds.right<=1920&&g.bounds.bottom<=960}))];
 if(groups.length)frameElements.add('ink:v11-complete-groups-inside-active-picture');
}
function prop(c,t,E,kind,box,options={}){const pose=poseAt(t),semanticPhone=/携帯|ガラケー|电话|暗证|ツイート/.test(E.cueAt(t)?.text??'')||pose?.mode==='full-interlude';if(['flip-phone','smartphone','cable'].includes(kind)&&pose?.clip!=='newspaper-city'&&!options.screenAsset&&!semanticPhone)return{drawn:false,elements:[]};if(options.screenAsset)box=[1510,490,385,510];const[x,y,w,h]=box,result=renderPropsV03(c,t,{kind,x,y,w,h,start:pose?.start??t,ink:E.INK,paper:E.PAPER,red:E.RED,...options,alpha:options.alpha??1});trackCornerInk(c,kind,result);if(result?.drawn!==false){frameElements.add(`prop:${kind}`);for(const item of result?.elements??[]){frameElements.add(item);if(item.startsWith('NEWSPAPER_ICON')||item.startsWith('CHIBI_'))frameElements.add('asset:'+item)}}return result}
function line(c,E,x,y,xx,yy,color,width=1,alpha=1){E.rule(c,x,y,xx,yy,color,width,1)}
function arrow(c,E,x,y,xx,yy,color,width=5){line(c,E,x,y,xx,yy,color,width);const a=Math.atan2(yy-y,xx-x),r=24;c.save();c.fillStyle=color;c.beginPath();c.moveTo(xx,yy);c.lineTo(xx-r*Math.cos(a-.45),yy-r*Math.sin(a-.45));c.lineTo(xx-r*Math.cos(a+.45),yy-r*Math.sin(a+.45));c.closePath();c.fill();c.restore()}
function focusWord(cue,index){if(!cue?.text.trim())return'';const g=chars(cue.text.trim()),words=cue.text.trim().split(/[\s、，。,／/]+/u).filter(Boolean);if(words.length>1)return words[index%words.length];const size=g.length>15?4:Math.max(2,Math.min(4,Math.ceil(g.length/3))),start=(index*size)%Math.max(1,g.length-size+1);return g.slice(start,start+size).join('')}
function cueVisibility(cue,t){if(!cue?.text.trim())return 1;const g=chars(cue.text.trim());return g.reduce((sum,_,i)=>sum+glyphEnvelope(cue,t,i,g.length).alpha,0)/Math.max(1,g.length)}
function cityLayer(c,t,E,pose,u,{dark=false,y=310,h=790,near=true}={}){
 if(pose.clip!=='newspaper-city'&&semanticFocusAt(t,E).motif!=='information')return;
 const pan=(pose.index%2?1:-1)*(u-.5)*155;
 c.save();c.globalAlpha=1;
 if(E.hasAsset('CITY_TOKYO')){frameElements.add('asset:CITY_TOKYO');E.art(c,'CITY_TOKYO',[-120+pan,y-120,2160,h+240],{mode:dark?'posterWhite':'posterInk',alignY:'top'})}
 else prop(c,t,E,'city',[-90+pan,y,2100,h],{drawTower:true,layer:'all',ink:dark?E.PAPER:E.INK,paper:dark?E.INK:E.PAPER});
 c.restore();
 prop(c,t,E,'city',[-80-pan*.5,560,2100,590],{drawTower:false,layer:near?'near':'far',ink:dark?E.PAPER:E.INK,paper:dark?E.INK:E.PAPER,alpha:1});
}
export function cueLayoutAt(cue){
 const chosen={cue_015:'diagonal',cue_016:'arc',cue_018:'stair',cue_019:'scatter',cue_020:'arc',cue_021:'edge',cue_023:'corner',cue_024:'diagonal',cue_026:'columns',cue_028:'scatter',cue_044:'corner',cue_045:'columns',cue_046:'arc',cue_047:'edge',cue_049:'columns',cue_050:'stair',cue_051:'scatter',cue_052:'arc',cue_064:'arc',cue_065:'edge',cue_066:'diagonal',cue_067:'corner',cue_069:'columns'};
 return chosen[cue?.id]??['corner','diagonal','columns','scatter','edge','stair'][Number(cue?.id?.slice(4)??0)%6];
}
function ordinaryMode(pose){return pose.mode.startsWith('full-')&&!['full-intro','full-outro','full-phone','full-break','full-interlude'].includes(pose.mode)}
function ordinaryDetails(c,t,E,pose,u,fg,bg){
 const cue=E.cueAt(t),n=Number(cue?.id.slice(4)??0),kind=n%5;
 if(kind===0){
  for(const side of[0,1])for(let j=0;j<5;j++){const x=side?1710+j*45:15+j*45,h=470+hash(n+j)*220;c.save();c.translate(x,880);c.rotate((side?1:-1)*(.018+j*.009));c.strokeStyle=fg;c.lineWidth=3;c.strokeRect(0,-h,37,h);line(c,E,3,-h+40,34,-h+40,fg,2);line(c,E,4,-60,33,-60,fg,2);c.restore()}line(c,E,0,890,350,890,fg,5);line(c,E,1570,890,1920,890,fg,5);frameElements.add('background:archive-spines');
 }else if(kind===1){
  const a=[[80,200],[350,145],[1740,150],[1850,790],[1480,900],[180,865]];for(let i=0;i<a.length;i++){const[x,y]=a[i],[xx,yy]=a[(i+1)%a.length];line(c,E,x,y,xx,yy,fg,i%2?2:3);E.circle(c,x,y,12,fg,3);E.circle(c,x,y,4,fg,0)}frameElements.add('background:evidence-connections');
 }else if(kind===2){
  for(const x of[190,960,1730]){E.circle(c,x,150,21,fg,2);E.circle(c,x,150,8,fg,0)}for(let i=0;i<24;i++){const x=60+i*78,y=913+hash(i+n)*12;line(c,E,x,y,x+38,y-3,fg,2)}c.save();c.strokeStyle=fg;c.lineWidth=4;c.beginPath();c.moveTo(45,185);c.lineTo(45,870);c.lineTo(180,930);c.moveTo(1875,185);c.lineTo(1875,870);c.lineTo(1740,930);c.stroke();c.restore();frameElements.add('background:punched-paper');
 }else if(kind===3){
  for(const side of[0,1]){const x=side?1600:0,sign=side?-1:1;for(let j=0;j<4;j++){const xx=x+sign*j*62,top=190+j*55;line(c,E,xx,top,xx,930,fg,2);line(c,E,xx,top,xx+sign*180,top+45,fg,3);for(let k=0;k<5;k++)line(c,E,xx,top+90+k*100,xx+sign*180,top+135+k*100,fg,1.5)}}frameElements.add('background:architectural-lines');
 }else{
  for(let i=0;i<34;i++){const x=45+i*55,hh=i%5===0?25:11;line(c,E,x,150,x,150+hh,fg,i%5===0?3:1.5);line(c,E,x,905,x,905-hh,fg,i%5===0?3:1.5)}for(let i=0;i<14;i++){const y=210+i*48;line(c,E,65,y,65+(i%3===0?28:12),y,fg,2);line(c,E,1855,y,1855-(i%3===0?28:12),y,fg,2)}arrow(c,E,150,235,355,235,fg,4);arrow(c,E,1765,830,1555,830,fg,4);frameElements.add('background:survey-rulers');
 }
}
function stage(c,t,E,pose,u,{dark=false,city=false}={}){
 const bg=dark?E.INK:E.PAPER,fg=dark?E.PAPER:E.INK,dir=pose.index%2?1:-1,family=pose.mode==='full-phone'&&E.cueAt(t)?.id==='cue_042'&&t>=89.6?'telephone-detail':pose.backgroundFamily??familyFor(t,E.cueAt(t));
 E.rect(c,0,0,1920,1080,bg);
 // A light paper edge tone is independent of the hard black ink shapes.
 if(!dark){const g=c.createRadialGradient(960,520,260,960,520,1130);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.085)');c.fillStyle=g;c.fillRect(0,0,1920,1080);c.save();c.fillStyle='#000';c.globalAlpha=.055;for(let i=0;i<420;i++)c.fillRect(Math.floor(hash(i*13+97)*1920),Math.floor(hash(i*17+31)*1080),1,hash(i+2)>.8?3:1);c.restore()}
 const vanX=960+(u-.5)*dir*160,vanY=500;
 if(ordinaryMode(pose)&&['archive','blueprint','shards'].includes(family)){
  ordinaryDetails(c,t,E,pose,u,fg,bg);
 }else if(['archive','newspaper','shards'].includes(family)){
  prop(c,t,E,'halftone',[40,95,1840,855],{ink:fg,paper:bg,step:family==='newspaper'?16:26,radius:family==='newspaper'?2.5:1.5,seed:127});
  for(let i=0;i<2;i++){const size=960+i*285+u*50;c.save();c.translate(vanX,vanY);c.rotate((i%2?1:-1)*(.045+u*.02));c.strokeStyle=fg;c.lineWidth=2.5;c.strokeRect(-size*.75,-size*.42,size*1.5,size*.84);c.restore()}
 }else if(family==='blueprint'){
  c.save();c.strokeStyle=fg;c.lineWidth=1.2;for(let i=0;i<12;i++){const x=i*180+mod(t*12,180);c.beginPath();c.moveTo(x,90);c.lineTo(x,960);c.stroke()}for(let i=0;i<6;i++)line(c,E,0,125+i*160,1920,125+i*160,fg,1.2);c.restore();
 }else if(family==='rays'){
  for(let i=0;i<22;i++){const a=i/22*Math.PI*2+pose.index*.13;line(c,E,vanX+Math.cos(a)*440,vanY+Math.sin(a)*340,vanX+Math.cos(a)*1600,vanY+Math.sin(a)*1500,fg,i%3===0?11:2)}
 }else if(['concentric','optical','signal'].includes(family)){
  for(let i=0;i<7;i++){const r=250+i*95+mod(t*15,95);E.circle(c,family==='optical'?480:1510,520,r,fg,i%3===0?5:1.5)}
  if(family==='signal')for(let i=0;i<22;i++){const x=80+i*27,h=hash(i+38)*80*(.5+E.sampleAudio(t).onset);line(c,E,x,880,x,880-h,fg,6)}
 }else if(family==='stars'){
  for(let i=0;i<90;i++){const x=hash(i*9+7)*1920,y=90+hash(i*7+29)*870;E.circle(c,x,y,hash(i+8)>.94?4:1.2,fg,0)}
 }
 if(city||family==='city'){c.save();c.beginPath();c.rect(0,580,1920,380);c.clip();cityLayer(c,t,E,pose,u,{dark});c.restore()}
 const safeArea={x:360,y:220,w:1200,h:620};
 prop(c,t,E,'ink',[0,0,1920,1080],{placement:'corner',corner:pose.index%2?'tr':'tl',ink:fg,paper:bg,radiusPixels:130,count:2,seed:41+pose.index,safeArea,safePadding:28});
 prop(c,t,E,'ink',[0,0,1920,1080],{placement:'corner',corner:pose.index%2?'bl':'br',ink:fg,paper:bg,radiusPixels:100,count:2,seed:83+pose.index,safeArea,safePadding:28});
 frameElements.add('background:'+family);frameElements.add('background:paper-grain');
 drawYear(c,t,E,{dark});semanticDecoration(c,t,E,pose,u,{dark});
}
function semanticDecoration(c,t,E,pose,u,{dark=false}={}){
 const cue=E.cueAt(t),f=semanticFocusAt(t,E),fg=dark?E.PAPER:E.INK,bg=dark?E.INK:E.PAPER,p=cue?clamp((t-cue.start_seconds)/Math.max(.01,cue.end_seconds-cue.start_seconds)):0;frameElements.add('motif:'+f.motif);
 if(['impact','explosion','intense','discharge','collapse'].includes(f.motif))prop(c,t,E,'ink',[0,0,1920,1080],{placement:'corner',corner:p>.45?'br':'tl',ink:fg,paper:bg,count:4,radiusPixels:f.motif==='collapse'?150+p*100:170,seed:701,safeArea:{x:390,y:260,w:1140,h:540},safePadding:34});
 if(f.motif==='fracture'){prop(c,t,E,'shards',[0,100,1920,850],{ink:fg,paper:bg,count:23,seed:802});for(let i=0;i<4;i++)line(c,E,95+i*31,170,450+i*13,900,fg,3)}
 if(f.motif==='flower')for(const[x,y,r]of[[160,260,95],[1740,780,125]]){c.save();c.translate(x,y);c.fillStyle=fg;for(let i=0;i<9;i++){c.rotate(Math.PI*2/9);c.beginPath();c.ellipse(r*.55,0,r*.72,r*.22,0,0,Math.PI*2);c.fill()}c.beginPath();c.arc(0,0,r*.35,0,Math.PI*2);c.fill();c.restore()}
 if(f.motif==='hundred')for(let i=0;i<5;i++)prop(c,t,E,'paper',[-85+i*29,490+i*22,600,500],{rotation:-.18+i*.025,ink:fg,paper:bg,seed:100+i});
 if(f.motif==='old-body'){c.save();c.strokeStyle=fg;c.lineWidth=3;for(let i=0;i<3;i++){const dx=i*36;c.beginPath();c.moveTo(125+dx,920);c.bezierCurveTo(510+dx,670,-100+dx,590,235+dx,210);c.bezierCurveTo(450+dx,80,580+dx,370,410+dx,530);c.stroke()}c.restore()}
 if(f.motif==='moon'){c.save();c.fillStyle=fg;c.beginPath();c.arc(1725,345,180,0,Math.PI*2);c.fill();c.fillStyle=bg;c.beginPath();c.arc(1650+Math.sin(p*Math.PI)*75,305,173,0,Math.PI*2);c.fill();c.restore();for(let i=0;i<4;i++)E.circle(c,1725,345,210+i*22,fg,2)}
 if(['question','information','debug','convergence'].includes(f.motif))prop(c,t,E,'shards',[-30,100,1980,850],{ink:fg,paper:bg,count:f.motif==='information'?35:15,seed:127});
}
function giantEdges(c,t,E,pose,u,{duo=false}={}){
 // Huge genuine profiles act as cropped side borders. The central reading
 // area stays clear; PNGs are always drawn at one uniform scale.
 const drift=(u-.5)*44;
 E.art(c,'SIL03',[-920+drift,-225,1720,1720],{mode:'ink',alignY:'top'});frameElements.add('asset:SIL03');
 if(duo){E.art(c,'FANNY_PROFILE',[1240-drift,-250,1720,1720],{mode:'ink',alignY:'top'});frameElements.add('asset:FANNY_PROFILE')}
 else{prop(c,t,E,'flip-phone',[1540-drift,230,540,790],{rotation:.20+u*.06,alpha:1});}
}
function littlePaper(c,t,E,pose,u,{dark=false}={}){
 const fg=dark?E.PAPER:E.INK,bg=dark?E.INK:E.PAPER,dir=pose.index%2?1:-1;
 prop(c,t,E,'paper',[-75+u*dir*58,190,450,590],{rotation:-.28-u*.05,ink:fg,paper:bg,alpha:1,seed:pose.index+7});
 prop(c,t,E,'envelope',[1420-u*dir*80,695,580,340],{rotation:.18-u*.05,ink:fg,paper:bg,alpha:1});
 prop(c,t,E,'cable',[-120,750,2150,300],{ink:fg,paper:bg,alpha:1,seed:17});
}
function reader(c,t,E,pose,opts={}){
 if(!E.cueAt(t)?.text.trim())return null;
 // Transparent type joins the printed background. Only a glyph-shaped halo
 // protects the reading strokes; no full-line paper or ink plate is painted.
 const spec={key:`${pose.id}-main`,role:'main',x:960,y:525,w:1540,h:690,maxSize:208,halo:true,...opts};
 return planeText(c,t,E,spec);
}
function focus(c,t,E,pose,opts={}){const text=focusWord(E.cueAt(t),pose.index);if(text)return planeText(c,t,E,{key:`${pose.id}-focus`,role:'focus',text,x:960,y:555,w:1840,h:880,maxSize:530,ghost:true,...opts})}
function cameraMotion(u,reduced){if(reduced)return{land:1,leave:0,drift:.5};return{land:out(u/.28),leave:inOut((u-.77)/.23),drift:inOut(u)}}
function opening(c,t,E,pose,u,reduced){
 stage(c,t,E,pose,u,{city:true});const{land}=cameraMotion(u,reduced);
 prop(c,t,E,'paper',[140,85,1640,880],{rotation:lerp(-.16,-.025,land),alpha:1});
 prop(c,t,E,'magnifier',[1320,380,550,550],{zoom:1.7,rotation:-.2,alpha:1});
 prop(c,t,E,'smartphone',[40-u*50,215,380,650],{rotation:.28,screenMode:'signal'});
 if(E.cueAt(t)?.text.trim())reader(c,t,E,pose,{x:970,y:520,w:1380,h:650,yaw:lerp(-.8,-.04,land),roll:lerp(-.18,0,land)});
 else{E.text(c,'127',930,650,510,E.INK,{font:E.MONO,align:'center',alpha:1});tiny(c,'SELF QUESTION / EVIDENCE UNKNOWN',960,810,E,{align:'center',size:22})}
 if(E.hasAsset('CHIBI_QUESTION')){c.save();c.translate(1640,255);c.rotate(.10);c.fillStyle=E.PAPER;c.fillRect(-115,-115,230,230);c.strokeStyle=E.INK;c.lineWidth=3;c.strokeRect(-115,-115,230,230);E.art(c,'CHIBI_QUESTION',[-100,-100,200,200],{mode:'print'});c.restore();frameElements.add('asset:CHIBI_QUESTION')}
 if(E.hasAsset('HARAKIRI_RELIC')){E.art(c,'HARAKIRI_RELIC',[105,735,150,150],{mode:'print'});tiny(c,'SCOPE / 127',100,916,E,{size:14});frameElements.add('asset:HARAKIRI_RELIC')}
}
function paperScene(c,t,E,pose,u,reduced){
 const dark=pose.clip==='final-burst';stage(c,t,E,pose,u,{dark,city:pose.clip==='duo'});const{land,leave,drift}=cameraMotion(u,reduced),fg=dark?E.PAPER:E.INK,bg=dark?E.INK:E.PAPER;
 littlePaper(c,t,E,pose,drift,{dark});
 // The main phrase lives on a large cut paper plane, then its frame splits.
 c.save();c.translate(960,540);c.rotate(lerp(-.12,-.025,land));c.strokeStyle=fg;c.lineWidth=5;c.strokeRect(-780,-355,1560,710);c.lineWidth=1;c.strokeRect(-790,-366,1580,732);c.restore();
 prop(c,t,E,'shards',[40,80,1840,920],{ink:fg,paper:bg,alpha:1,seed:pose.index+27});
 reader(c,t,E,pose,{x:960+(drift-.5)*36,y:540,w:1460,h:660,color:fg,yaw:lerp(-.48,-.02,land),pitch:lerp(-.32,0,land),roll:lerp(-.13,-.018,land),z:lerp(210,0,land)+leave*150,burst:true});
}
function relayScene(c,t,E,pose,u,reduced){
 const dark=pose.index%2===0;stage(c,t,E,pose,u,{dark,city:true});const{land,leave}=cameraMotion(u,reduced),fg=dark?E.PAPER:E.INK,bg=dark?E.INK:E.PAPER;
 prop(c,t,E,'smartphone',[1430-180*land,420,590,770],{rotation:-.36+land*.13,ink:fg,paper:bg,screenText:'127',alpha:1});
 // A cropped foreground word is paired with a complete main line above it.
 reader(c,t,E,pose,{x:lerp(760,960,land),y:530,w:lerp(2250,1580,land),h:720,color:fg,yaw:lerp(.72,.04,land),roll:lerp(.24,-.025,land),z:lerp(-100,120,land)+leave*600,maxSize:238,halo:true});
 arrow(c,E,125,850,1795,850,fg,4);
}
function edgeScene(c,t,E,pose,u,reduced){
 stage(c,t,E,pose,u,{city:true});const{land,leave}=cameraMotion(u,reduced);
 if(pose.index%2){
  reader(c,t,E,pose,{x:975,y:540,w:820,h:870,vertical:true,maxSize:138,yaw:lerp(-.42,.03,land),roll:lerp(-.08,.015,land),z:leave*240,halo:true});
 }else{
  reader(c,t,E,pose,{x:965,y:535,w:1070,h:720,maxSize:205,yaw:lerp(.62,.02,land),pitch:-.07,roll:lerp(.10,0,land),halo:true});
 }
 giantEdges(c,t,E,pose,u,{duo:pose.characters==='duo'});
}
function verticalScene(c,t,E,pose,u,reduced){
 const dark=pose.clip==='first-burst';stage(c,t,E,pose,u,{dark,city:true});const{land,leave,drift}=cameraMotion(u,reduced),fg=dark?E.PAPER:E.INK,bg=dark?E.INK:E.PAPER;
 // A far phone, middle text and near phone translate in opposite directions.
 prop(c,t,E,'smartphone',[50-160*drift,150,390,690],{rotation:lerp(-.48,-.25,land),ink:fg,paper:bg,alpha:1,screenText:'127'});
 prop(c,t,E,'flip-phone',[1480-125*drift,540,550,700],{rotation:.32-drift*.18,ink:fg,paper:bg,alpha:1});
 const cue=E.cueAt(t);for(let i=0;i<3;i++){const word=focusWord(cue,pose.index+i);if(word)planeText(c,t,E,{key:`${pose.id}-far-${i}`,role:'echo',text:word,x:290+i*610-drift*70,y:470,w:170,h:910,vertical:true,color:fg,maxSize:165,yaw:-.75,pitch:-.14,roll:.035,z:450+i*200,alpha:1})}
 reader(c,t,E,pose,{x:1000-90*drift,y:545,w:720,h:900,vertical:true,maxSize:143,color:fg,yaw:lerp(-.83,-.09,land),pitch:-.12,roll:lerp(.1,-.025,land),z:leave*420});
}
function headArrowScene(c,t,E,pose,u,reduced){
 stage(c,t,E,pose,u,{city:false});const{land,drift}=cameraMotion(u,reduced);
 arrow(c,E,440,283,1775,283,E.INK,7);
 prop(c,t,E,'magnifier',[1340,650,490,490],{zoom:1.8,rotation:.25,alpha:1});
 reader(c,t,E,pose,{x:1100,y:570,w:1210,h:660,maxSize:207,yaw:lerp(-.7,.025,land),pitch:-.08,roll:0,z:lerp(250,0,land)});
 tiny(c,'TRACE → RECONSTRUCT → REPEAT',595+drift*26,930,E,{size:18,alpha:1});
 giantEdges(c,t,E,pose,u);
}
function cityScene(c,t,E,pose,u,reduced){
 stage(c,t,E,pose,u,{city:true});const{land,leave,drift}=cameraMotion(u,reduced);
 // An opaque real skyline is the middle depth; envelopes cross the near plane.
 cityLayer(c,t,E,pose,drift,{alpha:1,y:390,h:720});
 prop(c,t,E,'envelope',[lerp(1580,1270,drift),590,650,430],{rotation:lerp(-.38,.18,drift),alpha:1});
 prop(c,t,E,'flip-phone',[-170+230*drift,380,620,870],{rotation:-.28+drift*.18,alpha:1});
 reader(c,t,E,pose,{x:960+(drift-.5)*120,y:370,w:1470,h:500,maxSize:181,yaw:lerp(.68,-.03,land),pitch:-.12,roll:lerp(-.13,-.03,land),z:leave*360});
}
function lensScene(c,t,E,pose,u,reduced){
 stage(c,t,E,pose,u,{city:true});const{land,drift}=cameraMotion(u,reduced);if(pose.id!=='D08')littlePaper(c,t,E,pose,drift);
 const mirror=pose.id==='D08';reader(c,t,E,pose,{x:mirror?1230:960,y:510,w:mirror?1110:1510,h:710,maxSize:213,yaw:lerp(-.66,-.02,land),pitch:.16,roll:.025});
 prop(c,t,E,'magnifier',mirror?[-30,430,680,680]:[1250-190*drift,505,680,680],{E,contentMode:mirror?'user-mirror':'source',sourceCanvas:c.canvas,region:{x:1130-140*drift,y:475,w:290,h:290},zoom:1.8,rotation:.35-drift*.2,alpha:1});
 if(!mirror)prop(c,t,E,'paper',[-65,610,470,510],{rotation:-.35,alpha:1,seed:66});
}
function quarterScene(c,t,E,pose,u,reduced){
 const dark=pose.index%2===1;stage(c,t,E,pose,u,{dark,city:false});const{land,leave}=cameraMotion(u,reduced),fg=dark?E.PAPER:E.INK,bg=dark?E.INK:E.PAPER,sign=pose.index%2?1:-1;
 littlePaper(c,t,E,pose,u,{dark});prop(c,t,E,'smartphone',[1390,170,530,850],{rotation:sign*(1.15-land*.72),ink:fg,paper:bg,alpha:1});
 // A genuine quarter-turn of the type plane lands before the readable hold.
 reader(c,t,E,pose,{x:970,y:530,w:1570,h:730,color:fg,maxSize:230,yaw:lerp(sign*.78,.02,land),pitch:lerp(-1.4,0,land),roll:sign*lerp(Math.PI/2,.035,land),z:leave*550,halo:true});
}
function phoneScene(c,t,E,pose,u,reduced){
 const dark=pose.clip==='final-burst';stage(c,t,E,pose,u,{dark,city:true});const{land,drift}=cameraMotion(u,reduced),fg=dark?E.PAPER:E.INK,bg=dark?E.INK:E.PAPER;
 prop(c,t,E,'smartphone',[1550-110*drift,500,460,800],{rotation:.44-drift*.12,ink:fg,paper:bg,alpha:1});
 prop(c,t,E,'cable',[-60,810,2070,400],{ink:fg,paper:bg,alpha:1});
 prop(c,t,E,'paper',[-120,535,650,640],{rotation:-.24,ink:fg,paper:bg,seed:pose.index+22});
 reader(c,t,E,pose,{x:960-45*drift,y:505,w:1420,h:700,maxSize:203,color:fg,yaw:lerp(.82,.055,land),pitch:lerp(-.32,-.08,land),roll:lerp(.17,.025,land),z:40});
 if(pose.id==='B03')prop(c,t,E,'flip-phone',[1510,490,385,510],{E,screenAsset:'CHIBI_UNIMPRESSED',rotation:-.08,ink:fg,paper:bg});
}
function tunnelScene(c,t,E,pose,u,reduced){
 const dark=true;stage(c,t,E,pose,u,{dark,city:pose.clip==='duo'});const{land,leave,drift}=cameraMotion(u,reduced),cue=E.cueAt(t),word=focusWord(cue,pose.index);
 // Five distinct projective depths stream past, while the near full phrase lands.
 if(pose.id==='B01')solidOutlineWall(c,t,E,pose);
 else for(let i=4;i>=0;i--){const z=480+i*540-drift*320,w=1920,h=850,roll=(i%2?1:-1)*(.11+drift*.12),x=960+(i%2?1:-1)*140*drift;
  const[s,q]=E.scratch(`v05-tunnel-frame-${i}`,1440,660);q.strokeStyle=E.PAPER;q.lineWidth=5;q.strokeRect(35,28,1370,604);q.lineWidth=2;q.strokeRect(45,38,1350,584);q.font=`700 165px ${E.JP}`;q.fillStyle=E.PAPER;q.textAlign='center';q.globalAlpha=cueVisibility(cue,t);q.fillText(word||'127',720,375);q.globalAlpha=1;projectPlane(c,s,cameraQuad({x,y:520,w,h,z,roll,yaw:lerp(-.5,.32,drift),pitch:-.08}),{alpha:1});
 }
 prop(c,t,E,'shards',[30,60,1870,980],{ink:E.PAPER,paper:E.INK,alpha:1,seed:71});
 reader(c,t,E,pose,{x:960,y:540,w:pose.id==='B01'?1320:1530,h:pose.id==='B01'?620:720,maxSize:213,color:E.PAPER,yaw:lerp(-.85,-.025,land),pitch:lerp(.46,0,land),roll:lerp(-.28,-.012,land),z:lerp(430,0,land)+leave*550,burst:true,halo:true});
}
function solidOutlineWall(c,t,E,pose){
 const cue=E.cueAt(t);if(!cue?.text.trim())return;const g=chars(cue.text.trim()),n=Math.ceil(g.length/4),[s,q]=E.scratch('v05-solid-outline-wall',1800,1000),beat=(t-.379524)/(60/155.005),b=Math.floor(beat),phase=beat-b,sign=b%2?1:-1,shift=lerp(-sign*80,sign*80,inOut(phase/.3));
 q.font=`700 147px ${E.JP}`;q.fillStyle=E.PAPER;q.strokeStyle=E.PAPER;q.lineWidth=3;q.lineJoin='round';q.globalAlpha=cueVisibility(cue,t);
 for(let i=0;i<4;i++){const phrase=g.slice(i*n,(i+1)*n).join(''),x=75+(i%2?130:0)+shift*(i%2?-1:1),y=180+i*218;i%2?q.strokeText(phrase,x,y):q.fillText(phrase,x,y)}q.globalAlpha=1;
 projectPlane(c,s,cameraQuad({x:960,y:525,w:1900,h:1900/1.8,yaw:.24,pitch:-.08,roll:-.045}),{alpha:1});frameElements.add('typography:solid-outline-wall');
}
function shardsScene(c,t,E,pose,u,reduced){
 stage(c,t,E,pose,u,{city:pose.clip!=='first-burst'});const{land,leave,drift}=cameraMotion(u,reduced);
 prop(c,t,E,'shards',[-80,-50,2080,1180],{ink:E.INK,paper:E.PAPER,alpha:1,seed:pose.index+127});
 prop(c,t,E,'paper',[120,125,1700,820],{rotation:lerp(.17,.035,land),alpha:1,seed:127});
 for(let i=0;i<3;i++){const word=focusWord(E.cueAt(t),pose.index+i);if(word)planeText(c,t,E,{key:`${pose.id}-slice-${i}`,role:'echo',text:word,x:240+i*730,y:120+(i%2)*720,w:610,h:370,color:E.INK,maxSize:220,yaw:(i-1)*.7,roll:(i-1)*.28,z:150+leave*550,alpha:1})}
 reader(c,t,E,pose,{x:960,y:530,w:1480,h:700,maxSize:208,yaw:lerp(.76,-.03,land),pitch:lerp(-.42,-.025,land),roll:lerp(.2,.025,land),z:leave*320,burst:true,halo:true});
}
function diagonalScene(c,t,E,pose,u,reduced){
 const dark=pose.clip!=='verse';stage(c,t,E,pose,u,{dark,city:true});const{land,leave,drift}=cameraMotion(u,reduced),fg=dark?E.PAPER:E.INK,bg=dark?E.INK:E.PAPER;
 prop(c,t,E,'flip-phone',[lerp(1590,1330,drift),160,600,930],{rotation:lerp(.68,.22,drift),ink:fg,paper:bg,alpha:1});
 prop(c,t,E,'paper',[-210,680,820,570],{rotation:-.45+drift*.17,ink:fg,paper:bg,alpha:1,seed:101});
 // Large roll and yaw occur during the 160–220ms handoff; the main line then
 // settles almost front-on for reading before a depth exit.
 reader(c,t,E,pose,{x:960+(drift-.5)*125,y:535,w:1490,h:730,maxSize:222,color:fg,yaw:lerp(-.89,-.06,land)+leave*.35,pitch:lerp(-.58,-.08,land),roll:lerp(-.68,-.04,land)+leave*.18,z:lerp(150,0,land)+leave*450,halo:true});
}
function endingScene(c,t,E,pose,u,reduced){
 stage(c,t,E,pose,u,{city:true});const{drift}=cameraMotion(u,reduced);cityLayer(c,t,E,pose,drift,{alpha:1,y:280,h:850});
 prop(c,t,E,'smartphone',[730-80*drift,95,520,900],{rotation:.15-drift*.25,screenMode:'signal',screenText:'127',alpha:1});
 prop(c,t,E,'envelope',[1260+drift*120,580,660,420],{rotation:-.3+drift*.45,alpha:1});
 prop(c,t,E,'shards',[-60,-60,2040,1200],{alpha:1,seed:90});
 // LRC is empty here. These small words are explicitly case-file decoration.
 tiny(c,'CASE 127 / INFERENCE ENDED',960,490,E,{size:28,align:'center'});
 line(c,E,370,535,1550,535,E.INK,4,.8);tiny(c,'BONNIE',960,645,E,{size:85,align:'center',alpha:1});
}
function newspaperScene(c,t,E,pose,u,reduced){
 stage(c,t,E,pose,u,{city:true});const{land,drift}=cameraMotion(u,reduced),close=pose.mode==='newspaper-close',quarter=pose.mode==='newspaper-quarter';
 cityLayer(c,t,E,pose,drift,{alpha:1,y:300,h:850});
 const box=close?[-430+drift*210,-240,2770,1840]:[200+(drift-.5)*110,80,1520,1000];
 prop(c,t,E,'newspaper',box,{E,imageAsset:newspaperPageAt(t)?.asset??'NEWSPAPER_ICON',rotation:quarter?lerp(-Math.PI/2,-.10,land):close?-.06:lerp(.34,-.04,land),yaw:lerp(quarter?.50:-.38,.03,land),pitch:close?-.14:.12,alpha:1});
 prop(c,t,E,'envelope',[1430-100*drift,650,590,380],{rotation:.25-drift*.15,alpha:1});
 if(E.cueAt(t)?.text.trim())reader(c,t,E,pose,{x:960,y:190,w:1510,h:270,maxSize:120,halo:true});
}
export function newspaperPageAt(t){if(t<121.5||t>=124.22)return null;const i=Math.min(3,Math.floor((t-121.5)/.4)),ids=['NEWSPAPER_ICON_I','NEWSPAPER_ICON_II','NEWSPAPER_ICON_III','NEWSPAPER_ICON'];return{index:i,page:['I','II','III','IV'][i],asset:ids[i],start:121.5+i*.4,end:i===3?124.22:121.5+(i+1)*.4}}
function magnifierBeatScene(c,t,E,pose,u,reduced){
 stage(c,t,E,pose,u,{city:false});const state=lensKeywordAt(t),age=clamp((t-124.22)/(128.9-124.22)),drift=reduced?0:Math.sin(age*Math.PI)*8;
 // The lens is on the left; its long handle climbs to the upper right. Only
 // the whole physical prop rotates, while its contents stay upright.
 prop(c,t,E,'magnifier',[225,-247,1052,1351],{E,contentMode:state?.mode??'lyrics',contentUpright:true,contentFlipProgress:state?.flip?.progress,scan:false,zoom:state?.word?1.05:1.45,rotation:-Math.PI/2});
 const cue=E.cueAt(t);
 if(state?.word&&cue){
  const terms=['演示文字','演示文字','演示文字'],d=(127.37-125.77)/3;
  for(let j=0;j<=state.index;j++){const local={...cue,text:terms[j],start_seconds:125.77+j*d},F={...E,cueAt:()=>local};planeText(c,t,F,{key:`${pose.id}-cumulative-${j}`,role:'main',text:terms[j],x:1440,y:280+j*220,w:810,h:260,maxSize:j===state.index?245:205,outline:j<state.index,halo:true})}
  if(state.index===2){const suffix=cue.text.split('演示文字')[1]??'',local={...cue,text:suffix,start_seconds:125.77+2*d},F={...E,cueAt:()=>local};if(suffix)planeText(c,t,F,{key:`${pose.id}-cumulative-suffix`,role:'main',text:suffix,x:1440,y:890,w:810,h:190,maxSize:130,halo:true})}
  frameElements.add('lyric:cue055-cumulative-words');
 }else reader(c,t,E,pose,{x:1440,y:525,w:810,h:740,maxSize:205,halo:true});
}
export function lensKeywordAt(t){
 if(t<124.22||t>=127.37)return null;const a=125.77,b=127.37,d=(b-a)/3,modes=['lyrics','harakiri-relic','fuji','fanny-silhouette'],events=[a,a+d,a+2*d],width=.22;
 let index=t<a?-1:t>=b?-1:Math.min(2,Math.floor((t-a)/d)),mode=index<0?'lyrics':modes[index+1],flip=null;
 for(let j=0;j<events.length;j++){const center=events[j],lo=center-width/2,hi=center+width/2;if(t>=lo&&t<hi){const progress=clamp((t-lo)/width);mode=progress<.5?modes[j]:modes[j+1];flip={index:j+1,start:lo,end:hi,progress,from:modes[j],to:modes[j+1],axis:'vertical',estimatedTiming:true};break}}
 return{mode,word:index<0?null:['演示文字','演示文字','演示文字'][index],index:index<0?null:index,start:index<0?null:a+index*d,end:index<0?null:a+(index+1)*d,flip,estimatedTiming:true};
}
function chatScene(c,t,E,pose,u,reduced){
 stage(c,t,E,pose,u,{city:true});const{land,drift}=cameraMotion(u,reduced),close=pose.mode==='chat-close';
 cityLayer(c,t,E,pose,drift,{alpha:1,y:475,h:620});
 const message=E.cueAt(t)?.text.trim()||'記録 / 127';
 // Names and avatars are mapped by role inside chatRecord; they cannot be
 // swapped independently. They are small record portraits, not a third duo.
 const messages=[{role:'bonnie',text:'演示文字演示文字演'},{role:'fanny',text:'演示文字演示文字演示'},{role:'bonnie',text:'演示文字演示文字演'},{role:'bonnie',text:'演示文字演示文字演示'},{role:'fanny',text:'演示文字演示文字'},{role:'bonnie',text:'演示文字演示文字演示'},{role:'bonnie',text:'演示文字演示'},{role:'fanny',text:'演示文字演示'},{role:'bonnie',text:'演示文字演示文'}];
 prop(c,t,E,'chat',close?[-20,235,1820,880]:[90,260,1700,760],{E,messages,rowCount:9,progress:pAt(t,127.37,131.43),rotation:close?lerp(.16,.025,land):lerp(-.10,-.015,land),yaw:lerp(close?-.4:.3,.025,land),pitch:-.08,alpha:1});
 reader(c,t,E,pose,{x:960,y:210,w:1510,h:270,maxSize:136,yaw:0,roll:-.018,halo:true});
 if(pose.id==='N11')prop(c,t,E,'smartphone',[1560,260,330,650],{screenMode:'signal',screenText:'SNS\n127\nRECORD',rotation:-.035});
}
export function quarterStepAt(t,pose){if(pose?.mode!=='quarter-step')return null;const base=pose.clip==='first-burst'?2:3,index=pose.index-base,from=index*90,to=from+90,turnSeconds=.27,elapsed=t-pose.start,progress=elapsed<=0?0:elapsed>=turnSeconds?1:inOut(elapsed/turnSeconds);return{motion:'quarter-step',index,from,to,current:elapsed<=0?from:elapsed>=turnSeconds?to:lerp(from,to,progress),unit:'degrees',turnSeconds,holdSeconds:pose.end-pose.start-turnSeconds,settled:elapsed>=turnSeconds}}
function quarterStepScene(c,t,E,pose,u,reduced){
 stage(c,t,E,pose,u,{city:false});const state=quarterStepAt(t,pose),A=(reduced?state.to:state.current)*Math.PI/180,j=state.index,active=E.cueAt(t);frameElements.add('motion:quarter-step');
 c.save();c.translate(960,510);c.rotate(A);c.strokeStyle=E.INK;c.lineWidth=4;c.strokeRect(-450,-355,900,710);for(let i=0;i<4;i++){const a=i*Math.PI/2;c.beginPath();c.moveTo(Math.cos(a)*400,Math.sin(a)*330);c.lineTo(Math.cos(a)*545,Math.sin(a)*435);c.stroke()}c.restore();
 // One complete main phrase rotates through the handoff and lands at 0°.
 // The previous phrase has already left at its cue boundary; no lower duplicate.
 if(active?.text.trim())reader(c,t,E,pose,{x:960,y:525,w:1530,h:700,maxSize:226,roll:A-state.to*Math.PI/180,yaw:lerp(.4,0,inOut(clamp((t-pose.start)/.27))),halo:true,mixed:pose.id==='B04'||pose.id==='F04'});
 if(pose.id==='B04'||pose.id==='F04')frameElements.add('typography:mixed-kanji-kana');
 if(pose.id==='B03')prop(c,t,E,'flip-phone',[1510,490,385,510],{E,screenAsset:'CHIBI_UNIMPRESSED',rotation:-.08});
}
function orbitGlyphs(c,t,E,pose,u){
 const cue=E.cueAt(t);if(cue?.id!=='cue_077')return;const all=chars(cue.text),age=t-cue.start_seconds,tail=clamp((cue.end_seconds-t)/.18),cx=960-(pose.mode==='solar-travel'?u*80:0);
 for(let i=0;i<all.length;i++){const a=lerp(-Math.PI+.25,-.25,i/Math.max(1,all.length-1)),enter=out((age-i*.039+1/60)/.12),alpha=enter*tail;if(alpha<=0)continue;const ch=all[i],size=/\p{Script=Han}/u.test(ch)?78:/[（）]/u.test(ch)?42:59,x=cx+Math.cos(a)*745,y=530+Math.sin(a)*270;
  c.save();c.translate(x,y);c.rotate((a+Math.PI/2)*.26);c.globalAlpha=alpha;c.font=`700 ${size}px ${E.JP}`;c.textAlign='center';c.textBaseline='alphabetic';c.lineJoin='round';c.lineWidth=4;c.strokeStyle=E.INK;c.fillStyle=E.PAPER;c.strokeText(ch,0,0);c.fillText(ch,0,0);c.restore();
 }
 frameElements.add('lyric:cue077-orbit-glyphs');
}
function solarScene(c,t,E,pose,u,reduced){
 E.rect(c,0,0,1920,1080,E.INK);const move=reduced?.5:inOut(u),m=pose.mode;let camera='orbits',zoom=.78,panX=0,panY=0,phase=0;
 if(m==='solar-sun'){camera='sun';zoom=lerp(1.35,1.05,move)}
 else if(m==='solar-flare'){camera='sun';zoom=lerp(1.05,.68,move);panX=-70*move}
 else if(m==='solar-rise'){zoom=lerp(1.02,.78,move)}
 else if(m==='solar-travel'){zoom=lerp(.78,.70,move);panX=-120*move}
 else if(m==='solar-clear'){zoom=.78}
 else if(m==='solar-dance'||m==='solar-turn'){phase=(pose.index%3)*Math.PI/2+(reduced?1:inOut(u/.3))*Math.PI/2;zoom=.78}
 else if(m==='solar-rebirth'){camera='outer';zoom=lerp(1.05,.85,move);panX=80*move}
 else if(m==='solar-escape'){camera='outer';zoom=lerp(.85,.66,move);panX=lerp(40,210,move)}
 else if(m==='solar-moon'||m==='solar-outer'){zoom=m==='solar-moon'?lerp(.95,.78,move):.78;phase=move*.24}
 prop(c,t,E,'solar-system',[0,0,1920,1080],{camera,zoom,center:[960,525],panX,panY,phase,ink:E.PAPER,paper:E.INK,seed:127,readArea:{x:380,y:300,w:1160,h:410}});
 frameElements.add('motif:'+semanticFocusAt(t,E).motif);
 const cue=E.cueAt(t);if(cue?.id==='cue_077')orbitGlyphs(c,t,E,pose,u);
 else reader(c,t,E,pose,{x:960,y:520,w:1450,h:660,maxSize:205,color:E.PAPER,halo:true,yaw:m==='solar-rebirth'?lerp(.34,.05,move):0,z:m==='solar-escape'?move*550:0,burst:['solar-flare','solar-dance'].includes(m)});
 tiny(c,'SOLAR SYSTEM / FILE 127',80,125,E,{color:E.PAPER,size:17});
}
function firstYearScene(c,t,E,pose,u,reduced){
 stage(c,t,E,pose,u,{city:false});const year=yearAt(t),focus=semanticFocusAt(t,E),move=reduced?.5:inOut(u);
 if(focus.motif==='hug'){c.save();c.strokeStyle=E.INK;c.lineWidth=9;for(const sign of[-1,1]){c.beginPath();c.moveTo(960+sign*740,240);c.bezierCurveTo(960+sign*400,280,960+sign*410,730,960+sign*710,840);c.stroke()}c.restore()}
 reader(c,t,E,pose,{x:960,y:year?.foreground?790:525,w:1490,h:year?.foreground?280:680,maxSize:year?.foreground?125:210,yaw:lerp(-.2,.02,move),roll:focus.motif==='intense'?lerp(-.07,.025,move):0,burst:focus.motif==='intense',halo:true});
}

// Whole-prop projection: a physical print starts nearly parallel to the floor,
// rises through depth, then holds. Its bitmap is never scaled on one axis.
function groundRise(c,t,E,pose,kind,box,options={}){
 const age=t-pose.start,turn=.42,progress=age<=0?0:age>=turn?1:inOut(age/turn),pitch=lerp(-1.43,0,progress),[x,y,w,h]=box;
 const sh=800,sw=Math.round(sh*w/h),[s,q]=E.scratch('v05-ground-'+kind,sw,sh);
 const r=prop(q,t,E,kind,[0,0,sw,sh],{...options,yaw:0,pitch:0,rotation:0});
 projectPlane(c,s,cameraQuad({x:x+w/2,y:y+h/2,w,h,pitch,yaw:options.yaw??-.18,roll:options.rotation??-.07,z:lerp(160,0,progress)}),{alpha:1});
 frameElements.add('motion:ground-rise');return{motion:'ground-rise',pitch,progress,turnSeconds:turn,settled:age>=turn,kind};
}
function titleGlyphs(c,t,E,phrase,{x=960,y=540,size=180,start=0,end=10.69,color=E.INK,vertical=false}={}){
 const g=chars(phrase),cue={text:phrase,start_seconds:start,end_seconds:end},[s,q]=E.scratch('v05-title',1800,800);q.font=`700 ${size}px ${E.JP}`;q.fillStyle=color;q.textAlign='center';q.textBaseline='middle';
 const widths=g.map(ch=>q.measureText(ch).width),total=widths.reduce((a,b)=>a+b,0);let xx=900-total/2;
 for(let i=0;i<g.length;i++){const e=glyphEnvelope(cue,t,i,g.length),gx=xx+widths[i]/2+(1-e.enter)*50,gy=400-e.exit*35;q.save();q.globalAlpha=e.alpha;q.filter=e.blur>.05?`blur(${e.blur}px)`:'none';q.strokeStyle=color===E.INK?E.PAPER:E.INK;q.lineWidth=5;q.lineJoin='round';q.strokeText(g[i],gx,gy);q.fillText(g[i],gx,gy);q.restore();xx+=widths[i]}
 projectPlane(c,s,cameraQuad({x,y,w:1800,h:800,roll:vertical?-.15:0,yaw:vertical?.25:0,pitch:0}),{alpha:1});
}
function fullIntro(c,t,E,pose,u,reduced){
 const dark=t>=10.69&&t<16.44;stage(c,t,E,pose,u,{dark});const fg=dark?E.PAPER:E.INK,bg=dark?E.INK:E.PAPER,source=sourceCueAt(t),section=Math.floor(t/2.65);
 if(source?.kind==='credit')E.text(c,source.text.trim(),960,525,46,fg,{font:E.JP,align:'center'});
 else if(t<10.69){
  if(pose.characters==='bonnie'){E.art(c,'SIL03',[-990,-270,1850,1850],{mode:'ink',alignY:'top'});frameElements.add('asset:SIL03')}
  const title=SOURCE_CUES[2].text;titleGlyphs(c,t,E,title,{x:pose.characters?1120:960,y:510,size:pose.characters?150:180,start:.35,end:10.69,color:fg,vertical:section%2===1});
  for(let i=0;i<4;i++){c.save();c.translate(960,510);c.rotate((i%2?1:-1)*(.04+u*.03));c.strokeStyle=fg;c.lineWidth=i===0?6:1;c.strokeRect(-750-i*66,-260-i*44,1500+i*132,520+i*88);c.restore()}
 }else if(t<16.44){
  const rings=3+section%3;for(let i=0;i<rings;i++){E.circle(c,960,525,180+i*125+u*30,fg,4);line(c,E,80,220+i*145,1840,220+i*145,fg,2)}
  if(section%2===0)groundRise(c,t,E,pose,'paper',[500,180,920,720],{ink:fg,paper:bg,seed:171});
  else prop(c,t,E,'magnifier',[600,100,920,920],{zoom:2,rotation:-.45+u*.2,ink:fg,paper:bg});
 }else{
  groundRise(c,t,E,pose,'paper',[390,190,1140,710],{rotation:-.08,seed:127});
  if(E.hasAsset('HARAKIRI_RELIC')){E.art(c,'HARAKIRI_RELIC',[80,590,300,300],{mode:'print'});frameElements.add('asset:HARAKIRI_RELIC')}
  tiny(c,'BONNIE / 127',960,540,E,{align:'center',size:42});
 }
 frameElements.add('section:intro');
}
function fullOutro(c,t,E,pose,u,reduced){
 const p=pAt(t,177.53,FULL_DURATION),dark=t>187.39;stage(c,t,E,pose,u,{dark});const fg=dark?E.PAPER:E.INK,bg=dark?E.INK:E.PAPER;
 if(t<184.5){
  for(let i=0;i<5;i++)prop(c,t,E,'paper',[250+i*100-u*50,130+i*80,960,610],{rotation:(i-2)*.09,ink:fg,paper:bg,seed:95+i});
  if(pose.characters==='bonnie'){E.art(c,'SIL03',[-780,-180,1700,1700],{mode:'ink',alignY:'top'});frameElements.add('asset:SIL03')}
  E.text(c,'BONNIE',1160,550,148,fg,{font:E.MONO,align:'center',outline:2});
 }else if(t<187.39){
  prop(c,t,E,'envelope',[500,250,920,560],{rotation:-.12+u*.1,ink:fg,paper:bg});E.text(c,'127',960,560,160,fg,{font:E.MONO,align:'center'});
 }else{
  const a=clamp((FULL_DURATION-t)/.8);titleGlyphs(c,t,E,'終',{x:960,y:520,size:340,start:187.39,end:FULL_DURATION,color:fg});
  c.save();c.globalAlpha=a;line(c,E,490,690,1430,690,fg,2);tiny(c,'BONNIE / CASE CLOSED',960,733,E,{align:'center',size:23,color:fg});
  E.text(c,'MUSIC  字演示文 feat. 文字演示 & GUMI',960,785,25,fg,{font:E.JP,align:'center',weight:500});
  E.text(c,'角色  吉星派对 / BONNIE',960,829,25,fg,{font:E.JP,align:'center',weight:500});
  E.text(c,'非商业同人 · AI辅助图像',960,873,24,fg,{font:E.CN,align:'center',weight:500});c.restore();frameElements.add('credits:music-characters-fanwork-ai');
 }
 frameElements.add('section:outro');
}
function fullBreak(c,t,E,pose,u,reduced){
 const dark=pose.mode==='full-interlude'&&pose.index%3===1;stage(c,t,E,pose,u,{dark});const fg=dark?E.PAPER:E.INK,bg=dark?E.INK:E.PAPER;
 if(pose.mode==='full-interlude'){
  if(pose.index%3===0)groundRise(c,t,E,pose,'flip-phone',[520,120,840,850],{ink:fg,paper:bg,E,screenMode:'call',screenText:'127'});
  else if(pose.index%3===1)prop(c,t,E,'cable',[-160,170,2260,780],{ink:fg,paper:bg,seed:84});
  else prop(c,t,E,'paper',[350,185,1220,730],{rotation:lerp(-.26,.06,inOut(u)),ink:fg,paper:bg,seed:52});
 }else if(pose.index%3===0)groundRise(c,t,E,pose,'paper',[250,160,1420,780],{ink:fg,paper:bg,seed:55});
 else if(pose.index%3===1)prop(c,t,E,'magnifier',[460,100,1000,1000],{rotation:-.6+u*.2,zoom:2,ink:fg,paper:bg});
 else prop(c,t,E,'shards',[0,90,1920,870],{ink:fg,paper:bg,count:23,seed:71});
 frameElements.add('section:instrumental');
}
function phoneCrop(c,t,E,sourceRect,{x,y,w,h,yaw=0,pitch=0,roll=0,ink=E.INK,paper=E.PAPER,screenText='127'}={}){
 const[s,q]=E.scratch('v05-phone-canonical',640,1040);vprop(q,t,E,'flip-phone',[0,0,640,1040],{E,ink,paper,screenMode:'signal',screenText});
 const[sx,sy,sw,sh]=sourceRect,[crop,r]=E.scratch('v05-phone-crop',sw*2,sh*2);r.drawImage(s,sx,sy,sw,sh,0,0,sw*2,sh*2);
 const hh=w*sh/sw;projectPlane(c,crop,cameraQuad({x:x+w/2,y:y+(h??hh)/2,w,h:hh,yaw,pitch,roll}),{alpha:1});frameElements.add('prop:fixed-phone-detail');
}
function fullPhone(c,t,E,pose,u,reduced){
 const cue=E.cueAt(t),long=cue?.id==='cue_042',detail=long&&t>=89.6,dark=long&&(detail?(t<92.8||t>=96.2):pose.index%4<2);stage(c,t,E,pose,u,{dark});const fg=dark?E.PAPER:E.INK,bg=dark?E.INK:E.PAPER,age=t-(cue?.start_seconds??pose.start);
 const phoneBox=pose.view%2?[1270,170,650,780]:[-100,130,790,900],fault=long?Math.floor(age/3.6)%3:0,state=['dial','search','disconnected'][fault],screenMode=long?['call','signal','static'][fault]:'signal',screenText=long?(fault===0?'127\n'+('·'.repeat(1+Math.floor(age*4)%6)):fault===1?'— — —\nSEARCH':'NO SIGNAL\n×'):/暗证/.test(cue?.text??'')?'••••':'127';
 let main={x:pose.view%2?780:1195,y:525,w:long?1050:1100,h:650,maxSize:long?225:200,vertical:pose.view===2,yaw:pose.view===3?lerp(-.5,0,out(u/.26)):0};
 if(detail&&t<92.8){
  phoneCrop(c,t,E,[145,565,350,443],{x:1080,y:-15,w:970,yaw:lerp(-.33,-.15,inOut(u)),pitch:-.08,roll:.12,ink:fg,paper:bg});
  main={x:555,y:515,w:1000,h:700,maxSize:245,arrangement:'columns'};frameElements.add('phone-shot:keypad-close');
  for(let i=0;i<6;i++)line(c,E,100+i*120,195,160+i*120,195,fg,5);
 }else if(detail&&t<96.2){
  phoneCrop(c,t,E,[165,130,310,380],{x:-50,y:195,w:770,yaw:.24,pitch:-.09,roll:-.12,ink:fg,paper:bg,screenText:'NO SIGNAL\n×'});
  for(const baseline of[180,850]){c.save();c.strokeStyle=fg;c.lineWidth=5;c.beginPath();for(let i=0;i<90;i++){const x=500+i*16,y=baseline+Math.sin(i*1.3+age*6)*Math.exp(-Math.abs(i-32)/17)*60;if(i===41||i===53)c.moveTo(x,y);else i?c.lineTo(x,y):c.moveTo(x,y)}c.stroke();c.restore()}line(c,E,1540,130,1630,220,fg,11);line(c,E,1630,130,1540,220,fg,11);
  main={x:1270,y:530,w:1160,h:640,maxSize:225,arrangement:'stair'};frameElements.add('phone-shot:disconnected-waveform');
 }else if(detail){
  prop(c,t,E,'paper',[60,170,720,760],{ink:fg,paper:bg,rotation:-.08,seed:442});prop(c,t,E,'flip-phone',[1510,225,420,650],{E,ink:fg,paper:bg,screenMode:'static',screenText:'×',rotation:.08});
  for(let i=0;i<5;i++){const y=340+i*105;E.text(c,i===4?'×':'127',200,y,60,fg,{font:E.MONO,outline:i<4?1.7:0});line(c,E,355,y-18,680,y-18,fg,2);for(let j=0;j<3;j++)line(c,E,390+j*90,y-34,420+j*90,y-34,fg,5)}
  main={x:1240,y:510,w:1030,h:720,maxSize:250,arrangement:'corner'};frameElements.add('phone-shot:number-records');
 }else{
  if(pose.view===0)groundRise(c,t,E,pose,'flip-phone',phoneBox,{E,ink:fg,paper:bg,screenMode,screenText,rotation:.12});
  else prop(c,t,E,'flip-phone',phoneBox,{E,ink:fg,paper:bg,screenMode,screenText,rotation:pose.view%2?-.12:.15});
  if(long){for(let i=0;i<3;i++){const r=150+i*100+mod(age*75,100),x=pose.view%2?1600:260;E.circle(c,x,530,r,fg,fault===2?2:4)}if(fault===2){line(c,E,90,180,360,450,fg,15);line(c,E,360,180,90,450,fg,15)}}
  prop(c,t,E,'cable',[-40,735,2000,260],{ink:fg,paper:bg,seed:127});frameElements.add('phone-shot:whole-handset');
 }
 if(long)frameElements.add('phone-state:'+state);
 let F=E;
 if(long){const parts=['演示文字演示文字演','旿旿 现在','演示文字演示文字演示'],n=Math.min(2,Math.floor(age/7.2)),start=cue.start_seconds+n*7.2,end=n===2?cue.end_seconds:start+7.2,part=parts[n];F={...E,cueAt:()=>({...cue,text:part,start_seconds:start,end_seconds:end})};frameElements.add('lyric:phone-page-'+(n+1));}
 reader(c,t,F,pose,{...main,color:fg,halo:true});
 frameElements.add('motif:telephone');
}
function coverArt(c,E,id,{x=0,y=90,w=1920,h=870,zoom=1,mode='image'}={}){
 const[s,q]=E.scratch('v05-art-measure',1,1),m=E.art(q,id,[0,0,1,1],{mode}),r=m?.sourceRect?m.sourceRect[2]/m.sourceRect[3]:16/9,dw=Math.max(w,h*r)*zoom,dh=dw/r;
 return E.art(c,id,[x+(w-dw)/2,y+(h-dh)/2,dw,dh],{mode});
}
function gotandaScene(c,t,E,pose,u,reduced){
 E.rect(c,0,0,1920,1080,E.PAPER);
 if(E.hasAsset('CITY_GOTANDA')){c.save();c.beginPath();c.rect(0,90,1920,870);c.clip();coverArt(c,E,'CITY_GOTANDA',{zoom:1.04+clamp((t-131.43)/2.12)*.10});c.restore();frameElements.add('asset:CITY_GOTANDA')}
 const cue=E.cueAt(t);if(cue?.id==='cue_059'){
  const F={...E,cueAt:()=>({...cue,text:'五反田',start_seconds:131.43})};reader(c,t,F,pose,{x:970,y:400,w:700,h:600,maxSize:250,vertical:true,halo:true});
 }else reader(c,t,E,pose,{x:980,y:375,w:1450,h:480,maxSize:192,halo:true,yaw:lerp(-.35,0,out(u/.22))});
 frameElements.add('background:gotanda-street');frameElements.add('timing:gotanda-estimated-third-word');
}
function semanticProps(c,t,E,pose,u,{dark=false}={}){
 const cue=E.cueAt(t),fg=dark?E.PAPER:E.INK,bg=dark?E.INK:E.PAPER,mode=pose.mode;
 if(mode==='full-macaron'){
  for(let i=0;i<3;i++){const x=250+i*700,y=pose.view%2?790:245,r=85+i*15;c.save();c.translate(x,y);c.rotate((i-1)*.2);c.fillStyle=bg;c.strokeStyle=fg;c.lineWidth=7;c.beginPath();c.ellipse(0,-18,r,r*.48,0,Math.PI,0);c.lineTo(r,10);c.ellipse(0,10,r,r*.48,0,0,Math.PI);c.closePath();c.fill();c.stroke();line(c,E,-r,2,r,2,fg,12);c.restore()}frameElements.add('prop:macaron');
 }else if(mode==='full-coffee'){
  c.save();c.translate(350,650);c.rotate(-.14);c.fillStyle=bg;c.strokeStyle=fg;c.lineWidth=10;c.beginPath();c.moveTo(-110,-225);c.lineTo(110,-225);c.lineTo(80,180);c.lineTo(-80,180);c.closePath();c.fill();c.stroke();c.fillStyle=fg;c.fillRect(-120,-250,240,36);c.fillRect(-90,-75,180,90);c.restore();frameElements.add('prop:coffee-cup');
 }else if(mode==='full-book'){
  if(pose.view===0)groundRise(c,t,E,pose,'paper',[90,210,650,700],{ink:fg,paper:bg,seed:301});
  else for(let i=0;i<3;i++)prop(c,t,E,'paper',[50+i*38,250+i*25,650,610],{ink:fg,paper:bg,rotation:-.18+i*.04,seed:301+i});
 }else if(mode==='full-binding'){
  c.save();c.strokeStyle=fg;c.lineWidth=19;for(let i=0;i<5;i++){c.beginPath();c.moveTo(-80,200+i*150);c.bezierCurveTo(500,390+i*50,1350,60+i*180,2000,210+i*155);c.stroke()}c.lineWidth=2;c.strokeStyle=bg;for(let i=0;i<5;i++){c.beginPath();c.moveTo(-80,200+i*150);c.bezierCurveTo(500,390+i*50,1350,60+i*180,2000,210+i*155);c.stroke()}c.restore();frameElements.add('prop:rope');
 }else if(mode==='full-virus'){
  for(let j=0;j<5;j++){const x=150+j*400,y=j%2?840:215,r=55+j*4;E.circle(c,x,y,r,fg,7);for(let k=0;k<8;k++){const a=k*Math.PI/4+t*.4;line(c,E,x+Math.cos(a)*r,y+Math.sin(a)*r,x+Math.cos(a)*(r+25),y+Math.sin(a)*(r+25),fg,7)}}frameElements.add('prop:virus');
 }else if(mode==='full-reject'){
  const x=pose.view%2?1660:240,y=500;for(let i=0;i<3;i++){c.save();c.translate(x,y);c.rotate(i*.20-u*.12);c.strokeStyle=fg;c.lineWidth=8;c.beginPath();c.moveTo(-80,-290);c.bezierCurveTo(110,-100,-160,130,85,310);c.stroke();c.restore()}frameElements.add('motif:tail-then-rejection');
 }
 if(/ワンツー|リズム|お祭り|女子力/.test(cue?.text??''))for(let i=0;i<6;i++){const xx=130+i*325,yy=i%2?850:200,step=Math.floor((t-cue.start_seconds)*155.005/60);E.circle(c,xx,yy,28+(i===step%6?16:0),fg,5)}
}
function fullText(c,t,E,pose,u,reduced){
 const cue=E.cueAt(t),dark=['full-binding','full-virus'].includes(pose.mode)||(pose.backgroundFamily==='rays'&&pose.index%3===2);stage(c,t,E,pose,u,{dark,city:pose.mode==='full-city'});const fg=dark?E.PAPER:E.INK,bg=dark?E.INK:E.PAPER;
 semanticProps(c,t,E,pose,u,{dark});
 if(pose.mode==='full-city'&&E.hasAsset('CITY_TOKYO')){c.save();c.beginPath();c.rect(0,570,1920,390);c.clip();E.art(c,'CITY_TOKYO',[-40-u*80,410,2080,720],{mode:dark?'posterWhite':'posterInk',alignY:'top'});c.restore();frameElements.add('asset:CITY_TOKYO')}
 const cueAge=t-(cue?.start_seconds??pose.start),land=out((cueAge+.02)/.25),view=pose.view??0,layout=cueLayoutAt(cue),drift=(inOut(u)-.5)*40;
 if(pose.characters==='bonnie'){E.art(c,'SIL03',[-1000,-250,1850,1850],{mode:'ink',alignY:'top'});frameElements.add('asset:SIL03')}
 // The whole cue selects a composition. Its second shot changes depth inside
 // that composition instead of repeating a universal "line then keyword" pair.
 if(layout==='corner'){
  reader(c,t,E,pose,{x:pose.characters?1140:1000,y:525,w:pose.characters?1240:1530,h:810,maxSize:260,color:fg,halo:true,arrangement:'corner',yaw:lerp(-.45,view?.10:0,land),pitch:-.03,roll:view?-.035:0,z:view?85:0});
  const word={cue_023:'演示文字',cue_044:'弁护士',cue_067:'麻縄'}[cue?.id]??focusWord(cue,0);if(word)planeText(c,t,E,{key:pose.id+'-corner-emphasis',role:'focus',text:word,x:580,y:645,w:790,h:470,maxSize:430,color:fg,outline:true,yaw:view?-.10:.06,roll:-.035});
  line(c,E,150,265,150,760,fg,8);line(c,E,150,760,515,760,fg,8);
 }else if(layout==='diagonal'){
  reader(c,t,E,pose,{x:pose.characters?1120:970+drift,y:525,w:pose.characters?1210:1650,h:680,maxSize:235,color:fg,halo:true,yaw:lerp(.65,view?-.12:.07,land),pitch:lerp(-.6,-.08,land),roll:view?.17:-.19,z:view?90:0});
  for(const yy of[125,925])line(c,E,-90,yy+120,2010,yy-120,fg,5);
 }else if(layout==='columns'){
  reader(c,t,E,pose,{x:view?1050:1150,y:525,w:1350,h:820,maxSize:260,color:fg,halo:true,arrangement:'columns',yaw:lerp(view?-.55:.50,view?-.08:.07,land),roll:view?.035:-.025,z:view?135:0});
  for(let i=0;i<3;i++)line(c,E,160+i*48,235,160+i*48,820-i*65,fg,i===0?8:2);
 }else if(layout==='scatter'){
  reader(c,t,E,pose,{x:960+drift,y:525,w:1680,h:800,maxSize:285,color:fg,halo:true,arrangement:'scatter',yaw:lerp(-.30,view?.12:0,land),roll:view?-.045:.035,z:view?100:0});
  frameElements.add('motion:scattered-glyphs-gather');
 }else if(layout==='edge'){
  const key={cue_021:'候',cue_047:'东京',cue_065:'子犬'}[cue?.id]??focusWord(cue,0);
  if(key)planeText(c,t,E,{key:pose.id+'-edge-word',role:'focus',text:key,x:960-drift*2,y:660,w:1740,h:620,maxSize:530,color:fg,outline:true,halo:false,yaw:view?.28:-.12,roll:view?.055:-.04,z:view?80:0});
  reader(c,t,E,pose,{x:960,y:250,w:1660,h:330,maxSize:170,color:fg,halo:true,roll:view?.025:-.025,yaw:lerp(-.25,0,land)});
  line(c,E,80,115,1840,115,fg,7);line(c,E,80,920,1840,920,fg,7);
 }else if(layout==='arc'){
  for(let i=0;i<3;i++)E.circle(c,960,650,300+i*100+(view?u*20:0),fg,i===0?4:1.5);
  reader(c,t,E,pose,{x:960+drift,y:490,w:1680,h:770,maxSize:265,color:fg,halo:true,arrangement:'arc',yaw:lerp(view?.35:-.3,0,land),pitch:view?.13:0,roll:view?-.035:.035,z:view?80:0});
 }else{
  reader(c,t,E,pose,{x:990+drift,y:525,w:1580,h:780,maxSize:260,color:fg,halo:true,arrangement:'stair',yaw:lerp(-.50,view?.12:0,land),pitch:lerp(-.6,0,land),roll:view?.025:-.035});
  for(let i=0;i<4;i++){const x=80+i*90,y=780-i*125;line(c,E,x,y,x+90,y,fg,5);line(c,E,x+90,y,x+90,y-125,fg,5)}
 }
 frameElements.add('typography:cue-layout:'+layout);
}
function fullScene(c,t,E,pose,u,reduced){
 if(pose.mode==='full-intro')return fullIntro(c,t,E,pose,u,reduced);
 if(pose.mode==='full-outro')return fullOutro(c,t,E,pose,u,reduced);
 if(pose.mode==='full-interlude'||pose.mode==='full-break')return fullBreak(c,t,E,pose,u,reduced);
 if(pose.mode==='full-phone')return fullPhone(c,t,E,pose,u,reduced);
 if(t>=131.43&&t<133.55)return gotandaScene(c,t,E,pose,u,reduced);
 return fullText(c,t,E,pose,u,reduced);
}
const MODES={opening,paper:paperScene,relay:relayScene,edge:edgeScene,vertical:verticalScene,'head-arrow':headArrowScene,city:cityScene,lens:lensScene,quarter:quarterScene,'quarter-step':quarterStepScene,phone:phoneScene,tunnel:tunnelScene,shards:shardsScene,diagonal:diagonalScene,ending:endingScene,newspaper:newspaperScene,'newspaper-close':newspaperScene,'newspaper-quarter':newspaperScene,'magnifier-beat':magnifierBeatScene,chat:chatScene,'chat-close':chatScene};
function cutAccents(c,t,E,pose,u,reduced){
 if(reduced)return;const age=t-pose.start,duration=pose.end-pose.start;
 // Short paper slices only occupy the edges, not a repetitive full-screen flash.
 if(age<.09){const p=out(age/.09),fg=pose.index%2?E.PAPER:E.INK;for(let i=0;i<4;i++){const width=(1-p)*(190+i*35);E.rect(c,i%2?1920-width:0,155+i*225,width,50+i*9,fg)}}
 if(pose.clip==='final-burst'&&pose.mode!=='ending')E.apple(c,1775,930,23,E.RED);
}
function renderLegacyV05(c,t,E,{reducedMotion=false}={}){
 const pose=poseAt(t);if(!pose)return null;framePlaneDiagnostics.length=0;frameElements.clear();const u=pAt(t,pose.start,pose.end),reduced=Boolean(reducedMotion);
 const lensState=lensKeywordAt(t),paperPageState=newspaperPageAt(t),gotanda=t>=131.43&&t<133.55,chat=t>=127.37&&t<131.43;
 const actualPose=lensState?{...pose,mode:'magnifier-keyword',label:'整体大放大镜 / 三词定物 / 三次内图翻转',dominant:'magnifier+text',characters:lensState.mode==='fanny-silhouette'?'fanny':null,characterVisible:lensState.mode==='fanny-silhouette'}:paperPageState?{...pose,mode:'newspaper-pages',label:`报纸主图 ${paperPageState.page} / I→IV翻页`,dominant:'newspaper'}:gotanda?{...pose,mode:'gotanda-street',label:'五反田 / 街道纵深',dominant:'text+city',avatarCharacters:[],characters:null}:chat?{...pose,mode:'chat-records',label:'女子会→推文→二次会 / 九卡连续飞入',avatarCharacters:['bonnie','fanny'],characters:null}:pose;
 c.save();c.globalAlpha=1;c.globalCompositeOperation='source-over';const draw=lensState?magnifierBeatScene:paperPageState?newspaperScene:gotanda?gotandaScene:chat?chatScene:pose.mode.startsWith('solar')?solarScene:pose.mode.startsWith('year')?firstYearScene:pose.mode.startsWith('full-')?fullScene:MODES[pose.mode]??fullScene;draw(c,t,E,pose,u,reduced);cutAccents(c,t,E,pose,u,reduced);c.restore();
 const cue=E.cueAt(t),glyphs=chars(cue?.text.trim()??''),envelopes=glyphs.map((_,i)=>glyphEnvelope(cue,t,i,glyphs.length)),rise=frameElements.has('motion:ground-rise')||frameElements.has('motion:text-ground-rise'),turn=frameElements.has('motion:ground-rise')?.42:.3,elapsed=t-pose.start;
 const cueMotion={type:'glyph-blur-motion',cueId:cue?.id??null,direction:pose.entryDirection??'left',layoutFamily:ordinaryMode(pose)?cueLayoutAt(cue):null,glyphCount:glyphs.length,entering:envelopes.filter(e=>e.phase==='enter').length,reading:envelopes.filter(e=>e.phase==='read').length,exiting:envelopes.filter(e=>e.phase==='exit').length,maxBlur:envelopes.length?Math.max(...envelopes.map(e=>e.blur??0)):0,tailSeconds:cue?Math.min(.30,Math.max(.20,(cue.end_seconds-cue.start_seconds)*.23)):0};
 const motionState=quarterStepAt(t,pose)??(rise?{motion:'ground-rise',pitch:lerp(frameElements.has('motion:ground-rise')?-1.43:-1.42,0,elapsed>=turn?1:inOut(elapsed/turn)),progress:elapsed>=turn?1:inOut(elapsed/turn),turnSeconds:turn,settled:elapsed>=turn}:null);
 return{version:RENDERER_VERSION,pose:ordinaryMode(pose)?{...actualPose,layoutFamily:cueLayoutAt(cue)}:actualPose,cue,lyricEnvelope:lyricEnvelopeAt(t,E.cueAt),textPlanes:framePlaneDiagnostics.slice(),elements:[...frameElements],semanticFocus:semanticFocusAt(t,E),motionState,cueMotion,inkDiagnostics:{model:'world-space-complete-contour',placement:'corner',safeArea:{x:360,y:220,w:1200,h:620},tileClip:false},yearState:yearAt(t),lensState,paperPageState,smallCharacterAssets:[...frameElements].filter(s=>s.startsWith('asset:CHIBI_')),characterExposure:CHARACTER_EXPOSURE};
}

// V05 staging uses one absolute scene clock. Camera moves never restart at a
// cue boundary unless the request explicitly calls for a page or device cut.
const V05_CHARACTERS=[];
const V05_PAPER_CACHE=new Map();
let V05_SCENE_INFO={};
function vprop(c,t,E,kind,box,o={}){const[x,y,w,h]=box,r=renderPropsV03(c,t,{kind,x,y,w,h,ink:E.INK,paper:E.PAPER,red:E.RED,E,start:o.start??poseAt(t)?.start??0,...o});if(r?.renderedCards)V05_SCENE_INFO.chatTranscriptState=r.renderedCards;trackCornerInk(c,kind,r);if(r?.drawn!==false){frameElements.add('prop:'+kind);for(const id of r?.elements??[])frameElements.add(id)}return r}
function vstage(c,t,E,p,{dark=false,kind='archive'}={}){
 let style=kind;if(kind==='archive'){if(['phone-bubbles','portrait-chat','phone-push'].includes(p.mode))style='circuit';else if(['macaron','coffee'].includes(p.mode))style='musical';else if(['portrait-vertical','nerves','pillow','avatar','phone-drop','duo-portraits','duo-upper','year-scene','year-reentry'].includes(p.mode))style='portrait-print';else if(p.mode==='expressions')style='plain';else if(p.mode==='cabinet')style='cabinet-room';}
 const ink=dark?E.PAPER:E.INK,paper=dark?E.INK:E.PAPER;E.rect(c,0,0,1920,1080,paper);
 if(!dark){const g=c.createRadialGradient(980,520,230,980,520,1130);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.085)');c.fillStyle=g;c.fillRect(0,0,1920,1080)}
 const age=t-p.start,travel=clamp(age/(p.end-p.start));
 if(style==='archive'){for(let i=0;i<20;i++){const x=100+i*90;line(c,E,x,140,x,150+(i%5===0?18:0),ink,1.5);line(c,E,x,915,x,905-(i%5===0?18:0),ink,1.5)}}
 if(style==='circuit')for(const side of[0,1])for(let i=0;i<5;i++){const x=side?1810-i*28:110+i*28,y=190+i*110;line(c,E,x,y,x,y+310,ink,1.5);line(c,E,x,y+310,x+(side?-90:90),y+310,ink,1.5);E.circle(c,x,y,5,ink,2)}
 if(style==='musical'){for(let i=0;i<3;i++)E.circle(c,960,820,285+i*105,ink,1.2);for(let i=0;i<5;i++){line(c,E,60,800+i*21,410,800+i*21,ink,1.2);line(c,E,1510,800+i*21,1860,800+i*21,ink,1.2)}}
 if(style==='portrait-print'){for(const side of[0,1])for(let i=0;i<13;i++)for(let j=0;j<7;j++){const x=side?1660+i*17:50+i*17,y=side?175+j*17:800+j*17;E.circle(c,x,y,1.8,ink,0)}line(c,E,80,150,470,150,ink,3);line(c,E,1480,905,1840,905,ink,3)}
 if(style==='cabinet-room'){line(c,E,0,930,1920,930,ink,4);for(let i=0;i<8;i++)line(c,E,960+(i-4)*90,930,960+(i-4)*480,1080,ink,1.5)}
 if(kind==='optical')for(let i=0;i<4;i++)E.circle(c,480+travel*25,520,230+i*130,ink,i===0?4:1.5);
 if(kind==='rays')for(let i=0;i<20;i++){const a=i/20*Math.PI*2;line(c,E,960+Math.cos(a)*620,520+Math.sin(a)*390,960+Math.cos(a)*1600,520+Math.sin(a)*1300,ink,i%4===0?7:1.5)}
 if(kind==='city'&&E.hasAsset('CITY_TOKYO')){c.save();c.beginPath();c.rect(0,585,1920,375);c.clip();E.art(c,'CITY_TOKYO',[-80-travel*80,310,2100,780],{mode:dark?'posterWhite':'posterInk'});c.restore();frameElements.add('asset:CITY_TOKYO')}
 if(kind==='threads'){const pts=[[90,180],[490,130],[1780,180],[1840,830],[1200,915],[80,850]];pts.forEach(([x,y],i)=>{const [xx,yy]=pts[(i+1)%pts.length];line(c,E,x,y,xx,yy,ink,2);E.circle(c,x,y,9,ink,2)})}
 const safeArea={x:350,y:200,w:1240,h:650},hug=p.mode.includes('hug'),pair=hug||p.mode==='portrait-vertical'?['tl','tr']:p.mode==='nerves'?['bl','br']:p.index%3===1?['tr','bl']:['tl','br'];
 for(let i=0;i<2;i++)vprop(c,t,E,'ink',[0,0,1920,1080],{placement:'corner',corner:pair[i],radiusPixels:(i?94:112)+(p.index%3)*5,count:1,seed:(i?130:80)+p.index*(i?7:11),safeArea,ink,paper,viewport:{x:0,y:90,w:1920,h:870}});
 V05_SCENE_INFO.revisionState={...(V05_SCENE_INFO.revisionState??{}),cornerInk:{placement:'complete-groups-inside-active-picture',activeBounds:[0,90,1920,960],corners:pair,sceneSpecific:true,behindCharactersAndLyrics:true}};
 frameElements.add('background:v05-'+style);frameElements.add('background:no-short-reset');return{ink,paper};
}
function character(c,t,E,id,box,{role='bonnie',silhouette=false,mirror=false,rotation=0,alpha=1,maskOnly=false,keepTie=false,color='black'}={}){
 const chorus=(t>=59.24&&t<76.22)||(t>=147.59&&t<161.883)||(t>=162.17&&t<177.53);if(!chorus){silhouette=true;keepTie=true;color='black';}
 const motionStart=t>=147.59?147.59:59.24,motionEnd=t>=147.59?161.883:76.22;
 const movingChorus=t>=motionStart&&t<motionEnd,phase=(t-motionStart)*1.65+(role==='fanny'?1.8:0),edge=movingChorus?Math.min(1,(t-motionStart)/.15,(motionEnd-t)/.15):0;
 const dx=movingChorus?Math.sin(phase)*16*edge:0,dy=movingChorus?Math.cos(phase*.83)*11*edge:0,dr=movingChorus?Math.sin(phase*.91)*.026*edge:0;
 rotation+=dr;box=[box[0]+dx,box[1]+dy,box[2],box[3]];
 const fallback=role==='fanny'?'FANNY':'A13',asset=E.hasAsset(id)?id:fallback,[x,y,w,h]=box;
 if(movingChorus){frameElements.add('character:chorus-small-rotation-drift');const states=V05_SCENE_INFO.revisionState?.chorusCharacterMotion??[];V05_SCENE_INFO.revisionState={...(V05_SCENE_INFO.revisionState??{}),chorusCharacterMotion:[...states,{asset,role,dx,dy,rotationDelta:dr,absoluteSongTime:true}]};}
 c.save();c.translate(x+w/2,y+h/2);c.rotate(rotation);E.art(c,asset,[-w/2,-h/2,w,h],{mode:silhouette?(color==='white'?'white':'ink'):'image',mirror,alpha,alignY:'top'});
 if(silhouette&&keepTie)E.art(c,asset,[-w/2,-h/2,w,h],{mode:'tie',mirror,alpha,alignY:'top'});c.restore();
 if(!maskOnly){V05_CHARACTERS.push({asset,box,mirror,rotation,silhouette,role});frameElements.add('asset:'+asset);frameElements.add('character:'+role);if(keepTie)frameElements.add('character:retained-colored-tie');if(keepTie&&role==='bonnie'&&/BONNIE_(?:MAG_V06|PHONE_V06|FULL_A1[013])/.test(asset)){frameElements.add('character:tie-flower-detail');V05_SCENE_INFO.revisionState={...(V05_SCENE_INFO.revisionState??{}),tieFlowerDetails:[...(V05_SCENE_INFO.revisionState?.tieFlowerDetails??[]),{asset,box,mirror,rotation,source:asset.endsWith('V06')?'source-coordinate-vector-plum':'native-floral-shape-on-pink',preserved:true}]}}}
 return asset;
}
function vtype(c,t,E,p,o={}){return planeText(c,t,E,{key:'v05-'+p.id+'-'+(o.key??'main'),role:'main',x:960,y:525,w:1480,h:690,maxSize:215,halo:true,...o})}
function contrastType(c,t,E,p,o={}){
 const[mask,m]=E.scratch('v11-scene-contrast-type',1920,1080);vtype(m,t,E,p,{...o,color:'#FFFFFF',halo:false});
 const glyph=m.getImageData(0,90,1920,870),background=c.getImageData(0,90,1920,870).data,pixels=glyph.data;let whitePixels=0,blackPixels=0;
 for(let i=0;i<pixels.length;i+=4){if(!pixels[i+3])continue;const value=.2126*background[i]+.7152*background[i+1]+.0722*background[i+2]<117?255:0;pixels[i]=pixels[i+1]=pixels[i+2]=value;if(value)whitePixels++;else blackPixels++}
 m.putImageData(glyph,0,90);c.drawImage(mask,0,0);frameElements.add('typography:actual-character-ink-intersection');frameElements.add('typography:v11-actual-scene-contrast');
 V05_SCENE_INFO.revisionState={...(V05_SCENE_INFO.revisionState??{}),actualSceneLyricContrast:{whitePixels,blackPixels,numberAndCharacterBackgroundIncluded:true,originalGlyphAlphaPreserved:true}};
}

function flatType(t,E,{key='flat',text=E.cueAt(t)?.text??'',cue=E.cueAt(t),w=1240,h=600,size=200,staticInk=false,color=E.INK,guides=false,arrangement='standard',align='left'}={}){
 const resolution=w<500?8:2,sw=Math.round(w*resolution),sh=Math.round(h*resolution),[s,q]=E.scratch('v05-flat-'+key,sw,sh);if(!text||!cue)return s;const all=chars(text),baseFit=fitPlaneGlyphs(q,text,{sw,sh,font:E.JP,maxSize:size*resolution,vertical:false,halo:false,outline:false,ghost:false,arrangement}),centerOffset=align==='center'?(sw-baseFit.nominalBounds.left-baseFit.nominalBounds.right)/2:0,fit=centerOffset?{...baseFit,points:baseFit.points.map(g=>({...g,x:g.x+centerOffset}))}:baseFit;q.font=`700 ${fit.size}px ${E.JP}`;q.fillStyle=color;q.textBaseline='alphabetic';
 if(guides){const ys=[...new Set(fit.points.map(g=>Math.round(g.y+fit.size*.16)))];for(const y of ys){q.strokeStyle=color;q.lineWidth=2;q.beginPath();q.moveTo(60,y);q.lineTo(sw-60,y);q.stroke()}}
 for(const g of fit.points){const e=staticInk?{alpha:1,enter:1,exit:0,blur:0}:glyphEnvelope(cue,t,g.index,all.length),shift=staticInk?{dx:0,dy:0}:glyphShift(g,e,t,all.length,'standard');if(e.alpha<=0)continue;q.save();q.globalAlpha=e.alpha;q.filter=e.blur>.05?`blur(${e.blur}px)`:'none';q.fillText(g.ch,g.x+shift.dx,g.y+shift.dy);q.restore()}
 const boxes=glyphBoxesAt(fit,cue,t,all.length,{halo:false,outline:false,ghost:false});framePlaneDiagnostics.push({role:staticInk?'printed':'main',text,cueId:cue.id,poseId:poseAt(t)?.id,textureWidth:sw,textureHeight:sh,fontSize:fit.size,lineCount:fit.lineCount,padding:fit.padding,glyphBoxes:boxes,allGlyphsInsideTexture:boxes.every(b=>b.left>=0&&b.top>=0&&b.right<=sw&&b.bottom<=sh),allMotionInsidePadding:true,unifiedPaper:true});return s;
}
function unifiedPaper(c,t,E,p,{key=p.mode,box=[70,-25,1780,1112],roll=-.055,yaw=0,pitch=0,images=false,text=null,bodyRect=null,header='調査記録 / CASE 127',recordContent=false}={}){
 const [paper,q]=E.scratch('v05-unified-paper-'+key,1600,1000);q.fillStyle=E.PAPER;q.fillRect(0,0,1600,1000);q.strokeStyle=E.INK;q.lineWidth=6;q.strokeRect(20,20,1560,960);q.lineWidth=2;q.strokeRect(35,35,1530,930);E.text(q,header,100,155,43,E.INK,{font:E.JP});line(q,E,95,190,1505,190,E.INK,4);
 let r=bodyRect??[140,300,1320,570];if(images){E.art(q,'DOCUMENT_PICTURE_01',[80,270,480,500],{mode:'print'});E.art(q,'DOCUMENT_ICON_02',[400,690,170,170],{mode:'print'});frameElements.add('asset:DOCUMENT_PICTURE_01');frameElements.add('asset:DOCUMENT_ICON_02');r=[640,270,850,600]}
 if(recordContent){
  const rows=['調査対象：BONNIE / FANNY','事件番号：CASE 127　／　記録区分：現場資料','演示 A演示文字演示文字演示','演示 B演示文字演示文字演示','演示文字演示文字演示文　演　文字演示文字'];
  rows.forEach((s,i)=>{E.text(q,s,115,285+i*112,i?39:49,E.INK,{font:E.JP});line(q,E,110,315+i*112,1490,315+i*112,E.INK,1.3)});
  E.text(q,'演示文字演示文字演示',115,865,32,E.INK,{font:E.JP});E.text(q,'演示文字演示文 / GUMI',790,865,32,E.INK,{font:E.JP});
  E.text(q,'PRIVATE ARCHIVE / EVIDENCE LOG / 127',115,928,23,E.INK,{font:E.MONO});frameElements.add('intro:populated-case-record');
 }else{const phrase=text??E.cueAt(t)?.text??'',cue=E.cueAt(t)??(phrase?{id:'decoration-case-127',text:phrase,start_seconds:p.start,end_seconds:p.end}:null),body=flatType(t,E,{key:key+'-body',text:phrase,cue,w:r[2],h:r[3],size:190,guides:true,arrangement:key==='telephone-report'?'line':'standard'});if(!E.cueAt(t)&&phrase&&framePlaneDiagnostics.length){framePlaneDiagnostics.at(-1).role='decoration';framePlaneDiagnostics.at(-1).cueId=null;}q.drawImage(body,...r);}
 const [x,y,w,h]=box,hh=w*1000/1600;projectPlane(c,paper,cameraQuad({x:x+w/2,y:y+h/2,w,h:hh,roll,yaw,pitch}),{alpha:1});frameElements.add('document:single-unified-paper-text-lines');return paper;
}
function legacyPhoneChatV05(c,t,E,p,{box=[810,95,1020,1658],text=null,mode='chat',push=1}={}){
 const cue=E.cueAt(t),phrase=text??cue?.text??'',contentRenderer=(q,tt,b)=>{q.fillStyle=E.PAPER;q.fillRect(0,0,b.w,b.h);q.strokeStyle=E.INK;q.lineWidth=2;E.text(q,'ボニー',b.w*.12,30,19,E.INK,{font:E.JP});
  if(mode==='call'){q.strokeRect(8,43,b.w-16,b.h-51);const body=flatType(t,E,{key:'lcd-call',text:phrase,cue,w:Math.max(180,b.w-24),h:b.h-70,size:37});q.drawImage(body,12,55,b.w-24,b.h-75);return;}
  let parts=[];if(phrase){const g=chars(phrase.replace(/\s+/g,''));if(cue?.id==='cue_007')parts=[g.slice(0,4).join(''),g.slice(4,8).join(''),g.slice(8).join('')];else if(cue?.id==='cue_008')parts=[g.slice(0,5).join(''),g.slice(5).join('')];else{const count=g.length>17?3:2,n=Math.ceil(g.length/count);for(let i=0;i<count;i++)parts.push(g.slice(i*n,(i+1)*n).join(''));}parts=parts.filter(Boolean);}
  const gap=9,top=46,row=(b.h-top-10)/Math.max(1,parts.length),bw=b.w*.83;for(let i=0;i<parts.length;i++){const right=i%2===1,x=right?b.w-bw-5:5,y=top+i*row,h=row-gap; q.fillStyle=right?'#E5E5E3':E.PAPER;q.strokeStyle=E.INK;q.lineWidth=1.5;q.beginPath();q.roundRect(x,y,bw,h,7);q.fill();q.stroke();q.beginPath();q.moveTo(right?x+bw-4:x+4,y+h-18);q.lineTo(right?x+bw+5:x-5,y+h-9);q.lineTo(right?x+bw-4:x+4,y+h-5);q.fill();q.stroke();const local=cue?{...cue,text:parts[i],start_seconds:cue.start_seconds+i*.17}:null,body=flatType(t,E,{key:'lcd-'+p.mode+'-bubble-'+i,text:parts[i],cue:local,w:Math.max(170,bw-18),h:Math.max(40,h-10),size:35});q.drawImage(body,x+9,y+5,bw-18,h-10);}
  if(parts.length){frameElements.add('carrier:actual-chat-bubbles');frameElements.add('chat-bubble-count:'+parts.length);frameElements.add('chat-screen-cue:'+(cue?.id??''));}
 };
 vprop(c,t,E,'flip-phone',box,{screenMode:mode,contentRenderer,rotation:0});frameElements.add('carrier:phone-screen-lyrics');
}
function arcLyric(c,t,E,p,{start=p.start,end=p.end,coffee=false}={}){
 const cue=E.cueAt(t);if(!cue)return;const all=chars(cue.text),cx=960,cy=735,rx=760,ry=390,samples=[];let length=0,prev=null;for(let i=0;i<=400;i++){const a=lerp(-Math.PI+.23,-.23,i/400),pt=[Math.cos(a)*rx,Math.sin(a)*ry];if(prev)length+=Math.hypot(pt[0]-prev[0],pt[1]-prev[1]);samples.push({a,length});prev=pt}const angles=all.map((_,i)=>{const target=length*(i+.5)/Math.max(1,all.length);let j=1;while(j<samples.length-1&&samples[j].length<target)j++;const a=samples[j-1],b=samples[j];return lerp(a.a,b.a,(target-a.length)/Math.max(.001,b.length-a.length))}),font=Math.min(98,length*.81/Math.max(1,all.length));
 for(let i=0;i<all.length;i++){const a=angles[i],e=glyphEnvelope(cue,t,i,all.length),x=cx+Math.cos(a)*rx,y=cy+Math.sin(a)*ry,tangent=Math.atan2(ry*Math.cos(a),-rx*Math.sin(a));c.save();c.translate(x,y);c.rotate(tangent);c.globalAlpha=e.alpha;c.filter=e.blur>.05?`blur(${e.blur}px)`:'none';c.font=`700 ${font}px ${E.JP}`;c.textAlign='center';c.textBaseline='middle';c.strokeStyle=E.PAPER;c.lineWidth=5;c.fillStyle=E.INK;c.strokeText(all[i],0,0);c.fillText(all[i],0,0);c.restore()}
 frameElements.add('typography:semicircle-tangent-spaced');
 if(coffee){vprop(c,t,E,'sugar-cube',[610,330,700,650],{start,progress:pAt(t,start,end),drawCup:true});}
 else{E.art(c,'HARAKIRI_KNIFE',[100,670,350,250],{mode:'print'});E.art(c,'HARAKIRI_RELIC',[1480,660,350,270],{mode:'print'});frameElements.add('asset:HARAKIRI_KNIFE');frameElements.add('asset:HARAKIRI_RELIC');c.save();c.translate(960,795);c.fillStyle=E.PAPER;c.strokeStyle=E.INK;c.lineWidth=8;c.beginPath();c.ellipse(0,0,150,75,0,0,Math.PI*2);c.fill();c.stroke();line(c,E,-145,0,145,0,E.INK,14);c.restore()}
}
function v05Intro(c,t,E,p){const u=pAt(t,p.start,p.end);vstage(c,t,E,p,{kind:p.mode==='intro-title'?'threads':'optical'});
 if(p.mode==='intro-lens'){unifiedPaper(c,t,E,p,{box:[140,50,1500,938],roll:-.08,header:'BONNIE / 調査開始',recordContent:true});vprop(c,t,E,'magnifier',[lerp(1940,560,out(u/.72)),100,1050,1050],{sourceCanvas:c.canvas,region:{x:550,y:250,w:350,h:350},zoom:1.8,rotation:lerp(-.8,-.15,out(u))});}
 if(p.mode==='intro-title'){for(let i=0;i<4;i++)vprop(c,t,E,'paper',[-200+i*530,110+i%2*420,640,540],{rotation:(i-1.5)*.12,seed:50+i});if(E.hasAsset('CITY_TOKYO')){c.save();c.beginPath();c.rect(0,760,1920,200);c.clip();E.art(c,'CITY_TOKYO',[-70,510,2060,700],{mode:'posterInk'});c.restore();frameElements.add('asset:CITY_TOKYO')}titleGlyphs(c,t,E,SOURCE_CUES[2].text,{x:960,y:480,size:175,start:2.2,end:10.69});E.art(c,'HARAKIRI_RELIC',[1350,650,390,260],{mode:'print'});frameElements.add('asset:HARAKIRI_RELIC');}
 if(p.mode==='intro-optic'){unifiedPaper(c,t,E,p,{box:[180,30,1530,956],roll:lerp(-.11,-.03,u),header:'調査記録 / BONNIE',recordContent:true});vprop(c,t,E,'magnifier',[440+u*180,80,1000,1000],{sourceCanvas:c.canvas,region:{x:500+u*330,y:280,w:350,h:350},zoom:1.8,rotation:lerp(-.75,1.9,inOut(u))});frameElements.add('motion:one-continuous-magnifier-rotation');}
 if(p.mode==='intro-document'){unifiedPaper(c,t,E,p,{box:[70,-15,1780,1112],roll:lerp(-.32,.025,inOut(u)),yaw:lerp(-.3,.03,inOut(u)),header:'邦妮 / 調査档案 127',text:'調査対象：邦妮　証拠資料／事件番号127'});frameElements.add('document:aligned-baselines');}
}
function v05DocumentScene(c,t,E,p){vstage(c,t,E,p,{kind:'threads'});const u=pAt(t,p.start,p.end);
 if(p.mode==='document-reveal'){unifiedPaper(c,t,E,p,{key:'employment',box:[80,-40,1680,1050],roll:-.08,yaw:.04});vprop(c,t,E,'magnifier',[200+u*1050,260,650,650],{sourceCanvas:c.canvas,region:{x:430+u*750,y:350,w:240,h:240},zoom:2,rotation:-.25});frameElements.add('motion:document-lens-drag-reveal');}
 else if(p.mode==='document-chorus'){const flipStart=56.90,flipEnd=57.22,progress=pAt(t,flipStart,flipEnd),turn=t<flipStart||t>=flipEnd?0:progress<.5?lerp(0,1.54,inOut(progress*2)):lerp(-1.54,0,inOut((progress-.5)*2));unifiedPaper(c,t,E,p,{key:'first-chorus-paper',box:[50,-20,1540,963],roll:lerp(-.13,-.035,pAt(t,55.72,58.95)),yaw:turn});vprop(c,t,E,'flip-phone',[1470,195,500,812],{screenText:'127',rotation:.12});frameElements.add('motion:lyric-page-turn');if(t>=flipStart&&t<flipEnd){frameElements.add('document:real-edge-page-flip');V05_SCENE_INFO.pageFlipState={start:flipStart,end:flipEnd,progress,yaw:turn,side:progress<.5?'old':'new'}}}
 else if(p.mode==='document-law'||p.mode==='document-how'){const age=pAt(t,105.68,108.85);unifiedPaper(c,t,E,p,{key:'publishing',images:true,box:[45,-15,1830,1144],roll:lerp(-.1,.035,age),yaw:lerp(.1,-.05,age),header:'公開記録 / 出版物'});}
 else{const cue=E.cueAt(t);unifiedPaper(c,t,E,p,{key:'telephone-report',box:[10,-30,1900,1188],roll:lerp(-.10,-.03,pAt(t,96.2,99.41)),text:'演示文字演示文字演示文',bodyRect:[110,350,1380,410],header:'回線記録 / 127'});frameElements.add('phone:corrected-currently-unavailable');}
}
function v05PortraitScene(c,t,E,p){vstage(c,t,E,p,{kind:p.mode==='overload'?'threads':'archive'});const u=pAt(t,p.start,p.end);
 if(p.mode==='head-investigation'){character(c,t,E,'BONNIE_FULL_A13',[-70,80,720,1100]);vtype(c,t,E,p,{x:1050,y:485,w:1010,h:620,maxSize:185});arrow(c,E,1430,240,540,240,E.INK,7);vprop(c,t,E,'magnifier',[1340,480,620,620],{sourceCanvas:c.canvas,region:{x:760+u*200,y:315,w:260,h:260},zoom:2,rotation:.1});}
 else if(p.mode==='portrait-vertical'){character(c,t,E,'BONNIE_FULL_A11',[-35-u*35,60-u*25,1000+u*70,1320+u*92]);vtype(c,t,E,p,{x:1390,y:520,w:720,h:820,vertical:true,maxSize:190});}
 else if(p.mode==='portrait-chat'){character(c,t,E,'BONNIE_FULL_A11',[-70,70,950,1250]);phoneChat(c,t,E,p,{box:[950,20,930,1511]});}
 else if(p.mode==='nerves'){character(c,t,E,'BONNIE_FULL_A10',[930,50,1030,1320]);vtype(c,t,E,p,{x:465,y:520,w:690,h:820,vertical:true,arrangement:'columns',maxSize:205});}
 else if(p.mode==='overload'){character(c,t,E,'BONNIE_FULL_A13',[1030,75,900,1180]);vtype(c,t,E,p,{x:470,y:505,w:720,h:820,vertical:true,maxSize:200});const radius=34+out(clamp((t-71.9)/.3))*45;c.fillStyle=E.INK;c.beginPath();c.arc(955,550,radius,0,Math.PI*2);c.fill();for(let i=0;i<7;i++){const a=i*Math.PI*2/7;E.circle(c,955+Math.cos(a)*115,550+Math.sin(a)*115,3+i%3,E.INK,0)}}
 else if(p.mode==='single-hug'){character(c,t,E,'SIL03',[-750,-180,1660,1660],{silhouette:true});vtype(c,t,E,p,{x:1240,y:500,w:1050,h:740,maxSize:205});frameElements.add('character:single-bonnie-preserved');}
}
function v05Chorus(c,t,E,p){const m=p.mode,u=pAt(t,p.start,p.end);vstage(c,t,E,p,{kind:m==='head-duo'?'rays':'archive'});
 if(m==='flower-profiles'){const first=t<59.99,id=first?'SIL03':'FANNY_PROFILE',role=first?'bonnie':'fanny';character(c,t,E,id,first?[-660,-130,1550,1550]:[1120,-160,1550,1550],{role,silhouette:true});const cue=E.cueAt(t),raw=cue?.text??'',split=raw.indexOf('が')+1,part=first?raw.slice(0,split):raw.slice(split),F={...E,cueAt:()=>cue?{...cue,text:part}:null};vtype(c,t,F,p,{x:first?1330:600,y:500,w:800,h:500,maxSize:215});}
 else if(m==='head-duo'){character(c,t,E,'SIL03',[-700,-200,1650,1650],{silhouette:true});character(c,t,E,'FANNY_PROFILE',[1040,-210,1650,1650],{role:'fanny',silhouette:true});contrastType(c,t,E,p,{x:960,y:525,w:1840,h:760,maxSize:270});}
 else if(m==='kana-turn'){const cue=E.cueAt(t),part=cue?.text.startsWith('さあ')?'さあ':chars(cue?.text??'').slice(0,2).join(''),F={...E,cueAt:()=>cue?{...cue,text:part}:null};vtype(c,t,F,p,{x:960,y:520,w:2200-650*out(u),h:1050,maxSize:650,roll:lerp(-.26,.03,inOut(u))});frameElements.add('transition:standalone-formal-kana');}
 else if(m==='duo-portraits'||m==='duo-upper'){const alt=m==='duo-upper';character(c,t,E,alt?'BONNIE_FULL_A11':'BONNIE_FULL_A10',[-130,alt?100:310,1050,1450]);character(c,t,E,'FANNY_FULL_V05',[1020,alt?100:280,1050,1450],{role:'fanny',mirror:true});contrastType(c,t,E,p,{x:960,y:alt?390:300,w:1680,h:510,maxSize:215});}
 else if(m==='year-scene'||m==='year-reentry'){const y=yearAt(t),a=y?.start??p.start,b=y?.end??p.end;drawYear(c,t,E);if(t<a+.25){const exit=t<=a?0:inOut((t-a)/.25);character(c,t,E,'BONNIE_FULL_A11',[-130,100-exit*1600,1050,1450]);character(c,t,E,'FANNY_FULL_V05',[1020,100+exit*1600,1050,1450],{role:'fanny',mirror:true});}if(m==='year-reentry'){const enter=out(u),r=1-enter;character(c,t,E,'SIL03',[-850-r*1100,-220-r*950,1700,1700],{silhouette:true,rotation:lerp(-.65,0,enter)});character(c,t,E,'FANNY_PROFILE',[1110+r*1100,-210+r*1150,1700,1700],{role:'fanny',silhouette:true,rotation:lerp(.65,0,enter)});}vtype(c,t,E,p,{x:960,y:y?.foreground?810:300,w:1530,h:340,maxSize:155});frameElements.add('timing:local-original-5fps-visual');}
 else if(m==='duo-hug'){const start=69.0,enter=out(pAt(t,start,69.55));character(c,t,E,'SIL03',[-840-(1-enter)*600,-220-(1-enter)*500,1700,1700],{silhouette:true,rotation:lerp(-.38,0,enter)});character(c,t,E,'FANNY_PROFILE',[1120+(1-enter)*600,-210+(1-enter)*600,1700,1700],{role:'fanny',silhouette:true,rotation:lerp(.38,0,enter)});const cue=E.cueAt(t),[bubble,q]=E.scratch('v05-hug-bubble',800,800);q.fillStyle=E.PAPER;q.strokeStyle=E.INK;q.lineWidth=6;q.beginPath();q.ellipse(400,350,320,290,0,0,Math.PI*2);q.fill();q.stroke();q.beginPath();q.moveTo(160,500);q.lineTo(10,650);q.lineTo(220,570);q.fill();q.stroke();const body=flatType(t,E,{key:'hug',w:550,h:510,size:135});q.drawImage(body,125,95,550,510);c.drawImage(bubble,570,170,800,800);frameElements.add('carrier:bonnie-owned-speech-bubble');}
}
function v05PhonePassage(c,t,E,p){const u=pAt(t,p.start,p.end);vstage(c,t,E,p,{kind:p.mode==='phone-detail'?'threads':'optical'});
 const cue=E.cueAt(t),body=t<89.6?'演示文字演示文字':'演示文字演示文字演示文',local=cue?{...cue,text:body,start_seconds:t<89.6?77.83:89.6}:null,F={...E,cueAt:()=>local};
 if(p.mode==='phone-long'){const scale=lerp(1.8,2.6,inOut(pAt(t,77.83,89.6)));phoneChat(c,t,F,p,{box:[960-320*scale,520-305*scale,640*scale,1040*scale],text:body,mode:'call'});}
 else{const keypad=t<93.1,range=keypad?[89.6,93.1]:[93.1,96.2],a=pAt(t,...range);phoneCrop(c,t,E,keypad?[145,565,350,443]:[165,130,310,380],{x:keypad?1060:-90,y:keypad?-20:170,w:keypad?1000:790,yaw:keypad?lerp(-.3,-.08,a):lerp(.22,.08,a),roll:keypad?.1:-.08,ink:E.INK,paper:E.PAPER,screenText:'NO SIGNAL\n×'});vtype(c,t,F,p,{x:keypad?530:1290,y:515,w:keypad?1000:1120,h:650,maxSize:205});frameElements.add('phone-shot:'+(keypad?'continuous-keypad-close':'continuous-lcd-close'));}
 frameElements.add('phone:display-without-parentheses');
}
function v05Magnifier(c,t,E,p){vstage(c,t,E,p,{kind:'optical'});const state=lensKeywordAt(t);vprop(c,t,E,'magnifier',[225,-247,1052,1351],{contentMode:state?.mode??'lyrics',contentUpright:true,contentFlipProgress:state?.flip?.progress,scan:false,zoom:state?.word?1.05:1.45,rotation:-Math.PI/2});
 if(state?.word){const cue=E.cueAt(t),terms=['演示文字','演示文字','演示文字'],d=(127.37-125.77)/3;for(let i=0;i<=state.index;i++){const local={...cue,text:terms[i],start_seconds:125.77+i*d},F={...E,cueAt:()=>local};vtype(c,t,F,p,{key:'word-'+i,text:terms[i],x:1440,y:280+i*220,w:810,h:260,maxSize:205,outline:i<state.index});}if(state.index===2){const suffix=cue?.text.split('演示文字')[1]??'';if(suffix){const F={...E,cueAt:()=>({...cue,text:suffix,start_seconds:125.77+2*d})};vtype(c,t,F,p,{key:'suffix',text:suffix,x:1440,y:875,w:810,h:170,maxSize:118});}}}else vtype(c,t,E,p,{x:1440,y:520,w:810,h:740,maxSize:205});
 if(state?.mode==='fanny-silhouette')frameElements.add('character:fanny');V05_SCENE_INFO.lensState=state;
}
function v05Chat(c,t,E,p){vstage(c,t,E,p,{kind:'city'});const msgs=[{role:'bonnie',text:'演示文字演示文字演'},{role:'fanny',text:'演示文字演示文字演示'},{role:'bonnie',text:'演示文字演示文字演'},{role:'bonnie',text:'演示文字演示文字演示'},{role:'fanny',text:'演示文字演示文字'},{role:'bonnie',text:'演示文字演示文'},{role:'bonnie',text:'演示文字演'},{role:'fanny',text:'演示文字演示'},{role:'bonnie',text:'演示文字演示文'}];vprop(c,t,E,'chat',[90,250,1700,790],{messages:msgs,rowCount:9,progress:pAt(t,127.37,130.45),rotation:-.035,yaw:.06});vtype(c,t,E,p,{x:960,y:205,w:1540,h:250,maxSize:130});}
function v05Gotanda(c,t,E,p){const u=pAt(t,p.start,p.end);vstage(c,t,E,p,{kind:'city'});
 if(p.mode==='gotanda-words'){const cue=E.cueAt(t),g=['二次会','焼肉','五反田'],n=Math.min(2,Math.floor(pAt(t,130.45,131.43)*3));for(let i=0;i<=n;i++){const F={...E,cueAt:()=>cue?{...cue,text:g[i],start_seconds:130.45+i*.326667}:null};vtype(c,t,F,p,{key:'word-'+i,x:440+i*510,y:310+i*180,w:700,h:350,maxSize:230});if(i<2)arrow(c,E,610+i*500,480+i*180,870+i*500,480+i*180,E.INK,6)}frameElements.add('transition:earlier-gotanda-word-arrow');return;}
 if(E.hasAsset('CITY_GOTANDA')){c.save();c.beginPath();c.rect(0,90,1920,870);c.clip();coverArt(c,E,'CITY_GOTANDA',{zoom:1.04+.08*pAt(t,131.43,133.55)});c.restore();frameElements.add('asset:CITY_GOTANDA')}
 if(p.mode==='virus'){vprop(c,t,E,'flip-phone',[690,70,650,1056],{screenMode:'virus',screenText:'INFECTED\n×\n127',rotation:-.02});const cue=E.cueAt(t),g=chars(cue?.text??''),k=Math.ceil(g.length/2);for(let i=0;i<2;i++){const F={...E,cueAt:()=>cue?{...cue,text:g.slice(i?k:0,i?g.length:k).join('')}:null};vtype(c,t,F,p,{key:'side-'+i,x:i?1575:355,y:500,w:550,h:790,vertical:true,maxSize:195});}frameElements.add('phone:virus-screen');}else vtype(c,t,E,p,{x:960,y:450,w:750,h:630,vertical:true,maxSize:220});
}
function v05Solar(c,t,E,p){E.rect(c,0,0,1920,1080,E.INK);const first=p.start<100,start=first?73.14:160.59,end=first?76.22:161.883,u=pAt(t,start,end);vprop(c,t,E,'solar-system',[0,0,1920,1080],{camera:'orbits',zoom:first?.78:lerp(1.10,.78,inOut(u)),center:[960,540],phase:lerp(-.12,.24,u),ink:E.PAPER,paper:E.INK,seed:127,readArea:{x:210,y:430,w:1500,h:220}});vtype(c,t,E,p,{x:960,y:first?510:310,w:1650,h:350,maxSize:130,color:E.PAPER,arrangement:'line',halo:true});frameElements.add('motion:solar-slow-continuous-rotation');}
function paperCamera(t){const a=[[161.883,0,0],[164.60,25,25],[164.90,700,20],[166.02,725,5],[166.32,1400,-15],[168.79,1425,-10],[169.09,2100,20],[170.84,2125,35],[171.14,2800,5],[172.71,2825,-15],[173.01,3500,-15],[177.53,3550,20]];let i=0;while(i<a.length-2&&t>=a[i+1][0])i++;const x=a[i],y=a[i+1],u=inOut(pAt(t,x[0],y[0]));return{y:lerp(x[1],y[1],u),x:lerp(x[2],y[2],u),segment:i};}
function v05LongDocument(c,t,E,p){vstage(c,t,E,p,{kind:'threads'});let cached=V05_PAPER_CACHE.get('final-sheet');
 if(!cached){const[atlas,q]=E.scratch('v05-long-paper-atlas',1720,5800);q.fillStyle=E.PAPER;q.fillRect(0,0,1720,5800);q.fillStyle='#E4E4E1';q.fillRect(60,40,75,5700);q.fillRect(1580,40,80,5700);q.strokeStyle=E.INK;q.lineWidth=6;q.strokeRect(55,35,1610,5730);E.text(q,'最終調査 / BONNIE',150,180,55,E.INK,{font:E.JP});
 for(let row=0;row<8;row++){q.fillStyle='#E6E6E3';q.fillRect(145,row*700+65,1390,22);for(const side of[0,1]){const cx=side?1620:105,cy=row*700+175+hash(row*9+side)*190;q.fillStyle=E.INK;for(let k=0;k<7;k++){const a=k/7*Math.PI*2,r=25+hash(row*19+k+side)*32;q.beginPath();q.ellipse(cx+Math.cos(a)*r*.4,cy+Math.sin(a)*r*.4,r,r*.65,a,0,Math.PI*2);q.fill()}for(let k=0;k<5;k++){q.beginPath();q.arc(cx+(hash(row*17+k)-.5)*120,cy+70+hash(row*13+k)*90,3+hash(k+row)*8,0,Math.PI*2);q.fill()}}}
 const before=framePlaneDiagnostics.length,ids=['cue_079','cue_080','cue_081','cue_082','cue_083','cue_084'],list=E.cues??SOURCE_CUES;for(let index=0;index<ids.length;index++){const id=ids[index],cue=list.find(a=>a.id===id);if(!cue)continue;const y=250+index*700,body=flatType(t,E,{key:'long-'+id,text:cue.text,cue,w:1400,h:550,size:205,staticInk:true,guides:true});q.drawImage(body,160,y,1400,550);}cached={atlas,diagnostics:framePlaneDiagnostics.splice(before)};V05_PAPER_CACHE.set('final-sheet',cached);}
 const atlas=cached.atlas;framePlaneDiagnostics.push(...cached.diagnostics.map(d=>({...d,poseId:p.id})));
 const cam=paperCamera(t),progress=pAt(t,161.883,177.53),roll=lerp(-.12,.12,progress),yaw=lerp(.21,-.20,progress),pitch=lerp(-.055,.055,progress),[view,v]=E.scratch('v05-long-paper-view',1600,1000);v.drawImage(atlas,60+cam.x,cam.y,1600,1000,0,0,1600,1000);projectPlane(c,view,cameraQuad({x:960,y:525,w:1770,h:1106.25,roll,yaw,pitch}),{alpha:1});frameElements.add('document:single-sheet-longtake');frameElements.add('document:ink-stains-in-paper-coordinates');frameElements.add('camera:continuous-paper-pan');V05_SCENE_INFO.cameraState={...cam,roll,yaw,pitch,sheet:'one-final-document',start:161.883,end:177.53};}
function v05LateProps(c,t,E,p){vstage(c,t,E,p,{kind:p.mode==='rope'?'rays':'threads'});const u=pAt(t,p.start,p.end);
 if(p.mode==='device-swap'){const start=134.43,end=134.87,progress=pAt(t,start,end),turn=inOut(progress),smart=progress>=.5,widthScale=Math.max(.012,Math.abs(Math.cos(Math.PI*turn)));c.save();c.translate(1000,620);c.scale(widthScale,1);c.translate(-1000,-620);vprop(c,t,E,smart?'smartphone':'flip-phone',[690,100,620,1040],{screenText:'2 YEAR\n127',screenMode:'signal',rotation:lerp(-.13,.04,pAt(t,133.55,135.13))});c.restore();vtype(c,t,E,p,{x:360,y:490,w:540,h:780,vertical:true,maxSize:185});frameElements.add('device:'+(smart?'smartphone':'fixed-flip-phone'));frameElements.add('transition:device-side-on-flip');V05_SCENE_INFO.cameraState={subject:'device-flip',start,end,progress,widthScale,side:smart?'smartphone':'flip-phone',swapAt:134.65};}
 else if(p.mode==='password'){for(let i=0;i<7;i++)for(let j=0;j<10;j++){const x=90+j*190+(i%2?35:0),y=190+i*105,n=(i*31+j*17+127)%10000;E.text(c,String(n).padStart(4,'0'),x,y,60,E.INK,{font:E.MONO,outline:1.5})}const [plate,q]=E.scratch('v05-pin-message',1700,320);q.fillStyle=E.PAPER;q.fillRect(0,0,1700,320);const text=flatType(t,E,{key:'pin',w:1620,h:260,size:130});q.drawImage(text,40,30,1620,260);c.drawImage(plate,110,360,1700,320);frameElements.add('background:password-number-field');}
 else if(p.mode==='beckon'||p.mode==='dog'){vprop(c,t,E,'hand-shadow',[560,-70,1600,1400],{pose:p.mode==='dog'?'dog':'beckon',progress:u});vtype(c,t,E,p,{x:375,y:500,w:560,h:780,vertical:true,maxSize:190});}
 else if(p.mode==='rejection'){vprop(c,t,E,'hand-shadow',[1120+u*450,100+u*250,950,800],{pose:'dog',progress:1});vtype(c,t,E,p,{x:850,y:520,w:1390,h:680,maxSize:230});}
 else if(p.mode==='rope'){for(const y of[190,860]){c.save();c.strokeStyle=E.INK;c.lineWidth=15;c.beginPath();c.moveTo(-40,y);c.bezierCurveTo(480,y-70,1440,y+70,1960,y);c.stroke();c.strokeStyle=E.PAPER;c.lineWidth=2;c.stroke();c.restore()}E.text(c,'麻縄',220,830,130,E.INK,{font:E.JP,outline:2});vtype(c,t,E,p,{x:1050,y:505,w:1430,h:520,maxSize:230});}
 else if(p.mode==='avatar'){c.save();c.beginPath();c.arc(730,520,300,0,Math.PI*2);c.clip();E.art(c,'PROFILE_ICON_01_USER',[420,210,620,620],{mode:'image'});c.restore();E.circle(c,730,520,308,E.INK,7);frameElements.add('asset:PROFILE_ICON_01_USER');const cue=E.cueAt(t),text=(cue?.text??'').split(/\s+/)[0],F={...E,cueAt:()=>cue?{...cue,text}:null};vtype(c,t,F,p,{x:1290,y:510,w:430,h:800,maxSize:240,vertical:true});}
 else if(p.mode==='pillow'){c.save();c.beginPath();c.arc(405,490,220,0,Math.PI*2);c.clip();E.art(c,'PROFILE_ICON_01_USER',[175,260,460,460],{mode:'image'});c.restore();E.circle(c,405,490,228,E.INK,5);frameElements.add('asset:PROFILE_ICON_01_USER');vprop(c,t,E,'pillow',[400,295,1100,680],{progress:u});const cue=E.cueAt(t),text=(cue?.text??'').split(/\s+/).slice(1).join(''),F={...E,cueAt:()=>cue?{...cue,text,start_seconds:146.55}:null};vtype(c,t,F,p,{x:1640,y:490,w:420,h:760,maxSize:260,vertical:true});}
}
function v05SwimsuitSpray(c,t,E,{sw,sh,plate,cx,cy,x,y,scale,rotation}){
 let spray=V05_PAPER_CACHE.get('swimsuit-ragged-spray');
 if(!spray){spray=document.createElement('canvas');spray.width=1920;spray.height=1080;const r=spray.getContext('2d');
  const ragged=(x,y,rx,ry,angle,seed)=>{r.save();r.translate(x,y);r.rotate(angle);r.beginPath();for(let i=0;i<220;i++){const a=i/220*Math.PI*2,nx=Math.cos(a)/rx,ny=Math.sin(a)/ry,n=Math.hypot(nx,ny),rough=Math.min(19,ry*.32)*(.55*Math.sin(a*9+seed)+.24*Math.sin(a*23)+.40*(hash(seed*503+i)-.45)),xx=Math.cos(a)*rx+nx/n*rough,yy=Math.sin(a)*ry+ny/n*rough;i?r.lineTo(xx,yy):r.moveTo(xx,yy)}r.closePath();r.fill();r.restore()};
  r.fillStyle='#000';ragged(325,475,690,135,-.32,68);ragged(190,735,565,115,-.35,83);ragged(565,380,320,56,-.47,97);
  for(let i=0;i<115;i++){const xx=-100+hash(i*17+3068)*1360,yy=650-xx*.34+(hash(i*17+3069)-.5)*560,rr=2+hash(i*17+3070)**2*18;ragged(xx,yy,rr*(1.1+hash(i+909)*2.5),rr,-.35,i+120)}
  // Broken apertures and tiny torn edges make a spray, rather than a circle
  // with radial lines. The same alpha contour is reused on both materials.
  r.globalCompositeOperation='destination-out';for(let i=0;i<35;i++){const xx=60+hash(i*11+4068)*850,yy=520-xx*.25+(hash(i*11+4069)-.5)*180;ragged(xx,yy,4+hash(i*11+4070)*19,2+hash(i*11+4071)*10,-.32,i+220)}
  V05_PAPER_CACHE.set('swimsuit-ragged-spray',spray);
 }
 const blast=lerp(.42,1,out(pAt(t,26.69,26.86))),[ink,q]=E.scratch('v05-swimsuit-spray-screen',1920,1080);q.save();q.translate(330,560);q.scale(blast,blast);q.drawImage(spray,-330,-560);q.restore();
 // Protect the real sewn-on tag in source coordinates, including its border.
 q.save();q.translate(x,y);q.rotate(rotation);q.scale(scale,scale);q.globalCompositeOperation='destination-out';q.fillRect(plate.x-cx-7,plate.y-cy-7,plate.w+14,plate.h+14);q.restore();
 const[mask,m]=E.scratch('v05-swimsuit-material-mask',1920,1080);m.save();m.translate(x,y);m.rotate(rotation);m.scale(scale,scale);m.drawImage(E.getAsset('SWIMSUIT_V05','darkMask'),-cx,-cy,sw,sh);m.restore();
 const[light,l]=E.scratch('v05-swimsuit-spray-white',1920,1080);l.drawImage(ink,0,0);l.globalCompositeOperation='source-in';l.fillStyle='#fff';l.fillRect(0,0,1920,1080);l.globalCompositeOperation='destination-in';l.drawImage(mask,0,0);l.globalCompositeOperation='source-over';c.drawImage(ink,0,0);c.drawImage(light,0,0);
 frameElements.add('ink:swimsuit-explosion');frameElements.add('ink:same-spray-black-on-paper-white-on-garment');frameElements.add('ink:real-garment-dark-mask-nameplate-protected');
}
function v05Swimsuit(c,t,E,p){
 // One image plane persists across the two cues. Its printed tag shares the
 // garment texture, so camera movement cannot separate type from the cloth.
 const source=E.getAsset('SWIMSUIT_V05','image'),sw=source.width,sh=source.height,[s,q]=E.scratch('v05-swimsuit-tag-plane',sw,sh),burst=t>=26.69;
 E.art(q,'SWIMSUIT_V05',[0,0,sw,sh],{mode:'image'});frameElements.add('asset:SWIMSUIT_V05');frameElements.add('prop:isolated-school-swimsuit');
 const plate={x:sw*.303,y:sh*.268,w:sw*.396,h:sh*.111},cx=plate.x+plate.w/2,cy=plate.y+plate.h/2;
 if(burst){const cue=E.cueAt(t),g=chars(cue?.text??''),lines=[g.slice(0,3).join(''),g.slice(3).join('')];for(let i=0;i<lines.length;i++){const local=cue?{...cue,text:lines[i],start_seconds:cue.start_seconds+i*.05}:null,body=flatType(t,E,{key:'swimsuit-nameplate-'+i,text:lines[i],cue:local,w:plate.w*.92,h:plate.h*.45,size:plate.h*.42,arrangement:'line',align:'center'});q.drawImage(body,plate.x+plate.w*.04,plate.y+plate.h*(.05+i*.45),plate.w*.92,plate.h*.45)}frameElements.add('typography:swimsuit-nameplate-unified-plane')}
 const before=pAt(t,25.17,26.69),approach=burst?out(pAt(t,26.69,26.89)):0,initialH=lerp(880,940,before),initialScale=initialH/sh,scale=lerp(initialScale,2.25*1024/sw,approach),rotation=lerp(lerp(-.075,-.10,before),-.58,approach),x=lerp(1260,1245,approach),y=lerp(525+(cy-sh/2)*initialScale,525,approach);
 c.save();c.translate(x,y);c.rotate(rotation);c.scale(scale,scale);c.drawImage(s,-cx,-cy);c.restore();if(burst)v05SwimsuitSpray(c,t,E,{sw,sh,plate,cx,cy,x,y,scale,rotation});frameElements.add('camera:continuous-swimsuit-push');V05_SCENE_INFO.cameraState={subject:'one-swimsuit-with-printed-tag',start:25.17,end:27.52,x,y,scale,rotation,phase:burst?'ink-closeup':'garment-medium',labelRect:plate};
}
function v05Misc(c,t,E,p){const u=pAt(t,p.start,p.end),m=p.mode;vstage(c,t,E,p,{kind:['idol','festival','makeup','face-collapse','transition-lines'].includes(m)?'rays':'archive'});
 if(m==='phone-bubbles'){const k=lerp(2.1,2.35,u);phoneChat(c,t,E,p,{box:[960-320*k,510-300*k,640*k,1040*k]});}
 else if(m==='swimsuit'){
  v05Swimsuit(c,t,E,p);const cue=E.cueAt(t),phrase=cue?.text??'',parts=phrase.trim().split(/\s+/),prefix=parts[0]??'',groups=prefix.includes('ない')?[prefix.slice(0,prefix.indexOf('ない')+2),prefix.slice(prefix.indexOf('ない')+2),parts.slice(1).join('')]:parts;
  groups.filter(Boolean).forEach((s,i)=>{const a=25.17+i*.47,alpha=out(pAt(t,a,a+.13));c.save();c.font=`700 158px ${E.JP}`;const size=Math.min(i?158:136,760/Math.max(1,c.measureText(s).width)*158);E.text(c,s,105,350+i*205,size,E.INK,{font:E.JP,alpha});c.restore()});frameElements.add('typography:semantic-swimsuit-groups');V05_SCENE_INFO.revisionState={...(V05_SCENE_INFO.revisionState??{}),semanticTypography:{groups,breaksInsideWords:false}};
 }
 else if(m==='type-burst'){v05Swimsuit(c,t,E,p);}
 else if(m==='windows'){vprop(c,t,E,'software-dialog',[150,150,1600,760],{text:E.cueAt(t)?.text??'',count:Math.min(5,1+Math.floor(u*5)),progress:u});}
 else if(m==='face-collapse'){character(c,t,E,'BONNIE_FULL_A13',[-200,100,950,1200]);const cue=E.cueAt(t),parts=(cue?.text??'').split(/\s+/),cut=29.04;for(let i=0;i<Math.min(parts.length,2);i++){if(i===1&&t<cut)continue;const local={...cue,text:parts[i],start_seconds:i?cut:28.32},F={...E,cueAt:()=>local};vtype(c,t,F,p,{key:'expand-'+i,x:1150,y:i?660:345,w:1250,h:400,maxSize:250,burst:true,yaw:lerp(-.2,0,out(pAt(t,i?cut:28.32,(i?cut:28.32)+.4)))});}frameElements.add('continuity:forehead-to-face-one-scene');}
 else if(m==='macaron'||m==='coffee')arcLyric(c,t,E,p,{coffee:m==='coffee'});
 else if(m==='cabinet'){const k=lerp(.82,.90,out(u));vprop(c,t,E,'cabinet',[50,lerp(-160,-210,u),1500*k,1400*k],{progress:u,count:9});if(E.hasAsset('WIKI_INVESTIGATION_EVENT')){E.art(c,'WIKI_INVESTIGATION_EVENT',[1440,220,320,320],{mode:'print',rotate:lerp(-.2,.2,u)});frameElements.add('asset:WIKI_INVESTIGATION_EVENT')}frameElements.add('cabinet:large-82-90-percent-active-height');}
 else if(m==='interview'){vprop(c,t,E,'interview-site',[180,130,1560,810],{avatarAsset:'INTERVIEW_AVATAR',text:E.cueAt(t)?.text??'',progress:u});if(u>.5){const a=out((u-.5)/.2);line(c,E,1250,230,1250+190*a,230+190*a,E.INK,22);line(c,E,1440,230,1440-190*a,230+190*a,E.INK,22)}frameElements.add('interview:cancelled');}
 else if(m==='phone-drop'){character(c,t,E,'BONNIE_FULL_A10',[-30,70,1000,1300]);const fall=inOut(pAt(t,46.83,47.55));vprop(c,t,E,'flip-phone',[1180+fall*190,120+fall*1250,550,894],{rotation:fall*.8,screenText:'127'});vtype(c,t,E,p,{x:1320,y:440,w:1000,h:650,maxSize:200});frameElements.add('motion:phone-falls-out');}
 else if(m==='phone-push'){const k=lerp(1.45,3.2,inOut(pAt(t,49.95,55.72)));phoneChat(c,t,E,p,{box:[960-320*k,520-300*k,640*k,1040*k]});frameElements.add('camera:continuous-chat-screen-push');}
 else if(m==='expressions'){const index=Math.min(4,Math.floor(u*5)),colors=['#E895AC','#78B7C6','#E6C86A','#96B87B','#AE91C7'];vprop(c,t,E,'expression',[400,110,1120,850],{asset:'BONNIE_EXPRESSION_'+String(index+1).padStart(2,'0'),index:index+1,color:colors[index],progress:u*5-index});V05_SCENE_INFO.expressionState={index:index+1,color:colors[index],estimatedPairing:true};}
 else if(m==='city'){if(E.hasAsset('CITY_TOKYO')){c.save();c.beginPath();c.rect(0,90,1920,870);c.clip();coverArt(c,E,'CITY_TOKYO',{mode:'image',zoom:1.05+u*.06});c.restore();frameElements.add('asset:CITY_TOKYO')}vtype(c,t,E,p,{x:960,y:350,w:1570,h:470,maxSize:205});}
 else if(m==='idol'||m==='festival'){character(c,t,E,'SIL03',[-650,-180,1580,1580],{silhouette:true});vtype(c,t,E,p,{x:1250,y:500,w:1110,h:780,maxSize:m==='festival'?390:250,vertical:m==='idol'});}
 else if(m==='makeup'){character(c,t,E,'FANNY_PROFILE',[1090,-200,1600,1600],{role:'fanny',silhouette:true});vtype(c,t,E,p,{x:615,y:500,w:1050,h:760,maxSize:240});}
 else if(m==='pixel'){vprop(c,t,E,'pixel-walk',[200,310,1520,520],{assets:['PIXEL_CHARACTER_02','PIXEL_CHARACTER_01'],assetBottoms:[.85,.915],progress:u,start:p.start});frameElements.add('pixel-walk');}
 else if(m==='investigation-lens'||m==='instrumental-optic'){unifiedPaper(c,t,E,p,{box:[160,0,1600,1000],roll:-.07});vprop(c,t,E,'magnifier',[500+u*350,100,850,850],{sourceCanvas:c.canvas,region:{x:550+u*250,y:300,w:300,h:300},zoom:1.7,rotation:-.2+u*.3});}
 else if(m==='newspaper'){vprop(c,t,E,'newspaper',[180,50,1560,1026],{imageAsset:newspaperPageAt(t)?.asset??'NEWSPAPER_ICON',rotation:lerp(-.15,.035,pAt(t,121.5,124.22)),yaw:lerp(-.2,.03,pAt(t,121.5,124.22))});V05_SCENE_INFO.paperPageState=newspaperPageAt(t);}
 else if(m==='transition-lines'){vprop(c,t,E,'envelope',[1400+u*40,650,650,390],{rotation:.10+u*.04});vtype(c,t,E,p,{x:960,y:380,w:1480,h:510,maxSize:200});frameElements.add('transition:preserved-light-rays-envelope');}
 else if(m==='outro'||m==='credits'){fullOutro(c,t,E,{...p,characters:t<182?'bonnie':null},u,false);}
}
function v05WikiStickers(c,t,E,p){const entries={
 'phone-bubbles':['WIKI_GIFT_PHONE',[95,700,185,185]],
 'portrait-chat':['WIKI_GIFT_TEDDY',[1000,795,155,155]],
 'interview':['WIKI_BONNIE_EMOJI_08',[1580,715,165,165]],
 'makeup':['WIKI_GIFT_DUCK',[85,770,170,170]],
 'chat-continuous':['WIKI_FANNY_EMOJI_02',[1750,735,145,145]]
 };const a=entries[p.mode];if(a&&E.hasAsset(a[0])){E.art(c,a[0],a[1],{mode:'print'});frameElements.add('asset:'+a[0]);frameElements.add('wiki-sticker:'+a[0])}}
function v06Helpers(){return{vstage,vtype,vprop,character,contrastType,flatType,unifiedPaper,phoneChat,arcLyric,coverArt,arrow,line,projectPlane,cameraQuad,drawYear,yearAt,glyphEnvelope,chars,clamp,pAt,out,inOut,lerp,hash,cache:V05_PAPER_CACHE,mark:(...ids)=>ids.forEach(id=>frameElements.add(id)),info:obj=>{const revisions={...(V05_SCENE_INFO.revisionState??{}),...(obj.revisionState??{})};Object.assign(V05_SCENE_INFO,obj);if(obj.revisionState)V05_SCENE_INFO.revisionState=revisions},smsBubble:(c,t,E,o)=>smsBubbleV06(c,t,E,v06Helpers(),o),typewriterText:(c,t,E,o)=>typewriterTextV06(c,t,E,v06Helpers(),o)}}
function phoneChat(c,t,E,p,o={}){return phoneChatV06(c,t,E,p,v06Helpers(),o)}

function motionShutterV11(c,t,E,reduced){
 const windows=[
  [68.38,69.37,28,-13,'year-close-pullback'],[156.17,156.82,28,-13,'year-close-pullback'],
  [62.69,62.98,24,-8,'kana-depth-pass'],[150.12,150.40,24,-8,'kana-depth-pass'],
  [133.63,133.89,19,0,'phone-flip'],[134.31,134.56,-19,0,'phone-flip'],
  [164.48,165.13,-35,-6,'desk-file-travel'],[168.72,169.36,-35,-10,'desk-file-travel'],
  [183.28,183.45,16,0,'outro-device-flip']
 ];
 // Every actual scene entry has a short shutter interval. The held picture
 // and every cue's start/end stay on the original song clock.
 // The year pullback arrives continuously at the full-body hug framing.
 // This handoff is a held camera, so its boots stay sharp rather than gaining
 // an artificial second shutter pulse on the timeline bookkeeping boundary.
 const pose=poseAt(t),skip=['expressions','credits','duo-hug','single-hug'],dir=pose?.entryDirection,entryDx=dir==='left'?-20:dir==='right'?20:0,entryDy=dir==='up'?-18:dir==='down'?18:0;
 const entry=pose&&pose.start>.1&&!skip.includes(pose.mode)?[pose.start,Math.min(pose.end,pose.start+.14),entryDx,entryDy,'scene-entry-'+pose.mode]:null;
 const row=windows.find(([a,b])=>t>=a&&t<b)??(entry&&t>=entry[0]&&t<entry[1]?entry:null);if(!row||reduced)return;
 const[a,b,dx,dy,subject]=row,u=(t-a)/(b-a),strength=Math.sin(Math.PI*u)**2;
 if(strength<.001)return;
 const[source,sq]=E.scratch('v11-shutter-current-frame'),[blurred,bq]=E.scratch('v11-shutter-integral');sq.drawImage(c.canvas,0,0);
 bq.save();bq.globalCompositeOperation='lighter';bq.filter=`blur(${(1.4*strength).toFixed(3)}px)`;
 const weights=[.06,.09,.15,.40,.15,.09,.06];for(let i=0;i<7;i++){const offset=(i-3)/3;bq.globalAlpha=weights[i];bq.drawImage(source,offset*dx*strength,offset*dy*strength)}bq.globalAlpha=1;bq.globalCompositeOperation='destination-over';bq.filter='none';bq.fillStyle=E.PAPER;bq.fillRect(0,0,1920,1080);bq.restore();
 c.save();c.setTransform(1,0,0,1,0,0);c.beginPath();c.rect(0,90,1920,870);c.clip();c.globalAlpha=1;c.globalCompositeOperation='copy';c.drawImage(blurred,0,0);c.restore();
 frameElements.add('motion:v11-directional-shutter-blur');V05_SCENE_INFO.revisionState={...(V05_SCENE_INFO.revisionState??{}),motionBlur:{subject,start:a,end:b,strength,samples:7,offset:[dx*strength,dy*strength],gaussianPx:1.4*strength,absoluteTime:true,usesPreviousFrames:false,readingHoldSharp:true}};
}
export function renderCinematicV11(c,t,E,{reducedMotion=false}={}){
 const p=poseAt(t);if(!p)return null;framePlaneDiagnostics.length=0;frameElements.clear();V05_CHARACTERS.length=0;V05_SCENE_INFO={};c.save();c.globalAlpha=1;c.globalCompositeOperation='source-over';
 const m=p.mode,H=v06Helpers(),handled=renderDocumentPerspectiveFixesV11(c,t,E,p,H)||renderPortraitFixesV11(c,t,E,p,H)||renderIntroFixesV11(c,t,E,p,H)||renderCharacterV11(c,t,E,p,H)||renderChorusFixesV11(c,t,E,p,H)||renderPaperFixesV11(c,t,E,p,H)||renderFinishFixesV11(c,t,E,p,H)||renderSpatialV11(c,t,E,p,H)||(t<62.44?renderEarlyV11(c,t,E,p,H):renderLateV11(c,t,E,p,H));
 if(handled){}
 else if(m.startsWith('intro-'))v05Intro(c,t,E,p);
 else if(['document-reveal','document-chorus','document-law','document-how','phone-paper'].includes(m))v05DocumentScene(c,t,E,p);
 else if(['head-investigation','portrait-vertical','portrait-chat','nerves','overload','single-hug'].includes(m))v05PortraitScene(c,t,E,p);
 else if(['flower-profiles','head-duo','kana-turn','duo-portraits','duo-upper','year-scene','year-reentry','duo-hug'].includes(m))v05Chorus(c,t,E,p);
 else if(m==='phone-long'||m==='phone-detail')v05PhonePassage(c,t,E,p);
 else if(m==='magnifier-words')v05Magnifier(c,t,E,p);
 else if(m==='chat-continuous')v05Chat(c,t,E,p);
 else if(m==='gotanda-words'||m==='gotanda'||m==='virus')v05Gotanda(c,t,E,p);
 else if(m==='solar-continuous')v05Solar(c,t,E,p);
 else if(m==='document-long')v05LongDocument(c,t,E,p);
 else if(['device-swap','password','beckon','dog','rejection','rope','avatar','pillow'].includes(m))v05LateProps(c,t,E,p);
 else v05Misc(c,t,E,p);
 v05WikiStickers(c,t,E,p);
 overlayCharacterV11(c,t,E,p,H);
 if((t>=98.64&&t<99.41)||(t>=132.18&&t<132.65)){
  const a=t<100?98.64:132.18,b=t<100?99.41:132.65,u=pAt(t,a,b),alpha=Math.min(1,u/.12,(1-u)/.12);
  const box=t<100?[1060,125,650,190]:[970,125,530,180];c.save();c.globalAlpha*=alpha;drawEmotionCloseupV11(c,t,E,H,{assetId:'BONNIE_FULL_A10',part:'eyes',box,alpha:1,frame:false});
  line(c,E,box[0],box[1]+box[3]+10,box[0]+box[2],box[1]+box[3]+10,E.INK,2);E.text(c,'視線 / EVIDENCE 127',box[0]+box[2],box[1]+box[3]+40,21,E.INK,{font:E.MONO,align:'right'});c.restore();frameElements.add('emotion:signal-to-character-eyeline');
 }
 motionShutterV11(c,t,E,reducedMotion);
 c.restore();const bonnie=frameElements.has('character:bonnie'),fanny=frameElements.has('character:fanny'),characters=bonnie&&fanny?'duo':bonnie?'bonnie':fanny?'fanny':null,cue=E.cueAt(t),sourceCue=E.sourceCueAt?.(t)??null;
 const actualPose={...p,characters,characterVisible:Boolean(characters),avatarCharacters:frameElements.has('avatar:FANNY_PROFILE')?['bonnie','fanny']:[],dominant:m.includes('document')?'unified-document+text':m.includes('phone')?'phone-carried-text':m.includes('solar')?'solar+text':'lyric-led',lyricMotif:m};
 return{version:RENDERER_VERSION,pose:actualPose,cue,sourceCue,lyricEnvelope:lyricEnvelopeAt(t,E.cueAt),textPlanes:framePlaneDiagnostics.slice(),elements:[...frameElements],semanticFocus:{cueId:cue?.id??null,sourceText:cue?.text??'',motif:m,meaning:'Approved V11 review revisions with preserved physical scene continuity'},motionState:{motion:'absolute-scene',sceneStart:p.start,sceneEnd:p.end,progress:pAt(t,p.start,p.end),loopReset:false,pageFlip:V05_SCENE_INFO.pageFlipState??null},cueMotion:{cueId:cue?.id??null,type:'glyph-entry-read-exit',direction:p.entryDirection,displayText:cue?.text??''},inkDiagnostics:{model:'world-space-complete-contour',tileClip:false,cornerGroups:V05_SCENE_INFO.cornerInkGroups??[],allTrackedCornerGroupsInsideActivePicture:(V05_SCENE_INFO.cornerInkGroups??[]).every(g=>g.insideActivePicture),activeBounds:[0,90,1920,960]},yearState:yearAt(t),lensState:V05_SCENE_INFO.lensState??null,paperPageState:V05_SCENE_INFO.paperPageState??null,revisionState:{revision:"V11",chat:V05_SCENE_INFO.chatState??null,transcript:V05_SCENE_INFO.chatTranscriptState??null,...(V05_SCENE_INFO.revisionState??{})},cameraState:V05_SCENE_INFO.cameraState??null,expressionState:V05_SCENE_INFO.expressionState??null,characterDetailState:V05_SCENE_INFO.characterDetailState??null,characterExposure:{protagonist:'BONNIE',userAuthorizedDuoChoreography:true}};
}
