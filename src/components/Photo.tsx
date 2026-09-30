import { getImage, imageSrc, imageSrcSet } from '../lib/media'
import { PlaceholderArt, type Tone } from './PlaceholderArt'

interface PhotoProps {
  /** Ім'я зображення в media.gen.json. Якщо файлу ще немає — плейсхолдер */
  name?: string
  alt: string
  sizes: string
  /** CSS aspect-ratio обгортки, напр. '4 / 5'. Без нього — пропорції самого фото */
  aspect?: string
  priority?: boolean
  tone?: Tone
  className?: string
  imgClassName?: string
  /** span — для використання всередині тексту (<p>) */
  as?: 'div' | 'span'
}

export function Photo({ name, alt, sizes, aspect, priority, tone, className = '', imgClassName = '', as: Tag = 'div' }: PhotoProps) {
  const img = getImage(name)
  const ratio = aspect ?? (img ? `${img.width} / ${img.height}` : '4 / 5')

  return (
    <Tag className={`relative block overflow-hidden bg-sand ${className}`} style={{ aspectRatio: ratio }}>
      {img ? (
        <img
          src={imageSrc(img.name, 960)}
          srcSet={imageSrcSet(img)}
          sizes={sizes}
          width={img.width}
          height={img.height}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          // React 18 не знає fetchPriority у camelCase — передаємо атрибут як є
          {...(priority ? { fetchpriority: 'high' } : {})}
          className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`}
        />
      ) : (
        <PlaceholderArt
          seed={name ?? alt}
          tone={tone}
          className={`absolute inset-0 h-full w-full ${imgClassName}`}
        />
      )}
    </Tag>
  )
}
