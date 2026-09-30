/** Зображення, згенероване `npm run images` (див. src/data/media.gen.json). */
export interface ImageAsset {
  /** Базове ім'я без суфікса ширини: /images/<name>-480.webp, /images/<name>-960.webp */
  name: string
  width: number
  height: number
}

/** Відео, згенероване `npm run videos`. */
export interface VideoAsset {
  name: string
  width: number
  height: number
  duration: number
  /** Файли в /videos/: <name>-hevc.mp4, <name>-h264.mp4 */
  hevc: string
  h264: string
  /** Постер — ім'я зображення в media.gen.json */
  poster: string
  /** Дата файлу (ISO) — для VideoObject */
  uploadDate: string
}

export type MediaManifest = {
  images: Record<string, Omit<ImageAsset, 'name'>>
  videos: Record<string, Omit<VideoAsset, 'name'>>
}

export interface NavItem {
  id: SectionId
  label: string
}

export type SectionId =
  | 'about'
  | 'services'
  | 'duo'
  | 'works'
  | 'prices'
  | 'reviews'
  | 'booking'
  | 'faq'
  | 'instagram'

export interface Principle {
  title: string
  text: string
}

export interface Service {
  id: string
  title: string
  text: string
  /** Ціна «від», грн. null — ще не отримали від Єви (TODO) */
  priceFrom: number | null
  /** Тривалість, наприклад «1,5–2 год». null — невідомо */
  duration: string | null
  /** Показувати на сайті. Вимикайте послуги, яких немає */
  enabled: boolean
  /** Фото картки (ім'я в media.gen.json) */
  image?: string
  /** Виділена картка (темна) */
  featured?: boolean
}

export interface PriceNote {
  title: string
  text: string
}

export interface WorkCategory {
  id: string
  label: string
}

export interface Work {
  id: string
  category: string
  title: string
  /** Ім'я зображення або відео в media.gen.json. Якщо файлу ще немає — показуємо плейсхолдер */
  media: string
  kind: 'photo' | 'video'
  alt: string
  /** Команда зйомки: модель, макіяж, відео (з підпису в Instagram) */
  credit?: string
  /** Пост в Instagram */
  instagram?: string
  /** Образ у 4 руки (зачіска + макіяж з візажисткою) */
  duo?: boolean
}

export interface Review {
  name: string
  text: string
  /** Послуга/подія, наприклад «Весільна зачіска» */
  context?: string
}

export interface Step {
  title: string
  text: string
}

export interface FaqItem {
  q: string
  /** null — відповіді від Єви ще немає, питання не показуємо */
  a: string | null
}

export interface Contacts {
  instagram: { handle: string; url: string; direct: string }
  telegram: { handle: string; url: string } | null
  phone: { display: string; tel: string } | null
  viber: boolean
}

export interface Location {
  city: string
  region: string
  /** Адреса або район. null — TODO */
  address: string | null
  /** Посилання «Відкрити в Google Maps» */
  mapsUrl: string | null
  /** src для iframe Google Maps embed */
  mapsEmbed: string | null
  /** Рядки графіка, напр. { days: 'Пн–Пт', hours: '8:00–19:00' } */
  schedule: { days: string; hours: string }[]
}
