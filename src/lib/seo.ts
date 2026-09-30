/**
 * JSON-LD. Використовується у vite.config.ts під час збірки — тож лише чисті дані, без DOM.
 * Рейтингів і відгуків у розмітці немає, доки немає реальних.
 */
import manifest from '../data/media.gen.json' with { type: 'json' }
import { brand, contacts, location, seo, services, siteUrl, works } from '../data/siteData.ts'
import type { MediaManifest } from '../types.ts'

const m = manifest as MediaManifest
const abs = (p: string) => new URL(p, siteUrl).toString()

/** Google вимагає дату з часом і часовим поясом (ISO 8601). Лише дата → полудень за Києвом */
const isoDateTime = (d: string) => (/^\d{4}-\d{2}-\d{2}$/.test(d) ? `${d}T12:00:00+03:00` : d)

export function buildJsonLd() {
  const enabled = services.filter((s) => s.enabled)
  const prices = enabled.map((s) => s.priceFrom).filter((p): p is number => p !== null)
  const sameAs = [contacts.instagram.url, contacts.telegram?.url].filter(Boolean)

  const salon: Record<string, unknown> = {
    '@type': 'HairSalon',
    '@id': `${siteUrl}/#salon`,
    name: brand.name,
    description: seo.description,
    url: `${siteUrl}/`,
    image: [
      abs(seo.ogImage),
      ...works.filter((w) => w.kind === 'photo' && m.images[w.media]).map((w) => abs(`/images/${w.media}-960.webp`)),
    ],
    logo: abs('/icon-512.png'),
    sameAs,
    areaServed: { '@type': 'City', name: location.city },
    address: {
      '@type': 'PostalAddress',
      addressLocality: location.city,
      addressRegion: location.region,
      addressCountry: 'UA',
      ...(location.address ? { streetAddress: location.address } : {}),
    },
    founder: { '@id': `${siteUrl}/#person` },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Послуги',
      itemListElement: enabled.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.title, description: s.text },
        ...(s.priceFrom !== null
          ? {
              priceSpecification: {
                '@type': 'PriceSpecification',
                minPrice: s.priceFrom,
                priceCurrency: 'UAH',
              },
            }
          : {}),
      })),
    },
  }
  if (contacts.phone) salon.telephone = contacts.phone.tel
  if (prices.length) salon.priceRange = `${Math.min(...prices)}–${Math.max(...prices)} UAH`

  const person = {
    '@type': 'Person',
    '@id': `${siteUrl}/#person`,
    name: brand.master,
    jobTitle: brand.role,
    knowsAbout: ['Зачіски', 'Укладання волосся', 'Хвилі та локони', 'Голлівудська хвиля', 'Зібрані зачіски', 'Гладкий хвіст', 'Образ у 4 руки'],
    address: { '@type': 'PostalAddress', addressLocality: location.city, addressCountry: 'UA' },
    worksFor: { '@id': `${siteUrl}/#salon` },
    sameAs,
  }

  const website = {
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: `${siteUrl}/`,
    name: brand.name,
    inLanguage: 'uk',
    publisher: { '@id': `${siteUrl}/#salon` },
  }

  const videos = works
    .filter((w) => w.kind === 'video' && m.videos[w.media])
    .map((w) => {
      const v = m.videos[w.media]
      return {
        '@type': 'VideoObject',
        name: w.title,
        description: [w.alt, w.credit].filter(Boolean).join('. '),
        thumbnailUrl: abs(`/images/${v.poster}-960.webp`),
        contentUrl: abs(`/videos/${v.h264}`),
        uploadDate: isoDateTime(v.uploadDate),
        duration: `PT${Math.round(v.duration)}S`,
        width: v.width,
        height: v.height,
        inLanguage: 'uk',
      }
    })

  return { '@context': 'https://schema.org', '@graph': [salon, person, website, ...videos] }
}
