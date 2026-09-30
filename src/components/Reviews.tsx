import { reviews } from '../data/siteData'
import { SectionHeading } from './SectionHeading'

export function Reviews() {
  return (
    <section id="reviews" aria-labelledby="reviews-title" className="section bg-surface">
      <div className="container-page">
        <SectionHeading id="reviews-title" eyebrow="Відгуки">
          Що <em>кажуть</em> клієнтки
        </SectionHeading>
        <ul className="stagger-md-2 stagger-3 mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <li key={r.name + r.text.slice(0, 12)} data-reveal>
              <figure className="flex h-full flex-col rounded-lg bg-bg p-7 md:p-8">
                <span aria-hidden="true" className="font-serif text-6xl leading-none text-accent/50">
                  “
                </span>
                <blockquote className="mt-2 flex-1 text-[1.0625rem] leading-relaxed">{r.text}</blockquote>
                <figcaption className="mt-6 border-t border-line pt-5 text-sm">
                  <span className="font-semibold">{r.name}</span>
                  {r.context && <span className="text-ink-soft"> · {r.context}</span>}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
