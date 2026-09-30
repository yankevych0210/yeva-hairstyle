import { ArrowUpRight, Clock } from 'lucide-react'
import { contacts } from '../data/siteData'
import { activeServices, formatPrice } from '../lib/sections'
import { Photo } from './Photo'
import { SectionHeading } from './SectionHeading'

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="section bg-surface">
      <div className="container-page">
        <SectionHeading
          id="services-title"
          eyebrow="Послуги"
          lead="Кожну зачіску підлаштовую під вас: довжину й густоту волосся, образ і формат події."
        >
          Що я <em>роблю</em>
        </SectionHeading>

        <ul className="stagger-md-2 stagger-4 mt-12 grid gap-5 md:mt-16 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {activeServices.map((s, i) => (
            <li key={s.id} data-reveal className="flex flex-col overflow-hidden rounded-lg bg-bg">
              <Photo
                name={s.image}
                alt=""
                sizes="(min-width: 1024px) 23vw, (min-width: 768px) 45vw, 100vw"
                aspect="16 / 10"
                className="md:!aspect-[4/3] lg:!aspect-[3/4]"
              />
              <div className="flex flex-1 flex-col p-6 lg:p-7">
                <span className="text-xs font-semibold tabular-nums tracking-[0.2em] text-accent-ink">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-3 font-serif text-[1.75rem] font-medium leading-tight">{s.title}</h3>
                <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-ink-soft">{s.text}</p>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-line pt-5">
                  {s.priceFrom !== null ? (
                    <span className="font-serif text-2xl font-medium">{formatPrice(s.priceFrom)}</span>
                  ) : (
                    <a
                      href={contacts.instagram.direct}
                      target="_blank"
                      rel="noopener"
                      className="-my-2 flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-accent-ink hover:text-ink"
                    >
                      Дізнатися ціну
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </a>
                  )}
                  {s.duration && (
                    <span className="flex items-center gap-1.5 text-sm text-ink-soft">
                      <Clock size={15} aria-hidden="true" />
                      {s.duration}
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
