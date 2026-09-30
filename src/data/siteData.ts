/**
 * Єдине джерело всіх текстів, послуг, цін, робіт і контактів сайту.
 *
 * Правило: жодних вигаданих фактів. Якщо даних немає — значення null / порожній масив,
 * і відповідний блок на сайті просто не показується. Пошук «TODO» у цьому файлі —
 * актуальний перелік того, що треба отримати від Єви.
 *
 * Джерела текстів: біо та підписи постів @yeva.hairstyle (Behold-фід + публічний embed, 30.09.2026).
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
  // Біо: «Єва | стиліст по волоссю»
  role: 'Стилістка по волоссю',
  tagline: 'Зачіски · Укладання · Кременчук',
}

export const seo = {
  // ≤ 60 символів: ключ «зачіски Кременчук» на початку
  title: 'Зачіски та укладання в Кременчуці — Yeva Hairstyle',
  // ≤ 160 символів
  description:
    'Зачіски, укладання, хвилі й локони в Кременчуці. Образи в 4 руки з візажисткою. Стилістка по волоссю Єва (@yeva.hairstyle) — запис у Direct.',
  ogImageAlt: 'Yeva Hairstyle — зачіски та укладання в Кременчуці',
  // Колір панелі браузера = темний перший екран
  themeColor: '#1B1816',
  ogImage: '/og-image.jpg',
  locale: 'uk_UA',
  // Коди верифікації (Google Search Console → «Тег HTML», Bing Webmaster Tools). null — тег не додається
  verification: { google: null as string | null, bing: null as string | null },
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

/** Живий фід останніх постів (behold.so). Якщо недоступний — показуємо instagramCovers */
export const beholdFeedUrl = 'https://feeds.behold.so/0RpHCcM13FcUeOrMRiYI'

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
  { id: 'duo', label: 'В 4 руки' },
  { id: 'works', label: 'Роботи' },
  { id: 'prices', label: 'Ціни' },
  { id: 'reviews', label: 'Відгуки' },
  { id: 'booking', label: 'Запис' },
  { id: 'faq', label: 'Питання' },
]

export const hero = {
  eyebrow: 'Стилістка по волоссю · Кременчук',
  // h1: «Зачіски та укладання в Кременчуці»
  titleLead: 'Зачіски',
  titleAccent: 'та укладання',
  titleTail: 'в Кременчуці',
  // Біо: «допоможу створити зачіску, яка підкреслить твою красу»
  text: 'Я — Єва. Допоможу створити зачіску, яка підкреслить вашу красу.',
  // Шоурил зі своїх відео (scripts/showreel.mjs), постер — перший кадр
  video: { hevc: '/videos/showreel-hevc.mp4', h264: '/videos/showreel-h264.mp4' },
  media: 'showreel-poster',
  mediaAlt: 'Роботи Єви: гладке довге волосся, хвилі, хвіст і пучок',
  // Мають збігатися в <img sizes> і <link rel=preload imagesizes>, інакше фото завантажиться двічі
  mediaSizes: '(min-width: 1024px) 34vw, 100vw',
}

export const about = {
  // Цитата з біо: «допоможу створити зачіску, яка підкреслить твою красу» (між частинами — фото)
  quote: ['Допоможу створити', 'зачіску, яка підкреслить'],
  quoteAccent: 'твою красу',
  titleLead: 'Зачіска —',
  titleAccent: 'частина образу',
  paragraphs: [
    'Мене звати Єва, я стилістка по волоссю в Кременчуці. Хвилі й локони, гладкі хвости, зібрані зачіски — кожну роботу підлаштовую під вас: довжину й текстуру волосся, образ і подію.',
    // Підпис посту 19.08: «коли ти кайфуєш від своєї справи…»
    'Я кайфую від своєї справи — і хочу, щоб ви так само кайфували від результату.',
  ],
  // TODO: портрет Єви. Поки — робота з каруселі від 26.09.2026
  media: 'long-waves-3',
  mediaAlt: 'Обʼємні хвилі на довгому волоссі — робота Єви',
  // Маленькі фото в цитаті
  inline: ['half-up-waves-2', 'messy-updo-2'],
}

