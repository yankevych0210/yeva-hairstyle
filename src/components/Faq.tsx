import { Plus } from 'lucide-react'
import { answeredFaq } from '../lib/sections'
import { SectionHeading } from './SectionHeading'

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="section">
      <div className="container-page grid gap-10 lg:grid-cols-12">
        <SectionHeading id="faq-title" eyebrow="Питання" className="lg:col-span-4">
          Часті <em>питання</em>
        </SectionHeading>
        <div className="border-t border-line lg:col-span-8">
          {answeredFaq.map((f) => (
            <details key={f.q} className="group border-b border-line" data-reveal>
              <summary className="flex min-h-[64px] cursor-pointer list-none items-center justify-between gap-6 py-5 font-serif text-[1.35rem] leading-snug md:text-2xl [&::-webkit-details-marker]:hidden">
                {f.q}
                <Plus size={22} strokeWidth={1.5} aria-hidden="true" className="shrink-0 transition-transform duration-300 group-open:rotate-45" />
              </summary>
              <p className="pb-6 pr-10 text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
