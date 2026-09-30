/**
 * Блокування скролу під меню / лайтбоксом, що працює в iOS Safari:
 * body → position: fixed зі збереженням позиції. Ref-count — щоб меню й лайтбокс
 * не знімали блокування одне одному.
 */
let locks = 0
let savedY = 0

export function lockScroll() {
  if (typeof document === 'undefined') return
  locks += 1
  if (locks > 1) return
  savedY = window.scrollY
  const { style } = document.body
  const scrollbar = window.innerWidth - document.documentElement.clientWidth
  style.position = 'fixed'
  style.top = `-${savedY}px`
  style.left = '0'
  style.right = '0'
  style.width = '100%'
  if (scrollbar > 0) style.paddingRight = `${scrollbar}px`
}

export function unlockScroll() {
  if (typeof document === 'undefined' || locks === 0) return
  locks -= 1
  if (locks > 0) return
  const { style } = document.body
  style.position = ''
  style.top = ''
  style.left = ''
  style.right = ''
  style.width = ''
  style.paddingRight = ''
  // Без плавного скролу, інакше сторінка «проїде» від верху до збереженої позиції
  const html = document.documentElement
  const prev = html.style.scrollBehavior
  html.style.scrollBehavior = 'auto'
  window.scrollTo(0, savedY)
  html.style.scrollBehavior = prev
}
