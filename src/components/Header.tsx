import { useEffect, useRef, useState, type RefObject } from 'react'
import { ArrowUpRight, X } from 'lucide-react'
import { contacts, location } from '../data/siteData'
import { visibleNav } from '../lib/sections'
import { useDialog } from '../lib/useDialog'
import { InstagramIcon } from './icons'
import { Wordmark } from './Wordmark'

export function Header() {
  // top — прозора над hero; hero — темне скло над hero; page — кремове скло нижче
  const [mode, setMode] = useState<'top' | 'hero' | 'page'>('top')
  const [open, setOpen] = useState(false)
  const burgerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById('top')
      const edge = (hero?.offsetHeight ?? 0) - 72
      const y = Math.max(0, window.scrollY) // iOS: від'ємний scrollY при «гумовому» відскоку
      // Активна з першого пікселя прокрутки
      setMode(y <= 0 ? 'top' : y < edge ? 'hero' : 'page')
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow,color] duration-500 ease-soft ${
          mode === 'page'
            ? 'bg-bg/85 text-ink shadow-[0_1px_0_rgb(var(--c-line)/0.7)] backdrop-blur-md'
            : mode === 'hero'
              ? 'on-dark bg-dark/60 text-on-dark backdrop-blur-md'
              : 'on-dark bg-transparent text-on-dark'
        }`}
        style={{ paddingTop: 'var(--safe-t)' }}
      >
        <div className="container-page flex h-[var(--header-h)] items-center justify-between gap-4">
          <a href="#top" className="-m-2 flex min-h-[44px] items-center p-2" aria-label="Yeva Hairstyle — на початок">
            <Wordmark />
          </a>

          <nav aria-label="Основне меню" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {visibleNav.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    className="relative flex min-h-[44px] items-center px-3.5 text-[0.9375rem] font-medium opacity-75 transition-opacity hover:opacity-100"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a href="#booking" className="btn btn-primary hidden min-h-[44px] px-5 text-sm xs:inline-flex">
              Записатися
            </a>
            <button
              ref={burgerRef}
              type="button"
              className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full lg:hidden"
              aria-label="Відкрити меню"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen(true)}
            >
              <span aria-hidden="true" className="flex w-6 flex-col gap-[7px]">
                <span className="h-[1.5px] w-full rounded bg-current" />
                <span className="ml-auto h-[1.5px] w-4 rounded bg-current" />
              </span>
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={open} onClose={() => setOpen(false)} returnFocus={burgerRef} />
    </>
  )
}

function MobileMenu({
  open,
  onClose,
  returnFocus,
}: {
  open: boolean
  onClose: () => void
  returnFocus: RefObject<HTMLElement | null>
}) {
  const ref = useRef<HTMLDivElement>(null)
  useDialog(ref, open, onClose, returnFocus)

  return (
    <div
      ref={ref}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Меню"
      className={`on-dark fixed inset-0 z-50 flex flex-col bg-dark text-on-dark transition-[opacity,visibility] duration-500 ease-soft lg:hidden ${
        open ? 'visible opacity-100' : 'invisible opacity-0'
      }`}
      style={{
        paddingTop: 'var(--safe-t)',
        paddingBottom: 'max(24px, var(--safe-b))',
      }}
    >
      <div className="container-page flex h-[var(--header-h)] shrink-0 items-center justify-between">
        <Wordmark />
        <button
          type="button"
          className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full active:bg-on-dark/10"
          aria-label="Закрити меню"
          onClick={onClose}
          data-autofocus
        >
          <X size={24} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>

      <nav aria-label="Мобільне меню" className="container-page flex flex-1 flex-col justify-center overflow-y-auto py-6">
        <ol className="space-y-1">
          {visibleNav.map((n, i) => (
            <li
              key={n.id}
              className={`transition-[opacity,transform] duration-700 ease-out ${open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
              style={{ transitionDelay: open ? `${80 + i * 45}ms` : '0ms' }}
            >
              <a
                href={`#${n.id}`}
                onClick={onClose}
                className="group flex min-h-[56px] items-baseline gap-4 py-1 active:opacity-60"
              >
                <span className="w-6 text-xs font-semibold tabular-nums text-on-dark-soft">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-serif text-[2.4rem] font-medium leading-tight xs:text-[2.75rem]">{n.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="container-page shrink-0 space-y-5">
        <a href={contacts.instagram.direct} target="_blank" rel="noopener" className="btn btn-primary w-full" onClick={onClose}>
          Записатися в Direct
          <ArrowUpRight size={18} aria-hidden="true" />
        </a>
        <div className="flex items-center justify-between text-sm text-on-dark-soft">
          <a
            href={contacts.instagram.url}
            target="_blank"
            rel="noopener"
            className="-m-2 flex min-h-[44px] items-center gap-2 p-2 active:text-on-dark"
          >
            <InstagramIcon width={18} height={18} />@{contacts.instagram.handle}
          </a>
          <span>{location.city}</span>
        </div>
      </div>
    </div>
  )
}
