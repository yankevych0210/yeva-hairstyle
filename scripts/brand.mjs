// Бренд-кіт Yeva Hairstyle. Усе векторне (гліфи шрифтів → контури), без залежності від шрифтів:
//  • знак: арка-дзеркало + курсивна «Y» (Cormorant Garamond);
//  • горизонтальний логотип: знак + «Yeva» + «HAIRSTYLE» (Manrope);
//  • фавікони: для 16–48 px — потовщена «Y» без тонких ліній, від 180 px — знак з аркою;
//  • аватар 1080 для Instagram / Telegram; src/data/brand.gen.json — контури для React.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import opentype from 'opentype.js'
import sharp from 'sharp'

const require = createRequire(import.meta.url)
const load = (pkg, f) => {
  const b = readFileSync(require.resolve(`${pkg}/files/${f}`))
  return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength))
}
const serif600i = load('@fontsource/cormorant-garamond', 'cormorant-garamond-latin-600-italic.woff')
const serif700i = load('@fontsource/cormorant-garamond', 'cormorant-garamond-latin-700-italic.woff')
const serif500i = load('@fontsource/cormorant-garamond', 'cormorant-garamond-latin-500-italic.woff')
const sans600 = load('@fontsource/manrope', 'manrope-latin-600-normal.woff')

const INK = '#2A2521'
const CREAM = '#F6F0E8'
const ROSE = '#9C6B5E'
const ROSE_LIGHT = '#C99A8B'

/** Контур тексту з трекінгом; повертає { d, width, bbox } у координатах (x, baseline) */
function text(font, str, x, baseline, size, tracking = 0) {
  const scale = size / font.unitsPerEm
  let cx = x
  let d = ''
  const glyphs = font.stringToGlyphs(str)
  glyphs.forEach((g, i) => {
    d += g.getPath(cx, baseline, size).toPathData(2)
    cx += g.advanceWidth * scale + (i < glyphs.length - 1 ? tracking : 0)
    if (i < glyphs.length - 1) cx += font.getKerningValue(g, glyphs[i + 1]) * scale
  })
  return { d, width: cx - x }
}

/** Гліф по центру (cx, cy) за bbox */
function centered(font, ch, cx, cy, size) {
  const b = font.getPath(ch, 0, 0, size).getBoundingBox()
  return font.getPath(ch, cx - (b.x1 + b.x2) / 2, cy - (b.y1 + b.y2) / 2, size).toPathData(2)
}

const arch = (x, y, w, h) => `M${x},${y + h}V${y + w / 2}A${w / 2},${w / 2} 0 0 1 ${x + w},${y + w / 2}V${y + h}Z`

// ── Знак у полі 512×512 ─────────────────────────────────────────────
const MARK = {
  outer: arch(136, 52, 240, 408),
  inner: arch(150, 66, 212, 380),
  y: centered(serif600i, 'Y', 258, 282, 360),
}
const markBody = ({ fg, line, bg, rx = 0 }) =>
  `${bg ? `<rect width="512" height="512" rx="${rx}" fill="${bg}"/>` : ''}` +
  `<path d="${MARK.outer}" fill="none" stroke="${line}" stroke-width="5"/>` +
  `<path d="${MARK.inner}" fill="none" stroke="${line}" stroke-width="1.6" stroke-opacity=".55"/>` +
  `<path d="${MARK.y}" fill="${fg}"/>`
