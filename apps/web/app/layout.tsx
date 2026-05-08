import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import '../styles/globals.css'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'CodeNexus — Learn to Code',
    template: '%s | CodeNexus',
  },
  description: 'Interactive coding education platform. Learn Python, JavaScript, Go, Java, C++, SQL and more.',
  keywords: ['coding', 'programming', 'learn to code', 'Python', 'JavaScript', 'education'],
  authors: [{ name: 'CodeNexus' }],
  creator: 'CodeNexus',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'CodeNexus',
    title: 'CodeNexus — Learn to Code',
    description: 'Interactive coding education platform',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CodeNexus — Learn to Code',
    description: 'Interactive coding education platform',
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.webmanifest',
}

export const viewport: Viewport = {
  themeColor: '#6366f1',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
