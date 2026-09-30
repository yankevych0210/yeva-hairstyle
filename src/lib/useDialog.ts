import { useEffect, useRef, type RefObject } from 'react'
import { useScrollLock } from './useScrollLock'

const FOCUSABLE =
  'a[href], button:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"]), input, select, textarea'

/**
 * Спільна поведінка модальних шарів (меню, лайтбокс): блокування скролу,
 * Esc, focus-trap і повернення фокусу на елемент, що відкрив шар.
 * returnFocus — явний тригер: Safari не фокусує кнопку при кліку, тож activeElement там — body.
 */
export function useDialog(
  ref: RefObject<HTMLElement>,
  open: boolean,
  onClose: () => void,
  returnFocus?: RefObject<HTMLElement | null>,
) {
  const closeRef = useRef(onClose)
  useEffect(() => {
    closeRef.current = onClose
  })
  useScrollLock(open)

  useEffect(() => {
    if (!open) return
    const opener = returnFocus?.current ?? (document.activeElement as HTMLElement | null)
    const node = ref.current
    const first = node?.querySelector<HTMLElement>('[data-autofocus]') ?? node?.querySelector<HTMLElement>(FOCUSABLE)
    first?.focus({ preventScroll: true })

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeRef.current()
        return
      }
      if (e.key !== 'Tab' || !node) return
      const items = [...node.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null)
      if (!items.length) return
      const a = items[0]
      const z = items[items.length - 1]
      if (e.shiftKey && (document.activeElement === a || !node.contains(document.activeElement))) {
        e.preventDefault()
        z.focus()
      } else if (!e.shiftKey && document.activeElement === z) {
        e.preventDefault()
        a.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      opener?.focus({ preventScroll: true })
    }
  }, [open, ref, returnFocus])
}
