/**
 * Брендовий плейсхолдер замість фото, поки немає оригіналів: пасма-хвилі у палітрі сайту.
 * Детермінований від seed — однаковий на сервері й клієнті (без hydration mismatch).
 */
const TONES = {
  sand: { from: '#EFE5D8', to: '#DCCAB6', a: '#FFFFFF', b: '#9C6B5E' },
  rose: { from: '#EAD9CE', to: '#CFAF9F', a: '#FFF8F2', b: '#83574B' },
  ink: { from: '#3A322D', to: '#221E1B', a: '#E4D6C6', b: '#B08A7C' },
} as const

export type Tone = keyof typeof TONES

function hash(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return h >>> 0
}

function rng(seed: number) {
  let t = seed
  return () => {
    t = (t + 0x6d2b79f5) | 0
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

const f = (n: number) => Math.round(n * 10) / 10

function strands(rand: () => number, count: number, startX: number, gap: number) {
  const a = 90 + rand() * 90
  const b = 100 + rand() * 110
  const c = 60 + rand() * 80
  const drift = -30 + rand() * 60
  const paths: string[] = []
  for (let i = 0; i < count; i++) {
    const x = startX + i * gap
    const k = 1 + Math.sin(i / 3) * 0.08
    paths.push(
      `M${f(x)},-30 C${f(x + a * k)},110 ${f(x - b * k)},210 ${f(x + drift)},290 S${f(x + c * k)},470 ${f(x - 20)},540`,
    )
  }
  return paths
}

export function PlaceholderArt({ seed, tone, className = '' }: { seed: string; tone?: Tone; className?: string }) {
  const h = hash(seed)
  const rand = rng(h)
  const t = TONES[tone ?? (['sand', 'rose', 'sand', 'ink'] as const)[h % 4]]
  const id = `pa${h.toString(36)}`
  const main = strands(rand, 26, 40 + rand() * 120, 5.2)
  const second = strands(rand, 14, 200 + rand() * 120, 6.5)

  return (
    <svg
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={t.from} />
          <stop offset="1" stopColor={t.to} />
        </linearGradient>
        <radialGradient id={`${id}r`} cx="0.3" cy="0.25" r="0.8">
          <stop offset="0" stopColor={t.a} stopOpacity="0.45" />
          <stop offset="1" stopColor={t.a} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="500" fill={`url(#${id}g)`} />
      <rect width="400" height="500" fill={`url(#${id}r)`} />
      <g fill="none" strokeLinecap="round">
        {second.map((d, i) => (
          <path key={`b${i}`} d={d} stroke={t.b} strokeOpacity={0.1 + (i % 4) * 0.035} strokeWidth={1} />
        ))}
        {main.map((d, i) => (
          <path key={`a${i}`} d={d} stroke={t.a} strokeOpacity={0.28 + Math.sin(i / 2.2) ** 2 * 0.5} strokeWidth={1.15} />
        ))}
      </g>
    </svg>
  )
}
