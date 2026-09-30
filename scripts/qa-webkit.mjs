// WebKit (≈ Safari / iPhone): горизонтальний скрол, меню з блокуванням скролу, лайтбокс і відео.
// Запуск: node scripts/qa-webkit.mjs [url] [outDir]
import { mkdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { devices, webkit } from 'playwright'

const URL_ = process.argv[2] ?? 'http://localhost:4173/'
// Скріншоти — у тимчасову системну папку, не в проєкт
const OUT = process.argv[3] ?? join(tmpdir(), 'yeva-qa')
await mkdir(OUT, { recursive: true })
console.log(`screenshots → ${OUT}`)
const browser = await webkit.launch()
let failed = false

for (const name of ['iPhone 13', 'iPhone 13 landscape', 'iPhone SE']) {
  const ctx = await browser.newContext({ ...devices[name] })
  const page = await ctx.newPage()
  const problems = []
  page.on('console', (m) => m.type() === 'error' && !m.text().startsWith('Button failed to load') && problems.push(`console: ${m.text()}`))
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`))
  await page.goto(URL_, { waitUntil: 'networkidle' })

  const m = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, w: window.innerWidth }))
  if (m.sw > m.w) problems.push(`horizontal scroll ${m.sw} > ${m.w}`)

  // Меню: блокування скролу і відновлення позиції
  await page.evaluate(() => window.scrollTo(0, 1500))
  await page.waitForTimeout(200)
  const burger = page.locator('[aria-controls="mobile-menu"]')
  if (await burger.isVisible()) {
    await burger.tap()
    await page.waitForTimeout(700)
    const st = await page.evaluate(() => ({ pos: getComputedStyle(document.body).position, top: document.body.style.top }))
    if (st.pos !== 'fixed' || st.top !== '-1500px') problems.push(`menu lock: ${JSON.stringify(st)}`)
    await page.screenshot({ path: `${OUT}/webkit-${name}-menu.png` })
    await page.locator('[aria-label="Закрити меню"]').tap()
    await page.waitForTimeout(400)
    const y = await page.evaluate(() => window.scrollY)
    if (Math.abs(y - 1500) > 2) problems.push(`menu restore scroll: ${y}`)
  }

  // Лайтбокс: відкриваємо відео, якщо є, інакше першу роботу
  await page.locator('#works').scrollIntoViewIfNeeded()
  const videoBtn = page.locator('#works li button[aria-label$="відео"]').first()
  const hasVideo = (await videoBtn.count()) > 0
  await (hasVideo ? videoBtn : page.locator('#works li button').first()).tap()
  await page.waitForTimeout(1500)
  if (hasVideo) {
    const v = await page.evaluate(() => {
      const el = document.querySelector('[role="dialog"] video')
      const box = el?.getBoundingClientRect()
      const close = document.querySelector('[aria-label="Закрити"]')?.getBoundingClientRect()
      return el && {
        hevc: el.canPlayType('video/mp4; codecs="hvc1"'),
        src: el.currentSrc.split('/').pop(),
        paused: el.paused,
        muted: el.muted,
        t: el.currentTime,
        ready: el.readyState,
        box: [Math.round(box.width), Math.round(box.height)],
        overlap: close ? close.bottom > box.top && close.left < box.right : null,
        soundBtn: !!document.querySelector('[role="dialog"] button .lucide-volume-2, [role="dialog"] button svg.lucide-volume2'),
        vp: [innerWidth, innerHeight],
      }
    })
    console.log(`   video: ${JSON.stringify(v)}`)
    if (!v || v.ready < 2) problems.push('video not loaded')
    if (v?.paused) problems.push('video not playing')
    if (v?.overlap) problems.push('close button overlaps video')
    if (v && Math.abs(v.box[0] / v.box[1] - 9 / 16) > 0.02) problems.push(`video box not 9:16: ${v.box}`)
  }
  const info = await page.evaluate(() => {
    const d = document.querySelector('[role="dialog"][aria-modal]:not(#mobile-menu)')
    const r = d?.querySelector('.btn-primary')?.getBoundingClientRect()
    const el = document.elementFromPoint(innerWidth / 2, innerHeight / 2)
    return { open: !!d && d.contains(el), ctaVisible: r ? r.bottom <= innerHeight && r.top >= 0 : false }
  })
  if (!info.open) problems.push('lightbox not open')
  if (!info.ctaVisible) problems.push('lightbox CTA not visible without scroll')
  await page.screenshot({ path: `${OUT}/webkit-${name}-lightbox.png` })

  // «Образ у 4 руки»: відео з арки відкривається поверх усього й грає
  await page.keyboard.press('Escape')
  await page.waitForTimeout(300)
  await page.locator('#duo').scrollIntoViewIfNeeded()
  await page.locator('#duo li button').first().tap()
  await page.waitForTimeout(1500)
  const duo = await page.evaluate(() => {
    const d = document.querySelector('[role="dialog"][aria-modal]:not(#mobile-menu)')
    const v = d?.querySelector('video')
    const el = document.elementFromPoint(innerWidth / 2, innerHeight / 2)
    return { top: !!d && d.contains(el), playing: v ? !v.paused : false }
  })
  if (!duo.top) problems.push('duo lightbox covered or not open')
  if (!duo.playing) problems.push('duo video not playing')
  await page.screenshot({ path: `${OUT}/webkit-${name}-duo.png` })

  console.log(`${problems.length ? '✗' : '✓'} WebKit ${name}`)
  problems.forEach((p) => console.log('   - ' + p))
  if (problems.length) failed = true
  await ctx.close()
}
await browser.close()
process.exit(failed ? 1 : 0)
