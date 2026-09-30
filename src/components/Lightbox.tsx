import { useRef, type KeyboardEvent, type RefObject, type TouchEvent } from 'react'
import { ArrowUpRight, ChevronLeft, ChevronRight, Volume2, X } from 'lucide-react'
import { contacts } from '../data/siteData'
import { getImage, getVideo, imageSrc, imageSrcSet } from '../lib/media'
import { useDialog } from '../lib/useDialog'
import type { Work } from '../types'
import { InstagramIcon } from './icons'
import { PlaceholderArt } from './PlaceholderArt'

interface Props {
  items: Work[]
  index: number | null
  videoRef: RefObject<HTMLVideoElement>
  triggerRef: RefObject<HTMLElement | null>
  soundBlocked: boolean
  onUnmute: () => void
  onNavigate: (i: number) => void
  onClose: () => void
  categoryLabel: (id: string) => string
}

export function Lightbox({ items, index, videoRef, triggerRef, soundBlocked, onUnmute, onNavigate, onClose, categoryLabel }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const touch = useRef<{ x: number; y: number } | null>(null)
  const open = index !== null
  useDialog(ref, open, onClose, triggerRef)

  if (index === null) return null
  const work = items[index]
  if (!work) return null
  const count = items.length
  const go = (d: number) => onNavigate((index + d + count) % count)

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.target instanceof HTMLVideoElement) return
    if (e.key === 'ArrowRight') go(1)
    if (e.key === 'ArrowLeft') go(-1)
  }
  const onTouchStart = (e: TouchEvent) => {
    if (e.target instanceof HTMLVideoElement) return
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  const onTouchEnd = (e: TouchEvent) => {
    const t = touch.current
    touch.current = null
    if (!t || count < 2) return
    const dx = e.changedTouches[0].clientX - t.x
    const dy = e.changedTouches[0].clientY - t.y
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) go(dx < 0 ? 1 : -1)
  }

  const video = work.kind === 'video' ? getVideo(work.media) : null
  const image = video ? null : getImage(work.media)
  const vertical = video ? video.height >= video.width : true

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={work.title}
      onKeyDown={onKeyDown}
      className="on-dark fixed inset-0 z-[60] flex flex-col bg-[#15120f] text-on-dark"
      style={{
        paddingTop: 'var(--safe-t)',
        paddingBottom: 'var(--safe-b)',
        paddingLeft: 'var(--safe-l)',
        paddingRight: 'var(--safe-r)',
        animation: 'lb-in 320ms var(--ease-out) both',
      }}
    >
      {/* Верхня панель окремо від медіа — хрестик не перекриває нативні контроли Safari */}
      <div className="flex h-14 shrink-0 items-center justify-between px-4 md:h-16 md:px-6 [@media(max-height:500px)]:h-12">
        <span className="text-sm tabular-nums text-on-dark-soft" aria-live="polite">
          {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрити"
          data-autofocus
          className="-mr-1 flex h-11 w-11 items-center justify-center rounded-full bg-on-dark/10 transition-colors hover:bg-on-dark/20 active:bg-on-dark/25"
        >
          <X size={22} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-2 md:px-20"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {video ? (
          <div className="relative flex h-full w-full items-center justify-center">
            <video
              key={work.id}
              ref={videoRef}
              controls
              playsInline
              preload="metadata"
              poster={imageSrc(video.poster, 960)}
              width={video.width}
              height={video.height}
              className={`rounded-sm bg-black ${vertical ? 'h-full w-auto max-w-full' : 'h-auto max-h-full w-full'}`}
              style={{ aspectRatio: `${video.width} / ${video.height}`, objectFit: 'contain' }}
            >
              <source src={`/videos/${video.hevc}`} type='video/mp4; codecs="hvc1"' />
              <source src={`/videos/${video.h264}`} type="video/mp4" />
            </video>
            {soundBlocked && (
              <button
                type="button"
                onClick={onUnmute}
                className="btn absolute left-1/2 top-4 -translate-x-1/2 bg-on-dark px-5 text-dark shadow-lg"
              >
                <Volume2 size={18} aria-hidden="true" />
                Увімкнути звук
              </button>
            )}
          </div>
        ) : image ? (
          <img
            key={work.id}
            src={imageSrc(image.name, 960)}
            srcSet={imageSrcSet(image)}
            sizes="(min-width: 768px) 70vw, 100vw"
            width={image.width}
            height={image.height}
            alt={work.alt}
            className="h-auto max-h-full w-auto max-w-full rounded-sm object-contain"
          />
        ) : (
          <PlaceholderArt
            key={work.id}
            seed={work.media}
            className="h-full max-h-full w-auto max-w-full rounded-sm"
          />
        )}

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Попередня робота"
              className="absolute left-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-on-dark/20 transition-colors hover:bg-on-dark hover:text-dark md:flex"
            >
              <ChevronLeft size={22} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Наступна робота"
              className="absolute right-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-on-dark/20 transition-colors hover:bg-on-dark hover:text-dark md:flex"
            >
              <ChevronRight size={22} aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      {/* Опис і CTA завжди видно без прокрутки */}
      <div className="flex shrink-0 items-center gap-3 px-4 pb-3 pt-4 md:px-6 md:pb-5 [@media(max-height:500px)]:py-2">
        {count > 1 && (
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Попередня робота"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-on-dark/20 active:bg-on-dark/15 md:hidden"
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-on-dark-soft [@media(max-height:500px)]:hidden">
            {categoryLabel(work.category)}
          </p>
          <p className="truncate font-serif text-xl md:text-2xl">{work.title}</p>
          {work.credit && (
            <p className="line-clamp-2 text-xs leading-snug text-on-dark-soft [@media(max-height:500px)]:hidden">{work.credit}</p>
          )}
        </div>
        {work.instagram && (
          <a
            href={work.instagram}
            target="_blank"
            rel="noopener"
            aria-label="Пост в Instagram"
            className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-on-dark/20 transition-colors hover:bg-on-dark hover:text-dark sm:flex"
          >
            <InstagramIcon />
          </a>
        )}
        <a
          href={contacts.instagram.direct}
          target="_blank"
          rel="noopener"
          className="btn btn-primary hidden shrink-0 sm:inline-flex"
        >
          Хочу так само
          <ArrowUpRight size={18} aria-hidden="true" />
        </a>
        {count > 1 && (
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Наступна робота"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-on-dark/20 active:bg-on-dark/15 md:hidden"
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        )}
      </div>
      <div className="shrink-0 px-4 pb-4 sm:hidden">
        <a href={contacts.instagram.direct} target="_blank" rel="noopener" className="btn btn-primary w-full">
          Хочу так само
          <ArrowUpRight size={18} aria-hidden="true" />
        </a>
      </div>
    </div>
  )
}
