# Updating content

All texts, services, prices, works and contacts are in **`src/data/siteData.ts`**. After any change run `npm run build` (or `npm run dev` to preview), check the page at phone and desktop width, then push to `main`.

Rule of the project: no invented facts. If a value is unknown, leave it `null` (or an empty list) — the block is hidden automatically. Search the file for `TODO` to see what is still missing.

## Prices and duration

In `services`, set `priceFrom` (number, UAH) and `duration` (text) for each service:

```ts
{ id: 'waves', title: 'Хвилі та локони', priceFrom: 900, duration: '1–1,5 год', … }
```

- The card shows "від 900 грн" instead of "Дізнатися ціну в Direct".
- As soon as at least one price is set, the **Ціни** section and its menu item appear, and `priceRange` is added to the structured data.
- Notes for the price list (trial hairstyle, outcall, early hours) go to `priceNotes`.
- A service that is not offered: `enabled: false` (wedding, kids and outcall are prepared this way).

## Contacts, address, schedule

- `contacts.telegram` — `{ handle: 'yeva', url: 'https://t.me/yeva' }`
- `contacts.phone` — `{ display: '+380 67 123 45 67', tel: '+380671234567' }`
- `location.address`, `location.mapsUrl` (Google Maps link), `location.mapsEmbed` (Share → Embed a map → `src` of the iframe), `location.schedule` — `[{ days: 'Пн–Сб', hours: '8:00–19:00' }]`

Buttons, footer links and structured data update automatically.

## FAQ and reviews

- `faq` — fill in `a` for each question. Questions with `a: null` are not shown; the section appears once one answer exists.
- `reviews` — only real reviews (from Direct or stories screenshots): `{ name: 'Олена', text: '…', context: 'Хвилі' }`.

## Adding a photo

1. Put the original into `assets/originals/`, name it in latin, e.g. `waves-2.jpg` (JPG, PNG, HEIC or WebP; camera rotation is handled).
2. Run `npm run images` — creates `public/images/waves-2-480.webp` and `-960.webp` and records the size.
3. Use the name in `siteData.ts`, e.g. add to `works`:

```ts
{ id: 'waves-2', category: 'waves', kind: 'photo', media: 'waves-2', title: 'Легкі хвилі', alt: 'Легкі хвилі на русявому волоссі', instagram: 'https://www.instagram.com/p/…/' }
```

Categories: `waves` (Хвилі й локони), `updo` (Зібрані), `sleek` (Хвости й гладкі). Add `duo: true` and a `credit` for looks made together with a makeup artist. Keep the number of works divisible by 6 so the grid has no gaps (2 columns on phone, 3 on desktop).

## Adding a video

1. Put the original into `assets/originals/video/` (e.g. `curls-reel.mov`). Video originals are git-ignored — they are too large for GitHub.
2. Optional: a hand-picked cover as `assets/originals/curls-reel-poster.jpg` (otherwise a frame at 1 s is used).
3. Run `npm run videos`, then `npm run images` (for the cover).
4. Add a work with `kind: 'video'` and `media: 'curls-reel'`.

Output: HEVC (Safari) + H.264 (other browsers), 1080p, 30 fps, sound, ready for streaming. To change the hero showreel, edit the fragment list in `scripts/showreel.mjs` and run `npm run showreel && npm run images`.

## Instagram block

Shows the latest posts from the Behold feed (`beholdFeedUrl`). The number of posts and refresh rate are set in the Behold dashboard. If the feed is unavailable, the covers from `instagramCovers` are shown.

## Brand, favicons, social image

- Logo, mark, favicons and app icons: `npm run brand` (outputs in `assets/brand/` and `public/`). `assets/brand/avatar-1080.png` is ready for the Instagram/Telegram avatar.
- Social preview (`public/og-image.jpg`): `npm run og` — uses the photo named in `scripts/og.mjs` (`OG_IMAGE=name npm run og` to pick another one).

## Domain

After connecting a custom domain in Vercel, change `siteUrl` in `siteData.ts`. Canonical URL, Open Graph, `robots.txt`, `sitemap.xml` and structured data follow it. Then add the domain in Google Search Console and submit `/sitemap.xml`.

## Search Console verification

`https://yeva-hairstyle.vercel.app/` is verified with the HTML file `public/google8b674a126c65c54a.html` — **do not delete it**, or verification is lost. For a new domain, either verify it with a new file from Search Console (put it into `public/`) or use the meta tag: set `seo.verification.google`.
