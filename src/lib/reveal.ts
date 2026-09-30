/**
 * Scroll-reveal на одному спільному IntersectionObserver. Класи ставляться прямо
 * на DOM (без ре-рендерів React).
 *
 * Observer лише «озброює» елементи, що підійшли до viewport (запас 25% знизу),
 * а момент показу вирішує швидкість скролу:
 *  • спокійно — коли верх елемента на 90% висоти екрана, повна анімація;
 *  • свайп — раніше, ще біля краю екрана, і коротша (.reveal-fast), щоб не лишалося дірок;
 *  • перестрибнули (якір) — одразу, коротко.
 */
const FAST = 1.4 // px/ms ≈ 1400 px/s

let io: IntersectionObserver | null = null
let mo: MutationObserver | null = null
const armed = new Set<HTMLElement>()
let lastY = 0
let lastT = 0
let velocity = 0
let raf = 0
let idle = 0

function show(el: HTMLElement, fast: boolean) {
  el.classList.add('is-in')
  if (fast) el.classList.add('reveal-fast')
  armed.delete(el)
  io?.unobserve(el)
}

function check() {
  raf = 0
  if (!armed.size) return
  const vh = window.innerHeight
  const fast = velocity > FAST
  const atBottom = window.scrollY + vh >= document.documentElement.scrollHeight - 4
  for (const el of armed) {
    const r = el.getBoundingClientRect()
    if (r.bottom <= 0) show(el, true)
    else if (r.top < vh * (fast ? 1.08 : 0.9)) show(el, fast)
    else if (atBottom && r.top < vh) show(el, false)
  }
}

/**
 * Після зупинки скролу — обхід усіх ще прихованих елементів. Потрібен, бо при різкому свайпі на
 * повільному пристрої елемент може «перестрибнути» екран між кадрами: для IntersectionObserver
 * стан не змінився (не перетинався → не перетинається), і подія не приходить.
 */
function sweep() {
  const vh = window.innerHeight
  document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)').forEach((el) => {
    const r = el.getBoundingClientRect()
    if (r.bottom <= 0) show(el, true)
    else if (r.top < vh && r.bottom > 0) show(el, false)
  })
}

function schedule() {
  if (!raf) raf = requestAnimationFrame(check)
}

function onScroll(e: Event) {
  const y = window.scrollY
  const t = e.timeStamp || performance.now()
  const dt = t - lastT
  if (dt > 0 && dt < 200) {
    const v = Math.abs(y - lastY) / dt
    velocity = velocity * 0.4 + v * 0.6
  } else {
    velocity = 0
  }
  lastY = y
  lastT = t
  schedule()
  // Страховка: коли скрол зупинився — швидкість 0 і ще одна перевірка всього, що в кадрі
  clearTimeout(idle)
  idle = window.setTimeout(() => {
    velocity = 0
    sweep()
    schedule()
  }, 160)
}

function observe(el: Element) {
  if (el instanceof HTMLElement && !el.classList.contains('is-in')) io?.observe(el)
}

export function initReveal() {
  if (io || typeof window === 'undefined') return
  const w = window as Window & { __revealReady?: boolean }
  w.__revealReady = true

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce || !('IntersectionObserver' in window)) {
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => el.classList.add('is-in'))
    return
  }

  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const el = e.target as HTMLElement
        if (e.isIntersecting) armed.add(el)
        else armed.delete(el)
      }
      schedule()
    },
    { rootMargin: '0px 0px 25% 0px' },
  )

  // Те, що вже видно при завантаженні, — показуємо спокійно одразу
  const vh = window.innerHeight
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    const r = el.getBoundingClientRect()
    if (r.top < vh && r.bottom > 0) show(el, false)
    else if (r.bottom <= 0) show(el, true)
    else observe(el)
  })

  // Нові вузли (фільтр робіт тощо)
  mo = new MutationObserver((records) => {
    for (const rec of records) {
      rec.addedNodes.forEach((n) => {
        if (!(n instanceof HTMLElement)) return
        if (n.matches('[data-reveal]')) observe(n)
        n.querySelectorAll('[data-reveal]').forEach(observe)
      })
    }
  })
  mo.observe(document.body, { childList: true, subtree: true })

  lastY = window.scrollY
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', schedule, { passive: true })
}
