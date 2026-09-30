import { brand, contacts } from '../data/siteData'
import { visibleNav } from '../lib/sections'
import { InstagramIcon, TelegramIcon } from './icons'
import { Wordmark } from './Wordmark'

export function Footer() {
  return (
    <footer
      className="on-dark bg-dark text-on-dark"
      style={{ paddingBottom: 'max(28px, var(--safe-b))' }}
    >
      <div className="container-page grid gap-12 pt-16 md:grid-cols-12 md:pt-20">
        <div className="md:col-span-5">
          <Wordmark className="text-on-dark" />
          <p className="mt-4 max-w-[22rem] text-[0.9375rem] leading-relaxed text-on-dark-soft">
            Зачіски та укладання в Кременчуці.
          </p>
        </div>

        <nav aria-label="Навігація у футері" className="md:col-span-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-on-dark-soft">Розділи</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 md:grid-cols-1">
            {visibleNav.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} className="flex min-h-[44px] items-center hover:text-sand">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-on-dark-soft">Контакти</p>
          <ul className="mt-4">
            <li>
              <a href={contacts.instagram.url} target="_blank" rel="noopener" className="flex min-h-[44px] items-center gap-3 hover:text-sand">
                <InstagramIcon width={18} height={18} />@{contacts.instagram.handle}
              </a>
            </li>
            {contacts.telegram && (
              <li>
                <a href={contacts.telegram.url} target="_blank" rel="noopener" className="flex min-h-[44px] items-center gap-3 hover:text-sand">
                  <TelegramIcon width={18} height={18} />@{contacts.telegram.handle}
                </a>
              </li>
            )}
            {contacts.phone && (
              <li>
                <a href={`tel:${contacts.phone.tel}`} className="flex min-h-[44px] items-center hover:text-sand">
                  {contacts.phone.display}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="container-page mt-14">
        <div className="flex flex-col gap-2 border-t border-on-dark/15 pt-6 text-sm text-on-dark-soft sm:flex-row sm:justify-between">
          <p>
          © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {brand.name}
          </p>
          <p>{brand.tagline}</p>
        </div>
      </div>
    </footer>
  )
}
