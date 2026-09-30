import { ArrowUpRight } from 'lucide-react'
import { contacts, instagramCovers } from '../data/siteData'
import { InstagramIcon } from './icons'
import { Photo } from './Photo'

export function InstagramBlock() {
  return (
    <section id="instagram" aria-labelledby="instagram-title" className="section">
      <div className="container-page">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow" data-reveal>
              Instagram
            </p>
            <h2 id="instagram-title" className="h2 mt-5 break-words" data-reveal>
              <em>@{contacts.instagram.handle}</em>
            </h2>
            <p className="lead mt-5 max-w-[30rem]" data-reveal>
              Свіжі роботи й процес — у моєму профілі.
            </p>
          </div>
          <a href={contacts.instagram.url} target="_blank" rel="noopener" className="btn btn-ghost shrink-0" data-reveal>
            <InstagramIcon />
            Відкрити профіль
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>

        {instagramCovers.length > 0 && (
          <ul className="stagger-3 mt-10 grid grid-cols-3 gap-1.5 md:mt-14 md:gap-4">
            {instagramCovers.slice(0, 6).map((name) => (
              <li key={name} data-reveal>
                <a
                  href={contacts.instagram.url}
                  target="_blank"
                  rel="noopener"
                  className="block overflow-hidden rounded-sm md:rounded-md"
                  aria-label="Пост в Instagram"
                >
                  <Photo name={name} alt="" sizes="33vw" aspect="1 / 1" imgClassName="transition-transform duration-700 hover:scale-105" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
