// Пошук ffmpeg: системний (brew install ffmpeg) → ffmpeg-static, якщо встановлений вручну.
// ffmpeg-static навмисно не в package.json: на Vercel він не потрібен (і тягне install-скрипт).
import { execFileSync } from 'node:child_process'

export async function findFfmpeg() {
  try {
    return execFileSync('which', ['ffmpeg'], { encoding: 'utf8' }).trim()
  } catch {
    try {
      return (await import('ffmpeg-static')).default
    } catch {
      console.error('Потрібен ffmpeg: brew install ffmpeg  (або тимчасово: npm i --no-save ffmpeg-static)')
      process.exit(1)
    }
  }
}
