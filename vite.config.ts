import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import manifest from './src/data/media.gen.json' with { type: 'json' }
import { brand, hero, seo, siteUrl } from './src/data/siteData.ts'
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
    transformIndexHtml(html) {
      const heroImg = (manifest.images as Record<string, unknown>)[hero.media]
      const preload = heroImg
        ? `<link rel="preload" as="image" type="image/webp" fetchpriority="high" imagesrcset="/images/${hero.media}-480.webp 480w, /images/${hero.media}-960.webp 960w" imagesizes="(min-width: 1024px) 46vw, 100vw" />`
        : ''
      const jsonLd = JSON.stringify(buildJsonLd()).replace(/</g, '\\u003c')
      return html
        .replaceAll('%SITE_URL%', siteUrl)
        .replaceAll('%TITLE%', esc(seo.title))
        .replaceAll('%DESCRIPTION%', esc(seo.description))
        .replaceAll('%OG_IMAGE%', new URL(seo.ogImage, siteUrl).toString())
        .replaceAll('%THEME_COLOR%', seo.themeColor)
        .replaceAll('%SITE_NAME%', esc(brand.name))
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
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${siteUrl}/</loc>\n    <lastmod>${today}</lastmod>\n  </url>\n</urlset>\n`,
      })
      this.emitFile({
        type: 'asset',
        fileName: 'manifest.webmanifest',
        source: JSON.stringify(
          {
            name: `${brand.name} — зачіски та укладання, Кременчук`,
            short_name: brand.wordmark,
            lang: 'uk',
            start_url: '/',
            display: 'standalone',
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

export default defineConfig({
  plugins: [react(), seoPlugin()],
  build: { assetsInlineLimit: 0 },
})
