import type { MouseEvent } from 'react'
import { Play } from 'lucide-react'
import { getVideo } from '../lib/media'
import type { Work } from '../types'
import { Photo } from './Photo'

interface Props {
  work: Work
  label: string
  sizes: string
  aspect?: string
  className?: string
  onOpen: (e: MouseEvent<HTMLElement>) => void
  /** Бейдж «4 руки» (у стрічці «Образ у 4 руки» зайвий) */
  duoBadge?: boolean
}

/** Плитка роботи: кнопка, що відкриває лайтбокс */
export function WorkTile({ work, label, sizes, aspect = '4 / 5', className = '', onOpen, duoBadge = true }: Props) {
  const isVideo = work.kind === 'video'
  const poster = isVideo ? getVideo(work.media)?.poster : work.media
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group relative block w-full overflow-hidden text-left ${className}`}
      aria-label={`${work.title} — відкрити ${isVideo ? 'відео' : 'фото'}`}
    >
      <Photo
        name={poster ?? work.media}
        alt={work.alt}
        sizes={sizes}
        aspect={aspect}
        imgClassName="transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
      />
      <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent p-3 pt-14 text-white md:p-5 md:pt-20">
        {(label || (duoBadge && work.duo)) && (
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-white/80 md:text-[0.6875rem]">
            {label}
            {duoBadge && work.duo && (
              <span className="whitespace-nowrap rounded-full border border-white/40 px-1.5 py-px tracking-[0.12em]">4 руки</span>
            )}
          </span>
        )}
        <span className="mt-1 block font-serif text-lg leading-tight md:text-[1.6rem]">{work.title}</span>
      </span>
      {isVideo && (
        <span className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-ink backdrop-blur transition-transform duration-500 group-hover:scale-110 md:right-4 md:top-4 md:h-12 md:w-12">
          <Play size={16} fill="currentColor" aria-hidden="true" className="translate-x-px" />
        </span>
      )}
      <span className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-active:bg-black/10" />
    </button>
  )
}
