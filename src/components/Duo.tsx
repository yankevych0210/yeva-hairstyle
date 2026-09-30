import { ArrowUpRight } from 'lucide-react'
import { contacts, duo, works } from '../data/siteData'
import { SectionHeading } from './SectionHeading'
import { useMediaViewer } from './useMediaViewer'
import { WorkTile } from './WorkTile'

const items = works.filter((w) => w.duo)

/** «Образ у 4 руки»: зачіска Єви + макіяж візажистки. Відео-стрічка як Reels */
export function Duo() {
  const { open, viewer } = useMediaViewer(items)
  return (
    <section id="duo" aria-labelledby="duo-title" className="section on-dark grain overflow-hidden bg-dark text-on-dark">
      <div className="container-page grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-10">
        <div className="lg:col-span-4">
          <SectionHeading id="duo-title" eyebrow={`(03) ${duo.eyebrow}`} lead={duo.text}>
            {duo.titleLead} <em>{duo.titleAccent}</em>
          </SectionHeading>
          <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-md bg-on-dark/15 text-sm" data-reveal>
            <div className="bg-dark p-4">
              <dt className="text-xs uppercase tracking-[0.2em] text-on-dark-soft">Зачіска</dt>
              <dd className="mt-1">
                <a href={contacts.instagram.url} target="_blank" rel="noopener" className="inline-flex min-h-[44px] items-center font-semibold hover:text-sand">
                  @{contacts.instagram.handle}
                </a>
              </dd>
            </div>
            <div className="bg-dark p-4">
              <dt className="text-xs uppercase tracking-[0.2em] text-on-dark-soft">Макіяж</dt>
              <dd className="mt-1">
                <a href={duo.partner.url} target="_blank" rel="noopener" className="inline-flex min-h-[44px] items-center font-semibold hover:text-sand">
                  @{duo.partner.handle}
                </a>
              </dd>
            </div>
          </dl>
          <a href={contacts.instagram.direct} target="_blank" rel="noopener" className="btn btn-primary mt-8 w-full sm:w-auto sm:px-8" data-reveal>
            Хочу образ у 4 руки
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>

        {/* Reveal на всю стрічку: картки за краєм горизонтального скролу IntersectionObserver не бачить */}
        <ul className="media-rail lg:col-span-8 lg:pb-12" aria-label="Відео образів у 4 руки" data-reveal>
          {items.map((w, i) => (
            <li key={w.id} className="w-[68vw] max-w-[300px] xs:w-[60vw] md:w-[34vw] lg:w-auto lg:max-w-none">
              <WorkTile
                work={w}
                label={w.credit?.split(' · ').find((c) => c.startsWith('Макіяж')) ?? ''}
                duoBadge={false}
                playCenter
                sizes="(min-width: 1024px) 22vw, 68vw"
                aspect="9 / 16"
                className="arch-9x16"
                onOpen={open(i)}
              />
            </li>
          ))}
        </ul>
      </div>
      {viewer}
    </section>
  )
}
