import { ArrowUpRight, Phone } from 'lucide-react'
import { contacts } from '../data/siteData'
import { InstagramIcon, TelegramIcon } from './icons'

/** Кнопки запису: показуємо лише ті канали, які реально є */
export function ContactButtons({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <a href={contacts.instagram.direct} target="_blank" rel="noopener" className="btn btn-primary w-full justify-between px-6">
        <span className="flex items-center gap-3">
          <InstagramIcon />
          Написати в Direct
        </span>
        <ArrowUpRight size={18} aria-hidden="true" />
      </a>
      {contacts.telegram && (
        <a href={contacts.telegram.url} target="_blank" rel="noopener" className="btn btn-ghost w-full justify-between px-6">
          <span className="flex items-center gap-3">
            <TelegramIcon />
            Telegram
          </span>
          <ArrowUpRight size={18} aria-hidden="true" />
        </a>
      )}
      {contacts.phone && (
        <a href={`tel:${contacts.phone.tel}`} className="btn btn-ghost w-full justify-between px-6">
          <span className="flex items-center gap-3">
            <Phone size={20} strokeWidth={1.75} aria-hidden="true" />
            {contacts.phone.display}
          </span>
          <ArrowUpRight size={18} aria-hidden="true" />
        </a>
      )}
    </div>
  )
}
