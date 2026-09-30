import { useRef, useState, type MouseEvent } from 'react'
import { flushSync } from 'react-dom'
import { workCategories } from '../data/siteData'
import type { Work } from '../types'
import { Lightbox } from './Lightbox'

const categoryLabel = (id: string) => workCategories.find((c) => c.id === id)?.label ?? ''

/**
 * Лайтбокс для набору робіт. open() рендерить відео синхронно (flushSync), щоб play() зі звуком
 * викликався в межах жесту користувача (вимога Safari). Якщо браузер не дає звук — граємо без
 * нього й показуємо кнопку «Увімкнути звук».
 */
export function useMediaViewer(items: Work[]) {
  const [index, setIndex] = useState<number | null>(null)
  const [soundBlocked, setSoundBlocked] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

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

  const open = (i: number) => (e: MouseEvent<HTMLElement>) => {
    triggerRef.current = e.currentTarget
    openAt(i)
  }

  const viewer = (
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
  )

  return { open, viewer, categoryLabel }
}
