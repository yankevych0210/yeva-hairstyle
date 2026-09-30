/**
 * Єдине джерело всіх текстів, послуг, цін, робіт і контактів сайту.
 *
 * Правило: жодних вигаданих фактів. Якщо даних немає — значення null / порожній масив,
 * і відповідний блок на сайті просто не показується. Пошук «TODO» у цьому файлі —
 * актуальний перелік того, що треба отримати від Єви.
 *
 * Файл імпортує також vite.config.ts (SEO, sitemap), тож тут не можна імпортувати
 * ассети чи браузерний код — лише прості дані.
 */
import type {
  Contacts,
  FaqItem,
  Location,
  NavItem,
  Principle,
  PriceNote,
  Review,
  Service,
  Step,
  Work,
  WorkCategory,
} from '../types.ts'

// TODO: замінити на власний домен, коли він з'явиться (canonical, og:url, sitemap беруться звідси)
export const siteUrl = 'https://yeva-hairstyle.vercel.app'

export const brand = {
  name: 'Yeva Hairstyle',
  wordmark: 'Yeva',
  wordmarkSub: 'hairstyle',
  master: 'Єва',
  tagline: 'Зачіски · Укладання · Кременчук',
}

export const seo = {
  title: 'Зачіски та укладання в Кременчуці — Єва, Yeva Hairstyle',
  description:
    'Вечірні та весільні зачіски, укладання й локони в Кременчуці. Майстриня Єва (@yeva.hairstyle): роботи, послуги та запис через Instagram.',
  themeColor: '#F6F0E8',
  ogImage: '/og-image.jpg',
  locale: 'uk_UA',
}

export const contacts: Contacts = {
  instagram: {
    handle: 'yeva.hairstyle',
    url: 'https://www.instagram.com/yeva.hairstyle/',
    direct: 'https://ig.me/m/yeva.hairstyle',
  },
  telegram: null, // TODO: { handle: '...', url: 'https://t.me/...' }
  phone: null, // TODO: { display: '+380 XX XXX XX XX', tel: '+380XXXXXXXXX' }
  viber: false,
}

export const location: Location = {
  city: 'Кременчук',
  region: 'Полтавська область',
  address: null, // TODO: адреса або район
  mapsUrl: null, // TODO: посилання Google Maps
  mapsEmbed: null, // TODO: src iframe з «Поділитися → Вбудувати карту»
  schedule: [], // TODO: графік, напр. [{ days: 'Пн–Сб', hours: '7:00–19:00' }]
}

export const nav: NavItem[] = [
  { id: 'about', label: 'Про мене' },
  { id: 'services', label: 'Послуги' },
  { id: 'works', label: 'Роботи' },
  { id: 'prices', label: 'Ціни' },
  { id: 'reviews', label: 'Відгуки' },
  { id: 'booking', label: 'Запис' },
  { id: 'faq', label: 'Питання' },
]

export const hero = {
  eyebrow: 'Кременчук',
  // Заголовок рендериться як h1: «Зачіски та укладання в Кременчуці»
  titleLead: 'Зачіски',
  titleAccent: 'та укладання',
  titleTail: 'в Кременчуці',
  text: 'Я — Єва. Роблю зачіски й укладання під ваш образ і вашу подію.',
  media: 'hero',
  mediaAlt: 'Зачіска роботи Єви',
}

export const about = {
  titleLead: 'Зачіска —',
  titleAccent: 'частина образу',
  paragraphs: [
    'Мене звати Єва, я роблю зачіски та укладання в Кременчуці.',
    'Перед роботою ми говоримо про подію, сукню й про те, в чому вам комфортно. Тоді зачіска виглядає природно і саме так, як ви собі уявляли.',
  ],
  media: 'portrait',
  mediaAlt: 'Єва — майстриня зачісок і укладань',
}

export const principles: Principle[] = [
  {
    title: 'Тримається до кінця дня',
    text: 'Підбираю техніку й фіксацію так, щоб зачіска пережила і танці, і вітер, і довгу фотосесію.',
  },
  {
    title: 'Під образ і подію',
    text: 'Весілля, випускний чи зйомка — зачіска має пасувати до сукні, макіяжу й настрою.',
  },
  {
    title: 'Комфортно',
    text: 'Без болю від шпильок і відчуття «шолома». Вам має бути легко весь вечір.',
  },
]

