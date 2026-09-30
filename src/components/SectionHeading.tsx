import type { ReactNode } from 'react'

interface Props {
  id: string
  eyebrow: string
  children: ReactNode
  lead?: ReactNode
  className?: string
}

/** Єдиний h2 секції: id використовує section[aria-labelledby] */
export function SectionHeading({ id, eyebrow, children, lead, className = '' }: Props) {
  return (
    <div className={className}>
      <p className="eyebrow" data-reveal>
        {eyebrow}
      </p>
      <h2 id={id} className="h2 mt-5" data-reveal>
        {children}
      </h2>
      {lead && (
        <p className="lead mt-5 max-w-[34rem]" data-reveal>
          {lead}
        </p>
      )}
    </div>
  )
}
