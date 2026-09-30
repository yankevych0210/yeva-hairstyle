// Вставляє пре-рендерений HTML (renderToString) у dist/index.html, щоб весь текст був у HTML.
import { createHash } from 'node:crypto'
import { readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const root = resolve(fileURLToPath(import.meta.url), '../..')
const htmlPath = resolve(root, 'dist/index.html')
const { render } = await import(pathToFileURL(resolve(root, 'dist-ssr/entry-server.js')).href)

const html = await readFile(htmlPath, 'utf8')
if (!html.includes('<!--app-html-->')) throw new Error('У dist/index.html немає <!--app-html-->')
await writeFile(htmlPath, html.replace('<!--app-html-->', render()))

// CSP у vercel.json дозволяє інлайн-скрипти лише за SHA-256. Якщо скрипт у index.html змінили,
// а хеш — ні, браузер тихо його заблокує. Тому збірка падає з підказкою.
const vercel = await readFile(resolve(root, 'vercel.json'), 'utf8')
for (const [, code] of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) {
  const hash = `sha256-${createHash('sha256').update(code).digest('base64')}`
  if (!vercel.includes(`'${hash}'`)) {
    throw new Error(`CSP: онови хеш інлайн-скрипта у vercel.json → '${hash}'`)
  }
}
await rm(resolve(root, 'dist-ssr'), { recursive: true, force: true })
console.log('✓ prerender: dist/index.html')
