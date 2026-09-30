import type { CSSProperties } from 'react'

/** Затримка CSS-анімації hero: style={delay(160)} */
export const delay = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties
