// OG-картинка 1200×630 для прев'ю посилань (Telegram, WhatsApp, Viber, Facebook, X):
// темний фон і зерно як на сайті, дві роботи в арках-дзеркалах, знак бренду.
// Рендер HTML зі шрифтами сайту в headless Chrome → public/<ім'я з seo.ogImage>.
// Фото: OG_PHOTOS="waves,half-up-waves-1" npm run og (імена з media.gen.json)
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import puppeteer from 'puppeteer-core'
import sharp from 'sharp'

const require = createRequire(import.meta.url)
const CHROME = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const OUT = process.env.OG_OUT ?? 'public/og.jpg'
const [main, second] = (process.env.OG_PHOTOS ?? 'waves,half-up-waves-1').split(',')

const font = (f) => `data:font/woff2;base64,${readFileSync(require.resolve(f)).toString('base64')}`
const photo = async (name) =>
  `data:image/jpeg;base64,${(await sharp(`public/images/${name}-960.webp`).jpeg({ quality: 92 }).toBuffer()).toString('base64')}`
const brand = JSON.parse(readFileSync('src/data/brand.gen.json', 'utf8'))
const mark = `<svg viewBox="${brand.viewBox}" aria-hidden="true"><path d="${brand.outer}" fill="none" stroke="#C99A8B" stroke-width="9"/><path d="${brand.inner}" fill="none" stroke="#C99A8B" stroke-width="3" stroke-opacity=".55"/><path d="${brand.y}" fill="#F3EBE1"/></svg>`
const grain = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:C;font-weight:500;src:url(${font('@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-500-normal.woff2')})}
@font-face{font-family:C;font-weight:500;font-style:italic;src:url(${font('@fontsource/cormorant-garamond/files/cormorant-garamond-cyrillic-500-italic.woff2')})}
@font-face{font-family:CL;font-weight:500;font-style:italic;src:url(${font('@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-italic.woff2')})}
@font-face{font-family:M;font-weight:200 800;src:url(${font('@fontsource-variable/manrope/files/manrope-cyrillic-wght-normal.woff2')})}
@font-face{font-family:ML;font-weight:200 800;src:url(${font('@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2')})}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;overflow:hidden;position:relative;color:#F3EBE1;font-family:M,ML;
  background:radial-gradient(900px 600px at 78% 40%,#2E2723 0%,#1B1816 60%)}
body:after{content:'';position:absolute;inset:0;background-image:${grain};opacity:.09;mix-blend-mode:overlay}
.l{position:absolute;left:72px;top:64px;bottom:60px;width:560px;display:flex;flex-direction:column}
.eb{display:flex;align-items:center;gap:16px;font-size:17px;font-weight:600;letter-spacing:.24em;text-transform:uppercase;color:#BFB3A6}
.eb:before{content:'';width:44px;height:1.5px;background:#BFB3A6}
h1{margin-top:auto;font-family:C,CL;font-weight:500;font-size:98px;line-height:.92;letter-spacing:-.025em;white-space:nowrap}
h1 em{display:block;color:#E4D6C6}
.sub{margin-top:26px;font-size:24px;line-height:1.45;color:rgb(243 235 225 / .78);max-width:500px}
.f{margin-top:auto;display:flex;align-items:center;gap:18px;font-size:21px;font-weight:600}
.f svg{height:58px;width:auto}
.f span{color:#BFB3A6;font-weight:500}
.a{position:absolute;overflow:hidden;background:#2A2521;box-shadow:0 30px 60px -20px rgb(0 0 0/.6)}
.a img{width:100%;height:100%;object-fit:cover}
.a1{right:70px;top:46px;width:318px;height:540px;border-radius:159px 159px 22px 22px;border:1.5px solid rgb(201 154 139/.55)}
.a1 img{object-position:50% 28%}
.a2{right:356px;top:268px;width:188px;height:282px;border-radius:94px 94px 18px 18px;border:6px solid #1B1816}
.a2 img{object-position:50% 22%}
.ring{position:absolute;right:-120px;top:-150px;width:620px;height:620px;border:1px solid rgb(201 154 139/.18);border-radius:50%}
</style></head><body>
<div class="ring"></div>
<div class="a a1"><img src="${await photo(main)}"></div>
<div class="a a2"><img src="${await photo(second)}"></div>
<div class="l">
  <p class="eb">Стилістка по волоссю · Кременчук</p>
  <h1>Зачіски<em>та укладання</em></h1>
  <p class="sub">Хвилі, локони, зібрані зачіски<br>й образи в 4 руки</p>
  <div class="f">${mark}Yeva Hairstyle <span>· @yeva.hairstyle</span></div>
</div>
</body></html>`

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true })
const page = await browser.newPage()
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 })
await page.setContent(html, { waitUntil: 'load' })
await page.evaluate('document.fonts.ready')
const shot = await page.screenshot({ type: 'png' })
await browser.close()
await sharp(shot).jpeg({ quality: 86, mozjpeg: true, chromaSubsampling: '4:4:4' }).toFile(OUT)
console.log(`✓ ${OUT}`)
