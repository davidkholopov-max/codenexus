'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { BookOpen, Code2, Zap, Lock, ArrowRight } from 'lucide-react'
import { LANGUAGE_ICONS, LANGUAGE_COLORS, cn } from '@/lib/utils'

interface CourseCardProps {
  course: {
    id: string
    slug: string
    language: string
    titleEn: string
    titleRu: string
    descriptionEn: string
    descriptionRu: string
    level: number
    lessonsCount: number
    exercisesCount: number
    totalXP: number
    isPublished: boolean
    completionPercent: number
    isSpecialization?: boolean
    parentTitleEn?: string | null
    parentTitleRu?: string | null
  }
  locale: string
}

export function CourseCard({ course, locale }: CourseCardProps) {
  const t = useTranslations('courses.card')
  const isRu = locale === 'ru'
  const title = isRu ? course.titleRu : course.titleEn
  const description = isRu ? course.descriptionRu : course.descriptionEn
  const icon = LANGUAGE_ICONS[course.language] || '📄'
  const color = LANGUAGE_COLORS[course.language] || '#888'
  const isStarted = course.completionPercent > 0
  const isCompleted = course.completionPercent === 100

  return (
    <div
      className={cn(
        'group relative flex flex-col rounded-2xl border border-border bg-card overflow-hidden',
        'hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300',
        !course.isPublished && 'opacity-70'
      )}
    >
      {/* Header */}
      <div
        className="p-6 pb-4"
        style={{ background: `linear-gradient(135deg, ${color}10, transparent)` }}
      >
        <div className="flex items-start justify-between mb-3">
          <span className="text-4xl">{icon}</span>
          <div className="flex flex-col items-end gap-1.5">
            {course.isSpecialization && (
              <span className="text-[10px] font-semibold tracking-wide uppercase text-purple-500 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
                Specialization
              </span>
            )}
            {!course.isPublished && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                <Lock className="w-3 h-3" />
                Coming Soon
              </span>
            )}
            {isCompleted && (
              <span className="text-xs font-medium text-green-500 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-full">
                ✓ {t('completed')}
              </span>
            )}
          </div>
        </div>
        {course.isSpecialization && course.parentTitleEn && (
          <p className="text-[11px] text-muted-foreground mb-1.5">
            Requires: {isRu ? (course.parentTitleRu ?? course.parentTitleEn) : course.parentTitleEn}
          </p>
        )}
        <h3 className="font-bold text-lg leading-tight mb-1">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">{description}</p>
      </div>

      {/* Progress bar */}
      {isStarted && (
        <div className="px-6">
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${course.completionPercent}%` }} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">{course.completionPercent}% complete</p>
        </div>
      )}

      {/* Stats */}
      <div className="px-6 py-4 flex items-center gap-4 text-sm text-muted-foreground border-t border-border mt-auto">
        <span className="flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" />
          {course.lessonsCount} {t('lessons')}
        </span>
        <span className="flex items-center gap-1.5">
          <Code2 className="w-3.5 h-3.5" />
          {course.exercisesCount} {t('exercises')}
        </span>
        <span className="xp-badge ml-auto">
          <Zap className="w-3 h-3" />
          {course.totalXP} XP
        </span>
      </div>

      {/* CTA */}
      {course.isPublished && (
        <div className="px-6 pb-6">
          <Link
            href={`/${locale}/learn/${course.slug}`}
            className="group/btn w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200"
            style={{
              background: `linear-gradient(135deg, ${color}20, ${color}10)`,
              border: `1px solid ${color}30`,
              color,
            }}
          >
            {isStarted ? t('continueCourse') : t('startCourse')}
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}
    </div>
  )
}
