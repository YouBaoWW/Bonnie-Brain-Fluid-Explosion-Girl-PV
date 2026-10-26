# 使用方法

默认 `npm start` 启动只绑定本机的静态服务器，打开 index.html。页面使用 `demo=1`，二十个渲染源码文件保留相机、构图与转场逻辑；公开副本替换了完整内嵌歌词和硬编码长句、改用几何占位图，并调整了数据 URL。字体文件未包含，使用系统字体回退。

`npm run render -- --times=19.2,70.15,157.4` 在本地浏览器按秒数调用确定性的 renderFrame(t)，将演示截图写 outputs。`BONNIE_CHROME` 可指定 Chrome/Edge/Chromium 可执行文件。开发环境可用 `BONNIE_PLAYWRIGHT_MODULE` 指向自备 Playwright 模块，普通 npm 安装不需要设置。

原图接口见 assets/required-assets.json。若复用真实素材，可在对应 assets 子目录自行放入有权使用的 PNG，再用 demo=0 打开。原歌曲不自动下载；若有权使用，可自行放 media/song.wav。有声按钮需要这个文件。恢复自己的歌词时，需要同步 data/lyrics 的 cue/display/subtitle、cinematic 内的 SOURCE_CUES 以及结尾 FINAL_TYPE_SPECS 与逐字帧数。示例用等字数替换维持布局约束，但不声称任何演示文字与原歌曲对齐。

本包不包括生产导出器的私有审片 DOCX、历史影片快照、音视频、截图和机器专用 FFmpeg 路径。export/wsframes.mjs 提供有背压的原始帧传输可供自行构建导出器；原制作的分段捕获、严格解码、CFR PTS、源哈希和音频一次编码方法见验收提示词。当前公开工具负责可移植预览与关键帧，不提供假冒的完整成片一键复现。
