'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { ChevronDown, CheckCircle, Circle, BookOpen, Code2, HelpCircle, Lock } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

type LessonType = 'theory' | 'exercise' | 'quiz'

interface Lesson {
  id: string
  slug: string
  titleEn: string
  titleRu: string
  type: LessonType
  completed: boolean
  xpReward: number
}

interface Chapter {
  id: string
  slug: string
  titleEn: string
  titleRu: string
  order: number
  lessons: Lesson[]
}

interface CourseSidebarProps {
  chapters: Chapter[]
  courseSlug: string
  activeLessonSlug: string
  locale: string
  onLessonClick?: () => void
}

const LESSON_ICONS: Record<LessonType, typeof BookOpen> = {
  theory: BookOpen,
  exercise: Code2,
  quiz: HelpCircle,
}

export function CourseSidebar({ chapters, courseSlug, activeLessonSlug, locale, onLessonClick }: CourseSidebarProps) {
  const t = useTranslations('learn')
  const isRu = locale === 'ru'
  const [openChapters, setOpenChapters] = useState<Set<string>>(new Set([chapters[0]?.id]))

  const totalLessons = chapters.flatMap((c) => c.lessons).length
  const completedLessons = chapters.flatMap((c) => c.lessons).filter((l) => l.completed).length
  const progressPct = Math.round((completedLessons / totalLessons) * 100)

  const toggleChapter = (id: string) => {
    setOpenChapters((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <aside className="w-full min-w-0 sm:w-72 shrink-0 border-r border-border bg-card flex flex-col h-full overflow-hidden pt-16 md:pt-0">
      {/* Progress header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-medium">{t('progress')}</span>
          <span className="text-muted-foreground">{completedLessons}/{totalLessons}</span>
        </div>
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      {/* Chapter list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {chapters.map((chapter) => {
          const isOpen = openChapters.has(chapter.id)
          const completedInChapter = chapter.lessons.filter((l) => l.completed).length
          const allDone = completedInChapter === chapter.lessons.length

          return (
            <div key={chapter.id}>
              {/* Chapter header */}
              <button
                onClick={() => toggleChapter(chapter.id)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-accent/50 transition-colors group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {allDone ? (
                    <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/40 shrink-0 flex items-center justify-center">
                      <span className="text-[8px] font-bold text-muted-foreground">{chapter.order}</span>
                    </div>
                  )}
                  <span className="text-sm font-medium truncate">
                    {isRu ? chapter.titleRu : chapter.titleEn}
                  </span>
                </div>
                <ChevronDown
                  className={cn(
                    'w-4 h-4 text-muted-foreground shrink-0 transition-transform',
                    isOpen && 'rotate-180'
                  )}
                />
              </button>

              {/* Lessons */}
              {isOpen && (
                <div className="ml-4 pl-3 border-l border-border mt-1 space-y-0.5">
                  {chapter.lessons.map((lesson) => {
                    const Icon = LESSON_ICONS[lesson.type]
                    const isActive = lesson.slug === activeLessonSlug

                    return (
                      <Link
                        key={lesson.id}
                        href={`/${locale}/learn/${courseSlug}?lesson=${lesson.slug}`}
                        onClick={onLessonClick}
                        className={cn(
                          'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all',
                          isActive
                            ? 'bg-primary/15 text-primary font-medium'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                        )}
                      >
                        {lesson.completed ? (
                          <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                        ) : (
                          <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-primary' : '')} />
                        )}
                        <span className="truncate flex-1">
                          {isRu ? lesson.titleRu : lesson.titleEn}
                        </span>
                        {lesson.xpReward > 0 && (
                          <span className="text-[10px] text-amber-500 shrink-0">+{lesson.xpReward}</span>
                        )}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </aside>
  )
}