const svg = (vb, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">${body}</svg>`

// ── Горизонтальний логотип ─────────────────────────────────────────
// Знак зменшується до висоти 120 у полі; праворуч «Yeva» + «HAIRSTYLE»
function horizontal({ fg, line, sub }) {
  const PAD = 6
  const H = 132 // висота знака
  const s = H / 408
  const markW = 240 * s
  const x0 = PAD + markW + 30
  const word = text(serif500i, 'Yeva', x0, 90, 104)
  const subT = text(sans600, 'HAIRSTYLE', x0 + 4, 126, 17.5, 7)
  const W = Math.ceil(x0 + Math.max(word.width, subT.width + 4) + PAD)
  const body =
    `<g transform="translate(${PAD - 136 * s} ${PAD - 52 * s}) scale(${s})">` +
    `<path d="${MARK.outer}" fill="none" stroke="${line}" stroke-width="8"/>` +
    `<path d="${MARK.inner}" fill="none" stroke="${line}" stroke-width="2.6" stroke-opacity=".55"/>` +
    `<path d="${MARK.y}" fill="${fg}"/></g>` +
    `<path d="${word.d}" fill="${fg}"/><path d="${subT.d}" fill="${sub}"/>`
  return svg(`0 0 ${W} ${H + PAD * 2}`, body)
}

// ── Малі іконки: потовщена «Y» ─────────────────────────────────────
const boldY = centered(serif700i, 'Y', 256, 262, 440)
const small = svg('0 0 512 512', `<rect width="512" height="512" rx="112" fill="${INK}"/><path d="${boldY}" fill="${CREAM}" stroke="${CREAM}" stroke-width="14" stroke-linejoin="round"/>`)

const png = (s, size) => sharp(Buffer.from(s), { density: 300 }).resize(size, size).png({ compressionLevel: 9 }).toBuffer()
function ico(images) {
  const head = Buffer.alloc(6)
  head.writeUInt16LE(1, 2)
  head.writeUInt16LE(images.length, 4)
  let offset = 6 + images.length * 16
  const dir = images.map(({ size, buf }) => {
    const e = Buffer.alloc(16)
    e.writeUInt8(size, 0)
    e.writeUInt8(size, 1)
    e.writeUInt16LE(1, 4)
    e.writeUInt16LE(32, 6)
    e.writeUInt32LE(buf.length, 8)
    e.writeUInt32LE(offset, 12)
    offset += buf.length
    return e
  })
  return Buffer.concat([head, ...dir, ...images.map((i) => i.buf)])
}

mkdirSync('assets/brand', { recursive: true })
const darkIcon = (rx) => svg('0 0 512 512', markBody({ fg: CREAM, line: ROSE_LIGHT, bg: INK, rx }))
// maskable: безпечна зона ~80% → знак зменшено
const maskable = svg('0 0 512 512', `<rect width="512" height="512" fill="${INK}"/><g transform="translate(51.2 51.2) scale(.8)">${markBody({ fg: CREAM, line: ROSE_LIGHT })}</g>`)
// аватар (круглий кроп Instagram): знак на кремі з полями
const avatar = svg('0 0 512 512', `<rect width="512" height="512" fill="${CREAM}"/><g transform="translate(76.8 76.8) scale(.7)">${markBody({ fg: INK, line: ROSE })}</g>`)

const files = {
  'public/favicon.svg': small,
  'public/logo.svg': horizontal({ fg: INK, line: ROSE, sub: '#5E534A' }),
  'assets/brand/logo-light.svg': horizontal({ fg: INK, line: ROSE, sub: '#5E534A' }),
  'assets/brand/logo-dark.svg': horizontal({ fg: CREAM, line: ROSE_LIGHT, sub: '#BFB3A6' }),
  'assets/brand/mark-light.svg': svg('0 0 512 512', markBody({ fg: INK, line: ROSE, bg: CREAM })),
  'assets/brand/mark-dark.svg': darkIcon(0),
  'assets/brand/mark-transparent.svg': svg('130 46 252 420', markBody({ fg: INK, line: ROSE })),
}
for (const [f, s] of Object.entries(files)) writeFileSync(f, s)

writeFileSync('public/favicon.ico', ico(await Promise.all([16, 32, 48].map(async (size) => ({ size, buf: await png(small, size) })))))
writeFileSync('public/apple-touch-icon.png', await png(darkIcon(0), 180))
writeFileSync('public/icon-192.png', await png(darkIcon(104), 192))
writeFileSync('public/icon-512.png', await png(darkIcon(104), 512))
writeFileSync('public/icon-maskable-512.png', await png(maskable, 512))
writeFileSync('assets/brand/avatar-1080.png', await png(avatar, 1080))
// Для OG-картинки / сайту
writeFileSync('assets/monogram.svg', darkIcon(104))
writeFileSync(
  'src/data/brand.gen.json',
  JSON.stringify({ viewBox: '130 46 252 420', outer: MARK.outer, inner: MARK.inner, y: MARK.y }) + '\n',
)
console.log('✓ brand: logo, mark, favicons, avatar')
