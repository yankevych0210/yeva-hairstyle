import { faq, nav, priceNotes, reviews, services, works } from '../data/siteData'
import type { SectionId } from '../types'

export const activeServices = services.filter((s) => s.enabled)
export const pricedServices = activeServices.filter((s) => s.priceFrom !== null)
export const answeredFaq = faq.filter((f): f is { q: string; a: string } => f.a !== null)

/** Секція показується лише коли для неї є реальні дані. */
export const visible: Record<SectionId, boolean> = {
  about: true,
  services: activeServices.length > 0,
  duo: works.some((w) => w.duo),
  works: true,
  prices: pricedServices.length > 0 || priceNotes.length > 0,
  reviews: reviews.length > 0,
  booking: true,
  faq: answeredFaq.length > 0,
  instagram: true,
}

export const visibleNav = nav.filter((n) => visible[n.id])

/** Куди веде кнопка «Ціни»: на прайс, а якщо його ще немає — на послуги. */
export const pricesAnchor = visible.prices ? '#prices' : '#services'

export function formatPrice(value: number) {
  return `від ${value.toLocaleString('uk-UA').replace(/\s/g, ' ')} грн`
}
