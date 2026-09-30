// Шоурил для першого екрана: короткі фрагменти з відео робіт → 720×1280, 30 fps, без звуку,
// з м'якими затемненнями між кадрами. Вихід: public/videos/showreel-{hevc,h264}.mp4 +
// assets/originals/showreel-poster.jpg (перший кадр — він же LCP-картинка hero).
import { execFileSync } from 'node:child_process'
import { findFfmpeg } from './ffmpeg.mjs'

const FFMPEG = await findFfmpeg()
const SEGMENTS = [
  // [файл, старт, тривалість] — лише кадри результату, без сигарети в «trench»
  ['assets/originals/video/transformation.mp4', 5.6, 2.8],
  ['assets/originals/video/trench.mov', 9.2, 2.4],
  ['assets/originals/video/duo-ponytail.mp4', 4.4, 2.6],
  ['assets/originals/video/high-bun.mp4', 5.0, 2.6],
  ['assets/originals/video/trench.mov', 0.3, 2.4],
]
const FADE = 0.25

const inputs = SEGMENTS.flatMap(([f, ss, t]) => ['-ss', String(ss), '-t', String(t), '-i', f])
const chains = SEGMENTS.map(
  ([, , t], i) =>
    `[${i}:v]scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,fps=30,setsar=1,format=yuv420p,` +
    `fade=t=in:st=0:d=${FADE},fade=t=out:st=${(t - FADE).toFixed(2)}:d=${FADE}[v${i}]`,
)
const filter = `${chains.join(';')};${SEGMENTS.map((_, i) => `[v${i}]`).join('')}concat=n=${SEGMENTS.length}:v=1:a=0[out]`
const common = ['-hide_banner', '-loglevel', 'error', '-y', ...inputs, '-filter_complex', filter, '-map', '[out]', '-an', '-movflags', '+faststart']

execFileSync(FFMPEG, [...common, '-c:v', 'libx265', '-preset', 'slow', '-crf', '28', '-maxrate', '2.5M', '-bufsize', '5M', '-tag:v', 'hvc1', '-x265-params', 'log-level=error', 'public/videos/showreel-hevc.mp4'], { stdio: 'inherit' })
execFileSync(FFMPEG, [...common, '-c:v', 'libx264', '-preset', 'slow', '-crf', '25', '-maxrate', '3M', '-bufsize', '6M', '-profile:v', 'high', 'public/videos/showreel-h264.mp4'], { stdio: 'inherit' })
execFileSync(FFMPEG, ['-hide_banner', '-loglevel', 'error', '-y', '-ss', '0.6', '-i', 'public/videos/showreel-h264.mp4', '-frames:v', '1', '-q:v', '2', 'assets/originals/showreel-poster.jpg'])
console.log('✓ showreel (далі: npm run images)')
