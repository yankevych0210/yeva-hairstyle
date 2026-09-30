import { brand } from '../data/siteData'

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-2 leading-none ${className}`}>
      <span className="font-serif text-[1.85rem] font-medium italic tracking-[-0.01em]">{brand.wordmark}</span>
      <span className="text-[0.625rem] font-semibold uppercase tracking-[0.32em] opacity-75">{brand.wordmarkSub}</span>
    </span>
  )
}
