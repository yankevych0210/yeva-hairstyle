// QA: скріншоти на ключових ширинах + перевірки (горизонтальний скрол, консоль, шрифти, зображення,
// меню, фільтри, лайтбокс). Запуск: npm run build && npx vite preview --port 4173 & node scripts/qa.mjs [url] [outDir]
import { mkdir } from 'node:fs/promises'
import puppeteer from 'puppeteer-core'

const URL_ = process.argv[2] ?? 'http://localhost:4173/'
const OUT = process.argv[3] ?? 'qa'
const CHROME = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const VIEWPORTS = [
  { name: '320', width: 320, height: 640, mobile: true },
  { name: '375', width: 375, height: 812, mobile: true },
  { name: '390', width: 390, height: 844, mobile: true },
  { name: '430', width: 430, height: 932, mobile: true },
  { name: '768', width: 768, height: 1024, mobile: true },
  { name: '1024', width: 1024, height: 768, mobile: false },
  { name: '1440', width: 1440, height: 900, mobile: false },
  { name: 'landscape', width: 844, height: 390, mobile: true },
]
const only = process.env.VP?.split(',')

await mkdir(OUT, { recursive: true })
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true })
let failed = false

for (const vp of VIEWPORTS.filter((v) => !only || only.includes(v.name))) {
  const page = await browser.newPage()
  const problems = []
  page.on('console', (m) => ['error', 'warning'].includes(m.type()) && problems.push(`console.${m.type()}: ${m.text()}`))
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`))
  page.on('requestfailed', (r) => problems.push(`requestfailed: ${r.url()}`))
  page.on('response', (r) => r.status() >= 400 && problems.push(`HTTP ${r.status()}: ${r.url()}`))
  await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: vp.width < 500 ? 1.5 : 1, isMobile: vp.mobile, hasTouch: vp.mobile })
  await page.goto(URL_, { waitUntil: 'networkidle0' })
  await page.evaluate('document.fonts.ready')

  // Скролимо спокійно донизу, щоб спрацював reveal
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 120) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 40))
    }
    await new Promise((r) => setTimeout(r, 900))
  })

  const info = await page.evaluate(() => {
    const cs = (sel) => {
      const el = document.querySelector(sel)
      return el ? getComputedStyle(el).fontFamily : null
    }
    return {
      scrollW: document.documentElement.scrollWidth,
      innerW: window.innerWidth,
      wide: [...document.querySelectorAll('body *')]
        .filter((el) => el.getBoundingClientRect().right > window.innerWidth + 1 && !el.closest('.marquee, .chip-rail, [aria-hidden="true"]'))
        .slice(0, 5)
        .map((el) => el.tagName + '.' + String(el.className).slice(0, 60)),
      fonts: {
        sans: document.fonts.check('16px "Manrope Variable"', 'Зачіски'),
        serif: document.fonts.check('500 16px "Cormorant Garamond"', 'Зачіски'),
        body: cs('body'),
        h1: cs('h1'),
      },
      hidden: [...document.querySelectorAll('[data-reveal]:not(.is-in)')].length,
      brokenImgs: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
      h1: document.querySelectorAll('h1').length,
      smallTargets: [...document.querySelectorAll('a, button')]
        .filter((el) => {
          const r = el.getBoundingClientRect()
          return r.width > 0 && r.height > 0 && (r.height < 44 || r.width < 44) && getComputedStyle(el).visibility !== 'hidden' && !el.classList.contains('skip-link')
        })
        .map((el) => `${el.tagName} "${el.textContent.trim().slice(0, 30)}" ${Math.round(el.getBoundingClientRect().width)}×${Math.round(el.getBoundingClientRect().height)}`),
    }
  })
  if (info.scrollW > info.innerW) problems.push(`horizontal scroll: ${info.scrollW} > ${info.innerW} ${info.wide.join(' | ')}`)
  if (!info.fonts.sans || !info.fonts.serif) problems.push(`fonts not loaded: ${JSON.stringify(info.fonts)}`)
  if (info.hidden) problems.push(`${info.hidden} reveal elements still hidden`)
  if (info.brokenImgs.length) problems.push(`broken images: ${info.brokenImgs.join(', ')}`)
  if (info.h1 !== 1) problems.push(`h1 count = ${info.h1}`)
  if (info.smallTargets.length) problems.push(`tap targets < 44px: ${info.smallTargets.join('; ')}`)

  await page.screenshot({ path: `${OUT}/${vp.name}-full.png`, fullPage: true })

  // Інтерактив
  await page.evaluate(() => window.scrollTo(0, 0))
  await new Promise((r) => setTimeout(r, 300))
  await page.screenshot({ path: `${OUT}/${vp.name}-top.png` })
  if (vp.width < 1024) {
    await page.click('[aria-controls="mobile-menu"]')
    await new Promise((r) => setTimeout(r, 900))
    await page.screenshot({ path: `${OUT}/${vp.name}-menu.png` })
    const locked = await page.evaluate(() => getComputedStyle(document.body).position)
    if (locked !== 'fixed') problems.push('scroll not locked under menu')
    await page.keyboard.press('Escape')
    await new Promise((r) => setTimeout(r, 600))
  }
  const chips = await page.$$('#works [aria-pressed]')
  if (chips.length > 1) {
    await chips[1].click()
    await new Promise((r) => setTimeout(r, 300))
    const pressed = await page.evaluate(() => document.querySelectorAll('#works [aria-pressed="true"]').length)
    if (pressed !== 1) problems.push('filter aria-pressed broken')
    await chips[0].click()
  }
  const y0 = await page.evaluate(() => {
    document.querySelector('#works')?.scrollIntoView({ behavior: 'instant' })
    const y = window.scrollY
    document.querySelector('#works li button')?.click()
    return y
  })
  await new Promise((r) => setTimeout(r, 500))
  await page.screenshot({ path: `${OUT}/${vp.name}-lightbox.png` })
  await page.keyboard.press('Escape')
  await new Promise((r) => setTimeout(r, 300))
  const y1 = await page.evaluate(() => window.scrollY)
  if (Math.abs(y1 - y0) > 2) problems.push(`scroll position not restored after lightbox: ${y0} → ${y1}`)
  const focusBack = await page.evaluate(() => document.activeElement?.closest('#works li') !== null)
  if (!focusBack) problems.push('focus not returned after lightbox')

  console.log(`${problems.length ? '✗' : '✓'} ${vp.name}  fonts: body=${info.fonts.body.split(',')[0]} h1=${info.fonts.h1.split(',')[0]}`)
  problems.forEach((p) => console.log('   - ' + p))
  if (problems.length) failed = true
  await page.close()
}
await browser.close()
process.exit(failed ? 1 : 0)
