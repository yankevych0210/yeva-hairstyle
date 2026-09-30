// assets/originals/<name>.(jpg|jpeg|png|heic|webp|tif) → public/images/<name>-480.webp і -960.webp
// + розміри в src/data/media.gen.json (width/height → без CLS).
// cwebp ігнорує EXIF-орієнтацію, тож спершу «розвертаємо» пікселі через sharp.rotate().
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { basename, extname, join } from 'node:path'
import sharp from 'sharp'

const SRC = 'assets/originals'
const OUT = 'public/images'
const MANIFEST = 'src/data/media.gen.json'
const WIDTHS = [480, 960]
const force = process.argv.includes('--force')

const manifest = JSON.parse(await readFile(MANIFEST, 'utf8'))
await mkdir(OUT, { recursive: true })
const tmp = join(tmpdir(), `yeva-img-${process.pid}`)
await mkdir(tmp, { recursive: true })

const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png|heic|heif|webp|tiff?)$/i.test(f))
if (!files.length) console.log(`У ${SRC}/ немає фото — нічого робити.`)

for (const file of files) {
  const name = basename(file, extname(file)).toLowerCase().replace(/[^a-z0-9-]+/g, '-')
  let input = join(SRC, file)
  if (/\.hei[cf]$/i.test(file)) {
    // sharp зазвичай без HEIC — конвертуємо системним sips (macOS)
    const jpg = join(tmp, `${name}.jpg`)
    execFileSync('sips', ['-s', 'format', 'jpeg', input, '--out', jpg], { stdio: 'ignore' })
    input = jpg
  }
  const done = WIDTHS.every((w) => existsSync(join(OUT, `${name}-${w}.webp`)))
  if (done && manifest.images[name] && !force) {
    console.log(`· ${name} (вже є, --force щоб перегенерувати)`)
    continue
  }

  const upright = await sharp(input).rotate().toBuffer() // EXIF Orientation → реальні пікселі
  const meta = await sharp(upright).metadata()
  let dims = null
  for (const w of WIDTHS) {
    const png = join(tmp, `${name}-${w}.png`)
    const info = await sharp(upright).resize({ width: w, withoutEnlargement: true }).png().toFile(png)
    execFileSync('cwebp', ['-quiet', '-q', '80', '-m', '6', '-af', '-metadata', 'none', png, '-o', join(OUT, `${name}-${w}.webp`)])
    if (w === WIDTHS.at(-1)) dims = { width: info.width, height: info.height }
  }
  manifest.images[name] = dims
  console.log(`✓ ${name}  ${meta.width}×${meta.height} → ${dims.width}×${dims.height}`)
}

await rm(tmp, { recursive: true, force: true })
await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')
