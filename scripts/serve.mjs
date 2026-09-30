// Локальний сервер для dist/, що відтворює vercel.json: заголовки (CSP, кеш), cleanUrls і 404.html.
// Потрібен, бо `vite preview` заголовків Vercel не застосовує. Запуск: npm run serve [-- --port 4174]
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs'
import http from 'node:http'
import { extname, join, normalize } from 'node:path'

const root = 'dist'
const port = Number(process.argv[process.argv.indexOf('--port') + 1]) || 4174
const config = JSON.parse(readFileSync('vercel.json', 'utf8'))
const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.webmanifest': 'application/manifest+json', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.mp4': 'video/mp4',
}
// Vercel source-патерни → RegExp: (a|b) лишаються групами, (.*) — будь-що
const rules = config.headers.map((h) => ({ re: new RegExp(`^${h.source.replace(/\./g, '\\.')}$`), headers: h.headers }))

http
  .createServer((req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0])
    let file = normalize(join(root, url === '/' ? 'index.html' : url))
    if (!file.startsWith(root)) return res.writeHead(403).end()
    if (!existsSync(file) && existsSync(`${file}.html`)) file = `${file}.html` // cleanUrls
    let status = 200
    if (!existsSync(file) || statSync(file).isDirectory()) {
      file = join(root, '404.html')
      status = 404
    }
    for (const r of rules) if (r.re.test(url)) for (const h of r.headers) res.setHeader(h.key, h.value)
    res.setHeader('Content-Type', types[extname(file)] ?? 'application/octet-stream')
    // Range — для відео в Safari
    const size = statSync(file).size
    const range = req.headers.range?.match(/bytes=(\d*)-(\d*)/)
    if (range && status === 200) {
      const start = Number(range[1] || 0)
      const end = range[2] ? Number(range[2]) : size - 1
      res.writeHead(206, { 'Content-Range': `bytes ${start}-${end}/${size}`, 'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1 })
      return createReadStream(file, { start, end }).pipe(res)
    }
    res.writeHead(status, { 'Content-Length': size, 'Accept-Ranges': 'bytes' })
    createReadStream(file).pipe(res)
  })
  .listen(port, () => console.log(`dist → http://localhost:${port}/ (заголовки з vercel.json)`))
