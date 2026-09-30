// assets/originals/video/<name>.(mov|mp4) → public/videos/<name>-hevc.mp4 + <name>-h264.mp4 (1080p, 30 fps,
// +faststart, AAC 128k) і постер public/images/<name>-poster-*.webp. Постер не перезаписується,
// якщо в assets/originals/ вже лежить <name>-poster.* (обкладинка, обрана вручну).
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises'
import { basename, extname, join } from 'node:path'
import ffmpegStatic from 'ffmpeg-static'

const SRC = 'assets/originals/video'
const OUT = 'public/videos'
const MANIFEST = 'src/data/media.gen.json'
const force = process.argv.includes('--force')

const which = (bin) => {
  try {
    return execFileSync('which', [bin], { encoding: 'utf8' }).trim()
  } catch {
    return null
  }
}
const FFMPEG = which('ffmpeg') ?? ffmpegStatic
const ffprobe = (file) => {
  // ffprobe може не бути — беремо параметри з виводу ffmpeg -i
  let out = ''
  try {
    execFileSync(FFMPEG, ['-hide_banner', '-i', file], { encoding: 'utf8', stdio: 'pipe' })
  } catch (e) {
    out = String(e.stderr)
  }
  const [, w, h] = out.match(/Video:.*?(\d{2,5})x(\d{2,5})/) ?? []
  const [, hh, mm, ss] = out.match(/Duration: (\d+):(\d+):([\d.]+)/) ?? []
  const rotate = Number(out.match(/rotation of (-?[\d.]+)/)?.[1] ?? out.match(/rotate\s*:\s*(-?\d+)/)?.[1] ?? 0)
  let width = Number(w)
  let height = Number(h)
  if (Math.abs(rotate) % 180 === 90) [width, height] = [height, width]
  return { width, height, duration: Number(hh) * 3600 + Number(mm) * 60 + Number(ss) }
}

const manifest = JSON.parse(await readFile(MANIFEST, 'utf8'))
await mkdir(OUT, { recursive: true })
const files = existsSync(SRC) ? (await readdir(SRC)).filter((f) => /\.(mov|mp4|m4v)$/i.test(f)) : []
if (!files.length) console.log(`У ${SRC}/ немає відео — нічого робити.`)

for (const file of files) {
  const name = basename(file, extname(file)).toLowerCase().replace(/[^a-z0-9-]+/g, '-')
  const input = join(SRC, file)
  const hevc = `${name}-hevc.mp4`
  const h264 = `${name}-h264.mp4`
  if (manifest.videos[name] && existsSync(join(OUT, hevc)) && existsSync(join(OUT, h264)) && !force) {
    console.log(`· ${name} (вже є, --force щоб перегенерувати)`)
    continue
  }
  const src = ffprobe(input)
  const portrait = src.height >= src.width
  // 1080p по короткій стороні, без збільшення; fps → рівно 30
  const scale = portrait ? 'scale=\'min(1080,iw)\':-2' : 'scale=-2:\'min(1080,ih)\''
  const vf = `${scale},fps=30,format=yuv420p`
  const common = ['-hide_banner', '-y', '-i', input, '-vf', vf, '-c:a', 'aac', '-b:a', '128k', '-ac', '2', '-movflags', '+faststart']

  console.log(`→ ${name}: HEVC…`)
  execFileSync(FFMPEG, [...common, '-c:v', 'libx265', '-preset', 'slow', '-crf', '25', '-maxrate', '6M', '-bufsize', '12M', '-tag:v', 'hvc1', '-x265-params', 'log-level=error', join(OUT, hevc)], { stdio: 'inherit' })
  console.log(`→ ${name}: H.264…`)
  execFileSync(FFMPEG, [...common, '-c:v', 'libx264', '-preset', 'slow', '-crf', '23', '-maxrate', '6M', '-bufsize', '12M', '-profile:v', 'high', join(OUT, h264)], { stdio: 'inherit' })

  // Постер: кадр на 1 с → assets/originals/<name>-poster.jpg, якщо обкладинки ще немає
  const poster = `${name}-poster`
  const custom = (await readdir('assets/originals')).find((f) => basename(f, extname(f)).toLowerCase() === poster)
  if (!custom) {
    execFileSync(FFMPEG, ['-hide_banner', '-y', '-ss', String(Math.min(1, src.duration / 2)), '-i', input, '-frames:v', '1', '-q:v', '2', join('assets/originals', `${poster}.jpg`)], { stdio: 'ignore' })
  }

  const out = ffprobe(join(OUT, h264))
  manifest.videos[name] = {
    width: out.width,
    height: out.height,
    duration: Math.round(out.duration * 10) / 10,
    hevc,
    h264,
    poster,
    uploadDate: (await stat(input)).mtime.toISOString().slice(0, 10),
  }
  console.log(`✓ ${name} ${out.width}×${out.height}, ${out.duration.toFixed(1)} с`)
}

await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')
if (files.length) console.log('Далі: npm run images — щоб зробити WebP-постери.')
