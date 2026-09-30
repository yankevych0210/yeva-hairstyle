import { useEffect } from 'react'
import { initReveal } from './lib/reveal'
import { visible } from './lib/sections'
import { About } from './components/About'
import { Booking } from './components/Booking'
import { Duo } from './components/Duo'
import { Faq } from './components/Faq'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { InstagramBlock } from './components/InstagramBlock'
import { Marquee } from './components/Marquee'
import { Prices } from './components/Prices'
import { Reviews } from './components/Reviews'
import { Services } from './components/Services'
import { Works } from './components/Works'

export default function App() {
  useEffect(() => {
    initReveal()
  }, [])

  return (
    <>
      <a href="#main" className="skip-link">
        Перейти до змісту
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Marquee />
        <About />
        {visible.services && <Services />}
        {visible.duo && <Duo />}
        <Works />
        {visible.prices && <Prices />}
        {visible.reviews && <Reviews />}
        <Booking />
        {visible.faq && <Faq />}
        <InstagramBlock />
      </main>
      <Footer />
    </>
  )
}
