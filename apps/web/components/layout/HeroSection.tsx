'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, Users, BookOpen, Code2 } from 'lucide-react'
import { useSession } from 'next-auth/react'

const CODE_PREVIEW = `# Your first Python program
name = "World"
print(f"Hello, {name}! 🚀")

# Let's solve something real
numbers = [1, 2, 3, 4, 5]
total = sum(numbers)
print(f"Sum: {total}")  # Output: Sum: 15`

export function HeroSection({ locale }: { locale: string }) {
  const t = useTranslations('home.hero')
  const { data: session } = useSession()
  const ctaHref = session ? `/${locale}/dashboard` : `/${locale}/login`

  const stats = [
    { value: '50K+', label: t('stats.learners'), icon: Users },
    { value: '12', label: t('stats.courses'), icon: BookOpen },
    { value: '500+', label: t('stats.exercises'), icon: Code2 },
  ]

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-nexus-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                <Zap className="w-3.5 h-3.5" />
                {t('badge')}
              </span>
            </motion.div>

            {/* Headline */}
            <div className="space-y-2">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
                {t('title')}
                <br />
                <span className="gradient-text">{t('titleHighlight')}</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
                {t('subtitle')}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link
                href={ctaHref}
                className="group flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 animate-pulse-glow"
              >
                {t('cta')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href={`/${locale}/courses`}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold border border-border bg-card hover:bg-accent/50 transition-colors"
              >
                {t('ctaSecondary')}
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-4">
              {stats.map(({ value, label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-bold text-lg leading-none">{value}</div>
                    <div className="text-xs text-muted-foreground">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Code Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl shadow-black/20">
              {/* Editor header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-card border-b border-border">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs text-muted-foreground font-mono ml-2">main.py</span>
                <div className="ml-auto flex items-center gap-1.5">
                  <span className="lang-badge border-nexus-500/30 bg-nexus-500/10 text-nexus-400">
                    🐍 Python
                  </span>
                </div>
              </div>

              {/* Code content */}
              <div className="bg-[hsl(240,21%,10%)] p-6 font-mono text-sm">
                <pre className="text-code-text leading-relaxed">
                  {CODE_PREVIEW.split('\n').map((line, i) => (
                    <div key={i} className="flex">
                      <span className="w-8 text-code-comment select-none text-right pr-4 shrink-0">
                        {i + 1}
                      </span>
                      <SyntaxHighlightedLine line={line} />
                    </div>
                  ))}
                </pre>
              </div>

              {/* Output panel */}
              <div className="bg-[hsl(240,21%,8%)] border-t border-border px-6 py-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Output
                </div>
                <div className="font-mono text-sm text-green-400">
                  <div>Hello, World! 🚀</div>
                  <div>Sum: 15</div>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-4 -right-4 bg-card border border-border rounded-xl px-3 py-2 shadow-lg"
            >
              <div className="flex items-center gap-2 text-sm">
                <span>🏆</span>
                <span className="font-semibold">+10 XP</span>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [4, -4, 4] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-4 -left-4 bg-card border border-border rounded-xl px-3 py-2 shadow-lg"
            >
              <div className="flex items-center gap-2 text-sm">
                <span>🔥</span>
                <span className="font-semibold">7 day streak</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function SyntaxHighlightedLine({ line }: { line: string }) {
  if (line.startsWith('#')) {
    return <span className="text-code-comment">{line}</span>
  }

  return (
    <span>
      {line
        .replace(/(print|sum|f|len)/g, '<fn>$1</fn>')
        .replace(/(=)/g, '<op>$1</op>')
        .split(/(<fn>.*?<\/fn>|<op>.*?<\/op>)/g)
        .map((part, i) => {
          if (part.startsWith('<fn>'))
            return <span key={i} className="text-code-function">{part.slice(4, -5)}</span>
          if (part.startsWith('<op>'))
            return <span key={i} className="text-code-keyword">{part.slice(4, -5)}</span>
          if (/^["'].*["']$/.test(part.trim()))
            return <span key={i} className="text-code-string">{part}</span>
          if (/^\d+$/.test(part.trim()))
            return <span key={i} className="text-code-number">{part}</span>
          return <span key={i}>{part}</span>
        })}
    </span>
  )
}
