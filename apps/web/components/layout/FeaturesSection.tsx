'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Code2, GitBranch, Globe2, Trophy, Languages, Terminal } from 'lucide-react'

const features = [
  { key: 'interactive', icon: Code2, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { key: 'structured', icon: GitBranch, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { key: 'multilang', icon: Globe2, color: 'text-green-400', bg: 'bg-green-400/10' },
  { key: 'progress', icon: Trophy, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  { key: 'community', icon: Languages, color: 'text-pink-400', bg: 'bg-pink-400/10' },
  { key: 'setup', icon: Terminal, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
] as const

export function FeaturesSection() {
  const t = useTranslations('home.features')

  return (
    <section className="py-24 bg-card/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('title')}</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ key, icon: Icon, color, bg }, index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/30 hover:bg-card/80 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <h3 className="font-semibold text-lg mb-2">{t(`${key}.title` as any)}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t(`${key}.description` as any)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
