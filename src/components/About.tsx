import { about, brand, contacts, principles } from '../data/siteData'
import { Photo } from './Photo'
import { SectionHeading } from './SectionHeading'

/** Маленьке фото-«пігулка» всередині цитати */
function InlinePhoto({ name }: { name: string }) {
  return (
    <span className="relative mx-1 inline-block h-[0.78em] w-[1.5em] translate-y-[0.08em] overflow-hidden rounded-full align-baseline md:mx-2">
      <Photo as="span" name={name} alt="" sizes="160px" aspect="auto" className="!absolute inset-0 h-full w-full" />
    </span>
  )
}

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="section overflow-hidden">
      <div className="container-page">
        {/* Цитата з біо в Instagram */}
        <figure className="mx-auto max-w-[62rem] text-center" data-reveal>
          <blockquote className="font-serif text-[2.35rem] font-medium leading-[1.05] tracking-[-0.015em] xs:text-[2.6rem] md:text-[4rem] lg:text-[4.9rem]">
            <p>
              «{about.quote[0]}
              <InlinePhoto name={about.inline[0]} />
              {about.quote[1]}{' '}
              <span className="whitespace-nowrap">
                <em className="italic text-accent-ink">{about.quoteAccent}</em>
                <InlinePhoto name={about.inline[1]} />»
              </span>
            </p>
          </blockquote>
          <figcaption className="mt-8 text-xs font-semibold uppercase tracking-[0.24em] text-ink-soft">
            {brand.master} · <a href={contacts.instagram.url} target="_blank" rel="noopener" className="inline-flex min-h-[44px] items-center underline decoration-line underline-offset-4 hover:text-ink">@{contacts.instagram.handle}</a>
          </figcaption>
        </figure>

        <div className="mt-20 grid items-center gap-12 md:mt-28 md:grid-cols-12 md:gap-10 lg:gap-16">
          <div className="relative md:col-span-5">
            <div data-reveal="clip" className="arch-3x4 overflow-hidden">
              <Photo name={about.media} alt={about.mediaAlt} sizes="(min-width: 768px) 38vw, 100vw" aspect="3 / 4" />
            </div>
            <span
              aria-hidden="true"
              className="absolute -bottom-8 -right-2 font-serif text-[8rem] italic leading-none text-accent/20 md:-right-10 md:text-[11rem]"
            >
              Є
            </span>
          </div>

          <div className="md:col-span-7 lg:col-span-6 lg:col-start-7">
            <SectionHeading id="about-title" eyebrow="(01) Про мене">
              {about.titleLead} <em>{about.titleAccent}</em>
            </SectionHeading>
            <div className="mt-6 space-y-4">
              {about.paragraphs.map((p) => (
                <p key={p} className="lead" data-reveal>
                  {p}
                </p>
              ))}
            </div>

            <ol className="mt-10 border-t border-line">
              {principles.map((p, i) => (
                <li key={p.title} className="grid grid-cols-[2.5rem_1fr] gap-3 border-b border-line py-5 md:grid-cols-[3.5rem_1fr]" data-reveal>
                  <span className="pt-1 font-serif text-lg italic text-accent-ink">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="font-serif text-[1.6rem] font-medium leading-tight">{p.title}</h3>
                    <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-soft">{p.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
