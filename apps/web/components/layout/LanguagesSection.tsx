'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { LANGUAGE_COLORS, LANGUAGE_ICONS } from '@/lib/utils'

const LANGUAGES = [
  { key: 'python', slug: 'python', level: 'Beginner friendly' },
  { key: 'javascript', slug: 'javascript', level: 'Beginner friendly' },
  { key: 'go', slug: 'go', level: 'Intermediate' },
  { key: 'java', slug: 'java', level: 'Intermediate' },
  { key: 'cpp', slug: 'cpp', level: 'Advanced' },
  { key: 'sql', slug: 'sql', level: 'Beginner friendly' },
  { key: 'htmlcss', slug: 'html', level: 'Beginner friendly' },
] as const

export function LanguagesSection({ locale }: { locale: string }) {
  const t = useTranslations('home.languages')

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-4"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('title')}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">{t('subtitle')}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-12">
          {LANGUAGES.map(({ key, slug, level }, index) => {
            const icon = LANGUAGE_ICONS[slug] || LANGUAGE_ICONS['html'] || '📄'
            const color = LANGUAGE_COLORS[slug] || '#888'

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <Link
                  href={`/${locale}/courses?lang=${slug}`}
                  className="group block p-5 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{icon}</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="font-semibold text-base mb-1 capitalize">
                    {slug === 'html' ? 'HTML & CSS' : slug.charAt(0).toUpperCase() + slug.slice(1)}
                  </h3>
                  <p className="text-muted-foreground text-xs leading-relaxed mb-3">
                    {t(`${key}.description` as any)}
                  </p>
                  <div
                    className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ color, backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
                  >
                    {level}
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
