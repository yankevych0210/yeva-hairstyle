# Yeva Hairstyle — сайт-візитка

Vite + React + TypeScript + Tailwind v3. Пре-рендер HTML під час збірки, дані в одному файлі.

## Команди

| | |
|---|---|
| `npm run dev` | локальна розробка |
| `npm run build` | збірка + пре-рендер у `dist/` (+ robots, sitemap, manifest, JSON-LD) |
| `npm run lint` | ESLint без попереджень |
| `npm run images` | `assets/originals/*.jpg/png/heic` → `public/images/*-480/960.webp` |
| `npm run videos` | `assets/originals/video/*.mov` → HEVC + H.264 1080p30, постер |
| `npm run icons` / `npm run og` | фавікони / OG-картинка 1200×630 |
| `npm run qa` / `npm run qa:webkit` | скріншоти й перевірки (потрібен `npx vite preview --port 4173`) |

## Як додати матеріали

1. Усі тексти, ціни, контакти — `src/data/siteData.ts`. Пошук `TODO` — що ще бракує.
2. Фото: покладіть у `assets/originals/` з іменем як у `siteData` (`hero.jpg`, `portrait.jpg`,
   `work-01.jpg`…, `service-evening.jpg`…) → `npm run images`. Плейсхолдер зникне сам.
3. Відео: `assets/originals/video/work-02.mov`, у `works` поставте `kind: 'video'` → `npm run videos && npm run images`.
   Власна обкладинка: `assets/originals/work-02-poster.jpg` (скрипт її не перезапише).
4. Коли з'явиться hero-фото — `npm run og`, щоб воно потрапило в OG-картинку.
5. Домен — константа `siteUrl` у `siteData.ts`.
