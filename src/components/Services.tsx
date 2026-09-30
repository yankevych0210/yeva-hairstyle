import { ArrowUpRight, Clock } from 'lucide-react'
import { contacts } from '../data/siteData'
import { activeServices, formatPrice } from '../lib/sections'
import { Photo } from './Photo'
import { SectionHeading } from './SectionHeading'

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="section bg-surface">
      <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+40px)]">
            <SectionHeading
              id="services-title"
              eyebrow="(02) Послуги"
              lead="Кожну зачіску підлаштовую під вас: довжину й текстуру волосся, образ і формат події."
            >
              Що я <em>роблю</em>
            </SectionHeading>
          </div>
        </div>

        <ol className="lg:col-span-8">
          {activeServices.map((s, i) => (
            <li
              key={s.id}
              data-reveal
              className={
                s.featured
                  ? 'on-dark grain mt-4 overflow-hidden rounded-lg bg-dark text-on-dark first:mt-0'
                  : 'border-t border-line first:border-t-0 last:border-b'
              }
            >
              <div className={`grid grid-cols-[1fr_auto] items-start gap-5 md:gap-8 ${s.featured ? 'p-6 md:p-8' : 'py-7 md:py-9'}`}>
                <div className="min-w-0">
                  <span className={`font-serif text-lg italic ${s.featured ? 'text-sand' : 'text-accent-ink'}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-2 font-serif text-[2rem] font-medium leading-[1.02] tracking-[-0.01em] md:text-[2.75rem]">{s.title}</h3>
                  <p className={`mt-3 max-w-[30rem] text-[0.9375rem] leading-relaxed md:text-base ${s.featured ? 'text-on-dark/75' : 'text-ink-soft'}`}>
                    {s.text}
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
                    {s.priceFrom !== null ? (
                      <span className="font-serif text-2xl font-medium">{formatPrice(s.priceFrom)}</span>
                    ) : (
                      <a
                        href={contacts.instagram.direct}
                        target="_blank"
                        rel="noopener"
                        className={`-my-2 flex min-h-[44px] items-center gap-1.5 text-sm font-semibold ${s.featured ? 'text-sand hover:text-on-dark' : 'text-accent-ink hover:text-ink'}`}
                      >
                        Дізнатися ціну в Direct
                        <ArrowUpRight size={16} aria-hidden="true" />
                      </a>
                    )}
                    {s.duration && (
                      <span className="flex items-center gap-1.5 text-sm opacity-75">
                        <Clock size={15} aria-hidden="true" />
                        {s.duration}
                      </span>
                    )}
                  </div>
                </div>
                <div data-reveal="clip" className="arch-3x4 w-[5.5rem] shrink-0 overflow-hidden xs:w-24 md:w-40">
                  <Photo name={s.image} alt="" sizes="(min-width: 768px) 160px, 96px" aspect="3 / 4" />
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
