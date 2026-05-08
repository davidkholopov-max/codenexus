'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { useDashboard } from '@/lib/hooks/useDashboard'
import { LANGUAGE_ICONS, cn } from '@/lib/utils'
import { Flame, Trophy, BookOpen, Zap, ArrowRight, Star, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { EmailVerifyBanner } from '@/components/layout/EmailVerifyBanner'

const RARITY_ORDER = ['legendary', 'epic', 'rare', 'common']

export default function DashboardPage() {
  const t = useTranslations('dashboard')
  const locale = useLocale()
  const isRu = locale === 'ru'
  const router = useRouter()
  const { status } = useSession()
  const { data, isLoading } = useDashboard()

  useEffect(() => {
    if (status === 'unauthenticated') router.push(`/${locale}/login`)
  }, [status])

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const { user, currentCourse, recentActivity, achievements } = data

  const stats = [
    { label: t('todayStreak'), value: `${user.streak}${t('streakUnit')}`, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: t('totalXP'), value: user.xp.toLocaleString(), icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: t('coursesCompleted'), value: `${user.coursesCompleted}`, icon: Trophy, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  ]

  const sortedAchievements = [...achievements].sort(
    (a, b) => (b.earned ? 1 : 0) - (a.earned ? 1 : 0) || RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity)
  )

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <EmailVerifyBanner />
        <main className="container mx-auto px-4 py-8 pb-12 max-w-5xl">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">
            {t('greeting', { name: user.name })}
          </h1>
          <p className="text-muted-foreground text-sm">{t('subtitle')} 🚀</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {stats.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
              <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shrink-0', bg)}>
                <Icon className={cn('w-6 h-6', color)} />
              </div>
              <div>
                <div className="text-2xl font-bold leading-none">{value}</div>
                <div className="text-xs text-muted-foreground mt-1">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-3 gap-6 items-start">
          {/* Left column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Current course */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-semibold text-lg mb-4">{t('currentCourse')}</h2>
              {currentCourse ? (
                <div className="flex items-start gap-4">
                  <span className="text-4xl shrink-0 mt-0.5">
                    {LANGUAGE_ICONS[currentCourse.slug.split('-')[0]] ?? '📚'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base">
                      {isRu ? currentCourse.titleRu : currentCourse.titleEn}
                    </h3>
                    <div className="mt-3 mb-1 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{t('progress')}</span>
                      <span className="font-medium">{currentCourse.progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{ width: `${currentCourse.progress}%` }} />
                    </div>
                    {currentCourse.nextLesson ? (
                      <Link
                        href={`/${locale}/learn/${currentCourse.slug}?lesson=${currentCourse.nextLesson.slug}`}
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                      >
                        <BookOpen className="w-4 h-4" />
                        {isRu ? currentCourse.nextLesson.titleRu : currentCourse.nextLesson.titleEn}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 text-green-400 text-sm font-semibold border border-green-500/20">
                        ✅ {t('courseComplete')}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p className="mb-4 text-sm">{t('noCourse')}</p>
                  <Link
                    href={`/${locale}/courses`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    {t('browseCourses')} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* Recent activity */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-semibold text-lg mb-4">{t('recentActivity')}</h2>
              {recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">{t('noActivity')}</p>
              ) : (
                <div className="space-y-3">
                  {recentActivity.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="font-medium truncate block">
                          {isRu ? item.lessonTitleRu : item.lessonTitleEn}
                        </span>
                      </div>
                      <span className="xp-badge shrink-0">+{item.xpEarned} XP</span>
                      <span className="text-xs text-muted-foreground shrink-0 w-20 text-right">
                        {item.completedAt ? timeAgo(item.completedAt, isRu) : ''}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-card border border-border rounded-2xl p-6 h-full">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              {t('achievements')}
              <Star className="w-4 h-4 text-amber-500" />
            </h2>
            {sortedAchievements.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">{t('noAchievements')}</p>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {sortedAchievements.map((ach) => (
                  <div
                    key={ach.slug}
                    title={isRu ? ach.titleRu : ach.titleEn}
                    className={cn(
                      'flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-center transition-all',
                      ach.earned
                        ? 'border-primary/30 bg-primary/5'
                        : 'border-border opacity-40 grayscale'
                    )}
                  >
                    <span className="text-2xl">{ach.icon}</span>
                    <span className="text-[10px] font-medium leading-tight">
                      {isRu ? ach.titleRu : ach.titleEn}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        </main>
      </div>
    </div>
  )
}

function timeAgo(iso: string, isRu: boolean): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return isRu ? 'только что' : 'just now'
  if (m < 60) return isRu ? `${m} мин назад` : `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return isRu ? `${h} ч назад` : `${h}h ago`
  const d = Math.floor(h / 24)
  if (d === 1) return isRu ? 'вчера' : 'yesterday'
  return isRu ? `${d} д назад` : `${d}d ago`
}
