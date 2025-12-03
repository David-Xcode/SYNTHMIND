import Header from '@/components/Header'
import MobiusHero from '@/components/MobiusHero'
import About from '@/components/About'
import Services from '@/components/Services'
import Products from '@/components/Products'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Header />
      <MobiusHero />
      <About />
      <Services />
      <Products />
      <Contact />
      <Footer />
    </main>
  )
} 