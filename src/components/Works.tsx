import { useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { Play } from 'lucide-react'
import { workCategories, works } from '../data/siteData'
import { getVideo } from '../lib/media'
import { Lightbox } from './Lightbox'
import { Photo } from './Photo'
import { SectionHeading } from './SectionHeading'

const ALL = 'all'
const categories = [
  { id: ALL, label: 'Усі' },
  ...workCategories.filter((c) => works.some((w) => w.category === c.id)),
]
const categoryLabel = (id: string) => workCategories.find((c) => c.id === id)?.label ?? ''

export function Works() {
  const [filter, setFilter] = useState(ALL)
  const [index, setIndex] = useState<number | null>(null)
  const [soundBlocked, setSoundBlocked] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  const items = filter === ALL ? works : works.filter((w) => w.category === filter)

  /**
   * Відкриття / перегортання. flushSync рендерить відео синхронно, щоб play() зі звуком
   * викликався ще в межах жесту користувача (вимога Safari). Якщо браузер не дає звук —
   * граємо без нього й показуємо кнопку «Увімкнути звук».
   */
  const openAt = (i: number) => {
    flushSync(() => {
      setIndex(i)
      setSoundBlocked(false)
    })
    const v = videoRef.current
    if (!v) return
    v.muted = false
    v.play().catch(() => {
      v.muted = true
      setSoundBlocked(true)
      v.play().catch(() => {})
    })
  }

  return (
    <section id="works" aria-labelledby="works-title" className="section">
      <div className="container-page">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading id="works-title" eyebrow="Роботи">
            Мої <em>роботи</em>
          </SectionHeading>

          {categories.length > 2 && (
            <div className="chip-rail" role="group" aria-label="Фільтр робіт" data-reveal>
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className="chip"
                  aria-pressed={filter === c.id}
                  onClick={() => setFilter(c.id)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <ul className="stagger-2 stagger-3 mt-10 grid grid-cols-2 gap-3 md:mt-14 md:gap-5 lg:grid-cols-3 lg:gap-6">
          {items.map((w, i) => {
            const isVideo = w.kind === 'video'
            const poster = isVideo ? getVideo(w.media)?.poster : w.media
            return (
              <li key={w.id} data-reveal>
                <button
                  type="button"
                  onClick={(e) => {
                    triggerRef.current = e.currentTarget
                    openAt(i)
                  }}
                  className="group relative block w-full overflow-hidden rounded-md text-left md:rounded-lg"
                  aria-label={`${w.title} — відкрити${isVideo ? ' відео' : ' фото'}`}
                >
                  <Photo
                    name={poster ?? w.media}
                    alt={w.alt}
                    sizes="(min-width: 1024px) 31vw, 48vw"
                    aspect="4 / 5"
                    imgClassName="transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                  />
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-dark/70 via-dark/25 to-transparent p-3 pt-12 text-on-dark md:p-5 md:pt-16">
                    <span className="block text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-on-dark/80 md:text-[0.6875rem]">
                      {categoryLabel(w.category)}
                    </span>
                    <span className="mt-1 block font-serif text-lg leading-tight md:text-2xl">{w.title}</span>
                  </span>
                  {isVideo && (
                    <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-bg/85 text-ink backdrop-blur md:h-11 md:w-11">
                      <Play size={16} fill="currentColor" aria-hidden="true" />
                    </span>
                  )}
                  <span className="pointer-events-none absolute inset-0 bg-dark/0 transition-colors duration-300 group-active:bg-dark/10" />
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <Lightbox
        items={items}
        index={index}
        videoRef={videoRef}
        triggerRef={triggerRef}
        soundBlocked={soundBlocked}
        onUnmute={() => {
          const v = videoRef.current
          if (v) {
            v.muted = false
            v.play().catch(() => {})
          }
          setSoundBlocked(false)
        }}
        onNavigate={openAt}
        onClose={() => setIndex(null)}
        categoryLabel={categoryLabel}
      />
    </section>
  )
}
