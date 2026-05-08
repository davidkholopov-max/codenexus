export const dynamic = 'force-dynamic'

import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { Providers } from '@/lib/providers'
import type { Metadata } from 'next'

const locales = ['en', 'ru']

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://codenexus.app'

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const isRu = locale === 'ru'
  const title = isRu ? 'CodeNexus — Научись программировать' : 'CodeNexus — Learn to Code'
  const description = isRu
    ? 'Интерактивная платформа для изучения программирования. Python, JavaScript, Go, Java, C++, SQL и HTML/CSS с живым выполнением кода.'
    : 'Interactive coding education platform. Learn Python, JavaScript, Go, Java, C++, SQL, HTML/CSS with live code execution and real projects.'

  return {
    title: {
      default: title,
      template: '%s | CodeNexus',
    },
    description,
    keywords: isRu
      ? ['программирование', 'курсы', 'Python', 'JavaScript', 'обучение кодингу', 'CodeNexus']
      : ['coding', 'programming', 'learn to code', 'Python', 'JavaScript', 'education', 'CodeNexus'],
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        'en': `${BASE_URL}/en`,
        'ru': `${BASE_URL}/ru`,
      },
    },
    openGraph: {
      type: 'website',
      locale: isRu ? 'ru_RU' : 'en_US',
      alternateLocale: isRu ? 'en_US' : 'ru_RU',
      url: `${BASE_URL}/${locale}`,
      siteName: 'CodeNexus',
      title,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  if (!locales.includes(locale)) notFound()

  const messages = await getMessages()

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem storageKey="codenexus-theme">
        <Providers>
          {children}
        </Providers>
      </ThemeProvider>
    </NextIntlClientProvider>
  )
}