export const principles: Principle[] = [
  {
    title: 'Тримається до кінця дня',
    text: 'Підбираю техніку й фіксацію так, щоб зачіска пережила і танці, і вітер, і довгу фотосесію.',
  },
  {
    title: 'Під образ і подію',
    text: 'Свято, фотосесія чи вихід — зачіска має пасувати до сукні, макіяжу й настрою.',
  },
  {
    title: 'Комфортно',
    text: 'Без болю від шпильок і відчуття «шолома». Вам має бути легко весь вечір.',
  },
]

export const services: Service[] = [
  {
    id: 'waves',
    title: 'Хвилі та локони',
    text: 'Голлівудська хвиля, обʼємні локони, легкі хвилі на довге волосся.',
    priceFrom: null, // TODO
    duration: null, // TODO
    enabled: true,
    image: 'long-waves-1',
  },
  {
    id: 'updo',
    title: 'Зібрані зачіски',
    text: 'Пучки та зібрані зачіски з локонами — на свято, фотосесію чи вихід.',
    priceFrom: null, // TODO
    duration: null, // TODO
    enabled: true,
    image: 'messy-updo-1',
  },
  {
    id: 'sleek',
    title: 'Хвости й гладкі укладання',
    text: 'Високий гладкий хвіст, напівзібрані зачіски, ідеально рівне довге волосся.',
    priceFrom: null, // TODO
    duration: null, // TODO
    enabled: true,
    image: 'sleek-3',
  },
  {
    id: 'duo',
    title: 'Образ у 4 руки',
    text: 'Зачіска від мене й макіяж від візажистки @nikusha.mua — цілісний образ в одному стилі.',
    priceFrom: null, // TODO
    duration: null, // TODO
    enabled: true,
    image: 'duo-ponytail-poster',
    featured: true,
  },
  // Увімкнути, якщо Єва це робить:
  {
    id: 'wedding',
    title: 'Весільна зачіска',
    text: 'Зачіска для нареченої — під сукню, фату й формат вашого дня.',
    priceFrom: null,
    duration: null,
    enabled: false, // TODO: чи робить весільні? Фото в стрічці немає
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
  { id: 'waves', label: 'Хвилі й локони' },
  { id: 'updo', label: 'Зібрані' },
  { id: 'sleek', label: 'Хвости й гладкі' },
]

/** Блок «Образ у 4 руки» */
export const duo = {
  eyebrow: 'Образ у 4 руки',
  titleLead: 'Зачіска',
  titleAccent: '+ макіяж',
  // Підпис Reels 02.09: «Образ в 4 руки with @nikusha.mua 🫶»
  text: 'Разом із візажисткою @nikusha.mua створюємо цілісний образ: зачіска й макіяж в одному стилі й настрої.',
  partner: { handle: 'nikusha.mua', url: 'https://www.instagram.com/nikusha.mua/' },
}

/**
 * Роботи. Покладіть оригінал у assets/originals/<media>.jpg (або відео в
 * assets/originals/video/<media>.mov) і запустіть `npm run images` / `npm run videos`.
 * Назви робіт придумані для сайту — узгодити з Євою.
 */
export const works: Work[] = [
  {
    id: 'trench',
    category: 'waves',
    kind: 'video',
    media: 'trench',
    title: 'Обʼємні локони',
    alt: 'Обʼємні локони на темному волоссі, зйомка на вулиці',
    credit: 'Модель @ilonochkaa_ · Макіяж @nikusha.mua',
    instagram: 'https://www.instagram.com/p/Dd02BJugV88/',
    duo: true,
  },
  {
    id: 'waves',
    category: 'waves',
    kind: 'photo',
    media: 'waves',
    title: 'Ніжні хвилі',
    alt: 'Ніжні хвилі на довгому русявому волоссі',
    instagram: 'https://www.instagram.com/p/DdyqlmsNMRP/',
  },
  {
    id: 'duo-ponytail',
    category: 'sleek',
    kind: 'video',
    media: 'duo-ponytail',
    title: 'Гладкий хвіст',
    alt: 'Перевтілення: гладкий високий хвіст і макіяж',
    credit: 'Макіяж @nikusha.mua',
    instagram: 'https://www.instagram.com/reel/Dcy3zHcBYZ2/',
    duo: true,
  },
  {
    id: 'messy-updo',
    category: 'updo',
    kind: 'photo',
    media: 'messy-updo-1',
    title: 'Зібрана з локонами',
    alt: 'Зібрана зачіска з локонами біля обличчя',
    instagram: 'https://www.instagram.com/p/DcOIBGQjVcT/',
  },
  {
    id: 'half-up',
    category: 'waves',
    kind: 'photo',
    media: 'half-up-waves-1',
    title: 'Напівзібрана з хвилями',
    alt: 'Напівзібрана зачіска з хвилями на довгому волоссі',
    instagram: 'https://www.instagram.com/p/DbqI2HVjXkU/',
  },
  {
    id: 'transformation',
    category: 'sleek',
    kind: 'video',
    media: 'transformation',
    title: 'Ідеально гладке',
    alt: 'Перевтілення: ідеально рівне довге волосся',
    instagram: 'https://www.instagram.com/reel/Dbu7AJKNkmc/',
  },
  {
    id: 'high-bun',
    category: 'updo',
    kind: 'video',
    media: 'high-bun',
    title: 'Високий пучок',
    alt: 'Високий пучок і яскравий макіяж',
    credit: 'Макіяж @nikusha.mua · Модель @chirva.cm',
    instagram: 'https://www.instagram.com/p/Dc1f5PosqGL/',
    duo: true,
  },
  {
    id: 'long-waves',
    category: 'waves',
    kind: 'photo',
    media: 'long-waves-1',
    title: 'Хвилі на довге волосся',
    alt: 'Обʼємні хвилі на довгому каштановому волоссі',
    instagram: 'https://www.instagram.com/p/DdtMNJeCFcP/',
  },
  {
    id: 'sleek-ponytail',
    category: 'sleek',
    kind: 'photo',
    media: 'sleek-3',
    title: 'Високий хвіст',
    alt: 'Високий гладкий хвіст',
    instagram: 'https://www.instagram.com/p/Dbs1Qf7DTGp/',
  },
  {
    id: 'street',
    category: 'waves',
    kind: 'photo',
    media: 'street',
    title: 'Легкі хвилі',
    alt: 'Легкі хвилі на темному волоссі, чорно-біле фото на вулиці',
    credit: 'Модель @chirva.ev',
    instagram: 'https://www.instagram.com/p/DdwcLwgAIhs/',
  },
  {
    id: 'low-bun',
    category: 'updo',
    kind: 'photo',
    media: 'low-bun',
    title: 'Низький пучок',
    alt: 'Низький зібраний пучок, чорно-біле фото',
  },
  {
    id: 'curls',
    category: 'waves',
    kind: 'photo',
    media: 'curls',
    title: 'Локони',
    alt: 'Великі локони на чорному волоссі крупним планом',
    instagram: 'https://www.instagram.com/p/DdtdyshNs8t/',
  },
]

/** Лише реальні відгуки (зі скрінів Direct / сторіс). Порожньо — блок не показується. */
export const reviews: Review[] = []

export const steps: Step[] = [
  // Біо: «запис у Direct 💌»
  { title: 'Напишіть у Direct', text: 'Дата, час і що за подія — цього достатньо, щоб почати.' },
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
 * Останні пости Instagram — запасний варіант, якщо Behold-фід недоступний
 * (обкладинки — імена зображень у media.gen.json).
 */
export const instagramCovers: { media: string; url: string }[] = [
  { media: 'trench-poster', url: 'https://www.instagram.com/p/Dd02BJugV88/' },
  { media: 'waves', url: 'https://www.instagram.com/p/DdyqlmsNMRP/' },
  { media: 'street', url: 'https://www.instagram.com/p/DdwcLwgAIhs/' },
  { media: 'curls', url: 'https://www.instagram.com/p/DdtdyshNs8t/' },
  { media: 'long-waves-1', url: 'https://www.instagram.com/p/DdtMNJeCFcP/' },
  { media: 'high-bun-poster', url: 'https://www.instagram.com/p/Dc1f5PosqGL/' },
]
