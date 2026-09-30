// OG-картинка 1200×630 у стилі сайту: рендер HTML зі шрифтами сайту в headless Chrome.
// Якщо є фото hero (public/images/hero-960.webp) — воно праворуч, інакше брендові пасма-хвилі.
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import puppeteer from 'puppeteer-core'
import sharp from 'sharp'

const require = createRequire(import.meta.url)
const CHROME = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const font = (f) => 'data:font/woff2;base64,' + require('node:fs').readFileSync(require.resolve(f)).toString('base64')
const monogram = await readFile('assets/monogram.svg', 'utf8')

const heroPath = 'public/images/hero-960.webp'
const right = existsSync(heroPath)
  ? `<img src="data:image/png;base64,${(await sharp(heroPath).png().toBuffer()).toString('base64')}" style="width:100%;height:100%;object-fit:cover">`
  : (() => {
      let p = ''
      for (let i = 0; i < 30; i++) {
        const x = 60 + i * 6
        p += `<path d="M${x},-30 C${x + 150},160 ${x - 170},300 ${x + 10},400 S${x + 90},620 ${x - 20},680" stroke="#fff" stroke-opacity="${(0.25 + Math.sin(i / 2.2) ** 2 * 0.5).toFixed(2)}" fill="none" stroke-width="1.3"/>`
      }
      for (let i = 0; i < 16; i++) {
        const x = 230 + i * 7
        p += `<path d="M${x},-30 C${x + 120},180 ${x - 140},280 ${x - 20},400 S${x + 60},600 ${x - 30},680" stroke="#83574B" stroke-opacity="${(0.12 + (i % 4) * 0.04).toFixed(2)}" fill="none"/>`
      }
      return `<svg viewBox="0 0 440 630" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#EAD9CE"/><stop offset="1" stop-color="#CFAF9F"/></linearGradient></defs><rect width="440" height="630" fill="url(#g)"/>${p}</svg>`
    })()

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:C;font-style:normal;font-weight:500;src:url(${font('@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-500-normal.woff2')})}
@font-face{font-family:C;font-style:italic;font-weight:500;src:url(${font('@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-500-italic.woff2')})}
@font-face{font-family:CL;font-style:italic;font-weight:500;src:url(${font('@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-italic.woff2')})}
@font-face{font-family:M;font-weight:200 800;src:url(${font('@fontsource-variable/manrope/files/manrope-cyrillic-wght-normal.woff2')})}
@font-face{font-family:ML;font-weight:200 800;src:url(${font('@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2')})}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#F6F0E8;color:#2A2521;font-family:M,ML;display:flex;overflow:hidden}
.l{flex:1;padding:64px 70px;display:flex;flex-direction:column;justify-content:space-between;position:relative}
.eb{display:flex;align-items:center;gap:16px;font-size:18px;font-weight:600;letter-spacing:.24em;text-transform:uppercase;color:#83574B}
.eb:before{content:'';width:44px;height:1.5px;background:#9C6B5E}
h1{font-family:C,CL;font-weight:500;font-size:112px;line-height:.95;letter-spacing:-.02em}
h1 em{color:#83574B}
.f{display:flex;align-items:center;gap:18px;font-size:22px;font-weight:600}
.f svg{width:56px;height:56px}
.f span{color:#5E534A;font-weight:500}
.r{width:440px;height:630px;position:relative;overflow:hidden}
.ring{position:absolute;right:-180px;top:-120px;width:560px;height:560px;border:1.5px solid #D8C8B6;border-radius:50%}
</style></head><body>
<div class="l"><div class="ring"></div><p class="eb">Кременчук</p>
<h1>Зачіски<br><em>та укладання</em></h1>
<div class="f">${monogram}Yeva Hairstyle <span>· @yeva.hairstyle</span></div></div>
<div class="r">${right}</div></body></html>`

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true })
const page = await browser.newPage()
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 })
await page.setContent(html, { waitUntil: 'load' })
await page.evaluate('document.fonts.ready')
const shot = await page.screenshot({ type: 'png' })
await browser.close()
await sharp(shot).jpeg({ quality: 88, mozjpeg: true }).toFile('public/og-image.jpg')
console.log('✓ og-image.jpg')
