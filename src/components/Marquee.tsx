import { activeServices } from '../lib/sections'
import { location } from '../data/siteData'

/** Декоративна стрічка під hero. Для скрінрідерів прихована — дублює послуги. */
export function Marquee() {
  const items = [...activeServices.map((s) => s.title), location.city]
  const row = (
    <span className="flex shrink-0 items-center">
      {items.map((t) => (
        <span key={t} className="flex items-center">
          <span className="px-6 font-serif text-[1.6rem] italic md:px-9 md:text-[2rem]">{t}</span>
          <span className="h-1.5 w-1.5 rotate-45 bg-accent" />
        </span>
      ))}
    </span>
  )
  return (
    <div aria-hidden="true" className="overflow-hidden border-y border-line bg-surface py-4 text-ink md:py-5">
      <div className="marquee flex w-max">
        {row}
        {row}
        {row}
      </div>
    </div>
  )
}
