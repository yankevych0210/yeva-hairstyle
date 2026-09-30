// Брендових іконок у lucide немає — власні, у стилі lucide (stroke 1.75, 24×24)
import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>
const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

export function InstagramIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function TelegramIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M21.5 4.5 2.8 11.4c-.9.3-.9 1.6 0 1.9l4.6 1.5 1.8 5.4c.2.7 1.1.9 1.6.4l2.6-2.5 4.7 3.5c.6.4 1.4.1 1.6-.6l3-14.9c.2-.8-.6-1.5-1.2-1.6Z" />
      <path d="m7.4 14.8 10-7.1-7.6 8.4" />
    </svg>
  )
}
