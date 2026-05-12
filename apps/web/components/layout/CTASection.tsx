'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useSession } from 'next-auth/react'

export function CTASection({ locale }: { locale: string }) {
  const t = useTranslations('home.cta')
  const { data: session } = useSession()
  const ctaHref = session ? `/${locale}/dashboard` : `/${locale}/login`

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-card to-accent/20 border border-border p-12 md:p-20 text-center"
        >
          {/* Background orbs */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold">{t('title')}</h2>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">{t('subtitle')}</p>
            <Link
              href={ctaHref}
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:shadow-xl hover:shadow-primary/25"
            >
              {t('button')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
