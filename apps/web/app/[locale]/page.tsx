import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { HeroSection } from '@/components/layout/HeroSection'
import { FeaturesSection } from '@/components/layout/FeaturesSection'
import { LanguagesSection } from '@/components/layout/LanguagesSection'
import { CTASection } from '@/components/layout/CTASection'
import { Footer } from '@/components/layout/Footer'
import type { Metadata } from 'next'

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const isRu = locale === 'ru'
  return {
    title: isRu ? 'Научись программировать интерактивно' : 'Learn to Code Interactively',
    description: isRu
      ? 'CodeNexus — платформа с живым выполнением кода. Python, JavaScript, Go, Java, C++, SQL, HTML/CSS. Учись практикуясь.'
      : 'CodeNexus — code runs live in the browser. Python, JavaScript, Go, Java, C++, SQL, HTML/CSS. Learn by doing.',
  }
}

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection locale={locale} />
        <FeaturesSection />
        <LanguagesSection locale={locale} />
        <CTASection locale={locale} />
      </main>
      <Footer locale={locale} />
    </div>
  )
}
