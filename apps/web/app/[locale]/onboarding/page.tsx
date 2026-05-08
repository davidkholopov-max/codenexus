'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Check, Code2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Goal = 'web' | 'mobile' | 'data' | 'backend' | 'automation' | 'games'
type Language = 'python' | 'javascript' | 'go' | 'java' | 'cpp' | 'sql' | 'html'
type DailyGoal = 'casual' | 'regular' | 'serious' | 'intense'

const GOAL_RECOMMENDATIONS: Record<Goal, Language> = {
  web: 'javascript',
  mobile: 'java',
  data: 'python',
  backend: 'go',
  automation: 'python',
  games: 'cpp',
}

const COURSE_SLUGS: Record<Language, string> = {
  python: 'python-basics',
  javascript: 'javascript-basics',
  go: 'go-fundamentals',
  java: 'java-fundamentals',
  cpp: 'cpp-fundamentals',
  sql: 'sql-basics',
  html: 'html-css',
}

const LANGUAGES: { value: Language; icon: string; label: string }[] = [
  { value: 'python', icon: '🐍', label: 'Python' },
  { value: 'javascript', icon: '⚡', label: 'JavaScript' },
  { value: 'go', icon: '🐹', label: 'Go' },
  { value: 'java', icon: '☕', label: 'Java' },
  { value: 'cpp', icon: '⚙️', label: 'C++' },
  { value: 'sql', icon: '🗄️', label: 'SQL' },
  { value: 'html', icon: '🌐', label: 'HTML/CSS' },
]

export default function OnboardingPage() {
  const t = useTranslations('onboarding')
  const locale = useLocale()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null)
  const [selectedGoalTime, setSelectedGoalTime] = useState<DailyGoal | null>(null)

  const recommendedLanguage = selectedGoal ? GOAL_RECOMMENDATIONS[selectedGoal] : null

  const handleFinish = async () => {
    await fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: selectedLanguage,
        dailyGoal: selectedGoalTime,
      }),
    })
    const courseSlug = selectedLanguage ? COURSE_SLUGS[selectedLanguage] : 'python-basics'
    router.push(`/${locale}/learn/${courseSlug}`)
  }

  const GOALS: { value: Goal; icon: string; key: string }[] = [
    { value: 'web', icon: '🌐', key: 'web' },
    { value: 'mobile', icon: '📱', key: 'mobile' },
    { value: 'data', icon: '📊', key: 'data' },
    { value: 'backend', icon: '⚙️', key: 'backend' },
    { value: 'automation', icon: '🤖', key: 'automation' },
    { value: 'games', icon: '🎮', key: 'games' },
  ]

  const DAILY_GOALS: { value: DailyGoal; key: string; minutes: string }[] = [
    { value: 'casual', key: 'casual', minutes: '15' },
    { value: 'regular', key: 'regular', minutes: '30' },
    { value: 'serious', key: 'serious', minutes: '60' },
    { value: 'intense', key: 'intense', minutes: '120+' },
  ]

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            <Code2 className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all',
                  s < step ? 'bg-primary text-primary-foreground' :
                  s === step ? 'bg-primary/20 text-primary border-2 border-primary' :
                  'bg-muted text-muted-foreground'
                )}
              >
                {s < step ? <Check className="w-4 h-4" /> : s}
              </div>
              {s < 3 && <div className={cn('w-12 h-0.5', s < step ? 'bg-primary' : 'bg-border')} />}
            </div>
          ))}
        </div>

        {/* Steps */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-card border border-border rounded-2xl p-6"
            >
              <h2 className="font-semibold text-lg mb-4">{t('step1.title')}</h2>
              <div className="grid grid-cols-2 gap-3">
                {GOALS.map(({ value, icon, key }) => (
                  <button
                    key={value}
                    onClick={() => setSelectedGoal(value)}
                    className={cn(
                      'flex items-center gap-3 p-4 rounded-xl border text-sm font-medium text-left transition-all',
                      selectedGoal === value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/40 hover:bg-accent/30'
                    )}
                  >
                    <span className="text-2xl">{icon}</span>
                    {t(`step1.${key}` as any)}
                  </button>
                ))}
              </div>
              <button
                disabled={!selectedGoal}
                onClick={() => setStep(2)}
                className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-50 hover:bg-primary/90 transition-colors"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-card border border-border rounded-2xl p-6"
            >
              <h2 className="font-semibold text-lg mb-4">{t('step2.title')}</h2>
              <div className="grid grid-cols-2 gap-3">
                {LANGUAGES.map(({ value, icon, label }) => (
                  <button
                    key={value}
                    onClick={() => setSelectedLanguage(value)}
                    className={cn(
                      'relative flex items-center gap-3 p-4 rounded-xl border text-sm font-medium text-left transition-all',
                      selectedLanguage === value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/40 hover:bg-accent/30'
                    )}
                  >
                    <span className="text-2xl">{icon}</span>
                    <span>{label}</span>
                    {value === recommendedLanguage && (
                      <span className="absolute top-1 right-2 text-[10px] text-primary font-medium">
                        ★ {t('step2.recommendation')}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <button
                disabled={!selectedLanguage}
                onClick={() => setStep(3)}
                className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-50 hover:bg-primary/90 transition-colors"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-card border border-border rounded-2xl p-6"
            >
              <h2 className="font-semibold text-lg mb-4">{t('step3.title')}</h2>
              <div className="space-y-3">
                {DAILY_GOALS.map(({ value, key, minutes }) => (
                  <button
                    key={value}
                    onClick={() => setSelectedGoalTime(value)}
                    className={cn(
                      'w-full flex items-center justify-between p-4 rounded-xl border text-sm font-medium transition-all',
                      selectedGoalTime === value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/40 hover:bg-accent/30'
                    )}
                  >
                    <span>{t(`step3.${key}` as any)}</span>
                    <span className="text-muted-foreground text-xs">{minutes} min</span>
                  </button>
                ))}
              </div>
              <button
                disabled={!selectedGoalTime}
                onClick={handleFinish}
                className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-base disabled:opacity-50 hover:bg-primary/90 transition-colors"
              >
                🚀 {t('finish')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
