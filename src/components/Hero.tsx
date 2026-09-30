import { useEffect, useRef } from 'react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { brand, contacts, hero } from '../data/siteData'
import { pricesAnchor } from '../lib/sections'
import { delay } from '../lib/style'
import { Photo } from './Photo'

/**
 * Перший екран. Шоурил: на мобільному — на весь екран під текстом, на десктопі — в арці.
 * Постер-картинка (LCP) під відео; відео вмикається JS-ом лише без prefers-reduced-motion
 * і Save-Data, та ставиться на паузу поза екраном.
 */
export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || conn?.saveData) return
    v.muted = true
    v.preload = 'auto'
    const onPlaying = () => v.classList.add('is-playing')
    v.addEventListener('playing', onPlaying)
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {})
      else v.pause()
    })
    io.observe(v)
    return () => {
      io.disconnect()
      v.removeEventListener('playing', onPlaying)
    }
  }, [])

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="on-dark grain relative isolate overflow-hidden bg-dark text-on-dark"
    >
      <div
        className="container-page grid min-h-hero content-end gap-10 pb-10 lg:min-h-0 lg:grid-cols-12 lg:content-center lg:gap-8 lg:pb-24"
        style={{ paddingTop: 'calc(var(--header-h) + var(--safe-t) + 32px)' }}
      >
        {/* Медіа: мобільний — фон на весь екран; десктоп — арка праворуч */}
        <div className="absolute inset-0 -z-10 lg:relative lg:inset-auto lg:z-0 lg:order-2 lg:col-span-5 lg:col-start-8">
          <div className="hero-img-in relative h-full w-full overflow-hidden lg:arch-9x16 lg:mx-auto lg:aspect-[9/16] lg:h-[min(80vh,780px)] lg:w-auto">
            <Photo
              name={hero.media}
              alt={hero.mediaAlt}
              sizes={hero.mediaSizes}
              priority
              aspect="auto"
              className="!absolute inset-0 h-full w-full bg-dark"
            />
            <video
              ref={videoRef}
              className="hero-video absolute inset-0 h-full w-full object-cover"
              muted
              loop
              playsInline
              preload="none"
              aria-hidden="true"
              tabIndex={-1}
            >
              <source src={hero.video.hevc} type='video/mp4; codecs="hvc1"' />
              <source src={hero.video.h264} type="video/mp4" />
            </video>
            {/* Затемнення під текст (мобільний) */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/55 to-dark/25 lg:hidden" />
          </div>

          {/* Обертовий бейдж «Запис у Direct» */}
          <a
            href={contacts.instagram.direct}
            target="_blank"
            rel="noopener"
            aria-label="Записатися в Direct"
            className="hero-in absolute -left-14 bottom-16 hidden h-32 w-32 items-center justify-center rounded-full bg-bg text-ink shadow-[0_20px_50px_-20px_rgb(0_0_0/0.6)] transition-transform duration-500 hover:scale-105 lg:flex xl:-left-20"
            style={delay(700)}
          >
            <svg viewBox="0 0 120 120" className="spin-slow absolute inset-0 h-full w-full" aria-hidden="true">
              <defs>
                <path id="badge-circle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
              </defs>
              <text className="fill-current text-[10.5px] font-semibold uppercase tracking-[0.28em]">
                <textPath href="#badge-circle">Запис у Direct · Кременчук ·</textPath>
              </text>
            </svg>
            <ArrowUpRight size={26} strokeWidth={1.5} aria-hidden="true" />
          </a>
        </div>

        <div className="lg:order-1 lg:col-span-7">
          <p className="hero-in eyebrow whitespace-nowrap !tracking-[0.16em] xs:!tracking-[0.2em] md:!tracking-[0.22em]" style={delay(0)}>
            {hero.eyebrow}
          </p>
          <h1
            id="hero-title"
            className="mt-6 font-serif text-[3.4rem] font-medium leading-[0.92] tracking-[-0.025em] xs:text-[3.9rem] md:text-[5.6rem] lg:text-[6.2rem] xl:text-[7.4rem]"
          >
            <span className="hero-in block" style={delay(80)}>
              {hero.titleLead}
            </span>
            <span className="hero-in block italic text-sand" style={delay(170)}>
              {hero.titleAccent}
            </span>
            <span className="hero-in block" style={delay(260)}>
              {hero.titleTail}
            </span>
          </h1>
          <p className="hero-in mt-6 max-w-[28rem] text-[1.0625rem] leading-relaxed text-on-dark/80 md:mt-8 md:text-lg" style={delay(360)}>
            {hero.text}
          </p>
          <div className="hero-in mt-8 flex flex-col gap-3 xs:flex-row md:mt-10" style={delay(440)}>
            <a href="#booking" className="btn btn-primary xs:flex-1 sm:flex-none sm:px-8">
              Записатися
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a href={pricesAnchor} className="btn btn-ghost xs:flex-1 sm:flex-none sm:px-8">
              Послуги й ціни
            </a>
          </div>
          <div className="hero-in mt-10 hidden items-center gap-4 text-xs font-semibold uppercase tracking-[0.24em] text-on-dark-soft lg:flex" style={delay(560)}>
            <span className="scroll-cue relative block h-10 w-px overflow-hidden bg-on-dark/20" aria-hidden="true" />
            {brand.tagline}
          </div>
        </div>
      </div>
    </section>
  )
}
