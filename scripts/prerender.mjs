// Вставляє пре-рендерений HTML (renderToString) у dist/index.html, щоб весь текст був у HTML.
import { readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const root = resolve(fileURLToPath(import.meta.url), '../..')
const htmlPath = resolve(root, 'dist/index.html')
const { render } = await import(pathToFileURL(resolve(root, 'dist-ssr/entry-server.js')).href)

const html = await readFile(htmlPath, 'utf8')
if (!html.includes('<!--app-html-->')) throw new Error('У dist/index.html немає <!--app-html-->')
await writeFile(htmlPath, html.replace('<!--app-html-->', render()))
await rm(resolve(root, 'dist-ssr'), { recursive: true, force: true })
console.log('✓ prerender: dist/index.html')
