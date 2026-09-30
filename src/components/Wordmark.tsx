import brandMark from '../data/brand.gen.json'
import { brand } from '../data/siteData'

/** Знак (арка-дзеркало + «Y»), контури з scripts/brand.mjs. Колір — currentColor, арка — акцент */
export function Mark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox={brandMark.viewBox} className={className} aria-hidden="true" focusable="false">
      <path d={brandMark.outer} fill="none" stroke="rgb(var(--mark-line))" strokeWidth="9" />
      <path d={brandMark.inner} fill="none" stroke="rgb(var(--mark-line))" strokeWidth="3" strokeOpacity=".55" />
      <path d={brandMark.y} fill="currentColor" />
    </svg>
  )
}

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 leading-none ${className}`}>
      <Mark className="h-10 w-auto shrink-0" />
      <span className="flex flex-col">
        <span className="font-serif text-[1.75rem] font-medium italic leading-[0.9] tracking-[-0.01em]">{brand.wordmark}</span>
        <span className="mt-1 text-[0.5625rem] font-semibold uppercase tracking-[0.36em] opacity-75">{brand.wordmarkSub}</span>
      </span>
    </span>
  )
}