export const services: Service[] = [
  {
    id: 'evening',
    title: 'Вечірня зачіска',
    text: 'Зібрана, напівзібрана або з розпущеним волоссям — на випускний, свято чи вихід.',
    priceFrom: null, // TODO
    duration: null, // TODO
    enabled: true,
    image: 'service-evening',
  },
  {
    id: 'wedding',
    title: 'Весільна зачіска',
    text: 'Зачіска для нареченої — під сукню, фату й формат вашого дня.',
    priceFrom: null, // TODO
    duration: null, // TODO
    enabled: true,
    image: 'service-wedding',
  },
  {
    id: 'styling',
    title: 'Укладання',
    text: 'Обʼєм, гладкість або легкі хвилі — для фотосесії, зустрічі чи просто гарного дня.',
    priceFrom: null, // TODO
    duration: null, // TODO
    enabled: true,
    image: 'service-styling',
  },
  {
    id: 'curls',
    title: 'Локони',
    text: 'Голлівудська хвиля, легкі пляжні чи обʼємні локони.',
    priceFrom: null, // TODO
    duration: null, // TODO
    enabled: true,
    image: 'service-curls',
  },
  // Увімкнути, якщо Єва це робить:
  {
    id: 'trial',
    title: 'Пробна весільна зачіска',
    text: 'Репетиція образу заздалегідь, щоб у день весілля не було сюрпризів.',
    priceFrom: null,
    duration: null,
    enabled: false, // TODO: чи є пробна?
  },
  {
    id: 'kids',
    title: 'Зачіска для дитини',
    text: 'Святкова зачіска для маленьких модниць.',
    priceFrom: null,
    duration: null,
    enabled: false, // TODO: чи є?
  },
  {
    id: 'outcall',
    title: 'Виїзд',
    text: 'Приїду до вас додому, в готель чи на локацію.',
    priceFrom: null,
    duration: null,
    enabled: false, // TODO: чи є виїзд і куди?
  },
]

/** Примітки до прайсу (пробна, виїзд, ранній час). Показуються разом із прайсом. */
export const priceNotes: PriceNote[] = [
  // TODO: напр. { title: 'Ранній час', text: 'До 7:00 — +… грн' }
]

export const workCategories: WorkCategory[] = [
  // З шапки профілю: «ЗАЧІСКИ | УКЛАДАННЯ». TODO: уточнити категорії (весільні / вечірні / локони)
  { id: 'hairstyles', label: 'Зачіски' },
  { id: 'styling', label: 'Укладання' },
]

/**
 * Роботи. Покладіть оригінал у assets/originals/<media>.jpg (або відео в
 * assets/originals/video/<media>.mov) і запустіть `npm run images` / `npm run videos`.
 * Поки файлу немає — у сітці показується брендовий плейсхолдер.
 */
export const works: Work[] = [
  { id: 'w1', category: 'hairstyles', kind: 'photo', media: 'work-01', title: 'Вечірня зачіска', alt: 'Вечірня зібрана зачіска' },
  { id: 'w2', category: 'styling', kind: 'photo', media: 'work-02', title: 'Голлівудська хвиля', alt: 'Укладання: голлівудська хвиля' },
  { id: 'w3', category: 'hairstyles', kind: 'photo', media: 'work-03', title: 'Весільна зачіска', alt: 'Весільна зачіска нареченої' },
  { id: 'w4', category: 'styling', kind: 'photo', media: 'work-04', title: 'Обʼємні локони', alt: 'Укладання: обʼємні локони' },
  { id: 'w5', category: 'hairstyles', kind: 'photo', media: 'work-05', title: 'Низький пучок', alt: 'Зачіска: низький пучок' },
  { id: 'w6', category: 'styling', kind: 'photo', media: 'work-06', title: 'Легкі хвилі', alt: 'Укладання: легкі хвилі' },
]

/** Лише реальні відгуки (зі скрінів Direct / сторіс). Порожньо — блок не показується. */
export const reviews: Review[] = []

export const steps: Step[] = [
  { title: 'Напишіть мені', text: 'Дата, час і що за подія — цього достатньо, щоб почати.' },
  { title: 'Покажіть референси', text: 'Фото зачіски, яка подобається, і вашого образу. Разом підберемо варіант.' },
  { title: 'Бронюємо час', text: 'Узгоджуємо деталі та закріплюємо дату за вами.' },
  { title: 'Ваш день', text: 'Ви відпочиваєте, а я збираю образ до останньої шпильки.' },
]

/** Відповіді — лише від Єви. a: null — питання не показується. */
export const faq: FaqItem[] = [
  { q: 'Чи потрібна передоплата?', a: null }, // TODO
  { q: 'Як скасувати або перенести запис?', a: null }, // TODO
  { q: 'Скільки часу займає зачіска?', a: null }, // TODO
  { q: 'Чи треба мити волосся перед зачіскою?', a: null }, // TODO
  { q: 'Чи є виїзд?', a: null }, // TODO
  { q: 'Чи можна зробити пробну зачіску?', a: null }, // TODO
]

/**
 * Обкладинки останніх постів Instagram (імена зображень у media.gen.json, напр. 'ig-01').
 * Порожньо — показуємо лише кнопку на профіль.
 */
export const instagramCovers: string[] = [] // TODO: 6 обкладинок зі скріншотів
