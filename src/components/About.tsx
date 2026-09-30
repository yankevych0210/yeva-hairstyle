import { about, principles } from '../data/siteData'
import { Photo } from './Photo'
import { SectionHeading } from './SectionHeading'

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="section">
      <div className="container-page">
        <div className="grid items-center gap-12 md:grid-cols-12 md:gap-10 lg:gap-16">
          <div className="relative md:col-span-5" data-reveal>
            <Photo
              name={about.media}
              alt={about.mediaAlt}
              sizes="(min-width: 768px) 38vw, 100vw"
              aspect="3 / 4"
              tone="sand"
              className="rounded-lg"
            />
            <span
              aria-hidden="true"
              className="absolute -bottom-6 -right-3 font-serif text-[7rem] italic leading-none text-accent/25 md:-right-8 md:text-[9rem]"
            >
              Є
            </span>
          </div>

          <div className="md:col-span-7 lg:col-span-6 lg:col-start-7">
            <SectionHeading id="about-title" eyebrow="Про мене">
              {about.titleLead} <em>{about.titleAccent}</em>
            </SectionHeading>
            <div className="mt-6 space-y-4">
              {about.paragraphs.map((p) => (
                <p key={p} className="lead" data-reveal>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </div>

        <ol className="stagger-md-3 mt-16 grid gap-px overflow-hidden rounded-lg border border-line bg-line md:mt-24 md:grid-cols-3">
          {principles.map((p, i) => (
            <li key={p.title} className="bg-bg p-7 md:p-8 lg:p-10" data-reveal>
              <span className="font-serif text-lg italic text-accent-ink">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-4 font-serif text-[1.75rem] font-medium leading-tight">{p.title}</h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">{p.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
