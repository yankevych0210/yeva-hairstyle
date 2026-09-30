import { ArrowRight, MapPin } from 'lucide-react'
import { brand, contacts, hero } from '../data/siteData'
import { pricesAnchor } from '../lib/sections'
import { delay } from '../lib/style'
import { Photo } from './Photo'

export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="relative overflow-hidden pb-14 md:pb-20 lg:pb-24"
      style={{ paddingTop: 'calc(var(--header-h) + var(--safe-t) + 20px)' }}
    >
      {/* Декоративна дуга */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-10 hidden h-[720px] w-[720px] text-line lg:block"
        viewBox="0 0 720 720"
        fill="none"
      >
        <circle cx="360" cy="360" r="359" stroke="currentColor" />
        <circle cx="360" cy="360" r="300" stroke="currentColor" strokeOpacity="0.5" />
      </svg>

      <div className="container-page relative grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6 lg:py-10">
          <p className="hero-in eyebrow" style={delay(0)}>
            <MapPin size={14} strokeWidth={2} aria-hidden="true" className="-mr-1" />
            {hero.eyebrow}
          </p>

          <h1
            id="hero-title"
            className="mt-6 font-serif text-[3.2rem] font-medium leading-[0.95] tracking-[-0.02em] xs:text-[3.6rem] md:text-[5rem] lg:text-[5.4rem] xl:text-[6.2rem]"
          >
            <span className="hero-in block" style={delay(80)}>
              {hero.titleLead}
            </span>
            <span className="hero-in block italic text-accent-ink" style={delay(160)}>
              {hero.titleAccent}
            </span>
            <span className="hero-in block" style={delay(240)}>
              {hero.titleTail}
            </span>
          </h1>

          <p
            className="hero-in lead mt-6 max-w-[30rem] md:mt-8"
            style={delay(340)}
          >
            {hero.text}
          </p>

          <div
            className="hero-in mt-8 flex flex-col gap-3 xs:flex-row md:mt-10"
            style={delay(420)}
          >
            <a href="#booking" className="btn btn-primary xs:flex-1 sm:flex-none sm:px-8">
              Записатися
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a href={pricesAnchor} className="btn btn-ghost xs:flex-1 sm:flex-none sm:px-8">
              Ціни
            </a>
          </div>
        </div>

        <div className="relative lg:col-span-5 lg:col-start-8">
          <div className="hero-img-in">
            <Photo
              name={hero.media}
              alt={hero.mediaAlt}
              sizes="(min-width: 1024px) 40vw, (min-width: 640px) 80vw, 100vw"
              aspect="4 / 5"
              priority
              tone="rose"
              className="rounded-lg"
            />
          </div>
          <a
            href={contacts.instagram.url}
            target="_blank"
            rel="noopener"
            className="hero-in absolute -bottom-5 left-5 flex min-h-[48px] items-center gap-3 rounded-full bg-bg py-2 pl-2 pr-5 text-sm font-semibold shadow-[0_10px_30px_-12px_rgb(var(--c-ink)/0.35)] transition-transform active:scale-[0.97] md:left-8"
            style={delay(600)}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink font-serif text-lg italic text-bg">
              Y
            </span>
            @{contacts.instagram.handle}
          </a>
          <p
            aria-hidden="true"
            className="absolute -right-2 top-1/2 hidden origin-center translate-x-1/2 -translate-y-1/2 rotate-90 whitespace-nowrap text-[0.6875rem] font-semibold uppercase tracking-[0.4em] text-ink-soft xl:block"
          >
            {brand.tagline}
          </p>
        </div>
      </div>
    </section>
  )
}
