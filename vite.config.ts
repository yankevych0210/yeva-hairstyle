import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import manifest from './src/data/media.gen.json' with { type: 'json' }
import { brand, hero, seo, siteUrl, works } from './src/data/siteData.ts'
import { buildJsonLd } from './src/lib/seo.ts'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/** SEO з однієї константи siteUrl: мета-теги, JSON-LD, preload hero, robots, sitemap, manifest. */
function seoPlugin(): Plugin {
  let ssr = false
  return {
    name: 'yeva-seo',
    configResolved(config) {
      ssr = Boolean(config.build.ssr)
    },
    transformIndexHtml(html, ctx) {
      // Preload шрифтів першого екрана (кирилиця): h1 — Cormorant 500 + italic, текст — Manrope
      const fonts = Object.keys(ctx.bundle ?? {}).filter((f) =>
        /(cormorant-garamond-cyrillic-500-(normal|italic)|manrope-cyrillic-wght-normal)-[\w-]+\.woff2$/.test(f),
      )
      const fontPreload = fonts
        .map((f) => `<link rel="preload" as="font" type="font/woff2" href="/${f}" crossorigin />`)
        .join('\n    ')
      const heroImg = (manifest.images as Record<string, { width: number }>)[hero.media]
      const preload = heroImg
        ? `<link rel="preload" as="image" type="image/webp" fetchpriority="high" imagesrcset="/images/${hero.media}-480.webp 480w, /images/${hero.media}-960.webp ${Math.min(960, heroImg.width)}w" imagesizes="${hero.mediaSizes}" />`
        : ''
      const jsonLd = JSON.stringify(buildJsonLd()).replace(/</g, '\\u003c')
      return html
        .replaceAll('%SITE_URL%', siteUrl)
        .replaceAll('%TITLE%', esc(seo.title))
        .replaceAll('%DESCRIPTION%', esc(seo.description))
        .replaceAll('%OG_IMAGE%', new URL(seo.ogImage, siteUrl).toString())
        .replaceAll('%THEME_COLOR%', seo.themeColor)
        .replaceAll('%SITE_NAME%', esc(brand.name))
        .replaceAll('%OG_ALT%', esc(seo.ogImageAlt))
        .replaceAll('%OG_TITLE%', esc(seo.social.title))
        .replaceAll('%OG_DESCRIPTION%', esc(seo.social.description))
        .replace('<!--font-preload-->', fontPreload)
        .replace(
          '<!--verification-->',
          [
            seo.verification.google && `<meta name="google-site-verification" content="${esc(seo.verification.google)}" />`,
            seo.verification.bing && `<meta name="msvalidate.01" content="${esc(seo.verification.bing)}" />`,
          ]
            .filter(Boolean)
            .join('\n    '),
        )
        .replace('<!--hero-preload-->', preload)
        .replace('<!--json-ld-->', `<script type="application/ld+json">${jsonLd}</script>`)
    },
    generateBundle() {
      // Лише для клієнтської збірки
      if (ssr) return
      const today = new Date().toISOString().slice(0, 10)
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
      })
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: sitemap(today),
      })
      this.emitFile({
        type: 'asset',
        fileName: 'manifest.webmanifest',
        source: JSON.stringify(
          {
            id: '/',
            name: `${brand.name} — зачіски та укладання, Кременчук`,
            short_name: brand.wordmark,
            description: seo.description,
            lang: 'uk',
            dir: 'ltr',
            start_url: '/',
            scope: '/',
            display: 'standalone',
            categories: ['beauty', 'lifestyle'],
            background_color: seo.themeColor,
            theme_color: seo.themeColor,
            icons: [
              { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
              { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
              { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
            ],
          },
          null,
          2,
        ),
      })
    },
  }
}

/** Sitemap з image:image — щоб роботи потрапляли в Google Картинки */
function sitemap(today: string) {
  const images = manifest.images as Record<string, unknown>
  const x = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
  const media = [...new Set(works.filter((w) => w.kind === 'photo' && images[w.media]).map((w) => w))]
  const imgs = media
    .map(
      (w) =>
        `    <image:image>\n      <image:loc>${siteUrl}/images/${w.media}-960.webp</image:loc>\n      <image:title>${x(w.title)}</image:title>\n    </image:image>`,
    )
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n  <url>\n    <loc>${siteUrl}/</loc>\n    <lastmod>${today}</lastmod>\n${imgs}\n  </url>\n</urlset>\n`
}

export default defineConfig({
  plugins: [react(), seoPlugin()],
  build: {
    assetsInlineLimit: 0,
    // 404.html — окрема сторінка (Vercel віддає її для неіснуючих адрес)
    rollupOptions: { input: { main: 'index.html', notFound: '404.html' } },
  },
})
