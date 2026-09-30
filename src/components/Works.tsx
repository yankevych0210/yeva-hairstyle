import { useState } from 'react'
import { workCategories, works } from '../data/siteData'
import { SectionHeading } from './SectionHeading'
import { useMediaViewer } from './useMediaViewer'
import { WorkTile } from './WorkTile'

const ALL = 'all'
const DUO = 'duo'
const filters = [
  { id: ALL, label: 'Усі' },
  ...workCategories.filter((c) => works.some((w) => w.category === c.id)),
  ...(works.some((w) => w.duo) ? [{ id: DUO, label: 'В 4 руки' }] : []),
]

export function Works() {
  const [filter, setFilter] = useState(ALL)
  const items =
    filter === ALL ? works : filter === DUO ? works.filter((w) => w.duo) : works.filter((w) => w.category === filter)
  const { open, viewer, categoryLabel } = useMediaViewer(items)

  return (
    <section id="works" aria-labelledby="works-title" className="section">
      <div className="container-page">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading id="works-title" eyebrow="(04) Роботи">
            Мої <em>роботи</em>
          </SectionHeading>
          {filters.length > 2 && (
            <div className="chip-rail" role="group" aria-label="Фільтр робіт" data-reveal>
              {filters.map((c) => (
                <button key={c.id} type="button" className="chip" aria-pressed={filter === c.id} onClick={() => setFilter(c.id)}>
                  {c.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <ul className="works-offset stagger-2 stagger-3 mt-10 grid grid-cols-2 gap-3 md:mt-16 md:gap-5 lg:grid-cols-3 lg:gap-7">
          {items.map((w, i) => {
            // Непарна кількість на мобільному — перша робота на всю ширину, щоб ряди були рівні
            const wide = i === 0 && items.length % 2 === 1
            return (
              <li key={w.id} data-reveal className={wide ? 'col-span-2 lg:col-span-1' : undefined}>
                <WorkTile
                  work={w}
                  label={categoryLabel(w.category)}
                  sizes="(min-width: 1024px) 31vw, 48vw"
                  aspect={wide ? '4 / 3' : '4 / 5'}
                  className={`rounded-md md:rounded-lg ${wide ? 'lg:[&>div]:!aspect-[4/5]' : ''}`}
                  onOpen={open(i)}
                />
              </li>
            )
          })}
        </ul>
      </div>
      {viewer}
    </section>
  )
}
