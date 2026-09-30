import manifest from '../data/media.gen.json'
import type { ImageAsset, MediaManifest, VideoAsset } from '../types'

const m = manifest as MediaManifest

export const IMAGE_WIDTHS = [480, 960] as const

export function getImage(name: string | undefined): ImageAsset | null {
  if (!name) return null
  const entry = m.images[name]
  return entry ? { name, ...entry } : null
}

export function getVideo(name: string): VideoAsset | null {
  const entry = m.videos[name]
  return entry ? { name, ...entry } : null
}

export function imageSrc(name: string, w: (typeof IMAGE_WIDTHS)[number]) {
  return `/images/${name}-${w}.webp`
}

export function imageSrcSet(name: string) {
  return IMAGE_WIDTHS.map((w) => `${imageSrc(name, w)} ${w}w`).join(', ')
}
