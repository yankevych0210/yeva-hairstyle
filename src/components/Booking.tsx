import { ArrowUpRight, MapPin } from 'lucide-react'
import { location, steps } from '../data/siteData'
import { ContactButtons } from './ContactButtons'
import { SectionHeading } from './SectionHeading'

export function Booking() {
  return (
    <section id="booking" aria-labelledby="booking-title" className="section on-dark relative overflow-hidden bg-dark text-on-dark">
      <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <SectionHeading id="booking-title" eyebrow="Запис">
            Як <em>записатися</em>
          </SectionHeading>

          <ol className="mt-12 space-y-0 md:mt-14">
            {steps.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[3.25rem_1fr] gap-4 border-t border-on-dark/15 py-6 md:grid-cols-[5rem_1fr] md:py-7" data-reveal>
                <span className="font-serif text-[2.25rem] italic leading-none text-sand md:text-5xl">{i + 1}</span>
                <div>
                  <h3 className="font-serif text-[1.65rem] font-medium leading-tight md:text-3xl">{s.title}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-on-dark-soft md:text-base">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="lg:col-span-5 lg:pt-4">
          <div className="rounded-lg bg-on-dark/[0.06] p-6 ring-1 ring-inset ring-on-dark/10 md:p-8 lg:sticky lg:top-[calc(var(--header-h)+24px)]" data-reveal>
            <p className="font-serif text-[1.9rem] leading-tight md:text-4xl">Оберімо дату?</p>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-on-dark-soft">
              Напишіть, на коли потрібна зачіска, і я відповім щодо вільного часу.
            </p>
            <ContactButtons className="mt-7" />

            <div className="mt-8 border-t border-on-dark/15 pt-6">
              <p className="flex items-start gap-3">
                <MapPin size={20} strokeWidth={1.75} aria-hidden="true" className="mt-0.5 shrink-0 text-sand" />
                <span>
                  <span className="block font-semibold">{location.city}</span>
                  {location.address && <span className="block text-on-dark-soft">{location.address}</span>}
                </span>
              </p>
              {location.schedule.length > 0 && (
                <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-[0.9375rem]">
                  {location.schedule.map((row) => (
                    <div key={row.days} className="contents">
                      <dt className="text-on-dark-soft">{row.days}</dt>
                      <dd>{row.hours}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {location.mapsUrl && (
                <a
                  href={location.mapsUrl}
                  target="_blank"
                  rel="noopener"
                  className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-sand hover:text-on-dark"
                >
                  Відкрити в Google Maps
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              )}
            </div>
            {location.mapsEmbed && (
              <iframe
                title={`Карта: ${location.city}`}
                src={location.mapsEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="mt-6 aspect-[4/3] w-full rounded-md border-0 grayscale-[0.4]"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
