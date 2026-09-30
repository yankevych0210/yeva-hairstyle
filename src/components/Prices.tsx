import { priceNotes } from '../data/siteData'
import { formatPrice, pricedServices } from '../lib/sections'
import { SectionHeading } from './SectionHeading'

export function Prices() {
  return (
    <section id="prices" aria-labelledby="prices-title" className="section on-dark bg-dark text-on-dark">
      <div className="container-page grid gap-12 lg:grid-cols-12">
        <SectionHeading id="prices-title" eyebrow="Прайс" className="lg:col-span-4">
          <em>Ціни</em>
        </SectionHeading>

        <div className="lg:col-span-8">
          {pricedServices.length > 0 && (
            <ul className="divide-y divide-on-dark/15 border-y border-on-dark/15">
              {pricedServices.map((s) => (
                <li key={s.id} className="flex items-baseline gap-4 py-5 md:py-6" data-reveal>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-serif text-2xl md:text-[1.75rem]">{s.title}</h3>
                    {s.duration && <p className="mt-1 text-sm text-on-dark-soft">{s.duration}</p>}
                  </div>
                  <p className="shrink-0 font-serif text-2xl md:text-[1.75rem]">{formatPrice(s.priceFrom as number)}</p>
                </li>
              ))}
            </ul>
          )}
          {priceNotes.length > 0 && (
            <ul className="stagger-md-2 mt-10 grid gap-4 md:grid-cols-2">
              {priceNotes.map((n) => (
                <li key={n.title} className="rounded-md border border-on-dark/15 p-6" data-reveal>
                  <h3 className="font-semibold">{n.title}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-on-dark-soft">{n.text}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
