// Монограма «Y» (Cormorant Garamond italic → векторний контур, без залежності від шрифту):
// favicon.svg, favicon.ico (16/32/48), apple-touch-icon 180, icon-192/512, maskable 512.
// Для 16–48 px — потовщений варіант, щоб читався у вкладці.
import { readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import opentype from 'opentype.js'
import sharp from 'sharp'

const require = createRequire(import.meta.url)
const fontFile = (w) => require.resolve(`@fontsource/cormorant-garamond/files/cormorant-garamond-latin-${w}-italic.woff`)

const INK = '#2A2521'
const CREAM = '#F6F0E8'
const ACCENT = '#C99A8B'

async function glyphPath(weight, box, scale, dx = 0, dy = 0) {
  const buf = await readFile(fontFile(weight))
  const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength))
  const size = box * scale
  const p = font.getPath('Y', 0, 0, size)
  const bb = p.getBoundingBox()
  const x = (box - (bb.x2 - bb.x1)) / 2 - bb.x1 + dx
  const y = (box - (bb.y2 - bb.y1)) / 2 - bb.y1 + dy
  return font.getPath('Y', x, y, size).toPathData(2)
}

async function svg({ bold, rounded, maskable }) {
  const S = 512
  const d = await glyphPath(bold ? 700 : 600, S, maskable ? 0.72 : bold ? 1.12 : 0.95, bold ? 0 : -6, bold ? 8 : 6)
  const rx = rounded ? (bold ? 112 : 104) : 0
  const stroke = bold ? `stroke="${CREAM}" stroke-width="14" stroke-linejoin="round"` : ''
  const dot = bold ? '' : `<rect x="${maskable ? 318 : 352}" y="${maskable ? 318 : 360}" width="22" height="22" transform="rotate(45 ${maskable ? 329 : 363} ${maskable ? 329 : 371})" fill="${ACCENT}"/>`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}"><rect width="${S}" height="${S}" rx="${rx}" fill="${INK}"/><path d="${d}" fill="${CREAM}" ${stroke}/>${dot}</svg>`
}

const png = (svgStr, size) => sharp(Buffer.from(svgStr)).resize(size, size).png({ compressionLevel: 9 }).toBuffer()

function ico(pngs) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(pngs.length, 4)
  let offset = 6 + pngs.length * 16
  const entries = pngs.map(({ size, buf }) => {
    const e = Buffer.alloc(16)
    e.writeUInt8(size >= 256 ? 0 : size, 0)
    e.writeUInt8(size >= 256 ? 0 : size, 1)
    e.writeUInt16LE(1, 4)
    e.writeUInt16LE(32, 6)
    e.writeUInt32LE(buf.length, 8)
    e.writeUInt32LE(offset, 12)
    offset += buf.length
    return e
  })
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.buf)])
}

const bold = await svg({ bold: true, rounded: true })
const detailed = await svg({ bold: false, rounded: true })
const square = await svg({ bold: false, rounded: false })
const maskable = await svg({ bold: false, rounded: false, maskable: true })

await writeFile('public/favicon.svg', bold)
await writeFile('public/favicon.ico', ico(await Promise.all([16, 32, 48].map(async (size) => ({ size, buf: await png(bold, size) })))))
await writeFile('public/apple-touch-icon.png', await png(square, 180))
await writeFile('public/icon-192.png', await png(detailed, 192))
await writeFile('public/icon-512.png', await png(detailed, 512))
await writeFile('public/icon-maskable-512.png', await png(maskable, 512))
await writeFile('assets/monogram.svg', detailed)
console.log('✓ icons')
