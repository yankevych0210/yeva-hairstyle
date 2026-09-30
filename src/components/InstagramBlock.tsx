import { useEffect, useState } from 'react'
import { ArrowUpRight, Play } from 'lucide-react'
import { beholdFeedUrl, contacts, instagramCovers } from '../data/siteData'
import { InstagramIcon } from './icons'
import { Photo } from './Photo'

interface LivePost {
  url: string
  src: string
  width: number
  height: number
  alt: string
  video: boolean
}

interface BeholdPost {
  permalink: string
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  prunedCaption?: string
  sizes?: { medium?: { mediaUrl: string; width: number; height: number } }
}

/** Живі пости з behold.so (після гідратації). До того й при помилці — локальні обкладинки з SSR */
function useBeholdFeed() {
  const [posts, setPosts] = useState<LivePost[] | null>(null)
  useEffect(() => {
    const ctrl = new AbortController()
    fetch(beholdFeedUrl, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d: { posts?: BeholdPost[] }) => {
        const list = (d.posts ?? [])
          .filter((p) => p.sizes?.medium?.mediaUrl)
          .slice(0, 6)
          .map((p) => ({
            url: p.permalink,
            src: p.sizes!.medium!.mediaUrl,
            width: p.sizes!.medium!.width,
            height: p.sizes!.medium!.height,
            alt: p.prunedCaption?.trim() || 'Пост @yeva.hairstyle в Instagram',
            video: p.mediaType === 'VIDEO',
          }))
        if (list.length >= 3) setPosts(list)
      })
      .catch(() => {})
    return () => ctrl.abort()
  }, [])
  return posts
}

const tile = 'group relative block aspect-square overflow-hidden rounded-sm bg-sand md:rounded-md'

export function InstagramBlock() {
  const live = useBeholdFeed()

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

        <ul className="stagger-3 mt-10 grid grid-cols-3 gap-1.5 md:mt-14 md:gap-4">
          {live
            ? live.map((p) => (
                <li key={p.url} data-reveal>
                  <a href={p.url} target="_blank" rel="noopener" className={tile} aria-label={`Пост в Instagram: ${p.alt.slice(0, 80)}`}>
                    <img
                      src={p.src}
                      width={p.width}
                      height={p.height}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {p.video && (
                      <Play size={18} fill="currentColor" aria-hidden="true" className="absolute right-2 top-2 text-white drop-shadow md:right-3 md:top-3" />
                    )}
                  </a>
                </li>
              ))
            : instagramCovers.slice(0, 6).map((c) => (
                <li key={c.url + c.media} data-reveal>
                  <a href={c.url} target="_blank" rel="noopener" className={tile} aria-label="Пост в Instagram">
                    <Photo
                      name={c.media}
                      alt=""
                      sizes="(min-width: 1024px) 380px, 33vw"
                      aspect="auto"
                      className="!absolute inset-0 h-full w-full"
                      imgClassName="transition-transform duration-700 group-hover:scale-105"
                    />
                  </a>
                </li>
              ))}
        </ul>
      </div>
    </section>
  )
}
